/**
 * TEST — invarian lapisan UI (M10.a, 2026-07-06). jsdom tak memproses CSS
 * sungguhan (tak ada painting/hit-testing), jadi bug tumpang-tindih kelas ini
 * historisnya baru ketahuan saat playtest manusia (toast menimpa tombol modal
 * §38; kartu temuan menelan klik hotspot; tombol melayang menelan klik kartu
 * Dex). Pagar di sini bekerja di LEVEL SUMBER CSS — pola sama sapuan teks
 * tatalaksanaClue.test.ts: bukan pengganti verifikasi browser, tapi mencegah
 * regresi diam-diam saat seseorang "merapikan" deklarasi yang kelihatannya
 * tak berguna padahal load-bearing.
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

describe('invarian lapisan UI (M10.a)', () => {
  const tokens = baca('./tokens.css')

  it('urutan token z-index: hud < drawer < toast < modal', () => {
    const nilai = (nama: string): number => {
      const m = tokens.match(new RegExp(`--z-${nama}:\\s*(\\d+)`))
      if (!m) throw new Error(`--z-${nama} tidak ditemukan di tokens.css`)
      return Number(m[1])
    }
    // §38: toast WAJIB di bawah modal — toast informatif tak boleh menimpa
    // tombol modal aktif (PanelHasil "Pasien Berikutnya" dkk).
    expect(nilai('toast')).toBeLessThan(nilai('modal'))
    expect(nilai('hud')).toBeLessThan(nilai('drawer'))
    expect(nilai('drawer')).toBeLessThan(nilai('toast'))
  })

  it('.toaster pointer-events none — toast tak pernah mencegat klik (§38)', () => {
    expect(blok(baca('../components/Toaster.css'), '.toaster')).toMatch(/pointer-events:\s*none/)
  })

  it('.kunjungan-hotspot terangkat di atas kartu temuan (z-index)', () => {
    // Kartu .kunjungan-temuan di-render SETELAH lapis hotspot → tanpa z-index
    // hotspot ber-x tinggi tertimpa & tak bisa diklik (empiris wulan_k1 wk1_h3).
    expect(blok(baca('../screens/Kunjungan.css'), '.kunjungan-hotspot')).toMatch(/z-index:\s*[1-9]/)
  })

  it('mute+gigi in-game didok di HUD, bukan melayang (kelas menelan-klik konten)', () => {
    // Varian --dok wajib position:static; dan Hud.tsx wajib me-render keduanya
    // (kalau dicabut dari HUD tanpa sadar, versi melayang TIDAK kembali otomatis
    // — pemain kehilangan akses audio/pengaturan in-game sama sekali).
    expect(blok(baca('../audio/MuteButton.css'), '.mute-tombol--dok')).toMatch(/position:\s*static/)
    expect(blok(baca('../components/Pengaturan.css'), '.set-gigi--dok')).toMatch(/position:\s*static/)
    const hud = baca('../components/Hud.tsx')
    expect(hud).toMatch(/<MuteButton dok \/>/)
    expect(hud).toMatch(/<Pengaturan dok \/>/)
  })
})
