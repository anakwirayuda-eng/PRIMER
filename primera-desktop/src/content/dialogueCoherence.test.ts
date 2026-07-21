import { describe, expect, it } from 'vitest'
import { PACK } from './index'

function jumlahKata(teks: string): number {
  return teks.match(/[\p{L}\p{N}][\p{L}\p{N}'’/-]*/gu)?.length ?? 0
}

const kunjungan = Object.values(PACK.keluarga).flatMap((keluarga) => keluarga.arc.kunjungan)
const pilihan = kunjungan.flatMap((item) => item.dialog).flatMap((node) => node.pilihan)

describe('koherensi percakapan klinik dan UKM', () => {
  it('anak kecil selalu memiliki pendamping eksplisit', () => {
    for (const kasus of Object.values(PACK.kasus)) {
      if (kasus.demografi.usiaMax >= 8) continue
      expect(kasus.keluhanUtamaOlehPendamping, kasus.id).toBe(true)
    }
  })

  it('prasyarat pilihan observasi menunjuk hotspot sah dan tidak mengunci satu node penuh', () => {
    for (const skenario of kunjungan) {
      const hotspot = new Set(skenario.hotspot.map((item) => item.id))
      for (const node of skenario.dialog) {
        for (const item of node.pilihan) {
          for (const hotspotId of item.butuhHotspot ?? []) {
            expect(hotspot.has(hotspotId), `${skenario.id}/${node.id}/${item.id} -> ${hotspotId}`).toBe(true)
          }
        }
        expect(
          node.pilihan.some((item) => (item.butuhHotspot?.length ?? 0) === 0),
          `${skenario.id}/${node.id}`,
        ).toBe(true)
      }
    }
  })

  it('narasi lanjutan tidak kosong dan hanya melekat pada pilihan yang punya node berikutnya', () => {
    for (const skenario of kunjungan) {
      skenario.dialog.forEach((node, index) => {
        for (const item of node.pilihan) {
          if (item.narasiLanjutan === undefined) continue
          expect(item.narasiLanjutan.trim().length, `${skenario.id}/${item.id}`).toBeGreaterThan(20)
          expect(index, `${skenario.id}/${item.id}`).toBeLessThan(skenario.dialog.length - 1)
        }
      })
    }
  })

  it('jawaban benar UKM tidak dapat ditebak hanya dari panjang atau label edukasi', () => {
    const tepat = pilihan.filter((item) => item.tepat)
    const keliru = pilihan.filter((item) => !item.tepat)
    const rerata = (items: typeof pilihan) =>
      items.reduce((total, item) => total + jumlahKata(item.teks), 0) / items.length

    expect(tepat.filter((item) => item.gaya === 'edukasi').length).toBeGreaterThanOrEqual(8)
    expect(Math.max(...tepat.map((item) => jumlahKata(item.teks)))).toBeLessThan(35)
    expect(Math.abs(rerata(tepat) - rerata(keliru))).toBeLessThanOrEqual(5)
  })
})
