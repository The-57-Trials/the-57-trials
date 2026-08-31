# Stripe Integration — remaining steps

Generated 31 Aug 2026 after applying the Checkout Studio configuration.
**Scenario A** — an existing Checkout Session call was found and updated in place. No new
routes, files or infrastructure were added.

---

## Values to replace

**Files containing placeholders:**
- [supabase/functions/create-checkout/index.ts](supabase/functions/create-checkout/index.ts)

Nothing is hard-coded as a placeholder in the source. The two price IDs are read from
environment secrets, which are **not yet set**:

| Field | Current value | What to set |
|---|---|---|
| `line_items[].price` (entry) | `Deno.env.get('STRIPE_PRICE_ENTRY')` — unset | The `price_…` ID of **Entry Pass, £19.57 GBP, one-off** |
| `line_items[].price` (circuit) | `Deno.env.get('STRIPE_PRICE_CIRCUIT')` — unset | The `price_…` ID of **Circuit Pass, £9.57 GBP, recurring monthly** |
| `mode` | Derived — `payment` for entry, `subscription` for circuit | Already correct. No change needed. |
| `success_url` | `${SITE_URL}/run?checkout=success` | Already a real URL. No change needed. |
| `cancel_url` | `${SITE_URL}/run?checkout=cancelled` | Already a real URL. No change needed. |

> Copy the **price** ID (`price_…`), never the **product** ID (`prod_…`). They sit next to each
> other in the Dashboard and the wrong one fails at checkout with an unhelpful error.

---

## Configured parameters

Applied exactly as set in Checkout Studio.

**File:** [supabase/functions/create-checkout/index.ts](supabase/functions/create-checkout/index.ts)

| Parameter | Value |
|---|---|
| `ui_mode` | `hosted_page` |
| `billing_address_collection` | `auto` |
| `phone_number_collection` | `{ enabled: false }` |
| `automatic_tax` | `{ enabled: false }` |
| `allow_promotion_codes` | `false` |
| `payment_method_collection` | `always` *(subscription mode only)* |
| `submit_type` | `auto` |
| `integration_identifier` | `hosted_web_0001` |
| `origin_context` | `web` |

---

## Parameters deliberately kept

The generated instructions said to remove any parameter not listed in the Studio
configuration. **Three were kept, because removing them would break payment.** Checkout Studio
has no way to know about them — they are how this app links a Stripe payment to a member.

| Parameter | Why it must stay |
|---|---|
| `client_reference_id` | **The only link from a payment back to a member.** The webhook reads it to decide whose bib gets access. Remove it and payments succeed while nobody is let in. |
| `customer` | Reuses one Stripe customer across the entry payment and the subscription, and is what the billing portal is opened against. Without it, members would get duplicate customer records and "Manage billing" would fail. |
| `metadata` | Carries the member id and product for tracing a payment in the Dashboard. |

Two further deliberate choices, unchanged:

- **`payment_method_types` is omitted** so Stripe selects the highest-converting eligible methods per customer. Hard-coding it is a known conversion mistake.
- **No `apiVersion`** is passed when constructing the client, so the SDK's pinned version is used.

### One trade-off worth knowing

`integration_identifier` was `t57-entry-…` / `t57-circuit-…`, which separated the two products
in the Dashboard's checkout comparison. Checkout Studio's `hosted_web_0001` applies to both, so
**entry and subscription checkouts are no longer distinguishable there.** Harmless — it is a
reporting label only — but if you want them separated again, change that one line back.

---

## Also applies when tax is switched on

`automatic_tax` is set to `false` per the Studio configuration, which is correct while you are
not VAT registered. The code keeps an override: if the `STRIPE_AUTOMATIC_TAX` secret is set to
`true`, it enables `automatic_tax`, sets `customer_update: { address: 'auto' }` and forces
`billing_address_collection: 'required'`.

That last part matters — because an existing Customer is attached, Checkout would otherwise
reuse a saved address and ignore whatever is typed, and Stripe Tax would have no location to
work from.

**Do not switch it on without an active tax registration.** With none, Stripe silently
calculates zero tax and reports no error, and past transactions cannot be corrected.

---

## Setup

### 1. Create the products (test mode)

| Product | Price | Billing |
|---|---|---|
| Entry Pass | 19.57 GBP | One-off |
| Circuit Pass | 9.57 GBP | Recurring, monthly |

### 2. Set the secrets

Supabase → Project Settings → Edge Functions → Secrets. **Never commit these.**

```
STRIPE_SECRET_KEY       rk_test_…   (a restricted key is preferred over sk_)
STRIPE_WEBHOOK_SECRET   whsec_…
STRIPE_PRICE_ENTRY      price_…     (the £19.57 one-off)
STRIPE_PRICE_CIRCUIT    price_…     (the £9.57 monthly)
SITE_URL                https://the57trials.com
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.
No redeploy is needed — functions pick secrets up on their own.

**Restricted key permissions:** write on Customers, Checkout Sessions, Subscriptions and
Customer portal; read on Prices and Products.

### 3. Webhook

`https://somnbyqcvqsgrdvyvdby.supabase.co/functions/v1/stripe-webhook` — seven events:

```
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
customer.subscription.updated
customer.subscription.deleted
invoice.paid
invoice.payment_failed
```

The two `async` events matter: some payment methods complete the checkout page before the
money actually moves. Without them you would grant access on payments that later fail, and
never grant it on ones that succeed.

### 4. Activate the customer portal

Settings → Billing → Customer portal. Until a configuration exists, Stripe rejects the request
and "Manage billing" fails.

---

## Project structure

No new files were created. The integration lives in four Supabase Edge Functions:

```
supabase/functions/
  create-checkout/index.ts    Creates the Checkout Session   (JWT required)
  stripe-webhook/index.ts     Grants and revokes access      (Stripe signature, no JWT)
  billing-portal/index.ts     Opens the customer portal      (JWT required)
  delete-account/index.ts     GDPR erasure, cancels subs     (JWT required)
```

## How it works

1. A signed-in member clicks **Pay the entry**; the app calls `create-checkout` with their JWT.
2. The function verifies the member, reuses or creates their Stripe customer, and creates a Checkout Session carrying `client_reference_id`.
3. The member is redirected to Stripe's hosted page and returns to `/run?checkout=success`.
4. **Access is granted by the webhook, never by the return page** — a member can pay and close the tab before it loads. The webhook gates on `payment_status`, so delayed-settlement methods are handled correctly.
5. The dashboard polls briefly while the webhook lands, and says so plainly if it does not.

## Testing

Test card `4242 4242 4242 4242`, any future expiry, any CVC, any postcode.
Requires authentication: `4000 0025 0000 3155`. Declines: `4000 0000 0000 9995`.

Full end-to-end script is in the go-live checklist. In short: sign up → pay £19.57 → clear
trials 01–05 → confirm 06 is blocked → subscribe £9.57 → confirm milestone 15 reaches the merch
queue → check the billing portal opens → export data and delete the account.

### Watch this on the first real test

`ui_mode: 'hosted_page'` is version-dependent — correct for stripe-node **≥ 21.0.0**, and this
project is on **22.4.0**. If your first checkout returns an invalid-parameter error naming
`ui_mode`, change it to `'hosted'`. It is the one line in this change with any version risk.

---

## Next steps

- Fill the `[PLACEHOLDER]` fields in the live policy pages before applying for live mode.
- Business verification, then swap test keys for live ones. **Nothing carries over from test mode** — products, prices, keys and webhook must all be created again.
- Consider an annual Circuit Pass price (~£99). Annual plans retain at 44.1% at twelve months against 17.0% for monthly.
- Add a nightly reconciliation job walking Stripe subscriptions and repairing the entitlement table, so a dropped webhook cannot silently lock out a paying member.
- Set the billing descriptor to something recognisable (`57TRIALS`) — unrecognised descriptors are a top cause of disputes.

## Resources

- https://docs.stripe.com — https://support.stripe.com — https://docs.stripe.com/mcp
- Test cards: https://docs.stripe.com/testing
- Restricted API keys: https://docs.stripe.com/keys/restricted-api-keys
