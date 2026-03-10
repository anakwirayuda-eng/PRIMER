/**
 * @reflection
 * [IDENTITY]: BuildingGenerator
 * [PURPOSE]: Helper for generating architectural and landmark textures.
 * [STATE]: Modular
 * [LAST_UPDATE]: 2026-02-14
 */

import { PALETTE, createTexture } from './TerrainGenerator.js';

export const drawBlock = (ctx, x, y, w, h, d, colorFront, colorTop, colorSide) => {
    ctx.fillStyle = colorFront;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = colorTop;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + d, y - d);
    ctx.lineTo(x + w + d, y - d);
    ctx.lineTo(x + w, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = colorSide;
    ctx.beginPath();
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w + d, y - d);
    ctx.lineTo(x + w + d, y + h - d);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
};


export const addBuildingTextures = (cache) => {
    // Basic Decorations
    cache.tree = createTexture(48, 64, (ctx) => {
        const w = 48, h = 64;
        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = 0.3; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(w / 2, h - 3, 15, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = PALETTE.woodMid; ctx.fillRect(w / 2 - 5, h - 24, 10, 24);
        ctx.fillStyle = PALETTE.grassDark; ctx.beginPath(); ctx.ellipse(w / 2, h / 2 + 6, 20, 18, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = PALETTE.grassMid; ctx.beginPath(); ctx.ellipse(w / 2 - 5, h / 2 + 2, 14, 12, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = PALETTE.grassLight; ctx.beginPath(); ctx.ellipse(w / 2 + 3, h / 2 - 4, 9, 7, 0, 0, Math.PI * 2); ctx.fill();
    });

    cache.bush = createTexture(32, 24, (ctx) => {
        const w = 32, h = 24;
        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = 0.25; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(w / 2, h - 2, 13, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = PALETTE.grassDark; ctx.beginPath(); ctx.ellipse(w / 2, h / 2 + 3, 14, 9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = PALETTE.grassMid; ctx.beginPath(); ctx.ellipse(w / 2 - 3, h / 2 + 1, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
    });

    cache.rock = createTexture(24, 18, (ctx) => {
        const w = 24, h = 18;
        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = 0.2; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(w / 2, h - 2, 10, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = '#6a6a6a'; ctx.beginPath(); ctx.ellipse(w / 2, h / 2 + 2, 10, 7, 0, 0, Math.PI * 2); ctx.fill();
    });

    // Houses
    const createHouse = (colorRoof, colorWall) => createTexture(48, 64, (ctx) => {
        const w = 48, h = 64;
        const d = 6; const bx = 8, by = 34, bw = 32, bh = 24;
        ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(w / 2 + 3, h - 4, 18, 5, 0, 0, Math.PI * 2); ctx.fill();
        drawBlock(ctx, bx, by, bw, bh, d, colorWall, '#fff', '#c0c0c0');
        const rx = bx - 3, ry = by, rw = bw + 6, rh = 18;
        ctx.fillStyle = colorRoof; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + rw / 2, ry - rh); ctx.lineTo(rx + rw, ry); ctx.fill();
        ctx.fillStyle = '#6b4a35'; ctx.fillRect(bx + bw / 2 - 4, by + bh - 16, 9, 16);
    });

    cache.house = createHouse(PALETTE.roofRed, PALETTE.wallCream);
    cache.houseBlue = createHouse(PALETTE.roofBlue, '#f0f4f8');
    cache.houseModern = createHouse('#475569', '#e2e8f0');
    cache.houseTrad = createHouse('#92400e', PALETTE.woodLight);

    // Medical Buildings
    cache.puskesmas = createTexture(80, 80, (ctx) => {
        const d = 8, bx = 12, by = 34, bw = 56, bh = 36;
        drawBlock(ctx, bx, by, bw, bh, d, '#ffffff', '#f1f5f9', '#cbd5e1');
        ctx.fillStyle = '#1e4d2b'; ctx.beginPath(); ctx.moveTo(bx - 4, by); ctx.lineTo(bx + bw + 4, by); ctx.lineTo(bx + bw / 2, by - 12); ctx.fill();
        ctx.fillStyle = '#0d9488'; ctx.fillRect(bx + 10, by - 10, 36, 10);
        ctx.fillStyle = '#bae6fd'; ctx.fillRect(bx + 12, by + bh - 18, 20, 18);
        // Cross symbol
        ctx.fillStyle = '#ef4444'; ctx.fillRect(bx + bw / 2 - 3, by + 6, 6, 14); ctx.fillRect(bx + bw / 2 - 7, by + 10, 14, 6);
    });

    cache.pustu = createTexture(64, 64, (ctx) => {
        const d = 6, bx = 12, by = 28, bw = 40, bh = 28;
        drawBlock(ctx, bx, by, bw, bh, d, '#ffffff', '#f8fafc', '#cbd5e1');
        ctx.fillStyle = '#1e4d2b'; ctx.beginPath(); ctx.moveTo(bx - 2, by); ctx.lineTo(bx + bw + 2, by); ctx.lineTo(bx + bw / 2, by - 10); ctx.fill();
        ctx.fillStyle = '#ef4444'; ctx.fillRect(bx + bw / 2 - 2, by + 4, 4, 10); ctx.fillRect(bx + bw / 2 - 5, by + 7, 10, 4);
    });

    cache.polindes = createTexture(64, 64, (ctx) => {
        const d = 5, bx = 12, by = 30, bw = 38, bh = 26;
        drawBlock(ctx, bx, by, bw, bh, d, '#fce7f3', '#fdf2f8', '#f9a8d4');
        ctx.fillStyle = '#db2777'; ctx.beginPath(); ctx.moveTo(bx - 2, by); ctx.lineTo(bx + bw + 2, by); ctx.lineTo(bx + bw / 2, by - 10); ctx.fill();
    });

    cache.posyandu = createTexture(64, 64, (ctx) => {
        const d = 5, bx = 12, by = 30, bw = 38, bh = 26;
        drawBlock(ctx, bx, by, bw, bh, d, '#dbeafe', '#eff6ff', '#93c5fd');
        ctx.fillStyle = '#2563eb'; ctx.beginPath(); ctx.moveTo(bx - 2, by); ctx.lineTo(bx + bw + 2, by); ctx.lineTo(bx + bw / 2, by - 10); ctx.fill();
    });

    // Cultural/Community
    cache.mosque = createTexture(80, 88, (ctx) => {
        const d = 6, bx = 16, by = 48, bw = 48, bh = 32;
        drawBlock(ctx, bx, by, bw, bh, d, '#ffffff', '#f8fafc', '#e2e8f0');
        const dx = bx + bw / 2 + d / 2, dy = by - 4, r = 24;
        ctx.fillStyle = '#166534'; ctx.beginPath(); ctx.arc(dx, dy, r, Math.PI, 0); ctx.bezierCurveTo(dx + r, dy + 12, dx - r, dy + 12, dx - r, dy); ctx.fill();
        // Minaret
        ctx.fillStyle = '#e2e8f0'; ctx.fillRect(bx + bw - 2, by - 20, 8, 20);
        ctx.fillStyle = '#166534'; ctx.beginPath(); ctx.arc(bx + bw + 2, by - 20, 6, Math.PI, 0); ctx.fill();
        // Crescent
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(dx, dy - r + 4, 4, 0, Math.PI * 2); ctx.fill();
    });

    cache.balaiDesa = createTexture(80, 72, (ctx) => {
        drawBlock(ctx, 10, 50, 60, 12, 6, PALETTE.woodMid, PALETTE.woodLight, PALETTE.woodDark);
        ctx.fillStyle = PALETTE.woodDark; ctx.fillRect(14, 24, 4, 26); ctx.fillRect(62, 24, 4, 26);
        ctx.fillStyle = '#7f1d1d'; ctx.beginPath(); ctx.moveTo(4, 24); ctx.lineTo(76, 24); ctx.lineTo(56, 8); ctx.lineTo(24, 8); ctx.fill();
    });

    // Government/Office
    cache.office = createTexture(72, 72, (ctx) => {
        const d = 7, bx = 10, by = 30, bw = 50, bh = 32;
        drawBlock(ctx, bx, by, bw, bh, d, '#f8fafc', '#ffffff', '#cbd5e1');
        ctx.fillStyle = '#1e3a5f'; ctx.fillRect(bx, by - 6, bw, 6);
        ctx.fillStyle = '#bae6fd'; ctx.fillRect(bx + 6, by + 8, 10, 12); ctx.fillRect(bx + 22, by + 8, 10, 12); ctx.fillRect(bx + 38, by + 8, 10, 12);
        // Flag
        ctx.fillStyle = '#4a5568'; ctx.fillRect(bx + bw / 2, by - 22, 2, 16);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(bx + bw / 2 + 2, by - 22, 10, 5);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(bx + bw / 2 + 2, by - 17, 10, 5);
    });

    cache.rumahDinas = createTexture(64, 64, (ctx) => {
        const d = 6, bx = 10, by = 28, bw = 42, bh = 28;
        drawBlock(ctx, bx, by, bw, bh, d, '#fef3c7', '#fffbeb', '#fcd34d');
        ctx.fillStyle = '#92400e'; ctx.beginPath(); ctx.moveTo(bx - 3, by); ctx.lineTo(bx + bw / 2, by - 14); ctx.lineTo(bx + bw + 3, by); ctx.fill();
        ctx.fillStyle = '#78350f'; ctx.fillRect(bx + bw / 2 - 5, by + bh - 18, 10, 18);
        ctx.fillStyle = '#bae6fd'; ctx.fillRect(bx + 6, by + 6, 8, 8); ctx.fillRect(bx + bw - 14, by + 6, 8, 8);
    });

    // Education
    cache.school = createTexture(80, 72, (ctx) => {
        const d = 7, bx = 8, by = 32, bw = 60, bh = 30;
        drawBlock(ctx, bx, by, bw, bh, d, '#fef9c3', '#fefce8', '#fde047');
        ctx.fillStyle = '#854d0e'; ctx.beginPath(); ctx.moveTo(bx - 4, by); ctx.lineTo(bx + bw + 4, by); ctx.lineTo(bx + bw / 2, by - 14); ctx.fill();
        ctx.fillStyle = '#bae6fd'; ctx.fillRect(bx + 8, by + 8, 10, 10); ctx.fillRect(bx + 24, by + 8, 10, 10); ctx.fillRect(bx + 40, by + 8, 10, 10);
        ctx.fillStyle = '#713f12'; ctx.fillRect(bx + bw / 2 - 5, by + bh - 16, 10, 16);
    });

    cache.tk = createTexture(64, 64, (ctx) => {
        const d = 5, bx = 10, by = 30, bw = 42, bh = 24;
        drawBlock(ctx, bx, by, bw, bh, d, '#fbcfe8', '#fdf2f8', '#f9a8d4');
        ctx.fillStyle = '#be185d'; ctx.beginPath(); ctx.moveTo(bx - 2, by); ctx.lineTo(bx + bw + 2, by); ctx.lineTo(bx + bw / 2, by - 10); ctx.fill();
        ctx.fillStyle = '#bae6fd'; ctx.fillRect(bx + 6, by + 4, 8, 8); ctx.fillRect(bx + bw - 14, by + 4, 8, 8);
    });

    // Commerce
    cache.market = createTexture(80, 72, (ctx) => {
        const d = 7, bx = 8, by = 36, bw = 60, bh = 28;
        drawBlock(ctx, bx, by, bw, bh, d, '#fde68a', '#fef9c3', '#f59e0b');
        // Awning
        ctx.fillStyle = '#dc2626';
        for (let i = 0; i < 6; i++) {
            const sx = bx + i * 10;
            ctx.beginPath(); ctx.moveTo(sx, by); ctx.lineTo(sx + 5, by - 8); ctx.lineTo(sx + 10, by); ctx.fill();
        }
        ctx.fillStyle = '#78350f'; ctx.fillRect(bx + 10, by + bh - 14, 8, 14); ctx.fillRect(bx + bw - 18, by + bh - 14, 8, 14);
    });

    // Infrastructure
    cache.well = createTexture(48, 48, (ctx) => {
        const w = 48, h = 48;
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 4, 16, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#6b7280'; ctx.beginPath(); ctx.ellipse(w / 2, h / 2 + 6, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.ellipse(w / 2, h / 2 + 4, 10, 6, 0, 0, Math.PI * 2); ctx.fill();
        // Support posts
        ctx.fillStyle = PALETTE.woodMid; ctx.fillRect(w / 2 - 12, h / 2 - 10, 3, 16); ctx.fillRect(w / 2 + 10, h / 2 - 10, 3, 16);
        ctx.fillRect(w / 2 - 12, h / 2 - 10, 25, 3);
    });

    cache.mck = createTexture(56, 56, (ctx) => {
        const d = 5, bx = 8, by = 24, bw = 36, bh = 24;
        drawBlock(ctx, bx, by, bw, bh, d, '#e0f2fe', '#f0f9ff', '#7dd3fc');
        ctx.fillStyle = '#0284c7'; ctx.fillRect(bx, by - 4, bw, 4);
        ctx.fillStyle = '#0369a1'; ctx.fillRect(bx + bw / 2 - 4, by + bh - 14, 8, 14);
    });

    cache.pamsimas = createTexture(56, 56, (ctx) => {
        const w = 56, h = 56;
        ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.beginPath(); ctx.ellipse(w / 2, h - 4, 18, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(w / 2 - 3, 8, 6, h - 16);
        ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.ellipse(w / 2, h - 10, 16, 8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#60a5fa'; ctx.beginPath(); ctx.ellipse(w / 2, h - 12, 12, 5, 0, 0, Math.PI * 2); ctx.fill();
    });

    cache.bankSampah = createTexture(56, 56, (ctx) => {
        const d = 5, bx = 8, by = 24, bw = 36, bh = 24;
        drawBlock(ctx, bx, by, bw, bh, d, '#d1fae5', '#ecfdf5', '#6ee7b7');
        ctx.fillStyle = '#059669'; ctx.fillRect(bx, by - 4, bw, 4);
        // Recycle arrows hint
        ctx.fillStyle = '#059669'; ctx.beginPath(); ctx.arc(bx + bw / 2, by + bh / 2, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#d1fae5'; ctx.beginPath(); ctx.arc(bx + bw / 2, by + bh / 2, 3, 0, Math.PI * 2); ctx.fill();
    });

    // Sports/Recreation
    cache.lapangan = createTexture(80, 80, (ctx) => {
        ctx.fillStyle = '#166534'; ctx.fillRect(8, 8, 64, 64);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.strokeRect(12, 12, 56, 56);
        ctx.beginPath(); ctx.moveTo(40, 12); ctx.lineTo(40, 68); ctx.stroke();
        ctx.beginPath(); ctx.arc(40, 40, 12, 0, Math.PI * 2); ctx.stroke();
    });

    cache.alun_alun = createTexture(80, 80, (ctx) => {
        ctx.fillStyle = '#4ade80'; ctx.fillRect(4, 4, 72, 72);
        ctx.fillStyle = '#86efac'; ctx.fillRect(16, 16, 48, 48);
        // Flag pole
        ctx.fillStyle = '#4b5563'; ctx.fillRect(38, 20, 3, 30);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(41, 20, 12, 6);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(41, 26, 12, 6);
        // Benches
        ctx.fillStyle = PALETTE.woodMid; ctx.fillRect(10, 36, 10, 4); ctx.fillRect(60, 36, 10, 4);
    });

    cache.playground = createTexture(64, 64, (ctx) => {
        ctx.fillStyle = '#bbf7d0'; ctx.fillRect(4, 4, 56, 56);
        // Swing frame
        ctx.fillStyle = '#fb923c'; ctx.fillRect(18, 16, 3, 30); ctx.fillRect(42, 16, 3, 30); ctx.fillRect(18, 16, 27, 3);
        // Swing seat
        ctx.fillStyle = '#78350f'; ctx.fillRect(26, 38, 10, 3);
        ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(28, 19); ctx.lineTo(28, 38); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(34, 19); ctx.lineTo(34, 38); ctx.stroke();
    });

    // Community Health
    cache.posGizi = createTexture(56, 56, (ctx) => {
        const d = 5, bx = 8, by = 24, bw = 36, bh = 24;
        drawBlock(ctx, bx, by, bw, bh, d, '#fef3c7', '#fffbeb', '#fcd34d');
        ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.moveTo(bx - 2, by); ctx.lineTo(bx + bw + 2, by); ctx.lineTo(bx + bw / 2, by - 8); ctx.fill();
    });

    cache.rtk = createTexture(56, 56, (ctx) => {
        const d = 5, bx = 8, by = 24, bw = 36, bh = 24;
        drawBlock(ctx, bx, by, bw, bh, d, '#e0e7ff', '#eef2ff', '#a5b4fc');
        ctx.fillStyle = '#4338ca'; ctx.fillRect(bx, by - 4, bw, 4);
    });

    // Cemetery
    cache.tpu = createTexture(64, 64, (ctx) => {
        ctx.fillStyle = '#6b7280';
        // Gravestones
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                const gx = 12 + i * 16, gy = 18 + j * 20;
                ctx.fillRect(gx, gy, 8, 14);
                ctx.beginPath(); ctx.arc(gx + 4, gy, 4, Math.PI, 0); ctx.fill();
            }
        }
        // Fence
        ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1;
        ctx.strokeRect(4, 8, 56, 48);
    });

    // Nature/TOGA
    cache.toga = createTexture(64, 64, (ctx) => {
        const w = 64, h = 64;
        ctx.fillStyle = '#4ade80'; ctx.fillRect(8, 20, 48, 36);
        ctx.strokeStyle = PALETTE.woodMid; ctx.lineWidth = 2; ctx.strokeRect(8, 20, 48, 36);
        // Plants
        ctx.fillStyle = '#166534';
        ctx.beginPath(); ctx.ellipse(20, 32, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(36, 36, 7, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(50, 30, 5, 7, 0, 0, Math.PI * 2); ctx.fill();
        // Sign
        ctx.fillStyle = PALETTE.woodMid; ctx.fillRect(w / 2 - 2, 8, 4, 12);
        ctx.fillStyle = '#fef3c7'; ctx.fillRect(w / 2 - 10, 4, 20, 8);
    });

    cache.iks_scoreboard = createTexture(72, 72, (ctx) => {
        // Board frame
        ctx.fillStyle = PALETTE.woodMid; ctx.fillRect(12, 8, 48, 56);
        ctx.fillStyle = PALETTE.woodDark; ctx.strokeStyle = PALETTE.woodDark; ctx.lineWidth = 3; ctx.strokeRect(12, 8, 48, 56);
        // Board face
        ctx.fillStyle = '#1e293b'; ctx.fillRect(16, 12, 40, 48);
        // IKS bars
        ctx.fillStyle = '#10b981'; ctx.fillRect(20, 20, 32, 6);
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(20, 30, 24, 6);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(20, 40, 16, 6);
        // Post
        ctx.fillStyle = PALETTE.woodMid; ctx.fillRect(32, 56, 8, 12);
    });

    // Landmarks
    cache.hutan_lindung = createTexture(96, 96, (ctx) => {
        // Multiple trees for forest effect
        const treeColors = ['#166534', '#14532d', '#15803d', '#166534', '#065f46'];
        treeColors.forEach((c, i) => {
            const tx = 16 + i * 14, ty = 40 + (i % 2) * 10;
            ctx.fillStyle = PALETTE.woodMid; ctx.fillRect(tx + 4, ty + 10, 6, 16);
            ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(tx + 7, ty, 12, 14, 0, 0, Math.PI * 2); ctx.fill();
        });
    });

    cache.sungai_cikapas = createTexture(64, 96, (ctx) => {
        // River flowing downward
        ctx.fillStyle = '#1e40af';
        ctx.beginPath();
        ctx.moveTo(20, 0); ctx.bezierCurveTo(10, 24, 40, 48, 24, 96);
        ctx.lineTo(44, 96); ctx.bezierCurveTo(54, 48, 24, 24, 40, 0);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#60a5fa'; ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(26, 0); ctx.bezierCurveTo(16, 24, 40, 48, 28, 96);
        ctx.lineTo(38, 96); ctx.bezierCurveTo(48, 48, 24, 24, 36, 0);
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
    });

    cache.gapura_desa = createTexture(80, 80, (ctx) => {
        // Left pillar
        ctx.fillStyle = '#b45309'; ctx.fillRect(14, 20, 12, 48);
        // Right pillar
        ctx.fillRect(54, 20, 12, 48);
        // Top arch
        ctx.fillStyle = '#92400e'; ctx.fillRect(10, 14, 60, 10);
        // Peak
        ctx.fillStyle = '#7c2d12'; ctx.beginPath(); ctx.moveTo(20, 14); ctx.lineTo(40, 2); ctx.lineTo(60, 14); ctx.fill();
        // Ornament
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(40, 8, 3, 0, Math.PI * 2); ctx.fill();
    });

    cache.sawah_berundak = createTexture(96, 80, (ctx) => {
        // Terraced rice paddies
        const terraces = ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534'];
        terraces.forEach((c, i) => {
            ctx.fillStyle = c;
            ctx.fillRect(8 + i * 3, 12 + i * 14, 80 - i * 6, 14);
            ctx.fillStyle = '#3b82f6'; ctx.globalAlpha = 0.3;
            ctx.fillRect(12 + i * 3, 12 + i * 14, 72 - i * 6, 2);
            ctx.globalAlpha = 1;
        });
    });

    // Aliases for natural features
    cache.forest = cache.hutan_lindung;
    cache.river = cache.sungai_cikapas;
};
