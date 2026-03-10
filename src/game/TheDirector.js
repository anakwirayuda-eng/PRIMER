/**
 * @reflection
 * [IDENTITY]: TheDirector.js
 * [PURPOSE]: AI Drama Director — dynamically adjusts game pacing based on player stress.
 *            Inspired by Left 4 Dead's AI Director. Prevents both burnout and boredom
 *            by modulating event probability and patient spawn rates.
 * [STATE]: Experimental
 * [ANCHOR]: evaluateDirectorState
 * [DEPENDS_ON]: useGameStore (reads player/clinical/publicHealth state)
 */

// ═══════════════════════════════════════════════════════════════
// TENSION THRESHOLDS
// ═══════════════════════════════════════════════════════════════

const STRESS_WEIGHTS = {
    queuePressure: 0.3,    // Long patient queue → high stress
    energyDrain: 0.25,     // Low energy → high stress
    reputationRisk: 0.15,  // Low reputation → medium stress
    outbreakActive: 0.2,   // Active outbreaks → high stress
    caseloadToday: 0.1     // Cases treated today → fatigue
};

const PACING_PROFILES = {
    mercy: {
        spawnMultiplier: 0.4,      // 60% fewer patients
        eventProbability: 0.05,    // Almost no new events
        giftChance: 0.3,           // 30% chance of gift (free supplies, volunteer help)
        label: 'Mercy Mode'
    },
    breathing: {
        spawnMultiplier: 0.7,
        eventProbability: 0.15,
        giftChance: 0.15,
        label: 'Breathing Room'
    },
    normal: {
        spawnMultiplier: 1.0,
        eventProbability: 0.25,
        giftChance: 0.05,
        label: 'Normal Pacing'
    },
    pressure: {
        spawnMultiplier: 1.3,
        eventProbability: 0.4,
        giftChance: 0,
        label: 'Pressure Rising'
    },
    crisis: {
        spawnMultiplier: 1.6,
        eventProbability: 0.6,
        giftChance: 0,
        label: 'Crisis Mode'
    }
};

// ═══════════════════════════════════════════════════════════════
// CORE: EVALUATE PLAYER STRESS LEVEL
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate a normalized stress score (0-100) from game state.
 * 
 * @param {Object} state - Partial game state
 * @param {number} state.queueLength - Current patient queue length
 * @param {number} state.emergencyQueueLength - Current emergency queue length
 * @param {number} state.energy - Player energy (0-100)
 * @param {number} state.reputation - Player reputation (0-100)
 * @param {number} state.activeOutbreakCount - Number of active outbreaks
 * @param {number} state.casesToday - Patients treated today
 * @returns {number} Stress score 0-100
 */
export function calculateStress(state) {
    const {
        queueLength = 0,
        emergencyQueueLength = 0,
        energy = 100,
        reputation = 50,
        activeOutbreakCount = 0,
        casesToday = 0
    } = state;

    // Normalize each factor to 0-100
    const queueStress = Math.min(100, (queueLength + emergencyQueueLength * 2) * 8);
    const energyStress = Math.max(0, 100 - energy);
    const repStress = Math.max(0, 100 - reputation * 2); // rep < 50 → stress rises
    const outbreakStress = Math.min(100, activeOutbreakCount * 40);
    const fatigueStress = Math.min(100, casesToday * 10);

    return Math.round(
        queueStress * STRESS_WEIGHTS.queuePressure +
        energyStress * STRESS_WEIGHTS.energyDrain +
        repStress * STRESS_WEIGHTS.reputationRisk +
        outbreakStress * STRESS_WEIGHTS.outbreakActive +
        fatigueStress * STRESS_WEIGHTS.caseloadToday
    );
}

// ═══════════════════════════════════════════════════════════════
// CORE: SELECT PACING PROFILE
// ═══════════════════════════════════════════════════════════════

/**
 * Determine pacing profile based on stress level.
 * 
 * @param {number} stressScore - 0-100 stress score
 * @returns {Object} Pacing profile with spawnMultiplier, eventProbability, giftChance
 */
export function selectPacingProfile(stressScore) {
    if (stressScore >= 80) return PACING_PROFILES.mercy;
    if (stressScore >= 60) return PACING_PROFILES.breathing;
    if (stressScore >= 35) return PACING_PROFILES.normal;
    if (stressScore >= 15) return PACING_PROFILES.pressure;
    return PACING_PROFILES.crisis; // Player is bored → dial up the heat!
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API: ONE-SHOT EVALUATOR
// ═══════════════════════════════════════════════════════════════

/**
 * The Director's verdict for this moment. Call once per game tick or morning briefing.
 * 
 * @param {Object} gameState - Current game state snapshot
 * @returns {{ stress: number, profile: Object, shouldSpawnEvent: boolean, shouldGift: boolean }}
 */
export function evaluateDirectorState(gameState) {
    const stress = calculateStress(gameState);
    const profile = selectPacingProfile(stress);

    // Roll dice for event and gift
    const eventRoll = Math.random();
    const giftRoll = Math.random();

    return {
        stress,
        profile,
        spawnMultiplier: profile.spawnMultiplier,
        shouldSpawnEvent: eventRoll < profile.eventProbability,
        shouldGift: giftRoll < profile.giftChance,
        label: profile.label
    };
}

/**
 * Generate a gift for mercy/breathing modes.
 * Called when shouldGift is true.
 * 
 * @returns {Object} Gift description
 */
export function generateDirectorGift() {
    const gifts = [
        { type: 'supplies', message: 'Kiriman bantuan obat dari Dinas Kesehatan Kabupaten!', impact: { balance: 500000 } },
        { type: 'volunteer', message: 'Seorang relawan mahasiswa FK datang membantu hari ini.', impact: { energy: 20 } },
        { type: 'morale', message: 'Surat ucapan terima kasih dari warga RT 03 meningkatkan semangat!', impact: { spirit: 25, reputation: 3 } },
        { type: 'donation', message: 'Sumbangan dari pengusaha lokal untuk operasional Puskesmas.', impact: { balance: 300000 } },
    ];
    return gifts[Math.floor(Math.random() * gifts.length)];
}

// ═══════════════════════════════════════════════════════════════
// UKP BRIDGE: THE GOLDEN LOOP (UKM Failure → UKP Consequence)
// ═══════════════════════════════════════════════════════════════

/**
 * Process failed/partial behavior change cases and determine if they spawn
 * UKP emergencies (the "karma loop" connecting preventive and clinical care).
 * 
 * Called each game day by the game loop. Reads completed BC cases with 
 * outcome 'failed' or 'partial', checks their ukpBridge data, and after 
 * the specified delay spawns clinical consequences.
 * 
 * @param {Array<Object>} completedCases - Array of completed behavior change cases
 *   Each case should have: { scenarioId, outcome, completedOnDay, scenario }
 * @param {number} currentDay - Current game day
 * @returns {Array<Object>} Array of UKP events to spawn
 *   Each event: { type, diseaseId, severity, source, message, reputationPenalty, delay }
 */
export function processUKPBridge(completedCases, currentDay) {
    const events = [];

    for (const caseData of completedCases) {
        // Only failed/partial outcomes trigger the bridge
        if (caseData.outcome !== 'failed' && caseData.outcome !== 'partial') continue;

        const bridge = caseData.scenario?.ukpBridge;
        if (!bridge) continue;

        // Calculate elapsed days since case completion
        const elapsed = currentDay - (caseData.completedOnDay || 0);
        const minDelay = bridge.delayDays?.min || 3;
        const maxDelay = bridge.delayDays?.max || 14;

        // Not yet in the danger window
        if (elapsed < minDelay) continue;
        // Past the max window — consequence already would have happened
        if (elapsed > maxDelay) continue;

        // Probability roll — increases linearly as we approach maxDelay
        const progressInWindow = (elapsed - minDelay) / (maxDelay - minDelay);
        const adjustedProbability = (bridge.failProbability || 0.5) * (0.5 + progressInWindow * 0.5);

        if (Math.random() > adjustedProbability) continue;

        // Failed outcomes map to severity
        const severityMap = {
            'failed': 'critical',
            'partial': 'moderate'
        };

        // Pick a random fail outcome from the bridge
        const outcomes = bridge.failOutcomes || [];
        const pickedOutcome = outcomes[Math.floor(Math.random() * outcomes.length)] || 'unknown_complication';

        // Generate the UKP emergency event
        events.push({
            type: 'ukp_bridge_consequence',
            diseaseId: pickedOutcome,
            severity: severityMap[caseData.outcome] || 'moderate',
            source: {
                scenarioId: caseData.scenarioId,
                scenarioTitle: caseData.scenario?.title || 'Kasus UKM',
                outcome: caseData.outcome,
                daysElapsed: elapsed
            },
            message: generateBridgeNarrative(caseData.scenario, pickedOutcome, caseData.outcome),
            reputationPenalty: caseData.outcome === 'failed' ? -5 : -2,
            isNightEmergency: pickedOutcome === 'perdarahan_postpartum' || 
                              pickedOutcome === 'dengue_df' || 
                              pickedOutcome === 'dbd_grade_1',
            spawnDay: currentDay
        });
    }

    return events;
}

/**
 * Generate a dramatic narrative for a UKP bridge consequence.
 * @param {Object} scenario - Original disease scenario
 * @param {string} outcome - The clinical outcome (e.g. 'dengue_df')
 * @param {string} caseOutcome - 'failed' or 'partial'
 * @returns {string} Narrative text
 */
function generateBridgeNarrative(scenario, outcome, caseOutcome) {
    const narratives = {
        'dengue_df': '🚨 [DARURAT IGD] Anak dari RT yang gagal PSN masuk dengan Dengue Shock Syndrome. Hematokrit 48%, trombosit anjlok. Stok RL menipis!',
        'dbd_grade_1': '🏥 [IGD] Pasien anak demam tinggi hari ke-4 dengan petekie. Suspek DHF Grade I. Akibat langsung kegagalan program PSN.',
        'tb_pulmonary': '🫁 [POLI] Kontak serumah pasien TB yang mangkir obat kini datang dengan batuk darah. Satu kegagalan UKM melahirkan pasien baru.',
        'scabies_infeksi': '🔬 [POLI] Infeksi sekunder (impetigo) pada keluarga yang gagal diobati serentak. Scabies menyebar ke 3 keluarga tetangga.',
        'impetigo': '🩹 [POLI] Impetigo krustosa pada anak — komplikasi scabies yang tidak ditangani komunitas.',
        'anemia_deficiency': '🩸 [POLI ANAK] Anak BB di bawah -3SD, pucat, perut buncit. Anemia defisiensi besi akibat cacingan kronik yang diabaikan.',
        'morbilli': '🔴 [DARURAT] Outbreak campak di SD — 8 anak demam + ruam. Komplikasi pneumonia pada 2 anak yang belum vaksin.',
        'pneumonia_bacterial': '🫁 [IGD ANAK] Pneumonia berat pasca-campak. Anak sesak napas, SpO2 88%. Rujukan RS segera!',
        'perdarahan_postpartum': '🩸 [DARURAT JAM 2 PAGI] Ibu melahirkan di dukun, perdarahan masif post-partum. Ambulans desa tersendat! Reputasi Puskesmas di ujung tanduk.',
        'sepsis_neonatal': '👶 [IGD NEONATUS] Bayi 3 hari demam tinggi, tali pusar dipotong bambu oleh dukun. Suspek tetanus neonatorum + sepsis.',
        'filariasis': '🦵 [POLI] Pasien datang dengan kaki bengkak (limfedema) — akibat menolak BELKAGA tahun lalu.',
        'leprosy': '🏥 [POLI] Pasien dengan deformitas jari — kusta yang terlambat terdeteksi karena stigma sosial.',
    };

    const fallback = `⚠️ [POLI/IGD] Konsekuensi klinis dari kegagalan program UKM: ${scenario?.title || 'Kasus tidak diketahui'}. Ini adalah akibat langsung dari kelalaian pencegahan.`;

    return narratives[outcome] || fallback;
}

export default {
    calculateStress,
    selectPacingProfile,
    evaluateDirectorState,
    generateDirectorGift,
    processUKPBridge,
    PACING_PROFILES
};
