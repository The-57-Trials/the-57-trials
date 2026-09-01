# 21. THE ACCOUNT — the compulsory record

> Rob's decision, 1 Sep 2026. **No trial can be cleared until it has been written up.**

---

## 21.1 What it is

Every trial page carries a written record. It is **required** — CLEARED does not unlock until
it is filled in. Fifty-seven of them accumulate into the book (18.4).

This is the mechanism that turns a progress counter into a document. Without it the book is
a list of dates; with it, it is an account of five months by the person who lived them.

### The three fields, identical on all 57

| Field | Prompt | Cap |
|---|---|---|
| **WHAT WAS DONE** | The record. Facts. What you completed, and where you scaled it. | 2000 |
| **WHERE IT GOT HARD** | The specific moment. Not "it was tough" — the minute, the mile, the sentence. | 2000 |
| **WHAT YOU KNOW NOW** | One line. Something true today that was not true yesterday. | 2000 |

The prompts never change. **That is the point** — fifty-seven answers to the same three
questions, five months apart, is a document that shows a person changing. Fifty-seven
different prompts would just be a diary.

### The line that must appear on the page

> *This is not proof. Nobody reads it, nobody checks it, and nobody can reject it.
> It is the page in your book.*

The product does not verify (17.6). The account does not change that and must never be
presented as though it does.

---

## 21.2 Rules

- **Minimum 40 characters per field.** Enough to stop `.` clearing a trial, low enough that nobody is kept from finishing. There is no word count and there never will be.
- **Editable until the trial is cleared. Sealed after.** The account is a record of that day, and a record you can go back and improve is not a record.
- **Private by default**, exactly like the letters (18.3). Shared only if the member opts in per-trial when sharing a finished Library.
- **Deleted on erasure**, with everything else.
- **Trials 01, 09 and 53 are exempt** — the letter *is* the account for those three, and asking someone to write a sealed letter and then write about writing it is absurd.

---

## 21.3 Why compulsory rather than optional

An optional field is completed by the members who least need to and skipped by everyone else,
and the book then only exists for people who were already going to be fine.

There is also a quieter effect. **A trial you have to write up is a trial you have to have
actually done.** Nothing verifies it and nothing needs to — but "where did it get hard" is a
question with no good answer if you didn't go, and the member is the one who has to look at
the blank box. That is the honour system doing exactly the work it was designed to do.

---

## 21.4 Build

```
trial_accounts
  user_id     uuid  references profiles, cascade
  trial_num   int   references trials
  done        text  40..2000
  hard        text  40..2000
  learned     text  40..2000
  created_at  timestamptz
  updated_at  timestamptz
  unique (user_id, trial_num)
```

- Written only through `save_account()`, which requires `entry_paid`, requires the trial to be the member's currently-open one, and refuses to overwrite once the trial is cleared.
- Direct INSERT/UPDATE revoked from `authenticated`, same posture as `completions`.
- **`clear_trial` gains one precondition**: an account row must exist, or it raises `ACCOUNT_REQUIRED`. Trials 1, 9 and 53 are exempt.

> `clear_trial` is the most security-critical function in the system — it enforces order,
> both paywalls and the cooldowns. The account check is added **after** the order check and
> **before** the insert, so it can never widen access, only narrow it. Re-verify order,
> payment and cooldown enforcement after any change to it.
