import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');

// File extensions to scan
const EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);

// Patterns for "stray assets" that bypass the manifest system
const PATTERNS = [
    { id: 'HARD_PUBLIC_ASSETS', re: /(["'`])\/assets\/[^"'`]+\1/g, hint: "Avoid hardcoding '/assets/...'. Use getAssetUrl(ASSET_KEY.X)." },
    { id: 'RELATIVE_PUBLIC_ASSETS', re: /(["'`])(\.\.\/|\.\/)+assets\/(?!assets\.js|asset-manifest\.json)[^"'`]+\1/g, hint: "Avoid relative paths to assets. Use the manifest + getAssetUrl." },
    { id: 'PUBLIC_FOLDER_DIRECT', re: /(["'`])public\/assets\/[^"'`]+\1/g, hint: "Avoid direct public/assets references. Use the manifest." },
];

// Content that is allowed to contain these patterns
const ALLOWLIST = [
    'src/assets/assets.js',
    'src/assets/asset-manifest.json'
];

function isAllowed(absPath) {
    const rel = path.relative(ROOT, absPath).replaceAll('\\', '/');
    return ALLOWLIST.some((a) => rel.endsWith(a));
}

async function walk(dir) {
    if (!(await exists(dir))) return [];
    const out = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) out.push(...await walk(full));
        else out.push(full);
    }
    return out;
}

async function exists(p) {
    try { await fs.access(p); return true; } catch { return false; }
}

function findLineCol(text, index) {
    const lines = text.slice(0, index).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    return { line, col };
}

async function main() {
    const files = (await walk(SRC))
        .filter((f) => EXT.has(path.extname(f)))
        .filter((f) => !isAllowed(f));

    const hits = [];

    for (const f of files) {
        const text = await fs.readFile(f, 'utf8');
        for (const p of PATTERNS) {
            let m;
            while ((m = p.re.exec(text))) {
                const { line, col } = findLineCol(text, m.index);
                const rel = path.relative(ROOT, f).replaceAll('\\', '/');
                hits.push({
                    file: rel,
                    line,
                    col,
                    rule: p.id,
                    snippet: m[0],
                    hint: p.hint
                });
            }
        }
    }

    // Generate Report
    const reportDir = path.join(ROOT, 'megalog');
    await fs.mkdir(reportDir, { recursive: true });

    const score = Math.max(0, 100 - hits.length * 5);
    const outJson = {
        gate: 'ASSET_REFERENCE_GUARD',
        score,
        hitCount: hits.length,
        hits,
        generatedAt: new Date().toISOString()
    };

    await fs.writeFile(path.join(reportDir, 'asset_reference_guard.json'), JSON.stringify(outJson, null, 2), 'utf8');

    const mdLines = [
        `# 🔎 ASSET REFERENCE GUARD`,
        `Generated: ${new Date().toLocaleString()}`,
        ``,
        `**Score:** ${score}/100`,
        `**Hits:** ${hits.length}`,
        ``
    ];

    if (hits.length) {
        mdLines.push(`## ❌ Violations`);
        for (const h of hits.slice(0, 200)) {
            mdLines.push(`- **${h.rule}** ${h.file}:${h.line}:${h.col}  \`${h.snippet}\`  \n  ↳ ${h.hint}`);
        }
    } else {
        mdLines.push(`✅ No violations found.`);
    }

    await fs.writeFile(path.join(reportDir, 'asset_reference_guard.md'), mdLines.join('\n'), 'utf8');

    console.log(`✅ Asset Reference Guard score: ${score}/100`);
    if (hits.length > 0) {
        process.exit(2);
    }
}

main().catch((e) => {
    console.error('❌ Asset Reference Guard crashed.');
    console.error(e);
    process.exit(1);
});
