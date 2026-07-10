/**
 * TEST — KartuKeluarga: tombol Lepas/Jadikan Binaan/Kunjungi dapat aria-label
 * bernama keluarga (CODEX audit UI/UX 2026-07-10, #15). Sebelum fix: ketiga
 * tombol punya teks visible generik SAMA di setiap kartu — nama keluarga
 * hanya di judul kartu (elemen saudara), tak terbedakan lewat navigasi
 * per-kontrol (screen reader).
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
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
