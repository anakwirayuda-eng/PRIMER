/**
 * facilityUpgradeVisual.js
 * 
 * Helper murni untuk mengevaluasi status perubahan visual sprite dan 
 * efek aura/buff dari fasilitas UKM (MCK, PAMSIMAS, Posyandu) ketika
 * mengalami 'upgrade' setelah pemain menuntaskan skenario relevan.
 */

// Kamus dataset upgrade visual dari blueprint
const UPGRADE_DICTIONARY = {
    'mck': {
        baseSprite: 'mck_basic',
        upgradedSprite: 'mck_keramik',
        auraBuff: 'jamban_rt'
    },
    'pamsimas': {
        baseSprite: 'pamsimas_rusak',
        upgradedSprite: 'pamsimas_aktif',
        auraBuff: 'air_rw'
    },
    'posyandu': {
        baseSprite: 'posyandu_sederhana',
        upgradedSprite: 'posyandu_mandiri',
        auraBuff: 'xp_posyandu'
    }
};

/**
 * Mendapatkan wujud sprite dan buff pasif dari fasilitas berbasis status.
 * 
 * @param {string} type - Tipe faskes (ex: 'mck', 'pamsimas', 'posyandu')
 * @param {boolean} isUpgraded - Flag apakah faskes tersebut sukses di-upgrade
 * @returns {object} Status visual dan mekanik { spriteKey, isUpgraded, auraBuff }
 */
export function getFacilityUpgradeVisual(type, isUpgraded = false) {
    // 1. Validasi / Sanitasi Tipe
    const safeType = typeof type === 'string' ? type.toLowerCase().trim() : '';
    const config = UPGRADE_DICTIONARY[safeType];

    // Jika tipe sama sekali tidak valid atau tidak ada di kamus
    if (!config) {
        return {
            spriteKey: null,
            isUpgraded: false,
            auraBuff: null
        };
    }

    // 2. Kalkulasi Pengembalian State
    const upgradeFlag = Boolean(isUpgraded);

    return {
        spriteKey: upgradeFlag ? config.upgradedSprite : config.baseSprite,
        isUpgraded: upgradeFlag,
        auraBuff: upgradeFlag ? config.auraBuff : null
    };
}
