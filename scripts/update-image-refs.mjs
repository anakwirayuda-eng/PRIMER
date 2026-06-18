/**
 * scripts/update-image-refs.mjs
 *
 * Replace .png/.jpg/.jpeg references with .webp in source files
 * after running convert-images-to-webp.mjs.
 *
 * Pattern: only matches when followed by a delimiter (', ", ), whitespace,
 * comma, or backtick) so that CSS class names like `.png-layer` are NOT
 * touched.
 *
 * Targets: src/ + index.html (excluding frozen_vanguard README docs).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TARGETS = ['src', 'index.html'];
const EXTS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json'];
const SKIP_DIRS = ['node_modules', 'dist', '_frozen_vanguard'];
const SKIP_FILE_PATTERNS = [/README\.md$/i, /\.test\./i];

// Match .png/.jpg/.jpeg followed by string delimiter / paren / whitespace / comma / backtick
const PATTERN = /\.(png|jpg|jpeg)(['")`,\s\\])/gi;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

let stats = { filesScanned: 0, filesModified: 0, refsReplaced: 0 };
const modifications = [];

async function walkDir(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (SKIP_DIRS.includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await walkDir(full);
        } else if (entry.isFile()) {
            await processFile(full);
        }
    }
}

async function processFile(file) {
    const ext = path.extname(file).toLowerCase();
    if (!EXTS.includes(ext)) return;
    if (SKIP_FILE_PATTERNS.some((p) => p.test(file))) return;
    stats.filesScanned++;

    const content = await fs.promises.readFile(file, 'utf8');
    let count = 0;
    const updated = content.replace(PATTERN, (_match, _ext, delim) => {
        count++;
        return `.webp${delim}`;
    });

    if (count > 0) {
        stats.filesModified++;
        stats.refsReplaced += count;
        const rel = path.relative(ROOT, file);
        modifications.push({ file: rel, count });
        if (!DRY_RUN) {
            await fs.promises.writeFile(file, updated, 'utf8');
        }
    }
}

console.log(`Update image refs ${DRY_RUN ? '(DRY RUN)' : ''}`);

for (const target of TARGETS) {
    const full = path.join(ROOT, target);
    if (!fs.existsSync(full)) continue;
    const stat = await fs.promises.stat(full);
    if (stat.isDirectory()) await walkDir(full);
    else await processFile(full);
}

console.log('\n--- Modifications ---');
modifications.sort((a, b) => b.count - a.count);
for (const m of modifications) {
    console.log(`  ${m.count}× ${m.file}`);
}
console.log('\n--- Summary ---');
console.log(`Files scanned:  ${stats.filesScanned}`);
console.log(`Files modified: ${stats.filesModified}`);
console.log(`Refs replaced:  ${stats.refsReplaced}`);
