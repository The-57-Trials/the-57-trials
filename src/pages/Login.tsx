import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SCREENING_VERSION } from './legal/Disclaimer'

const WAIVER_VERSION = '1.0'
const TERMS_VERSION = '1.0'

export default function Login() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'signin' | 'signup'>(
    params.get('mode') === 'signup' ? 'signup' : 'signin',
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [health, setHealth] = useState(false)
  const [waiver, setWaiver] = useState(false)
  const [terms, setTerms] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const consentsGiven = health && waiver && terms

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    try {
      if (mode === 'signup') {
        if (!consentsGiven) {
          setError('All three confirmations are required before you can start.')
          setBusy(false)
          return
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/run`,
            // Recorded server-side by the signup trigger into an append-only
            // consents table — this is the evidence the waiver was given.
            data: {
              display_name: displayName.trim() || email.split('@')[0],
              health_version: SCREENING_VERSION,
              health_confirmed: true,
              waiver_version: WAIVER_VERSION,
              waiver_accepted: true,
              terms_version: TERMS_VERSION,
              terms_accepted: true,
              marketing_optin: marketing,
            },
          },
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
    <div className="page" style={{ maxWidth: 520 }}>
      <h1 className="page-title">
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
            <label className="label" htmlFor="dn">Runner name (public on the board)</label>
            <input
              id="dn"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={40}
              placeholder="e.g. ROB J"
            />
            <p className="muted mt-1" style={{ fontSize: 11 }}>
              Other members see this. Don't use your full real name unless you want them to.
            </p>
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

        {mode === 'signup' && (
          /* Three separate, unticked confirmations. Bundling them would break
             the reg 37 waiver and the Article 9 explicit-consent requirement. */
          <fieldset className="consents">
            <legend className="label">BEFORE YOU START</legend>

            <label className="consent">
              <input
                type="checkbox"
                checked={health}
                onChange={(e) => setHealth(e.target.checked)}
              />
              <span>
                I am 18 or over. I have read the{' '}
                <Link to="/disclaimer" target="_blank">Health &amp; Safety Disclaimer</Link> in
                full, including the readiness questions. Either none of them apply to me, or one
                does and I have obtained clearance from a doctor. I understand the trials are
                physical, that I take part unsupervised and at my own risk, and that I decide
                what is safe for me and when to stop.
                <em>
                  We record only that you confirmed — never your answers.{' '}
                  <strong>
                    This does not remove our liability for injury caused by our negligence; that
                    cannot be excluded by law.
                  </strong>
                </em>
              </span>
            </label>

            <label className="consent">
              <input
                type="checkbox"
                checked={waiver}
                onChange={(e) => setWaiver(e.target.checked)}
              />
              <span>
                I want access to my trials straight away, and I understand that once access is
                given I lose my 14-day right to cancel the digital content I have received.
                <em>
                  Doesn't affect cancelling your Circuit Pass any time, the pro-rata refund on
                  your first month, or your rights if anything is faulty. See{' '}
                  <Link to="/refunds" target="_blank">Cancellation &amp; Refunds</Link>.
                </em>
              </span>
            </label>

            <label className="consent">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <span>
                I agree to the <Link to="/terms" target="_blank">Terms of Service</Link> and I
                have read the <Link to="/privacy" target="_blank">Privacy Policy</Link>.
              </span>
            </label>

            <label className="consent optional">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <span>
                Optional — email me when new briefings drop.
                <em>Unsubscribe any time. Never affects your access.</em>
              </span>
            </label>
          </fieldset>
        )}

        {error && <div className="notice" role="alert">{error}</div>}
        {info && <div className="notice notice-yellow" role="status">{info}</div>}

        <button
          className="btn btn-primary btn-block"
          disabled={busy || (mode === 'signup' && !consentsGiven)}
        >
          {busy ? 'WORKING…' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'}
        </button>

        {mode === 'signup' && (
          <p className="muted" style={{ fontSize: 11 }}>
            Creating an account is free. The £10 entry is charged on the next step — total
            price, no VAT, no extra charges.
          </p>
        )}
      </form>

      {mode === 'signin' && (
        <p className="muted mt-2" style={{ fontSize: 13 }}>
          <Link to="/forgot">Lost your password?</Link>
        </p>
      )}

      <p className="muted mt-3" style={{ fontSize: 13 }}>
        {mode === 'signup' ? 'Already have a bib?' : 'No bib yet?'}{' '}
        <button
          type="button"
          className="btn-link"
          onClick={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup')
            setError(null)
            setInfo(null)
          }}
        >
          {mode === 'signup' ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </div>
  )
}
