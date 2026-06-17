/**
 * @reflection
 * [IDENTITY]: PisPkLifestyleScenarios.js
 * [PURPOSE]: 10 skenario behavior-change INTI PIS-PK yang sebelumnya KOSONG di
 *            DiseaseScenarios.js (yang timpang ke wabah/KLB & zoonosis). Mengisi
 *            indikator harian: rokok, hipertensi/NCD, ASI, balita/Posyandu, KB,
 *            jiwa/ODGJ, JKN, TB-mangkir, jamban. Semua tier 1 → menaikkan pool
 *            tier-1 (resolveBehaviorCaseScenarioId) dari ~7 menjadi ~17.
 * [STATE]: DRAFT — angka comBBarriers (kunci jawaban) PERLU VALIDASI DOSEN
 *            sebelum deploy September 2026. Lihat docs/UKM_REDESIGN.md.
 * [ANCHOR]: PISPK_LIFESTYLE_SCENARIOS
 * [DEPENDS_ON]: (none — pure data)
 * [LAST_UPDATE]: 2026-06-17
 *
 * CATATAN INTEGRASI:
 * - Field baru (pisPkIndicatorId, ttmStage, gatedInterventions, gateReason) bersifat
 *   forward-looking per UKM_REDESIGN.md; belum dikonsumsi BehaviorCaseEngine.js (additive, aman).
 * - microTask baru (check_bp, counseling, assess, admin, inspect) — bila BehaviorCasePanel
 *   switch atas microTask quickVisitVariant, daftarkan handler atau abaikan (quick-path legacy).
 * - Keragaman tahap TTM sengaja: action/relapse (HT, TB), preparation (jamban),
 *   contemplation (DM, ASI, KB, JKN), precontemplation (balita, ODGJ, rokok).
 */

export const PISPK_LIFESTYLE_SCENARIOS = [
    {
        id: 'bc_rokok_dalam_rumah',
        tier: 1,
        title: 'Asap Rokok Ayah di Kamar Bayi',
        disease: 'ispa_paparan_asap',
        icon: '🚬',
        category: 'perilaku',
        pisPkIndicatorId: 'rokok',
        targetBehavior: 'Ayah berhenti merokok di dalam rumah — merokok di luar/teras, tidak di dekat bayi, menuju upaya berhenti (UBM)',
        comBBarriers: { cap_psy: 0.2, opp_phy: 0.3, opp_soc: 0.7, mot_ref: 0.4, mot_aut: 0.85 },
        primaryBarriers: ['mot_aut', 'opp_soc'],
        bestInterventions: ['environmental', 'modelling', 'enablement', 'persuasion'],
        readinessStart: 'precontemplation',
        ttmStage: 'precontemplation',
        gatedInterventions: ['coercion', 'restriction', 'incentivisation'],
        gateReason: 'Pada precontemplation, tekanan/larangan/insentif memicu reaktansi & defensif maskulin. Ayah belum punya niat berhenti — dipaksa malah makin menolak. Bangun kesadaran & ubah lingkungan dulu. EDUKASI = JEBAKAN: ayah sudah tahu rokok buruk → ceramah memicu reaktansi.',
        npcAnchors: ['kk_32'],
        culturalBeliefs: ['Rokok setelah kopi itu wajib, baru terasa jejeg', 'Nolak rokok di warung dikira sombong, nggak guyub', 'Asap rokok cuma bikin bayi batuk dikit, nanti kebal', 'Laki-laki nggak ngerokok kayak kurang jantan'],
        investigationClues: [
            { location: 'ruang_tamu', finding: 'Asbak penuh puntung di meja dekat tempat bayi tidur siang, langit-langit menguning. Bungkus rokok di mana-mana padahal di dinding ada poster bahaya rokok dari Puskesmas.', comBRevealed: 'mot_aut' },
            { location: 'dialog_ayah', finding: '"Saya tahu kok Dok rokok itu jelek, di bungkusnya juga ada gambar serem. Tapi habis ngopi nggak ngerokok itu nggak enak, otomatis tangan nyari."', comBRevealed: 'mot_aut' },
            { location: 'warung_pangkalan', finding: 'Bapak-bapak ngumpul ngopi-ngerokok bareng sore hari; yang nolak rokok diledek "sok sehat". Ayah pasien ada di situ.', comBRevealed: 'opp_soc' },
            { location: 'teras_depan', finding: 'Ada teras luas beratap yang nyaman, tapi ayah tetap merokok di dalam dengan alasan "rumah sempit, nggak ada tempat" — padahal teras jelas tersedia.', comBRevealed: 'opp_phy' }
        ],
        ukpBridge: { failOutcomes: ['ispa_atas', 'pneumonia_bacterial', 'bronkiolitis'], failProbability: 0.6, delayDays: { min: 7, max: 21 }, description: 'Paparan asap rokok pasif terus-menerus → bayi ISPA berulang → pneumonia/bronkiolitis → sesak, perlu nebulizer/rujuk.' },
        triggerConditions: { minDay: 7, season: null, probability: 0.16, sdoh: { smokingHousehold: true } },
        quickVisitVariant: { stampCard: { name: 'Bayi Bagas (kk_32)', data: 'Usia 8 bln, batuk-pilek 4x dalam 3 bulan. Ayah perokok aktif ±12 batang/hari, merokok di dalam rumah.', phbs: '4/10' }, microTask: 'assess' }
    },
    {
        id: 'bc_hipertensi_mangkir',
        tier: 1,
        title: 'Tensi Tak Terasa, Obat Pun Dilupa',
        disease: 'hypertension',
        icon: '💊',
        category: 'ptm_chronic',
        pisPkIndicatorId: 'hipertensi',
        targetBehavior: 'Minum obat antihipertensi RUTIN tiap hari walau tanpa gejala, kontrol tensi bulanan',
        comBBarriers: { cap_psy: 0.85, opp_phy: 0.4, mot_ref: 0.3, mot_aut: 0.7 },
        primaryBarriers: ['cap_psy', 'mot_aut'],
        bestInterventions: ['education', 'enablement', 'persuasion'],
        readinessStart: 'action',
        ttmStage: 'action',
        gatedInterventions: ['coercion'],
        gateReason: 'Pasien sudah pernah patuh lalu relapse karena salah paham, bukan membangkang. Coercion merusak aliansi terapeutik. Fokus re-edukasi silent killer + dukung rutinitas. EDUKASI BENAR di sini (koreksi miskonsepsi).',
        npcAnchors: ['kk_07'],
        culturalBeliefs: ['Hipertensi kalau sudah tidak pusing berarti sembuh, obat boleh stop', 'Minum obat tensi terus-menerus bikin ginjal rusak', 'Tensi tinggi bisa dinetralkan timun dan daun salam saja'],
        investigationClues: [
            { location: 'dialog_pasien', finding: '"Saya stop obatnya Dok, soalnya tensi nggak kerasa apa-apa, badan sudah enak. Buat apa minum kalau sudah sehat?"', comBRevealed: 'cap_psy' },
            { location: 'kotak_obat', finding: 'Strip Amlodipin masih hampir penuh, tanggal tebus terakhir 6 minggu lalu. Sisa obat menumpuk di laci.', comBRevealed: 'mot_aut' },
            { location: 'buku_kontrol_ptm', finding: 'TD hari ini 178/104 mmHg. Riwayat: pernah terkontrol 138/85 saat rutin minum obat, lalu putus.', comBRevealed: 'cap_psy' },
            { location: 'dialog_istri', finding: '"Puskesmas-nya jauh Dok, harus naik ojek, jadi males nebus obat juga."', comBRevealed: 'opp_phy' }
        ],
        ukpBridge: { failOutcomes: ['stroke', 'krisis_hipertensi'], failProbability: 0.5, delayDays: { min: 14, max: 90 }, description: 'Putus obat antihipertensi → TD tak terkontrol kronik → stroke / krisis hipertensi → rujuk RS, defisit neurologis permanen.' },
        triggerConditions: { minDay: 10, season: null, probability: 0.16, sdoh: { access: 'Remote' } },
        quickVisitVariant: { stampCard: { name: 'Pak Slamet (kk_07)', data: 'TD 178/104. Putus obat 6 minggu, "sudah merasa sehat". Sisa obat menumpuk.', phbs: '5/10' }, microTask: 'check_bp' }
    },
    {
        id: 'bc_dm_prolanis',
        tier: 1,
        title: 'Manisnya Suguhan, Pahitnya Gula Darah',
        disease: 'diabetes_mellitus',
        icon: '🩸',
        category: 'ptm_chronic',
        pisPkIndicatorId: 'hipertensi',
        targetBehavior: 'Patuh diet rendah gula/karbo, kontrol porsi & ngemil, minum OAD rutin, ikut senam & cek GD Prolanis',
        comBBarriers: { cap_psy: 0.45, opp_soc: 0.75, mot_ref: 0.25, mot_aut: 0.85 },
        primaryBarriers: ['mot_aut', 'opp_soc'],
        bestInterventions: ['enablement', 'modelling', 'education'],
        readinessStart: 'contemplation',
        ttmStage: 'contemplation',
        gatedInterventions: ['coercion', 'restriction', 'incentivisation'],
        gateReason: 'Pada contemplation pasien masih menimbang; coercion/restriction memicu reaktansi, incentivisation terlalu dini. Bangun self-efficacy (enablement), teladan peer Prolanis (modelling), koreksi miskonsepsi porsi (education).',
        npcAnchors: ['kk_11'],
        culturalBeliefs: ['Nggak enak nolak suguhan tuan rumah, nanti dikira sombong', 'Belum kenyang kalau belum makan nasi banyak', 'Diabetes itu penyakit keturunan, percuma dijaga', 'Kalau sudah minum obat, makan manis sedikit nggak apa-apa'],
        investigationClues: [
            { location: 'dialog_pasien', finding: '"Saya sebenarnya mau sehat Dok, cuma susah... tiap arisan dan hajatan pasti disuguhi teh manis sama kue, nggak enak kalau nolak."', comBRevealed: 'opp_soc' },
            { location: 'dapur', finding: 'Toples gorengan & kue manis di meja, stok teh dan gula pasir banyak. Porsi nasi besar, sering ngemil di sela waktu.', comBRevealed: 'mot_aut' },
            { location: 'kartu_prolanis', finding: 'GDP 248 mg/dL, HbA1c 9.1%. Absen senam Prolanis 3 bulan, OAD sering lupa setelah makan di luar.', comBRevealed: 'mot_aut' },
            { location: 'dialog_kader', finding: '"Bu Marni katanya sih nggak peduli sama kesehatannya, males diajak."', comBRevealed: 'mot_ref' }
        ],
        ukpBridge: { failOutcomes: ['ulkus_diabetik', 'neuropati_diabetik'], failProbability: 0.55, delayDays: { min: 30, max: 180 }, description: 'Gula darah kronik tak terkontrol → neuropati & gangguan vaskular → ulkus diabetik → risiko amputasi, rujuk RS.' },
        triggerConditions: { minDay: 12, season: null, probability: 0.15 },
        quickVisitVariant: { stampCard: { name: 'Bu Marni (kk_11)', data: 'GDP 248, HbA1c 9.1%. Suka ngemil manis, "nggak enak nolak suguhan". Absen senam Prolanis.', phbs: '6/10' }, microTask: 'check_bp' }
    },
    {
        id: 'bc_asi_eksklusif',
        tier: 1,
        title: 'ASI Saya Encer, Katanya Kurang',
        disease: 'asi_eksklusif_dini',
        icon: '🍼',
        category: 'kia',
        pisPkIndicatorId: 'asi',
        targetBehavior: 'Lanjutkan ASI eksklusif sampai 6 bulan tanpa tambahan susu formula/air/madu; menyusui on-demand, perbaiki perlekatan',
        comBBarriers: { cap_psy: 0.4, cap_phy: 0.35, opp_soc: 0.85, mot_ref: 0.7, mot_aut: 0.3 },
        primaryBarriers: ['opp_soc', 'mot_ref'],
        bestInterventions: ['modelling', 'persuasion', 'education', 'enablement'],
        readinessStart: 'contemplation',
        ttmStage: 'contemplation',
        gatedInterventions: ['coercion', 'incentivisation'],
        gateReason: 'Tahap kontemplasi: menyalahkan/menekan ibu memicu Righting Reflex & rasa bersalah; insentif material menggeser fokus dari keyakinan manfaat ASI. Butuh keteladanan ibu lain yang berhasil + meyakinkan manfaat.',
        npcAnchors: ['kk_05'],
        culturalBeliefs: ['ASI saya encer dan sedikit, tanda kurang bergizi', 'Susu formula bikin bayi cepat gemuk, montok, tidur nyenyak', 'Kata mertua, dikasih pisang/madu sedikit biar kenyang', 'Bayi nangis terus tandanya ASI tidak cukup'],
        investigationClues: [
            { location: 'dapur', finding: 'Kaleng susu formula sudah dibuka di rak, dot baru dicuci. Stok ASI perah tidak ada.', comBRevealed: 'opp_soc' },
            { location: 'dialog_mertua', finding: '"ASI menantu saya itu encer, anaknya nangis terus berarti kurang. Dulu anak saya semua saya kasih sufu, gemuk-gemuk sehat."', comBRevealed: 'opp_soc' },
            { location: 'dialog_ibu', finding: '"Saya jadi ragu Dok, jangan-jangan ASI saya memang nggak cukup buat bikin dia gendut..."', comBRevealed: 'mot_ref' },
            { location: 'ruang_tamu', finding: 'Puting ibu tampak sedikit lecet, ibu mengeluh perih saat menyusui (red herring — perlekatan bisa diperbaiki, bukan akar; akar di tekanan sosial & keyakinan ASI kurang).', comBRevealed: 'cap_phy' }
        ],
        ukpBridge: { failOutcomes: ['diare_akut_non_spesifik', 'ispa', 'gizi_kurang_bayi'], failProbability: 0.55, delayDays: { min: 7, max: 30 }, description: 'Sufu dini + dot tidak steril + air tidak matang → diare berulang & ISPA. Hilangnya proteksi imunologis ASI + dilusi gizi → BB tidak naik adekuat → IGD karena dehidrasi.' },
        triggerConditions: { minDay: 5, season: null, probability: 0.14, sdoh: { income: 'Low' } },
        quickVisitVariant: { stampCard: { name: 'Ibu Sari & Bayi Aldo (kk_05)', data: 'Bayi 2 bln. Sudah dikenalkan sufu 1 minggu + sesekali pisang. BB grafik KMS mulai mendatar. Mertua serumah.', phbs: '5/10' }, microTask: 'check_kms' }
    },
    {
        id: 'bc_balita_posyandu',
        tier: 1,
        title: 'Anak Saya Sehat, Ngapain Ditimbang?',
        disease: 'balita_tidak_dipantau',
        icon: '⚖️',
        category: 'kia',
        pisPkIndicatorId: 'balita',
        targetBehavior: 'Bawa balita ke Posyandu setiap bulan untuk timbang BB, ukur TB/PB, plot KMS, deteksi dini gangguan tumbuh kembang',
        comBBarriers: { cap_psy: 0.7, mot_aut: 0.8, opp_phy: 0.4, mot_ref: 0.4 },
        primaryBarriers: ['mot_aut', 'cap_psy'],
        bestInterventions: ['education', 'enablement', 'modelling'],
        readinessStart: 'precontemplation',
        ttmStage: 'precontemplation',
        gatedInterventions: ['coercion', 'restriction', 'incentivisation'],
        gateReason: 'Pra-kontemplasi: ortu belum merasa ada masalah. Coercion/restriction memicu defensif; insentif menutupi akar miskonsepsi & menciptakan kepatuhan semu. Edukasi makna pemantauan + teladan tetangga dulu.',
        npcAnchors: ['kk_14'],
        culturalBeliefs: ['Anak saya gemuk dan aktif, jelas sehat, buat apa ditimbang', 'Posyandu cuma buat anak yang sakit atau kurus', 'Stunting itu keturunan, memang badan kami pendek', 'Timbang-ukur cuma formalitas'],
        investigationClues: [
            { location: 'dialog_ibu', finding: '"Anak saya gemuk gini kok Dok, sehat. Ngapain capek-capek ke Posyandu tiap bulan, antri lama."', comBRevealed: 'cap_psy' },
            { location: 'buku_kia', finding: 'Kolom grafik KMS kosong sejak bayi usia 8 bulan — tidak pernah diplot. Tidak ada catatan kehadiran Posyandu.', comBRevealed: 'mot_aut' },
            { location: 'dialog_ayah', finding: '"Istri sibuk urus warung, saya kerja. Hari Posyandu itu Selasa pagi, jam sibuk. Lupa terus, nggak kepikiran penting."', comBRevealed: 'mot_aut' },
            { location: 'halaman_desa', finding: 'Ibu menyebut "Posyandu jauh, di balai dusun sebelah" — padahal hanya 600 m (red herring — alasan permukaan; akar di kebiasaan/tak merasa perlu).', comBRevealed: 'opp_phy' }
        ],
        ukpBridge: { failOutcomes: ['stunting', 'gizi_buruk'], failProbability: 0.5, delayDays: { min: 60, max: 180 }, description: 'Tanpa penimbangan rutin, faltering tidak terdeteksi berbulan-bulan. Anak yang tampak "gemuk" bisa pendek (stunting) tanpa disadari — terlambat untuk intervensi gizi di window 1000 HPK.' },
        triggerConditions: { minDay: 7, season: null, probability: 0.16, sdoh: { education: 'Low' } },
        quickVisitVariant: { stampCard: { name: 'Balita Riko (kk_14)', data: 'Usia 18 bln. Tampak gemuk menurut ortu. Tidak pernah ditimbang sejak 8 bulan. TB/PB belum pernah diukur.', phbs: '4/10' }, microTask: 'check_kms' }
    },
    {
        id: 'bc_kb_tolak',
        tier: 1,
        title: 'Banyak Anak Banyak Rejeki?',
        disease: 'unmet_need_kb',
        icon: '🤱',
        category: 'kia',
        pisPkIndicatorId: 'kb',
        targetBehavior: 'Pasangan usia subur ikut KB pasca-salin, konseling bersama suami, metode kontrasepsi rasional sesuai 4T',
        comBBarriers: { cap_psy: 0.3, opp_phy: 0.2, opp_soc: 0.9, mot_ref: 0.7, mot_aut: 0.4 },
        primaryBarriers: ['opp_soc', 'mot_ref'],
        bestInterventions: ['persuasion', 'modelling', 'education'],
        readinessStart: 'contemplation',
        ttmStage: 'contemplation',
        gatedInterventions: ['coercion'],
        gateReason: 'Pada contemplation, menekan/memaksa memicu reaktansi & rasa dihakimi. Coercion + isu agama = backfire. Ibu sudah mulai mikir, butuh dukungan & dialog suami, bukan tekanan.',
        npcAnchors: ['kk_24'],
        culturalBeliefs: ['Banyak anak banyak rejeki, nanti Tuhan yang kasih makan', 'KB itu haram/dosa, menolak pemberian Tuhan', 'Suami bilang KB bikin istri gemuk & tidak subur', 'Tokoh agama bilang KB mengubah ciptaan'],
        investigationClues: [
            { location: 'rumah_pus', finding: 'Buku KIA: P4A0, anak terakhir baru 11 bulan, ibu telat haid lagi. Jarak kelahiran <2 tahun, usia ibu 38 th (4T: terlalu tua + terlalu dekat).', comBRevealed: 'mot_ref' },
            { location: 'dialog_suami', finding: '"Saya yang nggak izinkan dia KB, Dok. Ustadz bilang KB itu menolak rejeki. Lagian itu urusan laki-laki."', comBRevealed: 'opp_soc' },
            { location: 'dialog_ibu', finding: '"Sebenarnya saya capek Dok, badan sudah nggak kuat hamil lagi. Tapi takut dosa, dan suami marah kalau saya KB diam-diam."', comBRevealed: 'mot_ref' },
            { location: 'ruang_kia_puskesmas', finding: 'Stok suntik, implan, pil semua tersedia GRATIS untuk peserta JKN. Bidan: "Alatnya ada terus kok Dok, yang susah ngajak suaminya konseling." (red herring opp_phy).', comBRevealed: 'opp_phy' }
        ],
        ukpBridge: { failOutcomes: ['kehamilan_risiko_tinggi', 'pph'], failProbability: 0.55, delayDays: { min: 60, max: 270 }, description: 'Unmet need KB → kehamilan 4T → risiko preeklampsia, perdarahan post-partum, ruptur uteri pada grande multipara → rujukan obstetri emergensi.' },
        triggerConditions: { minDay: 10, season: null, probability: 0.13, sdoh: { education: 'Low', income: 'Low' } },
        quickVisitVariant: { stampCard: { name: 'Keluarga Pak Darman (kk_24)', data: 'PUS, istri 38 th, P4A0. Anak bungsu 11 bln, ibu telat haid. Suami menolak KB ("haram").', phbs: '5/10' }, microTask: 'counseling' }
    },
    {
        id: 'bc_odgj_pasung',
        tier: 1,
        title: 'Yang Disembunyikan di Belakang Rumah',
        disease: 'skizofrenia_pasung',
        icon: '⛓️',
        category: 'jiwa',
        pisPkIndicatorId: 'jiwa',
        targetBehavior: 'Lepas pasung bertahap, ODGJ berobat rutin (antipsikotik), kontrol di Pustu/Puskesmas, keluarga jadi PMO, rujuk bila perlu',
        comBBarriers: { cap_psy: 0.9, opp_phy: 0.3, opp_soc: 0.7, mot_ref: 0.5, mot_aut: 0.2 },
        primaryBarriers: ['cap_psy', 'opp_soc'],
        bestInterventions: ['education', 'modelling', 'enablement'],
        readinessStart: 'precontemplation',
        ttmStage: 'precontemplation',
        gatedInterventions: ['coercion', 'restriction', 'incentivisation'],
        gateReason: 'Pra-kontemplasi: keluarga belum paham ODGJ bisa diobati & percaya "kerasukan". Memaksa lepas pasung TANPA edukasi & obat siap = pasien gaduh-gelisah, kambuh → keluarga trauma & memasung lagi lebih erat.',
        npcAnchors: ['kk_26'],
        culturalBeliefs: ['Anaknya kerasukan jin / kena guna-guna', 'Sudah dibawa ke orang pintar tapi tak sembuh, memang takdir', 'ODGJ itu aib keluarga', 'Kalau dilepas nanti mengamuk, bahayain orang', 'Penyakit jiwa tidak ada obatnya'],
        investigationClues: [
            { location: 'belakang_rumah', finding: 'Bilik kayu gelap, pasien laki-laki ±30 th dipasung kaki dengan balok & rantai >2 tahun. Otot kaki atrofi, ada luka lecet/dekubitus, kurus.', comBRevealed: 'cap_psy' },
            { location: 'dialog_ibu', finding: '"Dia kerasukan Dok, sudah dibawa ke kiai mana-mana. Mana ada obatnya orang begini? Kami pasung biar nggak nyakitin orang."', comBRevealed: 'cap_psy' },
            { location: 'dialog_ayah', finding: '"Jangan sampai tetangga tahu ya Dok, malu kami. Nanti dikira keluarga kami ada keturunan gila."', comBRevealed: 'opp_soc' },
            { location: 'data_puskesmas', finding: 'Puskesmas PUNYA program keswa: antipsikotik (haloperidol, risperidon) gratis + kunjungan perawat keswa. RSJ 4 jam, tapi rawat jalan jiwa bisa dimulai di sini (red herring opp_phy).', comBRevealed: 'opp_phy' }
        ],
        ukpBridge: { failOutcomes: ['kontraktur_atrofi', 'ulkus_dekubitus', 'sepsis'], failProbability: 0.6, delayDays: { min: 30, max: 180 }, description: 'Pasung berkepanjangan → kontraktur & atrofi permanen, luka dekubitus terinfeksi → sepsis, malnutrisi, perburukan psikiatri.' },
        triggerConditions: { minDay: 21, season: null, probability: 0.08, sdoh: { education: 'Low', stigma: 'High' } },
        quickVisitVariant: { stampCard: { name: 'An. Bagas (kk_26)', data: 'Laki-laki 30 th, dipasung di bilik belakang >2 th. Skizofrenia tak terobati. Atrofi kaki, luka lecet. Keluarga: "kerasukan".', phbs: '3/10' }, microTask: 'assess' }
    },
    {
        id: 'bc_jkn_belum',
        tier: 1,
        title: 'Nanti Kalau Sakit Baru Daftar',
        disease: 'uninsured_jkn',
        icon: '🪪',
        category: 'jaminan',
        pisPkIndicatorId: 'jkn',
        targetBehavior: 'Seluruh anggota keluarga terdaftar JKN/KIS aktif, paham alur PBI vs mandiri, gunakan untuk kontrol & preventif',
        comBBarriers: { cap_psy: 0.8, opp_phy: 0.6, opp_soc: 0.2, mot_ref: 0.4 },
        primaryBarriers: ['cap_psy', 'opp_phy'],
        bestInterventions: ['education', 'enablement'],
        readinessStart: 'contemplation',
        ttmStage: 'contemplation',
        gatedInterventions: ['coercion'],
        gateReason: 'Hambatan utama pemahaman + akses, bukan penolakan. Menekan/mengancam keluarga miskin membuat merasa dipermalukan & makin menunda. Butuh edukasi alur + bantu daftar (enablement).',
        npcAnchors: ['kk_03'],
        culturalBeliefs: ['Ngapain bayar iuran tiap bulan kalau lagi sehat', 'Nanti kalau sakit baru daftar, kan bisa langsung dipakai', 'Ngurus BPJS ribet, antre lama, kantornya jauh', 'Pakai BPJS dilayani seadanya', 'Iuran mandiri terlalu mahal'],
        investigationClues: [
            { location: 'dialog_kepala_keluarga', finding: '"Kami sehat-sehat aja kok Dok, nanti aja kalau ada yang sakit baru daftar BPJS. Lagian saya nggak ngerti caranya."', comBRevealed: 'cap_psy' },
            { location: 'data_kependudukan', finding: 'Status JKN keluarga: TIDAK AKTIF. Buruh harian lepas → kesulitan iuran rutin mandiri. Belum pernah dicek kelayakan PBI/KIS gratis.', comBRevealed: 'opp_phy' },
            { location: 'dialog_istri', finding: '"Sebenarnya saya pengen daftar Dok, tapi suami bilang nanti aja. Kantor BPJS jauh, harus izin kerja, ongkosnya lumayan."', comBRevealed: 'opp_phy' },
            { location: 'dialog_kepala_keluarga_2', finding: '"Bukan saya nggak mau ikut program pemerintah ya Dok — saya cuma bingung daftarnya gimana dan takut nggak sanggup bayar." (red herring mot_ref).', comBRevealed: 'mot_ref' }
        ],
        ukpBridge: { failOutcomes: ['katastrofik_oop', 'berobat_terlambat'], failProbability: 0.5, delayDays: { min: 14, max: 120 }, description: 'Tanpa JKN → saat sakit berat biaya out-of-pocket katastrofik → jual aset/utang, atau menunda berobat sampai parah. Daftar saat sakit kena masa tunggu aktivasi 14 hari.' },
        triggerConditions: { minDay: 5, season: null, probability: 0.15, sdoh: { income: 'Low', employment: 'Informal' } },
        quickVisitVariant: { stampCard: { name: 'Keluarga Pak Joni (kk_03)', data: '5 anggota, JKN tidak aktif. Buruh harian. "Nanti sakit baru daftar." Belum dicek kelayakan PBI.', phbs: '6/10' }, microTask: 'admin' }
    },
    {
        id: 'bc_tb_mangkir',
        tier: 1,
        title: 'Merasa Sembuh, Obat Disimpan di Laci',
        disease: 'tb_pulmonary',
        icon: '🫁',
        category: 'penyakit_menular',
        pisPkIndicatorId: 'tb',
        targetBehavior: 'Lanjutkan & tuntaskan OAT fase lanjutan sampai 6 bulan walau gejala hilang, aktifkan PMO, screening kontak serumah',
        comBBarriers: { cap_psy: 0.8, opp_soc: 0.7, mot_ref: 0.4, mot_aut: 0.3 },
        primaryBarriers: ['cap_psy', 'opp_soc'],
        bestInterventions: ['education', 'enablement', 'environmental', 'modelling'],
        readinessStart: 'action',
        ttmStage: 'action',
        gatedInterventions: ['coercion', 'restriction'],
        gateReason: 'Fase action yang relapse karena MISKONSEPSI, bukan pembangkangan. Menekan/membatasi menambah stigma & bikin pasien makin sembunyi. Butuh koreksi pemahaman + dukungan PMO. (Beda dari bc_tb_paru yang deteksi pra-kontemplasi.)',
        npcAnchors: ['kk_12'],
        culturalBeliefs: ['Kalau batuk sudah hilang dan badan enak, berarti sudah sembuh', 'Obat TB itu keras, kelamaan minum nanti ginjal/hati rusak', 'TB itu aib keluarga, jangan sampai tetangga tahu', 'Minum obat sembunyi-sembunyi biar nggak ketahuan'],
        investigationClues: [
            { location: 'rumah_pasien', finding: 'Sisa OAT (Fase Lanjutan) masih banyak di laci, tanggal terakhir diminum 3 minggu lalu. Kartu pengobatan TB.01 berhenti diisi pada bulan ke-2.', comBRevealed: 'cap_psy' },
            { location: 'dialog_pasien', finding: '"Lha saya kan udah nggak batuk lagi Dok, badan udah enteng, berat naik. Berarti udah sembuh to? Ngapain minum obat terus sampai 6 bulan."', comBRevealed: 'cap_psy' },
            { location: 'dialog_keluarga', finding: '"Obatnya disimpan, nggak diminum di depan kami. Dia nggak mau ada yang tahu sakit TBC, malu sama tetangga. Nggak ada yang ngawasin minum obat."', comBRevealed: 'opp_soc' },
            { location: 'dialog_kader', finding: 'Kader curiga: "Mungkin orangnya malas atau lupa minum obat aja Dok" — padahal pasien SENGAJA berhenti karena yakin sudah sembuh, bukan lupa (red herring mot_aut).', comBRevealed: 'mot_aut' }
        ],
        ukpBridge: { failOutcomes: ['tb_mdr', 'tb_pulmonary'], failProbability: 0.65, delayDays: { min: 21, max: 90 }, description: 'Putus OAT di fase lanjutan → resistensi obat → MDR-TB (pengobatan jauh lebih lama, mahal, toksik) + penularan ke kontak serumah, terutama anak balita.' },
        triggerConditions: { minDay: 21, season: null, probability: 0.1, sdoh: { tbOnTreatment: true } },
        quickVisitVariant: { stampCard: { name: 'Pak Darmaji (kk_12)', data: 'TB paru BTA(+), OAT bulan ke-2, gejala hilang. Tidak ambil obat 3 minggu. Kontak serumah: cucu 4 thn. PMO: tidak ada.', phbs: '3/10' }, microTask: 'assess' }
    },
    {
        id: 'bc_jamban_sehat',
        tier: 1,
        title: 'Sungai Sudah Cukup, Katanya',
        disease: 'babs_sanitasi',
        icon: '🚽',
        category: 'lingkungan',
        pisPkIndicatorId: 'jamban',
        targetBehavior: 'Stop BABS — membangun & memakai jamban sehat (leher angsa + septic tank), ikut arisan jamban/Sanimas',
        comBBarriers: { cap_psy: 0.2, opp_phy: 0.8, opp_soc: 0.5, mot_ref: 0.6 },
        primaryBarriers: ['opp_phy', 'mot_ref'],
        bestInterventions: ['enablement', 'environmental', 'modelling'],
        readinessStart: 'preparation',
        ttmStage: 'preparation',
        gatedInterventions: [],
        gateReason: 'Tahap preparation — tidak perlu di-gate keras. Tapi EDUKASI murni adalah JEBAKAN: sebagian warga sudah tahu BABS berbahaya; yang menahan adalah biaya, lahan, dan norma. Fokus ke fasilitasi pembiayaan & keteladanan.',
        npcAnchors: ['kk_23'],
        culturalBeliefs: ['Sungai sudah cukup, nenek moyang BAB di sungai juga sehat', 'BAB di sungai lebih plong, langsung hanyut', 'Bikin jamban mahal dan butuh lahan', 'Kalau cuma satu rumah bikin jamban, percuma', 'Jamban di dalam rumah jorok, baunya masuk'],
        investigationClues: [
            { location: 'bantaran_sungai', finding: 'Jalan setapak dari beberapa rumah menuju "jamban helikopter" (jembatan bambu) di atas sungai. Anak-anak ikut BAB di situ. Sungai dipakai juga mandi & cuci.', comBRevealed: 'opp_phy' },
            { location: 'dialog_kepala_keluarga', finding: '"Mau bikin jamban itu butuh duit Dok, septic tank-nya mahal, lahan belakang sempit. Lagian dari dulu kami di sungai sehat-sehat aja."', comBRevealed: 'opp_phy' },
            { location: 'dialog_tetangga', finding: '"Di kampung sini emang kebanyakan masih ke sungai Bu, kalau cuma rumah saya yang bikin jamban nanti dibilang sok."', comBRevealed: 'opp_soc' },
            { location: 'dialog_ibu', finding: 'Saat ditanya bahaya BABS: "Tahu kok Dok, katanya bisa bikin diare dan cacingan ya. Tapi ya gimana, belum ada jambannya." — sudah tahu bahayanya (red herring cap_psy).', comBRevealed: 'cap_psy' }
        ],
        ukpBridge: { failOutcomes: ['diare_akut_non_spesifik', 'askariasis', 'demam_tifoid'], failProbability: 0.55, delayDays: { min: 7, max: 30 }, description: 'BABS mencemari sungai (sumber air & mandi) → diare berulang, cacingan (STH), demam tifoid berulang terutama pada anak → siklus sakit-malnutrisi-stunting.' },
        triggerConditions: { minDay: 10, season: 'rainy', probability: 0.18, sdoh: { sanitation: 'River/Open' } },
        quickVisitVariant: { stampCard: { name: 'Keluarga Sukimin (kk_23)', data: '5 anggota, BAB di sungai. Anak bungsu diare/tifoid 3x setahun. Sudah tahu bahaya, belum punya jamban.', phbs: '3/10' }, microTask: 'inspect' }
    }
];

export default PISPK_LIFESTYLE_SCENARIOS;
