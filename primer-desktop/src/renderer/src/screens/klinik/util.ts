/**
 * UTIL KLINIK — label, urutan, dan pencarian nama ramah untuk Lembar Periksa.
 * Murni presentasional: TIDAK ada aturan game di sini (aturan milik engine).
 */

import { PACK } from '@content/index'
import type {
  JenisKelamin,
  KasusKlinis,
  KategoriAnamnesis,
  Persona,
  PertanyaanAnamnesis,
  RegionFisik,
} from '@content/types'

/* -- Label persona pasien ----------------------------------------------------- */

export const LABEL_PERSONA: Record<Persona, string> = {
  polos: 'Polos',
  terpelajar: 'Terpelajar',
  skeptis: 'Skeptis',
  cemas: 'Cemas',
  lansia: 'Lansia',
  wali_anak: 'Wali Anak',
}

/* -- Kategori anamnesis (urutan tampil di deck) --------------------------------- */

export const URUTAN_KATEGORI: readonly KategoriAnamnesis[] = [
  'keluhan_utama',
  'rps',
  'rpd',
  'rpk',
  'sosial',
]

export const LABEL_KATEGORI: Record<KategoriAnamnesis, string> = {
  keluhan_utama: 'Keluhan Utama',
  rps: 'Riwayat Penyakit Sekarang',
  rpd: 'Riwayat Penyakit Dahulu',
  rpk: 'Riwayat Keluarga',
  sosial: 'Riwayat Sosial & Kebiasaan',
}

/* -- Region pemeriksaan fisik ----------------------------------------------------- */

export const URUTAN_REGION: readonly RegionFisik[] = [
  'umum',
  'kepala_leher',
  'mata',
  'tht_mulut',
  'toraks_paru',
  'jantung',
  'abdomen',
  'ekstremitas',
  'kulit',
  'neurologis',
]

export const LABEL_REGION: Record<RegionFisik, string> = {
  umum: 'Keadaan Umum',
  kepala_leher: 'Kepala & Leher',
  mata: 'Mata',
  tht_mulut: 'THT & Mulut',
  toraks_paru: 'Toraks & Paru',
  jantung: 'Jantung',
  abdomen: 'Abdomen',
  ekstremitas: 'Ekstremitas',
  kulit: 'Kulit',
  neurologis: 'Neurologis',
}

/* -- Format kecil ------------------------------------------------------------------ */

export function labelJk(jk: JenisKelamin): string {
  return jk === 'L' ? 'Laki-laki' : 'Perempuan'
}

export function formatRupiah(n: number): string {
  return `Rp ${Math.round(n).toLocaleString('id-ID')}`
}

/** Jawaban pasien sesuai persona — cermin logika engine (`variasi[persona] ?? jawab`). */
export function jawabanPasien(q: PertanyaanAnamnesis, persona: Persona): string {
  return q.variasi?.[persona] ?? q.jawab
}

/* -- Nama diagnosis ramah ------------------------------------------------------------ */

/**
 * Nama ICD-10 tambahan untuk diagnosis banding yang TIDAK termasuk daftar
 * SKDI-144 (mis. kasus 3B yang harus dirujuk, atau varian banding).
 * Sengaja diberi nama agar SEMUA pilihan banding tampil setara —
 * pemain tidak bisa menebak jawaban dari pilihan mana yang "punya nama".
 */
const NAMA_ICD_TAMBAHAN: Record<string, string> = {
  // Neurologi & gawat
  I63: 'Stroke Iskemik (Infark Serebri)',
  'I61.9': 'Perdarahan Intraserebral',
  I61: 'Perdarahan Intraserebral',
  I64: 'Stroke, tidak spesifik',
  'G45.9': 'Transient Ischemic Attack (TIA)',
  'E16.2': 'Hipoglikemia',
  'R56.0': 'Kejang Demam',
  // Infeksi & tropik
  A90: 'Demam Dengue',
  A91: 'Demam Berdarah Dengue (DBD)',
  'A01.0': 'Demam Tifoid',
  B54: 'Malaria',
  A09: 'Diare & Gastroenteritis Infeksius',
  'A08.0': 'Enteritis Rotavirus',
  'K52.9': 'Kolitis Non-infektif',
  'A15.0': 'TB Paru, konfirmasi BTA (+)',
  'A16.2': 'TB Paru, tanpa konfirmasi bakteriologis',
  B86: 'Skabies',
  'B30.9': 'Konjungtivitis Viral',
  'H10.0': 'Konjungtivitis Mukopurulen',
  'H10.1': 'Konjungtivitis Alergika Akut',
  'H10.9': 'Konjungtivitis, tidak spesifik',
  // Respirasi
  J00: 'Nasofaringitis Akut (Common Cold)',
  'J02.9': 'Faringitis Akut',
  'J03.9': 'Tonsilitis Akut',
  'J06.9': 'ISPA Atas Akut, tidak spesifik',
  'J18.9': 'Pneumonia, tidak spesifik',
  'J15.9': 'Pneumonia Bakterial',
  'J21.9': 'Bronkiolitis Akut',
  'J20.9': 'Bronkitis Akut',
  'J45.9': 'Asma Bronkial',
  'J44.1': 'PPOK Eksaserbasi Akut',
  // Kardio-metabolik
  I10: 'Hipertensi Esensial',
  'I11.9': 'Penyakit Jantung Hipertensif',
  'I15.9': 'Hipertensi Sekunder',
  'E11.9': 'Diabetes Melitus Tipe 2',
  'E10.9': 'Diabetes Melitus Tipe 1',
  'R73.0': 'Toleransi Glukosa Terganggu',
  // Pencernaan
  'K29.7': 'Gastritis',
  'K21.9': 'GERD (Refluks Gastroesofagus)',
  K30: 'Dispepsia Fungsional',
  'K25.9': 'Ulkus Gaster',
  'K26.9': 'Ulkus Duodenum',
  // THT & hematologi & kulit
  'H66.9': 'Otitis Media, tidak spesifik',
  'H65.9': 'Otitis Media Efusi',
  'H60.9': 'Otitis Eksterna',
  'D50.9': 'Anemia Defisiensi Besi',
  'D64.9': 'Anemia, tidak spesifik',
  'D56.9': 'Talasemia',
  'O99.0': 'Anemia dalam Kehamilan',
  'L20.9': 'Dermatitis Atopik',
  'L29.9': 'Pruritus, tidak spesifik',
  'L30.9': 'Dermatitis, tidak spesifik',
  'L23.9': 'Dermatitis Kontak Alergika',
  'B35.9': 'Dermatofitosis (Tinea)',
  'R50.9': 'Demam, tidak spesifik',
  'B34.9': 'Infeksi Virus, tidak spesifik',
}

/**
 * Nama ramah untuk kode ICD-10 pilihan diagnosis banding.
 * Prioritas: daftar SKDI-144 → suplemen di atas → nama kasus (bila kode
 * kebetulan milik kasus aktif) → tampilkan kodenya apa adanya.
 */
export function namaDiagnosis(icd10: string, kasus: KasusKlinis): string {
  const entri = PACK.skdi144.find((e) => e.icd10 === icd10)
  if (entri) return entri.nama
  const tambahan = NAMA_ICD_TAMBAHAN[icd10]
  if (tambahan) return tambahan
  if (icd10 === kasus.icd10) return kasus.nama
  return `Kode ${icd10}`
}
