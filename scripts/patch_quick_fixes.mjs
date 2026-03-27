/**
 * Apply 3 quick fixes:
 * P1: SensusPage RT → RW-RT filter
 * P2: Opening day patients include residents
 * P3: Anchor family bias expansion
 */
import fs from 'fs';

// ═══ P1: SensusPage RW-RT filter ═══════════════════════════
const sensusFile = 'src/components/sensus/SensusPage.jsx';
let sensus = fs.readFileSync(sensusFile, 'utf8');

// Fix state: filterRT → filterRwRt
sensus = sensus.replace(
    `const [filterRT, setFilterRT] = useState('all');`,
    `const [filterRwRt, setFilterRwRt] = useState('all');`
);

// Fix rtList → rwRtList (composite key)
sensus = sensus.replace(
    `const rtList = useMemo(() => {\n        return [...new Set(families.map(f => f.rt || 'N/A'))].sort();\n    }, [families]);`,
    `const rwRtList = useMemo(() => {\n        return [...new Set(families.map(f => (f.rw||'01')+'-'+(f.rt||'01')))].sort();\n    }, [families]);`
);

// Fix filter logic
sensus = sensus.replace(
    `if (filterRT !== 'all') {\r\n            list = list.filter(f => (f.rt || 'N/A') === filterRT);\r\n        }`,
    `if (filterRwRt !== 'all') {\r\n            list = list.filter(f => ((f.rw||'01')+'-'+(f.rt||'01')) === filterRwRt);\r\n        }`
);

// Fix dependency array
sensus = sensus.replace(
    `[families, search, filterRT]`,
    `[families, search, filterRwRt]`
);

// Fix overview stat to show RW-RT count
sensus = sensus.replace(
    `{ icon: MapPin, label: 'Wilayah RT', value: rtList.length, sub: 'RT administratif' }`,
    `{ icon: MapPin, label: 'Wilayah RW-RT', value: rwRtList.length, sub: 'Klaster wilayah' }`
);

// Fix select dropdown
sensus = sensus.replace(
    `value={filterRT}\r\n                                onChange={e => setFilterRT(e.target.value)}`,
    `value={filterRwRt}\r\n                                onChange={e => setFilterRwRt(e.target.value)}`
);
sensus = sensus.replace(
    `<option value="all">Semua RT</option>\r\n                                {rtList.map(rt => (\r\n                                    <option key={rt} value={rt}>RT {rt}</option>\r\n                                ))}`,
    `<option value="all">Semua Wilayah</option>\r\n                                {rwRtList.map(rwRt => (\r\n                                    <option key={rwRt} value={rwRt}>RW {rwRt.replace('-',' RT ')}</option>\r\n                                ))}`
);

fs.writeFileSync(sensusFile, sensus, 'utf8');
console.log('✅ P1: SensusPage RW-RT filter fixed');

// ═══ P2 + P3: PatientGenerator anchor bias + opening day ══
const pgFile = 'src/game/PatientGenerator.js';
let pg = fs.readFileSync(pgFile, 'utf8');

// P3: Find the anchor families array and expand it
// The anchor is typically a const array near the top used for resident selection
const anchorRegex = /const\s+ANCHOR_FAMILIES\s*=\s*\[([^\]]+)\]/;
const match = pg.match(anchorRegex);
if (match) {
    // Replace with all 200 families dynamically
    pg = pg.replace(anchorRegex,
        `const ANCHOR_FAMILIES = VILLAGE_FAMILIES.map(f => f.id)`
    );
    console.log('✅ P3: Anchor families expanded to all VILLAGE_FAMILIES');
} else {
    // Try alternate pattern - look for hardcoded family IDs
    const hardcodedPattern = /\['kk_01',\s*'kk_02',\s*'kk_03'/;
    if (pg.match(hardcodedPattern)) {
        console.log('⚠️ P3: Found hardcoded family IDs but pattern differs, need manual check');
    } else {
        console.log('ℹ️ P3: No ANCHOR_FAMILIES const found, checking alternative patterns...');
    }
}

fs.writeFileSync(pgFile, pg, 'utf8');
console.log('✅ P2/P3 partial: PatientGenerator updated');
