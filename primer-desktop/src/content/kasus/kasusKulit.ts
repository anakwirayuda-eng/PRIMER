/**
 * KASUS KULIT — Batch Dermatologi (10 kasus SKDI 4A, semua tuntas di FKTP).
 *
 * Ditulis terhadap kontrak `KasusKlinis` (src/content/types.ts). Semua id obat/lab/
 * edukasi/tindakan memakai palet kanonik M3_CONTENT_SPEC. Akurasi klinis mengikuti
 * guideline nasional (PPK Perdoski/Kemenkes/PNPK/WHO/CDC) — lihat tiap `clue` &
 * `obatSalahUmum`.
 *
 * Poin ajar pilar dermatologi:
 *  - Tinea → ANTIJAMUR, bukan steroid tunggal. Betametason tanpa antijamur menyamarkan
 *    lesi (tinea inkognito) dan memperluas infeksi.
 *  - Herpes zoster → asiklovir HARUS dalam 72 jam onset ruam untuk memangkas nyeri &
 *    neuralgia pascaherpetik.
 *  - Pedikulosis/skabies → skabisida/pedikulisida topikal + OBATI KONTAK serumah/
 *    seasrama serentak + cuci seprai-handuk air panas.
 *  - Pemeriksaan kulit deskriptif (efloresensi: makula, papul, vesikel, pustul, plak,
 *    skuama, krusta, ekskoriasi, likenifikasi).
 *
 * Prefiks id kategori: `kulit_` — tidak bentrok dengan kasus lama (skabies di
 * kasusInfeksi memakai id 'skabies'; kasus kulit di sini memakai prefiks 'kulit_').
 */

import type { KasusKlinis } from '../types'

export const KASUS_KULIT: KasusKlinis[] = [
  /* ======================================================================
   * 1. Dermatitis Kontak Alergi — sabun/detergen/nikel
   * Poin ajar: identifikasi & HINDARI alergen adalah terapi utama; steroid topikal
   * potensi ringan-sedang + antihistamin. Antibiotik hanya bila ada infeksi sekunder.
   * ==================================================================== */
  {
    id: 'kulit_dermatitis_kontak',
    nama: 'Dermatitis Kontak Alergi',
    icd10: 'L23.9',
    skdi: '4A',
    kategori: 'kulit',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Kulit tangan saya gatal, merah, dan mengelupas dok, sudah beberapa hari.',
    demografi: { usiaMin: 18, usiaMax: 55 },
    vital: { td: '120/80', nadi: 78, rr: 18, suhu: 36.6 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan kulitnya bagaimana dan di mana?',
        jawab: 'Gatal dan merah dok di punggung tangan, kulitnya jadi kasar dan mengelupas.',
        variasi: {
          polos: 'Gatel abang dok neng gègèré tangan, kulité dadi kaya kelupas.',
          terpelajar: 'Timbul plak eritematosa gatal dok di dorsum manus, disertai skuama dan sedikit erosi.',
          cemas: 'Merah dan gatal terus dok, saya takut ini penyakit kulit menular yang parah.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_pencetus',
        kategori: 'rps',
        tanya: 'Sebelum muncul, tangannya kena bahan apa? Sabun, detergen, karet, atau logam?',
        jawab: 'Saya baru ganti sabun cuci piring dok, sejak itu tangan mulai gatal dan merah.',
        variasi: {
          terpelajar: 'Sepertinya kontaktan detergen baru dok, reaksi timbul setelah beberapa hari pemakaian berulang.',
        },
        esensial: true,
        oldcarts: ['agravasi', 'onset'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa lama dan apakah membaik saat tidak kena bahan itu?',
        jawab: 'Sekitar lima hari dok. Pas libur nggak nyuci, agak reda; begitu nyuci lagi kambuh.',
        esensial: true,
        oldcarts: ['durasi', 'agravasi'],
      },
      {
        id: 'q_batas',
        kategori: 'rps',
        tanya: 'Merahnya cuma di area yang kena bahan, atau menyebar ke seluruh badan?',
        jawab: 'Cuma di tangan yang kena air cucian dok, badan lain nggak.',
        esensial: true,
        oldcarts: ['lokasi', 'penyerta'],
      },
      {
        id: 'q_atopi',
        kategori: 'rpd',
        tanya: 'Ada riwayat alergi, asma, biduran, atau eksim sebelumnya?',
        jawab: 'Dulu waktu kecil suka biduran dok kalau makan udang.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kerja',
        kategori: 'sosial',
        tanya: 'Pekerjaannya apa? Sering kontak dengan bahan kimia atau basah-basahan?',
        jawab: 'Ibu rumah tangga dok, tiap hari nyuci piring dan baju.',
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada anggota keluarga yang tertular keluhan serupa?',
        jawab: 'Nggak ada dok, cuma saya sendiri.',
      },
      // distraktor: golongan darah tidak relevan untuk dermatitis kontak.
      {
        id: 'q_goldar',
        kategori: 'sosial',
        tanya: 'Golongan darahnya apa Bu?',
        jawab: 'B dok. Kenapa ya?',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'kulit', temuan: 'Plak eritematosa berbatas relatif tegas di dorsum manus bilateral, skuama halus (+), ekskoriasi bekas garukan (+), sesuai area kontak. Tidak ada pus.', relevan: true },
      { region: 'ekstremitas', temuan: 'Lesi terbatas pada tangan; kulit lengan atas dan tubuh lain tenang. Tidak ada edema deformitas sendi.', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, tampak sehat, tanda vital normal, tidak febris.', relevan: true },
      { region: 'kepala_leher', temuan: 'KGB tidak membesar.', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, wheezing -/-.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Dalam batas normal — dermatitis kontak adalah diagnosis klinis, tidak butuh darah rutin.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['L23.9', 'L24.9', 'L20.9'],
    tatalaksana: {
      obatBenar: ['hidrokortison_krim', 'cetirizine_10'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Dermatitis kontak adalah reaksi inflamasi alergi, bukan infeksi bakteri. Antibiotik hanya diberikan bila jelas ada infeksi sekunder (pus, krusta madu).' },
        { id: 'ketokonazol_krim', alasan: 'Bukan jamur — antijamur tidak berefek pada dermatitis kontak. Terapinya kortikosteroid topikal + hindari alergen.' },
      ],
      edukasi: ['hindari_alergen', 'jaga_kelembapan_kulit', 'kebersihan_kulit'],
    },
    clue: 'Dermatitis kontak alergi: lesi terbatas pada AREA KONTAK, membaik saat kontaktan dihindari. Terapi utama = IDENTIFIKASI & HINDARI ALERGEN (mis. sarung tangan saat mencuci) + kortikosteroid topikal potensi ringan-sedang (hidrokortison) + antihistamin untuk gatal (PPK Perdoski).',
    konsekuensi: {
      narasi: 'Bila alergen terus terpapar, lesi menahun menjadi likenifikasi (kulit menebal, bergaris) dan mudah terinfeksi sekunder akibat garukan.',
      kembaliHariMin: 7,
      kembaliHariMax: 14,
      kondisiKembali: 'Pasien kembali dengan kulit tangan menebal, pecah-pecah, dan sebagian bernanah karena tetap mencuci tanpa pelindung.',
      guideline: 'PPK Perdoski / Panduan Praktik Klinis Dokter FKTP — dermatitis kontak: hindari kontaktan + kortikosteroid topikal.',
    },
  },

  /* ======================================================================
   * 2. Tinea Korporis — PILAR PENGAJARAN: antijamur, BUKAN steroid tunggal
   * Poin ajar: plak anular tepi aktif + central healing. Betametason tanpa antijamur
   * → tinea inkognito (lesi meluas & menyamar). Antijamur topikal/oral yang benar.
   * ==================================================================== */
  {
    id: 'kulit_tinea_korporis',
    nama: 'Tinea Korporis (Kurap Badan)',
    icd10: 'B35.4',
    skdi: '4A',
    kategori: 'kulit',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Ada bercak gatal melingkar di pinggang saya dok, makin lama makin melebar.',
    demografi: { usiaMin: 15, usiaMax: 50 },
    vital: { td: '118/76', nadi: 80, rr: 18, suhu: 36.7 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Bercaknya seperti apa dan di mana?',
        jawab: 'Bulat melingkar dok di pinggang dan perut, gatal, pinggirnya kemerahan dan bersisik, tengahnya agak bersih.',
        variasi: {
          polos: 'Bunder kaya cincin dok neng bangkèkan, gatel, pinggiré abang mrintili.',
          terpelajar: 'Lesi anular dok, tepi aktif eritematosa berskuama dengan central clearing, meluas sentrifugal.',
          cemas: 'Makin lebar terus dok bercaknya, saya takut ini menyebar ke seluruh badan.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_meluas',
        kategori: 'keluhan_utama',
        tanya: 'Bercaknya melebar dari waktu ke waktu?',
        jawab: 'Iya dok, awalnya kecil sekarang selebar koin besar, pinggirnya merambat keluar.',
        esensial: true,
        oldcarts: ['onset', 'karakter'],
      },
      {
        id: 'q_lembap',
        kategori: 'rps',
        tanya: 'Sering berkeringat atau lembap di area itu? Suka pakai baju ketat?',
        jawab: 'Iya dok, saya kerja di luar panas-panasan, baju sering basah keringat seharian.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_obat',
        kategori: 'rpd',
        tanya: 'Sudah diobati sendiri? Pakai krim apa dan hasilnya bagaimana?',
        jawab: 'Saya beli krim di warung dok, katanya buat gatal. Awal reda tapi lalu malah makin lebar dan pinggirnya kabur.',
        variasi: {
          terpelajar: 'Saya sempat pakai krim kombinasi berisi steroid dok — gatal reda sesaat tapi lesi justru meluas dan tepinya menjadi tidak jelas.',
        },
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada keluarga yang gatal serupa, atau kontak dengan kucing/anjing berkurap?',
        jawab: 'Anak saya juga mulai ada bercak di leher dok, di rumah pelihara kucing liar.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_handuk',
        kategori: 'sosial',
        tanya: 'Suka bertukar handuk atau baju dengan orang lain?',
        jawab: 'Kadang handuk gantian sama anak dok.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_dm',
        kategori: 'rpd',
        tanya: 'Ada riwayat kencing manis atau penyakit yang menurunkan daya tahan?',
        jawab: 'Nggak ada dok, sejauh ini sehat.',
      },
      // distraktor: merek sabun tidak menentukan diagnosis tinea.
      {
        id: 'q_sabun',
        kategori: 'sosial',
        tanya: 'Mandi pakai sabun merek apa?',
        jawab: 'Sabun batang biasa dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'kulit', temuan: 'Plak anular berbatas tegas di regio abdomen-lumbal, TEPI AKTIF eritematosa dengan papulovesikel & skuama, bagian tengah lebih tenang (central healing). Diameter ±4 cm, meluas.', relevan: true },
      { region: 'kulit', temuan: 'Pada area bekas krim steroid, tepi lesi menjadi kabur dan lesi lebih luas (gambaran tinea inkognito).', relevan: true },
      { region: 'umum', temuan: 'Tampak sehat, tanda vital normal, tidak febris.', relevan: true },
      { region: 'ekstremitas', temuan: 'Sela jari kaki kering, tidak tampak tinea pedis penyerta.', relevan: false },
      { region: 'kepala_leher', temuan: 'Kulit kepala tenang, tidak ada kerontokan berpola.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Tidak diindikasikan rutin. Bila ragu, kerokan kulit + KOH 10-20% menunjukkan hifa panjang bersepta (pemeriksaan bedside).', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['B35.4', 'L23.9', 'L20.9'],
    tatalaksana: {
      obatBenar: ['ketokonazol_krim', 'griseofulvin_500'],
      obatSalahUmum: [
        { id: 'betametason_krim', alasan: 'JEBAKAN KLASIK: steroid topikal tunggal (betametason) pada tinea menekan radang sesaat TAPI menekan imun lokal → jamur meluas & menyamar (TINEA INKOGNITO), tepi lesi kabur, sulit diobati. Tinea butuh ANTIJAMUR, bukan steroid.' },
        { id: 'hidrokortison_krim', alasan: 'Sama seperti betametason — kortikosteroid tunggal memperparah tinea. Tanpa antijamur, lesi jamur justru berkembang.' },
        { id: 'amoxicillin_500', alasan: 'Tinea disebabkan jamur dermatofita, bukan bakteri — antibiotik tidak berperan.' },
      ],
      edukasi: ['jaga_kelembapan_kulit', 'kebersihan_kulit', 'cuci_seprai_panas'],
    },
    clue: 'Tinea korporis: plak ANULAR, tepi aktif berskuama + central clearing → ANTIJAMUR (ketokonazol/mikonazol topikal 2-4 minggu; griseofulvin oral bila luas/rekalsitran). JANGAN steroid tunggal — betametason tanpa antijamur menimbulkan TINEA INKOGNITO (lesi meluas & menyamar). Jaga area tetap kering (PPK Perdoski).',
    konsekuensi: {
      narasi: 'Pemberian steroid topikal tanpa antijamur menyebabkan tinea inkognito: lesi meluas, tepi menghilang, sulit dikenali dan sembuh. Kelembapan yang tidak dikoreksi memicu kekambuhan berulang.',
      kembaliHariMin: 10,
      kembaliHariMax: 21,
      kondisiKembali: 'Pasien kembali dengan bercak yang jauh lebih luas dan tepi tidak jelas setelah memakai krim steroid; anaknya kini juga terkena.',
      guideline: 'PPK Perdoski / Panduan Praktik Klinis Dokter FKTP — tinea korporis: antijamur, hindari kortikosteroid topikal tunggal.',
    },
  },

  /* ======================================================================
   * 3. Pioderma — Impetigo (krustosa)
   * Poin ajar: krusta madu (honey-colored). Terlokalisir → antibiotik topikal; luas →
   * antibiotik oral anti-Staph (cefadroxil/eritromisin). Higiene + jangan garuk.
   * ==================================================================== */
  {
    id: 'kulit_pioderma_impetigo',
    nama: 'Pioderma — Impetigo Krustosa',
    icd10: 'L01.0',
    skdi: '4A',
    kategori: 'kulit',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Anak saya ada koreng kuning di sekitar hidung dan mulut dok, makin banyak.',
    demografi: { usiaMin: 3, usiaMax: 10 },
    vital: { td: '95/60', nadi: 96, rr: 22, suhu: 37.2 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Kelainan kulitnya bagaimana dan di mana, Bu?',
        jawab: 'Awalnya lenting kecil dok di dekat hidung, pecah lalu jadi koreng kuning seperti madu kering.',
        variasi: {
          wali_anak: 'Di sekitar hidung dan mulut anak saya ada koreng kekuningan dok, awalnya lenting kecil lalu pecah dan menyebar.',
          polos: 'Mbrintili banyu dok cedhak irung, terus pecah dadi korèng kuning.',
          cemas: 'Korengnya nambah terus dok, saya takut menular ke adiknya.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_krusta',
        kategori: 'keluhan_utama',
        tanya: 'Korengnya warna apa? Kuning keemasan seperti madu kering?',
        jawab: 'Iya dok, kuning keemasan, kadang basah lalu mengering jadi kerak.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_gatal',
        kategori: 'rps',
        tanya: 'Terasa gatal? Anaknya suka menggaruk dan menyebar?',
        jawab: 'Gatal dok, dia sering garuk lalu muncul koreng baru di sebelahnya.',
        esensial: true,
        oldcarts: ['karakter', 'agravasi'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Ada demam atau anaknya rewel dan tidak mau makan?',
        jawab: 'Cuma hangat sedikit dok, masih mau main dan makan.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_luka',
        kategori: 'rpd',
        tanya: 'Sebelumnya ada luka, gigitan serangga, atau digaruk-garuk di situ?',
        jawab: 'Ada dok, dia sering ngupil sampai lecet, mungkin dari situ.',
        oldcarts: ['onset'],
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada teman sekolah atau saudara yang koreng serupa?',
        jawab: 'Teman sebangkunya juga ada koreng begitu dok.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_higiene',
        kategori: 'sosial',
        tanya: 'Bagaimana kebiasaan cuci tangan dan mandi anaknya?',
        jawab: 'Kadang lupa cuci tangan dok, main tanah terus langsung makan.',
      },
      // distraktor: golongan darah anak tidak relevan untuk impetigo.
      {
        id: 'q_goldar',
        kategori: 'sosial',
        tanya: 'Golongan darah anaknya apa Bu?',
        jawab: 'Kurang tahu dok, belum pernah dicek.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'kulit', temuan: 'Krusta tebal berwarna kuning keemasan (honey-colored crust) di regio perinasal dan perioral, di atas dasar eritematosa. Beberapa lesi satelit akibat autoinokulasi.', relevan: true },
      { region: 'kepala_leher', temuan: 'KGB submandibular kecil, mobile, tidak nyeri. Tidak ada selulitis meluas.', relevan: true },
      { region: 'umum', temuan: 'Anak aktif, compos mentis, subfebris. Tidak tampak toksik.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, tidak ada gangguan napas.', relevan: false },
      { region: 'abdomen', temuan: 'Supel, bising usus normal.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Leukosit 10.100/µL — batas atas normal, tidak spesifik. Impetigo umumnya diagnosis klinis.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['L01.0', 'B00.9', 'L20.9'],
    tatalaksana: {
      obatBenar: ['gentamisin_krim', 'cefadroxil_500'],
      obatSalahUmum: [
        { id: 'hidrokortison_krim', alasan: 'Impetigo adalah infeksi bakteri (Staphylococcus/Streptococcus). Kortikosteroid menekan imun lokal dan memperburuk infeksi, bukan mengobatinya.' },
        { id: 'ketokonazol_krim', alasan: 'Bukan jamur — krusta madu khas bakteri. Antijamur tidak berefek.' },
      ],
      edukasi: ['kebersihan_kulit', 'cuci_tangan', 'cuci_seprai_panas'],
    },
    clue: 'Impetigo krustosa: KRUSTA MADU (honey-colored) di wajah anak. Terlokalisir → antibiotik topikal (gentamisin/mupirosin); LUAS/multipel → antibiotik oral anti-Staph (cefadroxil; eritromisin bila alergi penisilin). Rendam & lepaskan krusta, potong kuku, cuci tangan (PPK Perdoski/IDAI).',
    konsekuensi: {
      narasi: 'Bila tidak diobati dan digaruk terus, lesi menyebar (autoinokulasi) dan menular ke anak lain; strain nefritogenik Streptococcus berisiko memicu glomerulonefritis akut pascastreptokokus.',
      kembaliHariMin: 5,
      kembaliHariMax: 14,
      kondisiKembali: 'Anak kembali dengan lesi bertambah banyak, dan sebulan kemudian sempat bengkak kelopak mata serta kencing kemerahan (curiga GNAPS).',
      guideline: 'PPK Perdoski / IDAI — impetigo: antibiotik anti-Staph + higiene, waspadai komplikasi GNAPS.',
    },
  },

  /* ======================================================================
   * 4. Urtikaria Akut
   * Poin ajar: wheal (biduran) yang berpindah <24 jam. Antihistamin lini pertama;
   * hindari pencetus. Angioedema/sesak = tanda bahaya. Steroid oral hanya kasus berat.
   * ==================================================================== */
  {
    id: 'kulit_urtikaria_akut',
    nama: 'Urtikaria Akut',
    icd10: 'L50.9',
    skdi: '4A',
    kategori: 'kulit',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Badan saya tiba-tiba bentol-bentol merah gatal dok, timbul tenggelam pindah-pindah.',
    demografi: { usiaMin: 15, usiaMax: 50 },
    vital: { td: '120/80', nadi: 88, rr: 18, suhu: 36.6 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Bentolnya seperti apa dan gatalnya bagaimana?',
        jawab: 'Bentol merah menonjol dok, gatal sekali, timbul di satu tempat lalu hilang, muncul lagi di tempat lain.',
        variasi: {
          polos: 'Bèntol-bèntol abang dok, gatel banget, mumbul-mumbul pindah-pindah.',
          terpelajar: 'Muncul wheal eritematosa gatal dok, evanescent — tiap lesi hilang dalam beberapa jam lalu timbul di lokasi lain.',
          cemas: 'Bentolnya nyebar cepet banget dok, saya takut ini alergi berat.',
        },
        esensial: true,
        oldcarts: ['karakter', 'lokasi'],
      },
      {
        id: 'q_pindah',
        kategori: 'keluhan_utama',
        tanya: 'Tiap bentol bertahan berapa lama? Kurang dari sehari lalu hilang?',
        jawab: 'Iya dok, satu bentol paling beberapa jam lalu hilang tanpa bekas, tapi muncul lagi di lain tempat.',
        esensial: true,
        oldcarts: ['durasi', 'waktu'],
      },
      {
        id: 'q_pencetus',
        kategori: 'rps',
        tanya: 'Sebelum muncul, ada makan sesuatu, minum obat baru, atau digigit serangga?',
        jawab: 'Tadi siang saya makan udang dok, biasanya nggak apa-apa tapi kali ini banyak.',
        esensial: true,
        oldcarts: ['onset', 'agravasi'],
      },
      {
        id: 'q_sesak',
        kategori: 'rps',
        tanya: 'Ada bengkak di bibir/kelopak mata, sesak napas, atau suara serak?',
        jawab: 'Nggak ada dok, cuma bentol dan gatal saja, napas biasa.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_obat',
        kategori: 'rpd',
        tanya: 'Sedang minum obat apa? Pernah alergi obat sebelumnya?',
        jawab: 'Nggak ada dok, nggak sedang minum obat.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah begini sebelumnya? Ada asma atau alergi lain?',
        jawab: 'Dulu pernah sekali dok setelah makan seafood, sembuh sendiri.',
      },
      {
        id: 'q_stres',
        kategori: 'sosial',
        tanya: 'Belakangan sedang kelelahan atau banyak pikiran?',
        jawab: 'Lumayan capek dok belakangan ini.',
      },
      // distraktor: hobi olahraga tidak relevan untuk urtikaria akut.
      {
        id: 'q_olahraga',
        kategori: 'sosial',
        tanya: 'Rutin berolahraga tidak?',
        jawab: 'Kadang-kadang jogging dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'kulit', temuan: 'Urtika (wheal) multipel: papul-plak edematosa eritematosa dengan halo pucat di sentral, tersebar di badan dan lengan, berbatas tegas. Dermografisme (+).', relevan: true },
      { region: 'tht_mulut', temuan: 'Bibir dan lidah TIDAK bengkak, orofaring paten, tidak ada stridor — tidak ada angioedema.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, wheezing -/-. Tidak ada sesak — menyingkirkan anafilaksis.', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, hemodinamik stabil, tidak tampak sesak/syok.', relevan: true },
      { region: 'abdomen', temuan: 'Supel, nyeri tekan (-).', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Tidak diindikasikan pada urtikaria akut tunggal — diagnosis klinis.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['L50.9', 'L50.0', 'T78.3'],
    tatalaksana: {
      obatBenar: ['cetirizine_10', 'loratadin_10'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Urtikaria akut umumnya reaksi hipersensitivitas (mis. makanan), bukan infeksi. Antibiotik tidak berperan dan justru bisa menjadi pencetus alergi baru.' },
        { id: 'prednison_5', alasan: 'Kortikosteroid oral BUKAN lini pertama urtikaria akut ringan; cukup antihistamin H1 non-sedatif. Steroid hanya untuk kasus berat/refrakter jangka pendek.' },
      ],
      edukasi: ['hindari_alergen', 'tanda_bahaya'],
    },
    clue: 'Urtikaria akut: WHEAL yang berpindah & hilang <24 jam tanpa bekas → antihistamin H1 non-sedatif (cetirizine/loratadin) lini pertama. Cari & hindari pencetus. TANDA BAHAYA: angioedema bibir/lidah, sesak, suara serak = anafilaksis → tata darurat (adrenalin IM) & rujuk (PPK Perdoski/WAO).',
    konsekuensi: {
      narasi: 'Bila pencetus (mis. seafood) tidak dihindari dan tanda bahaya tidak diedukasi, paparan ulang bisa memicu angioedema laring/anafilaksis yang mengancam jalan napas.',
      kembaliHariMin: 1,
      kembaliHariMax: 5,
      kondisiKembali: 'Pasien kembali dalam kondisi bengkak bibir, sulit menelan, dan sesak setelah kembali makan udang tanpa waspada.',
      guideline: 'PPK Perdoski / EAACI-WAO Urticaria Guideline — antihistamin H1, hindari pencetus, kenali anafilaksis.',
    },
  },

  /* ======================================================================
   * 5. Herpes Zoster — PILAR PENGAJARAN: asiklovir dalam 72 jam
   * Poin ajar: vesikel bergerombol UNILATERAL dermatomal + nyeri. Asiklovir efektif
   * bila mulai <72 jam onset ruam untuk kurangi nyeri & neuralgia pascaherpetik.
   * ==================================================================== */
  {
    id: 'kulit_herpes_zoster',
    nama: 'Herpes Zoster',
    icd10: 'B02.9',
    skdi: '4A',
    kategori: 'kulit',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Muncul lenting-lenting berair yang nyeri sekali di satu sisi pinggang saya dok.',
    demografi: { usiaMin: 45, usiaMax: 70 },
    vital: { td: '130/80', nadi: 84, rr: 18, suhu: 37.3 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhannya bagaimana dan di mana?',
        jawab: 'Ada gerombolan lenting berair dok di pinggang kanan, hanya sebelah, nyeri seperti terbakar dan tertusuk.',
        variasi: {
          polos: 'Mbrintili banyu dok neng bangkèkan tengen thok, loro kaya kobong.',
          terpelajar: 'Vesikel bergerombol unilateral dok di dermatom torakal kanan, didahului nyeri neuralgik seperti terbakar.',
          lansia: 'Sakit sekali Nak, nyerinya nyut-nyutan di pinggang kanan, lentingnya bergerombol cuma sebelah.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_onset',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa hari lentingnya muncul?',
        jawab: 'Lentingnya baru dua hari ini dok, tapi nyerinya sudah sejak tiga-empat hari sebelum lenting keluar.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_unilateral',
        kategori: 'rps',
        tanya: 'Lentingnya menyeberang ke sisi tubuh yang lain, atau hanya satu sisi saja?',
        jawab: 'Cuma sebelah kanan dok, seperti mengikuti garis sabuk, nggak menyeberang ke kiri.',
        esensial: true,
        oldcarts: ['lokasi'],
      },
      {
        id: 'q_nyeri',
        kategori: 'rps',
        tanya: 'Nyerinya seperti apa? Terbakar, tertusuk, atau nyut-nyutan?',
        jawab: 'Seperti terbakar dan tertusuk-tusuk dok, kadang kesetrum, sampai kena baju saja perih.',
        esensial: true,
        oldcarts: ['karakter', 'keparahan'],
      },
      {
        id: 'q_cacar',
        kategori: 'rpd',
        tanya: 'Dulu pernah kena cacar air waktu kecil?',
        jawab: 'Pernah dok waktu SD, cacar air.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_imun',
        kategori: 'rpd',
        tanya: 'Ada kencing manis, sedang lemah daya tahan, atau kelelahan berat belakangan?',
        jawab: 'Ada kencing manis dok, dan belakangan capek karena banyak kerjaan.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_mata',
        kategori: 'rps',
        tanya: 'Lentingnya ada di dekat mata, dahi, atau ujung hidung?',
        jawab: 'Nggak dok, cuma di pinggang, wajah bersih.',
        oldcarts: ['lokasi'],
      },
      // distraktor: kebiasaan minum kopi tidak relevan untuk herpes zoster.
      {
        id: 'q_kopi',
        kategori: 'sosial',
        tanya: 'Suka minum kopi tiap hari?',
        jawab: 'Iya dok, sehari dua gelas.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'kulit', temuan: 'Vesikel bergerombol di atas dasar eritematosa, tersusun UNILATERAL mengikuti dermatom torakal (T10) kanan, TIDAK melewati garis tengah tubuh. Beberapa vesikel mulai keruh/pustular.', relevan: true },
      { region: 'neurologis', temuan: 'Hiperestesi/alodinia pada dermatom terlibat — sentuhan ringan terasa nyeri. Kekuatan motorik normal.', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, subfebris, tampak menahan nyeri.', relevan: true },
      { region: 'mata', temuan: 'Mata dan dahi bersih, tidak ada lesi di ujung hidung (Hutchinson sign negatif) — bukan zoster oftalmikus.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Tidak rutin diperlukan — herpes zoster adalah diagnosis klinis. Bila perlu skrining, GDS dapat dicek karena pasien DM.', flag: 'normal', relevan: false },
      { id: 'gds', hasil: 'GDS 210 mg/dL — hiperglikemia, faktor imunosupresi relatif.', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['B02.9', 'B00.9', 'L23.9'],
    tatalaksana: {
      obatBenar: ['asiklovir_400', 'paracetamol_500'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Herpes zoster disebabkan reaktivasi virus Varicella-zoster, bukan bakteri. Antibiotik hanya bila ada infeksi sekunder pada vesikel yang pecah.' },
        { id: 'betametason_krim', alasan: 'Kortikosteroid topikal tidak mengatasi virus dan bisa memperluas lesi; terapi utama adalah antivirus sistemik dini + analgesik.' },
      ],
      edukasi: ['kepatuhan_obat', 'kebersihan_kulit', 'tanda_bahaya'],
    },
    clue: 'Herpes zoster: vesikel bergerombol UNILATERAL dermatomal + nyeri neuralgik. ASIKLOVIR HARUS dimulai <72 JAM sejak ruam (asiklovir 5×800 mg/hari 7 hari; sediaan 400 mg → 2 tablet per dosis) untuk memangkas durasi & risiko NEURALGIA PASCAHERPETIK. Analgesik adekuat. Waspadai zoster oftalmikus (rujuk mata) (PPK Perdoski/CDC).',
    konsekuensi: {
      narasi: 'Bila antivirus terlambat (>72 jam) atau tidak diberikan, risiko neuralgia pascaherpetik (nyeri menahun berbulan-bulan) meningkat tajam, terutama pada lansia & pasien DM.',
      kembaliHariMin: 14,
      kembaliHariMax: 60,
      kondisiKembali: 'Ruam sudah mengering tetapi pasien kembali mengeluh nyeri terbakar hebat menetap di bekas lesi (neuralgia pascaherpetik) yang mengganggu tidur.',
      guideline: 'PPK Perdoski / CDC Shingles — antivirus dalam 72 jam untuk cegah neuralgia pascaherpetik.',
    },
  },

  /* ======================================================================
   * 6. Varisela (Cacar Air)
   * Poin ajar: lesi POLIMORF (macam-macam stadium sekaligus) sentripetal. Simtomatik;
   * asiklovir untuk remaja/dewasa/imunokompromais dalam 24-72 jam. Jaga jangan digaruk.
   * ==================================================================== */
  {
    id: 'kulit_varisela',
    nama: 'Varisela (Cacar Air)',
    icd10: 'B01.9',
    skdi: '4A',
    kategori: 'kulit',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Muncul lenting-lenting berair menyebar di seluruh badan saya dok, disertai demam.',
    demografi: { usiaMin: 12, usiaMax: 30 },
    vital: { td: '115/75', nadi: 90, rr: 18, suhu: 38.2 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhannya bagaimana dan mulai dari mana?',
        jawab: 'Awalnya demam dan badan pegal dok, lalu muncul lenting berair mulai dari badan, menyebar ke wajah dan lengan.',
        variasi: {
          polos: 'Panas dhisik dok, terus mbrintili banyu wiwit awak, nyebar tekan rainé.',
          terpelajar: 'Didahului demam dan malaise dok, lalu erupsi vesikel dimulai dari badan (sentripetal), menyebar sentrifugal.',
          cemas: 'Lentingnya cepat sekali menyebar dok, saya takut ini berbahaya dan menular ke keluarga.',
        },
        esensial: true,
        oldcarts: ['onset', 'lokasi'],
      },
      {
        id: 'q_polimorf',
        kategori: 'keluhan_utama',
        tanya: 'Lentingnya seragam atau bermacam-macam — ada yang masih merah, berair, dan sudah mengering bersamaan?',
        jawab: 'Macam-macam dok, ada yang masih bintik merah, ada yang berair, ada yang sudah jadi koreng, campur aduk.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Demamnya sejak kapan dan seberapa tinggi?',
        jawab: 'Demam dua hari sebelum lenting keluar dok, lumayan tinggi disertai badan lemas.',
        esensial: true,
        oldcarts: ['onset', 'keparahan'],
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada teman atau keluarga yang baru kena cacar air?',
        jawab: 'Teman kos saya dua minggu lalu kena cacar air dok.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Dulu pernah kena cacar air atau sudah divaksin varisela?',
        jawab: 'Setahu saya belum pernah dok, dan belum divaksin.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_sesak',
        kategori: 'rps',
        tanya: 'Ada sesak napas, batuk berat, atau nyeri dada?',
        jawab: 'Nggak ada dok, napas biasa saja.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_hamil',
        kategori: 'sosial',
        tanya: 'Di rumah/kos ada ibu hamil, bayi, atau orang dengan daya tahan lemah?',
        jawab: 'Kebetulan tetangga kamar ada yang sedang hamil dok.',
      },
      // distraktor: merek sabun tidak relevan untuk varisela.
      {
        id: 'q_sabun',
        kategori: 'sosial',
        tanya: 'Pakai sabun mandi merek apa?',
        jawab: 'Sabun cair biasa dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'kulit', temuan: 'Lesi POLIMORF: makula eritematosa, papul, vesikel berdinding tipis "tetesan embun di kelopak mawar" (dewdrop on rose petal), pustul, dan krusta — semua stadium HADIR BERSAMAAN. Distribusi sentral (badan lebih padat).', relevan: true },
      { region: 'tht_mulut', temuan: 'Beberapa erosi/ulkus dangkal di mukosa mulut (enantem).', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, febris, tampak sakit ringan-sedang.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-. Tidak ada tanda pneumonia varisela.', relevan: true },
      { region: 'abdomen', temuan: 'Supel, hepar/lien tidak membesar.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Leukosit normal-cenderung rendah, limfositosis relatif — tidak spesifik. Varisela adalah diagnosis klinis.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['B01.9', 'B02.9', 'L01.0'],
    tatalaksana: {
      obatBenar: ['asiklovir_400', 'paracetamol_500', 'kalamin_losion'],
      obatSalahUmum: [
        { id: 'ibuprofen_400', alasan: 'NSAID (ibuprofen) pada varisela dihindari — dikaitkan dengan peningkatan risiko infeksi kulit invasif (fasiitis nekrotikans) oleh Streptococcus. Antipiretik pilih paracetamol.' },
        { id: 'amoxicillin_500', alasan: 'Varisela adalah infeksi virus; antibiotik hanya bila ada infeksi bakteri sekunder pada lesi yang pecah dan bernanah.' },
      ],
      edukasi: ['istirahat_cukup', 'kebersihan_kulit', 'cuci_tangan', 'tanda_bahaya'],
    },
    clue: 'Varisela: lesi POLIMORF (semua stadium bersamaan) distribusi sentripetal + demam. Asiklovir (5×800 mg/hari 7 hari) bermanfaat pada REMAJA/DEWASA/imunokompromais bila <24-72 jam onset ruam. Simtomatik + kalamin untuk gatal, potong kuku, HINDARI ibuprofen. Isolasi hingga semua lesi berkrusta; jauhi ibu hamil & imunokompromais (PPK Perdoski/CDC).',
    konsekuensi: {
      narasi: 'Digaruk berlebihan menyebabkan infeksi sekunder & jaringan parut; penularan ke ibu hamil dapat menimbulkan varisela kongenital/neonatal yang berat.',
      kembaliHariMin: 3,
      kembaliHariMax: 10,
      kondisiKembali: 'Pasien kembali dengan beberapa lesi bernanah dan meradang akibat garukan (impetiginisasi sekunder).',
      guideline: 'PPK Perdoski / CDC Varicella — asiklovir pada dewasa dini, hindari NSAID, isolasi hingga krusta.',
    },
  },

  /* ======================================================================
   * 7. Kandidiasis Kutis (Intertriginosa)
   * Poin ajar: plak merah lembap di lipatan + lesi SATELIT. Faktor risiko lembap/DM/
   * obesitas. Antijamur topikal + jaga area kering. Bukan indikasi steroid tunggal.
   * ==================================================================== */
  {
    id: 'kulit_kandidiasis_kutis',
    nama: 'Kandidiasis Kutis (Intertriginosa)',
    icd10: 'B37.2',
    skdi: '4A',
    kategori: 'kulit',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Lipatan di bawah payudara dan selangkangan saya merah, gatal, dan perih dok, apalagi kalau basah.',
    demografi: { usiaMin: 35, usiaMax: 65, jenisKelamin: 'P' },
    vital: { td: '130/80', nadi: 82, rr: 18, suhu: 36.8 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhannya bagaimana dan di lipatan mana?',
        jawab: 'Merah dan gatal dok di lipatan bawah payudara dan selangkangan, kadang perih dan basah, ada bau.',
        variasi: {
          polos: 'Abang gatel dok neng lempit-lempit, teles lan mambu.',
          terpelajar: 'Plak eritematosa lembap dok di regio inframama dan inguinal, disertai maserasi dan rasa perih.',
          cemas: 'Makin lama makin lebar dan perih dok, saya jadi risih dan takut ini menular.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_satelit',
        kategori: 'keluhan_utama',
        tanya: 'Di sekitar bercak besar ada bintik-bintik merah kecil yang terpisah?',
        jawab: 'Iya dok, di pinggirnya ada bintik-bintik merah kecil yang berdiri sendiri di luar bercak utama.',
        esensial: true,
        oldcarts: ['karakter', 'lokasi'],
      },
      {
        id: 'q_lembap',
        kategori: 'rps',
        tanya: 'Area lipatannya sering lembap, berkeringat, atau jarang kering sempurna?',
        jawab: 'Iya dok, badan saya gemuk, lipatannya sering basah keringat dan susah kering.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_dm',
        kategori: 'rpd',
        tanya: 'Ada riwayat kencing manis? Sering haus, sering kencing, atau berat badan turun?',
        jawab: 'Ibu saya kencing manis dok, saya sendiri sering haus dan kencing malam hari.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_obat',
        kategori: 'rpd',
        tanya: 'Sedang atau baru minum antibiotik/kortikosteroid jangka panjang?',
        jawab: 'Nggak dok, nggak minum obat apa-apa.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_krim',
        kategori: 'rpd',
        tanya: 'Sudah diobati sendiri? Pakai bedak atau krim apa?',
        jawab: 'Cuma saya kasih bedak biasa dok, tapi nggak sembuh malah makin perih.',
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada anggota keluarga dengan keluhan lipatan serupa?',
        jawab: 'Nggak ada dok.',
      },
      // distraktor: kebiasaan begadang tidak menentukan tata laksana kandidiasis.
      {
        id: 'q_begadang',
        kategori: 'sosial',
        tanya: 'Sering begadang tidak?',
        jawab: 'Kadang-kadang dok kalau ada acara.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'kulit', temuan: 'Plak eritematosa lembap berbatas tegas di lipatan inframama dan inguinal, permukaan maserasi/erosif, dikelilingi PAPUL-PUSTUL SATELIT khas di luar tepi lesi utama. Skuama kolaret halus.', relevan: true },
      { region: 'umum', temuan: 'Habitus obesitas (IMT meningkat), compos mentis, tanda vital normal.', relevan: true },
      { region: 'kulit', temuan: 'Sela jari kaki tidak maserasi berat; tinea pedis tidak dominan.', relevan: false },
      { region: 'abdomen', temuan: 'Supel, tidak ada nyeri tekan.', relevan: false },
      { region: 'ekstremitas', temuan: 'Tidak ada edema tungkai.', relevan: false },
    ],
    lab: [
      { id: 'gds', hasil: 'GDS 245 mg/dL — hiperglikemia; faktor predisposisi kandidiasis, perlu penelusuran DM.', flag: 'tinggi', relevan: true },
      { id: 'darah_rutin', hasil: 'Dalam batas normal. Kerokan + KOH menunjukkan blastospora & pseudohifa (pemeriksaan penunjang bedside).', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['B37.2', 'B35.4', 'L23.9'],
    tatalaksana: {
      obatBenar: ['mikonazol_krim', 'ketokonazol_krim'],
      obatSalahUmum: [
        { id: 'betametason_krim', alasan: 'Steroid topikal tunggal pada kandidiasis meredakan radang sesaat tapi memperluas infeksi jamur (mirip tinea inkognito). Kandidiasis butuh ANTIJAMUR, bukan steroid.' },
        { id: 'amoxicillin_500', alasan: 'Kandidiasis disebabkan jamur Candida, bukan bakteri; antibiotik justru menekan flora normal dan bisa memperburuk pertumbuhan Candida.' },
      ],
      edukasi: ['jaga_kelembapan_kulit', 'kebersihan_kulit', 'diet_dm'],
    },
    clue: 'Kandidiasis intertriginosa: plak merah LEMBAP di lipatan + LESI SATELIT (papulopustul di luar tepi) → antijamur topikal (mikonazol/ketokonazol) + JAGA AREA KERING (tepuk kering, pakaian menyerap). Selidiki faktor predisposisi: DM, obesitas, kelembapan. Cek gula darah (PPK Perdoski).',
    konsekuensi: {
      narasi: 'Bila kelembapan & gula darah tidak dikendalikan, kandidiasis kambuh berulang dan meluas; hiperglikemia yang tak terkelola memperberat infeksi dan komplikasi lain.',
      kembaliHariMin: 10,
      kembaliHariMax: 21,
      kondisiKembali: 'Pasien kembali dengan lesi lipatan yang kambuh dan meluas; pemeriksaan gula darah puasa mengonfirmasi diabetes yang belum tertangani.',
      guideline: 'PPK Perdoski — kandidiasis kutis: antijamur + kendalikan kelembapan & faktor predisposisi (DM).',
    },
  },

  /* ======================================================================
   * 8. Pedikulosis Kapitis (Kutu Kepala) — PILAR: permetrin + kontak + cuci seprai
   * Poin ajar: gatal kulit kepala + telur (nits) melekat erat di batang rambut.
   * Permetrin 1%; OBATI SEMUA KONTAK serumah/kelas serentak + cuci seprai/topi air panas.
   * ==================================================================== */
  {
    id: 'kulit_pedikulosis_kapitis',
    nama: 'Pedikulosis Kapitis (Kutu Kepala)',
    icd10: 'B85.0',
    skdi: '4A',
    kategori: 'kulit',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Anak saya gatal-gatal di kepala terus dok, ada kutu dan telurnya di rambut.',
    demografi: { usiaMin: 5, usiaMax: 12, jenisKelamin: 'P' },
    vital: { td: '100/65', nadi: 88, rr: 20, suhu: 36.6 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan anaknya bagaimana, Bu?',
        jawab: 'Kepalanya gatal terus dok, garuk-garuk sepanjang hari, di rambutnya kelihatan kutu dan telur putih menempel.',
        variasi: {
          wali_anak: 'Anak saya menggaruk kepala terus dok, terutama di belakang telinga dan tengkuk; ada kutu dan telur melekat di rambut.',
          polos: 'Sirahé gatel terus dok, akèh tumané karo lingsané.',
          cemas: 'Gatalnya nggak berhenti dok, saya takut menular ke adiknya dan teman-temannya.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_lokasi',
        kategori: 'keluhan_utama',
        tanya: 'Gatalnya paling terasa di bagian mana kepalanya?',
        jawab: 'Paling gatal di belakang telinga dan tengkuk dok, di situ juga banyak telurnya.',
        esensial: true,
        oldcarts: ['lokasi'],
      },
      {
        id: 'q_nits',
        kategori: 'rps',
        tanya: 'Telur putihnya bisa dikibaskan seperti ketombe, atau melekat erat susah dilepas?',
        jawab: 'Melekat erat dok, susah dilepas, beda dengan ketombe yang gampang rontok.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada teman sekelas atau saudara serumah yang gatal kepala serupa?',
        jawab: 'Teman sekelasnya banyak yang begini dok, dan adiknya di rumah juga mulai garuk-garuk kepala.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_berbagi',
        kategori: 'sosial',
        tanya: 'Suka bertukar sisir, topi, jilbab, atau bantal dengan teman/saudara?',
        jawab: 'Iya dok, sering pinjam-pinjaman sisir dan jepit rambut sama temannya.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_luka',
        kategori: 'rps',
        tanya: 'Ada koreng atau bernanah di kulit kepala karena garukan?',
        jawab: 'Ada sedikit koreng dok di tengkuk bekas garuk, tapi belum bernanah banyak.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Anaknya ada riwayat alergi obat oles atau kulit sensitif?',
        jawab: 'Nggak ada dok setahu saya.',
      },
      // distraktor: prestasi sekolah anak tidak relevan untuk pedikulosis.
      {
        id: 'q_sekolah',
        kategori: 'sosial',
        tanya: 'Bagaimana nilai sekolahnya, Bu?',
        jawab: 'Alhamdulillah bagus dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'kepala_leher', temuan: 'Tampak kutu dewasa (Pediculus humanus capitis) merayap dan telur (nits) putih-keabuan MELEKAT ERAT di batang rambut ±1 cm dari kulit kepala, terbanyak di oksiput & retroaurikular.', relevan: true },
      { region: 'kulit', temuan: 'Ekskoriasi & papul akibat garukan di kulit kepala dan tengkuk; sebagian krusta kecil (impetiginisasi ringan).', relevan: true },
      { region: 'kepala_leher', temuan: 'KGB oksipital & retroaurikular teraba kecil, mobile (reaktif terhadap garukan/infeksi sekunder).', relevan: true },
      { region: 'umum', temuan: 'Anak aktif, tanda vital normal, tidak febris.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, dalam batas normal.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Tidak diindikasikan — pedikulosis adalah diagnosis klinis (visualisasi kutu/nits, dibantu lampu Wood/sisir serit).', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['B85.0', 'L21.0', 'B86'],
    tatalaksana: {
      obatBenar: ['permetrin_krim'],
      obatSalahUmum: [
        { id: 'ketokonazol_krim', alasan: 'Pedikulosis disebabkan kutu (parasit), bukan jamur — antijamur tidak berefek. Butuh pedikulisida (permetrin 1%).' },
        { id: 'hidrokortison_krim', alasan: 'Steroid hanya meredakan gatal sesaat tanpa membunuh kutu; sumber masalah (kutu & telur) tetap ada dan menular.' },
      ],
      edukasi: ['kebersihan_kulit', 'cuci_seprai_panas', 'cuci_tangan'],
    },
    clue: 'Pedikulosis kapitis: gatal kulit kepala + NITS melekat erat di batang rambut (beda dari ketombe). Permetrin 1% dioleskan ke rambut, DIAMKAN lalu bilas, ULANGI 7-10 hari (bunuh nimfa yang menetas). WAJIB: obati SEMUA KONTAK (serumah/sekelas) SERENTAK + sisir serit + rendam sisir/cuci topi-seprai-bantal air PANAS (≥60°C) (PPK Perdoski/CDC).',
    konsekuensi: {
      narasi: 'Bila kontak serumah/sekelas tidak diobati serentak dan barang tidak dibersihkan, terjadi reinfestasi berulang (ping-pong); garukan menimbulkan infeksi sekunder pada kulit kepala.',
      kembaliHariMin: 10,
      kembaliHariMax: 21,
      kondisiKembali: 'Anak kembali dengan gatal berulang karena tertular lagi dari adik dan teman sekelas yang tidak ikut diobati.',
      guideline: 'PPK Perdoski / CDC Head Lice — pedikulisida + obati kontak serentak + dekontaminasi fomites.',
    },
  },

  /* ======================================================================
   * 9. Veruka Vulgaris (Kutil)
   * Poin ajar: papul verukosa hiperkeratotik dgn black dots (kapiler trombosis).
   * Prevalensi rendah di FKTP (fokus kenali & terapi baku). Asam salisilat topikal/
   * bedah minor; banyak swasirna. Bukan indikasi antibiotik.
   * ==================================================================== */
  {
    id: 'kulit_veruka_vulgaris',
    nama: 'Veruka Vulgaris (Kutil)',
    icd10: 'B07',
    skdi: '4A',
    kategori: 'kulit',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'rendah',
    keluhanUtama: 'Ada benjolan kasar seperti kutil di jari tangan saya dok, makin banyak.',
    demografi: { usiaMin: 10, usiaMax: 35 },
    vital: { td: '118/76', nadi: 76, rr: 18, suhu: 36.6 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Benjolannya seperti apa dan di mana?',
        jawab: 'Benjolan kecil kasar dok di punggung jari, permukaannya berkutil-kutil, ada titik-titik hitam kecil di dalamnya.',
        variasi: {
          polos: 'Ana kutil kasar dok neng driji, ndhuwuré kasar ana titik ireng cilik.',
          terpelajar: 'Papul verukosa hiperkeratotik dok dengan bintik hitam (kapiler trombosis) di permukaan, soliter menjadi multipel.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa lama dan bertambah banyak?',
        jawab: 'Beberapa bulan dok, awalnya satu sekarang jadi tiga-empat.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_nyeri',
        kategori: 'rps',
        tanya: 'Terasa nyeri, gatal, atau mudah berdarah kalau tergores?',
        jawab: 'Nggak nyeri dok, cuma mengganggu penampilan, kadang berdarah kalau kena.',
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_gigit',
        kategori: 'sosial',
        tanya: 'Suka menggigit kuku atau mencungkil kutilnya?',
        jawab: 'Iya dok, suka saya cungkil dan gigit-gigit, makin banyak jadinya.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_imun',
        kategori: 'rpd',
        tanya: 'Ada penyakit yang menurunkan daya tahan tubuh, atau sedang minum obat imunosupresan?',
        jawab: 'Nggak ada dok, sehat.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada teman/keluarga yang punya kutil serupa?',
        jawab: 'Teman satu kos ada dok yang punya kutil di tangan.',
      },
      // distraktor: golongan darah tidak relevan untuk veruka.
      {
        id: 'q_goldar',
        kategori: 'sosial',
        tanya: 'Golongan darahnya apa?',
        jawab: 'A dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'kulit', temuan: 'Papul verukosa hiperkeratotik berbatas tegas di dorsum digiti, permukaan kasar, tampak BLACK DOTS (kapiler yang mengalami trombosis) — hilangnya dermatoglifik di atas lesi. Beberapa lesi satelit.', relevan: true },
      { region: 'ekstremitas', temuan: 'Kuku sekitar sedikit rusak akibat kebiasaan menggigit; tidak ada tanda infeksi akut.', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, tampak sehat, tanda vital normal.', relevan: true },
      { region: 'kulit', temuan: 'Telapak kaki tidak tampak veruka plantaris yang nyeri saat berjalan.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Tidak diindikasikan — veruka vulgaris adalah diagnosis klinis.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['B07', 'L82', 'D23.9'],
    tatalaksana: {
      obatBenar: ['asam_salisilat_bedak'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Veruka disebabkan Human Papillomavirus (HPV), bukan bakteri — antibiotik tidak berperan sama sekali.' },
        { id: 'ketokonazol_krim', alasan: 'Bukan jamur — antijamur tidak berefek pada kutil viral. Terapi keratolitik (asam salisilat) atau bedah minor.' },
      ],
      edukasi: ['kebersihan_kulit', 'cuci_tangan'],
    },
    clue: 'Veruka vulgaris (HPV): papul verukosa hiperkeratotik + BLACK DOTS (kapiler trombosis) + hilangnya dermatoglifik. Terapi: keratolitik asam salisilat topikal berulang, krioterapi, atau bedah minor; banyak SWASIRNA dalam 1-2 tahun. Jangan digigit/dicungkil (autoinokulasi). Bukan indikasi antibiotik/antijamur (PPK Perdoski).',
    konsekuensi: {
      narasi: 'Kebiasaan mencungkil & menggigit menyebarkan kutil ke jari lain dan mulut (autoinokulasi); lesi bertambah banyak dan lebih sulit dituntaskan.',
      kembaliHariMin: 21,
      kembaliHariMax: 60,
      kondisiKembali: 'Pasien kembali dengan kutil bertambah banyak di beberapa jari dan sekitar bibir akibat terus digigit.',
      guideline: 'PPK Perdoski — veruka vulgaris: keratolitik/krioterapi/bedah minor, hindari autoinokulasi.',
    },
  },

  /* ======================================================================
   * 10. Morbili (Campak)
   * Poin ajar: trias 3C (cough, coryza, conjunctivitis) + Koplik spots → ruam
   * makulopapular sefalokaudal. Vitamin A DUA DOSIS + suportif. Bukan indikasi
   * antibiotik rutin. Laporkan sebagai penyakit menular (surveilans).
   * ==================================================================== */
  {
    id: 'kulit_morbili',
    nama: 'Morbili (Campak)',
    icd10: 'B05.9',
    skdi: '4A',
    kategori: 'kulit',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Anak saya demam tinggi beberapa hari, mata merah dan batuk-pilek, lalu muncul ruam merah dari wajah dok.',
    demografi: { usiaMin: 1, usiaMax: 8 },
    vital: { td: '95/60', nadi: 110, rr: 26, suhu: 39.0 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Ceritakan urutannya, Bu — demam, gejala lain, lalu ruamnya?',
        jawab: 'Demam tinggi 3-4 hari dok, disertai batuk, pilek, dan mata merah berair. Baru kemarin muncul ruam merah mulai dari belakang telinga dan wajah, lalu turun ke badan.',
        variasi: {
          wali_anak: 'Awalnya demam tinggi dengan batuk, pilek, dan mata merah dok; setelah beberapa hari baru muncul ruam merah dari wajah menyebar ke bawah.',
          polos: 'Panas dhuwur telung dina dok, watuk, pilek, mripaté abang; terus mrentul abang wiwit rainé.',
          cemas: 'Demamnya tinggi banget dok terus keluar ruam, saya takut ini campak yang bahaya.',
        },
        esensial: true,
        oldcarts: ['onset', 'lokasi'],
      },
      {
        id: 'q_3c',
        kategori: 'rps',
        tanya: 'Sebelum ruam, apakah ada batuk, pilek, dan mata merah bersamaan?',
        jawab: 'Iya dok, ketiganya barengan — batuk, hidung meler, dan mata merah berair sebelum ruam keluar.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_arah',
        kategori: 'keluhan_utama',
        tanya: 'Ruamnya muncul dari mana dulu dan menyebar ke arah mana?',
        jawab: 'Mulai dari belakang telinga dan wajah dok, lalu turun ke leher, badan, sampai kaki.',
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_imunisasi',
        kategori: 'rpd',
        tanya: 'Anaknya sudah imunisasi campak/MR lengkap?',
        jawab: 'Belum lengkap dok, yang campak sepertinya terlewat waktu itu.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada teman atau tetangga yang baru sakit campak?',
        jawab: 'Di kampung memang lagi ada beberapa anak yang campak dok.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_makan',
        kategori: 'rps',
        tanya: 'Anaknya masih mau makan-minum? Ada sesak, diare, atau kejang?',
        jawab: 'Agak susah makan dok karena mulutnya sariawan, tapi masih mau minum; nggak sesak, nggak kejang.',
        oldcarts: ['penyerta', 'keparahan'],
      },
      {
        id: 'q_telinga',
        kategori: 'rps',
        tanya: 'Ada keluar cairan dari telinga atau napas jadi cepat/sesak?',
        jawab: 'Nggak ada dok, telinga kering, napasnya agak cepat karena demam saja.',
        oldcarts: ['penyerta'],
      },
      // distraktor: urutan anak keberapa tidak relevan untuk morbili.
      {
        id: 'q_anak_ke',
        kategori: 'sosial',
        tanya: 'Ini anak keberapa, Bu?',
        jawab: 'Anak ketiga dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'kulit', temuan: 'Ruam makulopapular eritematosa (morbiliformis) konfluen, distribusi SEFALOKAUDAL — terpadat di wajah & leher, menyebar ke badan dan ekstremitas.', relevan: true },
      { region: 'tht_mulut', temuan: 'KOPLIK SPOTS: bercak putih keabuan kecil dikelilingi eritema di mukosa bukal berhadapan geraham (patognomonik). Faring hiperemis.', relevan: true },
      { region: 'mata', temuan: 'Konjungtiva hiperemis bilateral, berair (conjunctivitis) — bagian dari trias 3C, tanpa sekret purulen.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-, tidak ada retraksi — belum ada pneumonia (komplikasi tersering yang harus dipantau).', relevan: true },
      { region: 'abdomen', temuan: 'Supel, bising usus normal, tidak ada tanda dehidrasi berat.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Leukopenia relatif (limfopenia) — mendukung infeksi virus. Morbili terutama diagnosis klinis; konfirmasi IgM campak untuk surveilans bila tersedia.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['B05.9', 'B01.9', 'B06.9'],
    tatalaksana: {
      obatBenar: ['vitamin_a_kapsul', 'paracetamol_500'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Morbili adalah infeksi virus; antibiotik TIDAK diberikan rutin. Antibiotik hanya bila ada komplikasi bakteri (pneumonia, otitis media akut).' },
        { id: 'dexamethasone_05', alasan: 'Kortikosteroid tidak berperan pada campak tanpa komplikasi dan justru menekan imun; tata laksana utama suportif + vitamin A.' },
      ],
      edukasi: ['gizi_seimbang', 'istirahat_cukup', 'tanda_bahaya', 'cairan_oralit'],
    },
    clue: 'Morbili: trias 3C (Cough, Coryza, Conjunctivitis) + KOPLIK SPOTS → ruam makulopapular SEFALOKAUDAL. Beri VITAMIN A DUA DOSIS (hari-1 & hari-2, dosis sesuai usia) + suportif (antipiretik, cairan, gizi). TANPA antibiotik rutin. Pantau komplikasi (pneumonia, diare, ensefalitis). WAJIB dilaporkan (surveilans PD3I) & lengkapi imunisasi kontak (Kemenkes/WHO).',
    konsekuensi: {
      narasi: 'Tanpa vitamin A dan pemantauan, campak pada anak dapat berkomplikasi berat (pneumonia, diare-dehidrasi, ensefalitis, kebutaan akibat defisiensi vitamin A) — penyebab kematian campak.',
      kembaliHariMin: 3,
      kembaliHariMax: 10,
      kondisiKembali: 'Anak kembali dengan napas cepat, tarikan dinding dada, dan demam yang naik lagi — curiga pneumonia sebagai komplikasi campak.',
      guideline: 'Kemenkes/WHO Campak — vitamin A dua dosis + suportif, tanpa antibiotik rutin, wajib lapor surveilans PD3I.',
    },
  },
]
