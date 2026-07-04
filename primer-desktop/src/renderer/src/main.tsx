import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './styles/base.css'

// Jaring error asinkron yang tak tertangkap: rejected promise & error di luar
// siklus render (mis. handler event async) tak ditangkap ErrorBoundary. Minimal:
// catat dengan jelas supaya tak hilang senyap saat playtest/di lab.
window.addEventListener('error', (e) => {
  console.error('[window.onerror]', e.error ?? e.message)
})
window.addEventListener('unhandledrejection', (e) => {
  console.error('[unhandledrejection]', e.reason)
})

// Fallback di luar Electron (preview browser / dev vite murni): simpan ke localStorage.
if (typeof window.primer === 'undefined') {
  const key = (slot: string) => `primer.save.${slot}`
  window.primer = {
    save: {
      write: async (slot, json) => {
        localStorage.setItem(key(slot), json)
        return true
      },
      read: async (slot) => localStorage.getItem(key(slot)),
      list: async () =>
        Object.keys(localStorage)
          .filter((k) => k.startsWith('primer.save.'))
          .map((k) => ({ slot: k.replace('primer.save.', ''), mtimeMs: 0, size: (localStorage.getItem(k) ?? '').length })),
      delete: async (slot) => {
        localStorage.removeItem(key(slot))
        return true
      },
    },
    appVersion: async () => 'browser-preview',
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary judul="root" variant="penuh">
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
