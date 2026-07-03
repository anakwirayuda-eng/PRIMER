/**
 * @reflection
 * [IDENTITY]: BillingEngine
 * [PURPOSE]: BillingEngine.js — Calculates costs for medical services.
 * [STATE]: Stable
 * [ANCHOR]: calculatePatientBill
 * [DEPENDS_ON]: MedicationDatabase, ProceduresDB
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-14
 */

/**
 * BillingEngine.js — Calculates costs for medical services.
 */

import { getMedicationById } from '../data/MedicationDatabase.js';
import { PROCEDURES_DB } from '../data/ProceduresDB.js';
import { AMBULANCES } from '../data/HospitalDB.js';
import { LAB_CATALOG } from './LabEngine.js';

function resolveEncounterLabsForBilling(patient = {}, decision = {}) {
    if (decision?.labsRevealed && typeof decision.labsRevealed === 'object' && !Array.isArray(decision.labsRevealed)) {
        return decision.labsRevealed;
    }
    if (patient?.labsRevealed && typeof patient.labsRevealed === 'object' && !Array.isArray(patient.labsRevealed)) {
        return patient.labsRevealed;
    }
    if (patient?.medicalData?.labsRevealed && typeof patient.medicalData.labsRevealed === 'object' && !Array.isArray(patient.medicalData.labsRevealed)) {
        return patient.medicalData.labsRevealed;
    }
    return {};
}

/**
 * Calculates the total bill for a Poly patient.
 * Guards against labsRevealed values being boolean (true) instead of objects.
 */
export function calculatePatientBill(selectedMeds = [], selectedProcedures = [], labsRevealed = {}, caseData = {}, isBPJS = false) {
    // Basic service fees
    const pendaftaran = 15000;
    const jasaMedis = 20000;

    // Lab costs — Codex Fix: use LAB_CATALOG canonical cost, then caseData, then fallback
    const labDetails = Object.entries(labsRevealed || {}).filter(([, data]) => !!data).map(([name, data]) => {
        const cost = (typeof data === 'object' && data?.cost) ? Number(data.cost) : (LAB_CATALOG[name]?.cost || caseData?.labs?.[name]?.cost || 50000);
        return { name, cost: Number(cost) || 0 };
    });
    const totalLabs = labDetails.reduce((sum, l) => sum + l.cost, 0);

    // Procedure costs
    const procDetails = (selectedProcedures || []).map(item => {
        const id = typeof item === 'object' ? (item.id || item.code) : item;
        const proc = PROCEDURES_DB.find(p => p.id === id || p.code === id);
        return {
            name: (typeof item === 'object' && item.name) ? item.name : (proc?.name || id),
            cost: (typeof item === 'object' && item.cost !== undefined) ? Number(item.cost) : (proc?.cost || 0)
        };
    });
    const totalProcs = procDetails.reduce((sum, p) => sum + (Number(p.cost) || 0), 0);

    // Medication costs
    const medDetails = (selectedMeds || []).map(item => {
        const id = typeof item === 'object' ? item.id : item;
        const med = getMedicationById(id);
        const freq = typeof item === 'object' ? (item.frequency || 1) : 1;
        const dur = typeof item === 'object' ? (item.duration || 1) : 1;
        const qty = freq * dur;
        const sellPrice = med?.sellPrice || 0;
        const buyPrice = med?.buyPrice || 0;
        const cost = sellPrice * qty;
        const hppCost = buyPrice * qty;

        return {
            name: med?.name || id,
            cost,
            sellPrice,
            buyPrice,
            hppCost,
            qty,
            frequency: freq,
            duration: dur
        };
    });
    const totalMeds = medDetails.reduce((sum, m) => sum + (Number(m.cost) || 0), 0);
    // HPP: total cost at buyPrice — this is what Puskesmas actually pays suppliers
    const buyPriceTotal = medDetails.reduce((sum, m) => sum + (Number(m.hppCost) || 0), 0);

    const subtotal = pendaftaran + jasaMedis + totalLabs + totalProcs + totalMeds;

    return {
        pendaftaran,
        jasaMedis,
        labDetails,
        procDetails,
        medDetails,
        total: subtotal,
        buyPriceTotal, // HPP — for BPJS kapitasi deduction
        finalBill: isBPJS ? 0 : subtotal // Patient pays 0 if BPJS
    };
}

/**
 * Calculates the actual finance delta for a primary-care encounter.
 * Positive = revenue collected, negative = cost borne by facility.
 */
export function calculatePrimaryCareRevenueForDecision(patient = {}, decision = {}) {
    const action = decision?.action;
    const isBPJS = Boolean(patient?.social?.hasBPJS);

    if (action === 'treat') {
        const labsRevealed = resolveEncounterLabsForBilling(patient, decision);
        const bill = calculatePatientBill(
            decision?.medications || [],
            decision?.procedures || [],
            labsRevealed,
            patient?.medicalData || {},
            isBPJS
        );
        const labCost = (bill?.labDetails || []).reduce((sum, lab) => sum + (Number(lab?.cost) || 0), 0);
        return isBPJS ? -((bill.buyPriceTotal || 0) + labCost) : ((bill.total || 0) - labCost);
    }

    if (action === 'refer' && decision?.isSISRUTE && decision?.referralDetails?.result?.status === 'ACCEPTED') {
        const ambulanceId = decision?.referralDetails?.ambulanceId;
        const ambulance = AMBULANCES.find((item) => item.id === ambulanceId);
        return ambulance?.cost ? -ambulance.cost : 0;
    }

    return 0;
}
