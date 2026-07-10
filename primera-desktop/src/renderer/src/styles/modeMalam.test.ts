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
