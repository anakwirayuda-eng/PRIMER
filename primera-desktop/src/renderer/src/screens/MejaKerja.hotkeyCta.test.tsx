/**
 * TEST — S2-mejakerja-sore: hotkey "L" menjalankan CTA besar Meja Kerja +
 * panel sore tersusun diegetis (Refleksi sebelum Arsip Manual, kini terlipat TERBUKA).
 * Pagar hotkey identik dgn angka 1-5 (useHotkeyNavigasi): mati saat mengetik
 * dan saat ada [role="dialog"] terbuka.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { useGame } from '../store'
import { MejaKerja } from './MejaKerja'
import { buildInitialState } from '@engine/init'
import { advance } from '@engine/reducer'
import { PACK } from '@content/index'
import type { GameState } from '@engine/state'

function pasangPrimerStub() {
  window.primer = {
    save: {
      write: async () => true,
      read: async () => null,
      list: async () => [],
      delete: async () => true,
    },
    telemetri: {
      append: async () => true,
      read: async () => [],
    },
    appVersion: async () => 'test',
  }
}

/** Ke blok sore hari 1 (pola sama MejaKerja.overwrite.test.tsx). */
function soreHariIni(): GameState {
  let s = buildInitialState('Uji Hotkey', 909090, PACK)
  let guard = 0
  while (s.blok !== 'sore' && guard++ < 10) {
    while (s.igd && guard++ < 40) {
      const kasus = PACK.kasusIgd[s.igd.kasusId]!
      if (s.igd.fase === 'langkah') {
        const l = kasus.langkah[s.igd.langkahIndex]!
        s = advance(s, { type: 'AKSI_IGD', langkahId: l.id, pilihanId: (l.pilihan.find((p) => p.benar) ?? l.pilihan[0]!).id }, PACK).state
      } else if (s.igd.fase === 'kode_biru') s = advance(s, { type: 'RJP_IGD', berkualitas: true }, PACK).state
      else if (s.igd.fase === 'pasca_rosc') s = advance(s, { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' }, PACK).state
      else if (s.igd.fase === 'disposisi') s = advance(s, { type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar }, PACK).state
      else break
    }
    s = advance(s, { type: 'LANJUTKAN' }, PACK).state
  }
  return s
}

function tekan(key: string, repeat = false): void {
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, repeat, bubbles: true, cancelable: true }))
  })
}

function renderSore(): GameState {
  pasangPrimerStub()
  const s = soreHariIni()
  useGame.setState({ state: s, slots: [], meta: null, arsip: null, sedangMemuat: false })
  render(<MejaKerja />)
  return s
}

afterEach(() => {
  document.querySelectorAll('[data-uji-dialog]').forEach((el) => el.remove())
})

describe('<MejaKerja /> — hotkey L & susunan panel sore', () => {
  it('hotkey L menjalankan CTA (sore: Tidur → hari berikutnya)', () => {
    const s = renderSore()
    tekan('l')
    expect(useGame.getState().state?.hari).toBe(s.hari + 1)
  })

  it('L saat mengetik di refleksi TIDAK membajak', () => {
    const s = renderSore()
    const refleksi = screen.getByPlaceholderText(/Apa yang kamu pelajari hari ini/)
    act(() => {
      refleksi.focus()
    })
    tekan('l')
    expect(useGame.getState().state?.hari).toBe(s.hari)
  })

  it('L mati saat ada [role="dialog"] terbuka; hidup lagi setelah ditutup', () => {
    const s = renderSore()
    const dialog = document.createElement('div')
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('data-uji-dialog', '1')
    document.body.appendChild(dialog)
    tekan('l')
    expect(useGame.getState().state?.hari).toBe(s.hari)
    dialog.remove()
    tekan('l')
    expect(useGame.getState().state?.hari).toBe(s.hari + 1)
  })

  // CTA bukan aksi idempotent seperti hotkey angka 1-5: tiap ulangan menjalankan
  // LANJUTKAN baru yang ter-autosave. Tombol L yang ditahan (auto-repeat ~30×/dtk,
  // atau tuts macet) karena itu bisa melewatkan blok demi blok tanpa niat.
  it('L yang DITAHAN (auto-repeat) tidak menjalankan CTA berulang', () => {
    const s = renderSore()
    tekan('l', true)
    tekan('l', true)
    tekan('l', true)
    expect(useGame.getState().state?.hari).toBe(s.hari)
  })

  it('setelah tombol dilepas, ketukan L berikutnya tetap bekerja', () => {
    const s = renderSore()
    tekan('l', true)
    expect(useGame.getState().state?.hari).toBe(s.hari)
    tekan('l')
    expect(useGame.getState().state?.hari).toBe(s.hari + 1)
  })

  it('panel sore: Refleksi mendahului Arsip Manual, dan Arsip terlipat TERBUKA (audit UX 2026-08-23: dulu tertutup, nyaris tak-terlihat)', () => {
    renderSore()
    const arsip = document.querySelector('details.mk__arsip') as HTMLDetailsElement | null
    expect(arsip).not.toBeNull()
    expect(arsip!.open).toBe(true)
    const refleksi = screen.getByPlaceholderText(/Apa yang kamu pelajari hari ini/)
    expect(
      arsip!.compareDocumentPosition(refleksi) & Node.DOCUMENT_POSITION_PRECEDING,
    ).toBeTruthy()
  })
})
