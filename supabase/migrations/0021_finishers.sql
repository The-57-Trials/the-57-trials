-- 0021: finishers (doc 16). Doc 16.5 calls this "not urgent" since nobody
-- can reach it for ~195 days, but Trial 57's redesigned content (0020) now
-- promises "your finisher number is issued the moment this clears" — that
-- needs to be true, not aspirational copy.
--
-- Inserted from inside clear_trial when p_trial_num = 57, in the same
-- transaction as the completion, exactly as 16.5 specifies. Re-verified
-- below that order, payment and cooldown enforcement are unchanged.

create sequence if not exists public.finisher_number_seq start 1;

create table public.finishers (
  finisher_number integer not null default nextval('public.finisher_number_seq') unique,
  user_id         uuid not null primary key references public.profiles(id) on delete cascade,
  finished_at     timestamptz not null default now()
);

alter table public.finishers enable row level security;

create policy finishers_select on public.finishers
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

grant select (finisher_number, user_id, finished_at) on public.finishers to authenticated;

-- Public register view (doc 16.3's THE FINISHED) — same pattern as
-- `leaderboard`: owned by postgres, bypasses RLS deliberately, exposes bib
-- number and display name rather than the raw user_id every member's own
-- finishers row would otherwise leak to others.
create view public.finisher_register as
select f.finisher_number, p.bib_number, p.display_name, f.finished_at
from public.finishers f
join public.profiles p on p.id = f.user_id
where p.deleted_at is null
order by f.finisher_number;

revoke all on public.finisher_register from anon;
grant select on public.finisher_register to authenticated;

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
  v_finisher_number int;
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

  if p_trial_num = 57 then
    insert into finishers (user_id) values (v_uid)
    returning finisher_number into v_finisher_number;
  end if;

  return json_build_object(
    'cleared', p_trial_num,
    'next', case when p_trial_num < 57 then p_trial_num + 1 else null end,
    'milestone', v_is_milestone,
    'finisher_number', v_finisher_number
  );
end;
$function$;
