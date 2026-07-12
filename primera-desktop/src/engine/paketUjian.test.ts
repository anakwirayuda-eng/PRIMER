/**
 * PAKET UJIAN — kesetaraan lintas 8 paket kurikulum (M4.5).
 *
 * CODEX audit pasca-GM (2026-07-13, temuan #10-package-equivalence): dossier
 * verifikasi (result_13.txt) menemukan bahwa "8 paket kurikulum identik/adil"
 * adalah KLAIM (docs/M45_MODE_UJIAN.md §3b: "bobot kasus identik per paket")
 * yang TAK PERNAH diuji empiris — pool `PAKET_UJIAN` (paketUjian.ts) hanya
 * diverifikasi utk PASANGAN seed yang jatuh di paket SAMA (m45ujian.test.ts),
 * tak pernah membandingkan SELURUH 8 paket satu sama lain. Karena setiap
 * paket seed-nya independen (`Math.abs(seedFlavor) % 8`), tak ada jaminan
 * bawaan bahwa `susunAntrianHarian`'s weighted-draw (bobot kategori/4A-pity-
 * timer/kluster) menghasilkan kurikulum yang setara lintas 8 seed berbeda itu.
 *
 * Tes ini memainkan 1 stase Ujian PENUH (30 hari, bot resilien pola soak.test.ts)
 * per paket, lalu membandingkan 3 metrik kurikulum lintas 8 paket: total
 * encounter, rasio paparan rujukan, & cakupan kategori kasus — dalam rentang
 * toleransi (bukan identik persis; itu bukan janji desain), sbg PAGAR regresi:
 * bila perubahan bobot/kurikulum di masa depan membuat satu paket jomplang
 * dari yang lain, tes ini merah.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import { advance } from './reducer'
import { KAPASITAS_EDUKASI } from './clinic'
import { PAKET_UJIAN, HARI_STASE } from './paketUjian'
import type { Action } from './actions'
import type { GameState } from './state'

/** Dispatch toleran: penolakan engine (stok habis, dst.) diabaikan, bukan throw. */
function coba(state: GameState, action: Action): GameState {
  return advance(state, action, PACK).state
}

function beresIgd(state: GameState): GameState {
  let s = state
  let guard = 0
  while (s.igd && guard++ < 40) {
    const kasus = PACK.kasusIgd[s.igd.kasusId]
    if (!kasus) break
    if (s.igd.fase === 'langkah') {
      const langkah = kasus.langkah[s.igd.langkahIndex]
      if (!langkah) break
      const benar = langkah.pilihan.find((p) => p.benar) ?? langkah.pilihan[0]!
      s = coba(s, { type: 'AKSI_IGD', langkahId: langkah.id, pilihanId: benar.id })
    } else if (s.igd.fase === 'kode_biru') {
      s = coba(s, { type: 'RJP_IGD', berkualitas: true })
    } else if (s.igd.fase === 'pasca_rosc') {
      s = coba(s, { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' })
    } else if (s.igd.fase === 'disposisi') {
      s = coba(s, { type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar })
    } else break
  }
  return s
}

function beresPagi(state: GameState): GameState {
  let s = state
  let guard = 0
  while (s.klinik.antrian.length > 0 && guard++ < 20) {
    s = coba(s, { type: 'PANGGIL_PASIEN' })
    const enc = s.klinik.aktif
    if (!enc) break
    const kasus = PACK.kasus[enc.pasien.kasusId]
    if (!kasus) {
      s = coba(s, { type: 'DISPOSISI', jenis: 'pulang' })
      continue
    }
    for (const q of kasus.anamnesis) {
      if (q.distraktor !== true) s = coba(s, { type: 'TANYA', pertanyaanId: q.id })
    }
    s = coba(s, { type: 'LANJUT_FASE' })
    s = coba(s, { type: 'UKUR_VITAL' })
    for (const t of kasus.pemeriksaanFisik) if (t.relevan) s = coba(s, { type: 'PERIKSA', region: t.region })
    s = coba(s, { type: 'LANJUT_FASE' })
    s = coba(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' })
    for (const obatId of kasus.tatalaksana.obatBenar) s = coba(s, { type: 'TAMBAH_OBAT', obatId })
    for (const edukasiId of kasus.tatalaksana.edukasi.slice(0, KAPASITAS_EDUKASI)) {
      s = coba(s, { type: 'TAMBAH_EDUKASI', edukasiId })
    }
    s = coba(s, { type: 'LANJUT_FASE' })
    s = coba(s, {
      type: 'DISPOSISI',
      jenis: kasus.harusDirujuk ? 'rujuk' : 'pulang',
      ...(kasus.harusDirujuk
        ? { sbar: { situation: 'tes', background: 'tes', assessment: `${kasus.nama} (${kasus.icd10})`, recommendation: 'rujuk' } }
        : {}),
    })
  }
  return s
}

interface MetrikKurikulum {
  paketId: string
  totalPasien: number
  rasioRujukan: number
  cakupanKategori: number
}

function mainkanStaseUjian(seedFlavor: number): MetrikKurikulum {
  let s = buildInitialState('Uji', seedFlavor, PACK, { mode: 'ujian' })
  const paketId = s.paketUjian!
  const batasHari = HARI_STASE.ujian + 3
  let guard = 0
  while (!s.tamat && s.hari <= batasHari && guard++ < 200) {
    s = beresIgd(s)
    s = beresPagi(s)
    s = coba(s, { type: 'LANJUTKAN' })
    s = coba(s, { type: 'LANJUTKAN' })
    s = coba(s, { type: 'LANJUTKAN' })
  }
  const kategoriTersentuh = new Set<string>()
  for (const id of Object.keys(s.dex)) {
    const kat = PACK.kasus[id]?.kategori
    if (kat) kategoriTersentuh.add(kat)
  }
  return {
    paketId,
    totalPasien: s.tally.totalPasien,
    rasioRujukan: s.tally.totalPasien > 0 ? s.tally.rujukanTotal / s.tally.totalPasien : 0,
    cakupanKategori: kategoriTersentuh.size,
  }
}

/** Satu seed flavor per paket — `Math.abs(seedFlavor) % 8` kontiguous 0..7. */
const SEED_PER_PAKET = Array.from({ length: PAKET_UJIAN.length }, (_, i) => 1000 + i)

describe('CODEX #10-package-equivalence (pasca-GM 2026-07-13): 8 paket kurikulum Ujian setara dlm toleransi', () => {
  it('tiap seed jatuh ke paket BERBEDA (fixture tes ini genuinely menyentuh seluruh 8 paket)', () => {
    const metrik = SEED_PER_PAKET.map(mainkanStaseUjian)
    const idUnik = new Set(metrik.map((m) => m.paketId))
    expect(idUnik.size).toBe(PAKET_UJIAN.length)
  })

  it('total encounter, rasio paparan rujukan, & cakupan kategori tak jomplang lintas 8 paket', () => {
    const metrik = SEED_PER_PAKET.map(mainkanStaseUjian)

    const totalPasien = metrik.map((m) => m.totalPasien)
    const rasioRujukan = metrik.map((m) => m.rasioRujukan)
    const cakupanKategori = metrik.map((m) => m.cakupanKategori)

    const rentang = (arr: number[]): number => Math.max(...arr) - Math.min(...arr)
    const rerata = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length

    // Toleransi longgar (bukan janji "identik") — pagar regresi thd jomplang
    // KASAR (satu paket jauh lebih ringan/berat dari yang lain), bukan varians
    // kecil yang wajar dari weighted-draw stokastik per-seed.
    expect(rentang(totalPasien) / rerata(totalPasien)).toBeLessThan(0.25)
    expect(rentang(rasioRujukan)).toBeLessThan(0.15) // absolut, krn rasio bisa dekat 0
    expect(rentang(cakupanKategori) / rerata(cakupanKategori)).toBeLessThan(0.35)
  })
})
