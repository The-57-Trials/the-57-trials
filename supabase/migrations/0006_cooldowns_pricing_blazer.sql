-- ============================================================
-- Decisions taken 23 Aug 2026: pricing, cooldowns, Trial Blazer.
--
-- These three together are what turned the unit economics from
-- "only profitable on people who quit" into positive at every pace.
-- ============================================================

-- 1. COOLDOWNS -----------------------------------------------------------
-- 01–26  24h  |  27–37  48h  |  38–47  72h  |  48–57  1 week
-- Minimum completion becomes 147 days (~4.8 months): 25 + 22 + 30 + 70.
-- Trial 01 has no gap; there is no previous clear to measure from.

update public.trials set min_gap_minutes = case
  when num = 1               then 0
  when num between 2  and 26 then 1440    -- 24 hours
  when num between 27 and 37 then 2880    -- 48 hours
  when num between 38 and 47 then 4320    -- 72 hours
  else                            10080   -- 7 days, trials 48-57
end;

-- 2. PRICING -------------------------------------------------------------
-- Entry £19.57 one-off, Circuit £9.57/month. Both carry the 57 deliberately.
create or replace function public.circuit_price_pence()
returns int language sql immutable
set search_path = pg_catalog
as $$ select 957 $$;

-- 3. TRIAL BLAZER --------------------------------------------------------
-- Milestone 45 no longer posts a cap (£22.95 landed, 51% of the whole merch
-- bill). It emits a Trial Blazer card — a printed card carrying a bonus
-- trial. Clearing that bonus earns the hoodie. The expensive item is
-- therefore opt-in and earned twice, never an automatic cost.

alter table public.milestone_events
  add column if not exists kind text not null default 'merch'
  check (kind in ('merch', 'blazer_card', 'blazer_reward'));

create table if not exists public.bonus_trials (
  id          int primary key,
  code        text not null unique,          -- printed on the card
  title       text not null,
  body_md     text not null default '',
  unlocked_at int  not null references public.trials (num),
  reward      text not null,
  active      boolean not null default true
);

create table if not exists public.bonus_completions (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  bonus_id   int  not null references public.bonus_trials (id),
  cleared_at timestamptz not null default now(),
  unique (user_id, bonus_id)
);
create index if not exists bonus_completions_user_idx on public.bonus_completions (user_id);

alter table public.bonus_trials      enable row level security;
alter table public.bonus_completions enable row level security;

create policy bonus_trials_select on public.bonus_trials
  for select to authenticated
  using (
    public.is_admin()
    or (active and unlocked_at <= (select count(*) from completions where user_id = auth.uid()))
  );

create policy bonus_trials_admin_write on public.bonus_trials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy bonus_completions_select on public.bonus_completions
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

revoke all on public.bonus_trials      from anon, authenticated;
revoke all on public.bonus_completions from anon, authenticated;
grant select (id, code, title, unlocked_at, reward, active)
  on public.bonus_trials to authenticated;
grant insert, update, delete on public.bonus_trials to authenticated;  -- RLS gates to admin
grant select on public.bonus_completions to authenticated;

insert into public.bonus_trials (id, code, title, unlocked_at, reward)
values (1, 'TB-01', 'Trial Blazer I', 45, 'Trial Blazer hoodie')
on conflict (id) do nothing;

-- The full clear_trial, get_bonus_body and clear_bonus_trial bodies were
-- applied via the trial_blazer migration; see the Supabase migration history
-- for the authoritative definitions. Key behaviours:
--   * clear_trial enforces the cooldown against the member's most recent
--     clear (not the previous trial's), so it cannot be gamed.
--   * milestone 45 inserts kind='blazer_card'; 15/30/57 insert 'merch'.
--   * clear_bonus_trial requires entry + active Circuit + the unlocking
--     trial, and inserts kind='blazer_reward'.
--   * get_bonus_body applies the same no-reading-ahead gate as trial bodies.
