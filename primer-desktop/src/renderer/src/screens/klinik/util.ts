/**
 * UTIL KLINIK — label, urutan, dan pencarian nama ramah untuk Lembar Periksa.
 * Murni presentasional: TIDAK ada aturan game di sini (aturan milik engine).
 */

import { PACK } from '@content/index'
import { NAMA_ICD } from '@content/icd10'
import type {
  JenisKelamin,
  KasusKlinis,
  KategoriAnamnesis,
  KategoriEdukasi,
  Obat,
  Persona,
  PertanyaanAnamnesis,
  RegionFisik,
  TopikEdukasi,
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
 * Nama ramah untuk kode ICD-10 pilihan diagnosis banding — SEMUA pilihan harus
 * bernama setara (anti-bocor: pemain tak boleh menebak jawaban dari pilihan
 * mana yang 'punya nama'). Berlapis: SKDI-144 -> nama kasus playable lain
 * dengan ICD sama -> kamus content/icd10.ts -> fallback kode telanjang
 * (pack.test.ts menjaga fallback ini tak pernah tampil di konten produksi).
 */
const namaKasusPerIcd: Map<string, string> = new Map(
  Object.values(PACK.kasus).map((k) => [k.icd10, k.nama]),
)

export function namaDiagnosis(icd10: string, kasus: KasusKlinis): string {
  const entri = PACK.skdi144.find((e) => e.icd10 === icd10)
  if (entri) return entri.nama
  if (icd10 === kasus.icd10) return kasus.nama
  const dariKasusLain = namaKasusPerIcd.get(icd10)
  if (dariKasusLain) return dariKasusLain
  const tambahan = NAMA_ICD[icd10]
  if (tambahan) return tambahan
  return `Kode ${icd10}`
}

/* -- Pencarian obat toleran-ejaan -------------------------------------------------- */

/**
 * Normalisasi fonetik EN↔ID untuk pencarian obat (temuan playtest: pemain
 * mengetik "paracetamol/amoxicillin/cetirizine" — ejaan Inggris — dan tidak
 * menemukan "Parasetamol/Amoksisilin/Setirizin"). Aturan transliterasi umum
 * nama generik: ph→f, x→ks, c(e/i)→s, c→k, q→k, y→i, th→t; buang non-alfanumerik.
 */
export function normalisasiNamaObat(teks: string): string {
  return teks
    .toLowerCase()
    .replace(/ph/g, 'f')
    .replace(/th/g, 't')
    .replace(/x/g, 'ks')
    .replace(/c(?=[eiy])/g, 's')
    .replace(/c/g, 'k')
    .replace(/q/g, 'k')
    .replace(/y/g, 'i')
    .replace(/[^a-z0-9]/g, '')
    .replace(/(.)\1+/g, '$1') // huruf ganda EN (ll/ss/tt) → tunggal ID
}

/**
 * Cocokkan kueri pemain terhadap obat: nama Indonesia, id (ejaan Inggris),
 * kelas terapi, dan sinonim — semuanya lewat normalisasi fonetik yang sama.
 */
export function cocokObat(obat: Obat, kueri: string): boolean {
  const q = normalisasiNamaObat(kueri)
  if (q.length === 0) return true
  const korpus = [obat.nama, obat.id, obat.kelas, ...(obat.sinonim ?? [])]
  return korpus.some((teks) => normalisasiNamaObat(teks).includes(q))
}

/* -- Edukasi pasien: laci kategori + pencarian (M7 34b) ------------------------------ */

export const URUTAN_KATEGORI_EDUKASI: readonly KategoriEdukasi[] = [
  'gaya_hidup',
  'diet',
  'kepatuhan',
  'higiene',
  'kia',
  'tindakan',
]

export const LABEL_KATEGORI_EDUKASI: Record<KategoriEdukasi, string> = {
  gaya_hidup: 'Gaya Hidup & Aktivitas',
  diet: 'Diet, Nutrisi & Cairan',
  kepatuhan: 'Kepatuhan & Kontrol',
  higiene: 'Higiene & Pencegahan Infeksi',
  kia: 'Ibu & Anak (KIA)',
  tindakan: 'Tindakan Fisik & Teknik Khusus',
}

/** Cocokkan kueri terhadap topik edukasi (nama+id+sinonim, fonetik yang sama). */
export function cocokEdukasi(topik: TopikEdukasi, kueri: string): boolean {
  const q = normalisasiNamaObat(kueri)
  if (q.length === 0) return true
  const korpus = [topik.nama, topik.id, ...(topik.sinonim ?? [])]
  return korpus.some((teks) => normalisasiNamaObat(teks).includes(q))
}
