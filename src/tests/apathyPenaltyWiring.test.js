import { describe, expect, it } from 'vitest';
import { scoreCOMBDiagnosis } from '../game/BehaviorCaseEngine.js';
import { buildBehaviorCaseHistoryEntry } from '../utils/behaviorCaseRuntime.js';
import { countApathyEvents } from '../utils/scoringEngine.js';

// Regression guard for the P0 apathy-penalty fix:
//  (1) the empty-submission branch must write `comBDiagnosis` (capital B), not the
//      old `combDiagnosis` typo;
//  (2) the field must reach clinical history via buildBehaviorCaseHistoryEntry so
//      scoringEngine.countApathyEvents can actually see it (previously always 0).
describe('apathy penalty wiring (P0 fix)', () => {
    it('scoreCOMBDiagnosis writes comBDiagnosis with apathyPenalty on empty submission', () => {
        const scored = scoreCOMBDiagnosis({ scenarioId: 'bc_rokok_dalam_rumah' }, {});
        expect(scored.comBDiagnosis).toBeTruthy();
        expect(scored.comBDiagnosis.apathyPenalty).toBe(true);
        expect(scored.comBDiagnosis.score).toBe(0);
        // the old lowercase-b typo must be gone
        expect(scored.combDiagnosis).toBeUndefined();
    });

    it('buildBehaviorCaseHistoryEntry carries comBDiagnosis so countApathyEvents counts it', () => {
        const scored = scoreCOMBDiagnosis(
            { scenarioId: 'bc_rokok_dalam_rumah', instanceId: 'apathy-1', familyId: 'kk_01' },
            {}
        );
        const entry = buildBehaviorCaseHistoryEntry(
            { caseInstance: { ...scored, outcomeTier: 'fail' }, familyId: 'kk_01', outcomeTier: 'fail' },
            5
        );
        expect(entry.behaviorCase.comBDiagnosis?.apathyPenalty).toBe(true);
        expect(countApathyEvents([entry])).toBe(1);
    });

    it('a genuine (non-empty) diagnosis does NOT count as apathy', () => {
        const scored = scoreCOMBDiagnosis(
            { scenarioId: 'bc_rokok_dalam_rumah', instanceId: 'ok-1', familyId: 'kk_02' },
            { mot_aut: 0.8, opp_soc: 0.7 }
        );
        const entry = buildBehaviorCaseHistoryEntry(
            { caseInstance: { ...scored, outcomeTier: 'good' }, familyId: 'kk_02', outcomeTier: 'good' },
            6
        );
        expect(entry.behaviorCase.comBDiagnosis?.apathyPenalty).toBeFalsy();
        expect(countApathyEvents([entry])).toBe(0);
    });
});
