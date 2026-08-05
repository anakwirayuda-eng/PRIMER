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
import { M13_1A_PHYSICIAN_SIGNOFF_BY_REVIEW_ID } from './physicianSignoffs'

const TECHNICAL_REVIEWER = 'Codex (technical authoring audit)'
const TECHNICAL_CREDENTIALS = 'AI coding agent; bukan physician reviewer'

/** SHA-256 JSON.stringify(review envelope kanonik), dihitung setelah technical review. */
export const M13_1A_REVIEW_HASHES: Record<string, string> = {
  'm13-1a-review-clinic-diare_akut_bayi_dehidrasi_berat': '0348ca09a7ab95c381af9b21d6321e30c19da9b35dc2fa788d26d8f711b7ddd0',
  // Hash Nayla, asma, dan fraktur di-refresh 2026-07-15 (post-signoff): clue
  // Nayla, catatanRealita Dimas, dan panduanResmi fraktur direkonsiliasi thd physicianSignoff yang
  // sudah ada (bukan keputusan klinis baru — lihat physicianSignoffs.ts) —
  // envelope berubah krn kontennya berubah, sesuai aturan hash-di-bagian-6.
  'm13-1a-review-clinic-asma_eksaserbasi_berat_anak': '5c81d35ff3bfca14d41f934b624a96d912a5c3038a68ee3c6ccc3ced73f9b762',
  // Refresh 2026-07-28: pemeriksaan ulang 15 menit yang sudah diwajibkan
  // physicianSignoff H1 kini direpresentasikan sebagai observasi terstruktur.
  'm13-1a-review-clinic-hipoglikemia_ringan_dewasa': '7c7ad727638d083253bfd7b0cefc3412a15a9d2c85e92e8ae3a20d88f706edd0',
  'm13-1a-review-clinic-benda_asing_hidung_anak': '3d684ef2da6606685568b3a051f251915a6990bfc10b31f584b64ecb6a3d497f',
  'm13-1a-review-clinic-otitis_eksterna_akut_ringan': 'de4c265f093d6d303be9aac966e6fdf88f066f560b7ea660ae2b230130da2411',
  // Refresh 2026-07-28: provenance player-facing berpindah dari domain NICE
  // yang memberi 403 ke ACS/BOAST; keputusan klinis F1 tidak berubah.
  'm13-1a-review-clinic-fraktur_terbuka_tibia_stabil': 'f5faf0d79418ea53d029f08e742d2e2f94f6720a27fc7facfe8c63f54e4f1550',
  // Refresh 2026-08-06 atas instruksi langsung dr. Wirayuda ("tanda tangan
  // ulang slice m13-1a"). Yang berubah HANYA penambahan lapisan `debrief`
  // (poin kunci, realita FKTP, sumber daya, kontinuitas, jembatan UKM) yang
  // sebelumnya kosong pada kasus ini. Mengikuti aturan hash-di-bagian-6 dan
  // preseden dua refresh pasca-sign-off di atas: envelope berubah karena
  // kontennya berubah, sedangkan KEPUTUSAN KLINISNYA tidak — tiap kalimat
  // debrief ditelusuri ke isi kasus yang sudah ditandatangani (clue,
  // panduanResmi, label & respons tiap langkah, disposisi), bukan diagnosis,
  // obat, dosis, atau disposisi baru. Gerbang fail-closed sempat menolak
  // penambahan ini pada beta.17 dan itu memang benar; penyegelan ulang
  // menunggu dokter, dan dokter sudah memerintahkannya.
  'm13-1a-review-igd-igd_stemi_anterior_hipoksemik': '1533f69101d359376c52568fd35542814db25ca82057ec7e37a02fab8d04a884',
  'm13-1a-review-ukm-keluarga_gunawan-gunawan_k2': '4a36c4ff0a0ef1296fc6e2609948228381bfd0c30c8e794f4030d4c87249e922',
}

function technicalReview(facets: ContentReviewFacet[], note: string) {
  // Snapshot ini sengaja merekam checkpoint teknis pra-sign-off. Karena itu
  // note historisnya dapat menyebut kebutuhan review meski record induk kini
  // sudah approved dan membawa physicianSignoff terminal.
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
  const physicianSignoff = M13_1A_PHYSICIAN_SIGNOFF_BY_REVIEW_ID[id]
  if (!physicianSignoff) throw new Error(`M13-1a: physician sign-off '${id}' tidak ada`)
  return {
    id,
    contentRef,
    author: 'Codex (AI-assisted draft; physician approval required)',
    authoredAt: M13_1A_AUTHORED_AT,
    basedOnContentRelease: M13_1A_BASE_CONTENT_RELEASE,
    proposedContentRelease: M13_1A_PROPOSED_CONTENT_RELEASE,
    contentHash: M13_1A_REVIEW_HASHES[id] ?? '',
    sourceIds: M13_1A_REVIEW_SOURCE_IDS[id] ?? [],
    status: 'approved',
    technicalReview: technicalReview(facets, note),
    physicianSignoff,
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
    'Draft menutup mismatch Dimas; target GINA 2026, dosis ipratropium berbasis usia, konflik total salbutamol unit-dose, dan bundel stabilisasi anak wajib diputuskan dokter sebelum aktivasi.',
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
    'Draft memakai no-mini-washout tetapi mempertahankan konflik PNPK versus ACS/BOAST; antibiotik, tetanus, dan realitas resource FKTP perlu adjudikasi dokter.',
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
