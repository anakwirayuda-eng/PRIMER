import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { DexEntry } from '@engine/state'
import { DuelDiagnosis, TeachBack } from './RefleksiKlinis'

const entry = (kasusId: string): DexEntry => ({
  kasusId,
  ditangani: 1,
  benar: 1,
  bintang: 1,
  terakhirHari: 2,
})

describe('<DuelDiagnosis />', () => {
  it('tetap tersembunyi sampai kedua kasus pernah dijumpai', () => {
    const { rerender } = render(
      <DuelDiagnosis
        kasusId="bronkitis_akut"
        dex={{ bronkitis_akut: entry('bronkitis_akut') }}
      />,
    )
    expect(screen.queryByText('Duel diagnosis')).not.toBeInTheDocument()

    rerender(
      <DuelDiagnosis
        kasusId="bronkitis_akut"
        dex={{
          bronkitis_akut: entry('bronkitis_akut'),
          lab_pneumonia_komunitas_dewasa: entry('lab_pneumonia_komunitas_dewasa'),
        }}
      />,
    )
    expect(screen.getByText('Duel diagnosis')).toBeInTheDocument()
  })

  it('memberi umpan balik korektif langsung tanpa mengunci percobaan ulang', async () => {
    const user = userEvent.setup()
    render(
      <DuelDiagnosis
        kasusId="bronkitis_akut"
        dex={{
          bronkitis_akut: entry('bronkitis_akut'),
          lab_pneumonia_komunitas_dewasa: entry('lab_pneumonia_komunitas_dewasa'),
        }}
      />,
    )
    await user.click(screen.getByText('Duel diagnosis'))
    await user.click(screen.getByRole('button', { name: 'Dahak berwarna kuning saja' }))
    expect(screen.getByRole('status')).toHaveTextContent(/tidak membedakan/i)

    await user.click(
      screen.getByRole('button', { name: 'Takipnea disertai ronki fokal atau hipoksemia' }),
    )
    expect(screen.getByRole('status')).toHaveTextContent(/mengubah probabilitas/i)
  })
})

describe('<TeachBack />', () => {
  it('menolak prompt ya/tidak dan belum membuka jawaban pasien', async () => {
    const user = userEvent.setup()
    render(<TeachBack kasusId="asma_ringan" />)
    await user.click(screen.getByText('Demonstrasi ulang teknik inhaler'))
    await user.click(screen.getByRole('button', { name: 'Sudah paham semuanya, ya?' }))

    expect(screen.getByRole('status')).toHaveTextContent(/jawaban sopan/i)
    expect(screen.queryByText(/Saya semprotkan obat/)).not.toBeInTheDocument()
  })

  it('menjalankan satu siklus demonstrasi, ajar ulang, lalu penjelasan kembali', async () => {
    const user = userEvent.setup()
    render(<TeachBack kasusId="asma_ringan" />)
    await user.click(screen.getByText('Demonstrasi ulang teknik inhaler'))
    await user.click(
      screen.getByRole('button', {
        name: /Saya ingin memastikan penjelasan saya jelas.*cara memakai inhaler/i,
      }),
    )
    expect(screen.getByText(/Saya semprotkan obat/)).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: 'Anggap cukup karena pasien sudah mengulang sebagian pesan.',
      }),
    )
    expect(screen.getAllByRole('status').at(-1)).toHaveTextContent(/ajarkan kembali/i)
    expect(screen.queryByText(/Saya buang napas dulu/)).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: /Ajarkan ulang satu puff: ekshalasi, aktuasi sambil inspirasi perlahan/i,
      }),
    )
    expect(screen.getByText(/Saya buang napas dulu/)).toBeInTheDocument()
    expect(screen.getByText(/Demonstrasikan satu puff perlahan/)).toBeInTheDocument()
  })
})
