/**
 * TOASTER — menampilkan GameEvent penting sebagai toast kertas kecil.
 * Membaca lastEvents dari store; tidak menyimpan state game apa pun.
 */

import { useEffect, useRef, useState } from 'react'
import { useGame } from '../store'
import type { GameEvent } from '@engine/events'
import './Toaster.css'

interface Toast {
  id: number
  teks: string
  nada: 'info' | 'sukses' | 'bahaya'
  /** Fase keluar: memicu animasi mengabur sebelum benar-benar dihapus. */
  keluar?: boolean
}

const TOAST_TAHAN = 3800 // ms tampil penuh sebelum mulai mengabur
const TOAST_MENGABUR = 450 // ms durasi animasi keluar (samakan Toaster.css)

function eventKeToast(e: GameEvent): Toast | null {
  const id = Math.random()
  switch (e.type) {
    case 'ERROR_AKSI':
      return { id, teks: e.pesan, nada: 'bahaya' }
    case 'FIREWALL_ALERGI':
      return { id, teks: `KONTRAINDIKASI — pasien alergi golongan ${e.golongan}!`, nada: 'bahaya' }
    case 'KARMA_TERJADI':
      return { id, teks: e.narasi, nada: 'bahaya' }
    case 'KODE_HITAM':
      return { id, teks: e.narasi, nada: 'bahaya' }
    case 'IGD_TIBA':
      return { id, teks: e.narasi, nada: 'bahaya' }
    case 'KARMA_DICEGAH':
      return { id, teks: e.narasi, nada: 'sukses' }
    case 'DEX_BERTAMBAH':
      return { id, teks: `Buku Saku diperbarui (★${e.bintang})`, nada: 'info' }
    case 'KEGIATAN_SELESAI':
      return {
        id,
        teks: `Kegiatan selesai — ${e.hasil.benar}/${e.hasil.total} tepat`,
        nada: e.hasil.skor >= 0.6 ? 'sukses' : 'info',
      }
    case 'PEMULIHAN_SELESAI':
      return { id, teks: e.narasi, nada: 'sukses' }
    case 'SURAT_MASUK':
      return { id, teks: `Surat baru: ${e.surat.judul}`, nada: 'info' }
    default:
      return null
  }
}

export function Toaster() {
  const lastEvents = useGame((s) => s.lastEvents)
  const eventTick = useGame((s) => s.eventTick)
  const [toasts, setToasts] = useState<Toast[]>([])
  // M10 §49 (CODEX A.2): dulu SATU timer per-effect di-clearTimeout saat effect
  // re-run (event berikutnya) — jadi penghapusan batch SEBELUMNYA dibatalkan &
  // toast lama menetap SELAMANYA. Kini tiap batch punya timer sendiri yang
  // hidup sampai tuntas; ref hanya utk membersihkan sisa timer saat unmount.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const baru = lastEvents.map(eventKeToast).filter((t): t is Toast => t !== null)
    if (baru.length === 0) return
    setToasts((prev) => [...prev, ...baru].slice(-4))
    const cocok = (t: Toast) => baru.some((b) => b.id === t.id)
    // Dua fase: (1) tandai `keluar` → animasi mengabur (Toaster.css); (2) hapus
    // dari daftar setelah animasi tuntas. Tiap batch punya timernya sendiri —
    // TAK dibatalkan oleh datangnya batch berikutnya (bug lama A.2).
    const tFade = setTimeout(() => {
      setToasts((prev) => prev.map((t) => (cocok(t) ? { ...t, keluar: true } : t)))
    }, TOAST_TAHAN)
    const tHapus = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => !cocok(t)))
      timers.current = timers.current.filter((x) => x !== tFade && x !== tHapus)
    }, TOAST_TAHAN + TOAST_MENGABUR)
    timers.current.push(tFade, tHapus)
  }, [eventTick]) // eslint-disable-line react-hooks/exhaustive-deps

  // Bersihkan semua timer tertunda HANYA saat unmount (cegah setState-after-unmount).
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  if (toasts.length === 0) return null

  return (
    // CODEX audit UI/UX 2026-07-10 (#25): role/aria-live/aria-atomic dipasang
    // per-toast (bukan di wrapper) — wrapper membungkus hingga 4 toast
    // sekaligus, jadi aria-atomic di situ membuat pembaca layar berpotensi
    // membacakan ULANG seluruh isi wrapper tiap mutasi, bukan cuma toast baru.
    <div className="toaster">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast--${t.nada} kertas${t.keluar ? ' toast--keluar' : ''}`}
          role="status"
          aria-live="assertive"
          aria-atomic="true"
        >
          {t.teks}
        </div>
      ))}
    </div>
  )
}
