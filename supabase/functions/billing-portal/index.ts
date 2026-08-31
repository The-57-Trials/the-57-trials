// Opens a Stripe customer portal session for the signed-in member.
import Stripe from 'npm:stripe@22.4.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const stripe = getStripe()
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
    )
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData.user) return json({ error: 'Not authenticated' }, 401)

    const body = await req.json().catch(() => ({}))
    const siteUrl = Deno.env.get('SITE_URL') || body.origin || ''

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { data: profile } = await admin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userData.user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return json({ error: 'No billing record yet — pay the entry first.' }, 400)
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl}/account`,
    })

    return json({ url: session.url })
  } catch (err) {
    console.error('billing-portal error', err)
    if (err instanceof Error && err.message === 'STRIPE_NOT_CONFIGURED') {
      return json({ error: 'Payments are not set up yet. Nothing has been charged.' }, 503)
    }
    return json({ error: 'Could not open billing portal' }, 500)
  }
})

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
