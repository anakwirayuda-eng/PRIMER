/**
 * TEST KOMPONEN — Dex SKDI (harness jsdom+RTL, CODEX audit 2026-07-04 #8 §9).
 * Regresi langsung utk bug ronde-5: dulu komponen baca SKDI144 mentah, bukan
 * PACK.skdi144 (versi auto-tautan ICD) — 23 entri permanen "???" walau
 * kasusnya sudah ditangani. Test ini akan MERAH lagi bila regresi terulang.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  })
})
