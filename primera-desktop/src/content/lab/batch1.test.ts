import { describe, expect, it } from 'vitest'
import { CURRICULUM_BLUEPRINT, PACK } from '../index'
import {
  CONTENT_RELEASE,
  CODING_UKM_SWEEP_CONTENT_RELEASE,
  encounterArchetypeAktif,
  validasiPack,
} from '../pack'
import { validasiCurriculumBlueprint } from '../curriculum'
import { LAB_BATCH_1_ARCHETYPE_SPECS, LAB_BATCH_1_CASES } from './batch1'
import { LAB_ENRICHMENT, applyLabEnrichment } from './enrichment'
import { PHYSICIAN_APPROVED_LAB_CASE_IDS } from './index'
import { VARIAN_TINGKAT_A } from '../varianTingkatAData'

describe('M13 lab full-fledge - batch 1', () => {
  it('mengaktifkan tepat 25 encounter nyata: 18 tuntas FKTP dan 7 rujuk', () => {
    expect(LAB_BATCH_1_CASES).toHaveLength(25)
    expect(LAB_BATCH_1_CASES.filter((item) => item.fktp144)).toHaveLength(18)
    expect(LAB_BATCH_1_CASES.filter((item) => item.harusDirujuk)).toHaveLength(7)
    expect(Object.keys(LAB_BATCH_1_ARCHETYPE_SPECS)).toHaveLength(25)

    for (const kasus of LAB_BATCH_1_CASES) {
      // PACK memuat versi kasus yang SUDAH dilewatkan lapisan pengayaan
      // (variasi persona / distraktor / jebakan resep / konsekuensi — lihat
      // enrichment.ts) DAN lapisan varian Tingkat-A (M11 #4, varianTingkatA.ts)
      // bila kasusnya terdaftar di VARIAN_TINGKAT_A. Bandingkan ke bentuk
      // terenrich+tervarian, bukan kasus dasar.
      const { sumber: _sumber, ...kasusAktif } = PACK.kasus[kasus.id]!
      expect(kasusAktif, kasus.id).toEqual({
        ...applyLabEnrichment(kasus, LAB_ENRICHMENT[kasus.id]),
        ...(PHYSICIAN_APPROVED_LAB_CASE_IDS.has(kasus.id)
          ? { reviewStatus: 'physician_approved' }
          : {}),
        ...(VARIAN_TINGKAT_A[kasus.id] ? { varianPresentasi: VARIAN_TINGKAT_A[kasus.id] } : {}),
      })
      expect(kasus.activationStatus, kasus.id).toBe('lab_prototype_unadjudicated')
      expect(kasus.diagnosisBanding, kasus.id).toContain(kasus.icd10)
      expect(kasus.anamnesis[0], kasus.id).toMatchObject({
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        esensial: true,
      })
      for (const pertanyaan of kasus.anamnesis.slice(1)) {
        expect(pertanyaan.bukaSetelah, `${kasus.id}/${pertanyaan.id}`).toContain('q_keluhan')
      }
    }
  })

  it('Career-only dan benar-benar tidak masuk pool Ujian', () => {
    // Adjudikasi-delegasi 2026-08-21: rilis konten naik (kunci jawaban berubah).
    expect(CONTENT_RELEASE).toBe(CODING_UKM_SWEEP_CONTENT_RELEASE)
    for (const kasus of LAB_BATCH_1_CASES) {
      expect(
        encounterArchetypeAktif(PACK, 'clinic', kasus.id, 'karier', CONTENT_RELEASE),
        kasus.id,
      ).toBe(true)
      expect(
        encounterArchetypeAktif(PACK, 'clinic', kasus.id, 'ujian', CONTENT_RELEASE),
        kasus.id,
      ).toBe(false)
    }
  })

  it('setiap kasus 4A mengkredit item FKTP dan setiap rujukan punya item level sendiri', () => {
    for (const kasus of LAB_BATCH_1_CASES) {
      const archetype = CURRICULUM_BLUEPRINT.encounterArchetypes.find(
        (item) => item.contentRef.kind === 'clinic' && item.contentRef.id === kasus.id,
      )
      expect(archetype, kasus.id).toBeDefined()
      if (kasus.fktp144) {
        expect(archetype!.credits, kasus.id).toHaveLength(1)
        expect(archetype!.credits[0], kasus.id).toMatch(/^fktp144:/)
      } else {
        expect(archetype!.credits, kasus.id).toEqual([`clinical:${kasus.id}`])
        const item = CURRICULUM_BLUEPRINT.curriculumItems.find(
          (candidate) => candidate.id === `clinical:${kasus.id}`,
        )
        expect(item?.skdiLevel, kasus.id).toBe(kasus.skdi)
      }
    }
  })

  it('lolos kedua validator tanpa pengecualian lab', () => {
    expect(validasiPack(PACK)).toEqual([])
    expect(validasiCurriculumBlueprint(CURRICULUM_BLUEPRINT, PACK)).toEqual([])
  })
})
