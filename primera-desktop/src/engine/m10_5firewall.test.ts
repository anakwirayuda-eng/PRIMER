/**
 * TEST — M10.5 Q1a: pelengkapan firewall alergi (DeepThink diterima; docs/
 * M10_5_FIDELITAS.md §2). 9 antibiotik tak-bertag kini dapat `golonganAlergi`
 * kelas farmakologinya; `mupirosin_krim` & `oat_kdt` SENGAJA dibiarkan kosong
 * (keputusan Dr. Wirayuda — mupirosin topikal tanpa silang-reaksi bermakna;
 * OAT kombinasi 4 obat → satu label alergi menyesatkan).
 *
 * INVARIAN KEAMANAN: menambah tag TAK boleh memblokir obat benar di kasus mana
 * pun — dibuktikan dgn (a) himpunan alergiTrap.kelas yang DIPAKAI kasus disjoint
 * dari kelas-kelas baru, dan (b) firewall hanya menyala saat pasien BENAR-BENAR
 * membawa alergi kelas itu (arming, bukan blokir otomatis).
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { aksiKlinik, buatEncounter } from './clinic'
import { Rng } from './core/rng'
import type { PasienAktif } from './state'

const TAG_BARU: Record<string, string> = {
  ciprofloxacin_500: 'kuinolon',
  doksisiklin_100: 'tetrasiklin',
  gentamisin_tetes_mata: 'aminoglikosida',
  gentamisin_krim: 'aminoglikosida',
  nitrofurantoin_100: 'nitrofuran',
  metronidazol_500: 'nitroimidazol',
  kloramfenikol_250: 'amfenikol',
  kloramfenikol_tetes_mata: 'amfenikol',
  tiamfenikol_500: 'amfenikol',
}
const KELAS_BARU = new Set(Object.values(TAG_BARU))

function pasien(override: Partial<PasienAktif> = {}): PasienAktif {
  return {
    id: 'p_fw', nama: 'Uji Firewall', usia: 30, jenisKelamin: 'P', persona: 'polos',
    kasusId: 'x', bpjs: true, alergi: [], faktorRisiko: [], rw: 1, bonusTrust: false, ...override,
  }
}

describe('M10.5 Q1a — 9 antibiotik dapat golonganAlergi, 2 tepi dibiarkan kosong', () => {
  for (const [id, kelas] of Object.entries(TAG_BARU)) {
    it(`${id} → golonganAlergi '${kelas}'`, () => {
      expect(PACK.obat[id]?.golonganAlergi).toBe(kelas)
    })
  }
  it('mupirosin_krim & oat_kdt TETAP tanpa golonganAlergi (keputusan dokter)', () => {
    expect(PACK.obat['mupirosin_krim']?.golonganAlergi).toBeUndefined()
    expect(PACK.obat['oat_kdt']?.golonganAlergi).toBeUndefined()
  })
  it('firewall antibiotik: semua bertag kecuali mupirosin+oat_kdt yang disengaja', () => {
    const ab = Object.values(PACK.obat).filter((o) => o.antibiotik)
    const bertag = ab.filter((o) => o.golonganAlergi)
    const takBertag = ab.filter((o) => !o.golonganAlergi).map((o) => o.id).sort()
    expect(bertag.length).toBe(ab.length - 2)
    expect(takBertag).toEqual(['mupirosin_krim', 'oat_kdt'])
  })
})

describe('M10.5 Q1a — keamanan: tag baru tak bisa memblokir obat benar mana pun', () => {
  it('himpunan alergiTrap.kelas yang DIPAKAI kasus disjoint dari kelas baru', () => {
    const dipakai = new Set<string>()
    for (const k of Object.values(PACK.kasus)) {
      if (k.alergiTrap) dipakai.add(k.alergiTrap.kelas)
    }
    for (const kelas of KELAS_BARU) {
      expect(dipakai.has(kelas)).toBe(false)
    }
  })
})

describe('M10.5 Q1a — arming: firewall menyala HANYA saat pasien bawa alergi kelas itu', () => {
  it('pasien alergi kuinolon → ciprofloxacin DIBLOKIR (tak masuk resep, firewall++)', () => {
    const enc = { ...buatEncounter(pasien({ alergi: ['kuinolon'] })), fase: 'terapi' as const }
    const { enc: baru, events } = aksiKlinik(enc, { type: 'TAMBAH_OBAT', obatId: 'ciprofloxacin_500' }, PACK.kasus['disentri_basiler']!, PACK, new Rng(1, 'fw'))
    expect(baru.resep).not.toContain('ciprofloxacin_500')
    expect(baru.firewallTerpicu).toBe(1)
    expect(events.some((e) => e.type === 'FIREWALL_ALERGI')).toBe(true)
  })
  it('pasien TANPA alergi → ciprofloxacin masuk resep normal (kontrol negatif)', () => {
    const enc = { ...buatEncounter(pasien({ alergi: [] })), fase: 'terapi' as const }
    const { enc: baru } = aksiKlinik(enc, { type: 'TAMBAH_OBAT', obatId: 'ciprofloxacin_500' }, PACK.kasus['disentri_basiler']!, PACK, new Rng(1, 'fw'))
    expect(baru.resep).toContain('ciprofloxacin_500')
    expect(baru.firewallTerpicu).toBe(0)
  })
})
