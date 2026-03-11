/**
 * @reflection
 * [IDENTITY]: megalog_v5
 * [PURPOSE]: Orchestrate PRIMERA audits, enforce artifact freshness, and sync the megalog watchdog report.
 * [STATE]: Active
 * [ANCHOR]: main
 * [DEPENDS_ON]: health_engine, artifact_manifest
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { calculateUnifiedHealth } from "./health_engine.mjs";
import { formatAge, getGitMetadata, stampMarkdown, validateArtifactFreshness } from "./artifact_manifest.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../");
const OUTDIR = path.join(ROOT, "megalog/outputs");
const MEGALOG_PATH = path.join(ROOT, "PRIMERA_megalog.md");
const FORCE_MODE = process.argv.includes("--force");

function run(cmd, args, options = {}) {
    const isWin = process.platform === "win32";
    let finalCmd = cmd;
    let finalArgs = [...args];

    if (isWin) {
        if (cmd === "npm" && args[0] === "run") {
            const scriptName = args[1];
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

    console.log(`Running: ${finalCmd} ${finalArgs.join(" ")}`);
    const result = spawnSync(finalCmd, finalArgs, {
        encoding: "utf8",
        shell: isWin,
        ...options
    });

    if (isWin && cmd === "npm" && args[0] === "run") {
        const scriptName = args[1];
        const outMap = {
            "test:e2e:json": "playwright.json",
            "dep:json": "depcruise.json",
            "knip:json": "knip.json"
        };
        if (outMap[scriptName]) {
            fs.writeFileSync(path.join(OUTDIR, outMap[scriptName]), result.stdout || "", "utf8");
        }
    }

    return {
        code: result.status ?? 0,
        stdout: result.stdout || "",
        stderr: result.stderr || ""
    };
}

function readJson(filePath, fallback = null) {
    if (!fs.existsSync(filePath)) return fallback;
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
        return fallback;
    }
}

function summarizeEslint(eslintJson) {
    if (!eslintJson) return { problems: null, errors: null, warnings: null };
    let errors = 0;
    let warnings = 0;
    for (const file of eslintJson) {
        errors += file.errorCount || 0;
        warnings += file.warningCount || 0;
    }
    return { problems: errors + warnings, errors, warnings };
}

function summarizeVitest(vitestJson) {
    if (!vitestJson) return { passed: 0, failed: 0 };
    const failed = vitestJson?.numFailedTests ?? vitestJson?.testResults?.reduce((acc, test) => acc + (test.numFailingTests || 0), 0) ?? 0;
    const passed = vitestJson?.numPassedTests ?? vitestJson?.testResults?.reduce((acc, test) => acc + (test.numPassingTests || 0), 0) ?? 0;
    return { passed, failed };
}

function summarizePlaywright(playwrightJson) {
    if (!playwrightJson) return { status: "missing", passed: 0, failed: 0 };
    const failed = playwrightJson?.stats?.failed ?? 0;
    const passed = playwrightJson?.stats?.passed ?? 0;
    return { status: failed > 0 ? "failed" : "passed", passed, failed };
}

function enforceFreshArtifact(filePath, producerHint) {
    if (FORCE_MODE) return;

    const freshness = validateArtifactFreshness(filePath, {
        maxAgeMs: 3_600_000,
        currentGitSha: getGitMetadata(ROOT).gitSha
    });

    if (freshness.ok) return;

    const artifactName = path.basename(filePath);
    const generatedAt = freshness.meta?.generatedAt
        ? new Date(freshness.meta.generatedAt).toLocaleString("id-ID")
        : "unknown";
    const ageText = freshness.ageMs ? formatAge(freshness.ageMs) : "unknown age";
    const mismatchText = freshness.reason === "git_sha_mismatch" ? ", gitSha mismatch" : "";
    throw new Error(
        `MEGALOG REFUSED: ${artifactName} is ${freshness.reason} (generated ${generatedAt}, age ${ageText}${mismatchText}). Run ${producerHint} first or pass --force.`
    );
}

function calculateScore(data) {
    return calculateUnifiedHealth(data, {
        command: "megalog_v5",
        inputs: data.inputArtifacts || [],
        staleInputs: data.staleInputs || []
    });
}

function replaceOrAppendSection(content, pattern, nextSection) {
    if (pattern.test(content)) {
        return content.replace(pattern, nextSection);
    }

    const firstHeader = content.match(/^# .*$/m);
    if (firstHeader) {
        const insertPos = content.indexOf(firstHeader[0]) + firstHeader[0].length;
        return `${content.slice(0, insertPos)}\n${nextSection}${content.slice(insertPos)}`;
    }

    return `${nextSection}${content}`;
}

async function main() {
    fs.mkdirSync(OUTDIR, { recursive: true });
    fs.mkdirSync(path.join(OUTDIR, "snapshots"), { recursive: true });

    console.log("Starting Megalog v5 Watchdog...");

    run("npm", ["run", "lint:json"]);
    run("npm", ["run", "assets:check"]);
    run("npm", ["run", "test:unit:json"]);
    run("npm", ["run", "knip:json"]);
    run("npm", ["run", "clinical:check"]);
    enforceFreshArtifact(path.join(OUTDIR, "clinical.json"), "clinical_watchdog");

    run("npm", ["run", "diag:export"]);
    run("node", ["scripts/primera/pldb_analyzer.mjs"]);
    run("node", ["scripts/primera/watchdog-pathfinder.mjs"]);
    run("node", ["scripts/primera/engine-topology.mjs"]);
    run("node", ["scripts/primera/engine-wiring.mjs"]);
    run("node", ["scripts/primera/engine-store-audit.mjs"]);
    run("node", ["scripts/primera/engine-save-audit.mjs"]);
    run("node", ["scripts/primera/engine-collision.mjs"]);
    run("node", ["scripts/primera/engine-oscillation.mjs"]);
    run("node", ["scripts/primera/engine-invariants-runtime.mjs"]);
    run("node", ["scripts/primera/engine-clinical-lifecycle.mjs"]);
    run("node", ["scripts/primera/engine-triage-gate.mjs"]);
    run("node", ["scripts/primera/engine-clinical-guardian.mjs"]);

    const buildResult = run("npm", ["run", "build"]);
    const buildStatus = buildResult.code === 0 ? "passed" : "failed";

    run("node", ["scripts/primera/reflect_and_sync.mjs"]);
    enforceFreshArtifact(path.join(OUTDIR, "static_health.json"), "reflect_and_sync");

    const eslintJson = readJson(path.join(OUTDIR, "eslint.json"));
    const vitestJson = readJson(path.join(OUTDIR, "vitest.json"));
    const playwrightJson = readJson(path.join(OUTDIR, "playwright.json"));
    const assetsJson = readJson(path.join(OUTDIR, "assets.json"));
    const folderMapJson = readJson(path.join(OUTDIR, "folder_map.json"));
    const staticHealth = readJson(path.join(OUTDIR, "static_health.json")) || { reflections: { coverage: 0, anomalies: 0, crossCycles: 0, brokenImports: 0 } };
    const invariantAudit = readJson(path.join(OUTDIR, "invariant_audit.json")) || { pass: false, score: 0, assessed: false, coverage: { percent: 0 } };
    const lifecycleAudit = readJson(path.join(OUTDIR, "clinical_lifecycle_audit.json")) || { pass: false, assessed: false };
    const triageAudit = readJson(path.join(OUTDIR, "triage_safety_audit.json")) || { pass: false, assessed: false };
    const lintReport = readJson(path.join(ROOT, "megalog/lint_report.json")) || { topRules: [], topFiles: [] };
    const clinicalJson = readJson(path.join(OUTDIR, "clinical.json"));
    const guardianRes = readJson(path.join(OUTDIR, "clinical_guardian.json")) || { health: 0, pass: false };
    const forensicSummary = readJson(path.join(ROOT, "diagnostics/lint-rules-summary.json")) || {};

    const eslintSum = summarizeEslint(eslintJson);
    const vitestSum = summarizeVitest(vitestJson);
    const playwrightSum = summarizePlaywright(playwrightJson);
    const assetsSum = assetsJson || { status: "missing", score: 0 };
    const undefinedCount = forensicSummary["no-undef"] || 0;
    const maiaIntegrity = clinicalJson?.maiaIntegrity || { status: "missing", missingMeds: "?", missingProcs: "?", missingEdus: "?" };
    const inputArtifacts = [
        "eslint.json",
        "vitest.json",
        "playwright.json",
        "assets.json",
        "folder_map.json",
        "static_health.json",
        "clinical.json",
        "clinical_guardian.json",
        "invariant_audit.json",
        "clinical_lifecycle_audit.json",
        "triage_safety_audit.json"
    ];

    const healthResult = calculateScore({
        lint: {
            errors: eslintSum.errors || 0,
            warnings: eslintSum.warnings || 0,
            totalFiles: staticHealth.totalFiles || 1
        },
        tests: vitestSum,
        e2e: playwrightSum,
        assets: assetsSum,
        clinical: clinicalJson || { status: "missing", issuesCount: 0 },
        clinicalAudit: guardianRes,
        forensic: { undefinedCount },
        build: { status: buildStatus },
        reflections: staticHealth.reflections,
        invariants: invariantAudit,
        lifecycle: lifecycleAudit,
        inputArtifacts,
        staleInputs: []
    });

    const timestamp = new Date().toLocaleString("id-ID");
    const healthScore = healthResult.total;
    const asciiMap = folderMapJson?.ascii || "Map not available.";
    const folderSection = `
## FOLDER TOPOLOGY
Generated: ${timestamp}

\`\`\`
${asciiMap}
\`\`\`
`;

    const bibleContent = fs.existsSync(path.join(ROOT, "PRIMER_BIBLE.md"))
        ? fs.readFileSync(path.join(ROOT, "PRIMER_BIBLE.md"), "utf8")
        : "";
    const hasArch = bibleContent.includes("## 3. ARCHITECTURE OVERVIEW");
    const lintDetail = lintReport.topRules.length > 0
        ? "Top Rules:\n" + lintReport.topRules.map(([rule, count]) => `  - \`${rule}\`: ${count}`).slice(0, 5).join("\n")
        : "No data.";

    const watchdogSection = `
## WATCHDOG REPORT (v5.0)
Generated: ${timestamp}
Force Mode: ${FORCE_MODE ? "YES" : "NO"}

| Gate | Status | Assessed | Detail |
| :--- | :--- | :--- | :--- |
| **Honest Health** | **${healthScore >= 80 ? "GREEN" : "AMBER"}** | **YES** | **Score: ${healthScore}/100** |
| **Arch Overview** | ${hasArch ? "PASS" : "FAIL"} | YES | ${hasArch ? "Bridge Synchronized" : "SECTION MISSING"} |
| **Clinical** | ${guardianRes.pass ? "PASS" : "WARN"} | YES | ${guardianRes.health}% integrity |
| **MAIA Integ.** | ${maiaIntegrity.status || "missing"} | ${maiaIntegrity.status !== "missing" ? "YES" : "NO"} | M=${maiaIntegrity.missingMeds} P=${maiaIntegrity.missingProcs} E=${maiaIntegrity.missingEdus} |
| **Lint Budget** | ${eslintSum.errors === 0 ? "PASS" : "WARN"} | YES | ${eslintSum.errors ?? "?"} errors |
| **Unit Tests** | ${vitestSum.failed === 0 ? "PASS" : "FAIL"} | YES | ${vitestSum.passed} passed, ${vitestSum.failed} failed |
| **Invariants** | ${invariantAudit.pass ? "PASS" : "WARN"} | ${invariantAudit.assessed ? "YES" : "NO"} | ${invariantAudit.score}% coverage (${invariantAudit.coverage?.percent || 0}%) |
| **Lifecycle** | ${lifecycleAudit.pass ? "PASS" : "WARN"} | ${lifecycleAudit.assessed ? "YES" : "NO"} | FSM state monitor |
| **Triage Gate** | ${triageAudit.pass ? "PASS" : "WARN"} | ${triageAudit.assessed ? "YES" : "NO"} | Safety enforcement |
| **Forensic** | ${undefinedCount === 0 ? "PASS" : "WARN"} | YES | ${undefinedCount} undefined symbols |
| **Assets** | ${assetsSum.status === "passed" ? "PASS" : "FAIL"} | YES | hygiene check |
| **Build Guard** | ${buildStatus === "passed" ? "PASS" : "FAIL"} | YES | Vite production gate |
| **Smoke (E2E)** | ${playwrightSum.status === "passed" ? "PASS" : (playwrightSum.status === "missing" ? "SKIP" : "FAIL")} | ${playwrightSum.status !== "missing" ? "YES" : "NO"} | ${playwrightSum.failed ?? "?"} failed tests |

### Lint Snapshot
${lintDetail}

---
`;

    let content = fs.existsSync(MEGALOG_PATH) ? fs.readFileSync(MEGALOG_PATH, "utf8") : "# PRIMERA MEGALOG\n";
    content = replaceOrAppendSection(content, /## WATCHDOG REPORT \(v5\.0\)[\s\S]*?---\n/m, watchdogSection);
    content = replaceOrAppendSection(content, /## FOLDER TOPOLOGY[\s\S]*?(?=##|$)/m, folderSection);

    const ledgerPath = path.join(ROOT, "diagnostics/undefined-ledger.md");
    if (fs.existsSync(ledgerPath)) {
        const ledgerContent = fs.readFileSync(ledgerPath, "utf8");
        const forensicSection = `\n## FORENSIC DEBT\n> Automated forensic analysis of undefined symbols.\n\n${ledgerContent.replace(/# .*\n/, "")}\n---\n`;
        content = replaceOrAppendSection(content, /## FORENSIC DEBT[\s\S]*?(?=##|$|---)/m, forensicSection);
    }

    fs.writeFileSync(MEGALOG_PATH, stampMarkdown(content, "megalog_v5", inputArtifacts));

    const biblePath = path.join(ROOT, "PRIMER_BIBLE.md");
    if (fs.existsSync(biblePath)) {
        let bible = fs.readFileSync(biblePath, "utf8");
        const archPattern = /<!-- ARCH_MAP_START -->[\s\S]*?<!-- ARCH_MAP_END -->/m;
        if (archPattern.test(bible)) {
            const newArch = `<!-- ARCH_MAP_START -->\n\`\`\`\n${asciiMap}\`\`\`\n<!-- ARCH_MAP_END -->`;
            bible = bible.replace(archPattern, newArch);
            fs.writeFileSync(biblePath, bible, "utf8");
        }
    }

    console.log(`Megalog v5 synchronized. Score: ${healthScore}${FORCE_MODE ? " (forced)" : ""}`);
}

main().catch((error) => {
    console.error("Megalog orchestrator error:", error.message || error);
    process.exit(1);
});
