# 4. Product — Content Architecture

> Status: draft specification, ready to produce from. Written 22 Aug 2026.
> Decisions flagged at the end are yours to overrule.

---

## 4.0 Three things to fix before any content ships

**1. The leaderboard rewards the behaviour that will hurt someone.** Ranking by clears,
tiebroken by who arrived first, makes the optimal strategy a three-hour walk on four hours'
sleep because someone is two trials ahead. You cannot write "don't rush this" in a briefing
while the only scoreboard pays for rushing. Also: on unverified self-reported data, a speed
board is a lying contest.

- Primary rank: trials cleared. Keep.
- Tiebreak: **lowest bib number** — unmanipulable, rewards joining early.
- Remove all timestamps from the UI. No "fastest to 30", ever.
- Add **THE LONG LINE**: consecutive weeks with at least one clear. This rewards showing up,
  which is the actual product, and belongs on the homepage.

**2. Pre-participation screening at checkout.** Now built — see the signup consent gates.

**3. A fixed app-rendered footer on every trial page**, not written into the markdown:
> *Self-directed. Unsupervised. You are responsible for judging whether today is the day.
> Stop is always a legal move. Nothing here is medical advice.*

---

## 4.1 What a trial is

### Anatomy

One markdown document, one page, one button. No tabs, no video, no timer.

| Block | Fixed? | Notes |
|---|---|---|
| **Header strip** | App-rendered | Number · chapter · type · flag · PRIME stamp |
| **THE LINE** | Always | 1–3 sentences. What this is **and why it exists**. See the rule below. |
| **THE WORK** | Always | Numbered instructions. A stranger must need no clarification. |
| **PRE-FLIGHT** | Trials 48+ | Conditions that must be true before starting. |
| **THE RUBRIC** | Always, five fields | RISK / GROUND / STOP / SCALE / CLEARED WHEN |
| **CHECK-IN** | Trials 48+ | Named person, agreed time, what happens if you don't report. |
| **NOTE** | Optional | ≤40 words. Lore. Where 5757 leaks in. |

> **THE LINE must give a reason, not just a description (D16).**
> Self-determination theory's strongest and cheapest autonomy lever is a *meaningful
> rationale* — and a briefing that only says what to do supplies none. "The first physical
> trial, thirty minutes outdoors" is a description. "It is here because everything later
> assumes you can be alone with yourself while your body works" is a reason. Every briefing
> needs the second kind. One sentence is enough.

**Length:** FOUNDATION 200–350 words · DISCIPLINE/ENDURANCE 300–450 · PRESSURE/MASTERY
350–550 · ASCENSION 550–850.

**Voice:** second person, imperative, present tense. No exclamation marks, no "you've got
this", no emoji, no motivational framing. Difficulty stated flatly, never celebrated. The
app acknowledges rather than congratulates: *"Trial 06 cleared. Trial 07 is open."*

The one permitted warmth is scaling: *"Scaled counts. It's the same trial."*

### The five types
**MOVE** physical session (~30 of 57) · **HOLD** multi-day streak (9) · **MARK** writing or
reflection (10) · **CRAFT** a skill or finished thing (5) · **SIGNAL** involves another
person (6).

### The Primes rule
**Every prime-numbered trial is non-physical** — 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37,
41, 43, 47, 53. Sixteen trials, all MARK/HOLD/CRAFT/SIGNAL, each carrying a small PRIME
stamp that the app never explains.

Three jobs at once: it gives the 5-and-7 lore a real mechanic instead of decoration; it caps
the physical run-length at three, guaranteeing recovery; and it stops the roadmap drifting
into 57 workouts.

### The safety rubric — five fields, written fresh every time
Copy-pasting a generic rubric trains members to skip it, which is exactly what must not
happen by trial 50.

- **RISK** — the two or three specific things that go wrong *in this trial*. Not "injury" — "trips on the step", "blisters at hour two". Specificity is what gets it read.
- **GROUND** — environment as a requirement: surface, space, equipment, lighting, phone reachable. From 48, includes bail-out points.
- **STOP** — conditions to stop today, trial stays open. Four constants every time: chest pain or tightness · breathlessness not settling within a minute · dizziness not clearing on sitting · any sharp or new pain. **Stopping never costs progress.**
- **SCALE** — a concrete smaller version, always sufficient to clear.
- **CLEARED WHEN** — never "when you can't do any more", never a time to beat. A completed quantity at a controlled effort.

### Flags
**GREEN** (01–19) everyday exertion · **AMBER** (20–47) longer/heavier/worse conditions,
rubric gains fuelling and weather clauses, the word *postpone* appears · **RED** (48–57)
full briefing, **PRE-FLIGHT and CHECK-IN mandatory**.

The RED tier is the structural answer to isolation: by the time anyone is out for three
hours alone, "somebody knows where I am" is a habit the product installed twenty trials
earlier.

### Global exclusions — never added later
Breath-holding, submersion, open water, heights, climbing, deliberate cold or heat exposure,
fasting, dehydration, sleep restriction, maximal or to-failure work, one-rep maxes, unspotted
loaded barbell work, timed distance targets, any instruction to continue through pain, and
anywhere help could not reach.

---

## 4.2 Example — FOUNDATION (publication-ready)

**TRIAL 06 · CHAPTER I FOUNDATION · MOVE · FLAG: GREEN**

### THE STACK

**THE LINE**

Five movements. Three rounds. Nothing heavy, nothing fast. This is the session you will be
sent back to at Trial 18 and again at Trial 26, so learn it properly the first time.

**THE WORK**

One round is:
1. **Sit-to-stand** — from a stable chair, stand fully, sit fully. Ten.
2. **Wall press** — hands on a wall at shoulder height, chest to wall, push back. Ten.
3. **Step-up** — onto a step no higher than your knee. Ten each leg.
4. **Hinge** — feet apart, hands sliding down your thighs, push your hips back, stand. Ten.
5. **March** — on the spot, knees to comfortable height. Sixty seconds.

Three rounds. **Rest as long as you want between rounds** — two minutes, five, ten. There is
no clock on this trial and there never will be.

Hold a pace you could hold a conversation through. If you couldn't say a full sentence,
you're going too hard. Slow down; that's not scaling, that's the instruction.

**THE RUBRIC**

*RISK* — Light-headedness standing up from the chair. Catching a toe on the step. Wrist ache
on the wall press. None of these are serious if you're paying attention; all three are how
the session goes wrong.

*GROUND* — Indoors. Two metres of clear floor. A chair that doesn't slide or roll. A step
that is fixed, dry and lit. Shoes on or bare feet, not socks. Phone within reach. Water
within reach.

*STOP* — Stop for the day if any of these happen: chest pain or tightness · breathlessness
that doesn't settle within a minute of stopping · dizziness that doesn't clear when you sit
down · any sharp or new pain. Also stop if the step feels unsteady or you catch your foot
once — move to the march. Stopping costs you nothing. The trial stays open. Come back
tomorrow.

*SCALE* — Any of these clears the trial: one round instead of three · five reps instead of
ten · hands higher on the wall · skip the step and march for ninety seconds · split the
rounds across the day.

*CLEARED WHEN* — You've done the rounds you set out to do, at a pace you could talk through.
Not when you're tired. Tired is not the target and never has been.

**NOTE**

Every session you'll ever do is this one with the numbers changed.

---

## 4.3 Example — ASCENSION (publication-ready)

**TRIAL 52 · CHAPTER VI ASCENSION · MOVE · FLAG: RED**

### THE LONG GROUND

**THE LINE**

Three hours on your feet at conversational effort. Not a hike, not a race, not a test of
grit — a long, deliberately boring, entirely controlled block of time in which nothing
dramatic should happen. If something dramatic happens, you planned it wrong.

Read this whole page today. Do the trial another day. That's not a suggestion.

**PRE-FLIGHT** — every line must be true. Not most of them.

- **Route planned and written down**, on ground you've walked before, with at least three points where you can stop and get a bus, taxi or lift home. No section more than forty minutes from a bail-out.
- **Route shared** with your check-in person before you leave.
- **Phone above 80%**, plus a battery pack.
- **A litre of water minimum**, more in warm weather, and food you've eaten before.
- **You ate a proper meal within four hours.** This trial is never done fasted.
- **Footwear you have already walked two hours in.** New boots fail this trial, painfully, at hour two.
- **Weather checked.** Postpone for any amber or red warning, ice or standing frost, thunderstorms, or heat above 26°C. Rain is fine. Ice is not.
- **You slept.** Under five hours last night, this is not the day.
- **No injury, no illness in the last seven days, not hungover.**

If any line is false: **postpone, don't scale.** Pre-flight is not scalable.

**THE WORK**

1. Walk your route for **three hours** at conversational effort. If you cannot speak a full sentence, you are too fast. No pace target, no distance target. Time on feet is the exercise.
2. **Stop five minutes every forty-five**, whether you need it or not. Sit if you can. This is part of the work.
3. **Drink at every stop.** Eat at ninety minutes and again at two and a half hours, hungry or not.
4. **Check your feet at ninety minutes.** A hot spot at ninety is a blister at two hours. Tape it or turn back.
5. **Headphones out** on any road, shared path, or unlit section.
6. Finish where you can sit down, get warm, and eat.

**THE RUBRIC**

*RISK* — Blisters and chafing, near-certain, which is why the foot check exists.
Underfuelling at hour two: light-headedness, shakiness, poor decisions. Rolled ankle on wet
ground late on, when you're tired and lifting your feet less. Getting cold once you slow or
stop. Overheating in warm weather. Phone dying.

*GROUND* — Known route. Made paths or pavement. **No trail you haven't walked, no ground
where a rolled ankle leaves you unreachable, no section without phone signal, no moorland,
no coastal path, no water crossings, no scrambling, no darkness.** If the route would be hard
to describe to an ambulance dispatcher, it's the wrong route.

*STOP* — Stop and get home if: chest pain or tightness · breathlessness not settling ·
dizziness, nausea or confusion that doesn't clear after sitting, drinking and eating · any
sharp or new pain, particularly knee, ankle or hip · a blister that's formed · shivering, or
you can't get warm after a stop · you've stopped sweating in warm weather, or headache with
no urine passed in three hours · weather turns · **it goes dark and you didn't plan for it**.

Use a bail-out. Call the lift. That is what they are for, and using one is not a scaled
trial — it's a correctly-executed trial that ended early.

*SCALE* — **Two hours instead of three**, same rules · **two blocks of ninety minutes** with
a proper meal between · **loop a short circuit** — a 20-minute loop walked nine times is
completely legitimate and genuinely safer, keeping you near home, water and a toilet ·
**take someone with you**. Scaled clears the trial. No record is kept of which version.

*CLEARED WHEN* — You've completed the time you planned, at conversational effort, with the
stops taken, and you've reported in. Not when you're wrecked.

**CHECK-IN** — not optional.

Before you leave, one named person gets your route, start time, and expected finish. Message
them at halfway. Message them on finishing. Agree in advance what they do if you don't
report within thirty minutes of expected finish: call you, then call whoever is nearest the
route. If nobody is available today, the trial waits.

**NOTE**

The five-minute stop at forty-five minutes is the trial. The walking is just what happens in
between.

---

## 4.4 The full 57

**★ = milestone (merch)** · **P = prime, non-physical by rule**

### I FOUNDATION — 01–09 · GREEN
*Claim a number. Learn to report honestly. Finish something small.*

| # | Title | Type | One line |
|---|---|---|---|
| 01 | THE BIB | MARK | Write by hand why you're here and what will make you quit. Kept for 53. |
| 02 P | THE INVENTORY | MARK | Account for one day hour by hour, then mark the hours you actually chose. |
| 03 P | THE PLEDGE | MARK | The sentence you'll say when you want to stop. Ten words maximum. |
| 04 | FIRST GROUND | MOVE | Thirty unbroken minutes walking outdoors. No headphones, no destination. |
| 05 P | SEVEN GLASSES | HOLD | Seven days: a full glass of water before anything else, logged each morning. |
| 06 | THE STACK | MOVE | Three rounds of five movements at a talkable pace. You return to this twice. |
| 07 P | ONE THING FINISHED | CRAFT | Finish one thing carried unfinished for over a month. Any size. |
| 08 | THE CARRY | MOVE | Carry a loaded bag a mile on level ground. Set it down as often as you like. |
| 09 | THE LINE | MARK | What clearing 57 will actually look like for you. Sealed until 53. |

### II DISCIPLINE — 10–19 · GREEN
*Short, frequent, repeatable. Showing up when you don't want to.*

| # | Title | Type | One line |
|---|---|---|---|
| 10 | THE SAME HOUR | HOLD | Ten days, same fifteen-minute window. Miss one and it restarts — only you know. |
| 11 P | SILENT HOUR | HOLD | Five days, one hour with no screen and no input. Boredom is the exercise. |
| 12 | THE THOUSAND | MOVE | A thousand stair steps across a week, handrail in reach. |
| 13 P | THE LEDGER | MARK | Record every pound for seven days. No judgement, no changes. |
| 14 | GROUND WORK | MOVE | Twenty unhurried minutes: get down, get up, ten times, resting whenever. |
| 15 ★ | THE FIFTEEN | MOVE | Fifteen minutes continuous at a pace you could double. The first clock trial. |
| 16 | THE EARLY BIB | HOLD | Five days out of bed and moving within fifteen minutes of the alarm. |
| 17 P | ONE REFUSAL | MARK | Say no to one thing you'd normally accept. Write what it cost. |
| 18 | THE REPEAT | MOVE | Trial 06 again. Same work, better form, no faster. |
| 19 P | THE THIRD | MARK | What's actually changed, and what you've been pretending about. |

### III ENDURANCE — 20–29 · AMBER
*Duration, never intensity.*

| # | Title | Type | One line |
|---|---|---|---|
| 20 | THE HOUR | MOVE | One hour continuous outdoors, route planned and shared before you leave. |
| 21 | TWENTY-ONE DAYS | HOLD | Twenty-one consecutive days of one ten-minute session. The longest hold. |
| 22 | THE LOAD | MOVE | Carry a loaded bag three miles with planned rest stops. |
| 23 P | THE FINISHED BOOK | CRAFT | Finish a book you started and abandoned. |
| 24 | THE LONG WALK | MOVE | Ten miles in one day, split however you like, food and water carried. |
| 25 | THE SECOND HOUR | MOVE | An hour on ground you've never covered. Route shared, bail-outs known. |
| 26 | THE SLOW ROUND | MOVE | Trial 06 at half speed. Control, not effort. Harder than it reads. |
| 27 | SEVEN AND SEVEN | HOLD | Seven days: seven minutes each morning, seven each night. |
| 28 | THE UNAIDED MEAL | CRAFT | Cook one meal from raw ingredients with no recipe on a screen. |
| 29 P | THE WITNESS | SIGNAL | Tell one person out loud what you're doing and how far you've got. |

### IV PRESSURE — 30–38 · AMBER
*Discomfort that is never danger.*

| # | Title | Type | One line |
|---|---|---|---|
| 30 ★ | THE THIRTY | MOVE | Thirty minutes continuous in weather you'd normally cancel for. Rain, not ice. |
| 31 P | THE PUBLIC REP | SIGNAL | Do your session where people can see you. Don't explain yourself. |
| 32 | THE FLAT DAY | MOVE | A session on a day you feel flat. Half volume clears it — that's the lesson. |
| 33 | THE BROKEN HOUR | MOVE | One hour as six ten-minute blocks across a day you don't control. |
| 34 | THE HARD CONVERSATION | SIGNAL | Have the conversation you've avoided for a month. |
| 35 | FIVE BY SEVEN | MOVE | Five rounds of seven minutes, full recovery. No round faster than the first. |
| 36 | THE DOUBLE | MOVE | Two sessions in one day, morning and evening. Neither hard. |
| 37 P | THE AUDIT | MARK | Reread Trial 02. Do it again for today. Write what moved. |
| 38 | THE UNCOMFORTABLE PACE | MOVE | Thirty minutes one notch above easy, steady, never climbing. |

### V MASTERY — 39–47 · AMBER
*Quality replaces quantity. Teaches self-programming, which is what makes 48–57 safe.*

| # | Title | Type | One line |
|---|---|---|---|
| 39 | THE FILMED SET | CRAFT | Film one set. Watch it back. Write three faults. |
| 40 | THE CORRECTION | MOVE | Repeat 39 having fixed one fault. Lighter, slower, cleaner. |
| 41 P | THE TEACH | SIGNAL | Teach one person one thing you've learned here. Badly is fine. |
| 42 | THE PROGRAMME | CRAFT | Write your own four-week plan. Name every session and every rest day. |
| 43 P | THE REST DAY | HOLD | One deliberate, planned rest day, logged as work. It is work. |
| 44 | THE REBUILD | MOVE | Run week one of your own programme. Change nothing on the fly. |
| 45 ★ | THE FORTY-FIVE | MOVE | Forty-five minutes continuous, finishing easier than you started. |
| 46 | THE ROUTE | CRAFT | Plan a route you've never taken. Walk or ride it end to end. |
| 47 P | THE SECOND WITNESS | SIGNAL | Bring one person for a full session. Their pace, not yours. |

### VI ASCENSION — 48–57 · RED
***Every trial requires PRE-FLIGHT and a named CHECK-IN,** including the reflective ones —
the habit is the point.*

| # | Title | Type | One line |
|---|---|---|---|
| 48 | THE OPENING LAP | MOVE | Ninety minutes on a shared route with known bail-outs. Check-in protocol begins. |
| 49 | THE SPLIT DAY | MOVE | Three sessions totalling ninety minutes. No single session over forty. |
| 50 | THE HALF DISTANCE | MOVE | Half of whatever your 57 will be. Full stop when you hit it, however good you feel. |
| 51 | THE QUIET WEEK | HOLD | Seven days on your own programme. No leaderboard, no logging in. |
| 52 | THE LONG GROUND | MOVE | Three hours on your feet. Supported route, scheduled stops, two check-ins. |
| 53 P | THE RECKONING | MARK | Open Trial 09 and Trial 01. Answer them honestly. Amend if you were wrong. |
| 54 | THE CARRY HOME | MOVE | A load that means something, a distance that means something. Under ⅕ bodyweight. |
| 55 | THE HANDOVER | SIGNAL | Take someone through their first session. You lead, they follow, their pace. |
| 56 | THE FULL DRESS | MOVE | Rehearse 57 at two-thirds. Everything identical except the distance. |
| 57 ★ | THE FIFTY-SEVENTH | MOVE | Your declared finish. Named, planned, witnessed, scaled to you, slower than you want. |

### Progression logic — four curves, only one physical

1. **Duration, not intensity.** 30 min (04) → 15 continuous (15) → 60 (20) → 90 (48) → 3 hr (52). Nothing asks for speed, load beyond a fifth of bodyweight, or maximal effort. A hard-but-safe progression is *longer*, not *heavier* — the failure mode of long is fatigue; the failure mode of heavy is a torn tendon.
2. **Autonomy rises.** I–IV instruct. V teaches self-programming (39–44). VI is largely self-specified — **50, 54 and 57 are defined by the member.** By ASCENSION the content cannot know what is safe for that individual, so it stops trying and supplies framework, pre-flight and check-in instead. It also makes the finish personal.
3. **Social exposure rises:** 29 → 34 → 41 → 47 → 55. A retention engine dressed as content — every SIGNAL trial creates an off-platform accountability tie — and doubles as safety architecture.
4. **Self-knowledge rises** through the MARK spine: 01 → 02 → 19 → 37 → 53. Trial 53 reading Trial 01 back is the emotional payload of the whole product, and it costs nothing to produce.

### Why mixing types is right — the retention argument
A 57-workout product has one failure mode that kills the subscription: injury, illness or a
work trip means the member can clear **nothing**, and because the sequence is strictly
enforced they are hard-blocked, and they churn. With five types interleaved and primes
guaranteed non-physical, the maximum distance from any point to a trial you can do from an
armchair is **two trials**.

It also fixes the thing that would make this indefensible: a pure workout ladder with no
verification is a strictly worse free training plan. **The MARK and SIGNAL trials are what
you're actually selling.**

*The cost, honestly:* someone expecting a fitness programme will hit "write about your day"
at trial 02 and bounce. Mitigate on the sales page, not in the content — say up front that
only about half are physical.

---

## 4.5 Pacing

**Recommendation: pace with content first, enforce gaps second, and set gaps invisible to a
normal user and binding only on a speedrunner.**

Nine HOLD trials and two multi-day MARK trials impose **70 days of unavoidable elapsed time**
from the sequence itself. That is pacing that costs nothing in frustration, because the
member is doing something every one of those days. A gate saying "come back tomorrow" feels
like a paywall; "day 4 of 7" feels like the product.

| Range | `min_gap_minutes` | Reason |
|---|---|---|
| 01–05 | **0** | The Entry Pass window must be frictionless. This is your conversion window. |
| 06–19 | **720** (12h) | Prevents two physical sessions in one sitting. Invisible to daily users. |
| 20–38 | **1440** (24h) | Hour-long sessions; one a day is already the ceiling. |
| 39–47 | **1440**, 2880 on 46–47 | Two days after THE FORTY-FIVE. |
| 48–56 | **2880** (48h) | Where injury risk concentrates. |
| 57 | **10080** (7 days) | A taper, described as one: *"Trial 57 opens in six days. That's the taper. Rest."* |

**Fastest possible completion: ~14 weeks.** Realistic median 6–9 months.

**Make the gate not feel like a paywall:** state the reason and exact time in brand voice
(*"Trial 49 opens 06:40 tomorrow. Forty-eight hours between long sessions. That's the trial
too."*); put pacing on the sales page — "this takes months, that's the product"; never let a
gap be bought, or the whole thing becomes a slot machine.

---

## 4.6 Milestone merch

The constraint: **included, not sold.** Anything that looks boxed-and-bought defeats the
purpose. The through-line is **personalisation and evidence** — every item carries the bib
number; every item after the first carries something that can only exist because of what
came before. They arrive on the four clock trials, which members will notice around 30.

| Milestone | Item | Why |
|---|---|---|
| **15** | **The bib.** A real race bib, correct material, permanent number, `5757` in the corner. Posted flat. | The number has existed in the app since day one; this makes it physical. Cheapest item, most photographed. |
| **30** | **Patch + stamped card** recording bib and date cleared. | Patches only mean anything as a set — this creates a collection and makes 45 feel owed. |
| **45** | **Wearable kit** — beanie or technical cap, number stitched **inside**. | First useful rather than symbolic item. Hidden number is the idea: at 45 you don't need to prove it. |
| **57** | **Finisher's plate** — metal, bib number, `5757`, date, numbered in order of all-time finishers. Boxed, hand-addressed, **with their Trial 01 words returned to them.** | A finisher's medal that isn't a medal. Returning their own words is free and is the strongest thing in the box. |

Escalation: symbolic → collectible → useful → permanent.

**Rules that keep it earned:** nothing is ever purchasable, not even replacements (one free
reprint, that's it) · nothing ships early, ever · dispatch email is one line, no marketing ·
address collected at trial 14, not signup.

**⚠️ See §7 for the cost problem** — the growth analysis found these items may cost more than
a completer pays. Get quotes before locking the spec.

---

## 4.7 Tech stack rationale

**React + Vite + TypeScript.** Small number of authenticated screens, nothing public to
server-render. TypeScript earns its keep on trial state (`locked | current | cleared`) where
a union type prevents showing someone content they haven't unlocked.
*Trade-off:* no SSR means **no public SEO surface**. Plan a separate static marketing site
rather than bolting SSR on later.

**Supabase (Postgres, Auth, RLS, Edge Functions), London.** UK data residency was the
driver — health-adjacent data stays at `eu-west-2`, removing a class of transfer paperwork.
Postgres means the sequencing rule is a database constraint, not an application convention.
*Trade-offs:* RLS is easy to get subtly wrong (a policy test suite is needed); **Auth
lock-in is the deepest** — everything else is portable Postgres; Edge Functions are Deno,
cold-start on the Stripe webhook path, and can't run long jobs.

**Stripe.** SCA and UK cards solved, dunning solved, and the Customer Portal means no
cancellation flow to build — which matters legally as much as practically.
*Trade-off:* entitlement lives in two systems. **Build a nightly reconciliation job** that
walks Stripe subscriptions and repairs the entitlement table. Treat webhooks as an
optimisation and the reconciler as truth.

**Render.** Atomic deploys, free-tier viable, CDN included, nothing to patch.

**Sequencing as a Postgres function.** The best decision in the stack. The premise is "no
skipping ahead" — that premise cannot live in React.
*Two things to get right:* `min_gap_minutes` must be enforced **inside** the function or the
gate is decoration; and the read path must be as strict as the write path.

### What this stack will struggle with, in order
1. **Content editing.** 57 markdown documents in Postgres with no CMS, no versioning, no preview. **Fix before writing: keep the markdown in git as source of truth and sync to the DB on deploy.** You get diffs, history, rollback, and can draft trial 52 without touching production.
2. **No per-trial drop-off analytics.** Instrument view-vs-clear per trial before launch.
3. **Merch fulfilment.** No inventory, no address validation, no tracking.
4. **Leaderboard cost** at tens of thousands of members — needs a materialised view.
5. **Email.** Nothing sends "Trial 21, day 14, keep going", and a product with 21-day holds needs one.

---

## Open decisions for you

1. **Leaderboard tiebreak** — speed removed entirely. You lose competitive drama. Judged mandatory given the safety constraint, but it has revenue implications.
2. **Entry Pass boundary at a 7-day hold (trial 05)** — delays the second ask by a week. Swap 05 and 06 if conversion says otherwise.
3. **The Primes rule** constrains sixteen trials to be non-physical forever. Strong structure, real loss of flexibility.
4. **Member-defined trials at 50, 54, 57** — safest possible design, makes the finish personal, but the climax of your product is something you didn't write.
5. **Merch as marketing spend** for fast finishers rather than gating late items on paid months.
6. **Trial 55 stops short of being a referral mechanic.** You could make it one. Recommended not to — the moment a trial asks a member to sell, the unsentimental tone collapses.

---

## 4.8 Written content — status and what writing it revealed

**Written: 02, 03, 04, 05.** Source of truth is `content/trials/*.md`; migration
`0008_trials_02_05.sql` is generated from those files and is applied live. Trial 06 exists
publication-ready in 4.2 above but has **not** been loaded. Trial 01 is specced in doc 18
(the sealed letter) and needs the letter UI, not a briefing.

### Five things writing them turned up

**1. The Trial 01 letter is sealed, so Trial 03 cannot ask you to re-read it.** THE PLEDGE
works from memory instead — and at 53 you find out whether what you remembered was what you
actually wrote. Better than the original, and it came out of the constraint.

**2. The four STOP constants are wrong on MARK trials.** Boilerplate about chest pain on a
writing exercise is exactly the copy-paste that 4.1 says trains members to skip the rubric.
MARK trials get a STOP written to the real risk — that reflecting honestly surfaces more
than expected — with permission to leave the trial open indefinitely.

> **Open decision:** MARK trials should probably carry an app-rendered signpost footer
> (Samaritans 116 123) rather than repeating it in each body, where it would become
> wallpaper. Trials 01 and 53 are the ones that need it most.

**3. HOLD trials need a daily check-in, and 05 is the first.** Seven separate morning logs
is the mechanic - and it is the one the verification research (13.6) already identified as
unfakeable, because timestamps spread across seven days cannot be produced retroactively.
**This is launch-relevant**: trial 05 sits inside the Entry-only band, before the Circuit
paywall at 06.

**4. The pledge should be surfaced, not filed.** The sentence written at 03 belongs on The
Interval — the cooldown screen — where it is read on the day it is needed. One line of
build; it makes trial 03 pay off fifty-four more times.

**5. The 200-350 word band does not survive a freshly-written rubric.** The publication-ready
example in 4.2 is itself ~430. Realistic bands: MARK 280-330 · MOVE/HOLD 350-450.

### Where trial 05 sits
It is the **last trial before the Circuit Pass paywall** and it takes seven days. That is
good, not bad: the member has a week of daily contact behind them before being asked to
subscribe, rather than hitting the ask on day five with nothing invested.

### 4.8.1 HOLD durations are enforced (D15)
`min_gap_minutes` on a HOLD trial is the trial's **duration**, not a cooldown, because the
briefing opens the moment the previous trial clears. The member reads it on day one - they
have to, they start tomorrow morning - and CLEARED unlocks when the days are up.

| # | Trial | Days | min_gap_minutes |
|---|---|---|---|
| 05 | SEVEN GLASSES | 7 | 10080 |
| 10 | THE SAME HOUR | 10 | 14400 |
| 11 | SILENT HOUR | 5 | 7200 |
| 16 | THE EARLY BIB | 5 | 7200 |
| 21 | TWENTY-ONE DAYS | 21 | 30240 |
| 27 | SEVEN AND SEVEN | 7 | 10080 |
| 43 | THE REST DAY | 1 | 4320 *(cooldown wins)* |
| 51 | THE QUIET WEEK | 7 | 10080 *(cooldown equals)* |

**The Interval must read the two differently.** A cooldown is *"Trial 07 opens in 14
hours."* A HOLD is *"Trial 05 clears in 6 days. The waiting is the trial."* Same field,
opposite message - get this wrong and a duration looks like a punishment. `trial_type`
tells them apart.
