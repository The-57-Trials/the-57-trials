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

export default function Board() {
  const { session, profile } = useAuth()
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard().then(setRows).catch((e) => setError(e.message))
  }, [])

  // Ranked = active Circuit Pass holders, in order. Unranked members keep their
  // row visible (marked) but hold no rank.
  const { ranked, myRow, myRank } = useMemo(() => {
    const ranked = rows.filter((r) => r.circuit_active)
    const myRow = session ? rows.find((r) => r.id === session.user.id) ?? null : null
    const myRank = myRow ? ranked.findIndex((r) => r.id === myRow.id) + 1 : 0
    return { ranked, myRow, myRank }
  }, [rows, session])

  const top = ranked.slice(0, 20)
  const meOutsideTop = myRow && myRank > 20

  return (
    <div className="page">
      <div className="label">TIMING BOARD — LIVE STANDINGS</div>
      <h1 style={{ fontSize: 44 }} className="mb-3">THE BOARD</h1>

      {error && <div className="notice mb-2">{error}</div>}

      {myRow && !myRow.circuit_active && (
        <div className="notice mb-3" style={{ fontSize: 12 }}>
          UNRANKED — CIRCUIT PASS REQUIRED. Your clears are logged; a rank needs an active
          Circuit Pass.
        </div>
      )}

      <div className="table-scroll">
      <table className="board-table mono-num">
        <thead>
          <tr>
            <th>POS</th>
            <th>BIB</th>
            <th>RUNNER</th>
            <th>CLEARED</th>
            <th>LAST STAMP</th>
          </tr>
        </thead>
        <tbody>
          {/* Pinned mini-row when the viewer sits outside the top 20 */}
          {meOutsideTop && myRow && (
            <tr className="me">
              <td>{myRank}</td>
              <td>{pad(myRow.bib_number)}</td>
              <td>{myRow.display_name} (YOU)</td>
              <td>{myRow.cleared} / 57</td>
              <td>{fmtTime(myRow.last_cleared)}</td>
            </tr>
          )}
          {top.map((r, i) => (
            <tr key={r.id} className={session && r.id === session.user.id ? 'me' : ''}>
              <td>{i + 1}</td>
              <td>{pad(r.bib_number)}</td>
              <td>{r.display_name}{session && r.id === session.user.id ? ' (YOU)' : ''}</td>
              <td>{r.cleared} / 57</td>
              <td>{fmtTime(r.last_cleared)}</td>
            </tr>
          ))}
          {/* Viewer without a Circuit Pass: show their row unranked at the bottom */}
          {myRow && !myRow.circuit_active && (
            <tr className="me unranked">
              <td>—</td>
              <td>{pad(myRow.bib_number)}</td>
              <td>{myRow.display_name} (YOU) — UNRANKED</td>
              <td>{myRow.cleared} / 57</td>
              <td>{fmtTime(myRow.last_cleared)}</td>
            </tr>
          )}
          {top.length === 0 && (
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
