/**
 * M4 — Ekonomi & manajemen bergigi: stok obat + pengadaan (18), laporan
 * bulanan + teguran Dinkes (19), akreditasi D60 dari rekam medis (20),
 * pemulihan akhir pekan + burnout menumpulkan auto-resolve (21).
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState } from './state'
import type { Action } from './actions'
import { advance, LEAD_TIME_OBAT, OPERASIONAL_BULANAN, AMBANG_TEGURAN_KAS } from './reducer'
import { buildInitialState } from './init'
import { hitungSkor } from './scoring'
import { buatPasienDariKasus } from './director'
import { Rng } from './core/rng'

const SEED = 4242

function run(s: GameState, a: Action): GameState {
  return advance(s, a, PACK).state
}
function ev(s: GameState, a: Action) {
  return advance(s, a, PACK)
}

/** IGD-safe: tangani IGD aktif secara optimal (pola m1bridge/m2program). */
function bereskanIgd(state: GameState): GameState {
  let s = state
  let guard = 0
  while (s.igd && guard++ < 30) {
    const kasus = PACK.kasusIgd[s.igd.kasusId]!
    if (s.igd.fase === 'langkah') {
      const l = kasus.langkah[s.igd.langkahIndex]!
      s = run(s, { type: 'AKSI_IGD', langkahId: l.id, pilihanId: (l.pilihan.find((p) => p.benar) ?? l.pilihan[0]!).id })
    } else if (s.igd.fase === 'kode_biru') s = run(s, { type: 'RJP_IGD', berkualitas: true })
    else if (s.igd.fase === 'disposisi') s = run(s, { type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar })
    else break
  }
  return s
}

function sampaiHari(s0: GameState, target: number): GameState {
  let s = s0
  while (s.hari < target) {
    s = bereskanIgd(s)
    s = run(s, { type: 'LANJUTKAN' })
  }
  return bereskanIgd(s)
}

describe('M4.18 — stok obat & pengadaan', () => {
  it('stok awal terisi untuk semua obat formularium', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    for (const id of Object.keys(PACK.obat)) expect(s.gudang.stok[id]).toBe(12)
  })

  it('stok 0 memblokir TAMBAH_OBAT dengan pesan yang menuntun', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = run(s, { type: 'PANGGIL_PASIEN' })
    const enc = s.klinik.aktif!
    const obatId = PACK.kasus[enc.pasien.kasusId]!.tatalaksana.obatBenar[0]
    if (!obatId) return // kasus tanpa obat — lewati
    s = { ...s, gudang: { ...s.gudang, stok: { ...s.gudang.stok, [obatId]: 0 } } }
    const r = ev(s, { type: 'TAMBAH_OBAT', obatId })
    expect(r.events.some((e) => e.type === 'ERROR_AKSI' && e.pesan.includes('HABIS'))).toBe(true)
    expect(r.state.klinik.aktif!.resep).not.toContain(obatId)
  })

  it('PESAN_OBAT memotong kas, tercatat di buku kas, dan tiba setelah lead time', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    const obatId = Object.keys(PACK.obat)[0]!
    const biaya = PACK.obat[obatId]!.hargaBeli * 20
    const kasSebelum = s.kapitasi
    s = run(s, { type: 'PESAN_OBAT', obatId, jumlah: 20 })
    expect(s.kapitasi).toBe(kasSebelum - biaya)
    expect(s.keuanganBulan.belanjaPengadaan).toBe(biaya)
    expect(s.gudang.pesanan).toHaveLength(1)
    // Pesanan ganda obat yang sama ditolak.
    expect(ev(s, { type: 'PESAN_OBAT', obatId, jumlah: 20 }).events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
    // Maju melewati lead time → stok bertambah + surat farmasi.
    s = sampaiHari(s, 1 + LEAD_TIME_OBAT + 1)
    expect(s.gudang.pesanan).toHaveLength(0)
    expect(s.gudang.stok[obatId]).toBe(12 + 20)
    expect(s.inbox.some((m) => m.judul.includes('Kiriman obat tiba'))).toBe(true)
  })

  it('jumlah pengadaan di luar 5-50 ditolak', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const obatId = Object.keys(PACK.obat)[0]!
    expect(ev(s, { type: 'PESAN_OBAT', obatId, jumlah: 3 }).events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
    expect(ev(s, { type: 'PESAN_OBAT', obatId, jumlah: 100 }).events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
  })

  // Audit CODEX 2026-07-04 (ronde-8): perbandingan `jumlah < 5 || jumlah > 50`
  // SELALU false utk NaN (perbandingan NaN tak pernah true) — Math.round(NaN)
  // tetap NaN, lolos gerbang, lalu meracuni kapitasi/belanjaPengadaan jadi NaN.
  it('jumlah pengadaan NaN ditolak, tidak meracuni kapitasi', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const obatId = Object.keys(PACK.obat)[0]!
    const kasSebelum = s.kapitasi
    const r = ev(s, { type: 'PESAN_OBAT', obatId, jumlah: NaN })
    expect(r.events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
    expect(r.state.kapitasi).toBe(kasSebelum)
    expect(Number.isFinite(r.state.kapitasi)).toBe(true)
    expect(r.state.gudang.pesanan).toHaveLength(0)
  })
})

describe('M4.19 — laporan bulanan & teguran Dinkes', () => {
  it('D31: laporan keuangan terbit, operasional terpotong, buku kas di-reset', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = sampaiHari(s, 31)
    expect(s.inbox.some((m) => m.judul.includes('Laporan keuangan bulanan'))).toBe(true)
    expect(s.keuanganBulan).toEqual({ belanjaObat: 0, belanjaPengadaan: 0 })
  })

  it('kas di bawah ambang → teguran Dinkes + tally + skor manajemen tergerus', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = { ...s, kapitasi: 1_000_000 } // dibuat nyaris bangkrut
    s = sampaiHari(s, 31)
    expect(s.kapitasi).toBeLessThan(AMBANG_TEGURAN_KAS)
    expect(s.tally.teguranDinkes).toBe(1)
    expect(s.inbox.some((m) => m.judul.includes('TEGURAN — kas'))).toBe(true)
    const tanpa = hitungSkor({ ...s, tally: { ...s.tally, teguranDinkes: 0 } })
    const dengan = hitungSkor(s)
    expect(dengan.manajemen).toBeLessThan(tanpa.manajemen)
  })

  it('OPERASIONAL_BULANAN benar-benar terpotong dari kas saat gajian', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    const sebelum = s.kapitasi
    s = sampaiHari(s, 31)
    // Pengali KBK bergantung IKS hasil sensus kader 30 hari — baca masukan
    // aktual dari surat BPJS, lalu pastikan ops terpotong dari situ.
    const suratKbk = s.inbox.find((m) => m.dari === 'BPJS Kesehatan')!
    const masukan = Number(suratKbk.judul.replace(/\D/g, '').slice(0, 7))
    expect(masukan).toBeGreaterThan(0)
    expect(s.kapitasi).toBe(sebelum + masukan - OPERASIONAL_BULANAN)
  })
})

describe('M4.20 — akreditasi D60 dari kelengkapan rekam medis', () => {
  it('D50 pengumuman visitasi; D60 hasil sesuai rasio rmLengkap', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    // Rekayasa rekam medis: 8 dari 10 lengkap → PARIPURNA (≥0.75).
    s = { ...s, tally: { ...s.tally, totalPasien: 10, rmLengkap: 8 } }
    s = sampaiHari(s, 50)
    expect(s.inbox.some((m) => m.judul.includes('visitasi akreditasi'))).toBe(true)
    s = sampaiHari(s, 60)
    expect(s.akreditasi).toBe('paripurna')
    expect(s.inbox.some((m) => m.judul.includes('HASIL AKREDITASI: PARIPURNA'))).toBe(true)
  })

  it('rekam medis bolong → MADYA + manajemen terpangkas; skor membedakan ketiganya', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    // labTakRelevan 6 menurunkan basis manajemen di bawah cap 15 supaya
    // bonus/penalti akreditasi terlihat (di cap, paripurna & utama sama-sama 15).
    const dasar = { ...s, tally: { ...s.tally, totalPasien: 10, diagnosisBenar: 8, tegakBenar: 8, labTakRelevan: 6 } }
    const paripurna = hitungSkor({ ...dasar, akreditasi: 'paripurna' })
    const utama = hitungSkor({ ...dasar, akreditasi: 'utama' })
    const madya = hitungSkor({ ...dasar, akreditasi: 'madya' })
    expect(paripurna.manajemen).toBeGreaterThan(utama.manajemen)
    expect(utama.manajemen).toBeGreaterThan(madya.manajemen)
  })

  it('encounter dgn semua fase ≥50 menambah tally rmLengkap', () => {
    // tutorialAktif dimatikan: encounter tutorial (DeepThink "onboarding
    // railroaded") sengaja kebal tally — tes ini soal rmLengkap, bukan tutorial.
    let s = { ...buildInitialState('Uji', SEED, PACK), tutorialAktif: false }
    s = run(s, { type: 'PANGGIL_PASIEN' })
    const kasus = PACK.kasus[s.klinik.aktif!.pasien.kasusId]!
    for (const q of kasus.anamnesis) {
      if (q.distraktor === true) continue
      s = run(s, { type: 'TANYA', pertanyaanId: q.id })
    }
    s = run(s, { type: 'LANJUT_FASE' })
    s = run(s, { type: 'UKUR_VITAL' })
    for (const t of kasus.pemeriksaanFisik) if (t.relevan) s = run(s, { type: 'PERIKSA', region: t.region })
    s = run(s, { type: 'LANJUT_FASE' })
    s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' })
    for (const o of kasus.tatalaksana.obatBenar) s = run(s, { type: 'TAMBAH_OBAT', obatId: o })
    for (const grup of kasus.tatalaksana.obatAlternatif ?? []) {
      if (grup[0]) s = run(s, { type: 'TAMBAH_OBAT', obatId: grup[0] })
    }
    for (const e of kasus.tatalaksana.edukasi) s = run(s, { type: 'TAMBAH_EDUKASI', edukasiId: e })
    s = run(s, { type: 'LANJUT_FASE' })
    s = run(s, {
      type: 'DISPOSISI',
      jenis: kasus.harusDirujuk ? 'rujuk' : 'pulang',
      ...(kasus.harusDirujuk
        ? { sbar: { situation: 'TD 150/90, keluhan berat.', background: 'Riwayat singkat pasien.', assessment: kasus.nama, recommendation: 'Mohon penanganan lanjutan.' } }
        : {}),
    })
    expect(s.tally.rmLengkap).toBe(1)
  })
})

// CODEX (2026-07-05): katalog tindakan (nebulisasi, Epley, dst.) punya `biaya`,
// tapi reducer DISPOSISI dulu hanya melooping `encFinal.resep` (obat) untuk
// memotong kapitasi — `encFinal.tindakan` (prosedur) sama sekali tak disentuh,
// jadi prosedur gratis/tak terlihat di kas walau sudah jadi mekanik ternilai
// sejak CODEX ronde-10.
describe('M4.22 — tindakan/prosedur klinis kini ikut membebani kapitasi', () => {
  it('melakukan prosedur (nebulisasi, ppok_eksaserbasi) memotong kapitasi sesuai biaya katalog', () => {
    const kasus = PACK.kasus['ppok_eksaserbasi']!
    expect(kasus.tatalaksana.prosedur).toEqual(['nebulisasi'])
    const biayaNebulisasi = PACK.tindakan['nebulisasi']!.biaya

    let s = buildInitialState('Uji', SEED, PACK)
    const pasien = buatPasienDariKasus('ppok_eksaserbasi', PACK, new Rng(1, 'x'))
    s = { ...s, tutorialAktif: false, klinik: { ...s.klinik, antrian: [pasien] } }
    s = run(s, { type: 'PANGGIL_PASIEN' })
    const kapitasiSebelum = s.kapitasi

    s = run(s, { type: 'LANJUT_FASE' }) // → pemeriksaan
    s = run(s, { type: 'LANJUT_FASE' }) // → diagnosis
    s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' })
    s = run(s, { type: 'TAMBAH_TINDAKAN', tindakanId: 'nebulisasi' })
    s = run(s, { type: 'LANJUT_FASE' }) // → disposisi
    const bpjs = s.klinik.aktif!.pasien.bpjs
    s = run(s, { type: 'DISPOSISI', jenis: 'rujuk', sbar: { situation: 'x', background: 'x', assessment: 'x', recommendation: 'x' } })

    const selisih = bpjs ? -biayaNebulisasi : biayaNebulisasi
    expect(s.kapitasi).toBe(kapitasiSebelum + selisih)
  })
})

describe('M4.21 — pemulihan akhir pekan & burnout menumpulkan insting', () => {
  it('PEMULIHAN hanya di hari kelipatan 7 blok siang; efek per jenis benar', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = sampaiHari(s, 7)
    expect(s.hari).toBe(7)
    // Pagi: ditolak (bukan siang).
    expect(ev(s, { type: 'PEMULIHAN', jenis: 'istirahat' }).events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
    s = run(s, { type: 'LANJUTKAN' }) // → siang
    s = { ...s, burnout: 40 }
    const r = ev(s, { type: 'PEMULIHAN', jenis: 'olahraga' })
    expect(r.events.some((e) => e.type === 'PEMULIHAN_SELESAI')).toBe(true)
    expect(r.state.burnout).toBe(31)
    expect(r.state.lapanganTerpakai).toBe(true)
    expect(r.state.flags['bonusStaminaBesok']).toBe(true)
    // Besok pagi: stamina dapat bonus +1 dan flag padam.
    let besok = r.state
    besok = run(besok, { type: 'LANJUTKAN' }) // siang→sore
    besok = bereskanIgd(run(besok, { type: 'LANJUTKAN' })) // sore→pagi
    expect(besok.stamina).toBe(7)
    expect(besok.flags['bonusStaminaBesok']).toBe(false)
  })

  it('di hari biasa PEMULIHAN ditolak', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = sampaiHari(s, 5)
    s = run(s, { type: 'LANJUTKAN' })
    expect(ev(s, { type: 'PEMULIHAN', jenis: 'istirahat' }).events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
  })

  it('silaturahmi menaikkan trust keluarga binaan yang arc-nya masih hidup', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = sampaiHari(s, 7)
    s = run(s, { type: 'LANJUTKAN' })
    // asih & lastri: karma D20/D44 — arc masih hidup di D7 (wulan sudah
    // meletus D6 → arcSelesai gagal → sengaja DIKECUALIKAN dari efek trust).
    s = {
      ...s,
      desa: { ...s.desa, binaan: ['keluarga_asih', 'keluarga_lastri', 'keluarga_wulan'] },
    }
    const asihSebelum = s.desa.keluarga['keluarga_asih']!.trust
    const wulanSebelum = s.desa.keluarga['keluarga_wulan']!.trust
    s = run(s, { type: 'PEMULIHAN', jenis: 'keluarga' })
    expect(s.desa.keluarga['keluarga_asih']!.trust).toBe(Math.min(10, asihSebelum + 1))
    expect(s.desa.keluarga['keluarga_lastri']!.trust).toBeGreaterThanOrEqual(3)
    expect(s.desa.keluarga['keluarga_wulan']!.trust).toBe(wulanSebelum) // arc gagal → tak tersentuh
  })

  it('burnout tinggi menaikkan porsi pasien auto-resolve yang bermasalah', () => {
    // Bandingkan agregat 60 hari sintetis: burnout 0 vs 100 dengan seed sama.
    let totalRendah = 0
    let totalTinggi = 0
    for (let seed = 0; seed < 30; seed++) {
      const dasar = buildInitialState('Uji', seed, PACK)
      const antrian = dasar.klinik.antrian
      if (antrian.length === 0) continue
      const rendah = run({ ...dasar, burnout: 0 }, { type: 'LANJUTKAN' })
      const tinggi = run({ ...dasar, burnout: 100 }, { type: 'LANJUTKAN' })
      totalRendah += rendah.klinik.autoHariIni.bermasalah
      totalTinggi += tinggi.klinik.autoHariIni.bermasalah
    }
    expect(totalTinggi).toBeGreaterThan(totalRendah)
  })
})
