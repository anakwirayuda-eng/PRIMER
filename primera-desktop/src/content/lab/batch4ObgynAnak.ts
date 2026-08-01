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
    kepastianDiagnosis: 'suspek',
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
        temuan: 'Pemeriksaan pelvis internal tidak diulang pada pasien yang sudah syok dan menunjukkan tanda peritoneal. Temuan klinis yang ada sudah cukup untuk memulai stabilisasi dan transfer emergensi tanpa menunda demi pemeriksaan bimanual rinci.',
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
      prosedur: ['akses_iv_resusitasi', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        {
          id: 'transfusi_darah_fktp',
          alasan: 'Hb 7,4 g/dL memang menakutkan, tetapi Puskesmas tidak punya bank darah maupun uji silang. Menunggu darah di FKTP menghabiskan menit yang seharusnya dipakai untuk transfer; sumber perdarahannya ada di kamar operasi, bukan di kantong darah.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif', 'tanda_bahaya'],
      edukasiKritis: ['puasa_sambil_rujuk', 'persiapan_rujukan_operatif'],
      terapiKritis: ['akses_iv_resusitasi'],
    },
    stabilisasiWajib: ['akses_iv_resusitasi'],
    clue: 'Perempuan usia reproduktif dengan nyeri perut/panggul harus dinilai kemungkinan hamil meski gejalanya tidak khas. Telat haid 7 minggu, nyeri satu sisi mendadak, bercak gelap, sinkop, nyeri alih bahu, tes kehamilan positif, hipotensi, takikardia, dan tanda peritoneal berarti suspek kehamilan ektopik terganggu dengan syok. Tugas FKTP: panggil jejaring emergensi, lakukan ABCDE, pasang akses intravena dan berikan kristaloid terukur sambil menilai respons, puasakan, pantau ketat, lalu transfer segera ke fasilitas bedah-obstetri. Jangan menunggu USG atau beta-hCG serial pada pasien tidak stabil. Oksigen diberikan terkontrol bila hipoksemia atau gangguan respirasi muncul; SpO2 98% udara ruangan bukan alasan menjadikannya tindakan wajib.',
    panduanResmi: 'PPK Dokter FKTP KMK 1186/2022 tidak memiliki bab diagnosis-spesifik untuk kehamilan ektopik terganggu, dan PNPK Komplikasi Kehamilan KMK 91/2017 tidak memuat kondisi ini. HSE National Clinical Practice Guideline 2024 menjadi sumber langsung untuk pengenalan, penilaian stabilitas, jalur diagnosis, resusitasi, dan transfer segera pada suspek ektopik. WHO-ICRC Basic Emergency Care memberi kerangka ABCDE, stabilisasi syok, transfer, dan handover untuk fasilitas kontak pertama.',
    catatanRealita: 'Di Sukamaju, tes kehamilan dan kristaloid adalah sumber daya inti, sedangkan USG obstetri bersifat terjadwal/berbagi dan ambulans dapat sedang bertugas. Keterbatasan itu tidak mengubah keputusan: gambaran syok dengan tes kehamilan positif memicu stabilisasi paralel dan transfer, bukan antrean USG atau pemeriksaan tambahan yang menunda.',
    mutiaraEbm: 'Bercak darah yang sedikit dapat menipu karena perdarahan utama pada ektopik terganggu dapat tersembunyi di rongga perut. Tes kehamilan positif juga tidak membuktikan lokasi intrauterin, dan struktur intrauterin dapat berupa kantong semu. Tes urine negatif menurunkan kemungkinan kehamilan yang sedang berlangsung, tetapi hasil tunggal tidak boleh mengalahkan penilaian syok atau kecurigaan klinis sangat tinggi; fokus pedagogisnya adalah selalu mempertimbangkan dan menguji kehamilan, lalu bertindak menurut stabilitas pasien.',
    konsekuensi: {
      narasi: 'Bila nyeri ditutup dengan antispasmodik atau antasida dan pasien dipulangkan sebagai "gastritis"/"infeksi saluran kemih", perdarahan intraabdomen berlanjut tanpa jalur intravena, tanpa cairan, dan tanpa jejaring yang bersiap. Pasien jatuh ke syok hipovolemik dekompensata di rumah, sering saat tidak ada yang menemani.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Dibawa kembali beberapa jam kemudian dalam keadaan tidak sadar, nadi hanya teraba di lipat paha, akral dingin, dan perut membuncit penuh darah — kini kehilangan waktu emas untuk laparotomi.',
      guideline: 'HSE National Clinical Practice Guideline: Ectopic Pregnancy 2024; WHO-ICRC Basic Emergency Care (ABCDE, shock, transfer, handover).',
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
        temuan: 'Sadar penuh, tenang, tidak tampak kesakitan, dapat bicara kalimat penuh. Vaginal toucher digital TIDAK dilakukan karena plasenta previa belum disingkirkan. Spekulum bukan larangan kategoris, tetapi tidak diperlukan di sini karena sumber obstetri sudah kuat dan transfer tidak boleh tertunda.',
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
          alasan: 'Asam traneksamat memiliki dasar kuat pada perdarahan pascapersalinan, tetapi bukan terapi rutin lini pertama untuk perdarahan antepartum akibat previa. Pemberian empiris di FKTP tidak boleh menggantikan stabilisasi, komunikasi pra-rujuk, dan transfer ke fasilitas obstetri yang mampu mengendalikan perdarahan.',
          bahaya: 'nonPrimer',
        },
        {
          id: 'dexamethasone_05',
          alasan: 'Pematangan paru janin dapat menjadi bagian tata laksana previa preterm, tetapi regimennya menggunakan deksametason injeksi di fasilitas yang siap menerima persalinan. Tablet 0,5 mg di FKTP bukan penggantinya. Jangan menahan rujukan untuk menyelesaikan dosis.',
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
    clue: 'Perdarahan jalan lahir merah segar, mendadak, dan tanpa nyeri pada kehamilan lanjut dengan riwayat seksio berulang sangat mencurigakan plasenta previa. Jangan lakukan vaginal toucher digital sebelum previa disingkirkan dengan pencitraan. Pemeriksaan spekulum berbeda: oleh klinisi terlatih dapat membantu menilai jumlah/sumber perdarahan traktus bawah dan tidak dilarang secara kategoris, tetapi tidak boleh dipaksakan atau menunda transfer. Tugas FKTP pada episode ini ialah menilai ABC, pasang akses intravena, pantau ibu dan denyut jantung janin, hubungi RS, dan rujuk dengan dokumentasi bahwa VT digital tidak dilakukan. USG bermanfaat bila segera tersedia, bukan prasyarat untuk merujuk perdarahan antepartum.',
    panduanResmi: 'PPK Dokter FKTP KMK 1186/2022 tidak memiliki bab diagnosis-spesifik plasenta previa, dan PNPK Komplikasi Kehamilan KMK 91/2017 tidak memuat tata laksana previa. RCOG Green-top 27a edisi kelima 2026 menjadi sumber diagnosis dan manajemen langsung, termasuk pelokalan plasenta serta tata laksana perdarahan. Larangan utamanya ialah vaginal toucher digital sampai previa disingkirkan, bukan larangan universal terhadap spekulum.',
    catatanRealita: 'Pada profil Sukamaju, USG obstetri adalah layanan terjadwal/berbagi, bukan kemampuan yang diasumsikan selalu siap. Bila perdarahan datang saat alat atau operator tidak tersedia, keputusan aman tetap stabilisasi dan transfer berdasarkan gambaran klinis; pencitraan lokal tidak boleh menjadi antrean wajib.',
    mutiaraEbm: 'Perdarahan tanpa nyeri tidak menenangkan; pola itu justru mendukung plasenta previa. Sebaliknya, solusio plasenta lebih sering menimbulkan nyeri dan uterus tegang. Pada solusio, darah dapat tertahan di belakang plasenta sehingga perdarahan yang tampak sedikit tidak mencerminkan beratnya syok. Karena itu, jangan menilai keparahan hanya dari isi pembalut. Plasenta letak rendah pada trimester dua memang sering bergeser ke atas, tetapi riwayat seksio berulang meningkatkan risiko previa menetap dan perlekatan abnormal. Temuan tersebut mengubah perencanaan persalinan dan perlu dinilai di layanan obstetri.',
    konsekuensi: {
      narasi: 'Bila pemeriksaan dalam dilakukan untuk "memastikan pembukaan", jari pemeriksa memisahkan plasenta dari segmen bawah rahim yang tipis. Rembesan berubah menjadi pancaran; ibu jatuh syok dalam hitungan menit di ruang periksa yang tidak punya darah, kamar operasi, maupun ahli bedah. Bila pasien justru ditahan semalam untuk "observasi dulu" atau untuk menyelesaikan obat, perdarahan berikutnya datang tanpa peringatan dan biasanya lebih besar dari yang pertama.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Perdarahan menjadi masif segera setelah pemeriksaan dalam: ibu pucat, tekanan darah tak terukur, denyut jantung janin melambat menjadi 80x/menit, dan ambulans baru berangkat saat ibu sudah tidak sadar.',
      guideline: 'RCOG Green-top Guideline No. 27a, fifth edition 2026: placental localization, antepartum bleeding, and specialist management.',
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
      prosedur: ['pasang_infus', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        {
          id: 'insisi_abses',
          alasan: 'Abses tubo-ovarium bukan abses kulit. Ia terletak di rongga panggul, berdampingan dengan usus, ureter, dan pembuluh besar; insisi buta dari luar atau lewat forniks di FKTP dapat melubangi usus dan menumpahkan nanah ke rongga perut. Drainasenya dilakukan terpandu pencitraan atau lewat laparoskopi/laparotomi di RS.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['cegah_ims_pasangan', 'kepatuhan_obat', 'higiene_genital_lembut', 'tanda_bahaya'],
      edukasiKritis: ['cegah_ims_pasangan'],
      terapiKritis: ['ceftriaxone_1g_inj'],
    },
    stabilisasiWajib: ['pasang_infus', 'pemantauan_ketat_vital'],
    clue: 'Nyeri perut bawah bilateral, demam tinggi, duh serviks purulen, nyeri goyang serviks, massa adneksa nyeri, dan tanda peritoneal pada perempuan usia subur adalah penyakit radang panggul berat dengan curiga abses tubo-ovarium. Singkirkan kehamilan segera, tetapi jangan menjadikan USG FKTP sebagai syarat diagnosis atau rujuk. Kasus berat/abses memerlukan rawat inap: regimen parenteral CDC adalah seftriakson 1 g IV tiap 24 jam PLUS doksisiklin 100 mg oral/IV tiap 12 jam PLUS metronidazol 500 mg oral/IV tiap 12 jam. Berikan dosis awal yang tersedia tanpa menunda transfer dan lanjutkan/ubah regimen di rumah sakit. IUD tidak otomatis dilepas; evaluasi pelepasan dilakukan bila tidak membaik dalam 48-72 jam bersama tim obgyn. Tata pasangan dan skrining IMS tetap penting, tetapi tidak boleh memperlambat stabilisasi.',
    panduanResmi: `${PPK_FLOOR} PPK 1186/2022 tidak mempunyai bab diagnosis-spesifik untuk PID berat/abses tubo-ovarium; PNPK komplikasi kehamilan hanya sumber terkait, bukan padanan. Pedoman IMS Kemenkes menjadi konteks nasional, sedangkan CDC STI Treatment Guidelines 2021 memberi regimen rawat inap dan kriteria hospitalisasi yang eksplisit untuk abses tubo-ovarium, penyakit berat, suhu di atas 38,5 derajat Celsius, ketidakmampuan menjalani terapi oral, atau diagnosis bedah yang belum tersingkir.`,
    catatanRealita: 'USG pelvis tidak diasumsikan tersedia di Puskesmas Sukamaju. Massa adneksa, demam tinggi, dan tanda peritoneal cukup untuk mencurigai abses serta mengatur transfer; pencitraan definitif dilakukan di rumah sakit. Skrining HIV/sifilis dan konseling pasangan perlu privasi, tetapi boleh dilanjutkan melalui jejaring bila melakukannya saat ini akan menunda antibiotik atau transport.',
    mutiaraEbm: 'Keputihan pada perempuan muda adalah keluhan yang paling sering diremehkan — dianggap "biasa", "kecapekan", atau "jamur" — padahal penyakit radang panggul adalah salah satu penyebab infertilitas dan kehamilan ektopik yang benar-benar dapat dicegah, dan kerusakan tubanya terjadi diam-diam pada episode yang gejalanya justru ringan. Yang menyesatkan berikutnya adalah menunggu gambaran "lengkap": leukosit yang normal, suhu yang normal, dan duh tubuh yang tidak mencolok TIDAK menyingkirkan diagnosis ini. Kriteria minimum CDC sengaja dibuat longgar — cukup nyeri tekan uterus, adneksa, ATAU nyeri goyang serviks pada perempuan berisiko — justru karena harga menunggu kepastian (tuba yang tersumbat seumur hidup) jauh lebih mahal daripada harga mengobati beberapa pasien yang ternyata bukan.',
    konsekuensi: {
      narasi: 'Bila diberi antijamur atau satu antibiotik tanggung lalu dipulangkan, abses tubo-ovarium terus membesar sampai pecah ke rongga perut. Bila pasangan tidak diobati, siklus infeksi ulang berjalan bertahun-tahun sampai kedua tuba tersumbat.',
      kembaliHariMin: 2,
      kembaliHariMax: 5,
      kondisiKembali: 'Kembali dengan perut tegang seperti papan, demam 40 derajat, tekanan darah 80/50 mmHg, dan nadi kecil cepat — abses telah pecah menjadi peritonitis dengan sepsis, dan kini kedua tuba serta ovarium terancam ikut diangkat.',
      guideline: 'Pedoman Nasional Penanganan Infeksi Menular Seksual Kemenkes; CDC STI Treatment Guidelines 2021 — PID berat/abses tubo-ovarium memerlukan regimen parenteral, observasi rawat inap, dan evaluasi bedah bila tidak membaik atau pecah.',
    },
  }),

  // ---------------------------------------------------------------------------
  // 4. Mola hidatidosa
  // ---------------------------------------------------------------------------
  buatKasusOA({
    id: 'lab_mola_hidatidosa',
    nama: 'Suspek Mola Hidatidosa (Hamil Anggur)',
    icd10: 'O01.9',
    kepastianDiagnosis: 'suspek',
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
        hasil: 'Positif. Test-pack urine adalah pemeriksaan kualitatif dan tidak dipakai untuk mengukur kadar hCG.',
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
        hasil: 'TSH 0,04 µIU/mL (tertekan). TSH tunggal tidak cukup mendiagnosis atau menilai derajat tirotoksikosis; interpretasi memerlukan gejala, FT4/FT3, dan penilaian spesialis.',
        flag: 'rendah',
        relevan: false,
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
          alasan: 'TSH tertekan saja tidak membuktikan tirotoksikosis yang memerlukan antitiroid. Pada keadaan stabil, terapi utama tetap evakuasi mola dan penilaian FT4/FT3 di jejaring; PTU empiris di FKTP berisiko agranulositosis/hepatotoksisitas dan dapat menunda rujuk. Tirotoksikosis berat atau thyroid storm adalah pengecualian yang memerlukan tata laksana spesialis segera sebelum/bersamaan dengan evakuasi.',
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
    clue: 'Uterus jauh lebih besar dari usia kehamilan, mual-muntah berat, perdarahan dengan vesikel, tidak terabanya bagian janin, dan tidak terdengarnya denyut janin sangat mencurigakan mola hidatidosa. Test-pack hanya menyatakan hamil; ketebalan garis atau pengenceran urine bukan kuantifikasi hCG. Tugas FKTP adalah membuat diagnosis kerja suspek, menilai stabilitas, dan merujuk tanpa menunggu USG lokal; USG, evakuasi, histopatologi, dan hCG kuantitatif dilakukan di jejaring. Ekor perawatannya wajib jelas: hCG diperiksa tiap 1-2 minggu sampai normal; setelah normal, mola parsial memerlukan satu konfirmasi 1 bulan kemudian, sedangkan mola komplet dipantau bulanan selama 6 bulan. Kehamilan baru mengganggu interpretasi hCG, tetapi kontrasepsi hormonal aman selama masa pemantauan dan dipilih bersama pasien/jejaring.',
    panduanResmi: 'PPK Dokter FKTP KMK 1186/2022 tidak memiliki bab diagnosis-spesifik mola hidatidosa, dan PNPK Komplikasi Kehamilan KMK 91/2017 tidak memuat penyakit trofoblas gestasional. FIGO Cancer Report 2025 menjadi sumber langsung untuk diagnosis, evakuasi, histologi, dan surveilans hCG yang dibedakan menurut mola parsial versus komplet.',
    catatanRealita: 'USG obstetri, evakuasi, dan hCG kuantitatif berada di RS/jejaring dan tidak dijadikan syarat agar Sukamaju boleh merujuk. Puskesmas memegang peran continuity: memastikan hasil USG/histologi tercatat, jadwal hCG dipahami, kontrasepsi dibahas, dan pasien yang mangkir ditelusuri tanpa memberi stigma.',
    mutiaraEbm: 'Gambaran klasik "gelembung seperti anggur yang keluar" justru datang terlambat — ia menandakan mola yang sudah mulai lahir sendiri, dan menunggunya berarti melewatkan pasien yang datang lebih awal. Yang menyesatkan lainnya: uterus TIDAK selalu lebih besar dari usia kehamilan; pada sekitar sepertiga kasus ukurannya sesuai atau bahkan lebih kecil, sehingga "perut sesuai usia" tidak menyingkirkan mola. Sebaliknya, USG trimester pertama yang tampak seperti abortus tak lengkap sering ternyata mola parsial pada pemeriksaan jaringan — itulah sebabnya setiap jaringan hasil kuretase idealnya diperiksa patologi dan setiap perempuan pasca-kuretase diperiksa ulang hCG-nya, bukan hanya yang gambaran badai saljunya jelas.',
    konsekuensi: {
      narasi: 'Bila muntahnya dianggap "mual kehamilan yang berat" dan pasien dipulangkan dengan obat mual, perdarahan bertambah seiring molanya meluruh sendiri; jaringan dapat keluar sebagian dan menyebabkan perdarahan hebat di rumah. Bila pasien dirujuk tetapi tidak pernah dijelaskan soal pemantauan beta-hCG, ia menghilang setelah dikuret dan kembali berbulan-bulan kemudian dengan penyakit yang sudah menyebar.',
      kembaliHariMin: 3,
      kembaliHariMax: 10,
      kondisiKembali: 'Dibawa kembali dengan perdarahan hebat disertai gelembung-gelembung yang keluar bersama bekuan darah, pucat, dan tekanan darah 90/60 mmHg — kini evakuasi harus dikerjakan darurat pada pasien yang sudah anemis berat.',
      guideline: 'FIGO Cancer Report: Diagnosis and management of gestational trophoblastic disease, 2025 update (doi:10.1002/ijgo.70275).',
    },
  }),

  // ---------------------------------------------------------------------------
  // 5. Hiperemesis gravidarum berat
  // ---------------------------------------------------------------------------
  buatKasusOA({
    id: 'lab_hiperemesis_gravidarum_berat',
    nama: 'Hiperemesis Gravidarum Berat dengan Dehidrasi',
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
        id: 'urinalisis',
        hasil: 'Berat jenis 1,030; keton positif; protein negatif; nitrit negatif; leukosit esterase negatif. Keton mencerminkan kelaparan, bukan derajat dehidrasi atau keparahan hiperemesis.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'tes_kehamilan',
        hasil: 'Positif.',
        flag: 'abnormal',
        relevan: true,
      },
    ],
    diagnosisBanding: ['O21.1', 'O01.9', 'A09'],
    tatalaksana: {
      obatBenar: [],
      obatAlternatif: [['nacl_09_inf', 'ringer_laktat_inf']],
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
      prosedur: ['pasang_infus', 'antiemetik_parenteral_hiperemesis', 'tiamin_hiperemesis', 'pemantauan_ketat_vital'],
      tindakanSalahUmum: [
        {
          id: 'bilas_lambung',
          alasan: 'Muntah hebat dengan cairan pahit kadang dikira keracunan makanan atau "lambung penuh asam". Bilas lambung tidak berperan sama sekali pada hiperemesis, berisiko aspirasi pada pasien yang sudah lemah, dan merampas waktu dari satu-satunya terapi yang mendesak: rehidrasi intravena.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['tanda_bahaya_kehamilan', 'rencana_hiperemesis'],
      edukasiKritis: ['tanda_bahaya_kehamilan', 'rencana_hiperemesis'],
    },
    stabilisasiWajib: ['pasang_infus'],
    clue: 'Definisi Windsor mengenali hiperemesis sebagai mual/muntah yang salah satunya berat, mulai sebelum 16 minggu, membuat pasien tidak mampu makan-minum normal, dan sangat membatasi aktivitas. Dehidrasi serta kehilangan berat memperberat kasus ini, tetapi ketonuria bukan syarat diagnosis dan bukan ukuran respons. Karena pasien tidak dapat mempertahankan air atau tablet, FKTP memberi kristaloid intravena, antiemetik parenteral sesuai protokol kehamilan, dan tiamin oral/parenteral sesuai toleransi sebelum dekstrosa atau nutrisi parenteral. Elektrolit serta USG dinilai di jejaring dan tidak boleh menjadi syarat memulai rehidrasi atau transfer. Dekstrosa bukan cairan pengganti rutin. Pantau vital/urine dan rujuk karena ketidakmampuan asupan oral melampaui observasi singkat FKTP.',
    panduanResmi: 'PPK Dokter FKTP KMK 1186/2022 tidak memiliki bab O21.1; bab O21.0 memberi prinsip terapi awal/rujuk tetapi tidak identik dengan skenario berat ini. PNPK Komplikasi Kehamilan KMK 91/2017 tidak memuat hiperemesis. RCOG Green-top 69 edisi 2024 menjadi sumber langsung untuk definisi Windsor, keterbatasan ketonuria, cairan NaCl 0,9% dengan kalium terpandu, antiemetik parenteral ketika oral gagal, dan tiamin sebelum dekstrosa.',
    catatanRealita: 'Pada encounter ini cairan isotonik, set infus, antiemetik parenteral protokol kehamilan, tiamin, monitoring, dan operator dinyatakan ready; elektrolit serta USG ditempuh lewat jejaring tanpa menunda transfer. Status keamanan ondansetron trimester pertama tidak bulat, sehingga pilihan antiemetik mengikuti protokol lokal, kontraindikasi, dan shared decision, bukan asumsi satu obat universal.',
    mutiaraEbm: 'Ketonuria adalah penanda puasa/kelaparan dan tidak berkorelasi andal dengan dehidrasi atau derajat hiperemesis; menjadikannya tiket masuk atau syarat pulang dapat menunda terapi pasien berat yang ketonnya rendah. Gunakan dampak pada makan-minum dan aktivitas, tanda vital, berat badan, produksi urine, elektrolit, serta kemampuan mempertahankan cairan. Penilaian tetap harus mencari diagnosis lain: nyeri abdomen, demam, gejala urin, onset setelah 16 minggu, uterus terlalu besar, atau gejala neurologis mengharuskan perluasan diferensial.',
    konsekuensi: {
      narasi: 'Bila dipulangkan dengan obat maag dan antiemetik oral yang tidak mungkin tertelan, dehidrasi dan gangguan elektrolit dapat berlanjut. Bila muntahnya sudah berminggu-minggu dan pasien akhirnya diinfus dengan cairan berglukosa tanpa tiamin lebih dulu, ensefalopati Wernicke dapat muncul justru setelah "diobati".',
      kembaliHariMin: 1,
      kembaliHariMax: 3,
      kondisiKembali: 'Dibawa kembali dalam keadaan sangat lemah, bicara melantur, mata bergerak-gerak sendiri, dan tidak mampu berjalan tanpa dipapah — gambaran ensefalopati Wernicke yang sebagian defisitnya menetap seumur hidup.',
      guideline: 'RCOG Green-top Guideline No. 69, second edition 2024 (doi:10.1111/1471-0528.17739); PPK FKTP KMK 1186/2022 bab O21.0 sebagai floor terkait.',
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
    lab: [],
    diagnosisBanding: ['S52.5', 'S52.6', 'S63.5'],
    tatalaksana: {
      obatBenar: [],
      obatAlternatif: [['paracetamol_sirup']],
      obatSalahUmum: [
        {
          id: 'paracetamol_500',
          alasan: 'Tablet 500 mg adalah unit dewasa, sedangkan dosis anak harus dihitung dari berat badan. Vignette tidak menyediakan alat pembagi dosis; gunakan sirup yang dapat ditakar.',
          bahaya: 'nonPrimer',
        },
        {
          id: 'ibuprofen_400',
          alasan: 'Ibuprofen bukan larangan universal pada fraktur anak, tetapi tablet 400 mg bukan jawaban baku untuk rentang usia 5-12 tahun tanpa berat badan dan perhitungan dosis. Gunakan analgesia yang dapat ditakar.',
          bahaya: 'nonPrimer',
        },
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
    clue: 'Deformitas, bengkak, dan penolakan menggerakkan lengan setelah jatuh bertumpu telapak tangan harus dianggap fraktur. Tentukan lebih dahulu apakah fraktur terbuka dan nilai status neurovaskular distal. Pada kasus ini kulit utuh, sehingga antibiotik profilaksis dan tetanus tidak diperlukan. Beri analgesia berbasis berat badan. Catat nadi, warna, suhu, sensasi, serta gerak jari sebelum pemasangan bidai. Imobilisasi siku dan pergelangan dalam posisi ditemukan tanpa memaksa meluruskan, lalu periksa ulang status neurovaskular. Tinggikan lengan dan rujuk ke bedah untuk pencitraan serta reposisi definitif. Jangan mencoba reposisi buta di FKTP karena dapat mencederai saraf, pembuluh, kulit, dan lempeng pertumbuhan.',
    panduanResmi: `${PPK_FLOOR} PPK Dokter FKTP menempatkan fraktur sebagai kompetensi 3B: dokter FKTP memberi analgesia, melakukan imobilisasi, menilai neurovaskular, lalu merujuk — reposisi definitif bukan kewenangan FKTP. Kriteria rujukan resminya mencakup setiap fraktur dengan deformitas atau pergeseran, setiap fraktur pada anak yang melibatkan atau berdekatan dengan lempeng pertumbuhan, dan setiap gangguan neurovaskular. Perbedaan tata laksana antara fraktur tertutup dan terbuka — antibiotik parenteral dini dan profilaksis tetanus HANYA pada yang terbuka — adalah pembeda yang eksplisit di pedoman.`,
    catatanRealita: 'Foto ekstremitas tidak diasumsikan tersedia di Sukamaju: deformitas dan mekanisme cukup untuk suspek fraktur, bidai, dokumentasi neurovaskular, dan rujuk; pencitraan dilakukan di jejaring. Kosakata game menampilkan sediaan tetap, sedangkan dosis analgesia anak selalu dihitung per kilogram. Karena berat badan tidak dimodelkan pada vignette ini, hanya sirup yang dapat ditakar diberi kredit.',
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
        hasil: 'Hasil jejaring yang dibawa keluarga: MCV 62 fL dan MCH 19 pg (mikrositik hipokrom berat), tetapi hitung eritrosit 4,9 juta/µL — JUSTRU TINGGI untuk derajat anemia seberat ini. RDW meningkat. Apusan: anisopoikilositosis mencolok, banyak sel target, dan normoblas beredar di darah tepi. Leukosit dan trombosit normal.',
        flag: 'abnormal',
        relevan: true,
      },
      {
        id: 'ferritin_serum',
        hasil: 'Hasil jejaring yang dibawa keluarga: feritin 720 ng/mL — TINGGI, bukan rendah.',
        flag: 'tinggi',
        relevan: true,
      },
      {
        id: 'hitung_retikulosit',
        hasil: 'Hasil jejaring yang dibawa keluarga: retikulosit 4,8% (meningkat) — sumsum tulang bekerja keras, produksinya tidak gagal.',
        flag: 'tinggi',
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
          alasan: 'Obat cacing diberikan sebagai refleks pada setiap anak pucat di Indonesia, dan sering memang tepat. Di sini tidak: pucat sejak bayi, wajah khas, limpa besar, pola indeks eritrosit, feritin tinggi, dan kegagalan terapi besi jauh lebih kuat mengarah ke talasemia daripada anemia cacing tambang. Pemeriksaan parasit dilakukan bila riwayat/epidemiologi mendukung, tetapi obat cacing empiris tidak boleh menunda konfirmasi talasemia.',
          bahaya: 'nonPrimer',
        },
      ],
      prosedur: [],
      tindakanSalahUmum: [
        {
          id: 'transfusi_darah_fktp',
          alasan: 'Hb 6,2 g/dL memang memerlukan perhatian segera, tetapi transfusi talasemia harus terencana. Pasien memerlukan fenotipe sel darah merah, uji silang, darah leukoreduksi, target Hb, dan pemantauan beban besi. Transfusi improvisasi di Puskesmas berisiko menimbulkan reaksi akut dan alloimunisasi, yang akan menyulitkan pencarian darah cocok pada transfusi berikutnya.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['dukungan_transfusi_rutin', 'kontrol_rutin', 'tanda_bahaya'],
      edukasiKritis: ['dukungan_transfusi_rutin'],
    },
    clue: 'Pucat menahun sejak bayi, hepatosplenomegali, perubahan tulang wajah, perawakan pendek, riwayat keluarga "kurang darah bawaan", dan zat besi bertahun-tahun yang tidak mengubah apa pun sangat mencurigakan talasemia beta mayor. Hasil jejaring berupa anemia mikrositik berat dengan feritin tinggi, hitung eritrosit relatif terpelihara, retikulosit meningkat, sel target, dan normoblas memperkuat arah tetapi tidak mengunci etiologi sendiri; feritin dipengaruhi inflamasi dan indeks Mentzer hanya alat skrining. Diagnosis pasti memerlukan analisis hemoglobin, dengan pemeriksaan genetik bila diperlukan, di pusat rujukan. Tugas FKTP: hentikan besi empiris yang tidak beralasan, beri asam folat sesuai PNPK, rujuk ke spesialis anak untuk program transfusi/kelasi, dan jaga continuity. Talasemia adalah penyakit keluarga: orang tua sangat mungkin membawa varian hemoglobin terkait, tetapi pola pewarisan dan risiko kehamilan berikutnya harus dikonfirmasi lewat skrining/konseling genetik, bukan dinyatakan pasti tanpa pemeriksaan.',
    panduanResmi: 'PPK FKTP KMK 1186/2022 tidak mempunyai bab diagnosis-spesifik talasemia pada crosswalk 167 bab; jangan mengatribusikan algoritme ini ke PPK. PNPK Tata Laksana Talasemia HK.01.07/MENKES/1/2018 menjadi sumber langsung untuk konfirmasi analisis hemoglobin, transfusi/kelasi oleh jejaring, pemantauan komplikasi, dan skrining keluarga; peran FKTP adalah mengenali pola, menghentikan besi empiris yang tidak beralasan, merujuk, serta menjaga continuity.',
    catatanRealita: 'CBC/apusan, feritin, dan retikulosit pada kartu ini adalah hasil jejaring terbaru yang dibawa keluarga, bukan pemeriksaan yang diasumsikan dilakukan onsite; analisis hemoglobin tetap milik pusat rujukan. Kesenjangan terbesarnya adalah jarak dan biaya tak langsung karena transfusi rutin tiap 2-4 minggu, sehingga continuity FKTP dan penelusuran mangkir sangat bermakna.',
    mutiaraEbm: 'Anemia mikrositik hipokrom sering disebabkan defisiensi besi, tetapi pola ini tidak boleh memicu resep berulang tanpa evaluasi. Bila anemia tidak membaik setelah terapi besi yang adekuat, tinjau kembali diagnosis dan pertimbangkan talasemia. Jangan langsung menyimpulkan pasien tidak patuh atau dosisnya kurang. Feritin dapat meningkat saat infeksi atau inflamasi dan menutupi defisiensi besi; baca nilainya bersama konteks klinis. Pada anak ini, feritin sangat tinggi tanpa tanda radang mendukung masalah kelebihan besi. Indeks Mentzer dan rumus sejenis hanya membantu arah awal. Konfirmasi tetap memerlukan analisis hemoglobin di jejaring.',
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
    skdi: '4A',
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
    ],
    diagnosisBanding: ['E43', 'E41', 'A09'],
    tatalaksana: {
      obatBenar: [],
      obatOpsional: ['vitamin_a_kapsul', 'oralit'],
      obatSalahUmum: [

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
      prosedur: [
        'koreksi_hipoglikemia_gizi_buruk_anak',
        'rehidrasi_gizi_buruk_non_syok',
        'jaga_hangat_gizi_buruk_anak',
        'antibiotik_parenteral_gizi_buruk_protokol',
        'pemantauan_ketat_vital',
      ],
      terapiKritis: [
        'koreksi_hipoglikemia_gizi_buruk_anak',
        'jaga_hangat_gizi_buruk_anak',
        'antibiotik_parenteral_gizi_buruk_protokol',
      ],
      tindakanSalahUmum: [
        {
          id: 'rehidrasi_plan_c_bayi',
          alasan: 'Ini jebakan paling mematikan dalam kasus ini. Plan C — cairan intravena cepat 100 mL/kg — adalah protokol dehidrasi berat pada anak GIZI BAIK, dan memberikannya pada gizi buruk dapat membunuh. Otot jantung anak ini ikut atrofi dan cadangan elektrolit tubuhnya terganggu, sehingga beban cairan cepat dapat mencetuskan gagal jantung dan edema paru. Protokol WHO/Kemenkes memakai rehidrasi khusus gizi buruk secara oral/NG dengan penilaian ulang sangat sering; jalur intravena HANYA bila anak benar-benar syok dan dengan protokol khusus. Anak ini akralnya hangat dengan nadi teraba jelas — ia tidak syok.',
          bahaya: 'berbahaya',
        },
        {
          id: 'transfusi_darah_fktp',
          alasan: 'Pada gizi buruk, ambang transfusi jauh lebih ketat justru karena beban volume berbahaya: darah diberikan hanya bila Hb di bawah 4 g/dL, atau di bawah 6 g/dL bila disertai tanda gagal napas, dan itu pun sangat lambat 10 mL/kg selama 3 jam dengan furosemid. Hb 8,6 g/dL jelas jauh di atas ambang mana pun, dan Puskesmas tidak punya bank darah. Memberikan darah di sini berarti menambahkan beban volume pada jantung yang sudah atrofi — kesalahan yang sama dengan Plan C, hanya dengan cairan yang lebih mahal.',
          bahaya: 'berbahaya',
        },
      ],
      edukasi: ['rujuk_gizi_buruk_komplikasi', 'rehabilitasi_gizi', 'cuci_tangan_makanan', 'tanda_bahaya'],
      edukasiKritis: ['rujuk_gizi_buruk_komplikasi'],
    },
    stabilisasiWajib: [
      'koreksi_hipoglikemia_gizi_buruk_anak',
      'rehidrasi_gizi_buruk_non_syok',
      'jaga_hangat_gizi_buruk_anak',
      'antibiotik_parenteral_gizi_buruk_protokol',
      'pemantauan_ketat_vital',
    ],
    clue: 'BB/PB di bawah -3 SD, LiLA 10,2 cm, asupan berhenti, diare, demam, lesu, dan GDS 44 mg/dL menunjukkan gizi buruk dengan komplikasi: stabilisasi lalu rawat inap TFC/RS, bukan RUTF rawat jalan. Laporan wali "tidak mau makan" bukan hasil uji nafsu makan terstandar. Danger sign, masalah medis akut, dan hipoglikemia sudah cukup untuk rawat inap. Koreksi hipoglikemia dengan glukosa atau sukrosa 10% sekitar 5 mL/kg oral/NG, bukan rule-of-15 dewasa; nilai ulang kesadaran dan GDS, lalu beri makan terapeutik bila formula dan pemantauan siap. Cegah hipotermia, pantau, dan mulai antibiotik sesuai protokol jejaring. Bila dehidrasi tanpa syok, berikan ReSoMal perlahan; WHO 2023 membolehkan ORS osmolaritas rendah bila ReSoMal tidak tersedia. Hindari Plan C cepat. Vitamin A dosis tinggi bukan rutinitas bila formula terapeutik atau suplemen harian sudah mencukupi.',
    panduanResmi: 'PPK Dokter FKTP KMK 1186/2022 memuat bab Malnutrisi Energi Protein (tingkat kemampuan 4A) dan menetapkan gizi buruk dengan komplikasi medis sebagai kasus rawat inap/rujuk. Pedoman Pencegahan dan Tatalaksana Gizi Buruk pada Balita Kemenkes 2020 memberi alur 10 langkah. WHO Wasting/Nutritional Oedema Guideline 2023 menggantikan guideline 2013: rekomendasi B2 mendukung rawat inap pada danger sign, masalah medis akut, edema berat, atau gagal uji nafsu makan. Kasus ini masuk melalui danger sign/masalah medis akut dan hipoglikemia, bukan hasil uji nafsu makan yang tidak pernah dilakukan. Rekomendasi B7 memilih ReSoMal namun membolehkan ORS osmolaritas rendah bila ReSoMal tidak tersedia.',
    catatanRealita: 'GDS tersedia cepat; tes lain tidak boleh menunda stabilisasi. ReSoMal, F-75, dan mineral-mix tidak diasumsikan siap. Skor pra-rujuk menilai koreksi gula dan penilaian ulang. Mulai makan terapeutik bila formula/pemantauan siap; ketiadaan F-75 tidak boleh menunda transfer ke TFC/RS. Bila ReSoMal kosong, gunakan ORS osmolaritas rendah perlahan dan terpantau, bukan Plan C. Antibiotik mengikuti protokol jejaring.',
    mutiaraEbm: 'Mata cekung dan turgor lambat dapat menetap pada anak marasmik meski dehidrasi tidak berat. Jangan menilai kebutuhan cairan hanya dari dua tanda tersebut karena kelebihan cairan dapat memicu gagal jantung. Gunakan riwayat kehilangan cairan dan pantau respons terhadap rehidrasi perlahan, seperti nadi, produksi urin, serta kembalinya air mata. Gizi buruk juga dapat menekan tanda infeksi: anak dengan sepsis mungkin tidak demam dan leukositnya dapat normal. Karena itu, protokol memberi antibiotik pada gizi buruk dengan komplikasi meski tanda infeksi tidak menonjol. Pada kwashiorkor, edema dapat menaikkan berat badan secara semu. Periksa edema kedua punggung kaki dan jangan mengandalkan angka timbangan saja.',
    konsekuensi: {
      narasi: 'Tanpa koreksi hipoglikemia dan pencegahan hipotermia, kondisi anak dapat cepat memburuk hingga kejang, gangguan kesadaran, dan gagal napas. Sebaliknya, bolus Plan C pada anak yang tidak syok dapat memicu kelebihan cairan dan gagal jantung. Pilihan aman adalah gula segera, jaga hangat, rehidrasi perlahan yang dipantau, antibiotik sesuai protokol, dan transfer tanpa menunggu pemeriksaan tambahan.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Beberapa jam setelah infus cepat dipasang, anak menjadi sangat sesak, napasnya berbunyi basah, kelopak matanya membengkak, dan nadinya melemah — gagal jantung dan edema paru pada anak yang datang dalam keadaan tidak syok.',
      guideline: 'Pedoman Pencegahan dan Tatalaksana Gizi Buruk pada Balita Kemenkes 2020; WHO Guideline on Prevention and Management of Wasting and Nutritional Oedema 2023.',
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
