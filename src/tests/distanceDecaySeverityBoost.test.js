import { describe, expect, it } from 'vitest';
import { generatePatient } from '../game/PatientGenerator.js';

describe('Distance Decay -> Severity On Arrival', () => {
    const familyId = 'test_family_1';
    const mockPopulation = {
        villagers: [
            {
                id: 'v1',
                familyId,
                gender: 'L',
                age: 30,
                fullName: 'Test Resident',
                status: 'alive'
            }
        ],
        families: [{ id: familyId }]
    };

    const generateResidentPatient = (
        coords,
        bridgeState = { status: 'normal', severityBoost: 0 },
        serviceAnchors = undefined
    ) =>
        generatePatient(480, mockPopulation, 1, { poli_umum: 1 }, {}, 'stable-seed-1', {
            familyCoords: coords ? { [familyId]: coords } : {},
            bridgeState,
            ...(serviceAnchors ? { serviceAnchors } : {})
        });

    it('mid-distance resident gets +1 severity tier over near baseline', () => {
        const nearPatient = generateResidentPatient({ x: 100, y: 30 });
        const midPatient = generateResidentPatient({ x: 125, y: 30 });

        expect(nearPatient.hidden.risk).toBe('low');
        expect(midPatient.hidden.risk).toBe('medium');
    });

    it('far-distance resident gets +2 severity tiers over near baseline', () => {
        const nearPatient = generateResidentPatient({ x: 100, y: 30 });
        const farPatient = generateResidentPatient({ x: 150, y: 30 });

        expect(nearPatient.hidden.risk).toBe('low');
        expect(farPatient.hidden.risk).toBe('high');
    });

    it('missing family coords preserves baseline risk', () => {
        const baselinePatient = generatePatient(480, mockPopulation, 1, { poli_umum: 1 }, {}, 'stable-seed-1');
        const missingCoordsPatient = generateResidentPatient(null);

        expect(missingCoordsPatient.hidden.risk).toBe(baselinePatient.hidden.risk);
    });

    it('bridge putus stacks on top of distance decay but clamps at high', () => {
        const midDistancePatient = generateResidentPatient({ x: 125, y: 30 });
        const boostedPatient = generateResidentPatient({ x: 125, y: 30 }, { status: 'putus', severityBoost: 1 });

        expect(midDistancePatient.hidden.risk).toBe('medium');
        expect(boostedPatient.hidden.risk).toBe('high');
    });

    it('active pustu anchor reduces distance-decay severity for nearby remote residents', () => {
        const withoutFob = generateResidentPatient({ x: 30, y: 50 });
        const withActivePustu = generateResidentPatient(
            { x: 30, y: 50 },
            { status: 'normal', severityBoost: 0 },
            [
                { id: 'puskesmas', x: 100, y: 30, isActive: true },
                { id: 'pustu', x: 28, y: 50, isActive: true }
            ]
        );

        expect(withoutFob.hidden.risk).toBe('high');
        expect(withActivePustu.hidden.risk).toBe('low');
    });

    it('inactive service anchors preserve existing puskesmas-only behavior', () => {
        const baseline = generateResidentPatient({ x: 30, y: 50 });
        const withInactivePustu = generateResidentPatient(
            { x: 30, y: 50 },
            { status: 'normal', severityBoost: 0 },
            [
                { id: 'puskesmas', x: 100, y: 30, isActive: true },
                { id: 'pustu', x: 28, y: 50, isActive: false }
            ]
        );

        expect(withInactivePustu.hidden.risk).toBe(baseline.hidden.risk);
    });
});
