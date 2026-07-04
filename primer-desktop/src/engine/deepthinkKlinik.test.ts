/**
 * TEST — triase DeepThink 5 blind spot engine klinik (2026-07-04).
 * Fixture mini inline (headless, tidak bergantung konten produksi) — pola
 * sama m3sisrute.test.ts. Fokus file ini: yang butuh full reducer (DISPOSISI +
 * LANJUTKAN), bukan clinic.ts murni (itu di clinic.test.ts).
 */

import { describe, expect, it } from 'vitest'
import type { ContentPack } from '@content/pack'
import type { KasusKlinis } from '@content/types'
import type { GameState, RwState, SkorTally } from './state'
import type { Action } from './actions'
import { advance } from './reducer'
import { buatPasienDariKasus, hitungSkor } from './director'
import { Rng } from './core/rng'

function kasus(id: string, o?: Partial<KasusKlinis>): KasusKlinis {
  return {
    id,
    nama: `Kasus ${id}`,
    icd10: 'A00',
    skdi: '4A',
    kategori: 'infeksi',
    fktp144: true,
    harusDirujuk: false,
    keluhanUtama: 'Keluhan uji.',
    demografi: { usiaMin: 20, usiaMax: 60 },
    vital: { td: '120/80', nadi: 80 },
    anamnesis: [],
    pemeriksaanFisik: [],
    lab: [],
    diagnosisBanding: ['A00'],
    tatalaksana: { obatBenar: [], edukasi: ['edu_uji'] },
    clue: 'Clue uji.',
    konsekuensi: {
      narasi: 'Tanpa tuntas, memburuk.',
      kembaliHariMin: 3,
      kembaliHariMax: 5,
      kondisiKembali: 'kondisi memburuk',
    },
    ...o,
  }
}

function pack(kasusList: KasusKlinis[]): ContentPack {
  const kasusMap: Record<string, KasusKlinis> = {}
  for (const k of kasusList) kasusMap[k.id] = k
  return {
    kasus: kasusMap,
    kasusIgd: {},
    keluarga: {},
    kader: [],
    rw: [],
    rumahSakit: [],
    obat: {},
    lab: {
      lab_besok_relevan: {
        id: 'lab_besok_relevan',
        nama: 'Lab Besok Relevan',
        biaya: 20000,
        nilaiNormal: 'Normal',
        hasilBesok: true,
      },
      lab_besok_tak_relevan: {
        id: 'lab_besok_tak_relevan',
        nama: 'Lab Besok Tak Relevan',
        biaya: 20000,
        nilaiNormal: 'Normal',
        hasilBesok: true,
      },
    },
    edukasi: { edu_uji: { id: 'edu_uji', nama: 'Edukasi Uji', kategori: 'gaya_hidup', sinonim: [] } },
    tindakan: {},
    skdi144: [],
    namaWarga: { pria: ['Budi'], wanita: ['Siti'], keluarga: ['Uji'] },
  }
}

function baseState(p: ContentPack, o?: Partial<GameState>): GameState {
  const s: GameState = {
    versi: 1,
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
      totalPasien: 0, diagnosisBenar: 0, tegakBenar: 0, tegakSalah: 0, suspekBenar: 0, suspekSalah: 0,
      rujukanTotal: 0, rujukanNonSpesialistik: 0, rujukanTepat: 0, rujukanDitolak: 0, cowboy: 0,
      antibiotikTanpaIndikasi: 0, labTakRelevan: 0, miTepat: 0, miTotal: 0, kunjunganBerhasil: 0,
      kunjunganTotal: 0, kunjunganDiusir: 0, apathy: 0, autoBermasalah: 0, posyanduSesi: 0,
      prolanisSesi: 0, klbTuntas: 0, igdStabil: 0, igdSalahDisposisi: 0, igdMeninggal: 0, rmLengkap: 0, teguranDinkes: 0, hariKelelahan: 0, karmaTerjadi: 0, karmaDicegah: 0,
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
    ...o,
  }
  return s
}

function run(s: GameState, a: Action, p: ContentPack): GameState {
  return advance(s, a, p).state
}

/** Panggil pasien, komit dx TEGAK benar, pesan lab, lalu disposisi Observasi. */
function tanganiObservasi(s0: GameState, p: ContentPack, labId: string): GameState {
  let s = run(s0, { type: 'PANGGIL_PASIEN' }, p)
  const kasusId = s.klinik.aktif!.pasien.kasusId
  const icd = p.kasus[kasusId]!.icd10
  s = run(s, { type: 'LANJUT_FASE' }, p) // anamnesis → pemeriksaan
  s = run(s, { type: 'PESAN_LAB', labId }, p)
  s = run(s, { type: 'LANJUT_FASE' }, p) // pemeriksaan → diagnosis
  s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: icd, jenis: 'tegak' }, p) // → terapi
  s = run(s, { type: 'LANJUT_FASE' }, p) // terapi → disposisi
  return run(s, { type: 'DISPOSISI', jenis: 'observasi' }, p)
}

describe('DeepThink #1 — observasi + lab besok: lubang hitam ditutup', () => {
  it('lab RELEVAN pending → pasien dijadwalkan kembali besok utk evaluasi (bukan lenyap)', () => {
    const p = pack([kasus('flu', { lab: [{ id: 'lab_besok_relevan', hasil: 'Menunggu', flag: 'normal', relevan: true }] })])
    let s = baseState(p, {
      klinik: { antrian: [buatPasienDariKasus('flu', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } },
    })
    s = tanganiObservasi(s, p, 'lab_besok_relevan')
    // Sebelum fix: observasiMenungguLab mengecualikan dari SEMUA jadwal balik —
    // pasien lenyap dari semesta game selamanya begitu hasil lab tiba di inbox.
    const balik = s.jadwal.find((j) => j.jenis === 'pasien_kembali' && j.id.startsWith('jadwal_evaluasi_'))
    expect(balik).toBeDefined()
    expect(balik?.hari).toBe(21)
    expect(balik?.catatan).toContain('evaluasi hasil lab')
  })

  it('lab TAK RELEVAN pending → TIDAK dapat proteksi observasi (reducer, simetris dgn clinic.ts)', () => {
    // Diagnosis SALAH sengaja (icd beda) → pantasKonsekuensi=true. Kalau lab tak
    // relevan dikira "menunggu lab sah" (bug lama), konsekuensi negatif harusnya
    // ikut dikecualikan juga — padahal semestinya TETAP berjalan normal.
    const p = pack([
      kasus('flu', { icd10: 'J00', lab: [{ id: 'lab_besok_tak_relevan', hasil: 'x', flag: 'normal', relevan: false }] }),
    ])
    let s = baseState(p, {
      klinik: { antrian: [buatPasienDariKasus('flu', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } },
    })
    let sTangani = run(s, { type: 'PANGGIL_PASIEN' }, p)
    sTangani = run(sTangani, { type: 'LANJUT_FASE' }, p)
    sTangani = run(sTangani, { type: 'PESAN_LAB', labId: 'lab_besok_tak_relevan' }, p)
    sTangani = run(sTangani, { type: 'LANJUT_FASE' }, p)
    sTangani = run(sTangani, { type: 'KOMIT_DIAGNOSIS', icd10: 'J06.9', jenis: 'tegak' }, p) // SALAH sengaja
    sTangani = run(sTangani, { type: 'LANJUT_FASE' }, p)
    s = run(sTangani, { type: 'DISPOSISI', jenis: 'observasi' }, p)
    // Konsekuensi NEGATIF tetap terjadwal (bukan jalur netral jadwal_evaluasi_).
    expect(s.jadwal.some((j) => j.id.startsWith('jadwal_kembali_'))).toBe(true)
    expect(s.jadwal.some((j) => j.id.startsWith('jadwal_evaluasi_'))).toBe(false)
  })
})

describe('DeepThink #5 — ghosting antrian pagi: pasien diskip+bermasalah kini bisa terjadwal kembali', () => {
  it('sebagian pasien yg di-skip DAN bermasalah dijadwalkan kembali dgn kondisi memburuk', () => {
    const p = pack([kasus('flu')])
    // Antrian besar + burnout maks (pBermasalah 0.45) — pastikan setidaknya
    // satu dari 20 pasien roll "bermasalah" utk seed uji ini.
    const antrian = Array.from({ length: 20 }, (_, i) => buatPasienDariKasus('flu', p, new Rng(1, 'antrian', i)))
    let s = baseState(p, {
      burnout: 100,
      klinik: { antrian, selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } },
    })
    s = run(s, { type: 'LANJUTKAN' }, p) // pagi → siang, auto-resolve sisa antrian
    expect(s.tally.autoBermasalah).toBeGreaterThan(0) // pra-syarat: dice roll benar2 kena
    const terlantar = s.jadwal.filter((j) => j.id.startsWith('jadwal_terlantar_'))
    expect(terlantar.length).toBeGreaterThan(0)
    expect(terlantar[0]?.catatan).toContain('dilewatkan')
    expect(terlantar[0]?.kasusId).toBe('flu')
  })

  it('kasus TANPA konsekuensi yang di-skip+bermasalah tetap kena penalti statistik saja (tak dipaksa arc memburuk)', () => {
    const p = pack([kasus('ringan', { konsekuensi: undefined })])
    const antrian = Array.from({ length: 20 }, (_, i) => buatPasienDariKasus('ringan', p, new Rng(1, 'antrian', i)))
    let s = baseState(p, {
      burnout: 100,
      klinik: { antrian, selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } },
    })
    s = run(s, { type: 'LANJUTKAN' }, p)
    expect(s.tally.autoBermasalah).toBeGreaterThan(0)
    expect(s.jadwal.some((j) => j.id.startsWith('jadwal_terlantar_'))).toBe(false)
  })
})

/* ---------------------------------------------------------------------------
 * DeepThink ronde-2 — Hukum Bilangan Kecil (scoring.ts kunjungan/MI floor)
 * ------------------------------------------------------------------------- */

function tallyKosong(override?: Partial<SkorTally>): SkorTally {
  return {
    totalPasien: 0, diagnosisBenar: 0, tegakBenar: 0, tegakSalah: 0, suspekBenar: 0, suspekSalah: 0,
    rujukanTotal: 0, rujukanNonSpesialistik: 0, rujukanTepat: 0, rujukanDitolak: 0, cowboy: 0,
    antibiotikTanpaIndikasi: 0, labTakRelevan: 0, miTepat: 0, miTotal: 0, kunjunganBerhasil: 0,
    kunjunganTotal: 0, kunjunganDiusir: 0, apathy: 0, autoBermasalah: 0, posyanduSesi: 0,
    prolanisSesi: 0, klbTuntas: 0, igdStabil: 0, igdSalahDisposisi: 0, igdMeninggal: 0, rmLengkap: 0,
    teguranDinkes: 0, hariKelelahan: 0, karmaTerjadi: 0, karmaDicegah: 0,
    ...override,
  }
}

function rwSatu(iks: number): RwState {
  return { nomor: 1, nama: 'RW 1', jarak: 'dekat', totalKk: 25, kkTersurvei: iks > 0 ? 10 : 0, iks, bonusIks: 0 }
}

describe('DeepThink ronde-2 — Hukum Bilangan Kecil: rasioKunjungan/kualitasMi punya lantai ekspektasi', () => {
  it('sekali kunjungan sukses TIDAK LAGI mengunci rasio 100% permanen (mode karier)', () => {
    const p = pack([kasus('flu')])
    const s = baseState(p, {
      mode: 'karier',
      desa: { keluarga: {}, kader: {}, rw: [rwSatu(0.8)], binaan: [], surveilans: [], drift: { minggu: 1, jumlah: 0 } },
      tally: tallyKosong({ kunjunganTotal: 1, kunjunganBerhasil: 1, miTotal: 1, miTepat: 1 }),
    })
    const skor = hitungSkor(s)
    // Sebelum fix: 1/Math.max(1,1) = 100%. Sekarang: 1/24 ≈ 4.2%.
    expect(skor.rincian.kualitasMi).toBeCloseTo((1 / 24) * 100, 1)
  })

  it('dokter rajin (18 sukses dari 20 kunjungan) mengalahkan dokter sekali-sukses — bukan lagi seri', () => {
    const p = pack([kasus('flu')])
    const desa = { keluarga: {}, kader: {}, rw: [rwSatu(0.8)], binaan: [], surveilans: [], drift: { minggu: 1, jumlah: 0 } }
    const sekaliSukses = hitungSkor(
      baseState(p, { mode: 'karier', desa, tally: tallyKosong({ kunjunganTotal: 1, kunjunganBerhasil: 1 }) }),
    )
    const rajinTapiAdaGagal = hitungSkor(
      baseState(p, { mode: 'karier', desa, tally: tallyKosong({ kunjunganTotal: 20, kunjunganBerhasil: 18 }) }),
    )
    // Klaim DeepThink: keduanya "setara" di formula lama (Math.max(1,total)).
    // Dengan lantai ekspektasi, volume+konsistensi yang menang telak.
    expect(rajinTapiAdaGagal.ukm).toBeGreaterThan(sekaliSukses.ukm)
  })

  it('mode ujian pakai lantai lebih rendah (8) — beban wajar 30 hari beda dari karier 90 hari', () => {
    const p = pack([kasus('flu')])
    const desa = { keluarga: {}, kader: {}, rw: [rwSatu(0.8)], binaan: [], surveilans: [], drift: { minggu: 1, jumlah: 0 } }
    const delapanKunjunganUjian = hitungSkor(
      baseState(p, { mode: 'ujian', desa, tally: tallyKosong({ kunjunganTotal: 8, kunjunganBerhasil: 8 }) }),
    )
    const delapanKunjunganKarier = hitungSkor(
      baseState(p, { mode: 'karier', desa, tally: tallyKosong({ kunjunganTotal: 8, kunjunganBerhasil: 8 }) }),
    )
    expect(delapanKunjunganUjian.rincian.iksDesa).toBeCloseTo(delapanKunjunganKarier.rincian.iksDesa)
    // 8 kunjungan = ekspektasi PENUH di ujian (rasio 1) tapi cuma sebagian di karier (8/24).
    expect(delapanKunjunganUjian.ukm).toBeGreaterThan(delapanKunjunganKarier.ukm)
  })

  it('volume TINGGI (di atas ekspektasi) dgn hasil sempurna tetap dapat rasio penuh (tak dihukum ganda)', () => {
    const p = pack([kasus('flu')])
    const desa = { keluarga: {}, kader: {}, rw: [rwSatu(1)], binaan: [], surveilans: [], drift: { minggu: 1, jumlah: 0 } }
    const s = baseState(p, {
      mode: 'karier',
      desa,
      tally: tallyKosong({ kunjunganTotal: 30, kunjunganBerhasil: 30, miTotal: 30, miTepat: 30 }),
    })
    const skor = hitungSkor(s)
    expect(skor.rincian.kualitasMi).toBeCloseTo(100)
    expect(skor.ukm).toBeCloseTo(35)
  })
})

/* ---------------------------------------------------------------------------
 * DeepThink ronde-2 — Boikot Rujukan (cowboy −2 → −5, keputusan user)
 * ------------------------------------------------------------------------- */

describe('DeepThink ronde-2 — Boikot Rujukan: cowboy dinaikkan supaya berhenti-merujuk bukan lagi strategi murah', () => {
  it('boikot (rujukanTotal<3, lolos guillotine, lalu cowboy-kan 6 kasus wajib-rujuk) tak lagi jauh lebih murah drpd guillotine crash', () => {
    const p = pack([kasus('flu')])
    // Path A: merujuk banyak (≥3) dgn RRNS buruk → guillotine aktif & menghancurkan UKP.
    const pathA = hitungSkor(
      baseState(p, {
        tally: tallyKosong({
          totalPasien: 60, diagnosisBenar: 54, tegakBenar: 54,
          rujukanTotal: 10, rujukanNonSpesialistik: 4,
        }),
      }),
    )
    expect(pathA.rincian.guillotine).toBe(0)
    expect(pathA.ukp).toBe(0)

    // Path B: berhenti merujuk di bawah ambang 3 (lolos guillotine SEPENUHNYA
    // meski RRNS 100% di sampel kecil), lalu 6 kasus wajib-rujuk berikutnya
    // ditangani sendiri (cowboy) alih-alih dirujuk.
    const pathB = hitungSkor(
      baseState(p, {
        tally: tallyKosong({
          totalPasien: 60, diagnosisBenar: 54, tegakBenar: 54,
          rujukanTotal: 2, rujukanNonSpesialistik: 2, cowboy: 6,
        }),
      }),
    )
    expect(pathB.rincian.guillotine).toBe(1) // sampel <3 → guillotine tak aktif

    // Sebelum fix (cowboy −2): pathB.ukp ≈ 19,5 — jauh lebih baik dari pathA=0,
    // insentif nyata utk boikot. Sesudah fix (−5): jarak menyempit drastis,
    // boikot tak lagi strategi yang jelas menguntungkan.
    expect(pathB.ukp).toBeLessThan(10)
    expect(pathB.ukp - pathA.ukp).toBeLessThan(10)
  })
})
