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
    expect(screen.getByText('Mutu proses SOAP')).toBeInTheDocument()
  })

  // S3 burnout-rapor (c): Rapor jujur — RRNS tiga status tanpa jargon,
  // baris insting/apatis tampil, Prolanis punya baris sendiri.
  it('RRNS: sampel kecil "belum divonis"; jargon "guillotine" tak pernah tampil', () => {
    const state = buildInitialState('Uji Rapor', 1, PACK)
    const kecil = {
      ...state,
      tally: { ...state.tally, totalPasien: 1, diagnosisBenar: 1, rujukanTotal: 2, rujukanNonSpesialistik: 2 },
    }
    useGame.setState({ state: kecil })
    render(<Rapor />)
    expect(screen.getByText(/belum divonis/)).toBeInTheDocument()
    expect(screen.queryByText(/guillotine/i)).not.toBeInTheDocument()
  })

  it('RRNS: sampel cukup — "dalam batas aman" vs "skor klinik terpotong"', () => {
    const state = buildInitialState('Uji Rapor', 1, PACK)
    const aman = {
      ...state,
      tally: { ...state.tally, totalPasien: 10, diagnosisBenar: 10, rujukanTotal: 10 },
    }
    useGame.setState({ state: aman })
    const { unmount } = render(<Rapor />)
    expect(screen.getByText(/dalam batas aman/)).toBeInTheDocument()
    unmount()

    const buruk = {
      ...state,
      tally: { ...state.tally, totalPasien: 10, diagnosisBenar: 10, rujukanTotal: 10, rujukanNonSpesialistik: 5 },
    }
    useGame.setState({ state: buruk })
    render(<Rapor />)
    expect(screen.getByText(/skor klinik terpotong/)).toBeInTheDocument()
  })

  it('baris insting-bermasalah & apatis tampil dengan angkanya', () => {
    const state = buildInitialState('Uji Rapor', 1, PACK)
    useGame.setState({
      state: { ...state, tally: { ...state.tally, totalPasien: 1, autoBermasalah: 2, apathy: 1 } },
    })
    render(<Rapor />)
    expect(screen.getByText('Diserahkan ke insting — bermasalah')).toBeInTheDocument()
    expect(screen.getByText('Peluang UKM diabaikan (apatis)')).toBeInTheDocument()
  })

  // S3 burnout-rapor (d): jurnal refleksi bisa dibaca ulang, terbaru dulu.
  it('jurnal refleksi: entri terkumpul terbaru-dulu; kosong = ajakan menulis', () => {
    const state = buildInitialState('Uji Rapor', 1, PACK)
    useGame.setState({
      state: { ...state, refleksi: { 2: 'Hari berat.', 5: 'Lebih baik.' } },
    })
    const { unmount } = render(<Rapor />)
    expect(screen.getByText(/Jurnal Refleksi — 2 catatan/)).toBeInTheDocument()
    const hari5 = screen.getByText('Hari 5')
    const hari2 = screen.getByText('Hari 2')
    expect(
      hari5.compareDocumentPosition(hari2) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    unmount()

    useGame.setState({ state })
    render(<Rapor />)
    expect(screen.getByText(/Belum ada catatan/)).toBeInTheDocument()
  })
})
