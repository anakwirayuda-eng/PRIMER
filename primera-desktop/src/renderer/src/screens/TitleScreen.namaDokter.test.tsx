/**
 * TEST — normalisasi gelar pada nama dokter (audit UI/UX 2026-07-23).
 * Bug asli: seluruh UI memanggil "dr. {nama}"; pemain yang mengetik "dr. Budi"
 * jadi "dr. dr. Budi" di tombol Lanjutkan/konfirmasi/arsip.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useGame } from '../store'
import { TitleScreen } from './TitleScreen'

describe('TitleScreen — prefiks gelar dilepas sekali di titik masuk nama', () => {
  const kasus: Array<[string, string]> = [
    ['dr. Budi', 'Budi'],
    ['Dr Budi', 'Budi'],
    ['Budi', 'Budi'],
    ['Drajat', 'Drajat'], // nama berawalan "Dr" TANPA spasi — jangan dipotong
    // Kata penuh "Dokter ..." dibiarkan verbatim — kontrak lama
    // TitleScreen.overwrite.test memakai nama "Dokter Baru" apa adanya.
    ['Dokter Baru', 'Dokter Baru'],
  ]

  beforeEach(() => {
    window.localStorage.clear()
  })

  for (const [ketik, harap] of kasus) {
    it(`ketik "${ketik}" → mulaiGameBaru menerima "${harap}"`, () => {
      const spy = vi.fn()
      useGame.setState({ mulaiGameBaru: spy })

      render(<TitleScreen />)
      fireEvent.change(screen.getByPlaceholderText('tulis namamu di sini'), {
        target: { value: ketik },
      })
      fireEvent.submit(screen.getByRole('button', { name: /Mulai Stase/ }))

      expect(spy).toHaveBeenCalledWith(harap, 'karier', undefined)
    })
  }
})
