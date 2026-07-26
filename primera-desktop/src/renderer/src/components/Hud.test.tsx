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
            ditanyaKetus: [],
            sabar: 100,
            vitalDiukur: false,
            diperiksa: [],
            labDipesan: [],
            labTersedia: [],
            resep: [],
            edukasi: [],
            tindakan: [],
            firewallTerpicu: 0,
          },
        },
      },
    })
    render(<Hud />)
    expect(screen.getByRole('button', { name: /Klinik/ })).not.toHaveAttribute('aria-disabled')
    expect(screen.getByRole('button', { name: /Rapor/ })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('button', { name: /Buku Saku/ })).toHaveAttribute('aria-disabled', 'true')
  })

  it('stamina 7 (bonus olahraga) merender pip ke-7 bergaya bonus — bukan disembunyikan (audit logika 2026-07-23)', () => {
    const state = pasangState()
    useGame.setState({ state: { ...state, stamina: 7 } })
    render(<Hud />)
    // Engine SENGAJA mengizinkan 7/6 (m4ekonomi.test:291) — HUD dulu hardcode
    // 6 pip sehingga bonus tak pernah terlihat pemain.
    expect(document.querySelectorAll('.hud__pip')).toHaveLength(7)
    expect(document.querySelectorAll('.hud__pip--isi')).toHaveLength(7)
    expect(document.querySelectorAll('.hud__pip--bonus')).toHaveLength(1)
  })

  it('stamina normal tetap 6 pip tanpa pip bonus', () => {
    pasangState()
    render(<Hud />)
    expect(document.querySelectorAll('.hud__pip')).toHaveLength(6)
    expect(document.querySelectorAll('.hud__pip--bonus')).toHaveLength(0)
  })

  it('indikator "Gagal menyimpan" tampil saat statusSimpan === "gagal" (CODEX audit UI/UX 2026-07-10, #2)', () => {
    pasangState()
    useGame.setState({ statusSimpan: 'gagal' })
    render(<Hud />)
    expect(screen.getByText(/Gagal menyimpan/)).toBeInTheDocument()
  })

  it('indikator "Gagal menyimpan" TIDAK tampil saat statusSimpan idle/menyimpan', () => {
    pasangState()
    useGame.setState({ statusSimpan: 'idle' })
    render(<Hud />)
    expect(screen.queryByText(/Gagal menyimpan/)).not.toBeInTheDocument()
  })

  it('semua tab terkunci saat kegiatan lapangan aktif (CODEX ronde-11 #1 — dulu tak dijaga sama sekali)', () => {
    const state = pasangState()
    useGame.setState({
      state: {
        ...state,
        blok: 'siang',
        layar: 'kegiatan',
        kegiatan: { jenis: 'posyandu', rw: 1, kartu: [], index: 0, jawaban: [] },
      },
    })
    render(<Hud />)
    expect(screen.getByRole('button', { name: /Meja Kerja/ })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('button', { name: /Klinik/ })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('button', { name: /Rapor/ })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('button', { name: /Buku Saku/ })).toHaveAttribute('aria-disabled', 'true')
  })
})

describe('<Hud /> — aria-current tab aktif (CODEX audit UI/UX 2026-07-10, #16a)', () => {
  beforeEach(() => {
    pasangState()
  })

  it('tab yang cocok dengan state.layar punya aria-current="page", tab lain tidak punya atribut itu sama sekali', () => {
    const state = pasangState()
    useGame.setState({ state: { ...state, layar: 'meja' } })
    render(<Hud />)

    expect(screen.getByRole('button', { name: /Meja Kerja/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: /Klinik/ })).not.toHaveAttribute('aria-current')
  })
})
