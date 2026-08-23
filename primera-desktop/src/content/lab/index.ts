import type { KasusKlinis } from '../types'
import type { LabArchetypeSpec } from './batch1'
import { LAB_BATCH_1_ARCHETYPE_SPECS, LAB_BATCH_1_CASES } from './batch1'
import { LAB_BATCH_2_ARCHETYPE_SPECS, LAB_BATCH_2_CASES } from './batch2'
import { LAB_BATCH_3_ARCHETYPE_SPECS, LAB_BATCH_3_CASES } from './batch3'
import { LAB_BATCH_4_BEDAH_ARCHETYPE_SPECS, LAB_BATCH_4_BEDAH_CASES } from './batch4Bedah'
import { LAB_BATCH_4_MTS_ARCHETYPE_SPECS, LAB_BATCH_4_MTS_CASES } from './batch4MataThtSaraf'
import { LAB_BATCH_4_DALAM_ARCHETYPE_SPECS, LAB_BATCH_4_DALAM_CASES } from './batch4Dalam'
import { LAB_BATCH_4_OA_ARCHETYPE_SPECS, LAB_BATCH_4_OA_CASES } from './batch4ObgynAnak'
import { LAB_ENRICHMENT, applyLabEnrichment } from './enrichment'

/**
 * Keputusan dokter yang sudah tercatat terminal pada
 * docs/M13_137_DECISION_LOG.md. Status ini tidak mengubah isolasi mode Karier,
 * tetapi membedakan kasus yang boleh menyumbang progres formal dari prototipe
 * yang masih dimainkan sebagai latihan formatif.
 */
export const PHYSICIAN_APPROVED_LAB_CASE_IDS = new Set<string>([
  'lab_gizi_buruk_komplikasi',
  'lab_mastoiditis_akut',
  'lab_bronkiolitis_berat',
  'lab_meningitis_bakterial_suspek',
  'lab_benda_asing_esofagus',
  'lab_tia_serangan_iskemik_sesaat',
  'lab_anafilaksis_makanan',
  'lab_perdarahan_gi_atas',
  'lab_pneumotoraks_spontan',
  'lab_tetanus_generalisata_awal',
  'lab_hiv_tanpa_komplikasi',
  'lab_gangguan_somatoform',
  'lab_benda_asing_konjungtiva',
  'lab_trauma_abdomen_tumpul',
  'lab_trauma_tumpul_kepala_ringan',
  'lab_luka_bakar_derajat2_dangkal',
])

/**
 * Audit UKM 2026-08-23 (delegasi bulk): dari 121 kasus lab yang belum
 * diadjudikasi dokter, dokter mengotorisasi Claude meninjau 74 kasus
 * "rutin" (non-taruhan-tinggi) sendiri — lihat AskUserQuestion & dossier
 * docs/ADJUDIKASI_MENUNGGU_DOKTER_2026-08-23.md. 47 kasus taruhan-tinggi (IGD,
 * obstetri, anak ≤5 tahun, obat jendela-terapi sempit) TIDAK disentuh dan
 * tetap menunggu peninjauan dokter langsung. Dari 74: 70 lolos tinjauan
 * (bersih atau dikoreksi lalu bersih) dan masuk daftar ini; 4 sisanya punya
 * pilihan kode/kebijakan yang genuinely butuh keputusan dokter, jadi TIDAK
 * dimasukkan (tetap `undefined`, setara prototipe belum diadjudikasi):
 * lab_alergi_makanan_ringan, lab_cacing_tambang, lab_vaginitis_kandida,
 * lab_dermatitis_numularis.
 *
 * PENTING: status ini SENGAJA bukan `physician_approved` — lihat komentar
 * pada `reviewStatus` di types.ts. Ini tinjauan AI terverifikasi-ganda
 * (review + sanggahan adversarial), bukan sign-off dokter.
 */
export const CLAUDE_REVIEWED_LAB_CASE_IDS = new Set<string>([
  'lab_abses_folikel_rambut',
  'lab_akne_vulgaris_ringan',
  'lab_anemia_defisiensi_besi_nonhamil',
  'lab_astigmatisme_ringan',
  'lab_blefaritis_anterior',
  'lab_buta_senja_defisiensi_vitamin_a',
  'lab_cutaneous_larva_migrans',
  'lab_defisiensi_mineral_zinc',
  'lab_defisiensi_vitamin_b_kompleks',
  'lab_dermatitis_atopik_ringan',
  'lab_dermatitis_kontak_iritan_tangan',
  'lab_dermatitis_perioral',
  'lab_dermatitis_seboroik_dewasa',
  'lab_ektima_tungkai',
  'lab_episkleritis_ringan',
  'lab_erisipelas_tungkai_ringan',
  'lab_eritrasma_lipat_paha',
  'lab_erupsi_obat_morbiliformis',
  'lab_filariasis_terkonfirmasi',
  'lab_folikulitis_superfisialis',
  'lab_furunkel_fluktuatif',
  'lab_furunkel_hidung',
  'lab_gonore_uretritis_pria',
  'lab_hepatitis_a_akut',
  'lab_herpes_simpleks_labialis',
  'lab_hidradenitis_supuratif_hurley1',
  'lab_hipermetropia',
  'lab_influenza_tanpa_komplikasi',
  'lab_intoleransi_makanan_laktosa',
  'lab_kandidiasis_mulut',
  'lab_keracunan_makanan_ringan',
  'lab_kusta_pausibasiler',
  'lab_laringitis_akut',
  'lab_leptospirosis_tanpa_komplikasi',
  'lab_limfadenitis_servikal_akut',
  'lab_lipoma_lengan',
  'lab_mabuk_perjalanan',
  'lab_mata_kering',
  'lab_miliaria_rubra',
  'lab_miopia_ringan',
  'lab_moluskum_kontagiosum_anak',
  'lab_parotitis_mumps',
  'lab_pedikulosis_pubis',
  'lab_perdarahan_subkonjungtiva',
  'lab_pertusis_remaja',
  'lab_pielonefritis_tanpa_komplikasi',
  'lab_pitiriasis_rosea',
  'lab_pitiriasis_versikolor',
  'lab_pneumonia_komunitas_dewasa',
  'lab_presbiopia',
  'lab_reaksi_gigitan_serangga',
  'lab_rinitis_vasomotor',
  'lab_salpingitis_pid_ringan',
  'lab_sifilis_primer',
  'lab_sindrom_duh_genital_servisitis',
  'lab_skistosomiasis_sulteng',
  'lab_stomatitis_aftosa',
  'lab_strongiloidiasis',
  'lab_taeniasis_intestinal',
  'lab_tinea_barbae',
  'lab_tinea_fasialis',
  'lab_tinea_kapitis_anak',
  'lab_tinea_kruris',
  'lab_tinea_manus',
  'lab_tinea_pedis',
  'lab_tinea_unguium_terkonfirmasi',
  'lab_trikiasis',
  'lab_ulkus_tungkai_vena',
  'lab_vaginosis_bakterialis',
  'lab_vulvitis_iritan',
])

/**
 * Kasus dasar dari tiga batch 4A + batch 4 tier-rujuk (M13 full-fledge), lalu
 * dilewatkan lapisan pengayaan interaktif (variasi persona / distraktor /
 * jebakan resep / konsekuensi — lihat enrichment.ts). Pengayaan aditif &
 * konservatif: kasus yang belum diberi entri pengayaan tetap identik dengan
 * bentuk dasarnya.
 */
export const LAB_ALL_CASES: KasusKlinis[] = [
  ...LAB_BATCH_1_CASES,
  ...LAB_BATCH_2_CASES,
  ...LAB_BATCH_3_CASES,
  ...LAB_BATCH_4_BEDAH_CASES,
  ...LAB_BATCH_4_MTS_CASES,
  ...LAB_BATCH_4_DALAM_CASES,
  ...LAB_BATCH_4_OA_CASES,
]
  .map((kasus) => applyLabEnrichment(kasus, LAB_ENRICHMENT[kasus.id]))
  .map((kasus) =>
    PHYSICIAN_APPROVED_LAB_CASE_IDS.has(kasus.id)
      ? { ...kasus, reviewStatus: 'physician_approved' as const }
      : CLAUDE_REVIEWED_LAB_CASE_IDS.has(kasus.id)
        ? { ...kasus, reviewStatus: 'claude_reviewed' as const }
        : kasus,
  )

export const LAB_ALL_ARCHETYPE_SPECS: Record<string, LabArchetypeSpec> = {
  ...LAB_BATCH_1_ARCHETYPE_SPECS,
  ...LAB_BATCH_2_ARCHETYPE_SPECS,
  ...LAB_BATCH_3_ARCHETYPE_SPECS,
  ...LAB_BATCH_4_BEDAH_ARCHETYPE_SPECS,
  ...LAB_BATCH_4_MTS_ARCHETYPE_SPECS,
  ...LAB_BATCH_4_DALAM_ARCHETYPE_SPECS,
  ...LAB_BATCH_4_OA_ARCHETYPE_SPECS,
}

/**
 * Tautan eksplisit menghindari salah-link saat dua entri katalog berbagi ICD-10
 * (misalnya vaginitis/BV, tinea kapitis/barbae, dan dua jenis trauma).
 */
export const LAB_CASE_ID_BY_FKTP_ITEM: Record<string, string> = {}

for (const [caseId, spec] of Object.entries(LAB_ALL_ARCHETYPE_SPECS)) {
  for (const credit of spec.credits) {
    if (!credit.startsWith('fktp144:')) continue
    const itemId = credit.slice('fktp144:'.length)
    const existing = LAB_CASE_ID_BY_FKTP_ITEM[itemId]
    if (existing && existing !== caseId) {
      throw new Error(`Item FKTP '${itemId}' ditautkan ke dua kasus lab: ${existing}, ${caseId}`)
    }
    LAB_CASE_ID_BY_FKTP_ITEM[itemId] = caseId
  }
}
