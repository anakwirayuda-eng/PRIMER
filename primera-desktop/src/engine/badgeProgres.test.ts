/**
 * TEST — progresBadge (permukaan progres badge, 2026-08-01).
 * Invarian utama: pajangan progres TIDAK BOLEH menjanjikan badge yang tak
 * dihitung `hitungBadge`, dan sebaliknya badge yang diraih tak boleh tampil
 * seolah masih kurang. `hitungBadge` tetap satu-satunya sumber kebenaran.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import { hitungBadge, progresBadge, SEMUA_BADGE } from './badge'
import type { GameState } from './state'

const SEED = 4242

function state(ubah: (s: GameState) => GameState = (s) => s): GameState {
  return ubah(buildInitialState('Uji badge', SEED, PACK))
}

describe('progresBadge — konsistensi dgn hitungBadge', () => {
  it('mencakup SEMUA badge, tanpa ada yang tertinggal tanpa rincian progres', () => {
    const hasil = progresBadge(state())
    expect(hasil.map((b) => b.id).sort()).toEqual(SEMUA_BADGE.map((b) => b.id).sort())
    // Tiap entri wajib membawa angka progres yang terdefinisi (bukan undefined
    // diam-diam dari lookup rincian yang lupa diisi saat badge baru ditambah).
    for (const b of hasil) {
      expect(Number.isFinite(b.kini), `${b.id}.kini`).toBe(true)
      expect(Number.isFinite(b.target), `${b.id}.target`).toBe(true)
      expect(b.target, `${b.id}.target harus > 0`).toBeGreaterThan(0)
    }
  })

  it('raih SELALU mengikuti hitungBadge, bukan dihitung ulang sendiri', () => {
    const kaya = state((s) => ({
      ...s,
      hari: 45,
      tally: { ...s.tally, karmaDicegah: 6, kunjunganTotal: 20, apathy: 0, teguranDinkes: 0 },
    }))
    const diraih = new Set(hitungBadge(kaya))
    for (const b of progresBadge(kaya)) {
      expect(b.raih, `${b.id}`).toBe(diraih.has(b.id))
    }
  })

  it('badge yang DIRAIH tak pernah tampil sbg gagal maupun kurang dari target', () => {
    const kaya = state((s) => ({
      ...s,
      hari: 45,
      tally: { ...s.tally, karmaDicegah: 6, kunjunganTotal: 20, apathy: 0, teguranDinkes: 0 },
    }))
    for (const b of progresBadge(kaya).filter((x) => x.raih)) {
      expect(b.gagal, `${b.id} diraih tapi ditandai gagal`).toBeUndefined()
      expect(b.kini, `${b.id} diraih tapi kini<target`).toBeGreaterThanOrEqual(b.target)
    }
  })
})

describe('progresBadge — syarat "tanpa cacat" yang sudah tercoreng ditandai TERKUNCI', () => {
  it('satu Kode Hitam mengunci nol_kode_hitam walau jumlah pasien IGD sudah cukup', () => {
    const s = state((st) => ({
      ...st,
      tally: { ...st.tally, igdStabil: 5, igdMeninggal: 1 },
    }))
    const b = progresBadge(s).find((x) => x.id === 'nol_kode_hitam')!
    expect(b.raih).toBe(false)
    expect(b.kini).toBeGreaterThanOrEqual(b.target) // hitungan utama sudah cukup…
    expect(b.gagal).toMatch(/Kode Hitam/) // …tapi terkunci, dan alasannya disebut
  })

  it('teguran Dinkes mengunci bendahara_rapi', () => {
    const s = state((st) => ({ ...st, hari: 60, tally: { ...st.tally, teguranDinkes: 2 } }))
    const b = progresBadge(s).find((x) => x.id === 'bendahara_rapi')!
    expect(b.raih).toBe(false)
    expect(b.gagal).toMatch(/teguran Dinkes/)
  })

  it('kunjungan kosong (apathy) mengunci anti_apatis', () => {
    const s = state((st) => ({
      ...st,
      tally: { ...st.tally, kunjunganTotal: 30, apathy: 3 },
    }))
    const b = progresBadge(s).find((x) => x.id === 'anti_apatis')!
    expect(b.raih).toBe(false)
    expect(b.gagal).toMatch(/kunjungan kosong/)
  })

  it('visitasi akreditasi yang sudah turun bukan-paripurna mengunci badge itu', () => {
    const s = state((st) => ({ ...st, akreditasi: 'madya' as const }))
    const b = progresBadge(s).find((x) => x.id === 'paripurna')!
    expect(b.raih).toBe(false)
    expect(b.gagal).toMatch(/MADYA/)
  })

  it('sebelum visitasi, paripurna BELUM terkunci — hanya tertahan menunggu visitasi', () => {
    const s = state()
    const b = progresBadge(s).find((x) => x.id === 'paripurna')!
    expect(b.gagal).toBeUndefined()
    expect(b.tertahan).toMatch(/visitasi/i)
  })
})

describe('progresBadge — tak mengulang vonis grade prematur (audit #23)', () => {
  it('Hari 1 tanpa aktivitas: TIDAK berbunyi "Grade berjalan D"', () => {
    const b = progresBadge(state()).find((x) => x.id === 'ptt_teladan')!
    expect(b.tertahan).toMatch(/belum ada aktivitas ternilai/i)
    expect(b.tertahan).not.toMatch(/Grade berjalan/)
  })

  it('begitu ada aktivitas ternilai, grade berjalan baru disebut apa adanya', () => {
    const s = state((st) => ({ ...st, tally: { ...st.tally, totalPasien: 3 } }))
    const b = progresBadge(s).find((x) => x.id === 'ptt_teladan')!
    expect(b.tertahan).toMatch(/Grade berjalan [ABCD]/)
  })
})

describe('progresBadge — syarat sekunder yang masih bisa diperbaiki = tertahan, BUKAN gagal', () => {
  it('RRNS buruk tidak mengunci gerbang_kokoh (rujukan benar berikutnya masih menurunkannya)', () => {
    const s = state((st) => ({
      ...st,
      tally: { ...st.tally, rujukanTotal: 6, rujukanNonSpesialistik: 3 },
    }))
    const b = progresBadge(s).find((x) => x.id === 'gerbang_kokoh')!
    expect(b.raih).toBe(false)
    expect(b.gagal).toBeUndefined() // masih bisa dikejar — bukan vonis mati
    expect(b.tertahan).toMatch(/RRNS berjalan 50%/)
  })

  it('tanpa rujukan sama sekali, RRNS 100% internal TIDAK ditampilkan sbg angka menakutkan', () => {
    const b = progresBadge(state()).find((x) => x.id === 'gerbang_kokoh')!
    expect(b.tertahan).toMatch(/Belum ada rujukan/)
    expect(b.tertahan).not.toMatch(/100%/)
  })
})
