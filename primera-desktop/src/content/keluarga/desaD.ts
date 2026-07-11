/**
 * KELUARGA BINAAN DESA D (M3c) — dua arc 2-babak:
 *
 * keluarga_slamet : anak laki-laki 24 th dengan skizofrenia dikurung di kamar
 *                   belakang, putus obat 6 bulan. Stigma (motivasi) →
 *                   keterampilan merawat & kenali tanda relaps (kapabilitas).
 * keluarga_yani   : bayi 3 bulan sudah diberi pisang kerok oleh nenek; ibu
 *                   akan kembali kerja konveksi. Mitos MPASI (kapabilitas) →
 *                   ASI perah untuk ibu bekerja (kesempatan).
 */

import type { KeluargaBinaan } from '../types'

export const KELUARGA_DESA_D: KeluargaBinaan[] = [
  /* =========================================================================
   * KELUARGA SLAMET — RW 4 (sedang), rentan — JIWA (jiwa_tidak_ditelantarkan)
   * ======================================================================= */
  {
    id: 'keluarga_slamet',
    namaKeluarga: 'Keluarga Pak Slamet',
    rw: 4,
    jarakMenit: 20,
    ekonomi: 'rentan',
    anggota: [
      { nama: 'Pak Slamet', usia: 55, jenisKelamin: 'L', peran: 'kepala', kondisi: ['perokok_aktif'] },
      { nama: 'Bu Tumini', usia: 50, jenisKelamin: 'P', peran: 'istri' },
      { nama: 'Eko', usia: 24, jenisKelamin: 'L', peran: 'anak', kondisi: ['skizofrenia_putus_obat'] },
    ],
    indikatorAwal: {
      kb: 'na',
      persalinan_faskes: 'na',
      imunisasi_dasar: 'na',
      asi_eksklusif: 'na',
      pantau_tumbuh_kembang: 'na',
      tb_berobat_standar: 'na',
      hipertensi_berobat: 'na',
      jiwa_tidak_ditelantarkan: 'tidak',
      tidak_merokok: 'tidak',
      jkn: 'ya',
      air_bersih: 'ya',
      jamban_sehat: 'ya',
    },
    arc: {
      sinopsis:
        'Eko (24) dulu mahasiswa — sampai suara-suara itu datang. Enam bulan terakhir ia tak lagi minum ' +
        'obat, dan orang tuanya mengunci pintu kamarnya tiap kali ada tamu.',
      kunjungan: [
        /* ----------------------------------------------------------------
         * KUNJUNGAN 1 — "Kamar yang Selalu Terkunci"
         * Hambatan: MOTIVASI (malu / stigma "orang gila").
         * Karma: relaps psikotik D+26.
         * -------------------------------------------------------------- */
        {
          id: 'slamet_k1',
          judul: 'Kamar yang Selalu Terkunci',
          pembuka:
            'Rumah Pak Slamet rapi hampir berlebihan — seperti panggung yang disiapkan untuk tamu. Dari ' +
            'lorong belakang terdengar radio menyala pelan di balik pintu yang digembok dari luar. ' +
            '"Itu... gudang, Dok," kata Bu Tumini terlalu cepat.',
          target: ['jiwa_tidak_ditelantarkan'],
          hambatanSebenarnya: 'motivasi',
          petunjukHambatan:
            'Obat Eko sebenarnya masih ditebus rutin — tapi tak pernah diberikan lagi sejak insiden di warung; ' +
            'foto-foto Eko dilepas dari dinding dan kamarnya digembok tiap ada tamu. Keluarga ini mampu dan ' +
            'tahu caranya; yang melumpuhkan mereka adalah malu dan takut omongan kampung. Luka nama baik, ' +
            'bukan soal akses.',
          hotspot: [
            {
              id: 'slk1_h1',
              label: 'Gembok di pintu lorong belakang',
              narasi:
                'Pintu kamar belakang digembok DARI LUAR. Di baliknya samar terdengar radio dan langkah ' +
                'mondar-mandir. Gembok itu mengilap — dipakai setiap hari.',
              indikator: 'jiwa_tidak_ditelantarkan',
              x: 82,
              y: 55,
            },
            {
              id: 'slk1_h2',
              label: 'Paku bekas bingkai foto di dinding',
              narasi:
                'Di dinding ruang tamu ada empat paku dengan bekas bingkai yang lebih terang dari cat ' +
                'sekitarnya. Foto-foto yang pernah tergantung di sana sudah diturunkan.',
              x: 35,
              y: 25,
            },
            {
              id: 'slk1_h3',
              label: 'Kantong obat penuh di laci bufet',
              narasi:
                'Laci bufet setengah terbuka: kantong-kantong obat Puskesmas atas nama Eko S. — risperidon, ' +
                'tertata rapi, berbulan-bulan jatah. Ditebus rutin, tidak diminumkan.',
              x: 55,
              y: 62,
            },
            {
              id: 'slk1_h4',
              label: 'Piala lomba cerdas cermat',
              narasi:
                'Di atas bufet, piala kecil berdebu: "Juara II Cerdas Cermat SMA". Bu Tumini mengikuti ' +
                'pandanganmu. "Eko itu dulu pintar, Dok," katanya nyaris berbisik, lalu buru-buru mengelap meja.',
              x: 20,
              y: 45,
            },
          ],
          dialog: [
            {
              id: 'slk1_d1',
              narasi:
                'Pak Slamet duduk tegak seperti sedang diperiksa. "Kami sehat semua, Dok. Kalau soal anak ' +
                'kami... Eko sudah lama kerja di Surabaya. Jarang pulang."  Dari lorong belakang, radio itu ' +
                'berpindah gelombang.',
              pilihan: [
                {
                  id: 'slk1_d1_a',
                  teks:
                    '"Pak, saya bukan datang untuk menilai keluarga ini. Apa pun yang ada di rumah ini, ' +
                    'saya datang sebagai dokter yang menjaga rahasia pasien — sama seperti saya menjaga ' +
                    'rahasia tekanan darah Bapak."',
                  gaya: 'empati',
                  respons:
                    'Pak Slamet menatap lantai lama sekali. Bu Tumini yang akhirnya bicara, suaranya pecah: ' +
                    '"Eko di belakang, Dok. Enam bulan ini... kami tidak tahu lagi harus bagaimana." ' +
                    'Gembok itu akhirnya diakui ada.',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'jiwa_tidak_ditelantarkan',
                    ambangTrust: 6,
                    responsBohong:
                      '"Eko kerja di Surabaya, Dok. Sudah setahun. Itu radio... sengaja dinyalakan biar rumah ' +
                      'tidak sepi," kata Pak Slamet — sementara di lorong belakang, langkah kaki itu berhenti mendengar namanya.',
                  },
                  catatanPedagogis:
                    'Jaminan kerahasiaan adalah kunci pembuka stigma. Keluarga ODGJ tidak menyembunyikan pasien ' +
                    'dari dokter — mereka menyembunyikannya dari KAMPUNG; pastikan dulu kamu bukan corong kampung.',
                },
                {
                  id: 'slk1_d1_b',
                  teks:
                    '"Pak, saya dengar sendiri ada orang di kamar belakang. Menyembunyikan anggota keluarga ' +
                    'sakit itu termasuk penelantaran — bisa kena undang-undang."',
                  gaya: 'konfrontasi',
                  respons:
                    'Wajah Pak Slamet memutih, lalu mengeras. "Silakan Dokter pulang. Kami tidak sedang ' +
                    'melanggar hukum apa-apa." Bu Tumini mengantar ke pintu dengan tangan gemetar.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Mengancam dengan pasal pada keluarga yang sedang ketakutan mengubah rumah itu jadi benteng. ' +
                    'Penelantaran mereka lahir dari putus asa, bukan niat jahat.',
                },
                {
                  id: 'slk1_d1_c',
                  teks:
                    '"Oh, kerja di Surabaya. Baguslah. Kalau begitu kita bahas kesehatan Bapak dan Ibu ' +
                    'saja ya — tensi dulu."',
                  gaya: 'edukasi',
                  respons:
                    'Pemeriksaan berjalan lancar dan sopan. Radio di belakang terus berbunyi sampai kamu ' +
                    'pamit — satu-satunya anggota keluarga yang paling butuh dokter hari ini tak pernah dibahas.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Menerima cerita sampul demi kenyamanan = kolusi dengan penelantaran. Trust naik sedikit, ' +
                    'tapi kunjungan kehilangan alasannya ada.',
                },
              ],
            },
            {
              id: 'slk1_d2',
              narasi:
                'Bu Tumini bercerita dengan suara turun-naik: "Dulu Eko rajin minum obat, Dok, sudah mau ' +
                'bantu-bantu di kebun. Terus... kejadian itu. Dia ngamuk di warung Bu Sri, dikira kesurupan. ' +
                'Sekampung gempar. Sejak itu bapaknya bilang: sudah, di rumah saja."',
              pilihan: [
                {
                  id: 'slk1_d2_a',
                  teks:
                    '"Jadi setelah kejadian di warung itu, yang dikunci bukan cuma Eko ya, Bu — nama baik ' +
                    'keluarga ini ikut terkunci. Berhenti obat itu keputusan siapa waktu itu?"',
                  gaya: 'refleksi',
                  respons:
                    '"...Bapaknya, Dok," Bu Tumini melirik suaminya. Pak Slamet menghela napas berat: "Obat itu ' +
                    'bikin dia lemas, ngiler, jalannya kaku. Orang-orang makin bilang dia gila. Saya pikir... ' +
                    'tanpa obat, setidaknya dia kelihatan biasa." Logika yang salah — tapi utuh dan bisa diajak bicara.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Refleksi menemukan rantai sebab yang sebenarnya: efek samping obat generasi pertama → tampak ' +
                    '"makin gila" → stigma → putus obat. Rantai itu yang harus diputus, bukan keluarganya yang dihakimi.',
                },
                {
                  id: 'slk1_d2_b',
                  teks:
                    '"Justru karena berhenti obat itulah dia ngamuk, Pak. Kalau diteruskan obatnya, kejadian ' +
                    'warung itu tidak akan ada. Keputusan Bapak itu keliru besar."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Jadi salah saya." Pak Slamet berdiri, ke dapur, dan tidak kembali. Bu Tumini memandangimu ' +
                    'dengan mata yang minta maaf sekaligus menyalahkan.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Secara kronologi kamu benar; secara manusia kamu baru saja menjatuhkan vonis pada ayah yang ' +
                    'sudah enam bulan menghukum dirinya sendiri. Kebenaran tanpa jalan pulang itu kejam.',
                },
                {
                  id: 'slk1_d2_c',
                  teks:
                    '"Ngamuk itu namanya relaps, Bu — kambuh karena obatnya berhenti. Skizofrenia itu ' +
                    'penyakit otak, sama seperti darah tinggi penyakit pembuluh. Bukan kesurupan."',
                  gaya: 'edukasi',
                  respons:
                    '"Iya, dulu dokter jiwa di kabupaten juga bilang begitu," angguk Bu Tumini, hafal. ' +
                    'Mereka sudah pernah menerima semua penjelasan itu — yang belum pernah mereka terima ' +
                    'adalah kampung yang berhenti berbisik.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Keluarga pasien kronis biasanya sudah khatam edukasi dasar. Mengulangnya tidak salah — ' +
                    'tapi tidak menyentuh hambatan yang sebenarnya: malu.',
                },
              ],
            },
            {
              id: 'slk1_d3',
              narasi:
                'Dari lorong belakang terdengar suara Eko, pelan tapi jelas: "Bu... itu tamunya siapa?" ' +
                'Bu Tumini membeku. Pak Slamet muncul lagi di ambang dapur, menunggu apa yang akan kamu lakukan.',
              pilihan: [
                {
                  id: 'slk1_d3_a',
                  teks:
                    '"Boleh saya menyapa Eko? Tidak usah dibuka pintunya kalau belum siap — saya bicara ' +
                    'dari sini saja dulu. Eko berhak tahu ada dokter yang datang untuknya."',
                  gaya: 'empati',
                  respons:
                    'Hening — lalu Pak Slamet sendiri yang melangkah dan memutar kunci gembok. "Eko, ini ' +
                    'dokter Puskesmas." Pintu terbuka sejengkal: wajah pucat berambut gondrong menatap dari ' +
                    'kegelapan, waspada tapi tidak bermusuhan. "...Dokter beneran?" tanya Eko.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Meminta izin + memberi jalan mundur ("tidak usah dibuka kalau belum siap") membuat keluarga ' +
                    'yang membuka pintunya SENDIRI. Momen gembok diputar oleh tangan ayahnya = titik balik arc ini.',
                },
                {
                  id: 'slk1_d3_b',
                  teks:
                    '(Berjalan ke lorong dan membuka gembok) "Eko? Saya dokter Puskesmas. Ayo keluar, ' +
                    'tidak apa-apa."',
                  gaya: 'konfrontasi',
                  respons:
                    '"JANGAN!" Pak Slamet dan Bu Tumini berseru bersamaan. Dari dalam kamar terdengar sesuatu ' +
                    'jatuh dan langkah mundur ke pojok. Kamu berhenti dengan tangan di gembok orang lain — ' +
                    'di rumah orang lain.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Membuka pintu pasien psikotik tanpa persiapan & tanpa izin keluarga membahayakan semua pihak ' +
                    'dan menghancurkan aliansi. Kamu tamu — bukan petugas penggerebekan.',
                },
                {
                  id: 'slk1_d3_c',
                  teks:
                    '(Pura-pura tidak mendengar) "Baik, Bu, jadi obat-obat di laci itu... kita atur ulang ' +
                    'jadwal minumnya ya."',
                  gaya: 'edukasi',
                  respons:
                    'Bu Tumini mengangguk sambil melirik cemas ke lorong. Suara Eko tidak terdengar lagi — ' +
                    'ia tahu tamunya mendengar dan memilih diam. Kepercayaan yang belum tumbuh itu layu sebelum berbunga.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Pasien jiwa yang "tidak didengar" oleh dokternya sendiri belajar satu hal: bahkan orang yang ' +
                    'datang untuknya pun berpura-pura ia tidak ada. Penelantaran punya banyak bentuk halus.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'slk1_i1',
              nama: 'Restorasi Nama: Eko Kembali sebagai Manusia',
              deskripsi:
                'Rancang "jalan pulang sosial": mulai dari obat baru dengan efek samping ringan (ganti ke ' +
                'regimen yang tidak bikin kaku-ngiler), lalu peran kecil yang terlihat kampung — Eko membantu ' +
                'Pak Slamet menjemur gabah di halaman DEPAN — dan sepakati satu kalimat keluarga untuk ' +
                'menjawab tetangga: "Eko sakit, sedang berobat, dan membaik."',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Dua minggu kemudian kader mengirim kabar yang membuatmu membaca dua kali: Eko terlihat ' +
                'menjemur gabah di halaman depan, rambut dipangkas rapi. Seorang tetangga bertanya; Bu Tumini ' +
                'menjawab persis satu kalimat itu — kepalanya tegak. Gembok di pintu belakang belum dibuang, ' +
                'tapi sudah seminggu tidak dikunci.',
            },
            {
              id: 'slk1_i2',
              nama: 'Jadwal Minum Obat & Kotak Pil',
              deskripsi:
                'Susun ulang jadwal risperidon dengan kotak pil harian dan pengingat, supaya kepatuhan ' +
                'minum obat Eko terjaga.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Kotak pil terisi rapi oleh Bu Tumini tiap Minggu malam — dan tetap penuh tiap Sabtu. Bukan ' +
                'karena lupa: Pak Slamet masih belum mengizinkan obat itu diberikan. "Nanti dia ngiler lagi, ' +
                'orang-orang makin ngomong." Alatnya ada; izin hatinya yang belum.',
            },
            {
              id: 'slk1_i3',
              nama: 'Rujukan Poli Jiwa Kabupaten',
              deskripsi:
                'Buatkan rujukan konsul psikiatri di RS kabupaten untuk evaluasi ulang terapi Eko.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Surat rujukan itu tersimpan rapi di map — tidak pernah dipakai. "Naik apa kami bawa dia ke ' +
                'kabupaten, Dok? Nanti ngamuk di angkot, tambah tontonan orang," kata Pak Slamet. Aksesnya ' +
                'sebenarnya bisa diatur; ketakutan pada mata orang itu yang belum diobati.',
            },
          ],
          penutupBerhasil:
            'Sebelum pulang, kamu sempat bicara lima menit dengan Eko lewat pintu yang terbuka sejengkal. ' +
            'Ia bertanya apakah obat yang baru bikin ngiler. "Kita cari yang tidak," jawabmu. Ia mengangguk — ' +
            'dan untuk pertama kalinya dalam enam bulan, seseorang membuat janji PADANYA, bukan tentang dia.',
          penutupGagal:
            'Gembok itu kembali dikunci bahkan sebelum motormu keluar pekarangan. Di laci bufet, kantong ' +
            'obat bulan depan akan tetap ditebus — disimpan rapi, tak diminumkan, seperti nyala lilin untuk ' +
            'anak yang mereka rindukan tapi tak berani mereka tunjukkan pada dunia.',
          karma: {
            kasusId: 'jiwa_skizofrenia',
            anggotaIndex: 2,
            jatuhTempoHari: 26,
            narasi:
              'Kabar itu tiba sebelum pasiennya: Eko mengamuk subuh tadi — memecahkan jendela kamarnya sendiri, ' +
              'berteriak pada suara yang hanya ia dengar. Warga sekampung menontonnya diikat di balai desa. ' +
              'Pak Slamet berdiri di depan poli dengan tangan berdarah kaca, suaranya habis: "Tolong anak saya, ' +
              'Dok. Saya yang salah. Enam bulan... saya yang menghentikan obatnya."',
          },
        },
        /* ----------------------------------------------------------------
         * KUNJUNGAN 2 — "Sinyal Sebelum Badai"
         * Hambatan: KAPABILITAS (keterampilan merawat + kenali tanda relaps).
         * -------------------------------------------------------------- */
        {
          id: 'slamet_k2',
          judul: 'Sinyal Sebelum Badai',
          pembuka:
            'Kunjungan kedua. Pintu belakang kini terbuka dan Eko duduk di teras samping, menganyam ' +
            'keranjang bambu dengan gerakan pelan. "Obat baru itu tidak bikin kaku, Dok," sapa Bu Tumini. ' +
            '"Cuma kami... masih suka salah terus kalau dia mulai aneh. Kemarin bapaknya membentak dia."',
          target: ['jiwa_tidak_ditelantarkan'],
          hambatanSebenarnya: 'kapabilitas',
          petunjukHambatan:
            'Obat sudah jalan dan malu mulai cair — kini keluarga gagap KETERAMPILAN: Pak Slamet membentak ' +
            'saat Eko bicara sendiri (memicu ketegangan), tak ada yang tahu tanda awal relaps (susah tidur, ' +
            'mondar-mandir, bicara sendiri makin sering), dan tak ada rencana siapa-melakukan-apa bila ' +
            'sinyal itu muncul. Ini soal cara, bukan lagi kemauan.',
          hotspot: [
            {
              id: 'slk2_h1',
              label: 'Keranjang bambu setengah jadi',
              narasi:
                'Tiga keranjang bambu rapi berjajar — buatan Eko. "Katanya kalau tangannya sibuk, ' +
                'suara-suaranya pelan," kata Bu Tumini. Terapi okupasi yang mereka temukan sendiri.',
              x: 75,
              y: 65,
            },
            {
              id: 'slk2_h2',
              label: 'Kotak pil dengan Kamis-Jumat kosong',
              narasi:
                'Kotak pil di meja: Senin-Rabu terminum, Kamis-Jumat masih terisi. "Habis dibentak bapaknya ' +
                'itu dia mogok obat dua hari, Dok," bisik Bu Tumini.',
              x: 45,
              y: 40,
            },
            {
              id: 'slk2_h3',
              label: 'Kasur Eko di ruang tengah',
              narasi:
                'Sebuah kasur lipat kini digelar di ruang tengah — Eko tidur di sana, bukan lagi di kamar ' +
                'belakang. Langkah kecil yang tidak kecil.',
              indikator: 'jiwa_tidak_ditelantarkan',
              x: 20,
              y: 70,
            },
            {
              id: 'slk2_h4',
              label: 'Catatan kecil Bu Tumini',
              narasi:
                'Sobekan buku di bawah toples: "Snin: tdur jam 1 mlm. Sls: jln mondar2 + ngmg sndiri." ' +
                'Bu Tumini diam-diam sudah mencatat gejala — ia hanya tidak tahu bahwa catatannya penting.',
              x: 60,
              y: 25,
            },
          ],
          dialog: [
            {
              id: 'slk2_d1',
              narasi:
                '"Kalau dia mulai ngomong sendiri, saya harus bagaimana, Dok?" tanya Pak Slamet, kini duduk ' +
                'lebih dekat. "Kemarin saya bentak — \'jangan gila lagi!\' — dia malah mogok makan-mogok obat ' +
                'dua hari. Saya... tidak tahu caranya."',
              pilihan: [
                {
                  id: 'slk2_d1_a',
                  teks:
                    '"Pertanyaan \'saya harus bagaimana\' itu tanda Bapak sudah setengah jalan. Caranya: ' +
                    'jangan bantah isi suaranya, jangan bentak — sapa perasaannya. \'Kamu kelihatan gelisah, ' +
                    'Ko. Sini duduk sama Bapak.\' Mau kita latih sekarang, main peran?"',
                  gaya: 'refleksi',
                  respons:
                    'Pak Slamet canggung setengah mati memerankan dirinya sendiri — tapi ia mencoba. Di ' +
                    'percobaan ketiga, kalimatnya keluar tanpa terdengar seperti perintah upacara. Eko, yang ' +
                    'diam-diam menonton dari teras, tersenyum tipis untuk pertama kalinya sore itu.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Keterampilan tidak menular lewat ceramah — ia menular lewat LATIHAN. Role-play lima menit ' +
                    'dengan keluarga mengalahkan selebaran psikoedukasi setebal apa pun.',
                },
                {
                  id: 'slk2_d1_b',
                  teks:
                    '"Yang penting jangan dibentak, Pak. Halusinasi itu nyata bagi dia. Sabar saja ' +
                    'kuncinya — namanya juga merawat orang sakit."',
                  gaya: 'edukasi',
                  respons:
                    '"Sabar..." Pak Slamet mengangguk pelan, dan kamu melihat kata itu masuk ke daftar panjang ' +
                    'nasihat yang sudah pernah ia terima dan tidak tahu cara menjalankannya. Sabar itu arah, ' +
                    'bukan cara.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    '"Jangan dibentak" memberi tahu apa yang SALAH tanpa memberi pengganti yang BENAR. Keluarga ' +
                    'butuh kalimat konkret yang bisa diucapkan, bukan larangan.',
                },
                {
                  id: 'slk2_d1_c',
                  teks:
                    '"Nah itu, Pak — membentak begitu bisa memicu relaps. Kalau sampai kambuh lagi gara-gara ' +
                    'dibentak, yang repot siapa?"',
                  gaya: 'konfrontasi',
                  respons:
                    'Pak Slamet menunduk. "Saya, Dok. Saya yang repot. Saya juga yang salah, dari dulu." ' +
                    'Rasa bersalah yang kemarin baru sembuh setengah itu kambuh lebih cepat dari skizofrenia mana pun.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Ayah ini sudah mengaku salah di depan poli sekampung. Menambah beban salah tidak mengajarkan ' +
                    'keterampilan apa pun — ia justru membuat orang takut mencoba.',
                },
              ],
            },
            {
              id: 'slk2_d2',
              narasi:
                'Kamu menunjukkan catatan kecil Bu Tumini yang kamu temukan. Wajahnya memerah — ' +
                '"Aduh, itu coret-coretan saya saja, Dok. Biar tidak lupa kalau ditanya bu bidan."',
              pilihan: [
                {
                  id: 'slk2_d2_a',
                  teks:
                    '"Bu, ini bukan coret-coretan — ini justru pekerjaan perawat jiwa sungguhan. Susah tidur, ' +
                    'mondar-mandir, bicara sendiri makin sering: itu SINYAL DINI relaps. Kalau tiga ini muncul ' +
                    'bersamaan, itu kode merah — bawa ke Puskesmas SEBELUM badai, jangan sesudahnya."',
                  gaya: 'empati',
                  respons:
                    'Bu Tumini memandangi catatannya sendiri seperti baru mengenalinya. "Jadi yang saya tulis ' +
                    'ini... alarm to, Dok?" Ia mengambil pensil dan menulis besar-besar di halaman baru: ' +
                    'TIDUR — MONDAR-MANDIR — NGOMONG SENDIRI. "Tiga-tiganya muncul: berangkat."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Early warning signs adalah inti manajemen relaps di keluarga. Yang terbaik: Bu Tumini SUDAH ' +
                    'melakukannya secara naluriah — tugasmu hanya memberi nama dan wewenang pada nalurinya.',
                },
                {
                  id: 'slk2_d2_b',
                  teks:
                    '"Bagus, Bu, rajin mencatat. Nanti kalau kontrol, catatannya dibawa ya, biar dokternya ' +
                    'yang menyimpulkan."',
                  gaya: 'edukasi',
                  respons:
                    '"Inggih, Dok." Catatan itu kembali ke bawah toples — statusnya tetap coret-coretan yang ' +
                    'menunggu dinilai orang pintar, bukan alarm yang bisa mereka bunyikan sendiri.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Menjadikan dokter satu-satunya penerjemah data keluarga = keluarga selamanya menunggu. ' +
                    'Alihkan wewenang membaca sinyal ke orang yang serumah dengan pasien.',
                },
                {
                  id: 'slk2_d2_c',
                  teks:
                    '"Kamis-Jumat obatnya bolong, Bu. Ini yang bahaya. Bagaimanapun caranya, obat tidak ' +
                    'boleh putus — itu tanggung jawab Ibu sebagai yang merawat."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Inggih..." Bu Tumini melirik suaminya — yang bentakannya kemarin adalah alasan dua hari ' +
                    'bolong itu. Tanggung jawab dilempar ke pundak yang salah, dan keduanya sama-sama menunduk.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Kepatuhan obat pasien jiwa adalah kerja SISTEM keluarga, bukan tugas satu ibu. Menegur ' +
                    'penjaga gawang untuk gol yang lahir dari kesalahan bek tidak memperbaiki tim.',
                },
              ],
            },
            {
              id: 'slk2_d3',
              narasi:
                'Eko sendiri yang mendekat, membawa keranjang bambunya yang baru jadi. "Buat Dokter," ' +
                'katanya pelan. "Dok... kalau suara-suaranya datang lagi pas saya sendirian, saya harus ngapain?"',
              pilihan: [
                {
                  id: 'slk2_d3_a',
                  teks:
                    '"Pertanyaan paling penting hari ini, dan kamu sendiri yang menemukannya, Ko. Kita bikin ' +
                    'rencana saku: suara datang → pegang anyamanmu, hitung sepuluh bilah bambu → panggil Ibu → ' +
                    'kalau tambah keras, bilang \'saya mau ke Puskesmas\'. Tiga langkah. Hafal?"',
                  gaya: 'empati',
                  respons:
                    'Eko mengulang tiga langkah itu dua kali, jarinya menghitung bilah keranjang. "Anyaman... ' +
                    'Ibu... Puskesmas." Ia mengangguk sendiri. Rencana saku pertama dalam hidupnya — dan ia ' +
                    'ikut menyusunnya.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Melibatkan PASIEN menyusun coping plan-nya sendiri (grounding → dukungan → bantuan formal) ' +
                    'adalah standar emas. Pasien psikotik stabil bukan objek perawatan — ia anggota tim.',
                },
                {
                  id: 'slk2_d3_b',
                  teks:
                    '"Tenang saja, Eko. Selama obatnya diminum rutin, suara-suara itu tidak akan datang lagi. ' +
                    'Tidak usah dipikirkan."',
                  gaya: 'edukasi',
                  respons:
                    '"Tidak akan datang lagi..." Eko mengulang, ragu. Kamu dan dia sama-sama tahu itu janji ' +
                    'yang obat mana pun tidak berani teken. Saat suaranya datang lagi nanti, janji palsu ini ' +
                    'yang pertama runtuh.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Menjanjikan bebas gejala total = menanam bom kepercayaan. Obat menurunkan frekuensi & ' +
                    'intensitas; rencana koping tetap wajib ada.',
                },
                {
                  id: 'slk2_d3_c',
                  teks:
                    '(Menoleh ke Bu Tumini) "Kalau dia mulai dengar suara-suara, Ibu langsung tambah dosisnya ' +
                    'setengah tablet ya, sambil menunggu jadwal kontrol."',
                  gaya: 'konfrontasi',
                  respons:
                    'Bu Tumini mencatat patuh — dan Eko perlahan mundur dari lingkaran, kembali jadi orang ' +
                    'ketiga dalam kalimat tentang dirinya. Pertanyaannya tadi tidak pernah dijawab.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Dua kesalahan sekaligus: mengubah dosis antipsikotik tanpa evaluasi ada risikonya, dan ' +
                    'melangkahi pasien yang BERTANYA SENDIRI adalah cara tercepat membuatnya berhenti bertanya.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'slk2_i1',
              nama: 'Latihan Keluarga: Sinyal Dini + Rencana Saku',
              deskripsi:
                'Formalkan tiga hal yang sudah tumbuh di rumah ini: catatan sinyal dini Bu Tumini jadi ' +
                'lembar pantau resmi (tidur/mondar-mandir/bicara sendiri), role-play respons tanpa bentakan ' +
                'untuk Pak Slamet sebulan sekali di Puskesmas, dan rencana saku 3 langkah milik Eko ' +
                'ditempel di dinding dekat kasurnya.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Sebulan kemudian lembar pantau itu penuh centang rapi — dan satu baris merah di minggu ' +
                'ketiga: "3 sinyal muncul → langsung kontrol, dosis dinaikkan dokter, AMAN." Badai pertama ' +
                'yang berhasil dipotong sebelum jadi berita kampung. Pak Slamet menceritakannya nyaris bangga.',
            },
            {
              id: 'slk2_i2',
              nama: 'Surat Keterangan untuk Kampung',
              deskripsi:
                'Terbitkan surat keterangan dokter bahwa Eko dalam pengobatan dan tidak berbahaya, ' +
                'untuk meredam omongan tetangga.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Surat itu ditempel Pak Slamet di kaca jendela — dan omongan memang mereda. Tapi saat Eko ' +
                'mulai susah tidur tiga hari berturut, seisi rumah tetap hanya saling pandang tak tahu harus ' +
                'berbuat apa. Nama baik pulih; keterampilan merawat masih kosong.',
            },
            {
              id: 'slk2_i3',
              nama: 'Antar Obat Bulanan oleh Kader',
              deskripsi:
                'Kader RW 4 mengantar risperidon tiap bulan ke rumah supaya stok tidak pernah putus.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Stok obat kini tidak pernah telat sehari pun — dan kotak pil tetap bolong tiap kali rumah ' +
                'itu gaduh. Yang membuat Eko mogok obat bukan jarak ke apotek; suasana rumah yang belum ' +
                'tahu cara menghadapinya.',
            },
          ],
          penutupBerhasil:
            'Keranjang bambu pemberian Eko terikat di jok motormu. Di teras, tiga orang itu berdiri ' +
            'berdampingan — bukan lagi dua penjaga dan satu yang dijaga. Bu Tumini memegang lembar pantaunya ' +
            'seperti bidan memegang partograf: rumah ini sekarang punya alat untuk membaca badainya sendiri.',
          penutupGagal:
            'Pintu belakang masih terbuka saat kamu pamit — itu kemajuan yang tidak hilang. Tapi kotak pil ' +
            'Kamis-Jumat tetap terisi, catatan Bu Tumini kembali ke bawah toples, dan pertanyaan Eko ' +
            '"saya harus ngapain" masih menggantung di udara, menunggu badai berikutnya menjawabnya sendiri.',
        },
      ],
      epilogBerhasil:
        'Tiga bulan kemudian, keranjang-keranjang bambu Eko dijual di warung Bu Sri — warung yang sama ' +
        'tempat semuanya dulu runtuh. Bu Sri sendiri yang menawarkan. Di kolom pekerjaan pendataan kader, ' +
        'Bu Tumini meminta ditulis tegas: "Eko, 24, perajin anyaman." Bukan yang lain-lain.',
      epilogGagal:
        'Gembok itu akhirnya kembali — kali ini atas saran orang pintar dari kecamatan sebelah, lengkap ' +
        'dengan rajah di atas pintunya. Kantong obat masih ditebus tiap bulan, rapi dan utuh di laci bufet, ' +
        'seperti tabungan untuk hari yang keluarga itu sudah berhenti percaya akan datang.',
    },
  },

  /* =========================================================================
   * KELUARGA YANI — RW 3 (dekat), cukup — ASI EKSKLUSIF + TUMBUH KEMBANG
   * ======================================================================= */
  {
    id: 'keluarga_yani',
    namaKeluarga: 'Keluarga Bu Yani',
    rw: 3,
    jarakMenit: 12,
    ekonomi: 'cukup',
    anggota: [
      { nama: 'Pak Herman', usia: 30, jenisKelamin: 'L', peran: 'kepala' },
      { nama: 'Bu Yani', usia: 26, jenisKelamin: 'P', peran: 'istri' },
      { nama: 'Mbah Painem', usia: 63, jenisKelamin: 'P', peran: 'lansia' },
      { nama: 'Nayla', usia: 0, jenisKelamin: 'P', peran: 'anak', kondisi: ['bayi_3_bulan'] },
    ],
    indikatorAwal: {
      kb: 'ya',
      persalinan_faskes: 'ya',
      imunisasi_dasar: 'ya',
      asi_eksklusif: 'tidak',
      pantau_tumbuh_kembang: 'tidak',
      tb_berobat_standar: 'na',
      hipertensi_berobat: 'na',
      jiwa_tidak_ditelantarkan: 'na',
      tidak_merokok: 'ya',
      jkn: 'ya',
      air_bersih: 'ya',
      jamban_sehat: 'ya',
    },
    arc: {
      sinopsis:
        'Nayla (3 bulan) sehat dan montok — kata neneknya, itu berkat pisang kerok yang ia suapkan diam-diam ' +
        'sejak umur sebulan. Bu Yani sebentar lagi kembali kerja di konveksi, dan ASI-nya "diragukan semua orang".',
      kunjungan: [
        /* ----------------------------------------------------------------
         * KUNJUNGAN 1 — "Pisang Kerok Nenek"
         * Hambatan: KAPABILITAS (mitos MPASI dini + tak paham tanda cukup ASI).
         * Karma: diare akut D+14 bila arc diabaikan.
         * -------------------------------------------------------------- */
        {
          id: 'yani_k1',
          judul: 'Pisang Kerok Nenek',
          pembuka:
            'Rumah itu wangi bedak bayi. Nayla tidur pulas di gendongan Mbah Painem yang langsung pamer: ' +
            '"Montok to, Dok? Ini berkat pisang. Anak zaman dulu semua begitu, buktinya pada waras-waras."',
          target: ['asi_eksklusif', 'pantau_tumbuh_kembang'],
          hambatanSebenarnya: 'kapabilitas',
          petunjukHambatan:
            'Semua orang di rumah ini SAYANG pada Nayla dan MAU yang terbaik — yang salah adalah peta ' +
            'pengetahuannya: nenek yakin pisang menguatkan usus, ibu mengira tangisan bayi = ASI kurang, ' +
            'dan tak seorang pun bisa membaca grafik KMS yang sebenarnya menunjukkan berat Nayla mulai ' +
            'mendatar. Bukan soal niat atau akses — soal ilmu yang keliru diwariskan.',
          hotspot: [
            {
              id: 'yk1_h1',
              label: 'Piring kecil berisi pisang kerok',
              narasi:
                'Di meja dapur, piring kecil berisi pisang dikerok halus dengan sendok — porsi bayi. ' +
                'Masih hangat; jadwal "sarapan" Nayla rupanya sudah rutin.',
              indikator: 'asi_eksklusif',
              x: 72,
              y: 58,
            },
            {
              id: 'yk1_h2',
              label: 'KMS terselip di buku KIA',
              narasi:
                'Kartu Menuju Sehat Nayla: dua titik pertama menanjak bagus, titik ketiga — bulan ini — ' +
                'nyaris mendatar. Tak ada garis yang menghubungkan; tak ada yang membaca kartu ini.',
              indikator: 'pantau_tumbuh_kembang',
              x: 40,
              y: 30,
            },
            {
              id: 'yk1_h3',
              label: 'Kardus botol susu formula baru',
              narasi:
                'Kardus berisi dua botol susu dan sekaleng formula "persiapan ibu kerja" — hadiah dari ' +
                'teman konveksi Bu Yani. Segelnya belum dibuka, tapi posisinya sudah di rak paling gampang dijangkau.',
              x: 85,
              y: 42,
            },
            {
              id: 'yk1_h4',
              label: 'Popok Nayla di jemuran',
              narasi:
                'Jemuran penuh popok kain. Kamu menghitung sekilas — lebih dari enam popok basah sehari. ' +
                'Tanda paling sederhana bahwa ASI Bu Yani sebenarnya CUKUP, terjemur tanpa ada yang membacanya.',
              x: 15,
              y: 65,
            },
          ],
          dialog: [
            {
              id: 'yk1_d1',
              narasi:
                '"Nayla itu nangisnya kenceng kalau malam, Dok," Bu Yani membuka, setengah berbisik supaya ' +
                'mertuanya tak dengar. "Kata Mbah, itu tandanya ASI saya encer, kurang. Makanya dikasih ' +
                'pisang biar kenyang. Bener begitu, Dok?"',
              pilihan: [
                {
                  id: 'yk1_d1_a',
                  teks:
                    '"Sebelum saya jawab — coba kita lihat dua bukti di rumah ini: jemuran popok Ibu dan ' +
                    'timbangan Nayla. Popok basah 6 kali lebih sehari itu artinya apa coba, menurut Ibu?"',
                  gaya: 'refleksi',
                  respons:
                    '"Artinya... pipisnya banyak. Berarti minumnya banyak?" Bu Yani menjawab pelan, lalu ' +
                    'matanya membulat. "Berarti ASI saya... cukup?" Kamu mengangguk. "Terus kenapa nangis ' +
                    'malam-malam, Dok?" — Nah, sekarang ia BERTANYA, bukan menelan.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Bantah mitos dengan DATA MILIK PASIEN sendiri (popok, KMS), bukan dengan otoritas. Ibu yang ' +
                    'menyimpulkan sendiri "ASI saya cukup" tidak akan goyah oleh komentar tetangga.',
                },
                {
                  id: 'yk1_d1_b',
                  teks:
                    '"Tidak benar, Bu. ASI encer itu mitos. Bayi menangis bukan berarti lapar. Pisang untuk ' +
                    'bayi 3 bulan justru berbahaya — ususnya belum siap."',
                  gaya: 'edukasi',
                  respons:
                    'Bu Yani mengangguk-angguk — lalu melirik cemas ke arah Mbah Painem yang berdiri di ambang ' +
                    'dapur, mukanya masam mendengar kata "mitos". Kamu benar, dan barusan kehilangan satu-satunya ' +
                    'orang yang memegang sendok pisang itu.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Isi benar, sasaran salah: pemegang keputusan makan bayi di rumah ini adalah NENEK. Edukasi ' +
                    'yang mempermalukan nenek di depan menantunya lahir mati.',
                },
                {
                  id: 'yk1_d1_c',
                  teks:
                    '"Aduh, Bu, bayi 3 bulan dikasih pisang? Untung belum kenapa-kenapa. Ini kalau sampai ' +
                    'ususnya tersumbat bisa operasi lho."',
                  gaya: 'konfrontasi',
                  respons:
                    'Bu Yani pucat — dan Mbah Painem maju dari ambang dapur: "Halah! Bapakmu, pakdemu, semua ' +
                    'tak kasih pisang dari bayi. Buktinya jadi orang semua!" Perang generasi resmi dimulai, ' +
                    'dan kamu penyebabnya.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menakut-nakuti ibu = menantang neneknya. Ancaman "operasi" tanpa jembatan justru memicu ' +
                    'pembelaan tradisi yang lebih keras.',
                },
              ],
            },
            {
              id: 'yk1_d2',
              narasi:
                'Mbah Painem duduk sambil menepuk-nepuk Nayla. "Zaman saya, delapan anak saya kasih pisang ' +
                'semua, Dok. Sehat-sehat. Jangan sampai cucu saya kurus kayak anaknya Yu Darmi yang ' +
                'katanya ASI tok itu."',
              pilihan: [
                {
                  id: 'yk1_d2_a',
                  teks:
                    '"Delapan anak besar semua di tangan Mbah — itu bukti Mbah perawat bayi paling ' +
                    'berpengalaman di rumah ini. Justru karena itu saya mau titip tugas paling penting: ' +
                    'usus bayi zaman sekarang kita tahu matangnya umur 6 bulan. Mbah yang paling bisa ' +
                    'menjaga jadwal itu — pisangnya kita TUNDA, bukan dibuang. Nanti Mbah yang pertama menyuapi."',
                  gaya: 'empati',
                  respons:
                    'Mbah Painem mengangkat dagu, ditawari jabatan. "Ditunda to... bukan dilarang." Ia menimang ' +
                    'Nayla. "Ya sudah. Tapi awas, enam bulan tepat, aku yang nyuapi pertama. Pisang raja, bukan ' +
                    'pisang ambon." Kesepakatan bersejarah baru saja diteken.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Rekrut sang nenek, jangan kalahkan: pengalamannya diakui, perannya dinaikkan (penjaga jadwal, ' +
                    'penyuap pertama), dan pesannya diubah dari "dilarang" jadi "ditunda". MPASI tepat waktu pun aman.',
                },
                {
                  id: 'yk1_d2_b',
                  teks:
                    '"Mbah, ilmu kesehatan itu berkembang. Yang dulu dianggap benar sekarang terbukti ' +
                    'keliru. WHO dan Kemenkes sudah menetapkan: enam bulan ASI saja."',
                  gaya: 'edukasi',
                  respons:
                    '"WHO itu sopo? Tetanggane sopo?" Mbah Painem mendengus. "Wong-wong pinter kok ngatur ' +
                    'isi perut cucuku." Lembaga dunia kalah wibawa dengan delapan anak yang jadi orang.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Otoritas institusi tidak berjalan di ruang keluarga. Bagi nenek, bukti terkuat adalah ' +
                    'pengalamannya sendiri — masuk lewat situ, atau tidak masuk sama sekali.',
                },
                {
                  id: 'yk1_d2_c',
                  teks:
                    '"Anak Yu Darmi itu kurus karena cacingan, Mbah, bukan karena ASI. Jangan ' +
                    'membanding-bandingkan yang tidak sebanding."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Oalah, sekarang aku sing salah ngomong." Mbah Painem bangkit membawa Nayla ke dapur — ' +
                    'tempat piring pisang menunggu. Debat kalah-menang selesai; sendok tetap di tangannya.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Memenangkan argumen ≠ mengubah perilaku. Selama nenek yang menggendong bayi, dialah ' +
                    'kebijakan gizi keluarga ini — jangan pernah membuatnya jadi lawan.',
                },
              ],
            },
            {
              id: 'yk1_d3',
              narasi:
                'Kamu membuka KMS Nayla dan meletakkannya di meja. Titik ketiga yang mendatar itu ' +
                'menunggu ada yang menyebutnya.',
              pilihan: [
                {
                  id: 'yk1_d3_a',
                  teks:
                    '"Sekarang lihat kartu ini bertiga yuk. Dua bulan pertama naiknya bagus sekali — kerja ' +
                    'bagus semua orang di rumah ini. Bulan ketiga mendatar. Coba tebak, apa yang berubah ' +
                    'di bulan ketiga?"',
                  gaya: 'refleksi',
                  respons:
                    'Hening sebentar. "...Pisangnya mulai rutin," jawab Bu Yani pelan. Mbah Painem protes ' +
                    '"lho kok pisang" — tapi matanya ikut menghitung mundur. Pisang mengenyangkan tanpa ' +
                    'menumbuhkan; kartu itu bicara lebih tega daripada dokter mana pun.',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'asi_eksklusif',
                    ambangTrust: 5,
                    responsBohong:
                      '"ASI tok kok, Dok, sumpah," kata Bu Yani cepat — sementara dari dapur samar tercium ' +
                      'pisang yang baru dikerok.',
                  },
                  catatanPedagogis:
                    'KMS adalah alat edukasi, bukan arsip: garis yang mendatar di depan mata keluarga sendiri ' +
                    'adalah momen pengajaran terkuat. Weight faltering dini = bendera kuning yang harus dipantau tiap bulan.',
                },
                {
                  id: 'yk1_d3_b',
                  teks:
                    '"Berat badannya mulai stagnan, ini tanda weight faltering fase awal. Harus dipantau ' +
                    'ketat: timbang rutin tiap bulan di Posyandu, jangan bolong."',
                  gaya: 'edukasi',
                  respons:
                    '"Faltering..." Bu Yani mencatat kata itu dengan patuh dan tanpa paham. "Iya, Dok, nanti ' +
                    'ditimbang." Kenapa harus ditimbang, apa yang dicari — kartu itu tetap bisu bagi mereka.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Istilah teknis + perintah = kepatuhan tanpa pemahaman. Yang membuat keluarga rajin ke ' +
                    'Posyandu bukan kata "faltering", tapi bisa MEMBACA sendiri garis anaknya.',
                },
                {
                  id: 'yk1_d3_c',
                  teks:
                    '"Ini akibatnya tidak pernah ke Posyandu dua bulan ini. Kalau rajin nimbang kan ' +
                    'ketahuan dari kemarin-kemarin."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Posyandunya bentrok jadwal lembur, Dok," jawab Bu Yani kecil. Menyalahkan ke belakang ' +
                    'lagi — dan kartu yang harusnya jadi guru berubah jadi barang bukti.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'KMS yang dipakai untuk mendakwa membuat keluarga takut pada timbangan. Kartu ini harus ' +
                    'terasa seperti rapor yang bisa diperbaiki, bukan surat tilang.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'yk1_i1',
              nama: 'Kontrak Enam Bulan Mbah Painem',
              deskripsi:
                'Resmikan kesepakatan tiga generasi: Mbah Painem jadi "penjaga jadwal MPASI" (pisang ditunda ' +
                'sampai 6 bulan, beliau penyuap pertama), Bu Yani belajar membaca popok-basah & KMS sebagai ' +
                'bukti ASI cukup, dan Nayla ditimbang rutin — grafiknya dibacakan keluarga sendiri tiap bulan.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Di Posyandu bulan berikutnya, Mbah Painem datang PALING depan, menggendong Nayla dan ' +
                'mengumumkan pada kader: "Cucuku ASI tok sampai enam bulan — sing jaga jadwal AKU." Titik ' +
                'keempat di KMS naik lagi. Piring pisang kerok pindah jadi sarapan Mbah sendiri.',
            },
            {
              id: 'yk1_i2',
              nama: 'Rujukan Konselor Laktasi',
              deskripsi:
                'Jadwalkan sesi konselor laktasi di Puskesmas untuk memperbaiki pelekatan dan menaikkan ' +
                'kepercayaan diri menyusui Bu Yani.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Sesi berjalan bagus dan pelekatan Nayla memang membaik — tapi di rumah, sendok pisang tetap ' +
                'beroperasi tiap pagi selama pemegang sendoknya masih yakin pisang itu penyelamat. Ilmu yang ' +
                'keliru belum tersentuh; hanya tekniknya yang diasah.',
            },
            {
              id: 'yk1_i3',
              nama: 'Paket PMT dari Puskesmas',
              deskripsi:
                'Berikan paket makanan tambahan pemulihan untuk mengejar berat badan Nayla yang mendatar.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Biskuit PMT itu... dikerok dan disuapkan ke Nayla bersama pisangnya — "biar tambah kenyang, ' +
                'Dok." Bayi 3 bulan kini makan dua jenis makanan padat. Bantuan tanpa pemahaman berbelok ' +
                'jadi bahan bakar masalah yang sama.',
            },
          ],
          penutupBerhasil:
            'Saat pamit, kamu dengar Mbah Painem menimang Nayla dengan tembang baru: "Enem wulan, Nduk... ' +
            'sabar yo, mengko simbah sing nyuapi dhisik." Bu Yani mengantarmu ke pagar sambil memegang KMS ' +
            'seperti orang yang baru bisa membaca: "Bulan depan titiknya harus naik ya, Dok. Saya yang gambar garisnya."',
          penutupGagal:
            'Piring pisang itu diisi lagi bahkan sebelum kamu selesai pamit. "Terima kasih ilmunya, Dok," ' +
            'kata Bu Yani sopan, dan Mbah Painem menambahkan dari dalam: "Ilmu sekolahan memang begitu — ' +
            'anaknya sopo dulu yang gedhe: teori opo pisang." Kartu KMS kembali terselip, bisu.',
          karma: {
            kasusId: 'diare_akut_anak',
            anggotaIndex: 3,
            jatuhTempoHari: 14,
            narasi:
              'Bu Yani berlari masuk poli menggendong Nayla yang lemas — mata cekung, menangis tanpa air ' +
              'mata, popoknya kering sejak subuh. "Muntah-mencret dari kemarin, Dok. Pisangnya... kemarin ' +
              'pisangnya agak kehitaman, kata Mbah tidak apa-apa dikerok yang bagusnya saja." Usus tiga ' +
              'bulan itu akhirnya menyerah dengan cara yang paling klasik.',
          },
        },
        /* ----------------------------------------------------------------
         * KUNJUNGAN 2 — "ASI Perah untuk Ibu Konveksi"
         * Hambatan: KESEMPATAN (kembali kerja, tak ada waktu/tempat memerah).
         * -------------------------------------------------------------- */
        {
          id: 'yani_k2',
          judul: 'ASI Perah untuk Ibu Konveksi',
          pembuka:
            'Kunjungan kedua, dua minggu sebelum Bu Yani kembali kerja. Kardus botol formula itu kini ' +
            'di meja, segelnya sudah disobek separuh. "Bukannya saya menyerah, Dok," katanya buru-buru. ' +
            '"Tapi kerja konveksi itu dari jam tujuh sampai jam empat. Nayla minum apa selama itu?"',
          // Fix #11 (audit CODEX 2026-07-11): skenario terakhir arc HARUS superset
          // target skenario pertama (pola konsisten di 15 arc lain) — sebelumnya
          // cuma 'asi_eksklusif', kehilangan 'pantau_tumbuh_kembang' yg sudah
          // ditarget di yani_k1 (KMS/faltering growth tetap tema aktif di sini).
          target: ['asi_eksklusif', 'pantau_tumbuh_kembang'],
          hambatanSebenarnya: 'kesempatan',
          petunjukHambatan:
            'Keyakinan ASI-nya sudah pulih dan nenek sudah jadi sekutu — kini masalahnya struktural: jam ' +
            'kerja 7-16, tak ada ruang laktasi di konveksi, tak punya pompa, tak tahu ASI perah tahan ' +
            'berapa lama tanpa kulkas. Murni soal waktu, alat, dan tempat — bukan kemauan atau ilmu dasar.',
          hotspot: [
            {
              id: 'yk2_h1',
              label: 'Kardus formula tersobek separuh',
              narasi:
                'Kaleng formula sudah keluar dari kardus, berdiri di meja seperti ultimatum. Takarannya ' +
                'masih tersegel — belum dipakai, tapi tinggal selangkah.',
              indikator: 'asi_eksklusif',
              x: 65,
              y: 45,
            },
            {
              id: 'yk2_h2',
              label: 'Jadwal lembur di pintu kulkas kecil',
              narasi:
                'Di pintu kulkas satu pintu yang penuh magnet, selembar jadwal: "MINGGU INI TARGET 400 PCS — ' +
                'LEMBUR SAMPAI 17.30". Kulkasnya sendiri menyala — aset yang belum disadari siapa pun.',
              x: 85,
              y: 30,
            },
            {
              id: 'yk2_h3',
              label: 'Botol kaca bekas selai dicuci berjajar',
              narasi:
                'Di rak cuci piring, enam botol kaca bekas selai dicuci bersih berjajar. "Buat apa ini, Bu?" ' +
                '"Belum tahu, Dok. Sayang dibuang." — Wadah ASI perah gratis, menunggu diberi nama.',
              x: 25,
              y: 60,
            },
            {
              id: 'yk2_h4',
              label: 'Mbah Painem menggendong sambil menunjuk jam',
              narasi:
                '"Kalau Yani kerja, aku sing momong," kata Mbah Painem tegas, lalu menunjuk jam dinding. ' +
                '"Sing tak bingungke mung siji: jam rolas Nayla nangis luwe, aku kudu ngekei opo?" — ' +
                'Pengasuhnya siap; logistiknya yang kosong.',
              x: 45,
              y: 75,
            },
          ],
          dialog: [
            {
              id: 'yk2_d1',
              narasi:
                '"Teman-teman konveksi bilang: sudahlah formula saja, semua ibu kerja begitu," Bu Yani ' +
                'memandangi kaleng di meja. "Memangnya bisa, Dok, kerja jam tujuh sampai sore tapi bayinya ' +
                'tetap ASI tok?"',
              pilihan: [
                {
                  id: 'yk2_d1_a',
                  teks:
                    '"Bisa — dan bukan dengan niat, tapi dengan JADWAL. Kita hitung mundur bareng: Nayla ' +
                    'minum berapa kali dari jam 7 sampai jam 4? Tiga kali? Berarti butuh 3 botol ASI perah ' +
                    'sehari. Sekarang kita cari: kapan merahnya, simpannya di mana, siapa yang menyuapkan."',
                  gaya: 'refleksi',
                  respons:
                    'Bu Yani mengambil kertas dan mulai menghitung sendiri: "Merah pagi sebelum berangkat... ' +
                    'satu. Istirahat siang di musala konveksi... dua. Malam sebelum tidur... tiga." Ia mendongak. ' +
                    '"Lho. Cukup, Dok?!" — Matematika sederhana baru saja mengalahkan satu kaleng formula.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Ubah "mustahil" jadi hitungan: kebutuhan (3 botol) vs slot waktu (3 sesi perah). Rencana ' +
                    'yang dihitung ibu sendiri lebih kokoh daripada seribu ajakan "semangat ASI eksklusif".',
                },
                {
                  id: 'yk2_d1_b',
                  teks:
                    '"Bisa, Bu. ASI perah itu solusinya. Nanti saya kasih leaflet manajemen laktasi ibu ' +
                    'bekerja — lengkap kok caranya di situ."',
                  gaya: 'edukasi',
                  respons:
                    'Leaflet itu diterima dengan dua tangan dan diselipkan di bawah kaleng formula — ' +
                    'penopang ultimatum, bukan penjawabnya. Malam-malam lelah sepulang konveksi bukan waktu ' +
                    'terbaik membaca delapan halaman.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Leaflet adalah pelengkap, bukan intervensi. Hambatan kesempatan butuh rencana konkret ' +
                    'jam-per-jam yang disusun BERSAMA, bukan dititipkan di kertas.',
                },
                {
                  id: 'yk2_d1_c',
                  teks:
                    '"Yang penting jangan formula, Bu. Sekali kenal dot dan formula, bayi biasanya menolak ' +
                    'menyusu langsung. Nanti Ibu menyesal."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Terus solusinya apa, Dok?!" — suara Bu Yani naik untuk pertama kalinya. "Semua orang ' +
                    'bilang jangan-jangan-jangan, tidak ada yang bilang CARANYA." Ia benar, dan kamu barusan ' +
                    'jadi bagian dari paduan suara itu.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Larangan tanpa jalan = menambah beban ibu bekerja yang sudah terjepit. Bila formula ' +
                    'dilarang, kewajibanmu menyediakan rute ASI perah yang benar-benar bisa dijalani.',
                },
              ],
            },
            {
              id: 'yk2_d2',
              narasi:
                'Kamu mengangkat satu botol kaca bekas selai dari rak. Bu Yani memperhatikan, ' +
                'belum menyambungkan.',
              pilihan: [
                {
                  id: 'yk2_d2_a',
                  teks:
                    '"Enam botol ini + kulkas kecil Ibu = gudang ASI perah gratis. Direbus dulu botolnya, ' +
                    'ASI tahan 4 jam di suhu ruang, 3-4 hari di kulkas. Ditulis tanggalnya pakai spidol. ' +
                    'Mbah tinggal merendam botolnya di air hangat — jangan direbus ASI-nya."',
                  gaya: 'empati',
                  respons:
                    '"Botol selai..." Bu Yani tertawa tidak percaya, lalu langsung mengambil spidol dari laci. ' +
                    'Mbah Painem ikut maju: "Direndam banyu anget, ora digodhog. Gampang." Gudang ASI pertama ' +
                    'keluarga itu diresmikan sore itu juga, gratis.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Intervensi kesempatan terbaik memakai aset yang SUDAH ADA: botol bekas + kulkas + nenek. ' +
                    'Aturan simpan ASI (4 jam ruang / 3-4 hari kulkas / rendam hangat) kini menempel pada benda, bukan pada leaflet.',
                },
                {
                  id: 'yk2_d2_b',
                  teks:
                    '"Idealnya Ibu beli pompa ASI elektrik dan cooler bag, Bu. Yang bagus sekitar tujuh ' +
                    'ratus ribuan — investasi untuk enam bulan ke depan."',
                  gaya: 'edukasi',
                  respons:
                    '"Tujuh ratus..." Bu Yani dan gaji konveksinya menghitung dengan cepat dan sampai pada ' +
                    'kesimpulan yang tertulis jelas di wajahnya. Kaleng formula di meja mendadak terlihat murah.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Solusi berbayar untuk masalah kesempatan justru menambah hambatan. Perah tangan + botol ' +
                    'kaca bekas sama efektifnya dengan pompa mahal — mulai dari yang nol rupiah.',
                },
                {
                  id: 'yk2_d2_c',
                  teks:
                    '"Sebenarnya kalau manajemen waktunya bagus, semua ibu bisa, Bu. Ibu-ibu zaman sekarang ' +
                    'saja yang gampang menyerah ke formula."',
                  gaya: 'konfrontasi',
                  respons:
                    'Bu Yani tersenyum sangat tipis. "Iya ya, Dok. Saya memang kurang pintar bagi waktu." ' +
                    'Kalimat itu keluar datar — dan kamu tahu barusan menambah satu suara lagi ke paduan ' +
                    'suara yang menyalahkan ibu bekerja.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    '"Ibu zaman sekarang" adalah kalimat yang mengubah masalah struktural (jam kerja, tak ada ' +
                    'ruang laktasi) jadi cacat pribadi. Itu bukan edukasi — itu penghakiman.',
                },
              ],
            },
            {
              id: 'yk2_d3',
              narasi:
                '"Satu lagi, Dok," Bu Yani ragu. "Di konveksi... merahnya di mana? Kamar mandinya antre ' +
                'dan kotor. Masa saya merah ASI di WC?"',
              pilihan: [
                {
                  id: 'yk2_d3_a',
                  teks:
                    '"Tidak boleh di WC — ASI itu makanan, bukan buangan. Konveksi Ibu wajib sediakan ' +
                    'tempat: itu amanat undang-undang. Biar saya yang bersurat resmi dari Puskesmas ke ' +
                    'pemilik konveksi — cukup pojok bersih, kursi, dan colokan. Musala pun boleh."',
                  gaya: 'empati',
                  respons:
                    '"Dokter mau bersurat... untuk saya?" Bu Yani terdiam. "Ada tiga ibu menyusui lagi di ' +
                    'konveksi, Dok. Kalau ada tempatnya, kami gantian jaga." Satu surat, empat bayi. ' +
                    'Mbah Painem menepuk lututnya: "Nah, ngono kuwi dokter."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Hambatan kesempatan kadang harus diselesaikan DI HULU: advokasi tempat kerja adalah tugas ' +
                    'Puskesmas juga (PP 33/2012 ruang laktasi). Satu surat resmi menolong semua ibu di tempat itu.',
                },
                {
                  id: 'yk2_d3_b',
                  teks:
                    '"Ya dicari saja pojok yang agak bersih, Bu. Pakai kerudung buat nutupin. Ibu-ibu lain ' +
                    'juga begitu biasanya, sambil duduk di mana saja bisa kok."',
                  gaya: 'edukasi',
                  respons:
                    'Bu Yani membayangkan memerah ASI di pojok gudang kain dengan kerudung — di sela target ' +
                    '400 pcs. "Iya... nanti saya lihat-lihat tempatnya." Nada yang sama dengan orang menyerah.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Menyuruh ibu "menyesuaikan diri" dengan tempat kerja yang abai = menormalkan pelanggaran ' +
                    'hak menyusui. Sistemnya yang harus bergeser, bukan ibunya yang terus mengalah.',
                },
                {
                  id: 'yk2_d3_c',
                  teks:
                    '"Kalau tempat kerjanya tidak mendukung begitu, ya pertimbangkan berhenti kerja dulu, ' +
                    'Bu. Enam bulan saja. Anak itu lebih penting dari gaji."',
                  gaya: 'konfrontasi',
                  respons:
                    'Hening. "Gaji saya yang bayar listrik dan cicilan motor, Dok," kata Bu Yani akhirnya, ' +
                    'pelan. Pak Herman di teras berhenti mengetuk-ngetuk obeng. Kamu baru saja menyuruh ' +
                    'keluarga ini memilih antara dua hal yang dua-duanya bernama Nayla.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    '"Berhenti kerja saja" adalah saran termahal yang paling gampang diucapkan. ASI eksklusif ' +
                    'tidak boleh dibayar dengan bangkrutnya keluarga — sistem penunjangnya yang dibangun.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'yk2_i1',
              nama: 'Gudang ASI Botol Selai + Surat Ruang Laktasi',
              deskripsi:
                'Jalankan rencana lengkap ibu bekerja: 6 botol kaca disterilkan jadi stok harian ' +
                '(spidol tanggal, kulkas kecil), jadwal perah 3 sesi (pagi-istirahat-malam), Mbah Painem ' +
                'dilatih penyajian rendam-hangat, dan surat resmi Puskesmas ke pemilik konveksi untuk ' +
                'pojok laktasi bersama.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Hari pertama kerja, kulkas kecil itu berisi tiga botol berlabel tanggal — tulisan tangan ' +
                'Bu Yani. Seminggu kemudian pemilik konveksi menyekat pojok musala dengan tirai dan kursi ' +
                'plastik: "daripada didatangi Puskesmas terus," katanya. Empat ibu memakainya bergantian. ' +
                'Kaleng formula itu akhirnya jadi hadiah arisan.',
            },
            {
              id: 'yk2_i2',
              nama: 'Penyuluhan Ulang Bahaya Formula',
              deskripsi:
                'Sesi edukasi tambahan tentang risiko susu formula dan keunggulan ASI untuk memantapkan ' +
                'pilihan keluarga.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Bu Yani mengangguk di seluruh sesi — ia sudah percaya sejak kunjungan lalu. Hari Senin ' +
                'ia tetap berangkat jam tujuh tanpa satu botol pun tersimpan, dan jam dua belas Mbah Painem ' +
                'membuka kaleng formula sambil meminta maaf pada foto di dinding. Keyakinan bukan masalahnya; ' +
                'logistik yang tak tersedia.',
            },
            {
              id: 'yk2_i3',
              nama: 'Grup Semangat Ibu Menyusui',
              deskripsi:
                'Masukkan Bu Yani ke grup pendukung sesama ibu menyusui binaan Puskesmas untuk saling ' +
                'menguatkan.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Grup itu ramai dan hangat — dan jam 12 siang, saat Nayla menangis lapar, yang tersedia di ' +
                'rumah tetap hanya kaleng formula. Semangat tidak bisa dituang ke botol; stok ASI perah bisa.',
            },
          ],
          penutupBerhasil:
            'Kamu pamit saat Bu Yani menulis tanggal di botol pertamanya dengan spidol — tulisannya tegak, ' +
            'seperti orang menandatangani sesuatu yang penting. "Enam bulan, Dok," katanya. "Nayla ASI tok ' +
            'sampai enam bulan, TITIK. Habis itu Mbah yang nyuapi pisang — sudah kontrak."',
          penutupGagal:
            'Kaleng formula itu tetap di meja saat kamu pamit, takarannya kini sudah tidak tersegel. ' +
            '"Buat jaga-jaga saja kok, Dok," kata Bu Yani — kalimat yang kalian berdua tahu adalah ' +
            'awal dari kebiasaan. Hari Senin tinggal dua belas hari lagi.',
        },
      ],
      epilogBerhasil:
        'Enam bulan usia Nayla dirayakan kecil-kecilan: Mbah Painem, sesuai kontrak, menyuapkan pisang ' +
        'kerok PERTAMA dengan upacara seperti melantik presiden. Di KMS, garis Nayla naik mantap di jalur ' +
        'hijau. Bu Yani mengirim foto botol-botol selai kosongnya ke grup ibu konveksi: "PENSIUN DENGAN HORMAT."',
      epilogGagal:
        'Formula akhirnya jadi menu utama — praktis, kata semua orang. Di Posyandu bulan berikutnya Nayla ' +
        'dua kali bolos timbang, dan saat akhirnya datang, garis KMS-nya melintas turun ke pita kuning. ' +
        '"Anaknya montok kok," kata Mbah Painem pada kader, membela diri dengan mata yang mulai ragu.',
    },
  },
]
