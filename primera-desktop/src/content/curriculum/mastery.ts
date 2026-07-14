import type {
  ClinicalMasteryCredit,
  ClinicalMasteryOutcome,
  CurriculumBlueprint,
  UkmMasteryCredit,
} from './types'

export const MASTERY_AGGREGATION_RULES = {
  encountered: 'Semua item UKP yang berelasi dengan concept archetype boleh ditandai dijumpai.',
  certified: 'Hanya credits eksplisit dari archetype klinik dengan diagnosis dan disposisi benar.',
  mastered: 'Tetap melekat pada archetype individual; tidak digabung otomatis ke concept atau item.',
} as const

export function evaluasiMasteryKlinis(
  blueprint: CurriculumBlueprint,
  archetypeId: string,
  outcome: ClinicalMasteryOutcome,
): ClinicalMasteryCredit {
  const archetype = blueprint.encounterArchetypes.find((candidate) => candidate.id === archetypeId)
  if (!archetype) throw new Error(`EncounterArchetype '${archetypeId}' tidak ada`)

  const ukpItemIds = new Set(
    blueprint.curriculumItems.filter((item) => item.domain === 'ukp').map((item) => item.id),
  )
  const encounteredItemIds = outcome.encountered
    ? blueprint.itemConcepts
        .filter((relation) => relation.conceptId === archetype.conceptId && ukpItemIds.has(relation.itemId))
        .map((relation) => relation.itemId)
        .sort()
    : []

  const canCertify =
    outcome.encountered &&
    outcome.diagnosisCorrect &&
    outcome.dispositionCorrect &&
    archetype.channel === 'clinic'

  return {
    encounteredItemIds,
    certifiedItemIds: canCertify ? [...archetype.credits].sort() : [],
    masteredArchetypeIds: outcome.encountered && outcome.masteryAchieved ? [archetype.id] : [],
  }
}

export function evaluasiMasteryUkm(
  blueprint: CurriculumBlueprint,
  scenarioId: string,
  outcome: { encountered: boolean; completedSuccessfully: boolean; masteryAchieved: boolean },
): UkmMasteryCredit {
  const scenario = blueprint.ukmScenarios.find((candidate) => candidate.id === scenarioId)
  if (!scenario) throw new Error(`UkmScenario '${scenarioId}' tidak ada`)

  return {
    encounteredItemIds: outcome.encountered ? [...scenario.credits].sort() : [],
    certifiedItemIds: outcome.encountered && outcome.completedSuccessfully ? [...scenario.credits].sort() : [],
    masteredScenarioIds: outcome.encountered && outcome.masteryAchieved ? [scenario.id] : [],
  }
}
