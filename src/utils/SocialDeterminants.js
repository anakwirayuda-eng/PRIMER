/**
 * @reflection
 * [IDENTITY]: SocialDeterminants
 * [PURPOSE]: Enhanced Social Determinants of Health (SDoH) Generator Based on WHO framework and Indonesian context Age-appropriate oc
 * [STATE]: Experimental
 * [ANCHOR]: generateSocialDeterminants
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * Enhanced Social Determinants of Health (SDoH) Generator
 * Based on WHO framework and Indonesian context
 * Age-appropriate occupation assignment
 */

// Occupations grouped by age appropriateness
const OCCUPATIONS_CHILD = [
    { name: 'Pelajar SD', risk: ['Penyakit menular anak'], income: 'dependent' },
    { name: 'Pelajar SMP', risk: ['Stress sekolah'], income: 'dependent' },
    { name: 'Belum Sekolah', risk: ['Penyakit infeksi'], income: 'dependent' },
];

const OCCUPATIONS_TEEN = [
    { name: 'Pelajar SMA/SMK', risk: ['Stress akademik', 'Kurang tidur'], income: 'dependent' },
    { name: 'Santri', risk: ['Penyakit menular'], income: 'dependent' },
];

const OCCUPATIONS_YOUNG_ADULT = [
    { name: 'Mahasiswa', risk: ['Stress', 'Kurang tidur', 'Pola makan tidak teratur'], income: 'dependent' },
    { name: 'Karyawan Swasta', risk: ['Stress kerja', 'Sedentary'], income: 'medium' },
    { name: 'Buruh Pabrik', risk: ['Occupational hazard', 'Shift work'], income: 'low' },
    { name: 'Ojol/Driver Online', risk: ['Kecelakaan lalu lintas', 'Polusi udara'], income: 'low' },
    { name: 'Pedagang', risk: ['Pendapatan tidak menentu'], income: 'low' },
    { name: 'Wiraswasta', risk: ['Stress', 'Jadwal tidak teratur'], income: 'medium' },
];

const OCCUPATIONS_ADULT = [
    { name: 'Petani', risk: ['Paparan pestisida', 'Nyeri otot'], income: 'low' },
    { name: 'Nelayan', risk: ['Paparan matahari', 'Risiko tenggelam'], income: 'low' },
    { name: 'Buruh Pabrik', risk: ['Occupational hazard', 'Shift work'], income: 'low' },
    { name: 'Pedagang Kaki Lima', risk: ['Pendapatan tidak menentu', 'Paparan luar ruangan'], income: 'low' },
    { name: 'Guru', risk: ['Vocal strain', 'Stress'], income: 'medium' },
    { name: 'PNS', risk: ['Sedentary lifestyle'], income: 'medium' },
    { name: 'Wiraswasta', risk: ['Stress', 'Jadwal tidak teratur'], income: 'medium' },
    { name: 'Ibu Rumah Tangga', risk: ['Cedera domestik', 'Mental load'], income: 'varies' },
    { name: 'Ojol/Driver Online', risk: ['Kecelakaan lalu lintas', 'Polusi udara'], income: 'low' },
    { name: 'Karyawan Swasta', risk: ['Stress kerja', 'Sedentary'], income: 'medium' },
    { name: 'Tidak Bekerja', risk: ['Stress finansial', 'Depresi'], income: 'none' },
];

const OCCUPATIONS_ELDERLY = [
    { name: 'Pensiunan', risk: ['Penyakit kronis', 'Isolasi sosial'], income: 'fixed' },
    { name: 'Petani', risk: ['Paparan pestisida', 'Nyeri otot'], income: 'low' },
    { name: 'Pedagang', risk: ['Pendapatan tidak menentu'], income: 'low' },
    { name: 'Ibu Rumah Tangga', risk: ['Cedera domestik'], income: 'varies' },
    { name: 'Tidak Bekerja', risk: ['Ketergantungan ekonomi'], income: 'none' },
];

// Education levels by age
const EDUCATION_BY_AGE = {
    child: [
        { level: 'Belum Sekolah', healthLiteracy: 'very_low' },
        { level: 'SD', healthLiteracy: 'very_low' },
    ],
    teen: [
        { level: 'SD', healthLiteracy: 'low' },
        { level: 'SMP', healthLiteracy: 'low' },
        { level: 'SMA/SMK', healthLiteracy: 'medium' },
    ],
    adult: [
        { level: 'SD', healthLiteracy: 'low' },
        { level: 'SMP', healthLiteracy: 'low' },
        { level: 'SMA/SMK', healthLiteracy: 'medium' },
        { level: 'D3/S1', healthLiteracy: 'high' },
        { level: 'S2/S3', healthLiteracy: 'very_high' },
    ],
    elderly: [
        { level: 'Tidak Sekolah', healthLiteracy: 'very_low' },
        { level: 'SD', healthLiteracy: 'low' },
        { level: 'SMP', healthLiteracy: 'low' },
        { level: 'SMA/SMK', healthLiteracy: 'medium' },
        { level: 'D3/S1', healthLiteracy: 'high' },
    ]
};

const HOUSING_TYPES = [
    { type: 'Rumah Permanen', sanitation: 'good', ventilation: 'good' },
    { type: 'Rumah Semi-Permanen', sanitation: 'fair', ventilation: 'fair' },
    { type: 'Rumah Tidak Layak (Rutilahu)', sanitation: 'poor', ventilation: 'poor' },
    { type: 'Kontrakan', sanitation: 'fair', ventilation: 'fair' },
    { type: 'Kos-kosan', sanitation: 'varies', ventilation: 'varies' },
];

const FAMILY_STRUCTURES = [
    'Keluarga Inti (2 anak)',
    'Keluarga Inti (3+ anak)',
    'Keluarga Besar (3 generasi)',
    'Single Parent',
    'Tinggal Sendiri',
];

const DISTANCE_CATEGORIES = [
    { desc: '< 1 km (Dekat)', accessBarrier: 'none' },
    { desc: '1-5 km', accessBarrier: 'low' },
    { desc: '5-10 km', accessBarrier: 'medium' },
    { desc: '> 10 km (Jauh)', accessBarrier: 'high' },
];

const LIFESTYLE_FACTORS = {
    smoking: ['Tidak Merokok', 'Perokok Ringan (< 10/hari)', 'Perokok Berat (> 20/hari)', 'Mantan Perokok'],
    smoking_child: ['Tidak Merokok'],
    alcohol: ['Tidak Minum Alkohol', 'Kadang-kadang', 'Rutin'],
    alcohol_child: ['Tidak Minum Alkohol'],
    exercise: ['Aktif (Olahraga rutin)', 'Sedang (Kadang olahraga)', 'Kurang Aktif (Jarang)', 'Tidak Pernah'],
    diet: ['Seimbang', 'Tinggi Karbohidrat', 'Tinggi Garam', 'Tinggi Gula', 'Vegetarian']
};

const BELIEFS = [
    { belief: 'Modern/Pro-medis', impact: 'positive' },
    { belief: 'Tradisional (Jamu, Dukun)', impact: 'mixed' },
    { belief: 'Skeptis terhadap obat', impact: 'negative' },
    { belief: 'Anti-vaksin', impact: 'negative' },
];

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getAgeGroup(age) {
    if (age < 6) return 'toddler';
    if (age < 13) return 'child';
    if (age < 18) return 'teen';
    if (age < 25) return 'young_adult';
    if (age < 60) return 'adult';
    return 'elderly';
}

export function generateSocialDeterminants(age = 30) {
    const ageGroup = getAgeGroup(age);

    // Age-appropriate occupation
    let occupationPool;
    switch (ageGroup) {
        case 'toddler':
        case 'child':
            occupationPool = OCCUPATIONS_CHILD;
            break;
        case 'teen':
            occupationPool = OCCUPATIONS_TEEN;
            break;
        case 'young_adult':
            occupationPool = OCCUPATIONS_YOUNG_ADULT;
            break;
        case 'elderly':
            occupationPool = OCCUPATIONS_ELDERLY;
            break;
        default:
            occupationPool = OCCUPATIONS_ADULT;
    }

    const occupation = randomChoice(occupationPool);

    // Age-appropriate education
    let educationPool = EDUCATION_BY_AGE.adult;
    if (ageGroup === 'toddler' || ageGroup === 'child') educationPool = EDUCATION_BY_AGE.child;
    else if (ageGroup === 'teen') educationPool = EDUCATION_BY_AGE.teen;
    else if (ageGroup === 'elderly') educationPool = EDUCATION_BY_AGE.elderly;

    const education = randomChoice(educationPool);
    const housing = randomChoice(HOUSING_TYPES);
    const distance = randomChoice(DISTANCE_CATEGORIES);
    const belief = randomChoice(BELIEFS);

    // BPJS status correlated with income
    const hasBPJS = occupation.income === 'none' ? Math.random() > 0.3 :
        occupation.income === 'low' ? Math.random() > 0.4 :
            occupation.income === 'dependent' ? Math.random() > 0.2 :
                Math.random() > 0.2;

    const bpjsClass = hasBPJS ? (
        occupation.income === 'none' || occupation.income === 'low' || occupation.income === 'dependent' ? 'PBI (Kelas 3)' :
            occupation.income === 'medium' ? 'Mandiri (Kelas 2)' : 'Mandiri (Kelas 1)'
    ) : null;

    // Trust level based on education and belief
    const trustLevel = belief.impact === 'negative' ? 'skeptical' :
        education.healthLiteracy === 'very_low' ? 'skeptical' :
            education.healthLiteracy === 'low' ? (Math.random() > 0.5 ? 'neutral' : 'skeptical') :
                'trusting';

    // Economic status derived
    const economicStatus = occupation.income === 'none' || occupation.income === 'low' ? 'Prasejahtera' :
        occupation.income === 'medium' ? 'Menengah' :
            occupation.income === 'dependent' ? 'Tanggungan' : 'Sejahtera';

    // Age-appropriate lifestyle
    const isChild = ageGroup === 'toddler' || ageGroup === 'child' || ageGroup === 'teen';
    const smokingStatus = randomChoice(isChild ? LIFESTYLE_FACTORS.smoking_child : LIFESTYLE_FACTORS.smoking);
    const alcoholUse = randomChoice(isChild ? LIFESTYLE_FACTORS.alcohol_child : LIFESTYLE_FACTORS.alcohol);

    return {
        occupation: occupation.name,
        occupationalRisks: occupation.risk,
        education: education.level,
        healthLiteracy: education.healthLiteracy,
        housing: housing.type,
        sanitation: housing.sanitation,
        ventilation: housing.ventilation,
        familyStructure: randomChoice(FAMILY_STRUCTURES),
        distance: distance.desc,
        accessBarrier: distance.accessBarrier,
        hasBPJS: hasBPJS,
        bpjsClass: bpjsClass,
        smokingStatus: smokingStatus,
        alcoholUse: alcoholUse,
        exerciseLevel: randomChoice(LIFESTYLE_FACTORS.exercise),
        dietPattern: randomChoice(LIFESTYLE_FACTORS.diet),
        healthBelief: belief.belief,
        trustLevel: trustLevel,
        economicStatus: economicStatus,
        riskFactorsSummary: [
            ...occupation.risk,
            housing.sanitation === 'poor' ? 'Sanitasi buruk' : null,
            distance.accessBarrier === 'high' ? 'Akses ke faskes terbatas' : null,
        ].filter(Boolean)
    };
}
