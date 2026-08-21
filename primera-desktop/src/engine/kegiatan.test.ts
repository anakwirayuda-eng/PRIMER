/**
 * KEGIATAN — kartu Prolanis: respons yang dibaca pemain harus menjanjikan
 * persis mekanik yang dijalankan engine, tidak lebih.
 */

import { describe, expect, it } from 'vitest'
import { Rng } from './core/rng'
import { driftProlanis, kartuProlanis, prolanisTerkendali } from './kegiatan'
import type { PesertaProlanis } from './state'

function pesertaHt(override: Partial<PesertaProlanis> = {}): PesertaProlanis {
  return {
    id: 'ht_sumarni',
    nama: 'Bu Sumarni',
    usia: 58,
    jenisKelamin: 'P',
    rw: 2,
    jenis: 'ht',
    param: 165,
    takTerkontrolBerturut: 1,
    ...override,
  }
}

describe('kartu Prolanis HT tak terkendali — opsi rujuk dini', () => {
  const kartu = kartuProlanis([pesertaHt()], new Rng(7, 'prolanis'))[0]!
  const rujukDini = kartu.pilihan.find((p) => p.id === 'c')!

  it('tidak menjanjikan mekanik encounter klinik yang tak berlaku di sesi Prolanis', () => {
    expect(rujukDini.benar).toBe(false)
    // RRNS hanya diisi tally rujukan klinik; cap grade hanya ada pada encounter
    // klinik — sesi Prolanis tak menyentuh keduanya.
    expect(rujukDini.respons).not.toMatch(/RRNS/i)
    expect(rujukDini.respons).not.toMatch(/mengunci nilai|encounter/i)
  })

  it('konsekuensi yang dijanjikannya memang terjadi: peserta tetap tak terkendali', () => {
    expect(rujukDini.respons).toMatch(/tak terkendali/i)
    const sesudah = driftProlanis(pesertaHt(), rujukDini.benar, new Rng(7, 'drift'))
    expect(sesudah.param).toBeGreaterThan(165)
    expect(prolanisTerkendali('ht', sesudah.param)).toBe(false)
    expect(sesudah.takTerkontrolBerturut).toBe(2)
  })
})
