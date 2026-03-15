import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';
import {
    parseModule,
    findStoreObject,
    buildConstantObjectMap,
    buildObjectFactoryMap,
    resolveObjectExpression
} from '../../scripts/primera/engine-store-audit.mjs';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '../..');
const STORE_PATH = path.join(ROOT, 'src/store/useGameStore.js');
const REPORT_PATH = path.join(ROOT, 'megalog/outputs/store_audit.json');

function getPropertyName(property) {
    if (!property || property.type !== 'Property') return null;
    if (property.key.type === 'Identifier') return property.key.name;
    if (property.key.type === 'Literal') return String(property.key.value);
    return null;
}

function extractKeys(objectExpression) {
    return new Set(
        objectExpression.properties
            .map(getPropertyName)
            .filter(Boolean)
    );
}

describe('engine-store-audit', () => {
    it('resolves factory-backed store slices from the real root object', () => {
        const storeAst = parseModule(STORE_PATH);
        const storeObject = findStoreObject(storeAst);
        const constantMap = buildConstantObjectMap(STORE_PATH, storeAst);
        const factoryMap = buildObjectFactoryMap(storeAst);
        const rootProps = new Map(
            storeObject.properties
                .map((property) => [getPropertyName(property), property])
                .filter(([name]) => Boolean(name))
        );

        const expectedSlices = {
            finance: ['stats', 'pharmacyInventory'],
            publicHealth: ['prolanisRoster', 'activeOutbreaks'],
            clinical: ['queue', 'history']
        };

        for (const [sliceName, expectedKeys] of Object.entries(expectedSlices)) {
            const resolved = resolveObjectExpression(rootProps.get(sliceName)?.value, constantMap, factoryMap);
            expect(resolved?.type, sliceName).toBe('ObjectExpression');

            const resolvedKeys = extractKeys(resolved);
            for (const key of expectedKeys) {
                expect(resolvedKeys.has(key), `${sliceName}.${key}`).toBe(true);
            }
        }
    });

    it('keeps the CLI audit green for factory-backed slices', () => {
        const result = spawnSync(process.execPath, ['scripts/primera/engine-store-audit.mjs'], {
            cwd: ROOT,
            encoding: 'utf8'
        });

        expect(result.status).toBe(0);
        expect(result.stdout).toContain('Store Contract Audit PASSED');

        const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
        const failureMessages = report.failures.map((failure) => failure.message);

        expect(report.pass).toBe(true);
        expect(failureMessages).not.toEqual(expect.arrayContaining([
            expect.stringContaining('Slice [finance] missing'),
            expect.stringContaining('Slice [publicHealth] missing'),
            expect.stringContaining('Slice [clinical] missing')
        ]));
    });
});
