/**
 * @reflection
 * [IDENTITY]: KaderNetwork.js
 * [PURPOSE]: Kader Viral Nodes engine — simulates the social network effect of
 *            community health cadres (Kader Posyandu) and local leaders (Tokoh Agama).
 *            Successful interventions on "Kader" nodes create buff zones that
 *            automatically improve neighboring households over time.
 * [STATE]: Experimental
 * [ANCHOR]: processKaderSpread
 * [DEPENDS_ON]: VillageRegistry (family data), BehaviorCaseEngine (outcome quality)
 */

// ═══════════════════════════════════════════════════════════════
// KADER NODE CONSTANTS
// ═══════════════════════════════════════════════════════════════

/** How many tiles away the kader's influence reaches */
const BUFF_RADIUS = 3;

/** Daily IKS improvement per tick for houses within buff zone */
const DAILY_IKS_BOOST = 0.02; // +2% per day

/** Daily PHBS improvement for houses within buff zone */
const DAILY_PHBS_BOOST = 0.5; // +0.5 score per day (scale 0-10)

/** Minimum outcome tier to activate kader status */
const MIN_ACTIVATION_TIER = 'good'; // 'excellent' or 'good'

/** Maximum active kader nodes at once */
const MAX_ACTIVE_KADERS = 5;

/** Kader types and their multipliers */
const KADER_TYPES = {
    kader_posyandu: {
        label: 'Kader Posyandu',
        icon: '👩‍⚕️',
        radiusMultiplier: 1.0,
        boostMultiplier: 1.0,
        phbsFocus: ['immunization', 'nutrition', 'growth_monitoring']
    },
    tokoh_agama: {
        label: 'Tokoh Agama',
        icon: '🕌',
        radiusMultiplier: 1.5,   // Wider influence
        boostMultiplier: 0.8,    // Slightly less direct health impact
        phbsFocus: ['handwashing', 'clean_water', 'waste_management']
    },
    guru_sd: {
        label: 'Guru SD',
        icon: '👩‍🏫',
        radiusMultiplier: 1.2,
        boostMultiplier: 0.9,
        phbsFocus: ['handwashing', 'dental_hygiene', 'physical_activity']
    },
    ketua_rt: {
        label: 'Ketua RT',
        icon: '👨‍💼',
        radiusMultiplier: 2.0,   // Widest influence (political authority)
        boostMultiplier: 0.6,    // Less direct health knowledge
        phbsFocus: ['waste_management', 'clean_water', 'sanitation']
    }
};

// ═══════════════════════════════════════════════════════════════
// CORE: IDENTIFY KADER CANDIDATES
// ═══════════════════════════════════════════════════════════════

/**
 * Identify which families in the village are potential kader nodes.
 * Called once at village generation or when roster changes.
 * 
 * @param {Array} families - Village families array
 * @returns {Array} List of kader candidate entries
 */
export function identifyKaderCandidates(families) {
    if (!families || !Array.isArray(families)) return [];

    return families
        .filter(f => f.role && KADER_TYPES[f.role])
        .map(f => ({
            familyId: f.id,
            role: f.role,
            type: KADER_TYPES[f.role],
            position: { x: f.buildingX, y: f.buildingY },
            active: false,     // Becomes true after successful intervention
            activatedDay: null,
            outcomeTier: null
        }));
}

// ═══════════════════════════════════════════════════════════════
// CORE: ACTIVATE KADER NODE
// ═══════════════════════════════════════════════════════════════

/**
 * Activate a kader node after a successful BC intervention.
 * 
 * @param {Array} kaderNodes - Current kader nodes array
 * @param {string} familyId - Family that received the intervention
 * @param {string} outcomeTier - 'excellent', 'good', 'partial', 'fail'
 * @param {number} currentDay - Current game day
 * @returns {Array} Updated kader nodes
 */
export function activateKaderNode(kaderNodes, familyId, outcomeTier, currentDay) {
    const tierValues = { excellent: 4, good: 3, partial: 2, fail: 1 };
    const minTierValue = tierValues[MIN_ACTIVATION_TIER] || 3;

    if ((tierValues[outcomeTier] || 0) < minTierValue) {
        return kaderNodes; // Outcome wasn't good enough
    }

    const activeCount = kaderNodes.filter(k => k.active).length;
    if (activeCount >= MAX_ACTIVE_KADERS) {
        return kaderNodes; // Limit reached
    }

    return kaderNodes.map(k => {
        if (k.familyId !== familyId) return k;
        if (k.active) return k; // Already active

        return {
            ...k,
            active: true,
            activatedDay: currentDay,
            outcomeTier
        };
    });
}

// ═══════════════════════════════════════════════════════════════
// CORE: PROCESS DAILY KADER SPREAD
// ═══════════════════════════════════════════════════════════════

/**
 * Process the daily influence spread from active kader nodes.
 * Called once per day during nextDay() transition.
 * 
 * @param {Array} kaderNodes - Current kader nodes
 * @param {Array} families - All village families
 * @param {Array} buildings - All village buildings (for position lookup)
 * @returns {{ updatedFamilies: Array, spreadLog: Array }}
 */
export function processKaderSpread(kaderNodes, families, buildings) {
    if (!kaderNodes || !families) return { updatedFamilies: families, spreadLog: [] };

    const activeKaders = kaderNodes.filter(k => k.active);
    if (activeKaders.length === 0) return { updatedFamilies: families, spreadLog: [] };

    const spreadLog = [];
    let updatedFamilies = [...families];

    for (const kader of activeKaders) {
        const radius = BUFF_RADIUS * (kader.type?.radiusMultiplier || 1);
        const boost = kader.type?.boostMultiplier || 1;
        const kaderBuilding = buildings.find(b => b.familyId === kader.familyId);
        if (!kaderBuilding) continue;

        const kx = kaderBuilding.x;
        const ky = kaderBuilding.y;

        // Find all families within radius
        updatedFamilies = updatedFamilies.map(family => {
            const familyBuilding = buildings.find(b => b.familyId === family.id);
            if (!familyBuilding) return family;

            const dx = familyBuilding.x - kx;
            const dy = familyBuilding.y - ky;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > radius || distance === 0) return family; // Outside range or self

            // Distance-based falloff (closer = stronger effect)
            const falloff = 1 - (distance / radius);
            const iksBoost = DAILY_IKS_BOOST * boost * falloff;
            const phbsBoost = DAILY_PHBS_BOOST * boost * falloff;

            const newIks = Math.min(1, (family.iksScore || 0) + iksBoost);
            const newPhbs = Math.min(10, (family.phbsScore || 0) + phbsBoost);

            if (iksBoost > 0.001) {
                spreadLog.push({
                    kaderFamilyId: kader.familyId,
                    targetFamilyId: family.id,
                    iksBoost: +iksBoost.toFixed(3),
                    phbsBoost: +phbsBoost.toFixed(2),
                    distance: +distance.toFixed(1)
                });
            }

            return {
                ...family,
                iksScore: newIks,
                phbsScore: newPhbs,
                lastKaderInfluence: kader.familyId
            };
        });
    }

    return { updatedFamilies, spreadLog };
}

// ═══════════════════════════════════════════════════════════════
// UTILITY: GET ACTIVE KADER VISUAL DATA
// ═══════════════════════════════════════════════════════════════

/**
 * Get visual data for rendering kader buff zones on the 3D map.
 * 
 * @param {Array} kaderNodes - Current kader nodes
 * @param {Array} buildings - Village buildings
 * @returns {Array} Visual data for each active kader
 */
export function getKaderVisualData(kaderNodes, buildings) {
    if (!kaderNodes) return [];

    return kaderNodes
        .filter(k => k.active)
        .map(k => {
            const building = buildings.find(b => b.familyId === k.familyId);
            if (!building) return null;

            return {
                familyId: k.familyId,
                position: { x: building.x, y: building.y },
                radius: BUFF_RADIUS * (k.type?.radiusMultiplier || 1),
                icon: k.type?.icon || '👩‍⚕️',
                label: k.type?.label || 'Kader',
                outcomeTier: k.outcomeTier
            };
        })
        .filter(Boolean);
}

export default {
    identifyKaderCandidates,
    activateKaderNode,
    processKaderSpread,
    getKaderVisualData,
    KADER_TYPES,
    BUFF_RADIUS
};
