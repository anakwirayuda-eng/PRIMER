/**
 * MAIA Cross-Validation v4 - Fixed DB scanning
 * Scans all medication registry files, ProceduresDB, and EducationOptions properly.
 * Run: node src/scripts/validate_maia_suggestions.cjs
 */
const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname, '..');

// Extract ALL id: 'xxx' from a file
function extractIds(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /id:\s*['"]([^'"]+)['"]/g;
    const ids = new Set();
    let m;
    while ((m = regex.exec(content)) !== null) ids.add(m[1]);
    return ids;
}

// Parse case structures from file
function parseCaseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const cases = [];
    const lines = content.split(/\r?\n/);
    let cur = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const idMatch = line.match(/^\s{4,12}id:\s*['"]([^'"]+)['"]/);
        if (idMatch) {
            const nextBlock = lines.slice(i + 1, i + 5).join(' ');
            if (nextBlock.includes('diagnosis:') || nextBlock.includes('icd10:')) {
                if (cur && cur._ok) cases.push(cur);
                cur = { id: idMatch[1], dx: '', ct: [], cp: [], re: [], file: path.basename(filePath), _ok: false };
            }
        }
        if (!cur) continue;

        const dm = line.match(/diagnosis:\s*['"]([^'"]+)['"]/);
        if (dm) cur.dx = dm[1];

        for (const [field, key] of [['correctTreatment', 'ct'], ['correctProcedures', 'cp'], ['requiredEducation', 're']]) {
            if (line.includes(field + ':')) {
                if (field === 'correctTreatment') cur._ok = true;
                let block = '';
                let j = i;
                while (j < lines.length) { block += lines[j]; if (block.includes(']')) break; j++; }
                const items = block.match(/['"]([^'"]+)['"]/g);
                // Filter out the field name from first match
                const parsed = items ? items.map(s => s.replace(/['"]/g, '')).filter(s => s !== field) : [];
                cur[key] = parsed;
            }
        }
    }
    if (cur && cur._ok) cases.push(cur);
    return cases;
}

// ===== LOAD MED IDS FROM ALL REGISTRIES =====
const medDir = path.join(BASE, 'data', 'medication', 'registry');
const medIds = new Set();
if (fs.existsSync(medDir)) {
    for (const f of fs.readdirSync(medDir).filter(f => f.endsWith('.js'))) {
        for (const id of extractIds(path.join(medDir, f))) medIds.add(id);
    }
}

// ===== LOAD PROCEDURE IDS =====
const procIds = extractIds(path.join(BASE, 'data', 'ProceduresDB.js'));

// ===== LOAD EDUCATION IDS =====
const eduIds = extractIds(path.join(BASE, 'data', 'EducationOptions.js'));

console.log(JSON.stringify({ dbSizes: { meds: medIds.size, procs: procIds.size, edus: eduIds.size } }));

// ===== LOAD ALL CASE FILES =====
const caseDirs = [
    path.join(BASE, 'content', 'cases', 'modules', 'modules'),
    path.join(BASE, 'content', 'cases', 'modules', 'infectious'),
    path.join(BASE, 'content', 'cases', 'modules')
];

const allCases = [];
for (const dir of caseDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
        const fp = path.join(dir, file);
        if (fs.statSync(fp).isDirectory()) continue;
        try { allCases.push(...parseCaseFile(fp)); } catch (e) { process.stderr.write('Parse error ' + file + ': ' + e.message + '\n'); }
    }
}

// ===== CROSS-VALIDATE =====
const miss = { meds: {}, procs: {}, edus: {} };
const noTx = [], noEdu = [];

for (const c of allCases) {
    c.ct.forEach(id => { if (!medIds.has(id)) { miss.meds[id] = miss.meds[id] || []; miss.meds[id].push(c.id + '[' + c.file + ']'); } });
    c.cp.forEach(id => { if (!procIds.has(id)) { miss.procs[id] = miss.procs[id] || []; miss.procs[id].push(c.id + '[' + c.file + ']'); } });
    c.re.forEach(id => { if (!eduIds.has(id)) { miss.edus[id] = miss.edus[id] || []; miss.edus[id].push(c.id + '[' + c.file + ']'); } });
    if (c.ct.length === 0) noTx.push(c.id + ' (' + c.dx + ') [' + c.file + ']');
    if (c.re.length === 0) noEdu.push(c.id + ' (' + c.dx + ') [' + c.file + ']');
}

const report = {
    summary: {
        totalCases: allCases.length,
        dbSizes: { medications: medIds.size, procedures: procIds.size, education: eduIds.size },
        missingCount: { medications: Object.keys(miss.meds).length, procedures: Object.keys(miss.procs).length, education: Object.keys(miss.edus).length },
        casesWithNoTreatment: noTx.length,
        casesWithNoEducation: noEdu.length,
    },
    missingMedications: Object.entries(miss.meds).sort().map(([id, cs]) => ({ id, usedBy: cs.length, cases: cs })),
    missingProcedures: Object.entries(miss.procs).sort().map(([id, cs]) => ({ id, usedBy: cs.length, cases: cs })),
    missingEducation: Object.entries(miss.edus).sort().map(([id, cs]) => ({ id, usedBy: cs.length, cases: cs })),
    noTreatmentCases: noTx,
    noEducationCases: noEdu,
};

// Write JSON to stderr for piping, human summary to stdout
process.stderr.write(JSON.stringify(report));

// Human summary
const lines = [];
lines.push('');
lines.push('=== MAIA CROSS-VALIDATION SUMMARY ===');
lines.push('Cases: ' + report.summary.totalCases);
lines.push('DB sizes: Meds=' + report.summary.dbSizes.medications + ' Procs=' + report.summary.dbSizes.procedures + ' Edu=' + report.summary.dbSizes.education);
lines.push('Missing: Meds=' + report.summary.missingCount.medications + ' Procs=' + report.summary.missingCount.procedures + ' Edu=' + report.summary.missingCount.education);
lines.push('No treatment: ' + report.summary.casesWithNoTreatment + ', No education: ' + report.summary.casesWithNoEducation);
lines.push('');

if (report.missingMedications.length > 0) {
    lines.push('--- MISSING MEDS (' + report.missingMedications.length + ') ---');
    report.missingMedications.forEach(m => lines.push('  ' + m.id + ' (' + m.usedBy + '): ' + m.cases.join(', ')));
    lines.push('');
}
if (report.missingProcedures.length > 0) {
    lines.push('--- MISSING PROCS (' + report.missingProcedures.length + ') ---');
    report.missingProcedures.forEach(m => lines.push('  ' + m.id + ' (' + m.usedBy + '): ' + m.cases.join(', ')));
    lines.push('');
}
if (report.missingEducation.length > 0) {
    lines.push('--- MISSING EDU (' + report.missingEducation.length + ') ---');
    report.missingEducation.forEach(m => lines.push('  ' + m.id + ' (' + m.usedBy + '): ' + m.cases.join(', ')));
    lines.push('');
}
if (noTx.length > 0) {
    lines.push('--- NO TREATMENT ---');
    noTx.forEach(c => lines.push('  ' + c));
}

console.log(lines.join('\n'));
