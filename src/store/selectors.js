import { calculateGlobalBuffs } from '../game/GameCore.js';
import { getNextLevelXp } from '../utils/LevelingSystem.js';
import { normalizeDailyArchive } from '../utils/archiveNormalization.js';
import { getUnlockedVehicles } from '../domains/village/vehicleProgression.js';
import { getWarungIntelCost, canAffordWarungIntel } from '../domains/village/warungIntelCost.js';
import { calculateAverageIksFromFamilies } from '../utils/villageMetrics.js';
import { calculateKBKPerformanceMultiplier } from '../domains/village/kbkPerformance.js';
import { getSeasonForDay } from '../game/IKMEventEngine.js';
import { getBridgeSeasonalState } from '../domains/village/bridgeSeasonalState.js';
import { ACCREDITATION_MULTIPLIER } from './helpers/archiveHelpers.js';
import { isLocalChampionEligible } from '../domains/village/localChampion.js';
import { getChampionProtectedFamilies } from '../domains/village/championProtection.js';
import { getSpatialContext } from '../domains/village/spatialContext.js';

const normalizeSkills = (skills) => Array.isArray(skills)
    ? skills
    : Object.entries(skills || {})
        .filter(([, unlocked]) => Boolean(unlocked))
        .map(([skillId]) => skillId);

/**
 * @reflection
 * [IDENTITY]: selectors
 * [PURPOSE]: Optimized selectors for useGameStore to avoid unnecessary re-renders and centralize derived state.
 * [STATE]: Modular
 * [LAST_UPDATE]: 2026-02-14
 */

/**
 * Derived KPIs for the Finance section
 */
export const selectDerivedFinance = (state) => {
    const { finance } = state;
    const {
        totalPatients = 0, correctDiagnoses = 0, _correctTreatments = 0, referrals = 0,
        nonSpecialisticReferrals = 0, treatedCases = 0, inappropriateTreat = 0,
        antibioticPrescriptions = 0, rationalAntibiotics = 0, patientSatisfaction = [],
        bpjsPatients = 0, umumPatients = 0
    } = finance.kpi || {};

    const stats = finance.stats || {};
    const currentDay = Number(state?.world?.day) || 1;
    const currentCycle = Math.max(1, Math.floor((currentDay - 1) / 30) + 1);
    const currentCycleStartDay = ((currentCycle - 1) * 30) + 1;
    const currentCycleReceipts = normalizeDailyArchive(Array.isArray(state?.clinical?.dailyArchive) ? state.clinical.dailyArchive : [])
        .filter(entry => {
            const entryDay = Number(entry?.day) || 0;
            return entryDay >= currentCycleStartDay && entryDay < currentDay;
        })
        .reduce((total, entry) => total + (Number(entry?.revenue) || 0), 0);

    const clinicalAccuracy = totalPatients > 0 ? Math.round((correctDiagnoses / totalPatients) * 100) : 0;
    const referralRate = totalPatients > 0 ? Math.round((referrals / totalPatients) * 100) : 0;
    const rrns = referrals > 0 ? Math.round((nonSpecialisticReferrals / referrals) * 100) : 0;
    const treatmentAppropriateRate = treatedCases > 0 ? Math.round(((treatedCases - inappropriateTreat) / treatedCases) * 100) : 0;
    const antibioticStewardship = antibioticPrescriptions > 0 ? Math.round((rationalAntibiotics / antibioticPrescriptions) * 100) : 0;
    const avgSatisfaction = patientSatisfaction.length > 0 ? Math.round(patientSatisfaction.reduce((a, b) => a + b, 0) / patientSatisfaction.length) : 0;

    const totalExpense = (stats.pengeluaranObat || 0) + (stats.pengeluaranLab || 0) + (stats.pengeluaranOperasional || 0);
    const availableFunds = (stats.kapitasi || 0) + (stats.pendapatanUmum || 0);

    const overallScore = Math.round(
        (clinicalAccuracy * 0.25) +
        (treatmentAppropriateRate * 0.20) +
        (Math.max(0, 15 - Math.max(0, referralRate - 15)) * 0.1) +
        ((100 - Math.min(rrns, 100) * 2) * 0.15) +
        (antibioticStewardship * 0.15) +
        (avgSatisfaction * 0.15)
    );

    return {
        ...finance,
        ...finance.stats,
        ...finance.kpi,
        clinicalAccuracy,
        referralRate,
        rrns,
        rns: rrns,
        treatmentAppropriateRate,
        antibioticStewardship,
        avgSatisfaction,
        totalExpense,
        availableFunds,
        currentCycleReceipts,
        totalRevenue: availableFunds, // Legacy alias used by older viewers for current liquid funds
        netBalance: availableFunds, // Legacy alias kept for compatibility with existing saldo widgets
        overallScore,
        bpjsPatients,
        umumPatients
    };
};

/**
 * Enhanced Player Stats selector
 */
export const selectPlayerStats = (state) => {
    const { player } = state;
    const level = Math.max(1, Number(player.profile?.level) || 1);
    const nextLevelXp = getNextLevelXp(level);
    const storedXp = Math.max(0, Number(player.profile?.xp) || 0);
    const xpAtLevelStart = (level - 1) * nextLevelXp;
    const isLegacyTotalXp = level > 1 && storedXp >= xpAtLevelStart;
    const levelProgressXp = isLegacyTotalXp
        ? Math.max(0, Math.min(nextLevelXp, storedXp - xpAtLevelStart))
        : Math.max(0, Math.min(nextLevelXp, storedXp));
    const totalXp = isLegacyTotalXp ? storedXp : xpAtLevelStart + levelProgressXp;

    return {
        ...player.profile,
        knowledge: Math.max(0, Number(player.profile?.knowledge) || 0),
        skills: normalizeSkills(player.profile?.skills),
        xp: levelProgressXp,
        totalXp,
        nextLevelXp,
        playerStats: player.profile, // Legacy shim
    };
};

/**
 * Clinical State selector
 */
export const selectClinical = (state) => {
    return {
        ...state.clinical,
        ...state.clinicalActions,
        reputation: state.player.profile.reputation
    };
};

/**
 * Global Buffs selector
 */
export const selectBuffs = (state) => calculateGlobalBuffs(state);

/**
 * Unlocked Village Vehicles selector
 */
export const selectUnlockedVillageVehicles = (state) => {
    try {
        const day = Number(state?.world?.day);
        const kapitasi = Number(state?.finance?.stats?.kapitasi) || 0;
        const pendapatanUmum = Number(state?.finance?.stats?.pendapatanUmum) || 0;
        const balance = kapitasi + pendapatanUmum;
        
        const unlocked = getUnlockedVehicles(day, balance);
        return (!unlocked || unlocked.length === 0) ? ['jalan_kaki'] : unlocked;
    } catch {
        return ['jalan_kaki'];
    }
};

/**
 * Warung Intel State selector
 */
export const selectWarungIntelState = (state) => {
    try {
        const energy = Number(state?.player?.profile?.energy) || 0;
        const kapitasi = Number(state?.finance?.stats?.kapitasi) || 0;
        const pendapatanUmum = Number(state?.finance?.stats?.pendapatanUmum) || 0;
        const balance = kapitasi + pendapatanUmum;
        
        return {
            ...getWarungIntelCost(),
            canAfford: canAffordWarungIntel(energy, balance)
        };
    } catch {
        return {
            ...getWarungIntelCost(),
            canAfford: false
        };
    }
};

/**
 * KBK Performance State selector
 */
export const selectKBKPerformanceState = (state) => {
    try {
        const families = state?.publicHealth?.villageData?.families;
        if (!Array.isArray(families) || families.length === 0) {
            return { avgIKS: 0, multiplier: 1.0 };
        }
        
        const avgIKS = calculateAverageIksFromFamilies(families);
        const multiplier = calculateKBKPerformanceMultiplier(avgIKS);
        
        return {
            avgIKS,
            multiplier
        };
    } catch {
        return { avgIKS: 0, multiplier: 1.0 };
    }
};

/**
 * Bridge Seasonal State selector
 */
export const selectBridgeSeasonalState = (state, isExtremeRain = false) => {
    try {
        const day = Number(state?.world?.day);
        if (Number.isNaN(day) || day < 1) {
            return getBridgeSeasonalState('kemarau', false); // fallback normal state
        }
        
        const rawSeason = getSeasonForDay(day);
        const mappedSeason = rawSeason === 'rainy' ? 'hujan' : 'kemarau';
        
        return getBridgeSeasonalState(mappedSeason, isExtremeRain);
    } catch {
        return getBridgeSeasonalState('kemarau', false);
    }
};

/**
 * Combined Village Travel Context selector
 */
export const selectVillageTravelContext = (state, isExtremeRain = false) => {
    return {
        unlockedVehicles: selectUnlockedVillageVehicles(state),
        bridgeState: selectBridgeSeasonalState(state, isExtremeRain)
    };
};

/**
 * Projected Monthly Kapitasi selector
 */
export const selectProjectedMonthlyKapitasi = (state, accreditation = 'Dasar') => {
    try {
        const baseKapitasi = 50000000;
        const accreditationMultiplier = ACCREDITATION_MULTIPLIER[accreditation] ?? 1.0;
        
        const kbkState = selectKBKPerformanceState(state);
        const kbkMultiplier = kbkState.multiplier ?? 1.0;
        
        const projectedMonthlyKapitasi = baseKapitasi * accreditationMultiplier * kbkMultiplier;
        
        return {
            baseKapitasi,
            accreditationMultiplier,
            kbkMultiplier,
            projectedMonthlyKapitasi
        };
    } catch {
        return {
            baseKapitasi: 50000000,
            accreditationMultiplier: 1.0,
            kbkMultiplier: 1.0,
            projectedMonthlyKapitasi: 50000000
        };
    }
};

/**
 * Local Champion State selector
 */
export const selectLocalChampionState = (state) => {
    try {
        const villageData = state?.publicHealth?.villageData;
        const families = villageData?.families;

        if (!Array.isArray(families) || families.length === 0) {
            return {
                championFamilyIds: [],
                protectedFamilyIds: [],
                championCount: 0,
                protectedCount: 0
            };
        }

        const championFamilyIds = families
            .filter(f => isLocalChampionEligible(f.iksScore))
            .map(f => f.id);

        const spatialContext = getSpatialContext(villageData);
        let protectedFamilyIds = [];
        
        if (spatialContext?.familyCoords && championFamilyIds.length > 0) {
            protectedFamilyIds = getChampionProtectedFamilies(championFamilyIds, spatialContext.familyCoords, 3);
        }

        return {
            championFamilyIds,
            protectedFamilyIds,
            championCount: championFamilyIds.length,
            protectedCount: protectedFamilyIds.length
        };
    } catch {
        return {
            championFamilyIds: [],
            protectedFamilyIds: [],
            championCount: 0,
            protectedCount: 0
        };
    }
};
