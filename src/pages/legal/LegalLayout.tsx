import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LegalLayoutProps {
  title: string
  updated: string
  version: string
  children: ReactNode
}

/**
 * Shared shell for the policy pages. These must stay reachable logged out —
 * Stripe's activation review reads them, and the pre-contract information has
 * to be available before anyone pays.
 */
export default function LegalLayout({ title, updated, version, children }: LegalLayoutProps) {
  return (
    <div className="page legal" style={{ maxWidth: 760 }}>
      <Link to="/" className="label" style={{ color: 'var(--steel)' }}>
        ← THE 57 TRIALS
      </Link>

      <h1 className="page-title mt-3">{title}</h1>
      <p className="label mt-1">
        LAST UPDATED {updated} &nbsp;·&nbsp; VERSION {version}
      </p>

      <div className="notice mt-3" role="note">
        <strong>DRAFT — NOT YET REVIEWED BY A SOLICITOR.</strong> This document was prepared
        from research, not legal advice, and must be reviewed by a qualified solicitor in
        England and Wales before this site takes payment. Bracketed placeholders still need
        real details.
      </div>

      <div className="legal-body mt-3">{children}</div>

      <p className="muted mt-4" style={{ fontSize: 12 }}>
        Questions about this page: <a href="mailto:[CONTACT EMAIL]">[CONTACT EMAIL]</a>
      </p>
    </div>
  )
}
