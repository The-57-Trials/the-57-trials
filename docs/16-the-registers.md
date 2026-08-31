# 16. The Registers

> Spec for the two permanent numbering systems and the Register page.
> Decision D11, 31 Aug 2026. **Not yet built** — this is the design to build from.

---

## 16.1 Two numbers, two meanings

| | Bib number | Finisher number |
|---|---|---|
| **Marks** | Entry | Arrival |
| **Assigned** | At signup | On clearing trial 57 |
| **Starts at** | 058 *(001–057 reserved)* | 001 |
| **Format** | `No. 0412` | `Finisher No. 003` |
| **Reissued** | Never | Never |
| **Runs out** | No | No |

They are independent. A member can be **Bib 0412 and Finisher 003** — and that combination
tells a story on its own: they joined late and finished early.

**Bibs 001–057** go to the pre-launch grading cohort, with a permanent `FOUNDING` mark. They
earned a number before there was anything to join, which is the only thing that could justify
holding those back.

---

## 16.2 Assignment rules

**Both numbers are facts, not rankings.** Neither is ever recalculated, and neither can move.

- Assigned from a **sequence**, so a number is consumed the moment it is issued.
- **Never reissued**, including after account deletion. If a member erases their account, their number is *retired*, not recycled. Sequences give this for free.
- **Never renumbered.** This is the reason finisher numbers must be *stored*, not computed. A computed rank over completion timestamps would silently renumber everyone below a member who later deletes their account — which would make the number a ranking rather than a record, and break the one promise it makes.

### GDPR interaction
On erasure, the finisher row is deleted with the rest of the member's data and the number is
simply retired. The public Register loses that line. Nothing needs special retention here —
unlike the consent record, a finisher number is not evidence of anything and carries no
retention obligation.

---

## 16.3 The Register page

Replaces the ranked leaderboard (D8). **parkrun publishes every result and every milestone and
is emphatic that it is not a race** — that is the reference.

### Two sections

**THE FIELD** — everyone, in **bib-number order**. Never sorted by progress.

| Bib | Runner | Cleared |
|---|---|---|
| 0058 | ADMIN57 | 5 / 57 |
| 0059 | … | 12 / 57 |

Bib order is the only correct sort. Sorting by progress makes it a leaderboard again, and the
member at the bottom of a progress-sorted list is being told something the brand has no
business telling them.

**THE FINISHED** — those who cleared all 57, in **finisher-number order**.

| | Bib | Runner | Finished |
|---|---|---|---|
| **Finisher No. 001** | 0058 | … | 14 Mar 2027 |

Empty until someone finishes. **Show the empty state deliberately** — *"No one has finished
yet."* — rather than hiding the section. An empty Finished register is a statement about how
hard this is, and it is the most honest thing on the page.

### Rules for the page
- **No times.** Not elapsed, not per-trial, not anywhere.
- **No rank column.** Position in the list is entry order, never merit.
- **No sorting controls.** Sortability invites exactly the comparison the brand refuses.
- The viewer's own row is marked, not moved to the top.

---

## 16.4 What being first actually gets you

**Finisher No. 001. Permanently. Their finisher's plate hand-numbered `001`.**

That is the whole reward, and no material prize attaches to it.

### Why nothing more
The moment there is something to win, there is a reason to lie — on a product where nothing is
verified and, since D10, nothing is even flagged. Scarcity is the reward: `001` exists once and
can never be issued again, which is more than money could buy.

### The framing rule
> **Record who was first. Never offer it as a prize.**

Do not announce a reward for finishing first. Simply keep the Register in completion order, and
the first person is first forever without anyone having raced for it.

Safe by construction anyway: the cooldowns cap the maximum honest pace at **147 days**, so
"first" is decided by when someone joined and by not stopping — never by pushing harder on any
given day.

### The right to confer
Finishing earns the right to **stand as witness** to other members (the Reckoning, Phase 2).
Finisher 001 is simply the first person who can.

The brand research identified this as the highest-status mechanism in every honour tradition,
and it costs nothing: rank confers duty rather than privilege. It also answers the retention
problem — it gives finishers a role *after* finishing, at the exact moment the product would
otherwise be over for them.

---

## 16.5 Build notes

**Not urgent.** Nobody can finish for at least 147 days, and finisher numbers are
reconstructable from `completions` where `trial_num = 57` ordered by `cleared_at` if they are
added later. Nothing is lost by waiting.

**Deliberately not touching `clear_trial` yet.** It is the most security-critical function in
the system — it enforces the sequence, the payment gates and the cooldowns — and there is no
case for modifying it for something that cannot happen for five months.

When built:

```
finishers
  finisher_number  int    from a sequence starting at 1, unique, never reissued
  user_id          uuid   references profiles, cascade on delete
  finished_at      timestamptz
```

- Insert from inside `clear_trial` when `p_trial_num = 57`, in the same transaction as the completion, so the two can never disagree.
- Add to the leaderboard/register view: `finisher_number` where present.
- RLS: readable by any authenticated member, writable by nobody — same posture as `completions`.
- Verify afterwards that `clear_trial` still enforces order, payment and cooldowns.
