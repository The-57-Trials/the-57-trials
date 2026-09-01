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

### D11 — Two registers: bib numbers and finisher numbers
**Decided by Rob, 31 Aug 2026.**

**Bib numbers** mark *entry*, assigned at signup, permanent, never reissued.
**Finisher numbers** mark *arrival*, assigned on clearing trial 57, permanent, never reissued.

They are independent. A member can be Bib 0412 and Finisher 003.

This resolves a collision: both the pre-launch grading cohort and "the first fifty-seven
finishers" had been proposed for bibs 001–057. The grading cohort takes 001–057 plus a
permanent FOUNDING mark, since they earned it before there was anything to join. Finisher
numbers start at 001 separately and never run out.

**The first person to clear trial 57 becomes Finisher No. 001**, permanently, and their
finisher's plate is hand-numbered 001. No additional prize.

#### The framing rule — this is the important part

> **Record who was first. Never offer it as a prize.**

Announcing a reward for finishing first would create a race with a prize on a product where
nothing is verified — every problem the speed leaderboard had (D8), concentrated into one
person's decision-making. Simply keeping the Register in completion order means the first
person is first forever and nobody rushed for it.

Note the cooldowns already make this safe by construction: nobody can finish in under 147 days
regardless of effort, so "first" is decided by when someone joined and by not stopping — never
by pushing harder on any given day.

**No material prize attaches to being first.** The moment there is something to win, there is
a reason to lie.

### D12 — Witnessed trials on 48-57, not live-streamed trials
**Decided by Rob, 31 Aug 2026.** Full spec in section 17.

The proposal to require trials 20/30/40/50 be performed live on social media is **not taken**.
The instinct - make some trials weightier - is kept; the mechanism changes.

Broadcast was rejected because it would exclude a large share of paying customers (no social
media, privacy or safety reasons, self-consciousness - and this audience is drawn to austerity,
not performance), because performing for a camera pushes people harder on an unsupervised
physical task, because a stream can be staged or faked so it verifies nothing anyway, and
because "nobody checks" and "we check four times" cannot both be true.

Instead: **trials 48-57 record a named witness.** Those trials already require a named
check-in person before the member starts, for safety - so they are already the assessor, and
asking their first name afterwards costs nobody anything. It also puts the mechanism on the
ten trials where the risk actually is.

**First name and relationship only. Never contact details, never contact them.** Emailing a
witness would mean processing the personal data of a non-customer, with its own lawful basis,
privacy notice and deletion path. The deterrent was never that anyone would ring Sarah - it is
that the member had to write "Sarah" down.

Optional on every other trial. Never mandatory outside 48-57: a member with nobody to name
must not be locked out, because isolation is not something to paywall.

### D13 — The Library, the Sealed Letter, and the Book
**Decided by Rob, 31 Aug 2026.** Full spec in section 18.

**The through-line: you open it with a pen and you close it with a book.**

**Trial 01 is a written letter** - why you are here, and what will make you quit - typed on a
page in a typewriter or plain handwriting face, then SEALED with a wax seal and **lodged** in
the member's Library. Sealed and filed the way a will is, not cast adrift in a bottle: the
point is that it comes back deliberately at Trial 53, alongside the Trial 09 letter.

**The Library is the one warm room.** Everything else in the product is cold on purpose, and
the contrast is the design rather than a departure from it. It holds the letters, the bib,
milestones, the Trial Blazer card, witnesses, grades and the finisher number - and answers a
question nothing else could: what do I actually own after five months?

**A finished Library can be shared** by public link. Only a finished one, which makes it a
five-month receipt rather than a marketing asset. **The letters are never shared by default** -
each is opted in individually or not at all, revocable, noindex. People will write things in
Trial 01 they have never said aloud, and getting this wrong once would end the trust the
product runs on.

**At 57 the member unlocks the right to buy a printed book** of their own run - the briefings,
the dates, the witnesses, the grades, and both letters. Print-on-demand, never sold to anyone
who has not finished. This inverts the worst finding in the financial model: finishers were the
thinnest margin in the business, and the book makes them the most profitable member instead.
It also answers what comes after 57.

**An auto-generated video was considered and rejected.** There is no footage, so it would be
text and dates over music - Spotify Wrapped, the opposite of everything else here. A register
produces documents, not montages.

### D14 — Trial 53, THE RECKONING
**Decided by Rob, 31 Aug 2026.** Spec in section 18.7.

Both seals break. A **two-minute pause** with nothing to do but read your own words. Then the
button - **ARE YOU READY TO FACE YOURSELF?** - and one required question: *were you right about
yourself?* It ends with an irreversible choice: lodge the letters permanently, or release and
destroy them.

Two equal routes to answer, write it or say it aloud to your witness - not ranked, because
speaking is harder for most people and easier for some. Scaling within either: one sentence
answering the required question fully clears the trial, so nobody is kept from finishing for
not being a writer.

The Library records **that** a letter was released and when, never its content. The absence is
itself a record.

The design principle worth keeping: **the member wrote this trial themselves on day one
without knowing it.** Its difficulty comes from their own words, not ours - which makes it
unfakeable, unrepeatable and different for every member.

### D15 — HOLD trials take as long as they say (supersedes the 147-day figure in D2)
**1 Sep 2026.** Raised by Rob: *"having to complete trial five is a trial that has to take
1 week."* It didn't - nothing stopped a member clearing SEVEN GLASSES the day it opened.
Seven other HOLD trials had the same hole.

`min_gap_minutes` already did the job and nobody had noticed: it gates *clearing* trial N
against when N-1 was cleared, and N opens the moment N-1 clears. So the gap on a HOLD trial
**is** the trial. Set to max(cooldown, duration) on all eight. No schema change; the app
tells the two apart from `trial_type`.

**Minimum completion is now 195 days, not 147.** That figure appears in the financials and
in customer-facing copy and needs updating in both.

**It improves the economics.** The Circuit-paying window goes from ~4.7 months to ~6.1
months, so the fastest possible completer - the worst case the modelling worries about -
pays roughly £13 more. That scenario stood at +£12.63; it is now roughly double that.
The tightest margin in the business got looser because the trials were made honest.

**Open:** §4.1 says nine HOLD trials, the roadmap lists eight. One of the two is wrong.
