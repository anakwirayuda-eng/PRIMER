/**
 * @reflection
 * [IDENTITY]: DentalDiagnosisEngine
 * [PURPOSE]: Tooth inspection, DMFT scoring, dental diagnosis logic, UKGS batch generation.
 * [STATE]: Experimental
 * [ANCHOR]: generateDentalExam
 * [DEPENDS_ON]: None (pure logic)
 * [LAST_UPDATE]: 2026-02-18
 */

// ═══════════════════════════════════════════════════════════════
// TOOTH MAP CONSTANTS
// ═══════════════════════════════════════════════════════════════

/**
 * FDI notation (Fédération Dentaire Internationale)
 * Quadrant 1 = upper right, 2 = upper left, 3 = lower left, 4 = lower right
 * Permanent: 11-18, 21-28, 31-38, 41-48
 * Deciduous: 51-55, 61-65, 71-75, 81-85
 */
const PERMANENT_TEETH = [
    18, 17, 16, 15, 14, 13, 12, 11, // Upper right
    21, 22, 23, 24, 25, 26, 27, 28, // Upper left
    38, 37, 36, 35, 34, 33, 32, 31, // Lower left
    41, 42, 43, 44, 45, 46, 47, 48  // Lower right
];

const DECIDUOUS_TEETH = [
    55, 54, 53, 52, 51, // Upper right
    61, 62, 63, 64, 65, // Upper left
    75, 74, 73, 72, 71, // Lower left
    81, 82, 83, 84, 85  // Lower right
];

const TOOTH_NAMES = {
    // Permanent — representative names
    11: 'Insisivus sentral kanan atas', 12: 'Insisivus lateral kanan atas', 13: 'Kaninus kanan atas',
    14: 'Premolar 1 kanan atas', 15: 'Premolar 2 kanan atas', 16: 'Molar 1 kanan atas',
    17: 'Molar 2 kanan atas', 18: 'Molar 3 kanan atas (bungsu)',
    21: 'Insisivus sentral kiri atas', 26: 'Molar 1 kiri atas',
    36: 'Molar 1 kiri bawah', 46: 'Molar 1 kiri bawah',
};

/**
 * Tooth condition states
 */
const TOOTH_CONDITIONS = {
    sound: { code: 'S', label: 'Sehat', color: '#4ade80' },
    decayed: { code: 'D', label: 'Karies', color: '#ef4444' },
    missing: { code: 'M', label: 'Hilang', color: '#6b7280' },
    filled: { code: 'F', label: 'Tambalan', color: '#3b82f6' },
    root_remnant: { code: 'R', label: 'Sisa Akar', color: '#f97316' },
    calculus: { code: 'C', label: 'Karang Gigi', color: '#eab308' },
    abscess: { code: 'A', label: 'Abses', color: '#dc2626' },
};

/**
 * Dental diagnosis catalog
 */
const DENTAL_DIAGNOSES = {
    karies_email: { id: 'karies_email', name: 'Karies Email (D1)', icd10: 'K02.0', severity: 'ringan', treatment: 'art_filling', description: 'Bercak putih/coklat pada email, belum ada kavitas.' },
    karies_dentin: { id: 'karies_dentin', name: 'Karies Dentin (D2-D3)', icd10: 'K02.1', severity: 'sedang', treatment: 'filling', description: 'Kavitas mencapai dentin, bisa sensitif dingin/manis.' },
    karies_pulpa: { id: 'karies_pulpa', name: 'Karies Mencapai Pulpa (D4)', icd10: 'K04.0', severity: 'berat', treatment: 'extraction', description: 'Gigi berlubang dalam, nyeri spontan, perlu cabut/perawatan saraf.' },
    gingivitis: { id: 'gingivitis', name: 'Gingivitis', icd10: 'K05.1', severity: 'ringan', treatment: 'scaling', description: 'Gusi merah, bengkak, mudah berdarah saat sikat gigi.' },
    periodontitis: { id: 'periodontitis', name: 'Periodontitis Kronis', icd10: 'K05.3', severity: 'berat', treatment: 'scaling_rootplaning', description: 'Kerusakan jaringan penyangga gigi, gigi goyang.' },
    abscess_dental: { id: 'abscess_dental', name: 'Abses Periapikal', icd10: 'K04.7', severity: 'berat', treatment: 'extraction_antibiotik', description: 'Bengkak pipi/gusi, nyeri hebat, demam. Perlu insisi drainase.' },
    stomatitis: { id: 'stomatitis', name: 'Stomatitis Aftosa', icd10: 'K12.0', severity: 'ringan', treatment: 'topical', description: 'Sariawan kecil pada mukosa mulut, nyeri saat makan.' },
    calculus: { id: 'calculus', name: 'Kalkulus (Karang Gigi)', icd10: 'K03.6', severity: 'sedang', treatment: 'scaling', description: 'Deposit keras pada gigi, penyebab gingivitis dan bau mulut.' },
    impacted_wisdom: { id: 'impacted_wisdom', name: 'Gigi Bungsu Impaksi', icd10: 'K01.1', severity: 'sedang', treatment: 'extraction', description: 'Molar ke-3 tidak erupsi sempurna, sering infeksi (perikoronitis).' },
    pulpitis: { id: 'pulpitis', name: 'Pulpitis Irreversibel', icd10: 'K04.0', severity: 'berat', treatment: 'extraction', description: 'Nyeri spontan, berdenyut, terutama malam hari. Perlu cabut gigi.' },
};

export { TOOTH_CONDITIONS, DENTAL_DIAGNOSES, PERMANENT_TEETH, DECIDUOUS_TEETH };

// ═══════════════════════════════════════════════════════════════
// DENTAL EXAM GENERATION
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a complete dental examination for a patient
 * @param {Object} patient - { age, gender, hygiene? }
 * @returns {{ toothMap{}, findings[], diagnoses[], dmftScore, oralHygieneIndex }}
 */
export function generateDentalExam(patient) {
    const age = patient.age || 25;
    const isChild = age < 12;
    const teeth = isChild ? DECIDUOUS_TEETH : PERMANENT_TEETH;

    // Hygiene factor: poor → more problems
    const hygiene = patient.hygiene || (Math.random() < 0.3 ? 'poor' : Math.random() < 0.6 ? 'fair' : 'good');

    const hygieneMultiplier = { poor: 1.8, fair: 1.0, good: 0.4 };
    const problemRate = hygieneMultiplier[hygiene] || 1.0;

    const toothMap = {};
    const findings = [];
    let decayedCount = 0, missingCount = 0, filledCount = 0;

    for (const toothNum of teeth) {
        const roll = Math.random();
        const threshold = isChild ? 0.15 : 0.12;

        let condition;
        if (roll < threshold * problemRate) {
            // Decayed
            condition = 'decayed';
            decayedCount++;
            const severity = Math.random();
            const diagnosis = severity < 0.4 ? 'karies_email' : severity < 0.75 ? 'karies_dentin' : 'karies_pulpa';
            findings.push({ tooth: toothNum, condition, diagnosis, name: DENTAL_DIAGNOSES[diagnosis].name });
        } else if (roll < (threshold + 0.04) * problemRate && !isChild) {
            // Missing
            condition = 'missing';
            missingCount++;
            findings.push({ tooth: toothNum, condition, diagnosis: null, name: 'Gigi hilang' });
        } else if (roll < (threshold + 0.08) * problemRate) {
            // Filled
            condition = 'filled';
            filledCount++;
        } else if (roll < (threshold + 0.10) * problemRate && !isChild) {
            // Calculus
            condition = 'calculus';
            findings.push({ tooth: toothNum, condition, diagnosis: 'calculus', name: 'Karang gigi' });
        } else {
            condition = 'sound';
        }

        toothMap[toothNum] = {
            number: toothNum,
            condition,
            ...TOOTH_CONDITIONS[condition]
        };
    }

    // Add soft tissue findings
    if (Math.random() < 0.2 * problemRate) {
        findings.push({ tooth: null, condition: 'soft_tissue', diagnosis: 'gingivitis', name: 'Gingivitis' });
    }
    if (Math.random() < 0.08 * problemRate) {
        findings.push({ tooth: null, condition: 'soft_tissue', diagnosis: 'stomatitis', name: 'Stomatitis aftosa' });
    }

    // Derive diagnoses from findings
    const diagnoses = [...new Set(findings.filter(f => f.diagnosis).map(f => f.diagnosis))]
        .map(id => DENTAL_DIAGNOSES[id])
        .filter(Boolean);

    // DMFT score
    const dmftScore = getDMFTScore({ decayedCount, missingCount, filledCount, total: teeth.length });

    // OHI-S approximation
    const calculusTeeth = findings.filter(f => f.condition === 'calculus').length;
    const oralHygieneIndex = Math.min(3, Math.round((calculusTeeth / 6) * 3 * 10) / 10);

    return {
        toothMap,
        findings,
        diagnoses,
        dmftScore,
        oralHygieneIndex,
        hygiene,
        isChild,
        totalTeeth: teeth.length
    };
}

// ═══════════════════════════════════════════════════════════════
// DMFT SCORING
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate DMFT/dmft score
 * @param {Object} counts - { decayedCount, missingCount, filledCount, total? } OR toothMap{}
 * @returns {{ decayed, missing, filled, total, category, feedback }}
 */
export function getDMFTScore(counts) {
    let D, M, F;

    if (counts.decayedCount !== undefined) {
        D = counts.decayedCount;
        M = counts.missingCount;
        F = counts.filledCount;
    } else {
        // Count from toothMap
        const conditions = Object.values(counts);
        D = conditions.filter(t => t.condition === 'decayed').length;
        M = conditions.filter(t => t.condition === 'missing').length;
        F = conditions.filter(t => t.condition === 'filled').length;
    }

    const total = D + M + F;

    let category, feedback;
    if (total <= 2) { category = 'sangat_rendah'; feedback = '✅ Kesehatan gigi sangat baik (DMFT ≤ 2.6)'; }
    else if (total <= 4) { category = 'rendah'; feedback = '👍 Kesehatan gigi baik (DMFT 2.7-4.4)'; }
    else if (total <= 6) { category = 'sedang'; feedback = '⚠️ Kesehatan gigi perlu perhatian (DMFT 4.5-6.5)'; }
    else { category = 'tinggi'; feedback = '❌ Kesehatan gigi buruk (DMFT > 6.5)'; }

    return { decayed: D, missing: M, filled: F, total, category, feedback };
}

// ═══════════════════════════════════════════════════════════════
// DIAGNOSIS EVALUATION
// ═══════════════════════════════════════════════════════════════

/**
 * Evaluate player's diagnosis against actual condition
 * @param {string} playerDiagnosis - Diagnosis ID from DENTAL_DIAGNOSES
 * @param {Object} actualCondition - { tooth, condition, diagnosis }
 * @returns {{ correct, feedback, xp, correctDiagnosis }}
 */
export function evaluateDiagnosis(playerDiagnosis, actualCondition) {
    const actual = actualCondition.diagnosis;
    const actualDef = DENTAL_DIAGNOSES[actual];
    const playerDef = DENTAL_DIAGNOSES[playerDiagnosis];

    if (!playerDef) {
        return { correct: false, feedback: 'Diagnosis tidak dikenal', xp: 0, correctDiagnosis: actualDef?.name || actual };
    }

    if (playerDiagnosis === actual) {
        return { correct: true, feedback: `✅ Benar! ${actualDef.name}`, xp: 25, correctDiagnosis: actualDef.name };
    }

    // Partial credit for related diagnoses
    const relatedMap = {
        karies_email: ['karies_dentin'],
        karies_dentin: ['karies_email', 'karies_pulpa'],
        karies_pulpa: ['karies_dentin', 'pulpitis'],
        gingivitis: ['periodontitis', 'calculus'],
        periodontitis: ['gingivitis'],
        pulpitis: ['karies_pulpa', 'abscess_dental'],
    };

    if (relatedMap[actual]?.includes(playerDiagnosis)) {
        return {
            correct: false,
            feedback: `⚠️ Hampir benar. Jawaban: ${actualDef.name}. "${playerDef.name}" berdekatan tapi kurang tepat.`,
            xp: 10,
            correctDiagnosis: actualDef.name
        };
    }

    return {
        correct: false,
        feedback: `❌ Salah. Jawaban: ${actualDef.name}. ${actualDef.description}`,
        xp: 0,
        correctDiagnosis: actualDef.name
    };
}

// ═══════════════════════════════════════════════════════════════
// UKGS (Usaha Kesehatan Gigi Sekolah)
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a UKGS screening batch for a school visit
 * @param {Object[]} schoolChildren - Array of child villagers
 * @returns {{ batch[], summary }}
 */
export function generateUKGSBatch(schoolChildren = []) {
    const batch = [];

    // Generate 5-15 children for screening
    const count = Math.min(schoolChildren.length || 10, 15);
    const children = schoolChildren.length > 0
        ? schoolChildren.slice(0, count)
        : Array.from({ length: count }, (_, i) => ({
            id: `ukgs_child_${i}`,
            name: `Anak ${i + 1}`,
            age: 6 + Math.floor(Math.random() * 6), // 6-12 years
            gender: Math.random() < 0.5 ? 'L' : 'P'
        }));

    let totalDMFT = 0;
    let needReferral = 0;

    for (const child of children) {
        const exam = generateDentalExam({ ...child, hygiene: Math.random() < 0.4 ? 'poor' : 'fair' });
        totalDMFT += exam.dmftScore.total;
        const needsRef = exam.diagnoses.some(d => d.severity === 'berat');
        if (needsRef) needReferral++;

        batch.push({
            child: { id: child.id, name: child.name, age: child.age, gender: child.gender },
            dmft: exam.dmftScore,
            findings: exam.findings.length,
            diagnoses: exam.diagnoses.map(d => d.name),
            needsReferral: needsRef,
            ohi: exam.oralHygieneIndex
        });
    }

    const avgDMFT = Math.round((totalDMFT / count) * 10) / 10;

    return {
        batch,
        summary: {
            totalScreened: count,
            averageDMFT: avgDMFT,
            needsReferral: needReferral,
            dmftCategory: avgDMFT <= 2.6 ? 'rendah' : avgDMFT <= 4.4 ? 'sedang' : 'tinggi',
            feedback: `Pemeriksaan ${count} anak: rata-rata DMFT ${avgDMFT}. ${needReferral} anak perlu rujukan.`
        }
    };
}
