import type { KasusKlinis } from '../types'
import { buatKasusFktpLab } from './labCaseFactory'

const PPK = 'Acuan dasar keputusan klinis kasus ini adalah PPK Dokter di FKTP (KMK 1186/2022).'

export const LAB_BATCH_2_CASES: KasusKlinis[] = [
  buatKasusFktpLab({
    id: 'lab_kejang_demam_sederhana', nama: 'Kejang Demam Sederhana', icd10: 'R56.0', kategori: 'saraf', prevalensi: 'sedang',
    keluhanUtama: 'Anak saya tadi kejang saat demam, sekarang sudah sadar lagi.', keluhanUtamaOlehPendamping: true, usia: [1, 5], vital: { nadi: 112, rr: 24, suhu: 39.1, spo2: 98 },
    pembuka: ['Boleh ceritakan kejangnya dari awal sampai berhenti?', 'Seluruh badan kaku-kelojot sekitar tiga menit, berhenti sendiri, lalu menangis dan sekarang mengenali saya.'],
    pertanyaan: [
      ['q_durasi', 'rps', 'Berapa lama dan apakah berulang dalam 24 jam?', 'Sekitar tiga menit dan baru satu kali.', true],
      ['q_fokal', 'rps', 'Kejang seluruh badan atau hanya satu sisi?', 'Seluruh badan, tidak hanya satu sisi.', true],
      ['q_infeksi_ssp', 'rps', 'Ada kaku kuduk, muntah menyemprot, sulit dibangunkan, atau ruam ungu?', 'Tidak ada; sekarang anak sadar dan mau minum.', true],
      ['q_riwayat', 'rpd', 'Pernah kejang tanpa demam atau gangguan perkembangan?', 'Tidak pernah dan tumbuh kembangnya sesuai usia.', false],
    ],
    fisik: [['umum', 'Sadar, menangis kuat, perfusi baik; tidak lagi kejang.'], ['neurologis', 'GCS sesuai usia, kaku kuduk negatif, tanpa defisit fokal.'], ['tht_mulut', 'Faring hiperemis ringan tanpa fokus infeksi berat.', true]],
    diagnosisBanding: ['R56.0', 'G40.9', 'G00.9'],
    tatalaksana: { obatBenar: [], obatOpsional: ['paracetamol_sirup'], obatSalahUmum: [{ id: 'diazepam_rektal_10', alasan: 'Obat rescue tidak diberikan rutin setelah kejang singkat sudah berhenti dan anak sadar.', bahaya: 'nonPrimer' }], edukasi: ['pertolongan_kejang', 'kompres_demam', 'tanda_bahaya'], edukasiKritis: ['pertolongan_kejang'] },
    clue: 'Usia 6 bulan-5 tahun, kejang umum <15 menit, hanya sekali/24 jam, pulih penuh, dan tanpa tanda infeksi SSP mendukung kejang demam sederhana. Cari sumber demam dan ajarkan pertolongan kejang; antipiretik meningkatkan kenyamanan tetapi tidak menjamin mencegah kekambuhan.',
    panduanResmi: `${PPK} Rujuk bila kejang kompleks, penurunan kesadaran menetap, rangsang meningeal, atau diagnosis meragukan.`,
  }),

  buatKasusFktpLab({
    id: 'lab_tetanus_generalisata_awal', nama: 'Tetanus Generalisata Derajat Sedang', icd10: 'A35', kategori: 'infeksi',
    keluhanUtama: 'Rahang saya kaku dan badan menegang kalau mendengar suara keras.', usia: [20, 65], vital: { td: '138/84', nadi: 108, rr: 24, suhu: 38.0, spo2: 96 }, harusDirujuk: true, spesialisRujukan: 'saraf',
    pembuka: ['Keluhan kaku dan kejang ini mulai bagaimana?', 'Tiga hari rahang sulit dibuka, lalu punggung menegang setiap ada suara atau sentuhan.'],
    pertanyaan: [
      ['q_spasme', 'rps', 'Seberapa sering dan lama tubuh menegang; apakah pernah terjadi tanpa pemicu?', 'Hari ini sudah beberapa kali, sekitar lima sampai sepuluh detik setiap ada suara atau sentuhan. Belum pernah lama atau muncul sendiri.', true],
      ['q_napas', 'rps', 'Ada sulit menelan, tersedak, sesak, bibir membiru, atau napas sempat berhenti?', 'Menelan mulai sulit, jadi saya takut minum. Belum sesak, membiru, atau berhenti bernapas.', true],
      ['q_luka', 'rps', 'Ada luka sebelum keluhan ini?', 'Delapan hari lalu telapak kaki tertusuk paku dan hanya saya cuci sendiri.', true],
      ['q_imunisasi', 'rpd', 'Apakah imunisasi tetanus dasar pernah lengkap dan kapan dosis terakhirnya?', 'Saya tidak punya catatan imunisasi dan tidak ingat pernah mendapat booster saat dewasa.', true],
      ['q_otonom', 'rps', 'Ada keringat deras, berdebar hebat, atau tekanan darah terasa naik-turun?', 'Belum ada keringat deras atau berdebar hebat.', true],
      ['q_pajanan_racun', 'rpd', 'Sebelum kaku, ada minum jamu, racun, atau obat yang tidak dikenal?', 'Tidak ada. Keluhan baru muncul beberapa hari setelah kaki tertusuk.', false],
    ],
    fisik: [
      ['umum', 'Pemeriksaan dengan stimulus minimal: trismus, risus sardonicus ringan, sadar penuh, tanpa keringat profus.'],
      ['neurologis', 'Spasme generalisata singkat terpicu suara atau sentuhan; belum ada spasme spontan berkepanjangan, apnea, atau defisit fokal.'],
      ['ekstremitas', 'Luka tusuk plantar dengan jaringan nekrotik kecil; cukup ditutup steril tanpa eksplorasi atau debridemen di FKTP.', true],
    ],
    diagnosisBanding: ['A35', 'T65.1', 'G00.9'],
    tatalaksana: {
      obatBenar: ['tetanus_imunoglobulin_500'],
      obatOpsional: ['vaksin_td'],
      prosedur: ['minim_stimulus_tetanus', 'kesiapan_airway_rujuk', 'pemantauan_ketat_vital', 'balut_luka_steril'],
      edukasi: ['puasa_sambil_rujuk', 'imunitas_setelah_tetanus', 'rawat_luka_tetanus'],
      edukasiKritis: ['puasa_sambil_rujuk'],
      terapiKritis: ['tetanus_imunoglobulin_500'],
    },
    stabilisasiWajib: ['minim_stimulus_tetanus', 'kesiapan_airway_rujuk', 'pemantauan_ketat_vital'],
    clue: 'Trismus, disfagia, dan spasme generalisata singkat terpicu rangsang setelah luka berisiko dengan imunisasi tidak jelas mendukung tetanus generalisata derajat sedang secara klinis; jangan menunggu tes laboratorium. Tempatkan di ruang tenang, puasakan, pantau jalan napas dan tanda vital, siapkan suction-BVM-oksigen serta pendamping terlatih, berikan human TIG 500 IU IM yang dinyatakan ready, tutup luka secara steril, dan transfer segera ke layanan saraf dengan kemampuan airway/ventilasi/ICU. SpO2 96% tidak memerlukan oksigen rutin.',
    panduanResmi: `${PPK} Bab tetanus PPK mencantumkan kompetensi 4A, diagnosis klinis, minimisasi rangsang, pengawasan respirasi, perawatan luka, pelaporan, dan rujukan ke neurologi. Label 4A adalah tingkat kompetensi diagnosis, bukan izin menuntaskan tetanus generalisata sedang sebagai rawat jalan. WHO 2026 dan CDC 2025 menempatkannya sebagai kegawatan rawat inap; CDC merekomendasikan human TIG 500 IU IM dosis tunggal. Fornas 1199/2025 mencantumkan human TIG 250 IU dan 500 IU untuk manifestasi tetanus klinis. Regimen ATS dosis tinggi, penisilin, dan sedasi dosis besar dalam teks lama tidak disalin menjadi resep FKTP; antimikroba, kontrol spasme, debridemen, dan ventilasi mengikuti protokol fasilitas rujukan.`,
    catatanRealita: 'TIG 500 IU, balutan steril, suction, BVM, oksigen, monitor, petugas terlatih, dan ambulans dinyatakan ready; ini bukan klaim stok universal. Jika TIG tidak ada, transfer jangan ditunda. Sukamaju hanya menutup luka; debridemen dilakukan di RS karena spasme terpicu rangsang. Laporkan kasus ke Dinkes, tetapi tetanus tidak menular antarmanusia dan tidak memerlukan profilaksis kontak atau penetapan KLB otomatis.',
    mutiaraEbm: 'Tetanus adalah diagnosis klinis dan hasil kultur luka negatif tidak menyingkirkannya. TIG hanya menetralkan toksin yang belum terikat, sehingga diberikan sedini mungkin; pasien yang sembuh tetap tidak memperoleh imunitas alami dan masih memerlukan seri vaksinasi. Keracunan striknin dapat menyerupai spasme terpicu rangsang, tetapi biasanya beronset cepat setelah pajanan tanpa trismus khas atau masa inkubasi luka.',
    sumber: [
      {
        id: 'ppk_fktp_2022',
        label: 'KMK 1186/2022 - PPK Dokter di FKTP (indeks publik)',
        url: 'https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/',
        tahun: 2022,
        jenis: 'pedoman_indonesia',
      },
      {
        id: 'fornas_2025',
        label: 'KMK 1199/2025 - Formularium Nasional',
        url: 'https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/',
        tahun: 2025,
        jenis: 'pedoman_indonesia',
      },
      {
        id: 'who_tetanus_2026',
        label: 'WHO Tetanus Fact Sheet 2026',
        url: 'https://www.who.int/news-room/fact-sheets/detail/tetanus',
        tahun: 2026,
        jenis: 'evidence_internasional',
      },
      {
        id: 'cdc_tetanus_care_2025',
        label: 'CDC Clinical Care of Tetanus 2025',
        url: 'https://www.cdc.gov/tetanus/hcp/clinical-care/index.html',
        tahun: 2025,
        jenis: 'evidence_internasional',
      },
      {
        id: 'ukhsa_tetanus_2024',
        label: 'UKHSA Guidance on Suspected Tetanus Cases 2024',
        url: 'https://www.gov.uk/government/publications/tetanus-advice-for-health-professionals/guidance-on-the-management-of-suspected-tetanus-cases-and-the-assessment-and-management-of-tetanus-prone-wounds',
        tahun: 2024,
        jenis: 'evidence_internasional',
      },
    ],
  }),

  buatKasusFktpLab({
    id: 'lab_hiv_tanpa_komplikasi', nama: 'Infeksi HIV Asimtomatik - Inisiasi ART', icd10: 'Z21', kategori: 'infeksi', prevalensi: 'sedang',
    keluhanUtama: 'Tes HIV awal saya reaktif. Saya diminta kembali hari ini untuk memastikan hasil dan membahas pengobatan.', usia: [18, 55], vital: { td: '118/76', nadi: 82, rr: 18, suhu: 36.7, spo2: 99 },
    pembuka: ['Apa yang membuat Anda melakukan tes, hasil apa yang sudah disampaikan, dan bagaimana kondisi sekarang?', 'Pasangan saya terdiagnosis HIV. Tes skrining awal saya reaktif; saya merasa sehat dan diminta kembali untuk konfirmasi serta membahas obat.'],
    pertanyaan: [
      ['q_oi', 'rps', 'Ada batuk lama, demam, penurunan berat badan, diare lama, sakit kepala berat, atau sesak?', 'Tidak ada; berat badan stabil.', true],
      ['q_obat', 'rpd', 'Pernah memakai ARV, obat TB, antikejang, jamu, atau obat rutin lain?', 'Belum pernah ARV dan tidak ada obat, jamu, atau suplemen rutin.', true],
      ['q_tb', 'rps', 'Ada kontak TB atau gejala TB?', 'Tidak ada batuk lama, keringat malam, atau kontak TB.', true],
      ['q_ginjal', 'rpd', 'Ada penyakit ginjal, kencing berkurang, atau obat yang pernah mengganggu ginjal?', 'Tidak ada; kencing normal dan tidak pernah disebut punya penyakit ginjal.', true],
      ['q_hamil', 'rpd', 'Apakah sedang hamil, mungkin hamil, atau merencanakan kehamilan?', 'Tidak sedang atau merencanakan kehamilan.', true, 'P'],
      ['q_kesiapan', 'sosial', 'Apa yang paling Anda khawatirkan setelah hasil awal ini; adakah pikiran menyakiti diri, dan dukungan aman apa yang Anda inginkan saat memulai terapi?', 'Saya cemas, tetapi tidak berpikir menyakiti diri. Saya ingin mulai hari ini; pasangan mendukung, tetapi status saya tetap rahasia dari orang lain.', true],
    ],
    fisik: [['umum', 'Status gizi baik, tidak tampak infeksi oportunistik.'], ['kepala_leher', 'Tidak ada kandidiasis oral atau limfadenopati bermakna.'], ['toraks_paru', 'Suara napas normal.', false]],
    lab: [
      ['tes_hiv_serial', 'Tiga tes cepat serial reaktif sesuai algoritma nasional; diagnosis HIV terkonfirmasi.', 'abnormal'],
      ['panel_awal_hiv_jejaring', 'CD4 428 sel/mm3, eGFR 92 mL/menit/1,73 m2, dan HBsAg nonreaktif.', 'normal'],
    ],
    diagnosisBanding: ['Z21', 'R75', 'B20'],
    tatalaksana: {
      obatBenar: ['arv_tld'],
      edukasi: ['kepatuhan_arv', 'retensi_hiv_viral_load', 'pencegahan_hiv_berpusat_pasien', 'tpt_hiv_setelah_skrining_tb'],
      edukasiKritis: ['kepatuhan_arv', 'retensi_hiv_viral_load'],
    },
    konfirmasiWajib: 'tes_hiv_serial',
    clue: 'Tes skrining awal reaktif belum cukup untuk diagnosis; tiga tes cepat serial yang seluruhnya reaktif mengonfirmasi HIV sesuai algoritma nasional. Karena pasien tanpa gejala infeksi oportunistik, siap berobat, CD4 428 sel/mm3, dan fungsi ginjal memadai, mulai TDF/3TC/DTG sekali sehari pada hari yang sama. Status kehamilan tetap dinilai untuk konseling dan layanan maternal-HIV terintegrasi, tetapi hamil atau berpotensi hamil bukan alasan otomatis untuk menyingkirkan dolutegravir. Bila pasien hamil atau merencanakan kehamilan, lakukan diskusi manfaat-risiko yang terinformasi dan sambungkan ke jalur maternal-HIV sesuai program. Nilai TB aktif dan interaksi obat; setelah TB aktif disingkirkan, nilai kelayakan TPT sesuai program. Panel awal serta viral load mendukung staging dan monitoring, bukan ritual untuk menunda ART tanpa alasan klinis. Kotrimoksazol tidak otomatis diberikan pada CD4 ini tanpa stadium 3/4 atau TB aktif. U=U baru berlaku setelah supresi viral terverifikasi dan dipertahankan.',
    panduanResmi: `${PPK} PNPK HIV KMK 90/2019 menjadi acuan dasar klinis treat-all dan rapid ART. Permenkes 3/2026 mencabut sebagian besar Permenkes 23/2022, tetapi Pasal 41 dan Lampirannya tetap berlaku sebagai pedoman teknis program HIV/IMS; karena itu Permenkes 23/2022 tidak boleh ditampilkan seolah aktif utuh. Pedoman Kerja Puskesmas Klaster 3 tahun 2024 menempatkan TDF/3TC/DTG sebagai lini pertama dewasa, ART hari yang sama atau paling lambat hari ketujuh bila tanpa infeksi oportunistik, serta kontrol satu bulan untuk pasien stabil. WHO merekomendasikan dolutegravir sebagai regimen preferred untuk semua populasi, termasuk perempuan hamil dan yang berpotensi hamil; kehamilan memicu informed choice serta integrasi layanan maternal-HIV, bukan larangan otomatis. WHO 2025/2026 mempertahankan regimen berbasis dolutegravir, pencegahan TB, layanan terintegrasi, retensi, dan re-engagement.`,
    catatanRealita: 'Sukamaju ditetapkan sebagai layanan ARV; TLD, konselor, dan jejaring laboratorium siap. Bila hasil darah masih ditunggu tetapi pasien layak, rapid ART tetap berjalan dan ditinjau satu minggu; kasus dengan hasil aman ini kontrol satu bulan. Viral load melalui jejaring. Notifikasi pasangan ditawarkan sukarela, rahasia, aman, dan tanpa paksaan; kunjungan terlewat memicu re-engagement rahasia, bukan penghentian layanan.',
    mutiaraEbm: 'Tampak sehat tidak menyingkirkan advanced HIV disease: CD4 baseline tetap penting untuk menemukan imunosupresi berat dan menentukan paket profilaksis, tetapi bukan syarat untuk menahan ART. HBsAg juga bermakna karena tenofovir-lamivudin aktif terhadap hepatitis B dan penghentian sembarangan dapat memicu flare. Pada kasus ini CD4 428 sel/mm3, HBsAg nonreaktif, dan tidak ada stadium klinis 3/4, sehingga kotrimoksazol bukan resep otomatis.',
    sumber: [
      {
        id: 'ppk_fktp_2022',
        label: 'KMK 1186/2022 - PPK Dokter di FKTP (indeks publik)',
        url: 'https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/',
        tahun: 2022,
        jenis: 'pedoman_indonesia',
      },
      {
        id: 'pnpk_hiv_2019',
        label: 'KMK 90/2019 - PNPK Tata Laksana HIV',
        url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan_1610423733_374785.pdf',
        tahun: 2019,
        jenis: 'pedoman_indonesia',
      },
      {
        id: 'permenkes_penyakit_2026',
        label: 'Permenkes 3/2026 - Penanggulangan Penyakit',
        url: 'https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-3-tahun-2026',
        tahun: 2026,
        jenis: 'pedoman_indonesia',
      },
      {
        id: 'lampiran_hiv_ims_2022',
        label: 'Lampiran Permenkes 23/2022 - Pedoman HIV/AIDS/IMS yang dipertahankan',
        url: 'https://jdih.kemkes.go.id/storage/documents/pdfs/2022permenkes023.pdf',
        tahun: 2022,
        jenis: 'pedoman_indonesia',
      },
      {
        id: 'pedoman_puskesmas_klaster3_2024',
        label: 'Kemenkes 2024 - Pedoman Kerja Puskesmas Klaster 3',
        url: 'https://renbut.kemkes.go.id/regulasi/Pedoman%20Puskesmas%20Klaster%203.pdf',
        tahun: 2024,
        jenis: 'pedoman_indonesia',
      },
      {
        id: 'who_hiv_clinical_2025',
        label: 'WHO Updated HIV Clinical Management 2025',
        url: 'https://www.who.int/publications/i/item/9789240119468',
        tahun: 2025,
        jenis: 'evidence_internasional',
      },
      {
        id: 'who_hiv_service_2026',
        label: 'WHO Consolidated HIV Service Delivery 2026',
        url: 'https://www.who.int/publications/i/item/9789240124233',
        tahun: 2026,
        jenis: 'evidence_internasional',
      },
    ],
  }),

  buatKasusFktpLab({
    id: 'lab_gangguan_somatoform', nama: 'Gangguan Somatoform - Keluhan Fisik Persisten', icd10: 'F45', kategori: 'jiwa', prevalensi: 'sedang',
    keluhanUtama: 'Dada saya sering berdebar dan badan terasa sakit berpindah-pindah. Saya khawatir ada penyakit yang terlewat.', usia: [20, 55], vital: { td: '124/78', nadi: 84, rr: 18, suhu: 36.6, spo2: 99 },
    pembuka: ['Keluhan mana yang paling mengganggu dan sudah berapa lama?', 'Enam bulan ini nyeri berpindah, mual, dan berdebar. Saya masih khawatir ada penyakit yang belum ditemukan.'],
    pertanyaan: [
      ['q_karakter', 'rps', 'Saat berdebar, berapa lama biasanya berlangsung dan apakah berkaitan dengan aktivitas fisik?', 'Biasanya 10-15 menit ketika sedang diam atau banyak pikiran, tidak konsisten saat beraktivitas. Nyeri badan juga berpindah dari hari ke hari.', true],
      ['q_redflag', 'rps', 'Ada nyeri dada saat aktivitas, sesak berat, pingsan, demam lama, berat badan turun, perdarahan, atau kelemahan satu sisi?', 'Tidak ada semua itu, Dok.', true],
      ['q_organik_zat', 'rpd', 'Ada mudah kepanasan, tangan gemetar, diare, atau memakai minuman energi, dekongestan, jamu, maupun zat stimulan?', 'Tidak ada. Saya hanya minum satu cangkir kopi sehari dan tidak memakai obat atau zat stimulan.', true],
      ['q_riwayat_periksa', 'rpd', 'Pemeriksaan apa yang sudah dilakukan, apakah hasilnya dibawa, dan penyakit apa yang paling Anda khawatirkan?', 'Saya membawa hasil dua bulan lalu: EKG, darah rutin, gula darah, dan TSH dalam batas normal. Saya takut ada penyakit jantung atau kanker yang terlewat, tetapi belum memahami arti hasilnya.', true],
      ['q_fungsi', 'sosial', 'Seberapa jauh keluhan memengaruhi pekerjaan, aktivitas, dan kunjungan berobat?', 'Saya izin kerja sekitar tiga hari setiap bulan dan sudah berkonsultasi di beberapa klinik karena belum merasa mengerti penyebabnya.', true],
      ['q_jiwa_keselamatan', 'rps', 'Selain khawatir tentang kesehatan, ada sedih menetap atau kehilangan minat, serangan takut mendadak, penggunaan alkohol atau zat, maupun pikiran menyakiti diri?', 'Tidak ada sedih menetap, kehilangan minat, serangan takut mendadak, alkohol atau zat, dan tidak ada pikiran menyakiti diri.', true],
      ['q_konteks_tujuan', 'sosial', 'Kapan keluhan terasa memburuk, dan perubahan apa yang paling ingin Anda capai?', 'Keluhan lebih terasa saat konflik keluarga atau pekerjaan memuncak, tetapi juga bisa muncul ketika suasana tenang. Saya ingin kembali bekerja lebih teratur dan tidak terus-menerus takut.', true],
    ],
    fisik: [
      ['umum', 'Tampak cemas namun kooperatif; status gizi baik, tanpa pucat atau tremor.'],
      ['jantung', 'Nadi reguler, bunyi jantung normal, tanpa murmur.'],
      ['kepala_leher', 'Tiroid tidak membesar dan tidak nyeri.'],
      ['neurologis', 'Status neurologis normal tanpa defisit fokal.'],
    ],
    diagnosisBanding: ['F45', 'F41.1', 'E05.9'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [
        { id: 'diazepam_2', alasan: 'Benzodiazepin rutin tidak memperbaiki pola keluhan fisik persisten dan berisiko sedasi serta ketergantungan.', bahaya: 'nonPrimer' },
        { id: 'fluoksetin_20', alasan: 'SSRI tidak diberikan otomatis hanya karena ada keluhan fisik dan kekhawatiran. Gunakan hanya bila diagnosis depresi atau kecemasan komorbid telah ditegakkan dan memang memenuhi indikasi.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['validasi_penjelasan_somatik', 'perawatan_terjadwal_somatik', 'aktivitas_redflag_somatik'],
      edukasiKritis: ['validasi_penjelasan_somatik', 'perawatan_terjadwal_somatik'],
    },
    clue: 'Enam bulan keluhan fisik yang menimbulkan distress, perhatian kesehatan menetap, kunjungan berulang, dan gangguan fungsi mendukung F45 setelah riwayat, pemeriksaan, serta red flag dinilai secara proporsional. Ini diagnosis berbasis fitur positif, bukan kesimpulan bahwa hasil normal berarti keluhan psikologis. Tinjau hasil lama dan ulangi pemeriksaan hanya bila ada indikasi baru. Validasi bahwa gejala nyata; bahas hubungan tubuh, emosi, dan stres sebagai hipotesis bersama; sepakati satu klinisi, kontrol terjadwal, sasaran fungsi, serta aktivitas bertahap. Jangan memberi benzodiazepin atau antidepresan otomatis tanpa diagnosis komorbid yang jelas.',
    panduanResmi: `${PPK} Bab Gangguan Somatoform menjadi acuan dasar diagnosis-spesifik: singkirkan penyebab organik dan gangguan jiwa lain secara proporsional, hindari pemeriksaan atau rujukan yang tidak perlu, bangun kemitraan, dan jadwalkan tindak lanjut singkat berkala. Pedoman Penyelenggaraan Kesehatan Jiwa di FKTP Kemenkes 2020 memberi konteks layanan primer, tetapi bukan bab diagnosis-spesifik. PNPK Kedokteran Jiwa 2015 tidak memiliki bab somatoform tersendiri dan tidak dipakai sebagai sumber langsung kasus ini.`,
    catatanRealita: 'Asesmen, penjelasan kolaboratif, skrining keselamatan, sasaran fungsi, dan kontrol terjadwal dapat dimulai di FKTP tanpa alat khusus. Sukamaju tidak mengasumsikan psikolog selalu tersedia; psikoterapi atau konsultasi SpKJ memakai jejaring bila fungsi terganggu berat, diagnosis meragukan, ada komorbid/risiko keselamatan, atau respons buruk. Gejala baru maupun pola yang berubah tetap membuka evaluasi medis ulang.',
    mutiaraEbm: 'ICD-11 mengganti logika lama "tidak terjelaskan secara medis" dengan bodily distress disorder: gejala dapat hidup bersama penyakit fisik, sedangkan perhatian berlebihan, distress, persistensi, dan dampak fungsi menjadi pusat diagnosis. Kode F45 tetap dipakai di game karena katalog SKDI dan PPK Indonesia. Intervensi berbasis prinsip CBT dapat dipertimbangkan, tetapi rekomendasi WHO bersifat kondisional dengan mutu bukti sangat rendah; systematic review komunikasi primer juga belum menemukan satu skrip yang pasti unggul. Karena itu tujuan encounter adalah kemitraan, penjelasan yang dapat diterima, kontinuitas, dan pemulihan fungsi, bukan memaksakan reatribusi.',
    sumber: [
      {
        id: 'ppk_fktp_2022',
        label: 'KMK 1186/2022 - PPK Dokter di FKTP (indeks publik)',
        url: 'https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/',
        tahun: 2022,
        jenis: 'pedoman_indonesia',
      },
      {
        id: 'kemenkes_keswa_fktp_2020',
        label: 'Kemenkes 2020 - Pedoman Penyelenggaraan Kesehatan Jiwa di FKTP',
        url: 'https://ayosehat.kemkes.go.id/buku-pedoman-penyelenggaraan-kesehatan-jiwa-di-fasilitas-kesehatan-tingkat-pertama',
        tahun: 2020,
        jenis: 'pedoman_indonesia',
      },
      {
        id: 'who_icd11_cddr_2024',
        label: 'WHO ICD-11 CDDR 2024 - Bodily Distress Disorder',
        url: 'https://www.who.int/publications/i/item/9789240077263',
        tahun: 2024,
        jenis: 'evidence_internasional',
      },
      {
        id: 'who_mhgap_ig2_2016',
        label: 'WHO mhGAP Intervention Guide v2 - Bodily Distress Complaints',
        url: 'https://www.who.int/publications/i/item/9789241549790',
        tahun: 2016,
        jenis: 'evidence_internasional',
      },
      {
        id: 'who_bodily_distress_cbt_2012',
        label: 'WHO - CBT-principle Treatment for Bodily Distress Complaints',
        url: 'https://www.who.int/teams/mental-health-and-substance-use/treatment-care/mental-health-gap-action-programme/evidence-centre/other-significant-emotional-and-medical-unexplained-somatic-complaints/psychological-treatment-based-on-cognitive-behavioural-therapy-principles-for-managing-medically-unexplained-somatic-complaints',
        tahun: 2012,
        jenis: 'evidence_internasional',
      },
      {
        id: 'german_s3_functional_somatic_2019',
        label: 'German S3 Guideline 2019 - Functional Somatic Symptoms',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31554544/',
        tahun: 2019,
        jenis: 'evidence_internasional',
      },
      {
        id: 'plos_mus_communication_2022',
        label: 'PLOS One 2022 - Primary-care Communication Interventions Systematic Review',
        url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0277538',
        tahun: 2022,
        jenis: 'evidence_internasional',
      },
    ],
  }),

  buatKasusFktpLab({
    id: 'lab_benda_asing_konjungtiva', nama: 'Benda Asing Konjungtiva Superfisial', icd10: 'T15.1', kategori: 'mata',
    keluhanUtama: 'Mata kanan terasa mengganjal setelah sekam tertiup angin saat berkebun tadi pagi.', usia: [18, 60], vital: { td: '122/76', nadi: 80, rr: 18, suhu: 36.6, spo2: 99 },
    pembuka: ['Apa yang masuk ke mata, kapan kejadiannya, dan bagaimana benda itu mengenai mata?', 'Sekam tertiup angin ke mata kanan saat saya berkebun tadi pagi. Tidak ada mesin atau benturan; saya tidak memakai kacamata pelindung.'],
    pertanyaan: [
      ['q_gejala_redflag', 'rps', 'Penglihatan menurun, nyeri berat, silau hebat, sulit membuka mata, atau keluar kotoran?', 'Penglihatan tetap jelas. Mata hanya mengganjal, agak merah, dan berair; tidak ada nyeri berat, silau hebat, atau kotoran.', true],
      ['q_mekanisme', 'rps', 'Apakah ada bahan kimia, pecahan logam atau kaca, pukulan, maupun serpihan yang melaju cepat?', 'Tidak ada. Hanya satu sekam yang tertiup angin biasa.', true],
      ['q_lensa_riwayat', 'rpd', 'Apakah memakai lensa kontak, pernah operasi atau suntikan mata, atau sebelumnya penglihatan mata kanan memang kurang?', 'Tidak memakai lensa kontak, tidak pernah operasi atau suntikan mata, dan sebelumnya penglihatan kedua mata sama baik.', true],
      ['q_tindakan_awal', 'rpd', 'Setelah kejadian, apakah mata digosok, dibilas, atau diberi obat tetes?', 'Sempat saya gosok sekali lalu saya bilas dengan air bersih. Belum memakai obat tetes.', true],
    ],
    fisik: [
      ['mata', 'Sebelum ekstraksi: visus setara kedua mata; pupil bulat-reaktif dan bilik depan tampak tenang. Setelah kelopak atas dieversi, satu sekam longgar tampak di konjungtiva tarsal. Fluorescein tidak menunjukkan defek epitel kornea dan uji Seidel negatif.'],
      ['umum', 'Kondisi umum baik.', false],
    ],
    diagnosisBanding: ['T15.1', 'S05.0', 'H16.0'],
    tatalaksana: {
      obatBenar: [],
      obatOpsional: ['kloramfenikol_tetes_mata'],
      prosedur: ['ekstraksi_benda_asing_konjungtiva'],
      edukasi: ['perawatan_pasca_benda_asing_mata', 'perlindungan_mata', 'tanda_bahaya'],
      edukasiKritis: ['perawatan_pasca_benda_asing_mata', 'tanda_bahaya'],
    },
    clue: 'Sekam berkecepatan rendah yang tampak longgar di konjungtiva tarsal, dengan visus utuh, pupil normal, tanpa defek kornea, dan tanpa tanda penetrasi, dapat ditangani di FKTP. Catat visus sebelum anestetik, eversi kelopak, gunakan irigasi atau cotton bud steril lembap untuk benda yang jelas superfisial, lalu ulangi fluorescein setelah pengangkatan untuk memastikan tidak ada sisa, defek baru, atau kebocoran. Jangan melakukan probing atau upaya berulang bila benda tertanam, berada di kornea/sumbu visual, melawan saat disentuh, atau mekanismenya mencurigakan. Kloramfenikol topikal boleh dipertimbangkan bila terdapat defek epitel atau risiko infeksi yang bermakna, tetapi bukan pengganti ekstraksi lengkap dan tindak lanjut.',
    panduanResmi: `${PPK} Bab Benda Asing di Konjungtiva menjadi acuan dasar: nilai visus, angkat benda superfisial dengan anestetik topikal dan alat yang sesuai, beri safety-net, serta rujuk bila visus turun atau benda tidak dapat dikeluarkan. Kode klinis T15.1 dipakai karena lokasi benda sudah teridentifikasi di sakus/konjungtiva tarsal; T15.9 tetap dipertahankan hanya sebagai kode katalog SKDI yang generik. RACGP 2026 menambahkan fluorescein sebelum dan sesudah tindakan, eversi kelopak, uji Seidel pasca-ekstraksi, kontrol 24-48 jam, dan ambang rujuk untuk penetrasi, benda tertanam/sentral, kerusakan kornea, infeksi, atau ekstraksi tidak lengkap.`,
    catatanRealita: 'Profil sukamaju_middle_v1 menyatakan lampu fokus, saline steril, anestetik topikal sekali pakai, fluorescein dengan cahaya biru, cotton bud steril, dan operator siap; slit lamp tidak diasumsikan. Hanya sekam longgar yang tampak di konjungtiva tarsal yang diangkat. Benda korneal/tertanam, resistensi, hasil tidak lengkap, atau red flag menghentikan upaya dan memicu rujuk.',
    mutiaraEbm: 'Material tumbuhan meningkatkan kewaspadaan terhadap infeksi, tetapi tidak otomatis mengubah setiap benda konjungtiva superfisial menjadi kasus rumah sakit. Penentu utamanya adalah mekanisme, lokasi, kedalaman, visus, defek kornea, tanda penetrasi, kemampuan ekstraksi lengkap, dan tindak lanjut. Panduan praktik masih kerap menganjurkan antibiotik topikal, sedangkan pembaruan Cochrane 2025 menilai kepastian bukti profilaksis pada abrasi kornea sangat rendah dan tidak mendukung satu regimen tertentu. Karena vignette ini tidak memiliki defek kornea, kloramfenikol diperlakukan sebagai opsi klinis, bukan syarat nilai. Anestetik topikal hanya dipakai saat pemeriksaan/tindakan dan tidak dibawa pulang.',
    sumber: [
      {
        id: 'ppk_fktp_2022',
        label: 'KMK 1186/2022 - PPK Dokter di FKTP (indeks publik)',
        url: 'https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/',
        tahun: 2022,
        jenis: 'pedoman_indonesia',
      },
      {
        id: 'racgp_ophthalmic_trauma_2026',
        label: 'RACGP 2026 - Ophthalmic Trauma: First-line Management in Primary Care',
        url: 'https://www1.racgp.org.au/getattachment/0445a2c2-26d7-482d-a7d6-ffbb58f659c0/Ophthalmic-trauma.aspx',
        tahun: 2026,
        jenis: 'evidence_internasional',
      },
      {
        id: 'college_optometrists_ocular_fb_2025',
        label: 'College of Optometrists 2025 - Superficial Ocular Foreign Body',
        url: 'https://www.college-optometrists.org/clinical-guidance/clinical-management-guidelines/corneal_orothersuperficialocular_foreignbody',
        tahun: 2025,
        jenis: 'evidence_internasional',
      },
      {
        id: 'cochrane_corneal_antibiotic_2025',
        label: 'Cochrane 2025 - Antibiotic Prophylaxis for Corneal Abrasion',
        url: 'https://pubmed.ncbi.nlm.nih.gov/41017778/',
        tahun: 2025,
        jenis: 'evidence_internasional',
      },
    ],
  }),

  buatKasusFktpLab({
    id: 'lab_perdarahan_subkonjungtiva', nama: 'Perdarahan Subkonjungtiva Spontan', icd10: 'H11.3', kategori: 'mata', prevalensi: 'sedang',
    keluhanUtama: 'Putih mata saya tiba-tiba merah seperti darah, tetapi tidak sakit.', usia: [25, 75], vital: { td: '146/88', nadi: 78, rr: 18, suhu: 36.5, spo2: 99 },
    pembuka: ['Kapan merahnya terlihat dan apa yang dirasakan?', 'Bangun tidur tadi terlihat bercak darah; tidak nyeri, tidak silau, dan penglihatan normal.'],
    pertanyaan: [
      ['q_trauma', 'rps', 'Ada benturan, mengucek kuat, batuk, muntah, atau mengejan?', 'Kemarin batuk keras beberapa kali.', true],
      ['q_visus', 'rps', 'Ada penglihatan turun, nyeri, sekret, atau silau?', 'Tidak ada semuanya.', true],
      ['q_obat', 'rpd', 'Minum pengencer darah atau mudah memar/berdarah?', 'Tidak minum pengencer darah dan tidak mudah memar.', true],
    ],
    fisik: [['mata', 'Bercak merah berbatas tegas di bawah konjungtiva bulbi; kornea jernih, pupil normal, visus utuh.'], ['jantung', 'Tekanan darah sedikit meningkat; irama reguler.', true]],
    diagnosisBanding: ['H11.3', 'H10.9', 'H15.1'],
    tatalaksana: { obatBenar: [], obatSalahUmum: [{ id: 'gentamisin_tetes_mata', alasan: 'Tidak ada infeksi bakteri; antibiotik tetes tidak mempercepat resorpsi darah.', bahaya: 'nonPrimer' }], edukasi: ['kontrol_rutin', 'tanda_bahaya'] },
    clue: 'Bercak darah tanpa nyeri, fotofobia, sekret, atau penurunan visus khas perdarahan subkonjungtiva dan umumnya pulih sendiri 1-2 minggu. Ukur tekanan darah serta telusuri trauma, antikoagulan, atau gangguan perdarahan bila berulang.',
    panduanResmi: `${PPK} Rujuk bila trauma berat, gangguan visus, nyeri, kekambuhan, atau kecurigaan gangguan sistemik.`,
  }),

  buatKasusFktpLab({
    id: 'lab_mata_kering', nama: 'Mata Kering', icd10: 'H04.1', kategori: 'mata', prevalensi: 'tinggi',
    keluhanUtama: 'Kedua mata terasa berpasir dan cepat lelah saat bekerja di depan layar.', usia: [25, 70], vital: { td: '120/76', nadi: 76, rr: 18, suhu: 36.5, spo2: 99 },
    pembuka: ['Kapan rasa mengganjal muncul dan apa pemicunya?', 'Makin terasa sore setelah menatap layar dan berada di ruangan ber-AC.'],
    pertanyaan: [
      ['q_redflag', 'rps', 'Ada nyeri tajam, silau berat, sekret kental, atau penglihatan mendadak turun?', 'Tidak ada.', true],
      ['q_obat', 'rpd', 'Memakai lensa kontak atau obat antihistamin/antikolinergik?', 'Kadang minum obat alergi dan tidak memakai lensa kontak.', true],
      ['q_sistemik', 'rpd', 'Ada mulut sangat kering, nyeri sendi, atau penyakit autoimun?', 'Tidak ada.', false],
    ],
    fisik: [['mata', 'Visus baik; tear meniscus berkurang, hiperemia ringan bilateral, kornea jernih.'], ['kepala_leher', 'Mukosa mulut lembap; tidak ada pembesaran kelenjar.', false]],
    diagnosisBanding: ['H04.1', 'H10.9', 'H01.0'],
    tatalaksana: { obatBenar: ['air_mata_buatan'], edukasi: ['perlindungan_mata', 'kontrol_rutin'] },
    clue: 'Gejala bilateral berpasir yang memburuk saat screen-time/AC tanpa red flag mendukung dry eye. Gunakan lubrikan, jeda berkedip, koreksi faktor lingkungan dan obat; rujuk bila nyeri, defek kornea, atau refrakter.',
    panduanResmi: `${PPK} Air mata buatan dan modifikasi faktor pencetus menjadi terapi awal.`,
  }),

  buatKasusFktpLab({
    id: 'lab_blefaritis_anterior', nama: 'Blefaritis Anterior', icd10: 'H01.0', kategori: 'mata', prevalensi: 'sedang',
    keluhanUtama: 'Kelopak mata gatal dan berkerak setiap bangun tidur.', usia: [18, 75], vital: { td: '118/74', nadi: 76, rr: 18, suhu: 36.6, spo2: 99 },
    pembuka: ['Bagaimana keluhan pada kelopak dan sejak kapan?', 'Dua minggu tepi kelopak gatal, terasa panas, dan ada kerak di pangkal bulu mata.'],
    pertanyaan: [
      ['q_visus', 'rps', 'Ada nyeri dalam mata, silau, atau penglihatan turun?', 'Tidak; hanya tepi kelopak yang mengganggu.', true],
      ['q_kulit', 'rpd', 'Ada ketombe, rosasea, atau keluhan berulang?', 'Saya memang berketombe dan pernah kambuh ringan.', true],
      ['q_kontak', 'sosial', 'Memakai riasan mata atau lensa kontak?', 'Sering memakai riasan mata.', false],
    ],
    fisik: [['mata', 'Skuama dan krusta di pangkal bulu mata bilateral, hiperemia tepi palpebra, kornea jernih.'], ['kulit', 'Skuama seboroik ringan di kulit kepala.', true]],
    diagnosisBanding: ['H01.0', 'H00.0', 'H10.9'],
    tatalaksana: { obatBenar: [], obatOpsional: ['air_mata_buatan'], edukasi: ['higiene_kelopak_mata', 'kontrol_rutin'] },
    clue: 'Krusta tepi kelopak kronik dengan kornea dan visus normal mendukung blefaritis. Terapi utama adalah kompres hangat dan higiene kelopak konsisten; antibiotik topikal tidak rutin dan hanya dipertimbangkan pada komponen bakterial terpilih.',
    panduanResmi: `${PPK} Evaluasi kelainan kornea dan rujuk bila tidak membaik atau terjadi komplikasi.`,
  }),

  buatKasusFktpLab({
    id: 'lab_trikiasis', nama: 'Trikiasis Tanpa Komplikasi Kornea', icd10: 'H02', kategori: 'mata',
    keluhanUtama: 'Bulu mata bawah seperti menusuk mata dan membuat berair.', usia: [35, 80], vital: { td: '126/78', nadi: 76, rr: 18, suhu: 36.5, spo2: 99 },
    pembuka: ['Sejak kapan terasa tertusuk dan apakah penglihatan berubah?', 'Seminggu ini terasa menggesek saat berkedip; penglihatan tetap jelas.'],
    pertanyaan: [
      ['q_redflag', 'rps', 'Ada nyeri berat, silau, atau penglihatan turun?', 'Tidak ada.', true],
      ['q_riwayat', 'rpd', 'Pernah operasi kelopak, trauma, atau infeksi mata berulang?', 'Tidak pernah operasi; pernah radang kelopak beberapa kali.', true],
      ['q_satu', 'rps', 'Satu atau banyak bulu mata yang mengarah ke dalam?', 'Tampaknya dua helai di kelopak bawah.', false],
    ],
    fisik: [['mata', 'Dua silia palpebra inferior mengarah ke kornea; visus normal, fluorescein tanpa defek epitel.']],
    diagnosisBanding: ['H02', 'H01.0', 'H16.0'],
    tatalaksana: { obatBenar: ['air_mata_buatan'], prosedur: ['epilasi_trikiasis'], edukasi: ['perlindungan_mata', 'tanda_bahaya'] },
    clue: 'Silia yang menggesek permukaan mata dengan posisi kelopak normal adalah trikiasis. Epilasi memberi kelegaan sementara; evaluasi kornea dan rujuk untuk terapi definitif bila berulang atau luas.',
    panduanResmi: `${PPK} Kerusakan kornea atau kelainan palpebra kompleks memerlukan layanan mata.`,
    catatanRealita: 'Lampu pemeriksaan, fluorescein, pinset epilasi steril, dan operator terlatih dinyatakan ready pada encounter ini. Epilasi hanya tindakan sementara untuk dua silia yang terlihat; abrasi kornea, entropion, penyakit luas, atau kekambuhan memerlukan jejaring mata.',
  }),

  buatKasusFktpLab({
    id: 'lab_episkleritis_ringan', nama: 'Episkleritis Sederhana', icd10: 'H15.1', kategori: 'mata',
    keluhanUtama: 'Sebagian putih mata kiri merah dan agak ngilu sejak kemarin.', usia: [20, 60], vital: { td: '120/74', nadi: 78, rr: 18, suhu: 36.6, spo2: 99 },
    pembuka: ['Merahnya menyeluruh atau setempat, dan seberapa sakit?', 'Hanya satu sektor, rasa tidak nyaman ringan, tidak sampai sakit dalam.'],
    pertanyaan: [
      ['q_visus', 'rps', 'Ada silau berat atau penglihatan menurun?', 'Tidak ada.', true],
      ['q_sekret', 'rps', 'Ada kotoran mata kental atau kelopak lengket?', 'Tidak ada.', true],
      ['q_autoimun', 'rpd', 'Ada nyeri sendi, sariawan berulang, atau penyakit autoimun?', 'Tidak ada.', false],
    ],
    fisik: [['mata', 'Injeksi sektoral superfisial, nyeri tekan minimal, kornea jernih, pupil dan visus normal.']],
    diagnosisBanding: ['H15.1', 'H10.9', 'H15.0'],
    tatalaksana: { obatBenar: [], obatOpsional: ['air_mata_buatan', 'ibuprofen_400'], edukasi: ['kontrol_rutin', 'tanda_bahaya'] },
    clue: 'Kemerahan sektoral superfisial dengan rasa tidak nyaman ringan dan visus normal mendukung episkleritis, yang sering pulih sendiri. Sakit dalam, fotofobia, rona keunguan, atau penurunan visus mengarah ke skleritis/uveitis dan memerlukan evaluasi mata segera.',
    panduanResmi: `${PPK} Terapi simptomatik dapat diberikan; telusuri penyakit sistemik pada kekambuhan.`,
  }),

  ...[
    {
      id: 'lab_hipermetropia', nama: 'Hipermetropia', icd10: 'H52.0', usia: [8, 45] as const,
      keluhan: 'Mata cepat lelah dan kepala sakit saat membaca dekat.', pembuka: 'Keluhan terutama saat membaca; melihat jauh masih cukup jelas.',
      fisik: 'Visus dekat menurun dan membaik dengan lensa sferis plus; segmen anterior normal.', banding: ['H52.0', 'H52.4', 'H52.2'],
      clue: 'Keluhan dekat dengan perbaikan lensa plus mendukung hipermetropia. Koreksi optik ditentukan melalui refraksi, bukan sekadar memilih kacamata baca acak.',
    },
    {
      id: 'lab_miopia_ringan', nama: 'Miopia Ringan', icd10: 'H52.1', usia: [8, 35] as const,
      keluhan: 'Tulisan di papan tampak kabur, tetapi membaca dekat jelas.', pembuka: 'Kabur terutama saat melihat jauh dan membaik bila menyipitkan mata.',
      fisik: 'Visus jauh menurun dan membaik dengan pinhole/lensa sferis minus; mata lain normal.', banding: ['H52.1', 'H52.0', 'H52.2'],
      clue: 'Kabur jauh yang membaik dengan pinhole dan lensa minus mendukung miopia. Perubahan cepat, anisometropia berat, atau kelainan fundus memerlukan evaluasi mata.',
    },
    {
      id: 'lab_astigmatisme_ringan', nama: 'Astigmatisme Ringan', icd10: 'H52.2', usia: [10, 50] as const,
      keluhan: 'Tulisan jauh dan dekat tampak berbayang dan mata cepat lelah.', pembuka: 'Garis tertentu tampak lebih kabur dan sakit kepala muncul setelah membaca.',
      fisik: 'Visus membaik sebagian dengan pinhole dan terkoreksi dengan lensa silinder; kornea jernih.', banding: ['H52.2', 'H52.1', 'H52.0'],
      clue: 'Distorsi pada berbagai jarak dan koreksi lensa silinder mendukung astigmatisme. Refraksi objektif/subjektif diperlukan untuk resep yang presisi.',
    },
    {
      id: 'lab_presbiopia', nama: 'Presbiopia', icd10: 'H52.4', usia: [42, 75] as const,
      keluhan: 'Saya harus menjauhkan tulisan agar bisa dibaca.', pembuka: 'Keluhan dekat memburuk perlahan sejak usia pertengahan, sedangkan jauh tetap jelas.',
      fisik: 'Visus jauh baik; titik dekat menjauh dan membaik dengan adisi lensa plus sesuai usia.', banding: ['H52.4', 'H52.0', 'H52.1'],
      clue: 'Penurunan akomodasi progresif setelah usia sekitar 40 tahun dengan visus jauh baik adalah presbiopia. Tentukan adisi setelah menilai refraksi jauh dan kebutuhan kerja.',
    },
  ].map((refraksi) => buatKasusFktpLab({
    id: refraksi.id, nama: refraksi.nama, icd10: refraksi.icd10, kategori: 'mata', prevalensi: 'tinggi',
    keluhanUtama: refraksi.keluhan, usia: refraksi.usia, vital: { td: '120/76', nadi: 76, rr: 18, suhu: 36.5, spo2: 99 },
    pembuka: ['Kapan penglihatan kabur paling terasa?', refraksi.pembuka],
    pertanyaan: [
      ['q_redflag', 'rps', 'Ada nyeri, mata merah, kilatan cahaya, atau penurunan mendadak?', 'Tidak ada; perubahan berlangsung perlahan.', true],
      ['q_kacamata', 'rpd', 'Pernah memakai kacamata atau ada perubahan resep cepat?', 'Belum pernah dan tidak ada perubahan mendadak.', true],
      ['q_fungsi', 'sosial', 'Aktivitas apa yang paling terganggu?', 'Membaca dan pekerjaan harian menjadi lebih lambat.', false],
    ],
    fisik: [['mata', refraksi.fisik]], diagnosisBanding: refraksi.banding,
    tatalaksana: { obatBenar: [], prosedur: ['uji_visus_refraksi'], edukasi: ['adaptasi_kacamata', 'tanda_bahaya'] },
    clue: refraksi.clue, panduanResmi: `${PPK} Ukur visus dan lakukan koreksi optik; rujuk bila koreksi tidak memperbaiki atau ada kelainan organik.`,
    catatanRealita: 'Refraksi dan pembuatan lensa dapat dijadwalkan atau dilakukan melalui jejaring optometri; game tidak menganggap seluruh Puskesmas memiliki optik lengkap.',
  })),

  buatKasusFktpLab({
    id: 'lab_buta_senja_defisiensi_vitamin_a', nama: 'Buta Senja karena Defisiensi Vitamin A', icd10: 'H53.6', kategori: 'mata',
    keluhanUtama: 'Anak saya sering menabrak benda saat hari mulai gelap.', keluhanUtamaOlehPendamping: true, usia: [6, 12], vital: { nadi: 88, rr: 20, suhu: 36.7, spo2: 99 },
    pembuka: ['Sejak kapan penglihatan malam terganggu?', 'Dua bulan ini ia sulit melihat saat senja, tetapi siang hari masih bisa sekolah.'],
    pertanyaan: [
      ['q_diet', 'sosial', 'Bagaimana pola makan anak?', 'Sangat pilih-pilih dan hampir tidak pernah makan telur, hati, susu, atau sayur berwarna.', true],
      ['q_mata', 'rps', 'Mata kering, berbusa, nyeri, atau penglihatan siang turun?', 'Mata tampak agak kering, tidak nyeri.', true],
      ['q_diare', 'rpd', 'Ada diare lama, penyakit hati, atau sulit menyerap makanan?', 'Tidak ada diare lama.', false],
    ],
    fisik: [['mata', 'Konjungtiva kering ringan, bercak Bitot kecil temporal, kornea masih jernih.'], ['umum', 'Berat badan menurut umur sedikit rendah.', true]],
    diagnosisBanding: ['H53.6', 'E50.5', 'H35.5'],
    tatalaksana: { obatBenar: ['vitamin_a_kapsul'], edukasi: ['gizi_seimbang', 'tanda_bahaya'] },
    clue: 'Sulit melihat saat senja disertai xerosis/Bitot dan diet miskin vitamin A mendukung xeroftalmia dini. Beri vitamin A sesuai usia/protokol dan perbaiki gizi; keterlibatan kornea memerlukan evaluasi mata pada hari yang sama.',
    panduanResmi: `${PPK} Buta senja memerlukan evaluasi defisiensi vitamin A dan penyebab mata/retina lain.`,
  }),

  buatKasusFktpLab({
    id: 'lab_infeksi_umbilikus_neonatus', nama: 'Infeksi Umbilikus dengan Tanda Sistemik', icd10: 'P38', kategori: 'kia',
    keluhanUtama: 'Tali pusat bayi bernanah, kulit sekitarnya merah, dan sejak pagi sulit menyusu.', keluhanUtamaOlehPendamping: true, usia: [0, 0], usiaBulan: [0, 1], vital: { nadi: 170, rr: 58, suhu: 38.1, spo2: 96 }, harusDirujuk: true, spesialisRujukan: 'anak',
    pembuka: ['Sejak kapan tali pusat berubah dan bagaimana minumnya?', 'Dua hari berbau dan bernanah; hari ini kemerahan melebar dan bayi hanya minum sedikit.'],
    pertanyaan: [
      ['q_bahaya', 'rps', 'Ada kejang, sangat mengantuk, muntah semua, kebiruan, atau napas berhenti?', 'Bayi lebih mengantuk tetapi tidak kejang atau kebiruan.', true],
      ['q_lahir', 'rpd', 'Lahir cukup bulan dan bagaimana persalinannya?', 'Lahir cukup bulan di fasilitas kesehatan.', true],
      ['q_perawatan', 'sosial', 'Apa yang dioleskan pada tali pusat?', 'Nenek menaburkan bubuk ramuan sejak pulang.', true],
    ],
    fisik: [['umum', 'Neonatus letargis ringan, perfusi memanjang 3 detik.'], ['abdomen', 'Pus dan bau dari umbilikus; eritema meluas sekitar 2 cm ke kulit periumbilikal.'], ['toraks_paru', 'Napas cepat tanpa retraksi berat.', true]],
    diagnosisBanding: ['P38', 'P36.9', 'L03.3'],
    tatalaksana: { obatBenar: [], prosedur: ['akses_iv_resusitasi', 'antibiotik_parenteral_neonatus_protokol', 'perawatan_tali_pusat', 'pemantauan_ketat_vital'], edukasi: ['perawatan_tali_pusat_kering', 'tanda_bahaya'], edukasiKritis: ['tanda_bahaya'], terapiKritis: ['antibiotik_parenteral_neonatus_protokol'] },
    stabilisasiWajib: ['akses_iv_resusitasi', 'antibiotik_parenteral_neonatus_protokol', 'pemantauan_ketat_vital'],
    clue: 'Pus umbilikus, eritema meluas, demam, sulit menyusu, letargi, dan perfusi memanjang pada neonatus adalah omfalitis dengan tanda infeksi sistemik dan risiko sepsis. Pertahankan kehangatan, pantau napas, perfusi, suhu, dan glukosa bila tersedia; pasang akses IV dengan cairan terukur sesuai kondisi, berikan antibiotik parenteral awal sesuai protokol neonatus/jejaring, lalu rujuk segera. Jangan mengganti jalur ini dengan obat oles, antibiotik oral, atau bolus cairan otomatis.',
    panduanResmi: `${PPK} PPK 1186/2022 menjadi acuan dasar untuk mengenali omfalitis yang meluas dan merujuk neonatus dengan tanda sistemik. WHO Recommendations for Management of Serious Bacterial Infections in Infants 0-59 Days 2024 menempatkan perawatan rumah sakit sebagai jalur utama; regimen rawat jalan tersederhana hanya dipakai ketika rujukan benar-benar tidak dapat dilakukan, bukan sebagai default FKTP.`,
    catatanRealita: 'Tombol antibiotik mewakili regimen parenteral neonatus yang sudah disepakati jejaring, bukan satu vial universal. Stok obat, dosis berbasis usia/berat, kemampuan mempertahankan suhu, pemantauan glukosa, dan transport harus dikonfirmasi; keterbatasan salah satunya mempercepat koordinasi rujuk, bukan membenarkan improvisasi.',
    mutiaraEbm: 'Infeksi tali pusat lokal tanpa tanda sistemik tidak boleh disamakan dengan skenario ini. Begitu muncul gangguan minum, letargi, demam atau hipotermia, gangguan perfusi, apnea, atau kejang, persoalannya bukan lagi sekadar membersihkan umbilikus: bayi harus diperlakukan sebagai infeksi bakteri serius sampai terbukti sebaliknya.',
  }),

  buatKasusFktpLab({
    id: 'lab_gonore_uretritis_pria', ambangKluster: 3, nama: 'Gonore Uretra Tanpa Komplikasi', icd10: 'A54.9', kategori: 'infeksi', prevalensi: 'sedang',
    keluhanUtama: 'Keluar nanah dari penis dan perih saat kencing sejak dua hari.', usia: [18, 55], jenisKelamin: 'L', vital: { td: '122/78', nadi: 82, rr: 18, suhu: 37.2, spo2: 99 },
    pembuka: ['Bagaimana cairan dan nyeri kencingnya?', 'Cairan kuning kental keluar spontan, terutama pagi, dan kencing terasa terbakar.'],
    pertanyaan: [
      ['q_pajanan', 'sosial', 'Kapan hubungan seksual terakhir dan apakah memakai kondom?', 'Lima hari lalu dengan pasangan baru tanpa kondom.', true],
      ['q_lokasi_pajanan', 'sosial', 'Selain penis, adakah pajanan oral atau anal, atau keluhan tenggorok dan rektum?', 'Tidak ada pajanan anal dan tidak ada keluhan tenggorok atau rektum.', true],
      ['q_komplikasi', 'rps', 'Ada nyeri atau bengkak testis, demam, nyeri sendi, atau ruam?', 'Tidak ada.', true],
      ['q_alergi', 'rpd', 'Ada alergi antibiotik?', 'Tidak ada alergi obat yang diketahui.', true],
    ],
    fisik: [['umum', 'Tidak demam dan kondisi umum baik.'], ['tht_mulut', 'Tidak ada lesi mukosa.', false], ['kulit', 'Sekret uretra mukopurulen; testis tidak nyeri atau bengkak.', true]],
    lab: [['tes_hiv_serial', 'Nonreaktif; hasil dini tidak menutup window period sehingga jadwal ulang ditentukan dari waktu pajanan dan risiko.', 'normal'], ['tes_sifilis', 'Nonreaktif; tetap perlu ulang sesuai window period dan risiko.', 'normal']],
    diagnosisBanding: ['A54.9', 'N34.2', 'A51'],
    tatalaksana: { obatBenar: ['ceftriaxone_1g_inj', 'doksisiklin_100'], edukasi: ['tindak_lanjut_gonore', 'layanan_pasangan_ims', 'pencegahan_ims_terintegrasi'], edukasiKritis: ['tindak_lanjut_gonore', 'layanan_pasangan_ims'] },
    clue: 'Duh uretra purulen akut setelah pajanan seksual sangat mendukung gonore. WHO 2024 merekomendasikan ceftriaxone 1 g IM dosis tunggal; tambahkan doxycycline 100 mg dua kali sehari selama tujuh hari bila klamidia belum disingkirkan. Tawarkan tes HIV/sifilis dan pemeriksaan lokasi ekstragenital sesuai pajanan. Hindari hubungan selama tujuh hari setelah terapi dosis tunggal dan sampai regimen tujuh hari selesai, gejala hilang, serta pasangan ditangani; jadwalkan retest sekitar tiga bulan karena reinfeksi sering terjadi.',
    panduanResmi: `${PPK} Permenkes 3/2026 mempertahankan Pasal 41 dan Lampiran Permenkes 23/2022 sebagai acuan dasar teknis program IMS, termasuk jejaring, surveilans resistensi, penanganan kasus, dan pencegahan stigma. WHO STI 2024 menjadi sumber dosis gonore terkini dan partner services yang sukarela serta rahasia.`,
    catatanRealita: 'Kode A54.9 dipertahankan agar konkordan dengan katalog SKDI-144, sedangkan fenotipenya uretritis gonokokus tanpa komplikasi. Sukamaju dapat memberi ceftriaxone IM dan doxycycline, tetapi kultur/NAAT serta uji resistensi berjalan melalui jejaring bila gagal terapi. Ambang klaster gameplay hanya memicu telaah agregat dan kewaspadaan program tanpa membuka identitas atau membuktikan wabah secara otomatis.',
  }),

  buatKasusFktpLab({
    id: 'lab_pielonefritis_tanpa_komplikasi', nama: 'Pielonefritis Akut Tanpa Komplikasi', icd10: 'N10', kategori: 'infeksi', prevalensi: 'sedang',
    keluhanUtama: 'Demam menggigil, nyeri pinggang kanan, dan perih saat kencing.', usia: [18, 45], jenisKelamin: 'P', vital: { td: '112/72', nadi: 102, rr: 20, suhu: 38.6, spo2: 99 },
    pembuka: ['Keluhan kencing dan nyeri pinggang mulai bagaimana?', 'Dua hari anyang-anyangan lalu demam dan pinggang kanan nyeri; saya masih bisa minum.'],
    pertanyaan: [
      ['q_hamil', 'rps', 'Apakah mungkin hamil atau haid terlambat?', 'Tidak; tes kehamilan hari ini negatif.', true],
      ['q_komplikasi', 'rpd', 'Ada batu, kelainan ginjal, diabetes, atau ISK berulang?', 'Tidak ada.', true],
      ['q_sepsis', 'rps', 'Ada bingung, pingsan, muntah semua, atau urine sangat sedikit?', 'Tidak ada; hanya mual ringan.', true],
    ],
    fisik: [['umum', 'Tampak sakit sedang, sadar penuh, hidrasi cukup.'], ['abdomen', 'Nyeri ketok CVA kanan positif, nyeri suprapubik ringan tanpa defans.']],
    lab: [['urinalisis', 'Leukosit esterase +++, nitrit positif, piuria dan bakteriuria.', 'abnormal'], ['tes_kehamilan', 'Negatif.', 'normal']],
    diagnosisBanding: ['N10', 'N30.0', 'N20.0'],
    tatalaksana: { obatBenar: ['ciprofloxacin_500', 'paracetamol_500'], edukasi: ['minum_air_cukup', 'kepatuhan_obat', 'tanda_bahaya'], edukasiKritis: ['tanda_bahaya'] },
    clue: 'Demam, gejala sistitis, dan nyeri CVA dengan piuria mendukung pielonefritis. Pasien tidak hamil, stabil, tanpa obstruksi/komorbid, dan dapat minum sehingga terapi rawat jalan dapat dipertimbangkan dengan evaluasi 48-72 jam; kultur/rujuk bila respons buruk.',
    panduanResmi: `${PPK} Rujuk bila urosepsis, obstruksi, kehamilan, muntah, fungsi ginjal terganggu, atau tidak membaik.`,
    catatanRealita: 'Pilihan empiris harus mengikuti pola resistensi lokal; vignette ini memakai opsi PPK pada pasien terseleksi tanpa komplikasi. Kreatinin dan kultur tidak diwajibkan onsite sebelum terapi pada pasien stabil tanpa faktor risiko; keduanya ditempuh lewat jejaring bila ada risiko, respons buruk, atau kekambuhan.',
  }),

  buatKasusFktpLab({
    id: 'lab_fimosis_patologis_ringan', nama: 'Fimosis Patologis Tanpa Retensi', icd10: 'N47.1', kategori: 'kia',
    keluhanUtama: 'Kulup anak sulit ditarik dan ujungnya menggelembung saat kencing.', keluhanUtamaOlehPendamping: true, usia: [5, 11], jenisKelamin: 'L', vital: { nadi: 84, rr: 20, suhu: 36.7, spo2: 99 },
    pembuka: ['Bagaimana aliran kencing dan sejak kapan?', 'Sekitar enam bulan ini pancarannya mengecil, tetapi masih keluar dan tidak pernah sampai tidak bisa kencing.'],
    pertanyaan: [
      ['q_infeksi', 'rps', 'Ada demam, nanah, nyeri berat, atau infeksi berulang?', 'Tidak ada demam; pernah merah ringan sekali.', true],
      ['q_paksa', 'sosial', 'Apakah kulup pernah ditarik paksa?', 'Kami pernah mencoba menarik kuat dan sejak itu ada cincin putih.', true],
      ['q_retensi', 'rps', 'Masih bisa kencing dan apakah kulup tersangkut di belakang kepala penis?', 'Masih bisa kencing dan kulup tidak tersangkut.', true],
    ],
    fisik: [['umum', 'Anak aktif dan tidak demam.'], ['kulit', 'Cincin preputium sempit dengan jaringan parut ringan; glans tidak dapat diekspos, tanpa edema akut.', true]],
    diagnosisBanding: ['N47.1', 'N47.2', 'N48.1'],
    // Audit CODEX 2026-08-04 (temuan 7): higiene_genital_lembut ber-tag
    // [Genital] menyebut douching (higiene vulvovaginal perempuan) — tak
    // berlaku pada anak laki-laki 5-11 th. Diganti topik yang justru jadi
    // poin ajar clue kasus ini: jangan tarik paksa.
    tatalaksana: { obatBenar: ['betametason_krim_005'], edukasi: ['jangan_tarik_paksa_kulup', 'tanda_bahaya'] },
    clue: 'Fimosis patologis dengan cincin fibrotik tetapi tanpa retensi atau infeksi berat dapat dicoba kortikosteroid topikal dan retraksi lembut terarah. Jangan menarik paksa; rujuk bila skar berat, infeksi berulang, gangguan berkemih, atau gagal terapi.',
    panduanResmi: `${PPK} Kortikosteroid topikal 0,05% selama beberapa minggu dan sirkumsisi terpilih adalah opsi.`,
  }),

  buatKasusFktpLab({
    id: 'lab_parafimosis_reduksibel', nama: 'Parafimosis Akut', icd10: 'N47.2', kategori: 'gawat',
    keluhanUtama: 'Kulup tertarik ke belakang dan tidak bisa kembali, kepala penis membengkak.', usia: [15, 70], jenisKelamin: 'L', vital: { td: '132/82', nadi: 96, rr: 20, suhu: 36.8, spo2: 99 },
    pembuka: ['Kapan kulup tersangkut dan masih bisa kencing?', 'Sejak enam jam setelah membersihkan penis; masih bisa kencing sedikit dan warna glans masih merah muda.'],
    pertanyaan: [
      ['q_iskemia', 'rps', 'Apakah warna menjadi biru/kehitaman, kebas, atau nyeri makin berat?', 'Belum; nyeri sedang dan tidak kebas.', true],
      ['q_prosedur', 'rps', 'Ada pemasangan kateter atau tindakan sebelumnya?', 'Tidak ada.', true],
      ['q_obat', 'rpd', 'Ada alergi obat atau gangguan perdarahan?', 'Tidak ada.', false],
    ],
    fisik: [['kulit', 'Preputium membentuk cincin konstriksi di belakang glans; edema sedang, glans hangat merah muda, perfusi masih baik.']],
    diagnosisBanding: ['N47.2', 'N47.1', 'N48.1'],
    // Audit CODEX 2026-08-04 (temuan 7): sama seperti fimosis di atas —
    // douching tak berlaku. Diganti topik perawatan pascareduksi, yang
    // memang belum terwakili topik mana pun.
    tatalaksana: { obatBenar: [], obatOpsional: ['ibuprofen_400'], prosedur: ['reduksi_parafimosis'], edukasi: ['pascareduksi_parafimosis', 'tanda_bahaya'] },
    clue: 'Parafimosis adalah kegawatan urologi. Beri analgesia, kompresi edema, lalu reduksi manual lembut; jangan menunda bila perfusi menurun. Reduksi gagal, jaringan iskemik, atau komplikasi memerlukan transfer urologi emergensi.',
    panduanResmi: `${PPK} Reduksi manual dilakukan segera; tindakan bedah diperlukan bila gagal.`,
    catatanRealita: 'Pada encounter ini pencahayaan, sarung tangan, kasa kompresi, pelumas steril, analgesia, serta operator terlatih dinyatakan ready. Lakukan satu upaya reduksi manual lembut; perfusi memburuk, nyeri tak terkendali, atau kegagalan upaya adalah alasan berhenti dan transfer tanpa manipulasi berulang.',
  }),

  buatKasusFktpLab({
    id: 'lab_sindrom_duh_genital_servisitis', ambangKluster: 3, nama: 'Servisitis Mukopurulen - Tata Laksana Sindromik', icd10: 'N89', kategori: 'infeksi',
    keluhanUtama: 'Keputihan kekuningan dan keluar darah sedikit setelah berhubungan.', usia: [18, 45], jenisKelamin: 'P', vital: { td: '118/74', nadi: 82, rr: 18, suhu: 37.1, spo2: 99 },
    pembuka: ['Bagaimana cairan, bau, dan keluhan penyertanya?', 'Cairan mukus-kuning dari vagina, tidak terlalu bau, disertai perih kencing ringan.'],
    pertanyaan: [
      ['q_pid', 'rps', 'Ada demam, nyeri perut bawah, mual, atau nyeri saat berhubungan?', 'Tidak ada nyeri perut atau demam.', true],
      ['q_pajanan', 'sosial', 'Ada pasangan baru atau hubungan tanpa kondom?', 'Ada pasangan baru dan tidak selalu memakai kondom.', true],
      ['q_hamil', 'rps', 'Apakah mungkin hamil?', 'Tidak, tes kehamilan negatif.', true],
      ['q_alergi', 'rpd', 'Ada alergi berat terhadap sefalosporin atau tetrasiklin?', 'Tidak ada alergi obat yang diketahui.', true],
    ],
    fisik: [['abdomen', 'Tidak ada nyeri tekan suprapubik atau defans.', true], ['kulit', 'Sekret mukopurulen dari serviks dan serviks mudah berdarah; tidak ada nyeri goyang serviks.', true]],
    lab: [['tes_kehamilan', 'Negatif.', 'normal'], ['tes_hiv_serial', 'Nonreaktif; ulang sesuai window period dan risiko.', 'normal'], ['tes_sifilis', 'Nonreaktif; ulang sesuai window period dan risiko.', 'normal']],
    diagnosisBanding: ['N89', 'A54.9', 'N76.0'],
    tatalaksana: { obatBenar: ['ceftriaxone_1g_inj', 'doksisiklin_100'], edukasi: ['tindak_lanjut_servisitis', 'layanan_pasangan_ims', 'pencegahan_ims_terintegrasi'], edukasiKritis: ['tindak_lanjut_servisitis', 'layanan_pasangan_ims'] },
    clue: 'Sekret mukopurulen endoserviks dan contact bleeding tanpa nyeri pelvis mendukung servisitis, bukan vaginitis atau PID. Pada pasien berisiko dengan pasangan baru, NAAT tidak tersedia, dan tindak lanjut belum pasti, terapi presumtif klamidia serta gonore masuk akal: doxycycline 100 mg dua kali sehari tujuh hari dan ceftriaxone IM sesuai pedoman gonore terkini. Tawarkan tes HIV/sifilis, nilai resolusi gejala, retest sekitar tiga bulan bila gonore/klamidia terdiagnosis, dan eskalasi segera bila muncul nyeri pelvis atau demam.',
    panduanResmi: 'PPK KMK 1186/2022 tidak mempunyai bab servisitis langsung; bab fluor albus hanya sumber terkait. Lampiran Permenkes 23/2022 yang dipertahankan oleh Permenkes 3/2026, WHO STI 2024, dan CDC cervicitis guidance melengkapi keputusan risiko, terapi presumtif, follow-up, dan layanan pasangan.',
    catatanRealita: 'Kode N89 dipertahankan agar konkordan dengan baris katalog SKDI-144, sedangkan fenotipe kasusnya adalah servisitis mukopurulen. NAAT gonore/klamidia tidak diasumsikan tersedia langsung di Sukamaju; spesimen dapat dirujuk tanpa menunda terapi sindromik pada pasien berisiko. Sinyal klaster memakai hitungan agregat terde-identifikasi dan harus ditelaah program sebelum intervensi wilayah.',
  }),

  buatKasusFktpLab({
    id: 'lab_vulvitis_iritan', nama: 'Vulvitis Iritan', icd10: 'N76.2', kategori: 'infeksi',
    keluhanUtama: 'Kulit kemaluan luar terasa perih dan merah setelah memakai sabun kewanitaan baru.', usia: [15, 65], jenisKelamin: 'P', vital: { td: '116/72', nadi: 78, rr: 18, suhu: 36.6, spo2: 99 },
    pembuka: ['Keluhan muncul setelah paparan apa dan apakah ada keputihan?', 'Mulai sehari setelah sabun baru; tidak ada keputihan berbau atau nyeri perut.'],
    pertanyaan: [
      ['q_infeksi', 'rps', 'Ada luka, lepuh, demam, keputihan kental, atau bau amis?', 'Tidak ada.', true],
      ['q_ims', 'sosial', 'Ada pasangan baru atau risiko IMS?', 'Tidak ada pasangan baru.', true],
      ['q_dm', 'rpd', 'Ada diabetes atau antibiotik baru-baru ini?', 'Tidak ada.', false],
    ],
    fisik: [['kulit', 'Eritema ringan simetris pada vulva yang terpapar; tanpa ulkus, vesikel, edema berat, atau sekret vagina.', true]],
    diagnosisBanding: ['N76.2', 'N76.0', 'B37.3'],
    tatalaksana: { obatBenar: [], obatOpsional: ['hidrokortison_krim'], edukasi: ['higiene_genital_lembut', 'tanda_bahaya'] },
    clue: 'Pola temporal setelah iritan dengan eritema eksternal dan tanpa discharge/lesi infeksi mendukung vulvitis iritan. Hentikan pemicu, cuci lembut, jaga kering; kortikosteroid potensi rendah dapat dipakai singkat pada inflamasi ringan.',
    panduanResmi: `${PPK} Penyebab infeksi dan IMS harus disingkirkan sebelum memberi terapi simptomatik.`,
  }),

  buatKasusFktpLab({
    id: 'lab_vaginitis_kandida', nama: 'Kandidiasis Vulvovaginal', icd10: 'B37.3', kategori: 'infeksi', prevalensi: 'sedang',
    keluhanUtama: 'Keputihan putih kental disertai gatal hebat.', usia: [15, 55], jenisKelamin: 'P', vital: { td: '118/74', nadi: 78, rr: 18, suhu: 36.7, spo2: 99 },
    pembuka: ['Bagaimana bentuk cairan, bau, dan rasa gatalnya?', 'Putih menggumpal seperti susu basi, tidak amis, dan gatal sekali.'],
    pertanyaan: [
      ['q_pid', 'rps', 'Ada demam, nyeri perut bawah, atau nyeri saat berhubungan?', 'Tidak ada.', true],
      ['q_risiko', 'rpd', 'Ada diabetes, hamil, antibiotik baru, atau kekambuhan sering?', 'Baru selesai antibiotik; tidak hamil dan tidak berulang.', true],
      ['q_ims', 'sosial', 'Ada pasangan baru atau luka genital?', 'Tidak ada.', false],
    ],
    fisik: [['kulit', 'Vulva eritematosa; discharge putih kental melekat, tanpa bau amis atau nyeri goyang serviks.', true]],
    lab: [['mikroskopis_gram_koh', 'KOH menunjukkan budding yeast dan pseudohifa.', 'abnormal']],
    diagnosisBanding: ['B37.3', 'N76.0', 'N76.2'],
    tatalaksana: { obatBenar: ['klotrimazol_vaginal_100'], edukasi: ['higiene_genital_lembut', 'kepatuhan_obat', 'tanda_bahaya'] },
    clue: 'Pruritus, eritema, discharge putih menggumpal tanpa bau amis, dan pseudohifa mendukung kandidiasis vulvovaginal. Gunakan azol intravaginal; evaluasi diabetes/kehamilan dan rujuk bila berat, rekuren, atau gagal.',
    panduanResmi: `${PPK} Vaginitis ditatalaksana sesuai etiologi, bukan semua keputihan diberi regimen yang sama.`,
    catatanRealita: 'Mikroskop, KOH, consumable, dan analis dinyatakan ready pada jadwal laboratorium encounter ini. Bila pemeriksaan tidak ready, gambaran klinis klasik tanpa red flag masih dapat ditangani sebagai kandidiasis tidak rumit dengan safety-net; kasus rekuren, berat, hamil, atau gagal terapi memerlukan konfirmasi/jejaring.',
  }),

  buatKasusFktpLab({
    id: 'lab_vaginosis_bakterialis', nama: 'Vaginosis Bakterialis', icd10: 'N76.0', kategori: 'infeksi', prevalensi: 'sedang',
    keluhanUtama: 'Keputihan encer abu-abu berbau amis, terutama setelah berhubungan.', usia: [15, 55], jenisKelamin: 'P', vital: { td: '116/72', nadi: 76, rr: 18, suhu: 36.6, spo2: 99 },
    pembuka: ['Bagaimana bau, warna, dan apakah terasa gatal?', 'Encer homogen abu-abu dan amis; hampir tidak gatal.'],
    pertanyaan: [
      ['q_pid', 'rps', 'Ada demam, nyeri perut bawah, atau nyeri hubungan?', 'Tidak ada.', true],
      ['q_hamil', 'rps', 'Apakah hamil atau mungkin hamil?', 'Tidak.', true],
      ['q_douching', 'sosial', 'Sering douching atau memakai pembersih vagina?', 'Ya, hampir setiap hari.', false],
    ],
    fisik: [['kulit', 'Discharge tipis homogen abu-abu; vulva tidak meradang dan tidak ada nyeri serviks.', true]],
    lab: [['mikroskopis_gram_koh', 'pH 5,2; whiff test positif dan clue cells ditemukan.', 'abnormal']],
    diagnosisBanding: ['N76.0', 'B37.3', 'N89'],
    tatalaksana: { obatBenar: ['metronidazol_500'], edukasi: ['higiene_genital_lembut', 'kepatuhan_obat', 'tanda_bahaya'] },
    clue: 'Tiga kriteria Amsel atau lebih mendukung vaginosis bakterialis: discharge homogen, pH >4,5, whiff positif, dan clue cells. Metronidazol adalah pilihan; hindari douching dan evaluasi kehamilan/IMS sesuai risiko.',
    panduanResmi: 'Bab vaginitis pada PPK FKTP 1186/2022 hanya menjadi acuan dasar terkait, bukan pedoman etiologi bakterial yang identik. CDC STI Treatment Guidelines memberi kriteria Amsel dan regimen metronidazol 500 mg dua kali sehari selama 7 hari untuk vaginosis bakterialis simptomatik.',
    catatanRealita: 'Pada encounter ini, pH strip, reagen whiff, dan mikroskop beserta operator dinyatakan siap. Bila mikroskop tidak tersedia, jangan mengarang clue cells: gunakan kriteria klinis yang benar-benar dapat dinilai, evaluasi diagnosis banding/IMS, dan manfaatkan jejaring bila diagnosis meragukan atau berulang.',
  }),

  buatKasusFktpLab({
    id: 'lab_salpingitis_pid_ringan', nama: 'Penyakit Radang Panggul Ringan - Rawat Jalan', icd10: 'N70', kategori: 'infeksi',
    keluhanUtama: 'Perut bawah nyeri, keputihan berubah, dan sakit saat berhubungan.', usia: [18, 45], jenisKelamin: 'P', vital: { td: '112/70', nadi: 94, rr: 20, suhu: 37.9, spo2: 99 },
    pembuka: ['Sejak kapan nyeri dan keputihan berubah?', 'Empat hari nyeri kedua sisi bawah perut dengan keputihan kuning.'],
    pertanyaan: [
      ['q_berat', 'rps', 'Ada muntah, demam tinggi, pingsan, atau nyeri sangat berat?', 'Tidak; saya masih bisa minum dan berjalan.', true],
      ['q_hamil', 'rps', 'Apakah mungkin hamil?', 'Tes kehamilan negatif.', true],
      ['q_pajanan', 'sosial', 'Ada pasangan baru atau hubungan tanpa kondom?', 'Ada pasangan baru tanpa kondom.', true],
      ['q_alergi', 'rpd', 'Ada alergi berat terhadap sefalosporin, tetrasiklin, atau metronidazol?', 'Tidak ada alergi obat yang diketahui.', true],
    ],
    fisik: [['abdomen', 'Nyeri tekan suprapubik bilateral tanpa defans atau massa.'], ['kulit', 'Sekret serviks mukopurulen dan nyeri goyang serviks/adneksa ringan.', true]],
    lab: [['tes_kehamilan', 'Negatif.', 'normal'], ['tes_hiv_serial', 'Nonreaktif; ulang sesuai window period dan risiko.', 'normal'], ['tes_sifilis', 'Nonreaktif; ulang sesuai window period dan risiko.', 'normal']],
    diagnosisBanding: ['N70', 'N73.9', 'O00.9'],
    tatalaksana: { obatBenar: ['ceftriaxone_1g_inj', 'doksisiklin_100', 'metronidazol_500'], edukasi: ['tindak_lanjut_pid', 'layanan_pasangan_ims', 'tanda_bahaya'], edukasiKritis: ['tindak_lanjut_pid', 'tanda_bahaya'] },
    clue: 'Nyeri pelvis dengan cervical motion/adnexal tenderness dan risiko IMS memenuhi ambang klinis rendah untuk PID setelah kehamilan ektopik serta penyebab bedah dinilai. Pasien stabil, tidak hamil, dapat minum, dan tanpa abses atau sepsis dapat menerima ceftriaxone IM sekali ditambah doxycycline serta metronidazole selama 14 hari. Perbaikan harus tampak dalam kurang dari 72 jam; bila tidak, rawat inap dan evaluasi diagnosis/regimen diperlukan. Tawarkan tes gonore/klamidia, HIV, dan sifilis, tata pasangan, serta retest sekitar tiga bulan bila gonore/klamidia terdiagnosis.',
    panduanResmi: `${PPK} PPK tidak mempunyai bab PID langsung. Permenkes 3/2026 mempertahankan Pasal 41 dan Lampiran Permenkes 23/2022 sebagai acuan dasar teknis jejaring IMS, sedangkan CDC STI guidance memberi kriteria rawat inap, regimen rawat jalan, evaluasi kurang dari 72 jam, retesting, dan partner management.`,
    catatanRealita: 'Kode N70 dipertahankan agar konkordan dengan katalog SKDI-144; kasus ini memodelkan PID ringan. Katalog menampilkan vial ceftriaxone 1 g, tetapi dosis IM aktual mengikuti protokol PID/IMS dan pemilihan vial tidak berarti seluruh isi selalu diberikan. NAAT dan ultrasonografi tidak diasumsikan tersedia di Sukamaju dan tidak boleh menunda terapi klinis atau rujukan bila memburuk.',
  }),

  buatKasusFktpLab({
    id: 'lab_abortus_spontan_komplit', nama: 'Abortus Spontan Komplit - Stabil', icd10: 'O03.9', kategori: 'kia',
    keluhanUtama: 'Saya hamil delapan minggu, tadi keluar jaringan, sekarang darah dan mulas jauh berkurang.', usia: [18, 45], jenisKelamin: 'P', vital: { td: '112/72', nadi: 84, rr: 18, suhu: 36.8, spo2: 99 },
    pembuka: ['Boleh ceritakan jumlah perdarahan dan jaringan yang keluar?', 'Tadi dua pembalut penuh lalu keluar jaringan utuh; sesudahnya hanya flek dan kram ringan.'],
    pertanyaan: [
      ['q_bahaya', 'rps', 'Masih perdarahan banyak, pusing, pingsan, demam, atau cairan berbau?', 'Tidak ada.', true],
      ['q_ektopik', 'rps', 'Ada nyeri tajam satu sisi atau nyeri bahu?', 'Tidak ada.', true],
      ['q_golongan', 'rpd', 'Tahu golongan darah/Rhesus dan ada penyakit perdarahan?', 'Golongan O rhesus positif; tidak ada gangguan perdarahan.', true],
    ],
    fisik: [['umum', 'Sadar, perfusi baik, tidak pucat berat.'], ['abdomen', 'Nyeri suprapubik minimal tanpa nyeri satu sisi atau defans.'], ['kulit', 'Perdarahan pervaginam minimal; serviks sudah menutup.', true]],
    lab: [['hb', 'Hb 11,4 g/dL.', 'normal'], ['golongan_darah', 'O rhesus positif.', 'normal']],
    diagnosisBanding: ['O03.9', 'O03.4', 'O00.9'],
    // Audit tag-vs-penyakit 2026-08-04: tanda_bahaya_kehamilan ber-tag
    // [Kehamilan]/P4K (program antenatal) diganti tanda_bahaya_pascakeguguran
    // — pasien ini SUDAH keguguran, bukan sedang hamil/bersiap bersalin.
    tatalaksana: { obatBenar: [], obatOpsional: ['paracetamol_500'], edukasi: ['tanda_bahaya_pascakeguguran', 'kontrol_rutin', 'gizi_seimbang'], edukasiKritis: ['tanda_bahaya_pascakeguguran'] },
    clue: 'Riwayat keluarnya jaringan diikuti penurunan perdarahan/nyeri, kondisi stabil, dan serviks menutup mendukung abortus komplit. Tidak ada indikasi memberi uterotonik atau misoprostol otomatis; pastikan follow-up dan rujuk/USG bila diagnosis tidak pasti, perdarahan menetap, infeksi, atau curiga ektopik.',
    panduanResmi: `${PPK} Abortus komplit stabil dapat diobservasi dengan konseling, tetapi ketidakpastian sisa jaringan atau ektopik harus dievaluasi.`,
    catatanRealita: 'USG tidak diasumsikan tersedia di Sukamaju; akses jejaring digunakan bila temuan klinis tidak meyakinkan.',
  }),

  buatKasusFktpLab({
    id: 'lab_ruptur_perineum_derajat_1', nama: 'Ruptur Perineum Derajat 1 dengan Perdarahan', icd10: 'O70.0', kategori: 'kia',
    keluhanUtama: 'Setelah persalinan normal, ada robekan dan darah terus merembes dari perineum.', usia: [18, 45], jenisKelamin: 'P', vital: { td: '110/70', nadi: 88, rr: 18, suhu: 36.8, spo2: 99 },
    pembuka: ['Bagaimana persalinan dan jumlah darah setelah bayi lahir?', 'Bayi lahir normal; rahim keras dan darah tidak banyak, tetapi robekan perineum terus merembes.'],
    pertanyaan: [
      ['q_pph', 'rps', 'Ada pusing, lemas berat, pembalut cepat penuh, atau gumpalan besar?', 'Tidak ada.', true],
      ['q_alergi', 'rpd', 'Ada alergi anestesi lokal atau obat?', 'Tidak ada.', false],
      ['q_riwayat', 'rpd', 'Pernah mengalami robekan persalinan berat atau gangguan perdarahan?', 'Tidak pernah.', false],
    ],
    fisik: [['umum', 'Ibu sadar, uterus berkontraksi baik, perfusi baik.'], ['kulit', 'Robekan mukosa vagina dan kulit perineum dengan rembesan aktif; otot perineum dan sfingter ani utuh, tanpa hematoma.', true]],
    diagnosisBanding: ['O70.0', 'O70.1', 'O72.1'],
    // Audit tag-vs-penyakit 2026-08-04: tanda_bahaya_kehamilan dibuang — bayi
    // sudah lahir, ibu tak lagi hamil. perawatan_perineum (label [Nifas])
    // sudah menutup poin ajar "kenali infeksi/perdarahan" pascasalin.
    tatalaksana: { obatBenar: ['paracetamol_500'], prosedur: ['jahit_perineum'], edukasi: ['perawatan_perineum'] },
    clue: 'Derajat 1 hanya melibatkan mukosa vagina dan kulit perineum. Robekan kecil tanpa perdarahan dapat sembuh tanpa jahitan, tetapi rembesan aktif pada skenario ini memerlukan pencahayaan, anestesi, hemostasis, dan penjahitan oleh tenaga kompeten; keterlibatan otot/sfingter atau hematoma besar mengubah derajat dan disposisi.',
    panduanResmi: `${PPK} Ruptur tingkat 1-2 dapat ditangani tenaga terlatih dengan set dan anestesi yang memadai.`,
    catatanRealita: 'Ruang tindakan, pencahayaan, anestesi lokal, set jahit steril, material jahit, dan operator kompeten dinyatakan ready pada encounter ini. Bila derajat tidak dapat dipastikan, sfingter/otot terlibat, perdarahan tidak terkontrol, atau resource tidak ready, lakukan hemostasis sementara dan rujuk tanpa jahitan buta.',
  }),

  buatKasusFktpLab({
    id: 'lab_abses_folikel_rambut', nama: 'Abses Folikel Rambut Superfisial', icd10: 'L02.9', kategori: 'kulit',
    keluhanUtama: 'Ada benjolan bernanah dan berdenyut di lipat paha.', usia: [16, 65], vital: { td: '120/76', nadi: 82, rr: 18, suhu: 36.9, spo2: 99 },
    pembuka: ['Benjolan berkembang bagaimana dan apakah demam?', 'Lima hari membesar, sekarang lunak di tengah; tidak demam.'],
    pertanyaan: [
      ['q_berat', 'rps', 'Kemerahan meluas cepat, nyeri hebat, atau banyak benjolan?', 'Tidak; hanya satu benjolan kecil.', true],
      ['q_risiko', 'rpd', 'Ada diabetes, imun lemah, atau abses berulang?', 'Tidak ada.', true],
      ['q_manipulasi', 'sosial', 'Sudah dipencet atau ditusuk?', 'Belum.', false],
    ],
    fisik: [['kulit', 'Nodul 2 cm fluktuatif dengan pustula sentral, eritema terbatas, tanpa selulitis luas.']],
    diagnosisBanding: ['L02.9', 'L73.2', 'L03.9'],
    tatalaksana: { obatBenar: [], obatOpsional: ['paracetamol_500'], prosedur: ['insisi_abses'], obatSalahUmum: [{ id: 'amoxicillin_500', alasan: 'Antibiotik rutin tidak menggantikan drainase pada abses kecil terlokalisasi tanpa selulitis atau faktor risiko.', bahaya: 'nonPrimer' }], edukasi: ['kebersihan_kulit', 'tanda_bahaya'] },
    clue: 'Abses terlokalisasi yang matang/fluktuatif memerlukan insisi dan drainase dengan teknik steril. Pada skenario ini antibiotik sistemik tidak diperlukan; selulitis, gejala sistemik, lokasi/komorbid berisiko, atau kegagalan drainase mengubah keputusan.',
    panduanResmi: 'Bab pioderma PPK FKTP 1186/2022 adalah acuan dasar terkait, bukan padanan abses identik. IDSA SSTI menempatkan insisi-drainase sebagai terapi primer abses kulit terlokalisasi; antibiotik sistemik ditambahkan menurut gejala sistemik, luas selulitis, gangguan pertahanan tubuh, lokasi berisiko, atau kegagalan terapi.',
  }),

  buatKasusFktpLab({
    id: 'lab_mastitis_laktasi', nama: 'Mastitis Laktasi Tanpa Abses', icd10: 'N61', kategori: 'kia', prevalensi: 'sedang',
    keluhanUtama: 'Payudara kanan merah, nyeri, dan saya demam sejak kemarin.', usia: [18, 45], jenisKelamin: 'P', vital: { td: '112/72', nadi: 96, rr: 18, suhu: 38.3, spo2: 99 },
    pembuka: ['Bagaimana nyeri dan proses menyusu sebelum keluhan?', 'Bayi sulit melekat dan payudara sering penuh; lalu satu bagian menjadi merah berbentuk baji.'],
    pertanyaan: [
      ['q_abses', 'rps', 'Ada benjolan lunak berisi cairan atau nanah dari puting?', 'Tidak ada.', true],
      ['q_berat', 'rps', 'Ada pingsan, muntah terus, atau sangat lemah?', 'Tidak.', true],
      ['q_alergi', 'rpd', 'Ada alergi penisilin?', 'Tidak ada.', true],
    ],
    fisik: [['umum', 'Demam, sadar, hidrasi baik.'], ['kulit', 'Eritema berbentuk baji, hangat dan nyeri; tidak ada fluktuasi.'], ['kepala_leher', 'Tidak ada limfangitis luas.', false]],
    diagnosisBanding: ['N61', 'O91.1', 'C50.9'],
    tatalaksana: { obatBenar: ['cefadroxil_500'], obatOpsional: ['paracetamol_500'], prosedur: ['konseling_laktasi'], edukasi: ['dukungan_laktasi', 'kepatuhan_obat', 'tanda_bahaya'] },
    clue: 'Nyeri-demam dengan eritema sektoral pada ibu menyusui mendukung mastitis. Lanjutkan pengosongan payudara/menyusui, koreksi latch, beri antibiotik antistafilokokus yang sesuai; USG/rujuk bila fluktuasi atau tidak membaik 24-48 jam.',
    panduanResmi: `${PPK} Menghentikan menyusui tanpa indikasi memperburuk stasis; abses memerlukan drainase.`,
  }),

  buatKasusFktpLab({
    id: 'lab_puting_lecet', nama: 'Cracked Nipple karena Perlekatan Buruk', icd10: 'O92.1', kategori: 'kia', prevalensi: 'sedang', // Deep research 2026-08-22: O92.13 hanya ICD-10-CM (digit ke-5 = episode laktasi, bukan lateralitas). Padanan WHO: O92.1 "Cracked nipple associated with childbirth".
    keluhanUtama: 'Puting lecet dan sangat sakit setiap bayi mulai menyusu.', usia: [18, 45], jenisKelamin: 'P', vital: { td: '110/70', nadi: 78, rr: 18, suhu: 36.7, spo2: 99 },
    pembuka: ['Kapan nyeri muncul dan bagaimana perlekatan bayi?', 'Nyeri paling hebat saat awal menyusu; mulut bayi hanya menangkap ujung puting.'],
    pertanyaan: [
      ['q_infeksi', 'rps', 'Ada demam, payudara merah berbaji, nanah, atau bayi punya bercak putih mulut?', 'Tidak ada.', true],
      ['q_trauma', 'rps', 'Ada pompa dengan tekanan tinggi atau sabun keras?', 'Saya sering membersihkan puting dengan sabun.', true],
      ['q_bayi', 'rps', 'Bayi tetap BAK dan berat badannya dipantau?', 'Masih BAK cukup. Berat badannya dipantau di Posyandu dan terakhir masih naik.', false],
    ],
    fisik: [['kulit', 'Fisura dangkal pada puting kanan tanpa pus, eritema sektoral, atau massa payudara.']],
    diagnosisBanding: ['O92.1', 'N61', 'B37.8'],
    tatalaksana: { obatBenar: [], prosedur: ['konseling_laktasi'], edukasi: ['dukungan_laktasi', 'tanda_bahaya'] },
    clue: 'Fisura puting paling sering disebabkan perlekatan dangkal. Observasi satu sesi menyusu dan koreksi posisi adalah terapi utama; hindari sabun/iritan, pertahankan menyusui atau perah nyaman, dan evaluasi infeksi bila tidak membaik.',
    panduanResmi: `${PPK} Puting lecet ditangani dengan koreksi teknik menyusui, bukan menghentikan ASI secara otomatis.`,
  }),

  buatKasusFktpLab({
    id: 'lab_puting_tenggelam_laktasi', nama: 'Inverted Nipple dengan Kesulitan Laktasi', icd10: 'O92.0', kategori: 'kia', // Deep research 2026-08-22: O92.03 hanya ICD-10-CM. Padanan WHO: O92.0 "Retracted nipple associated with childbirth".
    keluhanUtama: 'Puting masuk ke dalam dan bayi baru lahir sulit melekat.', usia: [18, 45], jenisKelamin: 'P', vital: { td: '110/70', nadi: 76, rr: 18, suhu: 36.6, spo2: 99 },
    pembuka: ['Apakah puting sudah masuk sejak dulu dan bagaimana minum bayi?', 'Sejak sebelum hamil; bayi baru dua hari, mencoba menyusu tetapi mudah lepas.'],
    pertanyaan: [
      ['q_bahaya_bayi', 'rps', 'Bayi sangat mengantuk, tidak BAK, atau tidak mau minum sama sekali?', 'Tidak; masih mau mencoba dan sudah BAK.', true],
      ['q_baru', 'rps', 'Apakah hanya satu sisi dan baru tertarik masuk belakangan?', 'Kedua sisi sejak lama, bukan perubahan baru.', true],
      ['q_nyeri', 'rps', 'Ada luka, massa, atau darah dari puting?', 'Tidak ada.', false],
    ],
    fisik: [['kulit', 'Puting bilateral terinversi tetapi dapat dieversi sementara; tidak ada massa, inflamasi, atau discharge patologis.']],
    diagnosisBanding: ['O92.0', 'N64.5', 'C50.9'],
    tatalaksana: { obatBenar: [], prosedur: ['konseling_laktasi'], edukasi: ['dukungan_laktasi', 'asi_eksklusif', 'tanda_bahaya'] },
    clue: 'Puting terinversi lama tanpa massa tidak mencegah laktasi bila posisi, sandwich hold, stimulasi sebelum menyusu, dan dukungan intensif diberikan. Hindari tindakan traumatik; pantau transfer ASI dan berat bayi.',
    panduanResmi: `${PPK} Pendampingan menyusui menjadi inti; inversi baru unilateral atau disertai massa perlu evaluasi lebih lanjut.`,
  }),

  buatKasusFktpLab({
    // Episode ini sengaja dimulai dengan masalah kendali yang memerlukan review
    // spesialis. Rujukan yang berhasil kemudian mengaktifkan kunjungan PRB.
    id: 'lab_dm_tipe1_stabil_prb', bisaPrb: true, harusDirujuk: true, spesialisRujukan: 'anak', nama: 'DM Tipe 1 Remaja: Review Spesialis lalu PRB', icd10: 'E10', kategori: 'metabolik',
    keluhanUtama: 'Gula saya naik-turun dan dua malam ini ibu harus membangunkan saya karena gula terlalu rendah.', usia: [15, 17], vital: { td: '112/70', nadi: 82, rr: 18, suhu: 36.6, spo2: 99, gds: 212 },
    pembuka: ['Apa yang terjadi pada gula harian dan dosis insulin belakangan ini?', 'Di resume rumah sakit tertulis HbA1c saya 8,6%. Dua malam lalu gula saya 52 mg/dL sampai ibu harus membantu memberi minuman manis, tetapi gula pagi sering tinggi.'],
    pertanyaan: [
      ['q_dka', 'rps', 'Ada muntah, nyeri perut, napas dalam, sangat haus, keton tinggi, atau penurunan kesadaran?', 'Tidak ada; saya masih makan dan minum.', true],
      ['q_hipo', 'rps', 'Saat gula 52 mg/dL, apakah Anda masih mampu menolong diri sendiri dan bagaimana pulihnya?', 'Saya bingung dan tidak bangun sendiri; ibu memberi minuman manis. Setelah 15 menit gula naik.', true],
      ['q_log', 'rpd', 'Adakah catatan gula, waktu makan, aktivitas, dan dosis insulin yang bisa ditinjau?', 'Ada. Gula sangat bervariasi; beberapa dosis makan siang terlewat dan gula malam kadang turun.', true],
      ['q_teknik', 'rpd', 'Bagaimana penyimpanan insulin, teknik suntik, dan rotasi tempat suntik?', 'Insulin tersimpan baik, tetapi saya sering menyuntik di bagian perut yang sama.', true],
      ['q_akses', 'sosial', 'Apakah insulin, alat cek gula, pendamping keluarga, dan akses rumah sakit tersedia?', 'Insulin dan alat cek masih saya dapat dari layanan rujukan. Ibu membantu, dan kami masih bisa menjangkau rumah sakit.', true],
    ],
    fisik: [['umum', 'Status hidrasi baik, sadar penuh, tidak ada napas Kussmaul.'], ['kulit', 'Lipohipertrofi pada lokasi suntik abdomen.'], ['ekstremitas', 'Nadi kaki baik, tanpa ulkus.', false]],
    lab: [['gds', '212 mg/dL saat kunjungan.', 'tinggi'], ['urinalisis', 'Keton negatif.', 'normal']],
    diagnosisBanding: ['E10', 'E16.2', 'E11'],
    tatalaksana: { obatBenar: ['insulin_nph', 'insulin_regular'], obatSalahUmum: [{ id: 'metformin_500', alasan: 'Metformin tidak menggantikan kebutuhan insulin absolut pada DM tipe 1.', bahaya: 'nonPrimer' }], edukasi: ['sick_day_dm1', 'hipoglikemia_dm1', 'rencana_prb_dm1'], edukasiKritis: ['sick_day_dm1', 'hipoglikemia_dm1'], terapiKritis: ['insulin_nph'] },
    clue: 'DM tipe 1 tidak boleh putus insulin. Episode hipoglikemia level 2 yang memerlukan bantuan, variabilitas besar, HbA1c di atas target, dan lipohipertrofi menuntut review regimen berbasis log oleh tim anak/diabetes; jangan menebak perubahan dosis tunggal dari satu GDS. Stabilkan edukasi hipoglikemia dan sick-day, lanjutkan insulin basal, rujuk terencana, lalu gunakan kunjungan rujuk balik untuk memastikan resume, dosis, target, stok, dan jadwal review benar-benar tersambung.',
    panduanResmi: 'PNPK DM pada Anak KMK HK.01.07/MENKES/2009/2024 menjadi acuan dasar: insulin, pemantauan gula/keton, HbA1c tiap tiga bulan, rotasi lokasi suntik, edukasi hipoglikemia, dan larangan menghentikan insulin saat sakit. ADA Standards of Care 2026 menguatkan review regimen setelah hipoglikemia level 2/3 dan pendidikan terstruktur. Fornas 1199/2025 menyediakan NPH dan regular human insulin pada FPKTP sesuai ketentuan; perencanaan dosis individual tetap melalui jejaring spesialis.',
    catatanRealita: 'HbA1c berasal dari resume rumah sakit, bukan diasumsikan tersedia sebagai pemeriksaan seketika di Puskesmas. Insulin, strip, rantai dingin, dan edukator perlu dikonfirmasi, bukan dianggap merata. Gameplay menuntut rujukan dulu agar episode kembali sebagai PRB dan pemain harus membaca resume, bukan sekadar menekan kontrol rutin.',
  }),

  buatKasusFktpLab({
    id: 'lab_malnutrisi_energi_protein_sedang', nama: 'Gizi Kurang Balita Tanpa Komplikasi', icd10: 'E44', kategori: 'metabolik', prevalensi: 'sedang',
    keluhanUtama: 'Kader Posyandu meminta kami ke Puskesmas karena berat anak turun dari kurva tiga bulan berturut-turut.', keluhanUtamaOlehPendamping: true, usia: [2, 5], vital: { nadi: 96, rr: 22, suhu: 36.7, spo2: 99 },
    pembuka: ['Apa yang tercatat di Buku KIA dan bagaimana pola makan anak?', 'Tiga penimbangan terakhir turun dari garis pertumbuhan. Anak makan dua kali sedikit, kebanyakan nasi dan kerupuk.'],
    pertanyaan: [
      ['q_bahaya', 'rps', 'Ada edema kedua kaki, sangat lemas, tidak mau makan, muntah semua, demam, atau tanda dehidrasi?', 'Tidak ada; anak masih aktif dan mau makan.', true],
      ['q_penyakit', 'rpd', 'Ada diare lama, batuk lama, kontak TB, kelainan jantung, atau infeksi berulang?', 'Tidak ada.', true],
      ['q_akses', 'sosial', 'Apakah keluarga kesulitan memperoleh telur, ikan, ayam, atau sumber protein lain?', 'Penghasilan tidak tetap dan lauk hewani jarang tersedia.', true],
      ['q_program', 'sosial', 'Apakah anak sudah menerima PMT lokal, makan bergizi gratis, atau pendampingan kader; siapa yang memantau konsumsinya?', 'Belum menerima PMT. Kader bersedia memantau dan Posyandu dekat dari rumah.', true],
    ],
    fisik: [['umum', 'Anak kurus tetapi aktif; BB/TB z-score -2,4 SD dan LILA 12,0 cm, tanpa edema atau tanda dehidrasi.'], ['abdomen', 'Tidak ada hepatomegali atau distensi patologis.', false]],
    // Adjudikasi-delegasi 2026-08-21 (keputusan #6): R62.7 adalah kode
    // ICD-10-CM AS "Adult failure to thrive" — salah demografi utk balita dan
    // tak ada di WHO ICD-10. Distraktor gagal-tumbuh dipertahankan lewat
    // padanan WHO-nya, R62.8.
    diagnosisBanding: ['E44', 'E43', 'R62.8'],
    tatalaksana: { obatBenar: [], edukasi: ['alur_pmt_lokal_2025', 'makan_balita_padat_gizi', 'pantau_tumbuh_mingguan'], edukasiKritis: ['alur_pmt_lokal_2025', 'pantau_tumbuh_mingguan'] },
    clue: 'Wasting sedang (BB/TB -2,4 SD; LILA 12,0 cm), nafsu makan baik, dan tanpa edema/komplikasi dapat dikelola rawat jalan setelah penyebab dinilai. Hubungkan hasil konfirmasi Puskesmas kembali ke kader: PMT berbahan pangan lokal kaya protein hewani diberikan setiap hari selama 56 hari, tidak menggantikan makanan utama, dengan pemantauan konsumsi dan pertumbuhan mingguan. Bila dalam sekitar 14 hari konsumsi memadai tetapi berat tidak membaik, atau muncul edema, anoreksia, penyakit penyerta, dan tanda bahaya, evaluasi ulang dan rujuk sesuai temuan.',
    panduanResmi: 'Kepdirjen Kesprimkom HK.02.02/B/576/2025 adalah petunjuk teknis aktif PMT lokal; kebijakan 2025 menggantikan petunjuk 1622/2023 yang telah dicabut. Untuk balita gizi kurang, durasi program 56 hari, diberikan setiap hari, kaya protein hewani, dengan pemantauan harian oleh kader/keluarga dan berkala oleh tenaga kesehatan. WHO 2023 menekankan penilaian klinis, dukungan keluarga, follow-up pertumbuhan, dan rujukan bila komplikasi atau respons buruk.',
    catatanRealita: 'Episode ini memulai bridge UKM ke UKP dari Posyandu/Buku KIA, lalu menutupnya kembali melalui rencana PMT dan pemantauan kader. PMT bukan sekadar kupon makanan: pemain harus mengikat diagnosis, akses pangan, siapa yang memantau, indikator respons, dan ambang evaluasi ulang.',
  }),

  buatKasusFktpLab({
    // Adjudikasi-delegasi 2026-08-21 (keputusan #2): nama kasus memang "Dugaan"
    // dan catatanRealita menyebut "label diagnosis tetap dugaan" — field lalai
    // disetel, kini dijujurkan mengikuti preseden leptospirosis di bawah.
    id: 'lab_defisiensi_vitamin_b_kompleks', nama: 'Dugaan Defisiensi Riboflavin dalam Kekurangan Mikronutrien Campuran', icd10: 'E53.0', kepastianDiagnosis: 'suspek', kategori: 'metabolik', // Deep research 2026-08-22: 'E50-E56' adalah RENTANG BLOK, bukan kode diagnosis. E53.0 'Riboflavin deficiency' (WHO) sudah ada di kamus & persis menyasar riboflavin.
    keluhanUtama: 'Sudut bibir sering pecah dan lidah terasa perih sejak pola makan saya sangat terbatas.', usia: [18, 70], vital: { td: '118/74', nadi: 80, rr: 18, suhu: 36.6, spo2: 99 },
    pembuka: ['Apa perubahan pola makan dan keluhan lain?', 'Tiga bulan hanya banyak makan nasi instan; bibir pecah, lidah merah, dan mudah lelah.'],
    pertanyaan: [
      ['q_sistemik', 'rps', 'Ada kebas berat, sulit berjalan, diare lama, atau berat turun cepat?', 'Tidak ada.', true],
      ['q_alkohol', 'sosial', 'Ada konsumsi alkohol atau diet sangat restriktif?', 'Tidak alkohol; diet terbatas karena ekonomi.', true],
      ['q_obat', 'rpd', 'Ada obat atau penyakit yang mengganggu penyerapan?', 'Tidak ada.', false],
    ],
    fisik: [['tht_mulut', 'Angular cheilitis dan glositis ringan tanpa kandidiasis.'], ['neurologis', 'Refleks dan sensibilitas normal.', false]],
    diagnosisBanding: ['E53.0', 'D50', 'B37.9'],
    tatalaksana: { obatBenar: ['vitamin_b_kompleks'], edukasi: ['gizi_seimbang', 'kontrol_rutin'] },
    clue: 'Angular cheilitis dan glositis pada diet sangat tidak beragam cocok dengan kekurangan riboflavin, tetapi tidak membuktikannya dan defisiensi mikronutrien sering berkelompok. Koreksi diet adalah inti; B kompleks jangka pendek dapat menjadi terapi pragmatis sambil mencari anemia, kandidiasis, malabsorpsi, alkohol, atau penyakit sistemik bila keluhan menetap.',
    panduanResmi: 'PPK FKTP 1186/2022 tidak mempunyai bab diagnosis langsung untuk defisiensi riboflavin. NIH ODS menyebut angular stomatitis, cheilosis, dan glositis sebagai temuan yang kompatibel, sekaligus menegaskan bahwa ko-defisiensi lazim sehingga tanda tersebut tidak spesifik untuk satu vitamin.',
    catatanRealita: 'Kode E50-E56 dipertahankan karena ini adalah baris payung katalog SKDI-144; fenotipe klinis yang diajarkan paling dekat dengan E53.0. Puskesmas tidak diasumsikan mempunyai biomarker riboflavin. Skenario menilai risiko diet dan respons klinis, memberi dukungan pangan yang realistis, dan membuka evaluasi jejaring bila tidak membaik; label diagnosis tetap dugaan, bukan kepastian laboratorium.',
  }),

  buatKasusFktpLab({
    // Adjudikasi-delegasi 2026-08-21 (keputusan #2): clue kasus ini sendiri
    // melarang menegakkan diagnosis dari satu gejala — field lalai disetel,
    // kini dijujurkan mengikuti preseden leptospirosis di bawah.
    id: 'lab_defisiensi_mineral_zinc', nama: 'Dugaan Defisiensi Zinc', icd10: 'E60', kepastianDiagnosis: 'suspek', kategori: 'metabolik', // Deep research 2026-08-22: 'E58-E61' RENTANG BLOK; E60 'Dietary zinc deficiency' (WHO) sudah ada di kamus & persis menyasar zinc (bukan E61.x, yg tak mencakup zinc).
    keluhanUtama: 'Luka kecil lama sembuh, rambut mudah rontok, dan selera makan turun.', usia: [12, 50], vital: { td: '116/72', nadi: 78, rr: 18, suhu: 36.6, spo2: 99 },
    pembuka: ['Bagaimana pola makan dan sejak kapan keluhan muncul?', 'Berbulan-bulan jarang makan protein hewani; keluhan perlahan dan tidak ada demam.'],
    pertanyaan: [
      ['q_malabsorbsi', 'rpd', 'Ada diare kronik, operasi usus, atau penyakit hati/ginjal?', 'Tidak ada.', true],
      ['q_berat', 'rps', 'Ada penurunan berat badan besar, infeksi berat, atau luka luas?', 'Tidak ada.', true],
      ['q_suplemen', 'rpd', 'Sudah memakai suplemen dosis tinggi?', 'Belum.', false],
    ],
    fisik: [['kulit', 'Dermatitis periorifisial ringan dan rambut menipis difus; tanpa infeksi luka.'], ['umum', 'Status gizi sedikit kurang.', true]],
    diagnosisBanding: ['E60', 'E53.0', 'L65.9'],
    tatalaksana: { obatBenar: [], edukasi: ['gizi_seimbang', 'kontrol_rutin'] },
    clue: 'Defisiensi zinc tidak boleh ditegakkan dari satu gejala. Diet rendah sumber zinc, dermatitis periorifisial, alopecia, dan penyembuhan lambat hanya meningkatkan probabilitas; nilai malabsorpsi, alkohol, penyakit kronik, dan diagnosis kulit lain. Prioritaskan pangan kaya zinc dan evaluasi respons, bukan suplementasi dosis tinggi empiris.',
    panduanResmi: 'PPK FKTP 1186/2022 tidak mempunyai bab diagnosis langsung untuk defisiensi zinc. NIH ODS 2026 menganjurkan integrasi faktor risiko dan tanda klinis serta mengingatkan bahwa kadar zinc serum dipengaruhi usia, jenis kelamin, waktu pengambilan, infeksi, dan katabolisme sehingga tidak selalu mencerminkan asupan atau status jaringan.',
    catatanRealita: 'Kode E58-E61 dipertahankan karena ini adalah baris payung katalog SKDI-144; dugaan klinis pada skenario paling dekat dengan E60. Zinc dispersibel Fornas dibatasi untuk diare anak dan tidak dijadikan jawaban wajib pada dugaan defisiensi dewasa. Konfirmasi dan suplementasi spesifik dikoordinasikan melalui jejaring bila diperlukan.',
  }),

  buatKasusFktpLab({
    id: 'lab_anemia_defisiensi_besi_nonhamil', nama: 'Anemia Defisiensi Besi akibat Haid Banyak', icd10: 'D50', kategori: 'metabolik', prevalensi: 'sedang', jenisKelamin: 'P',
    keluhanUtama: 'Saya cepat lelah, berdebar saat naik tangga, dan tampak pucat.', usia: [18, 45], vital: { td: '108/68', nadi: 92, rr: 18, suhu: 36.6, spo2: 99 },
    pembuka: ['Sejak kapan lelah dan adakah sumber kehilangan darah?', 'Tiga bulan; haid sangat banyak selama tujuh hari setiap bulan.'],
    pertanyaan: [
      ['q_bahaya', 'rps', 'Ada nyeri dada, pingsan, sesak saat diam, perdarahan aktif, atau kemungkinan hamil?', 'Tidak ada; tes kehamilan bulan ini negatif.', true],
      ['q_haid', 'rps', 'Seberapa sering pembalut penuh, apakah tembus malam hari, dan sejak kapan pola ini berubah?', 'Hari pertama sampai ketiga harus ganti pembalut penuh tiap dua jam dan sering tembus malam; sudah enam bulan.', true],
      ['q_darah', 'rps', 'Ada BAB hitam, darah di tinja, muntah darah, mimisan berulang, atau cacingan?', 'Tidak ada.', true],
      ['q_bekuan', 'rpd', 'Ada bekuan besar, perdarahan setelah hubungan, mudah memar, atau keluarga dengan gangguan perdarahan?', 'Bekuan kadang sebesar koin; tidak ada perdarahan lain atau riwayat keluarga.', true],
      ['q_diet', 'sosial', 'Bagaimana asupan daging, telur, ikan, kacang, dan sayur?', 'Telur dan tempe cukup, tetapi jarang makan daging.', false],
    ],
    fisik: [['umum', 'Konjungtiva pucat, tidak ikterik.'], ['jantung', 'Takikardia ringan, tanpa murmur patologis.'], ['abdomen', 'Tidak ada hepatosplenomegali atau massa teraba.', false]],
    lab: [['darah_rutin', 'Hb 9,6 g/dL; MCV 69 fL; MCH rendah; RDW meningkat; trombosit 470.000/uL.', 'rendah']],
    diagnosisBanding: ['D50', 'D56.3', 'D63.8'],
    tatalaksana: { obatBenar: ['tablet_fe'], edukasi: ['terapi_besi_terukur', 'telusuri_sumber_anemia', 'kontrol_hb_anemia'], edukasiKritis: ['telusuri_sumber_anemia', 'kontrol_hb_anemia'] },
    clue: 'Anemia mikrositik-hipokrom dengan RDW meningkat dan haid banyak sangat mendukung defisiensi besi, tetapi terapi tidak boleh berhenti pada tablet Fe. Beri sekitar 60 mg besi elemental sekali sehari; bila tidak toleran, regimen selang sehari dapat dipertimbangkan. Nilai kenaikan Hb dalam 2-4 minggu dan lanjutkan sekitar tiga bulan setelah Hb normal untuk mengisi cadangan, sambil menilai serta menangani penyebab haid banyak. Rujuk bila tidak respons, anemia berat/gejala tidak stabil, perdarahan mencurigakan, atau perlu evaluasi ginekologi lanjut.',
    panduanResmi: 'PPK FKTP 1186/2022 membahas langsung anemia defisiensi besi dan menjadi acuan dasar, tetapi masih mencantumkan fero sulfat 3 x 200 mg. AGA Clinical Practice Update 2024 dan BSG 2021 mendukung besi oral sekali sehari paling banyak, dengan selang sehari bila toleransi buruk; respons Hb dinilai dini dan terapi dilanjutkan setelah normal. Fornas 1199/2025 menyediakan sediaan sekitar 60 mg besi elemental pada FPKTP. ACOG menegaskan bahwa perdarahan uterus abnormal perlu dinilai dan ditangani paralel, bukan ditutupi oleh suplementasi saja.',
    catatanRealita: 'Ferritin tidak dijadikan tombol wajib karena tidak selalu tersedia di Puskesmas. CBC dan pola klinis memulai tata laksana; ferritin atau pemeriksaan lain diatur melalui jejaring bila diagnosis meragukan atau respons tidak memadai. Episode baru selesai bila sumber perdarahan, toleransi obat, dan kenaikan Hb ikut ditindaklanjuti.',
  }),

  buatKasusFktpLab({
    // Bug hunt 2026-08-01: I88 (bab sirkulasi, subkategori I88.1 justru berarti
    // KRONIK) diganti L04.0 — bab WHO ICD-10 "Acute lymphadenitis", spesifik
    // utk wajah/kepala/leher, cocok dgn nama & presentasi akut kasus ini.
    id: 'lab_limfadenitis_servikal_akut', nama: 'Limfadenitis Servikal Akut Bakterial', icd10: 'L04.0', kategori: 'infeksi',
    keluhanUtama: 'Anak saya mengalami benjolan nyeri di leher setelah sakit gigi dan demam ringan.', keluhanUtamaOlehPendamping: true, usia: [8, 12], vital: { td: '104/66', nadi: 92, rr: 20, suhu: 38.0, spo2: 99 },
    pembuka: ['Benjolan muncul kapan dan adakah sumber infeksi di sekitar kepala-leher?', 'Tiga hari setelah gigi geraham sakit; benjolan satu sisi dan nyeri.'],
    pertanyaan: [
      ['q_tb', 'rps', 'Benjolan sudah lama, tidak nyeri, disertai batuk lama, keringat malam, atau berat turun?', 'Tidak; baru tiga hari dan nyeri.', true],
      ['q_bahaya', 'rps', 'Sulit menelan/napas, leher kaku, atau demam tinggi?', 'Tidak ada.', true],
      ['q_kucing', 'sosial', 'Ada cakaran kucing atau luka kulit?', 'Tidak ada.', false],
    ],
    // Audit CODEX 2026-08-04 (temuan 3): regio `umum` ditambahkan supaya
    // memeriksa Keadaan Umum pada anak bersuhu 38,0 tidak lagi dijawab
    // "dalam batas normal". Isinya persis tiga jawaban negatif q_bahaya
    // (sulit menelan / sulit napas / leher kaku) — tanpa tanda klinis baru.
    fisik: [['umum', 'Anak sadar penuh dan tampak sakit ringan; demam teraba. Menelan tanpa kesulitan, tidak sesak, dan leher masih dapat digerakkan bebas.'], ['kepala_leher', 'KGB submandibula kanan 2 cm, nyeri, mobile, hangat; tidak fluktuatif. Gigi molar karies.'], ['tht_mulut', 'Tidak ada abses peritonsil atau obstruksi jalan napas.', true]],
    diagnosisBanding: ['L04.0', 'A18.2', 'C77.0'],
    tatalaksana: { obatBenar: ['cefadroxil_sirup_125'], obatOpsional: ['paracetamol_sirup'], edukasi: ['kepatuhan_obat', 'kontrol_rutin', 'tanda_bahaya'] },
    clue: 'KGB akut unilateral nyeri dengan fokus infeksi lokal mendukung limfadenitis bakterial. Tata sumber infeksi dan antibiotik yang sesuai; evaluasi ulang. Kronik, keras/fiksasi, supraklavikula, gejala TB/keganasan, fluktuasi, atau gagal respons memerlukan pemeriksaan lanjut.',
    panduanResmi: `${PPK} Limfadenitis harus dibedakan dari TB kelenjar, keganasan, dan abses.`,
  }),

  buatKasusFktpLab({
    id: 'lab_leptospirosis_tanpa_komplikasi', ambangKluster: 2, nama: 'Suspek Leptospirosis Ringan Pascabanjir', icd10: 'A27.9', kepastianDiagnosis: 'suspek', kategori: 'infeksi',
    keluhanUtama: 'Demam mendadak, sakit kepala, dan betis sangat nyeri setelah membersihkan rumah kebanjiran.', usia: [15, 65], vital: { td: '112/70', nadi: 98, rr: 20, suhu: 38.7, spo2: 98 },
    pembuka: ['Kapan demam mulai dan bagaimana pajanan banjirnya?', 'Tiga hari setelah berjalan di air banjir dengan luka kecil di kaki.'],
    pertanyaan: [
      ['q_berat', 'rps', 'Ada kuning, urine berkurang, sesak, batuk darah, bingung, atau perdarahan?', 'Tidak ada; urine masih normal.', true],
      ['q_gejala', 'rps', 'Ada nyeri betis, mata merah tanpa kotoran, mual, atau sakit kepala?', 'Nyeri betis berat, mata merah, mual ringan.', true],
      ['q_obat', 'rpd', 'Ada alergi tetrasiklin atau obat rutin yang perlu diperiksa interaksinya?', 'Tidak ada.', true],
      ['q_hamil', 'rpd', 'Apakah sedang hamil atau mungkin hamil?', 'Tidak.', true, 'P'],
    ],
    fisik: [['umum', 'Demam, sadar, hidrasi cukup; tidak ikterik.'], ['mata', 'Conjunctival suffusion bilateral tanpa sekret.'], ['ekstremitas', 'Nyeri tekan otot gastroknemius.', true]],
    diagnosisBanding: ['A27.9', 'A90', 'B54'],
    tatalaksana: { obatBenar: ['doksisiklin_100'], obatOpsional: ['paracetamol_500'], edukasi: ['rencana_leptospirosis_jejaring', 'cegah_leptospirosis', 'tanda_bahaya_leptospirosis'], edukasiKritis: ['rencana_leptospirosis_jejaring', 'tanda_bahaya_leptospirosis'] },
    clue: 'Demam akut, nyeri betis, conjunctival suffusion tanpa sekret, dan pajanan banjir mendukung suspek leptospirosis ringan. Mulai doksisiklin 100 mg dua kali sehari selama 10 hari menurut acuan dasar Permenkes 28/2021 tanpa menunggu hasil laboratorium. CDC 2026 memakai 7 hari; perbedaan itu ditampilkan sebagai divergensi EBM, bukan alasan mengubah acuan dasar nasional diam-diam. Atur spesimen dan pemeriksaan fungsi ginjal-hati melalui jejaring bila tersedia. Ikterus, oliguria, perdarahan paru, rangsang meningeal, hipotensi, bingung, atau sesak memerlukan rujukan segera.',
    panduanResmi: `${PPK} PPK menjadi acuan dasar pengenalan klinis dan rujukan. Permenkes 28/2021 menetapkan doksisiklin dewasa 100 mg tiap 12 jam selama 10 hari untuk leptospirosis ringan; CDC 2026 merekomendasikan 7 hari dan sama-sama menekankan terapi dini tanpa menunggu hasil. Dua kasus terkait banjir memicu notifikasi, line list, pemetaan air-rodensia-hewan, pencarian kasus aktif, dan koordinasi kesehatan lingkungan/One Health; bukti profilaksis massal antibiotik terbatas dan risiko resistensi melarang pembagian doksisiklin blanket.`,
    catatanRealita: 'Kasus ini sengaja tidak menjadikan darah rutin, kreatinin, transaminase, PCR, atau serologi sebagai tombol wajib di Puskesmas generik. Jejaring mengatur spesimen dan pemeriksaan menurut hari sakit sambil terapi berjalan; hasil negatif dini tidak otomatis menyingkirkan penyakit.',
  }),

  buatKasusFktpLab({
    id: 'lab_anafilaksis_makanan', nama: 'Reaksi Anafilaktik setelah Makanan', icd10: 'T78.2', kategori: 'gawat',
    keluhanUtama: 'Setelah makan udang, bibir bengkak, suara serak, kulit bentol, dan napas berbunyi.', usia: [18, 70], vital: { td: '82/52', nadi: 126, rr: 30, suhu: 36.7, spo2: 91 }, harusDirujuk: true, spesialisRujukan: 'penyakit_dalam',
    pembuka: ['Berapa menit setelah makanan gejala muncul?', 'Sekitar sepuluh menit; bentol menyebar lalu tenggorok terasa sempit.'],
    pertanyaan: [
      ['q_sistem', 'rps', 'Ada muntah, nyeri perut, pusing, atau hampir pingsan?', 'Mual dan sangat pusing.', true],
      ['q_riwayat', 'rpd', 'Pernah reaksi serupa atau membawa epinefrin?', 'Pernah gatal ringan, belum pernah separah ini.', true],
      ['q_obat', 'rpd', 'Menggunakan beta-blocker atau punya penyakit jantung?', 'Tidak.', false],
    ],
    fisik: [['umum', 'Gelisah, perfusi buruk, urtikaria generalisata dan angioedema bibir.'], ['toraks_paru', 'Wheezing difus dan suara serak.'], ['jantung', 'Takikardia, hipotensi.', true]],
    diagnosisBanding: ['T78.2', 'J45.9', 'F41.0'],
    tatalaksana: { obatBenar: [], prosedur: ['adrenalin_im_anafilaksis', 'oksigen', 'akses_iv_resusitasi', 'pemantauan_ketat_vital'], edukasi: ['rencana_anafilaksis', 'tanda_bahaya'], edukasiKritis: ['rencana_anafilaksis'], terapiKritis: ['adrenalin_im_anafilaksis'] },
    stabilisasiWajib: ['adrenalin_im_anafilaksis', 'oksigen', 'akses_iv_resusitasi', 'pemantauan_ketat_vital'],
    clue: 'Onset menit dengan keterlibatan kulit plus jalan napas/napas dan hipotensi adalah anafilaksis. Berikan epinefrin 0,5 mg IM paha (0,5 mL sediaan 1 mg/mL) segera pada pasien dewasa ini dan ulangi setelah 5 menit bila masalah ABC menetap. Baringkan dengan tungkai dinaikkan; bila bernapas lebih mudah dalam posisi setengah duduk, pertahankan tungkai lurus dan jangan biarkan berdiri atau berjalan. Beri oksigen karena hipoksemia, berikan bolus kristaloid dini secara terukur sambil menilai respons, pantau serial, dan transfer paralel. Antihistamin atau steroid tidak boleh menunda epinefrin.',
    panduanResmi: `${PPK} PPK menjadi acuan dasar pemberian adrenalin IM, oksigen, cairan, dan rujukan. ERC/RCUK 2025 menegaskan epinefrin dewasa 500 mikrogram IM segera, diulang setelah 5 menit bila belum membaik, disertai kristaloid IV dini. RCUK 2021 tetap menjadi pedoman rinci untuk posisi aman, pemantauan, dan anafilaksis refrakter; adrenalin intravena hanya untuk spesialis berpengalaman dalam lingkungan terpantau. Antihistamin adalah lini ketiga untuk gejala kulit setelah stabilisasi dan steroid tidak digunakan rutin pada tata laksana awal.`,
    catatanRealita: 'Epinefrin 1 mg/mL, oksigen, akses IV, cairan, pulse oximeter, dan transport dinyatakan ready. Sukamaju tidak punya pompa/monitor untuk adrenalin IV; setelah dua dosis IM tanpa respons, lanjutkan resusitasi, minta ahli, percepat transfer, bukan memberi bolus adrenalin IV atau aminofilin rutin. Setelah stabil, jejaring menyiapkan identifikasi pemicu, action plan, asesmen alergi, dan autoinjektor bila tersedia.',
  }),
]

export const LAB_BATCH_2_ARCHETYPE_SPECS: Record<string, { conceptId: string; credits: string[] }> = {
  lab_kejang_demam_sederhana: { conceptId: 'concept:febrile_seizure', credits: ['fktp144:febrile_seizure'] },
  lab_tetanus_generalisata_awal: { conceptId: 'concept:tetanus', credits: ['fktp144:tetanus'] },
  lab_hiv_tanpa_komplikasi: { conceptId: 'concept:hiv_uncomplicated', credits: ['fktp144:hiv_uncomplicated'] },
  lab_gangguan_somatoform: { conceptId: 'concept:somatoform', credits: ['fktp144:somatoform'] },
  lab_benda_asing_konjungtiva: { conceptId: 'concept:foreign_body_conjunctiva', credits: ['fktp144:foreign_body_conjunctiva'] },
  lab_perdarahan_subkonjungtiva: { conceptId: 'concept:subconjunctival_hemorrhage', credits: ['fktp144:subconjunctival_hemorrhage'] },
  lab_mata_kering: { conceptId: 'concept:dry_eye', credits: ['fktp144:dry_eye'] },
  lab_blefaritis_anterior: { conceptId: 'concept:blepharitis', credits: ['fktp144:blepharitis'] },
  lab_trikiasis: { conceptId: 'concept:trichiasis', credits: ['fktp144:trichiasis'] },
  lab_episkleritis_ringan: { conceptId: 'concept:episcleritis', credits: ['fktp144:episcleritis'] },
  lab_hipermetropia: { conceptId: 'concept:hypermetropia', credits: ['fktp144:hypermetropia'] },
  lab_miopia_ringan: { conceptId: 'concept:myopia_mild', credits: ['fktp144:myopia_mild'] },
  lab_astigmatisme_ringan: { conceptId: 'concept:astigmatism_mild', credits: ['fktp144:astigmatism_mild'] },
  lab_presbiopia: { conceptId: 'concept:presbyopia', credits: ['fktp144:presbyopia'] },
  lab_buta_senja_defisiensi_vitamin_a: { conceptId: 'concept:night_blindness', credits: ['fktp144:night_blindness'] },
  lab_infeksi_umbilikus_neonatus: { conceptId: 'concept:umbilical_infection', credits: ['fktp144:umbilical_infection'] },
  lab_gonore_uretritis_pria: { conceptId: 'concept:gonorrhea', credits: ['fktp144:gonorrhea'] },
  lab_pielonefritis_tanpa_komplikasi: { conceptId: 'concept:pyelonephritis', credits: ['fktp144:pyelonephritis'] },
  lab_fimosis_patologis_ringan: { conceptId: 'concept:phimosis', credits: ['fktp144:phimosis'] },
  lab_parafimosis_reduksibel: { conceptId: 'concept:paraphimosis', credits: ['fktp144:paraphimosis'] },
  lab_sindrom_duh_genital_servisitis: { conceptId: 'concept:nongonococcal_genital_discharge', credits: ['fktp144:genital_discharge'] },
  lab_vulvitis_iritan: { conceptId: 'concept:vulvitis', credits: ['fktp144:vulvitis'] },
  lab_vaginitis_kandida: { conceptId: 'concept:vulvovaginal_candidiasis', credits: ['fktp144:vaginitis'] },
  lab_vaginosis_bakterialis: { conceptId: 'concept:bacterial_vaginosis', credits: ['fktp144:bacterial_vaginosis'] },
  lab_salpingitis_pid_ringan: { conceptId: 'concept:salpingitis', credits: ['fktp144:salpingitis'] },
  lab_abortus_spontan_komplit: { conceptId: 'concept:complete_abortion', credits: ['fktp144:complete_abortion'] },
  lab_ruptur_perineum_derajat_1: { conceptId: 'concept:perineal_rupture_12', credits: ['fktp144:perineal_rupture_12'] },
  lab_abses_folikel_rambut: { conceptId: 'concept:abses_folikel_rambut', credits: ['fktp144:abses_folikel_rambut'] },
  lab_mastitis_laktasi: { conceptId: 'concept:mastitis_lactation', credits: ['fktp144:mastitis_lactation'] },
  lab_puting_lecet: { conceptId: 'concept:cracked_nipple', credits: ['fktp144:cracked_nipple'] },
  lab_puting_tenggelam_laktasi: { conceptId: 'concept:inverted_nipple', credits: ['fktp144:inverted_nipple'] },
  lab_dm_tipe1_stabil_prb: { conceptId: 'concept:dm_type1', credits: ['fktp144:dm_type1'] },
  lab_malnutrisi_energi_protein_sedang: { conceptId: 'concept:pem', credits: ['fktp144:pem'] },
  lab_defisiensi_vitamin_b_kompleks: { conceptId: 'concept:vitamin_deficiency', credits: ['fktp144:vitamin_deficiency'] },
  lab_defisiensi_mineral_zinc: { conceptId: 'concept:mineral_deficiency', credits: ['fktp144:mineral_deficiency'] },
  lab_anemia_defisiensi_besi_nonhamil: { conceptId: 'concept:anemia_deficiency', credits: ['fktp144:anemia_deficiency'] },
  lab_limfadenitis_servikal_akut: { conceptId: 'concept:lymphadenitis', credits: ['fktp144:lymphadenitis'] },
  lab_leptospirosis_tanpa_komplikasi: { conceptId: 'concept:leptospirosis', credits: ['fktp144:leptospirosis'] },
  lab_anafilaksis_makanan: { conceptId: 'concept:anaphylaxis', credits: ['fktp144:anaphylaxis'] },
}
