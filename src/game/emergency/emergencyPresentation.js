import { EMERGENCY_ACTIONS, ESI_LEVELS, getEmergencyCase, PATIENT_STATUS, TRIAGE_LEVELS } from '../EmergencyCases.js';

function isObjectLike(value) {
    return value !== null && typeof value === 'object';
}

function hasMeaningfulValue(value) {
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    if (isObjectLike(value)) {
        return Object.keys(value).length > 0;
    }
    return value !== undefined && value !== null && value !== '';
}

function normalizeComparableText(value) {
    return String(value || '')
        .normalize('NFKC')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function findMatchingIndex(entries = [], target) {
    const normalizedTarget = normalizeComparableText(target);
    if (!normalizedTarget) return -1;
    return entries.findIndex((entry) => normalizeComparableText(entry) === normalizedTarget);
}

function readLocalized(t, i18n, key, fallback) {
    const translated = t?.(key, {
        returnObjects: Array.isArray(fallback) || isObjectLike(fallback),
        defaultValue: fallback
    });

    if (translated === undefined || translated === null || translated === key) {
        return fallback;
    }

    return translated;
}

function resolveComplaint(baseAnamnesis, localizedAnamnesis, complaint) {
    if (!complaint) return localizedAnamnesis?.[0] || baseAnamnesis?.[0] || '';

    const localizedIndex = Array.isArray(localizedAnamnesis)
        ? findMatchingIndex(localizedAnamnesis, complaint)
        : -1;
    if (localizedIndex >= 0) return complaint;

    const baseIndex = Array.isArray(baseAnamnesis)
        ? findMatchingIndex(baseAnamnesis, complaint)
        : -1;
    if (baseIndex >= 0 && localizedAnamnesis?.[baseIndex]) {
        return localizedAnamnesis[baseIndex];
    }

    return complaint;
}

export function getLocalizedTriageInfo(level, t, i18n) {
    const fallback = TRIAGE_LEVELS[level] || TRIAGE_LEVELS[3];
    return {
        ...fallback,
        name: readLocalized(t, i18n, `emergency.triageLevels.${level}.name`, fallback.name),
        desc: readLocalized(t, i18n, `emergency.triageLevels.${level}.desc`, fallback.desc)
    };
}

export function getLocalizedEsiInfo(level, t, i18n) {
    const fallback = ESI_LEVELS[level] || ESI_LEVELS[3];
    return {
        ...fallback,
        name: readLocalized(t, i18n, `emergency.esiLevels.${level}.name`, fallback.name),
        desc: readLocalized(t, i18n, `emergency.esiLevels.${level}.desc`, fallback.desc)
    };
}

export function getLocalizedEmergencyActionName(actionId, t, i18n) {
    const fallback = EMERGENCY_ACTIONS[actionId]?.name || actionId.replace(/_/g, ' ');
    return readLocalized(t, i18n, `emergency.actions.${actionId}`, fallback);
}

export function getLocalizedPatientStatus(status, t, i18n) {
    if (!status) return status;
    const fallback = PATIENT_STATUS[status.id] || status;
    return {
        ...fallback,
        label: readLocalized(t, i18n, `emergency.patientStatus.${status.id}.label`, fallback.label),
        description: readLocalized(t, i18n, `emergency.patientStatus.${status.id}.description`, fallback.description)
    };
}

export function getEmergencyCasePresentation(patient, t, i18n) {
    const caseId = patient?.hidden?.diseaseId;
    const caseData = caseId ? getEmergencyCase(caseId) : null;

    const fallbackSymptoms = hasMeaningfulValue(patient?.medicalData?.symptoms)
        ? patient.medicalData.symptoms
        : (caseData?.symptoms || []);
    const fallbackAnamnesis = hasMeaningfulValue(patient?.medicalData?.anamnesis)
        ? patient.medicalData.anamnesis
        : (caseData?.anamnesis || []);
    const localizedAnamnesis = readLocalized(t, i18n, `emergency.caseData.${caseId}.anamnesis`, fallbackAnamnesis);
    const fallbackPhysicalExamFindings = hasMeaningfulValue(patient?.medicalData?.physicalExamFindings)
        ? patient.medicalData.physicalExamFindings
        : (caseData?.physicalExamFindings || {});
    const fallbackRelevantLabs = hasMeaningfulValue(patient?.medicalData?.relevantLabs)
        ? patient.medicalData.relevantLabs
        : (caseData?.relevantLabs || []);
    const fallbackSisruteData = hasMeaningfulValue(patient?.sisruteData)
        ? patient.sisruteData
        : (caseData?.sisruteData || null);

    return {
        caseId,
        diagnosisName: readLocalized(
            t,
            i18n,
            `emergency.caseData.${caseId}.diagnosis`,
            patient?.medicalData?.diagnosisName || caseData?.diagnosis || patient?.hidden?.diagnosis || ''
        ),
        complaint: resolveComplaint(fallbackAnamnesis, localizedAnamnesis, patient?.complaint),
        symptoms: readLocalized(t, i18n, `emergency.caseData.${caseId}.symptoms`, fallbackSymptoms),
        anamnesisQuestions: readLocalized(
            t,
            i18n,
            `emergency.caseData.${caseId}.anamnesisQuestions`,
            hasMeaningfulValue(patient?.medicalData?.anamnesisQuestions)
                ? patient.medicalData.anamnesisQuestions
                : (caseData?.anamnesisQuestions || {})
        ),
        anamnesis: localizedAnamnesis,
        differentialDiagnosis: readLocalized(
            t,
            i18n,
            `emergency.caseData.${caseId}.differentialDiagnosis`,
            patient?.hidden?.differentialDiagnosis || caseData?.differentialDiagnosis || []
        ),
        clue: readLocalized(
            t,
            i18n,
            `emergency.caseData.${caseId}.clue`,
            patient?.hidden?.clue || caseData?.clue || ''
        ),
        physicalExamFindings: readLocalized(
            t,
            i18n,
            `emergency.caseData.${caseId}.physicalExamFindings`,
            fallbackPhysicalExamFindings
        ),
        relevantLabs: readLocalized(
            t,
            i18n,
            `emergency.caseData.${caseId}.relevantLabs`,
            fallbackRelevantLabs
        ),
        sisruteData: fallbackSisruteData ? readLocalized(
            t,
            i18n,
            `emergency.caseData.${caseId}.sisruteData`,
            fallbackSisruteData
        ) : null
    };
}
