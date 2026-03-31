/**
 * @reflection
 * [IDENTITY]: Map2DTerrain
 * [PURPOSE]: Canvas-based 2D terrain renderer for helicopter-view blueprint map.
 *            Single <canvas> element replaces hundreds of SVG <rect> nodes.
 *            Guardrail #2: MURNI canvas, no per-tile DOM nodes.
 * [STATE]: Production
 * [DEPENDS_ON]: map-utils.js (tile data for road/terrain positions)
 */

import React, { useRef, useEffect, useMemo } from 'react';
import { TILE_TYPES } from '../constants.js';

// ═══ TERRAIN COLOR PALETTE — Blueprint XII.B ═══
const TERRAIN_COLORS = {
    water:    '#4a90d9',   // Biru cerah (Sungai)
    forest:   '#2d5a27',   // Gelap (zona bahaya)
    sawah:    '#a8d86e',   // Hijau muda (padi tumbuh)
    road:     '#8c8a85',   // Abu netral warm (jalan aspal)
    dirtRoad: '#c4a882',   // Coklat sandy (jalan tanah)
    flower:   '#e8a0c8',   // Pink accent (bunga dekorasi)
    bridge:   '#a0785a',   // Kayu tua
};

// Colors are now hex strings — no rgbaStr needed

export default function Map2DTerrain({ mapData, cellSize }) {
    const { tiles, width, height, centerX } = mapData;
    const canvasRef = useRef(null);

    // Pre-classify tiles into typed arrays for fast iteration
    const tileClassification = useMemo(() => {
        const water = [];
        const forest = [];
        const sawah = [];
        const road = [];
        const dirtRoad = [];
        const flower = [];
        const bridge = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const t = tiles[y]?.[x];
                if (t === TILE_TYPES.WATER) {
                    water.push(x, y);
                } else if (t === TILE_TYPES.TREE || t === TILE_TYPES.FOREST_BASE) {
                    forest.push(x, y);
                } else if (t === TILE_TYPES.SAWAH) {
                    sawah.push(x, y);
                } else if (t === TILE_TYPES.ROAD_H || t === TILE_TYPES.ROAD_V || t === TILE_TYPES.ROAD_CROSS || t === TILE_TYPES.BRIDGE) {
                    road.push(x, y);
                } else if (t === TILE_TYPES.DIRT_ROAD_H || t === TILE_TYPES.DIRT_ROAD_V || t === TILE_TYPES.DIRT_ROAD_CROSS) {
                    dirtRoad.push(x, y);
                } else if (t === TILE_TYPES.FLOWER) {
                    flower.push(x, y);
                } else if (t === TILE_TYPES.BRIDGE) {
                    bridge.push(x, y);
                }
            }
        }
        return { water, forest, sawah, road, dirtRoad, flower, bridge };
    }, [tiles, width, height]);

    // Paint canvas whenever data or cellSize changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const pxW = width * cellSize;
        const pxH = height * cellSize;

        // Handle high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = pxW * dpr;
        canvas.height = pxH * dpr;
        canvas.style.width = `${pxW}px`;
        canvas.style.height = `${pxH}px`;

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, pxW, pxH);

        // ═══ BATCH RENDER: one fillStyle set per terrain type ═══
        const paintBatch = (coords, color) => {
            ctx.fillStyle = color;
            for (let i = 0; i < coords.length; i += 2) {
                ctx.fillRect(coords[i] * cellSize, coords[i + 1] * cellSize, cellSize, cellSize);
            }
        };

        // Paint in z-order: water → forest → sawah → dirt roads → main roads
        paintBatch(tileClassification.water, TERRAIN_COLORS.water);
        paintBatch(tileClassification.forest, TERRAIN_COLORS.forest);
        paintBatch(tileClassification.sawah, TERRAIN_COLORS.sawah);
        paintBatch(tileClassification.dirtRoad, TERRAIN_COLORS.dirtRoad);
        paintBatch(tileClassification.road, TERRAIN_COLORS.road);
        paintBatch(tileClassification.flower, TERRAIN_COLORS.flower);
        paintBatch(tileClassification.bridge, TERRAIN_COLORS.bridge);

        // ═══ GRID LINES (ultra-subtle blueprint feel) ═══
        const gridStep = cellSize * 5;
        ctx.strokeStyle = 'rgba(120,100,70,0.08)';  // Blueprint XII.B: warm brown grid
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let x = 0; x <= pxW; x += gridStep) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, pxH);
        }
        for (let y = 0; y <= pxH; y += gridStep) {
            ctx.moveTo(0, y);
            ctx.lineTo(pxW, y);
        }
        ctx.stroke();

        // ═══ AXIS LABEL ═══
        ctx.fillStyle = 'rgba(80,60,30,0.4)';  // Blueprint XII.B: warm brown labels
        ctx.font = '900 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('JALAN UTAMA', (centerX || width / 2) * cellSize, 12);

    }, [tileClassification, width, height, cellSize, centerX]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
        />
    );
}
