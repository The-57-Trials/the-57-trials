// Stripe webhook — the ONLY writer of entry_paid / circuit_active.
// Deployed with verify_jwt = false; authenticity comes from the Stripe
// signature, verified below. Handlers are idempotent (flag sets), so
// Stripe retries and duplicate deliveries are safe.
import Stripe from 'npm:stripe@22.4.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

/**
 * Constructed lazily, never at module scope. The Stripe SDK throws on an empty
 * key from v22 onward, so building it at import time takes the whole function
 * down at boot — including the CORS preflight, which surfaces to the browser as
 * an unreachable-function network error rather than anything diagnosable.
 */
function getStripe(): Stripe {
  const key = Deno.env.get('STRIPE_SECRET_KEY')
  if (!key) throw new Error('STRIPE_NOT_CONFIGURED')
  return new Stripe(key, { httpClient: Stripe.createFetchHttpClient() })
}
const cryptoProvider = Stripe.createSubtleCryptoProvider()

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

Deno.serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) return new Response('Missing signature', { status: 400 })

  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  if (!secret) {
    // 503 so Stripe retries once configured, rather than dropping the event.
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return new Response('Not configured', { status: 503 })
  }

  let stripe: Stripe
  try {
    stripe = getStripe()
  } catch {
    console.error('STRIPE_SECRET_KEY is not set')
    return new Response('Not configured', { status: 503 })
  }

  const body = await req.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      secret,
      undefined,
      cryptoProvider,
    )
  } catch (err) {
    console.error('Signature verification failed', err)
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      // Delayed-notification methods (bank debits and similar) complete the
      // session while still unpaid and settle later, so both events run through
      // the same guard: access is granted on payment_status, never on the event
      // name alone.
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.payment_status === 'unpaid') {
          console.log(`Session ${session.id} still unpaid — awaiting settlement`)
          break
        }

        const userId = session.client_reference_id
        const customerId = typeof session.customer === 'string' ? session.customer : null
        if (!userId) break

        if (session.mode === 'payment') {
          await admin
            .from('profiles')
            .update({ entry_paid: true, ...(customerId ? { stripe_customer_id: customerId } : {}) })
            .eq('id', userId)
        } else if (session.mode === 'subscription') {
          await admin
            .from('profiles')
            .update({ circuit_active: true, ...(customerId ? { stripe_customer_id: customerId } : {}) })
            .eq('id', userId)
        }
        break
      }

      case 'checkout.session.async_payment_failed': {
        // Nothing to revoke: the guard above means access was never granted.
        const session = event.data.object as Stripe.Checkout.Session
        console.log(`Async payment failed for session ${session.id}`)
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const active = sub.status === 'active' || sub.status === 'trialing'
        await setCircuitByCustomer(sub.customer as string, active)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await setCircuitByCustomer(sub.customer as string, false)
        break
      }

      case 'invoice.paid': {
        // Confirms each renewal. Read defensively: the subscription reference
        // moved location across API versions.
        const invoice = event.data.object as Stripe.Invoice
        const raw = invoice as unknown as Record<string, any>
        const isSubscription = Boolean(
          raw.subscription ?? raw.parent?.subscription_details?.subscription,
        )
        if (isSubscription && invoice.customer) {
          await setCircuitByCustomer(invoice.customer as string, true)
        }
        break
      }

      case 'invoice.payment_failed': {
        // Only act on the FINAL failure (no further retries scheduled);
        // interim failures are handled by subscription.updated → past_due.
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.next_payment_attempt === null && invoice.customer) {
          await setCircuitByCustomer(invoice.customer as string, false)
        }
        break
      }

      // Money taken back must take access back with it. Without these, a member
      // could pay, clear trials, charge back, and keep access permanently.
      case 'charge.refunded':
      case 'charge.dispute.created': {
        const object = event.data.object as Stripe.Charge | Stripe.Dispute
        const charge =
          event.type === 'charge.dispute.created'
            ? await stripe.charges.retrieve((object as Stripe.Dispute).charge as string)
            : (object as Stripe.Charge)

        if (!charge.customer) break

        // A charge carrying an invoice came from the subscription; one without
        // is the one-off Entry Pass.
        const isSubscriptionCharge = Boolean((charge as unknown as Record<string, unknown>).invoice)
        const customerId = charge.customer as string

        if (isSubscriptionCharge) {
          await setCircuitByCustomer(customerId, false)
        } else {
          const { error } = await admin
            .from('profiles')
            .update({ entry_paid: false, circuit_active: false })
            .eq('stripe_customer_id', customerId)
          if (error) throw error
        }
        console.log(`Access revoked for ${customerId} after ${event.type}`)
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error(`Handler failed for ${event.type}`, err)
    return new Response('Handler error', { status: 500 }) // let Stripe retry
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})

async function setCircuitByCustomer(customerId: string, active: boolean): Promise<void> {
  const { error } = await admin
    .from('profiles')
    .update({ circuit_active: active })
    .eq('stripe_customer_id', customerId)
  if (error) throw error
}
