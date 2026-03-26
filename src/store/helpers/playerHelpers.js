/**
 * Player profile helpers for store.
 * Pure functions only — NO store imports.
 */
import { INITIAL_PLAYER_STATE } from '../../game/GameCore.js';
import { checkLevelUp, getNextLevelXp } from '../../utils/LevelingSystem.js';
import { clampNumber } from './storeUtils.js';

const normalizeSkillList = (skills) => {
    if (Array.isArray(skills)) {
        return [...new Set(skills.filter((skillId) => typeof skillId === 'string' && skillId.length > 0))];
    }

    if (skills && typeof skills === 'object') {
        return Object.entries(skills)
            .filter(([, unlocked]) => Boolean(unlocked))
            .map(([skillId]) => skillId);
    }

    return [];
};

export const getProfileLevel = (profile = {}) => Math.max(1, Number(profile.level) || INITIAL_PLAYER_STATE.level);

export const clampEnergyToProfile = (profile, energy) => Math.max(
    0,
    Math.min(profile?.maxEnergy || INITIAL_PLAYER_STATE.maxEnergy, Number(energy) || 0)
);

const getCurrentLevelXp = (profile = {}) => {
    const level = getProfileLevel(profile);
    const nextLevelXp = getNextLevelXp(level);
    const storedXp = Math.max(0, Number(profile.xp) || 0);
    const xpAtLevelStart = (level - 1) * nextLevelXp;

    if (level > 1 && storedXp >= xpAtLevelStart) {
        return Math.max(0, Math.min(nextLevelXp, storedXp - xpAtLevelStart));
    }

    return Math.max(0, Math.min(nextLevelXp, storedXp));
};

export const sanitizePlayerProfile = (profile = {}) => {
    const level = getProfileLevel(profile);
    const maxEnergy = clampNumber(
        profile.maxEnergy,
        1,
        150,
        INITIAL_PLAYER_STATE.maxEnergy
    );

    return {
        ...INITIAL_PLAYER_STATE,
        ...profile,
        level,
        xp: getCurrentLevelXp({ ...profile, level }),
        knowledge: Math.max(0, Number(profile.knowledge) || 0),
        maxEnergy,
        energy: clampEnergyToProfile({ maxEnergy }, profile.energy ?? maxEnergy),
        reputation: clampNumber(
            profile.reputation,
            0,
            100,
            INITIAL_PLAYER_STATE.reputation
        ),
        stress: clampNumber(
            profile.stress,
            0,
            100,
            INITIAL_PLAYER_STATE.stress
        ),
        spirit: clampNumber(
            profile.spirit,
            0,
            100,
            INITIAL_PLAYER_STATE.spirit
        ),
        skills: normalizeSkillList(profile.skills)
    };
};

export const applyXpGainToProfile = (profile, amount = 0) => {
    const safeProfile = sanitizePlayerProfile(profile);
    const xpGain = Math.max(0, Number(amount) || 0);

    if (xpGain === 0) {
        return safeProfile;
    }

    const result = checkLevelUp({
        ...safeProfile,
        xp: safeProfile.xp + xpGain
    });

    return sanitizePlayerProfile({
        ...safeProfile,
        ...result.stats
    });
};

export const spendXpFromProfile = (profile, cost = 0) => {
    const safeProfile = sanitizePlayerProfile(profile);
    const xpCost = Math.max(0, Number(cost) || 0);

    if (safeProfile.xp < xpCost) {
        return { success: false, profile: safeProfile };
    }

    return {
        success: true,
        profile: sanitizePlayerProfile({
            ...safeProfile,
            xp: safeProfile.xp - xpCost
        })
    };
};

export const createStartingPlayerProfile = (profile = {}) => {
    const initialStats = profile.initialStats || {};
    const maxEnergy = clampNumber(
        profile.maxEnergy ?? initialStats.maxEnergy,
        1,
        150,
        INITIAL_PLAYER_STATE.maxEnergy
    );
    const reputation = clampNumber(
        profile.reputation ?? initialStats.baseReputation,
        0,
        100,
        INITIAL_PLAYER_STATE.reputation
    );

    return sanitizePlayerProfile({
        ...profile,
        maxEnergy,
        energy: maxEnergy,
        reputation,
        spirit: INITIAL_PLAYER_STATE.spirit
    });
};
