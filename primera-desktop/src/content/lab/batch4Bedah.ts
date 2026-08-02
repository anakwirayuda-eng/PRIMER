/**
 * LAB BATCH 4 — BEDAH (M13, 2026-07-16).
 *
 * 9 kasus tier-rujuk (3A/3B) dengan tujuan rujukan `bedah`. Inti pedagogis
 * batch ini: kasus rujuk BUKAN "klik rujuk lalu selesai". Yang dinilai adalah
 * (a) mengenali tanda bahaya, (b) melakukan yang MEMANG wajib dilakukan FKTP
 * sebelum merujuk (stabilisasi/analgesia/cairan/antibiotik dosis-1),
 * (c) TIDAK melakukan yang di luar lingkup, (d) merujuk ke spesialis yang benar.
 *
 * Catatan konsistensi lintas-kasus yang disengaja (NSAID pada nyeri perut):
 * NSAID adalah JAWABAN BENAR pada nyeri bilier (kolesistitis) dan kolik ureter
 * — di dua tempat itu ia lini pertama dan didukung bukti. NSAID justru
 * KONTRAINDIKASI saat ada perdarahan/perforasi/hipoperfusi ginjal (peritonitis
 * akibat ulkus, trauma tumpul dengan syok). Tiap kasus membawa alasannya
 * sendiri di `clue`/`obatSalahUmum` supaya perbedaannya terbaca sebagai
 * penalaran, bukan inkonsistensi.
 */

import type { KasusKlinis } from '../types'
import type { LabArchetypeSpec } from './batch1'
import { buatKasusLab } from './labCaseFactory'

const PPK_FLOOR = 'Acuan dasar kasus ini adalah PPK Dokter di FKTP (KMK 1186/2022). Bila pedoman yang lebih baru menggeser keselamatan atau efektivitas terapi, pedoman baru itulah yang diikuti.'

export const LAB_BATCH_4_BEDAH_CASES: KasusKlinis[] = [
  /* ========================================================================
   * 1. Hernia Inguinalis Inkarserata (K40.3, 3B, rujuk bedah)
   * Poin ajar: benjolan yang TAK BISA direduksi + muntah + tak flatus =
   *   obstruksi. Reduksi paksa DILARANG bila ada tanda strangulasi.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_hernia_inguinalis_inkarserata',
    nama: 'Hernia Inguinalis Inkarserata',
    icd10: 'K40.3',
    skdi: '3B',
    kategori: 'pencernaan',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'bedah',
    keluhanUtama: 'Benjolan di lipat paha saya sejak pagi tidak bisa masuk lagi dan sakitnya luar biasa, Dok.',
    demografi: { usiaMin: 40, usiaMax: 70, jenisKelamin: 'L' },
    vital: { td: '132/84', nadi: 108, rr: 22, suhu: 37.6, spo2: 98 },
    pembuka: {
      tanya: 'Sejak kapan benjolannya tidak mau masuk, dan bagaimana rasanya sekarang?',
      jawab: 'Biasanya kalau saya berbaring benjolan itu masuk sendiri, Dok. Sejak subuh tadi tetap menonjol, keras, dan makin lama makin nyeri.',
      oldcarts: ['onset', 'durasi', 'karakter', 'keparahan'],
    },
    pertanyaan: [
      { id: 'q_riwayat_benjolan', kategori: 'rpd', tanya: 'Sudah berapa lama ada benjolan itu, dan apa yang biasanya membuatnya keluar?', jawab: 'Sudah hampir dua tahun, Dok. Keluar kalau saya mengangkat karung atau batuk keras, lalu masuk lagi sendiri kalau tiduran.', esensial: true, oldcarts: ['durasi', 'agravasi'] },
      { id: 'q_muntah', kategori: 'rps', tanya: 'Ada mual atau muntah? Kalau muntah, isinya apa?', jawab: 'Muntah tiga kali sejak siang, Dok. Awalnya sisa makanan, yang terakhir cairan kuning kehijauan dan pahit.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_bab_flatus', kategori: 'rps', tanya: 'Sejak benjolan tidak bisa masuk, masih bisa buang air besar atau buang angin?', jawab: 'Tidak sama sekali, Dok. Buang angin pun tidak bisa sejak semalam, perut rasanya penuh dan kembung.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_dorong_paksa', kategori: 'rps', tanya: 'Apakah benjolannya sudah dicoba didorong masuk? Oleh siapa dan apa hasilnya?', jawab: 'Sudah saya tekan sendiri kuat-kuat pagi tadi, lalu diurut tetangga juga. Bukannya masuk, malah tambah nyeri dan sekarang perut ikut sakit.', esensial: true },
      { id: 'q_kulit_benjolan', kategori: 'rps', tanya: 'Kulit di atas benjolan berubah warna atau terasa panas?', jawab: 'Iya, jadi kemerahan dan hangat kalau dipegang, Dok.', esensial: true },
      { id: 'q_demam', kategori: 'rps', tanya: 'Ada demam atau menggigil?', jawab: 'Badan terasa hangat sejak tadi siang, tapi tidak sampai menggigil.', oldcarts: ['penyerta'] },
      { id: 'q_kencing', kategori: 'rps', tanya: 'Buang air kecilnya bagaimana, ada nyeri atau tidak lancar?', jawab: 'Kencing biasa saja, Dok, tidak sakit dan lancar.' },
      { id: 'q_pekerjaan', kategori: 'sosial', tanya: 'Sehari-hari pekerjaan Bapak apa?', jawab: 'Kuli angkut di pasar, Dok, tiap hari angkat karung beras.' },
      { id: 'q_maag', kategori: 'rpd', tanya: 'Apakah Bapak punya riwayat sakit maag atau sering minum obat lambung?', jawab: 'Maag sih tidak pernah, Dok. Lambung saya aman-aman saja.', distraktor: true },
      { id: 'q_rokok', kategori: 'sosial', tanya: 'Bapak merokok? Sudah berapa lama?', jawab: 'Merokok sejak muda, Dok, sehari sebungkus. Apa itu ada hubungannya?', distraktor: true },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak kesakitan, gelisah, berkeringat; takikardia, mukosa bibir agak kering.', relevan: true },
      { region: 'abdomen', temuan: 'Benjolan inguinal kanan ~5 cm meluas ke skrotum, kenyal-tegang, sangat nyeri, TIDAK dapat direposisi, transiluminasi negatif. Distensi ringan, bising usus meningkat bernada metalik, nyeri tekan difus; defans generalisata (-).', relevan: true },
      { region: 'kulit', temuan: 'Kulit di atas benjolan eritematosa dan teraba hangat — tanda awal gangguan vaskularisasi isi hernia.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
      { region: 'jantung', temuan: 'Takikardia, S1/S2 reguler, murmur (-).', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['K40.3', 'K56.6', 'K40.9'],
    tatalaksana: {
      obatBenar: [],
      obatAlternatif: [
        ['nacl_09_inf', 'ringer_laktat_inf'],
      ],
      obatSalahUmum: [
        { id: 'loperamid_2', alasan: 'Muntah dan tidak bisa buang angin di sini adalah tanda OBSTRUKSI mekanik, bukan diare. Menghentikan peristaltik tidak membuka jepitan, menutupi perburukan, dan menunda pengenalan strangulasi.', bahaya: 'kontraindikasi' },
        { id: 'domperidon_10', alasan: 'Prokinetik memaksa usus berkontraksi melawan sumbatan mekanik — nyeri bertambah, risiko muntah-aspirasi naik, dan usus yang sudah terjepit makin tertekan. Muntah pada obstruksi diatasi dengan dekompresi NGT, bukan prokinetik.', bahaya: 'kontraindikasi' },
        { id: 'amoxicillin_500', alasan: 'Hernia inkarserata adalah kasus BEDAH; antibiotik oral tidak melepaskan jepitan dan berisiko menunda rujukan. Antibiotik parenteral peri-operatif adalah urusan RS rujukan.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pasang_infus', 'dekompresi_ngt', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        { id: 'reduksi_manual_hernia', alasan: 'Reduksi paksa pada hernia yang sudah terjepit berjam-jam, nyeri hebat, dan kulitnya kemerahan adalah kontraindikasi. Risikonya "reduction en masse": usus yang mungkin sudah nekrotik terdorong kembali ke rongga perut — benjolan hilang dan pasien tampak membaik, sementara perforasi berlangsung tanpa tanda yang bisa dilihat dari luar, lalu muncul sebagai peritonitis. Tanda strangulasi = rujuk bedah, bukan mendorong lebih kuat.', bahaya: 'berbahaya' },
      ],
      edukasi: ['persiapan_rujukan_operatif', 'puasa_sambil_rujuk', 'tanda_bahaya', 'hindari_mengejan'],
      edukasiKritis: ['persiapan_rujukan_operatif', 'puasa_sambil_rujuk'],
      terapiKritis: ['pasang_infus'],
    },
    stabilisasiWajib: ['pasang_infus', 'dekompresi_ngt', 'pemantauan_ketat_vital'],
    clue: 'Hernia inguinalis yang tadinya reponibel kini tidak dapat direduksi, disertai muntah bilious, obstipasi, dan kulit di atas benjolan kemerahan = inkarserasi dengan kecurigaan strangulasi. Puasakan, pasang jalur IV, koreksi kehilangan cairan, dekompresi NGT bila aman, pantau perfusi, dan rujuk bedah segera. Jangan melakukan reduksi paksa. Analgesia yang sesuai rute dan protokol dapat diberikan, tetapi pilihan oral pada pasien yang terus muntah tidak dijadikan jawaban wajib.',
    panduanResmi: `${PPK_FLOOR} PPK 1186/2022 tidak mempunyai bab diagnosis-spesifik untuk hernia inkarserata atau strangulata, sehingga tidak boleh dikutip seolah memberi algoritma tersebut. WSES 2017 menjadi rujukan langsung: bila strangulasi usus dicurigai, perbaikan hernia darurat harus dilakukan segera. Gambaran kasus ini menuntut stabilisasi singkat dan transfer bedah tanpa percobaan reduksi paksa atau menunggu penunjang.`,
    catatanRealita: 'Skenario menyatakan infus, NGT, monitoring, dan transport siap. NGT adalah sumber daya Tier C: bila alat atau operator tidak ready, jangan menunda transfer demi memaksakannya. Foto polos abdomen dan elektrolit cepat tidak diasumsikan tersedia di Sukamaju; keduanya juga tidak dibutuhkan untuk mengenali kecurigaan strangulasi klinis.',
    mutiaraEbm: 'Nyeri yang tiba-tiba MEREDA dan benjolan yang "akhirnya masuk" setelah didorong bukan selalu kabar baik: pada reduction en masse, isi hernia yang sudah rusak berpindah ke rongga perut dan gejala menghilang sesaat sebelum peritonitis muncul. Kedua, bising usus yang masih terdengar — bahkan meningkat — TIDAK menyingkirkan strangulasi; pada obstruksi mekanik bising usus justru khas meningkat dan bernada metalik lebih dulu, baru menghilang belakangan saat usus sudah lelah atau mati.',
    konsekuensi: {
      narasi: 'Reduksi paksa atau rujukan yang tertunda membuat usus yang terjepit kehilangan aliran darah; dalam hitungan jam terjadi nekrosis dan perforasi, berlanjut ke peritonitis dan sepsis. Reseksi usus yang semula tak perlu menjadi tak terhindarkan.',
      kembaliHariMin: 1,
      kembaliHariMax: 2,
      kondisiKembali: 'Pasien kembali dengan nyeri seluruh perut, perut papan, demam tinggi, takikardia, dan tekanan darah turun — peritonitis akibat usus yang terjepit sudah mati.',
      guideline: 'WSES 2017 complicated abdominal wall hernia: operasi darurat segera bila strangulasi usus dicurigai; PPK 1186/2022 tidak mempunyai bab hernia diagnosis-spesifik.',
    },
  }),

  /* ========================================================================
   * 2. Kolesistitis Akut (K81.0, 3B, rujuk bedah)
   * Poin ajar: kolik bilier yang TIDAK reda >6 jam + demam + Murphy (+) =
   *   radang, bukan kolik lagi. NSAID justru lini pertama di sini.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_kolesistitis_akut',
    nama: 'Kolesistitis Akut',
    icd10: 'K81.0',
    skdi: '3B',
    kategori: 'pencernaan',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'bedah',
    keluhanUtama: 'Perut kanan atas saya nyeri hebat sejak semalam setelah makan gulai, Dok, tembus sampai ke punggung.',
    demografi: { usiaMin: 35, usiaMax: 60, jenisKelamin: 'P' },
    vital: { td: '124/78', nadi: 102, rr: 20, suhu: 38.4, spo2: 98 },
    pembuka: {
      tanya: 'Nyerinya mulai kapan, terasa di mana, dan menjalar ke mana?',
      jawab: 'Mulai semalam, sekitar dua jam setelah makan gulai kambing. Nyerinya di perut kanan atas, terasa tembus ke punggung dan ujung bahu kanan.',
      oldcarts: ['onset', 'lokasi', 'radiasi', 'karakter'],
    },
    pertanyaan: [
      { id: 'q_pencetus_lemak', kategori: 'rps', tanya: 'Nyeri seperti ini pernah muncul sesudah makan berlemak sebelumnya?', jawab: 'Sering, Dok. Tiap habis makan santan atau gorengan perut kanan atas nyeri, tapi biasanya hilang sendiri satu-dua jam. Kali ini sudah semalaman tidak reda.', esensial: true, oldcarts: ['agravasi'] },
      { id: 'q_durasi_serangan', kategori: 'rps', tanya: 'Berapa lama nyeri kali ini berlangsung, dan apakah sempat reda sama sekali?', jawab: 'Sudah lebih dari dua belas jam, Dok, sama sekali tidak reda. Biasanya cuma sebentar lalu hilang.', esensial: true, oldcarts: ['durasi', 'keparahan'] },
      { id: 'q_demam', kategori: 'rps', tanya: 'Ada demam atau menggigil?', jawab: 'Iya, badan panas sejak pagi dan sempat menggigil sampai gigi bergemeletuk.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_kuning', kategori: 'rps', tanya: 'Ada mata atau kulit yang menguning, kencing seperti teh, atau tinja jadi pucat?', jawab: 'Tidak, Dok. Mata masih putih, kencing kuning biasa, buang air besar warnanya normal.', esensial: true },
      { id: 'q_mual', kategori: 'rps', tanya: 'Ada mual atau muntah?', jawab: 'Mual terus dan sudah muntah dua kali, Dok.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_napas', kategori: 'rps', tanya: 'Nyerinya bertambah saat menarik napas dalam?', jawab: 'Iya, kalau tarik napas dalam rasanya tertahan dan tambah nyeri.', oldcarts: ['agravasi'] },
      { id: 'q_riwayat_batu', kategori: 'rpd', tanya: 'Pernah diperiksa dan dikatakan ada batu di kandung empedu?', jawab: 'Dua tahun lalu pernah diperiksa dengan alat di kota, katanya ada batu kecil. Tapi saya tidak pernah kontrol lagi.' },
      { id: 'q_obat', kategori: 'rpd', tanya: 'Sedang minum obat apa saja, termasuk obat yang dibeli sendiri untuk nyeri ini?', jawab: 'Semalam saya minum obat maag warung dua kali, Dok, tidak menolong sama sekali.' },
      { id: 'q_alergi_makanan', kategori: 'rpd', tanya: 'Ibu punya alergi makanan tertentu, seperti udang atau telur?', jawab: 'Tidak ada, Dok, saya makan apa saja aman.', distraktor: true },
      { id: 'q_merokok', kategori: 'sosial', tanya: 'Ibu merokok?', jawab: 'Tidak pernah sama sekali, Dok.', distraktor: true },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak kesakitan, febris, takikardia; tidak ikterik.', relevan: true },
      { region: 'abdomen', temuan: 'Nyeri tekan hipokondrium kanan dengan defans lokal (+). Tanda Murphy POSITIF: inspirasi terhenti mendadak saat jari menekan subkosta kanan. Massa tak jelas teraba; bising usus normal.', relevan: true },
      { region: 'mata', temuan: 'Sklera tidak ikterik — tidak mendukung obstruksi saluran empedu/kolangitis.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/- — menyingkirkan pneumonia basal kanan sebagai peniru nyeri kanan atas.', relevan: false },
      { region: 'jantung', temuan: 'Takikardia, S1/S2 reguler, murmur (-).', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['K81.0', 'K80.2', 'K29.7'],
    tatalaksana: {
      obatBenar: ['ceftriaxone_1g_inj', 'ketorolak_30_inj'],
      obatAlternatif: [['nacl_09_inf', 'ringer_laktat_inf']],
      obatOpsional: ['ondansetron_4', 'metronidazol_inj_500'],
      obatSalahUmum: [
        { id: 'antasida_doen', alasan: 'Nyeri kanan atas berulang yang dipicu makanan berlemak, kini disertai demam dan Murphy positif, bukan dispepsia. Pasien ini bahkan sudah "gagal" dengan obat maag warung semalaman — mengulangi hipotesis yang sama hanya menunda pengenalan kolesistitis.', bahaya: 'nonPrimer' },
        { id: 'amoxicillin_500', alasan: 'Antibiotik ORAL berspektrum sempit tidak mencakup patogen bilier (Enterobacterales) dan tidak menggantikan dosis pertama parenteral sebelum rujuk. Yang lebih merugikan: meresepkannya biasanya berarti pasien dipulangkan, padahal ia butuh kolesistektomi dini.', bahaya: 'nonPrimer' },
        { id: 'hyoscine_butilbromida_20_inj', alasan: 'Antispasmodik dapat meredakan kolik bilier, tetapi kasus ini memiliki nyeri menetap lebih dari enam jam, demam, dan Murphy positif yang mengarah ke inflamasi akut. Memakainya sebagai terapi utama dapat menciptakan perbaikan semu dan menunda analgesia yang tepat, antibiotik awal, serta rujukan.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pasang_infus'],
      edukasi: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif', 'tanda_bahaya'],
      edukasiKritis: ['puasa_sambil_rujuk'],
    },
    stabilisasiWajib: ['pasang_infus'],
    clue: 'Nyeri kanan atas dipicu makanan berlemak yang MENETAP lebih dari 6 jam, demam, dan Murphy klinis positif sangat mendukung kolesistitis akut; keputusan FKTP tidak menunggu USG, hitung darah, atau enzim hati. Puasakan, pasang jalur IV, beri analgesia dan antibiotik parenteral dosis pertama sesuai protokol, lalu rujuk bedah. Pada nyeri bilier, NSAID adalah lini pertama bila tidak ada kontraindikasi. Rujukan bersifat dini, bukan pendekatan "didinginkan dulu" di FKTP; konfirmasi pencitraan dan keputusan kolesistektomi berada di jejaring bedah.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan kolesistitis akut sebagai kompetensi 3B — didiagnosis secara klinis di FKTP (nyeri kanan atas menetap, demam, Murphy positif), diberi terapi suportif dan antibiotik, lalu dirujuk ke layanan bedah untuk tata laksana definitif. Kriteria rujukan resmi terpenuhi begitu diagnosis ditegakkan; USG bukan syarat merujuk, melainkan penunjang bila tersedia.`,
    catatanRealita: 'USG abdomen, CBC, dan fungsi hati tidak diasumsikan tersedia di Sukamaju dan tidak menjadi syarat rujuk. Kolesistitis akut adalah diagnosis kerja klinis first-contact; kirim pasien dengan puasa, jalur IV, analgesia, dan dosis awal antibiotik yang tersedia sesuai protokol jejaring.',
    mutiaraEbm: 'Enzim hati dan bilirubin yang NORMAL tidak menyingkirkan kolesistitis akut — pada kolesistitis tanpa komplikasi keduanya memang biasanya normal atau nyaris normal, seperti pasien ini. Yang menaikkannya justru batu yang turun ke saluran empedu (koledokolitiasis/kolangitis), sehingga hasil "hati normal" sering keliru dibaca sebagai "berarti bukan empedu". Kedua, Murphy dapat NEGATIF pada lansia dan penyandang diabetes — dan pada merekalah kolesistitis paling cepat berkembang menjadi gangren, justru dengan keluhan yang paling ringan.',
    konsekuensi: {
      narasi: 'Kolesistitis yang dianggap dispepsia dan dipulangkan dengan obat lambung berlanjut menjadi empiema, gangren, hingga perforasi kandung empedu dengan peritonitis bilier — komplikasi yang angka kematiannya jauh di atas kolesistektomi dini yang terjadwal.',
      kembaliHariMin: 2,
      kembaliHariMax: 5,
      kondisiKembali: 'Pasien kembali dengan demam tinggi terus-menerus, nyeri kanan atas yang meluas ke seluruh perut, dan tanda sepsis — kandung empedu sudah gangren/perforasi.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 — kolesistitis akut (3B): suportif + antibiotik + rujuk bedah. Kolesistektomi dini vs tunda: Cochrane (kolesistektomi laparoskopik dini pada kolesistitis akut).',
    },
  }),

  /* ========================================================================
   * 3. Apendisitis Akut pada Anak (K35.8, 3B, rujuk bedah)
   * Poin ajar: nyeri BERPINDAH + anak menolak melompat. Leukosit normal
   *   TIDAK menyingkirkan apendisitis dini.
   * Konsistensi: sikap analgesia SAMA dengan kasus `apendisitis_akut`
   *   dewasa (kasusRespGi.ts) — analgesia TIDAK menutupi diagnosis
   *   (Cochrane CD005660/WSES); yang dihindari adalah NSAID pada perut
   *   akut pra-bedah, bukan analgesianya.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_apendisitis_akut_anak',
    nama: 'Apendisitis Akut pada Anak',
    icd10: 'K35.8',
    skdi: '3B',
    kategori: 'pencernaan',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'bedah',
    keluhanUtama: 'Anak saya sakit perut sejak kemarin, awalnya di sekitar pusar, sekarang pindah ke kanan bawah dan jalannya membungkuk.',
    keluhanUtamaOlehPendamping: true,
    demografi: { usiaMin: 7, usiaMax: 9 },
    vital: { td: '100/64', nadi: 118, rr: 24, suhu: 37.9, spo2: 98 },
    pembuka: {
      tanya: 'Sakit perutnya mulai di bagian mana, dan sekarang di mana?',
      jawab: 'Kemarin siang dia bilang sakit di sekitar pusar, samar-samar saja. Tadi pagi pindah ke perut kanan bawah dan sekarang menetap di situ, makin sakit.',
      oldcarts: ['onset', 'lokasi', 'radiasi', 'durasi'],
    },
    pertanyaan: [
      { id: 'q_jalan', kategori: 'rps', tanya: 'Bagaimana cara anak berjalan sekarang, dan apa yang terjadi kalau dia diminta melompat?', jawab: 'Jalannya pelan sambil membungkuk memegang perut kanan. Saya suruh lompat tadi, dia menolak, katanya sakit sekali.', esensial: true, oldcarts: ['agravasi'] },
      { id: 'q_makan', kategori: 'rps', tanya: 'Nafsu makannya bagaimana sejak sakit perut?', jawab: 'Sama sekali tidak mau makan sejak kemarin sore, padahal biasanya dia paling doyan makan.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_mual', kategori: 'rps', tanya: 'Ada mual atau muntah?', jawab: 'Muntah dua kali tadi pagi, isinya makanan.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_demam', kategori: 'rps', tanya: 'Ada demam? Sudah diukur di rumah?', jawab: 'Badannya hangat sejak kemarin malam, saya ukur tadi 37,8.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_bab', kategori: 'rps', tanya: 'Buang air besarnya bagaimana, mencret atau tidak keluar?', jawab: 'Terakhir kemarin pagi, biasa saja. Tidak mencret sama sekali.', esensial: true },
      { id: 'q_kencing', kategori: 'rps', tanya: 'Kencingnya sakit atau jadi lebih sering?', jawab: 'Tidak, kencingnya biasa dan dia tidak mengeluh sakit.' },
      { id: 'q_obat_rumah', kategori: 'rpd', tanya: 'Sudah diberi obat apa di rumah?', jawab: 'Saya beri sirup penurun panas tadi pagi. Panasnya turun sebentar, tapi perutnya tetap sakit.' },
      { id: 'q_berat_badan', kategori: 'rpd', tanya: 'Berapa berat badan anak terakhir kali ditimbang?', jawab: 'Bulan lalu di sekolah 24 kilogram, Dok.', esensial: true },
      { id: 'q_batuk_pilek', kategori: 'rps', tanya: 'Ada batuk, pilek, atau sakit tenggorokan belakangan ini?', jawab: 'Tidak ada sama sekali, Dok.' },
      { id: 'q_jajan', kategori: 'sosial', tanya: 'Anaknya sering jajan sembarangan di sekolah?', jawab: 'Iya, Dok, sering jajan di depan sekolah. Apa mungkin keracunan makanan?', distraktor: true },
      { id: 'q_cacing', kategori: 'rpd', tanya: 'Kapan terakhir anak diberi obat cacing?', jawab: 'Terakhir enam bulan lalu dari sekolah, Dok.', distraktor: true },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Anak tampak kesakitan, berbaring dengan tungkai kanan sedikit ditekuk, enggan bergerak; subfebris, takikardia.', relevan: true },
      { region: 'abdomen', temuan: 'Nyeri tekan maksimal di titik McBurney, nyeri lepas (Blumberg) (+), defans muskular lokal (+), Rovsing (+). Uji lompat positif — anak menolak melompat karena nyeri.', relevan: true },
      { region: 'ekstremitas', temuan: 'Psoas sign (+): nyeri kuadran kanan bawah saat ekstensi pasif tungkai kanan.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/- — tidak ada pneumonia basal kanan sebagai peniru nyeri perut anak.', relevan: false },
      { region: 'tht_mulut', temuan: 'Faring tidak hiperemis, tonsil T1/T1 tenang — tidak mendukung limfadenitis mesenterika pasca-infeksi virus.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Leukosit 11.200/µL (masih batas atas), neutrofil 76% — pergeseran hitung jenis ke kiri meski angka leukosit belum tinggi.', flag: 'abnormal', relevan: true },
      { id: 'urinalisis', hasil: 'Leukosit 2-3/LPB, nitrit (-), eritrosit (-) — tidak mendukung infeksi saluran kemih.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['K35.8', 'A09', 'N39.0'],
    tatalaksana: {
      obatBenar: ['paracetamol_sirup'],
      obatSalahUmum: [
        { id: 'ibuprofen_400', alasan: 'Analgesia tidak menutupi diagnosis apendisitis, tetapi tablet ibuprofen 400 mg bukan jawaban baku untuk anak 24 kg yang muntah dan harus dipuasakan. Ini masalah dosis dan rute pada skenario ini, bukan larangan universal seluruh NSAID pada apendisitis.', bahaya: 'nonPrimer' },
        { id: 'loperamid_2', alasan: 'Nyeri perut anak sering diterjemahkan menjadi "mau mencret". Antimotilitas pada perut akut menutupi berkembangnya tanda peritoneal dan menunda rujukan — apalagi anak ini justru TIDAK mencret.', bahaya: 'kontraindikasi' },
        { id: 'amoxicillin_sirup', alasan: 'Apendisitis anak memerlukan jalur bedah. Amoksisilin oral tidak memberikan tata laksana definitif dan tidak boleh menjadi alasan memulangkan anak atau menunda transfer; antibiotik perioperatif dipilih pada jalur rumah sakit sesuai derajat penyakit dan protokol lokal.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pasang_infus', 'pemantauan_ketat_vital'],
      edukasi: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif', 'tanda_bahaya'],
      edukasiKritis: ['puasa_sambil_rujuk'],
    },
    stabilisasiWajib: ['pasang_infus'],
    clue: 'Nyeri yang berpindah dari sekitar pusar ke kuadran kanan bawah, anoreksia, muntah, subfebris, dan tanda peritoneal lokal mendukung apendisitis akut pada anak. Puasakan, pasang jalur IV, hitung analgesia berdasarkan berat badan aktual (parasetamol 10-15 mg/kg per dosis), pantau, lalu rujuk bedah. Analgesia tidak menutupi diagnosis; yang tidak aman adalah memilih sediaan dewasa tanpa menghitung dosis atau membiarkan antibiotik oral menunda rujukan.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menetapkan apendisitis akut sebagai kompetensi 3B dan meminta stabilisasi serta rujuk ke layanan sekunder. WSES Jerusalem 2025, terbit 2026, mencakup populasi anak dan menegaskan bahwa skor klinis serta imaging dapat meningkatkan akurasi, tetapi implementasi harus menyesuaikan sumber daya lokal. Pada anak ini, tanda klinis sudah kuat; USG bukan prasyarat transfer. NGT dipertimbangkan selektif bila muntah berlanjut, distensi, atau risiko aspirasi, bukan tindakan rutin yang harus menahan keberangkatan.`,
    catatanRealita: 'USG abdomen tidak diasumsikan tersedia rutin di Sukamaju, sehingga kasus ini sengaja dapat diselesaikan tanpa USG. Darah rutin atau urinalisis yang kebetulan ready boleh membantu diferensial, tetapi keputusan rujuk tidak menunggu leukositosis atau visualisasi apendiks.',
    mutiaraEbm: 'Leukosit normal atau hanya sedikit meningkat tidak menyingkirkan apendisitis pada anak; hasil laboratorium harus dibaca bersama perjalanan nyeri dan tanda peritoneal. Hilangnya nyeri secara mendadak setelah perburukan juga bukan jaminan sembuh karena perforasi dapat mengubah pola gejala sebelum peritonitis menyeluruh tampak.',
    konsekuensi: {
      narasi: 'Apendisitis anak yang dipulangkan dengan antibiotik oral atau "obat mencret" dapat berlanjut ke perforasi, peritonitis difus, sepsis, dan rawat inap lebih panjang.',
      kembaliHariMin: 0,
      kembaliHariMax: 2,
      kondisiKembali: 'Anak kembali dengan nyeri seluruh perut, perut tegang seperti papan, demam tinggi, muntah terus-menerus, dan lemas — apendiks sudah perforasi.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022: apendisitis akut 3B, stabilisasi dan rujuk. WSES Jerusalem 2025 edition (JAMA Surgery 2026): pendekatan berbasis risiko, populasi anak, dan adaptasi sumber daya lokal.',
    },
  }),

  /* ========================================================================
   * 4. Peritonitis Generalisata (K65.0, 3B, rujuk bedah) — kasus TERBERAT.
   * Poin ajar: perut papan + pasien diam membeku = perut akut bedah.
   *   Satu-satunya terapi definitif adalah kendali sumber di kamar operasi;
   *   tugas FKTP adalah resusitasi + antibiotik dosis-1 + transport cepat.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_peritonitis_generalisata',
    nama: 'Peritonitis Generalisata',
    icd10: 'K65.0',
    skdi: '3B',
    kategori: 'pencernaan',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'bedah',
    keluhanUtama: 'Perut saya mendadak sakit hebat di seluruh bagian sejak tadi pagi, sekarang saya tidak berani bergerak sedikit pun.',
    demografi: { usiaMin: 25, usiaMax: 55 },
    vital: { td: '96/62', nadi: 128, rr: 28, suhu: 38.6, spo2: 96 },
    pembuka: {
      tanya: 'Nyerinya mulai bagaimana, dan sekarang terasa di sebelah mana?',
      jawab: 'Mendadak seperti ditusuk di ulu hati sekitar enam jam lalu, Dok. Dalam satu jam menyebar ke seluruh perut. Sekarang semuanya sakit dan saya tidak berani bergerak.',
      oldcarts: ['onset', 'lokasi', 'karakter', 'keparahan'],
    },
    pertanyaan: [
      { id: 'q_gerak', kategori: 'rps', tanya: 'Apa yang membuat nyerinya bertambah?', jawab: 'Sedikit saja bergerak, batuk, atau tadi mobilnya lewat lubang — rasanya seperti disayat. Makanya saya diam telentang saja.', esensial: true, oldcarts: ['agravasi'] },
      { id: 'q_maag_nsaid', kategori: 'rpd', tanya: 'Sebelum ini sering nyeri ulu hati, atau minum obat pereda nyeri jangka panjang?', jawab: 'Sudah bertahun-tahun ulu hati saya perih, Dok. Saya juga hampir tiap hari minum obat rematik dari warung buat pinggang saya.', esensial: true, oldcarts: ['durasi'] },
      { id: 'q_muntah', kategori: 'rps', tanya: 'Ada mual atau muntah?', jawab: 'Mual berat, Dok, sudah muntah dua kali sejak nyerinya mulai.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_flatus', kategori: 'rps', tanya: 'Sejak nyeri, masih bisa buang angin atau buang air besar?', jawab: 'Tidak bisa sama sekali, Dok. Perut rasanya keras dan penuh.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_demam', kategori: 'rps', tanya: 'Ada demam atau menggigil?', jawab: 'Badan panas, Dok, dan tadi sempat menggigil.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_kencing', kategori: 'rps', tanya: 'Kencing terakhir kapan dan seberapa banyak?', jawab: 'Terakhir subuh, Dok, sedikit sekali dan warnanya pekat.' },
      { id: 'q_trauma', kategori: 'rps', tanya: 'Sebelum nyeri, ada benturan, jatuh, atau kecelakaan?', jawab: 'Tidak ada sama sekali, Dok.' },
      { id: 'q_operasi', kategori: 'rpd', tanya: 'Pernah menjalani operasi perut sebelumnya?', jawab: 'Belum pernah, Dok.' },
      { id: 'q_alkohol', kategori: 'sosial', tanya: 'Apakah Bapak minum minuman keras?', jawab: 'Tidak pernah, Dok, saya tidak minum.', distraktor: true },
      { id: 'q_makan_pedas', kategori: 'sosial', tanya: 'Sebelum sakit, apakah makan makanan pedas atau yang tidak biasa?', jawab: 'Kemarin malam makan sambal agak banyak, Dok. Apa gara-gara itu ya?', distraktor: true },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sakit berat, berbaring kaku tak berani bergerak; akral dingin, capillary refill 3 detik, takikardia, tekanan darah di batas bawah.', relevan: true },
      { region: 'abdomen', temuan: 'Perut datar dan TIDAK ikut gerak napas. Defans muskular generalisata ("perut papan"), nyeri tekan dan nyeri lepas di seluruh kuadran. Pekak hati MENGHILANG. Bising usus menurun sampai hilang.', relevan: true },
      { region: 'jantung', temuan: 'Takikardia reguler, nadi lemah, S1/S2 normal, murmur (-).', relevan: true },
      { region: 'toraks_paru', temuan: 'Napas cepat dan dangkal karena pasien menahan nyeri; vesikuler +/+, ronki -/-.', relevan: true },
      { region: 'neurologis', temuan: 'Sadar penuh, GCS 15, tidak ada defisit fokal.', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['K65.0', 'K25.5', 'K85.9'],
    tatalaksana: {
      obatBenar: ['ceftriaxone_1g_inj', 'metronidazol_inj_500'],
      obatAlternatif: [['nacl_09_inf', 'ringer_laktat_inf']],
      obatOpsional: ['ondansetron_4'],
      obatSalahUmum: [
        { id: 'ketorolak_30_inj', alasan: 'NSAID di sini menyerang pasien dari tiga arah sekaligus: ia memperberat mekanisme yang diduga menyebabkan perforasi (ulkus akibat obat rematik warung yang diminum bertahun-tahun), mengganggu hemostasis menjelang laparotomi, dan memperdalam cedera ginjal pada pasien yang ureum/kreatininnya sudah naik karena hipoperfusi. Nyeri peritonitis diredakan dengan resusitasi cairan dan opioid titrasi di RS.', bahaya: 'kontraindikasi' },
        { id: 'hyoscine_butilbromida_20_inj', alasan: 'Nyeri dengan defans generalisata bukan kolik akibat spasme. Antispasmodik tidak mengendalikan perforasi, hipoperfusi, atau kontaminasi intraabdomen dan tidak boleh menggantikan resusitasi serta transfer.', bahaya: 'kontraindikasi' },
        { id: 'omeprazole_20', alasan: 'Rute oral tidak sesuai pada pasien yang muntah dan harus dipuasakan. PPI juga tidak menutup perforasi atau menggantikan kendali sumber; memberikannya lalu "observasi dulu" akan menunda tata laksana definitif.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pasang_infus', 'resusitasi_cairan_kristaloid', 'dekompresi_ngt', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        { id: 'bilas_lambung', alasan: 'Bilas lambung pada dugaan perforasi organ berongga dapat mendorong isi lambung keluar melalui lubang perforasi dan memperluas kontaminasi rongga perut, selain memicu muntah dan aspirasi pada pasien yang sudah syok. NGT di sini dipasang untuk DEKOMPRESI — dialirkan agar lambung kosong dan distensi berkurang, bukan untuk dibilas.', bahaya: 'berbahaya' },
      ],
      edukasi: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif', 'tanda_bahaya', 'hentikan_obat_pencetus'],
      edukasiKritis: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif'],
      terapiKritis: ['resusitasi_cairan_kristaloid', 'ceftriaxone_1g_inj', 'metronidazol_inj_500'],
    },
    stabilisasiWajib: ['pasang_infus', 'resusitasi_cairan_kristaloid', 'dekompresi_ngt', 'pemantauan_ketat_vital'],
    clue: 'Nyeri mendadak yang menjadi menyeluruh, perut papan yang tidak ikut bernapas, pasien membeku, takikardia, oliguria, dan perfusi memburuk = peritonitis generalisata dengan hipoperfusi, kemungkinan akibat perforasi organ berongga. Berikan kristaloid terukur, antibiotik parenteral dosis pertama yang mencakup Gram-negatif dan anaerob (seftriakson plus metronidazol), dekompresi NGT bila aman, puasa, pemantauan ketat, lalu transfer segera. Antibiotik dan cairan tidak menggantikan kendali sumber di rumah sakit.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan peritonitis sebagai kompetensi 3B dan kegawatan bedah: diagnosis ditegakkan klinis, lalu pasien dipuasakan, diresusitasi, diberi antibiotik, dan dirujuk cito ke layanan bedah. Foto polos disebut sebagai penunjang bila tersedia, bukan syarat rujuk. SIS 2024 dan WSES global pathways 2021 menegaskan kombinasi stabilisasi fisiologis, antimikroba yang sesuai, dan kendali sumber dini.`,
    catatanRealita: 'Skenario menyatakan seftriakson, metronidazol infus, NGT, monitoring, dan ambulans siap. Foto polos abdomen tidak diasumsikan tersedia dan bukan prasyarat rujuk. Bila salah satu antibiotik atau NGT tidak ready, lakukan intervensi aman yang tersedia, dokumentasikan kekurangannya, dan jangan menunda transport menuju fasilitas kendali sumber.',
    mutiaraEbm: 'Hilangnya pekak hati atau udara bebas pada foto tegak dapat membantu bila pemeriksaan tersedia, tetapi hasil foto polos yang normal tidak menyingkirkan perforasi. Diagnosis peritonitis terutama klinis. Suhu normal juga tidak memberi rasa aman pada lansia, pengguna steroid, atau pasien dengan perfusi yang memburuk.',
    konsekuensi: {
      narasi: 'Peritonitis yang tidak segera diresusitasi dan dirujuk dapat berkembang menjadi syok sepsis dan kegagalan organ multipel. Penundaan antibiotik yang tepat dan kendali sumber memperburuk luaran.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Pasien kembali dalam keadaan syok: kesadaran menurun, akral dingin, tekanan darah tak terukur, dan produksi urine berhenti — syok sepsis akibat peritonitis yang tak terkendali.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022: peritonitis 3B, resusitasi, antibiotik, puasa, dan rujuk cito. SIS 2024 dan WSES global pathways 2021: stabilisasi, terapi antimikroba, serta kendali sumber dini.',
    },
  }),

  /* ========================================================================
   * 5. Retensi Urin Akut pada Pembesaran Prostat (R33.9, 3B, rujuk bedah)
   * Poin ajar: contoh terbaik "FKTP WAJIB BERTINDAK DULU, bukan langsung
   *   lempar" — kateterisasi meredakan seketika, baru kemudian rujuk.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_retensio_urin_akut',
    nama: 'Retensi Urin Akut pada Pembesaran Prostat',
    icd10: 'R33.9',
    skdi: '3B',
    kategori: 'pencernaan',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'bedah',
    keluhanUtama: 'Sejak semalam saya sama sekali tidak bisa buang air kecil, Dok, perut bawah rasanya penuh dan nyeri sekali.',
    demografi: { usiaMin: 55, usiaMax: 80, jenisKelamin: 'L' },
    vital: { td: '148/88', nadi: 96, rr: 20, suhu: 36.8, spo2: 98 },
    pembuka: {
      tanya: 'Sejak kapan sama sekali tidak bisa buang air kecil, dan bagaimana rasanya sekarang?',
      jawab: 'Sejak sekitar jam sepuluh malam, Dok. Rasanya ingin sekali kencing tapi tidak setetes pun keluar. Perut bawah makin menggembung dan nyeri.',
      oldcarts: ['onset', 'durasi', 'lokasi', 'keparahan'],
    },
    pertanyaan: [
      { id: 'q_pancaran', kategori: 'rps', tanya: 'Beberapa bulan terakhir, bagaimana pancaran kencingnya?', jawab: 'Sudah lama melemah, Dok. Setahun ini pancarannya kecil, harus mengejan dulu, dan di akhir cuma menetes-netes.', esensial: true, oldcarts: ['durasi'] },
      { id: 'q_malam', kategori: 'rps', tanya: 'Berapa kali bangun malam untuk kencing?', jawab: 'Empat sampai lima kali semalam, Dok, sudah bertahun-tahun begitu.', esensial: true, oldcarts: ['waktu'] },
      { id: 'q_tuntas', kategori: 'rps', tanya: 'Setelah kencing, terasa masih ada sisa atau tidak tuntas?', jawab: 'Iya, selalu terasa belum habis. Tidak lama kemudian sudah ingin lagi.', esensial: true },
      { id: 'q_obat_baru', kategori: 'rpd', tanya: 'Beberapa hari ini minum obat baru, misalnya obat flu, obat pilek, atau obat alergi?', jawab: 'Dua hari ini saya minum obat flu warung, Dok, karena hidung saya mampet.', esensial: true },
      { id: 'q_darah_kencing', kategori: 'rps', tanya: 'Sebelumnya pernah kencing bercampur darah atau keluar seperti pasir?', jawab: 'Tidak pernah, Dok, warnanya kuning biasa saja.', esensial: true },
      { id: 'q_pinggang_demam', kategori: 'rps', tanya: 'Ada nyeri pinggang atau demam?', jawab: 'Pinggang tidak sakit, Dok, badan juga tidak panas.' },
      { id: 'q_bab', kategori: 'rps', tanya: 'Buang air besarnya bagaimana, ada sembelit?', jawab: 'Agak sembelit dua hari ini, Dok.' },
      { id: 'q_riwayat_prostat', kategori: 'rpd', tanya: 'Pernah diperiksa dan dikatakan prostatnya membesar?', jawab: 'Pernah dibilang begitu tiga tahun lalu, Dok, tapi saya tidak pernah kontrol lagi.' },
      { id: 'q_merokok', kategori: 'sosial', tanya: 'Bapak merokok?', jawab: 'Sudah berhenti sepuluh tahun lalu, Dok.', distraktor: true },
      { id: 'q_lutut', kategori: 'rps', tanya: 'Ada keluhan nyeri lutut atau sendi?', jawab: 'Lutut kanan memang sering ngilu kalau mau hujan, Dok. Tapi tidak ada hubungannya, kan?', distraktor: true },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak gelisah menahan nyeri, terus mengubah posisi; afebris. Tekanan darah meningkat sebagai respons nyeri.', relevan: true },
      { region: 'abdomen', temuan: 'Buli-buli teraba sebagai massa kistik setinggi tiga jari di bawah pusat; nyeri tekan suprapubik (+); perkusi suprapubik pekak (globe vesicalis). Tidak ada defans; bising usus normal.', relevan: true },
      { region: 'ekstremitas', temuan: 'Colok dubur: tonus sfingter baik, prostat membesar simetris, kenyal, permukaan licin, nodul (-), nyeri tekan (-). Tidak teraba massa rektum.', relevan: true },
      { region: 'neurologis', temuan: 'Kekuatan dan sensibilitas kedua tungkai normal, refleks fisiologis normal, tidak ada anestesia perianal — menyingkirkan sindrom kauda ekuina sebagai penyebab retensi.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-), tidak ada edema tungkai.', relevan: false },
    ],
    lab: [
      { id: 'urinalisis', hasil: 'Diambil setelah kateterisasi: leukosit 3-5/LPB, nitrit (-), eritrosit 0-2/LPB — tidak mendukung infeksi.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['R33.9', 'N40', 'N39.0'],
    tatalaksana: {
      obatBenar: ['tamsulosin_04'],
      obatSalahUmum: [
        { id: 'furosemid_40', alasan: 'Refleks "tidak keluar kencing → beri diuretik" berbahaya pada retensi OBSTRUKTIF. Masalahnya adalah urine tidak punya jalan keluar; menambah produksi urine ke buli yang sudah teregang memperberat nyeri dan tidak membebaskan sumbatan. Yang dibutuhkan adalah dekompresi, bukan diuresis.', bahaya: 'kontraindikasi' },
        { id: 'ctm_4', alasan: 'Antihistamin generasi pertama bersifat antikolinergik — justru salah satu pencetus tersering retensi urin pada pembesaran prostat, dan kemungkinan besar itulah isi "obat flu warung" yang dua hari ini diminum pasien. Meresepkannya menambah bensin ke api; obat flu yang sedang diminum malah harus DIHENTIKAN.', bahaya: 'kontraindikasi' },
        { id: 'ciprofloxacin_500', alasan: 'Tanpa demam, tanpa nyeri pinggang, dan dengan urinalisis bersih, tidak ada infeksi yang disasar — retensi ini murni mekanis. Antibiotik refleks pasca-kateter tidak mencegah infeksi dan hanya menambah tekanan resistensi.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pemasangan_kateter_urin'],
      edukasi: ['hentikan_obat_pencetus', 'tanda_bahaya', 'kontrol_rutin'],
      edukasiKritis: ['hentikan_obat_pencetus'],
    },
    stabilisasiWajib: ['pemasangan_kateter_urin'],
    clue: 'Tidak bisa berkemih sejak semalam + buli teraba dan pekak suprapubik + riwayat pancaran melemah, mengejan, menetes, dan nokturia = retensi urin akut pada pembesaran prostat, kemungkinan dipicu obat flu antikolinergik. Bila alat dan operator siap serta tidak ada dugaan cedera uretra, lakukan satu upaya kateterisasi lembut untuk dekompresi, catat volume awal, lalu pantau diuresis dan rujuk penyebabnya. Mulai tamsulosin untuk meningkatkan peluang pelepasan kateter dan hentikan pencetus. Resistensi, darah di meatus, riwayat trauma pelvis/uretra, atau upaya gagal berarti berhenti dan transfer — bukan mengulang secara traumatik.',
    panduanResmi: `${PPK_FLOOR} PPK 1186/2022 tidak mempunyai bab diagnosis-spesifik retensi urin akut. EAU 2026 menempatkan drainase kandung kemih tepat waktu, penilaian obstruksi dan komplikasi, serta tindak lanjut penyebab sebagai inti; retensi berulang atau refrakter memerlukan jejaring urologi.`,
    catatanRealita: 'Untuk encounter ini Sukamaju menyatakan kateter Foley ukuran sesuai, jeli steril, urine bag, dan operator terlatih siap. Kesiapan itu bukan asumsi universal: bila alat/operator tidak ready atau satu upaya lembut gagal, dokumentasikan dan transfer tanpa manipulasi berulang. USG dan kreatinin tidak dijadikan prasyarat dekompresi atau rujuk.',
    mutiaraEbm: 'Dua ajaran klasik yang menyesatkan di sini. Pertama: "kalau masih ada urine menetes berarti bukan retensi" — justru sebaliknya, buli yang terlalu penuh sering merembes sedikit-sedikit (overflow), sehingga laporan "masih keluar sedikit" tidak menyingkirkan apa pun; buli yang teraba dan pekak suprapubik jauh lebih dapat dipercaya. Kedua: "kosongkan buli bertahap, jangan lebih dari 500 mL sekaligus, nanti terjadi perdarahan dan syok" — ini tidak didukung bukti. Pengosongan lengkap sekaligus terbukti sama amannya, dan menjepit kateter berkala hanya menunda pemulihan serta menambah risiko sumbatan. Yang benar-benar perlu dipantau adalah diuresis pasca-sumbatan (urine mengalir sangat banyak setelah kateter terpasang) pada retensi yang sudah kronis.',
    konsekuensi: {
      narasi: 'Retensi yang dibiarkan tanpa dekompresi membuat tekanan balik ke atas: hidronefrosis dan gagal ginjal akut pascarenal dalam hitungan hari, di samping nyeri hebat yang tak perlu dan risiko robekan dinding buli yang teregang.',
      kembaliHariMin: 1,
      kembaliHariMax: 3,
      kondisiKembali: 'Pasien kembali dengan perut bawah sangat menggembung, mual, lemas, dan bengkak — kreatinin melonjak dengan hidronefrosis bilateral akibat sumbatan yang tak pernah dibebaskan.',
      guideline: 'EAU Male LUTS 2026: lakukan drainase kandung kemih pada retensi bermakna, nilai penyebab dan komplikasi, lalu koordinasikan trial without catheter serta evaluasi urologi sesuai konteks.',
    },
  }),

  /* ========================================================================
   * 6. Kolik Ureter oleh Batu dengan Obstruksi (N20.1, 3A, rujuk bedah)
   * Poin ajar: pasien GELISAH tak bisa diam — kontras diagnostik langsung
   *   dengan peritonitis (kasus 4) yang justru membeku.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_kolik_ureter_obstruksi',
    nama: 'Kolik Ureter — Suspek Batu Obstruktif',
    icd10: 'N20.1',
    kepastianDiagnosis: 'suspek',
    skdi: '3A',
    kategori: 'pencernaan',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'bedah',
    keluhanUtama: 'Pinggang kiri saya nyeri hebat hilang-timbul sejak subuh, menjalar ke selangkangan, sampai saya tidak bisa diam.',
    demografi: { usiaMin: 30, usiaMax: 55 },
    vital: { td: '138/86', nadi: 100, rr: 20, suhu: 37.0, spo2: 98 },
    pembuka: {
      tanya: 'Nyerinya terasa di mana, menjalar ke mana, dan bagaimana polanya?',
      jawab: 'Mulai di pinggang kiri sejak subuh, Dok. Datangnya seperti gelombang: memuncak beberapa menit sampai saya berkeringat, lalu agak reda, lalu datang lagi. Menjalarnya turun ke selangkangan.',
      oldcarts: ['onset', 'lokasi', 'radiasi', 'karakter'],
    },
    pertanyaan: [
      { id: 'q_posisi', kategori: 'rps', tanya: 'Adakah posisi yang membuat nyerinya berkurang?', jawab: 'Tidak ada satu pun, Dok. Sudah saya coba tiduran, jongkok, jalan mondar-mandir, sampai guling-guling di lantai — tidak ada yang menolong.', esensial: true, oldcarts: ['agravasi'] },
      { id: 'q_kencing_darah', kategori: 'rps', tanya: 'Kencingnya berubah warna, ada darah, atau terasa perih?', jawab: 'Tadi pagi sekali warnanya agak keruh kemerahan, Dok, dan agak perih di akhir kencing.', esensial: true },
      { id: 'q_mual', kategori: 'rps', tanya: 'Ada mual atau muntah?', jawab: 'Mual sekali dan sudah muntah dua kali, Dok. Tapi perut saya sendiri tidak sakit.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_demam', kategori: 'rps', tanya: 'Ada demam atau menggigil?', jawab: 'Tidak ada, Dok, badan saya tidak panas.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_riwayat_batu', kategori: 'rpd', tanya: 'Pernah keluar batu saat kencing, atau dikatakan ada batu di ginjal?', jawab: 'Dua tahun lalu pernah nyeri seperti ini, Dok, lalu ada batu kecil keluar sendiri waktu kencing.', esensial: true },
      { id: 'q_ginjal_tunggal', kategori: 'rpd', tanya: 'Pernah dikatakan salah satu ginjal tidak berfungsi, atau pernah diangkat?', jawab: 'Tidak pernah, Dok, setahu saya kedua ginjal saya baik.' },
      { id: 'q_minum', kategori: 'sosial', tanya: 'Sehari-hari minum berapa banyak, dan bekerja di mana?', jawab: 'Saya kerja di pabrik yang panas, Dok, sering berkeringat banyak tapi jarang minum. Mungkin tidak sampai satu botol besar sehari.' },
      { id: 'q_obat', kategori: 'rpd', tanya: 'Sedang minum obat rutin atau suplemen tertentu?', jawab: 'Tidak ada obat rutin, Dok.' },
      { id: 'q_maag', kategori: 'rpd', tanya: 'Punya riwayat sakit maag?', jawab: 'Kadang perih kalau telat makan, Dok, tapi sekarang tidak.', distraktor: true },
      { id: 'q_keluarga_dm', kategori: 'rpk', tanya: 'Di keluarga ada yang sakit gula atau darah tinggi?', jawab: 'Ibu saya darah tinggi, Dok.', distraktor: true },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'GELISAH, tidak bisa berbaring tenang, terus berpindah posisi mencari posisi nyaman; berkeringat; afebris. (Kontras diagnostik: pasien peritonitis justru berbaring kaku dan menolak bergerak.)', relevan: true },
      { region: 'abdomen', temuan: 'Nyeri ketok kostovertebra (CVA) kiri (+). Abdomen supel, bising usus normal, TIDAK ada defans maupun nyeri lepas. Buli tidak teraba penuh.', relevan: true },
      { region: 'jantung', temuan: 'Takikardia ringan sebagai respons nyeri, S1/S2 reguler, murmur (-).', relevan: false },
      { region: 'ekstremitas', temuan: 'Akral hangat, perfusi baik, tidak ada edema.', relevan: false },
    ],
    lab: [
      { id: 'urinalisis', hasil: 'Eritrosit 25-30/LPB, leukosit 2-3/LPB, nitrit (-), pH 5,5 — darah mikroskopik tanpa bukti infeksi.', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['N20.1', 'N23', 'N10'],
    tatalaksana: {
      obatBenar: [],
      obatAlternatif: [['ketorolak_30_inj', 'natrium_diklofenak_50']],
      obatOpsional: ['hyoscine_butilbromida_20_inj', 'ondansetron_4', 'nacl_09_inf'],
      obatSalahUmum: [
        { id: 'furosemid_40', alasan: 'Diuretik "supaya batunya terdorong keluar" adalah mitos yang merugikan: di hulu sumbatan tekanan justru naik, nyeri bertambah, dan risiko cedera ginjal meningkat. Tinjauan sistematik tidak menemukan manfaat hidrasi paksa maupun diuretik pada kolik ureter akut.', bahaya: 'kontraindikasi' },
        { id: 'ciprofloxacin_500', alasan: 'Tanpa demam dan dengan urinalisis tanpa tanda infeksi, ini kolik obstruktif STERIL — antibiotik tidak mengubah perjalanan batu. Justru kebalikannya yang harus diwaspadai: bila muncul demam/menggigil pada ginjal yang tersumbat, itu obstruksi TERINFEKSI, sebuah kegawatan urologi yang menuntut DRAINASE segera dan tidak akan tertolong oleh antibiotik oral dari FKTP.', bahaya: 'nonPrimer' },
        { id: 'tramadol_50', alasan: 'Opioid bukan pilihan pertama kolik ureter. NSAID terbukti meredakan nyeri lebih efektif, dengan lebih sedikit muntah dan lebih sedikit kebutuhan obat penyelamat tambahan — sebagian karena NSAID menurunkan tekanan intraureter, bukan sekadar menumpulkan persepsi nyeri. Opioid disimpan untuk pasien yang NSAID-nya kontraindikasi.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pasang_infus'],
      edukasi: ['minum_air_cukup', 'tanda_bahaya', 'kontrol_rutin'],
      edukasiKritis: ['tanda_bahaya'],
    },
    clue: 'Nyeri pinggang kolik menjalar ke selangkangan, pasien gelisah tak bisa diam, riwayat batu, dan hematuria mikroskopik sangat mendukung kolik ureter. Tata laksana FKTP adalah analgesia NSAID lini pertama bila aman, antiemetik/cairan untuk kehilangan aktual bila perlu, lalu rujuk sesuai kompetensi 3A untuk memastikan ukuran, lokasi, dan derajat obstruksi. Jangan memberi hidrasi paksa atau diuretik untuk "mendorong" batu. Tamsulosin tidak dijadikan jawaban sebelum imaging karena manfaat terapi ekspulsif bergantung pada batu ureter distal yang terkonfirmasi dan ukurannya. Demam/menggigil, ginjal tunggal, anuria, penurunan fungsi ginjal, atau nyeri tak teratasi mengubahnya menjadi rujukan emergensi.',
    panduanResmi: 'PPK FKTP KMK 1186/2022 tidak mempunyai bab diagnosis-spesifik kolik ureter pada crosswalk 167 bab; jangan mengatribusikan rincian ukuran batu atau terapi ekspulsif ke PPK. PNPK Tata Laksana Batu Saluran Kemih KMK HK.01.07/MENKES/1936/2022 menjadi sumber langsung: tangani nyeri, nilai infeksi/obstruksi dan faktor ginjal, gunakan imaging di layanan berkemampuan, lalu tentukan observasi, terapi ekspulsif, atau intervensi menurut ukuran serta lokasi batu.',
    catatanRealita: 'USG abdomen dan fungsi ginjal tidak diasumsikan tersedia di Sukamaju; keduanya ditempuh lewat jejaring dan tidak menunda analgesia atau rujukan. Karena ukuran/lokasi belum diketahui, tamsulosin tidak diwajibkan. Ketorolak hanya diberikan setelah kontraindikasi NSAID disaring; pasien dengan sepsis obstruktif tidak boleh dipulangkan hanya karena nyeri membaik.',
    mutiaraEbm: 'Cara pasien MENAHAN nyeri adalah petunjuk diagnostik yang sering diabaikan. Pasien kolik ureter gelisah, berguling, dan tak menemukan posisi nyaman — nyerinya berasal dari otot polos yang berkontraksi melawan sumbatan, dan gerakan tidak memperburuknya. Bandingkan dengan peritonitis: pasien berbaring kaku dan menolak bergerak karena setiap guncangan menggeser permukaan peritoneum yang meradang. Karena itu "pasien yang berguling-guling kesakitan" hampir tidak pernah peritonitis, dan sebaliknya nyeri perut hebat pada pasien yang membeku harus dianggap perut akut sampai terbukti bukan. Jebakan kedua: hematuria TIDAK selalu ada — sekitar 10-15% kolik batu memiliki urinalisis tanpa darah sama sekali (terutama bila ureter tersumbat total), sehingga urinalisis bersih tidak menyingkirkan batu.',
    konsekuensi: {
      narasi: 'Obstruksi yang dibiarkan menekan ginjal dari dalam; bila berlangsung berminggu-minggu, kerusakan parenkim menjadi permanen. Yang paling ditakuti adalah bila ginjal tersumbat itu terinfeksi: urosepsis berkembang dalam hitungan jam dan tidak akan tertolong tanpa drainase segera.',
      kembaliHariMin: 2,
      kembaliHariMax: 7,
      kondisiKembali: 'Pasien kembali dengan demam tinggi, menggigil, nyeri pinggang hebat, dan tekanan darah turun — obstruksi yang terinfeksi berkembang menjadi urosepsis.',
      guideline: 'PNPK Tata Laksana Batu Saluran Kemih KMK HK.01.07/MENKES/1936/2022 — analgesia lebih dulu; imaging dan fungsi ginjal melalui jejaring; obstruksi terinfeksi membutuhkan drainase segera.',
    },
  }),

  /* ========================================================================
   * 7. Hemoroid Interna Derajat IV (K64.3, 3A, rujuk bedah)
   * Poin ajar: derajat IV = prolaps menetap → di luar kompetensi konservatif
   *   FKTP. Jangan biarkan "wasir" menjelaskan anemia tanpa menjaring
   *   keganasan. Konsisten dgn kasus `hemoroid_grade1` (kasusRespGi.ts) yg
   *   konservatif & menekankan red flag.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_hemoroid_interna_derajat4',
    nama: 'Hemoroid Interna Derajat IV dengan Anemia',
    icd10: 'K64.3',
    skdi: '3A',
    kategori: 'pencernaan',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'bedah',
    keluhanUtama: 'Ada benjolan di dubur yang sekarang tidak bisa dimasukkan lagi, Dok, dan tiap buang air besar darahnya menetes.',
    demografi: { usiaMin: 40, usiaMax: 65 },
    vital: { td: '126/78', nadi: 92, rr: 18, suhu: 36.7, spo2: 98 },
    pembuka: {
      tanya: 'Sejak kapan benjolannya tidak bisa dimasukkan lagi, dan bagaimana perdarahannya?',
      jawab: 'Dulu benjolannya keluar waktu buang air besar lalu masuk sendiri. Setahun terakhir harus saya dorong pakai jari, dan tiga bulan ini sudah tidak mau masuk sama sekali. Darahnya menetes merah segar tiap habis buang air besar.',
      oldcarts: ['onset', 'durasi', 'karakter'],
    },
    pertanyaan: [
      { id: 'q_derajat', kategori: 'rps', tanya: 'Kalau benjolan itu didorong dengan jari, masih bisa masuk walau sebentar?', jawab: 'Sudah tidak bisa sama sekali, Dok. Saya dorong sekuat apa pun tetap di luar, malah jadi perih.', esensial: true },
      { id: 'q_darah_pola', kategori: 'rps', tanya: 'Darahnya bagaimana: menetes, bercampur di dalam tinja, atau menyemprot?', jawab: 'Menetes ke air setelah tinjanya keluar, Dok, merahnya segar. Tidak tercampur di dalam tinjanya.', esensial: true, oldcarts: ['karakter'] },
      { id: 'q_nyeri', kategori: 'rps', tanya: 'Benjolannya nyeri hebat, atau lebih ke tidak nyaman?', jawab: 'Tidak sampai nyeri hebat, Dok. Lebih ke mengganjal dan basah terus. Kalau duduk lama baru pegal.', esensial: true, oldcarts: ['keparahan'] },
      { id: 'q_anemia', kategori: 'rps', tanya: 'Akhir-akhir ini terasa lemas, cepat capek, atau pusing kalau berdiri?', jawab: 'Iya, Dok, setahun ini gampang capek. Kalau berdiri mendadak kepala saya berkunang-kunang.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_red_flag', kategori: 'rps', tanya: 'Ada perubahan pola buang air besar, tinja jadi kecil-kecil memanjang, atau berat badan turun?', jawab: 'Berat badan saya stabil, Dok, tinjanya bentuknya biasa. Cuma memang sering keras dan saya harus mengejan lama.', esensial: true },
      { id: 'q_serat', kategori: 'sosial', tanya: 'Sehari-hari makan sayur dan buah berapa banyak, dan minum berapa gelas?', jawab: 'Jarang sayur, Dok, saya suka gorengan. Minum paling tiga gelas sehari.' },
      { id: 'q_pekerjaan', kategori: 'sosial', tanya: 'Pekerjaannya banyak duduk atau angkat berat?', jawab: 'Sopir truk, Dok, duduk belasan jam sehari.' },
      { id: 'q_keluarga_kanker', kategori: 'rpk', tanya: 'Di keluarga ada yang sakit kanker usus besar?', jawab: 'Setahu saya tidak ada, Dok.' },
      { id: 'q_alergi_makanan', kategori: 'rpd', tanya: 'Ada alergi makanan tertentu?', jawab: 'Tidak ada, Dok.', distraktor: true },
      { id: 'q_rokok', kategori: 'sosial', tanya: 'Bapak merokok?', jawab: 'Sehari sebungkus, Dok, sejak muda.', distraktor: true },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Konjungtiva palpebra pucat; tampak tidak sakit berat, afebris.', relevan: true },
      { region: 'ekstremitas', temuan: 'Inspeksi anus: massa mukosa keunguan menonjol melingkar di luar anus, TIDAK dapat direposisi walau didorong; permukaan lembap dengan bercak darah segar, tanpa nekrosis maupun nyeri hebat. Colok dubur: tonus sfingter baik, tidak teraba massa keras di rektum; sarung tangan berlumur darah segar.', relevan: true },
      { region: 'kulit', temuan: 'Kulit perianal lembap dan sedikit lecet akibat rembesan lendir kronis; tidak ada fluktuasi maupun kemerahan yang mengarah ke abses.', relevan: true },
      { region: 'jantung', temuan: 'Takikardia ringan, S1/S2 reguler, murmur sistolik lembut derajat 1/6 (bising aliran) — konsisten dengan anemia.', relevan: true },
      { region: 'abdomen', temuan: 'Supel, tidak nyeri tekan, tidak teraba massa, bising usus normal.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Hb 9,4 g/dL, MCV 72 fL, MCH 23 pg — anemia mikrositik hipokrom; leukosit 7.600/µL; trombosit normal.', flag: 'rendah', relevan: true },
    ],
    diagnosisBanding: ['K64.3', 'K62.5', 'C20'],
    tatalaksana: {
      obatBenar: ['laktulosa_syr', 'tablet_fe'],
      obatSalahUmum: [
        { id: 'prednison_5', alasan: 'Kortikosteroid SISTEMIK tidak punya peran pada hemoroid: ia tidak mengembalikan pleksus yang sudah prolaps menetap, dan pemakaian berulang justru menipiskan mukosa serta mengganggu penyembuhan. Derajat IV adalah masalah ANATOMIS — tidak ada obat yang mengembalikannya ke dalam.', bahaya: 'nonPrimer' },
        { id: 'ciprofloxacin_500', alasan: 'Tidak ada infeksi di sini: benjolan yang lembap dan berdarah bukan berarti terinfeksi. Antibiotik tanpa indikasi hanya menambah tekanan resistensi dan memberi kesan pasien "sudah diobati" sehingga rujukan tertunda.', bahaya: 'nonPrimer' },
        { id: 'natrium_diklofenak_50', alasan: 'NSAID oral pada pasien yang sudah anemia berat karena perdarahan saluran cerna kronis menambah risiko perdarahan lewat iritasi mukosa dan gangguan fungsi trombosit. PPK juga secara khusus meminta OAINS DIHINDARI pada hemoroid. Keluhan utama pasien ini bukan nyeri hebat, melainkan prolaps dan perdarahan — obat nyeri tidak menyasar keduanya.', bahaya: 'kontraindikasi' },
      ],
      edukasi: ['diet_tinggi_serat', 'hindari_mengejan', 'minum_air_cukup', 'persiapan_rujukan_operatif', 'tanda_bahaya'],
      edukasiKritis: ['diet_tinggi_serat', 'hindari_mengejan'],
    },
    clue: 'Benjolan anus yang prolaps menetap dan tidak dapat direposisi = hemoroid interna derajat IV, disertai anemia mikrositik yang sangat mungkin akibat kekurangan besi. Perawatan FKTP tetap penting — serat, cairan, hindari mengejan, pelunak tinja, dan besi oral — tetapi tidak mengoreksi prolaps derajat IV; pasien memerlukan evaluasi bedah untuk terapi definitif. Pada pria dewasa, anemia defisiensi besi tidak boleh otomatis dianggap selesai dijelaskan oleh wasir: tuliskan kebutuhan penelusuran sumber perdarahan gastrointestinal pada rujukan meski berat badan dan pola BAB stabil.',
    panduanResmi: `${PPK_FLOOR} Bab hemoroid PPK 1186/2022 hanya menjadi acuan dasar terkait untuk pemeriksaan, terapi konservatif, batas kompetensi, dan kewaspadaan keganasan; ia bukan pedoman definitif grade IV yang identik. AGA Clinical Practice Update 2026 menyatakan hemoroid interna grade IV memerlukan hemoroidektomi dan perdarahan tetap harus dievaluasi secara proporsional.`,
    catatanRealita: 'Darah rutin dinyatakan siap di Sukamaju, tetapi ferritin, endoskopi, dan tindakan definitif berada di jejaring. Keterbatasan itu tidak boleh menjadi alasan menutup diagnosis pada “wasir”: FKTP mendokumentasikan anemia, memulai dukungan yang aman, dan memastikan rujukan menilai prolaps sekaligus sumber perdarahan lain.',
    mutiaraEbm: 'Menemukan hemoroid tidak menyingkirkan kanker kolorektal: keduanya dapat hidup berdampingan. Pada pria dewasa dengan anemia defisiensi besi, sumber perdarahan gastrointestinal tetap perlu ditelusuri sesuai risiko dan jejaring, bukan dianggap wajar hanya karena wasir terlihat. Derajat hemoroid ditentukan oleh prolaps, bukan banyaknya darah atau nyeri; hemoroid interna derajat IV dapat besar tetapi tidak sangat nyeri karena berada di atas linea dentata. Karena itu “tidak sakit” tidak sama dengan “tidak berat”.',
    konsekuensi: {
      narasi: 'Hemoroid derajat IV yang hanya diberi obat wasir terus berdarah: anemia memburuk sampai memerlukan transfusi, dan pasien berisiko mengalami inkarserasi/trombosis prolaps yang menjadi kegawatan nyeri hebat. Risiko terbesar bukan hemoroidnya, melainkan keganasan kolorektal yang tak pernah dijaring karena perdarahannya sudah "ada penjelasannya".',
      kembaliHariMin: 14,
      kembaliHariMax: 60,
      kondisiKembali: 'Pasien kembali makin pucat dan sesak saat beraktivitas ringan dengan Hb yang terus turun; benjolan sempat terjepit dan membiru, nyeri hebat, tak bisa duduk sama sekali.',
      guideline: 'PPK 1186/2022 memberi acuan dasar pemeriksaan dan batas rujuk; AGA Clinical Practice Update 2026 menempatkan hemoroid grade IV pada jalur hemoroidektomi dan menegaskan evaluasi perdarahan yang memadai.',
    },
  }),

  /* ========================================================================
   * 8. Abses Perianal (K61.0, 3B, rujuk bedah)
   * Poin ajar PENTING: drainase tetap terapi definitif, tetapi dugaan perluasan
   *   iskioanal pada pasien sistemik/diabetes memerlukan jalur bedah yang tepat.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_abses_perianal',
    nama: 'Abses Perianal pada Penyandang Diabetes',
    icd10: 'K61.0',
    skdi: '3B',
    kategori: 'pencernaan',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'bedah',
    keluhanUtama: 'Dubur saya nyeri berdenyut hebat sejak tiga hari, Dok, sampai tidak bisa duduk dan tidak bisa tidur.',
    demografi: { usiaMin: 25, usiaMax: 50 },
    vital: { td: '128/80', nadi: 104, rr: 20, suhu: 38.5, spo2: 98 },
    pembuka: {
      tanya: 'Nyerinya seperti apa, dan apa yang membuatnya tak tertahankan?',
      jawab: 'Berdenyut terus-menerus seperti ada yang mau pecah, Dok, makin lama makin hebat. Duduk tidak bisa, tidur pun tidak bisa. Saya cuma bisa berdiri atau miring.',
      oldcarts: ['onset', 'karakter', 'keparahan', 'agravasi'],
    },
    pertanyaan: [
      { id: 'q_benjolan', kategori: 'rps', tanya: 'Ada benjolan di sekitar dubur? Sejak kapan dan bagaimana perubahannya?', jawab: 'Ada, Dok, di sisi kiri dubur. Awalnya kecil seperti bisul, tiga hari ini membesar cepat, merah, dan panas kalau dipegang.', esensial: true, oldcarts: ['onset', 'lokasi'] },
      { id: 'q_demam', kategori: 'rps', tanya: 'Ada demam atau menggigil?', jawab: 'Badan panas dua hari ini, Dok, dan semalam sempat menggigil.', esensial: true, oldcarts: ['penyerta'] },
      { id: 'q_bab', kategori: 'rps', tanya: 'Buang air besarnya bagaimana?', jawab: 'Saya tahan-tahan, Dok, karena sakitnya luar biasa kalau harus BAB.', esensial: true },
      { id: 'q_nanah', kategori: 'rps', tanya: 'Ada cairan atau nanah yang keluar dari benjolan atau dari dubur?', jawab: 'Belum ada yang keluar, Dok, masih menggembung saja.', esensial: true },
      { id: 'q_dm', kategori: 'rpd', tanya: 'Punya penyakit gula, atau pernah diperiksa gula darahnya?', jawab: 'Ya, Dok, saya sakit gula sudah lima tahun. Tapi obatnya sering putus dan sudah setahun ini saya tidak kontrol.', esensial: true, oldcarts: ['durasi'] },
      { id: 'q_riwayat_serupa', kategori: 'rpd', tanya: 'Pernah mengalami hal serupa, atau ada lubang kecil yang mengeluarkan nanah di sekitar dubur?', jawab: 'Setahun lalu pernah bisul di situ, Dok, pecah sendiri lalu sembuh. Tapi kadang masih ada rembesan sedikit yang mengotori celana dalam.' },
      { id: 'q_wasir', kategori: 'rpd', tanya: 'Punya riwayat wasir?', jawab: 'Tidak pernah, Dok.' },
      { id: 'q_kencing', kategori: 'rps', tanya: 'Kencingnya lancar? Ada nyeri atau sulit keluar?', jawab: 'Lancar, Dok, tidak ada masalah.' },
      { id: 'q_makan_pedas', kategori: 'sosial', tanya: 'Suka makan pedas?', jawab: 'Suka sekali, Dok. Apa gara-gara sambal ya?', distraktor: true },
      { id: 'q_alergi_debu', kategori: 'rpd', tanya: 'Ada alergi debu atau riwayat asma?', jawab: 'Tidak ada, Dok.', distraktor: true },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak kesakitan hebat, tidak mau duduk (berdiri atau berbaring miring sepanjang pemeriksaan); febris 38,5 °C, takikardia.', relevan: true },
      { region: 'ekstremitas', temuan: 'Inspeksi perianal: benjolan pada posisi jam 3, sekitar 4 cm dari tepi anus, diameter ~4 cm, eritematosa, hangat, sangat nyeri, FLUKTUASI (+). Colok dubur tidak dapat dituntaskan karena nyeri hebat; indurasi teraba meluas ke dalam ke arah ruang iskioanal.', relevan: true },
      { region: 'kulit', temuan: 'Tidak ada krepitasi, bula, area kehitaman, maupun nyeri yang meluas jauh di luar batas eritema — belum ada tanda infeksi nekrotikans.', relevan: true },
      { region: 'abdomen', temuan: 'Supel, tidak nyeri tekan, tidak ada defans, bising usus normal.', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
    ],
    lab: [
      { id: 'gds', hasil: '312 mg/dL — hiperglikemia tak terkontrol; memperberat infeksi dan memperlambat penyembuhan.', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['K61.0', 'K60.3', 'K64.5'],
    tatalaksana: {
      obatBenar: ['paracetamol_500', 'amoxiclav_625'],
      obatOpsional: ['tramadol_50'],
      prosedur: ['pemantauan_ketat_vital'],
      obatSalahUmum: [
        { id: 'hidrokortison_krim', alasan: 'Krim steroid untuk "wasir" adalah obat pertama yang paling sering dicoba pada nyeri dubur. Di sini ia menekan peradangan permukaan tanpa menyentuh nanah yang terkumpul di dalam, menyamarkan tanda lokal sehingga abses tampak lebih tenang daripada sebenarnya, dan pada penyandang diabetes justru melemahkan pertahanan jaringan tepat saat infeksinya sedang meluas.', bahaya: 'kontraindikasi' },
        { id: 'dexamethasone_05', alasan: 'Kortikosteroid sistemik pada infeksi bakteri aktif yang belum didrainase menekan respons imun persis saat ia paling dibutuhkan, dan pada pasien dengan gula darah 312 mg/dL ia melonjakkan glikemia lebih jauh — dua hal yang bersama-sama mempercepat perjalanan menuju infeksi yang mengancam jaringan.', bahaya: 'kontraindikasi' },
        { id: 'ciprofloxacin_500', alasan: 'Kuinolon tunggal tidak mencakup anaerob yang mendominasi abses perianal. Namun kesalahan yang lebih mendasar: TIDAK ADA antibiotik yang menyembuhkan nanah yang sudah terkumpul — antibiotik hanya penunjang menjelang drainase. Meresepkannya lalu menyuruh pasien pulang dan kontrol seminggu lagi adalah keputusan yang paling merugikan pasien ini.', bahaya: 'nonPrimer' },
      ],
      tindakanSalahUmum: [
        { id: 'insisi_abses', alasan: 'Drainase adalah terapi definitif abses anorektal, tetapi tombol insisi sederhana tidak mewakili drainase yang aman untuk skenario ini: indurasi meluas ke ruang iskioanal, pemeriksaan tidak dapat dituntaskan, pasien demam, dan diabetesnya tidak terkontrol. Insisi kecil buta di dekat sfingter dapat meninggalkan lokulasi atau mencederai kontinensia. Rujuk untuk drainase menurut anatomi; fistulotomi bersamaan hanya dipertimbangkan pada fistula sederhana yang benar-benar teridentifikasi, bukan dieksplorasi secara rutin.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['persiapan_rujukan_operatif', 'tanda_bahaya', 'kepatuhan_obat', 'diet_dm'],
      edukasiKritis: ['persiapan_rujukan_operatif', 'tanda_bahaya'],
    },
    stabilisasiWajib: ['pemantauan_ketat_vital'],
    clue: 'Nyeri anus berdenyut berat, demam, benjolan perianal fluktuatif, dan indurasi yang masuk ke arah ruang iskioanal menunjukkan abses anorektal kompleks; hitung darah tidak diperlukan untuk membuat keputusan ini. Terapi definitif tetap drainase segera, tetapi anatomi dan faktor pasien menentukan tempat serta tekniknya. Pada kasus ini, perluasan dalam, pemeriksaan yang tidak tuntas, diabetes, dan tanda sistemik membuat drainase bedah terencana lebih aman daripada insisi sederhana di FKTP. Beri analgesia, antibiotik karena ada penyakit sistemik/komorbid, pantau, dan rujuk segera. Antibiotik tidak pernah menggantikan drainase.',
    panduanResmi: `${PPK_FLOOR} PPK 1186/2022 tidak mempunyai bab langsung abses perianal; label SKDI 3B tidak boleh disulap menjadi regimen PPK yang tidak ada. ASCRS Clinical Practice Guideline 2022 menyatakan drainase segera sebagai terapi utama, antibiotik selektif bila ada selulitis, tanda sistemik, atau imunosupresi, dan fistulotomi bersamaan hanya untuk pasien terpilih dengan fistula sederhana.`,
    catatanRealita: 'Set bedah minor yang tersedia tidak otomatis membuat setiap abses perianal layak diinsisi di Puskesmas. Untuk abses superfisial sederhana, drainase dapat dilakukan di layanan ambulatory oleh operator yang kompeten; skenario ini sengaja berbeda karena ada dugaan perluasan iskioanal dan risiko host tinggi. Kemampuan mengenali batas itu adalah kompetensi yang dinilai.',
    mutiaraEbm: 'Tidak semua abses anorektal memerlukan CT, MRI, anestesi umum, atau eksplorasi fistula. Pemeriksaan klinis cukup untuk banyak kasus sederhana, sedangkan imaging dipilih untuk abses tersembunyi, rekuren, kompleks, atau pasien imunosupresi. Pada saat drainase, edema dapat menciptakan jalur palsu; karena itu mengejar fistula secara agresif justru dapat mencederai sfingter. Bila muncul nyeri yang meluas, krepitasi, bula, perubahan warna kulit, hipotensi, atau penurunan kesadaran, curigai infeksi nekrotikans/Fournier dan perlakukan sebagai kegawatan bedah.',
    konsekuensi: {
      narasi: 'Abses perianal yang tidak didrainase adekuat terus meluas di sepanjang ruang iskioanal dan supralevator. Pada penyandang diabetes tak terkontrol, ia dapat berkembang menjadi gangren Fournier — infeksi nekrotikans perineum dengan mortalitas tinggi yang menuntut debridemen luas darurat. Insisi tak adekuat di FKTP menambah satu risiko lagi: fistula persisten dan cedera sfingter.',
      kembaliHariMin: 1,
      kembaliHariMax: 4,
      kondisiKembali: 'Pasien kembali dengan demam tinggi, nyeri yang meluas ke seluruh perineum dan skrotum, kulit kehitaman dengan krepitasi, dan tanda sepsis — gangren Fournier pada diabetes tak terkontrol.',
      guideline: 'ASCRS 2022 — lakukan drainase segera; gunakan antibiotik secara selektif pada selulitis, tanda sistemik, atau imunosupresi; fistulotomi bersamaan hanya pada fistula sederhana yang terpilih.',
    },
  }),

  /* ========================================================================
   * 9. Trauma Abdomen Tumpul (S36.9, 3B, gawat, rujuk bedah)
   * Poin ajar: fisiologi dan respons serial mengalahkan satu Hb/kelas syok.
   *   <C>ABCDE + resusitasi restriktif + TXA dini + transport cepat.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_trauma_abdomen_tumpul',
    nama: 'Trauma Abdomen Tumpul dengan Curiga Cedera Organ Padat',
    icd10: 'S36.9',
    skdi: '3B',
    kategori: 'gawat',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'bedah',
    keluhanUtama: 'Saya jatuh dari motor tadi dan perut saya terbentur setang, Dok, sekarang perut sakit dan badan saya lemas sekali.',
    demografi: { usiaMin: 18, usiaMax: 45 },
    vital: { td: '92/60', nadi: 122, rr: 24, suhu: 36.5, spo2: 97 },
    pembuka: {
      tanya: 'Bagaimana persis kejadiannya, dan bagian mana yang terbentur?',
      jawab: 'Motor saya menabrak pembatas jalan sekitar satu jam lalu, Dok. Perut saya menghantam setang keras sekali. Sekarang perut sakit, badan lemas, dan tadi waktu mau berdiri pandangan saya langsung gelap.',
      oldcarts: ['onset', 'lokasi', 'karakter', 'keparahan'],
    },
    pertanyaan: [
      { id: 'q_mekanisme', kategori: 'rps', tanya: 'Kira-kira seberapa kencang laju motornya, dan apakah sempat pingsan atau terpental?', jawab: 'Kira-kira enam puluh, Dok. Saya terpental beberapa meter. Tidak pingsan, saya ingat semuanya.', esensial: true, oldcarts: ['onset'] },
      { id: 'q_kepala_leher', kategori: 'rps', tanya: 'Pakai helm? Ada benturan di kepala, leher, atau tulang belakang?', jawab: 'Pakai helm, Dok, kepala tidak terbentur. Leher dan punggung juga tidak sakit.', esensial: true },
      { id: 'q_nyeri_bahu', kategori: 'rps', tanya: 'Ada nyeri yang menjalar ke bahu?', jawab: 'Bahu kiri saya nyeri, Dok. Padahal bahunya sendiri tidak terbentur sama sekali.', esensial: true, oldcarts: ['radiasi'] },
      { id: 'q_lemas', kategori: 'rps', tanya: 'Sejak kejadian, apakah terasa makin lemas, haus, atau pandangan gelap saat berdiri?', jawab: 'Iya, Dok, makin lemas, haus sekali, dan tadi mau berdiri pandangan langsung gelap.', esensial: true, oldcarts: ['penyerta', 'keparahan'] },
      { id: 'q_kencing', kategori: 'rps', tanya: 'Sudah kencing setelah kejadian? Warnanya bagaimana?', jawab: 'Belum kencing sama sekali sejak tadi, Dok.', esensial: true },
      { id: 'q_makan', kategori: 'rps', tanya: 'Sudah makan atau minum sesudah kejadian?', jawab: 'Belum, Dok. Tadi ditawari teh manis sama orang di jalan, tapi belum sempat saya minum.' },
      { id: 'q_obat', kategori: 'rpd', tanya: 'Sedang minum aspirin, obat antiplatelet atau antikoagulan, dan apakah ada alergi obat atau penyakit tertentu?', jawab: 'Tidak ada, Dok. Saya tidak minum obat rutin, tidak punya alergi obat yang diketahui, dan selama ini sehat.', esensial: true },
      { id: 'q_muntah', kategori: 'rps', tanya: 'Ada mual atau muntah setelah kejadian?', jawab: 'Mual, Dok, tapi belum muntah.', oldcarts: ['penyerta'] },
      { id: 'q_asuransi', kategori: 'sosial', tanya: 'Apakah Bapak punya BPJS, dan sudah lapor polisi soal kecelakaannya?', jawab: 'Punya BPJS, Dok. Polisi belum, tadi cuma dibantu orang-orang di jalan.', distraktor: true },
      { id: 'q_merokok', kategori: 'sosial', tanya: 'Bapak merokok?', jawab: 'Iya, Dok, sehari sebungkus.', distraktor: true },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Sadar penuh tetapi gelisah dan haus; kulit pucat, dingin, berkeringat; capillary refill 3-4 detik. Airway bebas, bicara jelas dalam kalimat penuh.', relevan: true },
      { region: 'abdomen', temuan: 'Jejas setang berupa memar melintang di perut kiri atas hingga tengah. Nyeri tekan hebat kuadran kiri atas dengan defans lokal; perut mulai distensi; bising usus menurun.', relevan: true },
      { region: 'jantung', temuan: 'Takikardia 122×/menit, nadi lemah dan cepat, serta tekanan darah 92/60; bersama perfusi perifer buruk, temuan ini konsisten dengan syok hemoragik. Kelas syok kaku tidak dipakai untuk menunda tindakan.', relevan: true },
      { region: 'toraks_paru', temuan: 'Gerak dada simetris, vesikuler +/+, tidak ada jejas dinding dada maupun nyeri tekan iga kiri bawah.', relevan: true },
      { region: 'neurologis', temuan: 'GCS 15, pupil isokor reaktif, tidak ada defisit fokal, tidak ada nyeri pada palpasi tulang belakang.', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['S36.9', 'S30.1', 'S36.0'],
    tatalaksana: {
      obatBenar: ['asam_traneksamat_500_inj'],
      obatAlternatif: [['nacl_09_inf', 'ringer_laktat_inf']],
      obatSalahUmum: [
        { id: 'ketorolak_30_inj', alasan: 'NSAID pada trauma dengan perdarahan aktif mengganggu fungsi trombosit tepat saat pembekuan paling dibutuhkan, dan memperberat risiko cedera ginjal pada pasien yang sudah syok dan belum berkemih. Nyeri trauma diredakan dengan opioid titrasi di bawah pemantauan, bukan NSAID.', bahaya: 'kontraindikasi' },
        { id: 'furosemid_40', alasan: 'Belum berkemih sejak kejadian pada pasien ini adalah tanda GINJAL YANG KEKURANGAN DARAH, bukan gagal ginjal. Memberi diuretik memperdalam syok dengan memaksa keluar cairan yang justru harus diganti. Yang menaikkan produksi urine di sini adalah cairan dan darah, bukan furosemid.', bahaya: 'kontraindikasi' },
        { id: 'hyoscine_butilbromida_20_inj', alasan: 'Nyeri di sini bukan kolik melainkan darah yang mengiritasi rongga perut; tidak ada spasme otot polos yang disasar. Antispasmodik hanya menumpulkan salah satu tanda yang sedang dipakai untuk memantau perburukan.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['resusitasi_restriktif_trauma', 'oksigen', 'cegah_hipotermia_trauma', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        { id: 'bilas_lambung', alasan: 'Bilas lambung tidak mempunyai peran pada trauma abdomen tumpul. Tindakan ini dapat memicu muntah dan aspirasi pada pasien syok serta membuang waktu yang dibutuhkan untuk stabilisasi singkat dan transport. Keputusan transfer sudah ditentukan oleh mekanisme, temuan abdomen, dan hipoperfusi; tidak bergantung pada isi lambung atau FAST.', bahaya: 'berbahaya' },
        { id: 'transfusi_darah_fktp', alasan: 'Sukamaju tidak memiliki program darah pra-rumah-sakit, bank darah, uji kecocokan, atau sistem penanganan reaksi transfusi. Hasil golongan ABO bila tersedia tidak menggantikan type-and-screen atau crossmatch. Jangan menahan pasien untuk transfusi improvisasi; transfer ke rumah sakit yang mampu memberi produk darah dan mengendalikan perdarahan secara operatif atau intervensional sesuai temuannya.', bahaya: 'berbahaya' },
      ],
      edukasi: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif', 'tanda_bahaya'],
      edukasiKritis: ['puasa_sambil_rujuk'],
      terapiKritis: ['asam_traneksamat_500_inj', 'resusitasi_restriktif_trauma'],
    },
    stabilisasiWajib: ['resusitasi_restriktif_trauma', 'oksigen', 'cegah_hipotermia_trauma', 'pemantauan_ketat_vital'],
    clue: 'Jejas setang, defans, nyeri bahu kiri tanpa cedera bahu, takikardia, hipotensi, dan perfusi buruk menunjukkan trauma abdomen tumpul dengan perdarahan internal. Jalankan <C>ABCDE sambil mengaktifkan rujukan. Beri oksigen terkontrol karena ada syok meski SpO2 awal 97%. Pasang satu akses IV besar; tambah akses kedua hanya bila tidak menunda keberangkatan. Beri kristaloid hangat 250 mL lalu nilai ulang. Tanpa bukti cedera otak atau spinal, jangan mengejar normotensi; sasaran sementara SBP sekitar 80-90 mmHg. Berikan asam traneksamat 1 g IV selama 10 menit, yaitu dua ampul 500 mg, secepatnya dan dalam tiga jam; dosis lanjutan diteruskan jejaring. Puasakan, cegah hipotermia, pantau serial, pra-notifikasi, dan transfer segera. FAST, Hb serial, dan golongan darah boleh dikerjakan paralel bila siap, tetapi tidak mendapat skor dan tidak boleh menjadi prasyarat atau menahan ambulans.',
    panduanResmi: 'PNPK Tata Laksana Trauma KMK HK.01.07/MENKES/132/2017 menjadi acuan dasar lintas fasilitas: lakukan survei primer ABCDE dan resusitasi paralel, kenali syok perdarahan secara klinis, lalu transfer segera ke layanan yang mampu mengendalikan sumber. European trauma bleeding guideline 2023 memperbarui detailnya: kristaloid restriktif dengan target SBP 80-90 mmHg sampai kendali perdarahan pada pasien tanpa cedera otak atau spinal. Selain itu: TXA 1 g dalam 10 menit secepatnya dan maksimal tiga jam, pencegahan hipotermia, serta pemeriksaan minimum yang tidak menunda kendali perdarahan.',
    catatanRealita: 'Profil Sukamaju menyediakan oksigen, oksimeter nadi, akses IV, kristaloid hangat, TXA 1 g (dua ampul 500 mg), selimut, termometer, dan ambulans. FAST dengan operator, Hb cepat, golongan darah ABO, produk darah, dan kendali sumber tidak diasumsikan tersedia; semuanya BUKAN prasyarat transfer. Karena skema belum mengenal pemeriksaan opsional, FAST/Hb/ABO tidak menjadi tombol bernilai atau alasan menahan transport.',
    mutiaraEbm: 'Nilai perdarahan trauma dari gabungan fisiologi, pola cedera, mekanisme, dan respons terhadap tindakan, bukan satu kelas syok atau satu angka. Shock index pasien ini sekitar 1,33 dan mendukung risiko tinggi, tetapi bukan pengganti penilaian klinis. Hb awal dapat tetap normal pada perdarahan bermakna, sedangkan satu Hb rendah dipengaruhi nilai dasar, perpindahan cairan, dan resusitasi; ia tidak mengukur volume atau kecepatan perdarahan sendirian. FAST berspesifisitas tinggi tetapi sensitivitasnya terbatas: hasil negatif tidak menyingkirkan cedera atau hemoperitoneum. Pada pasien tidak stabil, pemeriksaan hanya bernilai bila berjalan paralel dan langsung membantu kendali perdarahan tanpa menunda transfer.',
    sumber: [
      {
        id: 'pnpk_trauma_2017',
        label: 'KMK 132/2017 - PNPK Tata Laksana Trauma',
        url: 'https://kemkes.go.id/app_asset/file_content_download/17012291786566b27adad479.88983894.pdf',
        tahun: 2017,
        jenis: 'pedoman_indonesia',
      },
      {
        id: 'european_trauma_bleeding_2023',
        label: 'European Trauma Bleeding Guideline - Sixth Edition',
        url: 'https://link.springer.com/article/10.1186/s13054-023-04327-7',
        tahun: 2023,
        jenis: 'evidence_internasional',
      },
      {
        id: 'anzcor_oxygen_2026',
        label: 'ANZCOR 2026 - Oxygen in Emergencies',
        url: 'https://www.anzcor.org/home/first-aid/guideline-9-2-10-the-use-of-oxygen-in-emergencies',
        tahun: 2026,
        jenis: 'evidence_internasional',
      },
    ],
    konsekuensi: {
      narasi: 'Cedera organ padat yang terus berdarah menghabiskan volume sirkulasi; syok berkembang dengan asidosis, hipotermia, dan koagulopati yang saling memperburuk. Penundaan untuk pemeriksaan non-esensial, pemberian makan/minum, atau transfusi improvisasi di FKTP menjauhkan pasien dari terapi definitif: produk darah serta kendali perdarahan operatif atau intervensional di rumah sakit yang mampu.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Pasien memburuk dalam perjalanan atau kembali dalam syok berat: kesadaran menurun, nadi tak teraba di radialis, tekanan darah tak terukur, perut makin distensi — perdarahan intraabdomen masif yang tak terkendali.',
      guideline: 'PNPK Tata Laksana Trauma KMK HK.01.07/MENKES/132/2017: survei primer ABCDE, resusitasi, dan transfer tanpa menunda kendali sumber. European guideline 2023: resusitasi restriktif, normotermia, dan TXA secepatnya dalam tiga jam; pemberian setelah tiga jam hanya dipertimbangkan bila ada bukti hiperfibrinolisis.',
    },
  }),
]

export const LAB_BATCH_4_BEDAH_ARCHETYPE_SPECS: Record<string, LabArchetypeSpec> = {
  lab_hernia_inguinalis_inkarserata: { conceptId: 'concept:incarcerated_inguinal_hernia', credits: ['clinical:lab_hernia_inguinalis_inkarserata'] },
  lab_kolesistitis_akut: { conceptId: 'concept:acute_cholecystitis', credits: ['clinical:lab_kolesistitis_akut'] },
  lab_apendisitis_akut_anak: { conceptId: 'concept:pediatric_appendicitis', credits: ['clinical:lab_apendisitis_akut_anak'] },
  lab_peritonitis_generalisata: { conceptId: 'concept:generalized_peritonitis', credits: ['clinical:lab_peritonitis_generalisata'] },
  lab_retensio_urin_akut: { conceptId: 'concept:acute_urinary_retention', credits: ['clinical:lab_retensio_urin_akut'] },
  lab_kolik_ureter_obstruksi: { conceptId: 'concept:ureteric_colic_obstruction', credits: ['clinical:lab_kolik_ureter_obstruksi'] },
  lab_hemoroid_interna_derajat4: { conceptId: 'concept:hemorrhoid_grade4', credits: ['clinical:lab_hemoroid_interna_derajat4'] },
  lab_abses_perianal: { conceptId: 'concept:perianal_abscess', credits: ['clinical:lab_abses_perianal'] },
  lab_trauma_abdomen_tumpul: { conceptId: 'concept:blunt_abdominal_trauma', credits: ['clinical:lab_trauma_abdomen_tumpul'] },
}
