import type { LabEnrichmentSpec } from './enrichment'

/**
 * Pengayaan interaktif untuk kasus batch 1 (25 kasus). Ditulis 2026-07-16.
 * Kunci = id kasus di batch1.ts. Lihat enrichment.ts untuk semantik merge
 * (aditif: obatSalahUmum di-dedup, konsekuensi/bisaPrb hanya mengisi bila
 * kasus dasar belum punya; distraktor di-append; variasiPembuka menempel di
 * pertanyaan q_keluhan).
 */
export const LAB_ENRICHMENT_1: Record<string, LabEnrichmentSpec> = {
  lab_pneumonia_komunitas_dewasa: {
    distraktor: [
      { id: 'q_dist_mandi_malam', kategori: 'sosial', tanya: 'Apakah sering mandi malam atau tidur dengan kipas angin menyala langsung ke badan?', jawab: 'Tidak, Dok, saya jarang mandi malam dan tidak pakai kipas angin. Tapi kata tetangga paru-paru basah itu karena kena angin malam, benar tidak?' },
    ],
    variasiPembuka: {
      cemas: 'Dok, batuk saya berdahak dan dada kanan sakit kalau tarik napas — saya takut ini paru-paru basah yang parah.',
      polos: 'Batuk-batuk dahak kuning, demam, terus dada kanan nyeri kalau napas dalam, Dok.',
      lansia: 'Sudah beberapa hari saya batuk berdahak dan demam, kalau menarik napas dada kanan ini terasa sakit, Dok.',
    },
  },
  lab_influenza_tanpa_komplikasi: {
    distraktor: [
      { id: 'q_dist_kontak_unggas', kategori: 'sosial', tanya: 'Apakah ada kontak dengan unggas yang sakit atau mati mendadak di sekitar rumah?', jawab: 'Tidak ada, Dok. Di rumah tidak ada ayam dan tetangga juga tidak memelihara unggas.' },
    ],
    obatSalahUmum: [
      { id: 'azitromisin_500', alasan: 'Influenza tanpa komplikasi adalah infeksi virus; menambah makrolida tidak memberi manfaat dan mendorong resistensi.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Pemberian antibiotik yang tidak perlu tak mempercepat sembuh; tanpa edukasi tanda bahaya, komplikasi pneumonia bisa terlambat dikenali.',
      kembaliHariMin: 3, kembaliHariMax: 5,
      kondisiKembali: 'Demam menetap dan mulai muncul sesak serta nyeri dada.',
    },
    variasiPembuka: {
      cemas: 'Mendadak badan pegal semua, demam, pilek — saya khawatir ini bukan flu biasa, Dok.',
      polos: 'Dari kemarin badan meriang, pegel semua, pilek sama batuk kering.',
      lansia: 'Tiba-tiba kemarin badan saya nyeri semua, demam, pilek dan batuk kering, Dok.',
    },
  },
  lab_pertusis_remaja: {
    distraktor: [
      { id: 'q_dist_pemicu_asma', kategori: 'rps', tanya: 'Apakah batuknya muncul saat olahraga atau kena debu, dan ada bunyi ngik-ngik saat menarik napas?', jawab: 'Tidak, Dok. Batuknya datang sendiri kapan saja dan tidak ada bunyi ngik-ngik.' },
    ],
    konsekuensi: {
      narasi: 'Bila tidak diobati dan kontak berisiko (bayi) tidak dilindungi, batuk paroksismal berlanjut berminggu-minggu dan penularan ke bayi berbahaya.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Batuk beruntun makin sering sampai muntah, dan adik bayinya mulai batuk.',
    },
    variasiPembuka: {
      cemas: 'Batuk saya sudah hampir dua minggu dan sekali batuk susah berhenti sampai muntah — ini kenapa ya Dok, kok tidak sembuh?',
      polos: 'Batuknya lama, Dok, kalau mulai batuk nggak berhenti-berhenti sampai mau muntah.',
      lansia: 'Sudah hampir dua minggu batuk saya ini, sekali mulai susah berhenti sampai muntah, Dok.',
    },
  },
  lab_laringitis_akut: {
    distraktor: [
      { id: 'q_dist_es_gorengan', kategori: 'sosial', tanya: 'Apakah sering minum es atau makan gorengan sebelum suara menjadi serak?', jawab: 'Jarang, Dok. Seraknya muncul setelah pilek dan setelah saya bicara keras seharian.' },
    ],
    konsekuensi: {
      narasi: 'Bila suara tidak diistirahatkan dan iritan diteruskan, serak bisa menetap; antibiotik yang tak perlu hanya menambah risiko efek samping.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Suara masih serak berat dan tenggorokan makin kering.',
    },
    variasiPembuka: {
      cemas: 'Suara saya mendadak hilang serak setelah pilek — apa pita suara saya rusak, Dok?',
      polos: 'Abis pilek, suara saya jadi serak banget, tenggorokan kering.',
      lansia: 'Setelah pilek kemarin, suara saya jadi serak dan tenggorokan terasa kering, Dok.',
    },
  },
  lab_mabuk_perjalanan: {
    distraktor: [
      { id: 'q_dist_migrain', kategori: 'rps', tanya: 'Apakah pusingnya disertai sakit kepala berdenyut sebelah dan mata silau melihat cahaya?', jawab: 'Tidak, Dok. Kepala saya tidak sakit, hanya pusing berputar dan mual saat kendaraan berkelok.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Mabuk perjalanan bukan infeksi; antibiotik sama sekali tidak berperan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antihistamin pencegah dan langkah non-farmakologis, keluhan berulang setiap perjalanan dan mengganggu aktivitas.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Kembali mengeluh pusing-mual hebat tiap naik kendaraan.',
    },
    variasiPembuka: {
      cemas: 'Tiap naik bus berkelok saya pusing, mual, keringat dingin — apa ada yang salah dengan telinga saya, Dok?',
      polos: 'Kalau naik bus yang jalannya belok-belok, saya mesti pusing sama mual, Dok.',
      lansia: 'Setiap bepergian naik kendaraan yang berkelok saya jadi pusing dan mual, Dok.',
    },
  },
  lab_furunkel_hidung: {
    distraktor: [
      { id: 'q_dist_pantangan_telur', kategori: 'sosial', tanya: 'Apakah ada pantangan makanan yang dilanggar, misalnya kebanyakan makan telur atau kacang?', jawab: 'Tidak ada pantangan khusus, Dok. Kata ibu saya bisulan itu gara-gara kebanyakan makan telur, memangnya benar begitu?' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Furunkel adalah infeksi bakteri folikel; steroid topikal justru menekan imun lokal dan memperberat infeksi.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Memencet furunkel di zona berbahaya hidung berisiko menyebarkan infeksi ke sinus kavernosus — komplikasi serius bila diabaikan.',
      kembaliHariMin: 2, kembaliHariMax: 4,
      kondisiKembali: 'Nyeri dan bengkak meluas ke pipi disertai demam.',
    },
    variasiPembuka: {
      cemas: 'Ada bisul di dalam hidung kanan yang nyeri sekali — saya takut infeksinya menyebar ke otak, Dok.',
      polos: 'Di lubang hidung kanan ada benjolan kayak bisul, nyeri, Dok, udah tiga hari.',
      lansia: 'Lubang hidung kanan saya nyeri, ada benjolan seperti bisul sejak tiga hari ini, Dok.',
    },
  },
  lab_rinitis_vasomotor: {
    distraktor: [
      { id: 'q_dist_sekat_hidung', kategori: 'rpd', tanya: 'Apakah hidung pernah terbentur atau patah sehingga sekatnya bengkok?', jawab: 'Tidak pernah, Dok. Hidung saya tidak pernah terbentur. Lagipula mampetnya hilang timbul, bukan tersumbat terus di satu sisi.' },
    ],
    obatSalahUmum: [
      { id: 'oksimetazolin_spray', alasan: 'Dekongestan topikal dipakai berkepanjangan menimbulkan rinitis medikamentosa (efek rebound).', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa menghindari pencetus dan mengandalkan dekongestan semprot terus-menerus, hidung justru makin mampet karena rebound.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Hidung tersumbat makin berat dan makin bergantung pada semprot.',
    },
    variasiPembuka: {
      cemas: 'Hidung saya sering mampet dan berair kalau kena asap atau udara dingin — apa ini alergi berat, Dok?',
      polos: 'Hidung gampang mampet sama berair kalau kena asap atau dingin, tapi nggak gatal.',
      lansia: 'Hidung saya ini sering tersumbat dan berair kalau kena udara dingin atau asap, Dok.',
    },
  },
  lab_stomatitis_aftosa: {
    distraktor: [
      { id: 'q_dist_panas_dalam', kategori: 'sosial', tanya: 'Apakah sariawan ini muncul karena kurang minum air putih atau sedang panas dalam?', jawab: 'Minum saya cukup banyak kok, Dok. Kata orang memang panas dalam, tapi saya perhatikan lukanya selalu di tempat yang sering tergigit.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Sariawan aftosa bukan infeksi bakteri; antibiotik tidak membantu dan tak ada indikasi.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Umumnya sembuh sendiri; namun bila sering kambuh dan luas tanpa evaluasi pencetus, kualitas makan-minum terganggu.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Sariawan baru bermunculan dan sulit makan.',
    },
    variasiPembuka: {
      cemas: 'Ada sariawan di bibir dalam yang nyeri sekali — apa ini tanda penyakit serius, Dok?',
      polos: 'Sariawan di dalam bibir, Dok, perih banget udah empat hari.',
      lansia: 'Ada sariawan yang nyeri di bibir bagian dalam sejak empat hari, Dok.',
    },
  },
  lab_kandidiasis_mulut: {
    distraktor: [
      { id: 'q_dist_asam_lambung', kategori: 'rpd', tanya: 'Apakah sering asam lambung naik sampai mulut terasa asam atau pahit?', jawab: 'Tidak, Dok. Tidak pernah terasa asam naik ke mulut. Perihnya baru terasa sejak ada lapisan putih ini.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Ini infeksi jamur (kandida); antibiotik tidak mengobatinya dan malah bisa memperberat pertumbuhan jamur.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antijamur dan pencarian faktor predisposisi (imunosupresi, DM, steroid inhalasi), lapisan putih meluas dan nyeri menelan.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Bercak putih meluas ke tenggorokan dan makin nyeri menelan.',
    },
    variasiPembuka: {
      cemas: 'Mulut saya perih dan ada lapisan putih yang bisa dikelupas — apa ini kanker mulut, Dok?',
      polos: 'Mulut perih, ada putih-putih yang bisa dikelupas, Dok.',
      lansia: 'Mulut saya terasa perih dan ada lapisan putih yang bisa terkelupas, Dok.',
    },
  },
  lab_parotitis_mumps: {
    distraktor: [
      { id: 'q_dist_batu_ludah', kategori: 'rps', tanya: 'Apakah bengkaknya muncul mendadak tepat saat mulai makan lalu mengempis lagi setelah selesai makan?', jawab: 'Tidak, Dok. Bengkaknya menetap sejak kemarin, tidak hilang timbul saat makan.' },
    ],
    konsekuensi: {
      narasi: 'Umumnya swasirna, tetapi tanpa edukasi isolasi dan pemantauan, penularan berlanjut dan komplikasi (orkitis, meningitis) bisa terlewat.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Bengkak pipi masih ada dan muncul nyeri hebat baru (mis. testis atau kepala).',
    },
    variasiPembuka: {
      cemas: 'Pipi dekat telinga kiri bengkak dan sakit mengunyah — ini gondongan yang bahaya ya, Dok?',
      polos: 'Pipi deket kuping kiri bengkak, sakit kalau ngunyah, Dok.',
      lansia: 'Pipi saya dekat telinga kiri bengkak dan sakit saat mengunyah, Dok.',
    },
  },
  lab_intoleransi_makanan_laktosa: {
    distraktor: [
      { id: 'q_dist_gluten', kategori: 'rps', tanya: 'Apakah keluhan yang sama juga muncul setelah makan roti, mi, atau makanan bertepung terigu?', jawab: 'Tidak, Dok. Roti dan mi aman saja; hanya susu yang membuat perut saya kembung.' },
    ],
    obatSalahUmum: [
      { id: 'loperamid_2', alasan: 'Ini bukan diare infektif; antimotilitas tak menyelesaikan penyebab (defisiensi laktase) dan dapat menutupi gejala.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa penyesuaian diet laktosa, kembung dan mulas berulang setiap konsumsi susu dan mengganggu aktivitas.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Kembali kembung dan mulas berat setelah minum susu.',
    },
    variasiPembuka: {
      cemas: 'Perut saya selalu kembung dan mulas tiap minum susu — apa ada yang salah dengan usus saya, Dok?',
      polos: 'Tiap minum susu perut saya kembung sama mulas, Dok, tapi nggak sesak.',
      lansia: 'Kalau saya minum susu, perut jadi kembung dan mulas, Dok, tapi tak sampai biduran.',
    },
  },
  lab_alergi_makanan_ringan: {
    distraktor: [
      { id: 'q_dist_biduran_fisik', kategori: 'rps', tanya: 'Apakah bentolnya juga bisa muncul saat berkeringat, kena udara dingin, atau saat kulit tergaruk?', jawab: 'Tidak pernah, Dok. Bentolnya hanya muncul kalau saya makan udang.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Reaksi alergi makanan bukan infeksi; antibiotik tidak berperan dan menambah risiko sensitisasi.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa identifikasi dan penghindaran pemicu serta rencana bila reaksi berat, paparan berulang berisiko reaksi lebih hebat.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Muncul biduran lagi setelah tak sengaja makan udang, kali ini disertai bibir bengkak.',
    },
    variasiPembuka: {
      cemas: 'Tiap makan udang kulit saya langsung bentol gatal — saya takut suatu saat sesak napas, Dok.',
      polos: 'Kalau makan udang, badan langsung bentol-bentol gatal, Dok.',
      lansia: 'Setiap saya makan udang, kulit langsung bentol dan gatal, Dok.',
    },
  },
  lab_keracunan_makanan_ringan: {
    distraktor: [
      { id: 'q_dist_tifus', kategori: 'rps', tanya: 'Apakah demamnya naik bertahap makin tinggi tiap sore selama lebih dari seminggu?', jawab: 'Tidak, Dok. Baru semalam mulainya dan panasnya hanya hangat sedikit.' },
    ],
    konsekuensi: {
      narasi: 'Bila rehidrasi tidak adekuat dan tanda dehidrasi diabaikan, pasien bisa jatuh lemas; antimotilitas rutin dapat memperberat bila ada infeksi invasif.',
      kembaliHariMin: 1, kembaliHariMax: 3,
      kondisiKembali: 'Lemas, mata cekung, dan buang air besar cair masih sering.',
    },
    variasiPembuka: {
      cemas: 'Dari tadi malam saya muntah dan diare terus setelah makan nasi kotak — apa ini keracunan berat, Dok?',
      polos: 'Habis makan nasi kotak rame-rame, semalem saya muntah sama mencret terus, Dok.',
      lansia: 'Sejak tadi malam saya muntah dan diare setelah makan nasi kotak bersama, Dok.',
    },
  },
  lab_cacing_tambang: {
    distraktor: [
      { id: 'q_dist_talasemia', kategori: 'rpk', tanya: 'Apakah ada keluarga yang sejak kecil pucat dan harus transfusi darah berulang?', jawab: 'Tidak ada, Dok. Keluarga saya tidak ada yang seperti itu.' },
    ],
    obatSalahUmum: [
      { id: 'prazikuantel_600', alasan: 'Prazikuantel menyasar cacing pipih, bukan nematoda seperti cacing tambang, sehingga infeksi dan anemianya berlanjut.', bahaya: 'nonPrimer' },
      { id: 'vitamin_b_kompleks', alasan: 'Anemia di sini mikrositik hipokrom akibat kehilangan besi kronis; vitamin B kompleks tidak mengisi cadangan besi maupun membunuh cacingnya.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa obat cacing dan perbaikan sanitasi/alas kaki, anemia defisiensi besi memberat dan reinfeksi terus berulang.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Makin pucat, lelah, dan berdebar saat aktivitas ringan.',
    },
    variasiPembuka: {
      cemas: 'Saya cepat lelah dan pucat, perut kadang tak enak berbulan-bulan — apa saya kena penyakit darah, Dok?',
      polos: 'Badan gampang capek sama pucet, Dok, perut kadang mules udah lama.',
      lansia: 'Belakangan ini saya cepat lelah dan pucat, perut kadang tidak enak, Dok.',
    },
  },
  lab_strongiloidiasis: {
    distraktor: [
      { id: 'q_dist_larva_pantai', kategori: 'sosial', tanya: 'Apakah garis merah gatal itu muncul di kaki setelah duduk atau berbaring di pasir pantai?', jawab: 'Tidak, Dok. Garisnya muncul di bokong dan saya jarang sekali ke pantai.' },
    ],
    obatSalahUmum: [
      { id: 'dexamethasone_05', alasan: 'Kortikosteroid pada strongiloidiasis berisiko memicu sindrom hiperinfeksi yang mengancam nyawa.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Bila tidak diterapi tuntas — apalagi bila kelak diberi steroid — risiko hiperinfeksi dan penyebaran larva meningkat.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Mulas menetap dan garis merah gatal berpindah makin sering muncul.',
    },
    variasiPembuka: {
      cemas: 'Perut sering mulas dan ada garis merah gatal yang berpindah cepat di kulit — ini cacing yang bahaya ya, Dok?',
      polos: 'Perut sering mules, terus ada garis merah gatal yang jalan-jalan di kulit, Dok.',
      lansia: 'Perut saya sering mulas dan kadang muncul garis merah gatal yang berpindah, Dok.',
    },
  },
  lab_skistosomiasis_sulteng: {
    distraktor: [
      { id: 'q_dist_wasir', kategori: 'rps', tanya: 'Apakah ada benjolan yang keluar dari dubur atau nyeri saat BAB keras?', jawab: 'Tidak ada benjolan, Dok, dan BAB saya tidak keras. Duburnya juga tidak sakit.' },
    ],
    obatSalahUmum: [
      { id: 'albendazol_400', alasan: 'Refleks "cacingan berarti albendazol" salah sasaran: albendazol menyasar nematoda usus, sedangkan Schistosoma adalah cacing pipih.', bahaya: 'nonPrimer' },
      { id: 'metronidazol_500', alasan: 'BAB berdarah mudah dikira amebiasis, tetapi telur Schistosoma sudah ditemukan dan metronidazol tidak membunuh cacingnya.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa terapi terkoordinasi program dan penghindaran air tawar endemis, infeksi kronis merusak organ dan reinfeksi berlanjut.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Nyeri perut menetap dan BAB berdarah masih berulang.',
    },
    variasiPembuka: {
      cemas: 'Sepulang dari kebun di Lembah Napu perut sering sakit dan BAB kadang berdarah — ini kanker usus bukan, Dok?',
      polos: 'Abis dari kebun di Lembah Napu, perut sering sakit, BAB kadang ada darahnya, Dok.',
      lansia: 'Sejak pulang berkebun di Lembah Napu, perut saya sering sakit dan BAB kadang berdarah, Dok.',
    },
  },
  lab_taeniasis_intestinal: {
    distraktor: [
      { id: 'q_dist_kremi', kategori: 'rps', tanya: 'Apakah ada gatal hebat di sekitar dubur pada malam hari?', jawab: 'Tidak ada, Dok. Dubur saya tidak gatal sama sekali.' },
    ],
    obatSalahUmum: [
      { id: 'loperamid_2', alasan: 'Bukan diare; antimotilitas tidak relevan untuk taeniasis dan tak mengeluarkan cacing.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa terapi dan edukasi memasak daging matang, proglotid terus keluar dan risiko sistiserkosis pada Taenia solium ada.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Masih melihat potongan putih bergerak di tinja.',
    },
    variasiPembuka: {
      cemas: 'Saya melihat potongan putih pipih bergerak di tinja — cacingnya bisa masuk ke otak ya, Dok?',
      polos: 'Di kotoran saya ada potongan putih pipih yang gerak-gerak, Dok, beberapa kali.',
      lansia: 'Saya beberapa kali melihat potongan putih pipih bergerak di tinja saya, Dok.',
    },
  },
  lab_hepatitis_a_akut: {
    distraktor: [
      { id: 'q_dist_leptospirosis', kategori: 'sosial', tanya: 'Apakah rumah baru kebanjiran atau banyak tikus, dan apakah betis terasa sangat nyeri saat ditekan?', jawab: 'Tidak, Dok. Rumah tidak kebanjiran dan betis saya tidak nyeri ditekan.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Hepatitis A adalah infeksi virus swasirna; antibiotik tidak berperan dan menambah beban hati.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Umumnya sembuh sendiri; namun obat hepatotoksik yang tidak perlu dan kurangnya pemantauan tanda gagal hati berbahaya.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Kuning makin pekat, mual berat, dan mulai tampak mengantuk.',
    },
    variasiPembuka: {
      cemas: 'Mata saya kuning, urine gelap, mual seminggu ini — apa hati saya sudah rusak, Dok?',
      polos: 'Mata jadi kuning, kencing warnanya gelap, mual, nggak nafsu makan seminggu, Dok.',
      lansia: 'Sudah seminggu mata saya kuning, air kencing gelap, dan saya mual tidak nafsu makan, Dok.',
    },
  },
  lab_bronkiolitis_berat: {
    distraktor: [
      { id: 'q_dist_tersedak_benda', kategori: 'rps', tanya: 'Apakah bayi sempat tersedak keras atau memasukkan benda kecil ke mulut tepat sebelum sesaknya mulai?', jawab: 'Tidak ada, Dok. Sesaknya datang pelan-pelan setelah dua hari pilek, bukan mendadak tersedak.' },
    ],
    konsekuensi: {
      narasi: 'Bronkiolitis berat pada bayi dapat memburuk cepat menjadi gagal napas bila stabilisasi dan rujukan ditunda.',
      kembaliHariMin: 1, kembaliHariMax: 2,
      kondisiKembali: 'Napas bayi makin cepat, tarikan dinding dada makin dalam, dan biru di sekitar bibir.',
    },
    variasiPembuka: {
      cemas: 'Bayi saya pilek lalu tadi malam napasnya cepat sekali dan susunya jauh berkurang — tolong Dok, dia sesak!',
      polos: 'Bayi saya abis pilek, sekarang napasnya cepet banget sama nggak mau nyusu, Dok.',
      wali_anak: 'Anak bayi saya mulanya pilek, tapi sejak semalam napasnya cepat dan menyusunya berkurang jauh, Dok.',
    },
  },
  lab_efusi_pleura: {
    distraktor: [
      { id: 'q_dist_asbes', kategori: 'sosial', tanya: 'Apakah pekerjaan Anda pernah berhubungan dengan asbes atau debu tambang selama bertahun-tahun?', jawab: 'Tidak pernah, Dok. Saya berdagang di pasar.' },
    ],
    obatSalahUmum: [
      { id: 'azitromisin_500', alasan: 'Mengobati sindrom ini sebagai pneumonia rawat jalan tidak mengeluarkan cairan pleura dan menunda rujukan yang justru menentukan penyebabnya.', bahaya: 'nonPrimer' },
      { id: 'furosemid_40', alasan: 'Diuretik hanya masuk akal bila efusi jelas kardiogenik, sedangkan pasien menyangkal riwayat gagal jantung dan justru menunjukkan gejala mengarah TB.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa evaluasi lanjut dan rujukan untuk menentukan penyebab (TB, keganasan, gagal jantung), sesak memberat dan penyakit dasar tak tertangani.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Sesak makin berat bahkan saat istirahat.',
    },
    variasiPembuka: {
      cemas: 'Napas saya makin pendek dan dada kiri berat seminggu ini — apa ada cairan atau tumor di paru saya, Dok?',
      polos: 'Napas makin pendek, dada kiri kerasa berat, Dok, udah seminggu.',
      lansia: 'Sudah seminggu napas saya makin pendek dan dada kiri terasa berat, Dok.',
    },
  },
  lab_edema_paru_akut_hipertensif: {
    distraktor: [
      { id: 'q_dist_asma_bronkial', kategori: 'rpd', tanya: 'Apakah Anda pernah didiagnosis asma atau memakai obat semprot pelega napas?', jawab: 'Tidak pernah... saya tidak punya asma, Dok.' },
    ],
    obatSalahUmum: [
      { id: 'nifedipin_10', alasan: 'Nifedipin kerja cepat untuk "menurunkan tensi" memicu penurunan tekanan darah tak terkendali dan takikardia refleks pada jantung yang sedang kepayahan.', bahaya: 'kontraindikasi' },
      { id: 'bisoprolol_5', alasan: 'Beta-blocker menekan curah jantung tepat saat ventrikel gagal mengompensasi, sehingga tidak dimulai pada dekompensasi akut.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Edema paru akut adalah kegawatan; menunda posisi, oksigen, dan transfer dapat berujung gagal napas.',
      kembaliHariMin: 1, kembaliHariMax: 1,
      kondisiKembali: 'Sesak memberat, tak bisa berbaring, dan saturasi terus turun.',
    },
    variasiPembuka: {
      cemas: 'Saya mendadak sesak berat saat tidur dan batuk berbusa merah muda — rasanya seperti mau mati, Dok!',
      polos: 'Tadi tidur tiba-tiba sesak banget, batuknya keluar busa merah muda, Dok.',
      lansia: 'Saya mendadak sangat sesak saat berbaring dan batuk berbusa kemerahan, Dok.',
    },
  },
  lab_pneumotoraks_spontan: {
    distraktor: [
      { id: 'q_dist_otot_dada', kategori: 'rps', tanya: 'Apakah sebelum nyerinya muncul sempat angkat beban berat atau olahraga yang menarik otot dada?', jawab: 'Tidak, Dok. Saya cuma duduk-duduk saja, tidak angkat apa pun. Nyerinya datang mendadak seperti ditusuk.' },
    ],
    obatSalahUmum: [
      { id: 'salbutamol_inhaler', alasan: 'Sesak mendadak refleks dianggap asma, padahal perkusi hipersonor menunjukkan paru kolaps yang tidak akan mengembang oleh bronkodilator.', bahaya: 'nonPrimer' },
      { id: 'azitromisin_500', alasan: 'Tidak ada demam atau tanda infeksi; antibiotik di sini hanya menunda oksigen dan rujukan yang menjadi inti tata laksana.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Pneumotoraks dapat berkembang menjadi tension pneumotoraks yang mengancam nyawa bila stabilisasi dan rujukan tertunda.',
      kembaliHariMin: 1, kembaliHariMax: 1,
      kondisiKembali: 'Sesak memberat cepat, bibir kebiruan, dan tekanan darah turun.',
    },
    variasiPembuka: {
      cemas: 'Dada kanan mendadak sakit tajam dan napas jadi pendek — apa paru saya bocor, Dok?',
      polos: 'Lagi duduk tiba-tiba dada kanan sakit tajam terus napas jadi pendek, Dok.',
      lansia: 'Tiba-tiba dada kanan saya nyeri tajam dan napas terasa pendek, Dok.',
    },
  },
  lab_abses_peritonsil: {
    distraktor: [
      { id: 'q_dist_mononukleosis', kategori: 'rps', tanya: 'Apakah ada kelenjar bengkak di seluruh leher dan ketiak disertai rasa lelah luar biasa berminggu-minggu?', jawab: 'Tidak, Dok. Baru tiga hari dan hanya sebelah kiri leher yang sakit.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Memperlakukan abses ini seperti tonsilitis biasa meninggalkan flora anaerob mulut penghasil beta-laktamase tanpa cakupan, sementara nanahnya tetap perlu drainase terkontrol.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Abses peritonsil dapat mengancam jalan napas dan menyebar ke ruang leher dalam bila drainase/antibiotik dan rujukan ditunda.',
      kembaliHariMin: 1, kembaliHariMax: 2,
      kondisiKembali: 'Makin sulit membuka mulut dan menelan, air liur menetes, dan mulai sesak.',
    },
    variasiPembuka: {
      cemas: 'Tenggorokan kiri saya sakit sekali, suara berubah, mulut susah dibuka — apa ini akan menyumbat napas saya, Dok?',
      polos: 'Tenggorokan kiri sakit banget, suara berubah, mulut susah dibuka, Dok.',
      lansia: 'Tenggorokan kiri saya sangat sakit, suara berubah, dan mulut sulit dibuka, Dok.',
    },
  },
  lab_perdarahan_gi_atas: {
    distraktor: [
      { id: 'q_dist_tinja_hitam_palsu', kategori: 'rpd', tanya: 'Apakah sedang minum tablet tambah darah atau obat maag yang bisa membuat tinja menghitam?', jawab: 'Tidak, Dok. Saya tidak minum tablet tambah darah atau obat maag apa pun.' },
    ],
    konsekuensi: {
      narasi: 'Perdarahan saluran cerna atas dapat berlanjut ke syok hipovolemik; menunda resusitasi dan rujukan berbahaya, dan NSAID memperberat perdarahan.',
      kembaliHariMin: 1, kembaliHariMax: 1,
      kondisiKembali: 'Muntah darah berulang, lemas hebat, dan tekanan darah turun.',
    },
    variasiPembuka: {
      cemas: 'Saya muntah darah hitam dan BAB hitam pekat — apa saya kehabisan darah, Dok?',
      polos: 'Saya muntah darah warnanya hitam, terus BAB juga hitam pekat dari kemarin, Dok.',
      lansia: 'Saya muntah darah kehitaman dan sejak kemarin BAB saya hitam pekat, Dok.',
    },
  },
  lab_ileus_obstruktif: {
    distraktor: [
      { id: 'q_dist_sembelit_serat', kategori: 'sosial', tanya: 'Apakah selama ini memang sering sembelit karena kurang makan sayur dan serat?', jawab: 'Tidak, Dok. BAB saya biasa saja sebelum ini, baru sejak kemarin sama sekali tidak bisa.' },
    ],
    konsekuensi: {
      narasi: 'Obstruksi usus dapat berujung strangulasi dan perforasi; laksatif/antimotilitas keliru dan penundaan rujukan memperburuk.',
      kembaliHariMin: 1, kembaliHariMax: 1,
      kondisiKembali: 'Perut makin kembung tegang, nyeri hebat, dan muntah menetap.',
    },
    variasiPembuka: {
      cemas: 'Perut saya makin kembung, muntah, tak bisa BAB atau kentut sejak kemarin — apa usus saya tersumbat, Dok?',
      polos: 'Perut kembung banget, muntah, dari kemarin nggak bisa BAB sama nggak bisa kentut, Dok.',
      lansia: 'Perut saya makin kembung, muntah, dan sejak kemarin tak bisa BAB atau buang angin, Dok.',
    },
  },
}
