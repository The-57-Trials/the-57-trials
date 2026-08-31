# 17. Witnessed Trials

> Spec, 31 Aug 2026. **Not yet built.**
> Replaces the proposal to require trials 20/30/40/50 be live-streamed on social media.

---

## 17.1 What this is, and what it is not

**A witness attests they saw it. They do not judge whether it was good enough.**

Nothing here verifies a completion, and the business assesses nothing. Naming a witness turns
a private claim into a **public, attributable** one — that is the entire mechanism, and it is
why honour traditions bother with witnesses at all.

You are not vetting the witness. Naming your sister is allowed. But the name sits on your
entry permanently, and that visibility is the cost the member pays consciously.

### Why not live-streaming
The instinct — make some trials weightier — was right. Broadcast was the wrong mechanism:

- **It excludes paying customers.** Anyone without social media, anyone who will not be visible for privacy or safety reasons, anyone self-conscious about being watched exercising. That is a large share of the market, and the research found this audience is drawn to austerity and privacy rather than performance.
- **It inverts the safety design.** People push harder for a camera. An unsupervised physical challenge, performed for an audience, with nobody present to intervene, is the exact combination the safety architecture exists to prevent.
- **It does not verify anything.** A stream can be staged, faked or be someone else. You would take on exclusion, safety risk and moderation duty and still not know.
- **It breaks the spine.** "Nobody checks" and "we check four times" cannot both be true.

---

## 17.2 The witness record

| Field | Value |
|---|---|
| Witness first name | Free text, ≤ 40 chars |
| Relationship | Free text, ≤ 40 chars — *"sister"*, *"colleague"*, *"running club"* |
| Recorded | Timestamp, on the member's entry, permanent |

Requirements stated to the member: **18 or over**, and **not you**.

### The rule that decides the design: no contact details

**Never collect the witness's email, phone number or address, and never contact them.**

The moment a witness is emailed, the business is processing the personal data of **someone who
is not a customer** — requiring its own lawful basis, a privacy notice served on a person who
never signed up to anything, and a deletion path for them. That is a real and ongoing GDPR
burden for a marginal gain in rigour, on a product that has already decided it does not verify.

A first name and a relationship is not meaningfully identifying and creates no obligation to a
third party. It is also nearly as strong, because the deterrent was never that anyone would
ring Sarah. **It is that the member had to write "Sarah" down.**

---

## 17.3 Where witnessing applies

### Trials 48–57 (chapter VI, RED) — from launch

These already require a **named check-in person before the member starts**: route shared,
expected finish time, and an agreed plan if they do not report. That exists for *safety*.

**They are already the assessor.** Asking for that same person's first name afterwards makes
these trials witnessed at no extra burden on anyone — and it lands the mechanism on the ten
trials where the risk actually is, rather than on 20/30/40/50 where it does not.

### Everywhere else
Optional. A member may name a witness on any trial if they want to. Never required.

**Do not make witnessing mandatory outside 48–57.** A member who genuinely has nobody would be
locked out of the product, and isolation is not something to paywall.

---

## 17.4 How it evolves

| Stage | Witness is | Data held |
|---|---|---|
| **Launch** | Anyone the member names | First name + relationship |
| **Phase 2** (Reckoning) | Another **member**, by bib number | A bib number. No third-party data at all |
| **Later** | A **finisher**, who has earned the right | A finisher number |

Phase 2 is the better version: *"Bib 0142, witnessed by Bib 0061."* No personal data of any
kind, and it builds a **lineage graph** no competitor has and that grows more valuable as the
register lengthens.

The final stage is the brand's strongest mechanism — **rank confers duty, not privilege**.
Finishing earns the right to be named as a witness, which gives finishers a role at exactly the
point the product would otherwise be over for them. That is the retention problem, answered by
the thing they just earned.

---

## 17.5 What the member sees

On clearing a RED trial:

> **WHO STOOD WITNESS?**
> You named someone before you started. Put their name here.
>
> `First name` `Relationship`
>
> *Recorded on your entry. We never contact them, and we never ask for their details.*

On their record, permanently:

> `TRIAL 52 · THE LONG GROUND · cleared 14 Mar · witnessed by Sarah (sister)`

---

## 17.6 Customer-facing explanation

Plain enough for an FAQ:

> **How do you check I've actually done it?**
>
> We don't.
>
> You press CLEARED and we take your word. No photo, no GPS, no proof of any kind. Nobody
> reviews it and nobody can reject it.
>
> That isn't laziness — it's the point. Anyone could lie to us, which means your record only
> ever means something to **you**. A trial you faked is a trial you didn't do, and you'll be
> the only person who knows.
>
> On the last ten trials we ask who stood witness. You already tell someone your route and when
> you'll be back — that's a safety rule. We just ask their first name afterwards, and it goes on
> your record. We never contact them.

---

## 17.7 Build notes

**Not urgent.** Nothing here can be exercised until a member reaches trial 48, which is
months away, and no data is lost by waiting.

```
trial_witnesses
  user_id       uuid  references profiles, cascade
  trial_num     int   references trials
  witness_name  text  <= 40 chars
  relationship  text  <= 40 chars
  recorded_at   timestamptz
  unique (user_id, trial_num)
```

- Written through an RPC that requires a completion for that member and trial — same pattern as `grade_trial`, so a witness cannot be recorded for a trial that was never cleared.
- Direct INSERT revoked from `authenticated`.
- Visible to the member and to Race Control. **Not public** at launch — the public lineage view is Phase 2, and only once witnesses are bib numbers rather than named people.
- No contact fields. Ever. If a future change proposes adding an email, re-read §17.2.
