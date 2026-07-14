import type { ContentReviewFacet, ContentReviewRecord } from '../types'
import {
  M13_1A_AUTHORED_AT,
  M13_1A_BASE_CONTENT_RELEASE,
  M13_1A_PROPOSED_CONTENT_RELEASE,
} from './constants'
import {
  M13_1A_REVIEW_SOURCE_IDS,
  clinicReviewId,
  igdReviewId,
  ukmReviewId,
} from './reviewPayloads'

const TECHNICAL_REVIEWER = 'Codex (technical authoring audit)'
const TECHNICAL_CREDENTIALS = 'AI coding agent; bukan physician reviewer'

/** SHA-256 JSON.stringify(review envelope kanonik), dihitung setelah technical review. */
export const M13_1A_REVIEW_HASHES: Record<string, string> = {
  'm13-1a-review-clinic-diare_akut_bayi_dehidrasi_berat': 'cdc51dfbacadd4d492bb1ade9b204dde55818e2618d119e20fc0abccfad4b837',
  'm13-1a-review-clinic-asma_eksaserbasi_berat_anak': '5c28241f0aa7c21c7ba3bc6475269bd713e460c5d837a8c03bb01ae7bc870e47',
  'm13-1a-review-clinic-hipoglikemia_ringan_dewasa': '5c19eef81c940516d799d672173096a4b84a8dcacfcaf05c96c074c57f48fc0b',
  'm13-1a-review-clinic-benda_asing_hidung_anak': '4142a03601011b687cb611caf43ee73af9c0d42e58dd520cf4fbe8936968fccf',
  'm13-1a-review-clinic-otitis_eksterna_akut_ringan': '8c73ae002f2c27ad6e5f12c0cdb0497efd518895862aa7fd5b25d9d691d67ae8',
  'm13-1a-review-clinic-fraktur_terbuka_tibia_stabil': 'cdb66765c7b058c1e4a21ccf454af10e4269c2032c15e497da5c151ecfc41bf5',
  'm13-1a-review-igd-igd_stemi_anterior_hipoksemik': '84fdcb454c6c5448e2b712cfa165aff94c813e1e837026029ce5b03bb01769cb',
  'm13-1a-review-ukm-keluarga_gunawan-gunawan_k2': 'b8d83a47768efd0bc0c25324fd44c58172f71156c3c2628883c1e88cb331092d',
}

function technicalReview(facets: ContentReviewFacet[], note: string) {
  return {
    reviewer: TECHNICAL_REVIEWER,
    credentials: TECHNICAL_CREDENTIALS,
    reviewedAt: M13_1A_AUTHORED_AT,
    facets,
    decision: 'ready_for_physician_review' as const,
    note,
  }
}

function baseRecord(
  id: string,
  contentRef: ContentReviewRecord['contentRef'],
  facets: ContentReviewFacet[],
  note: string,
): ContentReviewRecord {
  return {
    id,
    contentRef,
    author: 'Codex (AI-assisted draft; physician approval required)',
    authoredAt: M13_1A_AUTHORED_AT,
    basedOnContentRelease: M13_1A_BASE_CONTENT_RELEASE,
    proposedContentRelease: M13_1A_PROPOSED_CONTENT_RELEASE,
    contentHash: M13_1A_REVIEW_HASHES[id] ?? '',
    sourceIds: M13_1A_REVIEW_SOURCE_IDS[id] ?? [],
    status: 'awaiting_physician_review',
    technicalReview: technicalReview(facets, note),
  }
}

export const M13_1A_REVIEW_RECORDS: ContentReviewRecord[] = [
  baseRecord(
    clinicReviewId('diare_akut_bayi_dehidrasi_berat'),
    { kind: 'clinic', id: 'diare_akut_bayi_dehidrasi_berat' },
    ['narrative', 'anamnesis', 'assessment', 'dose', 'disposition', 'pedagogy', 'dangerous-path', 'mode-release'],
    'Draft menutup mismatch Nayla; Plan C, kemampuan minum, zinc bayi, dan kebijakan stabilisasi-sambil-rujuk tetap memerlukan adjudikasi dokter.',
  ),
  baseRecord(
    clinicReviewId('asma_eksaserbasi_berat_anak'),
    { kind: 'clinic', id: 'asma_eksaserbasi_berat_anak' },
    ['narrative', 'anamnesis', 'assessment', 'regimen', 'dose', 'formulary', 'disposition', 'pedagogy', 'dangerous-path', 'mode-release'],
    'Draft menutup mismatch Dimas; dosis berbasis berat badan dan bundel stabilisasi anak wajib diputuskan dokter sebelum aktivasi.',
  ),
  baseRecord(
    clinicReviewId('hipoglikemia_ringan_dewasa'),
    { kind: 'clinic', id: 'hipoglikemia_ringan_dewasa' },
    ['narrative', 'anamnesis', 'diagnosis', 'regimen', 'dose', 'disposition', 'follow-up', 'pedagogy', 'dangerous-path', 'mode-release'],
    'Draft memodelkan pasien sadar yang mampu menelan; batas observasi dan risiko kekambuhan sulfonilurea perlu dikonfirmasi dokter.',
  ),
  baseRecord(
    clinicReviewId('benda_asing_hidung_anak'),
    { kind: 'clinic', id: 'benda_asing_hidung_anak' },
    ['narrative', 'anamnesis', 'assessment', 'regimen', 'disposition', 'pedagogy', 'dangerous-path', 'mode-release'],
    'Draft mengajarkan satu upaya terencana menurut bentuk benda, larangan blind probing, bahaya baterai, dan ambang berhenti/rujuk; perlu review dokter.',
  ),
  baseRecord(
    clinicReviewId('otitis_eksterna_akut_ringan'),
    { kind: 'clinic', id: 'otitis_eksterna_akut_ringan' },
    ['narrative', 'anamnesis', 'diagnosis', 'regimen', 'dose', 'formulary', 'disposition', 'pedagogy', 'dangerous-path', 'mode-release'],
    'Draft membatasi terapi topikal pada membran timpani utuh dan menolak antibiotik sistemik rutin; beda pilihan agen antara PPK lokal, Fornas, dan label pembanding wajib diadjudikasi dokter.',
  ),
  baseRecord(
    clinicReviewId('fraktur_terbuka_tibia_stabil'),
    { kind: 'clinic', id: 'fraktur_terbuka_tibia_stabil' },
    ['narrative', 'anamnesis', 'assessment', 'regimen', 'dose', 'formulary', 'disposition', 'pedagogy', 'dangerous-path', 'mode-release'],
    'Draft mengikat balut steril, bidai, antibiotik parenteral, profilaksis tetanus, dan rujuk; regimen serta realitas stok FKTP perlu adjudikasi dokter.',
  ),
  baseRecord(
    igdReviewId('igd_stemi_anterior_hipoksemik'),
    { kind: 'igd', id: 'igd_stemi_anterior_hipoksemik' },
    ['narrative', 'diagnosis', 'assessment', 'regimen', 'dose', 'disposition', 'pedagogy', 'dangerous-path', 'mode-release'],
    'Draft memakai hipoksemia eksplisit untuk oksigen dan tidak menunda transfer demi troponin; bundel harus disetujui dokter.',
  ),
  baseRecord(
    ukmReviewId('keluarga_gunawan', 'gunawan_k2'),
    { kind: 'ukm', familyId: 'keluarga_gunawan', visitId: 'gunawan_k2' },
    ['narrative', 'ukm-objective', 'follow-up', 'pedagogy', 'dangerous-path', 'mode-release'],
    'Draft UKM menarget pemicu situasional dan relapse prevention, bukan kuliah ulang; koherensi keluarga dan intervensi perlu physician review.',
  ),
]
