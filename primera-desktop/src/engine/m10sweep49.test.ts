/**
 * TEST — fix batch M10 §49 (2026-07-10, dossier §49/§50). Menguji SEMANTIK yang
 * diubah, bukan cuma konten (konten dijaga pack.test.ts). Fokus: obatOpsional,
 * KLB pola-kontak, sensitivitas sidik jari pack, surat lab bernama.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buatEncounter, nilaiEncounter } from './clinic'
import { sidikJariPack } from './verifikasi'
import { kartuKlb } from './kegiatan'
import { buatPasienDariKasus } from './director'
import { Rng } from './core/rng'
import type { EncounterState } from './state'

/* ---------------------------------------------------------------------------
 * obatOpsional — hordeolum: terapi konservatif (tanpa antibiotik) TIDAK di-nol
 * ------------------------------------------------------------------------- */

function encFor(kasusId: string, resep: string[], tindakan: string[] = []): EncounterState {
  const pasien = buatPasienDariKasus(kasusId, PACK, new Rng(1, 'test', kasusId))
  const enc = buatEncounter(pasien)
  return { ...enc, resep, tindakan }
}

describe('M10 §49 — obatOpsional (hordeolum)', () => {
  const hordeolum = PACK.kasus['mata_hordeolum']!

  it('kloramfenikol pindah ke obatOpsional (bukan obatBenar wajib)', () => {
    expect(hordeolum.tatalaksana.obatBenar).not.toContain('kloramfenikol_tetes_mata')
    expect(hordeolum.tatalaksana.obatOpsional).toContain('kloramfenikol_tetes_mata')
  })

  it('terapi konservatif tidak dihukum, tetapi dimensi obat/prosedur ditandai N/A', () => {
    // Dulu obatBenar=[kloramfenikol], totalSlot=1, tak meresepkan → rasioTerapi 0.
    const hasil = nilaiEncounter(encFor('mata_hordeolum', []), hordeolum, PACK)
    expect(hasil.skorTerapi).toBe(100)
    expect(hasil.terapiDinilai).toBe(false)
  })

  it('meresepkan antibiotik opsional → TIDAK dihukum (bukan obat-di-luar, bukan antibiotik-tanpa-indikasi)', () => {
    const hasil = nilaiEncounter(encFor('mata_hordeolum', ['kloramfenikol_tetes_mata']), hordeolum, PACK)
    expect(hasil.skorTerapi).toBe(100)
    expect(hasil.terapiDinilai).toBe(false)
    expect(hasil.antibiotikTanpaIndikasi).toBe(false)
  })

  it('obat DI LUAR opsional/benar tetap dihukum', () => {
    const hasil = nilaiEncounter(encFor('mata_hordeolum', ['paracetamol_500']), hordeolum, PACK)
    expect(hasil.skorTerapi).toBeLessThan(100)
  })
})

describe('M10 §49 Batch-1 (CODEX C.3/C.11) — konten', () => {
  it('C.3 tinea: mikonazol jadi alternatif sah topikal (bukan obat-di-luar −15)', () => {
    const tinea = PACK.kasus['kulit_tinea_korporis']!
    const grup = tinea.tatalaksana.obatAlternatif ?? []
    const adaGrupTopikal = grup.some((g) => g.includes('ketokonazol_krim') && g.includes('mikonazol_krim'))
    expect(adaGrupTopikal).toBe(true)
    // Meresepkan mikonazol (yg clue sahkan) tak dihukum sbg obat-di-luar.
    const dgnMikonazol = nilaiEncounter(encFor('kulit_tinea_korporis', ['mikonazol_krim', 'griseofulvin_500']), tinea, PACK)
    const dgnKetokonazol = nilaiEncounter(encFor('kulit_tinea_korporis', ['ketokonazol_krim', 'griseofulvin_500']), tinea, PACK)
    expect(dgnMikonazol.skorTerapi).toBe(dgnKetokonazol.skorTerapi)
    expect(dgnMikonazol.skorTerapi).toBe(100)
  })

  it('C.11 gout: PF tak lagi kontradiktif "serangan pertama" (anamnesis sebut serangan lalu)', () => {
    const gout = PACK.kasus['mm_gout_artritis_akut']!
    const pfKulit = gout.pemeriksaanFisik.find((p) => p.region === 'kulit')!
    expect(pfKulit.temuan).not.toMatch(/serangan pertama/i)
  })
})

describe('M10 §49 — apendisitis prosedur pasang_infus', () => {
  const apx = PACK.kasus['apendisitis_akut']!
  it('pasang_infus jadi prosedur benar (clue anjurkan jalur IV)', () => {
    expect(apx.tatalaksana.prosedur).toContain('pasang_infus')
  })
  it('memasang infus TIDAK dihukum sbg tindakan-di-luar', () => {
    const tanpa = nilaiEncounter(encFor('apendisitis_akut', ['paracetamol_500']), apx, PACK)
    const dengan = nilaiEncounter(encFor('apendisitis_akut', ['paracetamol_500'], ['pasang_infus']), apx, PACK)
    // Memasang infus (yg clue-nya sendiri wajibkan) tak boleh menurunkan skor.
    expect(dengan.skorTerapi).toBeGreaterThanOrEqual(tanpa.skorTerapi)
  })
})

/* ---------------------------------------------------------------------------
 * KLB pola-kontak — skabies/konjungtivitis: jawaban benar bukan droplet
 * ------------------------------------------------------------------------- */

describe('M10 §49 — KLB pola kontak', () => {
  it('skabies: aksi pengendalian benar = obati kontak serumah + dekontaminasi (bukan masker/etika batuk)', () => {
    const kartu = kartuKlb('skabies', 'Skabies', 'RW 3', new Rng(1, 'test'))
    const aksi = kartu.find((k) => k.id === 'klb_aksi')!
    const benar = aksi.pilihan.find((p) => p.benar)!
    expect(benar.label.toLowerCase()).toMatch(/kontak serumah|dekontaminasi/)
    expect(benar.label.toLowerCase()).not.toMatch(/etika batuk|masker/)
  })

  it('konjungtivitis_bakterial: sama — pola kontak, bukan droplet', () => {
    const kartu = kartuKlb('konjungtivitis_bakterial', 'Konjungtivitis', 'RW 2', new Rng(1, 'test'))
    const benar = kartu.find((k) => k.id === 'klb_aksi')!.pilihan.find((p) => p.benar)!
    expect(benar.label.toLowerCase()).not.toMatch(/etika batuk|masker/)
  })

  it('ISPA tetap droplet (regresi guard): masker/etika batuk masih benar', () => {
    const kartu = kartuKlb('ispa_common_cold', 'ISPA', 'RW 1', new Rng(1, 'test'))
    const benar = kartu.find((k) => k.id === 'klb_aksi')!.pilihan.find((p) => p.benar)!
    expect(benar.label.toLowerCase()).toMatch(/etika batuk|masker/)
  })
})

/**
 * M11 UKM Decision #5 B2 (2026-07-17): pool narasi klb_verif/klb_5w1h —
 * pilihan/benar/respons (score-affecting) HARUS identik lintas seed;
 * hanya narasi pembuka yang boleh berotasi.
 */
describe('kartuKlb — rotasi naratif B2 (pilihan/skor tak berubah lintas seed)', () => {
  it('pilihan identik lintas seed utk klb_verif & klb_5w1h', () => {
    const kartuSeed = Array.from({ length: 8 }, (_, seed) => kartuKlb('ispa_common_cold', 'ISPA', 'RW 1', new Rng(seed, 'uji-klb')))
    const acuanVerif = kartuSeed[0]!.find((k) => k.id === 'klb_verif')!.pilihan
    const acuan5w1h = kartuSeed[0]!.find((k) => k.id === 'klb_5w1h')!.pilihan
    for (const kartu of kartuSeed) {
      expect(kartu.find((k) => k.id === 'klb_verif')!.pilihan).toEqual(acuanVerif)
      expect(kartu.find((k) => k.id === 'klb_5w1h')!.pilihan).toEqual(acuan5w1h)
    }
  })

  it('narasi klb_verif & klb_5w1h berotasi lintas seed (bukan konstan)', () => {
    const narasiVerif = new Set(
      Array.from({ length: 12 }, (_, seed) => kartuKlb('ispa_common_cold', 'ISPA', 'RW 1', new Rng(seed, 'uji-klb')).find((k) => k.id === 'klb_verif')!.narasi),
    )
    const narasi5w1h = new Set(
      Array.from({ length: 12 }, (_, seed) => kartuKlb('ispa_common_cold', 'ISPA', 'RW 1', new Rng(seed, 'uji-klb')).find((k) => k.id === 'klb_5w1h')!.narasi),
    )
    expect(narasiVerif.size).toBeGreaterThan(1)
    expect(narasi5w1h.size).toBeGreaterThan(1)
  })

  it('deterministik utk seed sama', () => {
    const a = kartuKlb('ispa_common_cold', 'ISPA', 'RW 1', new Rng(5, 'uji-klb'))
    const b = kartuKlb('ispa_common_cold', 'ISPA', 'RW 1', new Rng(5, 'uji-klb'))
    expect(a.find((k) => k.id === 'klb_verif')!.narasi).toBe(b.find((k) => k.id === 'klb_verif')!.narasi)
  })

  it('klb_aksi (sudah bervariasi via pola) tak tersentuh mekanisme rotasi baru', () => {
    const kartuSeed = Array.from({ length: 6 }, (_, seed) => kartuKlb('ispa_common_cold', 'ISPA', 'RW 1', new Rng(seed, 'uji-klb')))
    const acuan = kartuSeed[0]!.find((k) => k.id === 'klb_aksi')!
    for (const kartu of kartuSeed) {
      expect(kartu.find((k) => k.id === 'klb_aksi')!).toEqual(acuan)
    }
  })
})

/* ---------------------------------------------------------------------------
 * sidikJariPack — 6 field kasus + anggota keluarga kini menggeser hash
 * ------------------------------------------------------------------------- */

describe('M10 §49 — sidik jari pack sensitif thd field yang dibaca replay', () => {
  const asli = sidikJariPack(PACK)

  function packDgnKasusDiubah(ubah: (k: any) => void) {
    const kasusKlon: Record<string, any> = {}
    for (const [id, k] of Object.entries(PACK.kasus)) kasusKlon[id] = { ...k }
    const target = Object.keys(kasusKlon)[0]!
    ubah(kasusKlon[target])
    return { ...PACK, kasus: kasusKlon }
  }

  it('ubah prevalensi salah satu kasus → sidik jari BERUBAH', () => {
    const pack2 = packDgnKasusDiubah((k) => {
      k.prevalensi = k.prevalensi === 'tinggi' ? 'rendah' : 'tinggi'
    })
    expect(sidikJariPack(pack2 as never)).not.toBe(asli)
  })

  it('ubah demografi.usiaMin → sidik jari BERUBAH', () => {
    const pack2 = packDgnKasusDiubah((k) => {
      k.demografi = { ...k.demografi, usiaMin: k.demografi.usiaMin + 1 }
    })
    expect(sidikJariPack(pack2 as never)).not.toBe(asli)
  })

  it('ubah spesialisRujukan → sidik jari BERUBAH', () => {
    const pack2 = packDgnKasusDiubah((k) => {
      k.spesialisRujukan = k.spesialisRujukan === 'bedah' ? 'penyakit_dalam' : 'bedah'
    })
    expect(sidikJariPack(pack2 as never)).not.toBe(asli)
  })

  it('ubah nama anggota keluarga → sidik jari BERUBAH (§48#1)', () => {
    const kelKlon: Record<string, any> = {}
    for (const [id, k] of Object.entries(PACK.keluarga)) kelKlon[id] = { ...k, anggota: k.anggota.map((a) => ({ ...a })) }
    const target = Object.keys(kelKlon)[0]!
    kelKlon[target].anggota[0].nama = kelKlon[target].anggota[0].nama + ' (ubah)'
    expect(sidikJariPack({ ...PACK, keluarga: kelKlon } as never)).not.toBe(asli)
  })
})
