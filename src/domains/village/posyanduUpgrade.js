/**
 * posyanduUpgrade.js
 * 
 * Helper murni untuk mengevaluasi status mekanik dari Posyandu
 * (Pusat Pelayanan Terpadu) yang dapat berevolusi menjadi Posyandu Mandiri
 * setelah di-trigger oleh rentetan kunjungan pelayanan sukses (streak).
 */

const REQUIRED_POSYANDU_STREAK = 3;

/**
 * Mendapatkan ringkasan status peningkatan kapabilitas fasilitas Posyandu.
 * 
 * @param {number} successStreak - Rentetan bulan/siklus pelayanan posyandu yang sukses tanpa gagal
 * @returns {object} Status upgrade Posyandu (isUpgraded, requiredStreak, currentStreak, remainingToUpgrade)
 */
export function getPosyanduUpgradeState(successStreak) {
    // 1. Parsing and Clamping Safety
    let safeStreak = 0;
    if (typeof successStreak === 'number' && !isNaN(successStreak)) {
        safeStreak = Math.max(0, Math.floor(successStreak));
    }

    // 2. Kalkulasi Kalkulus Upgrades
    const isUpgraded = safeStreak >= REQUIRED_POSYANDU_STREAK;
    const remainingToUpgrade = Math.max(0, REQUIRED_POSYANDU_STREAK - safeStreak);

    return {
        isUpgraded,
        requiredStreak: REQUIRED_POSYANDU_STREAK,
        currentStreak: safeStreak,
        remainingToUpgrade
    };
}
