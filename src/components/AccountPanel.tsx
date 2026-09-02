import { useEffect, useState } from 'react'
import { fetchMyAccount, saveAccount, clearTrial, type ClearResult } from '../lib/api'
import { ACCOUNT_MIN_CHARS } from '../lib/types'

interface AccountPanelProps {
  trialNum: number
  onCleared: (result: ClearResult) => void
}

const FIELDS = [
  {
    key: 'done' as const,
    label: 'WHAT WAS DONE',
    hint: 'The record. Facts. What you completed, and where you scaled it.',
  },
  {
    key: 'hard' as const,
    label: 'WHERE IT GOT HARD',
    hint: 'The specific moment. Not "it was tough" — the minute, the mile, the sentence.',
  },
  {
    key: 'learned' as const,
    label: 'WHAT YOU KNOW NOW',
    hint: 'One line. Something true today that was not true yesterday.',
  },
]

/**
 * THE ACCOUNT (doc 21). Compulsory on every trial except 1, 9 and 53 — the
 * three fixed prompts that turn a progress counter into a document, and the
 * fifty-seven pages the book (18.4) is built from. Editable until cleared,
 * then it locks — a record you can go back and improve is not a record.
 */
export default function AccountPanel({ trialNum, onCleared }: AccountPanelProps) {
  const [done, setDone] = useState('')
  const [hard, setHard] = useState('')
  const [learned, setLearned] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [stamping, setStamping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchMyAccount(trialNum)
      .then((a) => {
        if (cancelled || !a) return
        setDone(a.done)
        setHard(a.hard)
        setLearned(a.learned)
        setSavedAt(a.updated_at)
      })
      .catch(() => {
        /* No draft yet is the normal case, not an error worth surfacing. */
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [trialNum])

  const values = { done, hard, learned }
  const setters = { done: setDone, hard: setHard, learned: setLearned }
  const valid = FIELDS.every((f) => values[f.key].trim().length >= ACCOUNT_MIN_CHARS)

  async function save() {
    setSaving(true)
    setError(null)
    try {
      await saveAccount(trialNum, done, hard, learned)
      setSavedAt(new Date().toISOString())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the account.')
    } finally {
      setSaving(false)
    }
  }

  async function markCleared() {
    if (!valid) return
    setStamping(true)
    setError(null)
    try {
      await saveAccount(trialNum, done, hard, learned)
      const result = await clearTrial(trialNum)
      onCleared(result)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not clear the trial.'
      setError(
        msg.includes('CIRCUIT_REQUIRED') ? 'Trials 06+ require an active Circuit Pass.'
        : msg.includes('OUT_OF_ORDER') ? 'One line at a time. No skipping ahead.'
        : msg.includes('COOLDOWN') ? 'Not yet. The hold between lines has not run out.'
        : msg.includes('ENTRY_REQUIRED') ? 'Pay the entry first.'
        : msg,
      )
      setStamping(false)
    }
  }

  if (!loaded) return <div className="panel muted" role="status">LOADING…</div>

  return (
    <div className="stack">
      <div className="panel account-panel">
        <div className="label mb-1">THE ACCOUNT</div>
        <p className="muted account-disclaimer">
          This is not proof. Nobody reads it, nobody checks it, and nobody can reject it. It
          is the page in your book.
        </p>

        {FIELDS.map((f) => {
          const v = values[f.key]
          const short = v.trim().length < ACCOUNT_MIN_CHARS
          return (
            <div key={f.key} className="account-field">
              <label className="label" htmlFor={`acct-${f.key}`}>{f.label}</label>
              <p className="muted account-hint">{f.hint}</p>
              <textarea
                id={`acct-${f.key}`}
                rows={3}
                maxLength={2000}
                value={v}
                onChange={(e) => setters[f.key](e.target.value)}
                onBlur={() => v.trim().length > 0 && save()}
              />
              <div className="account-count muted">
                {short ? `${ACCOUNT_MIN_CHARS - v.trim().length} characters to go` : `${v.trim().length} characters`}
              </div>
            </div>
          )
        })}

        <div className="row" style={{ justifyContent: 'space-between' }}>
          {error && <div className="notice" role="alert">{error}</div>}
          <span className="muted" style={{ fontSize: 11 }}>
            {saving ? 'Saving…' : savedAt ? 'Saved.' : 'Not yet saved.'}
          </span>
        </div>
      </div>

      <button
        className="btn btn-primary"
        style={{ alignSelf: 'flex-start', fontSize: 16, padding: '18px 42px' }}
        onClick={markCleared}
        disabled={!valid || stamping}
      >
        {stamping ? 'STAMPING…' : 'MARK CLEARED'}
      </button>
    </div>
  )
}
