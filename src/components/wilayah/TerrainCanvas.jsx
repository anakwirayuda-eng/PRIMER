/**
 * @reflection
 * [IDENTITY]: TerrainCanvas.jsx
 * [PURPOSE]: Optimized canvas-based renderer for village terrain tiles.
 * [STATE]: Stable
 * [ANCHOR]: TerrainCanvas
 * [DEPENDS_ON]: constants.js
 */

import React, { useEffect, useRef } from 'react';
import { TILE_TYPES } from './constants.js';

const TerrainCanvas = React.memo(({ mapData, TILE_SIZE, textures }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !textures) return;
        let cancelled = false;

        const loadImg = (src) => new Promise((resolve) => {
            if (!src) { resolve(null); return; }
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });

        const neededKeys = ['grass', 'water', 'sawah', 'road_h', 'road_v', 'road_cross',
            'dirt_h', 'dirt_v', 'dirt_cross', 'rock', 'bush', 'flower'];

        Promise.all(neededKeys.map(k => loadImg(textures[k]).then(img => [k, img])))
            .then(entries => {
                if (cancelled) return;
                const assets = Object.fromEntries(entries.filter(([, v]) => v));
                if (!assets.grass || !canvasRef.current) return;

                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d', { alpha: false });
                ctx.imageSmoothingEnabled = false;

                mapData.tiles.forEach((row, y) => {
                    row.forEach((tile, x) => {
                        let bgImg = assets.grass;
                        ctx.drawImage(assets.grass, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                        switch (tile) {
                            case TILE_TYPES.WATER: bgImg = assets.water; break;
                            case TILE_TYPES.SAWAH: bgImg = assets.sawah; break;
                            case TILE_TYPES.ROAD_H: bgImg = assets.road_h; break;
                            case TILE_TYPES.ROAD_V: bgImg = assets.road_v; break;
                            case TILE_TYPES.ROAD_CROSS: bgImg = assets.road_cross; break;
                            case TILE_TYPES.DIRT_PATH:
                            case TILE_TYPES.DIRT_ROAD_H: bgImg = assets.dirt_h; break;
                            case TILE_TYPES.DIRT_ROAD_V: bgImg = assets.dirt_v; break;
                            case TILE_TYPES.DIRT_ROAD_CROSS: bgImg = assets.dirt_cross; break;
                            case TILE_TYPES.BRIDGE: bgImg = assets.road_h; break;
                            case TILE_TYPES.TREE: bgImg = assets.sawah; break;
                        }

                        if (bgImg && bgImg !== assets.grass) {
                            ctx.drawImage(bgImg, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                        }

                        const tileSeed = x * 1000 + y;
                        const seededRandom = (seed) => {
                            const val = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
                            return val - Math.floor(val);
                        };
                        const decorRoll = seededRandom(tileSeed);

                        if (tile === TILE_TYPES.GRASS) {
                            if (decorRoll < 0.05 && assets.rock) {
                                ctx.drawImage(assets.rock, x * TILE_SIZE + TILE_SIZE * 0.2, y * TILE_SIZE + TILE_SIZE * 0.2, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
                            } else if (decorRoll < 0.08 && assets.bush) {
                                ctx.drawImage(assets.bush, x * TILE_SIZE + TILE_SIZE * 0.1, y * TILE_SIZE + TILE_SIZE * 0.2, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
                            }
                        }
                    });
                });

                ctx.globalAlpha = 0.1;
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1;
            });

        return () => { cancelled = true; };
    }, [mapData, TILE_SIZE, textures]);

    return (
        <canvas
            ref={canvasRef}
            width={mapData.width * TILE_SIZE}
            height={mapData.height * TILE_SIZE}
            style={{
                imageRendering: 'pixelated',
                display: 'block',
                backgroundColor: '#2d3a1f'
            }}
        />
    );
});

export default TerrainCanvas;
