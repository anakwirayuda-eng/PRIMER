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
    cakupan: 'floor_umum',
    jenis: 'pedoman_indonesia',
  },
  pnpk_epilepsi_2026: {
    id: 'pnpk_epilepsi_2026',
    label: 'PNPK Tata Laksana Epilepsi Dewasa 2026',
    url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan1776933600_244772.pdf',
    tahun: 2026,
    cakupan: 'langsung',
    jenis: 'pedoman_indonesia',
  },
  pnpk_stroke_2026: {
    id: 'pnpk_stroke_2026',
    label: 'KMK 304/2026 - PNPK Tata Laksana Stroke',
    url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan1780387545_996111.pdf',
    tahun: 2026,
    cakupan: 'langsung',
    jenis: 'pedoman_indonesia',
  },
  pnpk_sepsis_2017: {
    id: 'pnpk_sepsis_2017',
    label: 'KMK 342/2017 - PNPK Tata Laksana Sepsis',
    url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan_1610419769_850165.pdf',
    tahun: 2017,
    cakupan: 'langsung',
    jenis: 'pedoman_indonesia',
  },
  pnpk_ska_2019: {
    id: 'pnpk_ska_2019',
    label: 'PNPK Tata Laksana Sindroma Koroner Akut 2019',
    url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan_1610419977_266892.pdf',
    tahun: 2019,
    cakupan: 'langsung',
    jenis: 'pedoman_indonesia',
  },
  /**
   * Audit cakupan IGD 2026-08-02: igd_kejang_demam satu-satunya kasus IGD yang
   * EBM internasionalnya cuma WHO Basic Emergency Care (payung kegawatan umum
   * = 'terkait'), jadi belum punya bukti internasional yang benar-benar
   * membahas kejang demam. AAP Febrile Seizures SENGAJA TIDAK dipakai: teksnya
   * eksplisit menyatakan diri tidak diperuntukkan bagi kejang demam KOMPLEKS,
   * sedangkan kasus ini justru kompleks — mengutipnya akan jadi overclaim.
   * Tinjauan sistematik 2024 ini membandingkan 7 pedoman lintas negara dan
   * membahas kejang demam kompleks secara eksplisit (kriteria rawat inap,
   * profilaksis pada kasus risiko tinggi). PMID 38653182.
   */
  febrile_seizures_guidelines_review_2024: {
    id: 'febrile_seizures_guidelines_review_2024',
    label: 'Pediatric Neurology 2024 - Febrile Seizures: A Systematic Review of Different Guidelines',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38653182/',
    tahun: 2024,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  idai_kejang_demam: {
    id: 'idai_kejang_demam',
    label: 'IDAI - Rekomendasi Penatalaksanaan Kejang Demam',
    url: 'https://bpdev.idai.or.id/buku/rekomendasi-penatalaksanaan-kejang-demam',
    tahun: 2016,
    cakupan: 'langsung',
    jenis: 'pedoman_indonesia',
  },
  who_bec: {
    id: 'who_bec',
    label: 'WHO/ICRC Basic Emergency Care',
    url: 'https://www.who.int/teams/integrated-health-services/clinical-services-and-systems/emergency-and-critical-care/bec',
    tahun: 2018,
    cakupan: 'terkait',
    jenis: 'evidence_internasional',
  },
  rcuk_anaphylaxis_2025: {
    id: 'rcuk_anaphylaxis_2025',
    label: 'Resuscitation Council UK - Anaphylaxis Guideline 2025',
    url: 'https://www.resus.org.uk/library/2025-resuscitation-guidelines/special-circumstances-guidelines',
    tahun: 2025,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  gina_2026: {
    id: 'gina_2026',
    label: 'GINA Global Strategy for Asthma 2026',
    url: 'https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf',
    tahun: 2026,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  ada_hypoglycemia_2026: {
    id: 'ada_hypoglycemia_2026',
    label: 'ADA Standards of Care - Glycemic Goals and Hypoglycemia 2026',
    url: 'https://diabetesjournals.org/care/article/49/Supplement_1/S132/163927/6-Glycemic-Goals-Hypoglycemia-and-Hyperglycemic',
    tahun: 2026,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  who_arboviral_2025: {
    id: 'who_arboviral_2025',
    label: 'WHO Guidelines for Clinical Management of Arboviral Diseases 2025',
    url: 'https://www.who.int/publications/i/item/9789240111110',
    tahun: 2025,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  ilae_status_2015: {
    id: 'ilae_status_2015',
    label: 'ILAE Definition and Classification of Status Epilepticus',
    url: 'https://www.ilae.org/guidelines/definition-and-classification/status-epilepticus-2015',
    tahun: 2015,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  hyperglycemic_crises_2024: {
    id: 'hyperglycemic_crises_2024',
    label: 'Hyperglycemic Crises in Adults - International Consensus Report 2024',
    url: 'https://diabetesjournals.org/care/article-pdf/47/8/1257/780938/dci240032.pdf',
    tahun: 2024,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  aha_asa_stroke_2026: {
    id: 'aha_asa_stroke_2026',
    label: 'AHA/ASA Guideline for Acute Ischemic Stroke 2026',
    url: 'https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke',
    tahun: 2026,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  who_pph_2025: {
    id: 'who_pph_2025',
    label: 'WHO/FIGO/ICM Postpartum Haemorrhage Guideline 2025',
    url: 'https://www.who.int/publications/i/item/9789240115637',
    tahun: 2025,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  aha_neonatal_2025: {
    id: 'aha_neonatal_2025',
    label: 'AHA/AAP Neonatal Resuscitation Guidelines 2025',
    url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation',
    tahun: 2025,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  who_pesticide_2008: {
    id: 'who_pesticide_2008',
    label: 'WHO Clinical Management of Acute Pesticide Intoxication',
    url: 'https://www.who.int/publications/i/item/9789241597456',
    tahun: 2008,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  who_snakebite_2016: {
    id: 'who_snakebite_2016',
    label: 'WHO SEARO Guidelines for Management of Snakebites',
    url: 'https://www.who.int/southeastasia/publications/i/item/9789290225300',
    tahun: 2016,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  ssc_sepsis_2026: {
    id: 'ssc_sepsis_2026',
    label: 'Surviving Sepsis Campaign Adult Guidelines 2026',
    url: 'https://sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines',
    tahun: 2026,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  who_preeclampsia_2025: {
    id: 'who_preeclampsia_2025',
    label: 'WHO Pre-eclampsia Fact Sheet and Recommendations 2025',
    url: 'https://www.who.int/news-room/fact-sheets/detail/pre-eclampsia',
    tahun: 2025,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  aha_pediatric_bls_2025: {
    id: 'aha_pediatric_bls_2025',
    label: 'AHA/AAP Pediatric Basic Life Support 2025',
    url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-basic-life-support',
    tahun: 2025,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  acc_aha_acs_2025: {
    id: 'acc_aha_acs_2025',
    label: 'ACC/AHA Guideline for Acute Coronary Syndromes 2025',
    url: 'https://professional.heart.org/en/science-news/2025-guideline-for-the-management-of-patients-with-acute-coronary-syndromes',
    tahun: 2025,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  permenkes_rujukan_2024: {
    id: 'permenkes_rujukan_2024',
    label: 'Permenkes 16/2024 - Sistem Rujukan Pelayanan Kesehatan Perseorangan',
    url: 'https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-16-tahun-2024',
    tahun: 2024,
    cakupan: 'floor_umum',
    jenis: 'pedoman_indonesia',
  },
  fornas_2025: {
    id: 'fornas_2025',
    label: 'KMK 1199/2025 - Formularium Nasional',
    url: 'https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/',
    tahun: 2025,
    cakupan: 'floor_umum',
    jenis: 'pedoman_indonesia',
  },
  idai_resneo_2024: {
    id: 'idai_resneo_2024',
    label: 'IDAI - Panduan Provider Resusitasi Neonatus Resneo ID 2024',
    url: 'https://www.idai.or.id/publications/buku-idai/buku-panduan-provider-resusitasi-neonatus-resneo-id-edisi-pertama',
    tahun: 2024,
    cakupan: 'langsung',
    jenis: 'pedoman_indonesia',
  },
  acs_tbi_2024: {
    id: 'acs_tbi_2024',
    label: 'ACS Best Practices Guidelines - Traumatic Brain Injury 2024',
    url: 'https://www.facs.org/media/vgfgjpfk/best-practices-guidelines-traumatic-brain-injury.pdf',
    tahun: 2024,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  bkpk_snakebite_2025: {
    id: 'bkpk_snakebite_2025',
    label: 'BKPK Kemenkes - Pedoman Gigitan dan Sengatan Hewan Berbisa 2025',
    url: 'https://simplek.badankebijakan.kemkes.go.id/repositori/detail/1004',
    tahun: 2025,
    cakupan: 'langsung',
    jenis: 'pedoman_indonesia',
  },
  ghbtb_2026: {
    id: 'ghbtb_2026',
    label: 'Kementerian Kesehatan - Portal Program GHBTB',
    url: 'https://s.kemkes.go.id/GHBTB',
    tahun: 2026,
    cakupan: 'terkait',
    jenis: 'pedoman_indonesia',
  },
  kemenkes_icha_2026: {
    id: 'kemenkes_icha_2026',
    label: 'Kementerian Kesehatan - Investigasi dan Perlindungan Nakes Kasus dr. Icha',
    url: 'https://www.kemkes.go.id/id/kemenkes-akan-usut-tuntas-kasus-dugaan-intimidasi-terhadap-dr-icha',
    tahun: 2026,
    cakupan: 'terkait',
    jenis: 'pedoman_indonesia',
  },
  bkpk_poisoning_2024: {
    id: 'bkpk_poisoning_2024',
    label: 'BKPK Kemenkes - Buku Pedoman Keracunan Alami dan Non Alami 2024',
    url: 'https://repository.badankebijakan.kemkes.go.id/id/eprint/5608/',
    tahun: 2024,
    cakupan: 'langsung',
    jenis: 'pedoman_indonesia',
  },
  aha_special_circumstances_2025: {
    id: 'aha_special_circumstances_2025',
    label: 'AHA Special Circumstances of Resuscitation 2025',
    url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation',
    tahun: 2025,
    cakupan: 'terkait',
    jenis: 'evidence_internasional',
  },
  perkeni_insulin_2021: {
    id: 'perkeni_insulin_2021',
    label: 'PERKENI - Petunjuk Praktis Terapi Insulin 2021',
    url: 'https://pbperkeni.or.id/wp-content/uploads/2021/11/22-10-21-_-Website-Pedoman-Petunjuk-Praktis-Terapi-Insulin-Pada-Pasien-Diabetes-Melitus-Ebook.pdf',
    tahun: 2021,
    cakupan: 'terkait',
    jenis: 'pedoman_indonesia',
  },
  ada_hospital_2026: {
    id: 'ada_hospital_2026',
    label: 'ADA Standards of Care - Diabetes Care in the Hospital 2026',
    url: 'https://diabetesjournals.org/care/article/49/Supplement_1/S339/163925/16-Diabetes-Care-in-the-Hospital-Standards-of-Care',
    tahun: 2026,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  pnpk_burn_2019: {
    id: 'pnpk_burn_2019',
    label: 'KMK 555/2019 - PNPK Tata Laksana Luka Bakar',
    url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan_1610415947_843237.pdf',
    tahun: 2019,
    cakupan: 'langsung',
    jenis: 'pedoman_indonesia',
  },
  aba_burn_resuscitation_2024: {
    id: 'aba_burn_resuscitation_2024',
    label: 'American Burn Association - Burn Shock Resuscitation 2024',
    url: 'https://academic.oup.com/jbcr/article/45/3/565/7458089',
    tahun: 2024,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  pnpk_pregnancy_complications_2017: {
    id: 'pnpk_pregnancy_complications_2017',
    label: 'KMK 91/2017 - PNPK Tata Laksana Komplikasi Kehamilan',
    url: 'https://www.kemkes.go.id/app_asset/file_content_download/17012281586566ae7eec8862.58707574.pdf',
    tahun: 2017,
    cakupan: 'langsung',
    jenis: 'pedoman_indonesia',
  },
  who_pph_implementation_2026: {
    id: 'who_pph_implementation_2026',
    label: 'WHO/FIGO/ICM - PPH Implementation Guide 2026',
    url: 'https://www.who.int/publications/i/item/9789240116115',
    tahun: 2026,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  pnpk_trauma_2017: {
    id: 'pnpk_trauma_2017',
    label: 'KMK 132/2017 - PNPK Tata Laksana Trauma',
    url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan_1610422327_714480.pdf',
    tahun: 2017,
    cakupan: 'langsung',
    jenis: 'pedoman_indonesia',
  },
  wses_thoracic_trauma_2025: {
    id: 'wses_thoracic_trauma_2025',
    label: 'WSES-AAST Thoracic Trauma Guidelines 2025',
    url: 'https://link.springer.com/article/10.1186/s13017-025-00651-1',
    tahun: 2025,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  who_status_epilepticus_2023: {
    id: 'who_status_epilepticus_2023',
    label: 'WHO - Antiseizure Medicines for Established Status Epilepticus 2023',
    url: 'https://www.who.int/teams/mental-health-and-substance-use/mental-health-gap-action-programme/resources-centre/epilepsy-and-seizures/Antiseizure-medicines-for-management-of-established-status-epilepticus',
    tahun: 2023,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  queensland_fbao_2025: {
    id: 'queensland_fbao_2025',
    label: 'Queensland Paediatric Guideline - Inhaled Foreign Body 2025',
    url: 'https://www.childrens.health.qld.gov.au/for-health-professionals/queensland-paediatric-emergency-care-qpec/queensland-paediatric-clinical-guidelines/foreign-body-inhaled',
    tahun: 2025,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  sepsis3_2016: {
    id: 'sepsis3_2016',
    label: 'Sepsis-3 International Consensus Definitions',
    url: 'https://jamanetwork.com/journals/jama/fullarticle/2492881',
    tahun: 2016,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  anzcor_drowning_2026: {
    id: 'anzcor_drowning_2026',
    label: 'ANZCOR 11.10 - Resuscitation in Special Circumstances 2026',
    url: 'https://www.anzcor.org/home/adult-advanced-life-support/guideline-11-10-resuscitation-in-special-circumstances',
    tahun: 2026,
    cakupan: 'terkait',
    jenis: 'evidence_internasional',
  },
  wms_drowning_2024: {
    id: 'wms_drowning_2024',
    label: 'Wilderness Medical Society Drowning Guideline 2024',
    url: 'https://doi.org/10.1177/10806032241227460',
    tahun: 2024,
    cakupan: 'langsung',
    jenis: 'evidence_internasional',
  },
  who_drowning_2024: {
    id: 'who_drowning_2024',
    label: 'WHO Global Status Report on Drowning Prevention 2024',
    url: 'https://www.who.int/publications/i/item/9789240103962',
    tahun: 2024,
    cakupan: 'terkait',
    jenis: 'evidence_internasional',
  },
  basarnas_search_rescue_2014: {
    id: 'basarnas_search_rescue_2014',
    label: 'UU 29/2014 - Pencarian dan Pertolongan',
    url: 'https://jdih.basarnas.go.id/produk-hukum/427',
    tahun: 2014,
    cakupan: 'terkait',
    jenis: 'pedoman_indonesia',
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
    sumberIds: ['ppk_fktp_2022', 'rcuk_anaphylaxis_2025'],
  },
  igd_kejang_demam: {
    panduanResmi: 'Kejang aktif lebih dari 5 menit ditangani sebagai kegawatan: amankan ABC, cek glukosa, berikan benzodiazepin sesuai rute yang tersedia, lalu rujuk bila kompleks, berulang, fokal, atau pemulihan tidak wajar.',
    sumberIds: ['idai_kejang_demam', 'febrile_seizures_guidelines_review_2024', 'who_bec'],
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
    panduanResmi: 'PNPK Epilepsi Dewasa 2026 menjadi floor: status konvulsif ditangani sejak menit ke-5 dengan proteksi, dukungan airway-ventilasi, glukosa, dan diazepam dosis terukur yang dapat diulang sekali. Bila dua dosis adekuat gagal, pertahankan monitoring serta transfer ke kemampuan obat lini kedua, EEG, airway, dan ICU; listing Fornas tidak membuktikan kesiapan infus di setiap FKTP.',
    sumberIds: ['pnpk_epilepsi_2026', 'ilae_status_2015', 'who_status_epilepticus_2023', 'fornas_2025', 'permenkes_rujukan_2024'],
  },
  igd_cedera_kepala_sedang: {
    panduanResmi: 'Cedera kepala sedang memakai GCS 9-12. Prioritas FKTP adalah ABC dengan pembatasan gerak servikal, target SpO2 >=94%, serta GCS dan pupil serial sebagai pemantauan neurologis dasar, bukan pengukuran ICP. Hindari hiperventilasi atau manitol rutin dan transfer terpantau ke RS dengan CT serta kemampuan trauma-neurosurgical.',
    sumberIds: ['ppk_fktp_2022', 'acs_tbi_2024', 'permenkes_rujukan_2024'],
  },
  igd_luka_bakar_luas: {
    panduanResmi: 'PNPK Luka Bakar dan PPK FKTP menjadi floor. Hentikan proses bakar tanpa menarik kain yang melekat, dinginkan 20 menit tanpa hipotermia, beri oksigen konsentrasi tinggi pada suspek cedera inhalasi, dan gunakan kristaloid seimbang sekitar 2 mL/kg/%TBSA/24 jam sebagai estimasi awal yang dititrasi. Antibiotik profilaksis rutin tidak dianjurkan; transfer ke burn-airway capable service.',
    sumberIds: ['pnpk_burn_2019', 'ppk_fktp_2022', 'aba_burn_resuscitation_2024', 'who_bec', 'permenkes_rujukan_2024'],
  },
  igd_ketoasidosis_diabetik: {
    panduanResmi: 'PERKENI menjadi konteks Indonesia, sedangkan konsensus 2024 dan ADA 2026 memperbarui diagnosis, cairan, monitoring, serta pencegahan kekambuhan. Suspek KAD berat memerlukan ABC dan kristaloid isotonik; insulin dimulai hanya dengan penilaian serta pemantauan kalium. Sukamaju meneruskan cairan dan transfer tanpa infus insulin improvisasi.',
    sumberIds: ['perkeni_insulin_2021', 'hyperglycemic_crises_2024', 'ada_hospital_2026', 'fornas_2025', 'permenkes_rujukan_2024'],
  },
  igd_stroke_iskemik_window: {
    panduanResmi: 'Pada fase FKTP gunakan label suspek stroke akut sampai CT membedakan iskemik dan perdarahan. Kunci last-known-well/onset, cek glukosa, lakukan pemeriksaan neurologis singkat, pertahankan NPO, dan hindari antiplatelet/antikoagulan pra-pencitraan. TD 182/100 tidak perlu dinormalisasi di FKTP; pra-notifikasi dan target keberangkatan <=30 menit menuju kemampuan CT-reperfusi.',
    sumberIds: ['pnpk_stroke_2026', 'aha_asa_stroke_2026', 'permenkes_rujukan_2024'],
  },
  igd_perdarahan_pascasalin: {
    panduanResmi: 'PNPK komplikasi kehamilan dan PPK FKTP menjadi floor; WHO/FIGO/ICM 2025-2026 memperbarui bundel MOTIVE. Jalankan masase, oksitosin, TXA 1 g IV, kristaloid hangat, pemeriksaan 4T, serta eskalasi secara paralel. Listing Fornas tidak menjamin readiness; rujuk ke darah, anestesi, operasi, kendali sumber, ICU, dan dukungan neonatus.',
    sumberIds: ['pnpk_pregnancy_complications_2017', 'ppk_fktp_2022', 'who_pph_2025', 'who_pph_implementation_2026', 'fornas_2025', 'permenkes_rujukan_2024'],
  },
  igd_asfiksia_neonatorum: {
    panduanResmi: 'Pada bayi cukup bulan, jaga hangat, keringkan dan stimulasi; bila apnea/gasping atau HR <100, mulai ventilasi 30-60/menit dengan udara ruangan dan pastikan dada mengembang. Bila HR tetap <60 setelah ventilasi efektif, lakukan kompresi 3:1 bersama ventilasi dan eskalasi sesuai algoritme sambil transfer ke layanan neonatus.',
    sumberIds: ['idai_resneo_2024', 'aha_neonatal_2025', 'permenkes_rujukan_2024'],
  },
  igd_tenggelam: {
    panduanResmi: 'Utamakan ventilasi: pada nadi yang masih ada dengan napas tidak efektif, beri assisted ventilation segera; bila cardiac arrest, lakukan CPR dengan napas dan kompresi. Keringkan serta hangatkan paralel, hindari spinal board rutin tanpa indikasi trauma, dan rujuk kasus yang membutuhkan BVM atau tetap simptomatik berdasarkan derajat penyakit, bukan mitos secondary drowning.',
    sumberIds: ['ppk_fktp_2022', 'aha_special_circumstances_2025', 'anzcor_drowning_2026', 'wms_drowning_2024', 'who_drowning_2024', 'basarnas_search_rescue_2014', 'permenkes_rujukan_2024'],
  },
  igd_keracunan_organofosfat: {
    panduanResmi: 'Gunakan APD; dukungan airway-ventilasi, atropin, dan dekontaminasi berjalan paralel. Pada dewasa mulai atropin 1-2 mg IV/IO lalu gandakan tiap 5 menit menurut bronkorea, bronkospasme, air entry, oksigenasi, bradikardia, dan perfusi. Fornas membuktikan listing, bukan stok besar; transfer terpantau ke kemampuan ventilasi, rumatan, dan toksikologi.',
    sumberIds: ['bkpk_poisoning_2024', 'fornas_2025', 'aha_special_circumstances_2025', 'who_pesticide_2008', 'permenkes_rujukan_2024'],
  },
  igd_gigitan_ular_berbisa: {
    panduanResmi: 'Gunakan penilaian sindromik dan serial. Imobilisasi, hindari insisi-isap-es-ramuan, dan jangan melepas ikatan ketat mendadak sebelum resusitasi, adrenalin, monitoring, serta antivenom yang sesuai siap. Perdarahan gusi adalah envenomasi sistemik; koordinasikan GHBTB dan tujuan dengan antivenom, koagulasi/transfusi, airway, renal support, serta monitoring.',
    sumberIds: ['bkpk_snakebite_2025', 'ghbtb_2026', 'kemenkes_icha_2026', 'who_snakebite_2016', 'permenkes_rujukan_2024'],
  },
  igd_syok_sepsis: {
    panduanResmi: 'PNPK Sepsis 2017 dan PPK FKTP menjadi floor, dengan SSC 2026 sebagai pembaruan cairan individual, antibiotik satu jam, vasopresor, source control, dan quality improvement. Beri kristaloid seimbang 250-500 mL lalu nilai ulang; gunakan seftriakson 2 g IV hanya sebagai stok jembatan berprotokol pada encounter ini, dan transfer tanpa menunggu administrasi.',
    sumberIds: ['pnpk_sepsis_2017', 'ppk_fktp_2022', 'ssc_sepsis_2026', 'sepsis3_2016', 'fornas_2025', 'permenkes_rujukan_2024'],
  },
  igd_eklampsia: {
    panduanResmi: 'Amankan ibu, posisi lateral kiri, jaga airway, dan berikan MgSO4 loading yang diencerkan serta diberikan perlahan. Sebelum dosis lanjut, pastikan refleks patela, RR >=16/menit, dan diuresis memadai; siapkan kalsium glukonas. Tangani hipertensi berat tanpa normalisasi mendadak, stabilkan ibu, lalu rujuk ke obstetri emergensi dan perawatan neonatus.',
    sumberIds: ['ppk_fktp_2022', 'who_preeclampsia_2025', 'permenkes_rujukan_2024'],
  },
  igd_sumbatan_jalan_napas_anak: {
    panduanResmi: 'Pada anak tiga tahun dengan FBAO berat, aktifkan bantuan dan lakukan 5 back blows diikuti 5 abdominal thrusts. Bila tidak responsif mulai CPR tanpa menunda pulse check, lihat mulut saat membuka airway, dan ambil hanya benda yang tampak. Batuk atau bunyi napas menetap setelah benda keluar memerlukan transfer ke kemampuan airway pediatrik dan bronkoskopi.',
    sumberIds: ['ppk_fktp_2022', 'aha_pediatric_bls_2025', 'queensland_fbao_2025', 'permenkes_rujukan_2024'],
  },
  igd_pneumotoraks_tension_trauma: {
    panduanResmi: 'PNPK Trauma dan PPK FKTP menjadi floor. Pada dugaan pneumotoraks tensi dengan instabilitas, jangan menunda dekompresi untuk foto. Encounter harus menyatakan operator, lokasi protokol, kateter cukup panjang, monitoring, dan transport; keberhasilan dinilai dari respons serial, bukan desis. Needle decompression adalah jembatan menuju chest drain dan trauma care definitif.',
    sumberIds: ['pnpk_trauma_2017', 'ppk_fktp_2022', 'who_bec', 'wses_thoracic_trauma_2025', 'permenkes_rujukan_2024'],
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
