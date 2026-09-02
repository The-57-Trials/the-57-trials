import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { pad } from '../lib/types'

export default function Header() {
  const { session, profile, signOut } = useAuth()

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          THE <span className="brand-57">57</span> TRIALS
        </Link>
        <nav className="nav-links">
          {session ? (
            <>
              <NavLink to="/run">Your Run</NavLink>
              <NavLink to="/library">Library</NavLink>
              <NavLink to="/register">Register</NavLink>
              <NavLink to="/account">Account</NavLink>
              {profile && (
                <span className="label mono-num bib-chip">No. {pad(profile.bib_number)}</span>
              )}
              <button type="button" className="btn-link" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Sign in</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
