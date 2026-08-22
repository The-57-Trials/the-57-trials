import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { RequireAuth, RequireAdmin } from './components/Protected'
import Landing from './pages/Landing'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Run from './pages/Run'
import TrialDetail from './pages/TrialDetail'
import Board from './pages/Board'
import Account from './pages/Account'
import Admin from './pages/Admin'

export default function App() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
