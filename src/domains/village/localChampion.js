/**
 * localChampion.js
 * 
 * Helper murni untuk mengevaluasi apakah sebuah keluarga mencapai
 * status target "Kader Lokal / Local Champion" (SDoH IKS sempurna),
 * dan mencari tetangga di peta geospasial yang akan menerima pasif buff.
 */

/**
 * Mengevaluasi kelayakan Local Champion berdasarkan skor IKS.
 * 
 * @param {number} iksScore - Skor Indeks Keluarga Sehat
 * @returns {boolean} True hanya jika IKS tepat 1.0 (100%)
 */
export function isLocalChampionEligible(iksScore) {
    if (iksScore == null || typeof iksScore !== 'number') return false;
    // Persyaratan ketat dari Blueprint: IKS harus tepat 100% (1.0)
    return iksScore === 1.0;
}

/**
 * Mengambil array tetangga terdekat yang akan menerima AoE buff.
 * 
 * @param {string} championFamilyId - Kunci ID keluarga champion
 * @param {object} familyCoords - Record koordinat keluarga { "kk_x": { x, y } }
 * @param {number} limit - Jumlah maksimal target buff (default 3)
 * @returns {Array<{familyId: string, distance: number}>} Array tetangga terdekat
 */
export function getLocalChampionTargets(championFamilyId, familyCoords, limit = 3) {
    if (!championFamilyId || typeof championFamilyId !== 'string') return [];
    if (!familyCoords || typeof familyCoords !== 'object') return [];

    const safeLimit = Math.max(0, Math.floor(limit));
    if (safeLimit === 0) return [];

    const championCoords = familyCoords[championFamilyId];
    if (!championCoords || typeof championCoords.x !== 'number' || typeof championCoords.y !== 'number') {
        return [];
    }

    const { x: cx, y: cy } = championCoords;
    const distances = [];

    for (const [familyId, coords] of Object.entries(familyCoords)) {
        // Abaikan diri sendiri
        if (familyId === championFamilyId) continue;
        
        // Abaikan data tidak valid
        if (!coords || typeof coords.x !== 'number' || typeof coords.y !== 'number') {
            continue;
        }

        const distance = Math.abs(coords.x - cx) + Math.abs(coords.y - cy);
        distances.push({ familyId, distance });
    }

    // Sort deterministik: jarak Manhattan, tie-break abjad ascending
    distances.sort((a, b) => {
        if (a.distance !== b.distance) {
            return a.distance - b.distance;
        }
        if (a.familyId < b.familyId) return -1;
        if (a.familyId > b.familyId) return 1;
        return 0;
    });

    return distances.slice(0, safeLimit);
}
