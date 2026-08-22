import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type Phase = 'checking' | 'ready' | 'invalid' | 'done'

export default function ResetPassword() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Supabase turns the emailed link into a recovery session. That may already
  // be restored by the time this mounts, or land moments later as a
  // PASSWORD_RECOVERY event, so both paths are handled.
  useEffect(() => {
    let settled = false

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        settled = true
        setPhase('ready')
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        settled = true
        setPhase('ready')
      } else {
        // Give the SDK a moment to parse the token out of the URL.
        setTimeout(() => {
          if (!settled) setPhase('invalid')
        }, 2500)
      }
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
    return <div className="page center muted">CHECKING YOUR LINK…</div>
  }

  if (phase === 'invalid') {
    return (
      <div className="page" style={{ maxWidth: 460 }}>
        <h1 style={{ fontSize: 40 }}>THAT LINK IS SPENT</h1>
        <p className="muted mt-2">
          Reset links last one hour and work once. Request a fresh one.
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
        <h1 style={{ fontSize: 40 }}>PASSWORD SET</h1>
        <p className="muted mt-2">You're signed in. Your run is exactly where you left it.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/run')}>
          BACK TO YOUR RUN
        </button>
      </div>
    )
  }

  return (
    <div className="page" style={{ maxWidth: 460 }}>
      <h1 style={{ fontSize: 40 }}>SET A NEW PASSWORD</h1>
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
        {error && <div className="notice">{error}</div>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'SAVING…' : 'SET PASSWORD'}
        </button>
      </form>
    </div>
  )
}
