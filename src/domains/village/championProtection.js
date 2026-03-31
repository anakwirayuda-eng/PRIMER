/**
 * championProtection.js
 * 
 * Helper murni untuk mengevaluasi peta target keluarga mana saja yang 
 * mendapatkan buff pasif perlindungan dari penurunan nilai IKS 
 * berkat kehadiran Local Champion (Kader Lokal) di sekitar mereka.
 */

import { getLocalChampionTargets } from './localChampion.js';

/**
 * Menyusun daftar ID unik dari seluruh keluarga yang menerima perlindungan
 * IKS dari satu atau lebih Local Champion.
 * 
 * @param {Array<string>} championFamilyIds - Array ID keluarga kader
 * @param {object} familyCoords - Record koordinat keluarga { "kk_x": { x, y } }
 * @param {number} limit - Batas jangkauan efek (default 3 rumah)
 * @returns {Array<string>} Array ID terlindungi secara unik dan terurut alfabetis
 */
export function getChampionProtectedFamilies(championFamilyIds, familyCoords, limit = 3) {
    if (!Array.isArray(championFamilyIds)) return [];
    if (!familyCoords || typeof familyCoords !== 'object') return [];

    const safeLimit = Math.max(0, Math.floor(limit));
    if (safeLimit === 0) return [];

    const protectedSet = new Set();
    const championSet = new Set(championFamilyIds);
    const maxScanLength = Object.keys(familyCoords).length;

    for (const champId of championFamilyIds) {
        if (typeof champId !== 'string') continue;

        // Ambil SEMUA target sasaran untuk bisa menyeleksi non-champion murni 
        const allTargets = getLocalChampionTargets(champId, familyCoords, maxScanLength);

        let count = 0;
        for (const target of allTargets) {
            // Evaluasi safety: Jangan proteksi sesama champion (karena IKS mereka sudah 100%)
            if (!championSet.has(target.familyId)) {
                protectedSet.add(target.familyId);
                count++;
                // Stop jika sudah mencapai kuota target perlindungan untuk champion ini
                if (count >= safeLimit) break;
            }
        }
    }

    // Convert ke Array dan Sorting Deterministik (Ascending by String)
    const protectedArray = Array.from(protectedSet);
    protectedArray.sort();

    return protectedArray;
}
