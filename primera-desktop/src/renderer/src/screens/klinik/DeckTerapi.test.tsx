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
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { DeckTerapi } from './DeckTerapi'
import { buatEncounter } from '@engine/clinic'
import { buatPasienDariKasus } from '@engine/director'
import { Rng } from '@engine/core/rng'
import { PACK } from '@content/index'

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
