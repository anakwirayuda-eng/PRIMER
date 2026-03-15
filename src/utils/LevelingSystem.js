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

/**
 * The current store levels up every fixed 1000 total XP.
 * Keep this helper aligned with that model so selectors and UI remain consistent.
 */
const XP_PER_LEVEL = 1000;

export const getNextLevelXp = () => XP_PER_LEVEL;

/**
 * Check if player levels up.
 * Returns new object with updated stats if leveled up, or same stats if not.
 * @param {object} currentStats - { level, xp, knowledge, maxEnergy, ... }
 * @returns {object} { leveledUp: boolean, stats: object, reward: string }
 */
export const checkLevelUp = (currentStats) => {
    let level = Math.max(1, Number(currentStats?.level) || 1);
    let xp = Math.max(0, Number(currentStats?.xp) || 0);
    let knowledge = Math.max(0, Number(currentStats?.knowledge) || 0);
    let maxEnergy = Math.max(1, Number(currentStats?.maxEnergy) || 100);
    let energy = Math.max(0, Number(currentStats?.energy) || maxEnergy);
    let leveledUp = false;

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
