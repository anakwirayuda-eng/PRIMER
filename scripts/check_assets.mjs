import fs from "fs";
import path from "path";
import fg from "fast-glob";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(ROOT, "megalog/outputs/assets.json");

const exists = (p) => fs.existsSync(p);

function extractAssetRefs(code) {
    // 1) import ... from '...png|jpg|svg|webp|mp3|wav|ogg|json'
    const importRe = /from\s+['"]([^'"]+\.(png|jpe?g|svg|webp|gif|mp3|wav|ogg|json))(?:\?[^'"]*)?['"]/gi;

    // 2) CSS url("...") / url('...')
    const cssUrlRe = /url\(\s*['"]?([^'")]+\.(png|jpe?g|svg|webp|gif))['"]?\s*\)/gi;

    // 3) string literal referencing public assets: "/avatars.png", "/insets/x.png"
    const publicPathRe = /['"`](\/[^'"`]+\.(png|jpe?g|svg|webp|gif|mp3|wav|ogg))['"`]/gi;

    const refs = [];
    let m;
    while ((m = importRe.exec(code))) refs.push({ kind: "import", ref: m[1] });
    while ((m = cssUrlRe.exec(code))) refs.push({ kind: "css_url", ref: m[1] });
    while ((m = publicPathRe.exec(code))) refs.push({ kind: "public", ref: m[1] });
    return refs;
}

function resolveRef(filePath, refObj) {
    const { kind, ref } = refObj;

    if (kind === "public") {
        // "/avatars.png" -> public/avatars.png
        return path.join(PUBLIC, ref.replace(/^\//, ""));
    }

    if (ref.startsWith(".")) {
        // relative import/url -> resolve from current file dir
        return path.resolve(path.dirname(filePath), ref);
    }

    // Non-relative imports (node_modules) -> ignore
    return null;
}

async function main() {
    if (!fs.existsSync(path.dirname(OUT))) {
        fs.mkdirSync(path.dirname(OUT), { recursive: true });
    }

    const files = await fg(["src/**/*.{js,jsx,ts,tsx,css}"], {
        cwd: ROOT,
        absolute: true,
        ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"]
    });

    const missing = [];
    const checked = [];

    for (const file of files) {
        const code = fs.readFileSync(file, "utf8");
        const refs = extractAssetRefs(code);

        for (const r of refs) {
            const resolved = resolveRef(file, r);
            if (!resolved) continue;

            checked.push({ file: path.relative(ROOT, file), ...r, resolved: path.relative(ROOT, resolved) });

            if (!exists(resolved)) {
                missing.push({
                    file: path.relative(ROOT, file),
                    kind: r.kind,
                    ref: r.ref,
                    resolved: path.relative(ROOT, resolved)
                });
            }
        }
    }

    const result = {
        status: missing.length === 0 ? "passed" : "failed",
        checkedCount: checked.length,
        missingCount: missing.length,
        missing,
        timestamp: new Date().toISOString()
    };

    fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
    console.log(`🧩 Asset Watchdog: ${result.status.toUpperCase()} | missing=${result.missingCount}`);
}

main().catch((e) => {
    if (!fs.existsSync(path.dirname(OUT))) {
        fs.mkdirSync(path.dirname(OUT), { recursive: true });
    }
    fs.writeFileSync(OUT, JSON.stringify({ status: "error", error: e.message }, null, 2));
    process.exitCode = 0;
});
