import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { calculateUnifiedHealth } from "./health_engine.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../");
const OUTDIR = path.join(ROOT, "megalog/outputs");
const MEGALOG_PATH = path.join(ROOT, "PRIMERA_megalog.md");

function run(cmd, args, options = {}) {
    const isWin = process.platform === "win32";

    // Bypass npm.ps1 issues on Windows by using node or .cmd directly
    let finalCmd = cmd;
    let finalArgs = [...args];

    if (isWin) {
        if (cmd === "npm" && args[0] === "run") {
            const scriptName = args[1];
            // Map common scripts to their direct commands to avoid npm.ps1
            if (scriptName === "lint:json") {
                finalCmd = "node";
                finalArgs = ["scripts/primera/watchdog-lint-budget.mjs"];
            } else if (scriptName === "assets:check") {
                finalCmd = "node";
                finalArgs = ["scripts/primera/watchdog-assets.mjs"];
            } else if (scriptName === "test:unit:json") {
                finalCmd = path.resolve(ROOT, "node_modules/.bin/vitest.cmd");
                finalArgs = ["run", "--reporter=json", "--outputFile=megalog/outputs/vitest.json"];
            } else if (scriptName === "test:e2e:json") {
                finalCmd = path.resolve(ROOT, "node_modules/.bin/playwright.cmd");
                finalArgs = ["test", "--reporter=json"];
                // Note: output redirection handled manually in playwright logic or here
            } else if (scriptName === "dep:json") {
                finalCmd = path.resolve(ROOT, "node_modules/.bin/depcruise.cmd");
                finalArgs = ["src", "--output-type", "json"];
            } else if (scriptName === "knip:json") {
                finalCmd = path.resolve(ROOT, "node_modules/.bin/knip.cmd");
                finalArgs = ["--reporter", "json"];
            } else if (scriptName === "build") {
                finalCmd = path.resolve(ROOT, "node_modules/.bin/vite.cmd");
                finalArgs = ["build"];
            } else {
                finalCmd = "cmd";
                finalArgs = ["/c", "npm", ...args];
            }
        } else if (cmd === "npm") {
            finalCmd = "cmd";
            finalArgs = ["/c", "npm", ...args];
        }
    }

    console.log(`🚀 Running: ${finalCmd} ${finalArgs.join(" ")}`);
    const r = spawnSync(finalCmd, finalArgs, { encoding: "utf8", shell: isWin, ...options });

    // Output redirection for tools that usually use '>'
    if (isWin && cmd === "npm" && args[0] === "run") {
        const scriptName = args[1];
        const outMap = {
            "test:e2e:json": "playwright.json",
            "dep:json": "depcruise.json",
            "knip:json": "knip.json"
        };
        if (outMap[scriptName]) {
            fs.writeFileSync(path.join(OUTDIR, outMap[scriptName]), r.stdout || "", "utf8");
        }
    }

    return { code: r.status ?? 0, stdout: r.stdout || "", stderr: r.stderr || "" };
}

function readJson(p, fallback = null) {
    if (!fs.existsSync(p)) return fallback;
    try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fallback; }
}

function summarizeEslint(eslintJson) {
    if (!eslintJson) return { problems: null, errors: null, warnings: null };
    let errors = 0, warnings = 0;
    for (const f of eslintJson) { errors += f.errorCount; warnings += f.warningCount; }
    return { problems: errors + warnings, errors, warnings };
}

function summarizeVitest(v) {
    if (!v) return { passed: null, failed: null };
    const failed = v?.numFailedTests ?? v?.testResults?.reduce((a, t) => a + (t.numFailingTests || 0), 0) ?? 0;
    const passed = v?.numPassedTests ?? v?.testResults?.reduce((a, t) => a + (t.numPassingTests || 0), 0) ?? 0;
    return { passed, failed };
}

function summarizePlaywright(pw) {
    if (!pw) return { status: "missing", failed: null };
    const failed = pw?.stats?.failed ?? 0;
    const passed = pw?.stats?.passed ?? 0;
    return { passed, failed, status: failed > 0 ? "failed" : "passed" };
}

function calculateScore(data) {
    const unified = calculateUnifiedHealth(data);
    return unified;
}

async function main() {
    if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
    const snapshotDir = path.join(OUTDIR, "snapshots");
    if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir, { recursive: true });

    console.log("🛰️ Starting Megalog v5 Watchdog...");

    console.log("🧹 Running Lint Budget...");
    run("npm", ["run", "lint:json"]);

    console.log("📦 Running Asset Hygiene Check...");
    run("npm", ["run", "assets:check"]);

    console.log("🧪 Running Unit Tests...");
    run("npm", ["run", "test:unit:json"]);

    console.log("🔍 Running Knip Dependency Audit...");
    run("npm", ["run", "knip:json"]);

    console.log("🏗️ Exporting PLDB Diagnostics...");
    run("npm", ["run", "diag:export"]);

    console.log("🧪 Running Forensic Analyzer (PLDB)...");
    run("node", ["scripts/primera/pldb_analyzer.mjs"]);

    console.log("📂 Mapping Repository Topology (Pathfinder)...");
    run("node", ["scripts/primera/watchdog-pathfinder.mjs"]);

    console.log("📐 Running Topology & Wiring Engines...");
    run("node", ["scripts/primera/engine-topology.mjs"]);
    run("node", ["scripts/primera/engine-wiring.mjs"]);

    console.log("🛡️ Running Store & Save Contract Audits...");
    run("node", ["scripts/primera/engine-store-audit.mjs"]);
    run("node", ["scripts/primera/engine-save-audit.mjs"]);

    console.log("🛡️ Running Prophylaxis Collision Engine...");
    run("node", ["scripts/primera/engine-collision.mjs"]);

    console.log("🛡️ Running Prophylaxis Oscillation Engine...");
    run("node", ["scripts/primera/engine-oscillation.mjs"]);

    console.log("🧬 Running High-Precision Invariant Audit...");
    run("node", ["scripts/primera/engine-invariants-runtime.mjs"]);

    console.log("🏥 Running Clinical Lifecycle Audit...");
    run("node", ["scripts/primera/engine-clinical-lifecycle.mjs"]);

    console.log("🚨 Running Triage Safety Audit...");
    run("node", ["scripts/primera/engine-triage-gate.mjs"]);

    console.log("📋 Running Clinical Guardian Engine...");
    run("node", ["scripts/primera/engine-clinical-guardian.mjs"]);
    const guardianRes = readJson(path.join(OUTDIR, "clinical_guardian.json")) || { health: 0, pass: false };

    console.log("🏗️ Running Build Gate...");
    const buildResult = run("npm", ["run", "build"]);
    const buildStatus = buildResult.code === 0 ? "passed" : "failed";

    console.log("🔍 Running Static Reflection Sync...");
    run("node", ["scripts/primera/reflect_and_sync.mjs"]);

    const eslintJson = readJson(path.join(OUTDIR, "eslint.json"));
    const vitestJson = readJson(path.join(OUTDIR, "vitest.json"));
    const pwJson = readJson(path.join(OUTDIR, "playwright.json"));
    const assetsJson = readJson(path.join(OUTDIR, "assets.json"));
    const folderMapJson = readJson(path.join(OUTDIR, "folder_map.json"));
    const staticHealth = readJson(path.join(OUTDIR, "static_health.json")) || { reflections: { coverage: 0, anomalies: 0, crossCycles: 0, brokenImports: 0 } };
    const invariantAudit = readJson(path.join(OUTDIR, "invariant_audit.json")) || { pass: false, score: 0, assessed: false, coverage: { percent: 0 } };
    const lifecycleAudit = readJson(path.join(OUTDIR, "clinical_lifecycle_audit.json")) || { pass: false, assessed: false };
    const triageAudit = readJson(path.join(OUTDIR, "triage_safety_audit.json")) || { pass: false, assessed: false };
    const lintReport = readJson(path.join(ROOT, "megalog/lint_report.json")) || { topRules: [], topFiles: [] };

    const eslintSum = summarizeEslint(eslintJson);
    const vitestSum = summarizeVitest(vitestJson);
    const pwSum = summarizePlaywright(pwJson);
    const assetsSum = assetsJson || { status: "missing", score: 0 };
    const clinicalJson = readJson(path.join(OUTDIR, "clinical.json"));
    const forensicSum = readJson(path.join(ROOT, "diagnostics/lint-rules-summary.json")) || {};
    const undefinedCount = forensicSum['no-undef'] || 0;
    const maiaIntegrity = clinicalJson?.maiaIntegrity || { status: 'missing', missingMeds: '?', missingProcs: '?', missingEdus: '?' };


    const healthResult = calculateScore({
        lint: {
            errors: eslintSum.errors || 0,
            warnings: eslintSum.warnings || 0,
            totalFiles: staticHealth.totalFiles || 1
        },
        tests: vitestSum,
        e2e: pwSum,
        assets: assetsSum,
        clinical: clinicalJson || { status: 'missing', issuesCount: 0 },
        clinicalAudit: guardianRes,
        forensic: { undefinedCount },
        build: { status: buildStatus },
        reflections: staticHealth.reflections,
        invariants: invariantAudit,
        lifecycle: lifecycleAudit
    });

    const healthScore = healthResult.total;
    const timestamp = new Date().toLocaleString("id-ID");

    // 📂 Folder Logic
    const asciiMap = folderMapJson?.ascii || "Map not available.";
    const folderSection = `
## 📂 FOLDER TOPOLOGY
Generated: ${timestamp}

\`\`\`
${asciiMap}
\`\`\`
`;

    // 🏗️ Architecture Gate
    const bibleContent = fs.existsSync(path.join(ROOT, "PRIMER_BIBLE.md")) ? fs.readFileSync(path.join(ROOT, "PRIMER_BIBLE.md"), "utf8") : "";
    const hasArch = bibleContent.includes("## 3. ARCHITECTURE OVERVIEW");
    const archStatus = hasArch ? "✅" : "🚨";
    const archDetail = hasArch ? "Bridge Synchronized" : "SECTION MISSING (FAIL)";

    // 🧹 Lint Breakdown
    let lintDetail = "No data.";
    if (lintReport.topRules.length > 0) {
        lintDetail = "Top Rules:\n" + lintReport.topRules.map(([r, n]) => `  - \`${r}\`: ${n}`).slice(0, 5).join("\n");
    }

    const watchdogSection = `
## 🛰️ WATCHDOG REPORT (v5.0)
Generated: ${timestamp}

| Gate | Status | Assessed | Detail |
| :--- | :--- | :--- | :--- |
| **Honest Health** | **${healthScore >= 80 ? "🟢" : "🟡"}** | **YES** | **Score: ${healthScore}/100** |
| **Arch Overview** | ${archStatus} | YES | ${archDetail} |
| **Clinical** | ${guardianRes.pass ? "✅" : "⚠️"} | YES | ${guardianRes.health}% integrity |
| **MAIA Integ.** | ${maiaIntegrity.status === 'passed' ? "✅" : maiaIntegrity.status === 'missing' ? "🚨" : "❌"} | ${maiaIntegrity.status !== 'missing' ? "YES" : "NO"} | M=${maiaIntegrity.missingMeds} P=${maiaIntegrity.missingProcs} E=${maiaIntegrity.missingEdus} |
| **Lint Budget** | ${eslintSum.errors === 0 ? "✅" : "⚠️"} | YES | ${eslintSum.errors ?? "?"} errors (v5) |
| **Unit Tests** | ${vitestSum.failed === 0 ? "✅" : "❌"} | YES | ${vitestSum.passed} passed, ${vitestSum.failed} failed |
| **Invariants** | ${invariantAudit.pass ? "✅" : "🚨"} | ${invariantAudit.assessed ? "YES" : "NO"} | ${invariantAudit.score}% coverage (${invariantAudit.coverage?.percent || 0}%) |
| **Lifecycle** | ${lifecycleAudit.pass ? "✅" : "🚨"} | ${lifecycleAudit.assessed ? "YES" : "NO"} | FSM state monitor |
| **Triage Gate**| ${triageAudit.pass ? "✅" : "🚨"} | ${triageAudit.assessed ? "YES" : "NO"} | Safety enforcement |
| **Forensic** | ${undefinedCount === 0 ? "✅" : "🚨"} | YES | ${undefinedCount} undefined symbols |
| **Assets** | ${assetsSum.status === "passed" ? "✅" : "❌"} | YES | hygiene check |
| **Build Guard** | ${buildStatus === "passed" ? "✅" : "❌"} | YES | Vite production gate |
| **Smoke (E2E)** | ${pwSum.status === "passed" ? "✅" : "❌"} | ${pwSum.status !== "missing" ? "YES" : "NO"} | ${pwSum.failed ?? "?"} failed tests |

---
`;

    let content = fs.existsSync(MEGALOG_PATH) ? fs.readFileSync(MEGALOG_PATH, "utf8") : "# PRIMERA MEGALOG\n";

    // Update Watchdog Report
    const watchdogPattern = /## 🛰️ WATCHDOG REPORT \(v5\.0\)[\s\S]*?---\n/m;
    if (watchdogPattern.test(content)) {
        content = content.replace(watchdogPattern, watchdogSection);
    } else {
        const firstHeader = content.match(/^# .*$/m);
        if (firstHeader) {
            const insertPos = content.indexOf(firstHeader[0]) + firstHeader[0].length;
            content = content.slice(0, insertPos) + "\n" + watchdogSection + content.slice(insertPos);
        } else {
            content = watchdogSection + content;
        }
    }

    // Update Folder Topology
    const folderPattern = /## 📂 FOLDER TOPOLOGY[\s\S]*?(?=##|$)/m;
    if (folderPattern.test(content)) {
        content = content.replace(folderPattern, folderSection);
    } else {
        content += "\n" + folderSection;
    }

    // Update Forensic Debt (Newly Added)
    const ledgerPath = path.join(ROOT, "diagnostics/undefined-ledger.md");
    if (fs.existsSync(ledgerPath)) {
        const ledgerContent = fs.readFileSync(ledgerPath, "utf8");
        const forensicSection = `\n## 🔍 FORENSIC DEBT\n> Automated forensic analysis of undefined symbols.\n\n${ledgerContent.replace(/# .*\n/, "")}\n---\n`;
        const forensicPattern = /## 🔍 FORENSIC DEBT[\s\S]*?(?=##|$|---)/m;
        if (forensicPattern.test(content)) {
            content = content.replace(forensicPattern, forensicSection);
        } else {
            content += "\n" + forensicSection;
        }
    }

    fs.writeFileSync(MEGALOG_PATH, content);

    // 📖 Sync with PRIMER_BIBLE.md
    const BIBLE_PATH = path.join(ROOT, "PRIMER_BIBLE.md");
    if (fs.existsSync(BIBLE_PATH)) {
        let bible = fs.readFileSync(BIBLE_PATH, "utf8");
        const archPattern = /<!-- ARCH_MAP_START -->[\s\S]*?<!-- ARCH_MAP_END -->/m;
        if (archPattern.test(bible)) {
            const newArch = `<!-- ARCH_MAP_START -->\n\`\`\`\n${asciiMap}\`\`\`\n<!-- ARCH_MAP_END -->`;
            bible = bible.replace(archPattern, newArch);
            fs.writeFileSync(BIBLE_PATH, bible, "utf8");
            console.log("📖 PRIMER_BIBLE.md topology synchronized.");
        }
    }

    console.log(`✅ Megalog v5 Synchronized. Score: ${healthScore}`);
}

main().catch(e => {
    console.error("❌ Megalog Orchestrator Error:", e);
    process.exit(1);
});
