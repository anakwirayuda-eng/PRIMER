/**
 * T3: IMPORT & BUILD INTEGRITY
 * ==============================
 * Static analysis of all import paths — confirms every relative import
 * resolves to an existing file. Detects broken paths before build.
 *
 * Prevents: Build failures from wrong relative paths (../../ vs ../../../).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const bugs = [];
const warnings = [];
let totalTests = 0;
let passedTests = 0;
let filesScanned = 0;

function assert(test, label, details = '') {
    totalTests++;
    if (test) { passedTests++; }
    else { bugs.push({ label, details }); }
}
function warn(label, details = '') { warnings.push({ label, details }); }

console.log('═══════════════════════════════════════════════════════════');
console.log('  T3: IMPORT & BUILD INTEGRITY');
console.log('═══════════════════════════════════════════════════════════\n');

// ────────────────────────────────────────────────────
// Utility: Recursively find all JS/JSX files
// ────────────────────────────────────────────────────
function walkSync(dir) {
    const results = [];
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (['node_modules', 'dist', 'build', '.git', 'archive'].includes(entry.name)) continue;
                results.push(...walkSync(full));
            } else if (/\.(js|jsx|mjs)$/.test(entry.name)) {
                results.push(full);
            }
        }
    } catch (e) { /* skip */ }
    return results;
}

// ────────────────────────────────────────────────────
// PHASE 1: Resolve All Relative Imports
// ────────────────────────────────────────────────────
console.log('▶ PHASE 1: Relative Import Resolution\n');

const importRegex = /(?:import\s+.*?from\s+['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
const allFiles = walkSync(SRC);
let unresolvedImports = 0;
let deepTraversals = 0;

for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relPath = path.relative(ROOT, filePath);
    let match;

    filesScanned++;
    importRegex.lastIndex = 0;

    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1] || match[2];
        if (!importPath) continue;

        // Skip non-relative imports (node_modules, bare specifiers)
        if (!importPath.startsWith('.')) continue;

        // Count deep traversals
        const parentCount = (importPath.match(/\.\.\//g) || []).length;
        if (parentCount >= 4) {
            deepTraversals++;
            warn(`Deep traversal (${parentCount}x ../) in ${relPath}: "${importPath}"`);
        }

        // Resolve the import
        const dir = path.dirname(filePath);
        const resolved = path.resolve(dir, importPath);

        // Check if it exists (try multiple extensions)
        const candidates = [
            resolved,
            resolved + '.js',
            resolved + '.jsx',
            resolved + '.mjs',
            resolved + '.json',
            path.join(resolved, 'index.js'),
            path.join(resolved, 'index.jsx'),
        ];

        const exists = candidates.some(c => fs.existsSync(c));
        if (!exists) {
            unresolvedImports++;
            bugs.push({
                label: `Unresolved import in ${relPath}`,
                details: `"${importPath}" → ${path.relative(ROOT, resolved)}`
            });
        }
    }
}

console.log(`  Files scanned: ${filesScanned}`);
console.log(`  Unresolved imports: ${unresolvedImports}`);
console.log(`  Deep traversals (4+ ../): ${deepTraversals}`);
console.log('  ✅ Phase 1 complete\n');

// ────────────────────────────────────────────────────
// PHASE 2: Circular Dependency Detection (Lightweight)
// ────────────────────────────────────────────────────
console.log('▶ PHASE 2: Circular Dependency Check (sampled)\n');

// Build a simplified dependency graph for core data files
const CORE_FILES = [
    'src/data/ICD10.js',
    'src/data/ICD10_ALIASES.js',
    'src/data/ICD9CM.js',
    'src/data/MedicationDatabase.js',
    'src/data/ProceduresDB.js',
    'src/data/EducationOptions.js',
    'src/data/WikiData.js',
    'src/services/PersistenceService.js',
    'src/game/ValidationEngine.js',
    'src/game/ClinicalReasoningEngine.js',
];

const depGraph = {};

for (const relFile of CORE_FILES) {
    const absFile = path.join(ROOT, relFile);
    if (!fs.existsSync(absFile)) continue;

    const content = fs.readFileSync(absFile, 'utf8');
    const deps = [];

    importRegex.lastIndex = 0;
    let m;
    while ((m = importRegex.exec(content)) !== null) {
        const imp = m[1] || m[2];
        if (!imp || !imp.startsWith('.')) continue;

        const dir = path.dirname(absFile);
        const resolved = path.relative(ROOT, path.resolve(dir, imp)).replace(/\\/g, '/');

        // Normalize to match CORE_FILES format
        const normalized = resolved.replace(/\.(js|jsx|mjs)$/, '') + '.js';
        if (CORE_FILES.some(cf => cf === normalized || cf.replace('.js', '') === resolved)) {
            deps.push(normalized);
        }
    }

    depGraph[relFile] = deps;
}

// Simple cycle detection (DFS)
let circularDeps = 0;
function hasCycle(node, visited, stack) {
    visited.add(node);
    stack.add(node);

    for (const dep of (depGraph[node] || [])) {
        if (stack.has(dep)) {
            circularDeps++;
            warn(`Circular dependency: ${node} → ${dep}`);
            return true;
        }
        if (!visited.has(dep)) {
            hasCycle(dep, visited, stack);
        }
    }

    stack.delete(node);
    return false;
}

const visited = new Set();
for (const node of Object.keys(depGraph)) {
    if (!visited.has(node)) {
        hasCycle(node, visited, new Set());
    }
}

console.log(`  Core files analyzed: ${Object.keys(depGraph).length}`);
console.log(`  Circular dependencies: ${circularDeps}`);
console.log('  ✅ Phase 2 complete\n');

// ────────────────────────────────────────────────────
// PHASE 3: JSON Validity
// ────────────────────────────────────────────────────
console.log('▶ PHASE 3: JSON File Validity\n');

const jsonFiles = walkSync(path.join(SRC, 'data')).filter(f => f.endsWith('.json'));
let invalidJson = 0;

for (const jf of jsonFiles) {
    try {
        JSON.parse(fs.readFileSync(jf, 'utf8'));
        totalTests++;
        passedTests++;
    } catch (e) {
        invalidJson++;
        bugs.push({
            label: `Invalid JSON: ${path.relative(ROOT, jf)}`,
            details: e.message.substring(0, 100)
        });
    }
}

console.log(`  JSON files validated: ${jsonFiles.length}`);
console.log(`  Invalid: ${invalidJson}`);
console.log('  ✅ Phase 3 complete\n');

// ────────────────────────────────────────────────────
// FINAL REPORT
// ────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════');
console.log('  T3: IMPORT & BUILD INTEGRITY — FINAL RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');
console.log(`  Total assertions: ${totalTests}`);
console.log(`  Passed: ${passedTests}`);
console.log(`  Failed: ${bugs.length}`);
console.log(`  Warnings: ${warnings.length}`);

if (bugs.length > 0) {
    console.log(`\n  ❌ FAILURES (${bugs.length}):`);
    bugs.forEach((b, i) => console.log(`    ${i + 1}. ${b.label}${b.details ? ` — ${b.details}` : ''}`));
}

if (warnings.length > 0) {
    console.log(`\n  ⚠️ WARNINGS (${warnings.length}):`);
    warnings.slice(0, 20).forEach((w, i) => console.log(`    ${i + 1}. ${w.label}${w.details ? ` — ${w.details}` : ''}`));
    if (warnings.length > 20) console.log(`    ... and ${warnings.length - 20} more`);
}

if (bugs.length === 0) {
    console.log(`\n  🏆 ALL CLEAR — Import & build integrity verified!`);
}

console.log('\n═══════════════════════════════════════════════════════════\n');
process.exit(bugs.length > 0 ? 1 : 0);
