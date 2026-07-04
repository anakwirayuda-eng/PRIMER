/**
 * TEST KOMPONEN — sorotan tutorial di Klinik (DeepThink "onboarding
 * railroaded", keputusan user). Kunci klaim: banner + sorotan tampil hanya
 * saat tutorialAktif DAN kasus aktif memang KASUS_TUTORIAL; tombol lain
 * terkunci (disabled) selama sorotan aktif.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { Klinik } from './Klinik'
import { KASUS_TUTORIAL } from './klinik/tutorialKlinik'

function pasang(): void {
  window.primer = {
    save: { write: async () => true, read: async () => null, list: async () => [], delete: async () => true },
    telemetri: { append: async () => true, read: async () => [] },
    appVersion: async () => 'test',
  }
  const s = buildInitialState('Uji Klinik', 42, PACK)
  useGame.setState({ state: s })
  useGame.getState().dispatch({ type: 'PANGGIL_PASIEN' })
}

describe('<Klinik /> — sorotan tutorial encounter pertama', () => {
  it('kasus aktif adalah KASUS_TUTORIAL, banner tampil, pertanyaan pertama disorot & lainnya terkunci', () => {
    pasang()
    expect(useGame.getState().state?.klinik.aktif?.pasien.kasusId).toBe(KASUS_TUTORIAL)

    render(<Klinik />)

    expect(screen.getByText(/Latihan pertama/)).toBeInTheDocument()

    const pertanyaan = screen.getAllByRole('button').filter((b) => b.className.includes('klinik-tanya'))
    expect(pertanyaan.length).toBeGreaterThan(1)
    const disorot = pertanyaan.filter((b) => b.className.includes('klinik-sorot-tutorial'))
    expect(disorot).toHaveLength(1)
    const terkunci = pertanyaan.filter((b) => !b.className.includes('klinik-sorot-tutorial'))
    expect(terkunci.every((b) => (b as HTMLButtonElement).disabled)).toBe(true)
  })

  it('setelah bertanya ≥1 kali, sorotan pindah ke tombol "Selesai Anamnesis"', () => {
    pasang()
    useGame.getState().dispatch({ type: 'TANYA', pertanyaanId: 'q_keluhan' })
    render(<Klinik />)
    const selesai = screen.getByRole('button', { name: /Selesai Anamnesis/ })
    expect(selesai.className).toMatch(/klinik-sorot-tutorial/)
    expect((selesai as HTMLButtonElement).disabled).toBe(false)
  })
})
