import { useEffect, useState } from 'react'
import { fetchPulse, type Pulse as PulseData } from '../lib/api'

const gbp = (pence: number) =>
  '£' + (pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const pct = (n: number, d: number) => (d === 0 ? '—' : `${Math.round((n / d) * 100)}%`)

function ago(ts: string | null): string {
  if (!ts) return 'never'
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
  return `${Math.floor(mins / 1440)}d ago`
}

/** Single series, so no legend and no categorical palette — the label names it. */
function Sparkline({ points, label }: { points: number[]; label: string }) {
  if (points.length < 2) return null
  const w = 560
  const h = 64
  const max = Math.max(...points, 1)
  const step = w / (points.length - 1)
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)} ${(h - (p / max) * (h - 6) - 3).toFixed(1)}`)
    .join(' ')
  const lastX = (points.length - 1) * step
  const lastY = h - (points[points.length - 1] / max) * (h - 6) - 3

  return (
    <div className="spark-wrap">
      <div className="label">{label}</div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="spark" role="img"
           aria-label={`${label}: ${points.length} days, latest ${points[points.length - 1]}`}>
        <path d={d} fill="none" stroke="var(--yellow)" strokeWidth="2"
              vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lastX} cy={lastY} r="3.5" fill="var(--yellow)" />
      </svg>
    </div>
  )
}

function Tile({ n, k, sub, alert }: { n: string; k: string; sub?: string; alert?: boolean }) {
  return (
    <div className={`tile${alert ? ' tile-alert' : ''}`}>
      <div className="tile-n mono-num">{n}</div>
      <div className="tile-k">{k}</div>
      {sub && <div className="tile-sub">{sub}</div>}
    </div>
  )
}

export default function Pulse() {
  const [data, setData] = useState<PulseData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPulse()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load the pulse.'))
  }, [])

  if (error) return <div className="notice" role="alert">{error}</div>
  if (!data) return <div className="muted" role="status">READING THE PULSE…</div>

  const f = data.funnel
  const mrrHistory = data.history.map((h) => h.mrr_pence)

  return (
    <div className="stack">
      {/* The one number that says whether this is a business yet. */}
      <div className="hero-stat">
        <div className="label">MONTHLY RECURRING REVENUE</div>
        <div className="hero-n mono-num">{gbp(data.revenue.mrr_pence)}</div>
        <div className="muted" style={{ fontSize: 12 }}>
          {f.circuit_active} active Circuit {f.circuit_active === 1 ? 'Pass' : 'Passes'} × £4.99
          &nbsp;·&nbsp; {gbp(data.revenue.entry_gross_pence)} entry fees banked (one-off, not recurring)
        </div>
      </div>

      <Sparkline points={mrrHistory} label="MRR, LAST 90 DAYS" />

      <div>
        <div className="label mb-2">THE FUNNEL</div>
        <div className="tiles">
          <Tile n={String(f.signups)} k="SIGNED UP" sub={`${data.recent.signups_7d} in last 7d`} />
          <Tile n={String(f.entry_paid)} k="PAID THE ENTRY" sub={`${pct(f.entry_paid, f.signups)} of signups`} />
          <Tile n={String(f.circuit_active)} k="ON THE CIRCUIT" sub={`${pct(f.circuit_active, f.entry_paid)} of paid`} />
          <Tile
            n={String(data.progress.stuck_at_six)}
            k="STALLED AT 06"
            sub="cleared 5, no Circuit Pass"
            alert={data.progress.stuck_at_six > 0}
          />
        </div>
      </div>

      <div>
        <div className="label mb-2">PROGRESS</div>
        <div className="tiles">
          <Tile n={String(data.progress.started)} k="STARTED" sub="cleared at least one" />
          <Tile n={String(data.progress.avg_cleared)} k="AVG CLEARED" sub="per runner who started" />
          <Tile n={String(data.progress.total_completions)} k="TOTAL CLEARS" sub={`${data.recent.clears_7d} in last 7d`} />
          <Tile n={String(data.progress.finishers)} k="FINISHERS" sub="all 57 cleared" />
        </div>
      </div>

      <div>
        <div className="label mb-2">MERCH OBLIGATION</div>
        <div className="tiles">
          <Tile
            n={String(data.merch.unshipped)}
            k="AWAITING POST"
            sub="milestones owed"
            alert={data.merch.unshipped > 0}
          />
          <Tile n={String(data.merch.total)} k="TOTAL EARNED" sub="all time" />
          <Tile n={ago(data.recent.last_signup)} k="LAST SIGNUP" />
          <Tile n={ago(data.recent.last_clear)} k="LAST CLEAR" />
        </div>
      </div>

      <p className="muted" style={{ fontSize: 11 }}>
        Live as of {new Date(data.as_of).toLocaleString('en-GB')}. History is snapshotted daily at
        02:05 — churn and growth need yesterday's numbers, which can't be recomputed after the fact.
      </p>
    </div>
  )
}
