/**
 * TEST KOMPONEN — impor log telemetri di TitleScreen (DeepThink ronde-2,
 * keputusan user: deteksi save-scumming). Probe: log bersih → stempel hijau;
 * log dgn pola hari-mundur → stempel kunyit + peringatan tampil; verdict ini
 * TIDAK memengaruhi kartu "Verifikasi Dossier" yang terpisah.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame } from '../store'
import { TitleScreen } from './TitleScreen'

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

function fileDari(isi: string): File {
  return new File([isi], 'telemetri.jsonl', { type: 'text/plain' })
}

describe('<TitleScreen /> — impor log telemetri', () => {
  it('log bersih (progres normal) → stempel TELEMETRI: BERSIH', async () => {
    pasangPrimerStub()
    useGame.setState({ arsip: null, slots: [], meta: null, sedangMemuat: false })
    render(<TitleScreen />)
    const user = userEvent.setup()

    const log = [
      JSON.stringify({ t: 1000, hari: 1, blok: 'pagi', jejakLen: 2 }),
      JSON.stringify({ t: 2000, hari: 2, blok: 'pagi', jejakLen: 8 }),
    ].join('\n')
    const input = screen.getByLabelText(/Impor Log Telemetri/) as HTMLInputElement
    await user.upload(input, fileDari(log))

    expect(await screen.findByText('TELEMETRI: BERSIH')).toBeInTheDocument()
  })

  it('log dgn hari mundur → stempel TELEMETRI: MENCURIGAKAN + peringatan tampil', async () => {
    pasangPrimerStub()
    useGame.setState({ arsip: null, slots: [], meta: null, sedangMemuat: false })
    render(<TitleScreen />)
    const user = userEvent.setup()

    const log = [
      JSON.stringify({ t: 1000, hari: 5, blok: 'pagi', jejakLen: 40 }),
      JSON.stringify({ t: 2000, hari: 3, blok: 'pagi', jejakLen: 42 }), // hari mundur, jejak tak reset
    ].join('\n')
    const input = screen.getByLabelText(/Impor Log Telemetri/) as HTMLInputElement
    await user.upload(input, fileDari(log))

    expect(await screen.findByText('TELEMETRI: MENCURIGAKAN')).toBeInTheDocument()
    expect(screen.getByText(/[Hh]ari mundur/)).toBeInTheDocument()
  })
})
