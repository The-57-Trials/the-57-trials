import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyBlazerStatus, redeemBlazerCode } from '../lib/api'

/**
 * Shown on the "run complete" screen. The card mailed with the Trial
 * Blazer hoodie carries a QR code that only reveals its 4-digit number
 * once Trial 57 is cleared — this is where that number gets typed in.
 */
export default function BlazerRedeem() {
  const [status, setStatus] = useState<'loading' | 'none' | 'unredeemed' | 'redeemed'>('loading')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchMyBlazerStatus()
      .then((s) => {
        if (cancelled) return
        setStatus(!s.has_card ? 'none' : s.redeemed ? 'redeemed' : 'unredeemed')
      })
      .catch(() => !cancelled && setStatus('none'))
    return () => {
      cancelled = true
    }
  }, [])

  async function submit() {
    if (code.trim().length !== 4) return
    setBusy(true)
    setError(null)
    try {
      await redeemBlazerCode(code)
      setStatus('redeemed')
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      setError(
        msg.includes('WRONG_CODE') ? "That's not it. Check the card again."
        : 'Could not redeem that code.',
      )
    } finally {
      setBusy(false)
    }
  }

  if (status === 'loading' || status === 'none') return null

  if (status === 'unredeemed') {
    return (
      <div className="panel mt-3 witness-panel">
        <div className="label mb-1">DO YOU STILL HAVE THE CARD?</div>
        <p className="muted" style={{ fontSize: 12 }}>
          Scan the QR code on the back. It will show you a number now. Type it in below.
        </p>
        <div className="row mt-2" style={{ gap: 12 }}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            inputMode="numeric"
            placeholder="0000"
            className="mono-num"
            style={{ maxWidth: 100, textAlign: 'center', fontSize: 20, letterSpacing: '0.2em' }}
          />
          <button type="button" className="btn btn-outline" onClick={submit} disabled={busy || code.length !== 4}>
            {busy ? 'CHECKING…' : 'UNLOCK'}
          </button>
        </div>
        {error && <div className="notice mt-2" role="alert">{error}</div>}
      </div>
    )
  }

  return (
    <div className="panel mt-3" style={{ borderColor: 'var(--yellow)' }}>
      <div className="label mb-1">THE TRIAL BLAZER SERIES IS OPEN</div>
      <Link to="/library" className="btn-link">See it in your Library →</Link>
    </div>
  )
}
