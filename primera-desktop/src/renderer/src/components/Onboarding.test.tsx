/**
 * TEST KOMPONEN — Onboarding + Pengaturan (CODEX audit UI/UX 2026-07-10, #24).
 * Cakup dua sisi temuan yang sama: (a) resetOnboarding + tombol replay di
 * Pengaturan utk slot kedua/ketiga yang belum pernah lihat panduan Hari-1,
 * (b) urutan DOM fokus-awal ke CTA "Lanjut", bukan "Lewati" (jalan keluar).
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Onboarding, sudahOnboarding, resetOnboarding } from './Onboarding'
import { Pengaturan } from './Pengaturan'

const KUNCI = 'primer.onboarding.selesai'

describe('resetOnboarding', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('menghapus kunci selesai sehingga sudahOnboarding() kembali false', () => {
    window.localStorage.setItem(KUNCI, '1')
    expect(sudahOnboarding()).toBe(true)

    resetOnboarding()

    expect(sudahOnboarding()).toBe(false)
  })
})

describe('<Onboarding /> — fokus awal (CODEX audit UI/UX 2026-07-10, #24b)', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('tombol focusable PERTAMA dalam DOM adalah "Lanjut", bukan "Lewati" (jalan keluar)', () => {
    // Verifikasi visual (Lewati tetap tampak di kiri, grup Lanjut di kanan,
    // via CSS order di Onboarding.css) tak bisa diuji di jsdom — jsdom tak
    // menghitung layout flex/CSS order sungguhan. Test ini hanya menegaskan
    // urutan DOM yang dipakai useFocusTrap (querySelectorAll, ikut DOM).
    const { container } = render(<Onboarding onSelesai={() => {}} />)
    const tombolPertama = container.querySelectorAll('button')[0]

    expect(tombolPertama).toBeDefined()
    expect(tombolPertama).not.toHaveTextContent('Lewati')
    expect(tombolPertama).toHaveTextContent('Lanjut')
  })
})

describe('<Pengaturan /> — "Tampilkan panduan lagi" (CODEX audit UI/UX 2026-07-10, #24a)', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('mereset onboarding via tombol replay di modal Pengaturan', () => {
    window.localStorage.setItem(KUNCI, '1')
    expect(sudahOnboarding()).toBe(true)

    render(<Pengaturan />)
    fireEvent.click(screen.getByRole('button', { name: 'Buka Pengaturan' }))

    const tombolReplay = screen.getByRole('button', { name: 'Tampilkan panduan lagi' })
    fireEvent.click(tombolReplay)

    expect(sudahOnboarding()).toBe(false)
  })
})
