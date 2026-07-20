import { describe, expect, it } from 'vitest'
import { JUMLAH_VARIAN_VISUAL_PASIEN, profilVisualPasien } from './patientVisualProfiles'

describe('M12 - profil visual pasien', () => {
  it('menyediakan 40 variasi demografis tanpa memakai diagnosis', () => {
    expect(JUMLAH_VARIAN_VISUAL_PASIEN).toBe(40)
    const dasar = { id: 'pasien-17', usia: 34, jenisKelamin: 'P' as const }
    const denganKasusA = { ...dasar, kasusId: 'asma' }
    const denganKasusB = { ...dasar, kasusId: 'tifoid' }
    expect(profilVisualPasien(denganKasusA)).toEqual(profilVisualPasien(denganKasusB))
  })

  it('stabil untuk identitas yang sama dan memakai koordinat atlas valid', () => {
    for (let i = 0; i < 120; i += 1) {
      const pasien = {
        id: `pasien-${i}`,
        usia: i % 90,
        jenisKelamin: i % 2 === 0 ? 'L' as const : 'P' as const,
      }
      const pertama = profilVisualPasien(pasien)
      expect(profilVisualPasien(pasien)).toEqual(pertama)
      expect(pertama.posisi).toMatch(/^(0%|50%|100%) (0%|50%|100%)$/)
      expect(pertama.ukuranAtlas).toMatch(/^(200% 200%|300% 300%)$/)
    }
  })

  it('memilih kelompok umur dan jenis kelamin yang sesuai', () => {
    expect(profilVisualPasien({ id: 'bayi', usia: 0, usiaBulan: 3, jenisKelamin: 'P' }).kelompok).toBe('bayi_balita')
    expect(profilVisualPasien({ id: 'balita', usia: 4, jenisKelamin: 'L' }).kelompok).toBe('bayi_balita')
    expect(profilVisualPasien({ id: 'anak', usia: 12, jenisKelamin: 'P' }).kelompok).toBe('anak_remaja')
    expect(profilVisualPasien({ id: 'dewasa-p', usia: 32, jenisKelamin: 'P' }).kelompok).toBe('dewasa_perempuan')
    expect(profilVisualPasien({ id: 'dewasa-l', usia: 32, jenisKelamin: 'L' }).kelompok).toBe('dewasa_laki')
    expect(profilVisualPasien({ id: 'lansia', usia: 71, jenisKelamin: 'P' }).kelompok).toBe('lansia')
  })

  it('mendistribusikan identitas dalam kelompok, bukan satu wajah berulang', () => {
    const indeks = new Set(
      Array.from({ length: 60 }, (_, i) =>
        profilVisualPasien({ id: `dewasa-${i}`, usia: 35, jenisKelamin: 'L' }).indeks,
      ),
    )
    expect(indeks.size).toBe(9)
  })
})
