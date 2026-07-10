/**
 * KASUS BATCH B — Penyakit Kronis, Metabolik, KIA & Kegawatan Rujuk.
 * Delapan kasus yang menyeimbangkan poli harian: hipertensi & DM (silent killer
 * yang menuntut kepatuhan), gastritis & asma (tatalaksana rasional + anti-antibiotik
 * berlebih), otitis & anemia bumil (KIA), lalu dua kasus RUJUK (pneumonia balita &
 * stroke iskemik) yang mengajarkan gatekeeping SKDI 3B dan "Time is Brain".
 *
 * Akurasi medis mengikuti JNC-8, PERKENI 2021, GINA, IMCI/WHO, PERDOSSI, dan
 * Permenkes terkait — dituliskan pada `clue` & `konsekuensi.guideline`.
 *
 * Catatan integrasi: sesuai BUILD_SPECS, pertanyaan tak relevan diberi
 * `distraktor: true` (menggerus gauge Sabar & dinilai negatif oleh clinic.ts).
 */

import type { KasusKlinis } from '../types'

export const KASUS_KRONIS: KasusKlinis[] = [
  /* ======================================================================
   * 1. HIPERTENSI ESENSIAL — I10 · 4A · kardiovaskular
   *    Silent killer; konsekuensi bila obat tak diminum (kembali 5-9 hari).
   * ==================================================================== */
  {
    id: 'hipertensi_esensial',
    nama: 'Hipertensi Esensial',
    icd10: 'I10',
    skdi: '4A',
    kategori: 'kardiovaskular',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Tengkuk saya terasa berat dan sering pusing, Dok, sudah beberapa hari ini.',
    demografi: { usiaMin: 45, usiaMax: 65 },
    vital: { td: '160/95', nadi: 80, rr: 18, suhu: 36.7 },
    anamnesis: [
      {
        id: 'ht_ku',
        kategori: 'keluhan_utama',
        tanya: 'Boleh diceritakan keluhan yang paling mengganggu?',
        jawab: 'Tengkuk saya berat, kepala pusing cenat-cenut di bagian belakang, Dok.',
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
        variasi: {
          polos: 'Tengkuk kenceng banget, mumet dok, kayak dibeban-i.',
          terpelajar: 'Ada rasa tegang di tengkuk disertai nyeri kepala di bagian belakang, Dok.',
          cemas: 'Kepala saya pusing terus, Dok, saya takut ini gejala stroke...',
        },
      },
      {
        id: 'ht_onset',
        kategori: 'rps',
        tanya: 'Sejak kapan keluhan ini muncul dan apakah terus-menerus?',
        jawab: 'Sekitar tiga hari ini, hilang timbul terutama pagi hari.',
        esensial: true,
        oldcarts: ['onset', 'durasi', 'waktu'],
        variasi: {
          polos: 'Wes telung dino iki dok, kambuhan.',
          terpelajar: 'Kurang lebih tiga hari, hilang-timbul, lebih berat saat bangun tidur.',
          cemas: 'Baru tiga hari tapi rasanya makin sering, saya jadi susah tidur.',
        },
      },
      {
        id: 'ht_penyerta',
        kategori: 'rps',
        tanya: 'Ada pandangan kabur, mual, atau nyeri dada yang menyertai?',
        jawab: 'Pandangan sedikit kabur kalau pusing, tapi tidak ada nyeri dada.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'ht_riwayat',
        kategori: 'rpd',
        tanya: 'Apakah dulu pernah dikatakan tekanan darahnya tinggi?',
        jawab: 'Pernah, dua tahun lalu dikatakan tinggi, tapi saya jarang kontrol.',
        esensial: true,
        oldcarts: ['durasi'],
        variasi: {
          polos: 'Dulu tau tinggi dok, tapi ya wis, ora tau mriksa.',
          terpelajar: 'Ya, dua tahun lalu saya didiagnosis darah tinggi, tapi kurang patuh kontrol.',
          cemas: 'Pernah dibilang tinggi, makanya saya khawatir sekarang tambah parah.',
        },
      },
      {
        id: 'ht_obat',
        kategori: 'rpd',
        tanya: 'Apakah rutin minum obat tekanan darah?',
        jawab: 'Tidak, Dok. Kalau pusing saja saya beli obat warung.',
      },
      {
        id: 'ht_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada riwayat darah tinggi atau penyakit jantung?',
        jawab: 'Bapak dan ibu saya darah tinggi semua, bapak kena stroke.',
        esensial: true,
      },
      {
        id: 'ht_garam',
        kategori: 'sosial',
        tanya: 'Bagaimana kebiasaan makan asin dan berlemak sehari-hari?',
        jawab: 'Suka yang gurih-gurih, ikan asin, dan santan, Dok.',
      },
      {
        id: 'ht_rokok',
        kategori: 'sosial',
        tanya: 'Apakah merokok, dan bagaimana aktivitas fisiknya?',
        jawab: 'Masih merokok sekitar setengah bungkus, jarang olahraga karena kerja duduk.',
      },
      {
        id: 'dist_ht_kulit',
        kategori: 'rps',
        tanya: 'Apakah ada gatal-gatal atau ruam di kulit belakangan ini?',
        jawab: 'Tidak ada gatal atau ruam, Dok, kulit saya biasa saja.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Composmentis, tampak tenang. IMT 28 kg/m² (obesitas), lingkar pinggang berlebih.', relevan: true },
      { region: 'jantung', temuan: 'Iktus kordis tidak bergeser, S1-S2 reguler, tidak ada murmur maupun gallop; batas jantung normal.', relevan: true },
      { region: 'kepala_leher', temuan: 'JVP tidak meningkat, tidak ada pembesaran tiroid maupun bruit karotis.', relevan: false },
      { region: 'toraks_paru', temuan: 'Gerak napas simetris, vesikuler, ronki (-), wheezing (-).', relevan: false },
      { region: 'ekstremitas', temuan: 'Akral hangat, tidak ada edema pretibial, pulsasi teraba kuat.', relevan: false },
      { region: 'abdomen', temuan: 'Supel, bising usus normal, hepar/lien tidak teraba.', relevan: false },
    ],
    lab: [
      { id: 'gdp', hasil: 'Gula darah puasa 108 mg/dL (batas normal atas).', flag: 'normal', relevan: true },
      { id: 'kolesterol', hasil: 'Kolesterol total 235, LDL 158, HDL 38, trigliserida 190 mg/dL — dislipidemia.', flag: 'tinggi', relevan: true },
      { id: 'urinalisis', hasil: 'Protein urin negatif, sedimen normal — belum ada tanda nefropati.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['I10', 'I11.9', 'I15.9', 'G44.2'],
    tatalaksana: {
      obatBenar: ['amlodipine_5'],
      obatSalahUmum: [
        { id: 'ibuprofen_400', alasan: 'NSAID menaikkan tekanan darah dan mengganggu ginjal — hindari pada hipertensi.' },
        { id: 'paracetamol_500', alasan: 'Hanya meredakan nyeri kepala, tidak menurunkan tekanan darah; bukan terapi hipertensi.' },
      ],
      edukasi: ['diet_rendah_garam', 'aktivitas_fisik', 'kepatuhan_obat', 'kontrol_rutin', 'berhenti_merokok'],
      // DeepThink triangulasi (2026-07-05): konsekuensi.narasi kasus ini eksplisit
      // — obat dihentikan sendiri krn takut efek samping → krisis hipertensi.
      edukasiKritis: ['kepatuhan_obat'],
    },
    clue: 'JNC-8: target TD <140/90 mmHg (usia <60 th). Lini pertama CCB/tiazid/ACEI — di Puskesmas amlodipin lazim. Hipertensi "silent killer", sering asimptomatik; skrining kerusakan organ target (jantung, ginjal, mata) wajib.',
    konsekuensi: {
      narasi: 'Merasa membaik setelah beberapa hari, obat dihentikan sendiri karena "takut ginjal rusak". Tekanan darah melonjak kembali tanpa gejala.',
      kembaliHariMin: 5,
      kembaliHariMax: 9,
      kondisiKembali: 'Kembali dengan TD 190/110 mmHg, nyeri kepala hebat dan pandangan kabur — krisis hipertensi karena obat tidak diminum.',
      guideline: 'JNC-8 & Permenkes No. 5/2014 tentang Panduan Praktik Klinis Dokter di FKTP.',
    },
  },

  /* ======================================================================
   * 2. DIABETES MELITUS TIPE 2 — E11.9 · 4A · metabolik
   * ==================================================================== */
  {
    id: 'dm_tipe2',
    nama: 'Diabetes Melitus Tipe 2',
    icd10: 'E11.9',
    skdi: '4A',
    kategori: 'metabolik',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Saya jadi sering kencing terutama malam hari, badan lemas, dan cepat haus, Dok.',
    demografi: { usiaMin: 40, usiaMax: 62 },
    vital: { td: '135/85', nadi: 84, rr: 18, suhu: 36.7, gds: 258 },
    anamnesis: [
      {
        id: 'dm_ku',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan utamanya seperti apa, boleh diceritakan?',
        jawab: 'Sering sekali kencing, apalagi malam sampai bolak-balik, haus terus, dan badan lemas.',
        esensial: true,
        oldcarts: ['durasi', 'karakter', 'waktu'],
        variasi: {
          polos: 'Kencing terus dok, ngombe akeh tetep ngelak, awak lemes.',
          terpelajar: 'Saya jadi sering buang air kecil terutama malam hari, gampang haus, dan mudah lelah, Dok.',
          cemas: 'Kencing saya jadi sering banget, Dok, saya takut ini kencing manis seperti orang tua saya.',
        },
      },
      {
        id: 'dm_bb',
        kategori: 'rps',
        tanya: 'Apakah berat badan turun belakangan ini padahal makan biasa?',
        jawab: 'Iya, turun sekitar 5 kg dalam dua bulan padahal makan malah bertambah.',
        esensial: true,
        oldcarts: ['penyerta'],
        variasi: {
          polos: 'Iyo dok, mudhun 5 kilo, mangan malah tambah akeh.',
          terpelajar: 'Ya, berat badan saya turun sekitar 5 kg dalam dua bulan meski makan lebih banyak.',
          cemas: 'Berat saya turun terus, Dok, padahal makan banyak — saya jadi khawatir.',
        },
      },
      {
        id: 'dm_luka',
        kategori: 'rps',
        // M10 Batch-2 (CODEX C.6): jawaban dinetralkan gender — "keputihan"
        // janggal dari pasien DM laki-laki (demografi me-roll keduanya). Gatal
        // lipatan/selangkangan (kandidiasis intertriginosa) = tanda klasik DM
        // yang berlaku utk semua pasien.
        tanya: 'Ada luka yang sulit sembuh atau sering gatal di area lipatan kulit?',
        jawab: 'Belum ada luka, tapi memang sering gatal di selangkangan dan lipatan kulit, Dok.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'dm_kesemutan',
        kategori: 'rps',
        tanya: 'Ada rasa kesemutan atau kebas di kaki?',
        jawab: 'Kadang-kadang kesemutan di ujung jari kaki, Dok.',
      },
      {
        id: 'dm_riwayat',
        kategori: 'rpd',
        tanya: 'Dulu pernah diperiksa gula darahnya tinggi?',
        jawab: 'Pernah dikatakan agak tinggi saat cek gratis, tapi saya tidak kontrol lagi.',
        esensial: true,
        oldcarts: ['durasi'],
        variasi: {
          polos: 'Tau dicek pas ana bazar, jare rada dhuwur, tapi ora tak teruske.',
          terpelajar: 'Waktu pemeriksaan, gula darah saya pernah ketahuan tinggi, tapi tidak saya tindak lanjuti.',
          cemas: 'Dulu pernah dibilang agak tinggi, makanya sekarang saya takut sudah parah.',
        },
      },
      {
        id: 'dm_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada riwayat kencing manis?',
        jawab: 'Ibu saya diabetes, sampai harus suntik insulin dulu.',
        esensial: true,
      },
      {
        id: 'dm_diet',
        kategori: 'sosial',
        tanya: 'Bagaimana kebiasaan makan dan minum manis sehari-hari?',
        jawab: 'Saya suka teh manis dan gorengan, nasi juga porsinya banyak.',
      },
      {
        id: 'dm_aktivitas',
        kategori: 'sosial',
        tanya: 'Seberapa sering beraktivitas fisik atau olahraga?',
        jawab: 'Jarang, Dok, kerjanya duduk dan malas jalan.',
      },
      {
        id: 'dist_dm_batuk',
        kategori: 'rps',
        tanya: 'Apakah ada batuk pilek atau demam dalam minggu ini?',
        jawab: 'Tidak ada batuk atau demam, Dok, hanya keluhan yang tadi.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'IMT 27 kg/m² (obesitas), tampak lemas, mukosa bibir agak kering.', relevan: true },
      { region: 'ekstremitas', temuan: 'Sensasi proteksi menurun pada kedua telapak kaki (uji monofilamen 10 g), pulsasi dorsalis pedis teraba, tidak ada ulkus.', relevan: true },
      { region: 'abdomen', temuan: 'Supel, bising usus normal, tidak ada nyeri tekan.', relevan: false },
      { region: 'kepala_leher', temuan: 'Konjungtiva tidak pucat, tidak ada pembesaran tiroid.', relevan: false },
      { region: 'kulit', temuan: 'Turgor kulit normal, tidak ada infeksi jamur luas maupun akantosis mencolok.', relevan: false },
    ],
    lab: [
      { id: 'gdp', hasil: 'Gula darah puasa 182 mg/dL (tinggi, normal <100).', flag: 'tinggi', relevan: true },
      { id: 'urinalisis', hasil: 'Reduksi glukosa urin +++, keton negatif.', flag: 'abnormal', relevan: true },
      { id: 'kolesterol', hasil: 'LDL 148, trigliserida 210 mg/dL — dislipidemia penyerta.', flag: 'tinggi', relevan: true },
      { id: 'hba1c', hasil: 'HbA1c 8,9% (tinggi, target <7%) — kendali glikemik 3 bulan terakhir buruk, mengonfirmasi DM.', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['E11.9', 'E10.9', 'E13.9', 'N39.0'],
    tatalaksana: {
      obatBenar: ['metformin_500'],
      obatSalahUmum: [
        { id: 'glibenclamide_5', alasan: 'Sulfonilurea bukan lini pertama dan berisiko hipoglikemia; mulai metformin dulu (PERKENI 2021).' },
      ],
      edukasi: ['diet_dm', 'aktivitas_fisik', 'kepatuhan_obat', 'kontrol_rutin'],
      // DeepThink triangulasi (2026-07-05): PERKENI — kepatuhan obat adalah tema
      // sentral manajemen DM kronis; putus obat → komplikasi mikro/makrovaskular.
      edukasiKritis: ['kepatuhan_obat'],
    },
    clue: 'PERKENI 2021: diagnosis DM bila GDP ≥126, GDS ≥200 + gejala klasik (poliuri, polidipsi, polifagi, BB turun), atau HbA1c ≥6,5%. Lini pertama metformin + modifikasi gaya hidup. Kelola di FKTP kecuali ada komplikasi akut/berat.',
  },

  /* ======================================================================
   * 3. GASTRITIS / DISPEPSIA — K29.7 · 4A · pencernaan
   * ==================================================================== */
  {
    id: 'gastritis',
    nama: 'Gastritis (Dispepsia)',
    icd10: 'K29.7',
    skdi: '4A',
    kategori: 'pencernaan',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Ulu hati saya perih dan mual, Dok, terutama kalau telat makan.',
    demografi: { usiaMin: 20, usiaMax: 45 },
    vital: { td: '120/80', nadi: 80, rr: 18, suhu: 36.6 },
    anamnesis: [
      {
        id: 'gas_ku',
        kategori: 'keluhan_utama',
        tanya: 'Coba jelaskan nyeri ulu hatinya seperti apa?',
        jawab: 'Perih dan panas di ulu hati, kadang terasa penuh dan begah setelah makan.',
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
        variasi: {
          polos: 'Kerasa perih nemen ning ulu ati dok, mules karo kembung.',
          terpelajar: 'Ada rasa terbakar di ulu hati disertai rasa penuh, Dok.',
          cemas: 'Perih sekali di ulu hati, Dok, jangan-jangan ini sakit lambung parah ya?',
        },
      },
      {
        id: 'gas_onset',
        kategori: 'rps',
        tanya: 'Sudah berapa lama keluhan ini berlangsung?',
        jawab: 'Hilang timbul sekitar dua minggu, memberat kalau perut kosong atau stres.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
        variasi: {
          polos: 'Wis rong minggu kambuhan dok, tambah perih nek weteng kosong.',
          terpelajar: 'Sekitar dua minggu, hilang-timbul, memberat saat perut kosong dan stres.',
          cemas: 'Sudah dua minggu tidak sembuh-sembuh, Dok, saya takut ini luka lambung.',
        },
      },
      {
        id: 'gas_agravasi',
        kategori: 'rps',
        tanya: 'Apa yang memperberat dan memperingan keluhannya?',
        jawab: 'Memberat kalau telat makan, kopi, dan pedas; agak reda setelah makan.',
        esensial: true,
        oldcarts: ['agravasi'],
        variasi: {
          polos: 'Nek telat mangan, ngopi, karo pedhes tambah perih; mendhing bar mangan.',
          terpelajar: 'Dipicu keterlambatan makan, kopi, dan makanan pedas; mereda setelah makan.',
          cemas: 'Kalau telat makan langsung perih parah, Dok, saya jadi takut makan telat.',
        },
      },
      {
        id: 'gas_alarm',
        kategori: 'rps',
        tanya: 'Apakah pernah muntah darah, BAB hitam, atau berat badan turun drastis?',
        jawab: 'Tidak ada muntah darah maupun BAB hitam, berat badan stabil.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'gas_obat',
        kategori: 'rpd',
        tanya: 'Sering minum obat pereda nyeri, jamu, atau obat warung?',
        jawab: 'Iya, kalau pegal saya sering minum obat nyeri dan jamu pegal linu.',
        esensial: true,
      },
      {
        id: 'gas_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada yang punya sakit maag atau lambung?',
        jawab: 'Ibu saya juga sering maag, Dok.',
      },
      {
        id: 'gas_gayahidup',
        kategori: 'sosial',
        tanya: 'Bagaimana pola makan, kebiasaan kopi, dan tingkat stres?',
        jawab: 'Makan sering telat karena kerja, ngopi 3 gelas sehari, lagi banyak pikiran.',
      },
      {
        id: 'gas_rokok',
        kategori: 'sosial',
        tanya: 'Apakah merokok atau minum minuman beralkohol?',
        jawab: 'Merokok sedikit, alkohol tidak, Dok.',
      },
      {
        id: 'dist_gas_sendi',
        kategori: 'rps',
        tanya: 'Apakah ada nyeri atau bengkak di persendian?',
        jawab: 'Tidak ada nyeri sendi, Dok, hanya lambung yang bermasalah.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'abdomen', temuan: 'Nyeri tekan epigastrium (+), tidak ada defans muskular, bising usus normal, hepar/lien tidak teraba.', relevan: true },
      { region: 'umum', temuan: 'Tampak sakit ringan, tidak anemis, tanda dehidrasi (-), berat badan tidak menurun — dispepsia tanpa tanda alarm.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler, ronki (-); nyeri tidak dipicu aktivitas — mengarah non-kardiak.', relevan: false },
      { region: 'jantung', temuan: 'S1-S2 reguler, tidak ada murmur.', relevan: false },
      { region: 'ekstremitas', temuan: 'Akral hangat, tidak ada edema.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Hb 14,2 g/dL, leukosit dan trombosit normal — tidak ada anemia perdarahan.', flag: 'normal', relevan: true },
      { id: 'feses_rutin', hasil: 'Tidak dilakukan indikasi kuat; bila diperiksa darah samar negatif.', flag: 'normal', relevan: false },
      { id: 'urinalisis', hasil: 'Dalam batas normal.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['K29.7', 'K30', 'K21.9', 'K27.9'],
    tatalaksana: {
      obatBenar: ['omeprazole_20'],
      obatSalahUmum: [
        { id: 'ibuprofen_400', alasan: 'NSAID mengiritasi mukosa lambung dan memperberat gastritis — justru pemicu.' },
        { id: 'amoxicillin_500', alasan: 'Antibiotik tidak diindikasikan tanpa bukti infeksi H. pylori (tes napas/feses/serologi).' },
      ],
      // M10.c (dossier §47): gizi_seimbang (Isi Piringku, generik) diganti
      // diet_lambung — clue "modifikasi gaya hidup + waspadai NSAID/jamu pemicu";
      // inti ajar dispepsia = hindari pemicu (pedas/asam/kopi), bukan gizi umum.
      edukasi: ['kepatuhan_obat', 'diet_lambung', 'tanda_bahaya'],
    },
    clue: 'Dispepsia tanpa tanda alarm (usia <40 th, tanpa muntah darah/BAB hitam/BB turun/anemia/disfagia) → terapi empiris PPI 4 minggu + modifikasi gaya hidup, bukan langsung endoskopi (Konsensus Nasional Dispepsia PGI). Waspadai NSAID & jamu pegal sebagai pemicu.',
  },

  /* ======================================================================
   * 4. ASMA BRONKIAL RINGAN — J45.9 · 4A · respirasi
   * ==================================================================== */
  {
    id: 'asma_ringan',
    nama: 'Asma Bronkial (Ringan)',
    icd10: 'J45.9',
    skdi: '4A',
    kategori: 'respirasi',
    fktp144: true,
    harusDirujuk: false,
    keluhanUtama: 'Napas saya sering sesak berbunyi ngik-ngik, Dok, apalagi malam dan kena debu.',
    demografi: { usiaMin: 15, usiaMax: 40 },
    vital: { td: '110/70', nadi: 92, rr: 22, suhu: 36.6, spo2: 97 },
    anamnesis: [
      {
        id: 'as_ku',
        kategori: 'keluhan_utama',
        tanya: 'Sesaknya seperti apa, apakah disertai bunyi?',
        jawab: 'Sesak disertai bunyi mengi ngik-ngik, dada terasa berat, kadang batuk kering.',
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
        variasi: {
          polos: 'Ambekan sesek karo muni ngik-ngik dok, dodo rasane abot.',
          terpelajar: 'Napas saya berbunyi ngik-ngik saat mengembuskan dan dada terasa tertekan, Dok, hilang-timbul.',
          cemas: 'Sesaknya bikin panik, Dok, rasanya seperti mau tercekik kalau malam.',
        },
      },
      {
        id: 'as_pemicu',
        kategori: 'rps',
        tanya: 'Apa yang biasanya memicu sesaknya?',
        jawab: 'Kalau kena debu, udara dingin, atau capek habis aktivitas berat.',
        esensial: true,
        oldcarts: ['agravasi'],
        variasi: {
          polos: 'Nek kena bledug, hawa adhem, karo kekeselen mesti kumat dok.',
          terpelajar: 'Pemicunya paparan debu, udara dingin, dan aktivitas fisik berat.',
          cemas: 'Sedikit kena debu langsung sesak, Dok, saya sampai takut keluar rumah.',
        },
      },
      {
        id: 'as_waktu',
        kategori: 'rps',
        tanya: 'Kapan sesak paling sering muncul, apakah mengganggu tidur?',
        jawab: 'Sering muncul malam atau menjelang subuh, kadang terbangun karena sesak.',
        esensial: true,
        oldcarts: ['waktu'],
        variasi: {
          polos: 'Umume bengi utawa arep subuh dok, kadang nganti tangi merga sesek.',
          terpelajar: 'Lebih sering muncul malam menjelang dini hari, kadang sampai membangunkan saya dari tidur.',
          cemas: 'Paling parah malam hari, Dok, saya sering terbangun panik karena sesak.',
        },
      },
      {
        id: 'as_frekuensi',
        kategori: 'rps',
        tanya: 'Dalam seminggu kira-kira berapa kali kambuh?',
        jawab: 'Sekitar dua kali seminggu, masih bisa beraktivitas biasa di sela-selanya.',
        oldcarts: ['keparahan'],
      },
      {
        id: 'as_riwayat',
        kategori: 'rpd',
        tanya: 'Sejak kapan mengalami ini, ada riwayat alergi lain?',
        jawab: 'Sejak kecil sering sesak begini, dan saya juga sering bersin-bersin alergi debu.',
        esensial: true,
        oldcarts: ['onset'],
      },
      {
        id: 'as_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada riwayat asma, alergi, atau eksim?',
        jawab: 'Ibu saya asma, adik saya sering biduran alergi.',
      },
      {
        id: 'as_paparan',
        kategori: 'sosial',
        tanya: 'Di rumah ada perokok, hewan berbulu, atau debu tebal?',
        jawab: 'Suami saya merokok di dalam rumah, dan banyak debu kasur lama.',
      },
      {
        id: 'as_pekerjaan',
        kategori: 'sosial',
        tanya: 'Pekerjaannya apa, adakah paparan asap atau bahan kimia?',
        jawab: 'Saya penjahit, sering terpapar serat kain dan debu, Dok.',
      },
      {
        id: 'dist_as_bak',
        kategori: 'rps',
        tanya: 'Apakah belakangan sering buang air kecil atau mudah haus?',
        jawab: 'Tidak, Dok, buang air kecil biasa saja.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'toraks_paru', temuan: 'Wheezing ekspiratoar bilateral, ekspirasi memanjang, ronki (-), retraksi (-).', relevan: true },
      { region: 'umum', temuan: 'Sesak ringan, masih bicara kalimat penuh, tidak sianosis, posisi nyaman duduk.', relevan: true },
      { region: 'tht_mulut', temuan: 'Mukosa hidung pucat dan edema (tanda rinitis alergi), tidak ada tonsil membesar.', relevan: false },
      { region: 'jantung', temuan: 'S1-S2 reguler, tidak ada murmur, tidak ada tanda gagal jantung.', relevan: false },
      { region: 'kulit', temuan: 'Tidak ada urtikaria maupun sianosis akral.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Bila diperiksa: eosinofil sedikit meningkat, lainnya normal — tidak mengubah tatalaksana awal.', flag: 'normal', relevan: false },
      { id: 'urinalisis', hasil: 'Dalam batas normal.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['J45.9', 'J20.9', 'J44.9', 'J30.4'],
    tatalaksana: {
      obatBenar: ['salbutamol_inhaler', 'budesonide_inhaler'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Asma bukan infeksi bakteri; antibiotik tidak diindikasikan tanpa tanda infeksi.' },
        { id: 'salbutamol_2', alasan: 'SABA oral kurang efektif dan lebih banyak efek samping (tremor, berdebar) dibanding inhalasi.' },
      ],
      // M10.c (dossier §47): clue eksplisit "ajarkan teknik inhaler" + KEDUA
      // obatBenar adalah inhaler, tapi teknik_inhaler absen. hindari_alergen
      // generik diganti hindari_pencetus_asma ("kendalikan pencetus, asap
      // rokok rumah!"). teknik_inhaler jadi edukasiKritis: teknik salah = obat
      // tak sampai paru → terapi GINA-nya sendiri tak bekerja.
      edukasi: ['teknik_inhaler', 'hindari_pencetus_asma', 'kepatuhan_obat', 'kontrol_rutin'],
      edukasiKritis: ['teknik_inhaler'],
    },
    clue: 'GINA 2019+: gejala ≥2×/minggu + terbangun malam = asma PERSISTEN, bukan sekadar intermiten. Kunci pembaruan GINA: SABA-tunggal TIDAK lagi dianjurkan pada asma mana pun — setiap pasien butuh terapi mengandung ICS. Beri pengendali ICS (budesonid inhalasi) + reliever (salbutamol inhalasi/ICS-formoterol), kendalikan pencetus (asap rokok rumah!), ajarkan teknik inhaler, nilai kontrol tiap kunjungan. Antibiotik rutin tidak diindikasikan.',
  },

  /* ======================================================================
   * 5. OTITIS MEDIA AKUT — H66.0 · 4A · tht (anak)
   * ==================================================================== */
  {
    id: 'otitis_media_akut',
    nama: 'Otitis Media Akut',
    icd10: 'H66.0',
    skdi: '4A',
    kategori: 'tht',
    fktp144: true,
    harusDirujuk: false,
    keluhanUtama: 'Anak saya rewel dan menarik-narik telinganya sambil menangis, Dok, semalam demam.',
    demografi: { usiaMin: 2, usiaMax: 8 },
    vital: { nadi: 96, rr: 22, suhu: 38.3 },
    anamnesis: [
      {
        id: 'om_ku',
        kategori: 'keluhan_utama',
        tanya: 'Sejak kapan anak mengeluh telinganya dan bagaimana rewelnya?',
        jawab: 'Sejak semalam ia menangis kesakitan sambil memegang telinga kanan dan susah tidur.',
        esensial: true,
        oldcarts: ['lokasi', 'onset'],
        variasi: {
          polos: 'Wingi bengi nangis njerit-njerit dok, kupinge dicekeli terus.',
          terpelajar: 'Sejak tadi malam ia mengeluh nyeri di telinga kanan, rewel, dan sulit tidur.',
          cemas: 'Dia nangis terus pegang telinga, Dok, saya takut ada apa-apa di dalam telinganya.',
        },
      },
      {
        id: 'om_demam',
        kategori: 'rps',
        tanya: 'Apakah disertai demam, seberapa tinggi?',
        jawab: 'Iya, semalam badannya panas, saya ukur 38,5 derajat.',
        esensial: true,
        oldcarts: ['penyerta'],
        variasi: {
          polos: 'Iyo dok, wingi bengi awake panas, tak ukur 38,5.',
          terpelajar: 'Ya, semalam demam, saya ukur di ketiak 38,5 derajat.',
          cemas: 'Panasnya tinggi sekali, Dok, sampai 38,5 — saya takut kejang.',
        },
      },
      {
        id: 'om_pilek',
        kategori: 'rps',
        tanya: 'Sebelum sakit telinga, apakah ada batuk pilek dulu?',
        jawab: 'Iya, beberapa hari sebelumnya ia pilek dan hidungnya mampet.',
        esensial: true,
        oldcarts: ['onset'],
        variasi: {
          polos: 'Iyo dok, sadurunge ki pilek, irunge mampet.',
          terpelajar: 'Ya, beberapa hari sebelumnya ada pilek dan hidung tersumbat.',
          cemas: 'Sebelumnya dia pilek terus, Dok, apa ini akibat pileknya menjalar?',
        },
      },
      {
        id: 'om_cairan',
        kategori: 'rps',
        tanya: 'Apakah ada cairan atau nanah yang keluar dari telinganya?',
        jawab: 'Belum ada cairan yang keluar, Dok.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'om_riwayat',
        kategori: 'rpd',
        tanya: 'Apakah sebelumnya sering sakit telinga atau ISPA berulang?',
        jawab: 'Pernah sekali sakit telinga tahun lalu, dan memang sering pilek.',
      },
      {
        id: 'om_keluarga',
        kategori: 'rpk',
        tanya: 'Di rumah ada anggota keluarga lain yang sedang batuk pilek?',
        jawab: 'Kakaknya juga sedang pilek, Dok.',
      },
      {
        id: 'om_asap',
        kategori: 'sosial',
        tanya: 'Di rumah ada yang merokok, dan bagaimana kebiasaan menyusu anak?',
        jawab: 'Ayahnya merokok di rumah, dan anak sering menyusu botol sambil berbaring.',
      },
      {
        id: 'om_imunisasi',
        kategori: 'sosial',
        tanya: 'Imunisasi dasarnya bagaimana, lengkap?',
        jawab: 'Lengkap sampai usianya, Dok, ada di buku KIA.',
      },
      {
        id: "om_alergi",
        kategori: 'rpd',
        tanya: "Apakah anak punya riwayat alergi obat, terutama antibiotik?",
        jawab: "Tidak ada, Dok, selama ini minum obat tidak pernah bentol atau bengkak.",
        esensial: true,
      },
      {
        id: 'dist_om_bab',
        kategori: 'rps',
        tanya: 'Apakah anak juga mengalami diare atau BAB cair?',
        jawab: 'Tidak, Dok, BAB-nya normal, hanya rewel karena telinganya.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'tht_mulut', temuan: 'Otoskopi telinga kanan: membran timpani menonjol (bulging), hiperemis, refleks cahaya hilang, tidak ada perforasi maupun sekret.', relevan: true },
      { region: 'umum', temuan: 'Anak rewel, teraba demam, composmentis, hidrasi cukup, tidak tampak toksik.', relevan: true },
      { region: 'kepala_leher', temuan: 'Faring hiperemis ringan, tonsil T1-T1, tidak ada pembesaran KGB leher yang nyeri.', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler simetris, ronki (-), wheezing (-).', relevan: false },
      { region: 'abdomen', temuan: 'Supel, bising usus normal, tidak ada nyeri tekan.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Bila diperiksa: leukosit sedikit meningkat — tidak wajib, diagnosis klinis.', flag: 'normal', relevan: false },
      { id: 'urinalisis', hasil: 'Tidak terindikasi; dalam batas normal bila diperiksa.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['H66.0', 'H65.9', 'H60.9', 'J06.9'],
    tatalaksana: {
      obatBenar: ['amoxicillin_sirup', 'paracetamol_sirup'],
      obatSalahUmum: [
        { id: 'kloramfenikol_tetes_mata', alasan: 'Tetes mata bukan untuk telinga; OMA tanpa perforasi butuh antibiotik sistemik.' },
        { id: 'cotrimoxazole_480', alasan: 'Bukan lini pertama OMA; amoksisilin dosis tinggi lebih tepat.' },
      ],
      edukasi: ['kepatuhan_obat', 'tanda_bahaya', 'kompres_demam'],
    },
    clue: 'OMA (AAP/WHO): diagnosis butuh membran timpani menonjol (bulging) + tanda inflamasi akut. Amoksisilin dosis tinggi (80–90 mg/kg/hari) lini pertama + analgesik untuk nyeri. Tetes antibiotik hanya bila ada perforasi/otorea. Watchful waiting dapat dipertimbangkan pada kasus ringan usia >2 th.',
    // M11 Bagian B6 (DeepThink 2026-07-10, REVISI: dosis lapangan yg lebih
    // rendah tak boleh disebut "gagal" — masih efektif utk strain peka).
    // Sekaligus sisipan riwayat-pedoman (Opsi 2, §2 dossier
    // DEEPTHINK_M11_BAGIAN_B) — AAP menaikkan dosis 2013 krn resistensi,
    // genuinely pergeseran guideline temporal, bukan sekadar typo lama.
    catatanRealita: "Otoskop yang berfungsi tak selalu tersedia — kriteria 'bulging' (AAP) kerap jadi terkaan klinis. Dosis pun berevolusi: AAP naikkan ke 80–90 mg/kg/hari (2013) khusus menutup pneumokokus resisten-penisilin; di lapangan dosis sering menyusut ke ~40–50 mg/kg — masih memadai untuk strain peka, berisiko pada yang resisten.",
  },

  /* ======================================================================
   * 6. ANEMIA DEFISIENSI BESI PADA KEHAMILAN — D50.9 · 4A · kia
   *    Konsekuensi bila tablet tambah darah tidak diminum (kembali 5-9 hari).
   * ==================================================================== */
  {
    id: 'anemia_defisiensi_bumil',
    nama: 'Anemia Defisiensi Besi pada Kehamilan',
    icd10: 'D50.9',
    skdi: '4A',
    kategori: 'kia',
    fktp144: true,
    harusDirujuk: false,
    keluhanUtama: 'Saya sedang hamil dan akhir-akhir ini lemas, pusing, dan cepat capek, Dok.',
    demografi: { usiaMin: 20, usiaMax: 35, jenisKelamin: 'P' },
    vital: { td: '100/70', nadi: 96, rr: 20, suhu: 36.6 },
    anamnesis: [
      {
        id: 'an_ku',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan lemas dan pusingnya seperti apa, sejak kapan?',
        jawab: 'Badan lemas, kepala pusing berkunang-kunang kalau berdiri, sudah dua minggu makin sering.',
        esensial: true,
        oldcarts: ['durasi', 'karakter'],
        variasi: {
          polos: 'Awak lemes dok, sirah kem-kemeng, ngadeg sithik wis kunang-kunang.',
          terpelajar: 'Saya merasa lemas dan pusing berkunang-kunang, terutama saat berdiri dari duduk, Dok.',
          cemas: 'Saya takut kenapa-kenapa dengan bayi saya, Dok, badan lemas terus dan pucat.',
        },
      },
      {
        id: 'an_hamil',
        kategori: 'rps',
        tanya: 'Ini kehamilan yang keberapa dan usia kandungannya berapa bulan?',
        jawab: 'Kehamilan ketiga, usianya sekitar enam bulan (26 minggu).',
        esensial: true,
        oldcarts: ['penyerta'],
        variasi: {
          polos: 'Meteng sing kaping telu dok, umure kira-kira nem sasi.',
          terpelajar: 'Ini kehamilan ketiga saya, usianya sekitar 26 minggu, Dok.',
          cemas: 'Ini anak ketiga, baru enam bulan, Dok — saya khawatir memengaruhi bayinya.',
        },
      },
      {
        id: 'an_penyerta',
        kategori: 'rps',
        tanya: 'Apakah jantung sering berdebar atau sesak saat aktivitas ringan?',
        jawab: 'Iya, jantung sering berdebar dan cepat ngos-ngosan naik tangga.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'an_pica',
        kategori: 'rps',
        tanya: 'Apakah ada keinginan aneh mengunyah es batu atau benda tertentu?',
        jawab: 'Iya, saya jadi suka sekali mengunyah es batu, Dok.',
      },
      {
        id: 'an_fe',
        kategori: 'rpd',
        tanya: 'Apakah rutin minum tablet tambah darah dari bidan?',
        jawab: 'Dikasih, tapi sering lupa dan kadang mual jadi tidak saya minum.',
        esensial: true,
        variasi: {
          polos: 'Dikeki bidan dok, tapi kerep lali, kadhang mumek dadi ora tak ombe.',
          terpelajar: 'Saya diberi tablet tambah darah, tapi jarang saya minum karena mual.',
          cemas: 'Dikasih sih, Dok, tapi bikin mual jadi sering tidak saya minum — apa bahaya?',
        },
      },
      {
        id: 'an_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada riwayat anemia berat atau kelainan darah bawaan?',
        jawab: 'Tidak ada yang sampai transfusi rutin, Dok.',
      },
      {
        id: 'an_makan',
        kategori: 'sosial',
        tanya: 'Bagaimana pola makan, apakah cukup daging dan sayur hijau?',
        jawab: 'Jarang makan daging, lebih sering nasi dan sayur seadanya, suka minum teh setelah makan.',
      },
      {
        id: 'an_cacing',
        kategori: 'sosial',
        tanya: 'Ada riwayat cacingan atau kebiasaan tidak pakai alas kaki?',
        jawab: 'Dulu pernah cacingan, di rumah sering tidak pakai sandal.',
      },
      {
        id: 'dist_an_batuk',
        kategori: 'rps',
        tanya: 'Apakah ada batuk lama lebih dari dua minggu atau keringat malam?',
        jawab: 'Tidak ada batuk lama maupun keringat malam, Dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Konjungtiva palpebra pucat (+/+), tampak lemas, sklera tidak ikterik.', relevan: true },
      { region: 'ekstremitas', temuan: 'Telapak tangan pucat, kuku sendok (koilonikia) ringan, tidak ada edema tungkai.', relevan: true },
      { region: 'abdomen', temuan: 'Tinggi fundus uteri sesuai usia kehamilan ~26 minggu, denyut jantung janin 140x/menit reguler.', relevan: true },
      { region: 'jantung', temuan: 'S1-S2 reguler, terdengar bising sistolik halus derajat rendah (murmur fungsional anemia).', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler, ronki (-), wheezing (-).', relevan: false },
    ],
    lab: [
      { id: 'hb', hasil: 'Hemoglobin 8,5 g/dL (rendah; anemia sedang pada kehamilan).', flag: 'rendah', relevan: true },
      { id: 'darah_rutin', hasil: 'Gambaran mikrositik hipokrom, MCV & MCH menurun — khas defisiensi besi.', flag: 'abnormal', relevan: true },
      { id: 'feses_rutin', hasil: 'Ditemukan telur cacing tambang (hookworm) — sumber kehilangan besi kronik.', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['D50.9', 'O99.0', 'D56.9', 'D53.9'],
    tatalaksana: {
      obatBenar: ['tablet_fe', 'asam_folat'],
      obatSalahUmum: [
        { id: 'vitamin_b_kompleks', alasan: 'Bukan terapi utama anemia defisiensi besi; yang kurang adalah zat besi, bukan vitamin B kompleks.' },
      ],
      edukasi: ['gizi_seimbang', 'kepatuhan_obat', 'kontrol_rutin'],
    },
    clue: 'WHO & Permenkes No. 88/2014: anemia bumil bila Hb <11 g/dL. Anemia defisiensi besi (mikrositik hipokrom) → tablet tambah darah 60 mg besi elemental + 400 µg asam folat/hari, diminum bersama sumber vitamin C, hindari bersamaan teh/kopi. Cari sumber kehilangan (cacing tambang) dan evaluasi Hb ulang setelah 1 bulan.',
    konsekuensi: {
      narasi: 'Tablet tambah darah tidak diminum karena mual dan lupa; anemia dibiarkan memberat di trimester lanjut.',
      kembaliHariMin: 5,
      kembaliHariMax: 9,
      kondisiKembali: 'Kembali makin lemas dan pucat, hampir pingsan saat menimba air; Hb turun ke 7,8 g/dL dengan takikardia — risiko BBLR dan persalinan prematur meningkat.',
      guideline: 'Permenkes No. 88/2014 tentang Standar Tablet Tambah Darah bagi WUS & Ibu Hamil.',
    },
  },

  /* ======================================================================
   * 7. PNEUMONIA BALITA — J18.9 · 3B · respirasi · HARUS DIRUJUK
   *    Pneumonia BERAT (chest indrawing) per IMCI → dosis pertama + rujuk.
   * ==================================================================== */
  {
    id: 'pneumonia_balita',
    nama: 'Pneumonia Balita (Berat)',
    icd10: 'J18.9',
    skdi: '3B',
    kategori: 'respirasi',
    fktp144: false,
    harusDirujuk: true,
    spesialisRujukan: 'anak',
    prevalensi: 'rendah',
    keluhanUtama: 'Anak saya sesak, napasnya cepat dan tarikan dadanya ke dalam, panas tinggi tiga hari, Dok.',
    demografi: { usiaMin: 1, usiaMax: 4 },
    vital: { nadi: 130, rr: 55, suhu: 38.8, spo2: 93 },
    anamnesis: [
      {
        id: 'pn_ku',
        kategori: 'keluhan_utama',
        tanya: 'Sejak kapan sesaknya dan bagaimana napas anaknya sekarang?',
        jawab: 'Sudah tiga hari batuk, dua hari ini napasnya cepat dan dadanya tampak tertarik ke dalam.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
        variasi: {
          polos: 'Wis telung dino watuk dok, saiki ambekane cepet, dodone mlebu-mlebu.',
          terpelajar: 'Sejak tiga hari batuk, sekarang napasnya cepat dan dadanya sampai tertarik ke dalam, Dok.',
          cemas: 'Napasnya ngos-ngosan cepat sekali, Dok, saya takut anak saya kenapa-kenapa!',
        },
      },
      {
        id: 'pn_demam',
        kategori: 'rps',
        tanya: 'Apakah demam, dan seberapa tinggi?',
        jawab: 'Panas tinggi tiga hari, sampai 39 derajat dan menggigil.',
        esensial: true,
        oldcarts: ['penyerta'],
        variasi: {
          polos: 'Panase dhuwur telung dino dok, nganti 39, karo ndredheg.',
          terpelajar: 'Demam tinggi tiga hari, sampai 39 derajat disertai menggigil.',
          cemas: 'Panasnya tinggi terus tiga hari, Dok, sudah 39 lebih — saya panik.',
        },
      },
      {
        id: 'pn_batuk',
        kategori: 'rps',
        tanya: 'Batuknya berdahak atau kering, ada suara ngik?',
        jawab: 'Batuk berdahak, kadang terdengar grok-grok, tidak berbunyi ngik.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'pn_makan',
        kategori: 'rps',
        tanya: 'Anak masih mau menyusu atau minum? Apakah pernah kejang atau membiru?',
        jawab: 'Sudah malas menyusu dan minum sedikit, belum kejang tapi bibirnya sempat agak kebiruan.',
        esensial: true,
        oldcarts: ['penyerta'],
        variasi: {
          polos: 'Wis emoh nyusu dok, ngombe sithik, lambene mau sempet biru.',
          terpelajar: 'Ia jadi malas makan, menolak menyusu, dan bibirnya sempat agak kebiruan.',
          cemas: 'Dia nggak mau minum, Dok, bibirnya tadi sempat kebiruan — saya takut sekali!',
        },
      },
      {
        id: 'pn_riwayat',
        kategori: 'rpd',
        tanya: 'Sebelumnya sering batuk-pilek? Imunisasinya bagaimana?',
        jawab: 'Sering pilek, imunisasi tidak lengkap karena ibunya ragu.',
      },
      {
        id: 'pn_kontak',
        kategori: 'rpk',
        tanya: 'Di rumah ada yang batuk lama atau sedang sakit paru?',
        jawab: 'Kakeknya batuk-batuk lama, tapi belum pernah diperiksa.',
      },
      {
        id: 'pn_asap',
        kategori: 'sosial',
        tanya: 'Di rumah masak pakai apa, ada yang merokok?',
        jawab: 'Masak pakai kayu bakar di dapur, ayahnya merokok di dalam rumah.',
      },
      {
        id: 'pn_gizi',
        kategori: 'sosial',
        tanya: 'Bagaimana berat badan dan asupan makan anak selama ini?',
        jawab: 'Beratnya agak kurang, makannya susah sejak bayi.',
      },
      {
        id: "pn_alergi",
        kategori: 'rpd',
        tanya: "Anak ada riwayat alergi obat atau antibiotik sebelumnya?",
        jawab: "Tidak pernah, Dok, obat dari bidan biasanya cocok semua.",
        esensial: true,
      },
      {
        id: 'dist_pn_gatal',
        kategori: 'rps',
        tanya: 'Apakah ada bintik gatal atau ruam di kulit anak?',
        jawab: 'Tidak ada ruam atau gatal, Dok, hanya sesak dan panasnya.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'toraks_paru', temuan: 'Takipnea (RR 55x/menit, cepat untuk usia), retraksi subkostal dan interkostal (+), ronki basah halus di basal paru kanan.', relevan: true },
      { region: 'umum', temuan: 'Anak tampak sesak dan lemah, napas cuping hidung (+), rewel, mau minum sedikit — tanda bahaya umum.', relevan: true },
      { region: 'kepala_leher', temuan: 'Bibir sempat sianosis ringan, tidak ada stridor, tidak ada kaku kuduk.', relevan: false },
      { region: 'jantung', temuan: 'Takikardia, S1-S2 reguler tanpa murmur.', relevan: false },
      { region: 'abdomen', temuan: 'Supel, bising usus normal, hepar tidak membesar patologis.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Leukositosis dengan dominasi neutrofil — mendukung infeksi bakteri, namun tidak menunda rujukan.', flag: 'tinggi', relevan: true },
      { id: 'malaria_rdt', hasil: 'Negatif; sumber demam sudah jelas dari paru.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['J18.9', 'J21.9', 'J20.9', 'J45.9'],
    tatalaksana: {
      obatBenar: ['amoxicillin_sirup', 'paracetamol_sirup'],
      obatSalahUmum: [
        { id: 'salbutamol_inhaler', alasan: 'Bukan bronkospasme; pneumonia berat butuh antibiotik dan rujukan, bukan bronkodilator.' },
        { id: 'cotrimoxazole_480', alasan: 'Bukan pilihan pra-rujukan utama; amoksisilin dosis pertama lebih tepat sebelum merujuk.' },
      ],
      edukasi: ['tanda_bahaya', 'etika_batuk', 'kepatuhan_obat'],
    },
    clue: 'IMCI/WHO: pneumonia balita ditegakkan klinis dari napas cepat (RR ≥40x/menit usia 1–5 th). Tarikan dinding dada ke dalam (chest indrawing), sianosis, atau tolak minum = pneumonia BERAT → beri DOSIS PERTAMA antibiotik + oksigen, lalu RUJUK segera (SKDI 3B). Jangan tunda menunggu foto toraks.',
  },

  /* ======================================================================
   * 8. STROKE ISKEMIK — I63.9 · 3B · saraf · HARUS DIRUJUK
   *    Kasus karma Bu Wulan: dibawa keluarga subuh, bicara pelo, lengan lemah.
   *    "Time is Brain" — stabilisasi & rujuk cepat; jangan turunkan TD agresif.
   * ==================================================================== */
  {
    id: 'stroke_iskemik',
    nama: 'Stroke Iskemik Akut',
    icd10: 'I63.9',
    skdi: '3B',
    kategori: 'saraf',
    fktp144: false,
    harusDirujuk: true,
    spesialisRujukan: 'saraf',
    prevalensi: 'rendah',
    keluhanUtama: 'Ibu saya tiba-tiba bicaranya pelo dan lengan kanannya lemas sejak subuh tadi, Dok — kami langsung membawanya ke sini.',
    demografi: { usiaMin: 55, usiaMax: 68, jenisKelamin: 'P' },
    vital: { td: '190/100', nadi: 88, rr: 20, suhu: 36.7, gds: 138 },
    anamnesis: [
      {
        id: 'st_ku',
        kategori: 'keluhan_utama',
        tanya: 'Ceritakan apa yang tiba-tiba terjadi pada ibu tadi subuh.',
        jawab: 'Waktu bangun tidur, mulutnya perot, bicaranya pelo, dan lengan kanannya tidak bisa diangkat.',
        esensial: true,
        oldcarts: ['onset', 'karakter'],
        variasi: {
          polos: 'Bar tangi turu, lambene menceng, ngomonge pelo, tangane tengen ora iso digerakke.',
          terpelajar: 'Muncul mendadak saat bangun tidur: wajah kanan mencong, bicara pelo, dan sisi kanan badan lemah, Dok.',
          cemas: 'Ibu saya mendadak lemas separuh badan dan bicaranya kacau, Dok, tolong cepat!',
        },
      },
      {
        id: 'st_onset',
        kategori: 'rps',
        tanya: 'Persisnya jam berapa gejala mulai, atau kapan terakhir ibu tampak normal?',
        jawab: 'Terakhir normal semalam sebelum tidur, subuh sekitar jam empat sudah begini saat dibangunkan.',
        esensial: true,
        oldcarts: ['onset', 'waktu'],
        variasi: {
          polos: 'Wingi bengi sadurunge turu isih apik, subuh jam papat wis kaya ngene.',
          terpelajar: 'Terakhir masih normal semalam sebelum tidur; ketahuan begini waktu subuh sekitar pukul empat.',
          cemas: 'Semalam masih sehat, Dok, subuh tadi sudah begini — apa masih bisa ditolong?',
        },
      },
      {
        id: 'st_gejala',
        kategori: 'rps',
        tanya: 'Selain lengan lemah dan bicara pelo, ada wajah perot, kesulitan menelan, atau pandangan ganda?',
        jawab: 'Wajah kanan perot, agak tersedak saat minum, satu sisi tubuh kanan lemah semua.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'st_nyerikepala',
        kategori: 'rps',
        tanya: 'Apakah tadi ada nyeri kepala sangat hebat, muntah menyemprot, atau penurunan kesadaran?',
        jawab: 'Tidak ada nyeri kepala hebat maupun muntah, ibu masih sadar tapi bingung.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'st_ht',
        kategori: 'rpd',
        tanya: 'Apakah ibu punya darah tinggi, dan apakah rutin berobat?',
        jawab: 'Ibu darah tinggi lama, tapi menolak minum obat karena takut ginjalnya rusak.',
        esensial: true,
        variasi: {
          polos: 'Ibu darah dhuwur wis suwe, tapi ora gelem ngombe obat, wedi ginjele rusak.',
          terpelajar: 'Ibu punya darah tinggi sudah lama tapi menolak berobat karena khawatir merusak ginjal.',
          cemas: 'Ibu darah tingginya lama, Dok, tapi selalu menolak obat — apa ini akibatnya?',
        },
      },
      {
        id: 'st_komorbid',
        kategori: 'rpd',
        tanya: 'Apakah ada riwayat kencing manis, sakit jantung, atau jantung berdebar tidak teratur?',
        jawab: 'Kencing manis tidak ada, tapi dulu pernah dikatakan denyut jantungnya tidak teratur.',
      },
      {
        id: 'st_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada riwayat stroke atau serangan jantung?',
        jawab: 'Kakak ibu meninggal karena stroke juga, Dok.',
      },
      {
        id: 'st_rokok',
        kategori: 'sosial',
        tanya: 'Di rumah bagaimana kebiasaan merokok dan pola makan ibu?',
        jawab: 'Suami ibu perokok berat, masakannya memang asin dan bersantan.',
      },
      {
        id: 'dist_st_bak',
        kategori: 'rps',
        tanya: 'Belakangan apakah ibu jadi sering buang air kecil di malam hari?',
        jawab: 'Tidak, Dok, buang air kecilnya seperti biasa, yang mendadak ya kelemahan tadi.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'neurologis', temuan: 'Hemiparesis kanan (kekuatan lengan 2/5, tungkai 3/5), parese N. VII kanan tipe sentral, disartria; refleks Babinski (+) kanan.', relevan: true },
      { region: 'umum', temuan: 'Composmentis namun bicara pelo dan tampak bingung, GCS 15 dengan afasia ringan, tidak tampak trauma kepala.', relevan: true },
      { region: 'jantung', temuan: 'Denyut nadi ireguler (kemungkinan fibrilasi atrium), S1-S2 tanpa murmur jelas — potensi sumber emboli.', relevan: true },
      { region: 'kepala_leher', temuan: 'Pupil isokor reaktif, tidak ada kaku kuduk, tidak ada bruit karotis yang menonjol.', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler, ronki (-); tidak ada tanda aspirasi masif saat diperiksa.', relevan: false },
    ],
    lab: [
      { id: 'gds', hasil: 'Gula darah sewaktu 138 mg/dL — menyingkirkan hipoglikemia sebagai peniru stroke (stroke mimic).', flag: 'normal', relevan: true },
      { id: 'darah_rutin', hasil: 'Dalam batas normal; tidak ada tanda infeksi berat.', flag: 'normal', relevan: true },
      { id: 'kolesterol', hasil: 'LDL tinggi bila diperiksa — faktor risiko, tetapi bukan penentu tindakan akut.', flag: 'tinggi', relevan: false },
    ],
    diagnosisBanding: ['I63.9', 'I61.9', 'G45.9', 'E16.2'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [
        { id: 'captopril_25', alasan: 'Jangan turunkan tekanan darah cepat pada stroke iskemik akut (permisif hingga ~220/120) — menurunkan perfusi penumbra dan memperluas infark.' },
        { id: 'amlodipine_5', alasan: 'Penurunan TD agresif fase akut membahayakan; prioritas adalah stabilisasi ABC dan rujukan cepat, bukan obat oral.' },
      ],
      edukasi: ['tanda_bahaya', 'kontrol_rutin', 'kepatuhan_obat'],
    },
    clue: 'Stroke = kegawatan "Time is Brain". Kenali FAST (Face-Arm-Speech-Time) dan SELALU cek gula darah (hipoglikemia adalah peniru stroke). Di FKTP: stabilkan jalan napas/pernapasan/sirkulasi, JANGAN turunkan TD agresif (<220/120 mmHg), RUJUK segera ke RS dengan CT-scan dalam window terapi (SKDI 3B, PERDOSSI). Hipertensi tak terkontrol adalah faktor risiko utama.',
    konsekuensi: {
      narasi: 'Buah dari hipertensi yang menolak diobati: penundaan rujukan memperkecil peluang pemulihan; setiap menit adalah jaringan otak yang hilang.',
      kembaliHariMin: 7,
      kembaliHariMax: 14,
      kondisiKembali: 'Kembali dengan hemiparesis kanan menetap dan bicara yang belum pulih — kecacatan yang bisa dikurangi bila dirujuk lebih cepat.',
      guideline: 'PERDOSSI: Panduan Praktik Klinis Neurologi — Stroke Iskemik Akut; window terapi reperfusi.',
    },
  },
]
