/**
 * TEST — acakUrutan (DeepThink ronde-2 bonus, keputusan user: pertahanan
 * thd walkthrough mekanis). Kunci klaim yang harus benar: (a) urutan BEDA
 * antar seed (mahasiswa) berbeda; (b) urutan SAMA & stabil utk seed yang
 * SAMA (reproducible, bukan acak-tiap-panggil); (c) isi (bukan cuma
 * urutan) tetap identik — tak ada item hilang/berubah.
 */
import { describe, expect, it } from 'vitest'
import { acakUrutan } from './acakUrutan'

interface Pilihan {
  id: string
  label: string
}

const PILIHAN: Pilihan[] = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' },
  { id: 'c', label: 'C' },
  { id: 'd', label: 'D' },
]

describe('acakUrutan', () => {
  it('seed berbeda (mahasiswa berbeda) → urutan tampil berbeda utk konteks SAMA', () => {
    let adaBeda = false
    const acuan = acakUrutan(PILIHAN, 1, 'langkah_1')
    for (let seed = 2; seed < 30; seed++) {
      const lain = acakUrutan(PILIHAN, seed, 'langkah_1')
      if (lain.map((p) => p.id).join(',') !== acuan.map((p) => p.id).join(',')) {
        adaBeda = true
        break
      }
    }
    expect(adaBeda).toBe(true) // walkthrough "klik posisi ke-2" TIDAK seragam lintas-siswa
  })

  it('seed & konteks SAMA → urutan identik & stabil tiap dipanggil (bukan acak-tiap-render)', () => {
    const a = acakUrutan(PILIHAN, 42, 'langkah_1')
    const b = acakUrutan(PILIHAN, 42, 'langkah_1')
    expect(a.map((p) => p.id)).toEqual(b.map((p) => p.id))
  })

  it('konteks (langkahId/kartuId) BEDA di seed SAMA → urutan independen per pertanyaan', () => {
    // Bukan cuma satu rotasi tetap yang berlaku ke SEMUA pertanyaan siswa itu
    // (yang sendirinya jadi pola tebak-tebakan baru) — tiap konteks diacak sendiri.
    let adaBeda = false
    for (let i = 0; i < 20; i++) {
      const langkahA = acakUrutan(PILIHAN, 7, `langkah_${i}`)
      const langkahB = acakUrutan(PILIHAN, 7, `langkah_${i}_lain`)
      if (langkahA.map((p) => p.id).join(',') !== langkahB.map((p) => p.id).join(',')) {
        adaBeda = true
        break
      }
    }
    expect(adaBeda).toBe(true)
  })

  it('isi tetap identik (himpunan sama) — cuma urutan yang berubah, tak ada item hilang/dobel', () => {
    const hasil = acakUrutan(PILIHAN, 99, 'x')
    expect(hasil).toHaveLength(PILIHAN.length)
    expect([...hasil].sort((x, y) => x.id.localeCompare(y.id))).toEqual(
      [...PILIHAN].sort((x, y) => x.id.localeCompare(y.id)),
    )
  })

  it('tidak memutasi array asli', () => {
    const salinan = [...PILIHAN]
    acakUrutan(PILIHAN, 5, 'y')
    expect(PILIHAN).toEqual(salinan)
  })
})
