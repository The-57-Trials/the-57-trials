import { pad } from '../lib/types'

interface ClearedCardProps {
  trialNum: number
  title: string
  bibNumber: number
  clearedAt: string
}

/**
 * The share artifact (doc 3.4) — "the highest-return development work
 * remaining" per the growth research. Composed for a screenshot, not a
 * dashboard capture: dated, bib-numbered, branded, nothing else on it.
 */
export default function ClearedCard({ trialNum, title, bibNumber, clearedAt }: ClearedCardProps) {
  const date = new Date(clearedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
  return (
    <div className="bib cleared-card">
      <span className="pin-b" />
      <div className="bib-label">THE 57 TRIALS</div>
      <div className="bib-number mono-num">{pad(trialNum)}</div>
      <div className="cleared-card-title">{title}</div>
      <div className="bib-sub">
        No. {pad(bibNumber)} · {date} · the57trials.com
      </div>
    </div>
  )
}
