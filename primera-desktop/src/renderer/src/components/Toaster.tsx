/**
 * TOASTER — menampilkan GameEvent penting sebagai toast kertas kecil.
 * Membaca lastEvents dari store; tidak menyimpan state game apa pun.
 */

import { useEffect, useState } from 'react'
import { useGame } from '../store'
import type { GameEvent } from '@engine/events'
import './Toaster.css'

interface Toast {
  id: number
  teks: string
  nada: 'info' | 'sukses' | 'bahaya'
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

  useEffect(() => {
    const baru = lastEvents.map(eventKeToast).filter((t): t is Toast => t !== null)
    if (baru.length === 0) return
    setToasts((prev) => [...prev, ...baru].slice(-4))
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => !baru.some((b) => b.id === t.id)))
    }, 4200)
    return () => clearTimeout(timer)
  }, [eventTick]) // eslint-disable-line react-hooks/exhaustive-deps

  if (toasts.length === 0) return null

  return (
    // M10 §49: role=status + aria-live — toast keselamatan (KONTRAINDIKASI
    // alergi, Kode Hitam, IGD tiba, ERROR_AKSI) dulu tak diumumkan ke pembaca
    // layar sama sekali. `assertive` krn sebagian bersifat peringatan; `atomic`
    // agar tiap toast dibacakan utuh. aria-hidden pada wrapper visual? tidak —
    // justru ini SATU-SATUNYA live-region gameplay.
    <div className="toaster" role="status" aria-live="assertive" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.nada} kertas`}>
          {t.teks}
        </div>
      ))}
    </div>
  )
}
