/**
 * TEST KOMPONEN — Rapor: guard stempel grade prematur (CODEX audit UI/UX
 * 2026-07-10, #23).
 *
 * Sebelum fix: `gradeDariTotal` (scoring.ts) menstempel A-D tanpa syarat
 * "ada cukup data" — di Hari 1 pagi SEBELUM pasien ditangani, tally masih
 * nol tapi manajemen (kapitasi awal besar) & resiliensi (burnout=0) mulai
 * dari nilai default tinggi, total = 30 → stempel 'D — Perlu Pembinaan'
 * padahal belum ada aktivitas SAMA SEKALI. Tab Rapor tak terkunci seperti
 * tab Peta, jadi ini bisa terlihat dari menit pertama.
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { hitungSkor } from '@engine/director'
import { PACK } from '@content/index'
import { Rapor } from './Rapor'

describe('<Rapor />', () => {
  it('Hari 1 pagi (tally nol semua) — stempel grade A-D TIDAK tampil, diganti badge netral', () => {
    const state = buildInitialState('Uji Rapor', 1, PACK)
    useGame.setState({ state })

    render(<Rapor />)

    // Regex spesifik (bukan "/belum ada data/i" generik) — kartu UKM sudah
    // punya teks "belum ada data" sendiri untuk iksDesa, tidak boleh dobel-hitung.
    expect(screen.getByText(/belum ada data — kembali setelah menangani pasien/i)).toBeInTheDocument()
    expect(screen.queryByText(/Perlu Pembinaan/)).not.toBeInTheDocument()
    expect(screen.queryByText(/PTT Teladan/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Kompeten/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Lulus$/)).not.toBeInTheDocument()
  })

  it('regresi: sudah ada pasien tertangani — stempel grade normal tetap tampil', () => {
    const state = buildInitialState('Uji Rapor', 1, PACK)
    const stateDenganPasien = {
      ...state,
      tally: { ...state.tally, totalPasien: 1, diagnosisBenar: 1, tegakBenar: 1 },
    }
    useGame.setState({ state: stateDenganPasien })

    render(<Rapor />)

    const { gradeLabel } = hitungSkor(stateDenganPasien)
    expect(screen.queryByText(/belum ada data — kembali setelah menangani pasien/i)).not.toBeInTheDocument()
    expect(screen.getByText(new RegExp(gradeLabel))).toBeInTheDocument()
  })
})
