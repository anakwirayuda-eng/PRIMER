/**
 * @reflection
 * [IDENTITY]: EncounterRuntime (Anti-Corruption Layer)
 * [PURPOSE]: Absorbs encounter/history alias drift and outputs one stable shape.
 * [STATE]: Production
 * [ANCHOR]: normalizeEncounter
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-25
 */

export const ENCOUNTER_ACL_VERSION = 1;

function toDiagnosisArray(diagnoses, diagnosis) {
    if (Array.isArray(diagnoses)) return diagnoses;
    if (typeof diagnoses === 'string' && diagnoses.trim()) return [diagnoses.trim()];
    if (typeof diagnosis === 'string' && diagnosis.trim()) return [diagnosis.trim()];
    return [];
}

function toActionsPerformed(actionsPerformed, actions) {
    if (Array.isArray(actionsPerformed)) return actionsPerformed;
    if (Array.isArray(actions)) return actions;
    return [];
}

function deriveOutcomeStatus(raw, decision) {
    if (typeof raw?.outcomeStatus === 'string' && raw.outcomeStatus.trim()) {
        return raw.outcomeStatus;
    }

    const outcome = typeof raw?.outcome === 'string' ? raw.outcome.trim() : '';
    if (outcome === 'good') return 'pulih';
    if (outcome === 'bad') return 'memburuk';
    if (outcome === 'delegated') return 'delegated';
    if (outcome === 'stabilized') return 'stabilized';
    if (outcome === 'referred') return decision?.isSISRUTE ? 'referred_sisrute' : 'referred';
    if (outcome) return outcome;

    if (decision?.action === 'delegate_to_maia') return 'delegated';
    if (decision?.action === 'stabilize') return 'stabilized';
    if (decision?.action === 'refer') return decision?.isSISRUTE ? 'referred_sisrute' : 'referred';

    return 'pulih';
}

export function normalizeEncounter(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (raw._isEncounterCanonical && raw._encounterAclVersion === ENCOUNTER_ACL_VERSION) {
        return raw;
    }

    const rawDecision = raw.decision && typeof raw.decision === 'object' ? raw.decision : {};
    const actionsPerformed = toActionsPerformed(rawDecision.actionsPerformed, rawDecision.actions);
    const diagnoses = toDiagnosisArray(rawDecision.diagnoses, rawDecision.diagnosis);
    const outcomeStatus = deriveOutcomeStatus(raw, rawDecision);

    return {
        ...raw,
        _isEncounterCanonical: true,
        _encounterAclVersion: ENCOUNTER_ACL_VERSION,
        decision: {
            ...rawDecision,
            actionsPerformed,
            diagnoses,
            actions: undefined
        },
        outcomeStatus
    };
}

export function normalizeEncounterList(rawList = []) {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(normalizeEncounter).filter(Boolean);
}
