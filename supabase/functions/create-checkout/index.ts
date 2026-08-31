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

    const priceId =
      product === 'entry'
        ? Deno.env.get('STRIPE_PRICE_ENTRY')
        : Deno.env.get('STRIPE_PRICE_CIRCUIT')
    if (!priceId) {
      console.error(`Missing price id for product: ${product}`)
      return json({ error: 'Payments are not set up yet. Nothing has been charged.' }, 503)
    }

    // Built loosely so newer parameters don't fight the SDK's shipped types.
    const params: Record<string, unknown> = {
      // ---- Configured in Checkout Studio. Do not change without changing it there. ----
      // 'hosted_page' is correct for stripe-node >= 21.0.0; below that it is 'hosted'.
      ui_mode: 'hosted_page',
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },
      automatic_tax: { enabled: false },
      allow_promotion_codes: false,
      submit_type: 'auto',
      integration_identifier: 'hosted_web_0001',
      origin_context: 'web',

      // ---- This integration's own parameters. ----
      mode: product === 'entry' ? 'payment' : 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/run?checkout=success`,
      cancel_url: `${siteUrl}/run?checkout=cancelled`,

      // KEEP THESE. Checkout Studio does not know about them, and a generated
      // instruction to drop unlisted parameters would break payment entirely:
      //   client_reference_id — the ONLY link from a payment back to a member.
      //     The webhook reads it to decide whose bib gets access. Without it,
      //     payments succeed and nobody is let in.
      //   customer — reuses one Stripe customer across the entry and the
      //     subscription, and is what the billing portal is opened against.
      customer: customerId,
      client_reference_id: user.id,
      metadata: { supabase_user_id: user.id, product },

      // payment_method_types is deliberately omitted so Stripe picks the
      // highest-converting eligible methods per customer.
    }

    // Only meaningful on subscriptions.
    if (product === 'circuit') {
      params.payment_method_collection = 'always'
    }

    if (TAX_ENABLED) {
      // Overrides the Checkout Studio defaults above. Stripe Tax needs a
      // resolvable address, and because we attach an existing Customer,
      // Checkout would otherwise reuse a saved one and ignore what is typed.
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
