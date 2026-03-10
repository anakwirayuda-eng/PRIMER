/**
 * @reflection
 * [IDENTITY]: AnamnesisVariations
 * [PURPOSE]: ANAMNESIS VARIATIONS — Pre-Generated Persona Responses
 * [STATE]: Stable (Refactored v3.0)
 * [ANCHOR]: getAnamnesisVariation
 * [DEPENDS_ON]: respiratory_variations, cardio_variations, digestive_variations
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-13
 */

// pickPersona not needed — variations are pre-generated
import { respiratory_variations } from './anamnesis/variations/respiratory.js';
import { cardio_variations } from './anamnesis/variations/cardio.js';
import { digestive_variations } from './anamnesis/variations/digestive.js';

/**
 * ANAMNESIS VARIATIONS — Pre-Generated Persona Responses
 * =====================================================
 * 
 * Aggregated variations from sub-modules.
 * 
 * PERSONA TYPES:
 * - low_education: Bahasa sehari-hari, istilah awam
 * - high_education: Kooperatif, kadang pakai istilah medis
 * - skeptical: Singkat, defensif, butuh didekati
 * - anxious: Cemas berlebihan, bertele-tele
 * - elderly: Bahasa sopan (Nak Dokter), kadang lupa/berbelit
 * - child_proxy: Informan (ibu) yang mendeskripsikan keluhan anak
 */

const VARIATIONS = {
    ...respiratory_variations,
    ...cardio_variations,
    ...digestive_variations,

    // Future categories can be imported and spread here
};


/**
 * Helper to get a varied response based on persona.
 * @param {string} caseId
 * @param {string} questionId
 * @param {string} personaId (e.g., 'low_education', 'elderly')
 * @returns {string|null} The varied response or null if not found
 */
export const getAnamnesisVariation = (caseId, questionId, personaId) => {
    if (!VARIATIONS[caseId]) return null;
    if (!VARIATIONS[caseId][questionId]) return null;

    return VARIATIONS[caseId][questionId][personaId] || null;
};

export default VARIATIONS;
