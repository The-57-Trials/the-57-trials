# THE 57 TRIALS

Fifty-seven stages. One line at a time. No skipping ahead.

A paid, sequential challenge platform: members buy a £10 Entry Pass, clear 57 trials in
strict order, and a £4.99/mo Circuit Pass powers everything from Trial 06. Sequencing is
enforced in Postgres (`clear_trial` RPC + RLS), not the UI.

## Stack

- React + Vite + TypeScript, React Router, hand-rolled CSS (race-bib design system)
- Supabase: Postgres, Auth, RLS, Edge Functions (EU/UK region — UK GDPR)
- Stripe: Checkout + Billing + webhooks
- Static hosting (Render) — SPA rewrite `/*` → `/index.html` required

## Local dev

```
npm install
copy .env.example .env   # fill in VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm run dev
```

## Database

`supabase/migrations/0001_schema.sql` holds the full schema: tables, RLS, the
`clear_trial` sequence-enforcing RPC, `get_trial_body` (no reading ahead), the
leaderboard view, signup trigger with bib assignment (sequence starts at 58 —
001–057 are reserved), and the 57-trial seed.

To promote an admin:

```sql
update profiles set role = 'admin' where id = '<user uuid>';
```

## Edge functions

| Function | JWT | Purpose |
|---|---|---|
| `create-checkout` | yes | Stripe Checkout session (entry / circuit) |
| `stripe-webhook` | no (Stripe signature) | Flips `entry_paid` / `circuit_active` |
| `billing-portal` | yes | Stripe customer portal session |
| `delete-account` | yes | GDPR erasure: cancel subs, delete auth user (cascades) |

Secrets required (Supabase → Edge Functions → Secrets):
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ENTRY`,
`STRIPE_PRICE_CIRCUIT`, `SITE_URL`.

Stripe webhook endpoint: `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`
with events: `checkout.session.completed`, `customer.subscription.updated`,
`customer.subscription.deleted`, `invoice.payment_failed`.
