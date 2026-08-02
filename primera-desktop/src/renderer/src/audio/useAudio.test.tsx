/**
 * TEST — useAudio: pemetaan GameEvent → SFX (DeepThink "game juice", 2026-07-04).
 * Kunci klaim: Kode Hitam TIDAK LAGI memakai sfxBuzzer (dulu disamakan dgn
 * kesalahan rutin) — kini sfxKodeHitam + duck BGM. Surat kabar-buruk
 * (teguran/karma/igd) pakai buzzer, surat rutin tetap bel ceria.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, render } from '@testing-library/react'
import { useGame } from '../store'
import type { GameEvent } from '@engine/events'

vi.mock('./synth', () => ({
  initAudio: vi.fn(),
  disposeAudio: vi.fn(),
  sfxStempel: vi.fn(),
  sfxBlip: vi.fn(),
  sfxBel: vi.fn(),
  sfxBuzzer: vi.fn(),
  sfxKodeHitam: vi.fn(),
  sfxArpeggio: vi.fn(),
  sfxPagi: vi.fn(),
  sfxSelesai: vi.fn(),
}))
vi.mock('./bgm', () => ({ redamBgm: vi.fn() }))

import { sfxBuzzer, sfxKodeHitam, sfxBel } from './synth'
import { redamBgm } from './bgm'
import { useAudio } from './useAudio'

function Harness() {
  useAudio()
  return null
}

function tembakEvent(ev: GameEvent): void {
  const tick = useGame.getState().eventTick + 1
  act(() => {
    useGame.setState({ lastEvents: [ev], eventTick: tick })
  })
}

describe('useAudio — pemetaan event ke SFX', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGame.setState({ lastEvents: [], eventTick: 0 })
    render(<Harness />)
  })

  it('KODE_HITAM memakai sfxKodeHitam + redamBgm, BUKAN sfxBuzzer (dulu disamakan dgn kesalahan rutin)', () => {
    tembakEvent({ type: 'KODE_HITAM', narasi: 'Kode Hitam. Uji tidak tertolong.' })
    expect(sfxKodeHitam).toHaveBeenCalledTimes(1)
    expect(redamBgm).toHaveBeenCalledTimes(1)
    expect(sfxBuzzer).not.toHaveBeenCalled()
  })

  it('surat kabar-buruk (teguran_kapus) memakai buzzer, bukan bel ceria', () => {
    tembakEvent({
      type: 'SURAT_MASUK',
      surat: { id: 's1', hari: 1, jenis: 'teguran_kapus', dari: 'x', judul: 'x', isi: 'x', dibaca: false },
    })
    expect(sfxBuzzer).toHaveBeenCalledTimes(1)
    expect(sfxBel).not.toHaveBeenCalled()
  })

  it('surat karma & igd (kabar buruk lain) juga memakai buzzer', () => {
    tembakEvent({ type: 'SURAT_MASUK', surat: { id: 's2', hari: 1, jenis: 'karma', dari: 'x', judul: 'x', isi: 'x', dibaca: false } })
    tembakEvent({ type: 'SURAT_MASUK', surat: { id: 's3', hari: 1, jenis: 'igd', dari: 'x', judul: 'x', isi: 'x', dibaca: false } })
    expect(sfxBuzzer).toHaveBeenCalledTimes(2)
  })

  it('surat RUTIN (laporan_kader/kabar_warga/dll) tetap memakai bel ceria', () => {
    tembakEvent({
      type: 'SURAT_MASUK',
      surat: { id: 's4', hari: 1, jenis: 'laporan_kader', dari: 'x', judul: 'x', isi: 'x', dibaca: false },
    })
    expect(sfxBel).toHaveBeenCalledTimes(1)
    expect(sfxBuzzer).not.toHaveBeenCalled()
  })
})
