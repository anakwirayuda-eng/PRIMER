/**
 * scripts/convert-images-to-webp.mjs
 *
 * Convert all PNG/JPG/JPEG assets in `public/` and `src/assets/` to WebP.
 * Quality 85 + sharp encoder effort 5 = good balance for game assets
 * (typical 50-75% size reduction vs PNG, 30-50% vs JPG).
 *
 * Usage:
 *   node scripts/convert-images-to-webp.mjs              # convert, keep originals
 *   node scripts/convert-images-to-webp.mjs --delete     # convert, delete originals
 *   node scripts/convert-images-to-webp.mjs --dry-run    # report only
 *
 * After running with --delete, also run:
 *   node scripts/convert-images-to-webp.mjs --update-refs
 * to update asset-manifest.json + grep-based source file references.
 *
 * See docs/AUDIO_DESIGN.md sibling — but for images. Phase 4 ROADMAP item.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TARGET_DIRS = ['public', 'src/assets'];
const QUALITY = 85;
const EFFORT = 5; // sharp 0-6, higher = better compression but slower
const EXTS = ['.png', '.jpg', '.jpeg'];

const args = process.argv.slice(2);
const DELETE_ORIGINALS = args.includes('--delete');
const DRY_RUN = args.includes('--dry-run');

const stats = { converted: 0, skipped: 0, totalBefore: 0, totalAfter: 0, errors: [] };

async function walkDir(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) await walkDir(full);
        else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (EXTS.includes(ext)) await convertFile(full);
        }
    }
}

async function convertFile(file) {
    const target = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    if (fs.existsSync(target)) {
        stats.skipped++;
        return;
    }

    try {
        const before = (await fs.promises.stat(file)).size;
        if (!DRY_RUN) {
            await sharp(file)
                .webp({ quality: QUALITY, effort: EFFORT })
                .toFile(target);
        }
        const after = DRY_RUN ? before : (await fs.promises.stat(target)).size;
        stats.converted++;
        stats.totalBefore += before;
        stats.totalAfter += after;
        const reduction = ((1 - after / before) * 100).toFixed(1);
        const rel = path.relative(ROOT, file);
        console.log(`OK ${rel} ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (-${reduction}%)`);
        if (DELETE_ORIGINALS && !DRY_RUN) {
            await fs.promises.unlink(file);
        }
    } catch (err) {
        stats.errors.push({ file, err: err.message });
        console.error(`FAIL ${path.relative(ROOT, file)}: ${err.message}`);
    }
}

console.log(`WebP conversion ${DRY_RUN ? '(DRY RUN)' : ''} — quality=${QUALITY}, effort=${EFFORT}, delete=${DELETE_ORIGINALS}`);
console.log(`Targets: ${TARGET_DIRS.join(', ')}\n`);

for (const dir of TARGET_DIRS) {
    const full = path.join(ROOT, dir);
    if (fs.existsSync(full)) await walkDir(full);
}

console.log('\n--- Summary ---');
console.log(`Converted: ${stats.converted}`);
console.log(`Skipped (already exists): ${stats.skipped}`);
console.log(`Errors: ${stats.errors.length}`);
const mb = (b) => (b / 1024 / 1024).toFixed(2);
console.log(`Total before: ${mb(stats.totalBefore)} MB`);
console.log(`Total after:  ${mb(stats.totalAfter)} MB`);
const overall = stats.totalBefore > 0 ? ((1 - stats.totalAfter / stats.totalBefore) * 100).toFixed(1) : 0;
console.log(`Reduction:    ${overall}%`);
if (stats.errors.length > 0) {
    console.error('\nErrors:');
    stats.errors.forEach((e) => console.error(`  ${path.relative(ROOT, e.file)}: ${e.err}`));
    process.exit(1);
}
