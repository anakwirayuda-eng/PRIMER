/**
 * @reflection
 * [IDENTITY]: BehaviorCaseEngine.js
 * [PURPOSE]: Core engine for UKM Behavior Change cases. Manages the lifecycle
 *            of behavior change interventions: case creation, COM-B diagnosis
 *            scoring, intervention matching, probabilistic outcome resolution,
 *            and UKM→UKP bridge patient generation.
 * [STATE]: Experimental
 * [ANCHOR]: createBehaviorCase
 * [DEPENDS_ON]: DiseaseScenarios, IKMEventEngine, VillageRegistry
 */

import {
    DISEASE_SCENARIOS,
    READINESS_STAGES,
    INTERVENTION_FUNCTIONS,
    getDiseaseScenarioById,
    getSeasonalEnvironmentalRisks
} from '../content/scenarios/DiseaseScenarios.js';
import { getSeasonForDay } from './IKMEventEngine.js';
import { evaluateEmergingTriggers } from './EmergingEventTriggers.js';
import { getFamilySDOH } from '../domains/village/VillageRegistry.js';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const MAX_ACTIVE_CASES = 3;

const SCORE_THRESHOLDS = {
    excellent: 85,
    good: 65,
    partial: 40,
    fail: 0
};

const CASE_MODES = {
    quick: { phases: 3, maxMinutes: 4, label: 'Kunjungan Singkat' },
    deep: { phases: 6, maxMinutes: 12, label: 'Kasus Mendalam' }
};

// 🌟 HACK: SDOH ARMOR — Semakin buruk kondisi sosio-ekonomi, semakin tebal resistensi keluarga
function calculateResistance(sdoh) {
    let res = 0;
    if (!sdoh) return res;
    if (sdoh.education === 'low' || sdoh.education === 'Rendah') res += 12;
    if (sdoh.economic === 'low' || sdoh.economicStatus === 'Miskin') res += 12;
    if (sdoh.sanitation === 'poor' || (sdoh.sanitationIndex != null && sdoh.sanitationIndex < 0.5)) res += 8;
    return res; // Max 32 resistensi pasif
}

// ═══════════════════════════════════════════════════════════════
// CASE LIFECYCLE
// ═══════════════════════════════════════════════════════════════

/**
 * Create a new behavior change case from a disease scenario.
 *
 * @param {string} scenarioId - ID from DiseaseScenarios
 * @param {string} mode - 'quick' or 'deep'
 * @param {number} gameDay - Current game day
 * @param {Object} [familyContext] - Family SDOH and indicators from VillageRegistry
 * @returns {Object|null} New behavior case instance
 */
export function createBehaviorCase(scenarioId, mode, gameDay, familyContext = null) {
    const scenario = getDiseaseScenarioById(scenarioId);
    if (!scenario) return null;

    const caseMode = CASE_MODES[mode] || CASE_MODES.quick;

    return {
        instanceId: `bc_${scenarioId}_d${gameDay}_${Date.now()}`,
        scenarioId,
        mode,
        title: scenario.title,
        icon: scenario.icon,
        disease: scenario.disease,
        category: scenario.category,
        startDay: gameDay,
        completed: false,

        // Phase tracking
        currentPhase: 'investigation',
        phasesCompleted: [],
        availablePhases: mode === 'deep'
            ? ['investigation', 'diagnosis', 'planning', 'intervention', 'followup', 'evaluation']
            : ['investigation', 'intervention', 'evaluation'],

        // COM-B diagnosis
        comBDiagnosis: {
            playerIdentified: {},    // What player identified
            actual: scenario.comBBarriers, // Ground truth
            score: 0
        },

        // Intervention
        interventionChosen: null,
        interventionScore: 0,

        // Readiness tracking
        readinessStart: scenario.readinessStart,
        readinessCurrent: scenario.readinessStart,

        // Investigation findings
        cluesFound: [],
        totalClues: scenario.investigationClues?.length || 0,

        // Scoring
        overallScore: 0,
        xpEarned: 0,
        reputationDelta: 0,

        // 🌟 SDOH Armor — higher resistance = harder to educate
        familyResistance: calculateResistance(familyContext?.sdoh),

        // UKP Bridge
        ukpTriggered: false,
        ukpPatientId: null,

        // Family context
        familyId: familyContext?.familyId || (scenario.npcAnchors?.[0] || null),
        familySDOH: familyContext?.sdoh || null,

        // Timestamps
        createdAt: Date.now()
    };
}

// ═══════════════════════════════════════════════════════════════
// PHASE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

/**
 * Advance to the next phase in the case lifecycle.
 */
export function advancePhase(caseInstance) {
    if (caseInstance.completed) return caseInstance;

    const phases = caseInstance.availablePhases;
    const currentIdx = phases.indexOf(caseInstance.currentPhase);
    const nextIdx = currentIdx + 1;

    if (nextIdx >= phases.length) {
        // Case complete
        return {
            ...caseInstance,
            currentPhase: 'complete',
            phasesCompleted: [...caseInstance.phasesCompleted, caseInstance.currentPhase],
            completed: true
        };
    }

    return {
        ...caseInstance,
        currentPhase: phases[nextIdx],
        phasesCompleted: [...caseInstance.phasesCompleted, caseInstance.currentPhase]
    };
}

/**
 * Get the current phase info for UI rendering.
 */
export function getCurrentPhaseInfo(caseInstance) {
    const phaseLabels = {
        investigation: { label: 'Investigasi Rumah', icon: '🔍', description: 'Kunjungi rumah & temukan petunjuk COM-B' },
        diagnosis: { label: 'Diagnosis Perilaku', icon: '🎯', description: 'Identifikasi barrier COM-B utama' },
        planning: { label: 'Rancang Intervensi', icon: '📋', description: 'Pilih strategi intervensi yang tepat' },
        intervention: { label: 'Lakukan Intervensi', icon: '💬', description: 'Jalankan intervensi — mini-game atau dialog' },
        followup: { label: 'Follow-up', icon: '📞', description: 'Cek perubahan perilaku' },
        evaluation: { label: 'Evaluasi', icon: '📊', description: 'Lihat dampak intervensi pada keluarga' },
        complete: { label: 'Selesai', icon: '✅', description: 'Kasus behavior change selesai' }
    };

    return phaseLabels[caseInstance.currentPhase] || phaseLabels.complete;
}

// ═══════════════════════════════════════════════════════════════
// INVESTIGATION PHASE
// ═══════════════════════════════════════════════════════════════

/**
 * Record a clue found during investigation.
 * Returns updated case with identified COM-B barrier revealed by this clue.
 *
 * @param {Object} caseInstance - Active case
 * @param {string} clueLocation - Location where clue was found
 * @returns {Object} Updated case + clue data
 */
export function recordClueFound(caseInstance, clueLocation) {
    const scenario = getDiseaseScenarioById(caseInstance.scenarioId);
    if (!scenario?.investigationClues) return { case: caseInstance, clue: null };

    const clue = scenario.investigationClues.find(c => c.location === clueLocation);
    if (!clue || caseInstance.cluesFound.includes(clueLocation)) {
        return { case: caseInstance, clue: null };
    }

    return {
        case: {
            ...caseInstance,
            cluesFound: [...caseInstance.cluesFound, clueLocation]
        },
        clue
    };
}

// ═══════════════════════════════════════════════════════════════
// COM-B DIAGNOSIS SCORING
// ═══════════════════════════════════════════════════════════════

/**
 * Score the player's COM-B diagnosis against the ground truth.
 * Player drags barriers onto the BCW wheel; this scores their accuracy.
 *
 * @param {Object} caseInstance - Active case
 * @param {Object} playerBarriers - Player's identified barriers { cap_psy: 0.8, opp_phy: 0.6, ... }
 * @returns {Object} Updated case with diagnosis score
 */
export function scoreCOMBDiagnosis(caseInstance, playerBarriers) {
    const scenario = getDiseaseScenarioById(caseInstance.scenarioId);
    if (!scenario) return caseInstance;

    const actual = scenario.comBBarriers;
    const primary = scenario.primaryBarriers;

    // Calculate accuracy
    let totalScore = 0;
    let maxScore = 0;

    // 1. Did player identify the PRIMARY barriers? (60% of score)
    const primaryWeight = 60;
    let primaryHits = 0;
    for (const barrier of primary) {
        maxScore += primaryWeight / primary.length;
        if (playerBarriers[barrier] && playerBarriers[barrier] >= 0.5) {
            primaryHits++;
            totalScore += primaryWeight / primary.length;
        }
    }

    // 2. How close are the barrier magnitudes? (30% of score)
    const magnitudeWeight = 30;
    const allBarrierKeys = new Set([...Object.keys(actual), ...Object.keys(playerBarriers)]);
    let magnitudeScore = 0;
    let magnitudeCount = 0;

    for (const key of allBarrierKeys) {
        const actualVal = actual[key] || 0;
        const playerVal = playerBarriers[key] || 0;
        const diff = Math.abs(actualVal - playerVal);
        magnitudeScore += 1 - diff; // Max 1 per barrier
        magnitudeCount++;
    }

    if (magnitudeCount > 0) {
        totalScore += (magnitudeScore / magnitudeCount) * magnitudeWeight;
        maxScore += magnitudeWeight;
    }

    // 🌟 HACK: RED HERRING GUILLOTINE — -10% per tebakan ngawur (nerfed from Gemini's -20%)
    const falsePositives = Object.keys(playerBarriers).filter(k => !actual[k] || actual[k] < 0.2);
    if (falsePositives.length > 0) {
        totalScore -= (falsePositives.length * 10);
    }
    maxScore += 10; // Base weight for no-false-positive bonus
    if (falsePositives.length === 0) totalScore += 10;

    const normalizedScore = Math.max(0, Math.round((totalScore / maxScore) * 100));

    return {
        ...caseInstance,
        comBDiagnosis: {
            ...caseInstance.comBDiagnosis,
            playerIdentified: playerBarriers,
            score: normalizedScore,
            falsePositives // Saved for Procedural Snark narrative
        }
    };
}

// ═══════════════════════════════════════════════════════════════
// INTERVENTION MATCHING
// ═══════════════════════════════════════════════════════════════

/**
 * Score an intervention choice against the scenario's best interventions.
 *
 * @param {Object} caseInstance - Active case
 * @param {string} interventionId - ID from INTERVENTION_FUNCTIONS
 * @returns {Object} Updated case with intervention score
 */
export function scoreIntervention(caseInstance, interventionId) {
    const scenario = getDiseaseScenarioById(caseInstance.scenarioId);
    if (!scenario) return caseInstance;

    const best = scenario.bestInterventions;
    const func = INTERVENTION_FUNCTIONS[interventionId];
    if (!func) return caseInstance;

    let score = 0;

    // Is this one of the best interventions?
    if (best.includes(interventionId)) {
        score = 100;
    } else {
        // Partial credit: does the intervention target any of the primary barriers?
        const targetOverlap = func.targets.filter(t => scenario.primaryBarriers.includes(t));
        score = targetOverlap.length > 0 ? 50 : 10;
    }

    return {
        ...caseInstance,
        interventionChosen: interventionId,
        interventionScore: score
    };
}

/**
 * Get recommended interventions for a scenario (for hint system)
 */
export function getRecommendedInterventions(scenarioId) {
    const scenario = getDiseaseScenarioById(scenarioId);
    if (!scenario) return [];

    return scenario.bestInterventions.map(id => ({
        ...INTERVENTION_FUNCTIONS[id],
        isRecommended: true
    }));
}

// ═══════════════════════════════════════════════════════════════
// OUTCOME RESOLUTION
// ═══════════════════════════════════════════════════════════════

/**
 * Resolve the final outcome of a completed behavior change case.
 * Combines diagnosis score, intervention score, and investigation thoroughness
 * into an overall score with probabilistic readiness change.
 *
 * @param {Object} caseInstance - Completed case
 * @returns {Object} Resolved case with outcome, XP, reputation, and readiness change
 */
export function resolveOutcome(caseInstance) {
    const scenario = getDiseaseScenarioById(caseInstance.scenarioId);
    if (!scenario) return caseInstance;

    const diagScore = caseInstance.comBDiagnosis.score;
    const rawIntScore = caseInstance.miniGameResult
        ? Math.round((caseInstance.interventionScore + caseInstance.miniGameResult.normalized) / 2)
        : caseInstance.interventionScore;
    const invScore = caseInstance.totalClues > 0
        ? (caseInstance.cluesFound.length / caseInstance.totalClues) * 100
        : 50;

    // 🌟 HACK 1: DIAGNOSTIC BOTTLENECK — salah diagnosis = edukasi sia-sia
    // If diagnosis < 50%, intervention score gets halved (min 30% effective)
    const diagMultiplier = Math.max(0.3, diagScore / 100);
    const effectiveIntScore = rawIntScore * diagMultiplier;

    // Weighted: Diag 40%, Intervention 45% (bottlenecked), Investigation 15%
    let rawOverallScore = Math.round(
        (diagScore * 0.40) + (effectiveIntScore * 0.45) + (invScore * 0.15)
    );

    // 🌟 HACK 2: SDOH ARMOR — good diagnosis can penetrate resistance
    const resistanceMitigation = diagScore / 100; // Better diagnosis = more mitigation
    const finalResistance = (caseInstance.familyResistance || 0) * (1 - resistanceMitigation);
    let overallScore = Math.max(0, Math.round(rawOverallScore - finalResistance));

    // Determine outcome tier
    let outcomeTier;
    if (overallScore >= SCORE_THRESHOLDS.excellent) outcomeTier = 'excellent';
    else if (overallScore >= SCORE_THRESHOLDS.good) outcomeTier = 'good';
    else if (overallScore >= SCORE_THRESHOLDS.partial) outcomeTier = 'partial';
    else outcomeTier = 'fail';

    const readinessChange = calculateReadinessChange(caseInstance.readinessStart, outcomeTier);

    const xpTable = { excellent: 150, good: 100, partial: 50, fail: 10 };
    const repTable = { excellent: 15, good: 8, partial: -2, fail: -10 };
    const modeMultiplier = caseInstance.mode === 'deep' ? 1.5 : 1.0;

    // 🌟 HACK 4: DETERMINISTIC KARMA — fail = guaranteed IGD, no lucky dice
    let ukpDelay = null;
    if (scenario.ukpBridge) {
        const { min, max } = scenario.ukpBridge.delayDays;
        if (outcomeTier === 'fail') {
            // FATAL: Bomb goes off FAST. No escape.
            ukpDelay = min;
        } else if (outcomeTier === 'partial') {
            // Partial: still some probability of escalation
            if (Math.random() <= (scenario.ukpBridge.failProbability || 0.5)) {
                ukpDelay = min + Math.floor(Math.random() * (max - min + 1));
            }
        }
    }

    // Social Contagion flag for perfect play
    const socialContagion = outcomeTier === 'excellent' && overallScore >= 95;

    return {
        ...caseInstance,
        completed: true,
        currentPhase: 'complete',
        overallScore,
        outcomeTier,
        readinessCurrent: readinessChange.newStage,
        readinessAdvanced: readinessChange.advanced,
        xpEarned: Math.round(xpTable[outcomeTier] * modeMultiplier),
        reputationDelta: repTable[outcomeTier],
        ukpTriggered: ukpDelay !== null,
        ukpDelayDays: ukpDelay,
        ukpDiseaseId: ukpDelay ? scenario.ukpBridge?.failOutcomes?.[0] : null,
        socialContagion,
        resolvedAt: Date.now()
    };
}

/**
 * Calculate readiness stage progression based on outcome.
 */
function calculateReadinessChange(currentStageId, outcomeTier) {
    const stageIds = READINESS_STAGES.map(s => s.id);
    const currentIdx = stageIds.indexOf(currentStageId);

    let newIdx = currentIdx;
    switch (outcomeTier) {
        case 'excellent': newIdx = Math.min(currentIdx + 2, stageIds.length - 1); break;
        case 'good': newIdx = Math.min(currentIdx + 1, stageIds.length - 1); break;
        case 'partial': break; // No change
        case 'fail': newIdx = Math.max(currentIdx - 1, 0); break;
    }

    return {
        previousStage: currentStageId,
        newStage: stageIds[newIdx],
        advanced: newIdx > currentIdx,
        regressed: newIdx < currentIdx
    };
}

// ═══════════════════════════════════════════════════════════════
// DAILY CASE SELECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Select behavior cases for today based on game state.
 * Called during morning briefing. Returns up to MAX_ACTIVE_CASES scenarios.
 *
 * @param {Object} state - Game state
 * @param {number} state.day - Current game day
 * @param {Object} state.villageData - Village data with families
 * @param {Array} state.completedCases - Previously completed case IDs
 * @param {Array} state.activeCases - Currently active cases
 * @returns {Object} { coreCases: [], emergingAlert: null }
 */
export function selectDailyCases(state) {
    const { day = 1, villageData = {}, completedCases = [], activeCases = [] } = state;
    const season = getSeasonForDay(day);

    // Skip if already at max
    if (activeCases.length >= MAX_ACTIVE_CASES) {
        return { coreCases: [], emergingAlert: null };
    }

    const completedIds = completedCases.map(c => c.scenarioId || c);
    const activeIds = activeCases.map(c => c.scenarioId || c);
    const available = DISEASE_SCENARIOS.filter(s =>
        !completedIds.includes(s.id) &&
        !activeIds.includes(s.id) &&
        !s.isEmergingEvent // Emerging handled separately
    );

    // Filter by trigger conditions
    const eligible = available.filter(s => {
        const tc = s.triggerConditions;
        if (tc.minDay && day < tc.minDay) return false;
        if (tc.season && tc.season !== season) return false;
        // SDOH matching
        if (tc.sdoh && villageData.families) {
            // Check if any anchored family matches SDOH conditions
            const anchors = s.npcAnchors || [];
            if (anchors.length > 0) {
                const hasMatch = anchors.some(familyId => {
                    const sdoh = getFamilySDOH(familyId);
                    if (!sdoh) return false;
                    return Object.entries(tc.sdoh).every(([key, val]) => sdoh[key] === val);
                });
                if (!hasMatch) return false;
            }
        }
        return Math.random() < (tc.probability || 0.1);
    });

    // Pick 1-2 daily scenarios (1 Quick + optional 1 Deep)
    const coreCases = [];
    const tier1 = eligible.filter(s => s.tier === 1);
    const tier2 = eligible.filter(s => s.tier === 2);
    const tier4 = eligible.filter(s => s.tier === 4);

    // Always try to get a Tier 1 case first
    if (tier1.length > 0) {
        coreCases.push(tier1[Math.floor(Math.random() * tier1.length)]);
    }

    // Occasionally add a Tier 2 case (after day 14)
    if (day >= 14 && tier2.length > 0 && Math.random() < 0.3) {
        coreCases.push(tier2[Math.floor(Math.random() * tier2.length)]);
    }

    // Environmental background risk modifier
    if (tier4.length > 0 && Math.random() < 0.15) {
        coreCases.push(tier4[Math.floor(Math.random() * tier4.length)]);
    }

    // Check for emerging event (separate from core) — uses full engine
    let emergingAlert = null;
    const emergingResult = evaluateEmergingTriggers({
        day,
        villageData,
        completedEmergingIds: completedIds,
        emergingCooldowns: state.emergingCooldowns || {}
    });

    if (emergingResult && !activeIds.includes(emergingResult.scenarioId)) {
        emergingAlert = emergingResult;
    }

    return { coreCases, emergingAlert };
}

// ═══════════════════════════════════════════════════════════════
// OUTCOME DESCRIPTIONS (for UI)
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a narrative outcome description for the evaluation phase.
 */
export function getOutcomeNarrative(caseInstance) {
    const scenario = getDiseaseScenarioById(caseInstance.scenarioId);
    if (!scenario) return '';

    const tier = caseInstance.outcomeTier;
    const stageName = READINESS_STAGES.find(s => s.id === caseInstance.readinessCurrent)?.label || '';
    const readinessEmoji = READINESS_STAGES.find(s => s.id === caseInstance.readinessCurrent)?.emoji || '❓';

    // 🌟 HACK 5: PROCEDURAL SNARK — AI Director menyindir kesalahan spesifik pemain
    const falsePositives = caseInstance.comBDiagnosis?.falsePositives || [];
    let critique = '';

    if (tier === 'partial' || tier === 'fail') {
        if (falsePositives.includes('mot_ref') || falsePositives.includes('cap_psy')) {
            critique = 'Anda terlalu sibuk menceramahi pola pikir mereka, padahal masalah aslinya adalah fasilitas dan peluang fisik! ';
        } else if (caseInstance.comBDiagnosis?.score < 50 && caseInstance.interventionScore > 70) {
            critique = 'Komunikasi lapangan Anda lumayan, TAPI diagnosis awal salah sasaran. Edukasi ini jadi sia-sia. ';
        } else if ((caseInstance.familyResistance || 0) > 15) {
            critique = 'Keluarga ini punya beban sosio-ekonomi berat. Butuh analisis sempurna untuk menembus keras kepalanya. ';
        }
    }

    const narratives = {
        excellent: `🌟 BRILIAN! Diagnosis COM-B Anda menembus akar masalah secara presisi. ` +
            `Keluarga berhasil naik ke tahap "${stageName}" ${readinessEmoji}. ` +
            `Perubahan perilaku mulai terlihat di keluarga ini.` +
            (caseInstance.socialContagion ? '\n\n[EFEK DOMINO]: Perilaku positif mereka mulai menular ke rumah tetangga!' : ''),
        good: `👍 Bagus! Intervensi Anda berhasil meskipun ada beberapa barrier yang terlewat. ` +
            `Keluarga ${caseInstance.readinessAdvanced ? 'naik ke tahap berikutnya' : 'masih di tahap yang sama'} ${readinessEmoji}.`,
        partial: `⚠️ INTERVENSI MELENCENG. ${critique}` +
            `Warga hanya mengangguk sopan tapi tidak ada perubahan perilaku nyata. ` +
            (caseInstance.ukpTriggered ? `Bersiaplah, target diproyeksikan akan masuk IGD dalam ${caseInstance.ukpDelayDays} hari.` : (scenario.ukpBridge?.description || '')),
        fail: `❌ BENCANA KOMUNIKASI. Analisis Anda salah arah. ${critique}` +
            `Warga merasa dihakimi dan menolak kehadiran Anda. ` +
            (caseInstance.ukpTriggered ? `Siapkan ranjang IGD dalam ${caseInstance.ukpDelayDays} hari!` : (scenario.ukpBridge?.description || ''))
    };

    return narratives[tier] || '';
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
    // Case lifecycle
    createBehaviorCase,
    advancePhase,
    getCurrentPhaseInfo,

    // Investigation
    recordClueFound,

    // Scoring
    scoreCOMBDiagnosis,
    scoreIntervention,
    getRecommendedInterventions,

    // Outcomes
    resolveOutcome,
    getOutcomeNarrative,

    // Daily selection
    selectDailyCases,

    // Constants
    CASE_MODES,
    SCORE_THRESHOLDS,
    MAX_ACTIVE_CASES
};
