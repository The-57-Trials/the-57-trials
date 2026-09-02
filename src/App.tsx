import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { RequireAuth } from './components/Protected'
import Landing from './pages/Landing'
import Login from './pages/Login'

// Landing and Login stay in the main chunk: they are the first thing a visitor
// hits and should not wait on a second request. Everything behind auth is split
// out — it keeps the markdown renderer and the admin panel off the critical
// path for someone who is only looking at the pricing.
const Run = lazy(() => import('./pages/Run'))
const TrialDetail = lazy(() => import('./pages/TrialDetail'))
const Register = lazy(() => import('./pages/Register'))
const Account = lazy(() => import('./pages/Account'))
const Library = lazy(() => import('./pages/Library'))
// Race Control is a separate application with its own build and its own
// deployment. Nothing about it ships to a member's browser.
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Terms = lazy(() => import('./pages/legal/Terms'))
const Privacy = lazy(() => import('./pages/legal/Privacy'))
const Refunds = lazy(() => import('./pages/legal/Refunds'))
const Disclaimer = lazy(() => import('./pages/legal/Disclaimer'))
const Contact = lazy(() => import('./pages/legal/Contact'))

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

            {/* Public and reachable logged out: Stripe's activation review reads
                these, and pre-contract information must precede payment. */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/contact" element={<Contact />} />
            <Route element={<RequireAuth />}>
              <Route path="/run" element={<Run />} />
              <Route path="/run/trial/:num" element={<TrialDetail />} />
              <Route path="/library" element={<Library />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
