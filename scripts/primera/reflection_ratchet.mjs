import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const SRC_DIR = path.join(ROOT, 'src');

const EXCLUDED_EXTENSIONS = ['.json', '.svg', '.png', '.jpg', '.css', '.code-workspace'];

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getAllFiles(name, fileList);
        } else {
            const ext = path.extname(name);
            if (!EXCLUDED_EXTENSIONS.includes(ext)) {
                fileList.push(name);
            }
        }
    });
    return fileList;
}

function checkReflection() {
    console.log("⚙️  Running Reflection Ratchet (Header Guard)...");
    const files = getAllFiles(SRC_DIR);
    let missingCount = 0;
    const missingFiles = [];

    files.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('@reflection')) {
            missingCount++;
            missingFiles.push(path.relative(ROOT, filePath));
        }
    });

    if (missingCount > 0) {
        console.warn(`⚠️  Ratchet Alert: ${missingCount} files missing @reflection headers.`);
        console.log(missingFiles.join('\n'));
    } else {
        console.log("✅ All source files compliant with @reflection standards.");
    }

    return { missingCount, missingFiles };
}

const results = checkReflection();
// In a real CI, we might exit with 1 if missingCount > threshold
