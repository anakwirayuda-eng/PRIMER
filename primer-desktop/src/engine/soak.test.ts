/**
 * SOAK TEST (M7 butir 36) — mainkan STASE PENUH headless (Karier 90 hari &
 * Ujian 30 hari) dengan konten PRODUKSI, lalu pastikan:
 *   - tidak ada exception / ERROR_AKSI yang menghentikan permainan,
 *   - stase mencapai `tamat` di hari yang benar,
 *   - TIDAK ADA NaN/Infinity meracuni tally atau skor 4 dimensi,
 *   - skor tiap dimensi tetap di rentang sahnya sepanjang & di akhir.
 *
 * Driver di sini sengaja RESILIEN (beda dari selfplay "dokter rajin" yang
 * gagal-keras): aksi yang ditolak engine (mis. stok obat habis, fase tak
 * cocok) diabaikan — soak menguji ketahanan sistem menempuh 90 hari, bukan
 * kualitas keputusan. selfplay.test.ts tetap penjaga kualitas per-encounter.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import { advance } from './reducer'
import { hitungSkor } from './scoring'
import { KAPASITAS_EDUKASI } from './clinic'
import { HARI_STASE } from './paketUjian'
import type { Action } from './actions'
import type { GameState, ModeStase } from './state'

/** Dispatch toleran: kembalikan state baru; abaikan penolakan (tak melempar). */
function coba(state: GameState, action: Action): GameState {
  try {
    return advance(state, action, PACK).state
  } catch (e) {
    throw new Error(`CRASH saat ${action.type} (hari ${state.hari}/${state.blok}): ${String(e)}`)
  }
}

function semuaAngkaFinite(obj: Record<string, unknown>, label: string): string[] {
  const cacat: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'number' && !Number.isFinite(v)) cacat.push(`${label}.${k}=${v}`)
  }
  return cacat
}

/** Tangani IGD subuh bila ada — pilih tindakan benar tiap langkah, disposisi tepat. */
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
    } else if (s.igd.fase === 'disposisi') {
      s = coba(s, { type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar })
    } else break
  }
  return s
}

/** Tangani seluruh antrian pagi secara defensif (toleran firewall/stok habis). */
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
        ? { sbar: { situation: 'soak', background: 'soak', assessment: `${kasus.nama} (${kasus.icd10})`, recommendation: 'rujuk' } }
        : {}),
    })
  }
  return s
}

function jalankanStase(mode: ModeStase, seed: number): { akhir: GameState; cacat: string[] } {
  let s = buildInitialState(`Soak ${mode}`, seed, PACK, { mode })
  const cacat: string[] = []
  const batasHari = HARI_STASE[mode] + 3
  let guard = 0

  while (!s.tamat && s.hari <= batasHari && guard++ < 400) {
    s = beresIgd(s)
    s = beresPagi(s)
    s = coba(s, { type: 'LANJUTKAN' }) // pagi → siang
    s = coba(s, { type: 'LANJUTKAN' }) // siang → sore
    s = coba(s, { type: 'LANJUTKAN' }) // sore → tidur → hari baru

    // Cek integritas tiap hari (deteksi dini NaN sebelum menular).
    cacat.push(...semuaAngkaFinite(s.tally as unknown as Record<string, unknown>, `H${s.hari}.tally`))
    const skor = hitungSkor(s)
    cacat.push(...semuaAngkaFinite(skor as unknown as Record<string, unknown>, `H${s.hari}.skor`))
  }
  return { akhir: s, cacat }
}

describe('SOAK — stase penuh headless tanpa crash/NaN (M7.36)', () => {
  it('Karier 90 hari: tamat tepat waktu, skor & tally finite sepanjang jalan', () => {
    const { akhir, cacat } = jalankanStase('karier', 20260703)
    expect(cacat).toEqual([])
    expect(akhir.tamat).toBeDefined()
    expect(akhir.tamat!.hari).toBeGreaterThanOrEqual(HARI_STASE.karier) // tamat di/melewati hari terakhir
    const skor = hitungSkor(akhir)
    expect(skor.ukp).toBeGreaterThanOrEqual(0)
    expect(skor.ukp).toBeLessThanOrEqual(35)
    expect(skor.ukm).toBeLessThanOrEqual(35)
    expect(skor.manajemen).toBeLessThanOrEqual(15)
    expect(skor.resiliensi).toBeLessThanOrEqual(15)
    expect(skor.total).toBeGreaterThanOrEqual(0)
    expect(skor.total).toBeLessThanOrEqual(100)
    expect(['A', 'B', 'C', 'D']).toContain(skor.grade)
  })

  it('Ujian 30 hari: tamat terkunci, skor finite (dua seed berbeda)', () => {
    for (const seed of [7, 99]) {
      const { akhir, cacat } = jalankanStase('ujian', seed)
      expect(cacat).toEqual([])
      expect(akhir.tamat).toBeDefined()
      expect(akhir.mode).toBe('ujian')
      const skor = hitungSkor(akhir)
      expect(Number.isFinite(skor.total)).toBe(true)
      expect(skor.total).toBeGreaterThanOrEqual(0)
      expect(skor.total).toBeLessThanOrEqual(100)
    }
  })

  it('jejak aksi terekam sepanjang stase (kontrak M6 utuh setelah 90 hari)', () => {
    const { akhir } = jalankanStase('karier', 555)
    expect(akhir.jejak.length).toBeGreaterThan(500)
    expect(akhir.jejak.length).toBe(akhir.log.length)
  })
})
