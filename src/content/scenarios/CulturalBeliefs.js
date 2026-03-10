/**
 * @reflection
 * [IDENTITY]: CulturalBeliefs.js
 * [PURPOSE]: Database of Indonesian cultural beliefs, superstitions, and traditional
 *            practices that affect health-seeking behavior. Used by IKMEventEngine
 *            and PatientGenerator to create personality-driven scenarios.
 * [STATE]: Stable
 * [ANCHOR]: CULTURAL_BELIEFS
 * [DEPENDS_ON]: None
 */

// ═══════════════════════════════════════════════════════════════
// BELIEF CATEGORIES
// ═══════════════════════════════════════════════════════════════

export const BELIEF_CATEGORIES = {
    TRADITIONAL_MEDICINE: 'traditional_medicine',
    SUPERNATURAL: 'supernatural',
    DIETARY: 'dietary',
    CHILDBIRTH: 'childbirth',
    VACCINE_HESITANCY: 'vaccine_hesitancy'
};

// ═══════════════════════════════════════════════════════════════
// CULTURAL BELIEFS DATABASE
// ═══════════════════════════════════════════════════════════════

export const CULTURAL_BELIEFS = [
    // ── Traditional Medicine ──────────────────────────────
    {
        id: 'jamu_heals_all',
        category: BELIEF_CATEGORIES.TRADITIONAL_MEDICINE,
        name: 'Jamu Menyembuhkan Segalanya',
        description: 'Percaya jamu tradisional bisa menyembuhkan semua penyakit, termasuk penyakit berat.',
        prevalence: 0.35,
        riskLevel: 'moderate',
        healthImpact: {
            delayTreatment: true,
            drugInteraction: true,
            conditions: ['dm_tipe2', 'hipertensi', 'gastritis_akut']
        },
        counterStrategy: 'Jelaskan jamu boleh sebagai pelengkap, bukan pengganti obat medis. Tanyakan jamu apa yang diminum — beberapa mengandung steroid tersembunyi.',
        dialogSample: '"Saya sudah minum jamu kunyit asem, Dok. Pasti sembuh."'
    },
    {
        id: 'kerokan_cure',
        category: BELIEF_CATEGORIES.TRADITIONAL_MEDICINE,
        name: 'Kerokan Obat Masuk Angin',
        description: 'Mengerok kulit dengan koin/benda tumpul untuk mengeluarkan "angin" dari tubuh.',
        prevalence: 0.60,
        riskLevel: 'low',
        healthImpact: {
            delayTreatment: false,
            skinInjury: true,
            conditions: []
        },
        counterStrategy: 'Tidak perlu dilarang untuk dewasa. Untuk bayi/anak kecil: jelaskan kulit mereka terlalu tipis. Gunakan analogi yang dimengerti.',
        dialogSample: '"Sudah dikerokin tapi masih meriang, Dok."'
    },
    {
        id: 'pijat_urut',
        category: BELIEF_CATEGORIES.TRADITIONAL_MEDICINE,
        name: 'Pijat/Urut untuk Patah Tulang',
        description: 'Membawa patah tulang ke tukang urut/pijat alih-alih ke dokter.',
        prevalence: 0.25,
        riskLevel: 'high',
        healthImpact: {
            delayTreatment: true,
            worsenCondition: true,
            conditions: ['fraktur']
        },
        counterStrategy: 'Tunjukkan foto rontgen fraktur yang malunion. Jelaskan risiko cacat permanen. Tawarkan kolaborasi: dokter pasang gips, tukang urut bantu pemulihan setelah.',
        dialogSample: '"Kata Mbah Karjo tinggal diurut aja, nanti nyambung sendiri."'
    },
    {
        id: 'tolak_bala',
        category: BELIEF_CATEGORIES.TRADITIONAL_MEDICINE,
        name: 'Tolak Bala / Jimat',
        description: 'Memakai jimat atau melakukan ritual tolak bala untuk mencegah penyakit.',
        prevalence: 0.20,
        riskLevel: 'low',
        healthImpact: {
            delayTreatment: false,
            conditions: []
        },
        counterStrategy: 'Tidak perlu dilarang. Hormati sebagai keyakinan spiritual. Pastikan tidak menggantikan vaksinasi atau pengobatan medis.',
        dialogSample: '"Saya sudah pasang susuk, Dok. Insya Allah nggak sakit."'
    },

    // ── Supernatural Beliefs ─────────────────────────────
    {
        id: 'angin_duduk',
        category: BELIEF_CATEGORIES.SUPERNATURAL,
        name: 'Angin Duduk',
        description: 'Mengaitkan nyeri dada atau sesak napas dengan "angin duduk" alih-alih kondisi jantung.',
        prevalence: 0.45,
        riskLevel: 'critical',
        healthImpact: {
            delayTreatment: true,
            missDiagnosis: true,
            conditions: ['angina_pektoris', 'ami_stemi', 'gagal_jantung']
        },
        counterStrategy: 'Sangat berbahaya! "Angin duduk" bisa jadi serangan jantung. Jelaskan: nyeri dada + sesak + keringat dingin = HARUS ke dokter SEGERA.',
        dialogSample: '"Biasa aja, Dok. Cuma angin duduk. Sudah minum tolak angin."'
    },
    {
        id: 'guna_guna',
        category: BELIEF_CATEGORIES.SUPERNATURAL,
        name: 'Guna-guna / Santet',
        description: 'Percaya bahwa penyakit disebabkan oleh ilmu hitam atau guna-guna dari orang lain.',
        prevalence: 0.15,
        riskLevel: 'high',
        healthImpact: {
            delayTreatment: true,
            seekDukun: true,
            conditions: ['kanker', 'penyakit_kronis']
        },
        counterStrategy: 'Jangan menyudutkan kepercayaan. Tawarkan: "Boleh minta didoakan, tapi sambil diobati juga ya, biar dari dua arah."',
        dialogSample: '"Ini pasti kiriman orang, Dok. Saya mau ke dukun dulu."'
    },
    {
        id: 'kesurupan',
        category: BELIEF_CATEGORIES.SUPERNATURAL,
        name: 'Kesurupan / Jin Masuk',
        description: 'Menjelaskan gejala psikiatrik atau konversi sebagai kerasukan jin.',
        prevalence: 0.30,
        riskLevel: 'moderate',
        healthImpact: {
            delayTreatment: true,
            conditions: ['gangguan_konversi', 'mass_psychogenic_illness']
        },
        counterStrategy: 'Pendekatan cultural bridge: "Saya hormati keyakinannya, tapi saya juga perlu periksa dari sisi medis." Libatkan tokoh agama jika perlu.',
        dialogSample: '"Anak saya kesurupan, Dok! Matanya melotot, badannya kaku!"'
    },

    // ── Dietary Beliefs ──────────────────────────────────
    {
        id: 'pantang_makan',
        category: BELIEF_CATEGORIES.DIETARY,
        name: 'Pantang Makanan Saat Sakit',
        description: 'Menghindari ikan, telur, atau daging saat sakit karena dianggap "amis" bikin lama sembuh.',
        prevalence: 0.40,
        riskLevel: 'moderate',
        healthImpact: {
            malnutrition: true,
            delayRecovery: true,
            conditions: ['demam', 'pasca_operasi', 'luka']
        },
        counterStrategy: 'Jelaskan: protein (ikan, telur) justru mempercepat penyembuhan. "Ibarat tukang bangunan, butuh batu bata (protein) untuk membangun kembali."',
        dialogSample: '"Nggak berani makan ikan, Dok. Nanti lukanya amis, lama sembuh."'
    },
    {
        id: 'mpasi_dini',
        category: BELIEF_CATEGORIES.DIETARY,
        name: 'MP-ASI Terlalu Dini',
        description: 'Memberikan pisang, bubur, atau madu pada bayi di bawah 6 bulan.',
        prevalence: 0.35,
        riskLevel: 'high',
        healthImpact: {
            malnutrition: true,
            diarrhea: true,
            conditions: ['diare_akut']
        },
        counterStrategy: '"Usus bayi di bawah 6 bulan belum siap cerna makanan padat. ASI saja sudah lengkap gizinya." Libatkan nenek/mertua dalam edukasi.',
        dialogSample: '"Kata ibu saya, bayinya kurang kenyang kalau cuma ASI."'
    },

    // ── Childbirth Beliefs ───────────────────────────────
    {
        id: 'dukun_beranak',
        category: BELIEF_CATEGORIES.CHILDBIRTH,
        name: 'Lebih Percaya Dukun Beranak',
        description: 'Memilih melahirkan di dukun beranak alih-alih bidan/puskesmas.',
        prevalence: 0.15,
        riskLevel: 'critical',
        healthImpact: {
            maternalDeath: true,
            neonatalDeath: true,
            conditions: ['perdarahan_postpartum', 'preeklampsia', 'sepsis_nifas']
        },
        counterStrategy: 'Pendekatan kemitraan: ajak dukun bermitra dengan bidan. Hormati peran spiritual dukun sambil pastikan bidan yang tangani persalinan medis.',
        dialogSample: '"Saya sudah 3 kali lahiran di Mbah Parti, aman-aman aja."'
    },
    {
        id: 'pantang_nifas',
        category: BELIEF_CATEGORIES.CHILDBIRTH,
        name: 'Pantang Nifas Berlebihan',
        description: 'Ibu nifas dilarang makan ikan/protein dan harus "menutup" tubuh 40 hari.',
        prevalence: 0.30,
        riskLevel: 'moderate',
        healthImpact: {
            malnutrition: true,
            dvt: true,
            conditions: ['anemia_defisiensi_besi']
        },
        counterStrategy: 'Jelaskan ibu menyusui butuh protein ekstra. "Makan ikan biar ASI banyak dan bergizi." Untuk aktivitas, boleh istirahat tapi jangan tiduran total.',
        dialogSample: '"Saya nggak boleh makan ikan 40 hari, Dok. Kata ibu mertua."'
    },

    // ── Vaccine Hesitancy ────────────────────────────────
    {
        id: 'vaksin_haram',
        category: BELIEF_CATEGORIES.VACCINE_HESITANCY,
        name: 'Vaksin Haram',
        description: 'Percaya vaksin mengandung bahan haram dan tidak boleh diberikan.',
        prevalence: 0.10,
        riskLevel: 'critical',
        healthImpact: {
            outbreakRisk: true,
            conditions: ['campak', 'difteri', 'polio']
        },
        counterStrategy: 'Tunjukkan Fatwa MUI No. 04/2016 tentang kehalalan vaksin. Libatkan tokoh agama setempat. KIE pentingnya herd immunity.',
        dialogSample: '"Saya nggak mau anak saya divaksin, itu haram."'
    },
    {
        id: 'vaksin_autisme',
        category: BELIEF_CATEGORIES.VACCINE_HESITANCY,
        name: 'Vaksin Menyebabkan Autisme',
        description: 'Percaya vaksin MMR menyebabkan autisme berdasarkan hoax internet.',
        prevalence: 0.08,
        riskLevel: 'high',
        healthImpact: {
            outbreakRisk: true,
            conditions: ['campak', 'rubella']
        },
        counterStrategy: 'Jelaskan penelitian Andrew Wakefield sudah dicabut dan dibuktikan palsu. Tunjukkan data jutaan anak divaksin tanpa autisme.',
        dialogSample: '"Saya baca di internet, vaksin bikin autis, Dok."'
    }
];

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get beliefs by category
 */
export function getBeliefsByCategory(categoryId) {
    return CULTURAL_BELIEFS.filter(b => b.category === categoryId);
}

/**
 * Get belief by ID
 */
export function getBeliefById(beliefId) {
    return CULTURAL_BELIEFS.find(b => b.id === beliefId);
}

/**
 * Get high-risk beliefs (that can delay treatment or cause harm)
 */
export function getHighRiskBeliefs() {
    return CULTURAL_BELIEFS.filter(b => b.riskLevel === 'critical' || b.riskLevel === 'high');
}

/**
 * Get beliefs relevant to a specific clinical condition
 * @param {string} conditionId - Clinical case ID
 * @returns {Array} Relevant beliefs
 */
export function getBeliefsForCondition(conditionId) {
    return CULTURAL_BELIEFS.filter(b =>
        b.healthImpact.conditions && b.healthImpact.conditions.includes(conditionId)
    );
}
