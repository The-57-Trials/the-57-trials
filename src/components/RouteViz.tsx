import { MILESTONES } from '../lib/types'

interface RouteVizProps {
  /** Number of trials cleared (0–57). */
  cleared: number
  /** When false (e.g. logged-out landing), no pulsing "current" dot is shown. */
  showCurrent?: boolean
}

/** 57 checkpoint dots: filled yellow = done, pulsing ring = current, steel = locked. */
export default function RouteViz({ cleared, showCurrent = true }: RouteVizProps) {
  return (
    <div className="route-viz" role="img" aria-label={`${cleared} of 57 checkpoints cleared`}>
      {Array.from({ length: 57 }, (_, i) => {
        const num = i + 1
        const state =
          num <= cleared ? 'done' : showCurrent && num === cleared + 1 ? 'current' : ''
        const milestone = MILESTONES.includes(num) ? ' milestone' : ''
        return <span key={num} className={`checkpoint ${state}${milestone}`} title={`Checkpoint ${num}`} />
      })}
    </div>
  )
}
