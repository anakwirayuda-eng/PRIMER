/**
 * Clinical encounter helpers for store.
 * Pure functions only — NO store imports.
 */
import { normalizePatient } from '../../models/PatientRuntime.js';
import { normalizeEncounter } from '../../models/EncounterRuntime.js';
import { getMedicationById, MEDICATION_CATEGORIES } from '../../data/MedicationDatabase.js';
import { calculatePrimaryCareRevenueForDecision } from '../../game/BillingEngine.js';
import { calculateEmergencyBillForPatient } from '../../game/EmergencyCases.js';
import { AMBULANCES } from '../../data/HospitalDB.js';

const MAX_CLINICAL_HISTORY = 200;

export function capClinicalHistory(history) {
    if (!Array.isArray(history) || history.length <= MAX_CLINICAL_HISTORY) {
        return Array.isArray(history) ? history : [];
    }

    return history.slice(-MAX_CLINICAL_HISTORY);
}

export function appendClinicalHistory(history, entry) {
    return capClinicalHistory([...(Array.isArray(history) ? history : []), entry]);
}

export function normalizeClinicalHistoryEntry(entry) {
    return normalizeEncounter(normalizePatient(entry));
}

export function getHistoryForDay(history, day) {
    return Array.isArray(history)
        ? history.filter((entry) => Number(entry?.day) === Number(day))
        : [];
}

export function getEncounterAction(entry) {
    return entry?.decision?.action || null;
}

// Codex Fix: Canonical antibiotic check from MedicationDatabase category
export function isAntibioticMed(medId) {
    const med = getMedicationById(medId);
    if (!med) return false;
    if (med.category !== MEDICATION_CATEGORIES.ANTIBIOTIC) return false;
    const antifungalPatterns = ['fluconazole', 'ketoconazole', 'nystatin', 'griseofulvin', 'miconazole', 'clotrimazole'];
    const antiviralPatterns = ['acyclovir', 'oseltamivir', 'valacyclovir'];
    const excluded = [...antifungalPatterns, ...antiviralPatterns];
    return !excluded.some(pat => medId.includes(pat));
}

export function isCorrectMedicationSelection(requiredTreatments, selectedMedications) {
    if (!Array.isArray(requiredTreatments) || requiredTreatments.length === 0) return true;
    if (!Array.isArray(selectedMedications)) return false;
    const selectedIds = selectedMedications.map(m => typeof m === 'object' ? (m.id || m.medId) : m);

    return requiredTreatments.every((requiredItem) => {
        if (Array.isArray(requiredItem)) {
            return requiredItem.some((candidate) => selectedIds.includes(candidate));
        }
        return selectedIds.includes(requiredItem);
    });
}

export function isEncounterCorrect(entry) {
    const action = getEncounterAction(entry);
    if (action === 'delegate_to_maia') return true;

    const requiredAction = entry?.hidden?.requiredAction;
    const hasOutcome = typeof entry?.outcome === 'string';
    if (!requiredAction) {
        return hasOutcome ? entry.outcome !== 'bad' : true;
    }

    const isCorrectAction = requiredAction === action;
    if (action !== 'treat') {
        return isCorrectAction;
    }

    return isCorrectAction && isCorrectMedicationSelection(
        entry?.medicalData?.correctTreatment,
        entry?.decision?.medications
    );
}

export function hasCorrectDiagnosis(entry) {
    const trueDiagnosisCode = entry?.medicalData?.trueDiagnosisCode;
    const chosenDiagnoses = entry?.decision?.diagnoses;
    if (!trueDiagnosisCode || !Array.isArray(chosenDiagnoses)) return false;
    return chosenDiagnoses.includes(trueDiagnosisCode);
}

export function hasAntibioticMedication(entry) {
    return (entry?.decision?.medications || []).some((m) => {
        const medId = typeof m === 'object' ? (m.id || m.medId) : m;
        return isAntibioticMed(medId);
    });
}

export function calculateEncounterRevenue(entry) {
    const action = getEncounterAction(entry);
    const isBPJS = Boolean(entry?.social?.hasBPJS);

    if (action === 'delegate_to_maia') {
        if (entry?.isEmergency) return isBPJS ? 0 : 50000;
        return isBPJS ? 0 : 25000;
    }

    if (entry?.isEmergency) {
        const billing = calculateEmergencyBillForPatient(
            entry,
            entry?.decision?.actionsPerformed || entry?.decision?.actions,
            entry?.decision?.triageAssigned || entry?.triageLevel
        );
        let revenue = billing?.total || 0;

        if (action === 'refer' && entry?.decision?.isSISRUTE && entry?.decision?.referralDetails?.result?.status === 'ACCEPTED') {
            const ambulanceId = entry?.decision?.referralDetails?.ambulanceId;
            const ambulance = AMBULANCES.find((item) => item.id === ambulanceId);
            if (ambulance?.cost) revenue -= ambulance.cost;
        }

        return revenue;
    }

    return calculatePrimaryCareRevenueForDecision(entry, entry?.decision || {});
}

export { MAX_CLINICAL_HISTORY };
