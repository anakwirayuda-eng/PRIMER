/**
 * Gerbang fail-fast konten (CODEX P2): PACK produksi wajib lolos validasiPack
 * di CI terlepas dari mode DEV — men-throw di runtime saja tak cukup bila
 * tak ada yang menjalankan game dalam mode dev sebelum rilis.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from './index'
import { validasiPack } from './pack'
import { NAMA_ICD } from './icd10'

describe('PACK — validasi silang id konten', () => {
  it('tidak punya masalah drift (obat/lab/edukasi/tindakan/RS/karma/IGD)', () => {
    expect(validasiPack(PACK)).toEqual([])
  })

  it('SEMUA kode diagnosisBanding punya nama (temuan playtest: "Kode M06.9" telanjang)', () => {
    // Berlapis persis seperti util.namaDiagnosis: kasus playable → skdi144 → kamus icd10.ts.
    const bisaResolve = new Set<string>([
      ...Object.values(PACK.kasus).map((k) => k.icd10),
      ...PACK.skdi144.map((e) => e.icd10),
      ...Object.keys(NAMA_ICD),
    ])
    const telanjang: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      for (const kode of k.diagnosisBanding) {
        if (!bisaResolve.has(kode)) telanjang.push(`${k.id}: ${kode}`)
      }
    }
    expect(telanjang).toEqual([])
  })

  it('kasus ber-alergiTrap WAJIB punya pertanyaan alergi yang bisa ditemukan pemain (CODEX P1)', () => {
    // UI membuka riwayat alergi hanya bila ada pertanyaan ber-teks "alergi" yang
    // ditanyakan — trap tanpa jalan bertanya = hukuman untuk informasi tersembunyi.
    const tanpaJalan = Object.values(PACK.kasus)
      .filter((k) => k.alergiTrap !== undefined)
      .filter((k) => !k.anamnesis.some((q) => q.tanya.toLowerCase().includes('alergi')))
      .map((k) => k.id)
    expect(tanpaJalan).toEqual([])
  })

  // Konkordansi ICD-10 (audit 2026-07-04): entri SKDI-144 yang MENAUTKAN kasus
  // (kasusId) harus memakai icd10 yang SAMA dengan kasusnya — kecuali beberapa
  // yang SENGAJA memakai kode kompetensi generik (parent/unspecified) sementara
  // kasusnya lebih spesifik. Allowlist di bawah = keputusan sadar; entri baru
  // yang mismatch (mis. kode SIBLING beda penyakit seperti otitis H65.0 vs
  // H66.0 yang sudah diperbaiki) akan GAGAL agar ditinjau.
  it('skdi144.kasusId ↔ icd10 cocok dgn kasus (kecuali kode kompetensi generik)', () => {
    const GENERIK_SENGAJA = new Set(['conjunctivitis_bacterial', 'tb_pulmonary', 'dm_type2'])
    const mismatch = PACK.skdi144
      .filter((e): e is typeof e & { kasusId: string } => e.kasusId !== undefined)
      .filter((e) => !GENERIK_SENGAJA.has(e.id))
      .filter((e) => {
        const k = PACK.kasus[e.kasusId]
        return k !== undefined && k.icd10 !== e.icd10
      })
      .map((e) => `${e.id}: ${e.icd10} ≠ kasus ${PACK.kasus[e.kasusId]!.icd10}`)
    expect(mismatch).toEqual([])
  })
})
