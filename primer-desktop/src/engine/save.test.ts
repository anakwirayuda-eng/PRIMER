/**
 * TEST SAVE — deserialize defensif (CODEX audit 2026-07-04, ronde-8).
 * Probe: save/import yang separuh rusak (nested field bentuknya salah, bukan
 * cuma level-atas) tidak boleh throw atau meracuni ekonomi jadi NaN, dan
 * pasien klinik aktif yang kasusnya sudah hilang tidak boleh soft-lock.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState } from './state'
import { buildInitialState } from './init'
import { serialize, deserialize } from './save'
import { advance } from './reducer'
import { buatEncounter } from './clinic'
import { buatPasienDariKasus } from './director'
import { Rng } from './core/rng'

const SEED = 777

/** Bongkar-pasang JSON save utk menyuntik korupsi pada field tertentu. */
function rusak(json: string, ubah: (state: Record<string, unknown>) => void): string {
  const amplop = JSON.parse(json) as { v: number; state: Record<string, unknown> }
  ubah(amplop.state)
  return JSON.stringify(amplop)
}

describe('deserialize — sanitasi gudang/keuanganBulan (temuan #1)', () => {
  it('gudang = {} (objek valid tanpa field stok) tidak throw, dipulihkan ke bentuk aman', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['gudang'] = {}
    })
    let hasil: ReturnType<typeof deserialize>
    expect(() => {
      hasil = deserialize(json, PACK)
    }).not.toThrow()
    expect(hasil!).not.toBeNull()
    expect(hasil!.gudang.stok).toEqual(expect.any(Object))
    expect(hasil!.gudang.pesanan).toEqual([])
  })

  it('gudang.stok[id] bukan angka (mis. string) dibuang, bukan meracuni jadi NaN', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const obatId = Object.keys(PACK.obat)[0]!
    const json = rusak(serialize(s), (st) => {
      const gudang = st['gudang'] as { stok: Record<string, unknown> }
      gudang.stok[obatId] = 'banyak'
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.gudang.stok[obatId]).toBeUndefined() // dibuang, bukan "banyak"

    // Prescribing obat ini setelahnya TIDAK meracuni skorTerapi/kapitasi jadi NaN
    // (entri hilang = "tak dilacak", gerbang stok lolos — perilaku yang sudah ada).
    let cur: GameState = { ...hasil, klinik: { ...hasil.klinik, aktif: undefined } }
    cur = advance(cur, { type: 'PANGGIL_PASIEN' }, PACK).state
    if (cur.klinik.aktif) {
      const r = advance(cur, { type: 'TAMBAH_OBAT', obatId }, PACK)
      expect(Number.isFinite(r.state.kapitasi)).toBe(true)
    }
  })

  it('keuanganBulan = {} (tanpa field) tidak membuat belanjaObat jadi NaN', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['keuanganBulan'] = {}
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.keuanganBulan.belanjaObat).toBe(0)
    expect(hasil.keuanganBulan.belanjaPengadaan).toBe(0)
  })

  it('gudang.pesanan berisi entri cacat (bukan objek/field hilang) difilter, tidak throw', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      const gudang = st['gudang'] as { pesanan: unknown[] }
      gudang.pesanan = [null, 'rusak', { obatId: 'x' }, { obatId: 'y', jumlah: 20, tibaHari: 5 }]
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.gudang.pesanan).toHaveLength(1)
    expect(hasil.gudang.pesanan[0]?.obatId).toBe('y')
  })
})

describe('deserialize — pemulihan pasien klinik tak dikenal (temuan #2)', () => {
  it('klinik.aktif dengan kasusId yang sudah tak ada di pack dipulihkan, bukan soft-lock', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    const pasien = buatPasienDariKasus(Object.keys(PACK.kasus)[0]!, PACK, new Rng(1, 'save-test'))
    const encAsli = buatEncounter(pasien)
    s = { ...s, klinik: { ...s.klinik, aktif: { ...encAsli, pasien: { ...pasien, kasusId: 'kasus_hantu_sudah_dihapus' } } } }

    const json = serialize(s)
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.klinik.aktif).toBeUndefined()
    expect(hasil.inbox.some((m) => m.judul.includes('dipulihkan otomatis'))).toBe(true)

    // Konfirmasi: sebelum fix, setiap aksi lanjutan (termasuk LANJUTKAN) akan
    // menolak selamanya karena klinik.aktif tak pernah kosong. Sesudah fix,
    // pemain bisa lanjut hari & panggil pasien baru seperti biasa.
    const setelahLanjut = advance(hasil, { type: 'LANJUTKAN' }, PACK)
    expect(setelahLanjut.events.some((e) => e.type === 'ERROR_AKSI')).toBe(false)
  })

  it('klinik.aktif dengan kasusId yang MASIH ada di pack tidak disentuh', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = advance(s, { type: 'PANGGIL_PASIEN' }, PACK).state
    const kasusIdAsli = s.klinik.aktif!.pasien.kasusId

    const json = serialize(s)
    const hasil = deserialize(json, PACK)!
    expect(hasil.klinik.aktif).toBeDefined()
    expect(hasil.klinik.aktif!.pasien.kasusId).toBe(kasusIdAsli)
    expect(hasil.inbox.some((m) => m.judul.includes('dipulihkan otomatis'))).toBe(false)
  })
})
