/**
 * @reflection
 * [IDENTITY]: GrowthChartEngine
 * [PURPOSE]: KMS digital — WHO z-score calculation, growth faltering detection, nutritional status classification.
 * [STATE]: Experimental
 * [ANCHOR]: plotGrowthPoint
 * [DEPENDS_ON]: None (pure logic, WHO reference hardcoded)
 * [LAST_UPDATE]: 2026-02-18
 */

// ═══════════════════════════════════════════════════════════════
// SIMPLIFIED WHO REFERENCE DATA (LMS method approximation)
// Age in months → { median, sd } for Weight-for-Age (WFA)
// Source: WHO Child Growth Standards (simplified)
// ═══════════════════════════════════════════════════════════════

const WHO_WFA_BOYS = {
    0: { median: 3.3, sd: 0.5 }, 1: { median: 4.5, sd: 0.6 }, 2: { median: 5.6, sd: 0.7 },
    3: { median: 6.4, sd: 0.8 }, 4: { median: 7.0, sd: 0.8 }, 5: { median: 7.5, sd: 0.9 },
    6: { median: 7.9, sd: 0.9 }, 7: { median: 8.3, sd: 0.9 }, 8: { median: 8.6, sd: 1.0 },
    9: { median: 8.9, sd: 1.0 }, 10: { median: 9.2, sd: 1.0 }, 11: { median: 9.4, sd: 1.0 },
    12: { median: 9.6, sd: 1.1 }, 15: { median: 10.3, sd: 1.1 }, 18: { median: 10.9, sd: 1.2 },
    21: { median: 11.5, sd: 1.2 }, 24: { median: 12.2, sd: 1.3 }, 30: { median: 13.3, sd: 1.4 },
    36: { median: 14.3, sd: 1.5 }, 42: { median: 15.3, sd: 1.7 }, 48: { median: 16.3, sd: 1.8 },
    54: { median: 17.3, sd: 2.0 }, 60: { median: 18.3, sd: 2.2 }
};

const WHO_WFA_GIRLS = {
    0: { median: 3.2, sd: 0.4 }, 1: { median: 4.2, sd: 0.5 }, 2: { median: 5.1, sd: 0.6 },
    3: { median: 5.8, sd: 0.7 }, 4: { median: 6.4, sd: 0.7 }, 5: { median: 6.9, sd: 0.8 },
    6: { median: 7.3, sd: 0.8 }, 7: { median: 7.6, sd: 0.9 }, 8: { median: 7.9, sd: 0.9 },
    9: { median: 8.2, sd: 0.9 }, 10: { median: 8.5, sd: 1.0 }, 11: { median: 8.7, sd: 1.0 },
    12: { median: 8.9, sd: 1.0 }, 15: { median: 9.6, sd: 1.1 }, 18: { median: 10.2, sd: 1.1 },
    21: { median: 10.9, sd: 1.2 }, 24: { median: 11.5, sd: 1.3 }, 30: { median: 12.7, sd: 1.4 },
    36: { median: 13.9, sd: 1.5 }, 42: { median: 15.0, sd: 1.7 }, 48: { median: 16.1, sd: 1.9 },
    54: { median: 17.2, sd: 2.0 }, 60: { median: 18.2, sd: 2.2 }
};

// Height-for-Age (HFA)
const WHO_HFA_BOYS = {
    0: { median: 49.9, sd: 1.9 }, 3: { median: 61.4, sd: 2.3 }, 6: { median: 67.6, sd: 2.5 },
    9: { median: 72.0, sd: 2.6 }, 12: { median: 75.7, sd: 2.7 }, 18: { median: 82.3, sd: 2.9 },
    24: { median: 87.8, sd: 3.1 }, 36: { median: 96.1, sd: 3.6 }, 48: { median: 103.3, sd: 4.0 },
    60: { median: 110.0, sd: 4.5 }
};

const WHO_HFA_GIRLS = {
    0: { median: 49.1, sd: 1.9 }, 3: { median: 59.8, sd: 2.2 }, 6: { median: 65.7, sd: 2.4 },
    9: { median: 70.1, sd: 2.6 }, 12: { median: 74.0, sd: 2.7 }, 18: { median: 80.7, sd: 2.9 },
    24: { median: 86.4, sd: 3.1 }, 36: { median: 95.1, sd: 3.6 }, 48: { median: 102.7, sd: 4.0 },
    60: { median: 109.4, sd: 4.5 }
};

// ═══════════════════════════════════════════════════════════════
// Z-SCORE CALCULATION
// ═══════════════════════════════════════════════════════════════

/**
 * Get the closest reference value by interpolation
 */
function getReference(table, ageMonths) {
    const ages = Object.keys(table).map(Number).sort((a, b) => a - b);

    // Exact match
    if (table[ageMonths]) return table[ageMonths];

    // Find bracketing ages
    let lower = ages[0], upper = ages[ages.length - 1];
    for (let i = 0; i < ages.length - 1; i++) {
        if (ages[i] <= ageMonths && ages[i + 1] >= ageMonths) {
            lower = ages[i];
            upper = ages[i + 1];
            break;
        }
    }

    // Linear interpolation
    const lRef = table[lower];
    const uRef = table[upper];
    if (lower === upper) return lRef;

    const ratio = (ageMonths - lower) / (upper - lower);
    return {
        median: lRef.median + ratio * (uRef.median - lRef.median),
        sd: lRef.sd + ratio * (uRef.sd - lRef.sd)
    };
}

/**
 * Calculate z-score
 */
function calculateZScore(value, median, sd) {
    if (sd <= 0) return 0;
    return Math.round(((value - median) / sd) * 100) / 100;
}

// ═══════════════════════════════════════════════════════════════
// CORE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Plot a single growth point on the KMS
 * @param {Object} baby - { ageMonths, gender }
 * @param {Object} measurement - { weight, height }
 * @returns {{ weightForAge: { zScore, status }, heightForAge: { zScore, status }, category }}
 */
export function plotGrowthPoint(baby, measurement) {
    const gender = baby.gender || 'L';
    const age = baby.ageMonths || 0;

    // Weight-for-Age
    const wfaRef = getReference(gender === 'L' ? WHO_WFA_BOYS : WHO_WFA_GIRLS, age);
    const wfaZ = calculateZScore(measurement.weight || 0, wfaRef.median, wfaRef.sd);

    // Height-for-Age
    const hfaRef = getReference(gender === 'L' ? WHO_HFA_BOYS : WHO_HFA_GIRLS, age);
    const hfaZ = measurement.height ? calculateZScore(measurement.height, hfaRef.median, hfaRef.sd) : null;

    return {
        weightForAge: { zScore: wfaZ, status: classifyWFA(wfaZ), median: wfaRef.median, sd: wfaRef.sd },
        heightForAge: hfaZ !== null ? { zScore: hfaZ, status: classifyHFA(hfaZ), median: hfaRef.median, sd: hfaRef.sd } : null,
        category: calculateNutritionStatus(wfaZ, hfaZ)
    };
}

/**
 * Classify nutritional status
 * @param {number} wfaZ - Weight-for-Age z-score
 * @param {number|null} hfaZ - Height-for-Age z-score
 * @param {number|null} wfhZ - Weight-for-Height z-score (optional)
 * @returns {string} - Status enum: 'gizi_lebih' | 'gizi_baik' | 'gizi_kurang' | 'gizi_buruk'
 */
export function calculateNutritionStatus(wfaZ, hfaZ = null, _wfhZ = null) {
    // Primary classification based on BB/U (Weight-for-Age)
    if (wfaZ < -3) return 'gizi_buruk';
    if (wfaZ < -2) return 'gizi_kurang';
    if (wfaZ > 2) return 'gizi_lebih';

    // Consider stunting if HFA available
    if (hfaZ !== null && hfaZ < -2) return 'stunting';

    return 'gizi_baik';
}

/**
 * Detect growth faltering (T = tidak naik)
 * @param {Object[]} history - Array of { ageMonths, weight, height } sorted by age
 * @returns {{ isFlat, isFalling, consecutiveFlatMonths, alert, recommendation }}
 */
export function detectGrowthFaltering(history) {
    if (!history || history.length < 2) {
        return { isFlat: false, isFalling: false, consecutiveFlatMonths: 0, alert: null, recommendation: null };
    }

    let consecutiveFlat = 0;
    let isFalling = false;

    for (let i = 1; i < history.length; i++) {
        const curr = history[i];
        const prev = history[i - 1];
        const weightDiff = (curr.weight || 0) - (prev.weight || 0);

        if (weightDiff <= 0) {  // Not gaining or losing
            consecutiveFlat++;
            if (weightDiff < -0.2) isFalling = true;
        } else {
            consecutiveFlat = 0;
        }
    }

    const isFlat = consecutiveFlat >= 2;

    let alert = null;
    let recommendation = null;

    if (isFalling) {
        alert = '🔴 BERAT BADAN TURUN — Kemungkinan gizi buruk atau penyakit kronis';
        recommendation = 'Rujuk ke Puskesmas. Cek penyakit dasar, evaluasi asupan gizi, pantau ketat setiap 2 minggu.';
    } else if (isFlat) {
        alert = '🟡 BERAT BADAN TIDAK NAIK (T) — Pertumbuhan faltering terdeteksi';
        recommendation = 'Konseling gizi dengan ibu. Tambah MP-ASI kaya protein. Kontrol ulang 2 minggu.';
    }

    return { isFlat, isFalling, consecutiveFlatMonths: consecutiveFlat, alert, recommendation };
}

/**
 * Generate KMS data for chart rendering
 * @param {Object} baby - { ageMonths, gender, growthHistory[] }
 * @returns {{ referenceLines: { median[], plus2[], minus2[], minus3[] }, actualPoints[] }}
 */
export function generateKMSData(baby) {
    const gender = baby.gender || 'L';
    const wfaTable = gender === 'L' ? WHO_WFA_BOYS : WHO_WFA_GIRLS;
    const ages = Object.keys(wfaTable).map(Number).sort((a, b) => a - b);

    // Reference lines
    const median = [];
    const plus2 = [];
    const minus2 = [];
    const minus3 = [];

    for (const age of ages) {
        const ref = wfaTable[age];
        median.push({ age, weight: Math.round(ref.median * 10) / 10 });
        plus2.push({ age, weight: Math.round((ref.median + 2 * ref.sd) * 10) / 10 });
        minus2.push({ age, weight: Math.round((ref.median - 2 * ref.sd) * 10) / 10 });
        minus3.push({ age, weight: Math.round((ref.median - 3 * ref.sd) * 10) / 10 });
    }

    // Actual measurement points
    const actualPoints = (baby.growthHistory || []).map(h => ({
        age: h.ageMonths,
        weight: h.weight,
        status: plotGrowthPoint({ ...baby, ageMonths: h.ageMonths }, h).category
    }));

    return {
        referenceLines: { median, plus2, minus2, minus3 },
        actualPoints,
        labels: {
            plus2: 'Gizi Lebih (+2 SD)',
            median: 'Median',
            minus2: 'Gizi Kurang (-2 SD)',
            minus3: 'Gizi Buruk (-3 SD)'
        }
    };
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function classifyWFA(z) {
    if (z < -3) return 'Gizi Buruk (BB sangat kurang)';
    if (z < -2) return 'Gizi Kurang (BB kurang)';
    if (z > 2) return 'Gizi Lebih (BB berlebih)';
    return 'Gizi Baik (BB normal)';
}

function classifyHFA(z) {
    if (z < -3) return 'Sangat Pendek (Severe Stunting)';
    if (z < -2) return 'Pendek (Stunting)';
    return 'Normal';
}
