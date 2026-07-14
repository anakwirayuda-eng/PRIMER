import type { IndikatorPisPk, Skdi } from '../types'

export type CurriculumItemId = string
export type ClinicalConceptId = string
export type EncounterArchetypeId = string
export type UkmScenarioId = string

export type CurriculumDomain = 'ukp' | 'ukm'
export type CurriculumReviewStatus = 'mapped' | 'needs_source_review' | 'reviewed'
export type EvidenceReviewStatus = 'pending' | 'resolved' | 'accepted_with_limitation' | 'blocked'

export interface ModePolicy {
  karier: boolean
  ujian: boolean
}

export interface ReleasePolicy {
  introducedIn: string
  retiredAfter?: string
}

export interface CurriculumItem {
  id: CurriculumItemId
  catalogId: string
  domain: CurriculumDomain
  judulResmi: string
  skdiLevel?: Skdi
  tier?: 'A' | 'B' | 'C'
  statusReview: CurriculumReviewStatus
}

export interface ClinicalConcept {
  id: ClinicalConceptId
  diagnosis: string
  aliases?: string[]
}

export interface CurriculumItemConcept {
  itemId: CurriculumItemId
  conceptId: ClinicalConceptId
}

export type EncounterContentRef =
  | { kind: 'clinic'; id: string }
  | { kind: 'igd'; id: string }

export type SeverityDegree =
  | 'uncomplicated_or_stable'
  | 'referral_required'
  | 'referral_needs_stabilization'
  | 'emergency'

export type TargetFktp =
  | 'manage_at_fktp'
  | 'refer'
  | 'stabilize_then_refer'
  | 'stabilize_then_discharge'

export interface ExcludedCredit {
  itemId: CurriculumItemId
  reason: string
}

export interface EncounterArchetype {
  id: EncounterArchetypeId
  conceptId: ClinicalConceptId
  contentRef: EncounterContentRef
  channel: 'clinic' | 'igd'
  severityDegree: SeverityDegree
  targetFktp: TargetFktp
  prevalensi: 'tinggi' | 'sedang' | 'rendah' | 'not_modeled'
  modePolicy: ModePolicy
  releasePolicy: ReleasePolicy
  credits: CurriculumItemId[]
  /** Keputusan eksplisit bahwa relasi lama/konseptual tidak memberi sertifikasi. */
  excludedCredits?: ExcludedCredit[]
  /** Wajib bila credits kosong. */
  creditRationale?: string
}

export interface UkmScenario {
  id: UkmScenarioId
  contentRef: { familyId: string; visitId: string }
  modePolicy: ModePolicy
  releasePolicy: ReleasePolicy
  credits: CurriculumItemId[]
}

export type EvidenceSubject =
  | { kind: 'curriculum_item'; id: CurriculumItemId }
  | { kind: 'encounter_archetype'; id: EncounterArchetypeId }
  | { kind: 'ukm_scenario'; id: UkmScenarioId }

export type EvidenceFacet =
  | 'membership'
  | 'skdi'
  | 'diagnosis'
  | 'regimen'
  | 'dose'
  | 'disposition'
  | 'formulary'
  | 'ukm-objective'

export interface EvidenceBinding {
  id: string
  subject: EvidenceSubject
  facet: EvidenceFacet
  icd10?: string
  source: string
  locator: string
  population?: string
  reviewStatus: EvidenceReviewStatus
}

export interface CurriculumBlueprint {
  schemaVersion: 1
  baselineId: string
  curriculumItems: CurriculumItem[]
  clinicalConcepts: ClinicalConcept[]
  itemConcepts: CurriculumItemConcept[]
  encounterArchetypes: EncounterArchetype[]
  evidenceBindings: EvidenceBinding[]
  ukmScenarios: UkmScenario[]
}

export interface ClinicalMasteryOutcome {
  encountered: boolean
  diagnosisCorrect: boolean
  dispositionCorrect: boolean
  masteryAchieved: boolean
}

export interface ClinicalMasteryCredit {
  encounteredItemIds: CurriculumItemId[]
  certifiedItemIds: CurriculumItemId[]
  masteredArchetypeIds: EncounterArchetypeId[]
}

export interface UkmMasteryCredit {
  encounteredItemIds: CurriculumItemId[]
  certifiedItemIds: CurriculumItemId[]
  masteredScenarioIds: UkmScenarioId[]
}

export type UkmObjectiveId = IndikatorPisPk
