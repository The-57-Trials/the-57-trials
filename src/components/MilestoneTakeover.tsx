import { useMemo } from 'react'
import { pad } from '../lib/types'

interface MilestoneTakeoverProps {
  trialNum: number
  onDismiss: () => void
}

const PALETTE = ['#E8B923', '#C2431C', '#F1ECDD']

/** Full-screen checkpoint moment for milestones 15/30/45/57. Confetti stays on-palette. */
export default function MilestoneTakeover({ trialNum, onDismiss }: MilestoneTakeoverProps) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: `${(i * 2.5 + Math.random() * 2) % 100}%`,
        background: PALETTE[i % PALETTE.length],
        animationDuration: `${2.2 + Math.random() * 2.4}s`,
        animationDelay: `${Math.random() * 0.8}s`,
      })),
    [],
  )

  const finish = trialNum === 57

  return (
    <div className="takeover" onClick={onDismiss}>
      {confetti.map((style, i) => (
        <span key={i} className="confetti-piece" style={style} />
      ))}
      <div className="flag-big" />
      <h2>{finish ? 'RUN COMPLETE' : `CHECKPOINT ${pad(trialNum)} REACHED`}</h2>
      <p className="muted" style={{ maxWidth: 420 }}>
        {finish
          ? 'Fifty-seven lines. Cleared. The final drop is on its way!'
          : 'Milestone logged. Merch is on its way.'}
      </p>
      <button className="btn btn-outline" onClick={onDismiss}>
        {finish ? 'STAND DOWN' : 'BACK TO THE ROUTE'}
      </button>
    </div>
  )
}
