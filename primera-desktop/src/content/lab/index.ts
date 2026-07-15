import type { KasusKlinis } from '../types'
import type { LabArchetypeSpec } from './batch1'
import { LAB_BATCH_1_ARCHETYPE_SPECS, LAB_BATCH_1_CASES } from './batch1'
import { LAB_BATCH_2_ARCHETYPE_SPECS, LAB_BATCH_2_CASES } from './batch2'
import { LAB_BATCH_3_ARCHETYPE_SPECS, LAB_BATCH_3_CASES } from './batch3'

export const LAB_ALL_CASES: KasusKlinis[] = [
  ...LAB_BATCH_1_CASES,
  ...LAB_BATCH_2_CASES,
  ...LAB_BATCH_3_CASES,
]

export const LAB_ALL_ARCHETYPE_SPECS: Record<string, LabArchetypeSpec> = {
  ...LAB_BATCH_1_ARCHETYPE_SPECS,
  ...LAB_BATCH_2_ARCHETYPE_SPECS,
  ...LAB_BATCH_3_ARCHETYPE_SPECS,
}

/**
 * Tautan eksplisit menghindari salah-link saat dua entri katalog berbagi ICD-10
 * (misalnya vaginitis/BV, tinea kapitis/barbae, dan dua jenis trauma).
 */
export const LAB_CASE_ID_BY_FKTP_ITEM: Record<string, string> = {}

for (const [caseId, spec] of Object.entries(LAB_ALL_ARCHETYPE_SPECS)) {
  for (const credit of spec.credits) {
    if (!credit.startsWith('fktp144:')) continue
    const itemId = credit.slice('fktp144:'.length)
    const existing = LAB_CASE_ID_BY_FKTP_ITEM[itemId]
    if (existing && existing !== caseId) {
      throw new Error(`Item FKTP '${itemId}' ditautkan ke dua kasus lab: ${existing}, ${caseId}`)
    }
    LAB_CASE_ID_BY_FKTP_ITEM[itemId] = caseId
  }
}
