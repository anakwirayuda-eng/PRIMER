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

  it('terapi konservatif (tanpa obat apa pun) → skorTerapi PENUH, bukan 0', () => {
    // Dulu obatBenar=[kloramfenikol], totalSlot=1, tak meresepkan → rasioTerapi 0.
    const hasil = nilaiEncounter(encFor('mata_hordeolum', []), hordeolum, PACK)
    expect(hasil.skorTerapi).toBe(100)
  })

  it('meresepkan antibiotik opsional → TIDAK dihukum (bukan obat-di-luar, bukan antibiotik-tanpa-indikasi)', () => {
    const hasil = nilaiEncounter(encFor('mata_hordeolum', ['kloramfenikol_tetes_mata']), hordeolum, PACK)
    expect(hasil.skorTerapi).toBe(100)
    expect(hasil.antibiotikTanpaIndikasi).toBe(false)
  })

  it('obat DI LUAR opsional/benar tetap dihukum', () => {
    const hasil = nilaiEncounter(encFor('mata_hordeolum', ['paracetamol_500']), hordeolum, PACK)
    expect(hasil.skorTerapi).toBeLessThan(100)
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
    const kartu = kartuKlb('skabies', 'Skabies', 'RW 3')
    const aksi = kartu.find((k) => k.id === 'klb_aksi')!
    const benar = aksi.pilihan.find((p) => p.benar)!
    expect(benar.label.toLowerCase()).toMatch(/kontak serumah|dekontaminasi/)
    expect(benar.label.toLowerCase()).not.toMatch(/etika batuk|masker/)
  })

  it('konjungtivitis_bakterial: sama — pola kontak, bukan droplet', () => {
    const kartu = kartuKlb('konjungtivitis_bakterial', 'Konjungtivitis', 'RW 2')
    const benar = kartu.find((k) => k.id === 'klb_aksi')!.pilihan.find((p) => p.benar)!
    expect(benar.label.toLowerCase()).not.toMatch(/etika batuk|masker/)
  })

  it('ISPA tetap droplet (regresi guard): masker/etika batuk masih benar', () => {
    const kartu = kartuKlb('ispa_common_cold', 'ISPA', 'RW 1')
    const benar = kartu.find((k) => k.id === 'klb_aksi')!.pilihan.find((p) => p.benar)!
    expect(benar.label.toLowerCase()).toMatch(/etika batuk|masker/)
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
