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
    nama: 'Penyakit Ginjal Kronik Stadium 3b',
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
        tanya: 'Mualnya kapan muncul? Sampai muntah? Nafsu makan bagaimana?',
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
      { id: 'fungsi_ginjal', hasil: 'Ureum 92 mg/dL; kreatinin 1,9 mg/dL; eGFR 35 mL/menit/1,73 m2.', flag: 'tinggi', relevan: true },
      { id: 'proteinuria', hasil: 'Protein urine +2.', flag: 'abnormal', relevan: true },
      { id: 'hb', hasil: 'Hb 9,6 g/dL (anemia normositik penyakit ginjal kronik).', flag: 'rendah', relevan: true },
      { id: 'elektrolit_serum', hasil: 'Kalium 5,1 mmol/L (batas atas); natrium 138 mmol/L; bikarbonat 23 mmol/L (belum asidosis).', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['N18.3', 'I12.9', 'E11.2'],
    tatalaksana: {
      obatBenar: [],
      // Kaptopril & ramipril sama-sama penghambat ACE — satu slot "pilih salah
      // satu", bukan kombinasi (dua ACE-I bersamaan justru berbahaya).
      obatAlternatif: [['captopril_25', 'ramipril_5']],
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
    clue: 'PENYAKIT GINJAL KRONIK STADIUM 3b (eGFR 30-44, SKDI 2 - RUJUK): hipertensi belasan tahun tak terkontrol + diabetes 10 tahun + proteinuria +2 + anemia = kerusakan ginjal kronik, bukan keluhan pegal biasa. Di FKTP: kendalikan tekanan darah dengan penghambat ACE (kaptopril atau ramipril) — dipilih karena RENOPROTEKTIF, yaitu menurunkan tekanan di dalam glomerulus dan mengurangi proteinuria, bukan sekadar menurunkan angka tensi (KDIGO 2024). Kalium 5,1 dan kreatinin wajib dipantau ulang setelah memulai penghambat ACE. HENTIKAN semua jamu pegal dan NSAID. Rujuk penyakit dalam untuk penilaian lanjut dan persiapan terapi pengganti ginjal.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan penyakit ginjal kronik pada kompetensi 2 (mendiagnosis dan merujuk): FKTP mengenali, mengendalikan faktor pemberat (tekanan darah, gula darah, obat nefrotoksik), lalu merujuk. KDIGO 2024 menganjurkan penghambat sistem renin-angiotensin dosis maksimal yang ditoleransi pada penyakit ginjal kronik dengan proteinuria, dengan pemantauan kreatinin dan kalium 2-4 minggu setelah inisiasi atau naik dosis.`,
    catatanRealita: 'Laboratorium Puskesmas umumnya melaporkan ureum/kreatinin saja tanpa menghitung eGFR otomatis, sehingga kreatinin 1,9 mudah dibaca "cuma sedikit tinggi" dan pasien dipulangkan dengan obat pegal. Menghitung eGFR dari kreatinin, usia, dan jenis kelamin adalah kerja FKTP yang tidak butuh alat tambahan apa pun.',
    mutiaraEbm: 'Kreatinin 1,9 mg/dL terlihat "hampir normal", padahal pada pasien 60-an tahun angka itu setara eGFR 35 — lebih dari separuh fungsi ginjal sudah hilang. Kreatinin baru naik setelah kerusakan berjalan jauh, dan makin tua serta makin kurus otot pasien, makin menyesatkan angka itu.',
    konsekuensi: {
      narasi: 'Bila permintaan obat pegal dituruti dan tekanan darah dibiarkan, NSAID plus hipertensi tak terkontrol menjatuhkan sisa fungsi ginjal secara mendadak — gagal ginjal akut di atas kronik yang sering tidak pulih kembali.',
      kembaliHariMin: 14,
      kembaliHariMax: 30,
      kondisiKembali: 'Pasien kembali dengan bengkak sampai ke wajah, kencing sangat sedikit, mual muntah terus-menerus, dan mulai mengantuk berat — uremia yang menuntut cuci darah darurat.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 / KDIGO 2024 CKD — kendali tekanan darah dengan penghambat sistem renin-angiotensin, hindari obat nefrotoksik, rujuk untuk penilaian lanjut.',
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
      { id: 'foto_toraks', hasil: 'Kardiomegali (CTR 62%), corakan bronkovaskular meningkat dengan redistribusi ke apeks, garis Kerley B, efusi pleura minimal bilateral — kongesti paru.', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['I50.1', 'J44.1', 'J81'],
    tatalaksana: {
      obatBenar: ['furosemid_inj_20'],
      prosedur: ['oksigen', 'posisi_semifowler', 'pemantauan_ketat_vital'],
      obatSalahUmum: [
        // Pembeda utama dari mm_gagal_jantung_kongestif (yang memang memakai
        // furosemid ORAL pada CHF stabil): pada dekompensasi akut, ususnya ikut
        // kongestif → absorpsi oral tak dapat diandalkan. Bukan berbahaya,
        // tetapi tak efektif pada situasi ini → nonPrimer.
        { id: 'furosemid_40', alasan: 'Rutenya yang salah, bukan obatnya. Pada dekompensasi akut, dinding usus ikut membengkak oleh kongesti sehingga penyerapan furosemid ORAL tidak dapat diandalkan justru saat dekongesti paling dibutuhkan. Situasi ini menuntut rute intravena.', bahaya: 'nonPrimer' },
        { id: 'bisoprolol_5', alasan: 'Beta-blocker terbukti menurunkan mortalitas gagal jantung JANGKA PANJANG, tetapi JANGAN dimulai saat pasien sedang basah dan kongestif — efek inotropik negatifnya menjatuhkan curah jantung yang sudah pas-pasan. Inisiasi menunggu pasien kering dan stabil, oleh spesialis.', bahaya: 'kontraindikasi' },
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
    stabilisasiWajib: ['oksigen', 'posisi_semifowler'],
    clue: 'GAGAL JANTUNG DEKOMPENSASI AKUT (SKDI 3B - RUJUK): sesak progresif + tidur tiga bantal + terbangun megap-megap malam hari + naik 4 kg seminggu + JVP meningkat + gallop S3 + ronki basal + kardiomegali dengan kongesti pada foto toraks. Pencetusnya jelas dan dapat dicegah: diuretik dihentikan sendiri tiga minggu lalu ditambah beban garam hajatan. Di FKTP: dudukkan setengah duduk, oksigen (SpO2 89%), FUROSEMID INTRAVENA — rute oral tak dapat diandalkan karena usus ikut kongestif — pantau ketat, lalu RUJUK penyakit dalam untuk ekokardiografi dan penataan terapi definitif. JANGAN memulai beta-blocker saat pasien masih basah (ESC 2021 / PERKI).',
    panduanResmi: `${PPK_FLOOR} PPK 1186/2022 memerinci stabilisasi gagal jantung akut di FKTP sebelum rujuk: oksigen 2-4 L/menit dan furosemid injeksi 20-40 mg bolus intravena, boleh diulang, lalu SEGERA RUJUK. Batasi cairan maksimal 1,5 L/hari (1 L bila berat). ESC 2021 Heart Failure menegaskan diuretik loop intravena sebagai terapi lini pertama kongesti akut dan menunda inisiasi beta-blocker sampai euvolemik.`,
    catatanRealita: 'Skenario mengasumsikan furosemid injeksi, oksigen, dan transport tersedia. Bila sediaan injeksi kosong — kenyataan yang lazim di Puskesmas — furosemid oral tetap diberikan sebagai upaya terbaik yang ada sambil rujukan dijalankan; yang tidak boleh adalah menganggap oral sudah setara lalu memulangkan pasien. Foto toraks juga sering tidak onsite: diagnosis ini tegak secara klinis, dan foto bukan syarat merujuk.',
    mutiaraEbm: 'Kenaikan berat badan 4 kg dalam seminggu adalah tanda kongesti paling awal dan paling murah — muncul jauh sebelum sesak, dan hanya butuh timbangan. Sebaliknya, tungkai yang "tidak terlalu bengkak" menyesatkan: pasien bisa menahan 4-5 liter cairan sebelum edema tampak nyata, sehingga edema ringan tidak berarti kongesti ringan.',
    konsekuensi: {
      narasi: 'Tanpa dekongesti intravena dan rujukan, kongesti terus menumpuk sampai alveolus terendam — pasien jatuh ke edema paru akut. Memulai beta-blocker saat basah atau berpuas diri dengan furosemid oral mempercepat jalannya.',
      kembaliHariMin: 1,
      kembaliHariMax: 3,
      kondisiKembali: 'Pasien dibawa kembali dalam kondisi sesak hebat, sama sekali tidak bisa dibaringkan, berkeringat dingin dan batuk berbusa kemerahan — edema paru akut yang mengancam jiwa.',
      guideline: 'PPK 1186/2022 / ESC 2021 Heart Failure / PERKI — diuretik loop intravena + oksigen + rujuk; jangan inisiasi beta-blocker saat dekompensasi.',
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
    nama: 'Hipertiroid Graves',
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
        jawab: 'Kata suami saya mata saya jadi lebih melotot dok. Sering perih dan berair, seperti ada pasirnya. Foto saya setahun lalu memang beda.',
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
        id: 'q_kb',
        kategori: 'sosial',
        tanya: 'Ibu sekarang memakai KB apa?',
        jawab: 'Saya pakai suntik KB dok, yang tiga bulan sekali, sudah dua tahun.',
        distraktor: true,
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
    lab: [
      { id: 'tsh', hasil: 'TSH < 0,01 mIU/L (tersupresi berat).', flag: 'rendah', relevan: true },
      { id: 'ekg', hasil: 'Sinus takikardia 118x/menit; irama reguler, tidak ada fibrilasi atrium.', flag: 'abnormal', relevan: true },
      // Berat turun + makan banyak WAJIB menyingkirkan diabetes. GDS normal di
      // sini adalah negatif yang informatif (mengarahkan ke tiroid), sehingga
      // relevan: true — memeriksanya adalah praktik yang benar, bukan boros.
      { id: 'gds', hasil: 'Gula darah sewaktu 104 mg/dL (normal — menyingkirkan diabetes sebagai penyebab berat turun).', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['E05.0', 'F41.1', 'E11.9'],
    tatalaksana: {
      obatBenar: ['propranolol_10'],
      // PTU sah tetapi TIDAK wajib di FKTP: inisiasi antitiroid lazimnya
      // keputusan spesialis dan sediaannya jarang ada di Puskesmas. obatOpsional
      // = tak meresepkan TIDAK kehilangan slot, meresepkan TIDAK dihukum.
      obatOpsional: ['propiltiourasil_100'],
      obatSalahUmum: [
        { id: 'diazepam_2', alasan: 'Berdebar, gemetar, gelisah, dan sulit tidur sangat mudah dibaca sebagai gangguan cemas. Sedatif meredakan tampilannya sebentar sambil menutupi tirotoksikosis yang terus berjalan — pasien kembali berbulan-bulan kemudian dengan fibrilasi atrium atau krisis tiroid.', bahaya: 'nonPrimer' },
        { id: 'fluoksetin_20', alasan: 'Mudah tersinggung, berubah perangai, dan insomnia bukan depresi di sini, melainkan kelenjar tiroid yang bekerja berlebihan. Antidepresan tidak mengoreksi hormonnya dan menunda diagnosis yang sebenarnya sederhana: periksa TSH.', bahaya: 'nonPrimer' },
        { id: 'metformin_500', alasan: 'Berat turun sambil makan banyak memang khas diabetes — tetapi gula darah pasien ini normal. Meresepkan metformin berarti mengobati diagnosis yang sudah disingkirkan datanya sendiri, dan justru menurunkan berat badan pasien yang sudah kurus.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['kepatuhan_antitiroid', 'kontrol_rutin', 'tanda_bahaya', 'manajemen_stres'],
      // Agranulositosis: efek samping antitiroid yang jarang tetapi mematikan,
      // dan satu-satunya pertahanannya adalah pasien yang tahu harus berhenti
      // dan datang saat demam + sariawan hebat. Ini nyawa, bukan pelengkap.
      edukasiKritis: ['kepatuhan_antitiroid'],
    },
    clue: 'PENYAKIT GRAVES (SKDI 3A - RUJUK): berat turun meski makan bertambah + berdebar + tremor halus + tidak tahan panas + tekanan nadi melebar + gondok DIFUS dengan bruit + eksoftalmus. Kombinasi gondok difus dan mata menonjol praktis hanya terjadi pada Graves, bukan hipertiroid jenis lain. Di FKTP: PROPRANOLOL meredakan gejala adrenergik (berdebar, tremor, gelisah) dalam hitungan jam — dipilih di antara beta-blocker lain karena non-selektif dan juga menghambat konversi T4 menjadi T3 di jaringan. Propiltiourasil boleh dimulai bila kompetensi dan sediaan memungkinkan. RUJUK penyakit dalam untuk konfirmasi (FT4, TRAb), penentuan terapi definitif (antitiroid, iodium radioaktif, atau operasi), dan penilaian mata. WAJIB diajarkan sebelum pulang: demam disertai sariawan hebat atau nyeri tenggorok saat memakai antitiroid = STOP OBAT dan segera ke faskes — itu tanda agranulositosis.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan hipertiroid pada kompetensi 3A: FKTP menegakkan dugaan klinis, memberi terapi awal untuk mengendalikan gejala, lalu merujuk. Pemeriksaan tiroid dimulai dengan TSH; TSH tersupresi ditindaklanjuti FT4 di layanan rujukan. Propiltiourasil kini bukan lini pertama pada hipertiroid umum karena risiko hepatotoksisitasnya, dan disediakan terutama untuk trimester pertama kehamilan serta krisis tiroid — penetapan regimen definitif adalah ranah spesialis.`,
    catatanRealita: 'TSH dan obat antitiroid nyaris tidak pernah tersedia di Puskesmas; pemeriksaan fungsi tiroid hampir selalu berupa rujukan ke laboratorium rujukan atau RS, dan hasilnya butuh berhari-hari. Yang benar-benar milik FKTP pada kasus ini adalah mengenalinya secara klinis, memberi propranolol untuk meredakan gejala, dan merujuk — semuanya bisa dikerjakan tanpa satu pun hasil laboratorium di tangan.',
    mutiaraEbm: 'Berdebar, gelisah, gemetar, dan berat turun adalah tampilan buku teks gangguan cemas — dan itulah sebabnya Graves rata-rata terlambat dikenali bertahun-tahun, terutama pada perempuan muda yang keluhannya cepat dilabeli "stres" atau "kecapekan". Pembedanya ada di tubuh, bukan di cerita: tidak tahan panas, tekanan nadi yang melebar, gondok difus, dan mata yang menonjol. Cemas tidak membuat kelenjar leher membesar.',
    konsekuensi: {
      narasi: 'Bila dilabeli gangguan cemas dan diberi sedatif, tirotoksikosis berjalan terus tanpa dikoreksi. Jantung yang dipacu hormon berlebih berbulan-bulan jatuh ke fibrilasi atrium, dan infeksi atau stres berat dapat memicu krisis tiroid dengan mortalitas tinggi.',
      kembaliHariMin: 45,
      kembaliHariMax: 120,
      kondisiKembali: 'Pasien kembali dengan jantung berdebar sangat cepat dan tidak teratur, sesak, dan bengkak tungkai — fibrilasi atrium dengan gagal jantung; berat badannya turun sepuluh kilo lagi dan matanya makin menonjol.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 / ATA Hyperthyroidism Guideline — beta-blocker untuk gejala adrenergik, konfirmasi biokimia, rujuk untuk terapi definitif.',
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
      { id: 'sgot_sgpt', hasil: 'AST 88 U/L, ALT 42 U/L (rasio AST/ALT > 2); albumin 2,4 g/dL, bilirubin total 4,8 mg/dL.', flag: 'tinggi', relevan: true },
      { id: 'usg_abdomen', hasil: 'Hati mengecil dengan tepi ireguler dan permukaan nodular, ekogenisitas kasar; asites masif; vena porta melebar 14 mm; splenomegali. Tidak tampak massa fokal.', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Trombosit 78.000/uL (trombositopenia — petanda hipertensi porta), Hb 10,4 g/dL, leukosit 5.200/uL.', flag: 'abnormal', relevan: true },
      { id: 'hbsag', hasil: 'HBsAg reaktif.', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['K74.6', 'K70.3', 'I50.0'],
    tatalaksana: {
      obatBenar: ['spironolakton_25', 'laktulosa_syr'],
      // Rasio klasik spironolakton:furosemid = 100:40. Furosemid TIDAK berdiri
      // sendiri pada asites sirosis (aldosteronisme sekunder = spironolakton
      // tulang punggungnya) dan penambahannya bersifat opsional/bertahap.
      obatOpsional: ['furosemid_40'],
      obatSalahUmum: [
        { id: 'ibuprofen_400', alasan: 'NSAID adalah dua bencana sekaligus pada sirosis: menghambat agregasi trombosit pada pasien yang trombositnya sudah 78.000 dengan varises menganga (perdarahan masif), dan mematikan prostaglandin yang menjadi satu-satunya penopang aliran darah ginjal pada sirosis dengan asites (sindrom hepatorenal). CATATAN: parasetamol dosis rendah, maksimal 2 gram per hari, justru analgesik TERPILIH pada sirosis — bukan parasetamol yang bermasalah, tetapi NSAID.', bahaya: 'kontraindikasi' },
        { id: 'diazepam_2', alasan: 'Pasien ini sudah bingung dan mengantuk karena ensefalopati hepatik, dan hati yang rusak tidak mampu memetabolisme benzodiazepin. Memberi obat tidur untuk keluhan "malam melek" — persis yang diminta pasien — dapat menjatuhkannya ke koma hepatikum. Siklus tidur terbalik BUKAN insomnia, itu gejala ensefalopati.', bahaya: 'kontraindikasi' },
      ],
      tindakanSalahUmum: [
        { id: 'pungsi_pleura', alasan: 'Cairannya ada di rongga PERUT, bukan rongga dada — dan paru pasien ini bersih. Menusuk rongga yang salah pada pasien dengan gangguan pembekuan berat adalah risiko tanpa satu pun manfaat. Parasentesis pun, bila memang diperlukan, bukan lingkup FKTP dan dikerjakan di layanan rujukan.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['pantang_alkohol_hati', 'diet_rendah_garam', 'tanda_bahaya', 'kepatuhan_obat'],
      // Berhenti total dari alkohol adalah satu-satunya intervensi yang dapat
      // memperbaiki harapan hidup pasien ini, berapa pun obat yang diberikan.
      edukasiKritis: ['pantang_alkohol_hati'],
    },
    clue: 'SIROSIS HEPATIS DEKOMPENSATA (SKDI 2 - RUJUK): asites + ikterus + memar mudah + hati mengecil nodular pada USG + trombositopenia + albumin rendah + HBsAg reaktif. Trombosit 78.000 tanpa perdarahan aktif adalah petanda HIPERTENSI PORTA, bukan penyakit darah. Empat dari lima tanda dekompensasi sudah muncul: asites, ikterus, ensefalopati, dan gangguan koagulasi. Di FKTP: SPIRONOLAKTON adalah tulang punggung asites sirosis — bukan furosemid — karena asitesnya digerakkan oleh aldosteronisme sekunder; bila perlu ditambah furosemid dengan rasio 100:40. LAKTULOSA untuk ensefalopati (target 2-3 kali buang air besar lembek per hari). Diet rendah garam, PANTANG ALKOHOL MUTLAK, rujuk penyakit dalam untuk endoskopi skrining varises dan penilaian derajat (Child-Pugh/MELD). Untuk nyeri: parasetamol dosis rendah AMAN dan menjadi pilihan; NSAID dan benzodiazepin adalah yang dilarang (AASLD/EASL).',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan sirosis pada kompetensi 2 — dikenali dan dirujuk; FKTP mengendalikan asites, mencegah pencetus ensefalopati, dan mengenali tanda bahaya perdarahan varises. EASL dan AASLD menetapkan antagonis mineralokortikoid sebagai diuretik lini pertama asites sirosis dengan restriksi natrium, laktulosa sebagai terapi lini pertama ensefalopati hepatik, serta menyebut parasetamol dosis dibatasi 2 g/hari sebagai analgesik pilihan dan NSAID sebagai kontraindikasi.`,
    catatanRealita: 'USG abdomen dan HBsAg tidak diasumsikan ada di setiap Puskesmas, dan endoskopi jelas tidak. Sirosis dekompensata sebenarnya dapat dikenali hanya dengan mata dan tangan — perut asites, sklera ikterik, spider naevi, eritema palmaris, dan asteriksis — sehingga tidak adanya alat BUKAN alasan menunda rujukan.',
    mutiaraEbm: 'Pasien dan keluarganya melaporkan "susah tidur malam, ngantuk siang" — dan itu terdengar seperti gangguan tidur biasa yang minta obat tidur. Justru pembalikan siklus tidur adalah gejala PALING AWAL ensefalopati hepatik, muncul sebelum bingung yang kentara. Sebaliknya, enzim hati (SGOT/SGPT) yang hampir normal pada sirosis lanjut menyesatkan: enzim rendah bukan berarti hati membaik, melainkan sel hati yang tersisa sudah terlalu sedikit untuk melepaskannya. Yang bercerita jujur adalah albumin, bilirubin, dan trombosit.',
    konsekuensi: {
      narasi: 'Bila asites tidak dikelola dan pencetus ensefalopati tidak dicegah, pasien jatuh ke koma hepatikum, peritonitis bakterial spontan, atau perdarahan varises. Pemberian NSAID mempercepat perdarahan dan sindrom hepatorenal; obat tidur mempercepat koma.',
      kembaliHariMin: 7,
      kembaliHariMax: 21,
      kondisiKembali: 'Pasien dibawa dalam kondisi tidak dapat dibangunkan setelah diberi obat tidur, atau muntah darah segar bergumpal dengan tekanan darah menurun — perdarahan varises esofagus yang mengancam jiwa.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 / EASL Decompensated Cirrhosis / AASLD — spironolakton + restriksi garam untuk asites, laktulosa untuk ensefalopati, hindari NSAID dan sedatif, rujuk untuk skrining varises.',
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
    nama: 'Anemia Berat dengan Indikasi Transfusi',
    icd10: 'D64.9',
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
        tanya: 'Ada kemungkinan hamil? Kapan haid terakhir?',
        jawab: 'Tidak mungkin dok, haid saya justru terus-terusan. Terakhir minggu lalu, dan saya pakai KB spiral sudah lima tahun.',
        hanyaUntuk: 'P',
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
      { id: 'darah_rutin', hasil: 'MCV 62 fL, MCH 19 pg (mikrositik hipokrom berat); RDW 19% (anisositosis); trombosit 462.000/uL; leukosit 6.800/uL — seri putih normal.', flag: 'abnormal', relevan: true },
      { id: 'ferritin_serum', hasil: 'Feritin 4 ng/mL (sangat rendah — cadangan besi tubuh habis).', flag: 'rendah', relevan: true },
      { id: 'hitung_retikulosit', hasil: 'Retikulosit 0,8% (rendah untuk derajat anemia seberat ini — sumsum tidak mampu merespons karena kehabisan bahan baku besi).', flag: 'rendah', relevan: true },
    ],
    diagnosisBanding: ['D64.9', 'D50.0', 'D25.9'],
    tatalaksana: {
      obatBenar: ['tablet_fe'],
      obatSalahUmum: [
        { id: 'vitamin_b_kompleks', alasan: 'Diberi label "penambah darah" di apotek, tetapi tidak mengandung besi dalam jumlah bermakna — dan pasien ini sudah membuktikannya sendiri: dua bulan meminumnya tanpa perbaikan. Meresepkannya lagi berarti mengulangi kegagalan yang sama sambil menunda transfusi yang dibutuhkannya hari ini.', bahaya: 'nonPrimer' },
        { id: 'asam_folat', alasan: 'Asam folat menyasar anemia MAKROSITIK (sel darah besar). Pasien ini mikrositik hipokrom dengan feritin 4 — kekurangannya besi, bukan folat. Menghambur hematinik tanpa arah adalah tanda diagnosis yang tidak ditegakkan, dan feritin sudah menunjuk jawabannya dengan jelas.', bahaya: 'nonPrimer' },
      ],
      tindakanSalahUmum: [
        { id: 'transfusi_darah_fktp', alasan: 'Indikasi transfusinya memang benar — tetapi TEMPATNYA salah. Puskesmas tidak memiliki bank darah, uji silang serasi (crossmatch), rantai dingin, maupun kemampuan memantau dan menangani reaksi transfusi akut seperti reaksi hemolitik atau TRALI, yang dapat membunuh dalam hitungan menit. Transfusi dikerjakan di fasilitas rujukan; tugas FKTP adalah mengenali indikasinya dan merujuk.', bahaya: 'nonPrimer' },
        { id: 'resusitasi_cairan_kristaloid', alasan: 'Pucat dan takikardia memancing refleks "pasang infus, guyur" — tetapi anemia kronik delapan bulan itu EUVOLEMIK: pasien kekurangan sel darah merah, bukan kekurangan cairan. Volume kristaloid hanya mengencerkan Hb yang sudah 5,8 lebih jauh, dan jantung yang sudah bekerja ekstra keras dapat terdorong ke edema paru. Tekanan darahnya pun masih 100/60, bukan syok.', bahaya: 'berbahaya' },
      ],
      edukasi: ['diet_zat_besi', 'kepatuhan_obat', 'tanda_bahaya', 'kontrol_rutin'],
      edukasiKritis: ['tanda_bahaya'],
    },
    clue: 'ANEMIA BERAT DENGAN INDIKASI TRANSFUSI (SKDI 3B - RUJUK): Hb 5,8 dengan sesak saat aktivitas ringan, takikardia, dan bising aliran = anemia SIMPTOMATIK, bukan sekadar angka rendah. Mikrositik hipokrom + feritin 4 + retikulosit rendah + koilonikia + pika es batu = defisiensi besi berat akibat perdarahan menstruasi berkepanjangan. Ambang transfusi bukan angka tunggal: yang menentukan adalah GEJALA, dan pasien ini sudah melewatinya. Di FKTP: kenali indikasi, mulai tablet besi, edukasi sumber besi, dan RUJUK untuk transfusi serta evaluasi ginekologi — perdarahan uterus abnormal (mioma?) harus dicari dan diatasi, sebab menambal Hb tanpa menutup sumber kebocoran hanya mengulang siklus yang sama. Tablet besi tidak menggantikan transfusi hari ini: ia menaikkan Hb sekitar 1 g/dL per DUA MINGGU, sementara pasien sesak sekarang.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menetapkan anemia berat dan anemia dengan tanda dekompensasi sebagai indikasi rujuk; FKTP menegakkan jenis anemia, mengobati defisiensi besi, dan mencari sumber perdarahan. Transfusi darah bukan kompetensi FKTP tanpa dukungan unit transfusi darah. WHO menetapkan Hb < 8 g/dL pada perempuan tidak hamil sebagai anemia berat, dengan keputusan transfusi ditentukan gejala dan laju perdarahan, bukan ambang angka semata.`,
    catatanRealita: 'Hb 5,8 pada perempuan yang masih berjalan sendiri ke Puskesmas adalah pemandangan yang jauh lebih sering daripada yang diduga — tubuh beradaptasi pelan-pelan sehingga pasien datang terlambat, dan justru karena ia "masih kuat jalan" petugas mudah meremehkannya. Banyak Puskesmas juga hanya punya Hb dan darah rutin tanpa feritin;',
    mutiaraEbm: 'Pasien masih bisa berjalan sendiri ke Puskesmas dan tekanan darahnya normal — dua hal yang membuat Hb 5,8 terasa "tidak segawat angkanya". Itu jebakan adaptasi anemia kronik: tubuh menaikkan curah jantung dan menggeser kurva disosiasi oksigen selama berbulan-bulan, sehingga tanda vital tetap tenang sampai cadangan itu habis mendadak. Perhatikan juga SpO2 98% yang tampak menenangkan — saturasi hanya mengukur PERSEN hemoglobin yang terisi oksigen, bukan berapa banyak hemoglobin yang ada. Pada Hb 5,8, saturasi 98% berarti hampir seluruh dari sangat sedikit itu terisi penuh, dan pasien tetap kekurangan oksigen.',
    konsekuensi: {
      narasi: 'Bila hanya dibekali tablet besi dan dipulangkan, perdarahan haid terus berlanjut sementara besi butuh berminggu-minggu untuk bekerja. Jantung yang sudah dipacu berbulan-bulan akhirnya menyerah pada anemia yang makin dalam.',
      kembaliHariMin: 5,
      kembaliHariMax: 14,
      kondisiKembali: 'Pasien dibawa keluarganya dalam kondisi sesak saat berbaring, nyeri dada, dan bengkak tungkai setelah haid berikutnya yang lebih banyak — gagal jantung curah tinggi akibat anemia berat.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 / WHO Anaemia — anemia berat simptomatik dirujuk untuk transfusi; cari dan atasi sumber perdarahan.',
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
      { id: 'hba1c', hasil: 'HbA1c 10,4% (rata-rata gula darah 3 bulan terakhir sangat tinggi — kendali gula jangka panjang gagal).', flag: 'tinggi', relevan: true },
      { id: 'darah_rutin', hasil: 'Leukosit 17.200/uL dengan pergeseran ke kiri; Hb 11,8 g/dL; trombosit 388.000/uL.', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['E11.5', 'L03.1', 'M86.9'],
    tatalaksana: {
      obatBenar: [],
      // Satu slot antibiotik "pilih salah satu": oral untuk infeksi sedang,
      // parenteral dosis-1 bila dinilai berat sebelum transport. Bukan kombinasi.
      obatAlternatif: [['amoxiclav_625', 'ceftriaxone_1g_inj']],
      prosedur: ['perawatan_luka'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Amoksisilin polos tidak menjangkau flora kaki diabetik yang khas polimikroba — termasuk kuman anaerob yang menghasilkan bau busuk itu dan Staphylococcus penghasil beta-laktamase. Dibutuhkan cakupan yang lebih luas (misalnya kombinasi dengan asam klavulanat), bukan sekadar "ada antibiotik".', bahaya: 'nonPrimer' },
        { id: 'metformin_500', alasan: 'Kendali gula memang harus diperbaiki, tetapi bukan sekarang dan bukan dengan ini. Pada infeksi berat dengan kemungkinan hipoperfusi, metformin ditahan karena risiko asidosis laktat; gula 318 di tengah infeksi butuh insulin yang dititrasi di fasilitas rujukan, bukan tablet yang mulai bekerja berhari-hari.', bahaya: 'nonPrimer' },
      ],
      tindakanSalahUmum: [
        { id: 'insisi_abses', alasan: 'Nanah memang menuntut naluri untuk diinsisi — tetapi kaki ini ISKEMIK: nadi dorsalis pedis sulit teraba dan tepi luka sudah menghitam. Mengiris jaringan yang pasokan darahnya tidak memadai membuat luka baru yang tidak akan menutup, memperluas nekrosis, dan menyebarkan infeksi ke bidang jaringan yang tadinya bersih. Debridemen kaki diabetik dikerjakan SETELAH status vaskular dinilai, di fasilitas rujukan — bukan dengan bisturi di FKTP.', bahaya: 'berbahaya' },
      ],
      edukasi: ['perawatan_kaki_diabetik', 'diet_dm', 'kepatuhan_obat', 'tanda_bahaya', 'kontrol_rutin'],
      // Kaki sebelahnya punya neuropati dan iskemia yang SAMA. Tanpa edukasi
      // ini, pasien yang selamat dari kaki kanan kembali dengan kaki kiri.
      edukasiKritis: ['perawatan_kaki_diabetik'],
    },
    clue: 'KAKI DIABETIK TERINFEKSI (SKDI 3B - RUJUK): ulkus plantar menembus dalam + pus + bau busuk + tepi nekrotik + selulitis sekitar, pada diabetes 15 tahun tak terkontrol (HbA1c 10,4%) dengan NEUROPATI (monofilamen hilang) dan ISKEMIA (nadi pedis sulit teraba, klaudikasio 100 meter). Probe-to-bone positif = curiga osteomielitis. Di FKTP: perawatan luka, antibiotik berspektrum cukup untuk flora polimikroba, dan RUJUK penyakit dalam untuk debridemen, penilaian vaskular, pencitraan tulang, serta kendali gula dengan insulin. JANGAN mengiris kaki yang iskemik di FKTP. Ini keadaan yang menentukan kaki pasien masih ada atau tidak dalam sebulan.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menetapkan ulkus diabetikum dengan infeksi, iskemia, atau kecurigaan keterlibatan tulang sebagai indikasi rujuk. IWGDF (International Working Group on the Diabetic Foot) menetapkan setiap ulkus diabetik dengan infeksi sedang-berat, tanda iskemia, atau probe-to-bone positif harus dirujuk ke layanan multidisiplin, dan menekankan bahwa penilaian perfusi mendahului tindakan debridemen apa pun.`,
    catatanRealita: 'Pasien kaki diabetik hampir selalu datang terlambat, dan alasannya bukan kebodohan melainkan neuropati: luka yang tidak sakit tidak menghasilkan alarm apa pun. Di lapangan, keluarga biasanya yang membawanya, dipicu oleh BAU, bukan oleh nyeri. Monofilamen 10 g sendiri adalah alat termurah dan paling terabaikan di Puskesmas — sering ada di laci, jarang dipakai;',
    mutiaraEbm: 'Hilangnya nyeri BUKAN tanda luka membaik — justru sebaliknya. Pada kaki diabetik, tidak adanya nyeri berarti neuropati sudah memutus sistem peringatan tubuh, sehingga pasien terus menapak di atas luka yang menggerogoti jaringan sampai ke tulang. Luka yang paling tidak terasa sering kali luka yang paling dalam. Waspadai juga leukosit dan demam yang "cuma segini": pada diabetes, respons inflamasi tumpul, sehingga infeksi kaki yang mengancam tungkai kerap berjalan dengan suhu nyaris normal.',
    konsekuensi: {
      narasi: 'Bila hanya dibersihkan dan diberi antibiotik lemah lalu dipulangkan, infeksi menembus ke tulang dan bidang jaringan dalam pada kaki yang pasokan darahnya sudah tidak memadai. Insisi di FKTP tanpa penilaian vaskular mempercepatnya.',
      kembaliHariMin: 7,
      kembaliHariMax: 21,
      kondisiKembali: 'Pasien dibawa kembali dengan seluruh punggung kaki bengkak kehitaman, nanah merembes, demam tinggi, dan kesadaran menurun — sepsis dari kaki diabetik yang berujung amputasi.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 / IWGDF Diabetic Foot / PERKENI — ulkus terinfeksi dengan iskemia atau curiga osteomielitis wajib dirujuk; nilai perfusi sebelum debridemen.',
    },
  }),

  /* ======================================================================
   * 7. TB Paru Putus Obat, Suspek Resistan Obat (A15.9, SKDI 3A) — RUJUK paru
   * Poin ajar: JANGAN mengulang OAT lini-1 pada kasus putus obat sebelum status
   *   resistansi diketahui — itu memperbesar amplifikasi resistansi. Kuinolon
   *   "untuk pneumonia" merusak tulang punggung regimen TB RO.
   * CATATAN: TANPA konfirmasiWajib (lihat catatan file di atas).
   * ==================================================================== */
  buatKasusLab({
    id: 'lab_tb_paru_putus_obat_suspek_mdr',
    nama: 'TB Paru Putus Obat dengan Suspek Resistan Obat',
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
        jawab: 'Ada dok, tetangga sebelah rumah sedang berobat paru. Katanya obatnya banyak sekali dan harus disuntik tiap hari, sampai dia sering mengeluh.',
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
      { id: 'bta_sputum', hasil: 'BTA sputum sewaktu-pagi: positif (3+).', flag: 'abnormal', relevan: true },
      { id: 'tcm_spesimen_lesi', hasil: 'MTB terdeteksi, jumlah sedang; RESISTANSI RIFAMPISIN TERDETEKSI.', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Hb 10,6 g/dL (anemia penyakit kronik), LED meningkat, leukosit 9.400/uL.', flag: 'abnormal', relevan: false },
    ],
    diagnosisBanding: ['A15.9', 'J18.9', 'C34.9'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [
        // INTI PEDAGOGIS KASUS INI.
        { id: 'oat_kdt', alasan: 'Inilah kesalahan yang paling menggoda dan paling merusak: pasien putus obat, jadi "ulangi saja dari awal". Bila kumannya sudah resistan rifampisin — dan riwayat putus obat tiga bulan adalah faktor risiko utamanya — maka regimen lini pertama hanya menyisakan satu atau dua obat yang masih bekerja melawan populasi kuman yang besar. Itu resep untuk AMPLIFIKASI RESISTANSI: kuman menambah resistansi terhadap obat yang tersisa, dan pasien yang tadinya masih bisa disembuhkan berubah menjadi TB pra-XDR yang jauh lebih sulit dan lebih mematikan. Status resistansi ditetapkan LEBIH DULU (TCM), regimen ditetapkan layanan TB resistan obat.', bahaya: 'kontraindikasi' },
        { id: 'ciprofloxacin_500', alasan: 'Batuk berdarah dengan demam mudah dilabeli pneumonia lalu diberi kuinolon — dan kerusakannya berlapis. Kuinolon punya aktivitas antituberkulosis parsial: ia memperbaiki gejala sementara sehingga menyamarkan TB dan menunda diagnosis berminggu-minggu, sekaligus membuat BTA bisa jadi negatif palsu. Lebih buruk lagi, fluorokuinolon adalah TULANG PUNGGUNG regimen TB resistan obat — memaparkannya sembarangan berisiko melumpuhkan obat yang justru paling dibutuhkan pasien ini nanti.', bahaya: 'kontraindikasi' },
        { id: 'ambroxol_30', alasan: 'Mukolitik hanya menyentuh keluhan, tidak menyentuh penyakitnya. Bahayanya bukan pada obatnya, melainkan pada rasa "sudah diobati" yang ditimbulkannya — pasien pulang membawa sesuatu, dan rujukan ke layanan TB resistan obat tertunda sementara ia terus menulari serumahnya.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['minum_oat_tuntas', 'etika_batuk', 'tanda_bahaya', 'cuci_tangan'],
      // Pasien BERHENTI karena merasa sehat — dan itu persis yang akan
      // terulang pada regimen TB RO yang jauh lebih panjang dan lebih berat
      // efek sampingnya. Tanpa pemahaman ini, rujukan pun akan sia-sia.
      edukasiKritis: ['minum_oat_tuntas'],
    },
    clue: 'TB PARU PUTUS OBAT DENGAN RESISTANSI RIFAMPISIN (SKDI 3A - RUJUK): pernah OAT tiga bulan lalu berhenti sendiri karena merasa sehat, kini batuk darah + berat turun 9 kg + keringat malam + BTA 3+. Riwayat pengobatan TB sebelumnya yang tidak tuntas adalah faktor risiko TERKUAT untuk TB resistan obat — dan TCM mengonfirmasinya: resistansi rifampisin TERDETEKSI. Rifampisin resistan menandakan MDR-TB sampai terbukti sebaliknya. Yang benar di FKTP: kirim spesimen untuk TCM/Xpert, JANGAN memulai apa pun sendiri, dan RUJUK ke layanan TB Resistan Obat; regimen ditetapkan di sana. Kelas kasus "test before treat": pada TB putus obat, mengulang regimen lini pertama sebelum status resistansi diketahui bukan sekadar tidak efektif — ia MEMPERBURUK kumannya (WHO Drug-Resistant TB / Program TB Nasional).',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan TB dengan riwayat pengobatan sebelumnya, kecurigaan resistansi obat, dan TB dengan komplikasi sebagai indikasi rujuk — di luar TB paru kasus baru tanpa komplikasi yang tuntas di FKTP. Program TB Nasional menetapkan TCM (Xpert MTB/RIF) sebagai pemeriksaan awal WAJIB pada semua terduga TB dengan riwayat pengobatan sebelumnya, bukan mikroskopis saja, dan pasien dengan resistansi rifampisin dirujuk ke fasilitas layanan TB Resistan Obat.`,
    catatanRealita: 'TCM tidak ada di setiap Puskesmas — yang lazim adalah mengirim spesimen ke fasilitas TCM rujukan, dan hasilnya butuh beberapa hari. Itu justru menegaskan alur yang benar: rujukan dikerjakan atas dasar KECURIGAAN (riwayat putus obat + BTA positif) sambil spesimen berjalan; menahan pasien sampai hasil keluar tidak membuat penanganannya lebih baik, hanya menunda.',
    mutiaraEbm: 'Justru "merasa sudah sembuh" pada bulan kedua-ketiga adalah tanda OAT BEKERJA, bukan tanda penyakit selesai — dan itulah jebakan yang menciptakan pasien ini. Perbaikan gejala datang jauh lebih dulu daripada sterilisasi kuman; kuman persisten yang tertinggal itulah yang tumbuh kembali dengan membawa resistansi. Waspadai juga BTA negatif yang menenangkan pada pasien yang baru diberi antibiotik kuinolon — kuinolon dapat menekan kuman sementara dan menghasilkan negatif palsu, sehingga TB tampak tersingkir padahal hanya sedang bersembunyi.',
    konsekuensi: {
      narasi: 'Bila regimen lini pertama diulang tanpa mengetahui status resistansi, kuman yang sudah resistan rifampisin menghadapi tinggal satu-dua obat efektif dan menambah resistansi terhadap sisanya. Pasien berubah dari MDR-TB yang masih dapat diobati menjadi TB pra-XDR, sambil terus menulari istrinya, kedua anaknya, dan ibunya yang sepuh.',
      kembaliHariMin: 30,
      kembaliHariMax: 90,
      kondisiKembali: 'Pasien kembali dengan batuk darah lebih banyak, berat badan turun lagi, dan dahak yang tetap positif meski merasa sudah rutin minum obat; hasil uji kepekaan lanjutan menunjukkan resistansi yang bertambah — dan anak bungsunya kini mulai batuk lama.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 / WHO Consolidated Guidelines on Drug-Resistant TB / Program TB Nasional — TCM wajib pada terduga TB dengan riwayat pengobatan sebelumnya; resistansi rifampisin dirujuk ke layanan TB Resistan Obat.',
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
        id: 'q_donor_lalu',
        kategori: 'rpd',
        tanya: 'Sebelumnya pernah donor darah? Waktu itu hasilnya bagaimana?',
        jawab: 'Ini yang pertama dok, baru sekali ini. Sebelumnya tidak pernah, jadi tidak tahu sudah berapa lama begini.',
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
      { id: 'hbsag', hasil: 'HBsAg REAKTIF (dikonfirmasi ulang; sesuai hasil skrining unit donor darah bulan lalu).', flag: 'abnormal', relevan: true },
      { id: 'sgot_sgpt', hasil: 'AST 28 U/L, ALT 33 U/L (dalam batas normal); albumin 4,2 g/dL, bilirubin total 0,8 mg/dL — fungsi hati saat ini baik.', flag: 'normal', relevan: true },
      { id: 'usg_abdomen', hasil: 'Hati ukuran normal, ekogenisitas homogen, permukaan rata; tidak ada nodul, tidak ada asites, vena porta normal, lien normal.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['B18.1', 'B18.2', 'K76.0'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [
        { id: 'vitamin_b_kompleks', alasan: 'Godaan terbesar pada kasus tenang adalah meresepkan SESUATU supaya pasien merasa dilayani. Vitamin dan "penguat liver" tidak mengubah perjalanan hepatitis B kronik sedikit pun — dan ia menukar hal yang benar-benar berharga hari ini (konseling, pemeriksaan dan vaksinasi keluarga serumah, rujukan untuk penilaian antivirus) dengan sekantong pil yang menenangkan tetapi kosong.', bahaya: 'nonPrimer' },
        { id: 'asiklovir_400', alasan: 'Asiklovir bekerja pada virus golongan herpes, bukan virus hepatitis B — dua keluarga virus yang sama sekali berbeda. Kata "antivirus" pada label tidak berarti antivirus untuk virus ini.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['cegah_penularan_hepatitis_b', 'pantang_alkohol_hati', 'kontrol_rutin', 'tanda_bahaya'],
      // Inilah "tindakan" pada kasus tanpa gejala — dan ia melindungi orang
      // yang bahkan belum masuk ruang periksa: istri dan kedua anaknya.
      edukasiKritis: ['cegah_penularan_hepatitis_b'],
    },
    clue: 'HEPATITIS B KRONIK (SKDI 3A - RUJUK): HBsAg reaktif pada orang tanpa keluhan, ditemukan lewat skrining donor. Riwayat ibu meninggal karena penyakit hati mengarah kuat pada penularan perinatal — dan justru infeksi perinatal yang paling sering menjadi kronik serta berujung sirosis atau kanker hati puluhan tahun kemudian. INI KASUS TENANG, DAN ITU POINNYA: tanpa gejala bukan berarti tanpa tindakan. Yang wajib dikerjakan hari ini: (1) KONSELING — jelaskan ini kronik, dapat dikendalikan, dan tidak menular lewat makan bersama atau bersalaman; (2) periksa dan VAKSINASI kontak serumah yang HBsAg dan anti-HBs negatif — istri dan anak-anak, serta ingatkan bahwa bayi dari ibu HBsAg reaktif wajib mendapat vaksin hepatitis B DAN HBIG dalam 12 jam pertama kehidupan; (3) hentikan alkohol; (4) RUJUK penyakit dalam untuk menilai INDIKASI antivirus. Tidak semua hepatitis B kronik perlu diobati — keputusan itu berdasar ALT, HBV DNA, HBeAg, dan derajat fibrosis; bila terindikasi, tenofovir adalah salah satu pilihan lini pertama yang ditetapkan SPESIALIS, bukan dimulai di FKTP (WHO Hepatitis B 2024).',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan hepatitis B kronik pada kompetensi 3A: FKTP menegakkan dugaan, melakukan konseling dan pencegahan penularan, lalu merujuk untuk penentuan terapi. WHO Hepatitis B (2024) menegaskan keputusan memulai antivirus bergantung pada ALT, kadar HBV DNA, status HBeAg, dan derajat fibrosis — bukan pada reaktifnya HBsAg semata — dengan tenofovir atau entecavir sebagai lini pertama bila terindikasi, serta menekankan vaksinasi dosis lahir dalam 24 jam dan HBIG pada bayi dari ibu HBsAg reaktif sebagai pemutus rantai penularan perinatal yang paling efektif.`,
    catatanRealita: 'Skrining donor darah dan skrining ibu hamil adalah dua pintu terbesar penemuan hepatitis B di Indonesia — dan keduanya menghasilkan pasien yang datang tanpa keluhan, sehingga mudah dipulangkan begitu saja dengan "tidak apa-apa, tidak ada gejala kok".',
    mutiaraEbm: 'ALT yang normal terasa sangat menenangkan pada HBsAg reaktif — seolah "virusnya ada tapi hatinya aman, jadi tidak perlu apa-apa". Padahal ALT normal TIDAK menyingkirkan fibrosis yang sedang berjalan: sebagian pasien hepatitis B kronik dengan ALT terus-menerus normal ternyata sudah memiliki fibrosis bermakna pada pemeriksaan hati, dan justru merekalah yang paling mudah lolos dari pemantauan selama bertahun-tahun. USG hati yang normal pun tidak menutup perkara: kanker hati pada hepatitis B dapat muncul TANPA melewati sirosis lebih dulu, sehingga pemantauan berkala tetap wajib walau hari ini semuanya tampak baik.',
    konsekuensi: {
      narasi: 'Bila dipulangkan dengan "tidak apa-apa, tidak ada gejala", tidak ada satu pun rantai yang diputus: keluarga serumah tidak diperiksa dan tidak divaksin, alkohol jalan terus, dan indikasi antivirus tidak pernah dinilai. Penyakitnya bekerja diam-diam selama bertahun-tahun.',
      kembaliHariMin: 120,
      kembaliHariMax: 240,
      kondisiKembali: 'Pasien kembali beberapa bulan kemudian membawa istrinya, yang kini HBsAg reaktif juga karena vaksinasi kontak serumah tidak pernah dijalankan — sementara pasien sendiri belum pernah dinilai indikasi antivirusnya dan alkoholnya berjalan terus.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 / WHO Hepatitis B Guidelines 2024 — konseling, vaksinasi kontak serumah, rujuk untuk penilaian indikasi antivirus dan pemantauan berkala.',
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
    nama: 'PPOK Eksaserbasi Berat dengan Infeksi Saluran Napas Bawah',
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
        tanya: 'Dahaknya berubah warna dan bertambah banyak? (Keluarga boleh membantu menjawab.)',
        jawab: 'Istrinya menjawab: "Dahaknya berubah dok, biasanya bening dan sedikit, tiga hari ini jadi kuning kehijauan, kental, dan banyak sekali sampai satu gelas kecil sehari."',
        esensial: true,
        oldcarts: ['karakter', 'onset'],
      },
      {
        id: 'q_demam_ppok',
        kategori: 'rps',
        tanya: 'Ada demam atau menggigil sejak sesaknya memberat?',
        jawab: 'Istrinya menjawab: "Panas badannya dok, dua hari ini. Semalam sempat menggigil sampai selimutnya ditumpuk dua."',
        esensial: true,
        oldcarts: ['onset', 'penyerta'],
      },
      {
        id: 'q_bicara',
        kategori: 'rps',
        tanya: 'Sejak kapan bicaranya jadi terputus-putus begini? Masih bisa menyelesaikan satu kalimat?',
        jawab: 'Istrinya menjawab: "Sejak semalam dok. Tadi pagi masih bisa bicara beberapa kata sekaligus, sekarang sepatah-sepatah. Makan pun berhenti terus untuk ambil napas."',
        esensial: true,
        oldcarts: ['onset', 'keparahan'],
      },
      {
        id: 'q_kesadaran_ppok',
        kategori: 'rps',
        tanya: 'Ada bingung, mengantuk berat, atau bicara ngelantur?',
        jawab: 'Istrinya menjawab: "Sejak subuh dia agak bingung dok, ditanya nama cucunya salah menjawab. Tadi juga sempat mengantuk sekali padahal semalaman tidak tidur."',
        esensial: true,
        oldcarts: ['onset', 'keparahan'],
      },
      {
        id: 'q_rokok_ppok',
        kategori: 'sosial',
        tanya: 'Riwayat merokoknya bagaimana Pak?',
        jawab: 'Istrinya menjawab: "Dari umur lima belas dok, sehari dua bungkus, sampai sekarang masih. Sudah puluhan tahun, disuruh berhenti tidak pernah mau."',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_riwayat_ppok',
        kategori: 'rpd',
        tanya: 'Sudah lama batuk berdahak menahun? Pernah dirawat karena paru?',
        jawab: 'Istrinya menjawab: "Batuk berdahak tiap pagi sudah bertahun-tahun dok, kami pikir batuk perokok biasa. Tahun lalu dirawat empat hari karena sesak, dan setahun ini sudah tiga kali sesak berat begini."',
        oldcarts: ['durasi'],
      },
      {
        id: 'q_inhaler',
        kategori: 'rpd',
        tanya: 'Ada obat semprot atau inhaler dari dokter? Bagaimana cara memakainya?',
        jawab: 'Istrinya menjawab: "Ada dok, tapi jarang dipakai, katanya tidak terasa apa-apa. Cara pakainya disemprot ke mulut lalu langsung ditelan ludahnya, tidak ditarik napas dalam. Sudah tiga hari ini disemprot terus tapi tidak ada gunanya."',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kaki_ppok',
        kategori: 'rps',
        tanya: 'Kakinya bengkak? Tidur harus pakai bantal tinggi?',
        jawab: 'Istrinya menjawab: "Kaki tidak bengkak dok. Tidur memang sudah lama setengah duduk, tapi karena sesak lama, bukan yang baru."',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_pekerjaan_ppok',
        kategori: 'sosial',
        tanya: 'Dulu Bapak bekerja apa?',
        jawab: 'Istrinya menjawab: "Sopir angkot dok, puluhan tahun. Sudah berhenti lima tahun lalu karena tidak kuat."',
        distraktor: true,
      },
      {
        id: 'q_alergi_ppok',
        kategori: 'rpd',
        tanya: 'Ada alergi obat?',
        jawab: 'Istrinya menjawab: "Tidak ada dok, selama ini minum obat apa saja aman."',
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
    lab: [
      { id: 'foto_toraks', hasil: 'Hiperinflasi dengan diafragma mendatar dan sela iga melebar (sesuai PPOK); TAMPAK INFILTRAT baru di lobus bawah kanan — infeksi saluran napas bawah. Jantung tidak membesar, tidak ada pneumotoraks, tidak ada efusi bermakna.', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Leukosit 16.800/uL dengan pergeseran ke kiri; Hb 17,4 g/dL dan hematokrit 53% (polisitemia sekunder — petanda hipoksemia kronik menahun).', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['J44.0', 'J18.9', 'I50.1'],
    tatalaksana: {
      obatBenar: ['prednison_5'],
      // Ketiga gejala kardinal Anthonisen lengkap DAN infiltrat terdokumentasi
      // (J44.0) → antibiotik jelas terindikasi. Satu slot "pilih salah satu":
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
    stabilisasiWajib: ['oksigen', 'nebulisasi'],
    clue: 'PPOK EKSASERBASI BERAT DENGAN INFEKSI SALURAN NAPAS BAWAH (SKDI 3B - RUJUK): perokok berat puluhan tahun dengan ketiga gejala kardinal Anthonisen LENGKAP (sesak bertambah + volume dahak bertambah + dahak menjadi purulen) DITAMBAH demam dan infiltrat basal kanan pada foto toraks — inilah yang membedakannya dari eksaserbasi tanpa infeksi terdokumentasi. Tanda gagal napas MENGANCAM: bicara terputus per KATA, otot bantu napas aktif, sianosis sentral, kesadaran mulai terganggu, SpO2 88%. Bundel GOLD: OKSIGEN TERKONTROL dengan TARGET SpO2 88-92% — dan ini poin EBM yang menentukan: pada PPOK dengan retensi CO2 kronik, oksigen berlebihan (mengejar SpO2 98-100%) MEMPERBURUK hiperkapnia lewat mekanisme ruang rugi dan efek Haldane, dan terbukti MENAIKKAN MORTALITAS dibanding oksigen yang dititrasi. Naikkan oksigen sampai 88-92%, lalu BERHENTI. Ditambah: bronkodilator NEBULISASI, kortikosteroid sistemik, antibiotik (ketiga gejala kardinal + infiltrat), pemantauan ketat, lalu RUJUK paru SEGERA — pasien ini kandidat ventilasi noninvasif yang tidak tersedia di FKTP.',
    panduanResmi: `${PPK_FLOOR} PPK 1186/2022 membatasi kompetensi FKTP pada eksaserbasi PPOK RINGAN; eksaserbasi sedang sampai berat wajib rujuk. Bila sediaan inhalasi tidak tersedia, PPK membolehkan bronkodilator injeksi (aminofilin bolus 5 mg/kgBB atau adrenalin 0,3 mg subkutan) — penekanan yang berbeda dari GOLD yang mengutamakan rute inhalasi. Kortikosteroid sistemik 30-40 mg/hari selama 5 hari, tanpa tapering. GOLD menetapkan target saturasi 88-92% pada eksaserbasi PPOK dan menempatkan ventilasi noninvasif sebagai terapi lini pertama gagal napas hiperkapnik.`,
    catatanRealita: 'Skenario mengasumsikan oksigen, nebulizer, dan transport siap. Kenyataannya banyak Puskesmas hanya punya satu tabung oksigen tanpa pulse oximeter yang berfungsi — padahal justru target 88-92% mustahil dijalankan tanpa oksimeter, sehingga praktik lapangan cenderung "buka besar biar aman", persis yang berbahaya di sini.',
    mutiaraEbm: 'Dua temuan pada pasien ini justru menyesatkan bila dibaca sepintas. Pertama, WHEEZING YANG MELEMAH atau menghilang bukan tanda pasien membaik — pada eksaserbasi berat itu berarti aliran udara sudah terlalu kecil untuk menghasilkan bunyi (silent chest), tanda perburukan menuju henti napas; pasien yang mengi keras justru masih menggerakkan udara. Kedua, SpO2 yang naik ke 98% setelah oksigen dibuka besar terasa seperti keberhasilan, padahal pada PPOK dengan retensi CO2 itu adalah lampu merah: saturasi tinggi menyembunyikan CO2 yang sedang menumpuk, dan pasien dapat tampak "tenang dan membaik" tepat saat ia jatuh ke narkosis CO2. Ketenangan mendadak pada pasien yang tadinya gelisah bukan perbaikan — itu kesadaran yang menurun.',
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
