/**
 * @reflection
 * [IDENTITY]: VillageRegistry
 * [PURPOSE]: Authoritative database for Desa Sukamaju residents.
 * [STATE]: Stable (Post-Refactor v4.2)
 * [ANCHOR]: FAMILY_SDOH
 * [DEPENDS_ON]: ./village_families.js
 */

import { VILLAGE_FAMILIES as VILLAGE_FAMILIES_ORIGINAL } from './village_families.js';
import { VILLAGE_FAMILIES_EXPANDED } from './village_families_expanded.js';
import { FAMILY_SDOH_EXPANDED, FAMILY_INDICATORS_EXPANDED } from './village_data_expanded.js';

// Merge original 30 + expanded 170 = 200 KK
export const VILLAGE_FAMILIES = [...VILLAGE_FAMILIES_ORIGINAL, ...VILLAGE_FAMILIES_EXPANDED];

export const FAMILY_SDOH = {
    'kk_01': { economy: 'Middle', housing: 'Permanent', education: 'High School', water: 'PDAM', sanitation: 'Private Latrine', diet: 'Balanced', smoking: false, activity: 'Active' },
    'kk_02': { economy: 'Middle', housing: 'Permanent', education: 'Junior High', water: 'PDAM', sanitation: 'Private Latrine', diet: 'High Sugar', smoking: false, activity: 'Moderate' },
    'kk_03': { economy: 'High', housing: 'Permanent', education: 'University', water: 'PDAM', sanitation: 'Private Latrine', diet: 'Balanced', smoking: false, activity: 'Sedentary' },
    'kk_04': { economy: 'Low-Middle', housing: 'Semi-Permanent', education: 'Junior High', water: 'Well', sanitation: 'Private Latrine', diet: 'High Deep Fried', smoking: true, activity: 'Sedentary' },
    'kk_05': { economy: 'High', housing: 'Permanent (Large)', education: 'High School', water: 'PDAM', sanitation: 'Private Latrine', diet: 'High Sugar', smoking: true, activity: 'Moderate' },
    'kk_06': { economy: 'Middle', housing: 'Permanent', education: 'Vocational', water: 'Well', sanitation: 'Private Latrine', diet: 'High Salt', smoking: true, activity: 'Active' },
    'kk_07': { economy: 'Middle', housing: 'Permanent', education: 'Elementary', water: 'Well', sanitation: 'Private Latrine', diet: 'Traditional', smoking: false, activity: 'Active' },
    'kk_08': { economy: 'Low', housing: 'Semi-Permanent', education: 'Elementary', water: 'Well', sanitation: 'Private Latrine', diet: 'Poor Nutrition', smoking: true, activity: 'Active' },
    'kk_09': { economy: 'Middle', housing: 'Permanent', education: 'High School', water: 'PDAM', sanitation: 'Private Latrine', diet: 'Balanced', smoking: false, activity: 'Active' },
    'kk_10': { economy: 'Middle', housing: 'Permanent', education: 'High School', water: 'PDAM', sanitation: 'Private Latrine', diet: 'High Salt', smoking: true, activity: 'Sedentary' },
    'kk_11': { economy: 'High', housing: 'Permanent', education: 'University', water: 'PDAM', sanitation: 'Private Latrine', diet: 'Balanced', smoking: false, activity: 'Sedentary' },
    'kk_12': { economy: 'Middle', housing: 'Permanent', education: 'High School', water: 'Well', sanitation: 'Private Latrine', diet: 'Traditional', smoking: true, activity: 'Active' },
    'kk_13': { economy: 'High', housing: 'Permanent', education: 'Islamic Board', water: 'Well', sanitation: 'Private Latrine', diet: 'High Sugar', smoking: true, activity: 'Moderate' },
    'kk_14': { economy: 'Low', housing: 'Make-shift', education: 'Elementary', water: 'River', sanitation: 'River/Open', diet: 'Poor Nutrition', smoking: true, activity: 'Active' },
    'kk_15': { economy: 'Middle', housing: 'Old Permanent', education: 'Elementary', water: 'Well', sanitation: 'Private Latrine', diet: 'Traditional', smoking: true, activity: 'Active' },
    'kk_16': { economy: 'Middle', housing: 'Permanent/Shop', education: 'High School', water: 'PDAM', sanitation: 'Private Latrine', diet: 'High Fat', smoking: true, activity: 'Moderate' },
    'kk_17': { economy: 'Middle', housing: 'Permanent/Shop', education: 'High School', water: 'PDAM', sanitation: 'Private Latrine', diet: 'High Sugar', smoking: true, activity: 'Sedentary' },
    'kk_18': { economy: 'Low-Middle', housing: 'Semi-Permanent', education: 'High School', water: 'Well', sanitation: 'Private Latrine', diet: 'Instant Food', smoking: true, activity: 'Sedentary' },
    'kk_19': { economy: 'Middle', housing: 'Permanent', education: 'Elementary', water: 'Well', sanitation: 'Private Latrine', diet: 'Traditional', smoking: false, activity: 'Active' },
    'kk_20': { economy: 'Middle', housing: 'Permanent/Warung', education: 'Junior High', water: 'Well', sanitation: 'Private Latrine', diet: 'High Fat', smoking: true, activity: 'Moderate' },
    'kk_21': { economy: 'Middle', housing: 'Permanent', education: 'Junior High', water: 'Well', sanitation: 'Private Latrine', diet: 'Traditional', smoking: true, activity: 'Moderate' },
    'kk_22': { economy: 'Low', housing: 'Semi-Permanent', education: 'Junior High', water: 'Well', sanitation: 'Shared Latrine', diet: 'Poor Nutrition', smoking: false, activity: 'Sedentary' },
    'kk_23': { economy: 'Very Low', housing: 'Make-shift', education: 'No School', water: 'River', sanitation: 'River/Open', diet: 'Poor Nutrition', smoking: true, activity: 'Active' },
    'kk_24': { economy: 'Low', housing: 'Old Permanent', education: 'No School', water: 'Well', sanitation: 'Private Latrine', diet: 'Low Protein', smoking: true, activity: 'Sedentary' },
    'kk_25': { economy: 'Low-Middle', housing: 'Semi-Permanent', education: 'Elementary', water: 'Well', sanitation: 'Private Latrine', diet: 'Traditional', smoking: true, activity: 'Active' },
    'kk_26': { economy: 'Middle', housing: 'Permanent', education: 'University', water: 'PDAM', sanitation: 'Private Latrine', diet: 'Balanced', smoking: false, activity: 'Moderate' },
    'kk_27': { economy: 'Middle', housing: 'Permanent', education: 'High School', water: 'PDAM', sanitation: 'Private Latrine', diet: 'Modern', smoking: true, activity: 'Active' },
    'kk_28': { economy: 'Low', housing: 'Semi-Permanent', education: 'Junior High', water: 'Well', sanitation: 'Shared Latrine', diet: 'Traditional', smoking: true, activity: 'Active' },
    'kk_29': { economy: 'Low-Middle', housing: 'Semi-Permanent', education: 'Elementary', water: 'Well', sanitation: 'Private Latrine', diet: 'High Salt', smoking: true, activity: 'Sedentary' },
    'kk_30': { economy: 'Middle', housing: 'Permanent', education: 'High School', water: 'PDAM', sanitation: 'Private Latrine', diet: 'Low Sodium', smoking: false, activity: 'Sedentary' },
};

// Merge expanded SDOH (kk_31–kk_200)
Object.assign(FAMILY_SDOH, FAMILY_SDOH_EXPANDED);

export const FAMILY_INDICATORS = {
    'kk_01': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: true, air: true, jamban: true, jentik: true },
    'kk_02': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: false, jiwa: true, rokok: false, jkn: true, air: true, jamban: true, jentik: true },
    'kk_03': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: false },
    'kk_04': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
    'kk_05': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
    'kk_06': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: true, air: true, jamban: true, jentik: false },
    'kk_07': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: false, jiwa: true, rokok: false, jkn: true, air: true, jamban: true, jentik: true },
    'kk_08': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: false, air: true, jamban: true, jentik: false },
    'kk_09': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
    'kk_10': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
    'kk_11': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
    'kk_12': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: true, air: true, jamban: true, jentik: false },
    'kk_13': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
    'kk_14': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: false, air: true, jamban: false, jentik: false },
    'kk_15': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: false, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
    'kk_16': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: true, air: true, jamban: true, jentik: true },
    'kk_17': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: false },
    'kk_18': { kb: true, persalinan: true, imunisasi: false, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: false, air: true, jamban: true, jentik: false },
    'kk_19': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: true, air: true, jamban: true, jentik: true },
    'kk_20': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: true, air: true, jamban: true, jentik: true },
    'kk_21': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: false },
    'kk_22': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: false, air: true, jamban: true, jentik: true },
    'kk_23': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: false, air: false, jamban: false, jentik: false },
    'kk_24': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: false, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
    'kk_25': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
    'kk_26': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
    'kk_27': { kb: true, persalinan: true, imunisasi: false, asi: false, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: true, air: true, jamban: true, jentik: true },
    'kk_28': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: false, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: false, air: true, jamban: false, jentik: false },
    'kk_29': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: true, air: true, jamban: true, jentik: true },
    'kk_30': { kb: true, persalinan: true, imunisasi: true, asi: true, balita: true, tb: true, hipertensi: false, jiwa: true, rokok: true, jkn: true, air: true, jamban: true, jentik: true },
};

// Merge expanded indicators (kk_31–kk_200)
Object.assign(FAMILY_INDICATORS, FAMILY_INDICATORS_EXPANDED);


// ═══ RW Progressive Unlock ═════════════════════════════
// Game starts with RW 01-02 (30 KK). Additional RW unlock based on day + reputation.
export const RW_UNLOCK_THRESHOLDS = {
    '01': { day: 0, reputation: 0 },   // Always unlocked
    '02': { day: 0, reputation: 0 },   // Always unlocked
    '03': { day: 15, reputation: 30 },  // Early game
    '04': { day: 30, reputation: 40 },  // Mid-early
    '05': { day: 45, reputation: 50 },  // Mid game
    '06': { day: 60, reputation: 55 },  // Mid-late
    '07': { day: 75, reputation: 60 },  // Late game
    '08': { day: 90, reputation: 65 },  // Endgame
};

export function getUnlockedRWs(day, reputation) {
    return Object.entries(RW_UNLOCK_THRESHOLDS)
        .filter(([, req]) => day >= req.day && reputation >= req.reputation)
        .map(([rw]) => rw);
}

export function filterFamiliesByUnlockedRW(families, day, reputation) {
    const unlockedRWs = getUnlockedRWs(day, reputation);
    return families.filter(f => unlockedRWs.includes(f.rw || '01'));
}

// Codex Fix: derive VILLAGE_STATS from VILLAGE_FAMILIES to prevent stale data
// Previously hardcoded (was stale: 116 pop vs actual 106)
export const VILLAGE_STATS = (() => {
    let totalL = 0, totalP = 0;
    const ageGroups = { bayi: 0, balita: 0, anak: 0, remaja: 0, dewasa: 0, lansia: 0 };
    let pregnantWomen = 0;
    VILLAGE_FAMILIES.forEach(fam => {
        (fam.members || []).forEach(m => {
            if (m.gender === 'L') totalL++; else totalP++;
            const age = m.age ?? 0;
            if (age < 1) ageGroups.bayi++;
            else if (age <= 5) ageGroups.balita++;
            else if (age <= 11) ageGroups.anak++;
            else if (age <= 17) ageGroups.remaja++;
            else if (age <= 59) ageGroups.dewasa++;
            else ageGroups.lansia++;
            if (m.pregnant) pregnantWomen++;
        });
    });
    const totalPopulation = totalL + totalP;
    return {
        totalKK: VILLAGE_FAMILIES.length,
        totalPopulation,
        byGender: { L: totalL, P: totalP },
        byAgeGroup: ageGroups,
        pregnantWomen,
        kader: 2,
        avgIKS: 0.85
    };
})();

export const INDIVIDUAL_PROFILES = {
    'v_02_4': {
        conditions: ['hypertension_stage2', 'diabetes_type2', 'osteoarthritis'],
        allergies: ['Penisilin'],
        vaccinations: { influenza: false, pneumococcal: false, covid19: 'dose_2' },
        lifestyle: { smoking: 'former', alcohol: 'never', exercise: 'sedentary', diet: 'high_salt' },
        medications: ['Amlodipine 5mg', 'Metformin 500mg'],
        notes: 'Sering lupa minum obat. Butuh edukasi kepatuhan.'
    }
};

export const FAMILY_MEDICAL_HISTORY = {
    'kk_02': { diabetes: true, hypertension: true, heartDisease: false, stroke: true, cancer: false, asthma: false, mentalHealth: false }
};

export function getAllVillagers() {
    const villagers = [];
    VILLAGE_FAMILIES.forEach(family => {
        family.members.forEach(member => {
            villagers.push({
                ...member,
                familyId: family.id,
                fullName: `${member.firstName} ${family.surname}`,
                indicators: FAMILY_INDICATORS[family.id] || {},
                sdoh: FAMILY_SDOH[family.id] || {},
                profile: INDIVIDUAL_PROFILES[member.id] || null,
                familyMedicalHistory: FAMILY_MEDICAL_HISTORY[family.id] || null
            });
        });
    });
    return villagers;
}

export function calculateRiskFactors(indicators, member, sdoh, profile = null) {
    const risks = [];
    if (indicators && !indicators.jamban) risks.push('poor_sanitation');
    if (indicators && !indicators.air) risks.push('unsafe_water');
    if (indicators && !indicators.rokok) risks.push('smoke_exposure');
    if (indicators && !indicators.jkn) risks.push('uninsured');

    if (member.age >= 40 && indicators && !indicators.hipertensi) {
        risks.push('uncontrolled_hypertension');
    }

    if (sdoh && sdoh.diet === 'High Sugar') risks.push('diabetes_risk');

    if (profile && profile.conditions && profile.conditions.includes('stunting_risk')) {
        risks.push('stunting');
    }

    return risks;
}

export function getFamilyById(familyId) { return VILLAGE_FAMILIES.find(f => f.id === familyId); }
export function getFamilyIndicators(familyId) { return FAMILY_INDICATORS[familyId] || {}; }
export function getFamilySDOH(familyId) { return FAMILY_SDOH[familyId] || {}; }
export function getIndividualProfile(villagerId) { return INDIVIDUAL_PROFILES[villagerId] || null; }
export function getFamilyMedicalHistory(familyId) { return FAMILY_MEDICAL_HISTORY[familyId] || null; }
export function getVillagerById(villagerId) { return getAllVillagers().find(v => v.id === villagerId) || null; }

export function updateFamilyIndicators(villageData, familyId, updates) {
    if (!villageData || !villageData.families) return villageData;
    const newFamilies = villageData.families.map(f => f.id === familyId ? { ...f, indicators: { ...f.indicators, ...updates } } : f);
    return { ...villageData, families: newFamilies };
}

export function recordHomeVisit(villageData, _familyId, _visitData) { return villageData; }
export function getFamiliesAtRisk(_villageData, _riskIndicator) { return []; }
// NOTE: Village-wide IKS is computed from PIS-PK indicators via
// `calculateVillageIKSPisPk` (src/domains/village/pisPkIndicators.js) or from
// TTM readiness via `calculateVillageIKS` (NPCReadiness.js). This stub was a
// hardcoded 0.85 placeholder that shadowed both — removed 2026-04-23.
export function getVillageHealthStats(_villageData) { return {}; }
export function validateVillageData(_villageData) { return { isValid: true, errors: [] }; }
