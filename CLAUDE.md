# The 57 Trials — project context

A paid, sequential challenge platform at **the57trials.com**. Members clear 57 written
physical and reflective briefings **in strict order**, gated by enforced cooldowns. Entry
Pass £19.57 one-off; Circuit Pass £9.57/month from Trial 06.

**This is not the Wingstop project.** Different business, different accounts, different repo.
Business email for every service (Supabase, Render, GitHub, Stripe, domains):
**the57trials@gmail.com**. Never use the Wingstop accounts (WSui org, hanleyws26 workspace),
and never put 57 Trials material in the connected Notion — that workspace is Wingstop's.

## `docs/` is the brain — read it first

`docs/00-decisions.md` is the dated decisions log and **supersedes anything that contradicts
it**. `docs/README.md` indexes all 23 documents. Highlights:

| Doc | What |
|---|---|
| 04 | What a trial is: anatomy, the five types, the prime rule, the safety rubric, global exclusions |
| 18 | The sealed letter, the Library, the book. *"You open it with a pen and you close it with a book."* |
| 21 | THE ACCOUNT — the compulsory write-up that becomes the book |
| 22 | The storyboard: research, the six-act arc, the full running order for all 57 |
| 23 | **The evidence base.** Every source behind the design. Add here rather than citing from memory |

## Stack

- **React 18 + Vite + TypeScript**, hand-rolled CSS "race bib" design system, dark only.
- **Supabase** — Postgres + Auth + RLS + Deno edge functions.
- **Race Control** — a *separate* admin app at `admin/`. The public site has no `/admin` route and no admin code in its bundle.
- **Render** static sites. Member app `srv-da4o2vk9v7es738peh00`; Race Control `srv-da54mubncjis73fpcvhg`.

## Things that will bite you

- **Two Supabase projects exist with near-identical names.** The live one is **`the-57-trials` / `somnbyqcvqsgrdvyvdby`** (eu-west-2, London). `the57trials` / `tpllvadrplmvbdjzmfkx` (eu-west-1) is an empty decoy that should be deleted. Check the ref, not the name.
- **Render auto-deploy does not fire** — the repo is attached by public URL, so there is no push webhook. Trigger deploys via the Render MCP `trigger_deploy` after every push.
- **Git remote must carry the username**: `https://the57trials@github.com/...`. Using the org name `The-57-Trials` as the URL user causes an endless auth prompt loop against old cached credentials.
- **PowerShell `Get-Content`/`Set-Content` mangles UTF-8 here** (£ becomes Â£). Never bulk-edit source that way — use the Edit tool.
- **Heredocs writing markdown through Bash fail** in this environment. Use the Write tool for `.md` files.

## Architecture decisions (why things are the way they are)

- **Postgres is the security boundary.** `clear_trial` is the *only* write path into `completions`, and enforces auth, `entry_paid`, `circuit_active` (trials ≥ 6), strict order, the cooldown, and now THE ACCOUNT. `get_trial_body` mirrors the payment guards so nobody reads ahead — a paywall bypass here was found and fixed in migration 0003. **Re-verify all of it after any change to `clear_trial`.**
- **Column-level SELECT grants on `trials`.** `body_md` is deliberately ungranted so content cannot be read through the REST API. Any new column is invisible until explicitly granted.
- **`min_gap_minutes` does double duty.** On a normal trial it is the cooldown; on a HOLD trial it *is* the trial's duration (D15). The app tells them apart via `trial_type`.
- **Nothing is verified.** No photo, no GPS, no proof. That is the product, not a gap — see doc 17. Trials 48–57 name a witness, which is attestation, not verification.
- **`consents.user_id` has no foreign key on purpose** — the health confirmation must survive account deletion for its six-year retention. Do not "fix" it with a cascade.

## Conventions

- Migrations live in `supabase/migrations/`, numbered, and are applied to the live project via the Supabase MCP. Trial content is authored in `content/trials/*.md` as the source of truth and loaded from there.
- **Never accept or request secret keys in chat.** Secrets go straight into Supabase Edge Function secrets and nowhere else.
- Run `npm run build` before committing anything that touches `src/` or `admin/`.
- Decisions get recorded in `docs/00-decisions.md` with a `D<n>` heading, dated.

## D17 — the Trial Shop (2 Sep 2026, evening)

Circuit Pass no longer entitles a member to free merch at 15/30/45 — it enables the **Trial
Shop**: reaching a milestone unlocks the *right to buy* that item, gated on an active Circuit
Pass at time of purchase. Only the finisher's plate (57) and the Trial Blazer hoodie (45, via
its bonus trial) stay free. Full reasoning in `docs/00-decisions.md` D17; spec in `docs/04-
product.md` 4.6. **Model only** — `shop_products`/`shop_orders` exist (migration 0023),
seeded with two unpriced items, but no Stripe checkout is wired and no member-facing Shop
page exists yet. Don't build either until real merch quotes land (doc 14 gate 1.4) — a shop
with placeholder prices is worse than no shop.

## Current state

Stripe is live and proven end-to-end in test mode. **All 57 trials written and loaded live**,
2 Sep 2026 — the critical path from doc 14 is done, and doc 14 itself has been rewritten to
say so. **Nothing has been read by a real member yet** — the grading cohort (doc 14, 1.2) is
the actual remaining gate, not more writing.

**The same session found and fixed a production-breaking gap**: `clear_trial` has required
THE ACCOUNT (doc 21) for every trial except 1, 9, 53 since 1 Sep, but no frontend ever called
`save_account` — meaning Trial 02 onward could never actually be cleared in production.
`AccountPanel.tsx` fixed this. If a session ever finds `clear_trial` gained a precondition
with no corresponding UI, treat it as urgent, not cosmetic.

**Built this session, beyond the 57 themselves:** `AccountPanel`/`AccountRecord` (THE ACCOUNT,
doc 21), `trial_witnesses` + `WitnessRecord` (doc 17's witnessed trials, 48–52/54–57),
`finishers` + finisher-number reveal (doc 16, built well ahead of its own "not urgent" note
because Trial 57's copy now promises it), `MirrorRecord` (D16's competence payoff — four
trials promised "you'll see what you wrote" with nothing behind it), the HOLD day-ticker
(doc 22.5), THE REVEAL's locked-tile grade preview (doc 3.1), the PRIME stamp (doc 4.1), the
Library page (doc 18.2) at `/library`, and the `ClearedCard` share artifact (doc 3.4, "the
highest-return development work remaining"). Doc 22.5 tracks build status per screen.

**Most important find of the session: `/board` was a live, ranked, timestamped leaderboard —
exactly what D8 killed on 23 Aug.** Sorted by clears (most first), a POS/rank column, a
per-clear timestamp column. Doc 16 (THE REGISTER — bib-number order, no rank, no times,
"no one has finished yet" empty state) was written specifically to replace it and nobody had
ever wired it up. Same pass found the identical "rank"/"board" language on Landing, Terms and
Privacy, and separately, **Terms and Refunds were quoting the pre-D1 prices** (£10/£4.99
against the live £19.57/£9.57). All fixed; `/board` no longer exists, replaced by
`Register.tsx` at `/register`. If a future session finds member-facing copy or a screen that
implies ranking, sorting-by-progress, or a fastest-time claim anywhere, treat it the same way
— D8 is absolute, not just a UI convention.

**Trial 57 was redesigned, pending Rob's review** — no longer a longer walk, now a
self-declared confrontation with the member's own most-avoided thing (public speaking, a
business first step, an overdue confession — examples, never a requirement). Grounded in the
peak-end rule and exposure-therapy research; see doc 23 findings 11–13 and the note against
Trial 57 in doc 22. Not a locked decision.

Known simplifications, flagged in code/migration comments: (1) Trial 01 sits after the Entry
Pass paywall rather than inside signup as doc 22.1 finding 5 recommends — moving it means
touching `clear_trial`'s and `get_trial_body`'s entry_paid gate, deliberately left alone; (2)
the sealed-letter typewriter/handwriting choice uses system font fallback stacks, not real
webfonts; (3) Trial 41 (THE FORGIVENESS LETTER) is a standard MARK trial, not wired into the
`letters` schema — its unlock rule differs in kind from 01/09.

Outstanding on Rob's side, unchanged: insurance, solicitor review of the draft legal pages,
ICO registration, custom SMTP (a hard launch blocker), Supabase Pro for backups, and deleting
the decoy project.

**Migration history drifted from the live database twice early on** (two migrations applied
via the Supabase MCP on 1–2 Sep without ever being committed as numbered files, reconstructed
as `0010`/`0011`). Every migration since has had its numbered file added in the same turn as
`apply_migration` — keep doing that.
