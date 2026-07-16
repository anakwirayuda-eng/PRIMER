/**
 * PAGAR — pengelompokan laci formularium (DeckTerapi tab Resep, 2026-07-16).
 * Formularium tumbuh 69→130+ obat bersama ekspansi lab M13; daftar datar jadi
 * dinding "+ Resep" (overload kognitif — keluhan playtest user, kelas masalah
 * SAMA dgn dinding tindakan). Pemetaan HEURISTIK dari `Obat.kelas` (bukan
 * per-id spt tindakan) supaya obat baru otomatis kebagian laci — pagar di sini
 * menjaga heuristiknya tetap sehat saat katalog tumbuh.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { kelompokObat, LABEL_KELOMPOK_OBAT, URUTAN_KELOMPOK_OBAT } from './util'

describe('Kelompok obat — laci formularium sehat terhadap katalog PACK.obat', () => {
  it('setiap obat terpetakan ke kelompok yang dikenal urutan render + berlabel', () => {
    const dikenal = new Set(URUTAN_KELOMPOK_OBAT)
    for (const o of Object.values(PACK.obat)) {
      const kel = kelompokObat(o)
      expect(dikenal.has(kel), `${o.id}: kelompok '${kel}' tak ada di URUTAN_KELOMPOK_OBAT`).toBe(true)
      expect(LABEL_KELOMPOK_OBAT[kel], `kelompok '${kel}' tanpa label`).toBeTruthy()
    }
  })

  it('laci "Lain-lain" tetap kecil (heuristik kelas tak bolong): maks 10% katalog', () => {
    const semua = Object.values(PACK.obat)
    const lainnya = semua.filter((o) => kelompokObat(o) === 'lainnya')
    expect(
      lainnya.length,
      `heuristik ATURAN_KELOMPOK_OBAT bolong utk kelas: ${lainnya.map((o) => `${o.id}(${o.kelas})`).join(', ')}`,
    ).toBeLessThanOrEqual(Math.ceil(semua.length * 0.1))
  })

  it('tidak ada laci raksasa yang mengulang masalah dinding (maks 45% katalog per laci)', () => {
    const hitung = new Map<string, number>()
    for (const o of Object.values(PACK.obat)) {
      const kel = kelompokObat(o)
      hitung.set(kel, (hitung.get(kel) ?? 0) + 1)
    }
    const total = Object.keys(PACK.obat).length
    for (const [kel, n] of hitung) {
      expect(n, `laci '${kel}' berisi ${n}/${total} obat — pecah heuristiknya`).toBeLessThanOrEqual(
        Math.ceil(total * 0.45),
      )
    }
  })

  it('antibiotik sistemik selalu berlaci antiinfeksi (jaring flag antibiotik)', () => {
    for (const o of Object.values(PACK.obat)) {
      if (o.antibiotik !== true) continue
      const kel = kelompokObat(o)
      // Rute topikal boleh menang (pemain cari per organ) — selain itu wajib antiinfeksi.
      expect(
        kel === 'antiinfeksi' || kel === 'topikal_kulit' || kel === 'topikal_mata_tht',
        `${o.id} (${o.kelas}): antibiotik jatuh ke laci '${kel}'`,
      ).toBe(true)
    }
  })
})
