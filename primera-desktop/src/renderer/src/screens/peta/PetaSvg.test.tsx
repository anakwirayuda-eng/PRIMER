/**
 * TEST KOMPONEN — PetaSvg petak RW: aksesibilitas keyboard (CODEX audit UI/UX
 * 2026-07-10, #10) + label tak lagi bertabrakan (#11).
 * Sebelum fix: <g onClick> polos — Tab tak menjangkaunya, Enter/Space tak
 * memicu apa pun; keyboard-only tak bisa memulai eksplorasi RW sama sekali.
 */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PetaSvg } from './PetaSvg'
import type { RwState } from '@engine/state'

function daftarRw(): RwState[] {
  return [{ nomor: 1, nama: 'Kampung Uji Panjang Sekali', jarak: 'dekat', totalKk: 25, kkTersurvei: 10, iks: 0.9, bonusIks: 0 }]
}

describe('<PetaSvg /> — aksesibilitas keyboard petak RW', () => {
  it('petak RW punya role=button + tabIndex=0 + aria-label deskriptif (bisa dijangkau Tab)', () => {
    const onPilih = vi.fn()
    render(<PetaSvg daftarRw={daftarRw()} terpilih={null} karmaRw={new Set()} onPilih={onPilih} />)
    const petak = screen.getByRole('button', { name: /RW 1.*Kampung Uji Panjang Sekali/ })
    expect(petak).toBeInTheDocument()
    expect(petak).toHaveAttribute('tabindex', '0')
  })

  it('menekan Enter pada petak RW yang fokus memicu onPilih (dulu: nihil, <g> tak bisa diaktivasi keyboard)', async () => {
    const onPilih = vi.fn()
    const user = userEvent.setup()
    render(<PetaSvg daftarRw={daftarRw()} terpilih={null} karmaRw={new Set()} onPilih={onPilih} />)
    const petak = screen.getByRole('button', { name: /RW 1/ })
    petak.focus()
    await user.keyboard('{Enter}')
    expect(onPilih).toHaveBeenCalledWith(1)
  })

  it('menekan Space pada petak RW yang fokus memicu onPilih', async () => {
    const onPilih = vi.fn()
    const user = userEvent.setup()
    render(<PetaSvg daftarRw={daftarRw()} terpilih={null} karmaRw={new Set()} onPilih={onPilih} />)
    const petak = screen.getByRole('button', { name: /RW 1/ })
    petak.focus()
    await user.keyboard(' ')
    expect(onPilih).toHaveBeenCalledWith(1)
  })
})

describe('<PetaSvg /> — label tak bertabrakan (CODEX audit UI/UX 2026-07-10, #11)', () => {
  it('label VISUAL di atas petak hanya "RW N" (bukan nama dusun penuh) — cegah tabrakan antar-petak berdekatan', () => {
    render(<PetaSvg daftarRw={daftarRw()} terpilih={null} karmaRw={new Set()} onPilih={() => {}} />)
    expect(screen.getByText('RW 1')).toBeInTheDocument()
    expect(screen.queryByText(/RW 1 · Kampung/)).not.toBeInTheDocument()
  })

  it('nama dusun lengkap TETAP ada di aria-label/title (hover/screen reader), hanya dipindah dari label visual', () => {
    render(<PetaSvg daftarRw={daftarRw()} terpilih={null} karmaRw={new Set()} onPilih={() => {}} />)
    expect(screen.getByRole('button', { name: /Kampung Uji Panjang Sekali/ })).toBeInTheDocument()
  })
})
