/**
 * TEST DIRECTOR + SCORING + SAVE — profil adversarial ala repo lama.
 * Fixture kasus mini inline (tidak menyentuh content pack sungguhan) agar test
 * headless, deterministik, dan tidak rapuh terhadap perubahan konten.
 */

import { describe, it, expect } from 'vitest'
import {
  buatPasienDariKasus,
  susunAntrianHarian,
  hitungSkor,
  ringkasanHarian,
} from './director'
import { serialize, deserialize } from './save'
import { Rng } from './core/rng'
import type { ContentPack } from '@content/pack'
import type { IndikatorPisPk, KasusKlinis } from '@content/types'
import type {
  GameState,
  KeluargaState,
  NilaiIndikator,
  PenilaianEncounter,
  RwState,
  SkorTally,
} from './state'

/* ---------------------------------------------------------------------------
 * Fixture mini
 * ------------------------------------------------------------------------- */

function buatKasus(id: string, opsi?: Partial<KasusKlinis>): KasusKlinis {
  return {
    id,
    nama: `Kasus ${id}`,
    icd10: 'J00',
    skdi: '4A',
    kategori: 'saraf', // netral terhadap boost musim (hujan/kemarau)
    fktp144: true,
    harusDirujuk: false,
    keluhanUtama: 'Badan tidak enak, Dok.',
    demografi: { usiaMin: 20, usiaMax: 40 },
    vital: { td: '120/80', nadi: 80, rr: 18, suhu: 36.8 },
    anamnesis: [],
    pemeriksaanFisik: [],
    lab: [],
    diagnosisBanding: ['J00', 'J06.9'],
    tatalaksana: { obatBenar: [], edukasi: [] },
    clue: `Clue uji untuk ${id}.`,
    ...opsi,
  }
}

function buatPack(daftarKasus: KasusKlinis[]): ContentPack {
  const kasus: Record<string, KasusKlinis> = {}
  for (const k of daftarKasus) kasus[k.id] = k
  return {
    kasus,
    kasusIgd: {},
    keluarga: {},
    kader: [],
    rw: [],
    rumahSakit: [],
    obat: {},
    lab: {},
    edukasi: {},
    tindakan: {},
    skdi144: [],
    namaWarga: {
      pria: ['Budi', 'Wayan', 'Ahmad', 'Togar'],
      wanita: ['Siti', 'Made', 'Ratna', 'Yohana'],
      keluarga: ['Santoso', 'Wijaya'],
    },
  }
}

function buatTally(override?: Partial<SkorTally>): SkorTally {
  return {
    totalPasien: 0,
    diagnosisBenar: 0,
    sumSkorProses: 0,
    tegakBenar: 0,
    tegakSalah: 0,
    suspekBenar: 0,
    suspekSalah: 0,
    rujukanTotal: 0,
    rujukanNonSpesialistik: 0,
    rujukanTepat: 0, rujukanDitolak: 0,
    cowboy: 0,
    antibiotikTanpaIndikasi: 0,
    obatBerbahaya: 0,
    firewallTerpicu: 0,
    stabilisasiTerlewat: 0,
    labTakRelevan: 0,
    miTepat: 0,
    miTotal: 0,
    kunjunganBerhasil: 0,
    kunjunganTotal: 0,
    kunjunganDiusir: 0,
    apathy: 0,
    autoBermasalah: 0,
    posyanduSesi: 0, prolanisSesi: 0, klbTuntas: 0, igdStabil: 0, igdSalahDisposisi: 0, igdMeninggal: 0, igdKodeBiruTerjadi: 0, rmLengkap: 0, teguranDinkes: 0,
    hariKelelahan: 0,
    karmaTerjadi: 0,
    karmaDicegah: 0,
    ...override,
  }
}

function buatRw(nomor: number, iks: number): RwState {
  return {
    nomor,
    nama: `RW ${nomor}`,
    jarak: 'dekat',
    totalKk: 25,
    kkTersurvei: iks > 0 ? 10 : 0,
    iks,
    bonusIks: 0,
  }
}

const SEMUA_INDIKATOR: IndikatorPisPk[] = [
  'kb',
  'persalinan_faskes',
  'imunisasi_dasar',
  'asi_eksklusif',
  'pantau_tumbuh_kembang',
  'tb_berobat_standar',
  'hipertensi_berobat',
  'jiwa_tidak_ditelantarkan',
  'tidak_merokok',
  'jkn',
  'air_bersih',
  'jamban_sehat',
]

function buatKeluargaState(id: string): KeluargaState {
  const indikator = {} as Record<IndikatorPisPk, NilaiIndikator>
  for (const ind of SEMUA_INDIKATOR) {
    indikator[ind] = { status: 'ya', statusSebenarnya: 'ya', sumber: 'belum', hariData: 0 }
  }
  return { id, trust: 3, ttm: 'prekontemplasi', indikator, arcIndex: 0, jumlahKunjungan: 0 }
}

function buatState(override?: Partial<GameState>): GameState {
  return {
    versi: 1,
    contentRelease: 'legacy-baseline',
    seed: 42,
    mode: 'karier' as const,
    seedKurikulum: 42,
    namaDokter: 'dr. Uji',
    hari: 1,
    blok: 'pagi',
    stamina: 6,
    burnout: 0,
    klinik: { antrian: [], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } },
    desa: { keluarga: {}, kader: {}, rw: [], binaan: [], surveilans: [], drift: { minggu: 1, jumlah: 0 } },
    inbox: [],
    jadwal: [],
    tally: buatTally(),
    dex: {},
    log: [],
    jejak: [],
    kapitasi: 15_000_000,
    gudang: { stok: {}, pesanan: [] },
    keuanganBulan: { belanjaObat: 0, belanjaPengadaan: 0 },
    refleksi: {},
    flags: {},
    layar: 'meja',
    lapanganTerpakai: false,
    igdHariIni: false,
    prolanis: { roster: [] },
    posyanduRwTerakhir: {},
    program: {},
    tutorialAktif: false,
    ...override,
  }
}

function buatPenilaian(override?: Partial<PenilaianEncounter>): PenilaianEncounter {
  return {
    kasusId: 'k_uji',
    pasienNama: 'Pak Uji',
    diagnosisBenar: true,
    jenisDiagnosis: 'tegak',
    skorAnamnesis: 80,
    skorPemeriksaan: 80,
    skorTerapi: 80,
    skorEdukasi: 80,
    disposisiTepat: true,
    rujukanNonSpesialistik: false,
    cowboy: false,
    antibiotikTanpaIndikasi: false,
    obatBerbahaya: false,
    firewallTerpicu: false,
    konfirmasiTakTerpenuhi: false,
    stabilisasiTerlewat: false,
    labTakRelevan: 0,
    grade: 'A',
    clue: 'Clue uji EBM.',
    konsekuensiDijadwalkan: false,
    edukasiKritisTerlewat: [],
    ...override,
  }
}

/* ---------------------------------------------------------------------------
 * Director — susunAntrianHarian
 * ------------------------------------------------------------------------- */

describe('susunAntrianHarian', () => {
  const packEnam = buatPack([
    buatKasus('k1'),
    buatKasus('k2'),
    buatKasus('k3'),
    buatKasus('k4'),
    buatKasus('k5'),
    buatKasus('k6'),
  ])

  it('hari 1-2 menyusun 2 pasien, hari 3+ menyusun 3', () => {
    expect(susunAntrianHarian(buatState({ hari: 1 }), packEnam, new Rng(1, 'd', 1))).toHaveLength(2)
    expect(susunAntrianHarian(buatState({ hari: 2 }), packEnam, new Rng(1, 'd', 2))).toHaveLength(2)
    expect(susunAntrianHarian(buatState({ hari: 3 }), packEnam, new Rng(1, 'd', 3))).toHaveLength(3)
    expect(susunAntrianHarian(buatState({ hari: 30 }), packEnam, new Rng(1, 'd', 30))).toHaveLength(3)
  })

  it('tidak pernah menduplikasi kasus dalam satu hari', () => {
    for (let seed = 0; seed < 100; seed++) {
      const antrian = susunAntrianHarian(buatState({ hari: 5 }), packEnam, new Rng(seed, 'd'))
      const unik = new Set(antrian.map((p) => p.kasusId))
      expect(unik.size).toBe(antrian.length)
    }
  })

  it('minggu pertama sangat bias (92%) ke kasus 4A yang tidak dirujuk', () => {
    const pack = buatPack([
      buatKasus('aman_1'),
      buatKasus('aman_2'),
      buatKasus('aman_3'),
      buatKasus('bahaya_1', { skdi: '3B', harusDirujuk: true }),
      buatKasus('bahaya_2', { skdi: '3B', harusDirujuk: true }),
    ])
    let totalPick = 0
    let pickBahaya = 0
    for (let seed = 0; seed < 200; seed++) {
      const antrian = susunAntrianHarian(buatState({ hari: 5 }), pack, new Rng(seed, 'bias'))
      totalPick += antrian.length
      pickBahaya += antrian.filter((p) => p.kasusId.startsWith('bahaya')).length
    }
    // Tanpa bias, porsi bahaya ≈ 40% (2 dari 5 kasus). Dengan bias 92% → hanya
    // sisa 8% pilihan yang boleh menyentuh pool penuh.
    expect(pickBahaya / totalPick).toBeLessThan(0.15)
  })

  it('Leitner: kasus lemah (★0) jauh lebih sering muncul daripada yang dikuasai (★3)', () => {
    const pack = buatPack([
      buatKasus('lemah'),
      buatKasus('kuat_1'),
      buatKasus('kuat_2'),
      buatKasus('kuat_3'),
      buatKasus('kuat_4'),
    ])
    const dex = {
      lemah: { kasusId: 'lemah', ditangani: 2, benar: 0, bintang: 0, terakhirHari: 9 },
      kuat_1: { kasusId: 'kuat_1', ditangani: 3, benar: 3, bintang: 3, terakhirHari: 9 },
      kuat_2: { kasusId: 'kuat_2', ditangani: 3, benar: 3, bintang: 3, terakhirHari: 9 },
      kuat_3: { kasusId: 'kuat_3', ditangani: 3, benar: 3, bintang: 3, terakhirHari: 9 },
      kuat_4: { kasusId: 'kuat_4', ditangani: 3, benar: 3, bintang: 3, terakhirHari: 9 },
    }
    const hitung: Record<string, number> = {}
    for (let seed = 0; seed < 300; seed++) {
      const antrian = susunAntrianHarian(buatState({ hari: 10, dex }), pack, new Rng(seed, 'leitner'))
      for (const p of antrian) hitung[p.kasusId] = (hitung[p.kasusId] ?? 0) + 1
    }
    const munculLemah = hitung['lemah'] ?? 0
    for (const id of ['kuat_1', 'kuat_2', 'kuat_3', 'kuat_4']) {
      expect(munculLemah).toBeGreaterThan(hitung[id] ?? 0)
    }
  })

  it('menjamin minimal satu kasus belum-pernah bila masih tersedia', () => {
    const pack = buatPack([buatKasus('lama_1'), buatKasus('lama_2'), buatKasus('lama_3'), buatKasus('baru')])
    const dex = {
      lama_1: { kasusId: 'lama_1', ditangani: 5, benar: 5, bintang: 3, terakhirHari: 9 },
      lama_2: { kasusId: 'lama_2', ditangani: 5, benar: 5, bintang: 3, terakhirHari: 9 },
      lama_3: { kasusId: 'lama_3', ditangani: 5, benar: 5, bintang: 3, terakhirHari: 9 },
    }
    for (let seed = 0; seed < 100; seed++) {
      const antrian = susunAntrianHarian(buatState({ hari: 10, dex }), pack, new Rng(seed, 'jaminan'))
      expect(antrian.some((p) => p.kasusId === 'baru')).toBe(true)
    }
  })

  it('Curriculum Director (M3.18): slot jaminan memprioritaskan 4A wajib meski prevalensinya rendah', () => {
    // 'langka4a' belum pernah & 4A tapi prevalensi RENDAH (bobotKasus x0.6);
    // 'seringNon4a' belum pernah & non-4A tapi prevalensi TINGGI (x3) — bila
    // slot jaminan masih tertimbang prevalensi, langka4a nyaris tak pernah menang.
    const pack = buatPack([
      buatKasus('lama_1'),
      buatKasus('lama_2'),
      buatKasus('lama_3'),
      buatKasus('langka4a', { prevalensi: 'rendah' }),
      buatKasus('seringNon4a', { skdi: '3A', harusDirujuk: true, prevalensi: 'tinggi' }),
    ])
    const dex = {
      lama_1: { kasusId: 'lama_1', ditangani: 5, benar: 5, bintang: 3, terakhirHari: 9 },
      lama_2: { kasusId: 'lama_2', ditangani: 5, benar: 5, bintang: 3, terakhirHari: 9 },
      lama_3: { kasusId: 'lama_3', ditangani: 5, benar: 5, bintang: 3, terakhirHari: 9 },
    }
    let munculLangka = 0
    for (let seed = 0; seed < 200; seed++) {
      const antrian = susunAntrianHarian(buatState({ hari: 10, dex }), pack, new Rng(seed, 'pity'))
      if (antrian.some((p) => p.kasusId === 'langka4a')) munculLangka += 1
    }
    // Slot jaminan HARUS selalu jatuh ke langka4a (satu-satunya 4A belum-pernah) —
    // bukan sesekali kalah oleh seringNon4a lewat rng.weighted.
    expect(munculLangka).toBe(200)
  })

  // CODEX audit pasca-GM (2026-07-13, temuan #10a): kluster (`clusterAktif`,
  // surveilans.ts) dihitung dari `state.desa.surveilans`, yang RW pasiennya
  // diisi dari stream FLAVOR (pribadi per-mahasiswa) — bukan kurikulum. Di mode
  // Ujian ini melanggar M45_MODE_UJIAN.md §3b ("bobot kasus identik per paket"):
  // dua mahasiswa paket SAMA dgn keputusan klinis identik bisa dpt antrian
  // kasus BERBEDA murni krn RW pasien-pasien sebelumnya (flavor) kebetulan
  // mengelompok beda. Fix: bobot kluster (`bobotKasus`, ×2.5) digerbang OFF
  // khusus mode Ujian — Karier tak punya kontrak ini, kluster tetap aktif di sana.
  it('CODEX #10a (pasca-GM 2026-07-13): kluster surveilans (RW dari seed flavor) TIDAK mempengaruhi antrian di mode Ujian, TAPI tetap aktif di Karier', () => {
    const pack = buatPack([
      buatKasus('dengue_df', { kategori: 'infeksi' }),
      buatKasus('lain_1'),
      buatKasus('lain_2'),
      buatKasus('lain_3'),
    ])
    const surveilansKluster = [
      { hari: 10, rw: 3, kasusId: 'dengue_df' },
      { hari: 11, rw: 3, kasusId: 'dengue_df' }, // RW SAMA → kluster aktif (ambang dengue_df=2)
    ]
    const surveilansSebar = [
      { hari: 10, rw: 3, kasusId: 'dengue_df' },
      { hari: 11, rw: 5, kasusId: 'dengue_df' }, // RW BEDA → tak berkluster
    ]
    const buatDesa = (surveilans: typeof surveilansKluster) => ({
      keluarga: {}, kader: {}, rw: [], binaan: [], surveilans, drift: { minggu: 1, jumlah: 0 },
    })

    for (const mode of ['ujian', 'karier'] as const) {
      let identikSemuaSeed = true
      for (let seed = 0; seed < 50; seed++) {
        const antrianKluster = susunAntrianHarian(
          buatState({ mode, hari: 20, desa: buatDesa(surveilansKluster) }),
          pack, new Rng(seed, 'd', 20), [], new Rng(seed, 'flavor', 20),
        )
        const antrianSebar = susunAntrianHarian(
          buatState({ mode, hari: 20, desa: buatDesa(surveilansSebar) }),
          pack, new Rng(seed, 'd', 20), [], new Rng(seed, 'flavor', 20),
        )
        if (antrianKluster.map((p) => p.kasusId).join(',') !== antrianSebar.map((p) => p.kasusId).join(',')) {
          identikSemuaSeed = false
          break
        }
      }
      if (mode === 'ujian') {
        // Fix: status kluster (murni turunan RW ber-seed-flavor) tak lagi boleh
        // mengubah antrian kurikulum di mode Ujian, lintas seed mana pun.
        expect(identikSemuaSeed).toBe(true)
      } else {
        // Karier tak punya kontrak "paket identik" — kluster memang SENGAJA
        // tetap menaikkan bobot kasusnya (perilaku lama dipertahankan).
        expect(identikSemuaSeed).toBe(false)
      }
    }
  })

  it('Fix #4 (audit CODEX 2026-07-11): karma-bridge TIDAK menimpa identitas pasien bumil (demografi.jenisKelamin=P) jadi anggota keluarga laki-laki meski usianya cocok rentang', () => {
    const pack = buatPack([
      buatKasus('bumil_test', { demografi: { usiaMin: 20, usiaMax: 35, jenisKelamin: 'P' } }),
    ])
    pack.keluarga['keluarga_uji'] = {
      id: 'keluarga_uji',
      namaKeluarga: 'Uji',
      rw: 3,
      jarakMenit: 10,
      ekonomi: 'cukup',
      // Satu-satunya anggota yg usianya cocok rentang kasus (20-35) berjenis
      // kelamin LAKI-LAKI — sebelum fix #4, anggotaCocok cuma cek usia, jadi
      // pasien bumil bisa ketimpa jadi 'Ketut' (L, 24).
      anggota: [{ nama: 'Ketut', usia: 24, jenisKelamin: 'L', peran: 'kepala' }],
      indikatorAwal: {},
      arc: { sinopsis: '', kunjungan: [], epilogBerhasil: '', epilogGagal: '' },
    }
    const state = buatState({
      desa: {
        keluarga: {
          keluarga_uji: { ...buatKeluargaState('keluarga_uji'), jumlahKunjungan: 3, trust: 8 },
        },
        kader: {},
        rw: [],
        binaan: ['keluarga_uji'],
        surveilans: [],
        drift: { minggu: 1, jumlah: 0 },
      },
    })
    let bridgeTerpicu = 0
    for (let seed = 0; seed < 200; seed++) {
      const antrian = susunAntrianHarian(state, pack, new Rng(seed, 'd'), [], new Rng(seed, 'flavor'))
      const bumil = antrian.find((p) => p.kasusId === 'bumil_test')
      if (bumil?.keluargaId !== 'keluarga_uji') continue
      bridgeTerpicu += 1
      // Karma-bridge terpicu tapi anggotaCocok (L) tak boleh menimpa identitas
      // pasien bumil (P) — harus fallback ke roll acak lama, bukan jadi Ketut.
      expect(bumil.jenisKelamin).toBe('P')
      expect(bumil.nama).not.toBe('Ketut')
    }
    // Pastikan skenario ini benar-benar teruji (bridge memang terpicu di ≥1 seed).
    expect(bridgeTerpicu).toBeGreaterThan(0)
  })
})

/* ---------------------------------------------------------------------------
 * Director — buatPasienDariKasus
 * ------------------------------------------------------------------------- */

describe('buatPasienDariKasus', () => {
  it('usia dalam rentang demografi & id ber-pola', () => {
    const pack = buatPack([buatKasus('flu', { demografi: { usiaMin: 25, usiaMax: 35 } })])
    for (let seed = 0; seed < 50; seed++) {
      const p = buatPasienDariKasus('flu', pack, new Rng(seed, 'p'))
      expect(p.usia).toBeGreaterThanOrEqual(25)
      expect(p.usia).toBeLessThanOrEqual(35)
      expect(p.id).toMatch(/^p_flu_\d{4}$/)
      expect(p.kasusId).toBe('flu')
    }
  })

  it('persona dipaksa: usia ≥60 lansia, usia <15 wali_anak', () => {
    const pack = buatPack([
      buatKasus('ht', { demografi: { usiaMin: 60, usiaMax: 80 } }),
      buatKasus('diare_anak', { demografi: { usiaMin: 1, usiaMax: 9 } }),
    ])
    for (let seed = 0; seed < 30; seed++) {
      expect(buatPasienDariKasus('ht', pack, new Rng(seed, 'a')).persona).toBe('lansia')
      expect(buatPasienDariKasus('diare_anak', pack, new Rng(seed, 'b')).persona).toBe('wali_anak')
    }
  })

  it('alergiTrap: pasien SELALU membawa alergi golongan tersebut (dialog anamnesisnya menceritakan riwayat itu)', () => {
    const pack = buatPack([
      buatKasus('faringitis', {
        alergiTrap: {
          kelas: 'penisilin',
          obatTerlarang: ['amoxicillin_500'],
          alternatifBenar: ['eritromisin_500'],
        },
      }),
    ])
    for (let seed = 0; seed < 50; seed++) {
      const p = buatPasienDariKasus('faringitis', pack, new Rng(seed, 'alergi'))
      expect(p.alergi).toEqual(['penisilin'])
    }
    // Kasus TANPA alergiTrap tidak pernah membawa alergi.
    const packPolos = buatPack([buatKasus('polos')])
    for (let seed = 0; seed < 20; seed++) {
      const p = buatPasienDariKasus('polos', packPolos, new Rng(seed, 'alergi'))
      expect(p.alergi).toHaveLength(0)
    }
  })

  it('override diterapkan (pasien follow-up/karma)', () => {
    const pack = buatPack([buatKasus('stroke')])
    const p = buatPasienDariKasus('stroke', pack, new Rng(7, 'o'), {
      followUpDari: 'Bu Wulan memburuk',
      keluargaId: 'keluarga_wulan',
      bonusTrust: true,
    })
    expect(p.followUpDari).toBe('Bu Wulan memburuk')
    expect(p.keluargaId).toBe('keluarga_wulan')
    expect(p.bonusTrust).toBe(true)
  })

  it('kasus tak dikenal → error eksplisit (fail-fast)', () => {
    const pack = buatPack([buatKasus('ada')])
    expect(() => buatPasienDariKasus('tidak_ada', pack, new Rng(1))).toThrow(/tidak_ada/)
  })
})

/* ---------------------------------------------------------------------------
 * Scoring — profil adversarial
 * ------------------------------------------------------------------------- */

describe('hitungSkor — profil adversarial', () => {
  it('over-refer: RRNS 30% menjatuhkan guillotine ke 0 → UKP ≈ 0 walau akurasi 100%', () => {
    const state = buatState({
      tally: buatTally({
        totalPasien: 20,
        diagnosisBenar: 20,
        sumSkorProses: 2_000,
        tegakBenar: 20,
        rujukanTotal: 10,
        rujukanNonSpesialistik: 3, // 30%
      }),
    })
    const skor = hitungSkor(state)
    expect(skor.rincian.rrns).toBeCloseTo(30)
    expect(skor.rincian.guillotine).toBe(0)
    expect(skor.ukp).toBe(0)
  })

  it('rujukan rasional (RRNS ≤5%) tidak dihukum: guillotine 1, UKP penuh', () => {
    const state = buatState({
      tally: buatTally({
        totalPasien: 20,
        diagnosisBenar: 20,
        sumSkorProses: 2_000,
        tegakBenar: 20,
        rujukanTotal: 10,
        rujukanNonSpesialistik: 0,
      }),
    })
    const skor = hitungSkor(state)
    expect(skor.rincian.guillotine).toBe(1)
    expect(skor.ukp).toBeCloseTo(35)
  })

  it('apathy 10× menggerus UKM (−2 per kejadian)', () => {
    const tallyDasar = {
      // ≥ EKSPEKTASI_KUNJUNGAN_KARIER (24) — di ambang/atas ekspektasi wajar,
      // supaya baseline tetap 100% rasio (tes ini soal apathy, bukan floor).
      kunjunganTotal: 24,
      kunjunganBerhasil: 24,
      miTotal: 24,
      miTepat: 24,
    }
    const desa = { keluarga: {}, kader: {}, rw: [buatRw(1, 0.8), buatRw(2, 0)], binaan: [], surveilans: [], drift: { minggu: 1, jumlah: 0 } }
    const rajin = hitungSkor(buatState({ desa, tally: buatTally(tallyDasar) }))
    const apatis = hitungSkor(buatState({ desa, tally: buatTally({ ...tallyDasar, apathy: 10 }) }))
    // iksDesa = rata-rata rw ber-iks > 0 saja → 0.8
    expect(rajin.rincian.iksDesa).toBeCloseTo(0.8)
    // CODEX audit pasca-GM (2026-07-13, temuan #7): UKM kini juga menimbang
    // rasioProlanisTerkontrol (bobot 0.2) — roster kosong di sini (bukan fokus
    // tes ini) → suku itu = 0, jadi 3 suku lama diskalakan 0.4/0.2/0.2 (dulu
    // 0.5/0.25/0.25): (0.4*0.8+0.2*1+0.2*1)*35 = 25.2 (dulu 31.5).
    expect(rajin.ukm).toBeCloseTo(25.2)
    expect(apatis.ukm).toBeCloseTo(5.2)
    expect(apatis.ukm).toBeLessThan(rajin.ukm)
  })

  it('kalibrasi: TEGAK-semua-salah lebih buruk daripada SUSPEK-jujur-salah', () => {
    const sombong = hitungSkor(
      buatState({ tally: buatTally({ totalPasien: 10, tegakSalah: 10 }) }),
    )
    const jujur = hitungSkor(
      buatState({ tally: buatTally({ totalPasien: 10, suspekSalah: 10 }) }),
    )
    expect(sombong.rincian.kalibrasi).toBeCloseTo(0)
    expect(jujur.rincian.kalibrasi).toBeCloseTo(40)
    expect(sombong.ukp).toBeLessThan(jujur.ukp)
  })

  it('cowboy dan karma mengurangi dimensi masing-masing', () => {
    const cowboy = hitungSkor(
      buatState({
        tally: buatTally({ totalPasien: 10, diagnosisBenar: 10, sumSkorProses: 1_000, tegakBenar: 10, cowboy: 3 }),
      }),
    )
    // DeepThink ronde-2 "Boikot Rujukan": cowboy dinaikkan dari −2 ke −5/kejadian.
    expect(cowboy.ukp).toBeCloseTo(35 - 15)

    const desa = { keluarga: {}, kader: {}, rw: [buatRw(1, 0.8)], binaan: [], surveilans: [], drift: { minggu: 1, jumlah: 0 } }
    const tallyUkm = { kunjunganTotal: 24, kunjunganBerhasil: 24, miTotal: 24, miTepat: 24 }
    const karma = hitungSkor(
      buatState({ desa, tally: buatTally({ ...tallyUkm, karmaTerjadi: 2, karmaDicegah: 1 }) }),
    )
    // M10.5 Fase 3 (2026-07-12): efekKarma rate-normalized+asimetris — denom
    // = max(3, 2+1) = 3; efekKarma = (3*1 - 9*2)/3 = -5 (dulu -2*2+1*1 = -3).
    // CODEX audit pasca-GM (2026-07-13, temuan #7): base UKM turun 31.5→25.2
    // sejajar tes apathy di atas (roster Prolanis kosong, bukan fokus tes ini).
    expect(karma.ukm).toBeCloseTo(25.2 - 5)
  })

  it('Manajemen & Resiliensi: stewardship, kapitasi jebol, dan kelelahan dihukum', () => {
    const boros = hitungSkor(
      buatState({
        kapitasi: 9_000_000,
        burnout: 50,
        tally: buatTally({ labTakRelevan: 6, antibiotikTanpaIndikasi: 2, hariKelelahan: 4 }),
      }),
    )
    expect(boros.manajemen).toBeCloseTo(15 - 3 - 2 - 3)
    expect(boros.resiliensi).toBeCloseTo(15 - 6 - 5)
  })

  it('grade & label mengikuti ambang BUILD_SPECS', () => {
    const sempurna = hitungSkor(
      buatState({
        desa: { keluarga: {}, kader: {}, rw: [buatRw(1, 1)], binaan: [], surveilans: [], drift: { minggu: 1, jumlah: 0 } },
        // CODEX audit pasca-GM (2026-07-13, temuan #7): UKM kini juga menimbang
        // kualitas roster Prolanis (bobot 0.2) — "sempurna" harus genuinely
        // mencakup SEMUA komponen UKM (bukan cuma 3 dari 4) utk tetap total 100.
        prolanis: {
          roster: [
            { id: 'p1', nama: 'Uji', usia: 55, jenisKelamin: 'L', rw: 1, jenis: 'ht', param: 120, takTerkontrolBerturut: 0 },
          ],
        },
        tally: buatTally({
          totalPasien: 10,
          diagnosisBenar: 10,
          sumSkorProses: 1_000,
          tegakBenar: 10,
          // ≥ EKSPEKTASI_KUNJUNGAN_KARIER (24) — skor "sempurna" harus
          // memenuhi ekspektasi beban kerja wajar, bukan cuma rasio kecil.
          kunjunganTotal: 24,
          kunjunganBerhasil: 24,
          miTotal: 24,
          miTepat: 24,
        }),
      }),
    )
    expect(sempurna.total).toBeCloseTo(100)
    expect(sempurna.grade).toBe('A')
    expect(sempurna.gradeLabel).toBe('PTT Teladan')

    const kosong = hitungSkor(buatState())
    // Belum ada data UKP/UKM → hanya Manajemen 15 + Resiliensi 15 = 30 → D.
    expect(kosong.total).toBeCloseTo(30)
    expect(kosong.grade).toBe('D')
    expect(kosong.gradeLabel).toBe('Perlu Pembinaan')
  })
})

/* ---------------------------------------------------------------------------
 * ringkasanHarian
 * ------------------------------------------------------------------------- */

describe('ringkasanHarian', () => {
  it('tanpa encounter: grade "—" dengan catatan default', () => {
    const { grade, catatan } = ringkasanHarian(buatState())
    expect(grade).toBe('—')
    expect(catatan.length).toBeGreaterThan(0)
  })

  it('grade rata-rata hari ini + catatan memuat clue kasus yang salah', () => {
    const state = buatState({
      klinik: {
        antrian: [],
        autoHariIni: { jumlah: 3, bermasalah: 1 },
        selesaiHariIni: [
          buatPenilaian({ grade: 'A' }),
          buatPenilaian({
            grade: 'D',
            diagnosisBenar: false,
            pasienNama: 'Bu Ratna',
            clue: 'NS1 dengue paling sensitif di hari demam 1-5 (PNPK DBD).',
          }),
        ],
      },
    })
    const { grade, catatan } = ringkasanHarian(state)
    expect(grade).toBe('B') // rata (4+1)/2 = 2.5 → B
    expect(catatan.some((c) => c.includes('Bu Ratna') && c.includes('NS1 dengue'))).toBe(true)
    expect(catatan.some((c) => c.includes('instingmu'))).toBe(true)
  })
})

/* ---------------------------------------------------------------------------
 * Save — roundtrip & penolakan
 * ------------------------------------------------------------------------- */

describe('serialize / deserialize', () => {
  it('roundtrip mengembalikan state yang identik', () => {
    const pack = buatPack([buatKasus('flu'), buatKasus('tb')])
    const state = buatState({
      hari: 6,
      blok: 'sore',
      stamina: 2,
      burnout: 24,
      kapitasi: 12_345_678,
      // CODEX M14 #7: layar HARUS konsisten dgn sesi aktif — fixture ini punya
      // `kunjungan` aktif, jadi layar-nya 'kunjungan' (bukan 'klinik'). Kombinasi
      // layar-non-sesi + sesi aktif = soft-lock yang kini direkonsiliasi
      // deserialize, jadi roundtrip-nya sengaja tak identik utk state kontradiktif.
      layar: 'kunjungan',
      klinik: {
        antrian: [buatPasienDariKasus('flu', pack, new Rng(9, 'rt'))],
        selesaiHariIni: [buatPenilaian({ jenisDiagnosis: 'suspek', grade: 'B' })],
        autoHariIni: { jumlah: 2, bermasalah: 1 },
      },
      desa: {
        keluarga: { keluarga_uji: buatKeluargaState('keluarga_uji') },
        kader: {
          kader_1: { id: 'kader_1', nama: 'Bu Komang', rw: 1, ketelitian: 70, bias: ['kb'], kkTersurvei: 8 },
        },
        rw: [buatRw(1, 0.62)],
        binaan: ['keluarga_uji'], surveilans: [], drift: { minggu: 1, jumlah: 0 }
      },
      kunjungan: {
        keluargaId: 'keluarga_uji',
        skenarioId: 'kunjungan_1',
        fase: 'wawancara',
        hotspotDitemukan: ['asbak'],
        dialogIndex: 1,
        pilihanDiambil: ['d1_empati'],
        trustDelta: 2,
        konfrontasiBeruntun: 0,
        diusir: false,
      },
      inbox: [
        {
          id: 'surat_6_0',
          hari: 6,
          jenis: 'laporan_kader',
          dari: 'Bu Komang',
          judul: 'Laporan RW 1',
          isi: 'Sudah 8 KK tersurvei, Dok.',
          dibaca: false,
        },
      ],
      jadwal: [{ id: 'jadwal_karma_1', hari: 7, jenis: 'karma_igd', keluargaId: 'keluarga_uji', kasusId: 'tb' }],
      tally: buatTally({ totalPasien: 9, diagnosisBenar: 7, tegakBenar: 5, suspekBenar: 2, suspekSalah: 2 }),
      dex: { flu: { kasusId: 'flu', ditangani: 4, benar: 3, bintang: 2, terakhirHari: 5 } },
      refleksi: { 5: 'Hari yang melelahkan tapi Bu Wulan akhirnya mau bicara.' },
      flags: { petaBaruTerbuka: true },
      log: [{ hari: 6, blok: 'pagi', aksi: 'PANGGIL_PASIEN' }],
    })

    const hasil = deserialize(serialize(state))
    expect(hasil).not.toBeNull()
    expect(hasil).toEqual(state)
  })

  it('JSON rusak / bentuk asing → null, bukan crash', () => {
    expect(deserialize('bukan json {')).toBeNull()
    expect(deserialize('null')).toBeNull()
    expect(deserialize('[1,2,3]')).toBeNull()
    expect(deserialize('{"halo":"dunia"}')).toBeNull()
  })

  it('versi amplop / skema state yang salah → null', () => {
    const valid = buatState()
    expect(deserialize(JSON.stringify({ v: 2, state: valid }))).toBeNull()
    expect(deserialize(JSON.stringify({ v: 1, state: { ...valid, versi: 99 } }))).toBeNull()
    expect(deserialize(JSON.stringify({ v: 1, state: { ...valid, blok: 'malam' } }))).toBeNull()
    expect(deserialize(JSON.stringify({ v: 1, state: { ...valid, hari: 'enam' } }))).toBeNull()
    const { desa: _desa, ...tanpaDesa } = buatState()
    expect(deserialize(JSON.stringify({ v: 1, state: tanpaDesa }))).toBeNull()
  })
})
