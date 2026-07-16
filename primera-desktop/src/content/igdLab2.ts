/**
 * KASUS IGD — BATCH LAB 2 (ekspansi kegawatdaruratan, belum diadjudikasi).
 *
 * Semua kasus di berkas ini ditandai `activationStatus:
 * 'lab_prototype_unadjudicated'` → hanya aktif di mode Karier; mode Ujian tetap
 * terkunci pada 5 kasus IGD baseline (`examBlueprint.ts` exactEvents: 5).
 *
 * Lantai EBM: PPK Dokter di FKTP (KMK 1186/2022). Bila PPK tidak memuat bab
 * yang bersangkutan, sumber yang dipakai disebutkan apa adanya di `clue`
 * masing-masing kasus (PNPK Kemenkes / WHO / pedoman profesi).
 */

import type { KasusIgd } from './types'

export const KASUS_IGD_LAB_2: KasusIgd[] = [
  /* ====================================================================== */
  {
    id: 'igd_tenggelam',
    nama: 'Tenggelam',
    icd10: 'T75.1',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Beberapa pemuda menggotong masuk tubuh basah kuyup yang baru saja diangkat dari sungai. ' +
      '"Kepeleset waktu mancing, Dok, nggak tahu berapa lama dia di dalam air!" ' +
      'Di brankar, dadanya nyaris tidak naik, bibirnya kelabu, dan kulitnya sedingin lantai.',
    demografi: { usiaMin: 10, usiaMax: 30 },
    vitalAwal: { td: '100/65', nadi: 54, rr: 6, suhu: 33.8, spo2: 80 },
    stabilitasAwal: 44,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'penyakit_dalam',
    clue:
      'Tenggelam membunuh lewat HIPOKSIA, bukan lewat air yang menggenangi paru: laringospasme dan aspirasi sedikit air sudah cukup merusak surfaktan, memicu kolaps alveolus dan pintasan intrapulmonal. Urutannya: buka jalan napas dan bersihkan sumbatan nyata → VENTILASI tekanan positif dengan oksigen sedini mungkin (pada tenggelam resusitasi dimulai dari napas, bukan dari kompresi) → sirkulasi → lepas pakaian basah, keringkan, dan hangatkan bertahap dengan penanganan yang lembut karena jantung hipotermik rentan fibrilasi ventrikel. JANGAN mencoba mengeluarkan air dari paru dengan hentakan perut, Heimlich rutin, atau posisi kepala di bawah: tidak ada air yang bisa dikeluarkan, dan manuver itu menunda ventilasi sekaligus memicu regurgitasi lalu aspirasi isi lambung. Antibiotik dan kortikosteroid tidak diberikan profilaktik. Disposisi: SEMUA korban yang sempat tidak sadar, apnea, atau membutuhkan bantuan napas WAJIB dirujuk untuk observasi walau tampak pulih sempurna — cedera paru dapat memburuk beberapa jam kemudian, dan foto toraks yang bersih pada jam-jam awal tidak menyingkirkannya. PPK Dokter di FKTP (KMK 1186/2022) tidak memuat bab tenggelam tersendiri; acuan yang dipakai adalah prinsip bantuan hidup dasar/PPGD Kemenkes serta pedoman resusitasi tenggelam ERC dan AHA, yang seragam menempatkan oksigenasi dan ventilasi di atas segalanya.',
    langkah: [
      {
        id: 'tgl_1',
        narasi:
          'Napasnya hanya sesekali dan dangkal, nadi teraba lemah dan lambat, SpO2 80 persen. ' +
          'Perawat sudah menyiapkan bag-valve-mask dan tabung oksigen di sisi kepala. Tindakan pertama?',
        pilihan: [
          {
            id: 'a',
            label:
              'Buka jalan napas, bersihkan mulut dari lumpur/muntahan yang terlihat, lalu mulai ventilasi tekanan positif bag-valve-mask dengan oksigen',
            benar: true,
            efekStabilitas: 24,
            respons:
              'Tepat. Pada tenggelam yang membunuh adalah hipoksia, bukan air di paru — ventilasi dan oksigenasi adalah terapi utamanya dan tidak boleh menunggu apa pun.',
          },
          {
            id: 'b',
            label: 'Lakukan manuver Heimlich/hentakan perut untuk mengeluarkan air dari parunya sebelum memberi napas',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Berbahaya. Air di paru tidak bisa didorong keluar; hentakan perut hanya menunda ventilasi dan memicu regurgitasi isi lambung yang justru teraspirasi.',
          },
          {
            id: 'c',
            label: 'Tengkurapkan pasien dengan kepala lebih rendah agar airnya mengalir keluar lebih dulu',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Refleks lama yang sudah ditinggalkan. Posisi kepala di bawah tidak mengosongkan paru, menunda ventilasi, dan menambah risiko aspirasi serta cedera bila ada trauma leher.',
          },
          {
            id: 'd',
            label: 'Lepas semua pakaian basah dan bungkus dengan selimut hangat lebih dulu karena suhunya 33,8 derajat',
            benar: false,
            efekStabilitas: -15,
            respons:
              'Penghangatan memang wajib, tetapi bukan sekarang. Hipotermia tidak membunuh dalam menit ini, henti napas iya — B mendahului penghangatan.',
          },
        ],
      },
      {
        id: 'tgl_2',
        narasi:
          'Ventilasi berjalan, SpO2 naik ke 92 persen dan pasien mulai bernapas sendiri walau lemah. ' +
          'Suhunya masih 33,8 derajat, pakaiannya masih basah kuyup, dan ia menggigil hebat. Langkah berikutnya?',
        pilihan: [
          {
            id: 'a',
            label:
              'Lepas pakaian basah, keringkan tubuh, selimuti dan hangatkan bertahap sambil menangani pasien dengan lembut, dengan oksigen dan pemantauan irama jantung tetap berjalan',
            benar: true,
            efekStabilitas: 20,
            respons:
              'Tepat. Kain basah terus membuang panas; penghangatan bertahap disertai penanganan yang lembut mencegah aritmia pada jantung yang hipotermik dan mudah tersinggung.',
          },
          {
            id: 'b',
            label: 'Gosok kuat kedua tungkai dan rendam ekstremitasnya dalam air panas supaya suhunya cepat naik',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Justru berbahaya. Menghangatkan ekstremitas lebih dulu mendorong darah dingin dari perifer kembali ke inti tubuh (afterdrop), dan manipulasi kasar dapat mencetuskan fibrilasi ventrikel.',
          },
          {
            id: 'c',
            label: 'Beri antibiotik dan kortikosteroid profilaksis sekarang karena air sungai kotor pasti menyebabkan radang paru',
            benar: false,
            efekStabilitas: -18,
            respons:
              'Keduanya tidak direkomendasikan rutin pada tenggelam. Antibiotik diberikan bila ada bukti infeksi, dan steroid tidak memperbaiki cedera paru — waktunya lebih berguna untuk penghangatan dan persiapan rujukan.',
          },
          {
            id: 'd',
            label: 'Biarkan pakaian basahnya, cukup selimuti di atasnya, dan fokus pada oksigen saja',
            benar: false,
            efekStabilitas: -15,
            respons:
              'Setengah benar tidak cukup di sini. Kain basah yang menempel di kulit terus menarik panas, dan selimut yang ditumpuk di atas pakaian basah nyaris tidak menghangatkan apa pun.',
          },
        ],
      },
      {
        id: 'tgl_3',
        narasi:
          'Tiga puluh menit kemudian pasien sadar penuh, bicaranya jelas, SpO2 96 persen dengan oksigen nasal, ' +
          'tetapi ia masih terbatuk-batuk. Keluarganya sudah berkemas: "Sudah sadar kok, Dok, pulang saja ya." Keputusan Anda?',
        pilihan: [
          {
            id: 'a',
            label: 'Rujuk untuk observasi di rumah sakit meski ia tampak pulih, karena sempat tidak sadar dan gagal napas',
            benar: true,
            efekStabilitas: 18,
            respons:
              'Tepat. Setiap korban tenggelam yang sempat tidak sadar atau membutuhkan bantuan napas berisiko cedera paru tertunda dalam hitungan jam; tampak baik sekarang bukan jaminan.',
          },
          {
            id: 'b',
            label: 'Pulangkan karena sudah sadar penuh dan saturasinya baik, pesan kembali bila sesak',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Inilah kesalahan paling mematikan pada tenggelam. Perburukan paru sering muncul beberapa jam setelah kejadian, saat pasien sudah jauh dari fasilitas kesehatan dan tanpa pengawasan siapa pun.',
          },
          {
            id: 'c',
            label: 'Observasi 30 menit lagi di ruang tindakan; bila saturasinya tetap 96 persen, pulangkan',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Jendela pengamatannya terlalu pendek. Batuk yang menetap justru menandakan parunya sudah terkena, dan FKTP tidak akan bisa menangani gagal napas yang datang beberapa jam kemudian di rumah.',
          },
          {
            id: 'd',
            label: 'Tunggu hasil foto toraks dulu; bila bersih, pasien boleh pulang',
            benar: false,
            efekStabilitas: -18,
            respons:
              'Foto toraks yang bersih pada jam-jam awal tidak menyingkirkan cedera paru tertunda, dan menunggunya hanya menunda transfer. Keputusan rujuk di sini lahir dari perjalanan klinis, bukan dari gambar.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_keracunan_organofosfat',
    nama: 'Keracunan Organofosfat',
    icd10: 'T60.0',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang petani dipapah masuk langsung dari sawah, bajunya basah kuyup bukan oleh air melainkan oleh pestisida dan keringatnya sendiri. ' +
      'Bau menyengat menyebar cepat memenuhi ruang tindakan. ' +
      'Air liurnya menetes tak terbendung dan napasnya berbunyi berkumur, seolah ia bernapas di dalam air.',
    demografi: { usiaMin: 20, usiaMax: 50 },
    vitalAwal: { td: '95/60', nadi: 48, rr: 30, suhu: 36.2, spo2: 85 },
    stabilitasAwal: 45,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'penyakit_dalam',
    clue:
      'Organofosfat menghambat asetilkolinesterase sehingga asetilkolin menumpuk di sinaps: muncul sindrom kolinergik muskarinik (SLUDGE/DUMBELS — salivasi, lakrimasi, urinasi, diare, kram perut, emesis, bronkorea, bronkospasme, bradikardia, pupil pinpoint) ditambah efek nikotinik (fasikulasi, kelemahan otot). Yang membunuh pada jam-jam pertama adalah BRONKOREA dan kelemahan otot napas, bukan bradikardianya. Urutan yang benar: lindungi penolong dengan sarung tangan dan apron → lepas seluruh pakaian terkontaminasi dan cuci kulit serta rambut dengan sabun dan air (selama racun masih menempel, penyerapan terus berjalan dan penolong pun bisa ikut keracunan) → jalan napas, penyedotan sekret, dan oksigen → ATROPIN dititrasi dengan dosis digandakan berulang sampai PARU KERING. Titik akhir atropinisasi adalah hilangnya sekret bronkus, BUKAN pupil yang melebar dan bukan pula angka nadi tertentu; dosis total yang dibutuhkan sering berkali-kali lipat dosis lazim sehari-hari, sehingga "sudah satu ampul, cukup" adalah kesalahan yang paling sering mematikan. Oksim (pralidoksim) dan penanganan sindrom perantara adalah ranah rumah sakit. Semua kasus dirujuk dengan atropin rumatan dan oksigen berjalan, disertai wadah atau nama pestisidanya, karena kelemahan otot napas dapat muncul beberapa jam sampai beberapa hari setelah gejala kolinergik mereda. PPK Dokter di FKTP (KMK 1186/2022) memuat bab Keracunan Makanan dan bab Syok, tetapi tidak memuat bab keracunan organofosfat tersendiri; acuan yang dipakai adalah prinsip toksikologi klinis dan panduan penanganan keracunan pestisida WHO.',
    langkah: [
      {
        id: 'ops_1',
        narasi:
          'Pupilnya sekecil ujung jarum, sekret berbusa terus keluar dari mulutnya, dan perutnya kram hebat. ' +
          'Perawat sudah mematahkan ampul atropin dan menunggu aba-aba, sementara cairan pestisida masih membasahi baju dan lengan pasien. Tindakan pertama?',
        pilihan: [
          {
            id: 'a',
            label:
              'Kenakan sarung tangan dan apron, lepas seluruh pakaian terkontaminasi, cuci kulit dan rambut pasien dengan sabun dan air mengalir, sambil oksigen dan penyedotan sekret berjalan',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Selama racun masih menempel di kulit ia terus terserap dan dosis atropin berapa pun akan selalu tertinggal; melindungi penolong lebih dulu mencegah tim ikut menjadi korban.',
          },
          {
            id: 'b',
            label: 'Suntikkan atropin sekarang juga; dekontaminasi menyusul nanti setelah pasien lebih tenang',
            benar: false,
            efekStabilitas: -15,
            respons:
              'Atropin memang wajib dan segera, tetapi menundanya dekontaminasi berarti penyerapan racun terus berjalan dan Anda akan terus mengejar sasaran yang bergerak. Keduanya dikerjakan berbarengan, bukan bergantian.',
          },
          {
            id: 'c',
            label: 'Segera mandikan pasien dengan air dan sabun; penolong bekerja dengan tangan telanjang saja supaya cepat',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Niatnya benar, caranya membahayakan tim. Organofosfat terserap lewat kulit penolong dan pernah membuat petugas ikut kolaps — tanpa sarung tangan dan apron, satu pasien bisa berubah menjadi beberapa korban.',
          },
          {
            id: 'd',
            label: 'Beri diazepam untuk kram perutnya, lalu tunggu hasil pemeriksaan kadar kolinesterase sebelum memutuskan',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Fatal. Ini diagnosis klinis dari sindrom kolinergik yang sudah terpampang di depan mata; kadar kolinesterase tidak tersedia cepat di FKTP, dan menunggunya berarti membiarkan pasien tenggelam dalam sekretnya sendiri.',
          },
        ],
      },
      {
        id: 'ops_2',
        narasi:
          'Dekontaminasi selesai dan oksigen terpasang, tetapi paru pasien masih penuh ronki basah dan sekretnya terus mengalir. ' +
          'Anda sudah memberikan satu ampul atropin dan nadinya naik sedikit. Perawat bertanya, "Sudah cukup, Dok?"',
        pilihan: [
          {
            id: 'a',
            label: 'Lanjutkan atropin dengan dosis digandakan berulang tiap beberapa menit sampai sekret paru kering dan napasnya lega',
            benar: true,
            efekStabilitas: 24,
            respons:
              'Tepat. Titik akhir atropinisasi adalah PARU YANG KERING — bukan pupil yang melebar, bukan pula angka nadi tertentu; dosis total yang dibutuhkan sering berkali-kali lipat dari kebiasaan sehari-hari.',
          },
          {
            id: 'b',
            label: 'Cukup satu ampul sesuai dosis lazim; nilai ulang satu jam lagi agar tidak terjadi keracunan atropin',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Inilah jebakan klasik yang mematikan. Pada keracunan organofosfat dosis lazim jauh dari cukup, dan pasien meninggal karena sekret paru yang tidak pernah dikeringkan, bukan karena kelebihan atropin.',
          },
          {
            id: 'c',
            label: 'Hentikan atropin karena pupilnya sudah mulai melebar — itu tanda dosisnya sudah tercapai',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Pupil adalah penanda yang menyesatkan, apalagi bila matanya ikut terpapar langsung. Pegangan Anda adalah suara paru dan sekretnya, bukan ukuran pupil.',
          },
          {
            id: 'd',
            label: 'Rujuk sekarang juga tanpa menambah atropin; biar dosis besarnya diberikan di rumah sakit saja',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Perjalanan rujukan justru saat yang paling rawan. Pasien dengan paru penuh sekret dapat henti napas di dalam ambulans; atropinisasi harus dicapai lebih dulu, lalu diteruskan selama transfer.',
          },
        ],
      },
      {
        id: 'ops_3',
        narasi:
          'Sekret paru sudah kering, SpO2 95 persen, nadi 92, dan pasien mulai membuka mata. ' +
          'Ambulans siap berangkat ke rumah sakit rujukan yang berjarak satu jam perjalanan. Langkah terakhir?',
        pilihan: [
          {
            id: 'a',
            label:
              'Rujuk dengan atropin rumatan dan oksigen tetap berjalan, sertakan wadah/nama pestisidanya, dan jelaskan risiko kelemahan otot napas yang bisa muncul kemudian',
            benar: true,
            efekStabilitas: 19,
            respons:
              'Tepat. Atropinisasi dipertahankan selama transfer, identitas racun menentukan terapi lanjutan seperti oksim, dan kelemahan otot napas dapat muncul beberapa jam sampai beberapa hari kemudian — itu harus terjadi di rumah sakit, bukan di rumah pasien.',
          },
          {
            id: 'b',
            label: 'Parunya sudah kering dan pasien sadar; pulangkan dengan pesan kontrol bila sesak lagi',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Berbahaya. Efek organofosfat berlangsung berhari-hari, dan sindrom perantara dapat melumpuhkan otot napas justru setelah gejala kolinergik mereda — persis saat pasien merasa dirinya sudah sembuh.',
          },
          {
            id: 'c',
            label: 'Hentikan atropin sebelum berangkat supaya tidak kelebihan dosis selama di perjalanan',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Menghentikan atropin membuat sekret kembali membanjiri paru justru saat pasien berada di ambulans dengan alat seadanya. Rumatan diteruskan dan dititrasi, bukan dihentikan karena khawatir.',
          },
          {
            id: 'd',
            label: 'Lakukan bilas lambung dan beri arang aktif dulu sebelum berangkat',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Paparannya lewat kulit — tidak ada isi lambung yang perlu dikeluarkan. Tindakan ini hanya menunda rujukan sambil menambah risiko aspirasi pada pasien yang kesadarannya belum penuh.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_gigitan_ular_berbisa',
    nama: 'Gigitan Ular Berbisa',
    icd10: 'T63.0',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang laki-laki dipapah masuk sambil memeluk betis kanannya yang membengkak sampai melewati lutut. ' +
      '"Digigit ular di sawah, Dok, sejam yang lalu — sudah saya ikat pakai karet biar bisanya nggak naik!" ' +
      'Ia gemetar hebat, dan dari sela giginya tampak gusi yang terus merembeskan darah.',
    demografi: { usiaMin: 15, usiaMax: 50 },
    vitalAwal: { td: '110/70', nadi: 112, rr: 24, suhu: 36.8, spo2: 98 },
    stabilitasAwal: 50,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'penyakit_dalam',
    clue:
      'Bisa ular Indonesia yang tersering (viperid seperti ular tanah dan ular bandotan) bersifat hemotoksik-sitotoksik: bengkak progresif, nekrosis lokal, dan koagulopati konsumtif sehingga gusi berdarah spontan; bisa elapid (kobra, welang) lebih neurotoksik. Bisa menyebar terutama lewat sistem limfe dan kontraksi otot memompanya masuk ke sirkulasi — karena itu IMOBILISASI anggota badan yang tergigit setinggi jantung dengan bidai serta MENENANGKAN pasien adalah tindakan pertama yang bermakna. Lepaskan torniket yang sudah terpasang (dengan akses IV dan kesiapan resusitasi), dan JANGAN pernah memasang yang baru, menginsisi, mengisap, mengompres es, atau menempelkan ramuan maupun "batu ular" — semuanya menambah nekrosis dan perdarahan tanpa mengurangi bisa sedikit pun. Bersihkan luka, tutup kasa steril, TANDAI batas bengkak dengan spidol beserta jamnya dan ukur lingkar tungkai berkala: itulah alat pemantau progresi termurah dan terbaik yang dimiliki FKTP. Hindari NSAID dan suntikan intramuskular selama koagulopati berlangsung — pakai parasetamol, dan tunda urusan tetanus sampai koagulasi terkoreksi. Antibisa hanya diindikasikan bila ada tanda envenomasi sistemik (perdarahan spontan, gangguan koagulasi, tanda neurotoksik) atau lokal yang progresif cepat, dan harus diberikan di fasilitas yang siap menangani anafilaksis terhadap antibisa itu sendiri; karena itu semua kasus envenomasi dirujuk dengan waktu gigitan tercatat. PPK Dokter di FKTP (KMK 1186/2022) tidak memuat bab gigitan ular berbisa tersendiri; acuan yang dipakai adalah pedoman penatalaksanaan gigitan ular berbisa Kemenkes dan panduan WHO untuk kawasan Asia Tenggara.',
    langkah: [
      {
        id: 'ular_1',
        narasi:
          'Karet gelang terlilit ketat di pahanya dan kaki di bawahnya pucat serta dingin. ' +
          'Bengkak sudah melewati lutut, dua bekas taring terlihat jelas di betis. Tindakan pertama?',
        pilihan: [
          {
            id: 'a',
            label:
              'Pasang akses IV dan siapkan penanganan syok, lepaskan karet pengikatnya, lalu imobilisasi tungkai dengan bidai setinggi jantung dan tenangkan pasien',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Torniket tidak menahan bisa tetapi mematikan jaringan di bawahnya; lepaskan dengan akses IV siap, lalu imobilisasi dan ketenangan menjadi obat pertama karena kontraksi otot memompa bisa masuk ke sirkulasi.',
          },
          {
            id: 'b',
            label: 'Biarkan karetnya terpasang — justru itu yang menahan bisa naik — dan tambah satu ikatan lagi di atas lutut',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Inilah mitos yang paling banyak berujung amputasi. Torniket tidak menahan bisa yang sudah menyebar lewat limfe dan darah, tetapi ia menghentikan aliran arteri sehingga tungkai mati perlahan.',
          },
          {
            id: 'c',
            label: 'Insisi luka gigitannya dan isap bisanya keluar, lalu kompres es untuk mengurangi bengkak',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Tiga kesalahan sekaligus. Insisi menambah perdarahan pada pasien yang koagulasinya sudah rusak, pengisapan tidak menarik bisa yang berarti, dan es memperparah nekrosis jaringan.',
          },
          {
            id: 'd',
            label: 'Berikan antibisa ular sekarang juga sebelum tindakan lain, karena gusinya sudah berdarah',
            benar: false,
            efekStabilitas: -15,
            respons:
              'Envenomasi sistemik memang indikasi antibisa, tetapi ia tidak dilepas begitu saja: torniket harus dilepas dan akses dipasang lebih dulu, dan antibisa hanya diberikan di fasilitas yang siap menangani anafilaksis. Urutannya yang keliru, bukan gagasannya.',
          },
        ],
      },
      {
        id: 'ular_2',
        narasi:
          'Torniket sudah dilepas, tungkai terbidai, dan pasien mulai tenang. ' +
          'Keluarga mengeluarkan sekantong ramuan dan sebutir "batu ular": "Ini ditempel di lukanya ya, Dok, biar bisanya tersedot." Bengkaknya tampak masih merambat naik.',
        pilihan: [
          {
            id: 'a',
            label:
              'Tolak dengan sopan, bersihkan luka dan tutup kasa steril, tandai batas bengkak dengan spidol beserta jamnya, lalu ukur lingkar tungkai berkala',
            benar: true,
            efekStabilitas: 20,
            respons:
              'Tepat. Batas bengkak yang bertanggal-jam dan lingkar tungkai berkala adalah alat pemantau termurah sekaligus terbaik yang Anda punya untuk menilai apakah envenomasi masih berjalan.',
          },
          {
            id: 'b',
            label: 'Izinkan saja ramuan dan batu ularnya ditempel supaya keluarga tenang; toh tidak ada ruginya',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Ada ruginya. Tempelan tradisional menutupi luka yang justru harus dinilai, menambah kontaminasi pada jaringan yang sudah rusak, dan yang terpenting menanamkan keyakinan bahwa rujukan tidak perlu.',
          },
          {
            id: 'c',
            label: 'Suntikkan kortikosteroid dan antihistamin dosis besar untuk menghentikan pembengkakannya',
            benar: false,
            efekStabilitas: -18,
            respons:
              'Bengkak di sini akibat kerusakan jaringan oleh bisa, bukan reaksi alergi — steroid tidak menghentikannya. Keduanya justru disiapkan untuk mengantisipasi reaksi terhadap antibisa nanti, bukan sebagai terapi bengkaknya.',
          },
          {
            id: 'd',
            label: 'Suruh keluarga kembali ke sawah menangkap ularnya dulu agar jenisnya bisa dipastikan',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Jangan pernah menyuruh orang kembali mencari ular — itu menciptakan korban kedua. Foto dari jarak aman boleh membantu, tetapi keputusan Anda ditegakkan dari sindrom klinisnya, bukan dari identifikasi ularnya.',
          },
        ],
      },
      {
        id: 'ular_3',
        narasi:
          'Dalam satu jam terakhir bengkaknya terus merambat melewati pertengahan paha, dan gusinya masih merembes darah. ' +
          'Pasien sadar penuh, tekanan darah 110/70, dan ia berkata sudah merasa enakan.',
        pilihan: [
          {
            id: 'a',
            label:
              'Rujuk segera ke rumah sakit yang punya antibisa dan mampu menangani anafilaksis, dengan tungkai tetap terbidai, akses IV terpasang, dan jam gigitan tercatat',
            benar: true,
            efekStabilitas: 19,
            respons:
              'Tepat. Bengkak yang progresif cepat disertai perdarahan gusi adalah envenomasi bermakna; antibisa harus diberikan di tempat yang siap menangani reaksi anafilaksis terhadap antibisa itu sendiri.',
          },
          {
            id: 'b',
            label: 'Pasien merasa enakan dan tekanan darahnya baik — pulangkan dengan antinyeri dan pesan kembali bila memburuk',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Perasaan enak itu menipu. Koagulopati berkembang berjam-jam dan perdarahan gusi sudah membuktikan bisa bekerja secara sistemik — ini bukan kasus rawat jalan.',
          },
          {
            id: 'c',
            label: 'Observasi saja di FKTP selama 24 jam sambil menunggu apakah bengkaknya berhenti sendiri',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Menunggu tanpa antibisa membiarkan kerusakan berlanjut, dan FKTP tidak menyimpan antibisa maupun kemampuan menangani perdarahan berat. Yang progresif dirujuk, bukan ditonton.',
          },
          {
            id: 'd',
            label: 'Beri antinyeri golongan NSAID dan suntik antitetanus intramuskular dosis penuh dulu sebelum berangkat',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Keduanya salah pada pasien yang koagulasinya terganggu: NSAID dan suntikan intramuskular sama-sama memicu perdarahan. Pakai parasetamol, dan tunda urusan tetanus sampai koagulasi terkoreksi.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_syok_sepsis',
    nama: 'Syok Sepsis',
    icd10: 'A41.9',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang perempuan lansia digotong menantunya, lunglai di kursi roda dan tidak lagi mengenali siapa pun. ' +
      '"Demam empat hari, Dok, katanya anyang-anyangan dan pinggangnya sakit — dari kemarin nggak mau makan dan pipisnya cuma sedikit sekali." ' +
      'Tangannya dingin dan lembap, padahal dahinya terasa membakar.',
    demografi: { usiaMin: 45, usiaMax: 75 },
    vitalAwal: { td: '82/50', nadi: 124, rr: 28, suhu: 39.1, spo2: 92 },
    stabilitasAwal: 46,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'penyakit_dalam',
    clue:
      'Sepsis adalah disfungsi organ akibat respons tubuh yang disregulasi terhadap infeksi; ia menjadi syok septik ketika hipotensi menetap meski resusitasi cairan sudah dimulai. Kuncinya: di FKTP diagnosisnya KLINIS — sumber infeksi yang jelas (di sini saluran kemih) ditambah hipotensi, akral dingin dengan pengisian kapiler melambat, kesadaran menurun, takipnea, dan urin berkurang sudah cukup untuk bertindak; jangan menunggu laktat, kultur, atau leukosit yang memang tidak tersedia di sini. Bundel yang realistis dikerjakan FKTP: oksigen, dua akses IV besar, BOLUS KRISTALOID (PNPK Tata Laksana Sepsis Kemenkes 2017: fluid challenge NaCl 0,9% atau Ringer Laktat 1000 mL dalam 30 menit, diulang sesuai respons — nadi, tekanan darah, dan produksi urin — sambil mewaspadai edema paru), DOSIS PERTAMA antibiotik empiris spektrum luas secara INTRAVENA sedini mungkin, lalu RUJUK dengan cairan dan pemantauan tetap berjalan. Tiap jam penundaan antibiotik pada syok septik berbanding lurus dengan kematian; kultur diambil hanya bila tidak menunda antibiotik, dan di FKTP yang memang tidak punya kultur, ketiadaannya tidak boleh sekali pun menjadi alasan menunda. Antibiotik oral tidak dapat diandalkan pada pasien syok karena perfusi ususnya buruk. Vasopresor, kortikosteroid, dan kontrol sumber infeksi secara bedah adalah ranah rumah sakit — munculnya kebutuhan itu justru penanda rujukan segera, bukan pekerjaan FKTP. PNPK Tata Laksana Sepsis (Kemenkes, 2017) ditulis dari perspektif rumah sakit/ICU dan tidak memuat algoritma FKTP tersendiri; PPK Dokter di FKTP (KMK 1186/2022) memuat bab Syok, termasuk syok septik, dengan pesan yang sama: kenali, stabilkan, rujuk.',
    langkah: [
      {
        id: 'sep_1',
        narasi:
          'Kesadarannya menurun, akral dingin dengan pengisian kapiler lebih dari empat detik, tekanan darah 82/50. ' +
          'Di FKTP ini tidak ada pemeriksaan laktat maupun kultur darah. Tindakan pertama?',
        pilihan: [
          {
            id: 'a',
            label:
              'Tegakkan syok secara klinis, beri oksigen, pasang dua akses IV besar, dan mulai bolus kristaloid sambil dinilai ulang berkala',
            benar: true,
            efekStabilitas: 23,
            respons:
              'Tepat. Syok septik adalah diagnosis klinis di sisi tempat tidur — akral dingin, kesadaran turun, dan urin sedikit sudah cukup; resusitasi cairan tidak menunggu angka apa pun.',
          },
          {
            id: 'b',
            label: 'Tunda tindakan sampai pasien tiba di rumah sakit dan hasil laktat serta kulturnya keluar',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Setiap jam yang tertunda pada syok septik menaikkan angka kematian. Laktat dan kultur memperhalus terapi, bukan yang memulainya — dan FKTP tidak punya keduanya.',
          },
          {
            id: 'c',
            label: 'Beri parasetamol dulu untuk menurunkan demamnya yang 39,1 derajat, lalu evaluasi ulang tekanan darahnya',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Anda mengobati angka termometer, bukan syoknya. Antipiretik tidak memperbaiki perfusi, dan menunggu "evaluasi ulang" membuang jam-jam yang paling menentukan.',
          },
          {
            id: 'd',
            label: 'Mulai vasopresor sekarang juga karena tekanan darahnya sangat rendah',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Vasopresor adalah langkah setelah cairan dan memerlukan akses vena sentral serta pemantauan yang tidak ada di FKTP. Memeras pembuluh yang masih kosong justru memperburuk perfusi jaringan.',
          },
        ],
      },
      {
        id: 'sep_2',
        narasi:
          'Satu liter kristaloid sudah masuk, tekanan darah naik tipis ke 90/58 dan pasien masih bingung. ' +
          'Perawat menyiapkan antibiotik. Kabar dari rumah sakit rujukan: tempat tidur baru siap sekitar dua jam lagi.',
        pilihan: [
          {
            id: 'a',
            label: 'Berikan dosis pertama antibiotik empiris spektrum luas yang tersedia sekarang juga secara intravena, sambil cairan terus berjalan',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Pada syok septik antibiotik diberikan sedini mungkin, idealnya dalam jam pertama; dosis pertama di FKTP bukan mendahului rumah sakit, melainkan menyelamatkan jam-jam yang tidak bisa dikembalikan.',
          },
          {
            id: 'b',
            label: 'Tunggu sampai pasien tiba di rumah sakit agar pemilihan antibiotiknya sesuai hasil kultur dan pola kuman setempat',
            benar: false,
            efekStabilitas: -26,
            respons:
              'Inilah penundaan yang paling sering fatal. Pemilihan definitif memang urusan rumah sakit, tetapi dosis pertama yang tepat waktu adalah urusan Anda — kultur menyempurnakan terapi, bukan menunda memulainya.',
          },
          {
            id: 'c',
            label: 'Berikan antibiotik oral saja dulu karena lebih mudah dan pasien masih bisa menelan',
            benar: false,
            efekStabilitas: -24,
            respons:
              'Pasien ini syok: perfusi ususnya buruk sehingga penyerapan oral tidak dapat diandalkan, dan kesadarannya menurun sehingga berisiko aspirasi. Pada syok, antibiotik harus intravena.',
          },
          {
            id: 'd',
            label: 'Cukup cairan saja dulu; antibiotik ditunda sampai tekanan darahnya normal supaya tidak menambah beban',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Cairan dan antibiotik berjalan bersamaan, bukan bergantian. Selama sumber infeksinya tidak dilawan, tekanan darah yang Anda kejar dengan cairan tidak akan bertahan.',
          },
        ],
      },
      {
        id: 'sep_3',
        narasi:
          'Setelah dua liter kristaloid, tekanan darahnya bertahan di 92/60, napas 26, dan kesadarannya sedikit membaik. ' +
          'Ambulans sudah menunggu di depan pintu.',
        pilihan: [
          {
            id: 'a',
            label:
              'Rujuk sekarang dengan cairan dan oksigen tetap berjalan, catat jam pemberian antibiotik dan total cairan, serta pantau sepanjang perjalanan',
            benar: true,
            efekStabilitas: 18,
            respons:
              'Tepat. Pasien ini membutuhkan vasopresor dan perawatan intensif yang tidak ada di sini; catatan jam antibiotik dan total cairan langsung menyambung ke terapi di rumah sakit tanpa memulai dari nol.',
          },
          {
            id: 'b',
            label: 'Tahan dulu di FKTP sampai tekanan darahnya benar-benar normal, baru dirujuk supaya aman di perjalanan',
            benar: false,
            efekStabilitas: -24,
            respons:
              'Menunggu "normal" di tempat yang tidak punya vasopresor maupun perawatan intensif hanya membuang waktu. Pasien dirujuk setelah distabilkan sebisanya, bukan setelah sembuh.',
          },
          {
            id: 'c',
            label: 'Rujuk cepat tanpa memasang cairan lanjutan agar ambulans tidak terlambat berangkat',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Rujukan bukan sekadar memindahkan pasien. Tanpa cairan berjalan dan pemantauan, syoknya akan memburuk justru saat ia berada di dalam ambulans.',
          },
          {
            id: 'd',
            label: 'Beri kortikosteroid dosis tinggi sebelum berangkat untuk menahan syoknya selama di perjalanan',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Kortikosteroid hanya dipertimbangkan pada syok septik yang tetap refrakter setelah cairan DAN vasopresor adekuat — itu keputusan tingkat perawatan intensif, bukan bekal rujukan dari FKTP.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_eklampsia',
    nama: 'Eklampsia',
    icd10: 'O15.0',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang ibu hamil dibopong masuk dalam keadaan kejang kelojotan, perutnya yang besar terguncang di atas brankar. ' +
      '"Baru saja mengeluh kepalanya sakit sekali dan matanya kabur, Dok, terus tiba-tiba kejang begini!" ' +
      'Wajah dan kedua tungkainya sembab, dan busa keluar dari sudut bibirnya.',
    demografi: { usiaMin: 18, usiaMax: 40, jenisKelamin: 'P' },
    vitalAwal: { td: '180/115', nadi: 104, rr: 22, suhu: 36.9, spo2: 93 },
    stabilitasAwal: 46,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'obgyn',
    clue:
      'Eklampsia adalah preeklampsia yang SUDAH disertai kejang menyeluruh dan/atau koma — bedakan dari preeklampsia berat yang belum kejang; dasarnya disfungsi endotel plasenta yang memicu vasospasme, hipertensi berat, dan edema serebral. Urutan yang benar: amankan ibu dari cedera, bebaskan jalan napas, MIRINGKAN KE KIRI (mengurangi aspirasi sekaligus melepaskan kompresi uterus pada vena kava sehingga aliran balik dan perfusi plasenta membaik), oksigen 4-6 L/menit → MgSO4 sebagai antikonvulsan PILIHAN, bukan diazepam: dosis awal 4 g intravena perlahan selama 20 menit (10 mL MgSO4 40% diencerkan dalam 10 mL akuades); bila jalur IV sulit, 5 g intramuskular pada masing-masing bokong. Syarat pemberian MgSO4: kalsium glukonas 10% tersedia, refleks patela ada, urin minimal 0,5 mL/kgBB/jam, dan frekuensi napas 12-16x/menit. Sambil menunggu rujukan mulai rumatan 6 g MgSO4 dalam 500 mL Ringer Laktat, 28 tetes/menit. Diazepam HANYA alternatif bila MgSO4 benar-benar tidak tersedia — dosis yang dibutuhkan tinggi, menekan napas ibu, dan menembus plasenta. Pantau tanda toksisitas MgSO4 tiap jam: hilangnya refleks patela, napas <16x/menit, dan oliguria; bila terjadi depresi napas hentikan MgSO4 dan berikan kalsium glukonas 1 g IV (10 mL larutan 10%) bolus dalam 10 menit. Kendalikan tekanan darah secara BERTAHAP — penurunan mendadak ke angka normal memangkas perfusi plasenta dan membuat janin gawat. Terapi DEFINITIF eklampsia adalah MELAHIRKAN, sehingga ini adalah indikasi rujukan wajib ke obgyn dengan MgSO4 rumatan tetap berjalan. Sumber: PPK Dokter di FKTP (KMK 1186/2022) bab Eklampsi, serta Buku Saku Pelayanan Kesehatan Ibu Kemenkes-WHO.',
    langkah: [
      {
        id: 'ekl_1',
        narasi:
          'Ibu masih kejang kelojotan, giginya terkatup, dan saturasinya turun ke 93 persen. ' +
          'Tekanan darahnya 180/115 dan usia kehamilannya sekitar 34 minggu. Tindakan pertama?',
        pilihan: [
          {
            id: 'a',
            label: 'Amankan ibu dari cedera, bebaskan jalan napas, miringkan ke sisi KIRI, dan berikan oksigen',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Miring kiri mengurangi risiko aspirasi sekaligus melepaskan tekanan rahim pada vena kava sehingga aliran balik dan perfusi plasenta membaik; airway dan oksigen tetap mendahului obat apa pun.',
          },
          {
            id: 'b',
            label: 'Tahan kuat kedua lengan dan tungkainya supaya kejangnya berhenti',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Menahan tubuh yang kejang tidak menghentikan kejangnya; yang didapat hanya patah tulang, cedera jaringan lunak, dan detik-detik berharga yang hilang. Yang dilakukan adalah mengamankan sekitarnya, bukan melawan gerakannya.',
          },
          {
            id: 'c',
            label: 'Segera suntikkan antikonvulsan lebih dulu; jalan napas dan posisinya diurus setelah kejangnya berhenti',
            benar: false,
            efekStabilitas: -15,
            respons:
              'Antikonvulsan memang harus segera, tetapi ibu yang kejang telentang bisa teraspirasi dalam hitungan detik. Membebaskan napas dan memiringkan ke kiri hanya butuh beberapa detik dan dikerjakan lebih dahulu.',
          },
          {
            id: 'd',
            label: 'Baringkan telentang datar dan ganjal kepalanya dengan bantal supaya lebih nyaman',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Telentang adalah posisi terburuk bagi ibu hamil besar yang kejang: rahim menekan vena kava sehingga tekanan darah dan aliran ke janin anjlok, sementara sekret dan muntahan mudah masuk ke jalan napas.',
          },
        ],
      },
      {
        id: 'ekl_2',
        narasi:
          'Jalan napas aman, oksigen terpasang, ibu sudah dimiringkan ke kiri — tetapi kejangnya belum berhenti. ' +
          'Di lemari obat tersedia MgSO4 40 persen, diazepam injeksi, kalsium glukonas 10 persen, dan Ringer Laktat.',
        pilihan: [
          {
            id: 'a',
            label: 'Berikan MgSO4 dosis awal secara intravena perlahan, dengan kalsium glukonas 10 persen siap di samping pasien',
            benar: true,
            efekStabilitas: 24,
            respons:
              'Tepat, dan inilah yang membedakan eklampsia dari kejang lain: MgSO4 terbukti lebih unggul daripada diazepam maupun fenitoin dalam mencegah kejang berulang dan menurunkan kematian ibu — ia obat PILIHAN, bukan alternatif.',
          },
          {
            id: 'b',
            label: 'Berikan diazepam IV karena inilah antikonvulsan yang paling akrab dipakai untuk semua jenis kejang',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Refleks yang salah pada konteks ini. Diazepam hanya cadangan bila MgSO4 benar-benar tidak ada: dosis yang dibutuhkan tinggi, menekan napas ibu, dan menembus plasenta sehingga bayi lahir lemas.',
          },
          {
            id: 'c',
            label: 'Berikan antihipertensi lebih dulu; begitu tekanan darahnya turun, kejangnya akan berhenti sendiri',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Menurunkan tekanan darah tidak menghentikan kejang eklampsia — keduanya masalah terpisah dengan obat yang berbeda. Kejang yang dibiarkan berlanjut merusak otak ibu dan mencekik oksigen janin.',
          },
          {
            id: 'd',
            label: 'Tunggu saja, kejang eklampsia biasanya berhenti sendiri dalam satu-dua menit',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Berbahaya. Kejang yang dibiarkan berulang menyebabkan hipoksia ibu dan janin, solusio plasenta, dan perdarahan otak; MgSO4 diberikan justru untuk mencegah kejang berikutnya, bukan hanya menghentikan yang sekarang.',
          },
        ],
      },
      {
        id: 'ekl_3',
        narasi:
          'Kejangnya berhenti setelah dosis awal MgSO4 dan ibu kini mengantuk namun bernapas spontan. ' +
          'Tekanan darahnya tetap 180/115. Ambulans siap berangkat ke RS dengan obgyn.',
        pilihan: [
          {
            id: 'a',
            label:
              'Turunkan tekanan darah secara bertahap dengan antihipertensi, pasang kateter urin, pastikan kalsium glukonas siap, pantau refleks patela/frekuensi napas/produksi urin tiap jam, lalu rujuk ke obgyn dengan MgSO4 rumatan berjalan',
            benar: true,
            efekStabilitas: 19,
            respons:
              'Tepat. Terapi DEFINITIF eklampsia adalah MELAHIRKAN, dan itu hanya mungkin di fasilitas obgyn — tugas FKTP adalah menstabilkan lalu mengantar; refleks patela, napas, dan urin adalah cara mendeteksi toksisitas MgSO4 sedini mungkin.',
          },
          {
            id: 'b',
            label: 'Kejangnya sudah berhenti dan ibu tenang — rawat di FKTP saja sampai besok, dirujuk hanya bila kejang lagi',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Eklampsia adalah indikasi rujukan yang mutlak. Selama janin belum lahir, penyakitnya belum diobati sama sekali; kejang berikutnya, solusio plasenta, atau edema paru bisa datang kapan saja.',
          },
          {
            id: 'c',
            label: 'Turunkan tekanan darahnya secepat mungkin sampai mencapai angka normal',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Penurunan yang terlalu cepat dan terlalu dalam memangkas aliran darah plasenta dan dapat membuat janin gawat. Targetnya menurunkan bertahap ke rentang aman, bukan mengejar angka normal.',
          },
          {
            id: 'd',
            label: 'Hentikan MgSO4 sekarang karena kejangnya sudah berhenti dan Anda khawatir dosisnya berlebih',
            benar: false,
            efekStabilitas: -20,
            respons:
              'MgSO4 justru diteruskan sebagai rumatan untuk mencegah kejang berulang selama perjalanan. Yang menghentikannya bukan rasa khawatir, melainkan tanda toksisitas nyata — refleks patela hilang, napas melambat, atau urin berkurang — dan antidotnya kalsium glukonas.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_sumbatan_jalan_napas_anak',
    nama: 'Sumbatan Jalan Napas Anak',
    icd10: 'T17.9',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang ayah menerobos masuk sambil mengangkat anaknya yang tergantung lemas di lengannya. ' +
      '"Lagi makan bakso, Dok, tiba-tiba tercekik!" ' +
      'Anak itu mencengkeram lehernya sendiri, mulutnya terbuka lebar tanpa suara sedikit pun, dan wajahnya sudah membiru.',
    demografi: { usiaMin: 1, usiaMax: 5 },
    vitalAwal: { nadi: 150, rr: 8, suhu: 36.7, spo2: 76 },
    stabilitasAwal: 42,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'anak',
    clue:
      'Sumbatan jalan napas oleh benda asing pada anak dinilai dari SATU pertanyaan: batuknya efektif atau tidak. Sumbatan PARSIAL (anak masih bisa bersuara, menangis, atau batuk BERBUNYI) = jangan diintervensi — dorong ia terus batuk, karena batuk spontan menghasilkan tekanan jalan napas lebih besar daripada manuver apa pun dan tangan penolong justru bisa mengubahnya menjadi sumbatan total. Sumbatan TOTAL (tidak ada suara, batuk tanpa bunyi, sianosis) = tindakan segera: pada anak di atas 1 tahun, 5 hentakan punggung bergantian dengan 5 hentakan perut (Heimlich), diulang sampai benda keluar; pada bayi di bawah 1 tahun hentakan perut TIDAK dilakukan — diganti 5 hentakan dada, karena hati bayi relatif besar dan mudah robek. JANGAN melakukan sapuan jari membabi buta: benda terdorong lebih dalam dan jalan napas terluka; jari hanya masuk bila benda TERLIHAT jelas dan dapat dijepit. Begitu anak TIDAK SADAR, algoritmanya berpindah ke RJP — kompresi dada menghasilkan tekanan jalan napas yang menyerupai hentakan perut sekaligus menjaga perfusi otak, dan mulut hanya dilihat sekilas tiap kali jalan napas dibuka untuk memberi napas. Disposisi kasus ini RUJUK ke spesialis anak, bukan karena setiap tersedak harus dirujuk, melainkan karena dua alasan yang ada di narasinya: (1) batuk yang menetap dan suara napas kasar setelah benda keluar menandakan kemungkinan sisa benda asing, yang penyingkirannya memerlukan bronkoskopi dan mustahil di FKTP — foto polos tidak menolong karena makanan bersifat radiolusen; dan (2) setiap anak yang menerima hentakan perut wajib dinilai kemungkinan cedera organ dalam. Bila benda keluar dan anak benar-benar pulih sempurna tanpa batuk sisa, tanpa bunyi napas, dan tanpa nyeri perut, observasi di FKTP lalu pulang dengan edukasi bahaya tersedak memang memadai. PPK Dokter di FKTP (KMK 1186/2022) memuat bab benda asing di hidung, telinga, dan konjungtiva, tetapi tidak memuat bab sumbatan jalan napas oleh benda asing; acuan yang dipakai adalah algoritma bantuan hidup dasar anak (ERC/AHA) dan pendekatan MTBS/IDAI.',
    langkah: [
      {
        id: 'fbao_1',
        narasi:
          'Anak masih sadar tetapi tidak dapat bersuara sama sekali; batuknya tidak berbunyi dan dadanya bergerak tanpa udara yang masuk. Tindakan pertama?',
        pilihan: [
          {
            id: 'a',
            label:
              'Kenali ini sumbatan TOTAL, lalu lakukan 5 hentakan punggung diselingi 5 hentakan perut berulang sampai bendanya keluar atau anak tak sadar',
            benar: true,
            efekStabilitas: 25,
            respons:
              'Tepat. Batuk yang tidak berbunyi berarti tidak ada udara yang lewat sama sekali — ini sumbatan total, dan hanya tekanan mendadak dari luar yang bisa mendorong benda itu keluar.',
          },
          {
            id: 'b',
            label: 'Dorong anak untuk terus batuk dan awasi saja, karena batuk adalah cara alami tubuh mengeluarkan benda asing',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Nasihat yang benar untuk sumbatan PARSIAL, mematikan pada yang total. Batuk tanpa suara berarti tidak ada aliran udara untuk dibatukkan — menunggu di sini sama dengan menunggu henti napas.',
          },
          {
            id: 'c',
            label: 'Buka mulutnya dan sapukan jari ke dalam tenggorokannya untuk mengorek benda asingnya',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Sapuan jari membabi buta justru mendorong benda lebih dalam dan menjepitnya di laring, sekaligus melukai jalan napas. Jari hanya masuk bila bendanya benar-benar TERLIHAT dan dapat dijepit.',
          },
          {
            id: 'd',
            label: 'Baringkan anak dan pasang oksigen sungkup aliran tinggi lebih dulu, baru pikirkan cara mengeluarkan bendanya',
            benar: false,
            efekStabilitas: -18,
            respons:
              'Oksigen tidak bisa melewati sumbatan. Selama jalan napas tertutup total, sungkup sama sekali tidak berguna — buka dulu jalannya, oksigen menyusul.',
          },
        ],
      },
      {
        id: 'fbao_2',
        narasi:
          'Setelah beberapa siklus, anak tiba-tiba lemas total dan tidak sadar, sementara benda asingnya belum keluar. Langkah berikutnya?',
        pilihan: [
          {
            id: 'a',
            label:
              'Baringkan di alas keras, panggil bantuan, dan mulai RJP — tiap kali jalan napas dibuka untuk memberi napas, lihat sekilas ke dalam mulut dan ambil bendanya hanya bila terlihat',
            benar: true,
            efekStabilitas: 22,
            respons:
              'Tepat. Kompresi dada pada anak tak sadar menghasilkan tekanan jalan napas yang menyerupai hentakan perut sekaligus mengalirkan darah ke otak; melihat sekilas saat memberi napas sama sekali berbeda dari mengorek membabi buta.',
          },
          {
            id: 'b',
            label: 'Teruskan hentakan perut sambil anak digendong walaupun ia sudah tidak sadar',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Begitu anak tidak sadar, algoritmanya berpindah ke RJP. Hentakan perut pada tubuh yang lemas tidak efektif dan menunda kompresi dada, yang justru menjadi pengganti manuver itu sekaligus penyelamat sirkulasinya.',
          },
          {
            id: 'c',
            label: 'Balikkan anak, pegang kedua kakinya, dan guncang-guncangkan terbalik agar bendanya jatuh keluar',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Mitos berbahaya yang masih sering terlihat. Mengguncang terbalik tidak mengeluarkan benda, membuang detik-detik yang menentukan, dan mudah membuat anak terlepas lalu cedera kepala.',
          },
          {
            id: 'd',
            label: 'Tinggalkan anak sebentar untuk mencari laringoskop dan forsep Magill di lemari alat sebelum melakukan apa pun',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Bila alatnya ada dan Anda terlatih, pengambilan langsung memang pilihan yang sah — tetapi meninggalkan anak yang tidak bernapas untuk mencari alat adalah kesalahan. RJP dimulai lebih dulu; biar orang lain yang mengambilkan alatnya.',
          },
        ],
      },
      {
        id: 'fbao_3',
        narasi:
          'Pada siklus berikutnya sepotong bakso terlontar keluar. Anak menangis kencang, wajahnya kembali merah, SpO2 98 persen tanpa oksigen — ' +
          'tetapi ia terus terbatuk-batuk dan sesekali terdengar napasnya berbunyi kasar. Ayahnya sudah menggendongnya hendak pulang.',
        pilihan: [
          {
            id: 'a',
            label: 'Rujuk ke rumah sakit dengan spesialis anak untuk menilai kemungkinan sisa benda asing dan cedera akibat hentakan perut',
            benar: true,
            efekStabilitas: 18,
            respons:
              'Tepat. Batuk yang menetap dan napas berbunyi setelah benda keluar menandakan jalan napasnya masih terganggu — potongan sisa bisa tertinggal, dan setiap anak yang menerima hentakan perut wajib dinilai kemungkinan cedera organ dalam.',
          },
          {
            id: 'b',
            label: 'Bendanya sudah keluar dan saturasinya 98 persen — pulangkan saja dengan pesan hati-hati saat makan',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Terlalu cepat merasa selesai. Batuk yang tidak reda dan napas kasar adalah tanda masih ada yang salah di jalan napas, dan hentakan perut sendiri dapat melukai hati atau lambung tanpa gejala di jam-jam pertama.',
          },
          {
            id: 'c',
            label: 'Tunggu hasil foto toraks dulu; bila bersih, anak boleh pulang',
            benar: false,
            efekStabilitas: -20,
            respons:
              'Makanan tidak tampak pada foto polos. Hasil yang bersih sama sekali tidak menyingkirkan sisa bakso di jalan napas, dan menunggunya hanya menunda rujukan yang memang sudah pasti diperlukan.',
          },
          {
            id: 'd',
            label: 'Nebulisasi dan beri kortikosteroid untuk suara napasnya, lalu pulangkan bila bunyinya sudah hilang',
            benar: false,
            efekStabilitas: -22,
            respons:
              'Anda menghilangkan tandanya, bukan sebabnya. Meredakan bunyi napas tanpa memastikan tidak ada sisa benda asing membuat anak pulang dengan sumbatan yang bisa mengunci kembali sewaktu-waktu.',
          },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_pneumotoraks_tension_trauma',
    nama: 'Pneumotoraks Tension Traumatik',
    icd10: 'S27.0',
    skdi: '3B',
    activationStatus: 'lab_prototype_unadjudicated',
    pembuka:
      'Seorang pengendara motor digotong masuk setelah menghantam pembatas jalan, dadanya membentur setang. ' +
      'Dalam sepuluh menit di ruang tindakan sesaknya berubah dari berat menjadi mengerikan. ' +
      'Ia meronta mencari udara, vena-vena lehernya menonjol seperti tali, dan bibirnya kelabu.',
    demografi: { usiaMin: 20, usiaMax: 45 },
    vitalAwal: { td: '78/50', nadi: 136, rr: 38, suhu: 36.6, spo2: 79 },
    stabilitasAwal: 42,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'bedah',
    clue:
      'Pneumotoraks TENSION traumatik terjadi ketika robekan paru bekerja sebagai katup satu arah: udara masuk ke rongga pleura tiap inspirasi tetapi tidak bisa keluar, tekanan intratoraks terus naik, paru kolaps, mediastinum tergeser, dan vena kava terjepit sehingga aliran balik ke jantung terhenti — syoknya OBSTRUKTIF, bukan hipovolemik, sehingga guyuran cairan sebanyak apa pun tidak menolong sebelum tekanan itu dilepaskan. Diagnosisnya KLINIS: sesak berat progresif setelah trauma dada, satu sisi dada tertinggal dan hipersonor, suara napas hilang sebelah, trakea terdorong ke sisi berlawanan, vena leher distensi, dan hipotensi. JANGAN menunggu foto toraks — inilah kesalahan pola yang paling mematikan pada kasus ini. Urutannya: oksigen aliran tinggi → DEKOMPRESI JARUM segera pada sisi yang SAKIT dengan kateter IV besar, disusurkan menempel tepi ATAS iga yang berada di bawah sela iga tujuan (berkas pembuluh darah dan saraf interkostal berjalan di tepi BAWAH tiap iga), lalu kanul ditinggalkan TERBUKA dan difiksasi — jangan pernah ditutup rapat atau dicabut, karena tensionnya akan segera kembali → rujuk ke rumah sakit dengan bedah untuk pemasangan WSD, dengan pemantauan ketat sepanjang perjalanan karena kanul dapat tersumbat atau tertekuk. Lokasi tusukan yang lazim diajarkan adalah sela iga ke-2 garis midklavikula; pedoman trauma mutakhir (ATLS) kini lebih menyukai sela iga ke-4/ke-5 garis aksilaris anterior pada dewasa karena dinding dadanya lebih tipis di situ sehingga kateter lebih pasti menembus pleura. PPK Dokter di FKTP (KMK 1186/2022) memuat bab Pneumotoraks dengan penatalaksanaan oksigen, pemasangan jalur IV kristaloid bila ada tanda kegagalan sirkulasi, lalu rujuk segera setelah penanggulangan awal — dan daftar peralatannya memuat abbocath 14, spuit, serta three-way, yakni justru perangkat dekompresi jarum. Kasus ini contoh terbaik bahwa FKTP memang memiliki tindakan penyelamat nyawa yang nyata.',
    langkah: [
      {
        id: 'ptx_1',
        narasi:
          'Dada kanannya tertinggal dan hipersonor pada perkusi, suara napas kanan hilang, trakea terdorong ke kiri, tekanan darah 78/50. ' +
          'Petugas menawarkan, "Foto toraks sekarang, Dok?" Keputusan Anda?',
        pilihan: [
          {
            id: 'a',
            label: 'Tolak foto toraksnya, berikan oksigen aliran tinggi, dan lakukan dekompresi jarum segera pada sisi kanan',
            benar: true,
            efekStabilitas: 25,
            respons:
              'Tepat. Pneumotoraks tension adalah diagnosis KLINIS dan dekompresi jarum tidak boleh menunggu gambar apa pun; menunda demi foto berarti membiarkan tekanan itu mencekik jantung sampai berhenti.',
          },
          {
            id: 'b',
            label: 'Lakukan foto toraks dulu untuk memastikan diagnosisnya sebelum menusuk dada orang',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Inilah keraguan yang membunuh. Pasien dengan trakea terdorong dan tekanan darah anjlok tidak punya waktu untuk foto; kalaupun fotonya jadi, ia hanya memastikan apa yang sudah jelas di depan mata — sering setelah pasiennya meninggal.',
          },
          {
            id: 'c',
            label: 'Pasang infus dan guyur cairan dulu untuk menaikkan tekanan darahnya, dekompresi menyusul',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Syok di sini OBSTRUKTIF, bukan hipovolemik: darah tidak bisa kembali ke jantung karena tekanan di rongga dadanya. Cairan sebanyak apa pun tidak menolong sebelum tekanan itu dilepaskan.',
          },
          {
            id: 'd',
            label: 'Berikan oksigen aliran tinggi dan nebulisasi bronkodilator karena suara napasnya hilang sebelah',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Suara napas hilang di sini bukan karena bronkus menyempit, melainkan karena paru sudah kolaps didesak udara bertekanan. Bronkodilator tidak punya sasaran, dan menit yang terbuang tidak bisa ditarik kembali.',
          },
        ],
      },
      {
        id: 'ptx_2',
        narasi:
          'Anda memutuskan mendekompresi. Perawat menyodorkan baki: kateter IV ukuran besar, spuit, three-way, povidon iodin, dan sarung tangan steril.',
        pilihan: [
          {
            id: 'a',
            label:
              'Tentukan sela iga pada sisi yang sakit, desinfeksi, lalu tusukkan kateter IV besar menyusur tepi ATAS iga yang berada di bawah sela iga tujuan sampai terdengar desis udara, dan tinggalkan kanulnya terbuka',
            benar: true,
            efekStabilitas: 24,
            respons:
              'Tepat. Berkas pembuluh darah dan saraf interkostal berjalan di tepi BAWAH tiap iga, jadi jarum disusurkan menempel tepi ATAS iga di bawahnya; desis udara yang menyembur sekaligus mengonfirmasi diagnosis dan mengubah tension menjadi pneumotoraks sederhana.',
          },
          {
            id: 'b',
            label: 'Tusukkan jarumnya pada sisi dada yang SEHAT, karena di situlah suara napas masih terdengar',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Fatal. Sisi yang suara napasnya masih terdengar adalah paru yang masih bekerja; menusuknya berarti menciptakan pneumotoraks kedua dan menghabisi satu-satunya paru yang tersisa.',
          },
          {
            id: 'c',
            label: 'Susurkan jarumnya menempel di tepi BAWAH iga yang berada di atas sela iga tujuan supaya lebih mudah diarahkan',
            benar: false,
            efekStabilitas: -18,
            respons:
              'Arah menyusurnya terbalik. Persis di tepi bawah iga itulah berkas pembuluh darah dan saraf interkostal bersembunyi — menyusur di situ berisiko merobek arteri interkostal dan menambah hemotoraks pada pasien yang sudah syok.',
          },
          {
            id: 'd',
            label: 'Langsung pasang WSD lengkap di sini juga sekalian, supaya nanti tidak perlu dirujuk',
            benar: false,
            efekStabilitas: -25,
            respons:
              'Melampaui lingkup dan kemampuan FKTP. WSD memerlukan keterampilan, alat, dan perawatan lanjutan yang tidak ada di sini; niat "sekalian" itu justru menunda rujukan yang mutlak diperlukan.',
          },
        ],
      },
      {
        id: 'ptx_3',
        narasi:
          'Udara menyembur keluar dengan desis panjang; dalam satu menit tekanan darahnya naik ke 106/70, saturasi 94 persen, dan pasien mulai bisa bicara. ' +
          'Ia berterima kasih lalu bertanya apakah sudah boleh pulang.',
        pilihan: [
          {
            id: 'a',
            label:
              'Fiksasi kanulnya dan jaga tetap terbuka, teruskan oksigen, lalu rujuk segera ke rumah sakit dengan bedah untuk pemasangan WSD dengan pemantauan ketat sepanjang perjalanan',
            benar: true,
            efekStabilitas: 19,
            respons:
              'Tepat. Dekompresi jarum hanya mengubah kegawatan menjadi pneumotoraks sederhana dan sifatnya sementara — kanul bisa tersumbat atau tertekuk lalu tensionnya kambuh; terapi definitifnya adalah WSD di rumah sakit.',
          },
          {
            id: 'b',
            label: 'Pasien membaik dramatis — cabut kanulnya dan pulangkan dengan pesan kontrol besok',
            benar: false,
            efekStabilitas: -30,
            respons:
              'Mencabut kanul mengembalikan pasien persis ke keadaan yang hampir membunuhnya beberapa menit lalu. Paru yang bocor masih bocor; perbaikan ini pinjaman waktu, bukan kesembuhan.',
          },
          {
            id: 'c',
            label: 'Cabut kanulnya dan tutup rapat lukanya dengan kasa kedap udara agar tidak ada udara yang masuk lagi',
            benar: false,
            efekStabilitas: -28,
            respons:
              'Menutup rapat justru mengunci udara yang terus bocor dari paru di dalam rongga dada — persis mekanisme yang menciptakan tension sejak awal. Jalur keluarnya harus tetap terbuka.',
          },
          {
            id: 'd',
            label: 'Sekarang baru lakukan foto toraks untuk mendokumentasikan hasilnya sebelum merujuk',
            benar: false,
            efekStabilitas: -18,
            respons:
              'Foto boleh diambil bila tidak menunda apa pun, tetapi saat ini ia tidak mengubah satu keputusan pun — pasien tetap dirujuk untuk WSD. Yang menentukan bukan gambarnya, melainkan berangkatnya.',
          },
        ],
      },
    ],
  },
]
