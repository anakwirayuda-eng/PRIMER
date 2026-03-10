import { calculateGlobalBuffs } from '../game/GameCore.js';

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

    const clinicalAccuracy = totalPatients > 0 ? Math.round((correctDiagnoses / totalPatients) * 100) : 0;
    const referralRate = totalPatients > 0 ? Math.round((referrals / totalPatients) * 100) : 0;
    const rrns = referrals > 0 ? Math.round((nonSpecialisticReferrals / referrals) * 100) : 0;
    const treatmentAppropriateRate = treatedCases > 0 ? Math.round(((treatedCases - inappropriateTreat) / treatedCases) * 100) : 100;
    const antibioticStewardship = antibioticPrescriptions > 0 ? Math.round((rationalAntibiotics / antibioticPrescriptions) * 100) : 100;
    const avgSatisfaction = patientSatisfaction.length > 0 ? Math.round(patientSatisfaction.reduce((a, b) => a + b, 0) / patientSatisfaction.length) : 80;

    const totalExpense = (stats.pengeluaranObat || 0) + (stats.pengeluaranLab || 0) + (stats.pengeluaranOperasional || 0);
    const totalRevenue = (stats.kapitasi || 0) + (stats.pendapatanUmum || 0);

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
        totalRevenue,
        netBalance: totalRevenue - totalExpense,
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
    return {
        ...player.profile,
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