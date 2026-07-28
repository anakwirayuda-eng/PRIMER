/**
 * TEST — M10 Batch-3 (keputusan medis Dr. Wirayuda, dossier §54, docs/
 * M10_BATCH3_MEDIS.md). Riset EBM+Indonesia → fix konten. Menguji: ICD K35.9,
 * sediaan salisilat veruka, zinc disentri dewasa, skrining hamil malaria
 * (hanyaUntuk), tinea topikal-saja, impetigo mupirosin, wording HT urgensi.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buatEncounter, nilaiEncounter } from './clinic'
import { buatPasienDariKasus } from './director'
import { Rng } from './core/rng'
import type { EncounterState } from './state'

function encFor(kasusId: string, resep: string[]): EncounterState {
  const pasien = buatPasienDariKasus(kasusId, PACK, new Rng(7, 'b3', kasusId))
  return { ...buatEncounter(pasien), resep }
}

describe('M10 Batch-3 C.10 — apendisitis ICD WHO (K35.9, bukan K35.80 CM)', () => {
  // M10.5 veto-table §3b keputusan 2B (2026-07-12): K35.8→K35.9 — "unspecified"
  // lebih tepat utk dx presumtif-klinis FKTP tanpa temuan operatif spesifik.
  const apx = PACK.kasus['apendisitis_akut']!
  it('icd10 = K35.9 (WHO ICD-10 2016, unspecified)', () => {
    expect(apx.icd10).toBe('K35.9')
  })
  it('tak ada sisa K35.8/K35.80 di diagnosisBanding', () => {
    expect(apx.diagnosisBanding).toContain('K35.9')
    expect(apx.diagnosisBanding).not.toContain('K35.8')
    expect(apx.diagnosisBanding).not.toContain('K35.80')
  })
})

describe('M10 Batch-3 C.11 — sediaan veruka + zinc disentri', () => {
  it('C.11c: veruka pakai asam_salisilat_kolodion (bukan bedak)', () => {
    expect(PACK.kasus['kulit_veruka_vulgaris']!.tatalaksana.obatBenar).toContain('asam_salisilat_kolodion')
    expect(PACK.obat['asam_salisilat_kolodion']).toBeDefined()
    expect(PACK.obat['asam_salisilat_bedak']).toBeUndefined() // orphan dihapus
  })
  it('C.11a: disentri (dewasa) — zinc TAK wajib (obatBenar) tapi opsional (tak dihukum)', () => {
    const dis = PACK.kasus['disentri_basiler']!
    expect(dis.demografi.usiaMin).toBeGreaterThanOrEqual(15) // dewasa
    expect(dis.tatalaksana.obatBenar).not.toContain('zinc_20')
    expect(dis.tatalaksana.obatBenar).toContain('ciprofloxacin_500')
    expect(dis.tatalaksana.obatOpsional).toContain('zinc_20')
    // Antibiotik (b) tetap benar; meresepkan zinc tak menurunkan skor.
    const tanpaZinc = nilaiEncounter(encFor('disentri_basiler', ['ciprofloxacin_500', 'oralit']), dis, PACK)
    const denganZinc = nilaiEncounter(encFor('disentri_basiler', ['ciprofloxacin_500', 'oralit', 'zinc_20']), dis, PACK)
    expect(denganZinc.skorTerapi).toBe(tanpaZinc.skorTerapi)
  })
})

describe('M10 Batch-3 C.4 — skrining kehamilan malaria (hanyaUntuk P)', () => {
  const mal = PACK.kasus['kia_malaria_falsiparum']!
  it('q_kehamilan bertanda esensial + hanyaUntuk P', () => {
    const q = mal.anamnesis.find((a) => a.id === 'q_kehamilan')!
    expect(q.esensial).toBe(true)
    expect(q.hanyaUntuk).toBe('P')
  })
  it('pasien LAKI-LAKI: skor anamnesis penuh tanpa q_kehamilan (keluar dari denominator)', () => {
    const esensialUmum = mal.anamnesis.filter((a) => a.esensial && !a.hanyaUntuk).map((a) => a.id)
    const pasienL = { ...buatPasienDariKasus('kia_malaria_falsiparum', PACK, new Rng(1, 'x')), jenisKelamin: 'L' as const }
    const enc = { ...buatEncounter(pasienL), ditanya: esensialUmum }
    expect(nilaiEncounter(enc, mal, PACK).skorAnamnesis).toBe(100)
  })
  it('clue menyebut kontraindikasi kehamilan primakuin', () => {
    expect(mal.clue).toMatch(/SINGKIRKAN KEHAMILAN|KONTRAINDIKASI pada hamil/i)
  })
})

describe('M10 Batch-3 C.2 — tinea topikal-saja + impetigo mupirosin', () => {
  it('tinea: topikal-saja (griseofulvin oral opsional) = skorTerapi penuh', () => {
    const tinea = PACK.kasus['kulit_tinea_korporis']!
    expect(tinea.tatalaksana.obatBenar).toEqual([])
    expect(tinea.tatalaksana.obatOpsional).toContain('griseofulvin_500')
    const topikalSaja = nilaiEncounter(encFor('kulit_tinea_korporis', ['ketokonazol_krim']), tinea, PACK)
    expect(topikalSaja.skorTerapi).toBe(100)
    // Menambah oral (opsional) tak menurunkan skor.
    const dgnOral = nilaiEncounter(encFor('kulit_tinea_korporis', ['ketokonazol_krim', 'griseofulvin_500']), tinea, PACK)
    expect(dgnOral.skorTerapi).toBe(100)
  })
  it('impetigo lokal: mupirosin topikal cukup dan antibiotik oral tidak digratiskan', () => {
    const imp = PACK.kasus['kulit_pioderma_impetigo']!
    expect(imp.tatalaksana.obatBenar).toContain('mupirosin_krim')
    expect(imp.tatalaksana.obatBenar).not.toContain('gentamisin_krim')
    expect(imp.tatalaksana.obatOpsional ?? []).not.toContain('cefadroxil_500')
    expect(imp.clue).toMatch(/lesi terlokalisir.*topikal/is)
    expect(imp.clue).toMatch(/lesi luas.*oral.*berat badan/is)
    expect(PACK.obat['mupirosin_krim']).toBeDefined()
    const topikalSaja = nilaiEncounter(encFor('kulit_pioderma_impetigo', ['mupirosin_krim']), imp, PACK)
    expect(topikalSaja.skorTerapi).toBe(100)
  })
})

describe('M10 Batch-3 C.5 — clue HT urgensi tak lagi ajarkan target emergensi', () => {
  const ht = PACK.kasus['mm_hipertensi_urgensi']!
  it('clue tak lagi menyuruh "25% dalam jam pertama" sbg target URGENSI', () => {
    // Boleh menyebut 25% sbg target EMERGENSI (kontras), tapi urgensi = bertahap.
    expect(ht.clue).toMatch(/PERLAHAN|24[–-]48 jam/i)
    expect(ht.clue).toMatch(/target EMERGENSI, BUKAN urgensi|target EMERGENSI/i)
  })
})
