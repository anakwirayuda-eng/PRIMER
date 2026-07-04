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
