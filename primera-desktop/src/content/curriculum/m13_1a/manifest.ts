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
} from './policyDraft'
import { M13_1A_PHYSICIAN_DECISIONS_REQUIRED } from './reviewQuestions'
import { M13_1A_REVIEW_RECORDS } from './reviewRecords'
import { M13_1A_SOURCES } from './sources'
import { M13_1A_UKM_DRAFTS } from './ukmDraft'

export { M13_1A_BASE_CONTENT_RELEASE, M13_1A_PROPOSED_CONTENT_RELEASE } from './constants'
export {
  M13_1A_CLINICAL_CONCEPTS,
  M13_1A_ENCOUNTER_ARCHETYPES,
  M13_1A_ITEM_CONCEPTS,
  M13_1A_NEW_CURRICULUM_ITEMS,
  M13_1A_PROPOSED_KARMA_REWIRES,
  M13_1A_UKM_SCENARIOS,
} from './policyDraft'
export type { ProposedKarmaRewire } from './policyDraft'
export {
  M13_1A_PHYSICIAN_DECISION_BY_REVIEW_ID,
  M13_1A_PHYSICIAN_DECISIONS_REQUIRED,
} from './reviewQuestions'

export type M13AuthoringTier = 'A' | 'B' | 'C'

export interface M13ClinicDraftSpec {
  caseId: string
  authoringTier: M13AuthoringTier
  role: 'karma-counterpart' | 'representative'
}

export const M13_1A_CLINIC_SPECS: M13ClinicDraftSpec[] = [
  { caseId: 'diare_akut_bayi_dehidrasi_berat', authoringTier: 'A', role: 'karma-counterpart' },
  { caseId: 'asma_eksaserbasi_berat_anak', authoringTier: 'A', role: 'karma-counterpart' },
  { caseId: 'hipoglikemia_ringan_dewasa', authoringTier: 'A', role: 'representative' },
  { caseId: 'benda_asing_hidung_anak', authoringTier: 'B', role: 'representative' },
  { caseId: 'otitis_eksterna_akut_ringan', authoringTier: 'C', role: 'representative' },
  { caseId: 'fraktur_terbuka_tibia_stabil', authoringTier: 'B', role: 'representative' },
]

export { M13_1A_PROPOSED_ICD10_ENTRIES } from './icdDraft'

export const M13_1A_ACTIVATION_BLOCKERS = [
  'Engine saat ini hanya dapat memberi cap stabilisasiTerlewat untuk satu stabilisasiWajib per kasus, sedangkan Dimas dan fraktur terbuka memerlukan bundel beberapa tindakan. Sebelum aktivasi, putuskan perluasan engine atau waiver scoring yang eksplisit.',
  'Usia pasien runtime disimpan sebagai tahun bulat. Nayla berusia 3 bulan akan tampil sebagai 0 tahun di header pasien kecuali ditambah representasi/display usia bulan atau override yang ikut diverifikasi.',
  'Harga obat dan biaya tindakan pada katalog draf adalah placeholder authoring, bukan klaim harga pengadaan. Kalibrasikan terhadap ekonomi game dan sumber lokal sebelum aktivasi.',
  'Tindakan ekstraksi benda asing masih generik; engine belum dapat membedakan teknik aman dari blind probing atau menjepit benda bulat dari depan. Tambahkan dangerous-action gate atau waiver pedagogis sebelum aktivasi.',
  'Data rumah sakit hanya memodelkan spesialisasi, bukan kemampuan PCI/fibrinolisis. IGD STEMI tidak boleh aktif sampai tujuan jejaring reperfusi dapat diverifikasi atau diberi gate khusus.',
] as const

export const M13_1A_AUTHORING_MANIFEST = {
  schemaVersion: 1 as const,
  activationStatus: 'awaiting_physician_review' as const,
  basedOnContentRelease: M13_1A_BASE_CONTENT_RELEASE,
  proposedContentRelease: M13_1A_PROPOSED_CONTENT_RELEASE,
  clinicCases: M13_1A_CLINIC_DRAFTS,
  clinicSpecs: M13_1A_CLINIC_SPECS,
  igdCases: M13_1A_IGD_DRAFTS,
  ukmDrafts: M13_1A_UKM_DRAFTS,
  proposedCatalog: {
    obat: M13_1A_OBAT_DRAFT,
    tindakan: M13_1A_TINDAKAN_DRAFT,
    edukasi: M13_1A_EDUKASI_DRAFT,
  },
  newCurriculumItems: M13_1A_NEW_CURRICULUM_ITEMS,
  clinicalConcepts: M13_1A_CLINICAL_CONCEPTS,
  itemConcepts: M13_1A_ITEM_CONCEPTS,
  encounterArchetypes: M13_1A_ENCOUNTER_ARCHETYPES,
  ukmScenarios: M13_1A_UKM_SCENARIOS,
  evidenceBindings: M13_1A_EVIDENCE_BINDINGS,
  sourceSet: M13_1A_SOURCES,
  reviewRecords: M13_1A_REVIEW_RECORDS,
  proposedKarmaRewires: M13_1A_PROPOSED_KARMA_REWIRES,
  proposedIcd10Entries: M13_1A_PROPOSED_ICD10_ENTRIES,
  physicianDecisionsRequired: M13_1A_PHYSICIAN_DECISIONS_REQUIRED,
  activationBlockers: M13_1A_ACTIVATION_BLOCKERS,
}

export type M13AuthoringManifest = typeof M13_1A_AUTHORING_MANIFEST
