import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import MilestoneTakeover from '../components/MilestoneTakeover'
import GradeTrial from '../components/GradeTrial'
import { useAuth } from '../lib/auth'
import { fetchTrials, fetchMyCompletions, fetchTrialBody, clearTrial } from '../lib/api'
import { pad, FREE_WINDOW_END, PRICE_CIRCUIT, type Trial } from '../lib/types'

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
  const [showMilestone, setShowMilestone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const circuitLocked = num > FREE_WINDOW_END && profile != null && !profile.circuit_active

  useEffect(() => {
    if (!session || !Number.isInteger(num)) return
    let cancelled = false
    setStatus('loading')
    setError(null)

    Promise.all([fetchTrials(), fetchMyCompletions(session.user.id)])
      .then(async ([trials, completions]) => {
        if (cancelled) return
        const t = trials.find((x) => x.num === num)
        // Derive the frontier from the highest cleared number rather than the
        // row count, so a gap in completions can't mislabel the whole grid.
        const highest = completions.reduce((m, c) => Math.max(m, c.trial_num), 0)
        setClearedCount(highest)
        setIsCleared(completions.some((c) => c.trial_num === num))
        if (!t || num > highest + 1) {
          setStatus('locked')
          return
        }
        setTrial(t)
        // The server refuses the body for unpaid or un-subscribed members, so
        // an empty string here means "not entitled", not "not written".
        const md = await fetchTrialBody(num).catch(() => '')
        if (!cancelled) {
          setBody(md)
          setStatus('ok')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('locked')
      })

    return () => {
      cancelled = true
    }
  }, [session, num])

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

  // The milestone moment renders above the loading gate so it can never be
  // interrupted by a background refresh.
  const takeover = showMilestone ? (
    <MilestoneTakeover trialNum={num} onDismiss={() => setShowMilestone(false)} />
  ) : null

  if (status === 'loading' || !trial || !profile) {
    return (
      <>
        {takeover}
        <div className="page center muted" role="status" aria-live="polite">LOADING…</div>
      </>
    )
  }

  async function markCleared() {
    setStamping(true)
    setError(null)
    try {
      const result = await clearTrial(num)
      setIsCleared(true)
      setClearedCount((c) => Math.max(c, num))
      if (result.milestone) setShowMilestone(true)
      refreshProfile()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not clear the trial.'
      if (msg.includes('CIRCUIT_REQUIRED')) {
        setError('Trials 06+ require an active Circuit Pass.')
      } else if (msg.includes('OUT_OF_ORDER')) {
        setError('One line at a time. No skipping ahead.')
      } else if (msg.includes('COOLDOWN')) {
        setError('Not yet. The hold between lines has not run out.')
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
      {takeover}

      <Link to="/run" className="label" style={{ color: 'var(--steel)' }}>
        ← BACK TO YOUR RUN
      </Link>

      <div className="row mt-3 mb-3" style={{ alignItems: 'flex-start', gap: 26 }}>
        <div className="trial-detail-num mono-num">{pad(num)}</div>
        <div style={{ paddingTop: 8 }}>
          <div className="label">{trial.chapter}</div>
          <h1 className="page-title">{trial.title}</h1>
          {trial.is_milestone && (
            <div className="label mt-1" style={{ color: 'var(--paper)' }}>
              <span className="rust">▸</span> MILESTONE CHECKPOINT — MERCH DROP
            </div>
          )}
        </div>
      </div>

      {circuitLocked ? (
        /* Content is the product. Nothing of the briefing is shown here. */
        <div className="panel" style={{ borderColor: 'var(--rust)' }}>
          <div className="label" style={{ color: 'var(--paper)' }}>CIRCUIT PASS REQUIRED</div>
          <div className="display" style={{ fontSize: 30, margin: '8px 0' }}>
            THIS LINE RUNS ON THE CIRCUIT.
          </div>
          <p style={{ fontSize: 13 }} className="mb-2 muted">
            Your entry covered lines 01–05. Everything from 06 needs an active Circuit Pass —
            {PRICE_CIRCUIT}/month, cancel any time. Cleared lines stay cleared.
          </p>
          <Link to="/run" className="btn btn-rust">JOIN THE CIRCUIT</Link>
        </div>
      ) : (
        <>
          <div className="trial-body">
            {body ? (
              <ReactMarkdown>{body}</ReactMarkdown>
            ) : (
              <p className="muted">Briefing to follow.</p>
            )}
          </div>

          <div className="mt-4">
            {isCleared ? (
              <div className="stack">
                <div>
                  <span className="stamp">CLEARED</span>
                </div>

                <GradeTrial trialNum={num} />
                {num < 57 && (
                  <Link
                    to={`/run/trial/${num + 1}`}
                    className="btn btn-primary"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    NEXT LINE: {pad(num + 1)} →
                  </Link>
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
        </>
      )}
    </div>
  )
}
