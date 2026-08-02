// @vitest-environment jsdom
/**
 * TEST — parameter musik latar generatif (2026-08-02).
 *
 * jsdom tak punya Web Audio, jadi yang diuji di sini adalah KEPUTUSAN
 * PARAMETRIK-nya: laras, register, dan pagar keselamatan pendengaran. Bunyi
 * sesungguhnya wajib diverifikasi dengan mendengarkan di runtime Electron —
 * lihat catatan di docs/KEBIJAKAN_ASET_AUDIO.md.
 */
import { describe, expect, it } from 'vitest'
import { _internal } from './ambient'

const { WATAK, nada, PLAFON_AMBIENT, SEN_SLENDRO, SEN_PELOG } = _internal

describe('laras', () => {
  it('slendro 5 nada & pelog 7 nada, menaik, dalam satu oktaf', () => {
    expect(SEN_SLENDRO).toHaveLength(5)
    expect(SEN_PELOG).toHaveLength(7)
    for (const tabel of [SEN_SLENDRO, SEN_PELOG]) {
      expect(tabel[0]).toBe(0)
      expect(tabel.at(-1)!).toBeLessThan(1200)
      for (let i = 1; i < tabel.length; i++) expect(tabel[i]!).toBeGreaterThan(tabel[i - 1]!)
    }
  })

  it('slendro TIDAK persis 5-EDO — jarak tak rata itu yang membuatnya terdengar organik', () => {
    const langkah = SEN_SLENDRO.slice(1).map((s, i) => s - SEN_SLENDRO[i]!)
    // Bila semua langkah persis 240 sen, larasnya terasa sintetis/mekanis.
    expect(new Set(langkah).size).toBeGreaterThan(1)
    for (const l of langkah) expect(Math.abs(l - 240)).toBeLessThan(45)
  })

  it('indeks naik satu oktaf menggandakan frekuensi', () => {
    expect(nada('slendro', 5) / nada('slendro', 0)).toBeCloseTo(2, 4)
    expect(nada('pelog', 7) / nada('pelog', 0)).toBeCloseTo(2, 4)
  })
})

describe('pagar keselamatan pendengaran & lab', () => {
  it('plafon ambient jauh di bawah bus SFX (VOLUME_MASTER 0.4)', () => {
    expect(PLAFON_AMBIENT).toBeLessThan(0.4 / 4)
  })

  it('tiap konteks punya register di dalam batas yang tak melelahkan', () => {
    for (const [nama, w] of Object.entries(WATAK)) {
      const [lo, hi] = w.rentang
      expect(hi, `${nama}: rentang terbalik`).toBeGreaterThan(lo)
      const tertinggi = nada(w.laras, hi)
      // Di atas ~1,5 kHz nada berulang jadi melelahkan pada sesi panjang; ini
      // juga pita yang paling menembus ke kursi sebelah di lab.
      expect(tertinggi, `${nama}: nada tertinggi ${tertinggi.toFixed(0)} Hz terlalu tinggi`).toBeLessThan(1500)
      expect(nada(w.laras, lo), `${nama}: nada terendah`).toBeGreaterThan(60)
    }
  })

  it('tempo selalu sangat lambat — ini latar, bukan pertunjukan', () => {
    for (const [nama, w] of Object.entries(WATAK)) {
      expect(w.jeda, `${nama}: jeda terlalu rapat`).toBeGreaterThanOrEqual(3.5)
      expect(w.gain, `${nama}: gain melebihi plafon`).toBeLessThanOrEqual(1)
    }
  })

  it('IGD tidak dipercepat — ketegangan dari isi kasus, bukan tempo', () => {
    expect(WATAK.igd.jeda).toBeGreaterThanOrEqual(WATAK.pagi.jeda - 1)
    // …melainkan dari register rendah & cutoff gelap.
    expect(WATAK.igd.cutoff).toBeLessThan(WATAK.pagi.cutoff)
    expect(WATAK.igd.laras).toBe('pelog')
  })
})
