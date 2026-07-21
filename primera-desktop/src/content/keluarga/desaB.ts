/**
 * KELUARGA BINAAN — DESA B (RW 1, 3, 6) + PROFIL KADER (8) + PROFIL RW (8).
 *
 * Tiga keluarga, tiga hambatan COM-B yang berbeda:
 * - keluarga_raharjo → KESEMPATAN (jamban: tanah sempit & biaya, bukan malas)
 * - keluarga_musa    → KAPABILITAS (lansia DM sendirian, lupa & bingung obat)
 * - keluarga_dewi    → MOTIVASI (KB: suami menolak, bukan istri tak paham)
 *
 * Gerbang kejujuran & kontradiksi hotspot dirancang berpasangan:
 * apa yang DIBOHONGKAN di wawancara selalu bisa KETAHUAN dari observasi babak 1.
 */

import type { KaderProfil, KeluargaBinaan, RwProfil } from '../types'

/* ===========================================================================
 * KELUARGA RAHARJO — RW 6 (Dusun Kali Gede), sedang, miskin.
 * BAB di sungai. Bukan tidak mau punya jamban — tidak ada lahan & biaya.
 * ======================================================================== */

const keluargaRaharjo: KeluargaBinaan = {
  id: 'keluarga_raharjo',
  namaKeluarga: 'Keluarga Raharjo',
  rw: 6,
  jarakMenit: 30,
  ekonomi: 'miskin',
  anggota: [
    { nama: 'Raharjo', usia: 47, jenisKelamin: 'L', peran: 'kepala' },
    { nama: 'Sumiati', usia: 43, jenisKelamin: 'P', peran: 'istri' },
    { nama: 'Joko', usia: 16, jenisKelamin: 'L', peran: 'anak' },
    { nama: 'Rini', usia: 9, jenisKelamin: 'P', peran: 'anak' },
  ],
  indikatorAwal: {
    kb: 'ya',
    persalinan_faskes: 'na',
    imunisasi_dasar: 'na',
    asi_eksklusif: 'na',
    pantau_tumbuh_kembang: 'na',
    tb_berobat_standar: 'na',
    hipertensi_berobat: 'na',
    jiwa_tidak_ditelantarkan: 'na',
    tidak_merokok: 'tidak',
    jkn: 'ya',
    air_bersih: 'ya',
    jamban_sehat: 'tidak',
  },
  arc: {
    sinopsis:
      'Rumah panggung di tepi Kali Gede; sekeluarga masih turun ke sungai untuk buang air. Pak Raharjo buruh tani yang gengsinya setipis dinding anyaman rumahnya.',
    kunjungan: [
      {
        id: 'raharjo_k1',
        judul: 'Jalan Setapak ke Sungai',
        pembuka:
          'Pagi masih berkabut ketika kamu tiba di ujung Dusun Kali Gede. Rumah panggung keluarga Raharjo berdiri miring di bibir tebing sungai, dindingnya anyaman bambu yang sudah memutih. Bu Sumiati tergopoh-gopoh menggelar tikar pandan, setengah kaget setengah malu kedatangan tamu berjas putih.',
        target: ['jamban_sehat'],
        hambatanSebenarnya: 'kesempatan',
        petunjukHambatan:
          'Halaman belakang habis dimakan tebing sungai dan tidak ada sisa lahan untuk tangki septik; arisan jamban RW tak pernah sampai ke ujung dusun. Keluarga ini MAU — yang tidak ada adalah lahan, biaya, dan akses program.',
        pilihanIngatkan: {
          prompt: 'Tutup dengan langkah sanitasi yang realistis sambil menunggu solusi komunal, bukan sekadar mengulang bahaya diare.',
          pilihan: [
            {
              id: 'raharjo_ingatkan_tepat',
              teks:
                '"Pak Raharjo, sementara usulan tangki komunal diproses, keluarga memakai jamban aman terdekat yang sudah disepakati; saya kembali bersama sanitarian atau kabar dari Pak RW {jadwal}. Bila jalurnya buntu, kita cari opsi lahan lain bersama."',
              tepat: true,
              respons:
                'Pak Raharjo menyebut jamban aman sementara, siapa yang akan dihubungi, dan hari kabar program harus sudah kembali kepadanya.',
            },
            {
              id: 'raharjo_ingatkan_poster',
              teks: '"Ingat ya, Pak: BAB di sungai menyebabkan diare, tifoid, dan cacingan. Tolong hentikan mulai hari ini."',
              tepat: false,
              respons: 'Pak Raharjo mengangguk pada bahayanya, tetapi tidak mendapat tempat pengganti atau kepastian tindak lanjut.',
              catatanPedagogis:
                'Keluarga sudah tahu dan mau berubah; mengulang risiko tanpa membuka kesempatan tidak menghasilkan tindakan yang mungkin dilakukan.',
            },
            {
              id: 'raharjo_ingatkan_nabung',
              teks: '"Mulai sisihkan uang rokok untuk jamban. Kalau sudah cukup, kabari Puskesmas."',
              tepat: false,
              respons: 'Pak Raharjo kembali merasa dipermalukan, dan masalah lahan tebing serta akses program tetap tidak tersentuh.',
              catatanPedagogis:
                'Nasihat menabung mengabaikan hambatan lahan dan program, sekaligus mengembalikan penutupan ke nada menghakimi.',
            },
          ],
        },
        hotspot: [
          {
            id: 'raharjo_h_setapak',
            label: 'Jalan setapak ke sungai',
            narasi:
              'Di belakang rumah, jalan setapak kecil menuruni tebing ke arah sungai. Tanahnya licin mengkilap, bekas injakan kaki setiap pagi — dan tidak ada bangunan jamban sama sekali di sepanjang halaman belakang.',
            indikator: 'jamban_sehat',
            x: 82,
            y: 68,
          },
          {
            id: 'raharjo_h_tebing',
            label: 'Halaman belakang tergerus tebing',
            narasi:
              'Sisa halaman belakang hanya selebar dua depa, langsung berbatasan dengan tebing sungai. Menggali tangki septik di sini sama saja menggali langsung ke air.',
            x: 68,
            y: 55,
          },
          {
            id: 'raharjo_h_rokok',
            label: 'Bungkus kretek di lincak',
            narasi:
              'Di lincak bambu depan rumah tergeletak bungkus kretek yang tinggal separuh dan asbak dari batok kelapa, penuh puntung. Ada yang merokok tiap hari di rumah ini.',
            indikator: 'tidak_merokok',
            x: 18,
            y: 62,
          },
          {
            id: 'raharjo_h_gentong',
            label: 'Gentong air sumur umum',
            narasi:
              'Dua gentong tanah liat berjajar rapi berisi air jernih. "Ngangsu dari sumur umum ujung gang, Dok," kata Bu Sumiati. Untuk minum dan masak, air keluarga ini aman.',
            indikator: 'air_bersih',
            x: 40,
            y: 74,
          },
          {
            id: 'raharjo_h_kis',
            label: 'Kartu KIS terselip di dinding',
            narasi:
              'Empat kartu KIS PBI terselip rapi di sela dinding anyaman, dibungkus plastik es. Disimpan hati-hati seperti barang paling berharga di rumah ini.',
            indikator: 'jkn',
            x: 55,
            y: 30,
          },
        ],
        dialog: [
          {
            id: 'raharjo_d1',
            narasi:
              'Bu Sumiati menyuguhkan teh tawar sambil terus menunduk. "Maaf, Dok, rumahnya begini... Bapak masih di sawah." Matanya sesekali melirik ke arah tebing belakang, seperti berharap kamu tidak melihat ke sana.',
            pilihan: [
              {
                id: 'raharjo_d1_empati',
                teks: '"Tehnya enak, Bu. Saya justru senang bisa mampir — rumah di pinggir sungai begini adem. Ibu sudah lama tinggal di sini?"',
                gaya: 'empati',
                respons:
                  '"Wah, sejak nikah, Dok. Dua puluh tahun lebih." Bahu Bu Sumiati turun perlahan, senyumnya mulai keluar. "Dulu halaman belakang masih luas, sekarang habis dimakan kali tiap banjir."',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Membuka dengan afirmasi tulus dan pertanyaan terbuka menurunkan rasa terancam — informasi soal tebing yang tergerus justru keluar sendiri.',
              },
              {
                id: 'raharjo_d1_edukasi',
                teks: '"Begini ya, Bu. Saya ke sini mau menjelaskan pentingnya sanitasi. BAB sembarangan itu sumber diare, tifus, cacingan..."',
                gaya: 'edukasi',
                respons:
                  '"I-iya, Dok, tahu kok..." Bu Sumiati mengangguk-angguk cepat, matanya kosong. Tikar pandan tiba-tiba jadi sangat menarik untuk dipandangi.',
                efekTrust: -1,
                tepat: false,
                catatanPedagogis:
                  'Ceramah sebelum bertanya adalah righting reflex klasik — warga mengangguk agar cepat selesai, bukan karena setuju.',
              },
              {
                id: 'raharjo_d1_konfrontasi',
                teks: '"Bu, saya lihat jalan ke sungai itu dipakai tiap hari ya? Keluarga ini masih BAB di kali, kan?"',
                gaya: 'menghakimi',
                respons:
                  'Wajah Bu Sumiati memerah sampai ke telinga. "...Namanya juga orang kampung, Dok." Suaranya berubah datar, dan teh di gelasmu tidak ditawari lagi.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Menodong dengan bukti di menit pertama membuat orang bertahan, bukan berubah. Simpan temuanmu untuk membangun pemahaman, bukan untuk menang.',
              },
            ],
          },
          {
            id: 'raharjo_d2',
            narasi:
              'Obrolan mengalir ke urusan rumah. Bu Sumiati bercerita anak-anaknya sehat, cuma Rini kadang sakit perut. Ini celah alami untuk bertanya hal yang sensitif itu.',
            pilihan: [
              {
                id: 'raharjo_d2_ungkap',
                teks: '"Kalau boleh tahu, Bu — untuk keperluan buang air sehari-hari, keluarga biasanya bagaimana?"',
                gaya: 'refleksi',
                respons:
                  'Bu Sumiati menghela napas panjang. "Ya... ke kali, Dok. Semua di sini begitu. Bukannya nggak mau bikin jamban — tanah belakang habis kena longsor, mau nabung buat tangki septik, hasil buruh tani Bapak habis buat makan. Arisan jamban RW katanya ada, tapi nggak pernah nyampe sini."',
                efekTrust: 1,
                tepat: true,
                ungkap: {
                  indikator: 'jamban_sehat',
                  ambangTrust: 5,
                  responsBohong:
                    '"Ada kok, Dok, jamban di belakang..." Bu Sumiati menjawab cepat, terlalu cepat. "Cuma... lagi rusak sedikit, jadi jarang dipakai. Iya, rusak."',
                },
                catatanPedagogis:
                  'Pertanyaan terbuka tanpa nada menghakimi. Kalau trust cukup, jawaban jujurnya sekaligus membuka hambatan sebenarnya: lahan dan biaya, bukan kemauan.',
              },
              {
                id: 'raharjo_d2_refleksi',
                teks: '"Sakit perutnya Rini sering kambuh ya, Bu? Kedengarannya Ibu sudah berusaha jaga makanannya."',
                gaya: 'empati',
                respons:
                  '"Iya, Dok, padahal jajan sudah saya larang." Bu Sumiati mengerutkan kening. "Apa dari air kali ya, Dok? Anak-anak kan mandinya di bawah..."',
                efekTrust: 1,
                tepat: true,
                catatanPedagogis:
                  'Refleksi yang menghubungkan keluhan anak dengan lingkungan membuat warga sendiri yang mulai menyusun hipotesisnya — change talk tumbuh dari dalam.',
              },
              {
                id: 'raharjo_d2_konfrontasi',
                teks: '"Sakit perut Rini itu ya karena sungai itu, Bu. Selama masih BAB di kali, anak Ibu akan sakit terus. Titik."',
                gaya: 'menghakimi',
                respons:
                  '"..." Bu Sumiati diam lama, lalu berkata pelan, "Kalau gampang bikin jamban, dari dulu kami bikin, Dok." Ada duri di kalimat itu.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Fakta medisnya benar, caranya salah. Menyalahkan tanpa memahami hambatan membuat pintu tertutup — dua konfrontasi beruntun dan kamu dipersilakan pulang.',
              },
            ],
          },
          {
            id: 'raharjo_d3',
            narasi:
              'Pak Raharjo pulang dari sawah, caping masih di tangan. Mendengar kata "jamban", rahangnya mengeras. "Dokter mau nyuruh bikin jamban? Pakai apa? Tanah nggak ada, duit nggak ada."',
            pilihan: [
              {
                id: 'raharjo_d3_refleksi',
                teks: '"Jadi bukannya Bapak tidak mau — tapi lahan di belakang habis kena longsor, dan biayanya belum kepegang. Begitu ya, Pak?"',
                gaya: 'refleksi',
                respons:
                  'Pak Raharjo terdiam, lalu duduk. "...Nah, itu Dokter ngerti." Nada suaranya melunak. "Kalau ada jalannya, ya saya orang pertama yang gali, Dok. Malu saya sama anak wedok, sudah besar masih ke kali."',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Refleksi kompleks: merangkum hambatan tanpa menghakimi. Perhatikan change talk-nya — "saya orang pertama yang gali" — motivasi sudah ada, yang kurang kesempatan.',
              },
              {
                id: 'raharjo_d3_edukasi',
                teks: '"Sebenarnya ada jamban murah, Pak. Model cemplung saja dulu, nanti saya ajari cara bikinnya yang benar."',
                gaya: 'edukasi',
                respons:
                  '"Cemplung di mana, Dok?" Pak Raharjo menunjuk tebing dengan dagunya. "Belakang itu langsung kali. Dokter mau saya cemplung ke air yang dipakai orang sekampung?" Ia tertawa tanpa humor.',
                efekTrust: 0,
                tepat: false,
                catatanPedagogis:
                  'Solusi teknis yang tidak membaca konteks lahan justru menegaskan bahwa kamu tidak mendengarkan. Ini masalah kesempatan, bukan pengetahuan.',
              },
              {
                id: 'raharjo_d3_konfrontasi',
                teks: '"Pak, rokoknya saja sebungkus sehari. Kalau uang rokok ditabung, setahun juga jadi jamban."',
                gaya: 'menghakimi',
                respons:
                  'Pak Raharjo bangkit berdiri. "Dokter datang ke rumah saya buat ngitung-ngitung rokok saya?" Bu Sumiati buru-buru menengahi, tapi udara di ruangan sudah berubah.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Hitungan uang rokok mungkin benar di atas kertas, tapi mempermalukan kepala keluarga di rumahnya sendiri adalah cara tercepat kehilangan seluruh keluarga.',
              },
            ],
          },
        ],
        intervensi: [
          {
            id: 'raharjo_i_arisan',
            nama: 'Sambungkan ke Arisan Jamban & Gotong Royong RW',
            deskripsi:
              'Advokasi ke Pak RW dan sanitarian Puskesmas: masukkan keluarga Raharjo ke daftar arisan jamban gelombang berikutnya, plus usulkan tangki septik komunal di lahan carik desa untuk deretan rumah tepi tebing.',
            cocokUntuk: ['kesempatan'],
            hasilNarasi:
              'Dua minggu kemudian Pak RW datang membawa daftar arisan. Lahan carik di seberang gang disetujui untuk tangki komunal tiga rumah. Pak Raharjo, sesuai janjinya, jadi orang pertama yang menggali.',
          },
          {
            id: 'raharjo_i_pemicuan',
            nama: 'Pemicuan STBM (rasa jijik & malu)',
            deskripsi:
              'Gelar sesi pemicuan ala CLTS di dusun: peta BAB bersama warga, hitung tinja, bangkitkan rasa jijik dan malu supaya warga tergerak membangun jamban sendiri.',
            cocokUntuk: ['motivasi'],
            hasilNarasi:
              'Warga tertunduk malu saat pemetaan... termasuk Pak Raharjo, yang pulang lebih dulu. Ia sudah lama malu, Dok — yang tidak ia punya bukan rasa malu, tapi lahan dan biaya.',
          },
          {
            id: 'raharjo_i_pelatihan',
            nama: 'Pelatihan Membuat Jamban Sehat Sederhana',
            deskripsi:
              'Undang Pak Raharjo ke pelatihan tukang sanitasi Puskesmas: cara membuat kloset leher angsa dan tangki septik sederhana dengan material lokal.',
            cocokUntuk: ['kapabilitas'],
            hasilNarasi:
              'Pak Raharjo pulang pelatihan dengan sertifikat dan ilmu baru — lalu menaruhnya di atas lemari. Ilmu tidak mengubah lebar tanah di belakang rumahnya.',
          },
          {
            id: 'raharjo_i_poster',
            nama: 'Penyuluhan & Poster Bahaya BAB Sembarangan',
            deskripsi:
              'Tempel poster tinja-lalat-makanan di pos ronda dan beri penyuluhan rutin tentang penyakit akibat BAB di sungai.',
            cocokUntuk: ['motivasi'],
            hasilNarasi:
              'Posternya bagus, warnanya mencolok. Anak-anak suka gambar lalatnya. Jalan setapak ke sungai tetap licin bekas injakan setiap pagi.',
          },
        ],
        penutupBerhasil:
          'Pak Raharjo mengantarmu sampai ujung gang, sesuatu yang tadi rasanya mustahil. "Kalau soal lahan carik itu jadi, kabari saya duluan ya, Dok." Di belakangnya, Bu Sumiati melambai dari lincak — kali ini dengan senyum penuh.',
        penutupGagal:
          'Kamu pamit dengan teh yang tak habis diminum. Dari kejauhan, kamu melihat Rini kecil menuruni jalan setapak ke sungai, membawa ember. Besok pagi jalan itu akan tetap licin, dan catatanmu tetap kosong.',
      },
      {
        id: 'raharjo_k2',
        judul: 'Galian di Lahan Carik',
        pembuka:
          'Kamu kembali ke Kali Gede dan suasananya berbeda: di lahan carik seberang gang menganga lubang galian sedalam dada, dikelilingi tumpukan batako. Pak Raharjo melambai dari dalam lubang, bertelanjang dada dan berlumur tanah, seperti orang yang sedang menggali harga dirinya kembali.',
        target: ['jamban_sehat'],
        hambatanSebenarnya: 'kesempatan',
        petunjukHambatan:
          'Galian dan batako sudah ada — semangat tidak pernah jadi masalahnya. Yang mengganjal tinggal satu: kloset leher angsa dan semen penutup, barang yang harus dibeli tunai dan belum kepegang.',
        hotspot: [
          {
            id: 'raharjo_h2_galian',
            label: 'Galian tangki septik komunal',
            narasi:
              'Lubang tangki septik untuk tiga rumah, digali rapi mengikuti mal bambu dari sanitarian. Papan kecil ditancapkan di sebelahnya: "GOTONG ROYONG RT 03".',
            indikator: 'jamban_sehat',
            x: 25,
            y: 60,
          },
          {
            id: 'raharjo_h2_batako',
            label: 'Tumpukan batako sumbangan',
            narasi:
              'Batako tersusun setinggi pinggang, sebagian masih dibungkus terpal. Sumbangan arisan jamban gelombang ini — bukti program akhirnya sampai ke ujung dusun.',
            x: 42,
            y: 70,
          },
          {
            id: 'raharjo_h2_kretek',
            label: 'Bungkus kretek di saku caping',
            narasi:
              'Di caping yang tergantung dekat galian, terselip bungkus kretek baru dan korek gas. Digali siang malam pun, ada satu kebiasaan yang belum ikut ditimbun.',
            indikator: 'tidak_merokok',
            x: 65,
            y: 35,
          },
          {
            id: 'raharjo_h2_celengan',
            label: 'Celengan bambu "KLOSET"',
            narasi:
              'Di lincak, sebatang celengan bambu bertuliskan arang: "KLOSET". Bu Sumiati mengisinya recehan hasil jual pisang. Dikocok, bunyinya masih nyaring — masih jauh dari cukup.',
            x: 80,
            y: 65,
          },
          {
            id: 'raharjo_h2_jadwal',
            label: 'Jadwal arisan di dinding',
            narasi:
              'Selembar kertas jadwal arisan jamban ditempel di dinding anyaman, nama RAHARJO digarisbawahi pensil dua kali. Giliran mereka: dua bulan lagi. Lubang galian tidak bisa menunggu selama itu tanpa jadi kolam.',
            x: 55,
            y: 28,
          },
        ],
        dialog: [
          {
            id: 'raharjo_k2_d1',
            narasi:
              'Pak Raharjo naik dari galian, mengelap tangan ke celana. "Lihat, Dok! Tinggal nunggu kloset sama semen. Kalau hujan datang duluan, ya jadi kolam lele." Ia tertawa, tapi ada cemas di ujungnya.',
            pilihan: [
              {
                id: 'raharjo_k2_d1_afirmasi',
                teks: '"Ini luar biasa, Pak. Dari cerita soal longsor waktu itu sampai jadi galian serapi ini — Bapak yang menggerakkan semua ini."',
                gaya: 'empati',
                respons:
                  'Pak Raharjo menyeka wajah, menyembunyikan bangga. "Ah, ramai-ramai kok, Dok. Tapi ya... saya yang pertama gali. Sesuai janji." Ia menepuk pinggir lubang seperti menepuk pundak teman.',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Afirmasi yang spesifik (menyebut perjalanan dari kunjungan pertama) menguatkan identitas baru: dari "orang yang malu" menjadi "penggerak".',
              },
              {
                id: 'raharjo_k2_d1_edukasi',
                teks: '"Bagus. Nah, jangan lupa jarak tangki ke sumur minimal sepuluh meter, dindingnya harus kedap, pipa udaranya..."',
                gaya: 'edukasi',
                respons:
                  '"Sudah, Dok, sudah." Pak Raharjo menunjuk mal bambu. "Pak sanitarian yang ngukur sendiri. Dokter ini datang jauh-jauh kok langsung ngajari, nggak lihat-lihat dulu." Ia berkata sambil tersenyum, tapi tepat sasaran.',
                efekTrust: -1,
                tepat: false,
                catatanPedagogis:
                  'Edukasi teknis yang tidak diminta pada orang yang sudah bergerak terasa seperti tidak percaya. Amati dulu, afirmasi dulu.',
              },
              {
                id: 'raharjo_k2_d1_konfrontasi',
                teks: '"Dua bulan nunggu arisan? Lama sekali, Pak. Harusnya dari dulu-dulu ditabung, jadi tidak keburu musim hujan begini."',
                gaya: 'menghakimi',
                respons:
                  'Senyum Pak Raharjo padam. "Dari dulu ditabung pakai apa, Dok?" Ia turun kembali ke galian, dan percakapan harus mengejarnya ke bawah.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Menyalahkan masa lalu orang yang sedang berusaha adalah cara mematikan momentum. Fokus MI selalu ke depan: apa langkah kecil berikutnya.',
              },
            ],
          },
          {
            id: 'raharjo_k2_d2',
            narasi:
              'Bu Sumiati menyusul membawa teh — kali ini dengan gula. Obrolan santai, sampai matamu menangkap bungkus kretek di caping. Rokok di rumah dengan dua anak; pelan-pelan, ini juga urusanmu.',
            pilihan: [
              {
                id: 'raharjo_k2_d2_ungkap',
                teks: '"Ngomong-ngomong, Pak — soal rokok, sekarang masih ngudud seperti dulu, atau sudah berkurang?"',
                gaya: 'refleksi',
                respons:
                  'Pak Raharjo nyengir, mengeluarkan bungkus dari caping. "Masih, Dok. Sebungkus bisa dua hari kalau lagi hemat. Tahu sih harusnya berhenti... tapi di sawah, nggak nyekek rokok itu rasanya kayak nggak makan."',
                efekTrust: 1,
                tepat: true,
                ungkap: {
                  indikator: 'tidak_merokok',
                  ambangTrust: 5,
                  responsBohong:
                    '"Wah, sudah berhenti saya, Dok. Sudah dari lebaran kemarin," kata Pak Raharjo, sambil tanpa sadar memindahkan capingnya — beserta isinya — ke balik punggung.',
                },
                catatanPedagogis:
                  'Pertanyaan bergaya "masih atau sudah berkurang" memberi ruang jawaban tanpa vonis. Jawaban jujurnya memetakan fungsi rokok baginya — bahan untuk MI berikutnya.',
              },
              {
                id: 'raharjo_k2_d2_empati',
                teks: '"Celengan bambu bertuliskan KLOSET itu... Bu Sumiati yang bikin ya? Saya kok ikut deg-degan tiap dengar bunyinya."',
                gaya: 'empati',
                respons:
                  'Bu Sumiati tertawa lepas untuk pertama kalinya sejak kamu mengenalnya. "Rini yang nulis itu, Dok! Katanya biar bapaknya semangat. Anak itu yang paling kepingin punya kakus sendiri."',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Menyorot simbol usaha keluarga (celengan, tulisan anak) menguatkan motivasi internal — perubahan yang dirayakan akan dipertahankan.',
              },
              {
                id: 'raharjo_k2_d2_konfrontasi',
                teks: '"Pak, itu di caping ada kretek baru. Katanya nabung buat kloset, tapi rokok jalan terus?"',
                gaya: 'menghakimi',
                respons:
                  'Hening. Pak Raharjo menatap capingnya, lalu menatapmu. "Dokter ini kalau ke sini senengnya meriksa caping orang." Bu Sumiati menunduk; tawanya tadi lenyap tanpa bekas.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Kontradiksi yang kamu temukan adalah data untukmu, bukan senjata untuk menelanjangi warga. Ditodongkan mentah-mentah, ia mengubah rumah jadi ruang sidang.',
              },
            ],
          },
          {
            id: 'raharjo_k2_d3',
            narasi:
              '"Sekarang tinggal klosetnya, Dok," kata Pak Raharjo, menatap galian. "Leher angsa sama dua sak semen. Arisan masih dua bulan, hujan sebulan lagi. Sisanya kami tanggung sendiri lah, pelan-pelan."',
            pilihan: [
              {
                id: 'raharjo_k2_d3_refleksi',
                teks: '"Jadi tenaga sudah siap, galian sudah jadi, yang mengganjal tinggal kloset dan semen sebelum hujan. Kalau itu teratasi, Bapak yakin selesai?"',
                gaya: 'refleksi',
                respons:
                  '"Seminggu, Dok. Seminggu jadi." Pak Raharjo menjawab tanpa jeda, matanya menyala. "Tukangnya ya saya sendiri, wong kemarin diajari mal-nya sama Pak sanitarian."',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Merangkum hambatan spesifik lalu menanyakan komitmen — ini menyiapkan resep sosial yang tepat sasaran: satu barang, satu tenggat.',
              },
              {
                id: 'raharjo_k2_d3_edukasi',
                teks: '"Sambil menunggu, saya sarankan keluarga tetap pakai jamban tetangga dulu, jangan ke sungai. Sudah dekat begini soalnya."',
                gaya: 'edukasi',
                respons:
                  '"Tetangga yang mana, Dok?" Bu Sumiati menyahut pelan. "Sederet sini ya sama-sama belum punya. Makanya digalinya bareng-bareng." Kamu menelan saran itu kembali.',
                efekTrust: 0,
                tepat: false,
                catatanPedagogis:
                  'Saran perilaku harus dicek dulu ke realitas lingkungan. Di kantong ODF terendah, "numpang jamban tetangga" sering bukan pilihan yang ada.',
              },
              {
                id: 'raharjo_k2_d3_konfrontasi',
                teks: '"Pelan-pelan terus, Pak. Nanti keburu hujan, galian ambrol, mulai dari nol lagi. Jangan banyak alasan."',
                gaya: 'menghakimi',
                respons:
                  'Pak Raharjo memandangi galiannya lama sekali. "Iya, Dok," katanya akhirnya — dua kata yang menutup percakapan serapat pintu.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Menyebut usaha orang "banyak alasan" ketika ia sedang berlumur tanah di depanmu — tidak ada teknik komunikasi yang lebih cepat memadamkan api daripada ini.',
              },
            ],
          },
        ],
        intervensi: [
          {
            id: 'raharjo_i2_talangan',
            nama: 'Talangan Kloset dari Dana Desa & Subsidi Sanitarian',
            deskripsi:
              'Advokasi kilat: usulkan ke Kades agar dana desa menalangi kloset leher angsa dan semen untuk tiga KK gotong royong, dipotong dari giliran arisan mereka. Sanitarian mengawal pemasangan sebelum musim hujan.',
            cocokUntuk: ['kesempatan'],
            hasilNarasi:
              'Kades setuju — "wong galiannya sudah ada, masa dibiarkan jadi kolam." Seminggu kemudian, persis seperti janjinya, Pak Raharjo mengirim pesan lewat kader: jambannya jadi. Rini yang pertama memakainya, katanya sambil bernyanyi.',
          },
          {
            id: 'raharjo_i2_sertifikat',
            nama: 'Deklarasi ODF & Sertifikat untuk RT',
            deskripsi:
              'Siapkan seremoni deklarasi bebas BAB sembarangan tingkat RT dengan sertifikat dan papan nama, supaya warga makin terpacu menyelesaikan jambannya.',
            cocokUntuk: ['motivasi'],
            hasilNarasi:
              'Seremoni itu meriah, sertifikatnya dibingkai di pos ronda. Tapi hujan datang lebih dulu daripada kloset — galian Pak Raharjo tergenang, dan deklarasi jadi terasa seperti sindiran.',
          },
          {
            id: 'raharjo_i2_kursus',
            nama: 'Kursus Lanjutan Sanitasi untuk Pak Raharjo',
            deskripsi:
              'Kirim Pak Raharjo ke pelatihan wusan (wirausaha sanitasi) kabupaten agar bisa membuat dan menjual kloset sendiri di kemudian hari.',
            cocokUntuk: ['kapabilitas'],
            hasilNarasi:
              'Ilmunya bertambah, dan mungkin kelak berguna. Tapi pelatihan tiga hari di kabupaten justru menghentikan galian — dan kloset yang dibutuhkan minggu ini tetap tidak terbeli.',
          },
        ],
        penutupBerhasil:
          'Kamu meninggalkan Kali Gede diantar bunyi cangkul yang kembali bekerja. Di lincak, celengan bambu "KLOSET" dikocok Rini keras-keras — sebentar lagi isinya boleh dipakai untuk yang lain. Satu jalan setapak ke sungai akan segera ditumbuhi rumput.',
        penutupGagal:
          'Galian itu masih menganga waktu kamu pamit, dan langit di hulu sudah gelap. Pak Raharjo menatap awan dengan rahang mengeras. Usaha sudah setengah jalan — sisanya kandas bukan di tangannya, tapi di tanganmu.',
      },
    ],
    epilogBerhasil:
      'Di papan STBM Puskesmas, RT 03 Kali Gede akhirnya berwarna hijau. Pak Raharjo kini ikut jadi "tukang jamban" panggilan untuk deretan rumah tepi tebing — orang yang dulu paling malu, sekarang paling lantang mengajak.',
    epilogGagal:
      'Musim hujan menutup tahun dengan kabar dari Kali Gede: galian ambrol, arisan bubar, dan Rini dua kali masuk daftar diare Puskesmas. Jalan setapak ke sungai makin lebar, dan makin licin.',
  },
}

/* ===========================================================================
 * KELUARGA MUSA — RW 3 (Banjar Taman Sari), dekat, cukup.
 * Pak Musa 64 th, DM + hipertensi, tinggal sendiri sejak istrinya wafat.
 * Obat menumpuk bukan karena menolak — ia lupa dan bingung (kapabilitas).
 * ======================================================================== */

const keluargaMusa: KeluargaBinaan = {
  id: 'keluarga_musa',
  namaKeluarga: 'Keluarga Musa',
  rw: 3,
  jarakMenit: 15,
  ekonomi: 'cukup',
  anggota: [
    {
      nama: 'Musa',
      usia: 64,
      jenisKelamin: 'L',
      peran: 'kepala',
      kondisi: ['dm_tipe2', 'hipertensi_esensial'],
    },
  ],
  indikatorAwal: {
    kb: 'na',
    persalinan_faskes: 'na',
    imunisasi_dasar: 'na',
    asi_eksklusif: 'na',
    pantau_tumbuh_kembang: 'na',
    tb_berobat_standar: 'na',
    hipertensi_berobat: 'tidak',
    jiwa_tidak_ditelantarkan: 'na',
    tidak_merokok: 'ya',
    jkn: 'ya',
    air_bersih: 'ya',
    jamban_sehat: 'ya',
  },
  arc: {
    sinopsis:
      'Pensiunan penjaga sekolah yang tinggal sendirian sejak Bu Halimah wafat. Rajin ambil obat DM dan darah tinggi ke Puskesmas — lalu lupa meminumnya. Anak-anaknya jauh di kota.',
    kunjungan: [
      {
        id: 'musa_k1',
        judul: 'Rumah yang Terlalu Sunyi',
        pembuka:
          'Rumah Pak Musa rapi seperti ruang kelas sebelum murid datang: lantai disapu bersih, kursi lurus berjajar, radio kecil menyala menemani sunyi. Ia membukakan pintu dengan wajah cerah — tamu, akhirnya — dan bergegas menyalakan kompor untuk air teh sebelum kamu sempat menolak.',
        target: ['hipertensi_berobat'],
        hambatanSebenarnya: 'kapabilitas',
        petunjukHambatan:
          'Obat rajin diambil tapi menumpuk utuh; kacamata baca patah; jadwal minum obat pagi-malam tertukar-tukar. Ini bukan menolak berobat (motivasi) atau tak bisa ke Puskesmas (kesempatan) — daya ingat dan penglihatannya yang butuh dibantu.',
        hotspot: [
          {
            id: 'musa_h_obat',
            label: 'Kantong obat menumpuk di laci',
            narasi:
              'Laci meja setengah terbuka, penuh kantong obat Puskesmas — amlodipine, metformin — sebagian besar masih utuh dalam plastik, berdebu tipis. Tanggal di etiketnya berlapis-lapis: tiga bulan pengambilan yang nyaris tak tersentuh.',
            indikator: 'hipertensi_berobat',
            x: 72,
            y: 62,
          },
          {
            id: 'musa_h_foto',
            label: 'Foto Bu Halimah dan kalender lama',
            narasi:
              'Di dinding, foto pernikahan yang sudah pudar dan kalender tahun lalu yang tidak pernah diganti. Waktu di rumah ini berhenti pada bulan yang sama ketika Bu Halimah pergi.',
            x: 45,
            y: 25,
          },
          {
            id: 'musa_h_teh',
            label: 'Toples gula dan teh kental manis',
            narasi:
              'Di meja dapur, toples gula pasir ukuran besar hampir kosong — padahal tinggal sendiri. Gelas bekas teh tubruk pekat berjajar tiga. "Teh pahit itu buat orang sakit, Dok," katanya nanti, tanpa merasa sedang membicarakan dirinya.',
            x: 20,
            y: 55,
          },
          {
            id: 'musa_h_kacamata',
            label: 'Kacamata baca patah diikat karet',
            narasi:
              'Sebuah kacamata baca dengan gagang patah, disambung karet gelang, tergeletak di atas tumpukan koran. Dengan ini ia harus membaca tulisan "1x1 pagi" seukuran semut di etiket obat.',
            x: 58,
            y: 48,
          },
          {
            id: 'musa_h_bpjs',
            label: 'Kartu BPJS dan buku Prolanis di toples',
            narasi:
              'Toples bekas biskuit berisi kartu BPJS, buku kontrol Prolanis penuh stempel, dan karcis-karcis antrean Puskesmas. Ia tidak pernah bolos mengambil obat — mengambilnya saja.',
            indikator: 'jkn',
            x: 35,
            y: 70,
          },
        ],
        dialog: [
          {
            id: 'musa_d1',
            narasi:
              'Pak Musa menuangkan teh — manis pekat, tentu saja — dan bercerita panjang tentang murid-murid sekolah tempatnya dulu menjaga. Jelas sekali sudah berhari-hari tidak ada yang mendengarkannya bicara.',
            pilihan: [
              {
                id: 'musa_d1_empati',
                teks: '"Empat puluh tahun jaga sekolah itu bukan waktu yang pendek, Pak. Pasti banyak yang berubah ya, rasanya, sejak pensiun... apalagi sejak Bu Halimah tidak ada."',
                gaya: 'empati',
                respons:
                  'Pak Musa terdiam, mengaduk teh yang tidak perlu diaduk. "Sepi itu, Dok, bukan di rumahnya. Di sini." Ia menepuk dada. "Kalau ibu masih ada, obat-obat itu pasti sudah disendokkan ke tangan saya tiap pagi."',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Empati yang menyentuh kehilangan membuka fakta kunci tanpa satu pun pertanyaan soal obat: dulu Bu Halimah adalah "sistem pengingat"-nya. Sistem itu yang harus diganti.',
              },
              {
                id: 'musa_d1_edukasi',
                teks: '"Pak, sebelum lupa — gula darah dan tensi Bapak harus dikontrol ketat. Teh manis begini sebaiknya dihentikan total mulai hari ini."',
                gaya: 'edukasi',
                respons:
                  '"Oh... iya, Dok, iya." Pak Musa buru-buru menjauhkan gelasnya sendiri, seperti murid ketahuan menyontek. Sisa percakapan ia lebih banyak mengangguk daripada bercerita.',
                efekTrust: -1,
                tepat: false,
                catatanPedagogis:
                  'Instruksi yang menghujani di menit-menit pertama membuat lansia patuh di depanmu dan kembali ke kebiasaan begitu pintu tertutup. Dengarkan dulu ceritanya.',
              },
              {
                id: 'musa_d1_konfrontasi',
                teks: '"Pak Musa, saya buka laci tadi — obatnya numpuk semua. Rajin antre di Puskesmas tapi tidak diminum, itu namanya buang-buang obat negara."',
                gaya: 'menghakimi',
                respons:
                  'Wajah cerah itu padam pelan-pelan seperti lampu kehabisan minyak. "Maaf, Dok. Maaf." Ia membungkuk kecil, dan sisa kunjunganmu terasa seperti memeriksa murid, bukan menemani orang tua.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Lansia yang dipermalukan tidak jadi patuh — ia jadi menyembunyikan. Kunjungan berikutnya laci itu akan terkunci.',
              },
            ],
          },
          {
            id: 'musa_d2',
            narasi:
              'Buku Prolanis di toples penuh stempel hijau; jelas ia rajin datang. Kamu menimbang cara menanyakan hal yang sebenarnya: apa yang terjadi pada obat-obat itu setelah sampai di rumah.',
            pilihan: [
              {
                id: 'musa_d2_ungkap',
                teks: '"Bapak rajin sekali kontrolnya, stempelnya penuh. Kalau di rumah — obat darah tinggi dan gulanya masih rutin terminum, atau kadang ada yang kelewat?"',
                gaya: 'refleksi',
                respons:
                  'Pak Musa menatap lacinya, lalu menyerah dengan tawa kecil yang getir. "Terus terang, Dok... sering lupanya daripada ingatnya. Sudah minum apa belum, saya bingung. Yang bulat kecil itu buat pagi apa malam, tulisannya nggak kebaca. Takut salah, ya akhirnya nggak saya minum sekalian."',
                efekTrust: 1,
                tepat: true,
                ungkap: {
                  indikator: 'hipertensi_berobat',
                  ambangTrust: 4,
                  responsBohong:
                    '"Rutin, Dok, rutin. Tiap pagi habis subuh, tidak pernah lewat." Pak Musa menjawab tangkas sambil menutup laci meja dengan lututnya, pelan sekali, seperti tidak sengaja.',
                },
                catatanPedagogis:
                  'Afirmasi dulu (stempel penuh), baru pertanyaan yang menormalkan lupa ("atau kadang ada yang kelewat?"). Jawaban jujurnya memetakan hambatan kapabilitas dengan presisi: memori, penglihatan, dan rasa takut salah.',
              },
              {
                id: 'musa_d2_refleksi',
                teks: '"Tadi Bapak bilang, kalau Bu Halimah masih ada obatnya pasti disendokkan tiap pagi. Jadi dulu semua urusan obat, Ibu yang pegang ya?"',
                gaya: 'refleksi',
                respons:
                  '"Semuanya, Dok. Saya tinggal buka mulut." Ia tertawa, lalu tawanya menipis. "Empat puluh tahun begitu. Sekarang disuruh hafal sendiri jadwal obat, ya kayak disuruh masak rendang — tahu bentuknya, nggak tahu caranya."',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Refleksi yang memungut kalimat pasien sendiri (teknik OARS) menghasilkan metafora rendang itu — deskripsi hambatan kapabilitas terbaik yang bisa kamu dapat, dari mulutnya sendiri.',
              },
              {
                id: 'musa_d2_konfrontasi',
                teks: '"Bapak kan pensiunan penjaga sekolah, bukan orang bodoh. Masa baca etiket obat saja tidak bisa?"',
                gaya: 'menghakimi',
                respons:
                  '"Ya sudah tua, Dok, matanya." Suaranya masih sopan, tapi ia mulai merapikan gelas — isyarat halus orang Jawa bahwa tamunya sebaiknya segera pamit.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  '"Masa begitu saja tidak bisa" adalah kalimat yang mempermalukan, bukan memampukan. Keterbatasan fungsional lansia butuh alat bantu, bukan tantangan harga diri.',
              },
            ],
          },
          {
            id: 'musa_d3',
            narasi:
              'Radio berganti lagu keroncong. Pak Musa memandang foto di dinding. "Anak-anak nelponnya seminggu sekali, Dok. Sehat-sehat saja jawab saya. Wong mereka jauh, ngapain dibikin mikir."',
            pilihan: [
              {
                id: 'musa_d3_refleksi',
                teks: '"Bapak tidak mau anak-anak khawatir... tapi kalau boleh jujur, Bapak sendiri sebenarnya ingin ditemani mengurus obat-obat ini, ya?"',
                gaya: 'refleksi',
                respons:
                  'Lama sekali Pak Musa tidak menjawab. "...Iya, Dok," katanya akhirnya, pelan seperti mengaku. "Bukan minta ditunggui. Diingatkan saja. Kayak ibu dulu." Ia mengusap kacamata karetnya, entah membersihkan apa.',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Refleksi perasaan dua sisi (melindungi anak vs butuh bantuan) memberi izin untuk jujur. Sekarang kamu tahu bentuk bantuannya: pengingat, bukan pengasuh.',
              },
              {
                id: 'musa_d3_edukasi',
                teks: '"Justru harus dikasih tahu, Pak. Nanti saya telepon anak Bapak, saya jelaskan kondisi gula dan tensinya supaya mereka turun tangan."',
                gaya: 'edukasi',
                respons:
                  '"Jangan, Dok!" Untuk pertama kalinya suaranya meninggi. "Nanti mereka pulang gara-gara saya. Kerjaan mereka bagus-bagus di kota." Ia menggenggam lengan kursi. Niatmu baik; caranya melangkahi orangnya.',
                efekTrust: -1,
                tepat: false,
                catatanPedagogis:
                  'Menyelesaikan masalah pasien tanpa persetujuannya melanggar otonomi — pada lansia yang paling dijaga justru martabatnya sebagai kepala keluarga.',
              },
              {
                id: 'musa_d3_konfrontasi',
                teks: '"Bohong sama anak sendiri itu tidak baik, Pak. Kalau nanti Bapak jatuh sendirian di rumah baru tahu rasa."',
                gaya: 'menakut_nakuti',
                respons:
                  'Pak Musa menegakkan punggung, sisa-sisa wibawa penjaga sekolah empat puluh tahun. "Saya sudah tua, Dok, tapi belum pikun. Jangan ditakut-takuti di rumah sendiri." Radio terdengar sangat keras dalam hening berikutnya.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Menakut-nakuti ("scare tactics") terbukti buruk untuk kepatuhan jangka panjang, dan pada lansia ia melukai hal yang paling ia pertahankan: kemandirian.',
              },
            ],
          },
        ],
        intervensi: [
          {
            id: 'musa_i_kotak',
            nama: 'Kotak Obat Mingguan + Jadwal Gambar',
            deskripsi:
              'Rakit kotak obat 7 hari sekat pagi-malam bertanda gambar matahari dan bulan, tulisan spidol besar. Isi bersama Pak Musa untuk minggu pertama sambil melatih rutinitas: minum obat sehabis subuh, langsung centang kalender.',
            cocokUntuk: ['kapabilitas'],
            hasilNarasi:
              'Kotak itu diletakkannya di sebelah radio — benda yang pasti disentuhnya tiap pagi. Minggu berikutnya sekat-sekatnya kosong sesuai hari, dan kalender di dinding (yang akhirnya berganti tahun) penuh centang spidol biru.',
          },
          {
            id: 'musa_i_ceramah',
            nama: 'Konseling Intensif Komplikasi DM & Hipertensi',
            deskripsi:
              'Jadwalkan sesi edukasi khusus di Puskesmas: bahaya stroke, gagal ginjal, kebutaan, dan luka diabetes bila obat tidak diminum, lengkap dengan lembar balik bergambar.',
            cocokUntuk: ['motivasi'],
            hasilNarasi:
              'Pak Musa datang, menyimak sopan, dan pulang dengan niat berlipat — lalu tetap lupa yang bulat kecil itu untuk pagi atau malam. Ia tidak pernah kekurangan niat, Dok. Ia kekurangan pengingat.',
          },
          {
            id: 'musa_i_antar',
            nama: 'Layanan Antar Obat ke Rumah',
            deskripsi:
              'Atur agar petugas atau kader mengantarkan obat Prolanis langsung ke rumah Pak Musa setiap bulan supaya ia tidak perlu antre di Puskesmas.',
            cocokUntuk: ['kesempatan'],
            hasilNarasi:
              'Obat kini diantar sampai pintu — dan menumpuk di laci yang sama. Akses tidak pernah jadi masalahnya; buku Prolanis-nya penuh stempel sejak dulu.',
          },
          {
            id: 'musa_i_senam',
            nama: 'Ajak Bergabung Senam Prolanis',
            deskripsi:
              'Daftarkan Pak Musa ke senam Prolanis tiap Jumat pagi agar bersemangat, punya teman sesama lansia, dan makin peduli pada kesehatannya.',
            cocokUntuk: ['motivasi'],
            hasilNarasi:
              'Ia jadi bintang senam Jumat pagi — tertawa, punya kawan baru, sehat jiwanya. Tapi pulang senam, pertanyaannya tetap sama di depan laci: "tadi sudah minum apa belum, ya?"',
          },
        ],
        penutupBerhasil:
          'Pak Musa mengantarmu ke pagar dan menjabat tanganmu dengan dua tangan, lama, seperti kepada guru yang pamit pindah tugas. "Minggu depan mampir, Dok. Tehnya saya bikin pahit." Ia tertawa — dan kamu tahu ia akan menepatinya.',
        penutupGagal:
          'Pintu tertutup dengan sopan di belakangmu, radio kembali mengeras dari dalam. Di laci yang setengah terbuka tadi, tiga bulan obat menunggu bulan keempat. Rumah itu kembali rapi, sunyi, dan pelan-pelan berbahaya.',
      },
      {
        id: 'musa_k2',
        judul: 'Kotak Obat Pak Musa',
        pembuka:
          'Kali ini Pak Musa sudah menunggu di teras, kotak obat mingguan dipangku seperti rapor yang mau disetorkan. "Dok! Lihat dulu ini." Ada gelas teh di meja — kali ini warnanya bening kecoklatan, tanpa gunung gula di dasarnya.',
        target: ['hipertensi_berobat'],
        hambatanSebenarnya: 'kapabilitas',
        petunjukHambatan:
          'Rutinitas subuh-radio-obat mulai jalan, tapi sekat Rabu-Kamis minggu ini masih penuh: ia bingung ketika dosis metformin diubah dokter Puskesmas. Setiap perubahan kecil merontokkan hafalannya — sistemnya perlu tahan terhadap perubahan.',
        hotspot: [
          {
            id: 'musa_h2_kotak',
            label: 'Kotak obat: Rabu-Kamis masih penuh',
            narasi:
              'Kotak obat di sebelah radio terisi rapi... kecuali sekat Rabu dan Kamis yang masih penuh. Dua hari bolong, tepat setelah tanggal kontrol terakhirnya di Puskesmas.',
            indikator: 'hipertensi_berobat',
            x: 68,
            y: 55,
          },
          {
            id: 'musa_h2_kalender',
            label: 'Kalender baru penuh centang',
            narasi:
              'Kalender tahun ini akhirnya terpasang, menggantikan yang lama. Centang spidol biru berbaris rapi... lalu berhenti mendadak di hari Rabu, seperti kereta yang mogok di tengah jalan.',
            x: 45,
            y: 25,
          },
          {
            id: 'musa_h2_resep',
            label: 'Kantong obat baru dengan etiket berbeda',
            narasi:
              'Kantong obat pengambilan terakhir: metformin kini ditulis "2x1" — naik dari sebelumnya. Di sampingnya, secarik kertas berisi coretan pensil Pak Musa sendiri: "pagi 1? malam 1? tanya dok."',
            x: 30,
            y: 60,
          },
          {
            id: 'musa_h2_gula',
            label: 'Toples gula dipindah ke rak atas',
            narasi:
              'Toples gula besar itu kini di rak paling atas, harus dipanjat pakai bangku. "Biar mikir dulu sebelum ngambil, Dok," begitu logikanya. Untuk orang yang berjuang sendirian, ini kemenangan kecil yang layak dirayakan.',
            x: 15,
            y: 40,
          },
          {
            id: 'musa_h2_prolanis',
            label: 'Buku Prolanis dan kartu BPJS di meja',
            narasi:
              'Buku kontrol Prolanis kini pindah dari toples ke meja, kartu BPJS terselip di dalamnya, siap dibawa. Stempel bulan ini sudah terisi — untuk urusan datang ke Puskesmas, Pak Musa tidak pernah alpa.',
            indikator: 'jkn',
            x: 52,
            y: 72,
          },
          {
            id: 'musa_h2_hp',
            label: 'Ponsel tua dengan pesan belum dibalas',
            narasi:
              'Ponsel lipat tua tergeletak dekat kotak obat. Layarnya menyala: tiga panggilan tak terjawab dari "SITI ANAKKU". Ia belum menceritakan apa-apa pada anak-anaknya — masih "sehat-sehat saja, kok".',
            x: 82,
            y: 68,
          },
        ],
        dialog: [
          {
            id: 'musa_k2_d1',
            narasi:
              '"Habis subuh, radio nyala, obat masuk, kalender dicentang. Lancar, Dok!" Pak Musa memamerkan kotaknya, bangga betul — lalu buru-buru meletakkannya sebelum kamu sempat melihat terlalu lama.',
            pilihan: [
              {
                id: 'musa_k2_d1_afirmasi',
                teks: '"Ini hebat, Pak. Dari yang dulu obat tiga bulan utuh di laci, sekarang kalender penuh centang. Bapak yang menjalankan ini sendirian, lho."',
                gaya: 'empati',
                respons:
                  '"Iya ya, Dok?" Ia memandangi kalendernya seperti baru menyadari. "Kayak absensi murid. Empat puluh tahun ngabsen orang, baru sekarang ngabsen diri sendiri." Tawanya lepas, tanpa getir kali ini.',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Afirmasi yang membandingkan dengan kondisi awal (bukan dengan target ideal) menguatkan efikasi diri — bahan bakar utama perubahan pada fase aksi.',
              },
              {
                id: 'musa_k2_d1_edukasi',
                teks: '"Bagus. Tapi ingat, Pak, yang penting bukan centangnya — yang penting tensi dan gula darahnya turun. Nanti kita cek lab lagi."',
                gaya: 'edukasi',
                respons:
                  '"Oh... jadi centangnya belum tentu benar ya, Dok." Kebanggaannya mengempis pelan seperti ban bocor halus. Ia meletakkan kotak obat itu agak jauh dari pangkuannya.',
                efekTrust: -1,
                tepat: false,
                catatanPedagogis:
                  'Secara klinis benar, secara MI keliru waktu. Merelatifkan pencapaian pasien tepat saat ia menyetorkannya = menghukum kemajuan.',
              },
              {
                id: 'musa_k2_d1_konfrontasi',
                teks: '"Lancar bagaimana, Pak. Itu sekat Rabu-Kamis masih penuh, saya lihat dari sini."',
                gaya: 'menghakimi',
                respons:
                  'Tangan Pak Musa berhenti di udara. "...Dokter matanya masih bagus ya." Ia menutup kotak itu pelan-pelan, dan sisa cerita yang tadinya mau tumpah, surut kembali ke dalam.',
                butuhHotspot: ['musa_h2_kotak'],
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Temuanmu benar, tapi ditodongkan sebagai tangkapan basah. Beri ia jalan untuk menceritakannya sendiri — kejujuran yang dipaksa bukan kejujuran.',
              },
            ],
          },
          {
            id: 'musa_k2_d2',
            narasi:
              'Teh pahit diseruput. Sekarang saat yang tepat menanyakan minggu ini dengan jujur — dua hari bolong di kotak itu punya cerita, dan caramu bertanya menentukan apakah ceritanya keluar.',
            pilihan: [
              {
                id: 'musa_k2_d2_ungkap',
                teks: '"Minggu ini gimana, Pak — semua sekat kemakan sesuai hari, atau ada yang kelewat? Kelewat satu-dua itu biasa, saya cuma mau tahu polanya."',
                gaya: 'refleksi',
                respons:
                  'Pak Musa menghela napas, membuka kotak, menunjuk Rabu-Kamis. "Ini, Dok. Kemarin kontrol, dokternya bilang obat gulanya jadi dua kali. Lha yang di kotak ini kan susunan lama. Saya bingung mau bongkar dari mana, takut salah... ya dua hari ini nggak saya minum dulu. Nunggu Dokter datang."',
                efekTrust: 1,
                tepat: true,
                ungkap: {
                  indikator: 'hipertensi_berobat',
                  ambangTrust: 5,
                  responsBohong:
                    '"Beres semua, Dok. Kemakan sesuai hari, nggak ada yang lewat." Ia menepuk-nepuk tutup kotak obat itu — yang tetap tertutup, dan tidak ditawarkan untuk dibuka.',
                },
                catatanPedagogis:
                  'Menormalkan kegagalan kecil ("kelewat satu-dua itu biasa") membuat pasien aman melapor jujur. Jawabannya emas: sistem kotak obat rontok setiap resep berubah — itulah yang harus diperkuat.',
              },
              {
                id: 'musa_k2_d2_refleksi',
                teks: '"Saya lihat coretan Bapak di kantong obat baru — \'pagi 1? malam 1? tanya dok\'. Bapak sudah berusaha mencari tahu sendiri ya sebelum saya datang."',
                gaya: 'refleksi',
                respons:
                  '"Lho, kok tahu." Ia tersipu seperti ketahuan berbuat baik. "Daripada salah minum, Dok. Dulu saya diamkan saja obatnya. Sekarang paling tidak saya tulis pertanyaannya." Sebuah lompatan — dari menghindar menjadi bertanya.',
                butuhHotspot: ['musa_h2_resep'],
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Menyoroti perilaku bertanya (bukan kegagalannya minum obat) memperkuat perilaku yang kamu ingin tumbuh: ketika bingung, tanya — jangan berhenti diam-diam.',
              },
              {
                id: 'musa_k2_d2_konfrontasi',
                teks: '"Pak, aturan pakai itu tinggal baca di etiket. Kalau tiap ganti resep berhenti minum obat, kotak sebagus apa pun percuma."',
                gaya: 'menghakimi',
                respons:
                  '"Iya, Dok. Percuma ya." Ia mengulang kata itu pelan — percuma — dan memandangi kotak obatnya seperti memandangi rapor merah. Kamu baru saja meruntuhkan benda yang paling ia banggakan bulan ini.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Kata "percuma" pada usaha pasien adalah racun efikasi diri. Sistem yang gagal saat resep berubah bukan berarti sistemnya percuma — berarti sistemnya perlu satu lapis lagi.',
              },
            ],
          },
          {
            id: 'musa_k2_d3',
            narasi:
              'Ponsel lipat itu bergetar lagi di meja. "SITI ANAKKU". Pak Musa memandangnya, lalu memandangmu, seperti minta izin untuk sesuatu yang belum ia ucapkan.',
            pilihan: [
              {
                id: 'musa_k2_d3_refleksi',
                teks: '"Kalau Mbak Siti tahu bapaknya sekarang punya kotak obat dan kalender penuh centang... kira-kira dia bangga atau khawatir, Pak?"',
                gaya: 'refleksi',
                respons:
                  'Pak Musa menatap ponsel itu lama. "...Bangga kali ya, Dok." Suaranya berubah. "Selama ini saya bilang sehat terus, wong buktinya nggak ada. Sekarang ada buktinya." Ia meraih ponsel. "Nanti malam saya angkat teleponnya. Saya ceritakan kotaknya."',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Pertanyaan hipotetik membuat pasien membayangkan dukungan alih-alih beban. Ia sendiri yang memutuskan membuka diri ke anaknya — keputusan otonom, yang paling awet.',
              },
              {
                id: 'musa_k2_d3_edukasi',
                teks: '"Sebaiknya Mbak Siti dijadikan pengawas minum obat, Pak. Nanti saya buatkan jadwal, dia tinggal menelepon tiap jam obat."',
                gaya: 'edukasi',
                respons:
                  '"Ditelepon tiap jam obat..." Pak Musa mengerutkan kening. "Kayak tahanan kota, Dok." Ia tertawa kecil, tapi idemu jelas ditolak halus sebelum sempat hidup.',
                efekTrust: 0,
                tepat: false,
                catatanPedagogis:
                  'Solusi yang mengubah anak menjadi mandor melukai martabat. Dukungan keluarga harus ditawarkan sebagai koneksi, bukan pengawasan.',
              },
              {
                id: 'musa_k2_d3_konfrontasi',
                teks: '"Itu telepon dari anaknya didiamkan terus, Pak. Nanti kalau Bapak kenapa-kenapa, yang repot dan nyesel ya mereka juga."',
                gaya: 'memaksa',
                respons:
                  'Pak Musa memasukkan ponsel itu ke saku, menjauh dari pandanganmu. "Urusan saya sama anak saya, Dok." Kalimat paling dingin yang pernah keluar dari orang sehangat ini.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Rasa bersalah adalah motivator berumur pendek yang meninggalkan luka panjang. Wilayah keluarga hanya boleh dimasuki lewat pintu yang dibukakan pemiliknya.',
              },
            ],
          },
        ],
        intervensi: [
          {
            id: 'musa_i2_rutinitas',
            nama: 'Perkuat Sistem: Isi Ulang Terpandu + Kartu Aturan Huruf Besar',
            deskripsi:
              'Latih Pak Musa mengisi ulang kotak obat BERSAMA petugas setiap kali resep berubah, plus kartu aturan pakai tulisan besar (spidol, satu baris per obat) yang ditempel di tutup kotak. Sistemnya jadi tahan perubahan resep.',
            cocokUntuk: ['kapabilitas'],
            hasilNarasi:
              'Kini tiap pulang kontrol, Pak Musa mampir ke meja perawat: bongkar-isi kotak bersama, lima menit selesai. Kartu di tutup kotak ditulis tebal-tebal: "GULA: PAGI 1, MALAM 1". Rabu dan Kamis tidak pernah penuh lagi.',
          },
          {
            id: 'musa_i2_kader',
            nama: 'Titipkan Pengawasan Harian ke Kader',
            deskripsi:
              'Minta kader Banjar Taman Sari mampir setiap pagi untuk memastikan Pak Musa sudah minum obat hari itu.',
            cocokUntuk: ['kesempatan'],
            hasilNarasi:
              'Kader rajin mampir seminggu, lalu dua hari sekali, lalu sesempatnya — ia mengurus satu banjar, bukan satu orang. Sistem yang bergantung pada orang lain runtuh saat orang lainnya sibuk; kemandirian Pak Musa justru tidak terlatih.',
          },
          {
            id: 'musa_i2_foto',
            nama: 'Motivasi "Demi Almarhumah"',
            deskripsi:
              'Ajak Pak Musa berjanji di depan foto Bu Halimah untuk tidak pernah melewatkan obat, sebagai penghormatan pada mendiang yang dulu selalu menyendokkan obatnya.',
            cocokUntuk: ['motivasi'],
            hasilNarasi:
              'Ia berjanji dengan mata basah, dan sungguh-sungguh berniat menepatinya. Tapi janji tidak memperbaiki mata yang rabun membaca etiket baru — Rabu dan Kamis berikutnya tetap bolong, kini ditambah rasa bersalah pada mendiang.',
          },
          {
            id: 'musa_i2_testimoni',
            nama: 'Testimoni Penyintas Stroke di Prolanis',
            deskripsi:
              'Hadirkan penyintas stroke di kelas Prolanis untuk bercerita akibat putus obat darah tinggi, agar peserta makin termotivasi patuh.',
            cocokUntuk: ['motivasi'],
            hasilNarasi:
              'Ceritanya menggetarkan satu ruangan. Pak Musa pulang dengan tekad baja dan pertanyaan yang sama persis di depan kotak obatnya: susunan baru ini, yang mana untuk pagi?',
          },
        ],
        penutupBerhasil:
          'Malam itu, kata kader, lampu rumah Pak Musa menyala lebih lama — ia menelepon Siti, satu jam lebih, menceritakan kotak obat dan kalender centangnya. Di kunjungan berikutnya ada kursi ketiga di teras: "Buat Siti, Dok. Bulan depan dia pulang."',
        penutupGagal:
          'Kotak obat itu masih di sebelah radio waktu kamu pamit, sekat Rabu-Kamis tetap penuh, ponsel di saku tetap sunyi. Sistem setengah jadi lebih rapuh daripada tidak ada sistem — dan tidak ada siapa-siapa di rumah ini untuk menangkapnya bila jatuh.',
      },
    ],
    epilogBerhasil:
      'HbA1c Pak Musa turun untuk pertama kalinya sejak tiga tahun. Di kelas Prolanis ia kini punya julukan: "Pak Guru Kotak Obat" — lansia lain menyetorkan kotak mingguan mereka untuk ia periksa, seperti murid menyetor rapor. Siti pulang sebulan sekali, membawa gula jagung.',
    epilogGagal:
      'Kabar itu datang lewat kader pada suatu pagi: Pak Musa ditemukan tetangga dalam keadaan lemas dan bicara meracau, gula darahnya kacau. Di laci mejanya, empat bulan obat tersusun rapi — utuh, berdebu, dan sia-sia.',
  },
}

/* ===========================================================================
 * KELUARGA DEWI — RW 1 (Kampung Kauman), dekat, cukup.
 * Bu Dewi hamil anak keempat, anemia, tidak ber-KB. Ia sebenarnya ingin —
 * Pak Hendra yang menolak (motivasi suami). Gerbang kejujuran soal KB.
 * ======================================================================== */

const keluargaDewi: KeluargaBinaan = {
  id: 'keluarga_dewi',
  namaKeluarga: 'Keluarga Hendra',
  rw: 1,
  jarakMenit: 10,
  ekonomi: 'cukup',
  anggota: [
    { nama: 'Hendra', usia: 38, jenisKelamin: 'L', peran: 'kepala' },
    {
      nama: 'Dewi',
      usia: 34,
      jenisKelamin: 'P',
      peran: 'istri',
      kondisi: ['anemia_defisiensi_bumil'],
    },
    { nama: 'Sinta', usia: 8, jenisKelamin: 'P', peran: 'anak' },
    { nama: 'Bayu', usia: 5, jenisKelamin: 'L', peran: 'anak' },
    { nama: 'Laras', usia: 1, jenisKelamin: 'P', peran: 'anak' },
  ],
  indikatorAwal: {
    kb: 'tidak',
    persalinan_faskes: 'ya',
    imunisasi_dasar: 'ya',
    asi_eksklusif: 'ya',
    pantau_tumbuh_kembang: 'ya',
    tb_berobat_standar: 'na',
    hipertensi_berobat: 'na',
    jiwa_tidak_ditelantarkan: 'na',
    tidak_merokok: 'tidak',
    jkn: 'ya',
    air_bersih: 'ya',
    jamban_sehat: 'ya',
  },
  arc: {
    sinopsis:
      'Bu Dewi hamil anak keempat dengan jarak rapat dan Hb yang terus turun. Ia ingin ber-KB sejak anak ketiga; Pak Hendra, sopir truk yang jarang di rumah, selalu menjawab sama: "banyak anak banyak rezeki."',
    kunjungan: [
      {
        id: 'dewi_k1',
        judul: 'Jemuran Tiga Ukuran',
        pembuka:
          'Rumah petak di gang Kauman itu riuh sejak dari pagarnya: Bayu mengejar ayam, si kecil Laras menangis minta gendong, dan di antara semuanya Bu Dewi menjemur cucian dengan perut dua puluh minggu — wajahnya pucat seperti kertas yang dicuci berulang kali. "Eh, Dokter! Aduh, berantakan, maaf ya, Dok."',
        target: ['kb'],
        hambatanSebenarnya: 'motivasi',
        petunjukHambatan:
          'Bu Dewi hafal jadwal posyandu, rajin periksa hamil, tahu macam-macam KB dari bidan — pengetahuan dan akses bukan masalah. Simpul mati ada pada Pak Hendra: menolak KB karena keyakinan "banyak anak banyak rezeki" dan gengsi pada teman sesama sopir. Kunci perubahan ada di motivasi suami.',
        hotspot: [
          {
            id: 'dewi_h_kia',
            label: 'Buku KIA di meja: lembar KB kosong',
            narasi:
              'Buku KIA merah muda tergeletak terbuka di meja, lecek karena rajin dibawa. Catatan periksa hamil rapi terisi... tapi lembar rencana KB pasca-salin kosong melompong — pada kolom "metode dipilih" ada bekas tulisan pensil yang dihapus.',
            indikator: 'kb',
            x: 55,
            y: 58,
          },
          {
            id: 'dewi_h_fe',
            label: 'Tablet tambah darah masih utuh',
            narasi:
              'Di atas lemari, tiga strip tablet tambah darah dari Puskesmas — dua masih utuh. "Bikin mual, Dok," alasannya nanti. Dengan Hb-nya yang kemarin 9,8, strip utuh ini pelan-pelan jadi masalah serius.',
            x: 78,
            y: 30,
          },
          {
            id: 'dewi_h_rokok',
            label: 'Rokok di saku jaket sopir',
            narasi:
              'Jaket kulit imitasi tergantung di paku dinding — jaket sopir jarak jauh. Dari sakunya menyembul bungkus rokok dan korek. Pak Hendra merokok, dan jaket ini pulang ke rumah berisi asap.',
            indikator: 'tidak_merokok',
            x: 15,
            y: 35,
          },
          {
            id: 'dewi_h_jemuran',
            label: 'Jemuran baju tiga ukuran',
            narasi:
              'Tali jemuran penuh: seragam SD, kaus bocah lelaki, dan popok-popok kecil — tiga anak, tiga ukuran, jarak lahir yang rapat. Sebentar lagi butuh tali baru.',
            x: 35,
            y: 20,
          },
          {
            id: 'dewi_h_kis',
            label: 'Map plastik kartu keluarga & KIS',
            narasi:
              'Map plastik transparan digantung di dinding: KK, akta lahir anak-anak, lima kartu KIS tersusun rapi. Administrasi keluarga ini tertib — Bu Dewi orang yang teratur, kalau saja semua hal bisa ia atur sendiri.',
            indikator: 'jkn',
            x: 68,
            y: 42,
          },
        ],
        dialog: [
          {
            id: 'dewi_d1',
            narasi:
              'Bu Dewi menyeduh sirup sambil sesekali memejamkan mata — pusing, jelas. Laras merengek di gendongannya. "Periksa kemarin katanya kurang darah, Dok. Padahal makan saya banyak, lho."',
            pilihan: [
              {
                id: 'dewi_d1_empati',
                teks: '"Mengurus tiga anak sambil hamil itu pekerjaan tiga orang, Bu. Ibu menjalaninya sendirian tiap hari — wajar kalau badan mulai protes."',
                gaya: 'empati',
                respons:
                  'Mata Bu Dewi tiba-tiba berkaca-kaca, dan ia tertawa untuk menutupinya. "Aduh, Dokter ini. Baru kali ini ada yang bilang begitu." Ia duduk — untuk pertama kalinya sejak kamu datang. "Mas Hendra kan narik terus, Dok, pulangnya seminggu sekali..."',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Validasi beban (bukan sekadar keluhan medis) membuka pintu. Perhatikan: nama Pak Hendra muncul sendiri dalam kalimat pertamanya — ikuti benang itu.',
              },
              {
                id: 'dewi_d1_edukasi',
                teks: '"Kurang darah saat hamil itu bahaya, Bu — bisa perdarahan waktu melahirkan. Tablet tambah darahnya harus diminum tiap hari, jangan bolong."',
                gaya: 'edukasi',
                respons:
                  '"Iya, Dok, diminum kok..." Bu Dewi melirik sekilas ke atas lemari — ke arah strip-strip yang masih utuh itu — lalu cepat-cepat menawarkan sirup. Pintu yang tadinya mau terbuka, mengatup lagi.',
                efekTrust: -1,
                tepat: false,
                catatanPedagogis:
                  'Instruksi di awal menghasilkan "iya, Dok" yang kosong — dan dorongan untuk menyembunyikan ketidakpatuhan. Bandingkan dengan bertanya apa yang membuat tabletnya berat diminum.',
              },
              {
                id: 'dewi_d1_konfrontasi',
                teks: '"Hamil keempat dengan jarak serapat ini ya pasti kurang darah, Bu. Ini kehamilannya memang tidak direncanakan, kan?"',
                gaya: 'menghakimi',
                respons:
                  'Bu Dewi membetulkan gendongan Laras, membeli waktu. "Namanya rezeki, Dok, masa ditolak." Kalimat itu keluar datar, hafalan — kalimat suaminya, dipinjam untuk membela diri dari dokternya.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Menghakimi kehamilan sebagai "kegagalan" memaksa ibu membela keluarganya — dan kalimat pembelaan yang ia pinjam justru milik suaminya. Kamu baru saja mendorongnya ke pihak yang menolak KB.',
              },
            ],
          },
          {
            id: 'dewi_d2',
            narasi:
              'Obrolan sampai ke rencana persalinan. Buku KIA terbuka di antara kalian, lembar rencana KB pasca-salin itu kosong dengan bekas hapusan pensil. Ini saatnya — dan caramu bertanya menentukan apakah kamu mendengar cerita sungguhan.',
            pilihan: [
              {
                id: 'dewi_d2_ungkap',
                teks: '"Untuk setelah lahiran nanti, Bu — soal KB, apa yang sebenarnya Ibu sendiri inginkan?"',
                gaya: 'refleksi',
                respons:
                  'Bu Dewi memandangi lembar kosong itu lama sekali. "Saya sudah kepingin dari anak ketiga, Dok," katanya pelan, nyaris berbisik. "Sudah tanya-tanya bu bidan, mau yang suntik. Yang dihapus di situ... tulisan saya sendiri. Mas Hendra bilang, istri sopir kok pakai begituan, rezeki jangan dipagari. Ya saya nurut, wong saya yang di rumah, dia yang cari uang."',
                efekTrust: 1,
                tepat: true,
                ungkap: {
                  indikator: 'kb',
                  ambangTrust: 5,
                  responsBohong:
                    '"Saya... ikut KB kok, Dok. Suntik, di bu bidan." Bu Dewi menutup buku KIA itu pelan, sampul menghadap ke bawah. "Cuma bulan kemarin kelewat, makanya... ya, begini." Ia tertawa kecil, dan tawa itu tidak sampai ke matanya.',
                },
                catatanPedagogis:
                  'Bertanya keinginan IBU sendiri (bukan "kenapa tidak KB") memisahkan keinginannya dari keputusan suami. Jawaban jujurnya membuka hambatan sebenarnya: motivasi Pak Hendra — dan di situlah intervensimu harus bekerja.',
              },
              {
                id: 'dewi_d2_refleksi',
                teks: '"Tablet tambah darahnya bikin mual ya, Bu? Banyak ibu begitu. Biasanya diminumnya jam berapa?"',
                gaya: 'refleksi',
                respons:
                  '"Pagi, Dok, habis nyuapin anak-anak." Bu Dewi mengernyit. "Langsung mual, kadang muntah. Jadi males, Dok, jujur." Kamu mencatat: diminum malam sebelum tidur dengan air jeruk, mualnya biasanya jauh berkurang — satu masalah kecil yang bisa langsung dibereskan hari ini.',
                efekTrust: 1,
                tepat: true,
                catatanPedagogis:
                  'Menormalkan efek samping lalu menggali pola konsumsi = problem-solving konkret tanpa menghakimi. Kepatuhan Fe naik bukan karena diceramahi, tapi karena mualnya diatasi.',
              },
              {
                id: 'dewi_d2_konfrontasi',
                teks: '"Bu, empat anak dengan Hb 9,8 itu bukan rezeki lagi, itu bahaya. Ibu harus tegas ke suami soal KB, ini nyawa Ibu taruhannya."',
                gaya: 'menggurui',
                respons:
                  '"Iya, Dok. Nanti saya bilang." Jawaban yang terlalu cepat dan terlalu patuh — jenis "iya" yang artinya percakapan ini selesai. Laras dipindah ke gendongan satunya; punggung Bu Dewi kini sedikit membelakangimu.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Menyuruh istri "tegas ke suami" membebankan konflik rumah tangga ke pihak yang paling tidak berdaya menanggungnya. Kalau kuncinya di suami, kamulah yang harus bicara dengan suami.',
              },
            ],
          },
          {
            id: 'dewi_d3',
            narasi:
              'Suara mesin truk di ujung gang, lalu klakson pendek dua kali. "Mas Hendra pulang, Dok," kata Bu Dewi, setengah cerah setengah waswas. Pak Hendra masuk masih dengan jaket kulitnya, mengangguk sopan tapi matanya bertanya: ada perlu apa dokter di rumah saya.',
            pilihan: [
              {
                id: 'dewi_d3_empati',
                teks: '"Wah, pas sekali, Pak. Saya memang berharap bisa ketemu Bapak — Bu Dewi cerita Bapak narik seminggu penuh. Rute ke mana saja, Pak?"',
                gaya: 'empati',
                respons:
                  'Pak Hendra melepas jaket, nada waspadanya turun satu tingkat. "Surabaya-Denpasar, Dok. Berangkat Senin, pulang Sabtu." Ia duduk, menyalakan rokok — lalu menimbang-nimbang, dan mematikannya lagi. "Anak-istri titip yang di rumah, Dok. Makanya saya kerja mati-matian."',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Membuka lewat dunianya (rute, pekerjaan) sebelum urusan medis membuat suami merasa dihormati sebagai kepala keluarga. Kalimat terakhirnya — "kerja mati-matian untuk anak-istri" — adalah nilai inti yang kelak jadi pengungkit MI.',
              },
              {
                id: 'dewi_d3_edukasi',
                teks: '"Kebetulan, Pak. Saya mau jelaskan: kehamilan Bu Dewi ini berisiko karena kurang darah dan jaraknya rapat. Sesudah lahiran, ibu perlu KB. Itu anjuran medis."',
                gaya: 'edukasi',
                respons:
                  'Pak Hendra mendengarkan dengan sopan sampai selesai. "Terima kasih penjelasannya, Dok." Jeda. "Tapi urusan begituan, keluarga saya punya cara sendiri." Sopan, final, tertutup — kuliah lima menitmu memantul di jaket kulitnya.',
                efekTrust: -1,
                tepat: false,
                catatanPedagogis:
                  '"Anjuran medis" tidak mengalahkan keyakinan yang dipegang di depan teman-teman sesama sopir. Sebelum nilai-nilainya dipahami, edukasi hanyalah suara latar.',
              },
              {
                id: 'dewi_d3_konfrontasi',
                teks: '"Pak Hendra, istri Bapak anemia dan hamil keempat. Kalau Bapak masih melarang KB juga, sama saja Bapak membahayakan nyawa istri sendiri."',
                gaya: 'menghakimi',
                respons:
                  'Ruangan itu hening; bahkan Bayu berhenti berlari. "Dokter datang ke rumah saya..." Pak Hendra berdiri, suaranya rendah, "...buat bilang saya mau mencelakai istri saya?" Bu Dewi memegangi lengan suaminya, memohon tanpa kata. Percakapan nyaris putus di sana.',
                narasiLanjutan:
                  'Setelah hening panjang, Pak Hendra duduk lagi demi Bu Dewi, tetapi tubuhnya tetap menghadap pintu. ' +
                  'Ia menyebut keluarganya yang dahulu beranak sembilan dengan nada membela diri; percakapan berlanjut, bukan kembali akrab.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Menuduh suami "membahayakan istri" di rumahnya sendiri, di depan istrinya, adalah konfrontasi paling destruktif dalam skenario ini. Ia tidak akan pernah lagi membukakan pintu untuk isu KB — dari siapa pun.',
              },
            ],
          },
          {
            id: 'dewi_d4',
            narasi:
              'Pak Hendra bercerita bapaknya dulu anak sembilan. "Buktinya jadi orang semua, Dok. Rezeki itu Yang Atas yang ngatur." Tapi matanya melirik Bu Dewi yang pucat menggendong Laras — sekilas saja, tapi kamu menangkapnya.',
            pilihan: [
              {
                id: 'dewi_d4_refleksi',
                teks: '"Bapak kerja mati-matian demi anak-istri — berangkat Senin pulang Sabtu. Buat Bapak, jadi kepala keluarga yang baik itu artinya apa saja, selain mencukupi rezeki?"',
                gaya: 'refleksi',
                respons:
                  'Pak Hendra menyandarkan punggung, pertanyaan itu jelas belum pernah mampir padanya. "...Ya njaga mereka, Dok. Jangan sampai kenapa-kenapa." Ia melirik istrinya lagi, kali ini lebih lama. "Dewi itu... dari hamil ketiga sebenarnya sudah sering pingsan-pingsan. Saya di jalan terus, mikirnya ya cuma dari telepon." Sesuatu di suaranya mulai bergeser.',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Ini inti MI: pertanyaan terbuka yang mengadu dua nilai Pak Hendra sendiri — "banyak anak banyak rezeki" vs "menjaga anak-istri jangan sampai kenapa-kenapa". Ambivalensi yang lahir dari nilainya sendiri jauh lebih kuat daripada seribu anjuran medis.',
              },
              {
                id: 'dewi_d4_edukasi',
                teks: '"Zaman bapaknya Bapak itu beda, Pak. Sekarang biaya sekolah mahal. Secara ekonomi, dua-tiga anak itu jauh lebih masuk akal daripada sembilan."',
                gaya: 'edukasi',
                respons:
                  '"Berarti bapak saya salah, gitu, Dok?" Pak Hendra tersenyum tipis, senyum orang yang merasa keluarganya baru saja dinilai. "Kami sembilan bersaudara nggak ada yang jadi maling." Argumen ekonomimu benar di seminar; di ruang tamu ini, ia baru saja menghina sebuah silsilah.',
                efekTrust: -1,
                tepat: false,
                catatanPedagogis:
                  'Melawan keyakinan dengan data langsung memicu pembelaan identitas keluarga. MI tidak berdebat dengan nilai — ia mencari nilai lain milik orang itu sendiri yang menarik ke arah berbeda.',
              },
              {
                id: 'dewi_d4_konfrontasi',
                teks: '"Rezeki yang ngatur Yang Atas, tapi yang sembilan bulan mengandung dan pingsan-pingsan itu istri Bapak, bukan Yang Atas dan bukan Bapak."',
                gaya: 'menghakimi',
                respons:
                  'Sudut rahang Pak Hendra mengeras. "Dokter ini kalau ngomong berani juga ya." Ia tidak marah meledak — lebih buruk: ia menutup diri dengan senyum dingin dan mulai menjawab semua pertanyaanmu dengan "iya" dan "nggak" saja.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Retorikamu tajam dan mungkin benar — dan sepenuhnya kontraproduktif. Sindiran yang menang di debat kehilangan pasiennya. Ini godaan terbesar skenario ini: menjadi pintar alih-alih menjadi berguna.',
              },
            ],
          },
        ],
        intervensi: [
          {
            id: 'dewi_i_obrolan',
            nama: 'Obrolan Timbang Untung-Rugi dengan Pak Hendra',
            deskripsi:
              'Temui Pak Hendra dalam suasana santai saat ia berada di rumah. Bahas untung-rugi KB dari nilai yang ' +
              'ia pegang: menjaga keselamatan istri dan anak. Tawarkan konseling pasangan bersama Bu Dewi di ' +
              'Puskesmas, dengan keputusan akhir tetap di tangan mereka.',
            cocokUntuk: ['motivasi'],
            hasilNarasi:
              'Sabtu sore itu Pak Hendra bercerita dua jam soal jalanan, baru lima belas menit soal KB — dan itu cukup. "Yang penting Dewi nggak kenapa-kenapa, Dok. Soal metode terserah dia, dia yang ngerasain." Selasa depannya, mereka datang berdua ke poli KB. Lembar buku KIA itu akhirnya terisi tinta, bukan pensil.',
          },
          {
            id: 'dewi_i_peraga',
            nama: 'Konseling Alat Peraga Metode KB untuk Bu Dewi',
            deskripsi:
              'Sesi khusus dengan bidan: jelaskan semua metode ke Bu Dewi satu per satu dengan alat peraga — IUD, implan, suntik, pil — lengkap dengan efek samping dan cara kerja.',
            cocokUntuk: ['kapabilitas'],
            hasilNarasi:
              'Bu Dewi menyimak sopan, sesekali menjawab duluan sebelum bidan selesai — ia sudah hafal semua ini dari dulu. Pulangnya ia berbisik, "Yang perlu dijelasin itu bukan saya, Dok." Kamu mengedukasi orang yang sudah setuju.',
          },
          {
            id: 'dewi_i_antar',
            nama: 'Jemput Layanan: KB Gratis Hari Jumat',
            deskripsi:
              'Amankan slot layanan KB gratis hari Jumat untuk Bu Dewi pasca-salin nanti, sekalian diatur penjemputan oleh kader supaya tidak ada alasan akses.',
            cocokUntuk: ['kesempatan'],
            hasilNarasi:
              'Slotnya siap, jemputannya siap — Bu Dewi tidak pernah datang. "Belum dapat izin, Dok," bisiknya pada kader. Akses tidak pernah jadi masalahnya; Puskesmas hanya sepuluh menit dari rumah. Izin itulah yang sepuluh tahun jauhnya.',
          },
          {
            id: 'dewi_i_leaflet',
            nama: 'Leaflet Mitos vs Fakta KB',
            deskripsi:
              'Titipkan leaflet "Mitos & Fakta KB" yang menjawab keraguan umum — KB bikin gemuk, KB memagari rezeki, KB dosa — untuk dibaca pasangan di rumah.',
            cocokUntuk: ['kapabilitas'],
            hasilNarasi:
              'Leaflet itu ditemukan kader sebulan kemudian: jadi alas gelas di meja, bulat bekas tatakan kopi tepat di kata "MITOS". Pak Hendra tidak butuh bacaan — ia butuh percakapan yang menghormatinya.',
          },
        ],
        penutupBerhasil:
          'Kamu pamit ketika magrib hampir jatuh. Di pintu, Pak Hendra menjabat tanganmu — genggaman sopir, keras dan jujur. "Sabtu depan saya di rumah, Dok. Mampirlah." Dari dalam, Bu Dewi mengangkat buku KIA-nya sedikit, seperti mengangkat harapan yang belum berani terlalu tinggi.',
        penutupGagal:
          'Kamu meninggalkan rumah itu dengan sirup yang tak habis dan pertanyaan yang tak terjawab. Di tali jemuran, popok-popok kecil Laras berkibar — sebentar lagi akan bertambah satu ukuran lagi, dan Hb Bu Dewi tidak ikut bertambah.',
      },
      {
        id: 'dewi_k2',
        judul: 'Kata Pak Hendra',
        pembuka:
          'Sabtu sore di gang Kauman; truk sudah diparkir dan Pak Hendra sedang mencuci kabinnya, lengan baju digulung. Melihatmu, ia mematikan selang. "Dok. Ditunggu dari tadi." Di teras, Bu Dewi menyeduh kopi — dua gelas, bukan satu. Kamu diperhitungkan di rumah ini sekarang.',
        target: ['kb'],
        hambatanSebenarnya: 'motivasi',
        petunjukHambatan:
          'Pak Hendra sudah bergeser dari "tidak" menjadi "tapi": takut efek samping membuat istrinya sakit-sakitan, dan gengsi pada teman sesama sopir. Ini sisa-sisa hambatan motivasi — bukan soal pengetahuan, bukan soal akses. Ia butuh cara untuk berubah pikiran tanpa kehilangan muka.',
        hotspot: [
          {
            id: 'dewi_h2_kia',
            label: 'Buku KIA: lembar KB terisi pensil lagi',
            narasi:
              'Buku KIA di meja teras, terbuka di lembar rencana KB pasca-salin. Tulisan pensil kembali mengisi kolom itu — "suntik / implan?" — belum tinta, tapi tidak ada bekas hapusan kali ini.',
            indikator: 'kb',
            x: 60,
            y: 55,
          },
          {
            id: 'dewi_h2_fe',
            label: 'Strip tablet Fe di gelas kosong',
            narasi:
              'Di rak dapur, strip tablet tambah darah kini terpotong rapi per hari, ditaruh dalam gelas bertuliskan spidol "MALAM + AIR JERUK". Trik anti-mual itu dipakai — sisa tabletnya tinggal sedikit. Pipi Bu Dewi hari ini tidak sepucat dulu.',
            x: 25,
            y: 62,
          },
          {
            id: 'dewi_h2_rokok',
            label: 'Bungkus rokok di dasbor truk',
            narasi:
              'Dari teras, dasbor truk terlihat jelas: bungkus rokok dan korek tergeletak di sana. Dipindah dari saku jaket ke kabin — jauh dari anak-anak, katanya nanti. Berkurang mungkin, berhenti belum.',
            indikator: 'tidak_merokok',
            x: 85,
            y: 40,
          },
          {
            id: 'dewi_h2_brosur',
            label: 'Brosur poli KB terlipat di jok',
            narasi:
              'Di jok teras, brosur poli KB Puskesmas terlipat empat — lecek karena berkali-kali dibuka-tutup, bukan karena diremas. Seseorang di rumah ini membacanya diam-diam, berulang kali.',
            x: 45,
            y: 70,
          },
          {
            id: 'dewi_h2_uang',
            label: 'Amplop "TABUNGAN LAHIRAN" di kaleng',
            narasi:
              'Kaleng biskuit di meja berisi amplop bertuliskan "TABUNGAN LAHIRAN" — tebal terisi. Pak Hendra menyiapkan biaya persalinan jauh-jauh hari. Caranya mencintai keluarga memang lewat amplop; tinggal diarahkan agar juga lewat keputusan.',
            x: 70,
            y: 28,
          },
        ],
        dialog: [
          {
            id: 'dewi_k2_d1',
            narasi:
              'Kopi diseruput. Pak Hendra memutar-mutar gelasnya, lalu mulai tanpa dipancing: "Saya mikir-mikir omongan Dokter kemarin. Soal njaga anak-istri." Ia berhenti, mencari kata. "Tapi terus terang, Dok... KB itu saya dengarnya macam-macam."',
            pilihan: [
              {
                id: 'dewi_k2_d1_refleksi',
                teks: '"Bapak sudah memikirkannya seminggu di jalan — dan yang mengganjal sekarang bukan setuju-tidaknya, tapi cerita macam-macam yang Bapak dengar. Boleh saya tahu yang paling mengganggu?"',
                gaya: 'refleksi',
                respons:
                  '"Nah." Pak Hendra mencondongkan badan. "Kata teman pool, istrinya habis suntik KB jadi gembrot, sakit-sakitan, ke mana-mana nggak kuat. Lha kalau Dewi malah jadi begitu, kan sama saja saya nyelakain dia, Dok." Ketakutannya ternyata memakai baju yang sama dengan nilainya: jangan sampai istrinya kenapa-kenapa.',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Refleksi ganda: mengafirmasi proses berpikirnya DAN memisahkan keputusan dari keraguan. Ketakutan yang akhirnya bisa dinamai — efek samping — jauh lebih mudah digarap daripada penolakan tanpa bentuk.',
              },
              {
                id: 'dewi_k2_d1_edukasi',
                teks: '"Macam-macam itu kebanyakan mitos, Pak. Secara ilmiah KB modern itu aman, efek sampingnya ringan dan bisa dikelola. Percayalah pada data, bukan kata orang."',
                gaya: 'edukasi',
                respons:
                  '"Teman saya itu bukan \'kata orang\', Dok. Saya lihat sendiri istrinya." Nada Pak Hendra masih sopan, tapi gelasnya berhenti diputar. Data lawan pengalaman mata kepala sendiri — dan kamu baru saja menyebut pengalaman itu mitos.',
                efekTrust: -1,
                tepat: false,
                catatanPedagogis:
                  'Menyebut kekhawatiran orang sebagai "mitos" sebelum mendengarnya utuh adalah cara tercepat mengubah orang penasaran kembali jadi orang menolak. Validasi dulu, luruskan kemudian.',
              },
              {
                id: 'dewi_k2_d1_konfrontasi',
                teks: '"Yang macam-macam itu sumbernya obrolan pool truk, Pak. Masa soal nyawa istri, Bapak lebih percaya sopir daripada dokter?"',
                gaya: 'menghakimi',
                respons:
                  '"Saya juga sopir, Dok." Dua patah kata, datar, dan kamu langsung tahu harganya. Pak Hendra menyandarkan punggung, jarak di antara kalian kembali selebar minggu lalu.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Merendahkan kelompok rujukannya = merendahkan dia. Orang tidak meninggalkan keyakinan komunitasnya karena dihina; mereka meninggalkannya pelan-pelan, dengan izin untuk tetap jadi bagian komunitas itu.',
              },
            ],
          },
          {
            id: 'dewi_k2_d2',
            narasi:
              'Bu Dewi bergabung, Laras sudah tidur di dalam. Obrolan mengalir — dan pandanganmu lewat begitu saja ke dasbor truk yang terbuka, ke bungkus rokok itu. Pak Hendra menangkap arah matamu dan tersenyum kecut, menunggu.',
            pilihan: [
              {
                id: 'dewi_k2_d2_ungkap',
                teks: '"Soal rokok, Pak — sekarang posisinya bagaimana? Masih seperti dulu, atau sudah mulai digeser?"',
                gaya: 'refleksi',
                respons:
                  'Pak Hendra tertawa pendek, tertangkap tapi tidak tersinggung. "Masih, Dok. Cuma sekarang di kabin saja, nggak di rumah — kasihan Laras, batuknya kemarin lama." Ia memandang bungkus di dasbor itu. "Berhenti total... di jalan itu susah, Dok. Ngantuk lawannya."',
                efekTrust: 1,
                tepat: true,
                ungkap: {
                  indikator: 'tidak_merokok',
                  ambangTrust: 5,
                  responsBohong:
                    '"Sudah berhenti saya, Dok. Dari puasa kemarin, total." Pak Hendra menjawab lancar sambil bangkit menutup pintu truk — pelan, wajar sekali, seperti memang sudah waktunya ditutup.',
                },
                catatanPedagogis:
                  'Pertanyaan "masih atau sudah digeser" mengakui perubahan bukan saklar hidup-mati. Jawaban jujurnya memberi dua hal: kemajuan nyata (tidak merokok di rumah) dan fungsi rokok baginya (melawan kantuk di jalan) — pintu masuk konseling berikutnya.',
              },
              {
                id: 'dewi_k2_d2_empati',
                teks: '"Ngomong-ngomong, saya lihat gelas \'MALAM + AIR JERUK\' di rak. Itu idenya siapa? Pipi Bu Dewi sekarang kelihatan lebih segar, lho."',
                gaya: 'empati',
                respons:
                  '"Mas Hendra itu, Dok!" Bu Dewi menyahut duluan, setengah tertawa. "Pulang narik bawa jeruk sekilo, katanya biar obatnya nggak mual." Pak Hendra pura-pura sibuk dengan kopinya. "Cuma jeruk," gumamnya — tapi telinganya memerah.',
                butuhHotspot: ['dewi_h2_fe'],
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Afirmasi lewat detail kecil (sekilo jeruk) menangkap suami sedang berbuat baik — dan menguatkan identitas barunya sebagai suami yang terlibat dalam kesehatan istri. Identitas itulah yang kelak menandatangani lembar KB.',
              },
              {
                id: 'dewi_k2_d2_konfrontasi',
                teks: '"Rokoknya masih nangkring di dasbor, Pak. Katanya mau menjaga anak-istri, asapnya kok masih dibawa pulang seminggu sekali."',
                gaya: 'menghakimi',
                respons:
                  'Pak Hendra menutup pintu truk dengan sedikit lebih keras dari perlunya. "Satu-satu, Dok." Suaranya masih terkendali, tapi kopi di gelasmu tidak ditawari tambah. Kamu menagih dua perubahan sekaligus dari orang yang baru sanggup satu.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Memakai nilai orang sebagai cambuk ("katanya mau menjaga...") mengubah nilai itu jadi beban. Satu perubahan yang dirawat mengalahkan dua perubahan yang dipaksakan.',
              },
            ],
          },
          {
            id: 'dewi_k2_d3',
            narasi:
              '"Sebenarnya tinggal satu, Dok," kata Pak Hendra akhirnya, memelankan suara sambil melirik ke arah gang. "Teman-teman pool itu... kalau tahu istri saya KB, omongannya ke mana-mana. Dibilang takut istri lah, dipagari rezekinya lah. Kepala keluarga kok..." Ia tidak menyelesaikan kalimatnya.',
            pilihan: [
              {
                id: 'dewi_k2_d3_refleksi',
                teks: '"Jadi kalau soal Bu Dewi, hati Bapak sebenarnya sudah condong — yang berat itu menghadapi meja pool hari Senin. Kalau ada cara supaya keputusan ini tetap terasa sebagai keputusan Bapak sang kepala keluarga, beda cerita?"',
                gaya: 'refleksi',
                respons:
                  'Pak Hendra menatapmu lama, lalu tertawa lepas — tawa orang yang bebannya baru saja dinamai dengan tepat. "Dokter ini bisa aja." Ia menggaruk kepala. "Ya... intinya jangan sampai saya kelihatan disetir, Dok. Wong ini demi Dewi kok. Keputusan saya sendiri." Kalimat terakhir itu ia ucapkan dua kali, seperti sedang berlatih.',
                efekTrust: 2,
                tepat: true,
                catatanPedagogis:
                  'Refleksi ini memisahkan isi keputusan (sudah setuju) dari kemasan sosialnya (takut kehilangan muka). MI yang jeli menggarap kemasan: perubahan harus bisa diceritakan orang itu ke komunitasnya dengan kepala tegak.',
              },
              {
                id: 'dewi_k2_d3_edukasi',
                teks: '"Justru sekarang banyak suami yang mengantar istrinya KB, Pak. Di poli kami hari Jumat penuh. Itu bukan hal yang perlu dipikirkan omongannya."',
                gaya: 'edukasi',
                respons:
                  '"Banyak suami itu bukan sopir pool Kauman, Dok." Pak Hendra tersenyum tipis. Statistik polimu tidak pernah nongkrong di warung kopi pangkalan — dan keputusan ini, baginya, akan diadili di sana.',
                efekTrust: 0,
                tepat: false,
                catatanPedagogis:
                  'Norma sosial tidak dipatahkan dengan norma statistik. Yang ia butuhkan bukan bukti banyak orang melakukannya — tapi cara melakukannya tanpa kehilangan tempat di komunitasnya sendiri.',
              },
              {
                id: 'dewi_k2_d3_konfrontasi',
                teks: '"Jadi nyawa dan kesehatan Bu Dewi kalah sama omongan warung pool? Bapak sendiri yang bilang mau menjaga anak-istri."',
                gaya: 'menghakimi',
                respons:
                  'Wajah Pak Hendra mengeras — bukan marah, tapi malu, dan malu pada laki-laki seperti ini lebih berbahaya dari marah. "Nggak sesederhana itu, Dok." Ia bangkit, menyalakan selang, kembali mencuci truk yang sudah bersih. Percakapan sore ini selesai lebih awal.',
                efekTrust: -2,
                tepat: false,
                catatanPedagogis:
                  'Ia baru saja MEMBUKA kelemahannya (takut omongan teman) — dan kamu memukul tepat di situ. Kepercayaan yang dibalas hukuman tidak akan diberikan dua kali. Rasa malu tidak pernah jadi bahan bakar perubahan yang awet.',
              },
            ],
          },
        ],
        intervensi: [
          {
            id: 'dewi_i2_tokoh',
            nama: 'Ngopi Bertiga: Pak Hendra & Pak Haji Somad',
            deskripsi:
              'Pertemukan Pak Hendra dengan Pak Haji Somad — juragan truk yang disegani anak pool, empat anaknya sarjana, istrinya ber-KB sejak dulu. Bukan penyuluhan: ngopi santai sesama lelaki, biar Pak Hendra mendengar dari orang yang omongannya berlaku di dunianya sendiri.',
            cocokUntuk: ['motivasi'],
            hasilNarasi:
              'Dua jam ngopi, KB cuma disinggung lima menit — Pak Haji hanya bilang, "Ngatur jarak anak itu tanggung jawab lelaki, He. Yang kelas begituan malah yang nggak berani." Senin depannya Pak Hendra menyetor kabar lewat Bu Dewi: "Kata Mas Hendra, habis lahiran langsung daftar poli KB, Dok. Katanya keputusan dia sendiri." Dan memang begitu adanya.',
          },
          {
            id: 'dewi_i2_kelas',
            nama: 'Kelas Konseling Metode Kontrasepsi Berpasangan',
            deskripsi:
              'Daftarkan Pak Hendra dan Bu Dewi ke kelas konseling metode kontrasepsi di Puskesmas: penjelasan lengkap semua pilihan, efektivitas, dan efek samping oleh bidan koordinator.',
            cocokUntuk: ['kapabilitas'],
            hasilNarasi:
              'Pak Hendra hadir, bertanya dua kali, memahami semuanya — pengetahuan memang tidak pernah jadi masalahnya. Pulangnya ia tetap gelisah soal yang tak diajarkan di kelas: apa kata anak pool hari Senin.',
          },
          {
            id: 'dewi_i2_keliling',
            nama: 'Layanan KB Keliling ke Rumah',
            deskripsi:
              'Jadwalkan tim KB keliling datang langsung ke rumah pasca-salin nanti, supaya Bu Dewi tidak perlu ke Puskesmas sama sekali.',
            cocokUntuk: ['kesempatan'],
            hasilNarasi:
              'Tim datang tepat jadwal — dan justru jadi tontonan segang. "Rumah Hendra didatangi mobil KB!" Bagi lelaki yang paling takut omongan orang, kamu baru saja mengumumkan urusannya lewat pengeras suara. Pintu dibuka Bu Dewi dengan wajah pias; Pak Hendra tidak keluar kamar.',
          },
          {
            id: 'dewi_i2_prioritas',
            nama: 'Antrean Prioritas KB Pasca-Salin',
            deskripsi:
              'Amankan antrean prioritas dan pendaftaran dini KB pasca-salin atas nama Bu Dewi, supaya begitu izin suami turun semuanya tinggal jalan.',
            cocokUntuk: ['kesempatan'],
            hasilNarasi:
              'Slot prioritas itu menunggu dengan setia — seperti brosur terlipat empat di jok teras. Semua jalur sudah lapang sejak dulu, Dok; yang belum turun cuma satu kata dari satu orang, dan kata itu tidak antre di loket.',
          },
        ],
        penutupBerhasil:
          'Magrib turun di gang Kauman. Pak Hendra mengantarmu sampai truknya dan berhenti di sana, tangan di kap mesin. "Dok. Makasih nggak pernah maksa-maksa saya." Di teras, Bu Dewi menutup buku KIA — kolom rencana KB kini bertinta biru, dan tak akan dihapus lagi.',
        penutupGagal:
          'Kopi dua gelas itu tinggal ampas ketika kamu pamit. Brosur di jok terlipat kembali jadi empat, rapi, seperti tidak pernah dibuka. Sabtu depan Pak Hendra kembali ke jalan, membawa keputusannya yang belum diputuskan — dan Bu Dewi kembali menunggu, dengan Hb yang tidak ikut menunggu.',
      },
    ],
    epilogBerhasil:
      'Empat puluh hari pasca-salin, Bu Dewi datang ke poli KB — diantar suaminya, yang menunggu di depan dengan wajah orang mengantar keputusannya sendiri. Bayi keempatnya sehat; Hb ibunya merangkak naik. Di pool, kabarnya, Pak Hendra kini yang paling cerewet menyuruh sopir muda "ngatur jarak anak, biar kayak juragan".',
    epilogGagal:
      'Kehamilan itu berakhir di meja rujukan: perdarahan pasca-salin, dua kantong darah, dan tiga hari yang membuat gang Kauman menahan napas. Bu Dewi selamat — kali ini. Buku KIA berikutnya sudah dicetak di gudang Dinkes, menunggu diisi nama yang sama, dua tahun lagi.',
  },
}

export const KELUARGA_DESA_B: KeluargaBinaan[] = [keluargaDewi, keluargaMusa, keluargaRaharjo]

/* ===========================================================================
 * PROFIL KADER — 8 orang, satu per RW. Ketelitian 50-85.
 * Bias = indikator yang cenderung dilaporkan SALAH (persona menjelaskan kenapa);
 * surat laporan mereka kadang menyelipkan keanehan yang membocorkan bias itu.
 * ======================================================================== */

export const KADER_PROFIL: KaderProfil[] = [
  {
    id: 'kader_aminah',
    nama: 'Bu Aminah',
    rw: 1,
    ketelitian: 78,
    bias: ['kb'],
    persona:
      'Guru ngaji Kampung Kauman yang catatannya serapi kitabnya, tapi sungkan setengah mati menanyakan urusan KB — kolom itu diisinya sambil menebak-nebak.',
  },
  {
    id: 'kader_slamet',
    nama: 'Pak Slamet',
    rw: 2,
    ketelitian: 65,
    bias: ['tidak_merokok'],
    persona:
      'Pensiunan hansip yang hafal seisi Krajan; sayangnya sesama perokok dianggapnya bukan perokok — "wong cuma sebatang-dua, masa ditulis".',
  },
  {
    id: 'kader_komang',
    nama: 'Bu Komang Sri',
    rw: 3,
    ketelitian: 85,
    bias: ['hipertensi_berobat'],
    persona:
      'Perawat pensiunan Banjar Taman Sari, paling teliti se-desa, tapi terlalu gampang percaya bila lansia bilang "obatnya rutin kok" — tidak tega membongkar laci orang tua.',
  },
  {
    id: 'kader_gede',
    nama: 'Pak Gede',
    rw: 4,
    ketelitian: 55,
    bias: ['air_bersih', 'jamban_sehat'],
    persona:
      'Petani Tegalrejo yang mengisi formulir sambil lewat di pematang; kolom air dan jamban dicentangnya dari jauh tanpa menengok ke belakang rumah.',
  },
  {
    id: 'kader_endang',
    nama: 'Bu Endang',
    rw: 5,
    ketelitian: 70,
    bias: ['jkn'],
    persona:
      'Ibu PKK Sumber Agung yang hafal nama seisi kampung sampai ke cucunya, tapi yakin betul "zaman sekarang semua orang pasti sudah punya BPJS".',
  },
  {
    id: 'kader_darman',
    nama: 'Pak Darman',
    rw: 6,
    ketelitian: 58,
    bias: ['jamban_sehat'],
    persona:
      'Ketua RT Kali Gede merangkap kader; soal jamban tetangganya sendiri ia menulis "ada" saja — tidak enak menanyakan hal yang bisa bikin orang tersinggung sedusun.',
  },
  {
    id: 'kader_ketut',
    nama: 'Bu Ketut Ayu',
    rw: 7,
    ketelitian: 60,
    bias: ['kb', 'asi_eksklusif'],
    persona:
      'Kader senior Bukit Sari yang dihormati sebanjar, tapi pantang baginya menanyakan KB dan ASI kepada menantu orang — "itu urusan dapur orang, tiang tidak berani".',
  },
  {
    id: 'kader_yusuf',
    nama: 'Mas Yusuf',
    rw: 8,
    ketelitian: 50,
    bias: ['imunisasi_dasar', 'pantau_tumbuh_kembang'],
    persona:
      'Kader termuda di Alas Jati, semangatnya melebihi jam tidurnya; sayang catatan imunisasi dan hasil timbangan posyandu masih sering tertukar antar-bayi.',
  },
]

/* ===========================================================================
 * PROFIL RW — 8 wilayah Desa Sukamaju (total 200 KK).
 * Jarak: RW 1-3 dekat, RW 4-6 sedang, RW 7-8 terpencil.
 * Konsisten dengan keluarga binaan: RW 1 Dewi, RW 2 Santoso, RW 3 Musa,
 * RW 5 Wulan, RW 6 Raharjo, RW 7 Ketut.
 * ======================================================================== */

export const RW_PROFIL: RwProfil[] = [
  { nomor: 1, nama: 'Kampung Kauman', jarak: 'dekat', totalKk: 28 },
  { nomor: 2, nama: 'Kampung Krajan', jarak: 'dekat', totalKk: 27 },
  { nomor: 3, nama: 'Banjar Taman Sari', jarak: 'dekat', totalKk: 26 },
  { nomor: 4, nama: 'Dusun Tegalrejo', jarak: 'sedang', totalKk: 25 },
  { nomor: 5, nama: 'Kampung Sumber Agung', jarak: 'sedang', totalKk: 24 },
  { nomor: 6, nama: 'Dusun Kali Gede', jarak: 'sedang', totalKk: 26 },
  { nomor: 7, nama: 'Banjar Bukit Sari', jarak: 'terpencil', totalKk: 22 },
  { nomor: 8, nama: 'Dusun Alas Jati', jarak: 'terpencil', totalKk: 22 },
]
