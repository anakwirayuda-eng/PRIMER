import { describe, expect, it } from 'vitest'
import { audit, collectEntries } from '../../scripts/audit-editorial'
import { PACK } from './index'

describe('mutu editorial lintas UKP, IGD, UKM, dan debrief', () => {
  const entries = collectEntries()
  const findings = audit(entries)

  it('mengaudit seluruh permukaan teks runtime yang disepakati', () => {
    expect(entries.length).toBeGreaterThan(9_000)
    expect(Object.keys(PACK.kasus)).toHaveLength(210)
    expect(Object.keys(PACK.kasusIgd)).toHaveLength(20)
    expect(Object.keys(PACK.keluarga)).toHaveLength(16)
  })

  it('tidak meloloskan cacat editorial berisiko tinggi', () => {
    expect(findings.filter((finding) => finding.severity === 'tinggi')).toEqual([])
  })

  it('tidak meloloskan cacat struktur selain penekanan kapital yang masih advisory', () => {
    expect(findings.filter((finding) => finding.severity === 'sedang' && finding.rule !== 'kapital_berlebihan')).toEqual([])
  })

  it('setiap kasus poli memiliki pembuka dan pertanyaan awal yang dapat dijawab', () => {
    const masalah = Object.values(PACK.kasus).flatMap((kasus) => {
      const pembuka = kasus.anamnesis.filter((question) => question.kategori === 'keluhan_utama')
      if (!kasus.keluhanUtama.trim()) return [`${kasus.id}: keluhanUtama kosong`]
      if (pembuka.length === 0) return [`${kasus.id}: pertanyaan pembuka tidak ada`]
      if (pembuka.every((question) => !question.jawab.trim())) return [`${kasus.id}: semua jawaban pembuka kosong`]
      return []
    })
    expect(masalah).toEqual([])
  })
})
