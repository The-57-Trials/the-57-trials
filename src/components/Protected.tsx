import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/auth'

/** Requires a signed-in session. */
export function RequireAuth() {
  const { session, loading } = useAuth()
  if (loading) return <div className="page center muted">LOADING…</div>
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}

