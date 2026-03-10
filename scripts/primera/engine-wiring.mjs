/**
 * @reflection
 * [IDENTITY]: engine-wiring
 * [PURPOSE]: Map feature sections in PRIMER_BIBLE.md to code modules and their dependencies.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');

async function run() {
    console.log('🔗 PRIMERA Wiring Engine starting...');

    const biblePath = path.join(ROOT, 'PRIMER_BIBLE.md');
    const topoPath = path.join(OUTDIR, 'topology.json');

    if (!fs.existsSync(topoPath)) {
        console.error('❌ topology.json not found. Run engine-topology.mjs first.');
        process.exit(1);
    }

    const bible = fs.readFileSync(biblePath, 'utf8');
    const topo = JSON.parse(fs.readFileSync(topoPath, 'utf8'));

    // 1. Extract Feature Sections from Bible
    // Look for ### 4.x [Feature Name] ([File Name])
    const featureRegex = /### (\d+\.\d+) (.*?) \(`(.*?)`\)/g;
    const features = [];
    let match;
    while ((match = featureRegex.exec(bible)) !== null) {
        // Split by ' + ' and clean backticks if they are inside the capture group
        const anchorFiles = match[3].split(' + ').map(f => f.replace(/`/g, '').trim());
        features.push({
            id: match[1],
            name: match[2],
            anchorFiles: anchorFiles
        });
    }

    console.log(`📍 Found ${features.length} mapped features in Bible.`);

    // 2. Resolve Reachability via Topology
    // Flatten topology for easier lookup
    const fileMap = {};
    function flatten(node) {
        if (node.type === 'file') {
            fileMap[path.basename(node.path)] = node;
        }
        if (node.children) node.children.forEach(flatten);
    }
    topo.roots.forEach(flatten);

    const featureGraph = features.map(f => {
        const foundEntries = f.anchorFiles.map(af => fileMap[af]).filter(Boolean);
        const deps = new Set();

        foundEntries.forEach(entry => {
            if (entry.imports) {
                entry.imports.forEach(imp => {
                    const impBase = path.basename(imp).replace(/\.(js|jsx)$/, '');
                    const found = Object.keys(fileMap).find(k => k.startsWith(impBase));
                    if (found) deps.add(found);
                });
            }
        });

        return {
            ...f,
            status: foundEntries.length > 0 ? 'resolved' : 'orphaned',
            dependencies: Array.from(deps)
        };
    });

    fs.writeFileSync(path.join(OUTDIR, 'feature_graph.json'), JSON.stringify(featureGraph, null, 2));

    const orphaned = featureGraph.filter(f => f.status === 'orphaned');
    if (orphaned.length > 0) {
        console.warn(`⚠️ ${orphaned.length} features in Bible have no matching files in source.`);
    } else {
        console.log(`✅ Feature Graph generated with ${featureGraph.length} nodes.`);
    }
}

run().catch(err => {
    console.error('Wiring Engine failed:', err);
    process.exit(1);
});
