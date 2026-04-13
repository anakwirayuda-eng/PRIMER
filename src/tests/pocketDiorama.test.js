import { describe, expect, it } from 'vitest';

import { BUILDING_TYPES } from '../components/wilayah/constants.js';
import {
    buildExhibitionDioramaData,
    buildPocketDioramaData,
    createTiles,
    resolveInspectorScope,
} from '../components/wilayah/pocketDiorama.js';

function createFixtureMapData() {
    return {
        name: 'Desa Uji',
        width: 60,
        height: 60,
        centerX: 30,
        centerY: 30,
        tiles: createTiles(60, 60),
        rwCenters: {
            '03': { x: 11, y: 10 },
            '04': { x: 45, y: 12 },
        },
        sectorBounds: {
            barat: { minX: 0, maxX: 20, minY: 0, maxY: 20 },
            timur: { minX: 35, maxX: 59, minY: 0, maxY: 20 },
            pusat: { minX: 21, maxX: 34, minY: 0, maxY: 20 },
            selatan: { minX: 0, maxX: 59, minY: 21, maxY: 59 },
        },
        buildings: [
            {
                id: 'house_rw03_a',
                type: BUILDING_TYPES.HOUSE_BLUE,
                x: 10,
                y: 10,
                familyId: 'kk_rw03_a',
                familyData: { id: 'kk_rw03_a', rw: '03' },
            },
            {
                id: 'house_rw03_b',
                type: BUILDING_TYPES.HOUSE_TRAD,
                x: 12,
                y: 11,
                familyId: 'kk_rw03_b',
                familyData: { id: 'kk_rw03_b', rw: '03' },
            },
            {
                id: 'posyandu_rw03',
                type: BUILDING_TYPES.POSYANDU,
                x: 11,
                y: 8,
                name: 'Posyandu RW 03',
            },
            {
                id: 'balai_desa',
                type: BUILDING_TYPES.BALAI_DESA,
                x: 16,
                y: 6,
                name: 'Balai Desa',
            },
            {
                id: 'pesantren',
                type: BUILDING_TYPES.PESANTREN,
                x: 42,
                y: 10,
                name: 'Ponpes Al-Hikam',
            },
            {
                id: 'house_near_pesantren',
                type: BUILDING_TYPES.HOUSE_RED,
                x: 44,
                y: 12,
                familyId: 'kk_near_pesantren',
                familyData: { id: 'kk_near_pesantren', rw: '04' },
            },
            {
                id: 'market_far',
                type: BUILDING_TYPES.MARKET,
                x: 54,
                y: 18,
                name: 'Pasar Timur',
            },
        ],
    };
}

describe('resolveInspectorScope', () => {
    it('prioritizes RW scope for occupied houses', () => {
        const mapData = createFixtureMapData();
        const scope = resolveInspectorScope(mapData.buildings[0], mapData);

        expect(scope).toMatchObject({
            kind: 'rw',
            id: '03',
            label: 'RW 03',
            sectorKey: 'barat',
            sourceBuildingId: 'house_rw03_a',
        });
    });

    it('maps narrative hazard buildings to building scope', () => {
        const mapData = createFixtureMapData();
        const pesantren = mapData.buildings.find((building) => building.id === 'pesantren');
        const scope = resolveInspectorScope(pesantren, mapData);

        expect(scope).toMatchObject({
            kind: 'building',
            id: 'pesantren',
            label: 'Ponpes Al-Hikam',
            sectorKey: 'timur',
        });
    });

    it('falls back to sector scope for generic public facilities', () => {
        const mapData = createFixtureMapData();
        const balaiDesa = mapData.buildings.find((building) => building.id === 'balai_desa');
        const scope = resolveInspectorScope(balaiDesa, mapData);

        expect(scope).toMatchObject({
            kind: 'sector',
            id: 'barat',
            label: 'Sektor Barat',
            sourceBuildingId: 'balai_desa',
        });
    });
});

describe('buildPocketDioramaData', () => {
    it('builds an RW-first cropped subset with local coordinates and context facilities', () => {
        const mapData = createFixtureMapData();
        const house = mapData.buildings.find((building) => building.id === 'house_rw03_a');
        const scope = resolveInspectorScope(house, mapData);

        const pocket = buildPocketDioramaData(mapData, scope);

        expect(pocket.scopeMeta).toMatchObject({
            kind: 'rw',
            id: '03',
            label: 'RW 03',
        });
        expect(pocket.scopeMeta.buildingCount).toBeGreaterThanOrEqual(4);
        expect(pocket.scopeMeta.houseCount).toBe(2);
        expect(pocket.scopeMeta.facilityCount).toBeGreaterThanOrEqual(2);

        const localizedHouse = pocket.buildings.find((building) => building.id === 'house_rw03_a');
        expect(localizedHouse.worldX).toBe(10);
        expect(localizedHouse.worldY).toBe(10);
        expect(
            localizedHouse.x !== localizedHouse.worldX ||
            localizedHouse.y !== localizedHouse.worldY
        ).toBe(true);
        expect(localizedHouse.x).toBeGreaterThanOrEqual(0);
        expect(localizedHouse.y).toBeGreaterThanOrEqual(0);
        expect(localizedHouse.x).toBeLessThan(pocket.width);
        expect(localizedHouse.y).toBeLessThan(pocket.height);

        expect(pocket.buildings.some((building) => building.id === 'posyandu_rw03')).toBe(true);
        expect(pocket.buildings.some((building) => building.id === 'market_far')).toBe(false);
        expect(pocket.width).toBeGreaterThan(0);
        expect(pocket.height).toBeGreaterThan(0);
        expect(pocket.centerX).toBeGreaterThanOrEqual(0);
        expect(pocket.centerY).toBeGreaterThanOrEqual(0);
    });

    it('builds a building-focus subset for narrative nodes without dragging the whole village', () => {
        const mapData = createFixtureMapData();
        const pesantren = mapData.buildings.find((building) => building.id === 'pesantren');
        const scope = resolveInspectorScope(pesantren, mapData);

        const pocket = buildPocketDioramaData(mapData, scope);

        expect(pocket.scopeMeta.kind).toBe('building');
        expect(pocket.buildings.some((building) => building.id === 'pesantren')).toBe(true);
        expect(pocket.buildings.some((building) => building.id === 'house_near_pesantren')).toBe(true);
        expect(pocket.buildings.some((building) => building.id === 'house_rw03_a')).toBe(false);
        expect(pocket.buildings.some((building) => building.id === 'market_far')).toBe(false);
    });
});

describe('buildExhibitionDioramaData', () => {
    it('preserves the full village footprint for exhibition mode', () => {
        const mapData = createFixtureMapData();

        const exhibition = buildExhibitionDioramaData(mapData);

        expect(exhibition.scopeMeta).toMatchObject({
            kind: 'exhibition',
            id: 'full-village',
            label: 'Desa Penuh',
            buildingCount: mapData.buildings.length,
        });
        expect(exhibition.width).toBe(mapData.width);
        expect(exhibition.height).toBe(mapData.height);
        expect(exhibition.centerX).toBe(mapData.centerX);
        expect(exhibition.centerY).toBe(mapData.centerY);
        expect(exhibition.buildings).toBe(mapData.buildings);
    });
});
