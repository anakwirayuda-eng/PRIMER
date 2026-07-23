import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import {
  EBM_GUIDELINE_CROSSWALK,
  PNPK_CROSSWALK,
} from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'

const IDS = [
  'lab_hiv_tanpa_komplikasi',
  'lab_kusta_pausibasiler',
  'lab_sifilis_primer',
] as const

const DATA = buildAdjudicationDataset('2026-07-19T00:00:00.000Z')

function record(id: typeof IDS[number]) {
  const item = DATA.cases.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Adjudication record '${id}' hilang`)
  return item
}

describe('M13-137 adjudication wave 13: HIV, kusta, dan sifilis longitudinal', () => {
  it('memberi provenance langsung tanpa mengaktifkan prototipe', () => {
    for (const id of IDS) {
      expect(PACK.kasus[id]?.activationStatus, id).toBe('lab_prototype_unadjudicated')
      expect(record(id).evidence.ebm.status, id).toBe('cocok')
      expect(EBM_GUIDELINE_CROSSWALK[id]?.some((source) => source.relation === 'direct'), id).toBe(true)
    }
    expect(DATA.summary.ebmDirect).toBe(66)
  })

  it('membuat rapid ART tetap berbasis asesmen tanpa gate laboratorium palsu', () => {
    const kasus = PACK.kasus.lab_hiv_tanpa_komplikasi!
    expect(kasus.nama).toBe('Infeksi HIV Asimtomatik - Inisiasi ART')
    expect(kasus.keluhanUtama).toMatch(/tes HIV awal.*reaktif.*memastikan hasil/is)
    expect(kasus.lab.map((item) => item.id)).toEqual([
      'tes_hiv_serial',
      'panel_awal_hiv_jejaring',
    ])
    expect(kasus.konfirmasiWajib).toBe('tes_hiv_serial')
    expect(kasus.lab.find((item) => item.id === 'panel_awal_hiv_jejaring')?.hasil).toMatch(
      /CD4 428.*eGFR 92.*HBsAg nonreaktif/is,
    )
    expect(kasus.diagnosisBanding).toEqual(['Z21', 'R75', 'B20'])
    expect(kasus.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'q_oi', esensial: true }),
      expect.objectContaining({ id: 'q_ginjal', esensial: true }),
      expect.objectContaining({ id: 'q_hamil', esensial: true, hanyaUntuk: 'P' }),
      expect.objectContaining({
        id: 'q_kesiapan',
        esensial: true,
        tanya: expect.stringMatching(/menyakiti diri.*dukungan aman/is),
      }),
    ]))
    expect(kasus.tatalaksana.obatBenar).toEqual(['arv_tld'])
    expect(kasus.tatalaksana.edukasi).toContain('tpt_hiv_setelah_skrining_tb')
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['kepatuhan_arv', 'retensi_hiv_viral_load'])
    expect(kasus.clue).toMatch(/TDF\/3TC\/DTG.*hari yang sama/is)
    expect(kasus.clue).toMatch(/TB aktif disingkirkan.*kelayakan TPT/is)
    expect(kasus.clue).toMatch(/Kotrimoksazol tidak otomatis/is)
    expect(kasus.clue).toMatch(/U=U.*supresi viral terverifikasi/is)
    expect(kasus.catatanRealita).toMatch(/satu minggu.*satu bulan/is)
    expect(kasus.catatanRealita).toMatch(/sukarela, rahasia, aman, dan tanpa paksaan/i)
    expect(kasus.mutiaraEbm).toMatch(/CD4 baseline.*bukan syarat.*menahan ART/is)
    expect(kasus.mutiaraEbm).toMatch(/HBsAg.*flare/is)
  })

  it('mengikat HIV ke provenance Indonesia dan EBM terbaru yang tepat', () => {
    const kasus = PACK.kasus.lab_hiv_tanpa_komplikasi!
    expect(PNPK_CROSSWALK.lab_hiv_tanpa_komplikasi).toEqual([
      { slug: 'hiv-2019', relation: 'direct' },
    ])
    expect(record('lab_hiv_tanpa_komplikasi').evidence.pnpk.status).toBe('cocok')
    expect(EBM_GUIDELINE_CROSSWALK.lab_hiv_tanpa_komplikasi?.map((item) => item.sourceId)).toEqual([
      'kemenkes-disease-control-2026',
      'kemenkes-hiv-ims-2022',
      'kemenkes-puskesmas-hiv-2024',
      'who-hiv-clinical-2025',
      'who-hiv-service-2026',
    ])
    expect(kasus.sumber?.map((item) => item.id)).toEqual([
      'ppk_fktp_2022',
      'pnpk_hiv_2019',
      'permenkes_penyakit_2026',
      'lampiran_hiv_ims_2022',
      'pedoman_puskesmas_klaster3_2024',
      'who_hiv_clinical_2025',
      'who_hiv_service_2026',
    ])
    expect(kasus.panduanResmi).toMatch(/mencabut sebagian besar.*Pasal 41 dan Lampirannya tetap berlaku/is)
  })

  it('menjadikan kusta PB diagnosis klinis dengan MDT tiga obat dan pencegahan disabilitas', () => {
    const kasus = PACK.kasus.lab_kusta_pausibasiler!
    expect(kasus.lab).toEqual([])
    expect(kasus.clue).toMatch(/tanpa mewajibkan slit-skin smear/i)
    expect(kasus.clue).toMatch(/MDT tiga obat selama enam bulan/i)
    expect(kasus.pemeriksaanFisik.find((item) => item.region === 'neurologis')?.temuan).toMatch(/disabilitas derajat 2/i)
    expect(PACK.obat.mdt_kusta_pb?.nama).toMatch(/rifampisin.*dapson.*klofazimin.*6 bulan/i)
    expect(kasus.tatalaksana.edukasi).toEqual([
      'kepatuhan_program_kusta',
      'perawatan_saraf_kusta',
      'skrining_kontak_kusta',
    ])
    expect(kasus.catatanRealita).toMatch(/pengungkapan diagnosis.*stigma/i)
  })

  it('menutup episode sifilis dengan kehamilan, titer, dan partner services aman', () => {
    const kasus = PACK.kasus.lab_sifilis_primer!
    expect(kasus.anamnesis).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'q_riwayat_sifilis', esensial: true }),
      expect.objectContaining({ id: 'q_hamil', esensial: true, hanyaUntuk: 'P' }),
      expect.objectContaining({ id: 'q_alergi', esensial: true, tanya: expect.stringMatching(/lepuh luas|reaksi berat/i) }),
      expect.objectContaining({ id: 'q_pasangan', esensial: true, tanya: expect.stringMatching(/rahasia.*membahayakan/i) }),
    ]))
    expect(kasus.clue).toMatch(/RPR kuantitatif.*respons/is)
    expect(kasus.clue).toMatch(/Jarisch-Herxheimer/i)
    expect(kasus.clue).toMatch(/tujuh hari.*pasangan telah ditangani/is)
    expect(kasus.tatalaksana.edukasiKritis).toEqual(['tindak_lanjut_sifilis', 'layanan_pasangan_sifilis'])
    expect(kasus.catatanRealita).toMatch(/tidak ada pengungkapan.*koersif/i)
  })

  it('memberi konsekuensi longitudinal yang masuk akal secara waktu', () => {
    const hiv = PACK.kasus.lab_hiv_tanpa_komplikasi!
    const kusta = PACK.kasus.lab_kusta_pausibasiler!
    const sifilis = PACK.kasus.lab_sifilis_primer!
    expect(hiv.konsekuensi).toMatchObject({ kembaliHariMin: 30, kembaliHariMax: 60 })
    expect(hiv.konsekuensi?.kondisiKembali).toMatch(/masih tanpa gejala berat/i)
    expect(kusta.konsekuensi).toMatchObject({ kembaliHariMin: 60, kembaliHariMax: 120 })
    expect(kusta.konsekuensi?.kondisiKembali).toMatch(/area mati rasa/i)
    expect(sifilis.konsekuensi).toMatchObject({ kembaliHariMin: 21, kembaliHariMax: 60 })
    expect(sifilis.konsekuensi?.narasi).toMatch(/hilangnya luka bukan bukti sembuh/i)
  })

  it('mengunci simplifikasi lama agar tidak kembali', () => {
    const text = IDS.map((id) => {
      const kasus = PACK.kasus[id]!
      return [kasus.clue, kasus.panduanResmi, kasus.catatanRealita, kasus.konsekuensi?.narasi].join(' ')
    }).join(' ')

    expect(text).not.toMatch(/darah rutin.*kreatinin.*harus.*sebelum ARV/i)
    expect(text).not.toMatch(/ambil hasil HIV/i)
    expect(text).not.toMatch(/F43\.2/i)
    expect(text).not.toMatch(/kotrimoksazol otomatis diberikan/i)
    expect(text).not.toMatch(/Permenkes 23\/2022 menjadi floor/i)
    expect(text).not.toMatch(/Permenkes 23\/2022 (?:adalah|tetap|masih) (?:regulasi )?aktif utuh/i)
    expect(text).not.toMatch(/dua lesi, BTA negatif.*mendukung PB/i)
    expect(text).not.toMatch(/kusta tak diobati merusak saraf dan menular/i)
    expect(text).not.toMatch(/pasangan perlu diobati\.$/i)
  })
})
