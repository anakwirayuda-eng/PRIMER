/**
 * TEST KOMPONEN — Onboarding + Pengaturan (CODEX audit UI/UX 2026-07-10, #24).
 * Cakup dua sisi temuan yang sama: (a) resetOnboarding + tombol replay di
 * Pengaturan utk slot kedua/ketiga yang belum pernah lihat panduan Hari-1,
 * (b) urutan DOM fokus-awal ke CTA "Lanjut", bukan "Lewati" (jalan keluar).
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
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

/**
 * Kartu ⚖️ dulu memuat TIGA konsep + salam penutup sekaligus — satu-satunya
 * yang melanggar "satu konsep per kartu" (audit 2026-07-23). Dipecah dua pada
 * 2026-08-01; dua kalimat dasar penilaian Kemenkes WAJIB tetap verbatim karena
 * bersanding dgn catatan medikolegal PanelHasil §3b.
 */
describe('<Onboarding /> — pemecahan kartu penutup (2026-08-01)', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  function bacaSemuaKartu(): string[] {
    const { unmount } = render(<Onboarding onSelesai={() => {}} />)
    const isi: string[] = []
    for (;;) {
      isi.push(document.querySelector('.onb-kartu')?.textContent ?? '')
      const lanjut = screen.queryByRole('button', { name: 'Lanjut' })
      if (!lanjut) break
      fireEvent.click(lanjut)
    }
    unmount()
    return isi
  }

  it('dasar penilaian Kemenkes dan nasihat provenance kini di kartu BERBEDA', () => {
    const kartu = bacaSemuaKartu()
    const iDasar = kartu.findIndex((t) => t.includes('Panduan resmi Kemenkes menjadi acuan utama penilaian.'))
    const iProvenance = kartu.findIndex((t) =>
      t.includes('angka yang tidak kamu periksa sendiri adalah angka yang belum ada'),
    )
    expect(iDasar).toBeGreaterThanOrEqual(0)
    expect(iProvenance).toBeGreaterThanOrEqual(0)
    expect(iProvenance).not.toBe(iDasar)
  })

  it('dua kalimat dasar penilaian tetap VERBATIM (bersanding PanelHasil §3b)', () => {
    const gabungan = bacaSemuaKartu().join(' ')
    expect(gabungan).toContain('Panduan resmi Kemenkes menjadi acuan utama penilaian.')
    expect(gabungan).toContain(
      'Penyimpangan tetap dapat dibenarkan bila didukung alasan klinis yang kuat.',
    )
  })

  it('salam penutup tetap ada, dan tetap di kartu TERAKHIR', () => {
    const kartu = bacaSemuaKartu()
    expect(kartu.at(-1)).toContain('Pasien pertamamu sudah menunggu')
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

describe('<Onboarding /> — klik cepat "Lanjut" tak boleh crash (audit V-1 2026-07-23)', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('dua klik "Lanjut" dalam SATU batch React → berhenti di kartu terakhir, tanpa throw', () => {
    // Bug asli: setI((n)=>n+1) tanpa clamp. Mekanisme crash-nya BUKAN klik
    // biasa (React me-render antar-klik terpisah), melainkan dua event klik
    // yang terproses dalam satu flush batch (klik terprogram, atau klik
    // manusia yang mengantre di belakang long task pada mesin lambat):
    // kedua functional update menumpuk sebelum tombol sempat berganti
    // "Mulai bertugas" → indeks bablas > KARTU.length-1 → KARTU[i]! undefined
    // → crash `reading 'ikon'` ke error boundary di menit pertama pemain.
    render(<Onboarding onSelesai={() => {}} />)

    // Maju normal sampai TEPAT satu "Lanjut" tersisa (kartu kedua-terakhir),
    // apa pun jumlah kartu — di sinilah ras berbahaya: satu klik lagi = kartu
    // terakhir, tapi dua klik menumpuk = bablas keluar batas.
    for (let guard = 0; guard < 20; guard++) {
      fireEvent.click(screen.getByRole('button', { name: 'Lanjut' }))
      if (screen.queryByRole('button', { name: /Mulai bertugas/ })) {
        throw new Error('setup keliru: sudah di kartu terakhir sebelum uji ras')
      }
      // berhenti tepat sebelum kartu terakhir: cek apakah satu klik berikutnya
      // akan jadi yang terakhir — tandanya masih ada "Lanjut" tapi tinggal satu.
      const dots = document.querySelectorAll('.onb-dot').length
      const aktifIdx = [...document.querySelectorAll('.onb-dot')].findIndex((d) =>
        d.className.includes('onb-dot--aktif'),
      )
      if (aktifIdx === dots - 2) break
    }

    // Reproduksi ras: DUA dispatch klik dalam satu act() = satu flush batch.
    const lanjut = screen.getByRole('button', { name: 'Lanjut' })
    act(() => {
      lanjut.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      lanjut.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    // Kartu terakhir tampil utuh (bukan crash/layar error).
    expect(screen.getByRole('button', { name: /Mulai bertugas/ })).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('di kartu terakhir, "Kembali" lalu spam maju lagi tetap stabil', () => {
    render(<Onboarding onSelesai={() => {}} />)
    for (let k = 0; k < 6; k++) {
      const lanjut = screen.queryByRole('button', { name: 'Lanjut' })
      if (!lanjut) break
      fireEvent.click(lanjut)
    }
    fireEvent.click(screen.getByRole('button', { name: 'Kembali' }))
    expect(screen.getByRole('button', { name: 'Lanjut' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Lanjut' }))
    expect(screen.getByRole('button', { name: /Mulai bertugas/ })).toBeInTheDocument()
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
