import type { ContentCatalog } from '../../pack'
import type { KeluargaBinaan } from '../../types'
import type { CurriculumBlueprint, CurriculumItemConcept } from '../types'
import { M13_1A_EDUKASI_DRAFT, M13_1A_OBAT_DRAFT, M13_1A_TINDAKAN_DRAFT } from './catalogDraft'
import { M13_1A_CLINIC_DRAFTS } from './clinicalDrafts'
import { M13_1A_EVIDENCE_BINDINGS } from './evidence'
import { M13_1A_IGD_DRAFTS } from './igdDraft'
import {
  M13_1A_CLINICAL_CONCEPTS,
  M13_1A_ENCOUNTER_ARCHETYPES,
  M13_1A_ITEM_CONCEPTS,
  M13_1A_NEW_CURRICULUM_ITEMS,
  M13_1A_PROPOSED_KARMA_REWIRES,
  M13_1A_UKM_SCENARIOS,
} from './policyDraft'
import { M13_1A_UKM_DRAFTS } from './ukmDraft'

function mergeRecord<T extends { id: string }>(
  label: string,
  base: Record<string, T>,
  additions: readonly T[] | Record<string, T>,
): Record<string, T> {
  const incoming = Array.isArray(additions)
    ? Object.fromEntries(additions.map((item) => [item.id, item]))
    : additions
  for (const id of Object.keys(incoming)) {
    if (base[id]) throw new Error(`Aktivasi M13-1a: ${label} '${id}' menimpa konten aktif`)
  }
  return { ...base, ...incoming }
}

function keluargaDenganSlice(base: Record<string, KeluargaBinaan>): Record<string, KeluargaBinaan> {
  const hasil = { ...base }
  for (const draft of M13_1A_UKM_DRAFTS) {
    const keluarga = hasil[draft.familyId]
    if (!keluarga) throw new Error(`Aktivasi M13-1a: keluarga '${draft.familyId}' tidak ada`)
    if (keluarga.arc.kunjungan.some((item) => item.id === draft.scenario.id)) {
      throw new Error(`Aktivasi M13-1a: kunjungan '${draft.familyId}/${draft.scenario.id}' duplikat`)
    }
    hasil[draft.familyId] = {
      ...keluarga,
      arc: { ...keluarga.arc, kunjungan: [...keluarga.arc.kunjungan, draft.scenario] },
    }
  }

  for (const rewire of M13_1A_PROPOSED_KARMA_REWIRES) {
    const keluarga = hasil[rewire.familyId]
    if (!keluarga) throw new Error(`Aktivasi M13-1a: keluarga karma '${rewire.familyId}' tidak ada`)
    const index = keluarga.arc.kunjungan.findIndex((item) => item.id === rewire.visitId)
    const kunjungan = keluarga.arc.kunjungan[index]
    if (
      !kunjungan?.karma ||
      kunjungan.karma.kasusId !== rewire.fromCaseId ||
      kunjungan.karma.anggotaIndex !== rewire.memberIndex
    ) {
      throw new Error(`Aktivasi M13-1a: origin karma '${rewire.familyId}/${rewire.visitId}' drift`)
    }
    const kunjunganBaru = [...keluarga.arc.kunjungan]
    kunjunganBaru[index] = {
      ...kunjungan,
      karma: { ...kunjungan.karma, kasusId: rewire.toCaseId },
    }
    hasil[rewire.familyId] = {
      ...keluarga,
      arc: { ...keluarga.arc, kunjungan: kunjunganBaru },
    }
  }
  return hasil
}

/** Gabungkan slice yang sudah direview ke katalog runtime tanpa memutasi baseline. */
export function aktifkanKatalogM13_1A(base: ContentCatalog): ContentCatalog {
  const kasus = mergeRecord('kasus klinik', base.kasus, M13_1A_CLINIC_DRAFTS)
  const kasusIgd = mergeRecord('kasus IGD', base.kasusIgd, M13_1A_IGD_DRAFTS)
  const skdi144 = base.skdi144.map((entry) => {
    if (entry.kasusId) return entry
    const cocok = M13_1A_CLINIC_DRAFTS.find((kasusBaru) => kasusBaru.icd10 === entry.icd10)
    return cocok ? { ...entry, kasusId: cocok.id } : entry
  })
  return {
    ...base,
    kasus,
    kasusIgd,
    keluarga: keluargaDenganSlice(base.keluarga),
    obat: mergeRecord('obat', base.obat, M13_1A_OBAT_DRAFT),
    tindakan: mergeRecord('tindakan', base.tindakan, M13_1A_TINDAKAN_DRAFT),
    edukasi: mergeRecord('edukasi', base.edukasi, M13_1A_EDUKASI_DRAFT),
    skdi144,
  }
}

function mergeIdEntities<T extends { id: string }>(label: string, base: T[], additions: T[]): T[] {
  const ids = new Set(base.map((item) => item.id))
  for (const item of additions) {
    if (ids.has(item.id)) throw new Error(`Aktivasi M13-1a: ${label} '${item.id}' duplikat`)
    ids.add(item.id)
  }
  return [...base, ...additions].sort((a, b) => a.id.localeCompare(b.id))
}

function mergeRelations(
  base: CurriculumItemConcept[],
  additions: CurriculumItemConcept[],
): CurriculumItemConcept[] {
  const keys = new Set(base.map((item) => `${item.itemId}->${item.conceptId}`))
  for (const item of additions) {
    const key = `${item.itemId}->${item.conceptId}`
    if (keys.has(key)) throw new Error(`Aktivasi M13-1a: relasi '${key}' duplikat`)
    keys.add(key)
  }
  return [...base, ...additions].sort((a, b) =>
    `${a.itemId}:${a.conceptId}`.localeCompare(`${b.itemId}:${b.conceptId}`),
  )
}

/** Topologi authoring aktif; runtime tetap membawa proyeksi policy yang kecil. */
export function aktifkanBlueprintM13_1A(base: CurriculumBlueprint): CurriculumBlueprint {
  return {
    ...base,
    baselineId: 'm13-1a-pilot-2026-07-15',
    curriculumItems: mergeIdEntities('CurriculumItem', base.curriculumItems, M13_1A_NEW_CURRICULUM_ITEMS),
    clinicalConcepts: mergeIdEntities('ClinicalConcept', base.clinicalConcepts, M13_1A_CLINICAL_CONCEPTS),
    itemConcepts: mergeRelations(base.itemConcepts, M13_1A_ITEM_CONCEPTS),
    encounterArchetypes: mergeIdEntities('EncounterArchetype', base.encounterArchetypes, M13_1A_ENCOUNTER_ARCHETYPES),
    evidenceBindings: mergeIdEntities('EvidenceBinding', base.evidenceBindings, M13_1A_EVIDENCE_BINDINGS),
    ukmScenarios: mergeIdEntities('UkmScenario', base.ukmScenarios, M13_1A_UKM_SCENARIOS),
  }
}
