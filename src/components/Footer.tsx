import { useAuth } from '../lib/auth'

export default function Footer() {
  const { profile } = useAuth()
  const bib = profile ? String(profile.bib_number).padStart(4, '0') : '0000'

  return (
    <footer className="site-footer">
      <div>THE 57 TRIALS — FIFTY-SEVEN STAGES. ONE LINE AT A TIME.</div>
      {/* Never explained anywhere. It's lore. */}
      <div className="serial mono-num">SERIAL NO. 5757-{bib}</div>
    </footer>
  )
}
