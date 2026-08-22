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
              <NavLink to="/board">Board</NavLink>
              <NavLink to="/account">Account</NavLink>
              {profile?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
              {profile && (
                <span className="label mono-num bib-chip">No. {pad(profile.bib_number)}</span>
              )}
              <a
                href="#signout"
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                }}
              >
                Sign out
              </a>
            </>
          ) : (
            <>
              <NavLink to="/board">Board</NavLink>
              <NavLink to="/login">Sign in</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
