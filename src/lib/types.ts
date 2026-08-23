export interface Profile {
  id: string
  display_name: string
  bib_number: number
  role: 'member' | 'admin'
  entry_paid: boolean
  circuit_active: boolean
  created_at: string
  deleted_at: string | null
}

export interface Trial {
  num: number
  title: string
  chapter: string
  is_milestone: boolean
  active: boolean
  min_gap_minutes: number
}

export interface Completion {
  trial_num: number
  cleared_at: string
}

/** No user id: the view deliberately exposes only a self-marker, never a UUID. */
export interface LeaderboardRow {
  display_name: string
  bib_number: number
  circuit_active: boolean
  is_me: boolean
  cleared: number
  last_cleared: string | null
}

export interface MilestoneEvent {
  id: number
  user_id: string
  trial_num: number
  created_at: string
  shipped: boolean
  profiles?: { display_name: string; bib_number: number }
}

export const MILESTONES = [15, 30, 45, 57]

/** Both carry the 57. Single source of truth for every price shown in the UI. */
export const PRICE_ENTRY = '£19.57'
export const PRICE_CIRCUIT = '£9.57'

/**
 * When the next trial becomes available. Cooldowns are enforced in the database;
 * this only mirrors the rule for display, and is measured from the member's most
 * recent clear rather than the previous trial's.
 */
export function readyAt(lastClearedAt: string | null, gapMinutes: number): Date | null {
  if (!lastClearedAt || gapMinutes <= 0) return null
  const d = new Date(new Date(lastClearedAt).getTime() + gapMinutes * 60_000)
  return d.getTime() > Date.now() ? d : null
}

/** "in 3h 20m" / "tomorrow at 06:40" — long waits deserve a wall-clock time. */
export function untilLabel(d: Date): string {
  const mins = Math.max(0, Math.round((d.getTime() - Date.now()) / 60_000))
  if (mins < 60) return `in ${mins} min`
  if (mins < 1440) return `in ${Math.floor(mins / 60)}h ${mins % 60}m`
  const days = Math.round(mins / 1440)
  return `${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} (${days}d)`
}

/** Trials 01–05 need Entry Pass only; 06+ additionally need an active Circuit Pass. */
export const FREE_WINDOW_END = 5

export function pad(num: number): string {
  return String(num).padStart(2, '0')
}
