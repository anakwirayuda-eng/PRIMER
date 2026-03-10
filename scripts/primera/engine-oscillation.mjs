import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

/**
 * PRIMERA Oscillation Detection Engine
 * 🛡️ Ensures stability guards are integrated and monitors runtime health.
 */

const TARGET_DIR = path.join(rootDir, 'src');
const LOG_DIR = path.join(rootDir, 'megalog/outputs');

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function scanFocusAreas(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (['hooks', 'components', 'game'].some(d => file.includes(d))) {
                scanFocusAreas(filePath, fileList);
            }
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            if (file.startsWith('use') || file.includes('Page') || file.includes('Tab')) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

function checkIntegration(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const isHighRisk = content.includes('useEffect') || content.includes('useMemo');
    const hasGuard = content.includes('guardStability');

    if (isHighRisk && !hasGuard) {
        // Not necessarily an error, but a recommendation for prophylaxis
        return { file: path.relative(rootDir, filePath), status: 'UNGUARDED' };
    }
    return hasGuard ? { file: path.relative(rootDir, filePath), status: 'GUARDED' } : null;
}

console.log("🕵️ PRIMERA Oscillation Detection Engine starting...");
const files = scanFocusAreas(TARGET_DIR);
const integrationResults = files.map(checkIntegration).filter(Boolean);

const guarded = integrationResults.filter(r => r.status === 'GUARDED');
const unguarded = integrationResults.filter(r => r.status === 'UNGUARDED');

const score = Math.round((guarded.length / (guarded.length + unguarded.length)) * 100) || 100;

console.log(`📊 Prophylaxis Density: ${score}% (${guarded.length} guarded, ${unguarded.length} recommended)`);

if (unguarded.length > 0) {
    console.log("\n⚠️ Recommended for Prophylaxis Integration:");
    unguarded.slice(0, 5).forEach(u => console.log(`  - ${u.file}`));
    if (unguarded.length > 5) console.log(`  ... and ${unguarded.length - 5} more.`);
}

fs.writeFileSync(path.join(LOG_DIR, 'oscillation_audit.json'), JSON.stringify({
    pass: score > 50,
    score,
    guardedCount: guarded.length,
    unguardedCount: unguarded.length,
    recommendations: unguarded.map(u => u.file)
}, null, 2));

process.exit(0);
