import type { ContentPack } from './pack'

export interface SumberPedagogis {
  id: string
  label: string
  url: string
  tahun: number
}

export interface PilihanFormatif {
  id: string
  label: string
  benar: boolean
  respons: string
}

export interface DuelDiagnosisPilot {
  id: string
  sisi: readonly [
    { kasusId: string; keputusan: string },
    { kasusId: string; keputusan: string },
  ]
  pembeda: string
  pembalik: string
  pertanyaan: string
  pilihan: readonly PilihanFormatif[]
  sumber: readonly SumberPedagogis[]
}

export interface TeachBackPilot {
  id: string
  kasusId: string
  judul: string
  fokus: string
  pertanyaanPembuka: string
  pilihanPembuka: readonly PilihanFormatif[]
  ucapanPasienAwal: string
  pertanyaanPenilaian: string
  pilihanPenilaian: readonly PilihanFormatif[]
  ajarUlang: string
  ucapanPasienAkhir: string
  sumber: readonly SumberPedagogis[]
}

const AHRQ_TEACH_BACK: SumberPedagogis = {
  id: 'ahrq-teach-back-2024',
  label: 'AHRQ Health Literacy Toolkit - Teach-Back',
  url: 'https://www.ahrq.gov/health-literacy/improve/precautions/tool5.html',
  tahun: 2024,
}

export const DUEL_DIAGNOSIS_PILOTS: readonly DuelDiagnosisPilot[] = [
  {
    id: 'duel-bronkitis-pneumonia',
    sisi: [
      { kasusId: 'bronkitis_akut', keputusan: 'Bronkitis akut, bukan pneumonia komunitas.' },
      { kasusId: 'lab_pneumonia_komunitas_dewasa', keputusan: 'Pneumonia komunitas, bukan bronkitis akut.' },
    ],
    pembeda: 'Pneumonia ditopang tanda sistemik dan temuan paru fokal; bronkitis akut tidak memiliki konsolidasi fokal.',
    pembalik: 'Takipnea, hipoksemia, atau temuan fokal baru menggeser kecurigaan ke pneumonia.',
    pertanyaan: 'Temuan mana paling kuat menggeser batuk akut menjadi pneumonia?',
    pilihan: [
      { id: 'fokal', label: 'Takipnea disertai ronki fokal atau hipoksemia', benar: true, respons: 'Benar. Kombinasi ini mengubah probabilitas dan kebutuhan evaluasi pneumonia.' },
      { id: 'dahak', label: 'Dahak berwarna kuning saja', benar: false, respons: 'Warna dahak sendiri tidak membedakan infeksi bakteri atau pneumonia.' },
      { id: 'durasi', label: 'Batuk baru berlangsung lima hari', benar: false, respons: 'Durasi pendek lazim pada keduanya dan tidak cukup menjadi pembeda.' },
    ],
    sumber: [{ id: 'idsa-cap-2019', label: 'ATS/IDSA Community-Acquired Pneumonia Guideline', url: 'https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults', tahun: 2019 }],
  },
  {
    id: 'duel-tinea-dermatitis',
    sisi: [
      { kasusId: 'kulit_tinea_korporis', keputusan: 'Tinea korporis, bukan dermatitis kontak.' },
      { kasusId: 'kulit_dermatitis_kontak', keputusan: 'Dermatitis kontak, bukan tinea korporis.' },
    ],
    pembeda: 'Tinea memiliki tepi aktif bersisik dengan bagian tengah yang lebih tenang; dermatitis mengikuti pola pajanan tanpa tepi aktif khas.',
    pembalik: 'KOH positif atau tepi melingkar yang aktif menggeser ke tinea; hubungan pajanan yang tegas menggeser ke dermatitis.',
    pertanyaan: 'Temuan mana paling mendukung tinea dibanding dermatitis kontak?',
    pilihan: [
      { id: 'tepi', label: 'Tepi melingkar aktif dan bersisik, dengan bagian tengah lebih tenang', benar: true, respons: 'Benar. Ambil kerokan dari tepi aktif bila konfirmasi KOH tersedia.' },
      { id: 'gatal', label: 'Keluhan gatal', benar: false, respons: 'Gatal lazim pada keduanya dan bukan pembeda kuat.' },
      { id: 'merah', label: 'Kulit tampak kemerahan', benar: false, respons: 'Eritema juga tidak spesifik dan harus dibaca bersama morfologi serta pajanan.' },
    ],
    sumber: [{ id: 'cdc-ringworm-2024', label: 'CDC Clinical Overview of Ringworm', url: 'https://www.cdc.gov/ringworm/hcp/clinical-overview/index.html', tahun: 2024 }],
  },
  {
    id: 'duel-konjungtivitis',
    sisi: [
      { kasusId: 'konjungtivitis_bakterial', keputusan: 'Konjungtivitis bakterial, bukan konjungtivitis alergi.' },
      { kasusId: 'mata_konjungtivitis_alergi', keputusan: 'Konjungtivitis alergi, bukan konjungtivitis bakterial.' },
    ],
    pembeda: 'Sekret mukopurulen dan kelopak melekat mendukung bakteri; gatal dominan bilateral dengan riwayat atopi mendukung alergi.',
    pembalik: 'Nyeri, fotofobia, atau visus turun membalik alur: pikirkan penyakit mata serius, bukan salah satu dari keduanya.',
    pertanyaan: 'Temuan mana paling kuat menggeser mata merah ke etiologi alergi?',
    pilihan: [
      { id: 'gatal', label: 'Gatal dominan bilateral disertai rinitis atau atopi', benar: true, respons: 'Benar. Gatal dominan dan konteks atopi lebih diskriminatif untuk alergi.' },
      { id: 'merah', label: 'Konjungtiva tampak merah', benar: false, respons: 'Mata merah adalah titik temu berbagai etiologi, bukan pembeda.' },
      { id: 'belekan', label: 'Kelopak melekat oleh sekret mukopurulen', benar: false, respons: 'Temuan itu justru lebih mendukung konjungtivitis bakterial.' },
    ],
    sumber: [{ id: 'cdc-conjunctivitis-2024', label: 'CDC Clinical Overview of Conjunctivitis', url: 'https://www.cdc.gov/conjunctivitis/hcp/clinical-overview/index.html', tahun: 2024 }],
  },
  {
    id: 'duel-otitis',
    sisi: [
      { kasusId: 'otitis_media_akut', keputusan: 'Otitis media akut, bukan otitis eksterna.' },
      { kasusId: 'otitis_eksterna_akut_ringan', keputusan: 'Otitis eksterna akut, bukan otitis media.' },
    ],
    pembeda: 'Nyeri tragus dan edema liang telinga menunjuk eksterna; membran timpani bulging dengan efusi menunjuk media.',
    pembalik: 'Mastoid bengkak, toksisitas, defisit saraf, atau diabetes tak terkontrol menuntut eskalasi, bukan sekadar mengganti label.',
    pertanyaan: 'Temuan mana paling membedakan otitis eksterna dari otitis media?',
    pilihan: [
      { id: 'tragus', label: 'Nyeri jelas saat tragus ditekan atau pinna ditarik', benar: true, respons: 'Benar. Temuan ini melokalisasi inflamasi ke liang telinga.' },
      { id: 'demam', label: 'Demam ringan', benar: false, respons: 'Demam ringan dapat menyertai infeksi telinga dan tidak cukup melokalisasi.' },
      { id: 'otalgia', label: 'Keluhan nyeri telinga', benar: false, respons: 'Otalgia hadir pada keduanya; pemeriksaan tragus, kanal, dan membran timpani yang membedakan.' },
    ],
    sumber: [{ id: 'aao-hns-aoe-2014', label: 'AAO-HNSF Acute Otitis Externa Guideline', url: 'https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/aoe/', tahun: 2014 }],
  },
  {
    id: 'duel-uti',
    sisi: [
      { kasusId: 'mm_isk_bawah', keputusan: 'Sistitis, bukan pielonefritis.' },
      { kasusId: 'lab_pielonefritis_tanpa_komplikasi', keputusan: 'Pielonefritis, bukan sistitis.' },
    ],
    pembeda: 'Sistitis terbatas pada gejala kemih bawah; demam, nyeri pinggang, atau nyeri ketok CVA menunjuk pielonefritis.',
    pembalik: 'Sepsis, muntah, kehamilan, obstruksi, atau gagal minum menggeser dari rawat jalan ke rujukan.',
    pertanyaan: 'Temuan mana paling kuat mengubah sistitis menjadi pielonefritis?',
    pilihan: [
      { id: 'cva', label: 'Demam disertai nyeri pinggang atau nyeri ketok CVA', benar: true, respons: 'Benar. Ini menandakan keterlibatan saluran kemih atas.' },
      { id: 'disuria', label: 'Nyeri saat berkemih', benar: false, respons: 'Disuria terjadi pada sistitis maupun pielonefritis.' },
      { id: 'frekuensi', label: 'Frekuensi berkemih meningkat', benar: false, respons: 'Frekuensi adalah gejala kemih bawah dan bukan pembeda utama.' },
    ],
    sumber: [{ id: 'nice-pyelonephritis-ng111', label: 'NICE Acute Pyelonephritis Guideline NG111', url: 'https://www.nice.org.uk/guidance/ng111/chapter/Recommendations', tahun: 2018 }],
  },
  {
    id: 'duel-vaginitis',
    sisi: [
      { kasusId: 'lab_vaginitis_kandida', keputusan: 'Kandidiasis vulvovaginal, bukan vaginosis bakterialis.' },
      { kasusId: 'lab_vaginosis_bakterialis', keputusan: 'Vaginosis bakterialis, bukan kandidiasis vulvovaginal.' },
    ],
    pembeda: 'Kandida menonjolkan gatal, inflamasi, dan duh kental; BV menonjolkan duh homogen amis dengan sedikit inflamasi.',
    pembalik: 'Nyeri panggul, demam, perdarahan, atau servisitis mengharuskan evaluasi etiologi lain dan komplikasi.',
    pertanyaan: 'Kombinasi mana paling mendukung vaginosis bakterialis?',
    pilihan: [
      { id: 'bv', label: 'Duh homogen tipis, bau amis, pH lebih dari 4,5, clue cells', benar: true, respons: 'Benar. Ini sesuai kriteria klinis BV dan berlawanan dengan pola kandida.' },
      { id: 'vvc', label: 'Gatal hebat, vulva meradang, duh putih menggumpal', benar: false, respons: 'Kombinasi ini lebih mendukung kandidiasis vulvovaginal.' },
      { id: 'nyeri', label: 'Nyeri perut bawah dan demam', benar: false, respons: 'Itu tanda bahaya untuk PID atau etiologi lain, bukan pembeda BV sederhana.' },
    ],
    sumber: [{ id: 'cdc-vaginal-discharge-2021', label: 'CDC STI Guidelines - Vaginal Discharge', url: 'https://www.cdc.gov/std/treatment-guidelines/vaginal-discharge.htm', tahun: 2021 }],
  },
  {
    id: 'duel-gout-oa',
    sisi: [
      { kasusId: 'mm_gout_artritis_akut', keputusan: 'Artritis gout akut, bukan osteoartritis.' },
      { kasusId: 'mm_osteoartritis_lutut', keputusan: 'Osteoartritis lutut, bukan artritis gout akut.' },
    ],
    pembeda: 'Gout menyerang mendadak sebagai monoartritis merah-panas; OA memberi nyeri aktivitas kronik, krepitasi, dan kaku singkat.',
    pembalik: 'Demam atau sendi sangat toksik menuntut eksklusi artritis septik; asam urat normal tidak menyingkirkan gout akut.',
    pertanyaan: 'Temuan mana paling mendukung gout akut dibanding osteoartritis?',
    pilihan: [
      { id: 'mendadak', label: 'Monoartritis sangat nyeri, merah-panas, memuncak kurang dari 24 jam', benar: true, respons: 'Benar. Tempo dan inflamasi akut adalah pembeda utama.' },
      { id: 'krepitasi', label: 'Nyeri aktivitas menahun dengan krepitasi', benar: false, respons: 'Ini pola mekanik yang lebih mendukung osteoartritis.' },
      { id: 'urat', label: 'Satu hasil asam urat normal', benar: false, respons: 'Asam urat dapat normal saat serangan akut dan tidak menyingkirkan gout.' },
    ],
    sumber: [
      { id: 'acr-gout-2020', label: 'American College of Rheumatology Gout Guideline', url: 'https://rheumatology.org/gout-guideline', tahun: 2020 },
      { id: 'nice-oa-ng226', label: 'NICE Osteoarthritis Guideline NG226', url: 'https://www.nice.org.uk/guidance/ng226/chapter/Recommendations', tahun: 2022 },
    ],
  },
  {
    id: 'duel-gerd-dispepsia',
    sisi: [
      { kasusId: 'gerd', keputusan: 'GERD, bukan dispepsia fungsional.' },
      { kasusId: 'dispepsia_fungsional', keputusan: 'Dispepsia fungsional, bukan GERD.' },
    ],
    pembeda: 'Rasa panas terbakar di belakang tulang dada dan regurgitasi menunjuk GERD; nyeri epigastrium, cepat kenyang, dan penuh pascamakan menunjuk dispepsia.',
    pembalik: 'Disfagia, perdarahan, anemia, berat badan turun, atau onset baru usia lanjut mengubah alur menjadi evaluasi alarm.',
    pertanyaan: 'Temuan mana paling spesifik menggeser keluhan ulu hati ke GERD?',
    pilihan: [
      { id: 'regurgitasi', label: 'Regurgitasi asam dan rasa panas di dada yang memberat saat berbaring', benar: true, respons: 'Benar. Kombinasi ini lebih khas refluks gastroesofageal.' },
      { id: 'mual', label: 'Keluhan mual', benar: false, respons: 'Mual dapat muncul pada banyak gangguan saluran cerna atas.' },
      { id: 'epigastrium', label: 'Cepat kenyang dan penuh pascamakan tanpa regurgitasi', benar: false, respons: 'Pola ini lebih mendukung sindrom dispepsia.' },
    ],
    sumber: [{ id: 'nice-dyspepsia-cg184', label: 'NICE GORD and Dyspepsia Guideline CG184', url: 'https://www.nice.org.uk/guidance/cg184/chapter/Recommendations', tahun: 2019 }],
  },
]

const pilihanPembuka = (fokus: string): readonly PilihanFormatif[] => [
  {
    id: 'non_shaming',
    label: `Saya ingin memastikan penjelasan saya jelas. Tolong tunjukkan kembali ${fokus}.`,
    benar: true,
    respons: 'Tepat. Kalimat ini menguji kejernihan penjelasan dokter, bukan kecerdasan pasien.',
  },
  {
    id: 'ya_tidak',
    label: 'Sudah paham semuanya, ya?',
    benar: false,
    respons: 'Pertanyaan ya/tidak mudah menghasilkan jawaban sopan tanpa membuktikan pemahaman.',
  },
  {
    id: 'shaming',
    label: 'Ini sederhana. Masa masih belum mengerti?',
    benar: false,
    respons: 'Bahasa menyalahkan membuat pasien menyembunyikan kebingungan dan bertentangan dengan prinsip meminta pasien menjelaskan kembali.',
  },
]

const pilihanPenilaian = (aksi: string): readonly PilihanFormatif[] => [
  {
    id: 'reteach',
    label: aksi,
    benar: true,
    respons: 'Benar. Perbaiki satu bagian yang keliru, lalu minta pasien menunjukkan kembali.',
  },
  {
    id: 'lulus',
    label: 'Anggap cukup karena pasien sudah mengulang sebagian pesan.',
    benar: false,
    respons: 'Pengulangan parsial masih menyisakan tindakan berisiko; ajarkan kembali bagian yang keliru secara singkat.',
  },
]

export const TEACH_BACK_PILOTS: readonly TeachBackPilot[] = [
  {
    id: 'teachback-inhaler',
    kasusId: 'asma_ringan',
    judul: 'Demonstrasi ulang teknik inhaler',
    fokus: 'cara memakai inhaler satu kali dari awal sampai selesai',
    pertanyaanPembuka: 'Kalimat mana paling aman untuk meminta demonstrasi ulang?',
    pilihanPembuka: pilihanPembuka('cara memakai inhaler satu kali dari awal sampai selesai'),
    ucapanPasienAwal: 'Saya semprotkan obat, lalu bernapas cepat beberapa kali. Tidak perlu menahan napas.',
    pertanyaanPenilaian: 'Apa respons dokter berikutnya?',
    pilihanPenilaian: pilihanPenilaian('Ajarkan ulang satu puff: ekshalasi, aktuasi sambil inspirasi perlahan, lalu tahan napas.'),
    ajarUlang: 'Demonstrasikan satu puff perlahan. Bila memakai spacer, berikan satu puff per siklus dan cek segel mulut.',
    ucapanPasienAkhir: 'Saya buang napas dulu, rapatkan mulut, tekan sambil menarik napas perlahan, lalu tahan sekitar sepuluh detik.',
    sumber: [
      AHRQ_TEACH_BACK,
      { id: 'gina-2026', label: 'GINA Strategy Report 2026', url: 'https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf', tahun: 2026 },
    ],
  },
  {
    id: 'teachback-diare-anak',
    kasusId: 'diare_akut_anak',
    judul: 'Jelaskan kembali: oralit dan asupan',
    fokus: 'apa yang akan dilakukan di rumah setelah setiap BAB cair',
    pertanyaanPembuka: 'Kalimat mana paling aman untuk memeriksa rencana keluarga?',
    pilihanPembuka: pilihanPembuka('apa yang akan dilakukan di rumah setelah setiap BAB cair'),
    ucapanPasienAwal: 'Saya beri oralit sekaligus banyak. ASI dan makan saya hentikan dulu supaya ususnya istirahat.',
    pertanyaanPenilaian: 'Apa respons dokter berikutnya?',
    pilihanPenilaian: pilihanPenilaian('Ajarkan ulang: oralit sedikit-sering, lanjutkan ASI/makan, zinc tuntas, dan sebutkan tanda bahaya.'),
    ajarUlang: 'Tekankan cairan sedikit tetapi sering, lanjutkan ASI dan makan sesuai toleransi, serta kembali bila anak tidak mampu minum, sangat lemas, berdarah, atau makin cekung.',
    ucapanPasienAkhir: 'Saya beri oralit sedikit-sedikit setiap BAB, ASI dan makan tetap lanjut, zinc dituntaskan, dan segera kembali bila anak lemas atau tidak bisa minum.',
    sumber: [
      AHRQ_TEACH_BACK,
      { id: 'who-diarrhoea-2024', label: 'WHO Diarrhoeal Disease Clinical Summary', url: 'https://www.who.int/news-room/fact-sheets/detail/diarrhoeal-disease', tahun: 2024 },
    ],
  },
  {
    id: 'teachback-hipoglikemia',
    kasusId: 'hipoglikemia_ringan_dewasa',
    judul: 'Jelaskan kembali: aturan 15-15',
    fokus: 'apa yang dilakukan bila gula kurang dari 70 dan masih sadar',
    pertanyaanPembuka: 'Kalimat mana paling aman untuk memeriksa pemahaman pasien?',
    pilihanPembuka: pilihanPembuka('apa yang dilakukan bila gula kurang dari 70 dan masih sadar'),
    ucapanPasienAwal: 'Saya minum sedikit teh manis lalu tidur. Gula saya cek lagi besok pagi.',
    pertanyaanPenilaian: 'Apa respons dokter berikutnya?',
    pilihanPenilaian: pilihanPenilaian('Ajarkan ulang 15 gram glukosa, cek ulang 15 menit, ulangi bila masih rendah; tanpa oral bila tidak sadar.'),
    ajarUlang: 'Gunakan 15 gram karbohidrat cepat saat sadar dan dapat menelan, cek ulang setelah 15 menit, lalu ulangi bila masih rendah. Penurunan kesadaran memerlukan bantuan darurat, bukan minuman paksa.',
    ucapanPasienAkhir: 'Kalau masih sadar saya ambil 15 gram gula cepat, cek lagi 15 menit, dan ulangi bila masih rendah. Kalau tidak sadar, keluarga tidak memaksa minum.',
    sumber: [
      AHRQ_TEACH_BACK,
      { id: 'ada-hypoglycemia-2026', label: 'ADA Standards of Care 2026 - Hypoglycemia', url: 'https://diabetesjournals.org/care/article/49/Supplement_1/S132/163927/6-Glycemic-Goals-Hypoglycemia-and-Hyperglycemic', tahun: 2026 },
    ],
  },
  {
    id: 'teachback-tb',
    kasusId: 'tb_paru',
    judul: 'Jelaskan kembali: kesinambungan terapi TB',
    fokus: 'rencana minum obat dan siapa yang dihubungi bila ada masalah',
    pertanyaanPembuka: 'Kalimat mana paling aman untuk memeriksa rencana pengobatan?',
    pilihanPembuka: pilihanPembuka('rencana minum obat dan siapa yang dihubungi bila ada masalah'),
    ucapanPasienAwal: 'Kalau batuk sudah hilang, obat boleh saya hentikan supaya hati tidak rusak.',
    pertanyaanPenilaian: 'Apa respons dokter berikutnya?',
    pilihanPenilaian: pilihanPenilaian('Jelaskan ulang bahwa KDT diteruskan sesuai jadwal; efek samping dilaporkan ke tim TB, bukan dihentikan sendiri.'),
    ajarUlang: 'Hubungkan pasien dengan tim TB/PMO, jelaskan jadwal KDT harian, dan buat rencana kontak bila dosis terlewat atau muncul efek samping.',
    ucapanPasienAkhir: 'Obat tetap saya minum setiap hari sampai program menyatakan selesai. Kalau ada efek samping atau dosis terlewat, saya hubungi tim TB dan tidak menghentikan sendiri.',
    sumber: [
      AHRQ_TEACH_BACK,
      { id: 'who-tb-module4-2025', label: 'WHO TB Module 4: Treatment and Care', url: 'https://www.who.int/publications/i/item/9789240107243', tahun: 2025 },
    ],
  },
  {
    id: 'teachback-insulin',
    kasusId: 'lab_dm_tipe1_stabil_prb',
    judul: 'Jelaskan kembali: kesiapan menghadapi hipoglikemia',
    fokus: 'langkah saat gemetar atau berkeringat setelah insulin',
    pertanyaanPembuka: 'Kalimat mana paling aman untuk memeriksa rencana pasien?',
    pilihanPembuka: pilihanPembuka('langkah saat gemetar atau berkeringat setelah insulin'),
    ucapanPasienAwal: 'Kalau gemetar, berarti gula sedang tinggi. Saya suntik insulin tambahan supaya cepat turun.',
    pertanyaanPenilaian: 'Apa respons dokter berikutnya?',
    pilihanPenilaian: pilihanPenilaian('Koreksi: cek gula, tangani hipoglikemia sadar dengan aturan 15-15, dan jangan menambah insulin tanpa rencana.'),
    ajarUlang: 'Bedakan gejala hipoglikemia dari hiperglikemia dengan pemeriksaan gula bila memungkinkan dan siapkan glukosa cepat serta kontak pertolongan.',
    ucapanPasienAkhir: 'Kalau gemetar saya cek gula. Bila kurang dari 70 dan masih sadar, saya pakai aturan 15-15; saya tidak menambah insulin di luar rencana.',
    sumber: [AHRQ_TEACH_BACK, { id: 'ada-hypoglycemia-2026', label: 'ADA Standards of Care 2026 - Hypoglycemia', url: 'https://diabetesjournals.org/care/article/49/Supplement_1/S132/163927/6-Glycemic-Goals-Hypoglycemia-and-Hyperglycemic', tahun: 2026 }],
  },
  {
    id: 'teachback-pneumonia',
    kasusId: 'lab_pneumonia_komunitas_dewasa',
    judul: 'Jelaskan kembali: antibiotik dan tanda bahaya',
    fokus: 'cara minum obat dan kapan harus kembali lebih cepat',
    pertanyaanPembuka: 'Kalimat mana paling aman untuk memeriksa rencana pulang?',
    pilihanPembuka: pilihanPembuka('cara minum obat dan kapan harus kembali lebih cepat'),
    ucapanPasienAwal: 'Begitu demam turun, antibiotik saya hentikan. Kalau sesak, saya tunggu kontrol minggu depan.',
    pertanyaanPenilaian: 'Apa respons dokter berikutnya?',
    pilihanPenilaian: pilihanPenilaian('Ajarkan ulang durasi sesuai resep, evaluasi bila tidak membaik 48-72 jam, dan kembali segera bila sesak atau bingung.'),
    ajarUlang: 'Pisahkan dua pesan: obat diminum sesuai durasi yang diresepkan; sesak, penurunan kesadaran, tidak mampu minum, atau memburuk adalah alasan kembali segera.',
    ucapanPasienAkhir: 'Antibiotik saya minum sesuai durasi resep. Kalau sesak, bingung, tidak bisa minum, atau tidak membaik dalam dua sampai tiga hari, saya kembali lebih cepat.',
    sumber: [AHRQ_TEACH_BACK, { id: 'idsa-cap-2019', label: 'ATS/IDSA Community-Acquired Pneumonia Guideline', url: 'https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults', tahun: 2019 }],
  },
  {
    id: 'teachback-bell',
    kasusId: 'saraf_bells_palsy',
    judul: 'Demonstrasi ulang perlindungan kornea',
    fokus: 'cara melindungi mata yang belum dapat menutup saat tidur',
    pertanyaanPembuka: 'Kalimat mana paling aman untuk meminta demonstrasi ulang?',
    pilihanPembuka: pilihanPembuka('cara melindungi mata yang belum dapat menutup saat tidur'),
    ucapanPasienAwal: 'Kelopak saya biarkan terbuka. Tetes mata hanya dipakai kalau sudah terasa perih.',
    pertanyaanPenilaian: 'Apa respons dokter berikutnya?',
    pilihanPenilaian: pilihanPenilaian('Demonstrasikan pelumas dan penutupan kelopak yang aman; minta pasien menunjukkan kembali.'),
    ajarUlang: 'Gunakan pelumas sesuai rencana dan lindungi kelopak saat tidur tanpa menekan bola mata. Nyeri, merah berat, atau visus turun memerlukan evaluasi segera.',
    ucapanPasienAkhir: 'Saya gunakan pelumas teratur dan menutup kelopak dengan aman saat tidur. Kalau mata nyeri, sangat merah, atau penglihatan turun, saya segera kembali.',
    sumber: [AHRQ_TEACH_BACK],
  },
  {
    id: 'teachback-otitis-eksterna',
    kasusId: 'otitis_eksterna_akut_ringan',
    judul: 'Demonstrasi ulang teknik tetes telinga',
    fokus: 'cara meneteskan obat telinga dan menjaga telinga tetap kering',
    pertanyaanPembuka: 'Kalimat mana paling aman untuk meminta demonstrasi ulang?',
    pilihanPembuka: pilihanPembuka('cara meneteskan obat telinga dan menjaga telinga tetap kering'),
    ucapanPasienAwal: 'Obat saya teteskan di lubang telinga sambil berdiri, lalu saya sumbat kapas sepanjang hari.',
    pertanyaanPenilaian: 'Apa respons dokter berikutnya?',
    pilihanPenilaian: pilihanPenilaian('Demonstrasikan posisi miring, tetes sesuai dosis, pertahankan posisi, dan hindari mengorek atau menyumbat kanal.'),
    ajarUlang: 'Miringkan telinga yang sakit ke atas, teteskan sesuai resep, diam beberapa menit, dan jaga kanal kering tanpa cotton bud atau sumbatan yang ditinggal.',
    ucapanPasienAkhir: 'Saya miringkan telinga ke atas, teteskan sesuai resep, diam beberapa menit, lalu menjaga telinga kering tanpa mengorek atau menyumbatnya.',
    sumber: [AHRQ_TEACH_BACK, { id: 'aao-hns-aoe-2014', label: 'AAO-HNSF Acute Otitis Externa Guideline', url: 'https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/aoe/', tahun: 2014 }],
  },
]

export function duelUntukKasus(kasusId: string): DuelDiagnosisPilot | undefined {
  return DUEL_DIAGNOSIS_PILOTS.find((item) => item.sisi.some((sisi) => sisi.kasusId === kasusId))
}

export function teachBackUntukKasus(kasusId: string): TeachBackPilot | undefined {
  return TEACH_BACK_PILOTS.find((item) => item.kasusId === kasusId)
}

function hitungKata(teks: string): number {
  return teks.trim().split(/\s+/).filter(Boolean).length
}

export function validasiPedagogyPilots(pack: ContentPack): string[] {
  const masalah: string[] = []
  const semuaId = new Set<string>()
  const sumber = new Map<string, string>()

  if (DUEL_DIAGNOSIS_PILOTS.length !== 8) masalah.push(`Pilot Duel Diagnosis harus tepat 8, ditemukan ${DUEL_DIAGNOSIS_PILOTS.length}`)
  if (TEACH_BACK_PILOTS.length < 6 || TEACH_BACK_PILOTS.length > 8) masalah.push(`Pilot Teach-back harus 6-8, ditemukan ${TEACH_BACK_PILOTS.length}`)

  for (const duel of DUEL_DIAGNOSIS_PILOTS) {
    if (semuaId.has(duel.id)) masalah.push(`ID pilot duplikat: ${duel.id}`)
    semuaId.add(duel.id)
    const caseIds = duel.sisi.map((sisi) => sisi.kasusId)
    if (new Set(caseIds).size !== 2) masalah.push(`${duel.id}: kedua sisi harus kasus berbeda`)
    for (const kasusId of caseIds) {
      if (!pack.kasus[kasusId]) masalah.push(`${duel.id}: kasus '${kasusId}' tidak ada di PACK`)
    }
    if (duel.pilihan.filter((item) => item.benar).length !== 1) masalah.push(`${duel.id}: pilihan harus tepat satu yang benar`)
    for (const sisi of duel.sisi) {
      const total = hitungKata(`${sisi.keputusan} ${duel.pembeda} ${duel.pembalik}`)
      if (total > 55) masalah.push(`${duel.id}: debrief sisi ${sisi.kasusId} melebihi 55 kata (${total})`)
    }
    for (const item of duel.sumber) {
      if (!item.url.startsWith('https://')) masalah.push(`${duel.id}: sumber ${item.id} bukan HTTPS`)
      const serialized = JSON.stringify(item)
      const lama = sumber.get(item.id)
      if (lama && lama !== serialized) masalah.push(`Metadata sumber '${item.id}' tidak konsisten`)
      sumber.set(item.id, serialized)
    }
  }

  const kasusTeachBack = new Set<string>()
  for (const pilot of TEACH_BACK_PILOTS) {
    if (semuaId.has(pilot.id)) masalah.push(`ID pilot duplikat: ${pilot.id}`)
    semuaId.add(pilot.id)
    if (!pack.kasus[pilot.kasusId]) masalah.push(`${pilot.id}: kasus '${pilot.kasusId}' tidak ada di PACK`)
    if (kasusTeachBack.has(pilot.kasusId)) masalah.push(`${pilot.id}: kasus Teach-back duplikat '${pilot.kasusId}'`)
    kasusTeachBack.add(pilot.kasusId)
    if (pilot.pilihanPembuka.filter((item) => item.benar).length !== 1) masalah.push(`${pilot.id}: prompt harus tepat satu yang benar`)
    if (pilot.pilihanPenilaian.filter((item) => item.benar).length !== 1) masalah.push(`${pilot.id}: penilaian harus tepat satu yang benar`)
    const promptBenar = pilot.pilihanPembuka.find((item) => item.benar)?.label ?? ''
    if (/\?$/.test(promptBenar) || /sudah paham|mengerti/i.test(promptBenar)) masalah.push(`${pilot.id}: prompt benar masih dapat menjadi pertanyaan ya/tidak`)
    for (const item of pilot.sumber) {
      if (!item.url.startsWith('https://')) masalah.push(`${pilot.id}: sumber ${item.id} bukan HTTPS`)
      const serialized = JSON.stringify(item)
      const lama = sumber.get(item.id)
      if (lama && lama !== serialized) masalah.push(`Metadata sumber '${item.id}' tidak konsisten`)
      sumber.set(item.id, serialized)
    }
  }
  return masalah
}
