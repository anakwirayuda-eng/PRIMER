import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeIcd10OriginalIndo } from '../src/data/icd10OriginalIndoOverrides.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const MASTER_PATH = path.join(ROOT, 'src/data/master_icd_10.json');
const OUTPUT_PATH = path.join(ROOT, 'megalog/outputs/icd10_translation_strict_audit.json');

const ACCEPTED_SHARED_TOKENS = new Set([
    'abnormal',
    'adrenal',
    'agenesis',
    'alopecia',
    'anterior',
    'aplasia',
    'anus',
    'aorta',
    'atresia',
    'bilateral',
    'bifida',
    'bipolar',
    'bursitis',
    'coli',
    'dermatitis',
    'diabetes',
    'delirium',
    'donor',
    'duodenum',
    'echinococcus',
    'episode',
    'escherichia',
    'endometriosis',
    'enteritis',
    'femur',
    'fistula',
    'fibrosis',
    'gastrointestinal',
    'gastrojejunal',
    'gastritis',
    'genital',
    'granuloma',
    'hepatitis',
    'hernia',
    'internal',
    'iris',
    'lichen',
    'malaria',
    'mediastinum',
    'mesangial',
    'meninges',
    'mellitus',
    'mental',
    'mitral',
    'molar',
    'motor',
    'neonatal',
    'organ',
    'orbit',
    'otitis',
    'osteoporosis',
    'onset',
    'penis',
    'perinatal',
    'peritoneum',
    'peritonitis',
    'plasmodium',
    'pneumonia',
    'pneumonitis',
    'posterior',
    'proteinuria',
    'radial',
    'segmental',
    'sepsis',
    'sinus',
    'sinusitis',
    'situ',
    'spina',
    'stenosis',
    'staphylococcus',
    'status',
    'streptococcus',
    'tendon',
    'testis',
    'thorax',
    'trauma',
    'trunk',
    'ureter',
    'uteri',
    'uterus',
    'vagina',
    'vertebra',
    'virus',
    'vitamin',
    'visual',
    'vulva',
    'unilateral',
    'melanoma',
    'antenatal',
    'meningitis',
    'media'
]);

function readMasterData() {
    return JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
}

function tokenize(text) {
    return (String(text || '').match(/[A-Za-z][A-Za-z-]{3,}/g) || []).map((token) => token.toLowerCase());
}

function isAcceptedSharedToken(token) {
    if (ACCEPTED_SHARED_TOKENS.has(token)) return true;
    if (/^[ivxlcdm]+$/i.test(token)) return true;
    if (token.includes('hiv')) return true;
    return false;
}

const masterData = readMasterData();
const sharedTokenBuckets = new Map();

masterData.forEach((row) => {
    const englishTokens = new Set(tokenize(row.nama_icd));
    const normalizedLabel = normalizeIcd10OriginalIndo({
        code: row.kode_icd || '',
        english: row.nama_icd || '',
        indo: row.nama_icd_indo || ''
    });
    const normalizedTokens = new Set(tokenize(normalizedLabel));

    [...englishTokens].forEach((token) => {
        if (!normalizedTokens.has(token) || isAcceptedSharedToken(token)) return;

        if (!sharedTokenBuckets.has(token)) {
            sharedTokenBuckets.set(token, {
                token,
                count: 0,
                examples: []
            });
        }

        const bucket = sharedTokenBuckets.get(token);
        bucket.count++;
        if (bucket.examples.length < 5) {
            bucket.examples.push({
                code: row.kode_icd || '',
                english: row.nama_icd || '',
                normalized: normalizedLabel
            });
        }
    });
});

const unresolvedSharedTokens = [...sharedTokenBuckets.values()]
    .sort((a, b) => b.count - a.count || a.token.localeCompare(b.token));

const report = {
    generatedAt: new Date().toISOString(),
    sourceFile: 'src/data/master_icd_10.json',
    note: 'Heuristic residual scan after runtime normalization. Shared tokens may still be acceptable loanwords or taxa and should be reviewed clinically before translation.',
    acceptedSharedTokenCount: ACCEPTED_SHARED_TOKENS.size,
    unresolvedSharedTokenCount: unresolvedSharedTokens.length,
    unresolvedSharedTokens
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);

console.log('ICD-10 TRANSLATION AUDIT (STRICT HEURISTIC)');
console.log('=========================================');
console.log(`Entries scanned                : ${masterData.length}`);
console.log(`Accepted shared-token allowlist: ${ACCEPTED_SHARED_TOKENS.size}`);
console.log(`Residual shared tokens         : ${unresolvedSharedTokens.length}`);
console.log('');

if (unresolvedSharedTokens.length > 0) {
    console.log('Top residual tokens after normalization:');
    unresolvedSharedTokens.slice(0, 20).forEach((bucket) => {
        const sample = bucket.examples[0];
        console.log(`- ${bucket.token}: ${bucket.count} (${sample.code} "${sample.normalized}")`);
    });
    console.log('');
}

console.log(`Report written to ${path.relative(ROOT, OUTPUT_PATH)}`);
