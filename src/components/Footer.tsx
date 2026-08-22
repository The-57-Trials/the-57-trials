import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function Footer() {
  const { profile } = useAuth()
  const bib = profile ? String(profile.bib_number).padStart(4, '0') : '0000'

  return (
    <footer className="site-footer">
      {/* Persistent on every page, including logged out — required for Stripe
          activation and for pre-contract information to be accessible. */}
      <nav className="footer-links" aria-label="Legal and contact">
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/refunds">Cancellation &amp; Refunds</Link>
        <Link to="/disclaimer">Health &amp; Safety</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <div>THE 57 TRIALS — FIFTY-SEVEN STAGES. ONE LINE AT A TIME.</div>
      {/* Never explained anywhere. It's lore. */}
      <div className="serial mono-num">SERIAL NO. 5757-{bib}</div>
    </footer>
  )
}
