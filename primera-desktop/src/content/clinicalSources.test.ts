import { describe, expect, it } from 'vitest'
import { PACK } from './index'
import { CLINICAL_SOURCE_ASSIGNMENTS } from './clinicalSourceAssignments.generated'
import { sidikJariPack } from '../engine/verifikasi'

const kasus = Object.values(PACK.kasus)
const DOMAIN_DIBLOKIR_DI_BROWSER_PEMAIN = new Set(['www.nice.org.uk'])

describe('clinical provenance', () => {
  it('covers every playable poli encounter with an explicit assignment', () => {
    expect(kasus).toHaveLength(210)
    expect(Object.keys(CLINICAL_SOURCE_ASSIGNMENTS).sort()).toEqual(
      kasus.map((item) => item.id).sort(),
    )
  })

  it('gives every encounter a concise Indonesia plus international evidence set', () => {
    const masalah: string[] = []

    for (const item of kasus) {
      const sumber = item.sumber ?? []
      if (sumber.length < 2 || sumber.length > 10) {
        masalah.push(`${item.id}: ${sumber.length} sumber`)
      }
      if (!sumber.some((source) => source.jenis === 'pedoman_indonesia')) {
        masalah.push(`${item.id}: tanpa sumber Indonesia`)
      }
      if (!sumber.some((source) => source.jenis === 'evidence_internasional')) {
        masalah.push(`${item.id}: tanpa evidence internasional`)
      }
    }

    expect(masalah).toEqual([])
  })

  it('keeps every displayed citation identifiable, safe, and honestly scoped', () => {
    const masalah: string[] = []

    for (const item of kasus) {
      const sumber = item.sumber ?? []
      const ids = new Set<string>()
      const urls = new Set<string>()

      for (const source of sumber) {
        if (ids.has(source.id)) masalah.push(`${item.id}: id duplikat ${source.id}`)
        if (urls.has(source.url)) masalah.push(`${item.id}: URL duplikat ${source.url}`)
        ids.add(source.id)
        urls.add(source.url)

        if (!source.label.trim()) masalah.push(`${item.id}: label kosong ${source.id}`)
        if (!/^https:\/\//.test(source.url)) masalah.push(`${item.id}: URL tidak aman ${source.id}`)
        if (!Number.isInteger(source.tahun) || source.tahun < 1900 || source.tahun > 2100) {
          masalah.push(`${item.id}: tahun tidak valid ${source.id}`)
        }
        if (!source.cakupan) masalah.push(`${item.id}: cakupan kosong ${source.id}`)
        if (source.cakupan === 'floor_umum' && !source.catatan?.trim()) {
          masalah.push(`${item.id}: floor umum tanpa catatan ${source.id}`)
        }
      }
    }

    expect(masalah).toEqual([])
  })

  it('does not ship player-facing citations from browser-blocked domains', () => {
    const masalah: string[] = []
    const encounters = [
      ...Object.values(PACK.kasus).map((item) => ({
        id: `poli:${item.id}`,
        sumber: item.sumber ?? [],
      })),
      ...Object.values(PACK.kasusIgd).map((item) => ({
        id: `igd:${item.id}`,
        sumber: item.sumber,
      })),
    ]

    for (const encounter of encounters) {
      for (const source of encounter.sumber) {
        const domain = new URL(source.url).hostname.toLowerCase()
        if (DOMAIN_DIBLOKIR_DI_BROWSER_PEMAIN.has(domain)) {
          masalah.push(`${encounter.id}: ${source.id} -> ${domain}`)
        }
      }
    }

    expect(masalah).toEqual([])
  })

  it('includes poli provenance in the content fingerprint', () => {
    const changed = structuredClone(PACK)
    const firstCase = Object.values(changed.kasus)[0]!
    firstCase.sumber![0]!.url = `${firstCase.sumber![0]!.url}#integrity-probe`

    expect(sidikJariPack(changed)).not.toBe(sidikJariPack(PACK))
  })
})
