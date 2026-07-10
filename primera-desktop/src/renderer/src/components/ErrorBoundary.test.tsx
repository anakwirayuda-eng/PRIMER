import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'

function Peledak(): never {
  throw new Error('ledakan render uji')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Redam console.error dari componentDidCatch/React agar output test bersih.
    vi.spyOn(console, 'error').mockImplementation(() => {})
    useGame.setState({ state: null, arsip: null, lastEvents: [], eventTick: 0 })
  })

  it('menangkap error render dan menampilkan fallback, bukan layar putih', () => {
    render(
      <ErrorBoundary judul="uji" variant="penuh">
        <Peledak />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/terjadi kendala tak terduga/i)).toBeInTheDocument()
    // Detail teknis tetap tersedia untuk pelaporan.
    expect(screen.getByText(/ledakan render uji/)).toBeInTheDocument()
  })

  it('"Kembali ke layar judul" mengosongkan state (memutus boot-loop autosave)', () => {
    // Muat state seolah autosave termuat — inilah yang, bila jadi pemicu crash,
    // akan boot-loop tanpa jalan keluar.
    useGame.setState({ state: buildInitialState('Uji', 1, PACK) })
    expect(useGame.getState().state).not.toBeNull()

    render(
      <ErrorBoundary judul="uji" variant="penuh">
        <Peledak />
      </ErrorBoundary>,
    )
    fireEvent.click(screen.getByText(/kembali ke layar judul/i))

    // State di memori dikosongkan → App akan kembali ke TitleScreen (bukan re-crash).
    expect(useGame.getState().state).toBeNull()
  })

  it('me-render anak secara normal saat tak ada error', () => {
    render(
      <ErrorBoundary>
        <div>konten sehat</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('konten sehat')).toBeInTheDocument()
  })
})

describe('ErrorBoundary — CODEX audit UI/UX 2026-07-10 (#21, #22)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    useGame.setState({ state: null, arsip: null, lastEvents: [], eventTick: 0 })
  })

  it('#21: variant="layar" tak memasang data-mode (mewarisi leluhur), variant="penuh" tetap "pagi"', () => {
    const { container: layar } = render(
      <ErrorBoundary variant="layar">
        <Peledak />
      </ErrorBoundary>,
    )
    const pembungkusLayar = layar.firstElementChild as HTMLElement
    expect(pembungkusLayar.hasAttribute('data-mode')).toBe(false)

    const { container: penuh } = render(
      <ErrorBoundary variant="penuh">
        <Peledak />
      </ErrorBoundary>,
    )
    const pembungkusPenuh = penuh.firstElementChild as HTMLElement
    expect(pembungkusPenuh.getAttribute('data-mode')).toBe('pagi')
  })

  it('#22a: tombol "Coba tampilkan lagi" hilang setelah 2x percobaan gagal berturut', () => {
    render(
      <ErrorBoundary variant="penuh">
        <Peledak />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/coba tampilkan lagi/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/coba tampilkan lagi/i))
    expect(screen.getByText(/coba tampilkan lagi/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/coba tampilkan lagi/i))
    expect(screen.queryByText(/coba tampilkan lagi/i)).not.toBeInTheDocument()
  })

  it('#22b: "Kembali ke layar judul" memanggil muatAutosave agar arsip termuat ulang', () => {
    const muatAutosaveMock = vi.fn().mockResolvedValue(true)
    useGame.setState({ muatAutosave: muatAutosaveMock })

    render(
      <ErrorBoundary variant="penuh">
        <Peledak />
      </ErrorBoundary>,
    )
    fireEvent.click(screen.getByText(/kembali ke layar judul/i))

    expect(muatAutosaveMock).toHaveBeenCalledTimes(1)
  })

  it('#22c: stack trace teknis bisa diseleksi/disalin (userSelect: text)', () => {
    const { container } = render(
      <ErrorBoundary variant="penuh">
        <Peledak />
      </ErrorBoundary>,
    )
    const pre = container.querySelector('pre')
    expect(pre).not.toBeNull()
    expect(pre?.style.userSelect).toBe('text')
  })
})
