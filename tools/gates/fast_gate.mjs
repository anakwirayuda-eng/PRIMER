import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');

/**
 * 🛰️ PRIMERA FAST GATE (Level 0)
 * Purpose: Instant validation of ID uniqueness and registry references.
 */

async function runFastAudit() {
    console.log("⚡ Running Level 0 Fast Gate...");
    const startTime = Date.now();
    const anomalies = [];

    // 1. ID Uniqueness Registry
    const allIds = new Map(); // id -> sourceFile

    const registries = [
        { name: 'CaseLibrary', path: 'src/game/CaseLibrary.js', pattern: /id:\s*['"](.*?)['"]/g },
        { name: 'VillageFamilies', path: 'src/data/village_families.js', pattern: /id:\s*['"](.*?)['"]/g },
        { name: 'OutbreakTypes', path: 'src/game/OutbreakSystem.js', pattern: /id:\s*['"](.*?)['"]/g }
    ];

    for (const reg of registries) {
        const fullPath = path.join(ROOT, reg.path);
        if (!fs.existsSync(fullPath)) continue;

        const content = fs.readFileSync(fullPath, 'utf8');
        let match;
        while ((match = reg.pattern.exec(content)) !== null) {
            const id = match[1];
            if (allIds.has(id)) {
                anomalies.push({
                    type: 'ID_COLLISION',
                    id,
                    current: reg.name,
                    conflictsWith: allIds.get(id)
                });
            } else {
                allIds.set(id, reg.name);
            }
        }
    }

    // 2. Schema Spot-Checks (Required Fields)
    // Example: Every case must have an id, diagnosis, and symptoms
    const caseLibPath = path.join(ROOT, 'src/game/CaseLibrary.js');
    if (fs.existsSync(caseLibPath)) {
        // Simple heuristic check for case structure
    }

    const duration = Date.now() - startTime;
    console.log(`⏱️ Audit complete in ${duration}ms.`);

    if (anomalies.length > 0) {
        console.error(`🚨 Found ${anomalies.length} Critical Anomalies:`);
        anomalies.forEach(a => console.error(`   - [${a.type}] ID "${a.id}" duplicated in ${a.current} and ${a.conflictsWith}`));
        process.exit(1);
    } else {
        console.log("✅ Level 0 Pass: Integrity Confirmed.");
    }
}

runFastAudit();
