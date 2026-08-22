import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type Phase = 'checking' | 'ready' | 'invalid' | 'done'

/** Supabase returns the recovery grant in the hash, or an error describing why not. */
function readLinkState(): { hasToken: boolean; errorText: string | null } {
  const hash = window.location.hash.replace(/^#/, '')
  const search = window.location.search.replace(/^\?/, '')
  const params = new URLSearchParams(hash || search)
  const err = params.get('error_description') ?? params.get('error')
  return {
    hasToken:
      params.has('access_token') || params.has('code') || params.get('type') === 'recovery',
    errorText: err ? decodeURIComponent(err.replace(/\+/g, ' ')) : null,
  }
}

export default function ResetPassword() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [linkError, setLinkError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Decided by what the link actually carries, never by a wall-clock guess —
  // a slow connection must not be reported as an expired link.
  useEffect(() => {
    const { hasToken, errorText } = readLinkState()

    if (errorText) {
      setLinkError(errorText)
      setPhase('invalid')
      return
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setPhase('ready')
    })

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setPhase('ready')
      else if (!hasToken) setPhase('invalid')
      // A token is present but unprocessed: stay in 'checking' and let the
      // auth listener above resolve it, however long that takes.
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Both entries must match.')
      return
    }
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    setPhase('done')
  }

  if (phase === 'checking') {
    return (
      <div className="page center muted" role="status" aria-live="polite">
        CHECKING YOUR LINK…
      </div>
    )
  }

  if (phase === 'invalid') {
    return (
      <div className="page" style={{ maxWidth: 460 }}>
        <h1 className="page-title">THAT LINK WON'T OPEN</h1>
        <p className="muted mt-2">
          {linkError ?? 'Reset links last one hour and work once. Request a fresh one.'}
        </p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/forgot')}>
          REQUEST A NEW LINK
        </button>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="page" style={{ maxWidth: 460 }}>
        <h1 className="page-title">PASSWORD SET</h1>
        <p className="muted mt-2">You're signed in. Your run is exactly where you left it.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/run')}>
          BACK TO YOUR RUN
        </button>
      </div>
    )
  }

  return (
    <div className="page" style={{ maxWidth: 460 }}>
      <h1 className="page-title">SET A NEW PASSWORD</h1>
      <p className="muted mt-2 mb-3" style={{ fontSize: 13 }}>
        Eight characters minimum. Make it one you'll keep.
      </p>

      <form onSubmit={submit} className="stack">
        <div>
          <label className="label" htmlFor="pw">New password</label>
          <input
            id="pw"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="pw2">Confirm it</label>
          <input
            id="pw2"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        {error && <div className="notice" role="alert">{error}</div>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'SAVING…' : 'SET PASSWORD'}
        </button>
      </form>
    </div>
  )
}
