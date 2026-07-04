import { describe, expect, it } from 'vitest'
import { nilaiKeputusan } from './penilaian'
import type { KartuPasien } from './types'

function pasien(over: Partial<KartuPasien>): KartuPasien {
  return {
    nama: 'Pasien Uji',
    usia: 30,
    keluhan: 'uji',
    icd10: 'Z00',
    kegawatan: 'sedang',
    spesialisasiButuh: 'interna',
    ...over,
  }
}

describe('nilaiKeputusan', () => {
  it('tuntas pada kegawatan tinggi dihukum — seharusnya dirujuk', () => {
    const hasil = nilaiKeputusan(pasien({ kegawatan: 'tinggi' }), 'tuntas', null, null)
    expect(hasil.score).toBeLessThan(0)
  })

  it('tuntas pada kegawatan rendah dihargai', () => {
    const hasil = nilaiKeputusan(pasien({ kegawatan: 'rendah' }), 'tuntas', null, null)
    expect(hasil.score).toBeGreaterThan(0)
  })

  it('rujuk pada kegawatan rendah = over-referral, dihukum', () => {
    const hasil = nilaiKeputusan(pasien({ kegawatan: 'rendah' }), 'rujuk', ['interna'], { ok: true })
    expect(hasil.score).toBeLessThan(0)
  })

  it('rujuk ke RS tanpa spesialisasi yang dibutuhkan dihukum', () => {
    const hasil = nilaiKeputusan(
      pasien({ kegawatan: 'tinggi', spesialisasiButuh: 'jantung' }),
      'rujuk',
      ['bedah'],
      { ok: true }
    )
    expect(hasil.score).toBeLessThan(0)
  })

  it('rujuk tepat indikasi & tepat spesialisasi tapi bed penuh = netral, bukan salah keputusan', () => {
    const hasil = nilaiKeputusan(
      pasien({ kegawatan: 'tinggi', spesialisasiButuh: 'jantung' }),
      'rujuk',
      ['jantung'],
      { ok: false, reason: 'penuh' }
    )
    expect(hasil.score).toBe(0)
  })

  it('rujuk tepat indikasi, tepat spesialisasi, bed dapat = dihargai penuh', () => {
    const hasil = nilaiKeputusan(
      pasien({ kegawatan: 'tinggi', spesialisasiButuh: 'jantung' }),
      'rujuk',
      ['jantung'],
      { ok: true }
    )
    expect(hasil.score).toBeGreaterThan(0)
  })
})
