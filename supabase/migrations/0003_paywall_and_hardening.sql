-- ============================================================
-- CRITICAL FIX + hardening.
--
-- get_trial_body gated only on completion count and never on payment, so a
-- free signup could read Trial 01 and an Entry-only member could read Trial 06
-- without a Circuit Pass. Reading the briefing IS the product, so it is now
-- gated exactly as clearing is. Nothing leaked: all 57 bodies were empty when
-- this was found.
-- ============================================================

create or replace function public.get_trial_body(p_trial_num int)
returns text
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles%rowtype;
  v_cleared int;
  v_body text;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHED';
  end if;

  -- Race control reads anything, so the admin editor can load drafts.
  if public.is_admin() then
    select body_md into v_body from trials where num = p_trial_num;
    return v_body;
  end if;

  if p_trial_num is null or p_trial_num < 1 or p_trial_num > 57 then
    raise exception 'BAD_TRIAL';
  end if;

  select * into v_profile from profiles where id = v_uid;
  if not found or v_profile.deleted_at is not null then
    raise exception 'NO_PROFILE';
  end if;

  if not v_profile.entry_paid then
    raise exception 'ENTRY_REQUIRED';
  end if;
  if p_trial_num >= 6 and not v_profile.circuit_active then
    raise exception 'CIRCUIT_REQUIRED';
  end if;

  select count(*) into v_cleared from completions where user_id = v_uid;
  if p_trial_num > v_cleared + 1 then
    raise exception 'LOCKED';
  end if;

  select body_md into v_body from trials where num = p_trial_num and active;
  return v_body;
end;
$$;

-- pg_temp is searched first for relation names even when unlisted, so name it
-- explicitly and last on every definer function.
alter function public.clear_trial(int)  set search_path = public, pg_temp;
alter function public.is_admin()        set search_path = public, pg_temp;
alter function public.handle_new_user() set search_path = public, pg_temp;

-- The leaderboard exposed profiles.id — every member's auth UUID, readable by
-- any other member. The "(YOU)" marker only ever needed a boolean.
drop view if exists public.leaderboard;
create view public.leaderboard as
select
  p.display_name,
  p.bib_number,
  p.circuit_active,
  (p.id = auth.uid()) as is_me,
  count(c.id)         as cleared,
  max(c.cleared_at)   as last_cleared
from public.profiles p
left join public.completions c on c.user_id = p.id
where p.deleted_at is null
group by p.id;

revoke all on public.leaderboard from anon, authenticated;
grant select on public.leaderboard to authenticated;

-- setCircuitByCustomer updates by stripe_customer_id with no row bound; if two
-- profiles ever shared one, a single Stripe event would flip both.
create unique index if not exists profiles_stripe_customer_id_key
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;

-- display_name is rendered to every member on the board.
alter table public.profiles
  add constraint profiles_display_name_len
  check (char_length(trim(display_name)) between 1 and 40) not valid;
alter table public.profiles validate constraint profiles_display_name_len;
