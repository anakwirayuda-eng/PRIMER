import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { SUMBER_IGD } from '@content/igdSources'
import { validasiPack, type ContentPack } from '@content/pack'
import { sidikJariPack } from './verifikasi'

describe('grounding IGD 20/20', () => {
  it('semua kasus punya panduan lokal, evidence internasional, dan URL HTTPS', () => {
    const kasus = Object.values(PACK.kasusIgd)
    expect(kasus).toHaveLength(20)

    const sumberTerpakai = new Set<string>()
    for (const item of kasus) {
      expect(item.panduanResmi.trim().length, item.id).toBeGreaterThan(40)
      expect(item.sumber.some((s) => s.jenis === 'pedoman_indonesia'), item.id).toBe(true)
      expect(item.sumber.some((s) => s.jenis === 'evidence_internasional'), item.id).toBe(true)
      expect(new Set(item.sumber.map((s) => s.id)).size, item.id).toBe(item.sumber.length)
      for (const sumber of item.sumber) {
        expect(sumber.url, `${item.id}/${sumber.id}`).toMatch(/^https:\/\//)
        sumberTerpakai.add(sumber.id)
      }
    }

    expect([...sumberTerpakai].sort()).toEqual(Object.keys(SUMBER_IGD).sort())
    expect(validasiPack(PACK)).toEqual([])
  })

  it('mengunci sumber mutakhir pada skenario waktu-kritis utama', () => {
    expect(PACK.kasusIgd.igd_asma_berat?.sumber.map((s) => s.id)).toContain('gina_2026')
    expect(PACK.kasusIgd.igd_hipoglikemia?.sumber.map((s) => s.id)).toContain('ada_hypoglycemia_2026')
    expect(PACK.kasusIgd.igd_stroke_iskemik_window?.sumber.map((s) => s.id)).toContain('aha_asa_stroke_2026')
    expect(PACK.kasusIgd.igd_syok_sepsis?.sumber.map((s) => s.id)).toContain('ssc_sepsis_2026')
    expect(PACK.kasusIgd.igd_syok_sepsis?.clue).toMatch(/SSC 2026.*30 mL\/kg.*reassessment/is)
    expect(PACK.kasusIgd.igd_syok_sepsis?.langkah.flatMap((l) => l.pilihan).map((p) => p.respons).join(' ')).not.toMatch(/setiap jam.*menaikkan angka kematian/i)
    expect(PACK.kasusIgd.igd_eklampsia?.clue).toMatch(/frekuensi napas >=16x\/menit.*napas <16x\/menit/is)
    expect(PACK.kasusIgd.igd_eklampsia?.clue).not.toMatch(/frekuensi napas 12-16/i)
    expect(PACK.kasusIgd.igd_stemi_anterior_hipoksemik?.sumber.map((s) => s.id)).toContain('acc_aha_acs_2025')
  })

  it('validasi menolak URL tak aman dan fingerprint peka pada provenance', () => {
    const id = 'igd_asma_berat'
    const kasus = PACK.kasusIgd[id]!
    const sumberRusak = kasus.sumber.map((s, index) => index === 0 ? { ...s, url: 'http://contoh.invalid' } : s)
    const rusak: ContentPack = {
      ...PACK,
      kasusIgd: { ...PACK.kasusIgd, [id]: { ...kasus, sumber: sumberRusak } },
    }
    expect(validasiPack(rusak)).toContain(`IGD ${id}: sumber '${sumberRusak[0]!.id}' bukan URL HTTPS`)
    expect(sidikJariPack(rusak)).not.toBe(sidikJariPack(PACK))

    const panduanBerubah: ContentPack = {
      ...PACK,
      kasusIgd: {
        ...PACK.kasusIgd,
        [id]: { ...kasus, panduanResmi: `${kasus.panduanResmi} Koreksi.` },
      },
    }
    expect(sidikJariPack(panduanBerubah)).not.toBe(sidikJariPack(PACK))
  })
})
