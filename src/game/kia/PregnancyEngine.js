/**
 * @reflection
 * [IDENTITY]: PregnancyEngine
 * [PURPOSE]: ANC tracking (K1-K4), risk scoring, random obstetric events, KB counseling, delivery simulation.
 * [STATE]: Experimental
 * [ANCHOR]: createANCPatient
 * [DEPENDS_ON]: None (pure logic)
 * [LAST_UPDATE]: 2026-02-18
 */

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const ANC_VISITS = {
    K1: { label: 'K1 (Kunjungan Pertama)', trimester: 1, weekRange: [0, 12], essentialChecks: ['berat_badan', 'tekanan_darah', 'tinggi_fundus', 'denyut_jantung_janin', 'hb', 'golongan_darah', 'protein_urin', 'gds', 'hiv', 'hbsag', 'sifilis'] },
    K2: { label: 'K2 (Trimester 2)', trimester: 2, weekRange: [13, 27], essentialChecks: ['berat_badan', 'tekanan_darah', 'tinggi_fundus', 'denyut_jantung_janin', 'hb'] },
    K3: { label: 'K3 (Trimester 3 Awal)', trimester: 3, weekRange: [28, 35], essentialChecks: ['berat_badan', 'tekanan_darah', 'tinggi_fundus', 'denyut_jantung_janin', 'hb', 'protein_urin', 'letak_janin'] },
    K4: { label: 'K4 (Trimester 3 Akhir)', trimester: 3, weekRange: [36, 40], essentialChecks: ['berat_badan', 'tekanan_darah', 'tinggi_fundus', 'denyut_jantung_janin', 'hb', 'protein_urin', 'letak_janin', 'rencana_persalinan'] }
};

const RISK_FACTORS = {
    age_too_young: { label: 'Usia < 20 tahun', weight: 2, check: (p) => p.age < 20 },
    age_too_old: { label: 'Usia > 35 tahun', weight: 2, check: (p) => p.age > 35 },
    grand_multipara: { label: 'Grande multipara (≥ 5 anak)', weight: 3, check: (p) => (p.parity || 0) >= 5 },
    short_stature: { label: 'Tinggi badan < 145 cm', weight: 2, check: (p) => (p.height || 160) < 145 },
    anemia: { label: 'Anemia (Hb < 11 g/dL)', weight: 2, check: (_, v) => (v?.hb || 12) < 11 },
    hypertension: { label: 'Hipertensi (TD ≥ 140/90)', weight: 3, check: (_, v) => (v?.systolic || 120) >= 140 },
    proteinuria: { label: 'Proteinuria positif', weight: 3, check: (_, v) => v?.proteinUrin === 'positif' },
    prev_csection: { label: 'Riwayat SC sebelumnya', weight: 2, check: (p) => p.prevCSection === true },
    prev_complication: { label: 'Riwayat komplikasi sebelumnya', weight: 2, check: (p) => p.prevComplication === true },
    twins: { label: 'Kehamilan kembar', weight: 3, check: (p) => p.twins === true },
    malpresentation: { label: 'Letak sungsang/lintang', weight: 2, check: (_, v) => v?.fetalPosition === 'sungsang' || v?.fetalPosition === 'lintang' },
    obesity: { label: 'Obesitas (BMI ≥ 30)', weight: 1, check: (p) => (p.bmi || 22) >= 30 },
};

const OBSTETRIC_EVENTS = [
    { id: 'preeclampsia_onset', label: 'Tanda Pre-eklampsia', triggerTrimester: [2, 3], riskThreshold: 4, probability: 0.15, description: 'TD naik + proteinuria + edema. Perlu monitoring ketat dan rujukan jika berat.' },
    { id: 'anemia_worsening', label: 'Anemia Memberat', triggerTrimester: [2, 3], riskThreshold: 2, probability: 0.2, description: 'Hb turun < 8 g/dL. Perlu tablet Fe dosis tinggi atau rujuk transfusi.' },
    { id: 'gdm_detected', label: 'Diabetes Gestasional', triggerTrimester: [2], riskThreshold: 2, probability: 0.08, description: 'GDS > 200 atau TTGO abnormal. Diet control + monitoring ketat.' },
    { id: 'placenta_previa', label: 'Curiga Plasenta Previa', triggerTrimester: [3], riskThreshold: 3, probability: 0.05, description: 'Perdarahan tanpa nyeri di trimester 3. RUJUK segera — jangan VT!' },
    { id: 'premature_labor', label: 'Tanda Persalinan Prematur', triggerTrimester: [3], riskThreshold: 3, probability: 0.1, description: 'Kontraksi teratur sebelum 37 minggu. Tokolitik + kortikosteroid + RUJUK.' },
    { id: 'iugr_suspected', label: 'Curiga IUGR', triggerTrimester: [2, 3], riskThreshold: 2, probability: 0.1, description: 'TFU tidak sesuai usia kehamilan. Monitor ketat pertumbuhan janin.' },
    { id: 'normal_progress', label: 'Kehamilan Normal', triggerTrimester: [1, 2, 3], riskThreshold: 0, probability: 0.6, description: 'Tidak ditemukan kelainan. Edukasi gizi, tanda bahaya, dan persiapan persalinan.' },
    { id: 'hyperemesis', label: 'Hiperemesis Gravidarum', triggerTrimester: [1], riskThreshold: 1, probability: 0.12, description: 'Mual muntah berlebihan dengan dehidrasi. Infus RL + antiemetik.' },
    { id: 'ektopik_suspicion', label: 'Curiga Kehamilan Ektopik', triggerTrimester: [1], riskThreshold: 2, probability: 0.03, description: 'Nyeri perut hebat + perdarahan trimester 1. RUJUK SEGERA — emergency!' },
];

const KB_METHODS = {
    pil_kb: { name: 'Pil KB Kombinasi', effectiveness: 91, duration: 'harian', sideEffects: ['mual', 'nyeri payudara', 'spotting'], contraindications: ['hipertensi', 'merokok_35plus', 'riwayat_dvt'] },
    suntik_1bln: { name: 'Suntik 1 Bulan (Cyclofem)', effectiveness: 94, duration: '1 bulan', sideEffects: ['perubahan_siklus', 'kenaikan_bb'], contraindications: ['hipertensi_berat'] },
    suntik_3bln: { name: 'Suntik 3 Bulan (DMPA)', effectiveness: 96, duration: '3 bulan', sideEffects: ['amenore', 'kenaikan_bb', 'osteoporosis_risk'], contraindications: [] },
    implant: { name: 'Implant (Implanon/Jadena)', effectiveness: 99, duration: '3 tahun', sideEffects: ['perubahan_siklus', 'spotting'], contraindications: [] },
    iud_copprt: { name: 'IUD Copper (CuT-380A)', effectiveness: 99, duration: '10 tahun', sideEffects: ['nyeri_haid', 'haid_banyak'], contraindications: ['infeksi_pelvis', 'kehamilan'] },
    kondom: { name: 'Kondom', effectiveness: 82, duration: 'per_penggunaan', sideEffects: [], contraindications: [] },
    mow: { name: 'MOW (Tubektomi)', effectiveness: 99.5, duration: 'permanen', sideEffects: ['risiko_operasi'], contraindications: [] },
    mop: { name: 'MOP (Vasektomi)', effectiveness: 99.8, duration: 'permanen', sideEffects: ['nyeri_lokal'], contraindications: [] },
};

export { ANC_VISITS, RISK_FACTORS, KB_METHODS };

// ═══════════════════════════════════════════════════════════════
// ANC PATIENT CREATION
// ═══════════════════════════════════════════════════════════════

/**
 * Create a new ANC patient with persistent tracking data
 * @param {Object} basePatient - Villager data { name, age, gender }
 * @param {Object} _villageData - For social context
 * @returns {Object} - ANC patient with pregnancy tracking fields
 */
export function createANCPatient(basePatient, _villageData = {}) {
    const gestationalWeek = Math.floor(Math.random() * 12) + 4; // 4-16 weeks at first visit
    const parity = Math.floor(Math.random() * 4); // 0-3 previous pregnancies
    const height = 145 + Math.floor(Math.random() * 20); // 145-165 cm
    const weight = 45 + Math.floor(Math.random() * 25); // 45-70 kg
    const bmi = Math.round((weight / ((height / 100) ** 2)) * 10) / 10;

    return {
        ...basePatient,
        gender: 'P',
        isANC: true,
        ancData: {
            gestationalWeek,
            edd: calculateEDD(gestationalWeek),
            gravida: parity + 1,
            parity,
            abortus: Math.random() < 0.1 ? 1 : 0,
            height,
            weightStart: weight,
            bmi,
            prevCSection: Math.random() < 0.12,
            prevComplication: Math.random() < 0.08,
            twins: Math.random() < 0.02,
            visits: [],
            riskScore: 0,
            riskFactors: [],
            currentEvents: [],
            kbChoice: null,
        }
    };
}

// ═══════════════════════════════════════════════════════════════
// ANC VISIT SIMULATION
// ═══════════════════════════════════════════════════════════════

/**
 * Simulate an ANC visit
 * @param {Object} patient - ANC patient from createANCPatient
 * @param {string} visitType - 'K1'|'K2'|'K3'|'K4'
 * @param {Object} doctorActions - { checksPerformed[], medicationsGiven[], educationTopics[] }
 * @returns {{ newParams, events[], riskScore, outcome, score, feedback }}
 */
export function simulateANCVisit(patient, visitType, doctorActions = {}) {
    const visitDef = ANC_VISITS[visitType];
    if (!visitDef) return { error: 'Jenis kunjungan tidak valid' };

    const anc = patient.ancData || {};
    const trimester = visitDef.trimester;

    // Generate visit parameters
    const visitParams = generateVisitParams(patient, visitType);

    // Re-evaluate risk factors
    const riskResult = evaluateRiskFactors(patient, visitParams);

    // Generate random events based on risk
    const events = generateRandomEvents(patient, trimester, riskResult.riskScore);

    // Score doctor's performance
    const checksPerformed = doctorActions.checksPerformed || [];
    const essentialDone = visitDef.essentialChecks.filter(c => checksPerformed.includes(c));
    const essentialMissed = visitDef.essentialChecks.filter(c => !checksPerformed.includes(c));
    const completeness = Math.round((essentialDone.length / visitDef.essentialChecks.length) * 100);

    let feedback;
    if (completeness === 100) feedback = '✅ Pemeriksaan ANC lengkap sesuai standar!';
    else if (completeness >= 70) feedback = `⚠️ ${essentialMissed.length} pemeriksaan esensial belum dilakukan: ${essentialMissed.join(', ')}`;
    else feedback = `❌ Banyak pemeriksaan belum dilakukan. Standar K1 minimal: ${visitDef.essentialChecks.join(', ')}`;

    // XP based on completeness
    const score = Math.round(completeness * 0.5 + (events.some(e => e.id !== 'normal_progress') && doctorActions.referralMade ? 20 : 0));

    // Record visit
    const visitRecord = {
        type: visitType,
        week: anc.gestationalWeek || 0,
        params: visitParams,
        events,
        completeness,
        timestamp: Date.now()
    };

    return {
        newParams: visitParams,
        events,
        riskScore: riskResult.riskScore,
        riskFactors: riskResult.factors,
        referralNeeded: riskResult.referralNeeded,
        outcome: events.length > 0 ? events[0] : { id: 'normal_progress', label: 'Kehamilan Normal' },
        score,
        feedback,
        checksCompleted: essentialDone,
        checksMissed: essentialMissed,
        visitRecord
    };
}

// ═══════════════════════════════════════════════════════════════
// RISK EVALUATION
// ═══════════════════════════════════════════════════════════════

/**
 * Evaluate risk factors for ANC patient
 * @param {Object} patient
 * @param {Object} visitParams - Current visit vitals/labs
 * @returns {{ riskLevel, riskScore, factors[], referralNeeded }}
 */
export function evaluateRiskFactors(patient, visitParams = {}) {
    const factors = [];
    let totalWeight = 0;

    // Merge root patient fields (age, etc.) with ancData for risk factor checks
    const checkData = { ...(patient.ancData || {}), age: patient.age };

    for (const [id, rf] of Object.entries(RISK_FACTORS)) {
        if (rf.check(checkData, visitParams)) {
            factors.push({ id, label: rf.label, weight: rf.weight });
            totalWeight += rf.weight;
        }
    }

    let riskLevel;
    if (totalWeight >= 6) riskLevel = 'tinggi';
    else if (totalWeight >= 3) riskLevel = 'sedang';
    else riskLevel = 'rendah';

    return {
        riskLevel,
        riskScore: totalWeight,
        factors,
        referralNeeded: riskLevel === 'tinggi'
    };
}

// ═══════════════════════════════════════════════════════════════
// RANDOM EVENTS
// ═══════════════════════════════════════════════════════════════

/**
 * Generate random obstetric events based on risk
 */
export function generateRandomEvents(patient, trimester, riskScore) {
    const triggered = [];

    for (const event of OBSTETRIC_EVENTS) {
        if (!event.triggerTrimester.includes(trimester)) continue;
        if (riskScore < event.riskThreshold) continue;

        const adjustedProb = event.probability * (1 + riskScore * 0.1);
        if (Math.random() < adjustedProb) {
            triggered.push({ ...event });
        }
    }

    // If no events triggered, add normal progress
    if (triggered.length === 0) {
        triggered.push(OBSTETRIC_EVENTS.find(e => e.id === 'normal_progress'));
    }

    return triggered;
}

// ═══════════════════════════════════════════════════════════════
// KB COUNSELING
// ═══════════════════════════════════════════════════════════════

/**
 * Process KB (contraception) counseling
 * @param {Object} patient
 * @param {string} methodId - KB method from KB_METHODS
 * @returns {{ eligible, method, effectiveness, sideEffects[], followUp, feedback }}
 */
export function processKBCounseling(patient, methodId) {
    const method = KB_METHODS[methodId];
    if (!method) return { eligible: false, feedback: 'Metode KB tidak dikenal' };

    // Check contraindications
    const contraindicated = method.contraindications.some(ci => {
        if (ci === 'hipertensi' && patient.ancData?.visits?.some(v => v.params?.systolic >= 140)) return true;
        if (ci === 'merokok_35plus' && patient.age >= 35) return true;
        return false;
    });

    if (contraindicated) {
        return {
            eligible: false,
            method: method.name,
            feedback: `⚠️ ${method.name} KONTRAINDIKASI untuk pasien ini. Pilih metode lain.`
        };
    }

    return {
        eligible: true,
        method: method.name,
        effectiveness: method.effectiveness,
        duration: method.duration,
        sideEffects: method.sideEffects,
        followUp: method.duration === 'permanen' ? 'Kontrol 1 minggu pasca tindakan' : `Kembali dalam ${method.duration}`,
        feedback: `✅ ${method.name} sesuai untuk pasien. Efektivitas ${method.effectiveness}%.`
    };
}

// ═══════════════════════════════════════════════════════════════
// DELIVERY SIMULATION
// ═══════════════════════════════════════════════════════════════

/**
 * Simulate delivery outcome based on risk profile
 * @param {Object} patient - ANC patient
 * @returns {{ outcome, babyHealth, complication, mode, feedback }}
 */
export function simulateDelivery(patient) {
    const risk = evaluateRiskFactors(patient);
    const roll = Math.random();

    let outcome, babyHealth, complication, mode;

    if (risk.riskLevel === 'tinggi') {
        if (roll < 0.3) {
            outcome = 'complicated'; mode = 'SC'; complication = 'Partus lama / distosia';
            babyHealth = roll < 0.1 ? 'NICU' : 'sehat';
        } else if (roll < 0.5) {
            outcome = 'complicated'; mode = 'pervaginam_assisted'; complication = 'Perdarahan postpartum';
            babyHealth = 'sehat';
        } else {
            outcome = 'normal'; mode = 'pervaginam'; complication = null;
            babyHealth = 'sehat';
        }
    } else if (risk.riskLevel === 'sedang') {
        if (roll < 0.15) {
            outcome = 'complicated'; mode = 'pervaginam'; complication = 'Retensio plasenta';
            babyHealth = 'sehat';
        } else {
            outcome = 'normal'; mode = 'pervaginam'; complication = null;
            babyHealth = 'sehat';
        }
    } else {
        outcome = 'normal'; mode = 'pervaginam'; complication = null;
        babyHealth = roll < 0.02 ? 'observasi' : 'sehat';
    }

    return {
        outcome,
        mode,
        babyHealth,
        complication,
        referralNeeded: outcome === 'complicated',
        feedback: outcome === 'normal'
            ? '✅ Persalinan normal pervaginam. Ibu dan bayi sehat.'
            : `⚠️ Komplikasi: ${complication}. ${mode === 'SC' ? 'Rujuk untuk SC.' : 'Tatalaksana segera.'}`
    };
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function calculateEDD(currentWeek) {
    const remainingWeeks = 40 - currentWeek;
    const eddDate = new Date();
    eddDate.setDate(eddDate.getDate() + remainingWeeks * 7);
    return eddDate.toISOString().split('T')[0];
}

function generateVisitParams(patient, _visitType) {
    const anc = patient.ancData || {};
    const baseWeight = anc.weightStart || 55;
    const weekGain = (anc.gestationalWeek || 12) * 0.4; // ~0.4 kg/week average

    return {
        weight: Math.round((baseWeight + weekGain) * 10) / 10,
        systolic: 100 + Math.floor(Math.random() * 35),
        diastolic: 60 + Math.floor(Math.random() * 25),
        hb: 10 + Math.random() * 3, // 10-13 g/dL
        fundusHeight: Math.max(10, (anc.gestationalWeek || 12) - 2 + Math.floor(Math.random() * 4)),
        fetalHeartRate: 120 + Math.floor(Math.random() * 40), // 120-160 bpm
        fetalPosition: Math.random() < 0.85 ? 'kepala' : (Math.random() < 0.7 ? 'sungsang' : 'lintang'),
        proteinUrin: Math.random() < 0.1 ? 'positif' : 'negatif',
        edema: Math.random() < 0.15
    };
}
