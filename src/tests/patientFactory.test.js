import { describe, expect, it } from 'vitest';
import {
    generateEmergencyPatient,
    generateFollowupPatient,
    generateGenericPatients,
    generatePatient,
    generateProlanisVisitPatient,
    generateUKPBridgePatient,
} from '../game/PatientGenerator.js';

const CANONICAL_COMMUNICATION_STYLES = ['verbose', 'concise', 'vague'];
const CANONICAL_DEMEANORS = ['Stoic', 'Anxious', 'Dramatic', 'Normal'];
const CANONICAL_REQUIRED_ACTIONS = ['treat', 'refer', 'stabilize'];

const facilities = {
    poli_umum: 1,
    igd: 1,
    poli_gigi: 1,
    poli_kia_kb: 1,
};

const population = {
    villagers: [
        {
            id: 'vill_01',
            fullName: 'Budi Santoso',
            familyId: 'kk_01',
            houseId: 'house_01',
            status: 'alive',
            gender: 'L',
            age: 34,
            occupation: 'Petani',
            sdoh: {
                education: 'High School',
                housing: 'Permanent',
                economy: 'Middle',
                smoking: false,
            },
            communicationStyle: 'verbose',
        },
        {
            id: 'vill_02',
            fullName: 'Siti Santoso',
            familyId: 'kk_01',
            houseId: 'house_01',
            status: 'alive',
            gender: 'P',
            age: 31,
            occupation: 'Ibu Rumah Tangga',
            sdoh: {
                education: 'High School',
                housing: 'Permanent',
                economy: 'Middle',
                smoking: false,
            },
            communicationStyle: 'concise',
        },
        {
            id: 'vill_03',
            fullName: 'Rina Wijaya',
            familyId: 'kk_02',
            houseId: 'house_02',
            status: 'alive',
            gender: 'P',
            age: 8,
            occupation: 'Pelajar',
            sdoh: {
                education: 'Elementary',
                housing: 'Semi-Permanent',
                economy: 'Low',
                smoking: false,
            },
            communicationStyle: 'vague',
        },
    ],
    families: [
        {
            id: 'kk_01',
            surname: 'Santoso',
            houseId: 'house_01',
            indicators: {
                jkn: true,
                jentik: true,
            },
            iksScore: 0.82,
            members: [
                { id: 'vill_01', firstName: 'Budi', gender: 'L', age: 34 },
                { id: 'vill_02', firstName: 'Siti', gender: 'P', age: 31 },
            ],
        },
        {
            id: 'kk_02',
            surname: 'Wijaya',
            houseId: 'house_02',
            indicators: {
                jkn: false,
                jentik: false,
            },
            iksScore: 0.45,
            members: [
                { id: 'vill_03', firstName: 'Rina', gender: 'P', age: 8 },
            ],
        },
    ],
};

const prolanisRosterMember = {
    id: 'pro_01',
    name: 'Pak Joko',
    age: 58,
    gender: 'L',
    anthropometrics: {
        height: 168,
        weight: 72,
        bmi: 25.5,
        bmiCategory: 'Overweight',
        bmiRiskFactors: [],
    },
    social: {
        hasBPJS: true,
        isResident: true,
    },
    villagerId: 'vill_01',
    familyId: 'kk_01',
    houseId: 'house_01',
    prolanisData: {
        diseaseType: 'dm_type2',
        parameters: {
            gds: 180,
            hba1c: 8.2,
            systolic: 135,
            diastolic: 85,
        },
        history: [],
        consecutiveControlled: 0,
        lastVisitDay: 20,
        enrolledDay: 1,
    },
};

const consequence = {
    id: 'cons_01',
    ruleId: 'rule_demo',
    condition: 'worsened',
    severity: 'medium',
    narrative: 'keluhan makin berat',
    newSymptoms: ['demam', 'lemas'],
    guidelineRef: {
        text: 'kontrol ulang 3 hari',
    },
    originalCase: {
        patientName: 'Budi Santoso',
        age: 34,
        gender: 'L',
        originalDiagnosis: 'J00',
        category: 'Respiratory',
    },
    createdDay: 1,
    returnDay: 3,
};

const bridgeData = {
    ukpDiseaseId: 'ispa_common',
    familyId: 'kk_01',
    scenarioId: 'bc_demo',
};

function expectCanonicalPatientShape(patient, label) {
    expect(patient, `${label} should return an object`).toBeTruthy();
    if (!patient) {
        return;
    }

    expect.soft(typeof patient.id, `${label}.id`).toBe('string');
    expect.soft(typeof patient.name, `${label}.name`).toBe('string');
    expect.soft(typeof patient.age, `${label}.age`).toBe('number');
    expect.soft(['L', 'P'], `${label}.gender`).toContain(patient.gender);

    expect.soft(patient.anthropometrics, `${label}.anthropometrics`).toBeTruthy();
    expect.soft(typeof patient.anthropometrics?.height, `${label}.anthropometrics.height`).toBe('number');
    expect.soft(typeof patient.anthropometrics?.weight, `${label}.anthropometrics.weight`).toBe('number');
    expect.soft(typeof patient.anthropometrics?.bmi, `${label}.anthropometrics.bmi`).toBe('number');
    expect.soft(typeof patient.anthropometrics?.bmiCategory, `${label}.anthropometrics.bmiCategory`).toBe('string');
    expect.soft(Array.isArray(patient.anthropometrics?.bmiRiskFactors), `${label}.anthropometrics.bmiRiskFactors`).toBe(true);

    expect.soft(typeof patient.complaint, `${label}.complaint`).toBe('string');
    expect.soft(CANONICAL_COMMUNICATION_STYLES, `${label}.communicationStyle`).toContain(patient.communicationStyle);
    expect.soft(CANONICAL_DEMEANORS, `${label}.demeanor`).toContain(patient.demeanor);
    expect.soft(typeof patient.isEmergency, `${label}.isEmergency`).toBe('boolean');
    expect.soft(
        patient.triageLevel === null || typeof patient.triageLevel === 'number',
        `${label}.triageLevel`
    ).toBe(true);
    expect.soft(
        patient.informant === null || typeof patient.informant === 'object',
        `${label}.informant`
    ).toBe(true);

    expect.soft(patient.social, `${label}.social`).toBeTruthy();
    expect.soft(typeof patient.social?.hasBPJS, `${label}.social.hasBPJS`).toBe('boolean');
    expect.soft(typeof patient.social?.isResident, `${label}.social.isResident`).toBe('boolean');

    expect.soft(typeof patient.status, `${label}.status`).toBe('string');
    expect.soft(typeof patient.joinedAt, `${label}.joinedAt`).toBe('number');
    expect.soft(typeof patient.patience, `${label}.patience`).toBe('number');

    expect.soft(patient.medicalData, `${label}.medicalData`).toBeTruthy();
    expect.soft(Array.isArray(patient.medicalData?.symptoms), `${label}.medicalData.symptoms`).toBe(true);
    expect.soft(
        patient.medicalData?.vitals && typeof patient.medicalData.vitals === 'object',
        `${label}.medicalData.vitals`
    ).toBe(true);
    expect.soft(patient.medicalData?.trueDiagnosisCode, `${label}.medicalData.trueDiagnosisCode`).not.toBeUndefined();
    expect.soft(typeof patient.medicalData?.trueDiagnosisCode, `${label}.medicalData.trueDiagnosisCode`).toBe('string');
    expect.soft(typeof patient.medicalData?.diagnosisName, `${label}.medicalData.diagnosisName`).toBe('string');
    expect.soft(Array.isArray(patient.medicalData?.correctTreatment), `${label}.medicalData.correctTreatment`).toBe(true);
    expect.soft(Array.isArray(patient.medicalData?.correctProcedures), `${label}.medicalData.correctProcedures`).toBe(true);
    expect.soft(Array.isArray(patient.medicalData?.requiredEducation), `${label}.medicalData.requiredEducation`).toBe(true);
    expect.soft(Array.isArray(patient.medicalData?.relevantLabs), `${label}.medicalData.relevantLabs`).toBe(true);

    expect.soft(patient.hidden, `${label}.hidden`).toBeTruthy();
    expect.soft(typeof patient.hidden?.diseaseId, `${label}.hidden.diseaseId`).toBe('string');
    expect.soft(CANONICAL_REQUIRED_ACTIONS, `${label}.hidden.requiredAction`).toContain(patient.hidden?.requiredAction);
    expect.soft(typeof patient.hidden?.skdi, `${label}.hidden.skdi`).toBe('string');
    expect.soft(typeof patient.hidden?.risk, `${label}.hidden.risk`).toBe('string');
    expect.soft(Array.isArray(patient.hidden?.differentials), `${label}.hidden.differentials`).toBe(true);
    expect.soft(typeof patient.hidden?.isResident, `${label}.hidden.isResident`).toBe('boolean');
    expect.soft(
        patient.hidden?.villagerId === null || typeof patient.hidden?.villagerId === 'string',
        `${label}.hidden.villagerId`
    ).toBe(true);
    expect.soft(
        patient.hidden?.familyId === null || typeof patient.hidden?.familyId === 'string',
        `${label}.hidden.familyId`
    ).toBe(true);
    expect.soft(
        patient.hidden?.houseId === null || typeof patient.hidden?.houseId === 'string',
        `${label}.hidden.houseId`
    ).toBe(true);

    if (patient.social?.isResident) {
        expect.soft(typeof patient.hidden?.villagerId, `${label} resident hidden.villagerId`).toBe('string');
        expect.soft(typeof patient.hidden?.familyId, `${label} resident hidden.familyId`).toBe('string');
    }

    expect.soft(patient.medical, `${label}.medical should not exist`).toBeUndefined();
}

describe('PatientGenerator shape contracts', () => {
    it('generatePatient returns a canonical patient shape', () => {
        const patient = generatePatient(480, population, 3, facilities, {}, 'shape-contract');
        expectCanonicalPatientShape(patient, 'generatePatient');
    });

    it('generateEmergencyPatient returns a canonical patient shape', () => {
        const patient = generateEmergencyPatient(480, facilities, population, 'shape-contract');
        expectCanonicalPatientShape(patient, 'generateEmergencyPatient');
    });

    it('generateProlanisVisitPatient returns a canonical patient shape', () => {
        const patient = generateProlanisVisitPatient(prolanisRosterMember, 12, 'shape-contract');
        expectCanonicalPatientShape(patient, 'generateProlanisVisitPatient');
    });

    it('generateFollowupPatient returns a canonical patient shape', () => {
        const patient = generateFollowupPatient(consequence, 540, 'shape-contract');
        expectCanonicalPatientShape(patient, 'generateFollowupPatient');
    });

    it('generateUKPBridgePatient returns a canonical patient shape', () => {
        const patient = generateUKPBridgePatient(bridgeData, 600, population.families, 'shape-contract');
        expectCanonicalPatientShape(patient, 'generateUKPBridgePatient');
    });

    it('generateGenericPatients returns canonical patient shapes', () => {
        const patients = generateGenericPatients('ispa_common', 2, 'poli_umum', 600, 'shape-contract');

        expect(Array.isArray(patients)).toBe(true);
        expect(patients).toHaveLength(2);

        patients.forEach((patient, index) => {
            expectCanonicalPatientShape(patient, `generateGenericPatients[${index}]`);
        });
    });
});
