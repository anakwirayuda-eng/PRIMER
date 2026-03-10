#!/usr/bin/env node

/**
 * Asset Validation Script
 * =======================
 * Ensures all assets declared in asset-manifest.json exist on disk.
 * Run: node scripts/validate-assets.mjs
 * Hook: prebuild in package.json
 *
 * Exit 0 = all assets present
 * Exit 1 = missing assets (blocks build)
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const MANIFEST_PATH = join(ROOT, 'src', 'assets', 'asset-manifest.json');
const PUBLIC_ASSETS_DIR = join(ROOT, 'public', 'assets');

console.log('🔍 Validating asset manifest...\n');

// 1. Load manifest
let manifest;
try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
} catch (e) {
    console.error('❌ Failed to read asset-manifest.json:', e.message);
    process.exit(1);
}

const assets = manifest.ASSETS;
if (!assets || typeof assets !== 'object') {
    console.error('❌ Invalid manifest format: missing ASSETS key');
    process.exit(1);
}

// 2. Check each asset exists
const entries = Object.entries(assets);
let missingCount = 0;
let presentCount = 0;

for (const [key, meta] of entries) {
    const filePath = join(PUBLIC_ASSETS_DIR, meta.file);
    if (existsSync(filePath)) {
        presentCount++;
    } else {
        missingCount++;
        console.error(`  ❌ MISSING: ${key} → public/assets/${meta.file}`);
    }
}

// 3. Summary
console.log(`\n📊 Results: ${presentCount} present, ${missingCount} missing out of ${entries.length} total`);

if (missingCount > 0) {
    console.error(`\n🚨 BUILD BLOCKED: ${missingCount} asset(s) missing from public/assets/`);
    console.error('   Fix: Add the missing PNG files or remove from asset-manifest.json');
    process.exit(1);
} else {
    console.log('✅ All assets validated successfully!\n');
    process.exit(0);
}
