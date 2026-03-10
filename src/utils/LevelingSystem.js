/**
 * @reflection
 * [IDENTITY]: LevelingSystem
 * [PURPOSE]: Leveling System Utility Defines the XP curve and level-up logic.
 * [STATE]: Experimental
 * [ANCHOR]: getNextLevelXp
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * Leveling System Utility
 * Defines the XP curve and level-up logic.
 */

// Base XP required for Level 1 -> 2
const BASE_XP = 500;

// Exponent for curve (1 = linear, 1.5 = somewhat exponential)
const CURVE_EXPONENT = 1.2;

/**
 * Calculate total XP required to reach the NEXT level.
 * Formula: Floor(BASE_XP * (Level ^ CURVE_EXPONENT))
 * Example with BASE=500, EXP=1.2:
 * Lv 1 -> 2: 500
 * Lv 2 -> 3: 500 * (2^1.2) = 1148 (Total, not incremental) -> usually incremental is better
 */

// Simple Incremental Formula:
// XP needed for current level to next level = Level * 500
export const getNextLevelXp = (level) => {
    return level * 500;
};

/**
 * Check if player levels up.
 * Returns new object with updated stats if leveled up, or same stats if not.
 * @param {object} currentStats - { level, xp, knowledge, maxEnergy, ... }
 * @returns {object} { leveledUp: boolean, stats: object, reward: string }
 */
export const checkLevelUp = (currentStats) => {
    let { level, xp, knowledge, maxEnergy, energy } = currentStats;
    let leveledUp = false;
    let _rewardMsg = '';

    let requiredXp = getNextLevelXp(level);

    while (xp >= requiredXp) {
        xp -= requiredXp;
        level++;
        leveledUp = true;

        // Rewards per level
        knowledge += 1; // Skill point
        maxEnergy += 5; // Stamina boost

        // Fully restore energy on level up
        energy = maxEnergy;

        requiredXp = getNextLevelXp(level);
    }

    if (leveledUp) {
        return {
            leveledUp: true,
            stats: {
                ...currentStats,
                level,
                xp,
                knowledge,
                maxEnergy,
                energy,
                nextLevelXp: requiredXp // Ensure this is always up to date
            },
            reward: `Naik Level ke ${level}! (+1 Skill Point, +5 Max Energy, Energy Refill)`
        };
    }

    return {
        leveledUp: false,
        stats: {
            ...currentStats,
            nextLevelXp: requiredXp // Ensure this is set even if not leveling up
        }
    };
};
