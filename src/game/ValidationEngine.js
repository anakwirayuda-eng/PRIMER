/**
 * @reflection
 * [IDENTITY]: ValidationEngine
 * [PURPOSE]: ValidationEngine.js — Medical logic for validating patient care.
 * [STATE]: Experimental
 * [ANCHOR]: validateDiagnosis
 * [DEPENDS_ON]: MedicationDatabase, ProceduresDB, EducationOptions
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * ValidationEngine.js — Medical logic for validating patient care.
 */

import { getMedicationById } from '../data/MedicationDatabase.js';
import { PROCEDURES_DB, PROCEDURE_CODE_MAP } from '../data/ProceduresDB.js';
import { EDUCATION_OPTIONS } from '../data/EducationOptions.js';
import { calculateCoverageScore } from './ClinicalReasoning.js';
import { getCanonicalPhysicalExamKeys } from '../utils/physicalExam.js';
import {
    getLabDisplayName,
    normalizeLabEntries,
    normalizeLabKey,
} from '../utils/labs.js';

export function validateDiagnosis(patientCase, selectedDiagnoses) {
    // Support both raw case data (.icd10) and patient.medicalData (.trueDiagnosisCode)
    const correctCode = patientCase?.icd10 || patientCase?.trueDiagnosisCode;
    if (!correctCode || !selectedDiagnoses?.length) {
        return { isPrimaryCorrect: false, hasReasonableDifferential: false, correctAnswer: correctCode || 'N/A', feedback: '❌ Diagnosis kurang tepat. Coba review ulang gejala dan pemeriksaan fisik.' };
    }
    const isPrimaryCorrect = selectedDiagnoses.some(d => d.code === correctCode);
    const differentials = patientCase.differentialDiagnosis || [];

    const hasReasonableDifferential = selectedDiagnoses.some(d =>
        differentials.some(dd => {
            const ddLower = dd.toLowerCase();
            const nameLower = (d.name || '').toLowerCase();
            return d.code === dd || nameLower.includes(ddLower) || ddLower.includes(nameLower);
        })
    );

    return {
        isPrimaryCorrect,
        isCorrect: isPrimaryCorrect,
        hasReasonableDifferential,
        correctAnswer: correctCode,
        feedback: isPrimaryCorrect
            ? "✅ Diagnosis utama BENAR!"
            : hasReasonableDifferential
                ? "⚠️ Diagnosis bisa dipertimbangkan, tapi bukan yang paling tepat."
                : "❌ Diagnosis kurang tepat. Coba review ulang gejala dan pemeriksaan fisik."
    };
}

export function validateTreatment(patientCase, selectedMeds, selectedProcedures) {
    const correctMeds = patientCase.correctTreatment || [];
    const correctProcs = patientCase.correctProcedures || [];

    const medsCorrect = correctMeds.filter(m => {
        if (Array.isArray(m)) return m.some(alt => selectedMeds.some(sm => (typeof sm === 'object' ? sm.id : sm) === alt));
        return selectedMeds.some(sm => (typeof sm === 'object' ? sm.id : sm) === m);
    });

    const procsCorrect = correctProcs.filter(p => {
        if (selectedProcedures.includes(p)) return true;
        const mappedCodes = PROCEDURE_CODE_MAP[p] || [];
        return mappedCodes.some(code => selectedProcedures.includes(code));
    });

    const score = (medsCorrect.length / Math.max(correctMeds.length, 1)) * 100;

    const feedback = score >= 80 ? "✅ Terapi sudah tepat!" : score >= 50 ? "⚠️ Terapi sebagian benar." : "❌ Terapi perlu diperbaiki.";
    const note = patientCase.treatmentNote ? `\n\n💡 Catatan: ${patientCase.treatmentNote}` : "";

    const getMedName = (id) => {
        if (Array.isArray(id)) return id.map(alt => getMedicationById(alt)?.name || alt.replace(/_/g, ' ')).join(' / ');
        return getMedicationById(id)?.name || id.replace(/_/g, ' ');
    };
    const getProcName = (id) => PROCEDURES_DB.find(p => p.id === id)?.name || id.replace(/_/g, ' ');

    const missingMeds = correctMeds.filter(m => {
        if (Array.isArray(m)) return !m.some(alt => selectedMeds.some(sm => (typeof sm === 'object' ? sm.id : sm) === alt));
        return !selectedMeds.some(sm => (typeof sm === 'object' ? sm.id : sm) === m);
    }).map(getMedName);

    return {
        score: Math.round(score),
        correctMeds: medsCorrect.map(getMedName),
        missingMeds,
        unnecessaryMeds: selectedMeds.filter(m => {
            const mId = typeof m === 'object' ? m.id : m;
            return !correctMeds.some(cm => {
                if (Array.isArray(cm)) return cm.includes(mId);
                return cm === mId;
            });
        }).map(item => {
            const id = typeof item === 'object' ? item.id : item;
            return getMedicationById(id)?.name || id.replace(/_/g, ' ');
        }),
        correctProcs: procsCorrect.map(getProcName),
        missingProcs: correctProcs.filter(p => !selectedProcedures.includes(p)).map(getProcName),
        feedback: feedback + note
    };
}

export function validateEducation(patientCase, selectedEducation) {
    const requiredEducation = patientCase.requiredEducation || [];

    const correct = selectedEducation.filter(e => requiredEducation.includes(e));
    const missing = requiredEducation.filter(req => !selectedEducation.includes(req));
    const unnecessary = selectedEducation.filter(sel => !requiredEducation.includes(sel));

    const score = requiredEducation.length > 0
        ? Math.round((correct.length / requiredEducation.length) * 100)
        : 100;

    const getLabel = (id) => EDUCATION_OPTIONS.find(e => e.id === id)?.label || id;

    return {
        score: Math.max(0, score - (unnecessary.length * 5)),
        correct: correct.map(getLabel),
        missing: missing.map(getLabel),
        unnecessary: unnecessary.map(getLabel),
        feedback: score >= 80 && unnecessary.length === 0
            ? "✅ Edukasi promotif & preventif sangat tepat!"
            : score >= 50
                ? "⚠️ Edukasi cukup baik, namun masih ada yang terlewat."
                : "❌ Edukasi krusial belum disampaikan. Evaluasi lagi faktor risiko pasien."
    };
}

export function validateExams(patientCase, performedExams, orderedLabs) {
    const relevantLabEntries = normalizeLabEntries(patientCase.relevantLabs || []);
    const physicalFindings = getCanonicalPhysicalExamKeys(Object.keys(patientCase.physicalExamFindings || {}));

    const importantExams = physicalFindings.filter(e => e !== 'general' && e !== 'vitals');
    const examsPerformedCanonical = getCanonicalPhysicalExamKeys(performedExams || []);
    const examsPerformedSet = new Set(examsPerformedCanonical);
    const examsCorrect = importantExams.filter(e => examsPerformedSet.has(e));

    // A5: Track irrelevant exams (not in physicalExamFindings, excluding general/vitals)
    const allRelevantExams = new Set(physicalFindings);
    allRelevantExams.add('general');
    allRelevantExams.add('vitals');
    const unnecessaryExams = examsPerformedCanonical.filter(e => !allRelevantExams.has(e));
    const OVEREXAM_GRACE = 2; // Allow 2 "exploratory" exams without penalty
    const overExamPenalty = Math.max(0, unnecessaryExams.length - OVEREXAM_GRACE) * 3;

    const labsOrdered = Array.isArray(orderedLabs) ? orderedLabs : [];
    const orderedEntries = normalizeLabEntries(labsOrdered);
    const orderedCanonicalSet = new Set(orderedEntries.map(entry => entry.canonical));
    const relevantCanonicalSet = new Set(relevantLabEntries.map(entry => entry.canonical));

    const labsCorrect = relevantLabEntries
        .filter(entry => orderedCanonicalSet.has(entry.canonical))
        .map(entry => entry.label);

    const missingLabs = relevantLabEntries
        .filter(entry => !orderedCanonicalSet.has(entry.canonical))
        .map(entry => entry.label);

    const unnecessaryLabs = [];
    const unnecessarySeen = new Set();
    labsOrdered.forEach((lab) => {
        const canonical = normalizeLabKey(lab);
        if (!canonical || relevantCanonicalSet.has(canonical) || unnecessarySeen.has(canonical)) return;
        unnecessarySeen.add(canonical);
        unnecessaryLabs.push(getLabDisplayName(lab));
    });

    const examScore = importantExams.length > 0
        ? Math.round((examsCorrect.length / importantExams.length) * 100)
        : (examsPerformedCanonical.some(e => e === 'general' || e === 'vitals') ? 100 : 50);

    const labScore = relevantLabEntries.length > 0
        ? Math.round((labsCorrect.length / relevantLabEntries.length) * 100)
        : 100;

    const hasLabs = relevantLabEntries.length > 0;
    const combinedScore = hasLabs
        ? Math.round(examScore * 0.6 + labScore * 0.4)
        : examScore;

    const score = Math.max(0, combinedScore - (unnecessaryLabs.length * 5) - overExamPenalty);

    const overExamWarning = unnecessaryExams.length > OVEREXAM_GRACE
        ? `⚠️ Over-investigation: ${unnecessaryExams.length} pemeriksaan tidak relevan. Fokuskan pemeriksaan fisik sesuai keluhan utama.`
        : null;

    const baseFeedback = score >= 70
        ? "✅ Pemeriksaan fisik dan lab cukup lengkap."
        : score >= 40
            ? "⚠️ Ada pemeriksaan penting yang belum dilakukan."
            : "❌ Pemeriksaan fisik dan lab sangat kurang.";

    return {
        score,
        examScore,
        labScore,
        examsCorrect,
        missingExams: importantExams.filter(e => !examsPerformedSet.has(e)),
        unnecessaryExams,
        overExamPenalty,
        overExamWarning,
        labsCorrect,
        missingLabs,
        unnecessaryLabs,
        relevantLabs: relevantLabEntries.map(entry => entry.label),
        feedback: overExamWarning ? `${baseFeedback}\n\n${overExamWarning}` : baseFeedback
    };
}

export function validateAnamnesis(patientCase, askedQuestions) {
    const essential = patientCase.essentialQuestions || [];
    if (!patientCase.anamnesisQuestions) {
        return {
            score: 100,
            essentialMissed: [],
            feedback: "Fitur anamnesis belum tersedia untuk kasus ini. (Auto-pass)"
        };
    }

    const askedIds = askedQuestions.map(q => q.id);
    const isEssentialAsked = (eId) => {
        if ((eId === 'q_main_complaint' || eId === 'q_main') && askedIds.includes('initial_complaint')) return true;
        return askedIds.includes(eId);
    };
    const { anamnesisTotal } = calculateCoverageScore(askedQuestions, [], [], essential);
    const score = anamnesisTotal || 0;
    const missed = essential.filter(e => !isEssentialAsked(e));

    let feedback = "";
    if (score >= 80) {
        feedback = "✅ Anamnesis lengkap dan sistematis!";
    } else if (score >= 50) {
        feedback = "⚠️ Anamnesis cukup, tapi ada kategori atau pertanyaan penting terlewat.";
    } else {
        feedback = "❌ Anamnesis kurang lengkap. Gali lebih dalam keluhan utama dan riwayat penyakit.";
    }

    return {
        score,
        essentialMissed: missed,
        totalAsked: askedIds.length,
        feedback
    };
}
