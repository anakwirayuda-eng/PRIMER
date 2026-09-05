import { expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BukuLapangan } from './BukuLapangan'

it('membandingkan maksimal dua catatan, menyaring sumber, dan mempertahankan perbandingan', async () => {
  const user = userEvent.setup()
  render(<BukuLapangan temuan={[{ id: 'lemari', label: 'Lemari obat', narasi: 'Kotak masih penuh.' }]} ucapan={[{ teks: 'Saya minum setiap pagi.' }, { teks: 'Kadang saya lupa.' }]} />)
  await user.click(screen.getByText('Rangkai bukti sebelum memutuskan'))
  await user.click(screen.getByRole('checkbox', { name: /Lemari obat/ }))
  await user.click(screen.getByRole('checkbox', { name: /Ucapan warga 1/ }))
  expect(screen.getByRole('checkbox', { name: /Ucapan warga 2/ })).toBeDisabled()
  await user.click(screen.getByRole('button', { name: 'Terdengar' }))
  expect(screen.queryByRole('checkbox', { name: /Lemari obat/ })).not.toBeInTheDocument()
  const banding = screen.getByRole('region', { name: 'Bukti untuk dibandingkan' })
  expect(within(banding).getByText('Kotak masih penuh.')).toBeInTheDocument()
  expect(within(banding).getByText('Saya minum setiap pagi.')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Lepas catatan Lemari obat' }))
  expect(screen.getByRole('checkbox', { name: /Ucapan warga 2/ })).toBeEnabled()
})
