/**
 * TEST CLINIC — mesin encounter poli, headless.
 * Fixture kasus mini inline (tidak mengimpor konten nyata — hanya tipe).
 */

import { describe, expect, it } from 'vitest'
import { aksiKlinik, buatEncounter, nilaiEncounter, temuanUntukRegion, KAPASITAS_EDUKASI } from './clinic'
import { Rng } from './core/rng'
import type { Action } from './actions'
import type { GameEvent } from './events'
import type { EncounterState, FaseEncounter, PasienAktif } from './state'
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
  cetirizine_10: {
    id: 'cetirizine_10',
    nama: 'Setirizin 10 mg',
    kelas: 'antihistamin',
    sediaan: 'tablet',
    hargaBeli: 300,
    hargaJual: 600,
    fornas: true,
  },
  loratadin_10: {
    id: 'loratadin_10',
    nama: 'Loratadin 10 mg',
    kelas: 'antihistamin',
    sediaan: 'tablet',
    hargaBeli: 350,
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
  etika_batuk: { id: 'etika_batuk', nama: 'Etika batuk', kategori: 'higiene' },
  istirahat_cukup: { id: 'istirahat_cukup', nama: 'Istirahat cukup', kategori: 'gaya_hidup' },
  cuci_tangan: { id: 'cuci_tangan', nama: 'Cuci tangan pakai sabun', kategori: 'higiene' },
  tanda_bahaya: { id: 'tanda_bahaya', nama: 'Tanda bahaya — kapan kembali', kategori: 'kepatuhan' },
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

// Kasus dgn PROSEDUR wajib (CODEX #4): tatalaksana benarnya = tindakan, bukan
// (hanya) obat. Reuse KASUS_VIRAL utk field valid, override id + tatalaksana.
const KASUS_PROSEDUR: KasusKlinis = {
  ...KASUS_VIRAL,
  id: 'vertigo_mini',
  nama: 'Vertigo Posisi',
  tatalaksana: {
    obatBenar: ['paracetamol_500'],
    edukasi: ['istirahat_cukup'],
    prosedur: ['reposisi_mini'],
  },
}

const PACK = {
  kasus: {
    faringitis_mini: KASUS_FARINGITIS,
    ispa_mini: KASUS_VIRAL,
    pneumonia_mini: KASUS_RUJUK,
    vertigo_mini: KASUS_PROSEDUR,
  } as Record<string, KasusKlinis>,
  kasusIgd: {},
  keluarga: {},
  kader: [],
  rw: [],
  rumahSakit: [],
  obat: OBAT_MINI,
  lab: LAB_MINI,
  edukasi: EDUKASI_MINI,
  tindakan: {
    reposisi_mini: { id: 'reposisi_mini', nama: 'Manuver reposisi', biaya: 25000 },
    nebul_mini: { id: 'nebul_mini', nama: 'Nebulisasi', biaya: 40000 },
  },
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

/**
 * Fast-forward encounter langsung ke fase tertentu (phase-guard CODEX audit
 * 2026-07-04, temuan #2 §9) — dipakai test yang mau menguji perilaku SATU
 * fase secara terisolasi, tanpa perlu menulis ulang LANJUT_FASE berulang di
 * tiap test. Sah krn EncounterState cuma plain object, bukan enkapsulasi.
 */
function buatEncounterFase(pasien: PasienAktif, fase: EncounterState['fase']): EncounterState {
  return { ...buatEncounter(pasien), fase }
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

  it('DeepThink #2: klik distraktor SETELAH sabar habis dicatat ke ditanyaKetus (bukan hilang tanpa jejak)', () => {
    const enc: EncounterState = { ...buatEncounter(buatPasien()), sabar: 0 }
    const { enc: baru } = aksiKlinik(
      enc,
      { type: 'TANYA', pertanyaanId: 'q_distraktor' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    // TIDAK dapat kredit (ditanya tetap kosong — pola lama tetap dipertahankan)...
    expect(baru.ditanya).toEqual([])
    // ...TAPI kini tercatat ke ditanyaKetus supaya nilaiEncounter bisa menghukumnya.
    expect(baru.ditanyaKetus).toEqual(['q_distraktor'])
  })

  it('DeepThink #2: klik pertanyaan ESENSIAL setelah sabar habis TETAP tak dapat kredit (regresi thd fix lama)', () => {
    const enc: EncounterState = { ...buatEncounter(buatPasien()), sabar: 0 }
    const { enc: baru } = aksiKlinik(
      enc,
      { type: 'TANYA', pertanyaanId: 'q_onset' }, // esensial, BUKAN distraktor
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(baru.ditanya).toEqual([]) // tak dapat kredit esensial/OLDCARTS
    expect(baru.ditanyaKetus).toEqual(['q_onset']) // tapi tercatat (gate anti-spam repeat)
  })

  it('pertanyaan yg sudah diklik SAAT ketus, diklik ulang → tak berubah (gate anti-repeat berlaku juga utk ditanyaKetus)', () => {
    let enc: EncounterState = { ...buatEncounter(buatPasien()), sabar: 0 }
    enc = jalankan(enc, [{ type: 'TANYA', pertanyaanId: 'q_distraktor' }], KASUS_FARINGITIS).enc
    expect(enc.ditanyaKetus).toEqual(['q_distraktor'])
    const { enc: baru } = aksiKlinik(
      enc,
      { type: 'TANYA', pertanyaanId: 'q_distraktor' },
      KASUS_FARINGITIS,
      PACK,
      rngTest(),
    )
    expect(baru.ditanyaKetus).toEqual(['q_distraktor']) // tak dobel
    expect(baru.ditanya).toEqual([])
  })

  it('DeepThink #2: distraktor pasca-ketus tetap menghukum skorAnamnesis di nilaiEncounter — dulu lolos gratis', () => {
    const dasar: EncounterState = { ...buatEncounter(buatPasien()), ditanya: ['q_onset'] }
    const tanpaSpam = nilaiEncounter({ ...dasar, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)
    // Sebelum fix: spam 3 distraktor pasca-ketus = GRATIS (tak pernah tercatat
    // di mana pun) — skorAnamnesis identik dgn tanpa spam sama sekali.
    const spamDistraktor = nilaiEncounter(
      { ...dasar, ditanyaKetus: ['q_distraktor'], disposisi: 'pulang' },
      KASUS_FARINGITIS,
      PACK,
    )
    expect(spamDistraktor.skorAnamnesis).toBeLessThan(tanpaSpam.skorAnamnesis)
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
    const enc = buatEncounterFase(buatPasien(), 'pemeriksaan')
    const pertama = aksiKlinik(enc, { type: 'UKUR_VITAL' }, KASUS_FARINGITIS, PACK, rngTest())
    expect(pertama.enc.vitalDiukur).toBe(true)
    expect(cariEvent(pertama.events, 'VITAL_TERUKUR')).toBeDefined()
    const kedua = aksiKlinik(pertama.enc, { type: 'UKUR_VITAL' }, KASUS_FARINGITIS, PACK, rngTest())
    expect(kedua.events).toEqual([])
  })

  it('PERIKSA region terdaftar mengembalikan temuan kasus', () => {
    const enc = buatEncounterFase(buatPasien(), 'pemeriksaan')
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
    const enc = buatEncounterFase(buatPasien(), 'pemeriksaan')
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
    const enc = buatEncounterFase(buatPasien(), 'pemeriksaan')
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
    const enc = buatEncounterFase(buatPasien(), 'pemeriksaan')
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
    const enc = buatEncounterFase(buatPasien(), 'diagnosis')
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

/* ---------------------------------------------------------------------------
 * Phase-guard (CODEX audit 2026-07-04, temuan #2 §9): tiap kategori aksi
 * cuma sah pada fase kanoniknya — dispatch manual lompat-fase kini ditolak
 * ERROR_AKSI, bukan diam-diam diterima, walau pemain memakai DevTools/API.
 * ------------------------------------------------------------------------- */
describe('aksiKlinik — phase-guard: aksi salah-fase ditolak', () => {
  const kasusFase: { aksi: Action; sahDi: FaseEncounter }[] = [
    { aksi: { type: 'TANYA', pertanyaanId: 'q_onset' }, sahDi: 'anamnesis' },
    { aksi: { type: 'UKUR_VITAL' }, sahDi: 'pemeriksaan' },
    { aksi: { type: 'PERIKSA', region: 'tht_mulut' }, sahDi: 'pemeriksaan' },
    { aksi: { type: 'PESAN_LAB', labId: 'darah_rutin' }, sahDi: 'pemeriksaan' },
    { aksi: { type: 'KOMIT_DIAGNOSIS', icd10: 'J02.9', jenis: 'suspek' }, sahDi: 'diagnosis' },
    { aksi: { type: 'TAMBAH_OBAT', obatId: 'paracetamol_500' }, sahDi: 'terapi' },
    { aksi: { type: 'HAPUS_OBAT', obatId: 'paracetamol_500' }, sahDi: 'terapi' },
    { aksi: { type: 'TAMBAH_EDUKASI', edukasiId: 'etika_batuk' }, sahDi: 'terapi' },
    { aksi: { type: 'HAPUS_EDUKASI', edukasiId: 'etika_batuk' }, sahDi: 'terapi' },
  ]
  const semuaFase: FaseEncounter[] = ['anamnesis', 'pemeriksaan', 'diagnosis', 'terapi', 'disposisi']

  for (const { aksi, sahDi } of kasusFase) {
    for (const fase of semuaFase.filter((f) => f !== sahDi)) {
      it(`${aksi.type} ditolak ERROR_AKSI di fase ${fase} (hanya sah di ${sahDi})`, () => {
        const enc = buatEncounterFase(buatPasien(), fase)
        const { enc: baru, events } = aksiKlinik(enc, aksi, KASUS_FARINGITIS, PACK, rngTest())
        expect(baru).toBe(enc) // state tak berubah sama sekali
        expect(cariEvent(events, 'ERROR_AKSI')).toBeDefined()
      })
    }
  }

  it(`${'TANYA'} tetap diterima normal persis di fase sahnya`, () => {
    const enc = buatEncounterFase(buatPasien(), 'anamnesis')
    const { events } = aksiKlinik(enc, { type: 'TANYA', pertanyaanId: 'q_onset' }, KASUS_FARINGITIS, PACK, rngTest())
    expect(cariEvent(events, 'ERROR_AKSI')).toBeUndefined()
  })
})

describe('aksiKlinik — firewall alergi', () => {
  it('memblokir obat segolongan alergi pasien: resep tidak bertambah', () => {
    const enc = buatEncounterFase(buatPasien({ alergi: ['penisilin'] }), 'terapi')
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
    const enc = buatEncounterFase(buatPasien({ alergi: ['penisilin'] }), 'terapi')
    const { enc: baru } = jalankan(enc, [
      { type: 'TAMBAH_OBAT', obatId: 'amoxicillin_500' }, // diblokir
      { type: 'TAMBAH_OBAT', obatId: 'eritromisin_500' }, // lolos
      { type: 'TAMBAH_OBAT', obatId: 'paracetamol_500' }, // lolos
    ])
    expect(baru.resep).toEqual(['eritromisin_500', 'paracetamol_500'])
    expect(baru.firewallTerpicu).toBe(1)
  })

  it('HAPUS_OBAT dan TAMBAH/HAPUS_EDUKASI bekerja biasa', () => {
    const enc = buatEncounterFase(buatPasien(), 'terapi')
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

describe('aksiKlinik + nilaiEncounter — prosedur/tindakan klinis (CODEX ronde-baru #4)', () => {
  it('TAMBAH_TINDAKAN ditolak di luar fase terapi (phase-guard)', () => {
    const enc = buatEncounterFase(buatPasien(), 'anamnesis')
    const { enc: baru, events } = aksiKlinik(
      enc,
      { type: 'TAMBAH_TINDAKAN', tindakanId: 'reposisi_mini' },
      KASUS_PROSEDUR,
      PACK,
      rngTest(),
    )
    expect(baru.tindakan).toEqual([])
    expect(cariEvent(events, 'ERROR_AKSI')).toBeDefined()
  })

  it('TAMBAH/HAPUS_TINDAKAN bekerja di fase terapi', () => {
    const enc = buatEncounterFase(buatPasien(), 'terapi')
    const { enc: baru } = jalankan(
      enc,
      [
        { type: 'TAMBAH_TINDAKAN', tindakanId: 'nebul_mini' },
        { type: 'TAMBAH_TINDAKAN', tindakanId: 'reposisi_mini' },
        { type: 'HAPUS_TINDAKAN', tindakanId: 'nebul_mini' },
      ],
      KASUS_PROSEDUR,
    )
    expect(baru.tindakan).toEqual(['reposisi_mini'])
  })

  // Terapi lengkap (obat+edukasi benar) yang HANYA berbeda pada tindakan,
  // untuk mengisolasi kontribusi prosedur ke skorTerapi.
  function terapiProsedur(tindakan: string[]): EncounterState {
    const enc = buatEncounterFase(buatPasien({ kasusId: 'vertigo_mini' }), 'terapi')
    return {
      ...enc,
      diagnosis: { icd10: KASUS_PROSEDUR.icd10, jenis: 'tegak' },
      resep: [...KASUS_PROSEDUR.tatalaksana.obatBenar],
      edukasi: KASUS_PROSEDUR.tatalaksana.edukasi.slice(0, KAPASITAS_EDUKASI),
      tindakan,
      disposisi: 'pulang',
    }
  }

  it('melakukan prosedur wajib menaikkan skorTerapi vs tidak melakukannya', () => {
    const tanpa = nilaiEncounter(terapiProsedur([]), KASUS_PROSEDUR, PACK)
    const dengan = nilaiEncounter(terapiProsedur(['reposisi_mini']), KASUS_PROSEDUR, PACK)
    expect(dengan.skorTerapi).toBeGreaterThan(tanpa.skorTerapi)
  })

  it('tindakan tak terindikasi (nebulisasi pada vertigo) menurunkan skorTerapi', () => {
    const benar = nilaiEncounter(terapiProsedur(['reposisi_mini']), KASUS_PROSEDUR, PACK)
    const salah = nilaiEncounter(terapiProsedur(['reposisi_mini', 'nebul_mini']), KASUS_PROSEDUR, PACK)
    expect(salah.skorTerapi).toBeLessThan(benar.skorTerapi)
  })
})

describe('temuanUntukRegion — gabung temuan region duplikat (CODEX ronde-12 #2)', () => {
  // Pola konten nyata (BPPV/Bell's palsy/glaukoma/hordeolum/serumen): 1 kasus
  // sengaja punya ≥2 entri pemeriksaanFisik pada region YANG SAMA (temuan
  // berlapis). `.find()` lama cuma ambil entri pertama → entri kedua permanen
  // tak terlihat (UI cuma 1 tombol/chip per region, tak ada cara memicu ulang).
  const KASUS_DUPLIKAT_REGION: KasusKlinis = {
    ...KASUS_FARINGITIS,
    id: 'duplikat_mini',
    pemeriksaanFisik: [
      { region: 'mata', temuan: 'TIO teraba keras seperti batu.', relevan: true },
      { region: 'mata', temuan: 'Visus turun drastis.', relevan: true },
      { region: 'umum', temuan: 'Tampak kesakitan.', relevan: true },
    ],
  }

  it('region dgn 1 entri: kembalikan temuan itu saja', () => {
    expect(temuanUntukRegion(KASUS_DUPLIKAT_REGION, 'umum')).toBe('Tampak kesakitan.')
  })

  it('region dgn 2 entri: GABUNG keduanya, bukan cuma entri pertama', () => {
    const hasil = temuanUntukRegion(KASUS_DUPLIKAT_REGION, 'mata')
    expect(hasil).toContain('TIO teraba keras seperti batu.')
    expect(hasil).toContain('Visus turun drastis.') // dulu hilang — CODEX ronde-12 #2
  })

  it('region tanpa entri: "dalam batas normal"', () => {
    expect(temuanUntukRegion(KASUS_DUPLIKAT_REGION, 'abdomen')).toBe('dalam batas normal')
  })

  it('PERIKSA (aksiKlinik) memakai temuan gabungan, bukan entri pertama saja', () => {
    const enc = buatEncounterFase(buatPasien(), 'pemeriksaan')
    const { events } = aksiKlinik(enc, { type: 'PERIKSA', region: 'mata' }, KASUS_DUPLIKAT_REGION, PACK, rngTest())
    const temuanEvent = cariEvent(events, 'TEMUAN_FISIK')
    expect(temuanEvent?.temuan).toContain('TIO teraba keras seperti batu.')
    expect(temuanEvent?.temuan).toContain('Visus turun drastis.')
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
      { type: 'LANJUT_FASE' }, // anamnesis → pemeriksaan
      { type: 'UKUR_VITAL' },
      { type: 'PERIKSA', region: 'tht_mulut' },
      { type: 'PERIKSA', region: 'kepala_leher' },
      { type: 'PESAN_LAB', labId: 'darah_rutin' },
      { type: 'LANJUT_FASE' }, // pemeriksaan → diagnosis
      { type: 'KOMIT_DIAGNOSIS', icd10: 'J02.9', jenis: 'tegak' }, // → terapi (otomatis)
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
      { type: 'LANJUT_FASE' }, // anamnesis → pemeriksaan, tanpa tanya apapun
      { type: 'LANJUT_FASE' }, // pemeriksaan → diagnosis, tanpa periksa apapun
      { type: 'KOMIT_DIAGNOSIS', icd10: 'J00', jenis: 'tegak' }, // salah, tanpa anamnesis
      { type: 'TAMBAH_OBAT', obatId: 'ibuprofen_400' }, // di luar tatalaksana
    ])
    const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)

    expect(nilai.diagnosisBenar).toBe(false)
    expect(nilai.skorAnamnesis).toBe(0)
    expect(nilai.skorTerapi).toBe(0)
    expect(nilai.grade).toBe('D')
  })

  it('sabar habis → jawaban ketus TIDAK dihitung sebagai informasi (CODEX: klik ≠ menggali data)', () => {
    const enc = { ...buatEncounter(buatPasien()), sabar: 0 }
    const hasil = aksiKlinik(enc, { type: 'TANYA', pertanyaanId: 'q_onset' }, KASUS_FARINGITIS, PACK, rngTest())
    // Pasien menjawab (ketus) tapi pertanyaan tak tercatat — tak ada kredit esensial/OLDCARTS.
    expect(hasil.events.some((e) => e.type === 'PASIEN_MENJAWAB')).toBe(true)
    expect(hasil.enc.ditanya).not.toContain('q_onset')
    const nilai = nilaiEncounter({ ...hasil.enc, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)
    expect(nilai.skorAnamnesis).toBe(0)
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
    const enc = buatEncounterFase(buatPasien(), 'pemeriksaan')
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
    const enc = buatEncounterFase(buatPasien({ kasusId: 'ispa_mini' }), 'diagnosis')
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
    // DeepThink #3: dulu antibiotikTanpaIndikasi cuma DICATAT (tally/Dinkes),
    // TAK PERNAH memotong skorTerapi sendiri — Amoksisilin serampangan sama
    // ringannya dgn Vitamin C berlebih. paracetamol_500 (obatBenar, 1/1 slot,
    // 100%) + eritromisin_500 (obatDiLuar −15, DAN kini antibiotikTanpaIndikasi
    // −25 — bertumpuk disengaja, pola sama obatBerbahaya) → 100−15−25 = 60.
    expect(nilai.skorTerapi).toBe(60)
  })

  it('antibiotik tanpa indikasi memotong skorTerapi −25 (bertumpuk di atas obatDiLuar, DeepThink #3)', () => {
    const KASUS_AB: KasusKlinis = { ...KASUS_VIRAL, id: 'ab_mini' }
    const pack = { ...PACK, kasus: { ...PACK.kasus, ab_mini: KASUS_AB } }
    const skor = (resep: string[]): number => {
      let e = buatEncounterFase(buatPasien({ kasusId: 'ab_mini' }), 'terapi')
      for (const obatId of resep) e = jalankan(e, [{ type: 'TAMBAH_OBAT', obatId }], KASUS_AB).enc
      return nilaiEncounter({ ...e, disposisi: 'pulang' }, KASUS_AB, pack).skorTerapi
    }
    // Obat lain di luar tatalaksana (bukan antibiotik) — cuma −15.
    expect(skor(['paracetamol_500', 'ibuprofen_400'])).toBe(85)
    // Antibiotik tanpa indikasi — −15 (obatDiLuar) DAN −25 (stewardship) = −40.
    expect(skor(['paracetamol_500', 'amoxicillin_500'])).toBe(60)
  })

  it('obatAlternatif: monoterapi benar dinilai penuh, polifarmasi sekelas tak berhadiah/berhukum', () => {
    // Kasus mini: 1 obat wajib (parasetamol) + 1 slot alternatif "pilih salah satu
    // antihistamin" (setirizin ATAU loratadin) — sengaja BUKAN antibiotik supaya
    // tak kena penalti polifarmasi antibiotik (test terpisah di bawah). Mekanik
    // murni, bukan farmakologi.
    const KASUS_ALT: KasusKlinis = {
      ...KASUS_VIRAL,
      id: 'alt_mini',
      tatalaksana: {
        obatBenar: ['paracetamol_500'],
        obatAlternatif: [['cetirizine_10', 'loratadin_10']],
        edukasi: ['istirahat_cukup'],
      },
    }
    const pack = { ...PACK, kasus: { ...PACK.kasus, alt_mini: KASUS_ALT } }
    const enc = () => buatEncounterFase(buatPasien({ kasusId: 'alt_mini' }), 'terapi')
    const skor = (resep: string[]): number => {
      let e = enc()
      for (const obatId of resep) e = jalankan(e, [{ type: 'TAMBAH_OBAT', obatId }], KASUS_ALT).enc
      return nilaiEncounter({ ...e, disposisi: 'pulang' }, KASUS_ALT, pack).skorTerapi
    }
    // Wajib + salah satu alternatif → penuh, dua rute alternatif berbeda sama-sama 100.
    expect(skor(['paracetamol_500', 'cetirizine_10'])).toBe(100)
    expect(skor(['paracetamol_500', 'loratadin_10'])).toBe(100)
    // Memberi KEDUA alternatif sekelas (bukan antibiotik): slot tetap terpenuhi
    // sekali, anggota kedua tidak dihukum sebagai obat di luar → tetap 100.
    expect(skor(['paracetamol_500', 'cetirizine_10', 'loratadin_10'])).toBe(100)
    // Lupa mengisi slot alternatif → hanya 1 dari 2 slot = 50.
    expect(skor(['paracetamol_500'])).toBe(50)
    // Obat di luar daftar tetap dihukum -15.
    expect(skor(['paracetamol_500', 'cetirizine_10', 'ibuprofen_400'])).toBe(85)
  })

  it('obatAlternatif berisi antibiotik → prescribing-nya BUKAN antibiotik tanpa indikasi', () => {
    const KASUS_ALT: KasusKlinis = {
      ...KASUS_VIRAL,
      id: 'alt_ab_mini',
      tatalaksana: { obatBenar: [], obatAlternatif: [['amoxicillin_500', 'eritromisin_500']], edukasi: [] },
    }
    const pack = { ...PACK, kasus: { ...PACK.kasus, alt_ab_mini: KASUS_ALT } }
    let e = buatEncounterFase(buatPasien({ kasusId: 'alt_ab_mini' }), 'terapi')
    e = jalankan(e, [{ type: 'TAMBAH_OBAT', obatId: 'amoxicillin_500' }], KASUS_ALT).enc
    const nilai = nilaiEncounter({ ...e, disposisi: 'pulang' }, KASUS_ALT, pack)
    expect(nilai.antibiotikTanpaIndikasi).toBe(false)
  })

  // Audit CODEX 2026-07-04: beri >1 antibiotik dari SATU grup alternatif (mis.
  // tifoid: kloramfenikol ATAU kotrimoksazol ATAU amoksisilin — cukup satu)
  // adalah polifarmasi antibiotik nyata, beda dari 2 analgesik/antihistamin
  // sekelas yang cuma redundan-aman. Slot tetap terpenuhi (bukan obat di luar),
  // tapi kena penalti stewardship terpisah.
  it('obatAlternatif ≥2 antibiotik sekaligus dari 1 grup → penalti polifarmasi antibiotik', () => {
    const KASUS_ALT: KasusKlinis = {
      ...KASUS_VIRAL,
      id: 'alt_ab_ganda_mini',
      tatalaksana: {
        obatBenar: ['paracetamol_500'],
        obatAlternatif: [['amoxicillin_500', 'eritromisin_500']],
        edukasi: ['istirahat_cukup'],
      },
    }
    const pack = { ...PACK, kasus: { ...PACK.kasus, alt_ab_ganda_mini: KASUS_ALT } }
    const skor = (resep: string[]): number => {
      let e = buatEncounterFase(buatPasien({ kasusId: 'alt_ab_ganda_mini' }), 'terapi')
      for (const obatId of resep) e = jalankan(e, [{ type: 'TAMBAH_OBAT', obatId }], KASUS_ALT).enc
      return nilaiEncounter({ ...e, disposisi: 'pulang' }, KASUS_ALT, pack).skorTerapi
    }
    // Satu antibiotik + parasetamol → slot penuh, tanpa penalti.
    expect(skor(['paracetamol_500', 'amoxicillin_500'])).toBe(100)
    // Dua antibiotik dari grup yang sama → penalti 20, walau slot tetap terpenuhi.
    expect(skor(['paracetamol_500', 'amoxicillin_500', 'eritromisin_500'])).toBe(80)
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
    const enc = buatEncounterFase(buatPasien(), 'pemeriksaan')
    const { enc: main } = jalankan(enc, [
      { type: 'PESAN_LAB', labId: 'darah_rutin' }, // relevan
      { type: 'PESAN_LAB', labId: 'bta_sputum' }, // relevan: false
      { type: 'PESAN_LAB', labId: 'gds' }, // tidak ada di kasus
    ])
    const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)
    expect(nilai.labTakRelevan).toBe(2)
  })

  it('DeepThink #1: observasi + lab hasilBesok TAK RELEVAN tidak mendapat proteksi skor 70 gratis', () => {
    // bta_sputum: hasilBesok:true TAPI relevan:false pada faringitis (fixture
    // KASUS_FARINGITIS) — sebelum fix, memesan lab APA SAJA ber-hasilBesok lalu
    // Observasi = skor 70 gratis tanpa terapi benar sama sekali.
    const enc: EncounterState = {
      ...buatEncounter(buatPasien()),
      labDipesan: ['bta_sputum'],
      disposisi: 'observasi',
    }
    const nilai = nilaiEncounter(enc, KASUS_FARINGITIS, PACK)
    // Tanpa obat sama sekali: rasioTerapi 0/2 slot = 0 → skorTerapi 0, TIDAK
    // di-floor ke 70 krn lab yg dipesan tak relevan dgn kasus ini.
    expect(nilai.skorTerapi).toBe(0)
  })

  it('DeepThink #1: observasi + lab hasilBesok RELEVAN tetap dapat proteksi skor 70 (perilaku sah dipertahankan)', () => {
    const KASUS_OBS: KasusKlinis = {
      ...KASUS_FARINGITIS,
      id: 'obs_mini',
      lab: [{ id: 'bta_sputum', hasil: 'Menunggu hasil', flag: 'normal', relevan: true }],
    }
    const enc: EncounterState = {
      ...buatEncounter(buatPasien({ kasusId: 'obs_mini' })),
      labDipesan: ['bta_sputum'],
      disposisi: 'observasi',
    }
    const nilai = nilaiEncounter(enc, KASUS_OBS, PACK)
    expect(nilai.skorTerapi).toBe(70)
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

  it('SBAR copy-paste (keempat kolom identik) dihukum −50 (DeepThink #4)', () => {
    const teksSama = 'Pasien demam 3 hari 1234567890 kondisi umum stabil terpantau'
    const enc: EncounterState = {
      ...buatEncounter(buatPasien({ kasusId: 'pneumonia_mini', usia: 3 })),
      diagnosis: { icd10: 'J18.9', jenis: 'suspek' },
      disposisi: 'rujuk',
      sbar: {
        situation: teksSama,
        background: teksSama,
        assessment: teksSama,
        recommendation: teksSama,
      },
    }
    const nilai = nilaiEncounter(enc, KASUS_RUJUK, PACK)
    // Tanpa anti-copas: 4×20 (semua ≥20 char) = 80 — situation punya angka jadi
    // LOLOS penalti −20 "tanpa data", tak menyebut diagnosis jadi tak dapat +20.
    // Dgn fix anti-copas: 80 − 50 = 30.
    expect(nilai.sbarSkor).toBe(30)
  })

  it('SBAR beda kata sedikit (bukan copy-paste identik) TIDAK kena hukuman copas', () => {
    const enc: EncounterState = {
      ...buatEncounter(buatPasien({ kasusId: 'pneumonia_mini', usia: 3 })),
      diagnosis: { icd10: 'J18.9', jenis: 'suspek' },
      disposisi: 'rujuk',
      sbar: {
        situation: 'Anak laki-laki 3 tahun sesak napas sejak tadi malam.',
        background: 'Demam 2 hari, batuk berdahak, belum pernah sesak.',
        assessment: 'Suspek pneumonia berat (J18.9), RR meningkat.',
        recommendation: 'Mohon penanganan lanjutan rawat inap segera.',
      },
    }
    const nilai = nilaiEncounter(enc, KASUS_RUJUK, PACK)
    expect(nilai.sbarSkor).toBe(100)
  })

  it('dua kolom SBAR sama-sama KOSONG bukan copy-paste — tak dihukum ganda (sudah nol dari panjang)', () => {
    const enc: EncounterState = {
      ...buatEncounter(buatPasien({ kasusId: 'pneumonia_mini', usia: 3 })),
      diagnosis: { icd10: 'J18.9', jenis: 'suspek' },
      disposisi: 'rujuk',
      sbar: {
        // Sengaja TIDAK menyebut nama kasus/ICD-10 di sini — isolasi murni
        // concern panjang+kosong, tanpa bonus diagnosis mengaburkan aritmetika.
        situation: 'Anak laki-laki 3 tahun sesak napas RR 52, retraksi (+).',
        background: '',
        assessment: 'Kondisi memburuk perlu penanganan lanjutan segera.',
        recommendation: '',
      },
    }
    const nilai = nilaiEncounter(enc, KASUS_RUJUK, PACK)
    // situation (≥20, ada angka → lolos penalti) +20; assessment (≥20, tak
    // sebut diagnosis) +20; background/recommendation kosong = +0. Total 40.
    // BUKAN 40−50 — dua kolom kosong "sama" tak boleh dianggap copas.
    expect(nilai.sbarSkor).toBe(40)
  })
})

/* ---------------------------------------------------------------------------
 * M7 (34b/O4) — edukasi: kuota baki + skor prioritisasi
 * ------------------------------------------------------------------------- */

describe('M7 — kuota & prioritisasi edukasi', () => {
  // Kasus komorbid tiruan: 4 topik wajib (> kapasitas 3).
  const KASUS_KOMORBID: KasusKlinis = {
    ...KASUS_FARINGITIS,
    tatalaksana: {
      ...KASUS_FARINGITIS.tatalaksana,
      edukasi: ['etika_batuk', 'istirahat_cukup', 'cuci_tangan', 'tanda_bahaya'],
    },
  }

  it('TAMBAH_EDUKASI ke-4 DITOLAK engine (kuota, bukan cuma UI)', () => {
    const enc = buatEncounterFase(buatPasien(), 'terapi')
    const { enc: baru, events } = jalankan(
      enc,
      [
        { type: 'TAMBAH_EDUKASI', edukasiId: 'etika_batuk' },
        { type: 'TAMBAH_EDUKASI', edukasiId: 'istirahat_cukup' },
        { type: 'TAMBAH_EDUKASI', edukasiId: 'cuci_tangan' },
        { type: 'TAMBAH_EDUKASI', edukasiId: 'tanda_bahaya' }, // slot ke-4
      ],
      KASUS_KOMORBID,
    )
    expect(baru.edukasi).toHaveLength(KAPASITAS_EDUKASI)
    expect(baru.edukasi).not.toContain('tanda_bahaya')
    expect(events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
    // Coret satu → slot terbuka lagi (mengganti prioritas tetap bisa).
    const { enc: ganti } = jalankan(
      baru,
      [
        { type: 'HAPUS_EDUKASI', edukasiId: 'cuci_tangan' },
        { type: 'TAMBAH_EDUKASI', edukasiId: 'tanda_bahaya' },
      ],
      KASUS_KOMORBID,
    )
    expect(ganti.edukasi).toEqual(['etika_batuk', 'istirahat_cukup', 'tanda_bahaya'])
  })

  it('kasus komorbid (wajib 4 > kapasitas 3): 3 benar = skor 100 — bukan 75', () => {
    const enc = buatEncounterFase(buatPasien(), 'diagnosis')
    const { enc: main } = jalankan(
      enc,
      [
        { type: 'KOMIT_DIAGNOSIS', icd10: 'J02.9', jenis: 'tegak' },
        { type: 'TAMBAH_EDUKASI', edukasiId: 'etika_batuk' },
        { type: 'TAMBAH_EDUKASI', edukasiId: 'istirahat_cukup' },
        { type: 'TAMBAH_EDUKASI', edukasiId: 'tanda_bahaya' },
      ],
      KASUS_KOMORBID,
    )
    const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_KOMORBID, PACK)
    expect(nilai.skorEdukasi).toBe(100)
  })

  it('tembakan meleset dihukum 15/topik (slot kini berharga)', () => {
    // Wajib 2 (etika_batuk, istirahat_cukup): 2 benar + 1 salah → 100 − 15 = 85.
    const enc = buatEncounterFase(buatPasien(), 'diagnosis')
    const { enc: main } = jalankan(enc, [
      { type: 'KOMIT_DIAGNOSIS', icd10: 'J02.9', jenis: 'tegak' },
      { type: 'TAMBAH_EDUKASI', edukasiId: 'etika_batuk' },
      { type: 'TAMBAH_EDUKASI', edukasiId: 'istirahat_cukup' },
      { type: 'TAMBAH_EDUKASI', edukasiId: 'tanda_bahaya' }, // tak relevan utk faringitis
    ])
    const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)
    expect(nilai.skorEdukasi).toBe(85)
  })

  it('strategi "4 sakti" mati: 3 generik salah semua = 0 (dulu bisa ~90)', () => {
    // Kasus wajib {etika_batuk, istirahat_cukup}; pemain menembak 3 topik lain.
    const enc = buatEncounterFase(buatPasien(), 'diagnosis')
    const { enc: main } = jalankan(enc, [
      { type: 'KOMIT_DIAGNOSIS', icd10: 'J02.9', jenis: 'tegak' },
      { type: 'TAMBAH_EDUKASI', edukasiId: 'cuci_tangan' },
      { type: 'TAMBAH_EDUKASI', edukasiId: 'tanda_bahaya' },
    ])
    const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_FARINGITIS, PACK)
    // 0 tercakup dari target 2, minus 2×15 → clamp 0.
    expect(nilai.skorEdukasi).toBe(0)
  })

  // DeepThink triangulasi (2026-07-05, docs/DEEPTHINK_EDUKASI_KRITIS.md): kasus
  // wajib>3 dulu bisa skor 100 melewatkan topik PALING kritis (dengue tanda
  // bahaya, TB kepatuhan OAT, dst.) — `edukasiKritis` menutup celah ini dgn
  // cap ceiling, meniru pola `vitalDiukur→skorPemeriksaan` yg sudah ada.
  describe('edukasiKritis — cap ceiling saat topik non-negotiable dilewatkan', () => {
    const KASUS_KRITIS: KasusKlinis = {
      ...KASUS_FARINGITIS,
      tatalaksana: {
        ...KASUS_FARINGITIS.tatalaksana,
        edukasi: ['etika_batuk', 'istirahat_cukup', 'cuci_tangan', 'tanda_bahaya'],
        edukasiKritis: ['tanda_bahaya'],
      },
    }

    it('3 topik benar TAPI melewatkan topik kritis → skor di-cap 50 (bukan 100)', () => {
      const enc = buatEncounterFase(buatPasien(), 'diagnosis')
      const { enc: main } = jalankan(
        enc,
        [
          { type: 'KOMIT_DIAGNOSIS', icd10: 'J02.9', jenis: 'tegak' },
          { type: 'TAMBAH_EDUKASI', edukasiId: 'etika_batuk' },
          { type: 'TAMBAH_EDUKASI', edukasiId: 'istirahat_cukup' },
          { type: 'TAMBAH_EDUKASI', edukasiId: 'cuci_tangan' },
        ],
        KASUS_KRITIS,
      )
      const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_KRITIS, PACK)
      expect(nilai.skorEdukasi).toBe(50)
    })

    it('topik kritis dipilih (+2 lain) → skor tetap 100, tak di-cap', () => {
      const enc = buatEncounterFase(buatPasien(), 'diagnosis')
      const { enc: main } = jalankan(
        enc,
        [
          { type: 'KOMIT_DIAGNOSIS', icd10: 'J02.9', jenis: 'tegak' },
          { type: 'TAMBAH_EDUKASI', edukasiId: 'tanda_bahaya' },
          { type: 'TAMBAH_EDUKASI', edukasiId: 'etika_batuk' },
          { type: 'TAMBAH_EDUKASI', edukasiId: 'istirahat_cukup' },
        ],
        KASUS_KRITIS,
      )
      const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_KRITIS, PACK)
      expect(nilai.skorEdukasi).toBe(100)
    })

    it('kasus TANPA edukasiKritis (KASUS_KOMORBID) tak terpengaruh — perilaku lama utuh', () => {
      const enc = buatEncounterFase(buatPasien(), 'diagnosis')
      const { enc: main } = jalankan(
        enc,
        [
          { type: 'KOMIT_DIAGNOSIS', icd10: 'J02.9', jenis: 'tegak' },
          { type: 'TAMBAH_EDUKASI', edukasiId: 'etika_batuk' },
          { type: 'TAMBAH_EDUKASI', edukasiId: 'istirahat_cukup' },
          { type: 'TAMBAH_EDUKASI', edukasiId: 'cuci_tangan' },
        ],
        KASUS_KOMORBID,
      )
      const nilai = nilaiEncounter({ ...main, disposisi: 'pulang' }, KASUS_KOMORBID, PACK)
      expect(nilai.skorEdukasi).toBe(100)
    })
  })
})
