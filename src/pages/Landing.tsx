import { Link } from 'react-router-dom'
import BibCard from '../components/BibCard'
import RouteViz from '../components/RouteViz'
import { useAuth } from '../lib/auth'
import { PRICE_ENTRY, PRICE_CIRCUIT } from '../lib/types'

const MILESTONE_COPY = [
  { num: '15', name: 'FIRST CHECKPOINT', desc: 'The 15 patch. Stitched, numbered, posted.' },
  { num: '30', name: 'HALFWAY LINE', desc: 'The halfway tee. Earned, not bought.' },
  { num: '45', name: 'FINAL STRETCH', desc: 'The 45 cap. Most never see it.' },
  { num: '57', name: 'THE FINISH', desc: 'The finisher bib. Your number, framed.' },
]

export default function Landing() {
  const { session } = useAuth()

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <BibCard number="057" sub="FIFTY-SEVEN STAGES" hero />
        <h1>
          THE <span className="yellow">57</span> TRIALS
        </h1>
        <p className="tagline">Fifty-seven stages. One line at a time. No skipping ahead.</p>
        <Link to={session ? '/run' : '/login?mode=signup'} className="btn btn-primary">
          {session ? 'BACK TO YOUR RUN' : `CLAIM YOUR BIB — ${PRICE_ENTRY}`}
        </Link>
      </section>

      <div className="page" style={{ paddingTop: 0 }}>
        {/* THE ROUTE */}
        <section className="section">
          <h2>
            THE <span className="accent">ROUTE</span>
          </h2>
          <p className="muted mb-3">
            57 checkpoints. Four merch drops. Every line clears in sequence — the next one
            unlocks only when the one before it is stamped.
          </p>
          <RouteViz cleared={0} showCurrent={false} />
          <div className="milestone-row">
            {MILESTONE_COPY.map((m) => (
              <div key={m.num} className="milestone-card">
                <div className="m-num mono-num">{m.num}</div>
                <div style={{ fontSize: 12, letterSpacing: '0.12em' }}>{m.name}</div>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section">
          <h2>
            HOW IT <span className="accent">WORKS</span>
          </h2>
          <div className="steps">
            <div className="step">
              <div className="step-num mono-num">01</div>
              <h3>Pay the entry.</h3>
              <p>{PRICE_ENTRY}. One time. Your bib number is assigned on signup and never reissued.</p>
            </div>
            <div className="step">
              <div className="step-num mono-num">02</div>
              <h3>Clear trials in order.</h3>
              <p>Trial 08 is locked until 07 is stamped. No exceptions. No shortcuts.</p>
            </div>
            <div className="step">
              <div className="step-num mono-num">03</div>
              <h3>Climb the board.</h3>
              <p>Every clear is timestamped. The board doesn't care how you feel about it.</p>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="section">
          <h2>
            THE <span className="accent">PASSES</span>
          </h2>
          <div className="pricing">
            <div className="price-card primary">
              <div className="label yellow">START HERE</div>
              <h3 style={{ fontSize: 30 }}>ENTRY PASS</h3>
              <div className="price mono-num">
                {PRICE_ENTRY} <small>one-time</small>
              </div>
              <ul>
                <li>Your bib number. Permanent.</li>
                <li>Trials 01–05 unlocked in sequence.</li>
                <li>A place on the start line.</li>
              </ul>
              <Link to={session ? '/run' : '/login?mode=signup'} className="btn btn-primary btn-block">
                CLAIM YOUR BIB
              </Link>
            </div>
            <div className="price-card">
              <div className="label">THE ENGINE</div>
              <h3 style={{ fontSize: 30 }}>CIRCUIT PASS</h3>
              <div className="price mono-num">
                {PRICE_CIRCUIT} <small>/ month</small>
              </div>
              <ul>
                <li>Trials 06–57. The full route.</li>
                <li>Ranked place on the board.</li>
                <li>New trial drops as they land.</li>
                <li>Live events access.</li>
              </ul>
              <Link to={session ? '/run' : '/login?mode=signup'} className="btn btn-outline btn-block">
                JOIN THE CIRCUIT
              </Link>
            </div>
          </div>
          <p className="muted mt-2" style={{ fontSize: 12 }}>
            Trials 06+ require an active Circuit Pass. Cancel any time — your cleared lines stay
            cleared.
          </p>
        </section>

        {/* LIVE EVENTS */}
        <section className="section">
          <h2>
            LIVE <span className="accent">EVENTS</span>
          </h2>
          <div className="panel">
            <div className="spread">
              <span>NEXT CHECKPOINT BRIEFING</span>
              <span className="label">TBA</span>
            </div>
          </div>
          <p className="muted mt-2" style={{ fontSize: 12 }}>
            Briefings are announced to Circuit Pass holders first.
          </p>
        </section>
      </div>
    </div>
  )
}
