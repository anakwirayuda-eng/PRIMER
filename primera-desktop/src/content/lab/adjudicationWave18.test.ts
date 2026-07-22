import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { FORNAS_QUERIES } from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: string) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 18: Fornas dan grounding resource yang jujur', () => {
  it('memakai nomenklatur karboksimetilselulosa dan locator Fornas literal', () => {
    expect(PACK.obat.air_mata_buatan?.nama).toMatch(/Karboksimetilselulosa/i)
    expect(FORNAS_QUERIES.air_mata_buatan).toEqual(['karboksimetilselulosa'])
    const drug = record('lab_mata_kering').currentManagement.requiredDrugs
      .find((item) => item.id === 'air_mata_buatan')
    expect(drug?.fornas.status).toBe('cocok')
    expect(drug?.fornas.excerpts).toEqual([
      expect.objectContaining({ label: 'karboksimetilselulosa', locator: expect.stringMatching(/baris \d+$/) }),
    ])
  })

  it('mengikat Ringer laktat hanya ke kelas elektrolit Fornas, bukan klaim produk exact', () => {
    expect(FORNAS_QUERIES.ringer_laktat_inf).toEqual(['Larutan Mengandung Elektrolit'])
    const management = record('lab_kehamilan_ektopik_terganggu_suspek').currentManagement
    const drug = [
      ...management.requiredDrugs,
      ...management.alternativeDrugs.flat(),
      ...management.optionalDrugs,
    ].find((item) => item.id === 'ringer_laktat_inf')
    expect(drug?.fornas.status).toBe('cocok')
    expect(drug?.fornas.excerpts[0]).toMatchObject({ label: 'Larutan Mengandung Elektrolit' })
    expect(drug?.fornas.excerpts[0]?.text).toMatch(/Larutan Mengandung Elektrolit/i)
  })

  it('tetap menandai obat non-Fornas, tetapi menerima graceful degradation kasus yang eksplisit', () => {
    const casesWithNonFornas = DATA.cases.filter((item) => [
      ...item.currentManagement.requiredDrugs,
      ...item.currentManagement.alternativeDrugs.flat(),
      ...item.currentManagement.optionalDrugs,
    ].some((drug) => !drug.catalogFornas))
    expect(casesWithNonFornas.length).toBeGreaterThan(0)
    for (const item of casesWithNonFornas) {
      const nonFornas = [
        ...item.currentManagement.requiredDrugs,
        ...item.currentManagement.alternativeDrugs.flat(),
        ...item.currentManagement.optionalDrugs,
      ].filter((drug) => !drug.catalogFornas)
      expect(item.evidence.fornas.status, item.id).toBe('cocok')
      expect(nonFornas.every((drug) => drug.fornas.status === 'perlu-koreksi'), item.id).toBe(true)
      expect(nonFornas.every((drug) => drug.fornas.caseAvailabilityGrounded), item.id).toBe(true)
      expect(item.currentEditorial.realityNote?.trim().length, item.id).toBeGreaterThan(20)
    }
  })

  it('membedakan resource Tier C/D yang dinyatakan dari yang belum terjelaskan', () => {
    const grounded = record('lab_hepatitis_a_akut').evidence.aspak
    expect(grounded.status).toBe('cocok')
    expect(grounded.unresolvedResourceIds).toEqual([])
    expect(grounded.resources.filter((item) => item.tier === 'C' || item.tier === 'D'))
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'sgot_sgpt', grounding: 'declared' }),
        expect.objectContaining({ id: 'anti_hav_igm', grounding: 'declared' }),
      ]))

    const resolved = record('lab_parafimosis_reduksibel').evidence.aspak
    expect(resolved.status).toBe('cocok')
    expect(resolved.unresolvedResourceIds).toEqual([])
    expect(resolved.resources).toContainEqual(expect.objectContaining({
      id: 'reduksi_parafimosis',
      grounding: 'declared',
    }))
  })

  it('merekonsiliasi seluruh kasus resource tanpa menyembunyikan backlog', () => {
    expect(DATA.summary.resourceTierCOrD).toBe(46)
    expect(DATA.summary.resourceGrounded).toBe(46)
    expect(DATA.summary.resourceUnresolved).toBe(0)
    expect(DATA.summary.resourceGrounded + DATA.summary.resourceUnresolved)
      .toBe(DATA.summary.resourceTierCOrD)
  })

  it('mengenali pembatasan PPK yang dinyatakan eksplisit', () => {
    expect(record('lab_edema_paru_akut_hipertensif').compiler.sourceAttributionWarning).toBe(false)
    expect(record('lab_mabuk_perjalanan').compiler.sourceAttributionWarning).toBe(false)
  })
})
