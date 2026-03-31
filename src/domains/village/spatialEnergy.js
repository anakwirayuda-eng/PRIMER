/**
 * spatialEnergy.js
 * 
 * Pure functions for calculating energy map cost based on distance,
 * terrain, and vehicle mitigation.
 */

const GRID_DIAGONAL = 200.0; // Approximation of 160x120 grid traversal

export const TERRAIN_PENALTY = {
    'pusat': 0.0,    // No penalty (paved hub)
    'utara': 0.3,    // Trans road corridor (easy)
    'timur': 0.5,    // Riverside mud (moderate)
    'selatan': 0.6,  // Rice fields (moderate-hard)
    'barat': 0.8     // Forest (hard)
};

export const VEHICLE_MITIGATION = {
    'jalan_kaki':   1.0, // 100% penalty
    'sepeda':       0.6, // 60% penalty
    'motor_dinas':  0.2, // 20% penalty
    'puskel':       0.0  // 0% penalty (immune to terrain)
};

/**
 * Calculates the travel energy cost based on terrain, distance, and vehicle.
 * 
 * @param {number} baseCost - The base energy cost of a home visit
 * @param {number} distance - Manhattan distance to the destination
 * @param {string} terrainSector - The sector key ('pusat', 'utara', 'timur', 'selatan', 'barat')
 * @param {string} vehicle - The vehicle key ('jalan_kaki', 'sepeda', 'motor_dinas', 'puskel')
 * @returns {number} The finalized energy cost (rounded to 1 decimal place to prevent floating point drift)
 */
export function calculateTravelEnergy(baseCost, distance, terrainSector, vehicle = 'jalan_kaki') {
    if (baseCost <= 0) return 0;

    const penaltyRate = TERRAIN_PENALTY[terrainSector] ?? 0.0;
    const mitigationRate = VEHICLE_MITIGATION[vehicle] ?? 1.0;
    const safeDistance = Math.max(0, distance);

    // Cap distance scaling to prevent runaway exponential costs (max 1.0)
    const distanceScale = Math.min(safeDistance / GRID_DIAGONAL, 1.0);

    const effectivePenalty = distanceScale * penaltyRate * mitigationRate;
    const finalCost = baseCost * (1.0 + effectivePenalty);

    // Round to 1 decimal place to ensure deterministic deterministic behavior
    return Math.round(finalCost * 10) / 10;
}

export const calculateTravelEnergyCost = calculateTravelEnergy;
