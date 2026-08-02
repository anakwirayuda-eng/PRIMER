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
  const KEY_TELEMETRI = 'primer.telemetri'
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
    telemetri: {
      append: async (baris) => {
        const lama = localStorage.getItem(KEY_TELEMETRI) ?? ''
        localStorage.setItem(KEY_TELEMETRI, lama + baris.replace(/\n/g, ' ') + '\n')
        return true
      },
      read: async () => (localStorage.getItem(KEY_TELEMETRI) ?? '').split('\n').filter((b) => b.trim().length > 0),
    },
    runtime: {
      consumeRecovery: async () => null,
      readCrashLog: async () => [],
      logError: async () => true,
    },
    appVersion: async () => 'browser-preview',
  }
}

// A8 telemetri (2026-08-02): error JS yang LOLOS dari ErrorBoundary (listener
// event, promise yatim, kode di luar pohon React) dulu lenyap di konsol yang
// tak pernah dilihat siapa pun di mesin mahasiswa. Catat ke log crash lokal —
// dibatasi 10 entri per sesi supaya error berulang tak membanjiri log forensik.
let sisaKuotaLogError = 10
function catatErrorGlobal(pesan: string, stack?: string): void {
  if (sisaKuotaLogError <= 0) return
  sisaKuotaLogError--
  void window.primer?.runtime?.logError?.({ pesan, stack: stack ?? '' }).catch(() => {})
}
window.addEventListener('error', (e) => {
  catatErrorGlobal(`[window.onerror] ${e.message}`, e.error instanceof Error ? e.error.stack : undefined)
})
window.addEventListener('unhandledrejection', (e) => {
  const alasan = e.reason
  catatErrorGlobal(
    `[unhandledrejection] ${alasan instanceof Error ? alasan.message : String(alasan).slice(0, 200)}`,
    alasan instanceof Error ? alasan.stack : undefined,
  )
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary judul="root" variant="penuh">
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
