import type { ContentPack } from '../pack'
import { FKTP144_CATALOG_ID, PIS_PK_CATALOG_ID, PIS_PK_OBJECTIVE_IDS } from './blueprint'
import type { CurriculumBlueprint } from './types'

function duplicateIds(items: { id: string }[]): string[] {
  const seen = new Set<string>()
  const duplicate = new Set<string>()
  for (const item of items) {
    if (seen.has(item.id)) duplicate.add(item.id)
    seen.add(item.id)
  }
  return [...duplicate].sort()
}

function compareCoverage(label: string, expected: Set<string>, actual: Set<string>, masalah: string[]): void {
  for (const id of expected) {
    if (!actual.has(id)) masalah.push(`${label}: '${id}' belum dimodelkan`)
  }
  for (const id of actual) {
    if (!expected.has(id)) masalah.push(`${label}: '${id}' tidak ada di content pack`)
  }
}

export function validasiCurriculumBlueprint(blueprint: CurriculumBlueprint, pack: ContentPack): string[] {
  const masalah: string[] = []

  for (const [label, entities] of [
    ['CurriculumItem', blueprint.curriculumItems],
    ['ClinicalConcept', blueprint.clinicalConcepts],
    ['EncounterArchetype', blueprint.encounterArchetypes],
    ['EvidenceBinding', blueprint.evidenceBindings],
    ['UkmScenario', blueprint.ukmScenarios],
  ] as const) {
    for (const id of duplicateIds(entities)) masalah.push(`${label}: id duplikat '${id}'`)
  }

  const itemIds = new Set(blueprint.curriculumItems.map((item) => item.id))
  const conceptIds = new Set(blueprint.clinicalConcepts.map((concept) => concept.id))
  const archetypeIds = new Set(blueprint.encounterArchetypes.map((archetype) => archetype.id))
  const ukmScenarioIds = new Set(blueprint.ukmScenarios.map((scenario) => scenario.id))

  const expectedFktp = new Set(pack.skdi144.map((entry) => `fktp144:${entry.id}`))
  const actualFktp = new Set(
    blueprint.curriculumItems
      .filter((item) => item.catalogId === FKTP144_CATALOG_ID)
      .map((item) => item.id),
  )
  if (actualFktp.size !== 144) masalah.push(`CurriculumItem: katalog FKTP-144 berisi ${actualFktp.size}, wajib tepat 144`)
  compareCoverage('CurriculumItem FKTP-144', expectedFktp, actualFktp, masalah)

  for (const item of blueprint.curriculumItems.filter((candidate) => candidate.catalogId === FKTP144_CATALOG_ID)) {
    if (item.domain !== 'ukp') masalah.push(`CurriculumItem ${item.id}: katalog FKTP-144 wajib domain ukp`)
    if (item.skdiLevel !== '4A') masalah.push(`CurriculumItem ${item.id}: katalog FKTP-144 wajib level 4A`)
  }

  for (const kasus of Object.values(pack.kasus).filter((candidate) => candidate.skdi !== '4A')) {
    const item = blueprint.curriculumItems.find((candidate) => candidate.id === `clinical:${kasus.id}`)
    if (!item) {
      masalah.push(`CurriculumItem: kasus ${kasus.id} level ${kasus.skdi} belum punya item klinis tersendiri`)
    } else if (item.skdiLevel !== kasus.skdi) {
      masalah.push(`CurriculumItem ${item.id}: level ${item.skdiLevel ?? '-'} tidak sama dengan kasus ${kasus.skdi}`)
    }
  }

  const relationKeys = new Set<string>()
  const relationsByItem = new Map<string, Set<string>>()
  for (const relation of blueprint.itemConcepts) {
    const key = `${relation.itemId}->${relation.conceptId}`
    if (relationKeys.has(key)) masalah.push(`CurriculumItemConcept: relasi duplikat '${key}'`)
    relationKeys.add(key)
    if (!itemIds.has(relation.itemId)) masalah.push(`CurriculumItemConcept: item yatim '${relation.itemId}'`)
    if (!conceptIds.has(relation.conceptId)) masalah.push(`CurriculumItemConcept: concept yatim '${relation.conceptId}'`)
    const concepts = relationsByItem.get(relation.itemId) ?? new Set<string>()
    concepts.add(relation.conceptId)
    relationsByItem.set(relation.itemId, concepts)
  }
  for (const item of blueprint.curriculumItems.filter((candidate) => candidate.domain === 'ukp')) {
    if ((relationsByItem.get(item.id)?.size ?? 0) === 0) {
      masalah.push(`CurriculumItem ${item.id}: item UKP tanpa ClinicalConcept`)
    }
  }

  const expectedEncounterRefs = new Set([
    ...Object.keys(pack.kasus).map((id) => `clinic:${id}`),
    ...Object.keys(pack.kasusIgd).map((id) => `igd:${id}`),
  ])
  const encounterRefList = blueprint.encounterArchetypes.map(
    (archetype) => `${archetype.contentRef.kind}:${archetype.contentRef.id}`,
  )
  const actualEncounterRefs = new Set(encounterRefList)
  if (actualEncounterRefs.size !== encounterRefList.length) {
    masalah.push('EncounterArchetype contentRef: ada referensi konten duplikat')
  }
  compareCoverage('EncounterArchetype contentRef', expectedEncounterRefs, actualEncounterRefs, masalah)

  for (const archetype of blueprint.encounterArchetypes) {
    if (!conceptIds.has(archetype.conceptId)) {
      masalah.push(`EncounterArchetype ${archetype.id}: concept '${archetype.conceptId}' tidak ada`)
    }
    if (archetype.channel !== archetype.contentRef.kind) {
      masalah.push(`EncounterArchetype ${archetype.id}: channel '${archetype.channel}' tidak cocok contentRef '${archetype.contentRef.kind}'`)
    }
    if (archetype.credits.length === 0 && !archetype.creditRationale?.trim()) {
      masalah.push(`EncounterArchetype ${archetype.id}: credits kosong tanpa creditRationale`)
    }
    if (!archetype.modePolicy.karier && !archetype.modePolicy.ujian) {
      masalah.push(`EncounterArchetype ${archetype.id}: tidak aktif di mode mana pun`)
    }
    if (!archetype.releasePolicy.introducedIn.trim()) {
      masalah.push(`EncounterArchetype ${archetype.id}: introducedIn kosong`)
    }
    const creditSet = new Set<string>()
    for (const itemId of archetype.credits) {
      if (creditSet.has(itemId)) masalah.push(`EncounterArchetype ${archetype.id}: credit duplikat '${itemId}'`)
      creditSet.add(itemId)
      const item = blueprint.curriculumItems.find((candidate) => candidate.id === itemId)
      if (!item) masalah.push(`EncounterArchetype ${archetype.id}: credit item yatim '${itemId}'`)
      else if (item.domain !== 'ukp') masalah.push(`EncounterArchetype ${archetype.id}: credit '${itemId}' bukan item UKP`)
      if (!relationKeys.has(`${itemId}->${archetype.conceptId}`)) {
        masalah.push(`EncounterArchetype ${archetype.id}: credit '${itemId}' tidak berelasi ke concept '${archetype.conceptId}'`)
      }
    }
    const excludedSet = new Set<string>()
    for (const excluded of archetype.excludedCredits ?? []) {
      if (excludedSet.has(excluded.itemId)) masalah.push(`EncounterArchetype ${archetype.id}: excludedCredit duplikat '${excluded.itemId}'`)
      excludedSet.add(excluded.itemId)
      if (!itemIds.has(excluded.itemId)) masalah.push(`EncounterArchetype ${archetype.id}: excludedCredit yatim '${excluded.itemId}'`)
      if (!excluded.reason.trim()) masalah.push(`EncounterArchetype ${archetype.id}: excludedCredit '${excluded.itemId}' tanpa alasan`)
      if (creditSet.has(excluded.itemId)) masalah.push(`EncounterArchetype ${archetype.id}: '${excluded.itemId}' sekaligus credit dan excludedCredit`)
      if (itemIds.has(excluded.itemId) && !relationKeys.has(`${excluded.itemId}->${archetype.conceptId}`)) {
        masalah.push(`EncounterArchetype ${archetype.id}: excludedCredit '${excluded.itemId}' tidak berelasi ke concept '${archetype.conceptId}'`)
      }
    }
    if (archetype.channel === 'igd' && archetype.credits.length > 0) {
      masalah.push(`EncounterArchetype ${archetype.id}: IGD baseline tidak boleh memberi credit diagnostik`)
    }
  }

  for (const link of pack.skdi144.filter((entry): entry is typeof entry & { kasusId: string } => Boolean(entry.kasusId))) {
    const archetype = blueprint.encounterArchetypes.find(
      (candidate) => candidate.contentRef.kind === 'clinic' && candidate.contentRef.id === link.kasusId,
    )
    const itemId = `fktp144:${link.id}`
    if (!archetype) {
      masalah.push(`Rekonsiliasi link ${link.id}->${link.kasusId}: archetype klinik tidak ada`)
      continue
    }
    const credited = archetype.credits.includes(itemId)
    const excluded = archetype.excludedCredits?.some((credit) => credit.itemId === itemId) ?? false
    if (!credited && !excluded) {
      masalah.push(`Rekonsiliasi link ${link.id}->${link.kasusId}: belum diputuskan sebagai credit atau excludedCredit`)
    }
    if (!relationKeys.has(`${itemId}->${archetype.conceptId}`)) {
      masalah.push(`Rekonsiliasi link ${link.id}->${link.kasusId}: item dan archetype tidak berbagi ClinicalConcept`)
    }
  }

  const expectedUkmObjectiveIds = new Set(PIS_PK_OBJECTIVE_IDS.map((id) => `ukm:pis-pk:${id}`))
  const actualUkmObjectiveIds = new Set(
    blueprint.curriculumItems
      .filter((item) => item.catalogId === PIS_PK_CATALOG_ID)
      .map((item) => item.id),
  )
  compareCoverage('CurriculumItem objective PIS-PK', expectedUkmObjectiveIds, actualUkmObjectiveIds, masalah)

  const expectedUkmRefs = new Set<string>()
  for (const keluarga of Object.values(pack.keluarga)) {
    for (const scenario of keluarga.arc.kunjungan) expectedUkmRefs.add(`${keluarga.id}:${scenario.id}`)
  }
  const ukmRefList = blueprint.ukmScenarios.map(
    (scenario) => `${scenario.contentRef.familyId}:${scenario.contentRef.visitId}`,
  )
  const actualUkmRefs = new Set(ukmRefList)
  if (actualUkmRefs.size !== ukmRefList.length) masalah.push('UkmScenario contentRef: ada referensi konten duplikat')
  compareCoverage('UkmScenario contentRef', expectedUkmRefs, actualUkmRefs, masalah)

  for (const scenario of blueprint.ukmScenarios) {
    if (scenario.credits.length === 0) masalah.push(`UkmScenario ${scenario.id}: credits kosong`)
    if (!scenario.modePolicy.karier && !scenario.modePolicy.ujian) masalah.push(`UkmScenario ${scenario.id}: tidak aktif di mode mana pun`)
    if (new Set(scenario.credits).size !== scenario.credits.length) masalah.push(`UkmScenario ${scenario.id}: credit duplikat`)
    for (const itemId of scenario.credits) {
      const item = blueprint.curriculumItems.find((candidate) => candidate.id === itemId)
      if (!item) masalah.push(`UkmScenario ${scenario.id}: credit item yatim '${itemId}'`)
      else if (item.catalogId !== PIS_PK_CATALOG_ID || item.domain !== 'ukm') {
        masalah.push(`UkmScenario ${scenario.id}: credit '${itemId}' bukan objective PIS-PK/UKM`)
      }
    }
  }

  const evidenceSubjects = new Map<string, number>()
  for (const binding of blueprint.evidenceBindings) {
    const subjectKey = `${binding.subject.kind}:${binding.subject.id}`
    evidenceSubjects.set(subjectKey, (evidenceSubjects.get(subjectKey) ?? 0) + 1)
    if (!binding.source.trim()) masalah.push(`EvidenceBinding ${binding.id}: source kosong`)
    if (!binding.locator.trim()) masalah.push(`EvidenceBinding ${binding.id}: locator kosong`)
    if (binding.subject.kind === 'curriculum_item' && !itemIds.has(binding.subject.id)) {
      masalah.push(`EvidenceBinding ${binding.id}: CurriculumItem subject yatim '${binding.subject.id}'`)
    }
    if (binding.subject.kind === 'encounter_archetype' && !archetypeIds.has(binding.subject.id)) {
      masalah.push(`EvidenceBinding ${binding.id}: EncounterArchetype subject yatim '${binding.subject.id}'`)
    }
    if (binding.subject.kind === 'ukm_scenario' && !ukmScenarioIds.has(binding.subject.id)) {
      masalah.push(`EvidenceBinding ${binding.id}: UkmScenario subject yatim '${binding.subject.id}'`)
    }
  }
  for (const itemId of itemIds) {
    if (!evidenceSubjects.has(`curriculum_item:${itemId}`)) masalah.push(`EvidenceBinding: CurriculumItem '${itemId}' tanpa binding`)
  }
  for (const archetypeId of archetypeIds) {
    if (!evidenceSubjects.has(`encounter_archetype:${archetypeId}`)) masalah.push(`EvidenceBinding: EncounterArchetype '${archetypeId}' tanpa binding`)
  }
  for (const scenarioId of ukmScenarioIds) {
    if (!evidenceSubjects.has(`ukm_scenario:${scenarioId}`)) masalah.push(`EvidenceBinding: UkmScenario '${scenarioId}' tanpa binding`)
  }

  return masalah
}

export interface CurriculumCoverageSummary {
  fktp144Total: number
  fktp144WithCertifyingClinicArchetype: number
  fktp144WithoutCertifyingClinicArchetype: number
  additionalClinicalItems: number
  ukmObjectives: number
  clinicArchetypes: number
  igdArchetypes: number
  ukmScenarios: number
}

export function ringkasanCakupanKurikulum(blueprint: CurriculumBlueprint): CurriculumCoverageSummary {
  const fktpItems = blueprint.curriculumItems.filter((item) => item.catalogId === FKTP144_CATALOG_ID)
  const certifiedByClinic = new Set(
    blueprint.encounterArchetypes
      .filter((archetype) => archetype.channel === 'clinic')
      .flatMap((archetype) => archetype.credits)
      .filter((itemId) => itemId.startsWith('fktp144:')),
  )
  return {
    fktp144Total: fktpItems.length,
    fktp144WithCertifyingClinicArchetype: certifiedByClinic.size,
    fktp144WithoutCertifyingClinicArchetype: fktpItems.length - certifiedByClinic.size,
    additionalClinicalItems: blueprint.curriculumItems.filter((item) => item.catalogId !== FKTP144_CATALOG_ID && item.domain === 'ukp').length,
    ukmObjectives: blueprint.curriculumItems.filter((item) => item.domain === 'ukm').length,
    clinicArchetypes: blueprint.encounterArchetypes.filter((archetype) => archetype.channel === 'clinic').length,
    igdArchetypes: blueprint.encounterArchetypes.filter((archetype) => archetype.channel === 'igd').length,
    ukmScenarios: blueprint.ukmScenarios.length,
  }
}
