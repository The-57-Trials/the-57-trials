import { useEffect, useState } from 'react'
import { fetchMyWitness, recordWitness } from '../lib/api'

interface WitnessRecordProps {
  trialNum: number
}

/**
 * Doc 17.5 — shown after a RED trial clears. The named check-in person from
 * before the trial started becomes the witness; this just asks their first
 * name. Never collects contact details, never contacts them (17.2).
 */
export default function WitnessRecord({ trialNum }: WitnessRecordProps) {
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [recorded, setRecorded] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchMyWitness(trialNum)
      .then((w) => {
        if (cancelled || !w) return
        setName(w.witness_name)
        setRelationship(w.relationship ?? '')
        setRecorded(true)
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoaded(true))
    return () => {
      cancelled = true
    }
  }, [trialNum])

  async function submit() {
    if (!name.trim()) return
    setBusy(true)
    setError(null)
    try {
      await recordWitness(trialNum, name, relationship)
      setRecorded(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not record your witness.')
    } finally {
      setBusy(false)
    }
  }

  if (!loaded) return null

  if (recorded) {
    return (
      <div className="panel witness-panel">
        <div className="label">WITNESSED</div>
        <p className="mt-1">
          {name}{relationship ? ` (${relationship})` : ''}
        </p>
      </div>
    )
  }

  return (
    <div className="panel witness-panel">
      <div className="label mb-1">WHO STOOD WITNESS?</div>
      <p className="muted" style={{ fontSize: 12 }}>
        You named someone before you started. Put their name here.
      </p>
      <div className="row mt-2" style={{ gap: 12 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          placeholder="First name"
          style={{ flex: 1 }}
        />
        <input
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          maxLength={40}
          placeholder="Relationship (optional)"
          style={{ flex: 1 }}
        />
      </div>
      <p className="muted mt-1" style={{ fontSize: 11 }}>
        Recorded on your entry. We never contact them, and we never ask for their details.
      </p>
      {error && <div className="notice mt-2" role="alert">{error}</div>}
      <button
        type="button"
        className="btn btn-outline mt-2"
        onClick={submit}
        disabled={busy || !name.trim()}
      >
        {busy ? 'RECORDING…' : 'RECORD WITNESS'}
      </button>
    </div>
  )
}
