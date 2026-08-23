import { useEffect, useState } from 'react'
import { db, pad, type MemberRow } from '../lib/db'

export default function MembersTab({ onError }: { onError: (m: string | null) => void }) {
  const [members, setMembers] = useState<MemberRow[]>([])

  useEffect(() => {
    // Joined on bib_number: the leaderboard view deliberately exposes no user ids.
    Promise.all([
      db.from('profiles').select('*').is('deleted_at', null).order('bib_number'),
      db.from('leaderboard').select('bib_number, cleared'),
    ]).then(([p, l]) => {
      if (p.error || l.error) return onError((p.error ?? l.error)!.message)
      const byBib = new Map(
        (l.data as { bib_number: number; cleared: number }[]).map((r) => [r.bib_number, r.cleared]),
      )
      setMembers(
        (p.data as Omit<MemberRow, 'cleared'>[]).map((r) => ({
          ...r,
          cleared: byBib.get(r.bib_number) ?? 0,
        })),
      )
    })
  }, [onError])

  return (
    <div className="scroll">
      <table>
        <thead>
          <tr><th>BIB</th><th>NAME</th><th>ENTRY</th><th>CIRCUIT</th><th>CLEARED</th><th>JOINED</th><th>ROLE</th></tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{pad(m.bib_number)}</td>
              <td>{m.display_name}</td>
              <td>{m.entry_paid ? '✓' : '—'}</td>
              <td>{m.circuit_active ? 'ACTIVE' : '—'}</td>
              <td>{m.cleared} / 57</td>
              <td className="muted">{new Date(m.created_at).toLocaleDateString('en-GB')}</td>
              <td className="muted">{m.role}</td>
            </tr>
          ))}
          {members.length === 0 && (
            <tr><td colSpan={7} className="muted center">No runners on the board yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
