/**
 * Village Expansion Generator — Deterministic Family Data
 * Generates 170 families (kk_31 → kk_200) with SDOH + PHBS indicators.
 * 
 * Usage: node scripts/generate_village_expansion.mjs
 * Output: scripts/village_expansion_output.json
 * 
 * Uses a seeded PRNG for reproducibility (same output every run).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Seeded PRNG (Mulberry32) ──────────────────────────────
function createRng(seed) {
    let s = seed | 0;
    return {
        next() {
            s |= 0; s = s + 0x6D2B79F5 | 0;
            let t = Math.imul(s ^ s >>> 15, 1 | s);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        },
        int(max) { return Math.floor(this.next() * max); },
        pick(arr) { return arr[this.int(arr.length)]; },
        chance(p) { return this.next() < p; },
        weightedPick(items, weights) {
            const total = weights.reduce((a, b) => a + b, 0);
            let r = this.next() * total;
            for (let i = 0; i < items.length; i++) {
                r -= weights[i];
                if (r <= 0) return items[i];
            }
            return items[items.length - 1];
        }
    };
}

// ── Name Pools ────────────────────────────────────────────
const MALE_FIRST = [
    'Agus','Andi','Arif','Bambang','Budi','Cahyo','Dani','Dedi','Eko','Fajar',
    'Gilang','Hadi','Hendra','Irfan','Joko','Kurnia','Lukman','Maman','Nanda','Oscar',
    'Putra','Rendi','Sigit','Taufik','Umar','Wahyu','Yanto','Zainal','Rudi','Feri',
    'Guntur','Erwin','Indra','Kukuh','Wawan','Slamet','Arie','Bayu','Danang','Cahyo',
    'Rizal','Surya','Hasan','Rahmat','Firman','Galih','Prasetyo','Angga','Dimas','Teguh',
    'Roni','Sugeng','Suparman','Hartono','Supardi','Mulyono','Sutrisno','Parman','Karno','Darman'
];
const FEMALE_FIRST = [
    'Ani','Ayu','Bella','Citra','Dewi','Dian','Eka','Endang','Fitri','Gita',
    'Hana','Indah','Kartika','Laras','Lina','Maya','Mega','Nita','Putri','Rina',
    'Sari','Siti','Sri','Tika','Ulfa','Vera','Wati','Yuni','Ratna','Wulan',
    'Siska','Mira','Fani','Cindy','Okta','Della','Marni','Hani','Nurul','Aisyah',
    'Lia','Riska','Tari','Winda','Neni','Sumiati','Sunarti','Yuli','Lestari','Tutik'
];
const SURNAMES = [
    'Santoso','Widodo','Kusuma','Hidayat','Setiawan','Hartono','Wijaya','Saputra',
    'Nugroho','Permana','Gunawan','Lestari','Pratama','Utomo','Cahyono','Firmansyah',
    'Pradana','Sulistyo','Rahardjo','Suryo','Kusumo','Hadi','Wahyudi','Lubis',
    'Mahendra','Nasution','Halim','Ismail','Jauhari','Kurnia','Putra','Wibowo',
    'Suryadi','Ramadhan','Sugiarto','Prabowo','Hardianto','Mulyadi','Susanto','Hermawan',
    'Salim','Budiman','Darmawan','Ardianto','Sulaiman','Handoko','Siswanto','Irawan',
    'Yulianto','Setyawan','Murdiono','Susilo','Winarto','Suherman','Basuki','Prasetya'
];

const OCCUPATIONS_MALE = [
    'Petani','Buruh','Buruh Tani','Buruh Pabrik','Pedagang','Wiraswasta','Sopir',
    'Tukang Bangunan','Tukang','Bengkel','Ojek Online','Guru','PNS','TNI/Polri',
    'Nelayan','Peternak','Satpam','Montir','Kuli','Pekerja Pabrik','Supir Truk'
];
const OCCUPATIONS_FEMALE = [
    'IRT','Pedagang','Buruh Pabrik','Penjahit','Guru','Bidan','Perawat',
    'Pedagang Pasar','Warung','Kader Posyandu','ART','Petani'
];
const OCCUPATIONS_CHILD = ['Pelajar','Mahasiswa','Balita','Bayi'];
const OCCUPATIONS_ELDER = ['Pensiun','Tidak Bekerja','Petani'];

const ECONOMY = ['Very Low','Low','Low-Middle','Middle','High'];
const ECONOMY_WEIGHTS = [0.05, 0.15, 0.25, 0.40, 0.15];
const HOUSING = ['Make-shift','Make-shift/Bamboo','Semi-Permanent','Permanent','Permanent (Large)','Old Permanent'];
const EDUCATION = ['No School','Elementary','Junior High','High School','Vocational','University','Islamic Board'];
const WATER = ['River','Well','PDAM'];
const SANITATION = ['River/Open','Shared Latrine','Private Latrine'];
const DIET = ['Poor Nutrition','Low Protein','Traditional','Instant Food','High Salt','High Sugar','High Fat','High Deep Fried','Balanced','Modern','Low Sodium'];
const ACTIVITY = ['Sedentary','Moderate','Active'];

// ── RW/RT structure (RW 03–08) ───────────────────────────
function getRwRtForFamily(familyNum) {
    // kk_31 → familyNum=31. Distribute across RW 03-08
    const offset = familyNum - 31; // 0-based
    const rwIndex = Math.floor(offset / 28); // ~28 families per RW
    const rw = String(rwIndex + 3).padStart(2, '0'); // '03'–'08'
    const rtInRw = Math.floor((offset % 28) / 5); // ~5 families per RT
    const rt = String(rtInRw + 1).padStart(2, '0');
    return { rw, rt };
}

function generateFamily(familyNum, rng) {
    const id = `kk_${String(familyNum).padStart(2, '0')}`;
    const houseId = `house_${String(familyNum).padStart(2, '0')}`;
    const { rw, rt } = getRwRtForFamily(familyNum);
    const surname = rng.pick(SURNAMES);

    // Family size: 2-6 members
    const familySize = rng.weightedPick([2, 3, 4, 5, 6], [0.1, 0.25, 0.35, 0.2, 0.1]);

    const members = [];
    let memberIdx = 1;
    const prefix = `v_${String(familyNum).padStart(2, '0')}`;

    // Head
    const headGender = rng.chance(0.08) ? 'P' : 'L'; // 8% female heads
    const headAge = 25 + rng.int(40); // 25-64
    const headFirst = rng.pick(headGender === 'L' ? MALE_FIRST : FEMALE_FIRST);
    members.push({
        id: `${prefix}_${memberIdx}`, role: 'head', firstName: headFirst,
        gender: headGender, age: headAge,
        occupation: rng.pick(headGender === 'L' ? OCCUPATIONS_MALE : OCCUPATIONS_FEMALE)
    });
    memberIdx++;

    // Spouse (if family > 1 and head isn't too old for single parent)
    const hasSpouse = familySize >= 2 && (headGender === 'L' ? rng.chance(0.92) : rng.chance(0.6));
    if (hasSpouse) {
        const spouseGender = headGender === 'L' ? 'P' : 'L';
        const spouseAge = headAge + rng.int(7) - 3; // ±3 years
        const spouseFirst = rng.pick(spouseGender === 'P' ? FEMALE_FIRST : MALE_FIRST);
        const spouseMember = {
            id: `${prefix}_${memberIdx}`, role: 'spouse', firstName: spouseFirst,
            gender: spouseGender, age: Math.max(18, spouseAge),
            occupation: rng.pick(spouseGender === 'P' ? OCCUPATIONS_FEMALE : OCCUPATIONS_MALE)
        };
        // Pregnancy chance
        if (spouseGender === 'P' && spouseAge >= 20 && spouseAge <= 40 && rng.chance(0.15)) {
            spouseMember.pregnant = true;
            spouseMember.trimester = rng.int(3) + 1;
        }
        members.push(spouseMember);
        memberIdx++;
    }

    // Children + elders
    const slotsLeft = familySize - members.length;
    for (let i = 0; i < slotsLeft; i++) {
        const isElder = rng.chance(0.12) && members.length >= 2;
        if (isElder) {
            const elderGender = rng.chance(0.5) ? 'L' : 'P';
            members.push({
                id: `${prefix}_${memberIdx}`, role: 'elder',
                firstName: rng.chance(0.4) ? `Mbah ${rng.pick(elderGender === 'L' ? MALE_FIRST : FEMALE_FIRST)}` : rng.pick(elderGender === 'L' ? MALE_FIRST : FEMALE_FIRST),
                gender: elderGender, age: 65 + rng.int(25),
                occupation: rng.pick(OCCUPATIONS_ELDER)
            });
        } else {
            const childGender = rng.chance(0.5) ? 'L' : 'P';
            const childAge = rng.int(25); // 0-24
            let occupation;
            if (childAge < 1) occupation = 'Bayi';
            else if (childAge <= 5) occupation = 'Balita';
            else if (childAge <= 17) occupation = 'Pelajar';
            else if (childAge <= 22 && rng.chance(0.3)) occupation = 'Mahasiswa';
            else if (childAge > 17) occupation = rng.pick(childGender === 'L' ? OCCUPATIONS_MALE : OCCUPATIONS_FEMALE);
            else occupation = 'Pelajar';

            const role = childAge >= 18 && rng.chance(0.15) ? 'child_spouse' : 'child';
            members.push({
                id: `${prefix}_${memberIdx}`, role,
                firstName: rng.pick(childGender === 'L' ? MALE_FIRST : FEMALE_FIRST),
                gender: childGender, age: childAge, occupation
            });
        }
        memberIdx++;
    }

    const headName = `${headFirst} ${surname}`;
    return { id, houseId, rt, rw, surname, headName, members };
}

function generateSdoh(familyNum, rng) {
    const economy = rng.weightedPick(ECONOMY, ECONOMY_WEIGHTS);
    // Correlate housing with economy
    let housing;
    if (economy === 'Very Low' || economy === 'Low') housing = rng.pick(['Make-shift', 'Make-shift/Bamboo', 'Semi-Permanent', 'Old Permanent']);
    else if (economy === 'Low-Middle') housing = rng.pick(['Semi-Permanent', 'Old Permanent', 'Permanent']);
    else housing = rng.pick(['Permanent', 'Permanent (Large)']);

    // Correlate education with economy
    let education;
    if (economy === 'Very Low') education = rng.pick(['No School', 'Elementary']);
    else if (economy === 'Low') education = rng.pick(['Elementary', 'Junior High']);
    else if (economy === 'Low-Middle') education = rng.pick(['Junior High', 'High School', 'Elementary']);
    else if (economy === 'Middle') education = rng.pick(['High School', 'Vocational', 'Junior High']);
    else education = rng.pick(['High School', 'University', 'Vocational']);

    const water = economy === 'Very Low' ? rng.pick(['River', 'Well']) : rng.pick(WATER);
    const sanitation = economy === 'Very Low' ? rng.pick(['River/Open', 'Shared Latrine']) : (economy === 'Low' ? rng.pick(['Shared Latrine', 'Private Latrine']) : 'Private Latrine');
    const smoking = rng.chance(economy === 'Low' || economy === 'Very Low' ? 0.6 : 0.35);
    const diet = rng.pick(DIET);
    const activity = rng.pick(ACTIVITY);

    return { economy, housing, education, water, sanitation, diet, smoking, activity };
}

function generateIndicators(sdoh, rng) {
    const isLowEcon = sdoh.economy === 'Very Low' || sdoh.economy === 'Low';
    return {
        kb: rng.chance(isLowEcon ? 0.7 : 0.95),
        persalinan: rng.chance(0.95),
        imunisasi: rng.chance(isLowEcon ? 0.75 : 0.95),
        asi: rng.chance(isLowEcon ? 0.7 : 0.9),
        balita: rng.chance(0.9),
        tb: rng.chance(0.95),
        hipertensi: rng.chance(isLowEcon ? 0.6 : 0.85),
        jiwa: rng.chance(0.95),
        rokok: !sdoh.smoking,
        jkn: rng.chance(isLowEcon ? 0.5 : 0.9),
        air: sdoh.water !== 'River',
        jamban: sdoh.sanitation === 'Private Latrine',
        jentik: rng.chance(isLowEcon ? 0.4 : 0.75),
    };
}

// ── Main ──────────────────────────────────────────────────
const SEED = 0xDE5A2026;
const START_KK = 31;
const END_KK = 200;

const rng = createRng(SEED);
const families = [];
const sdohMap = {};
const indicatorMap = {};

for (let i = START_KK; i <= END_KK; i++) {
    const family = generateFamily(i, rng);
    const sdoh = generateSdoh(i, rng);
    const indicators = generateIndicators(sdoh, rng);
    families.push(family);
    sdohMap[`kk_${String(i).padStart(2, '0')}`] = sdoh;
    indicatorMap[`kk_${String(i).padStart(2, '0')}`] = indicators;
}

// Stats
let totalPop = 0;
let totalPregnant = 0;
families.forEach(f => {
    totalPop += f.members.length;
    f.members.forEach(m => { if (m.pregnant) totalPregnant++; });
});

const output = { families, sdohMap, indicatorMap };
const outPath = path.join(__dirname, 'village_expansion_output.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');

console.log(`✅ Generated ${families.length} families (kk_${START_KK}–kk_${END_KK})`);
console.log(`👥 Total new population: ${totalPop}`);
console.log(`🤰 Pregnant women: ${totalPregnant}`);
console.log(`📁 Output: ${outPath}`);
