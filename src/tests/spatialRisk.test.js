/**
 * @reflection
 * [IDENTITY]: spatialRisk.test.js
 * [PURPOSE]: Test Geo Law 2 (hazard proximity) and Law 3 (distance decay) in PatientGenerator.
 * [DEPENDS_ON]: PatientGenerator.applySpatialRisk
 */

import { describe, it, expect } from 'vitest';
import { applySpatialRisk, generatePatient } from '../game/PatientGenerator.js';

const MOCK_HAZARD_HUBS = [
    { id: 'sungai_cikapas', type: 'river', x: 150, y: 60, radius: 6, diseases: ['diare', 'tifoid'], multiplier: 3.0 },
    { id: 'hutan_lindung', type: 'forest', x: 8, y: 40, radius: 8, diseases: ['malaria'], multiplier: 3.0 },
];

const BASE_FACILITIES = {
    poli_umum: 1,
    poli_gigi: 1,
    poli_kia_kb: 1,
    igd: 1,
};

const PROFILE_POPULATION = {
    villagers: [
        {
            id: 'v_02_4',
            fullName: 'Mbah Karjo Widodo',
            familyId: 'kk_02',
            houseId: 'house_02',
            status: 'alive',
            gender: 'L',
            age: 78,
            occupation: 'Pensiun',
            sdoh: {
                education: 'Junior High',
                housing: 'Permanent',
                economy: 'Middle',
                smoking: false,
                diet: 'High Sugar',
            },
        },
    ],
    families: [
        {
            id: 'kk_02',
            surname: 'Widodo',
            houseId: 'house_02',
            indicators: {
                jkn: true,
                jentik: true,
                air: true,
                jamban: true,
                rokok: false,
                hipertensi: false,
            },
            iksScore: 0.65,
            members: [
                { id: 'v_02_4', firstName: 'Mbah Karjo', gender: 'L', age: 78 },
            ],
        },
    ],
};

const STOCHASTIC_POPULATION = {
    villagers: [
        {
            id: 'v_spatial_01',
            fullName: 'Asep Rivera',
            familyId: 'kk_risk',
            houseId: 'house_risk',
            status: 'alive',
            gender: 'L',
            age: 52,
            occupation: 'Petani',
            sdoh: {
                education: 'Elementary',
                housing: 'Semi-Permanent',
                economy: 'Low',
                smoking: false,
                diet: 'High Sugar',
            },
        },
    ],
    families: [
        {
            id: 'kk_risk',
            surname: 'Rivera',
            houseId: 'house_risk',
            indicators: {
                jkn: false,
                jentik: false,
                air: false,
                jamban: false,
                rokok: false,
                hipertensi: false,
            },
            iksScore: 0.32,
            members: [
                { id: 'v_spatial_01', firstName: 'Asep', gender: 'L', age: 52 },
            ],
        },
    ],
};

const RIVER_SPATIAL_CONTEXT = {
    hazardHubs: [
        { id: 'sungai_test', type: 'river', x: 40, y: 40, radius: 12, diseases: ['diare', 'tifoid'], multiplier: 4.0 },
    ],
    familyCoords: {
        kk_02: { x: 40, y: 40 },
        kk_risk: { x: 40, y: 40 },
    },
};

function findSeed(label, buildPatient, predicate, maxAttempts = 300) {
    for (let i = 1; i <= maxAttempts; i++) {
        const seed = `${label}-${i}`;
        const patient = buildPatient(seed);
        if (predicate(patient, seed)) {
            return { seed, patient };
        }
    }

    throw new Error(`No deterministic seed found for ${label} within ${maxAttempts} attempts`);
}

describe('Geo Law 2+3: applySpatialRisk', () => {
    // ═══ TEST 1: No spatial context → unchanged behavior ═══
    it('returns empty boosts when familyCoords is null', () => {
        const result = applySpatialRisk(null, MOCK_HAZARD_HUBS);
        expect(result.diseaseBoosts).toEqual({});
        expect(result.debug).toEqual([]);
    });

    it('returns empty boosts when hazardHubs is empty', () => {
        const result = applySpatialRisk({ x: 150, y: 60 }, []);
        expect(result.diseaseBoosts).toEqual({});
        expect(result.debug).toEqual([]);
    });

    it('returns empty boosts when hazardHubs is null', () => {
        const result = applySpatialRisk({ x: 150, y: 60 }, null);
        expect(result.diseaseBoosts).toEqual({});
        expect(result.debug).toEqual([]);
    });

    // ═══ TEST 2: Near hazard > far hazard (proximity boost) ═══
    it('family near river gets water-borne disease boost, far family does not', () => {
        // Family at x=150, y=60 → distance 0 from sungai_cikapas (x=150, y=60)
        const nearResult = applySpatialRisk({ x: 150, y: 60 }, MOCK_HAZARD_HUBS);
        // Family at x=80, y=40 → distance ~74 from sungai_cikapas (way outside radius 6)
        const farResult = applySpatialRisk({ x: 80, y: 40 }, MOCK_HAZARD_HUBS);

        // Near family should have boosts for diare/tifoid cases
        expect(nearResult.diseaseBoosts['acute_gastroenteritis']).toBeGreaterThan(1.0);
        expect(nearResult.diseaseBoosts['typhoid_fever']).toBeGreaterThan(1.0);

        // Far family should have NO boost for those diseases
        expect(farResult.diseaseBoosts['acute_gastroenteritis']).toBeUndefined();
        expect(farResult.diseaseBoosts['typhoid_fever']).toBeUndefined();
    });

    // ═══ TEST 3: Distance decay — effect near > mid > far ═══
    it('multiplier decreases smoothly with distance (quadratic decay)', () => {
        // At center of river hub (dist=0)
        const atCenter = applySpatialRisk({ x: 150, y: 60 }, MOCK_HAZARD_HUBS);
        // At dist=3 from center (half of radius=6)
        const atMid = applySpatialRisk({ x: 153, y: 60 }, MOCK_HAZARD_HUBS);
        // At dist=5 from center (near edge of radius=6)
        const atEdge = applySpatialRisk({ x: 155, y: 60 }, MOCK_HAZARD_HUBS);
        // At dist=7 from center (outside radius=6)
        const outside = applySpatialRisk({ x: 157, y: 60 }, MOCK_HAZARD_HUBS);

        const centerBoost = atCenter.diseaseBoosts['acute_gastroenteritis'] || 1.0;
        const midBoost = atMid.diseaseBoosts['acute_gastroenteritis'] || 1.0;
        const edgeBoost = atEdge.diseaseBoosts['acute_gastroenteritis'] || 1.0;
        const outsideBoost = outside.diseaseBoosts['acute_gastroenteritis'] || 1.0;

        // Strict monotonic decrease: center > mid > edge > outside
        expect(centerBoost).toBeGreaterThan(midBoost);
        expect(midBoost).toBeGreaterThan(edgeBoost);
        expect(edgeBoost).toBeGreaterThan(outsideBoost);
        expect(outsideBoost).toBe(1.0); // outside radius → no effect
    });

    it('multiplier is capped at MAX_COMBINED_MULTIPLIER (5.0)', () => {
        // Create overlapping hazards at same point to test cap
        const overlapping = [
            { id: 'hub1', x: 50, y: 50, radius: 10, diseases: ['diare'], multiplier: 4.0 },
            { id: 'hub2', x: 50, y: 50, radius: 10, diseases: ['diare'], multiplier: 4.0 },
        ];
        const result = applySpatialRisk({ x: 50, y: 50 }, overlapping);
        expect(result.diseaseBoosts['acute_gastroenteritis']).toBeLessThanOrEqual(5.0);
    });

    it('unknown disease keys are safely ignored', () => {
        const hubs = [
            { id: 'test', x: 50, y: 50, radius: 10, diseases: ['unknown_disease_xyz'], multiplier: 3.0 },
        ];
        const result = applySpatialRisk({ x: 50, y: 50 }, hubs);
        expect(result.diseaseBoosts).toEqual({});
        expect(result.debug).toHaveLength(1);
        expect(result.debug[0].affectedCases).toEqual([]);
    });

    it('debug metadata includes hazardId, distance, decay, and affectedCases', () => {
        const result = applySpatialRisk({ x: 150, y: 60 }, MOCK_HAZARD_HUBS);
        const riverDebug = result.debug.find(d => d.hazardId === 'sungai_cikapas');
        expect(riverDebug).toBeDefined();
        expect(riverDebug.distance).toBe(0);
        expect(riverDebug.decay).toBe(1);
        expect(riverDebug.appliedMultiplier).toBe(3);
        expect(riverDebug.affectedCases).toContain('acute_gastroenteritis');
        expect(riverDebug.affectedCases).toContain('typhoid_fever');
    });
});

describe('Geo Law 2+3 integration in generatePatient', () => {
    it('keeps behavior unchanged when spatial context is missing', () => {
        const { seed } = findSeed(
            'no-spatial',
            (s) => generatePatient(480, STOCHASTIC_POPULATION, 1, BASE_FACILITIES, {}, s),
            (patient) => patient.social?.isResident && patient.hidden?.familyId === 'kk_risk'
        );

        const withoutSpatial = generatePatient(480, STOCHASTIC_POPULATION, 1, BASE_FACILITIES, {}, seed);
        const withEmptySpatial = generatePatient(
            480,
            STOCHASTIC_POPULATION,
            1,
            BASE_FACILITIES,
            {},
            seed,
            { hazardHubs: [], familyCoords: {} }
        );

        expect(withEmptySpatial.hidden.diseaseId).toBe(withoutSpatial.hidden.diseaseId);
        expect(withEmptySpatial.complaint).toBe(withoutSpatial.complaint);
        expect(withEmptySpatial.hidden.spatialRisk).toBeNull();
    });

    it('does not let spatial risk override profile-driven cases', () => {
        const profileOnlyCaseIds = ['hypertensive_crisis', 'dm_complicated', 'lbp_mechanical'];
        const { seed, patient: baseline } = findSeed(
            'profile-guard',
            (s) => generatePatient(480, PROFILE_POPULATION, 1, BASE_FACILITIES, {}, s),
            (patient) =>
                patient.social?.isResident &&
                patient.hidden?.familyId === 'kk_02' &&
                profileOnlyCaseIds.includes(patient.hidden?.diseaseId)
        );

        const withSpatial = generatePatient(
            480,
            PROFILE_POPULATION,
            1,
            BASE_FACILITIES,
            {},
            seed,
            RIVER_SPATIAL_CONTEXT
        );

        expect(withSpatial.hidden.diseaseId).toBe(baseline.hidden.diseaseId);
        expect(withSpatial.hidden.spatialRisk).toBeNull();
    });

    it('records spatial debug metadata for stochastic resident cases', () => {
        const { seed } = findSeed(
            'stochastic-debug',
            (s) => generatePatient(480, STOCHASTIC_POPULATION, 1, BASE_FACILITIES, {}, s),
            (patient) => patient.social?.isResident && patient.hidden?.familyId === 'kk_risk'
        );

        const withSpatial = generatePatient(
            480,
            STOCHASTIC_POPULATION,
            1,
            BASE_FACILITIES,
            {},
            seed,
            RIVER_SPATIAL_CONTEXT
        );

        expect(Array.isArray(withSpatial.hidden.spatialRisk)).toBe(true);
        expect(withSpatial.hidden.spatialRisk[0].hazardId).toBe('sungai_test');
        expect(withSpatial.hidden.spatialRisk[0].affectedCases).toContain('acute_gastroenteritis');
    });
});
