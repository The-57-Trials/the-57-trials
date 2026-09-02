-- 0015: trials 20-29, completing chapter III (ENDURANCE). Bodies are
-- authored in content/trials/*.md, the source of truth; this migration is
-- generated from those files.
--
-- Trial 23, THE MORTALITY SIT, is mortality-themed content and carries an
-- inline Samaritans signpost (116 123) in its own STOP field. Doc 04.8
-- flags an open decision to add an app-rendered signpost footer across all
-- MARK trials rather than repeating it inline — still open; this is the
-- minimum safe version until that's decided.

update public.trials set
  title      = 'THE HOUR',
  trial_type = 'MOVE',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Twice what Trial 04 asked, at the same easy pace. Endurance starts here — not by going
harder, by going longer.

**THE WORK**

1. One hour, continuous, outdoors, walking or another sustained movement — same rules as Trial 04: no headphones, any pace you could hold a conversation through.
2. Plan the route before you leave and share it with someone, the same habit Trial 04 asked you to start.
3. No destination, no errand folded in.
4. Take water if the weather's warm — this one's long enough to need it where the earlier ones weren't.
5. If you need to stop and sit for a minute, that's fine. It doesn't break the hour, it's just part of it.

**THE RUBRIC**

*RISK* — Underestimating how different an hour feels from thirty minutes: boredom, sore
feet, or a route that's further from home than you meant.

*GROUND* — Outdoors, on a route you know, phone charged, water carried if warm, a way to
shorten the route if you need to.

*STOP* — Stop for the day if any of these happen: chest pain or tightness · breathlessness
that doesn't settle within a minute of stopping · dizziness that doesn't clear when you sit
down · any sharp or new pain. Postpone for thunderstorms, ice, or any weather warning — rain
alone is fine.

*SCALE* — Any of these clears the trial: thirty minutes instead of sixty · two blocks of
thirty across the day · a loop close to home so you're never far from stopping.

*CLEARED WHEN* — The hour is done, outdoors, at a pace you could talk through.

**NOTE**

Trial 04 was the introduction. This is the first real rehearsal for the three-hour trials
later on.$md$
where num = 20;

update public.trials set
  title      = 'TWENTY-ONE DAYS',
  trial_type = 'HOLD',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Twenty-one consecutive days of one small thing. Most habits take longer than this to feel
automatic — this is where one starts to.

**THE WORK**

1. Pick one ten-minute action you can genuinely do every day for three weeks — a walk, a stretch routine, journaling, anything small enough to survive a bad day.
2. Decide it once, before day one, and don't change it partway through.
3. Do it every day, logged once done. Ten minutes minimum — no upper limit if you want to go longer some days.
4. Miss a day and the streak restarts from zero. Unlike every hold before this one, a missed day here costs you the days already banked.
5. Twenty-one consecutive days clears it.

**THE RUBRIC**

*RISK* — Picking something too ambitious on day one and burning out by day eight. Small
enough to survive illness, travel and a bad mood is the entire design brief here.

*GROUND* — Whatever the chosen action needs. Pick something that doesn't depend on weather,
equipment or another person being available, so nothing outside your control can break the
streak.

*STOP* — If illness or injury genuinely prevents the action on a given day, that's treated
like any other missed day — the streak restarts, the same as it would for any other reason.
There's no appeal; that's what makes twenty-one consecutive days worth something.

*SCALE* — The daily action can be scaled down — five minutes instead of ten — but the streak
length can't. Twenty-one consecutive days is the trial, at whatever size of action you chose.

*CLEARED WHEN* — Twenty-one consecutive days are logged.

**NOTE**

You've heard the "21 days makes a habit" claim before. Where that number came from doesn't
matter here. What matters is you didn't miss one.$md$
where num = 21;

update public.trials set
  title      = 'THE FIVE',
  trial_type = 'MOVE',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Twenty-one days alone, then straight into a field of strangers doing the same thing at the
same time. That's not a coincidence.

**THE WORK**

1. Find your local parkrun — a free, timed 5k, run or walked, most Saturday mornings in nearly every town. If there genuinely isn't one near you, any organised group 5k or walk works instead.
2. Turn up and do the 5k, at whatever pace gets you round. parkrun is walked by plenty of people every week, and finishing last is a normal finish.
3. You don't have to talk to anyone if you don't want to. Being among people doing the same thing is the trial, not making friends.
4. Registering for a timing barcode is optional. Being there and finishing is what clears this, not your recorded time.
5. No solo substitute for this one — the point is other people, in the same place, at the same time.

**THE RUBRIC**

*RISK* — Treating it as a race after three weeks of solo pacing and going out too hard in
company. Also turning up undertrained for a genuine 5k if Trial 21's daily action wasn't
movement-based.

*GROUND* — Check the specific event's route beforehand — most parkruns are flat, made-path
routes, but not all are.

*STOP* — The usual four constants. If you don't feel ready for the full distance, most events
allow walking all of it — that still clears the trial. Severe-weather cancellations are the
organiser's call, not yours to override.

*SCALE* — Walk the whole 5k · do a shorter distance if the specific event allows it · if
genuinely no organised event exists within reach, gather two or three other people for your
own timed 5k somewhere public — public, timed, together is what matters, not the brand.

*CLEARED WHEN* — You've finished an organised 5k, in company, however slowly.

**NOTE**

You've been the only person doing this for three weeks. For one Saturday morning, you won't
be.$md$
where num = 22;

update public.trials set
  title      = 'THE MORTALITY SIT',
  trial_type = 'MARK',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

A reason matters more once you've imagined it ending. Write what would honestly be said
about you, at your funeral, if today were the day.

**THE WORK**

1. Write your own eulogy — what you'd want said, or what would honestly be said, if it were today.
2. Be honest rather than aspirational. This isn't about the person you're going to become — it's a reading of the evidence as it stands right now.
3. Cover what mattered to the people who'd be there, not achievements a stranger would list. Nobody's eulogy is their job title.
4. There's no required structure or length beyond enough to actually mean something.
5. Keep it or don't — this one isn't sealed, and it isn't reread anywhere later in the run. It's yours once it's written.

**THE RUBRIC**

*RISK* — Writing the eulogy you'd want strangers to read rather than an honest one. For some
people, this trial surfaces real grief or distress rather than simple reflection.

*GROUND* — Private, unhurried, nothing physical required.

*STOP* — If this brings up more than reflection — real distress, grief, or thoughts of
harming yourself — stop, and talk to someone today: a person you trust, your GP, or
Samaritans, free, any time, on 116 123. This trial is not worth pushing through alone. It
stays open with no deadline, and there is no wrong reason to leave it for another day.

*SCALE* — A single honest paragraph clears this as completely as a full page would.

*CLEARED WHEN* — It's written, honestly, whatever length it ended up.

**NOTE**

This is the one trial here written assuming some people close the page halfway through.
That's a correct response, not a failure.$md$
where num = 23;

update public.trials set
  title      = 'THE ASCENT',
  trial_type = 'MOVE',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Three hundred metres of climbing, however you find it — one long hill or a lot of short
ones. No time limit, because pace was never the variable that mattered here.

**THE WORK**

1. Find 300 metres of total elevation gain — a single hill, a flight of hills, or repeats of a smaller one, added up over the day.
2. Walk it. Any pace, any number of stops.
3. Descents don't count toward the total, only the climbing — though obviously you'll do them to get back down.
4. Take water and food if it's going to take more than an hour. For most people at walking pace, 300m of climbing is a proper outing, not a quick loop.
5. No time limit and nothing to beat. Getting the height done is the whole trial.

**THE RUBRIC**

*RISK* — Underestimating how much longer climbing takes than flat walking, and being caught
out on time, light or supplies. Descending too fast on tired legs, where most hill injuries
actually happen.

*GROUND* — Ground you know or a well-marked, popular route. Check the weather for higher
ground specifically — it's often worse than the forecast for the valley below. Postpone for
low cloud, high wind, ice or any weather warning.

*STOP* — The usual four constants, plus: turn back if conditions worsen, if you're not
confident about the descent, or if daylight is running out. None of those are optional to
weigh up on the day.

*SCALE* — Split the 300m across two separate days · use a building's stairs repeatedly for
the same total elevation, indoors and controlled, if no hill is genuinely accessible.

*CLEARED WHEN* — 300 metres of climbing is logged, over however many stops or however long
it took.

**NOTE**

Trial 49 asks for this twice, with someone else watching the clock instead of you.$md$
where num = 24;

update public.trials set
  title      = 'THE RETURN',
  trial_type = 'MOVE',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Forty-five minutes out, then the same way back. The decision to stop only exists at the
start — once you've committed to the halfway point, coming home is the only option left.

**THE WORK**

1. Walk out from your start point for forty-five minutes, any direction, any pace.
2. At forty-five minutes, whatever you were doing, turn around and walk back the same way.
3. You cannot shorten the way back by cutting a corner or calling for a lift, except for a genuine safety reason — the whole trial is that the return exists whether you feel like it or not.
4. Take water and let someone know roughly when you'll be back — this is now a genuine ninety-minute-plus outing.
5. The pace back doesn't have to match the pace out. Slower is completely normal on tired legs.

**THE RUBRIC**

*RISK* — Going out further or faster than you can comfortably reverse, especially if the
weather or your energy changes partway. This is the first trial where the decision made at
minute one has consequences at minute eighty.

*GROUND* — A route you know, or one you're confident you can retrace. Phone charged, water
carried, someone told roughly when to expect you back.

*STOP* — The usual four constants apply throughout, both ways. A genuine safety issue —
injury, severe weather, running out of light — is a legitimate reason to call for a lift
partway. That's not the trial failing; that's the trial working as a safety net should.

*SCALE* — Thirty minutes out instead of forty-five, same rule — turn around at thirty and
walk back.

*CLEARED WHEN* — You've walked back to where you started, having gone the full time out
first.

**NOTE**

Trial 54 asks for this again, further out, with someone knowing exactly where you are.$md$
where num = 25;

update public.trials set
  title      = 'THE STACK, LOADED',
  trial_type = 'MOVE',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Trial 06 a third time, but this time something changes: a small amount of load. Everything
else — the reps, the pace, the rest — stays exactly the same.

**THE WORK**

1. The same three rounds, five movements as Trials 06 and 18 — sit-to-stand, wall press, step-up, hinge, march.
2. Add a small amount of load to whichever movements make sense with what you have — a filled bag held against your chest for sit-to-stands, tins in each hand for the hinge. Nothing elaborate; a few kilos is plenty.
3. Same reps, same three rounds, same talkable pace. The load is the only thing that's different from Trial 06.
4. If a movement doesn't have an obvious way to load it safely, leave it bodyweight — this isn't about loading everything, just proving you can add a little without changing anything else.
5. Rest as long as you want between rounds, as always.

**THE RUBRIC**

*RISK* — Loading too much and turning a controlled session into a strain. The added weight
should barely register as harder, not double the effort.

*GROUND* — Same as Trial 06, plus whatever you're using for load — secure, not sharp-edged,
easy to set down if it slips.

*STOP* — Same as Trials 06 and 18, plus: stop and remove the load if grip, wrist or back
strain shows up — that's the load being wrong, not you.

*SCALE* — No load at all still clears this — the trial is attempting progression, not
necessarily achieving it. Whatever you scaled to on Trial 06 or 18 still applies underneath.

*CLEARED WHEN* — The rounds are done, loaded or not, at the same talkable pace.

**NOTE**

You'll see what you wrote about Trial 18 as soon as you clear this.$md$
where num = 26;

update public.trials set
  title      = 'SEVEN AND SEVEN',
  trial_type = 'HOLD',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Seven minutes to open the day, seven to close it, for a week. The bracket matters more than
either seven minutes does.

**THE WORK**

1. Every day for seven days: seven minutes of movement first thing, and seven minutes again last thing before bed.
2. Whatever you want for the movement — stretching, the Stack's movements, a walk round the block — as long as it's genuinely active for both sevens.
3. The two sessions don't have to match each other in kind or intensity.
4. Log both each day. A day only counts once morning and evening are both done.
5. Miss a full day's pair and it doesn't count. Keep going until you have seven complete days.

**THE RUBRIC**

*RISK* — Physically minimal at seven minutes a time. The real risk is treating the evening
session as optional once the day's got away from you.

*GROUND* — Wherever's available at each end of your day. This one's designed to need no
special space or kit.

*STOP* — The usual four constants for the movement itself. If either seven minutes genuinely
can't happen on a given day, that day simply doesn't count, the same as every hold before it.

*SCALE* — Five minutes each end instead of seven · gentle movement rather than anything
strenuous — the bracket is the trial, not the intensity.

*CLEARED WHEN* — Seven complete days, both sevens logged each day.

**NOTE**

Most days end up being decided by how the morning seven went.$md$
where num = 27;

update public.trials set
  title      = 'THE LOADED HOUR',
  trial_type = 'MOVE',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Trial 08 was a mile with weight. This is an hour with it — the same permission to set it
down applies, for longer.

**THE WORK**

1. Load a bag with real weight, as in Trial 08 — heavier if you want, since there's an hour to spread it across rather than a mile.
2. Carry it for an hour, total, on a route or a loop, walking at any pace.
3. Set it down as often as you like, for as long as you like. There's still no bonus for carrying it the whole time unbroken.
4. Swap sides, swap arms, put it on your back instead if that's easier partway through.
5. An hour of carrying, however it's split by rest.

**THE RUBRIC**

*RISK* — Loading heavier than Trial 08 out of overconfidence, then grinding through
discomfort instead of setting it down. An hour is long enough for a bad load choice to
actually cause an injury, where a mile mostly wasn't.

*GROUND* — A route or loop you know, pavement or made path, water carried if it's warm.

*STOP* — The usual four constants, plus: stop and set the bag down for the day on any grip,
shoulder or back pain, same as Trial 08 — this one just has more time for it to matter.

*SCALE* — Thirty minutes instead of sixty · the same load as Trial 08 rather than more · a
loop close to home so setting the bag down somewhere safe is always an option.

*CLEARED WHEN* — An hour of carrying is done, however it was split by rest.

**NOTE**

The bag doesn't get heavier by rule. Most people make that decision themselves, and it's
usually the wrong one.$md$
where num = 28;

update public.trials set
  title      = 'THE FEEDBACK ASK',
  trial_type = 'SIGNAL',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Ask three people what you could do better and say nothing back. Listening without defending
is the actual skill.

**THE WORK**

1. Ask three separate people for one honest piece of criticism — something they think you could genuinely do better, at work, at home, or just as a person.
2. Ask a real question, not a fishing-for-compliments one: "what's one thing I could do better?" not "how am I doing?"
3. When they answer, you're only allowed to listen and say thank you. No defending, no explaining the context, no "yes, but." One clarifying question is fine if you genuinely don't understand what they mean.
4. Write down what each of the three said, as close to their words as you can remember.
5. You don't have to act on any of it. This trial is about hearing it cleanly, not fixing anything yet.

**THE RUBRIC**

*RISK* — Asking people who'll only say something safe, which defeats the trial — pick people
who'll actually tell you something true if you ask properly. Getting defensive in the
moment, which the instruction exists specifically to prevent.

*GROUND* — Nothing physical. Three conversations, in person, by call, or by message, over
the next two days.

*STOP* — If criticism lands harder than expected from one of the three, that's useful
information about that answer, not a reason to abandon the other two — but it's fine to
pause between conversations if you need to.

*SCALE* — Written answers count exactly the same as spoken ones, if that's easier for you or
them. There's no requirement that the three know each other, or know you in different
contexts.

*CLEARED WHEN* — Three honest answers are collected and written down, un-argued-with.

**NOTE**

The urge to explain yourself is strongest exactly when you should say the least.$md$
where num = 29;
