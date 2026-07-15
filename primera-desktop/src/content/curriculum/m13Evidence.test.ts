import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CURRICULUM_BLUEPRINT, PACK } from '../index'
import {
  M13_DELTA_AUDITS,
  M13_REQUIRED_CLAIM_KINDS,
  M13_SOURCE_REGISTRY,
  evaluasiM13EvidenceGate,
  validasiM13EvidenceAudit,
} from '.'

const M13_0B_DELTA_IDS = new Set(M13_DELTA_AUDITS.map((audit) => audit.id))
const M13_0B_BLUEPRINT = {
  ...CURRICULUM_BLUEPRINT,
  evidenceBindings: CURRICULUM_BLUEPRINT.evidenceBindings.filter(
    (binding) => !binding.audit || M13_0B_DELTA_IDS.has(binding.audit.deltaId),
  ),
}

describe('M13-0B - source registry dan delta audit 2026', () => {
  it('registry dan empat audit lintas-facet lolos validator', () => {
    expect(
      validasiM13EvidenceAudit(
        M13_0B_BLUEPRINT,
        PACK,
        M13_SOURCE_REGISTRY,
        M13_DELTA_AUDITS,
      ),
    ).toEqual([])
    expect(M13_SOURCE_REGISTRY).toHaveLength(8)
    expect(M13_DELTA_AUDITS.map((audit) => audit.caseId).sort()).toEqual([
      'dm_tipe2',
      'hipertensi_esensial',
      'saraf_epilepsi_kejang',
      'stroke_iskemik',
    ])
  })

  it('setiap kasus menutup tepat delapan claim kind tanpa duplikat', () => {
    for (const audit of M13_DELTA_AUDITS) {
      expect(audit.claims.map((claim) => claim.claimKind).sort(), audit.id).toEqual(
        [...M13_REQUIRED_CLAIM_KINDS].sort(),
      )
    }
    const findings = M13_DELTA_AUDITS.flatMap((audit) => audit.claims).reduce<Record<string, number>>(
      (counts, claim) => ({ ...counts, [claim.finding]: (counts[claim.finding] ?? 0) + 1 }),
      {},
    )
    const materiality = M13_DELTA_AUDITS.flatMap((audit) => audit.claims).reduce<Record<string, number>>(
      (counts, claim) => ({ ...counts, [claim.materiality]: (counts[claim.materiality] ?? 0) + 1 }),
      {},
    )
    expect(findings).toEqual({ aligned: 13, coverage_gap: 7, source_conflict: 1, content_conflict: 11 })
    expect(materiality).toEqual({ none: 11, minor: 4, material: 17 })
  })

  it('setiap full-text lokal cocok ukuran dan SHA-256 registry', () => {
    for (const source of M13_SOURCE_REGISTRY) {
      const path = resolve(process.cwd(), source.localArtifact.path)
      const bytes = readFileSync(path)
      expect(statSync(path).size, source.id).toBe(source.localArtifact.bytes)
      expect(createHash('sha256').update(bytes).digest('hex').toUpperCase(), source.id).toBe(
        source.localArtifact.sha256,
      )
    }
  })

  it('adjudikasi formularium mengunci dua koreksi yang mudah terlewat oleh pencarian istilah', () => {
    const fornas = readFileSync(
      resolve(process.cwd(), 'docs/references/fornas1199/fornas1199_fulltext.txt'),
      'utf8',
    )
    const doen = readFileSync(
      resolve(process.cwd(), 'docs/references/doen2021/doen2021_fulltext.txt'),
      'utf8',
    )
    expect(fornas).toMatch(/glibenklamid\*/i)
    expect(fornas).toMatch(/enema 10 mg\/2,5 mL/i)
    expect(doen).toMatch(/glibenklamid\s+tab 2,5 mg/i)
    expect(M13_SOURCE_REGISTRY.find((source) => source.id === 'doen:kmk-6477-2021')).toEqual(
      expect.objectContaining({ lifecycleStatus: 'superseded' }),
    )

    const dm = M13_DELTA_AUDITS.find((audit) => audit.caseId === 'dm_tipe2')!
    const epilepsi = M13_DELTA_AUDITS.find((audit) => audit.caseId === 'saraf_epilepsi_kejang')!
    expect(dm.claims.find((claim) => claim.claimKind === 'formulary')).toEqual(
      expect.objectContaining({ finding: 'content_conflict', materiality: 'material' }),
    )
    expect(epilepsi.claims.find((claim) => claim.claimKind === 'formulary')).toEqual(
      expect.objectContaining({ finding: 'aligned', materiality: 'none' }),
    )
  })

  it('binding audit menggantikan placeholder dan mengikuti adjudikasi physician 4/4', () => {
    const auditedBindings = CURRICULUM_BLUEPRINT.evidenceBindings.filter(
      (binding) => binding.audit && M13_0B_DELTA_IDS.has(binding.audit.deltaId),
    )
    expect(auditedBindings).toHaveLength(32)
    const expectedStatus = {
      hipertensi_esensial: 'accepted_with_limitation',
      dm_tipe2: 'accepted_with_limitation',
      stroke_iskemik: 'resolved',
      saraf_epilepsi_kejang: 'resolved',
    } as const
    for (const audit of M13_DELTA_AUDITS) {
      const bindings = auditedBindings.filter((binding) => binding.audit?.deltaId === audit.id)
      expect(bindings, audit.id).toHaveLength(8)
      expect(audit.reviewStatus, audit.id).toBe(expectedStatus[audit.caseId as keyof typeof expectedStatus])
      expect(audit.physicianSignoff, audit.id).toEqual(
        expect.objectContaining({
          reviewer: 'dr. Anak Agung Bagus Wirayuda',
          credentials: 'Dokter; penanggung jawab klinis PRIMERA',
          signedAt: '2026-07-14',
        }),
      )
      expect(bindings.every((binding) => binding.reviewStatus === audit.reviewStatus), audit.id).toBe(true)
      expect(bindings.every((binding) => binding.audit?.physicianSignoff?.reviewer === audit.physicianSignoff?.reviewer), audit.id).toBe(true)
      expect(
        CURRICULUM_BLUEPRINT.evidenceBindings.some(
          (binding) =>
            binding.subject.kind === 'encounter_archetype' &&
            binding.subject.id === audit.archetypeId &&
            !binding.audit,
        ),
        audit.id,
      ).toBe(false)
    }
  })

  it('gate mengizinkan exit setelah seluruh blocker diadjudikasi dan sign-off tercatat', () => {
    expect(evaluasiM13EvidenceGate(M13_DELTA_AUDITS)).toEqual({
      ready: true,
      blockedDeltaIds: [],
      unsignedDeltaIds: [],
      nonTerminalDeltaIds: [],
    })
  })

  it('koreksi runtime empat kasus cocok dengan paket physician sign-off', () => {
    const ht = PACK.kasus.hipertensi_esensial!
    expect(ht.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'ht_red_flag', esensial: true }),
      expect.objectContaining({ id: 'ht_kehamilan', esensial: true, hanyaUntuk: 'P' }),
    ]))
    expect(ht.lab).toContainEqual(expect.objectContaining({ id: 'fungsi_ginjal', relevan: true }))
    expect(ht.harusDirujuk).toBe(false)

    const dm = PACK.kasus.dm_tipe2!
    expect(dm.anamnesis.find((item) => item.id === 'dm_bb')?.jawab).toMatch(/tidak turun bermakna/i)
    expect(dm.pemeriksaanFisik.find((item) => item.region === 'umum')?.temuan).toMatch(/tanpa tanda dehidrasi/i)
    expect(dm.lab).toContainEqual(expect.objectContaining({ id: 'fungsi_ginjal', relevan: true }))
    expect(dm.tatalaksana.edukasiKritis).toEqual(expect.arrayContaining(['kenali_hipoglikemia', 'kepatuhan_obat']))
    expect(dm.tatalaksana.obatSalahUmum).toContainEqual(expect.objectContaining({
      id: 'glibenclamide_5',
      bahaya: 'nonPrimer',
      alasan: expect.stringMatching(/tercantum di Fornas.*risiko hipoglikemia/i),
    }))

    const stroke = PACK.kasus.stroke_iskemik!
    expect(stroke).toEqual(expect.objectContaining({ nama: 'Suspek Stroke Akut', icd10: 'I64' }))
    expect(stroke.diagnosisBanding[0]).toBe('I64')
    expect(`${stroke.clue} ${stroke.panduanResmi}`).toMatch(/jangan memberi antiplatelet atau antikoagulan/i)
    expect(`${stroke.clue} ${stroke.catatanRealita}`).toMatch(/30 menit/i)

    const epilepsi = PACK.kasus.saraf_epilepsi_kejang!
    expect(epilepsi.demografi).toEqual(expect.objectContaining({ usiaMin: 18, usiaMax: 30 }))
    expect(epilepsi.anamnesis.find((item) => item.id === 'q_keluhan')?.jawab).not.toMatch(/menatap/i)
    expect(epilepsi.tatalaksana.obatBenar).toEqual([])
    expect(epilepsi.tatalaksana.obatSalahUmum).toContainEqual(expect.objectContaining({
      id: 'diazepam_rektal_10',
      bahaya: 'nonPrimer',
    }))
    expect(epilepsi.lab).toContainEqual(expect.objectContaining({ id: 'elektrolit_serum', relevan: true }))
    expect(PACK.obat.diazepam_rektal_10?.fornas).toBe(true)
  })

  it('validator menolak source yatim dan klaim selesai tanpa physician sign-off', () => {
    const registryTanpaFornas = M13_SOURCE_REGISTRY.filter(
      (source) => source.id !== 'fornas:kmk-1199-2025',
    )
    const tanpaSource = validasiM13EvidenceAudit(
      CURRICULUM_BLUEPRINT,
      PACK,
      registryTanpaFornas,
      M13_DELTA_AUDITS,
    )
    expect(tanpaSource.some((masalah) => masalah.includes("source yatim 'fornas:kmk-1199-2025'"))).toBe(true)

    const resolvedTanpaSignoff = M13_DELTA_AUDITS.map((audit, index) => {
      if (index !== 0) return audit
      const { physicianSignoff: _physicianSignoff, ...tanpaSignoff } = audit
      return { ...tanpaSignoff, reviewStatus: 'resolved' as const, blockers: [] }
    })
    const tanpaSignoff = validasiM13EvidenceAudit(
      CURRICULUM_BLUEPRINT,
      PACK,
      M13_SOURCE_REGISTRY,
      resolvedTanpaSignoff,
    )
    expect(tanpaSignoff.some((masalah) => masalah.includes('status resolved tanpa physician sign-off'))).toBe(true)

    const indexBinding = CURRICULUM_BLUEPRINT.evidenceBindings.findIndex((binding) => binding.audit)
    const bindingRusak = [...CURRICULUM_BLUEPRINT.evidenceBindings]
    bindingRusak[indexBinding] = {
      ...bindingRusak[indexBinding]!,
      audit: { ...bindingRusak[indexBinding]!.audit!, claim: 'klaim drift' },
    }
    const payloadDrift = validasiM13EvidenceAudit(
      { ...CURRICULUM_BLUEPRINT, evidenceBindings: bindingRusak },
      PACK,
      M13_SOURCE_REGISTRY,
      M13_DELTA_AUDITS,
    )
    expect(payloadDrift.some((masalah) => masalah.includes('payload audit drift dari delta'))).toBe(true)
  })
})
