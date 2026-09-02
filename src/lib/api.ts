import { supabase } from './supabase'
import type {
  Completion, LeaderboardRow, Letter, ReckoningDecision, ReckoningRoute, Trial, TrialAccount,
  TrialWitness, Typeface, TrialGrade,
} from './types'

export async function fetchTrials(): Promise<Trial[]> {
  const { data, error } = await supabase
    .from('trials')
    .select('num, title, chapter, is_milestone, active, min_gap_minutes, trial_type, published_demand, published_friction')
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
  finisher_number: number | null
}

export async function clearTrial(num: number): Promise<ClearResult> {
  const { data, error } = await supabase.rpc('clear_trial', { p_trial_num: num })
  if (error) throw error
  return data as ClearResult
}

// Metrics live in Race Control, the separate admin application. Nothing that
// reads admin_pulse() belongs in a bundle a member downloads.

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

/** Consensus grading. Writes go through the RPC so only cleared trials can be graded. */
export async function gradeTrial(
  trialNum: number, demand: number, friction: number, note: string,
): Promise<void> {
  const { error } = await supabase.rpc('grade_trial', {
    p_trial_num: trialNum, p_demand: demand, p_friction: friction, p_note: note,
  })
  if (error) throw error
}

export async function fetchMyGrade(trialNum: number): Promise<TrialGrade | null> {
  const { data, error } = await supabase
    .from('trial_grades')
    .select('trial_num, demand, friction, note')
    .eq('trial_num', trialNum)
    .maybeSingle()
  if (error) throw error
  return (data as TrialGrade) ?? null
}

/** Trials 01 and 09 only. Immutable once sealed — there is no edit or unseal. */
export async function sealLetter(trialNum: number, typeface: Typeface, body: string): Promise<void> {
  const { error } = await supabase.rpc('seal_letter', {
    p_trial_num: trialNum, p_typeface: typeface, p_body: body,
  })
  if (error) throw error
}

/** Throws SEALED until Trial 53 is reached — that is the mechanic, not a bug. */
export async function fetchMyLetter(trialNum: number): Promise<Letter> {
  const { data, error } = await supabase.rpc('get_my_letter', { p_trial_num: trialNum })
  if (error) throw error
  return data as Letter
}

export interface ReckoningResult {
  decision: ReckoningDecision
}

export async function submitReckoning(input: {
  route: ReckoningRoute
  witnessName: string
  witnessRelationship: string
  answer: string
  decision: ReckoningDecision
}): Promise<ReckoningResult> {
  const { data, error } = await supabase.rpc('submit_reckoning', {
    p_route: input.route,
    p_witness_name: input.witnessName,
    p_witness_relationship: input.witnessRelationship,
    p_answer: input.answer,
    p_decision: input.decision,
  })
  if (error) throw error
  return data as ReckoningResult
}

/** THE ACCOUNT (doc 21) — compulsory on every trial except 1, 9, 53. Readable
 * directly: unlike the letters, there's no "sealed until later" drama here,
 * only "editable until cleared." */
export async function fetchMyAccount(trialNum: number): Promise<TrialAccount | null> {
  const { data, error } = await supabase
    .from('trial_accounts')
    .select('done, hard, learned, updated_at')
    .eq('trial_num', trialNum)
    .maybeSingle()
  if (error) throw error
  return (data as TrialAccount) ?? null
}

export async function saveAccount(
  trialNum: number, done: string, hard: string, learned: string,
): Promise<void> {
  const { error } = await supabase.rpc('save_account', {
    p_trial_num: trialNum, p_done: done, p_hard: hard, p_learned: learned,
  })
  if (error) throw error
}

/** Trials 48-52, 54-57 only. Shown after a RED trial clears (doc 17.5). */
export async function fetchMyWitness(trialNum: number): Promise<TrialWitness | null> {
  const { data, error } = await supabase
    .from('trial_witnesses')
    .select('witness_name, relationship, recorded_at')
    .eq('trial_num', trialNum)
    .maybeSingle()
  if (error) throw error
  return (data as TrialWitness) ?? null
}

export async function recordWitness(
  trialNum: number, witnessName: string, relationship: string,
): Promise<void> {
  const { error } = await supabase.rpc('record_witness', {
    p_trial_num: trialNum, p_witness_name: witnessName, p_relationship: relationship,
  })
  if (error) throw error
}
