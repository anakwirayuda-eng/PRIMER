/**
 * @reflection
 * [IDENTITY]: map-utils.js
 * [PURPOSE]: Generation logic for the procedural village map (v2.0 — Blueprint v2.3).
 *            Grid 160×120, Hybrid Settlement Algorithm, Geospatial Law 1 (Spatial Segregation).
 * [STATE]: Production
 * [ANCHOR]: generateVillageMap, getWikiKeyForBuilding
 * [DEPENDS_ON]: constants.js, VillageRegistry.js (FAMILY_SDOH)
 */

import { BUILDING_TYPES, TILE_TYPES } from './constants.js';
import { FAMILY_SDOH } from '../../domains/village/VillageRegistry.js';

// ═══ SEEDED PRNG — deterministic random from composite seed ═══
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

// ═══ WIKI KEY MAPPING (unchanged) ═══
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
    if (type === BUILDING_TYPES.HOMESTAY) return 'homestay';
    if (type === BUILDING_TYPES.DERMAGA) return 'dermaga';
    if (type === BUILDING_TYPES.POS_RONDA) return 'pos_ronda';
    if (type === BUILDING_TYPES.PESANTREN) return 'pesantren';
    if (type === BUILDING_TYPES.PADEPOKAN_DUKUN) return 'padepokan_dukun';
    if (type === BUILDING_TYPES.PASAR_HEWAN) return 'pasar_hewan';
    if (building.familyId) return 'iks';
    return null;
};

// ═══ ECONOMY→HOUSE-TYPE MAPPING (Geospatial Law 1 visual feedback) ═══
const ECONOMY_HOUSE_TYPE = {
    'High':       BUILDING_TYPES.HOUSE_MODERN,
    'Middle':     BUILDING_TYPES.HOUSE_BLUE,
    'Low-Middle': BUILDING_TYPES.HOUSE_TRAD,
    'Low':        BUILDING_TYPES.HOUSE_RED,
    'Very Low':   BUILDING_TYPES.HOUSE_HUT,
};

// ═══ RW CLUSTER CENTERS (Blueprint III-C) ═══
const RW_CENTERS = {
    '01': { x: 55,  y: 18, pattern: 'clustered' },
    '02': { x: 135, y: 35, pattern: 'linear'    },
    '03': { x: 35,  y: 30, pattern: 'scattered'  },
    '04': { x: 125, y: 60, pattern: 'linear'    },
    '05': { x: 35,  y: 55, pattern: 'scattered'  },
    '06': { x: 125, y: 65, pattern: 'linear'    },
    '07': { x: 75,  y: 65, pattern: 'clustered' },
    '08': { x: 50,  y: 95, pattern: 'scattered'  },
};

// ═══ GEOSPATIAL LAW 1: SPATIAL SEGREGATION ═══
// Economy tier → placement bias offset from RW center
// High/Middle families stay near center, Low/VeryLow pushed to periphery
function getEconomyBias(economy, rand1, rand2) {
    switch (economy) {
        case 'High':
        case 'Middle':
            // Close to center (0-4 cells offset)
            return { dx: Math.floor(rand1 * 8) - 4, dy: Math.floor(rand2 * 8) - 4 };
        case 'Low-Middle':
            // Medium ring (4-8 cells offset)
            return { dx: Math.floor(rand1 * 8) - 4 + (rand1 > 0.5 ? 5 : -5), dy: Math.floor(rand2 * 8) - 4 + (rand2 > 0.5 ? 5 : -5) };
        case 'Low':
            // Outer ring (8-12 cells)
            return { dx: Math.floor(rand1 * 8) - 4 + (rand1 > 0.5 ? 9 : -9), dy: Math.floor(rand2 * 8) - 4 + (rand2 > 0.5 ? 9 : -9) };
        case 'Very Low':
            // Far periphery (12-16 cells, near hazards)
            return { dx: Math.floor(rand1 * 8) - 4 + (rand1 > 0.5 ? 13 : -13), dy: Math.floor(rand2 * 8) - 4 + (rand2 > 0.5 ? 13 : -13) };
        default:
            return { dx: Math.floor(rand1 * 10) - 5, dy: Math.floor(rand2 * 10) - 5 };
    }
}

// ═══ MAIN GENERATOR (v2.0 — Blueprint Definitive) ═══
export const generateVillageMap = (width = 160, height = 120, _seed = 12345, villageData = null) => {
    let seedCounter = 0;
    const rand = () => _seededRand(_seed + '_' + (seedCounter++));

    const tiles = Array(height).fill(0).map(() => Array(width).fill(TILE_TYPES.GRASS));
    const buildings = [];

    // ════════════════════════════════════════════════════════
    // 1. TERRAIN (Blueprint III-D)
    // ════════════════════════════════════════════════════════

    // 1a. Hutan Lindung — west edge (x < 15, organic edge)
    for (let y = 0; y < height; y++) {
        const edge = 15 + Math.sin(y * 0.25) * 4;
        for (let x = 0; x < Math.min(width, Math.floor(edge)); x++) {
            tiles[y][x] = TILE_TYPES.TREE;
        }
    }

    // 1b. Sungai Cikapas — east edge (x > 148, meandering)
    for (let y = 0; y < height; y++) {
        const riverX = 148 + Math.sin(y * 0.08) * 3;
        for (let x = Math.max(0, Math.floor(riverX)); x < width; x++) {
            tiles[y][x] = TILE_TYPES.WATER;
        }
    }

    // 1c. Sawah Berundak — south band (y > 82, between forest and river)
    for (let y = 82; y < height; y++) {
        for (let x = 15; x < 140; x++) {
            if (tiles[y][x] === TILE_TYPES.GRASS) {
                tiles[y][x] = TILE_TYPES.SAWAH;
            }
        }
    }

    // 1d. Jalan Raya Trans Desa — horizontal (y = 25)
    const mainRoadY = 25;
    for (let x = 0; x < width; x++) {
        if (tiles[mainRoadY][x] === TILE_TYPES.WATER) tiles[mainRoadY][x] = TILE_TYPES.BRIDGE;
        else tiles[mainRoadY][x] = TILE_TYPES.ROAD_H;
    }

    // 1e. Jalan Desa Vertikal — (x = 80, y = 5→115)
    const mainRoadX = 80;
    for (let y = 5; y < 115; y++) {
        if (tiles[y][mainRoadX] === TILE_TYPES.ROAD_H) tiles[y][mainRoadX] = TILE_TYPES.ROAD_CROSS;
        else if (tiles[y][mainRoadX] !== TILE_TYPES.WATER) tiles[y][mainRoadX] = TILE_TYPES.ROAD_V;
    }

    const centerX = 80;
    const centerY = 30;

    // ════════════════════════════════════════════════════════
    // 2. FACILITY BUILDINGS (Blueprint III-B coordinates)
    // ════════════════════════════════════════════════════════

    const facilityBuildings = [
        // ── Sektor PUSAT (Hub) ──
        { id: 'puskesmas', type: BUILDING_TYPES.PUSKESMAS, x: 100, y: 30, name: 'Puskesmas Sukamaju', isPlayerBase: true },
        { id: 'rumah_dinas', type: BUILDING_TYPES.RUMAH_DINAS, x: 75, y: 8, name: 'Rumah Dinas Dokter', isPlayerHome: true },
        { id: 'balai_desa', type: BUILDING_TYPES.BALAI_DESA, x: 68, y: 32, name: 'Balai Desa' },
        { id: 'kantor_desa', type: BUILDING_TYPES.KANTOR_DESA, x: 65, y: 32, name: 'Kantor Desa' },
        { id: 'mosque', type: BUILDING_TYPES.MOSQUE, x: 115, y: 30, name: 'Masjid Al-Ikhlas' },
        { id: 'sdn_sukamaju', type: BUILDING_TYPES.SCHOOL, x: 55, y: 28, name: 'SDN Sukamaju 01' },
        { id: 'tk_sukamaju', type: BUILDING_TYPES.TK, x: 52, y: 33, name: 'TK Pertiwi' },
        { id: 'alun_alun', type: BUILDING_TYPES.ALUN_ALUN, x: 85, y: 36, name: 'Alun-alun Desa' },
        { id: 'iks_scoreboard', type: BUILDING_TYPES.IKS_SCOREBOARD, x: 95, y: 34, name: 'Scoreboard IKS (Giling Wesi)' },
        { id: 'dashat_utama', type: BUILDING_TYPES.DASHAT, x: 82, y: 30, name: 'DASHAT (Dapur Sehat Balita)' },
        { id: 'pos_kader', type: BUILDING_TYPES.POSYANDU, x: 88, y: 28, name: 'Pos Kader Pusat' },
        { id: 'homestay_desa', type: BUILDING_TYPES.HOMESTAY, x: 105, y: 38, name: 'Homestay Sukamaju' },
        { id: 'warung_kopi', type: BUILDING_TYPES.POS_RONDA, x: 100, y: 42, name: 'Warung Kopi Mbah' },
        { id: 'lapangan', type: BUILDING_TYPES.LAPANGAN, x: 110, y: 35, name: 'Lapangan Sepak Bola' },

        // ── Sektor UTARA (Jalan Raya) ──
        { id: 'gapura_desa', type: BUILDING_TYPES.GAPURA_DESA, x: 18, y: 25, name: 'Gapura Masuk Desa' },
        { id: 'pasar', type: BUILDING_TYPES.MARKET, x: 70, y: 42, name: 'Pasar Desa Sukamaju' },
        { id: 'apotek', type: BUILDING_TYPES.APOTEK, x: 70, y: 46, name: 'Apotek Sehat' },
        { id: 'toko_kelontong', type: BUILDING_TYPES.TOKO_KELONTONG, x: 72, y: 48, name: 'Toko Kelontong Pak Joko' },
        { id: 'mck_pasar', type: BUILDING_TYPES.MCK, x: 75, y: 42, name: 'MCK Pasar' },
        { id: 'warung_utama', type: BUILDING_TYPES.WARUNG, x: 105, y: 44, name: 'Warung Bu Warung' },
        { id: 'kb_post', type: BUILDING_TYPES.KB_POST, x: 120, y: 44, name: 'Pos KB Desa' },
        { id: 'info_wisata', type: BUILDING_TYPES.INFO_WISATA, x: 20, y: 23, name: 'Pusat Informasi Wisata' },

        // ── Sektor BARAT (Hutan Lindung) ──
        { id: 'hutan_lindung', type: BUILDING_TYPES.HUTAN_LINDUNG, x: 5, y: 8, name: 'Hutan Lindung Sukamaju' },
        { id: 'pesantren', type: BUILDING_TYPES.PESANTREN, x: 30, y: 12, name: 'Ponpes Al-Hikam' },
        { id: 'tpu_desa', type: BUILDING_TYPES.TPU, x: 20, y: 5, name: 'TPU Desa Sukamaju' },
        { id: 'toga_rt01', type: BUILDING_TYPES.TOGA, x: 55, y: 8, name: 'Kebun TOGA Lestari' },
        { id: 'pustu_utama', type: BUILDING_TYPES.PUSTU, x: 28, y: 50, name: 'Pustu Sukamaju' },
        { id: 'pos_ronda_barat', type: BUILDING_TYPES.POS_RONDA, x: 32, y: 60, name: 'Pos Ronda Barat' },

        // ── Sektor TIMUR (Sungai Cikapas) ──
        { id: 'sungai_cikapas', type: BUILDING_TYPES.SUNGAI_CIKAPAS, x: 152, y: 40, name: 'Sungai Cikapas' },
        { id: 'jembatan_gantung', type: BUILDING_TYPES.JEMBATAN, x: 148, y: 25, name: 'Jembatan Gantung' },
        { id: 'pamsimas', type: BUILDING_TYPES.PAMSIMAS, x: 135, y: 42, name: 'PAMSIMAS Tirta Jaya' },
        { id: 'bank_sampah', type: BUILDING_TYPES.BANK_SAMPAH, x: 135, y: 48, name: 'Bank Sampah Berkah' },
        { id: 'well_rt02', type: BUILDING_TYPES.WELL, x: 130, y: 8, name: 'Sumur Resapan Desa' },
        { id: 'waterfall', type: BUILDING_TYPES.WATERFALL, x: 90, y: 62, name: 'Air Terjun Cikapas' },
        { id: 'dermaga_wisata', type: BUILDING_TYPES.DERMAGA, x: 145, y: 72, name: 'Dermaga Wisata' },
        { id: 'pos_ronda_timur', type: BUILDING_TYPES.POS_RONDA, x: 130, y: 55, name: 'Pos Ronda Timur' },
        { id: 'gardu_pandang', type: BUILDING_TYPES.GARDU_PANDANG, x: 90, y: 65, name: 'Gardu Pandang' },

        // ── Sektor SELATAN (Sawah Berundak) ──
        { id: 'sawah_berundak', type: BUILDING_TYPES.SAWAH_BERUNDAK, x: 40, y: 82, name: 'Sawah Berundak Indah' },
        { id: 'farm', type: BUILDING_TYPES.FARM, x: 25, y: 88, name: 'Lahan Tani Pak Slamet' },
        { id: 'polindes', type: BUILDING_TYPES.POLINDES, x: 25, y: 95, name: 'Polindes Desa' },
        { id: 'rtk_utama', type: BUILDING_TYPES.RTK, x: 90, y: 95, name: 'RTK (Rumah Tunggu Kelahiran)' },
        { id: 'pos_gizi', type: BUILDING_TYPES.POS_GIZI, x: 60, y: 90, name: 'Pos Gizi Bunda' },
        { id: 'pos_ukk', type: BUILDING_TYPES.POS_UKK, x: 90, y: 88, name: 'Pos UKK Tani Makmur' },
        { id: 'padepokan_dukun', type: BUILDING_TYPES.PADEPOKAN_DUKUN, x: 60, y: 95, name: 'Padepokan Mak Sinem' },
        { id: 'pos_ronda_selatan', type: BUILDING_TYPES.POS_RONDA, x: 65, y: 105, name: 'Pos Ronda Selatan' },
        { id: 'playground', type: BUILDING_TYPES.PLAYGROUND, x: 80, y: 85, name: 'Taman Bermain Desa' },
        { id: 'pasar_hewan', type: BUILDING_TYPES.PASAR_HEWAN, x: 35, y: 90, name: 'Pasar Hewan Komunal' },
    ];

    buildings.push(...facilityBuildings);

    // ════════════════════════════════════════════════════════
    // 3. HOUSE PLACEMENT — Hybrid Settlement Algorithm
    //    Geospatial Law 1: Spatial Segregation
    // ════════════════════════════════════════════════════════

    if (villageData && villageData.families) {
        // Group families by RW
        const rwGroups = {};
        villageData.families.forEach(fam => {
            const rw = fam.rw || '01';
            if (!rwGroups[rw]) rwGroups[rw] = [];
            rwGroups[rw].push(fam);
        });

        // Per-RW posyandu placement + house scattering
        Object.keys(rwGroups).forEach(rw => {
            const center = RW_CENTERS[rw] || { x: centerX, y: centerY + 20, pattern: 'scattered' };
            const families = rwGroups[rw];

            // Place Posyandu at cluster center
            buildings.push({
                id: `posyandu_rw${rw}`, type: BUILDING_TYPES.POSYANDU,
                x: center.x, y: center.y - 2,
                name: `Posyandu RW ${rw}`
            });

            // Place each family house with economy-biased offset
            families.forEach((fam) => {
                const sdoh = FAMILY_SDOH[fam.id];
                const economy = sdoh?.economy || 'Middle';
                const r1 = rand();
                const r2 = rand();
                const bias = getEconomyBias(economy, r1, r2);

                let targetX = center.x + bias.dx;
                let targetY = center.y + bias.dy;

                // Clamp to grid bounds (leave 2-cell margin)
                targetX = Math.max(2, Math.min(width - 2, targetX));
                targetY = Math.max(2, Math.min(height - 2, targetY));

                // Spiral search for valid placement (Guardrail #5: bounded by r <= 12)
                let placed = false;
                for (let r = 0; r <= 12 && !placed; r++) {
                    for (let dy = -r; dy <= r && !placed; dy++) {
                        for (let dx = -r; dx <= r && !placed; dx++) {
                            if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
                            const x = targetX + dx;
                            const y = targetY + dy;
                            if (x < 2 || x > width - 2 || y < 2 || y > height - 2) continue;

                            // Can only place on grass or sawah
                            const tile = tiles[y]?.[x];
                            if (tile !== TILE_TYPES.GRASS && tile !== TILE_TYPES.SAWAH) continue;

                            // Minimum spacing from other buildings (2 cells)
                            if (buildings.some(b => Math.abs(b.x - x) < 2 && Math.abs(b.y - y) < 2)) continue;

                            // Economy → house visual type
                            const houseType = ECONOMY_HOUSE_TYPE[economy] || BUILDING_TYPES.HOUSE_TRAD;

                            buildings.push({
                                id: fam.houseId || fam.id,
                                type: houseType,
                                x, y,
                                familyId: fam.id,
                                familyData: fam,
                                houseId: fam.houseId,
                                name: `Kel. ${fam.headName}`,
                                iksScore: fam.iksScore,
                                indicators: fam.indicators,
                                hasJentik: !fam.indicators?.jentik,
                                economyTier: economy,
                            });
                            placed = true;
                        }
                    }
                }

                // Guardrail #5: Fallback — if spiral failed, force-place with relaxed spacing
                if (!placed) {
                    const fallbackX = Math.max(2, Math.min(width - 2, center.x + Math.round((rand() - 0.5) * 20)));
                    const fallbackY = Math.max(2, Math.min(height - 2, center.y + Math.round((rand() - 0.5) * 20)));
                    const houseType = ECONOMY_HOUSE_TYPE[economy] || BUILDING_TYPES.HOUSE_TRAD;
                    buildings.push({
                        id: fam.houseId || fam.id,
                        type: houseType,
                        x: fallbackX, y: fallbackY,
                        familyId: fam.id,
                        familyData: fam,
                        houseId: fam.houseId,
                        name: `Kel. ${fam.headName}`,
                        iksScore: fam.iksScore,
                        indicators: fam.indicators,
                        hasJentik: !fam.indicators?.jentik,
                        economyTier: economy,
                    });
                }
            });

            // Connect cluster to main road via dirt road
            const startX = Math.min(center.x, mainRoadX);
            const endX = Math.max(center.x, mainRoadX);
            for (let x = startX; x <= endX; x++) {
                if (tiles[center.y]?.[x] === TILE_TYPES.GRASS || tiles[center.y]?.[x] === TILE_TYPES.SAWAH) {
                    tiles[center.y][x] = TILE_TYPES.DIRT_ROAD_H;
                }
            }
            const startY = Math.min(center.y, mainRoadY);
            const endY = Math.max(center.y, mainRoadY);
            for (let y = startY; y <= endY; y++) {
                if (tiles[y]?.[center.x] === TILE_TYPES.GRASS || tiles[y]?.[center.x] === TILE_TYPES.SAWAH) {
                    tiles[y][center.x] = TILE_TYPES.DIRT_ROAD_V;
                }
            }
        });
    }

    // ════════════════════════════════════════════════════════
    // 4. LANDSCAPE ACCENTS (flowers near facilities)
    // ════════════════════════════════════════════════════════

    facilityBuildings.forEach(b => {
        if (b.y + 2 < height && tiles[b.y + 2]?.[b.x] === TILE_TYPES.GRASS) tiles[b.y + 2][b.x] = TILE_TYPES.FLOWER;
        if (b.x - 2 >= 0 && tiles[b.y]?.[b.x - 2] === TILE_TYPES.GRASS) tiles[b.y][b.x - 2] = TILE_TYPES.FLOWER;
    });

    // ════════════════════════════════════════════════════════
    // 5. ROAD SMOOTHING (crossroads detection)
    // ════════════════════════════════════════════════════════

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

    // ════════════════════════════════════════════════════════
    // 6. ENGINE CONTRACT — expose spatial metadata for downstream
    // ════════════════════════════════════════════════════════

    const sectorBounds = {
        pusat:   { minX: 50,  maxX: 120, minY: 5,  maxY: 45  },
        utara:   { minX: 15,  maxX: 145, minY: 20, maxY: 28  }, // Jalan Raya Trans corridor
        barat:   { minX: 0,   maxX: 40,  minY: 0,  maxY: 80  },
        timur:   { minX: 120, maxX: 159, minY: 0,  maxY: 80  },
        selatan: { minX: 15,  maxX: 140, minY: 82, maxY: 119 },
    };

    const hazardHubs = [
        { id: 'sungai_cikapas', type: 'river',  x: 150, y: 60, radius: 6, diseases: ['diare', 'tifoid', 'leptospirosis'], multiplier: 3.0 },
        { id: 'hutan_lindung',  type: 'forest', x: 8,   y: 40, radius: 8, diseases: ['malaria', 'keracunan_pestisida'], multiplier: 3.0 },
        { id: 'pasar_hewan',    type: 'zoonosis', x: 35, y: 90, radius: 5, diseases: ['avian_influenza', 'brucellosis'], multiplier: 2.5 },
        { id: 'padepokan_dukun', type: 'traditional', x: 60, y: 95, radius: 4, diseases: ['komplikasi_persalinan'], multiplier: 2.0 },
    ];

    return {
        tiles, buildings, name: 'Desa Sukamaju', width, height, centerX, centerY,
        sectorBounds, hazardHubs, rwCenters: RW_CENTERS, mainRoadY, mainRoadX,
    };
};
