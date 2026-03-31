/**
 * fobUpgrade.js
 * 
 * Helper murni untuk mengevaluasi status "Forward Operating Base" (FOB)
 * yang terkait dengan Pustu dan Polindes pada peta desa. Menentukan 
 * fungsionalitas dan fitur layanan berdasarkan progres (level) upgrade fasilitas.
 */

/**
 * Dapatkan state mekanisme objek FOB berdassarkan input level upgradenya.
 * 
 * @param {number} level - Level upgrade fasilitas satelit (0, 1, atau 2)
 * @returns {object} Status fitur yang aktif di FOB tersebut
 */
export function getFOBUpgradeState(level) {
    // 1. Parsing and Clamping Safety
    let safeLevel = 0;
    if (typeof level === 'number' && !isNaN(level)) {
        safeLevel = Math.floor(level);
        // Clamp bounds 0 to 2
        safeLevel = Math.max(0, Math.min(2, safeLevel));
    }

    // 2. Blueprint Semantic Return
    if (safeLevel === 2) {
        return {
            level: 2,
            isActive: true,
            isRestPoint: true,
            energyRecovery: 10,
            availableServices: ['anc_kia', 'pengobatan_dasar']
        };
    } else if (safeLevel === 1) {
        return {
            level: 1,
            isActive: true,
            isRestPoint: true,
            energyRecovery: 10,
            availableServices: []
        };
    }

    // Default: Level 0
    return {
        level: 0,
        isActive: false,
        isRestPoint: false,
        energyRecovery: 0,
        availableServices: []
    };
}
