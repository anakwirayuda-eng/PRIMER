import type { IndikatorPisPk, Skdi } from '../types'

export type CurriculumItemId = string
export type ClinicalConceptId = string
export type EncounterArchetypeId = string
export type UkmScenarioId = string

export type CurriculumDomain = 'ukp' | 'ukm'
export type CurriculumReviewStatus = 'mapped' | 'needs_source_review' | 'reviewed'
export type EvidenceReviewStatus = 'pending' | 'resolved' | 'accepted_with_limitation' | 'blocked'

export type ClinicalClaimKind =
  | 'diagnosis_threshold'
  | 'red_flags'
  | 'assessment'
  | 'regimen'
  | 'contraindication'
  | 'disposition'
  | 'follow_up'
  | 'formulary'

export type EvidenceFinding =
  | 'aligned'
  | 'content_conflict'
  | 'source_conflict'
  | 'source_limitation'
  | 'coverage_gap'

export type EvidenceMateriality = 'none' | 'minor' | 'material'

export interface EvidenceReference {
  source: string
  locator: string
}

export interface PhysicianSignoff {
  reviewer: string
  credentials: string
  signedAt: string
  decision: 'approved' | 'approved_with_waiver'
  note: string
}

export type ContentReviewFacet =
  | EvidenceFacet
  | 'narrative'
  | 'pedagogy'
  | 'dangerous-path'
  | 'mode-release'

export type ContentReviewStatus =
  | 'draft'
  | 'awaiting_physician_review'
  | 'approved'
  | 'approved_with_waiver'
  | 'rejected'

export type ReviewContentRef =
  | EncounterContentRef
  | { kind: 'ukm'; familyId: string; visitId: string }

export interface TechnicalContentReview {
  reviewer: string
  credentials: string
  reviewedAt: string
  facets: ContentReviewFacet[]
  decision: 'ready_for_physician_review' | 'revision_required'
  note: string
}

/**
 * Authoring-side audit trail for a content payload. This record is deliberately
 * outside the runtime PACK; activation requires a separate release commit.
 */
export interface ContentReviewRecord {
  id: string
  contentRef: ReviewContentRef
  author: string
  authoredAt: string
  basedOnContentRelease: string
  proposedContentRelease: string
  /** SHA-256 dari review envelope kanonik: konten, policy, evidence, sumber, katalog, release, dan rewire terkait. */
  contentHash: string
  sourceIds: string[]
  status: ContentReviewStatus
  technicalReview: TechnicalContentReview
  physicianSignoff?: PhysicianSignoff
}

export interface EvidenceAudit {
  deltaId: string
  claimKind: ClinicalClaimKind
  claim: string
  contentLocator: string
  finding: EvidenceFinding
  materiality: EvidenceMateriality
  technicalReviewer: string
  reviewedAt: string
  proposedResolution: string
  corroboratingEvidence?: EvidenceReference[]
  physicianSignoff?: PhysicianSignoff
}

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
  | 'anamnesis'
  | 'diagnosis'
  | 'assessment'
  | 'regimen'
  | 'dose'
  | 'contraindication'
  | 'disposition'
  | 'follow-up'
  | 'formulary'
  | 'ukm-objective'

export interface EvidenceGovernanceContext {
  policyId: string
  floorSources: EvidenceReference[]
  supersedingSources: EvidenceReference[]
  resourceSources: EvidenceReference[]
  gracefulDegradation:
    | 'verified_available'
    | 'variable_or_unverified'
    | 'unavailable_or_outside_scope'
  implementationNote: string
}

export interface EvidenceBinding {
  id: string
  subject: EvidenceSubject
  facet: EvidenceFacet
  icd10?: string
  source: string
  locator: string
  population?: string
  reviewStatus: EvidenceReviewStatus
  audit?: EvidenceAudit
  governance?: EvidenceGovernanceContext
}

export type SourceLifecycleStatus =
  | 'active'
  | 'active_with_limitation'
  | 'amends_active_baseline'
  | 'superseded'

export interface SourceArtifact {
  path: string
  sha256: string
  bytes: number
  format: 'text'
}

/** Metadata authoring pendamping; bukan entitas kanonik ketujuh dan bukan runtime PACK. */
export interface SourceRegistryEntry {
  id: string
  issuer: string
  documentNumber: string
  title: string
  publicationDate: string
  effectiveDate: string
  lifecycleStatus: SourceLifecycleStatus
  supersedes?: string[]
  supersededBy?: string[]
  amends?: string[]
  officialUrl: string
  retrievedAt: string
  population: string
  facilityScope: string
  localArtifact: SourceArtifact
  sourceFileSha256: string
  limitation?: string
}

export interface ClinicalClaimAuditSpec {
  claimKind: ClinicalClaimKind
  facet: EvidenceFacet
  source: string
  locator: string
  claim: string
  contentLocator: string
  finding: EvidenceFinding
  materiality: EvidenceMateriality
  proposedResolution: string
  corroboratingEvidence?: EvidenceReference[]
}

export interface DeltaAuditRecord {
  id: string
  caseId: string
  archetypeId: EncounterArchetypeId
  title: string
  currentIcd10: string
  population: string
  reviewStatus: Extract<EvidenceReviewStatus, 'resolved' | 'accepted_with_limitation' | 'blocked'>
  technicalReviewer: string
  reviewedAt: string
  claims: ClinicalClaimAuditSpec[]
  blockers: string[]
  physicianSignoff?: PhysicianSignoff
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
