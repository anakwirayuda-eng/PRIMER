import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/base.css'

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
    <App />
  </React.StrictMode>,
)
