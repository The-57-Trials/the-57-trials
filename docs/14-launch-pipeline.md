# 14. The Launch Pipeline

> Everything between here and taking real money. Written 31 Aug 2026, from an audit of the
> live system rather than from memory. Gated: each stage lists what genuinely blocks what.

---

## 14.0 Where you actually are

Verified against the live database and the deployed sites today.

| | Status |
|---|---|
| **Product engineering** | Substantially done. Sequence rule, cooldowns, payments code, consent, admin, grading — all built and hardened. |
| **Trial content** | **0 of 57 written. All 57 still have placeholder titles.** |
| **Payments** | Code correct and verified. No Stripe account, no products, no secrets. |
| **Legal pages** | Written and live, all drafts, unreviewed, placeholders unfilled. |
| **Members** | 1 (you). |
| **Backups** | None. Free tier. |
| **Transactional email** | Cannot reach real customers. |
| **Tests / CI** | None at all. |
| **Security headers** | One of six present. |

### The thing to internalise before reading the rest

> **The critical path is not engineering. It is content and four external blockers.**

Fifty-seven briefings at a realistic hour each is the largest single body of work left, and
nothing in this document substitutes for it. The four things you cannot start trading without
— Stripe, insurance, a solicitor, and working email — are all lead-time items that depend on
other people.

Everything in Gates 2 and 3 can be built **in parallel with you writing**, and none of it
should be allowed to become a reason not to write. The growth research put it bluntly: every
dev hour before 100 members is procrastination in a hi-vis vest. Treat this pipeline as work
that happens *around* the writing, not instead of it.

---

## GATE 0 — Cannot trade at all
*Nothing else matters until these clear. All four are external and have lead times.*

### 0.1 Stripe — **BLOCKER**
Fresh account (not the LaunchPass-managed one). Test mode: Entry Pass **£19.57 one-off**,
Circuit Pass **£9.57/month**. Restricted key, webhook with the seven events, customer portal
activated. Five secrets into Supabase. Then business verification for live mode, which is
itself a lead-time item.

*The code is done and verified — a missing key now returns a clean "not set up yet" rather
than crashing.*

### 0.2 Insurance — **BLOCKER, and possibly a launch-stopper**
Public liability plus professional indemnity, disclosing exactly what you do: unsupervised
physical challenges issued as written briefings to unscreened remote consumers.

**Get a real quote before anything else in this document.** Standard fitness policies assume
*supervised* instruction. You may find it loaded well above budget, carrying exclusions that
make it worthless, or declined outright — and that would invalidate the whole plan. It is the
cheapest thing to find out and the most expensive thing to discover late.

### 0.3 Solicitor review — **BLOCKER**
The five policy pages are live and marked as drafts. Two points need a professional opinion:
how the monthly pass is classified for refund purposes, and how bundled merch is treated as
goods. Fill every `[PLACEHOLDER]` — trading name, address, ICO number.

### 0.4 Transactional email — **BLOCKER**
Supabase's built-in sender only delivers to pre-authorised addresses. **A paying stranger
will never receive their confirmation and will never be able to log in.** Custom SMTP, SPF,
DKIM and DMARC on the domain, then raise the auth rate limit above 30/hour.

Also required here: the **reg 16 confirmation email** recording the cancellation-right waiver
back to the member. Currently unbuilt because it needs a mail provider.

### 0.5 Supabase Pro — **BLOCKER**
No backups exist. You are about to hold paid subscriptions, progress and consent records.
Also buys 7-day log retention, which is what lets you answer "it charged me twice on Tuesday"
on a Thursday.

### 0.6 ICO registration
Required, ten minutes, and you need the number for the privacy policy.

---

## GATE 1 — The product
*Nothing to sell without this.*

### 1.1 Write the trials — **the largest single piece of work left**
Minimum 20 before launch, 30 strongly preferred. The §4 spec gives you the full 57 mapped to
chapters with two publication-ready examples to copy. Use the fixed template — without one,
each briefing is a blank page and takes three hours instead of one.

**Buffer rule:** never let written trials fall below the fastest live member's position plus
ten. Put that single number on the Race Control dashboard.

### 1.2 Run the grading cohort
20–40 pilot members, free, with the job of grading. Two axes, plus completion rate and
time-to-clear. **Reorder the 57 on the results.** Confer bibs 001–057.

*Built and live: members grade after clearing, and Race Control shows averages, disagreement
spread, and a proposed reorder.*

### 1.3 Trial Blazer content and UI
The database foundation exists; the bonus trial has no content and no member-facing UI. Needs
the writing first.

### 1.4 Merch, quoted for real
Three quotes each. Hoodie landed under £25 including postage. Confirm 15/30/45 fit a Royal
Mail Large Letter — that decision roughly halves both postage and your packing time.

---

## GATE 2 — Backend, security, compliance
*Can be built in parallel with writing. Ordered by consequence.*

### 2.1 Security — what is already right
Worth stating so it is not re-litigated: sequence enforced in Postgres and unbypassable ·
payment checked on both clearing and content · RLS on every table with grants tightened to
match · definer functions pinned with `search_path` · webhook signature verified before any
processing · no service-role key in the browser · admin split to its own app and origin ·
grading writes gated behind an RPC. All verified against the live database.

### 2.2 Security — the remaining gaps

| Gap | Why it matters |
|---|---|
| **Only 1 of 6 security headers set** | No CSP, HSTS, X-Frame-Options, Referrer-Policy or Permissions-Policy. CSP in particular is what Stripe's own security guidance asks for, and X-Frame-Options prevents clickjacking your checkout. |
| **No rate limiting on RPCs** | `clear_trial`, `grade_trial` and auth endpoints can be hammered. Cheap to add at the edge. |
| **Leaked-password protection off** | One Supabase toggle; rejects passwords found in breach corpora. |
| **No MFA on Race Control** | Admin access to every member record protected by a password alone. |
| **No dependency or secret scanning** | Add Dependabot and a pre-commit hook for `sk_`/`rk_` patterns. |
| **No audit log** | No record of admin actions. Matters the first time a member disputes a change. |
| **No Stripe reconciliation job** | Entitlement lives in two systems. A dropped webhook silently locks a paying member out, and they will chargeback rather than email. A nightly job that walks Stripe subscriptions and repairs the table makes webhooks an optimisation rather than the source of truth. |

### 2.3 GDPR — beyond the privacy policy
The notice is written; the *operational* side largely is not.

- **ROPA** (Article 30 record of processing) — a table, not a project.
- **DPIA screening** — you process health-adjacent data and publish member data. Do the ICO's short screening and keep it on file.
- **DSAR process** — a written procedure and a one-month clock. Export exists; the process around it does not.
- **Breach response plan** — 72 hours to the ICO. One page in a drawer, written before you need it.
- **Retention automation** — the policy states 6 years for financial and consent records, 90 days for logs, 12 months for addresses. All currently manual. A `pg_cron` job should enforce it.
- **Processor agreements** on file: Supabase, Stripe, the email provider.
- **Verify erasure end to end** — that deletion genuinely removes what it claims and retains what it must.

### 2.4 Reliability
- **Backups: enable, then actually restore one.** An untested backup is a belief, not a backup.
- **Uptime and error monitoring** with alerts to your phone. Currently you would learn the site was down from a member.
- **Away mode** — one flag that banners the site, sets the autoresponder and pauses milestone emails.
- **Dead-man's switch** — if no new trial is published for 60 days, subscription billing pauses automatically. Protects members from paying for a dead product and you from the chargebacks that follow.
- **Injury auto-freeze** — a report to `medical@` or an in-app button automatically sets a hold and pauses billing. This is the one path that cannot tolerate a queue.

### 2.5 Engineering hygiene
- **No tests at all.** The highest-value suite is small: assert the sequence rule, the cooldowns, the payment gates and the RLS boundaries. These are the rules the business rests on, and they are exactly what a refactor would silently break.
- **No CI.** Typecheck and build on push, at minimum.
- **No `render.yaml`.** The SPA rewrite exists only in the dashboard — recreate the service and you lose deep links and every Stripe return URL.
- **Migration 0005 is missing from the sequence.** Harmless now, confusing later.
- **Content lives in the database with no versioning.** Keep the 57 briefings as markdown in the repo and sync on deploy: diffs, history, rollback, and you can draft trial 52 without touching production.

---

## GATE 3 — The experience
*Design, interaction and polish. Also parallel.*

### 3.1 The signature moments
Three screens carry this brand. They are worth disproportionate effort.

**The Interval.** The cooldown is currently a held state on the dashboard. It should be the
most distinctive screen in the product — a full page that treats the wait as *required rest*,
not a lockout. Time remaining in register voice, the next trial's number and grade visible,
nothing else. You have a one-week hold between the last ten trials; that is a lot of time
spent on a screen that currently says very little.

**The Reveal.** Sealed briefing that opens once. Show the number and published grade while
still locked and nothing else — anticipation needs an object. Costs nothing; the content is
already withheld server-side.

**The Register.** Replaces the ranked leaderboard. Entry-number order, no ranking, no times.
parkrun publishes everything and insists it is not a race.

### 3.2 Loading and transitions
Currently every loading state is the word `LOADING…`. That is honest but flat, and it is the
first thing a member sees on every route.

- **Skeleton states in brand** — a timing board resolving row by row, not a spinner. The trial grid, the register and the Pulse all have known shapes, so skeletons are easy and remove layout shift.
- **Route transitions** — brief, linear, no bounce. The register is not a game.
- **Optimistic clearing** — stamp immediately, reconcile after. The server is authoritative; the UI does not need to wait to feel certain.
- **Prefetch the next trial** on hover or when a cooldown is nearly up.
- **Named loading states**, not one word: *READING THE REGISTER*, *STAMPING*, *CONFIRMING PAYMENT*. Some exist; make it consistent.

### 3.3 Offline — worth more here than on most products
Members do these trials **outdoors, possibly without signal**. Being unable to read a briefing
you have already unlocked because you walked out of coverage is a real failure.

Make it an installable PWA that caches the current briefing and the route. Genuinely useful
rather than a checkbox, and it puts an icon on the member's home screen — which for a
five-to-nine-month commitment is worth having.

### 3.4 The share artifact
**The highest-return development work remaining**, per the growth research. A member
screenshotting a dashboard makes bad content. An app-generated, dated, bib-numbered CLEARED
card with your URL on it is free advertising. Same for the bib card itself.

### 3.5 SEO and sharing — currently zero
A crawler sees an empty page. There is no `robots.txt`, no `sitemap.xml`, no OG image, no
favicon file.

- **Pre-render the public pages** — landing, the five policy pages, and ideally Trial 01 published in full as your demo. This also fixes the "I can't tell if it's any good before paying" objection, which is the most dangerous one.
- OG image, favicon and apple-touch-icon; `robots.txt` and `sitemap.xml`; per-route `<title>`.
- Stripe's reviewer may also see the empty shell — another reason to pre-render before applying.

### 3.6 Copy and accessibility
- **Cut the four hostile lines** the brand work identified. They are the whole source of the tension between austere and honourable.
- Decide on **MARK CLEARED → SIGN FOR IT** and **Circuit Pass → Standing**.
- Accessibility is largely done — contrast, focus, tap targets, reduced motion, dialog semantics. Remaining: a full keyboard pass over the new grading control, and per-route titles.

### 3.7 Empty and edge states
With one member, most screens are empty. An empty register, an empty grid and a first-run
dashboard all need designing deliberately rather than appearing broken. Cover: brand-new
account, entry paid but nothing cleared, mid-cooldown, all 57 cleared, subscription lapsed
with progress intact.

---

## GATE 4 — Operations
*Small, and skipping it is what makes launches painful.*

- **The runbook, five pages max** — refunds in Stripe, force-clear and revert-clear, dispatch end to end, the injury protocol verbatim, and every login in a password manager with emergency access configured.
- **Support aliases with SLAs** — `office@`, `kit@`, and `medical@` triggering a phone alert. Injury: 4 hours, always.
- **Race Bulletin** — weekly email, twenty minutes to write, does the community job with no Online Safety Act duty because it is one-to-many.
- **2FA everywhere**, passkeys or an authenticator app, on the business email above all — it is the master key to every other account.
- **Fill the placeholders.** Trading name, business address, ICO number, contact email. A live policy page with `[BRACKETED]` text in it is itself a compliance failure.

---

## 14.1 The critical path

Everything else is parallel to these six.

1. **Insurance quote** — because a decline invalidates the plan, and it has the longest lead time.
2. **Stripe account and products** — unblocks all payment testing.
3. **Transactional email** — without it nobody can complete a signup.
4. **Write trials 01–20** — the largest single body of work.
5. **Solicitor review** — external lead time; start it as soon as the placeholders are filled.
6. **Grading cohort** — needs 1 and 4; produces the reorder everything else assumes.

**Realistic shape:** the four external blockers run in parallel over two to four weeks while
you write. Engineering and design fill the same window. The grading cohort follows the first
twenty trials. Live-mode Stripe and the go-live checklist come last.

## 14.2 Who does what

**Only you can do:** insurance, solicitor, ICO, Stripe account and verification, the merch
quotes, 2FA and password manager, the trial content, and the decision on the brand-voice
changes.

**I can do, on your word:** every engineering and design item in Gates 2 and 3, the
`render.yaml` and headers, the test suite and CI, the GDPR operational documents as drafts,
the runbook skeleton, and the Race Control additions.

## 14.3 The one thing to resist

The engineering list is long and satisfying, and none of it sells anything. **Fifty-seven
briefings do.** If a week passes where the pipeline moved and no trial got written, the
pipeline is being used as an excuse — and the content buffer is the one thing that cannot be
bought, borrowed or automated later.
