/**
 * TEST KOMPONEN — Kunjungan: disambiguasi aria-label hotspot (CODEX audit
 * UI/UX 2026-07-10, #13) + kutip-bersarang teks dialog (#14).
 *
 * #13 sebelum fix: SEMUA hotspot yang belum ditemukan berbagi aria-label
 * literal "Amati lebih dekat" — keyboard/screen-reader tak bisa membedakan
 * 5 titik sama sekali (padahal pemain sighted bisa, dari posisi x/y visual).
 * #14 sebelum fix: `teks`/`respons` PilihanDialog SUDAH membawa tanda kutip
 * lurus sendiri di kontennya, tapi Kunjungan.tsx membungkusnya LAGI dengan
 * “ ” — hasilnya kutip ganda bersarang. Diverifikasi: 246/246 entri
 * PilihanDialog.teks di seluruh src/content/keluarga/*.ts sudah berkutip.
 * Fix HANYA menyasar `teks` (gema "Kamu: ..." & tombol pilihan) — field
 * `respons`/`responsBohong` SENGAJA tidak disentuh: audit terpisah (lihat
 * dossier §59) menemukan field itu CAMPURAN narasi+dialog (141/270 TIDAK
 * berawalan kutip), beda kelas masalah dari `teks` yang 100% konsisten.
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { Kunjungan } from './Kunjungan'
import type { KunjunganState } from '@engine/state'

const KELUARGA_ID = 'keluarga_wulan'
const SKENARIO_ID = 'wulan_k1'

function skenarioUji() {
  const kelContent = PACK.keluarga[KELUARGA_ID]!
  const skenario = kelContent.arc.kunjungan.find((s) => s.id === SKENARIO_ID)!
  return { kelContent, skenario }
}

function pasangKunjungan(overrides: Partial<KunjunganState> = {}): void {
  const state = buildInitialState('Uji Kunjungan', 1, PACK)
  const kj: KunjunganState = {
    keluargaId: KELUARGA_ID,
    skenarioId: SKENARIO_ID,
    fase: 'observasi',
    hotspotDitemukan: [],
    dialogIndex: 0,
    pilihanDiambil: [],
    trustDelta: 0,
    konfrontasiBeruntun: 0,
    diusir: false,
    ...overrides,
  }
  useGame.setState({ state: { ...state, layar: 'kunjungan', kunjungan: kj } })
}

describe('<Kunjungan /> — disambiguasi aria-label hotspot (#13)', () => {
  it('kelima hotspot yang belum ditemukan punya aria-label UNIK (dulu: identik "Amati lebih dekat")', () => {
    pasangKunjungan()
    render(<Kunjungan />)
    const tombol = Array.from(document.querySelectorAll('.kunjungan-hotspot'))
    expect(tombol).toHaveLength(5)
    const label = tombol.map((el) => el.getAttribute('aria-label'))
    expect(new Set(label).size).toBe(5) // semua unik, tak ada duplikat
    label.forEach((l, i) => expect(l).toBe(`Amati lebih dekat (titik ${i + 1} dari 5)`))
  })

  it('label posisi TETAP tidak membocorkan identitas objek (anti-bocor jawaban tetap utuh)', () => {
    pasangKunjungan()
    render(<Kunjungan />)
    const { skenario } = skenarioUji()
    const labelAsli = skenario.hotspot.map((h) => h.label)
    const tombol = Array.from(document.querySelectorAll('.kunjungan-hotspot'))
    tombol.forEach((el) => {
      const l = el.getAttribute('aria-label')!
      expect(labelAsli).not.toContain(l)
    })
  })

  it('hotspot yang SUDAH ditemukan tetap tampilkan label asli (bukan posisi)', () => {
    const { skenario } = skenarioUji()
    const pertama = skenario.hotspot[0]!
    pasangKunjungan({ hotspotDitemukan: [pertama.id] })
    render(<Kunjungan />)
    expect(screen.getByRole('button', { name: pertama.label })).toBeInTheDocument()
  })
})

describe('<Kunjungan /> — kutip-bersarang teks dialog dihapus (#14)', () => {
  it('tombol pilihan dialog render teks APA ADANYA — tak ada kutip “ ” tambahan di luar kutip asli konten', () => {
    const { skenario } = skenarioUji()
    const node = skenario.dialog[0]!
    const pilihanPertama = node.pilihan[0]!
    expect(pilihanPertama.teks.startsWith('"')).toBe(true) // prasyarat: konten sudah berkutip sendiri
    pasangKunjungan({ fase: 'wawancara' })
    render(<Kunjungan />)
    expect(screen.getByText(pilihanPertama.teks)).toBeInTheDocument()
    expect(screen.queryByText(`“${pilihanPertama.teks}”`)).not.toBeInTheDocument()
  })

  it('gema "Kamu: ..." setelah memilih dialog juga tanpa kutip tambahan', async () => {
    const { skenario } = skenarioUji()
    const node = skenario.dialog[0]!
    const pilihanPertama = node.pilihan[0]!
    pasangKunjungan({ fase: 'wawancara' })
    render(<Kunjungan />)
    const user = userEvent.setup()
    await user.click(screen.getByText(pilihanPertama.teks))
    expect(await screen.findByText(`Kamu: ${pilihanPertama.teks}`)).toBeInTheDocument()
  })
})

describe('<Kunjungan /> — aria-current stepper babak (#16c)', () => {
  it('hanya langkah babak aktif yang punya aria-current="step"', () => {
    pasangKunjungan({ fase: 'observasi' })
    render(<Kunjungan />)
    const langkah = Array.from(document.querySelectorAll('.kunjungan-stepper__langkah'))
    expect(langkah).toHaveLength(4)
    expect(langkah[0]!.getAttribute('aria-current')).toBe('step')
    langkah.slice(1).forEach((el) => expect(el.getAttribute('aria-current')).toBeNull())
  })
})

describe('<Kunjungan /> — role=radio kartu intervensi resep sosial (#16d, dikoreksi review Batch-7)', () => {
  it('kartu intervensi role=radio dalam radiogroup, aria-checked semua false sebelum dipilih, lalu hanya yang diklik jadi "true"', async () => {
    pasangKunjungan({ fase: 'resep_sosial' })
    render(<Kunjungan />)
    expect(document.querySelector('.kunjungan-resep__baris')).toHaveAttribute('role', 'radiogroup')
    const kartu = Array.from(document.querySelectorAll('.kunjungan-intervensi'))
    expect(kartu.length).toBeGreaterThan(0)
    kartu.forEach((el) => {
      expect(el.getAttribute('role')).toBe('radio')
      expect(el.getAttribute('aria-checked')).toBe('false')
    })

    const user = userEvent.setup()
    await user.click(kartu[0]!)

    const kartuSesudah = Array.from(document.querySelectorAll('.kunjungan-intervensi'))
    expect(kartuSesudah[0]!.getAttribute('aria-checked')).toBe('true')
    kartuSesudah.slice(1).forEach((el) => expect(el.getAttribute('aria-checked')).toBe('false'))
  })
})
