/**
 * @reflection
 * [IDENTITY]: LabEngine
 * [PURPOSE]: Pure logic for lab interpretation — order processing, result generation, interpretation quiz, mastery tracking.
 * [STATE]: Experimental
 * [ANCHOR]: processLabOrder
 * [DEPENDS_ON]: MedicationDatabase (for lab reagent costs)
 * [LAST_UPDATE]: 2026-02-18
 */

import { getMedicationById } from '../data/MedicationDatabase.js';
import { pickDeterministic, seedKey, seededBetween, shuffleDeterministic } from '../utils/deterministicRandom.js';

// ═══════════════════════════════════════════════════════════════
// LAB REFERENCE RANGES (Puskesmas-level capabilities)
// ═══════════════════════════════════════════════════════════════

const LAB_CATALOG = {
    darah_lengkap: {
        id: 'darah_lengkap', name: 'Darah Lengkap (DL)', cost: 25000, processingTime: 30,
        reagentId: 'reagen_hematologi',
        parameters: {
            hb: { name: 'Hemoglobin', unit: 'g/dL', normalM: [13.5, 17.5], normalF: [12.0, 16.0], normalChild: [11.0, 14.5] },
            ht: { name: 'Hematokrit', unit: '%', normalM: [40, 54], normalF: [36, 48], normalChild: [33, 42] },
            leukosit: { name: 'Leukosit', unit: '/µL', normal: [4000, 11000], normalChild: [5000, 15000] },
            trombosit: { name: 'Trombosit', unit: '/µL', normal: [150000, 400000] },
            eritrosit: { name: 'Eritrosit', unit: 'juta/µL', normalM: [4.5, 6.5], normalF: [3.8, 5.5] },
            led: { name: 'LED', unit: 'mm/jam', normalM: [0, 10], normalF: [0, 20] }
        }
    },
    gds: {
        id: 'gds', name: 'Gula Darah Sewaktu', cost: 10000, processingTime: 5,
        reagentId: 'reagen_gds',
        parameters: {
            gds: { name: 'GDS', unit: 'mg/dL', normal: [70, 200] }
        }
    },
    gdp: {
        id: 'gdp', name: 'Gula Darah Puasa', cost: 10000, processingTime: 5,
        reagentId: 'reagen_gds',
        parameters: {
            gdp: { name: 'GDP', unit: 'mg/dL', normal: [70, 100] }
        }
    },
    gd2pp: {
        id: 'gd2pp', name: 'GD 2 Jam PP', cost: 10000, processingTime: 5,
        reagentId: 'reagen_gds',
        parameters: {
            gd2pp: { name: 'GD2PP', unit: 'mg/dL', normal: [70, 140] }
        }
    },
    urinalisis: {
        id: 'urinalisis', name: 'Urinalisis', cost: 15000, processingTime: 15,
        reagentId: 'reagen_urinalisis',
        parameters: {
            protein: { name: 'Protein Urin', unit: '', normal: ['negatif'] },
            glukosa: { name: 'Glukosa Urin', unit: '', normal: ['negatif'] },
            leukosit_urin: { name: 'Leukosit Urin', unit: '/LPB', normal: [0, 5] },
            eritrosit_urin: { name: 'Eritrosit Urin', unit: '/LPB', normal: [0, 2] },
            nitrit: { name: 'Nitrit', unit: '', normal: ['negatif'] }
        }
    },
    bta: {
        id: 'bta', name: 'BTA (Sputum)', cost: 15000, processingTime: 60,
        reagentId: 'reagen_bta',
        parameters: {
            bta: { name: 'BTA', unit: '', normal: ['negatif'] }
        }
    },
    widal: {
        id: 'widal', name: 'Tes Widal', cost: 20000, processingTime: 30,
        reagentId: 'reagen_widal',
        parameters: {
            s_typhi_o: { name: 'S. typhi O', unit: 'titer', normal: ['< 1/80'] },
            s_typhi_h: { name: 'S. typhi H', unit: 'titer', normal: ['< 1/80'] }
        }
    },
    rapid_hiv: {
        id: 'rapid_hiv', name: 'Rapid Test HIV', cost: 25000, processingTime: 15,
        reagentId: 'rapid_test_hiv',
        parameters: {
            hiv: { name: 'Anti-HIV', unit: '', normal: ['non-reaktif'] }
        }
    },
    rapid_hbsag: {
        id: 'rapid_hbsag', name: 'Rapid Test HBsAg', cost: 25000, processingTime: 15,
        reagentId: 'rapid_test_hbsag',
        parameters: {
            hbsag: { name: 'HBsAg', unit: '', normal: ['non-reaktif'] }
        }
    },
    rapid_sifilis: {
        id: 'rapid_sifilis', name: 'Rapid Test Sifilis', cost: 20000, processingTime: 15,
        reagentId: 'rapid_test_sifilis',
        parameters: {
            sifilis: { name: 'Anti-TP', unit: '', normal: ['non-reaktif'] }
        }
    },
    asam_urat: {
        id: 'asam_urat', name: 'Asam Urat', cost: 15000, processingTime: 15,
        reagentId: 'reagen_asam_urat',
        parameters: {
            asam_urat: { name: 'Asam Urat', unit: 'mg/dL', normalM: [3.5, 7.0], normalF: [2.5, 6.0] }
        }
    },
    kolesterol_total: {
        id: 'kolesterol_total', name: 'Kolesterol Total', cost: 20000, processingTime: 15,
        reagentId: 'reagen_kolesterol',
        parameters: {
            kolesterol: { name: 'Kolesterol Total', unit: 'mg/dL', normal: [0, 200] }
        }
    },
    golongan_darah: {
        id: 'golongan_darah', name: 'Golongan Darah + Rhesus', cost: 15000, processingTime: 10,
        reagentId: 'reagen_goldar',
        parameters: {
            goldar: { name: 'Golongan Darah', unit: '', normal: ['A', 'B', 'AB', 'O'] },
            rhesus: { name: 'Rhesus', unit: '', normal: ['positif'] }
        }
    },
    hba1c: {
        id: 'hba1c', name: 'HbA1c', cost: 50000, processingTime: 30,
        reagentId: 'reagen_hba1c',
        parameters: {
            hba1c: { name: 'HbA1c', unit: '%', normal: [4.0, 5.6] }
        }
    },
    protein_urin: {
        id: 'protein_urin', name: 'Protein Urin (Dipstick)', cost: 5000, processingTime: 5,
        reagentId: 'reagen_urinalisis',
        parameters: {
            protein: { name: 'Protein Urin', unit: '', normal: ['negatif'] }
        }
    }
};

export { LAB_CATALOG };

// ═══════════════════════════════════════════════════════════════
// LAB ORDER PROCESSING
// ═══════════════════════════════════════════════════════════════

/**
 * Process a lab order — check reagent availability, calculate cost and processing time
 * @param {string[]} orderedLabs - Array of lab IDs from LAB_CATALOG
 * @param {Object} patient - Patient object with medicalData
 * @param {Object} inventory - { [reagentId]: { stock } }
 * @returns {{ results{}, processingTime, totalCost, reagentUsage[], unavailable[] }}
 */
export function processLabOrder(orderedLabs, patient, inventory = {}) {
    const results = {};
    let maxProcessingTime = 0;
    let totalCost = 0;
    const reagentUsage = [];
    const unavailable = [];
    const orderSeed = seedKey(
        'lab-order',
        orderedLabs,
        patient?.id || patient?.name,
        patient?.hidden?.diseaseId,
        patient?.age,
        patient?.gender
    );

    for (const labId of orderedLabs) {
        const labDef = LAB_CATALOG[labId];
        if (!labDef) {
            unavailable.push({ id: labId, reason: 'Pemeriksaan tidak tersedia di Puskesmas' });
            continue;
        }

        // Check reagent availability
        const reagentStock = inventory[labDef.reagentId];
        if (reagentStock && reagentStock.stock <= 0) {
            unavailable.push({ id: labId, name: labDef.name, reason: 'Reagen habis' });
            continue;
        }

        // Generate results based on patient case
        results[labId] = generateLabResults(labDef, patient, seedKey(orderSeed, labId));
        maxProcessingTime = Math.max(maxProcessingTime, labDef.processingTime);
        totalCost += labDef.cost;
        reagentUsage.push({ reagentId: labDef.reagentId, labName: labDef.name });
    }

    return { results, processingTime: maxProcessingTime, totalCost, reagentUsage, unavailable };
}

/**
 * Generate lab results based on patient's disease
 * @param {Object} labDef - Lab definition from LAB_CATALOG
 * @param {Object} patient - Patient with hidden.diseaseId
 * @returns {{ labName, parameters: { [key]: { name, value, unit, status, normal } } }}
 */
function generateLabResults(labDef, patient, seedHint = 'default') {
    const diseaseId = patient?.hidden?.diseaseId || '';
    const age = patient?.age || 30;
    const gender = patient?.gender || 'L';
    const paramResults = {};

    for (const [key, paramDef] of Object.entries(labDef.parameters)) {
        let value;
        let normalRange;

        // Determine normal range based on age/gender
        if (paramDef.normalM && gender === 'L') normalRange = paramDef.normalM;
        else if (paramDef.normalF && gender === 'P') normalRange = paramDef.normalF;
        else if (paramDef.normalChild && age < 12) normalRange = paramDef.normalChild;
        else normalRange = paramDef.normal;

        // Qualitative params (e.g., BTA, protein urin)
        if (Array.isArray(normalRange) && typeof normalRange[0] === 'string') {
            value = generateQualitativeResult(key, diseaseId, normalRange, seedKey(seedHint, key));
        } else {
            // Quantitative params
            value = generateQuantitativeResult(key, diseaseId, normalRange, gender, age, seedKey(seedHint, key));
        }

        // Determine status
        let status;
        if (Array.isArray(normalRange) && typeof normalRange[0] === 'string') {
            status = normalRange.includes(value) ? 'normal' : 'abnormal';
        } else {
            status = value < normalRange[0] ? 'low' : value > normalRange[1] ? 'high' : 'normal';
        }

        paramResults[key] = {
            name: paramDef.name,
            value,
            unit: paramDef.unit,
            status,
            normalRange: Array.isArray(normalRange) ? normalRange.join(' - ') : String(normalRange)
        };
    }

    return { labName: labDef.name, parameters: paramResults };
}

/**
 * Generate a quantitative lab value based on disease context
 */
function generateQuantitativeResult(param, diseaseId, normalRange, gender, age, seedHint = 'default') {
    const [low, high] = normalRange;
    const mid = (low + high) / 2;
    const spread = (high - low) / 2;
    const rangeSeed = seedKey('lab-quantitative', seedHint, param, diseaseId, gender, age);

    // Disease-specific abnormal values
    const abnormalMap = {
        hb: {
            'anemia_deficiency': () => low * randomRange(0.55, 0.85, seedKey(rangeSeed, 'hb-anemia')), // Low Hb
            'dengue_fever': () => randomRange(low, high, seedKey(rangeSeed, 'hb-dengue')), // Usually normal in dengue
            'polycythemia': () => high * randomRange(1.1, 1.3, seedKey(rangeSeed, 'hb-polycythemia')),
        },
        leukosit: {
            'pneumonia_community': () => randomRange(12000, 20000, seedKey(rangeSeed, 'leukosit-pneumonia')), // Leukocytosis
            'typhoid_fever': () => randomRange(2500, 4500, seedKey(rangeSeed, 'leukosit-typhoid')), // Leukopenia
            'dengue_fever': () => randomRange(2000, 4000, seedKey(rangeSeed, 'leukosit-dengue')),
            'tb_pulmonary': () => randomRange(8000, 15000, seedKey(rangeSeed, 'leukosit-tb')),
        },
        trombosit: {
            'dengue_fever': () => randomRange(30000, 90000, seedKey(rangeSeed, 'trombosit-dengue')), // Thrombocytopenia
            'dengue_df': () => randomRange(20000, 80000, seedKey(rangeSeed, 'trombosit-df')),
        },
        gds: {
            'dm_type2': () => randomRange(200, 400, seedKey(rangeSeed, 'gds-dm')),
            'dm_complicated': () => randomRange(250, 500, seedKey(rangeSeed, 'gds-complicated')),
            'hypoglycemia_severe': () => randomRange(30, 55, seedKey(rangeSeed, 'gds-hypo')),
        },
        gdp: {
            'dm_type2': () => randomRange(126, 250, seedKey(rangeSeed, 'gdp-dm')),
        },
        asam_urat: {
            'gout_arthritis': () => randomRange(8, 12, seedKey(rangeSeed, 'asam-urat-gout')),
        },
        kolesterol: {
            'obesity': () => randomRange(220, 300, seedKey(rangeSeed, 'kolesterol-obesity')),
            'dm_type2': () => randomRange(200, 280, seedKey(rangeSeed, 'kolesterol-dm')),
        },
        hba1c: {
            'dm_type2': () => randomRange(7.0, 12.0, seedKey(rangeSeed, 'hba1c-dm')),
            'dm_complicated': () => randomRange(9.0, 14.0, seedKey(rangeSeed, 'hba1c-complicated')),
        },
        led: {
            'tb_pulmonary': () => randomRange(30, 80, seedKey(rangeSeed, 'led-tb')),
            'pneumonia_community': () => randomRange(25, 60, seedKey(rangeSeed, 'led-pneumonia')),
        }
    };

    // Check for disease-specific override
    const paramOverrides = abnormalMap[param];
    if (paramOverrides && paramOverrides[diseaseId]) {
        return Math.round(paramOverrides[diseaseId]() * 10) / 10;
    }

    // Default: normal value with slight random variation
    const value = mid + (seededBetween(seedKey(rangeSeed, 'default'), -0.5, 0.5) * spread * 1.2);
    return Math.round(Math.max(0, value) * 10) / 10;
}

/**
 * Generate a qualitative lab result based on disease context
 */
function generateQualitativeResult(param, diseaseId, normalValues, seedHint = 'default') {
    const abnormalMap = {
        bta: { 'tb_pulmonary': '+1 (Scanty)' },
        protein: {
            'preeclampsia': '+2',
            'ckd_stage3': '+1',
            'nephrotic_syndrome': '+3',
            'normal_pregnancy': 'negatif'
        },
        nitrit: { 'uti_female': 'positif' },
        hiv: { 'hiv_asymptomatic': 'reaktif' },
        hbsag: { 'hepatitis_b': 'reaktif' },
        sifilis: { 'sifilis_stadium_1': 'reaktif', 'sifilis_laten': 'reaktif' },
        s_typhi_o: { 'typhoid_fever': '1/320' },
        s_typhi_h: { 'typhoid_fever': '1/160' },
        goldar: {},
        rhesus: {}
    };

    if (abnormalMap[param] && abnormalMap[param][diseaseId]) {
        return abnormalMap[param][diseaseId];
    }

    // Default: normal
    if (param === 'goldar') {
        const groups = ['A', 'B', 'AB', 'O'];
        return pickDeterministic(groups, seedKey('goldar', seedHint));
    }
    return normalValues[0] || 'normal';
}

// ═══════════════════════════════════════════════════════════════
// LAB INTERPRETATION QUIZ
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a lab interpretation case for quiz mode
 * @param {Object} caseData - Patient case object
 * @param {number} difficulty - 1-3
 * @returns {{ labResults, question, choices[], correctAnswer, explanation }}
 */
export function generateLabCase(caseData, difficulty = 1) {
    if (!caseData) return null;

    // Pick relevant labs based on disease
    const labMapping = {
        'dm_type2': ['gds', 'gdp', 'hba1c'],
        'anemia_deficiency': ['darah_lengkap'],
        'dengue_fever': ['darah_lengkap'],
        'typhoid_fever': ['darah_lengkap', 'widal'],
        'tb_pulmonary': ['bta', 'darah_lengkap'],
        'uti_female': ['urinalisis'],
        'gout_arthritis': ['asam_urat', 'darah_lengkap'],
        'normal_pregnancy': ['darah_lengkap', 'golongan_darah', 'protein_urin', 'gds'],
        'preeclampsia': ['darah_lengkap', 'urinalisis', 'protein_urin'],
    };

    const diseaseId = caseData.id || caseData.hidden?.diseaseId || '';
    const relevantLabs = labMapping[diseaseId] || ['darah_lengkap', 'gds'];
    const labsToUse = relevantLabs.slice(0, difficulty + 1);

    // Process labs
    const { results } = processLabOrder(labsToUse, {
        hidden: { diseaseId },
        age: caseData.age || 30,
        gender: caseData.gender || 'L',
        id: caseData.id || caseData.name || diseaseId
    });

    // Generate question and choices
    const question = `Pasien ${caseData.diagnosis || diseaseId}, dengan hasil lab berikut. Apa interpretasi yang paling tepat?`;

    const correctAnswer = getInterpretation(diseaseId, results);
    const distractors = generateDistractors(diseaseId, difficulty, seedKey('lab-case', caseData.id || caseData.name, difficulty));
    const choices = shuffleDeterministic([correctAnswer, ...distractors], seedKey('lab-case-choices', caseData.id || caseData.name, difficulty));

    return {
        labResults: results,
        question,
        choices,
        correctAnswer,
        explanation: getExplanation(diseaseId, results)
    };
}

/**
 * Interpret a single lab result
 * @param {string} labType - Lab ID from LAB_CATALOG
 * @param {*} value - Lab result value
 * @param {Object} patientContext - { age, gender, diseaseId }
 * @returns {{ interpretation, severity, action }}
 */
export function interpretResult(labType, value, patientContext = {}) {
    const labDef = LAB_CATALOG[labType];
    if (!labDef) return { interpretation: 'Pemeriksaan tidak dikenal', severity: 'unknown', action: 'Konsultasi' };

    // Find the specific parameter
    const params = Object.values(labDef.parameters);
    if (params.length === 0) return { interpretation: 'Tidak ada parameter', severity: 'unknown', action: '-' };

    const param = params[0]; // Take first parameter for simple interpretation
    let normalRange;
    if (param.normalM && patientContext.gender === 'L') normalRange = param.normalM;
    else if (param.normalF && patientContext.gender === 'P') normalRange = param.normalF;
    else normalRange = param.normal;

    // Qualitative
    if (Array.isArray(normalRange) && typeof normalRange[0] === 'string') {
        const isNormal = normalRange.includes(String(value));
        return {
            interpretation: isNormal ? 'Dalam batas normal' : `Abnormal: ${value}`,
            severity: isNormal ? 'normal' : 'abnormal',
            action: isNormal ? 'Tidak diperlukan tindakan' : 'Evaluasi lebih lanjut'
        };
    }

    // Quantitative
    const [low, high] = normalRange;
    if (value < low) {
        const severity = value < low * 0.7 ? 'critical' : 'low';
        return {
            interpretation: `${param.name} rendah (${value} ${param.unit})`,
            severity,
            action: severity === 'critical' ? 'Tindakan segera diperlukan' : 'Monitor dan evaluasi'
        };
    }
    if (value > high) {
        const severity = value > high * 1.5 ? 'critical' : 'high';
        return {
            interpretation: `${param.name} tinggi (${value} ${param.unit})`,
            severity,
            action: severity === 'critical' ? 'Tindakan segera diperlukan' : 'Monitor dan evaluasi'
        };
    }

    return {
        interpretation: `${param.name} normal (${value} ${param.unit})`,
        severity: 'normal',
        action: 'Tidak diperlukan tindakan'
    };
}

// ═══════════════════════════════════════════════════════════════
// MASTERY TRACKING
// ═══════════════════════════════════════════════════════════════

/**
 * Score lab interpretation mastery
 * @param {Object[]} history - Array of { labType, correct, timeMs }
 * @returns {{ accuracy, streak, masteryLevel, badge }}
 */
export function scoreMastery(history) {
    if (!history || history.length === 0) {
        return { accuracy: 0, streak: 0, masteryLevel: 'Pemula', badge: '🔬' };
    }

    const correct = history.filter(h => h.correct).length;
    const accuracy = Math.round((correct / history.length) * 100);

    // Calculate current streak
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
        if (history[i].correct) streak++;
        else break;
    }

    let masteryLevel, badge;
    if (accuracy >= 90 && history.length >= 20) { masteryLevel = 'Expert Analis'; badge = '🏆'; }
    else if (accuracy >= 75 && history.length >= 10) { masteryLevel = 'Analis Terampil'; badge = '⭐'; }
    else if (accuracy >= 60) { masteryLevel = 'Analis Pemula'; badge = '📊'; }
    else { masteryLevel = 'Belajar'; badge = '🔬'; }

    return { accuracy, streak, masteryLevel, badge, totalAnswered: history.length, totalCorrect: correct };
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function randomRange(min, max, seed = 'lab-range') {
    return seededBetween(seed, min, max);
}

function getInterpretation(diseaseId, _results) {
    const map = {
        'dm_type2': 'GDS tinggi (>200 mg/dL) — menunjukkan diabetes mellitus tidak terkontrol',
        'anemia_deficiency': 'Hb rendah — anemia defisiensi besi',
        'dengue_fever': 'Trombositopenia + hemokonsentrasi — khas demam berdarah dengue',
        'typhoid_fever': 'Leukopenia + Widal O positif tinggi — sugestif demam tifoid',
        'tb_pulmonary': 'BTA positif — tuberkulosis paru aktif, perlu pengobatan OAT',
        'uti_female': 'Leukosit urin tinggi + nitrit positif — infeksi saluran kemih',
        'gout_arthritis': 'Asam urat tinggi — hiperurisemia, mendukung diagnosis gout',
        'preeclampsia': 'Proteinuria + trombosit borderline — preeklampsia',
    };
    return map[diseaseId] || 'Hasil lab dalam batas normal, tidak ada kelainan bermakna';
}

function generateDistractors(diseaseId, difficulty, seedHint = 'default') {
    const allInterpretations = [
        'Hasil lab dalam batas normal — tidak perlu tindakan',
        'Leukositosis — kemungkinan infeksi bakteri',
        'Trombositopenia berat — perlu transfusi trombosit',
        'Kadar gula darah normal — bukan diabetes',
        'Anemia berat — perlu transfusi PRC segera',
        'Fungsi ginjal menurun — curiga CKD',
        'Proteinuria masif — curiga sindrom nefrotik',
        'BTA negatif — bukan TB paru aktif',
    ];

    const correctInterpretation = getInterpretation(diseaseId);
    const distractors = shuffleDeterministic(
        allInterpretations.filter(d => d !== correctInterpretation),
        seedKey('lab-distractors', seedHint, diseaseId, difficulty)
    );

    return distractors.slice(0, Math.min(difficulty + 1, 3));
}

function getExplanation(diseaseId, _results) {
    const map = {
        'dm_type2': 'GDS > 200 mg/dL dengan gejala klasik (poliuria, polidipsia, polifagia) cukup untuk diagnosis DM tipe 2 menurut Perkeni 2021.',
        'anemia_deficiency': 'Hb di bawah normal menunjukkan anemia. Pada wanita usia produktif, penyebab tersering adalah defisiensi besi akibat menstruasi atau diet kurang zat besi.',
        'dengue_fever': 'Penurunan trombosit < 100.000/µL + peningkatan hematokrit > 20% menunjukkan kebocoran plasma — tanda khas DBD fase kritis.',
        'typhoid_fever': 'Titer Widal O ≥ 1/320 bersama leukopenia menunjukkan infeksi Salmonella typhi aktif.',
        'tb_pulmonary': 'BTA positif pada sputum pagi menandakan TB paru aktif yang infeksius. Segera mulai pengobatan OAT kategori I.',
        'uti_female': 'Leukosituria (> 5/LPB) disertai nitrit positif adalah temuan khas infeksi saluran kemih bakterial.',
        'gout_arthritis': 'Kadar asam urat > 7 mg/dL pada pria mendukung diagnosis hiperurisemia/gout, terutama dengan nyeri sendi akut monoartikular.',
        'preeclampsia': 'Proteinuria ≥ +1 dengan tekanan darah ≥ 140/90 setelah usia kehamilan 20 minggu menunjukkan preeklampsia.',
    };
    return map[diseaseId] || 'Interpretasi berdasarkan korelasi klinis dan hasil laboratorium.';
}
