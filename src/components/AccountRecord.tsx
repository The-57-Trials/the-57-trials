import { useEffect, useState } from 'react'
import { fetchMyAccount } from '../lib/api'
import type { TrialAccount } from '../lib/types'

interface AccountRecordProps {
  trialNum: number
}

/** Read-only view of a cleared trial's THE ACCOUNT — the page as it goes in the book. */
export default function AccountRecord({ trialNum }: AccountRecordProps) {
  const [account, setAccount] = useState<TrialAccount | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchMyAccount(trialNum).then((a) => {
      if (!cancelled) setAccount(a)
    }).catch(() => {})
    return () => {
      cancelled = true
    }
  }, [trialNum])

  if (!account) return null

  if (!open) {
    return (
      <button type="button" className="btn-link" onClick={() => setOpen(true)}>
        Read your account back
      </button>
    )
  }

  return (
    <div className="panel account-panel account-record">
      <div className="spread mb-1">
        <div className="label">THE ACCOUNT — SEALED</div>
        <button type="button" className="btn-link" onClick={() => setOpen(false)}>Close</button>
      </div>
      <div className="account-field">
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
