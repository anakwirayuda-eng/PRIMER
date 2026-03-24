import { describe, expect, it } from 'vitest';

import { checkForOutbreakTrigger } from '../domains/community/OutbreakSystem.js';

const villageData = {
    families: [
        { id: 'kk_01', houseId: 'house_01' }
    ]
};

describe('checkForOutbreakTrigger risk modifiers', () => {
    it('suppresses outbreaks while a protection window is active', () => {
        const history = [
            { day: 5, medicalData: { trueDiagnosisCode: 'A09' }, hidden: { familyId: 'kk_01' } },
            { day: 4, medicalData: { trueDiagnosisCode: 'A09' }, hidden: { familyId: 'kk_01' } },
            { day: 3, medicalData: { trueDiagnosisCode: 'A09' }, hidden: { familyId: 'kk_01' } }
        ];

        const baseline = checkForOutbreakTrigger(history, villageData, 5, []);
        const blocked = checkForOutbreakTrigger(history, villageData, 5, [], {
            protectedUntil: { diare: 10 },
            vulnerableUntil: {}
        });

        expect(baseline?.type).toBe('diare');
        expect(blocked).toBeNull();
    });

    it('lowers the case threshold while a vulnerability window is active', () => {
        const history = [
            { day: 5, medicalData: { trueDiagnosisCode: 'A90' }, hidden: { familyId: 'kk_01' } }
        ];

        const baseline = checkForOutbreakTrigger(history, villageData, 5, []);
        const vulnerable = checkForOutbreakTrigger(history, villageData, 5, [], {
            protectedUntil: {},
            vulnerableUntil: { dbd: 10 }
        });

        expect(baseline).toBeNull();
        expect(vulnerable?.type).toBe('dbd');
    });
});
