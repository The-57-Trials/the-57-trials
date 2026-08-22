// Stripe webhook — the ONLY writer of entry_paid / circuit_active.
// Deployed with verify_jwt = false; authenticity comes from the Stripe
// signature, verified below. Handlers are idempotent (flag sets), so
// Stripe retries and duplicate deliveries are safe.
import Stripe from 'npm:stripe@17.7.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
})
const cryptoProvider = Stripe.createSubtleCryptoProvider()

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

Deno.serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) return new Response('Missing signature', { status: 400 })

  const body = await req.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider,
    )
  } catch (err) {
    console.error('Signature verification failed', err)
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
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

      case 'invoice.payment_failed': {
        // Only act on the FINAL failure (no further retries scheduled);
        // interim failures are handled by subscription.updated → past_due.
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.next_payment_attempt === null && invoice.customer) {
          await setCircuitByCustomer(invoice.customer as string, false)
        }
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
