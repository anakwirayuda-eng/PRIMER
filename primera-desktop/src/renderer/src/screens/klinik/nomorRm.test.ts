/**
 * TEST — No. RM tampilan tak boleh membocorkan diagnosis (audit V-3 2026-07-23).
 * Bug asli: `No. RM: {p.id.toUpperCase()}` menulis "P_TB_PARU_4821" di kop
 * rekam medis — kunci jawaban terpampang sebelum anamnesis, juga di mode Ujian.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { nomorRmTampilan } from './LembarPeriksa'

describe('nomorRmTampilan — kosmetik, deterministik, tanpa bocoran kasusId', () => {
  it('format id runtime (p_<kasusId>_<4 digit>) → RM-<4 digit>, tanpa nama kasus', () => {
    expect(nomorRmTampilan('p_ispa_common_cold_9258')).toBe('RM-9258')
    expect(nomorRmTampilan('p_tb_paru_1000')).toBe('RM-1000')
  })

  it('TIDAK memuat kasusId mana pun dari PACK (uji seluruh katalog aktif)', () => {
    for (const kasusId of Object.keys(PACK.kasus)) {
      const tampil = nomorRmTampilan(`p_${kasusId}_4821`).toLowerCase()
      expect(tampil).not.toContain(kasusId.toLowerCase())
      expect(tampil).toMatch(/^rm-\d{4}$/)
    }
  })

  it('id tanpa ekor digit → fallback hash 4 digit yang stabil', () => {
    const a = nomorRmTampilan('p_kasus_tanpa_digit')
    expect(a).toMatch(/^RM-\d{4}$/)
    expect(nomorRmTampilan('p_kasus_tanpa_digit')).toBe(a)
    expect(a.toLowerCase()).not.toContain('kasus_tanpa_digit')
  })
})
