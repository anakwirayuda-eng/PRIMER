import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { ContentPack } from '@content/pack'
import { validasiPack } from '@content/pack'
import { buatEncounter, nilaiEncounter } from './clinic'
import { Rng } from './core/rng'
import { buatPasienDariKasus } from './director'

function encounter(kasusId: string, resep: string[] = [], tindakan: string[] = []) {
  const pasien = buatPasienDariKasus(
    kasusId,
    PACK,
    new Rng(20260718, 'ebm-currency', kasusId),
  )
  return { ...buatEncounter(pasien), resep, tindakan }
}

describe('EBM currency 2026 - keputusan klinis dan mekanik selaras', () => {
  it('gout: allopurinol opsional tidak dihukum, tetapi tidak menggantikan antiinflamasi flare', () => {
    const gout = PACK.kasus.mm_gout_artritis_akut!

    expect(gout.tatalaksana.obatOpsional).toContain('allopurinol_100')
    expect(gout.tatalaksana.obatSalahUmum?.map((item) => item.id)).not.toContain(
      'allopurinol_100',
    )

    const antiinflamasi = nilaiEncounter(
      encounter(gout.id, ['kolkisin_500']),
      gout,
      PACK,
    )
    const antiinflamasiPlusUlt = nilaiEncounter(
      encounter(gout.id, ['kolkisin_500', 'allopurinol_100']),
      gout,
      PACK,
    )
    const ultSaja = nilaiEncounter(encounter(gout.id, ['allopurinol_100']), gout, PACK)

    expect(antiinflamasiPlusUlt.skorTerapi).toBe(antiinflamasi.skorTerapi)
    expect(ultSaja.skorTerapi).toBeLessThan(antiinflamasi.skorTerapi)
    expect(`${gout.clue}\n${gout.panduanResmi}`).not.toMatch(
      /jangan mulai allopurinol|memperpanjang serangan/i,
    )
  })

  it('CHF SpO2 92%: oksigen sah tetapi bukan denominator atau gerbang skor', () => {
    const chf = PACK.kasus.mm_gagal_jantung_kongestif!
    const resepAman = ['furosemid_40']

    expect(chf.tatalaksana.prosedur).toContain('posisi_semifowler')
    expect(chf.tatalaksana.prosedur).not.toContain('oksigen')
    expect(chf.tatalaksana.prosedurOpsional).toEqual(['oksigen'])
    expect(chf.stabilisasiWajib).toBeUndefined()

    const tanpaOksigen = nilaiEncounter(
      encounter(chf.id, resepAman, ['posisi_semifowler']),
      chf,
      PACK,
    )
    const denganOksigen = nilaiEncounter(
      encounter(chf.id, resepAman, ['posisi_semifowler', 'oksigen']),
      chf,
      PACK,
    )

    expect(denganOksigen.skorTerapi).toBe(tanpaOksigen.skorTerapi)
  })

  it('common cold dan bronkitis tidak lagi menghadiahi mukolitik rutin', () => {
    const commonCold = PACK.kasus.ispa_common_cold!
    const bronkitis = PACK.kasus.bronkitis_akut!

    expect(commonCold.tatalaksana.obatOpsional ?? []).not.toContain('ambroxol_30')
    expect(commonCold.tatalaksana.obatSalahUmum?.map((item) => item.id)).toContain('ambroxol_30')
    expect(bronkitis.tatalaksana.obatBenar).not.toContain('ambroxol_30')

    const simptomatik = nilaiEncounter(
      encounter(bronkitis.id, ['paracetamol_500']),
      bronkitis,
      PACK,
    )
    const plusMukolitik = nilaiEncounter(
      encounter(bronkitis.id, ['paracetamol_500', 'ambroxol_30']),
      bronkitis,
      PACK,
    )
    expect(plusMukolitik.skorTerapi).toBeLessThan(simptomatik.skorTerapi)
  })

  it('BPPV menilai reposisi kanalit, bukan mewajibkan betahistin', () => {
    const bppv = PACK.kasus.saraf_vertigo_bppv!
    expect(bppv.tatalaksana.obatBenar).toEqual([])
    expect(bppv.tatalaksana.obatOpsional).toEqual(['betahistin_6'])
    expect(bppv.tatalaksana.prosedur).toContain('manuver_epley')

    const epley = nilaiEncounter(encounter(bppv.id, [], ['manuver_epley']), bppv, PACK)
    const epleyPlusObat = nilaiEncounter(
      encounter(bppv.id, ['betahistin_6'], ['manuver_epley']),
      bppv,
      PACK,
    )
    expect(epleyPlusObat.skorTerapi).toBe(epley.skorTerapi)
  })

  it('epistaksis menilai kompresi sebagai langkah awal dan tampon sebagai eskalasi opsional', () => {
    const epistaksis = PACK.kasus.tht_epistaksis_anterior!
    expect(epistaksis.tatalaksana.prosedur).toEqual(['kompresi_hidung'])
    expect(epistaksis.tatalaksana.prosedurOpsional).toEqual(['tampon_epistaksis'])

    const kompresi = nilaiEncounter(
      encounter(epistaksis.id, ['oksimetazolin_spray'], ['kompresi_hidung']),
      epistaksis,
      PACK,
    )
    const kompresiPlusTampon = nilaiEncounter(
      encounter(
        epistaksis.id,
        ['oksimetazolin_spray'],
        ['kompresi_hidung', 'tampon_epistaksis'],
      ),
      epistaksis,
      PACK,
    )
    const langsungTampon = nilaiEncounter(
      encounter(epistaksis.id, ['oksimetazolin_spray'], ['tampon_epistaksis']),
      epistaksis,
      PACK,
    )

    expect(kompresiPlusTampon.skorTerapi).toBe(kompresi.skorTerapi)
    expect(langsungTampon.skorTerapi).toBeLessThan(kompresi.skorTerapi)
  })

  it('LBP tidak menerima parasetamol tunggal sebagai padanan NSAID', () => {
    const lbp = PACK.kasus.mm_low_back_pain!
    const nsaid = nilaiEncounter(encounter(lbp.id, ['natrium_diklofenak_50']), lbp, PACK)
    const parasetamol = nilaiEncounter(encounter(lbp.id, ['paracetamol_500']), lbp, PACK)

    expect(lbp.tatalaksana.obatBenar).toEqual(['natrium_diklofenak_50'])
    expect(parasetamol.skorTerapi).toBeLessThan(nsaid.skorTerapi)
  })

  it('sistitis kehamilan menghindari amoksisilin empiris dan memakai kode diagnosis yang tepat', () => {
    const isk = PACK.kasus.kia_isk_kehamilan!
    const nitrofurantoin = nilaiEncounter(
      encounter(isk.id, ['paracetamol_500', 'nitrofurantoin_100']),
      isk,
      PACK,
    )
    const amoksisilin = nilaiEncounter(
      encounter(isk.id, ['paracetamol_500', 'amoxicillin_500']),
      isk,
      PACK,
    )

    expect(isk.tatalaksana.obatAlternatif).toEqual([
      ['nitrofurantoin_100', 'cefixime_100'],
    ])
    expect(amoksisilin.skorTerapi).toBeLessThan(nitrofurantoin.skorTerapi)
    expect(isk.panduanResmi).toMatch(/kultur.*5–7 hari.*amoksisilin\/ampisilin/is)
  })

  it('validator menolak tindakan yang sekaligus wajib dan opsional', () => {
    const chf = PACK.kasus.mm_gagal_jantung_kongestif!
    const rusak: ContentPack = {
      ...PACK,
      kasus: {
        ...PACK.kasus,
        [chf.id]: {
          ...chf,
          tatalaksana: {
            ...chf.tatalaksana,
            prosedur: ['posisi_semifowler', 'oksigen'],
            prosedurOpsional: ['oksigen'],
          },
        },
      },
    }

    expect(validasiPack(rusak)).toContain(
      `Kasus ${chf.id}: tindakan 'oksigen' sekaligus wajib dan opsional`,
    )
  })
})

describe('EBM currency 2026 - sumber display yang mengubah keputusan', () => {
  it('semua kasus poli memiliki floor sumber yang dapat dibaca ulang', () => {
    const tanpaPanduan = Object.values(PACK.kasus)
      .filter((kasus) => !kasus.panduanResmi?.trim())
      .map((kasus) => kasus.id)

    expect(tanpaPanduan).toEqual([])
  })

  it('gap provenance berisiko tinggi menyebut sumber aktif dan batas kewenangan', () => {
    expect(PACK.kasus.mm_hipertensi_urgensi?.icd10).toBe('I16.0')
    expect(PACK.kasus.mm_hipertensi_urgensi?.panduanResmi).toMatch(/303\/2026/)
    expect(PACK.kasus.kia_kb_konseling?.panduanResmi).toMatch(/Permenkes 2\/2025.*WHO MEC.*2025/is)
    expect(PACK.kasus.jiwa_depresi_ringan?.panduanResmi).toMatch(/mhGAP.*2023/is)
    expect(PACK.kasus.lab_bronkiolitis_berat?.panduanResmi).toMatch(/NICE NG9/)
    expect(PACK.kasus.lab_efusi_pleura?.panduanResmi).toMatch(/BTS.*2023.*2026/is)
    expect(PACK.kasus.lab_taeniasis_intestinal?.panduanResmi).toMatch(/WHO 2021\/2023/)
  })

  it('dispepsia fungsional memenuhi kronisitas, bukan vignette satu bulan', () => {
    const dispepsia = PACK.kasus.dispepsia_fungsional!
    const durasi = dispepsia.anamnesis.find((item) => item.id === 'q_durasi')
    expect(dispepsia.keluhanUtama).toMatch(/lebih dari enam bulan/i)
    expect(durasi?.jawab).toMatch(/tujuh bulan.*tiga bulan terakhir/is)
    expect(dispepsia.clue).toMatch(/3 bulan.*6 bulan/is)
  })

  it('asma dan PPOK menunjuk strategi aktif 2026', () => {
    expect(`${PACK.kasus.asma_ringan?.clue}\n${PACK.kasus.asma_ringan?.panduanResmi}`).toMatch(
      /GINA 2026/,
    )
    expect(`${PACK.kasus.ppok_eksaserbasi?.clue}\n${PACK.kasus.ppok_eksaserbasi?.panduanResmi}`).toMatch(
      /GOLD 2026/,
    )
  })

  it('hipertensi dan anemia tidak kembali ke sitasi/dosis lama yang kontradiktif', () => {
    const hipertensi = PACK.kasus.hipertensi_esensial!
    const anemia = PACK.kasus.anemia_defisiensi_bumil!

    expect(hipertensi.konsekuensi?.guideline).toMatch(/303\/2026/)
    expect(hipertensi.konsekuensi?.guideline).not.toMatch(/JNC-8|5\/2014/)
    expect(anemia.clue).toMatch(/PPK.*180 mg\/hari/is)
    expect(anemia.clue).toMatch(/WHO.*120 mg\/hari/is)
    expect(anemia.panduanResmi).toMatch(/PMK 6\/2024.*180 tablet/is)
  })

  it('ANC, dengue, dan kegawatdaruratan memakai sumber mutakhir tanpa memalsukan angka lama', () => {
    const anc = PACK.kasus.kia_anc_kehamilan_normal!
    const dengue = PACK.kasus.dengue_df!
    const dss = PACK.kasusIgd.igd_dengue_syok!
    const dka = PACK.kasusIgd.igd_ketoasidosis_diabetik!
    const stroke = PACK.kasusIgd.igd_stroke_iskemik_window!
    const pph = PACK.kasusIgd.igd_perdarahan_pascasalin!

    expect(anc.clue).toMatch(/PMK 6\/2024.*6 kunjungan.*180 tablet/is)
    expect(dengue.clue).toMatch(/WHO Arboviral Clinical Management 2025/)
    expect(dss.clue).toMatch(/WHO Dengue 2009.*WHO Arboviral Clinical Management 2025/is)
    expect(dka.clue).toMatch(/Consensus Report.*2024/i)
    expect(stroke.clue).toMatch(/KMK 304\/2026.*AHA\/ASA.*2026/is)
    expect(pph.clue).toMatch(/WHO\/FIGO\/ICM.*2025.*Implementation Guide 2026/is)
  })

  it('prototipe neurologi, malnutrisi, tenggelam, dan FBAO menyebut guideline aktif', () => {
    const tia = PACK.kasus.lab_tia_serangan_iskemik_sesaat!
    const meningitis = PACK.kasus.lab_meningitis_bakterial_suspek!
    const gizi = PACK.kasus.lab_gizi_buruk_komplikasi!
    const tenggelam = PACK.kasusIgd.igd_tenggelam!
    const fbao = PACK.kasusIgd.igd_sumbatan_jalan_napas_anak!

    expect(tia.panduanResmi).toMatch(/304\/2026.*AHA 2023/is)
    expect(meningitis.panduanResmi).toMatch(/WHO Guidelines on Meningitis 2025/)
    expect(gizi.panduanResmi).toMatch(/WHO.*2023.*menggantikan.*2013/is)
    expect(tenggelam.clue).toMatch(/Focused Update on Drowning 2024.*CPR\/ECC 2025/is)
    expect(fbao.clue).toMatch(/Pediatric Basic Life Support 2025/)
  })

  it('menghapus regimen TB intermiten lama dan menjaga fallback BTA yang bertanggung jawab', () => {
    const tb = PACK.kasus.tb_paru
    expect(tb).toBeTruthy()
    const debrief = `${tb?.clue}\n${tb?.mutiaraEbm}\n${tb?.panduanResmi}\n${tb?.konsekuensi?.guideline}`
    expect(debrief).toMatch(/HK\.02\.02\/C\/5401\/2025/)
    expect(debrief).toMatch(/2HRZE\/4HR/)
    expect(debrief).toMatch(/molekuler.*resistansi/is)
    expect(debrief).not.toMatch(/4H3R3|dosis tiga kali seminggu/i)
  })
})
