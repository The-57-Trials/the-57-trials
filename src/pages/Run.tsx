import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import RouteViz from '../components/RouteViz'
import { useAuth } from '../lib/auth'
import { fetchTrials, fetchMyCompletions, createCheckout } from '../lib/api'
import { pad, FREE_WINDOW_END, type Trial, type Completion } from '../lib/types'

export default function Run() {
  const { session, profile, refreshProfile } = useAuth()
  const [trials, setTrials] = useState<Trial[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const toast = (location.state as { toast?: string } | null)?.toast
  const pollRef = useRef(0)

  useEffect(() => {
    if (!session) return
    Promise.all([fetchTrials(), fetchMyCompletions(session.user.id)])
      .then(([t, c]) => {
        setTrials(t)
        setCompletions(c)
      })
      .catch((e) => setError(e.message))
  }, [session])

  // After returning from Stripe Checkout the webhook may lag a few seconds —
  // poll the profile until the flag flips (max ~30s).
  useEffect(() => {
    if (params.get('checkout') !== 'success') return
    pollRef.current = 0
    const iv = setInterval(async () => {
      pollRef.current += 1
      await refreshProfile()
      if (pollRef.current >= 10) {
        clearInterval(iv)
        setParams({}, { replace: true })
      }
    }, 3000)
    return () => clearInterval(iv)
  }, [params, refreshProfile, setParams])

  useEffect(() => {
    if (params.get('checkout') === 'success' && (profile?.entry_paid || profile?.circuit_active)) {
      setParams({}, { replace: true })
    }
  }, [profile, params, setParams])

  const cleared = completions.length
  const current = cleared + 1
  const byChapter = useMemo(() => {
    const groups: { chapter: string; trials: Trial[] }[] = []
    for (const t of trials) {
      const last = groups[groups.length - 1]
      if (last && last.chapter === t.chapter) last.trials.push(t)
      else groups.push({ chapter: t.chapter, trials: [t] })
    }
    return groups
  }, [trials])

  async function buy(product: 'entry' | 'circuit') {
    setBusy(true)
    setError(null)
    try {
      window.location.href = await createCheckout(product)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed.')
      setBusy(false)
    }
  }

  if (!profile) return <div className="page center muted">LOADING…</div>

  // ---- No entry yet: single CTA state ----
  if (!profile.entry_paid) {
    return (
      <div className="page" style={{ maxWidth: 560 }}>
        {params.get('checkout') === 'success' && (
          <div className="notice notice-yellow mb-3">
            Payment received — confirming with the timing tent… this takes a few seconds.
          </div>
        )}
        <h1 style={{ fontSize: 48 }}>YOU'RE NOT ON THE START LINE YET.</h1>
        <p className="muted mt-2 mb-3">
          Bib No. {pad(profile.bib_number)} is reserved for you. Pay the entry to take your place.
        </p>
        {error && <div className="notice mb-2">{error}</div>}
        <button className="btn btn-primary btn-block" onClick={() => buy('entry')} disabled={busy}>
          {busy ? 'OPENING CHECKOUT…' : 'PAY THE ENTRY — £10'}
        </button>
      </div>
    )
  }

  const currentTrial = trials.find((t) => t.num === current)
  const needsCircuit = current > FREE_WINDOW_END && !profile.circuit_active

  return (
    <div className="page">
      {toast && <div className="notice mb-3">{toast}</div>}

      <div className="spread mb-2">
        <div>
          <div className="label">
            No. {pad(profile.bib_number)} — {profile.display_name}'s run
          </div>
          <h1 style={{ fontSize: 40 }}>YOUR RUN</h1>
        </div>
        <div className="mono-num" style={{ fontSize: 22, fontWeight: 700 }}>
          {cleared} / 57
        </div>
      </div>

      <div className="progress-track mb-3">
        <div className="progress-fill" style={{ width: `${(cleared / 57) * 100}%` }} />
      </div>

      <div className="mb-3">
        <RouteViz cleared={cleared} />
      </div>

      {/* Current line banner — the primary action */}
      {cleared >= 57 ? (
        <div className="current-line-banner" style={{ animation: 'none', borderColor: 'var(--rust)' }}>
          <div className="cl-label" style={{ color: 'var(--rust)' }}>RUN COMPLETE</div>
          <div className="cl-title">ALL 57 LINES CLEARED.</div>
        </div>
      ) : needsCircuit ? (
        <div className="panel" style={{ border: '2px solid var(--rust)' }}>
          <div className="label rust">CIRCUIT PASS REQUIRED</div>
          <div className="display" style={{ fontSize: 34, margin: '8px 0' }}>
            TRIALS 06+ RUN ON THE CIRCUIT.
          </div>
          <p className="muted mb-2" style={{ fontSize: 13 }}>
            Your entry covered lines 01–05. The remaining {57 - cleared} need an active Circuit
            Pass — £4.99/month, cancel any time. Cleared lines stay cleared.
          </p>
          {error && <div className="notice mb-2">{error}</div>}
          <button className="btn btn-primary" onClick={() => buy('circuit')} disabled={busy}>
            {busy ? 'OPENING CHECKOUT…' : 'JOIN THE CIRCUIT — £4.99/MO'}
          </button>
        </div>
      ) : (
        currentTrial && (
          <Link to={`/run/trial/${current}`} className="current-line-banner">
            <div className="cl-label">CURRENT LINE</div>
            <div className="cl-title mono-num">
              {pad(current)} — {currentTrial.title}
            </div>
          </Link>
        )
      )}

      {/* Circuit upsell for entry-only members still inside the free window */}
      {!profile.circuit_active && current <= FREE_WINDOW_END && (
        <div className="notice notice-yellow mt-2" style={{ fontSize: 12 }}>
          Heads up: trials 06+ require an active Circuit Pass.{' '}
          <a href="#circuit" onClick={(e) => { e.preventDefault(); buy('circuit') }}>
            Join the circuit early
          </a>{' '}
          and keep moving when you get there.
        </div>
      )}

      {/* Trial grid, grouped by chapter */}
      {byChapter.map((group) => (
        <div key={group.chapter}>
          <div className="chapter-heading">
            <h3>{group.chapter}</h3>
            <div className="rule" />
          </div>
          <div className="trial-grid">
            {group.trials.map((t) => {
              const state = t.num <= cleared ? 'cleared' : t.num === current ? 'current' : 'locked'
              const tile = (
                <div className={`trial-tile ${state}`}>
                  {state === 'cleared' && <span className="t-stamp">CLEARED</span>}
                  {state === 'locked' && <span className="t-lock">🔒</span>}
                  <div className="t-num mono-num">{pad(t.num)}</div>
                  <div className="t-title">{t.title}</div>
                  {t.is_milestone && <span className="t-flag" />}
                </div>
              )
              return state === 'locked' ? (
                <div key={t.num} title={`Trial ${pad(t.num)} is locked. Clear ${pad(current)} first.`}>
                  {tile}
                </div>
              ) : (
                <Link key={t.num} to={`/run/trial/${t.num}`} className="trial-tile-link">
                  {tile}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
