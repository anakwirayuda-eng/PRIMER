/**
 * TEST — invarian kontras WCAG AA + target-size + forced-colors (CODEX audit
 * UI/UX 2026-07-10 (#20a/#20b/#20c + polish#1/#2b). Rasio di bawah dihitung
 * dari hex tokens.css sebenarnya (bukan tebakan): hover tombol utama/kunyit
 * memakai shade -600 yang gagal AA (3.087:1 & 2.829:1) di bawah teks putih;
 * `.chip` dasar (tanpa varian) memakai --tinta-lembut yang gagal AA (4.197:1)
 * utk teks kecil-bold; heading `.judul-seksi` di dalam `.folder` (--bg-sunken)
 * memakai --daun-700/--kunyit-700 yang gagal/pas-pasan (3.433:1 / ~4.48:1).
 * Sama seperti lapisan.test.ts & modeMalam.test.ts: baca teks CSS mentah via
 * fs.readFileSync lalu assert token yang dipakai — jsdom tak memproses CSS
 * sungguhan jadi tak bisa uji rendering visual langsung.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const baca = (p: string) => readFileSync(resolve(__dirname, p), 'utf8')

/** Ambil isi blok deklarasi pertama selector persis `sel` (tanpa nested). */
function blok(css: string, sel: string): string {
  const re = new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{([^}]*)\\}')
  const m = css.match(re)
  if (!m) throw new Error(`Selector ${sel} tidak ditemukan`)
  return m[1]!
}

describe('kontras WCAG AA — hover tombol & chip dasar (#20a/#20b)', () => {
  const base = baca('./base.css')

  it('.tombol--utama:hover memakai --daun-800 (bukan --daun-600, gagal AA 3.087:1)', () => {
    const isi = blok(base, '.tombol--utama:hover')
    expect(isi).toMatch(/var\(--daun-800\)/)
    expect(isi).not.toMatch(/var\(--daun-600\)/)
  })

  it('.tombol--kunyit:hover memakai --kunyit-800 (bukan --kunyit-600, gagal AA 2.829:1)', () => {
    const isi = blok(base, '.tombol--kunyit:hover')
    expect(isi).toMatch(/var\(--kunyit-800\)/)
    expect(isi).not.toMatch(/var\(--kunyit-600\)/)
  })

  it('.chip dasar (tanpa varian) memakai --tinta (bukan --tinta-lembut, gagal AA 4.197:1)', () => {
    // Selector persis `.chip {` — bukan `.chip--daun`/`.chip--kunyit`/dst yang
    // sudah lolos kontras & sengaja TIDAK disentuh.
    const isi = blok(base, '.chip')
    expect(isi).toMatch(/color:\s*var\(--tinta\);/)
    expect(isi).not.toMatch(/color:\s*var\(--tinta-lembut\);/)
  })
})

describe('kontras WCAG AA — heading di atas .folder/bg-sunken (#20c)', () => {
  const klinik = baca('../screens/Klinik.css')

  it('.klinik-hasil__realita .judul-seksi memakai --daun-800 (bukan --daun-700, gagal AA 3.433:1)', () => {
    const isi = blok(klinik, '.klinik-hasil__realita .judul-seksi')
    expect(isi).toMatch(/var\(--daun-800\)/)
    expect(isi).not.toMatch(/var\(--daun-700\)/)
  })

  it('.klinik-hasil__ebm .judul-seksi memakai --kunyit-800 (bukan --kunyit-700, pas-pasan ~4.48:1)', () => {
    const isi = blok(klinik, '.klinik-hasil__ebm .judul-seksi')
    expect(isi).toMatch(/var\(--kunyit-800\)/)
    expect(isi).not.toMatch(/var\(--kunyit-700\)/)
  })

  it('border-left-color .klinik-hasil__realita TIDAK berubah (dekorasi, bukan teks)', () => {
    // blok() akan menangkap blok selector-list bersama (.klinik-hasil__ebm,
    // .klinik-hasil__realita { ... }) krn nama selector sama — cari langsung
    // blok tunggal `.klinik-hasil__realita { border-left-color: ... }`.
    expect(klinik).toMatch(/\.klinik-hasil__realita\s*\{\s*border-left-color:\s*var\(--daun-700\);?\s*\}/)
  })
})

describe('target-size WCAG 2.5.8 — chip klik Edukasi/Tindakan (Polish#1)', () => {
  it('.klinik-eduk__chip punya min-height 24px, .chip dasar global TIDAK ikut membesar', () => {
    const klinik = baca('../screens/Klinik.css')
    const isi = blok(klinik, '.klinik-eduk__chip')
    expect(isi).toMatch(/min-height:\s*24px/)

    const base = baca('./base.css')
    const chipDasar = blok(base, '.chip')
    expect(chipDasar).not.toMatch(/min-height/)
  })
})

describe('forced-colors (Windows High Contrast) — Polish#2b', () => {
  it('base.css punya blok @media (forced-colors: active)', () => {
    const base = baca('./base.css')
    expect(base).toMatch(/@media \(forced-colors:\s*active\)/)
  })
})

/**
 * Review workflow Batch-7 (lensa kontras, tinggi): fix #20a/#20c di atas benar
 * utk mode TERANG, tapi --kunyit-800 dulu tak diremap di blok
 * [data-mode='malam'] tokens.css (tak seperti --daun-800/700/600 &
 * --kunyit-700/600 yang semua diremap) — begitu token itu dipakai sbg
 * latar/teks baru oleh fix di atas, mode GELAP jatuh ke nilai TERANG
 * (#7a410c) di atas backdrop gelap → kontras runtuh (~2.3:1), LEBIH BURUK
 * drpd sebelum fix. Hitung ulang kontras WCAG dari hex tokens.css sungguhan
 * (bukan sekadar cek nama token) utk menutup celah verifikasi ini.
 */
describe('kontras WCAG AA mode MALAM — --kunyit-800 (regresi ditemukan review Batch-7)', () => {
  const tokens = baca('./tokens.css')

  function hexToken(nama: string, blokIsi: string): string {
    const re = new RegExp(`${nama.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}:\\s*(#[0-9a-fA-F]{6})`)
    const m = blokIsi.match(re)
    if (!m) throw new Error(`Token ${nama} tidak ditemukan di blok`)
    return m[1]!
  }

  function luminance(hex: string): number {
    const n = hex.replace('#', '')
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    const chan = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    const [rl, gl, bl] = [chan(r!), chan(g!), chan(b!)]
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
  }

  function rasio(hex1: string, hex2: string): number {
    const l1 = luminance(hex1)
    const l2 = luminance(hex2)
    const [lTerang, lGelap] = l1 > l2 ? [l1, l2] : [l2, l1]
    return (lTerang + 0.05) / (lGelap + 0.05)
  }

  it('--kunyit-800 mode-malam DIREMAP (bukan nilai terang #7a410c mode-siang yang bocor)', () => {
    const blokMalam = blok(tokens, "[data-mode='malam']")
    const kunyit800Malam = hexToken('--kunyit-800', blokMalam)
    expect(kunyit800Malam.toLowerCase()).not.toBe('#7a410c')
  })

  it('--kunyit-800 mode-malam sbg latar tombol (teks --malam-900) tetap ≥4.5:1', () => {
    const blokMalam = blok(tokens, "[data-mode='malam']")
    const kunyit800Malam = hexToken('--kunyit-800', blokMalam)
    const malam900 = hexToken('--malam-900', tokens) // token dasar, tak diremap ulang di blok malam
    expect(rasio(kunyit800Malam, malam900)).toBeGreaterThanOrEqual(4.5)
  })

  it('--kunyit-800 mode-malam sbg teks di atas --bg-sunken gelap (#0a100d) tetap ≥4.5:1', () => {
    const blokMalam = blok(tokens, "[data-mode='malam']")
    const kunyit800Malam = hexToken('--kunyit-800', blokMalam)
    expect(rasio(kunyit800Malam, '#0a100d')).toBeGreaterThanOrEqual(4.5)
  })
})
