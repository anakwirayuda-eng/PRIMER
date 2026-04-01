/**
 * bridgeSeasonalState.js
 * 
 * Helper murni untuk mengevaluasi status mekanik Jembatan Gantung Cikapas
 * yang menghubungkan sektor Timur (Sungai) berdasarkan kondisi musim.
 */
import { seedKey, chanceFromSeed } from '../../utils/deterministicRandom.js';
import { getSeasonForDay } from '../../game/IKMEventEngine.js';

const BRIDGE_OUTAGE_DURATION_DAYS = 3;

function normalizeBridgeOutageUntilDay(outageUntilDay = 0) {
    if (typeof outageUntilDay !== 'number' || !Number.isFinite(outageUntilDay) || outageUntilDay < 1) {
        return 0;
    }

    return Math.trunc(outageUntilDay);
}

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

/**
 * Validasi apakah hari ini mengalami cuaca hujan ekstrem (jembatan berpotensi putus)
 * 
 * @param {number} day - Hari simulasi (1-100)
 * @returns {boolean} True jika hari ini adalah cuaca hujan ekstrem
 */
export function isExtremeRainDay(day) {
    if (typeof day !== 'number' || isNaN(day) || day < 1) return false;
    
    const rawSeason = getSeasonForDay(day);
    // getSeasonForDay usually returns 'dry' or 'rainy' (based on English) 
    // but handle 'kemarau' / 'hujan' just in case
    const normalized = typeof rawSeason === 'string' ? rawSeason.toLowerCase().trim() : 'kemarau';
    const isRainy = normalized === 'rainy' || normalized === 'hujan';
    
    if (!isRainy) {
        return false;
    }

    return chanceFromSeed(seedKey('bridge-extreme', day), 0.08);
}

export function isBridgeOutageActive(day, outageUntilDay = 0) {
    if (typeof day !== 'number' || isNaN(day) || day < 1) {
        return false;
    }

    return normalizeBridgeOutageUntilDay(outageUntilDay) >= Math.trunc(day);
}

export function resolveBridgeOutageUntilDay(day, currentOutageUntilDay = 0) {
    const safeCurrentOutageUntilDay = normalizeBridgeOutageUntilDay(currentOutageUntilDay);

    if (typeof day !== 'number' || isNaN(day) || day < 1) {
        return safeCurrentOutageUntilDay;
    }

    const safeDay = Math.trunc(day);
    if (!isExtremeRainDay(safeDay)) {
        return safeCurrentOutageUntilDay;
    }

    const isolationDays = getBridgeSeasonalState('hujan', true).isolationDays || BRIDGE_OUTAGE_DURATION_DAYS;
    return Math.max(safeCurrentOutageUntilDay, safeDay + isolationDays - 1);
}
