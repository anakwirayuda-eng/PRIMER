import { LAB_CATALOG } from '../game/LabEngine.js';

const LAB_KEY_ALIASES = new Map([
    ['lab hematology', 'lab_hematology'],
    ['hematology', 'lab_hematology'],
    ['hematologi', 'lab_hematology'],
    ['lab cbc', 'lab_hematology'],
    ['lab_cbc', 'lab_hematology'],
    ['darah lengkap', 'lab_hematology'],
    ['cek darah lengkap', 'lab_hematology'],
    ['complete blood count', 'lab_hematology'],
    ['cbc', 'lab_hematology'],
    ['lab dl', 'lab_hematology'],
    ['lab ns1', 'lab_ns1'],
    ['ns1', 'lab_ns1'],
    ['ns1 ag', 'lab_ns1'],
    ['ns1 antigen', 'lab_ns1'],
    ['urinalisa', 'urinalisis'],
    ['urinalisis', 'urinalisis'],
    ['gula darah', 'gds'],
    ['gula darah sewaktu', 'gds'],
    ['gds', 'gds'],
    ['gula darah puasa', 'gdp'],
    ['gdp', 'gdp'],
    ['widal test', 'widal'],
    ['tes widal', 'widal'],
    ['widal', 'widal'],
    ['tubex tf', 'tubex_tf'],
    ['tubex', 'tubex_tf'],
    ['profil lipid', 'profil_lipid'],
    ['lipid profile', 'profil_lipid'],
    ['lab lipid profile', 'profil_lipid'],
    ['lab_lipid_profile', 'profil_lipid'],
    ['kolesterol', 'kolesterol_total'],
    ['cholesterol', 'kolesterol_total'],
    ['lab glucose', 'gdp'],
    ['lab glukosa', 'gdp'],
    ['lab_glucose', 'gdp'],
    ['fungsi hati', 'fungsi_hati'],
    ['tes fungsi hati', 'fungsi_hati'],
    ['liver function', 'fungsi_hati'],
    ['liver function test', 'fungsi_hati'],
    ['lab liver function', 'fungsi_hati'],
    ['lab_liver_function', 'fungsi_hati'],
    ['gram stain', 'gram_stain'],
    ['gram stain lesi', 'gram_stain'],
    ['gram stain sekret', 'gram_stain_sekret'],
    ['gram stain sekret vagina', 'gram_stain_sekret_vagina'],
    ['vdrl', 'vdrl'],
    ['vdrl/rpr', 'vdrl'],
    ['rpr', 'vdrl'],
    ['ekg', 'ekg'],
    ['golongan darah', 'golongan_darah'],
    ['goldar', 'golongan_darah'],
    ['protein urin', 'protein_urin'],
    ['protein urine', 'protein_urin'],
]);

const LAB_DISPLAY_NAMES = {
    lab_hematology: 'Darah Lengkap',
    lab_ns1: 'NS1 Ag',
    urinalisis: 'Urinalisis',
    gds: 'GDS',
    gdp: 'Gula Darah Puasa',
    widal: 'Widal Test',
    tubex_tf: 'Tubex TF',
    gram_stain: 'Gram Stain',
    gram_stain_sekret: 'Gram Stain Sekret',
    gram_stain_sekret_vagina: 'Gram Stain Sekret Vagina',
    vdrl: 'VDRL/RPR',
    ekg: 'EKG',
    profil_lipid: 'Profil Lipid',
    fungsi_hati: 'Fungsi Hati',
    bta: 'BTA (Sputum)',
    ferritin: 'Ferritin',
    bnp: 'BNP',
    kultur_urin: 'Kultur Urin',
    apusan_darah_tepi: 'Apusan Darah Tepi',
    igm_anti_hav: 'IgM Anti-HAV',
    rontgen_thorax: 'Rontgen Thorax',
    rapid_hiv: 'Rapid Test HIV',
    rapid_hbsag: 'Rapid Test HBsAg',
    rapid_sifilis: 'Rapid Test Sifilis',
    asam_urat: 'Asam Urat',
    kolesterol_total: 'Kolesterol Total',
    hba1c: 'HbA1c',
    golongan_darah: 'Golongan Darah',
    protein_urin: 'Protein Urin',
};

function normalizeLabToken(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/\s*\(.*?\)/g, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function normalizeLabKey(labKey) {
    const normalized = normalizeLabToken(labKey);
    if (!normalized) return '';
    return LAB_KEY_ALIASES.get(normalized) || normalized.replace(/ /g, '_');
}

export function getLabDisplayName(labKey) {
    const canonical = normalizeLabKey(labKey);
    if (!canonical) return '';

    if (LAB_DISPLAY_NAMES[canonical]) {
        return LAB_DISPLAY_NAMES[canonical];
    }

    const raw = String(labKey || '').trim();
    if (raw) return raw.replace(/_/g, ' ');

    return canonical.replace(/_/g, ' ');
}

export function getCanonicalLabKeys(labs = []) {
    const canonical = [];
    const seen = new Set();

    (Array.isArray(labs) ? labs : []).forEach((lab) => {
        const key = normalizeLabKey(lab);
        if (!key || seen.has(key)) return;
        seen.add(key);
        canonical.push(key);
    });

    return canonical;
}

export function normalizeLabEntries(labs = []) {
    const entries = [];
    const seen = new Set();

    (Array.isArray(labs) ? labs : []).forEach((lab) => {
        const canonical = normalizeLabKey(lab);
        if (!canonical || seen.has(canonical)) return;
        seen.add(canonical);
        entries.push({
            raw: lab,
            canonical,
            label: getLabDisplayName(lab),
        });
    });

    return entries;
}

const NORMALIZED_LAB_CATALOG_INDEX = (() => {
    const index = new Map();

    Object.entries(LAB_CATALOG || {}).forEach(([catalogKey, definition]) => {
        [catalogKey, definition?.name].forEach((candidate) => {
            const normalized = normalizeLabKey(candidate);
            if (!normalized || index.has(normalized)) return;
            index.set(normalized, { key: catalogKey, definition, canonical: normalized });
        });
    });

    return index;
})();

export function findLabCatalogEntry(labKey) {
    const normalized = normalizeLabKey(labKey);
    if (!normalized) return null;
    return NORMALIZED_LAB_CATALOG_INDEX.get(normalized) || null;
}

export function findCaseLabDefinition(caseLabs = {}, labKey) {
    const normalized = normalizeLabKey(labKey);
    if (!normalized || !caseLabs || typeof caseLabs !== 'object' || Array.isArray(caseLabs)) return null;

    return Object.entries(caseLabs).reduce((match, [caseLabKey, definition]) => {
        if (match) return match;
        if (normalizeLabKey(caseLabKey) !== normalized) return null;
        return {
            key: caseLabKey,
            definition,
            canonical: normalized,
        };
    }, null);
}

export function isSupportedLabReference(caseData = {}, labKey) {
    if (!labKey) return false;
    return Boolean(findCaseLabDefinition(caseData?.labs, labKey) || findLabCatalogEntry(labKey));
}

export function getSupportedRelevantLabEntries(caseData = {}) {
    return normalizeLabEntries(caseData?.relevantLabs || []).filter((entry) => (
        isSupportedLabReference(caseData, entry.raw)
    ));
}

export function getUnsupportedRelevantLabEntries(caseData = {}) {
    return normalizeLabEntries(caseData?.relevantLabs || []).filter((entry) => (
        !isSupportedLabReference(caseData, entry.raw)
    ));
}

function normalizeCaseLabDefinition(definition, fallbackLabel) {
    if (definition && typeof definition === 'object' && !Array.isArray(definition)) {
        return {
            ...definition,
            result: definition.result || '',
            cost: Number(definition.cost) || 50000,
            flag: definition.flag || null,
            label: definition.label || fallbackLabel,
        };
    }

    return {
        result: String(definition || ''),
        cost: 50000,
        flag: null,
        label: fallbackLabel,
    };
}

export function resolveLabOrderDefinition(caseData = {}, labKey) {
    const caseMatch = findCaseLabDefinition(caseData?.labs, labKey);
    if (caseMatch) {
        const definition = normalizeCaseLabDefinition(caseMatch.definition, caseMatch.key);
        return {
            source: 'case',
            canonical: caseMatch.canonical,
            id: caseMatch.key,
            name: caseMatch.key,
            label: definition.label || caseMatch.key,
            cost: definition.cost,
            definition,
        };
    }

    const catalogMatch = findLabCatalogEntry(labKey);
    if (catalogMatch) {
        return {
            source: 'catalog',
            canonical: catalogMatch.canonical,
            id: catalogMatch.key,
            name: catalogMatch.definition?.name || getLabDisplayName(labKey),
            label: catalogMatch.definition?.name || getLabDisplayName(labKey),
            cost: Number(catalogMatch.definition?.cost) || 50000,
            definition: catalogMatch.definition || null,
        };
    }

    return null;
}

export function getSupportedRelevantLabOrderables(caseData = {}) {
    const seen = new Set();

    return getSupportedRelevantLabEntries(caseData)
        .map((entry) => resolveLabOrderDefinition(caseData, entry.raw))
        .filter(Boolean)
        .filter((entry) => {
            const dedupeKey = `${entry.canonical}:${entry.id}`;
            if (seen.has(dedupeKey)) return false;
            seen.add(dedupeKey);
            return true;
        });
}

function summarizeParameterValue(parameter = {}) {
    const value = parameter?.value;
    const unit = parameter?.unit ? ` ${parameter.unit}` : '';
    return `${parameter?.name || 'Parameter'}: ${value}${unit}`;
}

export function summarizeLabResult(revealedData) {
    if (!revealedData) return '';

    if (typeof revealedData === 'string') {
        return revealedData;
    }

    if (typeof revealedData !== 'object') {
        return '';
    }

    if (typeof revealedData.result === 'string' && revealedData.result.trim()) {
        return revealedData.result.trim();
    }

    if (revealedData.parameters && typeof revealedData.parameters === 'object') {
        const parts = Object.values(revealedData.parameters)
            .filter(Boolean)
            .map((parameter) => summarizeParameterValue(parameter));
        if (parts.length > 0) {
            return parts.join(', ');
        }
    }

    return '';
}

export function inferLabFlag(revealedData) {
    if (typeof revealedData !== 'object' || !revealedData) {
        return 'normal';
    }

    if (typeof revealedData.flag === 'string' && revealedData.flag.trim()) {
        return revealedData.flag;
    }

    if (revealedData.parameters && typeof revealedData.parameters === 'object') {
        const statuses = Object.values(revealedData.parameters)
            .map((parameter) => parameter?.status)
            .filter(Boolean);
        if (statuses.some((status) => status !== 'normal')) {
            return 'abnormal';
        }
        if (statuses.length > 0) {
            return 'normal';
        }
    }

    const summary = summarizeLabResult(revealedData).toLowerCase();
    if (!summary) return 'normal';
    if (/\b(reaktif|positif|tinggi|rendah|abnormal|suspect|\+{1,3})\b/.test(summary)) {
        return 'abnormal';
    }
    if (/\b(normal|negatif|non-reaktif|dalam batas normal)\b/.test(summary)) {
        return 'normal';
    }
    return 'normal';
}
