/**
 * TEST — Toaster: live-region aria harus per-toast, bukan di wrapper batch
 * (CODEX audit UI/UX 2026-07-10 #25). aria-atomic="true" pada wrapper yang
 * membungkus banyak toast sekaligus salah sasaran — screen reader berpotensi
 * membacakan ULANG seluruh isi wrapper tiap mutasi, bukan cuma toast baru.
 */
import { describe, expect, it, afterEach } from 'vitest'
import { act, render, cleanup } from '@testing-library/react'
import { useGame } from '../store'
import { Toaster } from './Toaster'

describe('<Toaster /> — aria-live per-toast (CODEX audit UI/UX 2026-07-10 #25)', () => {
  afterEach(() => {
    cleanup()
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
    expect(toast.getAttribute('role')).toBe('status')
    expect(toast.getAttribute('aria-live')).toBe('assertive')
    expect(toast.getAttribute('aria-atomic')).toBe('true')
  })
})
