/**
 * @reflection
 * [IDENTITY]: engine-store-audit
 * [PURPOSE]: AST-based audit for store contract coverage, save-slot schema drift, duplicate action keys, and gameplay randomness risks.
 * [STATE]: Active
 * [ANCHOR]: run
 * [DEPENDS_ON]: espree, store.contract, artifact_manifest
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as espree from 'espree';
import { STORE_CONTRACT } from '../../src/contracts/store.contract.mjs';
import { writeStampedJson } from './artifact_manifest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const OUTDIR = path.join(ROOT, 'megalog/outputs');
const STORE_PATH = path.join(ROOT, 'src/store/useGameStore.js');
const SAVE_SLOT_PATH = path.join(ROOT, 'src/components/SaveSlotSelector.jsx');
const SAVE_PAYLOAD_PATH = path.join(ROOT, 'src/utils/savePayload.js');
const SRC_ROOT = path.join(ROOT, 'src');

function parseModule(filePath) {
    return espree.parse(fs.readFileSync(filePath, 'utf8'), {
        ecmaVersion: 'latest',
        sourceType: 'module',
        loc: true,
        ecmaFeatures: { jsx: true }
    });
}

function resolveModulePath(fromFile, specifier) {
    const basePath = path.resolve(path.dirname(fromFile), specifier);
    const candidates = [
        basePath,
        `${basePath}.js`,
        `${basePath}.mjs`,
        path.join(basePath, 'index.js'),
        path.join(basePath, 'index.mjs')
    ];

    return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function traverse(node, visit, parent = null, ancestors = []) {
    if (!node || typeof node !== 'object') return;
    visit(node, parent, ancestors);
    const nextAncestors = [...ancestors, node];
    for (const value of Object.values(node)) {
        if (Array.isArray(value)) {
            for (const child of value) {
                traverse(child, visit, node, nextAncestors);
            }
        } else if (value && typeof value.type === 'string') {
            traverse(value, visit, node, nextAncestors);
        }
    }
}

function getPropertyName(property) {
    if (!property || property.type !== 'Property') return null;
    if (property.key.type === 'Identifier') return property.key.name;
    if (property.key.type === 'Literal') return String(property.key.value);
    return null;
}

function isFunctionLike(node) {
    return node && ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(node.type);
}

function unwrapChain(node) {
    return node?.type === 'ChainExpression' ? node.expression : node;
}

function getRootMemberAccess(node) {
    let current = unwrapChain(node);
    const chain = [];

    while (current?.type === 'MemberExpression') {
        const propertyName = current.property.type === 'Identifier'
            ? current.property.name
            : String(current.property.value);
        chain.unshift(propertyName);
        current = unwrapChain(current.object);
    }

    if (current?.type !== 'Identifier') return null;
    return { root: current.name, chain };
}

function findStoreObject(ast) {
    let best = null;
    traverse(ast, (node) => {
        if (node.type !== 'ObjectExpression') return;
        const names = node.properties.map(getPropertyName).filter(Boolean);
        if (names.includes('nav') && names.includes('world') && names.includes('player')) {
            if (!best || node.properties.length > best.properties.length) {
                best = node;
            }
        }
    });
    return best;
}

function collectExportedObjectConstants(filePath, cache = new Map()) {
    if (cache.has(filePath)) {
        return cache.get(filePath);
    }

    const exportedConstants = new Map();
    cache.set(filePath, exportedConstants);

    const ast = parseModule(filePath);
    traverse(ast, (node) => {
        if (
            node.type === 'ExportNamedDeclaration' &&
            node.declaration?.type === 'VariableDeclaration'
        ) {
            for (const declaration of node.declaration.declarations) {
                if (
                    declaration.id.type === 'Identifier' &&
                    declaration.init?.type === 'ObjectExpression'
                ) {
                    exportedConstants.set(declaration.id.name, declaration.init);
                }
            }
        }
    });

    return exportedConstants;
}

function buildConstantObjectMap(filePath, ast, importCache = new Map()) {
    const constantMap = new Map();
    traverse(ast, (node) => {
        if (
            node.type === 'VariableDeclarator' &&
            node.id.type === 'Identifier' &&
            node.init?.type === 'ObjectExpression'
        ) {
            constantMap.set(node.id.name, node.init);
        }
    });

    traverse(ast, (node) => {
        if (node.type !== 'ImportDeclaration' || !node.source.value.startsWith('.')) return;

        const importedFile = resolveModulePath(filePath, node.source.value);
        if (!importedFile) return;

        const exportedConstants = collectExportedObjectConstants(importedFile, importCache);
        for (const specifier of node.specifiers) {
            if (specifier.type !== 'ImportSpecifier') continue;

            const importedName = specifier.imported.name;
            const localName = specifier.local.name;
            const exportedObject = exportedConstants.get(importedName);
            if (exportedObject) {
                constantMap.set(localName, exportedObject);
            }
        }
    });

    return constantMap;
}

function extractObjectKeys(objectExpression, constantMap = new Map()) {
    if (!objectExpression || objectExpression.type !== 'ObjectExpression') return [];
    const keys = new Set();

    for (const property of objectExpression.properties) {
        if (property.type === 'SpreadElement' && property.argument.type === 'Identifier') {
            const spreadObject = constantMap.get(property.argument.name);
            for (const key of extractObjectKeys(spreadObject, constantMap)) {
                keys.add(key);
            }
            continue;
        }

        const name = getPropertyName(property);
        if (name) keys.add(name);
    }

    return [...keys];
}

function findSaveDataFields(ast, helperAst = null) {
    let fields = [];
    traverse(ast, (node) => {
        if (node.type !== 'Property' || getPropertyName(node) !== 'saveGame' || !isFunctionLike(node.value)) {
            return;
        }

        traverse(node.value.body, (inner) => {
            if (
                inner.type === 'VariableDeclarator' &&
                inner.id.type === 'Identifier' &&
                inner.id.name === 'saveData' &&
                inner.init?.type === 'ObjectExpression'
            ) {
                fields = extractObjectKeys(inner.init);
            }
        });
    });

    if (fields.length > 0 || !helperAst) {
        return fields;
    }

    traverse(helperAst, (node) => {
        if (
            node.type !== 'FunctionDeclaration' ||
            node.id?.name !== 'createSaveSnapshot'
        ) {
            return;
        }

        traverse(node.body, (inner) => {
            if (
                inner.type === 'CallExpression' &&
                inner.callee.type === 'Identifier' &&
                inner.callee.name === 'parseSavePayload' &&
                inner.arguments[0]?.type === 'ObjectExpression'
            ) {
                fields = extractObjectKeys(inner.arguments[0]);
            }
        });
    });

    return fields;
}

function collectReadRoots(ast) {
    const roots = new Map();
    const interestingRoots = new Set(['raw', 'parsed', 'cleanData', 'payload', 'data', 'saveBlob', 'canonicalSave', 'importBlob']);

    traverse(ast, (node) => {
        const access = getRootMemberAccess(node);
        if (!access || !interestingRoots.has(access.root) || access.chain.length === 0) return;
        const rootField = access.chain[0];
        if (!roots.has(rootField)) {
            roots.set(rootField, []);
        }
        roots.get(rootField).push(node.loc.start.line);
    });

    return roots;
}

function collectDuplicateActions(ast) {
    const duplicates = [];
    traverse(ast, (node) => {
        if (node.type !== 'ObjectExpression') return;
        const seen = new Map();
        for (const property of node.properties) {
            const name = getPropertyName(property);
            if (!name || !isFunctionLike(property.value)) continue;
            const bucket = seen.get(name) || [];
            bucket.push(property.loc.start.line);
            seen.set(name, bucket);
        }

        for (const [name, lines] of seen.entries()) {
            if (lines.length > 1) {
                duplicates.push({ name, lines, impact: 'dead_ui_wiring', priority: 'P2' });
            }
        }
    });
    return duplicates;
}

function relativePath(fullPath) {
    return path.relative(ROOT, fullPath).replace(/\\/g, '/');
}

function collectMathRandomUsage() {
    const hits = [];

    function isAssignedFunction(node, parent) {
        if (!node || !isFunctionLike(node)) return false;
        return Boolean(
            node.id?.name ||
            parent?.type === 'VariableDeclarator' ||
            parent?.type === 'Property' ||
            parent?.type === 'MethodDefinition' ||
            parent?.type === 'ExportDefaultDeclaration'
        );
    }

    function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (['node_modules', 'dist', 'build'].includes(entry.name)) continue;
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
                continue;
            }
            if (!/\.(js|jsx)$/.test(entry.name)) continue;

            const ast = parseModule(fullPath);
            traverse(ast, (node, _parent, ancestors) => {
                if (
                    node.type === 'CallExpression' &&
                    node.callee.type === 'MemberExpression' &&
                    node.callee.object.type === 'Identifier' &&
                    node.callee.object.name === 'Math' &&
                    node.callee.property.type === 'Identifier' &&
                    node.callee.property.name === 'random'
                ) {
                    const functionAncestors = ancestors.filter(isFunctionLike);
                    const hasAssignedFunctionAncestor = functionAncestors.some((ancestor) => {
                        const idx = ancestors.indexOf(ancestor);
                        const parent = idx > 0 ? ancestors[idx - 1] : null;
                        return isAssignedFunction(ancestor, parent);
                    });
                    const rel = relativePath(fullPath);
                    const riskyPath = /src\/(components|hooks|store)\//.test(rel);
                    hits.push({
                        file: rel,
                        line: node.loc.start.line,
                        classification: hasAssignedFunctionAncestor && riskyPath ? 'unsafe' : 'safe',
                        suggestion: hasAssignedFunctionAncestor && riskyPath ? 'Replace with seedrandom or deterministic input.' : 'Module-scope usage; review only if gameplay-affecting.'
                    });
                }
            });
        }
    }

    walk(SRC_ROOT);
    return hits;
}

async function run() {
    console.log('PRIMERA Store Audit Engine starting...');

    const storeAst = parseModule(STORE_PATH);
    const saveSlotAst = parseModule(SAVE_SLOT_PATH);
    const savePayloadAst = parseModule(SAVE_PAYLOAD_PATH);
    const storeObject = findStoreObject(storeAst);
    const constantMap = buildConstantObjectMap(STORE_PATH, storeAst);

    if (!storeObject) {
        throw new Error('Failed to locate store root object in useGameStore.js');
    }

    const rootProps = new Map();
    for (const property of storeObject.properties) {
        const name = getPropertyName(property);
        if (name) rootProps.set(name, property);
    }

    const failures = [];
    let checkedSlices = 0;
    let checkedActions = 0;

    for (const [sliceName, config] of Object.entries(STORE_CONTRACT.slices)) {
        checkedSlices++;
        const sliceProp = rootProps.get(sliceName);
        if (!sliceProp || sliceProp.value.type !== 'ObjectExpression') {
            failures.push({ type: 'error', impact: 'dead_ui_wiring', priority: 'P2', message: `Slice [${sliceName}] missing in useGameStore` });
            continue;
        }

        const sliceKeys = new Set(extractObjectKeys(sliceProp.value, constantMap));
        for (const key of config.requiredKeys) {
            if (!sliceKeys.has(key)) {
                failures.push({ type: 'warning', impact: 'dead_ui_wiring', priority: 'P2', message: `Key [${key}] missing from slice [${sliceName}]` });
            }
        }
    }

    for (const [groupName, actions] of Object.entries(STORE_CONTRACT.actions)) {
        const actionGroup = rootProps.get(groupName);
        if (!actionGroup || actionGroup.value.type !== 'ObjectExpression') {
            failures.push({ type: 'error', impact: 'dead_ui_wiring', priority: 'P2', message: `Action Group [${groupName}] missing` });
            continue;
        }

        const groupActions = new Set(extractObjectKeys(actionGroup.value, constantMap));
        for (const action of actions) {
            checkedActions++;
            if (!groupActions.has(action)) {
                failures.push({ type: 'error', impact: 'dead_ui_wiring', priority: 'P2', message: `Action [${action}] missing from [${groupName}]` });
            }
        }
    }

    const savedFields = findSaveDataFields(storeAst, savePayloadAst);
    const readRootsMap = collectReadRoots(saveSlotAst);
    const ignoredReadFields = new Set(['_exportInfo', 'saves']);
    const compatibilityReadFields = new Set(['profile', 'day', 'reputation']);
    const requiredDirectReadFields = new Set(['player', 'world', 'saveVersion', 'savedAt']);
    const readFields = [...readRootsMap.keys()].filter((field) => !ignoredReadFields.has(field));
    const schemaDrift = {
        savedFields,
        readFields,
        compatibilityReads: readFields.filter((field) => compatibilityReadFields.has(field)),
        passThroughFields: savedFields.filter((field) => !requiredDirectReadFields.has(field)),
        readButNotSaved: readFields.filter((field) => !savedFields.includes(field) && !compatibilityReadFields.has(field)),
        savedButNotRead: savedFields.filter((field) => requiredDirectReadFields.has(field) && !readFields.includes(field))
    };

    if (schemaDrift.readButNotSaved.length > 0 || schemaDrift.savedButNotRead.length > 0) {
        failures.push({
            type: 'error',
            impact: 'save_corruption',
            priority: 'P0',
            message: `Save schema drift detected. readButNotSaved=${schemaDrift.readButNotSaved.join(', ') || '-'}; savedButNotRead=${schemaDrift.savedButNotRead.join(', ') || '-'}.`
        });
    }

    const duplicateActions = collectDuplicateActions(storeAst);
    for (const duplicate of duplicateActions) {
        failures.push({
            type: 'error',
            impact: duplicate.impact,
            priority: duplicate.priority,
            message: `Duplicate action key [${duplicate.name}] detected at lines ${duplicate.lines.join(', ')}.`
        });
    }

    const randomnessHits = collectMathRandomUsage();
    const unsafeRandomness = randomnessHits.filter((hit) => hit.classification === 'unsafe');
    if (unsafeRandomness.length > 0) {
        failures.push({
            type: 'warning',
            impact: 'nondeterminism',
            priority: 'P1',
            message: `${unsafeRandomness.length} unsafe Math.random() usages detected in gameplay paths.`
        });
    }

    const results = {
        pass: failures.every((failure) => failure.type !== 'error'),
        checkedSlices,
        checkedActions,
        failures,
        schemaDrift,
        duplicateActions,
        randomnessAudit: {
            total: randomnessHits.length,
            unsafe: unsafeRandomness.length,
            hits: randomnessHits
        }
    };

    writeStampedJson(
        path.join(OUTDIR, 'store_audit.json'),
        results,
        'engine-store-audit',
        ['useGameStore.js', 'SaveSlotSelector.jsx', 'savePayload.js', 'store.contract.mjs']
    );

    console.log(`Store Contract Audit ${results.pass ? 'PASSED' : 'FAILED'} (${checkedSlices} slices, ${checkedActions} actions)`);
}

run().catch((error) => {
    console.error('Store Audit Engine failed:', error);
    process.exit(1);
});
