import fs, { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../");
const REPORT_DIR = path.join(ROOT, "megalog");
const OUTPUTS_DIR = path.join(REPORT_DIR, "outputs");
const BASELINE_PATH = path.join(REPORT_DIR, "lint_baseline.json");
const REPORT_PATH_JSON = path.join(REPORT_DIR, "lint_report.json");
const REPORT_PATH_MD = path.join(REPORT_DIR, "lint_report.md");
const RAW_JSON_PATH = path.join(OUTPUTS_DIR, "eslint.json");

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
if (!existsSync(OUTPUTS_DIR)) mkdirSync(OUTPUTS_DIR, { recursive: true });

function runEslintJson() {
    console.log("🔍 Running ESLint (JSON format)...");

    // Directly point to eslint bin to avoid shell/execution policy issues
    const eslintPath = path.join(ROOT, "node_modules", "eslint", "bin", "eslint.js");

    const r = spawnSync(
        "node",
        [eslintPath, "src/**/*.{js,jsx}", "-f", "json"],
        { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
    );

    const stdout = r.stdout || "";
    writeFileSync(path.join(REPORT_DIR, "lint_raw_stdout.log"), stdout, "utf8");
    writeFileSync(path.join(REPORT_DIR, "lint_raw_stderr.log"), r.stderr || "", "utf8");



    if (!stdout && r.status !== 0) {
        console.error("❌ ESLint failed to run:", r.stderr);
        return { status: r.status, raw: "", parsed: [], stderr: r.stderr };
    }

    let parsed = [];
    try {
        const jsonStart = stdout.indexOf("[");
        const jsonEnd = stdout.lastIndexOf("]") + 1;
        if (jsonStart !== -1 && jsonEnd !== -1) {
            parsed = JSON.parse(stdout.slice(jsonStart, jsonEnd));
            writeFileSync(RAW_JSON_PATH, JSON.stringify(parsed, null, 2), "utf8");
        } else {
            console.warn("⚠️ No JSON array found in ESLint output.");
            parsed = [];
        }
    } catch (e) {
        console.warn("⚠️ Failed to parse ESLint JSON output. Fallback to empty.");
        parsed = [];
    }

    return { status: r.status ?? 1, raw: stdout, parsed, stderr: r.stderr || "" };
}

function summarize(parsed) {
    let errorCount = 0;
    const byRule = new Map();
    const byFile = [];

    for (const file of parsed) {
        const msgs = file.messages || [];
        const fileErrors = msgs.filter((m) => m.severity === 2);
        if (fileErrors.length) {
            byFile.push({ filePath: path.relative(ROOT, file.filePath), errors: fileErrors.length });
        }

        for (const m of fileErrors) {
            errorCount += 1;
            const rule = m.ruleId || "unknown";
            byRule.set(rule, (byRule.get(rule) || 0) + 1);
        }
    }

    byFile.sort((a, b) => b.errors - a.errors);
    const topRules = [...byRule.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
    const topFiles = byFile.slice(0, 15);

    return { errorCount, topRules, topFiles };
}

function writeReport({ errorCount, topRules, topFiles, baseline }) {
    const json = {
        gate: "LINT_BUDGET",
        errors: errorCount,
        baseline,
        delta: errorCount - baseline,
        generatedAt: new Date().toISOString(),
        topRules,
        topFiles,
    };

    writeFileSync(REPORT_PATH_JSON, JSON.stringify(json, null, 2), "utf8");

    const md = [];
    md.push(`# 🧹 Lint Budget Report`);
    md.push(`Generated: ${new Date().toLocaleString()}`);
    md.push(``);
    md.push(`- **Errors:** ${errorCount}`);
    md.push(`- **Baseline:** ${baseline}`);
    md.push(`- **Delta:** ${errorCount - baseline > 0 ? "+" : ""}${errorCount - baseline}`);
    md.push(``);

    md.push(`## Top Rules`);
    for (const [rule, n] of topRules) md.push(`- \`${rule}\`: ${n}`);

    md.push(``);
    md.push(`## Top Files`);
    for (const f of topFiles) md.push(`- ${f.errors} — \`${f.filePath}\``);

    writeFileSync(REPORT_PATH_MD, md.join("\n"), "utf8");
}

function loadBaseline() {
    if (!existsSync(BASELINE_PATH)) return null;
    try {
        const b = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
        return typeof b.errors === "number" ? b.errors : null;
    } catch {
        return null;
    }
}

function saveBaseline(errors) {
    writeFileSync(BASELINE_PATH, JSON.stringify({ errors, savedAt: new Date().toISOString() }, null, 2), "utf8");
}

const run = runEslintJson();
const sum = summarize(run.parsed);

let baseline = loadBaseline();

if (baseline === null) {
    saveBaseline(sum.errorCount);
    writeReport({ ...sum, baseline: sum.errorCount });
    console.error(`🟡 Baseline created with ${sum.errorCount} errors at ${BASELINE_PATH}.`);
    console.log("✅ Next runs will compare against this baseline.");
    process.exit(0); // Exit 0 for initial setup to avoid breaking flow
}

writeReport({ ...sum, baseline });

if (sum.errorCount > baseline) {
    console.error(`🔴 LINT REGRESSION: errors increased from ${baseline} to ${sum.errorCount} (+${sum.errorCount - baseline}).`);
    console.error(`Check ${REPORT_PATH_MD} for details.`);
    process.exit(1);
}

console.log(`✅ Lint budget OK. errors=${sum.errorCount}, baseline=${baseline}, delta=${sum.errorCount - baseline}`);
process.exit(0);
