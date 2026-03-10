/**
 * @reflection
 * [IDENTITY]: ProlanisDB
 * [PURPOSE]: ProlanisDB.js Database untuk Program Pengelolaan Penyakit Kronis (Prolanis) Fokus: DM Tipe 2 dan Hipertensi
 * [STATE]: Experimental
 * [ANCHOR]: PROLANIS_DISEASES
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * ProlanisDB.js
 * Database untuk Program Pengelolaan Penyakit Kronis (Prolanis)
 * Fokus: DM Tipe 2 dan Hipertensi
 */

// ═══════════════════════════════════════════════════════════════
// PROLANIS DISEASES & TARGETS
// ═══════════════════════════════════════════════════════════════

export const PROLANIS_DISEASES = {
    dm_type2: {
        id: 'dm_type2',
        name: 'Diabetes Mellitus Tipe 2',
        icd10: 'E11',
        emoji: '🩸',
        parameters: {
            hba1c: { name: 'HbA1c', unit: '%', target: { min: 0, max: 7 }, warning: 8, critical: 10 },
            gds: { name: 'Gula Darah Sewaktu', unit: 'mg/dL', target: { min: 70, max: 140 }, warning: 200, critical: 300 },
            gdp: { name: 'Gula Darah Puasa', unit: 'mg/dL', target: { min: 70, max: 126 }, warning: 150, critical: 200 }
        },
        complications: [
            { id: 'retinopathy', name: 'Retinopati Diabetik', riskThreshold: 80 },
            { id: 'nephropathy', name: 'Nefropati Diabetik', riskThreshold: 85 },
            { id: 'neuropathy', name: 'Neuropati Diabetik', riskThreshold: 70 },
            { id: 'diabetic_foot', name: 'Kaki Diabetik', riskThreshold: 90 },
            { id: 'stroke', name: 'Stroke', riskThreshold: 95 }
        ],
        firstLineMeds: ['metformin_500', 'metformin_850', 'glimepiride_1', 'glimepiride_2'],
        secondLineMeds: ['glibenclamide_5', 'acarbose_50', 'pioglitazone_15']
    },
    hypertension: {
        id: 'hypertension',
        name: 'Hipertensi Esensial',
        icd10: 'I10',
        emoji: '💓',
        parameters: {
            systolic: { name: 'Sistolik', unit: 'mmHg', target: { min: 90, max: 140 }, warning: 160, critical: 180 },
            diastolic: { name: 'Diastolik', unit: 'mmHg', target: { min: 60, max: 90 }, warning: 100, critical: 110 }
        },
        complications: [
            { id: 'stroke', name: 'Stroke', riskThreshold: 90 },
            { id: 'heart_failure', name: 'Gagal Jantung', riskThreshold: 85 },
            { id: 'ckd', name: 'Penyakit Ginjal Kronik', riskThreshold: 80 },
            { id: 'hypertensive_crisis', name: 'Krisis Hipertensi', riskThreshold: 95 }
        ],
        firstLineMeds: ['amlodipine_5', 'amlodipine_10', 'captopril_12.5', 'captopril_25'],
        secondLineMeds: ['lisinopril_5', 'lisinopril_10', 'bisoprolol_2.5', 'bisoprolol_5', 'hct_25']
    }
};

// ═══════════════════════════════════════════════════════════════
// RANDOM EVENTS (kejadian yang mempengaruhi parameter)
// ═══════════════════════════════════════════════════════════════

export const PROLANIS_EVENTS = [
    // Negative Events
    {
        id: 'hajatan',
        type: 'negative',
        name: 'Acara Hajatan',
        description: 'Pasien menghadiri acara keluarga dan makan banyak.',
        probability: 0.15,
        effects: { gds: +50, hba1c: +0.3, systolic: +10 },
        dialogue: "Dok, kemarin ada kondangan saudara, saya makan enak-enak..."
    },
    {
        id: 'forgot_meds',
        type: 'negative',
        name: 'Lupa Minum Obat',
        description: 'Pasien lupa minum obat selama beberapa hari.',
        probability: 0.12,
        effects: { gds: +40, hba1c: +0.2, systolic: +15, diastolic: +8 },
        dialogue: "Maaf dok, obatnya habis dan saya lupa beli..."
    },
    {
        id: 'stress',
        type: 'negative',
        name: 'Stres Keluarga',
        description: 'Pasien mengalami stres karena masalah keluarga.',
        probability: 0.10,
        effects: { gds: +30, systolic: +20, diastolic: +10 },
        dialogue: "Lagi banyak pikiran dok, anak mau nikah tapi biayanya belum cukup..."
    },
    {
        id: 'travel',
        type: 'negative',
        name: 'Traveling',
        description: 'Pasien bepergian jauh dan pola makan terganggu.',
        probability: 0.08,
        effects: { gds: +35, hba1c: +0.15 },
        dialogue: "Saya habis mudik dok, makan di jalan nggak teratur..."
    },
    {
        id: 'fasting',
        type: 'negative',
        name: 'Puasa Tanpa Konsultasi',
        description: 'Pasien berpuasa tanpa penyesuaian obat.',
        probability: 0.05,
        effects: { gds: -30, gdp: -25 }, // Hypoglycemia risk!
        dialogue: "Saya puasa dok tapi tetap minum obat seperti biasa, sempat lemas..."
    },
    // Positive Events
    {
        id: 'exercise_routine',
        type: 'positive',
        name: 'Rajin Olahraga',
        description: 'Pasien rutin berolahraga bulan ini.',
        probability: 0.10,
        effects: { gds: -20, hba1c: -0.2, systolic: -10, diastolic: -5 },
        dialogue: "Dok, saya jalan kaki tiap pagi sekarang, badan terasa lebih enak!"
    },
    {
        id: 'diet_success',
        type: 'positive',
        name: 'Diet Berhasil',
        description: 'Pasien berhasil mengikuti diet yang disarankan.',
        probability: 0.08,
        effects: { gds: -25, hba1c: -0.25, systolic: -5 },
        dialogue: "Saya sudah kurangi nasi dan gorengan dok, kata istri saya makin kurus!"
    },
    {
        id: 'quit_smoking',
        type: 'positive',
        name: 'Berhenti Merokok',
        description: 'Pasien berhasil berhenti merokok.',
        probability: 0.03,
        effects: { systolic: -15, diastolic: -8 },
        dialogue: "Alhamdulillah dok, sudah sebulan nggak ngerokok!"
    }
];

// ═══════════════════════════════════════════════════════════════
// MILESTONES & ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════

export const PROLANIS_MILESTONES = [
    {
        id: 'first_enrollment',
        name: 'Peserta Baru',
        description: 'Mendaftarkan pasien pertama ke Prolanis',
        xpReward: 50,
        icon: '🎫',
        condition: (stats) => stats.totalEnrolled >= 1
    },
    {
        id: 'controlled_3mo',
        name: 'Terkontrol 3 Bulan',
        description: 'Pasien terkontrol selama 3 bulan berturut-turut',
        xpReward: 100,
        icon: '🏅',
        condition: (patient) => patient.consecutiveControlled >= 3
    },
    {
        id: 'controlled_6mo',
        name: 'Setengah Tahun Sukses',
        description: 'Pasien terkontrol selama 6 bulan berturut-turut',
        xpReward: 250,
        icon: '🥈',
        condition: (patient) => patient.consecutiveControlled >= 6
    },
    {
        id: 'controlled_12mo',
        name: 'Satu Tahun Bebas Komplikasi',
        description: 'Pasien terkontrol selama 12 bulan berturut-turut!',
        xpReward: 500,
        icon: '🏆',
        condition: (patient) => patient.consecutiveControlled >= 12
    },
    {
        id: 'club_10',
        name: 'Prolanis Club 10',
        description: 'Memiliki 10 pasien Prolanis aktif',
        xpReward: 200,
        icon: '👥',
        condition: (stats) => stats.activePatients >= 10
    },
    {
        id: 'zero_complications',
        name: 'Tanpa Komplikasi',
        description: 'Tidak ada pasien yang mengalami komplikasi dalam 1 tahun',
        xpReward: 1000,
        icon: '⭐',
        condition: (stats) => stats.complicationsThisYear === 0 && stats.monthsPlayed >= 12
    }
];

// ═══════════════════════════════════════════════════════════════
// LIFESTYLE EDUCATION OPTIONS (Prolanis-specific)
// ═══════════════════════════════════════════════════════════════

export const PROLANIS_EDUCATION = [
    // DM-specific
    { id: 'diet_dm', label: 'Edukasi diet DM (3J: Jumlah, Jadwal, Jenis)', disease: 'dm_type2', effect: { hba1c: -0.1, gds: -10 } },
    { id: 'foot_care', label: 'Perawatan kaki diabetik', disease: 'dm_type2', effect: { complicationRisk: -5 } },
    { id: 'hypoglycemia_awareness', label: 'Kenali tanda hipoglikemia', disease: 'dm_type2', effect: { compliance: +10 } },
    { id: 'insulin_education', label: 'Edukasi penggunaan insulin', disease: 'dm_type2', effect: { compliance: +15 } },

    // HT-specific
    { id: 'diet_ht', label: 'Diet rendah garam (DASH)', disease: 'hypertension', effect: { systolic: -5, diastolic: -3 } },
    { id: 'bp_monitoring', label: 'Cara mengukur tekanan darah di rumah', disease: 'hypertension', effect: { compliance: +10 } },
    { id: 'medication_timing', label: 'Waktu minum obat yang tepat', disease: 'hypertension', effect: { systolic: -3 } },

    // General
    { id: 'exercise_prolanis', label: 'Senam Prolanis rutin', disease: 'all', effect: { gds: -15, systolic: -8, diastolic: -5 } },
    { id: 'stress_management', label: 'Manajemen stres', disease: 'all', effect: { systolic: -5, gds: -10 } },
    { id: 'smoking_cessation', label: 'Berhenti merokok', disease: 'all', effect: { systolic: -10, complicationRisk: -10 } },
    { id: 'weight_management', label: 'Manajemen berat badan', disease: 'all', effect: { hba1c: -0.2, systolic: -5 } }
];

// ═══════════════════════════════════════════════════════════════
// MEDICATION ADJUSTMENT OPTIONS
// ═══════════════════════════════════════════════════════════════

export const MEDICATION_ACTIONS = {
    increase_dose: { label: 'Naikkan dosis', effect: { paramChange: -15 }, riskIncrease: 0 },
    decrease_dose: { label: 'Turunkan dosis', effect: { paramChange: +10 }, riskIncrease: 0 },
    add_medication: { label: 'Tambah obat baru', effect: { paramChange: -25 }, riskIncrease: 5 },
    switch_medication: { label: 'Ganti obat', effect: { paramChange: -20 }, riskIncrease: 3 },
    maintain: { label: 'Pertahankan', effect: { paramChange: 0 }, riskIncrease: 0 },
    refer_specialist: { label: 'Rujuk ke Sp.PD', effect: { paramChange: -30 }, isReferral: true }
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Check if parameter is within target range
 */
export function isParameterControlled(disease, paramName, value) {
    const param = PROLANIS_DISEASES[disease]?.parameters[paramName];
    if (!param) return false;
    return value >= param.target.min && value <= param.target.max;
}

/**
 * Get parameter status (controlled, warning, critical)
 */
export function getParameterStatus(disease, paramName, value) {
    const param = PROLANIS_DISEASES[disease]?.parameters[paramName];
    if (!param) return 'unknown';

    if (value >= param.target.min && value <= param.target.max) return 'controlled';
    if (value >= param.critical || value < param.target.min * 0.7) return 'critical';
    if (value >= param.warning) return 'warning';
    return 'uncontrolled';
}

/**
 * Roll for a random event
 */
export function rollRandomEvent() {
    const roll = Math.random();
    let cumulative = 0;

    for (const event of PROLANIS_EVENTS) {
        cumulative += event.probability;
        if (roll < cumulative) {
            return event;
        }
    }
    return null; // No event this month
}

/**
 * Get parameter trend from history
 */
export function getParameterTrend(history, paramName) {
    if (!history || history.length < 2) return 'stable';

    const recent = history[history.length - 1]?.parameters?.[paramName];
    const previous = history[history.length - 2]?.parameters?.[paramName];

    if (recent === undefined || previous === undefined) return 'stable';

    const diff = recent - previous;
    const threshold = Math.abs(previous * 0.05); // 5% change threshold

    if (diff < -threshold) return 'improving';
    if (diff > threshold) return 'worsening';
    return 'stable';
}
