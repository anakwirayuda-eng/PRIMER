/**
 * @reflection
 * [IDENTITY]: PixelSceneRenderer
 * [PURPOSE]: Pure CSS/Canvas pixel art interior scenes for buildings.
 *            Renders stylized isometric-ish interiors with clickable hotspots
 *            overlaid on the pixel art. Each building type has a unique scene.
 * [STATE]: New
 * [ANCHOR]: PixelSceneRenderer
 * [DEPENDS_ON]: React
 */

import React, { useRef, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// PIXEL COLOR PALETTE
// ═══════════════════════════════════════════════════════════════

const PAL = {
    // Walls & Floor
    wall_light: '#c4a882', wall_mid: '#a38b6d', wall_dark: '#7d6b52',
    floor_light: '#d4c4a8', floor_mid: '#b8a88c', floor_dark: '#9c8d71', floor_tile: '#a89878',
    // Wood
    wood_light: '#c49a6c', wood_mid: '#a67c52', wood_dark: '#7a5c3c', wood_frame: '#5c4430',
    // Medical / Posyandu
    table_white: '#e8e8e0', table_shadow: '#c8c8b8', curtain_green: '#4a9e6e', curtain_dark: '#357a52',
    cloth_blue: '#5b8ec9', cloth_dark: '#3d6fa8',
    // Metal
    metal_light: '#b0b8c0', metal_mid: '#8898a0', metal_dark: '#607078',
    // Red accent
    red_light: '#d4483c', red_dark: '#a83830', cross_white: '#f0f0e8',
    // Green foliage
    leaf_light: '#6ebe58', leaf_mid: '#4a9e3c', leaf_dark: '#357a2c',
    // Water
    water_light: '#6cb8d4', water_mid: '#4a98b8', water_dark: '#38789c',
    // Sky & ambient
    sky: '#87ceeb', shadow: 'rgba(0,0,0,0.15)',
    // Rice/grain
    rice_green: '#8ebc6e', rice_gold: '#c4a43c',
    // Animal
    chicken_white: '#f0e8d0', cow_brown: '#8b6848',
};

// ═══════════════════════════════════════════════════════════════
// DRAWING HELPERS
// ═══════════════════════════════════════════════════════════════

function drawRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
}

function drawPixelBorder(ctx, x, y, w, h, color, thickness = 1) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, thickness); // top
    ctx.fillRect(x, y + h - thickness, w, thickness); // bottom
    ctx.fillRect(x, y, thickness, h); // left
    ctx.fillRect(x + w - thickness, y, thickness, h); // right
}

function drawTable(ctx, x, y, w, h, topColor, legColor) {
    // Table top
    drawRect(ctx, x, y, w, 4, topColor);
    drawRect(ctx, x + 1, y + 1, w - 2, 2, PAL.shadow);
    // Legs
    drawRect(ctx, x + 2, y + 4, 3, h - 4, legColor);
    drawRect(ctx, x + w - 5, y + 4, 3, h - 4, legColor);
}

function drawChair(ctx, x, y, color) {
    drawRect(ctx, x, y, 8, 3, color); // seat
    drawRect(ctx, x, y - 8, 2, 8, color); // back left
    drawRect(ctx, x + 6, y - 8, 2, 8, color); // back right
    drawRect(ctx, x, y - 8, 8, 2, color); // back top
    drawRect(ctx, x + 1, y + 3, 2, 5, color); // leg front
    drawRect(ctx, x + 5, y + 3, 2, 5, color); // leg back
}

function drawPerson(ctx, x, y, headColor, bodyColor, isSmall = false) {
    const s = isSmall ? 0.6 : 1;
    const hs = Math.floor(6 * s);
    // Head
    drawRect(ctx, x - Math.floor(hs / 2), y - Math.floor(hs * 3), hs, hs, headColor);
    // Body
    drawRect(ctx, x - Math.floor(hs * 0.6), y - Math.floor(hs * 2), Math.floor(hs * 1.2), Math.floor(hs * 2), bodyColor);
}

function drawCross(ctx, x, y, size, color) {
    const t = Math.max(2, Math.floor(size / 3));
    drawRect(ctx, x - Math.floor(size / 2), y - Math.floor(t / 2), size, t, color);
    drawRect(ctx, x - Math.floor(t / 2), y - Math.floor(size / 2), t, size, color);
}

// ═══════════════════════════════════════════════════════════════
// SCENE RENDERERS
// ═══════════════════════════════════════════════════════════════

function drawPosyanduScene(ctx, w, h) {
    const scale = w / 400;
    const s = (v) => Math.floor(v * scale);

    // === FLOOR ===
    for (let row = 0; row < h; row += s(8)) {
        for (let col = 0; col < w; col += s(8)) {
            const checker = ((Math.floor(col / s(8)) + Math.floor(row / s(8))) % 2 === 0);
            drawRect(ctx, col, row, s(8), s(8), checker ? PAL.floor_light : PAL.floor_tile);
        }
    }

    // === BACK WALL ===
    drawRect(ctx, 0, 0, w, s(70), PAL.wall_light);
    drawRect(ctx, 0, s(68), w, s(4), PAL.wall_dark);
    // Wall decoration — banner
    drawRect(ctx, s(10), s(10), s(140), s(20), PAL.curtain_green);
    drawRect(ctx, s(10), s(10), s(140), s(3), PAL.curtain_dark);
    // "POSYANDU" text area (block letters)
    drawRect(ctx, s(30), s(14), s(100), s(12), PAL.cross_white);
    // Red cross on wall
    drawCross(ctx, s(330), s(30), s(16), PAL.red_light);

    // === MEJA 1: PENDAFTARAN (left) ===
    drawTable(ctx, s(20), s(100), s(50), s(20), PAL.table_white, PAL.wood_mid);
    drawChair(ctx, s(30), s(124), PAL.wood_light);
    // Paper/book on table
    drawRect(ctx, s(25), s(97), s(12), s(8), PAL.cross_white);
    drawRect(ctx, s(40), s(97), s(8), s(6), PAL.cloth_blue);
    // Kader at desk
    drawPerson(ctx, s(35), s(95), '#d4a574', PAL.curtain_green);

    // === MEJA 2: PENIMBANGAN (center-left) ===
    drawTable(ctx, s(100), s(110), s(40), s(18), PAL.table_white, PAL.wood_mid);
    // Scale/timbangan
    drawRect(ctx, s(108), s(105), s(24), s(8), PAL.metal_light);
    drawRect(ctx, s(116), s(98), s(8), s(8), PAL.metal_mid);
    drawRect(ctx, s(112), s(96), s(16), s(3), PAL.metal_dark);
    // Ibu with baby
    drawPerson(ctx, s(125), s(140), '#d4a574', PAL.cloth_blue);
    drawPerson(ctx, s(132), s(144), '#e0c09c', '#f0a0a0', true);

    // === MEJA 3: KMS (center) ===
    drawTable(ctx, s(170), s(100), s(50), s(18), PAL.table_white, PAL.wood_mid);
    // KMS card
    drawRect(ctx, s(178), s(96), s(16), s(10), '#a0d080');
    drawRect(ctx, s(180), s(97), s(12), s(1), PAL.wood_dark);
    drawRect(ctx, s(180), s(99), s(12), s(1), PAL.wood_dark);
    drawRect(ctx, s(180), s(101), s(12), s(1), PAL.wood_dark);
    // Pen
    drawRect(ctx, s(198), s(96), s(2), s(10), PAL.cloth_blue);
    drawChair(ctx, s(182), s(122), PAL.wood_light);

    // === MEJA 4: PENYULUHAN (center-right) ===
    drawTable(ctx, s(250), s(130), s(60), s(18), PAL.table_white, PAL.wood_mid);
    drawChair(ctx, s(260), s(152), PAL.wood_light);
    drawChair(ctx, s(275), s(152), PAL.wood_light);
    drawChair(ctx, s(290), s(152), PAL.wood_light);
    // Poster on wall above
    drawRect(ctx, s(255), s(30), s(50), s(30), PAL.cross_white);
    drawRect(ctx, s(258), s(33), s(44), s(24), '#b8d8a0');
    drawCross(ctx, s(280), s(45), s(8), PAL.red_light);
    // Speaker/educator
    drawPerson(ctx, s(280), s(125), '#d4a574', PAL.red_light);

    // === MEJA 5: PELAYANAN (right) ===
    drawTable(ctx, s(330), s(95), s(50), s(18), PAL.table_white, PAL.wood_mid);
    // Syringe
    drawRect(ctx, s(340), s(91), s(14), s(3), PAL.metal_light);
    drawRect(ctx, s(354), s(92), s(4), s(1), PAL.metal_dark);
    // Medicine box
    drawRect(ctx, s(360), s(88), s(14), s(10), PAL.cross_white);
    drawCross(ctx, s(367), s(93), s(6), PAL.red_light);
    // Nurse/doctor
    drawPerson(ctx, s(355), s(90), '#d4a574', PAL.cross_white);

    // === DECORATIONS ===
    // Curtains on sides
    for (let i = 0; i < s(180); i += s(6)) {
        drawRect(ctx, 0, s(72) + i, s(6), s(5), i % s(12) === 0 ? PAL.curtain_green : PAL.curtain_dark);
        drawRect(ctx, w - s(6), s(72) + i, s(6), s(5), i % s(12) === 0 ? PAL.curtain_green : PAL.curtain_dark);
    }

    // Waiting mothers (bottom)
    drawPerson(ctx, s(80), s(170), '#d4a574', '#e0a0c0');
    drawPerson(ctx, s(87), s(174), '#e0c09c', '#f0d0a0', true);
    drawPerson(ctx, s(150), s(175), '#c49060', '#80b0d0');
    drawPerson(ctx, s(200), s(172), '#d4a574', '#d080a0');
    drawPerson(ctx, s(206), s(176), '#e0c09c', '#a0d0a0', true);

    // Plant pot
    drawRect(ctx, s(380), s(155), s(12), s(14), PAL.wood_dark);
    drawRect(ctx, s(382), s(140), s(8), s(16), PAL.leaf_mid);
    drawRect(ctx, s(378), s(135), s(6), s(8), PAL.leaf_light);
    drawRect(ctx, s(390), s(138), s(6), s(8), PAL.leaf_light);
}

function drawSchoolScene(ctx, w, h) {
    const scale = w / 400;
    const s = (v) => Math.floor(v * scale);

    // === FLOOR ===
    for (let row = 0; row < h; row += s(10)) {
        for (let col = 0; col < w; col += s(10)) {
            const checker = ((Math.floor(col / s(10)) + Math.floor(row / s(10))) % 2 === 0);
            drawRect(ctx, col, row, s(10), s(10), checker ? '#d8d0c0' : '#c8c0a8');
        }
    }

    // === BACK WALL ===
    drawRect(ctx, 0, 0, w, s(80), '#e8dcc8');
    drawRect(ctx, 0, s(78), w, s(4), PAL.wall_dark);

    // === WINDOWS ===
    for (let wx = s(20); wx < w - s(20); wx += s(90)) {
        drawRect(ctx, wx, s(15), s(50), s(45), '#a0d4f0');
        drawPixelBorder(ctx, wx, s(15), s(50), s(45), PAL.wood_frame, s(3));
        drawRect(ctx, wx + s(24), s(15), s(3), s(45), PAL.wood_frame);
        drawRect(ctx, wx, s(36), s(50), s(3), PAL.wood_frame);
    }

    // === BLACKBOARD ===
    drawRect(ctx, s(150), s(8), s(100), s(55), '#2d4a2d');
    drawPixelBorder(ctx, s(150), s(8), s(100), s(55), PAL.wood_mid, s(3));
    // Chalk text
    drawRect(ctx, s(165), s(18), s(50), s(2), '#c0d0b0');
    drawRect(ctx, s(165), s(25), s(70), s(2), '#c0d0b0');
    drawRect(ctx, s(165), s(32), s(40), s(2), '#c0d0b0');

    // === DESKS (student) ===
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            const dx = s(40) + col * s(80);
            const dy = s(100) + row * s(30);
            drawTable(ctx, dx, dy, s(30), s(12), PAL.wood_light, PAL.wood_dark);
            // Student
            if (!(row === 0 && col === 1)) { // empty seat
                drawPerson(ctx, dx + s(15), dy - s(3), '#d4a574', col % 2 === 0 ? '#e0e8f0' : '#e0e8f0');
            }
        }
    }

    // === UKS CORNER (right) ===
    drawRect(ctx, s(340), s(82), s(60), s(70), '#f0e8d8');
    drawPixelBorder(ctx, s(340), s(82), s(60), s(70), PAL.wall_dark, s(2));
    // Bed
    drawRect(ctx, s(348), s(120), s(44), s(16), PAL.cross_white);
    drawRect(ctx, s(345), s(118), s(6), s(20), PAL.wood_mid);
    // First aid box
    drawRect(ctx, s(355), s(88), s(16), s(12), PAL.cross_white);
    drawCross(ctx, s(363), s(94), s(6), PAL.red_light);
    // Sign
    drawRect(ctx, s(350), s(72), s(40), s(8), PAL.cross_white);

    // === KANTIN (bottom-left) ===
    drawRect(ctx, s(5), s(160), s(120), s(40), PAL.wall_light);
    drawTable(ctx, s(15), s(170), s(40), s(14), PAL.wood_light, PAL.wood_dark);
    // Food
    drawRect(ctx, s(20), s(166), s(8), s(6), PAL.red_light);
    drawRect(ctx, s(32), s(167), s(10), s(5), '#f0d040');
    drawRect(ctx, s(46), s(168), s(6), s(4), PAL.leaf_mid);
    // Bu Warung
    drawPerson(ctx, s(90), s(165), '#d4a574', '#f0c040');

    // === TEACHER ===
    drawPerson(ctx, s(200), s(85), '#d4a574', PAL.cloth_blue);
}

function drawFarmScene(ctx, w, h) {
    const scale = w / 400;
    const s = (v) => Math.floor(v * scale);

    // === SKY ===
    drawRect(ctx, 0, 0, w, s(60), '#87ceeb');
    // Mountains
    const drawMtn = (x, pw, ph, color) => {
        for (let row = 0; row < ph; row++) {
            const half = Math.floor((pw / 2) * (1 - row / ph));
            drawRect(ctx, x + Math.floor(pw / 2) - half, s(60) - ph + row, half * 2, 1, color);
        }
    };
    drawMtn(s(30), s(120), s(40), '#6a8e5a');
    drawMtn(s(100), s(80), s(30), '#7a9e6a');
    drawMtn(s(280), s(100), s(35), '#5a7e4a');
    // Trees
    for (let tx of [s(10), s(60), s(180), s(350), s(380)]) {
        drawRect(ctx, tx, s(40), s(4), s(20), PAL.wood_dark);
        drawRect(ctx, tx - s(8), s(28), s(20), s(16), PAL.leaf_mid);
        drawRect(ctx, tx - s(5), s(25), s(14), s(8), PAL.leaf_light);
    }

    // === RICE PADDY ===
    drawRect(ctx, 0, s(60), w, s(50), '#a0c87c');
    // Water reflection in paddies
    for (let py = s(65); py < s(105); py += s(8)) {
        for (let px = s(10); px < s(200); px += s(12)) {
            drawRect(ctx, px, py, s(8), s(5), py % s(16) < s(8) ? PAL.rice_green : '#90b868');
        }
    }
    // Farmer without boots
    drawPerson(ctx, s(60), s(80), '#c49060', '#8080a0');
    drawPerson(ctx, s(120), s(85), '#d4a574', '#706880');
    // Bare feet detail
    drawRect(ctx, s(57), s(90), s(6), s(3), '#c49060');
    drawRect(ctx, s(117), s(95), s(6), s(3), '#c49060');

    // === GUDANG (center-right) ===
    drawRect(ctx, s(220), s(60), s(80), s(60), PAL.wood_mid);
    drawRect(ctx, s(220), s(55), s(84), s(8), PAL.wood_dark); // Roof
    drawRect(ctx, s(218), s(52), s(88), s(5), '#6a5040'); // Roof top
    // Door
    drawRect(ctx, s(245), s(80), s(30), s(40), PAL.wood_dark);
    drawRect(ctx, s(248), s(83), s(24), s(34), '#4a3a28');
    // Pesticide bottles (!)
    drawRect(ctx, s(228), s(90), s(8), s(12), '#e04040');
    drawRect(ctx, s(228), s(87), s(8), s(4), PAL.metal_light);
    // Rice sacks
    drawRect(ctx, s(278), s(95), s(16), s(20), '#d4c488');
    drawRect(ctx, s(282), s(88), s(12), s(18), '#c4b478');

    // === KANDANG (right) ===
    drawRect(ctx, s(320), s(80), s(70), s(40), PAL.wood_light);
    drawPixelBorder(ctx, s(320), s(80), s(70), s(40), PAL.wood_dark, s(2));
    // Fence slats
    for (let fx = s(325); fx < s(385); fx += s(10)) {
        drawRect(ctx, fx, s(82), s(2), s(36), PAL.wood_mid);
    }
    // Cow
    drawRect(ctx, s(340), s(95), s(20), s(12), PAL.cow_brown);
    drawRect(ctx, s(336), s(92), s(8), s(8), PAL.cow_brown);
    // Chickens
    drawRect(ctx, s(370), s(105), s(6), s(5), PAL.chicken_white);
    drawRect(ctx, s(368), s(103), s(4), s(4), PAL.chicken_white);
    drawRect(ctx, s(380), s(108), s(5), s(4), PAL.chicken_white);
    // Dead chicken (!)
    drawRect(ctx, s(360), s(112), s(6), s(3), '#c0b8a0');
    drawRect(ctx, s(360), s(115), s(1), s(2), '#808080');

    // === RIVER (bottom) ===
    drawRect(ctx, 0, s(130), w, s(60), PAL.water_mid);
    // Water ripples
    for (let ry = s(135); ry < s(185); ry += s(8)) {
        for (let rx = 0; rx < w; rx += s(20)) {
            drawRect(ctx, rx, ry, s(12), s(2), ry % s(16) < s(8) ? PAL.water_light : PAL.water_dark);
        }
    }
    // River bank
    drawRect(ctx, 0, s(125), w, s(8), '#8a7a5c');
    // Children playing
    drawPerson(ctx, s(80), s(150), '#e0c09c', '#f0a080', true);
    drawPerson(ctx, s(100), s(155), '#d4a574', '#80c0f0', true);
    drawPerson(ctx, s(160), s(148), '#c49060', '#f0d040', true);
    // Wound on child's leg (red dot)
    drawRect(ctx, s(98), s(158), s(3), s(2), PAL.red_light);
}

// ═══════════════════════════════════════════════════════════════
// HOTSPOT OVERLAY COMPONENT
// ═══════════════════════════════════════════════════════════════

// Hotspot positions as percentage of canvas (for responsive scaling)
const HOTSPOT_POSITIONS = {
    posyandu: {
        meja1: { x: 8, y: 42, w: 16, h: 20 },
        meja2: { x: 26, y: 40, w: 14, h: 22 },
        meja3: { x: 42, y: 38, w: 16, h: 20 },
        meja4: { x: 62, y: 55, w: 18, h: 22 },
        meja5: { x: 82, y: 38, w: 16, h: 20 },
    },
    school: {
        uks: { x: 83, y: 35, w: 16, h: 30 },
        kelas: { x: 15, y: 40, w: 55, h: 40 },
        kantin: { x: 2, y: 78, w: 32, h: 20 },
        lapangan_sekolah: { x: 35, y: 82, w: 30, h: 16 },
    },
    farm: {
        sawah: { x: 2, y: 28, w: 48, h: 30 },
        gudang: { x: 54, y: 24, w: 22, h: 32 },
        kandang: { x: 79, y: 34, w: 20, h: 24 },
        tepi_sungai: { x: 5, y: 66, w: 50, h: 30 },
    }
};

// ═══════════════════════════════════════════════════════════════
// MAIN RENDERER COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function PixelSceneRenderer({ buildingType, activeStation, completedStations, onStationClick }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    const drawScene = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        const w = rect.width;
        const h = Math.floor(w * 0.5); // 2:1 aspect ratio

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = false; // Pixel-perfect!

        // Clear
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, w, h);

        // Draw scene based on building type
        const bt = buildingType?.toLowerCase();
        if (bt === 'posyandu') drawPosyanduScene(ctx, w, h);
        else if (bt === 'school') drawSchoolScene(ctx, w, h);
        else if (bt === 'farm') drawFarmScene(ctx, w, h);
    }, [buildingType]);

    useEffect(() => {
        drawScene();
        const handleResize = () => drawScene();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [drawScene]);

    const bt = buildingType?.toLowerCase();
    const hotspots = HOTSPOT_POSITIONS[bt] || {};

    return (
        <div ref={containerRef} className="relative w-full select-none">
            <canvas
                ref={canvasRef}
                className="w-full rounded-xl"
                style={{ imageRendering: 'pixelated' }}
            />
            {/* Hotspot overlays */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
                {Object.entries(hotspots).map(([stationId, pos]) => {
                    const isActive = activeStation === stationId;
                    const isDone = completedStations?.has?.(stationId);

                    return (
                        <button
                            key={stationId}
                            onClick={() => onStationClick?.(stationId)}
                            className={`absolute transition-all duration-300 rounded-lg
                                ${isActive
                                    ? 'ring-2 ring-white/60 bg-white/15'
                                    : isDone
                                        ? 'bg-emerald-500/15 hover:bg-emerald-500/25'
                                        : 'bg-transparent hover:bg-white/10'
                                }
                            `}
                            style={{
                                left: `${pos.x}%`, top: `${pos.y}%`,
                                width: `${pos.w}%`, height: `${pos.h}%`
                            }}
                            aria-label={`Stasiun ${stationId}`}
                        >
                            {!isDone && !isActive && (
                                <span className="absolute top-1 right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                                </span>
                            )}
                            {isDone && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[8px] font-black shadow-sm">✓</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
