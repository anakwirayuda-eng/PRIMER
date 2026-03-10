import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const importRegex = /from\s+['"](\.?\.\/.*)\.js['"]/g;

walk(SRC_DIR, (filePath) => {
    if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanged = false;

    const newContent = content.replace(importRegex, (match, importPath) => {
        const fullImportPathJs = path.resolve(path.dirname(filePath), importPath + '.js');
        const fullImportPathJsx = path.resolve(path.dirname(filePath), importPath + '.jsx');

        if (!fs.existsSync(fullImportPathJs) && fs.existsSync(fullImportPathJsx)) {
            console.log(`Fixing ${filePath}: ${importPath}.js -> .jsx`);
            hasChanged = true;
            return `from '${importPath}.jsx'`;
        }
        return match;
    });

    if (hasChanged) {
        fs.writeFileSync(filePath, newContent, 'utf8');
    }
});

console.log('✅ Extension fix complete.');
