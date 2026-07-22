import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { DebriefIgd, SumberKlinis } from '@content/types'
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

const DEBRIEF: DebriefIgd = {
  poinKunci: ['Stabilkan sebelum transfer.', 'Pra-notifikasi jejaring sejak awal.', 'Dokumentasikan respons serial.'],
  realitaFktp: 'Puskesmas menyiapkan tindakan jembatan yang aman tanpa mengklaim kemampuan definitif rumah sakit.',
  sumberDaya: {
    ready: ['oksigen dan monitor'],
    melaluiJejaring: ['ICU dan pencitraan'],
    tidakReady: ['terapi definitif'],
  },
  kontinuitas: 'Setelah rujuk balik, nilai pemulihan, terapi, hambatan keluarga, dan kebutuhan rehabilitasi.',
  bridgeUkm: {
    judul: 'Dari Pasien ke Perbaikan Sistem',
    ringkasan: 'Data episode dianonimkan untuk memperbaiki kesiapan tim, rute rujukan, dan pencegahan tingkat komunitas.',
  },
}

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

  it('menyajikan debrief bertingkat tanpa memenuhi panel utama', async () => {
    const user = userEvent.setup()
    render(
      <BuktiKlinis
        defaultOpen
        namaKasus="Kasus Uji"
        ringkasan="Ringkasan."
        sumber={SUMBER}
        debrief={DEBRIEF}
      />,
    )

    expect(screen.getByText('YANG PERLU MENETAP')).toBeVisible()
    expect(screen.getByText('Stabilkan sebelum transfer.')).toBeVisible()

    const realita = screen.getByText('Realita FKTP & kesiapan sumber daya').closest('details')
    const kontinuitas = screen.getByText('Kelanjutan perawatan').closest('details')
    const bridge = screen.getByText('Dari Pasien ke Perbaikan Sistem').closest('details')
    expect(realita).not.toHaveAttribute('open')
    expect(kontinuitas).not.toHaveAttribute('open')
    expect(bridge).not.toHaveAttribute('open')

    await user.click(screen.getByText('Realita FKTP & kesiapan sumber daya'))
    expect(realita).toHaveAttribute('open')
    expect(screen.getByText('READY DI SUKAMAJU')).toBeVisible()
    expect(screen.getByText('MELALUI JEJARING')).toBeVisible()
    expect(screen.getByText('TIDAK READY')).toBeVisible()

    await user.click(screen.getByText('Kelanjutan perawatan'))
    await user.click(screen.getByText('Dari Pasien ke Perbaikan Sistem'))
    expect(kontinuitas).toHaveAttribute('open')
    expect(bridge).toHaveAttribute('open')
  })
})
