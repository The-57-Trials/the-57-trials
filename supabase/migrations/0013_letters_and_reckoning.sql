-- 0013: THE SEALED LETTER (doc 18.1) and THE RECKONING (doc 18.7, D14) —
-- the flagship mechanic of the product. Trial 01 and Trial 09 write a letter
-- that is genuinely unreadable, even to its own author, until Trial 53 breaks
-- both seals.
--
-- Scoping note: doc 22.1 finding 5 proposes Trial 01 be completed *inside
-- signup*, before the Entry Pass is paid, so the register reads 1/57 before
-- the first payment prompt. That would mean reworking the paywall gate in
-- Run.tsx (currently a hard `if (!profile.entry_paid) return <pay-wall>`)
-- and touching entry_paid handling in clear_trial / get_trial_body — both
-- security-critical paths this migration deliberately leaves untouched.
-- Trial 01 here is the first trial a paying member does, immediately after
-- Trial 05's Circuit prompt is behind them — same mechanic, same content,
-- one payment gate later than the ideal in the storyboard. Moving it earlier
-- is real, separable follow-up work, not bundled in here.

-- ---------- letters ----------
-- One row per member per letter trial (1, 9). Immutable once written: no
-- update path exists anywhere, only insert (seal_letter) and delete
-- (submit_reckoning, on RELEASE — "destroyed, not hidden").

create table public.letters (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  trial_num  integer not null check (trial_num in (1, 9)),
  typeface   text not null check (typeface in ('typewriter', 'handwriting')),
  body       text not null check (length(btrim(body)) >= 40 and length(btrim(body)) <= 4000),
  sealed_at  timestamptz not null default now(),
  primary key (user_id, trial_num),
  foreign key (trial_num) references public.trials(num)
);

alter table public.letters enable row level security;

-- No member-facing grant, deliberately. Letter content is the most sensitive
-- data in the system after the health confirmation (doc 18.3) and the whole
-- mechanic depends on it being genuinely unreadable, even to its own author,
-- until Trial 53 — so every read goes through get_my_letter(), which enforces
-- that gate. Admins get a policy for future support/DSAR tooling, but no
-- grant is wired to it yet; add both deliberately if that's ever needed.
create policy letters_admin_select on public.letters
  for select to authenticated
  using (public.is_admin());

-- ---------- reckonings ----------
-- One row per member, written once at Trial 53. Not gated behind an RPC to
-- read back: unlike the letters, there is no further "unsealing" event after
-- this, so the member rereading their own answer from the Library is fine.

create table public.reckonings (
  user_id               uuid primary key references public.profiles(id) on delete cascade,
  route                 text not null check (route in ('written', 'spoken')),
  witness_name          text,
  witness_relationship  text,
  answer                text not null check (length(btrim(answer)) >= 10 and length(btrim(answer)) <= 4000),
  decision              text not null check (decision in ('lodge', 'release')),
  decided_at            timestamptz not null default now(),
  check (route <> 'spoken' or btrim(coalesce(witness_name, '')) <> '')
);

alter table public.reckonings enable row level security;

create policy reckonings_select on public.reckonings
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

grant select (route, witness_name, witness_relationship, answer, decision, decided_at)
  on public.reckonings to authenticated;

-- ---------- seal_letter ----------
-- Trials 1 and 9 only. Sequence-checked like save_account. Idempotent on
-- conflict rather than erroring, so a retry after a dropped connection
-- between sealing and the following clear_trial call can't strand a member
-- with a sealed letter and an uncleared trial.

create or replace function public.seal_letter(p_trial_num integer, p_typeface text, p_body text)
returns json
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles%rowtype;
  v_cleared int;
begin
  if v_uid is null then raise exception 'NOT_AUTHED'; end if;
  select * into v_profile from profiles where id = v_uid for update;
  if not found or v_profile.deleted_at is not null then raise exception 'NO_PROFILE'; end if;
  if not v_profile.entry_paid then raise exception 'ENTRY_REQUIRED'; end if;
  if p_trial_num not in (1, 9) then raise exception 'BAD_TRIAL'; end if;
  if p_typeface not in ('typewriter', 'handwriting') then raise exception 'BAD_TYPEFACE'; end if;

  select count(*) into v_cleared from completions where user_id = v_uid;
  if p_trial_num <> v_cleared + 1 then raise exception 'NOT_OPEN'; end if;

  insert into letters (user_id, trial_num, typeface, body)
  values (v_uid, p_trial_num, p_typeface, btrim(p_body))
  on conflict (user_id, trial_num) do nothing;

  return json_build_object('sealed', p_trial_num);
end;
$function$;

-- ---------- get_my_letter ----------
-- Unlocks once the member has reached Trial 53 (currently on it, or past
-- it) — never before. This is the gate that makes "sealed until 53" real
-- rather than a UI convention: nobody, including the author, can read a
-- sealed letter's content through any other path, because none is granted.

create or replace function public.get_my_letter(p_trial_num integer)
returns json
language plpgsql
stable
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_cleared int;
  v_row public.letters%rowtype;
begin
  if v_uid is null then raise exception 'NOT_AUTHED'; end if;
  if p_trial_num not in (1, 9) then raise exception 'BAD_TRIAL'; end if;

  select count(*) into v_cleared from completions where user_id = v_uid;
  if v_cleared < 52 then raise exception 'SEALED'; end if;

  select * into v_row from letters where user_id = v_uid and trial_num = p_trial_num;
  if not found then raise exception 'NOT_FOUND'; end if;

  return json_build_object(
    'typeface', v_row.typeface,
    'body', v_row.body,
    'sealed_at', v_row.sealed_at
  );
end;
$function$;

-- ---------- submit_reckoning ----------
-- The irreversible choice at Trial 53. Errors rather than silently no-oping
-- on a second call, because a retry that silently ignored a changed decision
-- (lodge vs release) would be worse than a clear error here.

create or replace function public.submit_reckoning(
  p_route text,
  p_witness_name text,
  p_witness_relationship text,
  p_answer text,
  p_decision text
) returns json
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles%rowtype;
  v_cleared int;
begin
  if v_uid is null then raise exception 'NOT_AUTHED'; end if;
  select * into v_profile from profiles where id = v_uid for update;
  if not found or v_profile.deleted_at is not null then raise exception 'NO_PROFILE'; end if;
  if not v_profile.entry_paid then raise exception 'ENTRY_REQUIRED'; end if;
  if not v_profile.circuit_active then raise exception 'CIRCUIT_REQUIRED'; end if;

  select count(*) into v_cleared from completions where user_id = v_uid;
  if v_cleared <> 52 then raise exception 'NOT_OPEN'; end if;

  if exists (select 1 from reckonings where user_id = v_uid) then
    raise exception 'ALREADY_DECIDED';
  end if;

  if p_route not in ('written', 'spoken') then raise exception 'BAD_ROUTE'; end if;
  if p_route = 'spoken' and btrim(coalesce(p_witness_name, '')) = '' then
    raise exception 'WITNESS_REQUIRED';
  end if;
  if length(btrim(coalesce(p_answer, ''))) < 10 then raise exception 'ANSWER_TOO_SHORT'; end if;
  if p_decision not in ('lodge', 'release') then raise exception 'BAD_DECISION'; end if;

  insert into reckonings (user_id, route, witness_name, witness_relationship, answer, decision)
  values (
    v_uid, p_route,
    nullif(btrim(p_witness_name), ''), nullif(btrim(p_witness_relationship), ''),
    btrim(p_answer), p_decision
  );

  -- "Released means destroyed, not hidden" (doc 18.7). The Library records
  -- that a letter was let go, and when, via reckonings.decision — never the
  -- content, which is why this is a hard delete and not a soft flag.
  if p_decision = 'release' then
    delete from letters where user_id = v_uid and trial_num in (1, 9);
  end if;

  return json_build_object('decision', p_decision);
end;
$function$;

-- ---------- clear_trial: two additions ----------
-- Trials 1 and 9 need a sealed letter in place of THE ACCOUNT (already
-- exempted); Trial 53 needs a submitted reckoning in place of it. Everything
-- else in the function is unchanged from 0010.

create or replace function public.clear_trial(p_trial_num integer)
returns json
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles%rowtype;
  v_cleared int;
  v_is_milestone boolean;
  v_kind text;
  v_gap int;
  v_last timestamptz;
begin
  if v_uid is null then raise exception 'NOT_AUTHED'; end if;
  select * into v_profile from profiles where id = v_uid for update;
  if not found or v_profile.deleted_at is not null then raise exception 'NO_PROFILE'; end if;
  if not v_profile.entry_paid then raise exception 'ENTRY_REQUIRED'; end if;
  if p_trial_num is null or p_trial_num < 1 or p_trial_num > 57 then
    raise exception 'BAD_TRIAL';
  end if;
  if p_trial_num >= 6 and not v_profile.circuit_active then
    raise exception 'CIRCUIT_REQUIRED';
  end if;
  select min_gap_minutes into v_gap from trials where num = p_trial_num and active;
  if not found then raise exception 'TRIAL_INACTIVE'; end if;
  select count(*) into v_cleared from completions where user_id = v_uid;
  if p_trial_num <> v_cleared + 1 then raise exception 'OUT_OF_ORDER'; end if;

  -- THE ACCOUNT (doc 21). 1, 9 and 53 exempt: the sealed letter / the
  -- reckoning is the account.
  if p_trial_num not in (1, 9, 53)
     and not exists (select 1 from trial_accounts
                     where user_id = v_uid and trial_num = p_trial_num) then
    raise exception 'ACCOUNT_REQUIRED';
  end if;

  if p_trial_num in (1, 9)
     and not exists (select 1 from letters where user_id = v_uid and trial_num = p_trial_num) then
    raise exception 'LETTER_REQUIRED';
  end if;

  if p_trial_num = 53
     and not exists (select 1 from reckonings where user_id = v_uid) then
    raise exception 'RECKONING_REQUIRED';
  end if;

  if v_gap > 0 then
    select max(cleared_at) into v_last from completions where user_id = v_uid;
    if v_last is not null and now() < v_last + make_interval(mins => v_gap) then
      raise exception 'COOLDOWN';
    end if;
  end if;

  insert into completions (user_id, trial_num) values (v_uid, p_trial_num);
  v_is_milestone := p_trial_num in (15, 30, 45, 57);
  if v_is_milestone then
    v_kind := case when p_trial_num = 45 then 'blazer_card' else 'merch' end;
    insert into milestone_events (user_id, trial_num, kind) values (v_uid, p_trial_num, v_kind);
  end if;
  return json_build_object(
    'cleared', p_trial_num,
    'next', case when p_trial_num < 57 then p_trial_num + 1 else null end,
    'milestone', v_is_milestone
  );
end;
$function$;

revoke all on function public.seal_letter(integer, text, text) from public, anon;
grant execute on function public.seal_letter(integer, text, text) to authenticated;
revoke all on function public.get_my_letter(integer) from public, anon;
grant execute on function public.get_my_letter(integer) to authenticated;
revoke all on function public.submit_reckoning(text, text, text, text, text) from public, anon;
grant execute on function public.submit_reckoning(text, text, text, text, text) to authenticated;

-- ---------- content: trials 01, 09, 53 ----------

update public.trials set
  title      = 'THE BIB',
  trial_type = 'MARK',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

Before anything else, you write. Why you are here, and what will make you quit. Two
typefaces, one page, then it's sealed — you will not read this again until Trial 53.

**THE WORK**

1. Choose a typeface: typewriter or plain handwriting. Either is fine. There's no ornate option, because that isn't what this is.
2. Write two things on the page: why you are here, and what will make you quit. Nobody else will ever read this.
3. There's no minimum beyond enough to mean something, and no maximum beyond what fits a page.
4. When it's true, press SEAL. Once sealed, it's lodged in your Library and closed until Trial 53. You cannot edit it, and you cannot reread it — not even you, not until then.
5. Your bib number is issued the moment you seal it, not before.

**THE RUBRIC**

*RISK* — Writing what you think should be true instead of what is. Nobody grades this, and
nobody but the future you will ever measure it against anything.

*GROUND* — Somewhere private, with time to actually think — not the two minutes before you
close the laptop.

*STOP* — If this brings up more than you expected before you've sealed it, save nothing,
walk away, and come back later. Nothing is lost by waiting a day to start your bib.

*SCALE* — There is no scaled version. Short and honest clears it as completely as long and
honest. The minimum length exists only so the page isn't empty.

*CLEARED WHEN* — The page is sealed.

**NOTE**

Everything after this is built from what you just wrote, whether it feels like it or not.$md$
where num = 1;

update public.trials set
  title      = 'THE LINE',
  trial_type = 'MARK',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

One more sealed letter before Trial 10 changes the pace. This time: predict the end,
specifically enough that you could be proven wrong.

**THE WORK**

1. Same page, same two typefaces as Trial 01 — pick either, it doesn't have to match.
2. Write what clearing Trial 57 will actually look like for you. Not how you'll feel — what will actually be true. Be specific enough that you could be proven wrong: a date range, a version of yourself, a thing you'll have done or stopped doing.
3. Vague predictions are the failure mode here. "I'll be fitter" is not falsifiable. "I will have stopped smoking" is.
4. Seal it the same way. It joins Trial 01 in the Library, closed until Trial 53 — where you'll find out if you were right.

**THE RUBRIC**

*RISK* — Writing something safely unfalsifiable so it can't be wrong later. That defeats the
trial entirely — a prediction that can't fail isn't a prediction.

*GROUND* — Same as Trial 01: private, unhurried.

*STOP* — If this surfaces more than you expected, leave it and come back. The trial stays
open, no deadline.

*SCALE* — No scaled version, same as Trial 01 — the minimum length exists only so the page
isn't empty.

*CLEARED WHEN* — Sealed.

**NOTE**

Trial 53 is forty-four trials away, but it is reading this exact page.$md$
where num = 9;

update public.trials set
  title      = 'THE RECKONING',
  trial_type = 'MARK',
  flag       = 'RED',
  body_md    = $md$**THE LINE**

Both seals break. Read what you wrote five months ago, then answer it. Whichever way you
answer, one thing about today is true either way: you got here.

**THE WORK**

1. This page opens both sealed letters — Trial 01 and Trial 09. For two minutes there is nothing else to do. Read them.
2. When the two minutes are up, one button: are you ready to face yourself.
3. Answer it two ways — pick one. **Write it**, a reply to the person who wrote those letters. Or **say it**, read both letters aloud to someone who has stood witness on your last few trials, then record that you did and who you told.
4. Whichever way, answer this directly, in your own words: **were you right about yourself?** One honest sentence is enough to clear this.
5. Then one choice, and it cannot be undone: **lodge** both letters back in the Library, sealed for good — or **release** them. Released means destroyed, not hidden. Your Library will record that you let them go, and when, never what they said.

**THE RUBRIC**

*RISK* — Rehearsing an answer that flatters you rather than the one that's true. Nothing here
goes wrong physically; the entire risk is writing for an imagined reader instead of for
yourself.

*GROUND* — Somewhere you can have two uninterrupted minutes, and somewhere private if you're
writing, or somewhere with the person you're speaking to if you're not.

*STOP* — If either letter lands harder than you expected, close the page. Both stay sealed,
nothing is lost, and this trial is still here tomorrow. There is no deadline on facing
yourself.

*SCALE* — One sentence answering "were you right about yourself?" clears this in full, on
either route. Nobody is kept from finishing for not being a writer or not having the words.

*CLEARED WHEN* — You've answered honestly and made the choice — lodge or release. Both are
complete answers. Neither is the better one.

**NOTE**

You wrote this trial yourself, on day one, without knowing it.$md$
where num = 53;
