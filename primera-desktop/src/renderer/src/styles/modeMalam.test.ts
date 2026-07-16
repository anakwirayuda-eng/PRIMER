/**
 * TEST — invarian token mode-malam utk kanvas SELALU-TERANG (M10.a lanjutan,
 * user playtest 2026-07-06, dossier §45). Beberapa sub-pohon UI sengaja tetap
 * terang terlepas mode app (TitleScreen 'pagi', kanvas SVG peta "kartu pos
 * kertas") — TAPI token BERSAMA yang dipakai teks/aksen di dalamnya (mis.
 * --tinta, --daun-600/800, --kunyit-600/700) tetap diremap TERANG di mode
 * malam utk konteks lain (HUD/klinik, latar GELAP). Kombinasi "teks terang +
 * kanvas selalu-terang" bikin kontras kolaps — pola SAMA yg sudah ditambal 1
 * titik (`.peta-roster-item--aktif`, komentar "CODEX P2 audit 2026-07-04")
 * tapi luput di kanvas SVG peta sendiri sampai user menemukannya main
 * langsung. Pagar generik: SETIAP token yg (a) diremap di `[data-mode=
 * 'malam']` tokens.css DAN (b) dipakai via `var(--x)` di PetaSvg.tsx WAJIB
 * dikunci-ulang ke nilai mode-terang di `[data-mode='malam'] .peta-svg`
 * (PetaDesa.css) — titik pemakaian BARU di masa depan yg lupa pola ini
 * otomatis tertangkap, bukan cuma titik yg sudah ditemukan hari ini.
 */
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const baca = (p: string) => readFileSync(resolve(__dirname, p), 'utf8')

/** Nama custom property yang punya redeklarasi di dalam SATU blok CSS (mentah). */
function propertiDiBlok(blokCss: string): Set<string> {
  return new Set([...blokCss.matchAll(/--([\w-]+):/g)].map((m) => m[1]!))
}

describe('mode-malam: kanvas SELALU-TERANG tak boleh mewarisi remap gelap (dossier §45)', () => {
  const tokens = baca('./tokens.css')
  const petaCss = baca('../screens/PetaDesa.css')
  const petaSvgTsx = baca('../screens/peta/PetaSvg.tsx')

  // Blok `[data-mode='malam'] { ... }` teratas (root remap global) — bukan
  // blok per-komponen (mis. .peta-roster-item--aktif) yang juga cocok pola
  // selector sama; ambil SATU blok pertama persis `[data-mode='malam'] {`.
  const blokRootMalam = tokens.match(/\[data-mode='malam'\]\s*\{([^}]*)\}/)?.[1] ?? ''
  const tokenDiremapGelap = propertiDiBlok(blokRootMalam)
  expect(tokenDiremapGelap.size, 'gagal parse blok root [data-mode=malam] tokens.css').toBeGreaterThan(5)

  const tokenDipakaiPeta = new Set([...petaSvgTsx.matchAll(/var\(--([\w-]+)\)/g)].map((m) => m[1]!))

  const blokKunciUlang = petaCss.match(/\[data-mode='malam'\]\s*\.peta-svg\s*\{([^}]*)\}/)?.[1] ?? ''
  const tokenTerkunciUlang = propertiDiBlok(blokKunciUlang)

  it('blok kunci-ulang .peta-svg ditemukan & tak kosong', () => {
    expect(blokKunciUlang.trim().length).toBeGreaterThan(0)
  })

  it('setiap token dipakai PetaSvg.tsx yang JUGA diremap gelap wajib dikunci-ulang', () => {
    const luput = [...tokenDipakaiPeta].filter((t) => tokenDiremapGelap.has(t) && !tokenTerkunciUlang.has(t))
    expect(luput, `token luput dikunci-ulang: ${luput.join(', ')}`).toEqual([])
  })
})

describe('M10 Batch-2 (CODEX A.3) — kontras AA --tinta-pudar dihitung dari tokens.css', () => {
  // Hitung rasio kontras WCAG langsung dari hex di tokens.css — pagar hidup:
  // siapa pun yang menggeser token gelap/terang akan langsung ketahuan bila
  // jatuh di bawah 4.5:1 (teks kecil dipakai nyata utk hint/legenda).
  function lum(hex: string): number {
    const n = hex.replace('#', '')
    const [r, g, b] = [0, 2, 4].map((i) => {
      const c = parseInt(n.slice(i, i + 2), 16) / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    }) as [number, number, number]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  function rasio(a: string, b: string): number {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number]
    return (l1 + 0.05) / (l2 + 0.05)
  }
  function token(css: string, nama: string, dariIndex = 0, kedalaman = 0): string {
    // Parser polos (tanpa RegExp dinamis): cari tiap deklarasi `--nama:` lalu
    // ambil hex 6 digit pertama setelahnya. Sapuan 2026-07-16: token kini boleh
    // menunjuk token lain (mis. --tinta-pudar: var(--tinta-pudar-siang)) —
    // ikuti indireksi var(...) maksimal 3 tingkat supaya pagar tetap membaca
    // nilai hex final, bukan gagal diam-diam.
    if (kedalaman > 3) throw new Error(`token --${nama}: indireksi var() terlalu dalam`)
    const kunci = `--${nama}:`
    const semua: string[] = []
    let i = css.indexOf(kunci)
    while (i !== -1) {
      const potong = css.slice(i + kunci.length, i + kunci.length + 40)
      const hex = potong.match(/#[0-9a-fA-F]{6}/)
      if (hex) {
        semua.push(hex[0])
      } else {
        const ref = potong.match(/var\(--([a-zA-Z0-9-]+)\)/)
        if (ref) semua.push(token(css, ref[1]!, 0, kedalaman + 1))
      }
      i = css.indexOf(kunci, i + kunci.length)
    }
    if (semua.length <= dariIndex) throw new Error(`token --${nama}[${dariIndex}] tak ditemukan`)
    return semua[dariIndex]!
  }
  const css = readFileSync(resolve(__dirname, './tokens.css'), 'utf8')

  it('siang: tinta-pudar vs kertas-050 ≥ 4.5:1', () => {
    expect(rasio(token(css, 'tinta-pudar', 0), token(css, 'kertas-050', 0))).toBeGreaterThanOrEqual(4.5)
  })

  it('malam: tinta-pudar vs malam-700 (bg-card) ≥ 4.5:1', () => {
    // Deklarasi kedua tinta-pudar (blok [data-mode=malam]) vs malam-700.
    expect(rasio(token(css, 'tinta-pudar', 1), token(css, 'malam-700', 0))).toBeGreaterThanOrEqual(4.5)
  })
})
