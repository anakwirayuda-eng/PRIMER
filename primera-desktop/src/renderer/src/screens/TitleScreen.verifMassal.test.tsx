/**
 * TEST — Verifikasi Massal dossier (2026-07-23): dosen memilih banyak berkas
 * sekaligus; tiap baris diverifikasi berurutan; rekap + tabel + CSV. Mock
 * @engine/verifikasi (pola sama TitleScreen.dossierRace.test).
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useGame } from '../store'
import { TitleScreen } from './TitleScreen'
import { verifikasiDossier, type HasilVerifikasi } from '@engine/verifikasi'

vi.mock('@engine/verifikasi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@engine/verifikasi')>()
  return { ...actual, verifikasiDossier: vi.fn() }
})

function pasangPrimerStub() {
  window.primer = {
    save: {
      write: async () => true,
      read: async () => null,
      list: async () => [],
      delete: async () => true,
    },
    telemetri: {
      append: async () => true,
      read: async () => [],
    },
    appVersion: async () => 'test',
  }
}

const SKOR = {
  ukp: 20, ukm: 20, manajemen: 10, resiliensi: 10, total: 60,
  grade: 'B' as const, gradeLabel: 'Kompeten',
  rincian: { akurasiDiagnosis: 0, rrns: 0, guillotine: 1, iksDesa: 0, kualitasMi: 0, kalibrasi: 0, prosesKlinis: 0 },
}

function buatHasil(namaDokter: string, nim: string, status: HasilVerifikasi['status']): HasilVerifikasi {
  return {
    status,
    alasan: status === 'sah' ? [] : ['contoh alasan'],
    ringkasan: { namaDokter, nim, mode: 'ujian', seed: 1, hari: 30, tamat: true, skorKlaim: SKOR },
  }
}

function fileDossier(nama: string): File {
  return new File([JSON.stringify({ dummy: nama })], nama, { type: 'application/json' })
}

afterEach(() => {
  cleanup()
  vi.mocked(verifikasiDossier).mockReset()
})

describe('<TitleScreen /> — Verifikasi Massal (2026-07-23)', () => {
  it('tiga berkas: tabel per-baris, rekap hitungan, dan baris gagal-dibaca', async () => {
    pasangPrimerStub()
    useGame.setState({ arsip: null, state: null, slots: [], meta: null, sedangMemuat: false })
    const mock = vi.mocked(verifikasiDossier)
    // Berkas diproses terurut nama: a.json, b.json, c.json.
    mock.mockResolvedValueOnce(buatHasil('Andi', '111', 'sah'))
    mock.mockResolvedValueOnce(buatHasil('Budi', '222', 'tidak_sah'))
    mock.mockRejectedValueOnce(new Error('meledak'))

    render(<TitleScreen />)
    const user = userEvent.setup()
    const input = screen.getByLabelText(/Verifikasi Massal/) as HTMLInputElement
    await user.upload(input, [fileDossier('a.json'), fileDossier('b.json'), fileDossier('c.json')])

    await waitFor(() => expect(screen.getByText(/dr\. Andi/)).toBeInTheDocument())
    expect(screen.getByText(/dr\. Budi/)).toBeInTheDocument()
    expect(screen.getByText('a.json')).toBeInTheDocument()
    expect(screen.getByText('c.json')).toBeInTheDocument()
    // Rekap: 1 sah · 1 tidak sah · 0 tak dapat · 1 gagal dibaca.
    expect(screen.getByText(/1 sah · 1 tidak sah · 0 tak dapat diverifikasi · 1 gagal dibaca/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Unduh CSV' })).toBeInTheDocument()
  })

  it('CSV memuat header + baris + penetral formula (anti injeksi spreadsheet)', async () => {
    pasangPrimerStub()
    useGame.setState({ arsip: null, state: null, slots: [], meta: null, sedangMemuat: false })
    const mock = vi.mocked(verifikasiDossier)
    // Nama dokter berawalan '=': wajib dinetralkan di CSV.
    mock.mockResolvedValueOnce(buatHasil('=CMD()', '333', 'sah'))

    let isiBlob: Blob | null = null
    const urlAsli = URL.createObjectURL
    URL.createObjectURL = vi.fn((b: Blob) => {
      isiBlob = b
      return 'blob:uji'
    }) as typeof URL.createObjectURL
    const revokeAsli = URL.revokeObjectURL
    URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL

    try {
      render(<TitleScreen />)
      const user = userEvent.setup()
      await user.upload(
        screen.getByLabelText(/Verifikasi Massal/) as HTMLInputElement,
        [fileDossier('kelas.json')],
      )
      await waitFor(() => expect(screen.getByRole('button', { name: 'Unduh CSV' })).toBeInTheDocument())
      await user.click(screen.getByRole('button', { name: 'Unduh CSV' }))

      expect(isiBlob).not.toBeNull()
      const teks = await isiBlob!.text()
      expect(teks).toContain('"berkas";"status";"nama";"nim"')
      expect(teks).toContain('kelas.json')
      expect(teks).toContain('"\'=CMD()"') // awalan formula dinetralkan '
    } finally {
      URL.createObjectURL = urlAsli
      URL.revokeObjectURL = revokeAsli
    }
  })
})
