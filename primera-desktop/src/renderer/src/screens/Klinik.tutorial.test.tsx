/**
 * TEST KOMPONEN — sorotan tutorial di Klinik (DeepThink "onboarding
 * railroaded", keputusan user). Kunci klaim: banner + sorotan tampil hanya
 * saat tutorialAktif DAN kasus aktif memang KASUS_TUTORIAL; tombol lain
 * terkunci (disabled) selama sorotan aktif.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { Klinik } from './Klinik'
import { KASUS_TUTORIAL, REGION_PERTAMA_TUTORIAL } from './klinik/tutorialKlinik'

function pasang(): void {
  window.primer = {
    save: { write: async () => true, read: async () => null, list: async () => [], delete: async () => true },
    telemetri: { append: async () => true, read: async () => [] },
    appVersion: async () => 'test',
  }
  const s = buildInitialState('Uji Klinik', 42, PACK)
  useGame.setState({ state: s })
  useGame.getState().dispatch({ type: 'PANGGIL_PASIEN' })
}

describe('<Klinik /> — sorotan tutorial encounter pertama', () => {
  it('kasus aktif adalah KASUS_TUTORIAL, banner tampil, pertanyaan pertama disorot & lainnya terkunci', () => {
    pasang()
    expect(useGame.getState().state?.klinik.aktif?.pasien.kasusId).toBe(KASUS_TUTORIAL)

    render(<Klinik />)

    expect(screen.getByText(/Latihan pertama/)).toBeInTheDocument()

    const pertanyaan = screen.getAllByRole('button').filter((b) => b.className.includes('klinik-tanya'))
    expect(pertanyaan.length).toBeGreaterThan(1)
    const disorot = pertanyaan.filter((b) => b.className.includes('klinik-sorot-tutorial'))
    expect(disorot).toHaveLength(1)
    const terkunci = pertanyaan.filter((b) => !b.className.includes('klinik-sorot-tutorial'))
    expect(terkunci.every((b) => (b as HTMLButtonElement).disabled)).toBe(true)
  })

  it('setelah bertanya ≥1 kali, sorotan pindah ke tombol "Selesai Anamnesis"', () => {
    pasang()
    useGame.getState().dispatch({ type: 'TANYA', pertanyaanId: 'q_keluhan' })
    render(<Klinik />)
    const selesai = screen.getByRole('button', { name: /Selesai Anamnesis/ })
    expect(selesai.className).toMatch(/klinik-sorot-tutorial/)
    expect((selesai as HTMLButtonElement).disabled).toBe(false)
  })

  // CODEX: DeckPemeriksaan/FigurTubuh cuma mengunci chip regio berdasar
  // "vital sudah diukur?" (bukan "apakah ini regio yang disorot?"), dan
  // FigurTubuh (SVG figur tubuh) sama sekali tak menerima info kunci —
  // pemain bisa klik regio SEMBARANG lewat gambar figur, melompati alur.
  it('SEBELUM vital diukur: semua chip regio terkunci (bukan cuma tergantung vital)', () => {
    pasang()
    useGame.getState().dispatch({ type: 'TANYA', pertanyaanId: 'q_keluhan' })
    useGame.getState().dispatch({ type: 'LANJUT_FASE' })
    render(<Klinik />)
    const chipRegio = screen.getAllByRole('button').filter((b) => b.className.includes('klinik-regio__chip'))
    expect(chipRegio.length).toBeGreaterThan(1)
    expect(chipRegio.every((b) => (b as HTMLButtonElement).disabled)).toBe(true)
  })

  it('SETELAH vital diukur: HANYA chip regio target yang terbuka, sisanya tetap terkunci', () => {
    pasang()
    useGame.getState().dispatch({ type: 'TANYA', pertanyaanId: 'q_keluhan' })
    useGame.getState().dispatch({ type: 'LANJUT_FASE' })
    useGame.getState().dispatch({ type: 'UKUR_VITAL' })
    render(<Klinik />)
    const chipRegio = screen.getAllByRole('button').filter((b) => b.className.includes('klinik-regio__chip'))
    const terbuka = chipRegio.filter((b) => !(b as HTMLButtonElement).disabled)
    expect(terbuka).toHaveLength(1)
    expect(terbuka[0]?.className).toMatch(/klinik-sorot-tutorial/)
  })

  it('figur tubuh (SVG): klik regio BUKAN target tak boleh mendispatch PERIKSA', () => {
    pasang()
    useGame.getState().dispatch({ type: 'TANYA', pertanyaanId: 'q_keluhan' })
    useGame.getState().dispatch({ type: 'LANJUT_FASE' })
    useGame.getState().dispatch({ type: 'UKUR_VITAL' })
    const { container } = render(<Klinik />)
    const zonaBukanTarget = container.querySelector(
      `.klinik-figur__hot:not([data-region="${REGION_PERTAMA_TUTORIAL}"])`,
    )
    expect(zonaBukanTarget).toBeTruthy()
    fireEvent.click(zonaBukanTarget!)
    expect(useGame.getState().state?.klinik.aktif?.diperiksa).toHaveLength(0)
  })
})

// M9.1 — invarian MENYELURUH pengganti test titik-per-titik: di tiap langkah
// sepanjang tutorial (bukan cuma anamnesis-awal & pemeriksaan seperti di atas),
// TEPAT SATU tombol di region "Deck aksi klinik" boleh aktif. Ditulis setelah
// investigasi solo (bukan CODEX) menemukan 2 celah baru yang luput dari test
// per-titik lama: DeckAnamnesis melepas kunci SEMUA pertanyaan lain begitu 1
// sudah ditanya (bukan cuma menyalakan "Selesai"), dan DeckDiagnosis tak
// pernah mengunci toggle TEGAK/SUSPEK sama sekali. Regresi apa pun di Deck
// manapun (termasuk yang belum ada hari ini) akan tertangkap generik di sini,
// tanpa perlu tahu dulu titik mana yang bocor. Didorong lewat KLIK (bukan
// dispatch mentah) persis seperti pemain sungguhan — beberapa transisi
// (diagnosis/terapi) bergantung pada `useState` lokal komponen yg tak
// terjangkau dispatch langsung.
function tombolAktifDiDeck(): HTMLButtonElement[] {
  const deck = screen.getByRole('region', { name: /^Deck aksi klinik/ })
  return [...deck.querySelectorAll('button')].filter(
    (b) => !(b as HTMLButtonElement).disabled,
  ) as HTMLButtonElement[]
}

/** Klik tombol yang sedang disorot di dalam region Deck aksi. */
function klikSorot(): void {
  const deck = screen.getByRole('region', { name: /^Deck aksi klinik/ })
  const tombol = deck.querySelector('button.klinik-sorot-tutorial')
  expect(tombol).toBeTruthy()
  fireEvent.click(tombol!)
}

describe('<Klinik /> — invarian menyeluruh: tepat 1 tombol aktif per langkah tutorial', () => {
  it('anamnesis → pemeriksaan → diagnosis → terapi → disposisi: tak pernah >1 tombol aktif sekaligus', () => {
    pasang()
    render(<Klinik />)

    // 1. Anamnesis — pertanyaan target
    expect(tombolAktifDiDeck()).toHaveLength(1)
    klikSorot()
    // 2. Anamnesis — HANYA "Selesai Anamnesis"; pertanyaan LAIN yg belum
    //    ditanya harus tetap terkunci (celah yg ditemukan investigasi M9).
    expect(tombolAktifDiDeck()).toHaveLength(1)
    klikSorot()

    // 3. Pemeriksaan — "Ukur Tanda Vital"
    expect(tombolAktifDiDeck()).toHaveLength(1)
    klikSorot()
    // 4. Pemeriksaan — chip regio target (SVG diverifikasi terpisah di atas)
    expect(tombolAktifDiDeck()).toHaveLength(1)
    klikSorot()
    // 5. Pemeriksaan — "Selesai Pemeriksaan"
    expect(tombolAktifDiDeck()).toHaveLength(1)
    klikSorot()

    // 6. Diagnosis — opsi banding target (TEGAK/SUSPEK harus terkunci di
    //    sini — celah lain yg ditemukan investigasi M9).
    expect(tombolAktifDiDeck()).toHaveLength(1)
    klikSorot()
    // 7. Diagnosis — "Stempelkan Diagnosis"
    expect(tombolAktifDiDeck()).toHaveLength(1)
    klikSorot()

    // 8. Terapi — obat target
    expect(tombolAktifDiDeck()).toHaveLength(1)
    klikSorot()
    // 9. Terapi — "Selesai Terapi"
    expect(tombolAktifDiDeck()).toHaveLength(1)
    klikSorot()

    // 10. Disposisi — HANYA "PULANGKAN" (OBSERVASI/RUJUK harus terkunci;
    //     kasus tutorial selalu harusDirujuk:false).
    expect(tombolAktifDiDeck()).toHaveLength(1)
    const pulangkan = screen
      .getByRole('region', { name: /^Deck aksi klinik/ })
      .querySelector('button.klinik-sorot-tutorial')
    expect(pulangkan?.textContent).toMatch(/PULANGKAN/)
  })
})
