import type { KasusIgd, SumberKlinis } from './types'

export type KasusIgdTanpaGrounding = Omit<KasusIgd, 'panduanResmi' | 'sumber'>

/**
 * Registry runtime untuk provenance debrief IGD. Satu id selalu menunjuk satu
 * dokumen yang sama; case hanya menyimpan salinan immutable dari entri ini.
 * PPK 1186/2022 memakai indeks publik karena berkas asli tidak punya URL JDIH
 * stabil yang dapat dibuka dari aplikasi. Label sengaja menjelaskan hal itu.
 */
export const SUMBER_IGD = {
  ppk_fktp_2022: {
    id: 'ppk_fktp_2022',
    label: 'KMK 1186/2022 - PPK Dokter di FKTP (indeks publik)',
    url: 'https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/',
    tahun: 2022,
    jenis: 'pedoman_indonesia',
  },
  pnpk_epilepsi_2026: {
    id: 'pnpk_epilepsi_2026',
    label: 'PNPK Tata Laksana Epilepsi Dewasa 2026',
    url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan1776933600_244772.pdf',
    tahun: 2026,
    jenis: 'pedoman_indonesia',
  },
  pnpk_stroke_2026: {
    id: 'pnpk_stroke_2026',
    label: 'KMK 304/2026 - PNPK Tata Laksana Stroke',
    url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan1780387545_996111.pdf',
    tahun: 2026,
    jenis: 'pedoman_indonesia',
  },
  pnpk_sepsis_2017: {
    id: 'pnpk_sepsis_2017',
    label: 'KMK 342/2017 - PNPK Tata Laksana Sepsis',
    url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan_1610419769_850165.pdf',
    tahun: 2017,
    jenis: 'pedoman_indonesia',
  },
  pnpk_ska_2019: {
    id: 'pnpk_ska_2019',
    label: 'PNPK Tata Laksana Sindroma Koroner Akut 2019',
    url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan_1610419977_266892.pdf',
    tahun: 2019,
    jenis: 'pedoman_indonesia',
  },
  idai_kejang_demam: {
    id: 'idai_kejang_demam',
    label: 'IDAI - Rekomendasi Penatalaksanaan Kejang Demam',
    url: 'https://bpdev.idai.or.id/buku/rekomendasi-penatalaksanaan-kejang-demam',
    tahun: 2016,
    jenis: 'pedoman_indonesia',
  },
  who_bec: {
    id: 'who_bec',
    label: 'WHO/ICRC Basic Emergency Care',
    url: 'https://www.who.int/teams/integrated-health-services/clinical-services-and-systems/emergency-and-critical-care/bec',
    tahun: 2018,
    jenis: 'evidence_internasional',
  },
  wao_anaphylaxis_2020: {
    id: 'wao_anaphylaxis_2020',
    label: 'World Allergy Organization Anaphylaxis Guidance 2020',
    url: 'https://www.worldallergyorganizationjournal.org/article/S1939-4551%2820%2930375-6/fulltext',
    tahun: 2020,
    jenis: 'evidence_internasional',
  },
  gina_2026: {
    id: 'gina_2026',
    label: 'GINA Global Strategy for Asthma 2026',
    url: 'https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf',
    tahun: 2026,
    jenis: 'evidence_internasional',
  },
  ada_hypoglycemia_2026: {
    id: 'ada_hypoglycemia_2026',
    label: 'ADA Standards of Care - Glycemic Goals and Hypoglycemia 2026',
    url: 'https://diabetesjournals.org/care/article/49/Supplement_1/S132/163927/6-Glycemic-Goals-Hypoglycemia-and-Hyperglycemic',
    tahun: 2026,
    jenis: 'evidence_internasional',
  },
  who_arboviral_2025: {
    id: 'who_arboviral_2025',
    label: 'WHO Guidelines for Clinical Management of Arboviral Diseases 2025',
    url: 'https://www.who.int/publications/i/item/9789240111110',
    tahun: 2025,
    jenis: 'evidence_internasional',
  },
  ilae_status_2015: {
    id: 'ilae_status_2015',
    label: 'ILAE Definition and Classification of Status Epilepticus',
    url: 'https://www.ilae.org/guidelines/definition-and-classification/status-epilepticus-2015',
    tahun: 2015,
    jenis: 'evidence_internasional',
  },
  nice_head_injury_2023: {
    id: 'nice_head_injury_2023',
    label: 'NICE NG232 - Head Injury: Assessment and Early Management',
    url: 'https://www.nice.org.uk/guidance/NG232/chapter/recommendations',
    tahun: 2023,
    jenis: 'evidence_internasional',
  },
  hyperglycemic_crises_2024: {
    id: 'hyperglycemic_crises_2024',
    label: 'Hyperglycemic Crises in Adults - International Consensus Report 2024',
    url: 'https://diabetesjournals.org/care/article-pdf/47/8/1257/780938/dci240032.pdf',
    tahun: 2024,
    jenis: 'evidence_internasional',
  },
  aha_asa_stroke_2026: {
    id: 'aha_asa_stroke_2026',
    label: 'AHA/ASA Guideline for Acute Ischemic Stroke 2026',
    url: 'https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke',
    tahun: 2026,
    jenis: 'evidence_internasional',
  },
  who_pph_2025: {
    id: 'who_pph_2025',
    label: 'WHO/FIGO/ICM Postpartum Haemorrhage Guideline 2025',
    url: 'https://www.who.int/publications/i/item/9789240115637',
    tahun: 2025,
    jenis: 'evidence_internasional',
  },
  aha_neonatal_2025: {
    id: 'aha_neonatal_2025',
    label: 'AHA/AAP Neonatal Resuscitation Guidelines 2025',
    url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation',
    tahun: 2025,
    jenis: 'evidence_internasional',
  },
  aha_drowning_2024: {
    id: 'aha_drowning_2024',
    label: 'AHA/AAP Focused Update on Drowning 2024',
    url: 'https://professional.heart.org/en/science-news/2024-aha-and-aap-focused-update-on-special-circumstances-resuscitation-following-drowning',
    tahun: 2024,
    jenis: 'evidence_internasional',
  },
  who_pesticide_2008: {
    id: 'who_pesticide_2008',
    label: 'WHO Clinical Management of Acute Pesticide Intoxication',
    url: 'https://www.who.int/publications/i/item/9789241597456',
    tahun: 2008,
    jenis: 'evidence_internasional',
  },
  who_snakebite_2016: {
    id: 'who_snakebite_2016',
    label: 'WHO SEARO Guidelines for Management of Snakebites',
    url: 'https://www.who.int/southeastasia/publications/i/item/9789290225300',
    tahun: 2016,
    jenis: 'evidence_internasional',
  },
  ssc_sepsis_2026: {
    id: 'ssc_sepsis_2026',
    label: 'Surviving Sepsis Campaign Adult Guidelines 2026',
    url: 'https://sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines',
    tahun: 2026,
    jenis: 'evidence_internasional',
  },
  who_preeclampsia_2025: {
    id: 'who_preeclampsia_2025',
    label: 'WHO Pre-eclampsia Fact Sheet and Recommendations 2025',
    url: 'https://www.who.int/news-room/fact-sheets/detail/pre-eclampsia',
    tahun: 2025,
    jenis: 'evidence_internasional',
  },
  aha_pediatric_bls_2025: {
    id: 'aha_pediatric_bls_2025',
    label: 'AHA/AAP Pediatric Basic Life Support 2025',
    url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-basic-life-support',
    tahun: 2025,
    jenis: 'evidence_internasional',
  },
  nice_major_trauma: {
    id: 'nice_major_trauma',
    label: 'NICE NG39 - Major Trauma: Assessment and Initial Management',
    url: 'https://www.nice.org.uk/guidance/ng39/chapter/Recommendations',
    tahun: 2016,
    jenis: 'evidence_internasional',
  },
  acc_aha_acs_2025: {
    id: 'acc_aha_acs_2025',
    label: 'ACC/AHA Guideline for Acute Coronary Syndromes 2025',
    url: 'https://professional.heart.org/en/science-news/2025-guideline-for-the-management-of-patients-with-acute-coronary-syndromes',
    tahun: 2025,
    jenis: 'evidence_internasional',
  },
} as const satisfies Record<string, SumberKlinis>

type SumberIgdId = keyof typeof SUMBER_IGD

interface GroundingIgd {
  panduanResmi: string
  sumberIds: readonly SumberIgdId[]
}

const GROUNDING_IGD: Record<string, GroundingIgd> = {
  igd_syok_anafilaksis: {
    panduanResmi: 'Di FKTP, utamakan ABC dan adrenalin IM paha anterolateral segera; antihistamin dan steroid tidak boleh menunda terapi penyelamat nyawa. Observasi ketat dan rujuk setelah stabil.',
    sumberIds: ['ppk_fktp_2022', 'wao_anaphylaxis_2020'],
  },
  igd_kejang_demam: {
    panduanResmi: 'Kejang aktif lebih dari 5 menit ditangani sebagai kegawatan: amankan ABC, cek glukosa, berikan benzodiazepin sesuai rute yang tersedia, lalu rujuk bila kompleks, berulang, fokal, atau pemulihan tidak wajar.',
    sumberIds: ['idai_kejang_demam', 'who_bec'],
  },
  igd_asma_berat: {
    panduanResmi: 'Serangan berat memerlukan oksigen terkontrol, SABA berulang, kortikosteroid sistemik dini, penilaian ulang, dan rujukan tanpa menunggu gagal napas. Ipratropium adalah tambahan bila tersedia, bukan alasan menunda tata laksana dasar FKTP.',
    sumberIds: ['ppk_fktp_2022', 'gina_2026'],
  },
  igd_hipoglikemia: {
    panduanResmi: 'Gangguan kesadaran akibat hipoglikemia memerlukan glukosa parenteral, pemeriksaan ulang, karbohidrat lanjutan saat aman menelan, dan pencarian penyebab. Paparan sulfonilurea kerja panjang memerlukan observasi ketat atau rujukan karena risiko berulang.',
    sumberIds: ['ppk_fktp_2022', 'ada_hypoglycemia_2026'],
  },
  igd_dengue_syok: {
    panduanResmi: 'DSS terkompensasi ditangani dengan kristaloid terukur dan penilaian ulang perfusi yang sering. Turunkan laju cairan saat kondisi membaik; jangan meneruskannya tanpa evaluasi. Hindari NSAID dan rujuk dengan cairan terpantau.',
    sumberIds: ['ppk_fktp_2022', 'who_arboviral_2025'],
  },
  igd_status_epileptikus: {
    panduanResmi: 'Kejang konvulsif 5 menit atau lebih membutuhkan ABC, glukosa, benzodiazepin lini pertama, satu pengulangan terukur bila perlu, dan eskalasi cepat. Setelah terminasi kejang, cari pencetus dan rujuk untuk terapi lini lanjut serta pemantauan.',
    sumberIds: ['pnpk_epilepsi_2026', 'ilae_status_2015'],
  },
  igd_cedera_kepala_sedang: {
    panduanResmi: 'Prioritas FKTP adalah ABC dengan proteksi servikal, pemeriksaan GCS dan pupil berkala, serta pencegahan hipoksia dan hipotensi. Setelah stabilisasi awal, rujuk ke fasilitas dengan CT dan layanan bedah. Jangan menunda rujukan untuk observasi panjang di fasilitas tanpa pencitraan.',
    sumberIds: ['ppk_fktp_2022', 'nice_head_injury_2023'],
  },
  igd_luka_bakar_luas: {
    panduanResmi: 'Hentikan proses terbakar, dinginkan dengan air mengalir sejuk selama 20 menit bila masih dalam jendela waktu, hindari es dan bahan oles, tutup bersih, nilai jalan napas, mulai resusitasi yang sesuai, dan rujuk luka bakar luas.',
    sumberIds: ['ppk_fktp_2022', 'who_bec'],
  },
  igd_ketoasidosis_diabetik: {
    panduanResmi: 'DKA memerlukan kristaloid isotonic awal, penilaian kalium sebelum insulin, pemantauan glukosa-elektrolit-keton, dan rujukan. Di FKTP tanpa pemantauan kalium memadai, jangan memulai insulin lalu mengirim pasien tanpa kendali.',
    sumberIds: ['ppk_fktp_2022', 'hyperglycemic_crises_2024'],
  },
  igd_stroke_iskemik_window: {
    panduanResmi: 'Catat waktu terakhir pasien diketahui sehat, cek glukosa, lakukan skrining stroke, dan pertahankan ABC. Jangan memberi asupan oral atau antiplatelet empiris sebelum perdarahan disingkirkan. Rujuk segera ke jejaring CT dan reperfusi.',
    sumberIds: ['pnpk_stroke_2026', 'aha_asa_stroke_2026'],
  },
  igd_perdarahan_pascasalin: {
    panduanResmi: 'Aktifkan respons PPH segera: pijat uterus, oksitosin, akses IV dan kristaloid terukur, asam traneksamat sedini mungkin dalam 3 jam, cari penyebab 4T, lalu rujuk sambil melanjutkan resusitasi.',
    sumberIds: ['ppk_fktp_2022', 'who_pph_2025'],
  },
  igd_asfiksia_neonatorum: {
    panduanResmi: 'Jaga hangat, posisikan jalan napas, keringkan dan stimulasi. Bila apnea/gasping atau denyut kurang dari 100 per menit, mulai ventilasi tekanan positif efektif dalam menit pertama dan reassess sebelum eskalasi serta rujukan.',
    sumberIds: ['ppk_fktp_2022', 'aha_neonatal_2025'],
  },
  igd_tenggelam: {
    panduanResmi: 'Utamakan ventilasi dan oksigenasi; bila henti jantung lakukan CPR dengan napas bantuan, cegah hipotermia, dan jangan memasang imobilisasi spinal rutin tanpa mekanisme trauma. Semua korban simptomatik memerlukan evaluasi lanjutan.',
    sumberIds: ['ppk_fktp_2022', 'aha_drowning_2024'],
  },
  igd_keracunan_organofosfat: {
    panduanResmi: 'Lindungi penolong, hentikan paparan, dan lakukan dekontaminasi. Jaga jalan napas dengan pengisapan sekret dan oksigen, lalu titrasi atropin terhadap sekresi serta ventilasi, bukan ukuran pupil. Rujuk dengan pemantauan karena toksisitas dapat berulang.',
    sumberIds: ['ppk_fktp_2022', 'who_pesticide_2008'],
  },
  igd_gigitan_ular_berbisa: {
    panduanResmi: 'Imobilisasi ekstremitas, lepaskan benda ketat, dan hindari torniket, sayatan, isapan, serta suntikan IM. Nilai tanda envenomasi sistemik, lalu rujuk ke fasilitas dengan antibisa dan pemantauan. Antibisa tidak diberikan tanpa indikasi envenomasi.',
    sumberIds: ['ppk_fktp_2022', 'who_snakebite_2016'],
  },
  igd_syok_sepsis: {
    panduanResmi: 'Sepsis dan syok septik adalah kegawatan. Mulai resusitasi, ambil kultur bila tidak menunda, dan berikan antibiotik IV segera, idealnya dalam satu jam pada syok. Berikan kristaloid berdasarkan berat badan dengan penilaian ulang yang sering. Jangan memakai volume tetap tanpa menilai risiko kelebihan cairan; rujuk dengan pemantauan.',
    sumberIds: ['pnpk_sepsis_2017', 'ssc_sepsis_2026'],
  },
  igd_eklampsia: {
    panduanResmi: 'Amankan ABC dan posisi lateral, berikan magnesium sulfat untuk menghentikan serta mencegah kejang berulang, tangani hipertensi berat, dan rujuk emergensi sambil memantau ibu-janin. Persalinan definitif tidak boleh ditunda oleh observasi FKTP.',
    sumberIds: ['ppk_fktp_2022', 'who_preeclampsia_2025'],
  },
  igd_sumbatan_jalan_napas_anak: {
    panduanResmi: 'Pada anak sadar dengan obstruksi berat, lakukan siklus 5 back blows dan 5 abdominal thrusts; bila tidak responsif mulai CPR dan lihat benda hanya saat tampak. Jangan melakukan blind finger sweep.',
    sumberIds: ['ppk_fktp_2022', 'aha_pediatric_bls_2025'],
  },
  igd_pneumotoraks_tension_trauma: {
    panduanResmi: 'Pneumotoraks tensi dengan gangguan hemodinamik atau pernapasan adalah diagnosis klinis dan tidak menunggu foto. Tenaga terlatih melakukan dekompresi sesuai alat dan protokol, lalu memantau patensi serta kekambuhan. Setelah itu, rujuk segera.',
    sumberIds: ['ppk_fktp_2022', 'nice_major_trauma'],
  },
  igd_stemi_anterior_hipoksemik: {
    panduanResmi: 'Rekam EKG dalam 10 menit, berikan aspirin kunyah bila tidak kontraindikasi, oksigen hanya karena kasus ini hipoksemik, dan aktifkan jejaring reperfusi tanpa menunggu troponin. Tujuan rujukan harus mampu menjalankan strategi reperfusi.',
    sumberIds: ['pnpk_ska_2019', 'acc_aha_acs_2025'],
  },
}

/** Fail-fast: setiap draft IGD harus punya grounding sebelum masuk PACK. */
export function terapkanGroundingIgd(kasus: readonly KasusIgdTanpaGrounding[]): KasusIgd[] {
  return kasus.map((item) => {
    const grounding = GROUNDING_IGD[item.id]
    if (!grounding) throw new Error(`IGD '${item.id}' belum punya grounding sumber`)
    return {
      ...item,
      panduanResmi: grounding.panduanResmi,
      sumber: grounding.sumberIds.map((id) => ({ ...SUMBER_IGD[id] })),
    }
  })
}
