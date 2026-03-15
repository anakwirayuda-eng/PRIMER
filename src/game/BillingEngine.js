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

/**
 * Calculates the total bill for a Poly patient.
 * Guards against labsRevealed values being boolean (true) instead of objects.
 */
export function calculatePatientBill(selectedMeds = [], selectedProcedures = [], labsRevealed = {}, caseData = {}, isBPJS = false) {
    // Basic service fees
    const pendaftaran = 15000;
    const jasaMedis = 20000;

    // Lab costs — guard: labsRevealed values may be boolean (true) instead of objects
    const labDetails = Object.entries(labsRevealed || {}).filter(([, data]) => !!data).map(([name, data]) => {
        const cost = (typeof data === 'object' && data?.cost) ? Number(data.cost) : (caseData?.labs?.[name]?.cost || 50000);
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
        const unitPrice = med?.sellPrice || 0;
        const cost = unitPrice * qty;

        return {
            name: med?.name || id,
            cost,
            unitPrice,
            qty,
            frequency: freq,
            duration: dur
        };
    });
    const totalMeds = medDetails.reduce((sum, m) => sum + (Number(m.cost) || 0), 0);

    const subtotal = pendaftaran + jasaMedis + totalLabs + totalProcs + totalMeds;

    return {
        pendaftaran,
        jasaMedis,
        labDetails,
        procDetails,
        medDetails,
        total: subtotal,
        finalBill: isBPJS ? 0 : subtotal // Patient pays 0 if BPJS
    };
}
