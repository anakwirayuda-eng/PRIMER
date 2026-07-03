import en from '../locales/en.json';
import id from '../locales/id.json';
import enEmergency from '../locales/emergency/en.js';
import idEmergency from '../locales/emergency/id.js';
import enWilayah from '../locales/wilayah/en.js';
import idWilayah from '../locales/wilayah/id.js';
import enEmr from '../locales/emr/en.js';
import idEmr from '../locales/emr/id.js';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const LOCALE_ARTIFACT_PATTERN = /(â€¢|â€“|â€”|â€|â†|âœ|Ã|Â|ðŸ|ï¸|�)/;

function collectArtifacts(value, currentPath = [], findings = []) {
    if (typeof value === 'string') {
        if (LOCALE_ARTIFACT_PATTERN.test(value)) {
            findings.push({
                path: currentPath.join('.'),
                value
            });
        }
        return findings;
    }

    if (Array.isArray(value)) {
        value.forEach((item, index) => collectArtifacts(item, [...currentPath, String(index)], findings));
        return findings;
    }

    if (value && typeof value === 'object') {
        Object.entries(value).forEach(([key, nested]) => {
            collectArtifacts(nested, [...currentPath, key], findings);
        });
    }

    return findings;
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeLocale(base, extension) {
    if (Array.isArray(base) && Array.isArray(extension)) {
        return extension;
    }

    if (isPlainObject(base) && isPlainObject(extension)) {
        const merged = { ...base };
        Object.entries(extension).forEach(([key, value]) => {
            merged[key] = key in merged ? mergeLocale(merged[key], value) : value;
        });
        return merged;
    }

    return extension ?? base;
}

function collectLeafPaths(value, currentPath = [], leaves = []) {
    if (typeof value === 'string') {
        leaves.push(currentPath.join('.'));
        return leaves;
    }

    if (Array.isArray(value)) {
        value.forEach((item, index) => collectLeafPaths(item, [...currentPath, String(index)], leaves));
        return leaves;
    }

    if (value && typeof value === 'object') {
        Object.entries(value).forEach(([key, nested]) => {
            collectLeafPaths(nested, [...currentPath, key], leaves);
        });
    }

    return leaves;
}

describe('locale assets quality', () => {
    it('keeps shipped locale resources free from mojibake artifacts', () => {
        const resources = {
            'en.json': en,
            'id.json': id,
            'emergency/en.js': enEmergency,
            'emergency/id.js': idEmergency,
            'wilayah/en.js': enWilayah,
            'wilayah/id.js': idWilayah,
            'emr/en.js': enEmr,
            'emr/id.js': idEmr
        };

        const findings = Object.entries(resources).flatMap(([name, resource]) =>
            collectArtifacts(resource).map((artifact) => `${name}:${artifact.path} -> ${artifact.value}`)
        );

        expect(findings).toEqual([]);
    });

    it('keeps supported merged locales in key parity', () => {
        const mergedEn = mergeLocale(mergeLocale(mergeLocale(en, enWilayah), enEmergency), enEmr);
        const mergedId = mergeLocale(mergeLocale(mergeLocale(id, idWilayah), idEmergency), idEmr);

        const enKeys = new Set(collectLeafPaths(mergedEn));
        const idKeys = new Set(collectLeafPaths(mergedId));

        const onlyEn = [...enKeys].filter((key) => !idKeys.has(key));
        const onlyId = [...idKeys].filter((key) => !enKeys.has(key));

        expect({
            onlyEn,
            onlyId
        }).toEqual({
            onlyEn: [],
            onlyId: []
        });
    });

    it('keeps hardened multilingual shells free from legacy hardcoded copy', () => {
        const guardedSnippets = {
            '../components/MainLayout.jsx': ['Dr. Player'],
            '../components/ClinicalPage.jsx': [
                'Panggil pasien rawat jalan.',
                'Kontrol kronis dan tindak lanjut.',
                'â˜•',
                'ðŸš¨ Ada '
            ],
            '../components/WilayahPage.jsx': [
                'Panorama desa penuh · exhibition only · 2D tetap source of truth operasional.',
                'Buka Arsip RW Terkait',
                'Kasus Terkait',
                'WIKI & PROSEDUR',
                'Kunjungan Rumah (PIS-PK)'
            ]
        };

        const findings = Object.entries(guardedSnippets).flatMap(([relativePath, snippets]) => {
            const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
            return snippets
                .filter((snippet) => source.includes(snippet))
                .map((snippet) => `${relativePath}: ${snippet}`);
        });

        expect(findings).toEqual([]);
    });

    it('keeps critical Indonesian diorama chrome free from English leftovers', () => {
        expect(idWilayah.wilayahContent.ui.dioramaExhibition.captionNoScope).not.toMatch(/exhibition only|source of truth/i);
        expect(idWilayah.wilayahContent.ui.dioramaExhibition.caption).not.toMatch(/exhibition only|source of truth/i);
    });
});
