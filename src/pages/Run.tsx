import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import RouteViz from '../components/RouteViz'
import BlazerRedeem from '../components/BlazerRedeem'
import { useAuth } from '../lib/auth'
import { fetchTrials, fetchMyCompletions, createCheckout } from '../lib/api'
import {
  pad, FREE_WINDOW_END, PRICE_ENTRY, PRICE_CIRCUIT, readyAt, untilLabel, holdProgress,
  type Trial, type Completion,
} from '../lib/types'

type Load = 'loading' | 'ok' | 'error'

export default function Run() {
  const { session, profile, profileError, refreshProfile } = useAuth()
  const [trials, setTrials] = useState<Trial[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [load, setLoad] = useState<Load>('loading')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmTimedOut, setConfirmTimedOut] = useState(false)
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [toast, setToast] = useState<string | null>(
    (location.state as { toast?: string } | null)?.toast ?? null,
  )

  const awaitingConfirmation = params.get('checkout') === 'success'

  // Router state survives reloads and Back, so a stale "trial locked" message
  // would otherwise reappear days later. Show it once, then clear the entry.
  useEffect(() => {
    if (!toast) return
    navigate(location.pathname, { replace: true, state: null })
    const t = setTimeout(() => setToast(null), 8000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast])

  useEffect(() => {
    if (!session) return
    let cancelled = false
    Promise.all([fetchTrials(), fetchMyCompletions(session.user.id)])
      .then(([t, c]) => {
        if (cancelled) return
        setTrials(t)
        setCompletions(c)
        setLoad('ok')
      })
      .catch((e) => {
        if (cancelled) return
        const raw = e instanceof Error ? e.message : String(e)
        setLoadError(
          /fetch|network/i.test(raw)
            ? 'Lost the timing signal. Check your connection and reload.'
            : raw,
        )
        setLoad('error')
      })
    return () => {
      cancelled = true
    }
  }, [session])

  // Stripe's webhook lags the redirect by a few seconds. Poll until the flag
  // flips, then stop — but if it never does, say so plainly rather than
  // reverting to a screen that tells someone who just paid to pay again.
  const refreshRef = useRef(refreshProfile)
  refreshRef.current = refreshProfile

  useEffect(() => {
    if (!awaitingConfirmation) return
    let ticks = 0
    let stopped = false
    const iv = setInterval(async () => {
      if (stopped) return
      ticks += 1
      await refreshRef.current()
      if (ticks >= 12 && !stopped) {
        stopped = true
        clearInterval(iv)
        setConfirmTimedOut(true)
      }
    }, 3000)
    return () => {
      stopped = true
      clearInterval(iv)
    }
  }, [awaitingConfirmation])

  // Clear the marker only once the payment has actually landed.
  useEffect(() => {
    if (awaitingConfirmation && (profile?.entry_paid || profile?.circuit_active)) {
      setConfirmTimedOut(false)
      setParams({}, { replace: true })
    }
  }, [profile, awaitingConfirmation, setParams])

  // Derive the frontier from the highest cleared number, not the row count, so
  // a gap can never silently mislabel every tile in the grid.
  const clearedSet = useMemo(
    () => new Set(completions.map((c) => c.trial_num)),
    [completions],
  )
  const cleared = useMemo(
    () => completions.reduce((m, c) => Math.max(m, c.trial_num), 0),
    [completions],
  )
  const current = cleared + 1

  const lastClearedAt = useMemo(
    () => completions.reduce<string | null>(
      (m, c) => (!m || c.cleared_at > m ? c.cleared_at : m), null,
    ),
    [completions],
  )

  const byChapter = useMemo(() => {
    const groups: { chapter: string; trials: Trial[] }[] = []
    for (const t of trials) {
      const last = groups[groups.length - 1]
      if (last && last.chapter === t.chapter) last.trials.push(t)
      else groups.push({ chapter: t.chapter, trials: [t] })
    }
    return groups
  }, [trials])

  const buy = useCallback(async (product: 'entry' | 'circuit') => {
    setBusy(true)
    setError(null)
    try {
      window.location.href = await createCheckout(product)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed.')
      setBusy(false)
    }
  }, [])

  if (profileError) {
    return (
      <div className="page" style={{ maxWidth: 520 }}>
        <div className="notice mb-2" role="alert">
          Couldn't load your runner file. {profileError}
        </div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          TRY AGAIN
        </button>
      </div>
    )
  }

  if (!profile) return <div className="page center muted" role="status">LOADING…</div>

  /** Shown in both the unpaid and paid states — a Circuit purchase returns here too. */
  const confirmationBanner = confirmTimedOut ? (
    <div className="notice mb-3" role="alert">
      <strong>PAYMENT TAKEN — CONFIRMATION STILL PENDING.</strong> Your payment went through
      but we haven't had the confirmation yet. <strong>Do not pay again.</strong> Reload in a
      minute, or contact us and we'll sort it.
    </div>
  ) : awaitingConfirmation ? (
    <div className="notice notice-yellow mb-3" role="status" aria-live="polite">
      Payment received — confirming with the timing tent… this takes a few seconds.
    </div>
  ) : null

  // ---- No entry yet: single CTA state ----
  if (!profile.entry_paid) {
    return (
      <div className="page" style={{ maxWidth: 560 }}>
        {confirmationBanner}
        <h1 className="page-title">YOU'RE NOT ON THE START LINE YET.</h1>
        <p className="muted mt-2 mb-3">
          Bib No. {pad(profile.bib_number)} is reserved for you. Pay the entry to take your place.
        </p>
        {error && <div className="notice mb-2" role="alert">{error}</div>}
        <button
          className="btn btn-primary btn-block"
          onClick={() => buy('entry')}
          disabled={busy || awaitingConfirmation}
        >
          {awaitingConfirmation
            ? 'CONFIRMING PAYMENT…'
            : busy
              ? 'OPENING CHECKOUT…'
              : `PAY THE ENTRY — ${PRICE_ENTRY}`}
        </button>
        <p className="muted mt-2" style={{ fontSize: 12 }}>
          {PRICE_ENTRY} one-time. Total price — no VAT, no extra charges. Unlocks your bib
          number and trials 01–05. Trials 06–57 need a Circuit Pass at {PRICE_CIRCUIT}/month,
          cancel any time.
        </p>
      </div>
    )
  }

  const currentTrial = trials.find((t) => t.num === current)
  const needsCircuit = current > FREE_WINDOW_END && !profile.circuit_active
  const cooldownUntil = currentTrial
    ? readyAt(lastClearedAt, currentTrial.min_gap_minutes)
    : null

  return (
    <div className="page">
      {confirmationBanner}
      {toast && <div className="notice mb-3" role="status">{toast}</div>}
      {load === 'error' && loadError && (
        <div className="notice mb-3" role="alert">{loadError}</div>
      )}

      <div className="spread mb-2">
        <div style={{ minWidth: 0 }}>
          <div className="label wrap-anywhere">
            No. {pad(profile.bib_number)} — {profile.display_name}'s run
          </div>
          <h1 className="page-title">YOUR RUN</h1>
        </div>
        <div className="mono-num" style={{ fontSize: 22, fontWeight: 700 }}>
          {load === 'loading' ? '—' : cleared} / 57
        </div>
      </div>

      <div
        className="progress-track mb-3"
        role="progressbar"
        aria-valuenow={cleared}
        aria-valuemin={0}
        aria-valuemax={57}
        aria-label="Trials cleared"
      >
        <div className="progress-fill" style={{ width: `${(cleared / 57) * 100}%` }} />
      </div>

      <div className="mb-3">
        <RouteViz cleared={cleared} />
      </div>

      {/* Current line banner — the primary action */}
      {load === 'loading' ? (
        <div className="panel muted" role="status">READING YOUR RUN…</div>
      ) : cleared >= 57 ? (
        <>
          <div className="panel" style={{ border: '2px solid var(--rust)' }}>
            <div className="label" style={{ color: 'var(--paper)' }}>RUN COMPLETE</div>
            <div className="display" style={{ fontSize: 34, marginTop: 6 }}>
              ALL 57 LINES CLEARED.
            </div>
          </div>
          <BlazerRedeem />
        </>
      ) : needsCircuit ? (
        <div className="panel" style={{ border: '2px solid var(--rust)' }}>
          <div className="label" style={{ color: 'var(--paper)' }}>CIRCUIT PASS REQUIRED</div>
          <div className="display" style={{ fontSize: 34, margin: '8px 0' }}>
            TRIALS 06+ RUN ON THE CIRCUIT.
          </div>
          <p className="muted mb-2" style={{ fontSize: 13 }}>
            Your entry covered lines 01–05. The remaining {57 - cleared} need an active Circuit
            Pass — {PRICE_CIRCUIT}/month, cancel any time. Cleared lines stay cleared.
          </p>
          {error && <div className="notice mb-2" role="alert">{error}</div>}
          <button
            className="btn btn-primary"
            onClick={() => buy('circuit')}
            disabled={busy || awaitingConfirmation}
          >
            {awaitingConfirmation
              ? 'CONFIRMING PAYMENT…'
              : busy
                ? 'OPENING CHECKOUT…'
                : `JOIN THE CIRCUIT — ${PRICE_CIRCUIT}/MO`}
          </button>
        </div>
      ) : cooldownUntil && currentTrial && currentTrial.trial_type === 'HOLD' ? (
        /* D15: on a HOLD, min_gap_minutes IS the trial's own duration, not a
           cooldown — it's already open, the member is inside it. Read as a
           duration in progress, never as a lockout (doc 4.8.1). */
        (() => {
          const progress = holdProgress(lastClearedAt, currentTrial.min_gap_minutes)
          return (
            <div className="panel hold-panel">
              <div className="label">THE INTERVAL — {pad(current)} IS OPEN</div>
              <div className="display" style={{ fontSize: 30, margin: '8px 0' }}>
                {progress ? `DAY ${progress.day} OF ${progress.of}` : currentTrial.title.toUpperCase()}
              </div>
              {progress && (
                <div className="progress-track hold-track mb-2" role="progressbar"
                  aria-valuenow={progress.day} aria-valuemin={0} aria-valuemax={progress.of}
                  aria-label={`Day ${progress.day} of ${progress.of}`}
                >
                  <div className="progress-fill" style={{ width: `${(progress.day / progress.of) * 100}%` }} />
                </div>
              )}
              <p className="muted" style={{ fontSize: 13 }}>
                {currentTrial.title} clears once the days are up. The waiting is the trial.
              </p>
              <Link to={`/run/trial/${current}`} className="btn-link mt-1" style={{ display: 'inline-block' }}>
                Read the brief again →
              </Link>
            </div>
          )
        })()
      ) : cooldownUntil && currentTrial ? (
        /* The wait is part of the trial, so it is stated plainly rather than
           hidden — and it can never be bought out of. */
        <div className="panel cooldown-panel">
          <div className="label">HOLDING AT CHECKPOINT</div>
          <div className="display" style={{ fontSize: 30, margin: '8px 0' }}>
            {pad(current)} OPENS {untilLabel(cooldownUntil).toUpperCase()}
          </div>
          <p className="muted" style={{ fontSize: 13 }}>
            {currentTrial.min_gap_minutes >= 10080
              ? 'A week between the final lines. That is the taper, and it is the trial too.'
              : `${Math.round(currentTrial.min_gap_minutes / 60)} hours between lines. Recovery is the work nobody sees.`}
          </p>
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
      {!profile.circuit_active && current <= FREE_WINDOW_END && load === 'ok' && (
        <div className="notice notice-yellow mt-2" style={{ fontSize: 12 }}>
          Heads up: trials 06+ require an active Circuit Pass.{' '}
          <button
            type="button"
            className="btn-link"
            onClick={() => buy('circuit')}
            disabled={busy || awaitingConfirmation}
          >
            Join the circuit early
          </button>{' '}
          and keep moving when you get there.
        </div>
      )}

      {/* Trial grid, grouped by chapter */}
      {byChapter.map((group) => (
        <div key={group.chapter}>
          <div className="chapter-heading">
            <h2>{group.chapter}</h2>
            <div className="rule" />
          </div>
          <div className="trial-grid">
            {group.trials.map((t) => {
              const state = clearedSet.has(t.num)
                ? 'cleared'
                : t.num === current
                  ? 'current'
                  : 'locked'
              const tile = (
                <div className={`trial-tile ${state}`}>
                  {state === 'cleared' && <span className="t-stamp">CLEARED</span>}
                  {state === 'locked' && (
                    <>
                      <span className="t-lock" aria-hidden="true">🔒</span>
                      <span className="sr-only">
                        Locked — clear trial {pad(current)} first.
                      </span>
                    </>
                  )}
                  <div className="t-num mono-num">{pad(t.num)}</div>
                  <div className="t-title">{t.title}</div>
                  {state === 'locked' && t.published_demand != null && (
                    <div className="t-grade mono-num" aria-hidden="true">
                      D{t.published_demand} · F{t.published_friction}
                    </div>
                  )}
                  {t.is_milestone && <span className="t-flag" aria-hidden="true" />}
                </div>
              )
              return state === 'locked' ? (
                <div key={t.num}>{tile}</div>
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
