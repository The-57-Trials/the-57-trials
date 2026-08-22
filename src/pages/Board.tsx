import { useEffect, useMemo, useState } from 'react'
import { fetchLeaderboard } from '../lib/api'
import { useAuth } from '../lib/auth'
import { pad, type LeaderboardRow } from '../lib/types'

function fmtTime(ts: string | null): string {
  if (!ts) return '—'
  const d = new Date(ts)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) +
    ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

type Status = 'loading' | 'ok' | 'error'

export default function Board() {
  const { profile } = useAuth()
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchLeaderboard()
      .then((r) => {
        if (cancelled) return
        setRows(r)
        setStatus('ok')
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Could not load the board.')
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Ranked = active Circuit Pass holders, in order. Unranked members keep their
  // row visible (marked) but hold no rank.
  const { ranked, myRow, myRank } = useMemo(() => {
    const ranked = rows.filter((r) => r.circuit_active)
    const myRow = rows.find((r) => r.is_me) ?? null
    const myRank = myRow ? ranked.findIndex((r) => r.is_me) + 1 : 0
    return { ranked, myRow, myRank }
  }, [rows])

  const top = ranked.slice(0, 20)
  const meOutsideTop = myRow?.circuit_active && myRank > 20

  return (
    <div className="page">
      <div className="label">TIMING BOARD — LIVE STANDINGS</div>
      <h1 className="page-title mb-3">THE BOARD</h1>

      {error && <div className="notice mb-2" role="alert">{error}</div>}

      {myRow && !myRow.circuit_active && (
        <div className="notice mb-3" style={{ fontSize: 12 }} role="status">
          UNRANKED — CIRCUIT PASS REQUIRED. Your clears are logged; a rank needs an active
          Circuit Pass.
        </div>
      )}

      <div className="table-scroll">
      <table className="board-table mono-num">
        <thead>
          <tr>
            <th scope="col">POS</th>
            <th scope="col">BIB</th>
            <th scope="col">RUNNER</th>
            <th scope="col">CLEARED</th>
            <th scope="col">LAST STAMP</th>
          </tr>
        </thead>
        <tbody>
          {status === 'loading' && (
            <tr>
              <td colSpan={5} className="muted center">READING THE TIMING BOARD…</td>
            </tr>
          )}

          {status === 'ok' && top.map((r, i) => (
            <tr key={r.bib_number} className={r.is_me ? 'me' : ''}>
              <td>{i + 1}</td>
              <td>{pad(r.bib_number)}</td>
              <td>{r.display_name}{r.is_me ? ' (YOU)' : ''}</td>
              <td>{r.cleared} / 57</td>
              <td>{fmtTime(r.last_cleared)}</td>
            </tr>
          ))}

          {/* Pinned below the top 20, after an explicit break in the numbering. */}
          {status === 'ok' && meOutsideTop && myRow && (
            <>
              <tr>
                <td colSpan={5} className="muted center" style={{ letterSpacing: '0.4em' }}>⋯</td>
              </tr>
              <tr className="me">
                <td>{myRank}</td>
                <td>{pad(myRow.bib_number)}</td>
                <td>{myRow.display_name} (YOU)</td>
                <td>{myRow.cleared} / 57</td>
                <td>{fmtTime(myRow.last_cleared)}</td>
              </tr>
            </>
          )}

          {/* A member without a Circuit Pass holds no rank but still sees their line. */}
          {status === 'ok' && myRow && !myRow.circuit_active && (
            <tr className="me unranked">
              <td>—</td>
              <td>{pad(myRow.bib_number)}</td>
              <td>{myRow.display_name} (YOU) — UNRANKED</td>
              <td>{myRow.cleared} / 57</td>
              <td>{fmtTime(myRow.last_cleared)}</td>
            </tr>
          )}

          {status === 'ok' && top.length === 0 && (
            <tr>
              <td colSpan={5} className="muted center">
                No ranked runners yet. The board is waiting.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {!profile?.circuit_active && (
        <p className="muted mt-3" style={{ fontSize: 12 }}>
          Only runners with an active Circuit Pass hold a rank.
        </p>
      )}
    </div>
  )
}
