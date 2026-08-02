/**
 * TEST — Toaster: live-region aria harus per-toast, bukan di wrapper batch
 * (CODEX audit UI/UX 2026-07-10 #25). aria-atomic="true" pada wrapper yang
 * membungkus banyak toast sekaligus salah sasaran — screen reader berpotensi
 * membacakan ULANG seluruh isi wrapper tiap mutasi, bukan cuma toast baru.
 */
import { describe, expect, it, afterEach } from 'vitest'
import { act, render, cleanup, screen, waitFor } from '@testing-library/react'
import { useGame } from '../store'
import { Toaster } from './Toaster'

describe('<Toaster /> — aria-live per-toast (CODEX audit UI/UX 2026-07-10 #25)', () => {
  afterEach(() => {
    cleanup()
    useGame.setState({ lastEvents: [], eventTick: 0 })
  })

  it('wrapper .toaster tidak punya role/aria-live/aria-atomic; tiap .toast punya ketiganya', () => {
    render(<Toaster />)
    act(() => {
      useGame.setState({
        lastEvents: [{ type: 'DEX_BERTAMBAH', kasusId: 'uji-1', bintang: 1 }],
        eventTick: 1,
      })
    })

    const wrapper = document.querySelector('.toaster')!
    expect(wrapper.hasAttribute('role')).toBe(false)
    expect(wrapper.hasAttribute('aria-live')).toBe(false)
    expect(wrapper.hasAttribute('aria-atomic')).toBe(false)

    const toast = document.querySelector('.toast')!
    // CODEX M14 #22: toast INFO (DEX_BERTAMBAH) kini polite (role=status),
    // bukan assertive — tak lagi menyela pengumuman screen reader.
    expect(toast.getAttribute('role')).toBe('status')
    expect(toast.getAttribute('aria-live')).toBe('polite')
    expect(toast.getAttribute('aria-atomic')).toBe('true')
  })

  it('CODEX M14 #22: toast BAHAYA tetap assertive (role=alert)', () => {
    render(<Toaster />)
    act(() => {
      // eventTick BEDA dari test sebelumnya — store singleton persist lintas
      // test, effect Toaster hanya jalan bila eventTick berubah.
      useGame.setState({
        lastEvents: [{ type: 'ERROR_AKSI', pesan: 'Gawat!' }],
        eventTick: 2,
      })
    })
    const toast = document.querySelector('.toast--bahaya')!
    expect(toast.getAttribute('role')).toBe('alert')
    expect(toast.getAttribute('aria-live')).toBe('assertive')
  })

  it('klik toast menutupnya segera (audit premium 2026-07-23: klik=tutup)', async () => {
    render(<Toaster />)
    act(() => {
      useGame.setState({
        lastEvents: [{ type: 'DEX_BERTAMBAH', kasusId: 'uji-tutup', bintang: 2 }],
        eventTick: 3,
      })
    })
    const toast = document.querySelector('.toast')!
    expect(toast).not.toHaveClass('toast--keluar')
    act(() => {
      toast.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    // Klik memicu fase mengabur seketika (timer 0 ms) lalu dihapus 450 ms
    // kemudian — cukup pastikan fase keluar aktif tanpa menunggu timer nyata.
    await waitFor(() => expect(document.querySelector('.toast--keluar')).not.toBeNull())
  })

  it('memberi tahu pemain setelah renderer pulih otomatis dari crash', async () => {
    window.primer = {
      save: { write: async () => true, read: async () => null, list: async () => [], delete: async () => true },
      telemetri: { append: async () => true, read: async () => [] },
      runtime: {
        consumeRecovery: async () => ({ occurredAt: '2026-07-22T00:00:00.000Z', reason: 'crashed', exitCode: 1 }),
        readCrashLog: async () => [],
        logError: async () => true,
      },
      appVersion: async () => 'test',
    }
    render(<Toaster />)
    await waitFor(() => expect(screen.getByText(/memulihkan sesi dari autosave/i)).toBeInTheDocument())
    expect(screen.getByText(/memulihkan sesi dari autosave/i).closest('[role="alert"]')).toBeInTheDocument()
  })
})
