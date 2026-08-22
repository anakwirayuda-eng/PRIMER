/**
 * KEGIATAN — kartu Prolanis: respons yang dibaca pemain harus menjanjikan
 * persis mekanik yang dijalankan engine, tidak lebih.
 */

import { describe, expect, it } from 'vitest'
import { Rng } from './core/rng'
import { driftProlanis, jawabKegiatan, kartuProlanis, prolanisTerkendali } from './kegiatan'
import type { KegiatanState, PesertaProlanis } from './state'

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

  /* -- Adjudikasi 2026-08-22: inersia klinis DM tak terkendali --------------- */

  const pesertaDm = (over: Partial<PesertaProlanis> = {}): PesertaProlanis =>
    ({
      id: 'p_dm',
      nama: 'Uji DM',
      usia: 58,
      jenisKelamin: 'P',
      rw: 1,
      jenis: 'dm',
      param: 190,
      takTerkontrolBerturut: 0,
      ...over,
    }) as PesertaProlanis

  it('DM tak terkendali + "tambah obat" (salah) → gula STAGNAN, tidak naik', () => {
    // Menambah agen hipoglikemik tidak menaikkan gula darah. Yang benar secara
    // farmakologi: obatnya gagal menurunkan karena akar masalahnya tak disentuh.
    for (const seed of [3, 7, 11, 19]) {
      const awal = pesertaDm({ param: 190 })
      const sesudah = driftProlanis(awal, false, new Rng(seed, 'drift'))
      expect(sesudah.param).toBe(190)
    }
  })

  it('DM TERKENDALI + salah tetap MEMBURUK — amendemen Keputusan #8 tak tergerus', () => {
    // Opsi salah di kartu DM terkendali adalah "Stop obat karena gula sudah
    // normal" = under-treatment; gula memang melonjak lagi. Flatline di atas
    // TIDAK boleh melebar ke sini.
    const awal = pesertaDm({ param: 115 }) // < 130 = terkendali
    const sesudah = driftProlanis(awal, false, new Rng(5, 'drift'))
    expect(sesudah.param).toBeGreaterThan(115)
  })

  it('DM + jawaban BENAR tetap membaik', () => {
    const sesudah = driftProlanis(pesertaDm({ param: 190 }), true, new Rng(5, 'drift'))
    expect(sesudah.param).toBeLessThan(190)
  })

  it('konsumsi RNG DM tetap SATU draw di ketiga cabang (termasuk flatline)', () => {
    // Cabang flatline TIDAK boleh melewati pemanggilan rng — kalau ia hemat
    // satu draw, seluruh keacakan hilir bergeser (RNG-cascade) tanpa satu pun
    // test lain memerah.
    for (const [param, tepat] of [
      [190, false], // flatline
      [115, false], // memburuk
      [190, true], // membaik
    ] as const) {
      const dipakai = new Rng(7, 'drift')
      driftProlanis(pesertaDm({ param }), tepat, dipakai)
      const acuan = new Rng(7, 'drift')
      acuan.float()
      expect(dipakai.float()).toBe(acuan.float())
    }
  })
})

/* -- Audit UKM 2026-08-22 (P1): jawaban tak bisa ditimpa ulang ---------------- */

describe('P1 anti-replay: kartu yang sudah dijawab menolak dijawab ulang', () => {
  const sesi = (): KegiatanState => ({
    jenis: 'posyandu',
    rw: 2,
    index: 0,
    jawaban: [],
    kartu: [
      { id: 'k1', judul: 'A', narasi: 'a', pilihan: [{ id: 'a', label: 'A', benar: true, respons: 'ya' }, { id: 'b', label: 'B', benar: false, respons: 'tidak' }] },
      { id: 'k2', judul: 'B', narasi: 'b', pilihan: [{ id: 'a', label: 'A', benar: true, respons: 'ya' }, { id: 'b', label: 'B', benar: false, respons: 'tidak' }] },
    ],
  } as unknown as KegiatanState)

  it('menjawab kartu yang SUDAH terjawab dikembalikan apa adanya (tak menimpa, tak maju dua kali)', () => {
    const pertama = jawabKegiatan(sesi(), 'k1', 'b')
    expect(pertama.kg.jawaban).toEqual([{ kartuId: 'k1', pilihanId: 'b', benar: false }])
    expect(pertama.kg.index).toBe(1)
    // Simulasi dispatch ganda (mis. klik-ganda/ghost-click): kartuId sudah tak
    // cocok dgn kartu berjalan, dan andai cocok pun penjaga jawaban menahan.
    const ulang = jawabKegiatan(pertama.kg, 'k1', 'a')
    expect(ulang.kg).toBe(pertama.kg)
    expect(ulang.benar).toBe(false)
  })

  it('penjaga jawaban menahan walau kartuId cocok dgn kartu berjalan', () => {
    const kg = sesi()
    const disuntik = { ...kg, jawaban: [{ kartuId: 'k1', pilihanId: 'b', benar: false }] } as KegiatanState
    const ulang = jawabKegiatan(disuntik, 'k1', 'a')
    expect(ulang.kg).toBe(disuntik)
  })
})
