/**
 * TEST — gerbang terapiKritis (audit CODEX 2026-07-16 #1/#2/#4).
 * Regresi inti: melewatkan terapi PENYELAMAT NYAWA (mis. MgSO4 preeklampsia)
 * dulu masih bisa dapat A karena terapi cuma 20% bobot tanpa gate. Kini:
 *   (a) skip terapiKritis → hard-cap grade D + flag terapiKritisTerlewat,
 *   (b) memberikannya → tak di-cap oleh gerbang ini,
 *   (c) SEMUA id terapiKritis di katalog benar-benar selektabel (validasiPack).
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buatEncounter, nilaiEncounter } from './clinic'
import type { EncounterState, PasienAktif } from './state'

const KASUS_ID = 'kia_preeklampsia_berat'

function encoun(resep: string[], tindakan: string[] = []): EncounterState {
  const kasus = PACK.kasus[KASUS_ID]!
  const pasien: PasienAktif = {
    id: 'p_pe', nama: 'Bumil Uji', usia: 30, jenisKelamin: 'P', persona: 'polos',
    kasusId: KASUS_ID, bpjs: true, alergi: [], faktorRisiko: [], rw: 1, bonusTrust: false,
  }
  // "Sempurna kecuali terapi": semua esensial ditanya, semua fisik relevan
  // diperiksa, vital diukur, diagnosis tegak benar, dirujuk (kasus wajib-rujuk).
  return {
    ...buatEncounter(pasien),
    vitalDiukur: true,
    ditanya: kasus.anamnesis.map((q) => q.id),
    diperiksa: kasus.pemeriksaanFisik.filter((f) => f.relevan).map((f) => f.region),
    diagnosis: { icd10: kasus.icd10, jenis: 'tegak' },
    disposisi: 'rujuk',
    edukasi: kasus.tatalaksana.edukasi,
    resep,
    tindakan,
  }
}

describe('terapiKritis — gerbang terapi penyelamat nyawa', () => {
  it('preeklampsia: melewatkan MgSO4 (beri nifedipin saja) → cap D + terapiKritisTerlewat', () => {
    const nilai = nilaiEncounter(encoun(['nifedipin_10']), PACK.kasus[KASUS_ID]!, PACK)
    expect(nilai.terapiKritisTerlewat).toBe(true)
    expect(nilai.grade).toBe('D')
  })

  it('preeklampsia: memberi MgSO4 + nifedipin → tak terlewat & tak di-cap gerbang ini', () => {
    const nilai = nilaiEncounter(encoun(['mgso4_inj', 'nifedipin_10']), PACK.kasus[KASUS_ID]!, PACK)
    expect(nilai.terapiKritisTerlewat).toBe(false)
    // Dengan diagnosis benar + rujuk tepat + terapi lengkap → grade tinggi.
    expect(['A', 'B']).toContain(nilai.grade)
  })

  it('setiap id terapiKritis di seluruh katalog benar-benar selektabel (obatBenar/alt/prosedur)', () => {
    for (const k of Object.values(PACK.kasus)) {
      for (const tk of k.tatalaksana.terapiKritis ?? []) {
        const selektabel =
          k.tatalaksana.obatBenar.includes(tk) ||
          (k.tatalaksana.obatAlternatif ?? []).flat().includes(tk) ||
          (k.tatalaksana.prosedur ?? []).includes(tk)
        expect(selektabel, `${k.id}: terapiKritis '${tk}' tidak selektabel`).toBe(true)
      }
    }
  })

  it('preeklampsia memang menandai MgSO4 sebagai terapiKritis (regresi konten)', () => {
    expect(PACK.kasus[KASUS_ID]!.tatalaksana.terapiKritis).toContain('mgso4_inj')
  })
})
