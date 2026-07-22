import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { SumberKlinis } from '@content/types'
import { BuktiKlinis, urlSumberAman } from './BuktiKlinis'

const SUMBER: SumberKlinis[] = [
  {
    id: 'indonesia',
    label: 'Pedoman Indonesia',
    url: 'https://kemkes.go.id/pedoman.pdf',
    tahun: 2025,
    jenis: 'pedoman_indonesia',
  },
  {
    id: 'evidence',
    label: 'Evidence International',
    url: 'https://example.org/guideline',
    tahun: 2026,
    jenis: 'evidence_internasional',
  },
]

describe('<BuktiKlinis />', () => {
  it('ringkas secara default dan membuka sitasi yang terbaca serta dapat difokuskan', async () => {
    render(
      <BuktiKlinis
        namaKasus="Kasus Uji"
        ringkasan="Pertahankan ABC, cegah hipoksia, dan rujuk sesuai kemampuan fasilitas tujuan."
        sumber={SUMBER}
      />,
    )

    const summary = screen.getByText('Panduan resmi & sumber')
    const details = summary.closest('details')
    expect(details).not.toHaveAttribute('open')
    expect(screen.getByText('2 rujukan')).toBeVisible()

    await userEvent.click(summary)
    expect(details).toHaveAttribute('open')
    expect(screen.getByText('INTI KEPUTUSAN')).toBeVisible()
    expect(screen.getByText(/INDONESIA.*2025/)).toBeVisible()
    expect(screen.getByText(/EBM.*2026/)).toBeVisible()

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
      expect(link).toHaveAccessibleName(/buka di browser bawaan/i)
    }
  })

  it('tidak membuat tautan untuk URL non-HTTPS atau berisi kredensial', async () => {
    const sumberRusak: SumberKlinis[] = [{ ...SUMBER[0]!, url: 'http://contoh.invalid' }]
    render(
      <BuktiKlinis
        defaultOpen
        namaKasus="Kasus Uji"
        ringkasan="Ringkasan."
        sumber={sumberRusak}
      />,
    )

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText(/Tautan tidak aman diblokir/)).toBeVisible()
    expect(urlSumberAman('https://example.org/source')).toBe(true)
    expect(urlSumberAman('http://example.org/source')).toBe(false)
    expect(urlSumberAman('https://user:secret@example.org/source')).toBe(false)
    expect(urlSumberAman('bukan-url')).toBe(false)
  })
})
