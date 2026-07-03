/**
 * TEST KOMPONEN — Hud (harness jsdom+RTL, CODEX audit 2026-07-04 #8 §9).
 * Cakup kelas bug yang sebelumnya lolos audit manual: total hari per-mode
 * (mirip bug Rapor.tsx "dari 90" hardcode di mode ujian), wiring klik→dispatch,
 * dan guard navigasi saat encounter/kunjungan/IGD aktif.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { HARI_BUKA_PETA } from '@engine/reducer'
import { buatPasienDariKasus } from '@engine/director'
import { Rng } from '@engine/core/rng'
import { PACK } from '@content/index'
import { Hud } from './Hud'

function pasangState(mode: 'karier' | 'ujian' = 'karier') {
  const state = buildInitialState('Uji Komponen', 1, PACK, { mode })
  useGame.setState({ state })
  return state
}

describe('<Hud />', () => {
  beforeEach(() => {
    pasangState()
  })

  it('total hari mengikuti mode stase (karier 90, bukan hardcode)', () => {
    pasangState('karier')
    render(<Hud />)
    expect(screen.getByText('/90')).toBeInTheDocument()
  })

  it('total hari 30 di mode ujian — bukan warisan 90 dari karier', () => {
    pasangState('ujian')
    render(<Hud />)
    expect(screen.getByText('/30')).toBeInTheDocument()
    expect(screen.queryByText('/90')).not.toBeInTheDocument()
  })

  it('klik tab Rapor men-dispatch PINDAH_LAYAR dan menandai tab aktif', async () => {
    render(<Hud />)
    const user = userEvent.setup()
    expect(useGame.getState().state?.layar).toBe('meja')

    await user.click(screen.getByRole('button', { name: /Rapor/ }))

    expect(useGame.getState().state?.layar).toBe('rapor')
    expect(screen.getByRole('button', { name: /Rapor/ })).toHaveClass('hud__tab--aktif')
  })

  it('Peta Desa terkunci (🔒) sebelum HARI_BUKA_PETA', () => {
    const state = pasangState()
    expect(state.hari).toBeLessThan(HARI_BUKA_PETA)
    render(<Hud />)
    expect(screen.getByRole('button', { name: /Peta Desa/ })).toHaveTextContent('🔒')
  })

  it('semua tab selain Klinik terkunci saat encounter klinik aktif', () => {
    const state = pasangState()
    const kasusId = Object.keys(PACK.kasus)[0]!
    const pasien = buatPasienDariKasus(kasusId, PACK, new Rng(1, 'hud-test'))
    useGame.setState({
      state: {
        ...state,
        klinik: {
          ...state.klinik,
          aktif: {
            pasien,
            fase: 'anamnesis',
            ditanya: [],
            sabar: 100,
            vitalDiukur: false,
            diperiksa: [],
            labDipesan: [],
            labTersedia: [],
            resep: [],
            edukasi: [],
            firewallTerpicu: 0,
          },
        },
      },
    })
    render(<Hud />)
    expect(screen.getByRole('button', { name: /Klinik/ })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /Rapor/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Buku Saku/ })).toBeDisabled()
  })
})
