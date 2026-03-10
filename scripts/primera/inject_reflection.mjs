import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

/**
 * @reflection
 * [IDENTITY]: PRIMERA Smart Reflection Injector v2.0
 * [PURPOSE]: Intelligently analyzes source files and injects rich @reflection headers with auto-detected PURPOSE, ANCHOR, DEPENDS_ON fields.
 * [STATE]: Stable
 * [ANCHOR]: main
 * [DEPENDS_ON]: fs, path
 * [LAST_UPDATE]: 2026-02-12
 */

// ─── ANSI Colors ───────────────────────────────────────────
const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    blue: '\x1b[34m',
    white: '\x1b[37m',
    bgGreen: '\x1b[42m',
    bgRed: '\x1b[41m',
    bgYellow: '\x1b[43m',
};

// ─── CLI Args ──────────────────────────────────────────────
const args = process.argv.slice(2);
const MODE_ALL = args.includes('--all');
const MODE_DRY = args.includes('--dry');
const SINGLE_FILE = args.find(a => !a.startsWith('--'));

if (!MODE_ALL && !SINGLE_FILE) {
    console.log(`
${C.cyan}${C.bold}╔══════════════════════════════════════════════════╗
║   PRIMERA Smart Reflection Injector v2.0         ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Usage:                                          ║
║    node inject_reflection.mjs <file>             ║
║    node inject_reflection.mjs --all              ║
║    node inject_reflection.mjs --all --dry        ║
║                                                  ║
║  Options:                                        ║
║    --all   Inject into ALL files missing headers ║
║    --dry   Preview only, don't write files       ║
║                                                  ║
╚══════════════════════════════════════════════════╝${C.reset}
`);
    process.exit(0);
}

// ─── Smart Code Analyzer ───────────────────────────────────
class SmartAnalyzer {
    constructor(content, filePath) {
        this.content = content;
        this.filePath = filePath;
        this.fileName = path.basename(filePath);
        this.fileNameNoExt = this.fileName.replace(/\.[^.]+$/, '');
        this.lines = content.split('\n');
        this.loc = this.lines.length;
    }

    analyze() {
        return {
            identity: this._detectIdentity(),
            purpose: this._detectPurpose(),
            state: 'Experimental',
            anchor: this._detectAnchor(),
            depends_on: this._detectDependencies(),
            exports: this._detectExports(),
            loc: this.loc,
            fileSize: Buffer.byteLength(this.content, 'utf8'),
        };
    }

    _detectIdentity() {
        // Use filename without extension as identity
        return this.fileNameNoExt;
    }

    _detectPurpose() {
        // Strategy 1: Check for leading comment block (non-reflection)
        const leadingComment = this.content.match(/^\/\*\*?\s*\n([\s\S]*?)\*\//);
        if (leadingComment && !leadingComment[0].includes('@reflection')) {
            const desc = leadingComment[1]
                .split('\n')
                .map(l => l.replace(/^\s*\*\s?/, '').trim())
                .filter(l => l && !l.startsWith('@'))
                .join(' ')
                .slice(0, 120);
            if (desc.length > 10) return desc;
        }

        // Strategy 2: Infer from exports
        const exports = this._detectExports();
        if (exports.length === 0) return `Module: ${this.fileNameNoExt}`;

        // Categorize the file
        const relPath = path.relative(ROOT_DIR, this.filePath).replace(/\\/g, '/');

        if (relPath.includes('hooks/')) {
            const hookName = exports.find(e => e.startsWith('use'));
            if (hookName) return `React hook: ${hookName} — manages ${this._inferDomain(hookName)} state and logic.`;
        }

        if (relPath.includes('context/')) {
            const ctxName = exports.find(e => e.includes('Provider') || e.includes('Context'));
            if (ctxName) return `React context provider for ${this._inferDomain(ctxName)}.`;
        }

        if (relPath.includes('game/')) {
            return `Game engine module providing: ${exports.slice(0, 4).join(', ')}${exports.length > 4 ? ` (+${exports.length - 4} more)` : ''}.`;
        }

        if (relPath.includes('services/')) {
            return `Service layer module providing: ${exports.slice(0, 3).join(', ')}.`;
        }

        if (relPath.includes('data/')) {
            return `Static data module exporting: ${exports.slice(0, 3).join(', ')}${exports.length > 3 ? ` (+${exports.length - 3} more)` : ''}.`;
        }

        if (relPath.includes('utils/')) {
            return `Utility module providing: ${exports.slice(0, 4).join(', ')}.`;
        }

        if (relPath.includes('components/') || relPath.includes('pages/')) {
            const component = exports.find(e => /^[A-Z]/.test(e)) || this.fileNameNoExt;
            return `React UI component: ${component}.`;
        }

        return `Module providing: ${exports.slice(0, 3).join(', ')}.`;
    }

    _inferDomain(name) {
        const lower = name.toLowerCase();
        const domains = {
            clinical: 'clinical/patient', finance: 'financial/KPI', staff: 'staff/HR',
            player: 'player stats', time: 'time/day cycle', nav: 'navigation/settings',
            publichealth: 'public health/outbreak', theme: 'UI theme',
            game: 'game state', inventory: 'inventory', quest: 'quest/mission',
        };
        for (const [key, desc] of Object.entries(domains)) {
            if (lower.includes(key)) return desc;
        }
        return name.replace(/^use|Provider$|Context$/g, '').toLowerCase();
    }

    _detectAnchor() {
        // Priority 1: Default export function/class
        const defaultFn = this.content.match(/export\s+default\s+(?:function|class)\s+(\w+)/);
        if (defaultFn) return defaultFn[1];

        // Priority 2: Named export that matches filename
        const matchingExport = this._detectExports().find(
            e => e.toLowerCase() === this.fileNameNoExt.toLowerCase()
        );
        if (matchingExport) return matchingExport;

        // Priority 3: First named exported function
        const firstExportFn = this.content.match(/export\s+(?:function|const)\s+(\w+)/);
        if (firstExportFn) return firstExportFn[1];

        // Priority 4: Default export identifier
        const defaultId = this.content.match(/export\s+default\s+(\w+)\s*;/);
        if (defaultId) return defaultId[1];

        return null;
    }

    _detectDependencies() {
        const deps = [];
        const importRegex = /import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(this.content)) !== null) {
            const source = match[1];
            if (source.startsWith('.')) {
                // Local dependency — extract the module name
                const modName = path.basename(source).replace(/\.[^.]+$/, '');
                deps.push(modName);
            }
            // Skip node_modules deps (react, lucide-react, etc.)
        }
        return [...new Set(deps)];
    }

    _detectExports() {
        const exports = new Set();

        // Named exports: export function X, export const X, export class X
        const namedExportRegex = /export\s+(?:function|const|let|var|class)\s+(\w+)/g;
        let match;
        while ((match = namedExportRegex.exec(this.content)) !== null) {
            exports.add(match[1]);
        }

        // Re-exports: export { X, Y } from '...'
        const reExportRegex = /export\s*\{([^}]+)\}/g;
        while ((match = reExportRegex.exec(this.content)) !== null) {
            match[1].split(',').forEach(item => {
                const name = item.trim().split(/\s+as\s+/).pop().trim();
                if (name && name !== 'default') exports.add(name);
            });
        }

        // Default export function/class
        const defaultFn = this.content.match(/export\s+default\s+(?:function|class)\s+(\w+)/);
        if (defaultFn) exports.add(defaultFn[1]);

        return [...exports];
    }
}

// ─── Header Builder ────────────────────────────────────────
function buildHeader(analysis) {
    const date = new Date().toISOString().split('T')[0];
    const deps = analysis.depends_on.length > 0
        ? analysis.depends_on.join(', ')
        : 'None';

    return `/**
 * @reflection
 * [IDENTITY]: ${analysis.identity}
 * [PURPOSE]: ${analysis.purpose}
 * [STATE]: ${analysis.state}
 * [ANCHOR]: ${analysis.anchor || 'None'}
 * [DEPENDS_ON]: ${deps}
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: ${date}
 */
`;
}

// ─── Skip Logic ────────────────────────────────────────────
function shouldSkip(filePath, content) {
    const basename = path.basename(filePath);
    const lines = content.split('\n').filter(l => l.trim());

    // Already has reflection
    if (content.includes('@reflection')) return 'already has @reflection';

    // Test files
    if (basename.includes('.test.') || basename.includes('.spec.')) return 'test file';

    // Tiny wrappers (< 5 meaningful lines)
    if (lines.length < 5) return 'too small (< 5 lines)';

    // Index re-export barrels
    if (basename === 'index.js' || basename === 'index.jsx') {
        const isBarrel = content.split('\n').every(l =>
            !l.trim() || l.trim().startsWith('export') || l.trim().startsWith('import') || l.trim().startsWith('//')
        );
        if (isBarrel) return 'index barrel file';
    }

    return null;
}

// ─── File Scanner (Batch Mode) ─────────────────────────────
function scanForMissingReflections(dir, results = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (['node_modules', 'dist', 'build', 'assets', 'locales', 'tests'].includes(file)) continue;
            scanForMissingReflections(fullPath, results);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const skipReason = shouldSkip(fullPath, content);

            results.push({
                path: fullPath,
                relativePath: path.relative(ROOT_DIR, fullPath),
                skipReason,
                content
            });
        }
    }
    return results;
}

// ─── Single File Inject ────────────────────────────────────
function injectSingleFile(filePath) {
    const fullPath = path.resolve(ROOT_DIR, filePath);

    if (!fs.existsSync(fullPath)) {
        console.error(`${C.red}✗ File not found: ${fullPath}${C.reset}`);
        process.exit(1);
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const skipReason = shouldSkip(fullPath, content);

    if (skipReason) {
        console.log(`${C.yellow}⊘ Skipped: ${skipReason}${C.reset}`);
        return;
    }

    const analyzer = new SmartAnalyzer(content, fullPath);
    const analysis = analyzer.analyze();
    const header = buildHeader(analysis);

    if (MODE_DRY) {
        console.log(`${C.cyan}── Dry Run ──${C.reset}`);
        console.log(`${C.dim}File: ${path.relative(ROOT_DIR, fullPath)}${C.reset}`);
        console.log(header);
        printAnalysisSummary(analysis);
        return;
    }

    fs.writeFileSync(fullPath, header + '\n' + content);
    console.log(`${C.green}${C.bold}✓ Injected${C.reset} into ${C.cyan}${path.basename(fullPath)}${C.reset}`);
    printAnalysisSummary(analysis);
}

// ─── Batch Inject ──────────────────────────────────────────
function injectAll() {
    console.log(`\n${C.cyan}${C.bold}╔══════════════════════════════════════════════════╗`);
    console.log(`║   PRIMERA Smart Injector — Batch Mode            ║`);
    console.log(`╚══════════════════════════════════════════════════╝${C.reset}\n`);

    const allFiles = scanForMissingReflections(SRC_DIR);
    const toInject = allFiles.filter(f => !f.skipReason);
    const skipped = allFiles.filter(f => f.skipReason);

    console.log(`${C.white}📊 Scan Results:${C.reset}`);
    console.log(`   Total files scanned:  ${C.bold}${allFiles.length}${C.reset}`);
    console.log(`   ${C.green}To inject:           ${C.bold}${toInject.length}${C.reset}`);
    console.log(`   ${C.dim}Skipped:             ${skipped.length}${C.reset}`);

    // Show skip reasons breakdown
    const skipReasons = {};
    skipped.forEach(f => {
        skipReasons[f.skipReason] = (skipReasons[f.skipReason] || 0) + 1;
    });
    if (Object.keys(skipReasons).length > 0) {
        console.log(`\n   ${C.dim}Skip breakdown:${C.reset}`);
        Object.entries(skipReasons).forEach(([reason, count]) => {
            console.log(`     ${C.dim}• ${reason}: ${count}${C.reset}`);
        });
    }

    if (toInject.length === 0) {
        console.log(`\n${C.green}${C.bold}✅ All files already have @reflection headers!${C.reset}`);
        return;
    }

    console.log(`\n${MODE_DRY ? `${C.yellow}${C.bold}🔍 DRY RUN — No files will be modified${C.reset}` : `${C.green}${C.bold}🚀 INJECTING...${C.reset}`}\n`);

    let injectedCount = 0;
    const results = [];

    for (const file of toInject) {
        const analyzer = new SmartAnalyzer(file.content, file.path);
        const analysis = analyzer.analyze();
        const header = buildHeader(analysis);

        if (MODE_DRY) {
            console.log(`${C.cyan}┌─ ${file.relativePath}${C.reset}`);
            console.log(`${C.dim}│  Purpose: ${analysis.purpose.slice(0, 80)}${C.reset}`);
            console.log(`${C.dim}│  Anchor:  ${analysis.anchor || 'None'}${C.reset}`);
            console.log(`${C.dim}│  Deps:    ${analysis.depends_on.slice(0, 5).join(', ') || 'None'}${C.reset}`);
            console.log(`${C.dim}└──${C.reset}`);
        } else {
            fs.writeFileSync(file.path, header + '\n' + file.content);
            console.log(`  ${C.green}✓${C.reset} ${file.relativePath} ${C.dim}(${analysis.anchor || '?'})${C.reset}`);
            injectedCount++;
        }

        results.push({ file: file.relativePath, analysis });
    }

    // Summary
    console.log(`\n${C.cyan}${'═'.repeat(50)}${C.reset}`);
    if (MODE_DRY) {
        console.log(`${C.yellow}${C.bold}📋 Dry run complete. ${toInject.length} files would be injected.${C.reset}`);
        console.log(`${C.dim}   Run without --dry to apply changes.${C.reset}`);
    } else {
        console.log(`${C.green}${C.bold}✅ Successfully injected ${injectedCount} files!${C.reset}`);
        console.log(`${C.dim}   Run PRIMERA_SYNC.bat to update the Megalog.${C.reset}`);
    }
}

// ─── Analysis Pretty Print ─────────────────────────────────
function printAnalysisSummary(analysis) {
    console.log(`${C.dim}  ├─ Identity:  ${analysis.identity}${C.reset}`);
    console.log(`${C.dim}  ├─ Purpose:   ${analysis.purpose.slice(0, 80)}${C.reset}`);
    console.log(`${C.dim}  ├─ Anchor:    ${analysis.anchor || 'None'}${C.reset}`);
    console.log(`${C.dim}  ├─ Deps:      ${analysis.depends_on.join(', ') || 'None'}${C.reset}`);
    console.log(`${C.dim}  ├─ Exports:   ${analysis.exports.join(', ') || 'None'}${C.reset}`);
    console.log(`${C.dim}  └─ LOC:       ${analysis.loc}${C.reset}`);
}

// ─── Main ──────────────────────────────────────────────────
function main() {
    if (MODE_ALL) {
        injectAll();
    } else if (SINGLE_FILE) {
        injectSingleFile(SINGLE_FILE);
    }
}

main();
