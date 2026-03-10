import fs from 'fs';
import path from 'path';

const modulesDir = 'src/game/cases/modules';
const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.js'));

console.log(`Auditing ${files.length} modules...`);

files.forEach(file => {
    const content = fs.readFileSync(path.join(modulesDir, file), 'utf8');
    // Simple regex to find case objects (rough but effective for this audit)
    const cases = content.match(/id:\s*'[^']+'/g) || [];
    const diagnoses = content.match(/diagnosis:\s*'[^']+'/g) || [];
    const icd10s = content.match(/icd10:\s*'[^']+'/g) || [];

    if (diagnoses.length !== icd10s.length) {
        console.warn(`[WARN] ${file}: ${diagnoses.length} diagnoses vs ${icd10s.length} ICD-10 codes.`);

        // Find specific missing names
        const entries = content.split('{').slice(1);
        entries.forEach((entry, idx) => {
            if (entry.includes('diagnosis:') && !entry.includes('icd10:')) {
                const diagMatch = entry.match(/diagnosis:\s*'([^']+)'/);
                const idMatch = entry.match(/id:\s*'([^']+)'/);
                console.log(`  - Missing ICD-10 in entry ${idx}: ${idMatch?.[1]} (${diagMatch?.[1]})`);
            }
        });
    }
});
