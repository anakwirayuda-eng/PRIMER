import { describe, expect, it } from 'vitest';
import { EMERGENCY_CASES } from '../game/EmergencyCases.js';
import { EMERGENCY_ACTIONS, PATIENT_STATUS } from '../game/EmergencyCases.js';
import enEmergency from '../locales/emergency/en.js';
import idEmergency from '../locales/emergency/id.js';

function getMissingCaseIds(localeResource) {
    const localizedCaseIds = new Set(Object.keys(localeResource.emergency.caseData || {}));
    return EMERGENCY_CASES
        .map((emergencyCase) => emergencyCase.id)
        .filter((caseId) => !localizedCaseIds.has(caseId));
}

function getMissingActionIds(localeResource) {
    const localizedActionIds = new Set(Object.keys(localeResource.emergency.actions || {}));
    return Object.keys(EMERGENCY_ACTIONS).filter((actionId) => !localizedActionIds.has(actionId));
}

function getMissingStatusIds(localeResource) {
    const localizedStatusIds = new Set(Object.keys(localeResource.emergency.patientStatus || {}));
    return Object.keys(PATIENT_STATUS).filter((statusId) => !localizedStatusIds.has(statusId));
}

describe('emergency locale coverage', () => {
    it('keeps English emergency caseData coverage complete', () => {
        expect(getMissingCaseIds(enEmergency)).toEqual([]);
    });

    it('keeps Indonesian emergency caseData coverage complete', () => {
        expect(getMissingCaseIds(idEmergency)).toEqual([]);
    });

    it('keeps English emergency action coverage complete', () => {
        expect(getMissingActionIds(enEmergency)).toEqual([]);
    });

    it('keeps Indonesian emergency action coverage complete', () => {
        expect(getMissingActionIds(idEmergency)).toEqual([]);
    });

    it('keeps emergency status coverage complete for both locales', () => {
        expect(getMissingStatusIds(enEmergency)).toEqual([]);
        expect(getMissingStatusIds(idEmergency)).toEqual([]);
    });
});
