import { useEffect, useState } from 'react'
import { fetchRegister, fetchFinisherRegister } from '../lib/api'
import { pad, type LeaderboardRow } from '../lib/types'

type Status = 'loading' | 'ok' | 'error'

interface FinisherRow {
  finisher_number: number
  bib_number: number
  display_name: string
  finished_at: string
}

/**
 * THE REGISTER (doc 16.3) — replaces the ranked leaderboard D8 killed on
 * 23 Aug. Bib-number order, never progress order. No rank column, no times,
 * no sorting controls. parkrun publishes everything and insists it is not
 * a race; that is the reference.
 */
export default function Register() {
  const [field, setField] = useState<LeaderboardRow[]>([])
  const [finished, setFinished] = useState<FinisherRow[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchRegister(), fetchFinisherRegister()])
      .then(([f, done]) => {
        if (cancelled) return
        setField(f)
        setFinished(done)
        setStatus('ok')
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Could not load the Register.')
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page">
      <div className="label">BIB-NUMBER ORDER — NOT A RACE</div>
      <h1 className="page-title mb-3">THE REGISTER</h1>

      {error && <div className="notice mb-2" role="alert">{error}</div>}

      <section className="mb-4">
        <h2 className="chapter-heading-sm">THE FIELD</h2>
        <div className="table-scroll">
          <table className="board-table mono-num">
            <thead>
              <tr>
                <th scope="col">BIB</th>
                <th scope="col">RUNNER</th>
                <th scope="col">CLEARED</th>
              </tr>
            </thead>
            <tbody>
              {status === 'loading' && (
                <tr><td colSpan={3} className="muted center">READING THE REGISTER…</td></tr>
              )}
              {status === 'ok' && field.map((r) => (
                <tr key={r.bib_number} className={r.is_me ? 'me' : ''}>
                  <td>{pad(r.bib_number)}</td>
                  <td>{r.display_name}{r.is_me ? ' (YOU)' : ''}</td>
                  <td>{r.cleared} / 57</td>
                </tr>
              ))}
              {status === 'ok' && field.length === 0 && (
                <tr><td colSpan={3} className="muted center">No runners yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="chapter-heading-sm">THE FINISHED</h2>
        <div className="table-scroll">
          <table className="board-table mono-num">
            <thead>
              <tr>
                <th scope="col">FINISHER</th>
                <th scope="col">BIB</th>
                <th scope="col">RUNNER</th>
                <th scope="col">FINISHED</th>
              </tr>
            </thead>
            <tbody>
              {status === 'ok' && finished.map((r) => (
                <tr key={r.finisher_number}>
                  <td>No. {String(r.finisher_number).padStart(3, '0')}</td>
                  <td>{pad(r.bib_number)}</td>
                  <td>{r.display_name}</td>
                  <td>
                    {new Date(r.finished_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {status === 'ok' && finished.length === 0 && (
                <tr><td colSpan={4} className="muted center">No one has finished yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
