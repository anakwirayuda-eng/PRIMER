/**
 * KASUS IGD (M3.14) — gawat darurat sebagai interrupt event turn-based.
 * Pemain memilih SATU tindakan per langkah; benar menstabilkan, salah memburuk.
 * Akurasi mengikuti algoritma kegawatdaruratan (ACLS/PPGD/MTBS/Kemenkes).
 */

import { terapkanGroundingIgd } from './igdSources'

export const KASUS_IGD = terapkanGroundingIgd([
  /* ====================================================================== */
  {
    id: 'igd_syok_anafilaksis',
    // Audit CODEX beta.16 (2026-08-06): debrief ditambahkan. Enam kasus IGD
    // baseline tak punya lapisan ini sama sekali, dan invariant lama hanya
    // melintasi 14 kasus teradjudikasi sehingga tak ada yang memerah. Diukur
    // per mode, defisitnya paling tajam justru di mode yang DINILAI: pool
    // Ujian 5 dari 5 kasus kosong. Tiap kalimat di bawah ditelusuri ke isi
    // kasus ini sendiri (clue, panduanResmi, label & respons tiap langkah,
    // disposisi, spesialis rujukan) — tak ada fakta klinis baru yang ditambah.
    debrief: {
      poinKunci: [
        'Adrenalin 0,3-0,5 mg ke otot paha anterolateral adalah tindakan pertama; antihistamin dan steroid hanya lini kedua.',
        'Baringkan pasien dengan tungkai ditinggikan; mendudukkan tegak memperburuk syok.',
        'Adrenalin disiapkan untuk diulang tiap 5-15 menit bila reaksi belum teratasi atau kambuh.',
        'Membaik bukan berarti boleh pulang: reaksi bifasik dapat muncul beberapa jam kemudian, jadi pasien dirujuk.',
      ],
      realitaFktp:
        'Sukamaju dinyatakan memiliki adrenalin suntik, oksigen aliran tinggi, akses infus dengan cairan, serta pemantauan tekanan darah dan saturasi; ada tidaknya antihistamin dan steroid tidak mengubah urutan. Observasi berkepanjangan untuk reaksi bifasik ada di jejaring, sehingga rujukan dikerjakan setelah pasien stabil, bukan setelah sekadar terlihat membaik.',
      sumberDaya: {
        ready: [
          'adrenalin suntik IM',
          'oksigen aliran tinggi',
          'akses infus dan cairan',
          'pemantauan tekanan darah dan saturasi',
        ],
        melaluiJejaring: [
          'observasi berkepanjangan reaksi bifasik',
          'rawat lanjut penyakit dalam',
        ],
      },
      kontinuitas:
        'Setelah pasien kembali, pastikan suntikan antibiotik pemicu tercatat sebagai alergi obat di rekam medis dan diingat pasien serta keluarga, lalu sepakati apa yang dilakukan bila bengkak atau sesak muncul lagi.',
      bridgeUkm: {
        judul: 'Jejak Anafilaksis ke Ruang Suntik',
        ringkasan:
          'Reaksi ini muncul setelah suntikan di fasilitas lain. Periksa apakah tempat penyuntikan menanyakan riwayat alergi, menyimpan adrenalin siap pakai, mengenali bengkak dan sesak sebagai tanda awal, dan tahu ke mana merujuk.',
      },
    },
    nama: 'Syok Anafilaksis',
    // Veto-table §3b (M10.5, 2026-07-12, keputusan 8B): T78.2→T88.6 — pemicu
    // di narasi (pembuka) adalah SUNTIKAN ANTIBIOTIK, jadi ini reaksi anafilaktik
    // akibat OBAT (drug-induced), bukan anafilaksis idiopatik/tak-spesifik T78.2.
    icd10: 'T88.6',
    skdi: '4A',
    pembuka:
      'Seorang perempuan digotong masuk, wajah bengkak dan bentol merah di sekujur tubuh. ' +
      '"Habis disuntik antibiotik di klinik tadi, Dok, langsung sesak dan lemas!" Bibirnya membiru.',
    demografi: { usiaMin: 18, usiaMax: 55, jenisKelamin: 'P' },
    vitalAwal: { td: '80/50', nadi: 130, rr: 30, spo2: 88 },
    stabilitasAwal: 45,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'penyakit_dalam',
    clue: 'Anafilaksis = ABC + ADRENALIN IM 0,3-0,5 mg paha anterolateral SEGERA (bukan antihistamin/steroid dulu — itu lini kedua). Baring-tungkai naik, O2, cairan. Rujuk setelah stabil (PPGD/Kemenkes).',
    langkah: [
      {
        id: 'a1',
        narasi: 'Pasien sesak berat, stridor terdengar, tekanan darah 80/50. Tindakan PERTAMA?',
        pilihan: [
          { id: 'a', label: 'Adrenalin (epinefrin) 0,3 mg IM di paha anterolateral', benar: true, efekStabilitas: 25, respons: 'Tepat & menyelamatkan nyawa. Adrenalin IM adalah tindakan lini pertama anafilaksis — jangan ditunda.' },
          { id: 'b', label: 'Suntik difenhidramin/antihistamin IV dulu', benar: false, efekStabilitas: -20, respons: 'Terlambat. Antihistamin hanya lini kedua; menunda adrenalin pada anafilaksis mematikan.' },
          { id: 'c', label: 'Beri kortikosteroid IV lalu observasi', benar: false, efekStabilitas: -25, respons: 'Steroid bekerja lambat (jam), tidak mengatasi obstruksi jalan napas & syok akut. Adrenalin dulu!' },
        ],
      },
      {
        id: 'a2',
        narasi: 'Setelah tindakan awal, saturasi masih 90%, pasien masih sesak.',
        pilihan: [
          { id: 'a', label: 'Oksigen aliran tinggi + baringkan, tungkai ditinggikan', benar: true, efekStabilitas: 20, respons: 'Benar — oksigenasi + posisi memperbaiki perfusi. Siapkan adrenalin ulang bila perlu (tiap 5-15 menit).' },
          { id: 'b', label: 'Dudukkan pasien tegak agar tidak sesak', benar: false, efekStabilitas: -15, respons: 'Pada syok, mendudukkan tegak memperburuk hipotensi (empty ventricle). Baringkan + tungkai naik.' },
        ],
      },
      {
        id: 'a3',
        narasi: 'TD mulai naik 100/70, saturasi 96%. Cairan sudah terpasang.',
        // Audit CODEX 2026-07-16 #8: dulu jawaban benar = "beri antihistamin +
        // kortikosteroid". RCUK 2021 mencabut rekomendasi rutin kortikosteroid
        // & menegaskan antihistamin tak mengatasi ABC — prioritas pascastabilisasi
        // adalah observasi + kesiapan adrenalin ulang + transfer.
        pilihan: [
          { id: 'a', label: 'Observasi ketat, siapkan adrenalin ulang bila reaksi kambuh, lalu rujuk untuk pemantauan reaksi bifasik', benar: true, efekStabilitas: 15, respons: 'Tepat — setelah stabilisasi, lanjutkan pemantauan, siapkan adrenalin ulang tiap 5-15 menit bila perlu, dan rujuk. RCUK 2021 tidak lagi menganjurkan kortikosteroid rutin; antihistamin hanya meredakan gejala kulit, bukan gangguan jalan napas, pernapasan, atau sirkulasi.' },
          { id: 'b', label: 'Andalkan kortikosteroid IV untuk mencegah reaksi bifasik', benar: false, efekStabilitas: -10, respons: 'Bukti steroid mencegah reaksi bifasik LEMAH — RCUK 2021 mencabut rekomendasi rutinnya. Ia bekerja lambat & tak menggantikan observasi + kesiapan adrenalin ulang.' },
          { id: 'c', label: 'Pasien membaik, langsung pulangkan', benar: false, efekStabilitas: -20, respons: 'Bahaya — reaksi bifasik bisa muncul beberapa jam kemudian. Wajib observasi berkepanjangan/rujuk.' },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_kejang_demam',
    // Audit CODEX beta.16 (2026-08-06): debrief ditambahkan. Enam kasus IGD
    // baseline tak punya lapisan ini sama sekali, dan invariant lama hanya
    // melintasi 14 kasus teradjudikasi sehingga tak ada yang memerah. Diukur
    // per mode, defisitnya paling tajam justru di mode yang DINILAI: pool
    // Ujian 5 dari 5 kasus kosong. Tiap kalimat di bawah ditelusuri ke isi
    // kasus ini sendiri (clue, panduanResmi, label & respons tiap langkah,
    // disposisi, spesialis rujukan) — tak ada fakta klinis baru yang ditambah.
    debrief: {
      poinKunci: [
        'Kejang yang masih berlangsung lewat lima menit adalah kegawatan, bukan sesuatu yang ditunggu berhenti sendiri.',
        'Jalan napas lebih dulu: miringkan anak, jangan tahan gerakannya, jangan masukkan benda apa pun ke mulut.',
        'Penghenti kejang di FKTP adalah diazepam rektal 0,5 mg/kg, bukan penurun panas; obat lewat mulut berisiko masuk ke jalan napas.',
        'Kejang kedua dalam sehari dan berlangsung lebih dari sepuluh menit termasuk kejang demam kompleks — wajib dirujuk.',
      ],
      realitaFktp:
        'Sukamaju sanggup mengerjakan bagian yang menentukan: memiringkan anak, memberi oksigen, memberikan diazepam rektal, menurunkan demam, dan memasang infus. Yang tidak bisa diselesaikan di sini adalah mencari penyebab kejang kompleks ini; itu memerlukan evaluasi lanjut di rumah sakit anak, sehingga rujukan termasuk tata laksana, bukan tambahan.',
      sumberDaya: {
        ready: [
          'posisi pemulihan dan oksigen',
          'diazepam rektal',
          'parasetamol penurun demam',
          'pemasangan infus',
        ],
        melaluiJejaring: [
          'evaluasi lanjut kejang demam kompleks di rumah sakit anak',
          'pencarian penyebab, termasuk kecurigaan infeksi susunan saraf pusat',
        ],
      },
      kontinuitas:
        'Sesudah anak kembali dari rumah sakit, FKTP menindaklanjuti hasil pencarian penyebabnya, memantau demam dan kejang berikutnya, lalu melatih keluarga: miringkan, jangan ditahan, jangan masukkan benda ke mulut, segera dibawa bila kejang lewat lima menit.',
      bridgeUkm: {
        judul: 'Sendok di Mulut Bukan Pertolongan',
        ringkasan:
          'Satu anak datang setelah kejang lewat sepuluh menit. Sasarannya orang tua balita dan kader: pertolongan pertama saat anak kejang di rumah, termasuk tindakan yang justru melukai seperti memasukkan benda ke mulut, serta ambang waktu untuk segera membawa. Ketersediaan diazepam rektal ikut diaudit.',
      },
    },
    nama: 'Kejang Demam Kompleks',
    icd10: 'R56.0',
    skdi: '4A',
    pembuka:
      'Seorang ibu berlari masuk menggendong balita yang kejang, kelojotan seluruh tubuh. ' +
      '"Sudah lebih dari sepuluh menit belum berhenti, Dok! Tadi panas tinggi, dan ini kejangnya yang KEDUA — ' +
      'tadi siang sempat kejang juga tapi berhenti sendiri!" Anak belum sadar.',
    demografi: { usiaMin: 1, usiaMax: 5 },
    vitalAwal: { suhu: 39.8, nadi: 150, rr: 32, spo2: 94 },
    stabilitasAwal: 50,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'anak',
    clue: 'Kejang >5 menit = status; amankan jalan napas (miringkan, jangan tahan/masukkan benda ke mulut), O2, diazepam REKTAL 0,5 mg/kg. Turunkan demam. Kejang demam KOMPLEKS (>15 menit/fokal/berulang) → rujuk (MTBS/IDAI).',
    langkah: [
      {
        id: 'k1',
        narasi: 'Anak masih kejang, mulut berbuih. Tindakan pertama?',
        pilihan: [
          { id: 'a', label: 'Miringkan, bebaskan jalan napas, beri oksigen', benar: true, efekStabilitas: 20, respons: 'Benar — posisi pemulihan mencegah aspirasi. Jalan napas selalu menjadi prioritas pertama.' },
          { id: 'b', label: 'Tahan gerakan anak & masukkan sendok ke mulut', benar: false, efekStabilitas: -30, respons: 'BERBAHAYA — mitos berbahaya. Bisa patahkan gigi/sumbat napas. Jangan pernah masukkan benda ke mulut.' },
        ],
      },
      {
        id: 'k2',
        narasi: 'Jalan napas aman, tapi kejang belum berhenti (kini menit ke-7).',
        pilihan: [
          { id: 'a', label: 'Diazepam rektal 0,5 mg/kg', benar: true, efekStabilitas: 25, respons: 'Tepat — antikonvulsan lini pertama untuk kejang aktif di FKTP, rute rektal cepat & aman.' },
          { id: 'b', label: 'Tunggu, biasanya berhenti sendiri', benar: false, efekStabilitas: -25, respons: 'Kejang >5 menit = status epileptikus — makin lama makin sulit dihentikan & merusak otak. Beri antikonvulsan.' },
          { id: 'c', label: 'Beri parasetamol oral untuk turunkan demam', benar: false, efekStabilitas: -20, respons: 'Anak kejang tak sadar — memberi obat oral berisiko aspirasi, dan antipiretik tidak menghentikan kejang.' },
        ],
      },
      {
        id: 'k3',
        narasi: 'Kejang berhenti, anak mulai sadar tapi mengantuk. Suhu masih 39,5.',
        pilihan: [
          { id: 'a', label: 'Turunkan demam (parasetamol), pasang infus, rujuk (kejang kompleks)', benar: true, efekStabilitas: 15, respons: 'Tepat — kejang demam KOMPLEKS (berulang 2x dalam <24 jam + durasi >10 menit) wajib evaluasi lanjut di RS anak, bukan cukup diobservasi di FKTP.' },
          { id: 'b', label: 'Kejang sudah berhenti, pulangkan dengan obat penurun panas', benar: false, efekStabilitas: -15, respons: 'Kejang kompleks (berulang dalam sehari) wajib dirujuk untuk cari penyebab (mis. infeksi SSP), bukan cukup obat pulang.' },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_asma_berat',
    // Audit CODEX beta.16 (2026-08-06): debrief ditambahkan. Enam kasus IGD
    // baseline tak punya lapisan ini sama sekali, dan invariant lama hanya
    // melintasi 14 kasus teradjudikasi sehingga tak ada yang memerah. Diukur
    // per mode, defisitnya paling tajam justru di mode yang DINILAI: pool
    // Ujian 5 dari 5 kasus kosong. Tiap kalimat di bawah ditelusuri ke isi
    // kasus ini sendiri (clue, panduanResmi, label & respons tiap langkah,
    // disposisi, spesialis rujukan) — tak ada fakta klinis baru yang ditambah.
    debrief: {
      poinKunci: [
        'Bicara sepatah-sepatah, RR 32, SpO2 89%, dan otot bantu napas menegang sudah cukup menyebut serangan ini berat; mengi keras bisa menipu, sebab dada yang justru senyap berarti henti napas mengancam.',
        'Oksigen dan nebulisasi salbutamol didahulukan; ini bronkospasme, bukan infeksi, sehingga obat batuk dan antibiotik salah sasaran.',
        'Kortikosteroid sistemik diberikan dini dan nebulisasi diulang; efek steroid baru muncul dalam hitungan jam, jadi berhenti di satu nebulisasi lalu menunggu adalah risiko.',
        'Saturasi naik ke 94% tetapi kalimat penuh masih sulit berarti respons parsial: rujuk, jangan pulangkan dengan inhaler.',
      ],
      realitaFktp:
        'Yang bisa dikerjakan Sukamaju hanya tiga: oksigen, bronkodilator kerja cepat yang diulang, dan kortikosteroid sistemik — sambil rujukan disiapkan sejak awal, bukan setelah pasien jatuh ke gagal napas. Ipratropium tidak wajib di sini; pedoman FKTP (PPK 1186/2022) tidak mencantumkannya dan panduan internasional pun menaruhnya sebagai tambahan bila tersedia, sehingga salbutamol tunggal tetap dinilai benar. Aminofilin bolus cepat bukan jalan pintas: bukan lini pertama dan berisiko aritmia.',
      sumberDaya: {
        ready: [
          'oksigen',
          'nebulisasi salbutamol berulang',
          'kortikosteroid sistemik',
          'penilaian ulang saturasi dan sesak',
        ],
        melaluiJejaring: [
          'observasi ketat dan perawatan lanjutan di RS',
          'layanan paru',
          'penanganan bila jatuh ke gagal napas',
        ],
      },
      kontinuitas:
        'Setelah pasien kembali dari RS, telusuri kenapa inhaler di rumah sudah tidak menolong dan tinjau ulang obat asmanya. Sepakati tanda bahaya dan kapan harus langsung datang, sebab serangan berat dengan respons parsial berisiko kambuh fatal di rumah.',
      bridgeUkm: {
        judul: 'Inhaler yang Sudah Tak Mempan',
        ringkasan:
          'Catat berapa penyandang asma yang baru terlihat saat serangan sudah berat dan berapa yang berakhir dirujuk, lalu audit stok salbutamol, kortikosteroid, oksigen, dan kesiapan alat nebulisasi. Angka agregatnya mengarahkan penguatan kontrol rutin dan pesan kapan harus segera datang.',
      },
    },
    nama: 'Serangan Asma Berat',
    icd10: 'J46',
    skdi: '4A',
    pembuka:
      'Seorang laki-laki masuk membungkuk, bertumpu pada meja, hanya bisa bicara sepatah-sepatah. ' +
      '"Dok... sesak... inhaler... nggak mempan." Terdengar mengi keras, otot lehernya menegang.',
    demografi: { usiaMin: 15, usiaMax: 60, jenisKelamin: 'L' },
    vitalAwal: { td: '130/85', nadi: 124, rr: 32, spo2: 89 },
    stabilitasAwal: 50,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'paru',
    // Fix M1/#6c (triase DeepThink 2026-07-11, arahan Dr. Wirayuda: "sesuai
    // konteks FKTP + PPK terbaru"): dicek langsung ke docs/references/ppk1186/
    // — PPK 1186/2022 (pedoman FKTP resmi) NOL mention ipratropium; kriteria
    // rujuknya eksplisit "serangan akut sedang dan berat", bundel pra-rujuk
    // FKTP cuma O2+bronkodilator kerja-cepat+steroid sistemik (persis s1/s2/s3
    // kasus ini). GINA internasional menganjurkan tambah ipratropium, tapi itu
    // MELAMPAUI standar FKTP Indonesia — skor TAK diubah (salbutamol tunggal
    // tetap benar). KasusIgd tak punya field mutiaraEbm (beda dari KasusKlinis
    // biasa) — lapisan idealis-vs-lokal dilebur langsung ke clue di bawah.
    clue: 'Asma berat (bicara sepatah, RR>30, SpO2<90, otot bantu napas) = kriteria RUJUK menurut PPK FKTP (serangan sedang-berat). Sambil menyiapkan rujukan: O2 + NEBULISASI beta-2 kerja cepat (salbutamol) segera + KORTIKOSTEROID sistemik — bundel stabilisasi pra-rujuk PPK 1186/2022, yang TIDAK mencantumkan ipratropium (GINA internasional menganjurkannya sbg tambahan bila tersedia, tapi bukan syarat FKTP). Nilai respons; tak membaik penuh → rujuk (jangan tunggu sampai gagal napas). Silent chest = tanda henti napas mengancam (GINA/PDPI).',
    langkah: [
      {
        id: 's1',
        narasi: 'Saturasi 89%, mengi keras di seluruh lapang paru. Tindakan pertama?',
        pilihan: [
          { id: 'a', label: 'Oksigen + nebulisasi salbutamol segera', benar: true, efekStabilitas: 22, respons: 'Tepat — bronkodilator nebul + oksigen adalah tulang punggung tata laksana serangan asma akut.' },
          { id: 'b', label: 'Beri obat batuk & antibiotik oral', benar: false, efekStabilitas: -25, respons: 'Keliru total — ini serangan bronkospasme, bukan infeksi. Butuh bronkodilator, bukan antibiotik.' },
          { id: 'c', label: 'Suntik aminofilin IV bolus cepat', benar: false, efekStabilitas: -20, respons: 'Bukan lini pertama & berisiko aritmia bila cepat. Nebulisasi beta-agonis dulu.' },
        ],
      },
      {
        id: 's2',
        narasi: 'Setelah nebulisasi pertama, saturasi 92% tapi masih sesak & mengi.',
        pilihan: [
          { id: 'a', label: 'Kortikosteroid sistemik + ulang nebulisasi', benar: true, efekStabilitas: 20, respons: 'Tepat — steroid sistemik mengurangi inflamasi (efek dalam jam), nebul boleh diulang tiap 20 menit.' },
          { id: 'b', label: 'Cukup satu nebulisasi, tunggu saja', benar: false, efekStabilitas: -18, respons: 'Serangan berat butuh terapi berulang + steroid. Menunggu pasif berisiko perburukan.' },
        ],
      },
      {
        id: 's3',
        narasi: 'Setelah 2 siklus nebul + steroid, saturasi 94% tapi pasien tetap sulit bicara kalimat penuh.',
        pilihan: [
          { id: 'a', label: 'Respons parsial pada serangan berat — rujuk ke RS (paru)', benar: true, efekStabilitas: 15, respons: 'Tepat — asma berat yang belum pulih sempurna perlu perawatan lanjutan/observasi ketat di RS.' },
          { id: 'b', label: 'Sudah membaik, pulangkan dengan inhaler', benar: false, efekStabilitas: -20, respons: 'Serangan berat dengan respons parsial berisiko kambuh fatal di rumah. Rujuk.' },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_hipoglikemia',
    // Audit CODEX beta.16 (2026-08-06): debrief ditambahkan. Enam kasus IGD
    // baseline tak punya lapisan ini sama sekali, dan invariant lama hanya
    // melintasi 14 kasus teradjudikasi sehingga tak ada yang memerah. Diukur
    // per mode, defisitnya paling tajam justru di mode yang DINILAI: pool
    // Ujian 5 dari 5 kasus kosong. Tiap kalimat di bawah ditelusuri ke isi
    // kasus ini sendiri (clue, panduanResmi, label & respons tiap langkah,
    // disposisi, spesialis rujukan) — tak ada fakta klinis baru yang ditambah.
    debrief: {
      poinKunci: [
        'Pada pengguna obat diabetes, GDS 38 dengan penurunan kesadaran berarti gula dikoreksi, bukan insulin ditambah.',
        'Pasien tak sadar dikoreksi dengan dekstrosa 40% lewat infus; air gula lewat mulut berisiko tersedak.',
        'GDS ulang 95 dan mata mulai terbuka belum berarti selesai: beri karbohidrat, cari pencetus, tanyakan jenis obatnya.',
        'Glibenklamid kerja panjang bisa membuat hipoglikemia kambuh berjam-jam; rujuk untuk observasi, jangan pulangkan cepat.',
      ],
      realitaFktp:
        'Sukamaju memasang infus, memberi dekstrosa 40%, mengulang pemeriksaan GDS, dan menyiapkan karbohidrat saat pasien aman menelan. Yang melampaui kapasitas IGD FKTP dasar adalah observasi ketat berkepanjangan dengan pantau GDS berkala, dekstrosa rumatan, dan oktreotid di RS. Karena itu pasien dirujuk untuk dirawat, bukan dipulangkan begitu angkanya membaik.',
      sumberDaya: {
        ready: [
          'glukometer untuk GDS awal dan ulang',
          'akses infus dan dekstrosa 40%',
          'karbohidrat oral saat aman menelan',
          'penelusuran obat yang dibawa keluarga',
        ],
        melaluiJejaring: [
          'rawat dan pantau di penyakit dalam',
          'dekstrosa rumatan',
          'oktreotid bila diperlukan',
        ],
        tidakReady: [
          'observasi ketat berkepanjangan di IGD Sukamaju',
        ],
      },
      kontinuitas:
        'Setelah kembali dari RS, tutup dua celah yang membawanya ke sini: obat diminum tanpa sempat makan dan glibenklamid dosis ganda tak sengaja. Ulangi pemeriksaan GDS dan latih keluarga mengenali fase bingung sebagai tanda awal, bukan menunggu sampai tak sadar.',
      bridgeUkm: {
        judul: 'Obat Diminum, Makan Terlewat',
        ringkasan:
          'Satu kakek tak sadar menandai risiko yang dipegang pasien lain: glibenklamid pada lanjut usia, aturan minum yang bergantung jadwal makan, dan dosis ganda tanpa sengaja; kumpulkan data pemakainya, perbaiki penjelasan saat obat diserahkan, dan tengok pasien lanjut usia yang jadwal makannya tak teratur.',
      },
    },
    nama: 'Hipoglikemia Berat',
    icd10: 'E16.2',
    skdi: '4A',
    pembuka:
      'Seorang kakek diantar keluarga dalam kondisi bingung lalu tak sadar. ' +
      '"Dia diabetes, Dok, tadi sudah minum obat tapi belum sempat makan." Kulitnya dingin berkeringat.',
    demografi: { usiaMin: 50, usiaMax: 75 },
    vitalAwal: { td: '110/70', nadi: 96, rr: 18, spo2: 97, gds: 38 },
    stabilitasAwal: 55,
    // Hipoglikemia SULFONILUREA (glibenklamid dosis ganda) berisiko kambuh
    // berjam-jam → butuh observasi ketat berkepanjangan / infus dekstrosa yang
    // melampaui kapasitas IGD FKTP dasar → RUJUK untuk rawat & pantau (bukan pulang).
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'penyakit_dalam',
    clue: 'Trias Whipple + GDS <70 pada pengguna OAD/insulin = hipoglikemia. Tak sadar → DEKSTROSA IV (D40% bolus), bukan oral (risiko aspirasi). Cek ulang GDS, cari pencetus. Hipoglikemia karena SULFONILUREA kerja panjang bisa kambuh berjam-jam → JANGAN dipulangkan cepat; rujuk untuk observasi ketat/rawat (dekstrosa rumatan ± oktreotid di RS).',
    langkah: [
      {
        id: 'h1',
        narasi: 'Pasien tidak sadar, GDS 38 mg/dL. Tindakan pertama?',
        pilihan: [
          { id: 'a', label: 'Pasang infus, beri dekstrosa 40% IV bolus', benar: true, efekStabilitas: 25, respons: 'Tepat — pasien tak sadar butuh glukosa IV. Oral berisiko aspirasi.' },
          { id: 'b', label: 'Beri air gula/teh manis lewat mulut', benar: false, efekStabilitas: -30, respons: 'BERBAHAYA — pasien tak sadar bisa tersedak/aspirasi. Glukosa harus IV.' },
          { id: 'c', label: 'Beri insulin karena dia pasien diabetes', benar: false, efekStabilitas: -30, respons: 'FATAL — GDS-nya 38, sudah terlalu rendah. Insulin akan membunuhnya. Selalu cek GDS dulu.' },
        ],
      },
      {
        id: 'h2',
        narasi: 'Pasien mulai membuka mata, GDS ulang 95 mg/dL.',
        pilihan: [
          { id: 'a', label: 'Beri makan karbohidrat + cek pencetus & jenis obatnya', benar: true, efekStabilitas: 20, respons: 'Tepat — cegah rebound, cari akar masalah. Tanya obat: sulfonilurea (glibenklamid) berisiko hipoglikemia lama.' },
          { id: 'b', label: 'Sudah sadar, langsung pulangkan', benar: false, efekStabilitas: -18, respons: 'Belum aman — cek dulu jenis obat & pencetus, risiko turun lagi.' },
        ],
      },
      {
        id: 'h3',
        narasi: 'Keluarga menunjukkan obatnya: glibenklamid (sulfonilurea) dosis ganda tak sengaja.',
        pilihan: [
          { id: 'a', label: 'Rujuk untuk observasi ketat + pantau GDS berkala (sulfonilurea kerja panjang)', benar: true, efekStabilitas: 15, respons: 'Tepat — hipoglikemia karena sulfonilurea bisa berulang berjam-jam; observasi ketat/rawat melampaui kapasitas IGD FKTP dasar → rujuk, jangan dipulangkan cepat.' },
          { id: 'b', label: 'GDS sudah normal, pulangkan segera', benar: false, efekStabilitas: -20, respons: 'Bahaya — sulfonilurea kerja panjang; hipoglikemia bisa kambuh setelah pulang. Butuh observasi ketat/rujuk, bukan pulang.' },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_dengue_syok',
    // Audit CODEX beta.16 (2026-08-06): debrief ditambahkan. Enam kasus IGD
    // baseline tak punya lapisan ini sama sekali, dan invariant lama hanya
    // melintasi 14 kasus teradjudikasi sehingga tak ada yang memerah. Diukur
    // per mode, defisitnya paling tajam justru di mode yang DINILAI: pool
    // Ujian 5 dari 5 kasus kosong. Tiap kalimat di bawah ditelusuri ke isi
    // kasus ini sendiri (clue, panduanResmi, label & respons tiap langkah,
    // disposisi, spesialis rujukan) — tak ada fakta klinis baru yang ditambah.
    debrief: {
      poinKunci: [
        'Demam yang turun di hari kelima bukan tanda sembuh; akral dingin dan nadi cepat-lemah menandai fase kritis.',
        'Tekanan darah yang masih terukur dengan tekanan nadi menyempit berarti syok terkompensasi: kristaloid 5-10 mL/kgBB/jam, bukan bolus cepat.',
        'Nyeri dan demam pada dengue hanya diatasi parasetamol; ibuprofen atau asam mefenamat menambah risiko perdarahan.',
        'Perfusi yang membaik bukan izin pulang; syok dengue dirujuk ke rawat anak dengan cairan berjalan dan pemantauan.',
      ],
      realitaFktp:
        'Sukamaju mampu memasang infus, menjalankan kristaloid RL atau NaCl 0,9% dengan laju terukur, dan memberi parasetamol. Penilaian ulang tekanan nadi, perfusi, dan diuresis memandu titrasi laju turun agar pasien tidak berpindah ke kelebihan cairan dan edema paru. Pemantauan hematokrit berkala dan perawatan fase kritis ada di rumah sakit.',
      sumberDaya: {
        ready: [
          'infus dan kristaloid RL atau NaCl 0,9%',
          'parasetamol',
          'pemantauan tekanan nadi, perfusi, dan diuresis',
          'rujukan dengan cairan berjalan',
        ],
        melaluiJejaring: [
          'rawat inap anak di rumah sakit',
          'pemantauan hematokrit berkala',
          'transfusi bila ada perdarahan bermakna',
        ],
      },
      kontinuitas:
        'Setelah kembali dari rumah sakit, nilai pemulihan tenaga dan tanda perdarahan. Pastikan keluarga tahu demam berikutnya cukup parasetamol, bukan ibuprofen atau asam mefenamat. Ajarkan satu tanda untuk kembali segera: demam turun tetapi tangan dingin dan badan lemas.',
      bridgeUkm: {
        judul: 'Saat Demam Turun, Bahaya Justru Mulai',
        ringkasan:
          'Pasien ini digotong justru ketika demamnya turun dan ia merasa sudah enakan. Pesan fase kritis harus sampai ke keluarga sebelum demam turun, bukan sesudah pasien lemas. Di sisi Puskesmas: stok kristaloid, disiplin laju cairan dan penilaian ulang, serta kecepatan rujukan ke rawat anak.',
      },
    },
    nama: 'Sindrom Syok Dengue (DSS)',
    icd10: 'A91',
    skdi: '4A',
    pembuka:
      'Seorang remaja lemas digotong, demam hari ke-5 yang tadi turun tapi kini tangannya dingin. ' +
      '"Tadinya sudah enakan, Dok, kok malah lemas begini?" Nadinya cepat dan lemah.',
    // Fix CODEX-25 #25: usiaMax dulu 25 (dewasa) padahal narasi "remaja" &
    // rujukan ke spesialis ANAK — pasien 25 th ke Sp.A tidak koheren. Dipersempit
    // ke rentang remaja (≤17) agar internal-konsisten dgn disposisi 'anak'.
    demografi: { usiaMin: 8, usiaMax: 17 },
    vitalAwal: { td: '90/80', nadi: 128, rr: 24, spo2: 96, suhu: 37.2 },
    stabilitasAwal: 48,
    disposisiBenar: 'rujuk',
    spesialisRujukan: 'anak',
    // Fix M1/#6b (triase DeepThink 2026-07-11): TD 90/80 = tekanan nadi 10mmHg
    // (≤20mmHg) MASIH TERUKUR → syok TERKOMPENSATA, bukan dekompensata. Bolus
    // cepat 10-20mL/kg/<30menit direservasi utk syok dekompensata (TD tak
    // terukur) — dipakai pd syok terkompensata berisiko fluid overload/edema
    // paru (algoritme laju WHO Dengue 2009/PAPDI Protokol 5; WHO 2025
    // menegaskan kristaloid, individualisasi, dan reassessment ketat).
    clue: 'Fase kritis dengue (demam turun H4-6 + akral dingin, nadi cepat-lemah, tekanan nadi ≤20 mmHg, TD MASIH TERUKUR) = DSS TERKOMPENSASI. RESUSITASI: kristaloid RL/NaCl 0,9% 5-10 mL/kgBB/JAM selama 1 jam, bukan bolus cepat; 10-20 mL/kg/15-30 menit dicadangkan untuk syok DEKOMPENSATA/TD tak terukur. Evaluasi ulang perfusi, tekanan nadi, diuresis, hematokrit, dan tanda kelebihan cairan lalu titrasi turun. Angka laju mengikuti algoritme WHO Dengue 2009/PAPDI Protokol 5; WHO Arboviral Clinical Management 2025 memperbarui payung buktinya dengan pilihan kristaloid dan terapi cairan yang diindividualisasi serta dipantau sering. Hindari NSAID/aspirin.',
    langkah: [
      {
        id: 'd1',
        narasi: 'Akral dingin, tekanan nadi menyempit (90/80), CRT >3 detik. Tindakan pertama?',
        pilihan: [
          { id: 'a', label: 'Pasang infus, kristaloid 5-10 mL/kgBB/jam (infus 1 jam) — syok terkompensasi', benar: true, efekStabilitas: 25, respons: 'Tepat — DSS TERKOMPENSASI (TD 90/80 masih terukur, nadi teraba meski lemah) ditangani infus kristaloid 5-10 mL/kgBB/jam, BUKAN bolus cepat. Bolus 10-20 mL/kg dalam <30 menit dicadangkan untuk syok DEKOMPENSATA (TD tak terukur); penggunaan berlebihan berisiko kelebihan cairan dan edema paru.' },
          { id: 'b', label: 'Beri antibiotik IV untuk infeksinya', benar: false, efekStabilitas: -22, respons: 'Dengue adalah virus — antibiotik tidak berguna & menunda resusitasi cairan yang vital.' },
          { id: 'c', label: 'Beri transfusi darah segera', benar: false, efekStabilitas: -18, respons: 'Belum tentu perlu darah dulu; masalah utama adalah kebocoran plasma → butuh kristaloid. Transfusi hanya bila perdarahan bermakna.' },
        ],
      },
      {
        id: 'd2',
        // Fix #21 (audit CODEX 2026-07-11): d1 sudah dikoreksi ke infus 5-10
        // mL/kgBB/jam (BUKAN bolus) — narasi ini masih menyebut "bolus" &
        // berkontradiksi langsung dgn tindakan d1 yang sekarang diajarkan.
        narasi: 'Setelah infus kristaloid berjalan, nadi mulai teraba lebih kuat. Pasien mengeluh nyeri kepala hebat.',
        pilihan: [
          { id: 'a', label: 'Parasetamol untuk nyeri/demam, lanjut pantau tanda vital & tetesan', benar: true, efekStabilitas: 18, respons: 'Tepat — hanya parasetamol yang aman pada dengue; lanjutkan infus kristaloid dgn evaluasi berkala (TD/nadi/perfusi), turunkan laju bertahap sesuai perbaikan — jangan pertahankan laju awal terus-menerus.' },
          { id: 'b', label: 'Beri ibuprofen/asam mefenamat untuk nyerinya', benar: false, efekStabilitas: -25, respons: 'BERBAHAYA — NSAID meningkatkan risiko perdarahan pada dengue. Hanya parasetamol.' },
        ],
      },
      {
        id: 'd3',
        narasi: 'Perfusi membaik tapi ini fase kritis dengue dengan syok. Langkah akhir?',
        pilihan: [
          { id: 'a', label: 'Rujuk ke RS (anak) dengan cairan berjalan & pemantauan', benar: true, efekStabilitas: 15, respons: 'Tepat — DSS wajib dirawat di RS; fase kritis butuh pemantauan hematokrit & cairan ketat.' },
          { id: 'b', label: 'Sudah membaik, rawat jalan dengan banyak minum', benar: false, efekStabilitas: -25, respons: 'DSS adalah kegawatan — kebocoran plasma bisa berlanjut. Wajib rawat inap/rujuk.' },
        ],
      },
    ],
  },
])
