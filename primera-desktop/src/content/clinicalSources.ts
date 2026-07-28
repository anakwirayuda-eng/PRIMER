import type { KasusKlinis, SumberKlinis } from './types'
import { SUMBER_IGD } from './igdSources'

const PNPK_HT_2026: SumberKlinis = {
  id: 'pnpk_hipertensi_2026',
  label: 'KMK 303/2026 - PNPK Hipertensi pada Dewasa',
  url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan1780387327_362636.pdf',
  tahun: 2026,
  jenis: 'pedoman_indonesia',
}

const PNPK_DM2_2026: SumberKlinis = {
  id: 'pnpk_dm2_2026',
  label: 'KMK 302/2026 - PNPK Diabetes Melitus Tipe 2 Dewasa',
  url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan1777518085_672976.pdf',
  tahun: 2026,
  jenis: 'pedoman_indonesia',
}

const MTBS_DIARE_KEMENKES: SumberKlinis = {
  id: 'kemenkes_mtbs_diare',
  label: 'Kemenkes - MTBS: Rencana Terapi A, B, dan C pada Diare Anak',
  url: 'https://keslan.kemkes.go.id/view_artikel/737/diare-tanda-gejala-dan-cara-mengatasinya',
  tahun: 2022,
  jenis: 'pedoman_indonesia',
}

const WHO_STH_2017: SumberKlinis = {
  id: 'who_sth_preventive_chemotherapy_2017',
  label: 'WHO Guideline - Preventive Chemotherapy for Soil-transmitted Helminths',
  url: 'https://www.who.int/publications/b/31388',
  tahun: 2017,
  jenis: 'evidence_internasional',
}

const PERMENKES_REPRODUKSI_2025: SumberKlinis = {
  id: 'permenkes_kespro_2_2025',
  label: 'Permenkes 2/2025 - Penyelenggaraan Upaya Kesehatan Reproduksi',
  url: 'https://kesprimkom.kemkes.go.id/modul/unduhan/90',
  tahun: 2025,
  jenis: 'pedoman_indonesia',
}

const WHO_MALNUTRITION_2023: SumberKlinis = {
  id: 'who_wasting_nutritional_oedema_2023',
  label: 'WHO Guideline - Wasting and Nutritional Oedema in Children under 5',
  url: 'https://www.who.int/publications/i/item/9789240082830',
  tahun: 2023,
  jenis: 'evidence_internasional',
}

const PNPK_PGK_2023: SumberKlinis = {
  id: 'pnpk_pgk_2023',
  label: 'KMK 1634/2023 - PNPK Penyakit Ginjal Kronik',
  url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan_1701934559_345195.pdf',
  tahun: 2023,
  jenis: 'pedoman_indonesia',
}

const ESC_HIPERTENSI_2024: SumberKlinis = {
  id: 'esc_hipertensi_2024',
  label: 'ESC Guidelines - Elevated Blood Pressure and Hypertension 2024',
  url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/',
  tahun: 2024,
  jenis: 'evidence_internasional',
}

const ADA_DM_2026: SumberKlinis = {
  id: 'ada_dm_2026',
  label: 'ADA Standards of Care - Diabetes 2026',
  url: 'https://diabetesjournals.org/care/issue/49/Supplement_1',
  tahun: 2026,
  jenis: 'evidence_internasional',
}

const WHO_TB_2025: SumberKlinis = {
  id: 'who_tb_treatment_2025',
  label: 'WHO Consolidated Guidelines on Tuberculosis - Treatment and Care 2025',
  url: 'https://www.who.int/publications/i/item/9789240107243',
  tahun: 2025,
  jenis: 'evidence_internasional',
}

const JUKNIS_TB_SO_2025: SumberKlinis = {
  id: 'kemenkes_juknis_tb_so_2025',
  label: 'Kemenkes - Juknis Penatalaksanaan TB Sensitif Obat 2025',
  url: 'https://p2.kemkes.go.id/juknis-tb-so/',
  tahun: 2025,
  jenis: 'pedoman_indonesia',
}

const WHO_PNEUMONIA_DIARE_ANAK_2024: SumberKlinis = {
  id: 'who_pneumonia_diare_anak_2024',
  label: 'WHO Guideline - Pneumonia and Diarrhoea in Children up to 10 Years 2024',
  url: 'https://www.who.int/publications/i/item/9789240103412',
  tahun: 2024,
  jenis: 'evidence_internasional',
}

const KASUS_SUMBER_PRIORITAS: Readonly<Record<string, readonly SumberKlinis[]>> = {
  asma_ringan: [SUMBER_IGD.ppk_fktp_2022, SUMBER_IGD.gina_2026],
  tb_paru: [JUKNIS_TB_SO_2025, WHO_TB_2025],
  hipertensi_esensial: [PNPK_HT_2026, ESC_HIPERTENSI_2024],
  mm_hipertensi_urgensi: [PNPK_HT_2026, ESC_HIPERTENSI_2024],
  dm_tipe2: [PNPK_DM2_2026, ADA_DM_2026],
  stroke_iskemik: [SUMBER_IGD.pnpk_stroke_2026, SUMBER_IGD.aha_asa_stroke_2026],
  diare_akut_anak: [MTBS_DIARE_KEMENKES, WHO_PNEUMONIA_DIARE_ANAK_2024],
  pneumonia_balita: [SUMBER_IGD.ppk_fktp_2022, WHO_PNEUMONIA_DIARE_ANAK_2024],
  dengue_df: [SUMBER_IGD.ppk_fktp_2022, SUMBER_IGD.who_arboviral_2025],
}

const SUMBER_OTORITATIF: Array<{
  pola: RegExp
  sumber: SumberKlinis
}> = [
  {
    pola: /1186\/2022|PPK\s+(?:Dokter\s+)?FKTP/i,
    sumber: SUMBER_IGD.ppk_fktp_2022,
  },
  {
    pola: /Fornas\s+1199\/2025|Formularium Nasional.*1199\/2025/i,
    sumber: SUMBER_IGD.fornas_2025,
  },
  {
    pola: /PNPK\s+(?:Hipertensi(?:\s+Dewasa)?|303\/2026)|KMK\s+303\/2026/i,
    sumber: PNPK_HT_2026,
  },
  {
    pola: /PNPK\s+(?:DM2|DM\s*Tipe\s*2).*2026|KMK\s+302\/2026/i,
    sumber: PNPK_DM2_2026,
  },
  {
    pola: /PNPK(?:\s+Tata Laksana)?\s+Stroke.*(?:304\/2026|2026)|KMK\s+304\/2026/i,
    sumber: SUMBER_IGD.pnpk_stroke_2026,
  },
  {
    pola: /PNPK\s+Epilepsi\s+Dewasa.*(?:274\/2026|2026)|KMK\s+274\/2026/i,
    sumber: SUMBER_IGD.pnpk_epilepsi_2026,
  },
  {
    pola: /PNPK(?:\s+Tata Laksana)?\s+Trauma.*132\/2017|KMK.*132\/2017/i,
    sumber: SUMBER_IGD.pnpk_trauma_2017,
  },
  {
    pola: /LINTAS DIARE|MTBS\/ILP|WHO IMCI Plan [BC]/i,
    sumber: MTBS_DIARE_KEMENKES,
  },
  {
    pola: /Program Penanggulangan Cacingan|soil-transmitted helminth|askariasis/i,
    sumber: WHO_STH_2017,
  },
  {
    pola: /Permenkes\s+2\/2025/i,
    sumber: PERMENKES_REPRODUKSI_2025,
  },
  {
    pola: /HK\.02\.02\/B\/576\/2025|WHO 2023.*(?:gizi|malnutrisi|wasting)/i,
    sumber: WHO_MALNUTRITION_2023,
  },
  {
    pola: /PNPK\s+Penyakit Ginjal Kronik.*1634\/2023|KMK\s+1634\/2023/i,
    sumber: PNPK_PGK_2023,
  },
]

/**
 * Menautkan pasangan sumber primer untuk kasus prioritas dan mengubah rujukan
 * eksplisit di teks menjadi provenance klik-able. Sumber parsial tidak
 * dipamerkan sebagai paket lengkap: setiap kasus bersitasi harus membawa floor
 * Indonesia dan evidence internasional.
 */
export function lengkapiSumberKlinis(kasus: KasusKlinis): KasusKlinis {
  const teks = [kasus.clue, kasus.panduanResmi, kasus.catatanRealita, kasus.mutiaraEbm]
    .filter(Boolean)
    .join(' ')
  const sumber = new Map((kasus.sumber ?? []).map((item) => [item.id, item]))

  for (const item of KASUS_SUMBER_PRIORITAS[kasus.id] ?? []) {
    sumber.set(item.id, { ...item })
  }

  for (const kandidat of SUMBER_OTORITATIF) {
    if (kandidat.pola.test(teks) && !sumber.has(kandidat.sumber.id)) {
      sumber.set(kandidat.sumber.id, { ...kandidat.sumber })
    }
  }

  const hasil = [...sumber.values()]
  const lengkap =
    hasil.some((item) => item.jenis === 'pedoman_indonesia') &&
    hasil.some((item) => item.jenis === 'evidence_internasional')
  if (!lengkap) return kasus

  return sumber.size === (kasus.sumber?.length ?? 0)
    ? kasus
    : { ...kasus, sumber: hasil }
}
