/**
 * TEST — DeckPemeriksaan: tombol "Pesan" lab dapat aria-label bernama
 * (CODEX audit UI/UX 2026-07-10, #15). Sebelum fix: SEMUA baris lab berbagi
 * accessible name identik ("Pesan"/"✓") — nama lab hanya di title (hover),
 * tak terbedakan lewat navigasi per-kontrol (screen reader/scan cepat).
 */
import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DeckPemeriksaan } from './DeckPemeriksaan'
import { buatEncounter } from '@engine/clinic'
import { buatPasienDariKasus } from '@engine/director'
import { Rng } from '@engine/core/rng'
import { PACK } from '@content/index'

describe('<DeckPemeriksaan /> — aria-label tombol Pesan lab bernama (#15)', () => {
  it('tombol "Pesan" tiap baris lab punya aria-label yang menyebut nama lab itu sendiri', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const enc = buatEncounter(pasien)
    render(<DeckPemeriksaan enc={enc} dispatch={() => {}} />)

    const contohLab = Object.values(PACK.lab)[0]!
    fireEvent.change(screen.getByLabelText('Cari lab'), { target: { value: contohLab.nama } })
    expect(screen.getByRole('button', { name: `Pesan ${contohLab.nama}` })).toBeInTheDocument()
  })

  it('lab yang sudah dipesan aria-label-nya berubah (bukan tetap generik)', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const contohLab = Object.values(PACK.lab)[0]!
    const enc = { ...buatEncounter(pasien), labDipesan: [contohLab.id] }
    render(<DeckPemeriksaan enc={enc} dispatch={() => {}} />)

    expect(screen.getByRole('button', { name: `${contohLab.nama} sudah dipesan` })).toBeInTheDocument()
  })
})

describe('<DeckPemeriksaan /> — fokus kembali ke kotak "Cari lab" sesudah pesan lab (bugfix 2026-07-13, sekelas "kena frozen lagi eh")', () => {
  it('klik "Pesan" memindahkan fokus ke input "Cari lab", bukan hilang ke <body>', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const enc = buatEncounter(pasien)
    const contohLab = Object.values(PACK.lab)[0]!

    render(<DeckPemeriksaan enc={enc} dispatch={() => {}} />)

    fireEvent.change(screen.getByLabelText('Cari lab'), { target: { value: contohLab.nama } })
    fireEvent.click(screen.getByRole('button', { name: `Pesan ${contohLab.nama}` }))

    // Sama seperti "+ Resep" di DeckTerapi: tombol ini `disabled` begitu
    // enc.labDipesan diperbarui (dispatch nyata) — disable memaksa fokus ke
    // <body>. Fokus HARUS sudah dipindah ke kotak cari SEBELUM itu terjadi.
    expect(document.activeElement).toBe(screen.getByLabelText('Cari lab'))
  })
})

describe('<DeckPemeriksaan /> — progressive disclosure laboratorium', () => {
  it('kelompok lab tertutup secara default dan pencarian membuka hasil yang cocok', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const enc = buatEncounter(pasien)
    const contohLab = Object.values(PACK.lab)[0]!
    render(<DeckPemeriksaan enc={enc} dispatch={() => {}} />)

    expect(screen.queryByRole('button', { name: `Pesan ${contohLab.nama}` })).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Cari lab'), { target: { value: contohLab.nama } })
    expect(screen.getByRole('button', { name: `Pesan ${contohLab.nama}` })).toBeInTheDocument()
  })
})
