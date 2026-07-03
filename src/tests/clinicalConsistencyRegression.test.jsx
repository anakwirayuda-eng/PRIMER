import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CaseSpecificSelection from '../components/emr/anamnesis/CaseSpecificSelection.jsx';
import { CHRONIC_CASES } from '../content/cases/modules/chronic.js';
import { EMERGENCY_CASES as LEGACY_EMERGENCY_CASES } from '../content/cases/modules/emergency.js';
import { dermatology_infectious } from '../content/cases/modules/infectious/dermatology.js';
import { general_infectious } from '../content/cases/modules/infectious/general.js';
import { sti_urinary_infectious } from '../content/cases/modules/infectious/sti_urinary.js';
import { METABOLIC_CASES } from '../content/cases/modules/metabolic.js';
import { CARDIOVASCULAR_CASES } from '../content/cases/modules/modules/cardiovascular.js';
import { GENERAL_CASES } from '../content/cases/modules/modules/general.js';
import { RESPIRATORY_CASES } from '../content/cases/modules/modules/respiratory.js';
import { REPRODUCTIVE_CASES } from '../content/cases/modules/modules/reproductive.js';
import { URINARY_CASES } from '../content/cases/modules/modules/urinary.js';
import { generateGenericPatients } from '../game/PatientGenerator.js';
import { EMERGENCY_CASES as RUNTIME_EMERGENCY_CASES } from '../game/EmergencyCases.js';
import { CARDIOVASCULAR_CASES as EMERGENCY_CARDIOVASCULAR_CASES } from '../game/emergency/cases/CardiovascularCases.js';
import { validateAnamnesis, validateExams } from '../game/ValidationEngine.js';
import { getMedicationById, MEDICATION_CATEGORIES } from '../data/MedicationDatabase.js';
import { getSupportedRelevantLabEntries, getUnsupportedRelevantLabEntries } from '../utils/labs.js';

function getCase(cases, id) {
    return cases.find((entry) => entry.id === id);
}

function withCategory(caseData, categoryId, questionId) {
    const question = (caseData.anamnesisQuestions?.[categoryId] || []).find((entry) => entry.id === questionId);
    return { ...question, category: categoryId };
}

describe('clinical consistency regression guards', () => {
    it('scores authored essential anamnesis flow as complete enough', () => {
        const hypertension = getCase(METABOLIC_CASES, 'hypertension_primary');
        const askedQuestions = [
            withCategory(hypertension, 'keluhan_utama', 'q_main_complaint'),
            withCategory(hypertension, 'rpd', 'q_ht_history'),
            withCategory(hypertension, 'rpk', 'q_family_ht'),
        ];

        const result = validateAnamnesis(hypertension, askedQuestions);

        expect(result.score).toBeGreaterThanOrEqual(80);
        expect(result.essentialMissed).toEqual([]);
    });

    it('keeps essential adult-authored history question visible even on child patient', () => {
        const hypertension = getCase(METABOLIC_CASES, 'hypertension_primary');

        render(
            <CaseSpecificSelection
                patient={{ age: 10, gender: 'L' }}
                anamnesisCategory="rpd"
                hasAskedComplaint={false}
                caseData={hypertension}
                anamnesisHistory={[]}
                handleAskQuestion={() => {}}
                isDark={false}
            />
        );

        expect(screen.getByTitle(/riwayat darah tinggi sebelumnya/i)).toBeInTheDocument();
    });

    it('prevents adult and anatomy-specific cases from spawning with absurd demographics', () => {
        const hypertensionPatients = generateGenericPatients('hypertension_primary', 20, 'poli_umum', 480, 'adult-guard');
        const torsioPatients = generateGenericPatients('torsio_testis', 12, 'poli_umum', 480, 'male-guard');
        const vaginitisPatients = generateGenericPatients('vaginitis', 12, 'poli_kia_kb', 480, 'female-guard');

        expect(hypertensionPatients.every((patient) => patient.age >= 15)).toBe(true);
        expect(torsioPatients.every((patient) => patient.gender === 'L')).toBe(true);
        expect(vaginitisPatients.every((patient) => patient.gender === 'P')).toBe(true);
    });

    it('keeps bridge and generic queue patients aligned with authored clinical contracts', () => {
        const genericPatients = generateGenericPatients('hypertension_primary', 1, 'poli_umum', 480, 'contract-guard');
        const generic = genericPatients[0];

        expect(generic.medicalData.correctTreatment).toEqual(generic.hidden.correctTreatment);
        expect(generic.medicalData.correctProcedures).toEqual(generic.hidden.correctProcedures);
        expect(generic.medicalData.requiredEducation).toEqual(generic.hidden.requiredEducation);
        expect(generic.medicalData.relevantLabs).toEqual(generic.hidden.relevantLabs);
        expect(generic.hidden.isResident).toBe(false);
    });

    it('accepts authored alias labs for anthrax and syphilis validation', () => {
        const anthrax = getCase(general_infectious, 'anthrax');
        const syphilis = getCase(REPRODUCTIVE_CASES, 'sifilis_stadium_1');

        const anthraxValidation = validateExams(anthrax, ['skin', 'extremities'], ['Gram Stain Lesi', 'Darah Lengkap']);
        const syphilisValidation = validateExams(syphilis, ['genitalia'], ['VDRL/RPR']);

        expect(anthraxValidation.missingLabs).toEqual([]);
        expect(syphilisValidation.missingLabs).toEqual([]);
    });

    it('treats authored advanced labs as supported when the case provides concrete results', () => {
        const heartFailure = getCase(CHRONIC_CASES, 'heart_failure_congestive');
        const leukemia = getCase(CHRONIC_CASES, 'leukemia_suspicion');
        const scrofuloderma = getCase(dermatology_infectious, 'scrofuloderma');
        const pyelonephritis = getCase(sti_urinary_infectious, 'pyelonephritis');

        expect(getUnsupportedRelevantLabEntries(heartFailure)).toEqual([]);
        expect(getSupportedRelevantLabEntries(heartFailure).map((entry) => entry.label)).toEqual(['Darah Lengkap', 'BNP']);

        expect(getUnsupportedRelevantLabEntries(leukemia)).toEqual([]);
        expect(getSupportedRelevantLabEntries(leukemia).map((entry) => entry.label)).toEqual(['Darah Lengkap', 'Apusan Darah Tepi']);

        expect(getUnsupportedRelevantLabEntries(scrofuloderma)).toEqual([]);
        expect(getSupportedRelevantLabEntries(scrofuloderma).map((entry) => entry.label)).toEqual(['BTA Sputum', 'Rontgen Thorax']);

        expect(getUnsupportedRelevantLabEntries(pyelonephritis)).toEqual([]);
        expect(getSupportedRelevantLabEntries(pyelonephritis).map((entry) => entry.label)).toEqual(['Urinalisis', 'Kultur Urin']);
    });

    it('surfaces unsupported advanced labs separately from supported FKTP labs', () => {
        const heartFailure = { relevantLabs: ['Darah Lengkap', 'BNP'] };
        const leukemia = { relevantLabs: ['Darah Lengkap', 'Apusan Darah Tepi'] };

        expect(getSupportedRelevantLabEntries(heartFailure).map((entry) => entry.label)).toEqual(['Darah Lengkap']);
        expect(getUnsupportedRelevantLabEntries(heartFailure).map((entry) => entry.label)).toEqual(['BNP']);

        expect(getSupportedRelevantLabEntries(leukemia).map((entry) => entry.label)).toEqual(['Darah Lengkap']);
        expect(getUnsupportedRelevantLabEntries(leukemia).map((entry) => entry.label)).toEqual(['Apusan Darah Tepi']);
    });

    it('keeps pediatric male anatomy cases restricted to boys', () => {
        const fimosisPatients = generateGenericPatients('fimosis', 12, 'poli_umum', 480, 'fimosis-guard');
        const parafimosisPatients = generateGenericPatients('parafimosis', 12, 'poli_umum', 480, 'parafimosis-guard');
        const fimosis = getCase(URINARY_CASES, 'fimosis');

        expect(fimosisPatients.every((patient) => patient.gender === 'L')).toBe(true);
        expect(parafimosisPatients.every((patient) => patient.gender === 'L')).toBe(true);
        expect(getSupportedRelevantLabEntries(fimosis)).toEqual([]);
    });

    it('fills fallback differential and education metadata for authored high-level cases', () => {
        const generalCheckup = getCase(GENERAL_CASES, 'general_checkup');
        const heartFailure = getCase(CHRONIC_CASES, 'heart_failure_congestive');
        const leukemia = getCase(CHRONIC_CASES, 'leukemia_suspicion');

        expect(generalCheckup.differentialDiagnosis).toEqual(['Z13.9', 'Z00.8']);

        expect(heartFailure.requiredEducation).toEqual([
            'fluid_and_salt_restriction',
            'daily_weight_monitoring',
            'med_compliance',
            'echo_referral',
            'red_flag_monitor'
        ]);
        expect(heartFailure.differentialDiagnosis).toEqual(['I50.9', 'J81', 'R06.0']);

        expect(leukemia.requiredEducation).toEqual([
            'life_threatening',
            'infection_risk',
            'blood_transfusion_if_needed',
            'hematology_referral',
            'biopsy_needed'
        ]);
        expect(leukemia.differentialDiagnosis).toEqual(['C91.0', 'C92.0', 'D61.9']);
    });

    it('keeps respiratory authored therapy aligned with the case clues', () => {
        const acuteAsthma = getCase(RESPIRATORY_CASES, 'asma_bronkiale_akut');
        const bronchitis = getCase(RESPIRATORY_CASES, 'bronkhitis_akut');
        const pneumonia = getCase(RESPIRATORY_CASES, 'pneumonia_bakterial');
        const copd = getCase(RESPIRATORY_CASES, 'ppok_exacerbation');

        expect(acuteAsthma.correctTreatment).toEqual(['ipratropium_nebulizer', 'dexamethasone_inj']);
        expect(acuteAsthma.correctTreatment).not.toContain('ipratropium_nasal');

        expect(bronchitis.correctTreatment).toEqual(['ambroxol_30', 'paracetamol_500']);
        expect(bronchitis.requiredEducation).not.toContain('complete_antibiotics');

        expect(pneumonia.correctTreatment).toEqual(['amoxicillin_500', 'paracetamol_500', 'ambroxol_30']);
        expect(pneumonia.requiredEducation).not.toContain('follow_up_xray');

        expect(copd.correctProcedures).toEqual(['nebulizer', 'nasal_cannula']);
        expect(copd.correctTreatment).toEqual(['ipratropium_nebulizer', 'prednisone_5', 'azithromycin_500']);
        expect(copd.essentialQuestions).toContain('q_sputum');
        expect(copd.clue.toLowerCase()).toContain('saat stabil');
    });

    it('keeps lifestyle-driven metabolic cases from mandating off-target drugs', () => {
        const dyslipidemia = getCase(METABOLIC_CASES, 'dyslipidemia');
        const obesity = getCase(METABOLIC_CASES, 'obesity');

        expect(dyslipidemia.correctTreatment).toEqual(['simvastatin_20']);
        expect(dyslipidemia.correctTreatment).not.toContain('gemfibrozil_300');

        expect(obesity.correctTreatment).toEqual([]);
        expect(obesity.requiredEducation).toContain('nutrition_counseling');
        expect(obesity.treatmentNote).toMatch(/gaya hidup intensif/i);
    });

    it('keeps cardiovascular urgent-care authoring aligned with safety constraints', () => {
        const stemi = getCase(CARDIOVASCULAR_CASES, 'acute_mi_stemi');
        const angina = getCase(CARDIOVASCULAR_CASES, 'angina_pektoris');
        const atrialFibrillation = getCase(CARDIOVASCULAR_CASES, 'fibrilasi_atrial');
        const dvt = getCase(CARDIOVASCULAR_CASES, 'dvt');

        expect(stemi.correctTreatment).toEqual(['aspirin_320_kunyah', 'clopidogrel_300']);
        expect(stemi.correctTreatment).not.toContain('isdn_5_sublingual');
        expect(stemi.treatmentNote).toMatch(/hipotensi/i);
        expect(stemi.treatmentNote).toMatch(/hipoksemik/i);
        expect(stemi.vitals.spo2).toBe(89);

        expect(angina.correctTreatment).toEqual(['bisoprolol_2_5', 'aspirin_80', 'atorvastatin_20']);
        expect(angina.requiredEducation).toEqual(['when_to_emergency', 'risk_factor_modification', 'med_compliance']);
        expect(angina.essentialQuestions).toContain('q_duration');
        expect(angina.clue).not.toMatch(/di-reproduce/i);
        expect(angina.treatmentNote).toMatch(/Nitrat/i);

        expect(atrialFibrillation.correctTreatment).toEqual(['bisoprolol_2_5']);
        expect(atrialFibrillation.requiredEducation).not.toContain('anticoagulant_compliance');
        expect(atrialFibrillation.clue).toMatch(/CHA2DS2-VASc/i);
        expect(withCategory(atrialFibrillation, 'keluhan_utama', 'q_main').sentiment).toBe('confirmation');

        expect(dvt.correctProcedures).toEqual([]);
        expect(dvt.requiredEducation).toEqual([
            'no_massage',
            'pe_risk',
            'usg_doppler_referral',
            'anticoagulant_compliance',
            'leg_elevation'
        ]);
        expect(dvt.anamnesis.join(' ')).not.toMatch(/pil KB/i);
        expect(withCategory(dvt, 'rps', 'q_unilateral').sentiment).toBe('confirmation');
        expect(withCategory(dvt, 'rpd', 'q_prev_clot').id).toBe('q_prev_clot');
    });

    it('keeps heart-failure stabilization authoring tied to oxygen and pressure context', () => {
        const chronicHeartFailure = getCase(CHRONIC_CASES, 'heart_failure_congestive');
        const pulmonaryEdema = getCase(RESPIRATORY_CASES, 'edema_paru_akut');

        expect(chronicHeartFailure.vitals.spo2).toBe(88);
        expect(chronicHeartFailure.treatmentNote).toMatch(/hipoksemia/i);

        expect(pulmonaryEdema.correctTreatment).toEqual(['furosemide_40_iv', 'isdn_5_sublingual']);
        expect(pulmonaryEdema.correctTreatment).not.toContain('morfin_2_iv');
        expect(pulmonaryEdema.treatmentNote).toMatch(/morfin|opioid/i);
    });

    it('keeps emergency cardiovascular authoring away from blanket MONA and diuretic patterns', () => {
        const emergencyAcs = getCase(EMERGENCY_CARDIOVASCULAR_CASES, 'chest_pain_acs');
        const hypertensiveCrisis = getCase(EMERGENCY_CARDIOVASCULAR_CASES, 'hypertensive_crisis');
        const acutePulmonaryEdema = getCase(EMERGENCY_CARDIOVASCULAR_CASES, 'chf_acute_pulmonary_edema');

        expect(emergencyAcs.correctTreatment.flat()).toEqual(['aspilet_160', 'clopidogrel_300', 'ecg', 'iv_line', 'monitor_vitals_15']);
        expect(emergencyAcs.correctTreatment.flat()).not.toContain('oxygen');
        expect(emergencyAcs.correctTreatment.flat()).not.toContain('isdn_5');
        expect(emergencyAcs.clue).not.toMatch(/MONA/i);

        expect(hypertensiveCrisis.correctTreatment.flat()).toEqual(['nicardipine_drip', 'iv_line', 'monitor_vitals_15', 'observation_6h']);
        expect(hypertensiveCrisis.correctTreatment.flat()).not.toContain('furosemide_iv');
        expect(hypertensiveCrisis.billingItems.obat.map((item) => item.medId)).toEqual(['nicardipine_drip']);
        expect(hypertensiveCrisis.billingItems.alkes.map((item) => item.id)).toEqual(['iv_cannula']);

        expect(acutePulmonaryEdema.correctTreatment.flat()).toEqual(['oxygen', 'iv_line', 'furosemide_iv', 'isdn_5', 'monitor_vitals_15']);
        expect(acutePulmonaryEdema.correctTreatment.flat()).not.toContain('morphine_iv');
        expect(acutePulmonaryEdema.billingItems.obat.map((item) => item.medId)).not.toContain('morphine_iv');
    });

    it('keeps runtime IGD relevantLabs limited to orderable FKTP lab references', () => {
        const unsupportedByCase = RUNTIME_EMERGENCY_CASES
            .map((caseData) => ({
                id: caseData.id,
                unsupported: getUnsupportedRelevantLabEntries(caseData).map((entry) => entry.label),
            }))
            .filter((entry) => entry.unsupported.length > 0);

        expect(unsupportedByCase).toEqual([]);
    });

    it('keeps non-analgesic medications out of the analgesic category', () => {
        expect(getMedicationById('allopurinol_100').category).toBe(MEDICATION_CATEGORIES.METABOLIC);
        expect(getMedicationById('allopurinol_300').category).toBe(MEDICATION_CATEGORIES.METABOLIC);
        expect(getMedicationById('tranexamic_acid_500').category).toBe(MEDICATION_CATEGORIES.HEMOSTATIC);
        expect(getMedicationById('prednisone_5').category).toBe(MEDICATION_CATEGORIES.STEROID_IMMUNO);
        expect(getMedicationById('methylprednisolone_4').category).toBe(MEDICATION_CATEGORIES.STEROID_IMMUNO);
        expect(getMedicationById('prednisone_60').category).toBe(MEDICATION_CATEGORIES.STEROID_IMMUNO);
        expect(getMedicationById('dexamethasone_0').category).toBe(MEDICATION_CATEGORIES.STEROID_IMMUNO);
        expect(getMedicationById('phenazopyridine_100').category).toBe(MEDICATION_CATEGORIES.GENITOURINARY);
    });

    it('keeps legacy emergency STEMI aligned with loading-dose antiplatelets', () => {
        const legacyStemi = getCase(LEGACY_EMERGENCY_CASES, 'ami_stemi');

        expect(legacyStemi.correctTreatment).toEqual(['aspirin_320_kunyah', 'clopidogrel_300']);
        expect(legacyStemi.correctTreatment).not.toContain('isdn_5');
        expect(legacyStemi.treatmentNote).toMatch(/hipotensi/i);
    });
});
