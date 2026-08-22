import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { RequireAuth, RequireAdmin } from './components/Protected'
import Landing from './pages/Landing'
import Login from './pages/Login'

// Landing and Login stay in the main chunk: they are the first thing a visitor
// hits and should not wait on a second request. Everything behind auth is split
// out — it keeps the markdown renderer and the admin panel off the critical
// path for someone who is only looking at the pricing.
const Run = lazy(() => import('./pages/Run'))
const TrialDetail = lazy(() => import('./pages/TrialDetail'))
const Board = lazy(() => import('./pages/Board'))
const Account = lazy(() => import('./pages/Account'))
const Admin = lazy(() => import('./pages/Admin'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return (
    <div className="page center muted" role="status" aria-live="polite">
      LOADING…
    </div>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route element={<RequireAuth />}>
              <Route path="/run" element={<Run />} />
              <Route path="/run/trial/:num" element={<TrialDetail />} />
              <Route path="/board" element={<Board />} />
              <Route path="/account" element={<Account />} />
            </Route>
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
