/**
 * TEST — DeckTerapi, sorotan tutorial obat pertama.
 *
 * Bug live (dilaporkan user main langsung di build desktop, 2026-07-05):
 * banner tutorial bilang "tambahkan obat yang menyala", tapi formularium
 * terurut ALFABETIS dan panjang (~69 item) — target (`paracetamol_500`,
 * huruf P) jauh di bawah viewport awal tanpa indikasi visual apa pun utk
 * scroll ke sana. jsdom/vitest tak pernah menangkap ini krn tak ada
 * scroll/viewport sungguhan — cuma kelihatan saat manusia main langsung.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DeckTerapi } from './DeckTerapi'
import { buatEncounter } from '@engine/clinic'
import { buatPasienDariKasus } from '@engine/director'
import { Rng } from '@engine/core/rng'
import { PACK } from '@content/index'
import { setPengaturan } from '../../settings'

describe('<DeckTerapi /> — sorotan tutorial harus scroll ke tampilan (bug live 2026-07-05)', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('tab Resep tutorial-aktif men-scroll tombol obat yang disorot ke viewport', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const enc = buatEncounter(pasien)

    render(
      <DeckTerapi enc={enc} dispatch={() => {}} lastEvents={[]} eventTick={0} tutorialAktif={true} />,
    )

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
  })
})

describe('<DeckTerapi /> — aria-label tombol tambah obat bernama (CODEX audit UI/UX 2026-07-10, #15)', () => {
  it('tombol "+ Resep" tiap baris obat punya aria-label yang menyebut nama obat itu sendiri', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const enc = buatEncounter(pasien)
    render(<DeckTerapi enc={enc} dispatch={() => {}} lastEvents={[]} eventTick={0} />)

    const contohObat = Object.values(PACK.obat)[0]!
    // Laci golongan default tertutup (playtest 2026-07-16: dinding 130 obat)
    // — cari nama obat utk auto-buka lacinya, pola sama edukasi/tindakan.
    fireEvent.change(screen.getByLabelText('Cari obat'), { target: { value: contohObat.nama } })
    expect(screen.getByRole('button', { name: `Tambah ${contohObat.nama} ke resep` })).toBeInTheDocument()
  })

  it('obat yang sudah di resep aria-label-nya berubah (bukan tetap generik "+ Resep")', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const contohObat = Object.values(PACK.obat)[0]!
    const enc = { ...buatEncounter(pasien), resep: [contohObat.id] }
    render(<DeckTerapi enc={enc} dispatch={() => {}} lastEvents={[]} eventTick={0} />)

    fireEvent.change(screen.getByLabelText('Cari obat'), { target: { value: contohObat.nama } })
    expect(screen.getByRole('button', { name: `${contohObat.nama} sudah di resep` })).toBeInTheDocument()
  })

  it('obat dalam resep tampil sebagai chip strip di atas laci (klik = coret)', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const contohObat = Object.values(PACK.obat)[0]!
    const enc = { ...buatEncounter(pasien), resep: [contohObat.id] }
    const dispatch = vi.fn()
    render(<DeckTerapi enc={enc} dispatch={dispatch} lastEvents={[]} eventTick={0} />)

    const chip = screen.getByRole('button', { name: `✓ ${contohObat.nama}` })
    fireEvent.click(chip)
    expect(dispatch).toHaveBeenCalledWith({ type: 'HAPUS_OBAT', obatId: contohObat.id })
  })
})

describe('<DeckTerapi /> — aria-pressed chip edukasi & tindakan (CODEX audit UI/UX 2026-07-10, #16g)', () => {
  it('chip topik edukasi: aria-pressed berubah dari "false" ke "true" saat topik masuk baki', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const enc = buatEncounter(pasien)
    const topik = Object.values(PACK.edukasi)[0]!

    const { rerender } = render(
      <DeckTerapi enc={enc} dispatch={() => {}} lastEvents={[]} eventTick={0} />,
    )
    fireEvent.click(screen.getByRole('tab', { name: /^Edukasi/ }))
    // Laci kategori default tertutup — cari nama topik utk auto-buka lacinya.
    fireEvent.change(screen.getByLabelText('Cari topik edukasi'), { target: { value: topik.nama } })

    expect(screen.getByRole('button', { name: topik.nama })).toHaveAttribute('aria-pressed', 'false')

    rerender(
      <DeckTerapi
        enc={{ ...enc, edukasi: [topik.id] }}
        dispatch={() => {}}
        lastEvents={[]}
        eventTick={0}
      />,
    )

    expect(screen.getByRole('button', { name: `✓ ${topik.nama}` })).toHaveAttribute('aria-pressed', 'true')
  })

  it('chip tindakan: aria-pressed berubah dari "false" ke "true" saat tindakan dipilih', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const enc = buatEncounter(pasien)
    const tindakan = Object.values(PACK.tindakan)[0]!

    const { rerender } = render(
      <DeckTerapi enc={enc} dispatch={() => {}} lastEvents={[]} eventTick={0} />,
    )
    fireEvent.click(screen.getByRole('tab', { name: /^Tindakan/ }))
    // Laci kelompok default tertutup (pola sama edukasi, 2026-07-16) — cari
    // nama tindakan utk auto-buka lacinya.
    fireEvent.change(screen.getByLabelText('Cari tindakan klinis'), {
      target: { value: tindakan.nama },
    })

    expect(screen.getByRole('button', { name: tindakan.nama })).toHaveAttribute('aria-pressed', 'false')

    rerender(
      <DeckTerapi
        enc={{ ...enc, tindakan: [tindakan.id] }}
        dispatch={() => {}}
        lastEvents={[]}
        eventTick={0}
      />,
    )

    // Chip terpilih tampil DUA kali by design: strip "sudah dipilih" di atas
    // (selalu terlihat walau laci ditutup) + di dalam laci hasil pencarian.
    const terpilih = screen.getAllByRole('button', { name: `✓ ${tindakan.nama}` })
    expect(terpilih.length).toBeGreaterThanOrEqual(1)
    for (const chip of terpilih) expect(chip).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('<DeckTerapi /> — fokus kembali ke kotak cari sesudah tambah obat (bugfix 2026-07-13, "kena frozen lagi eh")', () => {
  it('klik "+ Resep" memindahkan fokus ke input "Cari obat", bukan hilang ke <body>', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const enc = buatEncounter(pasien)
    const contohObat = Object.values(PACK.obat)[0]!

    render(<DeckTerapi enc={enc} dispatch={() => {}} lastEvents={[]} eventTick={0} />)

    fireEvent.change(screen.getByLabelText('Cari obat'), { target: { value: contohObat.nama } })
    fireEvent.click(screen.getByRole('button', { name: `Tambah ${contohObat.nama} ke resep` }))

    // Tombol ini akan `disabled` begitu enc.resep diperbarui (dispatch nyata di
    // game asli) — disable memaksa fokus jatuh ke <body> (perilaku browser
    // standar), dan keystroke lanjutan di "Cari obat" hilang tanpa jejak.
    // Fokus HARUS sudah dipindah ke kotak cari SEBELUM itu terjadi.
    expect(document.activeElement).toBe(screen.getByLabelText('Cari obat'))
  })
})

describe('<DeckTerapi /> — reduced-motion menggantikan scrollIntoView smooth ke auto (CODEX audit UI/UX 2026-07-10, Polish#2a)', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    setPengaturan({ kurangiGerak: false })
  })

  it('pengaturan kurangiGerak aktif → scrollIntoView tutorial dipanggil dengan behavior "auto"', () => {
    setPengaturan({ kurangiGerak: true })
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const enc = buatEncounter(pasien)

    render(
      <DeckTerapi enc={enc} dispatch={() => {}} lastEvents={[]} eventTick={0} tutorialAktif={true} />,
    )

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'auto' }),
    )
  })

  it('gerak TAK dikurangi (default) → scrollIntoView tutorial tetap pakai behavior "smooth"', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const enc = buatEncounter(pasien)

    render(
      <DeckTerapi enc={enc} dispatch={() => {}} lastEvents={[]} eventTick={0} tutorialAktif={true} />,
    )

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'smooth' }),
    )
  })
})
