import type { KasusKlinis } from '../types'
import type { LabArchetypeSpec } from './batch1'
import { buatKasusLab } from './labCaseFactory'

/**
 * M13 Batch 4 — tier RUJUK penyakit dalam (9 kasus).
 *
 * Inti pedagogis batch ini: kasus rujuk BUKAN "klik rujuk lalu selesai". Yang
 * dinilai = (a) mengenali tanda bahaya, (b) melakukan yang MEMANG bisa & wajib
 * dilakukan FKTP sebelum merujuk, (c) TIDAK melakukan yang di luar lingkup,
 * (d) merujuk ke spesialis yang benar.
 *
 * CATATAN GERBANG (keputusan orkestrator 2026-07-16): TIDAK ADA `konfirmasiWajib`
 * di file ini. Pada kasus `harusDirujuk: true`, gate konfirmasi laboratorium
 * menciptakan no-win — rujuk hari ini di-cap C (hasil belum keluar), menahan
 * pasien untuk menunggu hasil di-cap D (menahan kasus wajib-rujuk). CODEX
 * mencabut gate identik di batch3.ts:196-200. Poin "test before treat" pada
 * TB putus obat tetap bergigi lewat obatSalahUmum(oat_kdt) + clue.
 */

const PPK_FLOOR = 'PPK Dokter FKTP KMK 1186/2022 menjadi floor; terapi disesuaikan dengan pedoman yang lebih baru bila relevan.'

export const LAB_BATCH_4_DALAM_CASES: KasusKlinis[] = [
  /* ======================================================================
   * 1. Penyakit Ginjal Kronik Stadium 3b (N18.3, SKDI 2) — RUJUK penyakit dalam
   * Poin ajar: jebakan NSAID/jamu pegal pada ginjal yang sudah separuh hilang;
   *   kendali TD dengan penghambat RAS (renoprotektif) + stop nefrotoksik.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_penyakit_ginjal_kronik_st3b',
    nama: 'Penyakit Ginjal Kronik G3b dengan Komplikasi',
    icd10: 'N18.3',
    skdi: '2',
    kategori: 'metabolik',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'penyakit_dalam',
    keluhanUtama: 'Badan saya lemas terus dok, kaki bengkak, dan akhir-akhir ini sering mual.',
    demografi: { usiaMin: 50, usiaMax: 70 },
    vital: { td: '168/98', nadi: 88, rr: 20, suhu: 36.7, spo2: 98 },
    pembuka: {
      tanya: 'Lemas dan bengkaknya sejak kapan, dan bagian mana yang bengkak?',
      jawab: 'Sudah sekitar dua bulan makin lemas dok. Kaki bengkak mulai dari mata kaki, kalau ditekan cekung lama. Pagi agak kempes, menjelang sore bengkak lagi.',
      oldcarts: ['onset', 'durasi', 'lokasi', 'waktu'],
      variasi: {
        lansia: 'Sudah lama Nak, dua bulanan. Badan saya lemes sekali, kaki saya bengkak. Kalau pagi agak kempes, sorenya bengkak lagi. Begitu terus, Nak.',
        polos: 'Sikil kula abuh dok, wis rong sasi. Awak lemes, mboten kiat nyambut damel. Yen esuk rada kempes, sore abuh maneh.',
      },
    },
    pertanyaan: [
      {
        id: 'q_kencing',
        kategori: 'rps',
        tanya: 'Air kencingnya bagaimana? Warnanya, jumlahnya, ada busa?',
        jawab: 'Kalau pagi kencing saya berbusa banyak dok, busanya lama hilangnya. Jumlahnya kok rasanya makin sedikit.',
        esensial: true,
        oldcarts: ['karakter'],
        variasi: {
          polos: 'Yen enjing uyuh kula kathah busane dok, kaya sabun. Suwe ilange. Jumlahe kok saya sithik.',
        },
      },
      {
        id: 'q_darah_tinggi',
        kategori: 'rpd',
        tanya: 'Sudah berapa lama darah tinggi, dan obatnya diminum teratur?',
        jawab: 'Sudah belasan tahun dok. Obatnya saya minum kalau kepala pusing saja; kalau badan enak ya tidak saya minum.',
        esensial: true,
        oldcarts: ['durasi'],
        variasi: {
          skeptis: 'Darah tinggi katanya sudah belasan tahun. Tapi obat darah tinggi itu kan bikin ginjal rusak dok? Makanya saya minum kalau pusing saja.',
        },
      },
      {
        id: 'q_riwayat_fungsi_ginjal',
        kategori: 'rpd',
        tanya: 'Pernah memeriksakan fungsi ginjal sebelumnya? Ada hasil lama yang bisa dibandingkan?',
        jawab: 'Ada fotokopinya, Dok. Enam bulan lalu kreatinin 1,8 dengan eGFR tertulis 38 dan protein urine +2. Saya diminta kontrol, tetapi tidak kembali.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_gula',
        kategori: 'rpd',
        tanya: 'Ada kencing manis? Sejak kapan dan kontrol di mana?',
        jawab: 'Ada dok, kira-kira sepuluh tahun. Kontrolnya jarang, kadang setahun sekali kalau ingat.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_jamu',
        kategori: 'sosial',
        tanya: 'Ada minum jamu, obat pegal dari warung, atau obat dari orang lain?',
        jawab: 'Wah, tiap badan pegal saya minum jamu pegal linu dok, sudah bertahun-tahun. Kadang beli obat pegal di warung juga. Sekalian ini dok, minta obat pegal yang manjur ya, badan saya rasanya remuk semua.',
        esensial: true,
        variasi: {
          polos: 'Nggih dok, jamu pegel linu saben dinten kula ombe. Yen mboten ngombe jamu, awak kula linu kabeh. Kadang tumbas obat pegel wonten warung. Mangke kula dipunparingi obat pegel nggih dok?',
          terpelajar: 'Saya rutin minum jamu pegal linu dok, sudah bertahun-tahun, dan sesekali beli obat pegal di warung. Apakah itu ada hubungannya? Sekalian minta obat pegal ya dok, badan saya nyeri sekali.',
        },
      },
      {
        id: 'q_mual',
        kategori: 'rps',
        tanya: 'Kapan mual muncul, apakah sampai muntah, dan bagaimana nafsu makannya?',
        jawab: 'Mual terutama pagi dok, kadang muntah sedikit. Makan jadi tidak enak, daging rasanya aneh seperti logam.',
        oldcarts: ['waktu', 'penyerta'],
      },
      {
        id: 'q_gatal_kram',
        kategori: 'rps',
        tanya: 'Ada kulit gatal padahal tidak ada ruam, kram otot malam hari, atau susah tidur?',
        jawab: 'Iya dok, gatal-gatal padahal kulit tidak ada apa-apanya. Betis sering kram kalau malam sampai terbangun.',
        oldcarts: ['penyerta', 'waktu'],
      },
      {
        id: 'q_bahaya',
        kategori: 'rps',
        tanya: 'Ada sesak saat berbaring, tidak bisa kencing sama sekali, atau bingung dan mengantuk berat?',
        jawab: 'Sesak kalau jalan jauh saja dok. Masih bisa kencing, dan saya masih sadar penuh, tidak bingung.',
        esensial: true,
        oldcarts: ['keparahan', 'penyerta'],
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada yang sakit ginjal atau cuci darah?',
        jawab: 'Kakak saya cuci darah dok, sudah tiga tahun. Saya jadi takut ujungnya sama.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_pekerjaan',
        kategori: 'sosial',
        tanya: 'Bapak sekarang kerjanya apa?',
        jawab: 'Sudah pensiun dok, sekarang cuma bantu-bantu di kebun belakang rumah.',
        distraktor: true,
      },
      {
        id: 'q_kopi',
        kategori: 'sosial',
        tanya: 'Sehari minum kopi berapa gelas?',
        jawab: 'Dua gelas dok, pagi dan sore, sudah dari muda begitu.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak pucat dan lelah; kulit kering dengan bekas garukan luas. Kesadaran penuh, tidak ada bau napas uremik.', relevan: true },
      { region: 'ekstremitas', temuan: 'Edema pitting derajat 2 kedua tungkai hingga pretibial, simetris.', relevan: true },
      { region: 'toraks_paru', temuan: 'Suara napas vesikuler, tidak ada ronki basal (tanpa kongesti paru).', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, tidak ada gallop; JVP tidak meningkat (menyingkirkan gagal jantung sebagai penyebab edema).', relevan: true },
      { region: 'abdomen', temuan: 'Supel, tidak ada nyeri tekan; hepar dan lien tidak membesar, tidak teraba massa, buli tidak penuh.', relevan: false },
    ],
    lab: [
      { id: 'fungsi_ginjal', hasil: 'Ureum 92 mg/dL; kreatinin 1,9 mg/dL; eGFR 35 mL/menit/1,73 m2. Rekam enam bulan lalu: eGFR 38.', flag: 'tinggi', relevan: true },
      { id: 'proteinuria', hasil: 'Protein urine dipstik +2 (semi-kuantitatif; kategori albuminuria tetap memerlukan ACR).', flag: 'abnormal', relevan: true },
      { id: 'hb', hasil: 'Hb 9,6 g/dL (anemia normositik penyakit ginjal kronik).', flag: 'rendah', relevan: true },
    ],
    diagnosisBanding: ['N18.3', 'I12.9', 'E11.2'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [
        { id: 'natrium_diklofenak_50', alasan: 'INILAH jebakan utamanya: pasien datang meminta obat pegal. NSAID menghambat prostaglandin yang mempertahankan aliran darah ginjal — pada eGFR 35 ini memicu gagal ginjal akut di atas kronik dan mempercepat jalan ke cuci darah. Keluhan pegal dicari sebabnya, bukan dibungkam NSAID.', bahaya: 'kontraindikasi' },
        { id: 'ibuprofen_400', alasan: 'Sama bahayanya dengan diklofenak — dan justru inilah golongan obat warung yang selama ini pasien beli sendiri. Meresepkannya = meresmikan kebiasaan yang merusak ginjalnya.', bahaya: 'kontraindikasi' },
        { id: 'kalsium_karbonat_500', alasan: 'Pengikat fosfat baru relevan pada penyakit ginjal kronik lanjut dengan hiperfosfatemia (umumnya stadium 4-5), bukan stadium 3b tanpa data fosfat. Menambah beban obat tanpa indikasi; keputusan ini ranah spesialis.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['hindari_obat_nefrotoksik', 'diet_rendah_protein_ginjal', 'diet_rendah_garam', 'kepatuhan_obat', 'kontrol_rutin'],
      // Menghentikan jamu/NSAID adalah SATU-SATUNYA hal di kunjungan ini yang
      // langsung mengubah laju kerusakan ginjal — lebih kritis dari topik lain.
      edukasiKritis: ['hindari_obat_nefrotoksik'],
    },
    clue: 'PENYAKIT GINJAL KRONIK G3b (eGFR 30-44, SKDI 2 - RUJUK): eGFR 38 enam bulan lalu dan 35 sekarang membuktikan kronisitas lebih dari tiga bulan; hipertensi, diabetes, proteinuria dipstik, edema, dan anemia menunjukkan risiko serta komplikasi. Dipstik +2 belum menentukan kategori albuminuria: ACR kuantitatif tetap diperlukan. Di FKTP, hentikan NSAID/jamu, kendalikan faktor risiko, dan koordinasikan rujukan karena ada anemia serta penyebab/prognosis yang perlu dinilai. ACE-I/ARB memang renoprotektif pada albuminuria, tetapi inisiasi atau titrasi harus disertai data kalium-kreatinin dan rencana pemeriksaan ulang 2-4 minggu; game tidak mewajibkan resep empiris saat data itu belum tersedia.',
    panduanResmi: 'PNPK Penyakit Ginjal Kronik KMK 1634/2023 menjadi floor Indonesia. KDIGO 2024 mendefinisikan PGK sebagai kelainan struktur/fungsi ginjal minimal tiga bulan, mengklasifikasikan risiko dengan penyebab-eGFR-ACR, dan melarang menyimpulkan kronisitas dari satu hasil abnormal. RAS inhibitor direkomendasikan pada PGK beralbuminuria dengan pemantauan tekanan darah, kreatinin, dan kalium dalam 2-4 minggu. Rujukan nefrologi ditentukan oleh sebab yang belum jelas, risiko gagal ginjal, penurunan eGFR, albuminuria/hematuria bermakna, hipertensi refrakter, atau komplikasi seperti anemia; eGFR 35 sendiri bukan sinonim persiapan dialisis.',
    catatanRealita: 'Di Sukamaju, Hb dan dipstik urine tersedia; kreatinin terjadwal lewat jejaring, sedangkan elektrolit dan ACR tidak diasumsikan siap hari itu. Hasil jejaring dipakai untuk menilai eGFR tanpa menunda rujukan. Rencana ACE-I/ARB harus menyebut cara memperoleh kalium-kreatinin awal dan kontrol ulang, bukan sekadar mencetak resep.',
    mutiaraEbm: 'Kreatinin 1,9 mg/dL dapat tampak tidak dramatis, tetapi eGFR memasukkan usia dan jenis kelamin sehingga lebih informatif. Prognosis PGK juga tidak boleh dibaca dari eGFR saja: ACR mengubah risiko secara bermakna. Karena itu, “stadium 3b” menjawab seberapa rendah filtrasi, bukan sendirian menjawab kapan dialisis diperlukan.',
    konsekuensi: {
      narasi: 'Bila permintaan obat pegal dituruti dan pemantauan terputus, NSAID — terutama saat sakit/dehidrasi — dapat memicu cedera ginjal akut di atas PGK. Cabang simulasi ini menggambarkan risiko yang masuk akal, bukan kepastian bahwa setiap pasien G3b akan segera memerlukan dialisis.',
      kembaliHariMin: 14,
      kembaliHariMax: 30,
      kondisiKembali: 'Setelah tetap minum NSAID saat gastroenteritis, pasien kembali dengan oliguria, bengkak memburuk, dan muntah — suspek cedera ginjal akut di atas PGK yang memerlukan penilaian rumah sakit segera.',
      guideline: 'PNPK PGK KMK 1634/2023 / KDIGO 2024 — buktikan kronisitas, nilai eGFR bersama ACR, hindari nefrotoksin, dan rujuk berdasarkan risiko serta komplikasi.',
    },
  }),

  /* ======================================================================
   * 2. Gagal Jantung Dekompensasi Akut (I50.1, SKDI 3B) — RUJUK penyakit dalam
   * Poin ajar: BEDA dari mm_gagal_jantung_kongestif (I50.0, CHF stabil rawat
   *   jalan). Ini dekompensasi AKUT dengan hipoksemia: rute IV (usus kongestif
   *   membuat furosemid ORAL tak dapat diandalkan) + stabilisasi + rujuk.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_gagal_jantung_dekompensasi',
    nama: 'Gagal Jantung Dekompensasi Akut',
    icd10: 'I50.1',
    skdi: '3B',
    kategori: 'kardiovaskular',
    fktp144: false,
    harusDirujuk: true,
    // Jantung = salah satu dari 9 kelompok PRB (Perpres JKN). Setelah
    // dekompensasi ini distabilkan spesialis, maintenance gagal jantung KRONIK
    // sah dikembalikan ke FKTP.
    bisaPrb: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'penyakit_dalam',
    keluhanUtama: 'Sesak saya makin berat dok, tidur harus pakai tiga bantal, dan kaki saya bengkak.',
    demografi: { usiaMin: 55, usiaMax: 75 },
    vital: { td: '148/92', nadi: 112, rr: 28, suhu: 36.7, spo2: 89 },
    pembuka: {
      tanya: 'Sesaknya memberat sejak kapan, dan apa yang membuatnya bertambah berat?',
      jawab: 'Empat hari ini makin berat dok. Dulu sesak cuma kalau jalan jauh, sekarang ganti baju saja sudah ngos-ngosan. Kalau telentang makin sesak.',
      oldcarts: ['onset', 'durasi', 'keparahan', 'agravasi'],
      variasi: {
        cemas: 'Empat hari dok, tapi makin lama makin parah! Semalam saya sampai tidak berani tidur, takut tidak bangun lagi. Telentang sedikit langsung sesak, dok. Tolong saya dok.',
        lansia: 'Sudah empat hari, Nak. Napas saya berat sekali. Dulu masih kuat jalan ke pasar, sekarang ganti baju saja sudah capek. Kalau tidur telentang tidak bisa, Nak, harus duduk.',
      },
    },
    pertanyaan: [
      {
        id: 'q_bantal',
        kategori: 'rps',
        tanya: 'Kalau tidur pakai berapa bantal? Pernah terbangun mendadak karena sesak?',
        jawab: 'Sekarang harus tiga bantal ditumpuk dok, dulu satu saja cukup. Hampir tiap malam saya terbangun megap-megap, harus duduk di tepi ranjang dulu baru enak.',
        esensial: true,
        oldcarts: ['waktu', 'keparahan'],
      },
      {
        id: 'q_berat',
        kategori: 'rps',
        tanya: 'Berat badannya bagaimana beberapa hari ini? Celana atau sarung terasa sempit?',
        jawab: 'Naik cepat dok, seminggu ini kira-kira empat kilo. Padahal makan malah berkurang. Perut dan kaki rasanya penuh, sarung jadi sempit.',
        esensial: true,
        oldcarts: ['onset', 'keparahan'],
      },
      {
        id: 'q_bengkak',
        kategori: 'rps',
        tanya: 'Kaki bengkaknya sampai mana? Kalau ditekan bagaimana?',
        jawab: 'Sampai betis dok, dua-duanya. Kalau ditekan jadi cekung, lama kembalinya. Makin sore makin bengkak.',
        esensial: true,
        oldcarts: ['lokasi', 'waktu', 'karakter'],
      },
      {
        id: 'q_jantung',
        kategori: 'rpd',
        tanya: 'Ada riwayat sakit jantung, serangan jantung, atau darah tinggi?',
        jawab: 'Darah tinggi lama dok. Dua tahun lalu pernah dirawat, katanya jantung saya bocor atau lemah begitu, saya kurang paham.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_obat_putus',
        kategori: 'rpd',
        tanya: 'Obat jantung dan obat kencingnya masih diminum? Ada yang berhenti belakangan ini?',
        jawab: 'Obat kencing yang bikin sering pipis itu saya stop dok, tiga minggu lalu. Repot, malam bolak-balik ke kamar mandi, tidur jadi terganggu.',
        esensial: true,
      },
      {
        id: 'q_pencetus',
        kategori: 'sosial',
        tanya: 'Beberapa hari ini ada makan asin berlebih, atau acara hajatan?',
        jawab: 'Ada dok, minggu lalu hajatan tetangga. Saya makan gulai dan ikan asin banyak sekali, tiga hari berturut-turut.',
        oldcarts: ['onset'],
      },
      {
        id: 'q_nyeri_dada',
        kategori: 'rps',
        tanya: 'Ada nyeri dada seperti ditindih yang menjalar ke lengan atau rahang, atau keringat dingin?',
        jawab: 'Dada terasa penuh dan berat dok, tapi tidak menjalar ke mana-mana dan tidak keringat dingin.',
        esensial: true,
        oldcarts: ['karakter', 'radiasi'],
      },
      {
        id: 'q_batuk',
        kategori: 'rps',
        tanya: 'Ada batuk, terutama malam? Dahaknya bagaimana warnanya?',
        jawab: 'Batuk-batuk terutama kalau berbaring dok. Dahaknya sedikit dan encer berbusa, tidak kuning, tidak ada darah.',
        oldcarts: ['waktu', 'karakter'],
      },
      {
        id: 'q_arisan',
        kategori: 'sosial',
        tanya: 'Bapak masih ikut kegiatan arisan atau perkumpulan di kampung?',
        jawab: 'Masih dok, sebulan sekali arisan RT. Tapi belakangan sering saya lewatkan karena capek.',
        distraktor: true,
      },
      {
        id: 'q_alergi_debu',
        kategori: 'rpd',
        tanya: 'Ada alergi debu atau riwayat asma sejak kecil?',
        jawab: 'Tidak ada dok, dari kecil tidak pernah asma dan tidak alergi apa-apa.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sesak, lebih nyaman setengah duduk; bicara masih dalam kalimat pendek, kulit sedikit lembap.', relevan: true },
      { region: 'toraks_paru', temuan: 'Ronki basah halus di kedua basal paru hingga sepertiga bawah lapang paru; tidak ada wheezing.', relevan: true },
      { region: 'jantung', temuan: 'Takikardia reguler, gallop S3 terdengar, iktus kordis bergeser ke lateral, JVP meningkat jelas.', relevan: true },
      { region: 'ekstremitas', temuan: 'Edema pitting derajat 2-3 kedua tungkai hingga lutut; akral hangat, perfusi masih baik.', relevan: true },
      { region: 'abdomen', temuan: 'Hepar teraba 3 jari di bawah arkus kosta, kenyal dan nyeri tekan; refluks hepatojugular positif.', relevan: true },
      { region: 'kulit', temuan: 'Turgor baik, tidak ada ruam, tidak ada sianosis perifer.', relevan: false },
    ],
    lab: [
      { id: 'ekg', hasil: 'Sinus takikardia 112x/menit, hipertrofi ventrikel kiri, tanpa elevasi ST atau gelombang Q baru (tidak ada infark akut).', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['I50.1', 'J44.1', 'J81'],
    tatalaksana: {
      obatBenar: ['furosemid_inj_20'],
      prosedur: ['oksigen', 'posisi_semifowler', 'akses_iv_tanpa_bolus', 'pemantauan_ketat_vital'],
      obatSalahUmum: [
        // Pembeda utama dari mm_gagal_jantung_kongestif (yang memang memakai
        // furosemid ORAL pada CHF stabil): pada dekompensasi akut, ususnya ikut
        // kongestif → absorpsi oral tak dapat diandalkan. Bukan berbahaya,
        // tetapi tak efektif pada situasi ini → nonPrimer.
        { id: 'furosemid_40', alasan: 'Rutenya yang salah, bukan obatnya. Pada dekompensasi akut, dinding usus ikut membengkak oleh kongesti sehingga penyerapan furosemid ORAL tidak dapat diandalkan justru saat dekongesti paling dibutuhkan. Situasi ini menuntut rute intravena.', bahaya: 'nonPrimer' },
        { id: 'bisoprolol_5', alasan: 'Beta-blocker bermanfaat jangka panjang, tetapi pasien ini belum memakainya dan obat baru tidak dimulai saat dekompensasi belum stabil. Ini berbeda dari menghentikan otomatis beta-blocker yang sudah rutin: terapi lama umumnya diteruskan kecuali ada syok, bradikardia berat, atau blok jantung.', bahaya: 'kontraindikasi' },
        { id: 'salbutamol_2', alasan: 'Sesak dengan suara napas tambahan mudah dibaca sebagai asma, padahal ini paru yang terendam cairan, bukan saluran napas yang menyempit. Bronkodilator tidak mengeringkan paru dan takikardianya justru memperberat kerja jantung.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['restriksi_cairan_gagal_jantung', 'diet_rendah_garam', 'kepatuhan_obat', 'tanda_bahaya'],
      // Pencetus kasus ini eksplisit: pasien menghentikan diuretik + makan asin
      // berlebih. Restriksi cairan/garam adalah topik KHAS yang menentukan
      // apakah ia kembali dalam sebulan.
      edukasiKritis: ['restriksi_cairan_gagal_jantung'],
      // Dekongesti adalah intervensi yang membedakan hidup-mati di sini:
      // konsekuensi kasus ini adalah edema paru akut. Mengikuti preseden
      // terapiKritis: ['furosemid_40'] pada mm_gagal_jantung_kongestif.
      terapiKritis: ['furosemid_inj_20'],
    },
    // SpO2 89% = hipoksemia (<90) → oksigen + posisi setengah duduk adalah
    // gerbang stabilisasi sebelum transport. Bandingkan mm_gagal_jantung_kongestif
    // (SpO2 92%) yang sengaja TIDAK memasang gerbang oksigen.
    stabilisasiWajib: ['oksigen', 'posisi_semifowler', 'akses_iv_tanpa_bolus'],
    clue: 'GAGAL JANTUNG DEKOMPENSASI AKUT (SKDI 3B - RUJUK): sesak progresif, ortopnea tiga bantal, paroxysmal nocturnal dyspnoea, kenaikan berat 4 kg, JVP meningkat, gallop S3, ronki basal, hepatomegali, dan edema perifer sudah cukup menegakkan kongesti secara klinis. Pencetusnya adalah penghentian diuretik dan beban garam. Di FKTP: posisikan setengah duduk, titrasi oksigen karena SpO2 89%, pasang akses IV tanpa bolus cairan rutin, berikan furosemid intravena, monitor, dan rujuk. Jangan memulai beta-blocker baru sebelum stabil; jangan pula menghentikan terapi beta-blocker lama secara otomatis tanpa syok, bradikardia berat, atau blok.',
    panduanResmi: `${PPK_FLOOR} PPK 1186/2022 memerinci oksigen, akses IV, furosemid injeksi 20-40 mg, dan rujukan segera pada gagal jantung akut. NICE CG187 rekomendasi 1.3.3-1.3.5 menguatkan diuretik intravena dengan pemantauan fungsi ginjal, berat, dan diuresis; rekomendasi 1.5.1-1.5.3 membedakan kelanjutan beta-blocker lama dari inisiasi atau restart setelah stabil.`,
    catatanRealita: 'Vignette menyatakan oksigen, pulse oximeter, EKG, furosemid injeksi, akses IV, monitoring, dan transport ready. Rontgen tidak tersedia onsite; diagnosis klinis, stabilisasi, dan transfer tidak menunggu foto. Bila injeksi kosong, jangan menyatakan furosemid oral setara atau mengarang substitusi: kerjakan stabilisasi yang feasible, komunikasikan keterbatasan, dan percepat transfer.',
    mutiaraEbm: 'Kenaikan berat badan 4 kg dalam seminggu adalah tanda kongesti paling awal dan paling murah — muncul jauh sebelum sesak, dan hanya butuh timbangan. Sebaliknya, tungkai yang "tidak terlalu bengkak" menyesatkan: pasien bisa menahan 4-5 liter cairan sebelum edema tampak nyata, sehingga edema ringan tidak berarti kongesti ringan.',
    konsekuensi: {
      narasi: 'Tanpa dekongesti intravena dan rujukan, kongesti terus menumpuk sampai alveolus terendam dan pasien jatuh ke edema paru akut. Memulai beta-blocker baru sebelum stabil atau menganggap furosemid oral setara dapat menunda terapi yang diperlukan.',
      kembaliHariMin: 1,
      kembaliHariMax: 3,
      kondisiKembali: 'Pasien dibawa kembali dalam kondisi sesak hebat, sama sekali tidak bisa dibaringkan, berkeringat dingin dan batuk berbusa kemerahan — edema paru akut yang mengancam jiwa.',
      guideline: 'PPK 1186/2022 / NICE CG187 — diuretik loop intravena, oksigen bila hipoksemik, monitoring, dan rujuk; inisiasi beta-blocker menunggu stabilisasi.',
    },
  }),

  /* ======================================================================
   * 3. Hipertiroid Graves (E05.0, SKDI 3A) — RUJUK penyakit dalam
   * Poin ajar: Graves menyamar jadi cemas, depresi, atau diabetes. Propranolol
   *   meredakan gejala adrenergik; antitiroid = keputusan/ketersediaan terbatas.
   *   Edukasi agranulositosis adalah nyawa pasien.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_hipertiroid_graves',
    nama: 'Suspek Penyakit Graves dengan Tirotoksikosis',
    icd10: 'E05.0',
    skdi: '3A',
    kategori: 'metabolik',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'penyakit_dalam',
    keluhanUtama: 'Berat badan saya turun terus dok padahal makan saya banyak sekali, dan jantung rasanya berdebar-debar.',
    demografi: { usiaMin: 25, usiaMax: 45, jenisKelamin: 'P' },
    vital: { td: '138/62', nadi: 118, rr: 20, suhu: 37.3, spo2: 98 },
    pembuka: {
      tanya: 'Berat badannya turun berapa, dan sejak kapan mulai berdebar?',
      jawab: 'Tiga bulan ini turun delapan kilo dok, padahal makan saya malah tambah banyak, sehari bisa lima kali. Jantung berdebar hampir tiap hari, kadang sampai terbangun malam.',
      oldcarts: ['onset', 'durasi', 'keparahan'],
      variasi: {
        cemas: 'Delapan kilo dok, tiga bulan! Padahal makan saya banyak sekali. Jantung saya deg-degan terus, rasanya mau lompat keluar. Saya browsing katanya bisa kanker ya dok? Saya takut sekali, tidak bisa tidur memikirkannya.',
        terpelajar: 'Sekitar delapan kilogram dalam tiga bulan dok, padahal porsi makan saya justru bertambah. Berdebarnya hampir setiap hari dan sering muncul saat istirahat, bukan hanya saat beraktivitas.',
      },
    },
    pertanyaan: [
      {
        id: 'q_gemetar',
        kategori: 'rps',
        tanya: 'Ada tangan gemetar? Terlihat saat apa?',
        jawab: 'Iya dok, tangan saya gemetar halus terus. Kalau memegang gelas atau menulis kelihatan sekali, sampai malu di kantor.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_panas',
        kategori: 'rps',
        tanya: 'Bagaimana dengan hawa panas? Sering berkeringat?',
        jawab: 'Saya jadi tidak tahan panas dok. Kipas angin nyala terus, di kamar ber-AC pun saya masih berkeringat. Padahal dulu saya orangnya gampang kedinginan.',
        esensial: true,
        oldcarts: ['karakter'],
        variasi: {
          polos: 'Kula mboten kiat panas dok. Kipas kula uripke terus, tetep kringeten. Mbiyen kula niku gampang kadhemen, saiki malah kosok balen.',
        },
      },
      {
        id: 'q_leher',
        kategori: 'rps',
        tanya: 'Ada benjolan di leher? Sejak kapan dan apakah membesar?',
        jawab: 'Ada dok, leher depan saya kelihatan membesar merata, sudah beberapa bulan. Tidak sakit, tapi kerah baju jadi sempit dan orang-orang mulai menanyakan.',
        esensial: true,
        oldcarts: ['lokasi', 'durasi'],
      },
      {
        id: 'q_mata',
        kategori: 'rps',
        tanya: 'Ada perubahan pada mata? Terasa mengganjal, berair, atau tampak lebih menonjol?',
        jawab: 'Kata suami saya mata saya jadi lebih melotot dok. Sering perih dan berair seperti ada pasir, tetapi penglihatan dan warna masih jelas, tidak dobel, dan tidak nyeri saat menggerakkan mata.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_haid',
        kategori: 'rps',
        tanya: 'Haidnya bagaimana belakangan ini?',
        jawab: 'Jadi jarang dan sedikit dok, kadang dua bulan sekali. Padahal dulu teratur sekali.',
        hanyaUntuk: 'P',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_bab',
        kategori: 'rps',
        tanya: 'Buang air besarnya bagaimana? Ada perubahan?',
        jawab: 'Jadi lebih sering dok, sehari dua sampai tiga kali, agak lembek. Tapi bukan mencret dan tidak ada darah.',
        oldcarts: ['karakter'],
      },
      {
        id: 'q_emosi',
        kategori: 'rps',
        tanya: 'Bagaimana perasaan dan tidurnya? Ada gelisah atau mudah marah?',
        jawab: 'Saya jadi gampang tersinggung dok, hal kecil saja bisa bikin marah. Tidur susah, badan capek tapi pikiran jalan terus. Suami saya bilang saya berubah.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_keluarga_tiroid',
        kategori: 'rpk',
        tanya: 'Di keluarga ada yang sakit gondok atau kelenjar tiroid?',
        jawab: 'Ibu saya dulu dioperasi lehernya dok, katanya karena gondok. Adik perempuan saya juga minum obat untuk tiroid.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kontra_beta_blocker',
        kategori: 'rpd',
        tanya: 'Pernah asma atau mengi, nadi sangat lambat, pingsan, atau alergi obat jantung?',
        jawab: 'Tidak pernah asma atau mengi, Dok. Saya juga tidak pernah diberi tahu nadinya lambat dan tidak pernah pingsan.',
        esensial: true,
      },
      {
        id: 'q_kehamilan',
        kategori: 'rpd',
        tanya: 'Ada kemungkinan sedang hamil atau sedang merencanakan kehamilan? Kapan haid terakhir dan memakai kontrasepsi apa?',
        jawab: 'Tidak sedang merencanakan hamil. Haid terakhir dua minggu lalu dan suntik KB tiga bulanan saya masih sesuai jadwal.',
        esensial: true,
        hanyaUntuk: 'P',
      },
      {
        id: 'q_kosmetik',
        kategori: 'sosial',
        tanya: 'Ada memakai krim pemutih atau produk perawatan wajah baru?',
        jawab: 'Cuma pelembap biasa dok, yang itu-itu saja dari dulu.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'kepala_leher', temuan: 'Pembesaran tiroid difus dan simetris, kenyal, tidak nyeri, ikut bergerak saat menelan; bruit terdengar di atas kelenjar.', relevan: true },
      { region: 'mata', temuan: 'Eksoftalmus bilateral, lid retraction dan lid lag positif; konjungtiva sedikit hiperemis, kornea masih jernih.', relevan: true },
      { region: 'jantung', temuan: 'Takikardia reguler 118x/menit, S1 mengeras, tekanan nadi melebar; tidak ada gallop maupun tanda gagal jantung.', relevan: true },
      { region: 'ekstremitas', temuan: 'Tremor halus kedua tangan saat jari diekstensikan; telapak tangan hangat dan lembap.', relevan: true },
      { region: 'umum', temuan: 'Tampak kurus dan gelisah, sulit duduk tenang; kulit hangat dan halus.', relevan: true },
      { region: 'abdomen', temuan: 'Datar, supel, bising usus normal; hepar dan lien tidak membesar.', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['E05.0', 'F41.1', 'E11.9'],
    tatalaksana: {
      obatBenar: ['propranolol_10'],
      obatSalahUmum: [
        { id: 'diazepam_2', alasan: 'Berdebar, gemetar, gelisah, dan sulit tidur sangat mudah dibaca sebagai gangguan cemas. Sedatif meredakan tampilannya sebentar sambil menutupi tirotoksikosis yang terus berjalan — pasien kembali berbulan-bulan kemudian dengan fibrilasi atrium atau krisis tiroid.', bahaya: 'nonPrimer' },
        { id: 'fluoksetin_20', alasan: 'Mudah tersinggung, berubah perangai, dan insomnia bukan depresi di sini, melainkan kelenjar tiroid yang bekerja berlebihan. Antidepresan tidak mengoreksi hormonnya dan menunda diagnosis yang sebenarnya sederhana: periksa TSH.', bahaya: 'nonPrimer' },
        { id: 'metformin_500', alasan: 'Berat turun sambil makan banyak memang khas diabetes — tetapi gula darah pasien ini normal. Meresepkan metformin berarti mengobati diagnosis yang sudah disingkirkan datanya sendiri, dan justru menurunkan berat badan pasien yang sudah kurus.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['rencana_tirotoksikosis_rujuk', 'kontrol_rutin', 'tanda_bahaya'],
      edukasiKritis: ['rencana_tirotoksikosis_rujuk'],
    },
    clue: 'SUSPEK PENYAKIT GRAVES DENGAN TIROTOKSIKOSIS (SKDI 3A - RUJUK): berat turun meski makan bertambah, berdebar, tremor, intoleransi panas, tekanan nadi lebar, gondok difus dengan bruit, dan tanda mata tiroid membuat Graves sangat mungkin. Namun diagnosis biokimia tidak boleh dikunci oleh gejala atau TSH tunggal: TSH rendah perlu FT4/FT3, lalu TRAb membantu mengonfirmasi Graves. Di FKTP, propranolol dapat meredakan gejala adrenergik setelah memastikan tidak ada asma/mengi, bradikardia, atau kontraindikasi lain. Jangan memulai PTU secara ad hoc tanpa menilai kehamilan, hitung darah/fungsi hati, dosis, monitoring, dan jalur tindak lanjut. Rujuk untuk konfirmasi serta pemilihan terapi; penurunan visus/warna, diplopia baru, nyeri gerak mata, aritmia, gagal jantung, atau demam-bingung mempercepat urgensi.',
    panduanResmi: 'PPK 1186/2022 tidak memuat bab Graves spesifik; bab tirotoksikosis menjadi floor terkait dan memuat propranolol, PTU bila klinis Graves jelas, serta rujukan untuk pemeriksaan laboratorium. NICE NG145 (diperbarui 2023, ditinjau 2025) memperjelas bahwa TSH rendah harus diikuti FT4 dan FT3, TRAb dipakai untuk mengonfirmasi Graves, dan hitung darah serta fungsi hati diperiksa sebelum obat antitiroid. Karena PTU bukan pilihan pertama rutin dan risiko terapi bergantung kehamilan serta monitoring, kasus Sukamaju hanya mewajibkan kontrol gejala yang aman dan rujukan, bukan PTU empiris.',
    catatanRealita: 'Profil Sukamaju tidak mengasumsikan TSH/FT4/FT3 siap di tempat; hasil hormon dan TRAb diperoleh lewat jejaring. Ketiadaan tes hari itu tidak menghalangi pengenalan klinis, skrining kontraindikasi propranolol, konseling tanda bahaya, dan rujukan. Obat antitiroid baru dimulai melalui protokol yang menjamin pemeriksaan awal serta tindak lanjut.',
    mutiaraEbm: 'Berdebar, gelisah, tremor, dan berat turun mudah dilabeli gangguan cemas. Gondok difus dengan bruit dan tanda mata tiroid menggeser probabilitas kuat ke Graves, tetapi tetap tidak menggantikan FT4/FT3 dan penetapan etiologi. GDS normal sewaktu juga tidak “menyingkirkan diabetes”; karena itu tes tersebut tidak lagi dijadikan pengunci diagnosis di kasus ini.',
    konsekuensi: {
      narasi: 'Bila dilabeli gangguan cemas dan tindak lanjut hilang, tirotoksikosis dapat berlanjut dan meningkatkan risiko fibrilasi atrium, gagal jantung, serta krisis tiroid saat ada pencetus. Cabang ini adalah progresi buruk yang mungkin, bukan nasib pasti setiap Graves yang belum diterapi.',
      kembaliHariMin: 45,
      kembaliHariMax: 120,
      kondisiKembali: 'Dalam cabang simulasi tanpa tindak lanjut, pasien kembali dengan nadi sangat cepat tidak teratur, sesak, dan edema — suspek fibrilasi atrium dengan gagal jantung yang memerlukan perawatan akut.',
      guideline: 'PPK 1186/2022 bab tirotoksikosis / NICE NG145 — kendalikan gejala dengan aman, konfirmasi TSH-FT4/FT3 dan etiologi, lalu pilih terapi definitif melalui jejaring.',
    },
  }),

  /* ======================================================================
   * 4. Sirosis Hepatis Dekompensata (K74.6, SKDI 2) — RUJUK penyakit dalam
   * Poin ajar: asites + ensefalopati awal. Spironolakton adalah tulang punggung
   *   (bukan furosemid), laktulosa untuk ensefalopati; NSAID & benzodiazepin
   *   adalah dua jalan tercepat memperburuk. Parasetamol dosis rendah TETAP aman.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_sirosis_hepatis_dekompensata',
    nama: 'Sirosis Hepatis Dekompensata',
    icd10: 'K74.6',
    skdi: '2',
    kategori: 'pencernaan',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'penyakit_dalam',
    keluhanUtama: 'Perut saya membesar berisi air dok, kaki bengkak, dan mata saya menguning.',
    demografi: { usiaMin: 45, usiaMax: 65 },
    vital: { td: '104/64', nadi: 96, rr: 20, suhu: 36.8, spo2: 97 },
    pembuka: {
      tanya: 'Perut membesarnya sejak kapan, dan apa yang menyertainya?',
      jawab: 'Sekitar dua bulan dok, makin lama makin buncit sampai susah membungkuk dan cepat kenyang. Kaki ikut bengkak, dan sebulan ini mata saya menguning.',
      oldcarts: ['onset', 'durasi', 'keparahan', 'penyerta'],
      variasi: {
        polos: 'Weteng kula mblendhuk dok, wis rong sasi, saya suwe saya gedhe. Sikil nggih abuh. Mripat kula dadi kuning, kula dhewe kaget.',
        skeptis: 'Dua bulan dok. Tapi saya cuma kembung biasa kok, kebanyakan angin. Mata kuning itu kata istri saya saja, saya lihat di cermin biasa-biasa saja.',
      },
    },
    pertanyaan: [
      {
        id: 'q_kuning',
        kategori: 'rps',
        tanya: 'Mata kuningnya sejak kapan? Air kencing dan buang air besarnya bagaimana warnanya?',
        jawab: 'Sudah sebulan dok, makin jelas. Kencing warnanya seperti teh tua, tapi buang air besar warnanya biasa saja, tidak pucat dan tidak hitam.',
        esensial: true,
        oldcarts: ['onset', 'karakter'],
      },
      {
        id: 'q_bingung',
        kategori: 'rps',
        tanya: 'Belakangan ada bingung, mengantuk berat di siang hari, atau salah mengenali tempat dan waktu?',
        jawab: 'Kata istri saya begitu dok. Kadang saya ngelantur, siang tidur terus, malah malamnya melek. Pernah saya keluar rumah lalu lupa mau ke mana. Saya sendiri tidak merasa apa-apa.',
        esensial: true,
        oldcarts: ['onset', 'waktu'],
      },
      {
        id: 'q_memar',
        kategori: 'rps',
        tanya: 'Gampang memar atau berdarah? Gusi berdarah, mimisan?',
        jawab: 'Iya dok, kesenggol sedikit langsung biru lebar. Gusi juga sering berdarah waktu sikat gigi, padahal saya sikatnya pelan.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_muntah_darah',
        kategori: 'rps',
        tanya: 'Pernah muntah darah, atau buang air besar hitam seperti aspal?',
        jawab: 'Belum pernah dok, sama sekali. Buang air besar saya warnanya biasa.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_alkohol',
        kategori: 'sosial',
        tanya: 'Ada kebiasaan minum minuman beralkohol? Berapa banyak dan sudah berapa lama?',
        jawab: 'Dulu dok, waktu masih kerja di proyek hampir tiap malam saya minum, belasan tahun. Lima tahun terakhir sudah jarang, tapi kadang masih ikut kalau ada acara.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_hepatitis',
        kategori: 'rpd',
        tanya: 'Pernah sakit kuning sebelumnya, atau dinyatakan punya hepatitis?',
        jawab: 'Waktu muda pernah sakit kuning dok, sembuh sendiri katanya. Setelah itu tidak pernah diperiksa lagi.',
        oldcarts: ['durasi'],
      },
      {
        id: 'q_transfusi',
        kategori: 'rpd',
        tanya: 'Pernah transfusi darah, tato, atau pakai jarum bersama?',
        jawab: 'Pernah transfusi dok, waktu kecelakaan proyek tahun sembilan puluhan. Tato tidak ada.',
      },
      {
        id: 'q_obat_pegal',
        kategori: 'rpd',
        tanya: 'Ada minum obat pegal, jamu, atau obat tidur belakangan ini?',
        jawab: 'Kalau badan pegal saya minum obat warung dok. Terus karena malam susah tidur, saya sempat minta obat tidur ke tetangga.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_merokok',
        kategori: 'sosial',
        tanya: 'Bapak merokok?',
        jawab: 'Sehari sebungkus dok, dari muda. Belum bisa berhenti.',
        distraktor: true,
      },
      {
        id: 'q_olahraga',
        kategori: 'sosial',
        tanya: 'Rutin olahraga tidak Pak?',
        jawab: 'Tidak pernah dok, kerja saja sudah capek dari dulu.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'abdomen', temuan: 'Perut membuncit tegang, shifting dullness dan undulasi positif (asites masif); hepar mengecil sulit teraba, lien teraba Schuffner 2; venektasi dinding perut (caput medusae).', relevan: true },
      { region: 'umum', temuan: 'Ikterik jelas pada sklera dan kulit; spider naevi di dada atas, eritema palmaris, ginekomastia, atrofi otot temporal dan bahu.', relevan: true },
      { region: 'neurologis', temuan: 'Kesadaran menurun ringan, lambat merespons, disorientasi waktu; flapping tremor (asteriksis) positif — ensefalopati hepatik derajat 2.', relevan: true },
      { region: 'ekstremitas', temuan: 'Edema pitting kedua tungkai; memar lama di lengan dan tungkai tanpa riwayat trauma jelas; kuku putih (Terry nails).', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, tidak ada gallop; JVP tidak meningkat (edema bukan berasal dari jantung).', relevan: true },
      { region: 'toraks_paru', temuan: 'Suara napas vesikuler kedua lapang paru, tidak ada ronki maupun redup basal.', relevan: false },
    ],
    lab: [
      { id: 'hbsag', hasil: 'HBsAg reaktif pada tes cepat; etiologi dan aktivitas penyakit tetap memerlukan staging di jejaring.', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['K74.6', 'K70.3', 'I50.0'],
    tatalaksana: {
      obatBenar: ['laktulosa_syr'],
      obatSalahUmum: [
        { id: 'spironolakton_25', alasan: 'Spironolakton adalah terapi penting asites sirosis, tetapi bukan obat yang aman dimulai secara buta pada pasien dengan asites tegang dan ensefalopati overt sebelum fungsi ginjal, natrium, kalium, status volume, serta kebutuhan parasentesis dinilai. Diuretik dititrasi di jejaring dengan pemantauan klinis-biokimia; tugas first-contact sekarang adalah laktulosa, mencari pencetus, dan transfer.', bahaya: 'nonPrimer' },
        { id: 'furosemid_40', alasan: 'Furosemid tunggal bukan jawaban first-contact asites sirosis dan dapat memperburuk hipovolemia efektif, gangguan elektrolit, cedera ginjal, serta ensefalopati. Pasien ini memerlukan evaluasi dan monitoring jejaring sebelum regimen diuretik ditetapkan.', bahaya: 'nonPrimer' },
        { id: 'ibuprofen_400', alasan: 'NSAID pada sirosis dengan asites meningkatkan risiko perdarahan dan mengganggu prostaglandin yang menopang perfusi ginjal, sehingga dapat memicu cedera ginjal/sindrom hepatorenal. Parasetamol dosis terbatas sesuai pedoman justru lebih aman; jangan menunggu hitung trombosit atau endoskopi untuk menghindari NSAID pada fenotipe dekompensasi ini.', bahaya: 'kontraindikasi' },
        { id: 'diazepam_2', alasan: 'Pasien ini sudah bingung dan mengantuk karena ensefalopati hepatik, dan hati yang rusak tidak mampu memetabolisme benzodiazepin. Memberi obat tidur untuk keluhan "malam melek" — persis yang diminta pasien — dapat menjatuhkannya ke koma hepatikum. Siklus tidur terbalik BUKAN insomnia, itu gejala ensefalopati.', bahaya: 'kontraindikasi' },
      ],
      tindakanSalahUmum: [
        { id: 'pungsi_pleura', alasan: 'Cairannya ada di rongga perut, bukan rongga dada, dan pemeriksaan paru bersih. Pungsi pleura tidak memiliki sasaran. Parasentesis diagnostik/terapeutik, bila diperlukan, dilakukan di layanan rujukan dengan indikasi, alat, dan monitoring yang tepat.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['pantang_alkohol_hati', 'diet_rendah_garam', 'tanda_bahaya', 'kepatuhan_obat'],
      // Berhenti total dari alkohol adalah satu-satunya intervensi yang dapat
      // memperbaiki harapan hidup pasien ini, berapa pun obat yang diberikan.
      edukasiKritis: ['pantang_alkohol_hati'],
    },
    clue: 'Asites tegang, ikterus, stigmata penyakit hati kronik, disorientasi, dan asteriksis mendukung sirosis dekompensata dengan ensefalopati hepatik overt; diagnosis kerja dan rujukan tidak menunggu USG atau panel hati. Berikan laktulosa dengan target 2-3 kali buang air besar lunak per hari bila jalan napas dan kemampuan menelan aman, cari pencetus yang segera tampak, hentikan alkohol/sedatif/NSAID, lalu transfer untuk evaluasi fungsi ginjal-elektrolit, infeksi, perdarahan, parasentesis diagnostik/terapeutik, dan staging. Jangan memulai spironolakton atau furosemid secara buta pada pasien dengan ensefalopati dan asites tegang; diuretik memerlukan titrasi serta monitoring biokimia.',
    panduanResmi: 'PPK FKTP KMK 1186/2022 tidak mempunyai bab diagnosis-spesifik sirosis dekompensata pada crosswalk 167 bab; jangan mengatribusikan regimen ini ke PPK. PNPK Tata Laksana Sirosis Hati menjadi sumber nasional langsung. EASL Decompensated Cirrhosis dan AASLD Ascites Guidance menempatkan ensefalopati overt/asites sebagai dekompensasi yang memerlukan evaluasi komplikasi; laktulosa adalah terapi ensefalopati, sedangkan diuretik harus didahului penilaian ginjal/elektrolit dan dipantau ketat serta umumnya ditahan bila ensefalopati overt menetap.',
    catatanRealita: 'USG abdomen, panel hati, elektrolit, fungsi ginjal, INR, endoskopi, dan parasentesis tidak diasumsikan tersedia onsite. Tes cepat HBsAg tersedia tetapi tidak menunda transfer. Sirosis dekompensata dapat dikenali klinis dari asites, ikterus, stigmata hati kronik, dan asteriksis; Sukamaju memulai laktulosa dan mengirim pasien untuk staging serta source search, bukan membuat regimen diuretik tanpa monitoring.',
    mutiaraEbm: 'Pembalikan siklus tidur pada pasien penyakit hati dapat mendahului kebingungan yang kentara dan tidak boleh otomatis diberi obat tidur. Enzim hati yang kelak tampak rendah atau hanya sedikit meningkat juga tidak membuktikan sirosis membaik; staging jejaring membaca fungsi sintesis, bilirubin, ginjal, natrium, koagulasi, dan komplikasi secara bersama, bukan satu angka transaminase.',
    konsekuensi: {
      narasi: 'Bila asites tidak dikelola dan pencetus ensefalopati tidak dicegah, pasien jatuh ke koma hepatikum, peritonitis bakterial spontan, atau perdarahan varises. Pemberian NSAID mempercepat perdarahan dan sindrom hepatorenal; obat tidur mempercepat koma.',
      kembaliHariMin: 7,
      kembaliHariMax: 21,
      kondisiKembali: 'Pasien dibawa dalam kondisi tidak dapat dibangunkan setelah diberi obat tidur, atau muntah darah segar bergumpal dengan tekanan darah menurun — perdarahan varises esofagus yang mengancam jiwa.',
      guideline: 'PNPK Tata Laksana Sirosis Hati; EASL Decompensated Cirrhosis; AASLD Ascites Guidance — laktulosa untuk ensefalopati, evaluasi pencetus/komplikasi, hindari NSAID dan sedatif, serta titrasi diuretik hanya dengan monitoring klinis-biokimia.',
    },
  }),

  /* ======================================================================
   * 5. Anemia Berat Perlu Transfusi (D64.9, SKDI 3B) — RUJUK penyakit dalam
   * Poin ajar: Puskesmas TIDAK boleh mentransfusi (tanpa bank darah & pemantauan
   *   reaksi transfusi). Anemia kronik = euvolemik, jangan diguyur kristaloid.
   *   Cari & atasi SUMBERNYA, bukan sekadar tambal Hb.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_anemia_berat_perlu_transfusi',
    nama: 'Anemia Defisiensi Besi Berat Simptomatik akibat Perdarahan Kronik',
    icd10: 'D50.0',
    skdi: '3B',
    kategori: 'metabolik',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'penyakit_dalam',
    keluhanUtama: 'Saya lemas sekali dok, jalan ke kamar mandi saja sudah sesak dan jantung berdebar.',
    demografi: { usiaMin: 30, usiaMax: 50, jenisKelamin: 'P' },
    vital: { td: '100/60', nadi: 118, rr: 24, suhu: 36.6, spo2: 98 },
    pembuka: {
      tanya: 'Lemasnya sejak kapan, dan sekarang sejauh apa Ibu masih kuat beraktivitas?',
      jawab: 'Sudah berbulan-bulan dok, tapi dua minggu ini parah sekali. Jalan ke kamar mandi saja saya harus berhenti dulu, napas habis dan jantung berdebar kencang. Menyapu rumah pun tidak sanggup.',
      oldcarts: ['onset', 'durasi', 'keparahan'],
      variasi: {
        cemas: 'Berbulan-bulan dok, tapi dua minggu ini parah! Jalan ke kamar mandi saja saya hampir pingsan, jantung deg-degan kencang sekali. Saya takut ini sakit jantung dok, ibu saya dulu meninggal karena jantung.',
        polos: 'Kula lemes sanget dok, wis pirang-pirang wulan. Rong minggu iki tambah parah. Mlaku menyang jedhing wae ambeganku entek, jantung deg-degan.',
      },
    },
    pertanyaan: [
      {
        id: 'q_haid',
        kategori: 'rps',
        tanya: 'Haidnya bagaimana? Berapa lama, berapa banyak, dan sejak kapan berubah?',
        jawab: 'Banyak sekali dok, sudah delapan bulan begini. Sehari saya ganti pembalut sampai delapan kali, sering bocor sampai ke kasur, dan keluar gumpalan sebesar jempol. Haidnya sampai sepuluh hari, dulu cuma lima hari.',
        esensial: true,
        hanyaUntuk: 'P',
        oldcarts: ['durasi', 'keparahan', 'karakter'],
      },
      {
        id: 'q_pucat',
        kategori: 'rps',
        tanya: 'Ada yang bilang Ibu tampak pucat? Sejak kapan?',
        jawab: 'Iya dok, tetangga sampai bertanya saya sakit apa. Bibir dan kuku saya katanya putih semua. Saya sendiri baru sadar setelah lihat foto.',
        oldcarts: ['onset'],
      },
      {
        id: 'q_bahaya',
        kategori: 'rps',
        tanya: 'Ada nyeri dada, pingsan, atau sesak saat sedang duduk diam?',
        jawab: 'Dada kadang terasa berat kalau habis jalan dok, tapi kalau duduk diam masih enak. Pernah hampir pingsan sekali waktu berdiri mendadak dari jongkok.',
        esensial: true,
        oldcarts: ['penyerta', 'keparahan'],
      },
      {
        id: 'q_perdarahan_lain',
        kategori: 'rps',
        tanya: 'Ada buang air besar hitam seperti aspal, muntah darah, atau mimisan?',
        jawab: 'Tidak ada dok, sama sekali. Buang air besar saya warnanya biasa. Yang keluar darah cuma haid saja.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_es',
        kategori: 'sosial',
        tanya: 'Ada keinginan aneh mengunyah sesuatu, misalnya es batu atau tanah?',
        jawab: 'Kok dokter tahu? Saya jadi doyan sekali mengunyah es batu dok, sehari bisa segelas penuh. Dulu tidak pernah begitu.',
        esensial: true,
      },
      {
        id: 'q_makan',
        kategori: 'sosial',
        tanya: 'Sehari-hari lauknya apa? Sering makan daging, hati, atau sayuran hijau?',
        jawab: 'Seadanya dok, paling tahu tempe dan sayur. Daging jarang sekali, paling kalau lebaran. Uangnya saya dahulukan untuk sekolah anak.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_obat_sendiri',
        kategori: 'rpd',
        tanya: 'Sudah minum obat penambah darah atau obat lain untuk keluhan ini?',
        jawab: 'Sudah dok, saya beli vitamin penambah darah di apotek dua bulan, tapi tidak ada bedanya. Malah tambah lemas.',
        oldcarts: ['durasi'],
      },
      {
        id: 'q_hamil',
        kategori: 'rps',
        tanya: 'Ada kemungkinan hamil? Kapan haid terakhir, memakai KB apa, dan sudah tes kehamilan?',
        jawab: 'Saya memakai spiral tembaga lima tahun, Dok. Karena tetap sering berdarah saya merasa tidak mungkin hamil, tetapi memang belum pernah tes kehamilan kali ini.',
        hanyaUntuk: 'P',
        esensial: true,
      },
      {
        id: 'q_pekerjaan',
        kategori: 'sosial',
        tanya: 'Ibu kesehariannya bekerja apa?',
        jawab: 'Buruh cuci dan setrika dok, dari rumah ke rumah. Belakangan sudah tidak sanggup, jadi berhenti.',
        distraktor: true,
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Ada alergi obat atau makanan?',
        jawab: 'Tidak ada dok, selama ini aman-aman saja.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Pucat sangat mencolok; konjungtiva palpebra sangat anemis, telapak tangan dan lipatan telapak tampak putih. Sadar penuh tetapi tampak lelah berat.', relevan: true },
      { region: 'jantung', temuan: 'Takikardia 118x/menit, bising sistolik ejeksi derajat 2/6 di seluruh area (bising aliran karena darah encer, bukan kelainan katup); tidak ada gallop.', relevan: true },
      { region: 'ekstremitas', temuan: 'Kuku pucat, rapuh, dan berbentuk sendok (koilonikia); tidak ada edema tungkai; akral hangat.', relevan: true },
      { region: 'tht_mulut', temuan: 'Lidah tampak licin dan kehilangan papil (atrofi papil lidah); sudut bibir pecah-pecah (keilitis angularis).', relevan: true },
      { region: 'abdomen', temuan: 'Supel, tidak nyeri tekan; hepar dan lien tidak membesar, tidak teraba massa.', relevan: true },
      { region: 'toraks_paru', temuan: 'Suara napas vesikuler kedua lapang paru, tidak ada ronki maupun wheezing.', relevan: false },
    ],
    lab: [
      { id: 'hb', hasil: 'Hb 5,8 g/dL.', flag: 'rendah', relevan: true },
      { id: 'tes_kehamilan', hasil: 'Negatif — perdarahan saat ini bukan perdarahan terkait kehamilan.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['D50.0', 'N92.0', 'D25.9'],
    tatalaksana: {
      obatBenar: [],
      obatOpsional: ['tablet_fe'],
      obatSalahUmum: [
        { id: 'vitamin_b_kompleks', alasan: 'Diberi label "penambah darah" di apotek, tetapi tidak mengandung besi dalam jumlah bermakna — dan pasien ini sudah membuktikannya sendiri: dua bulan meminumnya tanpa perbaikan. Meresepkannya lagi berarti mengulangi kegagalan yang sama sambil menunda transfusi yang dibutuhkannya hari ini.', bahaya: 'nonPrimer' },
        { id: 'asam_folat', alasan: 'Tidak ada data yang menunjuk defisiensi folat, dan asam folat tunggal tidak mengganti besi atau menghentikan perdarahan. Memberi hematinik tanpa rencana sumber perdarahan dapat menciptakan rasa aman palsu dan menunda rujukan.', bahaya: 'nonPrimer' },
      ],
      tindakanSalahUmum: [
        { id: 'transfusi_darah_fktp', alasan: 'Pasien memang perlu penilaian transfusi segera, tetapi Sukamaju adalah Puskesmas nonrawat-inap tanpa layanan darah, uji silang, dan pemantauan reaksi transfusi. Tugasnya mengenali kegawatan dan mengirim ke fasilitas yang mampu; ini bukan larangan universal terhadap semua Puskesmas berkapasitas berbeda.', bahaya: 'nonPrimer' },
        { id: 'resusitasi_cairan_kristaloid', alasan: 'Akses intravena untuk transport berbeda dari bolus resusitasi. Pasien tidak menunjukkan syok atau kehilangan volume akut; bolus kristaloid rutin tidak mengatasi rendahnya massa eritrosit dan dapat menambah beban sirkulasi. Cairan diberikan hanya bila ada indikasi hipovolemia yang dinilai ulang.', bahaya: 'berbahaya' },
      ],
      edukasi: ['rencana_anemia_berat_rujuk', 'diet_zat_besi', 'tanda_bahaya', 'kontrol_rutin'],
      edukasiKritis: ['rencana_anemia_berat_rujuk'],
    },
    clue: 'ANEMIA DEFISIENSI BESI BERAT SIMPTOMATIK AKIBAT PERDARAHAN KRONIK (SKDI 3B - RUJUK): Hb 5,8 g/dL disertai sesak aktivitas minimal, takikardia, presinkop, pika, koilonikia, dan haid sangat banyak membuat defisiensi besi akibat perdarahan uterus kronik sangat mungkin. Tes kehamilan tetap wajib; perdarahan tidak membuktikan seseorang tidak hamil. PPK menetapkan Hb <7 g/dL sebagai indikasi transfusi dan gejala sebagai alasan rujuk tanpa menunggu ambang. Di Sukamaju, rujuk hari yang sama untuk penilaian transfusi dan penyebab perdarahan. Tablet Fe dapat dimulai bila tidak menunda transfer, tetapi tidak menggantikan darah bila tim RS menilainya perlu dan tidak menutup sumber perdarahan.',
    panduanResmi: 'PPK 1186/2022 bab anemia defisiensi besi adalah floor langsung: anemia bergejala segera dirujuk dan Hb <7 g/dL dicantumkan sebagai indikasi transfusi. WHO 2024 memperbarui batas hemoglobin untuk klasifikasi anemia, sedangkan AABB 2023 menganjurkan strategi restriktif dengan mempertimbangkan transfusi pada pasien dewasa rawat inap stabil saat Hb <7 g/dL serta tetap menilai gejala dan konteks. NICE NG88 meminta hitung darah lengkap pada heavy menstrual bleeding tetapi tidak menganjurkan ferritin rutin; evaluasi penyebab dan pilihan terapi mengikuti stabilitas, preferensi, kontrasepsi, serta kebutuhan fertilitas.',
    catatanRealita: 'Sukamaju dapat mengulang Hb dan tes kehamilan; darah lengkap terjadwal, sedangkan ferritin/retikulosit memakai jejaring. Hb 5,8 dengan gejala tidak menunggu pemeriksaan lanjutan itu. Rujukan harus membawa pola perdarahan, kontrasepsi, tanda vital, Hb, hasil tes kehamilan, dan terapi yang sudah diberikan.',
    mutiaraEbm: 'Pasien masih bisa berjalan sendiri ke Puskesmas dan tekanan darahnya normal — dua hal yang membuat Hb 5,8 terasa "tidak segawat angkanya". Itu jebakan adaptasi anemia kronik: tubuh menaikkan curah jantung dan menggeser kurva disosiasi oksigen selama berbulan-bulan, sehingga tanda vital tetap tenang sampai cadangan itu habis mendadak. Perhatikan juga SpO2 98% yang tampak menenangkan — saturasi hanya mengukur PERSEN hemoglobin yang terisi oksigen, bukan berapa banyak hemoglobin yang ada. Pada Hb 5,8, saturasi 98% berarti hampir seluruh dari sangat sedikit itu terisi penuh, dan pasien tetap kekurangan oksigen.',
    konsekuensi: {
      narasi: 'Bila rujukan ditolak atau tidak tersambung dan pasien hanya dibekali tablet besi, perdarahan dapat terus melampaui penggantian besi. Cabang simulasi ini menggambarkan perburukan yang mungkin pada anemia sangat berat, bukan kepastian gagal jantung dalam hitungan hari.',
      kembaliHariMin: 5,
      kembaliHariMax: 14,
      kondisiKembali: 'Dalam cabang tanpa rujukan, pasien kembali setelah perdarahan berlanjut dengan sesak saat istirahat, nyeri dada, dan presinkop — anemia memburuk yang memerlukan penanganan rumah sakit segera.',
      guideline: 'PPK 1186/2022 / WHO 2024 / AABB 2023 / NICE NG88 — rujuk anemia berat bergejala, pertimbangkan transfusi berdasarkan Hb dan konteks, serta cari dan atasi sumber perdarahan.',
    },
  }),

  /* ======================================================================
   * 6. Kaki Diabetik Terinfeksi (E11.5, SKDI 3B) — RUJUK penyakit dalam
   * Poin ajar: TIDAK NYERI = neuropati, bukan tanda membaik. Jangan insisi/
   *   debridemen kaki iskemik di FKTP tanpa penilaian vaskular.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_kaki_diabetik_infeksi',
    nama: 'Kaki Diabetik Terinfeksi',
    icd10: 'E11.5',
    skdi: '3B',
    kategori: 'metabolik',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'penyakit_dalam',
    keluhanUtama: 'Ada luka di jempol kaki saya dok, awalnya kecil, sekarang bernanah dan baunya tidak enak.',
    demografi: { usiaMin: 50, usiaMax: 70 },
    vital: { td: '140/85', nadi: 96, rr: 20, suhu: 37.8, spo2: 97 },
    pembuka: {
      tanya: 'Lukanya mulai kapan dan bagaimana awalnya sampai jadi seperti ini?',
      jawab: 'Kira-kira tiga minggu dok. Awalnya cuma lecet kecil kena sandal jepit, saya kira sepele. Lama-lama melebar, sekarang bernanah dan baunya menyengat sampai keluarga menegur.',
      oldcarts: ['onset', 'durasi', 'karakter'],
      variasi: {
        polos: 'Kirang langkung tigang minggu dok. Wiwitane namung lecet alit kenging sandhal. Kula kinten mboten napa-napa. Lha kok saiki nanahen lan mambu banget.',
        lansia: 'Sudah tiga minggu, Nak. Awalnya cuma lecet kecil kena sandal. Saya pikir nanti sembuh sendiri seperti biasa. Sekarang malah bernanah dan bau, Nak.',
      },
    },
    pertanyaan: [
      {
        id: 'q_nyeri',
        kategori: 'rps',
        tanya: 'Lukanya terasa nyeri tidak?',
        jawab: 'Justru tidak sakit sama sekali dok. Itu yang bikin saya santai, saya pikir kalau tidak sakit berarti tidak apa-apa. Makanya saya baru datang sekarang setelah baunya tercium.',
        esensial: true,
        oldcarts: ['karakter', 'keparahan'],
        variasi: {
          skeptis: 'Tidak sakit sama sekali dok. Jadi menurut saya ini tidak parah, wong tidak terasa apa-apa. Istri saya saja yang memaksa ke sini gara-gara baunya. Perlu banget ya ke rumah sakit?',
          terpelajar: 'Anehnya sama sekali tidak nyeri dok. Justru itu yang membuat saya menunda datang — saya pikir kalau tidak sakit berarti tidak serius.',
        },
      },
      {
        id: 'q_rasa_kaki',
        kategori: 'rps',
        tanya: 'Bagaimana rasa di telapak kaki? Ada kebas, kesemutan, atau seperti memakai kaus kaki tebal?',
        jawab: 'Kebas dok, sudah bertahun-tahun. Kalau jalan rasanya seperti menginjak busa, kaki saya sendiri terasa bukan milik saya. Malam kadang kesemutan dan panas.',
        esensial: true,
        oldcarts: ['durasi', 'karakter'],
      },
      {
        id: 'q_dm',
        kategori: 'rpd',
        tanya: 'Kencing manisnya sudah berapa lama? Obatnya bagaimana, dan gula darah terakhir berapa?',
        jawab: 'Sudah lima belas tahun dok. Obat minum saya sering lupa, kadang habis tidak ditebus. Terakhir periksa gula dua tahun lalu, angkanya tidak ingat, pokoknya tinggi.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_jalan',
        kategori: 'rps',
        tanya: 'Kalau berjalan agak jauh, ada nyeri di betis yang memaksa berhenti lalu hilang saat istirahat?',
        jawab: 'Iya dok, jalan sekitar seratus meter betis saya seperti dijepit, harus berhenti dulu. Kalau sudah istirahat sebentar bisa jalan lagi.',
        esensial: true,
        oldcarts: ['agravasi', 'lokasi'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Ada demam, menggigil, atau badan lemas belakangan ini?',
        jawab: 'Agak meriang dua hari ini dok, tapi tidak sampai menggigil. Badan memang terasa lebih lemas dari biasanya.',
        esensial: true,
        oldcarts: ['onset', 'penyerta'],
      },
      {
        id: 'q_alas_kaki',
        kategori: 'sosial',
        tanya: 'Sehari-hari pakai alas kaki apa? Pernah memeriksa telapak kaki sendiri?',
        jawab: 'Sandal jepit dok, kadang nyeker kalau di rumah dan di kebun. Memeriksa telapak kaki? Tidak pernah dok, tidak kepikiran sama sekali.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_luka_lama',
        kategori: 'rpd',
        tanya: 'Pernah ada luka di kaki sebelumnya? Berapa lama sembuhnya?',
        jawab: 'Pernah dok, dua tahun lalu di tumit. Sembuhnya lama sekali, hampir empat bulan, itu pun bekasnya masih ada.',
        oldcarts: ['durasi'],
      },
      {
        id: 'q_mata_ginjal',
        kategori: 'rpd',
        tanya: 'Bagaimana penglihatannya belakangan? Pernah diperiksa mata atau ginjal karena kencing manis?',
        jawab: 'Penglihatan makin kabur dok, baca tulisan kecil sudah tidak bisa. Diperiksa mata karena kencing manis belum pernah, ginjal juga belum.',
      },
      {
        id: 'q_merokok_dm',
        kategori: 'sosial',
        tanya: 'Bapak merokok?',
        jawab: 'Masih dok, sehari sekitar sepuluh batang, sudah puluhan tahun.',
      },
      {
        id: 'q_cucu',
        kategori: 'sosial',
        tanya: 'Di rumah tinggal dengan siapa saja Pak?',
        jawab: 'Sama istri dan dua cucu dok, anak saya kerja di kota.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'ekstremitas', temuan: 'Ulkus 4x3 cm di plantar ibu jari kaki kanan, dasar kotor dengan pus kental dan bau busuk; tepi menghitam (nekrosis), tampak menembus sampai jaringan dalam dan probe menyentuh dasar keras. Eritema meluas 3 cm dari tepi luka, punggung kaki bengkak dan hangat.', relevan: true },
      { region: 'umum', temuan: 'Kompos mentis, tampak tidak sakit berat; tidak ada takipnea maupun hipotensi (belum sepsis).', relevan: true },
      { region: 'kulit', temuan: 'Kulit tungkai bawah kering, mengkilat, dan tidak berambut; kuku menebal. Kalus tebal di kepala metatarsal — tanda titik tekanan berulang.', relevan: true },
      { region: 'neurologis', temuan: 'Sensasi raba, getar, dan monofilamen 10 g hilang pada kedua telapak kaki hingga pergelangan (pola kaus kaki); refleks tumit menurun bilateral.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, tidak ada murmur; nadi dorsalis pedis dan tibialis posterior kanan sulit teraba, kiri melemah — perfusi perifer terganggu.', relevan: true },
      { region: 'abdomen', temuan: 'Supel, tidak nyeri tekan, bising usus normal, hepar/lien tidak membesar.', relevan: false },
    ],
    lab: [
      { id: 'gds', hasil: 'Gula darah sewaktu 318 mg/dL.', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['E11.5', 'L03.1', 'M86.9'],
    tatalaksana: {
      obatBenar: [],
      prosedur: ['pasang_infus', 'antibiotik_parenteral_kaki_diabetik_protokol', 'balut_luka_kaki_diabetik_pra_rujuk', 'pemantauan_ketat_vital'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Infeksi ringan tertentu dapat disebabkan terutama oleh kokus Gram-positif, tetapi kasus ini tidak ringan: ulkusnya dalam, berbau, nekrotik, disertai iskemia dan curiga tulang terlibat. Amoksisilin polos tidak memadai sebagai regimen tunggal untuk profil limb-threatening ini; antibiotik awal harus mengikuti protokol infeksi kaki diabetik/jejaring dan tidak boleh menjadi alasan menunda source control.', bahaya: 'nonPrimer' },
        { id: 'metformin_500', alasan: 'Metformin bukan terapi akut untuk infeksi tungkai atau gula 318 mg/dL dan tidak boleh menggantikan penilaian metabolik rumah sakit. Keputusan melanjutkan atau menahan metformin bergantung pada fungsi ginjal, perfusi, hipoksia, dan rencana prosedur; jangan mengarang kontraindikasi hipoperfusi pada pasien yang saat ini masih hemodinamik stabil.', bahaya: 'nonPrimer' },
      ],
      tindakanSalahUmum: [
        { id: 'insisi_abses', alasan: 'Insisi atau debridemen tajam buta di FKTP berbahaya pada kaki dengan iskemia, nekrosis, dan dugaan infeksi dalam. Namun ini bukan alasan menunggu perfusi sempurna sebelum semua source control: IWGDF/IDSA meminta konsultasi bedah DAN vaskular segera agar drainase/debridemen awal serta revaskularisasi diatur menurut urgensi. Tugas FKTP adalah melindungi luka tanpa probing, memberi terapi awal, dan mempercepat jalur multidisiplin.', bahaya: 'berbahaya' },
      ],
      edukasi: ['perawatan_kaki_diabetik', 'diet_dm', 'kepatuhan_obat', 'tanda_bahaya', 'kontrol_rutin'],
      // Kaki sebelahnya punya neuropati dan iskemia yang SAMA. Tanpa edukasi
      // ini, pasien yang selamat dari kaki kanan kembali dengan kaki kiri.
      edukasiKritis: ['perawatan_kaki_diabetik'],
      terapiKritis: ['antibiotik_parenteral_kaki_diabetik_protokol'],
    },
    stabilisasiWajib: ['pasang_infus', 'antibiotik_parenteral_kaki_diabetik_protokol', 'pemantauan_ketat_vital'],
    clue: 'Ulkus plantar dalam dengan pus, bau, nekrosis, selulitis lebih dari 2 cm, probe-to-bone positif, neuropati, dan penyakit arteri perifer adalah infeksi kaki diabetik sedang yang disertai komorbiditas kunci dan mengancam tungkai; hitung darah atau HbA1c tidak diperlukan untuk membuat keputusan akut ini. Di FKTP: nilai perfusi dan tanda sistemik, lindungi luka dengan balutan bersih nonadheren tanpa probing/debridemen tajam, off-load tekanan, pasang akses, mulai antibiotik parenteral sesuai protokol jejaring, pantau, lalu transfer untuk tim kaki diabetik yang mencakup bedah dan vaskular. Imaging tulang, kultur jaringan dalam, source control, revaskularisasi, dan kendali glikemik definitif dilakukan pada jalur rumah sakit.',
    panduanResmi: `${PPK_FLOOR} PPK 1186/2022 tidak mempunyai bab lengkap infeksi kaki diabetik; bab diabetes hanya menjadi sumber terkait. IWGDF/IDSA 2023 menganjurkan hospitalisasi untuk infeksi berat atau infeksi sedang dengan komorbiditas penting seperti PAD; konsultasi bedah segera untuk gangren, nekrosis, abses dalam, atau iskemia berat; serta konsultasi bedah dan vaskular bersama untuk menentukan urutan drainase/debridemen dan revaskularisasi. Probe-to-bone adalah bagian evaluasi awal osteomielitis, bukan bukti tunggal yang meniadakan pencitraan atau kultur tulang.`,
    catatanRealita: 'Pada encounter ini jejaring telah mengonfirmasi satu dosis awal antibiotik parenteral berbasis protokol, akses IV, balutan, monitoring, dan transport siap; regimen lengkap disesuaikan di RS menurut derajat infeksi, alergi, fungsi ginjal, kultur, dan resistensi lokal. CBC tidak menjadi syarat transfer. Bila monofilamen 10 g tidak ready, riwayat kebas dan uji sensasi sederhana tetap tidak boleh menghambat rujuk.',
    mutiaraEbm: 'Hilangnya nyeri BUKAN tanda luka membaik — justru sebaliknya. Pada kaki diabetik, tidak adanya nyeri berarti neuropati sudah memutus sistem peringatan tubuh, sehingga pasien terus menapak di atas luka yang menggerogoti jaringan sampai ke tulang. Luka yang paling tidak terasa sering kali luka yang paling dalam. Waspadai juga leukosit dan demam yang "cuma segini": pada diabetes, respons inflamasi tumpul, sehingga infeksi kaki yang mengancam tungkai kerap berjalan dengan suhu nyaris normal.',
    konsekuensi: {
      narasi: 'Bila hanya dibersihkan dan diberi antibiotik lemah lalu dipulangkan, infeksi menembus ke tulang dan bidang jaringan dalam pada kaki yang pasokan darahnya sudah tidak memadai. Insisi di FKTP tanpa penilaian vaskular mempercepatnya.',
      kembaliHariMin: 7,
      kembaliHariMax: 21,
      kondisiKembali: 'Pasien dibawa kembali dengan seluruh punggung kaki bengkak kehitaman, nanah merembes, demam tinggi, dan kesadaran menurun — sepsis dari kaki diabetik yang berujung amputasi.',
      guideline: 'IWGDF/IDSA 2023 — infeksi sedang dengan PAD/nekrosis atau dugaan infeksi dalam memerlukan jalur rumah sakit, antibiotik, dan konsultasi bedah-vaskular segera untuk mengoordinasikan source control serta revaskularisasi.',
    },
  }),

  /* ======================================================================
   * 7. TB Paru RR setelah Putus Pengobatan (A15.9, SKDI 3A) — RUJUK paru
   * Poin ajar: resistansi rifampisin adalah RR-TB, bukan otomatis MDR-TB.
   *   Jangan mengulang OAT lini-1 atau memberi kuinolon ad hoc; hubungkan pasien,
   *   hasil TCM, notifikasi, dan seluruh kontak ke jalur program yang sama.
   * CATATAN: TANPA konfirmasiWajib (lihat catatan file di atas).
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_tb_paru_putus_obat_suspek_mdr',
    nama: 'TB Paru Resistan Rifampisin setelah Putus Pengobatan',
    icd10: 'A15.9',
    skdi: '3A',
    kategori: 'respirasi',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'paru',
    keluhanUtama: 'Batuk saya berdarah lagi dok, berat badan turun terus, dan malam sering berkeringat.',
    demografi: { usiaMin: 25, usiaMax: 50 },
    vital: { td: '110/70', nadi: 98, rr: 22, suhu: 37.6, spo2: 96 },
    pembuka: {
      tanya: 'Batuk darahnya sejak kapan, dan seberapa banyak?',
      jawab: 'Sudah tiga minggu dok, muncul lagi. Dahaknya bercampur darah segar, kira-kira satu sendok tiap kali batuk. Malamnya saya berkeringat sampai baju dan sprei basah.',
      oldcarts: ['onset', 'durasi', 'keparahan', 'karakter'],
      variasi: {
        cemas: 'Tiga minggu dok, dan sekarang darahnya makin banyak! Saya takut sekali. Dulu saya sudah berobat kok, kenapa balik lagi? Apa ini kanker dok? Saya tidak berani cerita ke keluarga.',
        polos: 'Watuk kula medal rahe maneh dok, wis telung minggu. Riyin nate berobat nanging kula mandheg. Bengi kringeten terus ngantos klambi teles.',
      },
    },
    pertanyaan: [
      {
        id: 'q_oat_lalu',
        kategori: 'rpd',
        tanya: 'Sebelumnya pernah berobat paru? Berapa lama minum obatnya dan apakah tuntas?',
        jawab: 'Pernah dok, dua tahun lalu. Saya minum obat merah-merah itu tiga bulan, terus saya berhenti sendiri karena sudah merasa enak, badan sudah sehat. Katanya harus enam bulan, tapi saya sudah tidak batuk waktu itu jadi buat apa diteruskan.',
        esensial: true,
        oldcarts: ['durasi'],
        variasi: {
          skeptis: 'Pernah dok, dua tahun lalu, tapi cuma tiga bulan. Saya berhenti karena sudah sembuh, buat apa minum obat kalau sudah sehat? Obat itu bikin mual dan kencing saya merah, malah bikin sakit. Sekarang kambuh lagi, berarti obatnya memang tidak manjur kan?',
        },
      },
      {
        id: 'q_berat',
        kategori: 'rps',
        tanya: 'Berat badannya turun berapa, dalam berapa lama?',
        jawab: 'Turun sekitar sembilan kilo dalam tiga bulan dok. Celana saya sampai melorot, harus pakai ikat pinggang lubang paling ujung.',
        esensial: true,
        oldcarts: ['durasi', 'keparahan'],
      },
      {
        id: 'q_kontak',
        kategori: 'sosial',
        tanya: 'Di rumah atau tempat kerja ada yang batuk lama, atau sedang berobat paru?',
        jawab: 'Ada dok, tetangga sebelah rumah sedang berobat TB. Saya tidak tahu jenis TB atau hasil pemeriksaannya, hanya tahu obatnya banyak dan harus diminum teratur.',
        esensial: true,
      },
      {
        id: 'q_serumah',
        kategori: 'sosial',
        tanya: 'Di rumah tinggal berapa orang? Ada balita, lansia, atau orang berdaya tahan lemah?',
        jawab: 'Berlima dok, ada istri, dua anak, yang bungsu masih empat tahun, dan ibu saya yang sudah sepuh.',
        esensial: true,
      },
      {
        id: 'q_hiv',
        kategori: 'rpd',
        tanya: 'Pernah tes HIV, atau punya kencing manis?',
        jawab: 'Belum pernah tes HIV dok. Kencing manis tidak ada, terakhir periksa gula normal.',
        esensial: true,
      },
      {
        id: 'q_sesak',
        kategori: 'rps',
        tanya: 'Ada sesak napas atau nyeri dada saat menarik napas dalam?',
        jawab: 'Sesak kalau naik tangga saja dok. Dada kanan atas kadang nyeri kalau batuknya keras.',
        oldcarts: ['lokasi', 'agravasi'],
      },
      {
        id: 'q_antibiotik',
        kategori: 'rpd',
        tanya: 'Tiga bulan ini sudah minum antibiotik dari mana saja? Ada yang membaik?',
        jawab: 'Sudah dok, dua kali saya ke klinik dan dikasih antibiotik, saya lupa namanya. Membaik sebentar, tiga hari enak, terus balik lagi batuknya.',
        oldcarts: ['durasi'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Demamnya bagaimana polanya? Muncul jam berapa?',
        jawab: 'Meriang terutama sore menjelang malam dok, pagi biasanya enak. Tidak pernah tinggi sekali, cuma hangat-hangat terus.',
        oldcarts: ['waktu', 'karakter'],
      },
      {
        id: 'q_merokok',
        kategori: 'sosial',
        tanya: 'Merokok tidak Pak?',
        jawab: 'Dulu iya dok, sehari setengah bungkus. Sejak batuk darah saya berhenti total.',
      },
      {
        id: 'q_makanan',
        kategori: 'sosial',
        tanya: 'Ada pantangan makanan yang sedang dijalani?',
        jawab: 'Tidak ada dok. Cuma memang nafsu makan saya hilang, jadi makan sedikit.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak kurus dengan atrofi otot temporal dan bahu (wasting); konjungtiva anemis ringan.', relevan: true },
      { region: 'toraks_paru', temuan: 'Suara napas bronkial dan ronki basah kasar di apeks paru kanan; perkusi redup di apeks kanan. Retraksi tidak ada.', relevan: true },
      { region: 'kepala_leher', temuan: 'Kelenjar getah bening supraklavikula kanan teraba beberapa buah, kenyal, tidak nyeri.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, takikardia ringan, tidak ada murmur.', relevan: false },
      { region: 'abdomen', temuan: 'Datar, supel; hepar dan lien tidak membesar.', relevan: false },
    ],
    lab: [
      { id: 'tcm_sputum', hasil: 'Dahak: MTB terdeteksi; resistansi rifampisin terdeteksi. Resistansi isoniazid dan fluorokuinolon belum diketahui.', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['A15.9', 'J18.9', 'C34.9'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [
        // INTI PEDAGOGIS KASUS INI.
        { id: 'oat_kdt', alasan: 'Mengulang KDT lini pertama setelah TCM menunjukkan resistansi rifampisin tidak memberi regimen TB-RR yang adekuat. Tindakan itu dapat menunda terapi efektif dan menyeleksi resistansi tambahan; pilihan regimen harus mengikuti penilaian layanan TB-RO dan hasil uji kepekaan lanjutan.', bahaya: 'kontraindikasi' },
        { id: 'ciprofloxacin_500', alasan: 'Kuinolon dapat menekan gejala TB sementara, menunda diagnosis, dan menyeleksi resistansi terhadap kelas obat penting dalam regimen TB resistan. Jangan mengobati gambaran ini sebagai pneumonia dengan fluorokuinolon ad hoc.', bahaya: 'kontraindikasi' },
        { id: 'ambroxol_30', alasan: 'Mukolitik hanya menyentuh keluhan, tidak menyentuh penyakitnya. Bahayanya bukan pada obatnya, melainkan pada rasa "sudah diobati" yang ditimbulkannya — pasien pulang membawa sesuatu, dan rujukan ke layanan TB resistan obat tertunda sementara ia terus menulari serumahnya.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['alur_tb_ro_jejaring', 'investigasi_kontak_tb', 'etika_batuk', 'tanda_bahaya'],
      edukasiKritis: ['alur_tb_ro_jejaring', 'investigasi_kontak_tb'],
    },
    clue: 'TB PARU RESISTAN RIFAMPISIN (RR-TB; SKDI 3A - RUJUK): gejala TB aktif muncul kembali setelah pengobatan dihentikan pada bulan ketiga, dan TCM dahak mendeteksi MTB serta resistansi rifampisin. Ini belum boleh disebut MDR-TB karena resistansi isoniazid belum dibuktikan; istilah program yang tepat adalah MDR/RR-TB sampai uji kepekaan lanjutan memisahkan keduanya. Di FKTP: terapkan pengendalian infeksi, catat-notifikasi kasus, kirim/teruskan hasil TCM, hubungkan hari yang sama ke layanan TB-RO, dan mulai investigasi kontak. Jangan mengulang KDT lini pertama atau merakit regimen sendiri.',
    panduanResmi: `${PPK_FLOOR} PPK dan PNPK TB menempatkan riwayat pengobatan sebelumnya serta kecurigaan resistansi sebagai jalur program/rujukan. WHO Module 3 (2025) mengutamakan uji molekuler cepat untuk mendeteksi TB dan resistansi rifampisin; WHO Module 4 (2025) memakai regimen MDR/RR-TB modern yang dipilih dari pola resistansi, kelayakan pasien, dan kapasitas program — bukan otomatis "OAT enam bulan" atau pengulangan lini pertama.`,
    catatanRealita: 'Sukamaju tidak diasumsikan memiliki mesin TCM onsite. Dahak dikirim melalui jejaring program, hasil ditautkan kembali ke pasien dan layanan TB-RO, serta kasus dicatat agar tidak hilang di antara klinik, laboratorium, dan program. Anak usia empat tahun, lansia serumah, dan kontak erat lain harus masuk daftar investigasi kontak; TPT baru dipilih program setelah TB aktif disingkirkan dan pola pajanan dipertimbangkan.',
    mutiaraEbm: 'Resistansi rifampisin tidak identik dengan MDR-TB: MDR memerlukan resistansi terhadap rifampisin DAN isoniazid. Namun keduanya dikelola dalam kelompok MDR/RR-TB karena sama-sama memerlukan jalur obat resistan. Perbaikan gejala pada bulan awal bukan bukti eradikasi; dukungan kepatuhan harus mencari penyebab putus obat, menyepakati cara kembali bila efek samping muncul, dan memastikan transfer benar-benar diterima layanan tujuan.',
    konsekuensi: {
      narasi: 'Bila KDT lini pertama diulang atau handoff program tidak ditutup, terapi efektif tertunda, risiko resistansi tambahan meningkat, dan kontak serumah tetap terpajan tanpa skrining maupun penilaian pencegahan.',
      kembaliHariMin: 30,
      kembaliHariMax: 90,
      kondisiKembali: 'Pasien kembali dengan batuk darah lebih banyak dan berat badan turun; layanan TB-RO tidak pernah menerima rujukannya, sedangkan anak bungsunya kini mulai batuk lama dan belum pernah diskrining.',
      guideline: 'PPK/PNPK TB Indonesia; WHO Consolidated Guidelines Module 3 (2025), Module 4 (2025), dan Module 1 TPT (2024) — diagnosis cepat, terapi MDR/RR-TB terprogram, dukungan kepatuhan, serta investigasi kontak membentuk satu episode layanan.',
    },
  }),

  /* ======================================================================
   * 8. Hepatitis B Kronik (B18.1, SKDI 3A) — RUJUK penyakit dalam
   * Poin ajar: kasus sengaja TENANG — tanpa gejala BUKAN berarti tanpa tindakan.
   *   Tindakannya konseling + vaksinasi kontak + rujuk penilaian antivirus,
   *   bukan meresepkan sesuatu supaya pasien merasa dilayani.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_hepatitis_b_kronik',
    nama: 'Hepatitis B Kronik Tanpa Gejala',
    icd10: 'B18.1',
    skdi: '3A',
    kategori: 'infeksi',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'penyakit_dalam',
    keluhanUtama: 'Saya sebenarnya tidak sakit apa-apa dok, tapi darah saya ditolak waktu mau donor karena katanya ada virus hepatitis B.',
    demografi: { usiaMin: 30, usiaMax: 50 },
    vital: { td: '118/76', nadi: 78, rr: 18, suhu: 36.6, spo2: 99 },
    pembuka: {
      tanya: 'Ceritakan bagaimana awalnya ketahuan, dan apakah ada keluhan yang dirasakan?',
      jawab: 'Bulan lalu saya donor darah di kantor dok. Seminggu kemudian saya dapat surat, katanya darah saya tidak bisa dipakai, ada hepatitis B. Saya kaget sekali, padahal badan saya sehat, kerja normal, tidak ada keluhan apa pun.',
      oldcarts: ['onset', 'durasi'],
      variasi: {
        cemas: 'Saya donor bulan lalu dok, terus dapat surat katanya darah saya ada hepatitis B. Saya langsung tidak bisa tidur seminggu. Ini menular ya dok? Anak saya bagaimana? Istri saya bagaimana? Saya browsing katanya bisa jadi kanker hati. Umur saya tinggal berapa lama dok?',
        terpelajar: 'Bulan lalu saya ikut donor darah di kantor dok, lalu diberitahu hasil skriningnya HBsAg reaktif sehingga darah saya tidak dipakai. Saya benar-benar tidak merasakan keluhan apa pun. Yang ingin saya tahu: apa artinya ini, dan apa yang harus saya lakukan sekarang?',
      },
    },
    pertanyaan: [
      {
        id: 'q_keluhan_hati',
        kategori: 'rps',
        tanya: 'Ada mata atau kulit menguning, air kencing seperti teh, mual, atau perut kanan atas terasa penuh?',
        jawab: 'Tidak ada sama sekali dok. Mata saya putih bersih, kencing normal, makan enak, perut tidak ada keluhan. Itu yang bikin saya bingung, kalau sakit kenapa saya tidak merasa apa-apa?',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_lelah',
        kategori: 'rps',
        tanya: 'Belakangan gampang lelah atau nafsu makan menurun?',
        jawab: 'Tidak dok, saya masih main bola tiap minggu dan kerja lembur pun kuat. Berat badan juga stabil.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_ibu',
        kategori: 'rpk',
        tanya: 'Ibu kandung atau saudara kandung ada yang sakit hepatitis, sakit kuning, atau sakit hati?',
        jawab: 'Ibu saya meninggal enam tahun lalu dok, katanya karena sakit liver, perutnya membesar berisi air sebelum meninggal. Kakak saya juga pernah bilang darahnya bermasalah waktu mau donor, sama seperti saya.',
        esensial: true,
      },
      {
        id: 'q_istri_anak',
        kategori: 'sosial',
        tanya: 'Di rumah ada istri dan anak? Apakah mereka sudah pernah diperiksa atau divaksin hepatitis B?',
        jawab: 'Ada dok, istri dan dua anak. Yang kecil umur tiga tahun. Diperiksa hepatitis belum pernah semua. Vaksin? Anak-anak mungkin waktu bayi ya dok, saya kurang ingat. Istri saya setahu saya belum pernah.',
        esensial: true,
      },
      {
        id: 'q_risiko',
        kategori: 'rpd',
        tanya: 'Pernah transfusi darah, tato, tindik, atau berbagi alat cukur dan sikat gigi?',
        jawab: 'Tato tidak ada dok, transfusi tidak pernah. Alat cukur di rumah memang satu dipakai bergantian dengan adik saya. Sikat gigi masing-masing.',
        esensial: true,
      },
      {
        id: 'q_alkohol_hbv',
        kategori: 'sosial',
        tanya: 'Ada kebiasaan minum minuman beralkohol?',
        jawab: 'Sesekali dok, kalau ada acara kantor atau kumpul teman, mungkin sebulan sekali dua kali. Tidak rutin.',
        esensial: true,
      },
      {
        id: 'q_obat_jamu',
        kategori: 'rpd',
        tanya: 'Ada minum jamu, suplemen, atau obat rutin?',
        jawab: 'Tidak ada dok. Setelah dapat surat itu saya sempat mau beli obat herbal untuk liver yang diiklankan di internet, tapi belum jadi. Bagus tidak dok?',
      },
      {
        id: 'q_kerja',
        kategori: 'sosial',
        tanya: 'Pekerjaannya apa? Ada kontak dengan darah atau jarum?',
        jawab: 'Saya staf administrasi dok, di kantor saja. Tidak ada urusan dengan darah atau jarum.',
      },
      {
        id: 'q_hbsag_lama',
        kategori: 'rpd',
        tanya: 'Sebelum donor ini pernah ada hasil HBsAg reaktif atau pemeriksaan hepatitis B lain?',
        jawab: 'Sepuluh bulan lalu saat medical check-up kerja, HBsAg saya juga tertulis reaktif. Saya merasa sehat jadi tidak menindaklanjuti; hasil kertasnya masih saya simpan.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_olahraga_hbv',
        kategori: 'sosial',
        tanya: 'Rutin olahraga apa?',
        jawab: 'Main bola tiap Minggu pagi dok, sama teman-teman kompleks. Sudah bertahun-tahun.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sehat dan bugar; tidak ikterik, tidak pucat. Tidak ada spider naevi, tidak ada eritema palmaris, tidak ada ginekomastia — tanpa stigmata penyakit hati kronik.', relevan: true },
      { region: 'abdomen', temuan: 'Datar dan supel; hepar tidak teraba dan tidak nyeri, lien tidak membesar; shifting dullness negatif (tidak ada asites).', relevan: true },
      { region: 'kulit', temuan: 'Tidak ada memar spontan, tidak ada petekie, tidak ada bekas garukan.', relevan: true },
      { region: 'neurologis', temuan: 'Kesadaran penuh dan orientasi baik; asteriksis negatif.', relevan: true },
      { region: 'ekstremitas', temuan: 'Tidak ada edema tungkai; kuku normal.', relevan: false },
    ],
    lab: [
      { id: 'hbsag', hasil: 'HBsAg reaktif; hasil terdokumentasi sepuluh bulan sebelumnya juga reaktif, sehingga persistensi lebih dari enam bulan terbukti.', flag: 'abnormal', relevan: true },
      { id: 'sgot_sgpt', hasil: 'AST 28 U/L dan ALT 33 U/L pada pemeriksaan jejaring. Satu hasil ALT normal tidak menentukan stadium atau kebutuhan terapi.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['B18.1', 'B18.2', 'K76.0'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [
        { id: 'vitamin_b_kompleks', alasan: 'Godaan terbesar pada kasus tenang adalah meresepkan SESUATU supaya pasien merasa dilayani. Vitamin dan "penguat liver" tidak mengubah perjalanan hepatitis B kronik sedikit pun — dan ia menukar hal yang benar-benar berharga hari ini (konseling, pemeriksaan dan vaksinasi keluarga serumah, rujukan untuk penilaian antivirus) dengan sekantong pil yang menenangkan tetapi kosong.', bahaya: 'nonPrimer' },
        { id: 'asiklovir_400', alasan: 'Asiklovir bekerja pada virus golongan herpes, bukan virus hepatitis B — dua keluarga virus yang sama sekali berbeda. Kata "antivirus" pada label tidak berarti antivirus untuk virus ini.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['rencana_hbv_jejaring', 'cegah_penularan_hepatitis_b', 'pantang_alkohol_hati', 'tanda_bahaya'],
      // Inilah "tindakan" pada kasus tanpa gejala — dan ia melindungi orang
      // yang bahkan belum masuk ruang periksa: istri dan kedua anaknya.
      edukasiKritis: ['rencana_hbv_jejaring', 'cegah_penularan_hepatitis_b'],
    },
    clue: 'HEPATITIS B KRONIK TANPA GEJALA (SKDI 3A - RUJUK TERENCANA): dua hasil HBsAg reaktif yang terpisah sepuluh bulan membuktikan persistensi lebih dari enam bulan. Riwayat penyakit hati pada ibu menaikkan kecurigaan pajanan masa kecil/perinatal, tetapi tidak membuktikan rute penularan. Tindakan FKTP hari ini adalah menilai tanda dekompensasi dan komorbid, menjelaskan cara penularan tanpa stigma, menguji serta memvaksin kontak yang masih rentan, dan menutup rujukan untuk stadium fibrosis, HBV DNA, koinfeksi, indikasi antivirus, serta rencana surveilans.',
    panduanResmi: `${PPK_FLOOR} Bab hepatitis B pada PPK memberi floor pengenalan dan rujukan, tetapi tidak memuat algoritma hepatitis B kronik selengkap PNPK Hepatitis B. WHO 2024 memperluas kriteria terapi: fibrosis bermakna/sirosis; HBV DNA di atas 2.000 IU/mL dengan ALT meningkat; atau faktor risiko khusus seperti koinfeksi, imunosupresi, manifestasi ekstrahepatik, komorbid tertentu, dan riwayat keluarga kanker hati/sirosis. Bila HBV DNA tidak tersedia, ALT abnormal persisten dapat dipakai dalam algoritma sederhana. Hasil HBsAg reaktif atau satu ALT normal saja tidak cukup untuk memilih terapi.`,
    catatanRealita: 'Di Sukamaju, HBsAg cepat tersedia; ALT terjadwal lewat jejaring, sedangkan HBV DNA/elastografi membutuhkan layanan lanjutan. FKTP tetap mendaftarkan kontak keluarga, menilai kerentanan, memvaksin yang perlu, dan melacak rujukan. Jalur nasional ibu-anak memberi HB0 dan HBIg kurang dari 24 jam kepada bayi dari ibu HBsAg reaktif, dilanjutkan imunisasi dan evaluasi program.',
    mutiaraEbm: 'Satu nilai ALT normal bukan surat bebas risiko. WHO 2024 menilai fibrosis, replikasi virus, koinfeksi, komorbid, imunosupresi, manifestasi ekstrahepatik, dan riwayat keluarga sebagai cabang keputusan tersendiri. Sebaliknya, tidak setiap orang HBsAg-positif perlu langsung diberi antivirus: nilai pedagogis kasus ini adalah memastikan staging dan retensi layanan tanpa mengobati angka tunggal.',
    konsekuensi: {
      narasi: 'Bila pasien dipulangkan tanpa cascade keluarga dan rujukan tertutup, stadium penyakit serta indikasi antivirus tidak pernah dinilai, kontak yang rentan tidak divaksin, dan pemantauan jangka panjang putus sebelum risiko dapat dikelola.',
      kembaliHariMin: 120,
      kembaliHariMax: 240,
      kondisiKembali: 'Pasien kembali beberapa bulan kemudian: istrinya baru diketahui HBsAg reaktif (waktu penularan tidak dapat dipastikan), satu anak terbukti masih rentan dan belum mendapat vaksinasi catch-up, sedangkan pasien belum pernah menjalani staging atau penilaian antivirus.',
      guideline: 'PPK/PNPK Hepatitis B Indonesia, KMK 15/2023 untuk pencegahan ibu-anak, dan WHO Hepatitis B 2024 — diagnosis kronik, cascade keluarga, staging, terapi terpilih, dan retensi pemantauan harus tersambung.',
    },
  }),

  /* ======================================================================
   * 9. PPOK Eksaserbasi Berat dengan Infeksi Saluran Napas Bawah
   *    (J44.0, SKDI 3B) — RUJUK paru
   * Poin ajar: BEDA dari ppok_eksaserbasi (J44.1, eksaserbasi tanpa infeksi
   *   terdokumentasi). J44.0 = eksaserbasi DENGAN infeksi saluran napas bawah
   *   (infiltrat pada foto toraks). Gagal napas mengancam: bicara terputus per
   *   KATA, SpO2 88%. Target oksigen 88-92% — bukan setinggi-tingginya.
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_ppok_eksaserbasi_berat',
    nama: 'PPOK Eksaserbasi Berat dengan Dugaan Infeksi Saluran Napas Bawah',
    icd10: 'J44.0',
    skdi: '3B',
    kategori: 'respirasi',
    fktp144: false,
    harusDirujuk: true,
    // PPOK = salah satu dari 9 kelompok PRB (Perpres JKN). Setelah eksaserbasi
    // ini ditangani RS, maintenance PPOK kronik sah kembali ke FKTP.
    bisaPrb: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'paru',
    keluhanUtama: 'Sesak... berat... dahak... banyak... kuning...',
    demografi: { usiaMin: 55, usiaMax: 75, jenisKelamin: 'L' },
    vital: { td: '134/82', nadi: 118, rr: 32, suhu: 37.9, spo2: 88 },
    pembuka: {
      tanya: 'Sesaknya sejak kapan memberat? Bicara pelan-pelan saja Pak, tidak usah buru-buru.',
      jawab: 'Tiga... hari... makin... berat... Dahak... jadi... kental... kuning... banyak... sekali...',
      oldcarts: ['onset', 'durasi', 'keparahan'],
      variasi: {
        lansia: 'Tiga... hari... Nak... Napas... saya... habis... Dahak... kuning... kental... Saya... tidak... kuat... bicara... panjang...',
        cemas: 'Tiga... hari... dok... Saya... takut... tidak... kuat... Tolong... saya...',
      },
    },
    pertanyaan: [
      {
        id: 'q_dahak',
        kategori: 'rps',
        tanya: 'Apakah warna dan jumlah dahaknya berubah?',
        jawab: 'Dahaknya berubah, Dok. Biasanya bening dan sedikit; tiga hari ini kuning kehijauan, kental, dan banyak sekali sampai satu gelas kecil sehari.',
        olehPendamping: true,
        esensial: true,
        oldcarts: ['karakter', 'onset'],
      },
      {
        id: 'q_demam_ppok',
        kategori: 'rps',
        tanya: 'Ada demam atau menggigil sejak sesaknya memberat?',
        jawab: 'Panas badannya sejak dua hari ini, Dok. Semalam sempat menggigil sampai selimutnya ditumpuk dua.',
        olehPendamping: true,
        esensial: true,
        oldcarts: ['onset', 'penyerta'],
      },
      {
        id: 'q_bicara',
        kategori: 'rps',
        tanya: 'Sejak kapan bicaranya jadi terputus-putus begini? Masih bisa menyelesaikan satu kalimat?',
        jawab: 'Sejak semalam, Dok. Tadi pagi masih bisa bicara beberapa kata sekaligus; sekarang sepatah-sepatah. Makan pun berhenti terus untuk mengambil napas.',
        olehPendamping: true,
        esensial: true,
        oldcarts: ['onset', 'keparahan'],
      },
      {
        id: 'q_kesadaran_ppok',
        kategori: 'rps',
        tanya: 'Ada bingung, mengantuk berat, atau bicara ngelantur?',
        jawab: 'Sejak subuh dia agak bingung, Dok. Saat ditanya nama cucunya, jawabannya salah. Tadi juga sempat sangat mengantuk padahal semalaman tidak tidur.',
        olehPendamping: true,
        esensial: true,
        oldcarts: ['onset', 'keparahan'],
      },
      {
        id: 'q_rokok_ppok',
        kategori: 'sosial',
        tanya: 'Riwayat merokoknya bagaimana Pak?',
        jawab: 'Sejak umur lima belas tahun, Dok, sehari dua bungkus sampai sekarang. Sudah puluhan tahun; disuruh berhenti tidak pernah mau.',
        olehPendamping: true,
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_riwayat_ppok',
        kategori: 'rpd',
        tanya: 'Sudah lama batuk berdahak menahun? Pernah dirawat karena paru?',
        jawab: 'Batuk berdahak tiap pagi sudah bertahun-tahun, Dok; kami pikir batuk perokok biasa. Tahun lalu dirawat empat hari karena sesak, dan setahun ini sudah tiga kali sesak berat begini.',
        olehPendamping: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_inhaler',
        kategori: 'rpd',
        tanya: 'Ada obat semprot atau inhaler dari dokter? Bagaimana cara memakainya?',
        jawab: 'Ada, Dok, tetapi jarang dipakai karena katanya tidak terasa apa-apa. Obat disemprot ke mulut lalu langsung ditelan, tidak ditarik napas dalam. Sudah tiga hari dipakai terus tetapi tidak membantu.',
        olehPendamping: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kaki_ppok',
        kategori: 'rps',
        tanya: 'Kakinya bengkak? Tidur harus pakai bantal tinggi?',
        jawab: 'Kakinya tidak bengkak, Dok. Tidur memang sudah lama setengah duduk karena sesak menahun, bukan keluhan baru.',
        olehPendamping: true,
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_pekerjaan_ppok',
        kategori: 'sosial',
        tanya: 'Dulu Bapak bekerja apa?',
        jawab: 'Sopir angkot selama puluhan tahun, Dok. Sudah berhenti lima tahun lalu karena tidak kuat.',
        olehPendamping: true,
        distraktor: true,
      },
      {
        id: 'q_alergi_ppok',
        kategori: 'rpd',
        tanya: 'Ada alergi obat?',
        jawab: 'Tidak ada yang kami ketahui, Dok. Selama ini minum obat apa saja aman.',
        olehPendamping: true,
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sesak berat, duduk membungkuk bertumpu pada kedua lengan (posisi tripod); bicara terputus PER KATA, tidak mampu menyelesaikan satu kalimat. Otot bantu napas sternokleidomastoideus aktif jelas, napas cuping hidung, retraksi supraklavikula. Gelisah bercampur mengantuk — tanda gagal napas mengancam.', relevan: true },
      { region: 'toraks_paru', temuan: 'Barrel chest, ekspirasi sangat memanjang; wheezing ekspiratoar difus melemah dengan suara napas yang jauh berkurang di seluruh lapang paru (aliran udara minimal). Ronki basah kasar terlokalisir di basal kanan — berbeda dari wheezing difusnya.', relevan: true },
      { region: 'jantung', temuan: 'Takikardia 118x/menit reguler; bunyi jantung jauh dan sulit dinilai karena hiperinflasi; tidak ada gallop.', relevan: true },
      { region: 'ekstremitas', temuan: 'Jari tabuh (clubbing) positif; akral hangat, tidak ada edema tungkai — menyingkirkan gagal jantung kanan sebagai penyebab utama sesak kali ini.', relevan: true },
      { region: 'kulit', temuan: 'Sianosis sentral pada bibir dan lidah; kulit lembap berkeringat.', relevan: true },
      { region: 'abdomen', temuan: 'Supel, hepar terdorong ke bawah oleh diafragma yang mendatar tetapi tidak nyeri; tidak ada asites.', relevan: false },
    ],
    lab: [],
    diagnosisBanding: ['J44.0', 'J18.9', 'I50.1'],
    tatalaksana: {
      obatBenar: ['prednison_5'],
      // Ketiga gejala kardinal Anthonisen lengkap, termasuk sputum purulen,
      // membuat antibiotik terindikasi tanpa menunggu rontgen. Satu slot "pilih salah satu":
      // satu infeksi cukup satu lini, bukan kombinasi.
      obatAlternatif: [['amoxiclav_625', 'azitromisin_500', 'doksisiklin_100']],
      prosedur: ['oksigen', 'nebulisasi', 'pemantauan_ketat_vital'],
      obatSalahUmum: [
        { id: 'diazepam_2', alasan: 'Pasien gelisah dan tampak panik, dan naluri "tenangkan dulu" terasa manusiawi — tetapi kegelisahan ini adalah OTAK YANG KEKURANGAN OKSIGEN, bukan cemas. Benzodiazepin menekan dorongan napas pada pasien yang sedang bertahan hidup justru dengan bekerja keras bernapas, dan pada gagal napas hiperkapnik yang mengancam ini dapat menghentikannya sama sekali. Gelisah pada pasien sesak berat adalah tanda bahaya, bukan indikasi sedatif.', bahaya: 'kontraindikasi' },
        { id: 'salbutamol_2', alasan: 'Bukan obatnya yang keliru, melainkan rute dan WAKTU. Pasien ini bicara sepatah-sepatah dengan SpO2 88%; salbutamol tablet butuh puluhan menit untuk diserap dan mencapai paru — waktu yang tidak dimiliki pasien — sementara efek sistemiknya menambah takikardia pada jantung yang sudah dipacu. Bronkodilator di sini harus masuk lewat udara yang dihirup, bukan lewat lambung.', bahaya: 'nonPrimer' },
        { id: 'ambroxol_30', alasan: 'Dahak kental memancing pikiran "encerkan dahaknya". Mukolitik tidak berperan pada eksaserbasi akut dan tidak akan membuka jalan napas yang menyempit; risikonya adalah waktu — menit yang terpakai untuk obat yang tidak menolong adalah menit yang tidak terpakai untuk oksigen, nebulisasi, dan rujukan.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['berhenti_merokok', 'teknik_inhaler', 'tanda_bahaya', 'kontrol_rutin'],
      // Berhenti merokok adalah SATU-SATUNYA intervensi yang terbukti
      // memperlambat penurunan fungsi paru pada PPOK — lebih menentukan
      // daripada obat mana pun yang diberikan hari ini (GOLD).
      edukasiKritis: ['berhenti_merokok'],
    },
    // SpO2 88% + bicara per kata + otot bantu napas aktif + kesadaran mulai
    // terganggu = gagal napas mengancam. Oksigen dan nebulisasi harus selesai
    // sebelum pasien diberangkatkan, bukan dikerjakan "nanti di ambulans".
    stabilisasiWajib: ['oksigen', 'nebulisasi', 'pemantauan_ketat_vital'],
    clue: 'PPOK EKSASERBASI BERAT DENGAN DUGAAN INFEKSI SALURAN NAPAS BAWAH (SKDI 3B - RUJUK): sesak bertambah, volume dahak meningkat, sputum purulen, demam, riwayat PPOK, dan tanda gagal napas mengancam berupa bicara per kata, otot bantu aktif, sianosis, perubahan kesadaran, serta SpO2 88%. Rontgen bukan prasyarat diagnosis atau antibiotik pada vignette ini. Beri oksigen terkontrol dengan target 88-92%, bronkodilator inhalasi/nebulisasi, kortikosteroid sistemik, satu antibiotik karena sputum purulen dan risiko berat, monitoring, lalu transfer segera ke layanan yang mampu analisis gas darah dan ventilasi noninvasif.',
    panduanResmi: `${PPK_FLOOR} PPK 1186/2022 menetapkan eksaserbasi sedang-berat untuk rujukan, tetapi fallback aminofilin atau adrenalin injeksi pada bab lama tidak dipakai sebagai substitusi otomatis. GOLD 2026 mengutamakan SABA inhalasi dengan atau tanpa antikolinergik kerja singkat, kortikosteroid sistemik maksimal 5 hari, antibiotik pada sputum purulen atau risiko infeksi tinggi, serta dukungan ventilasi untuk gagal napas. Oksigen dititrasi ke 88-92%, bukan dibuka maksimal.`,
    catatanRealita: 'Vignette menyatakan oksigen, pulse oximeter, nebulizer, obat/consumable, petugas, monitoring, dan transport ready. Rontgen serta analisis gas darah tidak tersedia onsite dan tidak boleh menunda stabilisasi atau transfer. Bila nebulizer tidak ready, gunakan bronkodilator inhalasi lewat spacer sesuai SOP lokal; jangan otomatis beralih ke aminofilin atau adrenalin injeksi tanpa protokol dan monitoring.',
    mutiaraEbm: 'Suara mengi yang melemah pada pasien yang makin lelah dapat menandakan aliran udara yang sangat kecil, bukan perbaikan. Demikian pula, saturasi yang dipaksa jauh di atas target dapat menyembunyikan hiperkapnia yang memburuk; rasa mengantuk setelah oksigen bukan alasan merasa aman, melainkan alasan menilai ulang ventilasi dan mempercepat dukungan napas.',
    konsekuensi: {
      narasi: 'Tanpa oksigen terkontrol, nebulisasi, steroid, antibiotik, dan rujukan segera, eksaserbasi berat ini berlanjut ke gagal napas hiperkapnik dengan asidosis respiratorik. Memberi sedatif untuk menenangkannya, atau membuka oksigen setinggi-tingginya, mempercepat jalan itu.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Pasien dibawa kembali dalam hitungan jam dengan kesadaran menurun sampai tidak dapat dibangunkan, napas melemah dan pelan, sianosis makin dalam — narkosis CO2 dengan gagal napas yang menuntut ventilasi mekanik.',
      guideline: 'GOLD Report / PPK 1186/2022 / PDPI — eksaserbasi berat: oksigen terkontrol target SpO2 88-92%, bronkodilator nebulisasi, kortikosteroid sistemik, antibiotik bila gejala kardinal terpenuhi, rujuk untuk ventilasi noninvasif.',
    },
  }),
]

export const LAB_BATCH_4_DALAM_ARCHETYPE_SPECS: Record<string, LabArchetypeSpec> = {
  lab_penyakit_ginjal_kronik_st3b: { conceptId: 'concept:chronic_kidney_disease_st3b', credits: ['clinical:lab_penyakit_ginjal_kronik_st3b'] },
  lab_gagal_jantung_dekompensasi: { conceptId: 'concept:decompensated_heart_failure', credits: ['clinical:lab_gagal_jantung_dekompensasi'] },
  lab_hipertiroid_graves: { conceptId: 'concept:graves_hyperthyroidism', credits: ['clinical:lab_hipertiroid_graves'] },
  lab_sirosis_hepatis_dekompensata: { conceptId: 'concept:decompensated_cirrhosis', credits: ['clinical:lab_sirosis_hepatis_dekompensata'] },
  lab_anemia_berat_perlu_transfusi: { conceptId: 'concept:severe_anemia_transfusion', credits: ['clinical:lab_anemia_berat_perlu_transfusi'] },
  lab_kaki_diabetik_infeksi: { conceptId: 'concept:diabetic_foot_infection', credits: ['clinical:lab_kaki_diabetik_infeksi'] },
  lab_tb_paru_putus_obat_suspek_mdr: { conceptId: 'concept:tb_treatment_default_mdr_suspect', credits: ['clinical:lab_tb_paru_putus_obat_suspek_mdr'] },
  lab_hepatitis_b_kronik: { conceptId: 'concept:chronic_hepatitis_b', credits: ['clinical:lab_hepatitis_b_kronik'] },
  lab_ppok_eksaserbasi_berat: { conceptId: 'concept:copd_severe_exacerbation', credits: ['clinical:lab_ppok_eksaserbasi_berat'] },
}
