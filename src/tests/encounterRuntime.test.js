import { describe, expect, it } from 'vitest';
import {
    ENCOUNTER_ACL_VERSION,
    normalizeEncounter,
    normalizeEncounterList
} from '../models/EncounterRuntime.js';

describe('EncounterRuntime ACL', () => {
    it('preserves encounter fields while normalizing decision aliases', () => {
        const raw = {
            id: 'enc-1',
            day: 5,
            dischargedAt: 600,
            cpptRecord: { handledBy: 'Dr. Test' },
            decision: {
                action: 'treat',
                actions: ['oxygen'],
                diagnosis: 'J06.9'
            }
        };

        const canonical = normalizeEncounter(raw);

        expect(canonical.day).toBe(5);
        expect(canonical.dischargedAt).toBe(600);
        expect(canonical.cpptRecord).toEqual({ handledBy: 'Dr. Test' });
        expect(canonical.decision.action).toBe('treat');
        expect(canonical.decision.actionsPerformed).toEqual(['oxygen']);
        expect(canonical.decision.diagnoses).toEqual(['J06.9']);
        expect(canonical.decision.actions).toBeUndefined();
    });

    it('derives outcomeStatus from outcome when missing', () => {
        expect(normalizeEncounter({ id: 'good', outcome: 'good', decision: {} }).outcomeStatus).toBe('pulih');
        expect(normalizeEncounter({ id: 'bad', outcome: 'bad', decision: {} }).outcomeStatus).toBe('memburuk');
        expect(normalizeEncounter({ id: 'ref', outcome: 'referred', decision: { isSISRUTE: true } }).outcomeStatus).toBe('referred_sisrute');
    });

    it('is idempotent for current ACL version', () => {
        const first = normalizeEncounter({ id: 'enc-2', decision: { diagnosis: 'A00' } });
        const second = normalizeEncounter(first);
        expect(second).toBe(first);
    });

    it('re-normalizes outdated canonical entries', () => {
        const outdated = {
            id: 'enc-3',
            _isEncounterCanonical: true,
            _encounterAclVersion: 0,
            outcome: 'good',
            decision: { diagnosis: 'J00' }
        };

        const fresh = normalizeEncounter(outdated);

        expect(fresh).not.toBe(outdated);
        expect(fresh._encounterAclVersion).toBe(ENCOUNTER_ACL_VERSION);
        expect(fresh.decision.diagnoses).toEqual(['J00']);
        expect(fresh.outcomeStatus).toBe('pulih');
    });

    it('normalizeEncounterList filters null entries', () => {
        const normalized = normalizeEncounterList([{ id: '1', decision: {} }, null, undefined, { id: '2', decision: {} }]);
        expect(normalized).toHaveLength(2);
    });
});
