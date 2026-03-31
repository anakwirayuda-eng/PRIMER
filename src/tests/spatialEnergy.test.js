import { describe, it, expect } from 'vitest';
import { calculateTravelEnergy, calculateTravelEnergyCost } from '../domains/village/spatialEnergy.js';

describe('Geo Law 2b: Distance-based Energy Cost', () => {
    const BASE_COST = 10;

    it('returns exact base cost for Pusat sector (no penalty)', () => {
        // Pusat always returns the base cost because its penalty rate is 0.0
        const cost = calculateTravelEnergy(BASE_COST, 150, 'pusat', 'jalan_kaki');
        expect(cost).toBe(BASE_COST);
    });

    it('applies pure terrain penalty correctly for jalan_kaki', () => {
        // Barat (0.8 penalty), distance 100 (0.5 scale), jalan_kaki (1.0 auth)
        // 10 + (10 * 0.8 * 0.5 * 1.0) = 14
        const cost1 = calculateTravelEnergy(BASE_COST, 100, 'barat', 'jalan_kaki');
        expect(cost1).toBe(14);

        // Selatan (0.6 penalty), distance 200 (1.0 scale), jalan_kaki (1.0 auth)
        // 10 + (10 * 0.6 * 1.0 * 1.0) = 16
        const cost2 = calculateTravelEnergy(BASE_COST, 200, 'selatan', 'jalan_kaki');
        expect(cost2).toBe(16);
    });

    it('applies vehicle mitigation correctly for sepeda, motor_dinas, and puskel', () => {
        // Barat (0.8 penalty), distance 200 (1.0 scale)
        // jalan_kaki (1.0) -> cost 18
        // sepeda (0.6 mitigation factor) -> 0.8 * 0.6 = 0.48 -> cost 14.8
        // motor_dinas (0.2 factor) -> 0.8 * 0.2 = 0.16 -> cost 11.6
        // puskel (0.0 factor) -> cost 10
        
        const costSepeda = calculateTravelEnergy(BASE_COST, 200, 'barat', 'sepeda');
        expect(costSepeda).toBe(14.8);

        const costMotor = calculateTravelEnergy(BASE_COST, 200, 'barat', 'motor_dinas');
        expect(costMotor).toBe(11.6);

        const costPuskel = calculateTravelEnergy(BASE_COST, 200, 'barat', 'puskel');
        expect(costPuskel).toBe(10);
    });

    it('caps distance multiplier to prevent runaway exponential costs', () => {
        // Distance 400 (scale 2.0 capped into 1.0)
        // Barat (0.8) -> max cost is 18 even at huge distances
        const cost = calculateTravelEnergy(BASE_COST, 400, 'barat', 'jalan_kaki');
        expect(cost).toBe(18);
    });

    it('handles invalid sectors, invalid vehicles, and non-positive base cost safely', () => {
        const costZero = calculateTravelEnergy(-5, 100, 'barat', 'jalan_kaki');
        expect(costZero).toBe(0);

        // Unknown sector acts like Pusat (0 penalty)
        const costUnknown = calculateTravelEnergy(BASE_COST, 200, 'unknown_sector', 'jalan_kaki');
        expect(costUnknown).toBe(BASE_COST);

        // Unknown vehicle defaults to jalan_kaki (1.0)
        const costUnknownVehicle = calculateTravelEnergy(BASE_COST, 200, 'barat', 'rocket');
        expect(costUnknownVehicle).toBe(18);
    });

    it('clamps negative distance to zero so cost never drops below base cost', () => {
        const negativeDistance = calculateTravelEnergy(BASE_COST, -50, 'barat', 'jalan_kaki');
        const zeroDistance = calculateTravelEnergy(BASE_COST, 0, 'barat', 'jalan_kaki');

        expect(negativeDistance).toBe(BASE_COST);
        expect(negativeDistance).toBe(zeroDistance);
    });

    it('keeps calculateTravelEnergyCost as an alias for compatibility', () => {
        expect(calculateTravelEnergyCost(BASE_COST, 100, 'barat', 'jalan_kaki')).toBe(
            calculateTravelEnergy(BASE_COST, 100, 'barat', 'jalan_kaki')
        );
    });
});
