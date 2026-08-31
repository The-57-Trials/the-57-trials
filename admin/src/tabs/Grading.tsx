import { useEffect, useMemo, useState } from 'react'
import { db, pad } from '../lib/db'

interface Row {
  num: number
  title: string
  chapter: string
  published_demand: number | null
  published_friction: number | null
  n_grades: number | null
  avg_demand: number | null
  avg_friction: number | null
  sd_demand: number | null
  weight: number | null
  n_cleared: number | null
}

export default function GradingTab({ onError }: { onError: (m: string | null) => void }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [view, setView] = useState<'order' | 'proposed'>('order')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error } = await db.rpc('admin_grading')
      if (cancelled) return
      if (error) {
        onError(error.message)
        return
      }
      setRows((data ?? []) as Row[])
    })()
    return () => {
      cancelled = true
    }
  }, [onError])

  const graded = useMemo(() => (rows ?? []).filter((r) => (r.n_grades ?? 0) > 0), [rows])

  /**
   * The reorder: sort the graded trials by weight and show where each would
   * move to. Deliberately a proposal, not an action — chapter themes and the
   * Primes rule are editorial and cannot be derived from a number.
   */
  const proposed = useMemo(() => {
    const sorted = [...graded].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0))
    return sorted.map((r, i) => ({ ...r, proposedNum: i + 1, delta: i + 1 - r.num }))
  }, [graded])

  if (!rows) return <div className="muted">READING THE GRADES…</div>

  const coverage = graded.length
  const totalGrades = graded.reduce((s, r) => s + (r.n_grades ?? 0), 0)

  return (
    <div className="stack">
      <div className="tiles">
        <div className="tile">
          <div className="tile-n mono-num">{coverage} / 57</div>
          <div className="tile-k">TRIALS WITH GRADES</div>
        </div>
        <div className="tile">
          <div className="tile-n mono-num">{totalGrades}</div>
          <div className="tile-k">GRADES RECORDED</div>
        </div>
        <div className="tile">
          <div className="tile-n mono-num">
            {coverage ? (totalGrades / coverage).toFixed(1) : '—'}
          </div>
          <div className="tile-k">AVG PER TRIAL</div>
        </div>
        <div className="tile">
          <div className="tile-n mono-num">
            {rows.filter((r) => r.published_demand !== null).length}
          </div>
          <div className="tile-k">PUBLISHED</div>
        </div>
      </div>

      {coverage < 57 && (
        <div className="notice" role="status">
          {57 - coverage} trials have no grades yet. The proposed order only ranks trials that
          have been graded — treat it as provisional until coverage is complete.
        </div>
      )}

      <div className="row">
        <button
          className={`btn ${view === 'order' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setView('order')}
        >
          BY CURRENT ORDER
        </button>
        <button
          className={`btn ${view === 'proposed' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setView('proposed')}
        >
          PROPOSED REORDER
        </button>
      </div>

      {view === 'order' ? (
        <div className="table-scroll">
          <table className="board-table mono-num">
            <thead>
              <tr>
                <th scope="col">NO.</th>
                <th scope="col">TITLE</th>
                <th scope="col">GRADES</th>
                <th scope="col">DEMAND</th>
                <th scope="col">FRICTION</th>
                <th scope="col">SPREAD</th>
                <th scope="col">WEIGHT</th>
                <th scope="col">CLEARED</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.num}>
                  <td>{pad(r.num)}</td>
                  <td style={{ fontVariantNumeric: 'normal' }}>{r.title}</td>
                  <td>{r.n_grades ?? '—'}</td>
                  <td>{r.avg_demand ?? '—'}</td>
                  <td>{r.avg_friction ?? '—'}</td>
                  {/* High spread means the cohort disagrees — worth reading the notes. */}
                  <td className={(r.sd_demand ?? 0) >= 2.5 ? 'flag' : ''}>
                    {r.sd_demand ?? '—'}
                  </td>
                  <td>{r.weight ?? '—'}</td>
                  <td>{r.n_cleared ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="board-table mono-num">
            <thead>
              <tr>
                <th scope="col">WOULD BE</th>
                <th scope="col">IS NOW</th>
                <th scope="col">MOVE</th>
                <th scope="col">TITLE</th>
                <th scope="col">WEIGHT</th>
              </tr>
            </thead>
            <tbody>
              {proposed.map((r) => (
                <tr key={r.num}>
                  <td>{pad(r.proposedNum)}</td>
                  <td>{pad(r.num)}</td>
                  <td className={Math.abs(r.delta) >= 5 ? 'flag' : ''}>
                    {r.delta === 0 ? '—' : r.delta > 0 ? `↓ ${r.delta}` : `↑ ${-r.delta}`}
                  </td>
                  <td style={{ fontVariantNumeric: 'normal' }}>{r.title}</td>
                  <td>{r.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="muted" style={{ fontSize: 11 }}>
        Weight is demand × 0.65 + friction × 0.35 — the sequence is a difficulty curve, and
        friction is a scheduling problem rather than a hard one. The reorder is a proposal
        only: chapter themes and the Primes rule are editorial and cannot be derived from a
        number. Notes attached to grades are private and readable in the database.
      </p>
    </div>
  )
}
