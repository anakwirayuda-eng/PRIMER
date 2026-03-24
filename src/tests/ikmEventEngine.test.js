import { describe, expect, it } from 'vitest';

import { getScenarioById } from '../content/scenarios/IKMScenarioLibrary.js';
import {
    advanceEventPhase,
    calculateEventImpact,
    createEventInstance,
    resolveEvent
} from '../game/IKMEventEngine.js';

describe('IKMEventEngine.calculateEventImpact', () => {
    it('uses failure outcomes for fail-ending phases instead of always applying success bonuses', () => {
        const scenario = getScenarioById('bab_sembarangan');
        const event = createEventInstance(scenario, 1);
        const failedEvent = advanceEventPhase(event, 'resolution_fail');
        const resolved = resolveEvent(failedEvent);

        const impact = calculateEventImpact(resolved);

        expect(impact.iks_score).toBe(-3);
        expect(impact.outbreak_risk).toBe('diare');
        expect(impact.outbreak_risk_reduction).toBeUndefined();
    });

    it('still applies success outcomes for success-ending phases', () => {
        const scenario = getScenarioById('bab_sembarangan');
        const event = createEventInstance(scenario, 1);
        const successfulEvent = advanceEventPhase(event, 'resolution_success');
        const resolved = resolveEvent(successfulEvent);

        const impact = calculateEventImpact(resolved);

        expect(impact.iks_score).toBe(5);
        expect(impact.outbreak_risk_reduction).toBe('diare');
        expect(impact.outbreak_risk).toBeUndefined();
    });
});
