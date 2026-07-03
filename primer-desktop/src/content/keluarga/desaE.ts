/**
 * KELUARGA BINAAN DESA E (M3c) — empat keluarga arc 1-BABAK ("quick win"):
 * masalah tunggal yang tuntas dalam satu kunjungan berkualitas. Arc pendek
 * dimungkinkan oleh perubahan engine M3c (tamat = skenario terakhir sukses).
 *
 * keluarga_prapto  : sumur 3 meter dari kandang — air_bersih (kesempatan).
 * keluarga_marni   : janda DM tanpa JKN, kalah oleh birokrasi (kapabilitas).
 * keluarga_gunawan : ayah 2 pak/hari + anak asma — tidak_merokok (motivasi).
 * keluarga_lastri  : lansia sendirian, obat HT kacau — hipertensi (kapabilitas).
 */

import type { KeluargaBinaan } from '../types'

export const KELUARGA_DESA_E: KeluargaBinaan[] = [
  /* =========================================================================
   * KELUARGA PRAPTO — RW 6 (sedang), miskin — AIR BERSIH (kesempatan)
   * ======================================================================= */
  {
    id: 'keluarga_prapto',
    namaKeluarga: 'Keluarga Pak Prapto',
    rw: 6,
    jarakMenit: 25,
    ekonomi: 'miskin',
    anggota: [
      { nama: 'Pak Prapto', usia: 41, jenisKelamin: 'L', peran: 'kepala', kondisi: ['perokok_aktif'] },
      { nama: 'Bu Sumarni', usia: 36, jenisKelamin: 'P', peran: 'istri' },
      { nama: 'Rina', usia: 10, jenisKelamin: 'P', peran: 'anak', kondisi: ['sering_diare'] },
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
      air_bersih: 'tidak',
      jamban_sehat: 'ya',
    },
    arc: {
      sinopsis:
        'Rina (10) langganan diare — dan sumur keluarga ini hanya tiga meter dari kandang kambing. ' +
        'Semua orang tahu airnya bermasalah; tak seorang pun punya dua juta untuk memindahkan sumur.',
      kunjungan: [
        {
          id: 'prapto_k1',
          judul: 'Sumur Tiga Meter dari Kandang',
          pembuka:
            'Bau kandang kambing menyambut sebelum tuan rumahnya. Pak Prapto sedang menimba; airnya ' +
            'jernih di mata, tapi kandang bambu itu berdiri persis di belakang bibir sumur. ' +
            '"Airnya seger, Dok. Dari zaman bapak saya ya sumur ini."',
          target: ['air_bersih'],
          hambatanSebenarnya: 'kesempatan',
          petunjukHambatan:
            'Keluarga ini TAHU airnya dicurigai — Bu Sumarni bahkan sudah merebus air minum lebih lama sejak ' +
            'Rina bolak-balik diare. Masalahnya beton: memindahkan sumur atau membuat sumur bor butuh dua ' +
            'jutaan yang tak mereka punya, dan kandang tak bisa dipindah karena tanah sebelah bukan milik ' +
            'mereka. Ini soal biaya & lahan, bukan kemauan atau pengetahuan.',
          hotspot: [
            {
              id: 'prk1_h1',
              label: 'Kandang kambing menempel bibir sumur',
              narasi:
                'Tiga ekor kambing, kandang panggung, dan genangan kencing yang meresap ke tanah — tiga ' +
                'meter dari dinding sumur. Saat hujan, semua yang di atas tanah ini bertemu di bawah.',
              indikator: 'air_bersih',
              x: 75,
              y: 55,
            },
            {
              id: 'prk1_h2',
              label: 'Panci besar bekas merebus air',
              narasi:
                'Di dapur, panci paling besar berkerak kapur — dipakai merebus air minum tiap hari. ' +
                '"Sudah saya godhog lama-lama, Dok," kata Bu Sumarni. "Tapi Rina ya mencret juga."',
              x: 30,
              y: 40,
            },
            {
              id: 'prk1_h3',
              label: 'Obat zinc & oralit bekas di rak',
              narasi:
                'Rak dapur menyimpan arsip penyakit: tiga bungkus oralit kosong, strip zinc bekas, dan ' +
                'catatan kader "Rina — diare 3x dalam 4 bulan". Pola yang berteriak minta dibaca.',
              x: 50,
              y: 25,
            },
            {
              id: 'prk1_h4',
              label: 'Patok bambu di tanah sebelah',
              narasi:
                'Sebidang tanah kosong bersebelahan dipagari patok bambu. "Itu punya Haji Somad, Dok. ' +
                'Dulu bapak mau beli buat mindah kandang, tidak kesampaian sampai beliau meninggal."',
              x: 12,
              y: 70,
            },
          ],
          dialog: [
            {
              id: 'prk1_d1',
              narasi:
                '"Rina mencret lagi minggu kemarin, Dok," Bu Sumarni membuka sambil melirik suaminya. ' +
                '"Saya sudah curiga airnya. Tapi bapaknya bilang, dari zaman simbah ya air itu-itu saja, ' +
                'tidak ada yang mati."',
              pilihan: [
                {
                  id: 'prk1_d1_a',
                  teks:
                    '"Ibu sudah merebus lebih lama, sudah sedia oralit — Ibu sebenarnya sudah tahu arah ' +
                    'masalahnya ke mana. Kalau boleh jujur, apa yang membuat sumurnya belum dipindah sampai ' +
                    'sekarang?"',
                  gaya: 'refleksi',
                  respons:
                    'Suami-istri itu bertukar pandang. "Duitnya, Dok," jawab Pak Prapto akhirnya, tanpa basa-basi. ' +
                    '"Tukang bilang dua juta buat sumur bor. Kambing tiga ekor itu dijual pun tidak nutut — ' +
                    'dan kambing itu sekolahnya Rina."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Afirmasi usaha yang SUDAH dilakukan (merebus, oralit) membuka pengakuan jujur soal hambatan ' +
                    'sebenarnya. Keluarga miskin jarang menolak perubahan — mereka menolak ditagih biaya perubahan.',
                },
                {
                  id: 'prk1_d1_b',
                  teks:
                    '"Zaman simbah orang juga banyak yang sakit perut, Pak — cuma dulu tidak ada yang ' +
                    'mencatat. Air sumur ini hampir pasti tercemar bakteri dari kandang. Harus dipindah."',
                  gaya: 'edukasi',
                  respons:
                    '"Harus dipindah," ulang Pak Prapto datar, menatap sumurnya. "Pakai apa, Dok?" Pertanyaan ' +
                    'itu menggantung — kamu mendiagnosis dengan benar dan menulis resep yang tak bisa ditebus.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Diagnosis lingkungan yang benar tanpa jalan pembiayaan = ceramah. "Harus" milik yang ' +
                    'punya uang; keluarga ini butuh "caranya".',
                },
                {
                  id: 'prk1_d1_c',
                  teks:
                    '"Pak, anak diare tiga kali dalam empat bulan itu tanda bapaknya kurang sigap. Masa ' +
                    'kalah sama kambing — kesehatan anak kok nomor dua."',
                  gaya: 'konfrontasi',
                  respons:
                    'Rahang Pak Prapto mengeras. "Kambing itu BUAT anak saya, Dok. Sekolahnya, seragamnya." ' +
                    'Ia menancapkan timba dan masuk ke rumah. Wawancara dengan kepala keluarga selesai lebih cepat.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menuduh "tidak sayang anak" pada orang tua yang justru menabung lewat ternak demi anaknya ' +
                    'adalah salah baca kemiskinan yang paling umum — dan paling mahal harganya.',
                },
              ],
            },
            {
              id: 'prk1_d2',
              narasi:
                'Rina pulang sekolah, menyalami tanganmu, lalu minum langsung dari kendi. Bu Sumarni ' +
                'buru-buru: "Itu sudah air godhogan kok, Dok."',
              pilihan: [
                {
                  id: 'prk1_d2_a',
                  teks:
                    '"Bagus, Bu — merebus itu sudah separuh perang. Separuhnya lagi di luar panci: gayung, ' +
                    'kendi, ember bekas timba, tangan setelah dari kandang. Kuman dari sumur ikut menempel ' +
                    'di semua jalurnya. Boleh saya lihat dapurnya sebentar?"',
                  gaya: 'empati',
                  respons:
                    'Bu Sumarni mengangguk dan di dapur kalian menemukannya: gayung yang sama dipakai menimba ' +
                    'dan mencedok air matang. "Oalah... jadi godhogan saya bocor di gayung to, Dok." Ia tertawa ' +
                    'getir — tapi kini ia MELIHAT jalurnya.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Jalur kontaminasi ulang (recontamination) adalah titik buta klasik: air matang aman hanya ' +
                    'sampai wadah kotor pertama. Menelusurinya BERSAMA pasien jauh lebih melekat daripada daftar larangan.',
                },
                {
                  id: 'prk1_d2_b',
                  teks:
                    '"Air rebusan tetap bisa tercemar ulang, Bu. Pastikan wadah tertutup, gayung khusus, ' +
                    'cuci tangan pakai sabun. Itu namanya pengamanan air rumah tangga."',
                  gaya: 'edukasi',
                  respons:
                    '"Inggih, Dok." Daftar itu diterima dengan sopan dan hilang dari kepala sebelum kamu ' +
                    'sampai halaman — terlalu banyak larangan sekaligus, tak satu pun terhubung dengan ' +
                    'benda nyata di dapurnya.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Checklist verbal menguap; temuan yang ditunjuk bersama menempel. Selalu tambatkan edukasi ' +
                    'PHBS pada benda milik pasien, bukan pada istilah program.',
                },
                {
                  id: 'prk1_d2_c',
                  teks:
                    '"Godhogan saja tidak cukup, Bu, buktinya Rina mencret terus. Berarti ada yang salah ' +
                    'dengan cara Ibu mengurus air di rumah ini."',
                  gaya: 'konfrontasi',
                  respons:
                    'Wajah Bu Sumarni jatuh. Ia sudah merebus air tiap hari dengan kayu bakar yang dicarinya ' +
                    'sendiri — dan barusan divonis gagal mengurus rumah di depan anaknya.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menyalahkan pelaksana usaha yang sudah benar-arah tapi belum lengkap = memadamkan satu-satunya ' +
                    'perilaku baik yang sedang tumbuh.',
                },
              ],
            },
            {
              id: 'prk1_d3',
              narasi:
                '"Sebenarnya kami pernah dengar ada bantuan sumur dari desa, Dok," kata Pak Prapto yang ' +
                'muncul lagi membawa kopi — tanda damai. "Tapi ya cuma dengar-dengar. Orang macam kami ' +
                'ini tidak tahu jalannya ke sana."',
              pilihan: [
                {
                  id: 'prk1_d3_a',
                  teks:
                    '"Jalannya lewat Musyawarah Desa, Pak — dan usulan kesehatan lingkungan itu justru ' +
                    'makin kuat kalau yang membawa Puskesmas. Data diare Rina ini bukti resminya. Saya ' +
                    'yang angkat di rapat desa; Bapak siapkan tanda tangan tetangga yang sumurnya senasib."',
                  gaya: 'empati',
                  respons:
                    '"Tetangga senasib itu... ya separuh RT ini, Dok," Pak Prapto menegakkan duduknya. ' +
                    '"Kalau Dokter yang bawa datanya, saya berani keliling minta tanda tangan. Malam ini juga." ' +
                    'Untuk pertama kalinya, dua juta itu terdengar seperti urusan yang ada pintunya.',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'air_bersih',
                    ambangTrust: 4,
                    responsBohong:
                      '"Halah, airnya aman kok, Dok. Mencretnya Rina itu paling jajan es di sekolahan," ' +
                      'kata Pak Prapto sambil menutup tudung sumur — persis di depan kandang kambingnya.',
                  },
                  catatanPedagogis:
                    'Hambatan kesempatan skala rumah kadang hanya bisa dijawab skala DESA: dana desa, Musdes, ' +
                    'dan data Puskesmas adalah satu paket advokasi. Dokter FKTP juga aktor pembangunan, bukan cuma pengobat.',
                },
                {
                  id: 'prk1_d3_b',
                  teks:
                    '"Coba saja tanya ke kantor desa, Pak. Biasanya ada program sanitasi, syaratnya ' +
                    'tinggal dilengkapi. Prosedurnya mereka yang lebih paham."',
                  gaya: 'edukasi',
                  respons:
                    '"Inggih... coba-coba tanya." Nada yang sama dengan "dengar-dengar" tadi. Orang yang ' +
                    'tiga kali kalah oleh loket tidak berangkat karena kata "coba saja".',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Merujuk warga rentan ke birokrasi tanpa pendamping = mengembalikan surat ke pengirim. ' +
                    'Sebutkan forumnya, siapa yang mendampingi, dan apa peran pasien — atau usulan itu mati di niat.',
                },
                {
                  id: 'prk1_d3_c',
                  teks:
                    '"Sambil menunggu bantuan yang belum tentu, mending kambingnya dijual saja dulu, Pak. ' +
                    'Kesehatan tidak bisa menunggu Musyawarah Desa."',
                  gaya: 'konfrontasi',
                  respons:
                    'Kopi di tanganmu mendadak terasa dingin. "Kambing itu tabungan sekolah Rina, Dok," ' +
                    'kata Pak Prapto untuk kedua kalinya sore itu — kali ini dengan mata yang selesai denganmu.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Memaksa keluarga miskin melikuidasi aset produktifnya demi target program = memindahkan ' +
                    'penyakit dari perut ke masa depan. Solusi yang memiskinkan bukan solusi kesehatan.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'prk1_i1',
              nama: 'Usulan Sumur Bor Komunal via Musdes',
              deskripsi:
                'Bawa data diare berulang RT ini sebagai usulan resmi Puskesmas ke Musyawarah Desa: sumur ' +
                'bor komunal dari dana desa untuk lima rumah senasib — plus pengamanan sementara di rumah ' +
                '(gayung pisah, wadah tertutup) sampai sumurnya jadi.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Musdes menyetujuinya di anggaran perubahan — data diare dari Puskesmas susah dibantah, dan ' +
                'tanda tangan sembilan KK yang dikumpulkan Pak Prapto semalam menutup sisanya. Tiga bulan ' +
                'lagi sumur bor komunal berdiri lima puluh meter dari kandang terdekat. Rina tidak mencret ' +
                'lagi sejak gayungnya dipisah.',
            },
            {
              id: 'prk1_i2',
              nama: 'Penyuluhan PHBS Air Minum',
              deskripsi:
                'Edukasi lengkap pengamanan air rumah tangga: rebus, simpan tertutup, gayung khusus, ' +
                'cuci tangan pakai sabun.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Bu Sumarni kini juara PHBS se-RT — wadah tertutup, gayung terpisah, sabun di dekat sumur. ' +
                'Tapi sumbernya tetap sumur yang sama tiga meter dari kandang itu, dan tiap musim hujan ' +
                'datang, oralit di rak dapur kembali berkurang.',
            },
            {
              id: 'prk1_i3',
              nama: 'Gerakan Sadar Air Bersih',
              deskripsi:
                'Kampanye kesadaran pentingnya air bersih bagi keluarga lewat pertemuan RT dan poster.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Pertemuan RT ramai dan semua mengangguk — kesadaran memang tidak pernah jadi masalahnya. ' +
                'Pulang dari pertemuan, orang-orang menimba dari sumur yang sama, karena poster tidak ' +
                'bisa dipakai menggali.',
            },
          ],
          penutupBerhasil:
            'Kamu pulang membawa map berisi sembilan tanda tangan yang masih bau kopi. Di belakang, ' +
            'Pak Prapto menutup tudung sumurnya dengan hati-hati — benda yang sebentar lagi jadi cadangan, ' +
            'bukan gantungan hidup. "Kalau sumur bornya jadi, Dok, kambing saya aman to?" Ia tertawa. Kamu juga.',
          penutupGagal:
            'Sore turun dan Bu Sumarni mulai merebus air untuk besok — ritual harian melawan musuh yang ' +
            'meresap dari tiga meter jauhnya. Di rak dapur, stok oralit tinggal satu. Ia menuliskannya di ' +
            'daftar belanja, di bawah kata "sabun": barang rutin, seperti beras.',
          karma: {
            kasusId: 'demam_tifoid',
            anggotaIndex: 2,
            jatuhTempoHari: 32,
            narasi:
              'Rina digendong bapaknya masuk poli — lemas, demam naik-turun sembilan hari yang dikira ' +
              '"cuma diare biasa lagi". Lidahnya kotor berselaput, perutnya nyeri. "Minumnya ya air godhogan ' +
              'itu, Dok," kata Pak Prapto dengan suara orang yang sudah tahu jawaban dari pertanyaan yang ' +
              'tak pernah selesai diurusnya.',
          },
        },
      ],
      epilogBerhasil:
        'Peresmian sumur bor komunal dihadiri kepala desa dan lima KK pemakainya. Pak Prapto didaulat jadi ' +
        'ketua kelompok pemakai air — "wong beliau yang keliling cari tanda tangan". Di catatan kader, kolom ' +
        'diare Rina berhenti bertambah, dan tiga kambing itu tetap utuh sampai Rina masuk SMP.',
      epilogGagal:
        'Usulan sumur tidak pernah sampai ke Musdes — tidak ada yang membawakannya. Keluarga itu kembali ke ' +
        'ritme lamanya: merebus, jatuh sakit, membeli oralit, merebus lagi. Di poli, kartu berobat Rina ' +
        'menebal pelan-pelan, halaman demi halaman, seperti buku harian yang ditulis penyakit.',
    },
  },

  /* =========================================================================
   * KELUARGA MARNI — RW 2 (dekat), rentan — JKN (kapabilitas/birokrasi)
   * ======================================================================= */
  {
    id: 'keluarga_marni',
    namaKeluarga: 'Keluarga Bu Marni',
    rw: 2,
    jarakMenit: 10,
    ekonomi: 'rentan',
    anggota: [
      { nama: 'Bu Marni', usia: 52, jenisKelamin: 'P', peran: 'kepala', kondisi: ['dm_tipe2'] },
      { nama: 'Dodi', usia: 17, jenisKelamin: 'L', peran: 'anak' },
    ],
    indikatorAwal: {
      kb: 'na',
      persalinan_faskes: 'na',
      imunisasi_dasar: 'na',
      asi_eksklusif: 'na',
      pantau_tumbuh_kembang: 'na',
      tb_berobat_standar: 'na',
      hipertensi_berobat: 'na',
      jiwa_tidak_ditelantarkan: 'na',
      tidak_merokok: 'ya',
      jkn: 'tidak',
      air_bersih: 'ya',
      jamban_sehat: 'ya',
    },
    arc: {
      sinopsis:
        'Bu Marni (52), janda penjual gorengan, kencing manisnya "diobati" beli obat warung sejak suaminya ' +
        'meninggal — bersama kepesertaan JKN yang ikut mati karena tunggakan yang tak ia mengerti.',
      kunjungan: [
        {
          id: 'marni_k1',
          judul: 'Kartu yang Mati Bersama Suami',
          pembuka:
            'Wajan gorengan baru diangkat saat kamu datang; Bu Marni menyeka tangan ke celemek dan ' +
            'menyuguhkan bakwan tanpa bisa ditolak. "Sehat kok saya, Dok. Cuma kesemutan-kesemutan dikit ' +
            'kalau malam. Namanya juga umur."',
          target: ['jkn'],
          hambatanSebenarnya: 'kapabilitas',
          petunjukHambatan:
            'Bu Marni MAU berobat dan sadar gulanya tinggi — kartu JKN-nya yang jadi tembok: nonaktif sejak ' +
            'suaminya (pencari nafkah & pemegang urusan surat) meninggal, menunggak entah berapa, dan dua ' +
            'kali percobaan mengurus kandas karena diminta "login Mobile JKN" dan "surat keterangan" yang ' +
            'ia tak paham. Ini buta prosedur & literasi digital — bukan malas, bukan tak mau bayar.',
          hotspot: [
            {
              id: 'mk1_h1',
              label: 'Obat warung di kaleng kerupuk',
              narasi:
                'Kaleng kerupuk berisi apotek pribadi: jamu pegal linu, obat warung serba-guna, dan strip ' +
                'metformin sisa 2 tablet — "beli ketengan di apotek, Dok, kalau pas ada uang".',
              x: 60,
              y: 35,
            },
            {
              id: 'mk1_h2',
              label: 'Kartu JKN atas nama almarhum',
              narasi:
                'Di dompet lusuh yang ia tunjukkan malu-malu: dua kartu JKN. Punya suaminya — yang setahun ' +
                'lalu meninggal — dan punyanya, keduanya nonaktif. "Katanya nunggak, Dok. Nunggaknya berapa, ' +
                'di mana bayarnya, saya tidak mudeng."',
              indikator: 'jkn',
              x: 30,
              y: 55,
            },
            {
              id: 'mk1_h3',
              label: 'Bekas luka di tungkai yang lama sembuh',
              narasi:
                'Di tungkai kanan Bu Marni ada bekas luka kehitaman selebar koin. "Kena knalpot tiga bulan ' +
                'lalu, Dok. Sembuhnya lamaaa sekali, sampai bernanah dulu." Luka DM yang lolos tanpa nama.',
              x: 45,
              y: 80,
            },
            {
              id: 'mk1_h4',
              label: 'HP tombol di atas tumpukan minyak',
              narasi:
                'HP tombol tergeletak dekat wajan. "Kata petugas suruh unduh aplikasi, Dok," Bu Marni ' +
                'terkekeh tanpa humor. "Diunduh pakai apa, wong HP-nya buat nelpon Dodi saja."',
              x: 80,
              y: 60,
            },
          ],
          dialog: [
            {
              id: 'mk1_d1',
              narasi:
                '"Dulu semua urusan kartu-kartu itu bapaknya Dodi yang pegang," Bu Marni menunduk, ' +
                'membolak-balik bakwan. "Sejak beliau tidak ada... saya ini kayak orang buta huruf urusan ' +
                'begituan, Dok. Dua kali ke kantor, dua kali pulang cuma bawa bingung."',
              pilihan: [
                {
                  id: 'mk1_d1_a',
                  teks:
                    '"Dua kali berangkat sendirian ke kantor yang bikin bingung itu justru bukti Ibu tidak ' +
                    'menyerah. Coba ceritakan pelan-pelan: sampai di sana, mentoknya di bagian mana?"',
                  gaya: 'refleksi',
                  respons:
                    '"Yang pertama disuruh isi formulir, saya salah terus nulisnya. Yang kedua katanya harus ' +
                    'pindah kelas ke yang gratis — tapi syaratnya minta surat dari desa, terus desanya minta ' +
                    'surat dari yang lain lagi..." Ia mengibas tangan. "Muter, Dok. Kayak digoreng bolak-balik."',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Memetakan titik macet prosedural dengan presisi = separuh solusi. "Pindah ke PBI butuh ' +
                    'surat berlapis" adalah labirin nyata bagi lansia sendirian — bukan kemalasan.',
                },
                {
                  id: 'mk1_d1_b',
                  teks:
                    '"Sekarang gampang kok, Bu — semua bisa dari HP lewat Mobile JKN atau WhatsApp ' +
                    'Pandawa. Tidak usah ke kantor. Nanti saya tuliskan nomornya."',
                  gaya: 'edukasi',
                  respons:
                    'Bu Marni melirik HP tombolnya di dekat wajan, lalu menatapmu dengan sabar seperti ' +
                    'menatap anak kecil yang belum paham. "Inggih, Dok. Ditulis saja nomornya." — di kertas ' +
                    'yang akan menemani kartu-kartu mati di dompet itu.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Solusi digital untuk warga non-digital = tembok baru dengan cat baru. Cek DULU perangkat ' +
                    'dan literasi pasien sebelum meresepkan aplikasi.',
                },
                {
                  id: 'mk1_d1_c',
                  teks:
                    '"Sebenarnya kalau iurannya rutin dibayar dari dulu kan tidak nunggak, Bu. Sekarang ' +
                    'jadi susah sendiri to."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Inggih, salah saya, Dok." Bu Marni membalik bakwan yang belum perlu dibalik. Suaminya ' +
                    'sakit dua tahun sebelum meninggal — ke mana iuran itu pergi bukan misteri, dan barusan ' +
                    'kamu menagih utang pada dukanya.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Tunggakan JKN keluarga rentan hampir selalu punya cerita (sakit panjang, PHK, kematian). ' +
                    'Menghakimi riwayat tunggakan menutup pintu untuk menyelesaikannya.',
                },
              ],
            },
            {
              id: 'mk1_d2',
              narasi:
                'Kamu bertanya soal kesemutan malam dan luka knalpot yang lama sembuh itu. "Kata orang ' +
                'gula, Dok," Bu Marni mengaku. "Pernah dicek di Posyandu Lansia — dua ratus tujuh puluh. ' +
                'Tapi mau berobat rutin... pakai kartu apa?"',
              pilihan: [
                {
                  id: 'mk1_d2_a',
                  teks:
                    '"Dua ratus tujuh puluh plus kesemutan plus luka lama sembuh — Ibu sudah merangkai ' +
                    'sendiri diagnosisnya, dan Ibu benar. Justru karena itu kartu ini naik pangkat: bukan ' +
                    'lagi urusan administrasi, tapi urusan menyelamatkan kaki dan ginjal Ibu. Boleh saya ' +
                    'lihat KTP dan KK-nya? Kita urus bersama, bukan Ibu sendirian lagi."',
                  gaya: 'empati',
                  respons:
                    'Bu Marni mematikan kompor — baru kali ini sejak kamu datang. Ia mengambil map plastik ' +
                    'dari lemari, lengkap, rapi, siap sejak lama. "Kalau ada yang nemani ngurusnya, Dok... ' +
                    'saya ini sebenarnya sudah kepingin berobat dari kapan-kapan."',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'jkn',
                    ambangTrust: 4,
                    responsBohong:
                      '"Kartunya masih aktif kok, Dok, cuma... kemarin ketinggalan di rumah Dodi mbahnya," ' +
                      'jawabnya sambil menutup dompet lusuh itu lebih cepat dari yang wajar.',
                  },
                  catatanPedagogis:
                    'Menghubungkan kartu dengan ORGAN yang dipertaruhkan (kaki, ginjal) mengubah prioritas pasien. ' +
                    'Dan "kita urus bersama" adalah intervensi kapabilitas paling sederhana: pendampingan.',
                },
                {
                  id: 'mk1_d2_b',
                  teks:
                    '"Gula 270 itu harus segera diobati rutin, Bu. DM yang dibiarkan bisa kena ginjal, mata, ' +
                    'sampai amputasi kaki. Obat warung tidak akan menurunkan gula."',
                  gaya: 'edukasi',
                  respons:
                    '"Amputasi..." Bu Marni mengulang kata itu pelan, takut. "Tapi ya itu, Dok. Kartu saya ' +
                    'mati." Kalian kembali ke tembok yang sama — ketakutannya bertambah, jalannya belum.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Komplikasi DM layak dijelaskan — tapi tanpa membereskan akses, edukasi hanya menaikkan ' +
                    'kecemasan pada orang yang sudah tahu ia sakit dan tak bisa berobat.',
                },
                {
                  id: 'mk1_d2_c',
                  teks:
                    '"Kalau memang niat, berobat umum juga bisa, Bu. Sekali kontrol paling lima puluh ribu ' +
                    'sama obatnya. Segelas dua gelas es teh pelanggan sudah nutup itu."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Lima puluh ribu itu dagangan sehari, Dok," jawab Bu Marni tanpa nada — cuma fakta. ' +
                    '"Sebulan empat kali kontrol, empat hari Dodi tidak jajan dan tidak bayar kas sekolah." ' +
                    'Aritmetika kemiskinan selalu lebih teliti daripada asumsi orang mampu.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Menghitung dompet pasien dengan kurs sendiri = cara tercepat kehilangan kepercayaan. ' +
                    'JKN PBI ada persis untuk aritmetika ini — itu jalurnya, bukan "niat".',
                },
              ],
            },
            {
              id: 'mk1_d3',
              narasi:
                'Dodi pulang membawa setumpuk gorengan titipan warung yang tak laku. Ia SMK jurusan ' +
                'komputer, kata Bu Marni dengan bangga yang diam-diam. "Cuma dia malu ikut ngurus-ngurus ' +
                'begituan, Dok. Katanya itu urusan orang tua."',
              pilihan: [
                {
                  id: 'mk1_d3_a',
                  teks:
                    '"Dodi, sini sebentar. Kamu bisa bikin akun, unduh aplikasi, isi formulir online kan? ' +
                    'Nah — satu-satunya orang di rumah ini yang bisa menyelamatkan kaki ibumu lewat HP itu ' +
                    'kamu. Bukan urusan orang tua; ini urusan orang yang paling bisa."',
                  gaya: 'empati',
                  respons:
                    'Dodi menegakkan badan, antara kaget dan tersanjung. "...Kalau cuma daftar-daftar online ' +
                    'gitu mah gampang, Dok. Nanti malam saya coba pakai HP teman." Bu Marni memandang anaknya ' +
                    'seperti baru sadar telah setahun mengabaikan komputer hidup di rumahnya sendiri.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Aset kapabilitas sering serumah tapi tak diaktifkan karena norma ("urusan orang tua"). ' +
                    'Memberi anak PERAN RESMI menembus norma itu — pola yang sama dengan Rohman di keluarga Asih.',
                },
                {
                  id: 'mk1_d3_b',
                  teks:
                    '"Wah, anak SMK komputer. Nanti kapan-kapan bisa diajari ibunya pakai aplikasi ' +
                    'JKN ya. Berguna itu ilmunya."',
                  gaya: 'edukasi',
                  respons:
                    '"Iya, Dok," jawab Dodi otomatis, lalu masuk kamar membawa gorengannya. "Kapan-kapan" ' +
                    'adalah tanggal yang tidak pernah ada di kalender anak tujuh belas tahun.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Saran tanpa penugasan dan tenggat = harapan, bukan rencana. Bedanya satu kalimat: ' +
                    '"nanti malam kamu yang daftarkan" versus "kapan-kapan bisa diajari".',
                },
                {
                  id: 'mk1_d3_c',
                  teks:
                    '"Dodi, kamu kan sudah besar. Ibu sakit begini kok kamu diam saja dari kemarin-kemarin. ' +
                    'Malu itu tidak menyembuhkan ibumu."',
                  gaya: 'konfrontasi',
                  respons:
                    'Telinga Dodi memerah. Ia meletakkan gorengan itu dan masuk tanpa bicara. "Anaknya memang ' +
                    'pendiam, Dok," Bu Marni buru-buru membela — dan sisa kunjunganmu terasa seperti berjalan ' +
                    'di rumah yang barusan kamu buat retak.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Mempermalukan remaja di depan ibunya mengunci pintu yang sedang kamu ketuk. Remaja ' +
                    'bergerak karena diberi peran terhormat, bukan karena ditelanjangi kelalaiannya.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'mk1_i1',
              nama: 'Paket Pendampingan: Dodi + Jalur PBI',
              deskripsi:
                'Tugaskan Dodi (resmi, dengan panduan tertulis dari Puskesmas) mengurus pengalihan ' +
                'kepesertaan ke PBI lewat jalur online + siapkan surat keterangan tidak mampu yang ' +
                'diproses KOLEKTIF Puskesmas-desa, dan jadwalkan Bu Marni masuk Prolanis begitu kartu aktif.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Sebelas hari kemudian Bu Marni muncul di poli membawa print-print-an dari warnet: kartu ' +
                'JKN PBI aktif atas namanya — "yang ngurus Dodi semua, Dok, saya tinggal cap jempol". ' +
                'GDS pertamanya sebagai peserta Prolanis: 262. Masih tinggi; bedanya, sekarang ada yang mencatat.',
            },
            {
              id: 'mk1_i2',
              nama: 'Edukasi Diet DM & Senam Lansia',
              deskripsi:
                'Ajari pengaturan makan diabetes (kurangi gorengan & teh manis) dan ajak ikut senam ' +
                'Posyandu Lansia rutin.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Bu Marni patuh mengurangi gula tehnya dan ikut senam dua kali — niatnya memang tidak pernah ' +
                'jadi masalah. Metformin ketengan itu tetap 2 tablet di kaleng kerupuk, karena diet paling ' +
                'disiplin pun tidak menggantikan obat yang tak terbeli.',
            },
            {
              id: 'mk1_i3',
              nama: 'Bantuan Sembako Keluarga Rentan',
              deskripsi:
                'Masukkan keluarga Bu Marni ke daftar penerima bantuan sembako program desa untuk ' +
                'meringankan beban harian.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Beras dan minyak datang tiap bulan — dagangan gorengannya bahkan sedikit lebih untung. ' +
                'Tapi kartu di dompet itu tetap mati, karena yang mengalahkan Bu Marni bukan harga beras: ' +
                'formulir, loket, dan aplikasi yang bicara bahasa lain.',
            },
          ],
          penutupBerhasil:
            'Kamu pamit dengan bungkusan bakwan yang tak bisa ditolak. Di belakang, terdengar Bu Marni ' +
            'memanggil anaknya — "Dod, kata Dokter kamu yang paling bisa" — dan suara pintu kamar terbuka. ' +
            'Kartu yang mati bersama suaminya sebentar lagi hidup lewat jempol anaknya.',
          penutupGagal:
            'Wajan itu kembali berbunyi sebelum kamu keluar pagar — hidup harus terus digoreng. Di dompet ' +
            'lusuh itu dua kartu mati tetap bersandingan, dan kesemutan malam akan tetap disebut "namanya ' +
            'juga umur" sampai ia punya nama yang sebenarnya.',
          karma: {
            kasusId: 'dm_tipe2',
            anggotaIndex: 0,
            jatuhTempoHari: 38,
            narasi:
              'Bu Marni datang ke poli diantar Dodi yang bolos sekolah — lemas, pandangan kabur, luka baru ' +
              'di jempol kaki yang "kena minyak seminggu lalu" dan membusuk diam-diam di balik perban ' +
              'seadanya. "Nggak bisa jualan tiga hari, Dok," bisiknya, lebih cemas soal dagangan daripada ' +
              'kakinya. GDS: 388. Kartu di dompetnya masih mati.',
          },
        },
      ],
      epilogBerhasil:
        'Tiga bulan kemudian, di sesi Prolanis, Bu Marni jadi bintang: GDS turun ke 180-an, luka knalpot ' +
        'lamanya diperiksa rutin, dan ia berjualan gorengan DI DEPAN aula senam lansia — izin dari kader, ' +
        'menunya kini ada pisang rebus. Dodi naik kelas dengan nilai praktik tertinggi: "bikin sistem antrian ' +
        'online", katanya, "terinspirasi ngurusin kartu Ibu".',
      epilogGagal:
        'Jempol kaki itu akhirnya membawa Bu Marni ke IGD kabupaten sebagai pasien umum — dan pulang dengan ' +
        'utang yang membuat gerobak gorengannya berpindah tangan. Di kaleng kerupuk, strip metformin ' +
        'ketengan itu masih tersisa dua tablet: cadangan untuk hari yang lebih sulit, yang ternyata ' +
        'sudah lewat.',
    },
  },

  /* =========================================================================
   * KELUARGA GUNAWAN — RW 1 (dekat), cukup — ROKOK (motivasi)
   * ======================================================================= */
  {
    id: 'keluarga_gunawan',
    namaKeluarga: 'Keluarga Pak Gunawan',
    rw: 1,
    jarakMenit: 8,
    ekonomi: 'cukup',
    anggota: [
      { nama: 'Pak Gunawan', usia: 38, jenisKelamin: 'L', peran: 'kepala', kondisi: ['perokok_berat'] },
      { nama: 'Bu Ratna', usia: 33, jenisKelamin: 'P', peran: 'istri' },
      { nama: 'Dimas', usia: 7, jenisKelamin: 'L', peran: 'anak', kondisi: ['asma_anak'] },
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
      jamban_sehat: 'ya',
    },
    arc: {
      sinopsis:
        'Dimas (7) asmanya kambuh makin sering — dan inhalernya disimpan di laci yang sama dengan slop ' +
        'kretek ayahnya. Pak Gunawan, sopir truk ekspedisi, merokok dua pak sehari "buat melek di jalan".',
      kunjungan: [
        {
          id: 'gunawan_k1',
          judul: 'Asbak di Samping Nebulizer',
          pembuka:
            'Rumah tembok yang rapi dengan garasi berisi truk kecil. Di ruang tamu, dua benda bertetangga ' +
            'di atas bufet: nebulizer anak bergambar badut — dan asbak kaca yang penuh. Bu Ratna menyambut; ' +
            'Pak Gunawan baru bangun, semalam nyetir dari luar kota.',
          target: ['tidak_merokok'],
          hambatanSebenarnya: 'motivasi',
          petunjukHambatan:
            'Pak Gunawan TAHU rokok memperparah asma anaknya — dokter poli sudah dua kali bilang, dan ia ' +
            'bisa mengulang kalimatnya. Uang pun ada. Yang mengunci: nikotin dua pak sehari, keyakinan ' +
            '"nyopir malam tanpa rokok = ketiduran = mati", dan gengsi bahwa "sopir yang tidak merokok itu ' +
            'seperti truk tanpa klakson". Ini adiksi + identitas, bukan ilmu atau uang.',
          hotspot: [
            {
              id: 'gk1_h1',
              label: 'Nebulizer & asbak bersebelahan',
              narasi:
                'Nebulizer bergambar badut itu berdebu tipis di atasnya — sering dipakai, jarang dilap. ' +
                'Sepuluh senti darinya, asbak kaca penuh puntung. Dua alat napas satu bufet.',
              indikator: 'tidak_merokok',
              x: 55,
              y: 35,
            },
            {
              id: 'gk1_h2',
              label: 'Slop kretek di laci yang sama dengan inhaler',
              narasi:
                'Laci bufet setengah terbuka: inhaler biru Dimas tergeletak di atas dua slop kretek cadangan. ' +
                'Logistik penyakit dan penyebabnya, satu alamat.',
              x: 70,
              y: 55,
            },
            {
              id: 'gk1_h3',
              label: 'Gambar krayon Dimas di kulkas',
              narasi:
                'Di pintu kulkas, gambar krayon: tiga sosok — ayah besar dengan garis abu-abu keriting keluar ' +
                'dari mulut, ibu, dan anak kecil dengan coretan biru di dada. Guru menuliskan judul dikte: ' +
                '"BAPAK, IBU, DAN AKU LAGI SESAK".',
              x: 20,
              y: 45,
            },
            {
              id: 'gk1_h4',
              label: 'Jadwal ekspedisi malam di dinding',
              narasi:
                'Papan tulis kecil: "SBY-SOLO PP: Sen-Rab-Jum, brgkt 21.00". Rute malam tiga kali seminggu — ' +
                'jam-jam di mana sebatang demi sebatang menjadi alasan untuk tetap terjaga.',
              x: 85,
              y: 25,
            },
          ],
          dialog: [
            {
              id: 'gk1_d1',
              narasi:
                'Pak Gunawan duduk sambil — refleks — mengetuk-ngetuk bungkus kretek di meja. "Saya tahu ' +
                'kok, Dok, arahnya ke mana ini," ia tersenyum duluan. "Rokok, kan? Sudah hafal saya. Tapi ' +
                'nyopir malam tanpa rokok itu sama saja setor nyawa di tol."',
              pilihan: [
                {
                  id: 'gk1_d1_a',
                  teks:
                    '"Betul, Pak — dan saya tidak akan minta Bapak memilih antara melek di tol dan napas ' +
                    'Dimas. Dua-duanya harus dapat. Boleh saya tanya dulu: dari dua pak itu, batang yang mana ' +
                    'yang benar-benar bikin melek, dan yang mana cuma kebiasaan tangan?"',
                  gaya: 'refleksi',
                  respons:
                    'Pak Gunawan berhenti mengetuk bungkus. "...Yang di tol paling lima-enam batang, Dok. ' +
                    'Sisanya ya... sambil ngopi, habis makan, nunggu muatan." Ia menghitung dengan jarinya ' +
                    'sendiri dan terdiam: tiga perempat rokoknya baru saja kehilangan alasan.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Memilah rokok "fungsional" vs "otomatis" adalah teknik MI untuk adiksi: pasien menemukan ' +
                    'sendiri bahwa sebagian besar konsumsinya tidak dilindungi alasan utamanya.',
                },
                {
                  id: 'gk1_d1_b',
                  teks:
                    '"Justru itu keliru, Pak — nikotin itu stimulan sesaat, habis itu malah bikin ngantuk ' +
                    'rebound. Kopi dan power nap 20 menit lebih aman buat sopir malam. Penelitiannya banyak."',
                  gaya: 'edukasi',
                  respons:
                    '"Penelitian mana pernah bawa truk muatan keramik Suroboyo-Solo, Dok," Pak Gunawan ' +
                    'terkekeh, dan meja itu tertawa bersamanya. Faktamu benar dan barusan kalah suara.',
                  efekTrust: 0,
                  tepat: false,
                  catatanPedagogis:
                    'Membantah pengalaman tubuh 20 tahun dengan jurnal = kalah sebelum bertanding. Simpan ' +
                    'faktanya untuk NANTI, setelah ia sendiri meragukan kebiasaannya.',
                },
                {
                  id: 'gk1_d1_c',
                  teks:
                    '"Pak, anak Bapak sesak napas gara-gara asap Bapak sendiri. Sopir macam apa yang ' +
                    'selamat di tol tapi meracuni anak di rumah?"',
                  gaya: 'konfrontasi',
                  respons:
                    'Senyum Pak Gunawan padam. "Sopir yang kerja buat beli inhaler anaknya, Dok." Jawaban ' +
                    'itu datang cepat dan dingin — sudah lama disiapkan untuk tamu yang datang menghakimi.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Perokok ayah hampir selalu sudah menghakimi dirinya sendiri lebih kejam dari siapa pun. ' +
                    'Menambah dakwaan hanya memanggil pengacara batinnya keluar.',
                },
              ],
            },
            {
              id: 'gk1_d2',
              narasi:
                'Bu Ratna menyela dari dapur, membawa teh: "Kemarin malam Dimas kambuh lagi, Dok. Nebulizer ' +
                'sampai dua kali. Padahal bapaknya sudah kalau merokok di teras... katanya."',
              pilihan: [
                {
                  id: 'gk1_d2_a',
                  teks:
                    '"\'Katanya\' — nah. Pak, asap itu tidak butuh pintu: ia nempel di baju, di jok truk, ' +
                    'di kumis, namanya thirdhand smoke. Dimas menghirup Bapak, bukan cuma asap Bapak. ' +
                    'Mau bukti kecil? Cium kerah baju Bapak sekarang."',
                  gaya: 'empati',
                  respons:
                    'Pak Gunawan, setengah bercanda, mencium kerahnya sendiri — dan tidak tertawa. "...Bau ' +
                    'tembakau, Dok. Padahal ini baju bersih dari lemari." Ia memandang laci tempat inhaler ' +
                    'dan slopnya seranjang. "Jadi selama ini teras itu... bohongan."',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'tidak_merokok',
                    ambangTrust: 5,
                    responsBohong:
                      '"Saya sudah jarang kok, Dok. Paling dua-tiga batang, itu pun di luar rumah semua," ' +
                      'katanya lancar — sementara asbak penuh di bufet dan dua slop cadangan di laci berkata lain.',
                  },
                  catatanPedagogis:
                    'Eksperimen indrawi ("cium kerahmu") mengalahkan definisi thirdhand smoke mana pun. ' +
                    'Biarkan hidung pasien jadi penyuluhnya.',
                },
                {
                  id: 'gk1_d2_b',
                  teks:
                    '"Merokok di teras itu sudah langkah baik, Bu. Tinggal ditingkatkan: ganti baju dan ' +
                    'cuci tangan tiap habis merokok sebelum dekat-dekat Dimas."',
                  gaya: 'edukasi',
                  respons:
                    '"Wah, ribet juga ya," Pak Gunawan menyeruput teh, aman. Kamu baru saja menawarkan ' +
                    'prosedur tambahan untuk MEMPERTAHANKAN rokoknya — dan ia menerimanya dengan senang hati.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Harm reduction yang ditawarkan terlalu dini bisa jadi izin resmi meneruskan kebiasaan. ' +
                    'Untuk ayah dari anak asma, target percakapan pertama tetap: turunkan-berhenti, bukan "merokok yang rapi".',
                },
                {
                  id: 'gk1_d2_c',
                  teks:
                    '"Berarti selama ini bohong dong, Pak, katanya di teras. Pantas saja Dimas kambuh ' +
                    'terus — bapaknya sendiri tidak bisa dipegang omongannya."',
                  gaya: 'konfrontasi',
                  respons:
                    'Bu Ratna menunduk tidak enak; ia yang membocorkan, kamu yang menembakkan. Pak Gunawan ' +
                    'menatap istrinya, lalu kamu: "Rumah tangga saya bagian mana lagi, Dok, yang mau diperiksa?" ' +
                    'Teh di meja dingin bersama sisa kunjungan.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Memakai laporan istri sebagai peluru menghancurkan dua kepercayaan sekaligus: pasien padamu, ' +
                    'dan suami pada istrinya. Sumber informasi keluarga harus dilindungi, bukan dikorbankan.',
                },
              ],
            },
            {
              id: 'gk1_d3',
              narasi:
                'Dimas pulang mengaji, mencium tangan ayahnya, lalu — kebiasaan — mengipas-ngipas udara ' +
                'di depan hidungnya sambil lewat bufet. Gerakan kecil otomatis yang membuat ruangan hening ' +
                'sedetik. Pak Gunawan melihatnya. Kamu melihat Pak Gunawan.',
              pilihan: [
                {
                  id: 'gk1_d3_a',
                  teks:
                    '"Pak... anak itu tidak protes, tidak mengadu. Dia cuma sudah terbiasa. Kalau suatu hari ' +
                    'Bapak ingin berhenti — bukan karena saya, karena kipasan kecil tadi — Puskesmas punya ' +
                    'layanan berhenti merokok. Saya sendiri yang pegang. Kapan pun Bapak siap."',
                  gaya: 'empati',
                  respons:
                    'Pak Gunawan memandangi punggung Dimas yang masuk kamar. Lama. "...Kalau saya datang," ' +
                    'katanya akhirnya, pelan, "jangan bilang-bilang teman sopir dulu, Dok. Biar saya buktikan ' +
                    'dulu bisa apa nggak." Itu bukan "iya" — tapi itu pintu, dan ia yang membukanya.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Momen emosional + tawaran tanpa tekanan + jaminan harga diri ("jangan bilang teman sopir") = ' +
                    'resep memindahkan perokok dari prekontemplasi ke kontemplasi. Jangan tutup dengan ceramah; ' +
                    'tutup dengan pintu yang terbuka.',
                },
                {
                  id: 'gk1_d3_b',
                  teks:
                    '"Nah, Pak, lihat sendiri kan? Kasihan Dimas. Mulai besok dikurangi ya, dari dua pak ' +
                    'jadi satu pak dulu. Pelan-pelan pasti bisa."',
                  gaya: 'edukasi',
                  respons:
                    '"Siap, Dok, dikurangi," jawab Pak Gunawan gesit — kalimat yang sama yang ia berikan ke ' +
                    'dua dokter sebelumnya. Resep "pelan-pelan" tanpa rencana dan tanpa alasan miliknya sendiri: ' +
                    'diterima sopan, diarsipkan bersama yang lain.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Target turun-dosis yang dipaksakan dokter (bukan dipilih pasien) hampir selalu jadi ' +
                    'kepatuhan lisan. Yang menggerakkan bukan angka "satu pak" — momen kipasan tadi.',
                },
                {
                  id: 'gk1_d3_c',
                  teks:
                    '(Memanggil Dimas) "Dimas, sini. Coba bilang ke Bapak: \'Pak, aku sesak kalau Bapak ' +
                    'ngerokok.\' Ayo, bilang."',
                  gaya: 'konfrontasi',
                  respons:
                    'Dimas menoleh ke ayahnya, ke ibunya, ke kamu — matanya berkaca kebingungan, tujuh tahun ' +
                    'dan dijadikan alat sidang untuk ayah sendiri. "Sudah, Dimas masuk kamar," potong Pak ' +
                    'Gunawan, suaranya rendah. Kunjungan itu selesai saat itu juga, meski kamu masih duduk.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Menjadikan anak senjata melawan orang tuanya adalah pelanggaran etika keluarga yang tak ' +
                    'termaafkan oleh trust berapa pun. Anak boleh jadi ALASAN perubahan — jangan pernah jadi alatnya.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'gk1_i1',
              nama: 'Kontrak Sopir: Berhenti Bertahap + Rute Aman',
              deskripsi:
                'Program berhenti merokok yang menghormati profesinya: pangkas dulu semua rokok "otomatis" ' +
                '(sisakan yang rute malam), ganti ritual tol dengan kopi + permen jahe + power nap terjadwal ' +
                'di rest area, konseling rutin di Puskesmas — rahasia dari teman sopir sampai ia sendiri ' +
                'yang mau cerita — dan laci inhaler dipisah rumah dari slop kretek.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Bulan pertama: dua pak jadi tujuh batang — "cuma yang tol, Dok". Bulan kedua, ia datang ke ' +
                'poli membawa oleh-oleh dari Solo dan kabar: rute malam pertamanya TANPA rokok sama sekali, ' +
                'ditemani termos kopi dari Bu Ratna. "Ternyata yang bikin melek itu takut mati, Dok. Bukan ' +
                'kreteknya." Nebulizer Dimas mulai lebih sering berdebu daripada dipakai.',
            },
            {
              id: 'gk1_i2',
              nama: 'Rumah Bebas Asap: Aturan & Stiker',
              deskripsi:
                'Sepakati aturan rumah bebas asap rokok: merokok hanya di luar pagar, stiker kawasan ' +
                'tanpa rokok di pintu, asbak disingkirkan dari dalam rumah.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Stiker tertempel, asbak pindah ke pos ronda — dan Pak Gunawan kini merokok dua pak di luar ' +
                'pagar sambil main HP, lalu masuk memeluk Dimas dengan kerah yang sama baunya. Aturan tempat ' +
                'tidak menyentuh jumlah; asap pindah alamat, adiksi tidak.',
            },
            {
              id: 'gk1_i3',
              nama: 'Edukasi Asma & Pencetus untuk Keluarga',
              deskripsi:
                'Sesi edukasi manajemen asma anak: kenali pencetus, teknik inhaler yang benar, kapan ' +
                'nebulisasi, kapan ke IGD.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Bu Ratna kini mahir teknik inhaler dan Dimas hafal pencetusnya — ia bahkan menyebut ' +
                '"asap rokok" sebagai nomor satu, sambil melirik ayahnya. Serangan tertangani lebih baik; ' +
                'penyebab utamanya masih menyala dua pak sehari di luar pagar.',
            },
          ],
          penutupBerhasil:
            'Di pagar, Pak Gunawan menyalamimu dengan genggaman sopir — keras dan lama. "Senin saya nyetir ' +
            'ke Solo, Dok. Kamis saya ke Puskesmas. Jangan kasih tahu siapa-siapa dulu." Di kulkas, gambar ' +
            'krayon itu masih tergantung; suatu hari nanti garis abu-abu dari mulut ayah itu akan digambar ulang.',
          penutupGagal:
            'Kamu pamit dan dari teras terdengar korek gas menyala — jeda tiga detik setelah pintu tertutup, ' +
            'sopan sekali. Di atas bufet, badut di nebulizer itu tetap tersenyum menghadap asbak, dua tetangga ' +
            'yang tidak pernah dipisahkan.',
          karma: {
            kasusId: 'asma_ringan',
            anggotaIndex: 2,
            jatuhTempoHari: 16,
            narasi:
              'Bu Ratna menggendong Dimas masuk poli subuh-subuh — bibirnya masih kebiruan samar meski sudah ' +
              'dinebul dua kali di rumah. Semalam Pak Gunawan pulang dari rute Solo, memeluk anaknya kangen ' +
              'dengan jaket yang sepuluh jam menemani dua pak kretek. "Serangannya yang paling lama, Dok," ' +
              'suara Bu Ratna pecah. "Bapaknya di parkiran, nggak berani masuk."',
          },
        },
      ],
      epilogBerhasil:
        'Enam bulan kemudian, di lembar pantau berhenti merokok Puskesmas, baris Pak Gunawan tercatat: ' +
        '"0 batang — 4 bulan". Ia kini membawa termos kopi legendaris itu ke mana-mana dan mengipas-ngipas ' +
        'sopir lain yang merokok di pangkalan — ditertawakan, tidak peduli. Gambar krayon di kulkas sudah ' +
        'diganti Dimas: tiga sosok yang sama, tanpa garis abu-abu, judulnya "BAPAK JUARA".',
      epilogGagal:
        'Nebulizer bergambar badut itu akhirnya pindah ke meja samping tempat tidur Dimas — pemakaiannya ' +
        'terlalu sering untuk bolak-balik ke bufet. Di poli, kartu Dimas menebal seperti kartu Rina di RW 6, ' +
        'dan setiap kali ditanya soal rokok, Pak Gunawan menjawab dengan senyum yang makin tipis: ' +
        '"dikurangi kok, Dok, pelan-pelan."',
    },
  },

  /* =========================================================================
   * KELUARGA LASTRI — RW 5 (sedang), cukup — HIPERTENSI LANSIA SENDIRI (kapabilitas)
   * ======================================================================= */
  {
    id: 'keluarga_lastri',
    namaKeluarga: 'Keluarga Mbah Lastri',
    rw: 5,
    jarakMenit: 22,
    ekonomi: 'cukup',
    anggota: [
      {
        nama: 'Mbah Lastri',
        usia: 71,
        jenisKelamin: 'P',
        peran: 'lansia',
        kondisi: ['hipertensi_esensial', 'mulai_pelupa'],
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
        'Mbah Lastri (71) tinggal sendirian sejak anak bungsunya ikut suami ke Batam. Obat darah tingginya ' +
        'tiga macam — dan di rumah sunyi itu, tiga macam obat adalah teka-teki harian yang makin sering kalah.',
      kunjungan: [
        {
          id: 'lastri_k1',
          judul: 'Rumah Sunyi Mbah Lastri',
          pembuka:
            'Pintu dibuka lama setelah salam ketiga. "Eh, Dokter! Masuk-masuk. Maaf, simbah kira tukang ' +
            'tabung gas." Rumah joglo tua itu bersih dan sangat sunyi; sebuah TV menyala tanpa ditonton, ' +
            '"biar ada suaranya, Dok."',
          target: ['hipertensi_berobat'],
          hambatanSebenarnya: 'kapabilitas',
          petunjukHambatan:
            'Mbah Lastri PATUH — ia ingin minum obat, rutin ke Posyandu Lansia, tak pernah menolak nasihat. ' +
            'Masalahnya: tiga jenis obat dengan jadwal berbeda + ingatan yang mulai berkabut + tak ada ' +
            'seorang pun di rumah untuk mengingatkan. Kadang lupa total, kadang dobel dosis karena lupa ' +
            'sudah minum. Ini soal daya ingat & sistem pengingat, bukan kemauan, keyakinan, atau akses.',
          hotspot: [
            {
              id: 'lk1_h1',
              label: 'Tiga strip obat tercampur di toples',
              narasi:
                'Toples bekas permen berisi amlodipine, kaptopril, dan HCT tercampur — sebagian sudah lepas ' +
                'dari stripnya, telanjang tak bernama. "Biar gampang ambilnya, Dok, simbah jadikan satu."',
              indikator: 'hipertensi_berobat',
              x: 55,
              y: 40,
            },
            {
              id: 'lk1_h2',
              label: 'Kalender berhenti di dua bulan lalu',
              narasi:
                'Kalender dinding masih menunjukkan dua bulan yang lalu. Waktu di rumah ini diukur dengan ' +
                'azan dan sinetron, bukan tanggal — dan jadwal kontrol tertulis di tanggal yang tak pernah dibalik.',
              x: 25,
              y: 30,
            },
            {
              id: 'lk1_h3',
              label: 'Foto keluarga & kartu lebaran dari Batam',
              narasi:
                'Deretan foto: anak-cucu di Batam, kartu lebaran dua tahun lalu. "Video call tiap Jumat, Dok. ' +
                'Tapi sinyalnya suka hilang — kayak simbah, suka hilang juga ingatannya," ia terkekeh sendiri.',
              x: 75,
              y: 25,
            },
            {
              id: 'lk1_h4',
              label: 'Panci gosong di dapur',
              narasi:
                'Di rak cuci, panci dengan pantat gosong tebal. "Kemarin masak sayur, simbah tinggal nyapu ' +
                'halaman... lupa, Dok. Untung tetangga cium bau." Lupa yang mulai melewati batas aman.',
              x: 88,
              y: 65,
            },
          ],
          dialog: [
            {
              id: 'lk1_d1',
              narasi:
                '"Obatnya diminum kok, Dok, sungguh," Mbah Lastri menyodorkan toples campurnya dengan bangga. ' +
                '"Cuma kadang simbah bingung — yang bulat kecil ini tadi pagi sudah apa belum ya. Daripada ' +
                'kelewat, ya simbah minum saja lagi."',
              pilihan: [
                {
                  id: 'lk1_d1_a',
                  teks:
                    '"Simbah ini sebenarnya pasien paling rajin se-RW — buktinya toples ini selalu dibawa ' +
                    'ke mana-mana. Yang nakal itu bukan simbah, tapi obatnya: tiga rupa, jadwal beda-beda. ' +
                    'Bagaimana kalau kita bikin obatnya yang tunduk sama simbah — bukan simbah yang mengejar obat?"',
                  gaya: 'refleksi',
                  respons:
                    'Mbah Lastri tertawa sampai terbatuk. "Nah! Cocok. Obatnya yang kurang ajar, to." Ia ' +
                    'mendekatkan toplesnya. "Lha piye carane, Dok, biar obat ini nurut sama wong tuwek pikun?"' +
                    ' — Ia baru saja MEMINTA solusi; separuh pekerjaan selesai.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Reframing "pasien gagal" → "sistem obat yang tidak ramah lansia" menghapus rasa malu dan ' +
                    'membuka kolaborasi. Dobel dosis antihipertensi pada lansia = risiko jatuh & hipotensi — masalah sistem, bukan moral.',
                },
                {
                  id: 'lk1_d1_b',
                  teks:
                    '"Wah, itu bahaya, Mbah. Kalau dobel dosis, tensinya bisa anjlok, simbah bisa jatuh ' +
                    'pingsan. Obat itu tidak boleh diminum sembarangan, harus sesuai jadwal masing-masing."',
                  gaya: 'edukasi',
                  respons:
                    '"Oalah, bahaya to..." Mbah Lastri menjauhkan toplesnya, takut. Besok ia akan memilih ' +
                    'jalan paling aman menurut logikanya sendiri: kalau ragu sudah minum apa belum — ' +
                    'tidak usah minum sama sekali.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Peringatan bahaya tanpa sistem pengganti mendorong lansia ke arah "underdosing karena takut" — ' +
                    'sama berbahayanya dengan dobel dosis, tapi lebih senyap.',
                },
                {
                  id: 'lk1_d1_c',
                  teks:
                    '"Mbah, obat kok dicampur satu toples begini. Ini yang bikin kacau. Stripnya jangan ' +
                    'dilepas-lepas to, kan ada tulisannya."',
                  gaya: 'konfrontasi',
                  respons:
                    '"Tulisannya kecil, Dok. Mata simbah..." Ia mengelap toplesnya dengan ujung kebaya, ' +
                    'tersinggung halus. Sistem satu-satunya yang berhasil ia rakit sendiri barusan disebut kacau.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Toples campur itu justru USAHA adaptasi (huruf strip terlalu kecil untuk matanya). ' +
                    'Hargai logika di balik improvisasi pasien sebelum menggantinya.',
                },
              ],
            },
            {
              id: 'lk1_d2',
              narasi:
                'Kamu mengukur tensinya: 168/96. Mbah Lastri mengintip angkanya. "Piro, Dok? Wingi nang ' +
                'Posyandu katanya seratus enam puluhan juga. Padahal simbah minum terus lho... kayaknya."',
              pilihan: [
                {
                  id: 'lk1_d2_a',
                  teks:
                    '"Kata kuncinya \'kayaknya\' itu, Mbah. Begini — kita main detektif: seminggu ke depan, ' +
                    'tiap habis minum obat, simbah pindahkan satu biji kacang dari gelas kiri ke gelas kanan. ' +
                    'Minggu depan saya hitung kacangnya, ketahuan obatnya bolong berapa. Berani main?"',
                  gaya: 'empati',
                  respons:
                    '"Main kacang-kacangan?" Mbah Lastri terkekeh. "Kayak nyawer manten. Berani, Dok. Gelasnya ' +
                    'simbah pakai yang gambar ayam biar tidak lupa." Sistem pemantauan kepatuhan paling murah ' +
                    'sedunia baru saja disepakati dengan tawa.',
                  efekTrust: 2,
                  tepat: true,
                  ungkap: {
                    indikator: 'hipertensi_berobat',
                    ambangTrust: 4,
                    responsBohong:
                      '"Rutin, Dok, tidak pernah bolong! Simbah paling disiplin," katanya mantap — sambil ' +
                      'menyembunyikan toples berisi obat yang jumlahnya tidak cocok dengan tanggal penebusan itu ke belakang kendi.',
                  },
                  catatanPedagogis:
                    'Alat pantau kepatuhan tak harus digital: dua gelas dan kacang = pill count yang bisa ' +
                    'dijalankan lansia pikun sambil tertawa. Ukur dulu kebocoran, baru kalibrasi solusi.',
                },
                {
                  id: 'lk1_d2_b',
                  teks:
                    '"Tensi 168 itu masih tinggi, Mbah. Berarti minum obatnya belum konsisten. Mulai ' +
                    'besok harus lebih tertib ya — pagi kaptopril, siang amlodipine, jangan sampai tertukar."',
                  gaya: 'edukasi',
                  respons:
                    '"Pagi kaptopril... siang amlo..." Mbah Lastri mengulang serius, dan kamu bisa melihat ' +
                    'kedua nama itu bertukar tempat di udara bahkan sebelum kalimatnya selesai. Jadwal lisan ' +
                    'untuk ingatan yang berkabut: hilang sebelum magrib.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Instruksi verbal adalah media penyimpanan terburuk untuk lansia dengan gangguan memori. ' +
                    'Apa pun yang tidak berbentuk benda (kotak, gambar, kacang) akan menguap.',
                },
                {
                  id: 'lk1_d2_c',
                  teks:
                    '"Mbah, kalau begini terus bisa stroke lho. Anak di Batam itu harus dikabari — masa ' +
                    'ibunya sakit begini dibiarkan sendirian."',
                  gaya: 'konfrontasi',
                  respons:
                    'Wajah Mbah Lastri berubah. "Jangan, Dok. Jangan kabar-kabari Ratih — dia baru dapat ' +
                    'kerja di sana, nanti kepikiran." Ia menegakkan punggung. "Simbah masih kuat sendiri." ' +
                    'Pintu informasi ke keluarga barusan kamu bikin dijaga.',
                  efekTrust: -1,
                  tepat: false,
                  catatanPedagogis:
                    'Bagi lansia mandiri, "dilaporkan ke anak" terdengar seperti vonis tidak mampu. Libatkan ' +
                    'keluarga jauh PELAN-PELAN dan lewat persetujuannya — bukan sebagai ancaman.',
                },
              ],
            },
            {
              id: 'lk1_d3',
              narasi:
                'Azan asar. Mbah Lastri permisi sebentar, dan dari dalam terdengar ia bercakap — sendirian, ' +
                'ternyata pada foto di dinding: "Ada dokter, Pakne. Ganteng. Kayak kowe pas enom." Ia ' +
                'kembali membawa rambutan. "Tetangga yang kasih, Dok. Simbah dikasih terus sama orang-orang."',
              pilihan: [
                {
                  id: 'lk1_d3_a',
                  teks:
                    '"Tetangga-tetangga yang suka mengirim rambutan itu, Mbah — yang paling sering main ' +
                    'ke sini siapa? Saya kepingin kenalan. Rumah ini butuh satu orang lagi yang hafal ' +
                    'jadwal obat simbah, selain simbah sendiri."',
                  gaya: 'empati',
                  respons:
                    '"Yu Parti! Tiap sore lewat ambil jemuran, mesti mampir ngobrol." Mata Mbah Lastri hidup. ' +
                    '"Dia yang cium bau panci gosong itu. Kalau Yu Parti disuruh ngelingke obat... wah, dia ' +
                    'itu cerewetnya pol, Dok. Cocok." Sistem pendukung itu ternyata sudah lewat tiap sore.',
                  efekTrust: 2,
                  tepat: true,
                  catatanPedagogis:
                    'Lansia sendirian jarang benar-benar sendirian — petakan jejaring informalnya (tetangga, ' +
                    'jamaah, penjual sayur). Satu "Yu Parti yang cerewet" bernilai sama dengan satu caregiver formal.',
                },
                {
                  id: 'lk1_d3_b',
                  teks:
                    '"Simbah sebaiknya ikut program lansia di Puskesmas saja — ada pemeriksaan rutin, ' +
                    'senam, banyak temannya juga. Daripada di rumah sendirian begini."',
                  gaya: 'edukasi',
                  respons:
                    '"Posyandu Lansia simbah sudah ikut, Dok, tiap bulan." Benar — dan sisa dua puluh sembilan ' +
                    'hari lainnya rumah ini tetap sunyi, dengan tiga obat yang tetap tercampur di toples.',
                  efekTrust: 1,
                  tepat: false,
                  catatanPedagogis:
                    'Merujuk ke program bulanan untuk masalah HARIAN adalah salah takaran frekuensi. Kepatuhan ' +
                    'obat bocornya tiap hari; penambalnya juga harus hadir tiap hari.',
                },
                {
                  id: 'lk1_d3_c',
                  teks:
                    '"Mbah, ngomong sama foto itu tidak apa-apa, tapi kalau keseringan nanti jadi kebiasaan ' +
                    'yang kurang sehat. Mending TV-nya dipindah ke kamar biar ada hiburan."',
                  gaya: 'konfrontasi',
                  respons:
                    'Mbah Lastri memandang foto suaminya, lalu kamu. "Empat puluh tahun simbah masak buat ' +
                    'Pakne, Dok. Masa sekarang mau cerita saja tidak boleh." Suaranya tetap halus; jaraknya ' +
                    'yang berubah.',
                  efekTrust: -2,
                  tepat: false,
                  catatanPedagogis:
                    'Bercakap dengan mendiang adalah koping duka yang SEHAT pada lansia — bukan gejala. ' +
                    'Mematologikan ritual cinta empat puluh tahun adalah cara tercepat jadi orang asing di rumah itu.',
                },
              ],
            },
          ],
          intervensi: [
            {
              id: 'lk1_i1',
              nama: 'Kotak Obat Bergambar + Alarm Yu Parti',
              deskripsi:
                'Rakit sistem ingat tiga lapis yang ramah mata & memori: kotak obat harian bersekat dengan ' +
                'GAMBAR (matahari terbit/tinggi/tenggelam) bukan tulisan, isi ulang tiap Jumat oleh kader, ' +
                'dan Yu Parti — tetangga yang tiap sore mampir — diangkat resmi jadi "alarm berjalan" ' +
                'plus dua gelas kacang untuk hitung kepatuhan.',
              cocokUntuk: ['kapabilitas'],
              hasilNarasi:
                'Minggu berikutnya gelas ayam itu berisi enam kacang dari tujuh hari — satu-satunya yang ' +
                'bolong hari Kamis, "pas Yu Parti nginep di anaknya". Tensi turun ke 152, lalu 144 di bulan ' +
                'berikutnya. Mbah Lastri kini menyebut kotak obatnya "warung srengenge" — warung matahari — ' +
                'dan pancinya tidak pernah gosong lagi karena Yu Parti sekalian mengecek kompor.',
            },
            {
              id: 'lk1_i2',
              nama: 'Motivasi: Sehat demi Cucu di Batam',
              deskripsi:
                'Kuatkan semangat berobat dengan menghubungkan kesehatan pada harapan bertemu cucu-cucu ' +
                'di Batam saat lebaran nanti.',
              cocokUntuk: ['motivasi'],
              hasilNarasi:
                'Semangatnya memang menyala — Mbah Lastri bahkan menempel foto cucunya di dekat toples obat. ' +
                'Tapi Selasa berikutnya ia tetap termangu memandangi toples itu: "iki mau isuk wis tak ombe ' +
                'opo durung yo..." Niat sudah penuh sejak lama; ingatannya yang bocor tak tertambal semangat.',
            },
            {
              id: 'lk1_i3',
              nama: 'Antar Obat Rutin oleh Kader',
              deskripsi:
                'Kader RW 5 mengantar obat hipertensi ke rumah tiap bulan supaya stok tak pernah putus.',
              cocokUntuk: ['kesempatan'],
              hasilNarasi:
                'Stok kini datang sendiri tiap awal bulan, rapi. Dan di akhir bulan kader menemukan ' +
                'kejanggalan yang sama: sisa obat tidak pernah cocok dengan hitungan hari — kadang lebih, ' +
                'kadang kurang. Obatnya sampai; jadwal di kepala yang tidak pernah sampai.',
            },
          ],
          penutupBerhasil:
            'Kamu pamit saat Yu Parti kebetulan lewat ambil jemuran — dan langsung direkrut di tempat, ' +
            'disaksikan rambutan dan dua gelas kacang. "Tugas negara iki," kata Yu Parti serius. Mbah Lastri ' +
            'terkekeh: "Wis, rumah iki ora sepi maneh, Pakne" — kalimat terakhirnya diucapkan ke arah foto.',
          penutupGagal:
            'TV itu masih menyala untuk tidak ditonton saat kamu pamit. Di meja, toples campur itu menunggu ' +
            'teka-teki berikutnya: sudah minum atau belum, dobel atau bolong — pertanyaan harian yang ' +
            'dijawab sendirian oleh ingatan yang makin sering kalah.',
          karma: {
            kasusId: 'mm_hipertensi_urgensi',
            anggotaIndex: 0,
            jatuhTempoHari: 44,
            narasi:
              'Yu Parti yang mengantarnya dengan becak motor tetangga: Mbah Lastri pagi ini ditemukan duduk ' +
              'di lantai dapur, dunia berputar, tengkuk kaku, bicara mulai pelo di ujung-ujung kata. Tensi ' +
              'di poli: 208/118. Di tasnya, toples obat campur itu ikut dibawa — penuh, nyaris tak berkurang. ' +
              '"Dua minggu ini dia bilang wis waras, Dok," kata Yu Parti, "jadi obatnya diliburkan."',
          },
        },
      ],
      epilogBerhasil:
        'Saat lebaran, video call Jumat itu akhirnya berwujud: Ratih dan anak-anaknya pulang dari Batam. ' +
        'Yang mereka temukan bukan ibu renta yang dikhawatirkan, tapi Mbah Lastri yang memamerkan "warung ' +
        'srengenge"-nya dan gelas kacang yang penuh. Ratih menangis di dapur — Yu Parti yang bercerita, ' +
        'sambil menyeduh teh di rumah yang tidak lagi sunyi.',
      epilogGagal:
        'Ratih akhirnya pulang dari Batam — dijemput kabar, bukan lebaran. Ia menemukan kalender yang ' +
        'berhenti, panci gosong yang baru, dan ibu yang kini bicara dengan foto lebih sering daripada ' +
        'dengan manusia. Rumah joglo itu dijual tahun berikutnya; Mbah Lastri ikut ke Batam, meninggalkan ' +
        'Yu Parti dan azan surau yang selama ini jadi jam dindingnya.',
    },
  },
]
