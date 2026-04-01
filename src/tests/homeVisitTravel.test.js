import { describe, expect, it } from 'vitest';
import {
    buildHomeVisitServiceAnchors,
    getBestUnlockedVillageVehicle,
    resolveHomeVisitTravelState
} from '../domains/village/homeVisitTravel.js';

describe('home visit travel energy', () => {
    it('falls back to puskesmas baseline when target coords are missing', () => {
        const result = resolveHomeVisitTravelState(10, null, {
            day: 1,
            balance: 0,
            buildingProgress: {}
        });

        expect(result.effectiveEnergy).toBe(10);
        expect(result.usedFallback).toBe(true);
        expect(result.isBlocked).toBe(false);
    });

    it('uses active FOB anchors to reduce nearby home-visit travel cost', () => {
        const withoutFob = resolveHomeVisitTravelState(12, { x: 30, y: 50 }, {
            day: 1,
            balance: 0,
            buildingProgress: {}
        });
        const withPustu = resolveHomeVisitTravelState(12, { x: 30, y: 50 }, {
            day: 1,
            balance: 0,
            buildingProgress: { pustu: { completed: true } }
        });

        expect(withPustu.anchorId).toBe('pustu');
        expect(withPustu.effectiveEnergy).toBeLessThan(withoutFob.effectiveEnergy);
    });

    it('uses the best unlocked vehicle to reduce travel penalty', () => {
        const walking = resolveHomeVisitTravelState(12, { x: 140, y: 50 }, {
            day: 1,
            balance: 0,
            buildingProgress: {}
        });
        const motor = resolveHomeVisitTravelState(12, { x: 140, y: 50 }, {
            day: 60,
            balance: 3000000,
            buildingProgress: {}
        });

        expect(walking.vehicle).toBe('jalan_kaki');
        expect(motor.vehicle).toBe('motor_dinas');
        expect(motor.effectiveEnergy).toBeLessThan(walking.effectiveEnergy);
    });

    it('blocks east-sector visits when the bridge is putus', () => {
        const result = resolveHomeVisitTravelState(10, { x: 130, y: 50 }, {
            day: 10,
            balance: 0,
            buildingProgress: {},
            bridgeState: { status: 'putus' }
        });

        expect(result.isBlocked).toBe(true);
        expect(result.blockedReason).toBe('Jembatan Putus');
    });

    it('never blocks west-side visits during bridge outage', () => {
        const result = resolveHomeVisitTravelState(10, { x: 90, y: 50 }, {
            day: 10,
            balance: 0,
            buildingProgress: {},
            bridgeState: { status: 'putus' }
        });

        expect(result.isBlocked).toBe(false);
        expect(result.effectiveEnergy).toBeGreaterThanOrEqual(10);
    });

    it('builds anchors defensively even when progress shape is missing', () => {
        const anchors = buildHomeVisitServiceAnchors();

        expect(anchors).toHaveLength(3);
        expect(anchors[0]).toMatchObject({ id: 'puskesmas', isActive: true });
        expect(anchors[1].isActive).toBe(false);
        expect(anchors[2].isActive).toBe(false);
    });

    it('falls back to jalan_kaki when no vehicle is unlocked', () => {
        expect(getBestUnlockedVillageVehicle(-1, -1)).toBe('jalan_kaki');
    });
});
