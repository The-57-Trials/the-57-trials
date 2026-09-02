import { useState } from 'react'
import { sealLetter, clearTrial, type ClearResult } from '../lib/api'
import type { Typeface } from '../lib/types'

interface SealedLetterProps {
  trialNum: number
  onCleared: (result: ClearResult) => void
}

const MIN_LENGTH = 40

const PROMPTS: Record<number, { placeholder: string; sealedNote: string }> = {
  1: {
    placeholder: 'Why you are here. What will make you quit.',
    sealedNote: 'Your bib is issued the moment this seals.',
  },
  9: {
    placeholder: 'What clearing Trial 57 will actually look like for you. Specific enough to be wrong.',
    sealedNote: 'This joins Trial 01 in the Library. Both open again at Trial 53.',
  },
}

/**
 * The one warm mechanic in a cold-on-purpose product (doc 18.1). Once
 * sealed, nobody — including the author — can read this again until
 * Trial 53. There is no draft autosave and no edit path: that is the point.
 */
export default function SealedLetter({ trialNum, onCleared }: SealedLetterProps) {
  const [typeface, setTypeface] = useState<Typeface>('typewriter')
  const [body, setBody] = useState('')
  const [sealing, setSealing] = useState(false)
  const [sealed, setSealed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const prompt = PROMPTS[trialNum] ?? PROMPTS[1]
  const trimmed = body.trim()
  const canSeal = trimmed.length >= MIN_LENGTH

  async function seal() {
    if (!canSeal || sealing) return
    setSealing(true)
    setError(null)
    try {
      await sealLetter(trialNum, typeface, body)
      setSealed(true)
      const result = await clearTrial(trialNum)
      onCleared(result)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not seal the letter.'
      setError(
        msg.includes('CIRCUIT_REQUIRED') ? 'Trials 06+ require an active Circuit Pass.'
        : msg.includes('ENTRY_REQUIRED') ? 'Pay the entry first.'
        : msg.includes('NOT_OPEN') ? 'This is not your current line.'
        : msg,
      )
      setSealing(false)
    }
  }

  if (sealed) {
    return (
      <div className="letter-page letter-sealed">
        <div className="wax-seal" aria-hidden="true">5757</div>
        <div className="label">SEALED</div>
        <p className="muted mt-2" style={{ fontSize: 13 }}>{prompt.sealedNote}</p>
      </div>
    )
  }

  return (
    <div className="stack">
      <div className="typeface-choice" role="radiogroup" aria-label="Typeface">
        <button
          type="button"
          role="radio"
          aria-checked={typeface === 'typewriter'}
          className={`typeface-btn${typeface === 'typewriter' ? ' on' : ''}`}
          onClick={() => setTypeface('typewriter')}
        >
          Typewriter
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={typeface === 'handwriting'}
          className={`typeface-btn${typeface === 'handwriting' ? ' on' : ''}`}
          onClick={() => setTypeface('handwriting')}
        >
          Handwriting
        </button>
      </div>

      <div className={`letter-page ${typeface}`}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={prompt.placeholder}
          maxLength={4000}
          aria-label="Your letter"
        />
        <div className="letter-count">
          {trimmed.length < MIN_LENGTH
            ? `${MIN_LENGTH - trimmed.length} characters to go`
            : `${trimmed.length} characters`}
        </div>
      </div>

      {error && <div className="notice" role="alert">{error}</div>}

      <button
        type="button"
        className="btn btn-rust"
        style={{ alignSelf: 'flex-start', fontSize: 16, padding: '18px 42px' }}
        onClick={seal}
        disabled={!canSeal || sealing}
      >
        {sealing ? 'SEALING…' : 'SEAL'}
      </button>
      <p className="muted" style={{ fontSize: 11 }}>
        Once sealed this cannot be edited, and you will not be able to read it back until
        Trial 53.
      </p>
    </div>
  )
}
