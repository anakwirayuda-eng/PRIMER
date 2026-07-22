import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

const NEWLY_GROUNDED = [
  'lab_edema_paru_akut_hipertensif',
  'lab_ileus_obstruktif',
  'lab_benda_asing_konjungtiva',
  'lab_trikiasis',
  'lab_parafimosis_reduksibel',
  'lab_vaginitis_kandida',
  'lab_ruptur_perineum_derajat_1',
  'lab_eritrasma_lipat_paha',
  'lab_tinea_kapitis_anak',
  'lab_tinea_barbae',
  'lab_tinea_fasialis',
  'lab_tinea_manus',
  'lab_tinea_kruris',
  'lab_tinea_pedis',
  'lab_pitiriasis_versikolor',
  'lab_dermatitis_numularis',
  'lab_hiperemesis_gravidarum_berat',
  'lab_gizi_buruk_komplikasi',
  'lab_talasemia_beta_mayor_anak',
  'lab_hernia_inguinalis_inkarserata',
  'lab_peritonitis_generalisata',
  'lab_kaki_diabetik_infeksi',
  'lab_tia_serangan_iskemik_sesaat',
] as const

function record(id: string) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 21: closure resource dan provenance', () => {
  it('menutup seluruh backlog resource tanpa mengaktifkan prototipe', () => {
    expect(DATA.summary.resourceTierCOrD).toBe(46)
    expect(DATA.summary.resourceGrounded).toBe(46)
    expect(DATA.summary.resourceUnresolved).toBe(0)

    for (const item of DATA.cases) {
      expect(item.evidence.aspak.unresolvedResourceIds, item.id).toEqual([])
      expect(PACK.kasus[item.id]?.activationStatus, item.id).toBe('lab_prototype_unadjudicated')
    }
  })

  it('setiap deklarasi baru punya narasi kesiapan atau fallback yang dapat dibaca manusia', () => {
    for (const id of NEWLY_GROUNDED) {
      const item = record(id)
      const elevated = item.evidence.aspak.resources.filter((resource) => (
        resource.tier === 'C' || resource.tier === 'D'
      ))
      expect(elevated.length, id).toBeGreaterThan(0)
      expect(elevated.every((resource) => resource.grounding === 'declared'), id).toBe(true)
      expect(PACK.kasus[id]?.catatanRealita?.length, id).toBeGreaterThan(80)
    }
  })

  it('seluruh 137 record lolos compiler namun tetap menunggu adjudikasi dokter', () => {
    expect(DATA.summary.bySuggestion).toEqual({
      cocok: 137,
      'perlu-koreksi': 0,
      'tak-ada-sumber': 0,
    })
    expect(DATA.cases.every((item) => item.compiler.sourceAttributionWarning === false)).toBe(true)
    expect(DATA.cases.every((item) => item.compiler.suggestion === 'cocok')).toBe(true)
  })
})
