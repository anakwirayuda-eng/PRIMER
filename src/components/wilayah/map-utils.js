/**
 * @reflection
 * [IDENTITY]: map-utils.js
 * [PURPOSE]: Generation logic for the procedural village map and wiki key mapping for buildings.
 * [STATE]: Stable
 * [ANCHOR]: generateVillageMap, getWikiKeyForBuilding
 * [DEPENDS_ON]: constants.js
 */

import { BUILDING_TYPES, TILE_TYPES } from './constants.js';

// Seeded PRNG — deterministic random from any string/number seed
function _seededRand(seed) {
    let h = 0;
    const s = String(seed);
    for (let i = 0; i < s.length; i++) {
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    }
    let t = h + 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const getWikiKeyForBuilding = (building) => {
    if (!building) return null;
    const type = building.type;
    if (type === BUILDING_TYPES.POSYANDU) return 'posyandu';
    if (type === BUILDING_TYPES.PUSKESMAS) return 'clinical_services';
    if (type === BUILDING_TYPES.KB_POST) return 'kb_post';
    if (type === BUILDING_TYPES.POLINDES) return 'polindes';
    if (type === BUILDING_TYPES.BALAI_DESA || type === BUILDING_TYPES.KANTOR_DESA) return 'balai_desa';
    if (type === BUILDING_TYPES.MCK) return 'mck';
    if (type === BUILDING_TYPES.SCHOOL || type === BUILDING_TYPES.TK) return 'school';
    if (type === BUILDING_TYPES.WELL) return 'well';
    if (type === BUILDING_TYPES.TPU) return 'tpu';
    if (type === BUILDING_TYPES.MARKET || type === BUILDING_TYPES.WARUNG || type === BUILDING_TYPES.TOKO_KELONTONG) return 'market';
    if (type === BUILDING_TYPES.WATERFALL || type === BUILDING_TYPES.SUNGAI) return 'forest_waterfall';
    if (type === BUILDING_TYPES.MOSQUE) return 'mosque';
    if (type === BUILDING_TYPES.APOTEK) return 'apotek';
    if (type === BUILDING_TYPES.FARM) return 'farm';
    if (type === BUILDING_TYPES.PLAYGROUND) return 'playground';
    if (type === BUILDING_TYPES.LAPANGAN || type === BUILDING_TYPES.ALUN_ALUN) return 'physical_activity';
    if (type === BUILDING_TYPES.PUSTU) return 'pustu';
    if (type === BUILDING_TYPES.PAMSIMAS) return 'sanitasi';
    if (type === BUILDING_TYPES.BANK_SAMPAH) return 'waste_management';
    if (type === BUILDING_TYPES.RTK) return 'kb_post';
    if (type === BUILDING_TYPES.POS_GIZI) return 'gizi';
    if (type === BUILDING_TYPES.TOGA) return 'toga';
    if (type === BUILDING_TYPES.POS_UKK) return 'ukk';
    if (type === BUILDING_TYPES.HUTAN_LINDUNG) return 'hutan_lindung';
    if (type === BUILDING_TYPES.SUNGAI_CIKAPAS) return 'sungai_cikapas';
    if (type === BUILDING_TYPES.GAPURA_DESA) return 'gapura_desa';
    if (type === BUILDING_TYPES.SAWAH_BERUNDAK) return 'sawah_berundak';
    if (building.familyId) return 'iks';
    return null;
};

export const generateVillageMap = (width, height, _seed = 42, villageData = null) => {
    const tiles = Array(height).fill(0).map(() => Array(width).fill(TILE_TYPES.GRASS));
    const buildings = [];

    // 1. TERRAIN FEATURES
    for (let y = 0; y < height; y++) {
        const riverX = width - 6 + Math.sin(y * 0.2) * 3;
        for (let x = Math.max(0, Math.floor(riverX)); x < width; x++) {
            tiles[y][x] = TILE_TYPES.WATER;
        }
    }

    for (let y = 0; y < height; y++) {
        const forestW = 8 + Math.sin(y * 0.15) * 4;
        for (let x = 0; x < forestW; x++) {
            if (tiles[y][x] === TILE_TYPES.GRASS) tiles[y][x] = TILE_TYPES.TREE;
        }
    }

    // 2. CENTRAL HUB
    const centerX = Math.floor(width * 0.5);
    const centerY = Math.floor(height * 0.4);

    const mainRoadY = centerY + 2;
    const mainRoadX = centerX;

    const hubBuildings = [
        { id: 'puskesmas', type: BUILDING_TYPES.PUSKESMAS, x: centerX + 5, y: centerY, name: 'Puskesmas Sukamaju', isPlayerBase: true },
        { id: 'rumah_dinas', type: BUILDING_TYPES.RUMAH_DINAS, x: centerX - 5, y: centerY - 8, name: 'Rumah Dinas Dokter', isPlayerHome: true },
        { id: 'balai_desa', type: BUILDING_TYPES.BALAI_DESA, x: centerX - 12, y: centerY, name: 'Balai Desa' },
        { id: 'kantor_desa', type: BUILDING_TYPES.KANTOR_DESA, x: centerX - 15, y: centerY, name: 'Kantor Desa' },
        { id: 'mosque', type: BUILDING_TYPES.MOSQUE, x: centerX + 12, y: centerY, name: 'Masjid Al-Ikhlas' },
        { id: 'pasar', type: BUILDING_TYPES.MARKET, x: centerX - 10, y: centerY + 13, name: 'Pasar Desa' },
        { id: 'mck_pasar', type: BUILDING_TYPES.MCK, x: centerX - 14, y: centerY + 13, name: 'MCK Pasar' },
        { id: 'lapangan', type: BUILDING_TYPES.ALUN_ALUN, x: centerX + 10, y: centerY + 14, name: 'Alun-alun Desa' },
        { id: 'iks_scoreboard', type: BUILDING_TYPES.IKS_SCOREBOARD, x: centerX + 6, y: centerY + 11, name: 'Scoreboard IKS (Giling Wesi)' },
        { id: 'hutan_lindung', type: BUILDING_TYPES.HUTAN_LINDUNG, x: 2, y: centerY - 15, name: 'Hutan Lindung Sukamaju' },
        { id: 'sungai_cikapas', type: BUILDING_TYPES.SUNGAI_CIKAPAS, x: width - 4, y: centerY + 10, name: 'Sungai Cikapas' },
        { id: 'gapura_desa', type: BUILDING_TYPES.GAPURA_DESA, x: 1, y: mainRoadY, name: 'Gapura Masuk Desa' },
        { id: 'sawah_berundak', type: BUILDING_TYPES.SAWAH_BERUNDAK, x: 20, y: height - 8, name: 'Sawah Berundak Indah' },
        { id: 'sdn_sukamaju', type: BUILDING_TYPES.SCHOOL, x: centerX - 20, y: centerY + 2, name: 'SDN Sukamaju 01' },
        { id: 'tk_sukamaju', type: BUILDING_TYPES.TK, x: centerX - 22, y: centerY + 8, name: 'TK Pertiwi' },
        { id: 'bank_sampah', type: BUILDING_TYPES.BANK_SAMPAH, x: centerX - 8, y: centerY + 18, name: 'Bank Sampah Berkah' },
        { id: 'dashat_utama', type: BUILDING_TYPES.DASHAT, x: centerX - 12, y: centerY + 4, name: 'DASHAT (Dapur Sehat Balita)' },
        { id: 'tpu_desa', type: BUILDING_TYPES.TPU, x: centerX - 16, y: centerY - 15, name: 'TPU Desa Sukamaju' },
        { id: 'well_rt02', type: BUILDING_TYPES.WELL, x: centerX + 18, y: centerY - 8, name: 'Sumur Resapan Desa' },
        { id: 'toga_rt01', type: BUILDING_TYPES.TOGA, x: centerX - 18, y: centerY - 18, name: 'Kebun TOGA Lestari' },
        { id: 'pos_gizi_rt05', type: BUILDING_TYPES.POS_GIZI, x: centerX - 24, y: centerY + 16, name: 'Pos Gizi Bunda' },
        { id: 'pos_ukk_sawah', type: BUILDING_TYPES.POS_UKK, x: centerX + 5, y: centerY + 18, name: 'Pos UKK Tani Makmur' },
    ];

    buildings.push(...hubBuildings);

    // Roads
    for (let x = 0; x < width; x++) {
        if (tiles[mainRoadY][x] === TILE_TYPES.WATER) tiles[mainRoadY][x] = TILE_TYPES.BRIDGE;
        else tiles[mainRoadY][x] = TILE_TYPES.ROAD_H;
    }

    for (let y = 5; y < height - 5; y++) {
        if (tiles[y][mainRoadX] !== TILE_TYPES.ROAD_H) tiles[y][mainRoadX] = TILE_TYPES.ROAD_V;
        else tiles[y][mainRoadX] = TILE_TYPES.ROAD_CROSS;
    }

    // 3. RT-BASED CLUSTERS
    if (villageData && villageData.families) {
        const rtGroups = {};
        villageData.families.forEach(fam => {
            const rt = fam.rt || '01';
            if (!rtGroups[rt]) rtGroups[rt] = [];
            rtGroups[rt].push(fam);
        });

        const rtCenters = {
            '01': { x: centerX - 14, y: centerY - 12 },
            '02': { x: centerX + 12, y: centerY - 12 },
            '03': { x: centerX - 18, y: centerY + 6 },
            '04': { x: centerX + 18, y: centerY + 6 },
            '05': { x: centerX - 18, y: centerY + 22 },
            '06': { x: centerX + 14, y: centerY + 22 },
        };

        buildings.push({ id: 'polindes_utama', type: BUILDING_TYPES.POLINDES, x: centerX + 20, y: centerY + 6, name: 'Polindes Sukamaju' });
        buildings.push({ id: 'rtk_utama', type: BUILDING_TYPES.RTK, x: centerX + 20, y: centerY + 10, name: 'RTK (Rumah Tunggu Kelahiran)' });
        buildings.push({ id: 'pustu_utama', type: BUILDING_TYPES.PUSTU, x: centerX + 18, y: centerY + 15, name: 'Pustu Sukamaju' });
        buildings.push({ id: 'pamsimas', type: BUILDING_TYPES.PAMSIMAS, x: centerX + 20, y: centerY + 20, name: 'PAMSIMAS Tirta Jaya' });

        Object.keys(rtGroups).forEach(rt => {
            const center = rtCenters[rt] || { x: centerX, y: centerY + 20 };
            const families = rtGroups[rt];

            buildings.push({
                id: `posyandu_rt${rt}`, type: BUILDING_TYPES.POSYANDU,
                x: center.x, y: center.y - 2,
                name: `Posyandu RT ${rt}`
            });

            families.forEach((fam, i) => {
                const angle = (i / families.length) * Math.PI * 2;
                const dist = 6 + (i % 2 === 0 ? 0 : 2);

                const targetX = Math.floor(center.x + Math.cos(angle) * dist);
                const targetY = Math.floor(center.y + Math.sin(angle) * dist);

                let placed = false;
                for (let r = 0; r <= 10 && !placed; r++) {
                    for (let dy = -r; dy <= r && !placed; dy++) {
                        for (let dx = -r; dx <= r && !placed; dx++) {
                            if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
                            const x = targetX + dx;
                            const y = targetY + dy;
                            if (x < 2 || x > width - 2 || y < 2 || y > height - 2) continue;
                            if (tiles[y][x] !== TILE_TYPES.GRASS) continue;
                            if (buildings.some(b => Math.abs(b.x - x) < 3 && Math.abs(b.y - y) < 3)) continue;

                            buildings.push({
                                id: fam.houseId || fam.id,
                                type: [BUILDING_TYPES.HOUSE_RED, BUILDING_TYPES.HOUSE_BLUE, BUILDING_TYPES.HOUSE_TRAD, BUILDING_TYPES.HOUSE_MODERN][i % 4],
                                x, y,
                                familyId: fam.id,
                                houseId: fam.houseId,
                                name: `Kel. ${fam.headName}`,
                                iksScore: fam.iksScore,
                                indicators: fam.indicators,
                                hasJentik: !fam.indicators.jentik,
                                hasDBCase: _seededRand(fam.id) < 0.05
                            });
                            placed = true;
                        }
                    }
                }
            });

            const startX = Math.min(center.x, mainRoadX);
            const endX = Math.max(center.x, mainRoadX);
            for (let x = startX; x <= endX; x++) {
                if (tiles[center.y][x] === TILE_TYPES.GRASS) tiles[center.y][x] = TILE_TYPES.DIRT_ROAD_H;
            }
            const startY = Math.min(center.y, mainRoadY);
            const endY = Math.max(center.y, mainRoadY);
            for (let y = startY; y <= endY; y++) {
                if (tiles[y][center.x] === TILE_TYPES.GRASS) tiles[y][center.x] = TILE_TYPES.DIRT_ROAD_V;
            }
        });
    }

    // 5. LANDSCAPE ACCENTS
    for (let y = height - 12; y < height - 2; y++) {
        for (let x = 12; x < width - 12; x++) {
            if (tiles[y][x] === TILE_TYPES.GRASS && (x + y) % 9 === 0) {
                for (let dy = 0; dy < 3; dy++) {
                    for (let dx = 0; dx < 3; dx++) {
                        if (y + dy < height && x + dx < width && tiles[y + dy][x + dx] === TILE_TYPES.GRASS) {
                            tiles[y + dy][x + dx] = TILE_TYPES.SAWAH;
                        }
                    }
                }
            }
        }
    }

    hubBuildings.forEach(b => {
        if (tiles[b.y + 2]?.[b.x] === TILE_TYPES.GRASS) tiles[b.y + 2][b.x] = TILE_TYPES.FLOWER;
        if (tiles[b.y]?.[b.x - 2] === TILE_TYPES.GRASS) tiles[b.y][b.x - 2] = TILE_TYPES.FLOWER;
    });

    // 6. ROAD SMOOTHING
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const tile = tiles[y][x];
            const isRoadTile = (tx, ty) => {
                if (tx < 0 || tx >= width || ty < 0 || ty >= height) return false;
                const t = tiles[ty][tx];
                return [TILE_TYPES.ROAD_H, TILE_TYPES.ROAD_V, TILE_TYPES.ROAD_CROSS,
                TILE_TYPES.DIRT_ROAD_H, TILE_TYPES.DIRT_ROAD_V, TILE_TYPES.DIRT_ROAD_CROSS].includes(t);
            };

            const up = isRoadTile(x, y - 1);
            const down = isRoadTile(x, y + 1);
            const left = isRoadTile(x - 1, y);
            const right = isRoadTile(x + 1, y);

            if (tile === TILE_TYPES.ROAD_H || tile === TILE_TYPES.ROAD_V || tile === TILE_TYPES.ROAD_CROSS) {
                if ((left || right) && (up || down)) tiles[y][x] = TILE_TYPES.ROAD_CROSS;
                else if (left || right) tiles[y][x] = TILE_TYPES.ROAD_H;
                else if (up || down) tiles[y][x] = TILE_TYPES.ROAD_V;
            } else if (tile === TILE_TYPES.DIRT_ROAD_H || tile === TILE_TYPES.DIRT_ROAD_V || tile === TILE_TYPES.DIRT_ROAD_CROSS) {
                if ((left || right) && (up || down)) tiles[y][x] = TILE_TYPES.DIRT_ROAD_CROSS;
                else if (left || right) tiles[y][x] = TILE_TYPES.DIRT_ROAD_H;
                else if (up || down) tiles[y][x] = TILE_TYPES.DIRT_ROAD_V;
            }
        }
    }

    return { tiles, buildings, name: 'Desa Sukamaju ILP Full', width, height, centerX, centerY };
};
