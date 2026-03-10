const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const rootDir = path.resolve(__dirname, '..', '..');
const output = execSync('node src/scripts/validate_maia_suggestions.cjs', { cwd: rootDir, encoding: 'utf8' });
const r = JSON.parse(output);

const lines = [];
lines.push('=== SUMMARY ===');
lines.push('Total Cases: ' + r.summary.totalCases);
lines.push('DB Sizes: meds=' + r.summary.dbSizes.medications + ' procs=' + r.summary.dbSizes.procedures + ' edu=' + r.summary.dbSizes.education);
lines.push('Missing: meds=' + r.summary.missingCount.medications + ' procs=' + r.summary.missingCount.procedures + ' edu=' + r.summary.missingCount.education);
lines.push('No Treatment: ' + r.summary.casesWithNoTreatment);
lines.push('No Education: ' + r.summary.casesWithNoEducation);
lines.push('');
lines.push('=== MISSING MEDICATIONS ===');
r.missingMedications.forEach(function (m) { lines.push(m.id + ' (' + m.usedBy + '): ' + m.cases.join(', ')); });
lines.push('');
lines.push('=== MISSING PROCEDURES (first 20) ===');
r.missingProcedures.slice(0, 20).forEach(function (m) { lines.push(m.id + ' (' + m.usedBy + '): ' + m.cases.join(', ')); });
lines.push('... total: ' + r.missingProcedures.length);

fs.writeFileSync(path.join(__dirname, 'validation_report.txt'), lines.join('\n'), 'utf8');
console.log('Report written to validation_report.txt');
