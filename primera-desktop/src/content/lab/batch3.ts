import type { KasusKlinis } from '../types'
import type { FktpLabSpec } from './labCaseFactory'
import { buatKasusFktpLab } from './labCaseFactory'

interface LabDefinition {
  catalogId: string
  conceptId?: string
  spec: FktpLabSpec
}

const PPK = 'Acuan dasar keputusan kasus ini adalah PPK Dokter di FKTP (KMK 1186/2022); sumber yang lebih baru dipakai bila mengubah keselamatan atau efektivitas.'
const PNPK_COT_2022 = 'PNPK Cedera Otak Traumatik KMK HK.01.07/MENKES/1600/2022 menjadi acuan dasar khusus untuk penilaian trauma kepala.'
const PNPK_TRAUMA_2017 = 'PNPK Tata Laksana Trauma KMK HK.01.07/MENKES/132/2017 menjadi acuan dasar lintas fasilitas untuk survei primer, penilaian luka, stabilisasi, dan rujukan trauma.'
const NORMAL = { td: '120/78', nadi: 78, rr: 18, suhu: 36.7, spo2: 99 } as const

const DEFINITIONS: LabDefinition[] = [
  {
    catalogId: 'leg_ulcer',
    spec: {
      id: 'lab_ulkus_tungkai_vena', nama: 'Ulkus Tungkai Kronis - Dominan Vena', icd10: 'L97', kategori: 'muskuloskeletal', prevalensi: 'sedang',
      keluhanUtama: 'Luka di atas mata kaki saya sudah lama tidak menutup.', usia: [45, 75], vital: NORMAL,
      pembuka: ['Bagaimana luka ini bermula dan berubah?', 'Tiga bulan lalu kecil, lalu melebar; tungkai juga bengkak sore hari dan membaik saat diangkat.'],
      pertanyaan: [
        ['q_infeksi', 'rps', 'Ada demam, nanah, bau memburuk, atau kemerahan yang meluas?', 'Tidak demam dan tidak bernanah.', true],
        ['q_arteri', 'rps', 'Kaki nyeri saat berjalan atau saat istirahat, dingin, atau menghitam?', 'Tidak; kaki tetap hangat.', true],
        ['q_risiko', 'rpd', 'Ada diabetes, varises, bekuan darah, atau kebiasaan merokok?', 'Ada varises lama, gula darah terakhir normal.', true],
      ],
      fisik: [['ekstremitas', 'Ulkus dangkal tidak beraturan di gaiter area medial, edema pitting, hiperpigmentasi; kaki hangat dan nadi dorsalis pedis teraba.'], ['kulit', 'Tidak ada pus, selulitis, nekrosis, atau jaringan terpapar.']],
      lab: [['gds', '112 mg/dL.', 'normal']],
      diagnosisBanding: ['L97', 'I83.0', 'E11.5'],
      tatalaksana: { obatBenar: [], obatOpsional: ['paracetamol_500'], prosedur: ['perawatan_luka'], edukasi: ['perawatan_ulkus_tungkai', 'tanda_bahaya'] },
      clue: 'Lokasi gaiter, edema memburuk saat berdiri, varises, dan nadi teraba mendukung ulkus vena. Bersihkan dan balut, elevasi, nilai penyakit arteri sebelum kompresi, serta koreksi faktor risiko; jangan memberi antibiotik tanpa infeksi klinis.',
      panduanResmi: PPK,
      catatanRealita: 'Doppler/ABI tidak diasumsikan selalu ready. Kompresi kuat tidak dijadikan jawaban wajib sebelum perfusi arteri dinilai aman melalui jejaring.',
    },
  },
  {
    catalogId: 'lipoma',
    spec: {
      id: 'lab_lipoma_lengan', nama: 'Lipoma Subkutan', icd10: 'D17', kategori: 'muskuloskeletal', prevalensi: 'sedang',
      keluhanUtama: 'Ada benjolan lunak di lengan yang perlahan membesar.', usia: [25, 65], vital: NORMAL,
      pembuka: ['Sejak kapan benjolan ada dan bagaimana pertumbuhannya?', 'Sudah dua tahun, membesar sangat pelan, tidak sakit.'],
      pertanyaan: [
        ['q_redflag', 'rps', 'Apakah cepat membesar, keras, nyeri malam, melekat, atau mengganggu gerak?', 'Tidak, benjolan mudah digerakkan dan tidak mengganggu.', true],
        ['q_sistemik', 'rps', 'Ada demam, berat badan turun, atau benjolan lain?', 'Tidak ada.', true],
        ['q_riwayat', 'rpd', 'Pernah trauma atau keganasan?', 'Tidak pernah.', false],
      ],
      fisik: [['ekstremitas', 'Massa subkutan 3 cm, lunak, lobulated, mobile, tidak nyeri, kulit di atas normal.'], ['umum', 'Tidak ada limfadenopati atau tanda sistemik.', false]],
      diagnosisBanding: ['D17', 'L72.9', 'C49.9'],
      tatalaksana: { obatBenar: [], edukasi: ['kontrol_rutin', 'tanda_bahaya'] },
      clue: 'Massa subkutan lunak, mobile, lambat tumbuh, dan tanpa red flag khas lipoma. Beri reassurance dan observasi; eksisi elektif bila nyeri, mengganggu fungsi/kosmetik, diagnosis meragukan, atau pertumbuhan berubah.',
      panduanResmi: PPK,
    },
  },
  {
    catalogId: 'molluscum',
    spec: {
      id: 'lab_moluskum_kontagiosum_anak', nama: 'Moluskum Kontagiosum Anak', icd10: 'B08.1', kategori: 'kulit', prevalensi: 'sedang',
      keluhanUtama: 'Anak saya punya bintil kecil mengilap di lengan dan badan.', keluhanUtamaOlehPendamping: true, usia: [2, 10], vital: { ...NORMAL, td: '100/64' },
      pembuka: ['Bintilnya mulai kapan dan apakah mengganggu?', 'Dua bulan, bertambah perlahan, tidak demam dan hanya sedikit gatal.'],
      pertanyaan: [
        ['q_sebar', 'rps', 'Ada bintil di mata atau kemaluan, bernanah, atau sangat meradang?', 'Tidak, hanya di lipatan siku dan badan.', true],
        ['q_kontak', 'sosial', 'Ada teman serumah dengan keluhan serupa atau berbagi handuk?', 'Sepupunya punya bintil mirip dan mereka sering bermain bersama.', true],
        ['q_imun', 'rpd', 'Anak sering infeksi berat atau memakai obat penekan imun?', 'Tidak.', false],
      ],
      fisik: [['kulit', 'Papul mutiara 2-5 mm multipel dengan umbilikasi sentral, tanpa selulitis.'], ['umum', 'Anak aktif dan status gizi baik.', false]],
      diagnosisBanding: ['B08.1', 'B07', 'L73.9'],
      tatalaksana: { obatBenar: [], prosedur: [], edukasi: ['kebersihan_kulit', 'tanda_bahaya'] },
      clue: 'Papul mutiara berlekuk di tengah khas moluskum dan sering swasirna. Hindari memencet/berbagi handuk; observasi adalah pilihan utama. Kuretase atau krioterapi hanya tindakan terpilih setelah diskusi nyeri, bekas, lokasi, dan kompetensi.',
      panduanResmi: PPK,
    },
  },
  {
    catalogId: 'herpes_simplex',
    spec: {
      id: 'lab_herpes_simpleks_labialis', nama: 'Herpes Simpleks Labialis Rekuren', icd10: 'B00.9', kategori: 'kulit', prevalensi: 'sedang',
      keluhanUtama: 'Bibir saya kesemutan lalu muncul lenting bergerombol.', usia: [18, 55], vital: NORMAL,
      pembuka: ['Bagaimana keluhan ini dimulai dan sudah berapa lama?', 'Kesemutan kemarin, lalu lenting perih muncul di tepi bibir; pernah kambuh saat kurang tidur.'],
      pertanyaan: [
        ['q_mata', 'rps', 'Ada mata merah, nyeri, atau penglihatan kabur?', 'Tidak ada.', true],
        ['q_imun', 'rpd', 'Ada gangguan imun atau lesi sangat luas?', 'Tidak.', true],
        ['q_hamil', 'rpd', 'Apakah sedang hamil atau mungkin hamil?', 'Tidak.', false, 'P'],
        ['q_kontak', 'sosial', 'Ada kontak dekat dengan bayi atau orang imunitasnya lemah?', 'Ada bayi di rumah, tetapi belum saya cium sejak lenting muncul.', true],
      ],
      fisik: [['kulit', 'Vesikel berkelompok di dasar eritem pada vermilion bibir, tanpa pus.'], ['mata', 'Kornea jernih dan tidak ada lesi periokular.', true]],
      diagnosisBanding: ['B00.9', 'B02.9', 'K12.0'],
      tatalaksana: { obatBenar: ['asiklovir_400'], edukasi: ['kebersihan_kulit', 'tanda_bahaya'] },
      clue: 'Prodrom kesemutan dan vesikel berkelompok rekuren mendukung HSV labialis. Antivirus dini paling bermanfaat; jaga kebersihan tangan, hindari kontak lesi dengan mata dan kontak dekat saat aktif.',
      panduanResmi: PPK,
    },
  },
  {
    catalogId: 'ektima',
    spec: {
      id: 'lab_ektima_tungkai', nama: 'Impetigo Ulseratif (Ektima)', icd10: 'L08.0', kategori: 'kulit', prevalensi: 'rendah',
      keluhanUtama: 'Anak saya mengalami koreng tebal di tungkai yang menjadi luka cekung dan nyeri.', keluhanUtamaOlehPendamping: true, usia: [8, 12], vital: { ...NORMAL, td: '104/66', suhu: 37.4 },
      pembuka: ['Luka bermula seperti apa dan apakah menyebar?', 'Awalnya lecet gatal, lalu bernanah dan membentuk kerak tebal selama seminggu.'],
      pertanyaan: [
        ['q_sistemik', 'rps', 'Ada demam tinggi, kemerahan cepat meluas, atau sangat lemas?', 'Tidak.', true],
        ['q_risiko', 'rpd', 'Ada diabetes, gangguan imun, atau luka serupa berulang?', 'Tidak ada.', true],
        ['q_higiene', 'sosial', 'Bagaimana perawatan luka dan kebersihan di rumah?', 'Hanya ditutup kain dan sering tergaruk.', false],
      ],
      fisik: [['kulit', 'Ulkus dangkal punched-out multipel dengan krusta tebal melekat di tungkai; eritem lokal tanpa selulitis luas.'], ['umum', 'Perfusi baik, tidak toksik.', true]],
      diagnosisBanding: ['L08.0', 'L01.0', 'L97'],
      tatalaksana: { obatBenar: ['cefadroxil_sirup_125'], obatOpsional: ['mupirosin_krim'], prosedur: ['perawatan_luka'], edukasi: ['kebersihan_kulit', 'tanda_bahaya'] },
      clue: 'Ulkus berkrusta tebal yang lebih dalam daripada impetigo mendukung ektima. Bersihkan krusta secara lembut dan beri antibiotik antistafilokokus/streptokokus; evaluasi selulitis, diabetes, dan respons.',
      panduanResmi: `${PPK} Bab pioderma hanya acuan dasar terkait dan tidak identik dengan ektima. IDSA SSTI membedakan ektima sebagai infeksi lebih dalam dan merekomendasikan antibiotik oral sekitar 7 hari yang mencakup S. aureus serta streptokokus, dengan kultur bila pola tidak tipikal atau respons buruk.`,
    },
  },
  {
    catalogId: 'folliculitis',
    spec: {
      id: 'lab_folikulitis_superfisialis', nama: 'Folikulitis Superfisialis', icd10: 'L73.9', kategori: 'kulit', prevalensi: 'sedang',
      keluhanUtama: 'Ada bintil bernanah kecil di sekitar rambut paha setelah mencukur.', usia: [18, 55], vital: NORMAL,
      pembuka: ['Kapan bintil muncul dan adakah pemicunya?', 'Dua hari setelah mencukur, bintil kecil sedikit perih tetapi tidak membesar.'],
      pertanyaan: [
        ['q_berat', 'rps', 'Ada benjolan besar, demam, kemerahan meluas, atau nyeri berat?', 'Tidak.', true],
        ['q_kambuh', 'rpd', 'Sering berulang, diabetes, atau memakai bak air panas bersama?', 'Tidak.', false],
        ['q_alat', 'sosial', 'Pisau cukur dipakai bersama atau sudah lama?', 'Pisau lama tetapi tidak dipakai orang lain.', true],
      ],
      fisik: [['kulit', 'Pustul 2-3 mm terpusat pada folikel rambut, jumlah terbatas, tanpa fluktuasi atau selulitis.'], ['umum', 'Afebris dan tampak baik.', false]],
      diagnosisBanding: ['L73.9', 'L02', 'L70.0'],
      tatalaksana: { obatBenar: ['mupirosin_krim'], edukasi: ['kebersihan_kulit', 'tanda_bahaya'] },
      clue: 'Pustul kecil folikulosentrik tanpa abses atau gejala sistemik adalah folikulitis superfisial. Hentikan pencukuran sementara, kompres/higiene, terapi topikal terbatas; antibiotik oral tidak rutin.',
      panduanResmi: `${PPK} Bab pioderma hanya acuan dasar terkait dan bukan padanan folikulitis identik. IDSA SSTI membantu memisahkan proses folikular superfisial dari furunkel/abses yang memerlukan drainase; perluasan, kekambuhan, hot-tub exposure, atau gejala sistemik mengubah evaluasi.`,
    },
  },
  {
    catalogId: 'furuncle',
    spec: {
      id: 'lab_furunkel_fluktuatif', nama: 'Furunkel Fluktuatif Lokal', icd10: 'L02', kategori: 'kulit', prevalensi: 'sedang',
      keluhanUtama: 'Benjolan di paha terasa berdenyut dan sekarang lunak di tengah.', usia: [18, 60], vital: NORMAL,
      pembuka: ['Bagaimana benjolan berkembang?', 'Mulai seperti bintil empat hari lalu, membesar dan nyeri; tidak demam.'],
      pertanyaan: [
        ['q_redflag', 'rps', 'Ada demam, garis merah, kemerahan luas, atau lokasi di wajah?', 'Tidak, hanya satu di paha.', true],
        ['q_risiko', 'rpd', 'Ada diabetes, gangguan imun, atau abses berulang?', 'Tidak.', true],
        ['q_manipulasi', 'sosial', 'Sudah dipencet atau ditusuk sendiri?', 'Belum.', false],
      ],
      fisik: [['kulit', 'Nodul 2 cm eritematosa dengan fluktuasi sentral; selulitis sekitar minimal.'], ['umum', 'Afebris, hemodinamik stabil.', false]],
      diagnosisBanding: ['L02', 'L73.9', 'L03.9'],
      tatalaksana: { obatBenar: [], prosedur: ['insisi_abses'], edukasi: ['kebersihan_kulit', 'tanda_bahaya'] },
      clue: 'Furunkel berfluktuasi memerlukan insisi-drainase aseptik. Antibiotik sistemik bukan pengganti drainase dan tidak rutin pada abses kecil tanpa selulitis luas, gejala sistemik, lokasi berisiko, atau imunokompromais.',
      panduanResmi: `${PPK} Bab pioderma hanya acuan dasar terkait dan bukan padanan furunkel identik. IDSA SSTI merekomendasikan insisi-drainase untuk furunkel besar atau fluktuatif; antibiotik sistemik biasanya tidak diperlukan tanpa demam, tanda sistemik, pertahanan host terganggu, atau kegagalan kendali sumber.`,
    },
  },
  {
    catalogId: 'erythrasma',
    spec: {
      id: 'lab_eritrasma_lipat_paha', nama: 'Eritrasma Lipat Paha', icd10: 'L08.1', kategori: 'kulit', prevalensi: 'sedang',
      keluhanUtama: 'Lipat paha saya bercak cokelat tipis dan sedikit gatal.', usia: [25, 70], vital: NORMAL,
      pembuka: ['Sejak kapan bercak ada dan bagaimana rasanya?', 'Sebulan, tidak terlalu gatal, tidak melebar seperti cincin.'],
      pertanyaan: [
        ['q_risiko', 'rpd', 'Ada diabetes, berat badan berlebih, atau mudah berkeringat?', 'Saya mudah berkeringat dan berat badan berlebih.', true],
        ['q_obat', 'rpd', 'Sudah memakai antijamur atau steroid?', 'Antijamur seminggu tidak banyak berubah.', true],
        ['q_lokasi', 'rps', 'Ada juga di sela jari atau ketiak?', 'Sedikit di ketiak.', false],
      ],
      fisik: [['kulit', 'Plak cokelat-merah berbatas tegas dengan skuama halus di lipat paha, tanpa active border atau satelit.'], ['umum', 'Tidak ada tanda infeksi sistemik.', false]],
      lab: [['mikroskopis_gram_koh', 'KOH negatif; gambaran mendukung infeksi Corynebacterium.', 'abnormal']],
      diagnosisBanding: ['L08.1', 'B35.6', 'B37.2'],
      tatalaksana: { obatBenar: ['mupirosin_krim'], edukasi: ['kebersihan_kulit', 'kontrol_rutin'] },
      clue: 'Plak cokelat halus di lipatan tanpa tepi aktif, KOH negatif, dan respons buruk terhadap antijamur mendukung eritrasma. Jaga area kering dan gunakan antibiotik topikal; periksa diabetes bila berulang.',
      panduanResmi: PPK,
      catatanRealita: 'Mikroskop, KOH, consumable, dan analis dinyatakan ready pada jadwal laboratorium encounter ini; lampu Wood tidak diasumsikan tersedia. KOH negatif membantu menurunkan kemungkinan dermatofitosis, tetapi bila lab tidak ready diagnosis tetap klinis dan respons harus dievaluasi ulang.',
    },
  },
  {
    catalogId: 'erysipelas',
    spec: {
      id: 'lab_erisipelas_tungkai_ringan', nama: 'Erisipelas Tungkai Tanpa Sepsis', icd10: 'A46', kategori: 'kulit', prevalensi: 'rendah',
      keluhanUtama: 'Tungkai bawah merah, hangat, dan nyeri sejak kemarin.', usia: [30, 70], vital: { td: '122/78', nadi: 92, rr: 18, suhu: 38.0, spo2: 99 },
      pembuka: ['Bagaimana kemerahan mulai dan menyebar?', 'Muncul mendadak dari lecet sela jari, batasnya jelas dan agak meluas.'],
      pertanyaan: [
        ['q_sepsis', 'rps', 'Ada menggigil hebat, bingung, pingsan, atau kencing berkurang?', 'Tidak.', true],
        ['q_risiko', 'rpd', 'Ada diabetes, gangguan imun, atau erisipelas berulang?', 'Tidak.', true],
        ['q_alergi', 'rpd', 'Pernah alergi berat terhadap penisilin?', 'Tidak.', true],
      ],
      fisik: [['kulit', 'Plak merah terang, hangat, nyeri, berbatas tegas dan sedikit meninggi di tungkai; tidak ada nekrosis atau krepitasi.'], ['umum', 'Sadar baik, perfusi normal, tidak toksik.', true]],
      diagnosisBanding: ['A46', 'L03.9', 'I80.2'],
      tatalaksana: { obatBenar: ['amoxicillin_500'], obatOpsional: ['paracetamol_500'], edukasi: ['kebersihan_kulit', 'tanda_bahaya'] },
      clue: 'Plak eritem hangat, nyeri, berbatas tegas dan meninggi mendukung erisipelas streptokokus. Terapi beta-laktam, elevasi, tandai tepi, rawat pintu masuk, dan evaluasi ulang 24-48 jam; rujuk bila sepsis, progresi cepat, nekrosis, atau komorbid tidak stabil.',
      panduanResmi: PPK,
    },
  },
  {
    catalogId: 'scrofuloderma',
    spec: {
      id: 'lab_skrofuloderma_suspek', nama: 'Suspek Skrofuloderma (TB Kulit)', icd10: 'A18.4', kepastianDiagnosis: 'suspek', kategori: 'kulit', prevalensi: 'rendah', harusDirujuk: true, spesialisRujukan: 'penyakit_dalam',
      keluhanUtama: 'Benjolan leher pecah menjadi luka berair yang tidak sembuh.', usia: [15, 55], vital: { ...NORMAL, suhu: 37.2 },
      pembuka: ['Benjolan dan lukanya berkembang bagaimana?', 'Dua bulan benjolan tidak nyeri, kemudian melunak dan pecah; berat badan turun.'],
      pertanyaan: [
        ['q_gejala_tb_paru', 'rps', 'Ada batuk lebih dari dua minggu, dahak berdarah, sesak, demam lama, atau keringat malam?', 'Tidak batuk lama atau sesak, tetapi malam sering berkeringat.', true],
        ['q_kontak_tb', 'sosial', 'Ada orang serumah atau kontak erat yang pernah didiagnosis TB?', 'Paman serumah sedang menjalani pengobatan TB paru.', true],
        ['q_hiv', 'rpd', 'Pernah tes HIV atau punya gangguan imun?', 'Belum pernah tes HIV.', true],
        ['q_obat', 'rpd', 'Sudah minum antibiotik atau OAT?', 'Antibiotik biasa tidak memperbaiki, belum pernah OAT.', true],
      ],
      // Audit CODEX 2026-08-04 (temuan 3): ini kasus TB KULIT tetapi tak ada
      // satu pun temuan regio `kulit` — memeriksa kulit dijawab "dalam batas
      // normal" pada pasien yang justru datang karena luka kulit. Kalimat ini
      // hanya memindahkan sisi kulit dari temuan kepala-leher yang sudah ada
      // (sinus, tepi bergaung) dan menyatakan bagian tubuh lain bersih.
      fisik: [['kulit', 'Kelainan kulit terbatas pada leher: lubang sinus yang mengeluarkan cairan dengan tepi bergaung di atas nodus, sesuai temuan kepala-leher. Di badan dan anggota gerak tidak ditemukan ruam atau lesi kulit lain.'], ['kepala_leher', 'Nodus servikal matted, sebagian fluktuatif, dengan sinus dan tepi undermined.'], ['toraks_paru', 'Suara napas vesikuler; tidak menyingkirkan TB ekstra paru.', true]],
      lab: [['tcm_spesimen_lesi', 'Aspirat nodus/jaringan dari layanan jejaring: MTB terdeteksi; resistensi rifampisin tidak terdeteksi. Bukan swab cairan sinus permukaan.', 'abnormal']],
      diagnosisBanding: ['A18.4', 'L04.0', 'C77.0'],
      tatalaksana: { obatBenar: [], edukasi: ['alur_tb_ekstraparu', 'investigasi_kontak_tb', 'kepatuhan_obat', 'tanda_bahaya'], edukasiKritis: ['alur_tb_ekstraparu', 'investigasi_kontak_tb'] },
      // Audit CODEX 2026-07-16 #3: dulu konfirmasiWajib='tcm_spesimen_lesi'
      // (hasil BESOK) pada kasus WAJIB-RUJUK → no-win: rujuk hari-ini = cap C
      // (hasil belum ada), observasi = cap D (menahan kasus wajib-rujuk).
      // Skrofuloderma dirujuk atas dasar SUSPEK (kirim spesimen + rujuk
      // terkoordinasi program TB), tak butuh hasil definitif dulu — gate dicabut.
      clue: 'Nodus dingin yang saling melekat, melunak, lalu membentuk sinus kronis bersama penurunan berat badan dan kontak TB mendukung suspek skrofuloderma. Rujuk tanpa menunggu konfirmasi final; layanan berkemampuan mengambil aspirat nodus atau jaringan untuk pemeriksaan molekuler, kultur, dan/atau histopatologi. Cairan dari permukaan sinus tidak boleh diperlakukan sebagai pengganti otomatis. Nilai pula TB paru dan HIV, lalu hubungkan pasien serta kontak ke program TB.',
      panduanResmi: `${PPK} PNPK TB memberi konteks TB ekstraparu, sedangkan WHO Module 3 (2025) merekomendasikan uji molekuler cepat pada aspirat jaringan nodus untuk diagnosis awal TB ekstraparu. Hasil molekuler harus dibaca bersama klinis, anatomi spesimen, histopatologi/kultur bila diperlukan, dan penilaian resistansi.`,
      catatanRealita: 'Sukamaju tidak diasumsikan mampu mengambil biopsi atau menjalankan TCM lesi onsite. Tugas FKTP adalah mengenali pola, menilai kemungkinan TB paru/komorbid, membuat handoff spesimen dan rujukan yang jelas, mencatat kasus, serta memulai investigasi kontak; jawaban benar bukan menyeka sinus lalu menunggu hasil tanpa tindak lanjut.',
      mutiaraEbm: 'TB kulit dapat menjadi pintu masuk ke episode TB yang lebih luas. Pemeriksaan paru normal tidak menyingkirkan TB ekstraparu, dan kontak serumah bukan sekadar faktor risiko dalam anamnesis: ia memicu tindakan program terhadap orang lain yang mungkin belum bergejala.',
    },
  },
  {
    catalogId: 'leprosy',
    spec: {
      id: 'lab_kusta_pausibasiler', ambangKluster: 2, nama: 'Kusta Pausibasiler Tanpa Reaksi', icd10: 'A30', kategori: 'kulit', prevalensi: 'rendah',
      keluhanUtama: 'Ada dua bercak pucat yang mati rasa di lengan.', usia: [15, 65], vital: NORMAL,
      pembuka: ['Sejak kapan bercak ada dan apa yang berubah?', 'Enam bulan, tidak gatal, tetapi sentuhan dan panas kurang terasa.'],
      pertanyaan: [
        ['q_saraf', 'rps', 'Ada tangan atau kaki lemah, luka tak terasa, mata sulit menutup, atau nyeri saraf?', 'Tidak.', true],
        ['q_reaksi', 'rps', 'Bercak mendadak merah-bengkak, demam, atau saraf nyeri?', 'Tidak.', true],
        ['q_kontak', 'rpk', 'Ada kontak serumah dengan kusta?', 'Kakek dulu pernah berobat kusta sampai selesai.', true],
      ],
      fisik: [['kulit', 'Dua plak hipopigmentasi kering dengan hipoestesia jelas, distribusi asimetris.'], ['neurologis', 'Pemeriksaan saraf tepi, kekuatan, sensibilitas tangan-kaki, dan penutupan mata normal; tidak ada disabilitas derajat 2.', true]],
      lab: [],
      // Audit UKM 2026-08-23: L30.0 (dermatitis numularis) dibedakan justru
      // oleh PRURITUS INTENS di literatur — vignette ini eksplisit "tidak
      // gatal" + hipoestesia jelas + plak kering, jadi L30.0 morfologis tak
      // masuk akal sbg distraktor. L80 (vitiligo, sudah bernama di kamus,
      // preseden identik lab_pitiriasis_versikolor) yang tepat.
      diagnosisBanding: ['A30', 'B36.0', 'L80'],
      tatalaksana: { obatBenar: ['mdt_kusta_pb'], edukasi: ['kepatuhan_program_kusta', 'perawatan_saraf_kusta', 'skrining_kontak_kusta'], edukasiKritis: ['kepatuhan_program_kusta', 'perawatan_saraf_kusta'] },
      clue: 'Hilangnya sensasi yang pasti pada lesi adalah tanda kardinal kusta, sehingga gambaran klasik ini dapat didiagnosis klinis tanpa mewajibkan slit-skin smear. Satu sampai lima lesi tanpa bacilli yang terbukti diklasifikasikan PB untuk terapi: MDT tiga obat selama enam bulan. Catat fungsi saraf dan derajat disabilitas sebagai baseline lalu pantau serial; reaksi dapat timbul sebelum, selama, atau setelah MDT dan tidak boleh membuat pasien menghentikan MDT sendiri. Skrining kontak dan SDR-PEP hanya berjalan melalui program setelah konseling, persetujuan, serta penilaian kelayakan.',
      panduanResmi: `${PPK} PNPK kusta menjadi acuan dasar nasional. WHO 2018 merekomendasikan rifampisin-dapson-klofazimin selama enam bulan untuk PB; WHO 2020 menempatkan skrining kontak, consent, dan penilaian kelayakan sebelum rifampisin dosis tunggal sebagai intervensi program.`,
      catatanRealita: 'MDT adalah obat program dan Sukamaju dinyatakan terhubung dengan program kusta kabupaten. Diagnosis klasik tidak dibuat bergantung pada operator slit-skin smear; penelusuran kontak menghormati keputusan pasien tentang pengungkapan diagnosis dan tidak boleh memperkuat stigma.',
    },
  },
  {
    catalogId: 'syphilis_12',
    spec: {
      id: 'lab_sifilis_primer', ambangKluster: 3, nama: 'Sifilis Primer', icd10: 'A51', kategori: 'kulit', prevalensi: 'rendah',
      keluhanUtama: 'Ada luka di alat kelamin yang tidak sakit.', usia: [18, 55], vital: NORMAL,
      pembuka: ['Kapan luka muncul dan apakah ada keluhan lain?', 'Sepuluh hari lalu, satu luka bersih tidak nyeri; tiga minggu sebelumnya ada hubungan tanpa kondom.'],
      pertanyaan: [
        ['q_neuro', 'rps', 'Ada sakit kepala berat, gangguan penglihatan/pendengaran, kelemahan, atau kebingungan?', 'Tidak.', true],
        ['q_riwayat_sifilis', 'rpd', 'Pernah didiagnosis atau diobati sifilis sebelumnya, atau pernah ada ruam serupa?', 'Belum pernah dan tidak ada riwayat ruam serupa.', true],
        ['q_hamil', 'rpd', 'Apakah sedang hamil atau mungkin hamil?', 'Tidak.', true, 'P'],
        ['q_alergi', 'rpd', 'Pernah sesak, pingsan, bengkak cepat, lepuh luas, atau reaksi berat lain setelah penisilin?', 'Tidak pernah.', true],
        ['q_pasangan', 'sosial', 'Adakah pasangan seksual baru-baru ini yang dapat ditawari layanan secara rahasia tanpa membahayakan Anda?', 'Ada satu pasangan dan aman untuk dihubungi secara sukarela.', true],
      ],
      fisik: [['kulit', 'Ulkus genital tunggal, dasar bersih, tepi tegas, tidak nyeri; limfadenopati inguinal tidak nyeri.'], ['neurologis', 'Tidak ada defisit atau tanda neurosifilis.', true]],
      lab: [['tes_sifilis', 'Tes treponemal reaktif dan RPR reaktif 1:32.', 'abnormal'], ['tes_hiv_serial', 'Tes HIV serial nonreaktif.', 'normal']],
      diagnosisBanding: ['A51', 'A60.0', 'A57'],
      tatalaksana: { obatBenar: ['benzatin_penisilin_24juta'], edukasi: ['tindak_lanjut_sifilis', 'layanan_pasangan_sifilis', 'reaksi_jarisch_herxheimer'], edukasiKritis: ['tindak_lanjut_sifilis', 'layanan_pasangan_sifilis'] },
      konfirmasiWajib: 'tes_sifilis',
      clue: 'Chancre tunggal tidak nyeri dan serologi treponemal plus RPR reaktif mendukung sifilis primer. Beri benzathine penicillin G 2,4 juta unit IM dosis tunggal, dokumentasikan titer awal, dan jadwalkan RPR kuantitatif untuk menilai respons. Nilai gejala neurologis, okular, dan otik; status kehamilan wajib diketahui karena penicillin adalah terapi yang terbukti mencegah sifilis kongenital dan alergi pada kehamilan memerlukan jalur desensitisasi spesialis. Jelaskan Jarisch-Herxheimer, ulang tes HIV sesuai window period/risiko, dan hindari hubungan sampai sedikitnya tujuh hari setelah terapi serta pasangan telah ditangani.',
      panduanResmi: `${PPK} Permenkes 3/2026 mempertahankan Pasal 41 dan Lampiran Permenkes 23/2022 sebagai acuan dasar teknis layanan IMS nasional. WHO 2024 mempertahankan benzathine penicillin untuk sifilis dini dan menekankan testing serta partner services yang sukarela, rahasia, berpusat pada pasien, dan menilai risiko kekerasan.`,
      catatanRealita: 'Benzathine penicillin tercantum dalam formularium, tetapi pemberian tetap memerlukan skrining alergi dan kesiapan menangani reaksi segera. Pasangan ditawari evaluasi dan terapi berdasarkan tahap serta waktu pajanan; tidak ada pengungkapan diagnosis atau pelacakan koersif.',
    },
  },
  {
    catalogId: 'tinea_capitis',
    spec: {
      id: 'lab_tinea_kapitis_anak', ambangKluster: 3, nama: 'Tinea Kapitis Noninflamasi', icd10: 'B35.0', kategori: 'kulit', prevalensi: 'sedang',
      keluhanUtama: 'Rambut anak saya patah-patah dan kulit kepala bersisik membentuk lingkaran.', keluhanUtamaOlehPendamping: true, usia: [4, 12], vital: { ...NORMAL, td: '100/64' },
      pembuka: ['Bagaimana kelainan kulit kepala bermula?', 'Tiga minggu bercak bersisik melebar dan rambut rontok pendek-pendek.'],
      pertanyaan: [
        ['q_kerion', 'rps', 'Ada bengkak lunak bernanah, nyeri berat, atau demam?', 'Tidak.', true],
        ['q_kontak', 'sosial', 'Ada kontak dengan hewan atau berbagi sisir/topi?', 'Sering bermain dengan anak kucing dan berbagi sisir dengan adiknya.', true],
        ['q_hati', 'rpd', 'Ada penyakit hati atau obat rutin?', 'Tidak.', false],
      ],
      fisik: [['kulit', 'Plak alopesia berskuama dengan black dots dan rambut patah; tidak ada kerion.'], ['kepala_leher', 'Limfonodi oksipital kecil, tidak nyeri.', false]],
      lab: [['mikroskopis_gram_koh', 'KOH rambut menunjukkan hifa/arthroconidia.', 'abnormal']],
      diagnosisBanding: ['B35.0', 'L21', 'L63.9'],
      tatalaksana: { obatBenar: ['griseofulvin_125'], edukasi: ['higiene_jamur_kulit', 'tanda_bahaya'] },
      konfirmasiWajib: 'mikroskopis_gram_koh',
      clue: 'Alopesia berskuama dengan rambut patah/black dots adalah tinea kapitis. Infeksi folikel memerlukan antijamur sistemik berbasis berat badan; terapi topikal saja tidak cukup. Periksa kontak, hewan, dan respons; rujuk bila kerion berat atau diagnosis meragukan.',
      panduanResmi: PPK,
      catatanRealita: 'KOH rambut pada encounter ini adalah hasil jadwal laboratorium dengan mikroskop, consumable, dan operator yang dinyatakan ready. Bila jalur konfirmasi tidak ready, jangan memulai antijamur sistemik secara empiris; kirim spesimen/rujuk terkoordinasi sambil menangani transmisi dan red flag.',
    },
  },
  {
    catalogId: 'tinea_barbae',
    spec: {
      id: 'lab_tinea_barbae', nama: 'Tinea Barbae Noninflamasi', icd10: 'B35.0', kategori: 'kulit', prevalensi: 'rendah', jenisKelamin: 'L',
      keluhanUtama: 'Daerah jenggot bersisik, gatal, dan rambut mudah tercabut.', usia: [20, 60], vital: NORMAL,
      pembuka: ['Kelainan di jenggot berkembang bagaimana?', 'Dua minggu membentuk lingkaran dan rambut patah setelah memakai alat cukur bersama.'],
      pertanyaan: [
        ['q_berat', 'rps', 'Ada bengkak bernanah, demam, atau nyeri hebat?', 'Tidak.', true],
        ['q_hewan', 'sosial', 'Kontak hewan ternak atau alat cukur bersama?', 'Saya bekerja dengan sapi dan alat cukur sempat dipakai bersama.', true],
        ['q_hati', 'rpd', 'Ada penyakit hati atau obat rutin?', 'Tidak.', false],
      ],
      fisik: [['kulit', 'Plak annular berskuama di area jenggot dengan rambut patah, tanpa pustul dalam atau kerion.'], ['kepala_leher', 'Tidak ada limfadenopati bermakna.', false]],
      lab: [['mikroskopis_gram_koh', 'KOH rambut positif hifa dermatofita.', 'abnormal']],
      diagnosisBanding: ['B35.0', 'L73.9', 'L21'],
      tatalaksana: { obatBenar: ['griseofulvin_500'], edukasi: ['higiene_jamur_kulit', 'tanda_bahaya'] },
      konfirmasiWajib: 'mikroskopis_gram_koh',
      clue: 'Keterlibatan rambut jenggot dengan hifa memerlukan antijamur sistemik, bukan krim saja. Hentikan berbagi alat cukur dan evaluasi sumber hewan; inflamasi berat, abses, atau respons buruk perlu rujuk.',
      panduanResmi: PPK,
      catatanRealita: 'KOH rambut pada encounter ini adalah hasil jadwal laboratorium dengan mikroskop, consumable, dan operator yang dinyatakan ready. Bila jalur konfirmasi tidak ready, jangan memulai antijamur sistemik secara empiris; kirim spesimen/rujuk terkoordinasi dan hindari steroid yang menyamarkan lesi.',
    },
  },
  ...([
    // Audit UKM 2026-08-23: PPK 1186 sendiri tak punya kategori "wajah"
    // terpisah utk tinea (poin f: "tinea korporis, bagian lain..."); B35.8
    // WHO = "Other dermatophytoses" (bukan slot lokasi). B35.4 (tinea
    // korporis) yang tepat — wajah adalah subtipe topografis korporis.
    ['tinea_facialis', 'lab_tinea_fasialis', 'Tinea Fasialis', 'B35.4', 'pipi', 'Plak annular berskuama dengan tepi aktif di pipi, bagian tengah lebih tenang.', ['B35.4', 'L24', 'L93.0']],
    ['tinea_manus', 'lab_tinea_manus', 'Tinea Manus', 'B35.2', 'telapak tangan', 'Skuama difus satu telapak dengan tepi aktif; kuku belum terlibat.', ['B35.2', 'L24', 'L30.0']],
    ['tinea_cruris', 'lab_tinea_kruris', 'Tinea Kruris', 'B35.6', 'lipat paha', 'Plak annular berskuama dari lipat paha dengan central clearing; skrotum relatif bebas.', ['B35.6', 'B37.2', 'L08.1']],
    ['tinea_pedis', 'lab_tinea_pedis', 'Tinea Pedis Interdigital', 'B35.3', 'sela jari kaki', 'Maserasi dan skuama interdigital dengan tepi aktif, tanpa selulitis.', ['B35.3', 'L30.4', 'L08.1']],
  ] as const).map(([catalogId, id, nama, icd10, lokasi, temuan, diagnosisBanding]) => ({
    catalogId,
    spec: {
      id, nama, icd10, kategori: 'kulit' as const, prevalensi: 'sedang' as const,
      keluhanUtama: `Kulit ${lokasi} gatal dan membentuk bercak bersisik yang melebar.`, usia: [15, 65] as const, vital: NORMAL,
      pembuka: ['Bercaknya berkembang bagaimana?', 'Mulai kecil dua minggu lalu, tepinya makin melebar dan gatal saat berkeringat.'] as const,
      pertanyaan: [
        ['q_steroid', 'rpd', 'Sudah memakai krim steroid atau obat campuran?', 'Pernah memakai krim campur, sempat memudar lalu melebar.', true],
        ['q_kontak', 'sosial', 'Sering lembap atau berbagi handuk/pakaian?', 'Area sering lembap dan kadang berbagi handuk.', true],
        ['q_redflag', 'rps', 'Ada nanah, demam, nyeri berat, atau diabetes tidak terkontrol?', 'Tidak.', true],
      ] as const,
      fisik: [['kulit', temuan] as const, ['umum', 'Tidak ada tanda infeksi sistemik.', false] as const],
      lab: [['mikroskopis_gram_koh', 'KOH kerokan kulit menunjukkan hifa bersepta.', 'abnormal' as const] as const],
      diagnosisBanding: [...diagnosisBanding],
      tatalaksana: { obatBenar: ['mikonazol_krim'], obatSalahUmum: [{ id: 'betametason_krim', alasan: 'Steroid tunggal menyamarkan dan dapat memperluas dermatofitosis.', bahaya: 'kontraindikasi' as const }], edukasi: ['higiene_jamur_kulit', 'jaga_area_kering'] },
      // Audit UKM 2026-08-23: DIHAPUS. catatanRealita kasus ini sendiri
      // (baris di bawah) berjanji "ketiadaan KOH TIDAK memaksa rujuk atau
      // terapi sistemik" (beda dari kapitis/barbae yang memang butuh
      // sistemik) — tapi konfirmasiWajib biner mengunci skorPemeriksaan<=50
      // + cap grade C + blokir bintang Dex tanpa syarat "lesi tipikal",
      // menghukum janji yang tak pernah ditepati mekanismenya. Berlaku utk
      // keempat varian (fasialis/manus/kruris/pedis) via template ini.
      clue: `Tepi aktif berskuama, central clearing, dan KOH berhifa mendukung ${nama.toLowerCase()}. Gunakan antijamur topikal cukup lama dan lanjutkan setelah lesi membaik; hindari steroid tunggal.`,
      panduanResmi: PPK,
      catatanRealita: 'Mikroskop, KOH, consumable, dan analis dinyatakan ready pada jadwal laboratorium encounter ini. Pada lesi tipikal terbatas, ketiadaan KOH tidak memaksa rujuk atau terapi sistemik; gunakan terapi topikal dengan safety-net dan evaluasi ulang bila atipikal atau gagal.',
    },
  })),
  {
    catalogId: 'tinea_unguium',
    spec: {
      id: 'lab_tinea_unguium_terkonfirmasi', nama: 'Tinea Unguium Terbatas', icd10: 'B35.1', kategori: 'kulit', prevalensi: 'sedang',
      keluhanUtama: 'Kuku jempol kaki menebal, rapuh, dan berubah kuning.', usia: [25, 70], vital: NORMAL,
      pembuka: ['Sejak kapan kuku berubah dan berapa kuku yang terkena?', 'Enam bulan, dua kuku kaki, perlahan menebal tanpa nyeri.'],
      pertanyaan: [
        ['q_risiko', 'rpd', 'Ada diabetes, gangguan imun, penyakit hati, atau obat rutin?', 'Tidak ada.', true],
        ['q_kulit', 'rps', 'Ada jamur sela jari atau telapak kaki?', 'Sela jari sering bersisik dan gatal.', true],
        ['q_trauma', 'rps', 'Ada trauma berulang atau cat kuku?', 'Tidak.', false],
      ],
      fisik: [['kulit', 'Dua kuku kaki distal-lateral menebal kuning dengan debris subungual; matriks proksimal tidak terlibat.'], ['ekstremitas', 'Perfusi kaki baik; tinea pedis interdigital ringan.', true]],
      lab: [['mikroskopis_gram_koh', 'KOH clipping kuku menunjukkan hifa dermatofita.', 'abnormal'], ['sgot_sgpt', 'SGOT/SGPT normal.', 'normal']],
      diagnosisBanding: ['B35.1', 'L60.3', 'L40.9'],
      tatalaksana: { obatBenar: ['griseofulvin_500'], edukasi: ['higiene_jamur_kulit', 'kontrol_rutin'] },
      konfirmasiWajib: 'mikroskopis_gram_koh',
      clue: 'Onikomikosis perlu konfirmasi mikologi sebelum terapi sistemik yang panjang. Nilai hati dan interaksi obat, gunakan griseofulvin FKTP dengan dosis serta durasi sesuai lokasi/berat badan, terapi tinea pedis bersamaan, lalu monitor respons; perubahan kuku tanpa konfirmasi tidak boleh otomatis diberi antijamur oral.',
      panduanResmi: PPK,
      catatanRealita: 'KOH dapat dilakukan bila mikroskop/operator ready; SGOT/SGPT dijadwalkan melalui jejaring bila tidak onsite.',
    },
  },
  {
    catalogId: 'pityriasis_versicolor',
    spec: {
      id: 'lab_pitiriasis_versikolor', nama: 'Pitiriasis Versikolor', icd10: 'B36.0', kategori: 'kulit', prevalensi: 'tinggi',
      keluhanUtama: 'Punggung saya belang terang dengan sisik sangat halus.', usia: [15, 50], vital: NORMAL,
      pembuka: ['Kapan bercak muncul dan kapan lebih jelas?', 'Sudah dua bulan, makin terlihat setelah kulit sekitar menggelap dan sedikit gatal saat berkeringat.'],
      pertanyaan: [
        ['q_sensasi', 'rps', 'Apakah bercak mati rasa atau rambut di sana berubah?', 'Tidak, rasa tetap normal.', true],
        ['q_kambuh', 'rpd', 'Pernah berulang atau mudah berkeringat?', 'Pernah dan saya bekerja di tempat panas.', true],
        ['q_obat', 'rpd', 'Sudah memakai steroid?', 'Tidak.', false],
      ],
      fisik: [['kulit', 'Makula hipopigmentasi multipel dengan fine scale di dada dan punggung; sensasi utuh.'], ['neurologis', 'Tidak ada penebalan saraf atau gangguan sensorik.', true]],
      lab: [['mikroskopis_gram_koh', 'KOH menunjukkan hifa pendek dan spora berkelompok.', 'abnormal']],
      diagnosisBanding: ['B36.0', 'L80', 'A30'],
      tatalaksana: { obatBenar: ['ketokonazol_krim'], edukasi: ['higiene_jamur_kulit', 'kontrol_rutin'] },
      clue: 'Makula ber-skuama halus di trunkus dengan sensasi normal dan KOH khas Malassezia mendukung pitiriasis versikolor. Jelaskan warna kulit pulih lebih lambat daripada eradikasi jamur dan kekambuhan umum.',
      panduanResmi: PPK,
      catatanRealita: 'Mikroskop, KOH, consumable, dan analis dinyatakan ready pada jadwal laboratorium encounter ini. Bila tidak ready, morfologi dan distribusi tipikal dapat ditangani topikal dengan safety-net; gangguan sensasi atau pola atipikal harus membuka kembali diagnosis banding.',
    },
  },
  {
    catalogId: 'cutaneous_larva_migrans',
    spec: {
      id: 'lab_cutaneous_larva_migrans', nama: 'Cutaneous Larva Migrans', icd10: 'B76.9', kategori: 'kulit', prevalensi: 'rendah',
      keluhanUtama: 'Ada garis merah berkelok di kaki yang maju setiap hari dan sangat gatal.', usia: [8, 60], vital: NORMAL,
      pembuka: ['Bagaimana garis ini mulai dan bergerak?', 'Muncul setelah berjalan tanpa alas di pantai; ujungnya maju beberapa sentimeter sehari.'],
      pertanyaan: [
        ['q_sistemik', 'rps', 'Ada sesak, demam, batuk, atau lesi sangat luas?', 'Tidak.', true],
        ['q_hamil', 'rpd', 'Sedang hamil atau menyusui?', 'Tidak.', true, 'P'],
        ['q_infeksi', 'rps', 'Ada nanah atau kemerahan meluas karena garukan?', 'Tidak.', false],
      ],
      fisik: [['kulit', 'Traktus serpiginosa eritematosa sedikit meninggi di plantar kaki, tanpa selulitis.'], ['umum', 'Afebris dan tampak baik.', false]],
      diagnosisBanding: ['B76.9', 'B86', 'L23.7'],
      // Audit UKM 2026-08-23: PPK 1186 hanya mencantumkan albendazol 400mg
      // 1x/hari 3 hari sbg regimen farmakologis CLM; ivermektin dosis
      // tunggal EBM internasional cure rate lebih tinggi. Keduanya
      // monoterapi SETARA (bukan kombinasi) — obatBenar dikosongkan,
      // digabung satu grup obatAlternatif spt pola mialgia/GERD, supaya
      // jawaban PPK-literal maupun ivermektin sama-sama dinilai penuh
      // tanpa mewajibkan keduanya sekaligus.
      tatalaksana: { obatBenar: [], obatAlternatif: [['ivermektin_3', 'albendazol_400']], edukasi: ['kebersihan_kulit', 'tanda_bahaya'] },
      clue: 'Erupsi serpiginosa yang bermigrasi setelah kontak tanah/pasir khas CLM. Beri antihelmintik sesuai berat badan dan status pasien, rawat ekskoriasi, serta anjurkan alas kaki; lesi luas atau keterlibatan sistemik perlu evaluasi lanjut.',
      panduanResmi: PPK,
    },
  },
  {
    catalogId: 'filariasis',
    spec: {
      id: 'lab_filariasis_terkonfirmasi', nama: 'Filariasis Limfatik Terkonfirmasi Program', icd10: 'B74', kategori: 'kulit', prevalensi: 'rendah',
      keluhanUtama: 'Tungkai saya beberapa kali bengkak dan demam setelah bekerja di daerah endemis filariasis.', usia: [18, 65], vital: { ...NORMAL, suhu: 37.3 },
      pembuka: ['Bagaimana pola bengkak dan demamnya?', 'Berulang beberapa bulan; selangkangan nyeri saat demam lalu tungkai membengkak.'],
      pertanyaan: [
        ['q_daerah', 'sosial', 'Pernah tinggal lama di daerah endemis dan sering digigit nyamuk malam?', 'Tiga tahun bekerja di daerah endemis filariasis di Nusa Tenggara Timur dan sering digigit nyamuk.', true],
        ['q_akut', 'rps', 'Sekarang ada kemerahan cepat, luka, atau demam tinggi?', 'Tidak, saat ini hanya bengkak ringan.', true],
        ['q_obat', 'rpd', 'Pernah mengikuti pengobatan filariasis, punya penyakit berat, atau memakai obat rutin?', 'Belum pernah dan tidak memakai obat rutin.', true],
        ['q_koendemis', 'sosial', 'Pernah tinggal atau bepergian lama ke wilayah onchocerciasis atau loiasis di Afrika?', 'Tidak pernah bepergian ke Afrika.', true],
        ['q_hamil', 'rpd', 'Apakah sedang hamil atau mungkin hamil?', 'Tidak.', true, 'P'],
        ['q_hidrokel', 'rps', 'Ada pembengkakan atau rasa berat pada skrotum?', 'Tidak ada.', false, 'L'],
      ],
      fisik: [['ekstremitas', 'Edema unilateral ringan dengan penebalan kulit awal, tanpa selulitis akut.'], ['kulit', 'Tidak ada ulkus atau infeksi interdigital aktif.', true]],
      lab: [['apusan_darah_mikrofilaria', 'Mikrofilaria terdeteksi pada apusan darah malam.', 'abnormal']],
      // Audit UKM 2026-08-23: I82.4 gaya ICD-10-CM Amerika (DVT tungkai
      // bawah) — WHO I82 tak punya subkode .4. Padanan WHO yang benar
      // sudah ada di kamus & aktif dipakai kasus erisipelas: I80.2.
      diagnosisBanding: ['B74', 'I89.0', 'I80.2'],
      tatalaksana: { obatBenar: ['dietilkarbamazin_100', 'albendazol_400'], edukasi: ['alur_program_filariasis', 'perawatan_limfedema_filariasis', 'cegah_gigitan_filariasis'], edukasiKritis: ['alur_program_filariasis', 'perawatan_limfedema_filariasis'] },
      konfirmasiWajib: 'apusan_darah_mikrofilaria',
      clue: 'Paparan endemis, episode adenolimfangitis, limfedema, dan mikrofilaria malam mendukung filariasis limfatik. Kasus individual terkonfirmasi masuk program untuk regimen berbasis berat badan dan ko-endemisitas; satu resep tidak sama dengan POPM/MDA wilayah. Perawatan seumur hidup mencakup cuci-keringkan tungkai dan sela jari, rawat pintu masuk infeksi, latihan, elevasi, tata serangan akut, serta rujuk hidrokel. Temuan kasus memicu pencatatan dan penilaian fokus; keputusan POPM memerlukan pemetaan endemisitas, kelayakan populasi, cakupan, dan program kabupaten.',
      panduanResmi: `${PPK} Permenkes 3/2026 adalah payung penanggulangan penyakit yang berlaku dan mencabut sebagian besar Permenkes 94/2014 kecuali ketentuan yang dinyatakan tetap. WHO 2024 memisahkan dua pilar: pemutusan transmisi dengan kemoterapi pencegahan programatik dan pengurangan disabilitas melalui paket MMDP. Regimen DEC-albendazol pada pasien ini tetap harus diverifikasi program menurut berat badan, spesies, ko-endemisitas, kehamilan, dan kontraindikasi; jangan menyalin regimen MDA menjadi terapi improvisasi.`,
      catatanRealita: 'Apusan darah malam dan obat program dijadwalkan melalui jejaring kabupaten; keduanya tidak diasumsikan tersedia spontan di meja poli. Puskesmas mendaftarkan kasus dan menghubungkan tindak lanjut fokus serta MMDP, sedangkan keputusan POPM berada pada program setelah penilaian wilayah.',
    },
  },
  {
    catalogId: 'pediculosis_pubis',
    spec: {
      id: 'lab_pedikulosis_pubis', nama: 'Pedikulosis Pubis', icd10: 'B85.3', kategori: 'kulit', prevalensi: 'rendah',
      keluhanUtama: 'Daerah kemaluan sangat gatal dan saya melihat kutu kecil.', usia: [18, 60], vital: NORMAL,
      pembuka: ['Kapan gatal mulai dan apa yang terlihat?', 'Dua minggu, terutama malam; ada telur menempel pada rambut.'],
      pertanyaan: [
        ['q_mata', 'rps', 'Ada kutu pada bulu mata atau iritasi mata?', 'Tidak.', true],
        ['q_kontak', 'sosial', 'Ada pasangan dengan gatal serupa dan kapan kontak seksual terakhir?', 'Pasangan saya juga gatal. Kontak seksual terakhir sekitar satu minggu lalu.', true],
        ['q_alergi', 'rpd', 'Pernah alergi berat terhadap obat kulit?', 'Tidak.', false],
        ['q_hamil', 'rpd', 'Sedang hamil atau menyusui?', 'Tidak.', false, 'P'],
      ],
      fisik: [['kulit', 'Kutu dan nits melekat pada rambut pubis dengan ekskoriasi, tanpa infeksi sekunder.'], ['mata', 'Tidak ada infestasi bulu mata.', true]],
      diagnosisBanding: ['B85.3', 'B86', 'L24'],
      // Sapuan tag-vs-penyakit 2026-08-05: 'cegah_ims_pasangan' ditukar. Label
      // lamanya menganjurkan kondom, padahal kutu kelamin menular lewat kontak
      // kulit erat sehingga kondom tak menjangkau area berambutnya. Skrining
      // IMS TIDAK diberi id baru — 'pencegahan_ims_terintegrasi' yang sudah ada
      // memang topik itu. 'cuci_seprai_panas' sengaja DIPERTAHANKAN: tagnya
      // memang menyebut kutu dan dekontaminasi seprai-pakaian adalah anjuran
      // resmi untuk kondisi ini; asumsi awal bahwa ia nyasar di sini keliru.
      tatalaksana: { obatBenar: ['permetrin_losion_1'], edukasi: ['cegah_kutu_kelamin_kontak', 'pencegahan_ims_terintegrasi', 'cuci_seprai_panas'] },
      clue: 'Identifikasi kutu/nits pada rambut pubis menegakkan pedikulosis pubis. Terapi pedikulisida sesuai petunjuk, obati pasangan/kontak, cuci pakaian dan seprai, skrining IMS, dan evaluasi ulang bila masih ada kutu hidup. Kutu ini menular lewat kontak kulit yang erat, bukan lewat cairan tubuh, sehingga kondom tidak melindungi area berambut — jangan menjanjikannya sebagai pencegahan di sini.',
      panduanResmi: PPK,
      catatanRealita: 'Permetrin 1% adalah pilihan EBM tetapi Fornas 1199/2025 hanya mencantumkan krim 5%. Skenario menyatakan losio 1% tersedia melalui pengadaan lokal; jangan menukar konsentrasi diam-diam.',
    },
  },
  {
    catalogId: 'insect_bite',
    spec: {
      id: 'lab_reaksi_gigitan_serangga', nama: 'Reaksi Lokal Gigitan Serangga', icd10: 'T63.4', kategori: 'kulit', prevalensi: 'tinggi',
      keluhanUtama: 'Lengan saya bentol gatal setelah berkebun.', usia: [12, 70], vital: NORMAL,
      pembuka: ['Apa yang terjadi sebelum bentol muncul?', 'Terasa digigit serangga kemarin, lalu muncul tiga bentol gatal di area terbuka.'],
      pertanyaan: [
        ['q_anafilaksis', 'rps', 'Ada sesak, suara serak, bibir bengkak, muntah, atau hampir pingsan?', 'Tidak.', true],
        ['q_infeksi', 'rps', 'Ada demam, nanah, atau merah cepat meluas?', 'Tidak.', true],
        ['q_riwayat', 'rpd', 'Pernah reaksi berat karena sengatan?', 'Tidak.', false],
      ],
      fisik: [['kulit', 'Tiga papul urtikarial dengan punctum sentral, edema lokal kecil, tanpa selulitis.'], ['toraks_paru', 'Tidak ada wheezing atau stridor.', true]],
      diagnosisBanding: ['T63.4', 'L50.0', 'L03.9'],
      tatalaksana: { obatBenar: [], obatOpsional: ['cetirizine_10', 'hidrokortison_krim'], edukasi: ['kebersihan_kulit', 'rencana_anafilaksis'] },
      clue: 'Papul gatal lokal dengan punctum tanpa gejala sistemik adalah reaksi gigitan lokal. Kompres dingin, antihistamin/topikal ringan, hindari garuk, dan ajarkan tanda anafilaksis atau infeksi sekunder.',
      panduanResmi: PPK,
    },
  },
  {
    catalogId: 'dermatitis_kontak',
    spec: {
      id: 'lab_dermatitis_kontak_iritan_tangan', nama: 'Dermatitis Kontak Iritan Tangan', icd10: 'L24', kategori: 'kulit', prevalensi: 'tinggi',
      keluhanUtama: 'Kedua tangan merah, kering, dan perih setelah sering memakai deterjen.', usia: [18, 65], vital: NORMAL,
      pembuka: ['Kapan ruam muncul dan apa hubungannya dengan pekerjaan?', 'Memburuk setiap selesai mencuci tanpa sarung tangan dan membaik saat libur.'],
      pertanyaan: [
        ['q_alergi', 'rps', 'Apakah ruam meluas ke area yang tidak terkena atau muncul cepat setelah sedikit paparan?', 'Tidak, terbatas di tangan yang terkena deterjen.', true],
        ['q_infeksi', 'rps', 'Ada nanah, demam, atau nyeri berdenyut?', 'Tidak.', true],
        ['q_obat', 'rpd', 'Sudah memakai krim apa?', 'Hanya pelembap sesekali.', false],
      ],
      fisik: [['kulit', 'Eritema, xerosis, fisura halus pada dorsum dan sela jari kedua tangan sesuai area paparan; tanpa pus.'], ['umum', 'Tidak ada tanda sistemik.', false]],
      diagnosisBanding: ['L24', 'L23', 'B35.2'],
      tatalaksana: { obatBenar: ['hidrokortison_krim', 'emolien_petrolatum'], edukasi: ['jaga_kelembapan_kulit', 'kebersihan_kulit'] },
      clue: 'Hubungan dosis-paparan, batas sesuai area kontak, dan perbaikan saat bebas kerja mendukung dermatitis iritan. Hentikan/kurangi iritan, gunakan sarung tangan yang tepat, emolien sering, dan steroid topikal potensi ringan singkat pada inflamasi.',
      panduanResmi: PPK,
      catatanRealita: 'Petrolatum diperlakukan sebagai bahan perawatan kulit hasil pengadaan lokal, bukan klaim item obat Fornas. Bila tidak ada, pilih emolien sederhana tanpa pewangi yang tersedia.',
    },
  },
  {
    catalogId: 'atopic_dermatitis',
    spec: {
      id: 'lab_dermatitis_atopik_ringan', nama: 'Dermatitis Atopik Ringan', icd10: 'L20', kategori: 'kulit', prevalensi: 'tinggi',
      keluhanUtama: 'Lipatan siku dan lutut gatal berulang sejak kecil.', usia: [5, 35], vital: NORMAL,
      pembuka: ['Bagaimana pola kambuh dan lokasi gatalnya?', 'Kambuh saat udara kering, terutama malam, di kedua lipatan.'],
      pertanyaan: [
        ['q_atopi', 'rpk', 'Ada asma, rinitis alergi, atau keluarga dengan keluhan serupa?', 'Saya punya rinitis alergi dan ibu punya asma.', true],
        ['q_infeksi', 'rps', 'Ada cairan kuning, nyeri, demam, atau vesikel menyebar?', 'Tidak.', true],
        ['q_perawatan', 'rpd', 'Sabun dan pelembap apa yang digunakan?', 'Sering mandi air panas dan jarang memakai pelembap.', true],
      ],
      fisik: [['kulit', 'Plak eksematosa simetris di fossa kubiti/poplitea dengan xerosis dan ekskoriasi, tanpa infeksi.'], ['toraks_paru', 'Tidak ada wheezing saat ini.', false]],
      diagnosisBanding: ['L20', 'L24', 'B86'],
      tatalaksana: { obatBenar: ['hidrokortison_krim', 'emolien_petrolatum'], edukasi: ['jaga_kelembapan_kulit', 'tanda_bahaya'] },
      clue: 'Pruritus kronik berulang, distribusi fleksural, xerosis, dan riwayat atopi mendukung dermatitis atopik. Emolien adalah fondasi; steroid topikal ringan digunakan singkat pada flare, dengan pencetus dan infeksi sekunder dievaluasi.',
      panduanResmi: PPK,
      catatanRealita: 'Petrolatum adalah baseline pengadaan lokal untuk pemulihan sawar kulit dan tidak diklaim sebagai item Fornas. Produk harus sederhana, tanpa pewangi, dan dapat diganti emolien lokal yang setara.',
    },
  },
  {
    catalogId: 'nummular_dermatitis',
    spec: {
      id: 'lab_dermatitis_numularis', nama: 'Dermatitis Numularis', icd10: 'L30.0', kategori: 'kulit', prevalensi: 'sedang',
      keluhanUtama: 'Ada bercak bulat seperti koin yang sangat gatal di tungkai.', usia: [25, 70], vital: NORMAL,
      pembuka: ['Bercaknya berubah bagaimana?', 'Muncul beberapa bercak bulat setelah kulit sangat kering; tidak melebar dengan tepi cincin.'],
      pertanyaan: [
        ['q_jamur', 'rps', 'Apakah tepi lebih aktif dan bagian tengah sembuh?', 'Tidak, seluruh bercak sama-sama merah dan bersisik.', true],
        ['q_infeksi', 'rps', 'Ada nanah, kerak madu, demam, atau nyeri?', 'Tidak.', true],
        ['q_pencetus', 'sosial', 'Sering mandi panas atau memakai sabun keras?', 'Iya, mandi air panas dua kali sehari.', false],
      ],
      fisik: [['kulit', 'Plak eksematosa berbentuk koin, batas tegas, berskuama merata tanpa central clearing.'], ['umum', 'Kulit umum xerotik.', true]],
      lab: [['mikroskopis_gram_koh', 'KOH negatif.', 'normal']],
      diagnosisBanding: ['L30.0', 'B35.4', 'L20'],
      tatalaksana: { obatBenar: ['hidrokortison_krim', 'emolien_petrolatum'], edukasi: ['jaga_kelembapan_kulit', 'kontrol_rutin'] },
      clue: 'Plak eksematosa berbentuk koin tanpa central clearing dan KOH negatif mendukung dermatitis numularis. Pulihkan sawar kulit dan gunakan steroid topikal singkat; jangan memberi antijamur hanya karena bentuknya bulat.',
      panduanResmi: PPK,
      catatanRealita: 'Mikroskop, KOH, consumable, dan analis dinyatakan ready pada jadwal laboratorium encounter ini; hasil negatif membantu ketika morfologi tumpang tindih dengan tinea, tetapi bukan syarat semua kasus tipikal. Petrolatum adalah emolien pengadaan lokal, bukan item Fornas; emolien sederhana tanpa pewangi yang setara dapat dipakai.',
    },
  },
  {
    catalogId: 'napkin_eczema',
    spec: {
      id: 'lab_dermatitis_popok_iritan', nama: 'Dermatitis Popok Iritan', icd10: 'L22', kategori: 'kulit', prevalensi: 'tinggi',
      keluhanUtama: 'Kulit bayi merah di area popok sejak diare ringan.', keluhanUtamaOlehPendamping: true, usia: [0, 0], usiaBulan: [3, 11], vital: { nadi: 118, rr: 28, suhu: 36.8, spo2: 99 },
      pembuka: ['Kapan ruam muncul dan bagian mana yang terkena?', 'Tiga hari setelah lebih sering BAB; bagian menonjol merah tetapi lipatan relatif bersih.'],
      pertanyaan: [
        ['q_kandida', 'rps', 'Apakah lipatan ikut merah dengan bintil-bintil satelit?', 'Tidak.', true],
        ['q_sistemik', 'rps', 'Ada demam, lepuh, luka bernanah, atau bayi sulit minum?', 'Tidak.', true],
        ['q_perawatan', 'sosial', 'Seberapa sering popok diganti dan produk apa yang dipakai?', 'Kadang terlambat diganti dan memakai tisu berpewangi.', true],
      ],
      fisik: [['kulit', 'Eritema konfluens pada area cembung tertutup popok, lipatan relatif spared, tanpa pustul satelit.'], ['umum', 'Bayi aktif dan hidrasi baik.', false]],
      diagnosisBanding: ['L22', 'B37.2', 'L21'],
      // Audit tag-vs-penyakit 2026-08-04: higiene_genital_lembut ber-tag
      // [Genital] (douching, higiene vulvovaginal dewasa) diganti
      // perawatan_area_popok — pasien bayi 3-11 bulan, "douching" mustahil.
      tatalaksana: { obatBenar: ['zinc_oxide_krim'], edukasi: ['perawatan_area_popok', 'tanda_bahaya'] },
      clue: 'Ruam pada permukaan cembung dengan lipatan relatif bebas mendukung dermatitis popok iritan. Ganti popok sering, bilas lembut, beri waktu bebas popok dan barrier zinc oxide; candidiasis melibatkan lipatan dan pustul satelit.',
      panduanResmi: PPK,
      catatanRealita: 'Zinc oxide adalah barrier hasil pengadaan lokal/OTC dan tidak diklaim sebagai item Fornas. Bila tidak ada, petrolatum sederhana dapat dipakai sebagai barrier pengganti.',
    },
  },
  {
    catalogId: 'seborrheic_dermatitis',
    spec: {
      id: 'lab_dermatitis_seboroik_dewasa', nama: 'Dermatitis Seboroik Dewasa', icd10: 'L21', kategori: 'kulit', prevalensi: 'tinggi',
      keluhanUtama: 'Kulit kepala dan sisi hidung bersisik berminyak dan gatal.', usia: [18, 65], vital: NORMAL,
      pembuka: ['Di mana sisik muncul dan bagaimana pola kambuhnya?', 'Berulang di kulit kepala, alis, dan samping hidung; memburuk saat stres.'],
      pertanyaan: [
        ['q_berat', 'rps', 'Ada rambut rontok bercak, pus, atau nyeri?', 'Tidak.', true],
        ['q_imun', 'rpd', 'Keluhan mendadak sangat berat atau ada gangguan imun/neurologis?', 'Tidak.', false],
        ['q_produk', 'sosial', 'Produk rambut apa yang digunakan?', 'Sampo biasa dan gel rambut.', false],
      ],
      fisik: [['kulit', 'Skuama kekuningan berminyak di scalp, alis, dan lipatan nasolabial dengan eritem ringan.'], ['kepala_leher', 'Tidak ada alopesia sikatriks atau limfadenopati.', true]],
      diagnosisBanding: ['L21', 'L40.9', 'B35.0'],
      tatalaksana: { obatBenar: ['ketokonazol_krim'], obatOpsional: ['hidrokortison_krim'], edukasi: ['jaga_kelembapan_kulit', 'kontrol_rutin'] },
      clue: 'Skuama berminyak pada area seboroik khas dermatitis seboroik. Antijamur topikal adalah inti; steroid ringan hanya singkat pada inflamasi, bukan pemakaian kontinu di wajah.',
      panduanResmi: PPK,
    },
  },
  {
    catalogId: 'pityriasis_rosea',
    spec: {
      id: 'lab_pitiriasis_rosea', nama: 'Pitiriasis Rosea', icd10: 'L42', kategori: 'kulit', prevalensi: 'sedang',
      keluhanUtama: 'Bermula satu bercak besar, lalu muncul banyak bercak kecil di badan.', usia: [10, 40], vital: NORMAL,
      pembuka: ['Bagaimana urutan ruam muncul?', 'Satu bercak oval muncul seminggu lalu, kemudian bercak lebih kecil mengikuti garis kulit di punggung.'],
      pertanyaan: [
        ['q_obat', 'rpd', 'Ada obat baru sebelum ruam?', 'Tidak.', true],
        ['q_sifilis', 'sosial', 'Ada risiko seksual, luka genital, atau ruam di telapak tangan/kaki?', 'Tidak.', true],
        ['q_hamil', 'rpd', 'Sedang hamil atau mungkin hamil?', 'Tidak.', false, 'P'],
      ],
      fisik: [['kulit', 'Herald patch oval dengan collarette scale dan lesi lebih kecil pola Christmas-tree di trunkus; telapak bebas.'], ['umum', 'Tidak demam dan tidak ada limfadenopati.', false]],
      diagnosisBanding: ['L42', 'B36.0', 'A53.9'],
      tatalaksana: { obatBenar: [], obatOpsional: ['cetirizine_10'], edukasi: ['kontrol_rutin', 'tanda_bahaya'] },
      clue: 'Herald patch diikuti erupsi oval sejajar garis kulit mendukung pitiriasis rosea yang umumnya swasirna 6-8 minggu. Beri reassurance dan terapi gatal; telusuri obat, sifilis, serta kehamilan bila pola tidak khas.',
      panduanResmi: PPK,
    },
  },
  {
    catalogId: 'acne_vulgaris',
    spec: {
      id: 'lab_akne_vulgaris_ringan', nama: 'Akne Vulgaris Ringan', icd10: 'L70.0', kategori: 'kulit', prevalensi: 'tinggi',
      keluhanUtama: 'Wajah saya banyak komedo dan beberapa jerawat kecil.', usia: [12, 30], vital: NORMAL,
      pembuka: ['Jerawatnya seperti apa dan apakah meninggalkan bekas?', 'Enam bulan, terutama komedo dan bintil merah kecil, belum ada benjolan dalam atau bekas cekung.'],
      pertanyaan: [
        ['q_obat', 'rpd', 'Ada obat atau kosmetik berminyak, steroid, atau suplemen tertentu?', 'Memakai pomade berminyak.', true],
        ['q_hormonal', 'rps', 'Apakah siklus menstruasi sangat tidak teratur atau tumbuh rambut berlebih?', 'Siklus teratur dan tidak ada rambut berlebih.', false, 'P'],
        ['q_psikososial', 'sosial', 'Seberapa mengganggu perasaan dan aktivitas?', 'Agak minder tetapi tetap sekolah.', true],
      ],
      fisik: [['kulit', 'Komedo terbuka/tertutup dan beberapa papul-pustul kecil, tanpa nodul, kista, atau scar.'], ['umum', 'Tidak ada tanda hiperandrogenisme.', false]],
      diagnosisBanding: ['L70.0', 'L73.9', 'L71.0'],
      tatalaksana: { obatBenar: ['benzoyl_peroksida_25'], edukasi: ['kebersihan_kulit', 'kontrol_rutin'] },
      clue: 'Komedo membedakan akne dari folikulitis/perioral dermatitis. Akne ringan mulai dengan benzoyl peroxide tipis dan bertahap, perawatan nonkomedogenik, serta evaluasi 6-8 minggu; antibiotik topikal tidak digunakan tunggal.',
      panduanResmi: PPK,
      catatanRealita: 'Benzoil peroksida tidak diklaim sebagai item Fornas; skenario menyatakan stok pengadaan lokal/OTC tersedia. Mulai tipis dan bertahap untuk mengurangi iritasi.',
    },
  },
  {
    catalogId: 'hidradenitis',
    spec: {
      id: 'lab_hidradenitis_supuratif_hurley1', nama: 'Hidradenitis Supuratif Hurley I', icd10: 'L73.2', kategori: 'kulit', prevalensi: 'rendah',
      keluhanUtama: 'Benjolan nyeri berulang di ketiak, kadang pecah sendiri.', usia: [18, 50], vital: NORMAL,
      pembuka: ['Seberapa sering benjolan muncul dan apakah ada terowongan atau bekas?', 'Tiga kali dalam enam bulan, satu-dua benjolan, belum ada terowongan atau jaringan parut lebar.'],
      pertanyaan: [
        ['q_lokasi', 'rps', 'Ada juga di lipat paha, bawah payudara, atau bokong?', 'Kadang satu di lipat paha.', true],
        ['q_risiko', 'sosial', 'Merokok atau ada berat badan berlebih?', 'Saya merokok dan berat badan berlebih.', true],
        ['q_sistemik', 'rps', 'Ada demam atau kemerahan cepat meluas?', 'Tidak.', true],
      ],
      fisik: [['kulit', 'Dua nodul inflamasi dalam di aksila, tanpa sinus tract, bridging scar, atau selulitis luas.'], ['umum', 'Afebris dan tidak toksik.', false]],
      diagnosisBanding: ['L73.2', 'L02', 'L73.9'],
      tatalaksana: { obatBenar: ['klindamisin_topikal_1'], edukasi: ['kebersihan_kulit', 'kontrol_rutin'] },
      clue: 'Nodul nyeri rekuren pada area intertriginosa mendukung hidradenitis; Hurley I belum memiliki sinus/scar luas. Kurangi rokok, friksi, dan berat badan; terapi topikal dapat dipakai pada penyakit ringan, sedangkan flare sering, terowongan, atau dampak besar perlu rujuk.',
      panduanResmi: PPK,
      catatanRealita: 'Klindamisin topikal tidak diklaim sebagai item Fornas dan tersedia di skenario melalui pengadaan lokal. Bila tidak tersedia, jangan mengganti dengan kombinasi antibiotik sistemik tanpa penilaian ulang.',
    },
  },
  {
    catalogId: 'perioral_dermatitis',
    spec: {
      id: 'lab_dermatitis_perioral', nama: 'Dermatitis Perioral', icd10: 'L71.0', kategori: 'kulit', prevalensi: 'sedang', jenisKelamin: 'P',
      keluhanUtama: 'Sekitar mulut saya muncul bintil merah setelah sering memakai krim steroid.', usia: [18, 50], vital: NORMAL,
      pembuka: ['Bagaimana ruam bermula dan krim apa yang dipakai?', 'Awalnya sedikit merah lalu saya pakai steroid wajah; sesaat membaik tetapi bintil makin banyak.'],
      pertanyaan: [
        ['q_gejala', 'rps', 'Ada komedo, lepuh, kerak madu, atau nyeri mata?', 'Tidak ada komedo atau keluhan mata.', true],
        ['q_produk', 'sosial', 'Menggunakan kosmetik oklusif atau semprot steroid hidung?', 'Memakai kosmetik tebal.', false],
        ['q_hamil', 'rpd', 'Sedang hamil atau menyusui?', 'Tidak.', true],
      ],
      fisik: [['kulit', 'Papul eritem kecil perioral dengan vermilion border spared, tanpa komedo.'], ['mata', 'Tidak ada keterlibatan okular.', false]],
      diagnosisBanding: ['L71.0', 'L70.0', 'L21'],
      tatalaksana: { obatBenar: [], obatOpsional: ['metronidazol_topikal_075'], obatSalahUmum: [{ id: 'betametason_krim', alasan: 'Steroid wajah mempertahankan rebound dan memperburuk dermatitis perioral.', bahaya: 'kontraindikasi' }], edukasi: ['kebersihan_kulit', 'kontrol_rutin'] },
      clue: 'Papul perioral tanpa komedo dengan sparing vermilion dan paparan steroid mendukung dermatitis perioral. Hentikan steroid wajah dengan konseling kemungkinan rebound, sederhanakan produk, dan gunakan terapi topikal; kasus berat/refrakter dirujuk.',
      panduanResmi: PPK,
      catatanRealita: 'Menghentikan steroid dan kosmetik oklusif adalah inti. Metronidazol topikal hanya opsi pengadaan lokal/non-Fornas; ketiadaannya tidak boleh memicu antibiotik oral otomatis.',
    },
  },
  {
    catalogId: 'miliaria',
    spec: {
      // Bug hunt 2026-08-01: L74.3 "Miliaria, tidak spesifik" diganti L74.0
      // (kode WHO ICD-10 spesifik utk Miliaria Rubra) — nama kasus sendiri
      // sudah definitif, tidak seharusnya memakai kode subtipe-tak-diketahui.
      id: 'lab_miliaria_rubra', nama: 'Miliaria Rubra', icd10: 'L74.0', kategori: 'kulit', prevalensi: 'tinggi',
      keluhanUtama: 'Leher dan punggung muncul bintil merah pedih saat cuaca panas.', usia: [5, 65], vital: NORMAL,
      pembuka: ['Kapan bintil muncul dan apa pemicunya?', 'Muncul setelah beberapa hari sangat panas dan berkeringat, terutama di area tertutup pakaian.'],
      pertanyaan: [
        ['q_infeksi', 'rps', 'Ada demam, nanah, atau nyeri berat?', 'Tidak.', true],
        ['q_obat', 'rpd', 'Ada obat baru atau alergi berat?', 'Tidak.', false],
        ['q_oklusi', 'sosial', 'Pakaian tebal/ketat atau banyak krim berminyak?', 'Sering memakai pakaian kerja tebal.', true],
      ],
      fisik: [['kulit', 'Papul-vesikel eritem kecil nonfolikular di leher dan punggung atas pada area oklusi, tanpa pustul.'], ['umum', 'Afebris dan tampak baik.', false]],
      diagnosisBanding: ['L74.0', 'L73.9', 'L27.0'],
      tatalaksana: { obatBenar: ['kalamin_losion'], edukasi: ['kebersihan_kulit', 'tanda_bahaya'] },
      clue: 'Papul kecil pada area panas/oklusi tanpa gejala sistemik mendukung miliaria rubra. Pendinginan lingkungan, pakaian longgar, menjaga kulit kering, dan losio penenang cukup; antibiotik atau steroid kuat tidak rutin.',
      panduanResmi: PPK,
    },
  },
  {
    catalogId: 'drug_eruption',
    conceptId: 'concept:exanthematous_drug_eruption',
    spec: {
      id: 'lab_erupsi_obat_morbiliformis', nama: 'Erupsi Obat Morbiliformis Tanpa SCAR', icd10: 'L27.0', kategori: 'kulit', prevalensi: 'sedang',
      keluhanUtama: 'Badan saya ruam merah gatal setelah mulai antibiotik baru.', usia: [18, 70], vital: NORMAL,
      pembuka: ['Obat apa yang baru dimulai dan kapan ruam muncul?', 'Amoksisilin mulai lima hari lalu; ruam simetris muncul kemarin dari badan.'],
      pertanyaan: [
        ['q_scar', 'rps', 'Ada luka di mulut/mata/kemaluan, lepuh, kulit nyeri, wajah bengkak, sesak, atau demam tinggi?', 'Tidak ada.', true],
        ['q_sistem', 'rps', 'Ada kuning, kencing gelap, pembesaran kelenjar, atau sangat lemas?', 'Tidak.', true],
        ['q_obat_lain', 'rpd', 'Sebutkan semua obat, jamu, dan suplemen 8 minggu terakhir.', 'Hanya amoksisilin baru; vitamin sudah lama.', true],
      ],
      fisik: [['kulit', 'Eksantema makulopapular simetris, blanching, dominan trunkus; Nikolsky negatif, tanpa bula atau purpura.'], ['tht_mulut', 'Mukosa utuh; tidak ada erosio.', true]],
      diagnosisBanding: ['L27.0', 'B09', 'L51.1'],
      tatalaksana: { obatBenar: [], obatOpsional: ['cetirizine_10'], edukasi: ['hentikan_obat_pencetus', 'tanda_bahaya'], edukasiKritis: ['hentikan_obat_pencetus'] },
      clue: 'Hubungan waktu obat baru dan eksantema simetris tanpa mukosa/organ mendukung erupsi morbiliformis sederhana. Hentikan obat tersangka bila aman, dokumentasikan alergi, terapi gejala, dan beri safety-net ketat; ruam nyeri, mukosa, bula, purpura, edema wajah, demam, atau keterlibatan organ memerlukan transfer emergensi.',
      panduanResmi: PPK,
    },
  },
  {
    catalogId: 'vulnus_laseratum',
    conceptId: 'concept:laceration',
    spec: {
      id: 'lab_vulnus_laseratum_lengan', nama: 'Vulnus Laseratum Sederhana', icd10: 'T14.1', kategori: 'gawat', prevalensi: 'tinggi',
      keluhanUtama: 'Lengan saya tersayat seng satu jam lalu.', usia: [12, 70], vital: NORMAL,
      pembuka: ['Bagaimana luka terjadi dan apa yang dilakukan setelahnya?', 'Tersayat tepi seng bersih, langsung ditekan kain; darah sudah berhenti.'],
      pertanyaan: [
        ['q_neurovaskular', 'rps', 'Ada kebas, lemah, jari pucat/dingin, atau perdarahan menyemprot?', 'Tidak.', true],
        ['q_kontaminasi', 'rps', 'Ada tanah, gigitan, benda tertinggal, atau luka tusuk dalam?', 'Tidak.', true],
        ['q_tetanus', 'rpd', 'Kapan vaksin tetanus terakhir?', 'Lebih dari sepuluh tahun lalu.', true],
      ],
      fisik: [['ekstremitas', 'Laserasi linear 3 cm di lengan bawah, subkutis dangkal, bersih; tendon, saraf, dan pembuluh utuh.'], ['umum', 'Hemodinamik stabil.', false]],
      diagnosisBanding: ['T14.1', 'S51.8', 'S56.9'],
      tatalaksana: { obatBenar: [], obatOpsional: ['paracetamol_500'], prosedur: ['perawatan_luka', 'hecting_luka', 'profilaksis_tetanus'], edukasi: ['rawat_luka_tetanus', 'tanda_bahaya'] },
      clue: 'Nilai neurovaskular, tendon, kontaminasi, benda asing, dan tetanus sebelum menutup luka. Luka sederhana yang telah diirigasi dapat dianestesi dan dijahit; antibiotik profilaksis tidak rutin pada laserasi bersih berisiko rendah.',
      panduanResmi: PPK,
    },
  },
  {
    catalogId: 'burn_grade12',
    spec: {
      id: 'lab_luka_bakar_derajat2_dangkal', nama: 'Luka Bakar Superficial Partial-Thickness Lengan Bawah, 2% TBSA', icd10: 'T22.2', kategori: 'gawat', prevalensi: 'sedang',
      keluhanUtama: 'Lengan bawah saya tersiram air panas dua puluh menit lalu; petugas triase sedang mengalirkan air sejuk.', usia: [18, 65], vital: NORMAL,
      pembuka: ['Ceritakan bagaimana kejadian bermula dan apa yang langsung dilakukan.', 'Saat menuang air panas, tangan saya terpeleset dan air menyiram lengan bawah kiri beberapa detik. Saya segera menjauh, lalu datang ke sini; petugas langsung mulai mengalirkan air sejuk.'],
      pertanyaan: [
        ['q_pertolongan_awal', 'rps', 'Sebelum tiba di sini, apakah luka sempat dialiri air atau diberi es, pasta gigi, minyak, obat, atau ramuan?', 'Belum sempat dialiri air. Saya tidak memberi es, pasta gigi, minyak, obat, atau ramuan apa pun.', true],
        ['q_lokasi_khusus', 'rps', 'Selain lengan bawah, apakah mengenai wajah, leher, dada, tangan, kemaluan, kaki, atau sendi; dan apakah luka mengelilingi lengan?', 'Tidak. Hanya sisi depan lengan bawah kiri, tidak sampai pergelangan atau siku dan tidak mengelilingi lengan.', true],
        ['q_mekanisme_risiko', 'rps', 'Apakah ada api atau asap di ruang tertutup, bahan kimia, listrik, ledakan, jatuh, atau cedera lain?', 'Tidak ada. Ini murni tersiram air panas dan saya tidak jatuh atau mengalami cedera lain.', true],
        ['q_nyeri_fungsi', 'rps', 'Bagaimana nyerinya; apakah ada bagian yang mati rasa, tangan sulit digerakkan, atau jari terasa dingin dan kebas?', 'Perih sekali, tetapi semua bagian masih terasa. Jari tetap hangat dan bisa saya gerakkan seperti biasa.', true],
        ['q_risiko_penyembuhan', 'rpd', 'Apakah ada diabetes, gangguan daya tahan tubuh, penyakit pembuluh darah, kebiasaan merokok, obat rutin, atau alergi obat?', 'Tidak ada penyakit menahun, tidak merokok, tidak minum obat rutin, dan tidak punya alergi obat yang diketahui.', true],
        ['q_tetanus', 'rpd', 'Apakah seri vaksin tetanus dasar sudah lengkap, dan kapan dosis terakhir?', 'Lengkap, Dok. Booster terakhir tiga tahun lalu.', true],
        ['q_keamanan_kontrol', 'sosial', 'Apakah ada yang membantu merawat balutan dan Anda dapat kembali dalam dua hari atau lebih cepat bila memburuk?', 'Ada keluarga yang membantu, dan saya bisa kembali dua hari lagi atau segera bila muncul tanda bahaya.', true],
        ['q_hamil', 'rpd', 'Apakah sedang hamil atau mungkin hamil?', 'Tidak, Dok.', true, 'P'],
      ],
      fisik: [
        ['umum', 'Sadar penuh, airway bebas, suara normal, tidak ada jelaga atau tanda cedera inhalasi, hemodinamik stabil, dan tidak ada trauma penyerta.'],
        ['kulit', 'Luka superficial partial-thickness pada lengan bawah kiri sekitar 2% TBSA, dihitung dengan dua permukaan palmar tangan pasien termasuk jari; eritema di luar luka tidak dihitung. Dasar luka merah muda-merah, lembap, sangat nyeri, sensasi utuh, dan blanching kembali kurang dari 2 detik. Terdapat beberapa blister utuh, tidak tegang, berdiameter <=5 mm; tidak ada area pucat, kering, leathery, atau nekrotik.'],
        ['ekstremitas', 'Luka tidak melewati pergelangan atau siku dan tidak sirkumferensial. Nadi radialis, pengisian kapiler, suhu, gerak, serta sensasi distal normal.'],
      ],
      diagnosisBanding: ['T22.2', 'T22.1', 'T22.3'],
      tatalaksana: {
        obatBenar: ['paracetamol_500'],
        prosedur: ['pendinginan_luka_bakar', 'balut_luka_bakar'],
        tindakanSalahUmum: [{
          id: 'resusitasi_cairan_kristaloid',
          alasan: 'Luka stabil seluas 2% TBSA tidak memerlukan formula Parkland atau bolus kristaloid. Pertahankan minum oral bila mampu; cairan IV resusitasi diperuntukkan bagi luka jauh lebih luas atau kondisi sirkulasi yang memang membutuhkan.',
          bahaya: 'nonPrimer',
        }],
        edukasi: ['pertolongan_luka_bakar', 'perawatan_balutan_luka_bakar', 'kontrol_luka_bakar'],
        edukasiKritis: ['pertolongan_luka_bakar', 'kontrol_luka_bakar'],
      },
      clue: 'Dasar merah muda-merah, lembap, sangat nyeri, sensasi utuh, blister kecil, dan blanching cepat mendukung superficial partial-thickness. Lanjutkan air mengalir sejuk hingga total 20 menit sambil menghangatkan bagian tubuh lain, beri parasetamol, bersihkan lembut, lalu pasang balutan non/low-adherent tanpa melingkar ketat. Blister kecil tidak tegang dibiarkan utuh. Seri tetanus lengkap dengan booster tiga tahun lalu tidak memerlukan vaksin atau TIG tambahan. Jangan gunakan es, pasta, minyak, antibiotik sistemik profilaksis, silver sulfadiazine rutin, atau cairan formula Parkland pada luka stabil 2% ini.',
      panduanResmi: 'PPK Dokter FKTP KMK 1186/2022 dan PNPK Tata Laksana Luka Bakar KMK 555/2019 menjadi acuan dasar Indonesia untuk diagnosis, penilaian luas-kedalaman, status tetanus, pembersihan lembut, balutan, dan batas rujukan. ACI Burn Patient Management edisi 2026 memperbarui detail first aid menjadi air mengalir sejuk selama 20 menit, penilaian palmar pasien untuk luka kecil, rawat jalan pada luka minor tanpa hambatan fisik-sosial, serta evaluasi ulang karena kedalaman dapat berubah. Luka ini tidak memenuhi kriteria transfer otomatis, tetapi kapasitas lokal dan akses follow-up tetap menentukan.',
      catatanRealita: 'Sukamaju mampu mendinginkan dengan air mengalir, memberi analgesia oral, membersihkan lembut, dan memasang balutan non/low-adherent. Dressing khusus dan burn service tidak diasumsikan selalu tersedia. Gunakan balutan lembap aman sesuai stok; rujuk bila kedalaman meragukan, nyeri tak terkendali, perawatan melampaui kemampuan, atau kontrol tak terjamin. Jangan mengganti keterbatasan dengan antibiotik empiris.',
      mutiaraEbm: 'Luas luka bukan satu-satunya penentu berat. Kedalaman, lokasi khusus, inhalasi, luka sirkumferensial, komorbid, nyeri, fungsi, dan kondisi sosial dapat mengubah disposisi. Luka bakar juga dinamis dan dapat tampak lebih dalam dalam beberapa hari pertama; karena itu pasien kembali 24-72 jam. Rujuk bila luka memburuk, muncul gangguan fungsi atau neurovaskular, infeksi sistemik, kedalaman tidak pasti, atau penyembuhan belum nyata dalam 10-12 hari.',
      sumber: [
        {
          id: 'pnpk_burn_2019',
          label: 'KMK 555/2019 - PNPK Tata Laksana Luka Bakar',
          url: 'https://keslan.kemkes.go.id/unduhan/fileunduhan_1610415947_843237.pdf',
          tahun: 2019,
          jenis: 'pedoman_indonesia',
        },
        {
          id: 'ppk_fktp_2022',
          label: 'KMK 1186/2022 - PPK Dokter di FKTP',
          url: 'https://paralegal.id/peraturan/keputusan-menteri-kesehatan-nomor-hk-01-07-menkes-1186-2022/',
          tahun: 2022,
          jenis: 'pedoman_indonesia',
        },
        {
          id: 'aci_burn_2026',
          label: 'NSW ACI - Burn Patient Management, 5th Edition',
          url: 'https://aci.health.nsw.gov.au/__data/assets/pdf_file/0009/250020/ACI-Burn-Patient-Management-Clinical-Practice-Guide.pdf',
          tahun: 2026,
          jenis: 'evidence_internasional',
        },
        {
          id: 'aba_burn_referral',
          label: 'American Burn Association - Burn Patient Referral Guidelines',
          url: 'https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral',
          tahun: 2025,
          jenis: 'evidence_internasional',
        },
        {
          id: 'cdc_tetanus_wound_2025',
          label: 'CDC 2025 - Wound Management to Prevent Tetanus',
          url: 'https://www.cdc.gov/tetanus/hcp/clinical-guidance/index.html',
          tahun: 2025,
          jenis: 'evidence_internasional',
        },
      ],
    },
  },
  {
    catalogId: 'blunt_trauma',
    spec: {
      id: 'lab_trauma_tumpul_kepala_ringan', nama: 'Cedera Superfisial Kulit Kepala setelah Benturan Risiko Rendah', icd10: 'S00.0', kategori: 'gawat', prevalensi: 'sedang',
      keluhanUtama: 'Kepala terbentur lemari dua jam lalu; hanya benjol kecil yang nyeri bila ditekan.', usia: [16, 59], vital: NORMAL,
      pembuka: ['Ceritakan bagaimana benturan terjadi dan apa yang dirasakan sejak itu.', 'Saya berdiri lalu mengenai pintu lemari yang terbuka. Saya tidak jatuh atau pingsan; hanya benjolan kecil yang nyeri kalau ditekan, bukan sakit kepala menetap.'],
      pertanyaan: [
        ['q_kesadaran', 'rps', 'Sempat pingsan, bingung, lupa kejadian, sulit tetap terjaga, atau kejang?', 'Tidak, Dok. Saya tetap sadar, ingat kejadian sebelum dan sesudah benturan, dan tidak pernah kejang.', true],
        ['q_perburukan', 'rps', 'Ada sakit kepala yang menetap atau memburuk, muntah, penglihatan berubah, bicara pelo, lemah atau kebas, atau berjalan goyah?', 'Tidak ada. Nyeri hanya tepat di benjolan kalau ditekan; tidak muntah dan fungsi tubuh terasa biasa.', true],
        ['q_mekanisme', 'rps', 'Selain mengenai lemari, apakah sempat jatuh lebih dari satu meter atau lima anak tangga, tertabrak kendaraan, atau terkena benturan berkecepatan tinggi?', 'Tidak. Saya hanya membentur pintu lemari dari posisi berdiri dan tidak sampai jatuh.', true],
        ['q_obat', 'rpd', 'Sedang minum antikoagulan seperti warfarin atau apixaban, antiplatelet seperti clopidogrel atau aspirin, atau punya alergi obat?', 'Tidak minum obat-obat itu dan tidak punya alergi obat yang diketahui.', true],
        ['q_risiko', 'rpd', 'Pernah operasi otak, punya gangguan pembekuan darah, atau mudah mengalami perdarahan?', 'Tidak pernah operasi otak dan tidak punya gangguan perdarahan.', true],
        ['q_intoksikasi_keamanan', 'sosial', 'Sebelum kejadian ada alkohol atau zat lain, dan apakah benturan ini terkait kekerasan atau situasi yang tidak aman?', 'Tidak minum alkohol atau memakai zat apa pun. Ini murni tidak sengaja di rumah.', true],
        ['q_leher', 'rps', 'Ada nyeri leher di garis tengah, kesemutan, atau kelemahan anggota gerak?', 'Tidak ada, Dok.', true],
        ['q_pendamping', 'sosial', 'Adakah orang dewasa yang dapat mengawasi selama 24 jam dan membawa kembali segera bila muncul tanda bahaya?', 'Ada. Kakak saya menunggu di luar, bisa menemani sampai besok, dan ada kendaraan untuk kembali bila perlu.', true],
      ],
      fisik: [
        ['umum', 'Sadar penuh, perilaku dan percakapan sesuai keadaan dasar, hemodinamik stabil, tanpa tanda intoksikasi.'],
        ['neurologis', 'GCS 15/15 dengan komponen E4 V5 M6; orientasi dan memori kejadian utuh, pupil isokor-reaktif, kekuatan-sensasi-koordinasi normal, tanpa defisit fokal, dan gait stabil.'],
        ['kepala_leher', 'Hematoma kulit kepala sekitar 2 cm tanpa luka terbuka atau step-off. Tidak ada hemotimpanum, Battle sign, raccoon eyes, rinorea/otorea cairan serebrospinal, nyeri garis tengah servikal, atau parestesia.'],
      ],
      diagnosisBanding: ['S00.0', 'S06.0', 'S06.5', 'S02.9'],
      tatalaksana: {
        obatBenar: [],
        obatOpsional: ['paracetamol_500'],
        prosedurOpsional: ['observasi_neurologis'],
        edukasi: ['tanda_bahaya_cedera_kepala', 'pengawasan_24_jam_cedera_kepala', 'pemulihan_bertahap_cedera_kepala'],
        edukasiKritis: ['tanda_bahaya_cedera_kepala', 'pengawasan_24_jam_cedera_kepala'],
      },
      clue: 'Benturan energi rendah dengan hematoma kecil, nyeri hanya saat ditekan, GCS E4 V5 M6, dan tanpa gejala neurologis mendukung cedera superfisial kulit kepala, bukan otomatis konkusi. Ulangi GCS per komponen, pupil, gejala, dan defisit sebelum pulang. Parasetamol boleh diberikan bila perlu, tetapi bukan syarat kelulusan. Jangan lakukan foto polos kepala atau CT rutin pada pasien yang benar-benar berisiko rendah. Rujuk untuk evaluasi CT bila GCS menurun, muncul muntah, kejang, defisit, tanda fraktur, sakit kepala menetap atau dominan, amnesia atau pingsan, koagulopati, antikoagulan/antiplatelet bermakna, intoksikasi, mekanisme berbahaya, atau observasi dan akses kembali tidak aman.',
      panduanResmi: `${PNPK_COT_2022} PNPK mencantumkan CT bila GCS belum kembali 15 dalam 2-6 jam atau GCS 15 disertai faktor risiko seperti muntah lebih dari dua episode, usia di atas 60 tahun, defisit, fraktur, sakit kepala dominan, koagulopati, kejang, pingsan lama, gangguan memori, intoksikasi, antikoagulan, atau mekanisme berbahaya. ACEP 2023 mendukung penggunaan alat keputusan tervalidasi untuk CT selektif dan kehati-hatian khusus pada antikoagulan atau antiplatelet. Kasus dewasa ini sengaja tidak memiliki fitur risiko; pulang hanya setelah penilaian serial tetap stabil dan pendamping memahami instruksi tertulis.`,
      catatanRealita: 'Sukamaju mampu melakukan observasi serial neurologis tetapi tidak memiliki CT. Pasien tanpa indikasi imaging dapat pulang setelah kondisi stabil dan pengawasan rumah dipastikan. Bila satu red flag muncul, observasi berkepanjangan di FKTP bukan pengganti CT atau evaluasi rumah sakit.',
      mutiaraEbm: 'GCS 15 tidak sendirian membuktikan aman; keputusan lahir dari mekanisme, gejala, obat, komorbid, pemeriksaan serial, dan keamanan pulang. Sebaliknya, benturan kepala tidak otomatis berarti konkusi atau membutuhkan CT. Pasien tanpa gejala konkusi tidak memerlukan bed rest berkepanjangan, tetapi sebaiknya menghindari berkendara dan aktivitas berisiko benturan ulang pada hari kejadian. Bila gejala konkusi muncul, gunakan istirahat relatif singkat selama satu sampai dua hari lalu naikkan aktivitas secara bertahap sesuai toleransi.',
      observasi: {
        durasiMenit: 120,
        tujuan: 'Lakukan satu siklus observasi neurologis serial pada vignette risiko rendah ini sebelum memastikan keamanan pulang.',
        parameter: [
          'GCS per komponen dan pupil',
          'sakit kepala, muntah, kejang, atau kebingungan baru',
          'defisit fokal, gait, serta nyeri leher',
          'kesiapan pendamping dan akses kembali',
        ],
        hasilUlang: 'Selama siklus observasi 2 jam, GCS tetap E4 V5 M6, pupil isokor-reaktif, tidak muncul sakit kepala menetap, muntah, amnesia, kejang, defisit, atau gangguan gait. Pendamping siap mengawasi 24 jam.',
        disposisiSetelah: 'pulang',
      },
      sumber: [
        {
          id: 'pnpk_cot_2022',
          label: 'KMK 1600/2022 - PNPK Tata Laksana Cedera Otak Traumatik',
          url: 'https://www.kemkes.go.id/app_asset/file_content_download/1700096211655568d31f7cd8.56572518.pdf',
          tahun: 2022,
          jenis: 'pedoman_indonesia',
        },
        {
          id: 'acep_mtbi_2023',
          label: 'ACEP 2023 - Clinical Policy for Mild Traumatic Brain Injury',
          url: 'https://www.acep.org/siteassets/new-pdfs/clinical-policies/mtbi2023.pdf',
          tahun: 2023,
          jenis: 'evidence_internasional',
        },
        {
          id: 'cdc_mild_tbi_2025',
          label: 'CDC 2025 - Mild TBI Management Guideline',
          url: 'https://www.cdc.gov/traumatic-brain-injury/hcp/data-research/index.html',
          tahun: 2025,
          jenis: 'evidence_internasional',
        },
      ],
    },
  },
  {
    catalogId: 'sharp_trauma',
    spec: {
      id: 'lab_trauma_tajam_kulit_kepala', nama: 'Trauma Tajam Kulit Kepala Sederhana', icd10: 'S01.0', kategori: 'gawat', prevalensi: 'sedang', // Deep research 2026-08-22: 'S00-S09' RENTANG BLOK; klinis laserasi 2cm kulit kepala = S01.0 WHO 'Open wound of scalp' (bukan S00.0 superfisial, yg dipakai kasus tumpul di berkas ini).
      keluhanUtama: 'Kulit kepala tersayat tepi seng satu jam lalu.', usia: [15, 70], vital: NORMAL,
      pembuka: ['Bagaimana luka terjadi dan apa yang dirasakan sesudahnya?', 'Tepi seng menyayat dangkal saat saya membungkuk; tidak pingsan dan tetap ingat semua kejadian.'],
      pertanyaan: [
        ['q_neurologis', 'rps', 'Ada pingsan, muntah, amnesia, kejang, sakit kepala memburuk, atau lemah anggota gerak?', 'Tidak.', true],
        ['q_benda', 'rps', 'Ada benturan kuat, benda tertinggal, kontaminasi tanah, atau luka menembus tulang?', 'Tidak.', true],
        ['q_tetanus', 'rpd', 'Kapan vaksin tetanus terakhir?', 'Tidak ingat.', true],
      ],
      fisik: [['kepala_leher', 'Laserasi linear 2 cm pada kulit kepala, galea utuh, hemostasis tercapai; tidak ada step-off atau tanda fraktur basis kranii.'], ['neurologis', 'GCS 15, pupil isokor-reaktif, tanpa defisit.', true]],
      diagnosisBanding: ['S01.0', 'T14.1', 'S06.0'],
      tatalaksana: { obatBenar: [], obatOpsional: ['paracetamol_500'], prosedur: ['perawatan_luka', 'hecting_luka', 'profilaksis_tetanus'], edukasi: ['rawat_luka_tetanus', 'tanda_bahaya'] },
      clue: 'Pada luka tajam kepala, nilai GCS, gejala neurologis, fraktur, kedalaman, kontaminasi, dan benda asing sebelum anestesi/penutupan. Irigasi dan jahit hanya luka kulit kepala sederhana; penurunan kesadaran, defisit, fraktur, penetrasi, perdarahan tak terkendali, atau benda asing perlu rujuk.',
      panduanResmi: `${PNPK_TRAUMA_2017} Pada laserasi kulit kepala, singkirkan lebih dulu gangguan ABC, cedera otak, fraktur, penetrasi, perdarahan tak terkendali, kontaminasi berat, dan benda asing. Irigasi serta penutupan di FKTP hanya untuk luka superfisial sederhana setelah penilaian tersebut; evaluasi status tetanus tetap wajib.`,
    },
  },
]

export const LAB_BATCH_3_CASES: KasusKlinis[] = DEFINITIONS.map(({ spec }) => buatKasusFktpLab(spec))

export const LAB_BATCH_3_ARCHETYPE_SPECS: Record<string, { conceptId: string; credits: string[] }> =
  Object.fromEntries(DEFINITIONS.map(({ catalogId, conceptId, spec }) => [
    spec.id,
    { conceptId: conceptId ?? `concept:${catalogId}`, credits: [`fktp144:${catalogId}`] },
  ]))
