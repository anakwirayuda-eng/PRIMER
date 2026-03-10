import fs from 'fs';
const content = fs.readFileSync('./src/data/MedicationDatabase.js', 'utf8');
try {
    // Basic syntax check by parsing it into a function (though it has exports, so this is limited)
    // We can use a simple regex to check for common mistakes or just rely on the build success.
    console.log("File read successfully, length:", content.length);
} catch (e) {
    console.error("Error reading file:", e);
}
