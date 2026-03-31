import { calculateGlobalBuffs } from '../game/GameCore.js';
import { getNextLevelXp } from '../utils/LevelingSystem.js';
import { normalizeDailyArchive } from '../utils/archiveNormalization.js';
import { getUnlockedVehicles } from '../domains/village/vehicleProgression.js';
import { getWarungIntelCost, canAffordWarungIntel } from '../domains/village/warungIntelCost.js';

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
