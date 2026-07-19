import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { pecahTeksTerbaca, TeksTerbaca } from './TeksTerbaca'

describe('TeksTerbaca', () => {
  it('mempertahankan teks pendek sebagai satu paragraf', () => {
    expect(pecahTeksTerbaca('Kalimat pendek. Masih mudah dibaca.')).toEqual([
      'Kalimat pendek. Masih mudah dibaca.',
    ])
  })

  it('memecah teks panjang hanya pada batas kalimat', () => {
    const teks = 'Satu dua tiga empat. Lima enam tujuh delapan. Sembilan sepuluh.'
    expect(pecahTeksTerbaca(teks, 5)).toEqual([
      'Satu dua tiga empat.',
      'Lima enam tujuh delapan.',
      'Sembilan sepuluh.',
    ])
  })

  it('menjaga isi dan urutan saat dirender', () => {
    const teks = 'Langkah pertama dijelaskan. Langkah kedua menyusul. Langkah ketiga menutup.'
    const { container } = render(<TeksTerbaca teks={teks} batasKata={5} className="teks-kecil" />)
    expect(container.querySelectorAll('p')).toHaveLength(3)
    expect(container).toHaveTextContent(/Langkah pertama dijelaskan.*Langkah kedua menyusul.*Langkah ketiga menutup/s)
    expect(screen.getByText('Langkah kedua menyusul.')).toBeInTheDocument()
  })
})
