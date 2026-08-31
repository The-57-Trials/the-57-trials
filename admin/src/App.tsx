import { useEffect, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { db } from './lib/db'
import PulseTab from './tabs/Pulse'
import TrialsTab from './tabs/Trials'
import MembersTab from './tabs/Members'
import MerchTab from './tabs/Merch'
import GradingTab from './tabs/Grading'

type Tab = 'pulse' | 'grading' | 'trials' | 'members' | 'merch'
type Gate = 'checking' | 'signed-out' | 'not-admin' | 'ok'

export default function App() {
  const [gate, setGate] = useState<Gate>('checking')
  const [session, setSession] = useState<Session | null>(null)
  const [tab, setTab] = useState<Tab>('pulse')
  const [error, setError] = useState<string | null>(null)

  // The gate is a courtesy, not the security boundary. Every query behind it is
  // independently checked by is_admin() inside Postgres, so a forced render
  // yields empty tables rather than data.
  useEffect(() => {
    async function check(s: Session | null) {
      setSession(s)
      if (!s) return setGate('signed-out')
      const { data, error } = await db
        .from('profiles')
        .select('role')
        .eq('id', s.user.id)
        .maybeSingle()
      if (error) {
        setError(error.message)
        return setGate('not-admin')
      }
      setGate(data?.role === 'admin' ? 'ok' : 'not-admin')
    }
    db.auth.getSession().then(({ data }) => check(data.session))
    const { data: sub } = db.auth.onAuthStateChange((_e, s) => check(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (gate === 'checking') return <div className="shell center muted">CHECKING CREDENTIALS…</div>

  if (gate === 'signed-out') return <SignIn onError={setError} error={error} />

  if (gate === 'not-admin') {
    return (
      <div className="shell center stack" style={{ maxWidth: 420 }}>
        <h1>NOT RACE CONTROL</h1>
        <p className="muted">
          This account has no control access. {error}
        </p>
        <button className="btn btn-outline" onClick={() => db.auth.signOut()}>
          SIGN OUT
        </button>
      </div>
    )
  }

  return (
    <div className="shell">
      <header className="top">
        <div>
          <div className="label">THE 57 TRIALS</div>
          <h1>RACE CONTROL</h1>
        </div>
        <div className="row">
          <span className="label">{session?.user.email}</span>
          <button className="btn btn-outline sm" onClick={() => db.auth.signOut()}>
            SIGN OUT
          </button>
        </div>
      </header>

      <nav className="tabs">
        {(['pulse', 'grading', 'trials', 'members', 'merch'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTab(t)}
          >
            {t === 'merch' ? 'MERCH QUEUE' : t === 'pulse' ? 'THE PULSE' : t.toUpperCase()}
          </button>
        ))}
      </nav>

      {error && <div className="notice" role="alert">{error}</div>}

      <main>
        {tab === 'pulse' && <PulseTab onError={setError} />}
        {tab === 'grading' && <GradingTab onError={setError} />}
        {tab === 'trials' && <TrialsTab onError={setError} />}
        {tab === 'members' && <MembersTab onError={setError} />}
        {tab === 'merch' && <MerchTab onError={setError} />}
      </main>
    </div>
  )
}

function SignIn({ error, onError }: { error: string | null; onError: (m: string | null) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    onError(null)
    const { error } = await db.auth.signInWithPassword({ email, password })
    if (error) onError(error.message)
    setBusy(false)
  }

  return (
    <div className="shell center" style={{ maxWidth: 380 }}>
      <form onSubmit={submit} className="stack">
        <div className="label">THE 57 TRIALS</div>
        <h1>RACE CONTROL</h1>
        <div>
          <label className="label" htmlFor="em">Email</label>
          <input id="em" type="email" required value={email}
                 autoComplete="username"
                 onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="pw">Password</label>
          <input id="pw" type="password" required value={password}
                 autoComplete="current-password"
                 onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="notice" role="alert">{error}</div>}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'CHECKING…' : 'SIGN IN'}
        </button>
      </form>
    </div>
  )
}
