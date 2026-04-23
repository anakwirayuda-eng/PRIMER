import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeIcd10OriginalIndo } from '../src/data/icd10OriginalIndoOverrides.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const MASTER_PATH = path.join(ROOT, 'src/data/master_icd_10.json');
const OUTPUT_PATH = path.join(ROOT, 'megalog/outputs/icd10_translation_audit.json');
const SAMPLE_LIMIT = 8;

const FINDING_DEFS = [
    {
        id: 'heart_to_hati',
        label: 'Heart mistranslated as hati',
        kind: 'dangerous',
        severity: 'critical',
        test: ({ code, label }) => code === 'C38.0' && /\bhati\b/i.test(label)
    },
    {
        id: 'respiratory_arrest_to_slow_breathing',
        label: 'Respiratory arrest mistranslated as pernapasan lambat',
        kind: 'dangerous',
        severity: 'critical',
        test: ({ code, label }) => code === 'R09.2' && /\bpernapasan\s+lambat\b/i.test(label)
    },
    {
        id: 'appendix_to_lampiran',
        label: 'Appendix mistranslated as lampiran',
        kind: 'homonym',
        severity: 'high',
        test: ({ english, label }) => /\bappendix\b/i.test(english) && /\blampiran\b/i.test(label)
    },
    {
        id: 'site_to_situs',
        label: 'Site/sites mistranslated as situs',
        kind: 'homonym',
        severity: 'high',
        test: ({ english, label }) => /\bsites?\b/i.test(english) && /\bsitus\b/i.test(label)
    },
    {
        id: 'gait_to_kiprah',
        label: 'Gait mistranslated as kiprah',
        kind: 'homonym',
        severity: 'high',
        test: ({ english, label }) => /\bgait\b/i.test(english) && /\bkiprah\b/i.test(label)
    },
    {
        id: 'cutaneous_leftover',
        label: 'Cutaneous left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\bcutaneous\b/i.test(label)
    },
    {
        id: 'unspecified_leftover',
        label: 'Unspecified left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\bunspecified\b/i.test(label)
    },
    {
        id: 'nontraumatic_leftover',
        label: 'Nontraumatic left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\bnontraumatic\b/i.test(label)
    },
    {
        id: 'sequelae_leftover',
        label: 'Sequelae left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\bsequelae\b/i.test(label)
    },
    {
        id: 'frostbite_leftover',
        label: 'Frostbite left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\bfrostbite\b/i.test(label)
    },
    {
        id: 'pediculosis_family_leftover',
        label: 'Pediculosis left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\bpediculosis\b/i.test(label)
    },
    {
        id: 'thoracoabdominal_leftover',
        label: 'Thoracoabdominal left untranslated',
        kind: 'english_leftover',
        severity: 'low',
        test: ({ label }) => /\bthoracoabdominal\b/i.test(label)
    },
    {
        id: 'thrombosed_leftover',
        label: 'Thrombosed left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\bthrombosed\b/i.test(label)
    },
    {
        id: 'nontraffic_family_leftover',
        label: 'Transport qualifiers left in English (nontraffic/nonmotor/noncollision)',
        kind: 'english_leftover',
        severity: 'low',
        test: ({ label }) => /\b(nontraffic|nonmotor|noncollision)\b/i.test(label)
    },
    {
        id: 'intraventricular_family_leftover',
        label: 'Intraventricular/intracerebral left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\b(intraventricular|intracerebral)\b/i.test(label)
    },
    {
        id: 'intrathoracic_leftover',
        label: 'Intrathoracic left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\bintrathoracic\b/i.test(label)
    },
    {
        id: 'cultur_typo_leftover',
        label: 'Legacy cultur typo left unnormalized',
        kind: 'english_leftover',
        severity: 'low',
        test: ({ english, label }) => /\bculture\b/i.test(english) && /\bcultur\b/i.test(label)
    },
    {
        id: 'arthritis_family_leftover',
        label: 'Arthritis-family terms left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\b(polyarthritis|arthritis|arthrosis|arthropathy|arthropathies)\b/i.test(label)
    },
    {
        id: 'juvenile_idiopathic_leftover',
        label: 'Juvenile/idiopathic left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\b(juvenile|idiopathic)\b/i.test(label)
    },
    {
        id: 'interstitial_postprocedural_leftover',
        label: 'Interstitial/postprocedural left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\b(interstitial|postprocedural)\b/i.test(label)
    },
    {
        id: 'septicaemia_immunodeficiency_leftover',
        label: 'Septicaemia/immunodeficiency left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\b(septicaemia|immunodeficiency)\b/i.test(label)
    },
    {
        id: 'disc_myelopathy_leftover',
        label: 'Disc/myelopathy left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\b(disc|myelopathy)\b/i.test(label)
    },
    {
        id: 'cardiomyopathy_myiasis_leftover',
        label: 'Cardiomyopathy/myiasis left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\b(cardiomyopathy|myiasis)\b/i.test(label)
    },
    {
        id: 'rheumatic_ciliary_leftover',
        label: 'Rheumatoid/nonrheumatic/ciliary left untranslated',
        kind: 'english_leftover',
        severity: 'medium',
        test: ({ label }) => /\b(rheumatoid|nonrheumatic|ciliary)\b/i.test(label)
    }
];

function readMasterData() {
    return JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
}

function createFindingAccumulator(def) {
    return {
        id: def.id,
        label: def.label,
        kind: def.kind,
        severity: def.severity,
        count: 0,
        examples: []
    };
}

function createKindSets() {
    return {
        dangerous: new Set(),
        homonym: new Set(),
        english_leftover: new Set()
    };
}

function addExample(bucket, row, raw, normalized) {
    if (bucket.examples.length >= SAMPLE_LIMIT) return;
    bucket.examples.push({
        code: row.kode_icd || '',
        english: row.nama_icd || '',
        raw,
        normalized
    });
}

function scanRows(rows, mode) {
    const findings = new Map(FINDING_DEFS.map((def) => [def.id, createFindingAccumulator(def)]));
    const kindSets = createKindSets();

    rows.forEach((row) => {
        const raw = (row.nama_icd_indo || '').replace(/\s+/g, ' ').trim();
        const normalized = normalizeIcd10OriginalIndo({
            code: row.kode_icd || '',
            english: row.nama_icd || '',
            indo: row.nama_icd_indo || ''
        });
        const label = mode === 'raw' ? raw : normalized;

        FINDING_DEFS.forEach((def) => {
            if (!label || !def.test({ code: row.kode_icd || '', english: row.nama_icd || '', label })) {
                return;
            }

            const bucket = findings.get(def.id);
            bucket.count++;
            kindSets[def.kind].add(row.kode_icd || '');
            addExample(bucket, row, raw, normalized);
        });
    });

    return {
        findings: [...findings.values()].filter((bucket) => bucket.count > 0),
        totalsByKind: Object.fromEntries(
            Object.entries(kindSets).map(([kind, codes]) => [kind, codes.size])
        )
    };
}

function summarizeBucketDeltas(rawScan, normalizedScan) {
    const rawMap = new Map(rawScan.findings.map((bucket) => [bucket.id, bucket]));
    const normalizedMap = new Map(normalizedScan.findings.map((bucket) => [bucket.id, bucket]));

    return FINDING_DEFS.map((def) => {
        const rawBucket = rawMap.get(def.id);
        const normalizedBucket = normalizedMap.get(def.id);
        return {
            id: def.id,
            label: def.label,
            kind: def.kind,
            severity: def.severity,
            rawCount: rawBucket?.count || 0,
            normalizedCount: normalizedBucket?.count || 0,
            delta: (rawBucket?.count || 0) - (normalizedBucket?.count || 0),
            rawExamples: rawBucket?.examples || [],
            normalizedExamples: normalizedBucket?.examples || []
        };
    });
}

function resolveStatus({ dangerous, homonym, english_leftover: englishLeftover }) {
    if (dangerous > 0 || homonym > 0) return 'fail';
    if (englishLeftover > 0) return 'warn';
    return 'pass';
}

function formatExamples(examples) {
    return examples
        .slice(0, 3)
        .map((example) => `${example.code} "${example.normalized}"`)
        .join(' | ');
}

const masterData = readMasterData();
const changedByNormalization = masterData.filter((row) => {
    const raw = (row.nama_icd_indo || '').replace(/\s+/g, ' ').trim();
    const normalized = normalizeIcd10OriginalIndo({
        code: row.kode_icd || '',
        english: row.nama_icd || '',
        indo: row.nama_icd_indo || ''
    });
    return raw !== normalized;
});

const rawScan = scanRows(masterData, 'raw');
const normalizedScan = scanRows(masterData, 'normalized');
const bucketSummary = summarizeBucketDeltas(rawScan, normalizedScan);

const unresolvedAfterNormalization = bucketSummary
    .filter((bucket) => bucket.normalizedCount > 0)
    .sort((a, b) => b.normalizedCount - a.normalizedCount);

const fullyResolvedByNormalization = bucketSummary
    .filter((bucket) => bucket.rawCount > 0 && bucket.normalizedCount === 0)
    .sort((a, b) => b.rawCount - a.rawCount);

const partiallyResolvedByNormalization = bucketSummary
    .filter((bucket) => bucket.rawCount > 0 && bucket.normalizedCount > 0 && bucket.normalizedCount < bucket.rawCount)
    .sort((a, b) => b.rawCount - a.rawCount);

const report = {
    generatedAt: new Date().toISOString(),
    sourceFile: 'src/data/master_icd_10.json',
    totals: {
        entries: masterData.length,
        changedByNormalization: changedByNormalization.length
    },
    statuses: {
        rawMaster: {
            status: resolveStatus(rawScan.totalsByKind),
            impactedEntries: rawScan.totalsByKind
        },
        runtimeNormalized: {
            status: resolveStatus(normalizedScan.totalsByKind),
            impactedEntries: normalizedScan.totalsByKind
        }
    },
    findings: bucketSummary,
    unresolvedAfterNormalization,
    partiallyResolvedByNormalization,
    fullyResolvedByNormalization,
    changedSamples: changedByNormalization.slice(0, 25).map((row) => ({
        code: row.kode_icd || '',
        english: row.nama_icd || '',
        raw: (row.nama_icd_indo || '').replace(/\s+/g, ' ').trim(),
        normalized: normalizeIcd10OriginalIndo({
            code: row.kode_icd || '',
            english: row.nama_icd || '',
            indo: row.nama_icd_indo || ''
        })
    }))
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);

console.log('ICD-10 TRANSLATION AUDIT (FULL SWEEP)');
console.log('====================================');
console.log(`Entries scanned           : ${report.totals.entries}`);
console.log(`Runtime normalization diff: ${report.totals.changedByNormalization}`);
console.log('');
console.log(`Raw master status         : ${report.statuses.rawMaster.status.toUpperCase()}`);
console.log(`  Dangerous entries       : ${report.statuses.rawMaster.impactedEntries.dangerous}`);
console.log(`  Homonym entries         : ${report.statuses.rawMaster.impactedEntries.homonym}`);
console.log(`  English-leftover entries: ${report.statuses.rawMaster.impactedEntries.english_leftover}`);
console.log('');
console.log(`Runtime status            : ${report.statuses.runtimeNormalized.status.toUpperCase()}`);
console.log(`  Dangerous entries       : ${report.statuses.runtimeNormalized.impactedEntries.dangerous}`);
console.log(`  Homonym entries         : ${report.statuses.runtimeNormalized.impactedEntries.homonym}`);
console.log(`  English-leftover entries: ${report.statuses.runtimeNormalized.impactedEntries.english_leftover}`);
console.log('');

if (unresolvedAfterNormalization.length > 0) {
    console.log('Still unresolved after normalization:');
    unresolvedAfterNormalization.slice(0, 10).forEach((bucket) => {
        console.log(`- ${bucket.id}: ${bucket.normalizedCount} (${formatExamples(bucket.normalizedExamples)})`);
    });
    console.log('');
}

if (fullyResolvedByNormalization.length > 0) {
    console.log('Fully resolved by normalization:');
    fullyResolvedByNormalization.slice(0, 10).forEach((bucket) => {
        console.log(`- ${bucket.id}: ${bucket.rawCount} -> 0`);
    });
    console.log('');
}

if (partiallyResolvedByNormalization.length > 0) {
    console.log('Partially resolved by normalization:');
    partiallyResolvedByNormalization.slice(0, 10).forEach((bucket) => {
        console.log(`- ${bucket.id}: ${bucket.rawCount} -> ${bucket.normalizedCount}`);
    });
    console.log('');
}

console.log(`Report written to ${path.relative(ROOT, OUTPUT_PATH)}`);
