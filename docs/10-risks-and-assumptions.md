# 10. Risks & Assumptions

> Status: draft for Rob's review. Written 22 Aug 2026.
> This section exists to be uncomfortable. If it reads as encouraging, it has failed.

---

## 10.1 The load-bearing assumptions

Every business rests on things it believes but has not proven. These are ours, ordered by
how much damage is done if they turn out to be false.

### A1 — People will pay £10 upfront **and** £4.99/month
**Confidence: low. This is the big one.**

Dual monetisation is unusual in consumer subscription products for a reason: it asks for
two separate decisions, and the second one arrives after the novelty has worn off. Nothing
about this pricing has been validated against a single real customer.

Worse, the second ask lands at trial 06 — immediately after the member has built five
trials of momentum, which is the moment they are most invested *and* the moment they feel
most like they have already paid.

**How we'd know early:** the *stalled at 06* count on the Pulse dashboard. Every member
sitting there paid £10, hit the wall, and said no.
**If it's false:** collapse to one model. Either £10 buys everything (and merch becomes a
paid add-on), or drop the entry fee and go subscription-only with a free trial 01.
**Cheapest test:** launch to a small first cohort and watch trial-06 conversion before any
paid acquisition.

### A2 — Written briefings are enough
**Confidence: low-medium.**

No video, no coaching, no verification, no personalisation. The competition — free 75 Hard
trackers, YouTube, Reddit — costs nothing and includes video. We are charging for
sequencing, identity and a number.

**If it's false:** the product is a strictly worse free training plan with a paywall.
**Mitigant already designed in:** roughly half the trials are not physical at all
(reflection, consistency, skill, social). That is what is actually being sold. It needs to
be obvious *before* purchase, or refund rates will tell us the hard way.

### A3 — There is an audience to launch into
**Confidence: unknown — and "unknown" is the problem.**

There may be residual Discord members. There may be a "SketchGas" audience. I have no
figure for either, and no plan should be built on a number nobody has counted.

**Action:** count it before spending anything. How many people are in the Discord? How many
opened the last message? That single number determines whether launch is "tell the people
who already know" or "cold-start acquisition", and those are entirely different businesses
with entirely different cost bases.

### A4 — Self-reported completion is meaningful
**Confidence: medium.**

Nothing is verified. A member can clear all 57 from the sofa. This is fine for the honest
majority and fatal to the leaderboard, which is a competition anyone can win by lying.

**Why it's survivable:** the customer is buying a commitment device, and cheating one
defeats the purchase. **Why it still matters:** any competitive or public ranking built on
unverifiable self-report is a lying contest, which is an argument for de-emphasising rank
entirely.

### A5 — The merch economics work
**Confidence: low until modelled.** *(§5 is modelling this properly.)*

A member who moves quickly can consume four physical items having paid for very few
subscription months. The faster and more enthusiastic the member, the more money they may
cost. That is an inverted incentive and it needs a number attached before launch, not
after the first fifty parcels.

### A6 — 57 is the right length
**Confidence: medium.**

Long enough to be a real undertaking; long enough to be intimidating. Realistic completion
is six to nine months, which is a long subscription — good — but also a long time to
sustain interest, and a long content runway to write.

**Note the structural bind:** finishing cancels the subscription. Every finisher is churn
by design. The three-year plan has to answer *what comes after 57*.

### A7 — Physical challenge content can be both safe and compelling
**Confidence: medium-high after the content spec, low before it.**

Everything genuinely dangerous is excluded by design. The open question is whether what
remains is still worth £4.99/month, or whether the safe version is simply "go for a walk".

---

## 10.2 What actually kills this

Ranked by probability × damage.

### R1 — Churn (most likely failure)
Consumer fitness and self-improvement subscriptions churn hard. If members leave before
the merch they have already earned pays for itself, growth makes losses worse rather than
better.
**Early warning:** month-3 retention. **Mitigation:** the content spec's interleaved
non-physical trials exist largely so an injured or busy member is never hard-blocked, which
is the most avoidable cause of churn in a strictly sequential product.

### R2 — Acquisition costs more than a member is worth
No CAC data exists. With ~£5/month revenue and meaningful churn, the affordable CAC is
small — likely single-digit pounds. Paid acquisition may simply not be viable, which makes
this an organic-or-nothing business.
**Mitigation:** find out organically before spending. If organic can't do it, paid almost
certainly can't either at this price point.

### R3 — The format is trivially copyable
There is no technical moat. 75 Hard is free, unprotected, and endlessly cloned. Someone
could ship "The 100 Trials" in a weekend.
**What's actually defensible:** the brand, the writing, the bib-number identity, and the
accumulated community. Not the mechanic.
**Mitigation:** move faster than a copyist can care, and make the writing good enough to be
the reason people stay.

### R4 — An injury, and the liability that follows
Strangers performing physical tasks unsupervised, unscreened beyond self-report. UK law
does not permit disclaiming liability for injury caused by negligence.
**Mitigations in place:** dangerous categories excluded at the design level, per-trial
safety rubrics, screening at signup, escalating warnings, check-in protocol from trial 48.
**Still outstanding — and this is the gap: insurance.** Every mitigation above reduces the
chance of being found negligent. Only insurance handles the case where you are.

### R5 — Founder burnout or absence
One person is writing 57 pieces of content, running support, fulfilling merch, doing
marketing and maintaining the code, around a day job.
**This is the single most likely cause of quiet death** — not a dramatic failure, just a
month where nothing ships and members drift away.

### R6 — The content runway runs out
If members clear faster than trials are written, the product hard-stops. Sequential gating
means there is no "read something else" fallback.
**Rule:** never let the buffer fall below the fastest member's position plus ten.

### R7 — Refunds and chargebacks
Distance-selling rules, a physical-effort product, and a subscription. Refund requests are
certain; the question is the rate.
**Mitigation:** the consent gates and waiver now recorded at signup, plus honest
pre-purchase description. A chargeback costs the fee whether or not it succeeds.

---

## 10.3 Single points of failure

| Point of failure | What happens if it goes | Mitigation status |
|---|---|---|
| **Rob** | Everything stops. No content, no support, no fulfilment. | ❌ None. Highest-value fix is documentation + one trusted backup person. |
| **the57trials@gmail.com** | Master key to Render, Supabase, GitHub, Stripe, domains. Lose it and you lose the business. | ⚠️ Needs 2FA everywhere and recovery codes stored offline. |
| **Supabase project** | All member data, progress, consent records. | ⚠️ **No backups on the free tier.** Pro upgrade is a launch requirement. |
| **Stripe account** | All revenue and billing relationships. Account review or freeze halts income. | ⚠️ Keep the business description accurate; avoid restricted-category framing. |
| **Sole trader status** | Unlimited personal liability on a physical-activity product. | ⚠️ Worth an accountant's view on incorporating. |
| **One domain, one brand** | Trademark not registered; someone could register it. | ⚠️ See §9. |

---

## 10.4 What would make me more confident

Concrete, cheap, and mostly doable before launch:

1. **Count the existing audience.** One number, changes everything about the plan.
2. **Sell ten Entry Passes to strangers** before building anything further. Not friends — strangers.
3. **Watch the trial-06 conversion** on the first cohort. This one number validates or kills the pricing model.
4. **Get one full merch quote** so A5 stops being a guess.
5. **Write trials 01–15 completely** before launch, so the free window is genuinely good and there is real buffer.
6. **Get insured**, which converts R4 from existential to manageable.

---

## 10.5 The honest summary

This is a **well-built product with an unvalidated business model.** The engineering is
sound, the sequencing works, and the brand is coherent and distinctive.

What has not been tested is whether anyone will pay for it — twice — and whether they stay
long enough to cover what they cost. Those are answerable cheaply, with a small first
cohort, before any money goes into acquisition.

**The most likely bad outcome is not dramatic failure.** It is a slow one: forty members,
high churn, a founder writing content in the small hours for an audience that is shrinking,
and no clear moment to stop. The way to avoid that is to decide *now* what number, by what
date, means it's working — and what number means it isn't.

Suggested kill criterion, to be argued with rather than accepted:

> **If, three months after launch, fewer than 30 people hold an active Circuit Pass and
> month-3 retention is under 40%, stop acquiring and reconsider the model rather than
> pushing harder on marketing.**
