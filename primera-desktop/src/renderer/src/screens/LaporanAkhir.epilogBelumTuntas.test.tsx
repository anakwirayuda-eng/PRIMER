/**
 * TEST KOMPONEN — "Kabar dari Desa" tak boleh menghapus keluarga yang
 * pendampingannya berhenti di tengah jalan (audit CODEX 2026-08-04, temuan 1,
 * babak kedua).
 *
 * Latar: temuan 1 memperbaiki flush akhir stase supaya berhenti membekukan
 * klaim `arcSelesai: 'berhasil'` untuk keluarga yang terbukti ingkar janji.
 * Efek sampingnya baru terlihat di layar ini: saringan lama
 * `.filter((k) => k.arcSelesai !== undefined)` membuat keluarga tersebut —
 * dan setiap keluarga yang arc-nya belum tamat — HILANG TANPA JEJAK dari
 * laporan akhir. Menghilang membaca seperti "tidak terjadi apa-apa", padahal
 * justru di situ pelajarannya: perubahan perilaku butuh pendampingan berulang.
 *
 * Yang dijaga test ini:
 * 1. keluarga yang sudah dikunjungi tapi arc-nya belum tuntas TETAP muncul;
 * 2. ia tidak dicap "Berubah" maupun "Krisis" (dua klaim yang belum terbukti);
 * 3. teksnya memakai catatan yang MEMANG ditulis engine, bukan epilog karangan;
 * 4. keluarga yang belum pernah dikunjungi tetap tidak diikutkan (bagian ini
 *    bercerita tentang pendampingan, bukan daftar seluruh desa).
 */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useGame } from '../store'
import { buildInitialState } from '@engine/init'
import { PACK } from '@content/index'
import type { CareEpisodeLite, KeluargaState } from '@engine/state'
import { LaporanAkhir } from './LaporanAkhir'

// Layar ini membuka diri bertahap (stempel → dimensi → sisanya) lewat timer.
// Epilog ada di babak terakhir, jadi mode "kurangi gerak" dinyalakan supaya
// seluruh isi tampil seketika — jalur yang memang disediakan komponennya.
vi.mock('../useMotionDikurangi', () => ({ useMotionDikurangi: () => true }))

/** Dua keluarga pertama pack — dipakai sebagai subjek uji. */
const ID_KELUARGA = Object.keys(PACK.keluarga)

function stateTamat() {
  const dasar = buildInitialState('Uji Epilog', 1, PACK)
  return { ...dasar, hari: 90 }
}

function keluargaDikunjungi(kel: KeluargaState, jumlah: number): KeluargaState {
  const { arcSelesai: _belum, ...tanpaArc } = kel
  return { ...tanpaArc, jumlahKunjungan: jumlah, kunjunganTerakhir: 80 }
}

function episodeKeluarga(familyId: string, feedback: string): CareEpisodeLite {
  return {
    id: `keluarga:${familyId}:pendampingan`,
    subjectId: familyId,
    subjectName: PACK.keluarga[familyId]!.namaKeluarga,
    familyId,
    rw: PACK.keluarga[familyId]!.rw,
    source: 'keluarga',
    problemId: `keluarga:${familyId}`,
    problemLabel: 'Verifikasi perubahan keluarga',
    owner: 'dokter',
    status: 'menunggu',
    openedDay: 40,
    updatedDay: 82,
    nextAction: 'Kunjungi kembali keluarga ini; jalur pemulihan sudah dibuka.',
    receipt: {
      signal: 'Janji perubahan jamban sehat jatuh tempo.',
      feedback,
      next: 'Kunjungi kembali keluarga ini.',
    },
    history: [],
  }
}

describe('<LaporanAkhir /> — Kabar dari Desa', () => {
  it('keluarga yang dikunjungi tapi arc belum tuntas TETAP tampil, bukan lenyap', () => {
    const id = ID_KELUARGA[0]!
    const dasar = stateTamat()
    const state = {
      ...dasar,
      desa: {
        ...dasar.desa,
        keluarga: {
          ...dasar.desa.keluarga,
          [id]: keluargaDikunjungi(dasar.desa.keluarga[id]!, 3),
        },
      },
      careEpisodes: [episodeKeluarga(id, '1 indikator belum terwujud; 2 indikator terverifikasi.')],
    }
    useGame.setState({ state })

    render(<LaporanAkhir />)

    expect(screen.getByText(PACK.keluarga[id]!.namaKeluarga)).toBeInTheDocument()
    expect(screen.getByText('Belum tuntas')).toBeInTheDocument()
    // Catatan engine dipakai apa adanya — tidak dikarang ulang di renderer.
    expect(
      screen.getByText(/Pendampingan berhenti sebelum tuntas setelah 3 kunjungan\./),
    ).toBeInTheDocument()
    expect(screen.getByText(/1 indikator belum terwujud/)).toBeInTheDocument()
  })

  it('tidak dicap "Berubah" maupun "Krisis" — dua klaim yang belum terbukti', () => {
    const id = ID_KELUARGA[0]!
    const dasar = stateTamat()
    const state = {
      ...dasar,
      desa: {
        ...dasar.desa,
        keluarga: {
          ...dasar.desa.keluarga,
          [id]: keluargaDikunjungi(dasar.desa.keluarga[id]!, 1),
        },
      },
      careEpisodes: [],
    }
    useGame.setState({ state })

    render(<LaporanAkhir />)

    expect(screen.queryByText('Berubah')).not.toBeInTheDocument()
    expect(screen.queryByText('Krisis')).not.toBeInTheDocument()
    // Tanpa catatan episode, kalimatnya tetap jujur dan tidak mengarang hasil.
    expect(
      screen.getByText(/Sampai stase berakhir belum ada perubahan yang terverifikasi\./),
    ).toBeInTheDocument()
  })

  it('keluarga yang belum pernah dikunjungi tetap tidak masuk daftar', () => {
    const dasar = stateTamat()
    // Seluruh keluarga default: jumlahKunjungan 0, arcSelesai undefined.
    useGame.setState({ state: { ...dasar, careEpisodes: [] } })

    render(<LaporanAkhir />)

    expect(screen.queryByText('Kabar dari Desa')).not.toBeInTheDocument()
    expect(screen.queryByText('Belum tuntas')).not.toBeInTheDocument()
  })

  it('arc yang benar-benar tuntas tetap memakai epilog naratif penulis, bukan baris "Belum tuntas"', () => {
    const id = ID_KELUARGA[0]!
    const dasar = stateTamat()
    const state = {
      ...dasar,
      desa: {
        ...dasar.desa,
        keluarga: {
          ...dasar.desa.keluarga,
          [id]: { ...dasar.desa.keluarga[id]!, jumlahKunjungan: 4, arcSelesai: 'berhasil' as const },
        },
      },
      careEpisodes: [],
    }
    useGame.setState({ state })

    render(<LaporanAkhir />)

    expect(screen.getByText('Berubah')).toBeInTheDocument()
    expect(screen.queryByText('Belum tuntas')).not.toBeInTheDocument()
    expect(screen.getByText(PACK.keluarga[id]!.arc.epilogBerhasil)).toBeInTheDocument()
  })
})
