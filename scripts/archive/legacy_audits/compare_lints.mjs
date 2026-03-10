import fs from 'fs';

const datav1 = JSON.parse(fs.readFileSync('megalog/outputs/eslint.json', 'utf8'));
const datav2 = JSON.parse(fs.readFileSync('eslint_v2.json', 'utf8'));

function getCounts(data) {
    const counts = {};
    data.forEach(file => {
        file.messages.forEach(msg => {
            counts[msg.ruleId] = (counts[msg.ruleId] || 0) + 1;
        });
    });
    return counts;
}

const counts1 = getCounts(datav1);
const counts2 = getCounts(datav2);

console.log('Rule Comparison:');
console.log('Rule | V1 | V2 | Diff');
console.log('-----|----|----|-----');

const allRules = new Set([...Object.keys(counts1), ...Object.keys(counts2)]);
allRules.forEach(rule => {
    const v1 = counts1[rule] || 0;
    const v2 = counts2[rule] || 0;
    const diff = v2 - v1;
    if (v1 > 0 || v2 > 0) {
        console.log(`${rule.padEnd(30)} | ${v1.toString().padStart(3)} | ${v2.toString().padStart(3)} | ${diff > 0 ? '+' : ''}${diff}`);
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

console.log('\nTarget File Status:');
targetFiles.forEach(target => {
    const filev2 = datav2.find(f => f.filePath.replace(/\\/g, '/').includes(target));
    if (filev2) {
        console.log(`${target}: ${filev2.errorCount} errors, ${filev2.warningCount} warnings`);
        filev2.messages.forEach(msg => {
            console.log(`  - [${msg.ruleId}] Line ${msg.line}: ${msg.message}`);
        });
    } else {
        console.log(`${target}: OK (No errors found)`);
    }
});
