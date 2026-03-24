/**
 * @reflection
 * [IDENTITY]: PatientRuntime (Anti-Corruption Layer)
 * [PURPOSE]: Absorbs ALL legacy/aliased patient data shapes and outputs ONE canonical shape.
 *            Kills fan-out bugs permanently by ensuring every consumer reads identical fields.
 * [STATE]: Production
 * [ANCHOR]: normalizePatient
 * [DEPENDS_ON]: None (pure function, zero side effects)
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-24
 */

// ═══════════════════════════════════════════════════════════════
// CANONICAL PATIENT SHAPE (JSDoc Contract)
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} CanonicalPatient
 * @property {string} id
 * @property {string} name
 * @property {number} age
 * @property {string} gender
 * @property {boolean} _isCanonical - Idempotency lock (O(1) skip on re-normalize)
 * @property {number} _aclVersion - Canonical schema version
 * @property {Object} social
 * @property {boolean} social.hasBPJS - SINGLE SOURCE OF TRUTH for JKN status
 * @property {Object} medicalData
 * @property {string} medicalData.trueDiagnosisCode - SINGLE SOURCE OF TRUTH ICD-10
 * @property {string} medicalData.diagnosisName - Human-readable diagnosis name
 * @property {string[]} medicalData.differentialDiagnosis - Array of DDx strings
 * @property {Object} medicalData.physicalExamFindings - Normalized PE findings
 * @property {string[]} medicalData.allergies - Patient allergies
 * @property {Object} hidden - Engine-only data (ground truth, case metadata)
 */

// ═══════════════════════════════════════════════════════════════
// CORE NORMALIZER
// ═══════════════════════════════════════════════════════════════

/**
 * Normalize a raw patient object into canonical shape.
 * IDEMPOTENT: normalizePatient(normalizePatient(x)) === normalizePatient(x)
 *
 * Absorbs aliases from:
 * - PatientGenerator (modern shape)
 * - Saved games (legacy shape)
 * - History entries (mixed shape)
 * - Case library references
 *
 * @param {Object} raw - Raw patient object from any source
 * @returns {CanonicalPatient|null} Canonical patient or null if invalid
 */
export const PATIENT_ACL_VERSION = 2;

export function normalizePatient(raw) {
    if (!raw || typeof raw !== 'object') return null;

    // Idempotency guard: already canonical → instant return O(1)
    if (raw._isCanonical && raw._aclVersion === PATIENT_ACL_VERSION) return raw;

    // --- ABSORPTION SIEVE: Resolve all known aliases ---

    const rawMed = raw.medicalData || {};
    const rawSoc = raw.social || {};
    const rawHidden = raw.hidden || {};

    // BPJS: 4 known locations
    const hasBPJS = Boolean(
        rawSoc.hasBPJS ?? raw.isBPJS ?? rawMed.hasBPJS ?? rawHidden.bpjs ?? false
    );

    // Diagnosis: 4 ICD-10 aliases (diseaseId EXCLUDED — it's a slug, not ICD-10)
    const trueDiagnosisCode =
        rawMed.trueDiagnosisCode || rawMed.diagnosisCode || rawMed.icd10 ||
        rawHidden.icd10 || '';

    // Diagnosis name
    const diagnosisName =
        rawMed.diagnosisName || rawMed.trueDiagnosisName || rawHidden.diagnosisName || '';

    // Differentials: force to string array (includes hidden.differentialDiagnosis for emergency lane)
    const rawDiffs = rawMed.differentialDiagnosis || rawHidden.differentialDiagnosis ||
        rawMed.differentials || rawHidden.differentials || [];
    const differentialDiagnosis = Array.isArray(rawDiffs)
        ? rawDiffs.map(d => typeof d === 'string' ? d : (d?.code || d?.id || d?.name || '')).filter(Boolean)
        : [];

    // Physical exam: 3 known aliases
    const physicalExamFindings = rawMed.physicalExamFindings || rawMed.physicalExam || raw.physicalExam || {};

    // Allergies: 2 known locations
    const allergies = rawHidden?.allergies || rawMed?.allergies || [];

    // --- FORGE: Hard-boundary canonical overlay ---
    // Spread ALL raw fields first to preserve runtime fields
    // (joinedAt, status, originalId, isProlanis, prolanisData, complicationRisk,
    //  triageLevel, esiLevel, labsRevealed, caseData, keyLearning, etc.)
    // Then overlay canonical fields and strip legacy aliases.
    return {
        ...raw,

        _isCanonical: true,
        _aclVersion: PATIENT_ACL_VERSION,

        // Strip legacy root aliases
        isBPJS: undefined,
        diagnosisCode: undefined,
        icd10: undefined,
        physicalExam: undefined,
        differentials: undefined,

        // Normalize name aliases
        name: raw.patientName || raw.name || 'Pasien',
        patientName: raw.patientName || raw.name || 'Pasien',

        social: {
            ...rawSoc,
            hasBPJS,
        },

        medicalData: {
            ...rawMed,
            trueDiagnosisCode,
            diagnosisName,
            differentialDiagnosis,
            physicalExamFindings,
            allergies,
            hasBPJS,
            diagnosisCode: undefined,
            icd10: undefined,
            physicalExam: undefined,
            differentials: undefined,
            bpjs: undefined,
        },

        hidden: {
            ...rawHidden,
            trueDiagnosisCode,
            differentialDiagnosis,
            allergies,
            bpjs: undefined,
            icd10: undefined,
            differentials: undefined,
        },
    };
}

// ═══════════════════════════════════════════════════════════════
// BATCH NORMALIZER
// ═══════════════════════════════════════════════════════════════

/**
 * Normalize an array of raw patients.
 * @param {Object[]} rawList
 * @returns {CanonicalPatient[]}
 */
export function normalizePatientList(rawList = []) {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(normalizePatient).filter(Boolean);
}

// ═══════════════════════════════════════════════════════════════
// DEV-ONLY LEGACY GUARD (Screaming Proxy — Hack #3)
// ═══════════════════════════════════════════════════════════════

const FORBIDDEN_ROOT_KEYS = ['isBPJS', 'diagnosisCode', 'icd10', 'physicalExam', 'differentials'];

/**
 * Wrap canonical patient with a Proxy that screams when legacy fields are accessed.
 * ZERO cost in production (returns raw object).
 *
 * @param {CanonicalPatient} canonical
 * @returns {CanonicalPatient}
 */
export function withLegacyGuard(canonical) {
    if (!canonical || typeof canonical !== 'object') return canonical;
    // Production: no overhead
    try { if (import.meta.env?.PROD) return canonical; } catch { return canonical; }

    return new Proxy(canonical, {
        get(target, prop) {
            if (typeof prop === 'string' && FORBIDDEN_ROOT_KEYS.includes(prop)) {
                console.error(
                    `🚨 [ACL] UI accessing deprecated field "${prop}"! Use canonical shape instead.`
                );
                console.trace();
            }
            return Reflect.get(target, prop);
        }
    });
}
