import { useEffect, useState } from 'react'
import { fetchMyAccount } from '../lib/api'
import { pad, type TrialAccount } from '../lib/types'

interface MirrorRecordProps {
  mirrorOf: number
}

/**
 * D16 competence mechanic: a repeat trial shows the member their own THE
 * ACCOUNT from the first attempt — self-referenced only, never compared
 * between members. The payoff four trials' NOTE fields already promise.
 */
export default function MirrorRecord({ mirrorOf }: MirrorRecordProps) {
  const [account, setAccount] = useState<TrialAccount | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchMyAccount(mirrorOf).then((a) => {
      if (!cancelled) setAccount(a)
    }).catch(() => {})
    return () => {
      cancelled = true
    }
  }, [mirrorOf])

  if (!account) return null

  return (
    <div className="panel account-panel account-record mirror-record">
      <div className="label mb-1">YOUR ACCOUNT — TRIAL {pad(mirrorOf)}</div>
      <p className="muted account-hint" style={{ marginBottom: 10 }}>
        What you wrote the first time, unedited.
      </p>
      <div className="account-field" style={{ marginTop: 0 }}>
        <div className="label account-record-label">WHAT WAS DONE</div>
        <p>{account.done}</p>
      </div>
      <div className="account-field">
        <div className="label account-record-label">WHERE IT GOT HARD</div>
        <p>{account.hard}</p>
      </div>
      <div className="account-field">
        <div className="label account-record-label">WHAT YOU KNOW NOW</div>
        <p>{account.learned}</p>
      </div>
    </div>
  )
}
