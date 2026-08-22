-- ============================================================
-- Tighten the grant layer.
--
-- Supabase grants ALL on public-schema tables to anon/authenticated by
-- default. 0001 revoked those defaults on profiles and trials but not on
-- completions, milestone_events, or the leaderboard view — leaving RLS as the
-- only thing between a member and the completions table. RLS did hold (there
-- are no INSERT/UPDATE/DELETE policies, and PostgREST exposes no TRUNCATE), so
-- nothing was reachable in practice; this restores the second layer so the
-- grants match the intent rather than relying on RLS alone.
--
-- NOTE: any NEW table added to this schema inherits the same permissive
-- default. Revoke explicitly whenever one is created.
-- ============================================================

-- anon touches nothing: the public landing page reads no tables, and signup
-- runs through a definer-owned trigger.
revoke all on public.profiles         from anon;
revoke all on public.trials           from anon;
revoke all on public.completions      from anon;
revoke all on public.milestone_events from anon;
revoke all on public.leaderboard      from anon;

-- completions: readable, never directly writable. clear_trial is the only way in.
revoke all on public.completions from authenticated;
grant select on public.completions to authenticated;

-- milestone_events: admins read the merch queue and tick shipped (RLS enforces admin).
revoke all on public.milestone_events from authenticated;
grant select, update on public.milestone_events to authenticated;

-- profiles: read own row (RLS), edit nothing but the display name.
revoke all on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

-- trials: listing columns only — body_md stays unreadable so nobody can read
-- ahead. Admin CRUD is allowed at the grant layer and gated to admins by RLS.
revoke all on public.trials from authenticated;
grant select (num, title, chapter, is_milestone, active, min_gap_minutes)
  on public.trials to authenticated;
grant insert, update, delete on public.trials to authenticated;

-- leaderboard: an aggregate read, nothing more.
revoke all on public.leaderboard from authenticated;
grant select on public.leaderboard to authenticated;
