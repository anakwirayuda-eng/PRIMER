import type {
  ClinicalConcept,
  CurriculumItem,
  CurriculumItemConcept,
  EncounterArchetype,
  EvidenceBinding,
  UkmScenario,
} from '../types'
import type { KasusKlinis, Obat, Tindakan, TopikEdukasi } from '../../types'
import { M13_1A_EDUKASI_DRAFT, M13_1A_OBAT_DRAFT, M13_1A_TINDAKAN_DRAFT } from './catalogDraft'
import { M13_1A_CLINIC_DRAFTS } from './clinicalDrafts'
import {
  M13_1A_BASE_CONTENT_RELEASE,
  M13_1A_PROPOSED_CONTENT_RELEASE,
} from './constants'
import { M13_1A_EVIDENCE_BINDINGS } from './evidence'
import { M13_1A_PROPOSED_ICD10_ENTRIES } from './icdDraft'
import { M13_1A_IGD_DRAFTS } from './igdDraft'
import {
  M13_1A_CLINICAL_CONCEPTS,
  M13_1A_ENCOUNTER_ARCHETYPES,
  M13_1A_ITEM_CONCEPTS,
  M13_1A_NEW_CURRICULUM_ITEMS,
  M13_1A_PROPOSED_KARMA_REWIRES,
  M13_1A_UKM_SCENARIOS,
  type ProposedKarmaRewire,
} from './policyDraft'
import { M13_1A_PHYSICIAN_DECISION_BY_REVIEW_ID } from './reviewQuestions'
import { M13_1A_SOURCES, type M13AuthoringSource } from './sources'
import { M13_1A_UKM_DRAFTS } from './ukmDraft'

export function clinicReviewId(caseId: string): string {
  return `m13-1a-review-clinic-${caseId}`
}

export function igdReviewId(caseId: string): string {
  return `m13-1a-review-igd-${caseId}`
}

export function ukmReviewId(familyId: string, visitId: string): string {
  return `m13-1a-review-ukm-${familyId}-${visitId}`
}

function pilihEntri<T>(catalog: Record<string, T>, ids: string[]): Record<string, T> {
  return Object.fromEntries(
    [...new Set(ids)]
      .sort()
      .filter((id) => catalog[id] !== undefined)
      .map((id) => [id, catalog[id]!]),
  )
}

function urutId<T extends { id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.id.localeCompare(b.id))
}

function urutKarma(items: ProposedKarmaRewire[]): ProposedKarmaRewire[] {
  return [...items].sort((a, b) =>
    `${a.familyId}:${a.visitId}:${a.memberIndex}`.localeCompare(
      `${b.familyId}:${b.visitId}:${b.memberIndex}`,
    ),
  )
}

function semuaReferensiObat(kasus: KasusKlinis): string[] {
  return [
    ...kasus.tatalaksana.obatBenar,
    ...(kasus.tatalaksana.obatAlternatif ?? []).flat(),
    ...(kasus.tatalaksana.obatOpsional ?? []),
    ...(kasus.tatalaksana.obatSalahUmum ?? []).map((item) => item.id),
  ]
}

interface ReviewCatalog {
  obat: Record<string, Obat>
  tindakan: Record<string, Tindakan>
  edukasi: Record<string, TopikEdukasi>
  icd10: Record<string, string>
}

interface ReviewTopology {
  newCurriculumItems: CurriculumItem[]
  clinicalConcepts: ClinicalConcept[]
  itemConcepts: CurriculumItemConcept[]
}

export interface M13ReviewEnvelope {
  schemaVersion: 2
  reviewId: string
  kind: 'clinic' | 'igd' | 'ukm'
  release: {
    basedOn: string
    proposed: string
  }
  content: unknown
  proposedCatalog: ReviewCatalog
  curriculumTopology: ReviewTopology
  runtimePolicy: EncounterArchetype | UkmScenario
  evidenceBindings: EvidenceBinding[]
  sourceMetadata: M13AuthoringSource[]
  proposedKarmaRewires: ProposedKarmaRewire[]
  physicianDecision: string
}

const EMPTY_CATALOG: ReviewCatalog = {
  obat: {},
  tindakan: {},
  edukasi: {},
  icd10: {},
}

function topologyFor(archetype: EncounterArchetype): ReviewTopology {
  const itemConcepts = M13_1A_ITEM_CONCEPTS
    .filter((relation) => relation.conceptId === archetype.conceptId)
    .sort((a, b) => `${a.itemId}:${a.conceptId}`.localeCompare(`${b.itemId}:${b.conceptId}`))
  const itemIds = new Set(itemConcepts.map((relation) => relation.itemId))
  return {
    newCurriculumItems: urutId(M13_1A_NEW_CURRICULUM_ITEMS.filter((item) => itemIds.has(item.id))),
    clinicalConcepts: urutId(M13_1A_CLINICAL_CONCEPTS.filter((concept) => concept.id === archetype.conceptId)),
    itemConcepts,
  }
}

function evidenceFor(policyId: string, topology: ReviewTopology): EvidenceBinding[] {
  const subjectIds = new Set([
    policyId,
    ...topology.newCurriculumItems.map((item) => item.id),
  ])
  return urutId(M13_1A_EVIDENCE_BINDINGS.filter((binding) => subjectIds.has(binding.subject.id)))
}

function sourceMetadataFor(bindings: EvidenceBinding[]): M13AuthoringSource[] {
  const ids = new Set(bindings.map((binding) => binding.source))
  return urutId(M13_1A_SOURCES.filter((source) => ids.has(source.id)))
}

function physicianDecision(reviewId: string): string {
  const decision = M13_1A_PHYSICIAN_DECISION_BY_REVIEW_ID[reviewId]
  if (!decision) throw new Error(`M13-1a: pertanyaan physician review '${reviewId}' tidak ada`)
  return decision
}

function reviewEnvelope(input: {
  reviewId: string
  kind: M13ReviewEnvelope['kind']
  content: unknown
  proposedCatalog: ReviewCatalog
  runtimePolicy: M13ReviewEnvelope['runtimePolicy']
  curriculumTopology: ReviewTopology
  proposedKarmaRewires?: ProposedKarmaRewire[]
}): M13ReviewEnvelope {
  const evidenceBindings = evidenceFor(input.runtimePolicy.id, input.curriculumTopology)
  return {
    schemaVersion: 2,
    reviewId: input.reviewId,
    kind: input.kind,
    release: {
      basedOn: M13_1A_BASE_CONTENT_RELEASE,
      proposed: M13_1A_PROPOSED_CONTENT_RELEASE,
    },
    content: input.content,
    proposedCatalog: input.proposedCatalog,
    curriculumTopology: input.curriculumTopology,
    runtimePolicy: input.runtimePolicy,
    evidenceBindings,
    sourceMetadata: sourceMetadataFor(evidenceBindings),
    proposedKarmaRewires: urutKarma(input.proposedKarmaRewires ?? []),
    physicianDecision: physicianDecision(input.reviewId),
  }
}

const clinicPayloads = M13_1A_CLINIC_DRAFTS.map((kasus) => {
  const reviewId = clinicReviewId(kasus.id)
  const runtimePolicy = M13_1A_ENCOUNTER_ARCHETYPES.find(
    (candidate) => candidate.contentRef.kind === 'clinic' && candidate.contentRef.id === kasus.id,
  )
  if (!runtimePolicy) throw new Error(`M13-1a: policy clinic '${kasus.id}' tidak ada`)
  return [
    reviewId,
    reviewEnvelope({
      reviewId,
      kind: 'clinic',
      content: kasus,
      proposedCatalog: {
        obat: pilihEntri(M13_1A_OBAT_DRAFT, semuaReferensiObat(kasus)),
        tindakan: pilihEntri(M13_1A_TINDAKAN_DRAFT, kasus.tatalaksana.prosedur ?? []),
        edukasi: pilihEntri(M13_1A_EDUKASI_DRAFT, kasus.tatalaksana.edukasi),
        icd10: pilihEntri(M13_1A_PROPOSED_ICD10_ENTRIES, [kasus.icd10, ...kasus.diagnosisBanding]),
      },
      runtimePolicy,
      curriculumTopology: topologyFor(runtimePolicy),
      proposedKarmaRewires: M13_1A_PROPOSED_KARMA_REWIRES.filter(
        (rewire) => rewire.toCaseId === kasus.id,
      ),
    }),
  ] as const
})

const igdPayloads = M13_1A_IGD_DRAFTS.map((kasus) => {
  const reviewId = igdReviewId(kasus.id)
  const runtimePolicy = M13_1A_ENCOUNTER_ARCHETYPES.find(
    (candidate) => candidate.contentRef.kind === 'igd' && candidate.contentRef.id === kasus.id,
  )
  if (!runtimePolicy) throw new Error(`M13-1a: policy IGD '${kasus.id}' tidak ada`)
  return [
    reviewId,
    reviewEnvelope({
      reviewId,
      kind: 'igd',
      content: kasus,
      proposedCatalog: {
        ...EMPTY_CATALOG,
        icd10: pilihEntri(M13_1A_PROPOSED_ICD10_ENTRIES, [kasus.icd10]),
      },
      runtimePolicy,
      curriculumTopology: topologyFor(runtimePolicy),
    }),
  ] as const
})

const ukmPayloads = M13_1A_UKM_DRAFTS.map((draft) => {
  const reviewId = ukmReviewId(draft.familyId, draft.scenario.id)
  const runtimePolicy = M13_1A_UKM_SCENARIOS.find(
    (candidate) =>
      candidate.contentRef.familyId === draft.familyId &&
      candidate.contentRef.visitId === draft.scenario.id,
  )
  if (!runtimePolicy) throw new Error(`M13-1a: policy UKM '${draft.familyId}/${draft.scenario.id}' tidak ada`)
  return [
    reviewId,
    reviewEnvelope({
      reviewId,
      kind: 'ukm',
      content: { familyId: draft.familyId, scenario: draft.scenario },
      proposedCatalog: EMPTY_CATALOG,
      runtimePolicy,
      curriculumTopology: {
        newCurriculumItems: [],
        clinicalConcepts: [],
        itemConcepts: [],
      },
    }),
  ] as const
})

/**
 * Envelope review kanonik. Hash-nya mengikat konten, katalog/ICD, topology,
 * policy mode-release, evidence, metadata sumber, rewire, dan pertanyaan dokter.
 */
export const M13_1A_REVIEW_PAYLOADS: Record<string, M13ReviewEnvelope> = Object.fromEntries([
  ...clinicPayloads,
  ...igdPayloads,
  ...ukmPayloads,
])

/** Daftar sumber tiap review diturunkan dari evidence envelope, bukan dipelihara manual. */
export const M13_1A_REVIEW_SOURCE_IDS: Record<string, string[]> = Object.fromEntries(
  Object.entries(M13_1A_REVIEW_PAYLOADS).map(([reviewId, payload]) => [
    reviewId,
    payload.sourceMetadata.map((source) => source.id),
  ]),
)
