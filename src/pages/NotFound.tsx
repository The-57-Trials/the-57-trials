import { Link } from 'react-router-dom'
import BibCard from '../components/BibCard'

export default function NotFound() {
  return (
    <div className="page center" style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, paddingTop: 60 }}>
      <BibCard number="404" label="THE 57 TRIALS" sub="OFF THE ROUTE" />
      <h1 style={{ fontSize: 42 }}>NO SUCH LINE</h1>
      <p className="muted" style={{ fontSize: 13 }}>
        Nothing is marked at this checkpoint. Head back to the route.
      </p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link to="/" className="btn btn-outline">THE START LINE</Link>
        <Link to="/run" className="btn btn-primary">YOUR RUN</Link>
      </div>
    </div>
  )
}
