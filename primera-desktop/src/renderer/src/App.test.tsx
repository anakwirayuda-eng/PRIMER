/**
 * TEST — App: getar layar (kelas CSS) saat Kode Hitam (DeepThink "game
 * juice", 2026-07-04). Audio di-mock (diuji terpisah di audio/useAudio.test.tsx)
 * supaya test ini murni soal toggle kelas, bukan side-effect WebAudio di jsdom.
 */
import { describe, expect, it, vi, afterEach } from 'vitest'
import { act, render, cleanup } from '@testing-library/react'
import { useGame } from './store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import App from './App'

vi.mock('./audio/useAudio', () => ({ useAudio: () => {} }))
vi.mock('./audio/useAmbient', () => ({ useAmbient: () => {} }))

function pasang(): void {
  window.primer = {
    save: { write: async () => true, read: async () => null, list: async () => [], delete: async () => true },
    telemetri: { append: async () => true, read: async () => [] },
    appVersion: async () => 'test',
  }
  // CODEX M14 #14a: tandai onboarding SELESAI — tanpa ini, state Hari 1 pagi
  // memunculkan modal Onboarding yang (dgn benar) menahan fokus-<main> otomatis,
  // mengganggu test fokus/getar yang bukan tentang onboarding.
  window.localStorage.setItem('primer.onboarding.selesai', '1')
  useGame.setState({ state: buildInitialState('Uji App', 1, PACK), arsip: null, lastEvents: [], eventTick: 0 })
}

describe('<App /> — getar Kode Hitam', () => {
  afterEach(() => {
    cleanup()
  })

  it('event KODE_HITAM menambah kelas app-frame--kode-hitam sesaat, lalu hilang', async () => {
    vi.useFakeTimers()
    pasang()
    render(<App />)
    const frame = document.querySelector('.app-frame')!
    expect(frame.className).not.toMatch(/kode-hitam/)

    act(() => {
      useGame.setState({
        lastEvents: [{ type: 'KODE_HITAM', narasi: 'Kode Hitam. Uji tidak tertolong.' }],
        eventTick: 1,
      })
    })
    expect(document.querySelector('.app-frame')!.className).toMatch(/kode-hitam/)

    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(document.querySelector('.app-frame')!.className).not.toMatch(/kode-hitam/)
    vi.useRealTimers()
  })

  it('event LAIN (bukan KODE_HITAM) tidak memicu kelas getar', () => {
    pasang()
    render(<App />)
    act(() => {
      useGame.setState({ lastEvents: [{ type: 'HARI_BARU', hari: 2 }], eventTick: 1 })
    })
    expect(document.querySelector('.app-frame')!.className).not.toMatch(/kode-hitam/)
  })
})

describe('<App /> — fokus pindah layar (CODEX audit UI/UX 2026-07-10 #18)', () => {
  afterEach(() => {
    cleanup()
  })

  it('berpindah layar memindahkan fokus programatik ke <main> (bukan hilang ke body)', () => {
    pasang()
    render(<App />)
    const main = document.querySelector('main.app-layar')!

    act(() => {
      useGame.setState((s) => ({ state: s.state ? { ...s.state, layar: 'klinik' } : s.state }))
    })

    expect(document.activeElement).toBe(main)
  })

  it('<main> mendapat aria-label yang menyebut nama layar aktif', () => {
    pasang()
    render(<App />)
    act(() => {
      useGame.setState((s) => ({ state: s.state ? { ...s.state, layar: 'klinik' } : s.state }))
    })
    const main = document.querySelector('main.app-layar')!
    expect(main.getAttribute('aria-label')).toMatch(/Klinik/)
  })

  it('tidak crash saat state awalnya null (layar judul)', () => {
    useGame.setState({ state: null, arsip: null, lastEvents: [], eventTick: 0 })
    expect(() => render(<App />)).not.toThrow()
  })
})
