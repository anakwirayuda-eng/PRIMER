import fs from 'fs';
const procPath = './src/data/ProceduresDB.js';
const PROCEDURE_IDS = new Set();
if (fs.existsSync(procPath)) {
    const procRaw = fs.readFileSync(procPath, 'utf-8');
    const procIdPattern = /id:\s*'([^']+)'/g;
    let p;
    while ((p = procIdPattern.exec(procRaw)) !== null) {
        PROCEDURE_IDS.add(p[1]);
    }
}
console.log('PROCEDURE_IDS size:', PROCEDURE_IDS.size);
if (PROCEDURE_IDS.size > 0) {
    console.log('Sample:', [...PROCEDURE_IDS].slice(0, 5));
} else {
    console.log('Content Start:', fs.readFileSync(procPath, 'utf-8').slice(0, 100));
}
