import type {
  ClinicalConcept,
  CurriculumItem,
  CurriculumItemConcept,
  EncounterArchetype,
  UkmScenario,
} from '../types'
import { M13_1A_PROPOSED_CONTENT_RELEASE } from './constants'

export const M13_1A_NEW_CURRICULUM_ITEMS: CurriculumItem[] = [
  {
    id: 'clinical:status_asmatikus_anak',
    catalogId: 'skdi-2012-clinical',
    domain: 'ukp',
    judulResmi: 'Status asmatikus (asma akut berat) pada anak',
    skdiLevel: '3B',
    tier: 'A',
    statusReview: 'needs_source_review',
  },
  {
    id: 'clinical:fraktur_terbuka',
    catalogId: 'skdi-2012-clinical',
    domain: 'ukp',
    judulResmi: 'Fraktur terbuka',
    skdiLevel: '3B',
    tier: 'B',
    statusReview: 'needs_source_review',
  },
  {
    id: 'clinical:infark_miokard_akut',
    catalogId: 'skdi-2012-clinical',
    domain: 'ukp',
    judulResmi: 'Infark miokard akut',
    skdiLevel: '3B',
    tier: 'A',
    statusReview: 'needs_source_review',
  },
]

export const M13_1A_CLINICAL_CONCEPTS: ClinicalConcept[] = [
  { id: 'concept:gastroenteritis_bayi_dehidrasi_berat', diagnosis: 'Gastroenteritis akut pada bayi dengan dehidrasi berat' },
  { id: 'concept:status_asmatikus_anak', diagnosis: 'Eksaserbasi asma berat/status asmatikus pada anak' },
  { id: 'concept:hipoglikemia_ringan_dewasa', diagnosis: 'Hipoglikemia ringan pada dewasa dengan DM' },
  { id: 'concept:benda_asing_hidung_anak', diagnosis: 'Benda asing di lubang hidung pada anak' },
  { id: 'concept:otitis_eksterna_akut', diagnosis: 'Otitis eksterna akut ringan' },
  { id: 'concept:fraktur_terbuka_tibia', diagnosis: 'Fraktur terbuka tibia' },
  { id: 'concept:stemi_anterior', diagnosis: 'ST-elevation myocardial infarction anterior' },
]

export const M13_1A_ITEM_CONCEPTS: CurriculumItemConcept[] = [
  { itemId: 'fktp144:acute_gastroenteritis', conceptId: 'concept:gastroenteritis_bayi_dehidrasi_berat' },
  { itemId: 'clinical:status_asmatikus_anak', conceptId: 'concept:status_asmatikus_anak' },
  { itemId: 'fktp144:asthma_bronchiale', conceptId: 'concept:status_asmatikus_anak' },
  { itemId: 'fktp144:hypoglycemia_mild', conceptId: 'concept:hipoglikemia_ringan_dewasa' },
  { itemId: 'fktp144:foreign_body_nose', conceptId: 'concept:benda_asing_hidung_anak' },
  { itemId: 'fktp144:otitis_externa', conceptId: 'concept:otitis_eksterna_akut' },
  { itemId: 'clinical:fraktur_terbuka', conceptId: 'concept:fraktur_terbuka_tibia' },
  { itemId: 'clinical:infark_miokard_akut', conceptId: 'concept:stemi_anterior' },
]

const CAREER_ONLY = { karier: true, ujian: false } as const
const PROPOSED_RELEASE = { introducedIn: M13_1A_PROPOSED_CONTENT_RELEASE }

export const M13_1A_ENCOUNTER_ARCHETYPES: EncounterArchetype[] = [
  {
    id: 'clinic:diare_akut_bayi_dehidrasi_berat',
    conceptId: 'concept:gastroenteritis_bayi_dehidrasi_berat',
    contentRef: { kind: 'clinic', id: 'diare_akut_bayi_dehidrasi_berat' },
    channel: 'clinic',
    severityDegree: 'referral_needs_stabilization',
    targetFktp: 'stabilize_then_refer',
    prevalensi: 'tinggi',
    modePolicy: CAREER_ONLY,
    releasePolicy: PROPOSED_RELEASE,
    credits: ['fktp144:acute_gastroenteritis'],
  },
  {
    id: 'clinic:asma_eksaserbasi_berat_anak',
    conceptId: 'concept:status_asmatikus_anak',
    contentRef: { kind: 'clinic', id: 'asma_eksaserbasi_berat_anak' },
    channel: 'clinic',
    severityDegree: 'referral_needs_stabilization',
    targetFktp: 'stabilize_then_refer',
    prevalensi: 'sedang',
    modePolicy: CAREER_ONLY,
    releasePolicy: PROPOSED_RELEASE,
    credits: ['clinical:status_asmatikus_anak'],
    excludedCredits: [
      {
        itemId: 'fktp144:asthma_bronchiale',
        reason: 'Eksaserbasi berat/status asmatikus adalah kompetensi 3B, bukan encounter penguasaan asma bronkial stabil 4A.',
      },
    ],
  },
  {
    id: 'clinic:hipoglikemia_ringan_dewasa',
    conceptId: 'concept:hipoglikemia_ringan_dewasa',
    contentRef: { kind: 'clinic', id: 'hipoglikemia_ringan_dewasa' },
    channel: 'clinic',
    severityDegree: 'uncomplicated_or_stable',
    targetFktp: 'manage_at_fktp',
    prevalensi: 'sedang',
    modePolicy: CAREER_ONLY,
    releasePolicy: PROPOSED_RELEASE,
    credits: ['fktp144:hypoglycemia_mild'],
  },
  {
    id: 'clinic:benda_asing_hidung_anak',
    conceptId: 'concept:benda_asing_hidung_anak',
    contentRef: { kind: 'clinic', id: 'benda_asing_hidung_anak' },
    channel: 'clinic',
    severityDegree: 'uncomplicated_or_stable',
    targetFktp: 'manage_at_fktp',
    prevalensi: 'sedang',
    modePolicy: CAREER_ONLY,
    releasePolicy: PROPOSED_RELEASE,
    credits: ['fktp144:foreign_body_nose'],
  },
  {
    id: 'clinic:otitis_eksterna_akut_ringan',
    conceptId: 'concept:otitis_eksterna_akut',
    contentRef: { kind: 'clinic', id: 'otitis_eksterna_akut_ringan' },
    channel: 'clinic',
    severityDegree: 'uncomplicated_or_stable',
    targetFktp: 'manage_at_fktp',
    prevalensi: 'sedang',
    modePolicy: CAREER_ONLY,
    releasePolicy: PROPOSED_RELEASE,
    credits: ['fktp144:otitis_externa'],
  },
  {
    id: 'clinic:fraktur_terbuka_tibia_stabil',
    conceptId: 'concept:fraktur_terbuka_tibia',
    contentRef: { kind: 'clinic', id: 'fraktur_terbuka_tibia_stabil' },
    channel: 'clinic',
    severityDegree: 'referral_needs_stabilization',
    targetFktp: 'stabilize_then_refer',
    prevalensi: 'rendah',
    modePolicy: CAREER_ONLY,
    releasePolicy: PROPOSED_RELEASE,
    credits: ['clinical:fraktur_terbuka'],
  },
  {
    id: 'igd:igd_stemi_anterior_hipoksemik',
    conceptId: 'concept:stemi_anterior',
    contentRef: { kind: 'igd', id: 'igd_stemi_anterior_hipoksemik' },
    channel: 'igd',
    severityDegree: 'emergency',
    targetFktp: 'stabilize_then_refer',
    prevalensi: 'rendah',
    modePolicy: CAREER_ONLY,
    releasePolicy: PROPOSED_RELEASE,
    credits: [],
    excludedCredits: [
      {
        itemId: 'clinical:infark_miokard_akut',
        reason: 'IGD melatih keputusan waktu-kritis tetapi tidak memberi sertifikasi diagnosis/mastery klinik pada baseline M13.',
      },
    ],
    creditRationale: 'Kanal IGD baseline tidak memberikan kredit diagnostik; mastery membutuhkan encounter klinik terpisah.',
  },
]

export const M13_1A_UKM_SCENARIOS: UkmScenario[] = [
  {
    id: 'ukm:keluarga_gunawan:gunawan_k2',
    contentRef: { familyId: 'keluarga_gunawan', visitId: 'gunawan_k2' },
    modePolicy: CAREER_ONLY,
    releasePolicy: PROPOSED_RELEASE,
    credits: ['ukm:pis-pk:tidak_merokok'],
  },
]

export interface ProposedKarmaRewire {
  familyId: string
  visitId: string
  memberIndex: number
  fromCaseId: string
  toCaseId: string
}

export const M13_1A_PROPOSED_KARMA_REWIRES: ProposedKarmaRewire[] = [
  {
    familyId: 'keluarga_yani',
    visitId: 'yani_k1',
    memberIndex: 3,
    fromCaseId: 'diare_akut_anak',
    toCaseId: 'diare_akut_bayi_dehidrasi_berat',
  },
  {
    familyId: 'keluarga_gunawan',
    visitId: 'gunawan_k1',
    memberIndex: 2,
    fromCaseId: 'asma_ringan',
    toCaseId: 'asma_eksaserbasi_berat_anak',
  },
]
