/**
 * @reflection
 * [IDENTITY]: utils.js
 * [PURPOSE]: Core helper functions for medication database management, search, and inventory calculation.
 * [STATE]: Stable
 * [ANCHOR]: MEDICATION_CATEGORIES, searchMedications
 */

export const MEDICATION_CATEGORIES = {
    ANALGESIC: 'Analgesik/Antipiretik',
    ANTIBIOTIC: 'Anti-Infeksi (Antibiotik/Antifungi/Antivirus)',
    ANTIHYPERTENSIVE: 'Antihipertensi/Kardiovaskular',
    ANTIDIABETIC: 'Antidiabetes',
    RESPIRATORY: 'Sistem Respirasi',
    GASTROINTESTINAL: 'Saluran Cerna',
    DERMATOLOGY: 'Dermatologi',
    SUPPLEMENT: 'Vitamin/Suplemen/Obstetri',
    PSYCHIATRY_NEURO: 'Psikiatri & Neurologi',
    ENT_EYE: 'Mata/Telinga/Hidung/Tenggorokan',
    MEDICAL_EQUIPMENT: 'Alat Kesehatan Habis Pakai',
    LAB_REAGENT: 'Reagensia Laboratorium',
    EMERGENCY: 'Gawat Darurat / Injeksi',
    METABOLIC: 'Obat Metabolik & Gout'
};

/**
 * Search medications across the entire database
 * @param {Array} database - The consolidated medication database
 * @param {string} query - Search query
 * @param {number} limit - Maximum results
 */
export const searchMedications = (database, query, limit = 10) => {
    if (!query) return [];
    const q = query.toLowerCase();
    return database.filter(m =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.category && m.category.toLowerCase().includes(q)) ||
        (m.indication && m.indication.some(ind => ind && ind.toLowerCase().includes(q)))
    ).slice(0, limit);
};

/**
 * Get all available medication categories
 */
export const getMedicationCategories = () => {
    return Object.values(MEDICATION_CATEGORIES);
};

/**
 * Find medication by ID
 */
export function getMedicationById(database, id) {
    return database.find(med => med.id === id);
}

/**
 * Get medications by category
 */
export function getMedicationsByCategory(database, category) {
    return database.filter(med => med.category === category);
}

/**
 * Get all FORNAS medications
 */
export function getFornasMedications(database) {
    return database.filter(med => med.fornas === true);
}

/**
 * Calculate total inventory value
 */
export function calculateTotalInventoryValue(database, inventory) {
    return inventory.reduce((total, item) => {
        const medication = getMedicationById(database, item.medicationId);
        return total + (medication ? medication.unitPrice * item.stock : 0);
    }, 0);
}
