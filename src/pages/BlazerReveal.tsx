import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchBlazerReveal } from '../lib/api'

type Status = 'loading' | 'sealed' | 'revealed' | 'error'

/**
 * The card in your hand, scanned. Public — no session required, since
 * whoever scans this almost certainly isn't logged in on this device.
 * The number is not sent to the browser at all until Trial 57 is cleared
 * (get_blazer_reveal enforces that server-side) — this page only ever
 * renders what the RPC already decided to hand over.
 */
export default function BlazerReveal() {
  const { token } = useParams()
  const [status, setStatus] = useState<Status>('loading')
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    fetchBlazerReveal(token)
      .then((r) => {
        if (cancelled) return
        if (r.revealed && r.code) {
          setCode(r.code)
          setStatus('revealed')
        } else {
          setStatus('sealed')
        }
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div className="page center" style={{ maxWidth: 480, textAlign: 'center' }}>
      <div className="label">THE 57 TRIALS</div>
      <h1 className="page-title mb-3">TRIAL BLAZER</h1>

      {status === 'loading' && <p className="muted" role="status">READING THE CARD…</p>}

      {status === 'error' && (
        <p className="muted">This card doesn't match anything here. If you think that's wrong, contact us.</p>
      )}

      {(status === 'sealed' || status === 'revealed') && (
        <>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Congratulations on Trial 45. That's further than most people ever ask of
            themselves — a quiet, unwitnessed kind of hard, done on your own time, for no
            audience.
          </p>
          <p className="muted mt-2" style={{ fontSize: 13 }}>
            There's more of this run left, and what comes after it is not written down
            anywhere you can read yet.
          </p>

          <div className="blazer-code-well mt-4">
            {status === 'revealed' && code ? (
              <div className="blazer-code mono-num">{code}</div>
            ) : (
              <div className="blazer-code blazer-code-sealed mono-num" aria-hidden="true">
                • • • •
              </div>
            )}
          </div>

          <p className="muted mt-3" style={{ fontSize: 12 }}>
            {status === 'revealed'
              ? 'Type this into your dashboard once you’ve finished all 57.'
              : 'This means nothing yet. It will, once you’ve finished all 57.'}
          </p>
        </>
      )}
    </div>
  )
}
