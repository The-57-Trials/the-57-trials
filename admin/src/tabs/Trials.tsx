import { useEffect, useState } from 'react'
import { db, pad, type AdminTrial } from '../lib/db'

const gapLabel = (m: number) =>
  m === 0 ? '—' : m >= 10080 ? `${m / 10080}w` : m >= 1440 ? `${m / 1440}d` : `${m / 60}h`

export default function TrialsTab({ onError }: { onError: (m: string | null) => void }) {
  const [trials, setTrials] = useState<AdminTrial[]>([])
  const [editing, setEditing] = useState<AdminTrial | null>(null)
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)

  async function load() {
    const { data, error } = await db
      .from('trials')
      .select('num, title, chapter, is_milestone, active, min_gap_minutes')
      .order('num')
    if (error) onError(error.message)
    else setTrials(data as AdminTrial[])
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function openEdit(t: AdminTrial) {
    onError(null)
    setSaved(null)
    setEditing(t)
    const { data, error } = await db.rpc('get_trial_body', { p_trial_num: t.num })
    setBody(error ? '' : ((data as string) ?? ''))
  }

  async function save() {
    if (!editing) return
    setBusy(true)
    onError(null)
    const { error } = await db
      .from('trials')
      .update({
        title: editing.title,
        chapter: editing.chapter,
        body_md: body,
        active: editing.active,
        min_gap_minutes: editing.min_gap_minutes,
      })
      .eq('num', editing.num)
    setBusy(false)
    if (error) return onError(error.message)
    setSaved(`Trial ${pad(editing.num)} saved.`)
    setEditing(null)
    load()
  }

  if (editing) {
    return (
      <div className="card stack" style={{ maxWidth: 780 }}>
        <div className="row spread">
          <h2>EDIT TRIAL {pad(editing.num)}</h2>
          <button className="btn btn-outline sm" onClick={() => setEditing(null)}>CANCEL</button>
        </div>
        <div>
          <label className="label" htmlFor="ti">Title</label>
          <input id="ti" value={editing.title}
                 onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="ch">Chapter</label>
          <input id="ch" value={editing.chapter}
                 onChange={(e) => setEditing({ ...editing, chapter: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="gp">Cooldown before this trial (minutes)</label>
          <input id="gp" type="number" min={0} value={editing.min_gap_minutes}
                 onChange={(e) => setEditing({ ...editing, min_gap_minutes: Number(e.target.value) })} />
          <p className="muted sm">1440 = 24h · 2880 = 48h · 4320 = 72h · 10080 = 1 week</p>
        </div>
        <div>
          <label className="label" htmlFor="bd">Briefing (markdown)</label>
          <textarea id="bd" rows={18} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <label className="row sm">
          <input type="checkbox" checked={editing.active} style={{ width: 'auto' }}
                 onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
          &nbsp;Active (visible to members)
        </label>
        <button className="btn btn-primary" onClick={save} disabled={busy}>
          {busy ? 'SAVING…' : 'SAVE TRIAL'}
        </button>
      </div>
    )
  }

  const written = trials.filter((t) => t.title && !/^Trial \d\d$/.test(t.title)).length

  return (
    <div className="stack">
      {saved && <div className="notice ok" role="status">{saved}</div>}
      <div className="tiles">
        <div className="tile">
          <div className="tile-n">{written} / 57</div>
          <div className="tile-k">TRIALS WRITTEN</div>
          <div className="tile-s">titles still reading "Trial NN" count as unwritten</div>
        </div>
      </div>
      <div className="scroll">
        <table>
          <thead>
            <tr><th>NO.</th><th>TITLE</th><th>CHAPTER</th><th>HOLD</th><th>FLAGS</th><th></th></tr>
          </thead>
          <tbody>
            {trials.map((t) => (
              <tr key={t.num}>
                <td>{pad(t.num)}</td>
                <td>{t.title}</td>
                <td className="muted">{t.chapter}</td>
                <td>{gapLabel(t.min_gap_minutes)}</td>
                <td>
                  {t.is_milestone && <span className="chip">MILESTONE</span>}
                  {!t.active && <span className="chip off">INACTIVE</span>}
                </td>
                <td>
                  <button className="btn btn-outline sm" onClick={() => openEdit(t)}>EDIT</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
