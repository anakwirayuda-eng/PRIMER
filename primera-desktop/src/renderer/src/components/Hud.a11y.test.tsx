/**
 * TEST — nama-aksesibel HUD (audit UI/UX 2026-07-23).
 * Bug asli: nama tab = gabungan mentah label+badge+gembok ("Meja Kerja2",
 * "Peta Desa🔒") dan tab yang disabled saat sesi berjalan bisu tanpa alasan.
 */
import { describe, expect, it, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
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
    expect(peta).toHaveAttribute('aria-disabled', 'true')
    expect(peta).not.toBeDisabled()
    expect(peta).toHaveAccessibleDescription('Terbuka besok')
    // Audit premium 2026-07-23: `title` native (delay ~1 dtk, tak muncul utk
    // keyboard) diganti tooltip instan .hud__tip — tampil saat hover DAN fokus.
    fireEvent.focus(peta)
    expect(document.querySelector('.hud__tip')).toHaveTextContent('Terbuka besok')
    fireEvent.blur(peta)
    expect(document.querySelector('.hud__tip')).toBeNull()
  })

  it('saat encounter klinik aktif, tab lain disabled DENGAN tooltip alasan', () => {
    const awal = buildInitialState('Uji A11y', 42, PACK)
    useGame.setState({
      state: {
        ...awal,
        layar: 'klinik',
        klinik: { ...awal.klinik, aktif: buatEncounter(awal.klinik.antrian[0]!) },
      },
    })
    render(<Hud />)
    const meja = screen.getByRole('button', { name: /Meja Kerja/ })
    expect(meja).toHaveAttribute('aria-disabled', 'true')
    expect(meja).not.toBeDisabled()
    expect(meja).toHaveAccessibleDescription('Sedang memeriksa pasien — selesaikan dulu konsultasinya.')
    meja.click()
    expect(useGame.getState().state?.layar).toBe('klinik')
    // Tooltip instan tampil saat pointer masuk (pengganti `title` native).
    fireEvent.mouseEnter(meja)
    expect(document.querySelector('.hud__tip')).toHaveTextContent(
      'Sedang memeriksa pasien — selesaikan dulu konsultasinya.',
    )
    fireEvent.mouseLeave(meja)
    expect(document.querySelector('.hud__tip')).toBeNull()
  })
})
