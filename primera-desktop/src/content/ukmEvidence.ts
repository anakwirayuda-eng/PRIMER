import type { IndikatorPisPk, KartuIntervensi, SkenarioKunjungan } from './types'

export type TingkatDukunganUkm = 'mekanisme_spesifik' | 'adaptasi_beralasan' | 'konteks_domain'

export interface SumberUkm {
  id: string
  sitasi: string
  labelRingkas: string
  url: string
}

export interface EvidenceIntervensiUkm {
  skenarioId: string
  kartuId: string
  sumber: SumberUkm
  locator: string
  tingkat: Exclude<TingkatDukunganUkm, 'konteks_domain'>
  klaimDidukung: string
  batasan: string
}

const SUMBER = {
  ilp: {
    id: 'kemenkes:kmk-2015-2023-ilp',
    sitasi: 'KMK RI HK.01.07/MENKES/2015/2023, Petunjuk Teknis Integrasi Pelayanan Kesehatan Primer',
    labelRingkas: 'Kemenkes · Juknis ILP 2023',
    url: 'https://kesprimkom.kemkes.go.id/konten/146/176/0/nomor-hk-01-07-menkes-2015-2023',
  },
  hearts: {
    id: 'who:hearts-team-care-2018',
    sitasi: 'WHO HEARTS Technical Package: Team-based Care, 2018',
    labelRingkas: 'WHO · HEARTS Team-based Care',
    url: 'https://www.who.int/publications/i/item/WHO-NMH-NVI-18-4',
  },
  hipertensi: {
    id: 'pnpk:hipertensi-dewasa-303-2026',
    sitasi: 'KMK RI HK.01.07/MENKES/303/2026, PNPK Tata Laksana Hipertensi pada Dewasa',
    labelRingkas: 'Kemenkes · PNPK Hipertensi 2026',
    url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan1780387327_362636.pdf',
  },
  tb: {
    id: 'who:tb-module4-2025',
    sitasi: 'WHO Consolidated Guidelines on Tuberculosis, Module 4: Treatment and Care, 2025',
    labelRingkas: 'WHO · TB Treatment & Care 2025',
    url: 'https://www.who.int/publications/i/item/9789240107243',
  },
  imunisasi: {
    id: 'who:besd-vaccination-2022',
    sitasi: 'WHO Behavioural and Social Drivers of Vaccination: Tools and Practical Guidance, 2022',
    labelRingkas: 'WHO · BeSD Vaccination',
    url: 'https://www.who.int/publications/i/item/9789240049680',
  },
  kb: {
    id: 'who:family-planning-handbook-2022',
    sitasi: 'WHO and Johns Hopkins, Family Planning: A Global Handbook for Providers, 4th ed., 2022',
    labelRingkas: 'WHO · Family Planning Handbook',
    url: 'https://www.who.int/publications/m/item/family-planning--a-global-handbook-for-providers--4th-ed',
  },
  jiwa: {
    id: 'who:mhgap-guideline-2023',
    sitasi: 'WHO mhGAP Guideline for Mental, Neurological and Substance Use Disorders, 3rd ed., 2023',
    labelRingkas: 'WHO · mhGAP 2023',
    url: 'https://www.who.int/publications/i/item/9789240084278',
  },
  maternal: {
    id: 'who:maternal-recommendations-2025',
    sitasi: 'WHO Recommendations on Maternal Health, 2nd ed., 2025',
    labelRingkas: 'WHO · Maternal Health 2025',
    url: 'https://www.who.int/publications/b/59332',
  },
  menyusui: {
    id: 'who:complementary-feeding-2023',
    sitasi: 'WHO Guideline for Complementary Feeding of Infants and Young Children 6-23 Months, 2023',
    labelRingkas: 'WHO · Complementary Feeding',
    url: 'https://www.who.int/publications/i/item/9789240081864',
  },
  sanitasi: {
    id: 'who:sanitation-health-2018',
    sitasi: 'WHO Guidelines on Sanitation and Health, 2018; dibaca bersama Permenkes RI No. 3 Tahun 2026',
    labelRingkas: 'WHO · Sanitation & Health',
    url: 'https://www.who.int/publications/i/item/9789241514705',
  },
  air: {
    id: 'who:drinking-water-quality-2022',
    sitasi: 'WHO Guidelines for Drinking-water Quality, 4th ed. with addenda, 2022; dibaca bersama Permenkes RI No. 3 Tahun 2026',
    labelRingkas: 'WHO · Drinking-water Quality',
    url: 'https://www.who.int/publications/i/item/9789240045064',
  },
  rokok: {
    id: 'who:tobacco-cessation-2024',
    sitasi: 'WHO Clinical Treatment Guideline for Tobacco Cessation in Adults, 2024',
    labelRingkas: 'WHO · Tobacco Cessation 2024',
    url: 'https://www.who.int/publications/b/74755',
  },
  kader: {
    id: 'who:chw-programmes-2018',
    sitasi: 'WHO Guideline on Health Policy and System Support to Optimize Community Health Worker Programmes, 2018',
    labelRingkas: 'WHO · Community Health Workers',
    url: 'https://www.who.int/publications/i/item/9789241550369',
  },
} satisfies Record<string, SumberUkm>

function bukti(
  skenarioId: string,
  kartuId: string,
  sumber: SumberUkm,
  locator: string,
  tingkat: EvidenceIntervensiUkm['tingkat'],
  klaimDidukung: string,
  batasan: string,
): EvidenceIntervensiUkm {
  return { skenarioId, kartuId, sumber, locator, tingkat, klaimDidukung, batasan }
}

/**
 * Registry terminal untuk SATU kartu benar pada setiap skenario UKM aktif.
 * Sumber mendukung mekanisme, bukan menjamin outcome naratif individual.
 */
export const EVIDENCE_INTERVENSI_UKM: readonly EvidenceIntervensiUkm[] = [
  bukti('wulan_k1', 'wk1_i1', SUMBER.hipertensi, 'dukungan kepatuhan, evaluasi tolerabilitas, dan tindak lanjut hipertensi', 'adaptasi_beralasan', 'Keputusan bersama dan tindak lanjut terukur mendukung keberlanjutan terapi.', 'Uji dua minggu dan figur sebaya adalah adaptasi cerita; pemeriksaan ginjal tidak membuktikan keamanan absolut obat.'),
  bukti('wulan_k2', 'wk2_i1', SUMBER.hearts, 'team-based care dan pelayanan berpusat pada pasien di komunitas', 'mekanisme_spesifik', 'Pengingat, dukungan komunitas, dan akses obat terkoordinasi dapat mengurangi hambatan tindak lanjut.', 'Jadwal kendaraan dan layanan Prolanis harus mengikuti kapasitas lokal.'),
  bukti('santoso_k1', 'sk1_i1', SUMBER.tb, 'care and support: person-centred treatment support without coercion', 'mekanisme_spesifik', 'Dukungan TB perlu berpusat pada kebutuhan, penerimaan, preferensi, dan martabat pasien.', 'Pertemuan dengan penyintas dan jalur loket privat adalah adaptasi lokal, bukan kewajiban universal.'),
  bukti('santoso_k2', 'sk2_i1', SUMBER.tb, 'care and support: education, counselling, and treatment-adherence support', 'mekanisme_spesifik', 'PMO terlatih, konseling, dan dukungan yang disesuaikan dapat membantu kepatuhan OAT.', 'Waktu minum dan respons setelah muntah harus mengikuti regimen serta instruksi petugas; jangan mengulang dosis otomatis.'),
  bukti('ketut_k1', 'kk1_i1', SUMBER.imunisasi, 'tailored interventions based on behavioural and social drivers', 'mekanisme_spesifik', 'Intervensi keraguan imunisasi sebaiknya menanggapi penyebab lokal dan memberi dukungan praktis.', 'Cerita ibu sebaya dan pendampingan bidan adalah adaptasi; parasetamol tidak diberikan rutin untuk mencegah demam.'),
  bukti('ketut_k2', 'kk2_i1', SUMBER.imunisasi, 'planning and evaluating tailored interventions to improve uptake', 'adaptasi_beralasan', 'Jadwal yang dipahami keluarga dan teach-back membantu mengubah niat menjadi tindakan.', 'Jadwal kejar imunisasi wajib mengikuti jadwal nasional dan penilaian petugas, bukan warna kalender saja.'),
  bukti('dewi_k1', 'dewi_i_obrolan', SUMBER.kb, 'informed choice, client-centred counselling, and voluntary family planning', 'mekanisme_spesifik', 'Konseling pasangan dapat mendukung pilihan sadar bila otonomi pengguna metode tetap dijaga.', 'Kehadiran pasangan tidak boleh menjadi syarat atau mengambil keputusan dari Bu Dewi.'),
  bukti('dewi_k2', 'dewi_i2_tokoh', SUMBER.kb, 'support for informed, voluntary contraceptive choice', 'adaptasi_beralasan', 'Norma sosial dapat dibahas melalui figur yang dipercaya tanpa mengganti konseling klinis.', 'Tokoh sebaya bukan otoritas klinis; keputusan metode tetap milik pengguna setelah konseling.'),
  bukti('musa_k1', 'musa_i_kotak', SUMBER.hearts, 'team-based care, monitoring systems, and patient-centred implementation', 'adaptasi_beralasan', 'Penyederhanaan rutinitas dan alat bantu yang disesuaikan dapat mendukung kepatuhan.', 'Kotak obat membantu organisasi tetapi tidak menggantikan rekonsiliasi obat atau evaluasi kognitif.'),
  bukti('musa_k2', 'musa_i2_rutinitas', SUMBER.hearts, 'team-based care and systems for monitoring', 'adaptasi_beralasan', 'Pengisian ulang bersama dan instruksi yang mudah dibaca mengurangi kesalahan saat regimen berubah.', 'Setiap perubahan resep tetap harus direkonsiliasi oleh tenaga kesehatan.'),
  bukti('raharjo_k1', 'raharjo_i_arisan', SUMBER.sanitasi, 'enabling safe sanitation through coordinated local programme action', 'adaptasi_beralasan', 'Hambatan sarana membutuhkan dukungan lintas sektor, pembiayaan, dan pengelolaan risiko sanitasi.', 'Arisan, lahan carik, dan tangki komunal memerlukan asesmen teknis serta keputusan desa; tidak otomatis tersedia.'),
  bukti('raharjo_k2', 'raharjo_i2_talangan', SUMBER.sanitasi, 'local sanitation planning and safely managed sanitation systems', 'adaptasi_beralasan', 'Dukungan material dan pengawasan teknis dapat menutup hambatan kesempatan.', 'Dana desa dan subsidi bukan hak otomatis; instalasi wajib memenuhi penilaian sanitarian dan aturan lokal.'),
  bukti('asih_k1', 'ak1_i1', SUMBER.maternal, 'family and community support, timely ANC, and skilled care', 'adaptasi_beralasan', 'Kemitraan yang menghormati kepercayaan lokal dapat mempercepat ANC dan persiapan persalinan aman.', 'Peran dukun, bidan, PONED, dan jalur rujukan mengikuti kebijakan serta kapasitas wilayah.'),
  bukti('asih_k2', 'ak2_i1', SUMBER.maternal, 'danger-sign education and birth/emergency preparedness', 'mekanisme_spesifik', 'Materi visual dan teach-back keluarga mendukung pengenalan tanda bahaya serta pencarian pertolongan.', 'Kartu gambar melengkapi, bukan menggantikan pemeriksaan ANC dan instruksi bidan.'),
  bukti('asih_k3', 'ak3_i1', SUMBER.maternal, 'birth preparedness and complication readiness', 'mekanisme_spesifik', 'Rencana tempat, transportasi, pendamping, biaya, dan tindakan darurat meningkatkan kesiapan keluarga.', 'Ambulans desa dan jalur administrasi JKN harus diverifikasi lokal; Puskesmas Sukamaju tidak diasumsikan PONED.'),
  bukti('slamet_k1', 'slk1_i1', SUMBER.jiwa, 'psychosocial and family interventions for psychosis in non-specialist settings', 'adaptasi_beralasan', 'Pelibatan keluarga, pengurangan stigma, dan pemulihan peran sosial mendukung perawatan berkelanjutan.', 'Perubahan regimen hanya dilakukan dokter setelah evaluasi; peran sosial bukan bukti remisi.'),
  bukti('slamet_k2', 'slk2_i1', SUMBER.jiwa, 'family psychoeducation, relapse prevention, and continuing care', 'mekanisme_spesifik', 'Pengenalan sinyal dini dan rencana respons keluarga membantu deteksi relaps lebih cepat.', 'Rencana rumah tidak menggantikan asesmen risiko, layanan krisis, atau rujukan bila membahayakan.'),
  bukti('yani_k1', 'yk1_i1', SUMBER.menyusui, 'complementary feeding starts at about 6 months; responsive family support', 'mekanisme_spesifik', 'Menunda makanan pendamping sampai usia enam bulan dan memantau pertumbuhan selaras dengan rekomendasi.', 'Grafik pertumbuhan dan kecukupan menyusu harus dinilai utuh; popok basah bukan satu-satunya indikator.'),
  bukti('yani_k2', 'yk2_i1', SUMBER.ilp, 'continuity of maternal-child services through family and community networks', 'adaptasi_beralasan', 'Rencana perah, penyimpanan aman, pengasuh terlatih, dan dukungan tempat kerja menutup hambatan kesempatan.', 'Cara penyimpanan mengikuti panduan nasional dan kondisi suhu nyata; surat Puskesmas tidak menjamin ruang laktasi tersedia.'),
  bukti('prapto_k1', 'prk1_i1', SUMBER.air, 'risk management from source to household and safe storage', 'adaptasi_beralasan', 'Perbaikan sumber air dan pengamanan sementara perlu dirancang sebagai pengelolaan risiko berlapis.', 'Sumur baru memerlukan asesmen kualitas, konstruksi, dan pemantauan; jarak saja tidak membuktikan air aman.'),
  bukti('marni_k1', 'mk1_i1', SUMBER.ilp, 'outreach for missing services and linkage across village-primary care networks', 'adaptasi_beralasan', 'Pendampingan administratif dapat memulihkan akses layanan bagi keluarga yang terputus.', 'Penetapan PBI, dokumen, waktu proses, dan kelayakan diputuskan instansi berwenang; skenario tidak menjanjikan hasil sebelas hari.'),
  bukti('gunawan_k1', 'gk1_i1', SUMBER.rokok, 'behavioural support and follow-up for adult tobacco cessation', 'adaptasi_beralasan', 'Konseling perilaku, dukungan berulang, dan rencana pemicu membantu upaya berhenti merokok.', 'Pengurangan adalah jembatan menuju berhenti, bukan tujuan akhir; kopi tidak menggantikan manajemen kelelahan berkendara.'),
  bukti('gunawan_k2', 'gk2_i1', SUMBER.rokok, 'behavioural and digital support as part of a cessation plan', 'mekanisme_spesifik', 'Stimulus control, latihan respons, dukungan keluarga, dan konseling adalah komponen perilaku yang relevan.', 'Rencana harus memasukkan keselamatan berkendara dan target berhenti yang disepakati, bukan sekadar memindah lokasi merokok.'),
  bukti('lastri_k1', 'lk1_i1', SUMBER.kader, 'community health workers integrated into primary-care teams with training and support', 'adaptasi_beralasan', 'Dukungan kader dan tetangga dapat membantu rutinitas bila peran, pelatihan, serta supervisinya jelas.', 'Kotak obat dan pengingat tidak menggantikan asesmen kognitif, rekonsiliasi obat, atau perlindungan privasi.'),
  bukti('bagyo_k1', 'bk1_i1', SUMBER.sanitasi, 'community engagement and sustained use of safely managed sanitation', 'adaptasi_beralasan', 'Norma kelompok dan perubahan lingkungan sosial dapat mendukung penggunaan jamban yang konsisten.', 'Deklarasi sosial tidak cukup tanpa jamban yang aman, aksesibel, dan terpelihara.'),
  bukti('endah_k1', 'ek1_i1', SUMBER.maternal, 'birth preparedness, family engagement, and timely use of skilled care', 'adaptasi_beralasan', 'Pelibatan keluarga dalam ANC dapat menyelaraskan nilai budaya dengan rencana persalinan aman.', 'Keputusan tempat persalinan mengikuti risiko klinis dan jejaring aktual; USG tidak diasumsikan tersedia di Puskesmas Sukamaju.'),
  bukti('karsa_k1', 'kk1_i1', SUMBER.kb, 'voluntary informed choice and couple communication in family planning', 'mekanisme_spesifik', 'Bahasa jarak kelahiran dan konseling pasangan dapat mendukung keputusan sukarela serta terinformasi.', 'Persetujuan suami bukan syarat layanan; anemia ditangani sebagai kebutuhan klinis terpisah dari keputusan KB.'),
] as const

const EVIDENCE_BY_KEY = new Map(
  EVIDENCE_INTERVENSI_UKM.map((item) => [`${item.skenarioId}:${item.kartuId}`, item] as const),
)

export function evidenceIntervensiUkm(
  skenario: Pick<SkenarioKunjungan, 'id'>,
  kartu: Pick<KartuIntervensi, 'id'>,
): EvidenceIntervensiUkm | undefined {
  return EVIDENCE_BY_KEY.get(`${skenario.id}:${kartu.id}`)
}

export function kartuIntervensiBenar(
  skenario: Pick<SkenarioKunjungan, 'hambatanSebenarnya'>,
  kartu: Pick<KartuIntervensi, 'cocokUntuk'>,
): boolean {
  return kartu.cocokUntuk.includes(skenario.hambatanSebenarnya)
}

export function ringkasanTargetUkm(target: readonly IndikatorPisPk[]): string {
  return target.join(', ')
}
