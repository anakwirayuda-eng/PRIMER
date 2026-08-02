// @vitest-environment jsdom
/**
 * TEST — modul diagnostik (A8 telemetri, 2026-08-02): penghitung pemakaian
 * layar tahan-korupsi, dan penyusun laporan memangkas masukan yang tak
 * terbatas (log crash & umpan balik) sebelum jadi berkas.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { bacaPemakaianLayar, catatKunjunganLayar, susunLaporan } from './diagnostik'

const KUNCI = 'primer.pemakaian.layar'

describe('penghitung pemakaian layar', () => {
  beforeEach(() => window.localStorage.clear())

  it('menghitung kunjungan per layar, bertahan antar-baca', () => {
    catatKunjunganLayar('klinik')
    catatKunjunganLayar('klinik')
    catatKunjunganLayar('peta')
    expect(bacaPemakaianLayar()).toEqual({ klinik: 2, peta: 1 })
  })

  it('localStorage korup (bukan JSON / nilai bukan angka) → mulai bersih, bukan throw', () => {
    window.localStorage.setItem(KUNCI, '{rusak')
    expect(bacaPemakaianLayar()).toEqual({})
    window.localStorage.setItem(KUNCI, JSON.stringify({ klinik: 'banyak', peta: -3, dex: 2 }))
    // Nilai non-angka & negatif dibuang; yang sehat dipertahankan.
    expect(bacaPemakaianLayar()).toEqual({ dex: 2 })
    catatKunjunganLayar('dex')
    expect(bacaPemakaianLayar()['dex']).toBe(3)
  })
})

describe('susunLaporan', () => {
  it('memangkas log crash ke 50 baris terakhir dan umpan balik ke 4000 karakter', () => {
    const log = Array.from({ length: 80 }, (_, i) => `baris-${i}`)
    const laporan = susunLaporan({
      versiApp: '1.1.0-test',
      logCrash: log,
      sesi: { hari: 5, blok: 'pagi', mode: 'karier', layar: 'klinik' },
      umpanBalik: 'x'.repeat(9000),
    })
    expect(laporan.jenis).toBe('laporan-diagnostik-primera')
    expect(laporan.logCrash).toHaveLength(50)
    expect(laporan.logCrash[0]).toBe('baris-30') // 50 TERAKHIR, bukan 50 pertama
    expect(laporan.umpanBalik).toHaveLength(4000)
    expect(laporan.sesi?.hari).toBe(5)
    // Yang sengaja TIDAK ikut: isi save (privasi) — sesi hanya 4 field konteks
    // ringkas, bukan objek GameState (tally/desa/inbox/jejak tak boleh bocor).
    expect(Object.keys(laporan.sesi!).sort()).toEqual(['blok', 'hari', 'layar', 'mode'])
  })
})
