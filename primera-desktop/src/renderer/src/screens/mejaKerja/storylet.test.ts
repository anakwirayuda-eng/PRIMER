import { describe, expect, it } from 'vitest'
import { STORYLET_POOL, kandidatStorylet, storyletHariIni } from './storylet'

describe('storyletHariIni', () => {
  it('selalu mengembalikan anggota pool', () => {
    for (let hari = 1; hari <= 90; hari++) {
      expect(STORYLET_POOL).toContain(storyletHariIni(1, hari))
    }
  })

  it('deterministik utk seed+hari sama', () => {
    expect(storyletHariIni(42, 10)).toBe(storyletHariIni(42, 10))
  })

  it('bervariasi lintas hari (bukan konstan)', () => {
    const hasil = new Set(Array.from({ length: 30 }, (_, i) => storyletHariIni(1, i + 1)))
    expect(hasil.size).toBeGreaterThan(1)
  })

  it('tidak memalsukan receipt sebelum mekanik pendukung pernah terjadi', () => {
    const kandidat = kandidatStorylet()
    expect(kandidat.some((teks) => /rujukan/i.test(teks))).toBe(false)
    expect(kandidat.some((teks) => /Prolanis/i.test(teks))).toBe(false)
    expect(kandidat.some((teks) => /Posyandu/i.test(teks))).toBe(false)
    expect(kandidat.some((teks) => /keluarga binaan/i.test(teks))).toBe(false)
  })

  it('membuka storylet kausal hanya setelah state pendukungnya ada', () => {
    const kandidat = kandidatStorylet({
      punyaBinaan: true,
      pernahRujuk: true,
      pernahPosyandu: true,
      pernahProlanis: true,
    })
    expect(kandidat.some((teks) => /rujukan/i.test(teks))).toBe(true)
    expect(kandidat.some((teks) => /Prolanis/i.test(teks))).toBe(true)
    expect(kandidat.some((teks) => /Posyandu/i.test(teks))).toBe(true)
    expect(kandidat.some((teks) => /keluarga binaan/i.test(teks))).toBe(true)
  })
})
