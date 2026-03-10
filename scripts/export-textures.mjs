#!/usr/bin/env node

/**
 * Texture Export (Bake) Script
 * ============================
 * Renders all Canvas-generated textures to PNG files in public/assets/.
 * Use this after adding new procedural textures to "bake" them into permanent PNGs.
 *
 * Run: node scripts/export-textures.mjs
 *
 * NOTE: This uses the canvas npm package for headless rendering.
 *       Install: npm install canvas --save-dev (only needed for this script)
 *       If canvas is not available, this script will print instructions.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const OUTPUT_DIR = join(ROOT, 'public', 'assets', 'buildings');
const MANIFEST_PATH = join(ROOT, 'src', 'assets', 'asset-manifest.json');

console.log('🎨 Texture Export Script');
console.log('========================\n');

// Check if node-canvas is available
let createCanvas;
try {
    const canvasModule = await import('canvas');
    createCanvas = canvasModule.createCanvas;
} catch (e) {
    console.log('⚠️  The "canvas" package is not installed.');
    console.log('   This script needs it to render textures headlessly.\n');
    console.log('   To install:  npm install canvas --save-dev\n');
    console.log('   Alternative: Open the app in a browser and run this in the console:');
    console.log('');
    console.log(`   // In browser DevTools console:
   import('/src/utils/TextureGenerator.js').then(m => {
       const textures = m.generateTextures('export');
       Object.entries(textures).forEach(([key, dataUrl]) => {
           if (dataUrl && dataUrl.startsWith('data:image')) {
               const a = document.createElement('a');
               a.href = dataUrl;
               a.download = key + '.png';
               a.click();
           }
       });
   });`);
    console.log('\n   This will download all Canvas-generated textures as PNG files.');
    process.exit(0);
}

// If canvas IS available, render and export
console.log('✅ canvas package found, rendering textures...\n');

// We need to polyfill document.createElement for the TextureGenerator
globalThis.document = {
    createElement: (tag) => {
        if (tag === 'canvas') {
            const c = createCanvas(1, 1);
            return {
                width: 1,
                height: 1,
                getContext: (type) => {
                    const realCanvas = createCanvas(1, 1);
                    const ctx = realCanvas.getContext(type);
                    // Proxy to handle width/height setting
                    return new Proxy(ctx, {
                        get: (target, prop) => {
                            if (prop === 'canvas') return realCanvas;
                            const val = target[prop];
                            return typeof val === 'function' ? val.bind(target) : val;
                        }
                    });
                },
                toDataURL: (type) => c.toDataURL(type || 'image/png'),
                set width(v) { c.width = v; },
                get width() { return c.width; },
                set height(v) { c.height = v; },
                get height() { return c.height; },
            };
        }
    }
};

// Dynamic import the generators
const { addBuildingTextures } = await import('../src/utils/BuildingGenerator.js');
const cache = {};
addBuildingTextures(cache);

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
}

let exported = 0;
for (const [key, dataUrl] of Object.entries(cache)) {
    if (!dataUrl || !dataUrl.startsWith('data:image')) continue;

    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const outputPath = join(OUTPUT_DIR, `${key}.png`);

    writeFileSync(outputPath, buffer);
    exported++;
    console.log(`  📁 ${key}.png (${buffer.length} bytes)`);
}

console.log(`\n✅ Exported ${exported} textures to public/assets/buildings/`);
console.log('   Don\'t forget to add new entries to src/assets/asset-manifest.json!');
