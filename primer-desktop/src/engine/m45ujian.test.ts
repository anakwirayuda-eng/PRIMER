/**
 * M4.5 — Mode Ujian 30 hari: pemisahan seed kurikulum vs flavor, rotasi paket,
 * kunci skor akhir stase, migrasi save. Kontrak: docs/M45_MODE_UJIAN.md.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState } from './state'
import type { Action } from './actions'
import { advance } from './reducer'
import { buildInitialState } from './init'
import { serialize, deserialize } from './save'
import { PAKET_UJIAN, pilihPaket, HARI_STASE } from './paketUjian'

function run(s: GameState, a: Action): GameState {
  return advance(s, a, PACK).state
}

/** IGD-safe day-skipper (pola m1bridge). */
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
  while (s.hari < target && !s.tamat) {
    s = bereskanIgd(s)
    s = run(s, { type: 'LANJUTKAN' })
  }
  return bereskanIgd(s)
}

// Dua seed flavor beda yang jatuh di PAKET SAMA (selisih kelipatan 8).
const SEED_A = 8
const SEED_B = 16
// Seed di paket LAIN.
const SEED_C = 11

describe('M4.5 — paket & pemisahan seed', () => {
  it('pool paket ≥8 dan pilihPaket terdistribusi deterministik', () => {
    expect(PAKET_UJIAN.length).toBeGreaterThanOrEqual(8)
    expect(pilihPaket(SEED_A).id).toBe(pilihPaket(SEED_B).id)
    expect(pilihPaket(SEED_A).id).not.toBe(pilihPaket(SEED_C).id)
  })

  it('mode karier (default): seedKurikulum = seed, tanpa paket', () => {
    const s = buildInitialState('Uji', 12345, PACK)
    expect(s.mode).toBe('karier')
    expect(s.seedKurikulum).toBe(12345)
    expect(s.paketUjian).toBeUndefined()
  })

  it('satu paket = KASUS sama, WAJAH pasien beda (dua mahasiswa, hari 1)', () => {
    const a = buildInitialState('Mahasiswa A', SEED_A, PACK, { mode: 'ujian' })
    const b = buildInitialState('Mahasiswa B', SEED_B, PACK, { mode: 'ujian' })
    expect(a.paketUjian).toBe(b.paketUjian)
    expect(a.seedKurikulum).toBe(b.seedKurikulum)
    expect(a.seed).not.toBe(b.seed)
    // Kurikulum identik: urutan kasus hari 1 sama persis.
    expect(a.klinik.antrian.map((p) => p.kasusId)).toEqual(b.klinik.antrian.map((p) => p.kasusId))
    // Flavor berbeda: identitas pasien tidak bisa dijadikan kunci jawaban.
    const wajahA = a.klinik.antrian.map((p) => `${p.nama}|${p.usia}|${p.rw}`).join(';')
    const wajahB = b.klinik.antrian.map((p) => `${p.nama}|${p.usia}|${p.rw}`).join(';')
    expect(wajahA).not.toBe(wajahB)
  })

  it('paket beda = kurikulum beda (hari 1 sudah menyimpang)', () => {
    const a = buildInitialState('Mahasiswa A', SEED_A, PACK, { mode: 'ujian' })
    const c = buildInitialState('Mahasiswa C', SEED_C, PACK, { mode: 'ujian' })
    expect(a.paketUjian).not.toBe(c.paketUjian)
    expect(a.klinik.antrian.map((p) => p.kasusId)).not.toEqual(c.klinik.antrian.map((p) => p.kasusId))
  })

  it('pola kedatangan IGD identik per paket bila dimainkan identik (10 hari)', () => {
    const hariIgd = (seed: number): string => {
      let s = buildInitialState('Uji', seed, PACK, { mode: 'ujian' })
      s = sampaiHari(s, 10)
      return Object.keys(s.flags).filter((k) => k.startsWith('igdHari_')).sort().join(',')
    }
    expect(hariIgd(SEED_A)).toBe(hariIgd(SEED_B))
  })
})

describe('M4.5 — akhir stase & kunci skor', () => {
  it('ujian: melewati D30 mengunci — tamat + surat skor + LANJUTKAN ditolak', () => {
    let s = buildInitialState('Uji', SEED_A, PACK, { mode: 'ujian' })
    s = { ...s, hari: HARI_STASE.ujian, blok: 'sore', igd: undefined, layar: 'meja' }
    const r = advance(s, { type: 'LANJUTKAN' }, PACK)
    expect(r.state.tamat).toBeDefined()
    expect(r.state.tamat!.hari).toBe(HARI_STASE.ujian)
    expect(r.events.some((e) => e.type === 'TAMAT')).toBe(true)
    expect(r.state.inbox.some((m) => m.judul.includes('STASE UJIAN SELESAI'))).toBe(true)
    expect(r.state.klinik.antrian).toHaveLength(0)
    // Skor terkunci: hari tidak bisa berjalan lagi.
    const r2 = advance(r.state, { type: 'LANJUTKAN' }, PACK)
    expect(r2.events.some((e) => e.type === 'ERROR_AKSI' && e.pesan.includes('terkunci'))).toBe(true)
    expect(r2.state.hari).toBe(HARI_STASE.ujian)
  })

  it('karier: kunci yang sama berlaku di D90', () => {
    let s = buildInitialState('Uji', 777, PACK)
    s = { ...s, hari: HARI_STASE.karier, blok: 'sore', igd: undefined }
    const r = advance(s, { type: 'LANJUTKAN' }, PACK)
    expect(r.state.tamat?.hari).toBe(HARI_STASE.karier)
    expect(r.state.inbox.some((m) => m.judul.includes('Sembilan puluh hari'))).toBe(true)
  })

  it('sebelum hari terakhir, LANJUTKAN tetap mengalir normal', () => {
    let s = buildInitialState('Uji', SEED_A, PACK, { mode: 'ujian' })
    s = sampaiHari(s, 3)
    expect(s.tamat).toBeUndefined()
    expect(s.hari).toBe(3)
  })
})

describe('M4.5 — save & migrasi', () => {
  it('roundtrip mempertahankan mode/seedKurikulum/paketUjian', () => {
    const s = buildInitialState('Uji', SEED_A, PACK, { mode: 'ujian' })
    const hasil = deserialize(serialize(s), PACK)
    expect(hasil?.mode).toBe('ujian')
    expect(hasil?.seedKurikulum).toBe(s.seedKurikulum)
    expect(hasil?.paketUjian).toBe(s.paketUjian)
  })

  it('save lama (tanpa mode) termigrasi ke karier dgn seedKurikulum = seed', () => {
    const s = buildInitialState('Uji', 555, PACK)
    const mentah = JSON.parse(serialize(s)) as { v: number; state: Record<string, unknown> }
    delete mentah.state['mode']
    delete mentah.state['seedKurikulum']
    const hasil = deserialize(JSON.stringify(mentah), PACK)
    expect(hasil?.mode).toBe('karier')
    expect(hasil?.seedKurikulum).toBe(555)
  })
})
