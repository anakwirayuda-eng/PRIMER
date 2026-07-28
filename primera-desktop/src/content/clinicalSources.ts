import {
  CLINICAL_SOURCE_ASSIGNMENTS,
  CLINICAL_SOURCE_REGISTRY,
} from './clinicalSourceAssignments.generated'
import type { KasusKlinis, SumberKlinis } from './types'

/**
 * Memasang provenance terkurasi per encounter. Registry dibangkitkan dari
 * crosswalk M13 dan daftar baseline eksplisit; tidak ada inferensi regex saat
 * runtime sehingga perubahan kalimat debrief tidak dapat menggeser sumber.
 */
export function lengkapiSumberKlinis(kasus: KasusKlinis): KasusKlinis {
  const sumberLama = (kasus.sumber ?? []).map((item) => ({
    ...item,
    cakupan: item.cakupan ?? ('langsung' as const),
  }))
  const lamaLengkap =
    sumberLama.some((item) => item.jenis === 'pedoman_indonesia') &&
    sumberLama.some((item) => item.jenis === 'evidence_internasional')
  if (lamaLengkap) {
    return {
      ...kasus,
      sumber: sumberLama,
    }
  }

  const assignments =
    CLINICAL_SOURCE_ASSIGNMENTS[
      kasus.id as keyof typeof CLINICAL_SOURCE_ASSIGNMENTS
    ]
  if (!assignments) return kasus

  const generated: SumberKlinis[] = assignments.map((assignment) => ({
    ...CLINICAL_SOURCE_REGISTRY[assignment.sourceId],
    cakupan: assignment.cakupan,
    ...('catatan' in assignment && assignment.catatan
      ? { catatan: assignment.catatan }
      : {}),
  }))
  const sumber = [...sumberLama, ...generated].filter(
    (item, index, all) =>
      all.findIndex(
        (candidate) => candidate.id === item.id || candidate.url === item.url,
      ) === index,
  )
  return { ...kasus, sumber }
}
