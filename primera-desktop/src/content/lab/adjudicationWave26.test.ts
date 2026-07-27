import { describe, expect, it } from 'vitest'
import { buildAdjudicationDataset } from '../../../scripts/m13-adjudication/build-data'
import {
  EBM_GUIDELINE_CROSSWALK,
  PNPK_CROSSWALK,
  PPK_CROSSWALK,
} from '../../../scripts/m13-adjudication/config'
import { PACK } from '..'
import { NAMA_ICD } from '../icd10'

const ID = 'lab_luka_bakar_derajat2_dangkal'
const DATA = buildAdjudicationDataset('2026-07-27T00:00:00.000Z')

function record() {
  const item = DATA.cases.find((candidate) => candidate.id === ID)
  if (!item) throw new Error(`Adjudication record '${ID}' hilang`)
  return item
}

describe('M13-137 adjudication wave 26: luka bakar dangkal terbatas', () => {
  it('mengikat PPK, PNPK Luka Bakar, PNPK Trauma terkait, dan EBM mutakhir secara jujur', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.activationStatus).toBe('lab_prototype_unadjudicated')
    expect(PPK_CROSSWALK[ID]).toMatchObject({ entryIndex: 136, relation: 'direct' })
    expect(PNPK_CROSSWALK[ID]).toEqual([
      { slug: 'luka-bakar-2019', relation: 'direct' },
      expect.objectContaining({ slug: 'trauma', relation: 'related' }),
    ])
    expect(record().evidence.pnpk.status).toBe('cocok')
    expect(record().evidence.pnpk.sources.map((item) => [item.slug, item.relation])).toEqual([
      ['luka-bakar-2019', 'direct'],
      ['trauma', 'related'],
    ])
    expect(EBM_GUIDELINE_CROSSWALK[ID]?.map((item) => [item.sourceId, item.relation])).toEqual([
      ['aci-burn-management-2026', 'direct'],
      ['aba-burn-referral-2025', 'direct'],
      ['cdc-tetanus-wound-2025', 'related'],
    ])
    expect(record().evidence.ebm.status).toBe('cocok')
    expect(DATA.summary.pnpkDirect).toBe(27)
    expect(DATA.summary.ebmDirect).toBe(71)
  })

  it('memakai diagnosis anatomis spesifik tanpa menghilangkan kredit katalog generik', () => {
    expect(PACK.kasus[ID]).toMatchObject({
      nama: 'Luka Bakar Superficial Partial-Thickness Lengan Bawah, 2% TBSA',
      icd10: 'T22.2',
      skdi: '4A',
      fktp144: true,
      harusDirujuk: false,
    })
    expect(PACK.skdi144.find((item) => item.id === 'burn_grade12')).toMatchObject({
      icd10: 'T30',
      kasusId: ID,
    })
    expect(PACK.kasus[ID]?.diagnosisBanding).toEqual(['T22.2', 'T22.1', 'T22.3'])
    expect(NAMA_ICD['T22.1']).toMatch(/Derajat Satu.*Lengan/i)
    expect(NAMA_ICD['T22.2']).toMatch(/Derajat Dua.*Lengan/i)
    expect(NAMA_ICD['T22.3']).toMatch(/Derajat Tiga.*Lengan/i)
  })

  it('memulai pendinginan di triase dan menghapus TBSA yang ditanyakan kepada pasien', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.keluhanUtama).toMatch(/triase.*mengalirkan air sejuk/i)
    expect(kasus.anamnesis.find((item) => item.id === 'q_keluhan')?.jawab)
      .toMatch(/petugas langsung mulai mengalirkan air sejuk/i)
    expect(kasus.anamnesis.some((item) => item.id === 'q_luas')).toBe(false)
    expect(kasus.anamnesis.map((item) => `${item.tanya} ${item.jawab}`).join(' '))
      .not.toMatch(/dua telapak tangan pasien/i)
  })

  it('menutup domain anamnesis yang menentukan kedalaman, rujukan, dan keamanan rawat jalan', () => {
    const kasus = PACK.kasus[ID]!
    const ids = kasus.anamnesis.filter((item) => item.esensial).map((item) => item.id)
    expect(ids).toEqual(expect.arrayContaining([
      'q_pertolongan_awal',
      'q_lokasi_khusus',
      'q_mekanisme_risiko',
      'q_nyeri_fungsi',
      'q_risiko_penyembuhan',
      'q_tetanus',
      'q_keamanan_kontrol',
    ]))
    expect(kasus.anamnesis.find((item) => item.id === 'q_hamil')).toMatchObject({
      esensial: true,
      hanyaUntuk: 'P',
    })
    const teks = kasus.anamnesis.map((item) => `${item.tanya} ${item.jawab}`).join(' ')
    expect(teks).toMatch(/wajah.*sendi.*mengelilingi lengan/is)
    expect(teks).toMatch(/asap.*bahan kimia.*listrik.*cedera lain/is)
    expect(teks).toMatch(/mati rasa.*jari.*gerakkan/is)
    expect(teks).toMatch(/diabetes.*alergi obat/is)
    expect(teks).toMatch(/kembali dalam dua hari.*tanda bahaya/is)
  })

  it('mengukur TBSA dan kedalaman melalui pemeriksaan klinis, bukan bahasa pasien', () => {
    const kasus = PACK.kasus[ID]!
    const kulit = kasus.pemeriksaanFisik.find((item) => item.region === 'kulit')?.temuan ?? ''
    const ekstremitas = kasus.pemeriksaanFisik.find((item) => item.region === 'ekstremitas')?.temuan ?? ''
    expect(kulit).toMatch(/2% TBSA.*permukaan palmar tangan pasien termasuk jari/is)
    expect(kulit).toMatch(/merah muda-merah.*lembap.*sangat nyeri.*sensasi utuh.*kurang dari 2 detik/is)
    expect(kulit).toMatch(/blister utuh.*tidak tegang.*<=5 mm/is)
    expect(kulit).toMatch(/tidak ada area pucat.*kering.*leathery.*nekrotik/is)
    expect(ekstremitas).toMatch(/tidak sirkumferensial.*nadi radialis.*pengisian kapiler.*sensasi distal normal/is)
  })

  it('mengunci tata laksana minor-burn dan menolak cairan formula pada 2% TBSA', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.lab).toEqual([])
    expect(kasus.tatalaksana.obatBenar).toEqual(['paracetamol_500'])
    expect(kasus.tatalaksana.prosedur).toEqual(['pendinginan_luka_bakar', 'balut_luka_bakar'])
    expect(PACK.tindakan.pendinginan_luka_bakar?.nama)
      .toMatch(/total 20 menit.*tetap hangat/is)
    expect(PACK.tindakan.balut_luka_bakar?.nama)
      .toMatch(/Bersihkan lembut.*non\/low-adherent.*tanpa melingkar ketat/is)
    expect(kasus.tatalaksana.tindakanSalahUmum).toEqual([
      expect.objectContaining({
        id: 'resusitasi_cairan_kristaloid',
        bahaya: 'nonPrimer',
        alasan: expect.stringMatching(/2% TBSA.*tidak memerlukan.*Parkland/is),
      }),
    ])
  })

  it('membuat keputusan tetanus eksplisit dan tidak memberi profilaksis yang tak perlu', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.anamnesis.find((item) => item.id === 'q_tetanus')).toMatchObject({
      esensial: true,
      jawab: expect.stringMatching(/Lengkap.*tiga tahun lalu/is),
    })
    expect(kasus.tatalaksana.prosedur).not.toContain('profilaksis_tetanus')
    expect(kasus.clue).toMatch(/booster tiga tahun lalu.*tidak memerlukan vaksin atau TIG/is)
  })

  it('mengganti edukasi generik dengan first aid, perawatan balutan, dan safety-net operasional', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.tatalaksana.edukasi).toEqual([
      'pertolongan_luka_bakar',
      'perawatan_balutan_luka_bakar',
      'kontrol_luka_bakar',
    ])
    expect(kasus.tatalaksana.edukasiKritis).toEqual([
      'pertolongan_luka_bakar',
      'kontrol_luka_bakar',
    ])
    expect(PACK.edukasi.perawatan_balutan_luka_bakar?.nama)
      .toMatch(/balutan bersih.*jangan pecahkan blister.*terlalu ketat/is)
    expect(PACK.edukasi.kontrol_luka_bakar?.nama)
      .toMatch(/24-72 jam.*demam.*jari dingin.*balutan kotor-tembus/is)
  })

  it('menjaga konsekuensi dinamis tanpa mengarang infeksi sebagai kepastian', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.konsekuensi).toMatchObject({
      kembaliHariMin: 1,
      kembaliHariMax: 3,
    })
    expect(kasus.konsekuensi?.narasi).toMatch(/berubah kedalaman.*dapat terlambat dikenali/is)
    expect(kasus.konsekuensi?.narasi).not.toMatch(/pasti|akan bernanah/i)
    expect(kasus.konsekuensi?.kondisiKembali).toMatch(/lebih pucat.*balutan basah-kotor.*penilaian ulang/is)
  })

  it('menampilkan sumber klikabel dan graceful degradation tanpa resource yatim', () => {
    const kasus = PACK.kasus[ID]!
    expect(kasus.sumber?.map((item) => item.id)).toEqual([
      'pnpk_burn_2019',
      'ppk_fktp_2022',
      'aci_burn_2026',
      'aba_burn_referral',
      'cdc_tetanus_wound_2025',
    ])
    expect(kasus.sumber?.every((item) => item.url.startsWith('https://'))).toBe(true)
    expect(kasus.catatanRealita).toMatch(/Sukamaju.*balutan non\/low-adherent.*tidak diasumsikan selalu tersedia/is)
    expect(kasus.mutiaraEbm).toMatch(/Luas luka bukan satu-satunya.*24-72 jam.*10-12 hari/is)
    expect(record().evidence.aspak.unresolvedResourceIds).toEqual([])
    expect(DATA.summary.resourceTierCOrD).toBe(45)
    expect(DATA.summary.resourceGrounded).toBe(45)
    expect(DATA.summary.resourceUnresolved).toBe(0)
  })
})
