import { BUILDING_TYPES, TILE_TYPES } from './constants.js';

const SECTOR_LABELS = {
    pusat: 'Sektor Pusat',
    utara: 'Sektor Utara',
    barat: 'Sektor Barat',
    timur: 'Sektor Timur',
    selatan: 'Sektor Selatan',
};

const DEFAULT_SECTOR_BOUNDS = {
    pusat: { minX: 50, maxX: 120, minY: 5, maxY: 45 },
    utara: { minX: 15, maxX: 145, minY: 20, maxY: 28 },
    barat: { minX: 0, maxX: 40, minY: 0, maxY: 80 },
    timur: { minX: 120, maxX: 159, minY: 0, maxY: 80 },
    selatan: { minX: 15, maxX: 140, minY: 82, maxY: 119 },
};

const DEFAULT_MARGIN_BY_SCOPE = {
    rw: 8,
    building: 6,
    sector: 3,
};

const NARRATIVE_BUILDING_TYPES = new Set([
    BUILDING_TYPES.PESANTREN,
    BUILDING_TYPES.PADEPOKAN_DUKUN,
    BUILDING_TYPES.PASAR_HEWAN,
    BUILDING_TYPES.POS_RONDA,
    BUILDING_TYPES.JEMBATAN,
    BUILDING_TYPES.HUTAN_LINDUNG,
    BUILDING_TYPES.SUNGAI_CIKAPAS,
    BUILDING_TYPES.DERMAGA,
    BUILDING_TYPES.INFO_WISATA,
    BUILDING_TYPES.GARDU_PANDANG,
    BUILDING_TYPES.HOMESTAY,
    BUILDING_TYPES.WATERFALL,
]);

function padRwId(value) {
    if (value == null) return null;
    const digits = String(value).replace(/\D/g, '');
    if (!digits) return null;
    return digits.padStart(2, '0').slice(-2);
}

function inferRwIdFromBuilding(building) {
    if (!building) return null;

    const explicitRw = padRwId(building.rw || building.familyData?.rw);
    if (explicitRw) return explicitRw;

    const idMatch = /(?:^|[_-])rw(?:[_-]?)(\d{1,2})(?:$|[_-])/i.exec(building.id || '');
    if (idMatch?.[1]) return padRwId(idMatch[1]);

    const nameMatch = /\bRW\s*0?(\d{1,2})\b/i.exec(building.name || '');
    if (nameMatch?.[1]) return padRwId(nameMatch[1]);

    return null;
}

function getSectorBounds(mapData) {
    return mapData?.sectorBounds || DEFAULT_SECTOR_BOUNDS;
}

function getSectorKeyForCoords(x, y, mapData) {
    const sectorBounds = getSectorBounds(mapData);
    for (const [sectorKey, bounds] of Object.entries(sectorBounds)) {
        if (
            x >= bounds.minX && x <= bounds.maxX &&
            y >= bounds.minY && y <= bounds.maxY
        ) {
            return sectorKey;
        }
    }
    return 'pusat';
}

function isTileMatrixValid(tiles, width, height) {
    return Array.isArray(tiles) && width > 0 && height > 0;
}

function humanizeType(type) {
    return (type || 'bangunan').replace(/_/g, ' ');
}

function toBoundsFromPoint(x, y, radius = 4) {
    return {
        minX: x - radius,
        maxX: x + radius,
        minY: y - radius,
        maxY: y + radius,
    };
}

function boundsFromBuildings(buildings) {
    if (!Array.isArray(buildings) || buildings.length === 0) return null;

    return buildings.reduce((acc, building) => ({
        minX: Math.min(acc.minX, building.x),
        maxX: Math.max(acc.maxX, building.x),
        minY: Math.min(acc.minY, building.y),
        maxY: Math.max(acc.maxY, building.y),
    }), {
        minX: buildings[0].x,
        maxX: buildings[0].x,
        minY: buildings[0].y,
        maxY: buildings[0].y,
    });
}

function expandBounds(bounds, margin, mapData) {
    if (!bounds) return null;

    const width = mapData?.width || 0;
    const height = mapData?.height || 0;

    return {
        minX: Math.max(0, bounds.minX - margin),
        maxX: Math.min(width - 1, bounds.maxX + margin),
        minY: Math.max(0, bounds.minY - margin),
        maxY: Math.min(height - 1, bounds.maxY + margin),
    };
}

function withinBounds(building, bounds) {
    if (!building || !bounds) return false;
    return (
        building.x >= bounds.minX &&
        building.x <= bounds.maxX &&
        building.y >= bounds.minY &&
        building.y <= bounds.maxY
    );
}

function dedupeBuildings(buildings) {
    const byId = new Map();
    (buildings || []).forEach((building) => {
        if (!building) return;
        const key = building.id || `${building.type}:${building.x}:${building.y}`;
        if (!byId.has(key)) byId.set(key, building);
    });
    return Array.from(byId.values());
}

function remapBuildingToPocket(building, bounds) {
    return {
        ...building,
        x: building.x - bounds.minX,
        y: building.y - bounds.minY,
        worldX: building.x,
        worldY: building.y,
    };
}

function cropTiles(tiles, bounds) {
    return tiles
        .slice(bounds.minY, bounds.maxY + 1)
        .map((row) => row.slice(bounds.minX, bounds.maxX + 1));
}

function countByKind(buildings) {
    const houseCount = buildings.filter((building) => !!building.familyId).length;
    return {
        buildingCount: buildings.length,
        houseCount,
        facilityCount: buildings.length - houseCount,
    };
}

function resolveScopeCenter(mapData, scope, primaryBounds, sourceBuilding) {
    if (scope?.kind === 'rw' && scope.id && mapData?.rwCenters?.[scope.id]) {
        return mapData.rwCenters[scope.id];
    }

    if (scope?.kind === 'sector' && scope.id) {
        const sectorBounds = getSectorBounds(mapData)[scope.id];
        if (sectorBounds) {
            return {
                x: (sectorBounds.minX + sectorBounds.maxX) / 2,
                y: (sectorBounds.minY + sectorBounds.maxY) / 2,
            };
        }
    }

    if (sourceBuilding && Number.isFinite(sourceBuilding.x) && Number.isFinite(sourceBuilding.y)) {
        return { x: sourceBuilding.x, y: sourceBuilding.y };
    }

    if (primaryBounds) {
        return {
            x: (primaryBounds.minX + primaryBounds.maxX) / 2,
            y: (primaryBounds.minY + primaryBounds.maxY) / 2,
        };
    }

    return {
        x: (mapData?.centerX ?? 0),
        y: (mapData?.centerY ?? 0),
    };
}

export function resolveInspectorScope(selectedBuilding, mapData) {
    if (!selectedBuilding) return null;

    const sourceBuildingId = selectedBuilding.id || null;
    const sourceBuildingName = selectedBuilding.name || humanizeType(selectedBuilding.type);
    const sectorKey = Number.isFinite(selectedBuilding.x) && Number.isFinite(selectedBuilding.y)
        ? getSectorKeyForCoords(selectedBuilding.x, selectedBuilding.y, mapData)
        : null;
    const rwId = inferRwIdFromBuilding(selectedBuilding);

    if (selectedBuilding.scopeKind && selectedBuilding.scopeId) {
        return {
            kind: selectedBuilding.scopeKind,
            id: selectedBuilding.scopeId,
            label: selectedBuilding.scopeLabel || selectedBuilding.scopeId,
            sectorKey,
            sourceBuildingId,
            sourceBuildingName,
        };
    }

    if (rwId) {
        return {
            kind: 'rw',
            id: rwId,
            label: `RW ${rwId}`,
            sectorKey,
            sourceBuildingId,
            sourceBuildingName,
        };
    }

    if (selectedBuilding.id && NARRATIVE_BUILDING_TYPES.has(selectedBuilding.type)) {
        return {
            kind: 'building',
            id: selectedBuilding.id,
            label: sourceBuildingName,
            sectorKey,
            sourceBuildingId,
            sourceBuildingName,
        };
    }

    if (sectorKey) {
        return {
            kind: 'sector',
            id: sectorKey,
            label: SECTOR_LABELS[sectorKey] || sectorKey,
            sectorKey,
            sourceBuildingId,
            sourceBuildingName,
        };
    }

    return {
        kind: 'building',
        id: selectedBuilding.id || sourceBuildingName,
        label: sourceBuildingName,
        sectorKey: null,
        sourceBuildingId,
        sourceBuildingName,
    };
}

export function buildPocketDioramaData(mapData, scope) {
    if (!mapData || !scope || !isTileMatrixValid(mapData.tiles, mapData.width, mapData.height)) {
        return null;
    }

    const allBuildings = Array.isArray(mapData.buildings) ? mapData.buildings : [];
    const sourceBuilding = scope.sourceBuildingId
        ? allBuildings.find((building) => building.id === scope.sourceBuildingId) || null
        : null;

    let primaryBuildings = [];
    let primaryBounds = null;

    if (scope.kind === 'rw') {
        primaryBuildings = allBuildings.filter((building) => inferRwIdFromBuilding(building) === scope.id);
        primaryBounds = boundsFromBuildings(primaryBuildings);
        if (!primaryBounds && mapData.rwCenters?.[scope.id]) {
            const center = mapData.rwCenters[scope.id];
            primaryBounds = toBoundsFromPoint(center.x, center.y, 6);
        }
    } else if (scope.kind === 'building') {
        primaryBuildings = sourceBuilding ? [sourceBuilding] : [];
        primaryBounds = sourceBuilding
            ? toBoundsFromPoint(sourceBuilding.x, sourceBuilding.y, 4)
            : null;
    } else if (scope.kind === 'sector') {
        const sectorBounds = getSectorBounds(mapData)[scope.id];
        primaryBounds = sectorBounds || null;
        primaryBuildings = sectorBounds
            ? allBuildings.filter((building) => withinBounds(building, sectorBounds))
            : [];
    }

    const margin = DEFAULT_MARGIN_BY_SCOPE[scope.kind] ?? 6;
    const finalBounds = expandBounds(primaryBounds, margin, mapData);
    if (!finalBounds) return null;

    let contextualBuildings = [];
    if (scope.kind === 'rw') {
        contextualBuildings = allBuildings.filter((building) => !building.familyId && withinBounds(building, finalBounds));
    } else if (scope.kind === 'building') {
        contextualBuildings = allBuildings.filter((building) => withinBounds(building, finalBounds));
    } else {
        contextualBuildings = primaryBuildings;
    }

    const includedBuildings = dedupeBuildings([
        ...primaryBuildings,
        ...contextualBuildings,
    ]).filter((building) => withinBounds(building, finalBounds));

    const localizedBuildings = includedBuildings.map((building) => remapBuildingToPocket(building, finalBounds));
    const croppedTiles = cropTiles(mapData.tiles, finalBounds);
    const width = finalBounds.maxX - finalBounds.minX + 1;
    const height = finalBounds.maxY - finalBounds.minY + 1;
    const preferredCenter = resolveScopeCenter(mapData, scope, primaryBounds, sourceBuilding);
    const centerX = preferredCenter.x - finalBounds.minX;
    const centerY = preferredCenter.y - finalBounds.minY;
    const counts = countByKind(localizedBuildings);

    return {
        ...mapData,
        name: `${mapData.name || 'Wilayah'} Pocket Diorama`,
        tiles: croppedTiles,
        buildings: localizedBuildings,
        width,
        height,
        centerX,
        centerY,
        scopeMeta: {
            kind: scope.kind,
            id: scope.id,
            label: scope.label || scope.id,
            sectorKey: scope.sectorKey || getSectorKeyForCoords(preferredCenter.x, preferredCenter.y, mapData),
            bounds: finalBounds,
            preferredCenter,
            ...counts,
        },
    };
}

export function buildExhibitionDioramaData(mapData) {
    if (!mapData || !isTileMatrixValid(mapData.tiles, mapData.width, mapData.height)) {
        return null;
    }

    const allBuildings = Array.isArray(mapData.buildings) ? mapData.buildings : [];
    const counts = countByKind(allBuildings);

    return {
        ...mapData,
        scopeMeta: {
            kind: 'exhibition',
            id: 'full-village',
            label: 'Desa Penuh',
            sectorKey: null,
            bounds: {
                minX: 0,
                maxX: Math.max(0, (mapData.width || 1) - 1),
                minY: 0,
                maxY: Math.max(0, (mapData.height || 1) - 1),
            },
            preferredCenter: {
                x: mapData.centerX ?? 0,
                y: mapData.centerY ?? 0,
            },
            ...counts,
        },
    };
}

export function createTiles(width, height, fill = TILE_TYPES.GRASS) {
    return Array.from({ length: height }, () => Array.from({ length: width }, () => fill));
}
