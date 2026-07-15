/**
 * KAMUS NAMA ICD-10 — pelengkap untuk kode yang muncul di `diagnosisBanding`
 * tetapi TIDAK punya nama dari daftar SKDI-144 maupun kasus playable.
 *
 * Prinsip anti-bocor jawaban: SEMUA pilihan banding harus tampil dengan nama
 * setara — bila hanya jawaban benar yang "punya nama" (sisanya "Kode X"),
 * pemain menebak dari format, bukan menalar klinis. (Temuan playtest user
 * 2026-07-03: "Kode M06.9 / Kode M54.5" tampil telanjang di Deck Diagnosis.)
 *
 * Resolusi nama di UI (util.namaDiagnosis) berlapis:
 *   skdi144 → nama kasus playable (icd10 sama) → kamus ini → "Kode X".
 * `pack.test.ts` menjaga SEMUA kode banding ter-resolve (fail-fast konten baru).
 */

export const NAMA_ICD: Record<string, string> = {
  /* -- M13-1a pilot ------------------------------------------------------- */
  A03: 'Shigellosis / Disentri Basiler',
  'B36.9': 'Mikosis Superfisial, Tidak Spesifik',
  'I95.9': 'Hipotensi, Tidak Spesifik',
  J46: 'Status Asmatikus / Asma Akut Berat',
  'J31.0': 'Rinitis Kronis',
  'J34.89': 'Gangguan Hidung dan Sinus Lain',
  'S80.1': 'Kontusio Tungkai Bawah',
  'T17.1': 'Benda Asing di Lubang Hidung',
  'T17.9': 'Benda Asing di Saluran Napas, Bagian Tidak Spesifik',
  'S82.2': 'Fraktur Batang Tibia',
  'S83.9': 'Sprain atau Strain Sendi/Ligamen Lutut, Tidak Spesifik',
  'I21.0': 'Infark Miokard Akut Dinding Anterior',

  /* -- Neurologi & gawat --------------------------------------------------- */
  I63: 'Stroke Iskemik (Infark Serebri)',
  'I63.9': 'Stroke Iskemik (Infark Serebri), tidak spesifik',
  'I61.9': 'Perdarahan Intraserebral',
  I61: 'Perdarahan Intraserebral',
  I64: 'Stroke, tidak spesifik',
  'G45.9': 'Transient Ischemic Attack (TIA)',
  'E16.2': 'Hipoglikemia',
  'R56.0': 'Kejang Demam',
  'R56.8': 'Kejang Lain, tidak terklasifikasi',
  'G40.3': 'Epilepsi Umum Idiopatik',
  'G43.1': 'Migrain dengan Aura',
  'G44.0': 'Nyeri Kepala Klaster',
  'H81.0': 'Penyakit Ménière',
  'H81.3': 'Vertigo Perifer Lainnya',

  /* -- Infeksi & tropik ---------------------------------------------------- */
  A90: 'Demam Dengue',
  A91: 'Demam Berdarah Dengue (DBD)',
  'A01.0': 'Demam Tifoid',
  B54: 'Malaria',
  A09: 'Diare & Gastroenteritis Infeksius',
  'A08.0': 'Enteritis Rotavirus',
  'A06.0': 'Disentri Ameba Akut',
  'K52.9': 'Kolitis Non-infektif',
  'A15.0': 'TB Paru, konfirmasi BTA (+)',
  'A16.2': 'TB Paru, tanpa konfirmasi bakteriologis',
  B86: 'Skabies',
  B80: 'Enterobiasis (Cacing Kremi)',
  'B06.9': 'Rubela (Campak Jerman)',
  'B02.2': 'Herpes Zoster dengan Neuralgia',
  'B30.9': 'Konjungtivitis Viral',
  'B34.9': 'Infeksi Virus, tidak spesifik',
  'R50.9': 'Demam, tidak spesifik',

  /* -- Mata & THT ---------------------------------------------------------- */
  'H10.0': 'Konjungtivitis Mukopurulen',
  'H10.1': 'Konjungtivitis Alergika Akut',
  'H10.9': 'Konjungtivitis, tidak spesifik',
  'H00.1': 'Kalazion',
  'H16.9': 'Keratitis',
  'H66.9': 'Otitis Media, tidak spesifik',
  'H65.9': 'Otitis Media Efusi',
  'H60.9': 'Otitis Eksterna',
  'H60.3': 'Otitis Eksterna Difus',
  J36: 'Abses Peritonsil',

  /* -- Respirasi ------------------------------------------------------------ */
  J00: 'Nasofaringitis Akut (Common Cold)',
  'J02.9': 'Faringitis Akut',
  'J03.9': 'Tonsilitis Akut',
  'J06.9': 'ISPA Atas Akut, tidak spesifik',
  'J18.9': 'Pneumonia, tidak spesifik',
  'J15.9': 'Pneumonia Bakterial',
  'J21.9': 'Bronkiolitis Akut',
  'J20.9': 'Bronkitis Akut',
  'J30.1': 'Rinitis Alergi Musiman (Polen)',
  'J44.9': 'PPOK, tidak spesifik',
  'J45.9': 'Asma Bronkial',
  'J44.1': 'PPOK Eksaserbasi Akut',

  /* -- Kardio-metabolik ------------------------------------------------------ */
  I10: 'Hipertensi Esensial',
  'I11.9': 'Penyakit Jantung Hipertensif',
  'I12.9': 'Penyakit Ginjal Hipertensif',
  'I13.9': 'Penyakit Jantung dan Ginjal Hipertensif',
  'I15.9': 'Hipertensi Sekunder',
  'I16.0': 'Krisis Hipertensi — Urgensi',
  'I16.9': 'Krisis Hipertensi, tidak spesifik',
  'I50.9': 'Gagal Jantung, tidak spesifik',
  'E11.9': 'Diabetes Melitus Tipe 2',
  'E10.9': 'Diabetes Melitus Tipe 1',
  'E13.9': 'Diabetes Melitus Tipe Lain',
  'R73.0': 'Toleransi Glukosa Terganggu',
  'E03.9': 'Hipotiroidisme',
  'E05.9': 'Hipertiroidisme (Tirotoksikosis)',
  'E66.0': 'Obesitas karena Kelebihan Kalori',
  'E78.0': 'Hiperkolesterolemia Murni',
  'E78.1': 'Hipertrigliseridemia Murni',

  /* -- Pencernaan & anorektal ------------------------------------------------ */
  'K29.7': 'Gastritis',
  'K21.9': 'GERD (Refluks Gastroesofagus)',
  K30: 'Dispepsia Fungsional',
  'K25.9': 'Ulkus Gaster',
  'K26.9': 'Ulkus Duodenum',
  'K27.9': 'Ulkus Peptikum',
  'K60.2': 'Fisura Ani',
  'K62.5': 'Perdarahan Anus/Rektum',

  /* -- Muskuloskeletal -------------------------------------------------------- */
  'M00.9': 'Artritis Piogenik (Septik)',
  'M51.1': 'HNP Lumbal dengan Radikulopati',
  'M54.4': 'Lumbago dengan Skiatika',

  /* -- Hematologi & kulit ------------------------------------------------------ */
  'D50.9': 'Anemia Defisiensi Besi',
  'D64.9': 'Anemia, tidak spesifik',
  'D56.9': 'Talasemia',
  'D53.9': 'Anemia Nutrisional, tidak spesifik',
  'D69.9': 'Purpura/Kelainan Perdarahan, tidak spesifik',
  'O99.0': 'Anemia dalam Kehamilan',
  'L20.9': 'Dermatitis Atopik',
  'L29.9': 'Pruritus, tidak spesifik',
  'L30.9': 'Dermatitis, tidak spesifik',
  'L23.9': 'Dermatitis Kontak Alergika',
  'L24.9': 'Dermatitis Kontak Iritan',
  'L21.0': 'Dermatitis Seboroik',
  'L50.0': 'Urtikaria Alergika',
  L82: 'Keratosis Seboroik',
  'D23.9': 'Neoplasma Jinak Kulit',
  'B35.9': 'Dermatofitosis (Tinea)',
  'T78.3': 'Angioedema',

  /* -- Kebidanan & KB ------------------------------------------------------------ */
  'O00.9': 'Kehamilan Ektopik',
  O13: 'Hipertensi Gestasional',
  'O15.0': 'Eklampsia dalam Kehamilan',
  'O26.9': 'Penyulit Kehamilan, tidak spesifik',
  'N83.2': 'Kista Ovarium',
  'Z30.4': 'Pengawasan Kontrasepsi (Kunjungan KB)',
  Z33: 'Status Hamil (temuan insidental)',
  'Z39.1': 'Perawatan & Pemeriksaan Ibu Menyusui',

  /* -- Jiwa ------------------------------------------------------------------------ */
  'F23.9': 'Gangguan Psikotik Akut Sementara',
  'F25.9': 'Gangguan Skizoafektif',
  'F34.1': 'Distimia (Depresi Persisten)',
  'F41.0': 'Gangguan Panik',
  'F43.2': 'Gangguan Penyesuaian',
}
