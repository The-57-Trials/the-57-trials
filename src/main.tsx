import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './lib/auth'
import './styles/global.css'

// One canonical address. Render serves every attached domain directly and has
// no cross-domain redirect, so the .co.uk is folded into the .com here —
// otherwise auth callbacks and Stripe returns can land on a different host
// than the session was started on.
const CANONICAL_HOST = 'the57trials.com'
const ALIAS_HOSTS = ['the57trials.co.uk', 'www.the57trials.co.uk']

if (ALIAS_HOSTS.includes(window.location.hostname)) {
  const { pathname, search, hash } = window.location
  window.location.replace(`https://${CANONICAL_HOST}${pathname}${search}${hash}`)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
