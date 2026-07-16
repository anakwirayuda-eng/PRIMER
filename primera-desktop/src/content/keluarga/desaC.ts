/**
 * KELUARGA BINAAN DESA C (M3c) — flagship KIA: arc 3-BABAK pertama di game.
 *
 * keluarga_asih : bumil risiko SANGAT tinggi (38 th, G4P3, riwayat perdarahan
 *                 pascasalin) yang berencana melahirkan di dukun. Tiga kunjungan
 *                 menapaki tiga hambatan berbeda: kepercayaan pada dukun
 *                 (motivasi) → buta tanda bahaya (kapabilitas) → jalan & biaya
 *                 ke PONED (kesempatan). Skoring risiko Poedji Rochjati dianyam
 *                 ke hotspot & dialog — inilah "PregnancyEngine" versi kunjungan.
 *
 * Konvensi id sama dengan desaA: {keluarga}{kunjungan}_{jenis}{urut}.
 * Karma hanya di kunjungan[0] (satu-satunya yang dijadwalkan init).
 */

import type { KeluargaBinaan } from '../types'

export const KELUARGA_DESA_C: KeluargaBinaan[] = [
  /* =========================================================================
   * KELUARGA ASIH — RW 8 (terpencil), miskin — BUMIL RISTI (KIA, M3.16)
   * ======================================================================= */
  {
    id: 'keluarga_asih',
    namaKeluarga: 'Keluarga Bu Asih',
    rw: 8,
    jarakMenit: 40,
    ekonomi: 'miskin',
    anggota: [
      {
        nama: 'Pak Jumadi',
        usia: 44,
        jenisKelamin: 'L',
        peran: 'kepala',
        kondisi: ['perokok_aktif'],
      },
      {
        nama: 'Bu Asih',
        usia: 38,
        jenisKelamin: 'P',
        peran: 'istri',
        kondisi: ['hamil_g4p3', 'riwayat_perdarahan_pascasalin'],
      },
      { nama: 'Rohman', usia: 12, jenisKelamin: 'L', peran: 'anak' },
      { nama: 'Siti', usia: 9, jenisKelamin: 'P', peran: 'anak' },
      { nama: 'Udin', usia: 6, jenisKelamin: 'L', peran: 'anak' },
    ],
    // Bumil aktif: persalinan_faskes adalah rencana persalinan (target arc).
    // Anak bungsu 6 th (bukan balita) → indikator balita na. Hamil → kb na.
    indikatorAwal: {
      kb: 'na',
      persalinan_faskes: 'tidak',
      imunisasi_dasar: 'na',
      asi_eksklusif: 'na',
      pantau_tumbuh_kembang: 'na',
      tb_berobat_standar: 'na',
      hipertensi_berobat: 'na',
      jiwa_tidak_ditelantarkan: 'na',
      tidak_merokok: 'tidak',
      jkn: 'tidak',
      air_bersih: 'ya',
      jamban_sehat: 'ya',
    },
    arc: {
      sinopsis:
        'Bu Asih (38) hamil anak keempat, 7 bulan, belum sekali pun ANC. Tiga anaknya lahir di tangan ' +
        'Mbah Rah, dukun bayi kampung — termasuk yang ketiga, yang membuatnya nyaris kehabisan darah.',
      kunjungan: [
        /* ----------------------------------------------------------------
         * KUNJUNGAN 1 — "Mbah Rah Sudah Menolong Tiga Anak Saya"
         * Hambatan: MOTIVASI (kepercayaan pada dukun + takut rumah sakit).
         * Karma: preeklampsia berat D+20 bila arc diabaikan.
         * -------------------------------------------------------------- */
        {
          id: 'asih_k1',
          judul: 'Mbah Rah Sudah Menolong Tiga Anak Saya',
          pembuka:
            'Rumah bambu di ujung dusun itu jauh dari mana-mana; motormu berlumpur sampai spakbor. ' +
            'Bu Asih menyambut dengan perut yang sudah tampak berat, satu tangan menopang punggung. ' +
            '"Aduh, jauh-jauh, Dok. Saya sehat kok — cuma hamil, bukan sakit."',
          target: ['persalinan_faskes'],
          hambatanSebenarnya: 'motivasi',
          petunjukHambatan:
            'Perlengkapan persalinan dukun sudah disiapkan di kamar dan nama Mbah Rah disebut dengan hormat ' +
            'yang dalam — sementara kata "rumah sakit" membuat wajahnya menutup: kakaknya meninggal di meja ' +
            'operasi caesar. Ini kepercayaan dan ketakutan, bukan soal jarak atau ongkos (itu urusan nanti).',
          hotspot: [
            {
              id: 'ak1_h1',
              label: 'Bungkusan kain & gunting di kamar',
              narasi:
                'Di sudut kamar, sebuah bungkusan kain rapi: kain jarik, gunting, benang, dan uang lima puluh ' +
                'ribu terselip. "Itu titipan buat Mbah Rah, Dok. Biar beliau yang pegang nanti," kata Bu Asih.',
              indikator: 'persalinan_faskes',
              x: 18,
              y: 55,
            },
            {
              id: 'ak1_h2',
              label: 'Buku KIA masih terbungkus plastik',
              narasi:
                'Buku KIA merah muda tergeletak di atas lemari — masih terbungkus plastik kelurahan. Halaman ' +
                'pemeriksaan kehamilan kosong semua. Tujuh bulan, nol kunjungan ANC.',
              x: 66,
              y: 28,
            },
            {
              id: 'ak1_h3',
              label: 'Kaki bengkak di balik daster',
              narasi:
                'Saat Bu Asih duduk, tampak punggung kakinya membekas dalam saat ditekan jari — pitting edema. ' +
                '"Namanya juga hamil tua, Dok. Dulu-dulu juga begini," katanya menepis.',
              x: 45,
              y: 78,
            },
            {
              id: 'ak1_h4',
              label: 'Foto selamatan bayi ketiga',
              narasi:
                'Foto selamatan: bayi digendong perempuan tua bersanggul — Mbah Rah. Pak Jumadi bercerita, ' +
                '"Waktu si Udin lahir, darahnya banyak sekali keluar, Dok. Untung Mbah Rah kasih ramuan, berhenti sendiri."',
              x: 82,
              y: 42,
            },
            {
              id: 'ak1_h5',
              label: 'Bungkus kretek di meja bambu',
              narasi:
                'Dua bungkus kretek dan asbak dari batok kelapa di meja bambu teras. Pak Jumadi merokok ' +
                'di dalam rumah — juga di dekat istrinya yang hamil.',
              indikator: 'tidak_merokok',
              x: 8,
              y: 30,
            },
          ],
          dialog: [
            {
              id: 'ak1_d1',
              narasi:
                '"Anak pertama sampai ketiga semua Mbah Rah yang nolong, Dok," Bu Asih mengelus perutnya. ' +
                '"Orangnya sabar, doanya manjur, dan beliau datang ke rumah. Masa yang keempat ini saya ' +
                'repot-repot ke Puskesmas?"',
              pilihan: [
                {
                  id: 'ak1_d1_a',
                  teks:
                    '"Tiga kali melahirkan lancar bersama orang yang Ibu percaya betul — pantas Ibu tenang. ' +
                    'Boleh saya dengar cerita persalinan yang ketiga? Yang waktu si Udin itu."',
                  gaya: 'refleksi',
                  respons:
                    'Bu Asih terdiam sebentar. "Yang ketiga itu... darahnya memang banyak, Dok. Saya sampai ' +
                    'tidak kuat berdiri tiga hari. Tapi kan akhirnya berhenti." Suaranya melambat di ujung kalimat — ' +
                    'ia sendiri tahu ada yang berbeda dengan cerita itu.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Refleksi menghormati pengalaman pasien DULU, baru menyalakan senter ke bagian cerita yang ' +
                    'retak — perdarahan pascasalin itu pintu masuknya, dan pasien sendiri yang membukanya.',
                },
                {
                  id: 'ak1_d1_b',
                  teks:
                    '"Bu, dukun bayi itu ilegal sejak lama. Kalau terjadi apa-apa, tidak ada alat, tidak ada ' +
                    'obat, tidak ada ambulans. Ibu mempertaruhkan dua nyawa."',
                  gaya: 'konfrontasi',
                  respons:
                    'Wajah Bu Asih mengeras seketika. "Mbah Rah itu sudah nolong separuh kampung ini lahir, Dok. ' +
                    'Termasuk saya sendiri." Pak Jumadi berdehem dari teras. Percakapan membeku.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menyerang figur yang dihormati satu kampung = menyerang kampungnya. Fakta boleh benar, ' +
                    'tapi pintu yang tertutup tidak bisa dimasuki fakta.',
                },
                {
                  id: 'ak1_d1_c',
                  teks:
                    '"Sekarang zamannya melahirkan di fasilitas kesehatan, Bu. Ada program pemerintah, ' +
                    'gratis kalau pakai jaminan. Saya daftarkan ya?"',
                  gaya: 'edukasi',
                  respons:
                    '"Wah, iya, Dok, nanti saya pikir-pikir dulu ya," jawab Bu Asih sambil membenarkan letak ' +
                    'bantal duduk — kalimat sopan yang artinya tidak.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Melompat ke solusi administratif sebelum menyentuh keyakinannya. Ia tidak menolak biaya — ' +
                    'ia belum melihat alasan meninggalkan Mbah Rah.',
                },
              ],
            },
            {
              id: 'ak1_d2',
              narasi:
                'Pak Jumadi ikut duduk, membawa kopi. "Bukannya kami menolak Puskesmas, Dok. Tapi kakaknya ' +
                'bojoku dulu meninggal di rumah sakit — operasi caesar, tidak bangun lagi. Sejak itu bojoku ' +
                'wanti-wanti: jangan sampai dibawa ke meja operasi."',
              pilihan: [
                {
                  id: 'ak1_d2_a',
                  teks:
                    '"Jadi bagi Ibu, rumah sakit itu bukan tempat menolong — tempat kakak Ibu tidak pulang. ' +
                    'Saya paham kenapa Ibu takut. Boleh saya tahu, itu tahun berapa, Bu?"',
                  gaya: 'empati',
                  respons:
                    'Mata Bu Asih berkaca. "Tahun sembilan puluhan, Dok, saya masih gadis. Mbakyu saya ' +
                    'masuknya sudah kejang-kejang, kata orang darahnya naik. Sampai sekarang saya mimpi ' +
                    'buruk kalau ingat lorong rumah sakit itu." — Kejang. Darah naik. Eklampsia yang terlambat.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Empati membuka kisah inti: sang kakak justru meninggal karena eklampsia yang DATANG TERLAMBAT ' +
                    'ke faskes — fakta yang nanti bisa dibingkai ulang: rumah sakit bukan penyebabnya, keterlambatan penyebabnya.',
                },
                {
                  id: 'ak1_d2_b',
                  teks:
                    '"Itu kan tahun sembilan puluhan, Pak. Rumah sakit sekarang beda jauh — alatnya lengkap, ' +
                    'dokternya banyak. Kejadian begitu sudah tidak zaman."',
                  gaya: 'edukasi',
                  respons:
                    '"Beda gimana, Dok. Tetangga dusun sebelah kemarin juga begitu — masuk RS, keluar tinggal nama," ' +
                    'sahut Pak Jumadi cepat. Cerita lawan cerita; kamu kalah jumlah saksi.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Adu anekdot tidak pernah dimenangkan pendatang. Ketakutan berumur tiga puluh tahun tidak ' +
                    'runtuh oleh kalimat "sekarang sudah beda".',
                },
                {
                  id: 'ak1_d2_c',
                  teks:
                    '"Justru karena riwayat keluarga begitu, Ibu makin wajib lahiran di rumah sakit. ' +
                    'Kalau ngeyel di dukun dan kenapa-kenapa, siapa yang mau disalahkan?"',
                  gaya: 'konfrontasi',
                  respons:
                    'Pak Jumadi meletakkan gelas kopinya, keras. "Kami ini sedang cerita musibah keluarga, Dok, ' +
                    'bukan minta disalah-salahkan." Bu Asih menunduk memilin dasternya.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Kata "disalahkan" pada keluarga yang sedang membuka luka = menampar tangan yang baru terulur. ' +
                    'Ancaman menghasilkan pertahanan, bukan perubahan.',
                },
              ],
            },
            {
              id: 'ak1_d3',
              narasi:
                'Kamu membuka buku KIA yang masih terplastik itu dan meletakkannya perlahan di meja. ' +
                'Bu Asih memandanginya seperti memandang rapor anak yang belum pernah diambil.',
              pilihan: [
                {
                  id: 'ak1_d3_a',
                  teks:
                    '"Bu, saya tidak akan memaksa soal tempat lahiran hari ini. Tapi boleh saya periksa ' +
                    'kandungan Ibu sekarang, di sini saja? Gratis, dan Ibu tetap yang memutuskan semuanya."',
                  gaya: 'empati',
                  respons:
                    '"...Di sini saja? Tidak dibawa-bawa?" Bu Asih menimbang, lalu mengangguk. Tensi 150/95. ' +
                    'Kaki bengkak. Kamu memintanya duduk tenang dulu, lalu mengukur ulang — tetap tinggi. ' +
                    'Dari tas kamu keluarkan stik protein urin; garisnya berubah samar: positif satu. ' +
                    'Nyeri kepala hebat, pandangan kabur, nyeri ulu hati — belum ada, katanya, dan kamu mencatat ' +
                    'kata "belum" itu baik-baik. Usia 38. Anak keempat. Riwayat perdarahan. Kamu menuliskan ' +
                    'semuanya di buku KIA — halaman pertama yang akhirnya terisi — dengan satu garis bawah tebal: ' +
                    'HARUS diperiksa bu bidan atau Puskesmas SEGERA, hari ini atau paling lambat besok. ' +
                    'Bukan kontrol biasa.',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'persalinan_faskes',
                    ambangTrust: 5,
                    responsBohong:
                      '"Rencananya ya di bidan, Dok," jawabnya lancar sambil melirik ke arah kamar — ke bungkusan ' +
                      'kain dan gunting yang sudah disiapkan untuk Mbah Rah.',
                  },
                  catatanPedagogis:
                    'Menawarkan pemeriksaan TANPA syarat menyerahkan kendali pada pasien — dan pemeriksaan itu ' +
                    'sendiri yang bicara: 150/95 + edema + usia + paritas = skor risiko yang tak bisa ditawar. ' +
                    'Ingat urutannya: hipertensi onset baru pada kehamilan ≥20 minggu + edema = evaluasi ' +
                    'preeklampsia SEGERA — ulang ukur tensi, cek protein urin, tanyakan gejala berat — ' +
                    'bukan sekadar menjadwalkan kontrol rutin.',
                },
                {
                  id: 'ak1_d3_b',
                  teks:
                    '"Buku KIA ini wajib diisi, Bu. Tujuh bulan kosong begini, nanti saya yang kena teguran ' +
                    'Dinas. Besok Ibu harus ke Puskesmas ya, biar lengkap."',
                  gaya: 'edukasi',
                  respons:
                    '"Oh, kasihan Dokter kalau kena tegur," Bu Asih tersenyum sungkan. "Iya nanti saya usahakan." ' +
                    'Kamu tahu persis arti kalimat itu di dusun ini.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Menjadikan administrasi (dan dirimu) sebagai alasan — bukan keselamatannya. Pasien diminta ' +
                    'menolongmu, padahal seharusnya sebaliknya.',
                },
                {
                  id: 'ak1_d3_c',
                  teks:
                    '"Terus terang, Bu: umur 38, anak keempat, pernah perdarahan. Kalau tetap di dukun, ' +
                    'peluang Ibu meninggal itu nyata. Saya sudah sering lihat yang begini berakhir di mana."',
                  gaya: 'konfrontasi',
                  respons:
                    'Hening. Bu Asih memeluk perutnya, seperti melindungi bayinya dari kata-katamu. ' +
                    '"...Kalau begitu doakan saja saya selamat, Dok." Ia berdiri, mengisyaratkan sore sudah larut.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Statistik kematian yang ditodongkan pada ibu hamil tidak mengubah rencana — hanya membuatnya ' +
                    'berhenti bercerita padamu. Rasa takut butuh jalan keluar, bukan tambahan.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'ak1_i1',
              nama: 'Gandeng Mbah Rah, Bukan Lawan',
              deskripsi:
                'Temui Mbah Rah bersama bidan desa: ajak bermitra resmi (program kemitraan dukun-bidan) — ' +
                'Mbah Rah tetap mendampingi doa & tradisi, bidan yang menolong persalinan, dan ceritakan ulang ' +
                'kisah kakak Bu Asih: yang membunuhnya bukan rumah sakit, tapi datang TERLAMBAT ke rumah sakit. ' +
                'Isi kemitraan yang pertama justru bukan soal hari-H: Bu Asih diantar periksa ke bu bidan atau ' +
                'Puskesmas SEGERA — hari ini atau besok pagi — untuk evaluasi tekanan darah dan protein urin.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Mbah Rah, yang ternyata sudah lama lelah menanggung risiko sendirian, menepuk tangan Bu Asih: ' +
                '"Aku tetap yang mijeti dan doakan kamu, Sih. Tapi sing nulungi lahiran, bu bidan — jaman wis beda." ' +
                'Restu dari mulut itu bernilai seribu penyuluhan. Bu Asih mengangguk, matanya basah. ' +
                'Dan restu itu langsung berjalan: besok paginya Mbah Rah sendiri yang mengantar Bu Asih ke ' +
                'bu bidan — tensi diukur ulang, protein urin dicek, jalur rujukan ke PONED disiapkan sejak ' +
                'hari itu juga, bukan menunggu jadwal kontrol.',
              catatanPedagogis:
                'Intervensi sosial pada kasus berisiko nyawa hanya bermakna bila menyertakan eskalasi medis ' +
                'segera. Kemitraan dukun-bidan di sini bukan sekadar restu untuk persalinan nanti — ' +
                'ia adalah kendaraan yang membawa Bu Asih dievaluasi preeklampsia dalam hitungan hari, ' +
                'bukan minggu.',
              // Tambahan #1: SATU-SATUNYA tindakan yg benar2 mengeskalasi Bu
              // Asih ke pertolongan persalinan formal (preeklampsia berat =
              // risiko nyawa, bukan sekadar hambatan perilaku biasa).
              aksiEskalasi: true,
            },
            {
              id: 'ak1_i2',
              nama: 'Daftarkan Jampersal & JKN',
              deskripsi:
                'Uruskan pendaftaran JKN PBI dan jaminan persalinan supaya biaya bersalin di faskes ' +
                'tidak jadi beban keluarga.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Kartu jaminan selesai dalam seminggu — dan bungkusan kain untuk Mbah Rah tetap di sudut kamar. ' +
                'Biaya memang bukan soalnya hari ini; kepercayaan dan ketakutan itu yang belum tersentuh.',
              catatanPedagogis:
                'Kartu jaminan tidak mengukur tensi. Pada temuan 150/95 + edema di kehamilan 7 bulan, ' +
                'mengurus administrasi tanpa mengeskalasi evaluasi medis SEGERA berarti membiarkan ' +
                'jam preeklampsia terus berjalan — kartu ini saja tidak cukup.',
            },
            {
              id: 'ak1_i3',
              nama: 'Kelas Ibu Hamil di Posyandu',
              deskripsi:
                'Daftarkan Bu Asih ke kelas ibu hamil: senam hamil, materi tanda bahaya, dan latihan ' +
                'perencanaan persalinan bersama bidan.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Undangan kelas ibu hamil tergeletak di meja bambu, belum disentuh. "Ngapain belajar-belajar, ' +
                'wong sudah tiga kali lahiran," katanya pada kader. Pengetahuannya memang kurang — tapi bukan ' +
                'itu yang membuatnya memilih dukun.',
              catatanPedagogis:
                'Kelas ibu hamil membangun pengetahuan dalam hitungan minggu — sedangkan 150/95 + edema ' +
                'menuntut evaluasi preeklampsia dalam hitungan hari. Edukasi tidak menggantikan eskalasi ' +
                'medis segera; kartu ini saja tidak cukup untuk temuan hari ini.',
            },
          ],
          penutupBerhasil:
            'Di teras, Bu Asih memegang buku KIA yang kini ada isinya. "Angka-angka tadi itu... beneran ' +
            'tinggi ya, Dok?" Untuk pertama kalinya, pertanyaannya bukan tentang Mbah Rah — tentang dirinya. ' +
            '"Besok pagi saya ditunggu bu bidan, to? Iya, Dok, saya datang — katanya tensi sama air seninya ' +
            'mau dicek lagi, tidak boleh ditunda-tunda."',
          penutupGagal:
            'Bungkusan kain untuk Mbah Rah masih di sudut kamar saat kamu pamit. Bu Asih melambaikan tangan ' +
            'dengan senyum yang sama seperti saat kamu datang — ramah, hangat, dan sama sekali tidak berubah. ' +
            'Di buku KIA, halaman pemeriksaan kembali menunggu entah sampai kapan.',
          karma: {
            kasusId: 'kia_preeklampsia_berat',
            anggotaIndex: 1,
            jatuhTempoHari: 20,
            narasi:
              'Pagi buta, pintu poli digedor. Bu Asih dipapah Pak Jumadi — wajah sembab, pandangan kabur, ' +
              '"Kepalanya nyeri sekali, Dok, dari semalam. Tadi sempat muntah-muntah." Tensinya 172/112, ' +
              'protein urin +3. Kehamilan 8 bulan yang tak pernah sekali pun diperiksa itu kini datang sendiri — ' +
              'dengan cara yang paling ditakutkan semua orang.',
          },
        },
        /* ----------------------------------------------------------------
         * KUNJUNGAN 2 — "Buku Pink yang Kosong"
         * Hambatan: KAPABILITAS (buta tanda bahaya + skor risiko tak dipahami).
         * -------------------------------------------------------------- */
        {
          id: 'asih_k2',
          judul: 'Buku Pink yang Kosong',
          pembuka:
            'Kunjungan kedua. Buku KIA kini tergeletak di meja — terbuka, tapi hanya di halaman yang ' +
            'kamu tulis. "Saya sudah mau lahiran di bu bidan, Dok. Sudah bulat," sambut Bu Asih. ' +
            '"Cuma... buku ini isinya apa saja to? Saya bolak-balik kok ya mumet sendiri."',
          target: ['persalinan_faskes'],
          hambatanSebenarnya: 'kapabilitas',
          petunjukHambatan:
            'Niat sudah berbelok ke bidan, tapi Bu Asih tak bisa membaca lancar — buku KIA baginya deretan ' +
            'gambar tanpa suara. Ia tak tahu kaki bengkak + pusing = bahaya, tak paham kenapa skornya "tinggi", ' +
            'dan tak ada satu pun orang di rumah yang bisa membacakan. Ini soal pengetahuan & keterampilan, ' +
            'bukan lagi kemauan.',
          hotspot: [
            {
              id: 'ak2_h1',
              label: 'Buku KIA terbuka di halaman yang salah',
              narasi:
                'Buku KIA terbuka di halaman gizi balita — bukan halaman tanda bahaya kehamilan. Sudut-sudut ' +
                'halaman lain masih kaku, belum pernah dibuka. Ada bekas lipatan hanya di halaman bergambar.',
              x: 50,
              y: 45,
            },
            {
              id: 'ak2_h2',
              label: 'Tulisan tempel resep dukun',
              narasi:
                'Di dinding dapur tertempel kertas: gambar daun dan garis-garis tak beraturan. "Itu catatan ' +
                'ramuan dari Mbah Rah — saya gambar sendiri, Dok. Saya tidak bisa nulis huruf," kata Bu Asih polos.',
              x: 78,
              y: 60,
            },
            {
              id: 'ak2_h3',
              label: 'Kaki makin bengkak',
              narasi:
                'Bengkak di kakinya naik sampai tulang kering. Bu Asih menangkap arah pandanganmu: "Bengkak ' +
                'begini biasa to, Dok? Dulu-dulu ya begini." Kali ini cekungan bekas jarimu lama sekali kembali.',
              x: 30,
              y: 80,
            },
            {
              id: 'ak2_h4',
              label: 'Rohman mengerjakan PR di lantai',
              narasi:
                'Rohman (12) mengerjakan PR di lantai dengan tulisan yang rapi. Satu-satunya anggota rumah ini ' +
                'yang lancar membaca — dan tidak pernah terpikir untuk dilibatkan.',
              x: 12,
              y: 40,
            },
          ],
          dialog: [
            {
              id: 'ak2_d1',
              narasi:
                '"Bu bidan kemarin bilang skor saya empat belas, harus lahiran di Puskesmas yang ada PONED-nya," ' +
                'Bu Asih mengeja pelan. "Empat belas itu... maksudnya apa to, Dok? Kok kayak nilai ulangan."',
              pilihan: [
                {
                  id: 'ak2_d1_a',
                  teks:
                    '"Pertanyaan bagus, Bu. Coba kita hitung bareng pakai jari — biar Ibu yang menghitung ' +
                    'sendiri: umur di atas 35, anak keempat, pernah perdarahan... masing-masing ada angkanya."',
                  gaya: 'refleksi',
                  respons:
                    'Jari Bu Asih menekuk satu-satu. "Umur... anak keempat... yang perdarahan itu..." Ia menatap ' +
                    'tangannya sendiri. "Pantes tinggi ya, Dok. Bukan karena saya apes — memang hitungannya begitu." ' +
                    'Skor Poedji Rochjati baru saja masuk akal di sepuluh jari.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Numerasi rendah ≠ tidak bisa paham. Skor risiko yang dihitung PASIEN SENDIRI dengan jarinya ' +
                    'melekat seumur hidup; angka yang diumumkan petugas menguap sebelum pintu ditutup.',
                },
                {
                  id: 'ak2_d1_b',
                  teks:
                    '"Itu skor Poedji Rochjati, Bu. Di atas dua belas artinya kehamilan risiko sangat tinggi, ' +
                    'wajib rujukan terencana ke fasilitas PONED. Ada di lembar skrining ini penjelasannya."',
                  gaya: 'edukasi',
                  respons:
                    '"Oh... iya, Dok," Bu Asih menerima lembar itu dengan dua tangan, sopan — lalu meletakkannya ' +
                    'terbalik di meja. Huruf-huruf itu bisu baginya, dan ia terlalu malu untuk bilang.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Penjelasan teknis + lembar cetak untuk pasien yang tak bisa membaca = tidak ada penjelasan. ' +
                    'Selalu periksa DULU bagaimana pasien paling mudah menerima informasi.',
                },
                {
                  id: 'ak2_d1_c',
                  teks:
                    '"Skor tinggi itu artinya bahaya, Bu. Sudah tidak usah banyak tanya — pokoknya nurut ' +
                    'bu bidan saja, lahiran di PONED."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Inggih, Dok. Nurut." Jawaban patuh yang datar — pertanyaan pertamanya yang lahir dari ' +
                    'rasa ingin tahu barusan kamu matikan sendiri.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    '"Pokoknya nurut" membunuh justru modal terbaik pasien ini: keinginannya MEMAHAMI. Kepatuhan ' +
                    'buta rapuh; pemahaman bertahan saat petugas tidak ada.',
                },
              ],
            },
            {
              id: 'ak2_d2',
              narasi:
                'Kamu menunjuk halaman tanda bahaya di buku KIA — gambar ibu dengan kepala berdenyut, kaki ' +
                'bengkak, perdarahan. "Gambar-gambar ini, Bu, pernah ada yang menjelaskan?"',
              pilihan: [
                {
                  id: 'ak2_d2_a',
                  teks:
                    '"Kita main tebak-tebakan saja, Bu — Ibu ceritakan gambar ini menurut Ibu apa, nanti ' +
                    'saya lengkapi. Yang mana yang pernah Ibu alami sendiri?"',
                  gaya: 'empati',
                  respons:
                    '"Yang ini... kepala cekot-cekot? Saya sering ini, Dok, seminggu ini." Jarinya pindah ke ' +
                    'gambar kaki. "Ini bengkak — lha ini kaki saya persis." Ia mendongak, pelan-pelan pucat. ' +
                    '"Dok... dua gambar ini kalau jadi satu, artinya apa?"',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'persalinan_faskes',
                    ambangTrust: 6,
                    responsBohong:
                      '"Tidak ada yang begini-begini kok, Dok. Sehat semua saya," katanya cepat — sambil ' +
                      'menyembunyikan kaki bengkaknya ke kolong meja.',
                  },
                  catatanPedagogis:
                    'Metode "pasien bercerita dari gambar" mengubah buku bisu jadi cermin: ia MENEMUKAN gejalanya ' +
                    'sendiri di halaman itu. Pusing + bengkak pada bumil risti = alarm preeklampsia yang kini ia kenali.',
                },
                {
                  id: 'ak2_d2_b',
                  teks:
                    '"Ini tanda bahaya kehamilan, Bu: perdarahan, pusing hebat, kaki bengkak, gerak bayi ' +
                    'berkurang, ketuban pecah dini. Kalau ada satu saja, langsung ke faskes. Hafalkan ya."',
                  gaya: 'edukasi',
                  respons:
                    '"Perdarahan, pusing, bengkak..." Bu Asih mengulang tiga, lalu tersendat. "Aduh, apa lagi ' +
                    'tadi, Dok?" Lima poin lisan untuk orang yang tak bisa mencatat — besok tersisa satu.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Isi edukasinya benar, medianya salah. Tanpa alat bantu ingat (gambar, lagu, orang kedua), ' +
                    'daftar hafalan pada pasien buta huruf gugur dalam hitungan jam.',
                },
                {
                  id: 'ak2_d2_c',
                  teks:
                    '"Tujuh bulan bukunya tidak dibuka-buka, Bu. Padahal semua ada di sini. Lain kali ' +
                    'jangan cuma disimpan di atas lemari."',
                  gaya: 'konfrontasi',
                  respons:
                    'Bu Asih tersenyum kecut, menunduk. "Inggih... maaf, Dok." Ia tidak menjelaskan kenapa — ' +
                    'dan kamu baru saja memastikan ia tak akan pernah bilang bahwa ia tak bisa membaca.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menegur "malas membaca" pada orang yang MENYEMBUNYIKAN buta hurufnya adalah salah diagnosis ' +
                    'perilaku yang kejam. Cari dulu kenapa buku itu tak tersentuh.',
                },
              ],
            },
            {
              id: 'ak2_d3',
              narasi:
                'Rohman menyelesaikan PR-nya dan mengintip dari balik pintu, penasaran pada buku pink ' +
                'yang sedang kalian buka. Bu Asih mengibaskan tangan menyuruhnya masuk kamar.',
              pilihan: [
                {
                  id: 'ak2_d3_a',
                  teks:
                    '"Sebentar, Bu — Rohman, sini. Kamu bacanya lancar kan? Mulai hari ini kamu jadi ' +
                    '\'asisten dokter\' untuk Ibu: tiap malam bacakan satu halaman buku ini. Sanggup?"',
                  gaya: 'empati',
                  respons:
                    'Dada Rohman membusung. "Sanggup, Dok!" Ia langsung duduk di samping ibunya dan mengeja ' +
                    'judul halaman: "Tan-da ba-ha-ya ke-ha-mi-lan..." Bu Asih tertawa kecil, antara geli dan ' +
                    'terharu — buku itu akhirnya bersuara di rumah ini.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Solusi kapabilitas terbaik sering sudah tinggal serumah: literasi Rohman adalah aset keluarga. ' +
                    'Anak yang dilibatkan juga jadi pengawas gejala paling rajin sedunia.',
                },
                {
                  id: 'ak2_d3_b',
                  teks:
                    '"Anak kecil tidak usah ikut-ikut urusan orang tua, Bu. Nanti materi kehamilan begini ' +
                    'belum pantas dia baca."',
                  gaya: 'edukasi',
                  respons:
                    'Rohman masuk kamar dengan bahu turun. Bu Asih mengangguk sopan. Satu-satunya pembaca ' +
                    'di rumah ini baru saja kamu pulangkan.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Kepantasan itu soal cara membingkai, bukan alasan membuang sumber daya. Di rumah tanpa ' +
                    'pembaca lain, mengecualikan Rohman = membiarkan buku itu bisu lagi.',
                },
                {
                  id: 'ak2_d3_c',
                  teks:
                    '"Kalau begitu Bapak saja yang wajib membacakan tiap malam. Namanya juga kepala keluarga, ' +
                    'masa tidak bisa meluangkan lima menit."',
                  gaya: 'konfrontasi',
                  respons:
                    'Bu Asih tertawa canggung. "Bapaknya... sami mawon, Dok. Lulus SD saja tidak." Kamu baru ' +
                    'saja mempermalukan dua orang sekaligus dengan satu kalimat.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Asumsi "kepala keluarga pasti bisa baca" adalah bias petugas. Di dusun ini buta aksara ' +
                    'fungsional lintas generasi — petakan dulu, tugaskan kemudian.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'ak2_i1',
              nama: 'Rohman Sang Pembaca + Kartu Gambar Tanda Bahaya',
              deskripsi:
                'Resmikan Rohman sebagai pembaca buku KIA keluarga (satu halaman tiap malam) dan tempelkan ' +
                'kartu BERGAMBAR tanda bahaya buatan Puskesmas di dinding — pusing hebat, kaki bengkak, ' +
                'perdarahan, gerak bayi kurang — cukup gambar, tanpa satu pun huruf.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Seminggu kemudian kader melapor: Bu Asih menghentikannya di jalan sambil menunjuk kakinya — ' +
                '"Kalau bengkaknya begini TAMBAH kepala cekot-cekot, saya harus langsung ke bu bidan, betul?" ' +
                'Kartu di dinding itu kini yang paling hafal seisi rumah: Udin yang enam tahun pun bisa menunjuknya.',
            },
            {
              id: 'ak2_i2',
              nama: 'Antar-Jemput Kader untuk ANC',
              deskripsi:
                'Jadwalkan kader RW 8 mengantar-jemput Bu Asih ke Puskesmas untuk melengkapi ANC ' +
                'yang tertinggal.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'ANC pertama berjalan — tapi di ruang tunggu Bu Asih hanya mengangguk-angguk pada semua ' +
                'penjelasan, lalu di rumah bertanya pada kader: "Tadi bu bidan bilang apa to sebenarnya?" ' +
                'Ia hadir, namun informasinya tetap tak mendarat. Jemputan tidak mengajarkan apa-apa.',
            },
            {
              id: 'ak2_i3',
              nama: 'Sesi Curhat Trauma Rumah Sakit',
              deskripsi:
                'Fasilitasi Bu Asih menceritakan lagi kisah kakaknya dan bertemu ibu-ibu yang pernah ' +
                'melahirkan selamat di PONED, untuk melunakkan ketakutannya pada faskes.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Sesinya hangat dan Bu Asih pulang tenang — tapi ketakutan itu memang sudah lunak sejak ' +
                'kunjungan pertama. Yang belum berubah: ia tetap tak tahu gejala mana yang berbahaya, dan ' +
                'buku pink itu tetap bisu di atas lemari.',
            },
          ],
          penutupBerhasil:
            'Saat kamu pamit, terdengar Rohman mengeja di ruang tengah: "...ka-ki beng-kak... ke-pa-la pu-sing..." ' +
            'dan suara Bu Asih menyahut, "Nah, itu Ibu banget to?" Mereka tertawa. Buku pink itu tidak akan ' +
            'pernah kembali ke atas lemari.',
          penutupGagal:
            'Buku KIA kembali tertutup sebelum kamu sampai pagar. Bu Asih tahu ia "skornya empat belas" — ' +
            'tapi angka itu baginya masih sekadar nilai ulangan yang jelek, bukan alasan bergegas saat ' +
            'kepalanya mulai cekot-cekot nanti.',
        },
        /* ----------------------------------------------------------------
         * KUNJUNGAN 3 — "Jalan ke PONED" (babak ketiga — arc 3-babak M3c)
         * Hambatan: KESEMPATAN (transport, biaya, rencana rujukan terencana).
         * -------------------------------------------------------------- */
        {
          id: 'asih_k3',
          judul: 'Jalan ke PONED',
          pembuka:
            'Kunjungan ketiga, kandungan 8 bulan lewat. Bu Asih kini hafal tanda bahayanya dan mantap ' +
            'melahirkan di faskes — tapi sore ini wajahnya keruh. "Dok, Puskesmas PONED itu satu jam ' +
            'dari sini. Kalau lahirannya malam-malam... naik apa saya?"',
          target: ['persalinan_faskes', 'jkn'],
          hambatanSebenarnya: 'kesempatan',
          petunjukHambatan:
            'Niat sudah bulat, pengetahuan sudah ada — kini tersisa hal-hal yang tak bisa diniatkan: motor ' +
            'satu-satunya dipakai Pak Jumadi kerja, ongkos carter mobil 300 ribu, JKN belum jadi, dan tak ada ' +
            'satu pun rencana siapa-berbuat-apa saat kontraksi datang tengah malam. Murni soal akses & rencana.',
          hotspot: [
            {
              id: 'ak3_h1',
              label: 'Celengan ayam dari tanah liat',
              narasi:
                'Celengan ayam di atas lemari, dikocok Bu Asih dengan cemas: "Baru delapan puluh ribu, Dok. ' +
                'Kata orang carter mobil ke PONED itu tiga ratus. Masih jauh..."',
              x: 70,
              y: 30,
            },
            {
              id: 'ak3_h2',
              label: 'Kartu keluarga di map plastik',
              narasi:
                'Map plastik berisi KK dan KTP tergeletak di meja — disiapkan untuk mengurus JKN, tapi ' +
                'tanggal lahir Bu Asih di KTP dan KK berbeda setahun. "Ditolak terus di kantor desa, Dok."',
              indikator: 'jkn',
              x: 40,
              y: 55,
            },
            {
              id: 'ak3_h3',
              label: 'Kalender dengan tanggal taksiran dilingkari',
              narasi:
                'Di kalender, sebuah tanggal dilingkari spidol — hari taksiran persalinan, ditulis Rohman ' +
                'dari buku KIA. Tiga minggu lagi. Di bawahnya kosong: tidak ada rencana apa pun.',
              x: 15,
              y: 35,
            },
            {
              id: 'ak3_h4',
              label: 'Motor butut tanpa lampu depan',
              narasi:
                'Satu-satunya kendaraan keluarga: motor tua dengan lampu depan mati. Dipakai Pak Jumadi ' +
                'berangkat kerja bakda subuh, pulang magrib. Jalan dusun gelap gulita selepas isya.',
              x: 88,
              y: 70,
            },
          ],
          dialog: [
            {
              id: 'ak3_d1',
              narasi:
                '"Sudah dihitung-hitung sama Bapak, Dok," Bu Asih membuka. "Kalau carter mobil Pak Kaji tiga ' +
                'ratus ribu, itu upah Bapak seminggu. Kalau nunggu motor pulang magrib... lha kalau lahirnya ' +
                'jam dua malam gimana?"',
              pilihan: [
                {
                  id: 'ak3_d1_a',
                  teks:
                    '"Pertanyaan Ibu tepat sekali — dan justru karena itu kita buat AMANAT PERSALINAN: ' +
                    'kita tulis dari sekarang siapa yang mengantar, naik apa, siapa pegang uang, siapa jaga ' +
                    'anak-anak. Ditempel di dinding, semua hafal perannya."',
                  gaya: 'refleksi',
                  respons:
                    'Bu Asih dan Pak Jumadi saling pandang. "Ditulis dari sekarang..." Pak Jumadi mengangguk ' +
                    'pelan. "Kayak ronda ya, Dok — sudah jelas siapa gilirannya sebelum malingnya datang." ' +
                    'Perencanaan persalinan baru saja masuk akal lewat logika ronda kampung.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Amanat persalinan (birth preparedness plan) adalah intervensi kesempatan par excellence: ' +
                    'ia tidak menambah uang atau jalan, tapi menghapus kekacauan pengambilan keputusan di menit genting.',
                },
                {
                  id: 'ak3_d1_b',
                  teks:
                    '"Tiga ratus ribu itu murah dibanding nyawa, Bu. Mulai sekarang sisihkan saja lebih ' +
                    'banyak, kurangi jajan anak-anak dulu sementara."',
                  gaya: 'edukasi',
                  respons:
                    'Pak Jumadi tersenyum tipis yang bukan senyum. "Jajan anak saya sehari dua ribu, Dok. ' +
                    'Mau disisihkan sampai kiamat ya tidak nutut tiga ratus." Kamu baru saja menghitung ' +
                    'ekonomi orang lain dengan dompetmu sendiri.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    '"Sisihkan saja" pada keluarga defisit adalah nasihat kosong. Intervensi kesempatan menuntut ' +
                    'SUMBER DAYA BARU (dana desa, ambulans desa, gotong royong) — bukan realokasi kemiskinan.',
                },
                {
                  id: 'ak3_d1_c',
                  teks:
                    '"Makanya, Bu, dari kemarin-kemarin saya suruh nabung. Kalau dari kunjungan pertama ' +
                    'nurut, sekarang sudah terkumpul."',
                  gaya: 'konfrontasi',
                  respons:
                    'Bu Asih menunduk memandangi celengan ayamnya. Delapan puluh ribu itu hasil ia berjualan ' +
                    'rempeyek dua bulan — dan barusan kamu bilang itu kelalaian.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menyalahkan ke belakang tidak menambah satu rupiah pun ke depan. Keluarga ini datang dengan ' +
                    'usaha nyata; hargai, lalu bangun dari situ.',
                },
              ],
            },
            {
              id: 'ak3_d2',
              narasi:
                'Kamu mengangkat map plastik berisi KK dan KTP yang tanggal lahirnya selisih setahun itu. ' +
                '"Ini yang bikin JKN-nya mentok, ya?"',
              pilihan: [
                {
                  id: 'ak3_d2_a',
                  teks:
                    '"Urusan beda tanggal begini bisa diberesi lewat jalur khusus, Bu — Puskesmas punya ' +
                    'nota kerja sama dengan Dukcapil untuk kasus bumil. Biar saya yang bawa berkasnya, ' +
                    'Ibu tidak perlu bolak-balik kantor desa."',
                  gaya: 'empati',
                  respons:
                    '"Lho... bisa dititipkan begitu, Dok?" Bu Asih memeluk map plastik itu seperti memeluk ' +
                    'ijazah. "Saya sudah tiga kali ke kantor desa, tiga kali disuruh pulang. Kalau Dokter yang ' +
                    'bawa, saya percaya."',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'jkn',
                    ambangTrust: 5,
                    responsBohong:
                      '"JKN-nya sudah diurus Bapak kok, Dok, katanya tinggal jadi," jawabnya cepat — sambil ' +
                      'menyorongkan map plastik itu ke kolong meja dengan kakinya.',
                  },
                  catatanPedagogis:
                    'Untuk keluarga miskin, birokrasi adalah tembok setinggi biaya. Petugas yang mau MEMBAWAKAN ' +
                    'berkas menghapus hambatan yang tiga kali mengalahkan mereka.',
                },
                {
                  id: 'ak3_d2_b',
                  teks:
                    '"Wah, kalau data beda begini memang harus diurus sendiri ke Dukcapil kabupaten, Bu. ' +
                    'Bawa KK, KTP, akta... nanti antre nomor dulu di loket dua."',
                  gaya: 'edukasi',
                  respons:
                    '"Kabupaten..." Bu Asih mengulang pelan. Dua jam perjalanan, ongkos, antre, dengan ' +
                    'kandungan 8 bulan. Map plastik itu kembali ke atas lemari — mungkin untuk selamanya.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Prosedur yang kamu jelaskan benar — dan mustahil untuk kondisinya. Informasi akurat yang ' +
                    'tak terjangkau sama saja dengan pintu yang digambar di tembok.',
                },
                {
                  id: 'ak3_d2_c',
                  teks:
                    '"Kok bisa KTP sama KK beda tanggal lahir, Bu? Dulu waktu bikin tidak diteliti dulu? ' +
                    'Ini jadi panjang kan urusannya."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Yang nulis kan petugasnya, Dok," jawab Pak Jumadi datar. "Kami taunya terima kartu." ' +
                    'Benar juga — dan kamu barusan menyalahkan korban salah ketik.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Kesalahan administrasi negara bukan kelalaian warga. Menginterogasi asal-usulnya membuang ' +
                    'waktu; yang dibutuhkan jalur perbaikannya.',
                },
              ],
            },
            {
              id: 'ak3_d3',
              narasi:
                'Senja hampir habis. Di kalender, tanggal yang dilingkari itu seperti menatap balik. ' +
                'Tiga minggu. "Kalau boleh jujur, Dok," kata Bu Asih pelan, "saya sudah tidak takut ' +
                'rumah sakitnya. Saya takut... jalannya ke sana."',
              pilihan: [
                {
                  id: 'ak3_d3_a',
                  teks:
                    '"Dan itu ketakutan yang paling masuk akal dari semua yang pernah Ibu ceritakan. ' +
                    'Jalan itu tanggung jawab kami juga — desa ini punya dana dan tetangga. Malam ini ' +
                    'biar saya bicara dengan Pak RW soal ambulans desa."',
                  gaya: 'refleksi',
                  respons:
                    'Bu Asih menghela napas panjang — bukan lega yang selesai, tapi lega yang dimulai. ' +
                    '"Kalau jalannya ada, Dok... saya berani." Pak Jumadi menyalami tanganmu dua kali.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Validasi + tindakan konkret di kalimat yang sama. Ketakutan berbasis kenyataan tidak butuh ' +
                    'penenangan — ia butuh jalan yang benar-benar dibangun.',
                },
                {
                  id: 'ak3_d3_b',
                  teks:
                    '"Tenang, Bu, rezeki anak itu selalu ada jalannya. Yang penting berdoa dan pasrah, ' +
                    'nanti pasti ada saja pertolongan."',
                  gaya: 'edukasi',
                  respons:
                    '"Inggih, Dok. Pasrah." Kata itu jatuh seperti batu. Pasrah persis yang membawa kakaknya ' +
                    'terlambat ke rumah sakit tiga puluh tahun lalu.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Fatalisme berbaju hiburan adalah kemunduran: seluruh arc ini justru perjalanan keluar dari ' +
                    '"nanti juga ada jalan". Doa berjalan paling jauh saat rencananya tertulis.',
                },
                {
                  id: 'ak3_d3_c',
                  teks:
                    '"Ya sudah, kalau memang tidak ada kendaraan, lahiran di bidan desa saja. Yang penting ' +
                    'bukan dukun — PONED-nya kalau sempat saja."',
                  gaya: 'konfrontasi',
                  respons:
                    'Bu Asih mengangguk ragu. Skor empat belas, riwayat perdarahan, dan kamu barusan ' +
                    'menurunkan sendiri standar yang susah payah kalian bangun bertiga.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Kompromi klinis karena hambatan logistik = kekalahan sistem yang ditanggung pasien. Bumil ' +
                    'KRST wajib PONED; tugasmu membangun jalannya, bukan menggeser tujuannya.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'ak3_i1',
              nama: 'Amanat Persalinan + Ambulans Desa',
              deskripsi:
                'Tempel amanat persalinan di dinding (siapa mengantar, siapa pegang uang, siapa jaga anak), ' +
                'aktifkan mobil bak Pak Kaji sebagai ambulans desa on-call lewat dana desa, dan bawa sendiri ' +
                'berkas JKN Bu Asih ke jalur khusus bumil — tiga lubang ditambal sekali jalan.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Seminggu kemudian di dinding rumah tertempel kertas bertulisan tangan Rohman: "BU LAHIRAN: ' +
                'Bapak telpon Pak Kaji (gratis, dana desa) — Lek Yem jaga adik-adik — uang di celengan ayam." ' +
                'Kartu JKN datang menyusul. Tanggal yang dilingkari di kalender kini punya rencana lengkap.',
            },
            {
              id: 'ak3_i2',
              nama: 'Penyuluhan Ulang Tanda Bahaya',
              deskripsi:
                'Segarkan lagi materi tanda bahaya kehamilan bersama Rohman dan kartu bergambar, ' +
                'memastikan seisi rumah siaga.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Seisi rumah kini hafal luar kepala — Udin pun bisa menunjuk gambar kaki bengkak. Tapi saat ' +
                'kader bertanya "kalau tengah malam kontraksi, berangkat naik apa?", ruangan itu senyap. ' +
                'Pengetahuan sudah khatam; jalannya yang belum dibangun.',
            },
            {
              id: 'ak3_i3',
              nama: 'Testimoni Ibu-ibu PONED',
              deskripsi:
                'Pertemukan Bu Asih dengan ibu-ibu dusun yang pernah melahirkan selamat di PONED untuk ' +
                'memantapkan hatinya.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Pertemuan itu hangat, tapi Bu Asih pulang dengan pertanyaan yang sama persis: "Mbak-mbak itu ' +
                'semua rumahnya pinggir jalan besar, Dok. Lha saya?" Hatinya sudah lama mantap — dompet dan ' +
                'jalan gelap itu yang belum.',
            },
          ],
          penutupBerhasil:
            'Kamu pulang saat isya, dan lampu depan motormu menyapu kertas amanat persalinan di dinding ' +
            'mereka. Tiga kunjungan: dari bungkusan kain untuk dukun, ke buku pink yang bersuara, ke rencana ' +
            'yang ditulis tangan anak 12 tahun. Jalan ke PONED itu akhirnya ada — kalian yang membangunnya.',
          penutupGagal:
            'Tanggal di kalender itu makin dekat dan tetap sendirian — tanpa nama pengantar, tanpa nomor ' +
            'yang bisa ditelepon, tanpa kartu jaminan. Niat dan ilmu sudah di tangan Bu Asih; malam dan ' +
            'jarak masih milik dusun ini.',
        },
      ],
      epilogBerhasil:
        'Kabar itu datang lewat kader subuh-subuh: Bu Asih melahirkan di PONED semalam — bayi perempuan, ' +
        '2,9 kilo, menangis kencang. Sempat perdarahan lagi seperti yang ditakutkan semua orang, tapi kali ini ' +
        'ada infus terpasang, ada bidan, ada dokter jaga. "Diberi nama Selamet Rahayu, Dok," tulis kader. ' +
        '"Kata Bu Asih, biar ingat terus jalan yang menyelamatkannya."',
      epilogGagal:
        'Kamu mendengarnya dari bidan desa dengan suara tercekat: Bu Asih melahirkan di rumah, ditolong ' +
        'Mbah Rah yang gemetar menelepon ke Puskesmas saat darah tidak kunjung berhenti. Ambulans datang ' +
        'empat puluh menit kemudian — cukup untuk menyelamatkan nyawanya, tidak cukup untuk mencegah ' +
        'transfusi tiga kantong dan tangis Pak Jumadi di lorong PONED yang dulu paling mereka takuti.',
    },
  },
]
