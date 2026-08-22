import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { fetchMyCompletions, openBillingPortal, deleteMyAccount } from '../lib/api'
import { pad } from '../lib/types'

export default function Account() {
  const { session, profile, refreshProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!session || !profile) return <div className="page center muted">LOADING…</div>

  const displayName = name ?? profile.display_name

  async function saveName() {
    setBusy(true)
    setError(null)
    setMsg(null)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', profile!.id)
      if (error) throw error
      await refreshProfile()
      setMsg('Runner name updated.')
      setName(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed.')
    } finally {
      setBusy(false)
    }
  }

  async function manageBilling() {
    setBusy(true)
    setError(null)
    try {
      window.location.href = await openBillingPortal()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open the billing portal.')
      setBusy(false)
    }
  }

  // UK GDPR: portable JSON export of everything we hold about the member.
  async function exportData() {
    setBusy(true)
    setError(null)
    try {
      const completions = await fetchMyCompletions(session!.user.id)
      const payload = {
        exported_at: new Date().toISOString(),
        profile: {
          email: session!.user.email,
          display_name: profile!.display_name,
          bib_number: profile!.bib_number,
          entry_paid: profile!.entry_paid,
          circuit_active: profile!.circuit_active,
          joined: profile!.created_at,
        },
        completions,
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `the-57-trials-data-${pad(profile!.bib_number)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed.')
    } finally {
      setBusy(false)
    }
  }

  async function deleteAccount() {
    setBusy(true)
    setError(null)
    try {
      await deleteMyAccount()
      await signOut()
      navigate('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Deletion failed.')
      setBusy(false)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 620 }}>
      <div className="label">RUNNER FILE</div>
      <h1 style={{ fontSize: 44 }} className="mb-3">ACCOUNT</h1>

      {msg && <div className="notice notice-yellow mb-2">{msg}</div>}
      {error && <div className="notice mb-2">{error}</div>}

      <div className="stack">
        <div className="panel">
          <div className="label mb-2">IDENTITY</div>
          <div className="stack">
            <div>
              <label className="label" htmlFor="rn">Runner name</label>
              <div className="row">
                <input
                  id="rn"
                  style={{ flex: 1 }}
                  value={displayName}
                  maxLength={40}
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  className="btn btn-outline"
                  onClick={saveName}
                  disabled={busy || name === null || !displayName.trim()}
                >
                  SAVE
                </button>
              </div>
            </div>
            <div className="spread" style={{ fontSize: 13 }}>
              <span className="muted">Bib number</span>
              <span className="mono-num">No. {pad(profile.bib_number)}</span>
            </div>
            <div className="spread" style={{ fontSize: 13 }}>
              <span className="muted">Email</span>
              <span>{session.user.email}</span>
            </div>
            <div className="spread" style={{ fontSize: 13 }}>
              <span className="muted">On the line since</span>
              <span>{new Date(profile.created_at).toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="label mb-2">PASSES</div>
          <div className="spread" style={{ fontSize: 13 }}>
            <span className="muted">Entry Pass</span>
            <span className={profile.entry_paid ? 'yellow' : 'rust'}>
              {profile.entry_paid ? 'PAID ✓' : 'NOT PAID'}
            </span>
          </div>
          <div className="spread" style={{ fontSize: 13 }}>
            <span className="muted">Circuit Pass</span>
            <span className={profile.circuit_active ? 'yellow' : ''}>
              {profile.circuit_active ? 'ACTIVE ✓' : 'INACTIVE'}
            </span>
          </div>
          <button className="btn btn-outline mt-2" onClick={manageBilling} disabled={busy}>
            MANAGE BILLING
          </button>
        </div>

        <div className="panel">
          <div className="label mb-2">YOUR DATA (UK GDPR)</div>
          <div className="row">
            <button className="btn btn-outline" onClick={exportData} disabled={busy}>
              DOWNLOAD MY DATA
            </button>
            {!confirmDelete ? (
              <button className="btn btn-outline rust" onClick={() => setConfirmDelete(true)}>
                DELETE MY ACCOUNT
              </button>
            ) : (
              <button className="btn btn-rust" onClick={deleteAccount} disabled={busy}>
                {busy ? 'DELETING…' : 'CONFIRM — DELETE EVERYTHING'}
              </button>
            )}
          </div>
          {confirmDelete && (
            <p className="muted mt-2" style={{ fontSize: 12 }}>
              This removes your login and retires your bib. Cleared lines are erased. There is no
              undo. Active subscriptions should be cancelled via Manage Billing first.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
