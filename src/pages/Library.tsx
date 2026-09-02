import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import {
  fetchMyCompletions, fetchMyReckoning, fetchAllMyWitnesses, fetchMyFinisher,
  fetchBonusTrials, fetchMyBonusCompletions, fetchMyLetter, fetchMyBlazerStatus,
  type MyReckoning, type MyFinisher, type BonusTrial, type BlazerStatus,
} from '../lib/api'
import { pad, MILESTONES, type Completion, type Letter, type TrialWitness } from '../lib/types'

type Load = 'loading' | 'ok' | 'error'

const MILESTONE_LABEL: Record<number, string> = {
  15: 'THE BIB',
  30: 'PATCH + CARD',
  45: 'THE TRIAL BLAZER CARD',
  57: "FINISHER'S PLATE",
}

function LetterCard({
  trialNum, label, cleared, reckoningDone, decision,
}: {
  trialNum: number
  label: string
  cleared: boolean
  reckoningDone: boolean
  decision: 'lodge' | 'release' | null
}) {
  const [letter, setLetter] = useState<Letter | null>(null)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  async function reveal() {
    setBusy(true)
    try {
      const l = await fetchMyLetter(trialNum)
      setLetter(l)
      setOpen(true)
    } catch {
      /* Released, or genuinely not found — the panel below covers both. */
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="panel letter-card-lib">
      <div className="label mb-1">TRIAL {pad(trialNum)} — {label}</div>
      {!cleared ? (
        <p className="muted" style={{ fontSize: 13 }}>Not yet written.</p>
      ) : !reckoningDone ? (
        <p className="muted" style={{ fontSize: 13 }}>
          <span className="rust">SEALED</span> — opens at Trial 53.
        </p>
      ) : decision === 'release' ? (
        <p className="muted" style={{ fontSize: 13 }}>
          Released. The words are gone; the fact that you let them go remains.
        </p>
      ) : open && letter ? (
        <div className={`letter-page ${letter.typeface} mt-1`} style={{ padding: '18px 16px' }}>
          <div className="reckoning-letter-body" style={{ fontSize: 13 }}>{letter.body}</div>
        </div>
      ) : (
        <button type="button" className="btn-link" onClick={reveal} disabled={busy}>
          {busy ? 'Opening…' : 'Read it'}
        </button>
      )}
    </div>
  )
}

export default function Library() {
  const { profile } = useAuth()
  const [load, setLoad] = useState<Load>('loading')
  const [completions, setCompletions] = useState<Completion[]>([])
  const [reckoning, setReckoning] = useState<MyReckoning | null>(null)
  const [witnesses, setWitnesses] = useState<(TrialWitness & { trial_num: number })[]>([])
  const [finisher, setFinisher] = useState<MyFinisher | null>(null)
  const [bonusTrials, setBonusTrials] = useState<BonusTrial[]>([])
  const [bonusDone, setBonusDone] = useState<Set<number>>(new Set())
  const [blazer, setBlazer] = useState<BlazerStatus | null>(null)

  useEffect(() => {
    if (!profile) return
    let cancelled = false
    Promise.all([
      fetchMyCompletions(profile.id),
      fetchMyReckoning().catch(() => null),
      fetchAllMyWitnesses().catch(() => []),
      fetchMyFinisher().catch(() => null),
      fetchBonusTrials().catch(() => []),
      fetchMyBonusCompletions().catch(() => []),
      fetchMyBlazerStatus().catch(() => null),
    ])
      .then(([c, r, w, f, bt, bc, bz]) => {
        if (cancelled) return
        setCompletions(c)
        setReckoning(r)
        setWitnesses(w)
        setFinisher(f)
        setBonusTrials(bt)
        setBonusDone(new Set(bc.map((x) => x.bonus_id)))
        setBlazer(bz)
        setLoad('ok')
      })
      .catch(() => !cancelled && setLoad('error'))
    return () => {
      cancelled = true
    }
  }, [profile])

  if (!profile) return <div className="page center muted" role="status">LOADING…</div>

  const cleared = new Set(completions.map((c) => c.trial_num))
  const clearedAt = (n: number) => completions.find((c) => c.trial_num === n)?.cleared_at
  const hasStarted = completions.length > 0

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div className="label">No. {pad(profile.bib_number)} — {profile.display_name}</div>
      <h1 className="page-title">THE LIBRARY</h1>
      <p className="muted mb-3" style={{ fontSize: 13, maxWidth: 520 }}>
        The one warm room. Everything else here is cold on purpose — this is what you actually
        own after however many months this takes.
      </p>

      {load === 'loading' && <div className="panel muted" role="status">OPENING THE LIBRARY…</div>}
      {load === 'error' && <div className="notice" role="alert">Couldn't load the Library. Reload to try again.</div>}

      {load === 'ok' && !hasStarted && (
        <div className="panel">
          <p className="muted">Empty for now. Clear your first line to begin.</p>
          <Link to="/run" className="btn btn-primary mt-2">BACK TO YOUR RUN</Link>
        </div>
      )}

      {load === 'ok' && hasStarted && (
        <div className="stack">
          <section>
            <h2 className="chapter-heading-sm">THE LETTERS</h2>
            <div className="reckoning-letters">
              <LetterCard
                trialNum={1} label="THE BIB"
                cleared={cleared.has(1)}
                reckoningDone={cleared.has(53)}
                decision={reckoning?.decision ?? null}
              />
              <LetterCard
                trialNum={9} label="THE LINE"
                cleared={cleared.has(9)}
                reckoningDone={cleared.has(53)}
                decision={reckoning?.decision ?? null}
              />
            </div>
          </section>

          {reckoning && (
            <section>
              <h2 className="chapter-heading-sm">THE RECKONING</h2>
              <div className="panel">
                <div className="spread">
                  <span className="label">
                    {reckoning.route === 'spoken' ? 'ANSWERED ALOUD' : 'ANSWERED IN WRITING'}
                  </span>
                  <span className="muted" style={{ fontSize: 12 }}>
                    {new Date(reckoning.decided_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="mt-2" style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{reckoning.answer}</p>
                <div className="label mt-2" style={{ color: reckoning.decision === 'lodge' ? 'var(--yellow)' : 'var(--rust)' }}>
                  {reckoning.decision === 'lodge' ? 'LODGED — SEALED FOR GOOD' : 'RELEASED'}
                </div>
              </div>
            </section>
          )}

          <section>
            <h2 className="chapter-heading-sm">MILESTONES</h2>
            <div className="milestone-grid">
              {MILESTONES.map((m) => {
                const at = clearedAt(m)
                return (
                  <div key={m} className={`milestone-card${at ? '' : ' locked'}`}>
                    <div className="m-num mono-num">{pad(m)}</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{MILESTONE_LABEL[m]}</div>
                    <p>
                      {at
                        ? new Date(at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Not yet'}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          {bonusTrials.length > 0 && cleared.has(45) && (
            <section>
              <h2 className="chapter-heading-sm">THE TRIAL BLAZER</h2>
              <div className="stack" style={{ gap: 10 }}>
                {bonusTrials
                  .filter((b) => b.sequence == null || blazer?.redeemed)
                  .sort((a, b) => (a.sequence ?? -1) - (b.sequence ?? -1))
                  .map((b) => {
                    const done = bonusDone.has(b.id)
                    const priorSeq = b.sequence != null ? b.sequence - 1 : null
                    const priorDone = priorSeq == null || priorSeq === 0
                      || bonusTrials.some((x) => x.sequence === priorSeq && bonusDone.has(x.id))
                    const openable = !done && priorDone
                    const row = (
                      <div className="panel spread">
                        <div>
                          <div className="label">{b.code}</div>
                          <div style={{ fontSize: 14 }}>{b.title}</div>
                        </div>
                        <span
                          className={`label ${done ? '' : 'muted'}`}
                          style={done ? { color: 'var(--yellow)' } : undefined}
                        >
                          {done ? `CLEARED — ${b.reward}` : openable ? 'OPEN' : 'LOCKED'}
                        </span>
                      </div>
                    )
                    return openable ? (
                      <Link key={b.id} to={`/run/bonus/${b.id}`} style={{ color: 'inherit' }}>{row}</Link>
                    ) : (
                      <div key={b.id}>{row}</div>
                    )
                  })}
              </div>
              {!blazer?.redeemed && bonusDone.has(1) && (
                <p className="muted mt-2" style={{ fontSize: 12 }}>
                  The rest of the series is on the card that shipped with your hoodie — scan it
                  once you've finished all 57.
                </p>
              )}
            </section>
          )}

          {witnesses.length > 0 && (
            <section>
              <h2 className="chapter-heading-sm">WITNESSES</h2>
              <div className="stack" style={{ gap: 6 }}>
                {witnesses.map((w) => (
                  <div key={w.trial_num} className="row" style={{ justifyContent: 'space-between', fontSize: 13 }}>
                    <span className="mono-num">TRIAL {pad(w.trial_num)}</span>
                    <span>{w.witness_name}{w.relationship ? ` (${w.relationship})` : ''}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="chapter-heading-sm">FINISH</h2>
            {finisher ? (
              <div className="panel" style={{ borderColor: 'var(--yellow)' }}>
                <div className="finisher-number mono-num">
                  FINISHER No. {String(finisher.finisher_number).padStart(3, '0')}
                </div>
                <p className="muted" style={{ fontSize: 13 }}>
                  {new Date(finisher.finished_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {' '}— permanent, never reissued. The book is unlocked.
                </p>
              </div>
            ) : (
              <p className="muted" style={{ fontSize: 13 }}>
                {57 - cleared.size} lines to go.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
