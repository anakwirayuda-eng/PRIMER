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
  /* -- M13 Batch 4 full-fledge (kasus tier-rujuk) — banding tambahan ------ */
  'B18.2': 'Hepatitis C Kronik',
  C20: 'Neoplasma Ganas Rektum',
  'C34.9': 'Neoplasma Ganas Bronkus/Paru, Tidak Spesifik',
  'D25.9': 'Leiomioma Uterus, Tidak Spesifik',
  'D50.0': 'Anemia Defisiensi Besi akibat Perdarahan Kronik',
  'N92.0': 'Perdarahan Menstruasi Berlebihan dan Teratur',
  'E11.2': 'Diabetes Melitus Tipe 2 dengan Komplikasi Ginjal',
  E41: 'Marasmus Nutrisional',
  'K25.5': 'Ulkus Lambung dengan Perforasi',
  'K40.9': 'Hernia Inguinalis Tanpa Obstruksi/Gangren',
  'K60.3': 'Fistula Anus',
  'K64.5': 'Hemoroid Perianal (Trombosis)',
  'K70.3': 'Sirosis Hati Alkoholik',
  'K76.0': 'Perlemakan Hati (Fatty Liver)',
  'K80.2': 'Batu Kandung Empedu Tanpa Kolesistitis',
  'K85.9': 'Pankreatitis Akut, Tidak Spesifik',
  'L03.1': 'Selulitis Tungkai',
  'M86.9': 'Osteomielitis, Tidak Spesifik',
  N23: 'Kolik Ginjal, Tidak Spesifik',
  N40: 'Hiperplasia Prostat Jinak',
  'O21.0': 'Hiperemesis Gravidarum Ringan',
  'O45.9': 'Solusio Plasenta, Tidak Spesifik',
  'O46.9': 'Perdarahan Antepartum, Tidak Spesifik',
  'S30.1': 'Kontusio Dinding Perut',
  'S36.0': 'Cedera Limpa',
  'S52.6': 'Fraktur Ujung Bawah Radius dan Ulna',
  'S63.5': 'Keseleo/Terkilir Pergelangan Tangan',
  /* -- M13 lab full-fledge batches 2-3 ----------------------------------- */
  'G00.9': 'Meningitis Bakterial, Tidak Spesifik',
  'A87.9': 'Meningitis Viral, Tidak Spesifik',
  'F44.5': 'Kejang Disosiatif',
  'T65.1': 'Efek Toksik Striknin dan Garamnya',
  B20: 'Penyakit HIV dengan Manifestasi Infeksi',
  R75: 'Bukti Laboratorium HIV yang Belum Konklusif',
  'S05.0': 'Cedera Konjungtiva dan Abrasi Kornea',
  'H16.0': 'Ulkus Kornea',
  'H15.0': 'Skleritis',
  'E50.5': 'Defisiensi Vitamin A dengan Buta Senja',
  'H35.5': 'Distrofi Retina Herediter',
  'P36.9': 'Sepsis Bakterial Neonatus, Tidak Spesifik',
  'L03.3': 'Selulitis Dinding Tubuh',
  'N34.2': 'Uretritis Lain',
  'N20.0': 'Batu Ginjal',
  'N48.1': 'Balanopostitis',
  'B37.3': 'Kandidiasis Vulva dan Vagina',
  'N73.9': 'Penyakit Radang Panggul Perempuan, Tidak Spesifik',
  'O03.4': 'Abortus Spontan Inkomplet Tanpa Komplikasi',
  'O70.1': 'Ruptur Perineum Derajat Dua saat Persalinan',
  'O72.1': 'Perdarahan Pascapersalinan Segera Lain',
  'L03.9': 'Selulitis, Tidak Spesifik',
  'O91.1': 'Abses Payudara Terkait Persalinan',
  'C50.9': 'Keganasan Payudara, Tidak Spesifik',
  'B37.89': 'Kandidiasis Lokasi Lain',
  'N64.5': 'Tanda atau Gejala Payudara Lain',
  E43: 'Malnutrisi Energi-Protein Berat',
  'E53.0': 'Defisiensi Riboflavin',
  E60: 'Defisiensi Zinc akibat Asupan',
  // Adjudikasi-delegasi 2026-08-21: R62.7 (ICD-10-CM AS, khusus dewasa) diganti
  // R62.8 — padanan WHO ICD-10 utk gagal tumbuh, netral demografi.
  'R62.8': 'Gagal Tumbuh (Failure to Thrive)',
  'L65.9': 'Kerontokan Rambut Nonsikatrik, Tidak Spesifik',
  'D56.3': 'Trait Talasemia',
  'D63.8': 'Anemia pada Penyakit Kronis Lain',
  'A18.2': 'Limfadenopati Tuberkulosis Perifer',
  'C77.0': 'Metastasis Kelenjar Getah Bening Kepala, Wajah, atau Leher',
  'J45.901': 'Asma dengan Eksaserbasi Akut',
  'I83.0': 'Varises Tungkai Bawah dengan Ulkus',
  'E11.5': 'DM Tipe 2 dengan Komplikasi Sirkulasi Perifer',
  'L72.9': 'Kista Folikular Kulit, Tidak Spesifik',
  'C49.9': 'Keganasan Jaringan Ikat atau Lunak, Tidak Spesifik',
  'K12.0': 'Ulkus Aftosa Oral Rekuren',
  'I80.2': 'Flebitis dan Tromboflebitis Pembuluh Dalam Tungkai Bawah',
  'A60.0': 'Infeksi Herpes Anogenital',
  A57: 'Chancroid',
  'L63.9': 'Alopesia Areata, Tidak Spesifik',
  'L93.0': 'Lupus Eritematosus Diskoid',
  'L30.4': 'Intertrigo Eritematosa',
  'L60.3': 'Distrofi Kuku',
  'L40.9': 'Psoriasis, Tidak Spesifik',
  L80: 'Vitiligo',
  'L23.7': 'Dermatitis Kontak Alergik akibat Tumbuhan',
  'I89.0': 'Limfedema',
  'I82.4': 'Trombosis Vena Dalam Akut Tungkai Bawah',
  L23: 'Dermatitis Kontak Alergik',
  'A53.9': 'Sifilis, Tidak Spesifik',
  B09: 'Infeksi Virus dengan Lesi Kulit, Tidak Spesifik',
  'L51.1': 'Sindrom Stevens-Johnson',
  'S51.8': 'Luka Terbuka Lain pada Lengan Bawah',
  'S56.9': 'Cedera Otot atau Tendon Lengan Bawah, Tidak Spesifik',
  'T22.1': 'Luka Bakar Derajat Satu (Bahu/Lengan)',
  'T22.2': 'Luka Bakar Derajat Dua (Bahu/Lengan)',
  'T22.3': 'Luka Bakar Derajat Tiga (Bahu/Lengan)',
  'T31.0': 'Luka Bakar Kurang dari 10 Persen Luas Tubuh',
  'S00.0': 'Cedera Superfisial Kulit Kepala',
  'S02.9': 'Fraktur Tengkorak atau Tulang Wajah, Tidak Spesifik',
  'S06.0': 'Konkusi Otak',
  'S06.5': 'Perdarahan Subdural Traumatik',
  'S61.4': 'Luka Terbuka Tangan',
  'S66.9': 'Cedera Otot atau Tendon Pergelangan dan Tangan, Tidak Spesifik',

  /* -- M13 lab full-fledge batch 1 --------------------------------------- */
  A37: 'Pertusis',
  'J04.0': 'Laringitis Akut',
  'J38.7': 'Gangguan Laring Lain',
  'T75.3': 'Mabuk Perjalanan',
  'H81.1': 'Vertigo Posisi Paroksismal Jinak (BPPV)',
  'H81.2': 'Neuronitis Vestibular',
  'J34.0': 'Abses atau Furunkel Hidung',
  'L01.0': 'Impetigo',
  'J30.0': 'Rinitis Vasomotor',
  // Audit label 2026-08-22: kata intinya dipertahankan ('Ulkus Mulut'), bundel
  // kurung SKDI dibuang. Judul blok registri tak menyebut satu temuan pun yang
  // bisa ditalar mahasiswa, dan 'stomatitis' justru memayungi jawaban benarnya.
  K12: 'Ulkus Mulut',
  'B00.2': 'Gingivostomatitis Herpetik',
  'C06.9': 'Keganasan Mulut, Tidak Spesifik',
  // MENUNGGU DOKTER: kandidiasis mulut sebenarnya B37.0 (candidal stomatitis);
  // B37.9 = kandidiasis tanpa keterangan. Baik skdi144 maupun kasus
  // lab_kandidiasis_mulut sudah terlanjur memakai B37.9, jadi kamus mengikuti
  // pemakaian de-facto sampai dokter memutuskan recode ke B37.0.
  'B37.9': 'Kandidiasis Mulut',
  'D37.0': 'Neoplasma Mulut dengan Perilaku Tidak Pasti',
  B26: 'Parotitis Epidemika (Mumps)',
  'K11.2': 'Sialadenitis',
  'L04.0': 'Limfadenitis Akut Kepala dan Leher',
  'K90.4': 'Malabsorpsi akibat Intoleransi Makanan',
  'K58.0': 'Irritable Bowel Syndrome dengan Diare',
  // MENUNGGU DOKTER: L27.2 sesungguhnya dermatitis akibat makanan tertelan;
  // alergi makanan adalah T78.1. Kasus lab_alergi_makanan_ringan terlanjur
  // berkode L27.2, dan satu-satunya deck yang memakainya sebagai distraktor
  // (intoleransi laktosa) mengajarkan 'intoleransi versus ALERGI' — mengganti
  // labelnya membuat clue & pemeriksaan fisik kasus itu kehilangan sasaran.
  'L27.2': 'Alergi Makanan',
  'T78.2': 'Syok Anafilaktik',
  T62: 'Efek Berbahaya Zat dalam Makanan',
  'B76.0': 'Ankilostomiasis / Cacing Tambang',
  'B77.9': 'Askariasis',
  'B78.9': 'Strongiloidiasis',
  'B65.9': 'Skistosomiasis',
  'B68.9': 'Taeniasis',
  B15: 'Hepatitis A Akut',
  'B16.9': 'Hepatitis B Akut',
  'K71.6': 'Penyakit Hati Toksik dengan Hepatitis',
  J90: 'Efusi Pleura',
  J81: 'Edema Paru',
  'I26.9': 'Emboli Paru',
  'J39.0': 'Abses Retrofaringeal atau Parafaringeal',
  'K92.2': 'Perdarahan Gastrointestinal',
  'K25.4': 'Ulkus Gaster dengan Perdarahan',
  'I85.0': 'Varises Esofagus dengan Perdarahan',
  'K56.6': 'Obstruksi Usus Lain atau Tidak Spesifik',
  'K56.7': 'Ileus, Tidak Spesifik',

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
  'I63.9': 'Stroke Iskemik (Infark Serebri), Tidak Spesifik',
  'I61.9': 'Perdarahan Intraserebral',
  'I60.9': 'Perdarahan Subaraknoid, Tidak Spesifik',
  I61: 'Perdarahan Intraserebral',
  I64: 'Stroke, Tidak Spesifik',
  // Audit label 2026-08-22: dulu meminjam nama kasus saraf_epilepsi_kejang
  // ('Epilepsi Dewasa ...') dan bocor sebagai distraktor di kasus BALITA
  // kejang demam.
  'G40.9': 'Epilepsi, Tidak Spesifik',
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
  // Audit label 2026-08-22: nama lama 'TB Paru, konfirmasi BTA (+)' menggendong
  // HASIL PEMERIKSAAN di dalam sebuah PILIHAN diagnosis. Mahasiswa yang sadar
  // belum pernah menerima hasil BTA mencoretnya lewat logika format, bukan
  // penalaran klinis — dan pada kasus efusi pleura itu menutup diferensial TB
  // yang justru paling penting di Indonesia.
  'A15.0': 'Tuberkulosis Paru',
  'A16.2': 'TB Paru, tanpa konfirmasi bakteriologis',
  B86: 'Skabies',
  B80: 'Enterobiasis (Cacing Kremi)',
  'B06.9': 'Rubela (Campak Jerman)',
  'B02.2': 'Herpes Zoster dengan Neuralgia',
  'B30.9': 'Konjungtivitis Viral',
  'B34.9': 'Infeksi Virus, Tidak Spesifik',
  'R50.9': 'Demam, Tidak Spesifik',

  /* -- Mata & THT ---------------------------------------------------------- */
  // Glosa '(Bakterial)' dipertahankan: 'mukopurulen' setia pada kode, tetapi
  // entitas yang harus ditimbang mahasiswa pada kasus konjungtivitis alergi
  // adalah konjungtivitis bakterial — kosakata SKDI/PPK dan bangsal.
  'H10.0': 'Konjungtivitis Mukopurulen (Bakterial)',
  'H10.1': 'Konjungtivitis Alergika Akut',
  // Akhiran ', Tidak Spesifik' dilepas: di ketujuh deck tempat kode ini jadi
  // distraktor, tak satu pun opsi tetangga berpenanda format seperti itu —
  // ia justru akan jadi satu-satunya opsi berkoma sekaligus terpanjang.
  'H10.9': 'Konjungtivitis',
  'H00.1': 'Kalazion',
  'H16.9': 'Keratitis',
  'H25.9': 'Katarak Senilis, Tidak Spesifik',
  'H33.0': 'Ablasio Retina dengan Robekan Retina',
  'H40.2': 'Glaukoma Sudut Tertutup Primer',
  // Dulu meminjam nama kasus lab_mastoiditis_akut ('Mastoiditis Akut pada
  // Anak') dan bocor sebagai distraktor di kasus pasien 15-40 tahun.
  'H70.0': 'Mastoiditis Akut',
  'H34.1': 'Oklusi Arteri Retina Sentral',
  'H36.0': 'Retinopati Diabetik',
  'H43.1': 'Perdarahan Vitreus',
  'H66.9': 'Otitis Media, Tidak Spesifik',
  'H65.9': 'Otitis Media Efusi',
  'H60.9': 'Otitis Eksterna',
  'H60.3': 'Otitis Eksterna Difus',
  J36: 'Abses Peritonsil',

  /* -- Respirasi ------------------------------------------------------------ */
  J00: 'Nasofaringitis Akut (Common Cold)',
  'J02.9': 'Faringitis Akut',
  'J03.9': 'Tonsilitis Akut',
  'J06.9': 'ISPA Atas Akut, Tidak Spesifik',
  'J18.9': 'Pneumonia, Tidak Spesifik',
  'J15.9': 'Pneumonia Bakterial',
  'J21.9': 'Bronkiolitis Akut',
  'J01.9': 'Sinusitis Akut',
  'J20.9': 'Bronkitis Akut',
  'J30.1': 'Rinitis Alergi Musiman (Polen)',
  'J44.9': 'PPOK, Tidak Spesifik',
  'J45.9': 'Asma Bronkial',
  'J44.1': 'PPOK Eksaserbasi Akut',

  /* -- Kardio-metabolik ------------------------------------------------------ */
  I10: 'Hipertensi Esensial',
  'I11.9': 'Penyakit Jantung Hipertensif',
  'I12.9': 'Penyakit Ginjal Hipertensif',
  'I13.9': 'Penyakit Jantung dan Ginjal Hipertensif',
  'I15.9': 'Hipertensi Sekunder',
  'I16.0': 'Krisis Hipertensi — Urgensi',
  'I16.9': 'Krisis Hipertensi, Tidak Spesifik',
  'I50.0': 'Gagal Jantung Kongestif',
  'I50.1': 'Gagal Jantung Kiri',
  'I50.9': 'Gagal Jantung, Tidak Spesifik',
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
  'K35.9': 'Apendisitis Akut',

  /* -- Muskuloskeletal -------------------------------------------------------- */
  'M00.9': 'Artritis Piogenik (Septik)',
  'M51.1': 'HNP Lumbal dengan Radikulopati',
  'M54.4': 'Lumbago dengan Skiatika',
  // Audit label 2026-08-22: enam kode di bawah ini dulu meminjam nama kasus
  // playable lain (lapisan yang kini dihapus dari namaDiagnosis). Nama kamus
  // sengaja netral — tanpa fase ('Serangan Akut'), tanpa demografi.
  'M06.9': 'Artritis Reumatoid',
  'M10.9': 'Artritis Gout (Pirai)',
  'M17.9': 'Osteoartritis Lutut',
  'M54.5': 'Nyeri Punggung Bawah (Low Back Pain)',

  /* -- Hematologi & kulit ------------------------------------------------------ */
  'D50.9': 'Anemia Defisiensi Besi',
  'D64.9': 'Anemia, Tidak Spesifik',
  'D56.9': 'Talasemia',
  'D53.9': 'Anemia Nutrisional, Tidak Spesifik',
  'D69.9': 'Purpura/Kelainan Perdarahan, Tidak Spesifik',
  'O99.0': 'Anemia dalam Kehamilan',
  'L20.9': 'Dermatitis Atopik',
  'L29.9': 'Pruritus, Tidak Spesifik',
  'L30.9': 'Dermatitis, Tidak Spesifik',
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
  'O01.9': 'Mola Hidatidosa (Hamil Anggur)',
  O13: 'Hipertensi Gestasional',
  'O15.0': 'Eklampsia dalam Kehamilan',
  'O26.9': 'Penyulit Kehamilan, Tidak Spesifik',
  'N83.2': 'Kista Ovarium',
  'Z30.4': 'Pengawasan Kontrasepsi (Kunjungan KB)',
  Z33: 'Status Hamil (temuan insidental)',
  'Z39.1': 'Perawatan & Pemeriksaan Ibu Menyusui',

  /* -- Audit label 2026-08-22: entri baru agar label distraktor berhenti
   * memakai BARIS KURIKULUM SKDI-144. Nama SKDI bertugas rangkap (judul Buku
   * Saku + judulResmi kurikulum) sehingga tak boleh diedit; yang dinaikkan
   * adalah prioritas kamus. Kualifikasi CAKUPAN KOMPETENSI ("Ringan", "Tanpa
   * Komplikasi", "Kecuali Rekalsitran") sengaja tidak dibawa: itu batas
   * wewenang dokter umum, bukan makna kode ICD, dan sebagai label pilihan ia
   * bisa dieliminasi tanpa menalar klinis. -------------------------------- */
  'H52.1': 'Miopia',
  'H52.2': 'Astigmatisme',
  'L70.0': 'Akne Vulgaris',
  L20: 'Dermatitis Atopik',
  L02: 'Abses Kulit (Furunkel)',
  'T14.1': 'Luka Terbuka, Lokasi Tidak Spesifik',
  'B00.9': 'Herpes Simpleks',
  'B01.9': 'Varisela (Cacar Air)',
  'B02.9': 'Herpes Zoster',
  'B37.2': 'Kandidiasis Kutis',
  N10: 'Pielonefritis Akut',

  /* -- Jiwa ------------------------------------------------------------------------ */
  'F23.9': 'Gangguan Psikotik Akut Sementara',
  'F25.9': 'Gangguan Skizoafektif',
  'F32.0': 'Episode Depresif Ringan',
  'F34.1': 'Distimia (Depresi Persisten)',
  'F41.0': 'Gangguan Panik',
  'F41.1': 'Gangguan Cemas Menyeluruh (GAD)',
  'F43.2': 'Gangguan Penyesuaian',
}
