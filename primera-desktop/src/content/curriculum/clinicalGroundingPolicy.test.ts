import { describe, expect, it } from 'vitest'
import {
  CLINICAL_GROUNDING_POLICY,
  validasiClinicalGroundingPolicy,
} from './clinicalGroundingPolicy'

describe('clinical grounding policy - floor Kemenkes dan graceful degradation', () => {
  it('mengunci floor, supersesi EBM, batas bukti ketersediaan, dan tiga jalur degradasi', () => {
    expect(validasiClinicalGroundingPolicy()).toEqual([])
    expect(CLINICAL_GROUNDING_POLICY.nationalFloor).toMatch(/ambang bawah.*bukan plafon/i)
    expect(CLINICAL_GROUNDING_POLICY.ebmSupersessionRequirements.join(' ')).toMatch(
      /EvidenceBinding.*adjudikasi dokter.*stok lokal/is,
    )

    const byId = new Map(
      CLINICAL_GROUNDING_POLICY.sourceRules.map((source) => [source.id, source]),
    )
    expect(byId.get('fornas-active')?.notProofOf).toContain('stok Puskesmas tertentu')
    expect(byId.get('fornas-active')?.useFor.join(' ')).toMatch(/obat esensial.*terintegrasi/i)
    expect(byId.get('satusehat-kfa')?.notProofOf).toContain('stok Puskesmas tertentu')
    expect(byId.get('kemenkes-aspak')?.notProofOf).toEqual(
      expect.arrayContaining(['ketersediaan real-time', 'alat berfungsi', 'bahan habis pakai tersedia']),
    )
    expect(byId.get('doen-2021-historical')?.role).toBe('historical_context')
    expect(byId.get('doen-2021-historical')?.authority).toMatch(/dicabut.*terintegrasi ke Fornas/i)
    expect(CLINICAL_GROUNDING_POLICY.gracefulDegradation.map((rule) => rule.level)).toEqual([
      'verified_available',
      'variable_or_unverified',
      'unavailable_or_outside_scope',
    ])
  })

  it('validator menolak policy yang kehilangan batas bukti atau jalur fallback', () => {
    const broken = structuredClone(CLINICAL_GROUNDING_POLICY)
    broken.sourceRules.find((source) => source.id === 'satusehat-kfa')!.notProofOf = []
    broken.gracefulDegradation = broken.gracefulDegradation.slice(0, 2)
    expect(validasiClinicalGroundingPolicy(broken)).toEqual(
      expect.arrayContaining([
        'satusehat-kfa: batas bukti kosong',
        'tiga tingkat graceful degradation tidak lengkap atau urutannya drift',
      ]),
    )
  })
})
