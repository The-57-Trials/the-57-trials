import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import {
  fetchBonusTrials, fetchMyBonusCompletions, fetchBonusBody, clearBonusTrial,
  type BonusTrial,
} from '../lib/api'

type Status = 'loading' | 'ok' | 'locked' | 'blazer_locked' | 'out_of_order'

/** Trial Blazer bonus trials — TB-01 (the hoodie) and the post-57 series. */
export default function BonusTrialDetail() {
  const { id: idParam } = useParams()
  const id = Number(idParam)

  const [status, setStatus] = useState<Status>('loading')
  const [bonus, setBonus] = useState<BonusTrial | null>(null)
  const [body, setBody] = useState('')
  const [isCleared, setIsCleared] = useState(false)
  const [stamping, setStamping] = useState(false)
  const [result, setResult] = useState<{ reward: string; priced: boolean } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isInteger(id)) return
    let cancelled = false
    setStatus('loading')

    Promise.all([fetchBonusTrials(), fetchMyBonusCompletions()])
      .then(async ([bonuses, completions]) => {
        if (cancelled) return
        const b = bonuses.find((x) => x.id === id)
        if (!b) {
          setStatus('locked')
          return
        }
        setBonus(b)
        setIsCleared(completions.some((c) => c.bonus_id === id))
        try {
          const md = await fetchBonusBody(id)
          if (!cancelled) {
            setBody(md)
            setStatus('ok')
          }
        } catch (e) {
          if (cancelled) return
          const msg = e instanceof Error ? e.message : ''
          setStatus(
            msg.includes('BLAZER_LOCKED') ? 'blazer_locked'
            : msg.includes('OUT_OF_ORDER') ? 'out_of_order'
            : 'locked',
          )
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('locked')
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (!Number.isInteger(id)) return <Navigate to="/run" replace />

  if (status === 'loading') {
    return <div className="page center muted" role="status" aria-live="polite">LOADING…</div>
  }

  if (status === 'blazer_locked') {
    return (
      <div className="page" style={{ maxWidth: 560 }}>
        <div className="notice" role="alert">
          This is part of the Trial Blazer series. It stays sealed until you've redeemed the
          code from your hoodie card.
        </div>
        <Link to="/run" className="btn btn-outline mt-2">BACK TO YOUR RUN</Link>
      </div>
    )
  }

  if (status === 'out_of_order') {
    return (
      <div className="page" style={{ maxWidth: 560 }}>
        <div className="notice" role="alert">One trial at a time in the series. Clear the one before it first.</div>
        <Link to="/run" className="btn btn-outline mt-2">BACK TO YOUR RUN</Link>
      </div>
    )
  }

  if (status === 'locked' || !bonus) {
    return (
      <div className="page" style={{ maxWidth: 560 }}>
        <div className="notice" role="alert">This trial isn't open yet.</div>
        <Link to="/run" className="btn btn-outline mt-2">BACK TO YOUR RUN</Link>
      </div>
    )
  }

  async function markCleared() {
    setStamping(true)
    setError(null)
    try {
      const r = await clearBonusTrial(id)
      setIsCleared(true)
      setResult({ reward: r.reward, priced: r.priced })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not clear this trial.')
    } finally {
      setStamping(false)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <Link to="/run" className="label" style={{ color: 'var(--steel)' }}>← BACK TO YOUR RUN</Link>

      <div className="row mt-3 mb-3" style={{ alignItems: 'flex-start', gap: 26 }}>
        <div className="label" style={{ paddingTop: 8 }}>{bonus.code}</div>
        <div>
          <div className="label">TRIAL BLAZER</div>
          <h1 className="page-title">{bonus.title}</h1>
        </div>
      </div>

      <div className="trial-body">
        {body ? <ReactMarkdown>{body}</ReactMarkdown> : <p className="muted">Briefing to follow.</p>}
      </div>

      <div className="mt-4">
        {isCleared ? (
          <div className="stack">
            <span className="stamp">CLEARED</span>
            {result && (
              <p className="muted" style={{ fontSize: 13 }}>
                {result.priced
                  ? 'This unlocked the right to buy its reward in the Trial Shop.'
                  : 'Its reward has been queued for dispatch.'}
              </p>
            )}
          </div>
        ) : (
          <div className="stack">
            {error && <div className="notice" role="alert">{error}</div>}
            <button
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start', fontSize: 16, padding: '18px 42px' }}
              onClick={markCleared}
              disabled={stamping}
            >
              {stamping ? 'STAMPING…' : 'MARK CLEARED'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
