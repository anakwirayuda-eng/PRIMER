/**
 * @reflection
 * [IDENTITY]: engine-topology
 * [PURPOSE]: Map the physical project structure and logical module dependencies.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');

function getStructure(dir, depth = 0) {
    const stats = fs.statSync(dir);
    const item = {
        name: path.basename(dir),
        path: path.relative(ROOT, dir).replace(/\\/g, '/'),
        size: stats.size,
        type: stats.isDirectory() ? 'directory' : 'file',
        children: []
    };

    if (stats.isDirectory()) {
        const files = fs.readdirSync(dir);
        item.children = files
            .filter(f => !f.startsWith('.') && !['node_modules', 'dist', '_backups', 'diagnostics'].includes(f))
            .map(f => getStructure(path.join(dir, f), depth + 1));
    } else if (dir.endsWith('.js') || dir.endsWith('.jsx')) {
        const content = fs.readFileSync(dir, 'utf8');
        const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
        item.imports = [];
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            item.imports.push(match[1]);
        }
    }

    return item;
}

async function run() {
    console.log('🏗️ PRIMERA Topology Engine starting...');

    if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

    // 1. Physical Topology
    const srcTree = getStructure(path.join(ROOT, 'src'));
    const scriptsTree = getStructure(path.join(ROOT, 'scripts'));

    const topology = {
        generatedAt: new Date().toISOString(),
        roots: [srcTree, scriptsTree]
    };

    fs.writeFileSync(path.join(OUTDIR, 'topology.json'), JSON.stringify(topology, null, 2));
    console.log(`✅ Physical Topology mapped to megalog/outputs/topology.json`);

    // 2. Preliminary Module Map (Entrypoints)
    const pagesDir = path.join(ROOT, 'src/components');
    const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

    const moduleMap = {
        pages: pages.map(p => ({
            name: p,
            path: `src/components/${p}`
        }))
    };

    fs.writeFileSync(path.join(OUTDIR, 'module-map.json'), JSON.stringify(moduleMap, null, 2));
    console.log(`✅ Module Map initialized in megalog/outputs/module-map.json`);
}

run().catch(err => {
    console.error('Topology Engine failed:', err);
    process.exit(1);
});
