/**
 * TEST CLINIC — mesin encounter poli, headless.
 * Fixture kasus mini inline (tidak mengimpor konten nyata — hanya tipe).
 */

import { describe, expect, it } from 'vitest'
import { aksiKlinik, buatEncounter, nilaiEncounter } from './clinic'
import { Rng } from './core/rng'
import type { Action } from './actions'
import type { GameEvent } from './events'
import type { EncounterState, PasienAktif } from './state'
import type {
  ItemLab,
  KasusKlinis,
  Obat,
  PertanyaanAnamnesis,
  TopikEdukasi,
} from '@content/types'

/* ---------------------------------------------------------------------------
 * Fixture mini — formularium, lab, edukasi
 * ------------------------------------------------------------------------- */

const OBAT_MINI: Record<string, Obat> = {
  paracetamol_500: {
    id: 'paracetamol_500',
    nama: 'Parasetamol 500 mg',
    kelas: 'analgetik-antipiretik',
    sediaan: 'tablet',
    hargaBeli: 200,
    hargaJual: 500,
    fornas: true,
  },
  amoxicillin_500: {
    id: 'amoxicillin_500',
    nama: 'Amoksisilin 500 mg',
    kelas: 'antibiotik penisilin',
    golonganAlergi: 'penisilin',
    sediaan: 'kaplet',
    hargaBeli: 450,
    hargaJual: 900,
    fornas: true,
    antibiotik: true,
  },
  eritromisin_500: {
    id: 'eritromisin_500',
    nama: 'Eritromisin 500 mg',
    kelas: 'antibiotik makrolida',
    golonganAlergi: 'makrolida',
    sediaan: 'tablet',
    hargaBeli: 700,
    hargaJual: 1400,
    fornas: true,
    antibiotik: true,
  },
  ibuprofen_400: {
    id: 'ibuprofen_400',
    nama: 'Ibuprofen 400 mg',
    kelas: 'NSAID',
    golonganAlergi: 'nsaid',
    sediaan: 'tablet',
    hargaBeli: 300,
    hargaJual: 700,
    fornas: true,
  },
}

const LAB_MINI: Record<string, ItemLab> = {
  darah_rutin: {
    id: 'darah_rutin',
    nama: 'Darah Rutin',
    biaya: 25000,
    nilaiNormal: 'Leukosit 4.000-11.000/µL',
  },
  bta_sputum: {
    id: 'bta_sputum',
    nama: 'BTA Sputum SPS',
    biaya: 35000,
    nilaiNormal: 'Negatif',
    hasilBesok: true,
  },
  gds: {
    id: 'gds',
    nama: 'Gula Darah Sewaktu',
    biaya: 15000,
    nilaiNormal: '< 200 mg/dL',
  },
}

const EDUKASI_MINI: Record<string, TopikEdukasi> = {
  etika_batuk: { id: 'etika_batuk', nama: 'Etika batuk' },
  istirahat_cukup: { id: 'istirahat_cukup', nama: 'Istirahat cukup' },
  cuci_tangan: { id: 'cuci_tangan', nama: 'Cuci tangan pakai sabun' },
  tanda_bahaya: { id: 'tanda_bahaya', nama: 'Tanda bahaya — kapan kembali' },
}

/* ---------------------------------------------------------------------------
 * Fixture mini — kasus klinis
 * ------------------------------------------------------------------------- */

/** Skema konten memuat flag `distraktor` opsional (dibaca clinic secara struktural). */
type Pertanyaan = PertanyaanAnamnesis & { distraktor?: boolean }

const ANAMNESIS_MINI: Pertanyaan[] = [
  {
    id: 'q_onset',
    kategori: 'keluhan_utama',
    tanya: 'Sejak kapan tenggorokannya sakit, Bu?',
    jawab: 'Dua hari ini, Dok. Untuk menelan sakit sekali.',
    variasi: {
      cemas: 'Dua hari, Dok... tapi rasanya makin parah. Ini bukan penyakit berbahaya, kan, Dok?',
    },
    esensial: true,
    oldcarts: ['onset', 'durasi'],
  },
  {
    id: 'q_demam',
    kategori: 'rps',
    tanya: 'Ada demamnya juga?',
    jawab: 'Iya, Dok, badan meriang sejak kemarin sore.',
    esensial: true,
    oldcarts: ['penyerta'],
  },
  {
    id: 'q_batuk',
    kategori: 'rps',
    tanya: 'Batuk atau pileknya ada?',
    jawab: 'Batuk hampir tidak ada, Dok. Pilek juga tidak.',
    esensial: true,
    oldcarts: ['penyerta'],
  },
  {
    id: 'q_alergi',
    kategori: 'rpd',
    tanya: 'Pernah alergi obat sebelumnya?',
    jawab: 'Dulu pernah bentol-bentol seluruh badan setelah minum amoksisilin, Dok.',
  },
  {
    id: 'q_distraktor',
    kategori: 'rpk',
    tanya: 'Di keluarga ada yang sakit gula?',
    jawab: 'Wah, tidak ada, Dok. Memangnya ada hubungannya sama tenggorokan saya?',
    distraktor: true,
  },
  {
    id: 'q_makan',
    kategori: 'sosial',
    tanya: 'Makan dan minumnya masih masuk?',
    jawab: 'Masih, Dok, tapi pelan-pelan karena nyeri.',
    oldcarts: ['keparahan'],
  },
]

const KASUS_FARINGITIS: KasusKlinis = {
  id: 'faringitis_mini',
  nama: 'Faringitis Akut',
  icd10: 'J02.9',
  skdi: '4A',
  kategori: 'infeksi',
  fktp144: true,
  harusDirujuk: false,
  keluhanUtama: 'Tenggorokan sakit sekali untuk menelan sejak dua hari.',
  demografi: { usiaMin: 6, usiaMax: 45 },
  vital: { td: '110/70', nadi: 92, rr: 18, suhu: 38.2 },
  anamnesis: ANAMNESIS_MINI,
  pemeriksaanFisik: [
    { region: 'tht_mulut', temuan: 'Faring hiperemis, tonsil T2-T2 dengan eksudat putih.', relevan: true },
    { region: 'kepala_leher', temuan: 'KGB servikal anterior teraba, nyeri tekan.', relevan: true },
    { region: 'toraks_paru', temuan: 'Vesikuler kanan-kiri, tidak ada ronki.', relevan: false },
    { region: 'abdomen', temuan: 'Supel, bising usus normal.', relevan: false },
  ],
  lab: [
    { id: 'darah_rutin', hasil: 'Leukosit 13.400/µL, dominan neutrofil.', flag: 'tinggi', relevan: true },
    { id: 'bta_sputum', hasil: 'Negatif', flag: 'normal', relevan: false },
  ],
  diagnosisBanding: ['J02.9', 'J03.0', 'J00'],
  tatalaksana: {
    obatBenar: ['amoxicillin_500', 'paracetamol_500'],
    edukasi: ['etika_batuk', 'istirahat_cukup'],
  },
  clue: 'Skor Centor ≥3 (demam, eksudat tonsil, KGB nyeri, tanpa batuk) mendukung antibiotik empiris pada faringitis (PPK FKTP, Permenkes 5/2014).',
  alergiTrap: {
    kelas: 'penisilin',
    obatTerlarang: ['amoxicillin_500'],
    alternatifBenar: ['eritromisin_500'],
  },
}

const KASUS_VIRAL: KasusKlinis = {
  id: 'ispa_mini',
  nama: 'Common Cold',
  icd10: 'J00',
  skdi: '4A',
  kategori: 'respirasi',
  fktp144: true,
  harusDirujuk: false,
  keluhanUtama: 'Pilek, bersin-bersin, badan sumeng sejak kemarin.',
  demografi: { usiaMin: 5, usiaMax: 60 },
  vital: { suhu: 37.4, nadi: 88, rr: 18 },
  anamnesis: [],
  pemeriksaanFisik: [{ region: 'tht_mulut', temuan: 'Sekret hidung serosa, faring tenang.', relevan: true }],
  lab: [],
  diagnosisBanding: ['J00', 'J02.9'],
  tatalaksana: {
    obatBenar: ['paracetamol_500'],
    edukasi: ['istirahat_cukup'],
  },
  clue: 'Common cold sembuh sendiri 7-10 hari; antibiotik tidak terindikasi (WHO Pocket Book).',
}

const KASUS_RUJUK: KasusKlinis = {
  id: 'pneumonia_mini',
  nama: 'Pneumonia Balita',
  icd10: 'J18.9',
  skdi: '3B',
  kategori: 'respirasi',
  fktp144: true,
  harusDirujuk: true,
  keluhanUtama: 'Anak sesak, napasnya cepat sekali sejak tadi malam.',
  demografi: { usiaMin: 1, usiaMax: 5 },
  vital: { rr: 52, suhu: 38.9, spo2: 91, nadi: 132 },
  anamnesis: [],
  pemeriksaanFisik: [
    { region: 'toraks_paru', temuan: 'Retraksi subkostal, ronki basah halus di kedua lapang paru.', relevan: true },
  ],
  lab: [],
  diagnosisBanding: ['J18.9', 'J45.9', 'J21.9'],
  tatalaksana: {
    obatBenar: [],
    edukasi: ['tanda_bahaya'],
  },
  clue: 'Napas cepat + retraksi dinding dada pada balita = pneumonia berat: stabilisasi oksigen lalu rujuk (MTBS 2019).',
}

const PACK = {
  kasus: {
    faringitis_mini: KASUS_FARINGITIS,
    ispa_mini: KASUS_VIRAL,
    pneumonia_mini: KASUS_RUJUK,
  } as Record<string, KasusKlinis>,
  keluarga: {},
  kader: [],
  rw: [],
  obat: OBAT_MINI,
  lab: LAB_MINI,
  edukasi: EDUKASI_MINI,
  skdi144: [],
  namaWarga: { pria: [], wanita: [], keluarga: [] },
}

/* ---------------------------------------------------------------------------
 * Util test
 * ------------------------------------------------------------------------- */

function buatPasien(override: Partial<PasienAktif> = {}): PasienAktif {
  return {
    id: 'p_test_1',
    nama: 'Bu Sari',
    usia: 24,
    jenisKelamin: 'P',
    persona: 'polos',
    kasusId: 'faringitis_mini',
    bpjs: true,
    alergi: [],
    rw: 3,
    bonusTrust: false,
    ...override,
  }
}

function rngTest(): Rng {
  return new Rng(42, 'clinic-test')
}

/** Jalankan serangkaian aksi berurutan; kumpulkan semua event. */
function jalankan(
  enc: EncounterState,
  aksi: Action[],
  kasus: KasusKlinis = KASUS_FARINGITIS,
): { enc: EncounterState; events: GameEvent[] } {
  let sekarang = enc
  const events: GameEvent[] = []
  for (let i = 0; i < aksi.length; i++) {
    const a = aksi[i]!
    const hasil = aksiKlinik(sekarang, a, kasus, PACK, new Rng(42, 'clinic-test', i))
    sekarang = hasil.enc
    events.push(...hasil.events)
  }
  return { enc: sekarang, events }
}

function cariEvent<T extends GameEvent['type']>(
  events: GameEvent[],
  type: T,
): Extract<GameEvent, { type: T }> | undefined {
  return events.find((e): e is Extract<GameEvent, { type: T }> => e.type === type)
}

/* ---------------------------------------------------------------------------
 * buatEncounter
 * ------------------------------------------------------------------------- */

describe('buatEncounter', () => {
  it('memulai encounter bersih di fase anamnesis dengan sabar penuh', () => {
    const enc = buatEncounter(buatPasien())
    expect(enc.fase).toBe('anamnesis')
    expect(enc.sabar).toBe(100)
    expect(enc.ditanya).toEqual([])
    expect(enc.vitalDiukur).toBe(false)
    expect(enc.diperiksa).toEqual([])
    expect(enc.labDipesan).toEqual([])
    expect(enc.labTersedia).toEqual([])
    expect(enc.resep).toEqual([])
    expect(enc.edukasi).toEqual([])
    expect(enc.firewallTerpicu).toBe(0)
    expect(enc.diagnosis).toBeUndefined()
    expect(enc.disposisi).toBeUndefined()
  })
})

/* ---------------------------------------------------------------------------
 * Anamnesis: jawaban, persona, sabar
 * ------------------------------------------------------------------------- */

describe('aksiKlinik — TANYA', () => {
  it('menjawab dengan jawaban baku dan mencatat pertanyaan', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: baru, events } = aksiKlinik(
      enc,
      { type: 'TANYA', pertanyaanId: 'q_onset' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(baru.ditanya).toEqual(['q_onset'])
    expect(baru.sabar).toBe(100)
    const jawab = cariEvent(events, 'PASIEN_MENJAWAB')
    expect(jawab?.teks).toBe('Dua hari ini, Dok. Untuk menelan sakit sekali.')
  })

  it('memakai variasi persona bila tersedia', () => {
    const enc = buatEncounter(buatPasien({ persona: 'cemas' }))
    const { events } = aksiKlinik(
      enc,
      { type: 'TANYA', pertanyaanId: 'q_onset' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    const jawab = cariEvent(events, 'PASIEN_MENJAWAB')
    expect(jawab?.teks).toContain('bukan penyakit berbahaya')
  })

  it('distraktor menggerus sabar −10', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: baru } = aksiKlinik(
      enc,
      { type: 'TANYA', pertanyaanId: 'q_distraktor' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(baru.sabar).toBe(90)
  })

  it('pertanyaan ke-9 dan seterusnya menggerus sabar −4 (anamnesis shotgun)', () => {
    const enc: EncounterState = {
      ...buatEncounter(buatPasien()),
      ditanya: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8'],
    }
    const { enc: baru } = aksiKlinik(
      enc,
      { type: 'TANYA', pertanyaanId: 'q_makan' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(baru.ditanya).toHaveLength(9)
    expect(baru.sabar).toBe(96)
  })

  it('mengeluarkan SABAR_MENIPIS saat sabar turun ke bawah 30', () => {
    const enc: EncounterState = { ...buatEncounter(buatPasien()), sabar: 35 }
    const { enc: baru, events } = aksiKlinik(
      enc,
      { type: 'TANYA', pertanyaanId: 'q_distraktor' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(baru.sabar).toBe(25)
    expect(cariEvent(events, 'SABAR_MENIPIS')).toBeDefined()
  })

  it('sabar habis → pasien menjawab ketus, bukan jawaban klinis', () => {
    const enc: EncounterState = { ...buatEncounter(buatPasien()), sabar: 5 }
    const { enc: baru, events } = aksiKlinik(
      enc,
      { type: 'TANYA', pertanyaanId: 'q_distraktor' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(baru.sabar).toBe(0)
    const jawab = cariEvent(events, 'PASIEN_MENJAWAB')
    expect(jawab).toBeDefined()
    const qDistraktor = KASUS_FARINGITIS.anamnesis.find((q) => q.id === 'q_distraktor')
    expect(jawab?.teks).not.toBe(qDistraktor?.jawab)
  })

  it('pertanyaan duplikat tidak dicatat dua kali dan tidak menggerus sabar lagi', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: baru } = jalankan(enc, [
      { type: 'TANYA', pertanyaanId: 'q_distraktor' },
      { type: 'TANYA', pertanyaanId: 'q_distraktor' },
    ])
    expect(baru.ditanya).toEqual(['q_distraktor'])
    expect(baru.sabar).toBe(90)
  })

  it('pertanyaan yang tidak ada di kasus → ERROR_AKSI tanpa perubahan state', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: baru, events } = aksiKlinik(
      enc,
      { type: 'TANYA', pertanyaanId: 'q_tidak_ada' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(baru).toBe(enc)
    expect(cariEvent(events, 'ERROR_AKSI')).toBeDefined()
  })
})

/* ---------------------------------------------------------------------------
 * Pemeriksaan fisik & vital & lab
 * ------------------------------------------------------------------------- */

describe('aksiKlinik — pemeriksaan', () => {
  it('UKUR_VITAL menandai vital dan idempoten', () => {
    const enc = buatEncounter(buatPasien())
    const pertama = aksiKlinik(enc, { type: 'UKUR_VITAL' }, KASUS_FARINGITIS, PACK, rngTest())
    expect(pertama.enc.vitalDiukur).toBe(true)
    expect(cariEvent(pertama.events, 'VITAL_TERUKUR')).toBeDefined()
    const kedua = aksiKlinik(pertama.enc, { type: 'UKUR_VITAL' }, KASUS_FARINGITIS, PACK, rngTest())
    expect(kedua.events).toEqual([])
  })

  it('PERIKSA region terdaftar mengembalikan temuan kasus', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: baru, events } = aksiKlinik(
      enc,
      { type: 'PERIKSA', region: 'tht_mulut' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(baru.diperiksa).toEqual(['tht_mulut'])
    const temuan = cariEvent(events, 'TEMUAN_FISIK')
    expect(temuan?.temuan).toContain('Faring hiperemis')
  })

  it('PERIKSA region tak terdaftar → "dalam batas normal"', () => {
    const enc = buatEncounter(buatPasien())
    const { events } = aksiKlinik(
      enc,
      { type: 'PERIKSA', region: 'neurologis' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    const temuan = cariEvent(events, 'TEMUAN_FISIK')
    expect(temuan?.temuan).toBe('dalam batas normal')
  })

  it('PESAN_LAB biasa langsung tersedia; hasilBesok TIDAK masuk labTersedia', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: baru, events } = jalankan(enc, [
      { type: 'PESAN_LAB', labId: 'darah_rutin' },
      { type: 'PESAN_LAB', labId: 'bta_sputum' },
    ])
    expect(baru.labDipesan).toEqual(['darah_rutin', 'bta_sputum'])
    expect(baru.labTersedia).toEqual(['darah_rutin'])
    const dipesan = events.filter((e) => e.type === 'LAB_DIPESAN')
    expect(dipesan).toHaveLength(2)
    expect(cariEvent(events, 'LAB_DIPESAN')?.besok).toBe(false)
    const besok = events.find((e) => e.type === 'LAB_DIPESAN' && e.besok)
    expect(besok).toBeDefined()
  })

  it('lab duplikat ditolak diam-diam (tanpa event, tanpa perubahan)', () => {
    const enc = buatEncounter(buatPasien())
    const pertama = aksiKlinik(
      enc,
      { type: 'PESAN_LAB', labId: 'darah_rutin' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    const kedua = aksiKlinik(
      pertama.enc,
      { type: 'PESAN_LAB', labId: 'darah_rutin' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(kedua.enc.labDipesan).toEqual(['darah_rutin'])
    expect(kedua.events).toEqual([])
  })
})

/* ---------------------------------------------------------------------------
 * Fase, diagnosis, firewall alergi
 * ------------------------------------------------------------------------- */

describe('aksiKlinik — fase & diagnosis', () => {
  it('LANJUT_FASE mengikuti urutan anamnesis→pemeriksaan→diagnosis→terapi→disposisi', () => {
    let enc = buatEncounter(buatPasien())
    const urutan: string[] = [enc.fase]
    for (let i = 0; i < 5; i++) {
      enc = aksiKlinik(enc, { type: 'LANJUT_FASE' }, KASUS_FARINGITIS, PACK, rngTest()).enc
      urutan.push(enc.fase)
    }
    expect(urutan).toEqual([
      'anamnesis',
      'pemeriksaan',
      'diagnosis',
      'terapi',
      'disposisi',
      'disposisi', // mentok — DISPOSISI ditangani reducer
    ])
  })

  it('KOMIT_DIAGNOSIS menyetel diagnosis, pindah ke terapi, dan mengeluarkan STEMPEL', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: baru, events } = aksiKlinik(
      enc,
      { type: 'KOMIT_DIAGNOSIS', icd10: 'J02.9', jenis: 'suspek' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(baru.diagnosis).toEqual({ icd10: 'J02.9', jenis: 'suspek' })
    expect(baru.fase).toBe('terapi')
    expect(cariEvent(events, 'STEMPEL')?.jenis).toBe('suspek')
  })
})

describe('aksiKlinik — firewall alergi', () => {
  it('memblokir obat segolongan alergi pasien: resep tidak bertambah', () => {
    const enc = buatEncounter(buatPasien({ alergi: ['penisilin'] }))
    const { enc: baru, events } = aksiKlinik(
      enc,
      { type: 'TAMBAH_OBAT', obatId: 'amoxicillin_500' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(baru.resep).toEqual([])
    expect(baru.firewallTerpicu).toBe(1)
    const firewall = cariEvent(events, 'FIREWALL_ALERGI')
    expect(firewall).toEqual({
      type: 'FIREWALL_ALERGI',
      obatId: 'amoxicillin_500',
      golongan: 'penisilin',
    })
    expect(cariEvent(events, 'STEMPEL')?.jenis).toBe('kontraindikasi')
  })

  it('alternatif di luar golongan alergi tetap boleh diresepkan', () => {
    const enc = buatEncounter(buatPasien({ alergi: ['penisilin'] }))
    const { enc: baru } = jalankan(enc, [
      { type: 'TAMBAH_OBAT', obatId: 'amoxicillin_500' }, // diblokir
      { type: 'TAMBAH_OBAT', obatId: 'eritromisin_500' }, // lolos
      { type: 'TAMBAH_OBAT', obatId: 'paracetamol_500' }, // lolos
    ])
    expect(baru.resep).toEqual(['eritromisin_500', 'paracetamol_500'])
    expect(baru.firewallTerpicu).toBe(1)
  })

  it('HAPUS_OBAT dan TAMBAH/HAPUS_EDUKASI bekerja biasa', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: baru } = jalankan(enc, [
      { type: 'TAMBAH_OBAT', obatId: 'paracetamol_500' },
      { type: 'TAMBAH_OBAT', obatId: 'ibuprofen_400' },
      { type: 'HAPUS_OBAT', obatId: 'ibuprofen_400' },
      { type: 'TAMBAH_EDUKASI', edukasiId: 'etika_batuk' },
      { type: 'TAMBAH_EDUKASI', edukasiId: 'cuci_tangan' },
      { type: 'HAPUS_EDUKASI', edukasiId: 'cuci_tangan' },
    ])
    expect(baru.resep).toEqual(['paracetamol_500'])
    expect(baru.edukasi).toEqual(['etika_batuk'])
  })
})

/* ---------------------------------------------------------------------------
 * nilaiEncounter
 * ------------------------------------------------------------------------- */

describe('nilaiEncounter — kalibrasi stempel dua tinta', () => {
  function encDenganDiagnosis(jenis: 'tegak' | 'suspek', icd10: string): EncounterState {
    const enc = buatEncounter(buatPasien())
    return {
      ...enc,
      diagnosis: { icd10, jenis },
      disposisi: 'pulang',
    }
  }

  it('tegak-salah dan suspek-salah terekam berbeda (pakan kalibrasi)', () => {
    const tegakSalah = nilaiEncounter(
      encDenganDiagnosis('tegak', 'J03.0'),
      KASUS_FARINGITIS,
      PACK,
    )
    const suspekSalah = nilaiEncounter(
      encDenganDiagnosis('suspek', 'J03.0'),
      KASUS_FARINGITIS,
      PACK,
    )
    expect(tegakSalah.diagnosisBenar).toBe(false)
    expect(suspekSalah.diagnosisBenar).toBe(false)
    expect(tegakSalah.jenisDiagnosis).toBe('tegak')
    expect(suspekSalah.jenisDiagnosis).toBe('suspek')
    expect(tegakSalah.jenisDiagnosis).not.toBe(suspekSalah.jenisDiagnosis)
  })

  it('diagnosis benar terdeteksi dari kecocokan ICD-10', () => {
    const benar = nilaiEncounter(encDenganDiagnosis('tegak', 'J02.9'), KASUS_FARINGITIS, PACK)
    expect(benar.diagnosisBenar).toBe(true)
    expect(benar.jenisDiagnosis).toBe('tegak')
  })
})

describe('nilaiEncounter — grade masuk akal', () => {
  it('permainan teliti mendapat grade A', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: main } = jalankan(enc, [
      { type: 'TANYA', pertanyaanId: 'q_onset' },
      { type: 'TANYA', pertanyaanId: 'q_demam' },
      { type: 'TANYA', pertanyaanId: 'q_batuk' },
      { type: 'TANYA', pertanyaanId: 'q_makan' },
      { type: 'UKUR_VITAL' },
      { type: 'PERIKSA', region: 'tht_mulut' },
      { type: 'PERIKSA', region: 'kepala_leher' },
      { type: 'PESAN_LAB', labId: 'darah_rutin' },
      { type: 'KOMIT_DIAGNOSIS', icd10: 'J02.9', jenis: 'tegak' },
      { type: 'TAMBAH_OBAT', obatId: 'amoxicillin_500' },
      { type: 'TAMBAH_OBAT', obatId: 'paracetamol_500' },
      { type: 'TAMBAH_EDUKASI', edukasiId: 'etika_batuk' },
      { type: 'TAMBAH_EDUKASI', edukasiId: 'istirahat_cukup' },
    ])
    const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)

    expect(nilai.diagnosisBenar).toBe(true)
    expect(nilai.skorPemeriksaan).toBe(100)
    expect(nilai.skorTerapi).toBe(100)
    expect(nilai.skorEdukasi).toBe(100)
    expect(nilai.disposisiTepat).toBe(true)
    expect(nilai.rujukanNonSpesialistik).toBe(false)
    expect(nilai.cowboy).toBe(false)
    expect(nilai.antibiotikTanpaIndikasi).toBe(false)
    expect(nilai.labTakRelevan).toBe(0)
    expect(nilai.konsekuensiDijadwalkan).toBe(false)
    expect(nilai.clue).toBe(KASUS_FARINGITIS.clue)
    expect(nilai.grade).toBe('A')
  })

  it('permainan asal-asalan mendapat grade D', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: main } = jalankan(enc, [
      { type: 'KOMIT_DIAGNOSIS', icd10: 'J00', jenis: 'tegak' }, // salah, tanpa anamnesis
      { type: 'TAMBAH_OBAT', obatId: 'ibuprofen_400' }, // di luar tatalaksana
    ])
    const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)

    expect(nilai.diagnosisBenar).toBe(false)
    expect(nilai.skorAnamnesis).toBe(0)
    expect(nilai.skorTerapi).toBe(0)
    expect(nilai.grade).toBe('D')
  })

  it('distraktor yang ditanya menggerus skor anamnesis', () => {
    const enc = buatEncounter(buatPasien())
    const bersih = jalankan(enc, [
      { type: 'TANYA', pertanyaanId: 'q_onset' },
      { type: 'TANYA', pertanyaanId: 'q_demam' },
      { type: 'TANYA', pertanyaanId: 'q_batuk' },
    ])
    const kotor = jalankan(bersih.enc, [{ type: 'TANYA', pertanyaanId: 'q_distraktor' }])
    const nilaiBersih = nilaiEncounter({ ...bersih.enc, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)
    const nilaiKotor = nilaiEncounter({ ...kotor.enc, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)
    expect(nilaiKotor.skorAnamnesis).toBe(nilaiBersih.skorAnamnesis - 5)
  })

  it('tanpa vital, skor pemeriksaan tertahan di 50', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: main } = jalankan(enc, [
      { type: 'PERIKSA', region: 'tht_mulut' },
      { type: 'PERIKSA', region: 'kepala_leher' },
    ])
    const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)
    expect(nilai.skorPemeriksaan).toBe(50)
  })
})

describe('nilaiEncounter — stewardship, disposisi, lab, SBAR', () => {
  it('antibiotik tanpa indikasi tercatat pada kasus viral', () => {
    const enc = buatEncounter(buatPasien({ kasusId: 'ispa_mini' }))
    const { enc: main } = jalankan(
      enc,
      [
        { type: 'KOMIT_DIAGNOSIS', icd10: 'J00', jenis: 'tegak' },
        { type: 'TAMBAH_OBAT', obatId: 'paracetamol_500' },
        { type: 'TAMBAH_OBAT', obatId: 'eritromisin_500' },
      ],
      KASUS_VIRAL,
    )
    const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_VIRAL, PACK)
    expect(nilai.antibiotikTanpaIndikasi).toBe(true)
  })

  it('merujuk kasus 4A = rujukan non-spesialistik; menahan kasus rujukan = cowboy', () => {
    const encFaringitis: EncounterState = {
      ...buatEncounter(buatPasien()),
      diagnosis: { icd10: 'J02.9', jenis: 'suspek' },
      disposisi: 'rujuk',
    }
    const rrns = nilaiEncounter(encFaringitis, KASUS_FARINGITIS, PACK)
    expect(rrns.rujukanNonSpesialistik).toBe(true)
    expect(rrns.disposisiTepat).toBe(false)
    expect(rrns.cowboy).toBe(false)

    const encPneumonia: EncounterState = {
      ...buatEncounter(buatPasien({ kasusId: 'pneumonia_mini', usia: 3, nama: 'Ade Bima' })),
      diagnosis: { icd10: 'J18.9', jenis: 'tegak' },
      disposisi: 'pulang',
    }
    const cowboy = nilaiEncounter(encPneumonia, KASUS_RUJUK, PACK)
    expect(cowboy.cowboy).toBe(true)
    expect(cowboy.disposisiTepat).toBe(false)
    expect(cowboy.rujukanNonSpesialistik).toBe(false)
  })

  it('lab tak relevan dihitung: relevan:false + lab di luar kasus', () => {
    const enc = buatEncounter(buatPasien())
    const { enc: main } = jalankan(enc, [
      { type: 'PESAN_LAB', labId: 'darah_rutin' }, // relevan
      { type: 'PESAN_LAB', labId: 'bta_sputum' }, // relevan: false
      { type: 'PESAN_LAB', labId: 'gds' }, // tidak ada di kasus
    ])
    const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)
    expect(nilai.labTakRelevan).toBe(2)
  })

  it('SBAR lengkap yang menyebut diagnosis dinilai 100; tanpa SBAR skor tidak ada', () => {
    const dasarPneumonia: EncounterState = {
      ...buatEncounter(buatPasien({ kasusId: 'pneumonia_mini', usia: 3, nama: 'Ade Bima' })),
      diagnosis: { icd10: 'J18.9', jenis: 'suspek' },
      disposisi: 'rujuk',
    }
    const lengkap = nilaiEncounter(
      {
        ...dasarPneumonia,
        sbar: {
          situation: 'Anak laki-laki 3 tahun, sesak napas berat sejak tadi malam.',
          background: 'Demam 2 hari, batuk berdahak, belum pernah sesak sebelumnya.',
          assessment: 'Suspek pneumonia berat (J18.9): RR 52x/menit, retraksi subkostal, SpO2 91%.',
          recommendation: 'Mohon penanganan lanjutan rawat inap; oksigen terpasang selama transport.',
        },
      },
      KASUS_RUJUK,
      PACK,
    )
    expect(lengkap.sbarSkor).toBe(100)

    const tanpaSbar = nilaiEncounter(dasarPneumonia, KASUS_RUJUK, PACK)
    expect(tanpaSbar.sbarSkor).toBeUndefined()
  })

  it('SBAR asal-asalan mendapat skor rendah', () => {
    const enc: EncounterState = {
      ...buatEncounter(buatPasien({ kasusId: 'pneumonia_mini', usia: 3 })),
      diagnosis: { icd10: 'J18.9', jenis: 'suspek' },
      disposisi: 'rujuk',
      sbar: {
        situation: 'anak sesak',
        background: '-',
        assessment: 'J18.9',
        recommendation: 'rujuk',
      },
    }
    const nilai = nilaiEncounter(enc, KASUS_RUJUK, PACK)
    // Semua field < 20 karakter; assessment menyebut ICD-10 → hanya +20.
    expect(nilai.sbarSkor).toBe(20)
  })
})
