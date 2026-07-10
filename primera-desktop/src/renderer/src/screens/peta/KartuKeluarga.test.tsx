/**
 * TEST — KartuKeluarga: tombol Lepas/Jadikan Binaan/Kunjungi dapat aria-label
 * bernama keluarga (CODEX audit UI/UX 2026-07-10, #15). Sebelum fix: ketiga
 * tombol punya teks visible generik SAMA di setiap kartu — nama keluarga
 * hanya di judul kartu (elemen saudara), tak terbedakan lewat navigasi
 * per-kontrol (screen reader).
 */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KartuKeluarga } from './KartuKeluarga'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'

const KELUARGA_ID = 'keluarga_wulan'

function propsDasar() {
  const state = buildInitialState('Uji Kartu', 1, PACK)
  const content = PACK.keluarga[KELUARGA_ID]!
  const kel = state.desa.keluarga[KELUARGA_ID]!
  return { content, kel }
}

describe('<KartuKeluarga /> — aria-label tombol aksi bernama keluarga (#15)', () => {
  it('tombol "Jadikan Binaan" (belum binaan) aria-label menyebut nama keluarga', () => {
    const { content, kel } = propsDasar()
    render(
      <KartuKeluarga
        content={content}
        kel={kel}
        binaan={false}
        rosterPenuh={false}
        alasanKunjungan={null}
        biayaStamina={1}
        onBinaan={() => {}}
        onLepas={() => {}}
        onKunjungi={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: `Jadikan ${content.namaKeluarga} binaan` })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: `Kunjungi ${content.namaKeluarga}` })).toBeInTheDocument()
  })

  it('tombol "Lepas" (sudah binaan) aria-label menyebut nama keluarga', () => {
    const { content, kel } = propsDasar()
    render(
      <KartuKeluarga
        content={content}
        kel={kel}
        binaan={true}
        rosterPenuh={false}
        alasanKunjungan={null}
        biayaStamina={1}
        onBinaan={() => {}}
        onLepas={() => {}}
        onKunjungi={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: `Lepas ${content.namaKeluarga} dari roster binaan` })).toBeInTheDocument()
  })
})

describe('<KartuKeluarga /> — tombol nonaktif tetap focusable via aria-disabled (#17)', () => {
  it('rosterPenuh: tombol "Jadikan Binaan" bukan disabled native, tapi aria-disabled dan tetap focusable', () => {
    const { content, kel } = propsDasar()
    const onBinaan = vi.fn()
    render(
      <KartuKeluarga
        content={content}
        kel={kel}
        binaan={false}
        rosterPenuh={true}
        alasanKunjungan={null}
        biayaStamina={1}
        onBinaan={onBinaan}
        onLepas={() => {}}
        onKunjungi={() => {}}
      />,
    )
    const tombol = screen.getByRole('button', { name: `Jadikan ${content.namaKeluarga} binaan` })
    expect(tombol).not.toBeDisabled()
    expect(tombol).toHaveAttribute('aria-disabled', 'true')
    tombol.focus()
    expect(document.activeElement).toBe(tombol)
  })

  it('rosterPenuh: klik tombol "Jadikan Binaan" tidak memanggil onBinaan', async () => {
    const { content, kel } = propsDasar()
    const onBinaan = vi.fn()
    const user = userEvent.setup()
    render(
      <KartuKeluarga
        content={content}
        kel={kel}
        binaan={false}
        rosterPenuh={true}
        alasanKunjungan={null}
        biayaStamina={1}
        onBinaan={onBinaan}
        onLepas={() => {}}
        onKunjungi={() => {}}
      />,
    )
    const tombol = screen.getByRole('button', { name: `Jadikan ${content.namaKeluarga} binaan` })
    await user.click(tombol)
    expect(onBinaan).not.toHaveBeenCalled()
  })

  it('rosterPenuh=false: klik tombol "Jadikan Binaan" tetap memanggil onBinaan (regresi)', async () => {
    const { content, kel } = propsDasar()
    const onBinaan = vi.fn()
    const user = userEvent.setup()
    render(
      <KartuKeluarga
        content={content}
        kel={kel}
        binaan={false}
        rosterPenuh={false}
        alasanKunjungan={null}
        biayaStamina={1}
        onBinaan={onBinaan}
        onLepas={() => {}}
        onKunjungi={() => {}}
      />,
    )
    const tombol = screen.getByRole('button', { name: `Jadikan ${content.namaKeluarga} binaan` })
    expect(tombol).not.toHaveAttribute('aria-disabled', 'true')
    await user.click(tombol)
    expect(onBinaan).toHaveBeenCalledTimes(1)
  })

  it('alasanKunjungan terisi: tombol "Kunjungi" bukan disabled native, tapi aria-disabled dan tetap focusable', () => {
    const { content, kel } = propsDasar()
    const onKunjungi = vi.fn()
    render(
      <KartuKeluarga
        content={content}
        kel={kel}
        binaan={false}
        rosterPenuh={false}
        alasanKunjungan="Stamina tidak cukup."
        biayaStamina={1}
        onBinaan={() => {}}
        onLepas={() => {}}
        onKunjungi={onKunjungi}
      />,
    )
    const tombol = screen.getByRole('button', { name: `Kunjungi ${content.namaKeluarga}` })
    expect(tombol).not.toBeDisabled()
    expect(tombol).toHaveAttribute('aria-disabled', 'true')
    tombol.focus()
    expect(document.activeElement).toBe(tombol)
  })

  it('alasanKunjungan terisi: klik tombol "Kunjungi" tidak memanggil onKunjungi', async () => {
    const { content, kel } = propsDasar()
    const onKunjungi = vi.fn()
    const user = userEvent.setup()
    render(
      <KartuKeluarga
        content={content}
        kel={kel}
        binaan={false}
        rosterPenuh={false}
        alasanKunjungan="Stamina tidak cukup."
        biayaStamina={1}
        onBinaan={() => {}}
        onLepas={() => {}}
        onKunjungi={onKunjungi}
      />,
    )
    const tombol = screen.getByRole('button', { name: `Kunjungi ${content.namaKeluarga}` })
    await user.click(tombol)
    expect(onKunjungi).not.toHaveBeenCalled()
  })

  it('alasanKunjungan=null: klik tombol "Kunjungi" tetap memanggil onKunjungi (regresi)', async () => {
    const { content, kel } = propsDasar()
    const onKunjungi = vi.fn()
    const user = userEvent.setup()
    render(
      <KartuKeluarga
        content={content}
        kel={kel}
        binaan={false}
        rosterPenuh={false}
        alasanKunjungan={null}
        biayaStamina={1}
        onBinaan={() => {}}
        onLepas={() => {}}
        onKunjungi={onKunjungi}
      />,
    )
    const tombol = screen.getByRole('button', { name: `Kunjungi ${content.namaKeluarga}` })
    expect(tombol).not.toHaveAttribute('aria-disabled', 'true')
    await user.click(tombol)
    expect(onKunjungi).toHaveBeenCalledTimes(1)
  })
})
