/**
 * warungIntelCost.js
 * 
 * Helper murni untuk mengevaluasi harga (cost) dan kemampuan (affordability)
 * dari aksi pemain membeli intelijen dari Pos Ronda/Warung Kopi.
 */

// Konstanta statis berdasarkan Blueprint Desa Wisata
const WARUNG_INTEL_COST_CONFIG = {
    energyCost: 15,    // Biaya stamina
    cashCost: 20000,   // Biaya jajan / rokok (Rupiah)
    timeCost: 15       // Durasi waktu ngobrol (menit)
};

/**
 * Mendapatkan biaya absolut dari aksi membeli informasi (Intel).
 * 
 * @returns {object} { energyCost, cashCost, timeCost }
 */
export function getWarungIntelCost() {
    // Mengembalikan copy objek untuk menghindari mutasi referensi di luar
    return { ...WARUNG_INTEL_COST_CONFIG };
}

/**
 * Evaluasi apakah player mampu melakukan aksi tersebut.
 * 
 * @param {number} currentEnergy - Stamina yang dimiliki pemain saat ini
 * @param {number} currentMoney - Uang/budget yang dimiliki pemain saat ini
 * @returns {boolean} True jika kedua threshold dipenuhi, false jika sebaliknya atau input invalid
 */
export function canAffordWarungIntel(currentEnergy, currentMoney) {
    // Validasi safety tipe data numerik
    if (typeof currentEnergy !== 'number' || isNaN(currentEnergy) || currentEnergy < 0) {
        return false;
    }
    if (typeof currentMoney !== 'number' || isNaN(currentMoney) || currentMoney < 0) {
        return false;
    }

    return (
        currentEnergy >= WARUNG_INTEL_COST_CONFIG.energyCost && 
        currentMoney >= WARUNG_INTEL_COST_CONFIG.cashCost
    );
}
