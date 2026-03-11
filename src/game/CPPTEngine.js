/**
 * @reflection
 * [IDENTITY]: CPPTEngine
 * [PURPOSE]: CPPTEngine.js Catatan Perkembangan Pasien Terintegrasi (CPPT) Builds a structured, persistent SOAP-based medical record 
 * [STATE]: Experimental
 * [ANCHOR]: buildCPPTRecord
 * [DEPENDS_ON]: AnamnesisEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

/**
 * CPPTEngine.js
 * Catatan Perkembangan Pasien Terintegrasi (CPPT)
 * 
 * Builds a structured, persistent SOAP-based medical record
 * from patient data captured during a clinical encounter.
 */

import { synthesizeAnamnesis } from './AnamnesisEngine.js';
import { randomIdFromSeed, seedKey } from '../utils/deterministicRandom.js';

/**
 * Build a complete CPPT record from discharge data.
 * @param {Object} patient - Full patient object from queue
 * @param {Object} decision - Discharge decision from PatientEMR
 * @param {number} day - Game day number
 * @param {number} time - Game time (in minutes from midnight)
 * @param {Object} options - Additional outcome data
 * @returns {Object} Structured CPPT record
 */
export function buildCPPTRecord(patient, decision, day, time, options = {}) {
    const {
        outcomeStatus = 'unknown',
        satisfactionScore = 0,
        isCorrectAction = false,
        isEmergency = false,
        handledBy = null
    } = options;

    const caseData = patient.medicalData || patient.hidden?.caseData || {};
    const anamnesisHistory = decision.anamnesisHistory || [];

    // Build anamnesis synthesis if we have history
    let anamnesisSynthesis = null;
    if (anamnesisHistory.length > 0) {
        try {
            anamnesisSynthesis = synthesizeAnamnesis(anamnesisHistory, caseData, patient);
        } catch (e) {
            console.warn('CPPT: Could not synthesize anamnesis', e);
        }
    }

    // Collect lab results that were actually revealed
    const labResults = {};
    if (decision.labsRevealed && caseData.labs) {
        Object.keys(decision.labsRevealed).forEach(labKey => {
            const labData = caseData.labs[labKey];
            if (labData) {
                labResults[labKey] = {
                    name: labKey,
                    result: labData.result,
                    unit: labData.unit || '',
                    normal: labData.normal || '',
                    flag: labData.flag || null
                };
            }
        });
    }

    // Collect physical exam findings that were examined
    const physicalFindings = {};
    if (decision.examsPerformed && caseData.physicalExamFindings) {
        decision.examsPerformed.forEach(examKey => {
            if (caseData.physicalExamFindings[examKey]) {
                physicalFindings[examKey] = caseData.physicalExamFindings[examKey];
            }
        });
    }

    return {
        id: generateCPPTId(patient, day, time, outcomeStatus),
        timestamp: {
            day,
            time,
            timeFormatted: `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`,
            createdAt: Date.now()
        },

        // Patient identifiers
        villagerId: patient.hidden?.villagerId || patient.social?.villagerId || null,
        familyId: patient.hidden?.familyId || null,
        patientName: patient.name,
        patientAge: patient.age,

        // Context
        isEmergency,
        handledBy: handledBy || 'Player',
        triageLevel: patient.hidden?.triageLevel || patient.triageLevel || null,

        // S: Subjective
        subjective: {
            chiefComplaint: patient.complaint || caseData.complaint || '',
            anamnesisSynthesis,   // structured checklist from synthesizeAnamnesis
            anamnesisScore: decision.anamnesisScore || 0
        },

        // O: Objective
        objective: {
            physicalFindings,
            labResults,
            examsPerformed: decision.examsPerformed || []
        },

        // A: Assessment
        assessment: {
            diagnoses: (decision.diagnoses || []).map(code => {
                // If it's already an object with code+name, use it; otherwise just code
                if (typeof code === 'object') return { code: code.code, name: code.name };
                return { code, name: code };
            }),
            trueDiagnosis: caseData.trueDiagnosisCode || null,
            trueDiagnosisName: caseData.diagnosisName || null,
            isCorrectDiagnosis: (decision.diagnoses || []).some(d => {
                const dCode = typeof d === 'string' ? d : d.code;
                return dCode === caseData.trueDiagnosisCode;
            })
        },

        // P: Planning
        planning: {
            action: decision.action || 'treat',
            medications: decision.medications || [],
            procedures: decision.procedures || [],
            education: decision.education || [],
            referralTarget: decision.referralTarget || null
        },

        // Outcome
        outcome: {
            status: outcomeStatus,
            satisfaction: satisfactionScore,
            isCorrectAction
        }
    };
}

/**
 * Build a minimal CPPT for MAIA-handled patients.
 */
export function buildMaiaCPPTRecord(patient, day, time, outcomeStatus, isEmergency = false) {
    const caseData = patient.medicalData || patient.hidden?.caseData || {};

    return {
        id: generateCPPTId(patient, day, time, outcomeStatus),
        timestamp: {
            day,
            time,
            timeFormatted: `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`,
            createdAt: Date.now()
        },
        villagerId: patient.hidden?.villagerId || patient.social?.villagerId || null,
        familyId: patient.hidden?.familyId || null,
        patientName: patient.name,
        patientAge: patient.age,
        isEmergency,
        handledBy: 'Dr. MAIA',
        triageLevel: patient.hidden?.triageLevel || patient.triageLevel || null,

        subjective: {
            chiefComplaint: patient.complaint || caseData.complaint || '',
            anamnesisSynthesis: null,
            anamnesisScore: 0
        },
        objective: {
            physicalFindings: {},
            labResults: {},
            examsPerformed: []
        },
        assessment: {
            diagnoses: caseData.trueDiagnosisCode
                ? [{ code: caseData.trueDiagnosisCode, name: caseData.diagnosisName || caseData.trueDiagnosisCode }]
                : [],
            trueDiagnosis: caseData.trueDiagnosisCode || null,
            trueDiagnosisName: caseData.diagnosisName || null,
            isCorrectDiagnosis: true
        },
        planning: {
            action: isEmergency ? 'stabilize' : 'treat',
            medications: caseData.correctTreatment || [],
            procedures: [],
            education: [],
            referralTarget: null
        },
        outcome: {
            status: outcomeStatus,
            satisfaction: 80,
            isCorrectAction: true
        }
    };
}

/**
 * Generate a unique-enough CPPT ID without crypto.
 */
function generateCPPTId(patient, day, time, outcomeStatus = 'unknown') {
    return randomIdFromSeed(
        'cppt',
        seedKey('cppt', patient?.id || patient?.name, day, time, outcomeStatus)
    );
}

export default buildCPPTRecord;
