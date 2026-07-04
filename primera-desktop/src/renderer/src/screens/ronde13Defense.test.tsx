/**
 * TEST KOMPONEN — pertahanan render thd sesi aktif korup (CODEX ronde-13).
 * Save yang diedit tangan/rusak bisa membawa sesi aktif (kegiatan/igd/
 * kunjungan) dgn field nested null, atau surat dgn `jenis` asing — semua
 * lolos guard "sesi ada?" di komponen induk krn guard itu cuma cek
 * container, bukan bentuk field di dalamnya. Probe: render tidak throw,
 * fallback aman ditampilkan, bukan blank screen/crash.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import { Kegiatan } from './Kegiatan'
import { Igd } from './Igd'
import { Kunjungan } from './Kunjungan'
import { MejaKerja } from './MejaKerja'
import type { GameState } from '@engine/state'

function pasang(override: Partial<GameState>) {
  const state = buildInitialState('Uji Komponen', 1, PACK)
  useGame.setState({ state: { ...state, ...override } })
}

describe('<Kegiatan /> — sesi korup tidak crash', () => {
  it('kegiatan.kartu = null → fallback "sesi tidak ditemukan", bukan throw', () => {
    pasang({ layar: 'kegiatan', kegiatan: { jenis: 'posyandu', rw: 1, kartu: null as never, index: 0, jawaban: [] } })
    expect(() => render(<Kegiatan />)).not.toThrow()
    expect(screen.getByText(/Sesi kegiatan lapangan tidak ditemukan/)).toBeInTheDocument()
  })

  it('kartu.pilihan = null (kartu ADA, tapi pilihan korup) → fallback, bukan crash .map', () => {
    pasang({
      layar: 'kegiatan',
      kegiatan: {
        jenis: 'posyandu',
        rw: 1,
        kartu: [{ id: 'k1', judul: 'Judul', narasi: 'Narasi', pilihan: null as never }],
        index: 0,
        jawaban: [],
      },
    })
    expect(() => render(<Kegiatan />)).not.toThrow()
    expect(screen.getByText(/Sesi kegiatan lapangan tidak ditemukan/)).toBeInTheDocument()
  })
})

describe('<Igd /> — jawaban korup tidak crash', () => {
  it('igd.jawaban = null (kasusId valid) → tidak throw di ResponsTerakhir', () => {
    const kasusId = Object.keys(PACK.kasusIgd)[0]!
    pasang({
      igd: {
        kasusId,
        pasienNama: 'Pasien Uji',
        usia: 40,
        jenisKelamin: 'L',
        rw: 1,
        fase: 'langkah',
        langkahIndex: 1,
        stabilitas: 80,
        jawaban: null as never,
      },
    })
    expect(() => render(<Igd />)).not.toThrow()
  })
})

describe('<Kunjungan /> — hotspotDitemukan korup tidak crash', () => {
  it('kunjungan.hotspotDitemukan = null → fallback "tidak ada kunjungan", bukan crash .includes', () => {
    const keluargaId = Object.keys(PACK.keluarga)[0]!
    const kelContent = PACK.keluarga[keluargaId]!
    pasang({
      layar: 'kunjungan',
      kunjungan: {
        keluargaId,
        skenarioId: kelContent.arc.kunjungan[0]?.id ?? 'tak_ada',
        fase: 'wawancara',
        hotspotDitemukan: null as never,
        dialogIndex: 0,
        pilihanDiambil: [],
        trustDelta: 0,
        konfrontasiBeruntun: 0,
        diusir: false,
      },
    })
    expect(() => render(<Kunjungan />)).not.toThrow()
  })
})

describe('<MejaKerja /> — surat berjenis asing tidak crash', () => {
  it('inbox berisi surat dgn jenis tak dikenal → chip fallback, bukan crash SURAT_META lookup', () => {
    pasang({
      inbox: [
        {
          id: 'surat_asing_1',
          hari: 1,
          jenis: 'jenis_hantu_tak_dikenal' as never,
          dari: 'Entah',
          judul: 'Surat asing',
          isi: 'Isi surat.',
          dibaca: false,
        },
      ],
    })
    expect(() => render(<MejaKerja />)).not.toThrow()
    expect(screen.getByText('Surat asing')).toBeInTheDocument()
  })
})
