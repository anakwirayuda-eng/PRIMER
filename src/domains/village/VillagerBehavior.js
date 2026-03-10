/**
 * @reflection
 * [IDENTITY]: VillagerBehavior.js
 * [PURPOSE]: COM-B (Capability, Opportunity, Motivation - Behavior) profiles for
 *            all 30 village families. Maps SDOH + FAMILY_INDICATORS to behavioral
 *            barriers, enabling the BehaviorCaseEngine to anchor scenarios to
 *            specific families with realistic, data-driven COM-B scores.
 * [STATE]: Experimental
 * [ANCHOR]: calculateFamilyCOMB
 * [DEPENDS_ON]: VillageRegistry (FAMILY_SDOH, FAMILY_INDICATORS, VILLAGE_FAMILIES)
 */

import { FAMILY_SDOH, FAMILY_INDICATORS, VILLAGE_FAMILIES } from './VillageRegistry.js';

// ═══════════════════════════════════════════════════════════════
// COM-B BARRIER SCORING RULES
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a COM-B profile for a family based on their SDOH and indicators.
 * Returns scores 0.0 (no barrier) to 1.0 (extreme barrier) for each COM-B domain.
 *
 * COM-B Domains:
 *   cap_psy  = Psychological Capability (knowledge, understanding)
 *   cap_phy  = Physical Capability (skill, dexterity)
 *   opp_phy  = Physical Opportunity (resources, environment, infrastructure)
 *   opp_soc  = Social Opportunity (norms, peer pressure, stigma)
 *   mot_ref  = Reflective Motivation (beliefs, intentions, identity)
 *   mot_aut  = Automatic Motivation (habits, impulses, emotional reactions)
 */

// Education → Psychological Capability mapping
const EDUCATION_CAP_PSY = {
    'No School': 0.9,
    'Elementary': 0.7,
    'Junior High': 0.5,
    'High School': 0.3,
    'D3': 0.2,
    'S1': 0.1,
    'University': 0.1
};

// Housing → Physical Opportunity mapping
const HOUSING_OPP_PHY = {
    'Make-shift': 0.9,
    'Semi-Permanent': 0.7,
    'Old Permanent': 0.4,
    'Permanent': 0.2
};

// Economy → Access barrier mapping
const ECONOMY_CAP_PHY = {
    'Low': 0.8,
    'Low-Middle': 0.6,
    'Middle': 0.3,
    'High': 0.1
};

// Sanitation → Environmental opportunity mapping
const SANITATION_OPP_PHY = {
    'River/Open': 0.95,
    'Shared Latrine': 0.6,
    'Private Latrine': 0.2
};

// Water → Environmental opportunity mapping
const WATER_OPP_PHY = {
    'River': 0.9,
    'Well': 0.5,
    'PDAM': 0.1,
    'Filtered': 0.1
};

// Diet → Motivation barrier mapping
const DIET_MOT = {
    'Poor Nutrition': 0.8,
    'High Sugar': 0.7,
    'High Salt': 0.6,
    'Traditional': 0.4,
    'Balanced': 0.15,
    'Low Sodium': 0.1,
    'Diabetic Diet': 0.2
};

// ═══════════════════════════════════════════════════════════════
// PROFILE GENERATION
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate an individual family's COM-B barrier profile from their SDOH.
 * @param {string} familyId - Family KK ID (e.g. 'kk_01')
 * @returns {Object} COM-B profile with scores 0.0-1.0
 */
export function calculateFamilyCOMB(familyId) {
    const sdoh = FAMILY_SDOH[familyId];
    const indicators = FAMILY_INDICATORS[familyId];

    if (!sdoh) {
        return getDefaultCOMB();
    }

    // --- Capability Psychological (knowledge) ---
    let cap_psy = EDUCATION_CAP_PSY[sdoh.education] || 0.5;
    // Boost cap_psy barrier if indicators show gaps in health literacy
    if (indicators && !indicators.imunisasi) cap_psy = Math.min(cap_psy + 0.15, 1.0);

    // --- Capability Physical (skill, resources) ---
    let cap_phy = ECONOMY_CAP_PHY[sdoh.economy] || 0.5;
    // No JKN = can't access healthcare easily
    if (indicators && !indicators.jkn) cap_phy = Math.min(cap_phy + 0.2, 1.0);

    // --- Opportunity Physical (environment, infrastructure) ---
    const housingScore = HOUSING_OPP_PHY[sdoh.housing] || 0.4;
    const sanitationScore = SANITATION_OPP_PHY[sdoh.sanitation] || 0.4;
    const waterScore = WATER_OPP_PHY[sdoh.water] || 0.4;
    let opp_phy = (housingScore * 0.3 + sanitationScore * 0.4 + waterScore * 0.3);
    // Jentik presence amplifies physical opportunity barrier
    if (indicators && !indicators.jentik) opp_phy = Math.min(opp_phy + 0.1, 1.0);

    // --- Opportunity Social (norms, peer pressure) ---
    // Harder to measure from data alone; use proxies
    let opp_soc = 0.4; // Base: village social norms are moderate barrier
    // Smoking in family → social norm acceptance of unhealthy behavior
    if (sdoh.smoking) opp_soc = Math.min(opp_soc + 0.2, 1.0);
    // Low education + low economy → higher social isolation
    if (sdoh.economy === 'Low' && sdoh.education === 'Elementary') opp_soc = Math.min(opp_soc + 0.15, 1.0);

    // --- Motivation Reflective (beliefs, identity) ---
    let mot_ref = DIET_MOT[sdoh.diet] || 0.4;
    // Non-compliant indicators suggest lower motivation
    if (indicators) {
        let nonCompliant = 0;
        if (!indicators.kb) nonCompliant++;
        if (!indicators.asi) nonCompliant++;
        if (!indicators.tb) nonCompliant++;
        if (!indicators.hipertensi) nonCompliant++;
        mot_ref = Math.min(mot_ref + (nonCompliant * 0.05), 1.0);
    }

    // --- Motivation Automatic (habits) ---
    let mot_aut = 0.35; // Base habitual resistance
    if (sdoh.smoking) mot_aut = Math.min(mot_aut + 0.25, 1.0);
    if (sdoh.activity === 'Sedentary') mot_aut = Math.min(mot_aut + 0.15, 1.0);
    if (sdoh.diet === 'High Sugar' || sdoh.diet === 'High Salt') mot_aut = Math.min(mot_aut + 0.15, 1.0);

    // Round to 2 decimals
    const round = v => Math.round(v * 100) / 100;

    return {
        cap_psy: round(cap_psy),
        cap_phy: round(cap_phy),
        opp_phy: round(opp_phy),
        opp_soc: round(opp_soc),
        mot_ref: round(mot_ref),
        mot_aut: round(mot_aut)
    };
}

function getDefaultCOMB() {
    return { cap_psy: 0.5, cap_phy: 0.5, opp_phy: 0.5, opp_soc: 0.4, mot_ref: 0.4, mot_aut: 0.35 };
}

// ═══════════════════════════════════════════════════════════════
// PRECOMPUTED PROFILES (all 30 families)
// ═══════════════════════════════════════════════════════════════

const _cache = {};

/**
 * Get COM-B profile for a family. Cached after first calculation.
 */
export function getFamilyCOMB(familyId) {
    if (!_cache[familyId]) {
        _cache[familyId] = calculateFamilyCOMB(familyId);
    }
    return _cache[familyId];
}

/**
 * Get all 30 family COM-B profiles as a map.
 */
export function getAllFamilyCOMBProfiles() {
    const profiles = {};
    const familyIds = Object.keys(FAMILY_SDOH);
    for (const id of familyIds) {
        profiles[id] = getFamilyCOMB(id);
    }
    return profiles;
}

// ═══════════════════════════════════════════════════════════════
// BEHAVIORAL RISK CLASSIFICATION
// ═══════════════════════════════════════════════════════════════

/**
 * Classify a family's overall behavioral risk level.
 * @param {string} familyId
 * @returns {{ level: string, score: number, primaryBarriers: string[], emoji: string }}
 */
export function classifyBehavioralRisk(familyId) {
    const comb = getFamilyCOMB(familyId);
    const scores = Object.values(comb);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Find top 2 barriers
    const sorted = Object.entries(comb).sort((a, b) => b[1] - a[1]);
    const primaryBarriers = sorted.slice(0, 2).map(([key]) => key);

    let level, emoji;
    if (avgScore >= 0.7) { level = 'high'; emoji = '🔴'; }
    else if (avgScore >= 0.5) { level = 'medium'; emoji = '🟡'; }
    else if (avgScore >= 0.3) { level = 'low'; emoji = '🟢'; }
    else { level = 'minimal'; emoji = '⚪'; }

    return { level, score: Math.round(avgScore * 100) / 100, primaryBarriers, emoji };
}

/**
 * Get families sorted by behavioral risk (highest first).
 * Useful for map heat layers and priority targeting.
 */
export function getFamiliesByRisk() {
    const familyIds = Object.keys(FAMILY_SDOH);
    return familyIds
        .map(id => ({
            familyId: id,
            ...classifyBehavioralRisk(id),
            familyName: VILLAGE_FAMILIES.find(f => f.id === id)?.surname || id
        }))
        .sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════════════
// PHBS (Clean & Healthy Living Behavior) SCORE
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate PHBS score for a family (0-10 scale, matching stamp card display).
 * Based on 10 standard PHBS indicators from Ministry of Health.
 */
export function calculatePHBSScore(familyId) {
    const indicators = FAMILY_INDICATORS[familyId];
    if (!indicators) return 5; // Default middle score

    let score = 0;
    // Standard 10 PHBS indicators
    if (indicators.persalinan) score++; // Persalinan oleh nakes
    if (indicators.asi) score++;         // ASI eksklusif
    if (indicators.balita) score++;      // Menimbang balita
    if (indicators.air) score++;         // Air bersih
    if (indicators.jamban) score++;      // Jamban sehat
    if (indicators.jentik) score++;      // Jentik berkala
    if (!indicators.rokok) score++;      // Tidak merokok (inverted)
    if (indicators.kb) score++;          // KB aktif
    if (indicators.jkn) score++;         // JKN/BPJS aktif
    if (indicators.imunisasi) score++;   // Imunisasi lengkap

    return score;
}

// ═══════════════════════════════════════════════════════════════
// SCENARIO MATCHING
// ═══════════════════════════════════════════════════════════════

/**
 * Find which BC scenarios best match a family's COM-B profile.
 * Returns scenario IDs ranked by barrier similarity.
 * @param {string} familyId
 * @param {Array} scenarios - From DiseaseScenarios.DISEASE_SCENARIOS
 * @returns {Array<{scenarioId: string, matchScore: number}>}
 */
export function matchScenariosToFamily(familyId, scenarios) {
    const familyComb = getFamilyCOMB(familyId);
    const results = [];

    for (const scenario of scenarios) {
        if (!scenario.comBBarriers) continue;

        // Calculate cosine-like similarity between family barriers and scenario barriers
        let dotProduct = 0;
        let familyMag = 0;
        let scenarioMag = 0;

        for (const key of Object.keys(familyComb)) {
            const fv = familyComb[key] || 0;
            const sv = scenario.comBBarriers[key] || 0;
            dotProduct += fv * sv;
            familyMag += fv * fv;
            scenarioMag += sv * sv;
        }

        const denom = Math.sqrt(familyMag) * Math.sqrt(scenarioMag);
        const matchScore = denom > 0 ? Math.round((dotProduct / denom) * 100) / 100 : 0;

        results.push({ scenarioId: scenario.id, matchScore });
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
    calculateFamilyCOMB,
    getFamilyCOMB,
    getAllFamilyCOMBProfiles,
    classifyBehavioralRisk,
    getFamiliesByRisk,
    calculatePHBSScore,
    matchScenariosToFamily
};
