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

function pack(kasusList: KasusKlinis[]): ContentPack {
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

/** Panggil pasien pertama, komit dx, disposisi. */
function tanganiPasien(s0: GameState, p: ContentPack, disp: Action): GameState {
  let s = run(s0, { type: 'PANGGIL_PASIEN' }, p)
  const kasusId = s.klinik.aktif!.pasien.kasusId
  const icd = p.kasus[kasusId]!.icd10
  s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: icd, jenis: 'tegak' }, p)
  return run(s, disp, p)
}

describe('M3.13 — SISRUTE berjenjang', () => {
  it('rujukan wajib + RS cocok + bed ada → DITERIMA + PRB terjadwal', () => {
    const p = pack([kasus('stroke')])
    let s = baseState(p, { klinik: { antrian: [buatPasienDariKasus('stroke', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } } })
    s = tanganiPasien(s, p, { type: 'DISPOSISI', jenis: 'rujuk', rumahSakitId: 'rs_saraf', sbar: { situation: 'Hemiparesis kanan mendadak, TD 180/100.', background: 'HT tak terkontrol.', assessment: 'Stroke iskemik akut (I63.9).', recommendation: 'Mohon rawat & CT scan.' } })
    expect(s.tally.rujukanTepat).toBe(1)
    expect(s.tally.rujukanDitolak).toBe(0)
    expect(s.jadwal.some((j) => j.prb === true)).toBe(true)
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

  it('merujuk kasus FKTP (bukan wajib-rujuk) → DITOLAK boomerang + teguran', () => {
    const p = pack([kasus('ispa', { harusDirujuk: false, skdi: '4A', spesialisRujukan: undefined, prevalensi: 'tinggi', konsekuensi: undefined })])
    let s = baseState(p, { klinik: { antrian: [buatPasienDariKasus('ispa', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } } })
    s = tanganiPasien(s, p, { type: 'DISPOSISI', jenis: 'rujuk', sbar: { situation: 'x'.repeat(25), background: 'y'.repeat(25), assessment: 'ispa', recommendation: 'z'.repeat(25) } })
    expect(s.tally.rujukanDitolak).toBe(1)
    expect(s.inbox.some((m) => m.judul.includes('DITOLAK'))).toBe(true)
    expect(s.jadwal.some((j) => (j.catatan ?? '').includes('kompetensi FKTP'))).toBe(true)
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
    // Rujukan 1x non-spesialistik 0 → guillotine tidak aktif (<3 rujukan), + bonus.
    expect(skor.ukp).toBeGreaterThan(26) // ~0.75*100+0.25*100 → 35, +bonus, tanpa penalti
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
    expect(cSering).toBeGreaterThan(cJarang * 2)
  })

  it('Dex: kuasai butuh diagnosis benar DAN disposisi tepat', () => {
    // Menahan kasus wajib-rujuk (cowboy) meski dx benar → bintang tidak naik.
    const p = pack([kasus('stroke')])
    let s = baseState(p, { klinik: { antrian: [buatPasienDariKasus('stroke', p, new Rng(1, 'x'))], selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } } })
    s = tanganiPasien(s, p, { type: 'DISPOSISI', jenis: 'pulang' })
    expect(s.dex['stroke']?.bintang).toBe(0) // dx benar tapi disposisi salah (cowboy)
  })
})
