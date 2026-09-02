-- 0018: trials 48-52 and 54-57, completing chapter VI (ASCENSION) and the
-- full 57. Bodies are authored in content/trials/*.md, the source of truth;
-- this migration is generated from those files. Trial 53 (THE RECKONING)
-- was already loaded in migration 0013.
--
-- Every trial here carries PRE-FLIGHT and CHECK-IN per doc 4.1's RED-tier
-- rule and D12's witnessed-trials spec. The CHECK-IN instruction is
-- currently narrative only: `trial_witnesses` (doc 22.6, "still needed")
-- isn't built, so nothing here persists a witness's name the way Trial 53's
-- `reckonings` table does for that one trial. The member follows the
-- safety instruction for real; the app doesn't yet record that they did.
--
-- Trial 52, THE LONG GROUND, is the publication-ready example from doc
-- 4.3, loaded here for the first time. Trial 54's mechanism note in doc
-- 22.3 ("Trial 22 at distance") doesn't match its own title or its
-- mirror_of (25, THE RETURN) - written here as Trial 25 at distance, which
-- is what the title and the mirror both actually say.

update public.trials set
  title      = 'THE LONG WALK',
  trial_type = 'MOVE',
  flag       = 'RED',
  body_md    = $md$**THE LINE**

The first trial where someone else needs to know exactly where you are. Ninety minutes on a
route you've walked before, with a named check-in — the habit this chapter runs on, starting
now.

**PRE-FLIGHT** — every line must be true.

- **Route planned and written down**, on ground you've walked before, with at least one point where you could bail out to a bus, taxi or lift home.
- **Route shared** with your check-in person before you leave.
- **Phone above 80%.**
- **Food eaten within four hours, water carried.**
- **Footwear you've already worn in.**
- **Weather checked.** Postpone for any amber or red warning, ice or standing frost, thunderstorms.
- **You slept reasonably last night. No injury or illness in the last few days.**

If any line is false: postpone, don't scale.

**THE WORK**

1. Walk your planned route for ninety minutes at conversational effort. No pace target.
2. Message your check-in person when you leave, and again when you're back.
3. Agree beforehand what they do if you don't report within thirty minutes of expected finish.
4. Use a bail-out without hesitation if anything feels wrong — that's a correctly executed trial, not a failed one.
5. Headphones out on any road, shared path, or unlit section.

**THE RUBRIC**

*RISK* — The same categories as the earlier walking trials, now with one addition: nobody
else knows your plan if you skip the check-in.

*GROUND* — A known route, made paths or pavement, no ground where a rolled ankle leaves you
unreachable.

*STOP* — Stop and get home if any of these happen: chest pain or tightness · breathlessness
that doesn't settle within a minute of stopping · dizziness that doesn't clear when you sit
down · any sharp or new pain · weather turns. Use a bail-out. That is what it's for.

*SCALE* — Sixty minutes instead of ninety, same rules · take someone with you instead of
checking in remotely — that clears it too.

*CLEARED WHEN* — Ninety minutes are walked, and the check-in is messaged at start and finish.

**CHECK-IN** — not optional.

Before you leave, one named person gets your route, start time and expected finish. Agree in
advance what they do if you don't report within thirty minutes of expected finish. If nobody
is available today, the trial waits.

**NOTE**

This is the habit the last ten trials run on. Get it right when it's ninety minutes and easy.$md$
where num = 48;

update public.trials set
  title      = 'THE DOUBLE ASCENT',
  trial_type = 'MOVE',
  flag       = 'RED',
  body_md    = $md$**THE LINE**

Trial 24's climb, twice over, with someone knowing your plan this time.

**PRE-FLIGHT** — every line must be true.

- **Route planned**, covering 300m of elevation gain twice — the same climb twice, or two separate climbs totalling 600m — with genuine bail-out points.
- **Route shared** with your check-in person before you start.
- **Weather checked for higher ground specifically.** Postpone for low cloud, high wind, ice or any weather warning.
- **Food and water carried for the whole outing, not just one climb's worth.**
- **Footwear worn in, phone charged.**
- **You slept reasonably last night. No injury or illness in the last few days.**

If any line is false: postpone, don't scale.

**THE WORK**

1. Find 300m of elevation gain, the same as Trial 24, and climb it twice — either the same route twice or two separate climbs totalling 600m.
2. Share your plan with your check-in person before you start, including roughly how long you expect to be out.
3. Rest properly between the two climbs — eat, drink, sit down. This isn't about speed between them.
4. Same pace rules as Trial 24: any pace, no time limit, careful on descents.
5. Message your check-in person when you're back.

**THE RUBRIC**

*RISK* — Everything Trial 24 carried, doubled in duration: underestimating time, light and
supplies, and descending too fast on tired legs on the second climb especially.

*GROUND* — Ground you know or a well-marked, popular route for both climbs. Postpone for low
cloud, high wind, ice or any weather warning.

*STOP* — Turn back if conditions worsen, if you're not confident about a descent, or if
daylight is running out — on either climb. The usual four constants apply throughout.

*SCALE* — 300m once instead of 600m, same as Trial 24, if the second climb genuinely isn't
right for you today · split the two climbs across two separate days.

*CLEARED WHEN* — 600 metres of total climbing is logged, in two climbs, checked in at the
finish.

**CHECK-IN** — not optional.

Before you start, one named person gets your route, start time and expected finish. Message
them when you're back. Agree what they do if you don't report within thirty minutes of
expected finish.

**NOTE**

You'll see what you wrote about Trial 24 as soon as you clear this.$md$
where num = 49;

update public.trials set
  title      = 'THE NIGHT GROUND',
  trial_type = 'MOVE',
  flag       = 'RED',
  body_md    = $md$**THE LINE**

A session after dark, on a lit route, with someone actually waiting for you at the end — not
just told, waiting.

**PRE-FLIGHT** — every line must be true.

- **Route confirmed entirely lit and populated** — walked in daylight first if you don't already know it well.
- **Someone arranged to be waiting at the end**, at an agreed time and place — an actual person, not just a message sent.
- **High-visibility clothing or a light carried.**
- **Phone charged, weather checked** — postpone for ice, fog or any weather warning.
- **Footwear worn in. No injury or illness in the last few days.**

If any line is false: postpone, don't scale.

**THE WORK**

1. Plan a route you know well, entirely on lit, populated ground — pavements, lit paths, no unlit shortcuts.
2. Arrange for someone to be waiting for you at the end, not just told when to expect you.
3. Walk the route after dark, high-visibility clothing or a light, headphones out throughout.
4. Message your check-in person when you set off — this may be the same person waiting at the end.
5. Arrive where they're waiting. That's the marker that it's done.

**THE RUBRIC**

*RISK* — Poor lighting misjudged, and ground that feels different at night than it did by
day.

*GROUND* — Lit, known routes only. Never a shortcut through anywhere unlit, however much
shorter it looks on a map.

*STOP* — Turn back to lit ground immediately if any section is darker than expected. The
usual four constants apply throughout: chest pain or tightness · breathlessness that doesn't
settle within a minute of stopping · dizziness that doesn't clear when you sit down · any
sharp or new pain.

*SCALE* — A shorter lit loop close to where the person is waiting for you.

*CLEARED WHEN* — The route is walked after dark, and you've arrived where you're being
waited for.

**CHECK-IN** — not optional, and this one has an in-person element by design: someone
waiting at the finish, not just told about it.

**NOTE**

The waiting is not a formality this time. It's the actual instruction.$md$
where num = 50;

update public.trials set
  title      = 'THE QUIET WEEK',
  trial_type = 'HOLD',
  flag       = 'RED',
  body_md    = $md$**THE LINE**

Seven days on your own programme, entirely away from this app. You've been told what to do
fifty times; this is the first week you're not.

**PRE-FLIGHT** — every line must be true.

- **A plan for the week, written down, before it starts** — whatever combination of movement, rest and reflection you think is right.
- **Your check-in person told** that you're doing an unsupervised, self-directed week and roughly when they'll hear from you.
- **Nothing in your own plan breaks a global exclusion** — no fasting, no breath-holding, no maximal effort, nothing this product wouldn't otherwise ask of you.

If any line is false: fix the plan before day one, don't start and hope.

**THE WORK**

1. Before the week starts, write your own plan for seven days — whatever combination of movement, rest and reflection you think is right, based on everything you've done here so far.
2. Don't log in or check the app for the week, beyond this page. No checking your streak, no reading ahead.
3. Follow your own plan. Adjust it if you need to — you're the one running it now.
4. Keep a rough note of what you actually did, on paper or wherever suits, to bring back at the end of the week.
5. At the end of seven days, log the trial complete and summarise what you did.

**THE RUBRIC**

*RISK* — Either doing too little because nobody's watching, or too much because you're
excited to be self-directed. Both are useful information about which way you lean.

*GROUND* — Whatever your own plan needs.

*STOP* — The usual four constants apply to whatever you choose to do, same as ever: chest
pain or tightness · breathlessness that doesn't settle within a minute of stopping ·
dizziness that doesn't clear when you sit down · any sharp or new pain.

*SCALE* — A shorter self-directed period, four or five days, if seven genuinely isn't
practical. The point is self-direction, not the exact length.

*CLEARED WHEN* — Seven days, or the scaled version, of a self-directed programme are
complete and briefly summarised.

**CHECK-IN** — not optional. Your check-in person knows you're running your own week and
roughly when to expect to hear from you at the end of it.

**NOTE**

Nobody is grading whether your plan was good. Only whether it was actually yours.$md$
where num = 51;

update public.trials set
  title      = 'THE LONG GROUND',
  trial_type = 'MOVE',
  flag       = 'RED',
  body_md    = $md$**THE LINE**

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
between.$md$
where num = 52;

update public.trials set
  title      = 'THE RETURN, FAR',
  trial_type = 'MOVE',
  flag       = 'RED',
  body_md    = $md$**THE LINE**

Trial 25's out-and-back, further this time, with someone knowing exactly where the
turnaround point is.

**PRE-FLIGHT** — every line must be true.

- **Route planned**, including the exact turnaround point, on ground you know.
- **Route and turnaround shared** with your check-in person before you leave.
- **Food and water carried** — this is long enough to need food, not just water.
- **Footwear worn in, phone charged.**
- **Weather checked.** Postpone for any weather warning, ice or thunderstorms.
- **You slept reasonably last night. No injury or illness in the last few days.**

If any line is false: postpone, don't scale.

**THE WORK**

1. Walk out for ninety minutes this time — double Trial 25 — then turn around and walk back the same way, exactly as before.
2. Share the plan with your check-in person before you leave, including the turnaround point and expected time back.
3. Message them when you leave, at the turnaround, and when you're back.
4. Same rule as Trial 25: no shortcuts on the way back except for a genuine safety reason.
5. Take food this time, not just water — this is long enough to need it.

**THE RUBRIC**

*RISK* — Everything Trial 25 carried, at double the distance: going out too far or fast to
comfortably reverse, especially if weather or energy changes partway.

*GROUND* — A route you know, or one you're confident you can retrace, the whole way out and
back.

*STOP* — The usual four constants apply throughout, both ways: chest pain or tightness ·
breathlessness that doesn't settle within a minute of stopping · dizziness that doesn't
clear when you sit down · any sharp or new pain. A genuine safety issue is a legitimate
reason to call for a lift partway — that's the trial working, not failing.

*SCALE* — Forty-five minutes out instead of ninety, same rule — turn around and walk back.

*CLEARED WHEN* — You've walked back to where you started, having gone the full time out
first, checked in at all three points.

**CHECK-IN** — not optional. Your check-in person gets the route, the turnaround point, and
expected finish, and hears from you at all three: leaving, turnaround, back.

**NOTE**

You'll see what you wrote about Trial 25 as soon as you clear this.$md$
where num = 54;

update public.trials set
  title      = 'THE SERVICE',
  trial_type = 'SIGNAL',
  flag       = 'RED',
  body_md    = $md$**THE LINE**

A full day given to someone else, unpaid, before this run ends. Trial 07 was small and
secret. This one is a whole day, and it can be seen.

**PRE-FLIGHT** — every line must be true.

- **What you're doing and roughly where, told to your check-in person**, the same habit as every trial since 48.
- **Anything physical involved in the service checked against your own limits** — this isn't a licence to take on something beyond what you'd otherwise attempt here.
- **If volunteering somewhere you don't already know, it's an established organisation**, not an informal arrangement with an unvetted stranger.

If any line is false: choose a different way to give the day.

**THE WORK**

1. Give a full day, or as close to a full day as your circumstances allow, to helping someone else. Volunteering, caring for someone, a substantial favour that takes real hours.
2. Unlike Trial 07, this one doesn't have to be secret — if it's known, that's fine, though showing off about it during the day rather defeats the point.
3. Tell your check-in person what you're doing and roughly where.
4. Give the day properly: present, not distracted, not checking the time.
5. Afterward, write a few lines about what the day was and how it felt to give a whole one away.

**THE RUBRIC**

*RISK* — Picking something too small to actually cost you a day, which undercuts the trial.

*GROUND* — Wherever the chosen service happens. Nothing here should put you somewhere unsafe
or unvetted.

*STOP* — The usual four constants for anything physical involved. If what you're doing turns
out to be more than you can safely give, stopping and reporting back honestly is fine.

*SCALE* — Half a day instead of a full one.

*CLEARED WHEN* — The day is given, and a few lines about it are written.

**CHECK-IN** — not optional, the same as every trial since 48: your check-in person knows
what you're doing and roughly where.

**NOTE**

Trial 07 taught you effort with no credit. This one is effort where credit doesn't matter
either way.$md$
where num = 55;

update public.trials set
  title      = 'THE VIGIL',
  trial_type = 'MOVE',
  flag       = 'RED',
  body_md    = $md$**THE LINE**

The longest single day in the whole 57. Not the hardest pace anywhere in this book — the
longest single stretch of it.

**PRE-FLIGHT** — every line must be true.

- **A duration decided in advance, longer than Trial 52's three hours** — how much longer is yours to decide.
- **Route planned and written down**, with genuine bail-out points no more than forty minutes apart.
- **Route shared** with your check-in person before you leave.
- **Food and water for the whole duration**, not just an estimate.
- **Footwear already walked long distances in. Phone above 80% plus a battery pack.**
- **Weather checked.** Postpone for any amber or red warning, ice, thunderstorms, or heat above 26°C.
- **You slept properly. No injury or illness in the last seven days, not hungover.**

If any line is false: postpone, don't scale.

**THE WORK**

1. Choose a duration longer than anything else in this run so far — longer than Trial 52's three hours. This is the longest day, not a fixed one.
2. Plan it with the same care as Trial 52: route, bail-outs, food, water, weather, check-in.
3. Walk it at conversational effort, exactly as every long trial here has asked. Long is not an invitation to go harder.
4. Stop every forty-five minutes to an hour, whichever suits the length you've chosen. Eat and drink at every stop.
5. Message your check-in person at the start, at least once partway, and at the finish.

**THE RUBRIC**

*RISK* — Misjudging your own chosen length against your preparation. The usual fatigue,
blister and fuelling risks from Trial 52, magnified by time.

*GROUND* — The same standards as Trial 52: known route, genuine bail-outs, no ground where a
problem leaves you unreachable.

*STOP* — All of Trial 52's stop conditions apply here, at greater length: chest pain or
tightness · breathlessness not settling · dizziness, nausea or confusion that doesn't clear
after sitting, drinking and eating · any sharp or new pain · a blister that's formed ·
shivering or being unable to warm up · weather turning. A bail-out used partway is a
correctly executed trial.

*SCALE* — Trial 52's three hours is always a valid length for this trial, if a longer day
genuinely isn't right for you today. "Longest" is relative to your own run, not an absolute
number.

*CLEARED WHEN* — The day you chose is completed, at conversational effort, checked in
throughout.

**CHECK-IN** — not optional, with at least three points of contact: leaving, partway, and
finishing.

**NOTE**

Longest doesn't mean hardest. By now you know the difference.$md$
where num = 56;

update public.trials set
  title      = 'THE LAST GROUND',
  trial_type = 'MOVE',
  flag       = 'RED',
  body_md    = $md$**THE LINE**

Your declared finish. Planned, witnessed, scaled to exactly what you decided — slower than
you want it to be, on purpose.

**PRE-FLIGHT** — every line must be true.

- **Your finish decided and written down in advance** — a distance, a place, a route that means something to you after everything before it. Nobody else defines this one.
- **Route planned with genuine bail-outs**, the same standard as every trial since 48.
- **Named witness and check-in points agreed.**
- **Food, water, footwear, sleep the night before** — the same standards this chapter has asked for throughout.
- **Weather checked.** Postpone for any amber or red warning, ice, thunderstorms, or genuine heat.

If any line is false: postpone. This is not the trial to compromise on.

**THE WORK**

1. Decide in advance what your finish looks like — a distance, a place, a route that means something to you.
2. Plan it with full care: route, bail-outs, food, water, weather, footwear, sleep the night before.
3. Name your witness and agree check-in points, the same as every trial since 48.
4. Go slower than you want to. This is not the trial to find out what you have left — it's the trial where you already know.
5. Finish where you can sit down, be met by whoever is there, and let it be over.

**THE RUBRIC**

*RISK* — Pushing hard because it's the last one — exactly the instinct this trial exists to
override. Every risk from the walking trials before it is present here too.

*GROUND* — A route you know or have scouted, with genuine bail-outs, exactly as the
standards set from Trial 48 onward.

*STOP* — The usual four constants: chest pain or tightness · breathlessness that doesn't
settle within a minute of stopping · dizziness that doesn't clear when you sit down · any
sharp or new pain. If today isn't the day, postponing a declared finish is not a failure —
it's the same judgement this whole product has asked for since Trial 01.

*SCALE* — There is no scale field for this one. You already set your own scale when you
planned it. Whatever you declared is the whole trial, at whatever size you chose it.

*CLEARED WHEN* — The finish you declared is complete, and you've reported to your witness.

**CHECK-IN** — not optional, as always.

**NOTE**

Your finisher number is issued the moment this clears. The book unlocks the same day. There
isn't a 58.$md$
where num = 57;
