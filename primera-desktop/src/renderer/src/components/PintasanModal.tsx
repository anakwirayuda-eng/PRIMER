/**
 * PINTASAN KEYBOARD (audit premium 2026-07-23) — satu tempat yang mendaftar
 * seluruh shortcut game (pola "?" game desktop komersial). Dibuka dari
 * Pengaturan atau tombol "?" global (di luar ketikan/modal). Murni display.
 */

import { useFocusTrap } from '../useFocusTrap'
import './PintasanModal.css'

const DAFTAR: { tombol: string; aksi: string }[] = [
  { tombol: '1 – 5', aksi: 'Pindah layar: Meja Kerja · Klinik · Peta Desa · Buku Saku · Rapor' },
  { tombol: '/ atau Ctrl+F', aksi: 'Fokus ke kolom pencarian (Buku Saku)' },
  { tombol: 'Esc', aksi: 'Tutup dialog · bersihkan kolom pencarian (dua tahap)' },
  { tombol: '← / →', aksi: 'Pindah tab Terapi (Resep · Edukasi · Tindakan)' },
  { tombol: 'Tab / Shift+Tab', aksi: 'Jelajahi kontrol' },
  { tombol: 'Enter / Spasi', aksi: 'Aktifkan tombol yang terfokus' },
  { tombol: '?', aksi: 'Buka daftar pintasan ini' },
]

export function PintasanModal({ onTutup }: { onTutup: () => void }) {
  const ref = useFocusTrap<HTMLDivElement>(true, onTutup)
  return (
    <div className="overlay" onClick={onTutup}>
      <div
        ref={ref}
        className="modal kertas pintasan-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Pintasan Keyboard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="baris baris--antara">
          <h2 className="judul-seksi">Pintasan Keyboard</h2>
          <button className="tombol tombol--senyap" onClick={onTutup} aria-label="Tutup">
            ✕
          </button>
        </div>
        <dl className="pintasan-modal__daftar">
          {DAFTAR.map((p) => (
            <div key={p.tombol} className="pintasan-modal__baris">
              <dt>
                <kbd className="pintasan-modal__kbd">{p.tombol}</kbd>
              </dt>
              <dd className="teks-kecil">{p.aksi}</dd>
            </div>
          ))}
        </dl>
        <p className="teks-xs teks-lembut">
          Pintasan angka menghormati aturan layar yang sama dengan tombol tab — layar terkunci
          tetap terkunci; pintasan mati saat kamu sedang mengetik atau ada dialog terbuka.
        </p>
      </div>
    </div>
  )
}
