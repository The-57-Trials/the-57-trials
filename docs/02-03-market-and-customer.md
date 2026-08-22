# 2–3. Market Analysis & Ideal Customer

> Status: research complete, 22 Aug 2026. Sources linked throughout.
> Written to be uncomfortable where the evidence is uncomfortable.

---

## 2.0 Three things that could not be verified

**1. the57trials.com returns no readable content to a crawler.** A fetch of the homepage
returns only the `<title>` tag. It is a client-rendered SPA with no server-side HTML.
**Google cannot reliably index it, link previews on Twitter/Discord/WhatsApp will be blank,
and there is zero organic search surface.** For a business whose acquisition plan is organic,
this is a market-access problem, not a marketing detail.

**2. "SketchGas" has no findable public footprint.** Exact term, spaced variants, and
combinations with YouTube/Discord/UK all returned nothing credible. **Every number below
assumes no inherited audience.** If Discord member counts or LaunchPass MRR exist, they are
the single most valuable inputs you can add and will move the SOM by an order of magnitude.

**3. "The 57 Trials" has no search presence at all.** Starting from absolute zero brand equity.

---

## 2.1 Competitive landscape

### The one that matters most
**75 Hard is free.** Frisella's own page states it in capitals. He claims **1m+ completions**
and there are ~2bn TikTok hashtag uses. The **official app is $4.99/month with no entry fee**,
4.5★ from 6.4K ratings.

> You are asking **£10 more than the market-defining incumbent**, for a brand nobody has heard
> of, at the same monthly price.

### The closest structural analogue — and a signal you should read
**The Conqueror Challenges** — virtual challenges with a posted metal medal, **£25–£35 per
challenge, one-off, no subscription.** They already do enforced sequential gating (their words:
*"must be completed in sequential order, with at least 90% completion required to unlock the
next"*). Self-reported 1m+ users, 87.93% completion, 4.8★.

**They have a million users and chose not to run a subscription.** That is a signal.

### The ceiling of this exact category
**Zombies, Run!** — sequential, narrative, paid, UK-built, co-created with a famous novelist,
a decade of press, a Marvel licence. At acquisition: **~300,000 MAU and ~50,000 paid
subscribers at ~£25/year.** Sold for up to $9.5m in 2021; redundancies followed.

> The most successful sequential-narrative paid fitness product ever built topped out at
> ~50,000 paying subscribers globally. **That is the ceiling, not the floor.**

### The cautionary tale — read twice
**"Her 75"**, a female-targeted 75 Hard app, climbed to **#7 in Health & Fitness with 218,000
downloads and $135,000 revenue in a fortnight (May 2026)** — then **dropped 67 places in three
days** after backlash against a paywall shown immediately after onboarding. Representative
review: *"Makes you fill out questionnaire and then force payment before any use."*

Two lessons pulling opposite ways: the category can still produce a 218k-download month, so
demand is live; **and the market punishes paying-before-seeing, publicly. Your £10-before-
anything is structurally the same move.**

### Your real UK price anchor
UK virtual-race brands (Race At Your Pace, Virtual Racing UK, ACE Races, Running Mad) sell a
**month-long challenge with a metal medal posted, for £14.95.** Your first four months cost
£29.96 and produce one patch — **roughly 2× the going UK rate**, from a brand with no trust.

### What genuinely nobody does
Sequential + physical-world + non-distance-based + leaderboard-ranked + merch-gated. **The gap
is real.** But an empty gap is not proof of value — The Conqueror explored this space and
chose one-off pricing.

---

## 2.2 Retention reality — the most important section

| Metric | Figure | Source |
|---|---|---|
| **Monthly plan, 12-month retention, median** | **17.0%** | RevenueCat |
| **Monthly plan under a hard paywall** | **12.8%** | RevenueCat |
| **Annual plan, 12-month retention** | **44.1%** | RevenueCat |
| Annual subs cancelled within year one | ~72% (35% in month one) | RevenueCat |
| **Health & Fitness refund rate** | **4.71% — highest of any App Store category** | RevenueCat |
| H&F renewal curve | 59.2% → 45.1% → 37.1% → 31.6% → 27.6% | Adapty |
| Share of H&F sold as annual | **68%** | Adapty |
| New subscription apps reaching $1,000/mo in 2 years | **17.3%** | RevenueCat |
| New apps reaching $10,000/mo in 2 years | **4.6%** | RevenueCat |

> **You are monthly-only.** The category sells 68% annual because annual retains at 44.1% and
> monthly at 17.0%. **You have opted into the worst-retaining plan structure in the
> worst-churning category.** Adding an annual plan is one Stripe price object and is the
> highest-leverage change available.

**Derived lifetime** from the hard-paywall figure: ~15.7% monthly churn → **~6.4 month mean
lifetime → ~£32 gross subscription LTV + £10 entry ≈ £42 gross.** Real curves are
front-loaded, so **the median is plausibly 2–4 months** while the mean is propped up by a few
long-stayers. **Plan cash on the median; plan LTV on the mean.**

### The merch schedule is mis-timed against observed churn
At ~1 trial/week from trial 06:

| Milestone | Reached ~ | Still subscribed |
|---|---|---|
| 15 — patch | month 2.3 | **~68%** |
| 30 — tee | month 5.8 | ~37% |
| 45 — cap | month 9.2 | ~21% |
| 57 — bib | month 12 | **~13%** |

**Roughly seven in eight paying members will never finish.** The finisher bib is not a
retention mechanism — it's too far away to pull anyone. And the largest-incidence item (the
patch, 68%) triggers at month 2.3, **before the average subscriber has paid £11.50.**

---

## 2.3 TAM / SAM / SOM

**A number I refused to use:** one syndicated report puts the "UK fitness app market" at
$2,884m in 2025 → $33,060m by 2035. The 2025 figure alone is over a third of the *entire* UK
gym industry (£6.5bn); the 2035 figure is five times it. No visible methodology. **There is no
credible published UK fitness-app market size. Saying so is more credible than citing a
fantasy.**

**Verified UK base:** population 69.5m · gym members 11.3m (16.6%) · **adults running ≥2×/28
days: 7.1m** · parkrun ~230,000 UK · 88% of UK consumers hold a subscription, averaging
£50.60/month, **and 37% cancelled something in the last six months**.

**TAM** — 7.1m runners × £69.88/yr = **~£496m**. Worthless as a plan; included because plans
require it.

**SAM** — built two independent ways that agree on order of magnitude:
- *Route 1:* 7.1m × 5% who pay for any discretionary fitness product ≈ **355,000**
- *Route 2:* bottom-up from the observable UK challenge industry ≈ **200,000–400,000**

**SAM ≈ 300,000 UK adults ≈ £21m/yr. Confidence: low.** What is solid is the order of
magnitude: **this is a low-hundreds-of-thousands market, not millions.**

**SOM — Year 1, bounded by acquisition capability, not market size**

| Scenario | Visits | Entry Passes | Subs | Year-1 gross |
|---|---|---|---|---|
| **A** — no audience, organic only | 2,000 | 30 | 12 | **~£539** |
| **B — BASE CASE** | 8,000 | 160 | 64 | **~£3,197** (≈£2,365 contribution) |
| **C** — one piece of content lands | 40,000 | 1,000 | 400 | ~£19,980 |

**State Scenario B as the plan: ~£3,200 gross in Year 1.** If that doesn't justify the months,
that is the finding, and it is better found now than in June.

---

## 2.4 Trends

**The format is mature and seasonal; the audience is still large and spending; the growth has
moved to softer, gentler, female-skewed variants — away from where you're positioned.**

**Still live:** Her 75's 218k downloads in May 2026 · ~2bn TikTok hashtag uses · UK running
participation up 0.5% YoY · UK gym penetration at an all-time 16.6–16.9%.

**Cresting or shifting:**
- **Severe New Year seasonality** — fitness apps see massive January sign-ups then 40–60% cancellation by February. **Launching in the wrong month costs most of a year.**
- **The energy has moved to "soft."** 75 Soft, 75 Medium. CNN, March 2026: *"experts warn the risks may outweigh the benefits."* **The 2026 cultural direction is away from austere maximalism, which is your entire brand.**
- **The category's biggest genuine winner is your opposite.** Finch — gentle, cute, warm — is at **~$30M ARR with no VC money**, roughly 25× Zombies, Run!'s peak.

**What drives participation, by evidence strength:** structure (strongest — 75 Hard is *just
rules*, free, 1m completions) · financial commitment (deposit contracts moved exercise 58%→83%
while bonus incentives did nothing) · **gamification (real but fading — the Wharton megastudy
of 61,293 gym members found 45% improved during the programme but only 8% showed lasting
change after four weeks; that is exactly your churn profile)** · physical rewards
(commercially proven — parkrun *charges* for milestone shirts people earned free, and people
buy them) · community (a floor-raiser, not a business model — Duolingo has the best streak
mechanic in software and still churns 28%/month).

**Unresolved:** every source describing the trend direction had a commercial incentive to say
"growing." **Pull the Google Trends CSV for "75 hard" UK 2019–2026 yourself. Five minutes, and
it's the cheapest de-risking available.**

---

## 2.5 Where this need is met for free

**Everything The 57 Trials sells is currently available at zero cost, and the free version has
more social proof than you will have for two years.**

| Your feature | Free equivalent | Its scale |
|---|---|---|
| Structured challenge | **75 Hard** | 1m+ claimed finishers |
| Progress tracking | 25+ free 75 Hard trackers | dozens of apps |
| Public leaderboard | Strava clubs (free tier) | 180m+ registered |
| Timed ranked event | **parkrun** — free forever | ~230,000 UK |
| Milestone merch | parkrun milestone shirts | at cost, culturally embedded |
| Community | r/selfimprovement (~2.18m), r/getdisciplined, free Discords | millions |
| Commitment stakes | stickK, Beeminder | free until you fail |

And the paid competition undercuts you: **the official 75 Hard app is $4.99/month with no
entry fee.**

### The four honest reasons anyone would pay
1. **Enforcement they cannot give themselves.** Server-side sequential gating. *Your only real moat, and The Conqueror already does it.*
2. **Curation.** But an unknown founder's curation has no established value. People pay for Frisella's because they've heard 500 hours of his podcast. **This is why the audience question is existential.**
3. **The bib number and the patch.** parkrun proves people buy the token. **Your strongest commercial asset — currently buried behind a subscription rather than being the product.**
4. **Paying is itself the mechanism.** The deposit-contract literature supports this. Lean in rather than apologise.

### The structural problem
Free 75 Hard has network effects. **The 57 Trials has anti-network effects at launch: a
leaderboard with four people is worse than no leaderboard.** The product is meaningfully worse
than free alternatives at zero scale. **Cold-start is the primary risk — ahead of churn,
ahead of pricing, ahead of everything.**

---

# 3. Ideal Customer Profile

**What could not be verified:** there is **no published demographic data on 75 Hard
participants.** Anyone claiming "60% male, 28–35" is inventing it. Everything below is
inference from adjacent verified data.

## 3.1 Who pays £10 and then £4.99/month

**Age 25–40.** *(Inferred.)* The 18–24 band has least disposable income and **51% of UK 18–34s
are considering cancelling a subscription in the next six months** — the most churn-prone band
for exactly your product.

**Gender — the sharpest strategic tension, and it's evidence-backed.** Your aesthetic reads
male-coded. But **Her 75 (female-targeted) hit #7 in Health & Fitness in May 2026**, and
**Finch (~$30M ARR) skews heavily female.** *You have chosen the smaller, slower-growing half
of the market on aesthetic grounds.* That may be right for authenticity — but make it a
decision, not an accident.

**Income £25k–£45k.** £4.99 is ~10% of a typical UK subscription wallet — a real ask, and the
wallet is contracting.

**The one non-negotiable trait:** they have **previously exchanged money for a physical
proof-of-completion object** — a Conqueror medal, a £14.95 virtual-race medal, a parkrun
milestone shirt they earned for free. That is a far narrower and far better-qualified segment
than "wants to get fit."

**Where they are, ranked:** Reddit (free, high-intent, hostile to promotion — only works after
months of genuine participation) · Strava clubs (right people, but **Strava has paywalled
Group Challenges**, so they already pay a competitor for a challenge feature) · **TikTok /
Reels (highest ceiling, and the only channel where austere visuals differentiate against a
pastel wellness feed)** · Discord · UK obstacle/virtual-race communities.

## 3.2 The job they're hiring it to do

1. **"Make the decision for me."** *Strongest evidence.* Your sequential lock is the purest expression of this on the market. **This is your actual value proposition and your marketing should say only this.**
2. **"Stop me from quitting."** Strong. The £10 is a stake, not a price. **Frame it as one.**
3. **"Give me something that proves I did it."** Strong commercially. **The patch and bib are doing more work than you think; the subscription is doing less.**
4. **"Make me not the only one."** Moderate — and structurally unavailable at launch with an empty leaderboard.
5. **"Entertain me."** Weakest evidence, worst customers. **Do not build acquisition around novelty; you will fill the funnel with month-one churn.**
6. **"Get me fit."** Explicitly not your job. **You sell completion, not fitness.**

## 3.3 Objections, by frequency, with implementable counters

**1. "75 Hard is free."** (~100% of considerations) → Don't argue value, argue **enforcement**.
Put a side-by-side "75 Hard vs The 57 Trials" table on the homepage, naming it explicitly —
it's the search term people already use and you rank for nothing.

**2. "I can't tell if it's any good and you want money first."** (Empirically the most
dangerous — it's what cost Her 75 sixty-seven places.) → **Publish Trial 01 in full, publicly,
on an indexable page.** Costs nothing, fixes the SEO invisibility at the same time, and
converts the objection into the demo. Publish all 57 titles too.

**3. "Why am I paying twice?"** → The honest problem is you cost more than the incumbent from
a brand nobody knows. Either reframe the £10 as buying a *physical thing* (post the actual
printed bib), **or add an annual plan** — 44.1% vs 17.0% retention, one Stripe price object.

**4. "What if I fall behind?"** (Uniquely severe for you.) → A stalled member on a sequential
lock has a dead account, still being billed, churning at ~100%. Add a **Hold state** that
pauses billing and preserves position; a **Sidestep** allowing one substitution per ten; and
**never reset progress on cancellation** — returning members are your cheapest acquisition.

**5. "Is this safe?"** → Per-trial difficulty rating visible *before* unlock, screening at
signup, scaling in every briefing, and **get insurance quoted before launch.**

**6. "Will this exist in six months?"** → Real name and face on an About page, dated public
roadmap, public leaderboard even at n=8.

**7. "How do I cancel?"** → One-click self-serve, advertised. Converts a compliance cost into
a trust asset.

**8. "How do I know the leaderboard isn't full of liars?"** → Self-report is unverifiable by
construction. Without a verified tier, the ranking means nothing and the status proposition
collapses.

**9. "Where's my patch?"** → Ship nothing until stock is in hand and the postal flow is tested.

**10. "I already pay for Strava."** → Integrate rather than compete.

## 3.4 Anti-personas

**Not the customer:** the deconditioned beginner (injury and refund risk — send them to Couch
to 5K) · the competitive athlete · anyone under 18 · the pure fitness-outcome seeker · the
"wants a nice app" buyer.

**Actively bad to acquire:**
- **January resolutioners.** 35% of annual cancellations happen in month one. A January cohort inflates month-1 numbers, triggers merch in March, and is gone by April having cost you a patch. **If you launch in January, cohort them separately.**
- **Anyone with a history of disordered eating or compulsive exercise.** A genuine harm and a genuine liability. Screen and mean it.
- **The refund-prone impulse buyer.** H&F has the highest refund rate of any category at 4.71%.
- **The speedrunner.** All 57 in six weeks, collects ~£33 of merch, pays ~£17, cancels. **Your merch schedule currently makes this arbitrage profitable for the customer.**
- **Anyone acquired via paid ads.** H&F has the highest 12-month LTV per install of any category — **and it is still only $1.21.**

---

## Three things to act on before spending another month

1. **Fix the site so it renders server-side.** No index, no link previews, no search surface. Everything else assumes traffic that currently has no way to arrive.
2. **Add an annual Circuit Pass.** 44.1% vs 17.0%. One Stripe price object.
3. **Pull the Google Trends CSV yourself.** Five minutes. If UK interest in "75 hard" peaked in 2023 and has declined, the plan changes materially.

**And answer the audience question.** Discord member count and LaunchPass MRR are worth more
than everything above. Without them, the base case is £3,200 in Year 1.
