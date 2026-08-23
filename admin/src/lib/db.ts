import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !anonKey) console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')

/**
 * Deliberately its own client with its own storage key. Sharing one with the
 * member app would mean a session on either could act on the other; separate
 * keys mean signing in here is a distinct act.
 */
export const db = createClient(url, anonKey, {
  auth: { storageKey: 't57-race-control' },
})

export const pad = (n: number) => String(n).padStart(2, '0')

export const gbp = (pence: number) =>
  '£' + (pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const pct = (n: number, d: number) => (d === 0 ? '—' : `${Math.round((n / d) * 100)}%`)

export function ago(ts: string | null): string {
  if (!ts) return 'never'
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
  return `${Math.floor(mins / 1440)}d ago`
}

export interface Pulse {
  as_of: string
  funnel: { signups: number; entry_paid: number; circuit_active: number; deleted: number }
  revenue: { mrr_pence: number; entry_gross_pence: number }
  progress: {
    total_completions: number; started: number; finishers: number
    avg_cleared: number; stuck_at_six: number
  }
  merch: { total: number; unshipped: number }
  recent: {
    signups_7d: number; signups_30d: number; clears_7d: number
    last_signup: string | null; last_clear: string | null
  }
  history: { captured_on: string; mrr_pence: number }[]
}

export interface AdminTrial {
  num: number
  title: string
  chapter: string
  is_milestone: boolean
  active: boolean
  min_gap_minutes: number
}

export interface MemberRow {
  id: string
  display_name: string
  bib_number: number
  role: string
  entry_paid: boolean
  circuit_active: boolean
  created_at: string
  cleared: number
}

export interface MilestoneRow {
  id: number
  user_id: string
  trial_num: number
  created_at: string
  shipped: boolean
  kind: 'merch' | 'blazer_card' | 'blazer_reward'
  profiles?: { display_name: string; bib_number: number }
}

/** What actually goes in the envelope. */
export function itemFor(r: MilestoneRow): string {
  if (r.kind === 'blazer_card') return 'TRIAL BLAZER CARD'
  if (r.kind === 'blazer_reward') return 'TRIAL BLAZER HOODIE'
  return { 15: 'THE BIB', 30: 'THE TEE', 57: 'FINISHER MARK' }[r.trial_num] ?? 'MILESTONE ITEM'
}
