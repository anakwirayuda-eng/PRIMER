import { ICD10_DB } from '../../data/ICD10.js';

const RAW_SYNONYM_MAP = Object.freeze({
    'generalized anxiety disorder': 'gangguan cemas menyeluruh',
    'major depressive disorder': 'gangguan depresi mayor',
    'panic disorder': 'gangguan panik',
    'hypertension': 'hipertensi',
    'diabetes mellitus': 'diabetes melitus',
    'urinary tract infection': 'infeksi saluran kemih',
    'acute gastroenteritis': 'gastroenteritis akut',
    'pneumonia': 'pneumonia',
    'tuberculosis': 'tuberkulosis',
    'dengue fever': 'demam berdarah dengue',
    'typhoid fever': 'demam tifoid',
});

export function normalizeDiagnosisCode(code) {
    return String(code || '').trim().toUpperCase();
}

export function toCanonicalDiagnosisName(name) {
    let normalized = String(name || '').toLowerCase().trim();
    normalized = normalized.replace(/\s*\([^)]*\)\s*/g, ' ');
    normalized = normalized.replace(/[^a-z0-9\s]/g, ' ');
    normalized = normalized.replace(/\s+/g, ' ').trim();
    return normalized;
}

const SYNONYM_MAP = Object.freeze(
    Object.entries(RAW_SYNONYM_MAP).reduce((acc, [source, target]) => {
        const canonicalSource = toCanonicalDiagnosisName(source);
        const canonicalTarget = toCanonicalDiagnosisName(target);
        acc[canonicalSource] = canonicalTarget;
        acc[canonicalTarget] = canonicalTarget;
        return acc;
    }, {})
);

export function resolveCanonicalDiagnosisName(name) {
    const canonicalName = toCanonicalDiagnosisName(name);
    return SYNONYM_MAP[canonicalName] || canonicalName;
}

function resolveDifferentialEntry(rawEntry, index, confidenceValue) {
    const rawValue = String(rawEntry || '').trim();
    const matchedIcd = ICD10_DB.find(icd => icd.code === rawValue);

    let mappedName = matchedIcd?.name || rawValue;
    mappedName = mappedName.replace(/\s\([^)]+\)$/, '').trim();

    return {
        id: `diff_${index}`,
        raw: rawValue,
        code: matchedIcd?.code || rawValue,
        name: mappedName,
        canonical: resolveCanonicalDiagnosisName(mappedName),
        prob: Math.max(10, (confidenceValue || 45) - (index + 1) * 15),
        color: 'indigo'
    };
}

export function buildDiagnosticProbabilities(patient, confidenceValue) {
    const primaryCode = patient?.medicalData?.trueDiagnosisCode
        || patient?.medicalData?.diagnosisCode
        || patient?.hidden?.icd10
        || 'unknown';
    const primaryName = patient?.medicalData?.diagnosisName || primaryCode;
    const differentialsList = patient?.hidden?.differentialDiagnosis || patient?.hidden?.differentials || [];

    const primaryCanonical = resolveCanonicalDiagnosisName(primaryName);
    const normalizedPrimaryCode = normalizeDiagnosisCode(primaryCode);
    const seenCanonicals = new Set([primaryCanonical]);

    const mappedDifferentials = differentialsList
        .map((entry, index) => resolveDifferentialEntry(entry, index, confidenceValue))
        .filter((entry) => {
            const rawCode = normalizeDiagnosisCode(entry.raw);
            const entryCode = normalizeDiagnosisCode(entry.code);

            if (!entry.canonical) return false;
            if (entry.canonical === primaryCanonical) return false;
            if (normalizedPrimaryCode && (rawCode === normalizedPrimaryCode || entryCode === normalizedPrimaryCode)) {
                return false;
            }
            if (seenCanonicals.has(entry.canonical)) return false;

            seenCanonicals.add(entry.canonical);
            return true;
        });

    return [
        {
            id: `primary_${primaryCode}`,
            name: primaryName,
            prob: confidenceValue || 45,
            color: 'emerald'
        },
        ...mappedDifferentials
    ].sort((a, b) => b.prob - a.prob);
}
