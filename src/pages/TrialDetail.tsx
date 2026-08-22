import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import MilestoneTakeover from '../components/MilestoneTakeover'
import { useAuth } from '../lib/auth'
import { fetchTrials, fetchMyCompletions, fetchTrialBody, clearTrial } from '../lib/api'
import { pad, FREE_WINDOW_END, type Trial } from '../lib/types'

type Status = 'loading' | 'ok' | 'locked'

export default function TrialDetail() {
  const { num: numParam } = useParams()
  const num = Number(numParam)
  const { session, profile, refreshProfile } = useAuth()

  const [status, setStatus] = useState<Status>('loading')
  const [trial, setTrial] = useState<Trial | null>(null)
  const [body, setBody] = useState('')
  const [clearedCount, setClearedCount] = useState(0)
  const [isCleared, setIsCleared] = useState(false)
  const [stamping, setStamping] = useState(false)
  const [justCleared, setJustCleared] = useState(false)
  const [showMilestone, setShowMilestone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session || !Number.isInteger(num)) return
    let cancelled = false
    setStatus('loading')
    Promise.all([fetchTrials(), fetchMyCompletions(session.user.id)])
      .then(async ([trials, completions]) => {
        if (cancelled) return
        const t = trials.find((x) => x.num === num)
        const cleared = completions.length
        setClearedCount(cleared)
        setIsCleared(completions.some((c) => c.trial_num === num))
        if (!t || num > cleared + 1) {
          setStatus('locked')
          return
        }
        setTrial(t)
        const md = await fetchTrialBody(num).catch(() => '')
        if (!cancelled) {
          setBody(md)
          setStatus('ok')
        }
      })
      .catch(() => setStatus('locked'))
    return () => {
      cancelled = true
    }
  }, [session, num, justCleared])

  if (!Number.isInteger(num) || num < 1 || num > 57) return <Navigate to="/run" replace />

  if (status === 'locked') {
    return (
      <Navigate
        to="/run"
        replace
        state={{ toast: `Trial ${pad(num)} is locked. Clear ${pad(clearedCount + 1)} first.` }}
      />
    )
  }

  if (status === 'loading' || !trial || !profile) {
    return <div className="page center muted">LOADING…</div>
  }

  const needsCircuit = num > FREE_WINDOW_END && !profile.circuit_active

  async function markCleared() {
    setStamping(true)
    setError(null)
    try {
      const result = await clearTrial(num)
      setIsCleared(true)
      setJustCleared(true)
      setClearedCount((c) => c + 1)
      if (result.milestone) setShowMilestone(true)
      refreshProfile()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not clear the trial.'
      if (msg.includes('CIRCUIT_REQUIRED')) {
        setError('Trials 06+ require an active Circuit Pass.')
      } else if (msg.includes('OUT_OF_ORDER')) {
        setError('One line at a time. No skipping ahead.')
      } else if (msg.includes('ENTRY_REQUIRED')) {
        setError('Pay the entry first.')
      } else {
        setError(msg)
      }
    } finally {
      setStamping(false)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      {showMilestone && (
        <MilestoneTakeover trialNum={num} onDismiss={() => setShowMilestone(false)} />
      )}

      <Link to="/run" className="label" style={{ color: 'var(--steel)' }}>
        ← BACK TO YOUR RUN
      </Link>

      <div className="row mt-3 mb-3" style={{ alignItems: 'flex-start', gap: 26 }}>
        <div className="trial-detail-num mono-num">{pad(num)}</div>
        <div style={{ paddingTop: 8 }}>
          <div className="label">{trial.chapter}</div>
          <h1 style={{ fontSize: 42 }}>{trial.title}</h1>
          {trial.is_milestone && (
            <div className="label rust mt-1">▸ MILESTONE CHECKPOINT — MERCH DROP</div>
          )}
        </div>
      </div>

      <div className="trial-body">
        {body ? <ReactMarkdown>{body}</ReactMarkdown> : <p className="muted">Briefing to follow.</p>}
      </div>

      <div className="mt-4">
        {isCleared ? (
          <div className="stack">
            <div>
              <span className="stamp">CLEARED</span>
            </div>
            {num < 57 && (
              <Link
                to={`/run/trial/${num + 1}`}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => setJustCleared(false)}
              >
                NEXT LINE: {pad(num + 1)} →
              </Link>
            )}
          </div>
        ) : needsCircuit ? (
          <div className="panel" style={{ borderColor: 'var(--rust)' }}>
            <p style={{ fontSize: 13 }} className="mb-2">
              This line runs on the circuit. Trials 06+ require an active Circuit Pass.
            </p>
            <Link to="/run" className="btn btn-rust">
              JOIN THE CIRCUIT
            </Link>
          </div>
        ) : (
          <div className="stack">
            {error && <div className="notice">{error}</div>}
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
