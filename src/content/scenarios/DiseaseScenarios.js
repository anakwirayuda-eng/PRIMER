/**
 * @reflection
 * [IDENTITY]: DiseaseScenarios.js
 * [PURPOSE]: UKM Behavior Change disease scenarios for the Behavior Case Engine.
 *            20 scenarios across 4 tiers (Core, Important, Emerging, Environmental)
 *            with COM-B mappings, NPC anchors, UKM→UKP bridge, and trigger conditions.
 * [STATE]: Experimental
 * [ANCHOR]: DISEASE_SCENARIOS
 * [DEPENDS_ON]: IKMEventEngine, CalendarEventDB, VillageRegistry
 */

// ═══════════════════════════════════════════════════════════════
// COM-B BARRIER TYPES
// ═══════════════════════════════════════════════════════════════

export const COM_B_LABELS = {
    cap_phy: { id: 'cap_phy', label: 'Kemampuan Fisik', description: 'Keterampilan atau stamina untuk melakukan perilaku', icon: '💪' },
    cap_psy: { id: 'cap_psy', label: 'Kemampuan Pengetahuan', description: 'Pengetahuan atau pemahaman untuk melakukan perilaku', icon: '🧠' },
    opp_phy: { id: 'opp_phy', label: 'Kesempatan Fisik', description: 'Akses fisik: fasilitas, alat, waktu, uang', icon: '🏗️' },
    opp_soc: { id: 'opp_soc', label: 'Kesempatan Sosial', description: 'Norma sosial, dukungan keluarga/tetangga, tekanan budaya', icon: '👥' },
    mot_ref: { id: 'mot_ref', label: 'Motivasi Sadar', description: 'Niat, rencana, keyakinan tentang manfaat', icon: '🎯' },
    mot_aut: { id: 'mot_aut', label: 'Motivasi Kebiasaan', description: 'Kebiasaan, emosi, impuls, kecanduan', icon: '⚡' }
};

// ═══════════════════════════════════════════════════════════════
// TTM READINESS STAGES
// ═══════════════════════════════════════════════════════════════

export const READINESS_STAGES = [
    { id: 'precontemplation', label: 'Belum Sadar', emoji: '😤', description: 'Tidak merasa ada masalah' },
    { id: 'contemplation', label: 'Mulai Mikir', emoji: '🤔', description: 'Sadar tapi belum siap berubah' },
    { id: 'preparation', label: 'Siap Rencana', emoji: '📝', description: 'Merencanakan perubahan' },
    { id: 'action', label: 'Sedang Berubah', emoji: '💪', description: 'Aktif mengubah perilaku' },
    { id: 'maintenance', label: 'Sudah Konsisten', emoji: '⭐', description: 'Perilaku baru sudah menjadi kebiasaan' }
];

// ═══════════════════════════════════════════════════════════════
// 9 INTERVENTION FUNCTIONS (Michie et al. 2011)
// ═══════════════════════════════════════════════════════════════

export const INTERVENTION_FUNCTIONS = {
    education: { id: 'education', label: 'Edukasi', icon: '📚', targets: ['cap_psy', 'mot_ref'] },
    persuasion: { id: 'persuasion', label: 'Persuasi', icon: '💬', targets: ['mot_ref', 'mot_aut'] },
    incentivisation: { id: 'incentivisation', label: 'Insentif', icon: '🎁', targets: ['mot_ref'] },
    coercion: { id: 'coercion', label: 'Tekanan', icon: '⚠️', targets: ['mot_ref'] },
    training: { id: 'training', label: 'Pelatihan', icon: '🎯', targets: ['cap_phy', 'cap_psy'] },
    enablement: { id: 'enablement', label: 'Fasilitasi', icon: '🔧', targets: ['opp_phy', 'cap_phy'] },
    modelling: { id: 'modelling', label: 'Keteladanan', icon: '🌟', targets: ['opp_soc', 'mot_ref'] },
    environmental: { id: 'environmental', label: 'Ubah Lingkungan', icon: '🏘️', targets: ['opp_phy'] },
    restriction: { id: 'restriction', label: 'Pembatasan', icon: '🚫', targets: ['opp_phy'] }
};

// ═══════════════════════════════════════════════════════════════
// TIER 1: CORE SCENARIOS (MVP - Daily Puskesmas Desa)
// ═══════════════════════════════════════════════════════════════

const TIER_1_CORE = [
    {
        id: 'bc_scabies_outbreak',
        tier: 1,
        title: 'Wabah Kudis di RT 03',
        disease: 'scabies',
        icon: '🪲',
        category: 'penyakit_menular',
        targetBehavior: 'Cuci sprei, handuk terpisah, obati 1 keluarga serentak',
        comBBarriers: {
            cap_psy: 0.7,  // Tak tahu harus treat 1 keluarga sekaligus
            opp_phy: 0.9,  // Overcrowded, shared bedding
            opp_soc: 0.5,  // Malu bilang kudisan
            mot_ref: 0.3   // Dianggap biasa
        },
        primaryBarriers: ['opp_phy', 'cap_psy'],
        bestInterventions: ['education', 'enablement', 'environmental'],
        readinessStart: 'precontemplation',
        npcAnchors: ['kk_28'],
        culturalBeliefs: ['Kudis itu karena darah kotor, bukan kutu', 'Malu ngomong ke tetangga'],
        investigationClues: [
            { location: 'kamar_tidur', finding: 'Satu kasur untuk 6 orang, sprei sudah lama tidak dicuci', comBRevealed: 'opp_phy' },
            { location: 'kamar_mandi', finding: 'Handuk dipakai bergantian, sabun batang shared', comBRevealed: 'opp_phy' },
            { location: 'dialog_ibu', finding: '"Ini cuma gatal biasa kok Dok, nanti juga hilang sendiri"', comBRevealed: 'cap_psy' }
        ],
        ukpBridge: {
            failOutcomes: ['scabies_infeksi', 'impetigo'],
            failProbability: 0.6,
            delayDays: { min: 3, max: 7 },
            description: 'Scabies menyebar ke seluruh RT → infeksi sekunder → impetigo'
        },
        triggerConditions: { minDay: 7, season: null, probability: 0.15, sdoh: { housing: 'Semi-Permanent' } },
        quickVisitVariant: {
            stampCard: { name: 'Keluarga Kusumo', data: 'Gatal-gatal seluruh anggota keluarga. Lesi papul di sela jari.', phbs: '3/10' },
            microTask: 'inspect_skin'
        }
    },
    {
        id: 'bc_sth_cacingan',
        tier: 1,
        title: 'Anak-anak Cacingan di Pinggir Sungai',
        disease: 'askariasis',
        icon: '🐛',
        category: 'gizi_phbs',
        targetBehavior: 'CTPS, pakai sandal, stop BABS, minum Albendazol POPM',
        comBBarriers: {
            cap_psy: 0.6,  // Tidak tahu cacingan bisa stunting
            cap_phy: 0.4,  // Anak-anak sulit cuci tangan di sungai
            opp_phy: 0.9,  // Tidak punya jamban, sumber air sungai
            mot_ref: 0.5   // "Cacingan itu biasa, anak desa ya gitu"
        },
        primaryBarriers: ['opp_phy', 'cap_psy'],
        bestInterventions: ['education', 'enablement', 'environmental'],
        readinessStart: 'precontemplation',
        npcAnchors: ['kk_14', 'kk_23'],
        culturalBeliefs: ['Anak cacingan karena suka makan tanah', 'Obat cacing bikin sakit perut'],
        investigationClues: [
            { location: 'halaman', finding: 'Anak-anak bermain tanpa alas kaki di tanah becek', comBRevealed: 'opp_phy' },
            { location: 'sungai', finding: 'Tempat MCK di sungai, tidak ada jamban', comBRevealed: 'opp_phy' },
            { location: 'dialog_ibu', finding: '"Perut anaknya buncit ya Bu?" - "Iya Dok, dari kecil memang gitu"', comBRevealed: 'cap_psy' }
        ],
        ukpBridge: {
            failOutcomes: ['anemia_deficiency'],
            failProbability: 0.6,
            delayDays: { min: 14, max: 30 },
            description: 'Cacingan kronik → malabsorpsi → anemia defisiensi besi → anak sering sakit'
        },
        triggerConditions: { minDay: 5, season: 'rainy', probability: 0.2, sdoh: { sanitation: 'River/Open' } },
        quickVisitVariant: {
            stampCard: { name: 'Anak Indah & Anak Tono', data: 'BB kurang, perut buncit, pucat. BAB di sungai.', phbs: '2/10' },
            microTask: 'check_kms'
        }
    },
    {
        id: 'bc_dbd_psn',
        tier: 1,
        title: 'Jentik Nyamuk Merajalela',
        disease: 'dengue',
        icon: '🦟',
        category: 'penyakit_menular',
        targetBehavior: '3M Plus: Menguras, Menutup, Mengubur. Abatisasi, ikan cupang.',
        comBBarriers: {
            cap_psy: 0.3,  // Tahu tapi malas
            opp_phy: 0.5,  // Banyak wadah penampung air hujan
            opp_soc: 0.6,  // "Tetangga juga nggak PSN kok"
            mot_aut: 0.8   // Kebiasaan menumpuk barang bekas
        },
        primaryBarriers: ['mot_aut', 'opp_soc'],
        bestInterventions: ['environmental', 'modelling', 'enablement'],
        readinessStart: 'contemplation',
        npcAnchors: ['kk_09'],
        culturalBeliefs: ['Nyamuk DBD itu dari got, bukan bak mandi', 'Fogging lebih ampuh dari PSN'],
        investigationClues: [
            { location: 'halaman_belakang', finding: 'Ban bekas, pot bunga, ember — semuanya ada jentik', comBRevealed: 'opp_phy' },
            { location: 'bak_mandi', finding: 'Bak mandi tidak dikuras 2 minggu, jentik positif', comBRevealed: 'mot_aut' },
            { location: 'dialog_kader', finding: '"Ibu Ayu sudah keliling tapi warga susah diajak PSN"', comBRevealed: 'opp_soc' }
        ],
        ukpBridge: {
            failOutcomes: ['dengue_df', 'dbd_grade_1'],
            failProbability: 0.5,
            delayDays: { min: 7, max: 14 },
            description: 'PSN gagal → wabah DBD → DHF → DSS → rujuk RS'
        },
        triggerConditions: { minDay: 3, season: 'rainy', probability: 0.25 },
        quickVisitVariant: {
            stampCard: { name: 'Laporan Jumantik Ayu', data: 'ABJ (Angka Bebas Jentik) RT 03: 62% (<95%). 8/13 rumah positif.', phbs: '5/10' },
            microTask: 'check_jentik'
        }
    },
    {
        id: 'bc_tb_paru',
        tier: 1,
        title: 'Tersembunyi di Balik Batuk',
        disease: 'tb_pulmonary',
        icon: '🫁',
        category: 'penyakit_menular',
        targetBehavior: 'Etika batuk, ventilasi rumah, PMO (Pengawas Minum Obat), screening kontak serumah',
        comBBarriers: {
            cap_psy: 0.6,  // Tak tahu batuk lama = TB
            opp_phy: 0.5,  // Rumah sempit, ventilasi buruk
            opp_soc: 0.8,  // Stigma: TB = penyakit hina
            mot_ref: 0.7   // Malu periksa, takut diagnosa
        },
        primaryBarriers: ['opp_soc', 'mot_ref'],
        bestInterventions: ['education', 'persuasion', 'enablement'],
        readinessStart: 'precontemplation',
        npcAnchors: ['kk_12', 'kk_22'],
        culturalBeliefs: ['TB itu penyakit kutukan', 'Kalau minum obat lama nanti rusak ginjal', 'Malu kalau tetangga tahu'],
        investigationClues: [
            { location: 'rumah', finding: 'Ventilasi tertutup kain, gelap, lembab', comBRevealed: 'opp_phy' },
            { location: 'dialog_pasien', finding: '"Batuk ini sudah 3 bulan Dok, tapi saya malu ke Puskesmas"', comBRevealed: 'opp_soc' },
            { location: 'dialog_tetangga', finding: '"Ih itu kan batuk TBC, jangan deket-deket"', comBRevealed: 'opp_soc' }
        ],
        ukpBridge: {
            failOutcomes: ['tb_pulmonary'],
            failProbability: 0.7,
            delayDays: { min: 14, max: 60 },
            description: 'TB tidak terdeteksi → menular ke anak & keluarga → MDR-TB jika putus obat'
        },
        triggerConditions: { minDay: 10, season: null, probability: 0.12 },
        quickVisitVariant: {
            stampCard: { name: 'Yuni (kk_22)', data: 'Batuk >2 minggu, BB turun, keringat malam. Kontak serumah: 2 anak.', phbs: '4/10' },
            microTask: 'check_temp'
        }
    },
    {
        id: 'bc_campak_outbreak',
        tier: 1,
        title: 'Ruam Merah Menular di SD',
        disease: 'measles',
        icon: '💉',
        category: 'penyakit_menular',
        targetBehavior: 'Imunisasi MR lengkap, debunk hoax KIPI via WA group',
        comBBarriers: {
            cap_psy: 0.5,  // Tidak tahu MR harus 2 dosis
            opp_soc: 0.9,  // Hoax WA group: "vaksin bikin autis"
            mot_ref: 0.8,  // Takut KIPI (efek samping)
            mot_aut: 0.4   // Lupa jadwal imunisasi
        },
        primaryBarriers: ['opp_soc', 'mot_ref'],
        bestInterventions: ['education', 'persuasion', 'modelling'],
        readinessStart: 'precontemplation',
        npcAnchors: ['kk_08', 'kk_02'],
        culturalBeliefs: ['Vaksin itu haram', 'Anak saya sehat tanpa vaksin', 'Vaksin bikin demam = berbahaya'],
        investigationClues: [
            { location: 'dialog_ibu', finding: '"Saya baca di WA Dok, vaksin itu bikin anak autis"', comBRevealed: 'opp_soc' },
            { location: 'kms', finding: 'Kolom imunisasi MR-2 kosong — belum lengkap', comBRevealed: 'cap_psy' },
            { location: 'sekolah', finding: '3 anak kelas 1 SD demam + ruam merah merata. 1 belum vaksin.', comBRevealed: 'opp_soc' }
        ],
        ukpBridge: {
            failOutcomes: ['morbilli', 'pneumonia_bacterial'],
            failProbability: 0.65,
            delayDays: { min: 5, max: 14 },
            description: 'Outbreak campak → komplikasi pneumonia & ensefalitis pada anak belum vaksin'
        },
        triggerConditions: { minDay: 14, season: null, probability: 0.1 },
        quickVisitVariant: {
            stampCard: { name: 'SD Sukamaju - Laporan UKS', data: 'Cakupan MR-2: 72% (<95% threshold). 3 kasus suspek campak.', phbs: '6/10' },
            microTask: 'check_temp'
        }
    },
    {
        id: 'bc_diare_food_poisoning',
        tier: 1,
        title: 'Air Sungai dan Warung Pinggir Jalan',
        disease: 'acute_gastroenteritis',
        icon: '💧',
        category: 'gizi_phbs',
        targetBehavior: 'Air bersih, masak matang, CTPS, oralit di rumah',
        comBBarriers: {
            cap_psy: 0.5,  // Tak tahu cara buat oralit rumahan
            cap_phy: 0.4,  // Tidak bisa masak air karena kayu bakar habis
            opp_phy: 0.8,  // Sumber air sungai/sumur tidak layak
            mot_aut: 0.6   // Kebiasaan minum air mentah
        },
        primaryBarriers: ['opp_phy', 'mot_aut'],
        bestInterventions: ['education', 'enablement', 'training'],
        readinessStart: 'contemplation',
        npcAnchors: ['kk_16', 'kk_20'],
        culturalBeliefs: ['Air sumur itu sudah bersih, tidak perlu dimasak', 'Diare itu biasa, nanti juga sembuh sendiri'],
        investigationClues: [
            { location: 'dapur_warung', finding: 'Air cuci piring dari ember, bukan air mengalir', comBRevealed: 'opp_phy' },
            { location: 'sumur', finding: 'Sumur terbuka, jarak <10m dari septic tank', comBRevealed: 'opp_phy' },
            { location: 'dialog_warga', finding: '"Kami sudah biasa minum air sumur langsung Dok"', comBRevealed: 'mot_aut' }
        ],
        ukpBridge: {
            failOutcomes: ['diare_akut_non_spesifik', 'keracunan_makanan'],
            failProbability: 0.55,
            delayDays: { min: 1, max: 5 },
            description: 'Air tercemar → KLB diare → dehidrasi berat anak & lansia'
        },
        triggerConditions: { minDay: 3, season: 'rainy', probability: 0.2 },
        quickVisitVariant: {
            stampCard: { name: 'Warung Bu Wawan (kk_20)', data: '5 pelanggan diare setelah makan. Air cuci dari ember.', phbs: '4/10' },
            microTask: 'check_temp'
        }
    },
    {
        id: 'bc_kia_dukun',
        tier: 1,
        title: 'Nyawa di Tangan Mbah Dukun',
        disease: 'maternal_complication',
        icon: '🤰',
        category: 'kia',
        targetBehavior: 'ANC 4x di bidan/Puskesmas, persalinan di faskes, tidak potong tali pusar oleh dukun, P4K lengkap',
        comBBarriers: {
            cap_psy: 0.4,  // Tahu harus ke bidan, tapi menganggap dukun juga bisa
            opp_phy: 0.5,  // Jarak ke Puskesmas jauh, jalan rusak
            opp_soc: 0.95, // Tekanan mertua: "Dari dulu ya ke Mbah Dukun"
            mot_ref: 0.3,  // Pasrah mengikuti adat
            mot_aut: 0.7   // Kebiasaan turun-temurun ke dukun
        },
        primaryBarriers: ['opp_soc', 'mot_aut'],
        bestInterventions: ['modelling', 'enablement', 'persuasion'],
        readinessStart: 'precontemplation',
        npcAnchors: ['kk_05', 'kk_18'],
        culturalBeliefs: [
            'Bidan desa masih muda, ketus, tidak tahu adat',
            'Mbah Dukun lebih berpengalaman, mijat enak',
            'Air ketuban harus didoain dukun biar anaknya selamat',
            'Persalinan di RS malah bikin ribet dan mahal'
        ],
        investigationClues: [
            { location: 'rumah_ibu_hamil', finding: 'Buku KIA kosong — ANC 0 kali di Puskesmas. Dukun "periksa" setiap bulan.', comBRevealed: 'cap_psy' },
            { location: 'dialog_mertua', finding: '"Dari zaman nenek moyang kami lahiran di dukun, semua selamat. Bidan itu apa-apa dirujuk RS, malah bikin takut."', comBRevealed: 'opp_soc' },
            { location: 'dialog_ibu', finding: '"Saya sebenarnya mau ke bidan Dok, tapi mertua nggak boleh. Nanti dibilang nggak nurut."', comBRevealed: 'opp_soc' }
        ],
        ukpBridge: {
            failOutcomes: ['perdarahan_postpartum', 'sepsis_neonatal'],
            failProbability: 0.5,
            delayDays: { min: 30, max: 90 },
            description: 'Persalinan dukun tanpa supervisi bidan → perdarahan post-partum (HPP) → rujukan IGD jam 2 pagi. Bayi risiko tetanus neonatorum jika tali pusar dipotong bambu.'
        },
        triggerConditions: { minDay: 14, season: null, probability: 0.12 },
        quickVisitVariant: {
            stampCard: { name: 'Ibu Siti (kk_05)', data: 'G2P1, UK 32 minggu. ANC 0x di faskes. "Kontrol" rutin di dukun. Mertua dominan.', phbs: '5/10' },
            microTask: 'check_temp'
        }
    }
];

// ═══════════════════════════════════════════════════════════════
// TIER 2: IMPORTANT SCENARIOS (2-3 per rotation)
// ═══════════════════════════════════════════════════════════════

const TIER_2_IMPORTANT = [
    {
        id: 'bc_filariasis_popm',
        tier: 2,
        title: 'Obat Massal Kaki Gajah: Siapa yang Nolak?',
        disease: 'filariasis',
        icon: '🦵',
        category: 'penyakit_menular',
        targetBehavior: 'Minum obat massal BELKAGA, pakai kelambu, lapor gejala',
        comBBarriers: {
            cap_psy: 0.4,
            opp_soc: 0.6,  // "Tetangga juga nolak kok"
            mot_ref: 0.8,  // "Saya nggak sakit, ngapain minum obat?"
            mot_aut: 0.5
        },
        primaryBarriers: ['mot_ref', 'opp_soc'],
        bestInterventions: ['education', 'persuasion', 'modelling'],
        readinessStart: 'precontemplation',
        npcAnchors: ['kk_29'],
        culturalBeliefs: ['Obat massal itu percobaan pemerintah', 'Kalau nggak sakit ngapain minum obat'],
        investigationClues: [
            { location: 'rumah_slamet', finding: 'Pak Slamet tidak datang saat pembagian obat BELKAGA', comBRevealed: 'mot_ref' },
            { location: 'dialog', finding: '"Saya sehat-sehat aja Dok, obat itu buat orang sakit"', comBRevealed: 'cap_psy' }
        ],
        ukpBridge: {
            failOutcomes: ['filariasis'],
            failProbability: 0.4,
            delayDays: { min: 30, max: 90 },
            description: 'Mikrofilaria tidak terobati → limfedema kronik 5-10 tahun kemudian'
        },
        triggerConditions: { minDay: 21, season: null, probability: 0.08 }
    },
    {
        id: 'bc_kusta_stigma',
        tier: 2,
        title: 'Bercak Mati Rasa: Jangan Kucilkan',
        disease: 'leprosy',
        icon: '🏥',
        category: 'penyakit_menular',
        targetBehavior: 'Deteksi dini bercak mati rasa, MDT tuntas, anti-stigma',
        comBBarriers: {
            cap_psy: 0.5,  // Tak tahu bercak mati rasa = kusta
            opp_soc: 0.95, // EXTREME stigma: dikucilkan warga
            mot_ref: 0.9,  // Takut kehilangan pekerjaan
            mot_aut: 0.3
        },
        primaryBarriers: ['opp_soc', 'mot_ref'],
        bestInterventions: ['education', 'persuasion', 'modelling', 'enablement'],
        readinessStart: 'precontemplation',
        npcAnchors: ['kk_22'],
        culturalBeliefs: ['Kusta itu kutukan dosa', 'Kusta menular lewat sentuhan', 'Kusta tidak bisa disembuhkan'],
        investigationClues: [
            { location: 'dialog_yuni', finding: '"Dok, lengan saya ada bercak putih, tapi saya takut dibilang kusta"', comBRevealed: 'mot_ref' },
            { location: 'dialog_tetangga', finding: '"Jangan sentuh itu Bu, nanti ketularan"', comBRevealed: 'opp_soc' },
            { location: 'pemeriksaan', finding: 'Makula hipopigmentasi dengan anestesi. Penebalan saraf ulnaris.', comBRevealed: 'cap_psy' }
        ],
        ukpBridge: {
            failOutcomes: ['leprosy'],
            failProbability: 0.7,
            delayDays: { min: 30, max: 180 },
            description: 'Kusta tidak terdeteksi → disabilitas permanen → stigma sosial meningkat'
        },
        triggerConditions: { minDay: 28, season: null, probability: 0.06 }
    },
    {
        id: 'bc_leptospirosis',
        tier: 2,
        title: 'Bahaya Tersembunyi di Sawah Banjir',
        disease: 'leptospirosis',
        icon: '🐀',
        category: 'penyakit_menular',
        targetBehavior: 'APD (sepatu boot) saat di sawah/banjir, kendalikan tikus, cuci kaki',
        comBBarriers: {
            cap_psy: 0.6,  // Tidak tahu leptospirosis dari kencing tikus
            opp_phy: 0.8,  // Petani harus ke sawah banjir
            mot_ref: 0.5,  // "Dari dulu juga begini, nggak apa-apa"
            mot_aut: 0.7   // Kebiasaan tanpa alas kaki di sawah
        },
        primaryBarriers: ['opp_phy', 'mot_aut'],
        bestInterventions: ['education', 'enablement', 'environmental'],
        readinessStart: 'precontemplation',
        npcAnchors: ['kk_12', 'kk_19'],
        culturalBeliefs: ['Air banjir itu cuma kotor, bukan berbahaya', 'Kalau pakai boot nanti susah jalan di sawah'],
        investigationClues: [
            { location: 'sawah', finding: 'Petani bekerja tanpa alas kaki di sawah yang tergenang banjir', comBRevealed: 'opp_phy' },
            { location: 'gudang', finding: 'Kotoran tikus di gudang padi, banyak lubang tikus', comBRevealed: 'opp_phy' },
            { location: 'dialog', finding: '"Dari jaman kakek saya juga di sawah tanpa sepatu kok Dok"', comBRevealed: 'mot_aut' }
        ],
        ukpBridge: {
            failOutcomes: ['leptospirosis'],
            failProbability: 0.5,
            delayDays: { min: 2, max: 14 },
            description: 'Lepto berat (Weil disease) → ikterus + gagal ginjal → rujuk RS'
        },
        triggerConditions: { minDay: 7, season: 'rainy', probability: 0.1 }
    },
    {
        id: 'bc_tetanus_neonatorum',
        tier: 2,
        title: 'Jangan Potong Tali Pusat Pakai Bambu',
        disease: 'tetanus',
        icon: '⚡',
        category: 'gizi_phbs',
        targetBehavior: 'Vaksin TT bumil, persalinan di faskes, luka dibersihkan bukan digunting daun',
        comBBarriers: {
            cap_psy: 0.8,  // Tidak tahu tali pusat harus steril
            opp_phy: 0.6,  // Jarak ke Puskesmas jauh, dukun dekat
            opp_soc: 0.7,  // Tradisi potong tali pusat pakai bambu/parut
            mot_ref: 0.5   // "Nenek dulu juga melahirkan di rumah kok"
        },
        primaryBarriers: ['cap_psy', 'opp_soc'],
        bestInterventions: ['education', 'training', 'enablement'],
        readinessStart: 'precontemplation',
        npcAnchors: ['kk_14'],
        culturalBeliefs: ['Dukun beranak lebih paham dari bidan', 'Tali pusat dipotong bambu biar anak kuat', 'Vaksin saat hamil berbahaya'],
        investigationClues: [
            { location: 'dialog_indah', finding: '"Saya mau melahirkan di rumah aja Dok, sama Mbah Pariyem"', comBRevealed: 'opp_soc' },
            { location: 'kms_ibu', finding: 'Status TT: belum lengkap (baru TT1)', comBRevealed: 'cap_psy' },
            { location: 'dialog_dukun', finding: '"Dari dulu saya tolong lahiran pakai bambu tajam, tidak ada masalah"', comBRevealed: 'opp_soc' }
        ],
        ukpBridge: {
            failOutcomes: ['tetanus'],
            failProbability: 0.3,
            delayDays: { min: 3, max: 14 },
            description: 'Tetanus neonatorum → FATAL bagi bayi. CFR > 50%.'
        },
        triggerConditions: { minDay: 14, season: null, probability: 0.08, sdoh: { housing: 'Make-shift' } }
    },
    {
        id: 'bc_herpes_zoster_mitos',
        tier: 2,
        title: 'Cacar Ular Bukan Karena Ular',
        disease: 'herpes_zoster',
        icon: '🐍',
        category: 'mitos_budaya',
        targetBehavior: 'Bukan mistis, segera ke faskes <72 jam (bukan dukun), acyclovir',
        comBBarriers: {
            cap_psy: 0.9,  // "Ini cacar ular, harus di-jampi dukun"
            opp_phy: 0.4,  // Lansia sulit ke Puskesmas
            opp_soc: 0.7,  // Keluarga mendorong ke dukun dulu
            mot_ref: 0.6   // Percaya obat tradisional lebih ampuh
        },
        primaryBarriers: ['cap_psy', 'opp_soc'],
        bestInterventions: ['education', 'persuasion'],
        readinessStart: 'precontemplation',
        npcAnchors: ['kk_15'],
        culturalBeliefs: ['Cacar ular karena ular melintas', 'Harus dikerokin', 'Kalau lingkarannya ketemu, bisa mati'],
        investigationClues: [
            { location: 'dialog_mbah', finding: '"Ular lewat di bawah kasur saya Dok, makanya kena cacar ular"', comBRevealed: 'cap_psy' },
            { location: 'pemeriksaan', finding: 'Vesikel dermatomal di thorax kiri, NRS 8/10. Onset 4 hari lalu.', comBRevealed: 'opp_phy' },
            { location: 'dialog_cucu', finding: '"Mbah sudah dikerokin sama Pak RT, tapi makin sakit"', comBRevealed: 'opp_soc' }
        ],
        ukpBridge: {
            failOutcomes: ['herpes_zoster'],
            failProbability: 0.5,
            delayDays: { min: 3, max: 7 },
            description: 'Terlambat antiviral >72 jam → neuralgia postherpetik kronik (nyeri bertahun-tahun)'
        },
        triggerConditions: { minDay: 10, season: null, probability: 0.07 }
    }
];

// ═══════════════════════════════════════════════════════════════
// TIER 3: EMERGING / RE-EMERGING (Random seasonal events)
// ═══════════════════════════════════════════════════════════════

const TIER_3_EMERGING = [
    {
        id: 'bc_difteri_klb',
        tier: 3,
        title: '🚨 KLB Difteri di Desa!',
        disease: 'diphtheria',
        icon: '🦠',
        category: 'penyakit_menular',
        targetBehavior: 'Catch-up immunization DPT, ring vaccination, isolasi kasus',
        comBBarriers: { cap_psy: 0.6, opp_soc: 0.8, mot_ref: 0.7 },
        primaryBarriers: ['opp_soc', 'mot_ref'],
        bestInterventions: ['education', 'persuasion', 'coercion'],
        readinessStart: 'contemplation',
        npcAnchors: [],
        culturalBeliefs: ['Vaksin DPT bikin anak demam tinggi', 'KLB itu hoax pemerintah'],
        ukpBridge: { failOutcomes: ['diphtheria'], failProbability: 0.7, delayDays: { min: 3, max: 10 } },
        triggerConditions: { minDay: 21, season: null, probability: 0.04, condition: 'vaxCoverage < 0.85' },
        isEmergingEvent: true,
        urgency: 'critical'
    },
    {
        id: 'bc_avian_flu_scare',
        tier: 3,
        title: '🚨 Ayam Mati Massal di Peternakan Warga',
        disease: 'avian_influenza',
        icon: '🐔',
        category: 'zoonosis',
        targetBehavior: 'Pisah unggas-manusia, masak ayam matang, lapor petugas, APD',
        comBBarriers: { cap_psy: 0.7, opp_phy: 0.6, mot_ref: 0.5 },
        primaryBarriers: ['cap_psy', 'opp_phy'],
        bestInterventions: ['education', 'environmental', 'restriction'],
        readinessStart: 'contemplation',
        npcAnchors: [],
        culturalBeliefs: ['Ayam mati karena cuaca, bukan flu', 'Sayang kalau ayam mati dibuang, mending dimakan'],
        ukpBridge: { failOutcomes: ['influenza'], failProbability: 0.2, delayDays: { min: 2, max: 7 } },
        triggerConditions: { minDay: 7, season: null, probability: 0.03 },
        isEmergingEvent: true,
        urgency: 'high'
    },
    {
        id: 'bc_anthrax_alert',
        tier: 3,
        title: '🚨 Sapi Mati Mendadak Jelang Idul Adha',
        disease: 'anthrax',
        icon: '🐄',
        category: 'zoonosis',
        targetBehavior: 'Jangan potong hewan sakit/mati mendadak, lapor Dinkes & Disnakkeswan',
        comBBarriers: { cap_psy: 0.8, mot_ref: 0.7, opp_phy: 0.5 },
        primaryBarriers: ['cap_psy', 'mot_ref'],
        bestInterventions: ['education', 'restriction', 'coercion'],
        readinessStart: 'precontemplation',
        npcAnchors: [],
        culturalBeliefs: ['Sapinya sudah dibeli mahal, sayang kalau tidak dipotong', 'Daging sapi mati mendadak masih bisa dimakan kalau dimasak'],
        ukpBridge: { failOutcomes: ['anthrax'], failProbability: 0.4, delayDays: { min: 1, max: 7 } },
        triggerConditions: { minDay: 1, season: null, probability: 0.02, nearEvent: 'idul_adha' },
        isEmergingEvent: true,
        urgency: 'critical'
    },
    {
        id: 'bc_malaria_import',
        tier: 3,
        title: '🚨 Warga Pulang dari Papua Demam Menggigil',
        disease: 'malaria_vivax',
        icon: '🦟',
        category: 'penyakit_menular',
        targetBehavior: 'Lapor riwayat perjalanan, RDT, profilaksis, kelambu',
        comBBarriers: { cap_psy: 0.6, opp_phy: 0.5, mot_ref: 0.4 },
        primaryBarriers: ['cap_psy', 'opp_phy'],
        bestInterventions: ['education', 'enablement'],
        readinessStart: 'contemplation',
        npcAnchors: [],
        culturalBeliefs: ['Malaria cuma ada di Papua, di sini aman', 'Demam biasa kok, minum paracetamol aja'],
        ukpBridge: { failOutcomes: ['malaria_vivax'], failProbability: 0.6, delayDays: { min: 3, max: 14 } },
        triggerConditions: { minDay: 14, season: null, probability: 0.03 },
        isEmergingEvent: true,
        urgency: 'high'
    },
    {
        id: 'bc_pertussis_cluster',
        tier: 3,
        title: '🚨 Bayi Batuk 100 Hari di Posyandu',
        disease: 'pertussis',
        icon: '🤧',
        category: 'penyakit_menular',
        targetBehavior: 'DPT booster, etika batuk, isolasi kasus',
        comBBarriers: { cap_psy: 0.5, opp_soc: 0.7, mot_ref: 0.6 },
        primaryBarriers: ['opp_soc', 'mot_ref'],
        bestInterventions: ['education', 'persuasion'],
        readinessStart: 'contemplation',
        npcAnchors: [],
        culturalBeliefs: ['Batuk biasa kok, bukan pertusis', 'Vaksin DPT sudah 1x kan cukup'],
        ukpBridge: { failOutcomes: ['pertussis'], failProbability: 0.5, delayDays: { min: 7, max: 30 } },
        triggerConditions: { minDay: 21, season: null, probability: 0.04, condition: 'dptCoverage < 0.80' },
        isEmergingEvent: true,
        urgency: 'high'
    },
    {
        id: 'bc_hep_a_klb',
        tier: 3,
        title: '🚨 Warga Kuning Setelah Hajatan',
        disease: 'hepatitis_a',
        icon: '🦠',
        category: 'penyakit_menular',
        targetBehavior: 'Vaksin Hep A, sanitasi air, investigasi sumber kontaminasi',
        comBBarriers: { cap_psy: 0.6, opp_phy: 0.7, mot_ref: 0.4 },
        primaryBarriers: ['opp_phy', 'cap_psy'],
        bestInterventions: ['education', 'environmental', 'enablement'],
        readinessStart: 'contemplation',
        npcAnchors: [],
        culturalBeliefs: ['Kuning itu masuk angin biasa', 'Makanan hajatan pasti sudah bersih'],
        ukpBridge: { failOutcomes: ['hepatitis_a'], failProbability: 0.5, delayDays: { min: 7, max: 28 } },
        triggerConditions: { minDay: 14, season: 'rainy', probability: 0.04 },
        isEmergingEvent: true,
        urgency: 'high'
    }
];

// ═══════════════════════════════════════════════════════════════
// TIER 4: TROPICAL ENVIRONMENTAL (Background, seasonal)
// ═══════════════════════════════════════════════════════════════

const TIER_4_ENVIRONMENTAL = [
    {
        id: 'bc_rabies',
        tier: 4,
        title: 'Anak Digigit Anjing Liar',
        disease: 'rabies',
        icon: '🐕',
        category: 'zoonosis',
        targetBehavior: 'Vaksinasi hewan, cuci luka sabun 15 menit, ke faskes <24 jam',
        comBBarriers: { cap_psy: 0.8, opp_phy: 0.5, mot_ref: 0.4 },
        primaryBarriers: ['cap_psy'],
        bestInterventions: ['education', 'enablement'],
        readinessStart: 'contemplation',
        npcAnchors: [],
        culturalBeliefs: ['Anjing kampung tidak bisa rabies', 'Gigitan anjing tinggal dioles minyak tawon'],
        ukpBridge: { failOutcomes: ['rabies'], failProbability: 0.1, delayDays: { min: 14, max: 90 } },
        triggerConditions: { minDay: 5, season: null, probability: 0.02 },
        seasonalModifier: null
    },
    {
        id: 'bc_pestisida',
        tier: 4,
        title: 'Petani Keracunan Pestisida',
        disease: 'keracunan_makanan',
        icon: '🧪',
        category: 'lingkungan',
        targetBehavior: 'APD (masker, sarung tangan), baca label, simpan jauh dari makanan/anak',
        comBBarriers: { cap_psy: 0.7, opp_phy: 0.6, mot_ref: 0.4 },
        primaryBarriers: ['cap_psy', 'opp_phy'],
        bestInterventions: ['education', 'training', 'enablement'],
        readinessStart: 'contemplation',
        npcAnchors: ['kk_12', 'kk_19'],
        culturalBeliefs: ['Pestisida itu cuma bau, tidak berbahaya', 'APD bikin susah gerak di sawah'],
        ukpBridge: { failOutcomes: ['keracunan_makanan'], failProbability: 0.4, delayDays: { min: 0, max: 1 } },
        triggerConditions: { minDay: 3, season: 'dry', probability: 0.05 },
        seasonalModifier: 'musim_tanam'
    },
    {
        id: 'bc_diare_banjir',
        tier: 4,
        title: 'Banjir Datang, Warga Diare Massal',
        disease: 'acute_gastroenteritis',
        icon: '🌊',
        category: 'lingkungan',
        targetBehavior: 'Masak air, jangan main banjir, ORS, klorinasi sumur pasca-banjir',
        comBBarriers: { cap_psy: 0.5, opp_phy: 0.9, mot_aut: 0.6 },
        primaryBarriers: ['opp_phy'],
        bestInterventions: ['education', 'enablement', 'environmental'],
        readinessStart: 'contemplation',
        npcAnchors: [],
        culturalBeliefs: ['Air banjir itu cuma kotor, bukan bisa bikin sakit', 'Sumur sudah bersih setelah banjir surut'],
        ukpBridge: { failOutcomes: ['diare_akut_non_spesifik', 'leptospirosis_ringan'], failProbability: 0.6, delayDays: { min: 1, max: 5 } },
        triggerConditions: { minDay: 1, season: 'rainy', probability: 0.08 },
        seasonalModifier: 'musim_hujan'
    }
];

// ═══════════════════════════════════════════════════════════════
// COMBINED EXPORT
// ═══════════════════════════════════════════════════════════════

export const DISEASE_SCENARIOS = [
    ...TIER_1_CORE,
    ...TIER_2_IMPORTANT,
    ...TIER_3_EMERGING,
    ...TIER_4_ENVIRONMENTAL
];

/**
 * Get scenarios by tier
 * @param {number} tier - Tier number (1-4)
 * @returns {Array} Scenarios matching the tier
 */
export function getScenariosByTier(tier) {
    return DISEASE_SCENARIOS.filter(s => s.tier === tier);
}

/**
 * Get scenario by ID
 * @param {string} id - Scenario ID
 * @returns {Object|undefined}
 */
export function getDiseaseScenarioById(id) {
    return DISEASE_SCENARIOS.find(s => s.id === id);
}

/**
 * Get emerging events eligible to trigger
 * @param {number} day - Current game day
 * @param {string} season - Current season
 * @returns {Array} Eligible emerging event scenarios
 */
export function getEligibleEmergingEvents(day, season) {
    return TIER_3_EMERGING.filter(s => {
        if (s.triggerConditions.minDay && day < s.triggerConditions.minDay) return false;
        if (s.triggerConditions.season && s.triggerConditions.season !== season) return false;
        return Math.random() < (s.triggerConditions.probability || 0.05);
    });
}

/**
 * Get environmental risks for current season
 * @param {string} season - 'rainy' or 'dry'
 * @returns {Array} Active environmental risk scenarios
 */
export function getSeasonalEnvironmentalRisks(season) {
    return TIER_4_ENVIRONMENTAL.filter(s => {
        if (!s.triggerConditions.season) return true; // year-round
        return s.triggerConditions.season === season;
    });
}

export default {
    DISEASE_SCENARIOS,
    COM_B_LABELS,
    READINESS_STAGES,
    INTERVENTION_FUNCTIONS,
    getScenariosByTier,
    getDiseaseScenarioById,
    getEligibleEmergingEvents,
    getSeasonalEnvironmentalRisks
};
