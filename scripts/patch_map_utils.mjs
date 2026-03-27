/**
 * Patch map-utils.js to use RW-RT composite grouping + dynamic centers.
 * Run: node scripts/patch_map_utils.mjs
 */
import fs from 'fs';

const FILE = 'src/components/wilayah/map-utils.js';
let content = fs.readFileSync(FILE, 'utf8');

// 1. Fix grouping: rt-only → rw-rt composite key
content = content.replace(
    /\/\/ 3\. RT-BASED CLUSTERS/,
    '// 3. RW-RT BASED CLUSTERS (composite key)'
);

content = content.replace(
    /const rt = fam\.rt \|\| '01';\s*\r?\n\s*if \(!rtGroups\[rt\]\) rtGroups\[rt\] = \[\];\s*\r?\n\s*rtGroups\[rt\]\.push\(fam\);/,
    `const key = (fam.rw||'01')+'-'+(fam.rt||'01');\r\n            if (!rtGroups[key]) rtGroups[key] = [];\r\n            rtGroups[key].push(fam);`
);

// 2. Replace hardcoded rtCenters with legacy + dynamic
content = content.replace(
    /const rtCenters = \{[\s\S]*?'06':\s*\{[^}]+\},?\s*\};/,
    `// Legacy centers for RW 01-02 (original 30 KK)
        const legacyCenters = {
            '01-01': { x: centerX - 14, y: centerY - 12 },
            '01-02': { x: centerX + 12, y: centerY - 12 },
            '01-03': { x: centerX - 18, y: centerY + 6 },
            '01-04': { x: centerX + 18, y: centerY + 6 },
            '02-05': { x: centerX - 18, y: centerY + 22 },
            '02-06': { x: centerX + 14, y: centerY + 22 },
        };
        // Dynamic centers for expanded RW (03+)
        const allKeys = Object.keys(rtGroups).sort();
        const dynamicKeys = allKeys.filter(k => !legacyCenters[k]);
        const rtCenters = { ...legacyCenters };
        const gridCols = 6;
        const colSpacing = Math.floor((width - 20) / gridCols);
        const rowSpacing = 14;
        const gridStartY = centerY + 32;
        dynamicKeys.forEach((key, i) => {
            const col = i % gridCols;
            const row = Math.floor(i / gridCols);
            rtCenters[key] = {
                x: 10 + col * colSpacing + Math.floor(colSpacing / 2),
                y: gridStartY + row * rowSpacing
            };
        });`
);

// 3. Fix iteration: rt → rwRt variable, posyandu naming
content = content.replace(
    /Object\.keys\(rtGroups\)\.forEach\(rt =>/,
    'Object.keys(rtGroups).forEach(rwRt =>'
);

content = content.replace(
    /const center = rtCenters\[rt\] \|\| \{ x: centerX, y: centerY \+ 20 \};/,
    'const center = rtCenters[rwRt] || { x: centerX, y: centerY + 20 };'
);

content = content.replace(
    /const families = rtGroups\[rt\];/,
    'const families = rtGroups[rwRt];'
);

content = content.replace(
    /id: `posyandu_rt\$\{rt\}`/,
    'id: `posyandu_${rwRt}`'
);

content = content.replace(
    /name: `Posyandu RT \$\{rt\}`/,
    "name: `Posyandu ${rwRt.replace('-',' RT ')}`"
);

// 4. Fix dist for large clusters
content = content.replace(
    /const dist = 6 \+ \(i % 2 === 0 \? 0 : 2\);/,
    'const dist = 4 + Math.floor(i / 6) * 2;'
);

// 5. Add optional chaining for indicators (expanded families may not have it)
content = content.replace(
    /hasJentik: !fam\.indicators\.jentik/,
    'hasJentik: !fam.indicators?.jentik'
);

// 6. Add bounds check for tiles access
content = content.replace(
    /if \(tiles\[y\]\[x\] !== TILE_TYPES\.GRASS\) continue;/,
    'if (tiles[y]?.[x] !== TILE_TYPES.GRASS) continue;'
);

content = content.replace(
    /if \(tiles\[center\.y\]\[x\] === TILE_TYPES\.GRASS\)/,
    'if (tiles[center.y]?.[x] === TILE_TYPES.GRASS)'
);

content = content.replace(
    /if \(tiles\[y\]\[center\.x\] === TILE_TYPES\.GRASS\)/,
    'if (tiles[y]?.[center.x] === TILE_TYPES.GRASS)'
);

fs.writeFileSync(FILE, content, 'utf8');
console.log('✅ map-utils.js patched: RW-RT composite grouping + dynamic centers');
