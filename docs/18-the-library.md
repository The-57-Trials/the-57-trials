# 18. The Library, the Sealed Letter, and the Book

> Rob's design, 31 Aug 2026.
>
> ### The through-line
> > **You open it with a pen and you close it with a book.**
>
> **Built, 2 Sep 2026 (migration `letters_and_reckoning`):** the sealed letter (18.1) at
> Trials 01 and 09, and THE RECKONING (18.7) at Trial 53 — the `letters` and `reckonings`
> tables, `seal_letter`/`get_my_letter`/`submit_reckoning`, and the member-facing UI
> (`SealedLetter.tsx`, `Reckoning.tsx`). Genuinely unreadable server-side until 53, exactly as
> specced — the gate is `get_my_letter()`, not a UI convention. **Not yet built:** the Library
> page itself (18.2), sharing (18.3), and the book (18.4) — those read the data this migration
> now produces, but nothing renders it outside the Reckoning flow yet. Also not done: moving
> Trial 01 before the Entry Pass paywall, per finding 5 in doc 22.1 — see the scoping note at
> the top of the migration for why that was left for separate, security-sensitive follow-up.

---

## 18.1 The Sealed Letter — Trial 01

The first act in the product is not physical. Before anything else, you write.

**The prompt:** why you are here, and what will make you quit.

### How it feels
- The letter is presented as **a page, not a form** — paper-like, generous margins, real writing space.
- Two typefaces to choose from: a **typewriter** face, and a **plain handwriting** face. *Not* ornate script — the feeling wanted is *someone wrote this by hand*, not *Victorian invitation*.
- When finished, one action: **SEAL**.
- A wax seal presses down onto the page. The letter closes, and is **lodged** in the member's Library.

### Sealed and lodged, not cast adrift
The letter is **filed**, the way a will is: closed, held, and opened at an appointed time.

A wax seal on a written declaration is not decoration — it is **officialdom**, the oldest formal
act there is. That belongs in a register. A message in a bottle would mean *cast adrift, might
never return* — the opposite of the mechanic, since the whole point is that it comes back,
deliberately, at **Trial 53**.

### It opens at 53
Trial 53, THE RECKONING, is where the member breaks both seals — the Trial 01 letter and the
Trial 09 letter (THE LINE, what finishing will look like for them) — and answers them honestly.

That is the emotional payload of the entire product, and it costs nothing to produce. It is
also five months of anticipation created by one screen on day one.

---

## 18.2 The Library

**The one warm room.**

Everything else in this product is cold on purpose — the register, the briefings, the flat
acknowledgement when a trial clears. That austerity is the brand.

The Library is the deliberate exception, and it lands harder *because* everything around it
does not. This is the only place in the product that is soft, personal, and yours. **That
contrast is the design, not a departure from it.**

### What lives there

| | |
|---|---|
| **The sealed letters** | Trial 01 and Trial 09, closed until 53 |
| **Your bib** | The number, issued once, never reissued |
| **Milestones** | 15, 30, 45, 57 — when they landed and what arrived |
| **The Trial Blazer card** and the bonus trial |
| **Witnesses** | Who stood witness on trials 48–57 |
| **Your grades** | What you said each trial was worth |
| **Finisher number** | If and when you arrive |

It answers a question the product could not otherwise answer: **what do I actually own at the
end of five months?**

### Naming
"Library" is warm and clear, and warmth is right for this one room. **The Archive** and
**The Lodgement** are colder alternatives if the warmth ever feels wrong.

---

## 18.3 Sharing — earned, and careful

A finished Library can be shared by public link. **Only a finished one.** You cannot share a
run in progress, which makes the link a five-month receipt rather than a marketing asset.

This is also the share artifact the growth research identified as the highest-return remaining
development work — improved, because here it is *earned*.

### The rule that must not be broken

> **The letters are never shared by default. Not once, not ever, not by accident.**

People will write things in Trial 01 they have never said aloud. The shared record shows
trials, dates, witnesses, milestones and finisher number. **Each letter is opted in
individually, or not at all.**

Also required:
- **Revocable** at any time. Unsharing must actually unshare.
- **`noindex` by default** — a member's public page should not surface in search results unless they choose it.
- The share page is a **record**, not a profile. No follower counts, no reactions, no comments.

Get this wrong once and the trust the whole product runs on is gone.

### Privacy notes
- Letter content is **member-written free text and is deeply personal.** Treat it as the most sensitive data in the system after the health confirmation. It must be covered explicitly in the privacy policy and removed on erasure.
- It is **not** user-to-user content — a private letter to yourself creates **no Online Safety Act duty.** That only changes if letters ever become shareable *between members*, which they should not.

---

## 18.4 The Book — and why it changes the economics

At 57, the member unlocks the **right to buy** a printed book of their own run.

> *"You have cleared 57. You have unlocked the right to have it printed."*

Never sold to anyone who has not finished. **Print-on-demand**, so no inventory, no minimum
order, no cash tied up, no size variants.

### What is in it
The 57 briefings · the date each was cleared · who stood witness on the last ten · the grades
they gave · and **both letters** — the one sealed on day one and the one opened at 53.

That is a real book, not a novelty. It largely assembles itself from data already held.

### Why this matters more than it looks

The financial modelling found the business **only made money on members who quit** — a
completer consumed £32–44 of merch against roughly £47 of revenue. Pricing and cooldowns fixed
the worst of it, but finishers remain the thinnest margin in the business.

**The book inverts that.** It is exactly the move the pricing research recommended — *unbundle
merch as earned-right purchases* — and it points at The Conqueror, whose entire business rests
on people happily paying £25–35 for a physical token of a virtual achievement.

> **The finisher goes from the least profitable member to the most.**

It also answers the structural problem with a finite product: **what comes after 57.**

Indicative price ~£35, to be set against real print quotes.

---

## 18.5 The video — considered and rejected

An auto-generated video of a member's journey was considered and **is not being built**.

- **There is no footage.** It would be text and dates animated over music.
- That is Spotify Wrapped — bright, bouncy, shareable-cute, and **the exact opposite of everything else here.**
- Expensive to build and generic; every fitness app already has one.
- The book does the same job permanently, physically, and on-brand.

**A register produces documents, not montages.**

---

## 18.6 Build notes

Not urgent, but **Trial 01 and the Library are launch-relevant** in a way the rest is not — the
letter is the first thing a paying member does, and an empty Library is fine on day one.

Rough order:
1. **The letter and the seal** — needed for Trial 01, so needed at launch.
2. **The Library page** — holds the letter, the bib, and milestones. Grows on its own.
3. **The share link** — only once there is something worth sharing, and only with the letters-private rule built in from the first line of code, never retrofitted.
4. **The book** — after the first member is near 57. Months away. Needs print quotes.

Data:
- Letters: member-written text, one row per member per trial, private by default, deleted on erasure.
- The Library is mostly a **view** over data that already exists — completions, milestones, witnesses, grades, bib, finisher number. Little new storage beyond the letters themselves.

---

## 18.7 Trial 53 — THE RECKONING

> The emotional centre of the product. **The member wrote this trial themselves, on day one,
> without knowing it.**

On Trial 01 they wrote why they were here and what would make them quit. On Trial 09 they
wrote what finishing would actually look like. Five months later both seals break, and one of
two things is true: they were wrong about themselves, or they were right and did it anyway.

Both are worth facing. Neither is authored by us.

### The shape

**1 — The seals break.** Both letters open. Trial 01's *why*, and Trial 09's *prediction of the
end* — which is now testable, because they are four trials from it.

**2 — The pause.** The writing space does **not** appear yet. For two minutes there is nothing
to do but read your own words.

Stated plainly, not punitively: *"Read it again. This opens in 2:00."* The product already
treats compulsory waiting as a feature; here the interval is two minutes of silence with your
own handwriting, and it is the most distinctive screen in the product.

**3 — The button.**

> **ARE YOU READY TO FACE YOURSELF?**

**4 — The answer.** Two equal routes, neither the lesser:

- **Write it.** Answer the person who wrote the letters.
- **Say it.** Read your letters aloud to the person who has stood witness on 48–52, then record that you did.

Speaking is harder than writing for most people and easier for some — which is exactly why
both count. An oath can be written or sworn.

Whichever route, one question must be answered directly and is not optional:

> **Were you right about yourself?**

**5 — The ending. Keep it, or let it go.**

One irreversible choice:

- **LODGE IT** — the letters return to the Library, sealed, permanently.
- **RELEASE IT** — the letters are destroyed. Actually destroyed, not hidden.

The Library records **that a letter was released, and when** — never the content. The absence
is itself a record, and a member who let their letter go should see that they did.

A decision that cannot be undone is a real trial. Warn clearly, confirm once, then honour it.

### Scaling
Within either route: fewer words, or answer only the one required question. **Answering *"were
you right about yourself?"* in a single sentence fully clears the trial.** Nobody is kept from
finishing because they are not a writer.

### What it leaves behind
The Library ends with three letters: the one written on day one, the one written at 09, and the
answer written at 53 — unless the member released the first two, in which case it holds the
answer and the record of a choice.

All of them go in the book.

### Note on the Trial 01 prompt
*"What will make you quit"* is carrying most of the weight here. It is worth being pointed on
day one, because everything at 53 is built from it — a vague letter makes a weak reckoning.
