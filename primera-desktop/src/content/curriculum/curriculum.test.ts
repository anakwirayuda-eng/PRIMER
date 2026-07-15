import { describe, expect, it } from 'vitest'
import { CURRICULUM_BLUEPRINT, PACK } from '../index'
import {
  FKTP144_CATALOG_ID,
  PIS_PK_CATALOG_ID,
  evaluasiMasteryKlinis,
  evaluasiMasteryUkm,
  ringkasanCakupanKurikulum,
  validasiCurriculumBlueprint,
} from '.'

describe('M13-0A — canonical curriculum blueprint', () => {
  it('lolos validator menyeluruh dan mencakup seluruh baseline content pack', () => {
    expect(validasiCurriculumBlueprint(CURRICULUM_BLUEPRINT, PACK)).toEqual([])

    const summary = ringkasanCakupanKurikulum(CURRICULUM_BLUEPRINT)
    expect(summary).toEqual({
      fktp144Total: 144,
      fktp144WithCertifyingClinicArchetype: 66,
      fktp144WithoutCertifyingClinicArchetype: 78,
      additionalClinicalItems: 32,
      ukmObjectives: 12,
      clinicArchetypes: 98,
      igdArchetypes: 6,
      ukmScenarios: 27,
    })
  })

  it('144 adalah subset katalog, bukan batas seluruh CurriculumItem', () => {
    const catalog144 = CURRICULUM_BLUEPRINT.curriculumItems.filter(
      (item) => item.catalogId === FKTP144_CATALOG_ID,
    )
    expect(catalog144).toHaveLength(144)
    expect(CURRICULUM_BLUEPRINT.curriculumItems.length).toBeGreaterThan(144)
    expect(new Set(catalog144.map((item) => item.id))).toEqual(
      new Set(PACK.skdi144.map((item) => `fktp144:${item.id}`)),
    )
  })

  it('setiap kasus level 3A/3B/2 punya item tersendiri dengan level yang tetap utuh', () => {
    const non4A = Object.values(PACK.kasus).filter((kasus) => kasus.skdi !== '4A')
    expect(non4A).toHaveLength(26)
    for (const kasus of non4A) {
      const archetype = CURRICULUM_BLUEPRINT.encounterArchetypes.find(
        (candidate) => candidate.contentRef.kind === 'clinic' && candidate.contentRef.id === kasus.id,
      )
      const clinicalCredits = (archetype?.credits ?? [])
        .filter((itemId) => itemId.startsWith('clinical:'))
        .map((itemId) => CURRICULUM_BLUEPRINT.curriculumItems.find((item) => item.id === itemId))
      expect(clinicalCredits.length, kasus.id).toBeGreaterThan(0)
      expect(clinicalCredits.some((item) => item?.skdiLevel === kasus.skdi), kasus.id).toBe(true)
    }
  })

  it('semua 12 objective PIS-PK termodelkan dan seluruh 26 skenario UKM mengkredit objective valid', () => {
    const objectives = CURRICULUM_BLUEPRINT.curriculumItems.filter(
      (item) => item.catalogId === PIS_PK_CATALOG_ID,
    )
    expect(objectives).toHaveLength(12)
    const objectiveIds = new Set(objectives.map((item) => item.id))
    expect(CURRICULUM_BLUEPRINT.ukmScenarios).toHaveLength(27)
    for (const scenario of CURRICULUM_BLUEPRINT.ukmScenarios) {
      expect(scenario.credits.length, scenario.id).toBeGreaterThan(0)
      expect(scenario.credits.every((itemId) => objectiveIds.has(itemId)), scenario.id).toBe(true)
    }
  })

  it('pneumonia 3B berbagi concept dengan item 4A, tetapi hanya mengkredit item 3B-nya sendiri', () => {
    const archetype = CURRICULUM_BLUEPRINT.encounterArchetypes.find(
      (candidate) => candidate.id === 'clinic:pneumonia_balita',
    )!
    expect(archetype.conceptId).toBe('concept:pneumonia')
    expect(archetype.credits).toEqual(['clinical:pneumonia_balita'])
    expect(archetype.excludedCredits).toEqual([
      expect.objectContaining({ itemId: 'fktp144:pneumonia_bacterial' }),
    ])

    const conceptItems = CURRICULUM_BLUEPRINT.itemConcepts
      .filter((relation) => relation.conceptId === 'concept:pneumonia')
      .map((relation) => relation.itemId)
    expect(conceptItems).toEqual(
      expect.arrayContaining(['clinical:pneumonia_balita', 'fktp144:pneumonia_bacterial']),
    )
  })

  it('kompetensi gabungan Hiperurisemia-Gout adalah one-item-to-two-concepts', () => {
    const relations = CURRICULUM_BLUEPRINT.itemConcepts
      .filter((relation) => relation.itemId === 'fktp144:hyperuricemia')
      .map((relation) => relation.conceptId)
    expect(relations).toEqual(['concept:gout_arthritis', 'concept:hyperuricemia'])
    expect(
      CURRICULUM_BLUEPRINT.encounterArchetypes.find(
        (archetype) => archetype.id === 'clinic:mm_gout_artritis_akut',
      ),
    ).toEqual(expect.objectContaining({ conceptId: 'concept:gout_arthritis' }))
  })

  it('baris katalog gabungan yang diagnosisnya berbeda tidak dipipihkan menjadi alias', () => {
    const conceptsOf = (itemId: string) =>
      CURRICULUM_BLUEPRINT.itemConcepts
        .filter((relation) => relation.itemId === itemId)
        .map((relation) => relation.conceptId)

    expect(conceptsOf('fktp144:dysentery')).toEqual([
      'concept:amoebic_dysentery',
      'concept:bacillary_dysentery',
    ])
    expect(conceptsOf('fktp144:acute_gastroenteritis')).toEqual([
      'concept:acute_gastroenteritis',
      'concept:cholera',
      'concept:gastroenteritis_bayi_dehidrasi_berat',
      'concept:giardiasis',
    ])
    expect(conceptsOf('fktp144:genital_discharge')).toContain('concept:gonorrhea')
    expect(conceptsOf('fktp144:gonorrhea')).toEqual(['concept:gonorrhea'])
    expect(
      CURRICULUM_BLUEPRINT.encounterArchetypes.find(
        (archetype) => archetype.id === 'clinic:disentri_basiler',
      )?.conceptId,
    ).toBe('concept:bacillary_dysentery')
  })

  it('IGD punya concept tetapi tidak memberi sertifikasi diagnostik palsu', () => {
    const igd = CURRICULUM_BLUEPRINT.encounterArchetypes.filter(
      (archetype) => archetype.channel === 'igd',
    )
    expect(igd).toHaveLength(6)
    for (const archetype of igd) {
      expect(archetype.credits, archetype.id).toEqual([])
      expect(archetype.creditRationale, archetype.id).toMatch(/tidak.*(?:diagnosis|diagnostik)/i)
      expect(archetype.excludedCredits?.length, archetype.id).toBeGreaterThan(0)
    }
  })

  it('mastery memisahkan dijumpai, tersertifikasi, dan dikuasai', () => {
    const pneumonia = evaluasiMasteryKlinis(CURRICULUM_BLUEPRINT, 'clinic:pneumonia_balita', {
      encountered: true,
      diagnosisCorrect: true,
      dispositionCorrect: true,
      masteryAchieved: true,
    })
    expect(pneumonia.encounteredItemIds).toEqual(
      expect.arrayContaining(['clinical:pneumonia_balita', 'fktp144:pneumonia_bacterial']),
    )
    expect(pneumonia.certifiedItemIds).toEqual(['clinical:pneumonia_balita'])
    expect(pneumonia.masteredArchetypeIds).toEqual(['clinic:pneumonia_balita'])

    const igdAsma = evaluasiMasteryKlinis(CURRICULUM_BLUEPRINT, 'igd:igd_asma_berat', {
      encountered: true,
      diagnosisCorrect: true,
      dispositionCorrect: true,
      masteryAchieved: false,
    })
    expect(igdAsma.encounteredItemIds).toContain('fktp144:asthma_bronchiale')
    expect(igdAsma.certifiedItemIds).toEqual([])
  })

  it('mastery UKM mengkredit objective hanya setelah skenario berhasil', () => {
    const scenarioId = 'ukm:keluarga_yani:yani_k1'
    const gagal = evaluasiMasteryUkm(CURRICULUM_BLUEPRINT, scenarioId, {
      encountered: true,
      completedSuccessfully: false,
      masteryAchieved: false,
    })
    expect(gagal.encounteredItemIds).toEqual(
      expect.arrayContaining(['ukm:pis-pk:asi_eksklusif', 'ukm:pis-pk:pantau_tumbuh_kembang']),
    )
    expect(gagal.certifiedItemIds).toEqual([])

    const berhasil = evaluasiMasteryUkm(CURRICULUM_BLUEPRINT, scenarioId, {
      encountered: true,
      completedSuccessfully: true,
      masteryAchieved: true,
    })
    expect(berhasil.certifiedItemIds).toEqual(gagal.encounteredItemIds)
    expect(berhasil.masteredScenarioIds).toEqual([scenarioId])
  })

  it('M13-0B hanya men-terminalkan empat delta; binding baseline lain tetap pending', () => {
    expect(CURRICULUM_BLUEPRINT.evidenceBindings.length).toBeGreaterThan(0)
    const m13_1a = CURRICULUM_BLUEPRINT.evidenceBindings.filter((binding) =>
      binding.id.startsWith('m13-1a:'),
    )
    const audited = CURRICULUM_BLUEPRINT.evidenceBindings.filter(
      (binding) => binding.audit && !binding.id.startsWith('m13-1a:'),
    )
    const baseline = CURRICULUM_BLUEPRINT.evidenceBindings.filter(
      (binding) => !binding.audit && !binding.id.startsWith('m13-1a:'),
    )
    expect(audited).toHaveLength(32)
    expect(audited.filter((binding) => binding.reviewStatus === 'resolved')).toHaveLength(16)
    expect(audited.filter((binding) => binding.reviewStatus === 'accepted_with_limitation')).toHaveLength(16)
    expect(audited.every((binding) => binding.audit?.physicianSignoff)).toBe(true)
    expect(baseline.every((binding) => binding.reviewStatus === 'pending')).toBe(true)
    expect(m13_1a.length).toBeGreaterThan(30)
    expect(
      m13_1a.every((binding) =>
        ['resolved', 'accepted_with_limitation'].includes(binding.reviewStatus),
      ),
    ).toBe(true)
    expect(m13_1a.filter((binding) => binding.audit)).toHaveLength(3)
  })

  it('validator menangkap credit yatim, link lama belum direkonsiliasi, dan skenario UKM hilang', () => {
    const pneumoniaIndex = CURRICULUM_BLUEPRINT.encounterArchetypes.findIndex(
      (archetype) => archetype.id === 'clinic:pneumonia_balita',
    )
    const rusakArchetypes = [...CURRICULUM_BLUEPRINT.encounterArchetypes]
    rusakArchetypes[pneumoniaIndex] = {
      ...rusakArchetypes[pneumoniaIndex]!,
      credits: ['item:tidak-ada'],
      excludedCredits: [],
    }
    const rusak = {
      ...CURRICULUM_BLUEPRINT,
      encounterArchetypes: rusakArchetypes,
      ukmScenarios: CURRICULUM_BLUEPRINT.ukmScenarios.slice(1),
    }
    const masalah = validasiCurriculumBlueprint(rusak, PACK)
    expect(masalah).toContain("EncounterArchetype clinic:pneumonia_balita: credit item yatim 'item:tidak-ada'")
    expect(masalah.some((item) => item.includes('pneumonia_bacterial->pneumonia_balita') && item.includes('belum diputuskan'))).toBe(true)
    expect(masalah.some((item) => item.startsWith('UkmScenario contentRef:') && item.includes('belum dimodelkan'))).toBe(true)
  })
})
