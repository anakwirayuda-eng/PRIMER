/**
 * @reflection
 * [IDENTITY]: ClinicalReasoning
 * [PURPOSE]: CLINICAL REASONING ENGINE (Sprint 2 - MAIA) Provides: 1. Global Coverage (Macro) — KU-RPS-RPD-RPK-Sosial exploration 2. 
 * [STATE]: Experimental
 * [ANCHOR]: ANAMNESIS_CATEGORIES
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * CLINICAL REASONING ENGINE (Sprint 2 - MAIA)
 * 
 * Provides:
 * 1. Global Coverage (Macro) — KU-RPS-RPD-RPK-Sosial exploration
 * 2. HPI Depth (Micro) — OLD CARTS dimension tracking
 * 3. Essential Progress — Coverage of case-specific critical questions
 * 4. Bayesian Diagnostic Probability — Real-time confidence tracking
 * 5. MAIA (Medical Artificial Intelligence Assistant) — Context-aware alerts
 */

import {
    getCanonicalPhysicalExamKeys,
    getPhysicalExamDisplayName,
} from '../utils/physicalExam.js';
import { getCanonicalLabKeys, getLabDisplayName } from '../utils/labs.js';

// ============================================================================
// FRAMEWORKS
// ============================================================================

export const ANAMNESIS_CATEGORIES = [
    { id: 'keluhan_utama', label: 'Keluhan Utama', weight: 15 },
    { id: 'rps', label: 'Riwayat Penyakit Sekarang', weight: 30 },
    { id: 'rpd', label: 'Riwayat Penyakit Dahulu', weight: 20 },
    { id: 'rpk', label: 'Riwayat Penyakit Keluarga', weight: 15 },
    { id: 'sosial', label: 'Sosial & Kebiasaan', weight: 20 }
];

// OLD CARTS Mapping (Micro-Depth for RPS)
// We use a mix of ID matching (for generics) and keyword matching (for case-specifics)
// Merged: C-version extended IDs + severity/associated dimensions + D-version keyword fallback
export const OLD_CARTS = {
    onset: { label: 'Onset', ids: ['q_onset', 'rps_onset', 'q_when', 'q_time'], keywords: ['onset', 'mulai', 'sejak', 'kapan', 'when', 'since'] },
    location: { label: 'Location', ids: ['q_location', 'q_loc', 'rps_lokasi', 'q_area', 'q_distribution'], keywords: ['lokasi', 'di mana', 'tempat', 'posisi', 'where', 'location'] },
    duration: { label: 'Duration', ids: ['q_duration', 'rps_durasi', 'q_length'], keywords: ['durasi', 'berapa lama', 'duration', 'length', 'lama'] },
    character: { label: 'Character', ids: ['q_type', 'rps_kualitas', 'q_feeling', 'q_description', 'q_cough_type', 'q_cough', 'q_quality', 'q_color', 'q_discharge', 'q_smell', 'q_texture'], keywords: ['kualitas', 'rasa', 'seperti apa', 'type', 'feeling', 'character'] },
    aggravating: { label: 'Aggravating/Relieving', ids: ['q_trigger', 'rps_pemberat', 'rps_peringan', 'q_better', 'q_worse', 'q_sob_severity', 'q_scratch', 'q_sun', 'q_sweat_trigger'], keywords: ['pemberat', 'peringan', 'trigger', 'better', 'worse', 'faktor'] },
    radiation: { label: 'Radiation', ids: ['q_radiate', 'rps_menjalar', 'q_spread', 'q_lump', 'q_swelling', 'q_contagious', 'q_distribution'], keywords: ['menjalar', 'radiate', 'spread', 'penjalaran'] },
    timing: { label: 'Timing', ids: ['q_timing', 'q_freq', 'q_frequency', 'q_recurrence', 'q_pattern'], keywords: ['timing', 'frequency', 'sering', 'kapan', 'frekuensi'] },
    severity: { label: 'Severity', ids: ['q_severity', 'gen_ku_severity', 'q_sob_severity', 'q_pain_scale', 'q_itch_scale'], keywords: ['berat', 'parah', 'severity', 'skala', 'keparahan'] },
    associated: { label: 'Associated Symptoms', ids: ['q_associated', 'q_fever', 'q_cough', 'q_sob', 'q_nausea', 'q_vomit', 'q_headache', 'q_whoop', 'q_myalgia', 'q_blood', 'q_weight', 'q_sweat', 'q_chest_pain', 'q_ear_pain', 'q_itch', 'q_rash', 'q_hair_loss', 'q_vision', 'q_pain'], keywords: ['gejala lain', 'keluhan penyerta', 'associated', 'disertai'] }
};

// P0-C: Essential ID aliases — maps essential IDs to generic equivalents
const ESSENTIAL_ALIASES = {
    'q_onset': ['rps_onset'],
    'q_duration': ['rps_durasi'],
    'q_location': ['rps_lokasi'],
    'q_quality': ['rps_kualitas'],
    'q_trigger': ['rps_pemberat'],
    'q_allergy': ['rpd_alergi'],
    'q_alergi': ['rpd_alergi'],
    'q_meds': ['rpd_obat_rutin', 'rps_obat'],
    'q_med_compliance': ['rpd_obat_rutin'],
    'q_history': ['rpd_serupa'],
    'q_surgery': ['rpd_operasi'],
    'q_ht': ['rpd_hipertensi'],
    'q_dm': ['rpd_diabetes'],
    'q_family_history': ['rpk_hipertensi', 'rpk_diabetes', 'rpk_jantung'],
    'q_family_ht': ['rpk_hipertensi'],
    'q_family_dm': ['rpk_diabetes'],
    'q_family_heart': ['rpk_jantung'],
    'q_family_tbc': ['rpk_tbc'],
    'q_smoke': ['sos_merokok'],
    'q_diet': ['sos_makan'],
    'q_exercise': ['sos_olahraga'],
    'q_sleep': ['sos_tidur'],
    'q_main': ['initial_complaint', 'q_main_complaint', 'gen_ku_severity'],
    'q_main_complaint': ['initial_complaint', 'q_main'],
};

// ============================================================================
// SCORE CALCULATION
// ============================================================================

/**
 * Calculate coverage across all categories and clinical dimensions.
 * Weighted by Primary Care EBM: Anamnesis (70%), Physical (15%), Labs (15%).
 * For Emergency cases: Anamnesis (30%), Physical (50%), Labs (20%).
 */
export function calculateCoverageScore(askedQuestions, examsPerformed = [], labsRevealed = [], essentialIds = [], options = {}) {
    // 1. ANAMNESIS COMPONENT
    let anamnesisScore = 0;
    let anamnesisBreakdown = { macro: 0, micro: 0, essential: 0 };

    if (askedQuestions && askedQuestions.length > 0) {
        const idSet = new Set(askedQuestions.map(q => q.id));
        const catCounts = {};

        askedQuestions.forEach(q => {
            if (q.category) {
                catCounts[q.category] = (catCounts[q.category] || 0) + 1;
            }
        });

        // Macro (Categories)
        let macroScore = 0;
        ANAMNESIS_CATEGORIES.forEach(cat => {
            if (catCounts[cat.id] > 0) macroScore += cat.weight;
        });

        // Micro (OLD CARTS) — P0-B: ID match OR keyword match in question text
        let microCoveredCount = 0;
        const microTotal = Object.keys(OLD_CARTS).length;
        Object.values(OLD_CARTS).forEach(def => {
            // Check by ID first
            if (def.ids.some(id => idSet.has(id))) {
                microCoveredCount++;
                return;
            }
            // Fallback: keyword match in question text
            if (def.keywords && askedQuestions.some(q => {
                const text = (q.text || '').toLowerCase();
                return def.keywords.some(kw => text.includes(kw));
            })) {
                microCoveredCount++;
            }
        });
        const microScore = Math.round((microCoveredCount / microTotal) * 100);

        // Essential — P0-C: check aliases too
        const essentialHits = essentialIds.filter(eId => {
            if (idSet.has(eId)) return true;
            const aliases = ESSENTIAL_ALIASES[eId];
            return aliases && aliases.some(a => idSet.has(a));
        }).length;
        const essentialTotal = essentialIds.length || 1;
        const essentialProgress = Math.round((essentialHits / essentialTotal) * 100);

        anamnesisBreakdown = { macro: macroScore, micro: microScore, essential: essentialProgress };

        // Inner Anamnesis weight: 25% Macro, 25% Micro, 50% Essential
        anamnesisScore = Math.round((macroScore * 0.25) + (microScore * 0.25) + (essentialProgress * 0.5));
    }

    // 2. PHYSICAL EXAM COMPONENT
    const performedExams = getCanonicalPhysicalExamKeys(
        Array.isArray(examsPerformed) ? examsPerformed : Object.keys(examsPerformed || {})
    );
    const physicalScore = performedExams.length > 0 ? Math.min(100, performedExams.length * 20) : 0;

    // 3. LABS COMPONENT
    const revealedLabs = Array.isArray(labsRevealed) ? labsRevealed : Object.keys(labsRevealed || {});
    const labsScore = revealedLabs.length > 0 ? 100 : 0;

    // 4. TOTAL COMPOSITE SCORE
    const isEmergency = options.caseType === 'emergency';
    const weights = isEmergency
        ? { anamnesis: 0.30, physical: 0.50, labs: 0.20 }
        : { anamnesis: 0.70, physical: 0.15, labs: 0.15 };

    const totalScore = Math.round(
        (anamnesisScore * weights.anamnesis) +
        (physicalScore * weights.physical) +
        (labsScore * weights.labs)
    );

    return {
        score: totalScore,
        anamnesisTotal: anamnesisScore,  // Pure anamnesis-only score (0-100) for UI binding
        anamnesis: anamnesisBreakdown,
        physical: physicalScore,
        labs: labsScore,
        isEmergency,
        weights,
        // Legacy fields for UI compatibility
        macro: anamnesisBreakdown.macro,
        micro: anamnesisBreakdown.micro,
        essential: anamnesisBreakdown.essential
    };
}

// ============================================================================
// MAIA FEEDBACK
// ============================================================================

const CRITICAL_CHECKS = [
    {
        id: 'allergy',
        label: 'Riwayat Alergi',
        ids: ['rpd_alergi', 'q_allergy', 'q_alergi'],
        message: 'Dok, jangan lupa tanyakan riwayat alergi sebelum meresepkan obat.',
        priority: 'high',
        suggestTab: 'rpd'
    },
    {
        id: 'meds',
        label: 'Riwayat Obat',
        ids: ['rpd_obat_rutin', 'q_meds', 'q_meds_routine', 'q_med_compliance', 'rps_obat'],
        message: 'Dok, pastikan menanyakan obat-obatan yang sedang atau pernah dikonsumsi.',
        priority: 'medium',
        suggestTab: 'rpd'
    },
    {
        id: 'keluhan_utama_check',
        label: 'Keluhan Utama',
        message: 'Dok, Keluhan Utama belum digali. Ini bagian penting dari struktur anamnesis yang lengkap.',
        priority: 'high',
        suggestTab: 'keluhan_utama'
    },
    {
        id: 'rps_check',
        label: 'Riwayat Penyakit Sekarang',
        message: 'Dok, Riwayat Penyakit Sekarang belum digali secara mendalam.',
        priority: 'high',
        suggestTab: 'rps'
    },
    {
        id: 'rpd_check',
        label: 'Riwayat Penyakit Dahulu',
        message: 'Dok, Riwayat Penyakit Dahulu belum digali.',
        priority: 'medium',
        suggestTab: 'rpd'
    },
    {
        id: 'rpk_check',
        label: 'Riwayat Penyakit Keluarga',
        message: 'Dok, Riwayat Penyakit Keluarga belum digali.',
        priority: 'low',
        suggestTab: 'rpk'
    },
    {
        id: 'sosial_check',
        label: 'Sosial & Kebiasaan',
        message: 'Dok, Sosial & Kebiasaan pasien belum digali.',
        priority: 'low',
        suggestTab: 'sosial'
    }
];

/**
 * Get context-aware MAIA clinical feedback.
 * @param {Array} history - Anamnesis history
 * @param {string} currentTab - Active category tab
 * @param {object} [caseData] - Optional case data for SKDI-aware referral alerts
 */
export function getMAIAAlerts(history, currentTab, caseData) {
    const alerts = [];
    const askedIds = new Set(history.map(q => q.id));
    const askedCategories = new Set(history.map(q => q.category));

    // Threshold: don't annoy early on
    if (history.length < 7) return [];

    // Referral-aware SKDI alert (highest priority)
    if (caseData?.skdi) {
        const skdi = String(caseData.skdi).toUpperCase();
        const needsReferral = ['1', '2', '3A', '3B'].includes(skdi);
        if (needsReferral && history.length >= 6) {
            const skdiMessages = {
                '1': 'Dok, kasus ini SKDI level 1 — harus dirujuk sepenuhnya ke spesialis. Stabilkan pasien dan siapkan rujukan.',
                '2': 'Dok, kasus ini SKDI level 2 — pasien perlu dirujuk ke fasilitas yang lebih lengkap setelah penanganan awal.',
                '3A': 'Dok, kasus ini SKDI level 3A — buat diagnosis klinis dan rujuk untuk penanganan definitif.',
                '3B': 'Dok, kasus ini SKDI level 3B — lakukan penanganan awal & stabilisasi lalu siapkan rujukan.'
            };
            alerts.push({
                id: 'skdi_referral',
                label: `SKDI Level ${skdi} — Perlu Rujukan`,
                message: skdiMessages[skdi],
                priority: 'high',
                suggestTab: null
            });
        }
    }

    const relevantCategories = caseData?.relevantCategories || ['keluhan_utama', 'rps', 'rpd', 'rpk', 'sosial'];

    // Macro Alerts (Missed Categories)
    ANAMNESIS_CATEGORIES.forEach(cat => {
        if (!relevantCategories.includes(cat.id)) return; // Skip irrelevant categories
        if (cat.id === currentTab) return; // DON'T alert if already in that tab
        if (askedCategories.has(cat.id)) return; // Already visited

        const check = CRITICAL_CHECKS.find(c => c.suggestTab === cat.id && c.id.includes('_check'));
        if (check) {
            alerts.push({
                id: check.id,
                label: check.label,
                message: check.message,
                priority: check.priority,
                suggestTab: check.suggestTab
            });
        }
    });

    // Micro Alerts (Special Clinical Checks)
    CRITICAL_CHECKS.filter(c => !c.id.includes('_check')).forEach(check => {
        if (check.ids && check.ids.some(id => askedIds.has(id))) return;
        if (check.suggestTab && check.suggestTab === currentTab) return; // Don't alert if in the suggested tab for this check

        alerts.push({
            id: check.id,
            label: check.label,
            message: check.message,
            priority: check.priority,
            suggestTab: check.suggestTab
        });
    });

    // Return only the highest priority alert
    const order = { high: 0, medium: 1, low: 2 };
    alerts.sort((a, b) => order[a.priority] - order[b.priority]);

    return alerts.slice(0, 1);
}

// ============================================================================
// DIAGNOSTIC CONFIDENCE
// ============================================================================

/**
 * Bayesian-Lite confidence calculation.
 */
export function getDiagnosticConfidence(tracker, coverage) {
    if (!tracker) {
        return { confidence: 0, level: 'unknown' };
    }

    // Decoupled from macro coverage score: rely purely on tracked essentials and specific findings
    let confidence = 0;
    if (tracker.essentialsTotal > 0) {
        confidence = (tracker.essentialsCovered / tracker.essentialsTotal) * 100;
    } else {
        confidence = Math.min((tracker.totalQuestions / 5) * 60, 60); // Baseline if no essentials defined
    }

    // Cross-source verification bonus (EBM Multi-source)
    if (coverage && coverage.physical > 40) confidence += 15;
    if (coverage && coverage.labs > 50) confidence += 20;

    confidence = Math.min(100, Math.round(confidence));

    // Initial investigation penalty (Early game)
    if (tracker.totalQuestions < 3) confidence = Math.min(confidence, 10);
    if (tracker.totalQuestions < 5) confidence = Math.min(confidence, 40);

    let level = 'low';
    if (confidence >= 85) level = 'high';
    else if (confidence >= 60) level = 'moderate';
    else if (confidence >= 30) level = 'developing';

    return {
        confidence,
        level,
        topDiagnosis: tracker.correctDiagnosis,
    };
}

// Compatibility layer for the old tracker function (minor Bayesian lite)
export function updateDiagnosticProbability(tracker, questionId, responseStatus, essentialIds) {
    if (!tracker) return null;
    const isEssential = essentialIds.includes(questionId);

    return {
        ...tracker,
        totalQuestions: (tracker.totalQuestions || 0) + 1,
        essentialsCovered: isEssential ? (tracker.essentialsCovered || 0) + 1 : (tracker.essentialsCovered || 0)
    };
}

export function initDiagnosticTracker(caseData) {
    return {
        probabilities: { [caseData?.icd10 || 'R69']: 0.5 },
        totalQuestions: 0,
        essentialsCovered: 0,
        essentialsTotal: caseData?.essentialQuestions?.length || 0,
        correctDiagnosis: caseData?.icd10 || 'R69'
    };
}

// ============================================================================
// EXAM / LAB SUGGESTIONS (MAIA Tips)
// ============================================================================

/**
 * Generate context-aware exam and lab suggestions for MAIA.
 * Compares case-required exams/labs against what player has performed.
 * @param {object} caseData - patient.medicalData with physicalExamFindings and relevantLabs
 * @param {string[]} performedExams - array of exam IDs the player has done
 * @param {string[]} orderedLabs - array of lab IDs the player has ordered
 * @param {number} anamnesisProgress - 0-100 anamnesis coverage score
 * @returns {{ examSuggestions: Array, labSuggestions: Array }}
 */
export function getExamLabSuggestions(caseData, performedExams = [], orderedLabs = [], anamnesisProgress = 0) {
    const examSuggestions = [];
    const labSuggestions = [];

    if (!caseData) return { examSuggestions, labSuggestions };

    // Don't suggest until player has done some anamnesis
    if (anamnesisProgress < 30) return { examSuggestions, labSuggestions };

    // 1. Physical Exam Suggestions
    const requiredExams = getCanonicalPhysicalExamKeys(Object.keys(caseData.physicalExamFindings || {}));
    const performedSet = new Set(getCanonicalPhysicalExamKeys(performedExams));

    requiredExams.forEach(examId => {
        if (!performedSet.has(examId)) {
            const displayName = getPhysicalExamDisplayName(examId);
            examSuggestions.push({
                id: examId,
                label: displayName,
                message: `Pertimbangkan pemeriksaan fisik: ${displayName}`,
                priority: (examId === 'vitals' || examId === 'general') ? 'high' : 'medium'
            });
        }
    });

    // Prioritize: always suggest vitals and general first
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    examSuggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // 2. Lab Suggestions
    const requiredLabs = getCanonicalLabKeys(caseData.relevantLabs || []);
    const orderedSet = new Set(getCanonicalLabKeys(orderedLabs));

    requiredLabs.forEach(labId => {
        if (!orderedSet.has(labId)) {
            const label = getLabDisplayName(labId);
            labSuggestions.push({
                id: labId,
                label,
                message: `Lab yang perlu dipertimbangkan: ${label}`,
                priority: 'medium'
            });
        }
    });

    // Cap at 3 suggestions each to avoid overwhelming
    return {
        examSuggestions: examSuggestions.slice(0, 3),
        labSuggestions: labSuggestions.slice(0, 3)
    };
}
