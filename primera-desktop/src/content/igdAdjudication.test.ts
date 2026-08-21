import { describe, expect, it } from 'vitest'
import { PACK } from '.'
import { IGD_ADJUDICATED_IDS } from './igdAdjudication'
import { KASUS_IGD_LAB_1 } from './igdLab1'
import { KASUS_IGD_LAB_2 } from './igdLab2'
import {
  CONTENT_RELEASE,
  CONTENT_RELEASE_ORDER,
  IGD_ADJUDICATION_CONTENT_RELEASE,
  ANSWER_KEY_SWEEP_CONTENT_RELEASE,
  DELEGATED_ADJUDICATION_CONTENT_RELEASE,
  encounterArchetypeAktif,
} from './pack'

function teksKasus(id: string): string {
  const kasus = PACK.kasusIgd[id]!
  return [
    kasus.nama,
    kasus.pembuka,
    kasus.clue,
    kasus.panduanResmi,
    ...kasus.langkah.flatMap((step) => [
      step.narasi,
      ...step.pilihan.flatMap((pilihan) => [pilihan.label, pilihan.respons]),
    ]),
  ].join(' ')
}

function teksJawabanBenar(id: string): string {
  return PACK.kasusIgd[id]!.langkah
    .flatMap((step) => step.pilihan.filter((pilihan) => pilihan.benar))
    .flatMap((pilihan) => [pilihan.label, pilihan.respons])
    .join(' ')
}

describe('M13-14 - aktivasi IGD pasca-adjudikasi dokter', () => {
  it('mengaktifkan tepat 14 kasus teradjudikasi dan menghapus status prototipe lama', () => {
    const approved = Object.values(PACK.kasusIgd)
      .filter((kasus) => kasus.reviewStatus === 'physician_approved')
      .map((kasus) => kasus.id)
      .sort()
    expect(approved).toEqual(IGD_ADJUDICATED_IDS)
    expect(approved).toHaveLength(14)
    expect(Object.values(PACK.kasusIgd).filter((kasus) => kasus.activationStatus)).toHaveLength(0)
    expect(CONTENT_RELEASE_ORDER).toContain(IGD_ADJUDICATION_CONTENT_RELEASE)
    // Adjudikasi-delegasi 2026-08-21: rilis aktif naik dari answer-key-sweep
    // karena lima keputusan adjudikasi mengubah kunci jawaban (lihat pack.ts).
    expect(CONTENT_RELEASE).toBe(DELEGATED_ADJUDICATION_CONTENT_RELEASE)
    expect(CONTENT_RELEASE_ORDER).toContain(ANSWER_KEY_SWEEP_CONTENT_RELEASE)
    expect(CONTENT_RELEASE_ORDER.at(-1)).toBe(DELEGATED_ADJUDICATION_CONTENT_RELEASE)
  })

  it('tidak mengubah id pilihan, kunci benar, atau efek stabilitas dari prototipe yang direview', () => {
    const drafts = [...KASUS_IGD_LAB_1, ...KASUS_IGD_LAB_2]
    for (const draft of drafts) {
      const active = PACK.kasusIgd[draft.id]!
      const scoringShape = (kasus: typeof draft) => kasus.langkah.map((step) => ({
        id: step.id,
        pilihan: step.pilihan.map((choice) => ({
          id: choice.id,
          benar: choice.benar,
          efekStabilitas: choice.efekStabilitas,
        })),
      }))
      expect(scoringShape(active), draft.id).toEqual(scoringShape(draft))
    }
  })

  it('menjaga 14 kasus di Karier dan tidak membocorkannya ke pool Ujian', () => {
    for (const id of IGD_ADJUDICATED_IDS) {
      expect(encounterArchetypeAktif(PACK, 'igd', id, 'karier', CONTENT_RELEASE), id).toBe(true)
      expect(encounterArchetypeAktif(PACK, 'igd', id, 'ujian', CONTENT_RELEASE), id).toBe(false)
    }
    const baseline = Object.values(PACK.kasusIgd).filter((kasus) => kasus.reviewStatus === undefined)
    expect(baseline).toHaveLength(6)
    for (const kasus of baseline) {
      expect(encounterArchetypeAktif(PACK, 'igd', kasus.id, 'karier', CONTENT_RELEASE), kasus.id).toBe(true)
    }
    expect(
      baseline.filter((kasus) => encounterArchetypeAktif(PACK, 'igd', kasus.id, 'ujian', CONTENT_RELEASE)),
    ).toHaveLength(5)
    expect(encounterArchetypeAktif(PACK, 'igd', 'igd_stemi_anterior_hipoksemik', 'ujian', CONTENT_RELEASE)).toBe(false)
  })

  // Audit CODEX beta.16 (2026-08-06): invariant ini dulu HANYA melintasi 14
  // kasus teradjudikasi, sehingga enam kasus baseline boleh kosong tanpa ada
  // yang memerah. Diukur per mode, akibatnya paling tajam justru di mode yang
  // DINILAI: pool Ujian 5 dari 5 kasus tanpa debrief — nol persen berdebrief.
  // Panel "Yang Perlu Menetap" memang dibuka pemain ujian dan memang kosong.
  // Kini berlaku untuk SELURUH kasus IGD.
  // Pengecualian `igd_stemi_anterior_hipoksemik` DICABUT 2026-08-06. Kasus itu
  // terikat amplop tanda tangan dokter di m13_1a, sehingga menambah debrief
  // sempat memerahkan gerbang aktivasi — dan itu memang gunanya. dr. Wirayuda
  // menyegel ulang slice-nya, jadi kini SELURUH 20 kasus IGD wajib berdebrief
  // tanpa kecuali. Bila kelak ada kasus baru yang terikat amplop, jalurnya
  // sama: tunggu penyegelan ulang, jangan melonggarkan invariant ini.
  it('setiap kasus IGD membawa debrief FKTP, kontinuitas, dan bridge UKM yang utuh', () => {
    for (const id of Object.keys(PACK.kasusIgd)) {
      const debrief = PACK.kasusIgd[id]!.debrief
      expect(debrief, id).toBeDefined()
      expect(debrief!.poinKunci.length, id).toBeGreaterThanOrEqual(3)
      expect(debrief!.poinKunci.length, id).toBeLessThanOrEqual(4)
      // Teks poin sempat dipakai sebagai kunci daftar di renderer; duplikat
      // membuat React membuang salah satunya diam-diam. Kuncinya sudah diganti
      // indeks, tapi dua poin berbunyi sama tetap cacat penulisan.
      expect(new Set(debrief!.poinKunci).size, id).toBe(debrief!.poinKunci.length)
      expect(debrief!.realitaFktp.length, id).toBeGreaterThan(80)
      expect(debrief!.sumberDaya.ready.length, id).toBeGreaterThan(0)
      expect(debrief!.sumberDaya.melaluiJejaring.length, id).toBeGreaterThan(0)
      expect(debrief!.kontinuitas.length, id).toBeGreaterThan(60)
      expect(debrief!.bridgeUkm.judul.length, id).toBeGreaterThan(3)
      expect(debrief!.bridgeUkm.ringkasan.length, id).toBeGreaterThan(60)
    }
  })

  /**
   * Kedalaman sitasi sengaja MASIH dibatasi ke 14 kasus teradjudikasi.
   *
   * Diukur 2026-08-06: enam kasus baseline rata-rata 2,17 rujukan versus 4,64
   * pada yang teradjudikasi. Tetapi angka itu menyesatkan bila dibaca sebagai
   * "kurang berdasar" — SETIAP kasus baseline sudah punya satu sumber
   * internasional bercakupan 'langsung' yang kuat: RCUK anafilaksis 2025, GINA
   * 2026, ADA hipoglikemia 2026, WHO arboviral 2025, IDAI kejang demam, dan
   * ACC/AHA sindrom koroner akut 2025. Yang kurang KEDALAMANNYA, bukan
   * dasarnya.
   *
   * Percobaan menambah, dan kenapa berhenti: pencarian pedoman profesi
   * Indonesia untuk melengkapi sisi nasional (PDPI asma, PERKENI hipoglikemia)
   * hanya menemukan katalog perpustakaan dan salinan pihak ketiga
   * (Scribd/Slideshare) — persis jebakan yang membuat tautan MTBS diare mati
   * dan harus diperbaiki dua kali. PNPK IDAI dengue anak-remaja (idai.or.id,
   * hidup, populasi 8-17 cocok persis dengan kasus DSS ini) adalah kandidat
   * terkuat, TETAPI hanya halaman mukanya yang bisa dibaca; isi pedomannya
   * tidak. Aturan proyek ini melarang menyitir dokumen yang tak dibaca
   * sendiri, dan aturan itu tidak dilonggarkan hanya karena kandidatnya
   * menarik. Menunggu berkas yang benar-benar bisa dibuka.
   */
  it('kasus teradjudikasi membawa minimal tiga sumber', () => {
    for (const id of IGD_ADJUDICATED_IDS) {
      expect(PACK.kasusIgd[id]!.sumber.length, id).toBeGreaterThanOrEqual(3)
    }
  })

  it('mengunci koreksi klinis material IGD-1 sampai IGD-7', () => {
    expect(teksJawabanBenar('igd_asfiksia_neonatorum')).toMatch(/30-60.*menit/i)
    expect(teksJawabanBenar('igd_asfiksia_neonatorum')).toMatch(/udara ruangan/i)
    expect(teksKasus('igd_cedera_kepala_sedang')).toMatch(/GCS 9-12/i)
    expect(teksJawabanBenar('igd_cedera_kepala_sedang')).not.toMatch(/monitor tekanan intrakranial termurah/i)
    expect(teksJawabanBenar('igd_eklampsia')).toMatch(/10 mL.*40%.*10 mL/i)
    expect(teksJawabanBenar('igd_gigitan_ular_berbisa')).toMatch(/jangan lepas/i)
    expect(teksJawabanBenar('igd_gigitan_ular_berbisa')).toMatch(/resusitasi.*adrenalin.*monitor/i)
    expect(teksJawabanBenar('igd_keracunan_organofosfat')).toMatch(/1-2 mg/i)
    expect(teksJawabanBenar('igd_keracunan_organofosfat')).not.toMatch(/paru yang kering|satu ampul/i)
    expect(PACK.kasusIgd.igd_ketoasidosis_diabetik?.nama).toMatch(/^Suspek /)
    expect(teksJawabanBenar('igd_ketoasidosis_diabetik')).not.toMatch(/insulin menarik air/i)
    expect(teksJawabanBenar('igd_luka_bakar_luas')).toMatch(/2 mL\/kg\/%/i)
    expect(teksJawabanBenar('igd_luka_bakar_luas')).not.toMatch(/4 mL\/kg\/%|harus dikejar/i)
  })

  it('mengunci koreksi klinis material IGD-8 sampai IGD-14', () => {
    expect(teksKasus('igd_perdarahan_pascasalin')).toMatch(/kesalahan pilihan ini adalah menunggu 15 menit/i)
    expect(teksJawabanBenar('igd_pneumotoraks_tension_trauma')).not.toMatch(/desis.*mengonfirmasi/i)
    expect(PACK.kasusIgd.igd_status_epileptikus?.demografi.usiaMin).toBe(18)
    expect(teksJawabanBenar('igd_status_epileptikus')).toMatch(/glukosa|GDS/i)
    expect(PACK.kasusIgd.igd_stroke_iskemik_window?.icd10).toBe('I64')
    expect(PACK.kasusIgd.igd_stroke_iskemik_window?.nama).toMatch(/^Suspek /)
    expect(teksJawabanBenar('igd_stroke_iskemik_window')).toMatch(/jangan menyebut semua hipertensi akut kompensatoris/i)
    expect(teksJawabanBenar('igd_stroke_iskemik_window')).toMatch(/setiap penurunan memadamkan penumbra/i)
    expect(PACK.kasusIgd.igd_sumbatan_jalan_napas_anak?.demografi.usiaMin).toBe(3)
    expect(teksKasus('igd_sumbatan_jalan_napas_anak')).toMatch(/FBAO berat/i)
    expect(teksJawabanBenar('igd_syok_sepsis')).toMatch(/seftriakson 2 g IV/i)
    expect(teksJawabanBenar('igd_syok_sepsis')).toMatch(/tidak membuktikan pasien pasti membutuhkan vasopresor/i)
    expect(PACK.kasusIgd.igd_tenggelam?.demografi.usiaMin).toBe(22)
    expect(teksJawabanBenar('igd_tenggelam')).toMatch(/bukan mitos secondary drowning/i)
  })
})
