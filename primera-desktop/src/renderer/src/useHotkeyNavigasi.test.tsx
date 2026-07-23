/**
 * TEST — useHotkeyNavigasi (audit premium 2026-07-23): hotkey angka 1-5 harus
 * memakai gate yang SAMA dengan tombol tab HUD. Kelas bug yang dijaga:
 * (a) hotkey menembus layar terkunci/encounter yang tombolnya digembok;
 * (b) hotkey membajak angka yang sedang diketik ke input;
 * (c) hotkey menavigasi diam-diam di belakang modal terbuka.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useGame } from './store'
import { buildInitialState } from '@engine/init'
import { buatEncounter } from '@engine/clinic'
import { HARI_BUKA_PETA } from '@engine/reducer'
import { PACK } from '@content/index'
import { useHotkeyNavigasi } from './useHotkeyNavigasi'
import { URUTAN_TAB, alasanTabNonaktif } from './utils/navigasiHud'

function tekan(key: string, init: KeyboardEventInit = {}) {
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }))
  })
}

describe('useHotkeyNavigasi', () => {
  beforeEach(() => {
    useGame.setState({ state: buildInitialState('Uji Hotkey', 7, PACK) })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('angka 5 memindah layar ke Rapor (urutan sama dengan tab HUD)', () => {
    renderHook(() => useHotkeyNavigasi())
    expect(useGame.getState().state?.layar).toBe('meja')
    tekan('5')
    expect(useGame.getState().state?.layar).toBe('rapor')
  })

  it('angka 3 (Peta) DIABAIKAN sebelum HARI_BUKA_PETA — gate sama dgn tombol', () => {
    const state = useGame.getState().state!
    expect(state.hari).toBeLessThan(HARI_BUKA_PETA)
    renderHook(() => useHotkeyNavigasi())
    tekan('3')
    expect(useGame.getState().state?.layar).toBe('meja')
  })

  it('semua hotkey selain Klinik DIABAIKAN saat encounter klinik aktif', () => {
    const awal = useGame.getState().state!
    useGame.setState({
      state: {
        ...awal,
        layar: 'klinik',
        klinik: { ...awal.klinik, aktif: buatEncounter(awal.klinik.antrian[0]!) },
      },
    })
    renderHook(() => useHotkeyNavigasi())
    tekan('1')
    tekan('4')
    expect(useGame.getState().state?.layar).toBe('klinik')
  })

  it('angka yang diketik ke input TIDAK membajak navigasi', () => {
    renderHook(() => useHotkeyNavigasi())
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()
    tekan('5')
    expect(useGame.getState().state?.layar).toBe('meja')
  })

  it('hotkey mati selama modal [role="dialog"] terbuka', () => {
    renderHook(() => useHotkeyNavigasi())
    const modal = document.createElement('div')
    modal.setAttribute('role', 'dialog')
    document.body.appendChild(modal)
    tekan('5')
    expect(useGame.getState().state?.layar).toBe('meja')
    modal.remove()
    tekan('5')
    expect(useGame.getState().state?.layar).toBe('rapor')
  })

  it('Ctrl/Alt/Meta+angka dibiarkan utk shortcut OS — tidak menavigasi', () => {
    renderHook(() => useHotkeyNavigasi())
    tekan('5', { ctrlKey: true })
    tekan('5', { altKey: true })
    tekan('5', { metaKey: true })
    expect(useGame.getState().state?.layar).toBe('meja')
  })
})

describe('alasanTabNonaktif — kontrak gate bersama Hud & hotkey', () => {
  it('urutan tab hotkey = urutan tab HUD (5 layar)', () => {
    expect(URUTAN_TAB).toEqual(['meja', 'klinik', 'peta', 'dex', 'rapor'])
  })

  it('sesi lapangan (kunjungan/IGD/kegiatan) menggembok semua tab', () => {
    const state = buildInitialState('Uji Gate', 7, PACK)
    const kunjungan = { ...state, layar: 'kunjungan' as const }
    for (const layar of URUTAN_TAB) {
      if (layar === 'peta') continue // sudah terkunci oleh hari
      expect(alasanTabNonaktif(kunjungan, layar)).toMatch(/sesi berjalan/i)
    }
  })
})
