/**
 * serviceDistance.js
 * 
 * Helper murni untuk implementasi "Effective Service Distance" (Jarak Layanan Efektif).
 * Mencari fasilitas rujukan Pusat Kesehatan (Puskesmas / FOB aktif) yang paling
 * dekat dengan rumah penduduk untuk mengoptimasi radius Distance Decay.
 */

/**
 * Mencari fasilitas kesehatan aktif terdekat beserta jarak Manhattan distance-nya.
 * 
 * @param {object} homeCoords - Koordinat asal { x, y }
 * @param {Array<{id: string, x: number, y: number, isActive: boolean}>} anchors - Array lokasi faskes
 * @returns {{ anchorId: string|null, distance: number }} ID base terdekat dan jaraknya
 */
export function getEffectiveServiceDistance(homeCoords, anchors) {
    // 1. Validasi input aman
    if (!homeCoords || typeof homeCoords.x !== 'number' || typeof homeCoords.y !== 'number') {
        return { anchorId: null, distance: Infinity };
    }
    if (!Array.isArray(anchors) || anchors.length === 0) {
        return { anchorId: null, distance: Infinity };
    }

    let minDistance = Infinity;
    let bestAnchorId = null;

    // 2. Kalkulasi kedekatan jarak Manhattan
    for (const anchor of anchors) {
        // Lewati anchor invalid, korup, atau sedang inaktif
        if (!anchor || anchor.isActive !== true) continue;
        if (typeof anchor.x !== 'number' || typeof anchor.y !== 'number') continue;
        if (typeof anchor.id !== 'string') continue;

        const distance = Math.abs(homeCoords.x - anchor.x) + Math.abs(homeCoords.y - anchor.y);

        if (distance < minDistance) {
            minDistance = distance;
            bestAnchorId = anchor.id;
        } else if (distance === minDistance && bestAnchorId !== null) {
            // 3. Deterministik tie-breaker dengan alfabetik ID
            if (anchor.id < bestAnchorId) {
                bestAnchorId = anchor.id;
            }
        }
    }

    return { anchorId: bestAnchorId, distance: minDistance };
}
