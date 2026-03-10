import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

/**
 * @reflection
 * [IDENTITY]: PLDB Exporter (PRIMER Lint Diagnostics Bundle)
 * [PURPOSE]: Consolidates diagnostic data for remote linting remediation.
 * [STATE]: Production (v5.1)
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../");
const DIAG_DIR = path.join(ROOT, "diagnostics");
const CONFIGS_DIR = path.join(DIAG_DIR, "configs");

function run(cmd, args, shell = true) {
    const isWin = process.platform === "win32";
    let finalCmd = cmd;
    let finalArgs = args;

    if (isWin && cmd === "eslint") {
        finalCmd = path.resolve(ROOT, "node_modules/.bin/eslint.cmd");
    }

    const r = spawnSync(finalCmd, finalArgs, { encoding: "utf8", shell });
    return { code: r.status, stdout: r.stdout || "", stderr: r.stderr || "" };
}

async function main() {
    console.log("🚀 Initializing PLDB Export...");

    if (!fs.existsSync(DIAG_DIR)) {
        fs.mkdirSync(DIAG_DIR, { recursive: true });
    }
    if (!fs.existsSync(CONFIGS_DIR)) {
        fs.mkdirSync(CONFIGS_DIR, { recursive: true });
    }

    // 1. Env Manifest
    console.log("📝 Capture Env Manifest...");
    const nodeV = run("node", ["-v"]).stdout.trim();
    const npmV = run("npm", ["-v"]).stdout.trim();
    const eslintV = run("eslint", ["-v"]).stdout.trim();

    const envContent = `Node: ${nodeV}
NPM: ${npmV}
ESLint: ${eslintV}
OS: ${process.platform} ${process.arch}
CWD: ${ROOT}
`;
    fs.writeFileSync(path.join(DIAG_DIR, "env.txt"), envContent);

    // 2. Configs
    console.log("📂 Archiving Configs...");
    const configFiles = [
        "package.json",
        "eslint.config.js",
        "vite.config.js",
        "vitest.config.js",
        "tailwind.config.js",
        "postcss.config.js",
        ".eslintignore",
        ".gitignore"
    ];

    for (const f of configFiles) {
        const src = path.join(ROOT, f);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, path.join(CONFIGS_DIR, f));
        }
    }

    // 3. Lint Reports
    console.log("🔍 Generating Lint Reports (JSON & Text)...");
    const jsonReport = run("eslint", ["src", "--format", "json"]);
    fs.writeFileSync(path.join(DIAG_DIR, "eslint-report.json"), jsonReport.stdout);

    const txtReport = run("eslint", ["src"]);
    fs.writeFileSync(path.join(DIAG_DIR, "lint-stdout.txt"), txtReport.stdout);

    // 4. Git Info
    console.log("🌿 Capturing Git Info...");
    const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]).stdout.trim();
    const commit = run("git", ["rev-parse", "HEAD"]).stdout.trim();
    const status = run("git", ["status"]).stdout;

    const gitContent = `Branch: ${branch}
Commit: ${commit}

Status:
${status}
`;
    fs.writeFileSync(path.join(DIAG_DIR, "git-info.txt"), gitContent);

    // 5. Tree
    console.log("🌲 Generating Topology...");
    // Use pathfinder logic or simple find
    const tree = run("cmd", ["/c", "dir", "/s", "/b", "src", "scripts"], true).stdout;
    fs.writeFileSync(path.join(DIAG_DIR, "tree.txt"), tree);

    // 6. Print Config (Sample)
    console.log("🎯 Printing Computed Config for sample file...");
    // Try to find first file with error from JSON
    try {
        const data = JSON.parse(jsonReport.stdout);
        const firstErrorFile = data.find(f => f.errorCount > 0)?.filePath;
        if (firstErrorFile) {
            console.log(`Picking sample: ${path.basename(firstErrorFile)}`);
            const printConfig = run("eslint", ["--print-config", firstErrorFile]);
            fs.writeFileSync(path.join(DIAG_DIR, "eslint.print-config.json"), printConfig.stdout);
        }
    } catch (e) {
        console.warn("Could not generate print-config sample:", e.message);
    }

    console.log(`\n✅ PLDB Export Complete!`);
    console.log(`Location: ${DIAG_DIR}`);
}

main().catch(console.error);
