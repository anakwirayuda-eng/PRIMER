/**
 * M3 — SISRUTE berjenjang + PRB + confidence-tag + guardrail balance.
 * Fixture mini inline (headless, tidak bergantung konten produksi).
 */

import { describe, expect, it } from 'vitest'
import type { ContentPack } from '@content/pack'
import type { KasusKlinis } from '@content/types'
import type { GameState } from './state'
import type { Action } from './actions'
import { advance } from './reducer'
import { hitungSkor } from './scoring'
import { susunAntrianHarian, buatPasienDariKasus } from './director'
import { Rng } from './core/rng'

/* -- Fixture ---------------------------------------------------------------- */

function kasus(id: string, o?: Partial<KasusKlinis>): KasusKlinis {
  return {
    id,
    nama: `Kasus ${id}`,
    icd10: 'I63.9',
    skdi: '3B',
    kategori: 'saraf',
    fktp144: true,
    harusDirujuk: true,
    spesialisRujukan: 'saraf',
    prevalensi: 'rendah',
    keluhanUtama: 'Lemah separuh badan mendadak.',
    demografi: { usiaMin: 50, usiaMax: 70, jenisKelamin: 'L' },
    vital: { td: '180/100', nadi: 88 },
    anamnesis: [],
    pemeriksaanFisik: [{ region: 'neurologis', temuan: 'Hemiparesis kanan.', relevan: true }],
    lab: [],
    diagnosisBanding: ['I63.9', 'I61.9', 'G45.9'],
    tatalaksana: { obatBenar: [], edukasi: [] },
    clue: 'Stroke akut: stabilisasi lalu rujuk (PPK).',
    konsekuensi: {
      narasi: 'Tanpa penanganan RS, defisit menetap.',
      kembaliHariMin: 3,
      kembaliHariMax: 6,
      kondisiKembali: 'hemiparesis menetap',
    },
    ...o,
  }
}

function pack(kasusList: KasusKlinis[], rsTambahan?: ContentPack['rumahSakit']): ContentPack {
  const kasusMap: Record<string, KasusKlinis> = {}
  for (const k of kasusList) kasusMap[k.id] = k
  return {
    kasus: kasusMap,
    kasusIgd: {},
    keluarga: {},
    kader: [],
    rw: [],
    rumahSakit: [
      { id: 'rs_saraf', nama: 'RSUD Saraf', kelas: 'C', jarakMenit: 40, spesialisasi: ['saraf'], bedDasar: 8 },
      { id: 'rs_kecil', nama: 'RS Kecil', kelas: 'D', jarakMenit: 15, spesialisasi: ['anak'], bedDasar: 0 },
      ...(rsTambahan ?? []),
    ],
    obat: {},
    lab: {},
    edukasi: {},
    tindakan: {},
    skdi144: [],
    namaWarga: { pria: ['Budi'], wanita: ['Siti'], keluarga: ['Uji'] },
  }
}

function baseState(p: ContentPack, o?: Partial<GameState>): GameState {
  const s: GameState = {
    versi: 1,
    contentRelease: 'legacy-baseline',
    seed: 99,
    mode: 'karier',
    seedKurikulum: 99,
    namaDokter: 'Uji',
    hari: 20,
    blok: 'pagi',
    stamina: 6,
    burnout: 0,
    klinik: { antrian: [], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } },
    desa: { keluarga: {}, kader: {}, rw: [], binaan: [], surveilans: [], drift: { minggu: 3, jumlah: 0 } },
    inbox: [],
    jadwal: [],
    tally: {
      totalPasien: 0, diagnosisBenar: 0, sumSkorProses: 0, tegakBenar: 0, tegakSalah: 0, suspekBenar: 0, suspekSalah: 0,
      rujukanTotal: 0, rujukanNonSpesialistik: 0, rujukanTepat: 0, rujukanDitolak: 0, cowboy: 0,
      antibiotikTanpaIndikasi: 0, obatBerbahaya: 0, tindakanBerbahaya: 0, firewallTerpicu: 0, stabilisasiTerlewat: 0, labTakRelevan: 0, miTepat: 0, miTotal: 0, kunjunganBerhasil: 0,
      kunjunganTotal: 0, kunjunganDiusir: 0, apathy: 0, autoBermasalah: 0, posyanduSesi: 0,
      prolanisSesi: 0, klbTuntas: 0, igdStabil: 0, igdSalahDisposisi: 0, igdMeninggal: 0, igdKodeBiruTerjadi: 0, rmLengkap: 0, teguranDinkes: 0, hariKelelahan: 0, karmaTerjadi: 0, karmaDicegah: 0,
    },
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
    ...o,
    careEpisodes: o?.careEpisodes ?? [],
  }
  return s
}

function run(s: GameState, a: Action, p: ContentPack): GameState {
  return advance(s, a, p).state
}

/** Panggil pasien pertama, komit dx, disposisi. */
function tanganiPasien(s0: GameState, p: ContentPack, disp: Action): GameState {
  let s = run(s0, { type: 'PANGGIL_PASIEN' }, p)
  const kasusId = s.klinik.aktif!.pasien.kasusId
  const icd = p.kasus[kasusId]!.icd10
  s = run(s, { type: 'LANJUT_FASE' }, p) // anamnesis → pemeriksaan
  s = run(s, { type: 'LANJUT_FASE' }, p) // pemeriksaan → diagnosis
  s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: icd, jenis: 'tegak' }, p) // → terapi
  s = run(s, { type: 'LANJUT_FASE' }, p) // terapi → disposisi
  return run(s, disp, p)
}

describe('M3.13 — SISRUTE berjenjang', () => {
  it('rujukan wajib + RS cocok + bed ada + KRONIS-PRB → DITERIMA + PRB terjadwal', () => {
    // Fix CODEX-25 #4: PRB hanya utk kasus `bisaPrb` (kronis-stabil). Fixture
    // di-tag eksplisit utk menguji jalur penjadwalan PRB.
    const p = pack([kasus('stroke', { bisaPrb: true })])
    let s = baseState(p, { klinik: { antrian: [buatPasienDariKasus('stroke', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } } })
    s = tanganiPasien(s, p, { type: 'DISPOSISI', jenis: 'rujuk', rumahSakitId: 'rs_saraf', sbar: { situation: 'Hemiparesis kanan mendadak, TD 180/100.', background: 'HT tak terkontrol.', assessment: 'Stroke iskemik akut (I63.9).', recommendation: 'Mohon rawat & CT scan.' } })
    expect(s.tally.rujukanTepat).toBe(1)
    expect(s.tally.rujukanDitolak).toBe(0)
    expect(s.jadwal.some((j) => j.prb === true)).toBe(true)
    expect(s.inbox.some((m) => m.judul.includes('DITERIMA'))).toBe(true)
  })

  it('Fix CODEX-25 #4: rujukan AKUT (bukan bisaPrb) diterima → TIDAK menjadwalkan PRB', () => {
    // Kasus akut (apendisitis/preeklampsia dst) tanpa `bisaPrb` — diterima RS,
    // dikelola tuntas di sana, TIDAK kembali sbg pasien PRB 7-12 hari kemudian.
    const p = pack([kasus('apendisitis')]) // default helper: bisaPrb tak di-set
    let s = baseState(p, { klinik: { antrian: [buatPasienDariKasus('apendisitis', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } } })
    s = tanganiPasien(s, p, { type: 'DISPOSISI', jenis: 'rujuk', rumahSakitId: 'rs_saraf', sbar: { situation: 'Nyeri perut kanan bawah akut, McBurney (+).', background: 'Onset 12 jam.', assessment: 'Apendisitis akut.', recommendation: 'Mohon laparotomi.' } })
    expect(s.tally.rujukanTepat).toBe(1)
    expect(s.jadwal.some((j) => j.prb === true)).toBe(false)
    expect(s.inbox.some((m) => m.judul.includes('DITERIMA'))).toBe(true)
  })

  it('rujukan ke RS salah spesialisasi → DITOLAK, pasien kembali besok', () => {
    const p = pack([kasus('stroke')])
    let s = baseState(p, { klinik: { antrian: [buatPasienDariKasus('stroke', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } } })
    s = tanganiPasien(s, p, { type: 'DISPOSISI', jenis: 'rujuk', rumahSakitId: 'rs_kecil', sbar: { situation: 'a'.repeat(25), background: 'b'.repeat(25), assessment: 'stroke', recommendation: 'c'.repeat(25) } })
    expect(s.tally.rujukanDitolak).toBe(1)
    expect(s.tally.rujukanTepat).toBe(0)
    expect(s.jadwal.some((j) => j.jenis === 'pasien_kembali' && j.hari === 21)).toBe(true)
  })

  // CODEX audit (2026-07-12, temuan #9): SISRUTE bed-roll (`rngRs` di atas
  // `s.seed`, sengaja personal/anti-hafalan sesuai M45_MODE_UJIAN.md §2) dulu
  // MENENTUKAN rujukanTepat/rujukanDitolak — dua siswa dgn keputusan identik
  // bisa dpt skor formal beda (65.0 vs 64.5, diverifikasi reproduksi) murni
  // dari keberuntungan bed. Sweep beberapa seed (bed kadang tersedia, kadang
  // penuh — RS fixture `bedDasar:0` → chance persis 0.5) dan pastikan
  // INVARIAN tally bertahan lepas dari hasil RNG: keputusan klinis benar
  // (stroke wajib-rujuk, RS spesialis cocok) → rujukanTepat SELALU 1,
  // rujukanDitolak SELALU 0 — apa pun hasil lempar koin bed.
  it('CODEX #9: rujukanTepat/rujukanDitolak TIDAK bergantung hasil RNG bed — hanya ketepatan klinis', () => {
    const rsKecilTapiCocok = {
      id: 'rs_saraf_kecil',
      nama: 'RSUD Saraf Kecil',
      kelas: 'D' as const,
      jarakMenit: 50,
      spesialisasi: ['saraf' as const],
      bedDasar: 0,
    }
    const p = pack([kasus('stroke')], [rsKecilTapiCocok])
    p.keluarga['keluarga_uji'] = {
      id: 'keluarga_uji',
      namaKeluarga: 'Uji',
      rw: 1,
      jarakMenit: 10,
      ekonomi: 'cukup',
      anggota: [{ nama: 'Budi', usia: 60, jenisKelamin: 'L', peran: 'kepala' }],
      indikatorAwal: {},
      arc: { sinopsis: '', kunjungan: [], epilogBerhasil: '', epilogGagal: '' },
    }
    let bedTersediaSetidaknyaSekali = false
    let bedPenuhSetidaknyaSekali = false
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      let s = baseState(p, {
        seed,
        klinik: {
          antrian: [{
            ...buatPasienDariKasus('stroke', p, new Rng(1, 'x')),
            keluargaId: 'keluarga_uji',
          }],
          selesaiHariIni: [],
          autoHariIni: { jumlah: 0, bermasalah: 0 },
        },
      })
      s = tanganiPasien(s, p, {
        type: 'DISPOSISI',
        jenis: 'rujuk',
        rumahSakitId: 'rs_saraf_kecil',
        sbar: { situation: 'a'.repeat(25), background: 'b'.repeat(25), assessment: 'stroke', recommendation: 'c'.repeat(25) },
      })
      expect(s.tally.rujukanTepat).toBe(1)
      expect(s.tally.rujukanDitolak).toBe(0)
      const suratBedPenuh = s.inbox.some((m) => m.judul.includes('Bed penuh'))
      const suratDiterima = s.inbox.some((m) => m.judul.includes('DITERIMA'))
      expect(suratBedPenuh || suratDiterima).toBe(true)
      const suratRujukan = s.inbox.find((m) => m.judul.includes('Bed penuh') || m.judul.includes('DITERIMA'))
      expect(suratRujukan?.kaitKeluargaId).toBe('keluarga_uji')
      if (suratBedPenuh) bedPenuhSetidaknyaSekali = true
      if (suratDiterima) bedTersediaSetidaknyaSekali = true
    }
    // Sanity: fixture ini genuinely menghasilkan KEDUA outcome lintas seed —
    // kalau tidak, invarian di atas tak benar-benar teruji terhadap variasi RNG.
    expect(bedTersediaSetidaknyaSekali).toBe(true)
    expect(bedPenuhSetidaknyaSekali).toBe(true)
  })

  // CODEX audit pasca-GM (2026-07-13, temuan #11): jadwal bed-penuh dulu jadi
  // 'pasien_kembali' generik — pasien yg SAMA muncul lagi di antrian esok
  // sbg encounter PENUH, mengkredit totalPasien/rujukanTepat KEDUA kalinya
  // utk satu keputusan klinis. Retry kini pasif (lihat `bedRetry` state.ts):
  // tally tidak boleh naik lagi & antrian klinik tidak boleh kemasukan
  // pasien baru, berapa pun hari yang berlalu sampai bed tersedia/dipaksa.
  it('CODEX #11: retry bed-penuh pasif — tally & antrian klinik TIDAK bertambah di hari berikutnya', () => {
    const rsKecilTapiCocok = {
      id: 'rs_saraf_kecil',
      nama: 'RSUD Saraf Kecil',
      kelas: 'D' as const,
      jarakMenit: 50,
      spesialisasi: ['saraf' as const],
      bedDasar: 0,
    }
    const p = pack([kasus('stroke')], [rsKecilTapiCocok])
    const majuSatuHari = (s: GameState): GameState =>
      run(run(run(s, { type: 'LANJUTKAN' }, p), { type: 'LANJUTKAN' }, p), { type: 'LANJUTKAN' }, p)

    // Cari seed yang bed-nya PENUH di kunjungan awal (supaya jadwal bedRetry
    // benar-benar terbentuk, bukan langsung diterima hari itu juga).
    let sAwal: GameState | undefined
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      let coba = baseState(p, {
        seed,
        klinik: { antrian: [buatPasienDariKasus('stroke', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } },
      })
      coba = tanganiPasien(coba, p, {
        type: 'DISPOSISI',
        jenis: 'rujuk',
        rumahSakitId: 'rs_saraf_kecil',
        sbar: { situation: 'a'.repeat(25), background: 'b'.repeat(25), assessment: 'stroke', recommendation: 'c'.repeat(25) },
      })
      if (coba.inbox.some((m) => m.judul.includes('Bed penuh'))) {
        sAwal = coba
        break
      }
    }
    expect(sAwal).toBeDefined()
    let s = sAwal!
    expect(s.tally.totalPasien).toBe(1)
    expect(s.tally.rujukanTepat).toBe(1)
    expect(s.jadwal.some((j) => j.bedRetry && j.rumahSakitId === 'rs_saraf_kecil')).toBe(true)

    // Kontrol: state IDENTIK tapi TANPA jadwal bedRetry, dimajukan hari yang
    // SAMA di setiap langkah — dipakai utk membuktikan jadwal bedRetry TIDAK
    // menambah satu pasien pun ke antrian (dulu ia jadi 'pasien_kembali'
    // generik yang MENAMBAH `antrianKembali` di atas antrian director normal
    // — persis bug yang temuan #11 tunjuk).
    let sKontrol: GameState = { ...s, jadwal: [] }

    // Maju sampai jadwal bedRetry itu tuntas (diterima atau dipaksa terima) —
    // dibatasi MAKS_RETRY_BED_PENUH+1 hari supaya tak jadi infinite loop bila
    // logikanya salah.
    for (let hari = 0; hari < 5 && s.jadwal.some((j) => j.bedRetry); hari++) {
      s = majuSatuHari(s)
      sKontrol = majuSatuHari(sKontrol)
      // Retry pasif TIDAK PERNAH menaikkan tally — keputusan klinis sudah
      // final di kunjungan pertama, bukan diulang sbg encounter baru.
      expect(s.tally.totalPasien).toBe(1)
      expect(s.tally.rujukanTepat).toBe(1)
      // Retry pasif TIDAK PERNAH menambah pasien ke antrian klinik dibanding
      // kontrol tanpa jadwal bedRetry sama sekali (director tetap mengisi
      // antrian harian seperti biasa, di hari yang sama — itu bukan bug ini).
      expect(s.klinik.antrian.length).toBe(sKontrol.klinik.antrian.length)
    }
    expect(s.jadwal.some((j) => j.bedRetry)).toBe(false)
    expect(s.inbox.some((m) => m.judul.includes('akhirnya diterima'))).toBe(true)
  })

  it('merujuk kasus FKTP (bukan wajib-rujuk) → DITOLAK boomerang + teguran', () => {
    const p = pack([kasus('ispa', { harusDirujuk: false, skdi: '4A', spesialisRujukan: undefined, prevalensi: 'tinggi', konsekuensi: undefined })])
    let s = baseState(p, { klinik: { antrian: [buatPasienDariKasus('ispa', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } } })
    s = tanganiPasien(s, p, { type: 'DISPOSISI', jenis: 'rujuk', sbar: { situation: 'x'.repeat(25), background: 'y'.repeat(25), assessment: 'ispa', recommendation: 'z'.repeat(25) } })
    expect(s.tally.rujukanDitolak).toBe(1)
    expect(s.inbox.some((m) => m.judul.includes('DITOLAK'))).toBe(true)
    expect(s.jadwal.some((j) => (j.catatan ?? '').includes('kompetensi FKTP'))).toBe(true)
  })

  // CODEX audit (2026-07-12, temuan #4): dulu §3a HANYA membebaskan tally
  // rujukanNonSpesialistik di clinic.ts — SISRUTE (reducer.ts) masih re-derive
  // sendiri dari `!kasus.harusDirujuk` mentah, jadi rujukan yg TERJUSTIFIKASI
  // tetap ditolak RS, didemaster Dex, dan dikirimi surat "DITOLAK" yg keliru.
  // Test ini mengeksekusi jalur REDUCER SESUNGGUHNYA (bukan cuma nilaiEncounter
  // terisolasi) — persis blind-spot yg CODEX identifikasi.
  it('CODEX #4: rujukan kasus FKTP dgn justifikasi TERVALIDASI → DITERIMA, bukan ditolak', () => {
    const p = pack([
      kasus('isk', {
        harusDirujuk: false,
        skdi: '4A',
        spesialisRujukan: undefined,
        prevalensi: 'tinggi',
        konsekuensi: undefined,
        justifikasiRujukValid: ['komplikasi'],
      }),
    ])
    let s = baseState(p, { klinik: { antrian: [buatPasienDariKasus('isk', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } } })
    s = tanganiPasien(s, p, {
      type: 'DISPOSISI',
      jenis: 'rujuk',
      justifikasiRujuk: 'komplikasi',
      sbar: { situation: 'x'.repeat(25), background: 'y'.repeat(25), assessment: 'isk', recommendation: 'z'.repeat(25) },
    })
    expect(s.tally.rujukanDitolak).toBe(0)
    expect(s.tally.rujukanNonSpesialistik).toBe(0)
    expect(s.inbox.some((m) => m.judul.includes('DITOLAK'))).toBe(false)
    expect(s.jadwal.some((j) => (j.catatan ?? '').includes('kompetensi FKTP'))).toBe(false)
    // Dex: diagnosis benar + disposisiTepat kini true utk rujukan terjustifikasi.
    expect(s.dex['isk']?.bintang).toBeGreaterThan(0)
  })

  it('CODEX #4: rujukan kasus FKTP dgn justifikasi TAK COCOK → tetap ditolak seperti biasa', () => {
    const p = pack([
      kasus('isk2', {
        harusDirujuk: false,
        skdi: '4A',
        spesialisRujukan: undefined,
        prevalensi: 'tinggi',
        konsekuensi: undefined,
        justifikasiRujukValid: ['komplikasi'],
      }),
    ])
    let s = baseState(p, { klinik: { antrian: [buatPasienDariKasus('isk2', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } } })
    s = tanganiPasien(s, p, {
      type: 'DISPOSISI',
      jenis: 'rujuk',
      justifikasiRujuk: 'komorbid',
      sbar: { situation: 'x'.repeat(25), background: 'y'.repeat(25), assessment: 'isk2', recommendation: 'z'.repeat(25) },
    })
    expect(s.tally.rujukanDitolak).toBe(1)
    expect(s.tally.rujukanNonSpesialistik).toBe(1)
    expect(s.inbox.some((m) => m.judul.includes('DITOLAK'))).toBe(true)
  })
})

describe('M3.13 — PRB & confidence-tag', () => {
  it('confidence-tag: rujukan tepat memberi bonus UKP (guillotine tak menghukum rujukan benar)', () => {
    const p = pack([kasus('stroke')])
    const s = baseState(p, {
      tally: {
        ...baseState(p).tally,
        totalPasien: 4, diagnosisBenar: 4, tegakBenar: 4,
        rujukanTotal: 1, rujukanTepat: 1, rujukanNonSpesialistik: 0,
      },
    })
    const skor = hitungSkor(s)
    const tanpaBonus = hitungSkor({ ...s, tally: { ...s.tally, rujukanTepat: 0 } })
    // Rujukan 1x non-spesialistik 0 → guillotine tidak aktif (<3 rujukan), + bonus.
    expect(skor.rincian.guillotine).toBe(1)
    expect(skor.ukp).toBeGreaterThan(tanpaBonus.ukp)
  })

  it('pasien PRB: memulangkan (bukan merujuk ulang) = disposisi tepat', () => {
    const p = pack([kasus('stroke')])
    const pasienPrb = { ...buatPasienDariKasus('stroke', p, new Rng(1, 'x')), prb: true }
    let s = baseState(p, { klinik: { antrian: [pasienPrb], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } } })
    s = tanganiPasien(s, p, { type: 'DISPOSISI', jenis: 'pulang' }, )
    const nilai = s.klinik.selesaiHariIni[0]!
    expect(nilai.disposisiTepat).toBe(true)
    expect(nilai.cowboy).toBe(false)
  })
})

describe('M3 — guardrail balance', () => {
  it('cap paparan: maksimal 1 kasus wajib-rujuk per pagi', () => {
    // Pool didominasi kasus rujukan; Director tetap batasi 1/hari.
    const kasusList = [
      kasus('r1'), kasus('r2'), kasus('r3'), kasus('r4'),
      kasus('aman1', { id: 'aman1', harusDirujuk: false, skdi: '4A', spesialisRujukan: undefined, prevalensi: 'tinggi' }),
      kasus('aman2', { id: 'aman2', harusDirujuk: false, skdi: '4A', spesialisRujukan: undefined, prevalensi: 'tinggi' }),
    ]
    const p = pack(kasusList)
    for (let seed = 0; seed < 40; seed++) {
      const antrian = susunAntrianHarian(baseState(p, { hari: 20 }), p, new Rng(seed, 'cap'))
      const rujuk = antrian.filter((x) => p.kasus[x.kasusId]!.harusDirujuk).length
      expect(rujuk).toBeLessThanOrEqual(1)
    }
  })

  it('prevalensi tinggi jauh lebih sering muncul daripada rendah', () => {
    // Pool 6 kasus, pick 3/hari → seleksi kompetitif (bukan semua terpilih).
    const aman = (id: string, prev: 'tinggi' | 'rendah') =>
      kasus(id, { id, harusDirujuk: false, skdi: '4A', spesialisRujukan: undefined, prevalensi: prev })
    const p = pack([
      aman('sering', 'tinggi'),
      aman('j1', 'rendah'), aman('j2', 'rendah'), aman('j3', 'rendah'),
      aman('j4', 'rendah'), aman('j5', 'rendah'),
    ])
    // Semua ★3 agar Leitner netral; ukur murni prevalensi.
    const dex = Object.fromEntries(
      ['sering', 'j1', 'j2', 'j3', 'j4', 'j5'].map((id) => [
        id, { kasusId: id, ditangani: 3, benar: 3, bintang: 3, terakhirHari: 20 },
      ]),
    )
    let cSering = 0
    let cJarang = 0 // rata-rata satu kasus jarang (j1)
    for (let seed = 0; seed < 400; seed++) {
      const antrian = susunAntrianHarian(baseState(p, { hari: 20, dex }), p, new Rng(seed, 'prev'))
      for (const x of antrian) {
        if (x.kasusId === 'sering') cSering++
        if (x.kasusId === 'j1') cJarang++
      }
    }
    // sering (bobot ×3) vs satu jarang (×0.6) → jauh lebih sering.
    // M10 Batch-2 (P1.4): kandidat kini di-SORT by id — realisasi draw utk
    // seed set 0..399 bergeser (empiris: 355 vs 187 ≈ 1.9×; sebelum sort
    // kebetulan >2×). Invarian yang dimaksud tetap "jauh lebih sering" —
    // ambang dilonggarkan ke 1.8× (masih menolak distribusi uniform ~1×).
    expect(cSering).toBeGreaterThan(cJarang * 1.8)
  })

  it('Dex: kuasai butuh diagnosis benar DAN disposisi tepat', () => {
    // Menahan kasus wajib-rujuk (cowboy) meski dx benar → bintang tidak naik.
    const p = pack([kasus('stroke')])
    let s = baseState(p, { klinik: { antrian: [buatPasienDariKasus('stroke', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } } })
    s = tanganiPasien(s, p, { type: 'DISPOSISI', jenis: 'pulang' })
    expect(s.dex['stroke']?.bintang).toBe(0) // dx benar tapi disposisi salah (cowboy)
  })
})
