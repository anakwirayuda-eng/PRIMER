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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
