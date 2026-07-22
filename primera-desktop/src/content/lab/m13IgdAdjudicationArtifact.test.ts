import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { PACK } from '..'
import { buildIgdAdjudicationDataset } from '../../../scripts/m13-adjudication/igd-data'

const ROOT = process.cwd()
const DATA = buildIgdAdjudicationDataset('2026-07-22T00:00:00.000Z')

describe('M13-14 IGD adjudication artifact', () => {
  it('mencakup tepat seluruh kasus IGD yang sudah diadjudikasi dokter', () => {
    const runtimeIds = Object.values(PACK.kasusIgd)
      .filter((item) => item.reviewStatus === 'physician_approved')
      .map((item) => item.id)
      .sort()
    expect(runtimeIds).toHaveLength(14)
    expect(DATA.cases.map((item) => item.id).sort()).toEqual(runtimeIds)
    expect(new Set(DATA.cases.map((item) => item.id)).size).toBe(14)
  })

  it('menyalin algoritma, debrief, disposisi, dan sumber dari runtime final', () => {
    for (const compiled of DATA.cases) {
      const runtime = PACK.kasusIgd[compiled.id]!
      expect(compiled.steps).toHaveLength(runtime.langkah.length)
      expect(compiled.steps.flatMap((step) => step.choices)).toHaveLength(runtime.langkah.flatMap((step) => step.pilihan).length)
      expect(compiled.correctDisposition).toBe(runtime.disposisiBenar)
      expect(compiled.sources.map((source) => source.id)).toEqual(runtime.sumber.map((source) => source.id))
      expect(compiled.reviewStatus).toBe('physician_approved')
      expect(compiled.debrief.keyPoints).toEqual(runtime.debrief?.poinKunci)
      expect(compiled.debrief.fktpReality).toBe(runtime.debrief?.realitaFktp)
      expect(compiled.debrief.continuity).toBe(runtime.debrief?.kontinuitas)
    }
  })

  it('mengunci invariant struktur pilihan IGD', () => {
    for (const item of DATA.cases) {
      expect(item.compiler.structuralChecksPassed, `${item.id}: ${item.compiler.warnings.join(' ')}`).toBe(true)
      for (const step of item.steps) {
        expect(step.choices.filter((choice) => choice.correct), `${item.id}:${step.id}`).toHaveLength(1)
        expect(step.choices.find((choice) => choice.correct)?.stabilityEffect, `${item.id}:${step.id}`).toBeGreaterThan(0)
        expect(step.choices.filter((choice) => !choice.correct).every((choice) => choice.stabilityEffect < 0), `${item.id}:${step.id}`).toBe(true)
      }
    }
  })

  it('artefak checked-in cocok dengan fingerprint dan menyediakan re-audit opsional', () => {
    const checkedIn = JSON.parse(readFileSync(resolve(ROOT, 'docs/M13_14_IGD_ADJUDICATION_DATA.json'), 'utf8')) as typeof DATA
    const html = readFileSync(resolve(ROOT, 'docs/M13_14_IGD_ADJUDICATION.html'), 'utf8')
    expect(checkedIn.artifactFingerprint).toBe(DATA.artifactFingerprint)
    expect(checkedIn.cases.map((item) => item.id)).toEqual(DATA.cases.map((item) => item.id))
    expect(html).toContain(DATA.artifactFingerprint)
    expect(html).toContain('primera.m13-14-igd-review.')
    expect(html).toContain('14/14 keputusan dokter telah diterapkan')
    expect(html).toContain('DISETUJUI - KARIER')
    for (const label of ['Setuju', 'Perlu edit', 'Tolak', 'Nanti']) expect(html).toContain(label)
  })
})
