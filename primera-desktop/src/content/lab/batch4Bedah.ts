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

const PPK_FLOOR = 'PPK Dokter FKTP KMK 1186/2022 menjadi floor; terapi disesuaikan dengan pedoman yang lebih baru bila relevan.'

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
    lab: [
      { id: 'darah_rutin', hasil: 'Leukosit 16.400/µL dengan neutrofilia; Hb 14,1 g/dL.', flag: 'tinggi', relevan: true },
      { id: 'foto_polos_abdomen', hasil: 'Dilatasi usus halus dengan air-fluid level bertingkat; TIDAK tampak udara bebas subdiafragma.', flag: 'abnormal', relevan: true },
      { id: 'elektrolit_serum', hasil: 'Natrium 133 mmol/L, kalium 3,3 mmol/L — sesuai kehilangan cairan akibat muntah berulang.', flag: 'rendah', relevan: true },
    ],
    diagnosisBanding: ['K40.3', 'K56.6', 'K40.9'],
    tatalaksana: {
      obatBenar: [],
      obatAlternatif: [
        ['nacl_09_inf', 'ringer_laktat_inf'],
        ['ketorolak_30_inj', 'tramadol_50'],
      ],
      obatSalahUmum: [
        { id: 'loperamid_2', alasan: 'Muntah dan tidak bisa buang angin di sini adalah tanda OBSTRUKSI mekanik, bukan diare. Menghentikan peristaltik tidak membuka jepitan, menutupi perburukan, dan menunda pengenalan strangulasi.', bahaya: 'kontraindikasi' },
        { id: 'domperidon_10', alasan: 'Prokinetik memaksa usus berkontraksi melawan sumbatan mekanik — nyeri bertambah, risiko muntah-aspirasi naik, dan usus yang sudah terjepit makin tertekan. Muntah pada obstruksi diatasi dengan dekompresi NGT, bukan prokinetik.', bahaya: 'kontraindikasi' },
        { id: 'amoxicillin_500', alasan: 'Hernia inkarserata adalah kasus BEDAH; antibiotik oral tidak melepaskan jepitan dan berisiko menunda rujukan. Antibiotik parenteral peri-operatif adalah urusan RS rujukan.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pasang_infus', 'dekompresi_ngt'],
      tindakanSalahUmum: [
        { id: 'reduksi_manual_hernia', alasan: 'Reduksi paksa pada hernia yang sudah terjepit berjam-jam, nyeri hebat, dan kulitnya kemerahan adalah kontraindikasi. Risikonya "reduction en masse": usus yang mungkin sudah nekrotik terdorong kembali ke rongga perut — benjolan hilang dan pasien tampak membaik, sementara perforasi berlangsung tanpa tanda yang bisa dilihat dari luar, lalu muncul sebagai peritonitis. Tanda strangulasi = rujuk bedah, bukan mendorong lebih kuat.', bahaya: 'berbahaya' },
      ],
      edukasi: ['persiapan_rujukan_operatif', 'puasa_sambil_rujuk', 'tanda_bahaya', 'hindari_mengejan'],
      edukasiKritis: ['persiapan_rujukan_operatif', 'puasa_sambil_rujuk'],
    },
    stabilisasiWajib: ['pasang_infus', 'dekompresi_ngt'],
    clue: 'Hernia inguinalis yang tadinya reponibel kini TIDAK dapat direduksi, disertai muntah bilious, tak bisa flatus/BAB, dan kulit di atasnya kemerahan = inkarserata dengan tanda mengarah strangulasi. Tugas FKTP: puasakan, pasang jalur IV dan koreksi cairan, dekompresi NGT karena pasien muntah, beri ANALGESIA adekuat, lalu RUJUK BEDAH SEGERA. Analgesia tidak menutupi diagnosis — mitos itu sudah terbantah (Cochrane CD005660; WSES); pada pasien yang muntah dipilih jalur parenteral, dan pada perut akut pra-bedah hindari NSAID oral bila ada alternatif. Yang menentukan prognosis adalah waktu sampai kamar operasi, bukan kelengkapan pemeriksaan di FKTP.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan hernia inguinalis inkarserata/strangulata sebagai kompetensi 3B: tegakkan dugaan secara klinis, lakukan stabilisasi pra-rujuk (puasa, jalur IV, NGT bila muntah, analgesia), dan rujuk cito ke layanan bedah. Reduksi manual hanya dipertimbangkan pada hernia REPONIBEL/inkarserata dini tanpa tanda strangulasi — bukan pada gambaran kasus ini.`,
    catatanRealita: 'Skenario menyatakan infus, NGT, dan transport siap. Di Puskesmas nyata, NGT dan ambulans tidak selalu tersedia bersamaan, dan pasien sering datang setelah dibawa ke tukang urut lebih dulu — persis seperti pasien ini. Bila NGT tidak dapat dipasang aman, jangan menunda transfer demi memaksakannya; kirim pasien dengan jalur IV terpasang dan catatan waktu mulai gejala.',
    mutiaraEbm: 'Nyeri yang tiba-tiba MEREDA dan benjolan yang "akhirnya masuk" setelah didorong bukan selalu kabar baik: pada reduction en masse, isi hernia yang sudah rusak berpindah ke rongga perut dan gejala menghilang sesaat sebelum peritonitis muncul. Kedua, bising usus yang masih terdengar — bahkan meningkat — TIDAK menyingkirkan strangulasi; pada obstruksi mekanik bising usus justru khas meningkat dan bernada metalik lebih dulu, baru menghilang belakangan saat usus sudah lelah atau mati.',
    konsekuensi: {
      narasi: 'Reduksi paksa atau rujukan yang tertunda membuat usus yang terjepit kehilangan aliran darah; dalam hitungan jam terjadi nekrosis dan perforasi, berlanjut ke peritonitis dan sepsis. Reseksi usus yang semula tak perlu menjadi tak terhindarkan.',
      kembaliHariMin: 1,
      kembaliHariMax: 2,
      kondisiKembali: 'Pasien kembali dengan nyeri seluruh perut, perut papan, demam tinggi, takikardia, dan tekanan darah turun — peritonitis akibat usus yang terjepit sudah mati.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 — hernia inkarserata/strangulata: stabilisasi pra-rujuk + rujuk bedah cito. Analgesia pra-rujuk: Cochrane CD005660 / WSES.',
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
    lab: [
      { id: 'usg_abdomen', hasil: 'Dinding kandung empedu menebal 5,8 mm, cairan perikolesistik (+), batu multipel di lumen; duktus koledokus tidak melebar. Murphy sonografis (+).', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Leukosit 17.200/µL dengan neutrofilia; Hb 12,8 g/dL.', flag: 'tinggi', relevan: true },
      { id: 'sgot_sgpt', hasil: 'AST 48 U/L, ALT 52 U/L — hanya sedikit di atas normal.', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['K81.0', 'K80.2', 'K29.7'],
    tatalaksana: {
      obatBenar: ['ceftriaxone_1g_inj', 'ketorolak_30_inj'],
      obatAlternatif: [['nacl_09_inf', 'ringer_laktat_inf']],
      obatOpsional: ['ondansetron_4', 'metronidazol_inj_500'],
      obatSalahUmum: [
        { id: 'antasida_doen', alasan: 'Nyeri kanan atas berulang yang dipicu makanan berlemak, kini disertai demam dan Murphy positif, bukan dispepsia. Pasien ini bahkan sudah "gagal" dengan obat maag warung semalaman — mengulangi hipotesis yang sama hanya menunda pengenalan kolesistitis.', bahaya: 'nonPrimer' },
        { id: 'amoxicillin_500', alasan: 'Antibiotik ORAL berspektrum sempit tidak mencakup patogen bilier (Enterobacterales) dan tidak menggantikan dosis pertama parenteral sebelum rujuk. Yang lebih merugikan: meresepkannya biasanya berarti pasien dipulangkan, padahal ia butuh kolesistektomi dini.', bahaya: 'nonPrimer' },
        { id: 'hyoscine_butilbromida_20_inj', alasan: 'Antispasmodik adalah obat untuk kolik bilier MURNI (nyeri yang datang-pergi tanpa demam). Di sini sudah ada peradangan dinding kandung empedu dengan demam dan leukositosis: antispasmodik meredakan nyeri sesaat tanpa menyentuh infeksinya, sehingga pasien tampak membaik dan rujukannya tertunda.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pasang_infus'],
      edukasi: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif', 'tanda_bahaya'],
      edukasiKritis: ['puasa_sambil_rujuk'],
    },
    stabilisasiWajib: ['pasang_infus'],
    clue: 'Nyeri kanan atas dipicu makanan berlemak yang MENETAP >6 jam (bukan lagi kolik yang reda sendiri) + demam + Murphy (+) + leukositosis + USG dinding empedu menebal dengan batu = kolesistitis akut. Tugas FKTP: puasakan, jalur IV, ANALGESIA, antibiotik parenteral DOSIS PERTAMA, lalu rujuk bedah. Catatan EBM yang penting: pada nyeri bilier, NSAID adalah lini pertama dan lebih unggul dari antispasmodik — ia bukan sekadar pereda nyeri, tetapi menurunkan progresi kolik menjadi kolesistitis. Rujukan bersifat dini, bukan ditunda: kolesistektomi laparoskopik DINI (dalam 72 jam, idealnya <7 hari) terbukti lebih baik daripada "didinginkan dulu dengan antibiotik lalu dioperasi belakangan" — pendekatan tunda justru berujung lebih banyak rawat inap ulang dan konversi operasi terbuka.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan kolesistitis akut sebagai kompetensi 3B — didiagnosis secara klinis di FKTP (nyeri kanan atas menetap, demam, Murphy positif), diberi terapi suportif dan antibiotik, lalu dirujuk ke layanan bedah untuk tata laksana definitif. Kriteria rujukan resmi terpenuhi begitu diagnosis ditegakkan; USG bukan syarat merujuk, melainkan penunjang bila tersedia.`,
    catatanRealita: 'Skenario ini idealis: USG tersedia dan langsung terbaca. Di lapangan, banyak Puskesmas belum memiliki USG (atau ada alatnya tetapi tak ada tenaga terlatih membaca abdomen), dan seftriakson tidak selalu distok. Keterbatasan itu TIDAK mengubah keputusan: kolesistitis akut adalah diagnosis KLINIS, dan tidak adanya USG bukan alasan menunda rujukan — kirim pasien dengan puasa, jalur IV, dan analgesia yang sudah diberikan.',
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
    demografi: { usiaMin: 6, usiaMax: 12 },
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
      { id: 'usg_abdomen', hasil: 'Struktur tubuler non-kompresibel diameter 8 mm di kuadran kanan bawah dengan cairan bebas minimal di sekitarnya.', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['K35.8', 'A09', 'N39.0'],
    tatalaksana: {
      obatBenar: [],
      obatAlternatif: [['paracetamol_sirup', 'paracetamol_500']],
      obatSalahUmum: [
        { id: 'ibuprofen_400', alasan: 'Memberi ANALGESIA sendiri tidak salah — mitos "analgetik menutupi tanda apendisitis" sudah terbantah (Cochrane CD005660; WSES), dan menahan obat nyeri pada anak yang kesakitan tidak membuat diagnosis lebih akurat. Yang dihindari adalah GOLONGAN NSAID pada perut akut yang kemungkinan besar dioperasi: risiko iritasi/perdarahan saluran cerna dan gangguan hemostasis peri-operatif. Pilih parasetamol.', bahaya: 'kontraindikasi' },
        { id: 'loperamid_2', alasan: 'Nyeri perut anak sering diterjemahkan menjadi "mau mencret". Antimotilitas pada perut akut menutupi berkembangnya tanda peritoneal dan menunda rujukan — apalagi anak ini justru TIDAK mencret.', bahaya: 'kontraindikasi' },
        { id: 'amoxicillin_sirup', alasan: 'Apendisitis anak adalah kasus BEDAH. Antibiotik oral di FKTP tidak menyembuhkan, dapat meredam demam dan leukositosis sesaat sehingga penilaian bedah jadi lebih sulit, dan yang paling berbahaya: pemberiannya hampir selalu berarti anak dipulangkan untuk "lihat besok".', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pasang_infus'],
      edukasi: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif', 'tanda_bahaya'],
      edukasiKritis: ['puasa_sambil_rujuk'],
    },
    stabilisasiWajib: ['pasang_infus'],
    clue: 'Nyeri yang BERPINDAH dari sekitar pusar ke kuadran kanan bawah + anoreksia + muntah + subfebris + tanda peritoneal lokal (McBurney, Blumberg, Rovsing, psoas) dan uji lompat positif = apendisitis akut pada anak. Tugas FKTP: puasakan, pasang jalur IV, beri ANALGESIA adekuat (parasetamol — analgesia TIDAK menutupi diagnosis, Cochrane/WSES; hindari NSAID pada perut akut pra-bedah), lalu RUJUK BEDAH. Jangan biarkan antibiotik oral menunda rujukan. Pada anak, ambang merujuk harus LEBIH RENDAH daripada dewasa: dinding apendiks lebih tipis, omentum belum mampu membungkus radang, sehingga perforasi terjadi lebih cepat dan lebih sering berakhir peritonitis difus.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menetapkan apendisitis akut sebagai kompetensi 3B = rujuk operasi cito ke layanan sekunder. Langkah pra-rujuk resmi yang diminta selain puasa dan cairan IV: posisi Fowler (anti-Trendelenburg) dan pemasangan pipa nasogastrik untuk mengosongkan lambung bila ada muntah/distensi. Diagnosis ditegakkan klinis; penunjang tidak boleh menunda rujukan.`,
    catatanRealita: 'Skenario ini memberi USG yang langsung menemukan apendiks — kemewahan yang jarang ada di Puskesmas, dan bahkan di RS pun apendiks anak sering sulit divisualisasi. Realitanya keputusan merujuk anak ini harus diambil TANPA USG, hanya dari nyeri berpindah, anak yang menolak melompat, dan defans lokal.',
    mutiaraEbm: 'Leukosit yang normal atau baru di batas atas TIDAK menyingkirkan apendisitis dini pada anak — pada 12-24 jam pertama leukositosis sering belum sempat muncul, sementara nyeri yang BERPINDAH dan pergeseran hitung jenis ke kiri (seperti anak ini: leukosit 11.200 tetapi neutrofil 76%) jauh lebih dapat dipercaya. Menunggu leukosit naik dulu sebelum merujuk adalah cara paling umum melewatkan apendisitis anak sampai perforasi. Sebaliknya, waspadai jebakan kedua: anak yang nyerinya tiba-tiba HILANG dan tampak tenang setelah beberapa jam kesakitan hebat bukan berarti sembuh — itu bisa jam-jam "tenang menipu" tepat setelah apendiks pecah, sebelum peritonitis menyeluruh muncul.',
    konsekuensi: {
      narasi: 'Apendisitis anak yang dipulangkan dengan antibiotik oral atau "obat mencret" berlanjut ke perforasi dalam hitungan jam — pada anak jauh lebih cepat daripada dewasa — dan berakhir sebagai peritonitis difus, sepsis, serta rawat inap panjang dengan abses residual.',
      kembaliHariMin: 0,
      kembaliHariMax: 2,
      kondisiKembali: 'Anak kembali dengan nyeri seluruh perut, perut tegang seperti papan, demam tinggi, muntah terus-menerus, dan lemas — apendiks sudah perforasi.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 — apendisitis akut (3B): puasa, cairan IV, NGT, posisi Fowler, rujuk cito. Analgesia pra-rujuk: Cochrane CD005660 / WSES.',
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
    lab: [
      { id: 'foto_polos_abdomen', hasil: 'Tampak UDARA BEBAS subdiafragma bilateral pada posisi tegak (pneumoperitoneum) — mendukung perforasi organ berongga.', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Leukosit 19.800/µL dengan neutrofilia dan pergeseran ke kiri; Hb 13,4 g/dL.', flag: 'tinggi', relevan: true },
      { id: 'fungsi_ginjal', hasil: 'Ureum 62 mg/dL, kreatinin 1,6 mg/dL — cedera ginjal akut prarenal akibat hipoperfusi.', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['K65.0', 'K25.5', 'K85.9'],
    tatalaksana: {
      obatBenar: ['ceftriaxone_1g_inj', 'metronidazol_inj_500'],
      obatAlternatif: [['nacl_09_inf', 'ringer_laktat_inf']],
      obatOpsional: ['ondansetron_4'],
      obatSalahUmum: [
        { id: 'ketorolak_30_inj', alasan: 'NSAID di sini menyerang pasien dari tiga arah sekaligus: ia memperberat mekanisme yang diduga menyebabkan perforasi (ulkus akibat obat rematik warung yang diminum bertahun-tahun), mengganggu hemostasis menjelang laparotomi, dan memperdalam cedera ginjal pada pasien yang ureum/kreatininnya sudah naik karena hipoperfusi. Nyeri peritonitis diredakan dengan resusitasi cairan dan opioid titrasi di RS.', bahaya: 'kontraindikasi' },
        { id: 'hyoscine_butilbromida_20_inj', alasan: 'Refleks "perut sakit → antispasmodik" berbahaya di sini: nyeri peritonitis bukan kolik, sehingga tidak ada spasme yang disasar. Yang terjadi hanya perut papan tampak sedikit melunak dan pasien tampak tenang — persis pada jam-jam yang paling menentukan untuk sampai ke kamar operasi.', bahaya: 'kontraindikasi' },
        { id: 'omeprazole_20', alasan: 'PPI ORAL pada pasien yang harus dipuasakan tidak akan terserap dan tidak menutup lubang perforasi. Memberi obat lambung lalu "observasi dulu" adalah pola yang paling sering menunda laparotomi pada perforasi ulkus. (PPI parenteral adalah terapi penunjang DI RS, sesudah sumber dikendalikan.)', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pasang_infus', 'resusitasi_cairan_kristaloid', 'dekompresi_ngt', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        { id: 'bilas_lambung', alasan: 'Bilas lambung pada dugaan perforasi organ berongga dapat mendorong isi lambung keluar melalui lubang perforasi dan memperluas kontaminasi rongga perut, selain memicu muntah dan aspirasi pada pasien yang sudah syok. NGT di sini dipasang untuk DEKOMPRESI — dialirkan agar lambung kosong dan distensi berkurang, bukan untuk dibilas.', bahaya: 'berbahaya' },
      ],
      edukasi: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif', 'tanda_bahaya', 'hentikan_obat_pencetus'],
      edukasiKritis: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif'],
      terapiKritis: ['resusitasi_cairan_kristaloid', 'ceftriaxone_1g_inj'],
    },
    stabilisasiWajib: ['pasang_infus', 'resusitasi_cairan_kristaloid', 'dekompresi_ngt'],
    clue: 'Nyeri perut mendadak yang dalam hitungan jam menjadi menyeluruh + perut papan yang tak ikut gerak napas + pasien membeku tak berani bergerak + takikardia dengan tekanan darah di batas bawah + udara bebas subdiafragma = peritonitis generalisata, di sini akibat perforasi ulkus peptikum pada pemakai NSAID warung menahun. Ini bukan kasus "rujuk lalu selesai": tugas FKTP adalah RESUSITASI CAIRAN kristaloid, ANTIBIOTIK PARENTERAL DOSIS PERTAMA yang mencakup Gram-negatif DAN anaerob (seftriakson + metronidazol), dekompresi NGT, puasa, pemantauan ketat, lalu transport SEGERA. Prinsip Surviving Sepsis: cairan dan antibiotik dosis-1 diberikan sedini mungkin — tiap jam keterlambatan antibiotik pada syok sepsis menaikkan mortalitas. Tetapi antibiotik tidak menyembuhkan peritonitis; satu-satunya terapi definitif adalah KENDALI SUMBER (menutup perforasi + mencuci rongga perut) di kamar operasi.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan peritonitis sebagai kompetensi 3B dan kegawatan bedah: diagnosis ditegakkan KLINIS (nyeri seluruh perut, defans generalisata, bising usus menghilang), lalu pasien dipuasakan, diresusitasi dengan cairan, diberi antibiotik, dan dirujuk cito ke layanan bedah. Foto polos abdomen 3 posisi disebut sebagai penunjang bila tersedia — bukan syarat untuk merujuk.`,
    catatanRealita: 'Skenario menyatakan radiografi, seftriakson, metronidazol infus, NGT, dan ambulans semuanya siap — kombinasi yang jarang lengkap di Puskesmas nyata. Yang perlu dipahami pemain: TIDAK SATU pun dari itu adalah prasyarat merujuk. Perut papan pada pasien yang tak berani bergerak sudah cukup. Bila metronidazol infus tak ada, berikan apa yang ada dan jangan menunda transport;',
    mutiaraEbm: 'Hilangnya pekak hati dan udara bebas pada foto tegak sangat membantu BILA ADA — tetapi foto polos abdomen yang NORMAL tidak menyingkirkan perforasi: udara bebas hanya terlihat pada sekitar 70-80% perforasi, dan sama sekali tidak muncul bila perforasinya tertutup (sealed) atau bila organ yang bocor ada di belakang peritoneum. Menunggu udara bebas untuk berani merujuk adalah kesalahan yang mahal. Jebakan kedua ada pada suhu: peritonitis yang sudah berat justru bisa datang TANPA demam — pada pasien yang mulai syok, lansia, atau pengguna steroid, suhu normal bahkan hipotermia adalah tanda yang lebih buruk, bukan lebih baik.',
    konsekuensi: {
      narasi: 'Peritonitis yang tidak segera diresusitasi dan dirujuk berkembang menjadi syok sepsis dengan kegagalan organ multipel. Setiap jam penundaan kendali sumber dan antibiotik menurunkan peluang hidup; pasien yang selamat pun menghadapi rawat ICU panjang, laparotomi berulang, dan abses intraabdomen.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Pasien kembali dalam keadaan syok: kesadaran menurun, akral dingin, tekanan darah tak terukur, dan produksi urine berhenti — syok sepsis akibat peritonitis yang tak terkendali.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 — peritonitis (3B): resusitasi cairan, antibiotik, puasa, rujuk cito bedah. Prinsip cairan & antibiotik dini: Surviving Sepsis Campaign.',
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
      { id: 'fungsi_ginjal', hasil: 'Ureum 38 mg/dL, kreatinin 1,2 mg/dL — masih dalam batas; belum ada gangguan ginjal akibat sumbatan.', flag: 'normal', relevan: true },
      { id: 'usg_abdomen', hasil: 'Volume buli sebelum kateterisasi ~900 mL; prostat membesar (perkiraan 45 mL) menonjol ke dasar buli; tidak tampak hidronefrosis.', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['R33.9', 'N40', 'N39.0'],
    tatalaksana: {
      obatBenar: ['tamsulosin_04'],
      obatSalahUmum: [
        { id: 'furosemid_40', alasan: 'Refleks "tidak keluar kencing → beri diuretik" berbahaya pada retensi OBSTRUKTIF. Ginjal pasien ini bekerja baik; masalahnya urine tak punya jalan keluar. Diuretik hanya menambah produksi urine ke dalam buli yang sudah teregang 900 mL — nyeri bertambah, risiko cedera dinding buli naik, dan tak setetes pun keluar. Yang menyembuhkan adalah MENGELUARKAN urine, bukan memproduksi lebih banyak.', bahaya: 'kontraindikasi' },
        { id: 'ctm_4', alasan: 'Antihistamin generasi pertama bersifat antikolinergik — justru salah satu pencetus tersering retensi urin pada pembesaran prostat, dan kemungkinan besar itulah isi "obat flu warung" yang dua hari ini diminum pasien. Meresepkannya menambah bensin ke api; obat flu yang sedang diminum malah harus DIHENTIKAN.', bahaya: 'kontraindikasi' },
        { id: 'ciprofloxacin_500', alasan: 'Tanpa demam, tanpa nyeri pinggang, dan dengan urinalisis bersih, tidak ada infeksi yang disasar — retensi ini murni mekanis. Antibiotik refleks pasca-kateter tidak mencegah infeksi dan hanya menambah tekanan resistensi.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pemasangan_kateter_urin'],
      edukasi: ['hentikan_obat_pencetus', 'tanda_bahaya', 'kontrol_rutin'],
      edukasiKritis: ['hentikan_obat_pencetus'],
    },
    stabilisasiWajib: ['pemasangan_kateter_urin'],
    clue: 'Tidak bisa berkemih sejak semalam + buli teraba dan pekak suprapubik + riwayat berbulan pancaran melemah, mengejan, menetes, dan sering bangun malam = retensi urin akut pada pembesaran prostat jinak, dipicu obat flu warung yang bersifat antikolinergik. Ini kasus rujuk yang jawabannya BUKAN langsung merujuk: tindakan pertama adalah PASANG KATETER URIN — dekompresi meredakan nyeri seketika dan melindungi ginjal; barulah pasien dirujuk ke bedah/urologi dengan kateter terpasang untuk tata laksana definitif prostatnya. Mulai penghambat alfa-1 (tamsulosin) segera, karena ia meningkatkan keberhasilan pelepasan kateter (trial without catheter). Hentikan obat pencetusnya. Merujuk pasien ini tanpa mengosongkan bulinya lebih dulu berarti membiarkannya menempuh perjalanan dalam kesakitan hebat dengan risiko cedera buli — kegagalan kompetensi FKTP, bukan kehati-hatian.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan retensi urin akut sebagai kegawatan yang dekompresinya (kateterisasi uretra) merupakan kompetensi dokter layanan primer, diikuti rujukan untuk penanganan penyebabnya. Bila kateterisasi uretra GAGAL (mis. striktur, prostat sangat besar, kateter tak dapat masuk), jangan memaksa berulang — rujuk segera; upaya paksa menimbulkan trauma uretra dan perdarahan yang mempersulit tindakan di RS.`,
    catatanRealita: 'Skenario ini mengasumsikan kateter Foley berbagai ukuran, jeli lidokain steril, dan urine bag selalu tersedia — di banyak Puskesmas stoknya habis-habisan, dan sebagian dokter/perawat belum pernah dilatih kateterisasi pria dengan prostat besar (yang perlu ukuran lebih besar dan agak kaku, bukan yang paling kecil).',
    mutiaraEbm: 'Dua ajaran klasik yang menyesatkan di sini. Pertama: "kalau masih ada urine menetes berarti bukan retensi" — justru sebaliknya, buli yang terlalu penuh sering merembes sedikit-sedikit (overflow), sehingga laporan "masih keluar sedikit" tidak menyingkirkan apa pun; buli yang teraba dan pekak suprapubik jauh lebih dapat dipercaya. Kedua: "kosongkan buli bertahap, jangan lebih dari 500 mL sekaligus, nanti terjadi perdarahan dan syok" — ini tidak didukung bukti. Pengosongan lengkap sekaligus terbukti sama amannya, dan menjepit kateter berkala hanya menunda pemulihan serta menambah risiko sumbatan. Yang benar-benar perlu dipantau adalah diuresis pasca-sumbatan (urine mengalir sangat banyak setelah kateter terpasang) pada retensi yang sudah kronis.',
    konsekuensi: {
      narasi: 'Retensi yang dibiarkan tanpa dekompresi membuat tekanan balik ke atas: hidronefrosis dan gagal ginjal akut pascarenal dalam hitungan hari, di samping nyeri hebat yang tak perlu dan risiko robekan dinding buli yang teregang.',
      kembaliHariMin: 1,
      kembaliHariMax: 3,
      kondisiKembali: 'Pasien kembali dengan perut bawah sangat menggembung, mual, lemas, dan bengkak — kreatinin melonjak dengan hidronefrosis bilateral akibat sumbatan yang tak pernah dibebaskan.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 — retensi urin akut: dekompresi kateterisasi di FKTP lalu rujuk. Penghambat alfa-1 untuk keberhasilan trial without catheter.',
    },
  }),

  /* ========================================================================
   * 6. Kolik Ureter oleh Batu dengan Obstruksi (N20.1, 3A, rujuk bedah)
   * Poin ajar: pasien GELISAH tak bisa diam — kontras diagnostik langsung
   *   dengan peritonitis (kasus 4) yang justru membeku.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_kolik_ureter_obstruksi',
    nama: 'Kolik Ureter oleh Batu dengan Obstruksi',
    icd10: 'N20.1',
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
      { id: 'usg_abdomen', hasil: 'Hidronefrosis derajat sedang pada ginjal kiri; tampak batu ~7 mm di ureter distal kiri; ginjal kanan normal.', flag: 'abnormal', relevan: true },
      { id: 'fungsi_ginjal', hasil: 'Ureum 30 mg/dL, kreatinin 1,0 mg/dL — fungsi ginjal masih baik.', flag: 'normal', relevan: true },
      { id: 'darah_rutin', hasil: 'Leukosit 9.800/µL, Hb 14,8 g/dL — tidak ada tanda infeksi sistemik.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['N20.1', 'N23', 'N10'],
    tatalaksana: {
      obatBenar: ['tamsulosin_04'],
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
    clue: 'Nyeri pinggang kolik menjalar ke selangkangan + pasien GELISAH tak bisa diam + darah mikroskopik di urin + hidronefrosis dengan batu ureter distal 7 mm = kolik ureter dengan obstruksi. Tata laksana FKTP: NSAID sebagai analgesia LINI PERTAMA (ketorolak parenteral karena pasien muntah; NSAID unggul atas opioid dan atas antispasmodik), tamsulosin sebagai terapi ekspulsif medikamentosa — bermanfaat khususnya pada batu ureter DISTAL berukuran 5-10 mm seperti pasien ini, dan tidak untuk batu kecil <5 mm yang umumnya lewat sendiri. Cairan diberikan untuk mengganti muntah, BUKAN "diguyur" untuk mendorong batu: hidrasi paksa tidak terbukti mempercepat keluarnya batu. Rujuk ke bedah/urologi karena sudah ada OBSTRUKSI (hidronefrosis). Rujukan berubah menjadi EMERGENSI bila muncul salah satu dari: demam/menggigil (obstruksi terinfeksi = butuh drainase segera), ginjal tunggal, obstruksi bilateral, gangguan fungsi ginjal, atau nyeri yang tak teratasi.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan kolik renal/ureter sebagai kompetensi 3A: dokter FKTP menegakkan diagnosis, MENGATASI NYERI lebih dulu, lalu merujuk. Kriteria rujukan resmi mencakup nyeri yang tidak teratasi dengan analgesia adekuat, tanda obstruksi, demam yang menyertai (curiga urosepsis), dan gangguan fungsi ginjal.`,
    catatanRealita: 'USG yang langsung menunjukkan ukuran dan letak batu adalah kemewahan skenario; tanpanya, FKTP tetap dapat mengenali kolik ureter secara klinis dan merujuk. Ketorolak injeksi umumnya tersedia, tetapi tamsulosin sering tidak masuk stok rutin Puskesmas dan harus ditebus di apotek luar — perlu dibicarakan dengan pasien agar terapi ekspulsif tidak putus.',
    mutiaraEbm: 'Cara pasien MENAHAN nyeri adalah petunjuk diagnostik yang sering diabaikan. Pasien kolik ureter gelisah, berguling, dan tak menemukan posisi nyaman — nyerinya berasal dari otot polos yang berkontraksi melawan sumbatan, dan gerakan tidak memperburuknya. Bandingkan dengan peritonitis: pasien berbaring kaku dan menolak bergerak karena setiap guncangan menggeser permukaan peritoneum yang meradang. Karena itu "pasien yang berguling-guling kesakitan" hampir tidak pernah peritonitis, dan sebaliknya nyeri perut hebat pada pasien yang membeku harus dianggap perut akut sampai terbukti bukan. Jebakan kedua: hematuria TIDAK selalu ada — sekitar 10-15% kolik batu memiliki urinalisis tanpa darah sama sekali (terutama bila ureter tersumbat total), sehingga urinalisis bersih tidak menyingkirkan batu.',
    konsekuensi: {
      narasi: 'Obstruksi yang dibiarkan menekan ginjal dari dalam; bila berlangsung berminggu-minggu, kerusakan parenkim menjadi permanen. Yang paling ditakuti adalah bila ginjal tersumbat itu terinfeksi: urosepsis berkembang dalam hitungan jam dan tidak akan tertolong tanpa drainase segera.',
      kembaliHariMin: 2,
      kembaliHariMax: 7,
      kondisiKembali: 'Pasien kembali dengan demam tinggi, menggigil, nyeri pinggang hebat, dan tekanan darah turun — obstruksi yang terinfeksi berkembang menjadi urosepsis.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 — kolik renal/ureter (3A): analgesia lebih dulu, rujuk bila obstruksi/demam/gangguan fungsi ginjal. NSAID lini pertama & terapi ekspulsif alfa-blocker pada batu ureter distal 5-10 mm.',
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
      { id: 'ferritin_serum', hasil: 'Feritin 9 ng/mL — cadangan besi habis, sesuai perdarahan kronis.', flag: 'rendah', relevan: true },
      { id: 'feses_rutin', hasil: 'Darah samar (+); tidak tampak telur cacing maupun amuba.', flag: 'abnormal', relevan: true },
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
    clue: 'Benjolan anus yang prolaps MENETAP dan tidak dapat direposisi = hemoroid interna derajat IV, disertai anemia defisiensi besi akibat perdarahan kronis. Kompetensi konservatif FKTP (serat, cairan, hindari mengejan, pelunak tinja) hanya menuntaskan derajat 1; derajat IV memerlukan tindakan definitif (hemoroidektomi) sehingga WAJIB dirujuk ke bedah. Yang tetap menjadi tugas FKTP dan tidak boleh dilewatkan: mulai pelunak tinja dan koreksi besi oral (feritin 9 ng/mL — cadangan habis), perbaiki serat/cairan, dan yang paling penting JARING RED FLAG keganasan. Meski pasien ini tidak memiliki red flag lain (berat badan stabil, pola BAB tak berubah, tak ada riwayat keluarga), usia di atas 40 tahun dengan anemia defisiensi besi tetap merupakan indikasi penelusuran kolon — sebutkan ini di surat rujukan, jangan biarkan diagnosis "wasir" menutup pertanyaan.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP membatasi kompetensi tuntas FKTP HANYA pada hemoroid interna derajat 1 dengan pendekatan konservatif: serat 25-30 g/hari, air 6-8 gelas/hari, hindari mengejan lama, serta HINDARI OAINS dan makanan pedas-berlemak. Derajat 2, 3, dan 4 serta hemoroid eksterna WAJIB dirujuk ke layanan sekunder. PPK juga menuntut colok dubur pada setiap perdarahan per anum dan kewaspadaan terhadap keganasan.`,
    catatanRealita: 'Kolonoskopi bukan layanan Puskesmas dan antreannya bisa berbulan-bulan — tetapi keterbatasan itu tidak boleh berubah menjadi alasan untuk tidak mencurigai. Yang bisa dan harus dilakukan FKTP tetap ada: inspeksi, colok dubur, anoskopi bila tersedia, darah rutin, dan feritin.',
    mutiaraEbm: 'Hemoroid adalah diagnosis yang paling sering dipakai untuk MENJELASKAN perdarahan per anum — dan justru karena itu ia paling sering menutupi keganasan. Menemukan hemoroid TIDAK menyingkirkan kanker kolorektal: keduanya lazim pada kelompok usia yang sama dan bisa hidup berdampingan pada pasien yang sama. Anemia defisiensi besi pada pasien di atas 40 tahun tetap wajib ditelusuri ke saluran cerna atas dan bawah, bukan dianggap "wajar karena wasirnya berdarah". Perhatikan pula bahwa derajat hemoroid ditentukan oleh PROLAPS, bukan oleh perdarahan atau nyeri: hemoroid interna derajat IV yang besar justru sering TIDAK nyeri (pleksus internus berada di atas linea dentata yang tidak memiliki persarafan somatik) — sehingga "tidak sakit" kerap keliru dibaca sebagai "tidak berat".',
    konsekuensi: {
      narasi: 'Hemoroid derajat IV yang hanya diberi obat wasir terus berdarah: anemia memburuk sampai memerlukan transfusi, dan pasien berisiko mengalami inkarserasi/trombosis prolaps yang menjadi kegawatan nyeri hebat. Risiko terbesar bukan hemoroidnya, melainkan keganasan kolorektal yang tak pernah dijaring karena perdarahannya sudah "ada penjelasannya".',
      kembaliHariMin: 14,
      kembaliHariMax: 60,
      kondisiKembali: 'Pasien kembali makin pucat dan sesak saat beraktivitas ringan dengan Hb yang terus turun; benjolan sempat terjepit dan membiru, nyeri hebat, tak bisa duduk sama sekali.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 — hemoroid: konservatif hanya derajat 1, derajat 2-4 dirujuk; colok dubur wajib & waspada keganasan pada perdarahan per anum.',
    },
  }),

  /* ========================================================================
   * 8. Abses Perianal (K61.0, 3B, rujuk bedah)
   * Poin ajar PENTING: `insisi_abses` benar untuk bisul kulit, SALAH untuk
   *   abses perianal (rongga dalam + fistula → butuh kamar operasi).
   *   Karena itu ia masuk tindakanSalahUmum, bukan prosedur.
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
      { id: 'darah_rutin', hasil: 'Leukosit 18.600/µL dengan neutrofilia; Hb 13,2 g/dL.', flag: 'tinggi', relevan: true },
      { id: 'gds', hasil: '312 mg/dL — hiperglikemia tak terkontrol; memperberat infeksi dan memperlambat penyembuhan.', flag: 'tinggi', relevan: true },
      { id: 'hba1c', hasil: '10,8% — kendali glikemik buruk berkepanjangan.', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['K61.0', 'K60.3', 'K64.5'],
    tatalaksana: {
      obatBenar: ['paracetamol_500'],
      obatAlternatif: [['amoxiclav_625', 'ceftriaxone_1g_inj']],
      obatOpsional: ['metronidazol_500', 'tramadol_50'],
      obatSalahUmum: [
        { id: 'hidrokortison_krim', alasan: 'Krim steroid untuk "wasir" adalah obat pertama yang paling sering dicoba pada nyeri dubur. Di sini ia menekan peradangan permukaan tanpa menyentuh nanah yang terkumpul di dalam, menyamarkan tanda lokal sehingga abses tampak lebih tenang daripada sebenarnya, dan pada penyandang diabetes justru melemahkan pertahanan jaringan tepat saat infeksinya sedang meluas.', bahaya: 'kontraindikasi' },
        { id: 'dexamethasone_05', alasan: 'Kortikosteroid sistemik pada infeksi bakteri aktif yang belum didrainase menekan respons imun persis saat ia paling dibutuhkan, dan pada pasien dengan gula darah 312 mg/dL ia melonjakkan glikemia lebih jauh — dua hal yang bersama-sama mempercepat perjalanan menuju infeksi yang mengancam jaringan.', bahaya: 'kontraindikasi' },
        { id: 'ciprofloxacin_500', alasan: 'Kuinolon tunggal tidak mencakup anaerob yang mendominasi abses perianal. Namun kesalahan yang lebih mendasar: TIDAK ADA antibiotik yang menyembuhkan nanah yang sudah terkumpul — antibiotik hanya penunjang menjelang drainase. Meresepkannya lalu menyuruh pasien pulang dan kontrol seminggu lagi adalah keputusan yang paling merugikan pasien ini.', bahaya: 'nonPrimer' },
      ],
      tindakanSalahUmum: [
        { id: 'insisi_abses', alasan: 'Refleks "ada fluktuasi → insisi" TEPAT untuk abses kulit dangkal, tetapi TIDAK untuk abses perianal. Rongganya meluas ke dalam ruang iskioanal yang tidak terlihat dari luar, sehingga insisi kecil di poliklinik hanya mengeluarkan sebagian nanah dan meninggalkan kantong yang terus terisi — pasien kembali dengan abses yang sama dalam hitungan hari. Dua kerugian lain lebih berat: insisi buta di dekat sfingter berisiko melukai otot penahan tinja (inkontinensia permanen), dan jaringan parut yang ditimbulkannya merusak anatomi yang dibutuhkan ahli bedah untuk menemukan muara fistula — sekitar sepertiga abses perianal berasal dari fistula yang harus dicari dan ditangani sekaligus. Abses perianal memerlukan drainase adekuat dengan eksplorasi fistula dalam anestesi di kamar operasi; tugas FKTP adalah analgesia, antibiotik, dan RUJUK.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['persiapan_rujukan_operatif', 'tanda_bahaya', 'kepatuhan_obat', 'diet_dm'],
      edukasiKritis: ['persiapan_rujukan_operatif', 'tanda_bahaya'],
    },
    clue: 'Nyeri anus berdenyut hebat yang membuat pasien tidak bisa duduk + demam + benjolan perianal eritematosa dengan fluktuasi + leukositosis = abses perianal. Terapi definitifnya adalah DRAINASE — tetapi bukan drainase di FKTP. Berbeda dari bisul kulit, abses perianal meluas ke ruang iskioanal yang tak terlihat dari luar, berdekatan dengan sfingter, dan pada sekitar sepertiga kasus berasal dari fistula kriptoglandular yang harus dieksplorasi dalam anestesi. Karena itu jawabannya: analgesia + antibiotik + RUJUK BEDAH, bukan insisi. Antibiotik di sini tidak menggantikan drainase, tetapi tetap terindikasi karena pasien demam, leukositosisnya tinggi, dan ia penyandang diabetes tak terkontrol (GDS 312, HbA1c 10,8%) — kelompok yang berisiko tinggi infeksi meluas. Kendalikan gula darahnya sebagai bagian dari tata laksana infeksi, bukan urusan terpisah untuk "nanti setelah sembuh".',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan abses perianal sebagai kompetensi 3B — dikenali dan distabilkan di FKTP, lalu dirujuk untuk drainase bedah. Perhatikan pembedaannya dengan abses kulit superfisial biasa, yang insisi-drainasenya memang kompetensi 4A dokter FKTP; letak perianal (kedekatan dengan sfingter dan kemungkinan fistula) yang memindahkannya ke ranah bedah.`,
    catatanRealita: 'Godaan terbesar di Puskesmas justru bukan kekurangan alat, melainkan sebaliknya: set minor surgery ADA, dokternya bisa insisi, pasiennya kesakitan hebat dan memohon "dikeluarkan saja nanahnya sekarang", dan RS rujukan jauh. Semua tekanan mengarah ke tindakan yang salah. Di sinilah kompetensi FKTP diuji sebagai keputusan untuk TIDAK bertindak di luar lingkup —',
    mutiaraEbm: 'Abses perianal yang "belum tampak matang" dari luar sering dipulangkan untuk kompres hangat dan diminta kembali bila sudah lunak — padahal sebagian besar rongganya berada DI DALAM, di ruang iskioanal, dan permukaan yang masih tenang justru menyembunyikan nanah yang sudah banyak. Nyeri anus hebat yang membuat pasien tidak bisa duduk, disertai demam, sudah cukup untuk merujuk; menunggu "matang" hanya berlaku untuk bisul kulit biasa. Jebakan kedua khusus pada diabetes: tanda lokalnya bisa TAMPAK RINGAN karena respons radang tumpul, sementara infeksinya justru berkembang paling cepat — nyeri yang jauh melampaui temuan yang terlihat adalah tanda bahaya, bukan tanda pasien berlebihan. Bila muncul krepitasi, bula, atau area kehitaman, itu sudah gangren Fournier: kegawatan bedah dengan hitungan jam, bukan hari.',
    konsekuensi: {
      narasi: 'Abses perianal yang tidak didrainase adekuat terus meluas di sepanjang ruang iskioanal dan supralevator. Pada penyandang diabetes tak terkontrol, ia dapat berkembang menjadi gangren Fournier — infeksi nekrotikans perineum dengan mortalitas tinggi yang menuntut debridemen luas darurat. Insisi tak adekuat di FKTP menambah satu risiko lagi: fistula persisten dan cedera sfingter.',
      kembaliHariMin: 1,
      kembaliHariMax: 4,
      kondisiKembali: 'Pasien kembali dengan demam tinggi, nyeri yang meluas ke seluruh perineum dan skrotum, kulit kehitaman dengan krepitasi, dan tanda sepsis — gangren Fournier pada diabetes tak terkontrol.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 — abses perianal (3B): analgesia + antibiotik + rujuk bedah untuk drainase; bedakan dari abses kulit superfisial (4A).',
    },
  }),

  /* ========================================================================
   * 9. Trauma Abdomen Tumpul (S36.9, 3B, gawat, rujuk bedah)
   * Poin ajar: TD normal & Hb normal MENIPU pada dewasa muda. ABC + 2 jalur
   *   besar + oksigen + puasa + pemantauan + transport cepat.
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
      { id: 'q_obat', kategori: 'rpd', tanya: 'Sedang minum obat pengencer darah, atau punya penyakit tertentu?', jawab: 'Tidak ada, Dok, saya sehat-sehat saja selama ini.' },
      { id: 'q_muntah', kategori: 'rps', tanya: 'Ada mual atau muntah setelah kejadian?', jawab: 'Mual, Dok, tapi belum muntah.', oldcarts: ['penyerta'] },
      { id: 'q_asuransi', kategori: 'sosial', tanya: 'Apakah Bapak punya BPJS, dan sudah lapor polisi soal kecelakaannya?', jawab: 'Punya BPJS, Dok. Polisi belum, tadi cuma dibantu orang-orang di jalan.', distraktor: true },
      { id: 'q_merokok', kategori: 'sosial', tanya: 'Bapak merokok?', jawab: 'Iya, Dok, sehari sebungkus.', distraktor: true },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Sadar penuh tetapi gelisah dan haus; kulit pucat, dingin, berkeringat; capillary refill 3-4 detik. Airway bebas, bicara jelas dalam kalimat penuh.', relevan: true },
      { region: 'abdomen', temuan: 'Jejas setang berupa memar melintang di perut kiri atas hingga tengah. Nyeri tekan hebat kuadran kiri atas dengan defans lokal; perut mulai distensi; bising usus menurun.', relevan: true },
      { region: 'jantung', temuan: 'Takikardia 122×/menit, nadi teraba lemah dan cepat, tekanan darah 92/60 — pola syok hipovolemik kelas II.', relevan: true },
      { region: 'toraks_paru', temuan: 'Gerak dada simetris, vesikuler +/+, tidak ada jejas dinding dada maupun nyeri tekan iga kiri bawah.', relevan: true },
      { region: 'neurologis', temuan: 'GCS 15, pupil isokor reaktif, tidak ada defisit fokal, tidak ada nyeri pada palpasi tulang belakang.', relevan: false },
    ],
    lab: [
      { id: 'usg_abdomen', hasil: 'Pemeriksaan terfokus (FAST): tampak CAIRAN BEBAS di ruang splenorenal dan kantong Douglas; perikardium bebas. Konsisten dengan hemoperitoneum.', flag: 'abnormal', relevan: true },
      { id: 'hb', hasil: '9,8 g/dL — sudah turun pada jam pertama.', flag: 'rendah', relevan: true },
      { id: 'golongan_darah', hasil: 'O rhesus positif — hasil dikirim bersama pasien untuk persiapan transfusi di RS rujukan.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['S36.9', 'S30.1', 'S36.0'],
    tatalaksana: {
      obatBenar: ['asam_traneksamat_500_inj'],
      obatAlternatif: [['nacl_09_inf', 'ringer_laktat_inf']],
      obatSalahUmum: [
        { id: 'ketorolak_30_inj', alasan: 'NSAID pada trauma dengan perdarahan aktif mengganggu fungsi trombosit tepat saat pembekuan paling dibutuhkan, dan memperberat risiko cedera ginjal pada pasien yang sudah syok dan belum berkemih. Nyeri trauma diredakan dengan opioid titrasi di bawah pemantauan, bukan NSAID.', bahaya: 'kontraindikasi' },
        { id: 'furosemid_40', alasan: 'Belum berkemih sejak kejadian pada pasien ini adalah tanda GINJAL YANG KEKURANGAN DARAH, bukan gagal ginjal. Memberi diuretik memperdalam syok dengan memaksa keluar cairan yang justru harus diganti. Yang menaikkan produksi urine di sini adalah cairan dan darah, bukan furosemid.', bahaya: 'kontraindikasi' },
        { id: 'hyoscine_butilbromida_20_inj', alasan: 'Nyeri di sini bukan kolik melainkan darah yang mengiritasi rongga perut; tidak ada spasme otot polos yang disasar. Antispasmodik hanya menumpulkan salah satu tanda yang sedang dipakai untuk memantau perburukan.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['pasang_infus', 'resusitasi_cairan_kristaloid', 'oksigen', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        { id: 'bilas_lambung', alasan: 'Bilas lambung tidak punya tempat pada trauma abdomen tumpul. Ia tidak menghasilkan informasi yang mengubah keputusan (yang menentukan adalah cairan bebas pada FAST dan keadaan hemodinamik), memicu muntah dan risiko aspirasi pada pasien syok, serta membuang menit-menit yang seharusnya dipakai untuk resusitasi dan transport. Bila lambung perlu dikosongkan menjelang transfer, yang dipasang adalah NGT untuk DEKOMPRESI — dialirkan, bukan dibilas.', bahaya: 'berbahaya' },
        { id: 'transfusi_darah_fktp', alasan: 'Puskesmas tidak memiliki bank darah, uji silang, maupun kemampuan mengelola reaksi transfusi. Mencoba mentransfusi di FKTP menahan pasien di tempat yang tidak dapat menghentikan perdarahannya — dan pada cedera organ padat, satu-satunya terapi definitif adalah kendali sumber di kamar operasi. Kirim golongan darah bersama pasien; jangan menahan pasien sambil menunggu darah.', bahaya: 'berbahaya' },
      ],
      edukasi: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif', 'tanda_bahaya'],
      edukasiKritis: ['puasa_sambil_rujuk'],
      terapiKritis: ['resusitasi_cairan_kristaloid'],
    },
    stabilisasiWajib: ['pasang_infus', 'resusitasi_cairan_kristaloid', 'oksigen'],
    clue: 'Kecelakaan motor berkecepatan tinggi + jejas setang di perut kiri atas + nyeri tekan dengan defans lokal + pucat, dingin, gelisah, haus, takikardia 122 dengan tekanan darah 92/60 + FAST menunjukkan cairan bebas = trauma abdomen tumpul dengan hemoperitoneum, curiga cedera limpa. Nyeri bahu kiri tanpa benturan di bahu adalah tanda Kehr: darah di bawah diafragma yang menjalar lewat saraf frenikus — petunjuk klasik cedera limpa. Tugas FKTP mengikuti urutan ABC: pastikan jalan napas, beri OKSIGEN, pasang DUA jalur intravena berdiameter besar dan mulai RESUSITASI CAIRAN kristaloid hangat, PUASAKAN (jangan beri makan/minum — pasien ini kandidat operasi dalam hitungan jam), pantau vital ketat, dan RUJUK BEDAH SEGERA. Asam traneksamat diberikan sedini mungkin karena bukti CRASH-2 menunjukkan penurunan mortalitas pada pasien trauma yang berdarah bila diberikan dalam 3 jam pertama — dan justru MEMBAHAYAKAN bila diberikan lewat dari itu; catat jam kejadian dan jam pemberian di surat rujukan. Yang menyelamatkan pasien ini adalah kendali sumber di kamar operasi, sehingga tidak ada pemeriksaan di FKTP yang boleh menunda transport.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan trauma abdomen dengan dugaan cedera organ dalam sebagai kegawatan 3B: lakukan penilaian dan stabilisasi awal sesuai prinsip ABC (survei primer), pasang jalur intravena dan berikan cairan, puasakan, jangan lakukan tindakan diagnostik invasif di FKTP, lalu rujuk cito ke layanan bedah. Imobilisasi servikal ditambahkan bila mekanisme cedera atau keluhan mengarah ke cedera tulang belakang — pada pasien ini kepala/leher tidak terbentur dan tidak nyeri, sehingga tidak otomatis diperlukan.`,
    catatanRealita: 'Skenario memberi FAST yang langsung terbaca dan asam traneksamat yang siap pakai — dua hal yang tidak dapat diandalkan ada di Puskesmas nyata. Keduanya juga BUKAN prasyarat: keputusan merujuk pasien ini sudah ditegakkan oleh mekanisme cedera, jejas setang, dan tanda syok — tanpa satu pun pemeriksaan penunjang.',
    mutiaraEbm: 'Dua angka paling sering menenangkan secara keliru pada trauma abdomen tumpul. Pertama TEKANAN DARAH: dewasa muda dapat mempertahankan tekanan darah NORMAL sampai kehilangan sekitar 30% volume darahnya, karena vasokonstriksi kompensatoris. Takikardia, gelisah, haus, kulit dingin, dan capillary refill memanjang muncul jauh lebih dulu — saat tekanan darah akhirnya turun (seperti pasien ini), cadangan sudah hampir habis dan penurunannya bisa mendadak. Kedua HEMOGLOBIN: pada jam-jam pertama Hb masih bisa NORMAL meski perdarahan deras, sebab yang hilang adalah darah utuh dan hemodilusi belum sempat terjadi — Hb normal TIDAK menyingkirkan perdarahan aktif, dan Hb yang sudah turun seperti pasien ini justru menandakan perdarahan yang banyak dan cepat. Jebakan ketiga: perut yang lunak dan tidak nyeri pun tidak menyingkirkan cedera organ padat, terutama pada pasien dengan penurunan kesadaran, mabuk, atau cedera pengalih perhatian yang lebih nyeri.',
    konsekuensi: {
      narasi: 'Cedera limpa yang terus berdarah menghabiskan volume sirkulasi; syok berkembang menjadi tak terkompensasi dengan trias mematikan asidosis, hipotermia, dan koagulopati. Penundaan transport demi pemeriksaan tambahan, pemberian makan/minum yang menunda anestesi, atau upaya transfusi di FKTP semuanya memindahkan pasien menjauh dari satu-satunya yang menyelamatkan: kendali sumber di kamar operasi.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Pasien memburuk dalam perjalanan atau kembali dalam syok berat: kesadaran menurun, nadi tak teraba di radialis, tekanan darah tak terukur, perut makin distensi — perdarahan intraabdomen masif yang tak terkendali.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 — trauma abdomen (3B): survei primer ABC, cairan IV, puasa, rujuk cito bedah. Asam traneksamat dini pada trauma yang berdarah: CRASH-2 (manfaat bila <3 jam, merugikan bila lebih).',
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
