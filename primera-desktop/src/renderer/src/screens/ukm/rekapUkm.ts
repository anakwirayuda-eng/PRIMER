import type { GameState, KartuKegiatan } from '@engine/state'
import type { GameEvent } from '@engine/events'
import type { Action } from '@engine/actions'
import type { IndikatorPisPk } from '@content/types'
import { PACK } from '@content/index'
import { skenarioEfektif } from '@engine/kunjungan'
import { kaderRw } from '../peta/petaUtil'

export interface KoreksiKader {
  keluargaId: string; nama: string; rw: number; kader: string; indikator: IndikatorPisPk; sebelum: string; sesudah: string
}
export interface RekapUkm {
  hari: number; jenis: 'kunjungan' | 'posyandu' | 'prolanis' | 'klb'; keluargaId?: string; rw?: number
  koreksi: KoreksiKader[]; gaya: string[]
  kartu?: KartuKegiatan[]; dijawabDokter?: number
}

/** Cuplikan UI saat transaksi berhasil, tidak diserialisasi ke GameState. */
export function catatRekapUkm(sebelum: GameState, sesudah: GameState, events: GameEvent[], action: Action): RekapUkm | null {
  const kunjungan = events.find((e) => e.type === 'KUNJUNGAN_SELESAI')
  const kegiatan = events.find((e) => e.type === 'KEGIATAN_SELESAI')
  if (!kunjungan && !kegiatan) return null
  const jenis = kunjungan ? 'kunjungan' : kegiatan!.hasil.jenis
  const keluargaId = kunjungan?.hasil.keluargaId
  const rw = keluargaId ? PACK.keluarga[keluargaId]?.rw : kegiatan?.hasil.rw
  const koreksi: KoreksiKader[] = []
  if (kunjungan || jenis === 'posyandu') {
    for (const [id, kel] of Object.entries(sebelum.desa.keluarga)) {
      const content = PACK.keluarga[id]
      if (!content || (kunjungan ? id !== keluargaId : content.rw !== rw)) continue
      for (const ind of Object.keys(kel.indikator) as IndikatorPisPk[]) {
        if (kunjungan && !kunjungan.hasil.indikatorTerverifikasi.includes(ind)) continue
        const a = kel.indikator[ind], b = sesudah.desa.keluarga[id]?.indikator[ind]
        if (a.sumber !== 'kader' || !b || b.sumber !== 'dokter' || a.status === b.status) continue
        koreksi.push({ keluargaId: id, nama: content.namaKeluarga, rw: content.rw, kader: kaderRw(sebelum, content.rw)?.nama ?? 'Kader', indikator: ind, sebelum: a.status, sesudah: b.status })
      }
    }
  }
  const kj = sebelum.kunjungan
  const dasar = kj ? PACK.keluarga[kj.keluargaId]?.arc.kunjungan.find((s) => s.id === kj.skenarioId) : undefined
  const skenario = dasar ? skenarioEfektif(dasar, kj?.varianId) : undefined
  const pilihanIds = [...(kj?.pilihanDiambil ?? []), ...(action.type === 'PILIH_DIALOG' ? [action.pilihanId] : [])]
  const semuaPilihan = skenario?.dialog.flatMap((node) => node.pilihan) ?? []
  const gaya = pilihanIds.flatMap((id) => { const p = semuaPilihan.find((p) => p.id === id); return p ? [p.gaya.replaceAll('_', '-')] : [] })
  return { hari: sebelum.hari, jenis, keluargaId, rw, koreksi, gaya,
    kartu: sebelum.kegiatan?.kartu,
    dijawabDokter: kegiatan ? (action.type === 'DELEGASI_KEGIATAN' ? sebelum.kegiatan?.jawaban.length : kegiatan.hasil.jawaban.length) : undefined }
}
