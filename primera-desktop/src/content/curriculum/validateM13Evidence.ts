import type { ContentPack } from '../pack'
import type {
  CurriculumBlueprint,
  DeltaAuditRecord,
  SourceRegistryEntry,
} from './types'
import { M13_CLAIM_FACET, M13_REQUIRED_CLAIM_KINDS } from './m13DeltaAudit'

const EXPECTED_CASE_IDS = new Set([
  'hipertensi_esensial',
  'dm_tipe2',
  'stroke_iskemik',
  'saraf_epilepsi_kejang',
])

function duplicates(values: string[]): string[] {
  const seen = new Set<string>()
  const duplicate = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) duplicate.add(value)
    seen.add(value)
  }
  return [...duplicate].sort()
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
}

function isSha256(value: string): boolean {
  return /^[A-F0-9]{64}$/.test(value)
}

function validateSourceRegistry(registry: SourceRegistryEntry[], masalah: string[]): void {
  for (const id of duplicates(registry.map((source) => source.id))) {
    masalah.push(`SourceRegistry: id duplikat '${id}'`)
  }
  for (const source of registry) {
    if (!source.id.trim()) masalah.push('SourceRegistry: id kosong')
    if (!source.issuer.trim()) masalah.push(`SourceRegistry ${source.id}: issuer kosong`)
    if (!source.documentNumber.trim()) masalah.push(`SourceRegistry ${source.id}: documentNumber kosong`)
    if (!source.title.trim()) masalah.push(`SourceRegistry ${source.id}: title kosong`)
    if (!isIsoDate(source.publicationDate)) masalah.push(`SourceRegistry ${source.id}: publicationDate tidak valid`)
    if (!isIsoDate(source.effectiveDate)) masalah.push(`SourceRegistry ${source.id}: effectiveDate tidak valid`)
    if (!isIsoDate(source.retrievedAt)) masalah.push(`SourceRegistry ${source.id}: retrievedAt tidak valid`)
    try {
      const url = new URL(source.officialUrl)
      if (url.protocol !== 'https:') masalah.push(`SourceRegistry ${source.id}: officialUrl wajib HTTPS`)
    } catch {
      masalah.push(`SourceRegistry ${source.id}: officialUrl tidak valid`)
    }
    if (!source.population.trim()) masalah.push(`SourceRegistry ${source.id}: population kosong`)
    if (!source.facilityScope.trim()) masalah.push(`SourceRegistry ${source.id}: facilityScope kosong`)
    if (!source.localArtifact.path.startsWith('docs/references/')) {
      masalah.push(`SourceRegistry ${source.id}: artefak lokal harus berada di docs/references`)
    }
    if (!isSha256(source.localArtifact.sha256)) masalah.push(`SourceRegistry ${source.id}: hash artefak tidak valid`)
    if (!isSha256(source.sourceFileSha256)) masalah.push(`SourceRegistry ${source.id}: hash sumber tidak valid`)
    if (source.localArtifact.bytes <= 0) masalah.push(`SourceRegistry ${source.id}: ukuran artefak tidak valid`)
    if (source.lifecycleStatus === 'active_with_limitation' && !source.limitation?.trim()) {
      masalah.push(`SourceRegistry ${source.id}: status limitation tanpa penjelasan`)
    }
    if (source.lifecycleStatus !== 'active_with_limitation' && source.limitation?.trim()) {
      masalah.push(`SourceRegistry ${source.id}: limitation ada tetapi lifecycleStatus bukan active_with_limitation`)
    }
    if (source.lifecycleStatus === 'superseded' && (source.supersededBy?.length ?? 0) === 0) {
      masalah.push(`SourceRegistry ${source.id}: superseded tanpa supersededBy`)
    }
  }
}

export function validasiM13EvidenceAudit(
  blueprint: CurriculumBlueprint,
  pack: ContentPack,
  registry: SourceRegistryEntry[],
  audits: DeltaAuditRecord[],
): string[] {
  const masalah: string[] = []
  validateSourceRegistry(registry, masalah)

  const sourceIds = new Set(registry.map((source) => source.id))
  const actualCases = new Set(audits.map((audit) => audit.caseId))
  for (const caseId of EXPECTED_CASE_IDS) {
    if (!actualCases.has(caseId)) masalah.push(`M13-0B: kasus wajib '${caseId}' belum diaudit`)
  }
  for (const caseId of actualCases) {
    if (!EXPECTED_CASE_IDS.has(caseId)) masalah.push(`M13-0B: audit ekstra tak terencana '${caseId}'`)
  }
  for (const id of duplicates(audits.map((audit) => audit.id))) masalah.push(`DeltaAuditRecord: id duplikat '${id}'`)
  for (const caseId of duplicates(audits.map((audit) => audit.caseId))) {
    masalah.push(`DeltaAuditRecord: caseId duplikat '${caseId}'`)
  }

  const bindingsByDelta = new Map<string, typeof blueprint.evidenceBindings>()
  for (const binding of blueprint.evidenceBindings) {
    if (!binding.audit) continue
    const current = bindingsByDelta.get(binding.audit.deltaId) ?? []
    current.push(binding)
    bindingsByDelta.set(binding.audit.deltaId, current)
  }
  const auditIds = new Set(audits.map((audit) => audit.id))
  for (const deltaId of bindingsByDelta.keys()) {
    if (!auditIds.has(deltaId)) masalah.push(`EvidenceBinding audit menunjuk delta yatim '${deltaId}'`)
  }

  for (const audit of audits) {
    const kasus = pack.kasus[audit.caseId]
    if (!kasus) masalah.push(`DeltaAuditRecord ${audit.id}: caseId '${audit.caseId}' tidak ada`)
    else if (kasus.icd10 !== audit.currentIcd10) {
      masalah.push(`DeltaAuditRecord ${audit.id}: currentIcd10 '${audit.currentIcd10}' tidak sama dengan konten '${kasus.icd10}'`)
    }
    const archetype = blueprint.encounterArchetypes.find((candidate) => candidate.id === audit.archetypeId)
    if (!archetype) masalah.push(`DeltaAuditRecord ${audit.id}: archetype '${audit.archetypeId}' tidak ada`)
    else if (archetype.contentRef.kind !== 'clinic' || archetype.contentRef.id !== audit.caseId) {
      masalah.push(`DeltaAuditRecord ${audit.id}: archetype tidak menunjuk caseId yang sama`)
    }
    if (!audit.population.trim()) masalah.push(`DeltaAuditRecord ${audit.id}: population kosong`)
    if (!audit.technicalReviewer.trim()) masalah.push(`DeltaAuditRecord ${audit.id}: technicalReviewer kosong`)
    if (!isIsoDate(audit.reviewedAt)) masalah.push(`DeltaAuditRecord ${audit.id}: reviewedAt tidak valid`)
    if (audit.reviewStatus === 'blocked' && audit.blockers.length === 0) {
      masalah.push(`DeltaAuditRecord ${audit.id}: blocked tanpa blocker`)
    }
    if (audit.reviewStatus !== 'blocked' && audit.blockers.length > 0) {
      masalah.push(`DeltaAuditRecord ${audit.id}: status ${audit.reviewStatus} masih memiliki blocker`)
    }
    if (audit.reviewStatus !== 'blocked' && !audit.physicianSignoff) {
      masalah.push(`DeltaAuditRecord ${audit.id}: status ${audit.reviewStatus} tanpa physician sign-off`)
    }
    if (audit.physicianSignoff) {
      if (!audit.physicianSignoff.reviewer.trim()) masalah.push(`DeltaAuditRecord ${audit.id}: sign-off tanpa reviewer`)
      if (!audit.physicianSignoff.credentials.trim()) masalah.push(`DeltaAuditRecord ${audit.id}: sign-off tanpa credentials`)
      if (!isIsoDate(audit.physicianSignoff.signedAt)) masalah.push(`DeltaAuditRecord ${audit.id}: signedAt tidak valid`)
      if (!audit.physicianSignoff.note.trim()) masalah.push(`DeltaAuditRecord ${audit.id}: sign-off tanpa note`)
      if (audit.reviewStatus === 'resolved' && audit.physicianSignoff.decision !== 'approved') {
        masalah.push(`DeltaAuditRecord ${audit.id}: resolved wajib memakai decision approved`)
      }
      if (
        audit.reviewStatus === 'accepted_with_limitation' &&
        audit.physicianSignoff.decision !== 'approved_with_waiver'
      ) {
        masalah.push(`DeltaAuditRecord ${audit.id}: accepted_with_limitation wajib memakai decision approved_with_waiver`)
      }
    }
    if (new Set(audit.claims.map((claim) => claim.claimKind)).size !== audit.claims.length) {
      masalah.push(`DeltaAuditRecord ${audit.id}: claimKind duplikat`)
    }
    for (const kind of M13_REQUIRED_CLAIM_KINDS) {
      if (!audit.claims.some((claim) => claim.claimKind === kind)) {
        masalah.push(`DeltaAuditRecord ${audit.id}: claimKind '${kind}' hilang`)
      }
    }
    if (audit.claims.length !== M13_REQUIRED_CLAIM_KINDS.length) {
      masalah.push(`DeltaAuditRecord ${audit.id}: wajib tepat ${M13_REQUIRED_CLAIM_KINDS.length} claim`)
    }
    for (const claim of audit.claims) {
      if (claim.facet !== M13_CLAIM_FACET[claim.claimKind]) {
        masalah.push(`DeltaAuditRecord ${audit.id}: facet '${claim.facet}' tidak cocok claimKind '${claim.claimKind}'`)
      }
      if (!sourceIds.has(claim.source)) masalah.push(`DeltaAuditRecord ${audit.id}: source yatim '${claim.source}'`)
      if (!claim.locator.trim()) masalah.push(`DeltaAuditRecord ${audit.id}/${claim.claimKind}: locator kosong`)
      if (!claim.claim.trim()) masalah.push(`DeltaAuditRecord ${audit.id}/${claim.claimKind}: claim kosong`)
      if (!claim.contentLocator.trim()) masalah.push(`DeltaAuditRecord ${audit.id}/${claim.claimKind}: contentLocator kosong`)
      if (!claim.proposedResolution.trim()) masalah.push(`DeltaAuditRecord ${audit.id}/${claim.claimKind}: proposedResolution kosong`)
      for (const reference of claim.corroboratingEvidence ?? []) {
        if (!sourceIds.has(reference.source)) {
          masalah.push(`DeltaAuditRecord ${audit.id}/${claim.claimKind}: corroborating source yatim '${reference.source}'`)
        }
        if (!reference.locator.trim()) {
          masalah.push(`DeltaAuditRecord ${audit.id}/${claim.claimKind}: corroborating locator kosong`)
        }
      }
    }

    const bindings = bindingsByDelta.get(audit.id) ?? []
    if (bindings.length !== audit.claims.length) {
      masalah.push(`DeltaAuditRecord ${audit.id}: ${bindings.length} binding untuk ${audit.claims.length} claim`)
    }
    for (const claim of audit.claims) {
      const binding = bindings.find((candidate) => candidate.audit?.claimKind === claim.claimKind)
      if (!binding) {
        masalah.push(`DeltaAuditRecord ${audit.id}: binding '${claim.claimKind}' hilang`)
        continue
      }
      if (binding.reviewStatus !== audit.reviewStatus) {
        masalah.push(`EvidenceBinding ${binding.id}: status tidak sama dengan delta`)
      }
      if (binding.subject.kind !== 'encounter_archetype' || binding.subject.id !== audit.archetypeId) {
        masalah.push(`EvidenceBinding ${binding.id}: subject drift dari delta`)
      }
      if (binding.facet !== claim.facet) masalah.push(`EvidenceBinding ${binding.id}: facet drift dari delta`)
      const expectedIcd10 = claim.claimKind === 'diagnosis_threshold' ? audit.currentIcd10 : undefined
      if (binding.icd10 !== expectedIcd10) masalah.push(`EvidenceBinding ${binding.id}: icd10 drift dari delta`)
      if (binding.source !== claim.source || binding.locator !== claim.locator) {
        masalah.push(`EvidenceBinding ${binding.id}: source/locator drift dari delta`)
      }
      if (binding.population !== audit.population) masalah.push(`EvidenceBinding ${binding.id}: population drift dari delta`)
      if (
        binding.audit?.claim !== claim.claim ||
        binding.audit.contentLocator !== claim.contentLocator ||
        binding.audit.finding !== claim.finding ||
        binding.audit.materiality !== claim.materiality ||
        binding.audit.proposedResolution !== claim.proposedResolution ||
        binding.audit.technicalReviewer !== audit.technicalReviewer ||
        binding.audit.reviewedAt !== audit.reviewedAt ||
        JSON.stringify(binding.audit.corroboratingEvidence) !== JSON.stringify(claim.corroboratingEvidence)
      ) {
        masalah.push(`EvidenceBinding ${binding.id}: payload audit drift dari delta`)
      }
      if (JSON.stringify(binding.audit?.physicianSignoff) !== JSON.stringify(audit.physicianSignoff)) {
        masalah.push(`EvidenceBinding ${binding.id}: physician sign-off drift dari delta`)
      }
    }
  }

  return masalah
}

export interface M13EvidenceGate {
  ready: boolean
  blockedDeltaIds: string[]
  unsignedDeltaIds: string[]
  nonTerminalDeltaIds: string[]
}

export function evaluasiM13EvidenceGate(audits: DeltaAuditRecord[]): M13EvidenceGate {
  const blockedDeltaIds = audits.filter((audit) => audit.reviewStatus === 'blocked').map((audit) => audit.id)
  const unsignedDeltaIds = audits.filter((audit) => !audit.physicianSignoff).map((audit) => audit.id)
  const nonTerminalDeltaIds = audits
    .filter((audit) => !['resolved', 'accepted_with_limitation', 'blocked'].includes(audit.reviewStatus))
    .map((audit) => audit.id)
  return {
    ready: blockedDeltaIds.length === 0 && unsignedDeltaIds.length === 0 && nonTerminalDeltaIds.length === 0,
    blockedDeltaIds,
    unsignedDeltaIds,
    nonTerminalDeltaIds,
  }
}
