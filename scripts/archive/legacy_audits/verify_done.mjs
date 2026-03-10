import fs from 'fs';

const data = JSON.parse(fs.readFileSync('eslint_done.json', 'utf8'));

const targetFiles = [
    'src/hooks/usePatientEMR.js',
    'src/components/Dashboard.jsx',
    'src/components/ArsipPage.jsx',
    'src/pages/RumahDinas.jsx',
    'src/components/ClinicalPage.jsx',
    'src/App.jsx'
];

console.log('Final Verfication Status:');
targetFiles.forEach(target => {
    const file = data.find(f => f.filePath.replace(/\\/g, '/').includes(target));
    if (file && (file.errorCount > 0 || file.warningCount > 0)) {
        console.log(`${target}: ${file.errorCount} errors, ${file.warningCount} warnings`);
        file.messages.forEach(msg => {
            console.log(`  - [${msg.ruleId}] Line ${msg.line}: ${msg.message}`);
        });
    } else {
        console.log(`${target}: OK (No errors found)`);
    }
});
