/**
 * BATCH 4 — OBGYN & ANAK (M13 lab, 2026-07-16).
 *
 * Delapan kasus tier-rujuk (3B/2) yang semuanya berakhir dirujuk. Inti
 * pedagogisnya BUKAN "klik rujuk lalu selesai", melainkan: kenali tanda bahaya,
 * kerjakan yang MEMANG wajib dikerjakan FKTP sebelum transfer, JANGAN kerjakan
 * yang di luar lingkup, dan rujuk ke spesialis yang benar.
 *
 * Kosakata tertutup: seluruh id obat/lab/tindakan/edukasi berasal dari katalog
 * yang sudah ada + `catalogBatch4.ts`. Status aktivasi disetel factory
 * (`lab_prototype_unadjudicated` = Career-only, belum diadjudikasi klinis).
 */

import type { KasusKlinis, Persona } from '../types'
import type { LabArchetypeSpec } from './batch1'
import type { LabCaseSpec, LabQuestionSpec } from './labCaseFactory'
import { buatKasusLab } from './labCaseFactory'

const PPK_FLOOR =
  'PPK Dokter FKTP KMK 1186/2022 menjadi floor; terapi disesuaikan dengan pedoman yang lebih baru bila relevan.'

/**
 * Shim lokal: `LabQuestionSpec` di `labCaseFactory.ts` belum memuat `variasi`
 * (jawaban per persona), padahal (a) factory sudah meneruskan field itu apa
 * adanya ke `PertanyaanAnamnesis` yang memang memilikinya, dan (b)
 * `bahasaPasien.test.ts` justru memeriksa `variasi` pada seluruh kasus pack.
 * Tanpa tipe ini, excess-property-check TypeScript menolak `variasi` di literal
 * kasus. Shim ini hanya melebarkan tipe penulis — tak mengubah perilaku runtime
 * — dan dapat dihapus begitu `variasi` ditambahkan ke `LabQuestionSpec` di hulu.
 */
type LabQuestionSpecOA = LabQuestionSpec & { variasi?: Partial<Record<Persona, string>> }
type LabCaseSpecOA = Omit<LabCaseSpec, 'pertanyaan'> & { pertanyaan: LabQuestionSpecOA[] }
const buatKasusOA = (spec: LabCaseSpecOA): KasusKlinis => buatKasusLab(spec)

export const LAB_BATCH_4_OA_CASES: KasusKlinis[] = [
  // ---------------------------------------------------------------------------
  // 1. Kehamilan ektopik terganggu (suspek)
  // ---------------------------------------------------------------------------
  buatKasusOA({
    id: 'lab_kehamilan_ektopik_terganggu_suspek',
    nama: 'Suspek Kehamilan Ektopik Terganggu',
    icd10: 'O00.1',
    skdi: '3B',
    kategori: 'kia',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'obgyn',
    keluhanUtama: 'Perut bawah kanan saya mendadak sakit sekali sampai tadi sempat jatuh pingsan, Dok.',
    demografi: { usiaMin: 20, usiaMax: 38, jenisKelamin: 'P' },
    vital: { td: '86/54', nadi: 124, rr: 24, suhu: 36.4, spo2: 98 },
    pembuka: {
      tanya: 'Sakit perutnya mulai kapan dan bagaimana rasanya?',
      jawab: 'Mendadak sekitar tiga jam lalu waktu saya bangun dari duduk. Sakitnya menusuk di perut bawah sebelah kanan, makin lama makin berat sampai saya tidak berani bergerak.',
      oldcarts: ['onset', 'lokasi', 'karakter', 'keparahan'],
      // catatan: 'onset' di sini adalah tag OLDCARTS (teks dokter/metadata),
      // bukan kata yang diucapkan pasien.
    },
    pertanyaan: [
      {
        id: 'q_haid',
        kategori: 'rps',
        tanya: 'Kapan hari pertama haid terakhir Ibu, dan apakah ada keterlambatan?',
        jawab: 'Sudah telat sekitar tujuh minggu. Biasanya haid saya teratur tiap bulan.',
        esensial: true,
        oldcarts: ['waktu'],
        variasi: {
          polos: 'Wah, sudah lama tidak datang bulan, Dok. Kira-kira dua bulan lah. Padahal biasanya lancar.',
          cemas: 'Telat, Dok, telat! Tujuh minggu! Saya sempat curiga hamil tapi belum sempat tes, terus sekarang malah begini, ini kenapa ya Dok, bahaya tidak?',
        },
      },
      {
        id: 'q_bercak',
        kategori: 'rps',
        tanya: 'Ada darah yang keluar dari jalan lahir? Seberapa banyak dan apa warnanya?',
        jawab: 'Ada, tapi cuma bercak sedikit-sedikit sejak dua hari lalu, warnanya gelap kecoklatan seperti darah lama. Tidak sebanyak haid.',
        esensial: true,
        oldcarts: ['karakter', 'durasi'],
        variasi: {
          polos: 'Cuma nyeplok sedikit di celana dalam, Dok, warnanya coklat tua. Saya kira mau haid tapi tidak jadi-jadi.',
        },
      },
      {
        id: 'q_pingsan',
        kategori: 'rps',
        tanya: 'Tadi pingsannya berapa lama, dan sekarang masih terasa mau pingsan atau berkunang-kunang?',
        jawab: 'Sebentar saja, kata suami sekitar setengah menit. Sekarang kalau saya coba duduk kepala langsung berkunang-kunang dan keringat dingin.',
        esensial: true,
        oldcarts: ['keparahan', 'penyerta'],
      },
      {
        id: 'q_nyeri_bahu',
        kategori: 'rps',
        tanya: 'Sakitnya menjalar ke bahu atau punggung? Ada rasa seperti ingin buang air besar tapi tidak bisa?',
        jawab: 'Iya, bahu kanan saya ikut nyeri padahal tidak terbentur. Dan perut bawah rasanya seperti mau buang air besar terus tapi tidak keluar apa-apa.',
        esensial: true,
        oldcarts: ['radiasi', 'penyerta'],
      },
      {
        id: 'q_kb',
        kategori: 'rpd',
        tanya: 'Sebelum ini Ibu memakai KB? Kalau iya, jenis apa dan sampai kapan?',
        jawab: 'Saya pasang spiral tiga tahun lalu tapi kontrolnya tidak pernah. Kata bidan seharusnya sudah diganti.',
        esensial: true,
      },
      {
        id: 'q_riwayat_tuba',
        kategori: 'rpd',
        tanya: 'Pernah ada keputihan berbau yang lama, radang panggul, operasi perut, atau hamil di luar kandungan sebelumnya?',
        jawab: 'Dulu saya pernah diobati lama karena keputihan berbau dan perut bawah sakit terus. Kalau hamil di luar kandungan belum pernah.',
        esensial: true,
      },
      {
        id: 'q_tes_sendiri',
        kategori: 'rps',
        tanya: 'Sudah pernah tes kehamilan sendiri di rumah?',
        jawab: 'Belum, Dok. Rencananya minggu ini mau beli alat tesnya di apotek.',
      },
      {
        id: 'q_bak',
        kategori: 'rps',
        tanya: 'Ada perih atau anyang-anyangan saat buang air kecil, atau demam?',
        jawab: 'Tidak ada. Buang air kecil biasa saja dan saya tidak demam.',
      },
      {
        id: 'q_makan_pedas',
        kategori: 'sosial',
        tanya: 'Tadi pagi Ibu makan apa? Ada makanan pedas atau terlambat makan?',
        jawab: 'Sarapan nasi sama sayur seperti biasa, tidak pedas. Saya juga tidak telat makan.',
        distraktor: true,
      },
      {
        id: 'q_angkat_berat',
        kategori: 'sosial',
        tanya: 'Pekerjaan Ibu banyak mengangkat beban berat?',
        jawab: 'Saya jaga warung, jarang angkat yang berat-berat.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      {
        region: 'umum',
        temuan: 'Gelisah, berkeringat dingin, sangat pucat; hanya mau berbaring dengan lutut ditekuk. Tampak sakit berat.',
        relevan: true,
      },
      {
        region: 'abdomen',
        temuan: 'Nyeri tekan hebat perut bawah kanan dengan defans muskular dan nyeri lepas; perut sedikit mengembang dan pekak berpindah positif.',
        relevan: true,
      },
      {
        region: 'abdomen',
        temuan: 'Pemeriksaan ginekologis: nyeri goyang serviks sangat hebat, kavum Douglas menonjol dan nyeri; serviks tertutup dengan bercak darah kehitaman minimal; benang IUD tidak tampak.',
        relevan: true,
      },
      {
        region: 'jantung',
        temuan: 'Takikardia 124x/menit dengan nadi kecil dan lemah; bunyi jantung murni tanpa bising.',
        relevan: true,
      },
      {
        region: 'kulit',
        temuan: 'Konjungtiva sangat pucat, akral dingin dan basah, waktu pengisian kapiler 4 detik.',
        relevan: true,
      },
      {
        region: 'toraks_paru',
        temuan: 'Suara napas vesikuler simetris tanpa ronki; napas cepat dangkal tanpa temuan paru fokal.',
        relevan: false,
      },
    ],
    lab: [
      {
        id: 'tes_kehamilan',
        hasil: 'Positif.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'usg_obstetri',
        hasil: 'Kavum uteri KOSONG — tidak tampak kantong kehamilan intrauterin. Tampak massa adneksa kanan heterogen 3,4 cm dan cairan bebas cukup banyak di kavum Douglas hingga sekitar hati.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'hb',
        hasil: 'Hb 7,4 g/dL (dua jam lalu di bidan tercatat 10,1 g/dL).',
        flag: 'rendah',
        relevan: true,
      },
      {
        id: 'golongan_darah',
        hasil: 'A Rh positif; dicatat dan dikirim bersama pasien untuk persiapan darah di RS.',
        flag: 'normal',
        relevan: true,
      },
    ],
    diagnosisBanding: ['O00.1', 'O03.9', 'K35.9'],
    tatalaksana: {
      obatBenar: [],
      obatAlternatif: [['nacl_09_inf', 'ringer_laktat_inf']],
      obatSalahUmum: [
        {
          id: 'ketorolak_30_inj',
          alasan: 'NSAID parenteral tampak menarik untuk nyeri hebat, tetapi menghambat fungsi trombosit pada pasien yang sedang berdarah di dalam rongga perut dan membebani ginjal yang perfusinya sudah turun. Nyeri di sini diatasi dengan resusitasi dan transfer cepat, bukan dengan obat yang memperburuk perdarahan.',
          bahaya: 'kontraindikasi',
        },
        {
          id: 'hyoscine_butilbromida_20_inj',
          alasan: 'Nyeri perut mendadak langsung dilabeli "kolik" lalu diberi antispasmodik: nyeri berkurang sesaat, tanda peritoneal menjadi kabur, dan pasien dipulangkan dengan tuba yang sudah pecah.',
          bahaya: 'kontraindikasi',
        },
        {
          id: 'antasida_doen',
          alasan: 'Perempuan usia subur dengan nyeri perut bawah dipulangkan sebagai "maag" tanpa tes kehamilan. Antasida tidak berbahaya sendiri, tetapi label yang salah menunda laparotomi yang menyelamatkan nyawa.',
          bahaya: 'nonPrimer',
        },
      ],
      prosedur: ['akses_iv_resusitasi', 'pasang_infus', 'resusitasi_cairan_kristaloid', 'oksigen', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        {
          id: 'transfusi_darah_fktp',
          alasan: 'Hb 7,4 g/dL memang menakutkan, tetapi Puskesmas tidak punya bank darah maupun uji silang. Menunggu darah di FKTP menghabiskan menit yang seharusnya dipakai untuk transfer; sumber perdarahannya ada di kamar operasi, bukan di kantong darah.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif', 'tanda_bahaya'],
      edukasiKritis: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif'],
      terapiKritis: ['resusitasi_cairan_kristaloid'],
    },
    stabilisasiWajib: ['akses_iv_resusitasi', 'pasang_infus', 'resusitasi_cairan_kristaloid', 'oksigen'],
    clue: 'Setiap perempuan usia subur dengan nyeri perut bawah adalah kehamilan ektopik sampai terbukti sebaliknya — dan yang membuktikannya adalah tes kehamilan, bukan kesan klinis. Telat haid 7 minggu, nyeri satu sisi mendadak, bercak gelap, sinkop, nyeri alih bahu, tes kehamilan positif, kavum uteri kosong dengan cairan bebas, dan Hb yang turun cepat sudah cukup untuk bertindak. Tugas FKTP: dua jalur intravena besar, resusitasi kristaloid, oksigen, puasakan, pantau ketat, dan rujuk emergensi ke obgyn sambil menelepon lebih dulu agar kamar operasi siap. Jangan menunggu USG "yang lebih meyakinkan" atau kadar beta-hCG serial pada pasien yang sudah tidak stabil — pada ektopik terganggu, tindakan definitifnya bedah dan setiap penundaan dibayar dengan darah.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan kehamilan ektopik terganggu sebagai kompetensi 3B: dokter FKTP mengenali, menstabilkan, dan merujuk segera — bukan menegakkan diagnosis pasti atau menuntaskan terapi. Kriteria rujukan resminya tidak menuntut konfirmasi USG lebih dulu; kecurigaan klinis pada pasien tidak stabil sudah menjadi indikasi transfer emergensi ke fasilitas dengan kemampuan bedah dan bank darah.`,
    catatanRealita: 'Skenario ini mengasumsikan USG, tes kehamilan, kristaloid, oksigen, dan ambulans siap dalam hitungan menit. Di banyak Puskesmas, USG tidak ada dan ambulans sedang dipakai — dan itu justru memperkuat pelajarannya: tes kehamilan seharga puluhan ribu rupiah adalah alat penyelamat nyawa paling penting di ruangan itu. Kalau USG tak ada, jangan mencari-cari alasan untuk menunda;',
    mutiaraEbm: 'Bercak darah yang SEDIKIT justru menipu: dokter cenderung menilai keparahan dari darah yang terlihat, padahal pada ektopik terganggu perdarahannya tersembunyi di rongga perut dan yang keluar lewat jalan lahir hanya luruhan desidua. Pasien dengan bercak minimal bisa kehilangan dua liter darah. Demikian juga tes kehamilan positif TIDAK berarti kehamilan itu di dalam rahim, dan kavum uteri yang "berisi sesuatu" bisa hanya kantong semu (pseudogestational sac). Sebaliknya, tes kehamilan yang negatif secara meyakinkan pada dasarnya menyingkirkan ektopik — karena itu kelalaian terbesar bukan salah membaca USG, melainkan tidak pernah melakukan tes kehamilan sama sekali.',
    konsekuensi: {
      narasi: 'Bila nyeri ditutup dengan antispasmodik atau antasida dan pasien dipulangkan sebagai "gastritis"/"infeksi saluran kemih", perdarahan intraabdomen berlanjut tanpa jalur intravena, tanpa cairan, dan tanpa jejaring yang bersiap. Pasien jatuh ke syok hipovolemik dekompensata di rumah, sering saat tidak ada yang menemani.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Dibawa kembali beberapa jam kemudian dalam keadaan tidak sadar, nadi hanya teraba di lipat paha, akral dingin, dan perut membuncit penuh darah — kini kehilangan waktu emas untuk laparotomi.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 (kehamilan ektopik terganggu, kompetensi 3B); prinsip resusitasi syok hemoragik dan rujukan emergensi obstetri jejaring.',
    },
  }),

  // ---------------------------------------------------------------------------
  // 2. Plasenta previa
  // ---------------------------------------------------------------------------
  buatKasusOA({
    id: 'lab_plasenta_previa',
    nama: 'Perdarahan Antepartum karena Plasenta Previa',
    icd10: 'O44.1',
    skdi: '2',
    kategori: 'kia',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'obgyn',
    keluhanUtama: 'Tiba-tiba keluar darah merah segar banyak dari jalan lahir waktu saya sedang tiduran, tapi perut saya sama sekali tidak sakit.',
    demografi: { usiaMin: 25, usiaMax: 40, jenisKelamin: 'P' },
    vital: { td: '104/66', nadi: 98, rr: 20, suhu: 36.7, spo2: 99 },
    pembuka: {
      tanya: 'Coba ceritakan, darahnya keluar bagaimana dan sedang apa Ibu waktu itu?',
      jawab: 'Sekitar satu jam lalu saya lagi tiduran menonton televisi, tahu-tahu terasa basah. Darahnya merah segar, langsung banyak sampai sarung saya basah. Saya sama sekali tidak merasa apa-apa sebelumnya.',
      oldcarts: ['onset', 'karakter', 'keparahan'],
    },
    pertanyaan: [
      {
        id: 'q_nyeri',
        kategori: 'rps',
        tanya: 'Perutnya terasa mulas, kencang-kencang, atau nyeri — sebelum maupun sesudah darahnya keluar?',
        jawab: 'Tidak sama sekali, Dok. Perut saya lemas biasa, tidak mulas, tidak kencang. Justru itu yang membuat saya bingung, keluar darah banyak kok tidak sakit.',
        esensial: true,
        oldcarts: ['penyerta', 'karakter'],
        variasi: {
          polos: 'Ndak mules blas, Dok. Wong perut saya enak-enak saja. Cuma kaget lihat darahnya banyak.',
          terpelajar: 'Sama sekali tidak ada rasa nyeri maupun rasa mengencang pada perut saya, Dok, baik sebelum maupun sesudah darahnya keluar. Saya sengaja memperhatikan karena rasanya aneh.',
        },
      },
      {
        id: 'q_jumlah',
        kategori: 'rps',
        tanya: 'Kira-kira berapa banyak darahnya, dan apakah sampai sekarang masih keluar?',
        jawab: 'Kira-kira setengah gelas, membasahi sarung dan sprei. Sekarang masih merembes sedikit-sedikit di pembalut, warnanya tetap merah segar tanpa gumpalan hitam.',
        esensial: true,
        oldcarts: ['keparahan', 'karakter'],
        variasi: {
          polos: 'Banyak, Dok, sampai basah semua sarung sama sprei saya. Sekarang masih ngrembes dikit-dikit, merahnya masih segar, ndak ada yang hitam menggumpal.',
        },
      },
      {
        id: 'q_gerak_janin',
        kategori: 'rps',
        tanya: 'Gerakan bayinya bagaimana sejak darah keluar — masih seaktif biasa?',
        jawab: 'Masih, Dok. Tadi malah menendang beberapa kali sewaktu di perjalanan ke sini.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_usia_hamil',
        kategori: 'rps',
        tanya: 'Usia kandungan Ibu sekarang berapa, dan kapan taksiran lahirnya?',
        jawab: 'Kata bidan sekitar delapan bulan lebih, taksiran lahirnya awal bulan depan lagi. Ini kehamilan ketiga saya.',
        esensial: true,
        oldcarts: ['waktu'],
      },
      {
        id: 'q_sc',
        kategori: 'rpd',
        tanya: 'Dua anak sebelumnya lahir bagaimana — normal atau operasi?',
        jawab: 'Dua-duanya operasi caesar, Dok. Yang pertama tujuh tahun lalu, yang kedua empat tahun lalu.',
        esensial: true,
      },
      {
        id: 'q_pencetus',
        kategori: 'rps',
        tanya: 'Sebelum darahnya keluar, ada hubungan suami-istri, terjatuh, terbentur perutnya, atau perjalanan jauh yang berguncang?',
        jawab: 'Tidak ada semuanya, Dok. Saya benar-benar cuma tiduran. Tidak jatuh, tidak terbentur, dan tidak berhubungan sejak beberapa hari lalu.',
        esensial: true,
      },
      {
        id: 'q_usg_lalu',
        kategori: 'rpd',
        tanya: 'Sudah pernah diperiksa USG selama hamil ini? Apa yang dikatakan petugasnya soal letak ari-ari?',
        jawab: 'Pernah, dua bulan lalu. Petugasnya sempat bilang ari-arinya letaknya di bawah dan minta saya kontrol lagi, tapi saya tidak paham maksudnya dan tidak sempat kontrol karena sibuk.',
      },
      {
        id: 'q_darah_tinggi',
        kategori: 'rpd',
        tanya: 'Selama hamil ini tekanan darah Ibu pernah tinggi, atau ada bengkak di kaki dan wajah?',
        jawab: 'Tidak pernah. Setiap periksa di posyandu tensinya selalu dikatakan bagus, dan tidak ada bengkak.',
      },
      {
        id: 'q_makanan',
        kategori: 'sosial',
        tanya: 'Tadi Ibu makan apa? Ada makanan nanas, durian, atau jamu yang diminum?',
        jawab: 'Cuma nasi sama ikan goreng, Dok. Saya tidak minum jamu apa pun.',
        distraktor: true,
      },
      {
        id: 'q_kb_lalu',
        kategori: 'rpd',
        tanya: 'Sebelum hamil ini Ibu memakai KB apa?',
        jawab: 'Suntik tiga bulan, Dok, sekitar dua tahun. Lalu saya berhenti karena ingin punya anak lagi.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      {
        region: 'umum',
        temuan: 'Sadar penuh, tenang, tidak tampak kesakitan, dapat bicara kalimat penuh. Pemeriksaan dibatasi pada inspeksi luar — pemeriksaan dalam TIDAK dilakukan karena plasenta previa belum disingkirkan.',
        relevan: true,
      },
      {
        region: 'abdomen',
        temuan: 'Tinggi fundus setara ~34 minggu; uterus LUNAK, relaks, dan tidak nyeri tekan sama sekali; bagian-bagian janin mudah diraba; presentasi kepala tetapi kepala masih melayang tinggi dan belum masuk pintu atas panggul.',
        relevan: true,
      },
      {
        region: 'abdomen',
        temuan: 'Denyut jantung janin 142x/menit, reguler, tidak ada deselerasi saat diauskultasi selama satu menit penuh.',
        relevan: true,
      },
      {
        region: 'kulit',
        temuan: 'Inspeksi vulva: darah merah segar aktif merembes tanpa bekuan lama; pembalut terisi sekitar sepertiga dalam 30 menit. Konjungtiva agak pucat, akral hangat, waktu pengisian kapiler kurang dari 2 detik.',
        relevan: true,
      },
      {
        region: 'ekstremitas',
        temuan: 'Tidak ada pembengkakan tungkai; refleks fisiologis normal, tidak ada klonus.',
        relevan: false,
      },
      {
        region: 'toraks_paru',
        temuan: 'Suara napas vesikuler simetris tanpa ronki maupun mengi.',
        relevan: false,
      },
    ],
    lab: [
      {
        id: 'usg_obstetri',
        hasil: 'Janin tunggal hidup presentasi kepala, biometri sesuai ~34 minggu. Plasenta di segmen bawah rahim MENUTUP SELURUH ostium uteri internum (previa totalis). Tidak tampak hematom retroplasenta.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'hb',
        hasil: 'Hb 9,8 g/dL.',
        flag: 'rendah',
        relevan: true,
      },
      {
        id: 'golongan_darah',
        hasil: 'B Rh positif; hasil dicatat dan disertakan di surat rujukan untuk persiapan darah.',
        flag: 'normal',
        relevan: true,
      },
    ],
    diagnosisBanding: ['O44.1', 'O45.9', 'O46.9'],
    tatalaksana: {
      obatBenar: [],
      obatAlternatif: [['nacl_09_inf', 'ringer_laktat_inf']],
      obatSalahUmum: [
        {
          id: 'nifedipin_10',
          alasan: 'Diberikan sebagai tokolitik untuk "menghentikan kontraksi" pada pasien yang justru tidak berkontraksi sama sekali. Nifedipin menurunkan tekanan darah dan menyamarkan takikardia kompensasi, sehingga syok pada perdarahan aktif terlambat dikenali. Bila tokolisis memang dibutuhkan pada previa preterm, keputusannya di fasilitas rujukan yang siap melahirkan bayinya saat itu juga.',
          bahaya: 'kontraindikasi',
        },
        {
          id: 'asam_traneksamat_500_inj',
          alasan: 'Perdarahan previa berasal dari sinus plasenta yang robek secara mekanik di segmen bawah rahim — antifibrinolitik tidak menutup pembuluh yang terbuka secara anatomis. Memberinya menciptakan rasa "sudah bertindak" dan menunda satu-satunya terapi definitif: seksio sesarea di RS.',
          bahaya: 'nonPrimer',
        },
        {
          id: 'dexamethasone_05',
          alasan: 'Pematangan paru janin memang bagian tata laksana previa preterm, tetapi regimennya adalah deksametason INJEKSI 6 mg tiap 12 jam sebanyak 4 dosis yang diberikan di fasilitas yang siap menerima persalinan — bukan tablet 0,5 mg di FKTP, dan tidak boleh menjadi alasan menahan pasien satu malam untuk "menyelesaikan dosisnya".',
          bahaya: 'nonPrimer',
        },
      ],
      prosedur: ['pasang_infus', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        {
          id: 'transfusi_darah_fktp',
          alasan: 'Hb 9,8 g/dL pada pasien sadar penuh dengan akral hangat tidak menuntut transfusi darurat, dan Puskesmas tidak memiliki bank darah maupun uji silang. Yang dibutuhkan pasien ini adalah jalur intravena, ambulans, dan RS yang sudah menyiapkan darah — bukan kantong darah improvisasi yang justru menahannya di FKTP.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['tanda_bahaya_kehamilan', 'persiapan_rujukan_operatif', 'tanda_bahaya'],
      edukasiKritis: ['tanda_bahaya_kehamilan'],
    },
    stabilisasiWajib: ['pasang_infus'],
    clue: 'Perdarahan jalan lahir pada kehamilan lanjut yang merah segar, mendadak, tanpa pencetus, dan TANPA NYERI, pada perempuan dengan riwayat dua kali seksio, adalah plasenta previa sampai terbukti sebaliknya. Aturan tunggal yang paling penting: JANGAN LAKUKAN PEMERIKSAAN DALAM (vaginal toucher) pada perdarahan antepartum sebelum previa disingkirkan dengan USG — jari pemeriksa dapat merobek plasenta yang menutupi ostium dan mengubah rembesan menjadi perdarahan masif yang tak terkendali di ruangan tanpa kamar operasi. Yang boleh dan wajib dilakukan FKTP: inspeksi luar saja, pasang jalur intravena, istirahat baring, pantau ketat ibu dan denyut jantung janin, catat golongan darah, dan rujuk ke obgyn dengan surat yang menyebut "perdarahan antepartum, curiga previa, VT tidak dilakukan". Terapi definitifnya seksio sesarea; kalimat itu ditulis di RS, bukan di FKTP.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan plasenta previa sebagai kompetensi 2 — dokter FKTP mengenali dan merujuk, tidak menuntaskan. Larangan pemeriksaan dalam pada perdarahan antepartum sebelum previa disingkirkan adalah salah satu instruksi paling eksplisit dalam pedoman obstetri Kemenkes maupun internasional, dan sama-sama berlaku untuk pemeriksaan inspekulo yang dipaksakan. Kriteria rujukannya sederhana: setiap perdarahan antepartum adalah indikasi rujuk, tanpa memandang jumlah darah yang terlihat.`,
    catatanRealita: 'Skenario ini memberi Ibu USG di Puskesmas. Program USG antenatal Kemenkes sejak 2022 memang menempatkan USG di banyak Puskesmas, tetapi tidak di semua, dan operator terlatihnya lebih langka lagi. Justru di situlah larangan pemeriksaan dalam paling penting: kalau USG tidak ada, previa TIDAK dapat disingkirkan, sehingga pemeriksaan dalam tetap terlarang —',
    mutiaraEbm: 'Dua temuan klasik di sini justru menyesatkan. Pertama, "tidak nyeri" terasa menenangkan padahal justru itu penanda previa; yang nyeri dengan perut tegang seperti papan dan darah kehitaman adalah solusio plasenta — dan pada solusio, darah yang terlihat bisa sedikit atau tidak ada sama sekali karena tertahan di belakang plasenta, sehingga syok muncul jauh lebih berat daripada perdarahan yang tampak. Jangan pernah menilai keparahan perdarahan antepartum dari isi pembalut. Kedua, hasil USG trimester dua yang menyebut "plasenta letak rendah" sering diabaikan karena sebagian besar memang bermigrasi seiring pembesaran segmen bawah rahim — tetapi pada pasien dengan bekas seksio berulang, plasenta di segmen bawah wajib dicurigai menetap bahkan melekat abnormal (akreta), dan itu mengubah rencana persalinan secara total.',
    konsekuensi: {
      narasi: 'Bila pemeriksaan dalam dilakukan untuk "memastikan pembukaan", jari pemeriksa memisahkan plasenta dari segmen bawah rahim yang tipis. Rembesan berubah menjadi pancaran; ibu jatuh syok dalam hitungan menit di ruang periksa yang tidak punya darah, kamar operasi, maupun ahli bedah. Bila pasien justru ditahan semalam untuk "observasi dulu" atau untuk menyelesaikan obat, perdarahan berikutnya datang tanpa peringatan dan biasanya lebih besar dari yang pertama.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Perdarahan menjadi masif segera setelah pemeriksaan dalam: ibu pucat, tekanan darah tak terukur, denyut jantung janin melambat menjadi 80x/menit, dan ambulans baru berangkat saat ibu sudah tidak sadar.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 (plasenta previa, kompetensi 2); prinsip tata laksana perdarahan antepartum Kemenkes — larangan pemeriksaan dalam sebelum previa disingkirkan.',
    },
  }),

  // ---------------------------------------------------------------------------
  // 3. Penyakit radang panggul berat (curiga abses tubo-ovarium)
  // ---------------------------------------------------------------------------
  buatKasusOA({
    id: 'lab_penyakit_radang_panggul_berat',
    nama: 'Penyakit Radang Panggul Berat dengan Curiga Abses Tubo-Ovarium',
    icd10: 'N73.0',
    skdi: '3B',
    kategori: 'kia',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'obgyn',
    keluhanUtama: 'Perut bawah saya sakit sekali di kedua sisi, demam tinggi menggigil, dan keputihan saya banyak sekali sampai berbau, Dok.',
    demografi: { usiaMin: 20, usiaMax: 35, jenisKelamin: 'P' },
    vital: { td: '108/68', nadi: 112, rr: 22, suhu: 39.1, spo2: 98 },
    pembuka: {
      tanya: 'Sejak kapan perut bawahnya sakit dan bagaimana perkembangannya?',
      jawab: 'Sekitar lima hari, Dok. Awalnya cuma pegal di perut bawah kiri-kanan, sekarang sakitnya berat sampai saya jalan pun membungkuk. Dua hari terakhir demamnya tinggi sekali sampai menggigil.',
      oldcarts: ['onset', 'durasi', 'lokasi', 'keparahan'],
    },
    pertanyaan: [
      {
        id: 'q_keputihan',
        kategori: 'rps',
        tanya: 'Keputihannya seperti apa — warna, jumlah, baunya, dan sejak kapan berubah?',
        jawab: 'Sudah sekitar sepuluh hari, Dok. Banyak sekali sampai harus pakai pembalut tiap hari, warnanya kuning kehijauan, dan baunya busuk sampai saya malu.',
        esensial: true,
        oldcarts: ['karakter', 'durasi'],
        variasi: {
          polos: 'Keputihannya kental kuning ijo, Dok, banyak banget, baunya amis busuk. Saya sampai ganti celana dalam tiga kali sehari.',
          cemas: 'Ini kenapa ya Dok? Baunya sampai kecium sendiri, saya takut ini penyakit yang aneh-aneh. Warnanya kuning kehijauan, banyak sekali, sudah sepuluh harian. Apa ini kanker, Dok?',
        },
      },
      {
        id: 'q_haid',
        kategori: 'rps',
        tanya: 'Kapan haid terakhir Ibu, dan apakah ada kemungkinan hamil?',
        jawab: 'Haid terakhir dua minggu lalu, jumlahnya biasa dan tepat waktu. Rasanya tidak mungkin hamil, tapi saya juga tidak tahu pasti.',
        esensial: true,
        oldcarts: ['waktu'],
        variasi: {
          polos: 'Baru dua minggu lalu haidnya, Dok, biasa saja seperti bulan-bulan lain. Kayaknya sih tidak hamil, tapi ya saya tidak berani memastikan.',
        },
      },
      {
        id: 'q_hubungan',
        kategori: 'rps',
        tanya: 'Apakah terasa sakit saat berhubungan, atau ada darah setelahnya?',
        jawab: 'Iya, sakit sekali sampai saya tidak mau lagi. Kadang setelahnya ada bercak darah sedikit padahal bukan waktunya haid.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_pasangan',
        kategori: 'sosial',
        tanya: 'Bolehkah saya tanya soal pasangan Ibu — apakah beliau ada keluhan keluar cairan dari kemaluan atau perih saat buang air kecil?',
        jawab: 'Sebulan lalu suami saya sempat mengeluh keluar nanah dari kemaluannya dan perih kalau buang air kecil. Dia beli obat di warung sendiri, katanya sudah sembuh, jadi dia tidak mau periksa.',
        esensial: true,
      },
      {
        id: 'q_iud',
        kategori: 'rpd',
        tanya: 'Ibu sedang memakai KB? Kalau iya, jenis apa dan sejak kapan?',
        jawab: 'Saya pasang spiral sekitar delapan bulan lalu. Sejak itu keputihan saya memang jadi lebih banyak, tapi baru sekarang berbau.',
        esensial: true,
      },
      {
        id: 'q_riwayat_pid',
        kategori: 'rpd',
        tanya: 'Pernah sakit seperti ini sebelumnya, atau pernah diobati lama karena keputihan?',
        jawab: 'Setahun lalu pernah agak mirip tapi lebih ringan. Saya cuma minum obat dari apotek tiga hari lalu berhenti karena sudah enakan.',
      },
      {
        id: 'q_bak',
        kategori: 'rps',
        tanya: 'Ada perih atau anyang-anyangan saat buang air kecil?',
        jawab: 'Sedikit perih di ujung, tapi tidak bolak-balik ke kamar mandi seperti orang anyang-anyangan.',
      },
      {
        id: 'q_bab',
        kategori: 'rps',
        tanya: 'Ada mencret, sembelit, atau darah saat buang air besar?',
        jawab: 'Tidak ada, buang air besar saya biasa saja.',
      },
      {
        id: 'q_makanan',
        kategori: 'sosial',
        tanya: 'Akhir-akhir ini Ibu makan makanan pedas atau jajan sembarangan?',
        jawab: 'Biasa saja, Dok, masak sendiri di rumah. Tidak ada yang aneh.',
        distraktor: true,
      },
      {
        id: 'q_angkat_berat',
        kategori: 'sosial',
        tanya: 'Belakangan ini banyak mengangkat beban berat atau kecapekan?',
        jawab: 'Tidak, pekerjaan saya menjahit, duduk terus.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      {
        region: 'umum',
        temuan: 'Tampak sakit berat, wajah kemerahan, berkeringat, berjalan membungkuk memegangi perut bawah. Suhu aksila 39,1 derajat Celsius.',
        relevan: true,
      },
      {
        region: 'abdomen',
        temuan: 'Nyeri tekan hebat pada kedua kuadran bawah dengan defans muskular ringan dan nyeri lepas; nyeri tekan kanan bawah lebih dominan. Bising usus menurun.',
        relevan: true,
      },
      {
        region: 'abdomen',
        temuan: 'Pemeriksaan ginekologis: duh tubuh serviks kental kuning kehijauan berbau; nyeri goyang serviks sangat hebat sampai pasien menjerit; teraba massa adneksa kanan berbatas tak tegas berukuran sekitar 7 cm yang nyeri hebat; benang IUD tampak di ostium.',
        relevan: true,
      },
      {
        region: 'jantung',
        temuan: 'Takikardia sinus 112x/menit; bunyi jantung murni tanpa bising; akral hangat, waktu pengisian kapiler kurang dari 2 detik.',
        relevan: true,
      },
      {
        region: 'kepala_leher',
        temuan: 'Tidak ada pembesaran kelenjar getah bening leher; tidak ada kaku kuduk.',
        relevan: false,
      },
      {
        region: 'toraks_paru',
        temuan: 'Suara napas vesikuler simetris tanpa ronki.',
        relevan: false,
      },
    ],
    lab: [
      {
        id: 'tes_kehamilan',
        hasil: 'Negatif.',
        flag: 'normal',
        relevan: true,
      },
      {
        id: 'darah_rutin',
        hasil: 'Leukosit 19.800/µL dengan pergeseran ke kiri; Hb 11,6 g/dL; trombosit 402.000/µL.',
        flag: 'tinggi',
        relevan: true,
      },
      {
        id: 'usg_abdomen',
        hasil: 'Massa kompleks adneksa kanan 7,1 cm berisi cairan dan debris dengan sekat tebal, dinding tebal, tidak terpisahkan dari ovarium — sesuai abses tubo-ovarium. Cairan bebas sedikit di kavum Douglas. Uterus normal, IUD in situ.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'tes_hiv_serial',
        hasil: 'Non-reaktif (ditawarkan sebagai bagian skrining IMS, dengan persetujuan dan konseling singkat).',
        flag: 'normal',
        relevan: true,
      },
      {
        id: 'tes_sifilis',
        hasil: 'Non-reaktif.',
        flag: 'normal',
        relevan: true,
      },
    ],
    diagnosisBanding: ['N73.0', 'K35.9', 'N83.2'],
    tatalaksana: {
      obatBenar: ['ceftriaxone_1g_inj', 'doksisiklin_100', 'metronidazol_500'],
      obatAlternatif: [['paracetamol_500', 'ketorolak_30_inj']],
      obatSalahUmum: [
        {
          id: 'dexamethasone_05',
          alasan: 'Refleks "meredakan radang" pada kata radang panggul. Kortikosteroid menekan respons imun di tengah infeksi bakteri aktif dengan abses yang belum didrainase, menurunkan demam sehingga tampak membaik, lalu abses meluas atau pecah dalam senyap.',
          bahaya: 'kontraindikasi',
        },
        {
          id: 'ciprofloxacin_500',
          alasan: 'Kuinolon oral tunggal terasa "kuat" tetapi tidak lagi diandalkan untuk gonore karena resistensi yang tinggi, dan tidak mencakup anaerob yang mendominasi abses tubo-ovarium. Radang panggul menuntut regimen kombinasi, bukan satu antibiotik spektrum luas.',
          bahaya: 'nonPrimer',
        },
        {
          id: 'klotrimazol_vaginal_100',
          alasan: 'Setiap keputihan berbau otomatis dianggap jamur. Antijamur intravaginal tidak menyentuh infeksi yang sudah naik ke rahim, tuba, dan ovarium; pasien pulang merasa diobati sementara abses 7 cm terus membesar.',
          bahaya: 'nonPrimer',
        },
      ],
      prosedur: ['pasang_infus'],
      tindakanSalahUmum: [
        {
          id: 'insisi_abses',
          alasan: 'Abses tubo-ovarium bukan abses kulit. Ia terletak di rongga panggul, berdampingan dengan usus, ureter, dan pembuluh besar; insisi buta dari luar atau lewat forniks di FKTP dapat melubangi usus dan menumpahkan nanah ke rongga perut. Drainasenya dilakukan terpandu pencitraan atau lewat laparoskopi/laparotomi di RS.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['cegah_ims_pasangan', 'kepatuhan_obat', 'higiene_genital_lembut', 'tanda_bahaya'],
      edukasiKritis: ['cegah_ims_pasangan'],
    },
    clue: 'Nyeri perut bawah bilateral + demam tinggi + duh tubuh serviks berbau + nyeri goyang serviks pada perempuan usia subur dengan pasangan bergejala infeksi menular seksual adalah penyakit radang panggul, dan massa adneksa 7 cm menaikkannya menjadi curiga abses tubo-ovarium. Dua langkah wajib sebelum apa pun: singkirkan kehamilan (tes kehamilan, agar ektopik tidak terlewat dan agar pilihan antibiotik aman), lalu mulai regimen kombinasi yang mencakup gonokokus, klamidia, DAN anaerob — seftriakson 500 mg intramuskular dosis tunggal + doksisiklin 100 mg dua kali sehari 14 hari + metronidazol 500 mg dua kali sehari 14 hari (CDC STI Treatment Guidelines 2021; Kemenkes Pedoman Nasional Penanganan IMS). Antibiotik dosis pertama diberikan di FKTP, jangan menunggu di RS. Rujuk ke obgyn karena tiga hal sekaligus: abses tubo-ovarium, demam tinggi dengan tanda peritoneal, dan IUD yang perlu keputusan pelepasan oleh spesialis. Indikasi rujuk lain yang wajib dihafal: kehamilan, gagal rawat jalan setelah 72 jam, muntah sehingga obat oral tidak masuk, dan diagnosis bedah yang belum tersingkir.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan penyakit radang panggul sebagai kompetensi 3B ketika berat atau berkomplikasi: dokter FKTP memberi terapi awal lalu merujuk. Pedoman Nasional Penanganan IMS Kemenkes menekankan dua hal yang paling sering dilewatkan di lapangan: regimen harus mencakup anaerob, dan pengobatan pasangan adalah bagian dari terapi pasien — bukan anjuran tambahan. Kriteria rujukan resminya mencakup abses tubo-ovarium, kehamilan, tanda peritonitis, ketidakmampuan minum obat oral, dan kegagalan perbaikan dalam 72 jam.`,
    catatanRealita: 'Skenario ini memberi seftriakson, doksisiklin, metronidazol, USG, dan skrining IMS lengkap dalam satu kunjungan. Di Puskesmas nyata, hambatan terbesarnya bukan obat melainkan percakapan: menanyakan gejala pasangan, menawarkan tes HIV dan sifilis, dan meminta suami datang berobat membutuhkan ruang tertutup, waktu, dan keberanian yang jarang tersedia di poli dengan antrean 60 orang.',
    mutiaraEbm: 'Keputihan pada perempuan muda adalah keluhan yang paling sering diremehkan — dianggap "biasa", "kecapekan", atau "jamur" — padahal penyakit radang panggul adalah salah satu penyebab infertilitas dan kehamilan ektopik yang benar-benar dapat dicegah, dan kerusakan tubanya terjadi diam-diam pada episode yang gejalanya justru ringan. Yang menyesatkan berikutnya adalah menunggu gambaran "lengkap": leukosit yang normal, suhu yang normal, dan duh tubuh yang tidak mencolok TIDAK menyingkirkan diagnosis ini. Kriteria minimum CDC sengaja dibuat longgar — cukup nyeri tekan uterus, adneksa, ATAU nyeri goyang serviks pada perempuan berisiko — justru karena harga menunggu kepastian (tuba yang tersumbat seumur hidup) jauh lebih mahal daripada harga mengobati beberapa pasien yang ternyata bukan.',
    konsekuensi: {
      narasi: 'Bila diberi antijamur atau satu antibiotik tanggung lalu dipulangkan, abses tubo-ovarium terus membesar sampai pecah ke rongga perut. Bila pasangan tidak diobati, siklus infeksi ulang berjalan bertahun-tahun sampai kedua tuba tersumbat.',
      kembaliHariMin: 2,
      kembaliHariMax: 5,
      kondisiKembali: 'Kembali dengan perut tegang seperti papan, demam 40 derajat, tekanan darah 80/50 mmHg, dan nadi kecil cepat — abses telah pecah menjadi peritonitis dengan sepsis, dan kini kedua tuba serta ovarium terancam ikut diangkat.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 (penyakit radang panggul); Pedoman Nasional Penanganan Infeksi Menular Seksual Kemenkes; CDC STI Treatment Guidelines 2021.',
    },
  }),

  // ---------------------------------------------------------------------------
  // 4. Mola hidatidosa
  // ---------------------------------------------------------------------------
  buatKasusOA({
    id: 'lab_mola_hidatidosa',
    nama: 'Mola Hidatidosa (Hamil Anggur)',
    icd10: 'O01.9',
    skdi: '2',
    kategori: 'kia',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'obgyn',
    keluhanUtama: 'Saya hamil baru tiga bulan tapi perut saya sudah sebesar orang hamil lima bulan, dan muntahnya hebat sekali sampai badan saya habis.',
    demografi: { usiaMin: 18, usiaMax: 40, jenisKelamin: 'P' },
    vital: { td: '124/78', nadi: 108, rr: 20, suhu: 36.9, spo2: 98 },
    pembuka: {
      tanya: 'Coba ceritakan, apa yang paling mengganggu dari kehamilan ini?',
      jawab: 'Dua-duanya, Dok. Perut saya membesar terlalu cepat, tidak masuk akal untuk hamil tiga bulan. Dan muntahnya luar biasa, tidak seperti waktu hamil pertama dulu.',
      oldcarts: ['durasi', 'karakter', 'keparahan'],
    },
    pertanyaan: [
      {
        id: 'q_haid',
        kategori: 'rps',
        tanya: 'Kapan hari pertama haid terakhir Ibu?',
        jawab: 'Kira-kira dua belas minggu lalu, Dok. Saya ingat karena waktu itu bertepatan dengan lebaran.',
        esensial: true,
        oldcarts: ['waktu'],
      },
      {
        id: 'q_muntah',
        kategori: 'rps',
        tanya: 'Muntahnya seberapa hebat, dan apakah masih ada yang bisa masuk?',
        jawab: 'Sepanjang hari, Dok, bukan cuma pagi. Nasi baru sesuap sudah keluar lagi. Air masih bisa sedikit-sedikit. Berat badan saya turun tapi anehnya perut saya malah membesar.',
        esensial: true,
        oldcarts: ['keparahan', 'waktu'],
        variasi: {
          polos: 'Muntah terus, Dok, dari pagi sampai malam. Mau makan apa saja langsung balik lagi. Hamil yang pertama dulu ndak segini.',
          cemas: 'Parah sekali Dok, saya muntah belasan kali sehari, badan saya sudah kurus tapi perut malah buncit. Ini normal tidak sih Dok? Bayinya kenapa-kenapa tidak?',
        },
      },
      {
        id: 'q_darah',
        kategori: 'rps',
        tanya: 'Ada darah atau cairan yang keluar dari jalan lahir? Kalau ada, seperti apa bentuknya?',
        jawab: 'Ada bercak kecoklatan hilang timbul sejak dua minggu. Yang membuat saya takut, kemarin keluar butiran-butiran bening kecil seperti biji anggur bersama darahnya. Saya sampai menyimpannya di plastik, ini, Dok.',
        esensial: true,
        oldcarts: ['karakter', 'durasi'],
        variasi: {
          cemas: 'Ada bercak coklat-coklat dua mingguan ini, Dok, tapi yang bikin saya takut setengah mati itu kemarin keluar butiran bening kecil-kecil seperti biji anggur ikut sama darahnya. Ini saya bawa di plastik. Ini penyakit apa Dok, kok bisa keluar begini?',
        },
      },
      {
        id: 'q_usg_lalu',
        kategori: 'rpd',
        tanya: 'Selama hamil ini sudah pernah periksa atau di-USG?',
        jawab: 'Belum sama sekali, Dok. Ini pertama kalinya saya periksa. Saya pikir nanti saja kalau sudah agak besar.',
        esensial: true,
      },
      {
        id: 'q_riwayat_hamil',
        kategori: 'rpd',
        tanya: 'Ini kehamilan yang keberapa? Pernah keguguran atau pernah hamil anggur sebelumnya?',
        jawab: 'Kehamilan kedua. Yang pertama keguguran dua tahun lalu waktu usia dua bulan, dikuret di rumah sakit. Hamil anggur belum pernah.',
        esensial: true,
      },
      {
        id: 'q_hipertiroid',
        kategori: 'rps',
        tanya: 'Ada jantung berdebar-debar, tangan gemetar, gerah terus, atau berkeringat berlebihan?',
        jawab: 'Iya, Dok, dada saya sering berdebar kencang padahal tidak sedang apa-apa. Tangan saya juga gemetar dan saya gampang sekali berkeringat.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_gerak',
        kategori: 'rps',
        tanya: 'Sudah terasa gerakan bayinya?',
        jawab: 'Belum, tapi kata orang memang baru terasa nanti setelah empat bulan, jadi saya tidak curiga apa-apa.',
      },
      {
        id: 'q_sesak',
        kategori: 'rps',
        tanya: 'Ada sesak napas, nyeri dada, atau batuk berdarah?',
        jawab: 'Tidak ada, Dok. Napas saya biasa saja.',
      },
      {
        id: 'q_rpk_dm',
        kategori: 'rpk',
        tanya: 'Di keluarga ada yang punya penyakit gula atau darah tinggi?',
        jawab: 'Bapak saya kencing manis, Dok. Kalau darah tinggi tidak ada.',
        distraktor: true,
      },
      {
        id: 'q_alergi_makanan',
        kategori: 'rpd',
        tanya: 'Ada makanan yang membuat Ibu gatal-gatal atau bentol?',
        jawab: 'Tidak ada, saya makan apa saja tidak pernah gatal.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      {
        region: 'umum',
        temuan: 'Tampak lemas dan pucat; mukosa agak kering; berat badan tercatat turun 3 kg dari catatan bidan bulan lalu — kontras dengan perut yang justru membesar.',
        relevan: true,
      },
      {
        region: 'abdomen',
        temuan: 'Tinggi fundus setara ~20 minggu padahal usia kehamilan menurut haid terakhir 12 minggu; uterus lunak seperti adonan, TIDAK teraba bagian janin; denyut jantung janin TIDAK terdengar dengan Doppler pada usia di mana seharusnya sudah terdengar.',
        relevan: true,
      },
      {
        region: 'kulit',
        temuan: 'Konjungtiva pucat; telapak tangan hangat dan lembap; tidak ada kekuningan pada kulit maupun sklera.',
        relevan: true,
      },
      {
        region: 'ekstremitas',
        temuan: 'Tremor halus pada kedua tangan saat diekstensikan; tidak ada pembengkakan tungkai.',
        relevan: true,
      },
      {
        region: 'kepala_leher',
        temuan: 'Kelenjar tiroid tidak membesar, tidak teraba nodul, tidak ada bruit.',
        relevan: false,
      },
      {
        region: 'toraks_paru',
        temuan: 'Suara napas vesikuler simetris tanpa ronki.',
        relevan: false,
      },
    ],
    lab: [
      {
        id: 'tes_kehamilan',
        hasil: 'Positif sangat kuat — garis uji tebal pekat dan tetap positif pada pengenceran urine 1:100.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'usg_obstetri',
        hasil: 'Kavum uteri terisi massa ekogenik heterogen dengan banyak rongga kistik kecil (gambaran badai salju / sarang lebah). TIDAK tampak janin maupun denyut jantung janin. Kista teka-lutein bilateral, kanan 5,8 cm dan kiri 4,9 cm.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'hb',
        hasil: 'Hb 9,4 g/dL.',
        flag: 'rendah',
        relevan: true,
      },
      {
        id: 'tsh',
        hasil: 'TSH 0,04 µIU/mL (tertekan) — sesuai stimulasi tiroid oleh hCG yang sangat tinggi.',
        flag: 'rendah',
        relevan: true,
      },
    ],
    diagnosisBanding: ['O01.9', 'O03.9', 'O21.0'],
    tatalaksana: {
      obatBenar: [],
      obatAlternatif: [['nacl_09_inf', 'ringer_laktat_inf']],
      obatOpsional: ['ondansetron_4'],
      obatSalahUmum: [
        {
          id: 'propiltiourasil_100',
          alasan: 'Tanda hipertiroid di sini disebabkan hCG yang sangat tinggi menstimulasi reseptor tiroid, dan pulih sendiri setelah molanya dievakuasi. Memulai antitiroid di FKTP tidak menyentuh sumbernya, membawa risiko agranulositosis dan hepatotoksisitas tanpa pemantauan, dan yang terburuk: memberi ilusi bahwa masalahnya sedang ditangani sehingga rujukan tertunda.',
          bahaya: 'nonPrimer',
        },
        {
          id: 'asam_traneksamat_500_inj',
          alasan: 'Perdarahan mola berasal dari jaringan trofoblas yang rapuh dan sangat vaskular di dalam rahim. Antifibrinolitik tidak menghentikannya; satu-satunya yang menghentikannya adalah evakuasi jaringan itu sendiri di RS.',
          bahaya: 'nonPrimer',
        },
        {
          id: 'domperidon_10',
          alasan: 'Muntah hebat di sini bukan "mual kehamilan biasa yang agak berat" melainkan gejala dari kehamilan abnormal yang wajib dievakuasi. Memulangkan pasien dengan obat mual berarti melewatkan diagnosis dan, lebih jauh, melewatkan pemantauan beta-hCG yang menentukan apakah ia terkena keganasan trofoblas.',
          bahaya: 'nonPrimer',
        },
      ],
      prosedur: ['pasang_infus'],
      tindakanSalahUmum: [
        {
          id: 'transfusi_darah_fktp',
          alasan: 'Hb 9,4 g/dL pada pasien yang sadar penuh dengan tekanan darah stabil tidak menuntut transfusi, dan Puskesmas tidak punya bank darah maupun uji silang. Darah yang mungkin ia butuhkan disiapkan di RS tempat evakuasinya dilakukan — bukan ditunggu di FKTP.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['persiapan_rujukan_operatif', 'kontrol_rutin', 'tanda_bahaya'],
      edukasiKritis: ['persiapan_rujukan_operatif', 'kontrol_rutin'],
    },
    clue: 'Uterus jauh lebih besar dari usia kehamilan + mual-muntah luar biasa + bercak kecoklatan berisi gelembung seperti anggur + tidak ada janin maupun denyut jantung + tes kehamilan positif sangat kuat + gambaran badai salju pada USG = mola hidatidosa. Tanda hipertiroid dan kista teka-lutein bilateral melengkapi gambarannya, keduanya akibat kadar hCG yang sangat tinggi dan keduanya pulih setelah evakuasi. Tugas FKTP: kenali, pasang jalur intravena, koreksi dehidrasi, siapkan pasien untuk tindakan (puasa, dokumen, golongan darah), dan rujuk ke obgyn untuk evakuasi — biasanya kuretase isap, yang harus dilakukan di fasilitas dengan darah dan kamar operasi siaga karena perdarahan saat evakuasi bisa hebat. Yang paling sering terlupa dan paling menentukan nasib pasien BUKAN evakuasinya, melainkan apa yang terjadi sesudahnya: pemantauan beta-hCG serial sampai negatif dan tetap negatif selama berbulan-bulan, karena sekitar 15-20% mola komplet berkembang menjadi neoplasia trofoblas gestasional yang membutuhkan kemoterapi. Selama masa pemantauan itu pasien harus dicegah hamil, sebab kehamilan baru akan menaikkan hCG dan membuat pemantauannya mustahil dibaca — pilihan KB-nya ditentukan bersama spesialis setelah evakuasi.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan mola hidatidosa sebagai kompetensi 2 — dokter FKTP mengenali dan merujuk, tidak mengevakuasi. Ini bukan formalitas administratif: evakuasi mola bukan kuretase biasa, melainkan tindakan berisiko perdarahan masif yang menuntut darah siap pakai. Kriteria rujukannya mutlak: setiap kecurigaan mola dirujuk, dan surat rujukan sebaiknya menyebut kebutuhan pemantauan beta-hCG jangka panjang agar pasien tidak "hilang" dari sistem setelah kuretasenya selesai.`,
    catatanRealita: 'Kesenjangan terbesar kasus ini ada di ekornya, bukan di kepalanya. Rujukan dan evakuasi biasanya berjalan; yang runtuh adalah pemantauan beta-hCG selama 6-12 bulan, karena pemeriksaannya berbiaya, tidak selalu tersedia dekat rumah, dan pasien merasa sudah sembuh setelah perutnya mengempis. FKTP adalah pihak yang paling mungkin menjaga pasien tetap datang —',
    mutiaraEbm: 'Gambaran klasik "gelembung seperti anggur yang keluar" justru datang terlambat — ia menandakan mola yang sudah mulai lahir sendiri, dan menunggunya berarti melewatkan pasien yang datang lebih awal. Yang menyesatkan lainnya: uterus TIDAK selalu lebih besar dari usia kehamilan; pada sekitar sepertiga kasus ukurannya sesuai atau bahkan lebih kecil, sehingga "perut sesuai usia" tidak menyingkirkan mola. Sebaliknya, USG trimester pertama yang tampak seperti abortus tak lengkap sering ternyata mola parsial pada pemeriksaan jaringan — itulah sebabnya setiap jaringan hasil kuretase idealnya diperiksa patologi dan setiap perempuan pasca-kuretase diperiksa ulang hCG-nya, bukan hanya yang gambaran badai saljunya jelas.',
    konsekuensi: {
      narasi: 'Bila muntahnya dianggap "mual kehamilan yang berat" dan pasien dipulangkan dengan obat mual, perdarahan bertambah seiring molanya meluruh sendiri; jaringan dapat keluar sebagian dan menyebabkan perdarahan hebat di rumah. Bila pasien dirujuk tetapi tidak pernah dijelaskan soal pemantauan beta-hCG, ia menghilang setelah dikuret dan kembali berbulan-bulan kemudian dengan penyakit yang sudah menyebar.',
      kembaliHariMin: 3,
      kembaliHariMax: 10,
      kondisiKembali: 'Dibawa kembali dengan perdarahan hebat disertai gelembung-gelembung yang keluar bersama bekuan darah, pucat, dan tekanan darah 90/60 mmHg — kini evakuasi harus dikerjakan darurat pada pasien yang sudah anemis berat.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 (mola hidatidosa, kompetensi 2); prinsip tata laksana penyakit trofoblas gestasional — evakuasi di fasilitas rujukan dan pemantauan beta-hCG serial pasca-evakuasi.',
    },
  }),

  // ---------------------------------------------------------------------------
  // 5. Hiperemesis gravidarum berat
  // ---------------------------------------------------------------------------
  buatKasusOA({
    id: 'lab_hiperemesis_gravidarum_berat',
    nama: 'Hiperemesis Gravidarum Berat dengan Ketosis',
    icd10: 'O21.1',
    skdi: '3B',
    kategori: 'kia',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'obgyn',
    keluhanUtama: 'Sudah empat hari saya muntah terus-terusan, air pun tidak bisa masuk, badan saya lemas sekali sampai tidak kuat berdiri.',
    demografi: { usiaMin: 20, usiaMax: 35, jenisKelamin: 'P' },
    vital: { td: '96/60', nadi: 116, rr: 20, suhu: 36.9, spo2: 99 },
    pembuka: {
      tanya: 'Coba ceritakan, muntahnya bagaimana dan sejak kapan sampai tidak ada yang bisa masuk?',
      jawab: 'Mualnya sebenarnya sudah sebulan, tapi empat hari terakhir ini beda sekali. Apa pun yang masuk langsung keluar lagi, bahkan air putih. Saya sudah tidak makan sama sekali sejak Senin.',
      oldcarts: ['durasi', 'keparahan', 'karakter'],
    },
    pertanyaan: [
      {
        id: 'q_berat',
        kategori: 'rps',
        tanya: 'Berapa berat badan Ibu sebelum hamil, dan berapa saat ditimbang terakhir?',
        jawab: 'Sebelum hamil 54 kilo, Dok. Kemarin di bidan ditimbang 50 kilo. Baju saya sampai longgar semua.',
        esensial: true,
        oldcarts: ['keparahan'],
      },
      {
        id: 'q_bak',
        kategori: 'rps',
        tanya: 'Sejak kemarin berapa kali buang air kecil, dan bagaimana warnanya?',
        jawab: 'Cuma dua kali sejak kemarin pagi, itu pun sedikit sekali. Warnanya pekat seperti teh dan baunya menyengat.',
        esensial: true,
        oldcarts: ['penyerta'],
        variasi: {
          polos: 'Jarang banget, Dok. Sehari cuma dua kali, keluarnya sedikit, warnanya coklat tua kaya teh.',
        },
      },
      {
        id: 'q_haid',
        kategori: 'rps',
        tanya: 'Kapan haid terakhir Ibu, dan sudah tes kehamilan?',
        jawab: 'Telat sepuluh minggu, Dok. Saya sudah tes sendiri di rumah dan hasilnya dua garis. Ini kehamilan pertama saya.',
        esensial: true,
        oldcarts: ['waktu'],
        variasi: {
          polos: 'Sudah telat sepuluh mingguan, Dok. Saya tes sendiri di rumah, garisnya dua. Ini hamil pertama saya, jadi saya belum tahu apa-apa.',
        },
      },
      {
        id: 'q_isi_muntah',
        kategori: 'rps',
        tanya: 'Yang keluar saat muntah itu berisi apa — ada darah, atau cairan kehijauan?',
        jawab: 'Awalnya makanan, sekarang cuma air bening yang rasanya pahit sekali. Tidak ada darah dan tidak ada yang hijau.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_perut_besar',
        kategori: 'rps',
        tanya: 'Perut Ibu terasa membesar melebihi usia kehamilan? Ada bercak darah atau butiran keluar dari jalan lahir?',
        jawab: 'Tidak, perut saya masih rata seperti biasa, malah tambah kempes karena kurus. Tidak ada darah atau apa pun yang keluar.',
        esensial: true,
      },
      {
        id: 'q_penglihatan',
        kategori: 'rps',
        tanya: 'Ada pandangan dobel, bingung, atau jalan terasa sempoyongan seperti mau jatuh?',
        jawab: 'Tidak, Dok. Penglihatan saya jelas dan pikiran saya masih terang. Cuma badannya yang lemas sekali.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_demam_diare',
        kategori: 'rps',
        tanya: 'Ada demam, mencret, atau ada orang serumah yang sakit sama?',
        jawab: 'Tidak ada demam, tidak mencret, dan di rumah tidak ada yang sakit.',
      },
      {
        id: 'q_obat',
        kategori: 'rpd',
        tanya: 'Sudah minum obat apa saja, termasuk obat warung, vitamin, atau jamu?',
        jawab: 'Bidan kasih vitamin dan tablet penambah darah, tapi malah bikin saya tambah mual jadi tidak saya minum. Saya juga sempat minum jahe dan obat maag dari warung.',
      },
      {
        id: 'q_pedas',
        kategori: 'sosial',
        tanya: 'Ibu suka makan pedas atau asam?',
        jawab: 'Dulu iya, sekarang lihat makanan apa saja langsung mual.',
        distraktor: true,
      },
      {
        id: 'q_rpk_maag',
        kategori: 'rpk',
        tanya: 'Ada anggota keluarga yang punya sakit maag?',
        jawab: 'Ibu saya katanya maag, Dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      {
        region: 'umum',
        temuan: 'Tampak lemah dan apatis ringan, berbaring, bicara pelan tetapi kalimat penuh; tercium bau napas seperti buah masak. Berat badan turun 4 kg dari berat sebelum hamil (7,4% — melebihi ambang 5%).',
        relevan: true,
      },
      {
        region: 'mata',
        temuan: 'Kedua bola mata tampak cekung; gerak bola mata penuh ke segala arah, tidak ada nistagmus.',
        relevan: true,
      },
      {
        region: 'tht_mulut',
        temuan: 'Bibir pecah-pecah, mukosa mulut dan lidah sangat kering; tidak ada erosi gigi maupun luka di mulut.',
        relevan: true,
      },
      {
        region: 'kulit',
        temuan: 'Turgor kulit menurun, kembali lambat setelah dicubit; akral dingin, waktu pengisian kapiler 3 detik.',
        relevan: true,
      },
      {
        region: 'abdomen',
        temuan: 'Perut datar dan lemas, tidak nyeri tekan, bising usus normal; fundus uteri belum teraba di atas simfisis — sesuai usia kehamilan dan tidak mendukung mola.',
        relevan: true,
      },
      {
        region: 'toraks_paru',
        temuan: 'Suara napas vesikuler simetris tanpa ronki; tidak ada napas cepat dalam.',
        relevan: false,
      },
    ],
    lab: [
      {
        id: 'keton_urin',
        hasil: 'Keton +3 (positif kuat).',
        flag: 'tinggi',
        relevan: true,
      },
      {
        id: 'elektrolit_serum',
        hasil: 'Natrium 131 mmol/L, kalium 3,0 mmol/L, klorida 92 mmol/L.',
        flag: 'rendah',
        relevan: true,
      },
      {
        id: 'urinalisis',
        hasil: 'Berat jenis 1,030; keton positif kuat; protein negatif; nitrit negatif; leukosit esterase negatif.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'tes_kehamilan',
        hasil: 'Positif.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'usg_obstetri',
        hasil: 'Kantong kehamilan intrauterin tunggal dengan janin hidup sesuai 10 minggu; tidak ada gambaran mola maupun kehamilan kembar.',
        flag: 'normal',
        relevan: true,
      },
    ],
    diagnosisBanding: ['O21.1', 'O01.9', 'A09'],
    tatalaksana: {
      obatBenar: [],
      obatAlternatif: [
        ['nacl_09_inf', 'ringer_laktat_inf'],
        ['ondansetron_4', 'dimenhidrinat_50'],
      ],
      obatOpsional: ['vitamin_b_kompleks'],
      obatSalahUmum: [
        {
          id: 'antasida_doen',
          alasan: 'Muntah pada perempuan muda otomatis dilabeli "maag". Antasida tidak mengoreksi dehidrasi, tidak menyentuh ketosis, tidak mengembalikan kalium yang habis — dan yang paling merugikan, ia memberi izin untuk memulangkan pasien yang sudah kehilangan 7% berat badannya.',
          bahaya: 'nonPrimer',
        },
        {
          id: 'tablet_fe',
          alasan: 'Tablet tambah darah adalah refleks pada setiap ibu hamil, tetapi zat besi oral adalah salah satu pemicu mual paling kuat dan pasien ini sudah menyebutnya sendiri. Menambahkannya sekarang memperberat muntah tanpa manfaat apa pun; besi ditunda sampai muntahnya terkendali.',
          bahaya: 'nonPrimer',
        },
        {
          id: 'dexamethasone_05',
          alasan: 'Kortikosteroid pada hiperemesis adalah pilihan terakhir di fasilitas rujukan setelah rehidrasi dan antiemetik berjenjang gagal, dengan pertimbangan khusus sebelum usia 10 minggu — dan regimennya bukan tablet 0,5 mg. Memakainya sebagai jalan pintas di FKTP melompati semua terapi yang sebenarnya bekerja pada pasien ini: cairan.',
          bahaya: 'nonPrimer',
        },
      ],
      prosedur: ['pasang_infus', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        {
          id: 'bilas_lambung',
          alasan: 'Muntah hebat dengan cairan pahit kadang dikira keracunan makanan atau "lambung penuh asam". Bilas lambung tidak berperan sama sekali pada hiperemesis, berisiko aspirasi pada pasien yang sudah lemah, dan merampas waktu dari satu-satunya terapi yang mendesak: rehidrasi intravena.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['tanda_bahaya_kehamilan', 'anc_rutin', 'istirahat_cukup'],
      edukasiKritis: ['tanda_bahaya_kehamilan'],
    },
    stabilisasiWajib: ['pasang_infus'],
    clue: 'Muntah kehamilan menjadi hiperemesis gravidarum ketika ada trias objektif: penurunan berat badan lebih dari 5% berat sebelum hamil, tanda dehidrasi, dan gangguan metabolik (ketosis, hipokalemia, hiponatremia). Pasien ini memenuhi ketiganya. Yang wajib dikerjakan FKTP: pasang jalur intravena dan rehidrasi dengan kristaloid — NaCl 0,9% atau ringer laktat, bukan larutan hipotonik; berikan antiemetik; koreksi kalium sesuai kemampuan fasilitas; pantau produksi urine dan tanda vital. Satu hal yang sering dilupakan dan konsekuensinya permanen: pada muntah lebih dari tiga minggu, berikan tiamin SEBELUM atau bersamaan dengan cairan yang mengandung glukosa, karena beban glukosa pada cadangan tiamin yang kosong dapat mencetuskan ensefalopati Wernicke yang tidak dapat dipulihkan — di sini vitamin B kompleks dimasukkan sebagai opsional untuk maksud itu. Rujuk ke obgyn bila rehidrasi gagal, ketosis menetap, kalium sangat rendah, muncul gejala neurologis, atau fasilitas tidak mampu merawat inap.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan hiperemesis gravidarum sebagai kompetensi 3B: dokter FKTP memulai rehidrasi dan terapi awal, lalu merujuk bila tidak membaik atau bila perawatan inap tidak memungkinkan. Kriteria rujukan resminya berpusat pada kegagalan asupan oral setelah rehidrasi, gangguan elektrolit bermakna, penurunan berat badan progresif, dan setiap tanda neurologis.`,
    catatanRealita: 'Status keamanan ondansetron pada trimester pertama TIDAK bulat, dan skenario ini tidak akan berpura-pura sebaliknya. Data kohort besar tidak menunjukkan peningkatan malformasi mayor yang bermakna secara keseluruhan, tetapi beberapa studi melaporkan kemungkinan peningkatan absolut yang sangat kecil pada celah bibir/langit-langit, dan perdebatannya belum selesai.',
    mutiaraEbm: 'Keparahan hiperemesis tidak diukur dari "berapa kali muntah" — angka itu subjektif, tergantung ingatan dan kecemasan pasien, dan membuat dokter menunggu sampai pasien terdengar cukup dramatis. Yang membedakan hiperemesis dari mual-muntah kehamilan biasa adalah bukti objektif: penurunan berat badan lebih dari 5%, tanda dehidrasi, dan keton urin. Tetapi keton pun punya jebakannya sendiri: keton urin adalah penanda kelaparan, bukan penanda dehidrasi, sehingga bisa positif pada siapa pun yang tidak makan seharian dan bisa tetap positif setelah rehidrasi berhasil. Jangan memakainya sebagai satu-satunya tolok ukur keberhasilan terapi — yang dinilai adalah tanda vital, produksi urine, dan kemampuan minum. Dan satu perangkap terakhir: pasien yang perutnya jauh lebih besar dari usia kehamilan atau yang hCG-nya sangat tinggi harus di-USG sebelum dilabeli hiperemesis, karena mola dan kehamilan kembar bersembunyi persis di balik keluhan yang sama.',
    konsekuensi: {
      narasi: 'Bila dipulangkan dengan obat maag dan antiemetik oral yang tidak mungkin tertelan, dehidrasi dan hipokalemia berlanjut. Bila muntahnya sudah berminggu-minggu dan pasien akhirnya diinfus dengan cairan berglukosa tanpa tiamin lebih dulu, ensefalopati Wernicke dapat muncul justru setelah "diobati".',
      kembaliHariMin: 1,
      kembaliHariMax: 3,
      kondisiKembali: 'Dibawa kembali dalam keadaan sangat lemah, bicara melantur, mata bergerak-gerak sendiri, dan tidak mampu berjalan tanpa dipapah — gambaran ensefalopati Wernicke yang sebagian defisitnya menetap seumur hidup.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 (hiperemesis gravidarum, kompetensi 3B); prinsip rehidrasi dan pencegahan ensefalopati Wernicke pada muntah berkepanjangan.',
    },
  }),

  // ---------------------------------------------------------------------------
  // 6. Fraktur tertutup antebrachii pada anak
  // ---------------------------------------------------------------------------
  buatKasusOA({
    id: 'lab_fraktur_tertutup_antebrachii_anak',
    nama: 'Fraktur Tertutup Lengan Bawah Anak - Stabilisasi Pra-Rujuk',
    icd10: 'S52.5',
    skdi: '3B',
    kategori: 'muskuloskeletal',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'bedah',
    keluhanUtama: 'Anak saya jatuh dari sepeda, tangannya jadi bengkok dan dia tidak mau menggerakkannya sama sekali, Dok.',
    keluhanUtamaOlehPendamping: true,
    demografi: { usiaMin: 5, usiaMax: 12 },
    vital: { td: '100/64', nadi: 108, rr: 22, suhu: 36.7, spo2: 99 },
    pembuka: {
      tanya: 'Bagaimana kejadiannya dan bagian mana yang paling sakit?',
      jawab: 'Sekitar empat puluh menit lalu dia main sepeda di gang, lalu oleng dan jatuh ke depan. Yang kena lengan bawah kanannya. Sekarang bentuknya bengkok dan dia menangis kalau disentuh sedikit saja.',
      oldcarts: ['onset', 'lokasi', 'karakter'],
    },
    pertanyaan: [
      {
        id: 'q_mekanisme',
        kategori: 'rps',
        tanya: 'Waktu jatuh, apa yang menahan badannya? Kecepatannya seberapa dan apakah dia terpental?',
        jawab: 'Dia menahan badannya dengan telapak tangan kanan di aspal. Sepedanya pelan saja, sedang belajar, tidak terpental dan tidak ada kendaraan lain.',
        esensial: true,
        oldcarts: ['keparahan'],
      },
      {
        id: 'q_kepala',
        kategori: 'rps',
        tanya: 'Kepalanya ikut terbentur? Apakah dia sempat pingsan, muntah, atau tampak bingung setelah jatuh?',
        jawab: 'Tidak, Dok. Kepalanya tidak kena, dia pakai helm. Langsung menangis kencang dan sadar terus sampai sekarang, tidak muntah.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_luka',
        kategori: 'rps',
        tanya: 'Ada luka terbuka, tulang yang menonjol keluar, atau perdarahan di lengannya?',
        jawab: 'Tidak ada luka sama sekali, Dok. Kulitnya utuh, cuma bengkak dan bentuknya bengkok. Tidak ada darah setetes pun.',
        esensial: true,
        variasi: {
          wali_anak: 'Tidak ada luka, Dok, kulitnya utuh, tidak berdarah sama sekali. Cuma memang bengkak dan bentuknya jadi bengkok, itu yang bikin saya ngeri melihatnya.',
        },
      },
      {
        id: 'q_jari',
        kategori: 'rps',
        tanya: 'Jari-jarinya masih bisa dia gerakkan? Ada yang terasa kebas, dingin, atau tampak pucat?',
        jawab: 'Masih bisa dia gerak-gerakkan pelan walau sambil meringis. Jarinya hangat, warnanya biasa, dan dia bilang tidak kebas.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_pertolongan',
        kategori: 'sosial',
        tanya: 'Sebelum ke sini, ada yang sempat memijat, menarik, atau mencoba meluruskan tangannya?',
        jawab: 'Tetangga saya sempat mau menarik supaya lurus, katanya biar cepat sembuh. Tapi anak saya menjerit jadi langsung dihentikan. Ibu saya malah menyuruh ke tukang urut saja daripada ke Puskesmas.',
        esensial: true,
        variasi: {
          cemas: 'Aduh Dok, jangan-jangan salah ya? Tetangga tadi mau menarik biar lurus, anak saya sampai menjerit-jerit, terus dilepas lagi. Nenek anak ini maksa bawa ke tukang urut, saya ngotot ke sini. Salah tidak ya saya, Dok?',
          wali_anak: 'Sempat ada yang mau menarik supaya lurus, Dok, tapi anak saya menjerit jadi tidak jadi. Ada juga yang menyarankan bawa ke tukang urut, tapi saya takut malah tambah parah, jadi saya bawa ke sini.',
        },
      },
      {
        id: 'q_makan',
        kategori: 'rps',
        tanya: 'Kapan terakhir dia makan atau minum sesuatu?',
        jawab: 'Sekitar satu jam sebelum jatuh dia makan siang, nasi sama telur. Setelah jatuh belum minum apa-apa karena menangis terus.',
        esensial: true,
        oldcarts: ['waktu'],
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Dia ada alergi obat, atau sedang minum obat rutin untuk penyakit tertentu?',
        jawab: 'Tidak ada, Dok. Dia sehat, tidak pernah minum obat rutin dan belum pernah alergi apa pun.',
      },
      {
        id: 'q_riwayat_patah',
        kategori: 'rpd',
        tanya: 'Pernah patah tulang sebelumnya, atau tulangnya pernah dibilang mudah patah?',
        jawab: 'Belum pernah sama sekali. Ini yang pertama.',
      },
      {
        id: 'q_imunisasi',
        kategori: 'rpd',
        tanya: 'Imunisasinya lengkap sesuai jadwal posyandu?',
        jawab: 'Lengkap semua, Dok, ada catatannya di buku KIA. Yang terakhir waktu kelas satu di sekolah.',
        distraktor: true,
      },
      {
        id: 'q_sekolah',
        kategori: 'sosial',
        tanya: 'Dia sudah sekolah? Sering ikut olahraga atau kegiatan fisik?',
        jawab: 'Kelas tiga, Dok. Suka main bola sama sepedaan di gang, memang aktif sekali anaknya.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      {
        region: 'umum',
        temuan: 'Anak sadar penuh, menangis kesakitan tetapi dapat ditenangkan ibunya; tidak ada tanda syok; survei cepat tidak menemukan cedera lain; anak memegangi lengan kanannya sendiri dengan tangan kiri.',
        relevan: true,
      },
      {
        region: 'ekstremitas',
        temuan: 'Lengan bawah kanan sepertiga distal tampak bengkok ke arah punggung tangan menyerupai garpu, bengkak sedang dengan memar; KULIT UTUH — tidak ada luka, tidak ada fragmen tulang yang menembus; nyeri tekan sangat terlokalisir di atas deformitas.',
        relevan: true,
      },
      {
        region: 'ekstremitas',
        temuan: 'Status neurovaskular distal SEBELUM bidai: nadi radialis teraba kuat, jari hangat, waktu pengisian kapiler kurang dari 2 detik; sensasi raba jari I sampai V utuh; anak mampu menggerakkan seluruh jari walau enggan; kompartemen lengan bawah lunak, tidak tegang, tidak nyeri pada peregangan pasif jari.',
        relevan: true,
      },
      {
        region: 'neurologis',
        temuan: 'Sadar penuh, orientasi baik sesuai usia, tidak ada defisit fokal.',
        relevan: false,
      },
      {
        region: 'kepala_leher',
        temuan: 'Tidak ada jejas di kepala maupun wajah; leher tidak nyeri tekan, gerak leher bebas tanpa nyeri.',
        relevan: false,
      },
      {
        region: 'abdomen',
        temuan: 'Perut lemas, tidak nyeri tekan, tidak ada jejas.',
        relevan: false,
      },
    ],
    lab: [
      {
        id: 'foto_ekstremitas',
        hasil: 'Fraktur transversal radius distal kanan dengan angulasi dorsal sekitar 25 derajat dan pergeseran ringan; ulna intak; lempeng pertumbuhan tampak utuh; tidak ada udara di jaringan lunak dan kontinuitas kulit tidak terputus.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'darah_rutin',
        hasil: 'Hb 12,6 g/dL; leukosit 9.800/µL; trombosit normal — tidak mengubah tata laksana apa pun pada fraktur tertutup terisolasi dan tidak boleh menjadi alasan menunda rujukan.',
        flag: 'normal',
        relevan: false,
      },
    ],
    diagnosisBanding: ['S52.5', 'S52.6', 'S63.5'],
    tatalaksana: {
      obatBenar: [],
      obatAlternatif: [['paracetamol_sirup', 'paracetamol_500']],
      obatOpsional: ['ibuprofen_400'],
      obatSalahUmum: [
        {
          id: 'tramadol_50',
          alasan: 'Terlihat sebagai jawaban logis untuk nyeri fraktur yang hebat, tetapi tramadol dikontraindikasikan pada anak di bawah 12 tahun: metabolismenya lewat CYP2D6 sangat bervariasi, dan pada metabolizer cepat kadar opioid aktif melonjak tak terduga sampai menyebabkan depresi napas. FDA dan EMA membatasi penggunaannya pada anak justru setelah laporan kematian. Nyeri fraktur anak dikelola dengan analgesia berbasis berat badan ditambah bidai yang baik — imobilisasi yang benar adalah analgesik paling kuat di ruangan ini.',
          bahaya: 'kontraindikasi',
        },
        {
          id: 'vaksin_td',
          alasan: 'Refleks "patah tulang sama dengan profilaksis tetanus" terbawa dari fraktur terbuka. Di sini kulit anak UTUH sehingga tidak ada pintu masuk spora tetanus; imunisasinya pun lengkap. Memberikannya adalah tindakan tanpa indikasi yang menyakiti anak dan menghabiskan stok vaksin.',
          bahaya: 'nonPrimer',
        },
        {
          id: 'amoxicillin_sirup',
          alasan: 'Antibiotik pada fraktur adalah untuk fraktur TERBUKA, di mana ada luka yang menghubungkan tulang dengan dunia luar. Pada fraktur tertutup tidak ada indikasi apa pun; yang tersisa hanyalah efek samping dan tekanan resistensi.',
          bahaya: 'nonPrimer',
        },
      ],
      prosedur: ['imobilisasi_bidai'],
      tindakanSalahUmum: [
        {
          id: 'antibiotik_parenteral_fraktur_protokol',
          alasan: 'Protokol antibiotik parenteral dini adalah komponen wajib pada fraktur TERBUKA dan sama sekali tidak berlaku di sini. Memilihnya menandakan "paket fraktur" dijalankan tanpa membedakan tertutup dan terbuka — padahal perbedaan itulah keputusan klinis utama pada kasus ini.',
          bahaya: 'nonPrimer',
        },
        {
          id: 'irigasi_luka_fraktur_terbuka',
          alasan: 'Tidak ada luka untuk diirigasi. Selain tanpa sasaran, tindakan ini bahkan pada fraktur terbuka pun tidak boleh dikerjakan di luar kamar operasi. Memilihnya berarti gagal membaca temuan paling penting dari pemeriksaan: kulit yang utuh.',
          bahaya: 'nonPrimer',
        },
      ],
      edukasi: ['keselamatan_fraktur_rujuk', 'persiapan_rujukan_operatif', 'tanda_bahaya'],
      edukasiKritis: ['keselamatan_fraktur_rujuk'],
    },
    stabilisasiWajib: ['imobilisasi_bidai'],
    clue: 'Deformitas jelas + bengkak + menolak menggerakkan lengan setelah jatuh bertumpu telapak tangan = fraktur lengan bawah sampai terbukti sebaliknya. Dua hal harus dijawab lebih dulu karena mengubah segalanya: apakah TERTUTUP atau terbuka (di sini kulit utuh, sehingga tidak ada indikasi antibiotik profilaksis maupun tetanus), dan bagaimana status NEUROVASKULAR distal (di sini utuh). Urutan kerja FKTP: analgesia berbasis berat badan lebih dulu — parasetamol 15 mg/kg, boleh dikombinasi ibuprofen 10 mg/kg bila nyeri sedang dan tidak ada kontraindikasi; periksa dan CATAT nadi, warna, suhu, sensasi, serta gerak jari SEBELUM bidai; pasang bidai yang melewati dua sendi (siku dan pergelangan) dalam posisi ditemukan tanpa memaksa meluruskan; periksa dan CATAT ULANG status neurovaskular SESUDAH bidai; tinggikan lengan dan rujuk ke bedah untuk reposisi dengan analgesia serta pencitraan yang memadai. Yang TIDAK boleh dilakukan FKTP: mencoba reposisi buta. Meluruskan tulang tanpa analgesia adekuat, tanpa relaksasi, dan tanpa kemampuan mengonfirmasi hasilnya berarti mengubah fraktur tertutup menjadi cedera saraf, cedera pembuluh, atau fraktur terbuka — dan pada anak, fragmen yang dipaksa dapat merusak lempeng pertumbuhan sehingga lengannya tumbuh bengkok permanen.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan fraktur sebagai kompetensi 3B: dokter FKTP memberi analgesia, melakukan imobilisasi, menilai neurovaskular, lalu merujuk — reposisi definitif bukan kewenangan FKTP. Kriteria rujukan resminya mencakup setiap fraktur dengan deformitas atau pergeseran, setiap fraktur pada anak yang melibatkan atau berdekatan dengan lempeng pertumbuhan, dan setiap gangguan neurovaskular. Perbedaan tata laksana antara fraktur tertutup dan terbuka — antibiotik parenteral dini dan profilaksis tetanus HANYA pada yang terbuka — adalah pembeda yang eksplisit di pedoman.`,
    catatanRealita: 'Dua celah jujur di kasus ini. Pertama, dosis: kosakata game menampilkan sediaan tetap (parasetamol sirup, parasetamol 500 mg, ibuprofen 400 mg), sedangkan analgesia anak selalu dihitung per kilogram berat badan — pada usia 5 tahun sediaan sirup yang dipakai, pada anak yang lebih besar tablet baru masuk akal.',
    mutiaraEbm: 'Jari yang masih bisa digerakkan dan nadi yang masih teraba TIDAK menyingkirkan sindrom kompartemen — dan itulah kesalahan yang paling mahal pada fraktur lengan bawah anak. Nadi menghilang paling akhir, jauh setelah otot mulai mati; tanda paling dini justru nyeri yang tidak sebanding dengan cederanya, nyeri hebat saat jari diregangkan secara pasif, dan kebutuhan analgesia yang terus meningkat. Karena itu jangan pernah membaca "nadi teraba" sebagai izin untuk tenang; yang dipantau adalah tren nyeri, bukan sekali pemeriksaan. Jebakan kedua khusus anak: rontgen yang tampak normal sama sekali tidak menyingkirkan fraktur, karena tulang anak yang lentur bisa hanya membengkok (buckle/greenstick) atau retak di lempeng pertumbuhan yang tulang rawannya tidak tertangkap sinar-X. Anak yang menolak memakai lengannya setelah trauma jelas diperlakukan sebagai fraktur — dibidai dan dirujuk — berapa pun bagusnya foto rontgennya.',
    konsekuensi: {
      narasi: 'Bila lengan dikirim tanpa bidai atau justru ditarik-tarik untuk "diluruskan", fragmen bergeser di dalam dan mencederai saraf median serta pembuluh; perdarahan ke dalam kompartemen yang tertutup fasia meningkatkan tekanan sampai aliran darah otot berhenti. Bila keluarga dibiarkan membawanya ke tukang urut, tulang menyambung dalam posisi bengkok dan koreksinya kelak menuntut operasi besar.',
      kembaliHariMin: 0,
      kembaliHariMax: 2,
      kondisiKembali: 'Dibawa kembali keesokan harinya dengan lengan bawah tegang keras, nyeri hebat yang tidak mempan obat, jari tidak dapat diregangkan tanpa menjerit, dan mulai kebas — sindrom kompartemen yang kini menuntut fasiotomi darurat.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 (fraktur, kompetensi 3B); PNPK Fraktur 270/2019; peringatan FDA/EMA mengenai kontraindikasi tramadol pada anak.',
    },
  }),

  // ---------------------------------------------------------------------------
  // 7. Talasemia beta mayor pada anak
  // ---------------------------------------------------------------------------
  buatKasusOA({
    id: 'lab_talasemia_beta_mayor_anak',
    nama: 'Talasemia Beta Mayor pada Anak',
    icd10: 'D56.1',
    skdi: '2',
    kategori: 'metabolik',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'anak',
    keluhanUtama: 'Anak saya pucat terus sejak bayi, perutnya makin lama makin membuncit, dan badannya paling kecil di antara teman-teman seumurannya.',
    keluhanUtamaOlehPendamping: true,
    demografi: { usiaMin: 3, usiaMax: 10 },
    vital: { td: '96/58', nadi: 112, rr: 24, suhu: 36.6, spo2: 98 },
    pembuka: {
      tanya: 'Coba ceritakan dari awal, pucatnya sejak kapan dan bagaimana perkembangannya?',
      jawab: 'Sejak bayi, Dok. Orang-orang sering bilang anak saya pucat, saya kira memang kulitnya putih. Tapi setahun terakhir dia makin lemas, cepat capek kalau main, dan perutnya membesar padahal badannya kurus.',
      oldcarts: ['onset', 'durasi', 'keparahan'],
    },
    pertanyaan: [
      {
        id: 'q_pucat',
        kategori: 'rps',
        tanya: 'Pucatnya terus-menerus atau hilang timbul? Ada saat-saat dia tampak segar kembali?',
        jawab: 'Terus-menerus, Dok, tidak pernah benar-benar hilang. Tapi memang pernah dua kali dia tiba-tiba segar sekali selama beberapa bulan, itu setelah dirawat di rumah sakit.',
        esensial: true,
        oldcarts: ['karakter', 'durasi'],
      },
      {
        id: 'q_perut',
        kategori: 'rps',
        tanya: 'Perutnya membesar sejak kapan, dan apakah dia mengeluh sakit atau cepat kenyang?',
        jawab: 'Kira-kira dua tahun ini, pelan-pelan makin buncit. Tidak pernah mengeluh sakit, tapi makannya sedikit sekali, baru beberapa suap sudah bilang kenyang.',
        esensial: true,
        oldcarts: ['durasi', 'penyerta'],
      },
      {
        id: 'q_transfusi',
        kategori: 'rpd',
        tanya: 'Dia pernah ditransfusi darah atau dirawat karena kurang darah?',
        jawab: 'Dua kali, Dok. Waktu umur dua tahun dan tiga tahun. Katanya darahnya kurang sekali lalu dikasih darah. Setelah itu dia segar lagi beberapa bulan, terus pucat lagi pelan-pelan. Kami tidak pernah kontrol lagi karena rumah sakitnya jauh dan biayanya berat.',
        esensial: true,
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Ada saudara atau keluarga yang juga sering kurang darah, sering transfusi, atau meninggal saat kecil karena kurang darah?',
        jawab: 'Adik saya dulu meninggal umur lima tahun, katanya kurang darah bawaan. Waktu itu petugas pernah menyebut istilah kurang darah bawaan yang menurun dari orang tua, tapi kami tidak paham dan tidak pernah diperiksa.',
        esensial: true,
        variasi: {
          polos: 'Adik saya meninggal waktu kecil, Dok, katanya kurang darah dari lahir. Kata orang dulu memang penyakit turunan, tapi kami ndak ngerti maksudnya bagaimana.',
        },
      },
      {
        id: 'q_fe',
        kategori: 'rpd',
        tanya: 'Sudah pernah diberi obat penambah darah? Kalau iya, ada bedanya atau tidak?',
        jawab: 'Sudah berkali-kali, Dok. Tablet merah dan sirup, dari Puskesmas maupun beli sendiri, bertahun-tahun. Sama sekali tidak ada bedanya, dia tetap pucat. Saya juga sudah coba kasih hati ayam, bayam, semua kata orang bagus buat darah, tetap saja begitu.',
        esensial: true,
        variasi: {
          skeptis: 'Sudah bertahun-tahun dikasih tablet penambah darah, Dok, yang merah itu, dari Puskesmas dan beli sendiri. Terus terang saya jadi ragu, wong tidak ada bedanya sama sekali. Hati ayam, bayam, sudah semua saya coba. Apa memang obatnya tidak cocok, atau memang sakitnya lain?',
        },
      },
      {
        id: 'q_tumbuh',
        kategori: 'rps',
        tanya: 'Bagaimana pertumbuhannya dibanding anak seumurannya?',
        jawab: 'Jauh lebih kecil, Dok. Sepupunya yang seumur badannya dua kali dia. Beratnya susah sekali naik, dari dulu segitu-segitu saja.',
        esensial: true,
      },
      {
        id: 'q_kuning',
        kategori: 'rps',
        tanya: 'Matanya pernah tampak kekuningan, atau air kencingnya pernah berwarna seperti teh?',
        jawab: 'Iya, Dok, matanya kadang agak kekuningan, terutama kalau sedang lemas sekali. Air kencingnya kadang memang lebih tua warnanya.',
      },
      {
        id: 'q_cacing',
        kategori: 'sosial',
        tanya: 'Dia sering main tanah tanpa alas kaki? Sudah dapat obat cacing rutin?',
        jawab: 'Main tanah sering, tapi obat cacingnya rutin dari sekolah tiap enam bulan, tidak pernah bolong.',
      },
      {
        id: 'q_imunisasi',
        kategori: 'rpd',
        tanya: 'Imunisasinya lengkap?',
        jawab: 'Lengkap semua, Dok, sesuai buku KIA.',
        distraktor: true,
      },
      {
        id: 'q_alergi_debu',
        kategori: 'rpd',
        tanya: 'Dia sering bersin-bersin pagi hari atau gatal-gatal kalau kena debu?',
        jawab: 'Tidak pernah, Dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      {
        region: 'umum',
        temuan: 'Anak tampak jauh lebih kecil dari usianya; berat dan tinggi di bawah persentil 3 kurva pertumbuhan. Pucat mencolok, lemas, tetapi sadar penuh dan kooperatif.',
        relevan: true,
      },
      {
        region: 'kepala_leher',
        temuan: 'Wajah khas: dahi menonjol, tulang pipi melebar, jarak antar-mata melebar, dan gigi rahang atas maju dengan gigitan tidak rapat — akibat perluasan sumsum tulang yang bekerja berlebihan.',
        relevan: true,
      },
      {
        region: 'abdomen',
        temuan: 'Perut membuncit; hati teraba 3 cm di bawah lengkung iga dengan tepi tumpul; limpa teraba sampai Schuffner III, kenyal dan tidak nyeri.',
        relevan: true,
      },
      {
        region: 'kulit',
        temuan: 'Kulit pucat dengan warna kelabu-kekuningan; sklera sedikit kuning; tidak ada bintik perdarahan maupun memar spontan.',
        relevan: true,
      },
      {
        region: 'jantung',
        temuan: 'Takikardia 112x/menit dengan bising sistolik ejeksi derajat 2/6 terdengar di semua area — bising aliran khas anemia berat; tidak ada gallop maupun tanda gagal jantung.',
        relevan: true,
      },
      {
        region: 'toraks_paru',
        temuan: 'Suara napas vesikuler simetris tanpa ronki maupun mengi.',
        relevan: false,
      },
    ],
    lab: [
      {
        id: 'hb',
        hasil: 'Hb 6,2 g/dL.',
        flag: 'rendah',
        relevan: true,
      },
      {
        id: 'darah_rutin',
        hasil: 'MCV 62 fL dan MCH 19 pg (mikrositik hipokrom berat), tetapi hitung eritrosit 4,9 juta/µL — JUSTRU TINGGI untuk derajat anemia seberat ini. RDW meningkat. Apusan: anisopoikilositosis mencolok, banyak sel target, dan normoblas beredar di darah tepi. Leukosit dan trombosit normal.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'ferritin_serum',
        hasil: 'Feritin 720 ng/mL — TINGGI, bukan rendah.',
        flag: 'tinggi',
        relevan: true,
      },
      {
        id: 'hitung_retikulosit',
        hasil: 'Retikulosit 4,8% (meningkat) — sumsum tulang bekerja keras, produksinya tidak gagal.',
        flag: 'tinggi',
        relevan: true,
      },
      {
        id: 'feses_rutin',
        hasil: 'Tidak ditemukan telur cacing, darah samar negatif.',
        flag: 'normal',
        relevan: true,
      },
    ],
    diagnosisBanding: ['D56.1', 'D50.9', 'B76.0'],
    tatalaksana: {
      obatBenar: ['asam_folat_5'],
      obatSalahUmum: [
        {
          id: 'tablet_fe',
          alasan: 'Ini kesalahan yang paling penting dihindari di seluruh kasus ini. Anemia mikrositik TIDAK selalu berarti kekurangan besi. Pada talasemia, cadangan besi justru sudah berlebih — feritin 720 ng/mL — karena hemolisis kronis melepaskan besi dari sel darah merah yang hancur dan karena eritropoiesis yang tidak efektif menekan hepsidin sehingga usus menyerap besi jauh lebih banyak dari seharusnya. Menambah besi tidak akan menaikkan Hb satu pun, sebab masalahnya adalah rantai globin beta yang tidak dapat dibuat, bukan bahan bakunya. Yang bertambah hanyalah timbunan besi yang perlahan merusak jantung, hati, dan kelenjar endokrin — dan gagal jantung akibat kelebihan besi adalah penyebab kematian utama pada talasemia, bukan anemianya sendiri. Bertahun-tahun tablet besi yang "tidak ada bedanya" pada anak ini bukan tanda dosisnya kurang; itu tanda diagnosisnya salah sejak awal.',
          bahaya: 'kontraindikasi',
        },
        {
          id: 'deferipron_500',
          alasan: 'Kelasi besi memang bagian dari terapi talasemia, tetapi bukan sesuatu yang dimulai di FKTP hari ini. Kelasi baru diindikasikan setelah beban besi mencapai ambang tertentu — umumnya setelah sekitar 10-20 kali transfusi atau feritin yang menetap di atas 1000 ng/mL — dan menuntut pemantauan ketat karena deferipron membawa risiko agranulositosis yang memerlukan hitung neutrofil berkala. Memulainya tanpa program transfusi, tanpa pemantauan, dan tanpa spesialis adalah menjalankan bagian tersulit dari terapi sambil melewatkan bagian yang paling mendesak: merujuk anak ini ke pusat talasemia.',
          bahaya: 'nonPrimer',
        },
        {
          id: 'albendazol_400',
          alasan: 'Obat cacing diberikan sebagai refleks pada setiap anak pucat di Indonesia, dan sering memang tepat. Di sini tidak: pemeriksaan feses tidak menemukan telur cacing, anak sudah rutin minum obat cacing, dan pucat sejak bayi dengan wajah yang khas, limpa besar, serta feritin tinggi bukan gambaran anemia cacing tambang. Memberikannya menunda rujukan tanpa memberi apa pun.',
          bahaya: 'nonPrimer',
        },
      ],
      prosedur: [],
      tindakanSalahUmum: [
        {
          id: 'transfusi_darah_fktp',
          alasan: 'Hb 6,2 g/dL memicu dorongan kuat untuk "langsung memberi darah". Tetapi program transfusi talasemia bukan sekadar memasukkan darah: ia menuntut penentuan fenotip sel darah merah SEBELUM transfusi pertama yang terencana, darah yang sudah dikurangi leukositnya, target Hb pra-transfusi yang dihitung, dan pemantauan beban besi. Transfusi improvisasi di Puskesmas tanpa bank darah dan tanpa uji silang yang benar membawa risiko reaksi transfusi akut dan alloimunisasi — dan sekali anak ini membentuk antibodi terhadap golongan darah minor, mencarikan darah yang cocok untuknya akan menjadi semakin sulit selama sisa hidupnya yang bergantung pada transfusi.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['dukungan_transfusi_rutin', 'kontrol_rutin', 'tanda_bahaya'],
      edukasiKritis: ['dukungan_transfusi_rutin'],
    },
    clue: 'Pucat menahun sejak bayi + hepatosplenomegali + wajah khas (dahi menonjol, tulang pipi lebar) + perawakan pendek + riwayat keluarga "kurang darah bawaan" + zat besi bertahun-tahun yang tidak mengubah apa pun = talasemia beta mayor sampai dibuktikan sebaliknya. Yang mengunci diagnosisnya di meja FKTP adalah kombinasi dua angka: anemia mikrositik berat DENGAN feritin yang TINGGI, bukan rendah — pola yang mustahil pada defisiensi besi. Penunjang lain memperkuat: hitung eritrosit yang justru tinggi untuk derajat anemianya (indeks Mentzer MCV/eritrosit = 62/4,9 = 12,7; di bawah 13 condong ke talasemia, walau indeks ini hanya penunjuk arah dan tidak boleh menggantikan pemeriksaan konfirmasi), retikulosit yang meningkat, sel target, dan normoblas beredar. Diagnosis pastinya bukan wewenang FKTP: butuh analisis hemoglobin (elektroforesis atau HPLC) yang menunjukkan HbF dominan, dan idealnya pemeriksaan DNA — semuanya di pusat rujukan. Tugas FKTP: kenali polanya, HENTIKAN besi, beri asam folat 1-5 mg per hari untuk menopang eritropoiesis yang bekerja berlebihan, dan rujuk ke dokter spesialis anak untuk program transfusi rutin seumur hidup dengan kelasi besi yang dimulai dan dipantau spesialis. Satu tugas lagi yang khas FKTP dan sering terlewat: talasemia adalah penyakit KELUARGA, bukan penyakit satu anak. Kedua orang tua pasti pembawa sifat, tiap kehamilan berikutnya berpeluang 25% melahirkan anak dengan penyakit yang sama, dan saudara kandung perlu diskrining. Konseling itu adalah pekerjaan FKTP, bukan pekerjaan RS.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan talasemia sebagai kompetensi 2 — dokter FKTP mengenali dan merujuk, tanpa memulai terapi definitif. Yang sering luput dibaca: kompetensi 2 bukan berarti FKTP tidak berperan. Justru FKTP-lah yang paling mungkin mengenali pola "anemia mikrositik yang tidak membaik dengan besi", menghentikan besi yang merugikan, menjaga kepatuhan transfusi bulanan, dan menjalankan skrining keluarga. Kriteria rujukan resminya: setiap kecurigaan talasemia dirujuk untuk konfirmasi analisis hemoglobin dan pengelolaan jangka panjang oleh spesialis anak.`,
    catatanRealita: 'Kesenjangan terbesarnya bukan obat melainkan jarak dan uang. Transfusi rutin tiap 2-4 minggu seumur hidup berarti keluarga ini harus menempuh perjalanan ke RS puluhan kali setahun, kehilangan hari kerja, dan menanggung biaya transportasi yang tidak ditanggung jaminan.',
    mutiaraEbm: 'Anemia mikrositik hipokrom hampir refleks dibaca sebagai defisiensi besi, dan di negeri dengan prevalensi kecacingan serta defisiensi besi setinggi Indonesia, refleks itu benar pada mayoritas kasus — justru itulah yang membuatnya berbahaya. Yang menyesatkan bukan hasil labnya, melainkan responsnya terhadap terapi: dokter cenderung membaca "besi tidak mempan" sebagai "kepatuhannya buruk" atau "dosisnya kurang", lalu menaikkan dosis dan mengulanginya bertahun-tahun. Padahal anemia mikrositik yang TIDAK membaik setelah besi adekuat adalah tanda bahaya yang menuntut pemikiran ulang diagnosis, bukan pengulangan resep. Jebakan berikutnya: feritin adalah reaktan fase akut, sehingga pada infeksi atau radang ia bisa naik menutupi defisiensi besi yang sebenarnya ada — angka 720 ng/mL pada anak tanpa demam dan tanpa tanda radang tidak bisa dijelaskan begitu, dan di situlah nilainya. Terakhir, jangan menaruh terlalu banyak beban pada indeks Mentzer atau rumus pembeda lainnya: semuanya hanya penunjuk arah dengan tumpang tindih yang nyata, dan tidak satu pun menggantikan analisis hemoglobin.',
    konsekuensi: {
      narasi: 'Bila anak ini terus diberi zat besi dan dipulangkan, dua kerusakan berjalan bersamaan. Anemia kronis yang tidak ditransfusi membuat sumsum tulang meluas tanpa henti sehingga tulang wajah berubah permanen, limpa terus membesar, pertumbuhan terhenti, dan jantung bekerja berlebihan bertahun-tahun. Sementara itu besi yang ditambahkan terus menimbun di jantung, hati, dan kelenjar endokrin — dan gagal jantung akibat kelebihan besi, bukan anemianya, yang biasanya mengakhiri hidup penderita talasemia.',
      kembaliHariMin: 30,
      kembaliHariMax: 90,
      kondisiKembali: 'Kembali beberapa bulan kemudian dengan Hb 4,8 g/dL, sesak saat berbaring, tungkai bengkak, dan hati yang makin membesar — gagal jantung pada anak yang sepanjang waktu itu tetap minum tablet penambah darah setiap hari.',
      guideline: 'PPK Dokter FKTP KMK 1186/2022 (talasemia, kompetensi 2); prinsip tata laksana talasemia mayor — program transfusi rutin, kelasi besi oleh spesialis, dan skrining pembawa sifat pada keluarga.',
    },
  }),

  // ---------------------------------------------------------------------------
  // 8. Gizi buruk dengan komplikasi
  // ---------------------------------------------------------------------------
  buatKasusOA({
    id: 'lab_gizi_buruk_komplikasi',
    nama: 'Gizi Buruk dengan Komplikasi pada Balita',
    icd10: 'E43',
    skdi: '3B',
    kategori: 'kia',
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'sedang',
    spesialisRujukan: 'anak',
    keluhanUtama: 'Anak saya makin kurus sampai tulang-tulangnya kelihatan, sekarang mencret dan demam, dan dia cuma diam saja tidak mau makan sama sekali.',
    keluhanUtamaOlehPendamping: true,
    demografi: { usiaMin: 1, usiaMax: 4 },
    vital: { td: '84/52', nadi: 148, rr: 42, suhu: 37.9, spo2: 97 },
    pembuka: {
      tanya: 'Coba ceritakan, sejak kapan dia makin kurus dan apa yang berubah beberapa hari ini?',
      jawab: 'Kurusnya sudah berbulan-bulan, Dok, tapi dua hari ini beda. Dia mencret terus, badannya panas, dan yang paling saya takutkan dia jadi cuma diam saja. Biasanya dia masih mau main sedikit.',
      oldcarts: ['onset', 'durasi', 'keparahan'],
    },
    pertanyaan: [
      {
        id: 'q_berat',
        kategori: 'rps',
        tanya: 'Berapa berat badannya saat terakhir ditimbang, dan bagaimana garis di buku KMS-nya?',
        jawab: 'Delapan kilo, Dok. Di buku KMS-nya sudah beberapa bulan garisnya turun terus, kata kader harus dibawa ke Puskesmas tapi saya tunda-tunda.',
        esensial: true,
        oldcarts: ['keparahan'],
      },
      {
        id: 'q_makan',
        kategori: 'rps',
        tanya: 'Sejak kapan dia tidak mau makan, dan apakah masih mau minum?',
        jawab: 'Dua hari ini sama sekali tidak mau makan, Dok. Minum masih mau tapi sedikit-sedikit saja, itu pun harus disuapi pelan.',
        esensial: true,
        oldcarts: ['durasi', 'keparahan'],
      },
      {
        id: 'q_diare',
        kategori: 'rps',
        tanya: 'Mencretnya berapa kali sehari, dan ada darah atau lendirnya?',
        jawab: 'Sekitar enam kali sehari, cair seperti air, tidak ada darah dan tidak ada lendir. Tidak muntah.',
        esensial: true,
        oldcarts: ['karakter', 'keparahan'],
      },
      {
        id: 'q_lesu',
        kategori: 'rps',
        tanya: 'Apakah dia masih mau main, atau hanya diam dan mengantuk terus?',
        jawab: 'Sejak kemarin cuma tiduran, Dok. Dipanggil pun cuma melirik sebentar lalu diam lagi. Menangis pun sekarang tidak ada suaranya. Itu yang bikin saya panik lalu langsung ke sini.',
        esensial: true,
        oldcarts: ['penyerta'],
        variasi: {
          cemas: 'Dia diam saja Dok, dipanggil cuma melirik. Nangisnya sudah tidak ada suaranya. Ini kenapa Dok, dia mau kenapa-kenapa ya? Saya takut sekali, tolong Dok.',
          wali_anak: 'Sudah dua hari dia tidak mau main sama sekali, Dok. Cuma tiduran. Dipanggil cuma melirik sebentar terus diam lagi. Padahal biasanya dia paling ribut di rumah.',
        },
      },
      {
        id: 'q_bengkak',
        kategori: 'rps',
        tanya: 'Ada bengkak di punggung kakinya, tangannya, atau wajahnya?',
        jawab: 'Tidak ada, Dok. Malah sebaliknya, semuanya makin kecil dan kulitnya jadi kendor sampai menggantung, terutama di pantatnya.',
        esensial: true,
        variasi: {
          wali_anak: 'Ndak ada bengkak, Dok, malah kebalikannya. Badannya makin susut, kulitnya kendor menggantung, apalagi di bagian pantat, seperti pakai celana kedodoran.',
        },
      },
      {
        id: 'q_asi_mpasi',
        kategori: 'sosial',
        tanya: 'Sejak lahir dia minum apa, dan mulai umur berapa diberi makanan pendamping?',
        jawab: 'ASI cuma sampai tiga bulan, Dok, karena saya harus kerja dan ASI saya seret. Setelah itu susu kental manis yang diencerkan, karena satu kaleng bisa untuk lama dan harganya terjangkau. Makannya nasi sama kuah sayur saja, lauknya jarang.',
        esensial: true,
      },
      {
        id: 'q_batuk_tb',
        kategori: 'rps',
        tanya: 'Ada batuk lama, keringat malam, atau ada yang batuk lama di rumah?',
        jawab: 'Kakeknya batuk-batuk sudah lebih dari sebulan, tidak pernah berobat, dan tidurnya sekamar dengan anak saya.',
      },
      {
        id: 'q_imunisasi',
        kategori: 'rpd',
        tanya: 'Imunisasinya lengkap? Kapan terakhir dia dapat kapsul vitamin A?',
        jawab: 'Imunisasi cuma sampai umur sembilan bulan, setelah itu tidak pernah lagi. Kapsul vitamin A saya betul-betul lupa, sepertinya sudah lama sekali tidak.',
      },
      {
        id: 'q_alergi_susu',
        kategori: 'rpd',
        tanya: 'Dia alergi susu atau makanan tertentu?',
        jawab: 'Tidak pernah gatal atau bentol, Dok. Makan apa saja tidak apa-apa, cuma memang tidak ada yang dimakan.',
        distraktor: true,
      },
      {
        id: 'q_perjalanan',
        kategori: 'sosial',
        tanya: 'Belakangan ini dia dibawa bepergian ke luar kota atau ke daerah yang banyak malarianya?',
        jawab: 'Tidak pernah, Dok. Dia tidak pernah keluar desa ini.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      {
        region: 'umum',
        temuan: 'Balita tampak sangat kurus dan lesu; hanya melirik saat dipanggil tetapi masih membuka mata dan menoleh — TIDAK letargis-tak-responsif. Berat badan menurut panjang badan di bawah -3 SD; lingkar lengan atas 10,2 cm. Iga tampak jelas satu per satu; napas cepat 42x/menit tanpa tarikan dinding dada ke dalam.',
        relevan: true,
      },
      {
        region: 'kulit',
        temuan: 'Kulit kendor dan berkerut; lemak bawah kulit di bokong menghilang sehingga kulit menggantung seperti celana kedodoran; TIDAK ada pembengkakan pada punggung kaki, tangan, maupun wajah; turgor kembali lambat; beberapa lecet dangkal di lipat paha.',
        relevan: true,
      },
      {
        region: 'mata',
        temuan: 'Kedua mata tampak cekung; konjungtiva pucat; tidak ada bercak Bitot, tidak ada kekeruhan maupun luka pada kornea.',
        relevan: true,
      },
      {
        region: 'abdomen',
        temuan: 'Perut cekung; bising usus meningkat; hati tidak membesar; tidak ada nyeri tekan maupun massa.',
        relevan: true,
      },
      {
        region: 'jantung',
        temuan: 'Bunyi jantung terdengar lemah dengan takikardia 148x/menit; nadi masih teraba jelas di pergelangan, akral HANGAT, waktu pengisian kapiler 2 detik — tidak memenuhi kriteria syok.',
        relevan: true,
      },
      {
        region: 'neurologis',
        temuan: 'Tidak ada kaku kuduk, ubun-ubun besar sudah menutup, tidak ada kejang maupun defisit fokal.',
        relevan: false,
      },
    ],
    lab: [
      {
        id: 'gds',
        hasil: 'GDS 44 mg/dL — hipoglikemia.',
        flag: 'rendah',
        relevan: true,
      },
      {
        id: 'hb',
        hasil: 'Hb 8,6 g/dL.',
        flag: 'rendah',
        relevan: true,
      },
      {
        id: 'darah_rutin',
        hasil: 'Leukosit 14.200/µL; trombosit normal; MCV 74 fL.',
        flag: 'tinggi',
        relevan: true,
      },
      {
        id: 'elektrolit_serum',
        hasil: 'Kalium 2,9 mmol/L (rendah) dengan natrium 148 mmol/L (tinggi) — pola khas gizi buruk: kalium tubuh terkuras sementara natrium justru menumpuk di dalam sel.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'feses_rutin',
        hasil: 'Konsistensi cair; tidak ada darah maupun lendir; tidak ditemukan telur cacing maupun amoeba.',
        flag: 'normal',
        relevan: true,
      },
    ],
    diagnosisBanding: ['E43', 'E41', 'A09'],
    tatalaksana: {
      obatBenar: ['ceftriaxone_1g_inj'],
      obatOpsional: ['vitamin_a_kapsul'],
      obatSalahUmum: [
        {
          id: 'oralit',
          alasan: 'Refleks paling kuat pada setiap anak mencret, dan pada anak gizi baik memang benar. Pada gizi buruk tidak: oralit standar mengandung natrium terlalu tinggi dan kalium terlalu rendah untuk anak yang natriumnya sudah menumpuk di dalam sel (natrium serum di sini 148 mmol/L) sementara kaliumnya terkuras (2,9 mmol/L). WHO dan Kemenkes memakai ReSoMal — oralit yang diencerkan lalu ditambah gula dan larutan mineral-mix — justru untuk menghindari beban natrium yang dapat memicu kelebihan cairan dan gagal jantung.',
          bahaya: 'kontraindikasi',
        },
        {
          id: 'tablet_fe',
          alasan: 'Hb 8,6 g/dL memancing pemberian zat besi, tetapi WHO tegas: besi TIDAK diberikan pada fase stabilisasi gizi buruk. Besi bebas yang tidak terikat memperberat stres oksidatif pada tubuh yang pertahanan antioksidannya sudah habis, dan menjadi bahan bakar bagi bakteri — pada anak yang sedang terinfeksi, ini menaikkan risiko sepsis. Besi baru dimulai pada fase rehabilitasi, setelah nafsu makannya pulih dan berat badannya mulai naik.',
          bahaya: 'kontraindikasi',
        },
        {
          id: 'zinc_20',
          alasan: 'Zinc untuk diare adalah anjuran yang benar pada anak gizi baik. Pada gizi buruk, zinc dan mineral lain sudah terkandung dalam formula terapeutik (F-75/RUTF) dan larutan mineral-mix; memberinya terpisah bukan prioritas, tidak menggantikan rujukan, dan mengalihkan perhatian dari dua hal yang benar-benar mendesak malam ini: gula darahnya dan suhu tubuhnya.',
          bahaya: 'nonPrimer',
        },
      ],
      prosedur: ['koreksi_hipoglikemia_oral_15g', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        {
          id: 'rehidrasi_plan_c_bayi',
          alasan: 'Ini jebakan paling mematikan dalam kasus ini. Plan C — cairan intravena cepat 100 mL/kg — adalah protokol dehidrasi berat pada anak GIZI BAIK, dan memberikannya pada gizi buruk dapat membunuh. Otot jantung anak ini ikut atrofi dan kalium tubuhnya terkuras, sehingga beban cairan cepat langsung mencetuskan gagal jantung dan edema paru; kematian pada jam-jam pertama perawatan gizi buruk paling sering justru karena over-rehidrasi, bukan karena dehidrasinya. Protokol WHO/Kemenkes: rehidrasi gizi buruk memakai ReSoMal oral atau lewat pipa lambung 5-10 mL/kg/jam dengan penilaian ulang tiap jam; jalur intravena HANYA bila anak benar-benar syok, dan itu pun dengan volume serta laju yang jauh lebih rendah dan dihentikan begitu nadi membaik. Anak ini akralnya hangat dengan nadi teraba jelas — ia tidak syok.',
          bahaya: 'berbahaya',
        },
        {
          id: 'transfusi_darah_fktp',
          alasan: 'Pada gizi buruk, ambang transfusi jauh lebih ketat justru karena beban volume berbahaya: darah diberikan hanya bila Hb di bawah 4 g/dL, atau di bawah 6 g/dL bila disertai tanda gagal napas, dan itu pun sangat lambat 10 mL/kg selama 3 jam dengan furosemid. Hb 8,6 g/dL jelas jauh di atas ambang mana pun, dan Puskesmas tidak punya bank darah. Memberikan darah di sini berarti menambahkan beban volume pada jantung yang sudah atrofi — kesalahan yang sama dengan Plan C, hanya dengan cairan yang lebih mahal.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['rehabilitasi_gizi', 'gizi_seimbang', 'cuci_tangan_makanan', 'tanda_bahaya'],
      edukasiKritis: ['rehabilitasi_gizi'],
    },
    stabilisasiWajib: ['koreksi_hipoglikemia_oral_15g', 'pemantauan_ketat_vital'],
    clue: 'Anak sangat kurus (BB/PB di bawah -3 SD, LiLA 10,2 cm, kulit bokong menggantung seperti celana kedodoran) yang kini disertai diare, demam, tidak mau makan, dan tampak lesu = gizi buruk DENGAN komplikasi — dan itu berarti rawat inap di TFC/RS, bukan rawat jalan dengan RUTF. Pembeda "dengan komplikasi" wajib dihafal: tidak mau makan atau uji nafsu makan gagal, letargi, demam tinggi atau hipotermia, dehidrasi berat, napas cepat, kejang, anemia berat, atau infeksi berat. Yang wajib dikerjakan FKTP malam ini, sesuai 10 langkah tata laksana gizi buruk WHO/Kemenkes: (1) atasi HIPOGLIKEMIA lebih dulu — GDS 44 mg/dL, beri glukosa/gula oral segera lalu segera lanjutkan pemberian makan, karena hipoglikemia adalah pembunuh tercepat pada 48 jam pertama; (2) HANGATKAN anak — selimuti, dekap kulit-ke-kulit, jauhkan dari kipas dan jendela, sebab lemak tubuhnya yang habis membuatnya kehilangan panas dengan cepat dan hipotermia sering menyertai hipoglikemia; (3) beri antibiotik untuk SEMUA anak gizi buruk, bahkan tanpa tanda infeksi yang jelas, karena tanda-tanda infeksi ditekan oleh gizi buruknya sendiri; (4) pantau ketat tanda vital dan gula darah; (5) rujuk ke TFC atau rawat inap anak. Yang HARUS DIHINDARI adalah refleks yang paling manusiawi: memberi cairan intravena cepat karena anak tampak dehidrasi.',
    panduanResmi: `${PPK_FLOOR} PPK FKTP menempatkan gizi buruk sebagai kompetensi 3B: kenali, mulai stabilisasi, lalu rujuk bila berkomplikasi. Pedoman Kemenkes menjabarkan 10 langkah fase stabilisasi. WHO Guideline on Prevention and Management of Wasting and Nutritional Oedema 2023 menggantikan guideline WHO 2013; prinsip yang relevan untuk vignette ini tetap: hipoglikemia/hipotermia dan infeksi ditangani dini, rehidrasi dilakukan hati-hati dengan pemantauan ketat, dan anak dengan komplikasi dirawat inap.`,
    catatanRealita: 'Tiga kejujuran yang harus dinyatakan. Pertama, ReSoMal tidak ada dalam formularium game ini, dan itu memang mencerminkan kenyataan: ReSoMal dan mineral-mix diracik di TFC, bukan tersedia di rak obat Puskesmas — yang justru memperkuat kesimpulannya, anak ini dirujuk, bukan direhidrasi sendiri di sini.',
    mutiaraEbm: 'Tanda dehidrasi yang paling dipercaya dokter justru yang paling menyesatkan pada gizi buruk. Mata cekung dan turgor kulit yang kembali lambat SELALU ada pada anak marasmik — bukan karena ia kekurangan cairan, melainkan karena lemak di bawah kulitnya sudah habis sehingga kulitnya memang kehilangan elastisitas dan bola matanya memang kehilangan bantalannya. Menilai derajat dehidrasi dari kedua tanda ini adalah cara paling umum untuk memberi cairan berlebihan sampai anak gagal jantung. Yang lebih dapat dipercaya justru riwayat (mencretnya sejak kapan, seberapa cair) dan respons terhadap rehidrasi pelan: nadi yang melambat, kencing yang keluar, anak yang mulai menangis dengan air mata. Jebakan kedua sama besarnya: gizi buruk MENEKAN tanda-tanda infeksi. Anak yang sedang sepsis bisa tidak demam, lekositnya bisa normal, perutnya bisa tidak nyeri, dan tanda peradangan yang biasa kita cari boleh jadi tidak muncul sama sekali — itulah alasan WHO memberi antibiotik kepada SEMUA anak gizi buruk, bahkan yang "tampak tidak terinfeksi". Terakhir: berat badan bisa MENIPU ke arah sebaliknya pada kwashiorkor, karena bengkaknya menambah berat sehingga anak yang tampak "cukup gemuk" ternyata gizi buruk berat — periksa punggung kaki pada setiap anak, jangan hanya membaca timbangan.',
    konsekuensi: {
      narasi: 'Bila hipoglikemia tidak dikoreksi dan anak dibiarkan menunggu di ruang tunggu yang dingin, kadar gulanya terus turun sampai kejang lalu henti napas — dua penyebab kematian tercepat pada gizi buruk adalah hipoglikemia dan hipotermia, dan keduanya diatasi dengan gula serta selimut. Bila anak justru diinfus cepat dengan Plan C karena tampak dehidrasi, jantungnya yang atrofi tidak sanggup memompa beban itu dan ia meninggal karena edema paru dalam beberapa jam — kematian yang seluruhnya disebabkan oleh pengobatannya, bukan penyakitnya.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Beberapa jam setelah infus cepat dipasang, anak menjadi sangat sesak, napasnya berbunyi basah, kelopak matanya membengkak, dan nadinya melemah — gagal jantung dan edema paru pada anak yang datang dalam keadaan tidak syok.',
      guideline: 'PPK FKTP KMK 1186/2022; Pedoman Pencegahan dan Tatalaksana Gizi Buruk pada Balita Kemenkes; WHO Guideline on Prevention and Management of Wasting and Nutritional Oedema 2023.',
    },
  }),
]

export const LAB_BATCH_4_OA_ARCHETYPE_SPECS: Record<string, LabArchetypeSpec> = {
  lab_kehamilan_ektopik_terganggu_suspek: {
    conceptId: 'concept:suspected_ruptured_ectopic_pregnancy',
    credits: ['clinical:lab_kehamilan_ektopik_terganggu_suspek'],
  },
  lab_plasenta_previa: {
    conceptId: 'concept:placenta_previa',
    credits: ['clinical:lab_plasenta_previa'],
  },
  lab_penyakit_radang_panggul_berat: {
    conceptId: 'concept:severe_pelvic_inflammatory_disease',
    credits: ['clinical:lab_penyakit_radang_panggul_berat'],
  },
  lab_mola_hidatidosa: {
    conceptId: 'concept:hydatidiform_mole',
    credits: ['clinical:lab_mola_hidatidosa'],
  },
  lab_hiperemesis_gravidarum_berat: {
    conceptId: 'concept:severe_hyperemesis_gravidarum',
    credits: ['clinical:lab_hiperemesis_gravidarum_berat'],
  },
  lab_fraktur_tertutup_antebrachii_anak: {
    conceptId: 'concept:pediatric_closed_forearm_fracture',
    credits: ['clinical:lab_fraktur_tertutup_antebrachii_anak'],
  },
  lab_talasemia_beta_mayor_anak: {
    conceptId: 'concept:beta_thalassemia_major',
    credits: ['clinical:lab_talasemia_beta_mayor_anak'],
  },
  lab_gizi_buruk_komplikasi: {
    conceptId: 'concept:severe_acute_malnutrition_complicated',
    credits: ['clinical:lab_gizi_buruk_komplikasi'],
  },
}
