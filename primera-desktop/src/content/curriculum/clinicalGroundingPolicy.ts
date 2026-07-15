export type ClinicalGroundingSourceRole =
  | 'national_clinical_floor'
  | 'current_ebm'
  | 'formulary_access'
  | 'terminology_identity'
  | 'facility_record'
  | 'local_operational_truth'
  | 'historical_context'

export type GracefulDegradationLevel =
  | 'verified_available'
  | 'variable_or_unverified'
  | 'unavailable_or_outside_scope'

export interface ClinicalGroundingSourceRule {
  id: string
  role: ClinicalGroundingSourceRole
  authority: string
  officialUrl?: string
  useFor: string[]
  notProofOf: string[]
}

export interface GracefulDegradationRule {
  level: GracefulDegradationLevel
  authoringRule: string
  scoringRule: string
}

export interface ClinicalGroundingPolicy {
  schemaVersion: 1
  id: string
  effectiveDate: string
  approvedBy: {
    reviewer: string
    credentials: string
    approvedAt: string
  }
  nationalFloor: string
  ebmSupersessionRequirements: string[]
  sourceRules: ClinicalGroundingSourceRule[]
  gracefulDegradation: GracefulDegradationRule[]
  safetyInvariants: string[]
}

/**
 * Kebijakan authoring klinis universal. Ini bukan entitas runtime ketujuh dan
 * tidak mengubah PACK; setiap review materi baru wajib mengikat versinya.
 */
export const CLINICAL_GROUNDING_POLICY: ClinicalGroundingPolicy = {
  schemaVersion: 1,
  id: 'clinical-grounding-floor-graceful-degradation-v1',
  effectiveDate: '2026-07-15',
  approvedBy: {
    reviewer: 'dr. Anak Agung Bagus Wirayuda',
    credentials: 'Dokter dan penanggung jawab klinis PRIMERA',
    approvedAt: '2026-07-15',
  },
  nationalFloor:
    'PPK FKTP, PNPK, dan aturan/instruksi Kemenkes aktif yang paling baru dan sesuai populasi adalah ambang bawah wajib, bukan plafon pengetahuan.',
  ebmSupersessionRequirements: [
    'Sumber EBM lebih baru atau lebih kuat relevan terhadap populasi, setting, dan outcome kasus.',
    'Baseline Kemenkes dan sumber EBM pembanding sama-sama dicantumkan pada EvidenceBinding.',
    'Perbedaan, alasan memilih rekomendasi, dan dampaknya terhadap FKTP ditulis eksplisit.',
    'Konflik material tentang keselamatan, dosis, atau disposisi mendapat adjudikasi dokter sebelum aktivasi.',
    'Implementasi diuji terhadap formularium, kapabilitas fasilitas, stok lokal, SDM, bahan habis pakai, dan jejaring rujukan.',
  ],
  sourceRules: [
    {
      id: 'kemenkes-clinical-floor',
      role: 'national_clinical_floor',
      authority: 'PPK FKTP, PNPK, dan aturan/instruksi Kemenkes aktif terbaru sesuai topik dan populasi',
      useFor: ['ambang bawah klinis Indonesia', 'scope FKTP', 'regimen dan disposisi yang dinyatakan sumber'],
      notProofOf: ['stok lokal saat ini', 'alat berfungsi', 'SDM atau jejaring siap'],
    },
    {
      id: 'current-best-ebm',
      role: 'current_ebm',
      authority: 'Guideline primer resmi atau sintesis EBM mutakhir yang sesuai populasi dan setting',
      useFor: ['pembaruan diagnosis', 'pembaruan regimen', 'pembaruan keselamatan dan outcome'],
      notProofOf: ['ketersediaan di FKTP Indonesia', 'kewenangan lokal tanpa adaptasi'],
    },
    {
      id: 'fornas-active',
      role: 'formulary_access',
      authority: 'Formularium Nasional aktif, saat ini KMK HK.01.07/MENKES/1199/2025',
      officialUrl:
        'https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/',
      useFor: [
        'status formularium JKN',
        'obat esensial nasional yang terintegrasi dalam Fornas',
        'restriksi sediaan',
        'level fasilitas yang tercantum',
      ],
      notProofOf: ['stok Puskesmas tertentu', 'dosis klinis', 'indikasi di luar restriksi'],
    },
    {
      id: 'satusehat-kfa',
      role: 'terminology_identity',
      authority: 'Kamus Farmasi dan Alat Kesehatan SATUSEHAT',
      officialUrl:
        'https://satusehat.kemkes.go.id/platform/docs/id/master-data/kfa/rest-api-kfa/apis/api-kfa-v2/',
      useFor: ['kode dan identitas produk', 'nomenklatur obat/alkes', 'metadata produk dan LKPP bila tersedia'],
      notProofOf: ['stok Puskesmas tertentu', 'produk siap pakai', 'indikasi atau dosis klinis'],
    },
    {
      id: 'kemenkes-aspak',
      role: 'facility_record',
      authority: 'Aplikasi Sarana, Prasarana, dan Alat Kesehatan Kementerian Kesehatan',
      officialUrl: 'https://aspak.kemkes.go.id/aplikasi/infoboard',
      useFor: ['rekaman sarana/prasarana/alkes per fasilitas', 'pemetaan kapabilitas yang perlu diverifikasi'],
      notProofOf: ['ketersediaan real-time', 'alat berfungsi', 'bahan habis pakai tersedia', 'SDM kompeten sedang tersedia'],
    },
    {
      id: 'local-operational-verification',
      role: 'local_operational_truth',
      authority: 'Verifikasi fasilitas dan jejaring yang berlaku untuk skenario/kohort',
      useFor: ['stok dan kedaluwarsa', 'fungsi alat dan bahan habis pakai', 'kompetensi SDM', 'transport dan tujuan rujukan'],
      notProofOf: ['kebenaran klinis universal', 'alasan menurunkan standar secara diam-diam'],
    },
    {
      id: 'doen-2021-historical',
      role: 'historical_context',
      authority: 'DOEN 2021 (KMK HK.01.07/MENKES/6477/2021), dicabut oleh KMK HK.01.07/MENKES/2197/2023; fungsi obat esensial kemudian terintegrasi ke Fornas',
      officialUrl: 'https://farmalkes.kemkes.go.id/unduh/kepmenkes-6477-2021/',
      useFor: ['konteks historis esensialitas obat'],
      notProofOf: ['formularium aktif', 'stok saat ini', 'dosis klinis', 'kewajiban penyediaan saat ini'],
    },
  ],
  gracefulDegradation: [
    {
      level: 'verified_available',
      authoringRule:
        'Ajarkan dan nilai rekomendasi terbaik yang dapat dilakukan setelah obat, alat, bahan, SDM, dan jejaring diverifikasi tersedia.',
      scoringRule: 'Langkah yang tersedia, aman, dan esensial boleh menjadi kewajiban skor.',
    },
    {
      level: 'variable_or_unverified',
      authoringRule:
        'Tampilkan standar terbaik dan jalur aman yang eksplisit: verifikasi cepat, gunakan alternatif yang didukung sumber/SOP, atau stabilisasi sambil koordinasi rujukan; jangan mengarang substitusi.',
      scoringRule:
        'Jangan menghukum pemain karena resource yang vignette tidak nyatakan tersedia; nilai pengenalan keterbatasan dan pilihan jalur aman.',
    },
    {
      level: 'unavailable_or_outside_scope',
      authoringRule:
        'Pertahankan kebenaran diagnosis dan tujuan terapi, lakukan stabilisasi yang feasible, koordinasikan/rujuk tanpa menunda tindakan time-critical, dan jelaskan terapi ideal sebagai feedback.',
      scoringRule:
        'Nilai stabilisasi, komunikasi, dan disposisi; jangan memberi kredit pada improvisasi yang tidak didukung sumber.',
    },
  ],
  safetyInvariants: [
    'Keterbatasan resource tidak mengubah diagnosis atau standar klinis yang benar.',
    'Fornas, KFA, ASPAK, atau DOEN tidak boleh dipakai sendirian sebagai bukti stok lokal siap pakai.',
    'Alternatif obat, alat, atau prosedur wajib bersumber atau berasal dari SOP/jejaring yang terverifikasi; substitusi improvisasi dilarang.',
    'Keterbatasan fasilitas tidak boleh menunda stabilisasi feasible atau rujukan time-critical.',
    'Konflik material tetap memblokir aktivasi sampai physician adjudication atau waiver tertulis.',
  ],
}

export function validasiClinicalGroundingPolicy(
  policy: ClinicalGroundingPolicy = CLINICAL_GROUNDING_POLICY,
): string[] {
  const issues: string[] = []
  const expectedSourceIds = [
    'kemenkes-clinical-floor',
    'current-best-ebm',
    'fornas-active',
    'satusehat-kfa',
    'kemenkes-aspak',
    'local-operational-verification',
    'doen-2021-historical',
  ]
  const expectedLevels: GracefulDegradationLevel[] = [
    'verified_available',
    'variable_or_unverified',
    'unavailable_or_outside_scope',
  ]
  const sourceIds = policy.sourceRules.map((source) => source.id)

  if (policy.schemaVersion !== 1) issues.push('schemaVersion kebijakan tidak didukung')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(policy.effectiveDate)) issues.push('effectiveDate kebijakan bukan ISO date')
  if (!policy.approvedBy.reviewer || !policy.approvedBy.credentials) issues.push('pengesahan klinis kebijakan tidak lengkap')
  if (new Set(sourceIds).size !== sourceIds.length) issues.push('source rule kebijakan duplikat')
  if (JSON.stringify(sourceIds) !== JSON.stringify(expectedSourceIds)) issues.push('source rule kebijakan tidak lengkap atau urutannya drift')
  if (policy.ebmSupersessionRequirements.length < 5) issues.push('syarat supersesi EBM tidak lengkap')
  if (
    JSON.stringify(policy.gracefulDegradation.map((rule) => rule.level)) !==
    JSON.stringify(expectedLevels)
  ) {
    issues.push('tiga tingkat graceful degradation tidak lengkap atau urutannya drift')
  }
  for (const source of policy.sourceRules) {
    if (source.useFor.length === 0) issues.push(`${source.id}: useFor kosong`)
    if (source.notProofOf.length === 0) issues.push(`${source.id}: batas bukti kosong`)
  }
  if (policy.safetyInvariants.length < 5) issues.push('safety invariant kebijakan tidak lengkap')
  return issues
}
