/**
 * @reflection
 * [IDENTITY]: ConsequenceEngine
 * [PURPOSE]: Evaluates clinical decisions and schedules delayed patient outcomes.
 *            Creates follow-up patients that return days later with improved or worsened conditions.
 * [STATE]: Experimental
 * [ANCHOR]: evaluateConsequences
 * [DEPENDS_ON]: PatientGenerator case data format
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-17
 */

import { randomIdFromSeed, seedKey, seededInt } from '../utils/deterministicRandom.js';

// ═══════════════════════════════════════════════════════════════
// CONSEQUENCE RULES
// Maps missed/incorrect actions to delayed outcomes
// ═══════════════════════════════════════════════════════════════

const CONSEQUENCE_RULES = [
    // ── Hypertension missed/undertreated ──
    {
        id: 'htn_missed',
        match: (caseData, decisions) => {
            const hasTDHigh = caseData.vitals?.tekananDarah &&
                (parseInt(caseData.vitals.tekananDarah.split('/')[0]) >= 140);
            const diagnosedHT = decisions.diagnosis?.some(d =>
                d.toLowerCase().includes('hipertensi') || d.toLowerCase().includes('hypertension')
            );
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
            const isPregnant = caseData.category === 'Maternal' ||
                caseData.patientName?.includes('hamil');
            const hasLowHb = decisions.labsRevealed?.hemoglobin &&
                parseFloat(decisions.labsRevealed.hemoglobin?.value) < 11;
            const treatedAnemia = decisions.medications?.some(m =>
                m.toLowerCase().includes('fe') || m.toLowerCase().includes('sulfas')
            );
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
            const hasHighGDS = decisions.labsRevealed?.gds &&
                parseFloat(decisions.labsRevealed.gds?.value) > 200;
            const prescribedMed = decisions.medications?.some(m =>
                m.toLowerCase().includes('metformin') || m.toLowerCase().includes('glibenclamid')
            );
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
            return decisions.diagnosisScore >= 80 && decisions.treatmentScore >= 70;
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
 * 
 * @param {Object} caseData - The original case data from PatientGenerator
 * @param {Object} decisions - Player's clinical decisions:
 *   { diagnosis: string[], medications: string[], labsRevealed: Object,
 *     diagnosisScore: number, treatmentScore: number, referralMade: boolean }
 * @param {number} currentDay - Current game day
 * @returns {Object|null} Follow-up entry for consequenceQueue, or null if no consequence
 */
export function evaluateConsequences(caseData, decisions, currentDay) {
    if (!caseData || !decisions) return null;

    // Check each rule in priority order
    for (const rule of CONSEQUENCE_RULES) {
        try {
            if (rule.match(caseData, decisions)) {
                const { outcome } = rule;
                const [minDelay, maxDelay] = outcome.delayDays;
                const delaySeed = seedKey(
                    'consequence-delay',
                    rule.id,
                    currentDay,
                    caseData.patientName || caseData.name,
                    decisions.diagnosis,
                    decisions.action
                );
                const delay = minDelay + seededInt(delaySeed, maxDelay - minDelay + 1);

                return {
                    id: randomIdFromSeed(
                        'consequence',
                        seedKey('consequence', rule.id, currentDay, caseData.patientName || caseData.name, delay)
                    ),
                    ruleId: rule.id,
                    returnDay: currentDay + delay,
                    originalCase: {
                        patientName: caseData.patientName || 'Pasien',
                        age: caseData.age,
                        gender: caseData.gender,
                        originalDiagnosis: caseData.correctDiagnosis,
                        category: caseData.category,
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
        } catch {
            // If a rule match fails (missing data), skip silently
            continue;
        }
    }

    return null;
}

/**
 * Get all follow-up patients scheduled for a specific day.
 * Used by MorningBriefing to show alerts.
 * 
 * @param {Array} consequenceQueue - Array of consequence entries
 * @param {number} currentDay - Current game day
 * @returns {Array} Follow-ups due today
 */
export function getScheduledFollowups(consequenceQueue = [], currentDay) {
    return consequenceQueue.filter(c => c.returnDay === currentDay);
}

/**
 * Get upcoming follow-ups within the next N days (for preview).
 * 
 * @param {Array} consequenceQueue - Array of consequence entries
 * @param {number} currentDay - Current game day
 * @param {number} lookahead - Days ahead to look (default 3)
 * @returns {Array} Upcoming follow-ups
 */
export function getUpcomingFollowups(consequenceQueue = [], currentDay, lookahead = 3) {
    return consequenceQueue.filter(c =>
        c.returnDay > currentDay && c.returnDay <= currentDay + lookahead
    );
}

/**
 * Remove processed follow-ups from the queue.
 * Call after follow-up patients have been injected into the game queue.
 * 
 * @param {Array} consequenceQueue - Current queue
 * @param {number} currentDay - Current game day
 * @returns {Array} Updated queue without today's processed items
 */
export function clearProcessedFollowups(consequenceQueue = [], currentDay) {
    return consequenceQueue.filter(c => c.returnDay > currentDay);
}
