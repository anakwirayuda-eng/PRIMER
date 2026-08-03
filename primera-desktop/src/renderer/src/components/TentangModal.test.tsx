/**
 * TEST — Tentang & Kredit: versi yang ditampilkan harus versi BUILD, bukan
 * versi karya terdaftar.
 *
 * Latar (audit CODEX 2026-08-03): layar ini dulu menampilkan METADATA.versi
 * yang dipaku '1.0.0', sehingga beta.9 dan beta.13 tampak identik. Itu
 * mematikan instruksi PANDUAN_DOSEN.md yang menyuruh dosen menyamakan versi
 * antar-komputer sebelum menilai. Sumber kebenarannya kini app.getVersion()
 * lewat IPC — sama dengan yang dipakai ekspor dossier & cek pembaruan.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { TentangModal } from './TentangModal'
import { METADATA } from '@content/metadata'

function pasangShim(versi: string | (() => Promise<string>)): void {
  ;(window as unknown as { primer: unknown }).primer = {
    appVersion: typeof versi === 'function' ? versi : async () => versi,
  }
}

describe('<TentangModal /> — kejujuran versi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('menampilkan versi BUILD dari app.getVersion(), bukan METADATA.versi', async () => {
    pasangShim('1.1.0-beta.99')
    render(<TentangModal onTutup={() => undefined} />)

    await waitFor(() => {
      expect(screen.getByText('1.1.0-beta.99')).toBeInTheDocument()
    })
  })

  it('versi karya terdaftar tetap ditampilkan terpisah — bukan dihapus, hanya tak lagi menyamar sbg versi rilis', async () => {
    pasangShim('1.1.0-beta.99')
    const { container } = render(<TentangModal onTutup={() => undefined} />)

    await waitFor(() => {
      expect(screen.getByText('1.1.0-beta.99')).toBeInTheDocument()
    })
    expect(container.textContent).toContain(`karya terdaftar v${METADATA.versi}`)
  })

  it('IPC gagal → modal tetap tampil utuh (identitas & HKI tidak ikut hilang)', async () => {
    pasangShim(async () => {
      throw new Error('IPC mati')
    })
    const { container } = render(<TentangModal onTutup={() => undefined} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await waitFor(() => {
      expect(container.textContent).toContain(METADATA.haki.nomorRegistrasi)
    })
  })

  it('mengingatkan dosen menyamakan versi antar-komputer (instruksi PANDUAN_DOSEN dapat dijalankan)', async () => {
    pasangShim('1.1.0-beta.99')
    const { container } = render(<TentangModal onTutup={() => undefined} />)

    await waitFor(() => {
      expect(screen.getByText('1.1.0-beta.99')).toBeInTheDocument()
    })
    expect(container.textContent).toMatch(/versi terpasang/i)
    expect(container.textContent).toMatch(/tidak dapat diverifikasi/i)
  })
})
