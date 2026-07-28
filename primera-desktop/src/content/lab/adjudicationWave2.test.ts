import { describe, expect, it } from 'vitest'
import { PACK } from '..'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'

const IDS = [
  'lab_gizi_buruk_komplikasi',
  'lab_bronkiolitis_berat',
  'lab_meningitis_bakterial_suspek',
  'lab_benda_asing_esofagus',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  return DATA.cases.find((item) => item.id === id)!
}

describe('M13-137 adjudication wave 2: kegawatan anak dan pra-rujuk', () => {
  it('mempertahankan empat kasus sebagai prototipe yang belum diadjudikasi dokter', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(record(id).compiler.sourceAttributionWarning, id).toBe(false)
    }
  })

  it('bronkiolitis memakai threshold bayi dan pedoman diagnosis-spesifik yang dapat dilacak', () => {
    const kasus = PACK.kasus.lab_bronkiolitis_berat!
    const bukti = record('lab_bronkiolitis_berat').evidence.ebm.sources
    expect(kasus.vital.spo2).toBe(89)
    expect(kasus.skdi).toBe('3B')
    expect(kasus.stabilisasiWajib).toEqual(['oksigen', 'pemantauan_ketat_vital'])
    expect(kasus.tatalaksana.prosedur).toEqual(['oksigen', 'pemantauan_ketat_vital'])
    expect(kasus.tatalaksana.prosedurOpsional).toEqual([
      'suction_hidung_bronkiolitis_selektif',
      'akses_iv_tanpa_bolus',
    ])
    expect(kasus.tatalaksana.edukasi).toEqual([
      'rujuk_bronkiolitis_bayi',
      'minum_aman_bronkiolitis_bayi',
      'bebas_asap_bayi',
    ])
    expect(kasus.tatalaksana.edukasi).not.toContain('asi_eksklusif')
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['rujuk_bronkiolitis_bayi'])
    expect(kasus.keluhanUtama).toMatch(/pilek dan batuk/i)
    expect(kasus.anamnesis.find((item) => item.id === 'q_wheezing_sebelumnya')?.jawab).toMatch(/belum pernah/i)
    expect(kasus.clue).toMatch(/WHO 2026|bronkiolitis berat/i)
    expect(kasus.panduanResmi).toMatch(/WHO 2026.*NICE NG9/is)
    expect(kasus.panduanResmi).toMatch(/salin hipertonik.*kondisional.*bukti rendah.*bukan kewajiban/is)
    expect(kasus.catatanRealita).toMatch(/NG-OG.*IV isotonik.*bukan izin bolus rutin/is)
    expect(PACK.tindakan.suction_hidung_bronkiolitis_selektif?.nama).toMatch(/bila sekret/i)
    expect(PACK.edukasi.rujuk_bronkiolitis_bayi?.nama).toMatch(/rujuk sekarang/i)
    expect(bukti.map((item) => item.sourceId)).toEqual([
      'who-bronchiolitis-2026',
      'nice-bronchiolitis-ng9',
    ])
    expect(record('lab_bronkiolitis_berat').compiler.suggestion).toBe('cocok')
  })

  it('meningitis mengikat stabilisasi FKTP, droplet, dan loop surveilans tanpa over-treatment', () => {
    const kasus = PACK.kasus.lab_meningitis_bakterial_suspek!
    const bukti = record('lab_meningitis_bakterial_suspek').evidence.ebm.sources
    expect(kasus.tatalaksana.obatBenar).toEqual(['ceftriaxone_1g_inj'])
    expect(kasus.tatalaksana.obatOpsional).toContain('paracetamol_500')
    expect(kasus.tatalaksana.prosedur).toEqual([
      'kewaspadaan_droplet_meningokokus',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.tatalaksana.prosedurOpsional).toEqual(['akses_iv_tanpa_bolus'])
    expect(kasus.tatalaksana.prosedur).not.toContain('oksigen')
    expect(kasus.tatalaksana.prosedur).not.toContain('pasang_infus')
    expect(kasus.tatalaksana.edukasi).toContain('profilaksis_kontak_meningokokus')
    expect(kasus.tatalaksana.edukasi).not.toContain('obati_kontak_serumah')
    expect(kasus.stabilisasiWajib).toEqual(['pemantauan_ketat_vital'])
    expect(kasus.ambangKluster).toBe(2)
    expect(kasus.diagnosisBanding).toEqual(['G00.9', 'A87.9', 'I60.9'])
    expect(kasus.nama).toBe('Suspek Meningitis Bakterial pada Dewasa Muda')
    expect(kasus.demografi).toMatchObject({ usiaMin: 18, usiaMax: 30 })
    expect(kasus.clue).toMatch(/45 menit.*2 g.*IV.*IM/is)
    expect(kasus.clue).toMatch(/lebih dari 30 menit/i)
    expect(`${kasus.clue}\n${kasus.konsekuensi?.narasi}`).not.toMatch(/tiga jam/i)
    expect(kasus.panduanResmi).toMatch(/2 g pada dewasa.*50 mg\/kg pada anak/is)
    expect(kasus.clue).toMatch(/SpO2 96%.*tidak memerlukan oksigen rutin/is)
    expect(kasus.catatanRealita).toMatch(/45 menit.*dua vial.*stok emergensi khusus.*bukan KLB otomatis/is)
    expect(kasus.mutiaraEbm).not.toMatch(/sekitar 5%|khas Indonesia/i)
    expect(PACK.tindakan.kewaspadaan_droplet_meningokokus?.nama).toMatch(/droplet/i)
    expect(PACK.edukasi.profilaksis_kontak_meningokokus?.nama).toMatch(/kontak erat.*koordinasikan/i)
    expect(bukti.map((item) => item.sourceId)).toEqual([
      'who-meningitis-2025',
      'who-meningitis-toolkit-2026',
      'kemenkes-meningokokus-2023',
      'kemenkes-antimicrobial-2021',
    ])
    expect(record('lab_meningitis_bakterial_suspek').compiler.suggestion).toBe('cocok')
  })

  it('baterai kancing tidak menunggu rontgen FKTP atau memaksa madu pada anak yang gagal menelan', () => {
    const kasus = PACK.kasus.lab_benda_asing_esofagus!
    const bukti = record('lab_benda_asing_esofagus').evidence.ebm.sources
    expect(kasus.tatalaksana.edukasi).toContain('cegah_baterai_kancing')
    expect(kasus.tatalaksana.edukasi).not.toContain('cegah_benda_asing_hidung')
    expect(kasus.lab).toEqual([])
    expect(kasus.clue).toMatch(/tidak mampu menelan.*JANGAN paksa madu/is)
    expect(kasus.clue).toMatch(/jangan menunggu rontgen lokal/i)
    expect(kasus.panduanResmi).toMatch(/dua jam.*AP dan lateral.*tanpa menahan transfer/is)
    expect(kasus.catatanRealita).toMatch(/tidak diasumsikan memiliki rontgen.*endoskopi anak/is)
    expect(kasus.mutiaraEbm).toMatch(/cincin ganda.*tepi bertingkat/is)
    expect(bukti.map((item) => item.sourceId)).toEqual([
      'poison-control-button-battery',
      'aap-esophageal-caustic-2025',
    ])
    expect(record('lab_benda_asing_esofagus').compiler.suggestion).toBe('cocok')
    expect(PACK.edukasi.cegah_baterai_kancing?.nama).toMatch(/baterai kancing/i)
  })

  it('gizi buruk memakai floor PPK langsung dan stabilisasi WHO 2023 yang terukur', () => {
    const kasus = PACK.kasus.lab_gizi_buruk_komplikasi!
    expect(kasus.skdi).toBe('4A')
    expect(kasus.tatalaksana.obatBenar).not.toContain('ceftriaxone_1g_inj')
    expect(kasus.tatalaksana.obatOpsional).toContain('oralit')
    expect(kasus.tatalaksana.obatSalahUmum?.map((item) => item.id)).not.toContain('oralit')
    expect(kasus.tatalaksana.prosedur).toEqual([
      'koreksi_hipoglikemia_gizi_buruk_anak',
      'rehidrasi_gizi_buruk_non_syok',
      'jaga_hangat_gizi_buruk_anak',
      'antibiotik_parenteral_gizi_buruk_protokol',
      'pemantauan_ketat_vital',
    ])
    expect(kasus.stabilisasiWajib).toEqual(kasus.tatalaksana.prosedur)
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['rujuk_gizi_buruk_komplikasi'])
    expect(kasus.clue).not.toMatch(/gagal uji nafsu makan/i)
    expect(kasus.clue).toMatch(/bukan hasil uji nafsu makan terstandar/i)
    expect(kasus.clue).toMatch(/danger sign.*masalah medis akut.*hipoglikemia/is)
    expect(kasus.clue).toMatch(/5 mL\/kg.*bukan rule-of-15 dewasa/is)
    expect(kasus.clue).toMatch(/ORS osmolaritas rendah bila ReSoMal tidak tersedia/i)
    expect(kasus.clue).toMatch(/Vitamin A dosis tinggi bukan rutinitas/i)
    expect(PACK.tindakan.koreksi_hipoglikemia_gizi_buruk_anak?.nama).toMatch(/5 mL\/kg/i)
    expect(PACK.tindakan.koreksi_hipoglikemia_gizi_buruk_anak?.nama).toMatch(/nilai ulang/i)
    expect(PACK.tindakan.koreksi_hipoglikemia_gizi_buruk_anak?.nama).not.toMatch(/F-75/i)
    expect(kasus.catatanRealita).toMatch(/ketiadaan F-75 tidak boleh menunda transfer/i)
    expect(PACK.tindakan.jaga_hangat_gizi_buruk_anak).toBeDefined()
    expect(PACK.tindakan.antibiotik_parenteral_gizi_buruk_protokol).toBeDefined()
    expect(record('lab_gizi_buruk_komplikasi').evidence.ppk).toEqual(expect.objectContaining({
      status: 'cocok',
      relation: 'direct',
      sourceTitle: 'Malnutrisi Energi Protein (MEP)',
      sourceEntryNumber: '8',
    }))
  })
})
