import { generateVillageMap } from '../../components/wilayah/map-utils.js';

const spatialContextCache = new WeakMap();

function buildFamilyCoords(buildings = []) {
    const familyCoords = {};

    buildings.forEach((building) => {
        if (building.familyId) {
            familyCoords[building.familyId] = { x: building.x, y: building.y };
        }
    });

    return familyCoords;
}

/**
 * Build a plain-data spatial context for gameplay systems.
 * Cache is keyed by the villageData object identity so new game/load flows
 * naturally invalidate stale topology without recomputing on every spawn.
 */
export function getSpatialContext(villageData) {
    if (!villageData || typeof villageData !== 'object') {
        return null;
    }

    const cached = spatialContextCache.get(villageData);
    if (cached) {
        return cached;
    }

    const mapData = generateVillageMap(160, 120, 12345, villageData);
    const spatialContext = {
        hazardHubs: mapData.hazardHubs || [],
        familyCoords: buildFamilyCoords(mapData.buildings),
    };

    spatialContextCache.set(villageData, spatialContext);
    return spatialContext;
}
