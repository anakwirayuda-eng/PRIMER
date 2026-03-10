/**
 * @reflection
 * [IDENTITY]: DispensingEngine
 * [PURPOSE]: Pure logic for pharmacy dispensing — 5-Rights verification, drug interaction checks, FIFO stock, Bishi Bashi scoring.
 * [STATE]: Experimental
 * [ANCHOR]: verifyPrescription
 * [DEPENDS_ON]: MedicationDatabase
 * [LAST_UPDATE]: 2026-02-18
 */

import { getMedicationById } from '../data/MedicationDatabase.js';

// ═══════════════════════════════════════════════════════════════
// 5-RIGHTS VERIFICATION
// ═══════════════════════════════════════════════════════════════

/**
 * Known drug interactions (simplified Puskesmas-level)
 * Each pair is [drugA_id, drugB_id, severity, description]
 */
const INTERACTION_PAIRS = [
    ['warfarin_tab', 'ibuprofen_200', 'major', 'Risiko perdarahan meningkat'],
    ['warfarin_tab', 'ibuprofen_400', 'major', 'Risiko perdarahan meningkat'],
    ['warfarin_tab', 'asam_mefenamat_500', 'major', 'Risiko perdarahan meningkat'],
    ['metformin_500', 'alcohol', 'major', 'Risiko asidosis laktat'],
    ['captopril_25', 'kalium_tab', 'moderate', 'Risiko hiperkalemia'],
    ['amlodipine_5', 'simvastatin_20', 'moderate', 'Monitor miopati'],
    ['ciprofloxacin_500', 'antasida_tab', 'moderate', 'Absorpsi ciprofloxacin menurun'],
    ['metronidazole_500', 'alcohol', 'major', 'Reaksi disulfiram-like'],
    ['amoxicillin_500', 'methotrexate', 'moderate', 'Toksisitas methotrexate meningkat'],
    ['glimepiride_2', 'ciprofloxacin_500', 'moderate', 'Risiko hipoglikemia meningkat'],
];

/**
 * Form-route compatibility for pediatric safety
 */
const PEDIATRIC_SAFE_FORMS = ['syrup', 'drop', 'suppository', 'nebulizer', 'cream', 'ointment'];

/**
 * Verify a prescription against the 5 Rights of Medication
 * @param {Object} prescription - { patientId, patientName, patientAge, patientGender, patientAllergies[], items[{ medId, dose, frequency, duration, route }] }
 * @param {Object} inventory - { [medId]: { stock, batches[] } }
 * @returns {{ isValid, errors[], warnings[], verifiedItems[] }}
 */
export function verifyPrescription(prescription, inventory = {}) {
    const errors = [];
    const warnings = [];
    const verifiedItems = [];

    if (!prescription || !prescription.items || prescription.items.length === 0) {
        return { isValid: false, errors: ['Resep kosong — tidak ada obat yang dituliskan'], warnings, verifiedItems };
    }

    const allMedIds = prescription.items.map(i => i.medId);

    for (const item of prescription.items) {
        const med = getMedicationById(item.medId);
        const itemErrors = [];
        const itemWarnings = [];

        // RIGHT 1: Right Drug — does it exist?
        if (!med) {
            itemErrors.push(`Obat "${item.medId}" tidak ditemukan dalam database`);
            verifiedItems.push({ ...item, valid: false, errors: itemErrors, warnings: itemWarnings });
            continue;
        }

        // RIGHT 2: Right Patient — allergy check
        if (prescription.patientAllergies && prescription.patientAllergies.length > 0) {
            const allergyMatch = prescription.patientAllergies.find(a =>
                med.name.toLowerCase().includes(a.toLowerCase()) ||
                med.id.toLowerCase().includes(a.toLowerCase())
            );
            if (allergyMatch) {
                itemErrors.push(`⚠️ ALERGI: Pasien alergi terhadap "${allergyMatch}" — ${med.name} KONTRAINDIKASI`);
            }
        }

        // RIGHT 3: Right Dose — pediatric form check
        if (prescription.patientAge && prescription.patientAge < 6) {
            if (!PEDIATRIC_SAFE_FORMS.includes(med.form)) {
                itemWarnings.push(`Pasien usia ${prescription.patientAge} th — pertimbangkan bentuk sediaan anak (sirup/drop)`);
            }
        }

        // RIGHT 4: Right Route — check form vs route compatibility
        if (item.route && med.form) {
            const formRouteMap = {
                'tablet': ['oral'], 'capsule': ['oral'], 'syrup': ['oral'],
                'drop': ['oral', 'topical', 'otic', 'ophthalmic'],
                'injection': ['iv', 'im', 'sc'], 'cream': ['topical'], 'ointment': ['topical'],
                'suppository': ['rectal'], 'nebulizer': ['inhalation'], 'inhaler': ['inhalation']
            };
            const validRoutes = formRouteMap[med.form] || [];
            if (validRoutes.length > 0 && !validRoutes.includes(item.route)) {
                itemWarnings.push(`Rute "${item.route}" tidak sesuai dengan sediaan ${med.form}`);
            }
        }

        // RIGHT 5: Right Time — frequency sanity check
        if (item.frequency && item.frequency > 6) {
            itemWarnings.push(`Frekuensi ${item.frequency}x/hari — terlalu tinggi, periksa kembali`);
        }

        // STOCK CHECK
        const stockData = inventory[item.medId];
        const qtyNeeded = (item.dose || 1) * (item.frequency || 1) * (item.duration || 1);
        if (stockData && stockData.stock < qtyNeeded) {
            itemWarnings.push(`Stok tidak cukup: butuh ${qtyNeeded}, tersedia ${stockData.stock}`);
        }

        // FORNAS CHECK
        if (!med.fornas) {
            itemWarnings.push(`${med.name} bukan obat FORNAS — tidak bisa diklaim BPJS`);
        }

        verifiedItems.push({
            ...item,
            medName: med.name,
            medForm: med.form,
            unitPrice: med.unitPrice,
            sellPrice: med.sellPrice,
            qtyNeeded,
            valid: itemErrors.length === 0,
            errors: itemErrors,
            warnings: itemWarnings
        });

        errors.push(...itemErrors);
        warnings.push(...itemWarnings);
    }

    // DRUG INTERACTIONS — check all pairs
    const interactions = checkDrugInteractions(allMedIds);
    if (interactions.length > 0) {
        interactions.forEach(i => {
            if (i.severity === 'major') {
                errors.push(`🚨 INTERAKSI MAYOR: ${i.description}`);
            } else {
                warnings.push(`⚠️ Interaksi: ${i.description}`);
            }
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        verifiedItems,
        interactions
    };
}

// ═══════════════════════════════════════════════════════════════
// DRUG INTERACTION CHECK
// ═══════════════════════════════════════════════════════════════

/**
 * Check drug interactions among a list of medication IDs
 * @param {string[]} medIds
 * @returns {Array<{ drugA, drugB, severity, description }>}
 */
export function checkDrugInteractions(medIds) {
    const found = [];
    for (const [drugA, drugB, severity, desc] of INTERACTION_PAIRS) {
        if (medIds.includes(drugA) && medIds.includes(drugB)) {
            const medA = getMedicationById(drugA);
            const medB = getMedicationById(drugB);
            found.push({
                drugA: medA?.name || drugA,
                drugB: medB?.name || drugB,
                severity,
                description: desc
            });
        }
    }
    return found;
}

// ═══════════════════════════════════════════════════════════════
// BISHI BASHI DISPENSING GAME
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a dispensing challenge for Bishi Bashi mode
 * @param {number} difficulty - 1-5
 * @param {Object[]} prescriptionQueue - Array of patient prescriptions waiting
 * @returns {{ challenge, timeLimit, targetMeds[], distractorMeds[] }}
 */
export function generateDispensingChallenge(difficulty = 1, prescriptionQueue = []) {
    // Pick a prescription from queue or generate one
    const prescription = prescriptionQueue.length > 0
        ? prescriptionQueue[Math.floor(Math.random() * prescriptionQueue.length)]
        : null;

    const targetMeds = prescription
        ? prescription.items.map(i => i.medId)
        : ['paracetamol_500', 'amoxicillin_500']; // fallback

    // Time limit decreases with difficulty
    const timeLimit = Math.max(5, 20 - (difficulty * 3)); // 17s → 5s

    // Add distractors based on difficulty
    const distractorCount = Math.min(difficulty * 2, 8);
    const commonDistractors = [
        'ibuprofen_200', 'captopril_25', 'amlodipine_5', 'metformin_500',
        'omeprazole_20', 'ambroxol_30', 'ctm_4', 'dexamethasone_0',
        'ciprofloxacin_500', 'loperamide_2'
    ];
    const distractorMeds = commonDistractors
        .filter(d => !targetMeds.includes(d))
        .slice(0, distractorCount);

    return {
        challenge: {
            patientName: prescription?.patientName || 'Pasien',
            items: targetMeds.map(id => {
                const med = getMedicationById(id);
                return { medId: id, name: med?.name || id, form: med?.form || 'tablet' };
            })
        },
        timeLimit,
        targetMeds,
        distractorMeds,
        allMeds: [...targetMeds, ...distractorMeds].sort(() => Math.random() - 0.5)
    };
}

/**
 * Score a Bishi Bashi round
 * @param {string[]} targetMeds - correct med IDs
 * @param {string[]} playerPicks - what player selected
 * @param {number} timeMs - time taken in milliseconds
 * @param {number} timeLimitMs - max allowed time
 * @returns {{ accuracy, speed, combo, xpEarned, feedback }}
 */
export function scoreBishiBashi(targetMeds, playerPicks, timeMs, timeLimitMs) {
    const correct = playerPicks.filter(p => targetMeds.includes(p));
    const wrong = playerPicks.filter(p => !targetMeds.includes(p));
    const missed = targetMeds.filter(t => !playerPicks.includes(t));

    const accuracy = targetMeds.length > 0
        ? Math.round((correct.length / targetMeds.length) * 100)
        : 0;

    const speedRatio = Math.max(0, 1 - (timeMs / timeLimitMs));
    const speed = Math.round(speedRatio * 100);

    // Combo: perfect if 100% accuracy + fast
    const isPerfect = accuracy === 100 && wrong.length === 0;
    const combo = isPerfect ? Math.round(speed / 20) + 1 : 0;

    // XP calculation
    let xpEarned = Math.round(accuracy * 0.3 + speed * 0.2);
    if (isPerfect) xpEarned += 20; // perfect bonus
    if (wrong.length > 0) xpEarned -= wrong.length * 10; // penalty for wrong picks
    xpEarned = Math.max(0, xpEarned);

    let feedback;
    if (accuracy === 100 && wrong.length === 0) feedback = '✅ SEMPURNA! Semua obat benar!';
    else if (accuracy >= 80) feedback = '👍 Hampir sempurna — cek ulang yang terlewat.';
    else if (accuracy >= 50) feedback = '⚠️ Beberapa obat salah/terlewat. Teliti lagi!';
    else feedback = '❌ Banyak kesalahan. Baca resep dengan seksama!';

    return {
        accuracy, speed, combo, xpEarned, feedback,
        correct: correct.length, wrong: wrong.length, missed: missed.length
    };
}

// ═══════════════════════════════════════════════════════════════
// STOCK & DISPENSING
// ═══════════════════════════════════════════════════════════════

/**
 * Process stock dispensing with FIFO enforcement
 * @param {string} medId
 * @param {number} qty
 * @param {Object} inventory - { [medId]: { stock, batches: [{ qty, expiry, lotNo }] } }
 * @returns {{ success, newStock, dispensed[], fifoWarning, expiryWarning }}
 */
export function processStockDispense(medId, qty, inventory) {
    const stockData = inventory[medId];
    if (!stockData || stockData.stock < qty) {
        return { success: false, newStock: stockData?.stock || 0, dispensed: [], fifoWarning: false, expiryWarning: false };
    }

    let remaining = qty;
    const dispensed = [];
    let fifoWarning = false;
    let expiryWarning = false;

    // Sort batches by expiry (FIFO — first expiry first out)
    const sortedBatches = [...(stockData.batches || [])].sort((a, b) => new Date(a.expiry) - new Date(b.expiry));

    for (const batch of sortedBatches) {
        if (remaining <= 0) break;

        const take = Math.min(remaining, batch.qty);
        dispensed.push({ lotNo: batch.lotNo, qty: take, expiry: batch.expiry });

        // Check if expired
        if (new Date(batch.expiry) < new Date()) {
            expiryWarning = true;
        }
        // Check if expiring within 30 days
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        if (new Date(batch.expiry) - new Date() < thirtyDays) {
            fifoWarning = true;
        }

        batch.qty -= take;
        remaining -= take;
    }

    const newStock = stockData.stock - qty;

    return { success: true, newStock, dispensed, fifoWarning, expiryWarning };
}

/**
 * Calculate dispensing bill
 * @param {Object[]} verifiedItems - from verifyPrescription
 * @param {boolean} isBPJS
 * @returns {{ items[], subtotal, isCovered, finalBill }}
 */
export function calculateDispensingBill(verifiedItems, isBPJS = false) {
    const items = verifiedItems.map(item => {
        const cost = (item.sellPrice || 0) * (item.qtyNeeded || 1);
        return { name: item.medName || item.medId, qty: item.qtyNeeded || 1, unitPrice: item.sellPrice || 0, cost };
    });

    const subtotal = items.reduce((sum, i) => sum + i.cost, 0);
    const allFornas = verifiedItems.every(i => {
        const med = getMedicationById(i.medId);
        return med?.fornas === true;
    });

    const isCovered = isBPJS && allFornas;
    const finalBill = isCovered ? 0 : subtotal;

    return {
        items,
        subtotal,
        isCovered,
        coverageNote: isCovered
            ? '✅ Semua obat FORNAS — ditanggung BPJS'
            : isBPJS
                ? '⚠️ Ada obat non-FORNAS — pasien bayar selisih'
                : 'Pasien Umum — bayar penuh',
        finalBill
    };
}
