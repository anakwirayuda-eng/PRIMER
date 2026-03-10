import fs from 'fs';
import path from 'path';

const SIMPLE_CASES = [
    'ispa', 'common_cold', 'gastritis', 'dyspepsia', 'tension_headache', 'myalgia'
];

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changes = 0;

            // This naive regex assumes id: '...' is near the top of the case object
            const re = /(id:\s*['"](.*?)['"],\s*name:\s*['"](.*?)['"](?:[\s\S]*?))/g;

            const newContent = content.replace(re, (match, fullIdLine, id, name) => {
                if (SIMPLE_CASES.some(c => id.includes(c) || name.toLowerCase().includes(c))) {
                    if (!match.includes('relevantCategories:')) {
                        changes++;
                        return `${fullIdLine}\n    relevantCategories: ['keluhan_utama', 'rps', 'rpd', 'sosial'],`;
                    }
                }
                return match;
            });

            if (changes > 0) {
                fs.writeFileSync(fullPath, newContent);
                console.log(`Updated ${changes} cases in ${path.basename(fullPath)}`);
            }
        }
    }
}

// Just match exact case IDs that we know are simple
function processFile(fp, targetIds) {
    if (!fs.existsSync(fp)) return;
    let content = fs.readFileSync(fp, 'utf8');
    let changes = 0;
    targetIds.forEach(id => {
        const regexStr = `(id:\\s*['"]${id}['"].*?\\n)`;
        const re = new RegExp(regexStr, 'g');
        content = content.replace(re, (match) => {
            if (!match.includes('relevantCategories')) {
                changes++;
                return match + `    relevantCategories: ['keluhan_utama', 'rps', 'rpd', 'sosial'],\n`;
            }
            return match;
        });
    });
    if (changes > 0) {
        fs.writeFileSync(fp, content);
        console.log(`Updated ${changes} cases in ${path.basename(fp)}`);
    }
}

const dir = 'd:/Dev/PRIMER/src/content/cases/modules';
// Gastritis, dyspepsia in digestive.js
processFile(path.join(dir, 'digestive.js'), ['gastritis_akut', 'gastritis_kronis', 'dyspepsia', 'dyspepsia_syndrome']);
// ISPA, common cold in respiratory.js
processFile(path.join(dir, 'respiratory.js'), ['ispa_ringan', 'ispa_sedang', 'common_cold', 'rhinitis_akut']);
// Tension headache in neurology.js
processFile(path.join(dir, 'neurology.js'), ['tension_type_headache', 'tth']);
// Myalgia in musculoskeletal.js
processFile(path.join(dir, 'musculoskeletal.js'), ['myalgia', 'myalgia_akut']);

console.log('Done mapping relevantCategories');
