/**
 * PAGAR — pengelompokan laci tindakan (DeckTerapi tab Tindakan, 2026-07-16).
 * Dinding chip datar 36 tindakan = overload kognitif (temuan playtest user);
 * kini laci kelompok. Test ini menjaga peta kelompok tetap sinkron dengan
 * katalog: tindakan baru yang belum dipetakan MERAH di sini (bukan menumpuk
 * diam-diam di laci "Lainnya"), dan pemetaan yatim ikut ketahuan.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { KELOMPOK_TINDAKAN_BY_ID, LABEL_KELOMPOK_TINDAKAN, URUTAN_KELOMPOK_TINDAKAN } from './util'

describe('Kelompok tindakan — sinkron dengan katalog PACK.tindakan', () => {
  it('setiap tindakan di katalog punya kelompok eksplisit (tidak jatuh ke Lainnya)', () => {
    const belumDipetakan = Object.keys(PACK.tindakan).filter(
      (id) => KELOMPOK_TINDAKAN_BY_ID[id] === undefined,
    )
    expect(belumDipetakan, 'tambahkan id ini ke KELOMPOK_TINDAKAN_BY_ID (util.ts)').toEqual([])
  })

  it('tidak ada pemetaan yatim (id yang sudah tak ada di katalog)', () => {
    const yatim = Object.keys(KELOMPOK_TINDAKAN_BY_ID).filter((id) => !PACK.tindakan[id])
    expect(yatim).toEqual([])
  })

  it('setiap kelompok terpetakan valid, berlabel, dan masuk urutan render', () => {
    const dikenal = new Set(URUTAN_KELOMPOK_TINDAKAN)
    for (const [id, kel] of Object.entries(KELOMPOK_TINDAKAN_BY_ID)) {
      expect(dikenal.has(kel), `${id}: kelompok '${kel}' tak ada di URUTAN_KELOMPOK_TINDAKAN`).toBe(true)
      expect(LABEL_KELOMPOK_TINDAKAN[kel], `${id}: kelompok '${kel}' tanpa label`).toBeTruthy()
    }
  })

  it('ukuran laci ramah kognisi: 3-8 item per kelompok terisi', () => {
    const hitung = new Map<string, number>()
    for (const id of Object.keys(PACK.tindakan)) {
      const kel = KELOMPOK_TINDAKAN_BY_ID[id] ?? 'lainnya'
      hitung.set(kel, (hitung.get(kel) ?? 0) + 1)
    }
    for (const [kel, n] of hitung) {
      expect(n, `kelompok '${kel}' berisi ${n} item — pecah/gabung supaya 3-8`).toBeGreaterThanOrEqual(3)
      expect(n, `kelompok '${kel}' berisi ${n} item — pecah/gabung supaya 3-8`).toBeLessThanOrEqual(8)
    }
  })
})
