/**
 * UTIL KLINIK — label, urutan, dan pencarian nama ramah untuk Lembar Periksa.
 * Murni presentasional: TIDAK ada aturan game di sini (aturan milik engine).
 */

import { PACK } from '@content/index'
import { NAMA_ICD } from '@content/icd10'
import type {
  ItemLab,
  JenisKelamin,
  KasusKlinis,
  KategoriAnamnesis,
  KategoriEdukasi,
  Obat,
  Persona,
  PertanyaanAnamnesis,
  RegionFisik,
  Tindakan,
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
  // Jawaban BENAR kasus ini selalu pakai nama presisinya sendiri — DULUAN
  // dari SKDI (audit 2026-07-04: skdi144 dicek lebih dulu membuat 27 kasus
  // salah tampil label generik SKDI utk jawaban benarnya sendiri, mis.
  // "Hipertensi Urgensi" tertampil "Hipertensi Esensial"). SKDI tetap prioritas
  // utk kode LAIN (distraktor/banding) — nama kompetensi standar lebih pas
  // di situ drpd nama spesifik kasus lain yg kebetulan sama kode.
  if (icd10 === kasus.icd10) return kasus.nama
  const entri = PACK.skdi144.find((e) => e.icd10 === icd10)
  if (entri) return entri.nama
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

/**
 * Cocokkan kueri terhadap item lab (nama+id, fonetik yang sama). DeepThink
 * (2026-07-04): daftar lab dulu tanpa pencarian sama sekali — satu-satunya
 * dari 3 daftar pilihan klinik (Obat/Edukasi/Lab) yang tak konsisten.
 */
export function cocokLab(item: ItemLab, kueri: string): boolean {
  const q = normalisasiNamaObat(kueri)
  if (q.length === 0) return true
  const korpus = [item.nama, item.id]
  return korpus.some((teks) => normalisasiNamaObat(teks).includes(q))
}

/* -- Tindakan klinis: laci kelompok + pencarian (2026-07-16) -------------------------- */
// Katalog tindakan tumbuh ~20→36 bersama ekspansi lab M13 — dinding chip datar
// jadi overload kognitif (temuan playtest user). Pola perbaikan SAMA dgn
// edukasi M7 34b: chunking per tujuan klinis + laci akordeon + pencarian.
// Pengelompokan murni DISPLAY (tak menyentuh PACK/engine/skor/sidik jari).

export type KelompokTindakan =
  | 'gawat'
  | 'napas_cairan'
  | 'luka'
  | 'fraktur'
  | 'tht_mata'
  | 'ibu_anak'
  | 'rujuk'
  | 'lainnya'

export const URUTAN_KELOMPOK_TINDAKAN: readonly KelompokTindakan[] = [
  'gawat',
  'napas_cairan',
  'luka',
  'fraktur',
  'tht_mata',
  'ibu_anak',
  'rujuk',
  'lainnya',
]

export const LABEL_KELOMPOK_TINDAKAN: Record<KelompokTindakan, string> = {
  gawat: 'Stabilisasi & Gawat Darurat',
  napas_cairan: 'Napas & Cairan',
  luka: 'Luka, Luka Bakar & Bedah Minor',
  fraktur: 'Fraktur & Imobilisasi',
  tht_mata: 'THT & Mata',
  ibu_anak: 'Ibu, Bayi & Genital',
  // M13 Batch 4: tindakan persiapan-rujukan + prosedur di luar lingkup FKTP
  // (yang hanya muncul sbg tindakanSalahUmum) — dikelompokkan bersama supaya
  // pemain menimbang "apa yang benar dikerjakan sebelum merujuk".
  rujuk: 'Persiapan Rujukan',
  lainnya: 'Lainnya',
}

/**
 * Pemetaan eksplisit id → kelompok. Tindakan baru yang belum dipetakan jatuh
 * ke 'lainnya' (tetap tampil — fail-open) dan ditangkap test kelengkapan
 * (tindakanKelompok.test.ts) supaya tak menumpuk diam-diam.
 */
export const KELOMPOK_TINDAKAN_BY_ID: Record<string, KelompokTindakan> = {
  adrenalin_im_anafilaksis: 'gawat',
  akses_iv_resusitasi: 'gawat',
  oksigen: 'gawat',
  posisi_semifowler: 'gawat',
  koreksi_hipoglikemia_oral_15g: 'gawat',
  observasi_neurologis: 'gawat',
  dekompresi_ngt: 'gawat',
  minim_stimulus_tetanus: 'gawat',

  nebulisasi: 'napas_cairan',
  nebulisasi_burst_asma_anak: 'napas_cairan',
  pasang_infus: 'napas_cairan',
  rehidrasi_plan_c_bayi: 'napas_cairan',

  perawatan_luka: 'luka',
  hecting_luka: 'luka',
  balut_luka_steril: 'luka',
  insisi_abses: 'luka',
  ekstraksi_kuku: 'luka',
  pendinginan_luka_bakar: 'luka',
  balut_luka_bakar: 'luka',
  profilaksis_tetanus: 'luka',

  imobilisasi_bidai: 'fraktur',
  antibiotik_parenteral_fraktur_protokol: 'fraktur',
  irigasi_luka_fraktur_terbuka: 'fraktur',

  ekstraksi_serumen: 'tht_mata',
  tampon_epistaksis: 'tht_mata',
  ekstraksi_benda_hidung_tekanan_positif: 'tht_mata',
  ekstraksi_benda_hidung_blind_probing: 'tht_mata',
  manuver_epley: 'tht_mata',
  ekstraksi_benda_asing_konjungtiva: 'tht_mata',
  epilasi_trikiasis: 'tht_mata',
  uji_visus_refraksi: 'tht_mata',

  jahit_perineum: 'ibu_anak',
  konseling_laktasi: 'ibu_anak',
  perawatan_tali_pusat: 'ibu_anak',
  antibiotik_parenteral_neonatus_protokol: 'ibu_anak',
  reduksi_parafimosis: 'ibu_anak',

  // M13 Batch 4 (kasus tier-rujuk) — laci 'rujuk' tersendiri. Empat entri
  // terakhir SENGAJA di luar lingkup FKTP (hanya muncul sbg tindakanSalahUmum,
  // tak pernah prosedur benar); dikelompokkan bersama tindakan persiapan-rujuk
  // yang sah agar pemain menimbang "apa yang benar dilakukan sebelum merujuk".
  resusitasi_cairan_kristaloid: 'rujuk',
  pemantauan_ketat_vital: 'rujuk',
  imobilisasi_servikal: 'rujuk',
  pemasangan_kateter_urin: 'rujuk',
  reduksi_manual_hernia: 'rujuk',
  bilas_lambung: 'rujuk',
  pungsi_pleura: 'rujuk',
  transfusi_darah_fktp: 'rujuk',
}

export function kelompokTindakan(id: string): KelompokTindakan {
  return KELOMPOK_TINDAKAN_BY_ID[id] ?? 'lainnya'
}

/** Cocokkan kueri terhadap tindakan (nama+id, fonetik yang sama). */
export function cocokTindakan(tindakan: Tindakan, kueri: string): boolean {
  const q = normalisasiNamaObat(kueri)
  if (q.length === 0) return true
  const korpus = [tindakan.nama, tindakan.id]
  return korpus.some((teks) => normalisasiNamaObat(teks).includes(q))
}

/* -- Formularium: laci golongan obat + pencarian (playtest 2026-07-16) ---------------- */
/*
 * Formularium tumbuh ~69 → 130+ obat bersama ekspansi lab M13 dan tab Resep
 * berubah jadi dinding "+ Resep" (overload kognitif — keluhan playtest yang
 * sama dengan dinding tindakan). Pola laci yang sama dengan edukasi/tindakan:
 * default tertutup, pencarian meng-auto-buka laci relevan.
 *
 * Berbeda dari tindakan (36 id, dipetakan eksplisit), formularium dipetakan
 * HEURISTIK dari `Obat.kelas` (teks bebas, 60+ nilai unik) supaya obat baru
 * otomatis kebagian laci. Urutan uji regex PENTING: rute topikal dicek dulu
 * (mis. "antibiotik topikal" masuk laci Topikal, bukan Antibiotik — pemain
 * mencari per organ/rute, bukan per farmakologi). Display-only: TAK menyentuh
 * pack/engine/skor.
 */

export type KelompokObat =
  | 'analgesik'
  | 'antiinfeksi'
  | 'napas_alergi'
  | 'jantung_metabolik'
  | 'cerna'
  | 'saraf_jiwa'
  | 'kia_hormonal'
  | 'topikal_kulit'
  | 'topikal_mata_tht'
  | 'vitamin_cairan'
  | 'lainnya'

export const URUTAN_KELOMPOK_OBAT: readonly KelompokObat[] = [
  'analgesik',
  'antiinfeksi',
  'napas_alergi',
  'jantung_metabolik',
  'cerna',
  'saraf_jiwa',
  'kia_hormonal',
  'topikal_kulit',
  'topikal_mata_tht',
  'vitamin_cairan',
  'lainnya',
]

export const LABEL_KELOMPOK_OBAT: Record<KelompokObat, string> = {
  analgesik: 'Nyeri, Demam & Antiinflamasi',
  antiinfeksi: 'Antibiotik & Antiinfeksi',
  napas_alergi: 'Napas, Batuk & Alergi',
  jantung_metabolik: 'Jantung, Tensi, Gula & Lemak',
  cerna: 'Pencernaan',
  saraf_jiwa: 'Saraf & Jiwa',
  kia_hormonal: 'KIA, KB & Hormonal',
  topikal_kulit: 'Topikal Kulit',
  topikal_mata_tht: 'Topikal Mata, Telinga & Hidung',
  vitamin_cairan: 'Vitamin, Suplemen & Cairan',
  lainnya: 'Lain-lain',
}

/** Aturan (kelompok, regex atas `Obat.kelas` lowercase) — dievaluasi berurutan. */
const ATURAN_KELOMPOK_OBAT: readonly [KelompokObat, RegExp][] = [
  // Rute topikal/lokal menang atas farmakologi (pemain berpikir per organ).
  // Verifikasi live 2026-07-16: satu laci topikal gabungan berisi 41 obat —
  // masih dinding saat dibuka; dipecah per organ (kulit ≈ separuhnya sendiri).
  ['topikal_mata_tht', /oftalmik|mata|otik|telinga|hidung|nasal|serumenolitik|lubrikan|kumur|orofaring/],
  ['topikal_kulit', /topikal|salep|krim|gel |tetes|semprot|keratolitik|skabisid|pedikulisid|antipruritus/],
  ['antiinfeksi', /antibiotik|penisilin|sefalosporin|makrolid|kuinolon|tetrasiklin|sulfa|antivirus|antijamur|antifungal|antihelmintik|antiparasit|antimalaria|tuberkulostatik|antituberkulosis|oat|antiseptik|antiamuba|antirabies|serum|vaksin|imunisasi/],
  ['analgesik', /analgesik|analgetik|antipiretik|nsaid|opioid|antinyeri|antigout|antiinflamasi|migrain|relaksan otot|kortikosteroid sistemik|antireumatik/],
  ['napas_alergi', /antihistamin|bronkodilator|beta-2|inhalasi|antitusif|mukolitik|ekspektoran|dekongestan|asma|leukotrien|nebulisasi/],
  ['jantung_metabolik', /antihipertensi|ccb|ace|arb|beta-blocker|diuretik|nitrat|statin|antiplatelet|antikoagulan|kolesterol|antidiabetik|insulin|hipoglikemik|tiroid|antiaritmia|glikosida jantung|antianemia|antilipid|absorpsi kolesterol/],
  ['cerna', /antasida|pompa proton|ppi|antagonis h2|antiemetik|laksatif|antidiare|oralit|rehidrasi|sitoprotektif|antispasmodik|prokinetik|hemoroid|antihemoroid/],
  ['saraf_jiwa', /antipsikotik|antidepresan|ansiolitik|benzodiazepin|antikonvulsan|antiepilepsi|antivertigo|sedatif|hipnotik|antiparkinsonian|antikolinergik sentral/],
  ['kia_hormonal', /kontrasepsi|oksitosin|uterotonik|tokolitik|progestin|estrogen|hormon|magnesium sulfat|antikonvulsan obstetri|laktasi/],
  ['vitamin_cairan', /vitamin|suplemen|mineral|besi|folat|kalsium|zinc|elektrolit|cairan|infus|kristaloid|nutrisi/],
]

export function kelompokObat(obat: Obat): KelompokObat {
  const kelas = obat.kelas.toLowerCase()
  for (const [kel, rx] of ATURAN_KELOMPOK_OBAT) if (rx.test(kelas)) return kel
  // Jaring pengaman: flag antibiotik dari katalog menang atas kelas yang
  // tak dikenali regex (mis. penamaan kelas baru dari batch lab berikutnya).
  if (obat.antibiotik === true) return 'antiinfeksi'
  return 'lainnya'
}

/* -- Laboratorium: kelompok tampilan (sapuan UI/UX 2026-07-16) ------------------------ */
/*
 * Daftar lab ±31 baris datar — dipecah jadi kelompok klinis DEFAULT TERBUKA
 * (chunking visual, bukan menyembunyikan; beda dari laci obat yang default
 * tertutup krn 128 item). Heuristik atas id+nama supaya lab baru otomatis
 * kebagian kelompok. Display-only.
 */

export type KelompokLab =
  | 'darah'
  | 'gula_metabolik'
  | 'urin_kehamilan'
  | 'infeksi_serologi'
  | 'penunjang_lain'

export const URUTAN_KELOMPOK_LAB: readonly KelompokLab[] = [
  'darah',
  'gula_metabolik',
  'urin_kehamilan',
  'infeksi_serologi',
  'penunjang_lain',
]

export const LABEL_KELOMPOK_LAB: Record<KelompokLab, string> = {
  darah: 'Darah & Hematologi',
  gula_metabolik: 'Gula, Lemak & Fungsi Organ',
  urin_kehamilan: 'Urin & Kehamilan',
  infeksi_serologi: 'Infeksi & Serologi',
  penunjang_lain: 'Penunjang Lain',
}

const ATURAN_KELOMPOK_LAB: readonly [KelompokLab, RegExp][] = [
  ['infeksi_serologi', /widal|dengue|bta|sputum|gram|koh|hiv|tcm|sifilis|slit|hav|hbs|mikrofilaria|malaria|serologi|kultur|rapid/],
  ['gula_metabolik', /gds|gdp|gula|hba1c|lipid|kolesterol|asam.?urat|elektrolit|ginjal|kreatinin|ureum|sgot|sgpt|hati|tsh|tiroid|albumin|ferritin/],
  ['urin_kehamilan', /urin|protein|kehamilan|feses|tinja/],
  ['darah', /darah|hemoglobin|\bhb\b|hemat|golongan|trombosit|leukosit/],
]

export function kelompokLab(item: ItemLab): KelompokLab {
  const teks = `${item.id} ${item.nama}`.toLowerCase()
  for (const [kel, rx] of ATURAN_KELOMPOK_LAB) if (rx.test(teks)) return kel
  return 'penunjang_lain'
}
