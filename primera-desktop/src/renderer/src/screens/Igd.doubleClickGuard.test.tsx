/**
 * REGRESI — bug hunt ronde-2 (2026-08-01): tak satu pun tombol aksi IGD dulu
 * di-disable setelah diklik (beda dari Kegiatan.tsx yang sudah mengunci
 * pilihan). Klik ganda fisik/switch mouse aus/ghost-click yang tiba sangat
 * cepat bisa mendarat di tombol BARU yang menempati posisi sama begitu React
 * mengganti total blok JSX fase — mengotori jawaban/skor atau memicu pilihan
 * RJP/disposisi tanpa sengaja. dispatch di-mock TANPA mengubah state supaya
 * fase/langkahIndex tetap sama, mengisolasi murni perilaku disable UI dari
 * transisi state riil (yang sudah diuji test lain).
 */
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { PACK } from '@content/index'
import { buildInitialState } from '@engine/init'
import type { IgdState } from '@engine/state'
import { useGame } from '../store'
import { Igd } from './Igd'

function pasangLangkah(kasusId: string, dispatch: (action: unknown) => void): void {
  const state = buildInitialState('Uji guard IGD', 7, PACK)
  const igd: IgdState = {
    kasusId,
    pasienNama: 'Pasien Uji',
    usia: 40,
    jenisKelamin: 'L',
    rw: 1,
    fase: 'langkah',
    langkahIndex: 0,
    stabilitas: 80,
    jawaban: [],
  }
  useGame.setState({ state: { ...state, igd }, dispatch: dispatch as never })
}

describe('<Igd /> — tombol aksi terkunci setelah diklik (bug hunt ronde-2)', () => {
  it('fase langkah: klik kedua ke tombol pilihan LAIN tidak ikut ter-dispatch', () => {
    const kasus = Object.values(PACK.kasusIgd).find((k) => k.langkah[0]!.pilihan.length >= 2)!
    const dispatch = vi.fn()
    pasangLangkah(kasus.id, dispatch)
    render(<Igd />)

    const tombol = screen.getAllByRole('button', { name: kasus.langkah[0]!.pilihan[0]!.label })
    fireEvent.click(tombol[0]!)
    expect(dispatch).toHaveBeenCalledTimes(1)

    // Karena dispatch di-mock (state.igd tak berubah), fase/langkahIndex tetap
    // sama — guard TIDAK direset, semua tombol pilihan langkah ini kini terkunci.
    for (const btn of screen.getAllByRole('button')) {
      if (btn.className.includes('igd__opsi')) expect(btn).toBeDisabled()
    }

    const tombolLain = screen.getAllByRole('button', { name: kasus.langkah[0]!.pilihan[1]!.label })[0]!
    fireEvent.click(tombolLain)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })

  it('fase kode_biru: kedua tombol RJP terkunci setelah salah satu diklik', () => {
    const kasusId = Object.keys(PACK.kasusIgd)[0]!
    const dispatch = vi.fn()
    const state = buildInitialState('Uji guard IGD', 7, PACK)
    const igd: IgdState = {
      kasusId,
      pasienNama: 'Pasien Uji',
      usia: 40,
      jenisKelamin: 'L',
      rw: 1,
      fase: 'kode_biru',
      langkahIndex: 1,
      stabilitas: 0,
      jawaban: [],
    }
    useGame.setState({ state: { ...state, igd }, dispatch: dispatch as never })
    render(<Igd />)

    const tombolRjp = screen.getByRole('button', { name: /RJP berkualitas/i })
    fireEvent.click(tombolRjp)
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(tombolRjp).toBeDisabled()
    expect(screen.getByRole('button', { name: /Kompresi seadanya/i })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: /Kompresi seadanya/i }))
    expect(dispatch).toHaveBeenCalledTimes(1)
  })

  it('fase disposisi: tombol "pulangkan" (dulu tanpa gerbang sama sekali) kini terkunci setelah diklik', () => {
    const kasusId = Object.keys(PACK.kasusIgd)[0]!
    const kasus = PACK.kasusIgd[kasusId]!
    const dispatch = vi.fn()
    const state = buildInitialState('Uji guard IGD', 7, PACK)
    const igd: IgdState = {
      kasusId,
      pasienNama: 'Pasien Uji',
      usia: 40,
      jenisKelamin: 'L',
      rw: 1,
      fase: 'disposisi',
      langkahIndex: kasus.langkah.length,
      stabilitas: 80,
      jawaban: [],
    }
    useGame.setState({ state: { ...state, igd }, dispatch: dispatch as never })
    render(<Igd />)

    const tombolPulang = screen.getByRole('button', { name: /Observasi lalu pulangkan/i })
    expect(tombolPulang).toBeEnabled()
    fireEvent.click(tombolPulang)
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(tombolPulang).toBeDisabled()

    fireEvent.click(tombolPulang)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })

  it('fase langkah baru (langkahIndex berganti) membuka kunci lagi — bukan penguncian permanen', () => {
    const kasus = Object.values(PACK.kasusIgd).find((k) => k.langkah.length >= 2)!
    const dispatch = vi.fn()
    pasangLangkah(kasus.id, dispatch)
    const { rerender } = render(<Igd />)

    const tombol = screen.getAllByRole('button', { name: kasus.langkah[0]!.pilihan[0]!.label })[0]!
    fireEvent.click(tombol)
    expect(dispatch).toHaveBeenCalledTimes(1)

    // Simulasikan reducer beneran memajukan langkahIndex (bukan mock diam).
    const cur = useGame.getState().state!
    useGame.setState({ state: { ...cur, igd: { ...cur.igd!, langkahIndex: 1 } } })
    rerender(<Igd />)

    for (const btn of screen.getAllByRole('button')) {
      if (btn.className.includes('igd__opsi')) expect(btn).toBeEnabled()
    }
  })
})
