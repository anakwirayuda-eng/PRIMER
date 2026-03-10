/**
 * @reflection
 * [IDENTITY]: ICD-9 Extraction Script
 * [PURPOSE]: Node.js script for parsing ICD-9 procedure codes.
 * [STATE]: Maintenance
 */
const fs = require('fs');
const path = require('path');

const realInputFile = 'C:\\Users\\USER\\.gemini\\antigravity\\scratch\\primer-game\\src\\data\\ICD9CM.js';
const realOutputFile = 'C:\\Users\\USER\\.gemini\\antigravity\\scratch\\primer-game\\src\\data\\master_icd_9.json';

try {
    const content = fs.readFileSync(realInputFile, 'utf8');
    // Regex to match the constant assignment
    const match = content.match(/export const ICD9CM_DB = (\[[\s\S]*?\]);/);

    if (match && match[1]) {
        let arrayContent = match[1];
        // Remove trailing commas if any, though standard JSON.parse is strict
        // But the original file seems to have trailing commas (e.g. line 23136)
        // Let's use a simple regex to remove trailing commas before ] or }
        arrayContent = arrayContent.replace(/,(\s*[\]\}])/g, '$1');

        try {
            const data = JSON.parse(arrayContent);
            fs.writeFileSync(realOutputFile, JSON.stringify(data, null, 4));
            console.log("Successfully extracted ICD9CM data.");
        } catch (e) {
            console.error("Error parsing JSON: " + e.message);
        }
    } else {
        console.error("Could not find ICD9CM_DB array in file.");
    }
} catch (e) {
    console.error("Error reading/writing file: " + e.message);
}
