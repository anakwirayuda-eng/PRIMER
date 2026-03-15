const LAB_KEY_ALIASES = new Map([
    ['lab hematology', 'lab_hematology'],
    ['hematology', 'lab_hematology'],
    ['hematologi', 'lab_hematology'],
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
    ['gula darah sewaktu', 'gds'],
    ['gds', 'gds'],
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
