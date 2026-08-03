/**
 * KASUS SARAF / MATA / THT — Batch M3 (11 kasus).
 *
 * Ditulis terhadap kontrak `KasusKlinis` (src/content/types.ts). Semua id obat/lab/
 * edukasi/tindakan memakai palet kanonik M3_CONTENT_SPEC. Akurasi klinis mengikuti
 * PNPK/PPK Kemenkes dan pedoman profesi/WHO yang relevan — lihat
 * tiap `clue` & `obatSalahUmum`.
 *
 * Dua kasus WAJIB-RUJUK:
 *   - epilepsi_kejang     → spesialisRujukan: 'saraf' (perlu EEG + OAE jangka panjang).
 *   - glaukoma_akut       → spesialisRujukan: 'mata' (EMERGENSI, ancaman kebutaan).
 *
 * Catatan kontrak: field `distraktor` sudah ada di `PertanyaanAnamnesis`, dipakai
 * eksplisit di sini (bukan sekadar komentar).
 */

import type { KasusKlinis } from '../types'

export const KASUS_SARAF_MATA_THT: KasusKlinis[] = [
  /* ======================================================================
   * 1. Tension-Type Headache (Nyeri Kepala Tipe Tegang) — SARAF 4A tinggi
   * Poin ajar: nyeri seperti diikat, bilateral, TANPA red flag → analgetik +
   * manajemen stres, BUKAN langsung CT-scan. Neuroimaging hanya bila ada red flag.
   * ==================================================================== */
  {
    id: 'saraf_tension_headache',
    nama: 'Nyeri Kepala Tipe Tegang (Tension-Type Headache)',
    icd10: 'G44.2',
    skdi: '4A',
    kategori: 'saraf',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Kepala saya pegal berat dok, kayak diikat kencang di sekeliling kepala.',
    demografi: { usiaMin: 20, usiaMax: 50 },
    vital: { td: '120/80', nadi: 78, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Coba ceritakan, sakit kepalanya seperti apa rasanya?',
        jawab: 'Kepala rasanya berat dan pegal dok, seperti ada tali diikat kencang melingkari kepala.',
        variasi: {
          polos: 'Sirahé abot lan cengeng dok, kaya diubetké tali kenceng.',
          terpelajar: 'Nyeri kepala di kedua sisi dok, rasanya menekan seperti diikat, tidak berdenyut.',
          cemas: 'Kepala saya berat terus dok, saya takut ini gejala tumor atau stroke.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa lama dan kapan biasanya muncul?',
        jawab: 'Sudah sering dok, hampir tiap sore sepulang kerja, apalagi kalau lagi banyak pikiran.',
        esensial: true,
        oldcarts: ['onset', 'durasi', 'waktu'],
      },
      {
        id: 'q_denyut',
        kategori: 'rps',
        tanya: 'Nyerinya berdenyut cut-cut-an, atau lebih ke rasa menekan?',
        jawab: 'Menekan dok, tumpul. Nggak berdenyut kayak mau meletus.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_penyerta',
        kategori: 'rps',
        tanya: 'Ada mual, muntah, atau silau saat sakit kepala?',
        jawab: 'Nggak ada dok, cuma pegal saja. Masih bisa kerja walau nggak nyaman.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_redflag',
        kategori: 'rps',
        tanya: 'Pernah nyeri kepala hebat mendadak seperti disambar, atau disertai lemah separuh badan / pandangan ganda?',
        jawab: 'Nggak pernah dok, nggak ada yang lemas atau kabur. Kekuatannya sama.',
        esensial: true,
        oldcarts: ['keparahan', 'penyerta'],
      },
      {
        id: 'q_stres',
        kategori: 'sosial',
        tanya: 'Akhir-akhir ini banyak tekanan pekerjaan atau kurang tidur?',
        jawab: 'Iya banget dok, lagi banyak deadline dan sering begadang, tidur cuma 4-5 jam.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_obat',
        kategori: 'rpd',
        tanya: 'Sudah minum obat apa untuk keluhan ini? Seberapa sering?',
        jawab: 'Kadang beli paracetamol di warung dok, agak enakan tapi balik lagi.',
      },
      {
        id: 'q_kopi',
        kategori: 'sosial',
        tanya: 'Suka minum kopi berapa gelas sehari?',
        jawab: 'Dua-tiga gelas dok, kadang lebih kalau lembur.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Compos mentis, tampak lelah tetapi tidak sakit berat. Tanda vital normal.', relevan: true },
      { region: 'neurologis', temuan: 'Pemeriksaan neurologis normal: pupil isokor, refleks fisiologis simetris, kekuatan motorik 5/5 keempat ekstremitas, tidak ada defisit fokal, kaku kuduk (-).', relevan: true },
      { region: 'kepala_leher', temuan: 'Nyeri tekan otot perikranial dan trapezius (+), terutama regio oksipital dan bahu. Palpasi mencetuskan keluhan.', relevan: true },
      { region: 'mata', temuan: 'Funduskopi kasar: papil batas tegas, tidak ada edema papil. Gerak bola mata baik.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-).', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['G44.2', 'G43.9', 'G44.0'],
    tatalaksana: {
      obatBenar: [],
      // Analgetik simtomatik setara — beri SALAH SATU (parasetamol ATAU NSAID),
      // bukan keduanya sekaligus; TTH episodik cukup analgetik tunggal.
      obatAlternatif: [['paracetamol_500', 'ibuprofen_400']],
      obatSalahUmum: [
        { id: 'amitriptilin_25', alasan: 'Amitriptilin adalah profilaksis untuk TTH KRONIK (>15 hari/bulan); pada TTH episodik cukup analgetik simtomatik + manajemen stres, jangan langsung antidepresan.', bahaya: 'nonPrimer' },
        { id: 'tramadol_50', alasan: 'Opioid tidak diindikasikan pada TTH — berisiko ketergantungan dan medication-overuse headache; berlebihan untuk nyeri kepala primer ringan.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['manajemen_stres', 'higiene_tidur', 'postur_ergonomi', 'peregangan_sendi'],
    },
    clue: 'TTH: nyeri bilateral, kualitas MENEKAN/diikat (bukan berdenyut), TANPA mual/fotofobia, pemeriksaan neurologis NORMAL. Cukup analgetik + manajemen stres + perbaikan tidur/postur. TIDAK ada indikasi CT-scan tanpa red flag (SNNOOP10) — neuroimaging pada TTH tipikal justru pemborosan (PPK PERDOSSI).',
    panduanResmi: 'Di luar isu imaging, PPK 1186/2022 menekankan skrining kecemasan/depresi penyerta (diobati antidepresan Amitriptilin) dan membatasi analgesik kombinasi kafein/sedatif maksimal 2 hari/minggu dengan pengawasan dokter — sisi manajemen yang tak disorot clue.',
    konsekuensi: {
      narasi: 'Bila pemicu (stres, kurang tidur, postur) tidak dikelola atau pasien terlalu sering minum analgetik, keluhan menetap dan dapat berkembang menjadi medication-overuse headache.',
      kembaliHariMin: 14,
      kembaliHariMax: 30,
      kondisiKembali: 'Pasien kembali dengan nyeri kepala hampir tiap hari dan riwayat minum analgetik hampir setiap hari — curiga medication-overuse headache.',
      guideline: 'PPK PERDOSSI Nyeri Kepala Tipe Tegang — analgetik + non-farmakologi, imaging hanya bila red flag.',
    },
  },

  /* ======================================================================
   * 2. Migrain (tanpa aura) — SARAF 4A sedang
   * Poin ajar: nyeri unilateral berdenyut + mual/fotofobia + fonofobia; NSAID/
   * paracetamol saat serangan, istirahat di ruang gelap. Profilaksis bila sering.
   * ==================================================================== */
  {
    id: 'saraf_migrain',
    nama: 'Migrain Tanpa Aura',
    icd10: 'G43.0',
    skdi: '4A',
    kategori: 'saraf',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Kepala sebelah saya berdenyut hebat dok, sampai mual dan silau lihat cahaya.',
    demografi: { usiaMin: 18, usiaMax: 45, jenisKelamin: 'P' },
    vital: { td: '118/76', nadi: 84, rr: 18, suhu: 36.7, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Sakit kepalanya di sebelah mana dan seperti apa?',
        jawab: 'Sebelah kanan dok, berdenyut cut-cut kencang, kadang pindah ke kiri di lain waktu.',
        variasi: {
          polos: 'Sirah sisih tengen dok, cenat-cenut kaya dithuthuk terus.',
          terpelajar: 'Nyeri kepala di satu sisi dan berdenyut dok, cukup berat, dan makin parah kalau saya beraktivitas.',
          cemas: 'Sakitnya luar biasa dok sebelah kepala, sampai saya nggak bisa ngapa-ngapain.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_penyerta',
        kategori: 'keluhan_utama',
        tanya: 'Saat serangan ada mual, muntah, atau silau/terganggu suara?',
        jawab: 'Iya dok, mual sampai muntah kadang, dan saya harus matikan lampu karena silau, suara berisik bikin makin sakit.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_durasi',
        kategori: 'rps',
        tanya: 'Sekali serangan biasanya berapa lama? Sering kambuh?',
        jawab: 'Bisa setengah hari sampai sehari dok. Sebulan bisa 3-4 kali.',
        esensial: true,
        oldcarts: ['durasi', 'waktu'],
      },
      {
        id: 'q_aura',
        kategori: 'rps',
        tanya: 'Sebelum sakit kepala, ada melihat kilatan cahaya atau kesemutan lebih dulu?',
        jawab: 'Nggak ada dok, langsung sakit kepalanya saja tanpa tanda-tanda dulu.',
        esensial: true,
        oldcarts: ['onset'],
      },
      {
        id: 'q_pemicu',
        kategori: 'sosial',
        tanya: 'Ada pencetus yang Anda kenali? Kurang tidur, telat makan, atau menjelang haid?',
        jawab: 'Sering muncul menjelang haid dok, dan kalau kurang tidur atau kena panas terik.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_redflag',
        kategori: 'rps',
        tanya: 'Pola sakit kepalanya berubah drastis akhir-akhir ini, atau ada lemah separuh badan/demam tinggi/kaku leher?',
        jawab: 'Nggak dok, polanya sama seperti dulu, cuma memang mengganggu. Nggak ada yang lemas.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada yang sering migrain juga?',
        jawab: 'Ibu saya dulu juga sering sakit kepala sebelah dok.',
      },
      {
        id: "q_alergi",
        kategori: 'rpd',
        tanya: "Ada riwayat alergi obat, terutama obat antinyeri?",
        jawab: "Tidak ada dok, obat nyeri biasa aman-aman saja.",
        esensial: true,
      },
      {
        id: 'q_makanan_kesukaan',
        kategori: 'sosial',
        tanya: 'Makanan kesukaannya apa?',
        jawab: 'Suka bakso sama mie ayam dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak kesakitan, ingin di ruang redup. Tanda vital dalam batas normal.', relevan: true },
      { region: 'neurologis', temuan: 'Neurologis normal di luar/di antara serangan: tidak ada defisit fokal, kekuatan 5/5, refleks simetris, tidak ada tanda rangsang meningeal.', relevan: true },
      { region: 'mata', temuan: 'Funduskopi: papil normal, tidak ada edema papil. Visus normal, tidak ada defek lapang pandang.', relevan: true },
      { region: 'kepala_leher', temuan: 'Tidak ada nyeri tekan sinus, tidak ada nyeri tekan arteri temporal.', relevan: false },
      { region: 'toraks_paru', temuan: 'Dalam batas normal.', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['G43.0', 'G44.2', 'G43.1'],
    tatalaksana: {
      obatBenar: ['ibuprofen_400', 'ondansetron_4'],
      obatSalahUmum: [
        { id: 'tramadol_50', alasan: 'Opioid tidak dianjurkan untuk migrain akut — memicu medication-overuse headache dan menyamarkan pola nyeri; NSAID/parasetamol adalah lini pertama.', bahaya: 'nonPrimer' },
        { id: 'amoxicillin_500', alasan: 'Migrain bukan infeksi; antibiotik sama sekali tidak berperan.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['hindari_pencetus_migrain', 'higiene_tidur', 'manajemen_stres', 'kontrol_rutin'],
    },
    clue: 'Migrain tanpa aura (kriteria ICHD-3): nyeri unilateral + berdenyut + intensitas sedang-berat + diperberat aktivitas, disertai mual/muntah ATAU foto+fonofobia; neurologis normal. Terapi serangan: NSAID/parasetamol + antiemetik + istirahat ruang gelap. Bila ≥4 serangan/bulan pertimbangkan profilaksis (mis. amitriptilin/propranolol). Edukasi hindari pencetus migrain: kurang tidur, telat makan, stres, pencetus haid.',
    panduanResmi: 'Game memakai ondansetron, tetapi PPK 1186/2022 memilih antiemetik metoklopramid/domperidon (dapat diberikan sejak fase prodromal). Pada tabel analgesik PPK, kombinasi aspirin 600–900 mg + metoklopramid ber-NNT terbaik (3,2), mengungguli parasetamol (5,2) dan ibuprofen (7,5).',
    konsekuensi: {
      narasi: 'Bila pencetus tidak dikenali dan pasien mengandalkan analgetik berlebihan, serangan makin sering dan berisiko kronis; opioid memperburuk siklus nyeri.',
      kembaliHariMin: 20,
      kembaliHariMax: 40,
      kondisiKembali: 'Pasien kembali dengan frekuensi migrain meningkat menjadi hampir tiap minggu dan mulai bergantung pada obat pereda.',
      guideline: 'PPK PERDOSSI Migrain / ICHD-3 — terapi serangan + profilaksis bila frekuen, hindari opioid.',
    },
  },

  /* ======================================================================
   * 3. Vertigo BPPV — SARAF/THT 4A sedang
   * Poin ajar: vertigo posisional singkat dipicu perubahan posisi kepala; Dix-Hallpike
   * (+) → MANUVER EPLEY (reposisi kanalit). Betahistin simtomatik pendukung.
   * ==================================================================== */
  {
    id: 'saraf_vertigo_bppv',
    nama: 'Vertigo Posisional Paroksismal Jinak (BPPV)',
    icd10: 'H81.1',
    skdi: '4A',
    kategori: 'saraf',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Kepala saya muter-muter dok, terutama pas bangun tidur atau nengok ke samping.',
    demografi: { usiaMin: 40, usiaMax: 65 },
    vital: { td: '128/82', nadi: 80, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Pusingnya seperti apa? Berputar, atau melayang mau pingsan?',
        jawab: 'Berputar dok, seperti kamar ikut muter, sampai saya harus pegangan biar nggak jatuh.',
        variasi: {
          polos: 'Mumet mubeng dok, kamaré kaya melu muter, kudu nyekeli tembok.',
          terpelajar: 'Pusing berputar dok, rasanya sekeliling saya berputar, sampai serasa mau jatuh.',
          lansia: 'Puyeng muter Nak, kalau gerak kepala langsung nggliyeng, takut jatuh saya.',
        },
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_pemicu',
        kategori: 'keluhan_utama',
        tanya: 'Munculnya kapan? Apakah dipicu perubahan posisi kepala?',
        jawab: 'Iya dok, pas bangun tidur, membalik badan di kasur, atau menengadah ke atas langsung muter.',
        esensial: true,
        oldcarts: ['agravasi', 'waktu'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sekali serangan pusing berputar itu berlangsung berapa lama?',
        jawab: 'Cuma sebentar dok, kurang dari semenit, terus reda kalau saya diam. Tapi muncul lagi kalau gerak.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_telinga',
        kategori: 'rps',
        tanya: 'Ada telinga berdenging, terasa penuh, atau pendengaran menurun?',
        jawab: 'Nggak ada dok, telinga biasa saja, dengar masih jelas.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_neuro',
        kategori: 'rps',
        tanya: 'Ada lemah separuh badan, bicara pelo, kesemutan wajah, atau pandangan ganda?',
        jawab: 'Nggak ada dok, cuma pusing berputarnya saja. Tangan-kaki normal.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_mual',
        kategori: 'rps',
        tanya: 'Disertai mual atau muntah saat pusing?',
        jawab: 'Mual dok, kadang sampai muntah kalau muternya hebat.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah begini sebelumnya, atau ada riwayat darah tinggi/kencing manis?',
        jawab: 'Setahun lalu pernah sekali dok lalu sembuh. Darah tinggi terkontrol.',
      },
      {
        id: 'q_hp',
        kategori: 'sosial',
        tanya: 'Sering main HP sambil rebahan ya?',
        jawab: 'Lumayan dok, sebelum tidur suka scroll HP.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'neurologis', temuan: 'Manuver Dix-Hallpike ke kanan: setelah latensi singkat muncul nistagmus torsional-upbeating disertai vertigo hebat, fatigable (mereda dalam <60 detik). Sisi kiri negatif.', relevan: true },
      { region: 'neurologis', temuan: 'Pemeriksaan neurologis lain normal: tidak ada defisit fokal, koordinasi (tes tunjuk hidung) baik, Romberg tidak jatuh ke satu sisi konsisten, nervus kranialis intak.', relevan: true },
      { region: 'tht_mulut', temuan: 'Membran timpani intak kedua telinga, tes penala (Rinne/Weber) normal — tidak ada gangguan pendengaran.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler; tidak ada hipotensi ortostatik bermakna saat dites.', relevan: false },
      { region: 'umum', temuan: 'Compos mentis, tampak cemas menghindari gerakan kepala.', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['H81.1', 'H81.0', 'H81.3'],
    tatalaksana: {
      obatBenar: [],
      obatOpsional: ['betahistin_6'],
      obatSalahUmum: [
        { id: 'flunarizin_5', alasan: 'Flunarizin lebih untuk profilaksis migren/vertigo vestibular sentral; pada BPPV terapi utamanya MANUVER REPOSISI (Epley), bukan mengandalkan obat penekan vestibular jangka panjang.', bahaya: 'nonPrimer' },
        { id: 'amoxicillin_500', alasan: 'BPPV bukan infeksi telinga — antibiotik tidak berperan sama sekali.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['manuver_epley'],
      edukasi: ['latihan_bppv', 'tanda_bahaya'],
    },
    clue: 'BPPV: vertigo rotatorik SINGKAT (<1 menit) dipicu perubahan posisi kepala, tanpa gejala telinga atau defisit neurologis. Dix-Hallpike dengan nistagmus torsional-upbeating yang berlatensi dan fatigable mendukung kanal posterior. Tata laksana utama adalah manuver reposisi kanalit (Epley); obat vestibular tidak boleh menggantikan manuver dan tidak diberikan rutin jangka panjang.',
    panduanResmi: 'PPK Dokter FKTP KMK 1186/2022 bab Vertigo mengakui BPPV sebagai kompetensi 4A dan memuat manuver Epley/Brandt-Daroff. AAO-HNSF BPPV guideline yang masih aktif menekankan reposisi kanalit serta mengurangi penggunaan rutin obat penekan vestibular dan pencitraan pada presentasi tipikal.',
    konsekuensi: {
      narasi: 'Bila hanya diberi obat tanpa manuver reposisi, vertigo berulang mengganggu aktivitas dan meningkatkan risiko jatuh, terutama pada pasien usia lanjut.',
      kembaliHariMin: 5,
      kembaliHariMax: 14,
      kondisiKembali: 'Pasien kembali dengan vertigo posisional yang masih kambuh dan mengeluh sempat hampir terjatuh di kamar mandi.',
      guideline: 'PPK PERDOSSI / AAO-HNS BPPV — manuver reposisi kanalit (Epley) sebagai terapi lini pertama.',
    },
  },

  /* ======================================================================
   * 4. Bell's Palsy — SARAF 4A rendah
   * Poin ajar: parese N.VII perifer (dahi IKUT lumpuh) akut → kortikosteroid dini
   * (<72 jam) + proteksi kornea. Bedakan dari stroke (dahi terhindar = sentral).
   * ==================================================================== */
  {
    id: 'saraf_bells_palsy',
    nama: "Bell's Palsy (Parese Nervus Fasialis Perifer)",
    icd10: 'G51.0',
    skdi: '4A',
    kategori: 'saraf',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'rendah',
    keluhanUtama: 'Wajah saya sebelah kiri tiba-tiba mencong dok, mulut miring dan mata susah dipejamkan.',
    demografi: { usiaMin: 25, usiaMax: 55 },
    vital: { td: '124/80', nadi: 80, rr: 18, suhu: 36.7, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Sejak kapan wajahnya mencong dan bagaimana mulainya?',
        jawab: 'Sejak bangun tidur pagi tadi dok, tiba-tiba mulut miring ke kanan, yang kiri nggak bisa digerakkan.',
        variasi: {
          polos: 'Mulai esuk mau tangi turu dok, cangkemé mléngsé, sing kiwa ora iso obah.',
          terpelajar: 'Muncul mendadak pagi ini dok, wajah sisi kiri lemah, sudut mulut turun, dan mata sulit menutup.',
          cemas: 'Wajah saya mencong mendadak dok, saya takut ini stroke, tolong dok.',
        },
        esensial: true,
        oldcarts: ['onset', 'lokasi'],
      },
      {
        id: 'q_mata',
        kategori: 'rps',
        tanya: 'Mata sisi itu bisa menutup rapat? Ada rasa kering atau mengganjal?',
        jawab: 'Mata kiri nggak bisa menutup penuh dok, jadi terasa kering dan perih.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_anggota',
        kategori: 'rps',
        tanya: 'Ada kelemahan pada tangan atau kaki, bicara pelo, atau kesulitan menelan?',
        jawab: 'Nggak ada dok, tangan dan kaki normal, ngomong jelas, menelan biasa.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_penyerta',
        kategori: 'rps',
        tanya: 'Ada nyeri di belakang telinga, rasa kecap berkurang, atau suara terdengar lebih keras?',
        jawab: 'Sehari sebelumnya belakang telinga kiri sempat nyeri dok, dan lidah depan agak hambar.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_vesikel',
        kategori: 'rpd',
        tanya: 'Ada lenting/bintil berair di telinga atau sekitar mulut?',
        jawab: 'Nggak ada dok, tidak ada bintil berair.',
      },
      {
        id: 'q_musik',
        kategori: 'sosial',
        tanya: 'Suka dengar musik keras pakai earphone?',
        jawab: 'Kadang dok kalau di jalan.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'neurologis', temuan: 'Parese N.VII sinistra tipe PERIFER (LMN): lipatan dahi kiri hilang, tidak dapat mengangkat alis kiri, lagoftalmus kiri dengan tanda Bell (+), sudut mulut tertarik ke kanan. Derajat House-Brackmann IV.', relevan: true },
      { region: 'neurologis', temuan: 'Nervus kranialis lain intak, kekuatan motorik ekstremitas 5/5 simetris, tidak ada defisit fokal lain, tidak ada tanda rangsang meningeal.', relevan: true },
      { region: 'tht_mulut', temuan: 'Liang telinga & membran timpani kiri tenang, TIDAK ada vesikel (menyingkirkan Ramsay Hunt). Nyeri retroaurikula ringan.', relevan: true },
      { region: 'mata', temuan: 'Kornea kiri masih jernih namun konjungtiva mulai kering akibat lagoftalmus; refleks pupil normal.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler.', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['G51.0', 'B02.2', 'I63.9'],
    tatalaksana: {
      obatBenar: ['prednison_5', 'air_mata_buatan'],
      obatSalahUmum: [
        { id: 'asiklovir_400', alasan: 'Antivirus SENDIRIAN tidak dianjurkan pada Bell\'s palsy tanpa bukti herpes zoster; manfaat utama dari kortikosteroid dini. Antivirus hanya kombinasi pada kasus berat/Ramsay Hunt.', bahaya: 'nonPrimer' },
        { id: 'amoxicillin_500', alasan: 'Bell\'s palsy bukan infeksi bakteri — antibiotik tidak berperan.', bahaya: 'nonPrimer' },
      ],
      // M10.c (dossier §47): kompres_mata (hangat, hordeolum) off-target —
      // clue WAJIB "proteksi kornea: air mata buatan + tutup mata saat tidur"
      // (mata tak bisa menutup pd Bell's). Diganti proteksi_kornea.
      edukasi: ['kepatuhan_obat', 'proteksi_kornea', 'kontrol_rutin'],
    },
    clue: 'Bell\'s palsy = parese N.VII PERIFER akut: DAHI IKUT LUMPUH (bedakan dari stroke/sentral yang dahinya terhindar karena persarafan bilateral). Kortikosteroid dini (prednison, mulai <72 jam) memperbaiki prognosis. WAJIB proteksi kornea: air mata buatan + tutup mata saat tidur karena mata tak bisa menutup. Skrining vesikel (Ramsay Hunt) & tanda sentral (PPK PERDOSSI/AAN).',
    panduanResmi: 'PPK 1186/2022 memerinci regimen resmi: prednison 1 mg/kgBB atau 60 mg/hari selama 6 hari lalu tapering hingga total 10 hari, dimulai pada fase awal 1-4 hari. PPK juga membolehkan menambah asiklovir 400 mg 5×/hari — antiviral yang tak disinggung clue.',
    konsekuensi: {
      narasi: 'Bila kortikosteroid terlambat dimulai, pemulihan bisa tak sempurna; bila proteksi kornea diabaikan, mata yang tak menutup berisiko keratitis paparan hingga ulkus kornea.',
      kembaliHariMin: 5,
      kembaliHariMax: 14,
      kondisiKembali: 'Pasien kembali dengan mata kiri merah, perih, dan berair akibat kekeringan kornea karena tidak memakai pelindung/air mata buatan.',
      guideline: 'PPK PERDOSSI / AAN — kortikosteroid dini + proteksi kornea pada Bell\'s palsy.',
    },
  },

  /* ======================================================================
   * 5. Epilepsi (Bangkitan) — SARAF 3A, WAJIB RUJUK saraf, rendah
   * Poin ajar: bangkitan berulang tak beralasan → butuh EEG + OAE jangka panjang oleh
   * spesialis saraf. FKTP: stabilisasi (diazepam bila status), edukasi, RUJUK.
   * ==================================================================== */
  {
    id: 'saraf_epilepsi_kejang',
    nama: 'Epilepsi Dewasa (Bangkitan Tonik-Klonik Berulang)',
    icd10: 'G40.9',
    skdi: '3A',
    kategori: 'saraf',
    fktp144: false,
    harusDirujuk: true,
    // CODEX-25 #4: epilepsi kelompok PRB — regimen antiepilepsi ditegakkan
    // spesialis, maintenance kembali ke FKTP (rujuk balik SAH).
    bisaPrb: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'saraf',
    keluhanUtama: 'Saudara saya kejang lagi, Dok. Ini sudah yang ketiga kali dalam dua bulan; seluruh badan kaku lalu kelojotan.',
    keluhanUtamaOlehPendamping: true,
    demografi: { usiaMin: 18, usiaMax: 30 },
    vital: { td: '116/74', nadi: 92, rr: 20, suhu: 36.8, spo2: 98 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Coba ceritakan bagaimana kejangnya dari awal sampai selesai.',
        jawab: 'Tiba-tiba dia jatuh, badannya kaku lalu kelojotan seluruh tubuh sekitar dua menit, mulut berbusa, dan ngompol.',
        variasi: {
          wali_anak: 'Mendadak saudara saya kaku lalu kejang-kejang seluruh badan, Dok, sekitar dua menit; setelah itu tidur lama dan bingung.',
          polos: 'Dumadakan kaku terus kelojotan sak awak dok, cangkemé mbrabak, banjur turu.',
          terpelajar: 'Kejang seluruh tubuh dok, kaku lalu mengejang sekitar dua menit, setelahnya bingung lalu tertidur.',
        },
        esensial: true,
        oldcarts: ['karakter', 'durasi'],
      },
      {
        id: 'q_frekuensi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa kali kejang seperti ini, dan sejak kapan?',
        jawab: 'Ini yang ketiga dalam dua bulan dok, yang pertama sekitar delapan minggu lalu.',
        esensial: true,
        oldcarts: ['onset', 'waktu'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Saat kejang, apakah tubuh sedang demam tinggi?',
        jawab: 'Nggak demam dok, badannya normal, kejangnya muncul begitu saja.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_postiktal',
        kategori: 'rps',
        tanya: 'Setelah kejang berhenti bagaimana? Langsung sadar atau bingung/tidur?',
        jawab: 'Bingung dan mengantuk berat dok, tidur sekitar sejam, bangun-bangun nggak ingat kejadiannya.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_pencetus',
        kategori: 'rps',
        tanya: 'Ada trauma kepala, kurang tidur, atau lupa hal-hal sebelum kejang?',
        jawab: 'Belakangan sering begadang belajar dok. Nggak ada benturan kepala.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Ada riwayat kejang saat kecil, trauma lahir, atau radang otak?',
        jawab: 'Waktu bayi pernah kejang saat panas tinggi dok, lalu tidak pernah lagi sampai sekarang.',
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada yang punya riwayat epilepsi/ayan?',
        jawab: 'Sepupu dari pihak ayah katanya ada yang ayan dok.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'neurologis', temuan: 'Di luar bangkitan: kesadaran compos mentis, tidak ada defisit fokal, kekuatan motorik 5/5, refleks fisiologis simetris, tidak ada tanda rangsang meningeal. Bekas gigitan lidah lateral (+).', relevan: true },
      { region: 'umum', temuan: 'Tampak lelah pasca-bangkitan, kooperatif. Tanda vital stabil, tidak demam.', relevan: true },
      { region: 'kulit', temuan: 'Tidak ada café-au-lait / stigmata neurokutan; ada lecet ringan akibat jatuh saat kejang.', relevan: true },
      { region: 'kepala_leher', temuan: 'Tidak ada jejas kepala bermakna, tidak ada kaku kuduk.', relevan: false },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-).', relevan: false },
    ],
    lab: [
      { id: 'gds', hasil: 'GDS 96 mg/dL — normal, menyingkirkan hipoglikemia sebagai penyebab bangkitan.', flag: 'normal', relevan: true },
      { id: 'elektrolit_serum', hasil: 'Natrium 139 mmol/L, kalium 4,2 mmol/L, dan kalsium 9,1 mg/dL — tidak menunjuk gangguan metabolik akut.', flag: 'normal', relevan: true },
      { id: 'darah_rutin', hasil: 'Dalam batas normal; tidak menunjuk infeksi akut.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['G40.9', 'R56.8', 'G40.3'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [
        { id: 'diazepam_rektal_10', alasan: 'Diazepam rektal tersedia untuk rescue saat bangkitan masih aktif sesuai protokol, bukan diberikan rutin setelah episode dua menit telah berhenti dan pasien kembali stabil.', bahaya: 'nonPrimer' },
        { id: 'karbamazepin_200', alasan: 'Pemilihan & titrasi OAE jangka panjang (mis. karbamazepin/valproat) adalah wewenang spesialis saraf setelah klasifikasi bangkitan + EEG; memulai OAE sendiri di FKTP tanpa penegakan tipe bangkitan tidak tepat. FKTP menstabilkan lalu MERUJUK.', bahaya: 'nonPrimer' },
        { id: 'haloperidol_5', alasan: 'Antipsikotik justru MENURUNKAN ambang kejang dan tidak diindikasikan; salah kaprah menganggap kejang sebagai gangguan perilaku.', bahaya: 'kontraindikasi' },
        { id: 'diazepam_2', alasan: 'Diazepam tablet oral tidak mengatasi bangkitan aktif dan tidak diindikasikan setelah episode singkat selesai. Rescue bangkitan berkepanjangan memakai rute cepat sesuai protokol, sambil menjaga jalan napas dan merujuk.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['kepatuhan_obat', 'tanda_bahaya', 'higiene_tidur', 'kontrol_rutin'],
    },
    clue: 'Bangkitan tanpa provokasi berulang (≥2 kali, jeda >24 jam) mendukung epilepsi, tetapi tipe onset harus diklasifikasikan dengan cermat. Episode terakhir sudah berhenti setelah dua menit, sehingga tidak memerlukan benzodiazepin rescue sekarang. Bila bangkitan masih aktif >5 menit atau berulang tanpa pulih sadar, berikan rescue sesuai protokol, jaga ABC, dan rujuk segera. Untuk pasien stabil ini, edukasi keselamatan dan rujuk ke spesialis saraf; jangan memulai obat anti-bangkitan rumatan tanpa klasifikasi dan rencana terapi.',
    panduanResmi: 'PNPK Epilepsi Dewasa 274/2026 menjadi acuan karena kasus dibatasi usia 18-30 tahun. Diagnosis dan terapi rumatan awal direncanakan melalui layanan spesialis; FKTP dapat melanjutkan pemantauan dan obat melalui rujuk balik. Diazepam enema 5/10 mg tercantum di Fornas FPKTP bila kejang, tetapi bukan jawaban wajib setelah bangkitan singkat telah berhenti.',
    catatanRealita: 'GDS dan elektrolit dasar membantu menyingkirkan pencetus akut. Pemeriksaan renal/hepar atau pemeriksaan tambahan dilakukan sesuai konteks dan ketersediaan jejaring, tetapi tidak boleh menunda rujukan pasien stabil untuk klasifikasi bangkitan dan rencana terapi. Archetype anak 12-17 tahun ditunda sampai authoring terpisah dengan PNPK Anak dan pilihan rute rescue yang sesuai usia.',
    konsekuensi: {
      narasi: 'Bila tidak dirujuk untuk diagnosis dan OAE yang tepat, bangkitan berulang berisiko cedera (jatuh, tenggelam, kecelakaan) dan bila memanjang menjadi status epileptikus yang mengancam jiwa.',
      kembaliHariMin: 7,
      kembaliHariMax: 21,
      kondisiKembali: 'Pasien kembali diantar keluarga karena kejang berulang lebih sering, salah satunya berlangsung lama (>5 menit) hingga perlu penanganan gawat darurat.',
      guideline: 'Kepmenkes HK.01.07/MENKES/274/2026 tentang PNPK Tata Laksana Epilepsi Dewasa.',
    },
  },

  /* ======================================================================
   * 6. Konjungtivitis Alergi — MATA 4A tinggi
   * Poin ajar: mata merah GATAL bilateral + sekret serosa berair + riwayat atopi;
   * antihistamin + air mata buatan + hindari alergen. BUKAN antibiotik, BUKAN steroid.
   * ==================================================================== */
  {
    id: 'mata_konjungtivitis_alergi',
    nama: 'Konjungtivitis Alergi',
    icd10: 'H10.1',
    skdi: '4A',
    kategori: 'mata',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Kedua mata saya merah dan gatal banget dok, berair terus, sudah beberapa hari kambuh-kambuhan.',
    demografi: { usiaMin: 10, usiaMax: 35 },
    vital: { td: '116/74', nadi: 76, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan matanya apa yang paling mengganggu?',
        jawab: 'Gatal dok, gatalnya sampai pengen dikucek terus, kedua mata merah dan berair.',
        variasi: {
          polos: 'Gatel banget dok mripaté loro-loroné, pengin dikucek terus, abang lan mbrebes.',
          terpelajar: 'Kedua mata terasa gatal sekali dok, merah, dan berair encer.',
          cemas: 'Merah dan gatal terus dok, saya khawatir ini infeksi menular yang parah.',
        },
        esensial: true,
        oldcarts: ['karakter', 'lokasi'],
      },
      {
        id: 'q_sekret',
        kategori: 'keluhan_utama',
        tanya: 'Kotorannya seperti apa? Kental kuning atau encer bening?',
        jawab: 'Encer bening berair dok, bukan kuning kental. Nggak lengket nutupin mata pagi hari.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_visus_nyeri',
        kategori: 'rps',
        tanya: 'Penglihatannya turun atau ada nyeri hebat/silau?',
        jawab: 'Nggak dok, lihat masih jelas, nggak nyeri berat, cuma gatal dan mengganjal.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_atopi',
        kategori: 'rpd',
        tanya: 'Ada riwayat bersin-bersin pagi hari, asma, atau eksim/biduran?',
        jawab: 'Iya dok, saya sering bersin-bersin pagi dan pilek alergi, ibu saya asma.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_pemicu',
        kategori: 'sosial',
        tanya: 'Kambuhnya saat kena apa? Debu, bulu hewan, atau musim tertentu?',
        jawab: 'Kalau bersih-bersih rumah berdebu atau dekat kucing tetangga langsung kambuh dok.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_bilateral',
        kategori: 'rps',
        tanya: 'Mengenai kedua mata bersamaan atau satu dulu?',
        jawab: 'Dua-duanya bareng dok, kanan-kiri sama gatalnya.',
        oldcarts: ['lokasi', 'onset'],
      },
      {
        id: 'q_lensa',
        kategori: 'rpd',
        tanya: 'Pakai lensa kontak atau ada riwayat kemasukan benda?',
        jawab: 'Nggak pakai lensa kontak dok, nggak ada yang masuk.',
      },
      {
        id: 'q_gadget',
        kategori: 'sosial',
        tanya: 'Berapa lama main HP atau komputer sehari?',
        jawab: 'Lumayan lama dok, kerja depan komputer.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'mata', temuan: 'Kedua mata: injeksi konjungtiva difus, konjungtiva tarsalis dengan gambaran cobblestone/papil halus, sekret serosa berair (+), edema palpebra ringan. Kornea jernih.', relevan: true },
      { region: 'mata', temuan: 'Visus 6/6 kedua mata (TIDAK turun), refleks pupil normal, tidak ada injeksi silier, tidak ada fotofobia berat.', relevan: true },
      { region: 'tht_mulut', temuan: 'Mukosa hidung pucat kebiruan dengan sekret serosa — rinitis alergi menyertai.', relevan: true },
      { region: 'umum', temuan: 'Tampak baik, sering mengucek mata. Tanda vital normal.', relevan: false },
      { region: 'kepala_leher', temuan: 'KGB preaurikular tidak membesar.', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['H10.1', 'H10.0', 'H10.9'],
    tatalaksana: {
      obatBenar: ['loratadin_10', 'air_mata_buatan'],
      obatSalahUmum: [
        { id: 'kloramfenikol_tetes_mata', alasan: 'Konjungtivitis ALERGI bukan infeksi bakteri — antibiotik topikal tidak berefek pada gatal/alergi dan bukan indikasi; kuncinya antihistamin + hindari alergen.', bahaya: 'nonPrimer' },
        { id: 'dexamethasone_05', alasan: 'Steroid tetes mata TIDAK boleh diresepkan sembarangan di FKTP untuk mata merah — risiko glaukoma steroid, katarak, dan memperparah bila ada herpes kornea.', bahaya: 'kontraindikasi' },
      ],
      // M10.c (dossier §47): kompres_mata = "Kompres HANGAT" (hordeolum),
      // bertentangan langsung dgn clue "kompres DINGIN" utk konjungtivitis
      // alergi (pola bug sama CHF/air). Diganti kompres_dingin_mata.
      edukasi: ['hindari_alergen', 'kompres_dingin_mata', 'cuci_tangan'],
    },
    clue: 'Konjungtivitis alergi: gejala DOMINAN GATAL, BILATERAL, sekret SEROSA berair (bukan mukopurulen), visus NORMAL, sering ada latar atopi/rinitis alergi. Terapi: antihistamin (oral/topikal) + air mata buatan + kompres dingin + HINDARI ALERGEN. Jangan beri antibiotik (bukan bakteri) atau steroid sembarangan (risiko glaukoma/katarak) — AAO PPP.',
    // M11.5 (2026-07-11): lapisan panduan RESMI Kemenkes, perintis field.
    // Divergensi terverifikasi ke sumber (docs/references/ppk1186/, entri 38):
    // PPK 1186/2022 utk konjungtivitis alergi = "Flumetolon tetes mata 2×/hari
    // selama 2 minggu" — flumetolon = kortikosteroid topikal ringan; jadi
    // pedoman resmi FKTP JUSTRU mengizinkan steroid, beda dari clue (AAO).
    panduanResmi: 'PPK Kemenkes 1186/2022 justru mencantumkan flumetolon (tetes mata STEROID ringan) 2×/hari selama 2 minggu sbg tata laksana resmi FKTP — berbeda dari kehati-hatian AAO di atas yang menghindari steroid. Kriteria rujukan resmi: bila timbul komplikasi kornea atau tak ada respons pengobatan.',
    konsekuensi: {
      narasi: 'Bila alergen tidak dihindari dan mata terus dikucek, terjadi kekambuhan berulang, iritasi kronik, dan risiko infeksi sekunder akibat garukan.',
      kembaliHariMin: 7,
      kembaliHariMax: 21,
      kondisiKembali: 'Pasien kembali dengan keluhan gatal berulang setiap terpapar debu/bulu hewan karena alergen di rumah belum dikendalikan.',
      guideline: 'AAO Preferred Practice Pattern Konjungtivitis — antihistamin + hindari alergen, hindari steroid rutin.',
    },
  },

  /* ======================================================================
   * 7. Hordeolum — MATA 4A sedang
   * Poin ajar: benjolan nyeri di tepi kelopak (infeksi kelenjar) → kompres HANGAT +
   * higiene kelopak; antibiotik topikal bila perlu. Jangan dipencet paksa.
   * ==================================================================== */
  {
    id: 'mata_hordeolum',
    nama: 'Hordeolum (Bintitan)',
    icd10: 'H00.0',
    skdi: '4A',
    kategori: 'mata',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Kelopak mata saya bengkak dan nyeri dok, ada benjolan kecil merah di pinggir kelopak.',
    demografi: { usiaMin: 10, usiaMax: 40 },
    vital: { td: '118/76', nadi: 78, rr: 18, suhu: 36.8, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Coba ceritakan benjolan di kelopaknya seperti apa?',
        jawab: 'Ada benjolan kecil merah di pinggir kelopak atas dok, nyeri kalau ditekan atau berkedip.',
        variasi: {
          polos: 'Ana bintit cilik abang neng pinggir tlapukan dok, loro yèn didemek.',
          terpelajar: 'Ada benjolan merah yang nyeri di tepi kelopak mata atas dok, sakit kalau ditekan.',
          cemas: 'Kelopak saya bengkak dan sakit dok, saya takut ini tumor mata.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_onset',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa lama muncul dan makin membesar?',
        jawab: 'Sekitar tiga hari dok, awalnya kecil sekarang makin bengkak dan nyeri.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_nyeri',
        kategori: 'rps',
        tanya: 'Nyerinya terlokalisir di benjolan, atau nyeri di dalam bola mata?',
        jawab: 'Di benjolannya dok, di pinggir kelopak. Bola matanya sendiri nggak sakit.',
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_visus',
        kategori: 'rps',
        tanya: 'Penglihatannya terganggu, atau ada nyeri hebat saat lihat cahaya?',
        jawab: 'Penglihatan normal dok, nggak silau, cuma kelopaknya yang mengganjal.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_higiene',
        kategori: 'sosial',
        tanya: 'Sering mengucek mata atau memakai riasan/maskara di mata?',
        jawab: 'Sering ngucek dok kalau ngantuk, dan kadang pakai eyeliner.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah bintitan sebelumnya? Ada ketombe di alis/kulit berminyak?',
        jawab: 'Pernah beberapa bulan lalu dok, kulit muka saya memang berminyak.',
      },
      {
        id: 'q_makan_telur',
        kategori: 'sosial',
        tanya: 'Menurut Anda, apa yang mungkin memicu benjolan di kelopak ini?',
        jawab: 'Saya sering mengucek mata, Dok. Kata orang bintitan karena mengintip; apa benar begitu?',
      },
    ],
    pemeriksaanFisik: [
      { region: 'mata', temuan: 'Benjolan eritematosa lunak nyeri tekan di margo palpebra superior dekat bulu mata (hordeolum eksternum), edema palpebra lokal, belum ada pustul yang pecah.', relevan: true },
      { region: 'mata', temuan: 'Konjungtiva bulbi tenang, kornea jernih, visus 6/6, pupil normal — bola mata tidak terlibat.', relevan: true },
      { region: 'umum', temuan: 'Tampak baik, tanda vital normal, tidak demam.', relevan: true },
      { region: 'kepala_leher', temuan: 'KGB preaurikular tidak membesar; tidak ada selulitis meluas ke pipi/orbita.', relevan: true },
      { region: 'kulit', temuan: 'Kulit wajah tampak berminyak, ada skuama halus di tepi kelopak (blefaritis ringan).', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['H00.0', 'H00.1', 'H01.0'],
    tatalaksana: {
      // M10 §49: terapi utama hordeolum = kompres hangat + higiene (edukasi);
      // antibiotik topikal OPSIONAL (clue: "antibiotik topikal opsional").
      // Dulu jadi satu-satunya obatBenar → mahasiswa yg konservatif-benar
      // (kompres saja) dapat rasioTerapi 0. Kini obatOpsional: boleh diberi
      // (tak dihukum) atau tidak (tak kehilangan slot).
      obatBenar: [],
      obatOpsional: ['kloramfenikol_tetes_mata'],
      obatSalahUmum: [
        { id: 'dexamethasone_05', alasan: 'Hordeolum adalah infeksi bakteri akut kelenjar kelopak — steroid tidak diindikasikan dan berisiko memperparah/menutupi infeksi.', bahaya: 'kontraindikasi' },
        { id: 'ciprofloxacin_500', alasan: 'Antibiotik oral sistemik berlebihan untuk hordeolum tanpa komplikasi; cukup kompres hangat + higiene ± antibiotik topikal. Oral hanya bila menjadi selulitis preseptal.', bahaya: 'nonPrimer' },
      ],
      // Audit tag-vs-penyakit 2026-08-04: kebersihan_kulit ber-tag [Kulit]
      // (badan/pakaian) diganti higiene_kelopak_mata — clue kasus ini eksplisit
      // "higiene kelopak", bukan kulit/pakaian. Topik ini SUDAH ada di katalog
      // (catalogExpansion.ts), cuma belum dipakai di sini.
      edukasi: ['kompres_mata', 'higiene_kelopak_mata', 'cuci_tangan'],
    },
    clue: 'Hordeolum (bintitan): benjolan NYERI di tepi kelopak, bola mata & visus NORMAL. Terapi utama: KOMPRES HANGAT 3-4x/hari + higiene kelopak; antibiotik topikal opsional. JANGAN dipencet/dipecah paksa (risiko sebar infeksi/selulitis). Bila jadi selulitis preseptal (demam, edema meluas, nyeri gerak bola mata) → antibiotik oral/rujuk (AAO).',
    panduanResmi: 'Divergensi: clue/AAO menilai antibiotik hanya OPSIONAL (hordeolum self-limiting). PPK 1186/2022 justru rutin memberi antibiotik topikal (salep oksitetrasiklin/kloramfenikol tiap 8 jam) DITAMBAH eritromisin oral 500 mg. Inti sama: kompres hangat 4-6x/hari, jangan dipencet.',
    konsekuensi: {
      narasi: 'Bila dipencet paksa dan higiene diabaikan, infeksi dapat menyebar menjadi selulitis preseptal/orbita yang memerlukan antibiotik sistemik atau rujukan.',
      kembaliHariMin: 4,
      kembaliHariMax: 10,
      kondisiKembali: 'Pasien kembali dengan kelopak makin bengkak, merah meluas ke pipi, dan mulai demam setelah memencet benjolan sendiri.',
      guideline: 'AAO / PPK Hordeolum — kompres hangat + higiene kelopak, hindari memencet.',
    },
  },

  /* ======================================================================
   * 8. Serumen Prop (Serumen Obturans) — THT 4A tinggi
   * Poin ajar: sumbatan serumen → EKSTRAKSI serumen; bila keras, lunakkan dulu dengan
   * karbogliserin/serumenolitik. Jangan asal congkel (risiko trauma liang/gendang).
   * ==================================================================== */
  {
    id: 'tht_serumen_prop',
    nama: 'Serumen Prop (Serumen Obturans)',
    icd10: 'H61.2',
    skdi: '4A',
    kategori: 'tht',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Telinga kanan saya terasa buntu dan pendengaran berkurang dok, apalagi habis kena air.',
    // M10 §49: TD 108/70 normal lintas band 8-60 (serumen prop segala usia) —
    // 120/78 sebelumnya di ambang pra-hipertensi utk ujung anak.
    demografi: { usiaMin: 8, usiaMax: 60 },
    vital: { td: '108/70', nadi: 76, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan telinganya apa? Sejak kapan?',
        jawab: 'Telinga kanan terasa penuh dan buntu dok, pendengaran seperti tertutup, sudah beberapa hari.',
        variasi: {
          polos: 'Kuping tengen mampet lan budheg dok, kaya ketutupan.',
          terpelajar: 'Telinga kanan terasa penuh dan pendengarannya menurun dok, seperti tersumbat.',
          lansia: 'Kupingé budheg Nak, suara jadi lirih, apa ini karena tua ya?',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_pemicu',
        kategori: 'keluhan_utama',
        tanya: 'Bertambah parah setelah apa? Kena air saat mandi/berenang?',
        jawab: 'Iya dok, setelah keramas kemarin makin buntu, kayak ada yang mengembang di dalam.',
        esensial: true,
        oldcarts: ['agravasi', 'onset'],
      },
      {
        id: 'q_nyeri_cairan',
        kategori: 'rps',
        tanya: 'Ada nyeri hebat, keluar cairan/nanah, atau demam?',
        jawab: 'Nggak nyeri berat dok, cuma gatal dan penuh. Nggak ada nanah, nggak demam.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kebiasaan',
        kategori: 'sosial',
        tanya: 'Sering membersihkan telinga pakai cotton bud atau benda lain?',
        jawab: 'Sering dok, hampir tiap habis mandi saya korek pakai cotton bud.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_denging',
        kategori: 'rps',
        tanya: 'Ada telinga berdenging atau pusing berputar?',
        jawab: 'Kadang berdenging dok, tapi nggak pusing berputar.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah gendang telinga bocor atau operasi telinga?',
        jawab: 'Nggak pernah dok, telinga sehat sebelumnya.',
      },
      {
        id: 'q_musik_earphone',
        kategori: 'sosial',
        tanya: 'Suka pakai earphone volume keras?',
        jawab: 'Kadang dok kalau dengar lagu.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'tht_mulut', temuan: 'Otoskopi telinga kanan: liang telinga terisi serumen padat kecoklatan yang menyumbat total (obturans), membran timpani TIDAK terlihat. Liang tidak edema, tidak ada sekret purulen.', relevan: true },
      { region: 'tht_mulut', temuan: 'Telinga kiri: liang bersih, membran timpani intak, refleks cahaya (+) — sebagai pembanding normal.', relevan: true },
      { region: 'umum', temuan: 'Tampak baik, tidak demam, tanda vital normal.', relevan: true },
      { region: 'kepala_leher', temuan: 'Tidak ada nyeri tekan mastoid, tidak ada pembesaran KGB.', relevan: true },
      { region: 'neurologis', temuan: 'Tidak ada kelumpuhan wajah, keseimbangan baik.', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['H61.2', 'H60.3', 'H65.9'],
    tatalaksana: {
      obatBenar: ['karbogliserin_tetes'],
      obatSalahUmum: [
        { id: 'kloramfenikol_tetes_mata', alasan: 'Salah sediaan/indikasi: serumen prop bukan infeksi. Bila serumen keras, gunakan serumenolitik (karbogliserin) untuk melunakkan, lalu ekstraksi — bukan antibiotik tetes.', bahaya: 'nonPrimer' },
        { id: 'amoxicillin_500', alasan: 'Tidak ada infeksi bakteri pada serumen prop tanpa komplikasi — antibiotik oral tidak diindikasikan.', bahaya: 'nonPrimer' },
      ],
      prosedur: ['ekstraksi_serumen'],
      // Audit tag-vs-penyakit 2026-08-04: kebersihan_kulit ber-tag [Kulit]
      // diganti stop_cotton_bud_telinga — clue eksplisit "STOP cotton bud",
      // poin ajar utama kasus ini, tak terwakili topik manapun sebelumnya.
      edukasi: ['stop_cotton_bud_telinga', 'tanda_bahaya'],
    },
    clue: 'Serumen prop: rasa penuh + tuli konduktif, membran timpani tertutup serumen. Tata laksana: EKSTRAKSI serumen (kuret/irigasi bila MT utuh); bila serumen KERAS lunakkan dulu dengan serumenolitik (karbogliserin) 3-5 hari lalu ekstraksi. JANGAN irigasi bila curiga perforasi/otitis. Edukasi STOP cotton bud (justru mendorong serumen makin dalam) — PPK PERHATI-KL.',
    panduanResmi: 'PPK 1186/2022 memerinci serumenolitik resmi: tetes telinga Karbogliserin 10% ATAU H2O2 3% selama 3 hari untuk melunakkan serumen keras sebelum ekstraksi; irigasi air hangat dikhususkan bila serumen sudah terdorong terlalu dalam. Rujuk bila timbul komplikasi tindakan.',
    konsekuensi: {
      narasi: 'Bila diekstraksi paksa saat masih keras atau dikorek cotton bud lebih dalam, dapat melukai liang telinga/membran timpani; bila dibiarkan, pendengaran tetap terganggu.',
      kembaliHariMin: 5,
      kembaliHariMax: 14,
      kondisiKembali: 'Pasien kembali dengan liang telinga lecet dan nyeri karena mengorek sendiri dengan cotton bud, serumen justru terdorong makin dalam.',
      guideline: 'PPK PERHATI-KL Serumen Prop — serumenolitik bila keras + ekstraksi, hindari cotton bud.',
    },
  },

  /* ======================================================================
   * 9. Epistaksis Anterior — THT 4A sedang
   * Poin ajar: perdarahan pleksus Kiesselbach (anterior) → tekan cuping hidung 10-15
   * menit posisi duduk menunduk; tampon anterior bila belum berhenti. Cari & atasi HT.
   * ==================================================================== */
  {
    id: 'tht_epistaksis_anterior',
    nama: 'Epistaksis Anterior',
    icd10: 'R04.0',
    skdi: '4A',
    kategori: 'tht',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Hidung saya mimisan dok, sudah keluar darah dari lubang kanan sejak setengah jam lalu belum berhenti.',
    // Usia dewasa dipertahankan karena komorbid hipertensi kronik merupakan
    // kebutuhan tindak lanjut. Hipertensi tidak dipresentasikan sebagai penyebab
    // tunggal atau sasaran hemostasis akut; pencetus langsungnya trauma digital.
    demografi: { usiaMin: 35, usiaMax: 55 },
    vital: { td: '150/90', nadi: 90, rr: 18, suhu: 36.7, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Mimisannya dari lubang mana dan sudah berapa lama?',
        jawab: 'Dari lubang kanan dok, mulai setengah jam lalu, netes-netes ke depan belum berhenti.',
        variasi: {
          polos: 'Mimisan seka bolongan tengen dok, wis setengah jam durung mandheg.',
          terpelajar: 'Darah keluar dari lubang hidung kanan dok, mengalir ke depan, sudah sekitar 30 menit.',
          cemas: 'Darahnya keluar terus dok, saya panik, ini bahaya nggak?',
        },
        esensial: true,
        oldcarts: ['lokasi', 'onset', 'durasi'],
      },
      {
        id: 'q_arah',
        kategori: 'keluhan_utama',
        tanya: 'Darahnya lebih banyak keluar ke depan hidung atau terasa mengalir ke tenggorokan?',
        jawab: 'Lebih banyak ke depan dok, netes dari lubang hidung. Tenggorokan agak terasa sedikit saja.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_pencetus',
        kategori: 'rps',
        tanya: 'Sebelum mimisan ada mengorek hidung, kena benturan, atau udara kering/panas?',
        jawab: 'Tadi saya bersihkan hidung agak keras dok karena kering, lalu keluar darah.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_darahtinggi',
        kategori: 'rpd',
        tanya: 'Ada riwayat darah tinggi? Rutin minum obatnya?',
        jawab: 'Ada dok, saya darah tinggi tapi obatnya sering putus karena lupa.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_perdarahan_lain',
        kategori: 'rpd',
        tanya: 'Sering lebam, gusi berdarah, atau minum obat pengencer darah?',
        jawab: 'Nggak dok, nggak minum pengencer, nggak gampang lebam.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_frekuensi',
        kategori: 'rps',
        tanya: 'Sering mimisan berulang, atau baru kali ini?',
        jawab: 'Kadang-kadang dok, biasanya berhenti sendiri, tapi kali ini agak lama.',
        oldcarts: ['waktu'],
      },
      {
        id: 'q_makan_pedas',
        kategori: 'sosial',
        tanya: 'Suka makan pedas ya?',
        jawab: 'Suka dok, sambal terus.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'tht_mulut', temuan: 'Rinoskopi anterior: tampak titik perdarahan aktif di area pleksus Kiesselbach (septum anterior) kavum nasi kanan; tidak tampak massa/tumor. Bagian posterior bersih.', relevan: true },
      { region: 'umum', temuan: 'Kompos mentis, tampak cemas namun hemodinamik stabil, tidak pucat berat, akral hangat.', relevan: true },
      { region: 'jantung', temuan: 'TD 150/90, nadi reguler; hipertensi kronik perlu ditindaklanjuti terpisah dan bukan pengganti kontrol perdarahan lokal.', relevan: true },
      { region: 'tht_mulut', temuan: 'Faring posterior: sedikit rembesan darah, tidak ada aliran deras dari nasofaring (menyingkirkan epistaksis posterior masif).', relevan: true },
      { region: 'kulit', temuan: 'Tidak ada petekie/ekimosis luas yang menunjukkan gangguan pembekuan.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Hb 13.6, trombosit 260.000/µL, leukosit normal — tidak ada anemia bermakna / trombositopenia.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['R04.0', 'I10', 'D69.9'],
    tatalaksana: {
      obatBenar: ['oksimetazolin_spray'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Epistaksis bukan infeksi; antibiotik tidak menghentikan perdarahan. (Antibiotik hanya relevan sebagai profilaksis bila tampon dipasang lama, bukan terapi utama.)', bahaya: 'nonPrimer' },
        { id: 'ibuprofen_400', alasan: 'NSAID mengganggu fungsi trombosit dan dapat memperpanjang perdarahan — hindari pada pasien epistaksis.', bahaya: 'kontraindikasi' },
      ],
      prosedur: ['kompresi_hidung'],
      prosedurOpsional: ['tampon_epistaksis'],
      edukasi: ['kepatuhan_obat', 'kontrol_rutin', 'tanda_bahaya'],
    },
    clue: 'Epistaksis anterior: dudukkan pasien condong ke depan lalu tekan bagian lunak hidung terus-menerus sedikitnya 5 menit, lazimnya 10–15 menit, tanpa sering melepas untuk memeriksa. Vasokonstriktor topikal dapat membantu; tampon anterior dipakai bila sumber tidak dapat dikendalikan dengan langkah awal. Hipertensi kronik dinilai dan diobati sebagai komorbid, tetapi penurunan TD bukan pengganti hemostasis lokal.',
    panduanResmi: 'PPK 1186/2022 tidak memiliki jalur epistaksis tersendiri. Floor FKTP adalah stabilitas hemodinamik, kompresi hidung yang benar, terapi lokal bertahap, dan rujuk bila masif, posterior, berulang unilateral, atau gagal dikendalikan. AAO-HNSF Nosebleed Guideline 2020 menempatkan kompresi berkelanjutan sebagai tindakan awal dan packing bila lokasi perdarahan tidak dapat diidentifikasi atau dikontrol.',
    observasi: {
      durasiMenit: 15,
      tujuan: 'Lepaskan kompresi hanya setelah interval penuh untuk menilai hemostasis dan stabilitas pasien.',
      parameter: [
        'perdarahan aktif dari kavum nasi anterior',
        'aliran darah ke faring posterior',
        'nadi, perfusi, dan gejala presinkop',
      ],
      hasilUlang: 'Setelah kompresi kontinu 15 menit dan vasokonstriktor topikal, perdarahan berhenti. Tidak ada aliran ke faring posterior, pasien stabil, dan instruksi pencegahan kekambuhan dapat diberikan.',
      disposisiSetelah: 'pulang',
    },
    konsekuensi: {
      narasi: 'Teknik penekanan yang salah atau kepala menengadah membuat darah tertelan dan menunda hemostasis; epistaksis masif berisiko aspirasi dan anemia. Hipertensi kronik tetap perlu kontrol tersendiri.',
      kembaliHariMin: 2,
      kembaliHariMax: 7,
      kondisiKembali: 'Pasien kembali dengan mimisan berulang setelah kembali mengorek mukosa yang kering; obat hipertensi juga masih sering putus dan perlu ditata ulang.',
      guideline: 'AAO-HNSF Nosebleed Guideline 2020 — kompresi langsung, terapi lokal bertahap, evaluasi faktor perdarahan, dan rujuk bila tak terkendali.',
    },
  },

  /* ======================================================================
   * 10. Rinosinusitis Akut — THT 4A sedang
   * Poin ajar: mayoritas VIRAL & self-limiting; antibiotik hanya bila kriteria
   * bakterial (>10 hari tak membaik / double-sickening / berat). Dekongestan + bilas.
   * ==================================================================== */
  {
    id: 'tht_rinosinusitis_akut',
    nama: 'Rinosinusitis Akut',
    icd10: 'J01.9',
    // M9.2 follow-up (2026-07-11): self-report '4A' keliru — PPK/SKDI 2012
    // Lampiran-3 "Sinusitis" = 3A (dossier §26/§32).
    skdi: '3A',
    kategori: 'tht',
    fktp144: false,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Hidung saya buntu berat dan wajah terasa nyeri/penuh di sekitar pipi dan dahi dok.',
    demografi: { usiaMin: 18, usiaMax: 50 },
    vital: { td: '120/78', nadi: 82, rr: 18, suhu: 37.8, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan utamanya apa? Hidung buntu, ingus, atau nyeri wajah?',
        jawab: 'Hidung buntu berat dok, ingus kental kehijauan, dan wajah terasa nyeri penuh di pipi dan dahi.',
        variasi: {
          polos: 'Irungé mampet nemen dok, umbelé kentel ijo, rai loro nyut-nyutan.',
          // M10 §49: warna ingus disamakan "kehijauan" dgn jawab baku + polos +
          // q_ingus (dulu "kekuningan" → kontradiksi warna dlm satu playthrough).
          terpelajar: 'Hidung tersumbat, ingus kental kehijauan, dan wajah nyeri kalau ditekan dok, terutama di pipi dan dahi.',
          cemas: 'Kepala dan wajah saya nyeri terus dok, sampai susah tidur, ini sinusitis parah ya?',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa hari? Sempat membaik lalu memburuk lagi?',
        jawab: 'Hampir dua minggu dok. Awalnya seperti pilek biasa, sudah agak enakan, lalu mendadak memberat lagi 3 hari terakhir.',
        esensial: true,
        oldcarts: ['onset', 'durasi', 'waktu'],
      },
      {
        id: 'q_nyeri_wajah',
        kategori: 'rps',
        tanya: 'Nyeri wajahnya bertambah saat menunduk?',
        jawab: 'Iya dok, kalau menunduk ambil sesuatu langsung terasa berat dan nyut-nyutan di pipi dan dahi.',
        esensial: true,
        oldcarts: ['agravasi', 'lokasi'],
      },
      {
        id: 'q_ingus',
        kategori: 'rps',
        tanya: 'Ingusnya warna apa? Ada bau atau menetes ke tenggorokan?',
        jawab: 'Kental kehijauan dok, kadang bau, dan sering menetes ke tenggorokan bikin batuk.',
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_penciuman',
        kategori: 'rps',
        tanya: 'Penciuman berkurang? Demam?',
        jawab: 'Penciuman menurun dok, susah mencium bau masakan. Demam sumer-sumer.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_gigi',
        kategori: 'rpd',
        tanya: 'Ada sakit gigi geraham atas atau riwayat alergi hidung?',
        jawab: 'Gigi geraham atas kanan memang agak ngilu dok, dan saya memang sering bersin alergi.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_redflag',
        kategori: 'rps',
        tanya: 'Ada bengkak/kemerahan sekitar mata, pandangan ganda, atau nyeri kepala hebat + kaku leher?',
        jawab: 'Nggak ada dok, mata normal, lihat jelas, leher nggak kaku.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_parfum',
        kategori: 'sosial',
        tanya: 'Suka pakai parfum menyengat ya?',
        jawab: 'Biasa saja dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'tht_mulut', temuan: 'Rinoskopi anterior: mukosa hidung edema dan hiperemis, sekret mukopurulen di meatus media (+) bilateral. Konka edema.', relevan: true },
      { region: 'kepala_leher', temuan: 'Nyeri tekan sinus maksilaris dan frontalis (+), bertambah saat membungkuk. Transiluminasi maksila redup.', relevan: true },
      { region: 'umum', temuan: 'Tampak sakit ringan-sedang, subfebris. Tanda vital lain normal.', relevan: true },
      { region: 'mata', temuan: 'Tidak ada proptosis, edema periorbita, atau gangguan gerak bola mata — menyingkirkan komplikasi orbita.', relevan: true },
      { region: 'tht_mulut', temuan: 'Faring: post-nasal drip (+); gigi molar atas kanan sensitif perkusi ringan.', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['J01.9', 'J00', 'J30.1'],
    tatalaksana: {
      obatBenar: ['amoxiclav_625', 'pseudoefedrin_30', 'paracetamol_500'],
      obatSalahUmum: [
        { id: 'ciprofloxacin_500', alasan: 'Fluorokuinolon bukan lini pertama rinosinusitis bakterial komunitas; amoksisilin(-klavulanat) yang diutamakan. Kuinolon dicadangkan untuk kasus khusus.', bahaya: 'nonPrimer' },
        { id: 'dexamethasone_05', alasan: 'Kortikosteroid oral sistemik tidak rutin diberikan pada rinosinusitis akut tanpa komplikasi; steroid INTRANASAL yang berperan, bukan steroid oral sembarangan.', bahaya: 'nonPrimer' },
      ],
      // M10.c (dossier §47): minum_air_cukup ber-identitas ISK ("jangan menahan
      // kencing") — off-target di kasus HIDUNG; diganti bilas_salin_hidung
      // (clue "bilas salin sebagai penunjang"). tanda_bahaya jadi edukasiKritis:
      // konsekuensi.narasi eksplisit komplikasi orbita/intrakranial "gawat" →
      // mengenali red flag = penentu keselamatan.
      edukasi: ['bilas_salin_hidung', 'etika_batuk', 'kontrol_rutin', 'tanda_bahaya'],
      edukasiKritis: ['tanda_bahaya'],
    },
    clue: 'Rinosinusitis akut MAYORITAS VIRAL & self-limiting. Curiga BAKTERIAL bila: gejala >10 hari tanpa perbaikan, ATAU "double sickening" (membaik lalu memburuk), ATAU berat (demam ≥39, nyeri wajah/ingus purulen berat) — baru beri antibiotik (amoksisilin ± klavulanat). Dekongestan + analgetik + bilas salin sebagai penunjang. Waspadai red flag komplikasi orbita/intrakranial → rujuk (EPOS/PPK PERHATI-KL).',
    panduanResmi: 'PPK 1186/2022 (EPOS) menambahkan KORTIKOSTEROID INTRANASAL sebagai langkah resmi — pada RSA pasca-viral (gejala >10 hari) dan bersama antibiotik pada RSA bakterial — yang tak disebut clue. Evaluasi bertahap: 10 hari (viral), 14 hari (pasca-viral), 48 jam (bakterial) sebelum rujuk THT.',
    konsekuensi: {
      narasi: 'Bila komplikasi orbita/intrakranial tidak dikenali (edema periorbita, gangguan visus, nyeri kepala hebat), infeksi dapat menyebar ke orbita atau otak — kondisi gawat.',
      kembaliHariMin: 3,
      kembaliHariMax: 10,
      kondisiKembali: 'Pasien kembali dengan bengkak dan kemerahan di sekitar mata serta demam tinggi — curiga selulitis orbita, perlu rujukan segera.',
      guideline: 'EPOS / PPK PERHATI-KL Rinosinusitis Akut — antibiotik hanya bila kriteria bakterial, kenali red flag komplikasi.',
    },
  },

  /* ======================================================================
   * 11. Glaukoma Akut (Sudut Tertutup) — MATA 3B, WAJIB RUJUK mata, rendah
   * Poin ajar: mata merah + NYERI HEBAT + VISUS TURUN + pupil MID-DILATASI/lonjong +
   * kornea keruh + mual = EMERGENSI OFTALMOLOGI → RUJUK SEGERA. JANGAN beri steroid;
   * JANGAN beri agen midriatik. Turunkan TIO pra-rujuk bila tersedia.
   * ==================================================================== */
  {
    id: 'mata_glaukoma_akut',
    nama: 'Glaukoma Akut Sudut Tertutup',
    icd10: 'H40.2',
    skdi: '3B',
    kategori: 'mata',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'mata',
    keluhanUtama: 'Mata kanan saya tiba-tiba nyeri hebat dok, merah, penglihatan mendadak buram, dan saya mual sampai muntah.',
    demografi: { usiaMin: 50, usiaMax: 70, jenisKelamin: 'P' },
    vital: { td: '140/85', nadi: 92, rr: 20, suhu: 36.8, spo2: 98 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Coba ceritakan, matanya kenapa dan sejak kapan?',
        jawab: 'Mata kanan saya mendadak sakit sekali dok sejak beberapa jam lalu, merah, dan penglihatan langsung buram berat.',
        variasi: {
          polos: 'Mripat tengen dumadakan lara nemen dok, abang, weruhé buram banget.',
          terpelajar: 'Muncul mendadak beberapa jam lalu dok: mata kanan nyeri hebat, merah, dan penglihatannya tiba-tiba menurun.',
          lansia: 'Aduh Nak, mata kanan saya sakit luar biasa mendadak, gelap tak bisa lihat, kepala ikut pusing dan mual.',
        },
        esensial: true,
        oldcarts: ['onset', 'lokasi', 'karakter'],
      },
      {
        id: 'q_visus',
        kategori: 'keluhan_utama',
        tanya: 'Penglihatannya menurun? Ada melihat lingkaran pelangi di sekitar lampu (halo)?',
        jawab: 'Turun drastis dok, buram berat, dan tadi sempat lihat pelangi mengelilingi lampu.',
        esensial: true,
        oldcarts: ['penyerta', 'keparahan'],
      },
      {
        id: 'q_nyeri',
        kategori: 'keluhan_utama',
        tanya: 'Seberapa hebat nyerinya, apakah menjalar ke kepala, dan adakah mual atau muntah?',
        jawab: 'Nyeri hebat sekali dok sampai ke kepala sisi kanan, dan saya sampai mual dan muntah.',
        esensial: true,
        oldcarts: ['keparahan', 'radiasi', 'penyerta'],
      },
      {
        id: 'q_pemicu',
        kategori: 'rps',
        tanya: 'Muncul saat apa? Di tempat gelap/nonton lama, atau setelah minum obat tertentu?',
        jawab: 'Tadi malam saya lama di ruangan remang menonton TV dok, tiba-tiba mata langsung sakit.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah keluhan serupa yang hilang timbul, atau sedang minum obat flu/antimabuk?',
        jawab: 'Beberapa kali sempat mata pegal dan buram sebentar lalu hilang dok. Kemarin saya minum obat flu warung.',
        oldcarts: ['waktu'],
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Ada keluarga dengan riwayat glaukoma atau kebutaan?',
        jawab: 'Kakak saya katanya kena glaukoma juga dok.',
      },
      {
        id: 'q_hobi',
        kategori: 'sosial',
        tanya: 'Suka berkebun ya, Bu?',
        jawab: 'Iya dok, tanaman di rumah banyak.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'mata', temuan: 'Mata kanan: injeksi konjungtiva + injeksi SILIER (mata merah), kornea EDEMA/keruh berkabut, bilik mata depan DANGKAL, pupil MID-DILATASI (±5 mm) lonjong dan REFLEKS CAHAYA menurun. Bola mata teraba KERAS seperti batu (TIO sangat tinggi).', relevan: true },
      { region: 'mata', temuan: 'Visus mata kanan turun drastis (hanya lambaian tangan / hitung jari jarak dekat). Mata kiri tenang, visus baik, bilik mata depan juga tampak dangkal (mata sesama berisiko).', relevan: true },
      { region: 'umum', temuan: 'Tampak kesakitan hebat, mual, muntah (+). Gejala sistemik ini sering menyesatkan ke arah keluhan pencernaan/migrain.', relevan: true },
      { region: 'neurologis', temuan: 'Tidak ada defisit fokal, tidak ada kaku kuduk — menyingkirkan penyebab neurologis sentral nyeri kepala/muntah.', relevan: true },
      { region: 'kepala_leher', temuan: 'Nyeri alih ke kepala sisi kanan mengikuti mata; sinus tidak nyeri tekan.', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['H40.2', 'H10.9', 'H16.9'],
    tatalaksana: {
      obatBenar: ['timolol_tetes_mata'],
      obatSalahUmum: [
        { id: 'dexamethasone_05', alasan: 'JEBAKAN KLASIK: mata merah TIDAK boleh otomatis diberi steroid. Pada glaukoma akut steroid tidak menurunkan TIO dan menunda rujukan; steroid keliru pada mata merah lain (herpes/ulkus) juga membahayakan penglihatan.', bahaya: 'kontraindikasi' },
        { id: 'kloramfenikol_tetes_mata', alasan: 'Ini BUKAN konjungtivitis: mata merah di sini disertai NYERI HEBAT + VISUS TURUN + pupil mid-dilatasi. Antibiotik tetes sama sekali tidak menangani tekanan bola mata yang tinggi — membuang waktu emas.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['tanda_bahaya', 'kontrol_rutin'],
    },
    clue: 'GLAUKOMA AKUT SUDUT TERTUTUP = EMERGENSI OFTALMOLOGI. Tetrad kunci: mata merah + NYERI HEBAT + VISUS TURUN mendadak + pupil MID-DILATASI/lonjong + kornea keruh + bola mata KERAS (± mual-muntah, halo pelangi). RUJUK SEGERA ke spesialis mata (ancaman kebutaan permanen dalam jam). JANGAN beri STEROID; JANGAN beri MIDRIATIK/atropin (memperparah). Turunkan TIO pra-rujuk bila tersedia (beta-blocker topikal seperti timolol; asetazolamid). Awas: mual-muntah bisa menyesatkan ke diagnosis GI (PPK PERDAMI/AAO).',
    panduanResmi: 'Divergensi kunci: clue/AAO tegas \'JANGAN beri steroid\', tetapi PPK 1186/2022 justru mencantumkan tetes mata kombinasi KORTIKOSTEROID + antibiotik (4-6x/hari) pada penanganan awal glaukoma akut, plus Asetazolamid 500 mg lalu 4x250 mg, Timolol 0,5%, KCl, & pembatasan cairan.',
    konsekuensi: {
      narasi: 'Bila salah didiagnosis sebagai mata merah biasa/gangguan lambung dan tidak dirujuk segera, tekanan intraokular yang sangat tinggi merusak saraf optik dalam hitungan jam hingga menyebabkan KEBUTAAN PERMANEN pada mata tersebut.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Pasien kembali dalam sehari dengan mata kanan yang praktis tidak bisa melihat lagi (kebutaan menetap) karena penanganan penurun tekanan bola mata terlambat.',
      guideline: 'PPK PERDAMI / AAO Glaukoma Akut Sudut Tertutup — rujuk emergensi, turunkan TIO, hindari steroid & midriatik.',
    },
  },
]
