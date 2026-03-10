import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../");
const PUBLIC_ASSETS = path.join(ROOT, 'public', 'assets');
const MANIFEST_PATH = path.join(ROOT, 'src', 'assets', 'asset-manifest.json');

// Files/dirs to ignore
const IGNORE_FILES = new Set(['_README.md', '.DS_Store']);
const ALLOWED_EXT = new Set([
    '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg',
    '.wav', '.mp3', '.ogg',
    '.json', '.txt', '.fnt',
    '.ttf', '.otf', '.woff', '.woff2'
]);

function isIgnored(name) {
    return IGNORE_FILES.has(name) || name.endsWith('.meta.json');
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

function relToPublicAssets(absPath) {
    return path.relative(PUBLIC_ASSETS, absPath).replaceAll('\\', '/');
}

function okKeyFormat(key) {
    return /^[A-Z0-9_]+$/.test(key);
}

async function exists(p) {
    try { await fs.access(p); return true; } catch { return false; }
}

function mdTable(rows) {
    const header = `| Item | Count |\n|---|---:|\n`;
    return header + rows.map(([k, v]) => `| ${k} | ${v} |`).join('\n') + '\n';
}

/**
 * Parses AI_ASSETS from constants.js source code.
 * These are the building detail panel inset images (isometric PNGs).
 * Returns { displayKey: 'MANIFEST_KEY', ... }
 */
async function parseAIAssets() {
    const CONSTANTS_PATH = path.join(ROOT, 'src', 'components', 'wilayah', 'constants.js');
    try {
        const src = await fs.readFile(CONSTANTS_PATH, 'utf8');
        // Match: AI_ASSETS = { ... }
        const match = src.match(/export const AI_ASSETS\s*=\s*\{([^}]+)\}/s);
        if (!match) return null;

        const entries = {};
        const lines = match[1].split('\n');
        for (const line of lines) {
            // Match: KEY: getAssetUrl(ASSET_KEY.BUILDING_XXX),
            const m = line.match(/^\s*(\w+)\s*:\s*getAssetUrl\s*\(\s*ASSET_KEY\.(\w+)\s*\)/);
            if (m) entries[m[1]] = m[2];
        }
        return entries;
    } catch {
        return null;
    }
}

async function main() {
    const issues = {
        manifest_missing: [],
        manifest_bad_key: [],
        manifest_duplicate_path: [],
        manifest_orphaned_asset_files: [],
        generated_missing_meta: [],
        unsupported_extensions: [],
        // Texture pipeline checks
        pipeline_unmapped_buildings: [],   // BUILDING_* in manifest but not in BUILDING_ASSET_MAP
        pipeline_broken_references: [],     // BUILDING_ASSET_MAP points to non-existent manifest key
    };

    // Load manifest
    let manifestData;
    try {
        manifestData = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
    } catch (e) {
        console.error(`❌ Cannot read manifest at ${MANIFEST_PATH}`);
        console.error(e);
        process.exit(1);
    }

    const manifest = manifestData.ASSETS || {};

    // Validate keys & duplicate paths
    const seenPath = new Map();
    for (const [key, meta] of Object.entries(manifest)) {
        if (!okKeyFormat(key)) issues.manifest_bad_key.push(key);

        const rel = meta.file;
        if (seenPath.has(rel)) {
            issues.manifest_duplicate_path.push({ path: rel, keys: [seenPath.get(rel), key] });
        } else {
            seenPath.set(rel, key);
        }
    }

    // Scan disk files
    const allFiles = await walk(PUBLIC_ASSETS);
    const assetFiles = allFiles
        .filter((f) => !isIgnored(path.basename(f)))
        .map((f) => ({ abs: f, rel: relToPublicAssets(f) }));

    // Extension guard
    for (const f of assetFiles) {
        const ext = path.extname(f.rel).toLowerCase();
        if (!ALLOWED_EXT.has(ext)) {
            issues.unsupported_extensions.push(f.rel);
        }
    }

    // Check manifest entries exist
    for (const [key, meta] of Object.entries(manifest)) {
        const abs = path.join(PUBLIC_ASSETS, meta.file);
        if (!(await exists(abs))) {
            issues.manifest_missing.push({ key, rel: meta.file });
        }
    }

    // Check orphan files (file exists but not referenced in manifest)
    const manifestPaths = new Set(Object.values(manifest).map(m => m.file));
    for (const f of assetFiles) {
        if (!manifestPaths.has(f.rel)) {
            issues.manifest_orphaned_asset_files.push(f.rel);
        }
    }

    // Generated folder must have meta.json pair
    const generatedFiles = assetFiles.filter((f) => f.rel.startsWith('generated/'));
    for (const f of generatedFiles) {
        const metaAbs = path.join(PUBLIC_ASSETS, f.rel + '.meta.json');
        if (!(await exists(metaAbs))) {
            issues.generated_missing_meta.push(f.rel);
        }
    }

    // === TEXTURE PIPELINE VALIDATION ===
    // Cross-references TextureGenerator.js BUILDING_ASSET_MAP against manifest
    const buildingMap = await parseAIAssets();
    let pipelineCoverage = 0;

    if (buildingMap) {
        const manifestKeys = new Set(Object.keys(manifest));
        const mappedManifestKeys = new Set(Object.values(buildingMap));

        // Buildings in manifest that aren't wired in TextureGenerator
        const buildingManifestKeys = Object.keys(manifest).filter(k => k.startsWith('BUILDING_'));
        for (const mk of buildingManifestKeys) {
            if (!mappedManifestKeys.has(mk)) {
                issues.pipeline_unmapped_buildings.push(mk);
            }
        }

        // BUILDING_ASSET_MAP entries pointing to non-existent manifest keys
        for (const [cacheKey, manifestKey] of Object.entries(buildingMap)) {
            if (!manifestKeys.has(manifestKey)) {
                issues.pipeline_broken_references.push({ cacheKey, manifestKey });
            }
        }

        // Coverage: what % of building manifest keys are wired into the pipeline
        pipelineCoverage = buildingManifestKeys.length > 0
            ? Math.round((buildingManifestKeys.length - issues.pipeline_unmapped_buildings.length) / buildingManifestKeys.length * 100)
            : 100;
    }

    // Score calculation
    const counts = {
        total_files: assetFiles.length,
        manifest_keys: Object.keys(manifest).length,
        missing: issues.manifest_missing.length,
        orphan: issues.manifest_orphaned_asset_files.length,
        missing_meta: issues.generated_missing_meta.length,
        bad_key: issues.manifest_bad_key.length,
        dup_path: issues.manifest_duplicate_path.length,
        bad_ext: issues.unsupported_extensions.length,
        pipeline_unmapped: issues.pipeline_unmapped_buildings.length,
        pipeline_broken: issues.pipeline_broken_references.length,
        pipeline_coverage: pipelineCoverage
    };

    const penalty =
        counts.missing * 8 +
        counts.missing_meta * 5 +
        counts.bad_key * 2 +
        counts.dup_path * 4 +
        counts.bad_ext * 3 +
        Math.min(counts.orphan, 30) * 1 +
        counts.pipeline_broken * 10 +      // Broken texture reference = critical
        counts.pipeline_unmapped * 3;       // Unmapped building = warning

    const score = Math.max(0, 100 - penalty);

    // Report outputs
    const reportDir = path.join(ROOT, 'megalog', 'outputs');
    await fs.mkdir(reportDir, { recursive: true });

    const jsonOut = {
        gate: 'ASSET_HYGIENE',
        status: (counts.missing === 0 && counts.missing_meta === 0 && counts.dup_path === 0 && counts.pipeline_broken === 0) ? 'passed' : 'failed',
        missingCount: counts.missing,
        score,
        counts,
        issues,
        pipelineCoverage,
        generatedAt: new Date().toISOString()
    };

    await fs.writeFile(path.join(reportDir, 'assets.json'), JSON.stringify(jsonOut, null, 2), 'utf8');

    // MD Generation
    const md = [
        `# 🧰 ASSET HYGIENE GATE`,
        `Generated: ${new Date().toLocaleString()}`,
        ``,
        `**Score:** ${score}/100`,
        ``,
        mdTable([
            ['Total files (public/assets)', counts.total_files],
            ['Manifest keys', counts.manifest_keys],
            ['Missing manifest files', counts.missing],
            ['Orphan files (not in manifest)', counts.orphan],
            ['Generated missing meta', counts.missing_meta],
            ['Bad key format', counts.bad_key],
            ['Duplicate path in manifest', counts.dup_path],
            ['Unsupported extensions', counts.bad_ext],
            ['🔗 AI_ASSETS coverage', `${counts.pipeline_coverage}%`],
            ['🔗 Unmapped buildings', counts.pipeline_unmapped],
            ['🔗 Broken inset refs', counts.pipeline_broken]
        ]),
        counts.missing ? `## ❌ Missing files\n` + issues.manifest_missing.map(x => `- ${x.key} -> ${x.rel}`).join('\n') : '',
        counts.pipeline_broken ? `\n## ❌ Broken AI_ASSETS References\n` + issues.pipeline_broken_references.map(x => `- \`${x.cacheKey}\` → \`${x.manifestKey}\` (not in manifest)`).join('\n') : '',
        counts.pipeline_unmapped ? `\n## ⚠️ Buildings in Manifest Not Wired to AI_ASSETS\n` + issues.pipeline_unmapped_buildings.map(x => `- \`${x}\``).join('\n') + '\n\n> Add these to `AI_ASSETS` in `src/components/wilayah/constants.js`' : '',
        counts.orphan ? `\n## ⚠️ Orphan files\n` + issues.manifest_orphaned_asset_files.slice(0, 100).map(x => `- ${x}`).join('\n') + (counts.orphan > 100 ? `\n... (${counts.orphan - 100} more)` : '') : '',
        counts.missing_meta ? `\n## ⚠️ Generated missing meta\n` + issues.generated_missing_meta.map(x => `- ${x}`).join('\n') : '',
        counts.bad_key ? `\n## ⚠️ Bad keys\n` + issues.manifest_bad_key.map(x => `- ${x}`).join('\n') : '',
        counts.dup_path ? `\n## ⚠️ Duplicate paths\n` + issues.manifest_duplicate_path.map(x => `- ${x.path} used by ${x.keys.join(' & ')}`).join('\n') : '',
        counts.bad_ext ? `\n## ⚠️ Unsupported extensions\n` + issues.unsupported_extensions.map(x => `- ${x}`).join('\n') : ''
    ].filter(Boolean).join('\n');

    await fs.writeFile(path.join(reportDir, 'asset_hygiene.md'), md, 'utf8');

    console.log(`✅ Asset Hygiene Gate score: ${score}/100`);
    console.log(`🔗 AI_ASSETS coverage: ${pipelineCoverage}%`);
    console.log(`Report: megalog/asset_hygiene.md`);

    if (counts.missing > 0 || counts.missing_meta > 0 || counts.dup_path > 0 || counts.pipeline_broken > 0) {
        process.exit(2);
    }
}

main().catch((e) => {
    console.error('❌ Asset Hygiene Gate crashed.');
    console.error(e);
    process.exit(1);
});
