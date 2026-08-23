import { useEffect, useState } from 'react'
import { db, pad, type MilestoneRow } from '../lib/db'

export default function MerchTab({ onError }: { onError: (m: string | null) => void }) {
  const [rows, setRows] = useState<MilestoneRow[]>([])

  async function load() {
    const { data, error } = await db
      .from('milestone_events')
      .select('id, user_id, trial_num, created_at, shipped, profiles(display_name, bib_number)')
      .order('created_at', { ascending: false })
    if (error) onError(error.message)
    else setRows(data as unknown as MilestoneRow[])
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function toggle(r: MilestoneRow) {
    const { error } = await db
      .from('milestone_events')
      .update({ shipped: !r.shipped })
      .eq('id', r.id)
    if (error) onError(error.message)
    else load()
  }

  const owed = rows.filter((r) => !r.shipped).length

  return (
    <div className="stack">
      <div className="tiles">
        <div className={`tile${owed > 0 ? ' alert' : ''}`}>
          <div className="tile-n">{owed}</div>
          <div className="tile-k">AWAITING POST</div>
          <div className="tile-s">every unshipped row is a promise made</div>
        </div>
      </div>
      <p className="muted sm">
        Manual fulfilment: post it, tick the box. Batch once a week rather than ad hoc — ad hoc
        turns a four-minute job into a twenty-five-minute one.
      </p>
      <div className="scroll">
        <table>
          <thead>
            <tr><th>DATE</th><th>RUNNER</th><th>BIB</th><th>MILESTONE</th><th>SHIPPED</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={r.shipped ? { opacity: 0.45 } : undefined}>
                <td>{new Date(r.created_at).toLocaleDateString('en-GB')}</td>
                <td>{r.profiles?.display_name ?? r.user_id.slice(0, 8)}</td>
                <td>{r.profiles ? pad(r.profiles.bib_number) : '—'}</td>
                <td>CHECKPOINT {pad(r.trial_num)}</td>
                <td>
                  <input type="checkbox" checked={r.shipped} style={{ width: 'auto' }}
                         aria-label={`Mark checkpoint ${r.trial_num} shipped`}
                         onChange={() => toggle(r)} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="muted center">Nothing earned yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
