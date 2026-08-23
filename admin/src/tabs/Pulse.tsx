import { useEffect, useState } from 'react'
import { db, gbp, pct, ago, type Pulse } from '../lib/db'

const CIRCUIT = '£9.57'

/** Single series, so no legend and no categorical palette — the label names it. */
function Sparkline({ points, label }: { points: number[]; label: string }) {
  if (points.length < 2) return null
  const w = 560, h = 64
  const max = Math.max(...points, 1)
  const step = w / (points.length - 1)
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)} ${(h - (p / max) * (h - 6) - 3).toFixed(1)}`)
    .join(' ')
  const lx = (points.length - 1) * step
  const ly = h - (points[points.length - 1] / max) * (h - 6) - 3
  return (
    <div className="card">
      <div className="label">{label}</div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="spark" role="img"
           aria-label={`${label}: ${points.length} days`}>
        <path d={d} fill="none" stroke="var(--yellow)" strokeWidth="2"
              vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lx} cy={ly} r="3.5" fill="var(--yellow)" />
      </svg>
    </div>
  )
}

function Tile({ n, k, sub, alert }: { n: string; k: string; sub?: string; alert?: boolean }) {
  return (
    <div className={`tile${alert ? ' alert' : ''}`}>
      <div className="tile-n">{n}</div>
      <div className="tile-k">{k}</div>
      {sub && <div className="tile-s">{sub}</div>}
    </div>
  )
}

export default function PulseTab({ onError }: { onError: (m: string | null) => void }) {
  const [d, setD] = useState<Pulse | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      // PostgrestBuilder is only PromiseLike, so it needs awaiting rather than
      // a .catch() chain.
      const { data, error } = await db.rpc('admin_pulse')
      if (cancelled) return
      if (error) onError(error.message)
      else setD(data as Pulse)
    }
    load()
    return () => { cancelled = true }
  }, [onError])

  if (!d) return <p className="muted" role="status">READING THE PULSE…</p>
  const f = d.funnel

  return (
    <div className="stack">
      <div className="hero">
        <div className="label">MONTHLY RECURRING REVENUE</div>
        <div className="hero-n">{gbp(d.revenue.mrr_pence)}</div>
        <div className="muted sm">
          {f.circuit_active} active Circuit {f.circuit_active === 1 ? 'Pass' : 'Passes'} × {CIRCUIT}
          &nbsp;·&nbsp; {gbp(d.revenue.entry_gross_pence)} entry fees banked (one-off, not recurring)
        </div>
      </div>

      <Sparkline points={d.history.map((h) => h.mrr_pence)} label="MRR, LAST 90 DAYS" />

      <div className="label">THE FUNNEL</div>
      <div className="tiles">
        <Tile n={String(f.signups)} k="SIGNED UP" sub={`${d.recent.signups_7d} in last 7d`} />
        <Tile n={String(f.entry_paid)} k="PAID THE ENTRY" sub={`${pct(f.entry_paid, f.signups)} of signups`} />
        <Tile n={String(f.circuit_active)} k="ON THE CIRCUIT" sub={`${pct(f.circuit_active, f.entry_paid)} of paid`} />
        <Tile n={String(d.progress.stuck_at_six)} k="STALLED AT 06"
              sub="cleared 5, no Circuit Pass" alert={d.progress.stuck_at_six > 0} />
      </div>

      <div className="label">PROGRESS</div>
      <div className="tiles">
        <Tile n={String(d.progress.started)} k="STARTED" sub="cleared at least one" />
        <Tile n={String(d.progress.avg_cleared)} k="AVG CLEARED" sub="per runner who started" />
        <Tile n={String(d.progress.total_completions)} k="TOTAL CLEARS" sub={`${d.recent.clears_7d} in last 7d`} />
        <Tile n={String(d.progress.finishers)} k="FINISHERS" sub="all 57 cleared" />
      </div>

      <div className="label">MERCH OBLIGATION</div>
      <div className="tiles">
        <Tile n={String(d.merch.unshipped)} k="AWAITING POST" sub="milestones owed"
              alert={d.merch.unshipped > 0} />
        <Tile n={String(d.merch.total)} k="TOTAL EARNED" sub="all time" />
        <Tile n={ago(d.recent.last_signup)} k="LAST SIGNUP" />
        <Tile n={ago(d.recent.last_clear)} k="LAST CLEAR" />
      </div>

      <p className="muted sm">
        Live as of {new Date(d.as_of).toLocaleString('en-GB')}. History is snapshotted daily at
        02:05 — change over time cannot be recomputed after the fact.
      </p>
    </div>
  )
}
