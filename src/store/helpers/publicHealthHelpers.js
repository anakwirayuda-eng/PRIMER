/**
 * Public health helpers for store.
 * Pure functions only — NO store imports.
 */
import { chanceFromSeed, pickDeterministic, seededBetween, seededInt } from '../../utils/deterministicRandom.js';
import { calculateIKS } from '../../game/GameCore.js';
import { spendOperationalFunds } from '../../utils/operationalFunds.js';
import { sanitizePlayerProfile, applyXpGainToProfile, clampEnergyToProfile } from './playerHelpers.js';

const OUTBREAK_RISK_WINDOW_DAYS = 7;

export const buildProlanisBpjsNumber = (patient, day) => {
    const patientSeed = patient?.id || patient?.name || 'prolanis';
    const suffix = String(seededInt(`prolanis:${patientSeed}:${day}`, 10000)).padStart(4, '0');
    return `PRO-${suffix}`;
};

export const applyFamilyIndicatorDrift = (family, seed, options = {}) => {
    if (!family) {
        return family;
    }

    if (options?.protectedFamilyIds?.includes(family.id)) {
        return family;
    }

    if (!family?.indicators || !chanceFromSeed(seed, 0.05)) {
        return family;
    }

    const keys = Object.keys(family.indicators);
    if (keys.length === 0) {
        return family;
    }

    const randomKey = pickDeterministic(keys, seed, 1);
    const indicators = {
        ...family.indicators,
        [randomKey]: chanceFromSeed(seed, 0.6, 2)
    };
    return { ...family, indicators, iksScore: calculateIKS(indicators) };
};

export const applyStaffMoraleDecay = (hiredStaff, seedPrefix) => {
    return hiredStaff.map((staff, index) => ({
        ...staff,
        morale: Math.max(
            0,
            (staff.morale || 70) - seededBetween(`${seedPrefix}:${staff.id || index}`, 2, 7)
        )
    }));
};

export const pruneOutbreakRiskModifiers = (modifiers = {}, currentDay = 1) => {
    const protectedUntil = Object.fromEntries(
        Object.entries(modifiers?.protectedUntil || {}).filter(([, until]) => Number(until) >= currentDay)
    );
    const vulnerableUntil = Object.fromEntries(
        Object.entries(modifiers?.vulnerableUntil || {}).filter(([, until]) => Number(until) >= currentDay)
    );
    return { protectedUntil, vulnerableUntil };
};

export const applyIkmOutbreakRiskModifiers = (modifiers = {}, impact = {}, currentDay = 1) => {
    const next = pruneOutbreakRiskModifiers(modifiers, currentDay);
    const protectedType = typeof impact?.outbreak_risk_reduction === 'string'
        ? impact.outbreak_risk_reduction.toLowerCase()
        : '';
    const vulnerableType = typeof impact?.outbreak_risk === 'string'
        ? impact.outbreak_risk.toLowerCase()
        : '';
    const expiryDay = currentDay + OUTBREAK_RISK_WINDOW_DAYS;

    if (protectedType) {
        delete next.vulnerableUntil[protectedType];
        next.protectedUntil[protectedType] = Math.max(Number(next.protectedUntil[protectedType] || 0), expiryDay);
    }

    if (vulnerableType) {
        delete next.protectedUntil[vulnerableType];
        next.vulnerableUntil[vulnerableType] = Math.max(Number(next.vulnerableUntil[vulnerableType] || 0), expiryDay);
    }

    return next;
};

export const applyStoryImpactToDraft = (state, impact) => {
    if (!impact) {
        return { success: true };
    }

    if (impact.balance) {
        const balanceDelta = Number(impact.balance) || 0;
        if (balanceDelta < 0) {
            const nextStats = spendOperationalFunds(state.finance.stats, Math.abs(balanceDelta));
            if (!nextStats) {
                return { success: false, message: 'Dana aktif tidak cukup untuk pilihan ini.' };
            }
            state.finance.stats = nextStats;
        } else if (balanceDelta > 0) {
            state.finance.stats.pendapatanUmum += balanceDelta;
        }
    }

    let nextProfile = { ...state.player.profile };

    if (impact.energy) {
        nextProfile.energy = clampEnergyToProfile(nextProfile, nextProfile.energy + impact.energy);
    }

    if (impact.spirit) {
        nextProfile.spirit = Math.max(0, Math.min(100, nextProfile.spirit + impact.spirit));
    }

    if (impact.reputation) {
        nextProfile.reputation = Math.max(0, Math.min(100, nextProfile.reputation + impact.reputation));
    }

    nextProfile = sanitizePlayerProfile(nextProfile);
    state.player.profile = impact.xp
        ? applyXpGainToProfile(nextProfile, impact.xp)
        : nextProfile;

    return { success: true };
};

export { OUTBREAK_RISK_WINDOW_DAYS };
