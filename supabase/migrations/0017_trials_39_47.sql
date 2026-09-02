-- 0017: trials 39-47, completing chapter V (MASTERY). Bodies are authored
-- in content/trials/*.md, the source of truth; this migration is generated
-- from those files.
--
-- Trial 41, THE FORGIVENESS LETTER, is written here as a standard MARK
-- trial using THE ACCOUNT, not the sealed-letter schema from migration
-- 0013. The storyboard (doc 22.5) says it "reuses the letter UI," but its
-- unlock rule is different in kind, not degree -- it reads back immediately
-- rather than staying sealed until Trial 53 -- so wiring it into `letters`
-- needs its own schema decision (doc 22.6), not an assumption made here.

update public.trials set
  title      = 'THE NAVIGATION',
  trial_type = 'CRAFT',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Navigate somewhere new using a paper map, nothing else. A skill this product has quietly
assumed you might need by the time chapter VI asks you to go further alone.

**THE WORK**

1. Get a paper map — Ordnance Survey or equivalent — covering an area you don't already know well.
2. Plan a route on it: a walk of an hour or two, with a clear start and end point you can identify on the map before you leave.
3. Navigate using only the map. No GPS, no phone navigation, no following a blue dot. A compass is optional but allowed.
4. Actually get where you're going using the map, not by asking someone or recognising a landmark you happen to know.
5. If you get properly lost, use your phone to get home safely — that's not failing the trial, it's the sensible override. Note honestly whether you needed it.

**THE RUBRIC**

*RISK* — Genuinely losing your way in an area you don't know, which is more disorientating
than it sounds the first time. Misjudging distance or time on the map versus on the ground.

*GROUND* — A populated, well-marked area for a first attempt — not remote or trackless
ground. Phone charged and carried as the safety net, even though it's not the navigation
tool.

*STOP* — The usual four constants, plus: if you're lost and light or weather is turning, use
the phone immediately rather than persisting on principle.

*SCALE* — A smaller loop, thirty to forty-five minutes · somewhere semi-familiar rather than
completely new, if unfamiliar ground genuinely isn't safely available to you.

*CLEARED WHEN* — You've navigated to your planned end point using the map, phone kept as
backup only.

**NOTE**

However this goes, you'll have opened the phone map at least once in your head, just to
check. That's fine — the trial is what you did with your hands, not your instincts.$md$
where num = 39;

update public.trials set
  title      = 'EVERY HOUR',
  trial_type = 'MOVE',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Twenty reps of something, every hour you're awake. Not a session — a rhythm laid over an
ordinary day, whether the day cooperates or not.

**THE WORK**

1. Pick one simple movement — sit-to-stand, wall press, march on the spot — whichever fits wherever you'll actually be.
2. Every waking hour, do twenty reps. Set a reminder if that helps — this only works if you actually notice the hour turning over.
3. Twenty reps takes under a minute. Fit it in wherever you are: at a desk, in a kitchen, between meetings.
4. Keep going through the whole day, however many waking hours that is for you.
5. Log the total once the day's done.

**THE RUBRIC**

*RISK* — Fatigue building cumulatively across a long day if the chosen movement is more
demanding than it felt in isolation. Missing hours because life gets in the way, then trying
to cram makeup reps — don't. Missed hours are just missed.

*GROUND* — Whatever the movement needs, wherever you happen to be through the day.

*STOP* — Stop for the day if any of these happen: chest pain or tightness · breathlessness
that doesn't settle within a minute of stopping · dizziness that doesn't clear when you sit
down · any sharp or new pain. Also stop for the day on any pain that builds rather than
settling between hours — that's the day's total needing to be smaller, not pushed through.

*SCALE* — Ten reps an hour instead of twenty · every other waking hour instead of every one.

*CLEARED WHEN* — Reps are logged for the substantial majority of your waking hours that day.

**NOTE**

By hour nine the reminder becomes the hardest part, not the twenty reps.$md$
where num = 40;

update public.trials set
  title      = 'THE FORGIVENESS LETTER',
  trial_type = 'MARK',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

A letter to someone who wronged you, or to yourself for something you haven't let go of.
You don't have to send it. Writing it is the trial.

**THE WORK**

1. Choose one thing you're still carrying — something someone did to you, or something you did that you haven't forgiven yourself for.
2. Write a letter about it, addressed to whoever it concerns — them, or you.
3. Don't aim for a tidy resolution. Write what actually happened, what it cost, and whatever you're honestly able to say about moving past it — even if that's "I'm not there yet."
4. You don't have to send it, and in most cases you shouldn't feel obliged to. Writing it is the whole instruction.
5. Read it back once, to yourself, before you finish.

**THE RUBRIC**

*RISK* — Performing forgiveness you don't actually feel, to make the letter sound resolved.
An unfinished, honest letter is worth more here than a neat one.

*GROUND* — Private, unhurried, nothing physical required.

*STOP* — If what you're writing about is still an open wound rather than an old one, that's
worth naming to someone — a friend, a professional — alongside writing it, not instead of
it. The trial stays open with no deadline.

*SCALE* — A short, honest paragraph clears this exactly as fully as a longer letter would.

*CLEARED WHEN* — The letter is written and read back once.

**NOTE**

Some of the best ones here were never finished in the way their writer expected.$md$
where num = 41;

update public.trials set
  title      = 'FIRST AID',
  trial_type = 'CRAFT',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Basic first aid, learned properly, before the trials that ask you to be further from help
than you've been so far.

**THE WORK**

1. Complete a basic first aid course — a free online basics course at minimum, an in-person one if you can find one nearby.
2. Cover, at minimum: what to do for a collapsed or unresponsive person, CPR basics, and how to treat a significant cut or a sprain.
3. Take proper notes as you go, not just clicking through — you should be able to explain the basics back afterward without looking.
4. If you already hold a valid first aid certificate, this trial is cleared by confirming that, not by repeating training you've already done.
5. Log what course or resource you used.

**THE RUBRIC**

*RISK* — Skimming a course without absorbing anything, which defeats the entire point — this
is preparation for chapter VI, not a box to tick.

*GROUND* — Nothing physical required beyond attention. A quiet hour or two to actually do
the course properly.

*STOP* — Nothing about this trial should cause distress. If course content about medical
emergencies is difficult for personal reasons, a written-summary version — reading a
reputable guide rather than a video course — clears it just as fully.

*SCALE* — A shorter "basics" version of a course rather than a full certificate clears this —
depth matters more than the credential.

*CLEARED WHEN* — A course or equivalent resource is completed, or an existing valid
certificate is confirmed.

**NOTE**

Nobody wants to need this. Everybody's glad they did it anyway.$md$
where num = 42;

update public.trials set
  title      = 'THE REST DAY',
  trial_type = 'HOLD',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

A full day of planned rest, chosen in advance, not collapsed into because you had nothing
left. Rest done on purpose is a different act to rest that just happens.

**THE WORK**

1. Pick a day in advance — not today, because reacting today isn't the same as planning.
2. On that day, do no structured exercise and no other trial. Ordinary movement — walking to the shop — is fine; the instruction is no deliberate training.
3. Plan what "rest" means for you beforehand: sleep, a slow day, doing something enjoyable that isn't demanding. Decide it, don't just default into it.
4. Actually take the day. Don't quietly do "just a bit" of something because sitting still feels wrong.
5. Log it as a cleared trial once the day's done — this is work, recorded the same way as any other.

**THE RUBRIC**

*RISK* — Guilt turning the rest day into a half-rest day, which undermines the entire point.
The risk here is doing too much, not too little.

*GROUND* — Nothing physical required. Wherever your ordinary rest happens.

*STOP* — There's no version of this trial that goes wrong by resting too well.

*SCALE* — A half-day of planned rest, if a full day genuinely isn't available this week.

*CLEARED WHEN* — The planned day, or half-day, has passed with no structured training done.

**NOTE**

This is the only trial where doing less than planned is impossible to fail.$md$
where num = 43;

update public.trials set
  title      = 'THE FAMILY HISTORY',
  trial_type = 'SIGNAL',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Thirty minutes of an older relative's life, recorded before it's only a memory of a memory.
This is the trial most people are glad exists and least likely to have done unprompted.

**THE WORK**

1. Choose an older relative — a parent, grandparent, aunt, uncle, or an older family friend if that's who's closest to you.
2. Record a conversation with them, audio or video, for at least thirty minutes. Ask about their life — where they grew up, what they did, what they remember most.
3. Let them lead more than you do. Prepare a few questions, but the good material usually comes from following what they want to talk about.
4. Keep the recording somewhere safe afterward. This trial produces something worth having, not just something worth doing.
5. Log that it's done — the recording itself is yours to keep, not submitted anywhere.

**THE RUBRIC**

*RISK* — Treating it as an interview to get through rather than a conversation, which makes
for a worse recording and a worse thirty minutes for both of you.

*GROUND* — Nothing physical. A quiet place to talk, a phone or recorder that actually works —
test it before you start, not after thirty minutes have gone unrecorded.

*STOP* — If the relative doesn't want to be recorded, ask instead about writing down what
they tell you, or choose a different relative — this should never feel like an ambush.

*SCALE* — Fifteen minutes instead of thirty · written notes taken during or after the
conversation, if recording genuinely isn't possible or wanted.

*CLEARED WHEN* — Thirty minutes, or the scaled version, is recorded or noted.

**NOTE**

Almost everyone who does this trial says they wish they'd done it years earlier.$md$
where num = 44;

update public.trials set
  title      = 'THE BLAZER',
  trial_type = 'MOVE',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Forty-five minutes continuous, finishing easier than you started. Clear this and a Trial
Blazer card arrives — a second sequence, running parallel to this one, that you can choose
to take up or leave alone.

**THE WORK**

1. Forty-five minutes, continuous, at a pace you control — walking, a long version of the Stack as a flow, cycling, whatever suits.
2. The instruction that matters: finish feeling easier than you started, not harder. Start slower than feels necessary and let the pace settle, not build.
3. If you're breathing harder at minute forty than minute five, you started too fast — useful information for next time, not a reason to stop today.
4. Take water if you need it. No target distance, only the time and the shape of the effort.
5. Log it once the forty-five minutes are done.

**THE RUBRIC**

*RISK* — Starting at a pace that feels comfortable in the moment but isn't sustainable for
forty-five minutes, and fading in the second half instead of finishing stronger.

*GROUND* — Whatever the chosen movement needs — familiar, safe, somewhere you can adjust
pace freely without obstruction.

*STOP* — Stop for the day if any of these happen: chest pain or tightness · breathlessness
that doesn't settle within a minute of stopping · dizziness that doesn't clear when you sit
down · any sharp or new pain.

*SCALE* — Thirty minutes instead of forty-five, same instruction: finish easier than you
started.

*CLEARED WHEN* — Forty-five continuous minutes are done, finishing at an easier effort than
they began.

**NOTE**

The Trial Blazer card that arrives after this is optional, and its own bonus trial. Nothing
about the 57 depends on taking it up.$md$
where num = 45;

update public.trials set
  title      = 'THE TEACHING',
  trial_type = 'SIGNAL',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

Learn something new by morning, teach it to someone else by evening. Understanding something
well enough to hand it on is a different test to understanding it for yourself.

**THE WORK**

1. Pick a small, teachable skill or piece of knowledge you don't currently know — something you can genuinely learn in a morning from a book, a video, or a person.
2. Learn it properly enough that you could demonstrate or explain it without notes.
3. Find someone — anyone — and teach it to them the same day, by evening. In person if you can, by call if you can't.
4. Teach it plainly, the way the trials here are written — clear instructions, not a lecture.
5. Log what you learned and who you taught.

**THE RUBRIC**

*RISK* — Picking something too large to genuinely learn in half a day, and teaching
something you don't actually understand — that's worse than not teaching at all.

*GROUND* — Nothing physical required beyond whatever the chosen skill needs.

*STOP* — Nothing here should cause distress. If the day genuinely doesn't allow both halves,
the trial stays open until a day that does.

*SCALE* — Something very small and quick — a single technique, a single fact explained well —
clears this exactly as completely as something bigger.

*CLEARED WHEN* — Something new was learned in the morning and taught to someone else by
evening.

**NOTE**

Explaining it out loud is usually the moment you find out whether you actually understood
it.$md$
where num = 46;

update public.trials set
  title      = 'SOLITUDE',
  trial_type = 'HOLD',
  flag       = 'AMBER',
  body_md    = $md$**THE LINE**

A full day largely alone, chosen rather than fallen into. The last quiet trial before
chapter VI, where you'll rarely be unaccompanied again.

**THE WORK**

1. Pick a day and spend the majority of it alone, by choice — no plans with other people, minimal necessary interaction (a shop transaction is fine).
2. Fill the day however you want, as long as it's genuinely solitary rather than alone-but-on-a-call the whole time.
3. This isn't a silence trial like Silent Hour — screens, music and reading are all fine. The instruction is about company, not input.
4. If you live with other people, this is harder to arrange and more worth arranging — even a solitary afternoon carved out of a shared day counts if a full day genuinely isn't possible.
5. Log it once the day's done, noting honestly how much of it you actually spent alone.

**THE RUBRIC**

*RISK* — Physically none. The real difficulty for some people is that a day alone surfaces
feelings they usually keep busy enough to avoid.

*GROUND* — Wherever you can actually be undisturbed for a meaningful stretch of the day.

*STOP* — If solitude brings up something heavier than expected — loneliness, low mood,
anything that feels bigger than a quiet day — that's worth telling someone about, not
pushing through alone for the trial's sake.

*SCALE* — Half a day instead of a full one · a solitary stretch of several hours carved out
of a shared day, if living arrangements make a full day genuinely impractical.

*CLEARED WHEN* — A day, or the scaled version, is spent largely alone, by choice.

**NOTE**

Chapter VI is rarely done without someone knowing where you are. This is the last trial
that's entirely your own business.$md$
where num = 47;
