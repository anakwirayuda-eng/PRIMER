/**
 * TEST — DeckAksi: stepper aria-current (#16b) + fokus dipindah saat fase
 * berganti (#18, CODEX audit UI/UX 2026-07-10). Sebelum fix: <li> stepper
 * tak bertanda aria-current apa pun (screen reader tak tahu langkah aktif),
 * dan Deck anak di-unmount total tiap pergantian fase — tombol yg tadi
 * diklik lenyap dari DOM, fokus jatuh ke <body> tanpa konteks.
 */
import { describe, expect, it } from 'vitest'
import type { ReactElement } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { DeckAksi } from './DeckAksi'
import { buatEncounter } from '@engine/clinic'
import { buatPasienDariKasus } from '@engine/director'
import { Rng } from '@engine/core/rng'
import { PACK } from '@content/index'
import type { EncounterState } from '@engine/state'

describe('<DeckAksi /> — aria-current pada langkah stepper aktif (#16b)', () => {
  it('langkah yang sesuai enc.fase punya aria-current="step", langkah lain tidak', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const enc = { ...buatEncounter(pasien), fase: 'pemeriksaan' as const }
    const kasus = PACK.kasus['ispa_common_cold']!

    render(<DeckAksi enc={enc} kasus={kasus} dispatch={() => {}} lastEvents={[]} eventTick={0} tutorialAktif={false} />)

    expect(screen.getByText('Pemeriksaan').closest('li')).toHaveAttribute('aria-current', 'step')
    expect(screen.getByText('Anamnesis').closest('li')).not.toHaveAttribute('aria-current')
    expect(screen.getByText('Diagnosis').closest('li')).not.toHaveAttribute('aria-current')
  })
})

describe('<DeckAksi /> — fokus dipindah ke section saat fase berganti (#18)', () => {
  it('setelah rerender dengan enc.fase berbeda, document.activeElement adalah section deck aksi', async () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const encAwal = { ...buatEncounter(pasien), fase: 'anamnesis' as const }
    const kasus = PACK.kasus['ispa_common_cold']!

    const { rerender } = render(
      <DeckAksi enc={encAwal} kasus={kasus} dispatch={() => {}} lastEvents={[]} eventTick={0} tutorialAktif={false} />,
    )

    const encBerikutnya = { ...encAwal, fase: 'pemeriksaan' as const }
    rerender(
      <DeckAksi enc={encBerikutnya} kasus={kasus} dispatch={() => {}} lastEvents={[]} eventTick={0} tutorialAktif={false} />,
    )

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByLabelText('Deck aksi klinik — Pemeriksaan'))
    })
  })
})

describe('<DeckAksi /> — guard fokus: tak mencuri fokus dari kontrol interaktif yang sudah dipakai pemain (bugfix 2026-07-13)', () => {
  it('kontrol interaktif LUAR yang sudah difokus tetap fokus sesudah enc.fase berganti (fokus TIDAK dicuri ke section)', () => {
    const pasien = buatPasienDariKasus('ispa_common_cold', PACK, new Rng(1, 'x'))
    const encAwal = { ...buatEncounter(pasien), fase: 'anamnesis' as const }
    const kasus = PACK.kasus['ispa_common_cold']!

    const bungkus = (enc: EncounterState): ReactElement => (
      <div>
        <input aria-label="kontrol luar (mis. pencarian di layar lain)" />
        <DeckAksi enc={enc} kasus={kasus} dispatch={() => {}} lastEvents={[]} eventTick={0} tutorialAktif={false} />
      </div>
    )

    const { rerender } = render(bungkus(encAwal))
    const kontrolLuar = screen.getByLabelText('kontrol luar (mis. pencarian di layar lain)')
    kontrolLuar.focus()
    expect(document.activeElement).toBe(kontrolLuar)

    // Ganti fase — inilah yang dulu (sebelum guard adaKontrolInteraktifDifokus)
    // memicu efek fokus DeckAksi mencuri fokus ke <section> tanpa syarat.
    rerender(bungkus({ ...encAwal, fase: 'pemeriksaan' as const }))

    expect(document.activeElement).toBe(kontrolLuar)
  })
})
