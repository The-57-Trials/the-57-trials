import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'signin' | 'signup'>(
    params.get('mode') === 'signup' ? 'signup' : 'signin',
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName.trim() || email.split('@')[0] } },
        })
        if (error) throw error
        if (data.session) navigate('/run')
        else setInfo('Check your inbox to confirm your email, then sign in.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/run')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 460 }}>
      <h1 style={{ fontSize: 44 }}>
        {mode === 'signup' ? 'START YOUR RUN' : 'BACK ON THE LINE'}
      </h1>
      <p className="muted mb-3" style={{ fontSize: 13 }}>
        {mode === 'signup'
          ? 'Sign up, claim your bib, pay the entry. In that order.'
          : 'Sign in to pick up where you left off.'}
      </p>

      <form onSubmit={submit} className="stack">
        {mode === 'signup' && (
          <div>
            <label className="label" htmlFor="dn">Runner name (shown on the board)</label>
            <input
              id="dn"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={40}
              placeholder="e.g. ROB J"
            />
          </div>
        )}
        <div>
          <label className="label" htmlFor="em">Email</label>
          <input
            id="em"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label" htmlFor="pw">Password</label>
          <input
            id="pw"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
        </div>

        {error && <div className="notice">{error}</div>}
        {info && <div className="notice notice-yellow">{info}</div>}

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'WORKING…' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'}
        </button>
      </form>

      <p className="muted mt-3" style={{ fontSize: 13 }}>
        {mode === 'signup' ? 'Already have a bib?' : 'No bib yet?'}{' '}
        <a
          href="#toggle"
          onClick={(e) => {
            e.preventDefault()
            setMode(mode === 'signup' ? 'signin' : 'signup')
            setError(null)
            setInfo(null)
          }}
        >
          {mode === 'signup' ? 'Sign in' : 'Sign up'}
        </a>
      </p>
    </div>
  )
}
