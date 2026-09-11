import { describe, expect, it } from 'vitest'
import { buildInitialState } from '@engine/init'
import type { HasilKunjungan } from '@engine/state'
import { PACK } from '@content/index'
import { catatRekapUkm } from './rekapUkm'

describe('atribusi koreksi laporan kader', () => {
  it('pengakuan yang tidak terverifikasi tidak dituduhkan sebagai kesalahan kader', () => {
    const sebelum = buildInitialState('Koreksi', 131, PACK)
    const sesudah = structuredClone(sebelum)
    sebelum.desa.keluarga.keluarga_wulan!.indikator.tidak_merokok.sumber = 'kader'
    sebelum.desa.keluarga.keluarga_wulan!.indikator.tidak_merokok.status = 'ya'
    sesudah.desa.keluarga.keluarga_wulan!.indikator.tidak_merokok.sumber = 'dokter'
    sesudah.desa.keluarga.keluarga_wulan!.indikator.tidak_merokok.status = 'tidak'
    const hasil: HasilKunjungan = { keluargaId: 'keluarga_wulan', skenarioId: 'wulan_k1', hasilAkhir: 'berhasil', berhasil: true, diusir: false, hipotesisBenar: true, trustDelta: 1, kualitasMi: 100, kualitasSaji: 100, indikatorTerverifikasi: [], narasiPenutup: 'Selesai' }
    const tanpaBukti = catatRekapUkm(sebelum, sesudah, [{ type: 'KUNJUNGAN_SELESAI', hasil }], { type: 'PILIH_INTERVENSI', intervensiId: 'uji' })
    expect(tanpaBukti?.koreksi).toEqual([])
    const denganBukti = catatRekapUkm(sebelum, sesudah, [{ type: 'KUNJUNGAN_SELESAI', hasil: { ...hasil, indikatorTerverifikasi: ['tidak_merokok'] } }], { type: 'PILIH_INTERVENSI', intervensiId: 'uji' })
    expect(denganBukti?.koreksi).toHaveLength(1)
    expect(denganBukti?.koreksi[0]).toMatchObject({ keluargaId: 'keluarga_wulan', rw: PACK.keluarga.keluarga_wulan!.rw, sebelum: 'ya', sesudah: 'tidak' })
  })
})
