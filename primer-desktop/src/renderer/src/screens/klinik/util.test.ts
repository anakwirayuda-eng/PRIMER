/**
 * Test util klinik — dua keluhan playtest user (2026-07-03):
 * 1. Pilihan diagnosis banding tampil "Kode M06.9" tanpa nama.
 * 2. Pencarian obat gagal karena ejaan Inggris (paracetamol/amoxicillin/
 *    cetirizine) vs nama katalog Indonesia (Parasetamol/Amoksisilin/Setirizin).
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { cocokObat, namaDiagnosis, normalisasiNamaObat } from './util'

describe('namaDiagnosis — semua banding bernama', () => {
  it('kode dari screenshot playtest (M06.9, M54.5) kini bernama', () => {
    const mialgia = PACK.kasus['mm_mialgia']!
    for (const kode of mialgia.diagnosisBanding) {
      expect(namaDiagnosis(kode, mialgia)).not.toMatch(/^Kode /)
    }
  })

  it('TIDAK ADA kode banding mana pun yang jatuh ke fallback "Kode X"', () => {
    const telanjang: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      for (const kode of k.diagnosisBanding) {
        if (namaDiagnosis(kode, k).startsWith('Kode ')) telanjang.push(`${k.id}:${kode}`)
      }
    }
    expect(telanjang).toEqual([])
  })
})

describe('pencarian obat toleran-ejaan', () => {
  const obat = (id: string) => PACK.obat[id]!

  it('normalisasi fonetik EN→ID', () => {
    expect(normalisasiNamaObat('Paracetamol')).toBe(normalisasiNamaObat('Parasetamol'))
    expect(normalisasiNamaObat('Amoxicillin')).toBe(normalisasiNamaObat('Amoksisilin'))
    expect(normalisasiNamaObat('Cetirizine')).toBe(normalisasiNamaObat('Setirizine'))
    expect(normalisasiNamaObat('Ciprofloxacin')).toBe(normalisasiNamaObat('Siprofloksasin'))
  })

  it('ejaan Inggris menemukan obat katalog Indonesia', () => {
    expect(cocokObat(obat('paracetamol_500'), 'paracetamol')).toBe(true)
    expect(cocokObat(obat('amoxicillin_500'), 'amoxicillin')).toBe(true)
    expect(cocokObat(obat('cetirizine_10'), 'cetirizine')).toBe(true)
    expect(cocokObat(obat('ciprofloxacin_500'), 'ciprofloxacin')).toBe(true)
    expect(cocokObat(obat('asiklovir_400'), 'acyclovir')).toBe(true)
    expect(cocokObat(obat('cefadroxil_500'), 'cefadroxil')).toBe(true)
  })

  it('sinonim/singkatan lazim menemukan obatnya', () => {
    expect(cocokObat(obat('ctm_4'), 'chlorpheniramine')).toBe(true)
    expect(cocokObat(obat('tablet_fe'), 'tablet tambah darah')).toBe(true)
    expect(cocokObat(obat('oralit'), 'ORS')).toBe(true)
    expect(cocokObat(obat('dihidroartemisinin_piperakuin'), 'DHP')).toBe(true)
    expect(cocokObat(obat('mgso4_inj'), 'magnesium sulfat')).toBe(true)
  })

  it('kueri ngawur tetap tidak mencocokkan apa pun', () => {
    expect(cocokObat(obat('paracetamol_500'), 'xyzzy')).toBe(false)
  })
})
