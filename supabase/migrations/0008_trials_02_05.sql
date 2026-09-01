-- 0008: real content for trials 02-05, and the two columns the trial header needs.
--
-- The briefing anatomy (docs/04-product.md 4.1) renders a header strip of
-- number, chapter, type and flag, plus a PRIME stamp. Chapter already existed;
-- type and flag did not, so no trial could actually be rendered as specced.
-- Primality is NOT stored - it is a property of the number and is derived in
-- the app, so it can never drift out of step with the trial it belongs to.
--
-- Bodies are authored in content/trials/*.md, which is the source of truth.
-- This migration is generated from those files; edit the markdown, regenerate.

alter table public.trials add column if not exists trial_type text;
alter table public.trials add column if not exists flag text
  check (flag in ('GREEN', 'AMBER', 'RED'));

-- Flags are fixed by chapter (4.1) and never vary within a band.
update public.trials set flag = case
  when num between  1 and 19 then 'GREEN'
  when num between 20 and 47 then 'AMBER'
  else 'RED'
end where flag is null;

update public.trials set
  title      = 'THE INVENTORY',
  trial_type = 'MARK',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

Within a month someone will tell you they'd love to do this but they haven't got the time.
It might be you. Before you believe it, find out where your time actually goes.

**THE WORK**

1. Pick one ordinary day. Today or tomorrow — not a day off, not a day you already know will be unusual.
2. Account for all twenty-four hours in writing. Whole hours are fine. Sleep counts. Work counts. Where you genuinely can't remember, write *don't know* — that is also a finding.
3. Go back through and mark every hour you **chose**. Not enjoyed. Not benefited from. Chose. Sleep isn't chosen. Neither is the commute. Forty minutes on your phone because you meant to check one thing is not chosen either.
4. Count the marked hours. Write the number at the bottom and leave it there.

Change nothing. This is a reading, not a repair.

**THE RUBRIC**

*RISK* — Writing the day you meant to have instead of the day you had. A tidied inventory is
worth nothing at Trial 19, when you are asked what has actually changed and what you have
been pretending about.

*GROUND* — Paper or a screen, whichever you will actually finish. Somewhere nobody is
reading over your shoulder.

*STOP* — If accounting for your own day turns into something heavier than you expected —
and for some people it does — put it down. The trial stays open and costs you nothing to
leave for a week. Come back to it, or scale it, or speak to someone first. None of those is
failing.

*SCALE* — Six waking hours instead of twenty-four. Any six, consecutive. That clears it.

*CLEARED WHEN* — The day is accounted for and the chosen hours are counted. Not when the
number is good. There is no good number and you are not being marked on it.

**NOTE**

Most people find between one and three. The number is not the point. Knowing it is.$md$
where num = 2;

update public.trials set
  title      = 'THE PLEDGE',
  trial_type = 'MARK',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

There will be a day when you do not want to do this. You will not be thinking clearly on
that day. Write the sentence now, while you still can.

**THE WORK**

1. You sealed a letter two days ago and you cannot open it until Trial 53. Work from what you remember of it — the part about what would make you quit. What you remember is the part that matters.
2. Write one sentence you will say out loud on the day you want to stop. **Ten words or fewer.**
3. It has to survive being said aloud, alone, in the rain, by you. Not read. Said.
4. No borrowed slogans. Nothing off a poster, a mug or a gym wall. If it would look at home in a motivational graphic, write a different one.
5. Say it out loud once, now. If you can't say it without wincing, it is the wrong sentence. Write another.

**THE RUBRIC**

*RISK* — Writing something that sounds good rather than something that works. The two are
easy to confuse in a quiet room on a Tuesday and impossible to confuse at Trial 16.

*GROUND* — Somewhere you can say a sentence out loud, or somewhere you don't mind being
overheard doing it.

*STOP* — If working out what you'd say to keep yourself going brings up more than you were
expecting, leave it. The trial stays open indefinitely. Nobody is waiting on it.

*SCALE* — Five words. Three. One. **"Again" is a complete pledge** and has cleared this
trial before.

*CLEARED WHEN* — The sentence is written, it is ten words or fewer, and you have said it
out loud once.

**NOTE**

It is printed in your book at 57 exactly as you wrote it. Choose accordingly.$md$
where num = 3;

update public.trials set
  title      = 'FIRST GROUND',
  trial_type = 'MOVE',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

The first physical trial. Thirty minutes outdoors, on your feet, with nothing in your ears
and nowhere to be.

**THE WORK**

1. **Outdoors.** Not a treadmill, not a corridor, not a shopping centre.
2. **Thirty minutes, walking, unbroken.** Waiting at a crossing is fine. Sitting down for five minutes is not — that is two walks.
3. **No headphones.** No music, no podcast, no calls, no audiobook.
4. **No destination.** Not to the shop, not to work, not to collect anyone. If the walk has an errand in it, do this one separately.
5. **Any pace.** Pace is not the trial. Thirty minutes is the trial.

You will be bored somewhere around minute eleven. That is the trial working, not a fault in
it. Trial 11 asks for an hour of it.

**THE RUBRIC**

*RISK* — Kerbs, traffic and uneven ground you would normally clock without thinking; with
nothing playing you will be paying attention to your own head instead. Blisters, if the
shoes are new. Walking further out than you meant to and having to walk all of it back.

*GROUND* — Outdoors, on ground you know, on a route you could cut short at any point. Shoes
you have already worn in. Phone on you, charged, on silent. If it is dark, somewhere lit and
populated.

*Not required, but start it now:* tell someone where you're going and roughly when you'll be
back. From Trial 48 that is a rule. It is a much easier habit to own by then if it started
here.

*STOP* — Stop for the day if any of these happen: chest pain or tightness · breathlessness
that doesn't settle within a minute of stopping · dizziness that doesn't clear when you sit
down · any sharp or new pain. Also stop if a blister starts rather than pushing on to the
half hour — that is how the next four trials get missed. Stopping costs you nothing. The
trial stays open. Go again tomorrow.

*SCALE* — Any of these clears the trial: fifteen minutes instead of thirty · three lots of
ten across the day · circuits of a garden, a yard or one short street · thirty minutes on
your feet indoors with a window open, if outdoors genuinely isn't available to you today.

*CLEARED WHEN* — Thirty minutes have passed, you were outdoors, and nothing was playing in
your ears.

**NOTE**

This is the one people quietly repeat on days when they have no trial open.$md$
where num = 4;

update public.trials set
  title      = 'SEVEN GLASSES',
  trial_type = 'HOLD',
  flag       = 'GREEN',
  body_md    = $md$**THE LINE**

Seven mornings. One glass of water before anything else. This is the first trial that takes
a week rather than a day, and the first one you can drop halfway through.

**THE WORK**

1. Every morning for seven days: drink **one full glass of water** — around 250ml, a mug's worth — before anything else.
2. *Before anything else* means before coffee, before tea, before food, before your phone, before the news, and before the first thing you were going to do instead.
3. **One glass. Not a litre.** More is not better here and this is not a hydration challenge.
4. Log it each morning, in the app, once it's done. Seven logs on seven separate mornings clears the trial.
5. Miss a morning and that morning simply doesn't count. Keep going until you have seven. **Nothing restarts and nobody is told.** That changes at Trial 10, and you'll be ready for it by then.

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
where num = 5;

-- 0002 grants SELECT on trials column by column, deliberately, so that body_md
-- stays unreadable and nobody can read ahead through the REST API. New columns
-- are therefore invisible until named here. body_md stays out, as it must -
-- content is served only through get_trial_body(), which enforces payment and
-- sequence.
grant select (trial_type, flag) on public.trials to authenticated;
