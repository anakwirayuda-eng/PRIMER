/**
 * TEST — No. RM tampilan tak boleh membocorkan diagnosis (audit V-3 2026-07-23).
 * Bug asli: `No. RM: {p.id.toUpperCase()}` menulis "P_TB_PARU_4821" di kop
 * rekam medis — kunci jawaban terpampang sebelum anamnesis, juga di mode Ujian.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { nomorRmTampilan } from './LembarPeriksa'

describe('nomorRmTampilan — kosmetik, deterministik, tanpa bocoran kasusId', () => {
  it('format id runtime menjadi pseudonim numerik stabil tanpa nama kasus', () => {
    const ispa = nomorRmTampilan('p_ispa_common_cold_9258')
    const tb = nomorRmTampilan('p_tb_paru_1000')
    expect(ispa).toMatch(/^RM-\d{10}$/)
    expect(tb).toMatch(/^RM-\d{10}$/)
    expect(ispa).not.toBe(tb)
    expect(nomorRmTampilan('p_ispa_common_cold_9258')).toBe(ispa)
  })

  it('TIDAK memuat kasusId dan unik pada seluruh katalog untuk ekor RNG yang sama', () => {
    const semua = Object.keys(PACK.kasus).map((kasusId) => {
      const tampil = nomorRmTampilan(`p_${kasusId}_4821`)
      expect(tampil).not.toContain(kasusId.toLowerCase())
      expect(tampil).toMatch(/^RM-\d{10}$/)
      return tampil
    })
    expect(new Set(semua).size).toBe(semua.length)
  })

  it('seluruh rentang ekor RNG satu kasus tidak menghasilkan nomor ganda', () => {
    const semua = Array.from({ length: 9000 }, (_, i) =>
      nomorRmTampilan(`p_ispa_common_cold_${1000 + i}`),
    )
    expect(new Set(semua).size).toBe(semua.length)
  })

  it('id tanpa ekor digit tetap menghasilkan pseudonim stabil', () => {
    const a = nomorRmTampilan('p_kasus_tanpa_digit')
    expect(a).toMatch(/^RM-\d{10}$/)
    expect(nomorRmTampilan('p_kasus_tanpa_digit')).toBe(a)
    expect(a.toLowerCase()).not.toContain('kasus_tanpa_digit')
  })
})
