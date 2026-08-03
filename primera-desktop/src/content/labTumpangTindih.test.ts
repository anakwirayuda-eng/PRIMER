/**
 * TEST — game tidak boleh mengarang hasil "normal" yang bertentangan dengan
 * hasil abnormal yang ditulis kasus pada pasien yang sama.
 *
 * Dilaporkan dr. Wirayuda saat playtest 2026-08-03: satu pasien menampilkan
 * "Kolesterol Total — normal — dalam batas normal" TEPAT DI ATAS "Profil
 * Lipid — tinggi — Kolesterol total 268". Dua hasil bertentangan, dan yang
 * salah justru berlabel normal.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from './index'
import { PASANGAN_ANALIT, pasanganAnalitUntuk } from './labTumpangTindih'

describe('peta tumpang-tindih analit lab', () => {
  it('setiap pasangan menunjuk lab yang benar-benar ada di katalog', () => {
    const hilang: string[] = []
    for (const p of PASANGAN_ANALIT) {
      if (!PACK.lab[p.sempit]) hilang.push(p.sempit)
      if (!PACK.lab[p.luas]) hilang.push(p.luas)
    }
    expect(hilang).toEqual([])
  })

  it('pencarian pasangan bekerja dua arah', () => {
    expect(pasanganAnalitUntuk('kolesterol').map((x) => x.pasanganId)).toContain('profil_lipid')
    expect(pasanganAnalitUntuk('profil_lipid').map((x) => x.pasanganId)).toContain('kolesterol')
  })

  it('lab tanpa pasangan tidak mengembalikan apa pun', () => {
    expect(pasanganAnalitUntuk('foto_toraks')).toEqual([])
  })

  /**
   * Kontrak inti. Untuk TIAP kasus dan TIAP pasangan analit: bila kasus
   * menulis hasil abnormal pada salah satu sisi tetapi tidak menulis apa pun
   * pada sisi lain, pasangannya WAJIB dapat ditemukan — supaya lembar periksa
   * meminjam hasil itu alih-alih mengarang "normal".
   */
  it('tiap kasus dengan hasil abnormal sepihak punya jalur pinjam yang bekerja', () => {
    const bolong: string[] = []

    for (const kasus of Object.values(PACK.kasus)) {
      const perId = new Map(kasus.lab.map((l) => [l.id, l]))
      for (const p of PASANGAN_ANALIT) {
        for (const [ada, kosong] of [
          [p.sempit, p.luas],
          [p.luas, p.sempit],
        ] as const) {
          const tertulis = perId.get(ada)
          if (!tertulis || tertulis.flag === 'normal') continue
          if (perId.has(kosong)) continue // dua-duanya ditulis penulis kasus

          const ketemu = pasanganAnalitUntuk(kosong).some((x) => {
            const lain = perId.get(x.pasanganId)
            return lain !== undefined && lain.flag !== 'normal'
          })
          if (!ketemu) bolong.push(`${kasus.id}: ${kosong} tidak menemukan ${ada}`)
        }
      }
    }

    expect(bolong).toEqual([])
  })

  it('kasus andalan yang dilaporkan playtest benar-benar terlindungi', () => {
    // mm_dislipidemia: menulis profil_lipid tinggi, TIDAK menulis kolesterol.
    const dislipidemia = PACK.kasus['mm_dislipidemia']
    expect(dislipidemia, 'kasus mm_dislipidemia harus ada').toBeDefined()
    expect(dislipidemia!.lab.find((l) => l.id === 'kolesterol')).toBeUndefined()
    const lipid = dislipidemia!.lab.find((l) => l.id === 'profil_lipid')
    expect(lipid?.flag).not.toBe('normal')
    expect(pasanganAnalitUntuk('kolesterol').map((x) => x.pasanganId)).toContain('profil_lipid')
  })

  it('preeklampsia berat: memesan urinalisis tidak boleh menutupi proteinuria', () => {
    // Paling berbahaya secara klinis dari 55 kombinasi yang terukur.
    const pe = PACK.kasus['kia_preeklampsia_berat']
    expect(pe, 'kasus kia_preeklampsia_berat harus ada').toBeDefined()
    const protein = pe!.lab.find((l) => l.id === 'proteinuria')
    expect(protein?.flag).not.toBe('normal')
    expect(pe!.lab.find((l) => l.id === 'urinalisis')).toBeUndefined()
    expect(pasanganAnalitUntuk('urinalisis').map((x) => x.pasanganId)).toContain('proteinuria')
  })
})
