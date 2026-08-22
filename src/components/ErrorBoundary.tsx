import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Without this, any render-time throw leaves the member staring at a blank
 * page with no way forward — worse on a paid product than showing the fault.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="page" style={{ maxWidth: 560 }}>
        <div className="label rust">SOMETHING BROKE</div>
        <h1 style={{ fontSize: 42 }} className="mb-2">THE TIMING TENT WENT DOWN</h1>
        <p className="muted mb-3" style={{ fontSize: 13 }}>
          This is a fault on our side, not yours. Your bib and every cleared line are safe —
          nothing is lost. Reload to pick up where you were.
        </p>
        <div className="row">
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            RELOAD
          </button>
          <a className="btn btn-outline" href="/run">BACK TO YOUR RUN</a>
        </div>
        <details className="mt-4">
          <summary className="label" style={{ cursor: 'pointer' }}>TECHNICAL DETAIL</summary>
          <pre
            className="mt-2"
            style={{
              background: 'var(--ink-sunken)',
              border: '1px solid var(--line)',
              padding: 12,
              fontSize: 12,
              overflowX: 'auto',
              color: 'var(--steel)',
            }}
          >
            {error.message}
          </pre>
        </details>
      </div>
    )
  }
}
