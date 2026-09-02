-- 0010: THE ACCOUNT (doc 21) — the compulsory three-field write-up on every
-- trial. This was applied live on 1 Sep 2026 (20260901221820, trial_accounts)
-- directly via the Supabase MCP and never committed as a numbered file here —
-- reconstructed from the live schema so the migration history stops drifting
-- from the database (see docs/14-launch-pipeline.md, gate 2.5).

create table if not exists public.trial_accounts (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  trial_num  integer not null references public.trials(num),
  done       text not null check (length(btrim(done))    >= 40 and length(btrim(done))    <= 2000),
  hard       text not null check (length(btrim(hard))    >= 40 and length(btrim(hard))    <= 2000),
  learned    text not null check (length(btrim(learned)) >= 40 and length(btrim(learned)) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, trial_num)
);

alter table public.trial_accounts enable row level security;

create policy trial_accounts_read_own on public.trial_accounts
  for select to authenticated
  using (user_id = auth.uid() or is_admin());

grant select (user_id, trial_num, done, hard, learned, created_at, updated_at)
  on public.trial_accounts to authenticated;

-- save_account is the only write path — no direct insert/update grant to
-- authenticated. Only the currently-open trial can be saved, and only before
-- it clears (clear_trial's precondition below relies on this).
create or replace function public.save_account(
  p_trial_num integer, p_done text, p_hard text, p_learned text
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
  if p_trial_num is null or p_trial_num < 1 or p_trial_num > 57 then
    raise exception 'BAD_TRIAL';
  end if;
  if p_trial_num >= 6 and not v_profile.circuit_active then
    raise exception 'CIRCUIT_REQUIRED';
  end if;

  -- Only the currently-open trial. Stops writing ahead, and stops an account
  -- being edited after clearing - a record you can improve is not a record.
  select count(*) into v_cleared from completions where user_id = v_uid;
  if p_trial_num <> v_cleared + 1 then raise exception 'NOT_OPEN'; end if;

  insert into trial_accounts (user_id, trial_num, done, hard, learned)
  values (v_uid, p_trial_num, btrim(p_done), btrim(p_hard), btrim(p_learned))
  on conflict (user_id, trial_num) do update
    set done = excluded.done, hard = excluded.hard,
        learned = excluded.learned, updated_at = now();
  return json_build_object('saved', p_trial_num);
end;
$function$;

-- clear_trial precondition: THE ACCOUNT is compulsory on every trial except
-- 1, 9 and 53, where the sealed letter (doc 18, D13/D14) is the account.
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

  -- THE ACCOUNT (doc 21). 1, 9 and 53 exempt: the sealed letter is the account.
  if p_trial_num not in (1, 9, 53)
     and not exists (select 1 from trial_accounts
                     where user_id = v_uid and trial_num = p_trial_num) then
    raise exception 'ACCOUNT_REQUIRED';
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
