/**
 * @reflection
 * [IDENTITY]: CaseLibrary
 * [PURPOSE]: Game engine module providing: CASE_LIBRARY, getRandomCase, getCaseByCondition, calculatePatientBill (+5 more).
 * [STATE]: Experimental
 * [ANCHOR]: CASE_LIBRARY
 * [DEPENDS_ON]: infectious, metabolic, others, emergency, chronic
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import { INFECTIOUS_CASES } from './modules/infectious.js';
import { METABOLIC_CASES } from './modules/metabolic.js';
import { OTHER_CASES } from './modules/others.js';
import { EMERGENCY_CASES } from './modules/emergency.js';
import { CHRONIC_CASES } from './modules/chronic.js';

/**
 * Unified Case Library
 * Combining all specialty-based modules into a single array for the game engine.
 */
export const CASE_LIBRARY = [
    ...INFECTIOUS_CASES,
    ...METABOLIC_CASES,
    ...OTHER_CASES,
    ...EMERGENCY_CASES,
    ...CHRONIC_CASES
];

export function getRandomCase() {
    return CASE_LIBRARY[Math.floor(Math.random() * CASE_LIBRARY.length)];
}

/**
 * Get a case by condition/disease ID for profile-based generation
 * @param {string} caseId - The case ID to look for (e.g., 'hypertension_primary', 'ispa_common')
 * @returns {Object|null} The matching case or null if not found
 */
export function getCaseByCondition(caseId) {
    if (!caseId) return null;

    // Try exact match first (preferred — all callers should use exact IDs)
    let match = CASE_LIBRARY.find(c => c.id?.toLowerCase() === caseId.toLowerCase());

    // If no exact match, try forward partial match only
    // (case ID contains the search term, NOT the reverse)
    if (!match) {
        const normalized = caseId.toLowerCase().replace(/[_\s]/g, '');
        match = CASE_LIBRARY.find(c =>
            c.id?.toLowerCase().replace(/[_\s]/g, '').includes(normalized) ||
            (c.diagnosis?.toLowerCase().replace(/[_\s]/g, '').includes(normalized) ?? false)
        );
    }

    // Last resort: try diagnosis name or ICD-10 code match
    if (!match) {
        const normalized = caseId.toLowerCase().replace(/[_\s]/g, '');
        match = CASE_LIBRARY.find(c =>
            (c.diagnosis?.toLowerCase().replace(/[_\s]/g, '').includes(normalized) ?? false) ||
            (c.icd10?.toLowerCase().includes(normalized) ?? false)
        );
    }

    if (!match) {
        console.warn(`[CaseLibrary] No case found for ID: "${caseId}"`);
    }

    return match || null;
}

// Re-export logic and calculations from specialized engine modules
export { calculatePatientBill } from '../../game/BillingEngine.js';
export {
    validateDiagnosis,
    validateTreatment,
    validateEducation,
    validateExams,
    validateAnamnesis
} from '../../game/ValidationEngine.js';
