import { calculateTravelEnergy, getSectorFromCoords } from './spatialEnergy.js';
import { getEffectiveServiceDistance } from './serviceDistance.js';
import { getUnlockedVehicles } from './vehicleProgression.js';

export const HOME_VISIT_SERVICE_ANCHORS = {
    puskesmas: { id: 'puskesmas', x: 100, y: 30, isActive: true },
    pustu: { id: 'pustu', x: 28, y: 50 },
    polindes: { id: 'polindes', x: 25, y: 95 }
};

export function buildHomeVisitServiceAnchors(buildingProgress = {}) {
    return [
        HOME_VISIT_SERVICE_ANCHORS.puskesmas,
        {
            ...HOME_VISIT_SERVICE_ANCHORS.pustu,
            isActive: Boolean(buildingProgress?.pustu?.completed || buildingProgress?.fob?.completed)
        },
        {
            ...HOME_VISIT_SERVICE_ANCHORS.polindes,
            isActive: Boolean(buildingProgress?.polindes?.completed || buildingProgress?.fob?.completed)
        }
    ];
}

export function getBestUnlockedVillageVehicle(day, balance) {
    const safeDay = Number.isFinite(Number(day)) ? Number(day) : 0;
    const safeBalance = Number.isFinite(Number(balance)) ? Number(balance) : 0;
    const unlockedVehicles = getUnlockedVehicles(safeDay, safeBalance);
    return unlockedVehicles.length > 0
        ? unlockedVehicles[unlockedVehicles.length - 1]
        : 'jalan_kaki';
}

export function resolveHomeVisitTravelState(baseEnergy, targetCoords, options = {}) {
    const safeBaseEnergy = Number(baseEnergy);
    const x = Number(targetCoords?.x);
    const y = Number(targetCoords?.y);
    const bridgeStatus = options?.bridgeState?.status;
    const balance = Number.isFinite(Number(options?.balance)) ? Number(options.balance) : 0;
    const day = Number.isFinite(Number(options?.day)) ? Number(options.day) : 0;
    const vehicle = getBestUnlockedVillageVehicle(day, balance);

    if (!Number.isFinite(safeBaseEnergy) || safeBaseEnergy <= 0) {
        return {
            effectiveEnergy: 0,
            isBlocked: false,
            blockedReason: null,
            anchorId: null,
            distance: 0,
            sector: 'pusat',
            vehicle,
            usedFallback: true
        };
    }

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return {
            effectiveEnergy: safeBaseEnergy,
            isBlocked: false,
            blockedReason: null,
            anchorId: null,
            distance: 0,
            sector: 'pusat',
            vehicle,
            usedFallback: true
        };
    }

    const sector = getSectorFromCoords(x, y);
    if (bridgeStatus === 'putus' && x >= 120) {
        return {
            effectiveEnergy: safeBaseEnergy,
            isBlocked: true,
            blockedReason: 'Jembatan Putus',
            anchorId: null,
            distance: Infinity,
            sector,
            vehicle,
            usedFallback: false
        };
    }

    const anchors = buildHomeVisitServiceAnchors(options?.buildingProgress);
    const { anchorId, distance } = getEffectiveServiceDistance({ x, y }, anchors);
    const safeDistance = Number.isFinite(distance) ? distance : 0;

    return {
        effectiveEnergy: calculateTravelEnergy(safeBaseEnergy, safeDistance, sector, vehicle),
        isBlocked: false,
        blockedReason: null,
        anchorId,
        distance: safeDistance,
        sector,
        vehicle,
        usedFallback: false
    };
}
