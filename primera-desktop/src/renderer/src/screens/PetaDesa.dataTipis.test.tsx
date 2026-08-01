/**
 * TEST — chip IKS panel detail RW menahan warna klasifikasi saat data tipis
 * (dituntaskan 2026-08-01). Petak peta SUDAH dipudarkan di bawah 30% cakupan
 * (S9-peta-visual, PetaSvg), tapi chip detail dulu tetap memberi predikat
 * berwarna penuh ("Sehat" hijau) pada 1-dari-28 KK — persis kesan
 * "desa sudah terpotret" yang dicegah di peta.
 *
 * Semua kueri DIBATASI ke panel detail: legenda peta memuat frasa caveat yang
 * sama, dan tujuh RW lain juga merender chip "belum ada data" masing-masing.
 */
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { useGame } from '../store'
import { PetaDesa } from './PetaDesa'

function pasangRw(kkTersurvei: number, iks: number): void {
  const dasar = buildInitialState('Uji data tipis', 3, PACK)
  const rw = dasar.desa.rw.map((r, i) => (i === 0 ? { ...r, kkTersurvei, iks } : r))
  useGame.setState({
    state: { ...dasar, layar: 'peta' as const, desa: { ...dasar.desa, rw } },
    lastEvents: [],
    eventTick: 0,
  })
}

/**
 * Buka panel detail RW 1 dan kembalikan KEPALA panelnya saja. Sengaja bukan
 * seluruh `.peta-detail`: kartu keluarga di dalamnya juga memuat frasa
 * "belum ada data" untuk indikator PIS-PK masing-masing.
 */
function panelDetailRw1(): HTMLElement {
  const { container } = render(<PetaDesa />)
  fireEvent.click(screen.getAllByRole('button', { name: /^RW 1\b/ })[0]!)
  const panel = container.querySelector('.peta-detail__kepala')
  if (!(panel instanceof HTMLElement)) throw new Error('kepala panel detail RW tidak terbuka')
  return panel
}

describe('<PetaDesa /> — chip IKS detail RW & ambang data tipis', () => {
  it('cakupan tipis (2/28) → predikat ditahan, diberi caveat "data awal"', () => {
    pasangRw(2, 0.9) // IKS tinggi: tanpa gerbang, chip akan berbunyi "Sehat"
    const panel = panelDetailRw1()

    expect(within(panel).getByText(/data awal, belum representatif/)).toBeInTheDocument()
    // Angkanya TETAP ditampilkan (transparansi) — yang ditahan hanya predikatnya.
    expect(within(panel).getByText(/IKS agregat/)).toBeInTheDocument()
    expect(within(panel).queryByText(/IKS agregat .* · Sehat/)).not.toBeInTheDocument()
  })

  it('cakupan memadai (20/28) → predikat berwarna tampil seperti biasa', () => {
    pasangRw(20, 0.9)
    const panel = panelDetailRw1()

    expect(within(panel).getByText(/IKS agregat .* · Sehat/)).toBeInTheDocument()
    expect(within(panel).queryByText(/data awal, belum representatif/)).not.toBeInTheDocument()
  })

  it('belum tersurvei sama sekali → tetap pesan "belum ada data", bukan caveat tipis', () => {
    pasangRw(0, 0)
    const panel = panelDetailRw1()

    expect(within(panel).getByText(/belum ada data/)).toBeInTheDocument()
    expect(within(panel).queryByText(/data awal, belum representatif/)).not.toBeInTheDocument()
  })
})
