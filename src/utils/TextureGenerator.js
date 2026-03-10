/**
 * @reflection
 * [IDENTITY]: TextureGenerator
 * [PURPOSE]: Aggregator for programmatic pixel art textures used on the Wilayah MAP.
 *            Building detail panel images (isometric PNGs) are handled separately
 *            by AI_ASSETS in constants.js via getAssetUrl().
 * [STATE]: Modular, Asset-Protected
 * [LAST_UPDATE]: 2026-02-18
 *
 * ARCHITECTURE:
 *   Map sprites (tiles)  → Canvas API via TerrainGenerator + BuildingGenerator (small pixel art)
 *   Detail panel insets   → static PNGs via AI_ASSETS in constants.js (NOT here)
 *   UI Insets             → Canvas API via UIInsetGenerator
 *
 * IMPORTANT: Do NOT replace map sprites with the isometric PNGs from public/assets/buildings/.
 *            Those are building DETAIL PANEL images (large, isometric), not map tiles.
 *            Map sprites are intentionally small pixel-art from Canvas API.
 */

import { addTerrainTextures } from './TerrainGenerator.js';
import { addBuildingTextures } from './BuildingGenerator.js';
import { addInsetTextures } from './UIInsetGenerator.js';

const _textureCache = {};
const _imageCache = {};

export const getCachedTextures = (versionKey) => _textureCache[versionKey] || null;
export const getCachedImages = (versionKey) => _imageCache[versionKey] || null;

/**
 * Main entrance for generating all game textures (MAP SPRITES ONLY).
 *
 * Pipeline:
 *   1. Terrain tiles (Canvas) — grass, water, road, dirt, sawah
 *   2. Building sprites (Canvas) — small pixel-art for map tiles
 *   3. UI Insets (Canvas) — detail panel illustrations
 *
 * NOTE: Building detail panel images (isometric PNGs) are loaded separately
 *       by AI_ASSETS in src/components/wilayah/constants.js
 */
export const generateTextures = (versionKey = 'v1') => {
    if (_textureCache[versionKey]) return _textureCache[versionKey];

    const cache = {};

    // 1. Procedural terrain tiles
    addTerrainTextures(cache);

    // 2. Procedural building sprites (small pixel-art for map)
    addBuildingTextures(cache);

    // 3. UI inset illustrations for detail panels
    addInsetTextures(cache);

    // 4. Cache globally
    _textureCache[versionKey] = cache;

    // 5. Pre-decode for Canvas performance
    if (typeof Image !== 'undefined') {
        const imageMap = {};
        Object.entries(cache).forEach(([key, src]) => {
            if (!src) return;
            const img = new Image();
            img.src = src;
            imageMap[key] = img;
        });
        _imageCache[versionKey] = imageMap;
    }

    return cache;
};
