/**
 * @reflection
 * [IDENTITY]: PatientGenerator
 * [PURPOSE]: Game engine module providing: generatePatient, generateEmergencyPatient, generateProlanisVisitPatient.
 * [STATE]: Experimental
 * [ANCHOR]: generatePatient
 * [DEPENDS_ON]: CaseLibrary, EmergencyCases, SocialDeterminants, VillageRegistry, CalendarEventDB
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */
import { getRandomCase, getCaseByCondition } from '../content/cases/CaseLibrary.js';
import { getRandomEmergencyCase } from './EmergencyCases.js';
import { generateSocialDeterminants } from '../utils/SocialDeterminants.js';
import { calculateRiskFactors, INDIVIDUAL_PROFILES, FAMILY_MEDICAL_HISTORY } from '../domains/village/VillageRegistry.js';
import { getDateFromDay } from '../data/CalendarEventDB.js';

// Anchor family IDs - these have curated profiles and should appear more often
const ANCHOR_FAMILY_IDS = ['kk_02', 'kk_04', 'kk_08', 'kk_15', 'kk_22', 'kk_23', 'kk_24', 'kk_25'];

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
    'Dental': 'poli_gigi',
    'Maternal': 'poli_kia_kb',
    'Pediatrics': 'poli_kia_kb',
    'Reproductive': 'poli_kia_kb'
};

// Condition to case mapping for profile-based generation
// All IDs must exactly match a CASE_LIBRARY entry id
const CONDITION_CASE_MAPPING = {
    'hypertension_stage1': ['hypertension_primary', 'tension_headache'],
    'hypertension_stage2': ['hypertension_primary', 'hypertensive_crisis', 'tension_headache'],
    'diabetes_type2': ['dm_type2', 'dm_complicated'],
    'prediabetes': ['dm_type2', 'obesity'],
    'osteoarthritis': ['gout_arthritis', 'lbp_mechanical'],
    'osteoporosis': ['lbp_mechanical'],
    'pregnancy_normal': ['normal_pregnancy', 'anemia_deficiency'],
    'recurrent_ari': ['ispa_common', 'bronchitis_acute', 'acute_pharyngitis'],
    'stunting_risk': ['pem', 'acute_gastroenteritis', 'anemia_deficiency'],
    'stunting_moderate': ['pem', 'anemia_deficiency', 'ascariasis'],
    'anemia_mild': ['anemia_deficiency'],
    'tb_latent': ['tb_pulmonary'],
    'malnutrition_elderly': ['pem', 'anemia_deficiency'],
    'dementia_mild': ['insomnia'],
    'depression_mild': ['insomnia'],
    'chronic_back_pain': ['lbp_mechanical'],
    'scabies': ['scabies', 'contact_dermatitis'],
    'dental_caries': ['stomatitis_aftosa'],
    'helminthiasis': ['ascariasis', 'anemia_deficiency', 'acute_gastroenteritis'],
    'benign_prostatic_hyperplasia': ['uti_female'],
    'cataract': ['conjunctivitis_bacterial', 'hordeolum'],
    'knee_osteoarthritis': ['gout_arthritis', 'lbp_mechanical'],
    'underweight': ['pem', 'anemia_deficiency'],
    'post_stroke_hemiparesis': ['stroke_ischemic'],
    'heart_failure': ['heart_failure_chronic'],
    'ckd': ['ckd_stage3'],
    'copd': ['copd_stable'],
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

const NAMES_MALE = ['Budi', 'Agus', 'Joko', 'Andi', 'Dedi', 'Eko', 'Bambang', 'Hendra', 'Iwan', 'Rizky'];
const NAMES_FEMALE = ['Siti', 'Dewi', 'Sri', 'Rina', 'Ani', 'Wati', 'Yuni', 'Lina', 'Mega', 'Fitri'];
const SURNAMES = ['Santoso', 'Widodo', 'Kusuma', 'Putri', 'Wibowo', 'Lestari', 'Hidayat', 'Setiawan', 'Pratama', 'Nugroho'];

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
function generateAnthropometrics(age, gender) {
    let height, weight;

    if (age < 5) {
        // Toddler: height 75-110cm
        height = 75 + (age * 7) + Math.floor(Math.random() * 10);
        weight = 10 + (age * 2) + Math.floor(Math.random() * 4);
    } else if (age < 12) {
        // Child: height 100-150cm
        height = 100 + ((age - 5) * 5) + Math.floor(Math.random() * 15);
        weight = 18 + ((age - 5) * 3) + Math.floor(Math.random() * 8);
    } else if (age < 18) {
        // Adolescent
        if (gender === 'L') {
            height = 145 + ((age - 12) * 5) + Math.floor(Math.random() * 15);
            weight = 40 + ((age - 12) * 4) + Math.floor(Math.random() * 15);
        } else {
            height = 140 + ((age - 12) * 3) + Math.floor(Math.random() * 12);
            weight = 38 + ((age - 12) * 3) + Math.floor(Math.random() * 12);
        }
    } else {
        // Adult
        if (gender === 'L') {
            height = 155 + Math.floor(Math.random() * 25); // 155-180cm
            // Weight with realistic distribution including obesity
            const bmiTarget = 18 + Math.random() * 15; // BMI 18-33
            weight = Math.round(bmiTarget * ((height / 100) ** 2));
        } else {
            height = 145 + Math.floor(Math.random() * 20); // 145-165cm
            const bmiTarget = 17 + Math.random() * 14; // BMI 17-31
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

function generateComplaintText(disease) {
    // Safety check - if disease is null/undefined, return generic complaint
    if (!disease) {
        return "Tidak enak badan dok...";
    }

    // Use the disease's anamnesis entries directly — they should be complete, natural sentences
    // Do NOT append random greeting or duration fragments
    const anamnesis = disease.anamnesis || [];
    if (anamnesis.length > 0) {
        return anamnesis[Math.floor(Math.random() * anamnesis.length)];
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
 */
export function generatePatient(currentTime, population, gameDay = 1, facilities = {}, _skills = {}) {
    let isResident = false;
    let resident = null;
    let residentFamily = null;
    let residentProfile = null;
    let familyMedHistory = null;

    // 70% chance to pick a resident if population is available
    if (population && population.villagers && population.villagers.length > 0 && Math.random() < 0.7) {
        const living = population.villagers.filter(v => v.status === 'alive');

        if (living.length > 0) {
            // 40% of resident cases: prioritize anchor family members with profiles
            const anchorMembers = living.filter(v => ANCHOR_FAMILY_IDS.includes(v.familyId));

            if (anchorMembers.length > 0 && Math.random() < 0.4) {
                resident = anchorMembers[Math.floor(Math.random() * anchorMembers.length)];
            } else {
                resident = living[Math.floor(Math.random() * living.length)];
            }

            residentFamily = population.families?.find(f => f.id === resident.familyId);
            residentProfile = INDIVIDUAL_PROFILES[resident.id] || null;
            familyMedHistory = FAMILY_MEDICAL_HISTORY[resident.familyId] || null;
            isResident = true;
        }
    }

    // Determine disease based on profile OR risk factors
    let disease;

    // Helper to get a random case filtered by active facilities
    const getRandomFilteredCase = () => {
        let attempts = 0;
        let c;
        while (attempts < 20) {
            c = getRandomCase();
            const requiredFacility = CATEGORY_FACILITY_MAP[c.category] || 'poli_umum';
            if ((facilities[requiredFacility] || 0) > 0) return c;
            attempts++;
        }
        return getRandomCase(); // Fallback if no matching facility found in 20 tries
    };

    const getFilteredCaseByCondition = (caseId) => {
        const c = getCaseByCondition(caseId);
        if (!c) return null;
        const requiredFacility = CATEGORY_FACILITY_MAP[c.category] || 'poli_umum';
        if ((facilities[requiredFacility] || 0) > 0) return c;
        return null; // Don't generate if facility not built
    };

    // Recalculate risks using fresh data if available
    if (isResident && residentFamily && residentFamily.indicators) {
        resident.riskFactors = calculateRiskFactors(residentFamily.indicators, resident, resident.sdoh || {}, residentProfile);
    }

    // === IKS-BASED DISEASE PREVENTION ===
    // Healthier families (high IKS) are more likely to come for checkups vs acute illness
    const familyIKS = residentFamily?.iksScore || 0.5;

    // Calculate jentik/PSN coverage for dengue prevention
    let jentikCoverage = 0.5; // Default
    if (population && population.families) {
        const jentikCount = population.families.filter(f => f.indicators?.jentik === true).length;
        jentikCoverage = jentikCount / population.families.length;
    }

    // PRIORITY 0: Storyline-based disease selection (Harvest Moon style)
    // If a resident has a specific story event, prioritize it.
    if (residentProfile && residentProfile.storyline && residentProfile.storyline.triggerEvent) {
        // 40% chance to trigger their specific story event if it's their "day" to be sick
        if (Math.random() < 0.4) {
            const storyCase = getFilteredCaseByCondition(residentProfile.storyline.triggerEvent);
            if (storyCase) {
                disease = storyCase;
                // Append story background to the complaint for more context
                disease = {
                    ...disease,
                    anamnesis: [
                        `(${residentProfile.storyline.background}) ${disease.anamnesis[0]}`
                    ]
                };
            }
        }
    }

    // PRIORITY 1: Profile-based disease selection (60% chance for profiled residents)
    if (!disease && residentProfile && residentProfile.conditions && residentProfile.conditions.length > 0 && Math.random() < 0.6) {
        // Pick a random condition from their profile
        const condition = residentProfile.conditions[Math.floor(Math.random() * residentProfile.conditions.length)];
        const possibleCases = CONDITION_CASE_MAPPING[condition] || [];

        if (possibleCases.length > 0) {
            const caseId = possibleCases[Math.floor(Math.random() * possibleCases.length)];
            disease = getFilteredCaseByCondition(caseId);
        }

        // Fallback if no matching or allowed case found
        if (!disease) {
            disease = getRandomFilteredCase();
        }
    }
    // PRIORITY 2: Risk factor-based selection
    else if (isResident && resident.riskFactors && resident.riskFactors.length > 0) {
        const risks = resident.riskFactors;

        const riskDiseaseMappings = {
            'poor_sanitation': ['acute_gastroenteritis', 'typhoid_fever', 'ascariasis'],
            'unsafe_water': ['acute_gastroenteritis', 'hepatitis_a'],
            'smoke_exposure': ['ispa_common', 'bronchitis_acute', 'asthma_bronchiale'],
            'passive_smoker': ['ispa_common', 'bronchitis_acute', 'pharyngitis_acute'],
            'diabetes_risk': ['dm_type2'],
            'hypertension_risk': ['hypertension_primary', 'tension_headache'],
            'obesity_risk': ['hypertension_primary', 'dm_type2', 'gout_arthritis'],
            'poor_housing': ['ispa_common', 'tb_pulmonary', 'scabies'],
            'high_infection_risk': ['acute_gastroenteritis', 'typhoid_fever', 'dengue_fever'],
            'stunting': ['stunting_assessment', 'anemia_deficiency', 'acute_gastroenteritis'],
            'anemia': ['anemia_deficiency'],
            'tb_contact': ['tb_pulmonary', 'ispa_common'],
            'uninsured': null
        };

        let preferredDiseases = [];
        risks.forEach(r => {
            if (riskDiseaseMappings[r]) {
                preferredDiseases.push(...riskDiseaseMappings[r]);
            }
        });

        // 50% chance to match risk-based disease
        if (preferredDiseases.length > 0 && Math.random() < 0.5) {
            const caseId = preferredDiseases[Math.floor(Math.random() * preferredDiseases.length)];
            disease = getFilteredCaseByCondition(caseId);
        }

        if (!disease) {
            disease = getRandomFilteredCase();
        }
    } else {
        disease = getRandomFilteredCase();
    }

    // === APPLY SEASONAL MULTIPLIERS TO DISEASE PROBABILITY ===
    // If the current disease is NOT a seasonal one, there's a chance to swap it
    // FOR a seasonal disease (proportional to the multiplier). This correctly
    // increases the frequency of seasonal diseases during their peak months.
    const date = getDateFromDay(gameDay);
    const month = date.getMonth(); // 0-11 for Jan-Dec

    Object.values(SEASONAL_MULTIPLIERS).forEach(season => {
        if (season.months.includes(month)) {
            Object.entries(season.diseases).forEach(([seasonalDiseaseId, multiplier]) => {
                if (disease?.id === seasonalDiseaseId) {
                    // Disease already matches a seasonal one — always keep it
                    return;
                }

                // Chance to swap current disease for a seasonal one
                // multiplier 3.0 → 40% swap chance, 1.5 → 10%, 1.2 → 4%
                const swapChance = (multiplier - 1) * 0.2;
                if (Math.random() < swapChance) {
                    const seasonalCase = getFilteredCaseByCondition(seasonalDiseaseId);
                    if (seasonalCase) disease = seasonalCase;
                }
            });
        }
    });

    // Ensure disease is always set after all logic
    if (!disease) {
        disease = getRandomFilteredCase();
    }

    // === DISEASE PREVENTION FROM INTERVENTIONS ===

    // HIGH IKS FAMILIES: 25% chance to come for routine checkup instead of acute illness
    if (isResident && familyIKS >= 0.8 && Math.random() < 0.25) {
        // Try to get a general checkup case, fallback to current disease
        const checkupCase = getCaseByCondition('general_checkup');
        if (checkupCase) {
            disease = checkupCase;
        }
    }

    // PSN/JENTIK COVERAGE: Reduce dengue probability
    // If jentik coverage > 70% and disease is dengue, 50% chance to reroll
    if (disease?.id === 'dengue_fever' && jentikCoverage > 0.7) {
        if (Math.random() < 0.5) {
            // Dengue prevented! Reroll to different disease
            disease = getRandomFilteredCase();
            // Ensure we don't get dengue again
            while (disease?.id === 'dengue_fever') {
                disease = getRandomFilteredCase();
            }
        }
    }

    // Use resident info or generate random
    const gender = isResident ? resident.gender : (Math.random() > 0.5 ? 'L' : 'P');
    const name = isResident
        ? resident.fullName
        : `${(gender === 'L' ? NAMES_MALE : NAMES_FEMALE)[Math.floor(Math.random() * NAMES_MALE.length)]} ${SURNAMES[Math.floor(Math.random() * SURNAMES.length)]}`;

    // Age: use resident's age, or generate weighted random
    let age;
    if (isResident) {
        age = resident.age;
    } else {
        const ageRoll = Math.random();
        if (ageRoll < 0.15) age = Math.floor(Math.random() * 12) + 3;
        else if (ageRoll < 0.6) age = Math.floor(Math.random() * 30) + 20;
        else if (ageRoll < 0.85) age = Math.floor(Math.random() * 20) + 50;
        else age = Math.floor(Math.random() * 20) + 70;
    }

    // Generate anthropometrics 
    const anthropometrics = generateAnthropometrics(age, gender);

    // Generate social determinants — residents use registry data directly
    let sdoh;
    if (isResident) {
        const regSdoh = resident.sdoh || {};

        // Build SDOH directly from resident registry data
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
            riskFactors: resident.riskFactors
        };
    } else {
        sdoh = generateSocialDeterminants(age);
        sdoh.isResident = false;
        sdoh.patientType = Math.random() > 0.5 ? 'tourist' : 'worker';
    }

    // Add BMI risk factors
    if (anthropometrics.bmiRiskFactors.length > 0) {
        sdoh.riskFactorsSummary = [
            ...(sdoh.riskFactorsSummary || []),
            ...anthropometrics.bmiRiskFactors
        ];
    }

    const complaintText = generateComplaintText(disease);

    // === INFORMANT DATA FOR PEDIATRIC PATIENTS ===
    let informant = null;
    if (age <= 7) {
        // Child needs a parent/guardian as informant
        if (isResident && population && population.villagers) {
            // Find a parent in the same family
            const familyMembers = population.villagers.filter(v =>
                v.familyId === resident.familyId && v.status === 'alive' && v.id !== resident.id && v.age >= 18
            );
            // Prefer female parent (Ibu) first, then any adult
            const mother = familyMembers.find(m => m.gender === 'P');
            const father = familyMembers.find(m => m.gender === 'L');
            const parentMember = mother || father || familyMembers[0];

            if (parentMember) {
                informant = {
                    name: parentMember.fullName || parentMember.name || 'Ibu',
                    relation: parentMember.gender === 'P' ? 'Ibu' : 'Ayah',
                    age: parentMember.age || 30,
                    villagerId: parentMember.id
                };
            }
        }

        // Fallback for non-residents or if no parent found
        if (!informant) {
            const parentGender = Math.random() > 0.3 ? 'P' : 'L'; // 70% chance mother
            const parentName = parentGender === 'P'
                ? `${NAMES_FEMALE[Math.floor(Math.random() * NAMES_FEMALE.length)]} ${name.split(' ').pop()}`
                : `${NAMES_MALE[Math.floor(Math.random() * NAMES_MALE.length)]} ${name.split(' ').pop()}`;
            informant = {
                name: parentName,
                relation: parentGender === 'P' ? 'Ibu' : 'Ayah',
                age: 25 + Math.floor(Math.random() * 15) // 25-40
            };
        }
    }

    // === SPRINT 1: PERSONA DATA ===
    const commStyles = ['verbose', 'concise', 'vague'];
    const demeanors = ['Stoic', 'Anxious', 'Dramatic', 'Normal'];
    const communicationStyle = isResident && resident.communicationStyle ? resident.communicationStyle : commStyles[Math.floor(Math.random() * 3)];
    const demeanor = demeanors[Math.floor(Math.random() * 4)];

    return {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        age: age,
        gender: gender,
        anthropometrics: anthropometrics,
        complaint: complaintText,
        communicationStyle: communicationStyle,
        demeanor: demeanor,
        isEmergency: false,
        triageLevel: null,
        informant: informant,
        medicalData: {
            symptoms: disease?.symptoms || [],
            vitals: disease?.vitals || {},
            physicalExamFindings: disease?.physicalExamFindings || {},
            labs: disease?.labs || {},
            trueDiagnosisCode: disease?.icd10 || 'R69',
            diagnosisName: disease?.diagnosis || 'Unknown',
            anamnesisQuestions: disease?.anamnesisQuestions || null,
            essentialQuestions: disease?.essentialQuestions || [],
            anamnesis: disease?.anamnesis || [],
            nonReferrable: disease?.nonReferrable || false,
            referralExceptions: disease?.referralExceptions || [],
            // Validation Data moved from hidden for ValidationEngine parity
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
            // MAIA Suggestion Data — must be in hidden for UI to render suggestions
            correctTreatment: disease?.correctTreatment || [],
            correctProcedures: disease?.correctProcedures || [],
            requiredEducation: disease?.requiredEducation || [],
            relevantLabs: disease?.relevantLabs || [],
            isResident: isResident,
            villagerId: isResident ? resident.id : null,
            familyId: isResident ? resident.familyId : null,
            houseId: isResident ? resident.houseId : null,
            // Profile-based data for treatment validation
            allergies: residentProfile?.allergies || [],
            currentMedications: residentProfile?.medications || [],
            conditions: residentProfile?.conditions || [],
            familyMedicalHistory: familyMedHistory || null
        }
    };
}

/**
 * Generate emergency patient for IGD
 * @param {number} currentTime - Current time in minutes
 * @param {object} facilities - Active facilities levels
 * @param {object} population - Optional VillageRegistry population data
 */
export function generateEmergencyPatient(currentTime, facilities = {}, population = null) {
    // If IGD level 0, don't generate (or generate very basic ones? IGD usually level 1 min)
    if (facilities.igd === 0) return null;

    const disease = getRandomEmergencyCase();

    // 50% chance to use a village resident if population is available
    let isResident = false;
    let resident = null;
    let residentFamily = null;
    let gender, name, age;

    if (population && population.villagers && population.villagers.length > 0 && Math.random() < 0.5) {
        const living = population.villagers.filter(v => v.status === 'alive');
        if (living.length > 0) {
            // For pediatric cases, try to find a child
            if (disease.category === 'Pediatrics') {
                const children = living.filter(v => v.age <= 5);
                resident = children.length > 0
                    ? children[Math.floor(Math.random() * children.length)]
                    : living[Math.floor(Math.random() * living.length)];
            } else {
                resident = living[Math.floor(Math.random() * living.length)];
            }
            residentFamily = population.families?.find(f => f.id === resident.familyId);
            isResident = true;
            gender = resident.gender;
            name = resident.fullName;
            age = resident.age;
        }
    }

    if (!isResident) {
        gender = Math.random() > 0.5 ? 'L' : 'P';
        const names = gender === 'L' ? NAMES_MALE : NAMES_FEMALE;
        name = `${names[Math.floor(Math.random() * names.length)]} ${SURNAMES[Math.floor(Math.random() * SURNAMES.length)]}`;

        // Emergency patients: wider age range but weighted towards adults
        const ageRoll = Math.random();
        if (disease.category === 'Pediatrics') {
            age = Math.floor(Math.random() * 4) + 1; // 1-5 years for pediatric cases
        } else if (ageRoll < 0.1) {
            age = Math.floor(Math.random() * 10) + 5; // Child 5-14
        } else if (ageRoll < 0.5) {
            age = Math.floor(Math.random() * 25) + 25; // Adult 25-49
        } else if (ageRoll < 0.8) {
            age = Math.floor(Math.random() * 20) + 50; // Middle 50-69
        } else {
            age = Math.floor(Math.random() * 20) + 70; // Elderly 70-89
        }
    }

    // Generate anthropometrics
    const anthropometrics = generateAnthropometrics(age, gender);

    // Generate social determinants
    const sdoh = generateSocialDeterminants(age);
    if (isResident) {
        sdoh.isResident = true;
        sdoh.familyId = resident.familyId;
        sdoh.villagerId = resident.id;
        sdoh.familyName = residentFamily?.surname || 'Unknown';
    }

    const complaintText = disease.anamnesis[Math.floor(Math.random() * disease.anamnesis.length)];

    return {
        id: 'igd_' + Math.random().toString(36).substr(2, 9),
        name: name,
        age: age,
        gender: gender,
        anthropometrics: anthropometrics,
        complaint: complaintText,
        isEmergency: true,
        triageLevel: disease.triageLevel,
        esiLevel: disease.esiLevel,
        triageAssigned: null, // Player's triage assignment
        deterioration: 0, // Tracks how much condition has worsened
        deteriorationRate: disease.deteriorationRate || 0,
        arrivalTime: currentTime || 480,
        medicalData: {
            symptoms: disease.symptoms,
            vitals: disease.vitals,
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
            diagnosis: disease.diagnosis, // Fix: Add diagnosis for UI
            icd10: disease.icd10, // Fix: Add icd10 for UI
            differentialDiagnosis: disease.differentialDiagnosis || [], // Fix: Add differentials
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
            isResident: isResident,
            villagerId: isResident ? resident.id : null,
            familyId: isResident ? resident.familyId : null,
            houseId: isResident ? resident.houseId : null
        }
    };
}

/**
 * Generate a patient object for a scheduled Prolanis visit
 */
export function generateProlanisVisitPatient(rosterMember, currentDay) {
    const isDM = rosterMember.prolanisData.diseaseType === 'dm_type2';
    // Use last known parameters
    const params = rosterMember.prolanisData.parameters;

    // Construct vitals string based on disease type + random noise
    const sys = isDM ? 120 : (params.systolic || 140);
    const dia = isDM ? 80 : (params.diastolic || 90);

    return {
        ...rosterMember, // Base info (name, age, gender, social, anthropometrics)
        id: `${rosterMember.id}_visit_${currentDay}`,
        originalId: rosterMember.id,
        isProlanis: true,
        status: 'waiting',
        joinedAt: 480 + Math.floor(Math.random() * 60), // 08:00 - 09:00
        complaint: "Kontrol rutin Prolanis bulan ini.",
        medicalData: {
            diagnosisName: isDM ? 'Diabetes Mellitus Tipe 2' : 'Hipertensi',
            diagnosisCode: isDM ? 'E11' : 'I10',
            isChronic: true,
            symptoms: ["Pasien datang untuk kontrol rutin penyakit kronis"],
            vitals: {
                bp: `${Math.round(sys)}/${Math.round(dia)}`,
                hr: 60 + Math.floor(Math.random() * 40),
                temp: 36.5,
                rr: 16 + Math.floor(Math.random() * 4)
            },
            trueDiagnosisCode: isDM ? 'E11' : 'I10',
            nonReferrable: true // Prolanis cases should be managed at FKTP
        },
        hidden: {
            requiredAction: 'treat',
            risk: 'chronic',
            diseaseId: isDM ? 'dm_type2' : 'hypertension',
            requiredEducation: [],
            correctTreatment: []
        }
    };
}

/**
 * Generate a follow-up patient from a ConsequenceEngine entry.
 * These are patients who return days after discharge with improved or worsened conditions.
 *
 * @param {Object} consequence - Entry from consequenceQueue (produced by evaluateConsequences)
 * @param {number} currentTime - Current time in minutes
 * @returns {Object} Patient object ready for the game queue
 */
export function generateFollowupPatient(consequence, currentTime) {
    const { originalCase, condition, severity, narrative, newSymptoms = [], guidelineRef } = consequence;
    const { patientName, age, gender, originalDiagnosis, category } = originalCase;

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

    return {
        id: `followup_${consequence.id}_${Date.now()}`,
        name: patientName,
        age: age,
        gender: gender,
        anthropometrics: generateAnthropometrics(age, gender),
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
            isResident: true,
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
            clue: guidelineRef?.guideline || '',
            isResident: true,
            villagerId: null,
            familyId: null,
            houseId: null,
            isFollowup: true,
        }
    };
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
export function generateUKPBridgePatient(bridgeData, currentTime = 480, population = []) {
    const { ukpDiseaseId, familyId, scenarioId } = bridgeData;
    if (!ukpDiseaseId || !familyId) return null;

    // Find a family member from the village
    const family = population.find(f => f.id === familyId);
    if (!family || !family.members?.length) return null;

    // Pick a random adult member (not a child if possible)
    const adults = family.members.filter(m => (m.age || 0) >= 15);
    const member = adults.length > 0
        ? adults[Math.floor(Math.random() * adults.length)]
        : family.members[0];

    // Get the clinical case from CaseLibrary
    const disease = getCaseByCondition(ukpDiseaseId);
    if (!disease) return null;

    const gender = member.gender || 'L';
    const fullName = `${member.firstName || 'Warga'} ${family.surname || ''}`.trim();

    const facility = CATEGORY_FACILITY_MAP[disease.category] || 'poli_umum';

    return {
        id: `patient_bcbridge_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: fullName,
        age: member.age || 35,
        gender,
        complaint: disease.chiefComplaint || disease.complaint || 'Keluhan tidak spesifik',
        narrative: `(Warga ini datang karena masalah kesehatan akibat perilaku yang belum berubah) ${disease.narrative || ''}`,
        facility,
        medical: {
            vitals: disease.vitals || {},
            physicalExam: disease.physicalExam || {},
            labs: {},
            trueDiagnosisCode: disease.icdCode || disease.id,
            diagnosisName: disease.diagnosisName || disease.condition || ukpDiseaseId,
            anamnesisQuestions: disease.anamnesisQuestions || null,
            essentialQuestions: disease.essentialQuestions || [],
            anamnesis: disease.anamnesis || [disease.chiefComplaint || ''],
            nonReferrable: disease.skdiLevel === '4A',
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
            requiredAction: disease.skdiLevel === '4A' ? 'treat' : 'refer',
            skdi: disease.skdiLevel || '4A',
            risk: 'medium',
            differentials: disease.differentials || [],
            clue: disease.teachingPoint || '',
            isResident: true,
            villagerId: member.id,
            familyId: familyId,
            houseId: family.houseId,
            isBCBridge: true,
            bcScenarioId: scenarioId,
        }
    };
}

/**
 * Generate a cohort of generic patients for a specific disease.
 * Useful for outbreaks or failed IKM interventions to flood the UKP queue.
 */
export function generateGenericPatients(diseaseId, amount, targetClinic, currentTime = 480) {
    const patients = [];
    const disease = getCaseByCondition(diseaseId) || getRandomCase('Respiratory'); // fallback
    if (!disease) return patients;

    for (let i = 0; i < amount; i++) {
        const isMale = Math.random() > 0.5;
        const gender = isMale ? 'L' : 'P';
        const age = 5 + Math.floor(Math.random() * 60);
        const nameList = isMale ? NAMES_MALE : NAMES_FEMALE;
        const fullName = `${nameList[Math.floor(Math.random() * nameList.length)]} ${SURNAMES[Math.floor(Math.random() * SURNAMES.length)]}`;

        const facility = targetClinic || CATEGORY_FACILITY_MAP[disease.category] || 'poli_umum';

        patients.push({
            id: `patient_generic_${Date.now()}_${Math.random().toString(36).slice(2, 6)}_${i}`,
            name: fullName,
            age,
            gender,
            anthropometrics: generateAnthropometrics(age, gender),
            complaint: disease.chiefComplaint || disease.complaint || 'Keluhan tidak spesifik',
            narrative: `(Warga ini datang karena kejadian komunitas) ${disease.narrative || ''}`,
            facility,
            medical: {
                vitals: disease.vitals || {},
                physicalExam: disease.physicalExam || {},
                labs: {},
                trueDiagnosisCode: disease.icdCode || disease.id,
                diagnosisName: disease.diagnosisName || disease.condition || diseaseId,
                anamnesisQuestions: disease.anamnesisQuestions || null,
                essentialQuestions: disease.essentialQuestions || [],
                anamnesis: disease.anamnesis || [disease.chiefComplaint || ''],
                nonReferrable: disease.skdiLevel === '4A',
                correctTreatment: disease.correctTreatment || [],
                correctProcedures: disease.correctProcedures || [],
                requiredEducation: disease.requiredEducation || [],
                relevantLabs: disease.relevantLabs || [],
            },
            social: { isResident: true, hasBPJS: true },
            status: 'waiting',
            joinedAt: currentTime + (i * 15),
            patience: 80,
            hidden: {
                diseaseId: disease.id || diseaseId,
                requiredAction: disease.skdiLevel === '4A' ? 'treat' : 'refer',
                skdi: disease.skdiLevel || '4A',
                risk: 'medium',
                differentials: disease.differentials || [],
                clue: disease.teachingPoint || '',
                isResident: true,
            }
        });
    }
    return patients;
}

