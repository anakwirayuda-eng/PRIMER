import fs from 'fs';
import { MEDICATION_DATABASE } from './src/data/MedicationDatabase.js';

const userMeds = JSON.parse(fs.readFileSync('./user_meds_list.json', 'utf8'));

const results = {
    missing: [],
    redundant: [],
    matched: []
};

function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

userMeds.forEach(userMed => {
    const userBaseName = normalize(userMed["Nama Obat"]);

    // Find matches in database
    const matches = MEDICATION_DATABASE.filter(dbMed => {
        const dbName = normalize(dbMed.name);
        return dbName.includes(userBaseName) || userBaseName.includes(dbName);
    });

    if (matches.length === 0) {
        results.missing.push(userMed);
    } else {
        results.matched.push({
            user: userMed,
            dbMatches: matches.map(m => m.name)
        });
    }
});

// Check for redundancy (items in DB that might be unnecessary or duplicated)
// This is harder, but we can look for DB items that have very similar names or IDs
const seenNames = new Set();
MEDICATION_DATABASE.forEach(dbMed => {
    const base = normalize(dbMed.name.split(' ')[0]); // Check by first word
    if (seenNames.has(base)) {
        // Potential redundancy check logic could go here
    }
    seenNames.add(base);
});

console.log("=== AUDIT RESULTS ===");
console.log(`\nFound ${results.matched.length} medications already in database.`);
console.log(`\nFound ${results.missing.length} medications MISSING from database:`);
results.missing.forEach(m => console.log(` - ${m["Nama Obat"]} (${m.Sediaan.join(', ')})`));

console.log("\n=== POTENTIAL MATCHES DETAILS ===");
results.matched.forEach(match => {
    console.log(`\nUser: ${match.user["Nama Obat"]} (${match.user.Sediaan.join(', ')})`);
    console.log(`DB Matches: ${match.dbMatches.join(', ')}`);
});
