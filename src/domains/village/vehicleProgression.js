/**
 * vehicleProgression.js
 * 
 * Helper murni untuk mengevaluasi syarat terbukanya (unlock)
 * berbagai moda transportasi dalam navigasi peta Geospasial.
 */

export const VEHICLE_PROGRESSION_RULES = {
    'jalan_kaki': { minDay: 0, minBalance: 0 },
    'sepeda': { minDay: 20, minBalance: 0 },
    'motor_dinas': { minDay: 50, minBalance: 2000000 },
    'puskel': { minDay: 80, minBalance: 5000000 }
};

export const CANONICAL_VEHICLE_KEYS = Object.keys(VEHICLE_PROGRESSION_RULES);

/**
 * Mengevaluasi apakah sebuah kendaraan sudah memenuhi syarat unlock.
 * 
 * @param {string} vehicle - Kunci kendaraan (contoh: 'sepeda')
 * @param {number} day - Hari simulasi saat ini
 * @param {number} balance - Saldo uang/anggaran Puskesmas saat ini
 * @returns {boolean} True jika sudah bisa digunakan
 */
export function isVehicleUnlocked(vehicle, day, balance) {
    if (day == null || balance == null || day < 0 || balance < 0) return false;
    
    const rule = VEHICLE_PROGRESSION_RULES[vehicle];
    if (!rule) return false;

    return day >= rule.minDay && balance >= rule.minBalance;
}

/**
 * Mengembalikan array kendaraan apa saja yang sudah memenuhi syarat.
 * 
 * @param {number} day - Hari simulasi saat ini 
 * @param {number} balance - Saldo uang/anggaran Puskesmas saat ini
 * @returns {string[]} Array kunci kendaraan (contoh: ['jalan_kaki', 'sepeda'])
 */
export function getUnlockedVehicles(day, balance) {
    if (day == null || balance == null || day < 0 || balance < 0) return [];

    return CANONICAL_VEHICLE_KEYS.filter(vehicle => 
        isVehicleUnlocked(vehicle, day, balance)
    );
}
