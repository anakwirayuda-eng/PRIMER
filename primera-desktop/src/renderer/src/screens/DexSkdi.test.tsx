/**
 * TEST KOMPONEN — Dex SKDI (harness jsdom+RTL, CODEX audit 2026-07-04 #8 §9).
 * Regresi langsung utk bug ronde-5: dulu komponen baca SKDI144 mentah, bukan
 * PACK.skdi144 (versi auto-tautan ICD) — 23 entri permanen "???" walau
 * kasusnya sudah ditangani. Test ini akan MERAH lagi bila regresi terulang.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { DexSkdi } from './DexSkdi'

// Entri nyata di skdi144.ts TANPA kasusId eksplisit, hanya tertaut via
// kecocokan ICD-10 di index.ts (skdi144Tertaut) — persis kelas bug yang dulu
// bikin 23 entri tak pernah "dikenali".
const ENTRI_AUTO_TAUTAN = 'tension_headache'

function pasangState(dex: Record<string, { ditangani: number; benar: number; bintang: number; terakhirHari: number }> = {}) {
  const state = buildInitialState('Uji Komponen', 1, PACK)
  useGame.setState({ state: { ...state, dex: dex as typeof state.dex } })
}

describe('<DexSkdi /> — auto-tautan ICD dikenali', () => {
  beforeEach(() => {
    pasangState()
  })

  it('kasus auto-tautan yang sudah ditangani tampil bernama, bukan "???"', () => {
    const entri = PACK.skdi144.find((e) => e.id === ENTRI_AUTO_TAUTAN)!
    expect(entri.kasusId).toBeDefined() // pra-syarat: memang auto-tertaut

    pasangState({ [entri.kasusId!]: { ditangani: 1, benar: 1, bintang: 1, terakhirHari: 1 } })
    render(<DexSkdi />)

    expect(screen.getByText(entri.nama)).toBeInTheDocument()
    expect(screen.getByText(`1/${PACK.skdi144.length} dikenali`)).toBeInTheDocument()
  })

  it('kasus yang belum pernah ditangani tampil siluet "???"', () => {
    render(<DexSkdi />)
    expect(screen.getByText(`0/${PACK.skdi144.length} dikenali`)).toBeInTheDocument()
    expect(screen.getAllByText('???').length).toBeGreaterThan(0)
  })

  // CODEX M10 (2026-07-05): meski pointerEventsCheck:0 (ronde-13) menurunkan
  // durasi tipikal ke ~1,6-2,3s terisolasi, run suite PENUH (37 file paralel)
  // pernah benar-benar timeout di batas 5000ms default krn kontensi resource
  // antar worker — bukan regresi logika (file ini sendiri selalu hijau cepat
  // saat direrun terisolasi). Timeout eksplisit dilonggarkan sbg headroom.
  it('klik entri yang dikenali membuka panel Catatan Penyakit', async () => {
    const entri = PACK.skdi144.find((e) => e.id === ENTRI_AUTO_TAUTAN)!
    pasangState({ [entri.kasusId!]: { ditangani: 2, benar: 1, bintang: 2, terakhirHari: 5 } })
    render(<DexSkdi />)

    const { default: userEvent } = await import('@testing-library/user-event')
    // CODEX ronde-13: pointerEventsCheck default (EachApiCall) jalan getComputedStyle
    // di rantai leluhur setiap langkah pointer — mahal di jsdom dgn 144 entri Dex,
    // bikin test ini rutin memakan 4,5-4,6s dari batas 5s (rawan timeout di CI lebih
    // lambat). Kita tak menguji visibility pointer-events di sini — matikan cek itu.
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    await user.click(screen.getByRole('button', { name: new RegExp(entri.nama) }))

    expect(screen.getByText('Ditangani')).toBeInTheDocument()
    expect(screen.getByText('2×')).toBeInTheDocument()
  }, 15000)
})

// CODEX audit UI/UX 2026-07-10 (#16f + Polish#3a): kartu terisi tak expose
// status "aktif" ke assistive tech, dan 144 entri dirender tanpa pencarian.
describe('<DexSkdi /> — aria-current kartu & pencarian entri (koreksi review Batch-7)', () => {
  beforeEach(() => {
    pasangState()
  })

  it('kartu terisi mendapat aria-current="true" setelah diklik (bukan aria-pressed — bukan toggle button)', async () => {
    const entri = PACK.skdi144.find((e) => e.id === ENTRI_AUTO_TAUTAN)!
    pasangState({ [entri.kasusId!]: { ditangani: 1, benar: 1, bintang: 1, terakhirHari: 1 } })
    render(<DexSkdi />)

    const tombol = screen.getByRole('button', { name: new RegExp(entri.nama) })
    expect(tombol).not.toHaveAttribute('aria-current')

    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    await user.click(tombol)

    expect(tombol).toHaveAttribute('aria-current', 'true')
  }, 15000)

  it('mengetik di pencarian menyaring grid ke entri yang cocok saja', () => {
    // Fixture nyata (bukan tebakan): entri pertama & kedua di PACK.skdi144,
    // namanya sudah dipastikan tak tumpang tindih (Kejang Demam vs Tetanus).
    const target = PACK.skdi144[0]!
    const lain = PACK.skdi144[1]!
    render(<DexSkdi />)

    expect(screen.getAllByText(/^\d{3}$/)).toHaveLength(PACK.skdi144.length)

    fireEvent.change(screen.getByLabelText('Cari SKDI'), { target: { value: target.nama } })

    expect(screen.getAllByText(/^\d{3}$/).length).toBeLessThan(PACK.skdi144.length)
    expect(screen.getByText(String(1).padStart(3, '0'))).toBeInTheDocument()
    expect(screen.queryByText(String(2).padStart(3, '0'))).not.toBeInTheDocument()
  })
})

// CODEX M14 #23 (keputusan Dr. Wirayuda): lapisan debrief M11.5 (mutiaraEbm/
// catatanRealita/panduanResmi) dipersist ke Buku Saku — kini bisa dibaca ulang
// per kasus, bukan sekali-baca di modal PanelHasil.
describe('<DexSkdi /> — lapisan debrief M11.5 dipersist per kasus (#23)', () => {
  it('kasus tertangani dgn lapisan M11.5 menampilkannya di panel Catatan Penyakit', async () => {
    // Cari entri skdi144 yg kasusId-nya menyediakan salah satu lapisan M11.5.
    const entri = PACK.skdi144.find((e) => {
      const k = e.kasusId ? PACK.kasus[e.kasusId] : undefined
      return !!k && !!(k.mutiaraEbm || k.catatanRealita || k.panduanResmi)
    })
    expect(entri, 'butuh ≥1 kasus tertaut Dex dgn lapisan M11.5').toBeDefined()
    const kasus = PACK.kasus[entri!.kasusId!]!

    pasangState({ [entri!.kasusId!]: { ditangani: 1, benar: 1, bintang: 1, terakhirHari: 1 } })
    render(<DexSkdi />)

    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    await user.click(screen.getByRole('button', { name: (n: string) => n.includes(entri!.nama) }))

    // Lapisan yang tersedia harus muncul verbatim (dibaca langsung dari PACK).
    if (kasus.mutiaraEbm) expect(screen.getByText(kasus.mutiaraEbm)).toBeInTheDocument()
    if (kasus.catatanRealita) expect(screen.getByText(kasus.catatanRealita)).toBeInTheDocument()
    if (kasus.panduanResmi) expect(screen.getByText(kasus.panduanResmi)).toBeInTheDocument()
  }, 15000)
})
