import { describe, expect, it } from 'vitest'
import { PACK } from '.'
import { KASUS_IGD_LAB_1 } from './igdLab1'
import { KASUS_IGD_LAB_2 } from './igdLab2'

/**
 * Surat hasil IGD memuat `kasus.clue`, dan panel BuktiKlinis pada surat yang
 * SAMA dirender dari `kasus.sumber`. Jadi setiap dokumen yang disebut clue
 * harus dapat ditemukan pemain di panel itu juga — label LANGSUNG/TERKAIT
 * memang mengundang mahasiswa memverifikasi sitasi.
 *
 * Cakupan sengaja dibatasi pada dua batch lab: lima kasus baseline `igd.ts`
 * memakai kumpulan sumber lain dan sitasinya dikunci test tersendiri.
 */
const KASUS_LAB = [...KASUS_IGD_LAB_1, ...KASUS_IGD_LAB_2].map(({ id }) => PACK.kasusIgd[id]!)

/** Nomor peraturan Indonesia: 1186/2022, 555/2019, 304/2026, 91/2017, ... */
const NOMOR_REGULASI = /\b\d{1,4}\/(?:19|20)\d{2}\b/g

/**
 * Penanda dokumen yang pernah atau kini muncul di clue batch ini. Aturannya
 * dinamis: penanda hanya boleh dipakai clue bila panel kasus itu benar-benar
 * memuatnya, sehingga menambah entri registry yang sah otomatis membuka
 * kembali pemakaiannya tanpa harus menyunting daftar ini.
 */
const PENANDA_DOKUMEN = [
  'PERDOSSI',
  'Perinasia',
  'POGI',
  'PAPDI',
  'MTBS',
  'EMSB',
  'ATLS',
  'PPGD',
  'Buku Saku',
  'Focused Update on Drowning',
  'CPR/ECC',
  'PERKENI',
  'IDAI',
  'ILAE',
  'ANZCOR',
  'Wilderness Medical Society',
  'Queensland',
  'PNPK Tata Laksana Epilepsi Dewasa',
  'PNPK Tata Laksana Luka Bakar',
  'PNPK Tata Laksana Stroke',
  'PNPK Tata Laksana Trauma',
  'PNPK Tata Laksana Komplikasi Kehamilan',
  'Antiseizure Medicines',
  'Neonatal Resuscitation Guidelines',
  'Pediatric Basic Life Support',
  'Special Circumstances of Resuscitation',
  'Guideline for Acute Ischemic Stroke',
  'Postpartum Haemorrhage Guideline',
  'Implementation Guide',
  'International Consensus Report',
  'Standards of Care',
  'Pre-eclampsia Fact Sheet',
  'Pesticide Intoxication',
] as const

/** Sitasi yang menopang ajaran clue dan tidak boleh hilang diam-diam. */
const SITASI_WAJIB: Record<string, readonly RegExp[]> = {
  igd_status_epileptikus: [/PNPK Tata Laksana Epilepsi Dewasa 2026/, /ILAE/, /Antiseizure Medicines/],
  igd_luka_bakar_luas: [/PNPK Tata Laksana Luka Bakar KMK 555\/2019/],
  igd_ketoasidosis_diabetik: [/PERKENI/, /International Consensus Report 2024/],
  igd_stroke_iskemik_window: [/KMK 304\/2026/, /AHA\/ASA/],
  igd_perdarahan_pascasalin: [/KMK 91\/2017/, /WHO\/FIGO\/ICM/],
  igd_asfiksia_neonatorum: [/IDAI/, /Neonatal Resuscitation Guidelines 2025/],
  igd_tenggelam: [/Wilderness Medical Society Drowning Guideline 2024/, /Special Circumstances of Resuscitation 2025/],
  igd_eklampsia: [/Pre-eclampsia Fact Sheet/],
  igd_pneumotoraks_tension_trauma: [/PNPK Tata Laksana Trauma KMK 132\/2017/],
}

/**
 * Clue adalah salinan doktrin yang mudah tertinggal saat kunci diadjudikasi
 * ulang: `terapkanAdjudikasiIgd` menambal langkah dan debrief, tetapi tidak
 * menyentuh clue. Ketiga kasus ini pernah mengirim doktrin lama ke pemain
 * bersama kunci barunya di surat yang sama.
 */
const SELARAS_KUNCI = [
  {
    id: 'igd_gigitan_ular_berbisa',
    doktrinLama: /lepaskan torniket yang sudah terpasang setelah akses IV/i,
    penanda: [/mendadak/i, /terkontrol/i, /antivenom/i],
  },
  {
    id: 'igd_keracunan_organofosfat',
    doktrinLama: /sampai sekret bronkus mengering|paru yang kering/i,
    penanda: [/bronkorea/i, /perfusi/i],
  },
  {
    id: 'igd_eklampsia',
    doktrinLama: /lanjutkan rumatan selama rujukan\./i,
    penanda: [/rumatan/i, /hanya bila/i],
  },
] as const

/** "bidai" bukan sitasi IDAI: penanda dicocokkan sebagai kata utuh. */
function menyebut(teks: string, penanda: string): boolean {
  return new RegExp(`\\b${penanda.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(teks)
}

function panelKasus(id: string): string {
  return PACK.kasusIgd[id]!.sumber.map((sumber) => `${sumber.label} ${sumber.url}`).join(' ')
}

function teksJawabanBenar(id: string): string {
  return PACK.kasusIgd[id]!.langkah
    .flatMap((step) => step.pilihan.filter((pilihan) => pilihan.benar))
    .flatMap((pilihan) => [pilihan.label, pilihan.respons])
    .join(' ')
}

describe('clue IGD lab selaras dengan panel bukti dan kunci dokter', () => {
  it('tidak menyitir nomor peraturan yang absen dari panel bukti kasusnya', () => {
    const menggantung = KASUS_LAB.flatMap((kasus) => {
      const panel = panelKasus(kasus.id)
      return [...(kasus.clue.match(NOMOR_REGULASI) ?? [])]
        .filter((nomor) => !panel.includes(nomor))
        .map((nomor) => `${kasus.id}: ${nomor}`)
    })
    expect(menggantung).toEqual([])
  })

  it('tidak menyebut dokumen yang tidak dapat dibuka pemain di panel kasus itu', () => {
    const menggantung = KASUS_LAB.flatMap((kasus) => {
      const panel = panelKasus(kasus.id)
      return PENANDA_DOKUMEN.filter(
        (penanda) => menyebut(kasus.clue, penanda) && !menyebut(panel, penanda),
      ).map((penanda) => `${kasus.id}: ${penanda}`)
    })
    expect(menggantung).toEqual([])
  })

  it('tetap menamai sumber panel yang menopang ajaran clue', () => {
    for (const [id, pola] of Object.entries(SITASI_WAJIB)) {
      for (const satu of pola) expect(PACK.kasusIgd[id]!.clue, id).toMatch(satu)
    }
  })

  it('clue tidak lagi mengajarkan doktrin yang sudah dibalik adjudikasi dokter', () => {
    for (const { id, doktrinLama, penanda } of SELARAS_KUNCI) {
      const clue = PACK.kasusIgd[id]!.clue
      const kunci = teksJawabanBenar(id)
      expect(clue, id).not.toMatch(doktrinLama)
      expect(kunci, id).not.toMatch(doktrinLama)
      for (const satu of penanda) {
        expect(kunci, `${id}: kunci`).toMatch(satu)
        expect(clue, `${id}: clue`).toMatch(satu)
      }
    }
  })
})
