-- 0024: the Trial Blazer series — bonus trials that unlock only after
-- finishing all 57, gated behind a physical card shipped with the D3
-- hoodie. Rob's design, 2 Sep 2026 (evening).
--
-- The ceremony: clearing the existing hoodie bonus trial (TB-01) now also
-- issues a blazer_cards row - a card mailed with the hoodie carries a QR
-- code (linking to /blazer/<token>, a public page) and, printed alongside
-- it, a 4-digit number the member cannot yet read. The number is
-- genuinely not sent to any browser until Trial 57 is cleared - not a
-- CSS blur, an actual server-side gate, the same fix this session already
-- made for the sealed letters. Once revealed, typing it into the "run
-- complete" screen unlocks this series.
--
-- Two things by design, confirmed with Rob: (1) the number means nothing -
-- it's a ceremonial key, not an encoded message, so the only thing being
-- protected is "you kept the card"; (2) every bonus trial already requires
-- an active Circuit Pass (clear_bonus_trial/get_bonus_body always have),
-- so the series being active-pass-gated needed no new code - it was
-- already the rule, which is exactly the retention lever discussed.

-- ---------- blazer_cards ----------

create table public.blazer_cards (
  user_id      uuid primary key references public.profiles(id) on delete cascade,
  token        text not null unique,
  code         text not null check (code ~ '^[0-9]{4}$'),
  issued_at    timestamptz not null default now(),
  redeemed_at  timestamptz
);

alter table public.blazer_cards enable row level security;

-- No column grants at all, even to the owner. The code is readable only
-- via get_blazer_reveal (token-gated, and only once Trial 57 is cleared)
-- and redeem_blazer_code never returns it back. A member's own dashboard
-- status comes from get_my_blazer_status, which also never returns it.
-- This is deliberate: the digital account alone must never be enough:
-- you need the physical card's token.
create policy blazer_cards_admin_select on public.blazer_cards
  for select to authenticated
  using (public.is_admin());

-- ---------- bonus_trials: new columns for the series ----------

alter table public.bonus_trials add column if not exists sequence integer;
alter table public.bonus_trials add column if not exists requires_blazer_redemption boolean not null default false;
alter table public.bonus_trials add column if not exists issues_blazer_card boolean not null default false;
alter table public.bonus_trials add column if not exists price_pence integer;

grant select (sequence, price_pence) on public.bonus_trials to authenticated;

update public.bonus_trials set issues_blazer_card = true where code = 'TB-01';

-- Five bonus trials, visible only once the card is redeemed, cleared in
-- order. unlocked_at = 57 doubles as a defence-in-depth check: by the time
-- redemption is even possible, 57 is already true.
-- Content below is a first draft, not reviewed content like the main 57 -
-- placeholder-quality on purpose until Rob confirms the theme (doc 00-
-- decisions D18 territory: an epilogue arc where a finisher passes on
-- what they built, mirroring doc 17.4's "rank confers duty" mechanism).
-- Titles and structure are real; treat the words as a sketch.
-- bonus_trials.id has no identity/sequence default (TB-01 was inserted with
-- an explicit id) - explicit ids here too, rather than bolting on an
-- identity default this migration doesn't otherwise need.
insert into public.bonus_trials (id, code, title, body_md, unlocked_at, reward, sequence, requires_blazer_redemption, price_pence) values
  (2, 'TB-02', 'THE FIRST MILE BACK', $md$**THE LINE**

DRAFT CONTENT — pending review. Your first trial was alone. This one asks you to be the
reason someone else's isn't.

**THE WORK**

1. Take someone who has never done any of this through a session modelled on Trial 06 — the Stack. You lead, they follow, at their pace, not yours.
2. Teach it the way these briefings are written: plain instructions, no performance.
3. Afterward, write what it was like being the one giving instructions instead of following them.

**THE RUBRIC**

*RISK* — Making it about you rather than them. This trial is cleared by their pace, not yours.

*CLEARED WHEN* — The session is led, and the account is written.

**NOTE**

Draft — reward: unlocks the right to buy in the Trial Shop.$md$, 57, 'Shop item — unlocks the right to buy', 1, true, 1),

  (3, 'TB-03', 'THE OPEN DOOR', $md$**THE LINE**

DRAFT CONTENT — pending review. Tell one person the whole honest account of the last however
many months — not the highlight reel.

**THE WORK**

1. Choose one person and tell them, out loud, what this actually cost you and what it actually gave you.
2. Include at least one thing you'd normally leave out because it doesn't make you look good.
3. Let them ask questions. Answer honestly.

**THE RUBRIC**

*CLEARED WHEN* — The conversation has happened.

**NOTE**

Draft — reward: free, included.$md$, 57, 'Free — included', 2, true, null),

  (4, 'TB-04', 'THE LONG MEMORY', $md$**THE LINE**

DRAFT CONTENT — pending review. Reread Trial 19 and Trial 37 — what you wrote about pretending,
and what moved. Write what's changed since, from here.

**THE WORK**

1. Reread your own answers from Trial 19 (THE THIRD) and Trial 37 (THE PROMISE LEDGER).
2. Write one page comparing who wrote those answers to who you are now.
3. Be specific. "I've changed" is not an answer this trial accepts.

**THE RUBRIC**

*CLEARED WHEN* — The page is written.

**NOTE**

Draft — reward: unlocks the right to buy in the Trial Shop.$md$, 57, 'Shop item — unlocks the right to buy', 3, true, 1),

  (5, 'TB-05', 'THE QUIET WORD', $md$**THE LINE**

DRAFT CONTENT — pending review. Write to whoever comes after you. They don't exist yet, to
you. Write it anyway.

**THE WORK**

1. Write a short letter of advice to a stranger about to start Trial 01, knowing nothing else about them.
2. Keep it honest rather than inspirational — what you'd actually want to have been told.
3. Keep it somewhere. It isn't sent anywhere yet.

**THE RUBRIC**

*CLEARED WHEN* — The letter is written.

**NOTE**

Draft — reward: free, included.$md$, 57, 'Free — included', 4, true, null),

  (6, 'TB-06', 'THE LAST BLAZE', $md$**THE LINE**

DRAFT CONTENT — pending review. Fifty-seven was never the actual ceiling. Name what's next.

**THE WORK**

1. Decide one thing you're taking on next, now that this is finished — something real, not a vague intention.
2. Write it down with the same specificity Trial 01 asked of you on day one.
3. Tell your witness.

**THE RUBRIC**

*CLEARED WHEN* — It's named, written, and told to someone.

**NOTE**

Draft — reward: unlocks the right to buy in the Trial Shop. Last one.$md$, 57, 'Shop item — unlocks the right to buy', 5, true, 1);

-- ---------- get_blazer_reveal: public, token-gated ----------
-- Callable by anon: someone scans a physical card with no session on that
-- device. Returns nothing beyond "revealed or not" and the code itself
-- once eligible - no name, no bib, no other member data.

create or replace function public.get_blazer_reveal(p_token text)
returns json
language plpgsql
stable
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_card public.blazer_cards%rowtype;
  v_finished boolean;
begin
  select * into v_card from blazer_cards where token = p_token;
  if not found then raise exception 'NOT_FOUND'; end if;

  select exists (
    select 1 from completions where user_id = v_card.user_id and trial_num = 57
  ) into v_finished;

  if v_finished then
    return json_build_object('revealed', true, 'code', v_card.code);
  end if;
  return json_build_object('revealed', false);
end;
$function$;

revoke all on function public.get_blazer_reveal(text) from public;
grant execute on function public.get_blazer_reveal(text) to anon, authenticated;

-- ---------- get_my_blazer_status: authenticated, never returns the code ----------

create or replace function public.get_my_blazer_status()
returns json
language plpgsql
stable
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_card public.blazer_cards%rowtype;
begin
  if v_uid is null then raise exception 'NOT_AUTHED'; end if;
  select * into v_card from blazer_cards where user_id = v_uid;
  if not found then
    return json_build_object('has_card', false, 'redeemed', false);
  end if;
  return json_build_object('has_card', true, 'redeemed', v_card.redeemed_at is not null);
end;
$function$;

revoke all on function public.get_my_blazer_status() from public, anon;
grant execute on function public.get_my_blazer_status() to authenticated;

-- ---------- redeem_blazer_code ----------
-- Ceremonial, not a security boundary (see the note at the top) - the
-- real gate is having finished 57 and having the card at all. Scoped to
-- the caller's own row, so there is no cross-account guessing surface.

create or replace function public.redeem_blazer_code(p_code text)
returns json
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_card public.blazer_cards%rowtype;
begin
  if v_uid is null then raise exception 'NOT_AUTHED'; end if;
  if not exists (select 1 from completions where user_id = v_uid and trial_num = 57) then
    raise exception 'NOT_FINISHED';
  end if;

  select * into v_card from blazer_cards where user_id = v_uid for update;
  if not found then raise exception 'NO_CARD'; end if;
  if v_card.redeemed_at is not null then
    return json_build_object('redeemed', true, 'already', true);
  end if;
  if btrim(p_code) <> v_card.code then raise exception 'WRONG_CODE'; end if;

  update blazer_cards set redeemed_at = now() where user_id = v_uid;
  return json_build_object('redeemed', true, 'already', false);
end;
$function$;

revoke all on function public.redeem_blazer_code(text) from public, anon;
grant execute on function public.redeem_blazer_code(text) to authenticated;

-- ---------- clear_bonus_trial: issue the card; gate the series ----------

create or replace function public.clear_bonus_trial(p_bonus_id integer)
returns json
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles%rowtype;
  v_bonus public.bonus_trials%rowtype;
  v_cleared int;
begin
  if v_uid is null then raise exception 'NOT_AUTHED'; end if;

  select * into v_profile from profiles where id = v_uid for update;
  if not found or v_profile.deleted_at is not null then raise exception 'NO_PROFILE'; end if;
  if not v_profile.entry_paid then raise exception 'ENTRY_REQUIRED'; end if;
  if not v_profile.circuit_active then raise exception 'CIRCUIT_REQUIRED'; end if;

  select * into v_bonus from bonus_trials where id = p_bonus_id and active;
  if not found then raise exception 'NO_SUCH_BONUS'; end if;

  select count(*) into v_cleared from completions where user_id = v_uid;
  if v_cleared < v_bonus.unlocked_at then raise exception 'LOCKED'; end if;

  if v_bonus.requires_blazer_redemption then
    if not exists (
      select 1 from blazer_cards where user_id = v_uid and redeemed_at is not null
    ) then
      raise exception 'BLAZER_LOCKED';
    end if;
    if v_bonus.sequence is not null and v_bonus.sequence > 1 then
      if not exists (
        select 1 from bonus_completions bc
        join bonus_trials bt on bt.id = bc.bonus_id
        where bc.user_id = v_uid and bt.sequence = v_bonus.sequence - 1
      ) then
        raise exception 'OUT_OF_ORDER';
      end if;
    end if;
  end if;

  insert into bonus_completions (user_id, bonus_id) values (v_uid, p_bonus_id);

  -- Only a genuinely free reward gets auto-queued. A priced one unlocks a
  -- shop purchase instead (D17 pattern) - nothing to fulfil until bought.
  if v_bonus.price_pence is null then
    insert into milestone_events (user_id, trial_num, kind)
    values (v_uid, v_bonus.unlocked_at, 'blazer_reward');
  end if;

  if v_bonus.issues_blazer_card then
    insert into blazer_cards (user_id, token, code)
    values (v_uid, replace(gen_random_uuid()::text, '-', ''), lpad(floor(random() * 10000)::int::text, 4, '0'))
    on conflict (user_id) do nothing;
  end if;

  return json_build_object('cleared', p_bonus_id, 'reward', v_bonus.reward, 'priced', v_bonus.price_pence is not null);
end;
$function$;

-- ---------- get_bonus_body: same two new gates ----------

create or replace function public.get_bonus_body(p_bonus_id integer)
returns text
language plpgsql
stable
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_bonus public.bonus_trials%rowtype;
  v_cleared int;
begin
  if v_uid is null then raise exception 'NOT_AUTHED'; end if;
  select * into v_bonus from bonus_trials where id = p_bonus_id;
  if not found then raise exception 'NO_SUCH_BONUS'; end if;
  if public.is_admin() then return v_bonus.body_md; end if;

  if not exists (select 1 from profiles
                 where id = v_uid and entry_paid and circuit_active and deleted_at is null) then
    raise exception 'CIRCUIT_REQUIRED';
  end if;

  select count(*) into v_cleared from completions where user_id = v_uid;
  if v_cleared < v_bonus.unlocked_at then raise exception 'LOCKED'; end if;

  if v_bonus.requires_blazer_redemption then
    if not exists (
      select 1 from blazer_cards where user_id = v_uid and redeemed_at is not null
    ) then
      raise exception 'BLAZER_LOCKED';
    end if;
    if v_bonus.sequence is not null and v_bonus.sequence > 1 then
      if not exists (
        select 1 from bonus_completions bc
        join bonus_trials bt on bt.id = bc.bonus_id
        where bc.user_id = v_uid and bt.sequence = v_bonus.sequence - 1
      ) then
        raise exception 'OUT_OF_ORDER';
      end if;
    end if;
  end if;

  return v_bonus.body_md;
end;
$function$;
