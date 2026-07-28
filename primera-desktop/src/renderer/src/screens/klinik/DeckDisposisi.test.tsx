import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { PACK } from '@content/index'
import { buatEncounter } from '@engine/clinic'
import { buatPasienDariKasus } from '@engine/director'
import { Rng } from '@engine/core/rng'
import { DeckDisposisi } from './DeckDisposisi'

describe('<DeckDisposisi /> - observasi klinis', () => {
  it('menjalankan observasi terstruktur, lalu menampilkan hasil nilai ulang', () => {
    const kasus = PACK.kasus.diare_akut_anak!
    const enc = {
      ...buatEncounter(buatPasienDariKasus(kasus.id, PACK, new Rng(11, 'ui-observasi'))),
      fase: 'disposisi' as const,
      diagnosis: { icd10: kasus.icd10, jenis: 'suspek' as const },
    }
    const dispatch = vi.fn()
    const { rerender } = render(
      <DeckDisposisi enc={enc} kasus={kasus} dispatch={dispatch} />,
    )

    expect(screen.getByText('Observasi & nilai ulang')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'OBSERVASI' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'MULAI OBSERVASI' }))
    expect(dispatch).toHaveBeenCalledWith({ type: 'MULAI_OBSERVASI' })

    rerender(
      <DeckDisposisi
        enc={{ ...enc, observasiDimulai: true }}
        kasus={kasus}
        dispatch={dispatch}
      />,
    )
    expect(screen.queryByText('HASIL NILAI ULANG')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'NILAI ULANG SETELAH 240 MENIT' }))
    expect(dispatch).toHaveBeenCalledWith({ type: 'NILAI_ULANG_OBSERVASI' })

    rerender(
      <DeckDisposisi
        enc={{ ...enc, observasiDimulai: true, observasiDilakukan: true }}
        kasus={kasus}
        dispatch={dispatch}
      />,
    )
    expect(screen.getByText('HASIL NILAI ULANG')).toBeInTheDocument()
    expect(screen.getByText(kasus.observasi!.hasilUlang)).toBeInTheDocument()
  })

  it('kasus biasa tidak lagi menampilkan tombol observasi generik', () => {
    const kasus = PACK.kasus.ispa_common_cold!
    const enc = {
      ...buatEncounter(buatPasienDariKasus(kasus.id, PACK, new Rng(12, 'ui-observasi'))),
      fase: 'disposisi' as const,
      diagnosis: { icd10: kasus.icd10, jenis: 'tegak' as const },
    }
    render(<DeckDisposisi enc={enc} kasus={kasus} dispatch={() => {}} />)

    expect(screen.queryByText('Observasi & nilai ulang')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'OBSERVASI' })).not.toBeInTheDocument()
  })

  it('kasus yang sah menunggu lab memakai label khusus, bukan observasi generik', () => {
    const kasus = PACK.kasus.tb_paru!
    const enc = {
      ...buatEncounter(buatPasienDariKasus(kasus.id, PACK, new Rng(13, 'ui-observasi'))),
      fase: 'disposisi' as const,
      diagnosis: { icd10: kasus.icd10, jenis: 'suspek' as const },
      labDipesan: ['bta_sputum'],
    }
    const dispatch = vi.fn()
    render(<DeckDisposisi enc={enc} kasus={kasus} dispatch={dispatch} />)

    const tombol = screen.getByRole('button', { name: /TUNGGU HASIL/ })
    fireEvent.click(tombol)
    expect(dispatch).toHaveBeenCalledWith({ type: 'DISPOSISI', jenis: 'observasi' })
  })
})
