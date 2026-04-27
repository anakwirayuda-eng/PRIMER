/**
 * @reflection
 * [IDENTITY]: pisPkIndicators
 * [PURPOSE]: Canonical 12 Kemenkes PIS-PK indicators + 1 PSN (jentik) bonus, with
 *            demographic applicability rules and family/village IKS calculators.
 *            Becomes the single source of truth for Indeks Keluarga Sehat.
 * [STATE]: Production
 * [ANCHOR]: PIS_PK_INDICATORS
 * [DEPENDS_ON]: (none — pure)
 * [LAST_UPDATE]: 2026-04-23
 *
 * Reference: Permenkes 39/2016 tentang Program Indonesia Sehat dengan Pendekatan
 * Keluarga (PIS-PK) — 12 indikator resmi.
 */

const clamp01 = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    if (n < 0) return 0;
    if (n > 1) return 1;
    return n;
};

const ageOf = (member) => {
    const n = Number(member?.age);
    return Number.isFinite(n) ? n : null;
};

// ═══════════════════════════════════════════════════════════════
// DEMOGRAPHIC HELPERS
// ═══════════════════════════════════════════════════════════════

function hasInfantUnder12mo(family) {
    return (family?.members || []).some((m) => {
        const age = ageOf(m);
        return age !== null && age < 1;
    });
}

function hasChildUnder2(family) {
    return (family?.members || []).some((m) => {
        const age = ageOf(m);
        return age !== null && age < 2;
    });
}

function hasBalita(family) {
    return (family?.members || []).some((m) => {
        const age = ageOf(m);
        return age !== null && age >= 0 && age <= 5;
    });
}

function hasReproductiveCouple(family) {
    const members = family?.members || [];
    const head = members.find((m) => m?.role === 'head');
    const spouse = members.find((m) => m?.role === 'spouse');
    if (!head || !spouse) return false;
    const spouseFemale = spouse.gender === 'P';
    const age = ageOf(spouse);
    return spouseFemale && age !== null && age >= 15 && age <= 49;
}

function hasPregnantMember(family) {
    return (family?.members || []).some((m) => m?.pregnant === true);
}

function hasAdult(family) {
    return (family?.members || []).some((m) => {
        const age = ageOf(m);
        return age !== null && age >= 15;
    });
}

// ═══════════════════════════════════════════════════════════════
// INDICATOR DEFINITIONS (12 resmi Kemenkes + 1 PSN)
// ═══════════════════════════════════════════════════════════════

export const PIS_PK_INDICATORS = [
    {
        id: 'kb',
        shortLabel: 'KB',
        label: 'Keluarga mengikuti program KB',
        category: 'kia',
        official: true,
        description: 'Pasangan usia subur (istri 15-49 th) ber-KB.',
        appliesTo: hasReproductiveCouple,
    },
    {
        id: 'persalinan',
        shortLabel: 'Persalinan',
        label: 'Persalinan ibu di fasilitas kesehatan',
        category: 'kia',
        official: true,
        description: 'Ibu hamil bersalin di fasyankes (bukan di rumah/dukun).',
        appliesTo: (fam) => hasPregnantMember(fam) || hasInfantUnder12mo(fam),
    },
    {
        id: 'imunisasi',
        shortLabel: 'Imunisasi',
        label: 'Bayi mendapat imunisasi dasar lengkap',
        category: 'kia',
        official: true,
        description: 'Bayi 0-11 bulan telah menerima imunisasi dasar (HB0, BCG, Polio, DPT-HB-Hib, Campak).',
        appliesTo: hasChildUnder2,
    },
    {
        id: 'asi',
        shortLabel: 'ASI',
        label: 'Bayi mendapat ASI eksklusif 0-6 bulan',
        category: 'kia',
        official: true,
        description: 'Bayi 0-6 bulan hanya diberi ASI tanpa makanan/minuman lain.',
        appliesTo: hasChildUnder2,
    },
    {
        id: 'balita',
        shortLabel: 'Balita',
        label: 'Balita dipantau pertumbuhannya',
        category: 'kia',
        official: true,
        description: 'Balita 0-5 th ditimbang dan diukur setiap bulan di Posyandu.',
        appliesTo: hasBalita,
    },
    {
        id: 'tb',
        shortLabel: 'TB',
        label: 'Penderita TB berobat sesuai standar',
        category: 'penyakit',
        official: true,
        description: 'Jika ada penderita TB, berobat teratur sampai tuntas (DOT/FDC).',
        appliesTo: () => true,
    },
    {
        id: 'hipertensi',
        shortLabel: 'Hipertensi',
        label: 'Penderita hipertensi berobat teratur',
        category: 'penyakit',
        official: true,
        description: 'Tekanan darah dewasa ≥15 th dipantau; jika HT, minum obat teratur.',
        appliesTo: hasAdult,
    },
    {
        id: 'jiwa',
        shortLabel: 'ODGJ',
        label: 'Penderita gangguan jiwa tidak ditelantarkan',
        category: 'penyakit',
        official: true,
        description: 'ODGJ berat dirawat, diberikan obat, tidak dipasung.',
        appliesTo: () => true,
    },
    {
        id: 'rokok',
        shortLabel: 'Rokok',
        label: 'Tidak ada anggota keluarga merokok',
        category: 'perilaku',
        official: true,
        description: 'Seluruh anggota keluarga tidak merokok (aktif atau pasif di dalam rumah).',
        appliesTo: () => true,
    },
    {
        id: 'jkn',
        shortLabel: 'JKN',
        label: 'Keluarga menjadi anggota JKN',
        category: 'jaminan',
        official: true,
        description: 'Semua anggota keluarga terdaftar sebagai peserta JKN/KIS.',
        appliesTo: () => true,
    },
    {
        id: 'air',
        shortLabel: 'Air Bersih',
        label: 'Akses sarana air bersih',
        category: 'lingkungan',
        official: true,
        description: 'Keluarga memakai air bersih (PDAM/sumur terlindung) untuk konsumsi.',
        appliesTo: () => true,
    },
    {
        id: 'jamban',
        shortLabel: 'Jamban Sehat',
        label: 'Akses jamban sehat',
        category: 'lingkungan',
        official: true,
        description: 'Keluarga memakai jamban sehat (leher angsa, septic tank, bukan sungai).',
        appliesTo: () => true,
    },
    // Bonus — bukan 12 Kemenkes resmi, namun penting untuk program PSN DBD di desa
    {
        id: 'jentik',
        shortLabel: 'Bebas Jentik',
        label: 'Rumah bebas jentik nyamuk (PSN 3M Plus)',
        category: 'lingkungan',
        official: false,
        description: 'Pemantauan jentik rutin; tidak ada breeding site Aedes aegypti.',
        appliesTo: () => true,
    },
];

export const PIS_PK_CATEGORIES = {
    kia: { label: 'KIA & Gizi', icon: '👶' },
    penyakit: { label: 'Penyakit Prioritas', icon: '🩺' },
    perilaku: { label: 'Perilaku Sehat', icon: '🚭' },
    jaminan: { label: 'Jaminan Kesehatan', icon: '🪪' },
    lingkungan: { label: 'Lingkungan', icon: '💧' },
};

// ═══════════════════════════════════════════════════════════════
// FAMILY-LEVEL CALCULATION
// ═══════════════════════════════════════════════════════════════

/**
 * Return only indicators applicable to this family based on demographics.
 */
export function getApplicableIndicators(family) {
    if (!family || typeof family !== 'object') return [];
    return PIS_PK_INDICATORS.filter((ind) => ind.appliesTo(family));
}

/**
 * Per-indicator status for a family:
 *   { id, status: 'healthy' | 'unhealthy' | 'na', applicable, value }
 */
export function evaluateFamilyIndicators(family) {
    const breakdown = [];
    for (const ind of PIS_PK_INDICATORS) {
        const applicable = ind.appliesTo(family);
        const raw = family?.indicators?.[ind.id];
        const hasValue = raw === true || raw === false;

        if (!applicable || !hasValue) {
            breakdown.push({ id: ind.id, status: 'na', applicable, value: hasValue ? raw : null });
            continue;
        }
        breakdown.push({
            id: ind.id,
            status: raw === true ? 'healthy' : 'unhealthy',
            applicable: true,
            value: raw,
        });
    }
    return breakdown;
}

/**
 * Calculate family-level IKS using the PIS-PK formula:
 *   IKS = fulfilled / applicable (indicators N/T excluded from denominator).
 *
 * Falls back to pre-computed `family.iksScore` override when provided
 * (preserves save-game compatibility + PosyanduModal flow).
 *
 * @param {Object} family - { id, members, indicators, iksScore? }
 * @param {Object} [options]
 * @param {boolean} [options.officialOnly=false] - Exclude jentik (non-Kemenkes).
 * @param {boolean} [options.forceRecompute=false] - Ignore `iksScore` override.
 * @returns {{ iks:number, fulfilled:number, applicable:number, breakdown:Array }}
 */
export function calculateFamilyIKSPisPk(family, options = {}) {
    const { officialOnly = false, forceRecompute = false } = options;

    if (!family || typeof family !== 'object') {
        return { iks: 0, fulfilled: 0, applicable: 0, breakdown: [] };
    }

    // Save-game override: some flows (PosyanduModal) stamp `iksScore` directly.
    if (!forceRecompute && Number.isFinite(Number(family.iksScore))) {
        return {
            iks: clamp01(family.iksScore),
            fulfilled: 0,
            applicable: 0,
            breakdown: [],
            source: 'override',
        };
    }

    const breakdown = evaluateFamilyIndicators(family).filter((row) => {
        if (!officialOnly) return true;
        const def = PIS_PK_INDICATORS.find((i) => i.id === row.id);
        return def?.official === true;
    });

    const counted = breakdown.filter((row) => row.status !== 'na');
    const applicable = counted.length;
    const fulfilled = counted.filter((row) => row.status === 'healthy').length;
    const iks = applicable > 0 ? fulfilled / applicable : 0;

    return { iks: clamp01(iks), fulfilled, applicable, breakdown, source: 'computed' };
}

// ═══════════════════════════════════════════════════════════════
// VILLAGE-LEVEL AGGREGATION
// ═══════════════════════════════════════════════════════════════

/**
 * Classify a family IKS into Kemenkes health tier:
 *   Sehat    (IKS > 0.80)
 *   Pra-Sehat (IKS 0.50–0.80)
 *   Tidak Sehat (IKS < 0.50)
 */
export function classifyFamilyIKS(iks) {
    const score = clamp01(iks);
    if (score > 0.8) return 'sehat';
    if (score >= 0.5) return 'pra_sehat';
    return 'tidak_sehat';
}

/**
 * Village-level PIS-PK metrics:
 *   meanIks         — mean of family IKS (0-1)
 *   kkSehatCount    — number of "Keluarga Sehat" (IKS > 0.8)
 *   kkSehatPercent  — % keluarga Sehat (Kemenkes headline number)
 *   distribution    — { sehat, pra_sehat, tidak_sehat }
 *   indicatorCoverage — per-indicator cakupan % fulfilled across applicable families
 */
export function calculateVillageIKSPisPk(families, options = {}) {
    const list = Array.isArray(families) ? families : [];
    if (list.length === 0) {
        return {
            meanIks: 0,
            kkSehatCount: 0,
            kkSehatPercent: 0,
            totalKK: 0,
            distribution: { sehat: 0, pra_sehat: 0, tidak_sehat: 0 },
            indicatorCoverage: {},
        };
    }

    const familyResults = list.map((f) => calculateFamilyIKSPisPk(f, options));
    const meanIks = familyResults.reduce((sum, r) => sum + r.iks, 0) / list.length;

    const distribution = { sehat: 0, pra_sehat: 0, tidak_sehat: 0 };
    familyResults.forEach((r) => {
        distribution[classifyFamilyIKS(r.iks)] += 1;
    });

    // Coverage per indikator: (fulfilled / applicable) across families
    const indicatorCoverage = {};
    for (const ind of PIS_PK_INDICATORS) {
        let applicable = 0;
        let fulfilled = 0;
        familyResults.forEach((r) => {
            const row = r.breakdown?.find((b) => b.id === ind.id);
            if (!row || row.status === 'na') return;
            applicable += 1;
            if (row.status === 'healthy') fulfilled += 1;
        });
        indicatorCoverage[ind.id] = {
            applicable,
            fulfilled,
            coverage: applicable > 0 ? fulfilled / applicable : 0,
        };
    }

    return {
        meanIks: clamp01(meanIks),
        kkSehatCount: distribution.sehat,
        kkSehatPercent: (distribution.sehat / list.length) * 100,
        totalKK: list.length,
        distribution,
        indicatorCoverage,
    };
}

export default {
    PIS_PK_INDICATORS,
    PIS_PK_CATEGORIES,
    getApplicableIndicators,
    evaluateFamilyIndicators,
    calculateFamilyIKSPisPk,
    classifyFamilyIKS,
    calculateVillageIKSPisPk,
};
