# 11. Metrics Dashboard — and where the brain lives

> Status: **built and live.** Written 22 Aug 2026.

---

## 11.1 Where the brain lives

The brief said this should be a single point of truth to return to each time. There are two
different kinds of thing being stored, and they want different homes.

### The decision

| What | Where | Why |
|---|---|---|
| **The plan** — strategy, market, pricing, product spec, risks | **`/docs` in this repository**, as markdown | Versioned, diffable, free, portable, and it sits next to the thing it describes. Every change is dated and attributable, so a decision reversed in November can be traced back to what was believed in August. |
| **The numbers** — funnel, revenue, progress, obligations | **The Pulse**, in the admin panel at `/admin` | Live, from the database, never stale, and impossible to forget to update |

### Why not Notion

Notion is connected to this account, but it's the **Wingstop workspace** — the one with the
KDS competition and sales analysis pages. A personal venture's business plan, financial
model and risk register should not live in a workspace associated with an employer. That's
poor separation at best, and potentially a genuine problem depending on who owns that
workspace.

**If you want Notion** — and it is a nicer editing surface than markdown — create a
*separate* workspace under `the57trials@gmail.com`, tell me, and I'll port `/docs` across in
minutes. Markdown converts cleanly. Nothing here is locked in.

### Why the numbers are not in a spreadsheet

A metrics spreadsheet is a promise to do data entry every week, and that promise is always
broken by about week five. The Pulse reads the live database, so it cannot go stale and
cannot be forgotten.

---

## 11.2 The Pulse — what is now live

`the57trials.com/admin` → **THE PULSE** tab. Admin only, enforced server-side.

### The headline
**Monthly Recurring Revenue** — active Circuit Passes × £4.99. Shown alongside total entry
fees banked, deliberately labelled as one-off and *not* counted as recurring, because
conflating the two is the easiest way to flatter yourself into thinking there is a business.

### The funnel
| Tile | Answers |
|---|---|
| Signed up | Is anyone arriving? |
| Paid the entry | Does the landing page and the £10 ask work? *(shown as % of signups)* |
| On the circuit | Does the second payment work? *(shown as % of those who paid)* |
| **Stalled at 06** | **How many people paid £10, hit the wall, and said no** |

That last tile is the most important number on the page, and it is the one flagged in
rust. Every member sitting in it is a specific person who liked the product enough to pay
once and not enough to pay twice.

### Progress
Started · average trials cleared · total clears · finishers. Together these say whether the
format holds attention or whether people buy and drift.

### Merch obligation
Awaiting post · total earned. Flagged when anything is owed. This is a **liability**
tracker, not a vanity metric — every unshipped row is a promise made and a cost incurred.

### History
A daily snapshot at 02:05, kept for 90 days, driven by `pg_cron`. Point-in-time counts can
always be recomputed; **change over time cannot be reconstructed after the fact**, which is
why the job exists from day one rather than being added when someone wants a chart.

The MRR sparkline appears once there are two days of history. Single series, so no legend
and no colour-coded categories — the label names it.

---

## 11.3 What is deliberately not measured yet

Being honest about the gaps matters more than a fuller-looking dashboard.

| Metric | Why it's missing | What it needs |
|---|---|---|
| **Visitor → signup conversion** | No analytics installed at all. We cannot see how many people reach the landing page. | A cookieless, self-hosted analytics tool. Anything with cookies triggers a consent banner and a GDPR transfer disclosure — currently avoided entirely, which is worth protecting. |
| **Cohort retention / true churn** | Needs months of history. The snapshot table starts accumulating today. | Time. Revisit at 90 days. |
| **CAC** | No acquisition spend yet, and no attribution. | UTM tags on every link from day one, even organic ones. |
| **Per-trial drop-off** | We record clears, not views. We know where people *stop*, not which trial *loses* them. | A view event per trial. **This is the highest-value missing metric** — it tells you which trial to rewrite. |
| **Support volume** | No ticketing; it's an inbox. | Nothing, until volume justifies it. |
| **Merch cost per member** | Real supplier costs are still estimates. | Actual quotes, then a cost field on each milestone. |

---

## 11.4 How to read it

**Weekly, five minutes.** Open the Pulse. Three questions:

1. **Is "stalled at 06" growing faster than "on the circuit"?** If yes, the pricing model is
   the problem, not marketing. Do not respond by driving more traffic into a funnel that
   leaks at the paywall.
2. **Is average cleared rising?** If members plateau at 2–3 trials, the content isn't holding
   them and no amount of acquisition fixes it.
3. **Is anything owed in merch?** Unshipped milestones are the fastest way to lose the trust
   of the exact members who are succeeding.

**Monthly.** Compare against the plan in [§10 Risks](10-risks-and-assumptions.md), and
specifically against the kill criterion recorded there. The value of writing that number
down in August is that it cannot be quietly moved in November.

---

## 11.5 The one that isn't on the dashboard

**Trials written vs. the leading member's position.**

The content pipeline is the biggest operational risk in the business: a strictly sequential
product with no content left is a product that visibly breaks. That gap should be a single
number on the admin panel, and it is the next thing worth building.

Rule proposed in §8: never let the buffer fall below the fastest member's position plus ten.
