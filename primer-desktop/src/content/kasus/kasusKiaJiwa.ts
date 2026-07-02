/**
 * KASUS KIA & JIWA — Batch M3 (10 kasus).
 *
 * Ditulis terhadap kontrak `KasusKlinis` (src/content/types.ts). Semua id obat/lab/
 * edukasi/tindakan memakai palet kanonik M3_CONTENT_SPEC. Akurasi klinis mengikuti
 * guideline nasional (Kemenkes/PNPK/PPK/WHO) — lihat setiap `clue` & `obatSalahUmum`.
 *
 * Kasus wajib-rujuk: preeklampsia_berat & abortus_iminens → obgyn; skizofrenia → jiwa.
 * Prinsip kelas jiwa: bahasa hangat, tidak menstigma, hormati martabat pasien.
 *
 * Catatan kontrak: field `distraktor` pada `PertanyaanAnamnesis` tersedia; pertanyaan
 * pengecoh ditandai `distraktor: true` + non-esensial + tidak menyentuh dimensi
 * diagnostik.
 */

import type { KasusKlinis } from '../types'

export const KASUS_KIA_JIWA: KasusKlinis[] = [
  /* ======================================================================
   * 1. ANC Kehamilan Normal (Kunjungan Antenatal Trimester 2)
   * Poin ajar: Fe + asam folat + edukasi ANC; JANGAN medikalisasi kehamilan sehat.
   * ==================================================================== */
  {
    id: 'kia_anc_kehamilan_normal',
    nama: 'ANC — Kehamilan Normal (Trimester 2)',
    icd10: 'Z34.0',
    skdi: '4A',
    kategori: 'kia',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Saya mau periksa kehamilan dok, ini kandungan pertama saya.',
    demografi: { usiaMin: 20, usiaMax: 34, jenisKelamin: 'P' },
    vital: { td: '110/70', nadi: 84, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Selamat pagi Bu, ada yang dikeluhkan atau kontrol rutin saja?',
        jawab: 'Kontrol rutin dok, kandungan saya sekarang jalan lima bulan, alhamdulillah sehat.',
        variasi: {
          polos: 'Namung kontrol dok, wetengé wis limang sasi, ngrasa apik-apik waé.',
          terpelajar: 'Kontrol antenatal rutin dok, usia gestasi sekitar 20 minggu, sejauh ini tanpa keluhan.',
          cemas: 'Mau periksa dok, ini hamil pertama saya jadi khawatir apa semua baik-baik saja.',
        },
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_hpht',
        kategori: 'keluhan_utama',
        tanya: 'Hari pertama haid terakhirnya kapan Bu, dan ini kehamilan ke berapa?',
        jawab: 'HPHT-nya sekitar 20 minggu lalu dok, ini hamil pertama, belum pernah keguguran.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_gerak',
        kategori: 'rps',
        tanya: 'Sudah terasa gerakan janinnya? Ada keluar darah atau air dari jalan lahir?',
        jawab: 'Sudah mulai terasa gerakannya dok, senang sekali. Tidak ada keluar darah atau air.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_bahaya',
        kategori: 'rps',
        tanya: 'Ada nyeri kepala hebat, pandangan kabur, bengkak kaki, atau nyeri perut hebat?',
        jawab: 'Tidak ada dok, cuma kadang pegal punggung biasa saja.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_mual',
        kategori: 'rps',
        tanya: 'Masih ada mual muntah? Makan minumnya bagaimana?',
        jawab: 'Mualnya sudah hilang dok sejak masuk bulan keempat, makan sudah enak lagi.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Ada riwayat darah tinggi, kencing manis, atau penyakit lain sebelum hamil?',
        jawab: 'Tidak ada dok, sebelumnya sehat-sehat saja.',
      },
      {
        id: 'q_fe',
        kategori: 'sosial',
        tanya: 'Tablet tambah darahnya rutin diminum? Ada mual atau lupa?',
        jawab: 'Kadang lupa dok, katanya bikin mual jadi suka saya tunda.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_dukungan',
        kategori: 'sosial',
        tanya: 'Suami dan keluarga mendukung? Rencana bersalinnya di mana?',
        jawab: 'Suami mendukung dok, rencananya mau bersalin di bidan dekat rumah.',
      },
      {
        id: 'q_pekerjaan',
        kategori: 'sosial',
        tanya: 'Dulu golongan darahnya apa Bu?',
        jawab: 'B dok. Kenapa ya?',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Compos mentis, tampak sehat, tidak anemis, tidak edema tungkai.', relevan: true },
      { region: 'abdomen', temuan: 'TFU setinggi 2 jari di bawah pusat (sesuai ~20 minggu). DJJ 148x/menit reguler. Tidak ada nyeri tekan.', relevan: true },
      { region: 'ekstremitas', temuan: 'Tidak ada edema pretibial. Refleks fisiologis normal.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-).', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
    ],
    lab: [
      { id: 'hb', hasil: 'Hemoglobin 11,4 g/dL — normal untuk trimester 2 (batas ≥11).', flag: 'normal', relevan: true },
      { id: 'tes_kehamilan', hasil: 'Positif (konfirmasi kehamilan; sudah diketahui).', flag: 'abnormal', relevan: true },
      { id: 'proteinuria', hasil: 'Protein urin negatif — tidak ada tanda preeklampsia.', flag: 'normal', relevan: true },
      { id: 'golongan_darah', hasil: 'B, Rhesus positif.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['Z34.0', 'Z33', 'O26.9'],
    tatalaksana: {
      obatBenar: ['tablet_fe', 'asam_folat'],
      obatSalahUmum: [
        { id: 'paracetamol_500', alasan: 'Kehamilan normal bukan kondisi sakit — tidak perlu analgetik rutin. Fokus pada suplementasi & edukasi, bukan medikalisasi.' },
        { id: 'domperidon_10', alasan: 'Mual sudah reda; antiemetik tidak diindikasikan dan bukan bagian paket ANC standar.' },
      ],
      edukasi: ['anc_rutin', 'tanda_bahaya_kehamilan', 'gizi_seimbang', 'kepatuhan_obat'],
    },
    clue: 'ANC normal: minimal 6x kunjungan (Kemenkes 2020) + tablet tambah darah (Fe 60 mg elemental) minimal 90 tablet + asam folat 400 mcg. Edukasi minum Fe malam hari/setelah makan untuk kurangi mual, jangan bersama teh/kopi. Kenali tanda bahaya P4K, JANGAN medikalisasi kehamilan sehat.',
  },

  /* ======================================================================
   * 2. ISK pada Kehamilan (Sistitis / Bakteriuria Bergejala)
   * Poin ajar: hindari antibiotik teratogenik; cefixime aman. Skrining wajib.
   * ==================================================================== */
  {
    id: 'kia_isk_kehamilan',
    nama: 'Infeksi Saluran Kemih pada Kehamilan',
    icd10: 'O23.4',
    skdi: '4A',
    kategori: 'kia',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Sering kebelet pipis dan perih dok, padahal saya lagi hamil enam bulan.',
    demografi: { usiaMin: 20, usiaMax: 35, jenisKelamin: 'P' },
    vital: { td: '110/75', nadi: 90, rr: 18, suhu: 37.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhannya bagaimana Bu?',
        jawab: 'Anyang-anyangan dok, kebelet terus tapi keluarnya sedikit dan perih.',
        variasi: {
          polos: 'Anyang-anyangen dok, arep pipis terus tapi metuné mung sithik lan perih.',
          terpelajar: 'Disuria dan frekuensi meningkat dok, terasa perih di akhir berkemih.',
          cemas: 'Sakit tiap pipis dok, saya takut ini membahayakan kandungan saya.',
        },
        esensial: true,
        oldcarts: ['karakter', 'lokasi'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa hari begini?',
        jawab: 'Tiga hari ini dok, makin sering ke kamar mandi.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_pinggang',
        kategori: 'rps',
        tanya: 'Ada nyeri pinggang atau demam menggigil?',
        jawab: 'Pinggang agak pegal dok, badan sempat anget tapi tidak sampai menggigil.',
        esensial: true,
        oldcarts: ['penyerta', 'radiasi'],
      },
      {
        id: 'q_urin',
        kategori: 'rps',
        tanya: 'Air kencingnya keruh atau ada darah?',
        jawab: 'Agak keruh dok dan baunya lebih menyengat, kadang seperti ada bercak.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_kontraksi',
        kategori: 'rps',
        tanya: 'Ada mulas seperti kontraksi, keluar darah atau air dari jalan lahir?',
        jawab: 'Tidak ada dok, gerakan janin masih aktif, tidak keluar apa-apa.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Ada riwayat alergi obat, terutama antibiotik?',
        jawab: 'Tidak ada dok, selama ini aman minum obat.',
      },
      {
        id: 'q_riwayat_isk',
        kategori: 'rpd',
        tanya: 'Sebelumnya pernah kena infeksi saluran kemih?',
        jawab: 'Pernah sekali dok sebelum hamil, sembuh setelah minum antibiotik.',
      },
      {
        id: 'q_minum',
        kategori: 'sosial',
        tanya: 'Sehari minum air kira-kira berapa? Suka menahan pipis?',
        jawab: 'Jarang minum dok karena bolak-balik pipis, jadi sering saya tahan.',
        oldcarts: ['penyerta'],
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sakit ringan, subfebris, tidak tampak toksik.', relevan: true },
      { region: 'abdomen', temuan: 'Nyeri tekan suprapubik (+). TFU sesuai usia kehamilan, DJJ 144x/menit reguler. Nyeri ketok CVA (-).', relevan: true },
      { region: 'ekstremitas', temuan: 'Tidak ada edema, refleks normal.', relevan: false },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-).', relevan: false },
    ],
    lab: [
      { id: 'urinalisis', hasil: 'Leukosit esterase (+), nitrit (+), leukosit 20–30/lpb, bakteri (+). Protein trace.', flag: 'abnormal', relevan: true },
      { id: 'tes_kehamilan', hasil: 'Positif (kehamilan diketahui).', flag: 'abnormal', relevan: false },
      { id: 'darah_rutin', hasil: 'Leukosit 11.800/µL — leukositosis ringan.', flag: 'tinggi', relevan: false },
    ],
    diagnosisBanding: ['O23.4', 'N30.0', 'N10'],
    tatalaksana: {
      obatBenar: ['cefixime_100', 'paracetamol_500'],
      obatSalahUmum: [
        { id: 'ciprofloxacin_500', alasan: 'Fluorokuinolon KONTRAINDIKASI pada kehamilan — risiko gangguan tulang rawan janin. Pilih beta-laktam yang aman (sefiksim).' },
        { id: 'doksisiklin_100', alasan: 'Tetrasiklin KONTRAINDIKASI pada kehamilan — menyebabkan diskolorasi gigi & gangguan tulang janin.' },
        { id: 'cotrimoxazole_480', alasan: 'Sulfa dihindari terutama trimester 1 & akhir (risiko kernikterus/defek tabung saraf); bukan pilihan aman rutin pada bumil.' },
      ],
      edukasi: ['minum_air_cukup', 'tanda_bahaya_kehamilan', 'kepatuhan_obat', 'cuci_tangan'],
    },
    clue: 'ISK pada kehamilan WAJIB diobati (bahkan bakteriuria asimtomatik) karena berisiko pielonefritis & persalinan prematur (PPK/WHO). Antibiotik aman: beta-laktam (sefiksim/amoksisilin). HINDARI fluorokuinolon, tetrasiklin, dan sulfa. Tuntaskan 7 hari + hidrasi cukup.',
    konsekuensi: {
      narasi: 'Bila ISK tidak diobati tuntas, dapat naik menjadi pielonefritis akut dan mencetuskan kontraksi prematur; pemberian antibiotik teratogenik membahayakan janin.',
      kembaliHariMin: 3,
      kembaliHariMax: 7,
      kondisiKembali: 'Pasien kembali dengan demam tinggi menggigil, nyeri pinggang hebat, dan mulas — curiga pielonefritis dengan ancaman persalinan prematur.',
      guideline: 'PPK Dokter di FKTP / WHO ANC — ISK kehamilan diobati dengan antibiotik yang aman untuk janin.',
    },
  },

  /* ======================================================================
   * 3. Preeklampsia Berat (WAJIB RUJUK obgyn)
   * Poin ajar: MgSO4 + antihipertensi + RUJUK. JANGAN pulangkan.
   * ==================================================================== */
  {
    id: 'kia_preeklampsia_berat',
    nama: 'Preeklampsia Berat',
    icd10: 'O14.1',
    skdi: '3B',
    kategori: 'kia',
    fktp144: true,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'obgyn',
    keluhanUtama: 'Kepala saya sakit berat sekali dok, pandangan kabur, ini hamil delapan bulan.',
    demografi: { usiaMin: 19, usiaMax: 38, jenisKelamin: 'P' },
    vital: { td: '170/110', nadi: 96, rr: 20, suhu: 36.8, spo2: 98 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Ibu, ceritakan yang dirasakan sekarang.',
        jawab: 'Kepala saya nyeri hebat dok, pandangan berkunang-kunang, dan ulu hati terasa nyeri.',
        variasi: {
          polos: 'Sirahé loro banget dok, pandangan kunang-kunang, ulu ati nyeri.',
          cemas: 'Dok tolong, kepala saya sakit sekali, mata kabur, saya takut terjadi apa-apa sama bayi saya.',
        },
        esensial: true,
        oldcarts: ['karakter', 'keparahan', 'penyerta'],
      },
      {
        id: 'q_usia_hamil',
        kategori: 'keluhan_utama',
        tanya: 'Usia kehamilannya berapa Bu?',
        jawab: 'Kira-kira delapan bulan dok, 34 minggu.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_bengkak',
        kategori: 'rps',
        tanya: 'Ada bengkak di kaki, tangan, atau wajah? Muncul cepat?',
        jawab: 'Iya dok, kaki dan tangan bengkak, muka juga sembab sejak beberapa hari ini.',
        esensial: true,
        oldcarts: ['onset', 'penyerta'],
      },
      {
        id: 'q_nyeri_ulu',
        kategori: 'rps',
        tanya: 'Nyeri ulu hati atau perut kanan atasnya seperti apa? Ada mual muntah?',
        jawab: 'Nyeri di ulu hati dok seperti ditekan, mual, tadi sempat muntah.',
        esensial: true,
        oldcarts: ['lokasi', 'karakter', 'penyerta'],
      },
      {
        id: 'q_kejang',
        kategori: 'rps',
        tanya: 'Apakah tadi sempat kejang atau kehilangan kesadaran?',
        jawab: 'Belum kejang dok, tapi rasanya mau pingsan.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_gerak_janin',
        kategori: 'rps',
        tanya: 'Gerakan janin masih terasa aktif seperti biasa?',
        jawab: 'Masih terasa dok, tapi tadi agak berkurang.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_anc',
        kategori: 'rpd',
        tanya: 'Selama hamil pernah diberi tahu tekanan darahnya tinggi?',
        jawab: 'Kontrol terakhir dua minggu lalu tensi mulai naik dok, tapi belum diobati.',
        esensial: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sakit sedang-berat, gelisah, wajah sembab.', relevan: true },
      { region: 'jantung', temuan: 'Tekanan darah 170/110 mmHg (diukur ulang tetap tinggi). S1/S2 reguler.', relevan: true },
      { region: 'ekstremitas', temuan: 'Edema pitting derajat +2 pada kedua tungkai dan wajah. Refleks patela meningkat (hiperrefleksia), klonus (+).', relevan: true },
      { region: 'abdomen', temuan: 'TFU sesuai 34 minggu, DJJ 150x/menit, nyeri tekan epigastrium (+).', relevan: true },
      { region: 'neurologis', temuan: 'Sadar penuh, namun hiperrefleksia — tanda iritabilitas SSP (ancaman eklampsia).', relevan: true },
    ],
    lab: [
      { id: 'proteinuria', hasil: 'Protein urin +3 (dipstik) — proteinuria bermakna.', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Trombosit 118.000/µL (menurun), Hb 13,8 (hemokonsentrasi).', flag: 'abnormal', relevan: true },
      { id: 'sgot_sgpt', hasil: 'SGOT 92 / SGPT 88 U/L — meningkat (curiga keterlibatan hepar/HELLP).', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['O14.1', 'O13', 'O15.0'],
    tatalaksana: {
      obatBenar: ['mgso4_inj', 'nifedipin_10'],
      obatSalahUmum: [
        { id: 'captopril_25', alasan: 'ACE-inhibitor KONTRAINDIKASI MUTLAK pada kehamilan (fetotoksik, gangguan ginjal janin). Antihipertensi bumil: nifedipin/metildopa/labetalol.' },
        { id: 'furosemid_40', alasan: 'Diuretik TIDAK rutin pada preeklampsia — memperberat kontraksi volume plasma yang sudah menurun. Kecuali edema paru.' },
        { id: 'diazepam_2', alasan: 'Antikonvulsan pilihan pada preeklampsia/eklampsia adalah MgSO4, BUKAN benzodiazepin (kalah efektif & menekan napas ibu/janin).' },
      ],
      edukasi: ['tanda_bahaya_kehamilan'],
    },
    clue: 'Preeklampsia BERAT: TD ≥160/110 + proteinuria + gejala berat (nyeri kepala hebat, gangguan visus, nyeri epigastrium, hiperrefleksia/klonus, trombositopenia, SGOT/SGPT naik). WAJIB stabilisasi MgSO4 (loading + maintenance) & kendalikan TD dengan nifedipin/metildopa lalu RUJUK ke SpOG. JANGAN dipulangkan — risiko eklampsia/HELLP mengancam nyawa ibu & janin (PNPK Preeklampsia Kemenkes/POGI).',
    konsekuensi: {
      narasi: 'Bila tidak diberi MgSO4 dan tidak dirujuk, pasien berisiko kejang eklampsia, perdarahan otak, sindrom HELLP, dan kematian ibu serta janin dalam hitungan jam.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Pasien dibawa kembali dalam kondisi kejang berulang (eklampsia) dengan penurunan kesadaran dan gawat janin — kegawatdaruratan obstetri.',
      guideline: 'PNPK Preeklampsia & Eklampsia (POGI/Kemenkes) — MgSO4 + antihipertensi + rujuk terminasi.',
    },
  },

  /* ======================================================================
   * 4. Abortus Iminens (WAJIB RUJUK obgyn untuk USG/observasi)
   * Poin ajar: perdarahan + ostium tertutup + janin hidup → tirah baring & rujuk.
   * ==================================================================== */
  {
    id: 'kia_abortus_iminens',
    nama: 'Abortus Iminens (Ancaman Keguguran)',
    icd10: 'O20.0',
    skdi: '3B',
    kategori: 'kia',
    fktp144: true,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'obgyn',
    keluhanUtama: 'Keluar flek darah dok dari jalan lahir, padahal saya lagi hamil muda.',
    demografi: { usiaMin: 20, usiaMax: 38, jenisKelamin: 'P' },
    vital: { td: '110/70', nadi: 92, rr: 18, suhu: 36.7, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Ibu, coba ceritakan perdarahannya seperti apa.',
        jawab: 'Keluar flek merah kecoklatan dok sejak tadi pagi, sedikit-sedikit, saya panik sekali.',
        variasi: {
          polos: 'Metu flek abang semu coklat dok wiwit isuk mau, mung sithik-sithik.',
          cemas: 'Dok, saya keluar darah, ini kehamilan yang saya tunggu bertahun-tahun, tolong bayi saya jangan sampai kenapa-kenapa.',
        },
        esensial: true,
        oldcarts: ['onset', 'karakter'],
      },
      {
        id: 'q_usia_hamil',
        kategori: 'keluhan_utama',
        tanya: 'Usia kehamilannya berapa minggu Bu?',
        jawab: 'Sekitar sepuluh minggu dok, hasil tes kehamilan positif bulan lalu.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_jumlah',
        kategori: 'rps',
        tanya: 'Darahnya seberapa banyak? Ada gumpalan atau jaringan yang keluar?',
        jawab: 'Masih flek dok, belum sampai membasahi pembalut penuh, tidak ada gumpalan atau daging.',
        esensial: true,
        oldcarts: ['keparahan', 'karakter'],
      },
      {
        id: 'q_nyeri',
        kategori: 'rps',
        tanya: 'Ada mulas atau nyeri perut bawah seperti kram?',
        jawab: 'Perut bawah agak mulas dok, tapi ringan, tidak sampai hebat.',
        esensial: true,
        oldcarts: ['lokasi', 'keparahan'],
      },
      {
        id: 'q_pencetus',
        kategori: 'rps',
        tanya: 'Sebelumnya ada aktivitas berat, terjatuh, atau hubungan suami-istri?',
        jawab: 'Kemarin saya sempat angkat ember cucian yang berat dok.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah keguguran atau ada masalah kandungan sebelumnya?',
        jawab: 'Ini kehamilan pertama dok setelah lama menikah, belum pernah keguguran.',
        esensial: true,
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Ada demam, keputihan berbau, atau keluar cairan berbau?',
        jawab: 'Tidak ada dok, tidak demam, tidak ada keputihan yang aneh.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Compos mentis, tampak cemas namun hemodinamik stabil, tidak pucat.', relevan: true },
      { region: 'abdomen', temuan: 'Supel, nyeri tekan suprapubik ringan, TFU belum teraba di atas simfisis (sesuai <12 minggu). Tanda akut abdomen (-).', relevan: true },
      { region: 'jantung', temuan: 'Nadi 92x/menit, TD stabil — belum ada tanda syok.', relevan: true },
      { region: 'kulit', temuan: 'Konjungtiva tidak anemis, akral hangat.', relevan: false },
    ],
    lab: [
      { id: 'tes_kehamilan', hasil: 'Positif — konfirmasi kehamilan berlangsung.', flag: 'abnormal', relevan: true },
      { id: 'hb', hasil: 'Hemoglobin 11,8 g/dL — belum ada anemia perdarahan.', flag: 'normal', relevan: true },
      { id: 'darah_rutin', hasil: 'Leukosit & trombosit normal; tidak ada tanda infeksi/perdarahan masif.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['O20.0', 'O03.9', 'O00.9'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [
        { id: 'natrium_diklofenak_50', alasan: 'NSAID dihindari pada kehamilan (terutama trimester 3 → penutupan duktus arteriosus dini) dan tidak menghentikan ancaman keguguran; nyeri ringan cukup istirahat.' },
        { id: 'ibuprofen_400', alasan: 'Sama seperti NSAID lain: tidak diindikasikan dan berisiko pada kehamilan. Tata laksana abortus iminens adalah tirah baring + evaluasi USG, bukan analgetik.' },
      ],
      edukasi: ['tanda_bahaya_kehamilan', 'istirahat_cukup'],
    },
    clue: 'Abortus IMINENS: perdarahan pervaginam pada kehamilan <20 minggu dengan ostium uteri TERTUTUP dan janin masih hidup. Tata laksana FKTP: tirah baring, hindari aktivitas berat & koitus, lalu RUJUK untuk USG konfirmasi viabilitas janin dan evaluasi lanjut oleh SpOG. Waspadai progresi ke abortus insipiens/inkomplit (perdarahan hebat, ostium terbuka) — kegawatan (PPK/PNPK Perdarahan Kehamilan Muda).',
    konsekuensi: {
      narasi: 'Bila tidak dievaluasi dan tetap beraktivitas berat, ancaman keguguran dapat berlanjut menjadi abortus inkomplit dengan perdarahan hebat yang mengancam nyawa ibu.',
      kembaliHariMin: 1,
      kembaliHariMax: 5,
      kondisiKembali: 'Pasien kembali dengan perdarahan banyak bergumpal, mulas hebat, dan keluar jaringan — abortus inkomplit yang butuh kuretase.',
      guideline: 'PPK Dokter FKTP — abortus iminens: tirah baring + rujuk USG; kenali tanda abortus inkomplit.',
    },
  },

  /* ======================================================================
   * 5. Konseling KB (Pemilihan Kontrasepsi Pascapersalinan)
   * Poin ajar: konseling berimbang; hindari estrogen pada ibu menyusui.
   * ==================================================================== */
  {
    id: 'kia_kb_konseling',
    nama: 'Konseling KB (Kontrasepsi Pascapersalinan)',
    icd10: 'Z30.0',
    skdi: '4A',
    kategori: 'kia',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Saya mau ikut KB dok, baru melahirkan tiga bulan lalu dan masih menyusui.',
    demografi: { usiaMin: 21, usiaMax: 38, jenisKelamin: 'P' },
    vital: { td: '115/75', nadi: 80, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Selamat pagi Bu, ingin berkonsultasi KB ya? Ada rencana atau pertimbangan tertentu?',
        jawab: 'Iya dok, saya mau atur jarak anak, tapi bingung pilih yang mana dan takut mengganggu ASI.',
        variasi: {
          polos: 'Nggih dok, kula badhe KB, ning bingung milih sing pundi, wedi ganggu ASI.',
          terpelajar: 'Saya ingin kontrasepsi jangka menengah dok, prioritas saya tidak mengganggu produksi ASI.',
          cemas: 'Saya takut hamil lagi terlalu cepat dok, tapi juga khawatir efek samping KB.',
        },
        esensial: true,
      },
      {
        id: 'q_menyusui',
        kategori: 'keluhan_utama',
        tanya: 'Sekarang masih menyusui penuh (ASI eksklusif)? Bayinya usia berapa?',
        jawab: 'Masih ASI penuh dok, bayi saya tiga bulan, belum dapat makanan lain.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_haid',
        kategori: 'rps',
        tanya: 'Sudah haid lagi setelah melahirkan?',
        jawab: 'Belum haid lagi dok sejak melahirkan.',
        esensial: true,
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Ada riwayat darah tinggi, migrain berat, penggumpalan darah, atau merokok?',
        jawab: 'Tidak ada dok, tekanan darah normal, tidak merokok.',
        esensial: true,
      },
      {
        id: 'q_rencana',
        kategori: 'sosial',
        tanya: 'Rencananya ingin menunda berapa lama, atau merasa sudah cukup anak?',
        jawab: 'Ingin menunda sekitar 3–4 tahun dulu dok, belum mau berhenti total.',
        esensial: true,
      },
      {
        id: 'q_pengalaman',
        kategori: 'rpd',
        tanya: 'Sebelumnya pernah pakai KB? Ada keluhan?',
        jawab: 'Dulu pernah pil KB dok tapi sering lupa minum, jadi kurang cocok.',
      },
      {
        id: 'q_suami',
        kategori: 'sosial',
        tanya: 'Suami mendukung dan sudah didiskusikan bersama?',
        jawab: 'Sudah dok, suami mendukung apa pun yang paling aman untuk saya.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Compos mentis, tampak sehat, IMT normal.', relevan: true },
      { region: 'jantung', temuan: 'TD 115/75 mmHg, S1/S2 reguler — tidak ada kontraindikasi kardiovaskular.', relevan: true },
      { region: 'abdomen', temuan: 'Supel, tidak ada massa; uterus sudah involusi normal.', relevan: true },
      { region: 'ekstremitas', temuan: 'Tidak ada tanda trombosis vena (edema/nyeri betis unilateral).', relevan: false },
    ],
    lab: [
      { id: 'tes_kehamilan', hasil: 'Negatif — memastikan tidak sedang hamil sebelum memulai kontrasepsi.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['Z30.0', 'Z30.4', 'Z39.1'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [],
      edukasi: ['asi_eksklusif', 'kontrol_rutin', 'gizi_seimbang'],
    },
    clue: 'Konseling KB pascapersalinan pada ibu MENYUSUI: pilihan aman = metode non-hormonal (IUD/AKDR, kondom) atau progestin-only (pil progestin, suntik DMPA 3 bulan, implan). HINDARI kontrasepsi kombinasi estrogen dalam 6 minggu pertama & selama menyusui dini (estrogen menurunkan produksi ASI + risiko trombosis). Konseling harus BERIMBANG (informed choice) — sesuaikan dengan rencana reproduksi & syarat medis (WHO MEC / Kemenkes BKKBN).',
  },

  /* ======================================================================
   * 6. Gangguan Cemas Menyeluruh (GAD)
   * Poin ajar: eksklusi organik (tiroid), konseling + SSRI; hindari benzo jangka panjang.
   * ==================================================================== */
  {
    id: 'jiwa_gangguan_cemas',
    nama: 'Gangguan Cemas Menyeluruh (GAD)',
    icd10: 'F41.1',
    skdi: '4A',
    kategori: 'jiwa',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Saya sering deg-degan dan khawatir berlebihan dok, rasanya tidak pernah tenang.',
    demografi: { usiaMin: 20, usiaMax: 50 },
    vital: { td: '124/82', nadi: 96, rr: 20, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Terima kasih sudah datang. Boleh ceritakan apa yang Bapak/Ibu rasakan?',
        jawab: 'Saya khawatir terus dok, macam-macam saya pikirkan sampai dada berdebar dan susah santai.',
        variasi: {
          polos: 'Kula niki mikir terus dok, dhadha ndredheg, ora tau tenang atiné.',
          terpelajar: 'Saya mengalami kecemasan yang sulit dikendalikan dok, disertai ketegangan otot dan sulit konsentrasi.',
          cemas: 'Rasanya seperti ada yang mau terjadi terus dok, jantung berdebar, saya takut ini penyakit jantung.',
        },
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berlangsung berapa lama? Hampir tiap hari?',
        jawab: 'Sudah lebih dari enam bulan dok, hampir tiap hari rasanya khawatir terus.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_fisik',
        kategori: 'rps',
        tanya: 'Kekhawatirannya disertai keluhan fisik? Misalnya jantung berdebar, otot tegang, keringat, atau mudah lelah?',
        jawab: 'Iya dok, jantung berdebar, otot leher tegang, gampang capek dan gemetar.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_tidur',
        kategori: 'rps',
        tanya: 'Bagaimana tidurnya dan konsentrasinya?',
        jawab: 'Susah tidur dok, pikiran jalan terus, jadi sulit fokus kerja.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_pencetus',
        kategori: 'sosial',
        tanya: 'Ada masalah atau tekanan tertentu belakangan ini — pekerjaan, keluarga, keuangan?',
        jawab: 'Banyak dok, masalah pekerjaan dan cicilan, tapi khawatirnya jadi berlebihan sampai hal kecil pun.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_mood',
        kategori: 'rps',
        tanya: 'Apakah ada rasa sedih mendalam, kehilangan minat, atau pikiran untuk menyakiti diri?',
        jawab: 'Sedih sih ada dok kalau lagi capek, tapi tidak sampai putus asa, tidak ada pikiran menyakiti diri.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_tiroid',
        kategori: 'rpd',
        tanya: 'Ada penurunan berat badan, sering berkeringat, benjolan leher, atau tremor tangan?',
        jawab: 'Berat badan stabil dok, tidak ada benjolan leher, tangan cuma gemetar kalau lagi cemas.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kopi',
        kategori: 'sosial',
        tanya: 'Konsumsi kopi, teh kental, atau minuman berenergi banyak?',
        jawab: 'Ngopi 3–4 gelas sehari dok biar kuat kerja.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_hobi',
        kategori: 'sosial',
        tanya: 'Suka olahraga jenis apa?',
        jawab: 'Dulu suka badminton dok, sekarang jarang.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Compos mentis, tampak tegang dan gelisah, kontak mata baik. Afek cemas, tidak ada gangguan isi pikir psikotik.', relevan: true },
      { region: 'jantung', temuan: 'Takikardia ringan (96x/menit) reguler, tanpa murmur — sesuai hiperarousal, bukan aritmia patologis.', relevan: true },
      { region: 'kepala_leher', temuan: 'Tidak ada pembesaran tiroid (struma), tidak ada eksoftalmus.', relevan: true },
      { region: 'ekstremitas', temuan: 'Tremor halus saat cemas, akral hangat, tidak ada kelemahan.', relevan: false },
    ],
    lab: [
      { id: 'tsh', hasil: 'TSH 2,1 mIU/L — normal (menyingkirkan hipertiroid sebagai penyebab organik).', flag: 'normal', relevan: true },
      { id: 'ekg', hasil: 'Sinus takikardia, tidak ada iskemia atau aritmia — meyakinkan pasien keluhan jantung bukan penyakit jantung.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['F41.1', 'F41.0', 'E05.9'],
    tatalaksana: {
      obatBenar: ['fluoksetin_20'],
      obatSalahUmum: [
        { id: 'diazepam_2', alasan: 'Benzodiazepin hanya untuk jangka SANGAT pendek/krisis — pada GAD kronik menimbulkan toleransi & ketergantungan. Lini utama: psikoterapi + SSRI.' },
        { id: 'amitriptilin_25', alasan: 'TCA bukan lini pertama GAD (efek samping antikolinergik/kardiak); SSRI lebih aman dan direkomendasikan.' },
      ],
      edukasi: ['manajemen_stres', 'higiene_tidur', 'aktivitas_fisik', 'kontrol_rutin'],
    },
    clue: 'GAD: kekhawatiran berlebihan sulit dikendalikan ≥6 bulan + gejala somatik (berdebar, otot tegang, mudah lelah, sulit tidur). SINGKIRKAN penyebab organik (hipertiroid → TSH; kafein berlebih). Lini pertama: psikoedukasi + relaksasi/CBT + SSRI (fluoksetin/sertralin). Benzodiazepin hanya jangka pendek. Kurangi kafein (PPDGJ/PPK Jiwa FKTP).',
  },

  /* ======================================================================
   * 7. Depresi Ringan (Episode Depresif Ringan)
   * Poin ajar: konseling ± SSRI; skrining bunuh diri wajib; hindari benzo tunggal.
   * ==================================================================== */
  {
    id: 'jiwa_depresi_ringan',
    nama: 'Episode Depresif Ringan',
    icd10: 'F32.0',
    skdi: '4A',
    kategori: 'jiwa',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Beberapa minggu ini saya murung terus dok, tidak semangat menjalani hari.',
    demografi: { usiaMin: 18, usiaMax: 55 },
    vital: { td: '118/76', nadi: 78, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Terima kasih mau bercerita. Apa yang paling Bapak/Ibu rasakan akhir-akhir ini?',
        jawab: 'Saya merasa sedih dan lesu terus dok, hal yang dulu menyenangkan sekarang terasa hambar.',
        variasi: {
          polos: 'Ati kula sedhih terus dok, males ngapa-ngapa, sing mbiyèn seneng saiki tawar.',
          terpelajar: 'Saya mengalami mood depresif dan anhedonia dok, kehilangan minat pada aktivitas yang biasanya saya nikmati.',
          lansia: 'Rasanya hampa Nak, hidup terasa berat, saya sering menyendiri belakangan ini.',
        },
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa lama perasaan ini berlangsung? Hampir sepanjang hari?',
        jawab: 'Sekitar tiga minggu dok, hampir tiap hari, terutama pagi terasa paling berat.',
        esensial: true,
        oldcarts: ['onset', 'durasi', 'waktu'],
      },
      {
        id: 'q_minat',
        kategori: 'rps',
        tanya: 'Masih ada hal yang bisa membuat Anda menikmati atau bersemangat?',
        jawab: 'Rasanya tidak dok, semua terasa berat, bahkan berkumpul dengan teman jadi malas.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_fungsi',
        kategori: 'rps',
        tanya: 'Bagaimana tidur, nafsu makan, dan tenaga sehari-hari?',
        jawab: 'Susah tidur dok, sering terbangun dini hari, nafsu makan turun, badan lemas tak bertenaga.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_fungsi_kerja',
        kategori: 'sosial',
        tanya: 'Apakah masih bisa bekerja dan mengurus keperluan sehari-hari?',
        jawab: 'Masih bisa dok walau berat, pekerjaan agak terganggu tapi masih jalan.',
        esensial: true,
      },
      {
        id: 'q_bunuh_diri',
        kategori: 'rps',
        tanya: 'Kadang saat seberat ini, ada yang merasa hidup tak berarti atau ingin mengakhiri hidup. Apakah Anda pernah merasa seperti itu?',
        jawab: 'Kadang terpikir hidup ini berat dok, tapi saya tidak punya niat atau rencana menyakiti diri. Saya masih ingin sembuh.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_pencetus',
        kategori: 'sosial',
        tanya: 'Apakah ada peristiwa atau kehilangan yang memicu perasaan ini?',
        jawab: 'Beberapa bulan lalu saya kehilangan pekerjaan dok, sejak itu terasa terpuruk.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Sebelumnya pernah mengalami hal serupa, atau ada masa merasa sangat bersemangat/tidak butuh tidur berhari-hari?',
        jawab: 'Tidak ada dok, tidak pernah ada masa terlalu bersemangat. Baru kali ini seberat ini.',
        esensial: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Compos mentis, tampak murung, gerak lambat, kontak mata berkurang. Afek depresif, mood hipotimia. Tidak ada waham/halusinasi.', relevan: true },
      { region: 'neurologis', temuan: 'Orientasi baik, tidak ada defisit fokal — menyingkirkan penyebab organik/demensia.', relevan: true },
      { region: 'kepala_leher', temuan: 'Tidak ada pembesaran tiroid; wajah tidak myxedema.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, bradikardia (-).', relevan: false },
    ],
    lab: [
      { id: 'tsh', hasil: 'TSH 2,8 mIU/L — normal (menyingkirkan hipotiroid sebagai penyebab mood rendah).', flag: 'normal', relevan: true },
      { id: 'hb', hasil: 'Hemoglobin 13,5 g/dL — normal (anemia sebagai penyebab lemas disingkirkan).', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['F32.0', 'F43.2', 'F34.1'],
    tatalaksana: {
      obatBenar: ['fluoksetin_20'],
      obatSalahUmum: [
        { id: 'diazepam_2', alasan: 'Benzodiazepin tunggal TIDAK mengatasi depresi & berisiko ketergantungan — bukan antidepresan. Depresi butuh psikoterapi ± SSRI.' },
        { id: 'amitriptilin_25', alasan: 'TCA efektif namun berbahaya bila overdosis (kardiotoksik) — kurang aman lini pertama untuk pasien dengan ide keputusasaan; SSRI lebih dipilih.' },
      ],
      edukasi: ['manajemen_stres', 'aktivitas_fisik', 'higiene_tidur', 'kontrol_rutin'],
    },
    clue: 'Depresi RINGAN: ≥2 minggu mood depresif + anhedonia + gejala penyerta (tidur, nafsu makan, energi turun) dengan fungsi MASIH cukup terjaga. WAJIB skrining risiko bunuh diri di tiap kunjungan. Tata laksana FKTP: psikoedukasi + konseling suportif/aktivasi perilaku, tambahkan SSRI (fluoksetin) bila gejala menetap/mengganggu. Singkirkan hipotiroid & pastikan tak ada riwayat manik (bipolar). Kontrol berkala; rujuk bila memberat/ada risiko bunuh diri (PPDGJ-III/PPK Jiwa FKTP).',
    konsekuensi: {
      narasi: 'Bila hanya diberi obat penenang tanpa konseling dan tanpa skrining bunuh diri, gejala dapat memberat menjadi depresi sedang-berat dengan risiko keselamatan.',
      kembaliHariMin: 14,
      kembaliHariMax: 30,
      kondisiKembali: 'Pasien kembali makin menarik diri, tidak lagi mampu bekerja, dan mulai menyatakan keputusasaan — perlu evaluasi risiko & rujukan jiwa.',
      guideline: 'PPK Jiwa FKTP / mhGAP WHO — konseling ± SSRI, skrining bunuh diri wajib.',
    },
  },

  /* ======================================================================
   * 8. Insomnia (Gangguan Tidur Non-organik)
   * Poin ajar: higiene tidur & CBT-I lini pertama; hindari benzo rutin/jangka panjang.
   * ==================================================================== */
  {
    id: 'jiwa_insomnia',
    nama: 'Insomnia (Gangguan Tidur Non-organik)',
    icd10: 'F51.0',
    skdi: '4A',
    kategori: 'jiwa',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Saya susah tidur dok, tiap malam berjam-jam baru bisa terlelap.',
    demografi: { usiaMin: 25, usiaMax: 60 },
    vital: { td: '122/80', nadi: 78, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Ceritakan susah tidurnya seperti apa — sulit memulai tidur, sering terbangun, atau bangun terlalu dini?',
        jawab: 'Susah memulai tidur dok, sudah di kasur tapi mata melek terus sampai jam dua pagi.',
        variasi: {
          polos: 'Angel turu dok, wis nglétak neng kasur ning mripat mêlèk terus tekan bengi.',
          terpelajar: 'Terutama insomnia inisial dok, latensi tidur saya bisa lebih dari dua jam.',
          lansia: 'Sudah tua ya Nak, tidur jadi susah, sering kebangun tengah malam terus tidak bisa lagi.',
        },
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa lama dan seberapa sering dalam seminggu?',
        jawab: 'Sudah sebulan lebih dok, hampir tiap malam, minimal empat malam seminggu.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_dampak',
        kategori: 'rps',
        tanya: 'Bagaimana rasanya di siang hari — mengantuk, sulit fokus, mudah lelah?',
        jawab: 'Siang jadi ngantuk dan lemas dok, susah konsentrasi, gampang emosi.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_mood',
        kategori: 'rps',
        tanya: 'Apakah disertai rasa sedih berkepanjangan, cemas berlebihan, atau kehilangan minat?',
        jawab: 'Tidak sampai sedih terus dok, cuma memang lagi banyak pikiran soal pekerjaan.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kebiasaan',
        kategori: 'sosial',
        tanya: 'Kebiasaan sebelum tidur bagaimana — main HP, kopi, tidur siang lama?',
        jawab: 'Suka main HP sampai larut dok, ngopi malam juga, kadang tidur siang lama.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_fisik',
        kategori: 'rpd',
        tanya: 'Ada nyeri, sesak, sering pipis malam, atau mendengkur berat/berhenti napas saat tidur?',
        jawab: 'Tidak ada dok, tidak nyeri, tidak sesak, tidak ada yang bilang saya berhenti napas saat tidur.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_obat',
        kategori: 'rpd',
        tanya: 'Sedang minum obat tertentu, atau pernah pakai obat tidur?',
        jawab: 'Belum pernah dok, ini pertama kali mau tanya soal obat tidur.',
      },
      {
        id: 'q_lingkungan',
        kategori: 'sosial',
        tanya: 'Merek kasur atau bantalnya apa?',
        jawab: 'Kasur biasa dok, sudah agak lama.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Compos mentis, tampak lelah namun tenang. Afek dalam batas normal, tidak ada tanda depresi/psikotik.', relevan: true },
      { region: 'kepala_leher', temuan: 'Tidak ada struma; lingkar leher normal (bukan risiko tinggi OSA).', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, tidak ada tanda gagal jantung yang mengganggu tidur.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, tidak ada mengi/ronki (bukan penyebab organik).', relevan: false },
    ],
    lab: [
      { id: 'tsh', hasil: 'TSH 1,9 mIU/L — normal (hipertiroid sebagai penyebab insomnia disingkirkan).', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['F51.0', 'F41.1', 'F32.0'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [
        { id: 'diazepam_2', alasan: 'Benzodiazepin BUKAN lini pertama insomnia kronik & tidak untuk pemakaian rutin — toleransi, ketergantungan, jatuh pada lansia. Utamakan higiene tidur/CBT-I. Hipnotik hanya jangka sangat pendek bila perlu.' },
        { id: 'amitriptilin_25', alasan: 'Tidak diindikasikan untuk insomnia primer tanpa depresi; efek antikolinergik & sedasi berlebih, berisiko pada lansia.' },
      ],
      edukasi: ['higiene_tidur', 'manajemen_stres', 'aktivitas_fisik'],
    },
    clue: 'Insomnia kronik: lini PERTAMA adalah higiene tidur + terapi perilaku (CBT-I) — jadwal tidur teratur, kurangi layar/kafein malam, hindari tidur siang panjang, tempat tidur hanya untuk tidur. Farmakoterapi (hipnotik) hanya jangka SANGAT pendek & selektif; benzodiazepin dihindari terutama pada lansia. Singkirkan penyebab sekunder (depresi/cemas, nyeri, OSA, hipertiroid) (PPK Jiwa FKTP / pedoman insomnia).',
  },

  /* ======================================================================
   * 9. Skizofrenia (WAJIB RUJUK jiwa untuk konfirmasi & rencana terapi)
   * Poin ajar: kenali psikosis, mulai antipsikotik + RUJUK; jangan menstigma/telantarkan.
   * ==================================================================== */
  {
    id: 'jiwa_skizofrenia',
    nama: 'Skizofrenia',
    icd10: 'F20.0',
    skdi: '3A',
    kategori: 'jiwa',
    fktp144: true,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'jiwa',
    keluhanUtama: 'Anak saya sering bicara sendiri dan bilang ada suara yang mengancam dia, dok.',
    demografi: { usiaMin: 18, usiaMax: 35 },
    vital: { td: '118/76', nadi: 84, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Terima kasih sudah membawa keluarga berobat. Boleh ceritakan perubahan yang Ibu lihat pada anak?',
        jawab: 'Sudah beberapa bulan ini dok, dia sering bicara sendiri, katanya ada suara-suara yang menyuruh dan mengancam.',
        variasi: {
          wali_anak: 'Anak saya berubah dok, sering komat-kamit sendiri, curiga berlebihan, dan bilang ada suara yang mengejeknya.',
          polos: 'Laré kula asring ngomong dhéwé dok, criyos wonten swanten sing ngancem-ancem.',
          cemas: 'Saya takut dok, dia jadi seperti orang lain, kadang marah tanpa sebab, saya bingung harus bagaimana.',
        },
        esensial: true,
        oldcarts: ['onset', 'karakter'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Perubahan ini sudah berlangsung berapa lama?',
        jawab: 'Kira-kira sudah lebih dari enam bulan dok, makin lama makin sering.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_halusinasi',
        kategori: 'rps',
        tanya: 'Suara-suara itu — apakah dia mendengarnya saat sadar penuh? Apa isinya?',
        jawab: 'Katanya jelas dok, seperti orang berbicara padanya, mengomentari dan menyuruh, padahal tidak ada orang.',
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_waham',
        kategori: 'rps',
        tanya: 'Apakah dia punya keyakinan yang aneh — merasa diikuti, diguna-guna, atau dimusuhi orang?',
        jawab: 'Iya dok, dia yakin tetangga berkomplot mau mencelakainya, sampai tidak mau keluar rumah.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_fungsi',
        kategori: 'sosial',
        tanya: 'Bagaimana dengan kuliah/kerja, kebersihan diri, dan bergaulnya?',
        jawab: 'Berantakan dok, berhenti kuliah, malas mandi, menarik diri dari teman-temannya.',
        esensial: true,
      },
      {
        id: 'q_bahaya',
        kategori: 'rps',
        tanya: 'Apakah pernah ada perilaku membahayakan diri sendiri atau orang lain?',
        jawab: 'Belum sampai melukai dok, tapi kadang marah dan membanting barang saat suaranya muncul.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_napza',
        kategori: 'rpd',
        tanya: 'Apakah ada riwayat pakai narkoba, alkohol, atau sakit/demam berat sebelum gejala muncul?',
        jawab: 'Setahu saya tidak pakai narkoba dok, tidak ada demam berat, memang murni berubah perilakunya.',
        esensial: true,
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Ada anggota keluarga dengan gangguan jiwa serupa?',
        jawab: 'Pamannya dulu pernah dirawat karena gangguan jiwa dok.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Compos mentis, penampilan tidak terawat, kontak mata minim, tampak waspada/curiga.', relevan: true },
      { region: 'neurologis', temuan: 'Orientasi cukup, tidak ada defisit fokal, tidak ada tanda intoksikasi/putus zat akut — menyingkirkan penyebab organik.', relevan: true },
      { region: 'kepala_leher', temuan: 'Tidak ada struma; pupil isokor — menyingkirkan penyebab metabolik/toksik akut.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler (penting sebagai baseline sebelum antipsikotik — risiko QT).', relevan: false },
    ],
    lab: [
      { id: 'gds', hasil: 'GDS 98 mg/dL — normal (menyingkirkan delirium metabolik).', flag: 'normal', relevan: true },
      { id: 'darah_rutin', hasil: 'Dalam batas normal — tidak ada infeksi/anemia sebagai penyebab organik.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['F20.0', 'F23.9', 'F25.9'],
    tatalaksana: {
      obatBenar: ['haloperidol_5'],
      obatSalahUmum: [
        { id: 'diazepam_2', alasan: 'Benzodiazepin hanya membantu agitasi sesaat, TIDAK mengobati psikosis. Terapi inti skizofrenia adalah antipsikotik — dan kasus ini WAJIB rujuk untuk konfirmasi & rencana jangka panjang.' },
        { id: 'fluoksetin_20', alasan: 'Antidepresan bukan terapi psikosis; keliru menganggap ini gangguan mood. Diagnosis & regimen antipsikotik ditegakkan bersama SpKJ.' },
      ],
      edukasi: ['kenali_kambuh_jiwa', 'kepatuhan_obat', 'kontrol_rutin'],
    },
    clue: 'Skizofrenia: gejala psikotik (halusinasi auditorik, waham kejar/curiga, disorganisasi) ≥1 bulan + penurunan fungsi bermakna, tanpa penyebab organik/zat. SKDI 3A → dokter FKTP mengenali, boleh MULAI stabilisasi antipsikotik (mis. haloperidol) bila agitasi, lalu RUJUK ke SpKJ untuk penegakan & rencana terapi. Rangkul keluarga dengan bahasa yang manusiawi — pasien jiwa TIDAK boleh ditelantarkan/dipasung (indikator PIS-PK & UU Kesehatan Jiwa).',
    konsekuensi: {
      narasi: 'Bila tidak dirujuk dan keluarga dibiarkan tanpa panduan, gejala psikotik memberat, risiko membahayakan diri/orang lain meningkat, dan pasien berisiko dipasung atau ditelantarkan.',
      kembaliHariMin: 7,
      kembaliHariMax: 30,
      kondisiKembali: 'Keluarga kembali karena pasien makin agitatif, menolak makan/obat, dan sempat mencederai diri — kondisi yang seharusnya sudah tertangani di layanan jiwa.',
      guideline: 'PPK Jiwa FKTP / UU No.18/2014 Kesehatan Jiwa — kenali, stabilisasi, rujuk SpKJ, tidak menelantarkan.',
    },
  },

  /* ======================================================================
   * 10. Malaria Falsiparum
   * Poin ajar: RDT + DHP (ACT). JANGAN klorokuin pada falsiparum (resisten).
   * ==================================================================== */
  {
    id: 'kia_malaria_falsiparum',
    nama: 'Malaria Falsiparum',
    icd10: 'B50.9',
    skdi: '4A',
    kategori: 'infeksi',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'rendah',
    keluhanUtama: 'Demam menggigil naik-turun dok, saya baru pulang kerja dari Papua.',
    demografi: { usiaMin: 18, usiaMax: 50 },
    vital: { td: '110/70', nadi: 100, rr: 20, suhu: 39.2, spo2: 98 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Ceritakan demamnya, Pak/Bu.',
        jawab: 'Demamnya datang dengan menggigil hebat dok, lalu berkeringat banyak, naik-turun begini beberapa hari.',
        variasi: {
          polos: 'Panasé teka karo krasa nggigil banget dok, banjur kringeten akèh, munggah-mudhun.',
          terpelajar: 'Demam paroksismal dok, diawali menggigil, puncak panas, lalu diaforesis — pola periodik.',
          cemas: 'Demamnya hebat sekali dok pakai menggigil, saya takut ini malaria berat.',
        },
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_perjalanan',
        kategori: 'keluhan_utama',
        tanya: 'Belakangan ini bepergian ke daerah endemis malaria? Kapan pulang?',
        jawab: 'Iya dok, saya kerja proyek di Papua, baru pulang sekitar sepuluh hari lalu.',
        esensial: true,
        oldcarts: ['onset', 'penyerta'],
      },
      {
        id: 'q_pola',
        kategori: 'rps',
        tanya: 'Demamnya berpola tiap hari atau selang sehari? Sudah berapa hari?',
        jawab: 'Sudah empat hari dok, kadang tiap hari kadang selang sehari, tidak teratur betul.',
        esensial: true,
        oldcarts: ['durasi', 'waktu'],
      },
      {
        id: 'q_penyerta',
        kategori: 'rps',
        tanya: 'Ada sakit kepala, mual muntah, nyeri otot, atau kencing berwarna gelap?',
        jawab: 'Sakit kepala hebat dok, mual, badan ngilu semua, tapi kencing masih kuning biasa.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_bahaya',
        kategori: 'rps',
        tanya: 'Ada penurunan kesadaran, kejang, sesak, atau sangat lemas sampai tidak bisa berdiri?',
        jawab: 'Tidak sampai begitu dok, masih sadar penuh dan bisa jalan walau lemas — mau menyingkirkan malaria berat.',
        esensial: true,
        oldcarts: ['keparahan', 'penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah kena malaria sebelumnya? Pakai kelambu/obat pencegah di sana?',
        jawab: 'Belum pernah dok, di sana jarang pakai kelambu dan tidak minum obat pencegah.',
      },
      {
        id: 'q_makan',
        kategori: 'sosial',
        tanya: 'Kemarin habis makan makanan pedas atau tidak?',
        jawab: 'Biasa saja dok, tidak ada yang aneh.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sakit sedang, febris, konjungtiva subikterik ringan, tidak ada penurunan kesadaran.', relevan: true },
      { region: 'abdomen', temuan: 'Splenomegali teraba (Schuffner 1–2), hepar sedikit membesar, nyeri tekan ringan.', relevan: true },
      { region: 'kulit', temuan: 'Kulit teraba panas saat puncak demam, berkeringat. Tidak ada petekie.', relevan: true },
      { region: 'neurologis', temuan: 'Sadar penuh (GCS 15), tidak ada kaku kuduk atau defisit — menyingkirkan malaria serebral.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-, tidak ada tanda edema paru.', relevan: false },
    ],
    lab: [
      { id: 'malaria_rdt', hasil: 'RDT malaria: POSITIF Plasmodium falciparum (HRP-2 +). ', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Trombosit 95.000/µL (trombositopenia), Hb 11,2, leukosit normal — khas malaria.', flag: 'abnormal', relevan: true },
      { id: 'gds', hasil: 'GDS 92 mg/dL — normal (memastikan tidak hipoglikemia, tanda malaria berat).', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['B50.9', 'A90', 'A01.0'],
    tatalaksana: {
      obatBenar: ['dihidroartemisinin_piperakuin', 'primakuin_15', 'paracetamol_500'],
      obatSalahUmum: [
        { id: 'ciprofloxacin_500', alasan: 'Antibiotik bukan terapi malaria (parasit, bukan bakteri) — menunda ACT yang menyelamatkan nyawa.' },
        { id: 'cotrimoxazole_480', alasan: 'Bukan antimalaria; keliru mengobati demam sebagai infeksi bakteri tanpa memeriksa RDT.' },
      ],
      edukasi: ['kepatuhan_obat', 'tanda_bahaya', 'psn_3m'],
    },
    clue: 'Malaria falsiparum: demam periodik + menggigil + splenomegali + riwayat dari daerah endemis (Papua/NTT). KONFIRMASI dengan RDT/mikroskopis SEBELUM terapi. Lini pertama Kemenkes: ACT = DHP (Dihidroartemisinin-Piperakuin) 3 hari + primakuin dosis tunggal (gametosidal). JANGAN pakai klorukin untuk falsiparum — resisten luas di Indonesia. Kenali tanda MALARIA BERAT (penurunan kesadaran, kejang, ikterik, gagal ginjal, hipoglikemia) → rujuk (Pedoman Tata Laksana Malaria Kemenkes).',
    konsekuensi: {
      narasi: 'Bila diberi klorokuin (yang sudah resisten) atau antibiotik, parasitemia terus meningkat dan dapat berkembang menjadi malaria serebral, gagal organ, hingga kematian.',
      kembaliHariMin: 1,
      kembaliHariMax: 3,
      kondisiKembali: 'Pasien kembali dengan kesadaran menurun, kejang, dan kuning — malaria berat (serebral) yang mengancam jiwa dan perlu artesunat IV + rujuk.',
      guideline: 'Pedoman Tata Laksana Malaria Kemenkes / WHO — ACT (DHP) untuk falsiparum, bukan klorokuin.',
    },
  },
]
