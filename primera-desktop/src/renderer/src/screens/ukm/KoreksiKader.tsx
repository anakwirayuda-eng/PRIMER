import { useGame } from '../../store'
import { LABEL_INDIKATOR } from '../peta/petaUtil'
import type { RekapUkm } from './rekapUkm'

export function KoreksiKader({ jenis, keluargaId, rw }: { jenis: RekapUkm['jenis']; keluargaId?: string; rw?: number }) {
  const rekap = useGame((s) => s.rekapUkm)
  const hari = useGame((s) => s.state?.hari)
  if (!rekap || rekap.hari !== hari || rekap.jenis !== jenis || rekap.keluargaId !== keluargaId || rekap.rw !== rw || rekap.koreksi.length === 0) return null
  return <details className="lab-details" open><summary>Hasil verifikasi yang meluruskan laporan kader</summary>
    <ul>{rekap.koreksi.map((k) => <li key={`${k.keluargaId}:${k.indikator}`}><b>{k.nama}</b> — {LABEL_INDIKATOR[k.indikator].penuh}: laporan {k.kader}, kader RW {k.rw}, tercatat <b>{k.sebelum}</b>; hasil verifikasi dokter <b>{k.sesudah}</b>.</li>)}</ul>
    <p>Perbedaan ini berlaku pada kolom yang diverifikasi dalam sesi ini. Ini bukan penilaian atas seluruh laporan kader.</p>
  </details>
}
