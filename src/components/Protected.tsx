import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/auth'

/** Requires a signed-in session. */
export function RequireAuth() {
  const { session, loading } = useAuth()
  if (loading) return <div className="page center muted">LOADING…</div>
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}

/** Requires the admin role. */
export function RequireAdmin() {
  const { session, profile, loading } = useAuth()
  if (loading) return <div className="page center muted">LOADING…</div>
  if (!session) return <Navigate to="/login" replace />
  if (profile?.role !== 'admin') return <Navigate to="/run" replace />
  return <Outlet />
}
