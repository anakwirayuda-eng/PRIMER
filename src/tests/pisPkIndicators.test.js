import { describe, expect, it } from 'vitest';
import {
    PIS_PK_INDICATORS,
    getApplicableIndicators,
    evaluateFamilyIndicators,
    calculateFamilyIKSPisPk,
    classifyFamilyIKS,
    calculateVillageIKSPisPk,
} from '../domains/village/pisPkIndicators.js';

const kemenkesCount = PIS_PK_INDICATORS.filter((i) => i.official).length;

const familyWithBalita = {
    id: 'kk_t1',
    members: [
        { role: 'head', firstName: 'A', gender: 'L', age: 35 },
        { role: 'spouse', firstName: 'B', gender: 'P', age: 32 },
        { role: 'child', firstName: 'C', gender: 'L', age: 3 },
        { role: 'child', firstName: 'D', gender: 'P', age: 1 },
    ],
    indicators: {
        kb: true, persalinan: true, imunisasi: true, asi: true, balita: true,
        tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true,
        air: true, jamban: true, jentik: true,
    },
};

const familyElderlyOnly = {
    id: 'kk_t2',
    members: [
        { role: 'head', firstName: 'E', gender: 'L', age: 72 },
        { role: 'spouse', firstName: 'F', gender: 'P', age: 68 },
    ],
    indicators: {
        kb: false, persalinan: false, imunisasi: false, asi: false, balita: false,
        tb: true, hipertensi: false, jiwa: true, rokok: true, jkn: true,
        air: true, jamban: true, jentik: true,
    },
};

const familyMiddleAgedCouple = {
    id: 'kk_t3',
    members: [
        { role: 'head', firstName: 'G', gender: 'L', age: 45 },
        { role: 'spouse', firstName: 'H', gender: 'P', age: 42 },
        { role: 'child', firstName: 'I', gender: 'L', age: 18 },
    ],
    indicators: {
        tb: true, hipertensi: false, jiwa: true, rokok: false, jkn: true,
        air: true, jamban: false, jentik: true,
    },
};

describe('pisPkIndicators — indicator catalogue', () => {
    it('has 12 official Kemenkes indicators plus 1 PSN bonus (jentik)', () => {
        expect(kemenkesCount).toBe(12);
        expect(PIS_PK_INDICATORS.length).toBe(13);
        expect(PIS_PK_INDICATORS.find((i) => i.id === 'jentik')?.official).toBe(false);
    });

    it('has the resmi Kemenkes IDs exactly as specified', () => {
        const officialIds = PIS_PK_INDICATORS.filter((i) => i.official).map((i) => i.id).sort();
        expect(officialIds).toEqual([
            'air', 'asi', 'balita', 'hipertensi', 'imunisasi', 'jamban', 'jiwa', 'jkn', 'kb', 'persalinan', 'rokok', 'tb',
        ]);
    });
});

describe('pisPkIndicators — applicability rules', () => {
    it('applies KIA indicators only when a child/infant exists', () => {
        const applicable = getApplicableIndicators(familyWithBalita).map((i) => i.id);
        expect(applicable).toContain('asi');
        expect(applicable).toContain('imunisasi');
        expect(applicable).toContain('balita');
    });

    it('skips KIA indicators when family has only elderly', () => {
        const applicable = getApplicableIndicators(familyElderlyOnly).map((i) => i.id);
        expect(applicable).not.toContain('asi');
        expect(applicable).not.toContain('imunisasi');
        expect(applicable).not.toContain('balita');
        expect(applicable).not.toContain('persalinan');
        expect(applicable).not.toContain('kb');  // spouse > 49 years, tidak PUS
    });

    it('applies KB only when there is a reproductive-age spouse (15-49)', () => {
        const applicable = getApplicableIndicators(familyMiddleAgedCouple).map((i) => i.id);
        expect(applicable).toContain('kb'); // spouse 42 → within 15-49
    });

    it('applies persalinan when someone is pregnant', () => {
        const fam = {
            members: [
                { role: 'head', age: 30, gender: 'L' },
                { role: 'spouse', age: 28, gender: 'P', pregnant: true, trimester: 3 },
            ],
            indicators: { persalinan: true },
        };
        const applicable = getApplicableIndicators(fam).map((i) => i.id);
        expect(applicable).toContain('persalinan');
    });

    it('always applies environment/JKN/TB/jiwa/rokok indicators', () => {
        const applicable = getApplicableIndicators(familyElderlyOnly).map((i) => i.id);
        ['tb', 'jiwa', 'rokok', 'jkn', 'air', 'jamban', 'jentik', 'hipertensi']
            .forEach((id) => expect(applicable).toContain(id));
    });

    it('returns [] for invalid family input', () => {
        expect(getApplicableIndicators(null)).toEqual([]);
        expect(getApplicableIndicators(undefined)).toEqual([]);
    });
});

describe('pisPkIndicators — evaluateFamilyIndicators', () => {
    it('marks KIA indicators as N/A for elderly family', () => {
        const breakdown = evaluateFamilyIndicators(familyElderlyOnly);
        const naIds = breakdown.filter((b) => b.status === 'na').map((b) => b.id);
        expect(naIds).toContain('asi');
        expect(naIds).toContain('imunisasi');
        expect(naIds).toContain('balita');
        expect(naIds).toContain('persalinan');
        expect(naIds).toContain('kb');
    });

    it('marks indicator without value as N/A (missing data)', () => {
        const fam = {
            members: [{ role: 'head', age: 35, gender: 'L' }],
            indicators: { tb: true }, // only one indicator supplied
        };
        const rokok = evaluateFamilyIndicators(fam).find((b) => b.id === 'rokok');
        expect(rokok.status).toBe('na');
    });

    it('correctly flags healthy vs unhealthy for applicable indicators', () => {
        const breakdown = evaluateFamilyIndicators(familyMiddleAgedCouple);
        const jamban = breakdown.find((b) => b.id === 'jamban');
        const jkn = breakdown.find((b) => b.id === 'jkn');
        expect(jamban.status).toBe('unhealthy');
        expect(jkn.status).toBe('healthy');
    });
});

describe('pisPkIndicators — calculateFamilyIKSPisPk', () => {
    it('returns IKS 1.0 when all applicable indicators fulfilled', () => {
        const result = calculateFamilyIKSPisPk(familyWithBalita);
        expect(result.iks).toBe(1);
        expect(result.fulfilled).toBe(result.applicable);
        // Family has PUS + balita + child<2, but no pregnant/newborn → persalinan N/A
        // Applicable: kb, imunisasi, asi, balita + tb, hipertensi, jiwa, rokok, jkn, air, jamban, jentik = 12
        expect(result.applicable).toBe(12);
    });

    it('applies all 13 indicators when family has newborn or pregnancy', () => {
        const fam = {
            ...familyWithBalita,
            members: [
                ...familyWithBalita.members.slice(0, 2),
                { role: 'child', firstName: 'NB', gender: 'L', age: 0 }, // newborn
            ],
        };
        const result = calculateFamilyIKSPisPk(fam);
        expect(result.applicable).toBe(13);
    });

    it('returns IKS 0 for a family where none of the applicable indicators are fulfilled', () => {
        const fam = {
            ...familyElderlyOnly,
            indicators: {
                ...familyElderlyOnly.indicators,
                tb: false, hipertensi: false, jiwa: false, rokok: false,
                jkn: false, air: false, jamban: false, jentik: false,
            },
        };
        const result = calculateFamilyIKSPisPk(fam);
        expect(result.iks).toBe(0);
    });

    it('excludes N/A indicators from the denominator', () => {
        // Elderly family has 8 applicable (tb, hipertensi, jiwa, rokok, jkn, air, jamban, jentik);
        // kb/persalinan/imunisasi/asi/balita are N/A because no child/PUS.
        const result = calculateFamilyIKSPisPk(familyElderlyOnly);
        expect(result.applicable).toBe(8);
    });

    it('honours pre-computed iksScore override (save-game compat)', () => {
        const fam = { iksScore: 0.42, members: [], indicators: {} };
        const result = calculateFamilyIKSPisPk(fam);
        expect(result.iks).toBe(0.42);
        expect(result.source).toBe('override');
    });

    it('ignores override when forceRecompute is set', () => {
        const fam = { ...familyWithBalita, iksScore: 0.1 };
        const result = calculateFamilyIKSPisPk(fam, { forceRecompute: true });
        expect(result.iks).toBe(1);
        expect(result.source).toBe('computed');
    });

    it('officialOnly excludes jentik from calculation', () => {
        // Middle-aged couple: Kemenkes-only applicable = kb, tb, hipertensi, jiwa, rokok, jkn, air, jamban = 8
        // fulfilled (true): tb, jiwa, jkn, air, kb (default unset → N/A, but test explicit): let's set kb.
        const fam = {
            ...familyMiddleAgedCouple,
            indicators: { ...familyMiddleAgedCouple.indicators, kb: true },
        };
        const all = calculateFamilyIKSPisPk(fam, { officialOnly: false, forceRecompute: true });
        const officialOnly = calculateFamilyIKSPisPk(fam, { officialOnly: true, forceRecompute: true });
        // officialOnly should exclude jentik — applicable count drops by 1
        expect(officialOnly.applicable).toBe(all.applicable - 1);
    });

    it('returns zeros for invalid family input', () => {
        const result = calculateFamilyIKSPisPk(null);
        expect(result.iks).toBe(0);
        expect(result.applicable).toBe(0);
    });
});

describe('pisPkIndicators — classifyFamilyIKS', () => {
    it.each([
        [1.0, 'sehat'],
        [0.85, 'sehat'],
        [0.81, 'sehat'],
        [0.8, 'pra_sehat'], // strict > 0.8 cut; Kemenkes threshold
        [0.65, 'pra_sehat'],
        [0.5, 'pra_sehat'],
        [0.49, 'tidak_sehat'],
        [0, 'tidak_sehat'],
    ])('classifies %s as %s', (iks, tier) => {
        expect(classifyFamilyIKS(iks)).toBe(tier);
    });
});

describe('pisPkIndicators — calculateVillageIKSPisPk', () => {
    it('returns zeroed metrics for empty village', () => {
        const result = calculateVillageIKSPisPk([]);
        expect(result.meanIks).toBe(0);
        expect(result.kkSehatPercent).toBe(0);
        expect(result.totalKK).toBe(0);
    });

    it('aggregates distribution across health tiers', () => {
        const families = [
            familyWithBalita,   // IKS 1.0 → sehat
            familyElderlyOnly,  // fulfilled 6/8 (hipertensi false, rokok true = fulfilled) = 6/8 = 0.75 → pra_sehat
            familyMiddleAgedCouple, // 8 applicable with default (kb NA because no indicator value): actually let's compute
        ];
        const result = calculateVillageIKSPisPk(families, { forceRecompute: true });
        expect(result.totalKK).toBe(3);
        expect(result.distribution.sehat + result.distribution.pra_sehat + result.distribution.tidak_sehat).toBe(3);
    });

    it('computes per-indicator coverage correctly', () => {
        const families = [
            { members: [{ role: 'head', age: 40, gender: 'L' }], indicators: { rokok: true, jkn: true, jamban: true, air: true, tb: true, hipertensi: true, jiwa: true, jentik: true } },
            { members: [{ role: 'head', age: 40, gender: 'L' }], indicators: { rokok: false, jkn: true, jamban: true, air: true, tb: true, hipertensi: true, jiwa: true, jentik: true } },
        ];
        const result = calculateVillageIKSPisPk(families, { forceRecompute: true });
        expect(result.indicatorCoverage.rokok.applicable).toBe(2);
        expect(result.indicatorCoverage.rokok.fulfilled).toBe(1);
        expect(result.indicatorCoverage.rokok.coverage).toBe(0.5);
        expect(result.indicatorCoverage.jkn.coverage).toBe(1);
    });

    it('honours iksScore override in aggregation', () => {
        const families = [
            { iksScore: 0.9, members: [], indicators: {} },
            { iksScore: 0.6, members: [], indicators: {} },
        ];
        const result = calculateVillageIKSPisPk(families);
        expect(result.meanIks).toBeCloseTo(0.75, 4);
        expect(result.distribution.sehat).toBe(1);
        expect(result.distribution.pra_sehat).toBe(1);
    });
});
