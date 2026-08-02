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

/**
 * Sapuan delivery 2026-08-02: penulis konten kini boleh memisahkan gagasan
 * dgn baris kosong. Dulu seluruh teks diratakan lebih dulu sehingga pemisah
 * itu hilang dan pemecahan jatuh ke tebakan batas kata semata.
 */
describe('pecahTeksTerbaca — menghormati pemisah paragraf penulis', () => {
  it('baris kosong SELALU memulai paragraf baru, walau kedua sisi masih pendek', () => {
    const hasil = pecahTeksTerbaca('Gagasan pertama, ringkas.\n\nGagasan kedua, juga ringkas.', 55)
    expect(hasil).toEqual(['Gagasan pertama, ringkas.', 'Gagasan kedua, juga ringkas.'])
  })

  it('pemecahan batas-kata tetap bekerja DI DALAM tiap blok', () => {
    const panjang = Array.from({ length: 12 }, (_, i) => `Kalimat nomor ${i + 1} berisi beberapa kata tambahan.`).join(' ')
    const hasil = pecahTeksTerbaca(`Pembuka singkat.\n\n${panjang}`, 20)
    expect(hasil[0]).toBe('Pembuka singkat.')
    expect(hasil.length).toBeGreaterThan(2)
  })

  it('baris kosong berlebih atau spasi di antaranya tak menghasilkan paragraf kosong', () => {
    const hasil = pecahTeksTerbaca('Satu.\n\n\n   \n\nDua.', 55)
    expect(hasil).toEqual(['Satu.', 'Dua.'])
  })
})
