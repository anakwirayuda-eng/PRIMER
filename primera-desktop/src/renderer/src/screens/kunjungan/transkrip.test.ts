/**
 * TEST — rekonstruksiTranskrip: kontrak inti = SETARA dgn engine.
 * Test silang menjalankan aksiKunjungan sungguhan (PILIH_DIALOG beruntun),
 * mengumpulkan event WARGA_BICARA, lalu membandingkannya dgn rekonstruksi
 * dari state akhir — bila aturan gerbang kejujuran engine berubah, test ini
 * merah, bukan drift senyap antara engine dan tampilan.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { aksiKunjungan, buatKunjungan, skenarioEfektif } from '@engine/kunjungan'
import { Rng } from '@engine/core/rng'
import type { KeluargaState, KunjunganState } from '@engine/state'
import { rekonstruksiTranskrip } from './transkrip'

/** Skenario nyata pertama yang punya pilihan ber-`ungkap` (gerbang kejujuran). */
function skenarioDenganUngkap() {
  for (const kel of Object.values(PACK.keluarga)) {
    for (const sk of kel.arc.kunjungan) {
      if (sk.dialog.some((node) => node.pilihan.some((p) => p.ungkap))) {
        return { keluargaId: kel.id, skenario: sk }
      }
    }
  }
  throw new Error('fixture: tidak ada skenario ber-ungkap di PACK')
}

type ModePilih = 'pertama' | 'terakhir'

/** Jalankan wawancara via engine; kumpulkan ucapan warga dari event. */
function simulasiWawancara(trust: number, mode: ModePilih) {
  const { keluargaId, skenario } = skenarioDenganUngkap()
  const kel = { trust } as unknown as KeluargaState
  let kj: KunjunganState = { ...buatKunjungan(keluargaId, skenario, new Rng(1, 'uji-transkrip')), fase: 'wawancara' }
  const efektif = skenarioEfektif(skenario, kj.varianId)

  const ucapanEngine: string[] = []
  for (let i = 0; i < efektif.dialog.length; i++) {
    if (kj.fase !== 'wawancara') break // diusir — wawancara berhenti lebih awal
    const node = efektif.dialog[kj.dialogIndex]
    if (!node) break
    // Hindari pilihan tergembok hotspot (simulasi tanpa babak observasi).
    const kandidat = node.pilihan.filter((p) => !p.butuhHotspot?.length)
    const daftar = kandidat.length > 0 ? kandidat : node.pilihan
    const pilihan = mode === 'pertama' ? daftar[0]! : daftar[daftar.length - 1]!
    const hasil = aksiKunjungan(kj, { type: 'PILIH_DIALOG', pilihanId: pilihan.id }, efektif, kel)
    kj = hasil.kj
    for (const e of hasil.events) {
      if (e.type === 'WARGA_BICARA') ucapanEngine.push(e.teks)
    }
  }
  return { kj, ucapanEngine, efektif, trust }
}

describe('rekonstruksiTranskrip — setara engine (cross-check aksiKunjungan)', () => {
  it.each([0, 3, 7, 10])('trust keluarga %i: ucapan warga rekonstruksi == event engine', (trust) => {
    const { kj, ucapanEngine, efektif } = simulasiWawancara(trust, 'pertama')
    expect(ucapanEngine.length).toBeGreaterThan(0) // fixture benar-benar bicara

    const transkrip = rekonstruksiTranskrip(efektif, kj.pilihanDiambil, trust, kj.trustDelta)
    const ucapanRekon = transkrip.filter((u) => u.peran === 'warga').map((u) => u.teks)
    expect(ucapanRekon).toEqual(ucapanEngine)

    // Sisi dokter: satu ucapan per pilihan tercatat, teks apa adanya.
    expect(transkrip.filter((u) => u.peran === 'dokter')).toHaveLength(kj.pilihanDiambil.length)
  })

  it('jalur pilihan berbeda (index terakhir tiap node) juga setara', () => {
    const { kj, ucapanEngine, efektif, trust } = simulasiWawancara(5, 'terakhir')
    const ucapanRekon = rekonstruksiTranskrip(efektif, kj.pilihanDiambil, trust, kj.trustDelta)
      .filter((u) => u.peran === 'warga')
      .map((u) => u.teks)
    expect(ucapanRekon).toEqual(ucapanEngine)
  })

  it('id pilihan tak dikenal (konten berubah) dilewati tanpa crash', () => {
    const { skenario } = skenarioDenganUngkap()
    const efektif = skenarioEfektif(skenario, undefined)
    expect(rekonstruksiTranskrip(efektif, ['tidak-ada-id'], 5, 0)).toEqual([])
  })
})
