import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { PACK } from '@content/index'
import { buildInitialState } from '@engine/init'
import type { IgdState } from '@engine/state'
import { useGame } from '../store'
import { Igd } from './Igd'

function pasangDisposisi(kasusId: string): void {
  const kasus = PACK.kasusIgd[kasusId]!
  const state = buildInitialState('Uji tujuan IGD', 7, PACK)
  const igd: IgdState = {
    kasusId,
    pasienNama: 'Pasien Uji',
    usia: 50,
    jenisKelamin: 'L',
    rw: 1,
    fase: 'disposisi',
    langkahIndex: kasus.langkah.length,
    stabilitas: 80,
    jawaban: [],
  }
  useGame.setState({ state: { ...state, igd } })
}

describe('<Igd /> — keputusan tujuan rujukan', () => {
  it('rujuk terkunci sampai pemain memilih rumah sakit sendiri', () => {
    pasangDisposisi(Object.keys(PACK.kasusIgd)[0]!)
    render(<Igd />)

    const tombolRujuk = screen.getByRole('button', { name: /Pilih rumah sakit tujuan/i })
    expect(tombolRujuk).toBeDisabled()
    fireEvent.click(screen.getByRole('radio', { name: /RSUD Pratama Sukamaju/i }))
    expect(screen.getByRole('button', { name: /Rujuk ke RSUD Pratama Sukamaju/i })).toBeEnabled()
  })

  it('kasus IGD prototipe lab menampilkan status pengembangannya', () => {
    const kasus = Object.values(PACK.kasusIgd).find(
      (item) => item.activationStatus === 'lab_prototype_unadjudicated',
    )!
    pasangDisposisi(kasus.id)
    render(<Igd />)
    expect(screen.getByText('Prototipe lab')).toBeInTheDocument()
  })
})
