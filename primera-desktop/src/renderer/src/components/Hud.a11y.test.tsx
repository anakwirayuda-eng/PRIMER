/**
 * TEST — nama-aksesibel HUD (audit UI/UX 2026-07-23).
 * Bug asli: nama tab = gabungan mentah label+badge+gembok ("Meja Kerja2",
 * "Peta Desa🔒") dan tab yang disabled saat sesi berjalan bisu tanpa alasan.
 */
import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PACK } from '@content/index'
import { buildInitialState } from '@engine/init'
import { buatEncounter } from '@engine/clinic'
import { useGame } from '../store'
import { Hud } from './Hud'

describe('Hud — nama-aksesibel tab & alasan disabled', () => {
  beforeEach(() => {
    useGame.setState({ state: buildInitialState('Uji A11y', 42, PACK) })
  })

  it('tab Meja Kerja menyebut jumlah surat baru sebagai kalimat, bukan angka menempel', () => {
    render(<Hud />)
    // Hari 1: 2 surat belum dibaca (sambutan Kapus + panduan).
    expect(screen.getByRole('button', { name: /Meja Kerja, \d+ surat baru/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Meja Kerja2' })).not.toBeInTheDocument()
  })

  it('tab Klinik menyebut pasien antre; tab Peta terkunci menyebut alasannya', () => {
    render(<Hud />)
    expect(screen.getByRole('button', { name: /Klinik, \d+ pasien antre/ })).toBeInTheDocument()
    const peta = screen.getByRole('button', { name: /Peta Desa \(terkunci, terbuka besok\)/ })
    expect(peta).toBeDisabled()
    expect(peta).toHaveAttribute('title', 'Terbuka besok')
  })

  it('saat encounter klinik aktif, tab lain disabled DENGAN tooltip alasan', () => {
    const awal = buildInitialState('Uji A11y', 42, PACK)
    useGame.setState({
      state: {
        ...awal,
        klinik: { ...awal.klinik, aktif: buatEncounter(awal.klinik.antrian[0]!) },
      },
    })
    render(<Hud />)
    const meja = screen.getByRole('button', { name: /Meja Kerja/ })
    expect(meja).toBeDisabled()
    expect(meja).toHaveAttribute('title', 'Sedang memeriksa pasien — selesaikan dulu konsultasinya.')
  })
})
