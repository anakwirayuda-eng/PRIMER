/**
 * warungIntel.js
 * 
 * Helper murni untuk implementasi mekanik "Pos Ronda / Warung Kopi Intel".
 * Berfungsi untuk mencari N keluarga terdekat di peta geografis dari origin
 * yang datanya akan terekspos ketika pemain mencari informasi di Pos Ronda.
 */

/**
 * Mendapatkan target intel berupa list keluarga terdekat secara deterministik.
 * 
 * @param {object} origin - Koordinat warung/pos {x, y}
 * @param {object} familyCoords - Record map koordinat keluarga (contoh: { 'kk_1': {x, y} })
 * @param {number} limit - Jumlah rumah maksimal yang direveal (default 5)
 * @returns {Array<{familyId: string, distance: number}>} Array target terdekat (sorted)
 */
export function getWarungIntelTargets(origin, familyCoords, limit = 5) {
    // 1. Validasi Input Safety
    if (!origin || typeof origin.x !== 'number' || typeof origin.y !== 'number') {
        return [];
    }
    if (!familyCoords || typeof familyCoords !== 'object') {
        return [];
    }

    const safeLimit = Math.max(0, Math.floor(limit));
    if (safeLimit === 0) return [];

    // 2. Kalkulasi Jarak Manhattan
    const distances = [];
    for (const [familyId, coords] of Object.entries(familyCoords)) {
        // Abaikan entri invalid
        if (!coords || typeof coords.x !== 'number' || typeof coords.y !== 'number') {
            continue;
        }

        const distance = Math.abs(coords.x - origin.x) + Math.abs(coords.y - origin.y);
        distances.push({ familyId, distance });
    }

    // 3. Sort Deterministik: utamakan jarak terkecil. 
    //    Tie-breaker (jarak sama): Ascending alphabetical dari ID (kk_1, kk_2).
    distances.sort((a, b) => {
        if (a.distance !== b.distance) {
            return a.distance - b.distance;
        }
        // String localeCompare default behaviour or strict string comparison for determinism
        if (a.familyId < b.familyId) return -1;
        if (a.familyId > b.familyId) return 1;
        return 0;
    });

    // 4. Potong sesuai limit
    return distances.slice(0, safeLimit);
}
