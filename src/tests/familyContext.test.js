import { describe, expect, it } from 'vitest';
import {
    resolvePatientFamilyId,
    getFamilyContextForPatient,
    deriveSdohTeachingNotes,
} from '../utils/familyContext.js';

const buildFamily = (id, overrides = {}) => ({
    id,
    surname: 'Test',
    rt: '01',
    rw: '01',
    members: [
        { role: 'head', firstName: 'H', gender: 'L', age: 40 },
        { role: 'spouse', firstName: 'S', gender: 'P', age: 35 },
        { role: 'child', firstName: 'C', gender: 'L', age: 3 },
    ],
    indicators: {
        kb: true, persalinan: true, imunisasi: true, asi: true, balita: true,
        tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true,
        air: true, jamban: true, jentik: true,
    },
    sdoh: { economy: 'Middle', housing: 'Permanent' },
    ...overrides,
});

const buildLedger = (entries) => entries.map((e, i) => ({ at: 1000 + i, ...e }));

describe('familyContext — resolvePatientFamilyId', () => {
    it('prefers social.familyId when present', () => {
        const patient = { social: { familyId: 'kk_07' }, hidden: { familyId: 'kk_99' } };
        expect(resolvePatientFamilyId(patient)).toBe('kk_07');
    });
    it('falls back to hidden.familyId', () => {
        const patient = { hidden: { familyId: 'kk_42' } };
        expect(resolvePatientFamilyId(patient)).toBe('kk_42');
    });
    it('returns null when neither present', () => {
        expect(resolvePatientFamilyId({ social: {}, hidden: {} })).toBe(null);
        expect(resolvePatientFamilyId(null)).toBe(null);
    });
});

describe('familyContext — getFamilyContextForPatient', () => {
    const villageData = {
        families: [buildFamily('kk_01'), buildFamily('kk_02', { indicators: { jkn: false, jamban: false, air: true, rokok: false, tb: true, hipertensi: true, jiwa: true, jentik: true, kb: true, imunisasi: true, asi: true, balita: true, persalinan: true }, sdoh: { economy: 'Low', housing: 'Make-shift' } })],
    };

    it('returns null when patient has no family linkage', () => {
        const ctx = getFamilyContextForPatient({ social: {} }, villageData, []);
        expect(ctx).toBe(null);
    });

    it('returns null when family id is not in villageData', () => {
        const ctx = getFamilyContextForPatient({ social: { familyId: 'kk_999' } }, villageData, []);
        expect(ctx).toBe(null);
    });

    it('resolves a healthy family into sehat tier with no risk flags', () => {
        const patient = { social: { familyId: 'kk_01' } };
        const ctx = getFamilyContextForPatient(patient, villageData, []);
        expect(ctx).not.toBe(null);
        expect(ctx.familyId).toBe('kk_01');
        expect(ctx.tier).toBe('sehat');
        expect(ctx.pisPk.iks).toBe(1);
        expect(ctx.riskFlags).toEqual([]);
    });

    it('flags SDOH + indicator gaps for a struggling family', () => {
        const patient = { hidden: { familyId: 'kk_02' } };
        const ctx = getFamilyContextForPatient(patient, villageData, []);
        expect(ctx).not.toBe(null);
        expect(ctx.tier).not.toBe('sehat');
        const flagIds = ctx.riskFlags.map((r) => r.id);
        expect(flagIds).toContain('no_jkn');
        expect(flagIds).toContain('no_jamban');
        expect(flagIds).toContain('perokok');
        expect(flagIds).toContain('ekonomi');
        expect(flagIds).toContain('rumah');
    });

    it('collects ledger entries sorted by day desc', () => {
        const ledger = buildLedger([
            { familyId: 'kk_01', type: 'home_visit', day: 3, details: { actionLabel: 'Edukasi KB' } },
            { familyId: 'kk_01', type: 'immunization', day: 7, details: { actionLabel: 'DPT-HB-Hib' } },
            { familyId: 'kk_02', type: 'home_visit', day: 5 }, // noise: different family
            { familyId: 'kk_01', type: 'prolanis', day: 5 },
        ]);
        const ctx = getFamilyContextForPatient({ social: { familyId: 'kk_01' } }, villageData, ledger);
        expect(ctx.recentVisits.length).toBe(3);
        expect(ctx.recentVisits.map((v) => v.day)).toEqual([7, 5, 3]);
        expect(ctx.recentVisits[0].label).toBe('Imunisasi');
        expect(ctx.recentVisits[0].actionLabel).toBe('DPT-HB-Hib');
    });

    it('truncates ledger to the last 5 visits', () => {
        const ledger = buildLedger(
            Array.from({ length: 10 }, (_, i) => ({ familyId: 'kk_01', type: 'home_visit', day: i + 1 }))
        );
        const ctx = getFamilyContextForPatient({ social: { familyId: 'kk_01' } }, villageData, ledger);
        expect(ctx.recentVisits.length).toBe(5);
        expect(ctx.recentVisits[0].day).toBe(10);
    });

    it('surfaces a UKP-bridged scenario with outcomeBadge=bridged_from_fail', () => {
        const patient = {
            social: { familyId: 'kk_01' },
            hidden: { familyId: 'kk_01', bcScenarioId: 'bc_scabies_outbreak', isBCBridge: true },
        };
        const scenarios = { byId: { bc_scabies_outbreak: { title: 'Wabah Kudis di RT 03' } } };
        const ctx = getFamilyContextForPatient(patient, villageData, [], { scenarios });
        expect(ctx.linkedBcCase).not.toBe(null);
        expect(ctx.linkedBcCase.scenarioId).toBe('bc_scabies_outbreak');
        expect(ctx.linkedBcCase.title).toBe('Wabah Kudis di RT 03');
        expect(ctx.linkedBcCase.outcomeBadge).toBe('bridged_from_fail');
        expect(ctx.linkedBcCase.isBridge).toBe(true);
    });

    it('falls back to family.activeScenarioId when patient is not a bridge', () => {
        const village = {
            families: [buildFamily('kk_05', { activeScenarioId: 'bc_scabies_outbreak' })],
        };
        const patient = { social: { familyId: 'kk_05' } };
        const ctx = getFamilyContextForPatient(patient, village, []);
        expect(ctx.linkedBcCase?.scenarioId).toBe('bc_scabies_outbreak');
        expect(ctx.linkedBcCase?.outcomeBadge).toBe('active');
        expect(ctx.linkedBcCase?.isBridge).toBe(false);
    });

    it('uses id as title fallback when scenarios catalog is absent', () => {
        const patient = { hidden: { familyId: 'kk_01', bcScenarioId: 'bc_anything' } };
        const ctx = getFamilyContextForPatient(patient, villageData, []);
        expect(ctx.linkedBcCase.title).toBe('bc_anything');
    });
});

describe('familyContext — deriveSdohTeachingNotes', () => {
    it('returns [] for null/empty context', () => {
        expect(deriveSdohTeachingNotes(null)).toEqual([]);
        expect(deriveSdohTeachingNotes({})).toEqual([]);
        expect(deriveSdohTeachingNotes({ riskFlags: [] })).toEqual([]);
    });

    it('maps each known risk flag to an actionable teaching note', () => {
        const ctx = {
            riskFlags: [
                { id: 'no_jkn', label: 'Tanpa JKN', severity: 'warning' },
                { id: 'no_jamban', label: 'Jamban tidak sehat', severity: 'warning' },
                { id: 'ekonomi', label: 'Ekonomi rendah', severity: 'danger' },
            ],
        };
        const notes = deriveSdohTeachingNotes(ctx);
        expect(notes.length).toBe(3);
        const ids = notes.map((n) => n.id);
        expect(ids).toContain('no_jkn');
        expect(ids).toContain('no_jamban');
        expect(ids).toContain('ekonomi');
        notes.forEach((n) => {
            expect(typeof n.note).toBe('string');
            expect(n.note.length).toBeGreaterThan(20);
            expect(['warning', 'danger']).toContain(n.severity);
        });
    });

    it('skips unknown risk flag ids (defensive)', () => {
        const ctx = {
            riskFlags: [
                { id: 'no_jkn', label: 'Tanpa JKN', severity: 'warning' },
                { id: 'made_up_flag', label: 'Unknown', severity: 'warning' },
            ],
        };
        const notes = deriveSdohTeachingNotes(ctx);
        expect(notes.length).toBe(1);
        expect(notes[0].id).toBe('no_jkn');
    });

    it('teaching notes are doctor-actionable (mentions konkret action verbs)', () => {
        const ctx = {
            riskFlags: [
                { id: 'no_jamban', label: 'Jamban tidak sehat', severity: 'warning' },
                { id: 'perokok', label: 'Ada perokok', severity: 'warning' },
            ],
        };
        const notes = deriveSdohTeachingNotes(ctx);
        // Notes should mention concrete actions, not just describe the risk.
        expect(notes[0].note).toMatch(/edukasi|skrining|rujuk/i);
        expect(notes[1].note).toMatch(/skrining|konseling/i);
    });
});
