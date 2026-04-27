import { describe, expect, it } from 'vitest';
import {
    FEATURE_UNLOCKS,
    isFeatureUnlocked,
    getUnlockedFeatures,
    getNextUnlock,
    getNewlyUnlockedFeatures,
} from '../utils/featureUnlocks.js';

describe('featureUnlocks — catalogue', () => {
    it('punya 4 fitur ter-gate (Posyandu, Prolanis, Outbreak Investigation, Akreditasi Detail)', () => {
        const ids = Object.keys(FEATURE_UNLOCKS);
        expect(ids).toContain('posyandu');
        expect(ids).toContain('prolanis');
        expect(ids).toContain('outbreak_investigation');
        expect(ids).toContain('accreditation_detail');
    });

    it('SISRUTE TIDAK ada di catalogue (clinical safety — tidak boleh di-gate)', () => {
        expect(FEATURE_UNLOCKS).not.toHaveProperty('sisrute');
        expect(FEATURE_UNLOCKS).not.toHaveProperty('referral');
    });

    it('UKP klinis dasar (poli, EMR, inventaris) TIDAK ada di catalogue', () => {
        expect(FEATURE_UNLOCKS).not.toHaveProperty('clinic');
        expect(FEATURE_UNLOCKS).not.toHaveProperty('emr');
        expect(FEATURE_UNLOCKS).not.toHaveProperty('inventory');
        expect(FEATURE_UNLOCKS).not.toHaveProperty('pharmacy');
    });

    it('semua entry punya unlockDay positif + label + rationale', () => {
        Object.values(FEATURE_UNLOCKS).forEach((cfg) => {
            expect(cfg.unlockDay).toBeGreaterThan(0);
            expect(typeof cfg.label).toBe('string');
            expect(cfg.label.length).toBeGreaterThan(0);
            expect(typeof cfg.rationale).toBe('string');
        });
    });
});

describe('featureUnlocks — isFeatureUnlocked', () => {
    it.each([
        ['posyandu', 1, false],
        ['posyandu', 14, false],
        ['posyandu', 15, true],
        ['posyandu', 90, true],
        ['prolanis', 14, false],
        ['prolanis', 29, false],
        ['prolanis', 30, true],
        ['outbreak_investigation', 44, false],
        ['outbreak_investigation', 45, true],
        ['accreditation_detail', 29, false],
        ['accreditation_detail', 30, true],
    ])('%s pada day=%i → unlocked=%s', (feature, day, expected) => {
        expect(isFeatureUnlocked(feature, day)).toBe(expected);
    });

    it('feature ID tidak dikenal → tidak di-gate (default open)', () => {
        expect(isFeatureUnlocked('clinic', 1)).toBe(true);
        expect(isFeatureUnlocked('inventory', 1)).toBe(true);
        expect(isFeatureUnlocked('sisrute', 1)).toBe(true); // PENTING — never gated
    });

    it('day invalid → locked (paling konservatif)', () => {
        expect(isFeatureUnlocked('posyandu', NaN)).toBe(false);
        expect(isFeatureUnlocked('posyandu', undefined)).toBe(false);
        expect(isFeatureUnlocked('posyandu', null)).toBe(false);
    });
});

describe('featureUnlocks — getNextUnlock', () => {
    it('Day 1 → next adalah Posyandu (Day 15)', () => {
        const next = getNextUnlock(1);
        expect(next?.id).toBe('posyandu');
        expect(next?.unlockDay).toBe(15);
    });

    it('Day 15 → next adalah Prolanis ATAU Akreditasi (Day 30, sama-sama)', () => {
        const next = getNextUnlock(15);
        expect([30].includes(next?.unlockDay)).toBe(true);
    });

    it('Day 30 → next adalah Outbreak Investigation (Day 45)', () => {
        const next = getNextUnlock(30);
        expect(next?.id).toBe('outbreak_investigation');
    });

    it('Day 100 → null (semua sudah unlocked)', () => {
        expect(getNextUnlock(100)).toBe(null);
    });
});

describe('featureUnlocks — getUnlockedFeatures', () => {
    it('Day 14 → kosong (tidak ada yang unlocked)', () => {
        expect(getUnlockedFeatures(14)).toEqual([]);
    });

    it('Day 15 → posyandu saja', () => {
        const ids = getUnlockedFeatures(15).map((f) => f.id);
        expect(ids).toEqual(['posyandu']);
    });

    it('Day 30 → posyandu + prolanis + accreditation_detail (3)', () => {
        const ids = getUnlockedFeatures(30).map((f) => f.id);
        expect(ids).toContain('posyandu');
        expect(ids).toContain('prolanis');
        expect(ids).toContain('accreditation_detail');
        expect(ids).not.toContain('outbreak_investigation');
    });

    it('Day 60+ → semua unlocked', () => {
        expect(getUnlockedFeatures(60).length).toBe(4);
    });
});

describe('featureUnlocks — getNewlyUnlockedFeatures (untuk toast on day transition)', () => {
    it('Day 14 → 15 transition: posyandu newly unlocked', () => {
        const newly = getNewlyUnlockedFeatures(14, 15);
        expect(newly.map((f) => f.id)).toEqual(['posyandu']);
    });

    it('Day 29 → 30 transition: prolanis + accreditation_detail (2)', () => {
        const newly = getNewlyUnlockedFeatures(29, 30);
        const ids = newly.map((f) => f.id);
        expect(ids).toContain('prolanis');
        expect(ids).toContain('accreditation_detail');
    });

    it('Day 1 → 1 (tidak ada transition): kosong', () => {
        expect(getNewlyUnlockedFeatures(1, 1)).toEqual([]);
    });

    it('day mundur (load save lama): kosong, tidak emit toast spam', () => {
        expect(getNewlyUnlockedFeatures(50, 30)).toEqual([]);
    });

    it('jump besar Day 1 → Day 50: 4 fitur newly unlocked (semua threshold ≤50)', () => {
        const newly = getNewlyUnlockedFeatures(1, 50);
        const ids = newly.map((f) => f.id);
        expect(ids).toContain('posyandu');           // Day 15
        expect(ids).toContain('prolanis');           // Day 30
        expect(ids).toContain('accreditation_detail'); // Day 30
        expect(ids).toContain('outbreak_investigation'); // Day 45
        expect(newly.length).toBe(4);
    });
});
