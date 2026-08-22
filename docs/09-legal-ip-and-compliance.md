# 9. Legal, Compliance & IP

> **Not legal advice.** Research with sources so every claim can be checked. Everything here
> needs a qualified solicitor before you take a payment. Written 22 Aug 2026.

Consumer law, GDPR and Stripe activation were researched separately on 21–22 Aug and the
resulting policy drafts are **already live** at `/terms`, `/privacy`, `/refunds`,
`/disclaimer` and `/contact`, each carrying a visible draft banner. This section records the
key findings and adds the IP work.

---

## 9.1 Consumer law — the expensive finding

**Without a properly-worded cancellation waiver, every customer keeps a full refund right for
up to twelve months.**

Under the Consumer Contracts Regulations 2013 a distance contract for digital content carries
a 14-day right to cancel. You only escape it if, *before supply begins*, the consumer
**expressly consents to immediate supply AND acknowledges losing the right** (reg 37(1)) —
both, separately — and you confirm both back on a durable medium (reg 16).

Miss it and reg 37(4) means the consumer **bears no cost at all** for what was supplied. Miss
telling them about the right entirely and reg 31 extends the window by **up to twelve months**.

**Status: fixed.** Three separate, unticked confirmations now sit before payment, and an
append-only `consents` table records which version of each policy was agreed and when.

**Still outstanding:** the confirmation email back to the member (reg 16) is not built —
it needs the transactional email provider first.

### Other consumer-law points that matter
- **The order button wording is fine.** Reg 14(4) requires "pay" or equivalent; `PAY THE ENTRY — £10` qualifies. Don't let the brand voice change it to `ENLIST` on the *payment* button.
- **The Circuit Pass classification is genuinely ambiguous** — digital content (reg 37, waiver kills the right) or service (reg 36, right survives, proportionate refund owed). The drafts take the safer path: **offer a pro-rata refund on the first month if cancelled within 14 days.** Flag this one to the solicitor specifically.
- **Milestone merch bundled inside a subscription** has no clean authority. The drafts frame it as *rewards included within the pass, not separately purchased.* Second point for the solicitor.
- **Price display.** DMCCA 2024 total-price rules are in force. With no minimum term, `£4.99 / month` is a valid total price. But you must **state the VAT position** — add near the prices: *"Prices are the total you pay. [TRADING NAME] is not VAT registered, so no VAT is charged. UK delivery of milestone items is included."*
- **Subscription regime (DMCCA Part 4 Ch.2) is NOT yet in force** — now expected spring 2027. It will bring renewal reminders, a second cooling-off window per renewal, and mandatory online exit. Your Stripe customer portal already satisfies the hardest part.

---

## 9.2 Stripe activation

Stripe requires, on the website, reachable **logged out**: business name, service description,
**customer service contact details**, **return policy** (triggered by the merch), **refund and
dispute policy**, and **cancellation policy** (triggered by the subscription). All five pages
are now live and footer-linked.

**Describe the business as:** *"online paid membership: a written physical-challenge programme
with included milestone merchandise."* **Do not say "fitness coaching" or "personal
training"** — different risk category, more scrutiny.

**Stay out of restricted categories.** Keep claims about *difficulty*, never *outcomes* —
"transform your body in 57 days" is simultaneously a Stripe problem, an ASA problem and a
DMCCA misleading-practice problem. And do not add a free trial that auto-converts; that moves
you into negative-option marketing.

**Card network rules still to implement:** an enrolment receipt stating future payment timing,
a receipt after every charge **with cancellation instructions on it**, and a cancellation
confirmation within 7 days. Set the billing descriptor to something recognisable —
`57TRIALS`.

---

## 9.3 Physical-activity liability — the hard limit

> **You cannot exclude liability for death or personal injury caused by your negligence.**
> UCTA 1977 s.2(1) and CRA 2015 s.65. Absolute, no reasonableness test. Any term attempting it
> is void, and is itself an unfair term.

Anyone selling a "bulletproof waiver" is selling something that does not exist in this
jurisdiction.

**What a disclaimer legitimately does:** discharges the duty to warn (a specific warning is
*evidence you took reasonable care*), establishes informed acceptance of inherent risk,
supports contributory negligence, and — most usefully — **defines the scope of what you
undertook.** You supply written briefings; you are not a coach, supervisor or medical
professional. Framing scope narrowly *and behaving consistently with it* is more protective
than any exclusion clause. Note the corollary: **the moment you start giving individual advice
or adjusting a challenge for someone's stated injury, you widen the duty and the framing
collapses.**

**Screening design.** The PAR-Q questions are displayed in full but **only the confirmation is
stored** — never the answers. Health answers are special-category data under Art 9; storing a
tick-box health profile for every member is a serious liability for a sole trader. This design
gets the evidential benefit without operating a health database. Consent is taken as explicit
Art 9 consent, separately, before payment.

**Mitigations that matter more than words, in order:**
1. **Insurance.** Worth more than every word of the policies combined. Disclose exactly what you do — unsupervised physical challenges delivered as written briefings to unscreened remote consumers. **Non-disclosure voids cover.**
2. **Defensive content design** — already specified in §4: no breath-holding, submersion, open water, heights, cold exposure, fasting, dehydration or to-failure work; scaling on every trial; escalating warnings; check-in protocol from trial 48.
3. **Never reward speed.** The current leaderboard does. See §4.0.
4. **Discipline the copy.** "Push through it", "no excuses", "pain is temporary" would be quoted back at you in a claim.
5. **Age gate at 18+**, enforced and stated.

---

## 9.4 UK GDPR

You are the controller; Supabase and Stripe are processors. Data is in **London
(eu-west-2)** — say "hosted in London", not "all your data stays in the UK", unless you have
verified sub-processors end to end.

**ICO registration is required** — Tier 1, **£52/year or £47 by direct debit**. Ten minutes.
Do it before publishing the privacy policy so you can quote the number.

**Retention that matters:** transaction records **6 years** (HMRC, overrides erasure
requests); health screening confirmation **6 years** — and note this deliberately survives
account deletion, which is why `consents.user_id` has no foreign key. Deleting that record on
account closure would destroy your own best evidence in exactly the scenario you'd need it.

**Data minimisation wins already implemented:** no postal addresses at signup (collected at
the milestone); no PAR-Q answers stored; fonts self-hosted, which removed a third-party
transfer of every visitor's IP to Google before consent.

**Cookies:** only strictly necessary ones (auth, Stripe fraud prevention), so **no consent
banner is required.** That's a good position — protect it. **Adding any analytics with
cookies makes a banner mandatory.** Use cookieless, self-hosted analytics if you add any.

**DPIA:** arguably not strictly mandatory at this scale, but do the short screening assessment
and keep it on file. "We considered it, here's the reasoning" is a completely different
conversation from "we never thought about it."

---

## 9.5 Intellectual property

### The good news: the name is clear

**"THE 57 TRIALS" — zero results on every register worldwide.** No GB, EU, WO or foreign mark;
no company at Companies House; no web presence. That is unusually clean, and it is an asset
that only degrades once you become visible.

**Marks that will likely be flagged and notified at examination** (none fatal, but know them):

| Mark | Classes | Owner |
|---|---|---|
| **TRIALS** | 9, 41 | RedLynx Oy (Ubisoft) |
| **Trials Fit** | 9, 25, 41, 42 | Registered Jun 2026 — *same sector, watch this one* |
| **57** | 41 | Goffredo Puccetti |
| **57** | 25 | David Appiah |
| PHYSIQUE 57 | 9, 25, 38, 41 | Physique 57 IP LLC |

**Important mechanic:** since 2007 UKIPO examines on **absolute grounds only**. It will not
refuse you for an earlier similar mark — it notifies those owners and leaves them to oppose.
**A clean examination report is not a clean bill of health.** The risk arrives at publication.

### Recommendation: file THE 57 TRIALS, Classes 41 + 25, via Right Start — £310

Fees rose on 1 April 2026 (first rise in 28 years); anything quoting £170 is stale.
Standard: £205 first class + £60 each additional = **£265** for two classes. Right Start
splits it £155 + £155 = **£310**.

**Take Right Start.** There is a real risk of a **s.3(1)(b)/(c) objection** — that "57 trials"
merely describes a service consisting of 57 trials. My read is you'd probably clear it, but
call it 70/30. The £45 premium buys the option to walk away after seeing the examination
report. Timeline ~4 months. **A sole trader can self-file** — the form is built for it.

**Do not register "The Primes".** Technically available as an exact string, but: "PRIMES"
alone is already registered in GB; the PRIME field is extraordinarily crowded (787 exact GB
marks); **Amazon holds PRIME in Class 41**, your primary class, and opposes aggressively; and
`theprimes.com` is a live leadership-training brand. It's an ordinary English plural — weak
even if granted. **Use it as internal lore and never make it load-bearing**, so that if
anyone ever writes to you, dropping it costs nothing.

Also not worth registering: **57** (taken in both your classes), **5757** (a bare numeral is
inherently weak), and the **tagline** (high distinctiveness bar, and you may change it).

**Later, at traction:** Class 9 if you ship a native app; a figurative/logo mark; a UK
registered design on the bib (£60, but wait until the design is final); EU and US filings —
note the **6-month Paris Convention priority window** from your UK filing date, which is
another reason to file UK first.

### What you have without registering
**Passing off** requires proving goodwill, which pre-revenue you do not have, and runs to
tens of thousands in the High Court. It is a right you hold on paper and cannot afford to use.
**Unregistered design right expressly excludes surface decoration** — so it gives your bib
graphics nothing. The post-Brexit Supplementary Unregistered Design *does* cover surface
decoration, but only 3 years and **only if first disclosed in the UK** — so post the bib
design from the UK first, which is free to get right.

**Copyright is the exception and your strongest unregistered right** — automatic, free, and
enforceable cheaply via takedowns.

### Copyright practicalities
No UK register exists; it arises automatically on fixation, life + 70 years. **Ignore
"copyright registration" services and blockchain timestamping vendors** — they sell a receipt
you can generate for free.

**Write the briefings in git.** Commit history is a cryptographically chained timestamped
record of every draft, and better evidence than anything you can buy. Keep the drafts, not
just the finals.

**Highest-value anti-piracy measure: per-member watermarking.** Stamp each briefing with the
member's name and bib number at render time. Cheap, invisible until it matters, identifies the
leaker from a screenshot — and it fits the brand perfectly, since the bib number is already
the membership identity. Say publicly, once, that you watermark; the deterrent is worth more
than the enforcement.

**When a member shares — and they will:** notice-and-takedown to the host is free, fast and
handles ~95% of incidents. Terminate the account. **Do not sue an individual member** —
copyright litigation runs to five figures and you cannot spend that defending a £4.99
subscription.

**The strategic answer:** design so leaked text is low-value. Someone with a PDF of all 57
briefings has not got the sequence, the progress state, the community, the posted merch, or
the bib number. Build it that way and copying stops mattering.

### Company structure — the IP angle
As a sole trader you own the marks and copyright personally, which is fine now. File in your
own name; assign to a company later via **form TM16 (£60)**.

**One trap solo founders reliably hit:** IP does *not* migrate to a company just because you
formed one. **Copyright assignment must be in writing and signed — s.90(3) CDPA 1988.** A
company trading on IP still personally owned by its director is a defect that surfaces at the
worst possible moment.

The bigger driver is liability: unlimited personal exposure on a physical-activity product.
Worth an accountant's view — but note a company is **not** a substitute for insurance and
proper waivers, and won't shield you from personal negligence.

---

## 9.6 The 57 question — settled

**57 = 3 × 19. It is not prime.**

The **"Grothendieck prime"** story is verified as folklore with a genuinely good source: Allyn
Jackson, *"As If Summoned from the Void: The Life of Alexandre Grothendieck," Part II*,
**Notices of the AMS, Vol. 51 No. 10 (Nov 2004), pp. 1196–97**. Asked for a prime number,
Grothendieck reportedly said *"All right, take 57."* Fields Medallist David Mumford, asked
whether Grothendieck surely knew better, said **absolutely not — "He doesn't think
concretely."**

Read the provenance honestly: **Jackson herself calls it "the legend of the so-called
Grothendieck prime."** The other party is unnamed; there is no date, venue or contemporaneous
record. Real, famous, respectably sourced — and explicitly a legend.

### The verdict
**It is a liability if you imply 57 is prime. It is your best piece of lore if you frame it
correctly — and the true framing is the better story anyway.**

The audience most drawn to a numbered, prime-themed endurance brand is *precisely* the
audience that already knows 57 isn't prime. Claiming otherwise walks into the one trap
they're guaranteed to spot, and the first screenshot would define the brand.

**Concretely:**
- **5 and 7 are prime** — build "The Primes" on those two. True, and costs nothing.
- **57 is the imposter, deliberately** — the number that passes for prime until you actually test it. Which is a remarkably good fit for 57 sequential trials.
- **Hedge the anecdote in your own copy** — "the story goes", "reportedly". Never invent a date or venue; that turns charming folklore into a fabrication someone can catch. Footnote the AMS article if you want the flourish.
- **Never write "57, a prime number."** That is the only hard rule.

---

## 9.7 Where a professional is genuinely needed

**Safe to self-file:** the Right Start application for THE 57 TRIALS in Classes 41 + 25 using
UKIPO's pre-approved terms.

**Get an attorney if:** you receive a s.3(1) descriptiveness objection (this is where
self-filers lose applications they could have saved); you are opposed at publication; you want
EU or US filings; or you are assigning IP into a company.

**Best single spend: a one-off clearance-and-filing-strategy opinion from a trade mark
attorney, ~£150–£400, before filing.** Given the descriptiveness risk, an hour of professional
judgement on the specification wording is the highest-value money in this section.

**Separately and non-negotiably: a solicitor must review the five live policy pages before you
take a payment**, with the two flagged ambiguities called out — the Circuit Pass
classification, and bundled merch as goods.

---

**Key sources:** [CCR 2013 reg 37](https://www.legislation.gov.uk/uksi/2013/3134/regulation/37) · [reg 31](https://www.legislation.gov.uk/uksi/2013/3134/regulation/31) · [UCTA 1977](https://www.legislation.gov.uk/ukpga/1977/50/part/I/enacted) · [Stripe activation FAQ](https://support.stripe.com/questions/business-website-for-account-activation-faq) · [Stripe restricted businesses](https://stripe.com/gb/legal/restricted-businesses) · [ICO data protection fee](https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/) · [UKIPO fees April 2026](https://assets.publishing.service.gov.uk/media/690a33c57a88fd270a95fda9/Trade_marks_list_of_current_and_new_fees.csv) · [gov.uk register a trade mark](https://www.gov.uk/how-to-register-a-trade-mark) · [CMS on absolute-grounds examination](https://cms.law/en/gbr/legal-updates/relative-grounds-important-changes-at-the-uk-ipo-from-1st-october) · [TMview register](https://www.tmdn.org/tmview/) · [Jackson, Notices AMS 51(10) 2004](https://www.ams.org/notices/200410/fea-grothendieck-part2.pdf)
