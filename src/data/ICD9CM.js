/**
 * @reflection
 * [IDENTITY]: ICD9CM
 * [PURPOSE]: ICD-9-CM Procedure Library This file uses dynamic imports to load the heavy procedure database on demand.
 * [STATE]: Experimental
 * [ANCHOR]: None
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * ICD-9-CM Procedure Library
 * This file uses dynamic imports to load the heavy procedure database on demand.
 */

let cachedICD9CM = null;

async function loadICD9CM() {
    if (cachedICD9CM) return cachedICD9CM;
    try {
        const module = await import('./master_icd_9.json');
        cachedICD9CM = module.default || module;
        return cachedICD9CM;
    } catch (error) {
        console.error("Failed to load ICD-9-CM data:", error);
        return [];
    }
}

// Map common gameplay procedures to Indonesian aliases for searchability
const ICD9_ALIASES = {
    '86.59': 'jahit luka hecting suturing',
    '86.22': 'debridement rawat angkat nekrotik',
    '86.28': 'debridement non eksisional',
    '86.23': 'ekstraksi kuku pencabutan roserplasty',
    '86.27': 'ekstraksi kuku pencabutan jempol',
    '86.3': 'eksisi biopsi tumor jinak lipoma',
    '93.94': 'uap nebulizer nebul',
    '38.99': 'pasang infus iv line akses intravena',
    '99.29': 'injeksi iv infus akses',
    '89.52': 'rekam jantung ekg ecg',
    '95.01': 'visus mata refraksi snellen test baca dkt',
    '96.04': 'intubasi jalan napas',
    '93.90': 'cpap oftalmoskopi pernapasan nrm sungkup',
    '99.25': 'kompres dingin es cooling',
    '99.0': 'parafimosis reduksi manual',
    '93.54': 'bidai splinting imobilisasi fraktur patah tulang',
    '34.01': 'wst chest tube dekompresi jarum torakosentesis',
    '34.91': 'wst chest tube torakosentesis',
    '93.93': 'resusitasi neonatus bbl pijat jantung',
    '89.37': 'spirometri fungsi paru',
    '73.59': 'persalinan normal usap apn vulva partus',
    '73.6': 'episiotomi perineum potong',
    '94.01': 'psikometri kognitif mmse moca iq',
    '98.11': 'ambil angkat benda asing serumen kotoran telinga corpus alienum'
};

export async function findICD9CM(query, limit = 15) {
    if (!query || query.length < 2) return [];

    const db = await loadICD9CM();
    const q = query.toLowerCase();

    const matches = db.filter(d =>
        d.code.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        (ICD9_ALIASES[d.code] || '').includes(q)
    );

    // Sort: exact code matches first
    matches.sort((a, b) => {
        const aCodeMatch = a.code.toLowerCase() === q;
        const bCodeMatch = b.code.toLowerCase() === q;
        if (aCodeMatch && !bCodeMatch) return -1;
        if (!aCodeMatch && bCodeMatch) return 1;
        return 0;
    });

    return matches.slice(0, limit);
}

export async function getICD9CMByCode(code) {
    if (!code) return null;
    const db = await loadICD9CM();
    return db.find(d => d.code === code);
}
