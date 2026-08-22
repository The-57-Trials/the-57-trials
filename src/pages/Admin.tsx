import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { fetchTrialBody } from '../lib/api'
import { pad, type MilestoneEvent, type Profile } from '../lib/types'

interface AdminTrial {
  num: number
  title: string
  chapter: string
  is_milestone: boolean
  active: boolean
}

interface MemberRow extends Profile {
  cleared: number
}

type Tab = 'trials' | 'members' | 'merch'

export default function Admin() {
  const [tab, setTab] = useState<Tab>('trials')
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="page">
      <div className="label">RACE CONTROL</div>
      <h1 style={{ fontSize: 44 }} className="mb-3">ADMIN</h1>

      <div className="row mb-3">
        {(['trials', 'members', 'merch'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTab(t)}
          >
            {t === 'merch' ? 'MERCH QUEUE' : t.toUpperCase()}
          </button>
        ))}
      </div>

      {error && <div className="notice mb-2">{error}</div>}

      {tab === 'trials' && <TrialsTab onError={setError} />}
      {tab === 'members' && <MembersTab onError={setError} />}
      {tab === 'merch' && <MerchTab onError={setError} />}
    </div>
  )
}

function TrialsTab({ onError }: { onError: (m: string | null) => void }) {
  const [trials, setTrials] = useState<AdminTrial[]>([])
  const [editing, setEditing] = useState<AdminTrial | null>(null)
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    const { data, error } = await supabase
      .from('trials')
      .select('num, title, chapter, is_milestone, active')
      .order('num')
    if (error) onError(error.message)
    else setTrials(data as AdminTrial[])
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function openEdit(t: AdminTrial) {
    onError(null)
    setEditing(t)
    setBody(await fetchTrialBody(t.num).catch(() => ''))
  }

  async function save() {
    if (!editing) return
    setBusy(true)
    onError(null)
    try {
      const { error } = await supabase
        .from('trials')
        .update({
          title: editing.title,
          chapter: editing.chapter,
          body_md: body,
          active: editing.active,
        })
        .eq('num', editing.num)
      if (error) throw error
      setEditing(null)
      await load()
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  if (editing) {
    return (
      <div className="panel stack" style={{ maxWidth: 760 }}>
        <div className="spread">
          <h3 className="display" style={{ fontSize: 28 }}>
            EDIT TRIAL {pad(editing.num)}
          </h3>
          <button className="btn btn-outline" onClick={() => setEditing(null)}>CANCEL</button>
        </div>
        <div>
          <label className="label">Title</label>
          <input
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Chapter</label>
          <input
            value={editing.chapter}
            onChange={(e) => setEditing({ ...editing, chapter: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Body (markdown)</label>
          <textarea
            rows={14}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <label className="row" style={{ fontSize: 13 }}>
          <input
            type="checkbox"
            style={{ width: 'auto' }}
            checked={editing.active}
            onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
          />
          Active (visible to members)
        </label>
        <button className="btn btn-primary" onClick={save} disabled={busy}>
          {busy ? 'SAVING…' : 'SAVE TRIAL'}
        </button>
      </div>
    )
  }

  return (
    <div className="table-scroll">
    <table className="board-table">
      <thead>
        <tr><th>NO.</th><th>TITLE</th><th>CHAPTER</th><th>FLAGS</th><th></th></tr>
      </thead>
      <tbody>
        {trials.map((t) => (
          <tr key={t.num}>
            <td className="mono-num">{pad(t.num)}</td>
            <td>{t.title}</td>
            <td className="muted">{t.chapter}</td>
            <td>
              {t.is_milestone && <span className="rust">MILESTONE </span>}
              {!t.active && <span className="muted">INACTIVE</span>}
            </td>
            <td>
              <button className="btn btn-outline" style={{ padding: '6px 14px' }} onClick={() => openEdit(t)}>
                EDIT
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}

function MembersTab({ onError }: { onError: (m: string | null) => void }) {
  const [members, setMembers] = useState<MemberRow[]>([])

  useEffect(() => {
    // Joined on bib_number: the leaderboard view no longer exposes user ids.
    Promise.all([
      supabase.from('profiles').select('*').is('deleted_at', null).order('bib_number'),
      supabase.from('leaderboard').select('bib_number, cleared'),
    ]).then(([p, l]) => {
      if (p.error || l.error) {
        onError((p.error ?? l.error)!.message)
        return
      }
      const clearedByBib = new Map(
        (l.data as { bib_number: number; cleared: number }[]).map((r) => [r.bib_number, r.cleared]),
      )
      setMembers(
        (p.data as Profile[]).map((row) => ({
          ...row,
          cleared: clearedByBib.get(row.bib_number) ?? 0,
        })),
      )
    })
  }, [onError])

  return (
    <div className="table-scroll">
    <table className="board-table">
      <thead>
        <tr><th>BIB</th><th>NAME</th><th>ENTRY</th><th>CIRCUIT</th><th>CLEARED</th><th>ROLE</th></tr>
      </thead>
      <tbody>
        {members.map((m) => (
          <tr key={m.id}>
            <td className="mono-num">{pad(m.bib_number)}</td>
            <td>{m.display_name}</td>
            <td>{m.entry_paid ? '✓' : '—'}</td>
            <td>{m.circuit_active ? 'ACTIVE' : '—'}</td>
            <td className="mono-num">{m.cleared} / 57</td>
            <td className="muted">{m.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}

function MerchTab({ onError }: { onError: (m: string | null) => void }) {
  const [events, setEvents] = useState<MilestoneEvent[]>([])

  async function load() {
    const { data, error } = await supabase
      .from('milestone_events')
      .select('id, user_id, trial_num, created_at, shipped, profiles(display_name, bib_number)')
      .order('created_at', { ascending: false })
    if (error) onError(error.message)
    else setEvents(data as unknown as MilestoneEvent[])
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function toggleShipped(ev: MilestoneEvent) {
    const { error } = await supabase
      .from('milestone_events')
      .update({ shipped: !ev.shipped })
      .eq('id', ev.id)
    if (error) onError(error.message)
    else load()
  }

  return (
    <>
      <p className="muted mb-2" style={{ fontSize: 13 }}>
        Manual fulfilment: post the merch, tick the box. Unshipped rows are the to-do list.
      </p>
      <div className="table-scroll">
      <table className="board-table">
        <thead>
          <tr><th>DATE</th><th>RUNNER</th><th>BIB</th><th>MILESTONE</th><th>SHIPPED</th></tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id} style={ev.shipped ? { opacity: 0.5 } : undefined}>
              <td>{new Date(ev.created_at).toLocaleDateString('en-GB')}</td>
              <td>{ev.profiles?.display_name ?? ev.user_id.slice(0, 8)}</td>
              <td className="mono-num">{ev.profiles ? pad(ev.profiles.bib_number) : '—'}</td>
              <td className="rust mono-num">CHECKPOINT {pad(ev.trial_num)}</td>
              <td>
                <input
                  type="checkbox"
                  style={{ width: 'auto' }}
                  checked={ev.shipped}
                  onChange={() => toggleShipped(ev)}
                />
              </td>
            </tr>
          ))}
          {events.length === 0 && (
            <tr><td colSpan={5} className="muted center">No milestone completions yet.</td></tr>
          )}
        </tbody>
      </table>
      </div>
    </>
  )
}
