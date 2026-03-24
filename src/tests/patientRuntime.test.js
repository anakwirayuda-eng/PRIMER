import { describe, expect, it } from 'vitest';
import { normalizePatient, normalizePatientList, PATIENT_ACL_VERSION } from '../models/PatientRuntime.js';

describe('PatientRuntime ACL', () => {
    it('preserves runtime fields', () => {
        const raw = {
            id: '1',
            joinedAt: 480,
            status: 'waiting',
            prolanisData: { x: 1 },
            triageLevel: 2,
            esiLevel: 'ESI-3',
            labsRevealed: { darah_lengkap: true }
        };

        const canonical = normalizePatient(raw);

        expect(canonical.joinedAt).toBe(480);
        expect(canonical.status).toBe('waiting');
        expect(canonical.prolanisData).toEqual({ x: 1 });
        expect(canonical.triageLevel).toBe(2);
        expect(canonical.esiLevel).toBe('ESI-3');
        expect(canonical.labsRevealed).toEqual({ darah_lengkap: true });
    });

    it('absorbs BPJS from social.hasBPJS', () => {
        expect(normalizePatient({ id: '1', social: { hasBPJS: true } }).social.hasBPJS).toBe(true);
    });

    it('absorbs BPJS from root isBPJS', () => {
        expect(normalizePatient({ id: '1', isBPJS: true }).social.hasBPJS).toBe(true);
    });

    it('absorbs BPJS from medicalData.hasBPJS', () => {
        expect(normalizePatient({ id: '1', medicalData: { hasBPJS: true } }).social.hasBPJS).toBe(true);
    });

    it('absorbs BPJS from hidden.bpjs', () => {
        expect(normalizePatient({ id: '1', hidden: { bpjs: true } }).social.hasBPJS).toBe(true);
    });

    it('prefers medicalData.trueDiagnosisCode', () => {
        const canonical = normalizePatient({
            id: '1',
            medicalData: { trueDiagnosisCode: 'J06', diagnosisCode: 'A00' }
        });
        expect(canonical.medicalData.trueDiagnosisCode).toBe('J06');
    });

    it('falls back to medicalData.diagnosisCode', () => {
        const canonical = normalizePatient({
            id: '1',
            medicalData: { diagnosisCode: 'J06' }
        });
        expect(canonical.medicalData.trueDiagnosisCode).toBe('J06');
    });

    it('does not use hidden.diseaseId as ICD', () => {
        const canonical = normalizePatient({
            id: '1',
            hidden: { diseaseId: 'dm_type2' }
        });
        expect(canonical.medicalData.trueDiagnosisCode).toBe('');
        expect(canonical.hidden.diseaseId).toBe('dm_type2');
    });

    it('absorbs hidden.differentialDiagnosis for emergency lane', () => {
        const canonical = normalizePatient({
            id: '1',
            hidden: { differentialDiagnosis: ['J06', 'J18'] }
        });
        expect(canonical.medicalData.differentialDiagnosis).toEqual(['J06', 'J18']);
        expect(canonical.hidden.differentialDiagnosis).toEqual(['J06', 'J18']);
    });

    it('is idempotent for current ACL version', () => {
        const first = normalizePatient({ id: '1', medicalData: { diagnosisCode: 'J06' } });
        const second = normalizePatient(first);
        expect(second).toBe(first);
    });

    it('re-normalizes outdated canonical entries', () => {
        const outdated = {
            id: '1',
            _isCanonical: true,
            _aclVersion: 1,
            medicalData: { diagnosisCode: 'J06' }
        };

        const fresh = normalizePatient(outdated);

        expect(fresh).not.toBe(outdated);
        expect(fresh._aclVersion).toBe(PATIENT_ACL_VERSION);
        expect(fresh.medicalData.trueDiagnosisCode).toBe('J06');
    });

    it('strips legacy aliases from output', () => {
        const canonical = normalizePatient({
            id: '1',
            isBPJS: true,
            diagnosisCode: 'J06',
            icd10: 'J06',
            physicalExam: { chest: 'wheezing' },
            differentials: ['J18'],
            medicalData: {
                diagnosisCode: 'J06',
                icd10: 'J06',
                physicalExam: { chest: 'wheezing' },
                differentials: ['J18']
            },
            hidden: {
                bpjs: true,
                icd10: 'J06',
                differentials: ['J18'],
                diseaseId: 'ispa'
            }
        });

        expect(canonical.isBPJS).toBeUndefined();
        expect(canonical.diagnosisCode).toBeUndefined();
        expect(canonical.icd10).toBeUndefined();
        expect(canonical.physicalExam).toBeUndefined();
        expect(canonical.differentials).toBeUndefined();
        expect(canonical.medicalData.diagnosisCode).toBeUndefined();
        expect(canonical.medicalData.icd10).toBeUndefined();
        expect(canonical.medicalData.physicalExam).toBeUndefined();
        expect(canonical.medicalData.differentials).toBeUndefined();
        expect(canonical.hidden.bpjs).toBeUndefined();
        expect(canonical.hidden.icd10).toBeUndefined();
        expect(canonical.hidden.differentials).toBeUndefined();
        expect(canonical.hidden.diseaseId).toBe('ispa');
    });

    it('normalizes physical exam into canonical field', () => {
        const canonical = normalizePatient({
            id: '1',
            physicalExam: { chest: 'ronki' }
        });
        expect(canonical.medicalData.physicalExamFindings).toEqual({ chest: 'ronki' });
    });

    it('normalizePatientList filters null entries', () => {
        const normalized = normalizePatientList([{ id: '1' }, null, undefined, { id: '2' }]);
        expect(normalized).toHaveLength(2);
    });
});
