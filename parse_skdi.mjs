import XLSX from 'xlsx';
import { writeFileSync } from 'fs';

const wb = XLSX.readFile('D:\\Dev\\PRIMER\\Data Luar\\Mapping SKDI 2021.xlsx');
console.log('Sheets:', wb.SheetNames);

for (const s of wb.SheetNames) {
    const ws = wb.Sheets[s];
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    console.log(`\n=== ${s}: ${range.e.r + 1} rows x ${range.e.c + 1} cols ===`);

    // Show first 8 rows to understand structure
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    for (let i = 0; i < Math.min(8, data.length); i++) {
        console.log(`Row ${i}:`, JSON.stringify(data[i]));
    }

    // Export full data as JSON for analysis
    const jsonData = XLSX.utils.sheet_to_json(ws);
    writeFileSync(`D:\\Dev\\PRIMER\\skdi_${s.replace(/[^a-zA-Z0-9]/g, '_')}.json`, JSON.stringify(jsonData, null, 2));
    console.log(`Exported ${jsonData.length} rows to skdi_${s.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
}
