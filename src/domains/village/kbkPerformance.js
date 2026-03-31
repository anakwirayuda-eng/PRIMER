/**
 * kbkPerformance.js
 * 
 * Helper murni untuk mengevaluasi pengali (multiplier) Kapitasi Berbasis Komitmen
 * (KBK) BPJS berdasarkan rata-rata IKS (Indeks Keluarga Sehat) seluruh desa.
 */

/**
 * Menghitung performance multiplier KBK.
 * 
 * @param {number} avgIKS - Rata-rata Skor IKS Desa (0.0 - 1.0)
 * @returns {number} Multiplier Kapitasi (0.8, 1.0, atau 1.3)
 */
export function calculateKBKPerformanceMultiplier(avgIKS) {
    // Validasi safety: fallback ke multiplier normal (1.0) jika input tidak valid
    if (avgIKS == null || typeof avgIKS !== 'number' || isNaN(avgIKS) || avgIKS < 0) {
        return 1.0;
    }

    // Aturan Blueprint:
    // > 0.8      : Reward (1.3x Kapitasi)
    // 0.5 - 0.8  : Normal (1.0x Kapitasi)
    // < 0.5      : Punishment (0.8x Kapitasi)

    if (avgIKS > 0.8) {
        return 1.3;
    } else if (avgIKS >= 0.5) {
        return 1.0;
    } else {
        return 0.8;
    }
}
