/**
 * @reflection
 * [IDENTITY]: PatientGenerator
 * [PURPOSE]: Game engine module providing: generatePatient, generateEmergencyPatient, generateProlanisVisitPatient.
 * [STATE]: Refactored (PatientFactory Phase 1)
 * [ANCHOR]: generatePatient
 * [DEPENDS_ON]: PatientFactory, CaseLibrary, EmergencyCases, SocialDeterminants, VillageRegistry, CalendarEventDB
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-27
 */
import { CASE_LIBRARY, getCaseByCondition } from '../content/cases/CaseLibrary.js';
import { getAuthoredDemographicProfile } from '../content/cases/CaseDemographics.js';
import { getRandomEmergencyCase } from './EmergencyCases.js';
import { generateSocialDeterminants } from '../utils/SocialDeterminants.js';
import { calculateRiskFactors, INDIVIDUAL_PROFILES, FAMILY_MEDICAL_HISTORY } from '../domains/village/VillageRegistry.js';
import { getEffectiveServiceDistance } from '../domains/village/serviceDistance.js';
import { calculateDistanceDecayModifiers } from '../domains/village/spatialDistanceDecay.js';
import { getDateFromDay } from '../data/CalendarEventDB.js';
import { createDeterministicSequence, pickDeterministic, randomIdFromSeed, seedKey } from '../utils/deterministicRandom.js';
import { normalizePatientOutput, generateAnthropometrics as _generateAnthropometrics, NAMES_MALE as _NM, NAMES_FEMALE as _NF, SURNAMES as _SN } from './PatientFactory.js';

// Curated anchor families (have INDIVIDUAL_PROFILES or FAMILY_MEDICAL_HISTORY)
// For 200 KK: bias is now lighter — pool is much bigger, so distribution is more even
const CURATED_FAMILY_IDS = ['kk_02', 'kk_04', 'kk_08', 'kk_15', 'kk_22', 'kk_23', 'kk_24', 'kk_25'];
const PUSKESMAS_ANCHOR = { id: 'puskesmas', x: 100, y: 30, isActive: true };
const DEFAULT_SERVICE_ANCHORS = [PUSKESMAS_ANCHOR];

const CATEGORY_FACILITY_MAP = {
    'Respiratory': 'poli_umum',
    'Digestive': 'poli_umum',
    'Cardiovascular': 'poli_umum',
    'Infection': 'poli_umum',
    'Dermatology': 'poli_umum',
    'Neurology': 'poli_umum',
    'Urinary': 'poli_umum',
    'Endocrine': 'poli_umum',
    'Hematology': 'poli_umum',
    'Psychiatry': 'poli_umum',
    'Ophthalmology': 'poli_umum',
    'ENT': 'poli_umum',
    'Skeletal': 'poli_umum',
    'Trauma': 'poli_umum',
    'Environmental': 'poli_umum',
    'Forensik': 'poli_umum',
    'General': 'poli_umum',
    'Musculoskeletal': 'poli_umum',
    'Nutrition': 'poli_umum',
    'Skin': 'poli_umum',
    'STI': 'poli_kia_kb',
    'Dental': 'poli_gigi',
    'Maternal': 'poli_kia_kb',
    'Pediatrics': 'poli_kia_kb',
    'Reproductive': 'poli_kia_kb'
};

const CASE_ID_ALIASES = {
    hypertensive_crisis: 'hypertension_primary',
    uti_female: 'uti_uncomplicated',
    stroke_ischemic: 'stroke_infark',
    heart_failure_chronic: 'gagal_jantung_kronik',
    ckd_stage3: 'dm_complicated',
    copd_stable: 'bronchitis_acute',
    perdarahan_postpartum: 'pph',
    sepsis_neonatal: 'infeksi_umbilikus',
};

const DEFAULT_AUTHORED_DEMOGRAPHIC_PROFILE = Object.freeze({
    kind: 'general',
    minAge: 15,
    maxAge: 89,
    genders: ['L', 'P'],
});

function getClinicalHiddenContract(disease = {}) {
    return {
        correctTreatment: disease.correctTreatment || [],
        correctProcedures: disease.correctProcedures || [],
        requiredEducation: disease.requiredEducation || [],
        relevantLabs: disease.relevantLabs || [],
    };
}

// Condition to case mapping for profile-based generation
// All IDs must exactly match a CASE_LIBRARY entry id
const CONDITION_CASE_MAPPING = {
    'hypertension_stage1': ['hypertension_primary', 'tension_headache'],
    'hypertension_stage2': ['hypertension_primary', 'tension_headache'],
    'diabetes_type2': ['dm_type2', 'dm_complicated'],
    'prediabetes': ['dm_type2', 'obesity'],
    'osteoarthritis': ['gout_arthritis', 'lbp_mechanical'],
    'osteoporosis': ['lbp_mechanical'],
    'pregnancy_normal': ['kehamilan_normal_anc', 'anemia_kehamilan'],
    'recurrent_ari': ['ispa_common', 'bronchitis_acute', 'acute_pharyngitis'],
    'stunting_risk': ['pem', 'acute_gastroenteritis', 'anemia_deficiency'],
    'stunting_moderate': ['pem', 'anemia_deficiency', 'ascariasis'],
    'anemia_mild': ['anemia_deficiency'],
    'tb_latent': ['tb_pulmonary'],
    'malnutrition_elderly': ['anemia_deficiency'],
    'dementia_mild': ['insomnia'],
    'depression_mild': ['insomnia'],
    'chronic_back_pain': ['lbp_mechanical'],
    'scabies': ['scabies', 'contact_dermatitis'],
    'dental_caries': ['stomatitis_aftosa'],
    'helminthiasis': ['ascariasis', 'anemia_deficiency', 'acute_gastroenteritis'],
    'benign_prostatic_hyperplasia': ['uti_uncomplicated'],
    'cataract': ['conjunctivitis_bacterial', 'hordeolum'],
    'knee_osteoarthritis': ['gout_arthritis', 'lbp_mechanical'],
    'underweight': ['anemia_deficiency'],
    'post_stroke_hemiparesis': ['stroke_infark'],
    'heart_failure': ['gagal_jantung_kronik'],
    'ckd': ['dm_complicated'],
    'copd': ['bronchitis_acute'],
    'growth_faltering_risk': ['pem', 'anemia_deficiency']
};

const SEASONAL_MULTIPLIERS = {
    // Rainy Season (Jan, Feb, Nov, Dec) - Dengue, Diarrhea, ILI
    rainy: {
        months: [0, 1, 10, 11], // Jan, Feb, Nov, Dec
        diseases: {
            'dengue_df': 3.0, // High DHF risk
            'acute_gastroenteritis': 1.5,
            'ispa_common': 1.2
        }
    },
    // Transition (Mar, Apr, Sep, Oct) - Allergies, Respiratory
    transition: {
        months: [2, 3, 8, 9],
        diseases: {
            'ispa_common': 1.5,
            'asthma_bronchiale': 1.5,
            'contact_dermatitis': 1.2
        }
    },
    // Dry Season (May - Aug) - Dust, Hydration
    dry: {
        months: [4, 5, 6, 7],
        diseases: {
            'ispa_common': 1.3,
            'contact_dermatitis': 1.3,
            'tension_headache': 1.2
        }
    }
};

// ═══ GEOSPATIAL LAW 2 & 3: Hazard Proximity + Distance Decay ═══
// Maps hazardHub disease keys → real CASE_LIBRARY case IDs
// Unknown keys are safely ignored (acceptance criteria)
const HAZARD_DISEASE_MAP = {
    'diare':                  ['acute_gastroenteritis'],
    'tifoid':                 ['typhoid_fever'],
    'leptospirosis':          ['leptospirosis', 'acute_gastroenteritis'],
    'malaria':                ['malaria_vivax', 'malaria_falciparum'],
    'keracunan_pestisida':    ['intoxication', 'contact_dermatitis'],
    'avian_influenza':        ['ispa_common', 'pneumonia_community'],
    'brucellosis':            ['acute_gastroenteritis', 'typhoid_fever'],
    'komplikasi_persalinan':  ['pph'],
};

const MAX_COMBINED_MULTIPLIER = 5.0;

function resolveCanonicalCaseId(caseId) {
    return CASE_ID_ALIASES[caseId] || caseId;
}

function resolveCaseByCondition(caseId) {
    if (!caseId) return null;
    return getCaseByCondition(resolveCanonicalCaseId(caseId));
}

function sampleAgeInRange(rng, minAge, maxAge) {
    if (minAge >= maxAge) return minAge;
    return minAge + rng.int((maxAge - minAge) + 1);
}

function normalizeDemographicProfile(profile = null) {
    if (!profile || typeof profile !== 'object') return null;

    const minAge = Number.isFinite(profile.minAge) ? Number(profile.minAge) : 15;
    const maxAge = Number.isFinite(profile.maxAge) ? Number(profile.maxAge) : minAge;
    const genders = Array.isArray(profile.genders) && profile.genders.length > 0
        ? [...new Set(profile.genders.filter((gender) => gender === 'L' || gender === 'P'))]
        : ['L', 'P'];

    return {
        kind: profile.kind || 'general',
        minAge,
        maxAge: Math.max(minAge, maxAge),
        genders: genders.length > 0 ? genders : ['L', 'P'],
        informant: profile.informant ? { ...profile.informant } : undefined,
    };
}

export function getCaseDemographicProfile(caseData = {}) {
    const id = caseData.id || '';
    const authoredProfile = normalizeDemographicProfile(
        caseData.demographicProfile || getAuthoredDemographicProfile(id)
    );
    if (authoredProfile) {
        return authoredProfile;
    }
    // Age/gender must come from authored metadata only.
    // Dialogue often contains caregiver narration, family history, or opposite-sex examples,
    // so text heuristics are too brittle for reliable spawning.
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV && id) {
        console.warn(`[PatientGenerator] Missing authored demographicProfile for case "${id}". Falling back to default general adult profile.`);
    }
    return normalizeDemographicProfile(DEFAULT_AUTHORED_DEMOGRAPHIC_PROFILE);
}

function isCaseCompatibleWithDemographics(caseData, age = null, gender = null) {
    if (!caseData) return false;
    const profile = getCaseDemographicProfile(caseData);

    if (gender && !profile.genders.includes(gender)) {
        return false;
    }

    if (typeof age === 'number' && Number.isFinite(age)) {
        if (age < profile.minAge || age > profile.maxAge) {
            return false;
        }
    }

    return true;
}

function sampleDemographicsForCase(caseData, rng) {
    const profile = getCaseDemographicProfile(caseData);
    const gender = profile.genders.length === 1
        ? profile.genders[0]
        : (rng.chance(0.5) ? 'L' : 'P');

    let age;
    switch (profile.kind) {
        case 'neonate':
            age = 0;
            break;
        case 'maternal':
            age = sampleAgeInRange(rng, Math.max(profile.minAge, 18), Math.min(profile.maxAge, 38));
            break;
        case 'infant':
        case 'pediatric':
            age = sampleAgeInRange(rng, profile.minAge, profile.maxAge);
            break;
        default: {
            const ageRoll = rng.nextFloat();
            const youngAdultMin = Math.max(profile.minAge, 15);
            const youngAdultMax = Math.min(profile.maxAge, 49);
            const middleAgeMin = Math.max(profile.minAge, 50);
            const middleAgeMax = Math.min(profile.maxAge, 69);
            const seniorMin = Math.max(profile.minAge, 70);
            const seniorMax = profile.maxAge;

            if (youngAdultMin <= youngAdultMax && ageRoll < 0.6) age = sampleAgeInRange(rng, youngAdultMin, youngAdultMax);
            else if (middleAgeMin <= middleAgeMax && ageRoll < 0.85) age = sampleAgeInRange(rng, middleAgeMin, middleAgeMax);
            else if (seniorMin <= seniorMax) age = sampleAgeInRange(rng, seniorMin, seniorMax);
            else age = sampleAgeInRange(rng, profile.minAge, profile.maxAge);
            break;
        }
    }

    return { age, gender };
}

function buildSyntheticName(age, gender, seedHint = 'default', forcedSurname = null) {
    const surname = forcedSurname || pickDeterministic(SURNAMES, seedKey(seedHint, 'surname'));
    if (age === 0) {
        return `Bayi ${surname}`.trim();
    }

    const firstNamePool = gender === 'L' ? NAMES_MALE : NAMES_FEMALE;
    const firstName = pickDeterministic(firstNamePool, seedKey(seedHint, 'first-name', gender));
    return `${firstName} ${surname}`.trim();
}

function getPrimaryComplaintResponse(caseData = {}) {
    const mainQuestion = Object.values(caseData?.anamnesisQuestions || {})
        .flat()
        .find((question) => question?.id === 'q_main' || question?.id === 'q_main_complaint');

    return mainQuestion?.response || '';
}

function pickCompatibleFamilyMember(familyMembers = [], caseData, localSeed = 'default') {
    if (!Array.isArray(familyMembers) || familyMembers.length === 0) return null;
    const compatibleMembers = familyMembers.filter((member) => (
        isCaseCompatibleWithDemographics(caseData, member.age, member.gender)
    ));

    if (compatibleMembers.length === 0) return null;
    return pickDeterministic(compatibleMembers, seedKey(localSeed, 'compatible-member'));
}

/**
 * Geo Law 2+3: Calculate spatial risk multipliers for a resident family.
 * Pure function — no UI/React imports. Data passed as plain objects.
 *
 * @param {{ x: number, y: number }} familyCoords - grid position of family house
 * @param {Array<{ id: string, x: number, y: number, radius: number, diseases: string[], multiplier: number }>} hazardHubs
 * @returns {{ diseaseBoosts: Record<string, number>, debug: Array }}
 */
export function applySpatialRisk(familyCoords, hazardHubs) {
    if (!familyCoords || !hazardHubs || hazardHubs.length === 0) {
        return { diseaseBoosts: {}, debug: [] };
    }

    const diseaseBoosts = {};
    const debug = [];

    for (const hub of hazardHubs) {
        const dx = (familyCoords.x || 0) - (hub.x || 0);
        const dy = (familyCoords.y || 0) - (hub.y || 0);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = hub.radius || 10;

        if (dist >= radius) continue;

        // Quadratic decay: strongest at center, smooth falloff to edge
        const decay = Math.pow(1 - dist / radius, 2);
        const effectiveMultiplier = 1 + ((hub.multiplier || 2.0) - 1) * decay;

        const resolvedCases = [];
        for (const diseaseKey of (hub.diseases || [])) {
            const caseIds = HAZARD_DISEASE_MAP[diseaseKey];
            if (!caseIds) continue;
            for (const caseId of caseIds) {
                const existing = diseaseBoosts[caseId] || 1.0;
                diseaseBoosts[caseId] = Math.min(MAX_COMBINED_MULTIPLIER, existing * effectiveMultiplier);
                resolvedCases.push(caseId);
            }
        }

        debug.push({
            hazardId: hub.id,
            distance: Math.round(dist * 100) / 100,
            radius,
            decay: Math.round(decay * 1000) / 1000,
            appliedMultiplier: Math.round(effectiveMultiplier * 100) / 100,
            affectedCases: resolvedCases,
        });
    }

    return { diseaseBoosts, debug };
}

const NAMES_MALE = ['Budi', 'Agus', 'Joko', 'Andi', 'Dedi', 'Eko', 'Bambang', 'Hendra', 'Iwan', 'Rizky', 'Fajar', 'Gilang', 'Hari', 'Irfan', 'Kurnia', 'Lukman', 'Maulana', 'Nanda', 'Oscar', 'Putra', 'Rendi', 'Surya', 'Taufik', 'Umar', 'Wahyu'];
const NAMES_FEMALE = ['Siti', 'Dewi', 'Sri', 'Rina', 'Ani', 'Wati', 'Yuni', 'Lina', 'Mega', 'Fitri', 'Ayu', 'Bella', 'Citra', 'Dian', 'Eka', 'Farah', 'Gita', 'Hana', 'Intan', 'Kartika', 'Laras', 'Maya', 'Nita', 'Oktavia', 'Putri'];
const SURNAMES = ['Santoso', 'Widodo', 'Kusuma', 'Putri', 'Wibowo', 'Lestari', 'Hidayat', 'Setiawan', 'Pratama', 'Nugroho', 'Saputra', 'Ramadhan', 'Permana', 'Utomo', 'Hartono', 'Cahyono', 'Firmansyah', 'Pradana', 'Sulistyo', 'Gunawan'];

/**
 * Get BMI category based on value and age
 */
function getBMICategory(bmi, age) {
    if (age < 18) {
        // Simplified pediatric categories
        if (bmi < 14) return 'Underweight';
        if (bmi < 20) return 'Normal';
        if (bmi < 25) return 'Overweight';
        return 'Obese';
    }
    // Adult categories (WHO)
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Obese I';
    if (bmi < 40) return 'Obese II';
    return 'Obese III';
}

/**
 * Generate realistic anthropometric data based on age and gender
 */
function generateAnthropometrics(age, gender, seedHint = 'default') {
    const rng = createDeterministicSequence(seedKey('anthropometrics', seedHint, age, gender));
    let height, weight;

    if (age < 5) {
        // Toddler: height 75-110cm
        height = 75 + (age * 7) + rng.int(10);
        weight = 10 + (age * 2) + rng.int(4);
    } else if (age < 12) {
        // Child: height 100-150cm
        height = 100 + ((age - 5) * 5) + rng.int(15);
        weight = 18 + ((age - 5) * 3) + rng.int(8);
    } else if (age < 18) {
        // Adolescent
        if (gender === 'L') {
            height = 145 + ((age - 12) * 5) + rng.int(15);
            weight = 40 + ((age - 12) * 4) + rng.int(15);
        } else {
            height = 140 + ((age - 12) * 3) + rng.int(12);
            weight = 38 + ((age - 12) * 3) + rng.int(12);
        }
    } else {
        // Adult
        if (gender === 'L') {
            height = 155 + rng.int(25); // 155-180cm
            // Weight with realistic distribution including obesity
            const bmiTarget = 18 + (rng.nextFloat() * 15); // BMI 18-33
            weight = Math.round(bmiTarget * ((height / 100) ** 2));
        } else {
            height = 145 + rng.int(20); // 145-165cm
            const bmiTarget = 17 + (rng.nextFloat() * 14); // BMI 17-31
            weight = Math.round(bmiTarget * ((height / 100) ** 2));
        }
    }

    // Ensure minimum weights
    weight = Math.max(weight, 8);

    const bmi = weight / ((height / 100) ** 2);
    const bmiCategory = getBMICategory(bmi, age);

    // Generate risk factors based on BMI
    const bmiRiskFactors = [];
    if (bmiCategory === 'Underweight') {
        bmiRiskFactors.push('Risiko malnutrisi');
    } else if (bmiCategory === 'Overweight') {
        bmiRiskFactors.push('Risiko penyakit metabolik');
    } else if (bmiCategory.startsWith('Obese')) {
        bmiRiskFactors.push('Obesitas', 'Risiko tinggi HT/DM/PJK');
    }

    return {
        height,
        weight,
        bmi: Math.round(bmi * 10) / 10,
        bmiCategory,
        bmiRiskFactors
    };
}

function generateComplaintText(disease, seedHint = 'default') {
    // Safety check - if disease is null/undefined, return generic complaint
    if (!disease) {
        return "Tidak enak badan dok...";
    }

    const primaryComplaint = getPrimaryComplaintResponse(disease);
    if (primaryComplaint) {
        return primaryComplaint;
    }

    // Use the disease's anamnesis entries directly — they should be complete, natural sentences
    // Do NOT append random greeting or duration fragments
    const anamnesis = disease.anamnesis || [];
    if (anamnesis.length > 0) {
        return pickDeterministic(anamnesis, seedKey('complaint-text', disease.id, seedHint));
    }

    // Fallback: use first symptom as a complaint
    return disease.symptoms?.[0] ? `${disease.symptoms[0]} dok...` : "Tidak enak badan dok...";
}



/**
 * Main function to generate a patient
 * @param {number} currentTime - Current time in minutes (480-960)
 * @param {object} population - VillageRegistry population data
 * @param {number} gameDay - Current game day (for seasonality)
 * @param {object} facilities - Active facilities levels
 * @param {object} skills - Unlocked player skills
 * @param {string} seedHint - Deterministic seed hint
 * @param {object} [spatialContext] - { hazardHubs, familyCoords: Record<familyId, {x,y}> }
 */
export function generatePatient(currentTime, population, gameDay = 1, facilities = {}, _skills = {}, seedHint = 'default', spatialContext = null) {
    const patientSeed = seedKey(
        'patient',
        seedHint,
        currentTime,
        gameDay,
        population?.villagers?.length || 0,
        Object.entries(facilities || {}).sort(([a], [b]) => a.localeCompare(b))
    );
    const rng = createDeterministicSequence(patientSeed);
    let isResident = false;
    let resident = null;
    let residentFamily = null;
    let residentProfile = null;
    let familyMedHistory = null;
    let residentRiskFactors = [];

    if (population && population.villagers && population.villagers.length > 0 && rng.chance(0.7)) {
        const living = population.villagers.filter(v => !v.status || v.status === 'alive');

        if (living.length > 0) {
            const curatedMembers = living.filter(v => CURATED_FAMILY_IDS.includes(v.familyId));
            resident = (curatedMembers.length > 0 && rng.chance(0.15))
                ? pickDeterministic(curatedMembers, seedKey(patientSeed, 'curated-member'))
                : pickDeterministic(living, seedKey(patientSeed, 'resident-member'));

            residentFamily = population.families?.find(f => f.id === resident.familyId);
            residentProfile = INDIVIDUAL_PROFILES[resident.id] || null;
            familyMedHistory = FAMILY_MEDICAL_HISTORY[resident.familyId] || null;
            isResident = true;
        }
    }

    const residentAge = isResident ? resident?.age : null;
    const residentGender = isResident ? resident?.gender : null;

    const availableCases = CASE_LIBRARY.filter(c => {
        const requiredFacility = CATEGORY_FACILITY_MAP[c.category] || 'poli_umum';
        if ((facilities[requiredFacility] || 0) <= 0) return false;
        return isCaseCompatibleWithDemographics(c, residentAge, residentGender);
    });

    const compatibleFallbackCases = CASE_LIBRARY.filter((caseData) => (
        isCaseCompatibleWithDemographics(caseData, residentAge, residentGender)
    ));

    const getRandomFilteredCase = (localSeed = 'default') => {
        const source = availableCases.length > 0
            ? availableCases
            : (compatibleFallbackCases.length > 0 ? compatibleFallbackCases : CASE_LIBRARY);
        return pickDeterministic(source, seedKey(patientSeed, 'case', localSeed));
    };

    const getFilteredCaseByCondition = (caseId) => {
        const c = resolveCaseByCondition(caseId);
        if (!c) return null;
        const requiredFacility = CATEGORY_FACILITY_MAP[c.category] || 'poli_umum';
        if ((facilities[requiredFacility] || 0) > 0 && isCaseCompatibleWithDemographics(c, residentAge, residentGender)) return c;
        return null;
    };

    if (isResident && residentFamily && residentFamily.indicators) {
        residentRiskFactors = calculateRiskFactors(
            residentFamily.indicators,
            resident,
            resident.sdoh || {},
            residentProfile
        );
    } else if (Array.isArray(resident?.riskFactors)) {
        residentRiskFactors = resident.riskFactors;
    }

    const familyIKS = residentFamily?.iksScore || 0.5;

    let jentikCoverage = 0.5;
    if (population && population.families) {
        const jentikCount = population.families.filter(f => f.indicators?.jentik === true).length;
        jentikCoverage = jentikCount / population.families.length;
    }

    let disease = null;
    let isStochastic = false;

    if (residentProfile?.storyline?.triggerEvent && rng.chance(0.4)) {
        const storyCase = getFilteredCaseByCondition(residentProfile.storyline.triggerEvent);
        if (storyCase) {
            disease = {
                ...storyCase,
                anamnesis: [
                    `(${residentProfile.storyline.background}) ${storyCase.anamnesis?.[0] || ''}`.trim()
                ]
            };
        }
    }

    if (!disease && residentProfile?.conditions?.length > 0 && rng.chance(0.6)) {
        const condition = pickDeterministic(residentProfile.conditions, seedKey(patientSeed, 'condition'));
        const possibleCases = CONDITION_CASE_MAPPING[condition] || [];

        if (possibleCases.length > 0) {
            const caseId = pickDeterministic(possibleCases, seedKey(patientSeed, 'condition-case', condition));
            disease = getFilteredCaseByCondition(caseId);
        }

        if (!disease) {
            disease = getRandomFilteredCase('profile-fallback');
        }
    } else if (isResident && residentRiskFactors.length > 0) {
        isStochastic = true;
        const riskDiseaseMappings = {
            'poor_sanitation': ['acute_gastroenteritis', 'typhoid_fever', 'ascariasis'],
            'unsafe_water': ['acute_gastroenteritis', 'hepatitis_a'],
            'smoke_exposure': ['ispa_common', 'bronchitis_acute', 'asthma_bronchiale'],
            'passive_smoker': ['ispa_common', 'bronchitis_acute', 'pharyngitis_acute'],
            'diabetes_risk': ['dm_type2'],
            'hypertension_risk': ['hypertension_primary', 'tension_headache'],
            'obesity_risk': ['hypertension_primary', 'dm_type2', 'gout_arthritis'],
            'poor_housing': ['ispa_common', 'tb_pulmonary', 'scabies'],
            'high_infection_risk': ['acute_gastroenteritis', 'typhoid_fever', 'dengue_df'],
            'stunting': ['pem', 'anemia_deficiency', 'acute_gastroenteritis'],
            'anemia': ['anemia_deficiency'],
            'tb_contact': ['tb_pulmonary', 'ispa_common'],
            'uninsured': null
        };

        const preferredDiseases = residentRiskFactors.reduce((acc, risk) => {
            if (riskDiseaseMappings[risk]) {
                acc.push(...riskDiseaseMappings[risk]);
            }
            return acc;
        }, []);

        if (preferredDiseases.length > 0 && rng.chance(0.5)) {
            const caseId = pickDeterministic(preferredDiseases, seedKey(patientSeed, 'risk-case'));
            disease = getFilteredCaseByCondition(caseId);
        }

        if (!disease) {
            disease = getRandomFilteredCase('risk-fallback');
        }
    } else {
        isStochastic = true;
        disease = getRandomFilteredCase('default');
    }

    // ═══ GEO LAW 2+3: Spatial risk boost (resident only, stochastic branch only) ═══
    let spatialRiskDebug = null;
    if (isResident && isStochastic && spatialContext?.hazardHubs && spatialContext?.familyCoords) {
        const familyCoords = spatialContext.familyCoords[resident.familyId];
        if (familyCoords) {
            const { diseaseBoosts, debug } = applySpatialRisk(familyCoords, spatialContext.hazardHubs);
            spatialRiskDebug = debug;

            // Check if current disease has a spatial boost — if not, try to swap
            const currentBoost = disease?.id ? (diseaseBoosts[disease.id] || 1.0) : 1.0;
            const boostedCaseIds = Object.entries(diseaseBoosts)
                .filter(([, mult]) => mult > 1.2)
                .sort(([, a], [, b]) => b - a);

            if (boostedCaseIds.length > 0 && currentBoost <= 1.0) {
                // Swap chance proportional to top boost (capped at 0.6)
                const topBoost = boostedCaseIds[0][1];
                const swapChance = Math.min(0.6, (topBoost - 1) * 0.15);
                const spatialRng = createDeterministicSequence(seedKey(patientSeed, 'spatial'));
                if (spatialRng.chance(swapChance)) {
                    const targetCaseId = pickDeterministic(
                        boostedCaseIds.map(([id]) => id),
                        seedKey(patientSeed, 'spatial-pick')
                    );
                    const spatialCase = getFilteredCaseByCondition(targetCaseId);
                    if (spatialCase) {
                        disease = spatialCase;
                    }
                }
            }
        }
    }

    const date = getDateFromDay(gameDay);
    const month = date.getMonth();
    const seasonalRng = createDeterministicSequence(seedKey(patientSeed, 'seasonal', month));

    Object.values(SEASONAL_MULTIPLIERS).forEach(season => {
        if (!season.months.includes(month)) return;

        Object.entries(season.diseases).forEach(([seasonalDiseaseId, multiplier]) => {
            if (disease?.id === seasonalDiseaseId) {
                return;
            }

            const swapChance = (multiplier - 1) * 0.2;
            if (seasonalRng.chance(swapChance)) {
                const seasonalCase = getFilteredCaseByCondition(seasonalDiseaseId);
                if (seasonalCase) {
                    disease = seasonalCase;
                }
            }
        });
    });

    if (!disease) {
        disease = getRandomFilteredCase('safety-fallback');
    }

    if (isResident && familyIKS >= 0.8 && rng.chance(0.25)) {
        const checkupCase = getCaseByCondition('general_checkup');
        if (checkupCase) {
            disease = checkupCase;
        }
    }

    if (disease?.id === 'dengue_df' && jentikCoverage > 0.7 && rng.chance(0.5)) {
        let redraw = 0;
        disease = getRandomFilteredCase(seedKey('dengue-reroll', redraw));
        while (disease?.id === 'dengue_df' && redraw < 10) {
            redraw += 1;
            disease = getRandomFilteredCase(seedKey('dengue-reroll', redraw));
        }
    }

    let gender;
    let age;
    if (isResident) {
        gender = resident.gender;
        age = resident.age;
    } else {
        const demographics = sampleDemographicsForCase(disease, rng);
        gender = demographics.gender;
        age = demographics.age;
    }

    const name = isResident
        ? resident.fullName
        : buildSyntheticName(age, gender, patientSeed);

    const anthropometrics = generateAnthropometrics(age, gender, seedKey(patientSeed, 'anthropometrics'));

    let sdoh;
    if (isResident) {
        const regSdoh = resident.sdoh || {};
        const eduMap = {
            'No School': 'Tidak Sekolah',
            'Elementary': 'SD',
            'Junior High': 'SMP',
            'High School': 'SMA/SMK',
            'Vocational': 'SMA/SMK',
            'University': 'D3/S1',
            'Islamic Board': 'Pasantren'
        };
        const housingMap = {
            'Permanent': 'Rumah Permanen',
            'Permanent (Large)': 'Rumah Permanen',
            'Permanent/Shop': 'Rumah Permanen',
            'Old Permanent': 'Rumah Permanen',
            'Semi-Permanent': 'Rumah Semi-Permanen',
            'Make-shift': 'Rumah Tidak Layak (Rutilahu)',
            'Make-shift/Bamboo': 'Rumah Tidak Layak (Rutilahu)',
            'Base': 'Rumah Semi-Permanen'
        };
        const econMap = {
            'Very Low': 'Prasejahtera',
            'Low': 'Prasejahtera',
            'Low-Middle': 'Menengah',
            'Middle': 'Menengah',
            'High': 'Sejahtera'
        };

        sdoh = {
            education: (regSdoh.education && eduMap[regSdoh.education]) || (age < 6 ? 'Belum Sekolah' : 'SD'),
            housing: (regSdoh.housing && housingMap[regSdoh.housing]) || 'Rumah Semi-Permanen',
            occupation: resident.occupation || 'Tidak Bekerja',
            smokingStatus: regSdoh.smoking !== undefined ? (regSdoh.smoking ? 'Perokok Aktif' : 'Tidak Merokok') : 'Tidak Merokok',
            economicStatus: (regSdoh.economy && econMap[regSdoh.economy]) || 'Menengah',
            hasBPJS: residentFamily?.indicators?.jkn !== false,
            isResident: true,
            familyId: resident.familyId,
            villagerId: resident.id,
            familyName: residentFamily?.surname || 'Unknown',
            riskFactors: residentRiskFactors
        };
    } else {
        sdoh = generateSocialDeterminants(age);
        sdoh.isResident = false;
        sdoh.patientType = rng.chance(0.5) ? 'tourist' : 'worker';
    }

    if (anthropometrics.bmiRiskFactors.length > 0) {
        sdoh.riskFactorsSummary = [
            ...(sdoh.riskFactorsSummary || []),
            ...anthropometrics.bmiRiskFactors
        ];
    }

    const demographicProfile = getCaseDemographicProfile(disease);
    const complaintText = generateComplaintText(
        disease,
        seedKey(patientSeed, 'complaint'),
        { demographicProfile }
    );

    let informant = null;
    const explicitInformant = demographicProfile?.informant;
    const requiresInformant = Boolean(explicitInformant?.required) || age <= 7;
    if (requiresInformant) {
        if (isResident && population && population.villagers) {
            const familyMembers = population.villagers.filter(v =>
                v.familyId === resident.familyId && (!v.status || v.status === 'alive') && v.id !== resident.id && v.age >= 18
            );
            const mother = familyMembers.find(m => m.gender === 'P');
            const father = familyMembers.find(m => m.gender === 'L');
            const parentMember = mother || father || familyMembers[0];

            if (parentMember) {
                const relation = explicitInformant?.relation
                    || (parentMember.gender === 'P' ? 'Ibu' : 'Ayah');
                informant = {
                    required: true,
                    name: parentMember.fullName || parentMember.name || 'Ibu',
                    relation,
                    age: parentMember.age || 30,
                    villagerId: parentMember.id,
                    reason: explicitInformant?.reason || 'pediatric',
                };
            }
        }

        if (!informant) {
            const relation = explicitInformant?.relation || (rng.chance(0.7) ? 'Ibu' : 'Ayah');
            const inferredGender = relation === 'Ayah' ? 'L' : relation === 'Ibu' ? 'P' : (rng.chance(0.5) ? 'L' : 'P');
            const parentFirstName = pickDeterministic(
                inferredGender === 'P' ? NAMES_FEMALE : NAMES_MALE,
                seedKey(patientSeed, 'informant-name', inferredGender)
            );
            informant = {
                required: true,
                name: `${parentFirstName} ${name.split(' ').pop()}`,
                relation,
                age: 25 + rng.int(15),
                reason: explicitInformant?.reason || 'pediatric',
            };
        }
    }

    const commStyles = ['verbose', 'concise', 'vague'];
    const demeanors = ['Stoic', 'Anxious', 'Dramatic', 'Normal'];
    const communicationStyle = isResident && resident.communicationStyle
        ? resident.communicationStyle
        : pickDeterministic(commStyles, seedKey(patientSeed, 'communication-style'));
    const demeanor = pickDeterministic(demeanors, seedKey(patientSeed, 'demeanor'));

    let finalRisk = disease?.risk || 'low';
    if (isResident) {
        const familyCoords = spatialContext?.familyCoords?.[resident.familyId];
        let totalSeverityBoost = 0;

        if (familyCoords) {
            const serviceAnchors = Array.isArray(spatialContext?.serviceAnchors) && spatialContext.serviceAnchors.length > 0
                ? spatialContext.serviceAnchors
                : DEFAULT_SERVICE_ANCHORS;
            const { distance } = getEffectiveServiceDistance(familyCoords, serviceAnchors);
            const safeDistance = Number.isFinite(distance) ? distance : 0;
            totalSeverityBoost += calculateDistanceDecayModifiers(safeDistance, false).severityBoost || 0;

            if (spatialContext?.bridgeState?.status === 'putus' && familyCoords.x >= 120) {
                totalSeverityBoost += Math.max(0, spatialContext.bridgeState.severityBoost || 0);
            }
        }

        if (totalSeverityBoost > 0) {
            const riskLadder = ['low', 'medium', 'high'];
            const currentIndex = riskLadder.indexOf(finalRisk);
            if (currentIndex !== -1) {
                const newIndex = Math.min(riskLadder.length - 1, currentIndex + totalSeverityBoost);
                finalRisk = riskLadder[newIndex];
            }
        }
    }
    
    if (finalRisk !== (disease?.risk || 'low')) {
        disease = { ...disease, risk: finalRisk };
    }

    return normalizePatientOutput({
        id: randomIdFromSeed('patient', seedKey(patientSeed, 'id'), 9),
        name,
        age,
        gender,
        anthropometrics,
        complaint: complaintText,
        communicationStyle,
        demeanor,
        isEmergency: false,
        triageLevel: null,
        informant,
        medicalData: {
            symptoms: disease?.symptoms || [],
            vitals: disease?.vitals || {},
            physicalExamFindings: disease?.physicalExamFindings || {},
            labs: disease?.labs || {},
            icd10: disease?.icd10 || 'R69',
            trueDiagnosisCode: disease?.icd10 || 'R69',
            diagnosisName: disease?.diagnosis || 'Unknown',
            anamnesisQuestions: disease?.anamnesisQuestions || null,
            essentialQuestions: disease?.essentialQuestions || [],
            anamnesis: disease?.anamnesis || [],
            nonReferrable: disease?.nonReferrable || false,
            referralExceptions: disease?.referralExceptions || [],
            correctTreatment: disease?.correctTreatment || [],
            correctProcedures: disease?.correctProcedures || [],
            requiredEducation: disease?.requiredEducation || [],
            relevantLabs: disease?.relevantLabs || []
        },
        social: sdoh,
        status: 'waiting',
        joinedAt: currentTime || 480,
        patience: 100,
        hidden: {
            diseaseId: disease?.id || 'unknown',
            requiredAction: disease?.risk === 'emergency' || disease?.referralRequired ? 'refer' : 'treat',
            skdi: disease?.skdi || '4A',
            risk: disease?.risk || 'low',
            differentials: disease?.differentialDiagnosis || [],
            clue: disease?.clue || '',
            correctTreatment: disease?.correctTreatment || [],
            correctProcedures: disease?.correctProcedures || [],
            requiredEducation: disease?.requiredEducation || [],
            relevantLabs: disease?.relevantLabs || [],
            isResident,
            villagerId: isResident ? resident.id : null,
            familyId: isResident ? resident.familyId : null,
            houseId: isResident ? resident.houseId : null,
            allergies: residentProfile?.allergies || [],
            currentMedications: residentProfile?.medications || [],
            conditions: residentProfile?.conditions || [],
            familyMedicalHistory: familyMedHistory || null,
            spatialRisk: spatialRiskDebug || null
        }
    });
}

/**
 * Parse vitals from emergency case data into structured numeric object.
 * Emergency case schemas store vitals as a string in physicalExamFindings.vitals
 * e.g. "TD 90/60, N 50x, RR 30x, S 36.0°C, SpO2 88%, GDS 45"
 * → { bp: '90/60', hr: 50, rr: 30, temp: 36.0, spo2: 88, gds: 45 }
 */
function parseVitalsToStruct(disease) {
    // If disease.vitals is already a structured object with numeric values, use it
    if (disease.vitals && typeof disease.vitals === 'object' && typeof disease.vitals.hr === 'number') {
        return disease.vitals;
    }

    const raw = disease.physicalExamFindings?.vitals;
    if (!raw || typeof raw !== 'string') return {};

    const result = {};

    // TD (Tekanan Darah) → bp: "120/80"
    const bpMatch = raw.match(/TD\s*(\d+\/\d+)/i);
    if (bpMatch) result.bp = bpMatch[1];

    // N / Nadi → hr: 88
    const hrMatch = raw.match(/N\s*(\d+)/i);
    if (hrMatch) result.hr = parseInt(hrMatch[1]);

    // RR → rr: 18
    const rrMatch = raw.match(/RR\s*(\d+)/i);
    if (rrMatch) result.rr = parseInt(rrMatch[1]);

    // S / Suhu → temp: 36.6
    const tempMatch = raw.match(/S\s*(\d+\.?\d*)\s*(?:°|Â°)?C/i);
    if (tempMatch) result.temp = parseFloat(tempMatch[1]);

    // SpO2 → spo2: 98
    const spo2Match = raw.match(/SpO2\s*(\d+)/i);
    if (spo2Match) result.spo2 = parseInt(spo2Match[1]);

    // GDS → gds: 90
    const gdsMatch = raw.match(/GDS\s*(\d+)/i);
    if (gdsMatch) result.gds = parseInt(gdsMatch[1]);

    return result;
}
/**
 * Generate emergency patient for IGD
 * @param {number} currentTime - Current time in minutes
 * @param {object} facilities - Active facilities levels
 * @param {object} population - Optional VillageRegistry population data
 */
export function generateEmergencyPatient(currentTime, facilities = {}, population = null, seedHint = 'default') {
    if (facilities.igd === 0) return null;

    const emergencySeed = seedKey(
        'emergency-patient',
        seedHint,
        currentTime,
        population?.villagers?.length || 0,
        facilities.igd || 0
    );
    const rng = createDeterministicSequence(emergencySeed);
    const disease = getRandomEmergencyCase(seedKey(emergencySeed, 'case'));

    let isResident = false;
    let resident = null;
    let residentFamily = null;
    let gender;
    let name;
    let age;

    if (population && population.villagers && population.villagers.length > 0 && rng.chance(0.5)) {
        const living = population.villagers.filter(v => !v.status || v.status === 'alive');
        const compatibleResidents = living.filter((villager) => (
            isCaseCompatibleWithDemographics(disease, villager.age, villager.gender)
        ));
        if (compatibleResidents.length > 0) {
            resident = pickDeterministic(compatibleResidents, seedKey(emergencySeed, 'resident'));
            residentFamily = population.families?.find(f => f.id === resident.familyId);
            isResident = true;
            gender = resident.gender;
            name = resident.fullName;
            age = resident.age;
        }
    }

    if (!isResident) {
        const demographics = sampleDemographicsForCase(disease, rng);
        gender = demographics.gender;
        age = demographics.age;
        name = buildSyntheticName(age, gender, emergencySeed);
    }

    const anthropometrics = generateAnthropometrics(age, gender, seedKey(emergencySeed, 'anthropometrics'));
    const sdoh = generateSocialDeterminants(age);
    if (isResident) {
        sdoh.isResident = true;
        sdoh.familyId = resident.familyId;
        sdoh.villagerId = resident.id;
        sdoh.familyName = residentFamily?.surname || 'Unknown';
    }

    const complaintText = pickDeterministic(disease.anamnesis || [], seedKey(emergencySeed, 'complaint')) || disease.diagnosis;

    return normalizePatientOutput({
        id: randomIdFromSeed('igd', seedKey(emergencySeed, 'id'), 9),
        name,
        age,
        gender,
        anthropometrics,
        complaint: complaintText,
        isEmergency: true,
        triageLevel: disease.triageLevel,
        esiLevel: disease.esiLevel,
        triageAssigned: null,
        deterioration: 0,
        deteriorationRate: disease.deteriorationRate || 0,
        arrivalTime: currentTime || 480,
        medicalData: {
            symptoms: disease.symptoms,
            vitals: parseVitalsToStruct(disease),
            physicalExamFindings: disease.physicalExamFindings,
            labs: disease.labs,
            trueDiagnosisCode: disease.icd10,
            diagnosisName: disease.diagnosis,
            anamnesisQuestions: disease.anamnesisQuestions || null,
            essentialQuestions: disease.essentialQuestions || [],
            anamnesis: disease.anamnesis || []
        },
        social: sdoh,
        status: 'igd_waiting',
        joinedAt: currentTime || 480,
        patience: 100,
        hidden: {
            diseaseId: disease.id,
            diagnosis: disease.diagnosis,
            category: disease.category,
            icd10: disease.icd10,
            differentials: disease.differentialDiagnosis || [],
            requiredAction: disease.referralRequired ? 'refer' : 'stabilize',
            skdi: disease.skdi,
            risk: disease.risk,
            correctTreatment: disease.correctTreatment || [],
            correctProcedures: disease.correctProcedures || [],
            immediateActions: disease.immediateActions || [],
            stabilizationChecklist: disease.stabilizationChecklist || [],
            requiredEducation: disease.requiredEducation || [],
            clue: disease.clue,
            relevantLabs: disease.relevantLabs || [],
            referralRequired: disease.referralRequired,
            isResident,
            villagerId: isResident ? resident.id : null,
            familyId: isResident ? resident.familyId : null,
            houseId: isResident ? resident.houseId : null
        }
    });
}

/**
 * Generate a patient object for a scheduled Prolanis visit
 */
export function generateProlanisVisitPatient(rosterMember, currentDay, seedHint = 'default') {
    const isDM = rosterMember.prolanisData.diseaseType === 'dm_type2';
    // Use last known parameters
    const params = rosterMember.prolanisData.parameters;
    const rng = createDeterministicSequence(
        seedKey('prolanis-visit-patient', rosterMember.id || rosterMember.name, currentDay, seedHint)
    );

    // Construct vitals string based on disease type + random noise
    const sys = isDM ? 120 : (params.systolic || 140);
    const dia = isDM ? 80 : (params.diastolic || 90);

    return normalizePatientOutput({
        ...rosterMember, // Base info (name, age, gender, social, anthropometrics)
        id: `${rosterMember.id}_visit_${currentDay}`,
        originalId: rosterMember.id,
        isProlanis: true,
        isEmergency: false,
        status: 'waiting',
        patience: 100,
        triageLevel: null,
        joinedAt: 480 + rng.int(60), // 08:00 - 09:00
        complaint: "Kontrol rutin Prolanis bulan ini.",
        medicalData: {
            diagnosisName: isDM ? 'Diabetes Mellitus Tipe 2' : 'Hipertensi',
            isChronic: true,
            symptoms: ["Pasien datang untuk kontrol rutin penyakit kronis"],
            vitals: {
                bp: `${Math.round(sys)}/${Math.round(dia)}`,
                hr: 60 + rng.int(40),
                temp: 36.5,
                rr: 16 + rng.int(4)
            },
            trueDiagnosisCode: isDM ? 'E11' : 'I10',
            nonReferrable: true // Prolanis cases should be managed at FKTP
        },
        hidden: {
            requiredAction: 'treat',
            risk: 'chronic',
            diseaseId: isDM ? 'dm_type2' : 'hypertension',
            differentials: [],
            skdi: '4A',
            clue: '',
            requiredEducation: [],
            correctTreatment: [],
            isResident: true,
            villagerId: rosterMember.villagerId || rosterMember.id,
            familyId: rosterMember.familyId || null,
            houseId: rosterMember.houseId || null
        }
    });
}

/**
 * Generate a follow-up patient from a ConsequenceEngine entry.
 * These are patients who return days after discharge with improved or worsened conditions.
 *
 * @param {Object} consequence - Entry from consequenceQueue (produced by evaluateConsequences)
 * @param {number} currentTime - Current time in minutes
 * @returns {Object} Patient object ready for the game queue
 */
export function generateFollowupPatient(consequence, currentTime, seedHint = 'default') {
    const { originalCase = {}, condition, severity, narrative, newSymptoms = [], guidelineRef } = consequence;
    // Codex Fix: guard against missing originalCase (e.g. ukp_bridge entries)
    const { patientName = 'Pasien', age = 30, gender = 'L', originalDiagnosis, category } = originalCase;
    const followupSeed = seedKey('followup-patient', consequence.id, currentTime, seedHint, patientName, severity, category);

    // Build symptoms based on condition
    const symptoms = condition === 'improved'
        ? ['Pasien merasa sudah membaik', 'Datang untuk kontrol']
        : [...(newSymptoms || []), narrative];

    // Vitals: worsened/complication get abnormal vitals
    const vitals = {};
    if (condition === 'worsened' || condition === 'complication') {
        vitals.bp = severity === 'critical' ? '180/110' : '150/95';
        vitals.hr = severity === 'critical' ? 110 : 90;
        vitals.temp = 36.8;
        vitals.rr = severity === 'critical' ? 24 : 18;
    } else {
        vitals.bp = '120/80';
        vitals.hr = 78;
        vitals.temp = 36.5;
        vitals.rr = 16;
    }

    // Complaint text from the narrative
    const complaint = condition === 'improved'
        ? `Dok, saya ${patientName}. Saya datang kontrol, ${narrative}.`
        : `Dok, saya ${patientName}. ${narrative}.`;

    return normalizePatientOutput({
        id: randomIdFromSeed('followup', followupSeed),
        name: patientName,
        age: age,
        gender: gender,
        anthropometrics: generateAnthropometrics(age, gender, seedKey(followupSeed, 'anthropometrics')),
        complaint,
        isEmergency: false,
        isFollowup: true,
        followupData: {
            consequenceId: consequence.id,
            ruleId: consequence.ruleId,
            condition,
            severity,
            narrative,
            guidelineRef,
            originalDiagnosis,
            xpImpact: consequence.xpImpact,
            reputationImpact: consequence.reputationImpact,
            createdDay: consequence.createdDay,
            returnDay: consequence.returnDay,
        },
        triageLevel: null,
        informant: null,
        medicalData: {
            symptoms,
            vitals,
            physicalExamFindings: {},
            labs: {},
            trueDiagnosisCode: originalDiagnosis || 'R69',
            diagnosisName: originalDiagnosis || 'Follow-up',
            anamnesisQuestions: null,
            essentialQuestions: [],
            anamnesis: [complaint],
            nonReferrable: condition === 'improved',
            correctTreatment: [],
            correctProcedures: [],
            requiredEducation: [],
            relevantLabs: [],
        },
        social: {
            isResident: false,
            hasBPJS: true,
        },
        status: 'waiting',
        joinedAt: currentTime || 480,
        patience: 100,
        hidden: {
            diseaseId: `followup_${consequence.ruleId}`,
            requiredAction: condition === 'improved' ? 'treat' : (severity === 'critical' ? 'refer' : 'treat'),
            skdi: condition === 'improved' ? '4A' : '3B',
            risk: severity === 'critical' ? 'high' : (severity === 'medium' ? 'medium' : 'low'),
            differentials: [],
            clue: guidelineRef?.text || guidelineRef?.guideline || '',
            isResident: true,
            villagerId: null,
            familyId: null,
            houseId: null,
            isFollowup: true,
        }
    });
}

// ═══════════════════════════════════════════════════════════════
// UKM → UKP BRIDGE PATIENT GENERATOR
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a clinical patient from a resolved UKM behavior change case.
 * Called when a BC case resolves with ukpTriggered=true after the delay period.
 *
 * @param {Object} bridgeData
 * @param {string} bridgeData.ukpDiseaseId - Disease ID from scenario.ukpBridge.failOutcomes
 * @param {string} bridgeData.familyId - Family that was being treated (e.g. 'kk_08')
 * @param {string} bridgeData.scenarioId - BC scenario that triggered this
 * @param {number} currentTime - Current game time in minutes (for queue ordering)
 * @param {Array} population - Village families array from VillageRegistry
 * @returns {Object|null} Patient object ready for queue, or null if data missing
 */
export function generateUKPBridgePatient(bridgeData, currentTime = 480, population = [], seedHint = 'default') {
    const { ukpDiseaseId, familyId, scenarioId } = bridgeData;
    if (!ukpDiseaseId || !familyId) return null;
    const bridgeSeed = seedKey('ukp-bridge-patient', seedHint, ukpDiseaseId, familyId, scenarioId, currentTime);

    // Find a family member from the village
    const family = population.find(f => f.id === familyId);
    if (!family || !family.members?.length) return null;

    // Pick a random adult member (not a child if possible)
    // Get the clinical case from CaseLibrary
    const disease = resolveCaseByCondition(ukpDiseaseId);
    if (!disease) return null;
    const member = pickCompatibleFamilyMember(family.members, disease, bridgeSeed);
    const seededDemographics = sampleDemographicsForCase(
        disease,
        createDeterministicSequence(seedKey(bridgeSeed, 'synthetic-demographics'))
    );
    const gender = member?.gender || seededDemographics.gender;
    const age = member?.age ?? seededDemographics.age;
    const fullName = member
        ? `${member.firstName || 'Warga'} ${family.surname || ''}`.trim()
        : buildSyntheticName(age, gender, bridgeSeed, family.surname);

    const facility = CATEGORY_FACILITY_MAP[disease.category] || 'poli_umum';

    return normalizePatientOutput({
        id: randomIdFromSeed('patient_bcbridge', bridgeSeed),
        name: fullName,
        age,
        gender,
        // DeepThink Fix: add missing root attrs
        anthropometrics: generateAnthropometrics(age, gender, seedKey(bridgeSeed, 'anthropometrics')),
        isEmergency: false,
        triageLevel: null,
        complaint: generateComplaintText(disease, seedKey(bridgeSeed, 'complaint'), {
            demographicProfile: getCaseDemographicProfile(disease)
        }),
        narrative: `(Warga ini datang karena masalah kesehatan akibat perilaku yang belum berubah) ${disease.narrative || ''}`,
        facility,
        // DeepThink Fix: medical: → medicalData: (Data Contract)
        medicalData: {
            vitals: disease.vitals || {},
            // DeepThink Fix: physicalExam → physicalExamFindings
            physicalExamFindings: disease.physicalExamFindings || disease.physicalExam || {},
            labs: {},
            trueDiagnosisCode: disease.icd10 || disease.icdCode || disease.id,
            diagnosisName: disease.diagnosis || disease.diagnosisName || disease.condition || ukpDiseaseId,
            anamnesisQuestions: disease.anamnesisQuestions || null,
            essentialQuestions: disease.essentialQuestions || [],
            anamnesis: disease.anamnesis || [disease.chiefComplaint || ''],
            nonReferrable: (disease.skdi || disease.skdiLevel) === '4A',
            correctTreatment: disease.correctTreatment || [],
            correctProcedures: disease.correctProcedures || [],
            requiredEducation: disease.requiredEducation || [],
            relevantLabs: disease.relevantLabs || [],
        },
        social: {
            isResident: true,
            hasBPJS: true,
        },
        status: 'waiting',
        joinedAt: currentTime,
        patience: 80,
        hidden: {
            diseaseId: disease.id || ukpDiseaseId,
            requiredAction: (disease.skdi || disease.skdiLevel) === '4A' ? 'treat' : 'refer',
            skdi: disease.skdi || disease.skdiLevel || '4A',
            risk: disease.risk || 'medium',
            ...getClinicalHiddenContract(disease),
            // DeepThink Fix: differentials → differentialDiagnosis
            differentials: disease.differentialDiagnosis || disease.differentials || [],
            clue: disease.clue || disease.teachingPoint || '',
            isResident: true,
            villagerId: member?.id || null,
            familyId: familyId,
            houseId: family.houseId,
            isBCBridge: true,
            bcScenarioId: scenarioId,
        }
    });
}

/**
 * Generate a cohort of generic patients for a specific disease.
 * Useful for outbreaks or failed IKM interventions to flood the UKP queue.
 */
export function generateGenericPatients(diseaseId, amount, targetClinic, currentTime = 480, seedHint = 'default') {
    const patients = [];
    const genericSeed = seedKey('generic-patients', seedHint, diseaseId, amount, targetClinic, currentTime);
    const disease = resolveCaseByCondition(diseaseId)
        || pickDeterministic(
            CASE_LIBRARY.filter(caseItem => caseItem.category === 'Respiratory'),
            seedKey(genericSeed, 'fallback-case')
        )
        || pickDeterministic(CASE_LIBRARY, seedKey(genericSeed, 'fallback-any'));
    if (!disease) return patients;

    for (let i = 0; i < amount; i++) {
        const patientSeed = seedKey(genericSeed, i);
        const rng = createDeterministicSequence(patientSeed);
        const demographics = sampleDemographicsForCase(disease, rng);
        const gender = demographics.gender;
        const age = demographics.age;
        const fullName = buildSyntheticName(age, gender, patientSeed);

        const facility = targetClinic || CATEGORY_FACILITY_MAP[disease.category] || 'poli_umum';

        patients.push(normalizePatientOutput({
            id: randomIdFromSeed(`patient_generic_${i}`, patientSeed),
            name: fullName,
            age,
            gender,
            anthropometrics: generateAnthropometrics(age, gender, seedKey(patientSeed, 'anthropometrics')),
            complaint: generateComplaintText(disease, seedKey(patientSeed, 'complaint'), {
                demographicProfile: getCaseDemographicProfile(disease)
            }),
            narrative: `(Warga ini datang karena kejadian komunitas) ${disease.narrative || ''}`,
            facility,
            medicalData: {
                vitals: disease.vitals || {},
                physicalExamFindings: disease.physicalExamFindings || disease.physicalExam || {},
                labs: {},
                trueDiagnosisCode: disease.icd10 || disease.icdCode || disease.id,
                diagnosisName: disease.diagnosis || disease.diagnosisName || disease.condition || diseaseId,
                anamnesisQuestions: disease.anamnesisQuestions || null,
                essentialQuestions: disease.essentialQuestions || [],
                anamnesis: disease.anamnesis || [disease.chiefComplaint || ''],
                nonReferrable: (disease.skdi || disease.skdiLevel) === '4A',
                correctTreatment: disease.correctTreatment || [],
                correctProcedures: disease.correctProcedures || [],
                requiredEducation: disease.requiredEducation || [],
                relevantLabs: disease.relevantLabs || [],
            },
            social: { isResident: false, hasBPJS: true },
            status: 'waiting',
            joinedAt: currentTime + (i * 15),
            patience: 80,
            hidden: {
                diseaseId: disease.id || diseaseId,
                requiredAction: (disease.skdi || disease.skdiLevel) === '4A' ? 'treat' : 'refer',
                skdi: disease.skdi || disease.skdiLevel || '4A',
                risk: 'medium',
                ...getClinicalHiddenContract(disease),
                // DeepThink Fix: differentials → differentialDiagnosis
                differentials: disease.differentialDiagnosis || disease.differentials || [],
                clue: disease.clue || disease.teachingPoint || '',
                isResident: false,
            }
        }));
    }
    return patients;
}

