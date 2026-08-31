import { useEffect, useState } from 'react'
import { fetchMyGrade, gradeTrial } from '../lib/api'

interface GradeTrialProps {
  trialNum: number
}

const DEMAND_ANCHORS: Record<number, string> = {
  1: 'Barely noticed it',
  5: 'A real session',
  10: 'The hardest thing I have done here',
}
const FRICTION_ANCHORS: Record<number, string> = {
  1: 'Fitted into any day',
  5: 'Had to plan it',
  10: 'Rearranged my week',
}

function Scale({
  id, label, hint, anchors, value, onChange,
}: {
  id: string
  label: string
  hint: string
  anchors: Record<number, string>
  value: number | null
  onChange: (n: number) => void
}) {
  return (
    <fieldset className="grade-scale">
      <legend className="label">{label}</legend>
      <p className="muted" style={{ fontSize: 11, marginBottom: 8 }}>{hint}</p>
      <div className="grade-row" role="radiogroup" aria-labelledby={`${id}-lbl`}>
        <span id={`${id}-lbl`} className="sr-only">{label}</span>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} out of 10${anchors[n] ? ` — ${anchors[n]}` : ''}`}
            className={`grade-btn${value === n ? ' on' : ''}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="grade-anchors">
        <span>{anchors[1]}</span>
        <span>{anchors[10]}</span>
      </div>
    </fieldset>
  )
}

/**
 * Consensus grading, as climbing does it. Two axes because they come apart:
 * a three-hour walk is low demand and high friction; five rounds of seven
 * minutes is the reverse. A single 1–10 would conflate them.
 */
export default function GradeTrial({ trialNum }: GradeTrialProps) {
  const [demand, setDemand] = useState<number | null>(null)
  const [friction, setFriction] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchMyGrade(trialNum)
      .then((g) => {
        if (cancelled || !g) return
        setDemand(g.demand)
        setFriction(g.friction)
        setNote(g.note ?? '')
        setSaved(true)
      })
      .catch(() => {
        /* Grading is optional; a failed read should never block the page. */
      })
    return () => {
      cancelled = true
    }
  }, [trialNum])

  async function submit() {
    if (demand === null || friction === null) return
    setBusy(true)
    setError(null)
    try {
      await gradeTrial(trialNum, demand, friction, note)
      setSaved(true)
      setOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not record the grade.')
    } finally {
      setBusy(false)
    }
  }

  if (saved && !open) {
    return (
      <div className="panel grade-done">
        <div className="spread">
          <div>
            <div className="label">YOUR GRADE — RECORDED</div>
            <div className="mono-num" style={{ fontSize: 15, marginTop: 4 }}>
              DEMAND {demand} · FRICTION {friction}
            </div>
          </div>
          <button type="button" className="btn-link" onClick={() => setOpen(true)}>
            Change it
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="panel grade-panel">
      <div className="label">GRADE THIS TRIAL</div>
      <p className="muted" style={{ fontSize: 12, margin: '6px 0 14px' }}>
        Your grade sets where this sits in the order. It is recorded against your bib and it
        can be changed later.
      </p>

      <Scale
        id="demand"
        label="DEMAND"
        hint="How hard was it, physically?"
        anchors={DEMAND_ANCHORS}
        value={demand}
        onChange={setDemand}
      />
      <Scale
        id="friction"
        label="FRICTION"
        hint="Time, equipment, whether it needed other people or a particular place."
        anchors={FRICTION_ANCHORS}
        value={friction}
        onChange={setFriction}
      />

      <div className="mt-2">
        <label className="label" htmlFor="gnote">Anything Race Control should know (optional)</label>
        <textarea
          id="gnote"
          rows={2}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Unclear instruction, wrong difficulty, anything that went wrong."
        />
        <p className="muted" style={{ fontSize: 11, marginTop: 4 }}>
          Private. Goes to Race Control only, never to other members.
        </p>
      </div>

      {error && <div className="notice mt-2" role="alert">{error}</div>}

      <button
        type="button"
        className="btn btn-primary mt-2"
        onClick={submit}
        disabled={busy || demand === null || friction === null}
      >
        {busy ? 'RECORDING…' : 'RECORD THE GRADE'}
      </button>
    </div>
  )
}
