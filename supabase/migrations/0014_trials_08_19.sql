-- 0014: trials 08 and 11-19, completing chapters I (FOUNDATION) and II
-- (DISCIPLINE) in full. Bodies are authored in content/trials/*.md, the
-- source of truth; this migration is generated from those files.
--
-- Trial 13, THE LEDGER, corrects min_gap_minutes from 1440 to 10080: it is a
-- seven-day observation trial (doc 22.3), the same "duration, not cooldown"
-- mechanic D15 established for HOLD trials, applied here to a MARK trial.
-- clear_trial's cooldown check works identically regardless of trial_type;
-- only the Interval's copy needs to read it as a duration rather than a
-- wait, which is a display concern, not a schema one.

update public.trials set
  title      = 'THE CARRY',
  trial_type = 'MOVE',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

The first trial with weight in it. The instruction that matters isn't the carrying — it's
putting it down whenever you want to.

**THE WORK**

1. Load a bag with something with real weight — books, tins, whatever's around. No target weight; heavy enough to notice, light enough that a mile feels doable.
2. Carry it a mile, on level ground, any route.
3. Set it down whenever you want, for as long as you want. There's no penalty for putting it down and no bonus for not.
4. Swap shoulders, arms or hands as needed. Don't grind on one side because you think finishing unbroken matters. It doesn't.
5. Finish the mile, however many times you set it down in between.

**THE RUBRIC**

*RISK* — Overloading it to make a point, and a strained shoulder or back that costs you the
next four trials. There is no version of this where heavier is better.

*GROUND* — A route you know, on pavement or a made path — not uneven ground with a load
unbalancing you. A bag with actual handles or straps, not something you're clutching
awkwardly.

*STOP* — Stop for the day if any of these happen: chest pain or tightness · breathlessness
that doesn't settle within a minute of stopping · dizziness that doesn't clear when you sit
down · any sharp or new pain. Also stop, and set the bag down, if grip, shoulder or back pain
starts — that's not scaling, that's the correct response.

*SCALE* — Any of these clears the trial: half a mile · a lighter bag · set it down every two
minutes deliberately, on a timer, so putting it down is a decision rather than a last resort.

*CLEARED WHEN* — The mile is done, wherever you set it down along the way.

**NOTE**

Trial 28 makes it an hour. This one is for learning where "enough" is.$md$
where num = 8;

update public.trials set
  title      = 'SILENT HOUR',
  trial_type = 'HOLD',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

Discipline opens with the opposite of effort: five days of doing nothing on purpose, for an
hour at a time.

**THE WORK**

1. Every day for five days: one hour with no screen and no input — no phone, no TV, no music, no podcast, no audiobook, no radio.
2. Talking to someone in the room is fine. The trial is about input, not silence for its own sake — though most people find sitting with nothing works better than reaching for a book.
3. It doesn't have to be a single unbroken hour, and it doesn't have to be the same hour each day.
4. Log it in the app once it's done for the day. Five logs on five separate days clears the trial.
5. Miss a day and that day simply doesn't count. Keep going until you have five — nothing restarts, and nobody is told.

**THE RUBRIC**

*RISK* — Physically, none. Realistically: restlessness that cuts the hour short, or filling
it with something screen-adjacent that doesn't feel like it counts — checking notifications
"just once."

*GROUND* — Somewhere you won't be interrupted for an hour, or somewhere you don't mind being
interrupted and simply pausing the clock.

*STOP* — This trial's real risk isn't physical: if boredom brings up something heavier than
expected, that's worth noticing, not fighting through. It's fine to stop for the day and try
again tomorrow.

*SCALE* — Any of these clears a day: thirty minutes instead of sixty · split into two blocks
of thirty · a walk with no headphones counts as the hour, if that's more bearable than
sitting still.

*CLEARED WHEN* — Five days are logged. Not five in a row.

**NOTE**

Nobody has ever failed this trial by sitting still for too long.$md$
where num = 11;

update public.trials set
  title      = 'THE THOUSAND',
  trial_type = 'MOVE',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

The first trial that's about volume, not effort. A thousand steps sounds like a lot until
you spread it across a day.

**THE WORK**

1. Find a staircase — at home, at work, a public one, doesn't matter. Handrail in reach for the whole thing.
2. Climb steps until you've done a thousand, total, today. Up-steps count; count them however's easiest — flights times steps per flight, or a fitness tracker if you have one.
3. Break it into as many trips as you like. Ten trips of a hundred is exactly as valid as one long climb.
4. Any pace. This is about the total, not how fast you got there.
5. Log the total once you've hit it.

**THE RUBRIC**

*RISK* — Knee strain from rushing a long unbroken block instead of spreading it out. Missing
a step because you're counting in your head instead of watching your feet.

*GROUND* — A staircase you know, well-lit, handrail actually usable — not decorative — and
dry underfoot.

*STOP* — Stop for the day if any of these happen: chest pain or tightness · breathlessness
that doesn't settle within a minute of stopping · dizziness that doesn't clear when you sit
down · any sharp or new pain. Also stop on any new or sharp knee or hip pain — bank what
you've done, the rest carries to tomorrow. The trial stays open.

*SCALE* — Any of these clears the trial: five hundred steps instead of a thousand · a slope
or hill instead of stairs, for a comparable total climb · spread it across two days if a
single day genuinely doesn't have the stairs available.

*CLEARED WHEN* — A thousand steps are logged, however they were split.

**NOTE**

Somewhere in the low hundreds you'll start doing the arithmetic instead of climbing. That's
fine. Keep going.$md$
where num = 12;

update public.trials set
  title      = 'THE LEDGER',
  trial_type = 'MARK',
  flag       = 'GREEN',
  min_gap_minutes = 10080,
  body_md    = $md$**THE LINE**

The hardest instruction in the whole product: watch without changing anything. A week of
your money, exactly as it already is.

**THE WORK**

1. Every day for seven days, write down every pound you spend. Every transaction, however small — a coffee, a parking meter, a direct debit that lands that day.
2. Change nothing about how you spend. This is not a savings challenge and not a budgeting exercise. If you'd have bought it anyway, buy it and write it down.
3. No judging entries as good or bad as you write them. A number, what it was for, done.
4. At the end of seven days, don't total it up if you don't want to — the totalling isn't the trial. The daily watching is.
5. This one you keep for yourself, the same as Trial 02. Nobody else reads it.

**THE RUBRIC**

*RISK* — Changing your spending because you're being watched, even by yourself. That's the
one way to fail this — the instinct to tidy up for the ledger is exactly what it's testing
for.

*GROUND* — Something you'll actually carry or open every day: a notes app, a small notebook,
whatever survives seven days without getting lost.

*STOP* — If watching your own spending surfaces something heavier than expected, that's real
information worth sitting with — or speaking to someone about — not something to push
through for the trial's sake.

*SCALE* — Track only spending over £5, if tracking every single transaction genuinely isn't
practical. Still clears it, as long as it's honest for seven days.

*CLEARED WHEN* — Seven days are recorded, unchanged from how you'd have spent anyway.

**NOTE**

Most people find the writing changes nothing. That's the point, and also the surprise.$md$
where num = 13;

update public.trials set
  title      = 'GROUND WORK',
  trial_type = 'MOVE',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

Getting up off the floor without using your hands is one of the strongest predictors there
is of how someone moves in old age. This is twenty minutes practising the one skill nothing
else here teaches.

**THE WORK**

1. Find a clear patch of floor — carpet or a mat if you have one.
2. Get down to sitting on the floor, then back up to standing. However you need to, using hands, furniture, whatever works today.
3. Do that ten times, resting as long as you want between each.
4. Each time, try one small thing differently — a hand down instead of two, no hands if that's within reach today — but never so different you're straining for a "level up." Trying is the instruction, not achieving.
5. Twenty minutes total, however the ten transfers fit inside it.

**THE RUBRIC**

*RISK* — Going down or up too fast and misjudging a knee or wrist landing. Trying to skip
the hands entirely before you're ready and taking a hard sit-down.

*GROUND* — Soft-enough flooring, nothing sharp or hard-edged nearby, space to fall sideways
safely if balance goes.

*STOP* — Stop for the day if any of these happen: chest pain or tightness · breathlessness
that doesn't settle within a minute of stopping · dizziness that doesn't clear when you sit
down · any sharp or new pain. Also stop on any joint pain that's new or sharp on the way down
or up — that's the correct read, not weakness.

*SCALE* — Any of these clears the trial: five transfers instead of ten · use a chair to lower
onto and push up from every time · ten minutes instead of twenty.

*CLEARED WHEN* — Ten transfers are done, in twenty minutes or less, using whatever help you
needed.

**NOTE**

Nobody is ever marked down here for using their hands. That's what they're for.$md$
where num = 14;

update public.trials set
  title      = 'THE FIFTEEN',
  trial_type = 'MOVE',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

The first trial with a clock on it. Fifteen minutes, continuous, at a pace slow enough that
you could double it if you had to — because you're not finding your limit, you're finding a
pace you could hold twice as long.

**THE WORK**

1. Pick anything continuous — walking, the stack from Trial 06 done as a flow instead of sets, stairs, cycling, whatever you have.
2. Fifteen minutes, unbroken, at a pace you're confident you could sustain for thirty.
3. If you're breathing too hard to say a sentence, you're going too fast. Slow down — the clock doesn't stop for that.
4. No warm-up counted in the fifteen. Start the clock once you're already moving at pace.
5. When the fifteen minutes are up, stop. Not "just one more minute" — fifteen is the trial.

**THE RUBRIC**

*RISK* — Racing the clock instead of holding a controlled pace. The whole point of the trial
is proving you're nowhere near your limit, so going hard defeats it.

*GROUND* — Whatever the chosen movement needs — safe, familiar, ideally somewhere you can
pause without stranding yourself.

*STOP* — Stop for the day if any of these happen: chest pain or tightness · breathlessness
that doesn't settle within a minute of stopping · dizziness that doesn't clear when you sit
down · any sharp or new pain.

*SCALE* — Any of these clears the trial: ten minutes instead of fifteen · split into two
blocks of under ten with a short rest between · a gentler movement than you first picked, if
the pace can't stay talkable otherwise.

*CLEARED WHEN* — Fifteen continuous minutes at a pace you could have doubled.

**NOTE**

This is where your bib arrives. Not because fifteen minutes is hard — because you've been at
this long enough to have earned proof of it.$md$
where num = 15;

update public.trials set
  title      = 'THE EARLY BIB',
  trial_type = 'HOLD',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

Discipline isn't decided in the moment — it's decided the night before, by what time you set
the alarm for. This one is won or lost before you're fully awake.

**THE WORK**

1. Every day for five days: be up and moving — not just awake, actually out of bed and on your feet — within fifteen minutes of your alarm.
2. Set the alarm the night before at a time you can actually keep, not an aspirational one. This isn't about waking up earlier than usual, it's about not lying there once you're up.
3. "Moving" means what it sounds like — standing, walking to the kitchen, opening the curtains. Checking your phone from bed doesn't count, even if you're technically awake.
4. Log each morning once it's done. Five mornings, same rule as before — miss one and it doesn't count, keep going until you have five.
5. Weekends count. Five mornings, not five weekdays.

**THE RUBRIC**

*RISK* — Physically, close to none. The real risk is setting an unrealistic alarm time out
of enthusiasm on day one and abandoning the whole trial by day three.

*GROUND* — An alarm you'll actually hear, positioned somewhere you have to get up to silence
it if that's what it takes.

*STOP* — If this collides with a genuine sleep or health issue rather than ordinary
reluctance, the scale below clears it in full. This isn't a trial about sleep deprivation.

*SCALE* — Any of these clears a day: thirty minutes instead of fifteen · "moving" can mean
sitting up and putting your feet on the floor, if a health condition means more than that
needs care · keep whatever wake time you already use — the trial is about the fifteen
minutes after, not about waking earlier.

*CLEARED WHEN* — Five mornings are logged.

**NOTE**

Nobody watching would notice this trial happening. That's true of most of what matters here.$md$
where num = 16;

update public.trials set
  title      = 'ONE REFUSAL',
  trial_type = 'MARK',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

Most days you say yes by default. This one asks you to notice a single moment where you
could, and don't.

**THE WORK**

1. Over the next day, find one thing you'd normally agree to on autopilot — a request, an invitation, a favour, an extra task — and say no to it.
2. It has to be something you'd genuinely have said yes to otherwise. Refusing something you already wanted to refuse doesn't count.
3. Say the no cleanly — no invented scheduling conflict, no over-explaining. "No" is a complete sentence, or as close to one as you can manage.
4. Afterward, write what it cost — the discomfort, the guilt, what you told yourself about it, whether anyone reacted and how. A few honest sentences.
5. That's the whole trial. One refusal, plainly said, honestly written up.

**THE RUBRIC**

*RISK* — Choosing something trivial enough that it costs nothing, which teaches you nothing
about the actual skill. Or picking something that needlessly damages a relationship — this
is about noticing the reflex, not about being difficult.

*GROUND* — Nothing physical. Just a moment during an ordinary day, and a few minutes
afterward to write.

*STOP* — If the situation that presents itself involves someone else's safety, a professional
obligation, or genuine hardship to another person, that's not the moment for this trial —
pick a smaller, lower-stakes one instead.

*SCALE* — The refusal can be as small as declining an extra task at work, or taking a day to
answer instead of agreeing on the spot. Small and real beats big and staged.

*CLEARED WHEN* — The no was said, and what it cost is written down.

**NOTE**

Most people report the anticipation was worse than saying it.$md$
where num = 17;

update public.trials set
  title      = 'THE REPEAT',
  trial_type = 'MOVE',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

The exact session from Trial 06. Nothing added, nothing harder — this is about noticing
what's changed in you, not the workout.

**THE WORK**

1. The same three rounds of five movements from Trial 06 — sit-to-stand, wall press, step-up, hinge, march. Same reps, same structure.
2. No faster, no heavier, no more rounds. If you're tempted to add anything because it felt easy last time, don't — that's a different trial, not this one.
3. Pay attention to what's different: does anything feel more controlled, more familiar, less effortful at the same pace? You'll see your own notes from last time once this is cleared.
4. Same talkable pace as before. If you can't hold a sentence, you're going too hard, exactly as last time.
5. Rest as long as you want between rounds, exactly as last time.

**THE RUBRIC**

*RISK* — Turning it into a test of progress by pushing harder — that defeats the trial. The
instruction is identical to Trial 06 on purpose.

*GROUND* — Same as Trial 06: indoors, two metres of clear floor, a stable chair, a fixed
step, shoes on or bare feet.

*STOP* — Same as Trial 06: chest pain or tightness · breathlessness that doesn't settle
within a minute of stopping · dizziness that doesn't clear when you sit down · any sharp or
new pain. Also stop if the step feels unsteady or you catch a foot.

*SCALE* — Whatever you scaled to on Trial 06 clears this in full. There's no requirement to
have progressed since.

*CLEARED WHEN* — The rounds you set out to do are done, at the same talkable pace as before.

**NOTE**

You'll see what you wrote about this session last time as soon as you clear it. Nobody else
will.$md$
where num = 18;

update public.trials set
  title      = 'THE THIRD',
  trial_type = 'MARK',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

A third of the way through, by trial count if nothing else. Time to look at what's actually
true, rather than what you've been telling people.

**THE WORK**

1. Reread nothing first — Trial 02's inventory isn't sealed, but work from memory before you check it.
2. Write what's actually changed since Trial 02 — not what you hoped would change, what's measurably different about your days, your hours, your choices.
3. Then write one thing you've been pretending about — to other people, or to yourself. Something you've said is fine that isn't, or said is hard that quietly got easier, or claimed you're doing that you've quietly stopped.
4. Both parts are required. The first is allowed to be generous to yourself. The second isn't.
5. Nobody reads this but you. There's no version of this trial where the honest answer is the wrong one.

**THE RUBRIC**

*RISK* — Writing the flattering version of both answers. This is the trial where that habit
costs you something real, later, if you let it.

*GROUND* — Somewhere private, unhurried, the same as Trial 02.

*STOP* — If what surfaces here is heavier than expected, put it down and come back. The
trial stays open, no deadline, the same as the other reflective ones.

*SCALE* — Shorter answers are fine. One honest sentence for each half clears it as completely
as a page would.

*CLEARED WHEN* — Both parts are written: what's changed, and what you've been pretending.

**NOTE**

The pretending doesn't have to stop today. Naming it is the whole trial.$md$
where num = 19;
