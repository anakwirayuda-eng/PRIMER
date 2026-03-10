/**
 * @reflection
 * [IDENTITY]: OutbreakSystem
 * [PURPOSE]: OUTBREAK SYSTEM Manages disease outbreak events in the village Triggers based on confirmed cases and geographic clusteri
 * [STATE]: Experimental
 * [ANCHOR]: OUTBREAK_TYPES
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * OUTBREAK SYSTEM
 * Manages disease outbreak events in the village
 * Triggers based on confirmed cases and geographic clustering
 */

// Outbreak types with their properties
export const OUTBREAK_TYPES = {
    DBD: {
        id: 'dbd',
        name: 'Demam Berdarah Dengue',
        shortName: 'DBD',
        icon: '🦟',
        color: 'red',
        triggerCodes: ['A90', 'A91'], // ICD-10 codes
        spreadRadius: 3, // Houses within this radius can be affected
        minCasesToTrigger: 2, // Minimum confirmed cases to trigger outbreak
        responseActions: ['fogging', 'psn_campaign', 'kelambu'],
        patientSpikeMultiplier: 1.5, // 50% more patients at IGD
        duration: 7, // Days until auto-resolve if not addressed
        xpReward: 100,
        reputationReward: 15,
        iksImpact: 0.05 // Improvement to IKS after resolution
    },
    MALARIA: {
        id: 'malaria',
        name: 'Malaria',
        shortName: 'Malaria',
        icon: '🦟',
        color: 'purple',
        triggerCodes: ['B50', 'B51', 'B52', 'B53', 'B54'],
        spreadRadius: 4,
        minCasesToTrigger: 2,
        responseActions: ['kelambu', 'mda', 'breeding_site'],
        patientSpikeMultiplier: 1.4,
        duration: 10,
        xpReward: 120,
        reputationReward: 20,
        iksImpact: 0.05
    },
    DIARE: {
        id: 'diare',
        name: 'Diare Akut',
        shortName: 'Diare',
        icon: '💧',
        color: 'blue',
        triggerCodes: ['A00', 'A01', 'A02', 'A03', 'A04', 'A09'],
        spreadRadius: 2,
        minCasesToTrigger: 3,
        responseActions: ['water_quality', 'sanitation', 'oralit_campaign'],
        patientSpikeMultiplier: 1.6,
        duration: 5,
        xpReward: 80,
        reputationReward: 10,
        iksImpact: 0.04
    },
    ISPA: {
        id: 'ispa',
        name: 'ISPA Cluster',
        shortName: 'ISPA',
        icon: '🫁',
        color: 'amber',
        triggerCodes: ['J00', 'J01', 'J02', 'J03', 'J04', 'J05', 'J06'],
        spreadRadius: 2,
        minCasesToTrigger: 5,
        responseActions: ['mask_campaign', 'ventilation', 'education'],
        patientSpikeMultiplier: 1.3,
        duration: 7,
        xpReward: 60,
        reputationReward: 8,
        iksImpact: 0.03
    }
};

// Response actions available for outbreaks
export const OUTBREAK_ACTIONS = {
    fogging: {
        id: 'fogging',
        name: 'Fogging / Pengasapan',
        description: 'Penyemprotan insektisida untuk membunuh nyamuk dewasa',
        icon: '💨',
        energyCost: 30,
        timeCost: 60, // minutes
        effectiveness: 0.4, // 40% contribution to resolution
        requiredForTypes: ['dbd']
    },
    psn_campaign: {
        id: 'psn_campaign',
        name: 'Kampanye PSN 3M Plus',
        description: 'Edukasi dan aksi Pemberantasan Sarang Nyamuk',
        icon: '🪣',
        energyCost: 25,
        timeCost: 45,
        effectiveness: 0.35,
        requiredForTypes: ['dbd']
    },
    kelambu: {
        id: 'kelambu',
        name: 'Distribusi Kelambu',
        description: 'Pembagian kelambu berinsektisida ke rumah warga',
        icon: '🛏️',
        energyCost: 20,
        timeCost: 40,
        effectiveness: 0.3,
        requiredForTypes: ['dbd', 'malaria']
    },
    mda: {
        id: 'mda',
        name: 'Mass Drug Administration',
        description: 'Pemberian obat anti-malaria massal ke penduduk berisiko',
        icon: '💊',
        energyCost: 35,
        timeCost: 90,
        effectiveness: 0.5,
        requiredForTypes: ['malaria']
    },
    breeding_site: {
        id: 'breeding_site',
        name: 'Eliminasi Tempat Perindukan',
        description: 'Identifikasi dan eliminasi genangan air tempat nyamuk berkembang biak',
        icon: '🚫',
        energyCost: 25,
        timeCost: 60,
        effectiveness: 0.4,
        requiredForTypes: ['malaria']
    },
    water_quality: {
        id: 'water_quality',
        name: 'Pemeriksaan Kualitas Air',
        description: 'Testing dan chlorinasi sumber air minum',
        icon: '🧪',
        energyCost: 20,
        timeCost: 45,
        effectiveness: 0.35,
        requiredForTypes: ['diare']
    },
    sanitation: {
        id: 'sanitation',
        name: 'Inspeksi Sanitasi',
        description: 'Pemeriksaan jamban dan MCK di area terdampak',
        icon: '🚽',
        energyCost: 20,
        timeCost: 40,
        effectiveness: 0.35,
        requiredForTypes: ['diare']
    },
    oralit_campaign: {
        id: 'oralit_campaign',
        name: 'Kampanye Oralit',
        description: 'Distribusi dan edukasi penggunaan oralit untuk mencegah dehidrasi',
        icon: '🥤',
        energyCost: 15,
        timeCost: 30,
        effectiveness: 0.3,
        requiredForTypes: ['diare']
    },
    mask_campaign: {
        id: 'mask_campaign',
        name: 'Kampanye Masker & Etika Batuk',
        description: 'Edukasi pencegahan penularan ISPA',
        icon: '😷',
        energyCost: 15,
        timeCost: 30,
        effectiveness: 0.35,
        requiredForTypes: ['ispa']
    },
    ventilation: {
        id: 'ventilation',
        name: 'Perbaikan Ventilasi Rumah',
        description: 'Inspeksi dan rekomendasi ventilasi yang baik',
        icon: '🪟',
        energyCost: 20,
        timeCost: 45,
        effectiveness: 0.3,
        requiredForTypes: ['ispa']
    },
    education: {
        id: 'education',
        name: 'Penyuluhan Kesehatan',
        description: 'Edukasi pencegahan penyakit di rumah warga',
        icon: '📚',
        energyCost: 15,
        timeCost: 30,
        effectiveness: 0.25,
        requiredForTypes: ['dbd', 'malaria', 'diare', 'ispa']
    }
};

/**
 * Check if an outbreak should be triggered based on recent patient history
 * @param {Array} history - Patient history array
 * @param {Object} villageData - Village data with families
 * @param {number} currentDay - Current game day
 * @param {Array} activeOutbreaks - Currently active outbreaks
 * @returns {Object|null} - New outbreak object or null
 */
export function checkForOutbreakTrigger(history, villageData, currentDay, activeOutbreaks = []) {
    if (!history || !villageData || !villageData.families) return null;

    // Ensure activeOutbreaks is an array
    const outbreaksArray = Array.isArray(activeOutbreaks) ? activeOutbreaks : [];

    // Only check last 7 days of history
    const recentHistory = history.filter(p => (currentDay - (p.day || 0)) <= 7);

    // Check each outbreak type
    for (const [_typeKey, outbreakType] of Object.entries(OUTBREAK_TYPES)) {
        // Skip if already have an active outbreak of this type
        if (outbreaksArray.some(o => o.type === outbreakType.id && !o.resolved)) {
            continue;
        }

        // Find cases matching this outbreak type
        const matchingCases = recentHistory.filter(p => {
            const diagCode = p.medicalData?.diagnosisCode || '';
            return outbreakType.triggerCodes.some(code => diagCode.startsWith(code));
        });

        // Check if we have enough cases to trigger
        if (matchingCases.length >= outbreakType.minCasesToTrigger) {
            // Find affected houses
            const affectedHouseIds = new Set();
            matchingCases.forEach(p => {
                const familyId = p.hidden?.familyId;
                if (familyId) {
                    const family = villageData.families.find(f => f.id === familyId);
                    if (family?.houseId) {
                        affectedHouseIds.add(family.houseId);
                    }
                }
            });

            // Need at least 1 identifiable house
            if (affectedHouseIds.size > 0) {
                // Create outbreak event
                return {
                    id: `outbreak_${outbreakType.id}_${currentDay}_${Date.now()}`,
                    type: outbreakType.id,
                    typeData: outbreakType,
                    triggeredOnDay: currentDay,
                    expiresOnDay: currentDay + outbreakType.duration,
                    affectedHouseIds: Array.from(affectedHouseIds),
                    caseCount: matchingCases.length,
                    resolved: false,
                    actionsPerformed: [],
                    resolutionProgress: 0, // 0-100%
                    notified: false
                };
            }
        }
    }

    return null;
}

/**
 * Apply a response action to an outbreak
 * @param {Object} outbreak - The outbreak object
 * @param {string} actionId - Action ID to perform
 * @returns {Object} - Updated outbreak with new progress
 */
export function applyOutbreakAction(outbreak, actionId) {
    const action = OUTBREAK_ACTIONS[actionId];
    if (!action) return outbreak;

    // Check if action already performed
    if (outbreak.actionsPerformed.includes(actionId)) {
        return outbreak;
    }

    // Add action and update progress
    const newActionsPerformed = [...outbreak.actionsPerformed, actionId];
    const progressIncrease = action.effectiveness * 100;
    const newProgress = Math.min(100, outbreak.resolutionProgress + progressIncrease);

    return {
        ...outbreak,
        actionsPerformed: newActionsPerformed,
        resolutionProgress: newProgress,
        resolved: newProgress >= 100
    };
}

/**
 * Get available actions for an outbreak type
 * @param {string} outbreakTypeId - Outbreak type ID
 * @returns {Array} - Array of available action objects
 */
export function getAvailableActions(outbreakTypeId) {
    const outbreakType = Object.values(OUTBREAK_TYPES).find(t => t.id === outbreakTypeId);
    if (!outbreakType) return [];

    return outbreakType.responseActions.map(actionId => OUTBREAK_ACTIONS[actionId]).filter(Boolean);
}

/**
 * Calculate patient generation multiplier based on active outbreaks
 * @param {Array} activeOutbreaks - Array of active outbreak objects
 * @returns {number} - Multiplier for patient generation (1.0 = normal)
 */
export function getPatientSpikeMultiplier(activeOutbreaks) {
    if (!activeOutbreaks || !Array.isArray(activeOutbreaks) || activeOutbreaks.length === 0) return 1.0;

    const unresolvedOutbreaks = activeOutbreaks.filter(o => !o.resolved);
    if (unresolvedOutbreaks.length === 0) return 1.0;

    // Use the highest multiplier among active outbreaks
    const maxMultiplier = Math.max(
        ...unresolvedOutbreaks.map(o => o.typeData?.patientSpikeMultiplier || 1.0)
    );

    return maxMultiplier;
}

/**
 * Check for expired outbreaks and apply penalties
 * @param {Array} outbreaks - Array of outbreak objects
 * @param {number} currentDay - Current game day
 * @returns {Object} - { updatedOutbreaks, penalties }
 */
export function checkOutbreakExpiry(outbreaks, currentDay) {
    if (!Array.isArray(outbreaks)) return { updatedOutbreaks: [], penalties: [] };
    const penalties = [];
    const updatedOutbreaks = outbreaks.map(outbreak => {
        if (!outbreak.resolved && currentDay > outbreak.expiresOnDay) {
            // Outbreak expired without resolution - apply penalties
            penalties.push({
                outbreakId: outbreak.id,
                type: outbreak.type,
                reputationPenalty: -10,
                message: `🦠 Wabah ${outbreak.typeData?.name || outbreak.type} tidak tertangani. Reputasi menurun.`
            });
            return { ...outbreak, resolved: true, expired: true };
        }
        return outbreak;
    });

    return { updatedOutbreaks, penalties };
}
