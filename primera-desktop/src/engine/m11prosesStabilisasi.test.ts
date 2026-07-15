import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { ContentPack } from '@content/pack'
import type { KasusKlinis } from '@content/types'
import type { Action } from './actions'
import { buatEncounter, nilaiEncounter } from './clinic'
import { Rng } from './core/rng'
import { buatPasienDariKasus } from './director'
import { buildInitialState } from './init'
import { advance } from './reducer'
import { hitungSkor } from './scoring'
import type { EncounterState, GameState, PenilaianEncounter, SkorTally } from './state'
import { sidikJariPack } from './verifikasi'

const SEED = 20260713

type TallyProses = SkorTally & {
  sumSkorProses: number
  stabilisasiTerlewat: number
}

type HasilStabilisasi = PenilaianEncounter & {
  stabilisasiTerlewat: boolean
}

function run(state: GameState, action: Action, pack: ContentPack = PACK): GameState {
  return advance(state, action, pack).state
}

function resepBenar(kasus: KasusKlinis): string[] {
  return [
    ...kasus.tatalaksana.obatBenar,
    ...(kasus.tatalaksana.obatAlternatif ?? []).flatMap((grup) => (grup[0] ? [grup[0]] : [])),
  ]
}

function encounterLengkap(kasus: KasusKlinis, tindakan: string[]): EncounterState {
  const pasien = buatPasienDariKasus(kasus.id, PACK, new Rng(SEED, 'm11-stabilisasi'))
  return {
    ...buatEncounter(pasien),
    fase: 'disposisi',
    ditanya: kasus.anamnesis.filter((q) => q.distraktor !== true).map((q) => q.id),
    vitalDiukur: true,
    diperiksa: kasus.pemeriksaanFisik.filter((p) => p.relevan).map((p) => p.region),
    labDipesan: kasus.lab.filter((l) => l.relevan).map((l) => l.id),
    labTersedia: kasus.lab.filter((l) => l.relevan).map((l) => l.id),
    diagnosis: { icd10: kasus.icd10, jenis: 'tegak' },
    resep: resepBenar(kasus),
    tindakan,
    edukasi: kasus.tatalaksana.edukasi.slice(0, 3),
    disposisi: 'rujuk',
    sbar: {
      situation: 'Pasien sesak berat dan membutuhkan rujukan segera.',
      background: 'Gejala progresif dengan temuan klinis yang relevan.',
      assessment: `${kasus.nama} terkonfirmasi secara klinis.`,
      recommendation: 'Mohon stabilisasi lanjutan dan perawatan spesialistik.',
    },
  }
}

function packDenganOksigen(kasus: KasusKlinis): ContentPack {
  return {
    ...PACK,
    kasus: { ...PACK.kasus, [kasus.id]: kasus },
    tindakan: {
      ...PACK.tindakan,
      oksigen: {
        id: 'oksigen',
        nama: 'Terapi oksigen sesuai target saturasi',
        icd9: '93.96',
        biaya: 35_000,
      },
    },
  }
}

function tanganiPneumonia(pakaiOksigen: boolean): GameState {
  const dasar = PACK.kasus['pneumonia_balita']!
  const kasus = {
    ...dasar,
    stabilisasiWajib: ['oksigen'],
    tatalaksana: {
      ...dasar.tatalaksana,
      prosedur: [...new Set([...(dasar.tatalaksana.prosedur ?? []), 'oksigen'])],
    },
  } as KasusKlinis
  const pack = packDenganOksigen(kasus)
  const pasien = buatPasienDariKasus(kasus.id, pack, new Rng(SEED, 'm11-reducer'))
  let state: GameState = {
    ...buildInitialState('Uji M11', SEED, pack),
    tutorialAktif: false,
    klinik: {
      antrian: [pasien],
      selesaiHariIni: [],
      autoHariIni: { jumlah: 0, bermasalah: 0 },
    },
  }

  state = run(state, { type: 'PANGGIL_PASIEN' }, pack)
  for (const q of kasus.anamnesis) {
    if (q.distraktor !== true) state = run(state, { type: 'TANYA', pertanyaanId: q.id }, pack)
  }
  state = run(state, { type: 'LANJUT_FASE' }, pack)
  state = run(state, { type: 'UKUR_VITAL' }, pack)
  for (const p of kasus.pemeriksaanFisik) {
    if (p.relevan) state = run(state, { type: 'PERIKSA', region: p.region }, pack)
  }
  state = run(state, { type: 'LANJUT_FASE' }, pack)
  state = run(state, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' }, pack)
  for (const obatId of resepBenar(kasus)) {
    state = run(state, { type: 'TAMBAH_OBAT', obatId }, pack)
  }
  for (const edukasiId of kasus.tatalaksana.edukasi.slice(0, 3)) {
    state = run(state, { type: 'TAMBAH_EDUKASI', edukasiId }, pack)
  }
  if (pakaiOksigen) state = run(state, { type: 'TAMBAH_TINDAKAN', tindakanId: 'oksigen' }, pack)
  state = run(state, { type: 'LANJUT_FASE' }, pack)
  return run(
    state,
    {
      type: 'DISPOSISI',
      jenis: 'rujuk',
      sbar: {
        situation: 'Pneumonia berat dengan distres napas.',
        background: 'Demam, batuk, dan tarikan dinding dada.',
        assessment: 'Pneumonia balita berat, SKDI 3B.',
        recommendation: 'Mohon rawat dan tata laksana lanjutan.',
      },
    },
    pack,
  )
}

describe('M11 P1.6 - mutu proses klinis masuk skor UKP', () => {
  it('outcome identik tetapi proses SOAP buruk menghasilkan UKP lebih rendah', () => {
    const dasar = buildInitialState('Uji M11', SEED, PACK)
    const outcomeSama = {
      totalPasien: 10,
      diagnosisBenar: 10,
      tegakBenar: 10,
    }
    const prosesBaik = hitungSkor({
      ...dasar,
      tally: { ...dasar.tally, ...outcomeSama, sumSkorProses: 1_000 },
    })
    const prosesBuruk = hitungSkor({
      ...dasar,
      tally: { ...dasar.tally, ...outcomeSama, sumSkorProses: 0 },
    })

    expect(prosesBaik.ukp).toBeGreaterThan(prosesBuruk.ukp)
  })

  it('DISPOSISI mengakumulasi rerata empat sub-skor encounter ke tally', () => {
    const state = tanganiPneumonia(true)
    const hasil = state.klinik.selesaiHariIni[0]!
    const rerata =
      (hasil.skorAnamnesis + hasil.skorPemeriksaan + hasil.skorTerapi + hasil.skorEdukasi) / 4

    expect((state.tally as TallyProses).sumSkorProses).toBeCloseTo(rerata)
  })
})

describe('M11 C.1 - stabilisasi pra-rujuk ternilai', () => {
  it('engine memberi cap C bila tindakan wajib belum dilakukan sebelum rujuk', () => {
    const dasar = PACK.kasus['pneumonia_balita']!
    const kasus = {
      ...dasar,
      stabilisasiWajib: ['oksigen'],
      tatalaksana: {
        ...dasar.tatalaksana,
        prosedur: [...new Set([...(dasar.tatalaksana.prosedur ?? []), 'oksigen'])],
      },
    } as KasusKlinis
    const tanpaGate = { ...kasus, stabilisasiWajib: undefined }

    const baseline = nilaiEncounter(encounterLengkap(tanpaGate, []), tanpaGate, PACK)
    const tanpa = nilaiEncounter(encounterLengkap(kasus, []), kasus, PACK) as HasilStabilisasi
    const dengan = nilaiEncounter(encounterLengkap(kasus, ['oksigen']), kasus, PACK) as HasilStabilisasi

    expect(baseline.grade).toBe('A')
    expect(tanpa.stabilisasiTerlewat).toBe(true)
    expect(tanpa.grade).toBe('C')
    expect(dengan.stabilisasiTerlewat).toBe(false)
    expect(dengan.grade).toBe('A')
  })

  it('stabilisasi terlewat masuk tally dan tidak mengkredit penguasaan Dex', () => {
    const tanpa = tanganiPneumonia(false)
    const dengan = tanganiPneumonia(true)

    expect((tanpa.tally as TallyProses).stabilisasiTerlewat).toBe(1)
    expect(tanpa.dex['pneumonia_balita']?.benar).toBe(0)
    expect((dengan.tally as TallyProses).stabilisasiTerlewat).toBe(0)
    expect(dengan.dex['pneumonia_balita']?.benar).toBe(1)
  })

  it('konten hanya mewajibkan oksigen pada vignette yang ter-grounding jelas', () => {
    expect(PACK.tindakan['oksigen']).toMatchObject({ icd9: '93.96' })
    expect(PACK.kasus['pneumonia_balita']?.stabilisasiWajib).toEqual(['oksigen'])
    expect(PACK.kasus['ppok_eksaserbasi']?.stabilisasiWajib).toEqual(['oksigen'])
    // SpO2 92% pada gagal jantung bukan hipoksemia <90%; oksigen rutin bukan gate EBM.
    expect(PACK.kasus['mm_gagal_jantung_kongestif']?.stabilisasiWajib).toBeUndefined()
  })

  it('setiap stabilisasi wajib menunjuk tindakan valid, menjadi slot prosedur, dan ikut fingerprint', () => {
    for (const kasus of Object.values(PACK.kasus)) {
      if (!kasus.stabilisasiWajib) continue
      expect(kasus.harusDirujuk, kasus.id).toBe(true)
      for (const tindakanId of kasus.stabilisasiWajib) {
        expect(PACK.tindakan[tindakanId], kasus.id).toBeDefined()
        expect(kasus.tatalaksana.prosedur, kasus.id).toContain(tindakanId)
      }
    }

    const pneumonia = PACK.kasus['pneumonia_balita']!
    const tanpaGate: ContentPack = {
      ...PACK,
      kasus: {
        ...PACK.kasus,
        pneumonia_balita: { ...pneumonia, stabilisasiWajib: undefined },
      },
    }
    expect(sidikJariPack(tanpaGate)).not.toBe(sidikJariPack(PACK))
  })

  it('bundel stabilisasi M13 baru lulus hanya bila seluruh tindakan wajib dilakukan', () => {
    const dimas = PACK.kasus['asma_eksaserbasi_berat_anak']!
    expect(dimas.stabilisasiWajib).toEqual(['oksigen', 'nebulisasi_burst_asma_anak'])

    const sebagian = nilaiEncounter(encounterLengkap(dimas, ['oksigen']), dimas, PACK)
    const lengkap = nilaiEncounter(
      encounterLengkap(dimas, ['oksigen', 'nebulisasi_burst_asma_anak']),
      dimas,
      PACK,
    )

    expect(sebagian.stabilisasiTerlewat).toBe(true)
    expect(sebagian.grade).toBe('C')
    expect(lengkap.stabilisasiTerlewat).toBe(false)
    expect(lengkap.grade).toBe('A')
  })

  it('tindakan berbahaya aktif memicu flag dan cap D walau langkah lain benar', () => {
    const kasus = PACK.kasus['benda_asing_hidung_anak']!
    const tindakanBenar = ['ekstraksi_benda_hidung_tekanan_positif']
    const aman = {
      ...encounterLengkap(kasus, tindakanBenar),
      disposisi: 'pulang' as const,
      sbar: undefined,
    }
    const berbahaya = {
      ...aman,
      tindakan: [...tindakanBenar, 'ekstraksi_benda_hidung_blind_probing'],
    }

    const nilaiAman = nilaiEncounter(aman, kasus, PACK)
    const nilaiBerbahaya = nilaiEncounter(berbahaya, kasus, PACK)

    expect(nilaiAman.tindakanBerbahaya).toBe(false)
    expect(nilaiAman.grade).toBe('A')
    expect(nilaiBerbahaya.tindakanBerbahaya).toBe(true)
    expect(nilaiBerbahaya.grade).toBe('D')
  })
})
