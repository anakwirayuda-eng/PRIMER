import type { PhysicianSignoff } from '../types'

export const M13_1A_PHYSICIAN_REVIEWER = 'dr. Anak Agung Bagus Wirayuda'
export const M13_1A_PHYSICIAN_CREDENTIALS = 'Dokter; penanggung jawab klinis PRIMERA'
export const M13_1A_PHYSICIAN_SIGNED_AT = '2026-07-15'

function approved(note: string): PhysicianSignoff {
  return {
    reviewer: M13_1A_PHYSICIAN_REVIEWER,
    credentials: M13_1A_PHYSICIAN_CREDENTIALS,
    signedAt: M13_1A_PHYSICIAN_SIGNED_AT,
    decision: 'approved',
    note,
  }
}

/**
 * Keputusan eksplisit dr. Wirayuda atas delapan review envelope M13-1a.
 * Persetujuan konten ini tidak menghapus activationBlockers pada manifest.
 */
export const M13_1A_PHYSICIAN_SIGNOFF_BY_REVIEW_ID: Record<string, PhysicianSignoff> = {
  'm13-1a-review-clinic-diare_akut_bayi_dehidrasi_berat': approved(
    'N1 disetujui: Plan C bayi kurang dari 12 bulan dinilai sebagai tindakan komposit, dimulai segera sambil menyiapkan rujukan. Bila akses IV tidak segera berhasil, ikuti cabang WHO menurut akses terapi IV terdekat, kemampuan minum, dan kompetensi NGT; jangan menetapkan batas upaya IV arbitrer atau memaksa oralit pada bayi letargis.',
  ),
  'm13-1a-review-clinic-asma_eksaserbasi_berat_anak': approved(
    'D1 disetujui: target SpO2 92-95%, ipratropium 0,5 mg tiap 20 menit sampai tiga dosis, dan total salbutamol nebulisasi 5 mg per dosis untuk usia 7 tahun. Unit-dose Fornas 0,5 mg/2,5 mg adalah kandidat produk, bukan bukti bahwa total SABA sudah terpenuhi atau stok siap. Steroid dini, terapi sambil rujuk, status 3B, dan tanpa kredit asma stabil 4A dipertahankan.',
  ),
  'm13-1a-review-clinic-hipoglikemia_ringan_dewasa': approved(
    'H1 direkonsiliasi pasca-affirmation atas arahan reviewer: koreksi glukosa oral dan pemeriksaan ulang 15 menit wajib dilakukan sebelum rujuk. Karena glimepirid dapat menimbulkan kekambuhan berkepanjangan dan Sukamaju tidak memiliki observasi 24 jam, pasien dirujuk pada hari yang sama untuk pemantauan 24-72 jam sesuai risiko; satu GDS normal tidak cukup untuk memulangkan.',
  ),
  'm13-1a-review-clinic-benda_asing_hidung_anak': approved(
    'B1 disetujui: satu upaya ekstraksi yang terencana pada benda anterior non-baterai/non-magnet dengan teknik sesuai bentuk dan alat yang tersedia. Blind probing, menjepit benda bulat dari depan, serta percobaan berulang dilarang; kegagalan upaya pertama atau kondisi tidak aman menjadi ambang berhenti dan rujuk.',
  ),
  'm13-1a-review-clinic-otitis_eksterna_akut_ringan': approved(
    'O1 disetujui: asam asetat otik 2% menjadi opsi primer pada otitis eksterna ringan dengan membran timpani utuh, sebanyak 5 tetes 3-4 kali sehari. Nilai ulang 48-72 jam dan lanjutkan hanya selama masih terindikasi menurut respons/protokol lokal, tanpa durasi kaku arbitrer. Agen PPK tetap alternatif kontekstual; antibiotik sistemik tidak rutin dan pembersihan liang telinga tetap kondisional.',
  ),
  'm13-1a-review-clinic-fraktur_terbuka_tibia_stabil': approved(
    'F1 disetujui: gunakan pendekatan no-mini-washout; hanya singkirkan kontaminan kasar yang lepas tanpa probing atau irigasi, lalu balut lembap-oklusif, dokumentasikan neurovaskular, bidai, beri analgesia, antibiotik parenteral dini, dan profilaksis tetanus sesuai riwayat sebelum rujuk segera. Resource harus dinyatakan atau diverifikasi dan tidak boleh diganti dengan substitusi improvisasi.',
  ),
  'm13-1a-review-igd-igd_stemi_anterior_hipoksemik': approved(
    'I1 disetujui: EKG dalam 10 menit, aspirin kunyah 160-320 mg setelah skrining kontraindikasi, oksigen karena SpO2 88%, monitoring, komunikasi, dan transfer terpantau ke jejaring reperfusi. P2Y12, antikoagulan, nitrat, serta pemilihan PCI/fibrinolisis sengaja berada di luar komponen skor slice ini dan tetap mengikuti protokol jejaring serta kontraindikasi; blocker kapabilitas tujuan rujukan tidak dihapus.',
  ),
  'm13-1a-review-ukm-keluarga_gunawan-gunawan_k2': approved(
    'U1 disetujui: kunjungan K2 berfokus pada opportunity, functional analysis, stimulus control, latihan menolak, keselamatan berkendara, dukungan keluarga, dan relapse prevention. Penilaian ketergantungan, withdrawal, serta kelayakan farmakoterapi tetap ditautkan ke UBM tetapi tidak wajib dimainkan atau diberi skor pada kunjungan ini; kantuk berat ditangani dengan menepi dan beristirahat.',
  ),
}

export const M13_1A_REVIEW_ID_BY_AUDITED_EVIDENCE_ID: Record<string, string> = {
  'm13-1a:dimas-oxygen-target': 'm13-1a-review-clinic-asma_eksaserbasi_berat_anak',
  'm13-1a:dimas-ipratropium-dose-age': 'm13-1a-review-clinic-asma_eksaserbasi_berat_anak',
  'm13-1a:fracture-no-mini-washout': 'm13-1a-review-clinic-fraktur_terbuka_tibia_stabil',
}
