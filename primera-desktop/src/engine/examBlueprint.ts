/**
 * M13-0D constrained exam blueprint.
 *
 * Mode Ujian memakai multiset kasus dan jadwal IGD yang dikunci di sini.
 * Performa mahasiswa boleh menambah encounter konsekuensi (follow-up/karma),
 * tetapi tidak boleh mengubah 98 slot Director yang menjadi denominator kuota.
 */

import { CONTENT_RELEASE, encounterArchetypeAktif, type ContentPack } from '@content/pack'
import type { KategoriKasus, KasusKlinis } from '@content/types'
import type { SeverityDegree } from '@content/curriculum/types'
import { Rng } from './core/rng'
import { KASUS_TUTORIAL } from './tutorial'
import type { PaketUjian } from './paketUjian'

export const EXAM_BLUEPRINT_VERSION = 'm13-0d-v1'

export type ExamExposureTier = 'A' | 'B' | 'C'
export type ExamAgeEligibility =
  | 'pediatric_only'
  | 'crosses_pediatric_adult'
  | 'adult_only'
  | 'adult_older'
export type ExamGenderEligibility = 'any' | 'female_only' | 'male_only'
export type ExamBotProfile = 'strong' | 'weak_careless'

export interface ExamCaseProfile {
  id: string
  tier: ExamExposureTier
  category: KategoriKasus
  severity: SeverityDegree
  referral: boolean
  trap: boolean
  ageEligibility: ExamAgeEligibility
  genderEligibility: ExamGenderEligibility
}

export interface ExamQuotaMetrics {
  total: number
  uniqueCases: number
  tier: Record<ExamExposureTier, number>
  category: Record<KategoriKasus, number>
  severity: Record<SeverityDegree, number>
  referral: number
  trap: number
  ageEligibility: Record<ExamAgeEligibility, number>
  genderEligibility: Record<ExamGenderEligibility, number>
  caseCounts: Record<string, number>
}

export interface ExamPackageSchedule {
  packageId: string
  blueprintVersion: string
  contentRelease: string
  clinicDays: readonly (readonly string[])[]
  igdEvents: readonly { day: number; caseId: string }[]
}

export interface ExamBlueprint {
  schemaVersion: 1
  blueprintVersion: string
  contentRelease: string
  durationDays: 30
  definitions: {
    controlledDraw: string
    supplementalEncounter: string
    tier: Record<ExamExposureTier, string>
    demographics: string
  }
  clinic: {
    dailyCapacities: readonly number[]
    baselineCaseIds: readonly string[]
    repeatCounts: Readonly<Record<string, number>>
    caseCounts: Readonly<Record<string, number>>
    packageAnchors: Readonly<Record<string, string>>
    quotas: Omit<ExamQuotaMetrics, 'caseCounts'>
    constraints: {
      tutorialCaseId: string
      maxReferralPerDay: 1
      maxSameCategoryPerDay: 2
      minRepeatGapDays: 2
    }
  }
  igd: {
    caseIds: readonly string[]
    exactEvents: 5
    minGapDays: 4
  }
  simulation: {
    flavorSeedsPerPackage: 32
    botProfiles: readonly ExamBotProfile[]
    statistics: readonly ['min', 'max', 'mean', 'standardDeviation', 'range']
    tolerances: {
      exactQuotaDelta: 0
      scheduleMismatchAcrossFlavor: 0
      scheduleMismatchAcrossBot: 0
      maxPairwiseSameSlotShare: number
      maxPackageMeanShareSpread: number
      realizedDemographicsPerRun: {
        female: { min: number; max: number }
        pediatric: { min: number; max: number }
        adult: { min: number; max: number }
        older: { min: number; max: number }
      }
    }
    exploratoryNotGates: {
      maxScoreSpreadAcrossPackages: number
      note: string
    }
  }
}

const DAILY_CAPACITIES = [
  2, 2,
  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
] as const

/** Explicit active-pool lock. A new Ujian case requires a blueprint revision. */
const BASELINE_CASE_IDS = [
  'anemia_defisiensi_bumil',
  'apendisitis_akut',
  'askariasis',
  'asma_ringan',
  'bronkitis_akut',
  'demam_tifoid',
  'dengue_df',
  'diare_akut_anak',
  'disentri_basiler',
  'dispepsia_fungsional',
  'dm_tipe2',
  'faringitis_akut',
  'gastritis',
  'gerd',
  'hemoroid_grade1',
  'hipertensi_esensial',
  'ispa_common_cold',
  'jiwa_depresi_ringan',
  'jiwa_gangguan_cemas',
  'jiwa_insomnia',
  'jiwa_skizofrenia',
  'kia_abortus_iminens',
  'kia_anc_kehamilan_normal',
  'kia_isk_kehamilan',
  'kia_kb_konseling',
  'kia_malaria_falsiparum',
  'kia_preeklampsia_berat',
  'konjungtivitis_bakterial',
  'kulit_dermatitis_kontak',
  'kulit_herpes_zoster',
  'kulit_kandidiasis_kutis',
  'kulit_morbili',
  'kulit_pedikulosis_kapitis',
  'kulit_pioderma_impetigo',
  'kulit_tinea_korporis',
  'kulit_urtikaria_akut',
  'kulit_varisela',
  'kulit_veruka_vulgaris',
  'mata_glaukoma_akut',
  'mata_hordeolum',
  'mata_konjungtivitis_alergi',
  'mm_artritis_reumatoid',
  'mm_dislipidemia',
  'mm_gagal_jantung_kongestif',
  'mm_gout_artritis_akut',
  'mm_hipertensi_urgensi',
  'mm_isk_bawah',
  'mm_low_back_pain',
  'mm_mialgia',
  'mm_obesitas',
  'mm_osteoartritis_lutut',
  'otitis_media_akut',
  'pneumonia_balita',
  'ppok_eksaserbasi',
  'rinitis_alergi',
  'saraf_bells_palsy',
  'saraf_epilepsi_kejang',
  'saraf_migrain',
  'saraf_tension_headache',
  'saraf_vertigo_bppv',
  'skabies',
  'stroke_iskemik',
  'tb_paru',
  'tht_epistaksis_anterior',
  'tht_rinosinusitis_akut',
  'tht_serumen_prop',
  'tonsilitis_akut',
] as const

/** Tambahan di atas satu paparan untuk setiap kasus aktif. */
const REPEAT_COUNTS: Readonly<Record<string, number>> = {
  askariasis: 1,
  bronkitis_akut: 1,
  diare_akut_anak: 1,
  disentri_basiler: 1,
  dispepsia_fungsional: 1,
  dm_tipe2: 4,
  faringitis_akut: 1,
  gastritis: 1,
  gerd: 1,
  ispa_common_cold: 1,
  jiwa_depresi_ringan: 1,
  jiwa_insomnia: 1,
  kia_anc_kehamilan_normal: 1,
  kulit_dermatitis_kontak: 2,
  kulit_tinea_korporis: 1,
  mata_konjungtivitis_alergi: 1,
  mm_dislipidemia: 1,
  mm_gout_artritis_akut: 1,
  mm_low_back_pain: 2,
  mm_mialgia: 2,
  otitis_media_akut: 1,
  rinitis_alergi: 2,
  skabies: 1,
  tht_serumen_prop: 1,
}

const CASE_COUNTS: Readonly<Record<string, number>> = Object.freeze(
  Object.fromEntries(
    BASELINE_CASE_IDS.map((id) => [id, 1 + (REPEAT_COUNTS[id] ?? 0)]),
  ),
)

const ZERO_CATEGORY: Record<KategoriKasus, number> = {
  infeksi: 0,
  respirasi: 0,
  pencernaan: 0,
  kulit: 0,
  kardiovaskular: 0,
  metabolik: 0,
  muskuloskeletal: 0,
  saraf: 0,
  mata: 0,
  tht: 0,
  gigi: 0,
  kia: 0,
  jiwa: 0,
  gawat: 0,
}

export const EXAM_BLUEPRINT: ExamBlueprint = {
  schemaVersion: 1,
  blueprintVersion: EXAM_BLUEPRINT_VERSION,
  contentRelease: CONTENT_RELEASE,
  durationDays: 30,
  definitions: {
    controlledDraw:
      'Slot kasus baru yang dipilih Director dari blueprint; denominator kuota exact.',
    supplementalEncounter:
      'Follow-up, karma, dan PRB akibat keputusan pemain; tetap dimainkan tetapi tidak mengubah denominator blueprint.',
    tier: {
      A: 'Paparan prioritas tinggi: prevalensi kasus tinggi pada active pool release ini.',
      B: 'Paparan prioritas standar: prevalensi kasus sedang atau default.',
      C: 'Paparan langka: prevalensi kasus rendah; safety floor tetap sama.',
    },
    demographics:
      'Kuota mengunci eligibility archetype. Usia dan gender aktual tetap flavor RNG dan dinilai sebagai distribusi lintas seed.',
  },
  clinic: {
    dailyCapacities: DAILY_CAPACITIES,
    baselineCaseIds: BASELINE_CASE_IDS,
    repeatCounts: REPEAT_COUNTS,
    caseCounts: CASE_COUNTS,
    packageAnchors: {
      paket_a: 'hipertensi_esensial',
      paket_b: 'dm_tipe2',
      paket_c: 'kulit_dermatitis_kontak',
      paket_d: 'diare_akut_anak',
      paket_e: 'rinitis_alergi',
      paket_f: 'saraf_tension_headache',
      paket_g: 'gastritis',
      paket_h: 'jiwa_insomnia',
    },
    quotas: {
      total: 98,
      uniqueCases: 67,
      tier: { A: 49, B: 33, C: 16 },
      category: {
        ...ZERO_CATEGORY,
        respirasi: 10,
        infeksi: 3,
        pencernaan: 14,
        kulit: 15,
        mata: 5,
        kardiovaskular: 3,
        metabolik: 9,
        tht: 10,
        kia: 7,
        saraf: 6,
        muskuloskeletal: 10,
        jiwa: 6,
      },
      severity: {
        uncomplicated_or_stable: 86,
        referral_required: 10,
        referral_needs_stabilization: 2,
        emergency: 0,
      },
      referral: 12,
      trap: 12,
      ageEligibility: {
        pediatric_only: 10,
        crosses_pediatric_adult: 27,
        adult_only: 39,
        adult_older: 22,
      },
      genderEligibility: { any: 79, female_only: 15, male_only: 4 },
    },
    constraints: {
      tutorialCaseId: KASUS_TUTORIAL,
      maxReferralPerDay: 1,
      maxSameCategoryPerDay: 2,
      minRepeatGapDays: 2,
    },
  },
  igd: {
    caseIds: [
      'igd_asma_berat',
      'igd_dengue_syok',
      'igd_hipoglikemia',
      'igd_kejang_demam',
      'igd_syok_anafilaksis',
    ],
    exactEvents: 5,
    minGapDays: 4,
  },
  simulation: {
    flavorSeedsPerPackage: 32,
    botProfiles: ['strong', 'weak_careless'],
    statistics: ['min', 'max', 'mean', 'standardDeviation', 'range'],
    tolerances: {
      exactQuotaDelta: 0,
      scheduleMismatchAcrossFlavor: 0,
      scheduleMismatchAcrossBot: 0,
      maxPairwiseSameSlotShare: 0.25,
      maxPackageMeanShareSpread: 0.08,
      // Batas per-run konservatif sekitar empat simpangan baku dari ekspektasi
      // analitik multiset 98 slot, dibulatkan keluar sebelum simulasi dijalankan.
      realizedDemographicsPerRun: {
        female: { min: 0.35, max: 0.76 },
        pediatric: { min: 0.01, max: 0.32 },
        adult: { min: 0.58, max: 0.94 },
        older: { min: 0, max: 0.18 },
      },
    },
    exploratoryNotGates: {
      maxScoreSpreadAcrossPackages: 2,
      note: 'Target Q17 belum divalidasi pilot dan bukan acceptance gate M13-0D.',
    },
  },
}

export function examExposureTier(kasus: KasusKlinis): ExamExposureTier {
  if (kasus.prevalensi === 'tinggi') return 'A'
  if (kasus.prevalensi === 'rendah') return 'C'
  return 'B'
}

function ageEligibility(kasus: KasusKlinis): ExamAgeEligibility {
  const { usiaMin, usiaMax } = kasus.demografi
  if (usiaMax < 18) return 'pediatric_only'
  if (usiaMin < 18) return 'crosses_pediatric_adult'
  if (usiaMax >= 60) return 'adult_older'
  return 'adult_only'
}

function genderEligibility(kasus: KasusKlinis): ExamGenderEligibility {
  if (kasus.demografi.jenisKelamin === 'P') return 'female_only'
  if (kasus.demografi.jenisKelamin === 'L') return 'male_only'
  return 'any'
}

function isSafetyTrap(kasus: KasusKlinis): boolean {
  return Boolean(kasus.alergiTrap || kasus.interaksiTrap || kasus.konfirmasiWajib)
}

export function examCaseProfile(pack: ContentPack, caseId: string): ExamCaseProfile {
  const kasus = pack.kasus[caseId]
  if (!kasus) throw new Error(`ExamBlueprint: kasus poli '${caseId}' tidak ada`)
  const archetype = pack.runtimeManifest?.encounterArchetypes.find(
    (item) => item.contentRef.kind === 'clinic' && item.contentRef.id === caseId,
  )
  if (!archetype) throw new Error(`ExamBlueprint: archetype poli '${caseId}' tidak ada`)
  return {
    id: caseId,
    tier: examExposureTier(kasus),
    category: kasus.kategori,
    severity: archetype.severityDegree,
    referral: kasus.harusDirujuk,
    trap: isSafetyTrap(kasus),
    ageEligibility: ageEligibility(kasus),
    genderEligibility: genderEligibility(kasus),
  }
}

function emptyMetrics(): ExamQuotaMetrics {
  return {
    total: 0,
    uniqueCases: 0,
    tier: { A: 0, B: 0, C: 0 },
    category: { ...ZERO_CATEGORY },
    severity: {
      uncomplicated_or_stable: 0,
      referral_required: 0,
      referral_needs_stabilization: 0,
      emergency: 0,
    },
    referral: 0,
    trap: 0,
    ageEligibility: {
      pediatric_only: 0,
      crosses_pediatric_adult: 0,
      adult_only: 0,
      adult_older: 0,
    },
    genderEligibility: { any: 0, female_only: 0, male_only: 0 },
    caseCounts: {},
  }
}

export function hitungExamQuota(caseIds: readonly string[], pack: ContentPack): ExamQuotaMetrics {
  const result = emptyMetrics()
  for (const caseId of caseIds) {
    const profile = examCaseProfile(pack, caseId)
    result.total += 1
    result.tier[profile.tier] += 1
    result.category[profile.category] += 1
    result.severity[profile.severity] += 1
    if (profile.referral) result.referral += 1
    if (profile.trap) result.trap += 1
    result.ageEligibility[profile.ageEligibility] += 1
    result.genderEligibility[profile.genderEligibility] += 1
    result.caseCounts[caseId] = (result.caseCounts[caseId] ?? 0) + 1
  }
  result.uniqueCases = Object.keys(result.caseCounts).length
  return result
}

function expandCounts(counts: Readonly<Record<string, number>>): string[] {
  const result: string[] = []
  for (const id of Object.keys(counts).sort()) {
    for (let i = 0; i < (counts[id] ?? 0); i++) result.push(id)
  }
  return result
}

function susunClinicDays(pack: ContentPack, paket: PaketUjian): readonly (readonly string[])[] {
  const profiles = new Map<string, ExamCaseProfile>(
    BASELINE_CASE_IDS.map((id) => [id, examCaseProfile(pack, id)] as const),
  )
  const anchor = EXAM_BLUEPRINT.clinic.packageAnchors[paket.id]
  if (!anchor) throw new Error(`ExamBlueprint: anchor paket '${paket.id}' tidak ada`)

  for (let attempt = 0; attempt < 512; attempt++) {
    const rng = new Rng(paket.seedKurikulum, EXAM_BLUEPRINT_VERSION, 'clinic', attempt)
    const days: (string | undefined)[][] = DAILY_CAPACITIES.map((capacity) =>
      Array<string | undefined>(capacity).fill(undefined),
    )
    const remaining = new Map(Object.entries(CASE_COUNTS))
    const lastDay = new Map<string, number>()

    const place = (dayIndex: number, slotIndex: number, id: string): boolean => {
      const left = remaining.get(id) ?? 0
      if (left <= 0 || days[dayIndex]?.[slotIndex] !== undefined) return false
      days[dayIndex]![slotIndex] = id
      remaining.set(id, left - 1)
      lastDay.set(id, dayIndex)
      return true
    }

    if (!place(0, 0, KASUS_TUTORIAL) || !place(0, 1, anchor)) continue

    const referralIds = expandCounts(
      Object.fromEntries(
        [...remaining].filter(([id, count]) => count > 0 && profiles.get(id)?.referral),
      ),
    )
    const referralDays = rng.shuffle(Array.from({ length: 28 }, (_, i) => i + 2)).slice(0, referralIds.length)
    let referralFailed = false
    for (const [index, id] of rng.shuffle(referralIds).entries()) {
      const dayIndex = referralDays[index]
      if (dayIndex === undefined) {
        referralFailed = true
        break
      }
      const emptySlots = days[dayIndex]!
        .map((value, slotIndex) => (value === undefined ? slotIndex : -1))
        .filter((slotIndex) => slotIndex >= 0)
      if (emptySlots.length === 0 || !place(dayIndex, rng.pick(emptySlots), id)) {
        referralFailed = true
        break
      }
    }
    if (referralFailed) continue

    let relaxedConstraint = false
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      const day = days[dayIndex]!
      for (let slotIndex = 0; slotIndex < day.length; slotIndex++) {
        if (day[slotIndex] !== undefined) continue
        const idsToday = new Set(day.filter((id): id is string => id !== undefined))
        const categoryCounts = new Map<KategoriKasus, number>()
        for (const id of idsToday) {
          const category = profiles.get(id)!.category
          categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1)
        }
        const base = [...remaining]
          .filter(([id, count]) => count > 0 && !profiles.get(id)!.referral && !idsToday.has(id))
          .map(([id]) => id)
          .sort()
        const gapOk = (id: string) => {
          const previous = lastDay.get(id)
          return previous === undefined || dayIndex - previous >= EXAM_BLUEPRINT.clinic.constraints.minRepeatGapDays
        }
        const categoryOk = (id: string) =>
          (categoryCounts.get(profiles.get(id)!.category) ?? 0) <
          EXAM_BLUEPRINT.clinic.constraints.maxSameCategoryPerDay
        let candidates = base.filter((id) => gapOk(id) && categoryOk(id))
        if (candidates.length === 0) {
          candidates = base.filter(gapOk)
          relaxedConstraint = true
        }
        if (candidates.length === 0) {
          candidates = base
          relaxedConstraint = true
        }
        if (candidates.length === 0) {
          relaxedConstraint = true
          break
        }
        const selected = rng.weighted(
          candidates.map((id) => ({ item: id, bobot: Math.pow(remaining.get(id) ?? 1, 2) })),
        )
        place(dayIndex, slotIndex, selected)
      }
    }

    const hasRemaining = [...remaining.values()].some((count) => count !== 0)
    if (hasRemaining || relaxedConstraint || days.some((day) => day.some((id) => id === undefined))) continue
    return days.map((day) => day as string[])
  }
  throw new Error(`ExamBlueprint: gagal menyusun jadwal poli untuk ${paket.id}`)
}

function susunIgdEvents(paket: PaketUjian): readonly { day: number; caseId: string }[] {
  const rng = new Rng(paket.seedKurikulum, EXAM_BLUEPRINT_VERSION, 'igd')
  const days: number[] = [rng.int(4, 6)]
  while (days.length < EXAM_BLUEPRINT.igd.exactEvents) {
    const current = days[days.length - 1]!
    const eventsAfter = EXAM_BLUEPRINT.igd.exactEvents - days.length - 1
    const maxGap = Math.min(6, EXAM_BLUEPRINT.durationDays - current - eventsAfter * EXAM_BLUEPRINT.igd.minGapDays)
    days.push(current + rng.int(EXAM_BLUEPRINT.igd.minGapDays, maxGap))
  }
  const ids = rng.shuffle(EXAM_BLUEPRINT.igd.caseIds)
  return days.map((day, index) => ({ day, caseId: ids[index]! }))
}

const scheduleCache = new WeakMap<ContentPack, Map<string, ExamPackageSchedule>>()

function packageCacheKey(paket: PaketUjian): string {
  return [
    paket.id,
    paket.seedKurikulum,
    paket.blueprintVersion,
    paket.contentRelease,
  ].join('|')
}

export function susunExamPackageSchedule(pack: ContentPack, paket: PaketUjian): ExamPackageSchedule {
  if (paket.blueprintVersion !== EXAM_BLUEPRINT.blueprintVersion) {
    throw new Error(`Paket ${paket.id}: blueprintVersion tidak cocok`)
  }
  if (
    paket.contentRelease !== EXAM_BLUEPRINT.contentRelease ||
    pack.runtimeManifest?.contentRelease !== EXAM_BLUEPRINT.contentRelease
  ) {
    throw new Error(`Paket ${paket.id}: contentRelease tidak cocok`)
  }
  for (const caseId of EXAM_BLUEPRINT.clinic.baselineCaseIds) {
    if (!encounterArchetypeAktif(pack, 'clinic', caseId, 'ujian', EXAM_BLUEPRINT.contentRelease)) {
      throw new Error(`Paket ${paket.id}: kasus poli '${caseId}' tidak aktif di Ujian`)
    }
  }
  for (const caseId of EXAM_BLUEPRINT.igd.caseIds) {
    if (!encounterArchetypeAktif(pack, 'igd', caseId, 'ujian', EXAM_BLUEPRINT.contentRelease)) {
      throw new Error(`Paket ${paket.id}: kasus IGD '${caseId}' tidak aktif di Ujian`)
    }
  }
  let byPackage = scheduleCache.get(pack)
  if (!byPackage) {
    byPackage = new Map()
    scheduleCache.set(pack, byPackage)
  }
  const cacheKey = packageCacheKey(paket)
  const cached = byPackage.get(cacheKey)
  if (cached) return cached
  const schedule: ExamPackageSchedule = {
    packageId: paket.id,
    blueprintVersion: paket.blueprintVersion,
    contentRelease: paket.contentRelease,
    clinicDays: susunClinicDays(pack, paket),
    igdEvents: susunIgdEvents(paket),
  }
  byPackage.set(cacheKey, schedule)
  return schedule
}

/**
 * Controlled draw tidak boleh berubah karena pasien kembali/karma. Parameter
 * `exceptCaseIds` dipertahankan sebagai batas API Director, tetapi sengaja tidak
 * memengaruhi 98 slot blueprint; encounter konsekuensi bersifat supplemental.
 */
export function examClinicCaseIdsForDay(
  pack: ContentPack,
  paket: PaketUjian,
  day: number,
  _exceptCaseIds: readonly string[] = [],
): string[] {
  let preferred: readonly string[] | undefined
  try {
    preferred = susunExamPackageSchedule(pack, paket).clinicDays[day - 1]
  } catch {
    // Runtime gagal tertutup agar policy drift tidak merestart sesi. Validator
    // blueprint tetap memanggil schedule builder langsung dan melaporkan cacatnya.
    return []
  }
  if (!preferred) return []
  return [...preferred]
}

export function examIgdCaseIdForDay(pack: ContentPack, paket: PaketUjian, day: number): string | undefined {
  let event: { day: number; caseId: string } | undefined
  try {
    event = susunExamPackageSchedule(pack, paket).igdEvents.find((item) => item.day === day)
  } catch {
    // Jalur validasi tetap fail-loud; runtime tidak boleh crash karena pool drift.
    return undefined
  }
  if (!event) return undefined
  return encounterArchetypeAktif(pack, 'igd', event.caseId, 'ujian', EXAM_BLUEPRINT.contentRelease)
    ? event.caseId
    : undefined
}

function sameRecord(expected: Readonly<Record<string, number>>, actual: Readonly<Record<string, number>>): boolean {
  const keys = new Set([...Object.keys(expected), ...Object.keys(actual)])
  return [...keys].every((key) => (expected[key] ?? 0) === (actual[key] ?? 0))
}

function quotaProblems(expected: Omit<ExamQuotaMetrics, 'caseCounts'>, actual: ExamQuotaMetrics): string[] {
  const problems: string[] = []
  if (expected.total !== actual.total) problems.push(`total ${actual.total} != ${expected.total}`)
  if (expected.uniqueCases !== actual.uniqueCases) problems.push(`uniqueCases ${actual.uniqueCases} != ${expected.uniqueCases}`)
  if (!sameRecord(expected.tier, actual.tier)) problems.push('tier quota berbeda')
  if (!sameRecord(expected.category, actual.category)) problems.push('category quota berbeda')
  if (!sameRecord(expected.severity, actual.severity)) problems.push('severity quota berbeda')
  if (expected.referral !== actual.referral) problems.push(`referral ${actual.referral} != ${expected.referral}`)
  if (expected.trap !== actual.trap) problems.push(`trap ${actual.trap} != ${expected.trap}`)
  if (!sameRecord(expected.ageEligibility, actual.ageEligibility)) problems.push('age eligibility berbeda')
  if (!sameRecord(expected.genderEligibility, actual.genderEligibility)) problems.push('gender eligibility berbeda')
  return problems
}

export function validasiExamBlueprint(
  blueprint: ExamBlueprint,
  pack: ContentPack,
  packages: readonly PaketUjian[],
): string[] {
  const problems: string[] = []
  if (blueprint.contentRelease !== pack.runtimeManifest?.contentRelease) {
    problems.push('Blueprint contentRelease berbeda dari runtime PACK')
  }
  if (blueprint.clinic.dailyCapacities.length !== blueprint.durationDays) {
    problems.push('Jumlah dailyCapacities tidak sama dengan durationDays')
  }
  const activeClinic = Object.keys(pack.kasus)
    .filter((id) => encounterArchetypeAktif(pack, 'clinic', id, 'ujian', blueprint.contentRelease))
    .sort()
  if (activeClinic.join('|') !== [...blueprint.clinic.baselineCaseIds].sort().join('|')) {
    problems.push('Active pool Ujian tidak sama dengan baselineCaseIds blueprint')
  }
  const multiset = expandCounts(blueprint.clinic.caseCounts)
  const quota = hitungExamQuota(multiset, pack)
  problems.push(...quotaProblems(blueprint.clinic.quotas, quota).map((problem) => `Blueprint: ${problem}`))
  if (!sameRecord(blueprint.clinic.caseCounts, quota.caseCounts)) {
    problems.push('Blueprint caseCounts tidak konsisten')
  }
  if (blueprint.clinic.dailyCapacities.reduce((sum, value) => sum + value, 0) !== quota.total) {
    problems.push('Kapasitas harian tidak berjumlah total quota')
  }

  const packageIds = new Set<string>()
  const packageSeeds = new Set<number>()
  const anchorIds = Object.values(blueprint.clinic.packageAnchors)
  if (new Set(anchorIds).size !== anchorIds.length) {
    problems.push('Package anchor wajib unik')
  }
  if (
    blueprint.simulation.flavorSeedsPerPackage !== 32 ||
    [...blueprint.simulation.botProfiles].sort().join('|') !== 'strong|weak_careless'
  ) {
    problems.push('Matriks simulasi wajib 32 flavor x bot strong/weak_careless')
  }
  for (const paket of packages) {
    if (packageIds.has(paket.id)) problems.push(`Package id duplikat '${paket.id}'`)
    if (packageSeeds.has(paket.seedKurikulum)) problems.push(`Package seed duplikat '${paket.seedKurikulum}'`)
    if (!Number.isSafeInteger(paket.seedKurikulum)) problems.push(`${paket.id}: seedKurikulum tidak valid`)
    packageIds.add(paket.id)
    packageSeeds.add(paket.seedKurikulum)
    if (paket.blueprintVersion !== blueprint.blueprintVersion) problems.push(`${paket.id}: blueprintVersion tidak dipin`)
    if (paket.contentRelease !== blueprint.contentRelease) problems.push(`${paket.id}: contentRelease tidak dipin`)
    const anchor = blueprint.clinic.packageAnchors[paket.id]
    if (!anchor || !blueprint.clinic.caseCounts[anchor]) problems.push(`${paket.id}: anchor tidak valid`)
    if (anchor) {
      const profile = examCaseProfile(pack, anchor)
      if (
        profile.tier !== 'A' ||
        profile.severity !== 'uncomplicated_or_stable' ||
        profile.referral
      ) {
        problems.push(`${paket.id}: anchor wajib paparan A, stabil, dan nonrujukan`)
      }
    }

    let schedule: ExamPackageSchedule
    try {
      schedule = susunExamPackageSchedule(pack, paket)
    } catch (error) {
      problems.push(`${paket.id}: ${error instanceof Error ? error.message : String(error)}`)
      continue
    }
    const flat = schedule.clinicDays.flat()
    const metrics = hitungExamQuota(flat, pack)
    problems.push(...quotaProblems(blueprint.clinic.quotas, metrics).map((problem) => `${paket.id}: ${problem}`))
    if (!sameRecord(blueprint.clinic.caseCounts, metrics.caseCounts)) {
      problems.push(`${paket.id}: caseCounts jadwal berbeda`)
    }
    if (schedule.clinicDays[0]?.[0] !== blueprint.clinic.constraints.tutorialCaseId) {
      problems.push(`${paket.id}: slot pertama bukan kasus tutorial`)
    }
    if (schedule.clinicDays[0]?.[1] !== anchor) problems.push(`${paket.id}: anchor hari pertama berbeda`)

    const lastSeen = new Map<string, number>()
    schedule.clinicDays.forEach((dayCases, dayIndex) => {
      if (dayCases.length !== blueprint.clinic.dailyCapacities[dayIndex]) {
        problems.push(`${paket.id}: kapasitas hari ${dayIndex + 1} berbeda`)
      }
      if (new Set(dayCases).size !== dayCases.length) {
        problems.push(`${paket.id}: kasus duplikat pada hari ${dayIndex + 1}`)
      }
      const referrals = dayCases.filter((id) => pack.kasus[id]?.harusDirujuk).length
      if (referrals > blueprint.clinic.constraints.maxReferralPerDay) {
        problems.push(`${paket.id}: >1 rujukan pada hari ${dayIndex + 1}`)
      }
      const categories = new Map<KategoriKasus, number>()
      for (const id of dayCases) {
        const category = pack.kasus[id]!.kategori
        categories.set(category, (categories.get(category) ?? 0) + 1)
        const previous = lastSeen.get(id)
        if (previous !== undefined && dayIndex - previous < blueprint.clinic.constraints.minRepeatGapDays) {
          problems.push(`${paket.id}: '${id}' berulang terlalu dekat pada hari ${dayIndex + 1}`)
        }
        lastSeen.set(id, dayIndex)
      }
      if ([...categories.values()].some((count) => count > blueprint.clinic.constraints.maxSameCategoryPerDay)) {
        problems.push(`${paket.id}: kategori terlalu dominan pada hari ${dayIndex + 1}`)
      }
    })

    const igdIds = schedule.igdEvents.map((event) => event.caseId)
    if (schedule.igdEvents.length !== blueprint.igd.exactEvents) problems.push(`${paket.id}: jumlah IGD berbeda`)
    if (new Set(igdIds).size !== blueprint.igd.caseIds.length || !sameRecord(
      Object.fromEntries(blueprint.igd.caseIds.map((id) => [id, 1])),
      Object.fromEntries(igdIds.map((id) => [id, 1])),
    )) problems.push(`${paket.id}: kasus IGD tidak exact/unik`)
    for (let i = 1; i < schedule.igdEvents.length; i++) {
      if (schedule.igdEvents[i]!.day - schedule.igdEvents[i - 1]!.day < blueprint.igd.minGapDays) {
        problems.push(`${paket.id}: jeda IGD kurang dari ${blueprint.igd.minGapDays} hari`)
      }
    }
  }
  const anchorKeys = Object.keys(blueprint.clinic.packageAnchors).sort().join('|')
  const packageKeys = packages.map((p) => p.id).sort().join('|')
  if (anchorKeys !== packageKeys) problems.push('packageAnchors tidak menutup tepat seluruh paket')
  return problems
}
