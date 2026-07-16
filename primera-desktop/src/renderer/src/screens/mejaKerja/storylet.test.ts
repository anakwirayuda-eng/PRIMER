import { describe, expect, it } from 'vitest'
import { STORYLET_POOL, storyletHariIni } from './storylet'

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
})
