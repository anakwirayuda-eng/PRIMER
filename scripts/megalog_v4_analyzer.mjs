/**
 * @reflection
 * [IDENTITY]: Megalog v4.0 Analyzer
 * [PURPOSE]: Scans the codebase to generate "Code Intelligence" metrics (Complexity, Coupling, Health).
 * [STATE]: Experimental
 * [ARCHITECT]: Megalog System
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../src');

// --- METRICS CONFIG ---
const WEIGHTS = {
    LOC: 0.5,           // Lines of Code impact
    IMPORTS: 2.0,       // Coupling impact
    REFS: -5.0,         // Reflection bonus (Good!)
    TODO: 5.0,          // Technical debt penalty
    ANY: 10.0           // 'any' type penalty (if TS, but meaningful for lazy JS too)
};

const IGNORED_DIRS = ['assets', 'styles', 'fonts', 'locales'];
const IGNORED_FILES = ['setupTests.js', 'reportWebVitals.js'];

// --- ANALYZER ENGINE ---

function scanDirectory(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!IGNORED_DIRS.includes(file)) {
                scanDirectory(filePath, fileList);
            }
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                if (!IGNORED_FILES.includes(file)) {
                    fileList.push(filePath);
                }
            }
        }
    });
    return fileList;
}

function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const loc = lines.filter(l => l.trim().length > 0).length;

    // 1. Coupling (Imports)
    const imports = lines.filter(l => l.trim().startsWith('import ')).length;

    // 2. Reflections
    const hasReflection = content.includes('@reflection');
    const identityLine = lines.find(l => l.includes('[IDENTITY]:'));
    const identity = identityLine ? identityLine.split(']:')[1].trim() : path.basename(filePath);

    // 3. Technical Debt
    const todos = (content.match(/TODO:/g) || []).length;
    const fixmes = (content.match(/FIXME:/g) || []).length;

    // 4. Complexity Score
    // Simple heuristic: LOC + (Imports * 2) + Debt - (Reflection * 50)
    let score = (loc * WEIGHTS.LOC) + (imports * WEIGHTS.IMPORTS) + ((todos + fixmes) * WEIGHTS.TODO);
    if (hasReflection) score += WEIGHTS.REFS; // Bonus reduces "Risk"

    return {
        file: path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'),
        identity,
        loc,
        imports,
        debt: todos + fixmes,
        hasReflection,
        riskScore: Math.max(0, Math.round(score))
    };
}

// --- REPORT GENERATOR ---

function generateReport() {
    console.log('🔍 Megalog v4.0 Analyzer: Scanning Grid...');
    const allFiles = scanDirectory(ROOT_DIR);
    const metrics = allFiles.map(analyzeFile);

    // Sort by Risk (Descending)
    metrics.sort((a, b) => b.riskScore - a.riskScore);

    // Aggregates
    const totalLOC = metrics.reduce((acc, m) => acc + m.loc, 0);
    const totalFiles = metrics.length;
    const reflectedFiles = metrics.filter(m => m.hasReflection).length;
    const healthScore = Math.round((reflectedFiles / totalFiles) * 100);

    console.log('\n--- 📊 SYSTEM HEALTH ---');
    console.log(`files_scanned: ${totalFiles}`);
    console.log(`total_loc: ${totalLOC}`);
    console.log(`reflection_coverage: ${reflectedFiles}/${totalFiles} (${healthScore}%)`);

    console.log('\n--- 🔥 HOTSPOTS (High Risk) ---');
    metrics.slice(0, 5).forEach(m => {
        console.log(`[${m.riskScore}] ${m.identity} (${m.file}) - lines: ${m.loc}, imports: ${m.imports}`);
    });

    // Generate Markdown Block for PRIMERA_megalog.md
    const report = `
## 4. CODE INTELLIGENCE (v4.0 Live)
> Generated: ${new Date().toLocaleString()}

### 🌡️ System Vital Signs
- **Health Score**: ${healthScore}/100
- **Total Modules**: ${totalFiles}
- **Lines of Code**: ${totalLOC.toLocaleString()}
- **Reflection Coverage**: ${healthScore}%

### 🔥 Complexity Hotspots (Top 5)
| Risk Score | Module Identity | File Path | LOC | Coupling |
|:----------:|:---------------|:----------|:---:|:--------:|
${metrics.slice(0, 5).map(m => `| ${m.riskScore} | **${m.identity}** | \`${m.file}\` | ${m.loc} | ${m.imports} |`).join('\n')}

### 🧠 Megalog Insight
${healthScore > 80 ? "✅ **System Stable.** High reflection coverage indicates good self-documentation." : "⚠️ **System Drift.** Reflection coverage is low. Run \`inject_reflection.mjs\`."}
    `;

    // Write to a partial file for easy consumption/copying
    const outputPath = path.resolve(__dirname, '../megalog_v4_report.md');
    fs.writeFileSync(outputPath, report);
    console.log(`\n✅ Report generated at: ${outputPath}`);
}

generateReport();
