import type { LabEnrichmentSpec } from './enrichment'

/**
 * Pengayaan interaktif untuk kasus batch 3 (39 kasus). Ditulis 2026-07-16.
 * Kunci = id kasus di batch3.ts. Distraktor gender-netral. Jebakan resep
 * kulit menekankan pola klasik: steroid pada tinea (tinea incognito),
 * antibiotik pada lesi virus/non-infeksi. Lihat enrichment.ts untuk merge.
 *
 * Audit CODEX 2026-07-16 #1: distraktor generik lintas kategori (dulu bertumpu
 * pada gejala polidipsia-poliuria dan keluhan kardiorespirasi yang ditempel
 * massal ke kasus kulit) dibasmi — 39 entri ditulis ulang menjadi
 * DIFFERENTIAL-DRIVEN per kasus. Aturannya: distraktor harus
 * MASUK AKAL diucapkan dokter pada kasus ini (mengejar satu diagnosis banding
 * yang sudah disingkirkan temuan lain, atau mitos klinis lazim), tetapi TIDAK
 * mengubah keputusan. Batch 3 padat kasus kulit yang saling mirip, jadi banding
 * terdekatnya justru sesama kulit (mis. numularis mengejar skabies, eritrasma
 * mengejar tinea kruris, tinea unguium mengejar psoriasis kuku). Hukuman
 * kesabaran jadi jatuh pada penembak asal, bukan pada penalar.
 */
export const LAB_ENRICHMENT_3: Record<string, LabEnrichmentSpec> = {
  lab_ulkus_tungkai_vena: {
    distraktor: [
      { id: 'q_dist_kebas_telapak', kategori: 'rps', tanya: 'Apakah telapak kaki Anda kebas atau seperti ditusuk jarum sampai luka tidak terasa?', jawab: 'Tidak, telapak kaki saya masih terasa biasa dan lukanya justru nyeri.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Ulkus vena tanpa tanda infeksi tidak butuh antibiotik sistemik rutin; utamakan perawatan luka, elevasi, dan kompresi.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa perawatan luka, elevasi, dan kontrol faktor vaskular, ulkus meluas dan berisiko infeksi.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Luka makin luas, tepi lembek, dan mulai berbau.',
    },
    variasiPembuka: {
      cemas: 'Luka di atas mata kaki saya lama tak menutup — apa kaki saya bisa diamputasi, Dok?',
      polos: 'Luka di atas mata kaki udah lama nggak sembuh-sembuh, Dok.',
      lansia: 'Luka di atas mata kaki saya ini sudah lama tidak kunjung menutup, Dok.',
    },
  },
  lab_lipoma_lengan: {
    distraktor: [
      { id: 'q_dist_benjolan_keluarga', kategori: 'rpk', tanya: 'Apakah ada keluarga yang badannya juga tumbuh banyak benjolan lemak seperti ini?', jawab: 'Tidak ada, di keluarga saya cuma saya yang begini.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Lipoma adalah tumor jinak lemak, bukan infeksi; antibiotik tak berperan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Umumnya jinak; namun tanpa observasi, pertumbuhan cepat/nyeri/keras yang menandakan sesuatu lain bisa terlewat.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Benjolan membesar lebih cepat dan mulai terasa nyeri.',
    },
    variasiPembuka: {
      cemas: 'Ada benjolan lunak di lengan yang perlahan membesar — apa ini kanker, Dok?',
      polos: 'Di lengan ada benjolan lunak yang pelan-pelan makin gede, Dok.',
      lansia: 'Ada benjolan lunak di lengan saya yang perlahan membesar, Dok.',
    },
  },
  lab_moluskum_kontagiosum_anak: {
    distraktor: [
      { id: 'q_dist_cacar_air', kategori: 'rps', tanya: 'Apakah bintilnya berisi air dan muncul serentak setelah anak demam, seperti cacar air?', jawab: 'Tidak, anak saya tidak demam dan bintilnya padat, bukan berisi air.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Moluskum adalah infeksi virus swasirna; antibiotik tidak berperan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Umumnya swasirna; tanpa edukasi (jangan digaruk, hindari berbagi handuk), lesi menyebar dan menular ke anak lain.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Bintil bertambah banyak dan menyebar ke area lain.',
    },
    variasiPembuka: {
      cemas: 'Anak saya ada bintil mengilap di lengan dan badan — apa ini menular ke seluruh tubuh, Dok?',
      polos: 'Anak saya ada bintil-bintil kecil mengkilat di lengan sama badan, Dok.',
      wali_anak: 'Anak saya muncul bintil kecil mengilap di lengan dan badannya, Dok.',
    },
  },
  lab_herpes_simpleks_labialis: {
    distraktor: [
      { id: 'q_dist_sariawan_mulut', kategori: 'rps', tanya: 'Apakah sariawan seperti ini juga sering muncul di dalam mulut, lidah, atau gusi?', jawab: 'Tidak, di dalam mulut saya bersih; cuma di tepi bibir.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Herpes labialis adalah infeksi virus; antibiotik tidak mengobatinya.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Umumnya swasirna; tanpa antiviral dini pada kasus berat/sering dan edukasi, lesi lebih lama dan menular.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Lenting pecah menjadi luka nyeri dan kembali kambuh.',
    },
    variasiPembuka: {
      cemas: 'Bibir kesemutan lalu muncul lenting bergerombol — apa ini penyakit menular seksual, Dok?',
      polos: 'Bibir saya kesemutan terus muncul lenting-lenting kecil bergerombol, Dok.',
      lansia: 'Bibir saya kesemutan lalu muncul lenting bergerombol, Dok.',
    },
  },
  lab_ektima_tungkai: {
    distraktor: [
      { id: 'q_dist_gigitan_awal', kategori: 'rps', tanya: 'Apakah koreng ini bermula dari gigitan serangga atau bentol yang digaruk?', jawab: 'Setahu saya bukan; awalnya cuma lecet biasa lalu jadi koreng.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Ektima adalah infeksi bakteri berkrusta; steroid topikal menekan imun lokal dan memperberat.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antibiotik dan perawatan luka, ektima meluas, dalam, dan berisiko komplikasi (mis. glomerulonefritis pascastreptokokus).',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Koreng makin dalam dan luka bertambah di tungkai.',
    },
    variasiPembuka: {
      cemas: 'Koreng tebal di tungkai anak jadi luka cekung dan nyeri — apa ini akan menyebar, Dok?',
      polos: 'Koreng di tungkai anak makin tebal jadi luka cekung, nyeri, Dok.',
      wali_anak: 'Koreng di tungkai anak saya menjadi luka cekung yang nyeri, Dok.',
    },
  },
  lab_folikulitis_superfisialis: {
    distraktor: [
      { id: 'q_dist_rambut_tumbuh_dalam', kategori: 'rps', tanya: 'Apakah ada rambut yang tumbuh melengkung masuk kembali ke dalam kulit di bintil itu?', jawab: 'Tidak, rambutnya tumbuh lurus keluar seperti biasa.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Folikulitis bakteri tidak diobati steroid; steroid dapat memperberat infeksi folikel.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Tanpa higiene dan menghindari iritasi cukur, folikulitis kambuh dan bisa membentuk furunkel.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Bintil bernanah bertambah dan sebagian membesar jadi bisul.',
    },
    variasiPembuka: {
      cemas: 'Muncul bintil bernanah di sekitar rambut paha setelah bercukur — apa ini infeksi berbahaya, Dok?',
      polos: 'Abis nyukur, muncul bintil-bintil bernanah kecil di paha, Dok.',
      lansia: 'Setelah mencukur, muncul bintil bernanah kecil di sekitar rambut paha saya, Dok.',
    },
  },
  lab_furunkel_fluktuatif: {
    distraktor: [
      { id: 'q_dist_benjolan_lama', kategori: 'rpd', tanya: 'Apakah di tempat itu sudah ada benjolan kecil yang menetap bertahun-tahun sebelum meradang?', jawab: 'Tidak, sebelumnya kulit di situ biasa saja.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Furunkel matang perlu insisi-drainase; steroid topikal justru memperberat infeksi.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Furunkel fluktuatif perlu drainase; antibiotik saja tanpa drainase sering gagal dan meluas.',
      kembaliHariMin: 2, kembaliHariMax: 4,
      kondisiKembali: 'Benjolan makin nyeri berdenyut dan kulit sekitarnya merah meluas.',
    },
    variasiPembuka: {
      cemas: 'Benjolan di paha berdenyut dan sekarang lunak di tengah — apa nanahnya masuk ke darah, Dok?',
      polos: 'Benjolan di paha berdenyut, sekarang tengahnya udah lunak, Dok.',
      lansia: 'Benjolan di paha saya berdenyut dan kini terasa lunak di tengah, Dok.',
    },
  },
  lab_eritrasma_lipat_paha: {
    distraktor: [
      { id: 'q_dist_tular_serumah', kategori: 'sosial', tanya: 'Apakah ada anggota serumah yang ikut tertular bercak serupa di lipat pahanya?', jawab: 'Tidak ada, cuma saya sendiri yang kena.' },
    ],
    obatSalahUmum: [
      // Audit UKM 2026-08-23: alasan lama overclaim — azol topikal justru
      // punya aktivitas antibakteri nyata thd C. minutissimum (bukan tanpa
      // efek sama sekali). Yang salah bukan mekanismenya, tapi mengulang
      // golongan yang sudah gagal empiris.
      { id: 'ketokonazol_krim', alasan: 'Pasien sudah mencoba antijamur seminggu tanpa perbaikan dan KOH negatif — mengulang golongan yang sudah gagal empiris bukan langkah rasional, terlepas dari aktivitas antibakteri lemah azol terhadap Corynebacterium.', bahaya: 'nonPrimer' },
      { id: 'betametason_krim', alasan: 'Steroid poten di kulit lipatan yang tipis dan lembap mempercepat atrofi serta striae, sementara bakterinya tidak tersentuh.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Tanpa terapi tepat dan menjaga area kering, bercak menetap dan mudah kambuh, terutama pada diabetes/lembap.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Bercak cokelat di lipat paha masih ada dan sedikit meluas.',
    },
    variasiPembuka: {
      cemas: 'Lipat paha saya ada bercak cokelat tipis dan sedikit gatal — apa ini jamur menular, Dok?',
      polos: 'Di lipat paha ada bercak cokelat tipis, agak gatal, Dok.',
      lansia: 'Lipat paha saya ada bercak cokelat tipis yang sedikit gatal, Dok.',
    },
  },
  lab_erisipelas_tungkai_ringan: {
    distraktor: [
      { id: 'q_dist_duduk_lama', kategori: 'sosial', tanya: 'Apakah belakangan Anda berbaring lama atau naik kendaraan berjam-jam tanpa bergerak?', jawab: 'Tidak, saya beraktivitas seperti biasa setiap hari.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Erisipelas adalah infeksi bakteri; steroid topikal menekan imun dan memperberat, bukan menyembuhkan.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antibiotik adekuat, erisipelas meluas dan bisa berkembang ke selulitis dalam/sepsis.',
      kembaliHariMin: 2, kembaliHariMax: 4,
      kondisiKembali: 'Kemerahan meluas, makin nyeri, dan disertai demam.',
    },
    variasiPembuka: {
      cemas: 'Tungkai bawah merah, hangat, dan nyeri sejak kemarin — apa infeksinya menyebar ke darah, Dok?',
      polos: 'Tungkai bawah merah, anget, nyeri dari kemarin, Dok.',
      lansia: 'Tungkai bawah saya merah, hangat, dan nyeri sejak kemarin, Dok.',
    },
  },
  lab_skrofuloderma_suspek: {
    distraktor: [
      { id: 'q_dist_cakaran_kucing', kategori: 'sosial', tanya: 'Apakah Anda sering tercakar atau terjilat kucing sebelum benjolan leher ini muncul?', jawab: 'Tidak, di rumah kami tidak memelihara kucing.' },
    ],
    obatSalahUmum: [
      { id: 'amoxiclav_625', alasan: 'Antibiotik biasa sudah gagal dan hanya memoles gejala sesaat, sehingga konfirmasi TB serta rujukan terkoordinasi program justru tertunda.', bahaya: 'nonPrimer' },
      { id: 'dexamethasone_05', alasan: 'Steroid mengempiskan benjolan sehingga tampak membaik, padahal menekan imun pada infeksi TB aktif dan mengaburkan diagnosis.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Bila rujukan spesimen dan program tidak ditutup, luka dapat meluas, TB paru yang menyertai dapat terlewat, dan kontak serumah tidak pernah masuk skrining.',
      kembaliHariMin: 14, kembaliHariMax: 30,
      kondisiKembali: 'Luka leher makin luas dan muncul nodus baru; paman serumah tetap menjadi satu-satunya anggota keluarga yang pernah tercatat di program TB.',
    },
    variasiPembuka: {
      cemas: 'Benjolan leher saya pecah jadi luka berair yang tak sembuh — apa ini kanker atau TB, Dok?',
      polos: 'Benjolan di leher pecah jadi luka berair, nggak sembuh-sembuh, Dok.',
      lansia: 'Benjolan di leher saya pecah menjadi luka berair yang tidak kunjung sembuh, Dok.',
    },
  },
  lab_kusta_pausibasiler: {
    distraktor: [
      { id: 'q_dist_panu_keringat', kategori: 'rps', tanya: 'Apakah bercaknya jadi lebih jelas dan gatal setiap kali Anda berkeringat, seperti panu?', jawab: 'Tidak, berkeringat tidak mengubah apa-apa dan bercaknya sama sekali tidak gatal.' },
    ],
    obatSalahUmum: [
      { id: 'ketokonazol_krim', alasan: 'Bercak pucat sering dikira panu, tetapi hilangnya rasa pada lesi adalah tanda kardinal kusta yang tidak akan membaik dengan antijamur.', bahaya: 'nonPrimer' },
      { id: 'hidrokortison_krim', alasan: 'Mengobatinya sebagai dermatitis hanya menyamarkan bercak sambil menunda registrasi program dan MDT, sementara kerusakan saraf berjalan diam-diam.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Kusta yang tidak diobati dapat perlahan merusak saraf dan tetap menjadi sumber transmisi pada kontak dekat berkepanjangan; proses ini bukan perubahan dramatis dalam hitungan hari.',
      kembaliHariMin: 60, kembaliHariMax: 120,
      kondisiKembali: 'Belum masuk program; muncul luka bakar kecil pada area mati rasa karena perlindungan tangan-kaki dan pemeriksaan saraf serial tidak pernah diajarkan.',
    },
    variasiPembuka: {
      cemas: 'Ada dua bercak pucat mati rasa di lengan saya — apa ini kusta yang bikin cacat, Dok?',
      polos: 'Di lengan ada dua bercak pucat yang kalau dipegang nggak berasa, Dok.',
      lansia: 'Ada dua bercak pucat yang mati rasa di lengan saya, Dok.',
    },
  },
  lab_sifilis_primer: {
    distraktor: [
      { id: 'q_dist_lenting_dulu', kategori: 'rps', tanya: 'Apakah sebelum luka ini muncul ada lenting kecil bergerombol yang terasa perih?', jawab: 'Tidak, langsung ada satu luka saja dan tidak terasa perih sama sekali.' },
    ],
    obatSalahUmum: [
      { id: 'azitromisin_500', alasan: 'Pasien menyangkal alergi penisilin, sehingga tidak ada alasan menukar suntikan sekali beri dengan makrolida yang resistensinya sudah terdokumentasi luas.', bahaya: 'nonPrimer' },
      { id: 'ciprofloxacin_500', alasan: 'Kuinolon menyasar ulkus genital lain seperti chancroid, bukan Treponema, padahal serologi sudah memastikan sifilis.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Chancre dapat sembuh sendiri walau infeksi menetap dan kemudian masuk tahap sekunder atau laten; hilangnya luka bukan bukti sembuh, dan pasangan tetap memerlukan layanan yang aman.',
      kembaliHariMin: 21, kembaliHariMax: 60,
      kondisiKembali: 'Luka sudah menghilang sehingga pasien mengira sembuh, tetapi muncul ruam telapak dan pasangan belum pernah ditawari pemeriksaan secara rahasia.',
    },
    variasiPembuka: {
      cemas: 'Ada luka di kelamin yang tidak sakit — kenapa tidak nyeri ya Dok, apa ini bahaya?',
      polos: 'Di alat kelamin ada luka tapi anehnya nggak sakit, Dok.',
      lansia: 'Ada luka di alat kelamin saya yang tidak terasa sakit, Dok.',
    },
  },
  lab_tinea_kapitis_anak: {
    distraktor: [
      { id: 'q_dist_tarik_rambut', kategori: 'sosial', tanya: 'Apakah anak punya kebiasaan menarik atau memilin rambutnya sendiri saat mengantuk?', jawab: 'Tidak pernah saya lihat dia begitu.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Tinea kapitis perlu antijamur sistemik; steroid topikal menyamarkan lesi (tinea incognito) dan tak menyembuhkan.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antijamur sistemik, kerontokan meluas dan bisa timbul kerion serta jaringan parut permanen.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Area botak melebar dan kulit kepala makin bersisik meradang.',
    },
    variasiPembuka: {
      cemas: 'Rambut anak patah-patah dan kulit kepala bersisik melingkar — apa rambutnya tak akan tumbuh lagi, Dok?',
      polos: 'Rambut anak saya patah-patah, kulit kepalanya bersisik bulat, Dok.',
      wali_anak: 'Rambut anak saya patah-patah dan kulit kepalanya bersisik membentuk lingkaran, Dok.',
    },
  },
  lab_tinea_barbae: {
    distraktor: [
      { id: 'q_dist_sisik_kepala', kategori: 'rps', tanya: 'Apakah kulit kepala dan alis Anda juga bersisik berminyak seperti ketombe?', jawab: 'Tidak, kulit kepala saya bersih; cuma daerah jenggot yang bermasalah.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Steroid pada tinea menimbulkan tinea incognito — lesi menyebar dan sulit dikenali.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antijamur yang sesuai, lesi jenggot meluas dan rambut makin mudah tercabut.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Bercak jenggot meluas dan makin gatal.',
    },
    variasiPembuka: {
      cemas: 'Daerah jenggot bersisik, gatal, dan rambut mudah tercabut — apa ini menular ke wajah, Dok?',
      polos: 'Daerah jenggot bersisik dan gatal, rambutnya gampang copot, Dok.',
      lansia: 'Daerah jenggot saya bersisik, gatal, dan rambutnya mudah tercabut, Dok.',
    },
  },
  lab_tinea_fasialis: {
    distraktor: [
      { id: 'q_dist_kena_matahari', kategori: 'rps', tanya: 'Apakah bercak di pipi ini makin merah dan perih setiap kali terkena sinar matahari?', jawab: 'Tidak, kena matahari tidak mengubah apa-apa.' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antijamur yang tepat (dan bila keliru diberi steroid), bercak wajah meluas dan sulit dikenali.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Bercak bersisik di pipi meluas dan makin gatal.',
    },
    variasiPembuka: {
      cemas: 'Kulit pipi gatal dan bercaknya melebar — apa ini penyakit kulit menahun, Dok?',
      polos: 'Pipi saya gatal, ada bercak bersisik yang melebar, Dok.',
      lansia: 'Kulit pipi saya gatal dan membentuk bercak bersisik yang melebar, Dok.',
    },
  },
  lab_tinea_manus: {
    distraktor: [
      { id: 'q_dist_sarung_tangan_karet', kategori: 'sosial', tanya: 'Apakah keluhan ini mulai setelah Anda memakai sarung tangan karet?', jawab: 'Tidak, saya hampir tidak pernah pakai sarung tangan.' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antijamur dan menjaga tangan kering, bercak meluas dan bisa menular ke kaki/kuku.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Bercak telapak tangan meluas dan mulai pecah-pecah.',
    },
    variasiPembuka: {
      cemas: 'Telapak tangan gatal dan bercaknya melebar — apa ini menular ke keluarga, Dok?',
      polos: 'Telapak tangan gatal, ada bercak bersisik yang melebar, Dok.',
      lansia: 'Kulit telapak tangan saya gatal dan membentuk bercak bersisik yang melebar, Dok.',
    },
  },
  lab_tinea_kruris: {
    distraktor: [
      { id: 'q_dist_keluhan_kelamin', kategori: 'rps', tanya: 'Apakah ada luka atau cairan yang keluar dari alat kelamin Anda?', jawab: 'Tidak ada; yang bermasalah cuma bercak gatal di lipatannya.' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antijamur dan menjaga lipat paha kering, bercak meluas, gatal berat, dan kambuh.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Bercak lipat paha meluas dan makin gatal terutama saat berkeringat.',
    },
    variasiPembuka: {
      cemas: 'Lipat paha gatal dengan bercak yang melebar — apa ini penyakit kelamin, Dok?',
      polos: 'Lipat paha gatal banget, ada bercak bersisik yang melebar, Dok.',
      lansia: 'Kulit lipat paha saya gatal dan membentuk bercak bersisik yang melebar, Dok.',
    },
  },
  lab_tinea_pedis: {
    distraktor: [
      { id: 'q_dist_bahan_kimia_kaki', kategori: 'sosial', tanya: 'Apakah sela jari kaki ini pernah tersiram bahan kimia atau cairan pembersih di tempat kerja?', jawab: 'Tidak pernah; pekerjaan saya tidak berhubungan dengan bahan seperti itu.' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antijamur dan menjaga kaki kering, sela jari pecah dan menjadi pintu masuk infeksi bakteri (selulitis).',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Sela jari kaki makin pecah, basah, dan mulai nyeri.',
    },
    variasiPembuka: {
      cemas: 'Sela jari kaki gatal dan bercaknya melebar — apa ini bisa bikin kaki busuk, Dok?',
      polos: 'Sela jari kaki gatel, ada bercak bersisik yang melebar, Dok.',
      lansia: 'Kulit sela jari kaki saya gatal dan membentuk bercak bersisik yang melebar, Dok.',
    },
  },
  lab_tinea_unguium_terkonfirmasi: {
    distraktor: [
      { id: 'q_dist_bercak_siku_lutut', kategori: 'rps', tanya: 'Apakah ada bercak tebal bersisik di siku atau lutut Anda, atau kuku Anda berlubang kecil seperti bekas jarum?', jawab: 'Tidak ada; kulit siku dan lutut saya biasa saja.' },
    ],
    // Verifikasi adversarial 2026-07-16: entri ini DULU berisi griseofulvin_500
    // — padahal itu justru `obatBenar` kasus ini. Efeknya inversi pedagogis:
    // meresepkan kunci jawaban kena -15 skorTerapi (clinic.ts, tier nonPrimer).
    // `alasan`-nya pun mengakui sendiri "Bukan salah sasaran". Pelajaran yang
    // dimaksud (jangan terapi sistemik sebelum konfirmasi) SUDAH ditegakkan
    // `konfirmasiWajib: 'mikroskopis_gram_koh'` lewat capGrade, jadi entri itu
    // redundan sekaligus merugikan. Bandingkan preseden audit CODEX 2026-07-04
    // di kasusInfeksi.ts (amoxicillin_500 pada tifoid). Diganti jebakan yang
    // benar-benar salah: krim topikal untuk kuku.
    obatSalahUmum: [
      { id: 'mikonazol_krim', alasan: 'Krim antijamur tidak menembus lempeng kuku; onikomikosis terkonfirmasi perlu antijamur SISTEMIK berdurasi panjang (griseofulvin), bukan topikal saja. Topikal hanya melengkapi terapi tinea pedis penyertanya.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa terapi jangka panjang setelah konfirmasi, kuku makin rusak dan menjadi sumber infeksi berulang.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Kuku makin menebal, rapuh, dan kuku lain mulai terkena.',
    },
    variasiPembuka: {
      cemas: 'Kuku jempol kaki menebal, rapuh, dan menguning — apa kuku saya harus dicabut, Dok?',
      polos: 'Kuku jempol kaki saya menebal, gampang rapuh, warnanya kuning, Dok.',
      lansia: 'Kuku jempol kaki saya menebal, rapuh, dan berubah kuning, Dok.',
    },
  },
  lab_pitiriasis_versikolor: {
    distraktor: [
      { id: 'q_dist_putih_lain', kategori: 'rps', tanya: 'Apakah ada bagian kulit lain yang berubah putih bersih tanpa sisik, misalnya di sekitar mata atau jari tangan?', jawab: 'Tidak ada; cuma belang di punggung saja.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Steroid meredakan gatal dan merah sesaat sehingga terasa manjur, padahal menekan imun lokal dan membuat jamur justru meluas.', bahaya: 'kontraindikasi' },
      { id: 'griseofulvin_500', alasan: 'Griseofulvin tidak bekerja pada Malassezia, jadi terapi oral ini menanggung efek samping sistemik tanpa membersihkan lesi.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa antijamur dan perawatan, bercak meluas dan sering kambuh; perbedaan warna kulit bisa menetap sementara.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Bercak belang di punggung meluas terutama saat berkeringat.',
    },
    variasiPembuka: {
      cemas: 'Punggung saya belang terang dengan sisik halus — apa ini penyakit kulit menular seumur hidup, Dok?',
      polos: 'Punggung belang-belang terang, kalau digaruk ada sisik halus, Dok.',
      lansia: 'Punggung saya belang terang dengan sisik yang sangat halus, Dok.',
    },
  },
  lab_cutaneous_larva_migrans: {
    distraktor: [
      { id: 'q_dist_getah_tanaman', kategori: 'sosial', tanya: 'Apakah kaki Anda sempat menyentuh tanaman atau getah tertentu saat di pantai itu?', jawab: 'Tidak, saya cuma berjalan di pasir.' },
    ],
    obatSalahUmum: [
      { id: 'permetrin_losion_1', alasan: 'Gatal hebat mudah dikira skabies, tetapi terowongan yang maju beberapa sentimeter sehari adalah larva cacing yang tak dijangkau skabisida.', bahaya: 'nonPrimer' },
      { id: 'hidrokortison_krim', alasan: 'Steroid hanya menumpulkan gatal sementara larvanya terus bermigrasi, sehingga terapi definitif tertunda.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Umumnya swasirna lambat; tanpa terapi, gatal hebat berlanjut dan garukan berisiko infeksi sekunder.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Garis merah makin panjang dan gatal sampai mengganggu tidur.',
    },
    variasiPembuka: {
      cemas: 'Ada garis merah berkelok di kaki yang maju tiap hari dan sangat gatal — apa cacingnya masuk ke dalam tubuh, Dok?',
      polos: 'Di kaki ada garis merah berkelok yang jalan tiap hari, gatel banget, Dok.',
      lansia: 'Di kaki saya ada garis merah berkelok yang maju setiap hari dan sangat gatal, Dok.',
    },
  },
  lab_filariasis_terkonfirmasi: {
    distraktor: [
      { id: 'q_dist_bengkak_wajah', kategori: 'rps', tanya: 'Apakah kedua tungkai ikut bengkak dan wajah Anda sembap saat bangun tidur?', jawab: 'Tidak, cuma satu tungkai yang bengkak dan muka saya biasa saja.' },
    ],
    obatSalahUmum: [
      { id: 'furosemid_40', alasan: 'Bengkak ini limfedema akibat saluran limfe yang rusak, bukan kelebihan cairan, sehingga diuretik tidak mengempiskannya dan berisiko dehidrasi.', bahaya: 'nonPrimer' },
      { id: 'prazikuantel_600', alasan: 'Prazikuantel menyasar cacing pipih, sedangkan mikrofilaria yang ditemukan adalah cacing benang dengan regimen program tersendiri.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa terapi program, MMDP, dan penutupan fokus, serangan adenolimfangitis serta kerusakan kulit dapat berulang; progresi limfedema terjadi dalam bulan-tahun, bukan pasti dalam dua minggu.',
      kembaliHariMin: 30, kembaliHariMax: 90,
      kondisiKembali: 'Tungkai kembali meradang setelah lecet sela jari dan aktivitas terganggu; program belum menerima data fokus untuk menilai kontak dan transmisi wilayah.',
    },
    variasiPembuka: {
      cemas: 'Tungkai saya beberapa kali bengkak dan demam setelah tinggal di daerah endemis — apa kaki saya akan membesar permanen, Dok?',
      polos: 'Tungkai saya suka bengkak sama demam, Dok, di kampung banyak yang gitu.',
      lansia: 'Tungkai saya beberapa kali bengkak disertai demam sejak tinggal di daerah endemis, Dok.',
    },
  },
  lab_pedikulosis_pubis: {
    distraktor: [
      { id: 'q_dist_bercak_melebar', kategori: 'rps', tanya: 'Apakah gatalnya disertai bercak merah bersisik yang melebar ke lipat paha?', jawab: 'Tidak, kulitnya cuma lecet bekas garukan; tidak ada bercak yang melebar.' },
    ],
    obatSalahUmum: [
      { id: 'ketokonazol_krim', alasan: 'Gatal selangkangan refleks dikira jamur, padahal kutu dan telurnya sudah terlihat menempel pada rambut.', bahaya: 'nonPrimer' },
      { id: 'hidrokortison_krim', alasan: 'Meredakan gatal tanpa membunuh kutu membuat infestasi bertahan dan penularan ke pasangan terus berjalan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa terapi, edukasi, dan pengobatan pasangan, gatal berlanjut dan infestasi menular berulang.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Gatal masih hebat dan pasangan mulai mengeluh gatal serupa.',
    },
    variasiPembuka: {
      cemas: 'Daerah kemaluan sangat gatal dan ada kutu kecil — apa ini penyakit menular yang memalukan, Dok?',
      polos: 'Daerah kemaluan gatel banget, keliatan ada kutu kecil, Dok.',
      lansia: 'Daerah kemaluan saya sangat gatal dan saya melihat kutu kecil, Dok.',
    },
  },
  lab_reaksi_gigitan_serangga: {
    distraktor: [
      { id: 'q_dist_bentol_pindah', kategori: 'rps', tanya: 'Apakah bentolnya berpindah-pindah tempat dan hilang sendiri dalam hitungan jam?', jawab: 'Tidak, bentolnya tetap di tempat yang sama sejak kemarin.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Reaksi gigitan serangga bukan infeksi bakteri; antibiotik tak diperlukan kecuali ada infeksi sekunder jelas.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Umumnya ringan; namun garukan berisiko infeksi sekunder, dan reaksi luas perlu dipantau.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Bekas gigitan digaruk menjadi luka bernanah.',
    },
    variasiPembuka: {
      cemas: 'Lengan saya bentol gatal setelah berkebun — apa saya alergi berat atau digigit serangga berbisa, Dok?',
      polos: 'Abis berkebun, lengan bentol-bentol gatel, Dok.',
      lansia: 'Lengan saya bentol dan gatal setelah berkebun, Dok.',
    },
  },
  lab_dermatitis_kontak_iritan_tangan: {
    distraktor: [
      { id: 'q_dist_kuku_menebal', kategori: 'rps', tanya: 'Apakah hanya satu tangan yang kena dan kuku Anda ikut menebal serta menguning?', jawab: 'Tidak, dua-duanya kena dan kuku saya biasa saja.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Dermatitis iritan bukan infeksi; antibiotik tak berperan tanpa tanda infeksi sekunder.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa menghindari iritan (deterjen) dan melembapkan, kulit tangan makin pecah, perih, dan bisa infeksi.',
      kembaliHariMin: 5, kembaliHariMax: 10,
      kondisiKembali: 'Kedua tangan makin kering, pecah-pecah, dan perih.',
    },
    variasiPembuka: {
      cemas: 'Kedua tangan merah, kering, perih setelah sering pakai deterjen — apa kulit saya rusak permanen, Dok?',
      polos: 'Tangan saya merah, kering, perih, Dok, gara-gara sering kena deterjen.',
      lansia: 'Kedua tangan saya merah, kering, dan perih setelah sering memakai deterjen, Dok.',
    },
  },
  lab_dermatitis_atopik_ringan: {
    distraktor: [
      { id: 'q_dist_cacingan', kategori: 'rps', tanya: 'Apakah gatalnya juga terasa di sekitar dubur pada malam hari, seperti orang cacingan?', jawab: 'Tidak, gatalnya cuma di lipatan siku dan lutut.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Penyakit ringan di kulit lipatan yang tipis dan dipakai berulang seumur hidup tidak sebanding dengan risiko atrofi dan striae dari steroid poten.', bahaya: 'kontraindikasi' },
      { id: 'amoxicillin_500', alasan: 'Tidak ada nanah, kerak madu, atau demam; antibiotik sistemik tanpa infeksi sekunder hanya menambah risiko efek samping dan resistensi.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa pelembap rutin dan menghindari pencetus, siklus gatal-garuk berlanjut, kulit menebal, dan berisiko infeksi.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Lipatan siku-lutut makin gatal, menebal, dan sebagian lecet.',
    },
    variasiPembuka: {
      cemas: 'Lipatan siku dan lutut gatal berulang sejak kecil — apa penyakit kulit saya tak bisa sembuh, Dok?',
      polos: 'Lipatan siku sama lutut gatel kambuhan dari kecil, Dok.',
      lansia: 'Lipatan siku dan lutut saya gatal berulang sejak kecil, Dok.',
    },
  },
  lab_dermatitis_numularis: {
    distraktor: [
      { id: 'q_dist_gatal_malam_serumah', kategori: 'sosial', tanya: 'Apakah gatalnya paling hebat pada malam hari dan ada anggota serumah yang gatal serupa?', jawab: 'Gatalnya siang malam sama saja, dan tidak ada orang serumah yang gatal.' },
    ],
    obatSalahUmum: [
      { id: 'ketokonazol_krim', alasan: 'Bentuk bulat saja bukan tanda jamur: tepinya tidak aktif, tengahnya tidak menyembuh, dan KOH negatif.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa pelembap dan steroid topikal yang tepat, bercak koin makin gatal, meluas, dan bisa infeksi sekunder.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Bercak bulat makin banyak dan gatal mengganggu tidur.',
    },
    variasiPembuka: {
      cemas: 'Ada bercak bulat seperti koin yang sangat gatal di tungkai — apa ini menular ke seluruh badan, Dok?',
      polos: 'Di tungkai ada bercak bulat kayak koin, gatel banget, Dok.',
      lansia: 'Ada bercak bulat seperti koin yang sangat gatal di tungkai saya, Dok.',
    },
  },
  lab_dermatitis_popok_iritan: {
    distraktor: [
      { id: 'q_dist_ganti_merek_popok', kategori: 'sosial', tanya: 'Apakah ruamnya muncul setelah Anda berganti merek popok?', jawab: 'Tidak, mereknya masih sama sejak dia lahir.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Steroid poten pada area popok bayi berisiko atrofi/absorpsi; utamakan popok kering dan pelindung sawar.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Tanpa menjaga area kering dan pelindung sawar, ruam meluas dan berisiko infeksi jamur/bakteri sekunder.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Kulit area popok makin merah, ada bintil satelit (infeksi jamur).',
    },
    variasiPembuka: {
      cemas: 'Kulit bayi merah di area popok sejak diare — apa kulitnya akan luka parah, Dok?',
      polos: 'Kulit bayi merah di area popok, Dok, sejak dia diare ringan.',
      wali_anak: 'Kulit bayi saya kemerahan di area popok sejak diare ringan, Dok.',
    },
  },
  lab_dermatitis_seboroik_dewasa: {
    distraktor: [
      { id: 'q_dist_jarang_keramas', kategori: 'sosial', tanya: 'Apakah keluhan ini muncul karena Anda jarang keramas atau baru berganti sampo?', jawab: 'Saya keramas hampir tiap hari dan samponya itu-itu saja, tapi sisiknya balik terus.' },
    ],
    obatSalahUmum: [
      { id: 'betametason_krim', alasan: 'Steroid poten pada wajah yang dipakai berulang pada penyakit kambuhan ini memicu rosasea steroid dan atrofi; cukup steroid ringan singkat bila perlu.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Kronik dan kambuhan; tanpa perawatan (antijamur/keratolitik ringan), sisik berminyak dan gatal berulang.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Kulit kepala dan sisi hidung kembali bersisik berminyak dan gatal.',
    },
    variasiPembuka: {
      cemas: 'Kulit kepala dan sisi hidung bersisik berminyak dan gatal — apa ini ketombe kanker, Dok?',
      polos: 'Kulit kepala sama sisi hidung bersisik berminyak, gatel, Dok.',
      lansia: 'Kulit kepala dan sisi hidung saya bersisik berminyak dan gatal, Dok.',
    },
  },
  lab_pitiriasis_rosea: {
    distraktor: [
      { id: 'q_dist_seperti_kurap', kategori: 'rps', tanya: 'Apakah bercak besar yang pertama itu tepinya meninggi dan tengahnya bersih seperti kurap?', jawab: 'Tidak, tengahnya tidak bersih; cuma ada sisik halus di pinggirnya.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Pitiriasis rosea swasirna dan bukan infeksi bakteri; antibiotik tidak berperan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Umumnya swasirna 6-8 minggu; kekhawatiran berlebih dan pengobatan tak perlu bisa dihindari dengan edukasi.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Bercak masih ada dan pasien cemas karena belum juga hilang.',
    },
    variasiPembuka: {
      cemas: 'Mulai satu bercak besar lalu muncul banyak bercak kecil di badan — apa ini penyakit menular berbahaya, Dok?',
      polos: 'Awalnya satu bercak gede, terus muncul banyak bercak kecil di badan, Dok.',
      lansia: 'Bermula satu bercak besar, lalu muncul banyak bercak kecil di badan saya, Dok.',
    },
  },
  lab_akne_vulgaris_ringan: {
    distraktor: [
      { id: 'q_dist_gorengan', kategori: 'sosial', tanya: 'Apakah jerawatnya bertambah setiap kali makan gorengan atau cokelat?', jawab: 'Sudah saya kurangi gorengan sebulan ini, tapi jerawatnya tetap sama saja.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Akne ringan cukup terapi topikal; antibiotik oral tak diindikasikan pada derajat ringan dan mendorong resistensi.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa terapi topikal dan perawatan kulit, komedo dan jerawat bertambah dan berisiko bekas.',
      kembaliHariMin: 10, kembaliHariMax: 14,
      kondisiKembali: 'Jerawat bertambah dan mulai meradang bernanah.',
    },
    variasiPembuka: {
      cemas: 'Wajah saya banyak komedo dan jerawat kecil — apa akan meninggalkan bekas permanen, Dok?',
      polos: 'Muka saya banyak komedo sama jerawat kecil-kecil, Dok.',
      lansia: 'Wajah saya banyak komedo dan beberapa jerawat kecil, Dok.',
    },
  },
  lab_hidradenitis_supuratif_hurley1: {
    distraktor: [
      { id: 'q_dist_deodoran', kategori: 'sosial', tanya: 'Apakah benjolan ini muncul karena deodoran atau karena Anda mencukur ketiak?', jawab: 'Saya jarang pakai deodoran, dan benjolannya tetap muncul walau tidak dicukur.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Nodul rekuren ini penyakit inflamasi folikel, bukan bisul biasa, sehingga antibiotik oral sesaat tidak mengubah perjalanannya maupun menyentuh faktor risiko seperti rokok dan berat badan.', bahaya: 'nonPrimer' },
      { id: 'betametason_krim', alasan: 'Steroid poten pada ketiak yang berkulit tipis dan sering bergesekan mempercepat atrofi tanpa mengendalikan penyakitnya.', bahaya: 'kontraindikasi' },
    ],
    konsekuensi: {
      narasi: 'Kronik-kambuhan; tanpa perawatan dan modifikasi faktor risiko, benjolan berulang dan bisa membentuk saluran/parut.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Benjolan ketiak kambuh, nyeri, dan sebagian pecah bernanah.',
    },
    variasiPembuka: {
      cemas: 'Benjolan nyeri berulang di ketiak yang kadang pecah — apa ini kanker kelenjar, Dok?',
      polos: 'Di ketiak benjolan nyeri kambuhan, kadang pecah sendiri, Dok.',
      lansia: 'Benjolan nyeri di ketiak saya berulang dan kadang pecah sendiri, Dok.',
    },
  },
  lab_dermatitis_perioral: {
    distraktor: [
      { id: 'q_dist_pasta_gigi', kategori: 'sosial', tanya: 'Apakah Anda memakai pasta gigi berfluoride tinggi atau obat kumur baru?', jawab: 'Pasta gigi saya biasa saja dan tidak pernah ganti; obat kumur juga tidak pakai.' },
    ],
    konsekuensi: {
      narasi: 'Justru dipicu/diperberat steroid; tanpa menghentikan steroid dan terapi tepat, bintil menetap dan memburuk.',
      kembaliHariMin: 7, kembaliHariMax: 14,
      kondisiKembali: 'Bintil merah sekitar mulut bertambah, apalagi bila steroid diteruskan.',
    },
    variasiPembuka: {
      cemas: 'Sekitar mulut muncul bintil merah setelah sering pakai krim steroid — apa wajah saya akan rusak, Dok?',
      polos: 'Sekitar mulut saya muncul bintil merah, Dok, padahal saya sering pakai krim.',
      lansia: 'Sekitar mulut saya muncul bintil merah setelah sering memakai krim steroid, Dok.',
    },
  },
  lab_miliaria_rubra: {
    distraktor: [
      { id: 'q_dist_pangkal_rambut', kategori: 'rps', tanya: 'Apakah setiap bintil tumbuh tepat di pangkal rambut dan ada mata nanahnya?', jawab: 'Tidak, bintilnya bukan di pangkal rambut dan tidak ada nanahnya.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Biang keringat bukan infeksi; antibiotik tak diperlukan, cukup dinginkan dan hindari panas berlebih.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Ringan dan swasirna; namun tanpa menjaga kulit sejuk-kering, bisa timbul infeksi sekunder pada garukan.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Bintil merah bertambah saat cuaca panas dan mulai perih.',
    },
    variasiPembuka: {
      cemas: 'Leher dan punggung muncul bintil merah pedih saat panas — apa ini alergi berbahaya, Dok?',
      polos: 'Kalau cuaca panas, leher sama punggung muncul bintil merah pedih, Dok.',
      lansia: 'Leher dan punggung saya muncul bintil merah pedih saat cuaca panas, Dok.',
    },
  },
  lab_erupsi_obat_morbiliformis: {
    distraktor: [
      { id: 'q_dist_alergi_keturunan', kategori: 'rpk', tanya: 'Apakah ada keluarga sedarah yang juga alergi terhadap antibiotik ini?', jawab: 'Setahu saya tidak ada; saya yang pertama begini di keluarga.' },
    ],
    obatSalahUmum: [
      { id: 'azitromisin_500', alasan: 'Ruam ini dipicu obat, bukan infeksi; menambah antibiotik baru justru memperbesar peluang penyebab tambahan alih-alih menghentikan obat tersangka.', bahaya: 'nonPrimer' },
      { id: 'dexamethasone_05', alasan: 'Refleks memberi steroid pada erupsi ringan tanpa tanda bahaya tidak menggantikan langkah kunci, yaitu menghentikan pencetus, dan dapat menyamarkan perburukan.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Melanjutkan obat pencetus berisiko reaksi lebih berat (mis. SJS/DRESS); tanda bahaya kulit-mukosa harus dikenali.',
      kembaliHariMin: 1, kembaliHariMax: 3,
      kondisiKembali: 'Ruam meluas, muncul lepuh, dan mulai kena bibir/mata (tanda bahaya).',
    },
    variasiPembuka: {
      cemas: 'Badan saya ruam merah gatal setelah mulai antibiotik baru — apa ini alergi obat yang mematikan, Dok?',
      polos: 'Abis minum antibiotik baru, badan saya ruam merah gatal, Dok.',
      lansia: 'Badan saya timbul ruam merah gatal setelah mulai antibiotik baru, Dok.',
    },
  },
  lab_vulnus_laseratum_lengan: {
    distraktor: [
      { id: 'q_dist_pengencer_darah', kategori: 'rpd', tanya: 'Apakah Anda rutin minum obat pengencer darah atau mudah lebam dan sulit berhenti berdarah?', jawab: 'Tidak, saya tidak minum obat apa pun dan tidak gampang lebam.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Luka bersih terkelola tidak rutin butuh antibiotik sistemik; utamakan cuci luka, jahit bila perlu, dan profilaksis tetanus.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Tanpa pembersihan luka yang baik dan profilaksis tetanus sesuai status imunisasi, risiko infeksi dan tetanus meningkat.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Luka bengkak, kemerahan, dan mengeluarkan nanah.',
    },
    variasiPembuka: {
      cemas: 'Lengan saya tersayat seng satu jam lalu — apa saya bisa kena tetanus atau infeksi berat, Dok?',
      polos: 'Lengan saya kesayat seng sejam lalu, Dok, lumayan dalam.',
      lansia: 'Lengan saya tersayat seng sekitar satu jam lalu, Dok.',
    },
  },
  lab_luka_bakar_derajat2_dangkal: {
    distraktor: [
      { id: 'q_dist_penyebab_tersiram', kategori: 'rpd', tanya: 'Apakah sebelum tersiram Anda sempat kejang, pingsan, atau kehilangan keseimbangan?', jawab: 'Tidak. Tangan saya hanya terpeleset saat menuang air panas.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Luka bakar dangkal terbatas tak rutin butuh antibiotik sistemik; utamakan pendinginan, balut bersih, dan analgesia.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Luka bakar dapat berubah kedalaman dalam beberapa hari pertama. Tanpa perawatan dan kontrol yang jelas, nyeri yang meningkat, balutan kotor atau tembus, serta tanda infeksi dapat terlambat dikenali.',
      kembaliHariMin: 1, kembaliHariMax: 3,
      kondisiKembali: 'Nyeri meningkat, sebagian dasar luka tampak lebih pucat, dan balutan basah-kotor; perlu penilaian ulang kedalaman serta tanda infeksi.',
    },
    variasiPembuka: {
      cemas: 'Lengan saya tersiram air panas dua puluh menit lalu. Petugas sedang mendinginkannya, tetapi saya takut lukanya makin dalam dan berbekas, Dok.',
      polos: 'Lengan saya kena air panas dua puluh menit lalu, Dok. Sekarang sedang dialiri air sama petugas.',
      lansia: 'Lengan bawah saya tersiram air panas sekitar dua puluh menit lalu, Dok. Petugas langsung mulai mengalirkan air sejuk saat saya tiba.',
    },
  },
  lab_trauma_tumpul_kepala_ringan: {
    distraktor: [
      { id: 'q_dist_pusing_berputar', kategori: 'rps', tanya: 'Apakah belakangan ini Anda sering pusing berputar sampai kehilangan keseimbangan?', jawab: 'Tidak pernah; saya cuma tidak lihat pintu lemarinya sedang terbuka.' },
    ],
    obatSalahUmum: [
      { id: 'diazepam_2', alasan: 'Tidak ada agitasi, kejang, atau indikasi benzodiazepin. Sedasi yang tidak perlu dapat mengaburkan perubahan kesadaran saat observasi serial; gunakan penjelasan dan lingkungan tenang.', bahaya: 'nonPrimer' },
      { id: 'tramadol_50', alasan: 'Nyeri hanya ringan dan lokal saat benjolan ditekan. Tramadol bukan lini pertama dan dapat menimbulkan kantuk, mual, atau muntah yang menyulitkan penilaian ulang; parasetamol opsional sudah memadai.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Risiko komplikasi intrakranial pada profil ini rendah, tetapi tanpa penilaian serial, pendamping, dan safety-net, perburukan yang jarang dapat terlambat dikenali.',
      kembaliHariMin: 1, kembaliHariMax: 2,
      kondisiKembali: 'Muncul sakit kepala hebat, muntah berulang, dan makin mengantuk.',
    },
    variasiPembuka: {
      cemas: 'Kepala saya terbentur lemari dua jam lalu. Saya tidak pingsan, tetapi khawatir ada perdarahan di otak, Dok.',
      polos: 'Kepala saya kejedot lemari dua jam lalu, Dok. Cuma benjol kecil dan nyeri kalau ditekan.',
      lansia: 'Kepala saya terbentur lemari dua jam lalu, Dok. Saya tetap sadar dan ingat seluruh kejadiannya.',
    },
  },
  lab_trauma_tajam_kulit_kepala: {
    distraktor: [
      { id: 'q_dist_keloid', kategori: 'rpd', tanya: 'Apakah bekas luka Anda sebelumnya pernah sembuh menonjol dan melebar jadi keloid?', jawab: 'Tidak pernah; bekas luka lama saya rata dan biasa saja.' },
    ],
    obatSalahUmum: [
      { id: 'amoxicillin_500', alasan: 'Luka bersih yang terkelola baik tak rutin butuh antibiotik sistemik; utamakan hemostasis, cuci luka, jahit, dan profilaksis tetanus.', bahaya: 'nonPrimer' },
    ],
    konsekuensi: {
      narasi: 'Kulit kepala sangat vaskular; tanpa hemostasis dan perawatan luka serta profilaksis tetanus, risiko perdarahan dan infeksi.',
      kembaliHariMin: 3, kembaliHariMax: 7,
      kondisiKembali: 'Luka kulit kepala bengkak, kemerahan, dan bernanah.',
    },
    variasiPembuka: {
      cemas: 'Kulit kepala saya tersayat seng satu jam lalu dan berdarah banyak — apa ini berbahaya, Dok?',
      polos: 'Kulit kepala saya kesayat seng sejam lalu, Dok, darahnya lumayan banyak.',
      lansia: 'Kulit kepala saya tersayat tepi seng sekitar satu jam lalu, Dok.',
    },
  },
}
