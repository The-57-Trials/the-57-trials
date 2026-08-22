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

export interface LeaderboardRow {
  id: string
  display_name: string
  bib_number: number
  circuit_active: boolean
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

/** Trials 01–05 need Entry Pass only; 06+ additionally need an active Circuit Pass. */
export const FREE_WINDOW_END = 5

export function pad(num: number): string {
  return String(num).padStart(2, '0')
}
