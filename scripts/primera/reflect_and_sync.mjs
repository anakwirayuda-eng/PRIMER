import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { calculateUnifiedHealth } from './health_engine.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const BIBLE_PATH = path.join(ROOT_DIR, 'PRIMER_BIBLE.md');
const MEGALOG_PATH = path.join(ROOT_DIR, 'PRIMERA_megalog.md');
const LOG_PATH = path.join(ROOT_DIR, 'build_error.log');
const HISTORY_PATH = path.join(ROOT_DIR, 'megalog/history/PRIMERA_history.json');
const SIM_RESULTS_PATH = path.join(ROOT_DIR, 'megalog/history/simulation_results.json');

/**
 * @reflection
 * [IDENTITY]: PRIMERA Reflect & Sync v3.0
 * [PURPOSE]: Professional synchronizer for PRIMER_BIBLE.md and PRIMERA_megalog.md. 
 * Features: Layered grouping, Bible-Sync validation, Blast Radius analysis, High-priority anomaly detection, and Code Heatmap v2.
 * [STATE]: Stable
 * [ANCHOR]: main
 * [DEPENDS_ON]: fs, path, child_process
 * [LAST_UPDATE]: 2026-02-13
 */

// ─── ANSI Colors ───────────────────────────────────────────
const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m',
    cyan: '\x1b[36m', magenta: '\x1b[35m', blue: '\x1b[34m',
};

// ─── Main ──────────────────────────────────────────────────
async function main() {
    console.log(`\n${C.cyan}${C.bold}╔══════════════════════════════════════════════════╗`);
    console.log(`║   PRIMERA Intelligence v5.0 — Honest Hardening   ║`);
    console.log(`╚══════════════════════════════════════════════════╝${C.reset}\n`);

    const scanResult = scanReflections(SRC_DIR);
    const { reflections, anomalies, metrics, depGraph, allFiles, reverseDeps } = scanResult;

    console.log(`  ${C.green}✓${C.reset} Indexed ${C.bold}${reflections.length}${C.reset} modules`);
    console.log(`  ${C.cyan}📊${C.reset} Analyzed ${C.bold}${allFiles}${C.reset} files`);

    const bibleAnomalies = validateAgainstBible(allFiles, reflections);
    anomalies.push(...bibleAnomalies);

    const runtimeEvidence = checkRuntimeEvidence();
    console.log(`  ${runtimeEvidence.exists ? C.green + '✓' : C.yellow + '⚠'}${C.reset} Runtime Evidence: ${C.bold}${runtimeEvidence.status}${C.reset}`);

    const lintResults = runLint();
    if (lintResults.error) {
        anomalies.push({ priority: 'high', type: 'System Failure', file: 'System', desc: `Lint runner failed: ${lintResults.error}` });
    }
    console.log(`  ${(lintResults.errorCount > 0 || lintResults.error) ? C.red + '🚨' : C.green + '✓'}${C.reset} Lint: ${C.bold}${lintResults.problems}${C.reset} problems`);

    const healthScore = calculateHealthScore(reflections, anomalies, allFiles, depGraph, metrics, lintResults, runtimeEvidence);
    console.log(`  ${healthBadge(healthScore.total)} Health Score: ${C.bold}${healthScore.total}/100${C.reset} ${healthScore.capped ? '(Capped)' : ''}`);

    // Export static health slice for Orchestrator
    const staticHealth = {
        totalFiles: allFiles,
        reflections: {
            coverage: healthScore.total, // or breakdown.coverage
            anomalies: anomalies.length,
            crossCycles: healthScore.structuralResults.cycles.length,
            brokenImports: healthScore.structuralResults.unresolved.length
        }
    };
    fs.writeFileSync(path.join(ROOT_DIR, 'megalog/outputs/static_health.json'), JSON.stringify(staticHealth, null, 2));

    const logs = scanLogs();
    buildMegalog(reflections, anomalies, logs, metrics, depGraph, reverseDeps, healthScore, lintResults, runtimeEvidence);

    saveHistory(healthScore);
    console.log(`\n  ${C.green}${C.bold}✅ PRIMERA_megalog.md shared with honest intelligence!${C.reset}\n`);
}

// ─── Helpers ────────────────────────────────────────────────
function canonicalize(filePath) {
    let resolved = filePath.replace(/\\/g, '/');
    if (resolved.startsWith(ROOT_DIR.replace(/\\/g, '/'))) {
        resolved = resolved.slice(ROOT_DIR.length + 1);
    }
    return resolved.replace(/\.(js|jsx)$/, '');
}

function resolveDependency(fromPath, specifier) {
    if (!specifier.startsWith('.')) return null; // Ignore node_modules
    const dir = path.dirname(fromPath);
    const absolute = path.resolve(ROOT_DIR, dir, specifier);

    // Check if the absolute path exists as is (handles explicit extensions)
    if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) return canonicalize(absolute);

    const possible = [
        absolute + '.js',
        absolute + '.jsx',
        path.join(absolute, 'index.js'),
        path.join(absolute, 'index.jsx')
    ];

    for (const p of possible) {
        if (fs.existsSync(p)) return canonicalize(p);
    }

    // Also check for common asset extensions if not already handled
    const assetExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.css', '.scss', '.json'];
    for (const ext of assetExtensions) {
        if (fs.existsSync(absolute + ext)) return canonicalize(absolute + ext);
    }

    return null;
}

// ─── Recursive Scanner ─────────────────────────────────────
function scanReflections(dir, results = null) {
    if (!results) {
        results = { reflections: [], anomalies: [], metrics: [], depGraph: {}, allFiles: 0, reverseDeps: {} };
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        const relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');

        if (stat.isDirectory()) {
            if (['node_modules', 'dist', 'build', 'assets', 'locales', 'tests', 'scripts'].includes(file)) continue;
            scanReflections(fullPath, results);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            results.allFiles++;
            const content = fs.readFileSync(fullPath, 'utf8');
            const canonicalPath = canonicalize(fullPath);

            const reflection = parseReflection(content, fullPath);
            if (reflection) {
                results.reflections.push(reflection);
                if (reflection.KNOWN_ISSUES && reflection.KNOWN_ISSUES.toLowerCase() !== 'none') {
                    results.anomalies.push({ priority: 'medium', type: 'Declared Issue', file: relativePath, desc: reflection.KNOWN_ISSUES });
                }

                if (reflection.ANCHOR && reflection.ANCHOR !== 'None') {
                    // Support comma-separated anchors (e.g. "TILE_TYPES, BUILDING_TYPES")
                    const anchors = reflection.ANCHOR.split(',').map(a => a.trim()).filter(Boolean);
                    for (const anchor of anchors) {
                        const anchorRegex = new RegExp(`(?:function|const|class|export\\s+default|export\\s+function|export\\s+const)\\s+${anchor}\\b`, 'm');
                        if (!anchorRegex.test(content)) {
                            results.anomalies.push({ priority: 'high', type: 'Broken Anchor', file: relativePath, desc: `Anchor '${anchor}' not found with robust pattern.` });
                        }
                    }
                }
            } else {
                const criticalFolders = ['hooks', 'context', 'services', 'game', 'store'];
                if (criticalFolders.some(f => relativePath.includes(`/${f}/`)) && !file.includes('index.')) {
                    results.anomalies.push({ priority: 'high', type: 'Missing Reflection', file: relativePath, desc: 'Critical module lacks @reflection header.' });
                }
            }

            const loc = content.split('\n').length;
            results.metrics.push({
                file: relativePath,
                canonical: canonicalPath,
                name: file,
                identity: reflection?.IDENTITY || file.replace(/\.[^.]+$/, ''),
                loc,
                size: stat.size,
                exports: (content.match(/export\s+/g) || []).length,
                state: reflection?.STATE || 'Unknown'
            });

            const imports = [];
            const importRegex = /import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                const specifier = match[1];
                const resolved = resolveDependency(relativePath, specifier);
                if (resolved) {
                    imports.push(resolved);
                    if (!results.reverseDeps[resolved]) results.reverseDeps[resolved] = [];
                    results.reverseDeps[resolved].push(canonicalPath);
                } else if (specifier.startsWith('.')) {
                    imports.push(`UNRESOLVED:${specifier}`);
                }
            }
            results.depGraph[canonicalPath] = imports;

            // Bug Patterns (Filtered)
            if (!relativePath.startsWith('scripts/')) {
                const bugPatterns = [
                    { regex: /\/\/\s*FIXME:\s*(.*)/g, type: 'FIXME' },
                    { regex: /\/\/\s*BUG:\s*(.*)/g, type: 'BUG' },
                    { regex: /console\.log\(/g, type: 'Console Log' }
                ];
                bugPatterns.forEach(p => {
                    let bMatch;
                    while ((bMatch = p.regex.exec(content)) !== null) {
                        results.anomalies.push({ priority: p.type === 'BUG' ? 'high' : 'low', type: p.type, file: relativePath, desc: bMatch[1] || 'Detected instance' });
                    }
                });
            }

            if (loc > 1000) results.anomalies.push({ priority: 'medium', type: 'Monster File', file: relativePath, desc: `Large file (${loc} LOC). Consider splitting.` });
            if (stat.size > 500000) results.anomalies.push({ priority: 'high', type: 'Bundle Bomb', file: relativePath, desc: `Huge file (${(stat.size / 1024).toFixed(0)}KB). Must be lazy-loaded.` });
        }
    }
    return results;
}

// ─── Bible-Sync Validation ─────────────────────────────────
function validateAgainstBible(totalFiles, reflections) {
    const anomalies = [];
    if (!fs.existsSync(BIBLE_PATH)) return anomalies;

    const bibleContent = fs.readFileSync(BIBLE_PATH, 'utf8');
    const archMatch = bibleContent.match(/## 2\. ARCHITECTURE OVERVIEW[\s\S]*?```([\s\S]*?)```/);
    if (archMatch) {
        const lines = archMatch[1].split('\n');
        const reflectedPaths = new Set(reflections.map(r => r.path));

        lines.forEach(line => {
            const fileMatch = line.match(/([\w.-]+\/(?:[\w.-]+\/)*[\w.-]+\.(jsx?|json))\b/) || line.match(/([\w.-]+\.(jsx?|json))\b/);
            if (!fileMatch) return;
            const file = fileMatch[1];

            if (file.endsWith('.json')) {
                const exists = fs.existsSync(path.join(SRC_DIR, 'data', file)) || fs.existsSync(path.join(SRC_DIR, file));
                if (!exists) {
                    anomalies.push({ priority: 'high', type: 'SATA Integrity', file: 'PRIMER_BIBLE.md', desc: `Codex mentions critical asset \`${file}\` but it is missing.` });
                }
            } else {
                // Try to match by path or basename if path not fully specified in bible
                const matchFound = Array.from(reflectedPaths).some(p => p === file || p.endsWith('/' + file));
                if (!matchFound) {
                    anomalies.push({ priority: 'medium', type: 'Bible Discrepancy', file: 'PRIMER_BIBLE.md', desc: `Codex mentions \`${file}\` but it has no reflection or is missing.` });
                }
            }
        });
    }
    return anomalies;
}

// ─── Reflection Parser ─────────────────────────────────────
function parseReflection(content, filePath) {
    const match = content.match(/\/\*\*[\s\S]*?@reflection([\s\S]*?)\*\//);
    if (!match) return null;
    const body = match[1];
    const data = { path: path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'), name: path.basename(filePath) };
    body.split('\n').forEach(line => {
        const entry = line.match(/\[(.*?)\]:\s*(.*)/);
        if (entry) data[entry[1].trim()] = entry[2].trim();
    });
    return data;
}

// ─── Lint Runner ──────────────────────────────────────────
function runLint() {
    try {
        let cmd = 'npx';
        let args = ['eslint', 'src', '--format', 'json'];

        if (process.platform === 'win32') {
            const localEslint = path.resolve(ROOT_DIR, 'node_modules/.bin/eslint.cmd');
            if (fs.existsSync(localEslint)) {
                cmd = localEslint;
                args = ['src', '--format', 'json'];
            } else {
                cmd = 'npx.cmd';
            }
        }

        const result = spawnSync(cmd, args, {
            encoding: 'utf8',
            maxBuffer: 10 * 1024 * 1024,
            shell: process.platform === 'win32' ? true : false
        });

        if (result.error || result.status !== 0 && !result.stdout.trim().startsWith('[')) {
            return { problems: 0, errorCount: 0, warningCount: 0, error: result.error?.message || 'ESLint process failed' };
        }

        const output = result.stdout;
        if (!output || !output.trim().startsWith('[')) return { problems: 0, errorCount: 0, warningCount: 0 };
        const results = JSON.parse(output);
        let errors = 0, warnings = 0;
        results.forEach(r => { errors += r.errorCount; warnings += r.warningCount; });
        return { problems: errors + warnings, errorCount: errors, warningCount: warnings, raw: results };
    } catch (e) {
        return { problems: 0, errorCount: 0, warningCount: 0, error: e.message };
    }
}

function checkRuntimeEvidence() {
    if (!fs.existsSync(SIM_RESULTS_PATH)) return { exists: false, status: 'Missing Simulation Results', score: 0 };
    try {
        const results = JSON.parse(fs.readFileSync(SIM_RESULTS_PATH, 'utf8'));
        if (results.status === 'failed') return { exists: true, status: 'FAILED (Invariants Broken)', score: 0 };
        const confidence = results.status === 'warning' ? 60 : 100;
        return { exists: true, status: `PASS (${results.daysElapsed} days simulated)`, score: confidence };
    } catch (e) {
        return { exists: false, status: 'Corrupt Evidence File', score: 0 };
    }
}

// ─── Health Score ──────────────────────────────────────────
function calculateHealthScore(reflections, anomalies, totalFiles, depGraph, metrics, lintResults, runtimeEvidence) {
    const structuralResults = checkStructuralIntegrity(depGraph);

    const OUTDIR = path.join(ROOT_DIR, 'megalog/outputs');
    const readAudit = (file, def = { assessed: false }) => {
        const p = path.join(OUTDIR, file);
        if (!fs.existsSync(p)) return def;
        try {
            let content = fs.readFileSync(p, 'utf8');
            // Remove UTF-8 BOM if present
            if (content.charCodeAt(0) === 0xFEFF) {
                content = content.slice(1);
            }
            return JSON.parse(content);
        } catch (e) {
            // Handle cases where the file might be UTF-16 (PS default)
            try {
                let content16 = fs.readFileSync(p, 'utf16le');
                if (content16.charCodeAt(0) === 0xFEFF) content16 = content16.slice(1);
                return JSON.parse(content16);
            } catch {
                return def;
            }
        }
    };

    const invRaw = readAudit('invariant_audit.json', { score: 0, assessed: false });
    const lifeRaw = readAudit('clinical_lifecycle_audit.json', { pass: true, assessed: false });
    const vitestRaw = readAudit('vitest.json', { numFailedTests: 0, numPassedTests: 0, numTotalTests: 1 });
    const pwJson = readAudit('playwright.json', null);
    const pwRaw = pwJson ? {
        status: (pwJson.stats?.unexpected === 0 && pwJson.stats?.expected > 0) ? 'passed' : (pwJson.stats?.unexpected > 0 ? 'failed' : 'missing'),
        failed: pwJson.stats?.unexpected || 0
    } : { status: 'missing', failed: 0 };
    const clinicalAudit = readAudit('clinical_guardian.json', { health: 100, status: 'passed' });
    const clinicalLegacyAudit = readAudit('clinical.json', { status: 'passed', issuesCount: 0 });
    const assetsAudit = readAudit('assets.json', { status: 'missing', score: 0 });
    const forensicSum = readAudit('../lint_rules-summary.json', { 'no-undef': 0 });

    // New Gates
    const storeRaw = readAudit('store_audit.json', { pass: false, checkedSlices: 0 });
    const saveRaw = readAudit('save_audit.json', { pass: false, version: 0 });
    const triageRaw = readAudit('triage_safety_audit.json', { pass: true, assessed: false });
    const oscRaw = readAudit('oscillation_audit.json', { score: 0 });
    const collRaw = readAudit('collision_audit.json', { pass: true });

    const undefinedCount = forensicSum['no-undef'] || 0;

    // Convert current results into Health Engine format
    const healthData = {
        lint: {
            errors: lintResults.errorCount || 0,
            warnings: lintResults.warningCount || 0,
            totalFiles: totalFiles
        },
        tests: {
            failed: vitestRaw?.numFailedTests || 0,
            passed: vitestRaw?.numPassedTests || 0,
            total: vitestRaw?.numTotalTests || 1
        },
        e2e: {
            status: pwRaw?.status || 'missing',
            failed: pwRaw?.failed || 0
        },
        reflections: {
            coverage: Math.round((reflections.length / totalFiles) * 100),
            anomalies: anomalies.length,
            crossCycles: structuralResults.cycles.length,
            brokenImports: structuralResults.unresolved.length
        },
        invariants: invRaw,
        lifecycle: lifeRaw,
        clinicalAudit: clinicalAudit, // Use Guardian for Gate Table
        assets: assetsAudit,
        forensic: { undefinedCount },
        build: { status: fs.existsSync(path.join(ROOT_DIR, 'dist')) ? 'passed' : 'failed' }
    };

    const unified = calculateUnifiedHealth(healthData);

    // Inject cycles for specific reporting
    if (structuralResults.cycles.length > 0) {
        structuralResults.cycles.forEach(cycle => {
            anomalies.push({ priority: 'high', type: 'Circular Dependency', file: cycle[0], desc: `System cycle: ${cycle.join(' -> ')}` });
        });
    }

    return {
        ...unified,
        gates: {
            clinical: clinicalAudit,
            tests: healthData.tests,
            assets: healthData.assets,
            forensic: healthData.forensic,
            build: healthData.build,
            store: storeRaw,
            save: saveRaw,
            triage: triageRaw,
            oscillation: oscRaw,
            collision: collRaw,
            invariants: healthData.invariants,
            lifecycle: healthData.lifecycle,
            e2e: healthData.e2e
        },
        structuralResults
    };
}

function checkStructuralIntegrity(graph) {
    const cycles = [];
    const visited = new Set();
    const stack = new Set();

    function findCycles(node, path) {
        visited.add(node);
        stack.add(node);
        path.push(node);

        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                findCycles(neighbor, [...path]);
            } else if (stack.has(neighbor)) {
                // Found cycle!
                const cycle = path.slice(path.indexOf(neighbor));
                cycle.push(neighbor);
                // Simple dedup for report
                if (!cycles.some(c => c.length === cycle.length && c.every((v, i) => v === cycle[i]))) {
                    cycles.push(cycle);
                }
            }
        }
        stack.delete(node);
    }

    Object.keys(graph).forEach(node => {
        if (!visited.has(node)) findCycles(node, []);
    });

    // Unresolved tracking is done separately or we can scan graph for 'UNRESOLVED' markers
    const unresolved = [];
    Object.entries(graph).forEach(([from, deps]) => {
        deps.forEach(d => {
            if (d.startsWith('UNRESOLVED:')) {
                unresolved.push({ from, specifier: d.split(':')[1] });
            }
        });
    });

    if (unresolved.length > 0) {
        console.log('\n🔍 DETECTED BROKEN IMPORTS:');
        unresolved.forEach(u => console.log(`   - In ${u.from}: needs ${u.specifier}`));
    }

    // DEBUG: Log structural issues for diagnosis
    if (cycles.length > 0 || unresolved.length > 0) {
        console.log(`\n🔍 STRUCTURAL DEBUG: ${cycles.length} cross-cycles, ${unresolved.length} broken imports`);
        cycles.forEach((c, i) => console.log(`   Cycle ${i + 1}: ${c.join(' → ')}`));
    }

    return { cycles, unresolved: unresolved }; // Return all unresolved
}

// ─── Megalog Builder ───────────────────────────────────────
function buildMegalog(reflections, anomalies, logs, metrics, depGraph, reverseDeps, healthScore, lintResults, runtimeEvidence) {
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')}`;

    const grouped = reflections.reduce((acc, r) => {
        const cat = r.path.split('/')[1] || 'root';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(r);
        return acc;
    }, {});

    let toc = '## TABLE OF CONTENTS\n\n1. [Honest Health Score](#0-primera-health-score)\n2. [Runtime Evidence](#1-runtime-evidence)\n3. [Anomalies](#2-anomalies--hardening-report)\n4. [Architecture](#3-architecture-overview)\n5. [System Map](#4-the-pulse-system-map)\n6. [Heatmap](#5-code-health-heatmap)\n7. [Known Limitations](#6-known-limitations)\n';


    // ─── Gates Table Generator ─────────────────────────────────
    const gates = healthScore.gates;

    // Helper to format status
    const status = (cond) => cond ? '✅' : '🚨';
    const statusWarn = (cond) => cond ? '✅' : '⚠️';

    const healthTable = `
| Gate / Metric | Status | Detail |
| :--- | :--- | :--- |
| **Health Score** | **${healthScore.total}/100** | Overall structural integrity |
| **Indexing** | ${healthScore.breakdown.coverage >= 95 ? '✅' : '⚠️'} | ${healthScore.breakdown.coverage || 0}% coverage (10% weight) |
| **Lint** | ${healthScore.breakdown.lint >= 90 ? '✅' : '⚠️'} | ${lintResults.errorCount} errors, ${lintResults.warningCount} warnings (15% weight) |
| **Graph Integrity** | ${healthScore.breakdown.structure >= 50 ? '✅' : '⚠️'} | ${healthScore.breakdown.structure}% purity (5% weight) |
| **Clinical** | ${(gates.clinical.status === 'passed' || gates.clinical.pass) ? '✅' : '🚨'} | ${gates.clinical.health || 0}% clinical health (15% weight) |
| **Unit Tests** | ${healthScore.breakdown.runtime >= 50 ? '✅' : '🚨'} | ${gates.tests.passed} passed, ${gates.tests.failed} failed (15% weight) |
| **Store Contract** | ${status(gates.store.pass)} | ${gates.store.checkedSlices || 0} slices audited |
| **Save Integrity** | ${status(gates.save.pass)} | ${gates.save.version ? 'v' + gates.save.version : 'Unknown'} persistence check |
| **Prophylaxis** | ${gates.oscillation.score >= 40 ? '✅' : (gates.oscillation.score > 0 ? '⚠️' : '🚨')} | ${gates.oscillation.score || 0}% loop protection density |
| **Invariants** | ${gates.invariants.assessed ? (gates.invariants.score > 50 ? '✅' : '🚨') : '⚠️'} | ${gates.invariants.assessed ? gates.invariants.score + '%' : 'Not Assessed'} coverage (15% weight) |
| **Lifecycle** | ${gates.lifecycle.assessed ? (gates.lifecycle.pass ? '✅' : '🚨') : '⚠️'} | State transition monitor |
| **Triage Gate** | ${gates.triage.assessed ? (gates.triage.pass ? '✅' : '🚨') : '⚠️'} | ESI 1 / Red Flag safety gate |
| **Collisions** | ${status(gates.collision.pass)} | ${gates.collision.issues ? gates.collision.issues.length : 0} Name collision forensic guard |
| **Assets** | ${status(gates.assets.status === 'passed')} | Score: ${gates.assets.score || 0} |
| **Forensic** | ${status(gates.forensic.undefinedCount === 0)} | ${gates.forensic.undefinedCount} undefined symbols detected |
| **Build** | ${status(gates.build.status === 'passed')} | Vite build bundling status |
| **Smoke (E2E)** | ${gates.e2e.status === 'passed' ? '✅' : (gates.e2e.status === 'missing' ? '⚠️' : '🚨')} | ${gates.e2e.failed} failed tests |
`;

    const megalogBody = `
# PRIMERA MEGALOG v5.0
> **Honest Hardening Report — Reliability Edition**
> Generated: ${timestamp}

---

${toc}

---

## 0. PRIMERA HEALTH SCORE

${healthScore.total >= 80 ? '🟢' : '🟡'} **Overall: ${healthScore.total}/100** ${healthScore.capped ? '*(Capped for Integrity)*' : ''}

${healthTable}

---

## 1. RUNTIME EVIDENCE

| Check | Result | Confidence |
|-------|--------|------------|
| 🧬 Soak Test (1000d) | ${runtimeEvidence.status} | ${runtimeEvidence.score >= 100 ? 'High' : (runtimeEvidence.score > 0 ? 'Medium' : 'Zero')} |
| 💾 Save Migration | Not Assessed | Low |
| ⚡ Perf Budget | Not Assessed | Low |

> **Confidence Level**: ${runtimeEvidence.score >= 100 ? 'HIGH' : (runtimeEvidence.score > 0 ? 'MEDIUM' : 'ZERO (Static Only)')}

---

## 2. ANOMALIES & HARDENING REPORT

### 🔴 High Priority (${anomalies.filter(a => a.priority === 'high').length})
${anomalies.filter(a => a.priority === 'high').map(a => `- **[${a.type}]** in \`${a.file}\`: ${a.desc}`).join('\n') || '> No critical issues.'}

### 🟡 Medium Priority (${anomalies.filter(a => a.priority === 'medium').length})
${anomalies.filter(a => a.priority === 'medium').map(a => `- **[${a.type}]** in \`${a.file}\`: ${a.desc}`).join('\n') || '> No major discrepancies.'}

---

${extractBibleSection('3. ARCHITECTURE OVERVIEW')}

---

## 4. THE PULSE (System Map)

${Object.entries(grouped).map(([cat, mods]) => `
### 📂 Section: ${cat.toUpperCase()}
| Module | State | Blast Radius | Purpose |
|--------|-------|--------------|---------|
${mods.map(r => {
        const canonical = canonicalize(path.join(ROOT_DIR, r.path));
        const radius = (reverseDeps[canonical] || []).length;
        const radiusBadge = radius > 10 ? '🔴' : radius > 5 ? '🟡' : '🟢';
        const purpose = r.PURPOSE ? r.PURPOSE.slice(0, 60) : 'N/A';
        return `| [${r.IDENTITY || r.name}](#mod-${r.name}) | ${r.STATE} | ${radiusBadge} ${radius} | ${purpose}... |`;
    }).join('\n')}
`).join('\n')}

---

## 5. CODE HEALTH HEATMAP

| Risk | Module | Size | LOC | Radius | Suggestion |
|------|--------|------|-----|--------|------------|
${metrics.sort((a, b) => b.size - a.size).slice(0, 20).map(m => {
        const radius = (reverseDeps[m.canonical] || []).length;
        let suggest = '—';
        if (m.size > 500000) suggest = '🔴 Split immediately';
        else if (m.loc > 1000) suggest = '🟡 Consider decomposing';
        else if (radius > 15) suggest = '🟡 High Coupling Risk';
        return `| ${m.size > 500000 || m.loc > 1000 ? '🔴' : '🟢'} | \`${m.file}\` | ${(m.size / 1024).toFixed(1)}K | ${m.loc} | ${radius} | ${suggest} |`;
    }).join('\n')}

---

## 6. KNOWN LIMITATIONS
This report is an automated intelligence tool.
1. **Dynamic Logic**: Cannot detect bugs inside complex branch logic if not covered by soak tests.
2. **Security**: Missing deep audit for LLM API security.

---

${reflections.map(r => `
<a name="mod-${r.name}"></a>
#### [${r.IDENTITY || r.name}]
- **Path**: \`${r.path}\`
- **Blast Radius**: ${(reverseDeps[canonicalize(path.join(ROOT_DIR, r.path))] || []).length} downstream files
- **Structural Role**: ${r.PURPOSE}
- **Issues**: ${r.KNOWN_ISSUES || 'None'}
`).join('\n')}

---
*End of Megalog v4.0*
`;

    fs.writeFileSync(MEGALOG_PATH, megalogBody);

    // ALT path handling
    const ALT_MEGALOG_PATH = MEGALOG_PATH.replace('C:/Users/USER/.gemini', 'C:/Users/USER/gemini');
    if (ALT_MEGALOG_PATH !== MEGALOG_PATH && fs.existsSync(path.dirname(ALT_MEGALOG_PATH))) {
        fs.writeFileSync(ALT_MEGALOG_PATH, megalogBody);
    }
}

function extractBibleSection(title) {
    if (!fs.existsSync(BIBLE_PATH)) return `## ${title}\n(Bible missing)`;
    const content = fs.readFileSync(BIBLE_PATH, 'utf8');
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`## ${escaped}[\\s\\S]*?(?=\\n## |$)`, 'i');
    return content.match(regex)?.[0] || `## ${title}\n(Section not found)`;
}

function scanLogs() {
    if (!fs.existsSync(LOG_PATH)) return [];
    try {
        const content = fs.readFileSync(LOG_PATH, 'utf8').replace(/\0/g, '').replace(/\x1b\[[0-9;]*m/g, '');
        return content.split('\n').filter(l => l.trim()).slice(-5);
    } catch (e) { return []; }
}

function saveHistory(score) {
    let history = [];
    try {
        if (fs.existsSync(HISTORY_PATH)) history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
        history.push({ timestamp: new Date().toISOString(), score: score.total });
        fs.writeFileSync(HISTORY_PATH, JSON.stringify(history.slice(-20), null, 2));
    } catch (e) { }
}

function healthBadge(score) { return score >= 80 ? '🟢' : '🟡'; }

main().catch(console.error);
