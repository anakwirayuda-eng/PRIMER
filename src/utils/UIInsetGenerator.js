/**
 * @reflection
 * [IDENTITY]: UIInsetGenerator
 * [PURPOSE]: Helper for generating high-resolution illustrative insets for detail panels.
 * [STATE]: Modular
 * [LAST_UPDATE]: 2026-02-14
 */

import { PALETTE, createTexture } from './TerrainGenerator.js';

export const drawGrassBase = (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, h * 0.6, 0, h);
    g.addColorStop(0, '#7db356'); g.addColorStop(1, '#5a8c3e');
    ctx.fillStyle = g; ctx.fillRect(0, h * 0.6, w, h * 0.4);
    ctx.fillStyle = '#3a6629';
    for (let i = 0; i < 20; i++) {
        ctx.fillRect(Math.random() * w, h * 0.6 + Math.random() * (h * 0.4), 2, 2);
    }
};

export const addInsetTextures = (cache) => {
    cache.insetHouse = createTexture(256, 144, (ctx, w, h) => {
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
        sky.addColorStop(0, '#bae6fd'); sky.addColorStop(1, '#ffedd5');
        ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.6);
        drawGrassBase(ctx, w, h);
        ctx.save();
        ctx.translate(w / 2 - 40, h / 2 - 20);
        ctx.scale(2.5, 2.5);
        ctx.fillStyle = PALETTE.wallCream; ctx.fillRect(0, 10, 32, 20);
        ctx.fillStyle = PALETTE.roofRed; ctx.beginPath(); ctx.moveTo(-4, 10); ctx.lineTo(16, -4); ctx.lineTo(36, 10); ctx.fill();
        ctx.fillStyle = '#6b4a35'; ctx.fillRect(12, 18, 8, 12);
        ctx.restore();
    });

    cache.insetPuskesmas = createTexture(256, 144, (ctx, w, h) => {
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
        sky.addColorStop(0, '#ccfbf1'); sky.addColorStop(1, '#fff');
        ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.6);
        drawGrassBase(ctx, w, h);
        ctx.save();
        ctx.translate(w / 2 - 60, h / 2 - 25);
        ctx.scale(2, 2);
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 10, 60, 30);
        ctx.fillStyle = '#1e4d2b'; ctx.beginPath(); ctx.moveTo(-5, 10); ctx.lineTo(30, -5); ctx.lineTo(65, 10); ctx.fill();
        ctx.fillStyle = '#bae6fd'; ctx.fillRect(22, 26, 16, 14);
        ctx.restore();
    });

    cache.inset_gapura = createTexture(256, 144, (ctx, w, h) => {
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
        sky.addColorStop(0, '#bae6fd'); sky.addColorStop(1, '#fff');
        ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.6);
        drawGrassBase(ctx, w, h);
        ctx.save(); ctx.translate(w / 2, h / 2 + 10); ctx.scale(3, 3);
        ctx.fillStyle = '#b45309';
        ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(-10, -25); ctx.lineTo(-20, -25); ctx.fill();
        ctx.fillRect(-22, 0, 14, 10);
        ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(10, -25); ctx.lineTo(20, -25); ctx.fill();
        ctx.fillRect(8, 0, 14, 10);
        ctx.restore();
    });

    // ... additional insets (Mosque, School, etc.) moved here ...
};
