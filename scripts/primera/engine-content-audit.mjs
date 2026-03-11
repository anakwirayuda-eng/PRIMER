/**
 * @reflection
 * [IDENTITY]: engine-content-audit
 * [PURPOSE]: Detect duplicate object keys in content registries before they silently overwrite gameplay data.
 * [STATE]: Active
 * [ANCHOR]: run
 * [DEPENDS_ON]: espree, artifact_manifest
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as espree from 'espree';
import { writeStampedJson } from './artifact_manifest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');
const TARGET_DIRS = [
    path.join(ROOT, 'src/content/cases'),
    path.join(ROOT, 'src/content/scenarios')
];

function parseModule(filePath) {
    return espree.parse(fs.readFileSync(filePath, 'utf8'), {
        ecmaVersion: 'latest',
        sourceType: 'module',
        loc: true,
        ecmaFeatures: { jsx: true }
    });
}

function traverse(node, visit, parent = null) {
    if (!node || typeof node !== 'object') return;
    visit(node, parent);
    for (const value of Object.values(node)) {
        if (Array.isArray(value)) {
            for (const child of value) {
                traverse(child, visit, node);
            }
        } else if (value && typeof value.type === 'string') {
            traverse(value, visit, node);
        }
    }
}

function getPropertyName(property) {
    if (!property || property.type !== 'Property' || property.computed) return null;
    if (property.key.type === 'Identifier') return property.key.name;
    if (property.key.type === 'Literal') return String(property.key.value);
    return null;
}

function relativePath(fullPath) {
    return path.relative(ROOT, fullPath).replace(/\\/g, '/');
}

function collectSourceFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collectSourceFiles(fullPath, files);
            continue;
        }
        if (/\.(js|jsx|mjs)$/.test(entry.name)) {
            files.push(fullPath);
        }
    }
    return files;
}

function collectDuplicateKeys(filePath) {
    const ast = parseModule(filePath);
    const duplicates = [];

    traverse(ast, (node) => {
        if (node.type !== 'ObjectExpression') return;

        const seen = new Map();
        for (const property of node.properties) {
            const name = getPropertyName(property);
            if (!name) continue;
            const lines = seen.get(name) || [];
            lines.push(property.loc.start.line);
            seen.set(name, lines);
        }

        for (const [name, lines] of seen.entries()) {
            if (lines.length > 1) {
                duplicates.push({
                    file: relativePath(filePath),
                    key: name,
                    lines
                });
            }
        }
    });

    return duplicates;
}

async function run() {
    console.log('PRIMERA Content Audit Engine starting...');

    const files = TARGET_DIRS.flatMap((dir) => collectSourceFiles(dir));
    const duplicates = files.flatMap((filePath) => collectDuplicateKeys(filePath));

    const results = {
        pass: duplicates.length === 0,
        checkedFiles: files.length,
        duplicates
    };

    writeStampedJson(
        path.join(OUTDIR, 'content_audit.json'),
        results,
        'engine-content-audit',
        files.map(relativePath)
    );

    console.log(`Content Audit ${results.pass ? 'PASSED' : 'FAILED'} (${files.length} files, ${duplicates.length} duplicates)`);
    if (!results.pass) {
        process.exitCode = 1;
    }
}

run().catch((error) => {
    console.error('Content Audit Engine failed:', error);
    process.exit(1);
});
