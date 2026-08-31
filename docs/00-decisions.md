# Decisions log

Dated, so a choice reversed later can be traced to what was believed at the time.
Supersedes anything in the other sections that contradicts it.

---

## 23 August 2026

### D1 — Pricing: £19.57 entry, £9.57/month
**Decided by Rob.** Both prices carry the 57.

Supersedes the £10 / £4.99 in §5. The research recommended £7.99; Rob went further, and
the numbers support it — the nearest comparator (The Conqueror) charges £25–35 for a single
posted medal, and Strava charges £8.80/month for a purely digital product.

Net after Stripe UK (1.6825% blended + 20p, plus 0.7% Billing on the subscription):
**£19.04 per entry, £9.14 per monthly charge.**

*Status: live in the app and the database. Stripe products not yet created — create them at
these prices.*

### D2 — Enforced cooldowns between trials
**Decided by Rob.**

| Trials | Hold |
|---|---|
| 01 | none |
| 02–26 | 24 hours |
| 27–37 | 48 hours |
| 38–47 | 72 hours |
| 48–57 | 1 week |

**Minimum completion is now 147 days (~4.8 months):** 25 + 22 + 30 + 70.

This is the single change that fixes the fast-completer problem identified in §5 — there is
no longer any path to collecting the merch in six weeks. It also front-runs the content
runway problem in §8: the fastest possible member cannot outrun a writer producing three
trials a week.

Enforced inside `clear_trial`, measured against the member's **most recent clear** rather
than the previous trial's, so it cannot be gamed by interleaving. Presented in the UI as a
held state ("HOLDING AT CHECKPOINT · 27 OPENS IN 22H 14M"), never as an error, and it can
never be bought out of.

### D3 — The cap is gone; the Trial Blazer replaces it
**Decided by Rob.**

The cap was £22.95 landed and **51% of the entire merch stack**. It is removed.

In its place, clearing trial 45 issues a **Trial Blazer card** — a printed card carrying a
bonus trial. Completing that bonus trial earns a **Trial Blazer hoodie**, logo front and back.

Why this is better than the cap:
- The expensive item is **opt-in and earned twice**, so it is never an automatic cost against everyone who reaches 45.
- The card is ~£1.50 landed as a letter, against £22.95 for the cap.
- It adds a second, parallel sequence — the first thing in the product that isn't strictly linear.
- "First Trial Blazer card" implies more to come. There is room for a series.

*Status: database foundation live (`bonus_trials`, `bonus_completions`, `clear_bonus_trial`,
`get_bonus_body`, and `milestone_events.kind`). Card TB-01 seeded against trial 45. **The
bonus trial content and the member-facing UI are not built** — they need the content first.*

**Open: the hoodie spec.** Keep landed cost **under £25** including postage. At £29 the
fastest-possible completer who also earns it nets +£12.63, which works but is thin. Get three
quotes; consider print rather than embroidery on the back, which is usually the expensive side.

### D4 — Race Control is a separate application
**Decided by Rob.** The admin panel is off the public site.

Separate Vite app in `admin/`, separate build, separate Render service, separate auth storage
key. `/admin` no longer exists on the public domain, and no admin code ships in the member
bundle (verified against the built output).

**Be precise about what this buys.** Authorization was never client-side — every admin query
is gated by `is_admin()` inside Postgres, so a forced render always returned empty tables.
Separation removes the *attack surface* (admin code no longer downloaded by members), removes
`the57trials.com/admin` as a probe and phishing target, and decouples the two so one can be
hardened without the other. It reduces risk. It does not make attack impossible, and nothing
would.

Live at `t57-race-control.onrender.com`. Auto-deploy is **off** — it deploys only when
triggered, so admin changes are never accidental.

### D5 — No inherited audience
**Confirmed by Rob:** nobody ever joined the Discord.

Every forecast now assumes a genuine cold start. The "warm audience" scenario in §2 is
withdrawn. Base case stands at Scenario A/B: **£539–£3,200 in year one**.

This makes the cold-start problem in §2.5 the primary risk, ahead of churn and pricing.

### D6 — Trend judgement accepted
**Rob's call:** fitness culture and challenge culture are durable even if the specific 75
Hard format is seasonal.

That is consistent with the evidence: the *motivation* (structure, self-improvement,
accountability) is well-attested and stable; what's seasonal is the branded format. Worth
noting the research still found January launches produce cohorts that churn hardest — see §3.4.

---

## Economics after D1–D3

Net revenue against merch, at the new prices with the new cooldowns:

| Journey | Net revenue | Margin, no hoodie | Margin, with hoodie |
|---|---|---|---|
| Fastest possible (147 days) | £64.75 | **+£41.63** | **+£12.63** |
| Realistic (7 months) | £83.03 | **+£59.91** | **+£30.91** |
| Slow (9 months) | £101.32 | **+£78.20** | **+£49.20** |

*Merch base £23.12 = patch £5.72 + tee £11.70 + blazer card £1.50 + finisher bib £4.20.
Hoodie modelled at £29 landed.*

**Compare to before: −£2.24 at a typical pace and −£25.60 at a fast one.** Every scenario is
now positive, including the worst case. The three changes that did it were the price rise, the
cooldowns, and removing the cap — and the cooldowns matter most, because they remove the
short-journey scenarios entirely.

Still true and unchanged by these decisions:
- **Paid acquisition remains unavailable** — max sustainable CAC rises with the price but stays well below UK paid-social rates for a cold purchase from an unknown brand.
- **There is still no annual plan.** 44.1% vs 17.0% twelve-month retention. One Stripe price object. At £9.57/month an annual at ~£99 is the obvious shape.
- **The site still has no SEO surface.** A crawler sees an empty page.

---

## 23 August 2026 (evening)

### D7 — Charity Trials take 100% to the charity
**Decided by Rob.** The 90/5.7/4.3 split is dropped.

Members raise through an existing regulated platform; the business never touches the money
and therefore is not a commercial participator under Part II of the Charities Act 1992 and
owes no statutory disclosure duties. "We take nothing" becomes a brand asset.

### D8 — No speed ranking, ever
**Decided by Rob.** The top-ten-fastest Hall of Fame is dropped.

Reasons on the record: it incentivises pushing through warning signs on an unsupervised
physical product; it weakens the negligence position; it is a lying contest on unverified
self-report; and with cooldowns it would measure who was awake when their hold expired.

Recognition is served instead by the Register, the first-fifty-seven finishers, witness
lineage, and per-trial accounts.

### D9 — The pre-launch grading cohort is happening
**Decided by Rob.** 20-40 pilot members grade the trials on two axes before launch, and the
57 are reordered on the results. Bibs 001-057 are conferred on this cohort.

### D10 — No flag. Trust until proven otherwise.
**Decided by Rob, 31 Aug 2026.**

The Reckoning ships as **witnessing only**. No flag, no report button, no dishonesty
mechanism of any kind.

Reasoning: with the ranked leaderboard already dropped (D8) there is nothing to win, so
malicious flagging has no instrumental payoff — and a flag with no automatic consequence
mostly generates noise for Race Control to triage. Building an abuse surface before observing
any abuse is premature.

**Consequence for the business description:** "the business verifies nothing" becomes
unqualified. There is no exception, no appeal, no arbitration. That is a stronger and simpler
position both for the brand and for the liability framing.

**If dishonesty is ever observed**, the response is moderation of *conduct* — never
adjudication of a *completion*. The business must never rule on whether someone genuinely did
a physical task it did not witness.
