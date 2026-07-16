/**
 * REGRESI — audit CODEX UX 2026-07-16 (P1): slider Pengaturan.tsx dinaikkan
 * ke max=2 (WCAG 1.4.4 resize-text 200%), tapi clamp muat-ulang di `baca()`
 * TERTINGGAL di batas lama 1.4 — nilai 140-200% pilihan pemain langsung
 * dipangkas balik tiap restart aplikasi. `nilai` di-cache module-level saat
 * import (`baca()` jalan sekali), jadi tiap test butuh `resetModules()` +
 * import dinamis supaya localStorage yang di-seed SEBELUM import benar-benar
 * dibaca ulang oleh modul (mensimulasikan restart aplikasi sungguhan).
 *
 * @vitest-environment jsdom
 */
import { describe, expect, it, beforeEach, vi } from 'vitest'

const KUNCI = 'primer.pengaturan'

beforeEach(() => {
  localStorage.clear()
  vi.resetModules()
})

describe('ukuranTeks bertahan setelah muat-ulang (restart) hingga 200%', () => {
  it('nilai 2.0 tersimpan → dibaca utuh setelah restart, TIDAK dipangkas ke 1.4', async () => {
    localStorage.setItem(KUNCI, JSON.stringify({ ukuranTeks: 2 }))
    const { getPengaturan } = await import('./settings')
    expect(getPengaturan().ukuranTeks).toBe(2)
  })

  it('nilai 1.7 (di zona yang dulu terpangkas) tersimpan utuh', async () => {
    localStorage.setItem(KUNCI, JSON.stringify({ ukuranTeks: 1.7 }))
    const { getPengaturan } = await import('./settings')
    expect(getPengaturan().ukuranTeks).toBe(1.7)
  })

  it('nilai di luar rentang baru (>2 atau <0.9) tetap terpangkas ke batas', async () => {
    localStorage.setItem(KUNCI, JSON.stringify({ ukuranTeks: 5 }))
    const { getPengaturan: g1 } = await import('./settings')
    expect(g1().ukuranTeks).toBe(2)

    vi.resetModules()
    localStorage.setItem(KUNCI, JSON.stringify({ ukuranTeks: 0.1 }))
    const { getPengaturan: g2 } = await import('./settings')
    expect(g2().ukuranTeks).toBe(0.9)
  })

  it('setPengaturan(2) lalu muat-ulang modul (restart) → tetap 2, bukan turun ke 1.4', async () => {
    const { setPengaturan } = await import('./settings')
    setPengaturan({ ukuranTeks: 2 })
    expect(JSON.parse(localStorage.getItem(KUNCI)!).ukuranTeks).toBe(2)

    vi.resetModules()
    const { getPengaturan } = await import('./settings')
    expect(getPengaturan().ukuranTeks).toBe(2)
  })
})
