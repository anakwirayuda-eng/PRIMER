/**
 * KASUS IGD — LAB BATCH 1 (M13, konten ekspansi lab).
 *
 * Tujuh kasus kegawatdaruratan turn-based tambahan untuk kanal IGD. Semua kasus
 * di berkas ini bertanda `activationStatus: 'lab_prototype_unadjudicated'` —
 * konten prototipe yang BELUM diadjudikasi produksi, sehingga hanya aktif di
 * mode Karier. Mode Ujian tetap terkunci pada 5 kasus IGD baseline (`igd.ts`).
 *
 * Lantai EBM: PPK Dokter di FKTP (KMK 1186/2022); pedoman profesi/PNPK/WHO
 * dipakai bila lebih baru dan disebutkan eksplisit di `clue`.
 */

import type { KasusIgd } from './types'

export const KASUS_IGD_LAB_1: KasusIgd[] = [
  /* ====================================================================== */
  {
    id: 'igd_status_epileptikus',
    nama: 'Status Epileptikus',
    icd10: 'G41.9',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang pasien digotong masuk ke ruang tindakan dalam keadaan kejang seluruh tubuh, mulut berbuih. ' +
      '"Sudah dari rumah kejangnya, Dok, hampir sepuluh menit tidak berhenti-berhenti!" ' +
      'Kepalanya terus membentur brankar dan wajahnya membiru.',
    demografi: { usiaMin: 15, usiaMax: 45 },
    vitalAwal: { td: '145/90', nadi: 124, rr: 24, suhu: 37.1, spo2: 90 },
    stabilitasAwal: 46,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'saraf',
    clue:
      'Kejang berlanjut >5 menit atau berulang tanpa pemulihan kesadaran di antaranya = status epileptikus (definisi operasional ILAE): mekanisme penghentian kejang gagal, dan tiap menit tambahan mempersulit penghentian serta merusak neuron. Urutan benar: amankan pasien (miringkan, lindungi kepala, JANGAN masukkan apa pun ke mulut — mitos "ganjal lidah" mematahkan gigi dan menyumbat napas), bebaskan jalan napas + oksigen, pasang akses IV dan monitor; benzodiazepin adalah LINI PERTAMA (diazepam IV lambat atau rektal, atau midazolam bukal/IM sesuai ketersediaan), boleh diulang satu kali; fenitoin/antiepileptik lini kedua menyusul, bukan mendahului. Periksa gula darah kapiler pada SETIAP pasien kejang — hipoglikemia adalah penyebab reversibel yang paling sering terlewat. Bila kejang menetap setelah dosis benzodiazepin adekuat, rujuk emergensi ke fasilitas dengan layanan saraf sambil jalan napas dan oksigenasi dipertahankan (PPK Dokter di FKTP KMK 1186/2022; konsensus PERDOSSI tentang status epileptikus; prinsip PPGD).',
    langkah: [
      {
        id: 'se_1',
        narasi:
          'Pasien kejang tonik-klonik aktif, SpO2 90%, air liur menggenang di mulut. Langkah pertama?',
        pilihan: [
          {
            id: 'a',
            label: 'Miringkan pasien ke posisi pemulihan, lindungi kepala, bebaskan jalan napas, beri oksigen',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Airway selalu didahulukan: posisi miring mencegah aspirasi air liur, dan oksigen mengoreksi hipoksemia yang timbul dari kejang itu sendiri.',
          },
          {
            id: 'b',
            label: 'Tahan kedua lengan pasien dan ganjal mulutnya dengan gagang sendok agar lidah tidak tergigit',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Berbahaya. Lidah tidak bisa "tertelan"; mengganjal mulut mematahkan gigi dan menyumbat jalan napas, sementara menahan gerakan berisiko cedera dan patah tulang.',
          },
          {
            id: 'c',
            label: 'Hitung durasi kejang dan tunggu sepuluh menit lagi — sebagian besar kejang berhenti sendiri',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Jendela itu sudah lewat. Kejang yang berlangsung lebih dari lima menit tidak lagi diperlakukan sebagai kejang biasa dan makin lama makin resisten terhadap obat.',
          },
          {
            id: 'd',
            label: 'Pasang jalur IV dan suntikkan diazepam lebih dulu, jalan napas dan oksigen menyusul kemudian',
            benar: false,
            efekStabilitas: -14,
            respons:
              'Obatnya benar, urutannya terbalik. Benzodiazepin memang lini pertama, tetapi ia menekan napas — memberikannya sebelum jalan napas diamankan justru memperdalam hipoksemia.',
          },
        ],
      },
      {
        id: 'se_2',
        narasi:
          'Jalan napas aman, oksigen terpasang, SpO2 naik ke 95%. Kejang kini menit ke-8 dan belum berhenti.',
        pilihan: [
          {
            id: 'a',
            label: 'Berikan benzodiazepin lini pertama (diazepam IV lambat, atau rektal bila jalur IV gagal)',
            benar: true,
            efekStabilitas: 24,
            respons:
              'Tepat. Benzodiazepin adalah lini pertama status epileptikus; bila akses IV sulit, rute rektal atau bukal tidak kalah sah dan jauh lebih baik daripada menunda.',
          },
          {
            id: 'b',
            label: 'Mulai dengan fenitoin IV loading sebagai obat pertama, benzodiazepin disimpan bila gagal',
            benar: false,
            efekStabilitas: -18,
            respons:
              'Terbalik. Fenitoin adalah lini kedua dan butuh waktu pemberian yang lambat; ia melengkapi benzodiazepin, bukan menggantikan perannya sebagai penghenti kejang cepat.',
          },
          {
            id: 'c',
            label: 'Tunda benzodiazepin karena takut depresi napas; cukup pertahankan oksigen dan observasi',
            benar: false,
            efekStabilitas: -24,
            respons:
              'Ketakutan yang salah sasaran. Risiko depresi napas jauh lebih kecil daripada risiko kejang berkepanjangan, dan jalan napas Anda sudah aman serta terpantau.',
          },
          {
            id: 'd',
            label: 'Panggil ambulans dan berangkatkan sekarang tanpa memberi antikonvulsan apa pun',
            benar: false,
            efekStabilitas: -26,
            respons:
              'Rujukan tanpa terapi hanya memindahkan kerusakan ke dalam ambulans. Kejang harus dilawan sejak menit ini; rujukan berjalan paralel, bukan menggantikan obat.',
          },
        ],
      },
      {
        id: 'se_3',
        narasi:
          'Setelah dosis benzodiazepin kedua, kejang mereda sekitar 40 detik lalu kambuh lagi. Pasien sama sekali belum sadar di antara kejang.',
        pilihan: [
          {
            id: 'a',
            label: 'Periksa gula darah kapiler sekarang dan koreksi bila rendah, lalu aktifkan rujukan emergensi ke RS dengan layanan saraf',
            benar: true,
            efekStabilitas: 20,
            respons:
              'Tepat. Hipoglikemia adalah penyebab reversibel yang sering terlewat, dan kejang refrakter setelah benzodiazepin adekuat melampaui kapasitas FKTP — periksa, koreksi, rujuk.',
          },
          {
            id: 'b',
            label: 'Berikan dosis benzodiazepin ketiga dan keempat sampai kejang berhenti, tetap tangani di FKTP',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Menumpuk dosis tanpa menaikkan tingkat perawatan berbahaya. Setelah dua dosis adekuat gagal, yang dibutuhkan adalah lini kedua dan kesiapan jalan napas lanjut di RS.',
          },
          {
            id: 'c',
            label: 'Tunda rujukan sampai kejang benar-benar berhenti agar pasien aman dibawa di perjalanan',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Justru terbalik. Kejang yang belum berhenti adalah alasan untuk berangkat lebih cepat, bukan menunggu; terapi dan pemantauan tetap berjalan selama transfer.',
          },
          {
            id: 'd',
            label: 'Rujuk segera tanpa memeriksa gula darah karena kejangnya jelas berasal dari otak',
            benar: false,
            efekStabilitas: -15,
            respons:
              'Rujukannya benar, kelengkapannya tidak. Gula darah kapiler hanya butuh belasan detik dan dapat mengungkap penyebab yang bisa Anda sembuhkan di ruangan ini juga.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_cedera_kepala_sedang',
    nama: 'Cedera Kepala Sedang',
    // S06.9 (cedera intrakranial, tak dirinci) — BUKAN S06.0 (concussion/
    // commotio cerebri, lazimnya GCS 13-15). Vignette ini GCS 12 + muntah
    // berulang + amnesia = cedera kepala SEDANG yang jenis lesi intrakranialnya
    // justru belum diketahui (CT baru di RS rujukan), jadi kode "tak dirinci"
    // yang tepat, bukan kode diagnosis spesifik yang belum tegak di FKTP.
    icd10: 'S06.9',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang laki-laki dibopong masuk setelah motornya menabrak trotoar; ia tidak mengenakan helm. ' +
      '"Tadi sempat pingsan sebentar, Dok, terus muntah dua kali di jalan." ' +
      'Ia membuka mata saat dipanggil keras, bicaranya kacau, dan sama sekali tidak ingat kejadiannya.',
    demografi: { usiaMin: 18, usiaMax: 50, jenisKelamin: 'L' },
    vitalAwal: { td: '138/82', nadi: 78, rr: 18, suhu: 36.7, spo2: 96 },
    stabilitasAwal: 50,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'bedah',
    clue:
      'Cedera kepala sedang (GCS 9-13) dengan kehilangan kesadaran, muntah berulang, dan amnesia = risiko tinggi lesi intrakranial yang membesar diam-diam. Cedera primer sudah terjadi dan tak dapat diubah; tugas FKTP adalah mencegah cedera SEKUNDER — hipoksia dan hipotensi adalah dua pembunuh yang masih bisa Anda cegah. Urutan benar: imobilisasi servikal (semua cedera kepala berenergi tinggi dianggap cedera servikal sampai terbukti tidak), buka jalan napas dengan jaw thrust — BUKAN head tilt, oksigenasi, jaga tekanan darah, lalu nilai pupil dan tanda lateralisasi serta catat GCS berkala. Hiperventilasi TIDAK dilakukan rutin: ia menyempitkan pembuluh otak dan justru menambah iskemia. Hindari sedasi yang menutupi penurunan GCS. Diagnosis definitif memerlukan CT kepala yang tidak tersedia di FKTP, dan foto polos kepala tidak menyingkirkan perdarahan intrakranial — GCS yang turun disertai muntah berulang adalah indikasi rujuk emergensi, bukan indikasi observasi (PPK Dokter di FKTP KMK 1186/2022; prinsip ATLS/PPGD).',
    langkah: [
      {
        id: 'ck_1',
        narasi:
          'Pasien mengorok pelan, GCS 12, leher belum diamankan. Langkah pertama di brankar?',
        pilihan: [
          {
            id: 'a',
            label: 'Imobilisasi servikal manual, buka jalan napas dengan jaw thrust, beri oksigen, pasang collar',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Setiap cedera kepala berenergi tinggi dianggap cedera servikal sampai terbukti tidak, dan jaw thrust membuka jalan napas tanpa menggerakkan leher.',
          },
          {
            id: 'b',
            label: 'Tengadahkan kepala dengan head tilt-chin lift agar jalan napas cepat terbuka',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Berbahaya. Manuver ini mengekstensikan leher yang mungkin patah dan bisa mengubah cedera tulang menjadi cedera medula spinalis permanen.',
          },
          {
            id: 'c',
            label: 'Berikan manitol IV segera karena muntah dua kali berarti tekanan intrakranial sudah naik',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Refleks yang salah. Manitol bukan tindakan FKTP dan bukan pengganti ABC; tanpa tanda herniasi dan tanpa jalan napas yang aman, ia hanya menunda yang penting.',
          },
          {
            id: 'd',
            label: 'Telepon RS lebih dulu untuk menjadwalkan CT sebelum menilai jalan napas dan leher',
            benar: false,
            efekStabilitas: -16,
            respons:
              'Tujuannya benar, urutannya salah. CT memang yang dibutuhkan, tetapi pasien bisa kehilangan jalan napasnya sementara Anda menunggu operator RS mengangkat telepon.',
          },
        ],
      },
      {
        id: 'ck_2',
        narasi:
          'Collar terpasang, SpO2 98% dengan oksigen. Pasien muntah lagi dan makin mengantuk; GCS turun ke 11.',
        pilihan: [
          {
            id: 'a',
            label: 'Log roll bersama papan agar tidak aspirasi, nilai pupil dan tanda lateralisasi, jaga oksigenasi dan tekanan darah, catat GCS berkala',
            benar: true,
            efekStabilitas: 20,
            respons:
              'Tepat. Log roll melindungi jalan napas tanpa memelintir tulang belakang, dan GCS serial adalah monitor tekanan intrakranial termurah yang Anda punya.',
          },
          {
            id: 'b',
            label: 'Hiperventilasi rutin dengan balon-sungkup untuk menurunkan tekanan intrakranial',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Kebiasaan lama yang sudah ditinggalkan. Hiperventilasi menyempitkan pembuluh darah otak dan menambah iskemia; ia hanya darurat sementara pada herniasi yang nyata.',
          },
          {
            id: 'c',
            label: 'Berikan diazepam agar pasien tenang dan tidak gelisah selama diperiksa',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Dua bahaya sekaligus. Sedasi menekan napas dan mengaburkan GCS — satu-satunya tanda yang memberi tahu Anda bahwa hematoma sedang membesar.',
          },
          {
            id: 'd',
            label: 'Ukur ulang tanda vital tiap 15 menit dan tunda pemeriksaan pupil sampai pasien lebih tenang',
            benar: false,
            efekStabilitas: -15,
            respons:
              'Pemantauannya benar, prioritasnya meleset. Pupil anisokor adalah temuan yang mengubah keputusan dalam hitungan detik dan tidak boleh menunggu kenyamanan pemeriksaan.',
          },
        ],
      },
      {
        id: 'ck_3',
        narasi:
          'Pupil kanan tampak lebih lebar dan lambat bereaksi. GCS 11. Keluarga bertanya apakah pasien bisa dirawat di sini saja karena tidak punya biaya ke kota.',
        pilihan: [
          {
            id: 'a',
            label: 'Aktifkan rujukan emergensi ke RS dengan CT dan layanan bedah, kirim SBAR + catatan GCS serial, transfer terpantau dengan oksigen dan collar',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Pupil anisokor pada GCS yang menurun adalah kegawatan bedah saraf; jelaskan pada keluarga bahwa penundaan di sini harganya jauh lebih mahal daripada perjalanannya.',
          },
          {
            id: 'b',
            label: 'Observasi 6 jam di FKTP dengan pemantauan GCS; rujuk hanya bila GCS turun di bawah 9',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Ini jebakan paling mematikan pada cedera kepala. Menunggu GCS jatuh ke 8 berarti menunggu herniasi — saat itu tiba, waktu tempuh ambulans tidak lagi cukup.',
          },
          {
            id: 'c',
            label: 'Buat foto polos kepala di FKTP dulu untuk mencari garis fraktur sebelum memutuskan rujuk',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Pemeriksaan yang tidak mengubah keputusan. Foto polos normal sama sekali tidak menyingkirkan perdarahan intrakranial; hanya CT yang bisa, dan CT ada di RS.',
          },
          {
            id: 'd',
            label: 'Rujuk sekarang, tetapi kirim pasien tanpa pendamping dan tanpa oksigen karena jaraknya dekat',
            benar: false,
            efekStabilitas: -16,
            respons:
              'Keputusannya benar, pelaksanaannya menggagalkannya. Jalan napas bisa hilang di menit mana pun; transfer pasien GCS 11 harus terpantau, beroksigen, dan didampingi.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_luka_bakar_luas',
    nama: 'Luka Bakar Luas',
    icd10: 'T31.2',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang pasien dipapah masuk sambil merintih, bajunya melekat pada kulit dada dan lengan yang melepuh lebar. ' +
      '"Tabung gasnya menyambar di dapur warung, Dok, pintunya sempat macet." ' +
      'Bau hangus menyeruak, dan setiap kali ia bicara suaranya terdengar makin serak.',
    demografi: { usiaMin: 20, usiaMax: 45 },
    vitalAwal: { td: '105/70', nadi: 118, rr: 24, suhu: 36.4, spo2: 95 },
    stabilitasAwal: 47,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'bedah',
    clue:
      'Luka bakar derajat II-III seluas ~25% permukaan tubuh: kulit yang hilang membuka kebocoran plasma masif (syok luka bakar muncul dalam jam pertama) dan pintu masuk infeksi, sementara panas yang tersimpan di jaringan terus memperdalam luka setelah apinya padam. Urutan benar: hentikan proses bakar (lepaskan pakaian yang masih panas, perhiasan, dan cincin sebelum bengkak), dinginkan dengan air MENGALIR bersuhu ruang sekitar 20 menit — BUKAN es, karena vasokonstriksi es memperdalam luka dan memicu hipotermia; nilai ABC, dan curigai cedera inhalasi bila terbakar di ruang tertutup dengan suara serak, bulu hidung hangus, atau jelaga di mulut — jalan napas adalah ancaman TERCEPAT dan edema laring dapat menutupnya dalam hitungan jam, jauh sebelum lukanya membunuh. Pasang dua jalur IV besar (boleh menembus kulit terbakar bila perlu) dan mulai kristaloid terhitung dengan formula Parkland, dihitung sejak JAM TERBAKAR, bukan sejak pasien tiba; titrasi terhadap produksi urin. Jangan mengoleskan odol, kecap, minyak, atau mentega — semuanya menahan panas, mengotori luka, dan menyulitkan penilaian derajat. Rujuk ke pusat luka bakar (PPK Dokter di FKTP KMK 1186/2022; prinsip Emergency Management of Severe Burns/ATLS).',
    langkah: [
      {
        id: 'lb_1',
        narasi:
          'Pasien kesakitan hebat, kain baju masih menempel dan terasa panas. Tindakan pertama?',
        pilihan: [
          {
            id: 'a',
            label: 'Hentikan proses bakar: lepas pakaian panas dan perhiasan, dinginkan dengan air mengalir suhu ruang, sambil menilai jalan napas dan memberi oksigen',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Panas yang tersimpan terus memperdalam luka setelah apinya padam, dan cincin harus lepas sebelum bengkak menjadikannya torniket.',
          },
          {
            id: 'b',
            label: 'Kompres luka dengan es batu dan rendam dalam air es agar nyerinya cepat reda',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Keliru. Es menyebabkan vasokonstriksi yang justru memperdalam zona cedera, dan pada luas 25% ia dengan cepat menjatuhkan pasien ke hipotermia.',
          },
          {
            id: 'c',
            label: 'Olesi luka dengan odol atau kecap sesuai kebiasaan warga, lalu bungkus rapat',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Berbahaya dan harus diluruskan. Bahan-bahan itu memerangkap panas, mengontaminasi luka, dan menutupi derajat luka sehingga penilaian di pusat rujukan jadi salah.',
          },
          {
            id: 'd',
            label: 'Langsung pasang infus dan hitung formula Parkland sebelum proses bakar dihentikan dan luka didinginkan',
            benar: false,
            efekStabilitas: -14,
            respons:
              'Cairannya benar, urutannya terbalik. Menghitung tetesan sementara kain panas masih membakar kulit berarti luka terus mendalam selama Anda memegang kalkulator.',
          },
        ],
      },
      {
        id: 'lb_2',
        narasi:
          'Proses bakar dihentikan dan luka didinginkan. Kini terlihat bulu hidung hangus dan jelaga di sekitar mulut; suaranya makin serak dan ia batuk berdahak kehitaman.',
        pilihan: [
          {
            id: 'a',
            label: 'Anggap ini cedera inhalasi: oksigen aliran tinggi, pantau jalan napas terus-menerus, dan percepat rujukan ke fasilitas yang mampu mengamankan jalan napas sebelum edema menutupnya',
            benar: true,
            efekStabilitas: 24,
            respons:
              'Tepat. Terbakar di ruang tertutup + suara serak + jelaga = cedera inhalasi sampai terbukti tidak, dan edema laring menutup jalan napas jauh lebih cepat daripada lukanya membunuh.',
          },
          {
            id: 'b',
            label: 'Tunda urusan jalan napas dan fokus merawat serta membalut luka karena luasnya paling mencolok',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Tertipu oleh yang terlihat. Luka seluas apa pun tidak membunuh dalam sejam; jalan napas yang tertutup edema membunuh dalam menit.',
          },
          {
            id: 'c',
            label: 'Berikan kortikosteroid IV dosis tinggi untuk mencegah edema jalan napas',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Tidak didukung bukti pada cedera inhalasi dan memberi rasa aman palsu. Yang menyelamatkan adalah jalan napas definitif di fasilitas yang tepat, bukan obat.',
          },
          {
            id: 'd',
            label: 'Nilai ulang suara napas tiap 30 menit di FKTP; amankan jalan napas hanya bila stridor sudah jelas terdengar',
            benar: false,
            efekStabilitas: -18,
            respons:
              'Pemantauannya masuk akal, ambangnya terlalu telat. Stridor berarti lumen sudah menyempit kritis — pada titik itu mengamankan jalan napas menjadi jauh lebih sulit.',
          },
        ],
      },
      {
        id: 'lb_3',
        narasi:
          'Oksigen terpasang dan rujukan sedang diaktifkan. Luas luka diperkirakan 25% permukaan tubuh, derajat II-III, berat badan sekitar 60 kg. Kejadian terbakar sekitar satu jam lalu.',
        pilihan: [
          {
            id: 'a',
            label: 'Pasang dua jalur IV besar, mulai kristaloid hangat terhitung dengan formula Parkland dihitung sejak jam terbakar, pantau produksi urin, lalu rujuk ke pusat luka bakar',
            benar: true,
            efekStabilitas: 20,
            respons:
              'Tepat. Parkland dihitung dari JAM TERBAKAR, bukan jam kedatangan — satu jam yang sudah lewat harus dikejar, dan urin adalah penuntun titrasi terbaik di lapangan.',
          },
          {
            id: 'b',
            label: 'Beri minum sebanyak-banyaknya dan tunggu sampai ada produksi urin sebelum memasang infus',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Terlalu lambat untuk kebocoran plasma sebesar ini. Pada 25% luas luka, cairan oral tidak akan mengejar kehilangan, dan ileus serta muntah membuatnya berisiko.',
          },
          {
            id: 'c',
            label: 'Guyur cairan secepat mungkin tanpa perhitungan sampai nadinya kembali normal',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Berlebihan juga mencederai. Resusitasi tanpa hitungan memicu edema paru dan sindrom kompartemen; Parkland ada justru untuk mencegah dua ekstrem itu.',
          },
          {
            id: 'd',
            label: 'Rujuk sekarang juga tanpa memasang jalur infus agar tidak membuang waktu di FKTP',
            benar: false,
            efekStabilitas: -16,
            respons:
              'Rujukannya benar, bekalnya tidak. Memasang dua jalur memakan menit, tetapi tanpa cairan berjalan pasien bisa tiba di pusat luka bakar sudah dalam syok.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_ketoasidosis_diabetik',
    nama: 'Ketoasidosis Diabetik',
    icd10: 'E10.1',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang pasien muda dibaringkan di brankar, napasnya cepat dan dalam seperti orang habis berlari, padahal ia hampir tak sadar. ' +
      '"Muntah terus dari kemarin, Dok, sudah dua hari tidak suntik insulin karena obatnya habis." ' +
      'Napasnya berbau manis-asam, bibirnya kering, dan matanya cekung.',
    demografi: { usiaMin: 15, usiaMax: 35 },
    vitalAwal: { td: '95/60', nadi: 124, rr: 32, suhu: 37.0, spo2: 98, gds: 480 },
    stabilitasAwal: 45,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'penyakit_dalam',
    clue:
      'Ketoasidosis diabetik = defisiensi insulin absolut → lipolisis → badan keton → asidosis metabolik, sementara glukosa yang sangat tinggi menyeret air keluar lewat ginjal (diuresis osmotik). Karena itu masalah PERTAMA pasien ini bukan gula darahnya, melainkan DEHIDRASI berat: napas Kussmaul dan bau keton hanyalah gejala. Urutan benar: nilai ABC, pasang dua jalur IV, dan mulai resusitasi NaCl 0,9% LEBIH DAHULU. Insulin diberikan setelah rehidrasi berjalan — insulin yang didahulukan menarik cairan kembali ke intrasel dan memperberat syok, sekaligus mendorong kalium masuk ke dalam sel sehingga kalium serum bisa jatuh mendadak dan memicu aritmia fatal; kalium wajib dipikirkan SEBELUM insulin, dan di FKTP yang tidak dapat memeriksa maupun memantau kalium, yang benar adalah rehidrasi + rujuk, bukan memulai insulin secara buta. Kalium tidak pernah diberikan bolus cepat. Bikarbonat TIDAK diberikan rutin — asidosis membaik sendiri begitu cairan dan insulin bekerja. Rujuk ke RS dengan penyakit dalam sambil cairan terus berjalan; jangan menahan pasien sampai gula darahnya "normal" (PPK Dokter di FKTP KMK 1186/2022; konsensus PERKENI tentang pengelolaan diabetes melitus dan krisis hiperglikemia; prinsip panduan krisis hiperglikemia ADA).',
    langkah: [
      {
        id: 'kad_1',
        narasi:
          'GDS 480 mg/dL, keton urin positif kuat, napas cepat dan dalam, pasien mengantuk berat. Tindakan pertama?',
        pilihan: [
          {
            id: 'a',
            label: 'Pasang dua jalur IV besar dan mulai resusitasi cairan NaCl 0,9%, sambil memantau kesadaran dan tanda vital',
            benar: true,
            efekStabilitas: 24,
            respons:
              'Tepat. Pasien ini kekurangan berliter-liter cairan akibat diuresis osmotik; rehidrasi sendiri sudah menurunkan gula darah dan memperbaiki perfusi sebelum insulin menyentuhnya.',
          },
          {
            id: 'b',
            label: 'Berikan insulin kerja cepat bolus IV segera karena gula darahnya 480 mg/dL',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Refleks yang membahayakan. Insulin sebelum rehidrasi menarik air ke dalam sel dan memperdalam syok, sekaligus menggeser kalium ke intrasel hingga berisiko aritmia fatal.',
          },
          {
            id: 'c',
            label: 'Berikan natrium bikarbonat IV karena napas Kussmaul menandakan asidosis yang berat',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Tidak rutin dan bukan tanpa harga. Bikarbonat memperberat hipokalemia dan asidosis susunan saraf pusat; asidosis KAD pulih sendiri setelah cairan dan insulin bekerja.',
          },
          {
            id: 'd',
            label: 'Pasang infus tetapi jalankan tetesan rumatan pelan sambil menunggu hasil elektrolit dari laboratorium luar',
            benar: false,
            efekStabilitas: -18,
            respons:
              'Aksesnya benar, lajunya tidak. Resusitasi cairan awal KAD tidak menunggu elektrolit; tetesan rumatan tidak akan mengejar defisit sebesar ini.',
          },
        ],
      },
      {
        id: 'kad_2',
        narasi:
          'Setelah satu liter NaCl 0,9%, nadi turun ke 110 dan kesadaran sedikit membaik. Perawat sudah menyiapkan spuit insulin dan bertanya, "Mulai insulinnya sekarang, Dok?"',
        pilihan: [
          {
            id: 'a',
            label: 'Pikirkan kalium dulu: tanpa kemampuan memeriksa dan memantau kalium di FKTP, insulin tidak dimulai — lanjutkan rehidrasi dan percepat rujukan',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Kalium serum pada KAD sering terlihat normal padahal simpanan tubuh sudah terkuras; memulai insulin tanpa pemantauan kalium adalah menembak dalam gelap.',
          },
          {
            id: 'b',
            label: 'Mulai insulin bolus IV dosis besar sekarang karena rehidrasi sudah berjalan',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Satu liter belum mengoreksi defisit berliter-liter, dan bolus besar menjatuhkan kalium serta osmolaritas terlalu cepat. Rehidrasi dulu, insulin di tempat yang bisa memantau.',
          },
          {
            id: 'c',
            label: 'Berikan kalium IV bolus cepat untuk berjaga-jaga sebelum insulin dimulai',
            benar: false,
            efekStabilitas: -26,
            respons:
              'Fatal. Kalium tidak pernah diberikan bolus — ia hanya boleh masuk sebagai drip terencana; bolus cepat menghentikan jantung dalam hitungan menit.',
          },
          {
            id: 'd',
            label: 'Tunda semua terapi lain dan ulangi pemeriksaan keton urin tiap 30 menit untuk menilai respons',
            benar: false,
            efekStabilitas: -18,
            respons:
              'Pemeriksaan yang tidak mengubah keputusan. Keton urin lambat berubah dan tidak menuntun terapi; yang menuntun adalah perfusi, kesadaran, dan cairan yang masuk.',
          },
        ],
      },
      {
        id: 'kad_3',
        narasi:
          'Napas cepat dalam sedikit berkurang, GDS ulang 430 mg/dL, pasien masih mengantuk. Ambulans sudah siap di depan.',
        pilihan: [
          {
            id: 'a',
            label: 'Rujuk emergensi ke RS dengan penyakit dalam, cairan terus berjalan, kirim catatan GDS/keton/jumlah cairan yang sudah masuk, pantau kesadaran selama transfer',
            benar: true,
            efekStabilitas: 20,
            respons:
              'Tepat. KAD butuh insulin drip dan pemantauan elektrolit berkala yang melampaui FKTP; catatan cairan Anda menentukan dosis yang aman di RS.',
          },
          {
            id: 'b',
            label: 'Tahan pasien di FKTP sampai GDS turun di bawah 200 mg/dL, baru dirujuk',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Salah sasaran. Yang membunuh pada KAD adalah asidosis, dehidrasi, dan kalium — bukan angka gula; menunggu angka itu turun berarti menunda tempat yang bisa mengoreksi semuanya.',
          },
          {
            id: 'c',
            label: 'Berikan bikarbonat sebelum berangkat agar asidosisnya tidak memburuk di perjalanan',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Tetap tidak rutin. Bikarbonat tidak mempercepat pemulihan KAD dan menambah risiko hipokalemia justru saat pasien tidak terpantau di ambulans.',
          },
          {
            id: 'd',
            label: 'Rujuk sekarang tetapi lepaskan infusnya agar selang tidak merepotkan di dalam ambulans',
            benar: false,
            efekStabilitas: -16,
            respons:
              'Rujukannya benar, keputusan teknisnya merugikan. Cairan adalah terapi utama pasien ini; menghentikannya selama transfer membuang semua yang sudah Anda capai.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_stroke_iskemik_window',
    nama: 'Stroke Iskemik dalam Jendela Terapi',
    icd10: 'I63.9',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang pasien lansia dituntun masuk, sudut mulutnya turun dan lengan kirinya tergantung lemas. ' +
      '"Tadi jam tujuh pas sarapan tiba-tiba sendoknya jatuh, Dok, terus bicaranya jadi pelo — saya lihat sendiri jamnya." ' +
      'Jam dinding ruang tindakan menunjuk pukul delapan lewat tiga puluh.',
    demografi: { usiaMin: 55, usiaMax: 75 },
    vitalAwal: { td: '178/98', nadi: 88, rr: 18, suhu: 36.8, spo2: 97 },
    stabilitasAwal: 52,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'saraf',
    clue:
      'Stroke iskemik akut: sumbatan arteri menciptakan inti infark yang sudah mati dan PENUMBRA di sekelilingnya — jaringan yang masih hidup namun kelaparan, dan hanya bisa diselamatkan bila aliran darah dipulihkan cepat. Waktu adalah otak: jutaan neuron hilang tiap menit, dan jendela reperfusi dihitung dari waktu onset yang dipastikan saksi, bukan dari waktu pasien tiba. Urutan benar: ABC dan oksigen bila hipoksemik, kunci jam onset, periksa GULA DARAH kapiler pada setiap defisit neurologis akut (hipoglikemia adalah peniru stroke yang sembuh total bila dikoreksi), lalu aktifkan rujukan segera ke fasilitas dengan CT dan layanan stroke. JANGAN menurunkan tekanan darah secara agresif di fase akut: hipertensi itu kompensatoris untuk memperfusi penumbra melalui pembuluh kolateral, dan menurunkannya — apalagi dengan nifedipin/kaptopril sublingual yang tak terkendali — memperluas infark. JANGAN memberi aspirin sebelum perdarahan disingkirkan dengan CT; stroke iskemik dan stroke perdarahan tak dapat dibedakan secara klinis. Neuroprotektor bukan terapi penyelamat dan tak boleh menunda keberangkatan. Jebakan terbesar adalah "diobati dulu darah tingginya, baru dirujuk" — itu membuang jendela terapi (PPK Dokter di FKTP KMK 1186/2022; panduan tata laksana stroke Kemenkes/PERDOSSI; rekomendasi AHA/ASA).',
    langkah: [
      {
        id: 'st_1',
        narasi:
          'Onset sekitar 90 menit lalu dan dipastikan saksi. Pasien sadar, bicara pelo, hemiparesis kiri, SpO2 97%. Langkah pertama?',
        pilihan: [
          {
            id: 'a',
            label: 'Bebaskan jalan napas dan beri oksigen bila hipoksemik, kunci jam onset dari saksi, dan segera periksa gula darah kapiler',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Jam onset menentukan kelayakan reperfusi di RS, dan gula darah kapiler menyingkirkan peniru stroke yang bisa Anda sembuhkan di sini dalam semenit.',
          },
          {
            id: 'b',
            label: 'Langsung berikan aspirin 320 mg kunyah karena gejalanya khas stroke iskemik',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Terlalu cepat. Stroke iskemik dan perdarahan tidak bisa dibedakan secara klinis; aspirin baru boleh setelah perdarahan disingkirkan CT, dan itu terjadi di RS.',
          },
          {
            id: 'c',
            label: 'Berikan neuroprotektor IV lebih dulu agar sel otak terlindungi selama perjalanan',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Kebiasaan yang menenangkan dokter, bukan pasien. Tidak ada neuroprotektor yang menggantikan reperfusi, dan menyiapkannya memakan menit dari jendela terapi.',
          },
          {
            id: 'd',
            label: 'Lewati pemeriksaan gula darah karena kelemahan sesisi jelas menunjuk ke otak, langsung susun surat rujukan',
            benar: false,
            efekStabilitas: -15,
            respons:
              'Rujukannya benar, satu langkah terlewat. Hipoglikemia bisa meniru hemiparesis dengan sempurna — dan pasien itu akan pulang dari RS dengan diagnosis yang seharusnya beres di FKTP.',
          },
        ],
      },
      {
        id: 'st_2',
        narasi:
          'Gula darah 132 mg/dL — normal. Tekanan darah diukur ulang: 182/100. Perawat menyodorkan kaptopril: "Dok, tensinya tinggi sekali, diturunkan dulu ya sebelum berangkat?"',
        pilihan: [
          {
            id: 'a',
            label: 'Tidak menurunkan tekanan darah di fase akut — hipertensi ini kompensatoris untuk memperfusi penumbra; lanjutkan persiapan rujukan',
            benar: true,
            efekStabilitas: 24,
            respons:
              'Tepat, dan ini melawan naluri. Tekanan tinggi itu sedang mendorong darah lewat kolateral ke jaringan yang masih bisa diselamatkan; menurunkannya memadamkan penumbra.',
          },
          {
            id: 'b',
            label: 'Beri kaptopril 25 mg sublingual sampai tekanan darah di bawah 140/90 sebelum pasien dirujuk',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Inilah jebakan klasik "obati dulu darah tingginya, baru dirujuk". Penurunan tekanan di fase akut memperluas infark, dan prosesnya membuang jendela terapi.',
          },
          {
            id: 'c',
            label: 'Beri nifedipin sublingual karena kerjanya paling cepat menurunkan tensi',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Paling berbahaya dari semuanya. Penurunan tekanan yang mendadak dan tak terkendali persis merupakan hal yang paling ditakuti pada otak yang sedang iskemik.',
          },
          {
            id: 'd',
            label: 'Tunda keberangkatan 30 menit untuk mengukur ulang tensi tiga kali dan memastikan angkanya benar',
            benar: false,
            efekStabilitas: -16,
            respons:
              'Ketelitian di tempat yang salah. Angka tensi tidak akan mengubah keputusan Anda, sedangkan 30 menit itu adalah jutaan neuron yang tak kembali.',
          },
        ],
      },
      {
        id: 'st_3',
        narasi:
          'Sudah 110 menit sejak onset. Ada dua pilihan: RS terdekat 10 menit tanpa CT, atau RS 25 menit yang punya CT dan layanan stroke.',
        pilihan: [
          {
            id: 'a',
            label: 'Rujuk ke RS dengan CT dan layanan stroke meski lebih jauh; kabari lebih dulu, kirim jam onset dan hasil pemeriksaan, transfer terpantau',
            benar: true,
            efekStabilitas: 20,
            respons:
              'Tepat. Yang menentukan bukan jarak melainkan kemampuan: hanya fasilitas dengan CT dan layanan stroke yang bisa mengubah nasib penumbra pasien ini.',
          },
          {
            id: 'b',
            label: 'Rujuk ke RS terdekat tanpa CT agar cepat sampai, nanti dirujuk lagi dari sana bila perlu',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Cepat sampai ke tempat yang tidak bisa menolong bukanlah kecepatan. Rujukan berantai justru memakan lebih banyak waktu daripada langsung menuju fasilitas yang tepat.',
          },
          {
            id: 'c',
            label: 'Tunggu hasil darah lengkap dan fungsi ginjal dari laboratorium sebelum pasien diberangkatkan',
            benar: false,
            efekStabilitas: -24,
            respons:
              'Pemeriksaan yang tidak mengubah keputusan di FKTP. Laboratorium yang diperlukan akan diulang di RS; menunggunya hanya memindahkan waktu dari penumbra ke arsip.',
          },
          {
            id: 'd',
            label: 'Berangkatkan pasien tanpa menyertakan keterangan jam onset karena keluarga bisa menjelaskan sendiri di RS',
            benar: false,
            efekStabilitas: -15,
            respons:
              'Tujuannya benar, informasinya hilang di jalan. Jam onset tertulis dari saksi adalah data yang menentukan kelayakan reperfusi; keluarga yang panik sering menggeser jamnya.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_perdarahan_pascasalin',
    nama: 'Perdarahan Pascasalin',
    icd10: 'O72.1',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang perempuan dilarikan masuk dari polindes, kain sarungnya merah pekat dan darah masih menetes membasahi brankar. ' +
      '"Baru melahirkan satu jam lalu di bidan desa, Dok, darahnya tidak mau berhenti!" ' +
      'Wajahnya pucat sekali, bibirnya keputihan, dan perutnya teraba lembek seperti kantong berisi air.',
    demografi: { usiaMin: 20, usiaMax: 40, jenisKelamin: 'P' },
    vitalAwal: { td: '85/55', nadi: 126, rr: 26, suhu: 36.5, spo2: 96 },
    stabilitasAwal: 44,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'obgyn',
    clue:
      'Perdarahan pascasalin ditelusuri dengan 4T: Tone (atonia uteri — penyebab TERSERING), Tissue (sisa plasenta), Trauma (robekan jalan lahir/ruptur uteri), dan Thrombin (gangguan pembekuan). Uterus yang teraba lembek setinggi pusat menunjuk langsung ke atonia: otot rahim gagal berkontraksi sehingga pembuluh di bekas implantasi plasenta tidak terjepit, dan seluruh curah jantung ibu mengalir keluar lewat lubang itu. Urutan benar dan simultan: panggil bantuan, MASASE fundus uteri sekarang juga, pasang dua jalur IV besar dengan kristaloid, dan berikan uterotonika (oksitosin) — semuanya bersamaan, bukan bergiliran. Bila uterus tetap lembek, lakukan KOMPRESI BIMANUAL dan pertahankan; tampon uterus atau kondom kateter dapat menjadi penyelamat sementara bila tersedia; asam traneksamat adalah tambahan, bukan pengganti kontraksi. Rujuk SAMBIL terus menekan dan cairan terus berjalan, dan kabari RS lebih dulu agar kamar bersalin siap saat tiba. Jebakan mematikan: menunggu plasenta lahir lengkap, menunggu hasil Hb/golongan darah, atau melepaskan kompresi demi memindahkan pasien — pada atonia, tangan yang berhenti menekan berarti darah kembali mengalir (PPK Dokter di FKTP KMK 1186/2022; rekomendasi WHO untuk pencegahan dan tata laksana perdarahan pascasalin; panduan POGI dan Buku Saku Pelayanan Kesehatan Ibu Kemenkes).',
    langkah: [
      {
        id: 'pps_1',
        narasi:
          'Uterus teraba lembek setinggi pusat, darah terus mengalir dari jalan lahir, TD 85/55, nadi 126. Tindakan pertama?',
        pilihan: [
          {
            id: 'a',
            label: 'Masase fundus uteri sekarang juga sambil memanggil bantuan, pasang dua jalur IV besar dengan kristaloid, dan berikan oksitosin',
            benar: true,
            efekStabilitas: 24,
            respons:
              'Tepat. Uterus lembek = atonia, penyebab tersering; masase dan uterotonika mengembalikan kontraksi yang menjepit pembuluh darah, dan cairan mengejar yang sudah hilang.',
          },
          {
            id: 'b',
            label: 'Ambil sampel darah untuk Hb dan golongan darah dulu; tindakan menyusul setelah hasilnya keluar',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Perdarahan tidak berhenti untuk menunggu laboratorium. Hb pada perdarahan akut belum turun sekalipun ibu sudah kehilangan banyak darah — angka itu justru menyesatkan.',
          },
          {
            id: 'c',
            label: 'Tunggu sampai sisa plasenta keluar sendiri sebelum memberi uterotonika atau memasang infus',
            benar: false,
            efekStabilitas: -26,
            respons:
              'Menunggu pasif pada ibu yang sedang syok. Tissue memang salah satu dari 4T, tetapi ia dicari sambil Tone ditangani — bukan sebagai alasan menunda semuanya.',
          },
          {
            id: 'd',
            label: 'Berikan asam traneksamat IV lebih dulu dan nilai ulang 15 menit kemudian sebelum masase atau uterotonika',
            benar: false,
            efekStabilitas: -16,
            respons:
              'Obatnya memang punya tempat, tetapi bukan di urutan pertama. Traneksamat adalah tambahan; tanpa uterus yang berkontraksi, tidak ada bekuan yang bisa dipertahankannya.',
          },
        ],
      },
      {
        id: 'pps_2',
        narasi:
          'Setelah masase dan oksitosin, uterus sempat mengeras lalu melembek kembali. Darah masih mengalir deras dan TD turun ke 82/50.',
        pilihan: [
          {
            id: 'a',
            label: 'Lakukan kompresi bimanual uterus dan pertahankan, lanjutkan uterotonika sesuai protokol, guyur kristaloid, dan aktifkan rujukan sekarang',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Kompresi bimanual menggantikan kerja otot rahim yang gagal dan membeli waktu; rujukan diaktifkan sekarang, bukan setelah semua cara habis dicoba.',
          },
          {
            id: 'b',
            label: 'Lakukan pemeriksaan dalam menyeluruh dan jahit dulu robekan kecil di perineum sebelum tindakan lain',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Salah satu T mengalihkan Anda dari T yang benar. Robekan perineum kecil tidak menghasilkan perdarahan sederas ini; uterus yang lembek jelas menunjuk atonia.',
          },
          {
            id: 'c',
            label: 'Ulangi oksitosin dosis demi dosis sambil menunggu responsnya, tanpa kompresi dan tanpa mengaktifkan rujukan',
            benar: false,
            efekStabilitas: -26,
            respons:
              'Uterotonika yang gagal sekali cenderung gagal lagi. Yang dibutuhkan adalah tindakan mekanis segera dan jalur rujukan yang sudah berjalan, bukan pengulangan pasif.',
          },
          {
            id: 'd',
            label: 'Pasang kateter urin dan hitung produksi urin dulu untuk menilai derajat syoknya sebelum kompresi bimanual',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Pemantauan yang benar di saat yang salah. Kateter memang berguna nanti; menilai derajat syok saat sumber perdarahannya sudah jelas tidak mengubah satu pun tindakan Anda.',
          },
        ],
      },
      {
        id: 'pps_3',
        narasi:
          'Kompresi bimanual jelas mengurangi perdarahan, tetapi begitu tangan dilepas darah mengalir lagi. Ambulans siap; RS dengan obgyn berjarak 40 menit.',
        pilihan: [
          {
            id: 'a',
            label: 'Berangkat sekarang sambil kompresi (atau tampon/kondom kateter bila tersedia) terus dipertahankan, cairan berjalan, dan RS tujuan dikabari lebih dulu',
            benar: true,
            efekStabilitas: 20,
            respons:
              'Tepat. Pada atonia, rujukan dilakukan SAMBIL menekan — tangan penolong (atau tampon) adalah yang menahan hidup ibu sepanjang 40 menit itu.',
          },
          {
            id: 'b',
            label: 'Lepaskan kompresi agar pasien bisa dipindahkan ke brankar dengan nyaman, lalu berangkat',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Fatal. Detik tangan Anda lepas, darah mengalir kembali dengan deras yang sama; kompresi dipertahankan melewati pemindahan, sepanjang jalan, sampai serah terima.',
          },
          {
            id: 'c',
            label: 'Tunggu di FKTP sampai perdarahannya benar-benar berhenti agar aman dibawa di perjalanan',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Menunggu yang tidak akan datang. Atonia yang tak merespons uterotonika butuh tindakan definitif di RS; setiap menit menunggu adalah darah yang tak tergantikan di FKTP.',
          },
          {
            id: 'd',
            label: 'Berangkat sambil terus menekan, tetapi tanpa mengabari RS tujuan lebih dulu',
            benar: false,
            efekStabilitas: -14,
            respons:
              'Tindakannya benar, koordinasinya hilang. Tanpa kabar, tim kamar bersalin dan darah donor belum siap saat tiba — 40 menit yang Anda perjuangkan terbuang di pintu masuk.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_asfiksia_neonatorum',
    nama: 'Asfiksia Neonatorum',
    icd10: 'P21.0',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Bayi itu lahir ke tangan Anda tanpa suara sama sekali — tidak ada tangis yang biasanya memenuhi ruangan. ' +
      'Tubuhnya biru dan terkulai lemas seperti kain basah, kedua lengannya jatuh begitu saja saat dilepas. ' +
      'Ibunya masih terengah di meja, menunggu suara yang tak kunjung datang.',
    demografi: { usiaMin: 0, usiaMax: 0, usiaBulanMin: 0, usiaBulanMax: 0 },
    vitalAwal: { nadi: 72, rr: 0, suhu: 35.9, spo2: 55 },
    stabilitasAwal: 42,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'anak',
    clue:
      'Asfiksia neonatorum: paru bayi yang baru lahir masih terisi cairan, dan bila napas pertama gagal terjadi, paru tak pernah mengembang — hipoksia menekan laju jantung, dan lingkaran itu terus mengencang. Karena itu masalahnya hampir selalu VENTILASI, bukan jantung yang lemah dan bukan kekurangan obat. Urutan benar: langkah awal dalam 30 DETIK pertama — hangatkan (bayi basah kehilangan panas sangat cepat, dan hipotermia memperburuk asfiksia), atur posisi kepala setengah tengadah, bersihkan jalan napas HANYA bila perlu, keringkan, dan rangsang taktil. Nilai ulang: bila bayi tetap apnea atau megap-megap, atau laju jantung <100/menit, mulai VENTILASI TEKANAN POSITIF dengan balon-sungkup 40-60 kali per menit — inilah TINDAKAN PENENTU, dan yang paling sering keliru adalah sungkup yang bocor atau dada yang tidak mengembang. Nilai ulang laju jantung setelah 30 detik VTP efektif: kompresi dada baru ditambahkan (terkoordinasi 3:1, VTP TIDAK dihentikan) bila laju jantung <60/menit SETELAH ventilasi terbukti efektif; epinefrin datang jauh setelah itu. Suction dalam yang agresif justru memicu bradikardia vagal dan menunda ventilasi. Jebakan utama: langsung kompresi dada, langsung suction agresif, atau menunggu bayi menangis sendiri (PPK Dokter di FKTP KMK 1186/2022; Manajemen Asfiksia Bayi Baru Lahir Kemenkes; algoritma resusitasi neonatus IDAI/Perinasia yang mengadaptasi NRP).',
    langkah: [
      {
        id: 'an_1',
        narasi:
          'Bayi tidak menangis, tonus lemas, seluruh tubuh biru. Detik-detik pertama — apa yang Anda kerjakan?',
        pilihan: [
          {
            id: 'a',
            label: 'Langkah awal dalam 30 detik pertama: hangatkan di bawah pemancar panas, atur posisi kepala setengah tengadah, bersihkan jalan napas bila perlu, keringkan, rangsang taktil',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Sebagian besar bayi pulih hanya dengan blok 30 detik ini; menghangatkan bukan basa-basi — bayi basah kehilangan panas sangat cepat dan hipotermia memperberat asfiksia.',
          },
          {
            id: 'b',
            label: 'Langsung mulai kompresi dada karena bayi biru dan lemas',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Jebakan terbesar resusitasi neonatus. Jantung bayi ini melemah karena paru-parunya tak berisi udara; menekan dada tanpa ventilasi hanya memompa darah yang tak beroksigen.',
          },
          {
            id: 'c',
            label: 'Lakukan suction dalam dan agresif ke faring serta laring untuk memastikan jalan napas benar-benar bersih',
            benar: false,
            efekStabilitas: -24,
            respons:
              'Justru merugikan. Suction dalam memicu bradikardia melalui refleks vagal dan menunda ventilasi; ia hanya dilakukan bila ada sumbatan nyata.',
          },
          {
            id: 'd',
            label: 'Tunggu satu-dua menit sambil menaruh bayi di dada ibu — banyak bayi akhirnya menangis sendiri',
            benar: false,
            efekStabilitas: -26,
            respons:
              'Bayi ini apnea dan lemas, bukan sekadar lambat menangis. Menunggu semenit pada bayi yang tak bernapas berarti membiarkan lingkaran hipoksia-bradikardia mengencang.',
          },
        ],
      },
      {
        id: 'an_2',
        narasi:
          'Tiga puluh detik langkah awal selesai. Bayi tetap tidak bernapas — hanya megap-megap sesekali, tonus tetap lemas, laju jantung 70 kali per menit.',
        pilihan: [
          {
            id: 'a',
            label: 'Mulai ventilasi tekanan positif dengan balon-sungkup 40-60 kali per menit; pastikan sungkup rapat dan dada mengembang',
            benar: true,
            efekStabilitas: 25,
            respons:
              'Tepat — inilah tindakan penentu. Megap-megap disamakan dengan apnea, dan laju jantung <100 setelah langkah awal adalah indikasi VTP; bila dada tak mengembang, perbaiki sungkup dan posisi.',
          },
          {
            id: 'b',
            label: 'Mulai kompresi dada terkoordinasi 3:1 karena laju jantungnya sudah di bawah 100 kali per menit',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Ambangnya keliru. Kompresi baru ditambahkan bila laju jantung <60 SETELAH ventilasi terbukti efektif; pada 70 tanpa VTP sama sekali, yang kurang adalah udara, bukan tekanan.',
          },
          {
            id: 'c',
            label: 'Pasang jalur umbilikal dan berikan epinefrin sekarang untuk menaikkan laju jantung',
            benar: false,
            efekStabilitas: -26,
            respons:
              'Melompati seluruh algoritma. Epinefrin adalah langkah terakhir dan sia-sia pada paru yang belum mengembang; obat tidak pernah mendahului ventilasi pada bayi baru lahir.',
          },
          {
            id: 'd',
            label: 'Lanjutkan rangsang taktil lebih kuat — tepuk telapak kaki dan gosok punggung sampai bayi menangis',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Rangsang taktil sudah gagal sekali dan tidak diulang. Mengulangnya membuang 30 detik berikutnya pada bayi yang jelas membutuhkan udara masuk ke paru, bukan sentuhan.',
          },
        ],
      },
      {
        id: 'an_3',
        narasi:
          'VTP berjalan 30 detik dengan dada yang jelas mengembang tiap tiupan. Laju jantung dinilai ulang: 50 kali per menit.',
        pilihan: [
          {
            id: 'a',
            label: 'Lanjutkan VTP dan tambahkan kompresi dada terkoordinasi 3:1 dengan oksigen, nilai ulang tiap 60 detik, dan aktifkan rujukan ke RS dengan perawatan neonatus',
            benar: true,
            efekStabilitas: 20,
            respons:
              'Tepat. Inilah satu-satunya titik kompresi dibenarkan: laju jantung <60 meski ventilasi sudah terbukti efektif — dan VTP tetap berjalan, tidak digantikan.',
          },
          {
            id: 'b',
            label: 'Hentikan VTP dan beralih ke kompresi dada saja karena laju jantungnya tetap rendah',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Menghapus satu-satunya hal yang bekerja. Kompresi MELENGKAPI ventilasi, tak pernah menggantikannya; tanpa udara yang masuk, darah yang dipompa tetap tak beroksigen.',
          },
          {
            id: 'c',
            label: 'Hentikan VTP sejenak untuk memasang jalur umbilikal dan memberikan epinefrin lebih dulu',
            benar: false,
            efekStabilitas: -24,
            respons:
              'Urutannya melompat lagi. Epinefrin baru dipertimbangkan setelah VTP dan kompresi terkoordinasi berjalan; menjeda ventilasi demi memasang jalur adalah kemunduran nyata.',
          },
          {
            id: 'd',
            label: 'Bungkus bayi, serahkan ke ibu, dan berangkatkan rujukan sekarang tanpa melanjutkan resusitasi di perjalanan',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Rujukannya perlu, tetapi resusitasi tidak berhenti di pintu. VTP dan kompresi harus terus berjalan sepanjang transfer — bayi ini belum punya sirkulasi yang bisa menunggu.',
          },
        ],
      },
    ],
  },
]
