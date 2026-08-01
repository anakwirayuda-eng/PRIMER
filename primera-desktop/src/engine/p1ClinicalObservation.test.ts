import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { PHYSICIAN_APPROVED_LAB_CASE_IDS } from '@content/lab'
import { kasusFormatif } from '@content/pack'
import type { KasusKlinis } from '@content/types'
import { Rng } from './core/rng'
import { aksiKlinik, buatEncounter, nilaiEncounter } from './clinic'
import { buatPasienDariKasus, susunAntrianHarian } from './director'
import { buildInitialState } from './init'
import { advance } from './reducer'
import { ringkasanHarian } from './scoring'
import type { EncounterState, GameState } from './state'

function encounterLengkap(kasus: KasusKlinis): EncounterState {
  const pasien = buatPasienDariKasus(kasus.id, PACK, new Rng(71, 'p1-observasi'))
  const pertanyaanBerlaku = kasus.anamnesis.filter(
    (q) =>
      !q.distraktor &&
      (q.hanyaUntuk === undefined || q.hanyaUntuk === pasien.jenisKelamin),
  )
  return {
    ...buatEncounter(pasien),
    fase: 'disposisi',
    ditanya: pertanyaanBerlaku.map((q) => q.id),
    vitalDiukur: true,
    diperiksa: [...new Set(kasus.pemeriksaanFisik.filter((p) => p.relevan).map((p) => p.region))],
    diagnosis: { icd10: kasus.icd10, jenis: kasus.kepastianDiagnosis ?? 'tegak' },
    resep: [
      ...kasus.tatalaksana.obatBenar,
      ...(kasus.tatalaksana.obatAlternatif ?? []).map((grup) => grup[0]!).filter(Boolean),
    ],
    tindakan: [...(kasus.tatalaksana.prosedur ?? [])],
    edukasi: kasus.tatalaksana.edukasi.slice(0, 3),
  }
}

function stateDenganEncounter(kasusId: string): GameState {
  const kasus = PACK.kasus[kasusId]
  if (!kasus) throw new Error(`Kasus ${kasusId} hilang`)
  return {
    ...buildInitialState('Audit P1', 2718, PACK),
    tutorialAktif: false,
    klinik: {
      antrian: [],
      selesaiHariIni: [],
      autoHariIni: { jumlah: 0, bermasalah: 0 },
      aktif: {
        ...buatEncounter(buatPasienDariKasus(kasusId, PACK, new Rng(99, 'governance'))),
        fase: 'disposisi',
    diagnosis: { icd10: kasus.icd10, jenis: kasus.kepastianDiagnosis ?? 'tegak' },
      },
    },
  }
}

describe('P1 - observasi klinis adalah aksi dan gerbang disposisi', () => {
  it('diare Plan B harus dinilai ulang; pulang langsung di-cap C, pulang setelah observasi dapat tepat', () => {
    const kasus = PACK.kasus.diare_akut_anak!
    const tanpa = nilaiEncounter(
      { ...encounterLengkap(kasus), disposisi: 'pulang' },
      kasus,
      PACK,
    )
    const dengan = nilaiEncounter(
      {
        ...encounterLengkap(kasus),
        observasiDimulai: true,
        observasiDilakukan: true,
        disposisi: 'pulang',
      },
      kasus,
      PACK,
    )

    expect(kasus.observasi?.durasiMenit).toBe(240)
    expect(tanpa.observasiTerlewat).toBe(true)
    expect(tanpa.disposisiTepat).toBe(false)
    expect(tanpa.grade).toBe('C')
    expect(dengan.observasiTerlewat).toBe(false)
    expect(dengan.disposisiTepat).toBe(true)
    expect(dengan.grade).toBe('A')
  })

  it('observasi memisahkan mulai dari nilai ulang dan baru kemudian membuka hasil', () => {
    const kasus = PACK.kasus.diare_akut_anak!
    const enc = encounterLengkap(kasus)
    const mulai = aksiKlinik(enc, { type: 'MULAI_OBSERVASI' }, kasus, PACK, new Rng(1, 'obs'))

    expect(mulai.enc.observasiDimulai).toBe(true)
    expect(mulai.enc.observasiDilakukan).not.toBe(true)
    expect(mulai.events).toContainEqual({
      type: 'OBSERVASI_DIMULAI',
      durasiMenit: 240,
    })

    const nilaiUlang = aksiKlinik(
      mulai.enc,
      { type: 'NILAI_ULANG_OBSERVASI' },
      kasus,
      PACK,
      new Rng(1, 'obs-ulang'),
    )
    expect(nilaiUlang.enc.observasiDilakukan).toBe(true)
    expect(nilaiUlang.events).toContainEqual({
      type: 'OBSERVASI_SELESAI',
      durasiMenit: 240,
      hasil: kasus.observasi?.hasilUlang,
    })

    const tanpaProtokol = PACK.kasus.ispa_common_cold!
    const ditolak = aksiKlinik(
      { ...buatEncounter(buatPasienDariKasus(tanpaProtokol.id, PACK, new Rng(2, 'obs'))), fase: 'disposisi' },
      { type: 'MULAI_OBSERVASI' },
      tanpaProtokol,
      PACK,
      new Rng(2, 'obs-action'),
    )
    expect(ditolak.events).toContainEqual({
      type: 'ERROR_AKSI',
      pesan: 'Kasus ini tidak memiliki indikasi observasi terstruktur.',
    })
  })

  it('nilai ulang tidak dapat dilompati sebelum observasi dimulai', () => {
    const kasus = PACK.kasus.diare_akut_anak!
    const hasil = aksiKlinik(
      encounterLengkap(kasus),
      { type: 'NILAI_ULANG_OBSERVASI' },
      kasus,
      PACK,
      new Rng(2, 'obs-urut'),
    )
    expect(hasil.events).toContainEqual({
      type: 'ERROR_AKSI',
      pesan: 'Mulai observasi sebelum melakukan nilai ulang.',
    })
  })

  it('cedera kepala memakai gerbang observasi baru, bukan prosedur wajib ganda', () => {
    const kasus = PACK.kasus.lab_trauma_tumpul_kepala_ringan!
    expect(kasus.observasi?.durasiMenit).toBe(120)
    expect(kasus.tatalaksana.prosedur ?? []).not.toContain('observasi_neurologis')
    expect(kasus.tatalaksana.prosedurOpsional ?? []).toContain('observasi_neurologis')
  })
})

describe('P1 - governance prototipe 137', () => {
  it('tepat 16 kasus ber-sign-off menulis status physician_approved', () => {
    const approved = Object.values(PACK.kasus).filter(
      (kasus) => kasus.reviewStatus === 'physician_approved',
    )
    expect(approved).toHaveLength(16)
    expect(new Set(approved.map((kasus) => kasus.id))).toEqual(PHYSICIAN_APPROVED_LAB_CASE_IDS)
  })

  it('prototipe pending tetap playable tetapi tidak mengubah tally, Dex, ekonomi, jadwal, atau surat', () => {
    const kasusId = 'lab_pneumonia_komunitas_dewasa'
    const awal = stateDenganEncounter(kasusId)
    const hasil = advance(awal, { type: 'DISPOSISI', jenis: 'pulang' }, PACK)
    const selesai = hasil.events.find((event) => event.type === 'ENCOUNTER_SELESAI')

    expect(PACK.kasus[kasusId]?.reviewStatus).toBeUndefined()
    expect(selesai?.type === 'ENCOUNTER_SELESAI' && selesai.penilaian.formativePrototype).toBe(true)
    expect(hasil.state.tally).toEqual(awal.tally)
    expect(hasil.state.dex).toEqual(awal.dex)
    expect(hasil.state.kapitasi).toBe(awal.kapitasi)
    expect(hasil.state.jadwal).toEqual(awal.jadwal)
    expect(hasil.state.inbox).toEqual(awal.inbox)
    expect(hasil.state.klinik.selesaiHariIni).toHaveLength(1)
    expect(hasil.state.klinik.selesaiHariIni[0]?.formativePrototype).toBe(true)
    expect(hasil.events.some((event) => event.type === 'DEX_BERTAMBAH')).toBe(false)
    expect(hasil.events.some((event) => event.type === 'SURAT_MASUK')).toBe(false)
  })

  it('kasus yang sudah disetujui dokter tetap menyumbang progres formal', () => {
    const kasusId = 'lab_luka_bakar_derajat2_dangkal'
    const awal = stateDenganEncounter(kasusId)
    const hasil = advance(awal, { type: 'DISPOSISI', jenis: 'pulang' }, PACK)
    const selesai = hasil.events.find((event) => event.type === 'ENCOUNTER_SELESAI')

    expect(PACK.kasus[kasusId]?.reviewStatus).toBe('physician_approved')
    expect(selesai?.type === 'ENCOUNTER_SELESAI' && selesai.penilaian.formativePrototype).toBeFalsy()
    expect(hasil.state.tally.totalPasien).toBe(awal.tally.totalPasien + 1)
    expect(hasil.state.klinik.selesaiHariIni).toHaveLength(1)
  })

  it('Director menahan prototipe dari onboarding dan membatasi maksimal satu per hari berikutnya', () => {
    const awal = buildInitialState('Audit Director Formatif', 1881, PACK)
    for (const hari of [1, 2]) {
      for (let seed = 1; seed <= 40; seed++) {
        const antrian = susunAntrianHarian(
          { ...awal, hari, tutorialAktif: false },
          PACK,
          new Rng(seed, 'director-formal', hari),
          [],
          new Rng(seed, 'director-flavor', hari),
        )
        expect(antrian.every((pasien) => !kasusFormatif(PACK.kasus[pasien.kasusId]))).toBe(true)
      }
    }

    for (const hari of [3, 15, 45, 80]) {
      let seedDenganFormatif = 0
      for (let seed = 1; seed <= 80; seed++) {
        const antrian = susunAntrianHarian(
          { ...awal, hari, tutorialAktif: false },
          PACK,
          new Rng(seed, 'director-formal', hari),
          [],
          new Rng(seed, 'director-flavor', hari),
        )
        const formatif = antrian.filter(
          (pasien) => kasusFormatif(PACK.kasus[pasien.kasusId]),
        )
        expect(formatif.length).toBeLessThanOrEqual(1)
        expect(antrian.length - formatif.length).toBeGreaterThan(0)
        if (formatif.length === 1) seedDenganFormatif += 1
      }
      // S4-formatif-slot: formatif kini undian seeded 0.5/hari — lintas 80
      // seed wajib ADA hari ber-formatif dan ADA hari tanpa formatif
      // (bukan kepastian harian seperti sebelumnya).
      expect(seedDenganFormatif).toBeGreaterThan(0)
      expect(seedDenganFormatif).toBeLessThan(80)
    }
  })

  it('S4: pasien formatif yang dilewatkan LANJUTKAN tidak menyentuh autoBermasalah/jadwal; pasien resmi tetap kena undian', () => {
    // Ambil kasus formatif secara dinamis (adjudikasi 137 sedang berjalan —
    // jangan hardcode id yang bisa berubah status physician_approved).
    const idFormatif = Object.values(PACK.kasus)
      .filter((kasus) => kasusFormatif(kasus))
      .map((kasus) => kasus.id)
      .sort()[0]!
    const rngPasien = new Rng(2718, 's4-auto-formatif')
    const buatAntrian = (kasusId: string, jumlah: number) =>
      Array.from({ length: jumlah }, () => buatPasienDariKasus(kasusId, PACK, rngPasien))
    const dasar: GameState = {
      ...buildInitialState('Audit Auto Formatif', 2718, PACK),
      tutorialAktif: false,
      burnout: 100, // pBermasalah 0.45 — 20 undian lama nyaris pasti kena >= 1
    }

    const murniFormatif = advance(
      { ...dasar, klinik: { ...dasar.klinik, antrian: buatAntrian(idFormatif, 20) } },
      { type: 'LANJUTKAN' },
      PACK,
    ).state
    expect(murniFormatif.tally.autoBermasalah).toBe(0)
    expect(murniFormatif.klinik.autoHariIni.bermasalah).toBe(0)
    expect(murniFormatif.jadwal.filter((j) => j.id.startsWith('jadwal_terlantar_'))).toHaveLength(0)
    // `jumlah` tetap informasional (rekap "instingmu"), bukan tally — sengaja tak berubah.
    expect(murniFormatif.klinik.autoHariIni.jumlah).toBe(20)

    const campuran = advance(
      {
        ...dasar,
        klinik: {
          ...dasar.klinik,
          antrian: [...buatAntrian(idFormatif, 20), ...buatAntrian('ispa_common_cold', 20)],
        },
      },
      { type: 'LANJUTKAN' },
      PACK,
    ).state
    // Filter tidak mematikan mekanismenya: pasien resmi tetap bisa bermasalah.
    expect(campuran.tally.autoBermasalah).toBeGreaterThan(0)
  })

  it('grade harian mengabaikan kegagalan prototipe tetapi tetap menampilkan umpan baliknya', () => {
    const kasusResmi = PACK.kasus.ispa_common_cold!
    const kasusFormatif = PACK.kasus.lab_pneumonia_komunitas_dewasa!
    const resmi = nilaiEncounter(
      { ...encounterLengkap(kasusResmi), disposisi: 'pulang' },
      kasusResmi,
      PACK,
    )
    const formatif = {
      ...nilaiEncounter(
        {
          ...buatEncounter(buatPasienDariKasus(kasusFormatif.id, PACK, new Rng(991, 'formatif-gagal'))),
          fase: 'disposisi' as const,
          diagnosis: { icd10: 'Z00.0', jenis: 'tegak' as const },
          disposisi: 'pulang' as const,
        },
        kasusFormatif,
        PACK,
      ),
      formativePrototype: true,
    }
    expect(resmi.grade).toBe('A')
    expect(formatif.grade).not.toBe('A')
    expect(formatif.formativePrototype).toBe(true)

    const awal = buildInitialState('Audit Grade Formatif', 991, PACK)
    const ringkasan = ringkasanHarian({
      ...awal,
      klinik: {
        ...awal.klinik,
        selesaiHariIni: [resmi, formatif],
      },
    })
    expect(ringkasan.grade).toBe('A')
    expect(ringkasan.catatan.join(' ')).toMatch(/latihan formatif.*tidak mengubah grade/i)
  })
})

describe('P1 - pagar konten klinis', () => {
  it('sediaan mengikuti populasi dan tes nonspesifik tidak mengonfirmasi GAS/tifoid', () => {
    for (const id of ['faringitis_akut', 'tonsilitis_akut'] as const) {
      expect(PACK.kasus[id]?.demografi.usiaMin, id).toBeGreaterThanOrEqual(15)
    }
    const tifoid = PACK.kasus.demam_tifoid!
    expect(tifoid.demografi.usiaMin).toBe(10)
    expect(tifoid.tatalaksana.obatAlternatif).toContainEqual(
      expect.arrayContaining(['paracetamol_500', 'paracetamol_sirup']),
    )
    expect(tifoid.tatalaksana.obatAlternatif).toContainEqual(
      expect.arrayContaining(['amoxicillin_500', 'amoxicillin_sirup']),
    )
    expect(PACK.kasus.faringitis_akut?.lab.find((item) => item.id === 'darah_rutin')?.relevan).toBe(false)
    expect(PACK.kasus.tonsilitis_akut?.lab.find((item) => item.id === 'darah_rutin')?.relevan).toBe(false)
    expect(PACK.kasus.demam_tifoid?.lab.find((item) => item.id === 'widal')?.relevan).toBe(false)
    expect(PACK.kasus.demam_tifoid?.nama).toMatch(/Suspek/)
    expect(PACK.kasus.faringitis_akut?.kepastianDiagnosis).toBe('suspek')
    expect(PACK.kasus.tonsilitis_akut?.kepastianDiagnosis).toBe('suspek')
    expect(PACK.kasus.demam_tifoid?.kepastianDiagnosis).toBe('suspek')
  })

  it('semua kasus bernama Suspek menyatakan target kepastian secara eksplisit', () => {
    for (const kasus of Object.values(PACK.kasus)) {
      if (/\bsuspek\b/i.test(kasus.nama)) {
        expect(kasus.kepastianDiagnosis, kasus.id).toBe('suspek')
      }
    }
  })

  it('kasus kulit memakai sediaan, timing, dan klaim outcome yang tepat', () => {
    const pedikulosis = PACK.kasus.kulit_pedikulosis_kapitis!
    expect(pedikulosis.tatalaksana.obatBenar).toEqual(['permetrin_losion_1'])
    expect(pedikulosis.tatalaksana.obatSalahUmum?.some((item) => item.id === 'permetrin_krim')).toBe(true)

    const varisela = PACK.kasus.kulit_varisela!
    expect(varisela.demografi.usiaMin).toBeGreaterThan(12)
    const pembuka = varisela.anamnesis.find((item) => item.id === 'q_keluhan')!
    expect([pembuka.jawab, ...Object.values(pembuka.variasi ?? {})].every((teks) => /18 jam/.test(teks))).toBe(true)

    const zoster = PACK.kasus.kulit_herpes_zoster!
    expect(zoster.clue).toMatch(/tidak menunjukkan.*menurunkan insidennya/i)
    expect(zoster.sumber?.some((sumber) => sumber.id === 'cochrane_antiviral_phn')).toBe(true)
    expect(zoster.konsekuensi?.narasi).not.toMatch(/risiko neuralgia.*meningkat tajam/i)
  })

  it('kasus anak tidak memberi kredit pada tablet dewasa yang tidak dapat ditakar', () => {
    expect(PACK.kasus.kulit_pioderma_impetigo?.tatalaksana.obatOpsional ?? []).not.toContain('cefadroxil_500')
    const fraktur = PACK.kasus.lab_fraktur_tertutup_antebrachii_anak!
    expect(fraktur.tatalaksana.obatAlternatif).toEqual([['paracetamol_sirup']])
    expect(fraktur.tatalaksana.obatOpsional ?? []).not.toContain('ibuprofen_400')
  })

  it('provenance prioritas selalu berpasangan, unik, dan dapat dibuka lewat HTTPS', () => {
    const bersumber = Object.values(PACK.kasus).filter((kasus) => kasus.sumber?.length)
    expect(bersumber.length).toBeGreaterThanOrEqual(24)
    for (const kasus of bersumber) {
      const sumber = kasus.sumber ?? []
      expect(sumber.some((item) => item.jenis === 'pedoman_indonesia'), kasus.id).toBe(true)
      expect(sumber.some((item) => item.jenis === 'evidence_internasional'), kasus.id).toBe(true)
      expect(new Set(sumber.map((item) => item.id)).size, kasus.id).toBe(sumber.length)
      expect(sumber.every((item) => /^https:\/\//.test(item.url)), kasus.id).toBe(true)
    }

    for (const kasusId of [
      'asma_ringan',
      'tb_paru',
      'hipertensi_esensial',
      'dm_tipe2',
      'stroke_iskemik',
      'diare_akut_anak',
      'pneumonia_balita',
      'dengue_df',
    ]) {
      expect(PACK.kasus[kasusId]?.sumber?.length, kasusId).toBeGreaterThanOrEqual(2)
    }
  })
})
