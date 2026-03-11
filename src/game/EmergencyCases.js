/**
 * @reflection
 * [IDENTITY]: EmergencyCases
 * [PURPOSE]: Aggregator for Emergency Engine modules. Maintains API compatibility.
 * [STATE]: Refactored (Modular)
 * [LAST_UPDATE]: 2026-02-14
 * [ARCHITECT]: Megalog v4.0
 */

import { getMedicationById } from '../data/MedicationDatabase.js';
import { TRIAGE_LEVELS, EMERGENCY_ACTIONS, ESI_LEVELS } from './emergency/EmergencyRegistry.js';
import { seedKey, weightedPickDeterministic } from '../utils/deterministicRandom.js';

// 1. Core Constants
export { TRIAGE_LEVELS, ESI_LEVELS, EMERGENCY_ACTIONS };

// 2. Case Modules
import { RESPIRATORY_CASES } from './emergency/cases/RespiratoryCases.js';
import { METABOLIC_CASES } from './emergency/cases/MetabolicCases.js';
import { NEUROLOGY_CASES } from './emergency/cases/NeurologyCases.js';
import { CARDIOVASCULAR_CASES } from './emergency/cases/CardiovascularCases.js';
import { INFECTION_CASES } from './emergency/cases/InfectionCases.js';
import { ALLERGY_CASES } from './emergency/cases/AllergyCases.js';
import { TRAUMA_CASES } from './emergency/cases/TraumaCases.js';
import { DIGESTIVE_CASES } from './emergency/cases/DigestiveCases.js';
import { OTHER_EMERGENCY_CASES } from './emergency/cases/OtherCases.js';
import { PEDIATRIC_CASES } from './emergency/cases/PediatricCases.js';

// 3. Derive stabilizationChecklist from correctTreatment for cases that lack it
function enrichCase(c) {
    if (!c.stabilizationChecklist && c.correctTreatment) {
        c.stabilizationChecklist = c.correctTreatment.flat();
    }
    return c;
}

// 4. Combined Export
export const EMERGENCY_CASES = [
    ...METABOLIC_CASES,
    ...ALLERGY_CASES,
    ...NEUROLOGY_CASES,
    ...RESPIRATORY_CASES,
    ...CARDIOVASCULAR_CASES,
    ...INFECTION_CASES,
    ...TRAUMA_CASES,
    ...DIGESTIVE_CASES,
    ...OTHER_EMERGENCY_CASES,
    ...PEDIATRIC_CASES
].map(enrichCase);

/**
 * Patient status after stabilization
 */
export const PATIENT_STATUS = {
    improved: { id: 'improved', label: 'Membaik', description: 'Kondisi pasien membaik setelah tindakan', color: 'text-green-600', bgColor: 'bg-green-50', icon: '📈' },
    stable: { id: 'stable', label: 'Stabil', description: 'Kondisi pasien stabil, dapat dipantau', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '➡️' },
    unchanged: { id: 'unchanged', label: 'Belum Ada Perubahan', description: 'Kondisi pasien belum menunjukkan perbaikan', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: '⏸️' },
    deteriorating: { id: 'deteriorating', label: 'Memburuk', description: 'Kondisi pasien memburuk, perlu tindakan lanjutan', color: 'text-red-600', bgColor: 'bg-red-50', icon: '📉' },
    critical: { id: 'critical', label: 'Kritis', description: 'Kondisi pasien kritis, rujuk segera', color: 'text-red-800', bgColor: 'bg-red-100', icon: '🚨' }
};

/**
 * API Logic (Maintained for compatibility)
 */

export function calculatePatientStatus(stabilizationScore, triageCorrect, performedActionsCount, _requiredActionsCount) {
    if (stabilizationScore >= 80 && triageCorrect) return PATIENT_STATUS.improved;
    if (stabilizationScore >= 60) return PATIENT_STATUS.stable;
    if (stabilizationScore >= 40) return PATIENT_STATUS.unchanged;
    if (performedActionsCount > 0) return PATIENT_STATUS.deteriorating;
    return PATIENT_STATUS.critical;
}

export function getEmergencyCase(id) {
    return EMERGENCY_CASES.find(c => c.id === id);
}

export function getRandomEmergencyCase(seedHint = 'default') {
    const weights = EMERGENCY_CASES.map(c => {
        if (c.triageLevel === 1) return 1;
        if (c.triageLevel === 2) return 3;
        return 5;
    });

    return weightedPickDeterministic(
        EMERGENCY_CASES,
        weights,
        seedKey('emergency-case', seedHint)
    ) || EMERGENCY_CASES[EMERGENCY_CASES.length - 1];
}

// (Redundant imports removed)

export function validateTriage(patientCase, selectedTriageLevel) {
    const correctLevel = patientCase.triageLevel;
    const isCorrect = selectedTriageLevel === correctLevel;
    const diff = Math.abs(selectedTriageLevel - correctLevel);

    let feedback, score;
    if (isCorrect) { feedback = "✅ Triase TEPAT! Prioritas pasien sudah benar."; score = 100; }
    else if (diff === 1) { feedback = "⚠️ Triase hampir tepat, tapi ada sedikit perbedaan prioritas."; score = 60; }
    else if (selectedTriageLevel > correctLevel) { feedback = "❌ UNDER-TRIAGE! Pasien ini lebih gawat dari yang Anda kira. Bisa fatal!"; score = 20; }
    else { feedback = "⚠️ OVER-TRIAGE. Pasien tidak segawat yang Anda kira, tapi lebih baik waspada."; score = 40; }

    return { isCorrect, correctLevel, selectedLevel: selectedTriageLevel, feedback, score, triageLevelInfo: TRIAGE_LEVELS[correctLevel] };
}

export function validateStabilization(patientCase, performedActions) {
    const checklist = patientCase.stabilizationChecklist || [];
    const performed = performedActions.filter(a => checklist.includes(a));
    const score = checklist.length > 0 ? (performed.length / checklist.length) * 100 : 100;
    const getActionName = (id) => EMERGENCY_ACTIONS[id]?.name || id.replace(/_/g, ' ');

    return {
        score: Math.round(score),
        performed: performed.map(getActionName),
        missing: checklist.filter(a => !performedActions.includes(a)).map(getActionName),
        totalRequired: checklist.length,
        totalPerformed: performed.length,
        feedback: score >= 80 ? "✅ Stabilisasi awal sudah tepat!" : score >= 50 ? "⚠️ Beberapa tindakan penting belum dilakukan." : "❌ Stabilisasi tidak adekuat! Pasien dalam bahaya."
    };
}

export function calculateEmergencyBill(actionsPerformed = [], isBPJS = false, triageLevel = 3) {
    const pendaftaran = 20000;
    const jasaMedis = 30000;
    const actionDetails = actionsPerformed.map(id => {
        const med = getMedicationById(id);
        const action = EMERGENCY_ACTIONS[id];
        let cost = 0, name = action?.name || id;
        if (med) { cost = med.igdPrice || med.sellPrice || 0; name = med.name; }
        else if (action) { cost = action.cost || 0; }
        return { name, cost };
    });

    const totalActions = actionDetails.reduce((sum, a) => sum + a.cost, 0);
    const subtotal = pendaftaran + jasaMedis + totalActions;
    const isEmergency = triageLevel <= 2;
    const finalBill = isBPJS ? (isEmergency ? 0 : subtotal) : subtotal;

    return { pendaftaran, jasaMedis, actionDetails, total: subtotal, isCovered: isBPJS && isEmergency, coverageType: isBPJS ? (isEmergency ? 'BPJS (Covered)' : 'BPJS (REJECTED - Non-Emergency)') : 'Umum', finalBill };
}
