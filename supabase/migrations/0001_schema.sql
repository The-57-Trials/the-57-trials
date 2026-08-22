-- ============================================================
-- THE 57 TRIALS — schema, RLS, sequential-unlock RPC, seed
-- The sequence rule lives HERE, not in the UI.
-- ============================================================

-- Bib numbers are sequential from 58 (001–057 are reserved lore numbers).
create sequence if not exists public.bib_number_seq start 58;

-- ---------- tables ----------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  bib_number int unique not null default nextval('public.bib_number_seq'),
  role text not null default 'member' check (role in ('member', 'admin')),
  entry_paid boolean not null default false,
  circuit_active boolean not null default false,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.trials (
  num int primary key check (num between 1 and 57),
  title text not null,
  chapter text not null,
  body_md text not null default '',
  is_milestone boolean generated always as (num in (15, 30, 45, 57)) stored,
  active boolean not null default true,
  -- pacing hook for later; 0 = no cooldown in v1
  min_gap_minutes int not null default 0
);

create table public.completions (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  trial_num int not null references public.trials (num),
  cleared_at timestamptz not null default now(),
  unique (user_id, trial_num)
);
create index completions_user_idx on public.completions (user_id);

create table public.milestone_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  trial_num int not null,
  created_at timestamptz not null default now(),
  shipped boolean not null default false
);

-- ---------- profile auto-creation on signup ----------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- helpers ----------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin' and deleted_at is null
  );
$$;

-- ---------- leaderboard view ----------
-- Owned by postgres (bypasses RLS deliberately): every authed member may read
-- the aggregated board. Soft-deleted members are excluded.

create view public.leaderboard as
select
  p.id,
  p.display_name,
  p.bib_number,
  p.circuit_active,
  count(c.id) as cleared,
  max(c.cleared_at) as last_cleared
from public.profiles p
left join public.completions c on c.user_id = p.id
where p.deleted_at is null
group by p.id;

revoke all on public.leaderboard from anon;
grant select on public.leaderboard to authenticated;

-- ---------- row level security ----------

alter table public.profiles enable row level security;
alter table public.trials enable row level security;
alter table public.completions enable row level security;
alter table public.milestone_events enable row level security;

-- profiles: own row (or admin) readable; only display_name is member-updatable.
-- Access flags (entry_paid, circuit_active, role, bib_number, stripe_customer_id)
-- are written only by the service role (Stripe webhook / admin ops).
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid() and deleted_at is null)
  with check (id = auth.uid());

revoke update on table public.profiles from authenticated, anon;
grant update (display_name) on table public.profiles to authenticated;

-- trials: members read active trials but NOT body_md (content is gated by
-- get_trial_body below, so paying members can't read ahead via the API).
-- Admin writes go through the normal table grants + policies.
create policy trials_select on public.trials
  for select to authenticated
  using (active = true or public.is_admin());

create policy trials_admin_write on public.trials
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

revoke all on table public.trials from anon;
revoke select on table public.trials from authenticated;
grant select (num, title, chapter, is_milestone, active, min_gap_minutes)
  on table public.trials to authenticated;
grant insert, update, delete on table public.trials to authenticated; -- gated by RLS to admins

-- completions: readable by owner (or admin); inserts ONLY via clear_trial RPC.
create policy completions_select on public.completions
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
-- (no insert/update/delete policies: direct writes are impossible for clients)

-- milestone_events: race control only.
create policy milestones_admin_select on public.milestone_events
  for select to authenticated
  using (public.is_admin());

create policy milestones_admin_update on public.milestone_events
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- trial body access (no reading ahead) ----------
-- Cleared trials and the current line are readable; anything further is LOCKED.

create or replace function public.get_trial_body(p_trial_num int)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_cleared int;
  v_body text;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHED';
  end if;

  if public.is_admin() then
    select body_md into v_body from trials where num = p_trial_num;
    return v_body;
  end if;

  select count(*) into v_cleared from completions where user_id = v_uid;
  if p_trial_num > v_cleared + 1 then
    raise exception 'LOCKED';
  end if;

  select body_md into v_body from trials where num = p_trial_num and active;
  return v_body;
end;
$$;

-- ---------- the sequence rule ----------
-- clear_trial is the ONLY write path into completions.
--  1. caller must be authed, entry-paid, not soft-deleted
--  2. p_trial_num must be exactly the caller's current line
--  3. trials 06–57 additionally require an active Circuit Pass
--  4. milestones (15/30/45/57) enqueue a merch event

create or replace function public.clear_trial(p_trial_num int)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles%rowtype;
  v_cleared int;
  v_is_milestone boolean;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHED';
  end if;

  select * into v_profile from profiles where id = v_uid for update;
  if not found or v_profile.deleted_at is not null then
    raise exception 'NO_PROFILE';
  end if;
  if not v_profile.entry_paid then
    raise exception 'ENTRY_REQUIRED';
  end if;

  if p_trial_num is null or p_trial_num < 1 or p_trial_num > 57 then
    raise exception 'BAD_TRIAL';
  end if;

  -- Free window: 01–05 on Entry Pass alone; the circuit powers everything after.
  if p_trial_num >= 6 and not v_profile.circuit_active then
    raise exception 'CIRCUIT_REQUIRED';
  end if;

  if not exists (select 1 from trials where num = p_trial_num and active) then
    raise exception 'TRIAL_INACTIVE';
  end if;

  -- Sequence check: completions are always exactly 1..n, so the current line
  -- is count + 1. (Profile row is locked above, so concurrent calls serialize.)
  select count(*) into v_cleared from completions where user_id = v_uid;
  if p_trial_num <> v_cleared + 1 then
    raise exception 'OUT_OF_ORDER';
  end if;

  insert into completions (user_id, trial_num) values (v_uid, p_trial_num);

  v_is_milestone := p_trial_num in (15, 30, 45, 57);
  if v_is_milestone then
    insert into milestone_events (user_id, trial_num) values (v_uid, p_trial_num);
  end if;

  return json_build_object(
    'cleared', p_trial_num,
    'next', case when p_trial_num < 57 then p_trial_num + 1 else null end,
    'milestone', v_is_milestone
  );
end;
$$;

revoke all on function public.clear_trial(int) from public, anon;
grant execute on function public.clear_trial(int) to authenticated;
revoke all on function public.get_trial_body(int) from public, anon;
grant execute on function public.get_trial_body(int) to authenticated;

-- handle_new_user is a trigger function only — nobody calls it over the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
-- is_admin is used inside RLS policies (authenticated keeps EXECUTE for
-- policy evaluation) but anon has no business calling it.
revoke execute on function public.is_admin() from public, anon;

-- ---------- seed: 57 placeholder trials, real chapter mapping ----------
-- Chapter names live in data, not code — editable via admin later.

insert into public.trials (num, title, chapter)
select
  n,
  'Trial ' || lpad(n::text, 2, '0'),
  case
    when n between 1 and 9 then 'I — FOUNDATION'
    when n between 10 and 19 then 'II — DISCIPLINE'
    when n between 20 and 29 then 'III — ENDURANCE'
    when n between 30 and 38 then 'IV — PRESSURE'
    when n between 39 and 47 then 'V — MASTERY'
    else 'VI — ASCENSION'
  end
from generate_series(1, 57) as n;
