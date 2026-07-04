/**
 * PENGATURAN (M7 butir 31) — tombol gigi melayang + modal preferensi:
 * volume musik & SFX terpisah, ukuran teks, mode gelap (auto/siang/malam),
 * reduksi gerak. Semua tersimpan di settings.ts (persist localStorage) dan
 * berlaku live. Tombol "Tentang" membuka modal kredit/HKI (butir 35).
 */

import { useState } from 'react'
import { setPengaturan, PENGATURAN_DEFAULT, type ModeMalam } from '../settings'
import { usePengaturan } from '../usePengaturan'
import { TentangModal } from './TentangModal'
import './Pengaturan.css'

const MODE_LABEL: Record<ModeMalam, string> = {
  auto: 'Otomatis',
  siang: 'Terang',
  malam: 'Gelap',
}

export function Pengaturan() {
  const [buka, setBuka] = useState(false)
  const [tentang, setTentang] = useState(false)
  const p = usePengaturan()
  const persen = (n: number) => `${Math.round(n * 100)}%`

  return (
    <>
      <button
        type="button"
        className="set-gigi"
        onClick={() => setBuka(true)}
        aria-label="Buka Pengaturan"
        title="Pengaturan"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {buka && (
        <div className="set-overlay" onClick={() => setBuka(false)}>
          <div className="set-modal kertas" role="dialog" aria-label="Pengaturan" onClick={(e) => e.stopPropagation()}>
            <div className="baris baris--antara">
              <h2 className="judul-seksi">Pengaturan</h2>
              <button className="tombol tombol--senyap" onClick={() => setBuka(false)} aria-label="Tutup">✕</button>
            </div>

            <label className="set-baris">
              <span>Volume Musik</span>
              <input type="range" min="0" max="1" step="0.05" value={p.volumeMusik}
                onChange={(e) => setPengaturan({ volumeMusik: Number(e.target.value) })} />
              <span className="set-nilai mono">{persen(p.volumeMusik)}</span>
            </label>

            <label className="set-baris">
              <span>Volume Efek Suara</span>
              <input type="range" min="0" max="1" step="0.05" value={p.volumeSfx}
                onChange={(e) => setPengaturan({ volumeSfx: Number(e.target.value) })} />
              <span className="set-nilai mono">{persen(p.volumeSfx)}</span>
            </label>

            <label className="set-baris">
              <span>Ukuran Teks</span>
              <input type="range" min="0.9" max="1.4" step="0.05" value={p.ukuranTeks}
                onChange={(e) => setPengaturan({ ukuranTeks: Number(e.target.value) })} />
              <span className="set-nilai mono">{persen(p.ukuranTeks)}</span>
            </label>

            <div className="set-baris">
              <span>Mode Tampilan</span>
              <div className="set-segmen" role="radiogroup" aria-label="Mode tampilan">
                {(['auto', 'siang', 'malam'] as ModeMalam[]).map((m) => (
                  <button key={m} type="button"
                    className={`tombol ${p.modeMalam === m ? 'tombol--utama' : ''}`}
                    aria-pressed={p.modeMalam === m}
                    onClick={() => setPengaturan({ modeMalam: m })}>
                    {MODE_LABEL[m]}
                  </button>
                ))}
              </div>
            </div>

            <label className="set-baris set-baris--switch">
              <span>Kurangi Gerak/Animasi</span>
              <input type="checkbox" checked={p.kurangiGerak}
                onChange={(e) => setPengaturan({ kurangiGerak: e.target.checked })} />
            </label>

            <div className="baris baris--antara set-kaki">
              <button className="tombol tombol--senyap" onClick={() => setPengaturan({ ...PENGATURAN_DEFAULT })}>
                Kembalikan Default
              </button>
              <button className="tombol" onClick={() => setTentang(true)}>Tentang &amp; Kredit</button>
            </div>
          </div>
        </div>
      )}

      {tentang && <TentangModal onTutup={() => setTentang(false)} />}
    </>
  )
}
