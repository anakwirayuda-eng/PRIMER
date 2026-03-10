import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');
const STORE_PATH = path.join(ROOT, 'src/store/useGameStore.js');
const DIAG_DIR = path.join(ROOT, 'diagnostics');

async function main() {
    if (!fs.existsSync(STORE_PATH)) {
        console.error("❌ Store file not found.");
        return;
    }

    const content = fs.readFileSync(STORE_PATH, 'utf8');

    // Parse based on comments: // --- SLICE: NAME ---
    const sliceBlocks = content.split('// --- SLICE:');

    let md = "# 🧊 Store & Slice Schema (Parsed)\n\n";
    md += "Zustand slices defined within `useGameStore`.\n\n";

    sliceBlocks.slice(1).forEach(block => {
        const lines = block.split('\n');
        const nameMatch = lines[0].match(/(\w+)/);
        if (!nameMatch) return;

        const name = nameMatch[1];
        md += `## ${name} Slice\n`;
        md += "| Key | Type |\n";
        md += "| :--- | :--- |\n";

        // Extract identifiers that look like keys: key: or key() { or key: (
        // Stop when we hit the next slice or a major closing bracket
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('// --- SLICE:')) break;

            const keyMatch = line.match(/^(\w+)\s*:/) || line.match(/^(\w+)\s*\(/);
            if (keyMatch) {
                const key = keyMatch[1];
                if (['nav', 'world', 'player', 'finance', 'publicHealth', 'staff', 'clinical', 'meta'].includes(key)) {
                    md += `| **\`${key}\`** | **STATE ROOT** |\n`;
                } else if (key.endsWith('Actions')) {
                    md += `| **\`${key}\`** | **ACTION ROOT** |\n`;
                } else {
                    const isAction = line.includes('=>') || line.includes('function') || line.includes('(');
                    md += `| \`${key}\` | ${isAction ? 'Action' : 'State'} |\n`;
                }
            }
        }
        md += "\n";
    });

    fs.writeFileSync(path.join(DIAG_DIR, 'store-schema.md'), md);
    console.log("✅ Store Schema Dump Complete (v2)!");
}

main();
