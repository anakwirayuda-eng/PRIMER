import fs from 'fs';
import path from 'path';

const medRegistryDir = './src/data/medication/registry';
console.log('Registry Dir:', path.resolve(medRegistryDir));

if (fs.existsSync(medRegistryDir)) {
    const medFiles = fs.readdirSync(medRegistryDir).filter(f => f.endsWith('.js'));
    console.log('Found files:', medFiles.length);
    medFiles.forEach(f => {
        const fullPath = path.join(medRegistryDir, f);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const idMatches = [...content.matchAll(/id:\s*'([^']+)'/g)];
        console.log(`${f}: ${idMatches.length} matches (Size: ${fs.statSync(fullPath).size})`);
    });
} else {
    console.log('Registry Dir NOT FOUND');
}
