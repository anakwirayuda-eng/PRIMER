/**
 * DIALOG GAME (audit premium 2026-07-23) — pengganti window.confirm/alert.
 * Dialog OS native tampil sebagai kotak sistem mentah di tengah game bergaya
 * kertas (memutus imersi, tak bisa distyle, label tombol bahasa OS). Komponen
 * ini memakai bahasa visual game (kertas, stempel, tombol token) dengan pola
 * dialog WAI-ARIA yang sama seperti 7 titik modal lain.
 *
 * Dua mode:
 * - Konfirmasi (labelYa terisi): Batal (kiri, senyap) + aksi utama (kanan).
 * - Pemberitahuan (labelYa kosong): satu tombol "Mengerti".
 *
 * Keselamatan overwrite (preseden CODEX M14 #14b): fokus awal ke KONTAINER,
 * bukan tombol pertama — Enter refleks saat dialog baru muncul tidak boleh
 * mengeksekusi aksi destruktif. Esc & klik latar = batal (tanpa aksi).
 */

import { useFocusTrap } from '../useFocusTrap'
import './DialogGame.css'

export interface PropsDialogGame {
  judul: string
  pesan: string
  /** Label tombol aksi utama; kosongkan untuk mode pemberitahuan. */
  labelYa?: string
  /** Dipanggil saat pemain menyetujui aksi (setelah dialog ditutup pemanggil). */
  onYa?: () => void
  /** Tutup tanpa aksi — Batal, Mengerti, Esc, atau klik latar. */
  onTutup: () => void
  /** Aksi destruktif: tombol utama memakai gaya bahaya. */
  bahaya?: boolean
}

export function DialogGame({ judul, pesan, labelYa, onYa, onTutup, bahaya }: PropsDialogGame) {
  const ref = useFocusTrap<HTMLDivElement>(true, onTutup, { fokusKontainer: true })
  const modeKonfirmasi = labelYa !== undefined
  return (
    <div className="overlay" onClick={onTutup}>
      <div
        ref={ref}
        className="modal kertas dialog-game"
        role="dialog"
        aria-modal="true"
        aria-label={judul}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={`stempel stempel--kecil ${bahaya ? 'stempel--merah' : 'stempel--biru'}`}>
          {modeKonfirmasi ? 'Perlu Keputusan' : 'Pemberitahuan'}
        </span>
        <h2 className="dialog-game__judul">{judul}</h2>
        <p className="dialog-game__pesan">{pesan}</p>
        <div className="baris baris--kanan dialog-game__aksi">
          {modeKonfirmasi ? (
            <>
              <button type="button" className="tombol tombol--senyap" onClick={onTutup}>
                Batal
              </button>
              <button
                type="button"
                className={`tombol ${bahaya ? 'tombol--bahaya' : 'tombol--utama'}`}
                onClick={() => {
                  onTutup()
                  onYa?.()
                }}
              >
                {labelYa}
              </button>
            </>
          ) : (
            <button type="button" className="tombol tombol--utama" onClick={onTutup}>
              Mengerti
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
