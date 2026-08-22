import { supabase } from './supabase'
import type { Completion, LeaderboardRow, Trial } from './types'

export async function fetchTrials(): Promise<Trial[]> {
  const { data, error } = await supabase
    .from('trials')
    .select('num, title, chapter, is_milestone, active, min_gap_minutes')
    .eq('active', true)
    .order('num')
  if (error) throw error
  return data as Trial[]
}

export async function fetchMyCompletions(userId: string): Promise<Completion[]> {
  const { data, error } = await supabase
    .from('completions')
    .select('trial_num, cleared_at')
    .eq('user_id', userId)
    .order('trial_num')
  if (error) throw error
  return data as Completion[]
}

/** Body content is gated server-side: locked trials raise LOCKED. */
export async function fetchTrialBody(num: number): Promise<string> {
  const { data, error } = await supabase.rpc('get_trial_body', { p_trial_num: num })
  if (error) throw error
  return (data as string) ?? ''
}

export interface ClearResult {
  cleared: number
  next: number | null
  milestone: boolean
}

export async function clearTrial(num: number): Promise<ClearResult> {
  const { data, error } = await supabase.rpc('clear_trial', { p_trial_num: num })
  if (error) throw error
  return data as ClearResult
}

export async function fetchLeaderboard(): Promise<LeaderboardRow[]> {
  const { data, error } = await supabase.from('leaderboard').select('*')
  if (error) throw error
  const rows = data as LeaderboardRow[]
  // Most cleared first; tiebreak: whoever reached that count first ranks higher.
  // Bib number settles the rest, so the order is total and the board doesn't
  // reshuffle between loads when several members have cleared nothing yet.
  rows.sort((a, b) => {
    if (b.cleared !== a.cleared) return b.cleared - a.cleared
    if (!a.last_cleared && !b.last_cleared) return a.bib_number - b.bib_number
    if (!a.last_cleared) return 1
    if (!b.last_cleared) return -1
    const diff = new Date(a.last_cleared).getTime() - new Date(b.last_cleared).getTime()
    return diff !== 0 ? diff : a.bib_number - b.bib_number
  })
  return rows
}

/** product: 'entry' | 'circuit' — returns a Stripe Checkout URL to redirect to. */
export async function createCheckout(product: 'entry' | 'circuit'): Promise<string> {
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { product, origin: window.location.origin },
  })
  if (error) throw error
  if (!data?.url) throw new Error('No checkout URL returned')
  return data.url as string
}

export async function openBillingPortal(): Promise<string> {
  const { data, error } = await supabase.functions.invoke('billing-portal', {
    body: { origin: window.location.origin },
  })
  if (error) throw error
  if (!data?.url) throw new Error('No portal URL returned')
  return data.url as string
}

export async function deleteMyAccount(): Promise<void> {
  const { error } = await supabase.functions.invoke('delete-account', { body: {} })
  if (error) throw error
}
