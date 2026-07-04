/**
 * MuteButton — tombol kecil melayang di pojok kiri bawah untuk membisukan
 * seluruh audio. Status persist di localStorage (ditangani synth.ts).
 * Dipasang di App oleh integrator: `<MuteButton />`.
 */

import { useSyncExternalStore } from 'react'
import { initAudio, isMuted, toggleMute, subscribeMute } from './synth'
import './MuteButton.css'

export function MuteButton() {
  const bisu = useSyncExternalStore(subscribeMute, isMuted)

  const klik = (): void => {
    // Klik tombol juga gesture — pastikan mesin audio hidup sebelum unmute.
    initAudio()
    toggleMute()
  }

  return (
    <button
      type="button"
      className={`mute-tombol${bisu ? ' mute-tombol--bisu' : ''}`}
      onClick={klik}
      aria-pressed={bisu}
      aria-label={bisu ? 'Nyalakan suara' : 'Matikan suara'}
      title={bisu ? 'Suara mati — klik untuk menyalakan' : 'Suara hidup — klik untuk membisukan'}
    >
      <svg
        className="mute-ikon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Corong speaker */}
        <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" fill="currentColor" stroke="none" />
        {bisu ? (
          /* Silang: suara mati */
          <>
            <line x1="15" y1="9.5" x2="21" y2="15.5" />
            <line x1="21" y1="9.5" x2="15" y2="15.5" />
          </>
        ) : (
          /* Gelombang: suara hidup */
          <>
            <path d="M14.5 9.5a4 4 0 0 1 0 5" />
            <path d="M17 7.5a7 7 0 0 1 0 9" />
          </>
        )}
      </svg>
    </button>
  )
}
