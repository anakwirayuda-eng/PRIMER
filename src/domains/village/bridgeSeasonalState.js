/**
 * bridgeSeasonalState.js
 * 
 * Helper murni untuk mengevaluasi status mekanik Jembatan Gantung Cikapas
 * yang menghubungkan sektor Timur (Sungai) berdasarkan kondisi musim.
 */

/**
 * Mengembalikan objek status mekanik dari Jembatan Gantung.
 * 
 * @param {string} season - Musim saat ini ('kemarau' atau 'hujan')
 * @param {boolean} isExtremeRain - Flag trigger event cuaca ekstrem (banjir bandang/jembatan putus)
 * @returns {object} Status parameter navigasi ke Timur
 */
export function getBridgeSeasonalState(season = 'kemarau', isExtremeRain = false) {
    // Normalisasi input
    const normalizedSeason = (typeof season === 'string') ? season.toLowerCase().trim() : 'kemarau';
    const isExtreme = Boolean(isExtremeRain);

    // Default state: Kemarau (Normal)
    if (normalizedSeason !== 'hujan' && !isExtreme) {
        return {
            status: 'normal',
            eastTravelMultiplier: 1.0,   // 0% penalty
            isIsolated: false,
            isAmbulanceDelayed: false,
            severityBoost: 0,
            isolationDays: 0
        };
    }

    // State Ekstrem overrides musim biasa
    if (isExtreme) {
        return {
            status: 'putus',
            eastTravelMultiplier: Infinity,  // Tidak bisa dilewati secara matematis
            isIsolated: true,                // Flag mutlak isolasi RW Timur
            isAmbulanceDelayed: true,        // Akses ambulans putus
            severityBoost: 1,                // Pasien tiba dalam kondisi lebih buruk (+1 tier)
            isolationDays: 3                 // Lama terisolasi (waktu perbaikan)
        };
    }

    // State Hujan (Rawan Banjir)
    return {
        status: 'rawan_banjir',
        eastTravelMultiplier: 2.0,       // +100% travel energy cost penalty
        isIsolated: false,
        isAmbulanceDelayed: false,
        severityBoost: 0,
        isolationDays: 0
    };
}
