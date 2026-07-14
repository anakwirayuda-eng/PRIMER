/** M13-0D acceptance simulation. Not imported by the production renderer. */

import type { ContentPack } from '@content/pack'
import type { DexEntry, GameState, PasienAktif } from './state'
import { buildInitialState } from './init'
import { susunAntrianHarian } from './director'
import { Rng } from './core/rng'
import type { PaketUjian } from './paketUjian'
import {
  EXAM_BLUEPRINT,
  hitungExamQuota,
  susunExamPackageSchedule,
  validasiExamBlueprint,
  type ExamBotProfile,
  type ExamQuotaMetrics,
} from './examBlueprint'

interface Shares {
  female: number
  pediatric: number
  adult: number
  older: number
}

interface RunResult {
  packageId: string
  profile: ExamBotProfile
  sample: number
  flavorSeed: number
  scheduleKey: string
  quota: ExamQuotaMetrics
  shares: Shares
}

export interface DescriptiveStatistics {
  min: number
  max: number
  mean: number
  standardDeviation: number
  range: number
}

export interface ExamSimulationGroup {
  packageId: string
  profile: ExamBotProfile
  runs: number
  uniqueScheduleKeys: number
  demographics: Record<keyof Shares, DescriptiveStatistics>
}

export interface ExamSimulationReport {
  schemaVersion: 1
  blueprintVersion: string
  contentRelease: string
  packages: number
  flavorSeedsPerPackage: number
  botProfiles: readonly ExamBotProfile[]
  matrixRuns: number
  controlledClinicSlotsPerRun: number
  exactIgdEventsPerRun: number
  groups: ExamSimulationGroup[]
  maximumPairwiseSameSlotShare: number
  packageMeanShareSpread: Record<keyof Shares, number>
  allSchedulesInvariantAcrossFlavor: boolean
  allSchedulesInvariantAcrossBot: boolean
  exploratoryNotGates: typeof EXAM_BLUEPRINT.simulation.exploratoryNotGates
  errors: string[]
}

function statistics(values: readonly number[]): DescriptiveStatistics {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length
  return { min, max, mean, standardDeviation: Math.sqrt(variance), range: max - min }
}

function sameCountRecord(
  expected: Readonly<Record<string, number>>,
  actual: Readonly<Record<string, number>>,
): boolean {
  const keys = new Set([...Object.keys(expected), ...Object.keys(actual)])
  return [...keys].every((key) => (expected[key] ?? 0) === (actual[key] ?? 0))
}

function quotaIsExact(quota: ExamQuotaMetrics): boolean {
  const expected = EXAM_BLUEPRINT.clinic.quotas
  return (
    quota.total === expected.total &&
    quota.uniqueCases === expected.uniqueCases &&
    sameCountRecord(quota.tier, expected.tier) &&
    sameCountRecord(quota.category, expected.category) &&
    sameCountRecord(quota.severity, expected.severity) &&
    quota.referral === expected.referral &&
    quota.trap === expected.trap &&
    sameCountRecord(quota.ageEligibility, expected.ageEligibility) &&
    sameCountRecord(quota.genderEligibility, expected.genderEligibility) &&
    sameCountRecord(quota.caseCounts, EXAM_BLUEPRINT.clinic.caseCounts)
  )
}

function updateDex(
  dex: Readonly<Record<string, DexEntry>>,
  patients: readonly PasienAktif[],
  profile: ExamBotProfile,
  day: number,
): Record<string, DexEntry> {
  const next = { ...dex }
  for (const patient of patients) {
    const previous = next[patient.kasusId]
    const ditangani = (previous?.ditangani ?? 0) + 1
    const benar = (previous?.benar ?? 0) + (profile === 'strong' ? 1 : 0)
    next[patient.kasusId] = {
      kasusId: patient.kasusId,
      ditangani,
      benar,
      bintang: profile === 'strong' ? 3 : 0,
      terakhirHari: day,
    }
  }
  return next
}

function demographicShares(patients: readonly PasienAktif[]): Shares {
  const denominator = patients.length
  const female = patients.filter((patient) => patient.jenisKelamin === 'P').length
  const pediatric = patients.filter((patient) => patient.usia < 18).length
  const adult = patients.filter((patient) => patient.usia >= 18 && patient.usia < 60).length
  const older = patients.filter((patient) => patient.usia >= 60).length
  return {
    female: female / denominator,
    pediatric: pediatric / denominator,
    adult: adult / denominator,
    older: older / denominator,
  }
}

function simulateRun(
  pack: ContentPack,
  paket: PaketUjian,
  packageIndex: number,
  packageCount: number,
  sample: number,
  profile: ExamBotProfile,
  errors: Set<string>,
): RunResult {
  const flavorSeed = packageIndex + packageCount * (sample + 1)
  let state = buildInitialState(`Sim ${paket.id}`, flavorSeed, pack, { mode: 'ujian' })
  if (state.paketUjian !== paket.id) {
    errors.add(`${paket.id}: flavor seed ${flavorSeed} jatuh ke ${state.paketUjian ?? 'tanpa paket'}`)
  }
  let dex: Record<string, DexEntry> = {}
  const patients: PasienAktif[] = []
  const caseIds: string[] = []
  for (let day = 1; day <= EXAM_BLUEPRINT.durationDays; day++) {
    const dayState: GameState = { ...state, hari: day, dex }
    // Stress input perilaku: bot ceroboh dianggap memicu konflik follow-up
    // terhadap seluruh controlled draw hari itu. Jadwal tetap wajib identik.
    const behaviorExclusions =
      profile === 'weak_careless'
        ? susunExamPackageSchedule(pack, paket).clinicDays[day - 1] ?? []
        : []
    const queue = susunAntrianHarian(
      dayState,
      pack,
      new Rng(paket.seedKurikulum, 'director', day),
      behaviorExclusions,
      new Rng(flavorSeed, 'director-flavor', day),
    )
    for (const patient of queue) {
      const kasus = pack.kasus[patient.kasusId]
      if (
        !kasus ||
        patient.usia < kasus.demografi.usiaMin ||
        patient.usia > kasus.demografi.usiaMax ||
        (kasus.demografi.jenisKelamin && patient.jenisKelamin !== kasus.demografi.jenisKelamin)
      ) {
        errors.add(`${paket.id}: flavor pasien keluar eligibility pada sample ${sample}`)
      }
    }
    patients.push(...queue)
    caseIds.push(...queue.map((patient) => patient.kasusId))
    dex = updateDex(dex, queue, profile, day)
    state = dayState
  }
  return {
    packageId: paket.id,
    profile,
    sample,
    flavorSeed,
    scheduleKey: caseIds.join('|'),
    quota: hitungExamQuota(caseIds, pack),
    shares: demographicShares(patients),
  }
}

function pairwiseSameSlotShare(pack: ContentPack, packages: readonly PaketUjian[]): number {
  let maximum = 0
  for (let a = 0; a < packages.length; a++) {
    const left = susunExamPackageSchedule(pack, packages[a]!).clinicDays.flat()
    for (let b = a + 1; b < packages.length; b++) {
      const right = susunExamPackageSchedule(pack, packages[b]!).clinicDays.flat()
      const same = left.filter((id, index) => id === right[index]).length
      maximum = Math.max(maximum, same / left.length)
    }
  }
  return maximum
}

export function runExamBlueprintSimulation(
  pack: ContentPack,
  packages: readonly PaketUjian[],
): ExamSimulationReport {
  const errors = new Set(validasiExamBlueprint(EXAM_BLUEPRINT, pack, packages))
  const runs: RunResult[] = []
  for (const [packageIndex, paket] of packages.entries()) {
    for (let sample = 0; sample < EXAM_BLUEPRINT.simulation.flavorSeedsPerPackage; sample++) {
      for (const profile of EXAM_BLUEPRINT.simulation.botProfiles) {
        runs.push(simulateRun(pack, paket, packageIndex, packages.length, sample, profile, errors))
      }
    }
  }

  for (const run of runs) {
    if (!quotaIsExact(run.quota)) {
      errors.add(`${run.packageId}/${run.profile}/sample-${run.sample}: quota tidak exact`)
    }
    for (const dimension of ['female', 'pediatric', 'adult', 'older'] as const) {
      const range = EXAM_BLUEPRINT.simulation.tolerances.realizedDemographicsPerRun[dimension]
      if (run.shares[dimension] < range.min || run.shares[dimension] > range.max) {
        errors.add(
          `${run.packageId}/${run.profile}/sample-${run.sample}: ${dimension} ${run.shares[dimension].toFixed(3)} di luar toleransi`,
        )
      }
    }
  }

  let invariantAcrossFlavor = true
  for (const paket of packages) {
    for (const profile of EXAM_BLUEPRINT.simulation.botProfiles) {
      const keys = new Set(
        runs
          .filter((run) => run.packageId === paket.id && run.profile === profile)
          .map((run) => run.scheduleKey),
      )
      if (keys.size !== 1) {
        invariantAcrossFlavor = false
        errors.add(`${paket.id}/${profile}: schedule berubah lintas flavor`)
      }
    }
  }

  let invariantAcrossBot = true
  for (const paket of packages) {
    for (let sample = 0; sample < EXAM_BLUEPRINT.simulation.flavorSeedsPerPackage; sample++) {
      const keys = new Set(
        runs
          .filter((run) => run.packageId === paket.id && run.sample === sample)
          .map((run) => run.scheduleKey),
      )
      if (keys.size !== 1) {
        invariantAcrossBot = false
        errors.add(`${paket.id}/sample-${sample}: schedule berubah lintas bot`)
      }
    }
  }

  const groups: ExamSimulationGroup[] = []
  for (const paket of packages) {
    for (const profile of EXAM_BLUEPRINT.simulation.botProfiles) {
      const selected = runs.filter((run) => run.packageId === paket.id && run.profile === profile)
      groups.push({
        packageId: paket.id,
        profile,
        runs: selected.length,
        uniqueScheduleKeys: new Set(selected.map((run) => run.scheduleKey)).size,
        demographics: {
          female: statistics(selected.map((run) => run.shares.female)),
          pediatric: statistics(selected.map((run) => run.shares.pediatric)),
          adult: statistics(selected.map((run) => run.shares.adult)),
          older: statistics(selected.map((run) => run.shares.older)),
        },
      })
    }
  }

  const packageMeans = new Map<string, Shares>()
  for (const paket of packages) {
    const selected = runs.filter((run) => run.packageId === paket.id)
    packageMeans.set(paket.id, {
      female: statistics(selected.map((run) => run.shares.female)).mean,
      pediatric: statistics(selected.map((run) => run.shares.pediatric)).mean,
      adult: statistics(selected.map((run) => run.shares.adult)).mean,
      older: statistics(selected.map((run) => run.shares.older)).mean,
    })
  }
  const packageMeanShareSpread = Object.fromEntries(
    (['female', 'pediatric', 'adult', 'older'] as const).map((dimension) => {
      const values = [...packageMeans.values()].map((shares) => shares[dimension])
      return [dimension, Math.max(...values) - Math.min(...values)]
    }),
  ) as Record<keyof Shares, number>
  for (const [dimension, spread] of Object.entries(packageMeanShareSpread)) {
    if (spread > EXAM_BLUEPRINT.simulation.tolerances.maxPackageMeanShareSpread) {
      errors.add(`Package mean spread ${dimension} ${spread.toFixed(3)} melebihi toleransi`)
    }
  }

  const maximumPairwiseSameSlotShare = pairwiseSameSlotShare(pack, packages)
  if (maximumPairwiseSameSlotShare > EXAM_BLUEPRINT.simulation.tolerances.maxPairwiseSameSlotShare) {
    errors.add(`Pairwise same-slot share ${maximumPairwiseSameSlotShare.toFixed(3)} melebihi toleransi`)
  }

  return {
    schemaVersion: 1,
    blueprintVersion: EXAM_BLUEPRINT.blueprintVersion,
    contentRelease: EXAM_BLUEPRINT.contentRelease,
    packages: packages.length,
    flavorSeedsPerPackage: EXAM_BLUEPRINT.simulation.flavorSeedsPerPackage,
    botProfiles: EXAM_BLUEPRINT.simulation.botProfiles,
    matrixRuns: runs.length,
    controlledClinicSlotsPerRun: EXAM_BLUEPRINT.clinic.quotas.total,
    exactIgdEventsPerRun: EXAM_BLUEPRINT.igd.exactEvents,
    groups,
    maximumPairwiseSameSlotShare,
    packageMeanShareSpread,
    allSchedulesInvariantAcrossFlavor: invariantAcrossFlavor,
    allSchedulesInvariantAcrossBot: invariantAcrossBot,
    exploratoryNotGates: EXAM_BLUEPRINT.simulation.exploratoryNotGates,
    errors: [...errors].sort(),
  }
}
