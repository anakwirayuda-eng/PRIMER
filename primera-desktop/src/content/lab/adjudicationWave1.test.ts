import { describe, expect, it } from 'vitest'
import { PACK } from '../index'

const IDS = [
  'lab_trauma_tumpul_kepala_ringan',
  'lab_trauma_tajam_kulit_kepala',
  'lab_trauma_abdomen_tumpul',
] as const

describe('M13-137 - cicilan grounding trauma gelombang 1', () => {
  it('tetap prototipe belum diadjudikasi meski atribusi sumber sudah dikoreksi', () => {
    for (const id of IDS) {
      const kasus = PACK.kasus[id]
      expect(kasus, id).toBeDefined()
      if (!kasus) throw new Error(`Kasus '${id}' hilang dari PACK`)
      expect(kasus.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(kasus.panduanResmi, id).toMatch(/PNPK/)
      expect(kasus.panduanResmi, id).not.toMatch(/\bPPK\b|1186\/2022/)
    }
  })

  it('skenario trauma kepala risiko rendah tidak merandom pasien yang memenuhi red flag usia PNPK', () => {
    const kasus = PACK.kasus.lab_trauma_tumpul_kepala_ringan
    expect(kasus).toBeDefined()
    if (!kasus) throw new Error('Kasus trauma kepala ringan hilang dari PACK')
    expect(kasus.demografi.usiaMax).toBeLessThanOrEqual(59)
    expect(kasus.panduanResmi).toContain('HK.01.07/MENKES/1600/2022')
    expect(kasus.clue).toMatch(/usia di atas 60 tahun/i)
  })

  it('trauma kepala terbuka sederhana dan trauma abdomen memakai floor trauma yang tepat', () => {
    for (const id of ['lab_trauma_tajam_kulit_kepala', 'lab_trauma_abdomen_tumpul'] as const) {
      const kasus = PACK.kasus[id]
      expect(kasus, id).toBeDefined()
      if (!kasus) throw new Error(`Kasus '${id}' hilang dari PACK`)
      expect(kasus.panduanResmi).toContain('HK.01.07/MENKES/132/2017')
    }
    const abdomen = PACK.kasus.lab_trauma_abdomen_tumpul
    expect(abdomen).toBeDefined()
    if (!abdomen) throw new Error('Kasus trauma abdomen hilang dari PACK')
    expect(abdomen.catatanRealita).toMatch(/BUKAN prasyarat/i)
  })
})
