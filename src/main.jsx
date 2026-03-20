/**
 * @reflection
 * [IDENTITY]: PRIMER Main Entry
 * [PURPOSE]: Initializes the React application and mounts the root App component.
 * [STATE]: Stable
 * [LAST_UPDATE]: 2026-02-12
 * [DEPENDS_ON]: App.jsx, index.css
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { installCrashTrap } from './utils/crashTrap.js'
import './index.css'
import './i18n'
import App from './App.jsx'

installCrashTrap();

// 🩺 Psychological deterrent for F12 DevTools visitors
console.log(
  "%c🩺 PERINGATAN KOMITE ETIK RUMAH SAKIT",
  "color: red; font-size: 20px; font-weight: bold;"
);
console.log(
  "%cHalo Sejawat! Mengubah rekam medis pasien (LocalStorage) adalah pelanggaran Sumpah Dokter.\nSegala bentuk 'Malpraktik Digital' akan tercatat di sistem dan dapat mencabut peringkat Anda.",
  "font-size: 13px; color: #F59E0B;"
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
