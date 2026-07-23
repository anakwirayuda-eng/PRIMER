/**
 * TEST — invarian "namaKeluarga sudah berisi prefix Keluarga" (2026-07-10,
 * live bug via screenshot user: "Keluarga Keluarga Mas Andri & Mbak Endah").
 * Root cause: SEMUA 16 nilai `namaKeluarga` di content SUDAH ditulis lengkap
 * dgn prefix "Keluarga " (mis. 'Keluarga Bu Marni') — tapi 7 titik render
 * (4 file) menambahkan literal "Keluarga " LAGI di depannya. Pagar level
 * SUMBER (bukan cuma isi test, karena 3 dari 4 titik yg kena tak py test
 * unit sama sekali) — assert SNIPPET FIKS PERSIS hadir DAN pola dobel
 * ("Keluarga Keluarga"/literal "Keluarga " menempel di depan tanda yg sama)
 * tak pernah muncul, alih-alih menghitung offset karakter (rapuh thd bentuk
 * JSX yg beda-beda — ternary vs span polos vs title attr).
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PACK } from '@content/index'

const baca = (p: string) => readFileSync(resolve(__dirname, p), 'utf8')

describe('invarian namaKeluarga (2026-07-10)', () => {
  it('semua namaKeluarga content sudah berisi prefix "Keluarga "', () => {
    for (const kel of Object.values(PACK.keluarga)) {
      expect(kel.namaKeluarga, kel.id).toMatch(/^Keluarga /)
    }
  })

  // Tiap entri: snippet PERSIS yg harus ada sekarang (fix), + snippet dobel
  // yg PERNAH ada sebelum fix (harus tak pernah muncul lagi, di file mana pun).
  const TITIK = [
    {
      file: '../screens/peta/KartuKeluarga.tsx',
      fiks: '<div className="peta-keluarga__nama">{content.namaKeluarga}</div>',
      dobel: 'Keluarga {content.namaKeluarga}',
    },
    {
      // Audit premium 2026-07-23: title= → data-tip= (tooltip instan global);
      // invarian anti-dobel-"Keluarga" tetap dijaga pada atribut barunya.
      file: '../screens/PetaDesa.tsx',
      fiks: 'data-tip={`${content.namaKeluarga} — RW ${content.rw}. Klik untuk membuka RW-nya.`}',
      dobel: 'data-tip={`Keluarga ${content.namaKeluarga}',
    },
    {
      file: '../screens/PetaDesa.tsx',
      fiks: '{keluargaHasil ? keluargaHasil.namaKeluarga : hasilKunjungan.keluargaId}',
      dobel: 'Keluarga {keluargaHasil ? keluargaHasil.namaKeluarga',
    },
    {
      file: '../screens/Kunjungan.tsx',
      // M12 memindahkan identitas pembicara dari fallback kepala keluarga ke
      // profil NPC per-node. Pagar tetap memastikan nama keluarga tidak diprefix
      // ulang, tanpa membekukan implementasi kepala-keluarga yang sudah usang.
      fiks: 'const namaWarga = profilWarga.nama',
      dobel: 'kepala.nama : `Keluarga ${kelContent.namaKeluarga}`',
    },
    {
      file: '../screens/Kunjungan.tsx',
      fiks: '<span>{kelContent.namaKeluarga}</span>',
      dobel: 'Keluarga {kelContent.namaKeluarga}',
    },
  ]

  it.each(TITIK)('$file: snippet fix hadir, snippet dobel-Keluarga tak pernah muncul lagi', ({ file, fiks, dobel }) => {
    const src = baca(file)
    expect(src, `${file}: snippet fix tak ditemukan — mungkin sudah direfactor lagi, sesuaikan test`).toContain(fiks)
    expect(src, `${file}: pola dobel "Keluarga Keluarga X" muncul lagi`).not.toContain(dobel)
  })

  it('2 titik MejaKerja (saran kunjungan pagi+siang): {s.nama} tak didahului literal "Keluarga "', () => {
    const src = baca('../screens/MejaKerja.tsx')
    const cocokFiks = [...src.matchAll(/<span className="mk__saran-nama">\{s\.nama\}<\/span>/g)]
    expect(cocokFiks.length, 'harus ada 2 titik {s.nama} polos (saran pagi + siang)').toBe(2)
    expect(src, 'pola dobel "Keluarga {s.nama}" muncul lagi').not.toContain('Keluarga {s.nama}')
  })
})
