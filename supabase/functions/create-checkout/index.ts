// Creates a Stripe Checkout session for the Entry Pass (one-time) or
// Circuit Pass (subscription). Called from the app with the user's JWT.
import Stripe from 'npm:stripe@22.4.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// No apiVersion override: the SDK pins the API version it shipped with, which
// is what enables integration_identifier below.
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

// Stripe Tax stays off until a tax registration is actually active — with no
// registration it silently calculates zero and gives no error, which reads as
// "tax is handled" when nothing is being collected. Flip STRIPE_AUTOMATIC_TAX
// to "true" once Dashboard → Tax shows the registration as Collecting.
const TAX_ENABLED = Deno.env.get('STRIPE_AUTOMATIC_TAX') === 'true'

// Dashboard label for comparing checkout flows; the suffix is the fixed random
// tag for this integration and should not change between deploys.
const INTEGRATION_TAG = 'hjqvnrtd'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const stripe = getStripe()
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData.user) {
      return json({ error: 'Not authenticated' }, 401)
    }
    const user = userData.user

    const body = await req.json().catch(() => ({}))
    const product = body.product as 'entry' | 'circuit'
    if (product !== 'entry' && product !== 'circuit') {
      return json({ error: 'Unknown product' }, 400)
    }

    // Prefer the configured public URL; fall back to the calling origin (dev).
    const siteUrl = Deno.env.get('SITE_URL') || body.origin || ''
    if (!siteUrl) return json({ error: 'No site URL configured' }, 500)

    // Service-role client for reading/writing the stripe customer id.
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { data: profile } = await admin
      .from('profiles')
      .select('stripe_customer_id, entry_paid, circuit_active, deleted_at')
      .eq('id', user.id)
      .single()
    if (!profile || profile.deleted_at) return json({ error: 'No profile' }, 403)

    if (product === 'entry' && profile.entry_paid) {
      return json({ error: 'Entry already paid' }, 400)
    }
    if (product === 'circuit' && profile.circuit_active) {
      return json({ error: 'Circuit Pass already active' }, 400)
    }

    // Reuse the Stripe customer if we have one so both purchases share a record.
    let customerId = profile.stripe_customer_id as string | null
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await admin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    const price =
      product === 'entry'
        ? Deno.env.get('STRIPE_PRICE_ENTRY')!
        : Deno.env.get('STRIPE_PRICE_CIRCUIT')!

    // Built loosely so newer parameters don't fight the SDK's shipped types.
    const params: Record<string, unknown> = {
      mode: product === 'entry' ? 'payment' : 'subscription',
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price, quantity: 1 }],
      success_url: `${siteUrl}/run?checkout=success`,
      cancel_url: `${siteUrl}/run?checkout=cancelled`,
      metadata: { supabase_user_id: user.id, product },
      integration_identifier: `t57-${product}-${INTEGRATION_TAG}`,
      // payment_method_types is deliberately omitted so Stripe picks the
      // highest-converting eligible methods per customer.
    }

    if (TAX_ENABLED) {
      // We attach an existing Customer, so Checkout would reuse a saved address
      // and ignore whatever is typed at checkout. Collecting a billing address
      // and writing it back is what gives Stripe Tax a location to work from.
      params.automatic_tax = { enabled: true }
      params.customer_update = { address: 'auto' }
      params.billing_address_collection = 'required'
    }

    const session = await stripe.checkout.sessions.create(
      params as Stripe.Checkout.SessionCreateParams,
    )

    return json({ url: session.url })
  } catch (err) {
    console.error('create-checkout error', err)
    if (err instanceof Error && err.message === 'STRIPE_NOT_CONFIGURED') {
      return json({ error: 'Payments are not set up yet. Nothing has been charged.' }, 503)
    }
    return json({ error: 'Checkout failed' }, 500)
  }
})

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
