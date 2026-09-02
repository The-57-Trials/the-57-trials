-- 0011: mirror_of (D16, competence via self-referenced feedback). Applied
-- live on 2 Sep 2026 (20260902000331, account_mirror) directly via the
-- Supabase MCP and never committed as a numbered file — reconstructed here,
-- see the note in 0010.
--
-- When a trial mirrors an earlier one, the app shows the member their own
-- THE ACCOUNT answers from the first attempt, self-referenced only, never
-- comparative between members.

alter table public.trials add column if not exists mirror_of integer references public.trials(num);

update public.trials set mirror_of = 6  where num = 18; -- THE REPEAT mirrors THE STACK
update public.trials set mirror_of = 18 where num = 26; -- mirrors THE REPEAT
update public.trials set mirror_of = 24 where num = 49; -- mirrors THE ASCENT
update public.trials set mirror_of = 25 where num = 54; -- mirrors THE RETURN
