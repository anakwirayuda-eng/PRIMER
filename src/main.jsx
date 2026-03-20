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

// 🛡️ Invisible watermark — forensic evidence for IP disputes
// Opacity 0.01 = invisible to eye, visible when contrast is raised on screen recordings
const _wm = document.createElement('div');
_wm.textContent = 'PRIMER © A.A.B. Wirayuda | HAKI EC002026019623';
_wm.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)rotate(-35deg);font-size:48px;opacity:0.01;pointer-events:none;z-index:99999;width:200vw;text-align:center;user-select:none;color:#888;';
document.body.appendChild(_wm);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
