/**
 * TEST — LembarPeriksa: tombol coret resep dapat nama obat (CODEX audit
 * UI/UX 2026-07-10, #15). Sebelum fix: tombol HANYA berisi simbol "✕" dgn
 * title statis "Coret dari resep" — nama obat tak disebut sama sekali,
 * bahkan di title — tak terbedakan dari baris resep lain di kartu yang sama.
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LembarPeriksa } from './LembarPeriksa'
import { buatEncounter } from '@engine/clinic'
import { buatPasienDariKasus } from '@engine/director'
import { Rng } from '@engine/core/rng'
import { PACK } from '@content/index'

describe('<LembarPeriksa /> — aria-label tombol coret resep bernama (#15)', () => {
  it('tombol coret resep punya aria-label & title yang menyebut nama obatnya', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const contohObat = Object.values(PACK.obat)[0]!
    const enc = { ...buatEncounter(pasien), resep: [contohObat.id] }
    const kasus = PACK.kasus[enc.pasien.kasusId]!
    render(<LembarPeriksa enc={enc} kasus={kasus} dispatch={() => {}} />)

    const tombol = screen.getByRole('button', { name: `Coret ${contohObat.nama} dari resep` })
    expect(tombol).toBeInTheDocument()
    expect(tombol).toHaveAttribute('title', `Coret ${contohObat.nama} dari resep`)
  })
})
