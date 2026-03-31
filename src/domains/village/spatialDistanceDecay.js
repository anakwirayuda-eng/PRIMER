/**
 * spatialDistanceDecay.js
 * 
 * Helper murni untuk implementasi "Hukum Kematian Karena Jarak" (Distance Decay).
 * Mengatur modifikasi laju penurunan indikator (IKS drift) dan peningkatan
 * tingkat keparahan pasien (severity boost) berdasarkan jarak geografis
 * ke pusat kesehatan.
 */

/**
 * Menghitung efek penalti jarak terhadap kesehatan keluarga.
 * 
 * @param {number} distanceToPuskesmas - Jarak manhattan dari rumah ke fasilitas utama
 * @param {boolean} fobMitigation - Apakah wilayah tercakup oleh Pustu/Polindes yang sudah di-upgrade
 * @returns {{ driftMultiplier: number, severityBoost: number }}
 */
export function calculateDistanceDecayModifiers(distanceToPuskesmas, fobMitigation = false) {
    if (distanceToPuskesmas == null || distanceToPuskesmas < 0) {
        distanceToPuskesmas = 0;
    }

    // FOB (Forward Operating Base) mitigation menggeser penalty seolah-olah 
    // pasien berada 20 sel lebih dekat ke fasilitas, tanpa pernah memberikan 'bonus' di bawah baseline.
    const effectiveDistance = fobMitigation 
        ? Math.max(0, distanceToPuskesmas - 20) 
        : distanceToPuskesmas;

    // Hukum 3: Distance Decay
    // > 40 sel               : drift x2.0, severity +2
    // 20-40 sel (inklusif)   : drift x1.5, severity +1
    // < 20 sel               : normal (drift x1.0, severity +0)
    
    if (effectiveDistance > 40) {
        return { driftMultiplier: 2.0, severityBoost: 2 };
    } else if (effectiveDistance >= 20) {
        return { driftMultiplier: 1.5, severityBoost: 1 };
    } else {
        return { driftMultiplier: 1.0, severityBoost: 0 };
    }
}
