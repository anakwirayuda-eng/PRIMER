import { getDiseaseScenarioById } from '../content/scenarios/DiseaseScenarios.js';
import {
    advanceReadiness,
    initializeReadinessState,
    recordVisit
} from '../domains/village/NPCReadiness.js';

const hasReadinessEntries = (value) => (
    Boolean(value) &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0
);

export function mapOutcomeTierToBehaviorOutcome(outcomeTier) {
    if (outcomeTier === 'fail') return 'failed';
    if (outcomeTier === 'partial') return 'partial';
    return 'successful';
}

export function ensureVillageReadinessState(villageData) {
    if (!villageData || typeof villageData !== 'object') {
        return villageData;
    }

    if (hasReadinessEntries(villageData.readinessState)) {
        return villageData;
    }

    return {
        ...villageData,
        readinessState: initializeReadinessState()
    };
}

export function applyBehaviorCaseOutcomeToVillage(villageData, result, day) {
    const nextVillage = ensureVillageReadinessState(villageData);
    if (!nextVillage?.readinessState) {
        return nextVillage;
    }

    const familyId = result?.familyId || result?.caseInstance?.familyId || null;
    if (!familyId) {
        return nextVillage;
    }

    const outcomeTier = result?.outcomeTier || result?.caseInstance?.outcomeTier || 'partial';
    const visitedState = recordVisit(nextVillage.readinessState, familyId, day);
    const advanced = advanceReadiness(visitedState, familyId, outcomeTier, day);
    const scenarioId = result?.caseInstance?.scenarioId || null;
    const nextReadinessState = advanced.state || visitedState;

    if (scenarioId && nextReadinessState[familyId]) {
        const currentFamilyState = nextReadinessState[familyId];
        nextReadinessState[familyId] = {
            ...currentFamilyState,
            scenarioHistory: Array.from(new Set([...(currentFamilyState.scenarioHistory || []), scenarioId]))
        };
    }

    return {
        ...nextVillage,
        readinessState: nextReadinessState
    };
}

export function buildBehaviorCaseHistoryEntry(result, day) {
    const caseInstance = result?.caseInstance || {};
    const scenario = getDiseaseScenarioById(caseInstance.scenarioId);
    const familyId = result?.familyId || caseInstance.familyId || null;
    const outcomeTier = result?.outcomeTier || caseInstance.outcomeTier || 'partial';

    return {
        id: `behavior-case:${caseInstance.instanceId || `${caseInstance.scenarioId || 'unknown'}:${familyId || 'family'}:${day}`}`,
        type: 'behavior_case',
        day,
        label: scenario?.title || caseInstance.title || 'Behavior Change Case',
        name: scenario?.title || caseInstance.title || 'Behavior Change Case',
        description: scenario?.targetBehavior || 'Intervensi perubahan perilaku diselesaikan.',
        familyId,
        behaviorCase: {
            instanceId: caseInstance.instanceId || null,
            scenarioId: caseInstance.scenarioId || null,
            scenario,
            outcome: mapOutcomeTierToBehaviorOutcome(outcomeTier),
            outcomeTier,
            completedOnDay: day,
            familyId,
            xpEarned: result?.xpEarned ?? caseInstance.xpEarned ?? 0,
            reputationDelta: result?.reputationDelta ?? caseInstance.reputationDelta ?? 0,
            readinessCurrent: caseInstance.readinessCurrent || null,
            readinessAdvanced: Boolean(caseInstance.readinessAdvanced),
            ukpTriggered: Boolean(result?.ukpTriggered ?? caseInstance.ukpTriggered),
            ukpDelayDays: result?.ukpDelayDays ?? caseInstance.ukpDelayDays ?? null,
            ukpDiseaseId: result?.ukpDiseaseId ?? caseInstance.ukpDiseaseId ?? null,
            evidenceGathered: Array.isArray(result?.evidenceGathered) ? result.evidenceGathered : []
        }
    };
}

export function buildBehaviorCaseDebriefState(villageData, history = [], day = 1) {
    const nextVillage = ensureVillageReadinessState(villageData);
    const readinessState = nextVillage?.readinessState
        ? Object.fromEntries(
            Object.entries(nextVillage.readinessState).filter(([, data]) => (
                (data?.visitCount || 0) > 0 ||
                (data?.stageHistory?.length || 0) > 0 ||
                (data?.scenarioHistory?.length || 0) > 0
            ))
        )
        : {};
    const safeHistory = Array.isArray(history) ? history : [];
    const numericDay = Number(day);

    return {
        activeCases: Array.isArray(nextVillage?.families)
            ? nextVillage.families
                .filter((family) => typeof family?.activeScenarioId === 'string' && family.activeScenarioId.length > 0)
                .map((family) => ({ familyId: family.id, scenarioId: family.activeScenarioId }))
            : [],
        completedToday: safeHistory
            .filter((entry) => Number(entry?.day) === numericDay && entry?.behaviorCase)
            .map((entry) => ({
                scenarioId: entry.behaviorCase.scenarioId,
                outcomeTier: entry.behaviorCase.outcomeTier,
                familyId: entry.behaviorCase.familyId || null,
                xpEarned: entry.behaviorCase.xpEarned || 0
            })),
        readinessState
    };
}

export function collectPendingUkpBridgeCases(history = []) {
    const safeHistory = Array.isArray(history) ? history : [];
    return safeHistory
        .filter((entry) => {
            const behaviorCase = entry?.behaviorCase;
            return behaviorCase &&
                (behaviorCase.outcome === 'failed' || behaviorCase.outcome === 'partial') &&
                !behaviorCase.ukpBridgeSpawnedOnDay;
        })
        .map((entry) => ({
            historyEntryId: entry.id,
            scenarioId: entry.behaviorCase.scenarioId,
            outcome: entry.behaviorCase.outcome,
            completedOnDay: entry.behaviorCase.completedOnDay || entry.day,
            scenario: entry.behaviorCase.scenario
        }));
}

export function markBehaviorCaseBridgeSpawned(history = [], historyEntryIds = [], day = 1) {
    if (!Array.isArray(history) || !Array.isArray(historyEntryIds) || historyEntryIds.length === 0) {
        return Array.isArray(history) ? history : [];
    }

    const idSet = new Set(historyEntryIds.filter(Boolean));
    if (idSet.size === 0) {
        return history;
    }

    return history.map((entry) => {
        if (!idSet.has(entry?.id) || !entry?.behaviorCase) {
            return entry;
        }

        return {
            ...entry,
            behaviorCase: {
                ...entry.behaviorCase,
                ukpBridgeSpawnedOnDay: day
            }
        };
    });
}
