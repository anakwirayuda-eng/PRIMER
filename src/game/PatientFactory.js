/**
 * @reflection
 * [IDENTITY]: PatientFactory
 * [PURPOSE]: Shared infrastructure for all patient generators — buildPatientShell (boilerplate)
 *            + normalizePatientOutput (shape guarantee). NOT a replacement for generators,
 *            but a foundation they all call into.
 * [STATE]: Active
 * [ANCHOR]: buildPatientShell, normalizePatientOutput
 * [DEPENDS_ON]: SocialDeterminants, VillageRegistry, deterministicRandom
 * [LAST_UPDATE]: 2026-03-27
 */
import { generateSocialDeterminants } from '../utils/SocialDeterminants.js';
import { INDIVIDUAL_PROFILES, calculateRiskFactors } from '../domains/village/VillageRegistry.js';
import { createDeterministicSequence, pickDeterministic, randomIdFromSeed, seedKey } from '../utils/deterministicRandom.js';

// ──────────────────────────────────────────────────────────
// Name pools (moved from PatientGenerator for sharing)
// ──────────────────────────────────────────────────────────
export const NAMES_MALE = ['Budi', 'Agus', 'Joko', 'Andi', 'Dedi', 'Eko', 'Bambang', 'Hendra', 'Iwan', 'Rizky', 'Fajar', 'Gilang', 'Hari', 'Irfan', 'Kurnia', 'Lukman', 'Maulana', 'Nanda', 'Oscar', 'Putra', 'Rendi', 'Surya', 'Taufik', 'Umar', 'Wahyu'];
export const NAMES_FEMALE = ['Siti', 'Dewi', 'Sri', 'Rina', 'Ani', 'Wati', 'Yuni', 'Lina', 'Mega', 'Fitri', 'Ayu', 'Bella', 'Citra', 'Dian', 'Eka', 'Farah', 'Gita', 'Hana', 'Intan', 'Kartika', 'Laras', 'Maya', 'Nita', 'Oktavia', 'Putri'];
export const SURNAMES = ['Santoso', 'Widodo', 'Kusuma', 'Putri', 'Wibowo', 'Lestari', 'Hidayat', 'Setiawan', 'Pratama', 'Nugroho', 'Saputra', 'Ramadhan', 'Permana', 'Utomo', 'Hartono', 'Cahyono', 'Firmansyah', 'Pradana', 'Sulistyo', 'Gunawan'];

// ──────────────────────────────────────────────────────────
// Anthropometrics (moved from PatientGenerator)
// ──────────────────────────────────────────────────────────
function getBMICategory(bmi, age) {
    if (age < 18) {
        if (bmi < 14) return 'Underweight';
        if (bmi < 20) return 'Normal';
        if (bmi < 25) return 'Overweight';
        return 'Obese';
    }
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Obese I';
    if (bmi < 40) return 'Obese II';
    return 'Obese III';
}

export function generateAnthropometrics(age, gender, seedHint = 'default') {
    const rng = createDeterministicSequence(seedKey('anthropometrics', seedHint, age, gender));
    let height, weight;

    if (age < 5) {
        height = 75 + (age * 7) + rng.int(10);
        weight = 10 + (age * 2) + rng.int(4);
    } else if (age < 12) {
        height = 100 + ((age - 5) * 5) + rng.int(15);
        weight = 18 + ((age - 5) * 3) + rng.int(8);
    } else if (age < 18) {
        if (gender === 'L') {
            height = 145 + ((age - 12) * 5) + rng.int(15);
            weight = 40 + ((age - 12) * 4) + rng.int(15);
        } else {
            height = 140 + ((age - 12) * 3) + rng.int(12);
            weight = 38 + ((age - 12) * 3) + rng.int(12);
        }
    } else {
        if (gender === 'L') {
            height = 155 + rng.int(25);
            const bmiTarget = 18 + (rng.nextFloat() * 15);
            weight = Math.round(bmiTarget * ((height / 100) ** 2));
        } else {
            height = 145 + rng.int(20);
            const bmiTarget = 17 + (rng.nextFloat() * 14);
            weight = Math.round(bmiTarget * ((height / 100) ** 2));
        }
    }
    weight = Math.max(weight, 8);
    const bmi = weight / ((height / 100) ** 2);
    const bmiCategory = getBMICategory(bmi, age);
    const bmiRiskFactors = [];
    if (bmiCategory === 'Underweight') bmiRiskFactors.push('Risiko malnutrisi');
    else if (bmiCategory === 'Overweight') bmiRiskFactors.push('Risiko penyakit metabolik');
    else if (bmiCategory.startsWith('Obese')) bmiRiskFactors.push('Obesitas', 'Risiko tinggi HT/DM/PJK');
    return { height, weight, bmi: Math.round(bmi * 10) / 10, bmiCategory, bmiRiskFactors };
}

// ──────────────────────────────────────────────────────────
// SDoH Translation Maps (centralized from PatientGenerator)
// ──────────────────────────────────────────────────────────
const EDU_MAP = {
    'No School': 'Tidak Sekolah', 'Elementary': 'SD', 'Junior High': 'SMP',
    'High School': 'SMA/SMK', 'Vocational': 'SMA/SMK', 'University': 'D3/S1',
    'Islamic Board': 'Pasantren'
};
const HOUSING_MAP = {
    'Permanent': 'Rumah Permanen', 'Permanent (Large)': 'Rumah Permanen',
    'Permanent/Shop': 'Rumah Permanen', 'Old Permanent': 'Rumah Permanen',
    'Semi-Permanent': 'Rumah Semi-Permanen', 'Make-shift': 'Rumah Tidak Layak (Rutilahu)',
    'Make-shift/Bamboo': 'Rumah Tidak Layak (Rutilahu)', 'Base': 'Rumah Semi-Permanen'
};
const ECON_MAP = {
    'Very Low': 'Prasejahtera', 'Low': 'Prasejahtera', 'Low-Middle': 'Menengah',
    'Middle': 'Menengah', 'High': 'Sejahtera'
};

/**
 * Build the shared social determinants object for a resident.
 * Previously inline in generatePatient L406-452 — now canonical.
 */
export function buildResidentSdoh(resident, residentFamily, age) {
    const regSdoh = resident.sdoh || {};
    return {
        education: (regSdoh.education && EDU_MAP[regSdoh.education]) || (age < 6 ? 'Belum Sekolah' : 'SD'),
        housing: (regSdoh.housing && HOUSING_MAP[regSdoh.housing]) || 'Rumah Semi-Permanen',
        occupation: resident.occupation || 'Tidak Bekerja',
        smokingStatus: regSdoh.smoking !== undefined ? (regSdoh.smoking ? 'Perokok Aktif' : 'Tidak Merokok') : 'Tidak Merokok',
        economicStatus: (regSdoh.economy && ECON_MAP[regSdoh.economy]) || 'Menengah',
        hasBPJS: residentFamily?.indicators?.jkn !== false,
        isResident: true,
        familyId: resident.familyId,
        villagerId: resident.id,
        familyName: residentFamily?.surname || 'Unknown',
        riskFactors: resident.riskFactors
    };
}

/**
 * Build informant data for pediatric patients (age <= 7).
 * Previously inline in generatePatient L463-495.
 */
export function buildInformant(age, resident, population, patientName, rng, patientSeed) {
    if (age > 7) return null;

    // Try to find a family member parent for residents
    if (resident && population?.villagers) {
        const familyMembers = population.villagers.filter(v =>
            v.familyId === resident.familyId && (!v.status || v.status === 'alive') && v.id !== resident.id && v.age >= 18
        );
        const mother = familyMembers.find(m => m.gender === 'P');
        const father = familyMembers.find(m => m.gender === 'L');
        const parentMember = mother || father || familyMembers[0];
        if (parentMember) {
            return {
                name: parentMember.fullName || parentMember.name || 'Ibu',
                relation: parentMember.gender === 'P' ? 'Ibu' : 'Ayah',
                age: parentMember.age || 30,
                villagerId: parentMember.id
            };
        }
    }

    // Generate a random parent
    const parentGender = rng.chance(0.7) ? 'P' : 'L';
    const parentFirstName = pickDeterministic(
        parentGender === 'P' ? NAMES_FEMALE : NAMES_MALE,
        seedKey(patientSeed, 'informant-name', parentGender)
    );
    return {
        name: `${parentFirstName} ${(patientName || '').split(' ').pop()}`,
        relation: parentGender === 'P' ? 'Ibu' : 'Ayah',
        age: 25 + rng.int(15)
    };
}

// ──────────────────────────────────────────────────────────
// buildPatientShell — shared root fields for all generators
// ──────────────────────────────────────────────────────────

/**
 * Build the common "shell" that all patient types share.
 * Generators call this first, then merge their disease-specific fields.
 *
 * @param {Object} config
 * @param {string} config.idPrefix - ID prefix ('patient', 'igd', 'followup', etc.)
 * @param {string} config.seedHint - Deterministic seed base
 * @param {number} config.currentTime - Current game time in minutes
 * @param {Object} [config.resident] - Village resident object (if isResident)
 * @param {Object} [config.residentFamily] - Family object from population
 * @param {Object} [config.population] - Full population data
 * @param {string} [config.overrideName] - Force a specific name
 * @param {number} [config.overrideAge] - Force a specific age
 * @param {string} [config.overrideGender] - Force a specific gender
 * @param {number} [config.patience] - Override patience (default 100)
 * @param {boolean} [config.isEmergency] - Is this an emergency patient?
 */
export function buildPatientShell(config) {
    const {
        idPrefix = 'patient',
        seedHint = 'default',
        currentTime = 480,
        resident = null,
        residentFamily = null,
        population = null,
        overrideName = null,
        overrideAge = null,
        overrideGender = null,
        patience = 100,
        isEmergency = false,
    } = config;

    const shellSeed = seedKey('shell', seedHint);
    const rng = createDeterministicSequence(shellSeed);
    const isResident = !!resident;

    // Gender
    const gender = overrideGender || (isResident ? resident.gender : (rng.chance(0.5) ? 'L' : 'P'));

    // Name
    let name;
    if (overrideName) {
        name = overrideName;
    } else if (isResident) {
        name = resident.fullName;
    } else {
        const firstNamePool = gender === 'L' ? NAMES_MALE : NAMES_FEMALE;
        const firstName = pickDeterministic(firstNamePool, seedKey(shellSeed, 'first-name', gender));
        const surname = pickDeterministic(SURNAMES, seedKey(shellSeed, 'surname'));
        name = `${firstName} ${surname}`;
    }

    // Age
    let age;
    if (overrideAge != null) {
        age = overrideAge;
    } else if (isResident) {
        age = resident.age;
    } else {
        const ageRoll = rng.nextFloat();
        if (ageRoll < 0.15) age = rng.int(12) + 3;
        else if (ageRoll < 0.6) age = rng.int(30) + 20;
        else if (ageRoll < 0.85) age = rng.int(20) + 50;
        else age = rng.int(20) + 70;
    }

    // Anthropometrics
    const anthropometrics = generateAnthropometrics(age, gender, seedKey(shellSeed, 'anthropometrics'));

    // Social determinants
    let social;
    if (isResident && residentFamily) {
        social = buildResidentSdoh(resident, residentFamily, age);
        // Calculate risk factors
        if (residentFamily.indicators) {
            const profile = INDIVIDUAL_PROFILES[resident.id] || null;
            resident.riskFactors = calculateRiskFactors(residentFamily.indicators, resident, resident.sdoh || {}, profile);
            social.riskFactors = resident.riskFactors;
        }
    } else {
        social = generateSocialDeterminants(age);
        social.isResident = false;
        if (!isResident) {
            social.patientType = rng.chance(0.5) ? 'tourist' : 'worker';
        }
    }

    // Append BMI risk factors to SDoH
    if (anthropometrics.bmiRiskFactors.length > 0) {
        social.riskFactorsSummary = [
            ...(social.riskFactorsSummary || []),
            ...anthropometrics.bmiRiskFactors
        ];
    }

    // Communication style + demeanor
    const commStyles = ['verbose', 'concise', 'vague'];
    const demeanors = ['Stoic', 'Anxious', 'Dramatic', 'Normal'];
    const communicationStyle = (isResident && resident.communicationStyle)
        ? resident.communicationStyle
        : pickDeterministic(commStyles, seedKey(shellSeed, 'communication-style'));
    const demeanor = pickDeterministic(demeanors, seedKey(shellSeed, 'demeanor'));

    // Informant (for children)
    const informant = buildInformant(age, resident, population, name, rng, shellSeed);

    return {
        id: randomIdFromSeed(idPrefix, seedKey(shellSeed, 'id'), 9),
        name,
        age,
        gender,
        anthropometrics,
        communicationStyle,
        demeanor,
        informant,
        social,
        status: isEmergency ? 'igd_waiting' : 'waiting',
        joinedAt: currentTime || 480,
        patience,
        isEmergency,
        triageLevel: null,
        // Resident tracking (for hidden field merging)
        _isResident: isResident,
        _resident: resident,
        _residentFamily: residentFamily,
    };
}

// ──────────────────────────────────────────────────────────
// normalizePatientOutput — shape guarantee post-processor
// ──────────────────────────────────────────────────────────

/** Default medicalData shape */
const DEFAULT_MEDICAL_DATA = {
    symptoms: [],
    vitals: {},
    physicalExamFindings: {},
    labs: {},
    icd10: 'R69',
    trueDiagnosisCode: 'R69',
    diagnosisName: 'Unknown',
    anamnesisQuestions: null,
    essentialQuestions: [],
    anamnesis: [],
    nonReferrable: false,
    referralExceptions: [],
    correctTreatment: [],
    correctProcedures: [],
    requiredEducation: [],
    relevantLabs: [],
};

/** Default hidden shape */
const DEFAULT_HIDDEN = {
    diseaseId: 'unknown',
    requiredAction: 'treat',
    skdi: '4A',
    risk: 'low',
    differentials: [],
    clue: '',
    correctTreatment: [],
    correctProcedures: [],
    requiredEducation: [],
    relevantLabs: [],
    isResident: false,
    villagerId: null,
    familyId: null,
    houseId: null,
};

/**
 * Ensures the patient object has ALL required fields.
 * Fills gaps with defaults. Cleans up internal _prefixed fields.
 * 
 * @param {Object} patient - Raw patient object from a generator
 * @returns {Object} Shape-guaranteed patient
 */
export function normalizePatientOutput(patient) {
    // Determine resident status: prefer _isResident internal flag, fallback to hidden.isResident
    const isResident = patient._isResident ?? patient.hidden?.isResident ?? false;
    const resident = patient._resident || null;
    const residentFamily = patient._residentFamily || null;

    // Merge medicalData with defaults
    const medicalData = {
        ...DEFAULT_MEDICAL_DATA,
        ...(patient.medicalData || {}),
    };

    // Merge hidden with defaults + resident info
    const hidden = {
        ...DEFAULT_HIDDEN,
        ...(patient.hidden || {}),
        isResident,
        villagerId: resident?.id ?? patient.hidden?.villagerId ?? null,
        familyId: resident?.familyId ?? patient.hidden?.familyId ?? null,
        houseId: resident?.houseId ?? patient.hidden?.houseId ?? null,
    };

    // Ensure social.hasBPJS and social.isResident are derived correctly
    const social = { ...patient.social };
    if (isResident && residentFamily) {
        social.hasBPJS = residentFamily.indicators?.jkn !== false;
    } else if (social.hasBPJS === undefined) {
        social.hasBPJS = false;
    }
    if (social.isResident === undefined) {
        social.isResident = isResident;
    }

    // Clean output — remove internal fields
    const { _isResident, _resident, _residentFamily, ...cleanPatient } = patient;

    return {
        ...cleanPatient,
        medicalData,
        hidden,
        social,
        // Guarantee root fields exist with correct types
        isEmergency: typeof cleanPatient.isEmergency === 'boolean' ? cleanPatient.isEmergency : false,
        triageLevel: cleanPatient.triageLevel !== undefined ? cleanPatient.triageLevel : null,
        communicationStyle: cleanPatient.communicationStyle || 'concise',
        demeanor: cleanPatient.demeanor || 'Normal',
        anthropometrics: cleanPatient.anthropometrics || { height: 165, weight: 60, bmi: 22.0, bmiCategory: 'Normal', bmiRiskFactors: [] },
        informant: cleanPatient.informant !== undefined ? cleanPatient.informant : null,
        complaint: cleanPatient.complaint || 'Tidak enak badan dok...',
        patience: typeof cleanPatient.patience === 'number' ? cleanPatient.patience : 100,
    };
}
