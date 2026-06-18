import { describe, it, expect } from 'vitest';
import {
    AUSCULTATION_CLIPS,
    AUSCULTATION_CHOICES,
    AUSCULTATION_EXPLAIN,
    buildAuscultationRound,
} from '../data/auscultationClips.js';

// Deterministic RNG for reproducible round assertions.
function seededRng(seed) {
    let s = seed >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 0xffffffff;
    };
}

// Authoritative ground truth from PhysioNet/CinC 2016 training-a/REFERENCE.csv
// (-1 = normal, 1 = abnormal), verified 2026-06-18. Pinned so a mislabel can
// never silently ship — this is a medical-education correctness guard.
const REFERENCE_TRUTH = {
    a0007: 'normal', a0009: 'normal', a0011: 'normal', a0012: 'normal',
    a0016: 'normal', a0019: 'normal', a0025: 'normal', a0027: 'normal', a0035: 'normal',
    a0001: 'abnormal', a0002: 'abnormal', a0003: 'abnormal', a0005: 'abnormal',
    a0013: 'abnormal', a0020: 'abnormal', a0022: 'abnormal', a0031: 'abnormal', a0042: 'abnormal',
};

describe('auscultationClips data', () => {
    it('every clip answer matches the authoritative REFERENCE.csv label', () => {
        for (const clip of AUSCULTATION_CLIPS) {
            expect(REFERENCE_TRUTH[clip.id], `clip ${clip.id} must exist in REFERENCE truth`).toBeTruthy();
            expect(clip.answer, `clip ${clip.id} answer must match REFERENCE.csv`).toBe(REFERENCE_TRUTH[clip.id]);
        }
    });

    it('every clip has a valid answer + path', () => {
        const answers = new Set(AUSCULTATION_CHOICES.map(c => c.id));
        for (const clip of AUSCULTATION_CLIPS) {
            expect(answers.has(clip.answer)).toBe(true);
            expect(clip.src).toMatch(/^\/audio\/auscultation\/.+\.wav$/);
            expect(AUSCULTATION_EXPLAIN[clip.answer]).toBeTruthy();
        }
    });

    it('has both normal and abnormal exemplars', () => {
        const normals = AUSCULTATION_CLIPS.filter(c => c.answer === 'normal');
        const abnormals = AUSCULTATION_CLIPS.filter(c => c.answer === 'abnormal');
        expect(normals.length).toBeGreaterThanOrEqual(4);
        expect(abnormals.length).toBeGreaterThanOrEqual(4);
    });
});

describe('buildAuscultationRound', () => {
    it('returns the requested count', () => {
        expect(buildAuscultationRound(8, seededRng(1))).toHaveLength(8);
        expect(buildAuscultationRound(4, seededRng(2))).toHaveLength(4);
    });

    it('is balanced (≈half normal, half abnormal) for an even count', () => {
        const round = buildAuscultationRound(8, seededRng(3));
        const normals = round.filter(c => c.answer === 'normal').length;
        const abnormals = round.filter(c => c.answer === 'abnormal').length;
        expect(normals).toBe(4);
        expect(abnormals).toBe(4);
    });

    it('contains no duplicate clips', () => {
        const round = buildAuscultationRound(8, seededRng(4));
        const ids = round.map(c => c.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('is deterministic for a fixed seed', () => {
        const a = buildAuscultationRound(8, seededRng(42)).map(c => c.id);
        const b = buildAuscultationRound(8, seededRng(42)).map(c => c.id);
        expect(a).toEqual(b);
    });
});
