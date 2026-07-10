/**
 * TEST — M11 Fase-1: lapisan pengayaan debrief (mutiaraEbm + catatanRealita).
 *
 * Dua field display BARU pada KasusKlinis:
 *   - mutiaraEbm     — mutiara "temuan bisa menyesatkan" (EBM nuance)
 *   - catatanRealita — catatan "idealis vs realita FKTP Indonesia"
 *
 * INVARIAN KUNCI (kenapa tak butuh bump REVISI_ENGINE): keduanya MURNI display,
 * dibaca langsung dari PACK oleh PanelHasil, TAK ikut sidikJariPack & TAK
 * menyentuh skor. Test ini mengunci janji itu — bila kelak seseorang keliru
 * memasukkannya ke hash, test merah memaksa keputusan REVISI sadar (mencegah
 * kelas bug §49 P1: field display diam-diam menggeser replay).
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { sidikJariPack } from './verifikasi'
import { buatEncounter, nilaiEncounter } from './clinic'
import { buatPasienDariKasus } from './director'
import { Rng } from './core/rng'
import type { EncounterState } from './state'
import type { ContentPack } from '@content/pack'

function encFor(kasusId: string, resep: string[]): EncounterState {
  const pasien = buatPasienDariKasus(kasusId, PACK, new Rng(11, 'm11', kasusId))
  return { ...buatEncounter(pasien), resep }
}

describe('M11 Fase-1 — perintis gout menanam mutiaraEbm + catatanRealita', () => {
  const gout = PACK.kasus['mm_gout_artritis_akut']!
  it('gout menyediakan kedua field pengayaan', () => {
    expect(gout.mutiaraEbm).toBeTruthy()
    expect(gout.catatanRealita).toBeTruthy()
    // Mutiara EBM gout = asam urat serum bisa normal saat serangan akut.
    expect(gout.mutiaraEbm).toMatch(/NORMAL|menyingkirkan/i)
    // Realita FKTP gout = kolkisin tak selalu tersedia; NSAID tumpuan.
    expect(gout.catatanRealita).toMatch(/kolkisin|NSAID|tersedia/i)
  })
})

describe('M11 Fase-1 — field pengayaan TAK ikut sidik jari (tak perlu bump REVISI)', () => {
  it('mengubah mutiaraEbm/catatanRealita tak menggeser sidikJariPack', () => {
    const dasar = sidikJariPack(PACK)
    // Klon dangkal cukup: kita hanya menimpa satu objek kasus dengan salinan
    // yang field pengayaannya diubah total.
    const gout = PACK.kasus['mm_gout_artritis_akut']!
    const packUbah: ContentPack = {
      ...PACK,
      kasus: {
        ...PACK.kasus,
        mm_gout_artritis_akut: {
          ...gout,
          mutiaraEbm: 'TEKS PENGAYAAN BERBEDA TOTAL — seharusnya tak mengubah hash.',
          catatanRealita: 'Realita lain sama sekali — juga tak boleh mengubah hash.',
        },
      },
    }
    expect(sidikJariPack(packUbah)).toBe(dasar)
  })

  it('MENGHAPUS kedua field juga tak menggeser sidik jari (kasus lama tanpa field)', () => {
    const dasar = sidikJariPack(PACK)
    const gout = PACK.kasus['mm_gout_artritis_akut']!
    const { mutiaraEbm: _m, catatanRealita: _r, ...goutPolos } = gout
    const packPolos: ContentPack = {
      ...PACK,
      kasus: { ...PACK.kasus, mm_gout_artritis_akut: goutPolos },
    }
    expect(sidikJariPack(packPolos)).toBe(dasar)
  })
})

describe('M11 Fase-1 — field pengayaan TAK menyentuh skor', () => {
  it('skor terapi/anamnesis gout identik dengan/ tanpa field pengayaan', () => {
    const gout = PACK.kasus['mm_gout_artritis_akut']!
    const resep = ['natrium_diklofenak_50']
    const dgn = nilaiEncounter(encFor('mm_gout_artritis_akut', resep), gout, PACK)
    const goutPolos = { ...gout }
    delete (goutPolos as { mutiaraEbm?: string }).mutiaraEbm
    delete (goutPolos as { catatanRealita?: string }).catatanRealita
    const tanpa = nilaiEncounter(encFor('mm_gout_artritis_akut', resep), goutPolos, PACK)
    expect(dgn.skorTerapi).toBe(tanpa.skorTerapi)
    expect(dgn.skorAnamnesis).toBe(tanpa.skorAnamnesis)
    expect(dgn.grade).toBe(tanpa.grade)
  })
})
