/**
 * AUDIT AKSESIBILITAS OTOMATIS (axe-core) — audit benchmark 2026-08-02, B8.
 *
 * Menjalankan axe-core pada permukaan utama game. Ini bukan pengganti audit
 * screen-reader manual (yang tetap tercatat sebagai pekerjaan tersisa di
 * benchmark), tapi menjadikan standar WCAG yang DAPAT diperiksa mesin sebagai
 * gerbang regresi: pelanggaran baru = test merah, bukan temuan audit tahunan.
 *
 * Batas jsdom yang dinonaktifkan sadar (bukan diabaikan diam-diam):
 * - `color-contrast` butuh mesin render nyata (canvas/layout) — kontras
 *   diaudit terpisah via computed-style di preview (lihat riwayat sapuan
 *   kontras tokens.css, mode malam, dan chip).
 * - `scrollable-region-focusable` bergantung ukuran layout nyata yang di
 *   jsdom selalu 0×0 — area scroll utama sudah diberi tabIndex terverifikasi
 *   test lain (mis. fokus panel IGD/DeckAksi).
 */
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import axe from 'axe-core'
import { PACK } from '@content/index'
import { buildInitialState } from '@engine/init'
import { useGame } from './store'
import { Onboarding } from './components/Onboarding'
import { Pengaturan } from './components/Pengaturan'
import { Klinik } from './screens/Klinik'
import { PetaDesa } from './screens/PetaDesa'
import { DexSkdi } from './screens/DexSkdi'
import { Rapor } from './screens/Rapor'

async function auditAxe(ui: ReactElement, layar: string): Promise<void> {
  const { container, unmount } = render(ui)
  const hasil = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      'scrollable-region-focusable': { enabled: false },
      // Layar dirender terisolasi tanpa kerangka <main>/landmark App.tsx —
      // aturan struktur halaman-utuh tak bermakna pada fragmen.
      region: { enabled: false },
      'landmark-one-main': { enabled: false },
      'page-has-heading-one': { enabled: false },
    },
  })
  const ringkas = hasil.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} simpul, mis. ${v.nodes[0]?.target.join(' ')}`,
  )
  expect(ringkas, `${layar}: ${ringkas.join(' | ')}`).toEqual([])
  unmount()
}

function pasangState(layar: 'klinik' | 'peta' | 'dex' | 'rapor'): void {
  const s = buildInitialState('Uji A11y', 7, PACK)
  useGame.setState({
    state: { ...s, hari: 3, layar },
    lastEvents: [],
    eventTick: 0,
  })
}

describe('axe-core — permukaan utama bebas pelanggaran WCAG yang terperiksa mesin', () => {
  it('Onboarding', async () => {
    window.localStorage.clear()
    await auditAxe(<Onboarding onSelesai={() => {}} />, 'Onboarding')
  })

  it('Pengaturan (modal terbuka)', async () => {
    const { container, unmount } = render(<Pengaturan />)
    ;(container.querySelector('.set-gigi') as HTMLButtonElement).click()
    const modal = await new Promise<Element>((resolve, reject) => {
      let sisa = 40
      const cek = () => {
        const m = document.querySelector('.set-modal')
        if (m) return resolve(m)
        if (--sisa <= 0) return reject(new Error('modal Pengaturan tak terbuka'))
        setTimeout(cek, 25)
      }
      cek()
    })
    const hasil = await axe.run(modal, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    })
    const ringkas = hasil.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)
    expect(ringkas, ringkas.join(' | ')).toEqual([])
    unmount()
  })

  it('Klinik — ruang tunggu', async () => {
    pasangState('klinik')
    await auditAxe(<Klinik />, 'Klinik')
  })

  it('Peta Desa', async () => {
    pasangState('peta')
    await auditAxe(<PetaDesa />, 'PetaDesa')
  })

  it('Buku Saku (144 entri)', async () => {
    pasangState('dex')
    await auditAxe(<DexSkdi />, 'DexSkdi')
  }, 30000)

  it('Rapor', async () => {
    pasangState('rapor')
    await auditAxe(<Rapor />, 'Rapor')
  })
})
