/**
 * @reflection
 * [IDENTITY]: Map2DTerrain
 * [PURPOSE]: Canonical canvas terrain renderer for the 2D Wilayah blueprint.
 *            Owns the Hybrid A+C terrain language: editorial cartography below,
 *            data-readable overlays above. Guardrail #2: no per-tile DOM nodes.
 * [STATE]: Runtime-Audited
 * [DEPENDS_ON]: constants.js (tile data for road/terrain positions)
 */

import React, { useRef, useEffect, useMemo } from 'react';
import { TILE_TYPES } from '../constants.js';

// ═══ TERRAIN COLOR PALETTE — Blueprint XII.B ═══
const TERRAIN_COLORS = {
    water: '#3f667f',
    forest: '#1d2e28',
    sawah: '#617465',
    road: '#5e676f',
    dirtRoad: '#786a5b',
    flower: '#8d6b79',
    bridge: '#8b7356',
    base: '#18242d',
    contour: 'rgba(187,210,221,0.08)',
    grid: 'rgba(148,163,184,0.07)',
    axis: 'rgba(196,211,219,0.36)',
};

const LAYER_WASH = {
    general: null,
    pispk: 'rgba(56,189,248,0.045)',
    surveillance: 'rgba(225,29,72,0.062)',
    psn: 'rgba(163,230,53,0.048)',
    phbs: 'rgba(244,114,182,0.04)',
    perilaku: 'rgba(129,140,248,0.048)',
};

// Colors are now hex strings — no rgbaStr needed

export default function Map2DTerrain({ mapData, cellSize, bridgeStatus = 'normal', showBridgeStatusDetails = true, activeLayer = 'general' }) {
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
                } else if (t === TILE_TYPES.ROAD_H || t === TILE_TYPES.ROAD_V || t === TILE_TYPES.ROAD_CROSS) {
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
        ctx.fillStyle = TERRAIN_COLORS.base;
        ctx.fillRect(0, 0, pxW, pxH);

        // ═══ BATCH RENDER: one fillStyle set per terrain type ═══
        const paintBatch = (coords, color) => {
            ctx.fillStyle = color;
            for (let i = 0; i < coords.length; i += 2) {
                ctx.fillRect(coords[i] * cellSize, coords[i + 1] * cellSize, cellSize, cellSize);
            }
        };

        const paintBridgeTiles = (color, options = {}) => {
            const {
                shadowColor = null,
                shadowBlur = 0,
                strokeColor = null,
                strokeWidth = 1
            } = options;

            ctx.save();
            if (shadowColor && shadowBlur > 0) {
                ctx.shadowColor = shadowColor;
                ctx.shadowBlur = shadowBlur;
            }
            ctx.fillStyle = color;
            for (let i = 0; i < tileClassification.bridge.length; i += 2) {
                const x = tileClassification.bridge[i] * cellSize;
                const y = tileClassification.bridge[i + 1] * cellSize;
                ctx.fillRect(x, y, cellSize, cellSize);
                if (strokeColor) {
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = strokeWidth;
                    ctx.strokeRect(x + 0.5, y + 0.5, Math.max(0, cellSize - 1), Math.max(0, cellSize - 1));
                }
            }
            ctx.restore();
        };

        const paintBridgeCrosses = (strokeColor) => {
            ctx.save();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = Math.max(1, cellSize * 0.12);
            for (let i = 0; i < tileClassification.bridge.length; i += 2) {
                const x = tileClassification.bridge[i] * cellSize;
                const y = tileClassification.bridge[i + 1] * cellSize;
                ctx.beginPath();
                ctx.moveTo(x + cellSize * 0.2, y + cellSize * 0.2);
                ctx.lineTo(x + cellSize * 0.8, y + cellSize * 0.8);
                ctx.moveTo(x + cellSize * 0.8, y + cellSize * 0.2);
                ctx.lineTo(x + cellSize * 0.2, y + cellSize * 0.8);
                ctx.stroke();
            }
            ctx.restore();
        };

        // Paint in z-order: water → forest → sawah → dirt roads → main roads
        paintBatch(tileClassification.water, TERRAIN_COLORS.water);
        paintBatch(tileClassification.forest, TERRAIN_COLORS.forest);
        paintBatch(tileClassification.sawah, TERRAIN_COLORS.sawah);
        paintBatch(tileClassification.dirtRoad, TERRAIN_COLORS.dirtRoad);
        paintBatch(tileClassification.road, TERRAIN_COLORS.road);
        paintBatch(tileClassification.flower, TERRAIN_COLORS.flower);
        paintBatch(tileClassification.bridge, TERRAIN_COLORS.bridge);

        // ═══ DIRECTIVE 2: 2.5D Elevation Shadows (sawah/hutan edges) ═══
        ctx.save();
        ctx.shadowColor = 'rgba(17,24,39,0.4)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        // Shadow along forest edge (x ≈ 15)
        ctx.fillStyle = 'rgba(15,23,42,0.12)';
        for (let y = 0; y < height; y++) {
            const edgeX = 15 + Math.sin(y * 0.25) * 4;
            ctx.fillRect(Math.floor(edgeX) * cellSize, y * cellSize, cellSize * 2, cellSize);
        }
        // Shadow along sawah top edge (y ≈ 82)
        ctx.shadowColor = 'rgba(107,114,128,0.22)';
        for (let x = 15; x < 140; x += 2) {
            ctx.fillRect(x * cellSize, 82 * cellSize, cellSize * 2, cellSize);
        }
        ctx.restore();

        // ═══ DIRECTIVE 4: Bezier River — Sungai Cikapas ═══
        ctx.save();
        // Main river body
        ctx.beginPath();
        ctx.moveTo(148 * cellSize, 0);
        ctx.bezierCurveTo(
            150 * cellSize, 30 * cellSize,   // CP1
            146 * cellSize, 60 * cellSize,   // CP2
            152 * cellSize, 119 * cellSize   // End
        );
        ctx.lineWidth = 6 * cellSize;
        ctx.strokeStyle = TERRAIN_COLORS.water;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Shimmer highlight
        ctx.beginPath();
        ctx.moveTo(148 * cellSize, 0);
        ctx.bezierCurveTo(
            150 * cellSize, 30 * cellSize,
            146 * cellSize, 60 * cellSize,
            152 * cellSize, 119 * cellSize
        );
        ctx.lineWidth = 2 * cellSize;
        ctx.strokeStyle = 'rgba(125,211,252,0.18)';
        ctx.stroke();
        ctx.restore();

        // ═══ DIRECTIVE 4: Bezier Roads — Jalan Utama ═══
        ctx.save();
        ctx.lineCap = 'round';
        // Horizontal main road (y=25) — slight curve for organic feel
        ctx.beginPath();
        ctx.moveTo(0, 25 * cellSize + cellSize / 2);
        ctx.bezierCurveTo(
            40 * cellSize, 24.5 * cellSize,  // slight upward bow
            120 * cellSize, 25.5 * cellSize,  // slight downward bow
            width * cellSize, 25 * cellSize + cellSize / 2
        );
        ctx.lineWidth = cellSize * 1.8;
        ctx.strokeStyle = TERRAIN_COLORS.road;
        ctx.stroke();
        // Road center line
        ctx.beginPath();
        ctx.moveTo(0, 25 * cellSize + cellSize / 2);
        ctx.bezierCurveTo(
            40 * cellSize, 24.5 * cellSize,
            120 * cellSize, 25.5 * cellSize,
            width * cellSize, 25 * cellSize + cellSize / 2
        );
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.setLineDash([cellSize * 2, cellSize * 2]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vertical main road (x=80)
        ctx.beginPath();
        ctx.moveTo(80 * cellSize + cellSize / 2, 5 * cellSize);
        ctx.bezierCurveTo(
            79.5 * cellSize, 40 * cellSize,
            80.5 * cellSize, 80 * cellSize,
            80 * cellSize + cellSize / 2, 115 * cellSize
        );
        ctx.lineWidth = cellSize * 1.5;
        ctx.strokeStyle = TERRAIN_COLORS.road;
        ctx.stroke();
        ctx.restore();

        // ═══ DIRECTIVE 1: Contour lines (XII.K Hack 1) ═══
        ctx.strokeStyle = TERRAIN_COLORS.contour;
        ctx.lineWidth = 0.5;
        // Horizontal contours in sawah zone
        for (let y = 84; y < height; y += 4) {
            ctx.beginPath();
            ctx.moveTo(15 * cellSize, y * cellSize);
            for (let x = 16; x < 140; x++) {
                ctx.lineTo(x * cellSize, (y + Math.sin(x * 0.3) * 0.5) * cellSize);
            }
            ctx.stroke();
        }

        const layerWash = LAYER_WASH[activeLayer] || null;
        if (layerWash) {
            ctx.save();
            ctx.fillStyle = layerWash;
            ctx.fillRect(0, 0, pxW, pxH);
            ctx.restore();
        }

        // ═══ GRID LINES (ultra-subtle blueprint feel) ═══
        const gridStep = cellSize * 5;
        ctx.strokeStyle = TERRAIN_COLORS.grid;
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
        ctx.fillStyle = TERRAIN_COLORS.axis;
        ctx.font = '900 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('JALAN UTAMA', (centerX || width / 2) * cellSize, 12);

        if (showBridgeStatusDetails) {
            if (bridgeStatus === 'rawan_banjir') {
                paintBridgeTiles('#d97706', {
                    strokeColor: 'rgba(34,211,238,0.75)',
                    strokeWidth: Math.max(1, cellSize * 0.08)
                });
            } else if (bridgeStatus === 'putus') {
                paintBridgeTiles('#dc2626', {
                    shadowColor: 'rgba(220,38,38,0.75)',
                    shadowBlur: 6,
                    strokeColor: '#450a0a',
                    strokeWidth: Math.max(1, cellSize * 0.08)
                });
                paintBridgeCrosses('#450a0a');
            }
        }

    }, [tileClassification, width, height, cellSize, centerX, bridgeStatus, showBridgeStatusDetails, activeLayer]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
        />
    );
}
