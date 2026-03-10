import fs from 'fs';

const datav2 = JSON.parse(fs.readFileSync('eslint_v2.json', 'utf8'));
const datav3 = JSON.parse(fs.readFileSync('eslint_v3.json', 'utf8'));

function getCounts(data) {
    const counts = {};
    data.forEach(file => {
        file.messages.forEach(msg => {
            counts[msg.ruleId] = (counts[msg.ruleId] || 0) + 1;
        });
    });
    return counts;
}

const counts2 = getCounts(datav2);
const counts3 = getCounts(datav3);

console.log('Rule Comparison (V2 -> V3):');
console.log('Rule | V2 | V3 | Diff');
console.log('-----|----|----|-----');

const allRules = new Set([...Object.keys(counts2), ...Object.keys(counts3)]);
allRules.forEach(rule => {
    const v2 = counts2[rule] || 0;
    const v3 = counts3[rule] || 0;
    const diff = v3 - v2;
    if (v2 > 0 || v3 > 0) {
        console.log(`${rule.padEnd(30)} | ${v2.toString().padStart(3)} | ${v3.toString().padStart(3)} | ${diff > 0 ? '+' : ''}${diff}`);
    }
});

// Check specific files
const targetFiles = [
    'src/hooks/usePatientEMR.js',
    'src/components/Dashboard.jsx',
    'src/components/ArsipPage.jsx',
    'src/pages/RumahDinas.jsx',
    'src/components/ClinicalPage.jsx'
];

console.log('\nTarget File Status (V3):');
targetFiles.forEach(target => {
    const filev3 = datav3.find(f => f.filePath.replace(/\\/g, '/').includes(target));
    if (filev3 && (filev3.errorCount > 0 || filev3.warningCount > 0)) {
        console.log(`${target}: ${filev3.errorCount} errors, ${filev3.warningCount} warnings`);
        filev3.messages.forEach(msg => {
            console.log(`  - [${msg.ruleId}] Line ${msg.line}: ${msg.message}`);
        });
    } else {
        console.log(`${target}: OK (No errors found)`);
    }
});
