/**
 * @reflection
 * [IDENTITY]: TerrainGenerator
 * [PURPOSE]: Helper for generating terrain and path textures.
 * [STATE]: Modular
 * [LAST_UPDATE]: 2026-02-14
 */

export const PALETTE = {
    grassDark: '#3a6629',
    grassMid: '#5a8c3e',
    grassLight: '#7db356',
    woodDark: '#4a3728',
    woodMid: '#6b4a35',
    woodLight: '#8c6b4a',
    roofRed: '#a64b4b',
    roofRedLight: '#c96b6b',
    roofGreen: '#4a7a4a',
    roofGreenLight: '#6a9a6a',
    roofYellow: '#b8a048',
    roofYellowLight: '#d8c068',
    roofBlue: '#4a6a8c',
    roofBlueLight: '#6a8aac',
    wallWhite: '#e8e0d0',
    wallCream: '#d8d0c0',
    waterDark: '#3a7a8e',
    waterMid: '#5ba3b8',
    waterLight: '#a2dbe8',
    dirtDark: '#6b543a',
    dirtMid: '#9a7b5a',
    dirtLight: '#b08d6a',
};

export const createTexture = (width, height, drawFn) => {
    if (typeof document === 'undefined') return ''; // SSR/Headless fallback
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, width, height);
    return canvas.toDataURL('image/png');
};

export const addTerrainTextures = (cache) => {
    cache.grass = createTexture(64, 64, (ctx, w, h) => {
        ctx.fillStyle = PALETTE.grassMid;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 0.35;
        for (let i = 0; i < 6; i++) {
            const x = (i * 19 + 8) % w;
            const y = (i * 23 + 6) % h;
            ctx.fillStyle = PALETTE.grassLight;
            ctx.beginPath();
            ctx.ellipse(x, y, 7, 5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        for (let i = 0; i < 5; i++) {
            const x = (i * 17 + 15) % w;
            const y = (i * 29 + 12) % h;
            ctx.fillStyle = PALETTE.grassDark;
            ctx.beginPath();
            ctx.ellipse(x, y, 6, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    });

    cache.dirt = createTexture(64, 64, (ctx, w, h) => {
        ctx.fillStyle = PALETTE.dirtMid;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = PALETTE.dirtDark;
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            ctx.fillRect(x, y, 4, 4);
        }
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = PALETTE.dirtLight;
        for (let i = 0; i < 8; i++) {
            const x = (i * 13 + 5) % w;
            const y = (i * 17 + 8) % h;
            ctx.fillRect(x, y, 2, 2);
        }
        ctx.globalAlpha = 1;
    });

    cache.water = createTexture(64, 64, (ctx, w, h) => {
        ctx.fillStyle = PALETTE.waterDark;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = PALETTE.waterLight;
        ctx.lineWidth = 2;
        for (let y = 10; y < h; y += 14) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.bezierCurveTo(w * 0.3, y - 3, w * 0.7, y + 3, w, y);
            ctx.stroke();
        }
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = PALETTE.waterLight;
        for (let i = 0; i < 4; i++) {
            const x = (i * 19 + 12) % w;
            const y = (i * 21 + 14) % h;
            ctx.beginPath();
            ctx.ellipse(x, y, 4, 2, 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    });

    cache.sawah = createTexture(64, 64, (ctx, w, h) => {
        ctx.fillStyle = '#4d6a45';
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#8ecae6';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(Math.random() * w, Math.random() * h, 20, 1);
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#b7e4c7';
        for (let x = 4; x < w; x += 12) {
            for (let y = 4; y < h; y += 12) {
                ctx.fillRect(x, y, 2, 4);
                ctx.fillRect(x - 2, y + 2, 6, 1);
            }
        }
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, w, h);
    });

    const createAsphaltRoad = (horizontal = true) => createTexture(64, 64, (ctx, w, h) => {
        const roadColor = '#1e293b';
        const curbColor = '#94a3b8';
        const markingColor = 'rgba(255, 255, 255, 0.6)';
        ctx.fillStyle = PALETTE.grassMid;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = curbColor;
        if (horizontal) {
            ctx.fillRect(0, 10, w, 44);
            ctx.fillStyle = '#64748b';
            ctx.fillRect(0, 10, w, 2);
            ctx.fillRect(0, 52, w, 2);
        } else {
            ctx.fillRect(10, 0, 44, h);
            ctx.fillStyle = '#64748b';
            ctx.fillRect(10, 0, 2, h);
            ctx.fillRect(52, 0, 2, h);
        }
        ctx.fillStyle = roadColor;
        if (horizontal) ctx.fillRect(0, 12, w, 40);
        else ctx.fillRect(12, 0, 40, h);
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < 40; i++) {
            ctx.fillStyle = i % 2 === 0 ? '#000' : '#fff';
            ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = markingColor;
        if (horizontal) {
            for (let x = 4; x < w; x += 16) ctx.fillRect(x, h / 2 - 0.5, 8, 1);
        } else {
            for (let y = 4; y < h; y += 16) ctx.fillRect(w / 2 - 0.5, y, 1, 8);
        }
    });

    cache.road_h = createAsphaltRoad(true);
    cache.road_v = createAsphaltRoad(false);
    cache.road_cross = createTexture(64, 64, (ctx, w, h) => {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(w / 2 - 4, h / 2 - 4, 8, 8);
    });

    const createDirtPath = (horizontal = true) => createTexture(64, 64, (ctx, w, h) => {
        const dirtColor = '#a16207';
        ctx.fillStyle = PALETTE.grassMid;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = dirtColor;
        const mainSize = horizontal ? { x: w, y: 24 } : { x: 24, y: h };
        const start = horizontal ? { x: 0, y: 20 } : { x: 20, y: 0 };
        ctx.beginPath();
        for (let i = 0; i < 100; i++) {
            const rx = start.x + Math.random() * mainSize.x;
            const ry = start.y + Math.random() * mainSize.y;
            const r = 4 + Math.random() * 6;
            ctx.moveTo(rx, ry);
            ctx.arc(rx, ry, r, 0, Math.PI * 2);
        }
        ctx.fill();
        for (let i = 0; i < 15; i++) {
            ctx.fillStyle = i % 3 === 0 ? '#451a03' : '#b45309';
            ctx.fillRect(start.x + Math.random() * mainSize.x, start.y + Math.random() * mainSize.y, 2, 2);
        }
    });

    cache.dirt_h = createDirtPath(true);
    cache.dirt_v = createDirtPath(false);
    cache.dirt_cross = createDirtPath(true);
    cache.road = cache.road_h;
    cache.dirt_path = cache.dirt_h;
};
