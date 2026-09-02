-- 0012: executes the trial reorder decided in docs/22-the-storyboard.md
-- (22.7) but never applied to content or the database:
--
--   1. Trial 03 rewritten to the if-then implementation-intention format
--      (finding 3 — Gollwitzer & Sheeran, d = 0.77 against derailment).
--   2. Trial 05 becomes ONE THING FINISHED (CRAFT). SEVEN GLASSES moves to
--      Trial 10, its HOLD duration moving with it.
--   3. Trial 06, THE STACK, written in the storyboard commit but never
--      loaded — loaded here.
--   4. Trial 07 becomes THE UNSEEN EFFORT (SIGNAL, prime) — the trial that
--      was previously drafted for this slot (ONE THING FINISHED) has moved
--      to 05.
--
-- Bodies are authored in content/trials/*.md, the source of truth. This
-- migration is generated from those files; edit the markdown, regenerate.

update public.trials set
  body_md = $md$**THE LINE**

There will be a specific moment when you want to stop — not a mood, a moment. Decide now
what you do when it arrives, because the version of you who is in it will not be able to
decide anything.

**THE WORK**

1. You sealed a letter two days ago and cannot open it until Trial 53. Work from what you remember of it — the part about what would make you quit. What you remember is the part that matters.
2. Name the moment. Not "when it's hard" — a specific moment: a time of day, a place, a feeling, a sentence someone says. The more specific, the more useful it will be later.
3. Write it in exactly this shape: **"If [that moment], then I will [the specific thing I do]."** The second half must be an action, not a feeling. "Then I will keep going" is not specific enough. "Then I will put my shoes on and walk to the end of the street" is.
4. Say it out loud once, now, exactly as written. If you can't say it without wincing, the action is wrong — fix that half, not the moment.
5. No borrowed slogans. If it would look at home on a poster, a mug or a gym wall, write a different one.

**THE RUBRIC**

*RISK* — Naming a moment that sounds dramatic rather than the one that will actually happen.
Writing an action you'd do on a good day, not one you'd still do at eleven at night, tired,
and looking for a reason not to.

*GROUND* — Somewhere you can say a sentence out loud, or somewhere you don't mind being
overheard doing it.

*STOP* — If working out what stops you brings up more than you were expecting, leave it. The
trial stays open indefinitely. Nobody is waiting on it.

*SCALE* — Twenty words total, across both halves, is the ceiling — long enough to be
specific, short enough to say without reading it. **"If I want to stop, then I message
someone" has cleared this trial before.** It's still a real if-then. Keep it real, not short.

*CLEARED WHEN* — Both halves are written, in if-then form, and you've said the whole thing
out loud once.

**NOTE**

It is printed in your book at 57 exactly as you wrote it. Choose accordingly.$md$
where num = 3;

update public.trials set
  title      = 'ONE THING FINISHED',
  trial_type = 'CRAFT',
  flag       = 'GREEN',
  min_gap_minutes = 1440,
  body_md    = $md$**THE LINE**

Everything from here assumes you can finish something you've already started once. Before
asking you to start fifty-two more, this asks you to close one you already have open.

**THE WORK**

1. Pick one thing you started and never finished — abandoned for a month or more. Not a wish, an actual unfinished thing: the shelf half up, the form half filled, the box half unpacked, the email half drafted, the course half watched.
2. It has to already exist, part-done. Starting something new today doesn't count, however small.
3. Any size clears this. A five-minute email counts as much as a rebuilt fence, if it's the one that's been sitting there.
4. Finish it. All the way — not "far enough for now." Finished the way you'd have called it finished if you'd done it in one sitting the first time.
5. If more than one thing qualifies, pick the one that's been open longest, not the easiest.

**THE RUBRIC**

*RISK* — Choosing the easiest unfinished thing instead of the one that's actually been
nagging you. Picking something you don't fully control finishing — waiting on someone else's
reply or delivery. Pick one you can finish alone, today.

*GROUND* — Whatever tools or materials the thing needs. If finishing it means buying
something small — a part, a stamp, a battery — that's fine. The effort is the trial, not
going without.

*STOP* — If choosing which unfinished thing to face brings up more than you expected — for
some people that list is longer and heavier than they thought — put it down. The trial stays
open, no deadline, and picking it back up next week is not a lesser way to clear it.

*SCALE* — Break a large unfinished thing into a finishable slice: one section, one drawer,
one page — provided you're honest that the slice itself is now complete, not "for now."

*CLEARED WHEN* — The thing is done, not scheduled, not nearly. Done the way you'd tell
someone it's done.

**NOTE**

This is the shortest trial in the book and the one people delay longest.$md$
where num = 5;

update public.trials set
  title      = 'THE STACK',
  trial_type = 'MOVE',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

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

Every session you'll ever do is this one with the numbers changed.$md$
where num = 6;

update public.trials set
  title      = 'THE UNSEEN EFFORT',
  trial_type = 'SIGNAL',
  flag       = 'GREEN',
  min_gap_minutes = 1440,
  body_md    = $md$**THE LINE**

Fifty more trials from here, nobody checks any of them. This one asks you to get used to that
on purpose, while the stakes are still small.

**THE WORK**

1. Do something that costs you real time or effort and genuinely helps one other person — a task, a fix, an errand, a favour with actual weight to it. Not a gift bought. Something done.
2. It should take at least thirty minutes, or be the kind of effort you'd normally mention afterward.
3. If it's possible to do without them knowing it was you, do it that way. If it isn't — if the task can't be done invisibly — it can be seen, but it can't be said. Once it's done, you don't bring it up. Not to them, not to anyone.
4. If they ask directly whether you did it, you don't have to lie — but you don't volunteer it first, not that day, not next week, not in a story about yourself later.
5. Choose something that's actually theirs to receive. Don't take on a task you don't have permission for, or start fixing something in someone's space without asking first.

**THE RUBRIC**

*RISK* — Picking something small enough to be easy, which defeats the trial. Being
presumptuous because it's supposed to be a surprise — not everyone wants an unannounced fix
in their home or their business. Telling someone "guess what I did" three days later, which
undoes the whole trial in one sentence.

*GROUND* — Something within your actual means, and someone else's actual consent to receive
help in that space. No task that needs a skill, a tool, or an access you don't have.

*STOP* — If staying quiet about something good turns out to matter more than you expected —
some people find that surprisingly hard — that's useful to know, not a reason to fail the
trial. Tell one person, quietly, once, if you truly need to. It still clears.

*SCALE* — Twenty minutes instead of thirty. Something smaller done for a stranger rather than
someone you know, if that makes the silence easier to keep. The size can shrink. The silence
can't.

*CLEARED WHEN* — The effort is finished and nobody has been told.

**NOTE**

Most of what you do for the next fifty trials will look exactly like this from the outside:
real, and invisible.$md$
where num = 7;

update public.trials set
  title      = 'SEVEN GLASSES',
  trial_type = 'HOLD',
  flag       = 'GREEN',
  min_gap_minutes = 10080,
  body_md    = $md$**THE LINE**

Seven mornings. One glass of water before anything else. This is the first trial that takes
a week rather than a day, and the first one you can drop halfway through.

**THE WORK**

1. Every morning for seven days: drink **one full glass of water** — around 250ml, a mug's worth — before anything else.
2. *Before anything else* means before coffee, before tea, before food, before your phone, before the news, and before the first thing you were going to do instead.
3. **One glass. Not a litre.** More is not better here and this is not a hydration challenge.
4. Log it each morning, in the app, once it's done. Seven logs on seven separate mornings clears the trial.
5. Miss a morning and that morning simply doesn't count. Keep going until you have seven. **Nothing restarts and nobody is told.**

**THE RUBRIC**

*RISK* — Physically, close to none. Realistically: forgetting on day three, deciding the run
is spoiled, and abandoning a trial that cannot actually be spoiled.

*GROUND* — A glass, filled, left out the night before where you cannot miss it on the way to
the kettle. That is the entire method.

*STOP* — **If your fluid intake is restricted or managed on medical advice, do not do this
trial as written** — take the scale below instead, which clears it in full. Otherwise the
usual: chest pain or tightness · breathlessness that doesn't settle within a minute ·
dizziness that doesn't clear when you sit down · any sharp or new pain.

*SCALE* — Any of these clears the trial: half a glass · or, if drinking to order isn't
available to you, keep the ritual and change the act — seven mornings where the first thing
you do, before the phone, is stand up and open the curtains.

*CLEARED WHEN* — Seven mornings are logged. Not seven perfect days, and not seven in a row.

**NOTE**

The water is not the trial. The glass you put out the night before is the trial.$md$
where num = 10;
