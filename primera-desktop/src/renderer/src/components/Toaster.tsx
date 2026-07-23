/**
 * TOASTER — menampilkan GameEvent penting sebagai toast kertas kecil.
 * Membaca lastEvents dari store; tidak menyimpan state game apa pun.
 *
 * Audit premium 2026-07-23 — tiga upgrade operasional:
 * 1. Durasi adaptif: narasi panjang (Kode Hitam, karma) dulu hilang di 3,8 dtk
 *    sama seperti "Surat baru" 3 kata — kini durasi ikut panjang teks (min
 *    tetap 3,8 dtk, plafon 9 dtk) supaya sempat terbaca.
 * 2. Hover = pause: mengarahkan pointer ke toast menahan hitungannya (pola
 *    standar toast komersial) — pemain yang sedang membaca tak dikejar timer.
 * 3. Klik = tutup: toast bisa disingkirkan segera tanpa menunggu.
 * Konsekuensi sadar: .toast kini pointer-events:auto (wrapper tetap none) —
 * toast di zona atas-kanan yang memang dipilih (M10 §49) karena jauh dari
 * tombol aksi, jadi risiko menelan klik konten praktis nol.
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

const TOAST_TAHAN = 3800 // ms tampil penuh minimum sebelum mulai mengabur
const TOAST_TAHAN_MAKS = 9000 // plafon utk narasi terpanjang
const TOAST_MENGABUR = 450 // ms durasi animasi keluar (samakan Toaster.css)
const TOAST_LANJUT_HOVER = 1600 // ms sisa waktu setelah pointer meninggalkan toast

/** Durasi tampil ∝ panjang teks (≈55 ms/karakter di atas ambang dasar). */
function durasiToast(teks: string): number {
  return Math.min(TOAST_TAHAN_MAKS, Math.max(TOAST_TAHAN, 1800 + teks.length * 55))
}

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
  // toast lama menetap SELAMANYA. Kini timer dikelola PER-TOAST dalam Map
  // (audit premium 2026-07-23: perlu granular utk pause-hover & klik-tutup);
  // tiap toast hidup sampai timernya sendiri tuntas atau pemain menutupnya.
  const timers = useRef(
    new Map<number, { fade: ReturnType<typeof setTimeout>; hapus: ReturnType<typeof setTimeout> }>(),
  )

  const bersihkanTimer = (id: number) => {
    const t = timers.current.get(id)
    if (t === undefined) return
    clearTimeout(t.fade)
    clearTimeout(t.hapus)
    timers.current.delete(id)
  }

  /** Jadwalkan fase mengabur + penghapusan sebuah toast `tahan` ms dari sekarang. */
  const jadwalkanKeluar = (id: number, tahan: number) => {
    bersihkanTimer(id)
    const fade = setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, keluar: true } : t)))
    }, tahan)
    const hapus = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      timers.current.delete(id)
    }, tahan + TOAST_MENGABUR)
    timers.current.set(id, { fade, hapus })
  }

  /** Klik pemain: langsung masuk fase mengabur tanpa menunggu sisa timer. */
  const tutupToast = (id: number) => jadwalkanKeluar(id, 0)

  /** Pointer masuk: tahan hitungan (jangan usir pemain yang sedang membaca). */
  const tahanToast = (t: Toast) => {
    if (t.keluar) return // sudah mengabur — biarkan selesai
    bersihkanTimer(t.id)
  }

  /** Pointer keluar: lanjutkan dengan sisa waktu pendek yang wajar. */
  const lanjutkanToast = (t: Toast) => {
    if (t.keluar || timers.current.has(t.id)) return
    jadwalkanKeluar(t.id, TOAST_LANJUT_HOVER)
  }

  useEffect(() => {
    let aktif = true
    if (!window.primer?.runtime) return () => {
      aktif = false
    }
    void window.primer.runtime.consumeRecovery().then((notice) => {
      if (!aktif || !notice) return
      const toast: Toast = {
        id: Math.random(),
        teks: 'PRIMERA sempat mengalami gangguan dan memulihkan sesi dari autosave. Progres terakhir tetap tersimpan.',
        nada: 'bahaya',
      }
      setToasts((prev) => [...prev, toast].slice(-4))
      jadwalkanKeluar(toast.id, durasiToast(toast.teks))
    }).catch((error) => console.error('Gagal membaca status pemulihan runtime:', error))
    return () => {
      aktif = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const baru = lastEvents.map(eventKeToast).filter((t): t is Toast => t !== null)
    if (baru.length === 0) return
    setToasts((prev) => [...prev, ...baru].slice(-4))
    baru.forEach((t) => jadwalkanKeluar(t.id, durasiToast(t.teks)))
  }, [eventTick]) // eslint-disable-line react-hooks/exhaustive-deps

  // Bersihkan semua timer tertunda HANYA saat unmount (cegah setState-after-unmount).
  useEffect(
    () => () => {
      timers.current.forEach((t) => {
        clearTimeout(t.fade)
        clearTimeout(t.hapus)
      })
    },
    [],
  )

  if (toasts.length === 0) return null

  return (
    // CODEX audit UI/UX 2026-07-10 (#25): role/aria-live/aria-atomic dipasang
    // per-toast (bukan di wrapper) — wrapper membungkus hingga 4 toast
    // sekaligus, jadi aria-atomic di situ membuat pembaca layar berpotensi
    // membacakan ULANG seluruh isi wrapper tiap mutasi, bukan cuma toast baru.
    <div className="toaster">
      {toasts.map((t) => (
        // CODEX M14 #22: aria-live per NADA — dulu SEMUA toast 'assertive'
        // (termasuk info spt "Surat baru"/"Buku Saku diperbarui"), saling menyela
        // pengumuman screen reader; batch Kode Hitam bahkan memancarkan 2 region
        // assertive serentak. Kini hanya 'bahaya' yang assertive (role=alert);
        // info/sukses jadi polite (role=status) — mis. SURAT_MASUK yang menyertai
        // KODE_HITAM kini polite, tak lagi bentrok assertive dgn kode hitam itu.
        <div
          key={t.id}
          className={`toast toast--${t.nada} kertas${t.keluar ? ' toast--keluar' : ''}`}
          role={t.nada === 'bahaya' ? 'alert' : 'status'}
          aria-live={t.nada === 'bahaya' ? 'assertive' : 'polite'}
          aria-atomic="true"
          onClick={() => tutupToast(t.id)}
          onMouseEnter={() => tahanToast(t)}
          onMouseLeave={() => lanjutkanToast(t)}
        >
          {t.teks}
          <span className="toast__tutup" aria-hidden="true">✕</span>
        </div>
      ))}
    </div>
  )
}
