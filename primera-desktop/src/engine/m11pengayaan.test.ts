/**
 * TEST — M11 Fase-1 + M11.5: lapisan pengayaan debrief.
 *
 * TIGA field display pada KasusKlinis (semua murni display, non-skor, non-hash):
 *   - mutiaraEbm     — mutiara "temuan bisa menyesatkan" (EBM nuance)
 *   - catatanRealita — catatan "idealis vs realita FKTP Indonesia"
 *   - panduanResmi   — panduan RESMI Kemenkes (PPK 1186/2022, M11.5) sbg lapisan
 *                      otoritas ke-3 (divergensi PPK-vs-EBM + kriteria rujukan)
 *
 * INVARIAN KUNCI (kenapa tak butuh bump REVISI_ENGINE): ketiganya MURNI display,
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

describe('M11.5 — perintis konjungtivitis alergi menanam panduanResmi (divergensi PPK-vs-EBM)', () => {
  const konjungtivitis = PACK.kasus['mata_konjungtivitis_alergi']!
  it('kasus perintis menyediakan panduanResmi yg menyebut PPK & divergensi steroid', () => {
    expect(konjungtivitis.panduanResmi).toBeTruthy()
    // Panduan resmi PPK 1186/2022 justru mencantumkan flumetolon (steroid ringan)
    // — beda dari kehati-hatian AAO di clue. Sitasi PPK eksplisit.
    expect(konjungtivitis.panduanResmi).toMatch(/PPK|1186/)
    expect(konjungtivitis.panduanResmi).toMatch(/flumetolon|steroid/i)
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
          panduanResmi: 'Panduan resmi berbeda total — juga tak boleh mengubah hash.',
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

describe('M11.5 — panduanResmi TAK menyentuh skor & TAK ikut sidik jari', () => {
  it('menghapus panduanResmi konjungtivitis tak menggeser sidikJariPack', () => {
    const dasar = sidikJariPack(PACK)
    const k = PACK.kasus['mata_konjungtivitis_alergi']!
    const { panduanResmi: _p, ...kPolos } = k
    const packPolos: ContentPack = {
      ...PACK,
      kasus: { ...PACK.kasus, mata_konjungtivitis_alergi: kPolos },
    }
    expect(sidikJariPack(packPolos)).toBe(dasar)
  })

  it('skor konjungtivitis identik dengan/ tanpa panduanResmi', () => {
    const k = PACK.kasus['mata_konjungtivitis_alergi']!
    const resep = ['loratadin_10', 'air_mata_buatan']
    const dgn = nilaiEncounter(encFor('mata_konjungtivitis_alergi', resep), k, PACK)
    const kPolos = { ...k }
    delete (kPolos as { panduanResmi?: string }).panduanResmi
    const tanpa = nilaiEncounter(encFor('mata_konjungtivitis_alergi', resep), kPolos, PACK)
    expect(dgn.skorTerapi).toBe(tanpa.skorTerapi)
    expect(dgn.grade).toBe(tanpa.grade)
  })
})

describe('M11 item 7 — realita FKTP tetap terukur, aman, dan ringkas', () => {
  const catatan = Object.entries(PACK.kasus).flatMap(([id, kasus]) =>
    kasus.catatanRealita ? [[id, kasus.catatanRealita] as const] : [],
  )

  it('mencakup 14 catatan lama yang diaudit ulang dan 5 gap prioritas baru', () => {
    expect(catatan.length).toBeGreaterThanOrEqual(19)
    expect(catatan.map(([id]) => id)).toEqual(expect.arrayContaining([
      'demam_tifoid',
      'konjungtivitis_bakterial',
      'hipertensi_esensial',
      'otitis_media_akut',
      'hemoroid_grade1',
      'kulit_pioderma_impetigo',
      'kulit_herpes_zoster',
      'kulit_varisela',
      'kulit_kandidiasis_kutis',
      'mm_gout_artritis_akut',
      'mm_dislipidemia',
      'kia_abortus_iminens',
      'jiwa_depresi_ringan',
      'kia_malaria_falsiparum',
      'dengue_df',
      'dm_tipe2',
      'asma_ringan',
      'kia_anc_kehamilan_normal',
      'stroke_iskemik',
    ]))

    expect(PACK.kasus.dengue_df?.catatanRealita).toMatch(/serial.*(hematokrit|trombosit)/i)
    expect(PACK.kasus.dm_tipe2?.catatanRealita).toMatch(/HbA1c.*jejaring/i)
    expect(PACK.kasus.asma_ringan?.catatanRealita).toMatch(/ICS|controller/i)
    expect(PACK.kasus.kia_anc_kehamilan_normal?.catatanRealita).toMatch(/PMK 6\/2024.*USG/i)
    expect(PACK.kasus.stroke_iskemik?.catatanRealita).toMatch(/SISRUTE.*paralel/i)
  })

  it('setiap catatan muat sebagai debrief singkat, bukan kuliah tambahan', () => {
    for (const [id, teks] of catatan) {
      expect(teks, id).toBe(teks.trim())
      expect(teks.length, id).toBeGreaterThan(0)
      expect(teks.length, id).toBeLessThanOrEqual(420)
    }
  })

  it('tidak menormalkan tebakan, substitusi improvisasi, atau klaim stok absolut', () => {
    const seluruhTeks = catatan.map(([, teks]) => teks).join('\n')

    expect(seluruhTeks).not.toMatch(/hampir selalu ada/i)
    expect(seluruhTeks).not.toMatch(/langsung antibiotik oral/i)
    expect(seluruhTeks).not.toMatch(/praktis tak tersedia di Indonesia/i)
    expect(seluruhTeks).not.toMatch(/hanya ~40%/i)
    expect(seluruhTeks).not.toMatch(/kriteria ['"]?bulging['"]?.*terkaan/i)
  })

  it('mengunci pagar keselamatan pada catatan berisiko tinggi', () => {
    expect(PACK.kasus.kulit_pioderma_impetigo?.catatanRealita).toMatch(/tidak boleh otomatis/i)
    expect(PACK.kasus.kulit_varisela?.catatanRealita).toMatch(/jangan memulai.*improvisasi/i)
    expect(PACK.kasus.hipertensi_esensial?.catatanRealita).toMatch(/jangan mengarang/i)
    expect(PACK.kasus.otitis_media_akut?.catatanRealita).toMatch(/jangan menebak/i)
    expect(PACK.kasus.hemoroid_grade1?.catatanRealita).toMatch(/tidak membenarkan.*otomatis/i)
    expect(PACK.kasus.kia_malaria_falsiparum?.catatanRealita).toMatch(/jangan terapi presumtif/i)
  })
})
