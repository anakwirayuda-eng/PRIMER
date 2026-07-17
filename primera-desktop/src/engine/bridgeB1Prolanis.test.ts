import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { Action } from './actions'
import { buatEncounter } from './clinic'
import { Rng } from './core/rng'
import { buatPasienDariKasus } from './director'
import { buildInitialState } from './init'
import { advance, HARI_BUKA_PROLANIS } from './reducer'
import type { EncounterState, GameState, PesertaProlanis } from './state'

const SEED = 20260717

function run(state: GameState, action: Action): GameState {
  return advance(state, action, PACK).state
}

function bukaRosterProlanis(): GameState {
  const awal = buildInitialState('Uji B1.4', SEED, PACK)
  return run(
    {
      ...awal,
      hari: HARI_BUKA_PROLANIS.karier - 1,
      blok: 'sore',
      jadwal: [],
      igd: undefined,
      igdHariIni: false,
      klinik: { ...awal.klinik, antrian: [], aktif: undefined },
    },
    { type: 'LANJUTKAN' },
  )
}

function pesertaMusa(jenis: 'ht' | 'dm'): PesertaProlanis {
  return {
    id: `musa_${jenis}`,
    orangId: 'musa',
    nama: 'Musa',
    usia: 64,
    jenisKelamin: 'L',
    rw: 3,
    keluargaId: 'keluarga_musa',
    jenis,
    param: jenis === 'ht' ? 170 : 210,
    takTerkontrolBerturut: 1,
  }
}

function stateSesiMultimorbid(): GameState {
  const awal = buildInitialState('Uji B1.4', SEED, PACK)
  return {
    ...awal,
    hari: HARI_BUKA_PROLANIS.karier,
    blok: 'siang',
    stamina: 99,
    tutorialAktif: false,
    lapanganTerpakai: false,
    kegiatan: undefined,
    prolanis: {
      roster: [pesertaMusa('ht'), pesertaMusa('dm')],
      sesiBerikutHari: HARI_BUKA_PROLANIS.karier,
    },
  }
}

function selesaikanProlanisSalah(state: GameState): GameState {
  let cur = run(state, { type: 'MULAI_PROLANIS' })
  let guard = 0
  while (cur.kegiatan && guard++ < 10) {
    const kartu = cur.kegiatan.kartu[cur.kegiatan.index]!
    const salah = kartu.pilihan.find((p) => !p.benar) ?? kartu.pilihan[0]!
    cur = run(cur, { type: 'JAWAB_KEGIATAN', kartuId: kartu.id, pilihanId: salah.id })
  }
  return cur
}

function encounterDmProlanis(
  prolanisPesertaId: string | undefined,
  diagnosisBenar = true,
): EncounterState {
  const kasus = PACK.kasus['dm_tipe2']!
  const pasien = buatPasienDariKasus(kasus.id, PACK, new Rng(SEED, 'pasien-prolanis'), {
    nama: 'Musa',
    usia: 64,
    jenisKelamin: 'L',
    rw: 3,
    keluargaId: 'keluarga_musa',
    followUpDari: 'Prolanis DM tidak terkontrol',
    ...(prolanisPesertaId ? { prolanisPesertaId } : {}),
  })
  return {
    ...buatEncounter(pasien),
    fase: 'disposisi',
    ditanya: kasus.anamnesis.filter((q) => !q.distraktor).map((q) => q.id),
    vitalDiukur: true,
    diperiksa: kasus.pemeriksaanFisik.filter((p) => p.relevan).map((p) => p.region),
    labDipesan: kasus.lab.filter((l) => l.relevan).map((l) => l.id),
    labTersedia: kasus.lab.filter((l) => l.relevan).map((l) => l.id),
    diagnosis: { icd10: diagnosisBenar ? kasus.icd10 : 'E10.9', jenis: 'tegak' },
    resep: [
      ...kasus.tatalaksana.obatBenar,
      ...(kasus.tatalaksana.obatAlternatif ?? []).flatMap((grup) => (grup[0] ? [grup[0]] : [])),
    ],
    tindakan: kasus.tatalaksana.prosedur ?? [],
    edukasi: kasus.tatalaksana.edukasi.slice(0, 3),
    disposisi: 'pulang',
  }
}

function stateEncounterProlanis(encounter: EncounterState): GameState {
  const awal = buildInitialState('Uji B1.4', SEED, PACK)
  return {
    ...awal,
    hari: 40,
    tutorialAktif: false,
    klinik: { ...awal.klinik, aktif: encounter, antrian: [] },
    prolanis: {
      roster: [{ ...pesertaMusa('dm'), param: 190, takTerkontrolBerturut: 0 }],
      sesiBerikutHari: 60,
    },
  }
}

describe('Bridge B1.4 - Prolanis multimorbid dan callback klinik', () => {
  it('Musa terdaftar sebagai satu orang dengan dua masalah aktif HT dan DM', () => {
    const state = bukaRosterProlanis()
    const musa = state.prolanis.roster.filter((p) => p.orangId === 'prol_keluarga_musa_Musa')

    expect(musa).toHaveLength(2)
    expect(musa.map((p) => p.jenis).sort()).toEqual(['dm', 'ht'])
    expect(new Set(musa.map((p) => p.id)).size).toBe(2)
  })

  it('save roster legacy diperkaya masalah kedua sekali saja pada hari berikutnya', () => {
    const lengkap = bukaRosterProlanis()
    const musaHt = lengkap.prolanis.roster.find(
      (p) => p.orangId === 'prol_keluarga_musa_Musa' && p.jenis === 'ht',
    )!
    let state: GameState = {
      ...lengkap,
      blok: 'sore',
      prolanis: { ...lengkap.prolanis, roster: [musaHt] },
      klinik: { ...lengkap.klinik, antrian: [], aktif: undefined },
      jadwal: [],
      igd: undefined,
    }

    state = run(state, { type: 'LANJUTKAN' })
    expect(state.prolanis.roster.filter((p) => p.orangId === musaHt.orangId)).toHaveLength(2)

    state = run({ ...state, blok: 'sore', klinik: { ...state.klinik, antrian: [] }, igd: undefined }, { type: 'LANJUTKAN' })
    expect(state.prolanis.roster.filter((p) => p.orangId === musaHt.orangId)).toHaveLength(2)
  })

  it('dua masalah tak terkontrol hanya menciptakan satu bottleneck klinik per orang per sesi', () => {
    const state = selesaikanProlanisSalah(stateSesiMultimorbid())
    const jadwal = state.jadwal.filter((j) => j.id.startsWith('jadwal_prolanis_'))
    const musa = state.prolanis.roster.filter((p) => p.orangId === 'musa')

    expect(jadwal).toHaveLength(1)
    expect(jadwal[0]?.prolanisPesertaId).toBeDefined()
    expect(musa.map((p) => p.takTerkontrolBerturut).sort()).toEqual([0, 2])

    const besok = run(
      {
        ...state,
        blok: 'sore',
        igd: undefined,
        klinik: { ...state.klinik, antrian: [], aktif: undefined },
        jadwal: state.jadwal.map((j) => (j.id === jadwal[0]!.id ? { ...j, hari: state.hari + 1 } : j)),
      },
      { type: 'LANJUTKAN' },
    )
    expect(
      besok.klinik.antrian.some(
        (p) => p.nama === 'Musa' && p.prolanisPesertaId === jadwal[0]?.prolanisPesertaId,
      ),
    ).toBe(true)
  })

  it('grade A menulis balik perbaikan ke masalah yang tepat dan memberi umpan balik terlihat', () => {
    const awal = stateEncounterProlanis(encounterDmProlanis('musa_dm'))
    const akhir = run(awal, { type: 'DISPOSISI', jenis: 'pulang' })
    const dm = akhir.prolanis.roster.find((p) => p.id === 'musa_dm')!

    expect(akhir.klinik.selesaiHariIni.at(-1)?.grade).toBe('A')
    expect(dm.param).toBeLessThan(190)
    expect(dm.takTerkontrolBerturut).toBe(0)
    expect(
      akhir.inbox.some((surat) => surat.judul.includes('Hasil klinik masuk Prolanis')),
    ).toBe(true)
  })

  it('pasien tanpa provenance atau encounter di bawah A tidak mengubah roster', () => {
    const tanpaProvenance = run(
      stateEncounterProlanis(encounterDmProlanis(undefined)),
      { type: 'DISPOSISI', jenis: 'pulang' },
    )
    expect(tanpaProvenance.prolanis.roster[0]?.param).toBe(190)

    const buruk = run(
      stateEncounterProlanis(encounterDmProlanis('musa_dm', false)),
      { type: 'DISPOSISI', jenis: 'pulang' },
    )
    expect(buruk.klinik.selesaiHariIni.at(-1)?.grade).not.toBe('A')
    expect(buruk.prolanis.roster[0]?.param).toBe(190)
  })
})
