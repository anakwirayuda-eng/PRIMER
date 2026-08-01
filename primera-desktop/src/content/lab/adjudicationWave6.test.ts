import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import { PACK } from '..'

const IDS = [
  'lab_anafilaksis_makanan',
  'lab_perdarahan_gi_atas',
  'lab_pneumotoraks_spontan',
  'lab_tetanus_generalisata_awal',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 6: stabilisasi time-critical', () => {
  it('mempertahankan status prototipe dan memberi provenance EBM langsung', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).evidence.ebm.sources.some((source) => source.relation === 'direct'), id).toBe(true)
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
    expect(DATA.summary.ebmDirect).toBe(71)
  })

  it('anafilaksis mengunci epinefrin IM dewasa, pengulangan, monitoring, dan batas IV', () => {
    const kasus = PACK.kasus.lab_anafilaksis_makanan!
    const audit = record('lab_anafilaksis_makanan')
    expect(kasus.tatalaksana.prosedur).toContain('pemantauan_ketat_vital')
    expect(kasus.stabilisasiWajib).toEqual([
      'adrenalin_im_anafilaksis',
      'oksigen',
      'akses_iv_resusitasi',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.clue).toMatch(/0,5 mg IM.*ulang.*5 menit.*jangan biarkan berdiri.*bolus kristaloid.*transfer paralel/is)
    expect(kasus.panduanResmi).toMatch(/ERC\/RCUK 2025.*RCUK 2021.*adrenalin intravena hanya untuk spesialis/is)
    expect(kasus.catatanRealita).toMatch(/bukan memberi bolus adrenalin IV atau aminofilin rutin.*action plan.*autoinjektor/is)
    expect(audit.evidence.pnpk.status).toBe('tak-ada-sumber')
    expect(audit.evidence.ebm.sources.map((source) => source.sourceId)).toEqual([
      'rcuk-anaphylaxis-2025',
      'rcuk-anaphylaxis-2021',
      'aaaai-anaphylaxis-2023',
    ])
  })

  it('perdarahan GI menguji sirkulasi, monitoring, puasa, dan transfer tanpa lavage rutin', () => {
    const kasus = PACK.kasus.lab_perdarahan_gi_atas!
    const audit = record('lab_perdarahan_gi_atas')
    expect(kasus.nama).toBe('Perdarahan Saluran Cerna Atas dengan Instabilitas Hemodinamik')
    expect(kasus.tatalaksana.prosedur).toEqual([
      'akses_iv_resusitasi',
      'oksigen',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.tatalaksana.terapiKritis).toEqual(['akses_iv_resusitasi'])
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['puasa_sambil_rujuk'])
    expect(kasus.tatalaksana.edukasi).toContain('hentikan_nsaid_perdarahan_gi')
    expect(PACK.edukasi.puasa_sambil_rujuk?.nama).toMatch(/Rujukan akut/i)
    expect(PACK.edukasi.hentikan_nsaid_perdarahan_gi?.nama).toMatch(/NSAID non-aspirin.*antiplatelet.*antikoagulan/i)
    expect(kasus.clue).toMatch(/instabilitas hemodinamik.*SpO2 92%.*jangan menunggu Hb.*bilas lambung/is)
    expect(kasus.panduanResmi).toMatch(/PNPK.*2162\/2023.*ACG.*ESGE 2021.*bilas lambung/is)
    expect(kasus.catatanRealita).toMatch(/PNPK.*PPI.*tidak.*bukan crossmatch.*tetap berangkat/is)
    expect(kasus.mutiaraEbm).toMatch(/Hb awal.*Glasgow-Blatchford.*bukan kelompok rawat jalan/is)
    expect(audit.evidence.ebm.sources.map((source) => source.sourceId)).toEqual([
      'acg-ugib-2021',
      'esge-ugib-2021',
    ])
  })

  it('pneumotoraks menolak rawat konservatif saat ada gangguan fisiologis', () => {
    const kasus = PACK.kasus.lab_pneumotoraks_spontan!
    const audit = record('lab_pneumotoraks_spontan')
    expect(kasus.nama).toBe('Pneumotoraks Spontan Primer dengan Gangguan Fisiologis')
    expect(kasus.skdi).toBe('3A')
    expect(kasus.tatalaksana.obatOpsional).toEqual(['paracetamol_500'])
    expect(kasus.tatalaksana.prosedur).toEqual(['oksigen', 'pemantauan_ketat_vital'])
    expect(kasus.tatalaksana.edukasi).toContain('aktivitas_setelah_pneumotoraks')
    expect(PACK.edukasi.aktivitas_setelah_pneumotoraks?.nama).toMatch(/7 hari.*scuba/is)
    expect(kasus.stabilisasiWajib).toEqual(['oksigen', 'pemantauan_ketat_vital'])
    expect(kasus.clue).toMatch(/gangguan fisiologis.*bukan kandidat observasi konservatif.*94-98%/is)
    expect(kasus.clue).toMatch(/parasetamol.*transfer segera.*tanpa menunggu foto toraks/is)
    expect(kasus.panduanResmi).toMatch(/SKDI 2012.*3A.*PPK 1186\/2022.*4A.*ketidaksesuaian sumber/is)
    expect(kasus.panduanResmi).toMatch(/BTS.*ERS\/EACTS\/ESTS 2024.*94-98%/is)
    expect(kasus.catatanRealita).toMatch(/dugaan tensi.*jangan menunggu pencitraan.*tujuh hari.*scuba/is)
    expect(kasus.mutiaraEbm).toMatch(/Ukuran pneumotoraks.*bukan satu-satunya.*hipoksemik.*tension pneumothorax/is)
    expect(audit.evidence.ebm.sources.map((source) => source.sourceId)).toEqual([
      'bts-pneumothorax-2023',
      'ers-pneumothorax-2024',
      'bts-oxygen-2017',
    ])
  })

  it('tetanus derajat sedang mengunci TIG, airway-ready transfer, dan graceful degradation FKTP', () => {
    const kasus = PACK.kasus.lab_tetanus_generalisata_awal!
    const audit = record('lab_tetanus_generalisata_awal')
    expect(kasus.nama).toBe('Tetanus Generalisata Derajat Sedang')
    expect(kasus.skdi).toBe('4A')
    expect(kasus.spesialisRujukan).toBe('saraf')
    expect(kasus.diagnosisBanding).toEqual(['A35', 'T65.1', 'G00.9'])
    expect(kasus.anamnesis.map((item) => item.id)).toEqual(expect.arrayContaining([
      'q_spasme',
      'q_napas',
      'q_luka',
      'q_imunisasi',
      'q_otonom',
      'q_pajanan_racun',
    ]))
    expect(kasus.tatalaksana.obatBenar).toEqual(['tetanus_imunoglobulin_500'])
    expect(kasus.tatalaksana.obatOpsional).toEqual(['vaksin_td'])
    expect(kasus.tatalaksana.terapiKritis).toEqual(['tetanus_imunoglobulin_500'])
    expect(kasus.tatalaksana.prosedur).toEqual([
      'minim_stimulus_tetanus',
      'kesiapan_airway_rujuk',
      'pemantauan_ketat_vital',
      'balut_luka_steril',
    ])
    expect(kasus.stabilisasiWajib).toEqual([
      'minim_stimulus_tetanus',
      'kesiapan_airway_rujuk',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.tatalaksana.edukasi).toEqual([
      'puasa_sambil_rujuk',
      'imunitas_setelah_tetanus',
      'rawat_luka_tetanus',
    ])
    expect(kasus.tatalaksana.obatSalahUmum).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'diazepam_rektal_10', alasan: expect.stringMatching(/kesiapan ventilasi/i) }),
      expect.objectContaining({ id: 'metronidazol_500', alasan: expect.stringMatching(/disfagia.*dipuasakan/i) }),
    ]))
    expect(kasus.clue).toMatch(/secara klinis.*ruang tenang.*TIG 500 IU IM.*SpO2 96% tidak memerlukan oksigen rutin/is)
    expect(kasus.panduanResmi).toMatch(/4A.*bukan izin.*rawat jalan.*WHO 2026.*CDC 2025.*Fornas 1199\/2025/is)
    expect(kasus.catatanRealita).toMatch(/TIG 500 IU.*bukan klaim stok universal.*transfer jangan ditunda.*tidak menular antarmanusia/is)
    expect(kasus.mutiaraEbm).toMatch(/kultur luka negatif.*toksin yang belum terikat.*tidak memperoleh imunitas alami.*striknin/is)
    expect(kasus.sumber?.map((item) => item.id)).toEqual([
      'ppk_fktp_2022',
      'fornas_2025',
      'who_tetanus_2026',
      'cdc_tetanus_care_2025',
      'ukhsa_tetanus_2024',
    ])
    expect(audit.evidence.ebm.sources.map((source) => source.sourceId)).toEqual([
      'who-tetanus-2026',
      'cdc-tetanus-care-2025',
      'ukhsa-tetanus-2024',
    ])
    expect(audit.currentManagement.requiredDrugs).toEqual([
      expect.objectContaining({
        id: 'tetanus_imunoglobulin_500',
        fornas: expect.objectContaining({ status: 'cocok' }),
        kfa: expect.objectContaining({ status: 'cocok' }),
      }),
    ])
  })
})
