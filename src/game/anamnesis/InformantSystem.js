/**
 * @reflection
 * [IDENTITY]: Informant System
 * [PURPOSE]: Logic for determining if a patient requires an informant (parent/caregiver).
 * [STATE]: Stable
 */

/**
 * Determine if a patient case requires an informant (parent/caregiver).
 * Priority: explicit informant.required > pediatric age > adolescent age > default.
 */
export function getInformantMode(patient) {
    if (!patient) return { isInformant: false, reason: null, informantLabel: null, childCanAnswer: false };

    const age = patient.age || 30;

    // HIGHEST PRIORITY: Case-specified informant (dementia, delirium, disability, etc.)
    if (patient.informant && patient.informant.required) {
        return {
            isInformant: true,
            reason: patient.informant.reason || 'caregiver',
            informantLabel: patient.informant.relation || 'Pendamping',
            informantName: patient.informant.name || null,
            childCanAnswer: false
        };
    }

    // Pediatric: child <= 7 always needs parent informant
    if (age <= 7) {
        const defLabel = patient.gender === 'P' ? 'Ibu' : 'Bapak';
        return {
            isInformant: true,
            reason: 'pediatric',
            informantLabel: patient.informant ? patient.informant.relation || defLabel : defLabel,
            informantName: patient.informant ? patient.informant.name || null : null,
            childCanAnswer: age >= 4
        };
    }

    // Pediatric: child 8-14 may answer themselves but parent accompanies
    if (age <= 14) {
        return {
            isInformant: false,
            reason: 'adolescent',
            informantLabel: null,
            informantName: patient.informant ? patient.informant.name || null : null,
            childCanAnswer: true,
            parentPresent: true
        };
    }

    return { isInformant: false, reason: null, informantLabel: null, childCanAnswer: false };
}
