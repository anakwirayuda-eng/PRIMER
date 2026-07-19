import { describe, expect, it } from 'vitest'
import { PACK } from './index'
import {
  DUEL_DIAGNOSIS_PILOTS,
  TEACH_BACK_PILOTS,
  validasiPedagogyPilots,
} from './pedagogyPilots'

describe('pilot Duel Diagnosis + Teach-back', () => {
  it('menutup seluruh invariant authoring tanpa mengubah PACK runtime', () => {
    expect(validasiPedagogyPilots(PACK)).toEqual([])
    expect(DUEL_DIAGNOSIS_PILOTS).toHaveLength(8)
    expect(TEACH_BACK_PILOTS).toHaveLength(8)
  })

  it('setiap duel memakai dua kasus nyata, dua keputusan berbeda, dan satu jawaban benar', () => {
    for (const duel of DUEL_DIAGNOSIS_PILOTS) {
      const [kiri, kanan] = duel.sisi
      expect(PACK.kasus[kiri.kasusId]).toBeDefined()
      expect(PACK.kasus[kanan.kasusId]).toBeDefined()
      expect(kiri.kasusId).not.toBe(kanan.kasusId)
      expect(kiri.keputusan).not.toBe(kanan.keputusan)
      expect(duel.pilihan.filter((pilihan) => pilihan.benar)).toHaveLength(1)
    }
  })

  it('teach-back tidak memakai prompt ya/tidak atau bahasa menyalahkan sebagai jawaban benar', () => {
    for (const pilot of TEACH_BACK_PILOTS) {
      const promptBenar = pilot.pilihanPembuka.find((pilihan) => pilihan.benar)
      expect(promptBenar).toBeDefined()
      expect(promptBenar?.label).not.toMatch(/sudah paham|mengerti|\bmasa\b|ya\?$/i)
      expect(pilot.pilihanPenilaian.filter((pilihan) => pilihan.benar)).toHaveLength(1)
    }
  })

  it('semua sumber dapat ditelusuri lewat HTTPS dan metadata id konsisten', () => {
    const metadata = new Map<string, string>()
    for (const pilot of [...DUEL_DIAGNOSIS_PILOTS, ...TEACH_BACK_PILOTS]) {
      for (const sumber of pilot.sumber) {
        expect(sumber.url).toMatch(/^https:\/\//)
        const serialized = JSON.stringify(sumber)
        expect(metadata.get(sumber.id) ?? serialized).toBe(serialized)
        metadata.set(sumber.id, serialized)
      }
    }
  })
})
