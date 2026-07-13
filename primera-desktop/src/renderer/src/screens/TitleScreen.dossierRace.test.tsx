/**
 * TEST KOMPONEN — race condition pemilihan berkas Verifikasi Dossier (audit
 * CODEX 2026-07-11, temuan #8). Probe: memilih dossier KEDUA sebelum
 * verifikasi dossier PERTAMA selesai (baca file + hash + replay, tak instan)
 * tidak boleh membuat hasil PERTAMA yang telat resolve menimpa hasil KEDUA
 * yang lebih cepat — dosen harus selalu melihat vonis utk berkas terakhir
 * dipilih, bukan berkas mana pun yang kebetulan resolve belakangan.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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

function fileDossier(nama: string): File {
  return new File([JSON.stringify({ dummy: nama })], nama, { type: 'application/json' })
}

const SKOR_KOSONG = {
  ukp: 0,
  ukm: 0,
  manajemen: 0,
  resiliensi: 0,
  total: 0,
  grade: 'D' as const,
  gradeLabel: '—',
  rincian: { akurasiDiagnosis: 0, rrns: 0, guillotine: 1, iksDesa: 0, kualitasMi: 0, kalibrasi: 0, prosesKlinis: 0 },
}

function buatHasil(namaDokter: string, status: HasilVerifikasi['status']): HasilVerifikasi {
  return {
    status,
    alasan: [],
    ringkasan: {
      namaDokter,
      mode: 'karier',
      seed: 1,
      hari: 1,
      tamat: false,
      skorKlaim: SKOR_KOSONG,
    },
  }
}

describe('<TitleScreen /> — race condition Verifikasi Dossier (CODEX audit 2026-07-11, #8)', () => {
  it('hasil dossier PERTAMA yang telat resolve TIDAK menimpa hasil dossier KEDUA yang lebih cepat', async () => {
    pasangPrimerStub()
    useGame.setState({ arsip: null, slots: [], meta: null, sedangMemuat: false })

    let selesaikanPertama: (h: HasilVerifikasi) => void = () => {}
    const janjiPertama = new Promise<HasilVerifikasi>((resolve) => {
      selesaikanPertama = resolve
    })
    const mockFn = vi.mocked(verifikasiDossier)
    mockFn.mockImplementationOnce(() => janjiPertama)
    mockFn.mockImplementationOnce(async () => buatHasil('dr. Kedua', 'sah'))

    render(<TitleScreen />)
    const user = userEvent.setup()
    const input = screen.getByLabelText(/Verifikasi Dossier/) as HTMLInputElement

    await user.upload(input, fileDossier('pertama.json'))
    await user.upload(input, fileDossier('kedua.json'))

    // Dossier KEDUA (cepat) sudah tampil duluan.
    expect(await screen.findByText(/dr\. Kedua/)).toBeInTheDocument()

    // Dossier PERTAMA baru resolve SEKARANG, telat — tak boleh menimpa layar.
    selesaikanPertama(buatHasil('dr. Pertama', 'tidak_sah'))
    await new Promise((r) => setTimeout(r, 0))

    expect(screen.queryByText(/dr\. Pertama/)).not.toBeInTheDocument()
    expect(screen.getByText(/dr\. Kedua/)).toBeInTheDocument()
  })
})
