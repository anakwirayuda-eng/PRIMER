import { PHYSICAL_EXAM_OPTIONS } from '../data/ProceduresDB.js';

export const PHYSICAL_EXAM_KEY_ALIASES = Object.freeze({
    general: 'general',
    anthropometry: 'general',
    vitals: 'vitals',
    heent: 'heent',
    head: 'heent',
    eyes: 'heent',
    ears: 'heent',
    nose: 'heent',
    throat: 'heent',
    oral: 'heent',
    dental: 'heent',
    neck: 'neck',
    lymph: 'neck',
    lymph_nodes: 'neck',
    thorax: 'thorax',
    chest: 'thorax',
    cardiovascular: 'thorax',
    cardio: 'thorax',
    respiratory: 'thorax',
    heart: 'thorax',
    abdomen: 'abdomen',
    extremities: 'extremities',
    extremity: 'extremities',
    musculoskeletal: 'extremities',
    joints: 'extremities',
    spine: 'extremities',
    skin: 'skin',
    neuro: 'neuro',
    mental_status: 'neuro',
    psych: 'neuro',
    rectal: 'rectal',
    genitalia: 'genitalia',
    genital: 'genitalia',
    obstetric: 'genitalia',
    breast: 'breast',
});

const PHYSICAL_EXAM_DISPLAY_NAMES = Object.freeze({
    ...Object.fromEntries(Object.entries(PHYSICAL_EXAM_OPTIONS).map(([key, option]) => [key, option.name])),
    anthropometry: 'Antropometri',
    head: 'Kepala',
    eyes: 'Mata',
    ears: 'Telinga',
    nose: 'Hidung',
    throat: 'Tenggorokan',
    oral: 'Rongga Mulut',
    dental: 'Gigi',
    lymph: 'Kelenjar Getah Bening',
    lymph_nodes: 'Kelenjar Getah Bening',
    chest: 'Dada/Paru & Jantung',
    cardiovascular: 'Kardiovaskular',
    cardio: 'Kardiovaskular',
    respiratory: 'Respirasi',
    heart: 'Jantung',
    extremity: 'Ekstremitas',
    musculoskeletal: 'Muskuloskeletal',
    joints: 'Sendi',
    spine: 'Tulang Belakang',
    mental_status: 'Status Mental',
    psych: 'Psikiatri/Mental',
    genital: 'Genitalia',
    obstetric: 'Obstetri',
});

export function normalizePhysicalExamKey(examKey) {
    if (typeof examKey !== 'string') return '';
    const trimmedKey = examKey.trim().toLowerCase();
    if (!trimmedKey) return '';
    return PHYSICAL_EXAM_KEY_ALIASES[trimmedKey] || trimmedKey;
}

export function getCanonicalPhysicalExamKeys(examKeys = []) {
    const seen = new Set();
    const canonicalKeys = [];

    (examKeys || []).forEach((examKey) => {
        const normalizedKey = normalizePhysicalExamKey(examKey);
        if (!normalizedKey || seen.has(normalizedKey)) return;
        seen.add(normalizedKey);
        canonicalKeys.push(normalizedKey);
    });

    return canonicalKeys;
}

export function getPhysicalExamDisplayName(examKey, options = {}) {
    const preserveAlias = options?.preserveAlias === true;
    const lookupKey = preserveAlias
        ? (typeof examKey === 'string' ? examKey.trim().toLowerCase() : '')
        : normalizePhysicalExamKey(examKey);

    if (!lookupKey) return '';
    return PHYSICAL_EXAM_DISPLAY_NAMES[lookupKey] || lookupKey.replace(/_/g, ' ');
}

function formatPhysicalExamFinding(rawKey, canonicalKey, value) {
    if (value == null) return '';
    const text = typeof value === 'string' ? value.trim() : String(value).trim();
    if (!text) return '';

    const rawKeyString = typeof rawKey === 'string' ? rawKey.trim().toLowerCase() : '';
    if (normalizePhysicalExamKey(rawKey) === canonicalKey && rawKeyString === canonicalKey) {
        return text;
    }

    const aliasLabel = getPhysicalExamDisplayName(rawKey, { preserveAlias: true });
    return aliasLabel ? `${aliasLabel}: ${text}` : text;
}

export function normalizePhysicalExamFindings(findings = {}) {
    if (!findings || typeof findings !== 'object') return {};

    const groupedFindings = {};

    Object.entries(findings).forEach(([rawKey, value]) => {
        const canonicalKey = normalizePhysicalExamKey(rawKey);
        if (!canonicalKey) return;

        const formattedFinding = formatPhysicalExamFinding(rawKey, canonicalKey, value);
        if (!formattedFinding) return;

        if (!groupedFindings[canonicalKey]) {
            groupedFindings[canonicalKey] = [];
        }

        if (!groupedFindings[canonicalKey].includes(formattedFinding)) {
            groupedFindings[canonicalKey].push(formattedFinding);
        }
    });

    return Object.fromEntries(
        Object.entries(groupedFindings).map(([canonicalKey, parts]) => [canonicalKey, parts.join('\n')])
    );
}

export function getPhysicalExamFinding(caseDataOrFindings, examKey) {
    const findings = caseDataOrFindings?.physicalExamFindings || caseDataOrFindings;
    const normalizedKey = normalizePhysicalExamKey(examKey);

    if (!normalizedKey) return null;

    const normalizedFindings = normalizePhysicalExamFindings(findings);
    return normalizedFindings[normalizedKey] || null;
}
