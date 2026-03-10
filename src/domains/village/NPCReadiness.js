/**
 * @reflection
 * [IDENTITY]: NPCReadiness.js
 * [PURPOSE]: Manages Transtheoretical Model (TTM) readiness stages for village
 *            families. Handles stage transitions (advancement & regression),
 *            social graph influence (community contagion), familiarity system,
 *            and village-level IKS (Indeks Keluarga Sehat) calculations.
 * [STATE]: Experimental
 * [ANCHOR]: advanceReadiness
 * [DEPENDS_ON]: VillageRegistry, VillagerBehavior, DiseaseScenarios
 */

import { VILLAGE_FAMILIES, FAMILY_SDOH } from './VillageRegistry.js';
import { READINESS_STAGES } from '../../content/scenarios/DiseaseScenarios.js';

// ═══════════════════════════════════════════════════════════════
// TTM READINESS STAGE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

/** Stage IDs in order (index = progression level) */
const STAGE_ORDER = READINESS_STAGES.map(s => s.id);

/** Map stage id → index for fast lookups */
const STAGE_INDEX = {};
STAGE_ORDER.forEach((id, i) => { STAGE_INDEX[id] = i; });

// ═══════════════════════════════════════════════════════════════
// SOCIAL INFLUENCE GRAPH
// ═══════════════════════════════════════════════════════════════

/**
 * Social roles determine how much influence a family has on neighbors.
 * Higher influence = changing this family causes ripple effects.
 */
const SOCIAL_ROLES = {
    'kk_01': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_02', 'kk_03'] },
    'kk_02': { role: 'tetua_rt', influence: 0.4, connectedFamilies: ['kk_01', 'kk_03', 'kk_04', 'kk_05'] },
    'kk_03': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_01', 'kk_02', 'kk_04'] },
    'kk_04': { role: 'warga_biasa', influence: 0.15, connectedFamilies: ['kk_02', 'kk_03', 'kk_05'] },
    'kk_05': { role: 'kader_posyandu', influence: 0.35, connectedFamilies: ['kk_01', 'kk_02', 'kk_04', 'kk_06', 'kk_07'] },

    'kk_06': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_05', 'kk_07', 'kk_08'] },
    'kk_07': { role: 'ibu_pkk', influence: 0.3, connectedFamilies: ['kk_05', 'kk_06', 'kk_08', 'kk_09', 'kk_10'] },
    'kk_08': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_06', 'kk_07', 'kk_09'] },
    'kk_09': { role: 'warga_biasa', influence: 0.15, connectedFamilies: ['kk_07', 'kk_08', 'kk_10'] },
    'kk_10': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_07', 'kk_09'] },

    'kk_11': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_12', 'kk_13'] },
    'kk_12': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_11', 'kk_13', 'kk_14'] },
    'kk_13': { role: 'tokoh_agama', influence: 0.5, connectedFamilies: ['kk_11', 'kk_12', 'kk_14', 'kk_15', 'kk_21'] },
    'kk_14': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_12', 'kk_13', 'kk_15'] },
    'kk_15': { role: 'warga_biasa', influence: 0.15, connectedFamilies: ['kk_13', 'kk_14', 'kk_16'] },

    'kk_16': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_15', 'kk_17'] },
    'kk_17': { role: 'pedagang', influence: 0.2, connectedFamilies: ['kk_16', 'kk_18', 'kk_19', 'kk_20'] },
    'kk_18': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_17', 'kk_19'] },
    'kk_19': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_17', 'kk_18', 'kk_20'] },
    'kk_20': { role: 'warga_biasa', influence: 0.15, connectedFamilies: ['kk_17', 'kk_19'] },

    'kk_21': { role: 'ketua_rt', influence: 0.45, connectedFamilies: ['kk_13', 'kk_22', 'kk_23', 'kk_24', 'kk_25'] },
    'kk_22': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_21', 'kk_23'] },
    'kk_23': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_21', 'kk_22', 'kk_24'] },
    'kk_24': { role: 'tetua_desa', influence: 0.35, connectedFamilies: ['kk_21', 'kk_23', 'kk_25'] },
    'kk_25': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_21', 'kk_24', 'kk_26'] },

    'kk_26': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_25', 'kk_27'] },
    'kk_27': { role: 'warga_biasa', influence: 0.15, connectedFamilies: ['kk_26', 'kk_28'] },
    'kk_28': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_27', 'kk_29'] },
    'kk_29': { role: 'warga_biasa', influence: 0.1, connectedFamilies: ['kk_28', 'kk_30'] },
    'kk_30': { role: 'kader_posyandu', influence: 0.35, connectedFamilies: ['kk_25', 'kk_26', 'kk_27', 'kk_28', 'kk_29'] }
};

/**
 * Influence role labels in Indonesian.
 */
export const ROLE_LABELS = {
    'warga_biasa': 'Warga Biasa',
    'kader_posyandu': 'Kader Posyandu',
    'tokoh_agama': 'Tokoh Agama',
    'ibu_pkk': 'Ibu PKK',
    'ketua_rt': 'Ketua RT',
    'tetua_rt': 'Tetua RT',
    'tetua_desa': 'Tetua Desa',
    'pedagang': 'Pedagang'
};

// ═══════════════════════════════════════════════════════════════
// READINESS STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

/**
 * Initialize readiness state for all families.
 * Called once when a new game starts.
 * @returns {Object} Map of familyId → readiness data
 */
export function initializeReadinessState() {
    const state = {};
    for (const familyId of Object.keys(FAMILY_SDOH)) {
        const sdoh = FAMILY_SDOH[familyId];
        // Starting stage based on economy: lower economy = earlier stage
        let startStage = 'precontemplation';
        if (sdoh.economy === 'Middle') startStage = 'contemplation';
        if (sdoh.economy === 'Low-Middle') startStage = 'precontemplation';

        state[familyId] = {
            stage: startStage,
            familiarity: 0,     // 0-100, increases with visits
            visitCount: 0,
            lastVisitDay: null,
            scenarioHistory: [], // Completed BC scenario IDs
            stageHistory: []    // Array of { from, to, day, reason }
        };
    }
    return state;
}

/**
 * Advance a family's readiness stage after a successful intervention.
 * @param {Object} readinessState - Full readiness state map
 * @param {string} familyId - Family to advance
 * @param {string} outcomeTier - 'excellent', 'good', 'partial', 'fail'
 * @param {number} day - Current game day
 * @returns {{ state: Object, advanced: boolean, socialRipple: Array }}
 */
export function advanceReadiness(readinessState, familyId, outcomeTier, day) {
    const current = readinessState[familyId];
    if (!current) return { state: readinessState, advanced: false, socialRipple: [] };

    const currentIdx = STAGE_INDEX[current.stage] ?? 0;
    let newIdx = currentIdx;

    switch (outcomeTier) {
        case 'excellent': newIdx = Math.min(currentIdx + 2, STAGE_ORDER.length - 1); break;
        case 'good': newIdx = Math.min(currentIdx + 1, STAGE_ORDER.length - 1); break;
        case 'partial': break; // No change
        case 'fail': newIdx = Math.max(currentIdx - 1, 0); break;
    }

    const advanced = newIdx > currentIdx;
    const newStage = STAGE_ORDER[newIdx];

    // Update state
    const updatedFamily = {
        ...current,
        stage: newStage,
        stageHistory: [
            ...current.stageHistory,
            { from: current.stage, to: newStage, day, reason: `Outcome: ${outcomeTier}` }
        ]
    };

    const newState = { ...readinessState, [familyId]: updatedFamily };

    // Calculate social ripple effect
    const socialRipple = advanced ? calculateSocialRipple(newState, familyId, day) : [];

    return { state: newState, advanced, newStage, socialRipple };
}

/**
 * Calculate social contagion: when an influential family advances,
 * connected families get a chance to advance too.
 */
function calculateSocialRipple(readinessState, sourceFamilyId, day) {
    const social = SOCIAL_ROLES[sourceFamilyId];
    if (!social || social.influence < 0.2) return []; // Low influence = no ripple

    const ripples = [];

    for (const connectedId of social.connectedFamilies) {
        const connected = readinessState[connectedId];
        if (!connected) continue;

        const connectedIdx = STAGE_INDEX[connected.stage] ?? 0;
        // Only advance if they're behind and probability check passes
        if (connectedIdx < STAGE_ORDER.length - 1 && Math.random() < social.influence) {
            const newIdx = Math.min(connectedIdx + 1, STAGE_ORDER.length - 1);
            const newStage = STAGE_ORDER[newIdx];

            readinessState[connectedId] = {
                ...connected,
                stage: newStage,
                stageHistory: [
                    ...connected.stageHistory,
                    { from: connected.stage, to: newStage, day, reason: `Social influence dari ${VILLAGE_FAMILIES.find(f => f.id === sourceFamilyId)?.surname || sourceFamilyId}` }
                ]
            };

            ripples.push({
                familyId: connectedId,
                from: connected.stage,
                to: newStage,
                sourceId: sourceFamilyId,
                sourceName: VILLAGE_FAMILIES.find(f => f.id === sourceFamilyId)?.surname || sourceFamilyId
            });
        }
    }

    return ripples;
}

// ═══════════════════════════════════════════════════════════════
// FAMILIARITY SYSTEM
// ═══════════════════════════════════════════════════════════════

/**
 * Record a home visit, increasing familiarity.
 * Higher familiarity unlocks deeper dialogue options and boosts readiness advancement.
 * @param {Object} readinessState
 * @param {string} familyId
 * @param {number} day
 * @returns {Object} Updated readiness state
 */
export function recordVisit(readinessState, familyId, day) {
    const current = readinessState[familyId];
    if (!current) return readinessState;

    // Familiarity gains: diminishing returns
    const visitBonus = current.visitCount < 3 ? 20 :
        current.visitCount < 7 ? 10 : 5;

    return {
        ...readinessState,
        [familyId]: {
            ...current,
            familiarity: Math.min(current.familiarity + visitBonus, 100),
            visitCount: current.visitCount + 1,
            lastVisitDay: day
        }
    };
}

/**
 * Get familiarity level label for display.
 * @param {number} familiarity - 0-100
 * @returns {{ level: string, label: string, emoji: string, unlocksDeepDialog: boolean }}
 */
export function getFamiliarityLevel(familiarity) {
    if (familiarity >= 80) return { level: 'intimate', label: 'Sangat Akrab', emoji: '❤️', unlocksDeepDialog: true };
    if (familiarity >= 60) return { level: 'familiar', label: 'Akrab', emoji: '😊', unlocksDeepDialog: true };
    if (familiarity >= 40) return { level: 'known', label: 'Kenal', emoji: '🤝', unlocksDeepDialog: false };
    if (familiarity >= 20) return { level: 'acquainted', label: 'Pernah Ketemu', emoji: '👋', unlocksDeepDialog: false };
    return { level: 'stranger', label: 'Belum Kenal', emoji: '❓', unlocksDeepDialog: false };
}

// ═══════════════════════════════════════════════════════════════
// UKM NEGLECT PENALTY
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate daily readiness decay for families not visited recently.
 * Families regress if neglected for too long (>7 days without visit).
 * @param {Object} readinessState
 * @param {number} day
 * @returns {{ state: Object, regressions: Array }}
 */
export function applyNeglectDecay(readinessState, day) {
    const regressions = [];
    const newState = { ...readinessState };

    for (const [familyId, data] of Object.entries(readinessState)) {
        if (!data.lastVisitDay) continue; // Never visited = no regression

        const daysSinceVisit = day - data.lastVisitDay;
        const currentIdx = STAGE_INDEX[data.stage] ?? 0;

        // Regression thresholds (progressive):
        // >14 days: chance of 1-stage regression
        // >30 days: guaranteed 1-stage regression
        let shouldRegress = false;
        if (daysSinceVisit > 30) {
            shouldRegress = true;
        } else if (daysSinceVisit > 14 && Math.random() < 0.15) {
            shouldRegress = true;
        }

        if (shouldRegress && currentIdx > 0) {
            const newIdx = currentIdx - 1;
            const newStage = STAGE_ORDER[newIdx];

            newState[familyId] = {
                ...data,
                stage: newStage,
                stageHistory: [
                    ...data.stageHistory,
                    { from: data.stage, to: newStage, day, reason: `Neglect: ${daysSinceVisit} hari tanpa kunjungan` }
                ]
            };

            regressions.push({
                familyId,
                from: data.stage,
                to: newStage,
                daysSinceVisit
            });
        }
    }

    return { state: newState, regressions };
}

// ═══════════════════════════════════════════════════════════════
// VILLAGE-LEVEL METRICS
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate village-wide IKS (Indeks Keluarga Sehat) from readiness states.
 * IKS is the ultimate victory metric.
 * @param {Object} readinessState
 * @returns {{ iks: number, breakdown: Object, victory: boolean }}
 */
export function calculateVillageIKS(readinessState) {
    const stages = Object.values(readinessState).map(d => d.stage);
    const total = stages.length || 1;

    const breakdown = {};
    for (const stageId of STAGE_ORDER) {
        breakdown[stageId] = stages.filter(s => s === stageId).length;
    }

    // IKS = weighted average of stage positions
    let totalScore = 0;
    for (const [familyId, data] of Object.entries(readinessState)) {
        const idx = STAGE_INDEX[data.stage] ?? 0;
        totalScore += idx / (STAGE_ORDER.length - 1); // Normalize to 0-1
    }
    const iks = Math.round((totalScore / total) * 100);

    // Victory condition: IKS ≥ 80 (80% of families in action or maintenance)
    const victory = iks >= 80;

    return { iks, breakdown, victory, totalFamilies: total };
}

/**
 * Get a summary of readiness distribution for debrief/dashboard display.
 */
export function getReadinessSummary(readinessState) {
    const entries = Object.entries(readinessState);
    const summary = READINESS_STAGES.map(stage => ({
        ...stage,
        count: entries.filter(([_, d]) => d.stage === stage.id).length,
        families: entries
            .filter(([_, d]) => d.stage === stage.id)
            .map(([id]) => id)
    }));

    return summary;
}

/**
 * Get social role info for a family (for UI display).
 */
export function getSocialRole(familyId) {
    const social = SOCIAL_ROLES[familyId];
    if (!social) return { role: 'warga_biasa', influence: 0.1, label: 'Warga Biasa', connectedFamilies: [] };

    return {
        ...social,
        label: ROLE_LABELS[social.role] || social.role
    };
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export { SOCIAL_ROLES, STAGE_ORDER, STAGE_INDEX };

export default {
    // State management
    initializeReadinessState,
    advanceReadiness,
    recordVisit,

    // Neglect
    applyNeglectDecay,

    // Familiarity
    getFamiliarityLevel,

    // Village metrics
    calculateVillageIKS,
    getReadinessSummary,

    // Social
    getSocialRole,

    // Constants
    SOCIAL_ROLES,
    ROLE_LABELS,
    STAGE_ORDER,
    STAGE_INDEX
};
