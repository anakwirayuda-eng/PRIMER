import { describe, expect, it } from 'vitest'
import type { HasilAkhirKunjungan, HasilKunjungan } from '@engine/state'
import { tampilanHasilKunjungan } from './hasilKunjunganView'

function hasil(hasilAkhir: HasilAkhirKunjungan): HasilKunjungan {
  return {
    keluargaId: 'keluarga_uji',
    skenarioId: 'uji',
    hasilAkhir,
    berhasil: hasilAkhir === 'berhasil',
    diusir: hasilAkhir === 'diusir',
    hipotesisBenar: false,
    trustDelta: 0,
    kualitasMi: 0,
    kualitasSaji: 0,
    indikatorTerverifikasi: [],
    narasiPenutup: 'Selesai.',
  }
}

describe('tampilanHasilKunjungan E-2', () => {
  it('keenam hasil punya label eksplisit; penutupan kontak dibedakan dari hasil substantif', () => {
    const semua: HasilAkhirKunjungan[] = [
      'berhasil',
      'partial',
      'gagal',
      'diusir',
      'ditolak_total',
      'diterima_terpaksa',
    ]
    const tampilan = semua.map((item) => tampilanHasilKunjungan(hasil(item)))
    expect(new Set(tampilan.map((item) => item.label)).size).toBe(6)
    expect(tampilan.slice(0, 4).every((item) => item.substantif)).toBe(true)
    expect(tampilan.slice(4).every((item) => !item.substantif)).toBe(true)
  })
})
