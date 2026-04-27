import { describe, expect, it } from 'vitest';
import {
    BADGE_CATALOGUE,
    evaluateNewlyEligibleBadges,
    TOTAL_BADGES,
} from '../utils/lifetimeBadges.js';

describe('lifetimeBadges — catalogue', () => {
    it('punya 9 badge dengan id, label, icon, condition function', () => {
        expect(TOTAL_BADGES).toBe(9);
        Object.values(BADGE_CATALOGUE).forEach((badge) => {
            expect(typeof badge.id).toBe('string');
            expect(typeof badge.label).toBe('string');
            expect(typeof badge.icon).toBe('string');
            expect(typeof badge.condition).toBe('function');
            expect(typeof badge.description).toBe('string');
        });
    });

    it('badges mencakup 3 axes: SKDI mastery, total cases, stase grade', () => {
        const ids = Object.keys(BADGE_CATALOGUE);
        expect(ids).toContain('skdi_starter');
        expect(ids).toContain('skdi_master');
        expect(ids).toContain('century_club');
        expect(ids).toContain('veteran');
        expect(ids).toContain('stase_lulus');
        expect(ids).toContain('stase_kompeten');
        expect(ids).toContain('stase_teladan');
        expect(ids).toContain('repeated_runner');
    });
});

describe('lifetimeBadges — evaluateNewlyEligibleBadges', () => {
    it('null/empty lifetime → tidak ada badge', () => {
        expect(evaluateNewlyEligibleBadges(null)).toEqual([]);
        expect(evaluateNewlyEligibleBadges({})).toEqual([]);
        expect(evaluateNewlyEligibleBadges({ totalCases: 0 })).toEqual([]);
    });

    it('SKDI Starter award setelah 10 unique SKDI', () => {
        const lifetime = {
            skdiTouched: ['4A', '4B', '3B', '3A', '2', '1', 'unknown1', 'unknown2', 'unknown3', 'unknown4'],
            diagnosisIcdTouched: [],
            badges: [],
        };
        const eligible = evaluateNewlyEligibleBadges(lifetime);
        expect(eligible).toContain('skdi_starter');
    });

    it('SKDI Master award setelah 144 ICD unik', () => {
        const lifetime = {
            skdiTouched: ['4A'],
            diagnosisIcdTouched: Array.from({ length: 144 }, (_, i) => `J${String(i).padStart(3, '0')}`),
            badges: [],
        };
        const eligible = evaluateNewlyEligibleBadges(lifetime);
        expect(eligible).toContain('skdi_master');
        expect(eligible).toContain('skdi_explorer'); // ≥50 also triggered
        expect(eligible).not.toContain('skdi_starter');  // hanya 1 SKDI unik di skdiTouched
    });

    it('Century Club di 100 totalCases', () => {
        const lifetime = { totalCases: 100, skdiTouched: [], diagnosisIcdTouched: [], badges: [] };
        expect(evaluateNewlyEligibleBadges(lifetime)).toContain('century_club');
    });

    it('Veteran di 500 totalCases (Century juga eligible)', () => {
        const lifetime = { totalCases: 500, skdiTouched: [], diagnosisIcdTouched: [], badges: [] };
        const eligible = evaluateNewlyEligibleBadges(lifetime);
        expect(eligible).toContain('veteran');
        expect(eligible).toContain('century_club');
    });

    it('Stase Teladan butuh bestStaseGrade=A', () => {
        expect(evaluateNewlyEligibleBadges({ bestStaseGrade: 'A', badges: [] })).toContain('stase_teladan');
        expect(evaluateNewlyEligibleBadges({ bestStaseGrade: 'B', badges: [] })).not.toContain('stase_teladan');
    });

    it('Stase Lulus untuk Grade C/B/A, BUKAN D', () => {
        expect(evaluateNewlyEligibleBadges({ bestStaseGrade: 'C', badges: [] })).toContain('stase_lulus');
        expect(evaluateNewlyEligibleBadges({ bestStaseGrade: 'D', badges: [] })).not.toContain('stase_lulus');
        expect(evaluateNewlyEligibleBadges({ bestStaseGrade: null, badges: [] })).not.toContain('stase_lulus');
    });

    it('Repeated Runner di 3 completed stases', () => {
        expect(evaluateNewlyEligibleBadges({ completedStases: 3, badges: [] })).toContain('repeated_runner');
        expect(evaluateNewlyEligibleBadges({ completedStases: 2, badges: [] })).not.toContain('repeated_runner');
    });

    it('badge yang sudah owned tidak di-list ulang', () => {
        const lifetime = {
            totalCases: 100,
            skdiTouched: [],
            diagnosisIcdTouched: [],
            badges: [{ id: 'century_club', awardedAt: 1234, label: 'Century Club' }],
        };
        const eligible = evaluateNewlyEligibleBadges(lifetime);
        expect(eligible).not.toContain('century_club');
    });
});
