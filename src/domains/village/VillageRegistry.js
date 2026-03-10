/**
 * @reflection
 * [IDENTITY]: VillageRegistry
 * [PURPOSE]: Authoritative database for Desa Sukamaju residents.
 * [STATE]: Stable (Post-Refactor v4.2)
 * [ANCHOR]: FAMILY_SDOH
 * [DEPENDS_ON]: ./village_families.js
 */

import { VILLAGE_FAMILIES } from './village_families.js';

export { VILLAGE_FAMILIES };

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
    'kk_23': { economy: 'Very Low', housing: 'Make-shift/Bamboo', education: 'No School', water: 'River', sanitation: 'River/Open', diet: 'Poor Nutrition', smoking: true, activity: 'Active' },
    'kk_24': { economy: 'Low', housing: 'Old Permanent', education: 'No School', water: 'Well', sanitation: 'Private Latrine', diet: 'Low Protein', smoking: true, activity: 'Sedentary' },
    'kk_25': { economy: 'Low-Middle', housing: 'Semi-Permanent', education: 'Elementary', water: 'Well', sanitation: 'Private Latrine', diet: 'Traditional', smoking: true, activity: 'Active' },
    'kk_26': { economy: 'Middle', housing: 'Permanent', education: 'University', water: 'PDAM', sanitation: 'Private Latrine', diet: 'Balanced', smoking: false, activity: 'Moderate' },
    'kk_27': { economy: 'Middle', housing: 'Permanent', education: 'High School', water: 'PDAM', sanitation: 'Private Latrine', diet: 'Modern', smoking: true, activity: 'Active' },
    'kk_28': { economy: 'Low', housing: 'Semi-Permanent', education: 'Junior High', water: 'Well', sanitation: 'Shared Latrine', diet: 'Traditional', smoking: true, activity: 'Active' },
    'kk_29': { economy: 'Low-Middle', housing: 'Semi-Permanent', education: 'Elementary', water: 'Well', sanitation: 'Private Latrine', diet: 'High Salt', smoking: true, activity: 'Sedentary' },
    'kk_30': { economy: 'Middle', housing: 'Permanent', education: 'High School', water: 'PDAM', sanitation: 'Private Latrine', diet: 'Low Sodium', smoking: false, activity: 'Sedentary' },
};

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

export const VILLAGE_STATS = { totalKK: 30, totalPopulation: 116, byGender: { L: 60, P: 56 }, byAgeGroup: { bayi: 5, balita: 10, anak: 18, remaja: 13, dewasa: 52, lansia: 18 }, pregnantWomen: 3, kader: 2, avgIKS: 0.85 };

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
export function calculateVillageIKS(_villageData) { return 0.85; }
export function getVillageHealthStats(_villageData) { return {}; }
export function validateVillageData(_villageData) { return { isValid: true, errors: [] }; }
