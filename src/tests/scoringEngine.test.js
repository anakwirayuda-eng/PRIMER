import { describe, expect, it } from 'vitest';
import {
    SCORE_WEIGHTS,
    ACCREDITATION_POINTS,
    GRADE_THRESHOLDS,
    calculateReferralGuillotine,
    calculateClinicalScore,
    countApathyEvents,
    calculateCommunityScore,
    calculateManagementScore,
    calculateResilienceScore,
    gradeFromScore,
    calculatePerformanceScore,
} from '../utils/scoringEngine.js';

// ═══════════════════════════════════════════════════════════════
// HELPERS — buat state-shape sintetis untuk test
// ═══════════════════════════════════════════════════════════════

const buildHealthyFamily = (id, sick = false) => ({
    id,
    surname: id,
    members: [
        { role: 'head', age: 38, gender: 'L' },
        { role: 'spouse', age: 32, gender: 'P' },
        { role: 'child', age: 3, gender: 'L' },
    ],
    indicators: sick
        ? { kb: false, persalinan: false, imunisasi: false, asi: false, balita: false, tb: false, hipertensi: false, jiwa: false, rokok: false, jkn: false, air: false, jamban: false, jentik: false }
        : { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
});

const buildState = ({
    accuracy = 0,
    rrns = 0,
    families = [],
    readinessState = {},
    clinicalHistory = [],
    accreditation = 'Dasar',
    reputation = 0,
    faintedCount = 0,
    day = 90,
} = {}) => ({
    derivedKpis: { clinicalAccuracy: accuracy, rrns },
    player: { profile: { reputation, faintedCount } },
    clinical: { accreditation, history: clinicalHistory },
    publicHealth: { villageData: { families, readinessState } },
    world: { day },
});

// ═══════════════════════════════════════════════════════════════
// 1. REFERRAL GUILLOTINE
// ═══════════════════════════════════════════════════════════════

describe('calculateReferralGuillotine', () => {
    it.each([
        [0, 1.0],
        [3, 1.0],
        [5, 1.0],   // batas Kemenkes — masih full
        [6, 0.95],  // 1% di atas batas
        [10, 0.75],
        [15, 0.5],
        [20, 0.25], // contoh DeepThink: speedrunner
        [25, 0.0],  // hard zero
        [50, 0.0],
        [100, 0.0],
    ])('rrns=%i%% → multiplier=%f', (rrns, expected) => {
        expect(calculateReferralGuillotine(rrns)).toBeCloseTo(expected, 4);
    });

    it('handles invalid input as 0', () => {
        expect(calculateReferralGuillotine(NaN)).toBe(1.0); // 0% rrns = full
        expect(calculateReferralGuillotine(undefined)).toBe(1.0);
    });
});

// ═══════════════════════════════════════════════════════════════
// 2. CLINICAL SCORE
// ═══════════════════════════════════════════════════════════════

describe('calculateClinicalScore', () => {
    it('full marks: 100% akurasi + 0% rrns = 35', () => {
        const r = calculateClinicalScore({ clinicalAccuracy: 100, rrns: 0 });
        expect(r.score).toBeCloseTo(35, 4);
        expect(r.guillotine).toBe(1.0);
    });

    it('over-refer guillotine: akurasi 100% + rrns 25% = 0', () => {
        const r = calculateClinicalScore({ clinicalAccuracy: 100, rrns: 25 });
        expect(r.score).toBe(0);
    });

    it('matches DeepThink contoh "Pemain Kompeten" — 85% × 35 × 1.0 = 29.75', () => {
        const r = calculateClinicalScore({ clinicalAccuracy: 85, rrns: 4 });
        expect(r.score).toBeCloseTo(29.75, 2);
    });

    it('matches DeepThink contoh "Pemain Jahat" — 95% × 35 × 0.25 = 8.31', () => {
        const r = calculateClinicalScore({ clinicalAccuracy: 95, rrns: 20 });
        expect(r.score).toBeCloseTo(8.3125, 2);
    });
});

// ═══════════════════════════════════════════════════════════════
// 3. APATHY COUNTER + COMMUNITY SCORE
// ═══════════════════════════════════════════════════════════════

describe('countApathyEvents', () => {
    it('counts entries with apathyPenalty=true', () => {
        const history = [
            { comBDiagnosis: { apathyPenalty: true } },
            { comBDiagnosis: { apathyPenalty: false } },
            { comBDiagnosis: { apathyPenalty: true } },
            { otherField: 'noise' },
            { behaviorCase: { comBDiagnosis: { apathyPenalty: true } } }, // nested form
        ];
        expect(countApathyEvents(history)).toBe(3);
    });

    it('returns 0 for empty/null', () => {
        expect(countApathyEvents([])).toBe(0);
        expect(countApathyEvents(null)).toBe(0);
        expect(countApathyEvents(undefined)).toBe(0);
    });
});

describe('calculateCommunityScore', () => {
    it('zero families → score 0', () => {
        const r = calculateCommunityScore([], {}, []);
        expect(r.score).toBe(0);
        expect(r.kkSehatPercent).toBe(0);
        expect(r.readinessPercent).toBe(0);
    });

    it('all families IKS 100% + no readiness yet → kkSehat full but readiness 0', () => {
        const families = Array.from({ length: 10 }, (_, i) => buildHealthyFamily(`kk_${i}`));
        const r = calculateCommunityScore(families, {}, []);
        expect(r.kkSehatPercent).toBe(100);
        expect(r.kkSehatPoints).toBe(15);
        expect(r.readinessPercent).toBe(0);
        expect(r.readinessPoints).toBe(0);
        expect(r.score).toBe(15);
    });

    it('apathy events potong UKM secara absolut (-5/event)', () => {
        const families = Array.from({ length: 10 }, (_, i) => buildHealthyFamily(`kk_${i}`));
        const history = [
            { comBDiagnosis: { apathyPenalty: true } },
            { comBDiagnosis: { apathyPenalty: true } },
        ];
        const r = calculateCommunityScore(families, {}, history);
        expect(r.apathyEvents).toBe(2);
        expect(r.apathyPenalty).toBe(10);
        expect(r.score).toBe(15 - 10); // 5
    });

    it('apathy banyak tidak boleh bikin negatif (clamp ke 0)', () => {
        const families = [buildHealthyFamily('kk_01', true)]; // 0 sehat
        const history = Array.from({ length: 20 }, () => ({ comBDiagnosis: { apathyPenalty: true } }));
        const r = calculateCommunityScore(families, {}, history);
        expect(r.score).toBe(0);
    });
});

// ═══════════════════════════════════════════════════════════════
// 4. MANAGEMENT
// ═══════════════════════════════════════════════════════════════

describe('calculateManagementScore', () => {
    it.each(Object.entries(ACCREDITATION_POINTS))(
        'accreditation=%s → score=%i',
        (acc, expected) => {
            expect(calculateManagementScore(acc).score).toBe(expected);
        }
    );

    it('unknown accreditation = 0', () => {
        expect(calculateManagementScore('Aneh').score).toBe(0);
        expect(calculateManagementScore(null).score).toBe(0);
    });
});

// ═══════════════════════════════════════════════════════════════
// 5. RESILIENCE
// ═══════════════════════════════════════════════════════════════

describe('calculateResilienceScore', () => {
    it('reputation 100 + 0 fainted = 15', () => {
        expect(calculateResilienceScore({ reputation: 100, faintedCount: 0 }).score).toBe(15);
    });

    it('reputation 85 + 0 fainted = 12.75', () => {
        expect(calculateResilienceScore({ reputation: 85, faintedCount: 0 }).score).toBeCloseTo(12.75, 4);
    });

    it('reputation 100 − 5 fainted = 15-25 → clamped to 0', () => {
        expect(calculateResilienceScore({ reputation: 100, faintedCount: 5 }).score).toBe(0);
    });

    it('reputation 40 − 0 fainted = 6', () => {
        expect(calculateResilienceScore({ reputation: 40 }).score).toBeCloseTo(6, 4);
    });
});

// ═══════════════════════════════════════════════════════════════
// 6. GRADE
// ═══════════════════════════════════════════════════════════════

describe('gradeFromScore', () => {
    it.each([
        [100, 'A'],
        [85, 'A'],
        [84, 'B'],
        [70, 'B'],
        [69, 'C'],
        [55, 'C'],
        [54, 'D'],
        [0, 'D'],
    ])('score=%i → grade=%s', (score, expected) => {
        expect(gradeFromScore(score).grade).toBe(expected);
    });
});

// ═══════════════════════════════════════════════════════════════
// 7. END-TO-END — DEEPTHINK PROFILES (anti-min-max validation)
// ═══════════════════════════════════════════════════════════════

describe('calculatePerformanceScore — DeepThink profile validation', () => {
    it('Pemain Jahat (Speedrunner) total ≈ 18 → Grade D', () => {
        // 95% akurasi tapi rujuk semua (rrns 20%), apathy 2x, kkSehat 20%, readiness 30%,
        // accreditation Dasar, reputation 40
        const families = Array.from({ length: 100 }, (_, i) =>
            i < 20 ? buildHealthyFamily(`kk_${i}`) : buildHealthyFamily(`kk_${i}`, true)
        );
        const readinessState = {};
        // 30% readiness ≈ stage 'preparation' rata-rata. Approximate dengan 30 keluarga
        // di stage 'preparation' (idx 2 dari 5, total 5-1=4) → score 2/4 = 50%.
        // Untuk dapatkan readiness 30%, kita pakai 30 keluarga stage 'contemplation' (idx 1).
        for (let i = 0; i < 30; i++) {
            readinessState[`kk_${i}`] = {
                stage: 'contemplation',
                familiarity: 30,
                visitCount: 1,
                stageHistory: [{ from: 'precontemplation', to: 'contemplation', day: 5 }],
            };
        }
        const history = [
            { comBDiagnosis: { apathyPenalty: true } },
            { comBDiagnosis: { apathyPenalty: true } },
        ];
        const result = calculatePerformanceScore(buildState({
            accuracy: 95, rrns: 20,
            families, readinessState, clinicalHistory: history,
            accreditation: 'Dasar', reputation: 40, faintedCount: 0,
        }));

        expect(result.ukp.score).toBeCloseTo(8.3125, 2);
        expect(result.management.score).toBe(4);
        expect(result.resilience.score).toBe(6);
        expect(result.total).toBeLessThan(25);
        expect(result.grade.grade).toBe('D');
    });

    it('Pemain Kompeten total ≈ 78 → Grade B', () => {
        // 85% akurasi + rrns 4% (bawah batas), kkSehat 60%, readiness 75%,
        // 0 apathy, accreditation Utama (12), reputation 85, 0 fainted.
        const families = Array.from({ length: 100 }, (_, i) =>
            i < 60 ? buildHealthyFamily(`kk_${i}`) : buildHealthyFamily(`kk_${i}`, true)
        );
        // 75% readiness: rata-rata stage harus tinggi. 100% engaged keluarga di stage 'action' (3/4 = 75%).
        const readinessState = {};
        for (let i = 0; i < 100; i++) {
            readinessState[`kk_${i}`] = {
                stage: 'action',
                familiarity: 70,
                visitCount: 5,
                stageHistory: [{ from: 'preparation', to: 'action', day: 30 }],
            };
        }
        const result = calculatePerformanceScore(buildState({
            accuracy: 85, rrns: 4,
            families, readinessState, clinicalHistory: [],
            accreditation: 'Utama', reputation: 85, faintedCount: 0,
        }));

        expect(result.ukp.score).toBeCloseTo(29.75, 2);
        expect(result.management.score).toBe(12);
        expect(result.resilience.score).toBeCloseTo(12.75, 4);
        expect(result.total).toBeGreaterThan(70);
        expect(result.total).toBeLessThan(85);
        expect(result.grade.grade).toBe('B');
    });

    it('Pemain Teladan ≥85 → Grade A', () => {
        const families = Array.from({ length: 100 }, (_, i) => buildHealthyFamily(`kk_${i}`));
        const readinessState = {};
        for (let i = 0; i < 100; i++) {
            readinessState[`kk_${i}`] = {
                stage: 'maintenance',
                familiarity: 100,
                visitCount: 10,
                stageHistory: [{ from: 'action', to: 'maintenance', day: 60 }],
            };
        }
        const result = calculatePerformanceScore(buildState({
            accuracy: 95, rrns: 3,
            families, readinessState, clinicalHistory: [],
            accreditation: 'Paripurna', reputation: 95, faintedCount: 0,
        }));

        expect(result.total).toBeGreaterThanOrEqual(85);
        expect(result.grade.grade).toBe('A');
    });

    it('handles null/missing state without crashing', () => {
        const result = calculatePerformanceScore(null);
        expect(result.total).toBe(0);
        expect(result.grade.grade).toBe('D');
    });
});

// ═══════════════════════════════════════════════════════════════
// 8. INVARIANTS — total clamp & weight integrity
// ═══════════════════════════════════════════════════════════════

describe('scoringEngine — invariants', () => {
    it('total selalu 0..100', () => {
        const cases = [
            buildState({ accuracy: 0, rrns: 100, accreditation: 'Dasar', reputation: 0, faintedCount: 100 }),
            buildState({ accuracy: 100, rrns: 0, accreditation: 'Paripurna', reputation: 100, faintedCount: 0 }),
            buildState({}),
        ];
        cases.forEach((state) => {
            const r = calculatePerformanceScore(state);
            expect(r.total).toBeGreaterThanOrEqual(0);
            expect(r.total).toBeLessThanOrEqual(100);
        });
    });

    it('SCORE_WEIGHTS jumlah 100', () => {
        const sum = SCORE_WEIGHTS.UKP + SCORE_WEIGHTS.UKM + SCORE_WEIGHTS.MANAGEMENT + SCORE_WEIGHTS.RESILIENCE;
        expect(sum).toBe(100);
    });

    it('GRADE_THRESHOLDS terurut menurun', () => {
        const mins = GRADE_THRESHOLDS.map((t) => t.min);
        expect(mins).toEqual([...mins].sort((a, b) => b - a));
    });
});
