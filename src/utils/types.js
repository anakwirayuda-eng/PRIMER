/**
 * @reflection
 * [IDENTITY]: types
 * [PURPOSE]: types.js — Canonical data structures and normalizers for the medical domain. Helps prevent type mismatches (Object vs Ar
 * [STATE]: Experimental
 * [ANCHOR]: normalizeProcedure
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * types.js — Canonical data structures and normalizers for the medical domain.
 * Helps prevent type mismatches (Object vs Array) and missing property crashes.
 */

// ══════════════════════════════════════════════
// 1. Data Structure Definitions (Documentation)
// ══════════════════════════════════════════════

/**
 * @typedef {Object} Procedure
 * @property {string} id - Internal database ID (e.g. 'lab_darah_lengkap')
 * @property {string} code - Medical code (e.g. '89.01', '87.44')
 * @property {string} name - Human readable name
 */

/**
 * @typedef {Object} Diagnosis
 * @property {string} code - ICD-10 code (e.g. 'E11.9')
 * @property {string} name - Disease name
 */

/**
 * @typedef {Object} MedEntry
 * @property {string} id - Medication ID
 * @property {string} name - Display name
 * @property {string} dose - Dosage (e.g. '500mg')
 * @property {string} route - Route (e.g. 'Oral')
 * @property {string} freq - Frequency (e.g. '3x1')
 * @property {string} duration - Duration in days
 */

// ══════════════════════════════════════════════
// 2. Normalizers
// ══════════════════════════════════════════════

/**
 * Normalizes a procedure item which might be a string (legacy) or an object.
 * Always returns {id, code, name}.
 */
export const normalizeProcedure = (p) => {
    if (typeof p === 'object' && p !== null) {
        return {
            id: p.id || '',
            code: p.code || '',
            name: p.name || p.id || 'Unnamed Procedure'
        };
    }
    // Legacy string ID support
    return { id: p, code: '', name: p.replace(/_/g, ' ') };
};

/**
 * Converts the labsRevealed state (Object with keys as IDs) 
 * to a standardized array of procedure IDs.
 */
export const normalizeLabsRevealed = (labsObj) => {
    if (Array.isArray(labsObj)) return labsObj;
    if (typeof labsObj === 'object' && labsObj !== null) {
        return Object.keys(labsObj);
    }
    return [];
};

/**
 * Normalizes education items to an array of strings.
 */
export const normalizeEducation = (edu) => {
    if (Array.isArray(edu)) return edu;
    return [];
};

/**
 * Ensures diagnosis objects have both code and name.
 */
export const normalizeDiagnosis = (d) => {
    if (typeof d === 'object' && d !== null) {
        return {
            code: d.code || '',
            name: d.name || d.code || 'Unknown Diagnosis'
        };
    }
    return { code: String(d), name: String(d) };
};
