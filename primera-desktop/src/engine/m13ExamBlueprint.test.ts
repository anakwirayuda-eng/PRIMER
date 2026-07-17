import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { CONTENT_RELEASE } from '@content/pack'
import { buildInitialState } from './init'
import { susunAntrianHarian } from './director'
import { Rng } from './core/rng'
import { PAKET_UJIAN } from './paketUjian'
import { advance } from './reducer'
import type { Action } from './actions'
import type { GameState } from './state'
import {
  EXAM_BLUEPRINT,
  EXAM_BLUEPRINT_VERSION,
  examClinicCaseIdsForDay,
  hitungExamQuota,
  susunExamPackageSchedule,
  validasiExamBlueprint,
} from './examBlueprint'
import { runExamBlueprintSimulation } from './examSimulation'

function run(state: GameState, action: Action): GameState {
  return advance(state, action, PACK).state
}

function selesaikanIgd(state: GameState): GameState {
  let current = state
  let guard = 0
  while (current.igd && guard++ < 30) {
    const kasus = PACK.kasusIgd[current.igd.kasusId]!
    if (current.igd.fase === 'langkah') {
      const langkah = kasus.langkah[current.igd.langkahIndex]!
      const pilihan = langkah.pilihan.find((item) => item.benar) ?? langkah.pilihan[0]!
      current = run(current, { type: 'AKSI_IGD', langkahId: langkah.id, pilihanId: pilihan.id })
    } else if (current.igd.fase === 'kode_biru') {
      current = run(current, { type: 'RJP_IGD', berkualitas: true })
    } else if (current.igd.fase === 'pasca_rosc') {
      current = run(current, { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' })
    } else if (current.igd.fase === 'disposisi') {
      current = run(current, { type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar })
    }
  }
  return current
}

describe('M13-0D constrained ExamBlueprint', () => {
  it('pin versi/rilis dan seluruh invariant blueprint lolos', () => {
    expect(EXAM_BLUEPRINT.blueprintVersion).toBe(EXAM_BLUEPRINT_VERSION)
    expect(EXAM_BLUEPRINT.contentRelease).toBe(CONTENT_RELEASE)
    expect(PAKET_UJIAN).toHaveLength(8)
    expect(
      PAKET_UJIAN.every(
        (paket) =>
          paket.blueprintVersion === EXAM_BLUEPRINT_VERSION &&
          paket.contentRelease === CONTENT_RELEASE,
      ),
    ).toBe(true)
    expect(validasiExamBlueprint(EXAM_BLUEPRINT, PACK, PAKET_UJIAN)).toEqual([])
  })

  it('setiap paket punya multiset 98 slot exact dan jadwal IGD 5/5 unik', () => {
    for (const paket of PAKET_UJIAN) {
      const schedule = susunExamPackageSchedule(PACK, paket)
      const flat = schedule.clinicDays.flat()
      const quota = hitungExamQuota(flat, PACK)
      expect(quota.total).toBe(98)
      expect(quota.uniqueCases).toBe(67)
      expect(quota.tier).toEqual({ A: 49, B: 33, C: 16 })
      expect(quota.referral).toBe(12)
      expect(quota.trap).toBe(12)
      expect(quota.caseCounts).toEqual(EXAM_BLUEPRINT.clinic.caseCounts)
      expect(schedule.igdEvents).toHaveLength(5)
      expect(new Set(schedule.igdEvents.map((event) => event.caseId))).toEqual(
        new Set(EXAM_BLUEPRINT.igd.caseIds),
      )
    }
  })

  it('Director Ujian kebal terhadap state Dex kuat vs lemah', () => {
    const base = buildInitialState('Uji', 8, PACK, { mode: 'ujian' })
    const strongDex = Object.fromEntries(
      Object.keys(PACK.kasus).map((id) => [
        id,
        { kasusId: id, ditangani: 9, benar: 9, bintang: 3, terakhirHari: 9 },
      ]),
    )
    const weakDex = Object.fromEntries(
      Object.keys(PACK.kasus).map((id) => [
        id,
        { kasusId: id, ditangani: 9, benar: 0, bintang: 0, terakhirHari: 9 },
      ]),
    )
    const draw = (dex: typeof strongDex) =>
      susunAntrianHarian(
        { ...base, hari: 10, dex },
        PACK,
        new Rng(base.seedKurikulum, 'director', 10),
        [],
        new Rng(base.seed, 'director-flavor', 10),
      ).map((patient) => patient.kasusId)
    expect(draw(strongDex)).toEqual(draw(weakDex))
  })

  it('pasien-kembali tidak mengubah controlled draw', () => {
    for (const paket of PAKET_UJIAN) {
      const schedule = susunExamPackageSchedule(PACK, paket)
      for (let day = 1; day <= schedule.clinicDays.length; day++) {
        const preferred = schedule.clinicDays[day - 1]!
        expect(examClinicCaseIdsForDay(PACK, paket, day, preferred)).toEqual(preferred)
      }
    }
  })

  it('status keluarga binaan tidak mengubah flavor controlled draw', () => {
    const base = { ...buildInitialState('Uji', 8, PACK, { mode: 'ujian' }), hari: 10 }
    const familyId = Object.keys(base.desa.keluarga)[0]!
    const familiar: GameState = {
      ...base,
      desa: {
        ...base.desa,
        binaan: [familyId],
        keluarga: {
          ...base.desa.keluarga,
          [familyId]: {
            ...base.desa.keluarga[familyId]!,
            jumlahKunjungan: 3,
            trust: 8,
          },
        },
      },
    }
    const draw = (state: GameState, flavorSeed: number) =>
      susunAntrianHarian(
        state,
        PACK,
        new Rng(state.seedKurikulum, 'director', state.hari),
        [],
        new Rng(flavorSeed, 'director-flavor', state.hari),
      )
    for (let flavorSeed = 0; flavorSeed < 64; flavorSeed++) {
      expect(draw(familiar, flavorSeed)).toEqual(draw(base, flavorSeed))
    }
  })

  it('cache jadwal dipisahkan saat seed paket berubah', () => {
    const paket = PAKET_UJIAN[0]!
    const original = susunExamPackageSchedule(PACK, paket)
    const changed = susunExamPackageSchedule(PACK, {
      ...paket,
      seedKurikulum: paket.seedKurikulum + 1,
    })
    expect(changed).not.toBe(original)
    expect(changed.clinicDays).not.toEqual(original.clinicDays)
  })

  it('reducer mewujudkan lima jadwal IGD exact untuk seluruh paket', () => {
    for (const [packageIndex, paket] of PAKET_UJIAN.entries()) {
      let state = buildInitialState('Uji', packageIndex, PACK, { mode: 'ujian' })
      expect(state.paketUjian).toBe(paket.id)
      const observed: { day: number; caseId: string }[] = []
      let lastObservedDay = 0
      let guard = 0
      while (state.hari <= EXAM_BLUEPRINT.durationDays && !state.tamat && guard++ < 200) {
        if (state.igd && state.hari !== lastObservedDay) {
          observed.push({ day: state.hari, caseId: state.igd.kasusId })
          lastObservedDay = state.hari
        }
        state = selesaikanIgd(state)
        if (state.hari === EXAM_BLUEPRINT.durationDays) break
        state = run(state, { type: 'LANJUTKAN' })
      }
      expect(observed).toEqual(susunExamPackageSchedule(PACK, paket).igdEvents)
    }
  })

  it('validator negatif menangkap quota drift', () => {
    const broken = {
      ...EXAM_BLUEPRINT,
      clinic: {
        ...EXAM_BLUEPRINT.clinic,
        quotas: { ...EXAM_BLUEPRINT.clinic.quotas, referral: 13 },
      },
    }
    expect(validasiExamBlueprint(broken, PACK, PAKET_UJIAN).some((problem) => /referral/.test(problem))).toBe(true)
  })

  it('matriks 8 x 32 x 2 memenuhi acceptance contract tanpa mempromosikan Q17', () => {
    const report = runExamBlueprintSimulation(PACK, PAKET_UJIAN)
    expect(report.matrixRuns).toBe(512)
    expect(report.groups).toHaveLength(16)
    expect(report.allSchedulesInvariantAcrossFlavor).toBe(true)
    expect(report.allSchedulesInvariantAcrossBot).toBe(true)
    expect(report.maximumPairwiseSameSlotShare).toBeLessThanOrEqual(
      EXAM_BLUEPRINT.simulation.tolerances.maxPairwiseSameSlotShare,
    )
    expect(report.errors).toEqual([])
    expect(report.exploratoryNotGates.note).toMatch(/bukan acceptance gate/i)
  }, 15_000)
})
