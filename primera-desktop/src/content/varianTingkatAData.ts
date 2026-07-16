/**
 * DATA VARIAN PRESENTASI TINGKAT-A (M11 #4) — file GENERATED.
 *
 * Diisi dari pipeline draf->verifikasi-adversarial (workflow
 * `m11-varian-tingkat-a`, 2026-07-16, 2 lensa: stabilitas diagnosis +
 * koherensi internal, 1 ronde perbaikan) lalu ditulis deterministik dari
 * JSON hasil verifikasi oleh skrip — jangan edit manual kecuali koreksi
 * klinis yang diadjudikasi. Ringkasan per varian + rasional klinisnya:
 * docs/M11_VARIAN_TINGKAT_A_HASIL.md.
 *
 * Kunci = id kasus. Diterapkan ke katalog oleh `terapkanVarianTingkatA()`
 * (varianTingkatA.ts) saat PACK dirakit; integritas isi dijaga
 * `validasiPack` (pack.ts), sidik jari replay meng-hash daftar id varian
 * (verifikasi.ts).
 */
import type { VarianPresentasiTingkatA } from './types'

export const VARIAN_TINGKAT_A: Record<string, VarianPresentasiTingkatA[]> = {
  ispa_common_cold: [
    {
      id: 'hidung_mampet_bersin',
      vital: { td: '120/80', nadi: 78, suhu: 37.4, spo2: 98 },
      keluhanUtama: 'Hidung saya mampet dok, bersin-bersin terus sudah empat hari.',
      jawabanBerubah: {
        q_keluhan: 'Hidung saya mampet dok, bersin-bersin terus. Ingusnya tetap keluar, bening encer kayak air.',
        q_durasi: 'Sudah empat hari ini dok, belum enakan juga.',
      },
      temuanBerubah: {
        tht_mulut: 'Mukosa hidung edema dengan konka edema bilateral, sekret serosa jernih (+). Faring hiperemis ringan, tonsil T1/T1 tenang.',
      },
    },
    {
      id: 'meriang_kluster_kantor',
      vital: { td: '118/76', nadi: 92, rr: 20, suhu: 37.9 },
      keluhanUtama: 'Badan saya meriang dok, hidungnya juga meler sejak kemarin sore.',
      jawabanBerubah: {
        q_keluhan: 'Badan saya meriang nggak enak dok, terus hidung saya meler, ingusnya bening encer.',
        q_durasi: 'Baru dari kemarin sore dok.',
        q_demam: 'Semalam saya ukur 37.8 dok, meriang tapi nggak sampai menggigil.',
        q_kontak: 'Di rumah nggak ada dok, tapi di kantor lagi banyak yang pilek, teman semeja saya juga.',
      },
    },
  ],
  faringitis_akut: [
    {
      id: 'demam_menggigil_dua_hari',
      vital: { td: '110/70', nadi: 104, rr: 20, suhu: 39.1 },
      keluhanUtama: 'Dua hari ini badan saya demam terus dok, tenggorokan juga nyeri sekali tiap menelan.',
      jawabanBerubah: {
        q_keluhan: 'Yang paling berat tenggorokannya dok, nelan ludah saja nyeri banget. Badan juga panas terus dua hari ini.',
        q_demam: 'Iya dok, dua hari ini demam tinggi terus, semalam sampai menggigil kedinginan.',
        q_kgb: 'Iya dok, dari bawah rahang sampai leher dua sisi terasa bengkak, senut-senut kalau tersentuh.',
      },
      temuanBerubah: {
        umum: 'Compos mentis, tampak sakit sedang, menggigil ringan, kulit teraba panas.',
        tht_mulut: 'Faring hiperemis (+), tonsil T2/T2 hiperemis dengan lapisan eksudat putih kekuningan pada kedua tonsil. Tidak ada batuk.',
        kepala_leher: 'KGB submandibula dan servikal anterior teraba membesar bilateral, nyeri tekan (+).',
      },
    },
    {
      id: 'tiga_hari_gagal_obat_warung',
      vital: { td: '120/80', nadi: 96, rr: 18, suhu: 38.8 },
      keluhanUtama: 'Sudah tiga hari tenggorokan saya nyeri sekali buat menelan dok, obat dari warung tidak mempan.',
      jawabanBerubah: {
        q_keluhan: 'Nyeri tenggorokannya dok, tiap menelan rasanya panas kayak kebakar. Sudah tiga hari sampai malas makan.',
        q_demam: 'Ada dok, demamnya barengan sama sakit tenggorokan tiga hari lalu. Sempat turun sebentar habis minum obat dari warung, tapi naik lagi terus.',
        q_amandel: 'Baru kali ini yang separah ini dok, biasanya paling serak sehari dua hari sembuh sendiri.',
        q_kontak: 'Di rumah nggak ada dok, tapi teman yang sering main bareng saya minggu lalu juga radang tenggorokan.',
        q_kgb: 'Ada dok, leher depan dua sisi ada benjolan kecil, nyeri kalau kepencet.',
      },
      temuanBerubah: {
        tht_mulut: 'Faring hiperemis (+), tonsil T2/T2 hiperemis dengan bintik-bintik eksudat putih di permukaan kedua tonsil. Tidak ada batuk.',
        kepala_leher: 'KGB servikal anterior bilateral teraba membesar sekitar 1 cm, kenyal, mobile, nyeri tekan (+).',
      },
    },
  ],
  diare_akut_anak: [
    {
      id: 'muntah_dulu_habis_kondangan',
      vital: { nadi: 118, rr: 26, suhu: 38.2 },
      keluhanUtama: 'Anak saya semalam muntah-muntah dok, sekarang gantian mencret cair terus, sudah tujuh kali sejak subuh.',
      jawabanBerubah: {
        q_keluhan: 'Semalam dia muntah-muntah dulu dok, terus dari subuh gantian mencret cair terus, sudah tujuh kali sampai sekarang.',
        q_muntah: 'Semalam muntahnya sampai empat kali dok, tapi dari subuh sudah nggak muntah lagi, cuma badannya anget.',
        q_makan: 'Kemarin sore kami kondangan dok, dia makan macam-macam di sana, es buah sama sate-satean.',
        q_keluarga: 'Bapaknya yang ikut kondangan dari tadi pagi juga mules dan sempat mencret sekali dok.',
      },
    },
    {
      id: 'tanpa_muntah_sejak_kemarin_sore',
      vital: { td: '95/65', nadi: 120, rr: 22, suhu: 37.4 },
      keluhanUtama: 'Anak saya mencret terus dari kemarin sore dok, sudah delapan kali, rewel minta minum melulu.',
      jawabanBerubah: {
        q_keluhan: 'Dia mencret cair terus dari kemarin sore dok, sampai tadi sudah delapan kali, rewelnya minta minum melulu.',
        q_muntah: 'Nggak muntah sama sekali dok. Semalam badannya sempat anget, tadi pagi sudah turun sendiri.',
        q_makan: 'Kemarin siang dia minum es cendol beli di pasar dok, sorenya mulai mencret.',
        q_keluarga: 'Nggak ada dok, di rumah cuma dia sendiri yang mencret.',
      },
      temuanBerubah: {
        umum: 'Anak gelisah dan rewel, sadar penuh, mata tampak cekung, air mata masih keluar saat menangis. Kesan dehidrasi ringan-sedang.',
        abdomen: 'Bising usus meningkat, perut supel, tidak ada nyeri tekan bermakna maupun distensi.',
      },
    },
  ],
  hipertensi_esensial: [
    {
      id: 'nyeri_kepala_sore_seminggu',
      vital: { td: '168/102', nadi: 88, rr: 18, suhu: 36.8 },
      keluhanUtama: 'Kepala saya sering nyut-nyutan dan leher terasa kaku kalau sore, Dok, sudah seminggu ini.',
      jawabanBerubah: {
        ht_ku: 'Kepala saya nyut-nyutan, Dok, lehernya ikut kaku. Biasanya muncul sore hari sehabis pulang kerja.',
        ht_onset: 'Sudah hampir seminggu, Dok, hilang-timbul; paling berat sore hari setelah seharian kerja.',
        ht_penyerta: 'Tidak ada, Dok. Mata masih jelas, tidak mual, dada juga tidak nyeri.',
      },
      temuanBerubah: {
        umum: 'Composmentis, tampak sedikit lelah. IMT 26,4 kg/m² (berat badan lebih), lingkar pinggang berlebih.',
      },
    },
  ],
  dm_tipe2: [
    {
      id: 'polifagia_lemas_dominan',
      vital: { td: '128/82', nadi: 88, gds: 279 },
      keluhanUtama: 'Saya gampang sekali lapar dan makan terus, Dok, tapi badan malah tambah lemas; malam juga sering bolak-balik kencing.',
      jawabanBerubah: {
        dm_ku: 'Saya cepat sekali lapar, Dok, makan sudah banyak tapi badan tetap saja lemas. Malam hari bolak-balik kencing dan rasanya haus terus.',
      },
    },
    {
      id: 'gatal_selangkangan_kesemutan',
      vital: { td: '122/78', nadi: 80, gds: 235 },
      keluhanUtama: 'Selangkangan saya gatal tidak sembuh-sembuh, Dok, ujung jari kaki sering kesemutan, dan malam jadi bolak-balik kencing.',
      jawabanBerubah: {
        dm_ku: 'Yang paling mengganggu gatal di selangkangan, Dok, sudah hampir sebulan hilang timbul. Ujung jari kaki juga sering kesemutan, dan malam saya bolak-balik kencing, gampang haus, badan lemas.',
        dm_luka: 'Luka tidak ada, Dok. Cuma gatal di selangkangan dan lipatan kulit itu yang hampir sebulan hilang timbul, apalagi kalau berkeringat.',
        dm_kesemutan: 'Iya, Dok, hampir tiap malam ujung jari kaki kesemutan dan sedikit kebas, tapi hilang sendiri.',
      },
      temuanBerubah: {
        kulit: 'Turgor kulit normal; tampak bekas garukan ringan di lipatan inguinal tanpa lesi jamur aktif yang luas, tidak ada akantosis mencolok.',
      },
    },
  ],
  gastritis: [
    {
      id: 'begah_pasca_makan',
      vital: { td: '118/76', nadi: 88, suhu: 36.8 },
      keluhanUtama: 'Ulu hati saya begah dan mual, Dok, makin terasa habis makan, apalagi kalau pedas atau bersantan.',
      jawabanBerubah: {
        gas_ku: 'Rasanya penuh dan begah di ulu hati, Dok, kadang perih juga; mualnya paling muncul setelah makan pedas atau bersantan.',
        gas_onset: 'Sudah hampir sebulan hilang timbul, Dok, makin sering kambuh kalau kerjaan lagi menumpuk.',
        gas_agravasi: 'Memberat setelah makan pedas, bersantan, atau habis ngopi, Dok; kalau makan pelan-pelan porsi kecil rasanya lebih enak.',
        gas_gayahidup: 'Makan saya tidak teratur, suka yang pedas dan bersantan, kopi paling dua gelas sehari, dan lagi banyak pikiran soal kerjaan.',
      },
      temuanBerubah: {
        abdomen: 'Nyeri tekan epigastrium ringan (+), perut atas tampak sedikit kembung, timpani, tidak ada defans muskular, bising usus normal, hepar/lien tidak teraba.',
      },
    },
    {
      id: 'perih_pagi_lembur',
      vital: { td: '110/74', nadi: 76, rr: 16, suhu: 36.5 },
      keluhanUtama: 'Ulu hati saya perih dan mual kalau pagi-pagi belum sempat sarapan, Dok.',
      jawabanBerubah: {
        gas_ku: 'Perih panas di ulu hati, Dok, paling terasa pagi hari waktu perut masih kosong, kadang sampai mual.',
        gas_onset: 'Baru sepuluh hari ini, Dok, hampir tiap pagi kumat; minggu ini pas lagi banyak lembur.',
        gas_agravasi: 'Paling perih kalau perut kosong, Dok, apalagi kalau cuma minum kopi tanpa makan; setelah diisi nasi agak reda.',
        gas_obat: 'Kalau pusing atau badan pegal habis lembur, saya biasa beli obat nyeri di warung, Dok, kadang ditambah jamu.',
        gas_keluarga: 'Bapak saya dulu juga sering sakit maag, Dok.',
        gas_gayahidup: 'Sebulan ini sering lembur malam, Dok, sarapan sering kelewat, kopi bisa empat gelas biar kuat, pikiran juga lagi tegang.',
      },
      temuanBerubah: {
        abdomen: 'Nyeri tekan epigastrium (+) tanpa nyeri lepas, defans muskular (-), bising usus normal, tidak teraba massa maupun pembesaran hepar/lien.',
      },
    },
  ],
  bronkitis_akut: [
    {
      id: 'batuk_malam_sepuluh_hari',
      vital: { td: '124/78', nadi: 78, rr: 18, suhu: 36.8, spo2: 99 },
      keluhanUtama: 'Dok, batuk saya sudah sepuluh hari nggak sembuh-sembuh, malam hari paling parah sampai susah tidur.',
      jawabanBerubah: {
        q_keluhan: 'Awalnya kering dok, sekarang berdahak putih. Malam hari paling sering kumat, sampai kebangun-bangun tidur.',
        q_durasi: 'Sudah sepuluh hari dok. Awalnya ketularan pilek orang serumah — pilek saya sudah sembuh, tapi batuknya nyisa terus.',
        q_demam: 'Nggak sampai demam dok. Cuma badan agak nggak enak dua hari pertama, habis itu sudah biasa lagi.',
      },
      temuanBerubah: {
        tht_mulut: 'Faring tenang, sisa hiperemis minimal, tonsil T1/T1.',
      },
    },
    {
      id: 'batuk_pagi_sumeng_sore',
      vital: { td: '118/76', nadi: 94, suhu: 37.6, spo2: 97 },
      keluhanUtama: 'Batuk terus dok lima hari ini, paling berat pagi habis bangun tidur, sampai otot dada rasanya ketarik.',
      jawabanBerubah: {
        q_keluhan: 'Awalnya kering dok, dua hari terakhir mulai keluar dahak putih. Paling berat pagi habis bangun tidur, siang agak mendingan.',
        q_durasi: 'Baru lima hari dok. Minggu lalu saya kehujanan naik motor, habis itu pilek — pileknya sudah reda, eh batuknya malah tambah sering.',
        q_demam: 'Masih suka sumeng kalau sore dok, tapi nggak tinggi. Pagi ini badan cuma anget sedikit.',
      },
    },
  ],
  rinitis_alergi: [
    {
      id: 'mampet_dominan_malam',
      vital: { td: '124/80', nadi: 84, rr: 18, suhu: 36.8, spo2: 98 },
      keluhanUtama: 'Hidung saya mampet banget tiap malam dok, sampai susah tidur, bersin-bersin juga dan ingusnya bening terus.',
      jawabanBerubah: {
        q_keluhan: 'Mampetnya pindah-pindah kiri kanan dok, paling berat malam pas berbaring sampai harus napas lewat mulut. Bersinnya juga sering beruntun, ingusnya bening encer, hidungnya gatal.',
        q_pencetus: 'Paling berat malam sampai pas bangun tidur dok, apalagi kalau kucing habis tidur di kasur atau saya habis bersihin karpet kamar.',
      },
      temuanBerubah: {
        tht_mulut: 'Mukosa hidung livide (pucat kebiruan) dan edema, konka inferior hipertrofi bilateral menonjol, sekret serosa jernih (+), tidak ada sekret purulen.',
      },
    },
    {
      id: 'serangan_bersin_debu_gudang',
      vital: { td: '112/72', nadi: 88, rr: 20, suhu: 36.5, spo2: 99 },
      keluhanUtama: 'Bersin saya kumat parah dok sejak kemarin beres-beres gudang belakang rumah, ingusnya bening ngocor terus.',
      jawabanBerubah: {
        q_keluhan: 'Sekali kumat bisa bersin belasan kali beruntun dok, ingusnya encer bening kayak air, hidung sama langit-langit mulut ikut gatal.',
        q_pencetus: 'Tiap kena debu langsung kumat dok. Kemarin bongkar-bongkar gudang belakang rumah yang penuh debu langsung parah, tapi memang sudah bertahun-tahun begini hilang-timbul.',
        q_riwayat: 'Asma nggak pernah dok, tapi dari kecil saya sering biduran, apalagi kalau udara dingin.',
      },
      temuanBerubah: {
        tht_mulut: 'Mukosa hidung pucat dan edema, sekret serosa jernih banyak sampai membasahi vestibulum, konka inferior edema bilateral.',
      },
    },
  ],
  gerd: [
    {
      id: 'regurgitasi_malam_terbangun',
      vital: { td: '112/72', nadi: 74 },
      keluhanUtama: 'Hampir tiap malam saya kebangun dok, ada cairan asam dari perut naik ke tenggorokan sampai terbatuk-batuk, mulut asam pahit tiap bangun pagi.',
      jawabanBerubah: {
        q_keluhan: 'Dari ulu hati naik ke belakang dada sampai pangkal tenggorokan dok. Panasnya nggak terlalu hebat, tapi cairan asam pahitnya itu yang sering naik sampai mulut, apalagi pas tidur malam.',
        q_pencetus: 'Paling parah malam hari pas berbaring dok, apalagi kalau makan malamnya telat terus langsung tidur. Siang hari kalau jalan jauh atau kerja berat malah nggak kumat.',
      },
      temuanBerubah: {
        tht_mulut: 'Faring posterior hiperemis granular ringan (iritasi asam kronik), tanpa eksudat; tampak erosi ringan email gigi posterior.',
      },
    },
    {
      id: 'kambuh_kopi_lembur',
      vital: { td: '130/84', nadi: 90 },
      keluhanUtama: 'Sudah lama dok dada saya suka panas perih dari ulu hati naik ke tenggorokan, tapi belakangan makin sering kumat tiap habis lembur — banyak ngopi terus makan larut malam.',
      jawabanBerubah: {
        q_keluhan: 'Panasnya mulai dari ulu hati naik ke tengah dada sampai tenggorokan dok, mulut ikut asam. Keluhannya sih sudah bertahun-tahun hilang-timbul, cuma belakangan makin sering. Diminumin obat maag kunyah dari warung adem sebentar, habis itu balik lagi.',
        q_pencetus: 'Memberatnya habis makan besar larut malam dan kalau kebanyakan kopi dok, ditambah langsung rebahan makin naik. Kalau naik tangga atau angkat galon nggak ngaruh.',
        q_gaya: 'Parah sih dok, kalau lembur kopi bisa empat-lima gelas sehari, rokok masih jalan, makan malam jam sebelas terus langsung tidur, cemilannya gorengan.',
        q_obat: 'Obat pereda nyeri nggak rutin dok, paling sesekali beli di warung kalau badan pegal habis lembur. Yang lebih sering malah obat maag kunyah buat dada panasnya.',
      },
    },
  ],
  dispepsia_fungsional: [
    {
      id: 'begah_cepat_kenyang',
      vital: { td: '124/80', nadi: 84, rr: 18, suhu: 36.8, spo2: 98 },
      keluhanUtama: 'Perut atas saya penuh dan begah tiap habis makan dok, baru beberapa suap sudah kenyang, sudah hampir tiga bulan hilang timbul.',
      jawabanBerubah: {
        q_keluhan: 'Begah dan penuh banget dok terutama habis makan, baru beberapa suap sudah kenyang, sering sendawa dan kadang mual. Perihnya cuma sesekali, nggak seberapa.',
        q_durasi: 'Sudah hampir tiga bulan dok, hilang timbul, paling terasa kalau makan nggak teratur dan pas kerjaan lagi numpuk-numpuknya.',
      },
      temuanBerubah: {
        abdomen: 'Epigastrium tampak sedikit kembung, nyeri tekan epigastrium minimal, tidak ada massa, bising usus normal, tidak ada defans/nyeri lepas.',
      },
    },
    {
      id: 'perih_perut_kosong',
      vital: { td: '108/68', nadi: 70, rr: 16, suhu: 36.4, spo2: 99 },
      keluhanUtama: 'Ulu hati saya perih sekali kalau telat makan dok, apalagi habis ngopi pagi belum sarapan, sudah sekitar enam minggu kumat-kumatan.',
      jawabanBerubah: {
        q_keluhan: 'Perih di ulu hati dok, paling terasa pas perut kosong atau habis ngopi pagi-pagi, kalau sudah makan agak mendingan tapi nanti kumat lagi. Kadang mual, begahnya cuma sesekali.',
        q_durasi: 'Kurang lebih enam minggu dok, kumat-kumatan, paling parah kalau perut kosong kelamaan atau lagi banyak pikiran.',
        q_kopi: 'Kopi bisa dua-tiga gelas sehari dok, sering pagi-pagi sebelum sarapan, pedas juga suka, rokok sesekali kalau stres.',
      },
      temuanBerubah: {
        abdomen: 'Nyeri tekan ringan terlokalisir di epigastrium, tidak menjalar ke punggung, tidak ada massa, bising usus normal, tidak ada defans/nyeri lepas.',
      },
    },
  ],
  kulit_tinea_korporis: [
    {
      id: 'pemicu_keringat_olahraga',
      vital: { td: '124/80', nadi: 74, rr: 16, suhu: 36.5 },
      keluhanUtama: 'Di perut saya ada bulatan gatal kayak cincin dok, pinggirnya merah dan makin melebar.',
      jawabanBerubah: {
        q_keluhan: 'Bulat kayak cincin dok di perut sampai ke pinggang, gatal sekali. Pinggirnya merah kasar bersisik, tengahnya malah kelihatan agak bersih.',
        q_meluas: 'Iya dok, dua minggu lalu masih sebesar uang koin, sekarang sudah selebar bola pingpong, melebarnya dari pinggirnya.',
        q_lembap: 'Saya rutin olahraga lari tiap sore dok, habis itu jarang langsung mandi, kaos basah keringat kepakai sampai malam.',
        q_obat: 'Dikasih tetangga krim buat gatal dok, katanya manjur. Awalnya memang adem, tapi lama-lama bercaknya tambah lebar dan pinggirnya jadi samar.',
      },
    },
    {
      id: 'kontak_kucing_pitak',
      vital: { td: '112/72', nadi: 86, rr: 20, suhu: 37.1 },
      keluhanUtama: 'Pinggang kanan saya ada bercak bundar yang gatal banget dok, terus melebar pelan-pelan.',
      jawabanBerubah: {
        q_keluhan: 'Di pinggang sebelah kanan dok, bentuknya bundar kayak gelang: pinggirnya merah bersisik dan paling gatal apalagi kalau keringatan, tengahnya agak mulus kayak mau sembuh.',
        q_meluas: 'Melebar dok, pelan tapi pasti sejak sekitar sebulan lalu. Yang merah dan gatal itu pinggirnya, jalarnya ke arah luar.',
        q_kontak: 'Di rumah belum ada yang ketularan dok. Tapi kucing kampung peliharaan saya bulunya lagi rontok pitak-pitak, hampir tiap hari saya pangku.',
        q_obat: 'Saya olesi krim sisa obat eksim yang ada di rumah dok. Gatalnya sempat kalem, tapi bercaknya malah melebar dan batas pinggirnya jadi kabur.',
      },
    },
  ],
  saraf_tension_headache: [
    {
      id: 'pemicu_postur_layar',
      vital: { td: '118/76', nadi: 84, rr: 18, suhu: 36.7, spo2: 98 },
      keluhanUtama: 'Kepala saya kenceng terus dok, kayak ditekan dari dua sisi sampai ke tengkuk.',
      jawabanBerubah: {
        q_keluhan: 'Rasanya kayak ditekan kenceng dari kedua sisi kepala dok, berat sampai ke tengkuk. Tumpul gitu, bukan nyut-nyutan.',
        q_durasi: 'Kambuh-kambuhan dok, seminggu bisa dua-tiga kali. Biasanya mulai siang menjelang sore, pas saya sudah lama banget duduk di depan komputer.',
        q_stres: 'Tekanan kerjaan ada lah dok, lagi padat. Saya seharian nunduk di depan laptop jarang gerak, tidurnya juga sering kemalaman, jam dua belas lebih baru tidur.',
        q_obat: 'Belum minum obat apa-apa dok, biasanya cuma saya balur minyak angin sama minta dipijit. Enakan sebentar, terus balik lagi.',
        q_kopi: 'Jarang dok, paling segelas pagi-pagi biar melek.',
      },
      temuanBerubah: {
        kepala_leher: 'Nyeri tekan otot perikranial (+) terutama regio temporal bilateral; otot leher dan trapezius teraba tegang, palpasi mencetuskan keluhan.',
      },
    },
    {
      id: 'stresor_jaga_keluarga_sakit',
      vital: { td: '124/82', nadi: 72, rr: 16, suhu: 36.5, spo2: 99 },
      jawabanBerubah: {
        q_durasi: 'Sudah dua-tiga bulan ini dok, hilang-timbul. Seminggu paling sekali-dua kali, tapi sekali kumat bisa setengah hari sampai seharian baru reda.',
        q_stres: 'Iya dok, kerjaan lagi ramai-ramainya, terus malamnya saya gantian jaga orang tua yang sakit di rumah. Tidur jadi kepotong-potong, nggak pernah nyenyak.',
        q_obat: 'Baru sekali-dua kali minum obat sakit kepala bungkusan dari warung dok, lumayan enakan tapi habis itu kumat lagi.',
      },
      temuanBerubah: {
        kepala_leher: 'Nyeri tekan otot perikranial (+) terutama regio frontotemporal kedua sisi; otot leher dan bahu teraba tegang.',
      },
    },
  ],
  mata_konjungtivitis_alergi: [
    {
      id: 'kumat_pagi_debu_kasur',
      vital: { td: '110/70', nadi: 84, rr: 16, suhu: 36.8, spo2: 98 },
      keluhanUtama: 'Dua mata saya gatal banget dan merah dok, berair terus, paling parah pas baru bangun tidur, sudah seminggu hilang-timbul.',
      jawabanBerubah: {
        q_keluhan: 'Gatalnya dok yang paling nggak tahan, dua mata merah dan berair, bawaannya pengin ngucek terus. Paling parah pas baru bangun tidur.',
        q_pemicu: 'Kayaknya dari kasur kapuk sama karpet kamar yang berdebu dok, tiap habis tiduran di situ atau beres-beres kamar langsung kumat.',
        q_atopi: 'Iya dok, tiap pagi bersin-bersin dan meler kalau kena debu, dari kecil juga gampang biduran. Bapak saya sama, pilek alergi.',
      },
    },
    {
      id: 'pencetus_kucing_peliharaan',
      vital: { td: '122/78', nadi: 68, rr: 17, suhu: 36.4, spo2: 100 },
      keluhanUtama: 'Mata kanan-kiri saya merah, gatal banget, dan berair terus dok, dua minggu ini kumat-kumatan sejak ada kucing baru di rumah.',
      jawabanBerubah: {
        q_keluhan: 'Yang paling mengganggu gatalnya dok, dua mata merah dan berair terus, rasanya pengin dikucek melulu. Kumatnya dua minggu ini sejak ada kucing di rumah.',
        q_pemicu: 'Paling jelas kucing dok, sejak adik saya bawa kucing peliharaan ke rumah, tiap habis main atau gendong kucingnya langsung gatal berat. Nyapu lantai berdebu juga bikin kumat.',
        q_atopi: 'Saya ada asma ringan dari kecil dok tapi jarang kumat, dan kalau pagi sering bersin-bersin pilek. Keluarga saya memang gampang alergi.',
      },
    },
  ],
  tht_serumen_prop: [
    {
      id: 'buntu_bertahap_dua_minggu',
      vital: { td: '104/68', nadi: 82, suhu: 36.8 },
      keluhanUtama: 'Pendengaran telinga kanan saya makin lama makin berkurang dok, sudah dua minggu rasanya penuh terus.',
      jawabanBerubah: {
        q_keluhan: 'Telinga kanan terasa penuh dok, pendengarannya makin menurun pelan-pelan, sudah kira-kira dua minggu, makin lama makin buntu.',
        q_pemicu: 'Nggak habis berenang atau kemasukan air dok. Buntunya nambah pelan-pelan sendiri sejak dua minggu ini, nggak ada pemicu yang jelas.',
      },
    },
    {
      id: 'buntu_mendadak_pasca_berenang',
      vital: { td: '100/64', nadi: 88, suhu: 36.5 },
      keluhanUtama: 'Telinga kanan saya mendadak buntu total habis berenang kemarin dok, suara jadi redup semua.',
      jawabanBerubah: {
        q_keluhan: 'Telinga kanan mendadak buntu total sejak kemarin dok, suara orang jadi redup, tapi suara saya sendiri malah kedengaran bergema di kepala.',
        q_pemicu: 'Iya dok, persis setelah berenang di kolam kemarin. Begitu keluar dari air langsung buntu total, kayak disumpal.',
        q_denging: 'Nggak berdenging dok, nggak pusing berputar juga. Cuma rasanya buntu aja.',
      },
    },
  ],
  mm_gout_artritis_akut: [
    {
      id: 'podagra_kiri_makanan_laut',
      vital: { td: '128/82', nadi: 96, suhu: 37.3 },
      keluhanUtama: 'Jempol kaki kiri saya mendadak bengkak merah dan nyeri hebat dok, sejak menjelang subuh tadi.',
      jawabanBerubah: {
        q_keluhan: 'Pangkal jempol kaki kiri dok, bengkak, merah mengkilap, nyerinya berdenyut panas — kena kaus kaki saja rasanya bukan main.',
        q_onset: 'Mendadak dok. Menjelang subuh saya terbangun karena nyerinya, dalam dua-tiga jam saja sudah bengkak besar dan sakitnya di puncak.',
        q_pemicu: 'Semalam ada syukuran di rumah saudara dok, saya makan udang, kerang, sama cumi banyak sekali.',
      },
      temuanBerubah: {
        ekstremitas: 'Sendi MTP-1 kiri: edema, eritema mengkilap, teraba hangat, sangat nyeri tekan (podagra). Pasien menghindari menapak dengan kaki kiri; ROM terbatas karena nyeri.',
      },
    },
    {
      id: 'afebris_pemicu_jeroan',
      vital: { td: '124/78', nadi: 84, suhu: 36.8 },
      keluhanUtama: 'Dok, jempol kaki kanan saya semalam mendadak bengkak dan nyeri cenut-cenut, sampai sandal jepit saja tidak bisa dipakai.',
      jawabanBerubah: {
        q_keluhan: 'Di pangkal jempol kaki kanan dok, bengkak, merah, rasanya panas berdenyut — dipakai sandal tidak muat, disentuh sedikit saja nyerinya luar biasa.',
        q_pemicu: 'Kemarin siang saya makan soto jeroan sapi sama emping banyak dok, habis itu seharian angkat-angkat panen di sawah panas-panasan, minumnya cuma sedikit.',
        q_riwayat: 'Sudah dua kali dok. Terakhir kira-kira enam bulan lalu, di jempol kanan yang ini juga, waktu itu reda sendiri hampir seminggu.',
        q_demam: 'Tidak demam dok, badan biasa saja. Sendi lain juga tidak ada yang sakit, cuma jempol kanan ini.',
      },
      temuanBerubah: {
        umum: 'Compos mentis, tampak kesakitan, berjalan pincang menumpu pada tumit kanan menghindari tekanan pada jempol kaki. Habitus overweight.',
      },
    },
  ],
  mm_dislipidemia: [
    {
      id: 'skrining_posbindu_desa',
      vital: { td: '132/86', nadi: 88 },
      keluhanUtama: 'Dok, kemarin saya ikut skrining Posbindu di balai desa, kata kadernya kolesterol saya tinggi, disuruh periksa ke sini.',
      jawabanBerubah: {
        q_keluhan: 'Tidak ada keluhan apa-apa dok. Kemarin ikut skrining Posbindu di balai desa, kata kadernya kolesterol saya tinggi, jadi disuruh lanjut periksa ke Puskesmas.',
        q_aktivitas: 'Saya jaga warung kelontong di rumah dok, seharian duduk di belakang etalase, hampir tidak pernah olahraga.',
        q_dm: 'Kencing manis belum pernah diperiksa dok. Tensi waktu di Posbindu katanya juga agak tinggi.',
      },
      temuanBerubah: {
        umum: 'Habitus obesitas sentral, lingkar perut melebihi normal. IMT 31.',
      },
    },
    {
      id: 'cek_mandiri_teman_serangan_jantung',
      vital: { td: '135/88', nadi: 92 },
      keluhanUtama: 'Dok, minggu lalu teman kantor saya kena serangan jantung, saya jadi ikut cek lab, ternyata kolesterol saya tinggi.',
      jawabanBerubah: {
        q_keluhan: 'Tidak ada keluhan dok. Tapi minggu lalu teman sekantor saya kena serangan jantung, saya jadi kepikiran bapak saya dulu — langsung saya cek lab sendiri, ternyata kolesterol saya tinggi.',
        q_makan: 'Hampir tiap hari dok, sarapan gorengan dekat kantor, makan siang sering bersantan, jeroan juga doyan.',
      },
      temuanBerubah: {
        umum: 'Habitus obesitas sentral, lingkar perut 104 cm. IMT 30.',
      },
    },
  ],
  mm_osteoartritis_lutut: [
    {
      id: 'kaku_singkat_berdiri_lama',
      vital: { td: '134/82', nadi: 88 },
      keluhanUtama: 'Dua lutut saya nyeri dok kalau kelamaan berdiri atau naik-turun tangga, yang kanan paling berat.',
      jawabanBerubah: {
        q_keluhan: 'Dua-duanya dok, lutut kanan paling berat. Paling terasa kalau kelamaan berdiri di dapur, bolak-balik naik-turun tangga jemuran, sama waktu bangkit dari jongkok. Kalau duduk istirahat ya mendingan.',
        q_kaku: 'Kaku cuma sebentar sekali dok, paling lima menit, digerak-gerakkan sedikit sudah lemas lagi.',
      },
      temuanBerubah: {
        umum: 'Obesitas (IMT 32). Cara jalan antalgik, menumpu lebih ke tungkai kiri menghindari pembebanan lutut kanan.',
      },
    },
    {
      id: 'kronik_sulit_jongkok',
      vital: { td: '148/88', nadi: 70, suhu: 36.8 },
      keluhanUtama: 'Hampir setahun ini lutut saya nyeri dok, sekarang susah sekali dipakai jongkok atau duduk bersila.',
      jawabanBerubah: {
        q_keluhan: 'Dua lutut dok, kanan paling parah. Kumatnya kalau jalan agak jauh, turun tangga, apalagi jongkok di kamar mandi atau duduk bersila di lantai — bangkitnya susah. Kalau istirahat nyerinya berkurang.',
        q_kaku: 'Kaku dok tiap bangun pagi, kira-kira dua puluh menitan, habis itu longgar sendiri kalau dibawa gerak.',
        q_bengkak: 'Kalau habis capek banyak jalan, lutut kanan kadang terasa agak penuh dok, tapi tidak pernah merah atau panas mendadak.',
      },
      temuanBerubah: {
        umum: 'Obesitas (IMT 31). Bangkit dari kursi periksa perlahan sambil menahan lutut kanan; jalan antalgik ringan.',
      },
    },
  ],
  mm_low_back_pain: [
    {
      id: 'nyeri_setelah_lembur_kardus',
      vital: { td: '118/76', nadi: 84, rr: 16, suhu: 36.7 },
      keluhanUtama: 'Punggung bawah saya kaku dan nyeri dok, sudah tiga hari, sejak lembur angkat-angkat kardus di gudang.',
      jawabanBerubah: {
        q_keluhan: 'Tiga hari lalu dok, pas lembur bongkar muatan saya angkat kardus terus-terusan. Sejak itu pinggang bawah kaku dan nyeri, paling berat kalau bangun dari duduk atau mau membungkuk.',
      },
      temuanBerubah: {
        ekstremitas: 'Spasme dan nyeri tekan otot paravertebral lumbal bilateral; ROM lumbal terbatas nyeri saat fleksi dan saat bangkit dari duduk. Straight Leg Raise negatif bilateral.',
        umum: 'Compos mentis, tidak demam, bangkit dari kursi perlahan sambil menumpu tangan ke paha, berjalan agak kaku menjaga pinggang.',
      },
    },
    {
      id: 'pegal_kanan_setelah_geser_lemari',
      vital: { td: '128/82', nadi: 72, rr: 18, suhu: 36.4 },
      keluhanUtama: 'Pinggang kanan saya pegal dan nyeri dok, hampir seminggu, sejak menggeser lemari waktu beres-beres rumah.',
      jawabanBerubah: {
        q_keluhan: 'Hampir seminggu lalu dok, waktu beres-beres rumah saya angkat dan geser-geser lemari sendirian. Sejak itu pinggang bawah sebelah kanan pegal dan nyeri, tambah berat kalau berdiri lama atau membungkuk, enakan kalau rebahan.',
        q_menjalar: 'Tidak dok, sakitnya ngumpul di pinggang kanan saja, tidak turun ke bokong apalagi sampai ke kaki.',
      },
      temuanBerubah: {
        ekstremitas: 'Nyeri tekan dan spasme otot paravertebral lumbal dengan sisi kanan lebih dominan; ROM lumbal terbatas nyeri saat fleksi dan lateral-fleksi ke kanan. Straight Leg Raise negatif bilateral.',
      },
    },
  ],
  mm_mialgia: [
    {
      id: 'pegal_pasca_badminton',
      vital: { td: '124/82', nadi: 88, rr: 16, suhu: 36.5 },
      keluhanUtama: 'Bahu, lengan, sama betis saya pegal nyeri semua dok, kemarin habis tanding badminton antar-RT.',
      jawabanBerubah: {
        q_keluhan: 'Ototnya dok — bahu, lengan atas, sama betis. Sendinya tidak sakit, dagingnya yang nyeri kalau digerakkan.',
        q_pemicu: 'Iya dok, kemarin saya ikut tanding badminton antar-RT dari sore sampai malam, padahal sudah lama sekali tidak olahraga.',
      },
    },
    {
      id: 'pegal_bantu_hajatan',
      vital: { td: '112/70', nadi: 68, suhu: 37 },
      keluhanUtama: 'Dua hari ini badan saya nyeri pegal semua dok, terutama bahu sama betis, habis bantu-bantu hajatan tetangga.',
      jawabanBerubah: {
        q_keluhan: 'Yang pegal ototnya dok — bahu, lengan, betis juga. Persendiannya tidak apa-apa, dagingnya saja yang sakit.',
        q_pemicu: 'Ada dok, dua hari lalu saya seharian bantu hajatan tetangga, angkat-angkat kursi, dandang besar, sama galon air.',
        q_tidur: 'Dua malam ini kurang nyenyak dok, badan pegal semua, mau miring saja terasa sakit.',
      },
    },
  ],
  mm_isk_bawah: [
    {
      id: 'afebris_nyeri_suprapubik',
      vital: { td: '108/70', nadi: 76, rr: 16, suhu: 36.8 },
      keluhanUtama: 'Perut bawah saya senut-senut tiap habis pipis dok, kencingnya perih dan keluarnya sedikit-sedikit terus.',
      jawabanBerubah: {
        q_keluhan: 'Perih waktu kencing dok, terus perut bawah ikut senut-senut tiap habis pipis. Keluarnya cuma sedikit-sedikit padahal rasanya pengin terus.',
        q_pinggang: 'Tidak dok, pinggang tidak sakit, demam juga tidak ada — badan rasanya biasa saja.',
        q_urin: 'Keruh dok kayak air cucian beras dan baunya tajam, tapi tidak ada merah-merahnya.',
        q_riwayat: 'Belum pernah dok, seumur-umur baru kali ini kena yang begini.',
      },
      temuanBerubah: {
        umum: 'Compos mentis, afebris (36.8), tampak tidak nyaman menahan nyeri perut bawah, tidak toksik.',
        abdomen: 'Nyeri tekan suprapubik (+) sedang, tanpa nyeri lepas atau defans; tidak ada massa, bising usus normal.',
      },
    },
    {
      id: 'urgensi_nokturia_pasca_perjalanan',
      vital: { td: '124/78', nadi: 92 },
      keluhanUtama: 'Dari kemarin kebelet pipis terus dok, semalam sampai lima kali bangun, tapi keluarnya sedikit dan ujungnya perih.',
      jawabanBerubah: {
        q_keluhan: 'Kebelet terus dok susah ditahan, semalam sampai lima kali bangun buat pipis, keluarnya sedikit-sedikit dan ujungnya perih.',
        q_frekuensi: 'Iya dok, baru keluar dari WC sudah pengin lagi, ditahan sebentar saja rasanya mau bocor.',
        q_kebiasaan: 'Dua hari kemarin saya perjalanan bus jauh dok, seharian nahan pipis, dan sengaja tidak banyak minum biar tidak bolak-balik berhenti.',
      },
      temuanBerubah: {
        abdomen: 'Nyeri tekan suprapubik ringan (+), kandung kemih tidak teraba penuh; tidak ada massa, bising usus normal.',
      },
    },
  ],
  kia_anc_kehamilan_normal: [
    {
      id: 'pindah_domisili_24_minggu',
      vital: { td: '120/80', nadi: 92, rr: 20, suhu: 36.9, spo2: 98 },
      keluhanUtama: 'Saya baru pindah ikut suami dok, mau lanjut periksa kehamilan pertama saya di sini.',
      jawabanBerubah: {
        q_keluhan: 'Kontrol rutin dok, cuma saya baru pindah ikut suami jadi lanjut periksanya di sini. Kandungan jalan enam bulan, alhamdulillah sehat.',
        q_hpht: 'HPHT-nya sekitar 24 minggu yang lalu dok, tercatat juga di buku KIA saya. Ini hamil pertama, belum pernah keguguran.',
        q_gerak: 'Sudah kuat gerakannya dok, paling terasa malam hari. Tidak ada keluar darah atau air sama sekali.',
        q_fe: 'Diminum kok dok, tapi biasanya saya barengkan teh manis pagi-pagi biar tidak eneg.',
        q_dukungan: 'Suami mendukung dok. Karena baru pindah, kami sedang cari bidan dekat rumah baru untuk rencana bersalinnya.',
      },
      temuanBerubah: {
        abdomen: 'TFU setinggi pusat (sesuai ~24 minggu). DJJ 136x/menit reguler. Tidak ada nyeri tekan.',
      },
    },
    {
      id: 'cemas_kiriman_kader',
      vital: { td: '100/70', nadi: 78, rr: 16, suhu: 36.4 },
      keluhanUtama: 'Saya disuruh bu kader periksa kehamilan dok, hamil pertama, jadi ingin memastikan kandungan saya baik-baik saja.',
      jawabanBerubah: {
        q_keluhan: 'Tidak ada keluhan dok, kandungan jalan lima bulan. Cuma bu kader Posyandu kemarin mengingatkan supaya periksa lengkap, jadi saya sekalian mau memastikan semuanya baik.',
        q_gerak: 'Baru dua minggu ini mulai terasa dok, seperti kedutan halus. Tidak ada keluar darah atau air.',
        q_bahaya: 'Tidak ada sama sekali dok — tidak pernah sakit kepala hebat, mata kabur, atau bengkak. Justru itu yang saya ingin pastikan.',
        q_fe: 'Sudah dikasih bu bidan dok, tapi jujur minumnya bolong-bolong, seminggu paling dua tiga kali kalau ingat.',
      },
      temuanBerubah: {
        abdomen: 'TFU 3 jari di bawah pusat (sesuai ~20 minggu). DJJ 152x/menit reguler. Tidak ada nyeri tekan.',
      },
    },
  ],
  jiwa_insomnia: [
    {
      id: 'terbangun_tengah_malam',
      vital: { td: '112/74', nadi: 88 },
      keluhanUtama: 'Tidur saya putus-putus dok, tengah malam kebangun terus dan susah tidur lagi.',
      jawabanBerubah: {
        q_keluhan: 'Kalau mulai tidur cepat dok, tapi jam satu-dua malam pasti kebangun, bisa dua-tiga kali — habis itu lama sekali baru bisa terlelap lagi.',
        q_durasi: 'Sudah hampir dua bulan dok, seminggu paling tidak lima malam begitu.',
        q_kebiasaan: 'Kopi sore masih sering dok, dan kalau kebangun tengah malam saya malah buka HP, scroll sampai lama.',
      },
      temuanBerubah: {
        umum: 'Compos mentis, tampak kurang segar dengan lingkaran gelap di bawah mata. Afek dalam batas normal, tidak ada tanda depresi/psikotik.',
      },
    },
    {
      id: 'ngantuk_siang_stres_usaha',
      vital: { td: '128/82', nadi: 72, suhu: 36.8 },
      keluhanUtama: 'Badan saya lemas dan ngantuk terus dok siangnya — malamnya susah sekali mulai tidur, sering baru terlelap jam tiga pagi.',
      jawabanBerubah: {
        q_keluhan: 'Susah mulai tidurnya dok. Lampu sudah saya matikan dari jam sepuluh, tapi pikiran muter terus — sering baru terlelap jam tiga pagi.',
        q_durasi: 'Kira-kira sudah tiga bulan dok, hampir tiap malam. Seminggu paling cuma satu-dua malam yang bisa tidur cepat.',
        q_mood: 'Sedih terus sih tidak dok, semangat juga masih ada. Cuma kepikiran terus soal warung saya yang lagi sepi.',
        q_kebiasaan: 'Kalau malam kelamaan nonton TV dok, dan biasa minum teh kental sehabis maghrib. Tidur siang jarang.',
        q_zat: 'Alkohol dan rokok tidak dok. Kopi jarang, tapi teh kental hampir tiap sore — minuman berenergi atau obat-obatan tidak pernah.',
      },
      temuanBerubah: {
        umum: 'Compos mentis, tampak letih dan beberapa kali menguap selama wawancara. Afek dalam batas normal, tidak ada tanda depresi/psikotik.',
      },
    },
  ],
  lab_influenza_tanpa_komplikasi: [
    {
      id: 'demam_hari_ketiga_klaster_serumah',
      vital: { td: '122/78', nadi: 98, suhu: 38.4 },
      keluhanUtama: 'Sudah tiga hari saya demam naik-turun, badan ngilu semua, tenggorokan perih, dan batuk kering terus, Dok.',
      jawabanBerubah: {
        q_keluhan: 'Tiga hari lalu mendadak demam dan menggigil, badan ngilu semua, kepala berat; sekarang tenggorokan perih dan batuk kering, pileknya cuma sedikit.',
        q_lama: 'Sudah tiga hari, Dok. Demamnya naik-turun tapi tidak makin parah, makan dan minum masih masuk.',
        q_kontak: 'Ada, Dok. Dua orang serumah saya juga mulai demam dan batuk-pilek minggu ini.',
      },
      temuanBerubah: {
        tht_mulut: 'Faring hiperemis tanpa eksudat, tonsil T1-T1 tenang; mukosa hidung sedikit hiperemis, sekret jernih minimal.',
      },
    },
    {
      id: 'demam_tinggi_menggigil_dominan',
      vital: { td: '110/70', nadi: 100, suhu: 38.7 },
      keluhanUtama: 'Sejak kemarin sore badan saya mendadak panas tinggi sampai menggigil, kepala cekot-cekot, badan ngilu, dan hidung tersumbat, Dok.',
      jawabanBerubah: {
        q_keluhan: 'Kemarin sore tiba-tiba panas tinggi sampai menggigil minta selimut, kepala cekot-cekot, otot paha dan punggung ngilu, hidung tersumbat, dan mulai batuk kering.',
      },
      temuanBerubah: {
        umum: 'Tampak lelah, sesekali menggigil, tidak toksik, hidrasi baik.',
        tht_mulut: 'Mukosa hidung edema dan hiperemis dengan sekret jernih sedikit; faring hiperemis ringan.',
      },
    },
  ],
  lab_stomatitis_aftosa: [
    {
      id: 'dua_ulkus_pipi_tergigit',
      vital: { td: '124/80', nadi: 84, suhu: 36.6 },
      keluhanUtama: 'Ada dua sariawan perih di pipi kanan bagian dalam sejak tiga hari.',
      jawabanBerubah: {
        q_keluhan: 'Ada dua luka bulat kecil berdampingan di pipi kanan bagian dalam, Dok, sejak tiga hari. Perihnya terasa sekali kalau kena makanan pedas atau panas.',
      },
      temuanBerubah: {
        tht_mulut: 'Dua ulkus bulat dangkal 3-4 mm berdampingan pada mukosa bukal kanan setinggi garis oklusi, dasar putih-kekuningan dengan halo eritema; tidak ada indurasi atau vesikel.',
      },
    },
    {
      id: 'kambuh_stres_bawah_lidah',
      vital: { td: '112/72', nadi: 80, suhu: 36.5 },
      keluhanUtama: 'Sariawan di bawah lidah perih sejak dua hari, sudah tiga kali kambuh dalam dua bulan ini.',
      jawabanBerubah: {
        q_keluhan: 'Satu luka bulat kecil di bawah lidah, Dok, baru dua hari ini. Tapi dua bulan ini sudah tiga kali kambuh begini; perih sekali kalau kena makanan asin atau saat sikat gigi.',
        q_trauma: 'Tidak ada, Dok. Tidak tergigit dan tidak pakai kawat gigi. Munculnya justru pas saya lagi banyak pikiran dan kurang tidur.',
        q_dist_panas_dalam: 'Minum saya cukup banyak kok, Dok. Kata orang memang panas dalam, tapi saya perhatikan sariawannya kambuh tiap saya kecapekan dan kurang tidur, bukan karena kurang minum.',
      },
      temuanBerubah: {
        tht_mulut: 'Ulkus soliter bulat dangkal 5 mm pada mukosa ventral lidah, dasar putih-kekuningan dengan halo eritema; tepi rata, tidak ada indurasi.',
      },
    },
  ],
  lab_mata_kering: [
    {
      id: 'berpasir_kasir_toko_ac',
      vital: { td: '124/78', nadi: 82 },
      keluhanUtama: 'Dua mata saya terasa berpasir dan cepat lelah kalau seharian menjaga kasir sambil menatap layar komputernya, Dok.',
      jawabanBerubah: {
        q_keluhan: 'Kurang lebih sebulan ini, Dok. Paling berat sore hari setelah seharian menatap layar komputer kasir di toko yang ber-AC dingin; kalau sudah di luar toko pelan-pelan mendingan.',
        q_dist_kabur_layar: 'Tidak berbayang, Dok. Angka di layar kasir masih jelas; yang mengganggu ya rasa berpasir dan cepat lelahnya itu.',
      },
      temuanBerubah: {
        mata: 'Visus baik; tear meniscus tampak tipis, break-up time air mata memendek, injeksi konjungtiva ringan pada kedua mata, kornea jernih tanpa defek epitel.',
      },
    },
    {
      id: 'berpasir_lembur_laporan',
      vital: { td: '114/72', nadi: 72 },
      keluhanUtama: 'Kedua mata saya berasa berpasir dan gampang capek tiap lembur mengetik laporan di laptop, Dok.',
      jawabanBerubah: {
        q_keluhan: 'Sekitar dua bulan, Dok. Makin terasa malam hari kalau lembur mengetik laporan di ruangan kerja ber-AC; kalau libur dan tidak pegang laptop, keluhannya jauh berkurang.',
        q_dist_kabur_layar: 'Tidak, Dok. Huruf di laptop masih tajam kok; keluhannya cuma rasa berpasir dan cepat capeknya saja.',
      },
      temuanBerubah: {
        mata: 'Visus baik; tear meniscus berkurang dengan pola break-up air mata yang cepat, hiperemia konjungtiva ringan di kedua mata, kornea jernih.',
      },
    },
  ],
  lab_hipermetropia: [
    {
      id: 'astenopia_layar_hp',
      vital: { td: '112/70', nadi: 84 },
      keluhanUtama: 'Dahi cepat pegal dan mata lelah kalau lama menatap layar HP dari dekat.',
      jawabanBerubah: {
        q_keluhan: 'Paling terasa kalau lama menatap layar HP dekat-dekat atau menulis, Dok; dahi sampai pegal dan mata cepat lelah. Melihat jauh masih jelas.',
        q_fungsi: 'Melihat layar HP lama dan menulis jadi cepat bikin kepala pegal, Dok; sering saya berhenti dulu sebentar.',
      },
      temuanBerubah: {
        mata: 'Visus jauh normal; visus dekat menurun dan membaik dengan koreksi sferis plus. Segmen anterior tenang.',
      },
    },
    {
      id: 'kabur_dekat_hilang_timbul',
      vital: { td: '108/72', nadi: 80 },
      keluhanUtama: 'Tulisan makin kabur kalau membaca lama, lama-lama kepala ikut pusing.',
      jawabanBerubah: {
        q_keluhan: 'Awal membaca masih jelas, Dok, tapi makin lama tulisan makin kabur dan kepala ikut pusing. Kalau mata diistirahatkan sebentar, jelas lagi; melihat jauh tidak masalah.',
        q_fungsi: 'Membaca lama tidak tahan, Dok; harus sering berhenti supaya tulisan jelas lagi, jadi semuanya lebih lambat.',
        q_dist_baca_gelap: 'Tidak, Dok, saya biasa membaca di tempat terang. Tetap saja lama-lama kabur.',
      },
      temuanBerubah: {
        mata: 'Visus dekat menurun, terkoreksi dengan lensa sferis plus; visus jauh dalam batas normal, segmen anterior dan media refraksi jernih.',
      },
    },
  ],
  lab_miopia_ringan: [
    {
      id: 'sulit_kenali_wajah_jauh',
      vital: { td: '112/70', nadi: 84 },
      keluhanUtama: 'Wajah orang dari kejauhan tampak buram, tetapi membaca dekat tetap jelas.',
      jawabanBerubah: {
        q_keluhan: 'Paling terasa kalau melihat jauh, Dok — wajah teman di seberang jalan baru kelihatan jelas kalau saya menyipitkan mata. Membaca dekat tidak ada masalah. Sudah hampir setahun ini, pelan-pelan makin terasa.',
        q_fungsi: 'Menyapa orang dari jauh sering salah karena wajahnya buram, Dok; kalau membaca atau menulis dekat lancar saja.',
      },
      temuanBerubah: {
        mata: 'Visus jauh 6/12 pada kedua mata, membaik menjadi 6/6 dengan pinhole dan lensa sferis minus ringan; segmen mata lainnya normal.',
      },
    },
    {
      id: 'salah_baca_angkot_jauh',
      vital: { td: '118/74', nadi: 72, suhu: 36.6 },
      keluhanUtama: 'Nomor angkot dan tulisan di jalan baru terbaca kalau sudah dekat sekali.',
      jawabanBerubah: {
        q_keluhan: 'Paling terasa di jalan, Dok — nomor angkot atau papan nama toko dari jauh buram, harus menunggu dekat dulu baru terbaca. Membaca buku di tangan tetap jelas. Munculnya pelan-pelan beberapa bulan terakhir.',
        q_kacamata: 'Belum pernah pakai kacamata, Dok, dan buramnya tidak berubah cepat — bertambahnya pelan sekali.',
        q_fungsi: 'Bepergian jadi repot karena tulisan dan nomor kendaraan dari jauh tidak terbaca, Dok; kalau membaca dekat masih enak.',
      },
      temuanBerubah: {
        mata: 'Visus jauh 6/9 pada kedua mata, membaik menjadi 6/6 dengan pinhole dan koreksi lensa sferis minus kecil; segmen anterior dan posterior dalam batas normal.',
      },
    },
  ],
  lab_astigmatisme_ringan: [
    {
      id: 'lampu_malam_berbayang',
      vital: { td: '110/70', nadi: 88, rr: 20, suhu: 36.7 },
      keluhanUtama: 'Lampu kendaraan saat malam tampak pecah berbayang dan mata cepat lelah bila membaca.',
      jawabanBerubah: {
        q_keluhan: 'Paling terasa malam hari, Dok — lampu kendaraan dan lampu jalan tampak pecah seperti berekor dan berbayang. Kalau lama membaca, tulisan juga ikut berbayang dan kepala jadi pegal.',
        q_fungsi: 'Bepergian malam hari jadi kurang nyaman karena lampu tampak pecah, dan membaca lama membuat mata cepat lelah.',
      },
    },
    {
      id: 'huruf_dobel_makin_sore',
      vital: { td: '114/72', nadi: 70, rr: 16, suhu: 36.3 },
      keluhanUtama: 'Huruf di layar tampak dobel tipis dan mata terasa tegang, makin berat menjelang sore.',
      jawabanBerubah: {
        q_keluhan: 'Makin sore makin terasa, Dok. Huruf di layar HP tampak dobel tipis, menonton TV dari jauh pun kadang berbayang, dan mata rasanya tegang.',
        q_fungsi: 'Membaca di layar jadi lambat karena saya sering berhenti dan memicingkan mata supaya hurufnya lebih jelas.',
      },
      temuanBerubah: {
        mata: 'Pasien tampak memicingkan mata saat uji visus; visus membaik sebagian dengan pinhole dan terkoreksi dengan lensa silinder; kornea jernih.',
      },
    },
  ],
  lab_presbiopia: [
    {
      id: 'baca_hp_lampu_redup',
      vital: { td: '128/82', nadi: 84, suhu: 36.7, spo2: 98 },
      keluhanUtama: 'Susah membaca tulisan di HP dan mata cepat pegal, apalagi kalau lampu redup.',
      jawabanBerubah: {
        q_keluhan: 'Paling terasa kalau membaca dekat, Dok — pesan di HP atau tulisan di bungkus obat harus saya jauhkan atau besarkan hurufnya. Kira-kira setahun ini pelan-pelan makin susah, apalagi malam kalau lampu redup; melihat jauh masih jelas.',
        q_fungsi: 'Membalas pesan di HP dan membaca label bumbu di dapur jadi lama, Dok. Sekarang saya harus cari tempat terang dulu kalau mau membaca.',
        q_dist_katarak: 'Tidak, Dok. Tidak berkabut dan tidak silau; melihat jauh malam hari masih jernih. Yang susah cuma huruf kecil dari dekat, apalagi kalau kurang terang.',
      },
      temuanBerubah: {
        mata: 'Visus jauh 6/6 kedua mata; membaca kartu dekat lambat pada jarak baca biasa dan membaik dengan adisi lensa plus sesuai usia; media refraksi jernih.',
      },
    },
    {
      id: 'sulit_memasukkan_benang_jarum',
      vital: { td: '112/70', nadi: 68, rr: 16, suhu: 36.4 },
      keluhanUtama: 'Susah memasukkan benang ke jarum, koran juga harus dijauhkan sampai tangan lurus.',
      jawabanBerubah: {
        q_keluhan: 'Waktu kerja dekat, Dok — memasukkan benang ke jarum hampir selalu gagal, dan koran harus saya jauhkan sampai tangan lurus baru terbaca. Sekitar delapan bulan ini makin lama makin susah, tapi melihat jauh tidak ada masalah.',
        q_kacamata: 'Belum pernah punya kacamata sendiri, Dok, dan tidak ada perubahan yang tiba-tiba. Waktu iseng mencoba kacamata baca murah di pasar, tulisan memang jadi lebih jelas, tapi saya belum pernah diperiksa resmi.',
        q_fungsi: 'Menjahit jadi lama sekali dan mata cepat lelah, Dok; membaca koran atau catatan belanja juga harus dijauhkan dulu baru terbaca.',
      },
      temuanBerubah: {
        mata: 'Visus jauh normal tanpa koreksi pada kedua mata; titik dekat mundur dari jarak baca normal dan membaik nyata dengan uji adisi lensa plus; segmen anterior tenang.',
      },
    },
  ],
  lab_pitiriasis_versikolor: [
    {
      id: 'bercak_kecokelatan',
      keluhanUtama: 'Muncul bercak kecokelatan bersisik halus di punggung dan dada saya.',
      jawabanBerubah: {
        q_keluhan: 'Sudah sekitar dua bulan, Dok. Warnanya kecokelatan dan makin banyak kalau saya sering berkeringat.',
        q_kambuh: 'Iya pernah kambuh, Dok, apalagi saya kerja seharian di tempat yang panas.',
      },
      temuanBerubah: {
        kulit: 'Makula hiperpigmentasi kecokelatan multipel dengan fine scale (skuama halus) di dada dan punggung; sensasi utuh.',
      },
    },
    {
      id: 'pasca_berjemur_pantai',
      vital: { td: '114/72', nadi: 62 },
      keluhanUtama: 'Sepulang dari pantai, punggung dan dada saya belang putih dan bersisik halus.',
      jawabanBerubah: {
        q_keluhan: 'Baru sekitar tiga minggu ini, Dok. Bercaknya makin kelihatan putih setelah kulit sekitarnya jadi cokelat karena berjemur di pantai.',
        q_kambuh: 'Ini baru pertama kali, Dok, tapi saya memang gampang berkeringat karena rutin olahraga.',
      },
      temuanBerubah: {
        kulit: 'Makula hipopigmentasi multipel dengan fine scale di punggung dan dada, tampak lebih kontras terhadap kulit yang tersamak matahari; sensasi utuh.',
      },
    },
  ],
  lab_reaksi_gigitan_serangga: [
    {
      id: 'semut_merah_tungkai_pagi',
      vital: { td: '118/76', nadi: 86, rr: 16, suhu: 36.9, spo2: 98 },
      keluhanUtama: 'Kaki saya bentol gatal setelah digigit semut merah di pekarangan.',
      jawabanBerubah: {
        q_keluhan: 'Tadi pagi waktu mencabuti rumput di pekarangan kaki saya digigit semut merah, lalu muncul dua bentol yang gatal sekali di betis kanan.',
        q_dist_bentol_pindah: 'Tidak, bentolnya menetap di kaki kanan itu saja sejak tadi pagi, tidak pindah-pindah.',
      },
      temuanBerubah: {
        kulit: 'Dua papul urtikarial dengan punctum sentral pada tungkai bawah kanan, edema lokal kecil, tanpa selulitis.',
      },
    },
    {
      id: 'nyamuk_malam_leher_tangan',
      vital: { td: '124/80', nadi: 72, suhu: 36.5 },
      keluhanUtama: 'Leher dan punggung tangan saya bentol gatal setelah digigit nyamuk dua malam lalu.',
      jawabanBerubah: {
        q_keluhan: 'Dua malam lalu saya ketiduran di ruang tengah tanpa kelambu, nyamuknya banyak sekali; paginya muncul empat bentol gatal di leher kiri dan punggung tangan kiri, sampai sekarang masih gatal.',
        q_dist_bentol_pindah: 'Tidak, bentolnya tetap di leher dan tangan yang sama sejak dua malam lalu, tidak hilang sendiri dalam beberapa jam.',
      },
      temuanBerubah: {
        kulit: 'Empat papul urtikarial dengan punctum sentral pada sisi leher kiri dan punggung tangan kiri, edema lokal kecil, tanpa selulitis.',
      },
    },
  ],
  lab_dermatitis_kontak_iritan_tangan: [
    {
      id: 'pencuci_piring_warung_telapak',
      vital: { td: '112/74', nadi: 88, rr: 20, suhu: 36.5, spo2: 98 },
      keluhanUtama: 'Telapak dan jari kedua tangan saya kering, gatal, dan pecah-pecah sejak sering mencuci piring dengan air deterjen di warung.',
      jawabanBerubah: {
        q_keluhan: 'Baru sekitar tiga minggu ini, Dok. Tiap hari saya mencuci piring pakai air deterjen di warung tanpa sarung tangan; makin gatal dan pecah-pecah kalau warung ramai, dan agak membaik waktu warung tutup dua hari.',
        q_alergi: 'Tidak, cuma di telapak dan jari kedua tangan yang kena air cucian; badan dan wajah tidak ada apa-apa.',
        q_obat: 'Belum pakai krim apa-apa, paling saya olesi minyak kelapa kalau terasa kering sekali.',
      },
      temuanBerubah: {
        kulit: 'Eritema, xerosis, dan fisura dangkal pada telapak dan ujung jari kedua tangan sesuai area kontak; tanpa vesikel, tanpa pus.',
      },
    },
    {
      id: 'petugas_kebersihan_kambuh_pasca_cuti',
      vital: { td: '124/80', nadi: 68, suhu: 36.8 },
      keluhanUtama: 'Punggung kedua tangan saya merah, kering, dan perih sejak tiap hari mencuci dan memeras lap pakai air deterjen.',
      jawabanBerubah: {
        q_keluhan: 'Sudah hampir dua bulan, Dok. Saya petugas kebersihan kantor, tiap hari merendam dan memeras lap pakai air deterjen tanpa sarung tangan. Waktu cuti seminggu sempat membaik, begitu mulai kerja lagi kambuh.',
        q_alergi: 'Tidak, hanya di punggung kedua tangan yang sering kena air deterjen; tidak menyebar ke mana-mana.',
        q_obat: 'Pernah beli pelembap di apotek, tapi dipakainya cuma kalau ingat.',
      },
      temuanBerubah: {
        kulit: 'Eritema dengan xerosis, skuama, dan fisura dangkal pada punggung tangan hingga pergelangan kedua sisi sesuai area terpapar; tanpa pus.',
      },
    },
  ],
  lab_dermatitis_atopik_ringan: [
    {
      id: 'kumat_gerah_berkeringat',
      vital: { td: '118/76', nadi: 88, suhu: 36.9 },
      keluhanUtama: 'Lipatan lutut dan siku saya gatal kumat-kumatan dari kecil, tambah parah kalau gerah dan berkeringat.',
      jawabanBerubah: {
        q_keluhan: 'Dari kecil hilang-timbul, Dok. Kumatnya kalau cuaca gerah dan banyak keringat, misalnya habis olahraga atau main di luar; paling terasa di lipatan lutut, lipatan siku juga ikut gatal.',
        q_atopi: 'Asma tidak ada. Ayah saya rinitis alergi, dan kata ibu waktu saya bayi pipi saya sering merah dan gatal seperti ini.',
        q_perawatan: 'Sabunnya sabun antiseptik biar badan kesat, dan pelembap tidak pernah pakai.',
      },
      temuanBerubah: {
        kulit: 'Plak eksematosa tipis simetris, fossa poplitea lebih menonjol daripada kubiti, dengan xerosis dan ekskoriasi bekas garukan; tanpa madidans, krusta madu, atau tanda infeksi sekunder.',
      },
    },
    {
      id: 'kumat_terpapar_debu',
      vital: { td: '112/70', nadi: 80, suhu: 36.5 },
      keluhanUtama: 'Gatal kambuhan di lipatan siku dan belakang lutut, seminggu ini kumat lagi.',
      jawabanBerubah: {
        q_keluhan: 'Kambuh-kambuhan sejak balita, Dok. Seminggu ini kumat lagi, biasanya kalau kena debu waktu kamar disapu atau ganti sprei; paling gatal di lipatan siku, belakang lutut juga kena.',
        q_perawatan: 'Sabun batang yang wangi, mandinya biasa saja; pelembap tidak pakai sama sekali.',
      },
      temuanBerubah: {
        kulit: 'Plak eksematosa simetris di fossa kubiti dan poplitea, sisi kubiti lebih dominan, kulit sekitar xerotik difus dengan ekskoriasi ringan; tanpa krusta madu, pustul, atau vesikel.',
      },
    },
  ],
  lab_dermatitis_popok_iritan: [
    {
      id: 'popok_lama_perjalanan_jauh',
      vital: { nadi: 134, rr: 34, suhu: 37, spo2: 98 },
      keluhanUtama: 'Kulit bayi merah di area popok setelah dua hari perjalanan jauh.',
      jawabanBerubah: {
        q_keluhan: 'Muncul dua hari ini, Dok, pas kami perjalanan jauh dan popoknya lama tidak diganti. Yang merah bagian yang menonjol; lipatan pahanya masih bersih.',
        q_perawatan: 'Selama di perjalanan popoknya bisa lima-enam jam baru diganti, dan bersihkannya cuma pakai tisu basah berpewangi.',
      },
      temuanBerubah: {
        kulit: 'Eritema merata pada permukaan cembung bokong dan pubis yang kontak popok; lipatan inguinal relatif bersih, tanpa erosi maupun pustul satelit.',
      },
    },
    {
      id: 'sabun_dewasa_popok_semalaman',
      vital: { nadi: 112, rr: 30, suhu: 36.5, spo2: 100 },
      keluhanUtama: 'Kulit bayi merah di area popok padahal rajin saya sabuni tiap ganti.',
      jawabanBerubah: {
        q_keluhan: 'Sudah lima hari, Dok, makin lama makin merah. Yang kena bagian menonjol yang tertutup popok; lipatan pahanya tidak ikut.',
        q_perawatan: 'Kalau siang diganti saat sudah penuh, tapi malam ya semalaman baru pagi diganti; tiap ganti saya gosok pakai sabun mandi dewasa supaya bersih.',
      },
      temuanBerubah: {
        kulit: 'Eritema mengilap (glazed) dengan skuama halus terbatas pada area cembung tertutup popok; lipatan inguinal spared, tanpa erosi maupun pustul satelit.',
      },
    },
  ],
  lab_dermatitis_seboroik_dewasa: [
    {
      id: 'kambuh_begadang_belakang_telinga',
      vital: { td: '112/74', nadi: 68, suhu: 36.4, spo2: 98 },
      keluhanUtama: 'Kulit kepala, belakang telinga, dan sisi hidung bersisik berminyak, gatalnya kumat-kumatan.',
      jawabanBerubah: {
        q_keluhan: 'Hilang-timbul sudah sekitar dua tahun di kulit kepala, belakang telinga, dan samping hidung; paling kumat kalau saya begadang dan kecapekan.',
      },
      temuanBerubah: {
        kulit: 'Skuama kekuningan berminyak pada scalp, sulkus retroaurikular, dan lipatan nasolabial dengan eritem ringan; tanpa pustul, erosi, atau krusta.',
      },
    },
    {
      id: 'pemicu_udara_dingin_dada',
      vital: { td: '126/82', nadi: 88, suhu: 36.9 },
      keluhanUtama: 'Kulit kepala, sisi hidung, dan dada bersisik berminyak dan gatal saat udara dingin.',
      jawabanBerubah: {
        q_keluhan: 'Sudah sekitar lima tahun kumat-kumatan di kulit kepala, samping hidung, kadang sampai dada; biasanya memburuk saat udara dingin, mereda sendiri, lalu balik lagi.',
        q_produk: 'Hanya sampo biasa; saya tidak pakai gel atau minyak rambut.',
      },
      temuanBerubah: {
        kulit: 'Skuama kekuningan berminyak di scalp, alis, lipatan nasolabial, dan area presternal dengan eritem ringan; tanpa plak tebal berbatas tegas berskuama keperakan.',
      },
    },
  ],
  lab_akne_vulgaris_ringan: [
    {
      id: 'komedonal_dahi_garis_rambut',
      vital: { td: '112/72', nadi: 88, suhu: 36.5 },
      keluhanUtama: 'Dahi saya sampai dekat garis rambut penuh bruntusan komedo sejak tiga bulan terakhir.',
      jawabanBerubah: {
        q_keluhan: 'Sejak tiga bulan terakhir, kebanyakan komedo kecil-kecil di dahi sampai dekat garis rambut, ada beberapa bintil merah; tidak ada benjolan dalam atau bekas cekung.',
        q_obat: 'Hampir tiap hari saya pakai pomade rambut yang berminyak; steroid atau suplemen tidak ada.',
      },
      temuanBerubah: {
        kulit: 'Komedo terbuka dan tertutup dominan di dahi hingga batas garis rambut, disertai sedikit papul eritem kecil; tanpa pustul, nodul, kista, atau jaringan parut.',
      },
    },
    {
      id: 'hilang_timbul_pipi_dagu',
      vital: { td: '124/80', nadi: 68, suhu: 36.9 },
      keluhanUtama: 'Pipi dan dagu saya sering bruntusan komedo dan jerawat kecil, hilang timbul hampir setahun.',
      jawabanBerubah: {
        q_keluhan: 'Hampir setahun hilang timbul, paling banyak komedo di pipi dan dagu, kadang ada bintil merah kecil bernanah di ujungnya, tapi tidak pernah ada benjolan dalam atau bekas cekung.',
        q_obat: 'Tidak minum obat atau suplemen; sebulan ini saya pakai pelembap wajah yang kental dan berminyak, steroid tidak pernah.',
        q_psikososial: 'Kadang malu kalau difoto teman, tapi kegiatan sehari-hari tetap jalan.',
      },
      temuanBerubah: {
        kulit: 'Komedo tertutup dominan di pipi dan dagu disertai beberapa papul-pustul kecil superfisial; tanpa nodul, kista, atau jaringan parut.',
      },
    },
  ],
  lab_miliaria_rubra: [
    {
      id: 'pemicu_olahraga_baju_ketat',
      vital: { td: '124/80', nadi: 86, suhu: 36.9 },
      keluhanUtama: 'Dada dan punggung muncul bintil merah perih setiap habis olahraga.',
      jawabanBerubah: {
        q_keluhan: 'Muncul kira-kira seminggu ini, setiap habis olahraga sore badan banyak keringat; bintilnya paling banyak di bagian yang tertutup baju.',
        q_oklusi: 'Iya, baju olahraga saya ketat dan bahannya tidak menyerap keringat, sering juga tidak langsung ganti setelah selesai.',
      },
      temuanBerubah: {
        kulit: 'Papul-vesikel eritem kecil nonfolikular tersebar di dada dan punggung, dominan pada area oklusi pakaian, tanpa pustul.',
      },
    },
    {
      id: 'oklusi_krim_berminyak_kemarau',
      vital: { td: '112/72', nadi: 72, rr: 16, suhu: 36.5, spo2: 98 },
      keluhanUtama: 'Leher dan dada muncul bintil merah perih sejak musim kemarau ini.',
      jawabanBerubah: {
        q_keluhan: 'Sudah hampir dua minggu sejak kemarau panas terik; makin banyak kalau berkeringat, apalagi saya rutin memakai krim badan yang tebal dan berminyak.',
        q_oklusi: 'Pakaian saya longgar biasa saja, tapi setiap habis mandi saya membalurkan krim badan tebal yang berminyak.',
      },
      temuanBerubah: {
        kulit: 'Papul-vesikel eritem kecil nonfolikular di leher dan dada atas, terutama pada area yang rutin dibaluri krim berminyak, tanpa pustul.',
      },
    },
  ],
  lab_vulnus_laseratum_lengan: [
    {
      id: 'tersayat_cutter_kardus',
      vital: { td: '126/82', nadi: 88, suhu: 36.5 },
      keluhanUtama: 'Lengan kiri saya tersayat cutter dua jam lalu.',
      jawabanBerubah: {
        q_keluhan: 'Cutter-nya meleset waktu saya membuka kardus paket, kena lengan kiri. Langsung saya tekan pakai kain bersih, darahnya sudah berhenti.',
        q_kontaminasi: 'Tidak ada; mata cutter-nya bersih dan utuh, tidak ada yang patah atau tertinggal di luka.',
        q_tetanus: 'Saya benar-benar tidak ingat; rasanya belum pernah disuntik tetanus lagi sejak kecil.',
      },
      temuanBerubah: {
        ekstremitas: 'Laserasi linear 4 cm di sisi luar lengan bawah kiri, tepi rata, subkutis dangkal, bersih; tendon, saraf, dan pembuluh utuh.',
      },
    },
    {
      id: 'teriris_pisau_dapur',
      vital: { td: '118/74', nadi: 92, rr: 20, suhu: 36.9 },
      keluhanUtama: 'Lengan kanan saya teriris pisau dapur setengah jam lalu.',
      jawabanBerubah: {
        q_keluhan: 'Pisau dapur meleset waktu saya memotong sayur dan mengenai lengan kanan. Langsung saya bilas dengan air mengalir lalu ditekan handuk; sekarang tinggal merembes sedikit.',
        q_kontaminasi: 'Tidak; pisaunya bersih dan tidak ada apa pun yang tertinggal di luka.',
        q_tetanus: 'Sudah lama sekali, pokoknya lebih dari sepuluh tahun yang lalu.',
      },
      temuanBerubah: {
        ekstremitas: 'Laserasi linear 5 cm di lengan bawah kanan, tepi rata, subkutis dangkal, bersih; rembesan darah minimal berhenti dengan penekanan; tendon, saraf, dan pembuluh utuh.',
      },
    },
  ],
  lab_katarak_matur: [
    {
      id: 'manik_putih_disadari_keluarga',
      vital: { td: '128/76', nadi: 84, suhu: 36.8 },
      keluhanUtama: 'Anak saya kaget lihat tengah mata saya memutih seperti kelereng susu, Dok, jadi saya dipaksa periksa. Penglihatan memang sudah lama berkabut, wajah orang di depan saya saja sudah tidak kenal.',
      jawabanBerubah: {
        q_keluhan: 'Berubahnya pelan-pelan, Dok, sudah bertahun-tahun, dari kabut tipis jadi putih tebal. Saya sendiri sudah pasrah; ini anak saya yang memaksa ke sini karena katanya tengah mata saya kelihatan putih seperti kelereng susu.',
      },
      temuanBerubah: {
        mata: 'Pupil kedua mata putih susu, tampak jelas bahkan dari jarak bicara, kanan lebih padat; refleks fundus hilang sehingga dasar mata tidak dapat dinilai. Mata tenang, tidak merah, bola mata teraba lunak normal.',
      },
    },
    {
      id: 'lima_tahun_berhenti_mengaji',
      vital: { td: '134/78', nadi: 72, rr: 16, suhu: 36.5 },
      keluhanUtama: 'Mata saya makin lama makin tertutup kabut putih, Dok. Mengaji dan baca koran sudah tidak bisa, turun undakan rumah saja sekarang harus dituntun anak.',
      jawabanBerubah: {
        q_keluhan: 'Sudah lima tahun lebih, Dok, pelannya bukan main. Mulanya cuma seperti ada selaput tipis, sekarang seperti kabut putih tebal yang tidak mau hilang, dikucek pun tetap.',
        q_silau: 'Silau sekali, Dok. Sore-sore kena matahari dari barat itu perih silaunya, dan kalau malam papasan lampu mobil rasanya putih semua, jadi saya tidak berani keluar malam.',
        q_second_sight: 'Iya, ada masa aneh itu, Dok. Kira-kira setahun lalu saya sempat beberapa bulan bisa baca tulisan di bungkus obat tanpa kacamata, saya kira mata saya sembuh. Habis itu malah makin putih berkabut sampai sekarang.',
        q_tetes_warung: 'Macam-macam sudah saya coba, Dok. Tetes mata dari penjual keliling yang katanya bisa merontokkan katarak, kapsul herbal kiriman anak juga saya minum bertahun-tahun. Tidak ada perubahan sama sekali.',
        q_aktivitas: 'Membaca sudah tidak bisa sama sekali, mengaji pun berhenti. Orang datang baru saya kenali setelah dia bersuara. Turun undakan atau ke kamar mandi malam hari harus dituntun.',
      },
      temuanBerubah: {
        umum: 'Lansia datang dituntun anaknya, meraba-raba tepi meja sebelum duduk; keadaan umum baik, tidak tampak sakit.',
      },
    },
  ],
  diare_akut_bayi_dehidrasi_berat: [
    {
      id: 'perburukan_cepat_semalam',
      vital: { td: '72/44', nadi: 178, rr: 46, suhu: 37.4 },
      keluhanUtama: 'Dok, bayi saya semalaman mencret terus-menerus, sekarang lemas sekali dan hampir tidak mau menyusu.',
      jawabanBerubah: {
        nb_keluhan: 'Sejak tadi malam BAB-nya cair terus-menerus dan muntah beberapa kali, Dok. Menjelang pagi badannya lemas dan lebih banyak memejamkan mata.',
        nb_frekuensi: 'Semalaman sampai pagi ini saya hitung lebih dari sepuluh kali BAB cair, muntahnya tiga kali.',
        nb_kencing: 'Popok terakhir basah sekitar tengah malam, Dok. Setelah itu sampai sekarang kering terus.',
        nb_asupan: 'Tidak ada, Dok. Bayi saya masih ASI saja, belum pernah saya beri makanan atau minuman lain.',
      },
      temuanBerubah: {
        kepala_leher: 'Kedua mata cekung dalam; fontanel anterior cekung; bibir dan mukosa mulut kering sekali.',
        kulit: 'Cubitan kulit abdomen kembali sangat lambat, sekitar 3 detik; akral dingin; CRT 3 detik.',
      },
    },
    {
      id: 'dua_hari_memberat_susu_formula',
      vital: { td: '74/42', nadi: 166, rr: 40, suhu: 38.1 },
      keluhanUtama: 'Bayi saya mencret sudah dua hari, Dok. Hari ini makin sering, badannya lemas dan hampir tidak mau minum susu.',
      jawabanBerubah: {
        nb_keluhan: 'Dua hari lalu mulai BAB cair dan sesekali muntah. Hari ini makin sering, badannya lemas sekali dan lebih banyak tidur.',
        nb_frekuensi: 'Hari pertama tiga sampai empat kali, kemarin enam kali, hari ini sudah tujuh kali BAB cair. Muntahnya lima kali sejak kemarin.',
        nb_minum: 'Dua hari ini menyusu dan minum dari botolnya makin sebentar. Sejak tadi pagi hampir tidak mau mengisap sama sekali.',
        nb_kencing: 'Sejak kemarin kencingnya sedikit-sedikit, Dok. Popok terakhir basah sedikit menjelang subuh, sesudah itu kering.',
        nb_demam: 'Badannya lebih hangat dari biasanya sejak kemarin, tapi perutnya tidak kembung dan muntahnya putih, bukan hijau.',
        nb_asupan: 'ASI saya mulai berkurang, jadi sejak seminggu ini saya tambah susu formula. Makanan padat belum pernah.',
        nb_obat: 'Saya hanya menyusui dan memberi susu formulanya sedikit-sedikit. Belum saya beri obat, oralit, atau ramuan.',
      },
      temuanBerubah: {
        umum: 'Berat badan 5,6 kg. Bayi letargis, membuka mata sebentar bila dirangsang lalu terkulai lagi, menangis lemah tanpa air mata.',
        kepala_leher: 'Kedua mata cekung dalam; ubun-ubun depan teraba cekung; lidah dan mukosa mulut kering lengket.',
      },
    },
  ],
}
