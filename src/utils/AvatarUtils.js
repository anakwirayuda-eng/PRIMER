/**
 * @reflection
 * [IDENTITY]: AvatarUtils
 * [PURPOSE]: Utility for rendering patient avatars based on age and gender. Uses a sprite sheet (/avatars.png) with a 4x3 grid.
 * [STATE]: Experimental
 * [ANCHOR]: AVATAR_POSITIONS
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * Utility for rendering patient avatars based on age and gender.
 * Uses a sprite sheet (/avatars.png) with a 4x3 grid.
 */

// Avatar sprite positions (4x3 grid in /avatars.png)
export const AVATAR_POSITIONS = {
    'young_male': { x: 0, y: 0 },
    'young_female_hijab': { x: 1, y: 0 },
    'middle_male': { x: 2, y: 0 },
    'middle_female': { x: 3, y: 0 },
    'elderly_male_peci': { x: 0, y: 1 },
    'elderly_female': { x: 1, y: 1 },
    'child_male': { x: 2, y: 1 },
    'child_female': { x: 3, y: 1 },
    'male_alt': { x: 0, y: 2 },
    'female_alt': { x: 1, y: 2 },
    'child_male_alt': { x: 2, y: 2 },
    'child_female_alt': { x: 3, y: 2 },
};

/**
 * Normalizes gender input to 'L' or 'P'
 */
export function normalizeGender(gender) {
    if (!gender) return 'L';
    const g = gender.toString().toUpperCase();
    if (g === 'MALE' || g === 'L' || g === 'Laki-laki') return 'L';
    if (g === 'FEMALE' || g === 'P' || g === 'Perempuan') return 'P';
    return 'L';
}

/**
 * Gets the avatar key based on age and gender
 */
export function getAvatarKey(age, gender) {
    const g = normalizeGender(gender);

    if (age < 15) return g === 'L' ? 'child_male' : 'child_female';
    if (age < 40) return g === 'L' ? 'young_male' : 'young_female_hijab';
    if (age < 60) return g === 'L' ? 'middle_male' : 'middle_female';
    return g === 'L' ? 'elderly_male_peci' : 'elderly_female';
}

/**
 * Returns the CSS style object for an avatar background
 */
export function getAvatarStyle(age, gender, size = 80) {
    const key = getAvatarKey(age, gender);
    const pos = AVATAR_POSITIONS[key];

    return {
        backgroundImage: 'url(/avatars.png)',
        backgroundSize: '400% 300%',
        backgroundPosition: `${pos.x * 33.33}% ${pos.y * 50}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundRepeat: 'no-repeat'
    };
}
