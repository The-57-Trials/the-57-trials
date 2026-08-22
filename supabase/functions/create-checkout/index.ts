// Creates a Stripe Checkout session for the Entry Pass (one-time) or
// Circuit Pass (subscription). Called from the app with the user's JWT.
import Stripe from 'npm:stripe@17.7.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
})

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
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

    const session = await stripe.checkout.sessions.create({
      mode: product === 'entry' ? 'payment' : 'subscription',
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price, quantity: 1 }],
      success_url: `${siteUrl}/run?checkout=success`,
      cancel_url: `${siteUrl}/run?checkout=cancelled`,
      metadata: { supabase_user_id: user.id, product },
    })

    return json({ url: session.url })
  } catch (err) {
    console.error('create-checkout error', err)
    return json({ error: 'Checkout failed' }, 500)
  }
})

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
