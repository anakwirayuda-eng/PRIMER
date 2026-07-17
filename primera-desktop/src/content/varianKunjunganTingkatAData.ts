/**
 * DATA VARIAN KUNJUNGAN TINGKAT-A (M11 #5 B1) — file GENERATED.
 *
 * Diisi dari pipeline draf->verifikasi-adversarial (workflow
 * `m11-varian-kunjungan-tingkat-a`, run BERSIH `wf_513681d3-92b`, 96/96 agen
 * sukses tanpa error) lalu ditulis deterministik dari JSON hasil verifikasi
 * oleh skrip -- jangan edit manual kecuali koreksi klinis/naratif yang
 * diadjudikasi. Ringkasan per varian + kasus yang GAGAL verifikasi (dan
 * kenapa): docs/M11_VARIAN_KUNJUNGAN_TINGKAT_A_HASIL.md.
 *
 * CATATAN INTEGRITAS PENTING: ada run KEDUA (`wf_7033ab45-2e2`) yang sempat
 * dijalankan tak sengaja sbg duplikat sebelum run pertama ditemukan --
 * run kedua kena limit kuota bulanan di tengah jalan (37/96 panggilan agen
 * gagal) dan skrip workflow py silently TREATS agen verifikator yang gagal
 * sbg "tidak ada bantahan" (bug nyata di kumpulkanBantahan(), bukan cuma
 * kekhawatiran teoretis -- terverifikasi: run kedua melaporkan 16/16 lolos
 * penuh PERSIS termasuk semua skenario yg di run bersih gagal_semua). Data
 * di file ini SELALU dari run BERSIH (`wrvjbcexr`/`wf_513681d3-92b`, 0
 * error), bukan run kedua -- 7 dari 16 skenario TIDAK dapat varian (gagal
 * verifikasi asli, bukan cakupan yang sengaja dilewati).
 *
 * Kunci = id skenario kunjungan (unik lintas 16 keluarga, diverifikasi
 * pack.test.ts). Diterapkan ke katalog oleh
 * `terapkanVarianKunjunganTingkatA()` (varianKunjunganTingkatA.ts) saat
 * PACK dirakit; integritas isi dijaga `validasiPack` (pack.ts).
 */
import type { VarianKunjunganTingkatA } from './types'

export const VARIAN_KUNJUNGAN_TINGKAT_A: Record<string, VarianKunjunganTingkatA[]> = {
  wulan_k1: [
    {
      id: 'sore_sambil_menjahit_baju',
      pembuka: 'Sore itu Bu Wulan duduk di teras depan, jarum dan benang di tangan, menisik daster yang sobek di bagian bahu. Mendengar suara motor dokter, ia buru-buru menyematkan jarum ke bantalannya dan berdiri, memijit tengkuknya sebentar. "Aduh, Dokter kok repot-repot ke sini. Duduk, duduk... saya bikinkan teh dulu ya." Aroma minyak kayu putih menguar dari balik pintu rumah papan berhalaman sempit itu.',
      dialogNarasiBerubah: {
        wk1_d1: 'Bu Wulan menuang teh, lalu duduk sambil memegangi tengkuknya — tadi kelamaan menunduk menjahit. "Sebenarnya kepala saya memang sering cengeng begini, Dok, berat di sini. Tapi saya sudah kapok obat darah tinggi. Tetangga saya, Bu Karsih, rajin minum obat — sekarang malah cuci darah seminggu dua kali. Obat itu bikin ginjal rusak, Dok."',
      },
      pilihanBerubah: {
        wk1_d3_a: { respons: 'Bu Wulan menunduk, jarum jahit di pangkuannya berhenti bergerak. "Sudah dua bulan saya tidak sentuh obat itu, Dok. Masih rapi tersegel di atas lemari. Saya... takut. Tiap mau minum kebayang selangnya Bu Karsih."', responsBohong: '"Masih saya minum kok, Dok... ya sesekali saja, kalau kepala lagi cenut-cenut parah. Kalau badan lagi enak, saya istirahatkan dulu, biar ginjalnya nggak kerja keras."' },
      },
      penutupBerhasil: 'Di teras depan, di antara jahitan yang belum selesai, Bu Wulan menggenggam strip amlodipine seperti menggenggam keputusan besar. "Dua minggu, Dok. Terus kita buktikan ginjal saya aman." Pak Darto mengantar sampai pagar dan berbisik, "Baru kali ini dia mau dengar soal obat, Dok. Suwun."',
      penutupGagal: 'Jahitan di pangkuan Bu Wulan sudah disulam lagi saat kau pamit. Ia melepasmu di pintu dengan senyum sopan yang rapat, seperti pagar yang dikunci halus. Di atas lemari, kantong obat itu tetap tersegel — dan tekanan darahnya tetap 178.',
    },
    {
      id: 'sore_menganyam_tikar_pandan',
      pembuka: 'Sore itu Bu Wulan duduk bersila di teras samping, jari-jarinya menganyam ulang tikar pandan yang sobek di beberapa sisi — tikar yang biasa digelar tiap pengajian mingguan di rumahnya. Mendengar suara motor dokter, ia buru-buru menyelipkan anyaman yang belum kelar itu ke bawah kursi bambu dan berdiri, memijit tengkuknya sebentar. "Aduh, Dokter kok repot-repot ke sini. Duduk, duduk... saya bikinkan teh dulu ya." Rumah papan berhalaman sempit itu tetap wangi minyak kayu putih seperti biasa.',
      dialogNarasiBerubah: {
        wk1_d1: 'Bu Wulan menuang teh, lalu duduk sambil memegangi tengkuknya — katanya kelamaan menunduk menganyam tikar tadi. "Sebenarnya kepala saya memang sering cengeng begini, Dok, berat di sini. Tapi saya sudah kapok obat darah tinggi. Tetangga saya, Bu Karsih, rajin minum obat — sekarang malah cuci darah seminggu dua kali. Obat itu bikin ginjal rusak, Dok."',
      },
      pilihanBerubah: {
        wk1_d3_a: { respons: 'Bu Wulan meletakkan anyaman tikar di pangkuannya, menghela napas panjang. "Terus terang, Dok, sudah dua bulan ini tidak saya minum. Masih tersegel rapi di atas lemari. Saya takut, tiap kali mau minum kebayang Bu Karsih yang sekarang cuci darah."', responsBohong: '"Ya masih, Dok, diminum kok... sesekali saja kalau kepala berat sekali. Kalau badan berasa enak ya saya kasih istirahat dulu obatnya, kasihan ginjal saya kerja terus."' },
      },
      penutupBerhasil: 'Di teras samping, anyaman tikar yang tadi disisihkan tergeletak begitu saja. Bu Wulan menggenggam strip amlodipine seperti menggenggam keputusan besar. "Dua minggu, Dok. Terus kita buktikan ginjal saya aman." Pak Darto mengantar sampai pagar dan berbisik, "Baru kali ini dia mau dengar soal obat, Dok. Suwun."',
      penutupGagal: 'Anyaman tikar yang belum tuntas kembali dikerjakan Bu Wulan begitu kau berpamitan. Senyumnya sopan tapi rapat, seperti pagar yang dikunci halus. Di atas lemari, kantong obat itu tetap tersegel — dan tekanan darahnya tetap 178.',
    },
  ],
  musa_k1: [
    {
      id: 'pagi_membersihkan_kandang_perkutut',
      pembuka: 'Pagi itu Pak Musa sedang membersihkan kandang burung perkutut kesayangannya di teras samping ketika kamu memarkir motor di depan gang. Mendengar suara motor, ia buru-buru mencuci tangan di kran belakang dan bergegas ke pintu depan dengan wajah cerah -- tamu, akhirnya -- lalu menyalakan kompor untuk air teh sebelum kamu sempat menolak, radio kecil menyala menemani obrolan pagi itu.',
      hotspotBerubah: {
        musa_h_kacamata: { narasi: 'Sebuah kacamata baca dengan gagang patah, disambung karet gelang, terselip di antara jadwal lomba burung perkutut yang ditempelnya di dinding dapur. Dengan ini ia harus membaca tulisan "1x1 pagi" seukuran semut di etiket obat.' },
        musa_h_foto: { narasi: 'Di dinding, foto pernikahan yang sudah pudar dan kalender tahun lalu yang tidak pernah diganti, tersorot cahaya pagi dari jendela dapur. Waktu di rumah ini berhenti pada bulan yang sama ketika Bu Halimah pergi.' },
      },
      dialogNarasiBerubah: {
        musa_d3: 'Radio pagi itu menyiarkan warta berita sebentar, lalu berganti tembang kenangan. Pak Musa memandang foto di dinding. "Anak-anak nelponnya seminggu sekali, Dok. Sehat-sehat saja jawab saya. Wong mereka jauh, ngapain dibikin mikir."',
      },
      pilihanBerubah: {
        musa_d1_empati: { respons: 'Pak Musa terdiam, mengaduk teh yang tidak perlu diaduk, sesekali melirik ke arah kandang burung di luar. "Sepi itu bukan di rumah ini, Dok. Di sini," tangannya menepuk dada. "Dulu kalau ibu masih ada, urusan obat pagi begini sudah beres sebelum saya sempat mikir."' },
        musa_d1_edukasi: { respons: '"Oh... nggih, Dok, nggih." Pak Musa buru-buru menggeser gelas tehnya sendiri, seperti anak sekolah ketahuan melanggar aturan. Sisa pagi itu ia lebih banyak mengangguk daripada bercerita.' },
        musa_d1_konfrontasi: { respons: 'Wajah cerah tadi meredup pelan-pelan, sama seperti kicau burung yang mendadak diam saat kandangnya digedor. "Maaf, Dok. Maaf," ia membungkuk kecil. Sisa kunjungan pagi itu terasa seperti memeriksa murid, bukan menemani orang tua.' },
        musa_d2_ungkap: { respons: 'Pak Musa menatap ke arah lacinya, lalu menyerah dengan tawa kecil yang getir. "Sejujurnya, Dok, saya sering lupa sudah minum apa belum. Yang bulat kecil itu buat pagi atau malam, tulisannya kekecilan, mata saya sudah tidak bisa diajak kompromi. Daripada keliru, ya mending tidak saya minum sekalian."', responsBohong: '"Rutin, Dok. Tiap habis subuh, sebelum saya kasih makan burung, langsung saya minum." Pak Musa menjawab tangkas sambil menutup laci itu dengan lututnya, pelan-pelan, seolah tak disengaja.' },
        musa_d3_refleksi: { respons: 'Lama Pak Musa tidak menjawab, mendengarkan kicau burung dari teras samping. "...Iya, Dok," katanya akhirnya, pelan seperti mengaku. "Bukan minta ditunggui terus-terusan. Diingatkan saja, itu sudah cukup. Kayak dulu, ibu." Ia mengusap kacamata karetnya, entah membersihkan apa.' },
      },
      penutupBerhasil: 'Pak Musa mengantarmu sampai gang sambil masih membawa kain lap kandang burungnya, menjabat tanganmu dengan dua tangan, lama, seperti kepada guru yang pamit pindah tugas. "Minggu depan mampir lagi, Dok, saya kenalkan perkutut jagoan saya. Tehnya saya bikin pahit." Ia tertawa -- dan kamu tahu ia akan menepatinya.',
      penutupGagal: 'Pintu tertutup dengan sopan di belakangmu, kicau burung di kandang samping terdengar sendu menemani radio yang kembali mengeras dari dalam. Di laci yang setengah terbuka tadi, tiga bulan obat menunggu bulan keempat. Rumah itu kembali rapi, sunyi, dan pelan-pelan berbahaya.',
    },
  ],
  raharjo_k1: [
    {
      id: 'sore_giling_padi',
      pembuka: 'Matahari sore mulai condong ke barat ketika kamu tiba di ujung Dusun Kali Gede; bau sekam padi dari musim giling di kampung sebelah masih menggantung di udara. Rumah panggung keluarga Raharjo berdiri miring di bibir tebing sungai, dindingnya anyaman bambu yang sudah memutih. Bu Sumiati buru-buru menurunkan jemuran dari galah bambu di teras, setengah kaget setengah malu kedatangan tamu berjas putih di jam segini.',
      hotspotBerubah: {
        raharjo_h_rokok: { narasi: 'Di lincak bambu depan rumah tergeletak bungkus kretek yang sudah kosong dan asbak dari batok kelapa, penuh puntung menumpuk sehabis dipakai seharian. Ada yang merokok tiap hari di rumah ini.' },
      },
      dialogNarasiBerubah: {
        raharjo_d1: 'Bu Sumiati menyuguhkan teh tawar sambil terus menunduk, keranjang cucian yang belum dilipat masih teronggok di sampingnya. "Maaf, Dok, rumahnya begini... Bapak masih di sawah." Matanya sesekali melirik ke arah tebing belakang, seperti berharap kamu tidak melihat ke sana.',
        raharjo_d2: 'Sore beranjak, obrolan mengalir ke urusan rumah sambil Bu Sumiati melipat cucian di pangkuannya. Ia bercerita anak-anaknya sehat, cuma Rini kadang sakit perut. Ini celah alami untuk bertanya hal yang sensitif itu.',
        raharjo_d3: 'Pak Raharjo pulang dari sawah menjelang senja, capingnya penuh debu jerami sisa panen dan pundaknya masih memikul karung gabah kosong. Mendengar kata "jamban", rahangnya mengeras. "Dokter mau nyuruh bikin jamban? Pakai apa? Tanah nggak ada, duit nggak ada."',
      },
      pilihanBerubah: {
        raharjo_d1_empati: { respons: '"Wah, sejak kawin, Dok, sudah dua puluh tahun lebih." Bahu Bu Sumiati mengendur, senyum kecil mulai muncul. "Dulu halaman belakang masih cukup luas buat jemur gabah, sekarang tinggal separuh, abis digerus kali tiap kali banjir."' },
        raharjo_d2_ungkap: { respons: 'Bu Sumiati menghela napas, menaruh lipatan kain di pangkuannya. "Ya... ke kali, Dok, semua orang sini juga begitu. Bukannya kami nggak mau bikin jamban -- tanah belakang abis longsor, mau nabung buat beli kloset sama semen, hasil buruh tani Bapak abis buat makan. Katanya ada arisan jamban RW, tapi jatahnya nggak pernah nyampe ujung dusun sini."', responsBohong: '"Ada, Dok, jamban di belakang..." Bu Sumiati menjawab cepat sambil merapikan lipatan kain yang sama berulang-ulang. "Cuma lagi rusak sedikit, jadi jarang dipakai. Iya, rusak."' },
        raharjo_d3_refleksi: { respons: 'Pak Raharjo menurunkan karung kosong dari pundak, lalu duduk di anak tangga. "...Nah, itu Dokter ngerti." Nada suaranya melunak. "Kalau ada jalannya, ya saya orang pertama yang gali, Dok. Malu saya sama anak wedok, sudah besar masih ke kali."' },
      },
      penutupBerhasil: 'Pak Raharjo mengantarmu sampai ujung gang dengan karung kosong masih di tangan, sesuatu yang tadi rasanya mustahil. "Kalau soal lahan carik itu jadi, kabari saya duluan ya, Dok." Di belakangnya, Bu Sumiati melambai dari teras sambil memeluk lipatan kain — kali ini dengan senyum penuh.',
      penutupGagal: 'Kamu pamit ketika matahari nyaris tenggelam, teh yang disuguhkan tak habis diminum. Dari kejauhan, kamu melihat Rini kecil menuruni jalan setapak ke sungai membawa ember, menyusul jemuran yang belum sempat diangkat. Besok pagi jalan itu akan tetap licin, dan catatanmu tetap kosong.',
    },
  ],
  asih_k1: [
    {
      id: 'sore_hujan_menganyam_tikar',
      pembuka: 'Sore itu hujan rintik-rintik membuat jalan tanah ke ujung dusun licin dan berlumpur; motormu beberapa kali nyaris tergelincir. Di teras rumah bambu, Bu Asih duduk menganyam tikar pandan, sesekali berhenti menyandarkan punggung yang berat karena kandungannya. "Aduh, hujan-hujan begini Dokter masih ke sini. Saya sehat kok, Dok — cuma hamil, bukan sakit," katanya sambil tersenyum menyambut.',
      hotspotBerubah: {
        ak1_h1: { narasi: 'Melalui pintu kamar yang terbuka sedikit karena angin hujan, tampak sebuah bungkusan kain terlipat rapi di sudut: kain jarik, gunting, benang, dan uang lima puluh ribu terselip di lipatannya. "Itu buat jaga-jaga, Dok, titipan ke Mbah Rah nanti kalau waktunya tiba," kata Bu Asih dari kursinya di teras, tanpa berhenti menganyam.' },
        ak1_h3: { narasi: 'Saat berhenti menganyam sejenak untuk meluruskan kaki, tampak punggung kakinya membekas dalam saat ditekan jari — pitting edema. "Namanya juga hamil tua, Dok. Dulu-dulu juga begini," katanya menepis sambil melanjutkan anyamannya.' },
      },
      dialogNarasiBerubah: {
        ak1_d1: 'Jari-jari Bu Asih terus menganyam pandan meski bicara. "Anak pertama sampai ketiga semua Mbah Rah yang nolong, Dok," ia mengelus perutnya sejenak. "Orangnya sabar, doanya manjur, dan beliau datang ke rumah. Masa yang keempat ini saya repot-repot ke Puskesmas?"',
        ak1_d2: 'Pak Jumadi pulang lebih awal karena hujan, payungnya masih menetes di sudut teras. Ia duduk membawa kopi hangat. "Bukannya kami menolak Puskesmas, Dok. Tapi kakaknya bojoku dulu meninggal di rumah sakit — operasi caesar, tidak bangun lagi. Sejak itu bojoku wanti-wanti: jangan sampai dibawa ke meja operasi."',
      },
      pilihanBerubah: {
        ak1_d1_a: { respons: 'Bu Asih berhenti menganyam sejenak. "Yang ketiga itu... darahnya memang banyak, Dok. Saya sampai tidak kuat berdiri tiga hari. Tapi kan akhirnya berhenti." Suaranya melirih di ujung kalimat — ia sendiri tahu ada yang berbeda dengan cerita itu.' },
        ak1_d3_a: { responsBohong: '"Rencananya ya di bidan, Dok," jawabnya lancar sambil terus melipat sisa anyaman, matanya melirik sekilas ke arah pintu kamar di belakangnya — ke bungkusan kain dan gunting yang sudah disiapkan untuk Mbah Rah.' },
      },
      penutupBerhasil: 'Hujan sudah reda saat kamu pamit. Bu Asih meletakkan tikar anyaman yang setengah jadi, memegang buku KIA yang kini ada isinya. "Angka-angka tadi itu... beneran tinggi ya, Dok?" Untuk pertama kalinya, pertanyaannya bukan tentang Mbah Rah — tentang dirinya. "Besok pagi saya ditunggu bu bidan, to? Iya, Dok, saya datang — katanya tensi sama air seninya mau dicek lagi, tidak boleh ditunda-tunda."',
      penutupGagal: 'Rintik hujan belum juga berhenti saat kamu pamit. Bungkusan kain untuk Mbah Rah masih tergeletak di sudut kamar, dan tikar pandan di pangkuan Bu Asih sudah hampir selesai teranyam. Ia melambaikan tangan dengan senyum yang sama seperti saat kamu datang — ramah, hangat, dan sama sekali tidak berubah. Di buku KIA, halaman pemeriksaan kembali menunggu entah sampai kapan.',
    },
    {
      id: 'pagi_mengupas_singkong_di_bale_bale',
      pembuka: 'Pagi itu matahari baru naik separuh, ayam-ayam berkeliaran mematuk-matuk di halaman tanah. Rohman dan Siti baru saja berangkat sekolah. Bu Asih duduk di bale-bale bambu depan rumah, mengupas singkong sambil sesekali berhenti mengelus perutnya yang membesar; Udin duduk di sampingnya, asyik mengorek-ngorek tanah dengan ranting kecil. "Pagi-pagi sudah ke sini, Dok. Saya sehat kok, cuma hamil, bukan sakit," katanya sambil menggeser sedikit tempat duduknya, mempersilakan.',
      hotspotBerubah: {
        ak1_h2: { label: 'Buku KIA terselip di rak piring dekat dapur', narasi: 'Buku KIA merah muda terselip di rak piring dekat dapur — masih terbungkus plastik kelurahan. Halaman pemeriksaan kehamilan kosong semua. Tujuh bulan, nol kunjungan ANC.' },
        ak1_h4: { narasi: 'Foto selamatan tergantung miring di dinding ruang tamu, kena sinar pagi dari pintu yang terbuka: bayi digendong perempuan tua bersanggul — Mbah Rah. Pak Jumadi, yang baru pulang jaga malam ronda, bercerita sambil menguap, "Waktu si Udin lahir, darahnya banyak sekali keluar, Dok. Untung Mbah Rah kasih ramuan, berhenti sendiri."' },
      },
      dialogNarasiBerubah: {
        ak1_d1: 'Udin merangkak naik ke pangkuan Bu Asih, yang tetap duduk mengupas singkong sambil bicara. "Anak pertama sampai ketiga semua Mbah Rah yang nolong, Dok," ia mengelus perutnya sejenak. "Orangnya sabar, doanya manjur, dan beliau datang ke rumah. Masa yang keempat ini saya repot-repot ke Puskesmas?"',
        ak1_d2: 'Pak Jumadi baru pulang jaga ronda semalam, matanya masih merah menahan kantuk, tapi ikut duduk di bale-bale membawa kopi. "Bukannya kami menolak Puskesmas, Dok. Tapi kakaknya bojoku dulu meninggal di rumah sakit — operasi caesar, tidak bangun lagi. Sejak itu bojoku wanti-wanti: jangan sampai dibawa ke meja operasi."',
      },
      pilihanBerubah: {
        ak1_d2_a: { respons: 'Mata Bu Asih berkaca sambil mendekap Udin yang duduk di pangkuannya lebih erat. "Tahun sembilan puluhan, Dok, saya masih gadis. Mbakyu saya masuknya sudah kejang-kejang, kata orang darahnya naik. Sampai sekarang saya mimpi buruk kalau ingat lorong rumah sakit itu." — Kejang. Darah naik. Eklampsia yang terlambat.' },
        ak1_d3_a: { responsBohong: '"Rencananya ya di bidan, Dok," jawabnya lancar sambil mendekap Udin di pangkuannya, matanya melirik ke arah kamar yang pintunya terbuka pagi itu — ke bungkusan kain dan gunting yang sudah disiapkan untuk Mbah Rah.' },
      },
      penutupBerhasil: 'Matahari sudah makin tinggi, Udin anteng bermain kerikil di halaman, saat Bu Asih memegang buku KIA yang kini ada isinya. "Angka-angka tadi itu... beneran tinggi ya, Dok?" Untuk pertama kalinya, pertanyaannya bukan tentang Mbah Rah — tentang dirinya. "Besok pagi saya ditunggu bu bidan, to? Iya, Dok, saya datang — katanya tensi sama air seninya mau dicek lagi, tidak boleh ditunda-tunda."',
      penutupGagal: 'Udin masih asyik mengorek tanah dengan ranting kecil di sampingnya saat kamu pamit pagi itu. Bu Asih melambaikan tangan dengan senyum yang sama seperti saat kamu datang — ramah, hangat, dan sama sekali tidak berubah. Di buku KIA, halaman pemeriksaan kembali menunggu entah sampai kapan.',
    },
  ],
  slamet_k1: [
    {
      id: 'sore_arisan_pkk_tetangga',
      pembuka: 'Sore menjelang Maghrib, jalan kampung ramai oleh ibu-ibu yang menenteng piring menuju rumah sebelah — arisan PKK RT sore ini. Rumah Pak Slamet ikut dirapikan berlebihan, seakan ingin terlihat \'baik-baik saja\' di mata tetangga yang lalu-lalang di depan pagar. Dari lorong belakang radio menyala pelan di balik pintu yang digembok dari luar. "Itu... ruang jemur pakaian, Dok," kata Bu Tumini buru-buru, matanya sekilas melirik ke jendela depan yang menghadap jalan.',
      hotspotBerubah: {
        slk1_h4: { narasi: 'Di atas bufet, di sela piring-piring yang buru-buru ditumpuk saat rumah dirapikan sore itu, ada piala kecil berdebu: "Juara II Cerdas Cermat SMA". Bu Tumini mengikuti pandanganmu, buru-buru menyingkirkan piring-piring itu ke dapur sebelum sempat terlihat dari jendela depan. "Eko itu dulu pintar, Dok," katanya nyaris berbisik, lalu berlalu ke dapur.' },
      },
      dialogNarasiBerubah: {
        slk1_d1: 'Pak Slamet duduk kaku di kursi tamu, sesekali matanya melirik ke jendela ke arah rumah tetangga yang mulai ramai suara ibu-ibu arisan. "Kami sehat semua, Dok. Eko sudah lama kerja di Surabaya, jarang pulang." Dari lorong belakang, radio itu berpindah gelombang, seolah seseorang di baliknya gelisah mendengar suara berkumpul dari luar.',
        slk1_d3: 'Suara ibu-ibu arisan di luar terdengar riang, kontras dengan keheningan di lorong belakang — sampai tiba-tiba terdengar suara Eko, serak karena jarang dipakai bicara: "Bu... itu tamunya siapa? Kok rame amat di luar?" Bu Tumini membeku, gelas di tangannya nyaris jatuh. Pak Slamet muncul lagi di ambang dapur, menunggu apa yang akan kamu lakukan.',
      },
      pilihanBerubah: {
        slk1_d1_a: { respons: 'Pak Slamet menunduk lama, suara arisan di luar seperti dari dunia lain. Bu Tumini akhirnya yang bicara, suaranya pecah: "Eko di belakang, Dok. Enam bulan ini... kami tidak tahu lagi harus bagaimana." Gembok itu akhirnya diakui ada.' },
        slk1_d3_a: { respons: 'Hening sesaat — suara arisan di luar seperti menjauh — lalu Pak Slamet sendiri yang melangkah dan memutar kunci gembok. "Eko, ini dokter Puskesmas." Pintu terbuka sejengkal: wajah pucat berambut gondrong menatap dari kegelapan, waspada tapi tidak bermusuhan. "...Dokter beneran?" tanya Eko.' },
      },
      penutupBerhasil: 'Waktu kamu pulang, suara arisan di rumah sebelah sudah berganti tawa riuh. Tapi lima menit tadi, lewat pintu yang terbuka sejengkal, Eko sempat bertanya apakah obat yang baru bikin ngiler. "Kita cari yang tidak," jawabmu. Ia mengangguk — untuk pertama kalinya dalam enam bulan, seseorang membuat janji PADANYA, bukan tentang dia, sementara azan Maghrib mulai berkumandang.',
      penutupGagal: 'Gembok itu kembali dikunci sebelum azan Maghrib berkumandang, bahkan sebelum motormu keluar pekarangan. Di rumah sebelah, tawa arisan terus terdengar riang — dunia yang tak pernah diizinkan menyentuh Eko. Di laci bufet, kantong obat bulan depan akan tetap ditebus, disimpan rapi, tak diminumkan, seperti nyala lilin untuk anak yang mereka rindukan tapi tak berani mereka tunjukkan pada dunia.',
    },
    {
      id: 'pagi_seusai_kerja_bakti',
      pembuka: 'Pagi itu selokan depan rumah masih basah bekas hujan semalam, dan warga RT baru saja selesai kerja bakti bersama — beberapa masih berdiri mengobrol di ujung gang sambil menunggu giliran pulang, cangkul dan sabit tersandar di pagar. Rumah Pak Slamet ikut tampak sibuk dibersihkan, seakan ingin terlihat paling rapi begitu tetangga-tetangga itu lewat pulang. Dari lorong belakang radio menyala pelan di balik pintu yang digembok dari luar. "Itu... tempat simpan alat kerja bakti, Dok," kata Bu Tumini cepat, sambil mendorongmu pelan menjauh dari lorong itu menuju ruang tamu.',
      hotspotBerubah: {
        slk1_h2: { narasi: 'Di dinding ruang tamu yang baru saja dilap pagi itu, ada empat paku dengan bekas bingkai yang lebih terang dari cat sekitarnya, makin jelas di bawah cahaya pagi yang masuk dari jendela depan. Foto-foto yang pernah tergantung di sana sudah diturunkan.' },
      },
      dialogNarasiBerubah: {
        slk1_d1: 'Pak Slamet sempat mengintip dari jendela ke arah gang tempat tetangga masih berkumpul selesai kerja bakti, lalu buru-buru duduk saat melihatmu masuk. "Kami sehat semua, Dok. Eko sudah lama kerja di Surabaya, jarang pulang." Dari lorong belakang, radio itu berpindah gelombang, seolah seseorang di baliknya waspada mendengar suara-suara di luar yang belum juga bubar.',
        slk1_d3: 'Dari luar masih terdengar sayup suara tetangga membereskan alat kerja bakti, riuh oleh canda — lalu tiba-tiba dari lorong belakang, suara Eko menyusup pelan: "Bu... itu tamunya siapa? Kok masih rame di luar?" Bu Tumini membeku, tangannya yang tadi merapikan taplak berhenti di udara. Pak Slamet muncul lagi di ambang dapur, menunggu apa yang akan kamu lakukan.',
      },
      pilihanBerubah: {
        slk1_d1_a: { respons: 'Pak Slamet menatap cangkul-cangkul yang masih bersandar di pagar depan, lalu menunduk menatap lantai lama sekali. Bu Tumini yang akhirnya bicara, suaranya pecah: "Eko di belakang, Dok. Enam bulan ini... kami tidak tahu lagi harus bagaimana." Gembok itu akhirnya diakui ada.' },
        slk1_d3_a: { respons: 'Hening — suara tetangga di luar seperti menjauh perlahan — lalu Pak Slamet sendiri yang melangkah dan memutar kunci gembok. "Eko, ini dokter Puskesmas." Pintu terbuka sejengkal: wajah pucat berambut gondrong menatap dari kegelapan, waspada tapi tidak bermusuhan, matanya melirik ke arah jendela depan lebih dulu daripada ke wajahmu. "...Dokter beneran?" tanya Eko.' },
      },
      penutupBerhasil: 'Saat kamu pamit, cangkul dan sabit di pagar depan sudah diangkut pulang satu per satu oleh pemiliknya — gang kembali sepi. Tapi lima menit tadi, lewat pintu yang terbuka sejengkal, Eko sempat bertanya apakah obat yang baru bikin ngiler. "Kita cari yang tidak," jawabmu. Ia mengangguk — untuk pertama kalinya dalam enam bulan, seseorang membuat janji PADANYA, bukan tentang dia.',
      penutupGagal: 'Gembok itu kembali dikunci bahkan sebelum tetangga terakhir selesai membereskan alat kerja baktinya di depan rumah. Di laci bufet, kantong obat bulan depan akan tetap ditebus — disimpan rapi, tak diminumkan, seperti nyala lilin untuk anak yang mereka rindukan tapi tak berani mereka tunjukkan pada dunia yang masih ramai di depan pagar.',
    },
  ],
  yani_k1: [
    {
      id: 'sore_seusai_menjemur_popok',
      pembuka: 'Sore itu, sehabis Ashar, dari arah dapur masih terdengar denting sendok di piring — jejak sesi \'makan sore\' Nayla yang baru saja kelar. Bu Yani sendiri masih di halaman samping, tengah menjemur setumpuk popok kain basah dari cucian tadi siang. "Sebentar, Dok, saya cuci tangan dulu," serunya sambil menjepit kain terakhir di tali jemuran. Tak lama, Mbah Painem melangkah keluar dari dapur menggendong Nayla yang wangi minyak telon selepas mandi sore, langsung pamer: "Montok to, Dok? Ini berkat pisang. Anak zaman dulu semua begitu, buktinya pada waras-waras."',
      hotspotBerubah: {
        yk1_h1: { label: 'Piring bekas pisang kerok sore ini', narasi: 'Di meja dapur, piring kecil bekas pisang yang dikerok halus dengan sendok masih tergeletak, belum sempat dicuci — sisa suapan sore tadi. Rupanya jadwal \'makan sore\' Nayla ini sudah rutin, bukan cuma sekali dua kali.' },
      },
      penutupBerhasil: 'Saat kamu pamit, azan Maghrib baru saja berkumandang dari musala ujung gang. Mbah Painem menimang Nayla di teras sambil bersenandung tembang baru: "Enem wulan, Nduk... sabar yo, mengko simbah sing nyuapi dhisik." Bu Yani mengantarmu ke pagar, jemuran popok kain sudah diangkatnya rapi, KMS dipegang erat di tangan satunya: "Bulan depan titiknya harus naik ya, Dok. Saya yang gambar garisnya."',
      penutupGagal: 'Belum lagi kamu keluar pagar, piring kecil itu sudah terisi pisang kerok yang baru sore itu juga. "Terima kasih ilmunya, Dok," kata Bu Yani sopan, sementara dari dapur Mbah Painem menambahkan sambil menjemur sendok terakhir: "Ilmu sekolahan memang begitu — anaknya sopo dulu yang gedhe: teori opo pisang." KMS kembali terselip di rak, bisu sampai kunjungan berikutnya.',
    },
  ],
  gunawan_k1: [
    {
      id: 'libur_truk_diservis_bengkel',
      pembuka: 'Pagi itu truk ekspedisi Pak Gunawan sedang di bengkel, ganti kampas rem -- untuk sekali ini ia libur di rumah, bukan baru pulang rute malam. Rumah tembok itu tenang; di ruang tamu, dua benda bertetangga di atas bufet seperti biasa: nebulizer anak bergambar badut, dan asbak kaca yang penuh. Bu Ratna menyambutmu dari dapur, wangi kopi pagi mengambang; Pak Gunawan duduk di kursi rotan dekat pintu, koran bekas terbuka tak terbaca di pangkuannya.',
      hotspotBerubah: {
        gk1_h1: { narasi: 'Di pagi yang tenang ini, nebulizer bergambar badut itu berdebu tipis di atasnya -- sering dipakai, jarang dilap. Sepuluh senti darinya, asbak kaca penuh puntung, sisa begadang semalam meski truk sedang istirahat di bengkel. Dua alat napas satu bufet.' },
        gk1_h2: { narasi: 'Laci bufet setengah terbuka -- belum tersentuh sejak subuh karena truk sedang diservis dan Pak Gunawan libur pagi ini. Inhaler biru Dimas tetap tergeletak di atas dua slop kretek cadangan untuk rute malam nanti. Logistik penyakit dan penyebabnya, satu alamat.' },
        gk1_h4: { narasi: 'Papan tulis kecil: \'SBY-SOLO PP: Sen-Rab-Jum, brgkt 21.00\' -- hari ini dicoret kecil dengan tulisan \'BENGKEL\', satu-satunya jeda dalam rutinitas rute malam yang biasanya berjalan tiga kali seminggu.' },
      },
      dialogNarasiBerubah: {
        gk1_d1: 'Pak Gunawan melipat korannya, meraih bungkus kretek di meja dan mengetuknya pelan-pelan -- kebiasaan lama meski hari ini truknya sedang istirahat di bengkel. \'Saya tahu kok, Dok, arahnya ke mana obrolan ini,\' ia tersenyum duluan. \'Tapi nyopir malam itu tanpa rokok sama saja setor nyawa di jalan tol, biar hari ini libur juga.\'',
        gk1_d2: 'Bu Ratna keluar dari dapur membawa teh hangat untukmu -- aroma kopi Pak Gunawan sendiri masih mengambang dari dapur -- lalu duduk sebentar: \'Kemarin malam Dimas kambuh lagi, Dok. Nebulizer sampai dua kali. Padahal bapaknya sudah kalau merokok di teras... katanya.\'',
        gk1_d3: 'Dimas keluar kamar dalam piyama, mengucek mata mendengar suara ayahnya yang jarang terdengar di rumah sepagi ini -- berlari kecil memeluk kakinya, lalu, kebiasaan, mengipas-ngipas udara di depan hidungnya sambil melangkah mundur kembali ke kamar untuk bersiap sekolah. Gerakan kecil otomatis yang membuat ruangan hening sedetik. Pak Gunawan melihatnya. Kamu melihat Pak Gunawan.',
      },
      penutupBerhasil: 'Di teras, sambil menunggu telepon dari bengkel soal truknya, Pak Gunawan menyalamimu dengan genggaman sopir -- keras dan lama. \'Senin saya nyetir ke Solo, Dok. Kamis saya ke Puskesmas. Jangan kasih tahu siapa-siapa dulu.\' Koran bekas di kursi rotan itu masih terbuka di halaman yang sama sejak tadi; di kulkas, gambar krayon Dimas masih tergantung, menunggu suatu hari digambar ulang.',
      penutupGagal: 'Kamu pamit sementara Pak Gunawan masih di kursi rotan, korannya belum juga berganti halaman. Dari teras terdengar korek gas menyala -- jeda tiga detik setelah pintu tertutup, sopan sekali, meski truknya sendiri sedang istirahat di bengkel. Di atas bufet, badut di nebulizer itu tetap tersenyum menghadap asbak, dua tetangga yang tidak pernah dipisahkan.',
    },
  ],
  bagyo_k1: [
    {
      id: 'pagi_ramai_hari_pasaran',
      pembuka: 'Pagi itu kampung riuh oleh hari pasaran — pedagang keliling menjajakan bumbu dan ikan asin di simpang jalan, suaranya sampai terdengar dari rumah panggung Pak Bagyo. Jamban bantuan itu tetap berdiri di samping rumah — bersih mengilap, gayungnya masih bergantung rapi seperti pajangan toko yang tak pernah dibuka. Pak Bagyo baru saja kembali dari kali, handuk masih tersampir di bahu, basah subuh belum juga kering. "Pas, Dok! Kebetulan hari pasaran, ramai to," ia terbahak, mempersilakan duduk di teras.',
      hotspotBerubah: {
        bk1_h1: { narasi: 'Kloset jongkok bersih tanpa noda pemakaian, sarang laba-laba kecil di sudut atap, ember penuh air jernih menganggur. Dari kejauhan sayup terdengar suara pedagang pasar pagi lewat gang depan — tapi suara itu tak pernah singgah ke pintu jamban yang longgar tak terkunci ini. Bangunan setahun yang masih seperti baru diresmikan.' },
        bk1_h4: { label: 'Tini pulang jajan pasar', narasi: 'Tini baru pulang dari deretan pedagang di simpang jalan, uang kembalian jajan pasaran masih digenggam. "Dia satu-satunya yang pakai jamban, Dok," kata Bu Jum. "Katanya malu sama teman sekolah kalau ketahuan ke kali." Generasi yang berbelok.' },
      },
      dialogNarasiBerubah: {
        bk1_d1: '"Bukan kami tidak bersyukur dibangunkan, Dok," Pak Bagyo menuang kopi, handuk di bahunya belum juga dilepas. "Tapi ke kali itu sudah kayak subuh berjamaah. Ketemu Kang Wo, Kang Dul, sekalian rasan-rasan harga gabah — kalau pasaran begini malah tambah ramai obrolannya. Di jamban? Sendirian, sumpek, panas."',
        bk1_d2: 'Bu Jum, yang tadi sempat menitip singkong goreng ke bakul pasar keliling, ikut duduk. "Sebenarnya pas musim hujan kemarin Tini sama saya mencret bareng, Dok. Tapi kata orang-orang ya karena musim, bukan karena kali. Wong dari zaman simbah minum air kali ya sehat-sehat."',
        bk1_d3: 'Tini yang baru pulang jajan pasaran duduk di undakan, mendengarkan. "Kalau aku sih tim jamban, Dok," katanya tiba-tiba, "Di sekolah diajari, dan jijik tahu nggak sih liat bapak-bapak jongkok rame-rame." Pak Bagyo tersedak kopinya, handuk di bahunya melorot sedikit karena kaget.',
      },
    },
  ],
  endah_k1: [
    {
      id: 'sore_sepulang_kontrol_puskesmas',
      pembuka: 'Sore itu motor bebek Andri baru berhenti di depan kontrakan, knalpotnya masih berdenting pelan. Endah turun hati-hati sambil memegangi perut, plastik kresek berisi buku KIA dan sebotol vitamin tergantung di pergelangan tangannya. "Pas sekali, Dok! Kami baru pulang kontrol," katanya, masih dengan jaket kerja Andri yang belum sempat dilepas. "Ayo masuk, kami mau cerita."',
      hotspotBerubah: {
        ek1_h1: { label: 'Map rujukan ANC, baru dari kontrol sore ini', narasi: 'Map bening berisi hasil kontrol sore ini masih hangat dari meja bidan. Di lembar rujukan, tercetak jelas: "TB < 145 cm — faktor risiko CPD (panggul sempit), rencanakan persalinan di faskes mampu PONED." Faktor risiko, bukan vonis — panggulnya belum tentu sempit, tapi kemajuan persalinannya wajib diawasi di tempat yang siap bertindak bila macet. Endah menyelipkan kertas itu di antara halaman buku KIA-nya begitu sampai rumah, seperti menyimpan sesuatu yang berat.' },
      },
      dialogNarasiBerubah: {
        ek1_d1: '"Baru saja dari kontrol sore ini, Dok — bu bidan mengingatkan lagi soal panggul saya yang berisiko sempit, sama kayak kontrol-kontrol sebelumnya," Endah mengeluarkan buku KIA dari kresek, membuka halaman tempat map tadi terselip, lalu menyerahkan map itu padamu — jarinya berhenti di baris yang sama. "Tapi Ibu sudah nyiapkan semuanya di kampung, Dok. Kamar sudah dicat. Masa saya bilang tidak jadi... Ibu pasti sedih sekali."',
        ek1_d2: '"Sebenarnya yang paling repot posisi saya, Dok," Andri menyahut sambil melepas jaket kerjanya, masih berbau bengkel. "Di jalan pulang tadi saya diam sepanjang perjalanan mikirin ini. Istri saya taruhan nyawanya, mertua saya taruhan perasaannya. Saya ini menantu baru — mau ngomong apa saya, salah-salah dikira merebut anak orang."',
        ek1_d3: 'Baru saja kalian duduk dan plastik kontrol tadi diletakkan di meja, HP Andri bergetar — "Ibu (Mertua)" menelepon, persis jam yang sama seperti sore-sore sebelumnya. Andri menatapmu: "Diangkat, Dok? Atau..." Endah berhenti membereskan botol vitamin, menunggu.',
      },
      pilihanBerubah: {
        ek1_d1_b: { respons: '"Iya, Dok, bu bidan juga sudah bilang persis begitu, dari kontrol-kontrol sebelumnya." Endah mengambil kembali map itu darimu, melipatnya pelan lalu menyelipkannya lagi ke dalam buku KIA. "Saya percaya kok." Ia percaya — dan tas mudik itu tetap terkemas di sudut kamar, karena bukan keyakinannya yang perlu diyakinkan.' },
      },
      penutupBerhasil: 'Kamu pamit saat lampu kontrakan baru saja dinyalakan, sementara mereka masih menyusun rencana penyambutan "tamu kehormatan" minggu depan — Endah mau memasak gudeg kesukaan ibunya, Andri mengatur kursi paling empuk di ruang ANC. Map rujukan sore itu naik ke atas kulkas, disandingkan dengan tiket travel yang sudah tak menakutkan lagi. Persalinan paling aman ternyata dirancang bukan di ruang bersalin, tapi di ruang tamu, sepulang kontrol sore ini.',
      penutupGagal: 'Tas mudik itu tetap di sudut kamar, terkemas sempurna, tiketnya tak tergoyahkan. Map rujukan sore itu terselip kembali ke dalam buku KIA, terlipat rapi seperti tak pernah dibaca siapa-siapa selain kamu. Endah mengantarmu ke pintu dengan senyum yang meminta maaf: "Doakan lancar ya, Dok. Ibu saya... orangnya baik kok, cuma nanti kalau sudah kepalang di sana, ya sudah."',
    },
  ],
}
