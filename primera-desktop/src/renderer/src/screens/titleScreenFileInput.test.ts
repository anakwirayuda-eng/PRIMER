/**
 * TEST — Polish#3b (CODEX audit UI/UX 2026-07-10 #3b): 3× <input type="file">
 * mentah di TitleScreen (impor arsip JSON, verifikasi dossier, impor log
 * telemetri) tak punya styling `::file-selector-button` — tombol "Choose
 * File" bawaan OS tampak sbg kontrol asing di tengah bahasa desain `.tombol`.
 * Pagar ini murni level sumber CSS (pola sama styles/lapisan.test.ts): cek
 * selector ada + nilai visualnya disalin dari `.tombol` dasar (base.css),
 * bukan direka baru.
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

describe('TitleScreen input[type=file] — selaras bahasa desain .tombol (Polish#3b)', () => {
  const css = baca('./TitleScreen.css')
  const tombol = blok(baca('../styles/base.css'), '.tombol')

  it('punya aturan ::file-selector-button utk .title__impor input[type="file"]', () => {
    expect(css).toMatch(/\.title__impor\s+input\[type=['"]file['"]\]::file-selector-button\s*\{/)
  })

  it('nilai visual disalin dari .tombol dasar, bukan direka baru', () => {
    const isi = blok(css, ".title__impor input[type='file']::file-selector-button")
    // Padding & border-radius & border & background & color harus SEPADAN
    // dgn .tombol dasar (base.css) — bukan angka baru yg tak konsisten.
    expect(isi).toMatch(/padding:\s*var\(--sp-2\)\s+var\(--sp-4\)/)
    expect(isi).toMatch(/border-radius:\s*var\(--radius-md\)/)
    expect(isi).toMatch(/border:\s*1px solid var\(--border-tegas\)/)
    expect(isi).toMatch(/background:\s*var\(--bg-card\)/)
    expect(isi).toMatch(/color:\s*var\(--tinta\)/)
    expect(isi).toMatch(/cursor:\s*pointer/)
    // Sanity: nilai yg diklaim "disalin" itu benar berasal dari .tombol.
    expect(tombol).toMatch(/padding:\s*var\(--sp-2\)\s+var\(--sp-4\)/)
    expect(tombol).toMatch(/border-radius:\s*var\(--radius-md\)/)
  })
})
