import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset`,
    })
    setBusy(false)
    // Always report success: telling an unauthenticated visitor whether an
    // address exists would leak the membership list.
    if (error && !/rate/i.test(error.message)) {
      setSent(true)
    } else if (error) {
      setError('Too many attempts. Wait a few minutes and try again.')
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="page" style={{ maxWidth: 460 }}>
        <h1 style={{ fontSize: 40 }}>CHECK YOUR INBOX</h1>
        <p className="muted mt-2">
          If an account exists for {email.trim()}, a reset link is on its way. The link is
          good for one hour.
        </p>
        <p className="muted mt-2" style={{ fontSize: 13 }}>
          Nothing arrived? Check spam, then try again — the address has to match the one you
          signed up with.
        </p>
        <Link to="/login" className="btn btn-outline mt-3">
          BACK TO SIGN IN
        </Link>
      </div>
    )
  }

  return (
    <div className="page" style={{ maxWidth: 460 }}>
      <h1 style={{ fontSize: 40 }}>LOST YOUR WAY IN</h1>
      <p className="muted mt-2 mb-3" style={{ fontSize: 13 }}>
        Your bib and every cleared line are safe. Enter your email and we'll send a link to
        set a new password.
      </p>

      <form onSubmit={submit} className="stack">
        <div>
          <label className="label" htmlFor="em">Email</label>
          <input
            id="em"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <div className="notice">{error}</div>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'SENDING…' : 'SEND RESET LINK'}
        </button>
      </form>

      <p className="muted mt-3" style={{ fontSize: 13 }}>
        Remembered it? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}
