/**
 * @reflection
 * [IDENTITY]: ConsequenceEngine
 * [PURPOSE]: Evaluates clinical decisions and schedules delayed patient outcomes.
 *            Creates follow-up patients that return days later with improved or worsened conditions.
 * [STATE]: Experimental
 * [ANCHOR]: evaluateConsequences
 * [DEPENDS_ON]: PatientGenerator case data format, LabEngine LAB_CATALOG
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-23
 */

import { randomIdFromSeed, seedKey, seededInt } from '../utils/deterministicRandom.js';

// ═══════════════════════════════════════════════════════════════
// CONSEQUENCE RULES
// Maps missed/incorrect actions to delayed outcomes
// ═══════════════════════════════════════════════════════════════

/**
 * Extract systolic BP from various vital sign formats.
 * Modern patients use vitals.bp ("180/110"), legacy used vitals.tekananDarah.
 */
function extractSystolicBP(caseData) {
    const bpStr = caseData.vitals?.tekananDarah || caseData.vitals?.bp || caseData.vitals?.bloodPressure || '';
    if (!bpStr) return 0;
    return parseInt(bpStr.split('/')[0]) || 0;
}

/**
 * Lab panel → individual parameter key mapping.
 * EMR stores lab orders as panel keys (e.g. 'darah_lengkap': true),
 * but clinical rules need individual parameter keys (e.g. 'hemoglobin').
 * This maps panel keys to their contained parameter keys.
 */
const LAB_PANEL_TO_PARAMS = {
    darah_lengkap: ['hb', 'hemoglobin', 'ht', 'leukosit', 'trombosit', 'eritrosit', 'led'],
    gds: ['gds'],
    gdp: ['gdp'],
    gd2pp: ['gd2pp'],
    urinalisis: ['protein', 'glukosa', 'leukosit_urin', 'eritrosit_urin', 'nitrit'],
    hba1c: ['hba1c'],
    asam_urat: ['asam_urat'],
    kolesterol_total: ['kolesterol'],
};

/**
 * Check if a lab parameter was ordered (even as boolean flag).
 * Handles both direct key match and panel→parameter expansion.
 * Returns true if the lab was ordered in any form.
 */
function wasLabOrdered(labsRevealed, paramKey) {
    if (!labsRevealed) return false;
    // Direct key check
    if (labsRevealed[paramKey]) return true;
    // Check if any ordered panel contains this parameter
    for (const [panelKey, params] of Object.entries(LAB_PANEL_TO_PARAMS)) {
        if (labsRevealed[panelKey] && params.includes(paramKey)) return true;
    }
    return false;
}

/**
 * Extract a lab value from the labsRevealed object.
 * EMR stores labs as boolean true (flag-only) or as {value: string}.
 * Returns NaN if the lab was not ordered or is flag-only without a value.
 */
function extractLabValue(labsRevealed, paramKey) {
    // Direct key check
    let entry = labsRevealed?.[paramKey];

    // If not found directly, check via panel mapping
    if (entry === undefined) {
        for (const [panelKey, params] of Object.entries(LAB_PANEL_TO_PARAMS)) {
            if (labsRevealed?.[panelKey] && params.includes(paramKey)) {
                entry = labsRevealed[panelKey];
                break;
            }
        }
    }

    if (!entry) return NaN;
    // Boolean flag = lab was ordered but no numeric value available
    if (entry === true) return NaN;
    if (typeof entry === 'object' && entry.parameters && entry.parameters[paramKey]?.value !== undefined) {
        return parseFloat(entry.parameters[paramKey].value);
    }
    if (typeof entry === 'object' && entry.value !== undefined) {
        return parseFloat(entry.value);
    }
    if (typeof entry === 'string') return parseFloat(entry);
    return NaN;
}

const CONSEQUENCE_RULES = [
    // ── Hypertension missed/undertreated ──
    {
        id: 'htn_missed',
        match: (caseData, decisions) => {
            // Codex Fix: support both vitals.tekananDarah (legacy) and vitals.bp (modern)
            const systolic = extractSystolicBP(caseData);
            const hasTDHigh = systolic >= 140;
            // Codex Fix: hook sends ICD codes (e.g. 'I10'), not text labels
            const diagnosedHT = decisions.diagnosis?.some(d => {
                const dl = (d || '').toLowerCase();
                return dl.includes('hipertensi') || dl.includes('hypertension') ||
                    dl.startsWith('i10') || dl.startsWith('i11') || dl.startsWith('i15');
            });
            return hasTDHigh && !diagnosedHT;
        },
        outcome: {
            delayDays: [7, 14],
            condition: 'worsened',
            severity: 'high',
            narrative: 'kembali dengan keluhan pusing hebat dan TD lebih tinggi',
            newSymptoms: ['Pusing berputar hebat', 'Pandangan kabur', 'Mual muntah'],
            guidelineRef: {
                source: 'permenkes',
                text: 'TD ≥140/90 mmHg harus didiagnosis Hipertensi dan mendapat tatalaksana.',
                reference: 'Permenkes No. 5/2014 — Panduan Praktis Klinis Dokter'
            },
            xpImpact: -15,
            reputationImpact: -3,
        }
    },

    // ── Anemia in pregnancy missed ──
    {
        id: 'anemia_pregnancy',
        match: (caseData, decisions) => {
            // DeepThink Fix: caseData.patientName is a ghost property (name is on root patient, not medicalData)
            // Use decisions.patientName which is provided by the EMR hook
            const isPregnant = caseData.category === 'Maternal' ||
                decisions.category === 'Maternal' ||
                decisions.patientName?.toLowerCase().includes('hamil') ||
                caseData.trueDiagnosisCode?.startsWith('O') ||
                decisions.diagnosis?.some(d => {
                    const dl = (d || '').toLowerCase();
                    return dl.startsWith('o') || dl.includes('hamil') || dl.includes('pregnan');
                });
            // Codex Fix: check if hemoglobin-related lab was ordered (via panel or direct)
            const hbOrdered = wasLabOrdered(decisions.labsRevealed, 'hb');
            const hbValue = extractLabValue(decisions.labsRevealed, 'hb');
            // DeepThink Fix: if lab was ordered but value is boolean (NaN), use diagnosis-based fallback
            const hasLowHb = hbOrdered && (!isNaN(hbValue) ? hbValue < 11 : isPregnant);
            const treatedAnemia = decisions.medications?.some(m => {
                const ml = (typeof m === 'object' ? (m.id || m.name || '') : m).toLowerCase();
                return ml.includes('fe') || ml.includes('sulfas');
            });
            return isPregnant && hasLowHb && !treatedAnemia;
        },
        outcome: {
            delayDays: [14, 21],
            condition: 'complication',
            severity: 'critical',
            narrative: 'kembali dengan anemia berat dan tanda pre-eklampsia',
            newSymptoms: ['Sesak napas', 'Edema tungkai', 'TD meningkat', 'Lemas berat'],
            guidelineRef: {
                source: 'who',
                text: 'Hb <11 g/dL pada ibu hamil = anemia. Harus disuplementasi Fe+asam folat.',
                reference: 'WHO ANC Guideline 2016 — Iron/Folic Acid supplementation'
            },
            xpImpact: -25,
            reputationImpact: -5,
        }
    },

    // ── Diabetes uncontrolled ──
    {
        id: 'dm_uncontrolled',
        match: (caseData, decisions) => {
            // Codex Fix: check if gds was ordered (direct key or panel)
            const gdsOrdered = wasLabOrdered(decisions.labsRevealed, 'gds');
            const gdsValue = extractLabValue(decisions.labsRevealed, 'gds');
            // DeepThink Fix: if lab was ordered but value is boolean (NaN), use diagnosis-based fallback
            const hasHighGDS = gdsOrdered && (!isNaN(gdsValue) ? gdsValue > 200 : 
                (caseData.trueDiagnosisCode?.startsWith('E11') || caseData.trueDiagnosisCode?.startsWith('E10')));
            const prescribedMed = decisions.medications?.some(m => {
                const ml = (typeof m === 'object' ? (m.id || m.name || '') : m).toLowerCase();
                return ml.includes('metformin') || ml.includes('glibenclamid');
            });
            return hasHighGDS && !prescribedMed;
        },
        outcome: {
            delayDays: [14, 30],
            condition: 'worsened',
            severity: 'medium',
            narrative: 'kembali dengan GDS lebih tinggi dan keluhan poliuria-polidipsia',
            newSymptoms: ['Sering kencing malam', 'Haus berlebihan', 'Penurunan berat badan', 'Luka sulit sembuh'],
            guidelineRef: {
                source: 'permenkes',
                text: 'GDS >200 mg/dL + gejala klasik = Diabetes Melitus. Mulai terapi oral.',
                reference: 'Konsensus DM PERKENI 2021'
            },
            xpImpact: -10,
            reputationImpact: -2,
        }
    },

    // ── Good outcome: correct diagnosis + treatment ──
    {
        id: 'good_outcome',
        match: (caseData, decisions) => {
            const clinicalQualityScore = Number(decisions.clinicalQualityScore) || 0;
            const isClinicalCareComplete = decisions.isClinicalCareComplete !== false;

            return decisions.diagnosisScore >= 80
                && decisions.treatmentScore >= 70
                && clinicalQualityScore >= 70
                && isClinicalCareComplete;
        },
        outcome: {
            delayDays: [7, 14],
            condition: 'improved',
            severity: 'positive',
            narrative: 'kembali untuk kontrol dan sudah membaik',
            newSymptoms: [],
            guidelineRef: null,
            xpImpact: 15,
            reputationImpact: 2,
        }
    },
];

// ═══════════════════════════════════════════════════════════════
// CORE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Evaluate a discharged patient's case and determine if there should be a follow-up.
 */
export function evaluateConsequences(caseData, decisions, currentDay) {
    if (!caseData || !decisions) return null;

    for (const rule of CONSEQUENCE_RULES) {
        try {
            if (rule.match(caseData, decisions)) {
                const { outcome } = rule;
                const [minDelay, maxDelay] = outcome.delayDays;
                // DeepThink Fix: use decisions.patientName (root-level), not caseData.patientName (ghost)
                const patientKey = decisions.patientName || caseData.name || 'unknown';
                const delaySeed = seedKey(
                    'consequence-delay', rule.id, currentDay,
                    patientKey,
                    decisions.diagnosis, decisions.action
                );
                const delay = minDelay + seededInt(delaySeed, maxDelay - minDelay + 1);

                return {
                    id: randomIdFromSeed(
                        'consequence',
                        seedKey('consequence', rule.id, currentDay, patientKey, delay)
                    ),
                    ruleId: rule.id,
                    returnDay: currentDay + delay,
                    originalCase: {
                        patientName: decisions.patientName || caseData.name || 'Pasien',
                        age: caseData.age || decisions.age,
                        gender: caseData.gender || decisions.gender,
                        originalDiagnosis: caseData.trueDiagnosisCode || caseData.correctDiagnosis || caseData.icd10 || caseData.diagnosisName || '',
                        category: caseData.category || decisions.category || '',
                    },
                    condition: outcome.condition,
                    severity: outcome.severity,
                    narrative: outcome.narrative,
                    newSymptoms: outcome.newSymptoms,
                    guidelineRef: outcome.guidelineRef,
                    xpImpact: outcome.xpImpact,
                    reputationImpact: outcome.reputationImpact,
                    createdDay: currentDay,
                };
            }
        } catch (err) {
            // DeepThink Fix: log errors instead of silently swallowing
            console.error(`[ConsequenceEngine] Rule ${rule.id} error:`, err);
            continue;
        }
    }
    return null;
}

export function getScheduledFollowups(consequenceQueue = [], currentDay) {
    return consequenceQueue.filter(c => c.returnDay === currentDay);
}

export function getUpcomingFollowups(consequenceQueue = [], currentDay, lookahead = 3) {
    return consequenceQueue.filter(c =>
        c.returnDay > currentDay && c.returnDay <= currentDay + lookahead
    );
}

// DeepThink Fix: filter by processed IDs, not just by day (so ukp_bridge events survive)
export function clearProcessedFollowups(consequenceQueue = [], currentDay, processedIds = []) {
    if (processedIds.length > 0) {
        // Remove only the specific follow-ups that were processed
        return consequenceQueue.filter(c => !processedIds.includes(c.id));
    }
    // Fallback: remove all past-due (legacy behavior)
    return consequenceQueue.filter(c => c.returnDay > currentDay);
}
