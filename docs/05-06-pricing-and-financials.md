# 5–6. Pricing, Unit Economics & Financials

> Status: research complete, 22 Aug 2026. All figures GBP, USD at 1.3626.
> Every calculation is shown so it can be re-derived and argued with.

---

## 5.1 Is the pricing validated?

**It is a guess.** No customer, no test, no waitlist survey. That is the pre-launch condition,
not a criticism — but it must be stated, because most of Section 6 is downstream of it.

**And the research says it is wrong in the opposite direction to the obvious one: £4.99/month
is too low, not too high.**

| Product | Price | Physical goods | Structure |
|---|---|---|---|
| **The Conqueror** | £24.95–£34.95 per challenge | **One medal** | One-off |
| Strava Premium | ~£8.80/mo | None | Subscription |
| 75 Hard app | ~£29/yr | None | Subscription |
| Tough Mudder UK | from £99 | Headband, tee, medal | Event ticket |
| **The 57 Trials** | £10 + £4.99/mo | **Four items** | Dual |

The Conqueror charges **£25–35 for one medal**. You ship four items to a completer who pays
~£45 gross. Strava charges £8.80/month for a purely digital product.

### The dual-monetisation question — answered, and not as expected

**Evidence hard paywalls help:** RevenueCat puts day-35 conversion at **10.7% for hard
paywalls vs 2.1% freemium**; revenue per install at day 60 **$3.09 vs $0.38**.

**Evidence a second gate hurts:** two sequential decisions *multiply*. At Expected assumptions
visitor→subscriber is 1.2% × 30% = **0.36%**. And the moment is the worst possible one — a
member who just paid £10 and cleared five trials in a week is stopped and asked again.

**But the finding that reframes the question.** At Expected assumptions, 20,000 visitors/month:

| Line | Monthly |
|---|---|
| Entry Pass gross profit (240 × £9.63) | **£2,312** |
| Subscription net (350 active × £4.67) | £1,636 |
| Less their merch | −£753 |
| **Subscription gross profit** | **£883** |
| **Entry Pass share of gross profit** | **72.4%** |

> **The £10 Entry Pass is the business. The £4.99 subscription is, at current price and merch
> bundle, close to a break-even loyalty programme that ships gifts.**

So the conclusion is *not* "drop the £10 to boost subscription conversion" — that deletes 72%
of gross profit. **Testing the entry price (£10 / £15 / £20) is worth more than testing the
subscription paywall.** One-offs are also more fee-efficient: 3.68% vs 6.39%.

**Second-order risks:** £10 anchors you cheap and selects a price-sensitive, high-churn
cohort. And **the 14-day right for the physical merch runs from delivery** — a member can hit
milestone 30, receive the tee, and return it.

---

## 5.2 Three scenarios

| Assumption | Conservative | Expected | Optimistic | Basis |
|---|---|---|---|---|
| Visitor → £10 | 0.50% | **1.20%** | 2.50% | DTC median 1.17% (IQR 0.92–1.52) |
| £10 → subscription | 15% | **30%** | 45% | **Weakest assumption — no direct comparator exists** |
| Implied lifetime | 3.07 mo | **4.86 mo** | 7.58 mo | Expected = Adapty's H&F curve exactly |
| Flat-equivalent churn | 32.6% | **20.6%** | 13.2% | Worse than the 10–13% median *deliberately* — real churn is front-loaded |

| Scenario | Visitors/mo | Active subs | Gross MRR | **Annual net** |
|---|---|---|---|---|
| Conservative | 20,000 | 46 | £230 | £11,738 |
| **Expected** | 1,000 | 18 | £87 | £769 |
| **Expected** | 5,000 | 88 | £437 | £8,435 |
| **Expected** | **20,000** | **350** | **£1,747** | **£37,180** |
| Optimistic | 20,000 | 1,705 | £8,509 | £110,662 |

> **The two numbers that bound everything: Expected needs 599 visitors/month to stop losing
> money, and ~16,300 visitors/month to fund a £30,000 founder draw.**

---

## 5.3 Unit economics

| | Conservative | **Expected** | Optimistic |
|---|---|---|---|
| Net subscription revenue over lifetime | £14.35 | £22.72 | £35.40 |
| Expected merch cost | −£6.98 | **−£10.46** | −£15.39 |
| **Subscription contribution** | £7.37 | **£12.25** | £20.01 |
| **LTV per £10 buyer** | £10.74 | **£13.31** | £18.63 |
| **Gross margin on £4.99** | 48% | **50.5%** | 53% |

> **Sit with that last row.** A digital subscription should be 90%+ gross margin. Bundled merch
> at a sub-£5 price takes it to **~50%. Half of every £4.99 is gone before a penny of fixed
> cost, marketing or founder time.**

### Break-even churn is a trick question
Because merch is a **step cost triggered by progress**, higher retention does not
monotonically help. Contribution by average lifetime, at 50-unit merch pricing:

| Pace ↓ / Lifetime → | 2mo | 3mo | 4mo | 5mo | 6mo | 8mo | 15mo |
|---|---|---|---|---|---|---|---|
| 1 trial/week | £8.42 | £10.86 | £12.76 | £14.61 | £16.62 | £21.40 | £44.33 |
| **2/week** | £5.67 | £4.61 | **£4.34** | £5.08 | £6.65 | £11.50 | £36.54 |
| **3/week** | £1.86 | **−£0.36** | **−£0.78** | £0.17 | £2.04 | £7.49 | £33.93 |
| **4/week** | £0.16 | **−£3.04** | **−£3.64** | **−£2.61** | −£0.58 | £5.22 | £32.46 |

> **There is no break-even churn — there is a break-even *band*, inverted in the middle.** At
> fast pacing there is a **dead zone between ~2 and 6 months where every extra month of
> retention loses money**, because the member collects merch faster than they pay for it. Only
> past ~7–8 months does retention start paying again. **And 2–6 months is precisely the
> lifetime range the benchmarks predict.**

To cover fixed costs on subscription contribution alone: **38 active subscribers** (21 if you
ignore merch). **The merch bundle roughly doubles break-even.**

### Maximum affordable CAC
| | Conservative | **Expected** | Optimistic |
|---|---|---|---|
| **Max CAC at 3:1 (sustainable)** | £3.58 | **£4.44** | £6.21 |

> **Hard conclusion: paid acquisition is not available to this business.** £4.44 per *paying
> customer* is far below what UK paid social delivers for a cold £10 purchase from an unknown
> brand (£8–£25 CPA). **Organic, content and community — or it is not a business.** Delete
> every plan that begins "we'll run some ads to test it."

---

## 5.4 Payment processing

Stripe UK: **1.5% + 20p domestic · 2.5% + 20p EEA · 3.15% + 20p international · Stripe Billing
+0.7% · £20 per dispute · £0.50 per payout.** Blended at 85/10/5 mix = **1.6825%**.

| | Fee | Take |
|---|---|---|
| £10 Entry Pass | £0.368 | **3.68%** |
| £4.99 with Billing | £0.319 | **6.39%** |
| £4.99, international card | £0.392 | 7.86% |

> **The 20p fixed fee alone is 4.01% of £4.99 — more than double the percentage component.
> Of the 6.39% total take, 63% is the fixed fee.** You are paying a toll designed for £30
> transactions on a £5 one.

**Over six months:** 6 × £4.99 monthly costs £1.91 in fees vs £0.91 as one upfront charge —
**£1.00 per member, which is 8% of the entire £12.25 subscription contribution, purchased for
nothing.** Annual billing saves £2.20/member.

**Failed payments:** up to 13%/month decline rates; 20–40% of *all* subscription churn is
involuntary. At 5% declines and 50% recovery that's **+2.5%/month churn**, cutting lifetime
from 4.86 to ~4.4 months. **Stripe Billing's Smart Retries are worth far more than the 0.7%
they cost. Do not hand-roll billing to save 3.5p per charge.**

**Disputes:** **a single £4.99 dispute costs £24.99 all-in — ten member-months of gross
profit.** Elevated risk here because merch ships weeks after payment and £4.99 is a
low-salience line item. Free mitigations: recognisable billing descriptor, receipt on every
charge, one-click cancel, refund-on-request.

**Payouts:** daily = £182/yr for nothing. **Set weekly (£26/yr) or monthly (£6/yr).**

---

## 5.5 Merch economics — the most important finding

Landed cost per milestone (**inc. irrecoverable VAT, since you're not VAT registered**, plus
postage and packing):

| Milestone | Item | @50 units | @250 | @1,000 |
|---|---|---|---|---|
| 15 | Patch | **£5.72** | £3.15 | £2.51 |
| 30 | Tee | **£11.70** | £9.90 | £8.70 |
| 45 | **Cap** | **£22.95** | £16.17 | £12.09 |
| 57 | Finisher bib | £4.20 | £3.40 | £3.10 |
| | **Total per completer** | **£44.57** | £32.62 | £26.40 |

**The cap alone is 51% of the merch stack at launch pricing.** It is the single most damaging
line in the business.

### The completer problem, quantified (at 50-unit pricing — what you will actually buy at)

| Pace | Journey | Margin at M15 | at M30 | at M45 | **at M57** |
|---|---|---|---|---|---|
| 1/week | 12 mo | +£17.93 | +£20.24 | +£15.97 | **+£25.79** |
| **2/week** | 6 mo | +£13.25 | +£6.23 | −£7.38 | **−£2.24** |
| 3/week | 4 mo | +£8.58 | +£1.55 | −£12.05 | **−£11.58** |
| 4/week | 3 mo | +£8.58 | +£1.55 | −£16.72 | **−£16.25** |
| 7/week | 1.7 mo | +£8.58 | −£3.12 | −£21.40 | **−£25.60** |

**Findings in order:**

1. **A fast completer costs more than they pay, and it isn't marginal.** At one trial a day — exactly what a hyped launch cohort does — a completer **loses you £25.60**.
2. **The failure point is milestone 45, the cap, in every fast scenario.**
3. **Even the "typical" 2-per-week completer is unprofitable at launch pricing** (−£2.24), before fixed costs, disputes, or ~25 minutes of packing time (£17–20 unpriced).
4. **Months of subscription needed to cover the merch: 9.5. At 2 trials/week they finish in 6.**

> ### The merch bundle is priced for a 12-month journey and the product is designed for a 6-month one.

5. **The business is currently profitable only because most people fail.** Aggregate contribution stays positive because ~75% quit before the cap. **You have designed a product whose economics depend on customers not completing it, and whose marketing says they should. That contradiction gets worse if the product is good.**

### What fixes it, ranked
| Fix | Effect |
|---|---|
| **1. Gate merch on tenure as well as progress** ("trial 45 **and** 6 paid months") | Eliminates the fast-completer loss entirely. **Costs nothing. Do this regardless.** |
| **2. Raise Circuit Pass to £7.99** | 6-month completer: **−£2.24 → +£18.26**. Stripe take 6.4% → 5.2%. Still under Strava. |
| **3. Drop or downgrade the cap** | Removes 51% of the merch stack: **−£2.24 → +£20.71** |
| **4. Annual pass at £49.99** | Cash on day one, Stripe take → 2.8%, near-zero involuntary churn, merch timing problem gone |
| **5. Unbundle merch as earned-right purchases** | *"You've unlocked the right to buy the Circuit Cap — £24, members only."* The Conqueror's whole model is people happily paying £25–35 for a token |
| **6. Raise the Entry Pass to £15–£20** | It's your profitable product with no cost of goods. +£4.84 net per buyer — at 240/month that's **£1,162/month, more than the entire subscription gross profit** |

---

# 6. Financials

## 6.1 Startup costs

| Item | £ |
|---|---|
| Solicitor — T&Cs, privacy, refunds, **participation waiver** | **1,200** |
| Insurance PL+PI, year 1 | **450** |
| ICO fee | 52 (**£47 by direct debit**) |
| Initial merch stock at MOQ | **1,674** *(deferrable)* |
| Samples, artwork, digitising | 150 |
| Packaging, 200 units | 120 |
| Accountant | 400 |
| Misc | 50 |
| Contingency 15% | 614 |
| **TOTAL CASH** | **£4,710** — or **£3,036 deferring merch stock** |

**Founder time already spent:** ~450 hours (57 briefings ~114h, build 250–400h, brand ~40h).
**At £40/hr — deliberately below the £44–63/hr UK freelance market rate — that is £18,000.**

> **Total startup investment: £4,710 cash + £18,000 imputed = £22,710.** Against an LTV of
> £13.31, **the build must attract ~1,700 paying customers to have been worth doing at a
> self-employed hourly rate.** That is the honest hurdle.

**⚠️ Insurance may be a launch blocker, not a line item.** Standard fitness-instructor policies
assume *supervised* instruction. A product issuing written instructions for unsupervised
challenges to anonymous members is a materially different risk. You may find the premium
loaded well above £450, the exclusions make it worthless, or **the risk is declined outright.**
**Get a real quote with a full and accurate description before spending anything else.**

## 6.2 Monthly burn

| | Launch | 100 | 500 | 1,000 |
|---|---|---|---|---|
| **Total cash burn** | **£95.60** | £95.60 | £110.28 | £126.42 |

**Cloud infrastructure is not the constraint and should occupy no planning attention.** Burn
rises 32% between zero and a thousand members.

**The step function is human and invisible in that table:** at 1,000 members you spend up to
**25 hours a month hand-packing parcels — £1,000/month of unpriced cost, eight times the cash
burn.** Past ~300 members you need a 3PL (£1.50–2.50/order, which pushes the 2-per-week
completer from −£2.24 to −£10.24) or you need to have already fixed the bundle.

> **Note: Resend's binding constraint is not the 3,000/month volume — it is the 100/day cap.**
> A launch announcement to 300 members blows through it in one send.

## 6.3 Break-even

- Fixed costs only, ignoring merch: **21 subscribers**
- Fixed costs plus merch: **38 subscribers** *(merch roughly doubles it)*
- **Integrated (Expected): 599 visitors/month to cover costs; 16,259 visitors/month to fund a £30,000 draw**
- Subscribers needed to quit the day job: **1,030**

> **The genuinely encouraging number: ~16,300 visitors/month — about 540 a day — funds a
> £30,000 income while staying under the VAT threshold.** That is not outlandish for a
> well-executed content brand. It is the one result that says this could work.

## 6.4 Cash flow

**Traffic assumption (the shakiest input in the document): 300 visitors in month 1, compounding
25%/month to 3,492 by month 12.** If traffic is flat at 300, Expected loses £47.70 every month
forever.

**Conservative:** monthly break-even month 10; **cumulative still £286 down at month 12** on
top of £4,710 startup. **Does not repay its own startup cost within two years.**

**Expected:** monthly break-even **month 5**; cumulative cash-positive **month 13** including
stock. **Peak cash requirement £1,616 at month 4**; total funding need ~£4,650.

### The timing problem, specifically
**(i) The accrual problem.** Merch is £0 for two months, then £2.79 → £8.17 → £10.22 → **£19.73
at month 6** (a 93% jump while revenue grows 26%) as the first cohort hits the cap.
**Subscription revenue is an annuity; merch cost is a step, 71% front-loaded into months 3–5.**
**Growth makes the cash position worse, not better.**

**(ii) The MOQ problem.** The cap has a 50-unit MOQ at £915. At month 6 you have ~**3 members**
approaching milestone 45. You lay out £915 to serve three people and hold £860 of dead stock in
fixed head sizes. Worse for the tee: a "250-unit" order is really 5 × 50 across S–XXL, **so the
volume discounts are largely unreachable.**

**Mitigations:** **print-on-demand for tee and cap in year one** (higher unit cost, but zero
inventory, zero MOQ, zero size risk — removes the entire £1,470 peak drawdown and pulls cash
break-even from month 13 to month 8) · **batch-ship** patch+tee and cap+bib together (halves
postage and packing) · **order the cap last**.

## 6.5 Sensitivity

| Variable (±25%) | Swing | Rank |
|---|---|---|
| **Visitor → £10 conversion** | **£19,164** | **1** |
| Subscription price | £10,235 | 2 |
| Lifetime / churn | £9,815 | 3 |
| Subscription attach rate | £5,294 | 4 |
| Merch cost per item | £4,521 | 5 |

**Three readings:**
1. **The real answer is a variable that couldn't be in the table: traffic.** It is linear and unbounded — double it, double the outcome. It is also the only variable with **zero supporting evidence**. Everything else is a rate; traffic is the multiplier they all act on.
2. **Of what you control, visitor→£10 conversion dominates.** It multiplies through both revenue lines. **Landing page and offer clarity are worth ~4× the effort of subscription paywall optimisation** — which is not where most founders spend their time.
3. **Attach rate ranks fourth at ±7%**, which directly answers the dual-monetisation question: **the subscription barely moves the outcome because it barely makes money.**

### The step-change the table can't show: VAT
Registration triggers at **~36,181 visitors/month (~633 subscribers)**. Post-registration:
LTV per buyer **£13.31 → £10.73 (−19%)**, max CAC £4.44 → £3.58, subscription contribution
−25%. **Crossing £90,000 costs ~£13,400 of annual founder income and you must grow traffic
~24% just to stand still.** It caps realistic founder income near **£65,000** before the cliff.

**A related trap:** B2C digital services to EU consumers have **no distance-selling
threshold** — the **EU OSS €10,000 threshold is independent of the UK £90,000 one.** Either
geo-restrict signups to the UK at launch or budget for OSS compliance.

---

## Bottom line

**Does the model work at plausible volumes? Qualified yes — but not as currently priced.**

**What works:** the fixed cost base is tiny (£95.60/month), break-even is ~600 visitors/month,
and 16,300 visitors/month funds a £30,000 income under the VAT threshold.

**What is broken:**
1. **The merch bundle is priced for a 12-month journey; the product is designed for a 6-month one.** Your most enthusiastic customers are your biggest losses, and the business is solvent only because 75% quit before the cap.
2. **£4.99 is too cheap.** The closest comparator charges £25–35 for a single medal.
3. **Paid acquisition is unavailable.** Max CAC £4.44.
4. **The subscription contributes only 28% of gross profit.** The £10 Entry Pass is the business.

**Priority of changes** — items 1–3 cost nothing and can be done before launch:

| # | Change | Effect |
|---|---|---|
| 1 | **Gate merch on tenure as well as progress** | Eliminates the fast-completer loss |
| 2 | **Circuit Pass → £7.99** | 6-month completer −£2.24 → **+£18.26** |
| 3 | **Replace or drop the cap** | −£2.24 → **+£20.71** |
| 4 | Print-on-demand year one | Cash break-even month 13 → month 8 |
| 5 | £49.99 annual pass | Cash upfront, fees 6.4% → 2.8% |
| 6 | Test Entry Pass at £15–£20 | +£1,162/month at 240 buyers |

> **I would not launch without at least item 1.**

**Least confident assumptions, in order:** traffic (no evidence, everything scales off it) ·
member pacing (determines whether the merch problem is a nuisance or fatal) · the £10→sub
attach rate (no comparable product uses this structure) · merch quotes (**published list
prices, not quotes — get three real quotes for the cap**) · the retention curve (borrowed from
mobile apps; a browser product with no push notifications may retain worse) · **whether the
insurance is obtainable at all — the one that could invalidate everything else.**
