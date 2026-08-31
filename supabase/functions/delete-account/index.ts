// UK GDPR right-to-erasure. Marks the profile soft-deleted, cancels any live
// subscription, then deletes the auth user — which cascades and removes the
// profile, completions, and milestone rows (full erasure). Bib numbers come
// from a sequence and are never reissued.
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
    )
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData.user) return json({ error: 'Not authenticated' }, 401)
    const userId = userData.user.id

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Cancel any live subscription so the member isn't billed after erasure.
    const { data: profile } = await admin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()
    if (profile?.stripe_customer_id) {
      try {
        const stripe = getStripe()
        // 'active' alone leaves trialing/past_due/unpaid/paused subscriptions
        // billing a member whose account no longer exists — and once the
        // profile is gone there is no row left for a webhook to correct.
        const dead = new Set(['canceled', 'incomplete_expired'])
        for await (const sub of stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: 'all',
          limit: 100,
        })) {
          if (dead.has(sub.status)) continue
          await stripe.subscriptions.cancel(sub.id)
        }
      } catch (err) {
        console.error('Subscription cancel failed (continuing with deletion)', err)
      }
    }

    await admin.from('profiles').update({ deleted_at: new Date().toISOString() }).eq('id', userId)

    const { error: delErr } = await admin.auth.admin.deleteUser(userId)
    if (delErr) throw delErr

    return json({ deleted: true })
  } catch (err) {
    console.error('delete-account error', err)
    return json({ error: 'Deletion failed' }, 500)
  }
})

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
