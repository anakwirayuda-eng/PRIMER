import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import type { GameState } from '@engine/state'
import { useGame } from '../store'
import { MejaKerja } from './MejaKerja'
import { BuktiKlinis } from '../components/BuktiKlinis'

function pasangPrimerStub() {
  window.primer = {
    save: {
      write: async () => true,
      read: async () => null,
      list: async () => [],
      delete: async () => true,
    },
    telemetri: {
      append: async () => true,
      read: async () => [],
    },
    appVersion: async () => 'test',
  }
}

describe('<MejaKerja /> - provenance hasil IGD', () => {
  it('menampilkan panel ringkas tertutup, lalu sumber resmi dapat dibuka', async () => {
    pasangPrimerStub()
    const awal = buildInitialState('Uji Sumber IGD', 818181, PACK)
    const state: GameState = {
      ...awal,
      inbox: [{
        id: 'surat_igd_grounding',
        hari: 1,
        jenis: 'igd',
        dari: 'Perawat jaga',
        judul: 'Debrief serangan asma berat',
        isi: 'Pasien stabil dan diterima jejaring rujukan.',
        dibaca: false,
        kaitKasusIgdId: 'igd_asma_berat',
      }],
    }
    useGame.setState({ state, petaTargetKeluargaId: null })
    render(<MejaKerja />)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Debrief serangan asma berat/ }))

    const summary = screen.getByText('Panduan resmi & sumber')
    const details = summary.closest('details')
    expect(details).not.toHaveAttribute('open')
    await user.click(summary)
    expect(details).toHaveAttribute('open')

    expect(screen.getByText(/Serangan berat memerlukan oksigen terkontrol/)).toBeVisible()
    expect(screen.getByText('2 rujukan')).toBeVisible()
    expect(screen.getByText('INTI KEPUTUSAN')).toBeVisible()
    expect(screen.getByText(/Ringkasan adalah parafrasa pembelajaran/)).toBeVisible()
    const gina = screen.getByRole('link', { name: /GINA Global Strategy for Asthma 2026/ })
    expect(gina).toHaveAttribute('href', SUMBER_URL_GINA)
    expect(gina).toHaveAttribute('target', '_blank')
    // Audit premium 2026-07-23: tooltip kini data-tip (tooltip instan global).
    expect(gina).toHaveAttribute('data-tip', 'Buka di browser bawaan')
    expect(screen.getByRole('list', { name: /Sumber klinis Serangan Asma Berat/ })).toBeVisible()
  })

  it('meneruskan debrief teradjudikasi tanpa membukanya sebelum pemain meminta', async () => {
    pasangPrimerStub()
    const awal = buildInitialState('Uji Debrief IGD', 919191, PACK)
    const state: GameState = {
      ...awal,
      inbox: [{
        id: 'surat_igd_debrief_final',
        hari: 1,
        jenis: 'igd',
        dari: 'Perawat jaga',
        judul: 'Debrief tenggelam nonfatal',
        isi: 'Pasien diterima jejaring rujukan.',
        dibaca: false,
        kaitKasusIgdId: 'igd_tenggelam',
      }],
    }
    useGame.setState({ state, petaTargetKeluargaId: null })
    render(<MejaKerja />)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Debrief tenggelam nonfatal/ }))
    expect(screen.queryByText('YANG PERLU MENETAP')).not.toBeVisible()

    await user.click(screen.getByText('Panduan resmi & sumber'))
    expect(screen.getByText('YANG PERLU MENETAP')).toBeVisible()
    expect(screen.getByText('Dari Sungai ke Sistem Aman')).toBeVisible()
    expect(screen.getByText(/Rujuk karena pernah gagal napas/)).toBeVisible()
  })
})

const SUMBER_URL_GINA = 'https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf'

/**
 * Audit cakupan IGD 2026-08-02: 20 kasus IGD dulu tak punya field `cakupan`
 * sama sekali, sehingga BuktiKlinis merender sumbernya TANPA label tiga-tingkat
 * (LANGSUNG / TERKAIT / PEDOMAN DASAR) yang mencegah overclaim di sisi poli.
 * Sumbernya ada dan bermutu — yang hilang adalah pemberitahuan mana yang
 * benar-benar membahas kasus ini. Test ini mengunci agar tak kembali hilang.
 */
describe('<MejaKerja /> — label cakupan sumber IGD tampil ke pemain', () => {
  it('debrief IGD menampilkan label tiga-tingkat, bukan sumber tanpa keterangan', async () => {
    const kasus = Object.values(PACK.kasusIgd)[0]!
    expect(kasus.sumber.length, 'pra-syarat: kasus IGD punya sumber').toBeGreaterThan(0)
    // Setiap sumber IGD kini WAJIB berlabel — tanpa ini, render jatuh ke null.
    for (const s of kasus.sumber) {
      expect(s.cakupan, `${kasus.id}/${s.id} tanpa cakupan`).toBeDefined()
    }

    render(
      <BuktiKlinis
        namaKasus={kasus.nama}
        ringkasan={kasus.panduanResmi}
        sumber={kasus.sumber}
        defaultOpen
      />,
    )

    // Label dirender dalam satu span gabungan ("EBM · LANGSUNG · 2025"), jadi
    // dicocokkan sbg regex — bukan string persis. Minimal satu sumber tampil
    // LANGSUNG: bukti yang genuinely membahas kasus ini, bukan cuma payung.
    expect(screen.getAllByText(/LANGSUNG|TERKAIT|PEDOMAN DASAR/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/LANGSUNG/).length).toBeGreaterThan(0)
  })
})
