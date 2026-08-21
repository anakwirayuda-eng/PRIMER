/**
 * KEGIATAN — kartu Prolanis: respons yang dibaca pemain harus menjanjikan
 * persis mekanik yang dijalankan engine, tidak lebih.
 */

import { describe, expect, it } from 'vitest'
import { Rng } from './core/rng'
import { driftProlanis, kartuProlanis, prolanisTerkendali } from './kegiatan'
import type { PesertaProlanis } from './state'

function pesertaHt(override: Partial<PesertaProlanis> = {}): PesertaProlanis {
  return {
    id: 'ht_sumarni',
    nama: 'Bu Sumarni',
    usia: 58,
    jenisKelamin: 'P',
    rw: 2,
    jenis: 'ht',
    param: 165,
    takTerkontrolBerturut: 1,
    ...override,
  }
}

describe('kartu Prolanis HT tak terkendali — opsi rujuk dini', () => {
  const kartu = kartuProlanis([pesertaHt()], new Rng(7, 'prolanis'))[0]!
  const rujukDini = kartu.pilihan.find((p) => p.id === 'c')!

  it('tidak menjanjikan mekanik encounter klinik yang tak berlaku di sesi Prolanis', () => {
    expect(rujukDini.benar).toBe(false)
    // RRNS hanya diisi tally rujukan klinik; cap grade hanya ada pada encounter
    // klinik — sesi Prolanis tak menyentuh keduanya.
    expect(rujukDini.respons).not.toMatch(/RRNS/i)
    expect(rujukDini.respons).not.toMatch(/mengunci nilai|encounter/i)
  })

  it('konsekuensi yang dijanjikannya memang terjadi: peserta tetap tak terkendali', () => {
    expect(rujukDini.respons).toMatch(/tak terkendali/i)
    const sesudah = driftProlanis(pesertaHt(), rujukDini.benar, new Rng(7, 'drift'))
    expect(sesudah.param).toBeGreaterThan(165)
    expect(prolanisTerkendali('ht', sesudah.param)).toBe(false)
    expect(sesudah.takTerkontrolBerturut).toBe(2)
  })
})

describe('Keputusan #8 (adjudikasi-delegasi 2026-08-21) — arah drift overtreatment', () => {
  it('HT TERKENDALI + intervensi salah (overtreatment) → param TURUN, kartunya sendiri memperingatkan hipotensi', () => {
    const sesudah = driftProlanis(
      pesertaHt({ param: 130, takTerkontrolBerturut: 0 }),
      false,
      new Rng(7, 'drift'),
    )
    // Fisiologi: menaikkan dosis antihipertensi pada pasien terkendali
    // MENURUNKAN tensi — dulu engine justru menaikkannya.
    expect(sesudah.param).toBeLessThan(130)
    expect(sesudah.param).toBeGreaterThanOrEqual(110)
    expect(sesudah.takTerkontrolBerturut).toBe(0)
  })

  it('clamp bawah 110 menahan overtreatment dekat batas — param tak pernah < 110', () => {
    // Langkah HT ∈ [6,16]: dari 112, 112−langkah ≤ 106 < 110 → selalu tertahan
    // tepat di clamp, apa pun seed-nya.
    const sesudah = driftProlanis(
      pesertaHt({ param: 112, takTerkontrolBerturut: 0 }),
      false,
      new Rng(7, 'drift'),
    )
    expect(sesudah.param).toBe(110)
  })

  it('amendemen: DM TERKENDALI + intervensi salah ("stop obat" = under-treatment) → GDP NAIK, bukan turun', () => {
    // Kartu DM terkendali opsi salahnya "Stop obat karena gula sudah normal";
    // respons kartunya sendiri: berhenti = gula melonjak lagi. Pembalikan arah
    // Keputusan #8 sengaja dibatasi ke HT — DM mengikuti perilaku lama.
    const sesudah = driftProlanis(
      { ...pesertaHt({ takTerkontrolBerturut: 0 }), id: 'dm_uji', jenis: 'dm', param: 120 },
      false,
      new Rng(7, 'drift'),
    )
    expect(sesudah.param).toBeGreaterThan(120)
  })

  it('regresi: HT TAK terkendali + intervensi salah tetap NAIK (lalai, perilaku lama)', () => {
    const sesudah = driftProlanis(pesertaHt({ param: 155 }), false, new Rng(7, 'drift'))
    expect(sesudah.param).toBeGreaterThan(155)
  })

  it('regresi: intervensi BENAR tetap menurunkan di kedua state', () => {
    const terkendali = driftProlanis(
      pesertaHt({ param: 130, takTerkontrolBerturut: 0 }),
      true,
      new Rng(7, 'drift'),
    )
    expect(terkendali.param).toBeLessThan(130)
    const takTerkendali = driftProlanis(pesertaHt({ param: 165 }), true, new Rng(7, 'drift'))
    expect(takTerkendali.param).toBeLessThan(165)
  })

  it('konsumsi RNG tetap tepat SATU draw per panggilan (jalur overtreatment & lalai)', () => {
    // Rng deterministik dari seed: bila driftProlanis mengonsumsi tepat satu
    // draw, draw BERIKUTNYA dari rng yg sama harus identik dgn draw kedua
    // rng acuan yg dikonsumsi manual satu kali.
    for (const param of [130, 165]) {
      const dipakai = new Rng(7, 'drift')
      driftProlanis(pesertaHt({ param, takTerkontrolBerturut: 0 }), false, dipakai)
      const acuan = new Rng(7, 'drift')
      acuan.float() // satu draw manual
      expect(dipakai.float()).toBe(acuan.float())
    }
  })
})
