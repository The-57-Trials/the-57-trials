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

## Current state

Stripe is live and proven end-to-end in test mode. **All 57 trials written and loaded live**,
2 Sep 2026 — the critical path from doc 14 is done. 01, 09 and 53 are the flagship arc (doc
18): a sealed letter mechanic (`letters` table, `seal_letter`/`get_my_letter` RPCs,
`SealedLetter.tsx`) at 01 and 09, genuinely unreadable — including to its own author — until
THE RECKONING at 53 (`reckonings` table, `submit_reckoning`, `Reckoning.tsx`) breaks both
seals. **Nothing has been read by a real member yet** — the grading cohort (doc 14, 1.2) is
now the actual gate, not more writing. Outstanding on Rob's side: insurance, solicitor review
of the draft legal pages, ICO registration, custom SMTP (a hard launch blocker — Supabase's
built-in email only reaches pre-authorised addresses), Supabase Pro for backups, and deleting
the decoy project.

Known simplifications, all flagged in code/migration comments: (1) Trial 01 sits after the
Entry Pass paywall rather than inside signup as doc 22.1 finding 5 recommends — moving it
earlier means touching `clear_trial`'s and `get_trial_body`'s entry_paid gate, deliberately
left alone; (2) the sealed-letter typewriter/handwriting choice uses system font fallback
stacks, not real webfonts; (3) Trial 41 (THE FORGIVENESS LETTER) is a standard MARK trial,
not wired into the `letters` schema — its unlock rule differs in kind from 01/09; (4) RED-tier
trials 48–52 and 54–57 describe the named check-in/witness narratively — `trial_witnesses`
(doc 22.6) isn't built, so nothing persists who was told, unlike Trial 53's `reckonings` row.

**Migration history has drifted from the live database twice** — two migrations (`trial_accounts`,
`account_mirror`) were applied live via the Supabase MCP on 1–2 Sep without ever being
committed as numbered files. They've been reconstructed as `0010`/`0011` for the record, but
were **not re-applied live** (they're already there) — only genuinely new migrations should be
pushed. Always add the numbered file in the same turn you call `apply_migration`, so this
doesn't happen a third time.
