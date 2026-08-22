interface BibCardProps {
  number: string
  label?: string
  sub?: string
  hero?: boolean
}

/** The race bib: paper card, black number, corner pins, slight tilt. */
export default function BibCard({ number, label = 'THE 57 TRIALS', sub, hero = false }: BibCardProps) {
  return (
    <div className={`bib${hero ? ' bib-hero' : ''}`}>
      <span className="pin-b" />
      <div className="bib-label">{label}</div>
      <div className="bib-number mono-num">{number}</div>
      {sub && <div className="bib-sub">{sub}</div>}
    </div>
  )
}
