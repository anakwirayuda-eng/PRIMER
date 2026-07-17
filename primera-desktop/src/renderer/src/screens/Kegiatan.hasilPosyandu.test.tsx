/**
 * TEST KOMPONEN — narasi KartuHasil Posyandu bersyarat skor (audit CODEX
 * 2026-07-11, temuan #15). Probe: narasi "gizi & imunisasi RW ini membaik"
 * dulu tampil TANPA SYARAT (bahkan saat skor 0/seluruh keputusan salah) —
 * kini harus mengikuti pola cabang KLB (bersyarat `hasil.skor`).
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { Kegiatan } from './Kegiatan'
import type { GameState } from '@engine/state'
import type { HasilKegiatan } from '@engine/kegiatan'

function pasangHasil(hasil: HasilKegiatan) {
  const state: GameState = {
    ...buildInitialState('Uji Komponen', 1, PACK),
    kegiatan: undefined,
    hasilKegiatanTerakhir: hasil,
  }
  useGame.setState({ state })
}

describe('<Kegiatan /> — KartuHasil Posyandu (audit CODEX 2026-07-11, #15)', () => {
  it('skor 0 (semua keputusan salah) → narasi TIDAK mengklaim IKS membaik', () => {
    pasangHasil({ jenis: 'posyandu', benar: 0, total: 4, skor: 0, jawaban: [] })
    render(<Kegiatan />)
    expect(screen.queryByText(/IKS wilayah — gizi & imunisasi RW ini membaik/)).not.toBeInTheDocument()
    expect(screen.getByText(/belum menyumbang perbaikan/)).toBeInTheDocument()
  })

  it('skor > 0 (≥1 keputusan tepat) → narasi IKS membaik tetap tampil', () => {
    pasangHasil({ jenis: 'posyandu', benar: 2, total: 4, skor: 0.5, jawaban: [] })
    render(<Kegiatan />)
    expect(screen.getByText(/IKS wilayah — gizi & imunisasi RW ini membaik/)).toBeInTheDocument()
  })

  it('judul sub Posyandu (sesi aktif) mencerminkan migrasi ILP 5 Langkah, bukan label lama "Sistem 5 Meja"', () => {
    const state: GameState = {
      ...buildInitialState('Uji Komponen', 1, PACK),
      kegiatan: {
        jenis: 'posyandu',
        rw: 1,
        kartu: [{ id: 'k1', judul: 'X', narasi: 'Y', pilihan: [{ id: 'p1', label: 'A', benar: true, respons: 'ok' }] }],
        index: 0,
        jawaban: [],
      },
    }
    useGame.setState({ state })
    render(<Kegiatan />)
    expect(screen.queryByText(/Sistem 5 Meja/)).not.toBeInTheDocument()
    expect(screen.getByText(/ILP 5 Langkah/)).toBeInTheDocument()
  })
})

describe('<Kegiatan /> - sitasi kartu C2', () => {
  it('setelah menjawab kartu, debrief menampilkan sumber resmi kartu', async () => {
    const state: GameState = {
      ...buildInitialState('Uji Komponen', 1, PACK),
      kegiatan: {
        jenis: 'posyandu',
        rw: 1,
        kartu: [
          {
            id: 'posy_timbang',
            judul: 'Langkah 2',
            narasi: 'Narasi uji',
            pilihan: [{ id: 'p1', label: 'Pilihan uji', benar: true, respons: 'Tepat.' }],
          },
        ],
        index: 0,
        jawaban: [],
      },
    }
    useGame.setState({ state })
    render(<Kegiatan />)
    expect(screen.queryByText(/Panduan Pengelolaan Posyandu Bidang Kesehatan/)).not.toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Pilihan uji' }))

    expect(screen.getByText(/Panduan Pengelolaan Posyandu Bidang Kesehatan/)).toBeInTheDocument()
  })
})
