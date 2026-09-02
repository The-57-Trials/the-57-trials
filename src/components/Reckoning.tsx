import { useEffect, useState } from 'react'
import { fetchMyLetter, submitReckoning, clearTrial, type ClearResult } from '../lib/api'
import type { Letter, ReckoningDecision, ReckoningRoute } from '../lib/types'

interface ReckoningProps {
  onCleared: (result: ClearResult) => void
}

const PAUSE_SECONDS = 120

type Step = 'loading' | 'reading' | 'answering' | 'deciding' | 'error'

function LetterCard({ label, letter }: { label: string; letter: Letter | null }) {
  return (
    <div className={`letter-page ${letter?.typeface ?? 'typewriter'}`}>
      <div className="label reckoning-letter-label" style={{ color: 'rgba(20,22,28,0.55)' }}>
        {label}
      </div>
      <div className="reckoning-letter-body">{letter?.body ?? '—'}</div>
    </div>
  )
}

/**
 * THE RECKONING (doc 18.7, D14) — the member's own Trial 01 and Trial 09
 * letters, unreadable until now, followed by an irreversible choice. This is
 * the only place in the product those two letters can ever be read.
 */
export default function Reckoning({ onCleared }: ReckoningProps) {
  const [step, setStep] = useState<Step>('loading')
  const [letter1, setLetter1] = useState<Letter | null>(null)
  const [letter9, setLetter9] = useState<Letter | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(PAUSE_SECONDS)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [route, setRoute] = useState<ReckoningRoute | null>(null)
  const [witnessName, setWitnessName] = useState('')
  const [witnessRelationship, setWitnessRelationship] = useState('')
  const [answer, setAnswer] = useState('')
  const [decision, setDecision] = useState<ReckoningDecision | null>(null)
  const [confirmingRelease, setConfirmingRelease] = useState(false)
  const [busy, setBusy] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchMyLetter(1), fetchMyLetter(9)])
      .then(([l1, l9]) => {
        if (cancelled) return
        setLetter1(l1)
        setLetter9(l9)
        setStep('reading')
      })
      .catch((e) => {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Could not open the letters.')
        setStep('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (step !== 'reading' || secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [step, secondsLeft])

  const canSubmitAnswer =
    route !== null
    && (route === 'written' || witnessName.trim().length > 0)
    && answer.trim().length >= 10

  async function submit() {
    if (!route || !decision || !canSubmitAnswer || busy) return
    setBusy(true)
    setSubmitError(null)
    try {
      await submitReckoning({
        route, witnessName, witnessRelationship, answer, decision,
      })
      const result = await clearTrial(53)
      onCleared(result)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not record the reckoning.'
      setSubmitError(
        msg.includes('ALREADY_DECIDED') ? 'This choice has already been made and cannot be changed.'
        : msg.includes('ANSWER_TOO_SHORT') ? 'A few more words — one honest sentence is enough.'
        : msg.includes('WITNESS_REQUIRED') ? 'Name who you told, or switch to writing it instead.'
        : msg,
      )
      setBusy(false)
    }
  }

  if (step === 'loading') {
    return <div className="panel muted" role="status">OPENING THE LETTERS…</div>
  }

  if (step === 'error') {
    return <div className="notice" role="alert">{loadError}</div>
  }

  if (step === 'reading') {
    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
    const ss = String(secondsLeft % 60).padStart(2, '0')
    return (
      <div className="stack">
        <div className="reckoning-letters">
          <LetterCard label="TRIAL 01 — WHY YOU CAME, AND WHAT WOULD MAKE YOU QUIT" letter={letter1} />
          <LetterCard label="TRIAL 09 — WHAT FINISHING WOULD LOOK LIKE" letter={letter9} />
        </div>

        {secondsLeft > 0 ? (
          <div className="reckoning-pause">
            <div className="label">READ IT AGAIN</div>
            <div className="countdown mono-num">{mm}:{ss}</div>
            <p className="muted mt-2" style={{ fontSize: 13 }}>This opens when the two minutes are up.</p>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-rust"
            style={{ alignSelf: 'flex-start', fontSize: 16, padding: '18px 42px' }}
            onClick={() => setStep('answering')}
          >
            ARE YOU READY TO FACE YOURSELF?
          </button>
        )}
      </div>
    )
  }

  if (step === 'answering') {
    return (
      <div className="stack">
        <div>
          <div className="label mb-1">HOW WILL YOU ANSWER</div>
          <div className="route-choice">
            <button
              type="button"
              className={`route-btn${route === 'written' ? ' on' : ''}`}
              onClick={() => setRoute('written')}
            >
              <div className="rb-title">WRITE IT</div>
              <div className="rb-sub">A reply to the person who wrote those letters.</div>
            </button>
            <button
              type="button"
              className={`route-btn${route === 'spoken' ? ' on' : ''}`}
              onClick={() => setRoute('spoken')}
            >
              <div className="rb-title">SAY IT</div>
              <div className="rb-sub">Read both letters aloud to your witness, then record it here.</div>
            </button>
          </div>
        </div>

        {route === 'spoken' && (
          <div className="row" style={{ gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="label" htmlFor="wname">Who you told</label>
              <input
                id="wname"
                value={witnessName}
                onChange={(e) => setWitnessName(e.target.value)}
                maxLength={80}
                placeholder="First name"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label" htmlFor="wrel">Relationship (optional)</label>
              <input
                id="wrel"
                value={witnessRelationship}
                onChange={(e) => setWitnessRelationship(e.target.value)}
                maxLength={80}
                placeholder="e.g. partner, friend"
              />
            </div>
          </div>
        )}

        {route && (
          <div>
            <label className="label" htmlFor="answer">WERE YOU RIGHT ABOUT YOURSELF?</label>
            <textarea
              id="answer"
              rows={5}
              maxLength={4000}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="One honest sentence is enough."
            />
          </div>
        )}

        {route && (
          <button
            type="button"
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start' }}
            disabled={!canSubmitAnswer}
            onClick={() => setStep('deciding')}
          >
            NEXT — THE CHOICE
          </button>
        )}
      </div>
    )
  }

  // step === 'deciding'
  return (
    <div className="stack">
      <div className="label">THIS CANNOT BE UNDONE</div>
      <div className="decision-choice">
        <button
          type="button"
          className={`decision-btn lodge${decision === 'lodge' ? ' on' : ''}`}
          onClick={() => { setDecision('lodge'); setConfirmingRelease(false) }}
        >
          <div className="db-title">LODGE IT</div>
          <div className="db-sub">Both letters return to your Library, sealed for good.</div>
        </button>
        <button
          type="button"
          className={`decision-btn release${decision === 'release' ? ' on' : ''}`}
          onClick={() => setDecision('release')}
        >
          <div className="db-title">RELEASE IT</div>
          <div className="db-sub">Both letters are destroyed. Not hidden — deleted.</div>
        </button>
      </div>

      {decision === 'release' && !confirmingRelease && (
        <div className="notice" role="alert">
          This deletes both letters permanently. Nobody, including you, will be able to read
          them again. Your Library will only show that you let them go, and when.
          <div className="mt-2">
            <button type="button" className="btn btn-outline" onClick={() => setConfirmingRelease(true)}>
              I understand — confirm release
            </button>
          </div>
        </div>
      )}

      {submitError && <div className="notice" role="alert">{submitError}</div>}

      {decision && (decision === 'lodge' || confirmingRelease) && (
        <button
          type="button"
          className="btn btn-rust"
          style={{ alignSelf: 'flex-start', fontSize: 16, padding: '18px 42px' }}
          onClick={submit}
          disabled={busy}
        >
          {busy ? 'RECORDING…' : decision === 'lodge' ? 'LODGE IT' : 'RELEASE IT'}
        </button>
      )}
    </div>
  )
}
