import type { LabEnrichmentSpec } from './enrichment'

/**
 * Pengayaan interaktif untuk kasus batch 2 (39 kasus). Ditulis 2026-07-16.
 * Kunci = id kasus di batch2.ts. Lihat enrichment.ts untuk semantik merge.
 *
 * DISTRAKTOR = differential-driven, bukan generik (audit CODEX 2026-07-16 #1).
 * Gelombang pertama memakai 4 pertanyaan serbaguna (poliuria-polidipsia, keluhan
 * jantung, riwayat jantung keluarga, artralgia migran) yang ditempel lintas
 * kategori; pada kasus mata/laktasi/IMS pertanyaan itu tak punya alasan klinis
 * sehingga pemain dihukum secara ARTIFISIAL. Penggantinya harus MASUK AKAL diucapkan
 * dokter pada kasus INI — mengejar satu diagnosis banding yang sudah
 * disingkirkan temuan lain, mitos klinis lokal yang lazim, atau faktor risiko
 * milik penyakit SERUPA — tetapi tetap tak mengubah keputusan.
 *
 * Distraktor boleh menyebut organ spesifik-gender HANYA bila kasusnya sendiri
 * dikunci `jenisKelamin` di batch2.ts (mis. payudara/puting pada kasus P-only,
 * kulup pada L-only); untuk kasus tanpa kunci gender, pakai `hanyaUntuk` atau
 * tetap netral.
 */
export const LAB_ENRICHMENT_2: Record<string, LabEnrichmentSpec> = {
  lab_kejang_demam_sederhana: {
    distraktor: [
      { id: 'q_dist_angin_malam', kategori: 'sosial', tanya: 'Apakah sebelum kejang anak sempat kehujanan atau kena angin malam?', jawab: 'Tidak, dia di rumah terus seharian. Orang-orang bilang kejang begini gara-gara masuk angin, benar tidak Dok?' },
    ],
    konsekuensi: {
      narasi: 'Bila orang tua tidak diajari pertolongan kejang dan tanda bahaya, kejang berikutnya ditangani panik dan tanda infeksi SSP bisa terlewat.',
      kembaliHariMin: 2, kembaliHariMax: 5,
      kondisiKembali: 'Anak kejang lagi saat demam dan orang tua bingung menangani.',
    },
    variasiPembuka: {
      cemas: 'Anak saya tadi kejang saat demam — tolong Dok, apa otaknya kenapa-kenapa?',
      polos: 'Tadi anak saya kejang pas demam, sekarang udah sadar lagi, Dok.',
      wali_anak: 'Anak saya barusan kejang ketika demam tinggi, sekarang sudah sadar kembali, Dok.',
    },
  },
  lab_tetanus_generalisata_awal: {
    distraktor: [
      { id: 'q_dist_paku_karat', kategori: 'rps', tanya: 'Apakah paku yang menusuk telapak kaki Anda itu berkarat?', jawab: 'Tidak saya perhatikan berkarat atau tidak, Dok. Saya langsung mencabutnya lalu mencuci kakinya.' },
    ],
    obatSalahUmum: [
      { id: 'diazepam_rektal_10', alasan: 'Satu tube rektal bukan kontrol baku untuk spasme refleks singkat pada pasien sadar. Bila spasme memanjang atau mengganggu jalan napas, benzodiazepin harus dititrasi sesuai protokol dengan kesiapan ventilasi dan tidak boleh menunda transfer.', bahaya: 'nonPrimer' },
      { id: 'metronidazol_500', alasan: 'Tablet oral tidak tepat pada pasien disfagia yang dipuasakan dan bukan pengganti antimikroba parenteral serta debridemen terkontrol di fasilitas rujukan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tetanus dapat menimbulkan spasme laring dan gagal napas; menunda minimalisasi rangsang dan rujukan mengancam nyawa.',
      kembaliHariMin: 1, kembaliHariMax: 1,
      kondisiKembali: 'Spasme makin sering, menelan makin sulit, dan mulai sesak.',
    },
    variasiPembuka: {
      cemas: 'Rahang saya kaku dan badan kejang tiap dengar suara keras — ini tetanus yang mematikan itu ya, Dok?',
      polos: 'Rahang saya susah dibuka, badan kaku-kejang kalau ada suara keras, Dok.',
      lansia: 'Rahang saya kaku dan tubuh menegang setiap ada suara atau sentuhan, Dok.',
    },
  },
  lab_hiv_tanpa_komplikasi: {
    distraktor: [
      { id: 'q_dist_transfusi', kategori: 'rpd', tanya: 'Apakah Anda pernah menerima transfusi darah atau berbagi jarum suntik?', jawab: 'Tidak pernah dua-duanya, Dok.' },
    ],
    obatSalahUmum: [
      { id: 'cotrimoxazole_480', alasan: 'Kotrimoksazol bukan obat otomatis untuk setiap diagnosis HIV. Pada kasus ini CD4 428 sel/mm3, tidak ada stadium klinis 3/4 atau TB aktif, sehingga profilaksis tidak terindikasi; nilai ulang bila CD4, stadium, atau status TB berbeda.', bahaya: 'nonPrimer' },
      { id: 'vitamin_b_kompleks', alasan: 'Multivitamin sebagai penambah daya tahan tidak menekan replikasi virus dan mengaburkan bahwa ARV adalah terapi yang menentukan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Menunda inisiasi dan kehilangan hubungan dengan layanan membuat replikasi virus berlanjut, supresi tidak tercapai, serta kesempatan pencegahan dan monitoring terlewat; perburukan klinis tidak harus muncul seketika.',
      kembaliHariMin: 30, kembaliHariMax: 60,
      kondisiKembali: 'Masih tanpa gejala berat tetapi belum memulai ARV, viral load belum pernah diperiksa, dan nomor kontak program tidak pernah dikonfirmasi untuk re-engagement rahasia.',
    },
    variasiPembuka: {
      cemas: 'Tes HIV awal saya reaktif dan saya diminta kembali — saya takut sekali, apa saya masih bisa hidup normal, Dok?',
      polos: 'Tes HIV awal saya reaktif, Dok. Saya disuruh balik buat memastikan hasil dan bahas obat.',
      lansia: 'Tes HIV awal saya reaktif. Saya diminta kembali untuk memastikan hasil dan membahas pengobatan, Dok.',
    },
  },
  lab_gangguan_somatoform: {
    konsekuensi: {
      narasi: 'Bila hasil pemeriksaan tidak dijelaskan dan layanan tetap terfragmentasi, ketidakpastian, risiko iatrogenik, serta gangguan fungsi dapat berlanjut. Kontinuitas memberi ruang untuk menilai perubahan nyata tanpa mengulang seluruh investigasi secara otomatis.',
      kembaliHariMin: 21, kembaliHariMax: 35,
      kondisiKembali: 'Kembali dengan rasa tegang di leher dan kekhawatiran baru; membawa hasil lama tetapi belum memiliki rencana kontrol maupun sasaran fungsi yang disepakati.',
    },
    variasiPembuka: {
      cemas: 'Dada saya berdebar dan badan sakit berpindah-pindah. Saya masih takut ada penyakit yang terlewat, Dok.',
      polos: 'Dada sering berdebar dan badan sakit pindah-pindah sudah berbulan-bulan, Dok.',
      lansia: 'Sudah berbulan-bulan badan saya nyeri berpindah dan dada berdebar. Saya ingin memahami apa yang terjadi, Dok.',
    },
  },
  lab_benda_asing_konjungtiva: {
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Steroid tidak dipakai pada mata dengan benda asing/potensi abrasi kornea; berisiko memperberat dan menghambat penyembuhan.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Bila fragmen organik tertinggal atau defek epitel pascatindakan tidak dikenali, inflamasi dan keratitis dapat berkembang. Kontrol dini membedakan iritasi yang pulih dari komplikasi yang perlu rujukan.',
      kembaliHariMin: 1, kembaliHariMax: 2,
      kondisiKembali: 'Mata tetap mengganjal dan kini lebih merah serta silau; visus harus diukur ulang, kelopak dieversi kembali, dan kornea dinilai dengan fluorescein untuk mencari fragmen, defek, atau infiltrat.',
    },
    variasiPembuka: {
      cemas: 'Mata kanan mengganjal setelah sekam masuk. Apa mata saya tergores parah, Dok?',
      polos: 'Ada sekam masuk mata kanan pas berkebun, sekarang ngeganjel, Dok.',
      lansia: 'Sekam tertiup ke mata kanan saya tadi pagi, sekarang terasa mengganjal, Dok.',
    },
  },
  lab_perdarahan_subkonjungtiva: {
    distraktor: [
      { id: 'q_dist_tular_mata_merah', kategori: 'sosial', tanya: 'Apakah ada orang serumah yang matanya merah juga belakangan ini?', jawab: 'Tidak ada, Dok, cuma saya sendiri.' },
    ],
    konsekuensi: {
      narasi: 'Umumnya sembuh sendiri; bila hipertensi/gangguan perdarahan yang mendasari tak dicari saat berulang, penyebabnya terlewat.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Bercak darah muncul lagi di mata yang lain tanpa sebab jelas.',
    },
    variasiPembuka: {
      cemas: 'Putih mata saya tiba-tiba merah seperti darah — apa pembuluh di mata saya pecah dan berbahaya, Dok?',
      polos: 'Bangun tidur mata saya ada bercak merah kayak darah, tapi nggak sakit, Dok.',
      lansia: 'Tadi pagi putih mata saya terlihat ada bercak darah, tapi tidak nyeri, Dok.',
    },
  },
  lab_mata_kering: {
    distraktor: [
      { id: 'q_dist_kabur_layar', kategori: 'rps', tanya: 'Apakah tulisan di layar juga tampak kabur atau berbayang?', jawab: 'Tidak, tulisannya jelas kok, Dok. Yang mengganggu cuma rasa berpasir dan cepat capeknya.' },
    ],
    obatSalahUmum: [
      { id: 'gentamisin_tetes_mata', alasan: 'Mata kering bukan infeksi bakteri; antibiotik tetes tak mengatasi defisiensi air mata dan menambah iritasi.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa lubrikasi dan modifikasi lingkungan, keluhan menetap dan permukaan kornea dapat lecet.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Mata makin perih, silau, dan berpasir sepanjang hari.',
    },
    variasiPembuka: {
      cemas: 'Mata saya kering dan cepat lelah terus — saya takut ini gejala penyakit mata serius, Dok.',
      polos: 'Mata berasa ada pasirnya, cepet capek kalau lihat layar, Dok.',
      lansia: 'Sudah umur begini mata saya gampang kering dan lelah kalau membaca lama, Dok.',
    },
  },
  lab_blefaritis_anterior: {
    distraktor: [
      { id: 'q_dist_bintitan', kategori: 'rps', tanya: 'Apakah ada benjolan seperti bintitan yang tumbuh di kelopak itu?', jawab: 'Tidak ada benjolan, Dok. Cuma gatal dan berkerak di pinggir kelopaknya.' },
    ],
    obatSalahUmum: [
      { id: 'kloramfenikol_tetes_mata', alasan: 'Blefaritis diobati kompres hangat dan higiene kelopak; antibiotik tetes rutin tidak menyelesaikan penyebabnya.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa higiene kelopak konsisten, keluhan kambuh-kambuhan dan bisa timbul komplikasi kornea.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Tepi kelopak masih gatal, berkerak, dan sekarang mata terasa mengganjal.',
    },
    variasiPembuka: {
      cemas: 'Kelopak mata gatal dan berkerak tiap bangun tidur — apa ada infeksi serius di mata saya, Dok?',
      polos: 'Kelopak mata gatal, ada kerak di pangkal bulu mata tiap bangun tidur, Dok.',
      lansia: 'Dua minggu ini tepi kelopak mata saya gatal, panas, dan berkerak, Dok.',
    },
  },
  lab_trikiasis: {
    distraktor: [
      { id: 'q_dist_potong_bulu_mata', kategori: 'sosial', tanya: 'Apakah bulu mata itu pernah dipotong atau dicabut sendiri di rumah?', jawab: 'Belum pernah, Dok. Katanya kalau dipotong nanti tumbuhnya malah makin ke dalam, jadi saya biarkan.' },
    ],
    obatSalahUmum: [
      { id: 'kloramfenikol_tetes_mata', alasan: 'Iritasi di sini disebabkan silia yang menggesek permukaan mata, bukan infeksi; antibiotik tetes tidak mengangkat bulu mata dan menunda epilasi.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Silia yang menggesek kornea terus-menerus dapat menimbulkan abrasi hingga ulkus bila tidak dievaluasi dan ditangani berulang.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Mata makin nyeri, berair, dan mulai kabur.',
    },
    variasiPembuka: {
      cemas: 'Bulu mata bawah seperti menusuk mata dan bikin berair — apa kornea saya bisa rusak, Dok?',
      polos: 'Bulu mata bawah kayak nusuk mata, jadi berair terus, Dok.',
      lansia: 'Seminggu ini bulu mata bawah saya terasa menggesek saat berkedip, Dok.',
    },
  },
  lab_episkleritis_ringan: {
    distraktor: [
      { id: 'q_dist_kelilipan', kategori: 'rps', tanya: 'Apakah ada debu atau serpihan yang masuk ke mata kiri sebelum merahnya muncul?', jawab: 'Tidak ada, Dok. Merahnya muncul sendiri tanpa kemasukan apa-apa.' },
    ],
    obatSalahUmum: [
      { id: 'kloramfenikol_tetes_mata', alasan: 'Merah sektoral tanpa sekret bukan konjungtivitis bakterial; antibiotik tetes refleks pada setiap mata merah menambah paparan tanpa manfaat.', bahaya: 'nonPrimer' },
      { id: 'dexamethasone_05', alasan: 'Episkleritis ringan umumnya swasirna sehingga kortikosteroid sistemik berlebihan dan menyamarkan nyeri yang seharusnya membedakannya dari skleritis.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Episkleritis umumnya swasirna; namun bila skleritis/uveitis (nyeri dalam, silau, visus turun) tak dibedakan, kondisi serius bisa terlewat.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Nyeri berubah jadi dalam, silau berat, dan penglihatan mulai turun.',
    },
    variasiPembuka: {
      cemas: 'Sebagian putih mata kiri merah dan ngilu — apa ini radang mata yang bahaya, Dok?',
      polos: 'Putih mata kiri merah sebagian, agak ngilu, Dok, dari kemarin.',
      lansia: 'Sejak kemarin sebagian putih mata kiri saya merah dan terasa ngilu ringan, Dok.',
    },
  },
  lab_hipermetropia: {
    distraktor: [
      { id: 'q_dist_baca_gelap', kategori: 'sosial', tanya: 'Apakah Anda sering membaca di tempat yang kurang terang?', jawab: 'Kadang-kadang, Dok. Tapi di tempat terang pun mata saya tetap cepat lelah.' },
    ],
    obatSalahUmum: [
      { id: 'kloramfenikol_tetes_mata', alasan: 'Keluhan ini gangguan refraksi, bukan infeksi; antibiotik tetes tidak berperan sama sekali.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa koreksi optik yang tepat berdasarkan refraksi, keluhan lelah mata dan sakit kepala saat membaca menetap.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Masih cepat lelah dan sakit kepala tiap membaca dekat.',
    },
    variasiPembuka: {
      cemas: 'Mata cepat lelah dan kepala sakit tiap membaca dekat — apa ada penyakit di mata saya, Dok?',
      polos: 'Mata cepet capek sama kepala pusing kalau baca deket, Dok.',
      lansia: 'Mata saya cepat lelah dan kepala sakit saat membaca dekat, Dok.',
    },
  },
  lab_miopia_ringan: {
    distraktor: [
      { id: 'q_dist_nonton_dekat', kategori: 'sosial', tanya: 'Apakah Anda sering menonton televisi dari jarak sangat dekat?', jawab: 'Tidak, Dok, saya menontonnya dari jauh. Kaburnya tetap saja.' },
    ],
    obatSalahUmum: [
      { id: 'air_mata_buatan', alasan: 'Kabur jauh pada miopia berasal dari titik fokus yang jatuh di depan retina; tetes pelumas tidak mengubah fokus dan menunda pembuatan kacamata.', bahaya: 'nonPrimer' },
      { id: 'vitamin_b_kompleks', alasan: 'Tidak ada suplemen yang mengurangi derajat miopia; hanya koreksi lensa yang mengembalikan penglihatan jauh.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa koreksi optik yang sesuai, penglihatan jauh tetap kabur; perubahan cepat perlu evaluasi lanjut.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Papan tulis/rambu jalan masih kabur dan makin sering menyipitkan mata.',
    },
    variasiPembuka: {
      cemas: 'Tulisan di papan makin kabur padahal baca dekat jelas — apa mata saya rusak, Dok?',
      polos: 'Lihat jauh kabur, Dok, tapi baca deket masih jelas.',
      lansia: 'Melihat jauh terasa kabur, tetapi membaca dekat masih jelas, Dok.',
    },
  },
  lab_astigmatisme_ringan: {
    distraktor: [
      { id: 'q_dist_kucek_mata', kategori: 'sosial', tanya: 'Apakah Anda sering mengucek mata kuat-kuat?', jawab: 'Tidak sering, Dok. Berbayangnya tetap ada walaupun mata tidak dikucek.' },
    ],
    obatSalahUmum: [
      { id: 'air_mata_buatan', alasan: 'Bayangan berbayang di sini akibat lengkung kornea, bukan mata kering; pelumas tidak memperbaiki bias dan menggeser fokus dari resep lensa silinder.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa resep lensa silinder yang presisi, bayangan ganda dan lelah mata menetap.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Tulisan masih berbayang dan mata cepat lelah disertai sakit kepala.',
    },
    variasiPembuka: {
      cemas: 'Tulisan jauh dan dekat berbayang dan mata cepat lelah — apa mata saya bermasalah serius, Dok?',
      polos: 'Tulisan suka berbayang, Dok, mata jadi cepet capek.',
      lansia: 'Tulisan jauh maupun dekat tampak berbayang dan mata saya cepat lelah, Dok.',
    },
  },
  lab_presbiopia: {
    distraktor: [
      { id: 'q_dist_katarak', kategori: 'rps', tanya: 'Apakah penglihatan Anda terasa berkabut atau silau saat kena lampu kendaraan di malam hari?', jawab: 'Tidak, Dok. Penglihatan saya jernih dan tidak silau; cuma tulisan dekat yang harus dijauhkan.' },
    ],
    obatSalahUmum: [
      { id: 'vitamin_b_kompleks', alasan: 'Kesulitan membaca dekat adalah penurunan akomodasi karena usia; vitamin tidak memulihkan daya fokus dan menunda pemberian adisi lensa baca.', bahaya: 'nonPrimer' },
      { id: 'air_mata_buatan', alasan: 'Keluhan bukan mata kering melainkan titik dekat yang menjauh; pelumas tidak membantu dan mengalihkan dari resep kacamata baca.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa adisi lensa baca yang sesuai usia, kesulitan membaca dekat menetap dan mengganggu pekerjaan.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Masih harus menjauhkan tulisan agar terbaca.',
    },
    variasiPembuka: {
      cemas: 'Saya harus menjauhkan tulisan agar terbaca — apa mata saya mulai rusak parah, Dok?',
      polos: 'Baca tulisan mesti dijauhin baru kelihatan, Dok.',
      lansia: 'Sejak usia pertengahan saya harus menjauhkan bacaan agar bisa dibaca, Dok.',
    },
  },
  lab_buta_senja_defisiensi_vitamin_a: {
    distraktor: [
      { id: 'q_dist_buta_senja_turunan', kategori: 'rpk', tanya: 'Apakah ada anggota keluarga yang juga sulit melihat saat gelap sejak kecil?', jawab: 'Tidak ada, Dok. Kakak-kakaknya dan kami orang tuanya tidak ada yang begitu.' },
    ],
    obatSalahUmum: [
      { id: 'vitamin_b_kompleks', alasan: 'Buta senja di sini karena kekurangan vitamin A; vitamin B kompleks salah sasaran dan membiarkan xerosis kornea berlanjut.', bahaya: 'nonPrimer' },
      { id: 'air_mata_buatan', alasan: 'Pelumas hanya meredakan mata kering permukaan tanpa mengoreksi defisiensi vitamin A yang mengancam penglihatan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Defisiensi vitamin A yang tak dikoreksi berlanjut ke xerosis kornea dan kebutaan; juga menandakan masalah gizi/penyerapan.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Anak makin sulit melihat saat gelap dan mata tampak kering.',
    },
    variasiPembuka: {
      cemas: 'Anak saya sering menabrak benda saat mulai gelap — apa dia akan buta, Dok?',
      polos: 'Anak saya kalau hari mulai gelap suka nabrak-nabrak, Dok.',
      wali_anak: 'Anak saya sering menabrak benda ketika hari mulai gelap, Dok.',
    },
  },
  lab_infeksi_umbilikus_neonatus: {
    distraktor: [
      { id: 'q_dist_pusar_bodong', kategori: 'rpd', tanya: 'Apakah pusar bayi sudah tampak menonjol seperti bodong sejak lahir?', jawab: 'Tidak, Dok. Pusarnya biasa saja; baru dua hari ini bernanah dan sekitarnya merah.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_sirup', alasan: 'Neonatus dengan tanda sistemik butuh antibiotik parenteral dan rujukan; antibiotik oral tak adekuat dan menunda terapi yang menyelamatkan nyawa.', bahaya: 'kontraindikasi' },
      { id: 'gentamisin_krim', alasan: 'Antibiotik oles pada tali pusat tidak menembus infeksi yang sudah sistemik dan memberi rasa aman palsu untuk menunda transfer.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Omfalitis neonatus dapat cepat menjadi sepsis; menunda antibiotik dan rujukan sangat berbahaya pada bayi baru lahir.',
      kembaliHariMin: 1, kembaliHariMax: 1,
      kondisiKembali: 'Kemerahan meluas ke dinding perut, bayi makin lemas dan tak mau menyusu.',
    },
    variasiPembuka: {
      cemas: 'Tali pusat bayi saya bernanah dan kulit sekitarnya merah — tolong Dok, bayi saya kenapa?',
      polos: 'Tali pusat bayi bernanah, sekitarnya merah, dari pagi susah nyusu, Dok.',
      wali_anak: 'Pusar bayi saya mengeluarkan nanah, kulit sekitarnya merah, dan sejak pagi sulit menyusu, Dok.',
    },
  },
  lab_gonore_uretritis_pria: {
    distraktor: [
      { id: 'q_dist_kurang_minum', kategori: 'sosial', tanya: 'Apakah belakangan Anda kurang minum atau sering menahan kencing?', jawab: 'Minum saya cukup kok, Dok. Nanahnya keluar sendiri walaupun saya tidak kencing.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Gonore banyak resisten terhadap penisilin/amoksisilin; terapi tak adekuat memicu kegagalan dan resistensi.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa terapi adekuat dan layanan pasangan, infeksi dapat menetap, berpindah kembali antar pasangan, serta meningkatkan risiko epididimitis; komplikasi bukan kepastian pada setiap pasien.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Duh uretra menetap dan mulai nyeri testis; pasangan belum pernah dihubungkan ke layanan dan kegagalan terapi belum dievaluasi untuk reinfeksi atau resistensi.',
    },
    variasiPembuka: {
      cemas: 'Keluar nanah dari kelamin dan perih saat kencing — apa ini penyakit menular yang bahaya, Dok?',
      polos: 'Dua hari ini keluar nanah waktu kencing dan perih, Dok.',
      lansia: 'Sejak dua hari lalu ada nanah keluar saat berkemih dan terasa perih, Dok.',
    },
  },
  lab_pielonefritis_tanpa_komplikasi: {
    distraktor: [
      { id: 'q_dist_kolik_batu', kategori: 'rps', tanya: 'Apakah nyeri pinggangnya hilang-timbul melilit dan menjalar sampai ke selangkangan?', jawab: 'Tidak, Dok. Nyerinya menetap di pinggang kanan saja dan tidak menjalar ke bawah.' },
    ],
    obatSalahUmum: [
      { id: 'nitrofurantoin_100', alasan: 'Nitrofurantoin hanya mencapai kadar efektif di urine kandung kemih, bukan jaringan ginjal, sehingga gagal pada pielonefritis.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Pielonefritis yang tak diobati adekuat dapat berkembang ke urosepsis; pemantauan respons dan tanda bahaya penting.',
      kembaliHariMin: 2, kembaliHariMax: 4,
      kondisiKembali: 'Demam menggigil menetap, nyeri pinggang memberat, dan mulai lemas.',
    },
    variasiPembuka: {
      cemas: 'Demam menggigil, pinggang kanan nyeri, perih kencing — apa ginjal saya infeksi berat, Dok?',
      polos: 'Demam menggigil, pinggang kanan sakit, kencing perih, Dok.',
      lansia: 'Saya demam menggigil dengan nyeri pinggang kanan dan perih saat berkemih, Dok.',
    },
  },
  lab_fimosis_patologis_ringan: {
    distraktor: [
      { id: 'q_dist_mengompol', kategori: 'rps', tanya: 'Apakah anak masih mengompol saat tidur malam?', jawab: 'Tidak, Dok. Anak saya sudah lama tidak mengompol.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Tidak ada tanda infeksi aktif; antibiotik oral tidak melebarkan cincin fibrotik dan hanya menambah paparan tanpa manfaat.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa penanganan tepat (steroid topikal/edukasi, hindari retraksi paksa), keluhan berkemih menetap dan risiko infeksi/parafimosis.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Ujung kulup masih menggelembung saat kencing dan mulai kemerahan.',
    },
    variasiPembuka: {
      cemas: 'Kulup anak sulit ditarik dan menggelembung saat kencing — apa harus operasi, Dok?',
      polos: 'Kulup anak saya susah ditarik, pas kencing ujungnya menggelembung, Dok.',
      wali_anak: 'Kulup anak saya sulit ditarik dan ujungnya menggelembung saat berkemih, Dok.',
    },
  },
  lab_parafimosis_reduksibel: {
    distraktor: [
      { id: 'q_dist_gigitan_serangga', kategori: 'rps', tanya: 'Apakah sebelumnya ada gigitan serangga atau Anda memakai obat oles baru di daerah itu?', jawab: 'Tidak ada, Dok. Bengkaknya baru muncul setelah kulup saya tarik dan tidak bisa kembali.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim_005', alasan: 'Krim steroid adalah terapi fimosis kronik, bukan parafimosis akut yang menuntut reduksi manual segera; memakainya menunda tindakan definitif dan mengancam glans.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Parafimosis adalah kegawatan; penundaan reduksi berisiko iskemia glans.',
      kembaliHariMin: 1, kembaliHariMax: 1,
      kondisiKembali: 'Kepala penis makin bengkak, nyeri hebat, dan mulai kebiruan.',
    },
    variasiPembuka: {
      cemas: 'Kulup tertarik ke belakang tak bisa kembali dan kepala penis membengkak — tolong Dok, sakit sekali!',
      polos: 'Kulup ketarik ke belakang nggak bisa balik, kepalanya bengkak, Dok.',
      lansia: 'Kulup saya tertarik ke belakang dan tidak bisa kembali, kepalanya membengkak, Dok.',
    },
  },
  lab_sindrom_duh_genital_servisitis: {
    distraktor: [
      { id: 'q_dist_celana_ketat', kategori: 'sosial', tanya: 'Apakah Anda memakai celana dalam ketat atau jarang mengganti pembalut?', jawab: 'Tidak, Dok. Saya rutin ganti dan celananya tidak ketat.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Servisitis banyak disebabkan gonokokus yang resisten penisilin; amoksisilin tidak adekuat dan berisiko gagal terapi.', bahaya: 'nonPrimer' },
      { id: 'metronidazol_500', alasan: 'Metronidazol menyasar vaginosis/trikomonas, bukan servisitis gonokokus-klamidia; salah sasaran membiarkan infeksi serviks berlanjut.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Servisitis yang menetap dapat naik menjadi PID, terutama bila terapi, follow-up, atau layanan pasangan terputus; infertilitas bukan hasil otomatis dari satu episode.',
      kembaliHariMin: 7, kembaliHariMax: 21,
      kondisiKembali: 'Sekret serviks menetap dan muncul nyeri perut bawah; hasil jejaring tidak pernah ditinjau dan pasangan belum terhubung ke layanan.',
    },
    variasiPembuka: {
      cemas: 'Keputihan kekuningan dan keluar darah setelah berhubungan — apa ini kanker, Dok?',
      polos: 'Keputihan kuning, terus keluar darah dikit abis berhubungan, Dok.',
      lansia: 'Saya mengalami keputihan kekuningan dan keluar sedikit darah setelah berhubungan, Dok.',
    },
  },
  lab_vulvitis_iritan: {
    distraktor: [
      { id: 'q_dist_perih_kencing', kategori: 'rps', tanya: 'Apakah perihnya terutama terasa saat kencing?', jawab: 'Tidak, Dok. Kencingnya biasa saja; yang perih kulit bagian luarnya.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Steroid poten pada area lipatan genital berisiko atrofi dan iritasi bila dipakai sembarangan; utamakan hentikan iritan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa menghentikan iritan (sabun pewangi) dan perawatan lembut, kemerahan dan perih menetap.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Kulit kemaluan luar masih perih dan merah.',
    },
    variasiPembuka: {
      cemas: 'Kulit kemaluan luar perih dan merah setelah pakai sabun kewanitaan baru — apa ini infeksi menular, Dok?',
      polos: 'Abis pakai sabun kewanitaan baru, kulit bawah jadi perih sama merah, Dok.',
      lansia: 'Setelah memakai sabun kewanitaan baru, kulit kemaluan luar saya perih dan merah, Dok.',
    },
  },
  lab_vaginitis_kandida: {
    distraktor: [
      { id: 'q_dist_sabun_kewanitaan', kategori: 'sosial', tanya: 'Apakah Anda memakai sabun kewanitaan atau membasuh dengan air rebusan daun sirih?', jawab: 'Tidak, Dok. Saya cuma pakai air biasa.' },
    ],
    obatSalahUmum: [
      { id: 'metronidazol_500', alasan: 'Metronidazol untuk vaginosis/trikomonas, bukan kandida; salah sasaran tak menyembuhkan jamur.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antijamur yang tepat, gatal dan keputihan kental menetap dan kambuh.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Keputihan putih kental dan gatal hebat masih ada.',
    },
    variasiPembuka: {
      cemas: 'Keputihan putih kental dan gatal hebat — apa ini penyakit menular seksual, Dok?',
      polos: 'Keputihan putih kentel, gatelnya minta ampun, Dok.',
      lansia: 'Saya mengalami keputihan putih kental disertai rasa gatal yang hebat, Dok.',
    },
  },
  lab_vaginosis_bakterialis: {
    distraktor: [
      { id: 'q_dist_darah_hubungan', kategori: 'rps', tanya: 'Apakah keluar darah setelah berhubungan?', jawab: 'Tidak ada darah, Dok. Cuma cairan encer yang baunya amis itu.' },
    ],
    obatSalahUmum: [
      { id: 'klotrimazol_vaginal_100', alasan: 'Duh amis dengan clue cells adalah vaginosis bakterial, bukan kandida; antijamur tidak mengoreksi ketidakseimbangan flora bakteri.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Vaginosis tak diterapi berisiko komplikasi kehamilan dan meningkatkan kerentanan IMS lain.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Keputihan abu-abu berbau amis masih berlanjut.',
    },
    variasiPembuka: {
      cemas: 'Keputihan encer abu-abu berbau amis, terutama setelah berhubungan — apa ini berbahaya, Dok?',
      polos: 'Keputihan encer abu-abu, baunya amis, apalagi abis berhubungan, Dok.',
      lansia: 'Keputihan saya encer keabu-abuan dan berbau amis, terutama setelah berhubungan, Dok.',
    },
  },
  lab_salpingitis_pid_ringan: {
    distraktor: [
      { id: 'q_dist_nyeri_pindah_kanan', kategori: 'rps', tanya: 'Apakah nyerinya bermula di sekitar pusar lalu pindah ke perut kanan bawah?', jawab: 'Tidak, Dok. Sejak awal nyerinya di kedua sisi bawah perut dan tidak pindah-pindah.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'PID butuh cakupan gonokokus, klamidia, dan anaerob; amoksisilin tunggal tak adekuat dan berisiko abses serta gangguan kesuburan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'PID yang tidak diobati adekuat meningkatkan risiko abses, nyeri pelvis kronik, infertilitas, dan kehamilan ektopik, tetapi tiap komplikasi tetap probabilistik.',
      kembaliHariMin: 2, kembaliHariMax: 5,
      kondisiKembali: 'Setelah lebih dari 72 jam nyeri perut bawah dan demam justru memberat, sehingga rawat jalan dinilai gagal dan rujukan rumah sakit kini wajib.',
    },
    variasiPembuka: {
      cemas: 'Perut bawah nyeri, keputihan berubah, sakit saat berhubungan — apa rahim saya infeksi berat, Dok?',
      polos: 'Perut bawah nyeri, keputihan berubah, sakit kalau berhubungan, Dok.',
      lansia: 'Perut bawah saya nyeri dengan keputihan yang berubah dan nyeri saat berhubungan, Dok.',
    },
  },
  lab_abortus_spontan_komplit: {
    distraktor: [
      { id: 'q_dist_angkat_berat', kategori: 'sosial', tanya: 'Apakah sebelum ini Anda mengangkat beban berat atau melewati jalan rusak dengan motor?', jawab: 'Tidak ada, Dok. Saya tidak mengangkat apa pun yang berat.' },
    ],
    obatSalahUmum: [
      { id: 'asam_traneksamat_500_inj', alasan: 'Perdarahan sudah minimal dan serviks menutup; antifibrinolitik injeksi tidak berindikasi pada abortus komplit yang stabil.', bahaya: 'nonPrimer' },
      { id: 'amoxicillin_500', alasan: 'Tanpa tanda infeksi, antibiotik profilaksis rutin tidak diperlukan dan hanya menambah paparan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Bila perdarahan sebenarnya belum tuntas (sisa jaringan) tak dikenali, bisa terjadi perdarahan berlanjut atau infeksi.',
      kembaliHariMin: 2, kembaliHariMax: 5,
      kondisiKembali: 'Perdarahan kembali banyak disertai demam dan nyeri perut.',
    },
    variasiPembuka: {
      cemas: 'Saya hamil delapan minggu, tadi keluar jaringan — apa kandungan saya bisa diselamatkan, Dok?',
      polos: 'Hamil delapan minggu, tadi keluar gumpalan jaringan, sekarang darah sama mulesnya berkurang, Dok.',
      lansia: 'Saya hamil delapan minggu, tadi keluar jaringan, kini darah dan mulasnya sudah berkurang, Dok.',
    },
  },
  lab_ruptur_perineum_derajat_1: {
    distraktor: [
      { id: 'q_dist_wasir', kategori: 'rpd', tanya: 'Apakah Anda punya wasir yang ikut berdarah setelah mengejan?', jawab: 'Tidak ada, Dok. Darahnya jelas keluar dari robekan itu, bukan dari dubur.' },
    ],
    obatSalahUmum: [
      { id: 'asam_traneksamat_500_inj', alasan: 'Rembesan berasal dari luka perineum yang perlu hemostasis lokal dan penjahitan, bukan antifibrinolitik sistemik yang menunda tindakan definitif.', bahaya: 'nonPrimer' },
      { id: 'amoxicillin_500', alasan: 'Robekan derajat 1 tanpa tanda infeksi tidak memerlukan antibiotik profilaksis rutin.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Robekan yang tak dirawat/dijahit dengan baik berisiko infeksi dan penyembuhan buruk.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Luka perineum merembes lagi, nyeri, dan tampak kemerahan/tanda infeksi.',
    },
    variasiPembuka: {
      cemas: 'Setelah melahirkan ada robekan yang terus merembes darah — apa ini berbahaya, Dok?',
      polos: 'Abis melahirkan normal ada robekan, darahnya merembes terus, Dok.',
      lansia: 'Setelah persalinan normal ada robekan perineum yang darahnya terus merembes, Dok.',
    },
  },
  lab_abses_folikel_rambut: {
    distraktor: [
      { id: 'q_dist_benjolan_mengejan', kategori: 'rps', tanya: 'Apakah benjolan di lipat paha itu membesar saat Anda batuk atau mengejan?', jawab: 'Tidak, Dok. Besarnya tetap saja, tidak berubah kalau batuk atau mengejan.' },
    ],
    konsekuensi: {
      narasi: 'Abses yang matang perlu insisi-drainase; antibiotik saja tanpa drainase sering gagal dan bisa meluas.',
      kembaliHariMin: 2, kembaliHariMax: 4,
      kondisiKembali: 'Benjolan makin besar, berdenyut, dan kulit sekitarnya merah meluas.',
    },
    variasiPembuka: {
      cemas: 'Ada benjolan bernanah berdenyut di lipat paha — apa ini akan menyebar ke darah, Dok?',
      polos: 'Di lipat paha ada benjolan bernanah, denyut-denyut, Dok.',
      lansia: 'Ada benjolan bernanah yang berdenyut di lipat paha saya, Dok.',
    },
  },
  lab_mastitis_laktasi: {
    distraktor: [
      { id: 'q_dist_terbentur', kategori: 'rps', tanya: 'Apakah payudara itu sempat terbentur atau tertindih saat tidur?', jawab: 'Tidak pernah terbentur, Dok. Merahnya muncul setelah payudara sering terasa penuh.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Mastitis laktasi umumnya oleh Staphylococcus aureus penghasil penisilinase; amoksisilin tanpa perlindungan beta-laktamase sering tak adekuat dibanding sefalosporin antistafilokokus.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Mastitis yang tak diobati dan payudara tak dikosongkan dapat berkembang menjadi abses.',
      kembaliHariMin: 2, kembaliHariMax: 4,
      kondisiKembali: 'Payudara makin merah nyeri dan teraba benjolan fluktuatif (abses).',
    },
    variasiPembuka: {
      cemas: 'Payudara kanan merah, nyeri, dan saya demam — apa saya harus berhenti menyusui, Dok?',
      polos: 'Payudara kanan merah sama nyeri, saya demam dari kemarin, Dok.',
      lansia: 'Payudara kanan saya merah, nyeri, dan saya demam sejak kemarin, Dok.',
    },
  },
  lab_puting_lecet: {
    distraktor: [
      { id: 'q_dist_tumbuh_gigi', kategori: 'rps', tanya: 'Apakah bayi Anda sudah tumbuh gigi sehingga menggigit saat menyusu?', jawab: 'Belum, Dok, giginya belum ada sama sekali. Sakitnya justru paling terasa saat awal menyusu.' },
    ],
    obatSalahUmum: [
      { id: 'mupirosin_krim', alasan: 'Fisura ini akibat perlekatan buruk tanpa tanda infeksi; antibiotik oles tidak memperbaiki teknik menyusu yang menjadi akar masalah.', bahaya: 'nonPrimer' },
      { id: 'nistatin_suspensi', alasan: 'Tidak ada bercak putih pada mulut bayi maupun tanda kandidiasis; antijamur empiris salah sasaran dan menunda koreksi pelekatan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa koreksi posisi-perlekatan, puting lecet berlanjut, ibu berhenti menyusui, dan berisiko mastitis.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Puting makin lecet, mulai luka, dan ibu enggan menyusui.',
    },
    variasiPembuka: {
      cemas: 'Puting saya lecet dan sangat sakit tiap bayi menyusu — apa saya harus berhenti menyusui, Dok?',
      polos: 'Puting lecet, sakit banget tiap anak nyusu, Dok.',
      lansia: 'Puting saya lecet dan sangat nyeri setiap bayi mulai menyusu, Dok.',
    },
  },
  lab_puting_tenggelam_laktasi: {
    distraktor: [
      { id: 'q_dist_keturunan_puting', kategori: 'rpk', tanya: 'Apakah ibu atau saudara perempuan Anda putingnya juga masuk ke dalam?', jawab: 'Tidak tahu, Dok, tidak pernah saya tanyakan.' },
    ],
    obatSalahUmum: [
      { id: 'domperidon_10', alasan: 'Masalahnya adalah pelekatan pada puting terinversi, bukan produksi ASI; obat pelancar ASI tidak menggantikan pendampingan teknik menyusui.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa dukungan teknik pelekatan, bayi kurang asupan dan payudara berisiko bengkak/mastitis.',
      kembaliHariMin: 2, kembaliHariMax: 5,
      kondisiKembali: 'Bayi masih sulit melekat dan payudara mulai bengkak penuh.',
    },
    variasiPembuka: {
      cemas: 'Puting saya masuk ke dalam dan bayi sulit melekat — apa dia akan kekurangan ASI, Dok?',
      polos: 'Puting saya masuk ke dalam, bayi baru lahir susah nyusu, Dok.',
      lansia: 'Puting saya tenggelam dan bayi baru lahir sulit melekat saat menyusu, Dok.',
    },
  },
  lab_dm_tipe1_stabil_prb: {
    bisaPrb: true,
    distraktor: [
      { id: 'q_dist_keluarga_dm', kategori: 'rpk', tanya: 'Apakah ada keluarga dekat Anda yang juga kena kencing manis?', jawab: 'Tidak ada, Dok. Cuma saya sendiri di keluarga.' },
    ],
    konsekuensi: {
      narasi: 'Tanpa review berbasis log, edukasi hipoglikemia, dan kesinambungan insulin, pola gula berbahaya berulang sebelum jalur PRB terbentuk.',
      kembaliHariMin: 2, kembaliHariMax: 5,
      kondisiKembali: 'Hipoglikemia malam berulang diselingi gula pagi tinggi; keluarga takut meneruskan insulin basal.',
    },
    variasiPembuka: {
      cemas: 'Saya diabetes tipe 1. HbA1c di resume 8,6%, gula pagi sering tinggi, tetapi dua malam lalu gula turun sampai 52 dan ibu harus membantu saya minum manis. Apa insulin saya sudah tidak bekerja, Dok?',
      polos: 'Saya mau kontrol insulin, Dok. Di resume HbA1c saya 8,6%. Gula pagi sering tinggi, tapi dua malam lalu turun sampai 52 dan ibu harus membantu memberi minuman manis.',
      lansia: 'Saya datang untuk kontrol insulin. HbA1c di resume rumah sakit 8,6%; gula pagi sering tinggi, tetapi dua malam lalu turun sampai 52 dan saya perlu bantuan keluarga untuk minum manis.',
    },
  },
  lab_malnutrisi_energi_protein_sedang: {
    distraktor: [
      { id: 'q_dist_postur_ortu', kategori: 'rpk', tanya: 'Apakah ayah dan ibunya memang bertubuh kecil sejak kecil?', jawab: 'Badan kami biasa saja, Dok, tidak kecil-kecil.' },
    ],
    obatSalahUmum: [
      { id: 'vitamin_b_kompleks', alasan: 'Wasting sedang butuh rehabilitasi makanan padat energi-protein; multivitamin tidak menyediakan kalori maupun protein dan menggeser fokus dari perbaikan asupan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa PMT yang benar-benar dikonsumsi, pemantauan kader, dan pencarian penyebab, berat badan terus turun meski program tercatat seolah berjalan.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Dua minggu berlalu tanpa kenaikan berat; konsumsi PMT dan hambatan keluarga belum pernah dicatat.',
    },
    variasiPembuka: {
      cemas: 'Anak saya makin kurus dan beratnya tak naik tiga bulan — apa dia kena penyakit berat, Dok?',
      polos: 'Anak saya kok makin kurus ya Dok, beratnya nggak naik-naik tiga bulan.',
      wali_anak: 'Anak saya tampak makin kurus dan berat badannya tidak naik selama tiga bulan, Dok.',
    },
  },
  lab_defisiensi_vitamin_b_kompleks: {
    distraktor: [
      { id: 'q_dist_bercak_putih_lidah', kategori: 'rps', tanya: 'Apakah ada bercak putih di lidah yang bisa dikerok?', jawab: 'Tidak ada bercak putih, Dok. Lidah saya merah dan perih saja.' },
    ],
    obatSalahUmum: [
      { id: 'ketokonazol_krim', alasan: 'Sudut bibir pecah di sini bersebab gizi tanpa tanda kandidiasis; antijamur oles menyasar dugaan infeksi yang tidak ada dan menunda perbaikan diet.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa perbaikan pola makan dan suplementasi, keluhan mukosa dan neurologis (kesemutan) dapat berlanjut.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Sudut bibir masih pecah, lidah perih, dan mulai kesemutan.',
    },
    variasiPembuka: {
      cemas: 'Sudut bibir sering pecah dan lidah perih sejak makan saya terbatas — apa ini gejala penyakit serius, Dok?',
      polos: 'Sudut bibir sering pecah, lidah perih, Dok, makan saya emang terbatas.',
      lansia: 'Sudut bibir saya sering pecah dan lidah terasa perih sejak pola makan saya terbatas, Dok.',
    },
  },
  lab_defisiensi_mineral_zinc: {
    distraktor: [
      { id: 'q_dist_sampo', kategori: 'sosial', tanya: 'Apakah rambut rontok itu muncul setelah ganti sampo atau sering dicatok?', jawab: 'Tidak, Dok. Sampo saya tidak ganti dan rambut saya tidak pernah dicatok.' },
    ],
    obatSalahUmum: [
      { id: 'zinc_20', alasan: 'Diagnosis defisiensi zinc belum terkonfirmasi dan ketersediaan zinc dibatasi untuk diare anak; melompat ke suplemen melewati perbaikan diet yang menjadi inti tata laksana.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa perbaikan diet dan evaluasi penyebab, penyembuhan luka lambat dan keluhan menetap.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Luka kecil masih lama sembuh dan selera makan tetap turun.',
    },
    variasiPembuka: {
      cemas: 'Luka kecil lama sembuh, rambut rontok, selera makan turun — apa saya kena penyakit menahun, Dok?',
      polos: 'Luka kecil lama sembuhnya, rambut rontok, nggak nafsu makan, Dok.',
      lansia: 'Luka kecil saya lama sembuh, rambut mudah rontok, dan selera makan menurun, Dok.',
    },
  },
  lab_anemia_defisiensi_besi_nonhamil: {
    distraktor: [
      { id: 'q_dist_keluarga_kurang_darah', kategori: 'rpk', tanya: 'Apakah ada keluarga yang darahnya kurang terus-menerus atau rutin ditransfusi?', jawab: 'Tidak ada, Dok. Tidak ada yang sampai harus tambah darah.' },
    ],
    obatSalahUmum: [
      { id: 'vitamin_b_kompleks', alasan: 'Anemia mikrositik dengan ferritin rendah adalah defisiensi besi; vitamin B kompleks tidak mengisi cadangan besi yang kosong.', bahaya: 'nonPrimer' },
      { id: 'asam_folat', alasan: 'Asam folat mengoreksi anemia makrositik, bukan defisiensi besi mikrositik; memberikannya tanpa besi membiarkan anemia berlanjut.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa terapi besi terukur dan penanganan sumber haid banyak, anemia berlanjut walau resep sempat ditebus.',
      kembaliHariMin: 14, kembaliHariMax: 28,
      kondisiKembali: 'Hb tidak membaik atau turun, lelah menetap, dan haid banyak belum ditindaklanjuti.',
    },
    variasiPembuka: {
      cemas: 'Saya cepat lelah, berdebar naik tangga, dan pucat — apa darah saya kurang parah, Dok?',
      polos: 'Gampang capek, deg-degan kalau naik tangga, badan pucet, Dok.',
      lansia: 'Saya cepat lelah, berdebar saat naik tangga, dan tampak pucat, Dok.',
    },
  },
  lab_limfadenitis_servikal_akut: {
    distraktor: [
      { id: 'q_dist_gondongan', kategori: 'sosial', tanya: 'Apakah ada teman sekolah atau saudara yang sedang gondongan?', jawab: 'Tidak ada, Dok. Tetangga bilang ini gondongan karena ada bengkak di leher, tapi tidak ada yang sedang sakit begitu.' },
    ],
    obatSalahUmum: [
      { id: 'oat_kdt', alasan: 'Benjolan baru tiga hari, nyeri, dengan fokus gigi adalah limfadenitis bakterial akut, bukan TB kelenjar; memulai OAT empiris tanpa bukti keliru dan membebani anak dengan obat program bertoksisitas.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Bila sumber infeksi (mis. gigi) tak diobati, kelenjar bisa membesar bernanah; kelenjar yang menetap perlu evaluasi lanjut.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Benjolan leher makin besar, nyeri, dan kulit di atasnya memerah.',
    },
    variasiPembuka: {
      cemas: 'Ada benjolan nyeri di leher setelah sakit gigi — apa ini tumor, Dok?',
      polos: 'Abis sakit gigi, ada benjolan nyeri di leher sama demam ringan, Dok.',
      wali_anak: 'Setelah sakit gigi dan demam ringan, muncul benjolan nyeri di leher anak saya, Dok.',
    },
  },
  lab_leptospirosis_tanpa_komplikasi: {
    distraktor: [
      { id: 'q_dist_perjalanan_malaria', kategori: 'sosial', tanya: 'Apakah Anda baru bepergian ke daerah yang banyak malarianya?', jawab: 'Tidak, Dok. Saya tidak ke mana-mana, cuma bersih-bersih rumah yang kebanjiran.' },
    ],
    obatSalahUmum: [
      { id: 'natrium_diklofenak_50', alasan: 'Nyeri betis menggoda pemberian NSAID, tetapi leptospirosis berisiko gangguan ginjal dan perdarahan sehingga NSAID memperberat kedua bahaya itu; pilih parasetamol.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Sebagian suspek ringan pulih dengan terapi dini, tetapi keterlambatan dapat berkembang ke penyakit berat; kasus kedua pascabanjir juga menandai pajanan wilayah yang belum ditutup.',
      kembaliHariMin: 2, kembaliHariMax: 4,
      kondisiKembali: 'Pada lintasan memburuk, demam menetap disertai ikterus atau oliguria; warga lain dari lorong banjir yang sama mulai berobat bila respons One Health belum berjalan.',
    },
    variasiPembuka: {
      cemas: 'Demam mendadak, sakit kepala, betis sangat nyeri setelah banjir — apa ini penyakit dari air kotor yang bahaya, Dok?',
      polos: 'Abis beres-beres rumah kebanjiran, saya demam, kepala pusing, betis nyeri banget, Dok.',
      lansia: 'Setelah membersihkan rumah yang kebanjiran, saya demam mendadak dengan betis sangat nyeri, Dok.',
    },
  },
  lab_anafilaksis_makanan: {
    distraktor: [
      { id: 'q_dist_panik', kategori: 'rpd', tanya: 'Apakah Anda pernah didiagnosis serangan panik atau sedang banyak pikiran belakangan ini?', jawab: 'Tidak pernah, Dok. Ini muncul sendiri sepuluh menit setelah saya makan udang.' },
    ],
    obatSalahUmum: [
      { id: 'ctm_4', alasan: 'Antihistamin oral tidak menggantikan adrenalin IM pada anafilaksis; mengandalkannya menunda terapi penyelamat nyawa.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Anafilaksis dapat fatal dalam menit; menunda adrenalin IM dan rujukan mengancam nyawa.',
      kembaliHariMin: 1, kembaliHariMax: 1,
      kondisiKembali: 'Sesak memberat, suara makin serak, dan tekanan darah turun.',
    },
    variasiPembuka: {
      cemas: 'Setelah makan udang bibir bengkak, suara serak, napas berbunyi — tolong Dok, saya sesak!',
      polos: 'Abis makan udang, bibir bengkak, badan bentol, napas bunyi ngik, Dok.',
      lansia: 'Setelah makan udang, bibir saya bengkak, kulit bentol, dan napas mulai berbunyi, Dok.',
    },
  },
}
