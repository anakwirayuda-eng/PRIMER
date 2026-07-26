import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const IDS = [
  'lab_katarak_matur',
  'lab_ablasio_retina',
  'lab_retinopati_diabetik_proliferatif',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 10: preservasi penglihatan di FKTP', () => {
  it('memberi provenance EBM langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).evidence.ebm.sources.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(67)
  })

  it('mengoreksi tiga label ICD agar sesuai dengan penyakit yang diajarkan', () => {
    const katarak = PACK.kasus.lab_katarak_matur!
    const ablasio = PACK.kasus.lab_ablasio_retina!
    const retinopati = PACK.kasus.lab_retinopati_diabetik_proliferatif!

    expect(katarak.icd10).toBe('H25.9')
    expect(ablasio.icd10).toBe('H33.0')
    expect(ablasio.nama).toMatch(/regmatogen/i)
    expect(retinopati.icd10).toBe('H36.0')
    expect(retinopati.nama).toMatch(/suspek.*mengancam penglihatan/i)
  })

  it('katarak menilai fungsi dan rujukan tanpa tes atau komplikasi palsu', () => {
    const kasus = PACK.kasus.lab_katarak_matur!
    expect(kasus.lab).toEqual([])
    expect(kasus.tatalaksana.obatBenar).toEqual([])
    expect(kasus.clue).toMatch(/dampak fungsional/i)
    expect(kasus.panduanResmi).toMatch(/PNPK Katarak Dewasa 2026/i)
    expect(kasus.catatanRealita).toMatch(/pendamping, transportasi, dan hambatan/i)
    expect(kasus.konsekuensi?.kembaliHariMin).toBeGreaterThanOrEqual(60)
    expect(kasus.konsekuensi?.kondisiKembali).toMatch(/bukan akibat yang pasti/i)
    expect(`${kasus.clue} ${kasus.konsekuensi?.narasi}`).not.toMatch(/dalam beberapa minggu.*glaukoma/is)
  })

  it('ablasio menuntut rujukan hari yang sama tanpa tonometri atau klaim macula-on', () => {
    const kasus = PACK.kasus.lab_ablasio_retina!
    expect(kasus.harusDirujuk).toBe(true)
    expect(kasus.lab).toEqual([])
    expect(kasus.tatalaksana.obatBenar).toEqual([])
    expect(kasus.pemeriksaanFisik.map((item) => item.temuan).join(' ')).not.toMatch(/teraba lunak/i)
    expect(kasus.clue).toMatch(/tidak boleh dipastikan.*pemeriksaan retina/is)
    expect(kasus.clue).toMatch(/hari yang sama/i)
    expect(kasus.panduanResmi).toMatch(/AAO PPP 2024/i)
    expect(kasus.catatanRealita).toMatch(/jejaring rujukan.*hari yang sama/is)
    expect(`${kasus.clue} ${kasus.mutiaraEbm}`).not.toMatch(/tekanan bola mata terukur normal/i)
  })

  it('retinopati tidak mengunci stadium atau menjadikan obat metabolik terapi akut mata', () => {
    const kasus = PACK.kasus.lab_retinopati_diabetik_proliferatif!
    expect(kasus.lab).toEqual([])
    expect(kasus.tatalaksana.obatBenar).toEqual([])
    expect(kasus.tatalaksana.obatOpsional ?? []).toEqual([])
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['skrining_retinopati_diabetik'])
    expect(PACK.edukasi.skrining_retinopati_diabetik?.nama).toMatch(/skrining retina/i)
    expect(kasus.clue).toMatch(/tidak boleh mengunci stadium proliferatif/i)
    expect(kasus.clue).toMatch(/tinjauan DM komprehensif terpisah/i)
    expect(kasus.panduanResmi).toMatch(/interval 1–2 tahun.*pemeriksaan normal/is)
    expect(kasus.panduanResmi).toMatch(/lebih sering.*mengancam penglihatan/is)
    expect(kasus.catatanRealita).toMatch(/fungsi ginjal, risiko hipoglikemia, kepatuhan, komorbid/i)
  })

  it('tidak menghidupkan kembali tiga overclaim lama', () => {
    const text = IDS.map((id) => {
      const kasus = PACK.kasus[id]!
      return [kasus.clue, kasus.panduanResmi, kasus.catatanRealita, kasus.mutiaraEbm].join(' ')
    }).join(' ')

    expect(text).not.toMatch(/makula masih menempel \(macula-on\)/i)
    expect(text).not.toMatch(/perbaikan kadar gula harus bertahap/i)
    expect(text).not.toMatch(/HbA1c tersedia sekali klik/i)
    expect(text).not.toMatch(/spesialis mata.*hanya ada di ibu kota provinsi/i)
  })
})
