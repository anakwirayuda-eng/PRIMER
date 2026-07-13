/**
 * KASUS INFEKSI — Batch A (8 kasus SKDI 4A, semua tuntas di FKTP).
 *
 * Ditulis terhadap kontrak `KasusKlinis` (src/content/types.ts). Semua id obat/lab/
 * edukasi memakai katalog kanonik BUILD_SPECS. Akurasi klinis mengikuti guideline
 * nasional (Kemenkes/PNPK/PERKENI/WHO) — lihat setiap `clue` & `obatSalahUmum`.
 *
 * Catatan kontrak: pertanyaan pengecoh ditandai `distraktor: true` (fix CODEX-25
 * #9 2026-07-12 — dulu HANYA komentar `// distraktor` tanpa field, jadi engine
 * memberi mereka gratis tak seperti file kasus lain; kesabaran pasien tak pernah
 * tergerus & spam-semua jadi strategi bebas-risiko).
 */

import type { KasusKlinis } from '../types'

export const KASUS_INFEKSI: KasusKlinis[] = [
  /* ======================================================================
   * 1. ISPA — Common Cold (Nasofaringitis Akut Viral)
   * Poin ajar: swasembada antibiotik. Viral, self-limiting 5–7 hari.
   * ==================================================================== */
  {
    id: 'ispa_common_cold',
    nama: 'ISPA — Common Cold (Nasofaringitis Akut)',
    icd10: 'J00',
    skdi: '4A',
    kategori: 'respirasi',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Hidung saya meler terus dok, sudah beberapa hari.',
    demografi: { usiaMin: 15, usiaMax: 55 },
    vital: { td: '110/70', nadi: 82, rr: 18, suhu: 37.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Ada keluhan apa hari ini?',
        jawab: 'Hidung saya meler terus dok, ingusnya bening encer.',
        variasi: {
          polos: 'Ingusé mbrèbès terus dok, bening kayak air.',
          terpelajar: 'Ingus saya encer dan bening dok, dan hidung tersumbat bergantian kiri-kanan.',
          cemas: 'Duh dok, ingus saya nggak berhenti-berhenti, ini bahaya nggak ya?',
        },
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa hari begini?',
        jawab: 'Baru tiga hari ini dok.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Demamnya tinggi tidak?',
        jawab: 'Cuma anget-anget aja dok, nggak sampai menggigil.',
        variasi: {
          polos: 'Sumer-sumer thok dok, ora sing panas banget.',
          terpelajar: 'Hangat-hangat saja dok, tidak pernah saya ukur sampai di atas 38.',
        },
        esensial: true,
        oldcarts: ['keparahan', 'penyerta'],
      },
      {
        id: 'q_sesak',
        kategori: 'rps',
        tanya: 'Ada sesak napas atau bunyi ngik-ngik saat bernapas?',
        jawab: 'Nggak ada dok, napas biasa aja.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_batuk',
        kategori: 'rps',
        tanya: 'Batuknya ada? Kalau ada, berdahak atau kering?',
        jawab: 'Belum batuk dok, cuma tenggorokan gatal sedikit.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Ada riwayat alergi obat atau makanan?',
        jawab: 'Nggak ada dok.',
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Di rumah ada yang sedang pilek juga?',
        jawab: 'Anak saya juga lagi pilek dok, kena duluan.',
      },
      // distraktor: golongan darah tidak relevan untuk common cold.
      {
        id: 'q_goldar',
        kategori: 'sosial',
        distraktor: true,
        tanya: 'Golongan darahnya apa Pak/Bu?',
        jawab: 'O dok. Emangnya kenapa ya?',
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Compos mentis, tampak sakit ringan, tidak sesak.', relevan: true },
      { region: 'tht_mulut', temuan: 'Mukosa hidung edema, sekret serosa jernih (+). Faring hiperemis ringan, tonsil T1/T1 tenang.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-, wheezing -/-. Tidak ada retraksi.', relevan: true },
      { region: 'kepala_leher', temuan: 'KGB leher tidak membesar, tidak nyeri tekan.', relevan: false },
      { region: 'abdomen', temuan: 'Datar, supel, bising usus normal, nyeri tekan (-).', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Hb 13.8, Leukosit 7.800/µL, Trombosit 250.000/µL — dalam batas normal.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['J00', 'J06.9', 'J02.9'],
    tatalaksana: {
      // Fix G3 (triase DeepThink 2026-07-11): pasien ini eksplisit BELUM batuk
      // ("cuma tenggorokan gatal sedikit", q_batuk) — ambroxol (mukolitik)
      // hanya berindikasi pada batuk produktif, jadi tak boleh jadi slot wajib.
      obatBenar: ['paracetamol_500', 'ctm_4'],
      obatOpsional: ['ambroxol_30'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Common cold adalah infeksi virus swasirna; antibiotik tidak mengubah perjalanan penyakit dan memicu resistensi (Kemenkes, PPRA).', bahaya: 'nonPrimer' },
      ],
      edukasi: ['istirahat_cukup', 'etika_batuk', 'cuci_tangan', 'kompres_demam'],
    },
    clue: 'ISPA viral self-limiting 5–7 hari (Kemenkes). Sekret hidung serosa + demam ringan TANPA sesak/mengi → simtomatik saja, TIDAK perlu antibiotik.',
    konsekuensi: {
      narasi: 'Pemberian antibiotik sia-sia bisa memicu diare akibat gangguan flora usus dan menormalisasi harapan pasien akan antibiotik pada kunjungan berikutnya.',
      kembaliHariMin: 5,
      kembaliHariMax: 8,
      kondisiKembali: 'Keluhan sudah membaik sendiri, tetapi pasien datang lagi meminta "antibiotik seperti kemarin".',
      guideline: 'Pedoman Penggunaan Antibiotik Kemenkes RI — ISPA non-pneumonia tidak diberi antibiotik.',
    },
  },

  /* ======================================================================
   * 2. Faringitis Akut (Streptokokus) — dengan alergiTrap penisilin
   * Poin ajar: firewall alergi kelas penisilin → alternatif makrolida.
   * ==================================================================== */
  {
    id: 'faringitis_akut',
    nama: 'Faringitis Akut Bakterial (Streptokokus Grup A)',
    icd10: 'J02.9',
    skdi: '4A',
    kategori: 'respirasi',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Tenggorokan saya sakit sekali dok, menelan rasanya perih.',
    demografi: { usiaMin: 8, usiaMax: 30 },
    vital: { td: '115/75', nadi: 92, rr: 18, suhu: 38.4 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Apa yang paling mengganggu?',
        jawab: 'Tenggorokan sakit banget dok, menelan kayak ada yang menyayat.',
        variasi: {
          polos: 'Gulu loro banget dok, nguntal wae perih.',
          terpelajar: 'Nyeri sekali saat menelan dok, baik makanan padat maupun waktu minum.',
          cemas: 'Sakit sekali dok sampai saya takut makan, ini radang parah ya?',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_demam',
        kategori: 'keluhan_utama',
        tanya: 'Ada demam? Sejak kapan?',
        jawab: 'Demam tinggi mendadak sejak kemarin sore dok.',
        esensial: true,
        oldcarts: ['onset', 'keparahan'],
      },
      {
        id: 'q_batuk',
        kategori: 'rps',
        tanya: 'Disertai batuk pilek?',
        jawab: 'Nggak batuk, nggak pilek dok. Cuma tenggorokannya.',
        variasi: {
          terpelajar: 'Tidak ada batuk maupun pilek dok, keluhannya murni di tenggorokan.',
        },
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kgb',
        kategori: 'rps',
        tanya: 'Ada benjolan atau nyeri di leher?',
        jawab: 'Iya dok, di bawah rahang terasa bengkak dan nyeri kalau dipegang.',
        oldcarts: ['penyerta', 'lokasi'],
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Ada riwayat alergi obat? Amoxicillin atau antibiotik golongan penisilin?',
        jawab: 'Dulu pernah bentol-bentol dan bengkak bibir sehabis minum amoxicillin dok.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_amandel',
        kategori: 'rpd',
        tanya: 'Sering radang amandel sebelumnya?',
        jawab: 'Setahun bisa 2–3 kali dok.',
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Orang rumah ada yang sakit tenggorokan serupa?',
        jawab: 'Adik saya kemarin juga radang tenggorokan dok.',
      },
      // distraktor: kebiasaan minum es bukan penentu tata laksana faringitis bakterial.
      {
        id: 'q_es',
        kategori: 'sosial',
        distraktor: true,
        tanya: 'Suka minum es atau makan gorengan?',
        jawab: 'Suka dok, tiap hari es teh manis.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sakit sedang, wajah kemerahan karena demam.', relevan: true },
      { region: 'tht_mulut', temuan: 'Faring hiperemis (+), tonsil T2/T2 hiperemis dengan eksudat putih (+). Tidak ada batuk.', relevan: true },
      { region: 'kepala_leher', temuan: 'KGB servikal anterior teraba membesar, nyeri tekan (+).', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-, wheezing -/-.', relevan: false },
      { region: 'abdomen', temuan: 'Datar, supel, nyeri tekan (-).', relevan: false },
    ],
    lab: [
      // M10 §49: relevan disamakan dgn saudara klinisnya tonsilitis (relevan:true) —
      // faringotonsilitis streptokokus entitas sama; dulu satu-satunya outlier
      // relevan:false → penalti labTakRelevan arbitrer utk aksi identik.
      { id: 'darah_rutin', hasil: 'Leukosit 13.500/µL dengan dominasi netrofil (leukositosis) — mendukung infeksi bakteri.', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['J02.9', 'J03.9', 'J06.9'],
    tatalaksana: {
      obatBenar: ['amoxicillin_500', 'paracetamol_500'],
      obatSalahUmum: [
        { id: 'ciprofloxacin_500', alasan: 'Fluorokuinolon bukan lini pertama faringitis streptokokus dan berlebihan untuk kasus komunitas 4A — memicu resistensi.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['kepatuhan_obat', 'kompres_demam', 'istirahat_cukup', 'cuci_tangan'],
      // CODEX M10 ronde-2 (2026-07-06): konsekuensi.narasi eksplisit — antibiotik
      // tak tuntas 10 hari → demam rematik/komplikasi jantung.
      edukasiKritis: ['kepatuhan_obat'],
    },
    clue: 'Skor Centor tinggi (demam, eksudat tonsil, KGB servikal nyeri, tanpa batuk) → faringitis Streptokokus Grup A. Lini pertama amoxicillin; bila alergi penisilin, ganti makrolida (eritromisin).',
    panduanResmi: 'Clue/EBM internasional cukup antibiotik untuk faringitis Streptokokus; PPK 1186/2022 justru menambah KORTIKOSTEROID rutin (Deksametason 3x0,5 mg/hari dewasa, 3 hari) untuk menekan inflamasi, di samping Amoksisilin 3x500 mg 6-10 hari atau Eritromisin 4x500 mg bila alergi penisilin.',
    alergiTrap: {
      kelas: 'penisilin',
      obatTerlarang: ['amoxicillin_500', 'amoxicillin_sirup'],
      alternatifBenar: ['eritromisin_500'],
    },
    konsekuensi: {
      narasi: 'Bila antibiotik tidak dituntaskan 10 hari, risiko demam rematik akut dan komplikasi jantung; bila dipaksakan amoxicillin pada pasien alergi, dapat terjadi reaksi anafilaksis.',
      kembaliHariMin: 7,
      kembaliHariMax: 14,
      kondisiKembali: 'Pasien kembali dengan nyeri sendi berpindah dan riwayat demam yang tidak tuntas diobati.',
      guideline: 'PNPK Faringitis Akut / AAP — eradikasi Streptokokus untuk mencegah demam rematik.',
    },
  },

  /* ======================================================================
   * 3. Dengue Fever (DF) — tanpa warning signs
   * Poin ajar: IBUPROFEN/NSAID TERLARANG (risiko perdarahan). Simtomatik + hidrasi.
   * ==================================================================== */
  {
    id: 'dengue_df',
    nama: 'Demam Dengue (DF)',
    icd10: 'A90',
    skdi: '4A',
    kategori: 'infeksi',
    fktp144: true,
    harusDirujuk: false,
    keluhanUtama: 'Demam tinggi mendadak dok, badan linu semua dan kepala berat.',
    demografi: { usiaMin: 12, usiaMax: 45 },
    vital: { td: '110/70', nadi: 98, rr: 20, suhu: 39.4 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan utamanya apa?',
        jawab: 'Demam tinggi mendadak dok, langsung tinggi dari kemarin.',
        variasi: {
          polos: 'Panasé dadakan dok, langsung nemen kaya kesetrum.',
          terpelajar: 'Demamnya mendadak tinggi dok, langsung tinggi dan terus-menerus.',
          cemas: 'Panasnya tinggi banget dok, saya takut ini DBD seperti tetangga yang dirawat.',
        },
        esensial: true,
        oldcarts: ['onset', 'karakter'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa hari demamnya?',
        jawab: 'Baru dua hari ini dok, tapi tinggi terus.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_nyeri',
        kategori: 'rps',
        tanya: 'Ada nyeri di kepala, belakang mata, atau sendi?',
        jawab: 'Kepala berat, belakang mata sakit, sendi-sendi linu semua dok.',
        oldcarts: ['lokasi', 'karakter', 'penyerta'],
      },
      {
        id: 'q_perdarahan',
        kategori: 'rps',
        tanya: 'Ada mimisan, gusi berdarah, atau bintik merah di kulit?',
        jawab: 'Belum ada dok, cuma badan pegal dan mual sedikit.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_minum',
        kategori: 'rps',
        tanya: 'Masih bisa makan dan minum? Ada muntah terus-menerus?',
        jawab: 'Masih bisa minum dok, muntah cuma sekali.',
        oldcarts: ['keparahan'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah kena demam berdarah sebelumnya?',
        jawab: 'Belum pernah dok.',
      },
      {
        id: 'q_tetangga',
        kategori: 'rpk',
        tanya: 'Ada tetangga atau keluarga yang kena DBD belakangan ini?',
        jawab: 'Iya dok, tetangga sebelah baru masuk rumah sakit kemarin karena DBD.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_jentik',
        kategori: 'sosial',
        tanya: 'Di rumah ada genangan atau bak mandi yang jarang dikuras?',
        jawab: 'Bak mandi belakang lumayan lama nggak dikuras dok, nyamuknya banyak.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sakit sedang, wajah kemerahan (facial flushing).', relevan: true },
      { region: 'kulit', temuan: 'Petekie di lengan bawah (+), uji torniket (Rumple-Leede) positif.', relevan: true },
      { region: 'abdomen', temuan: 'Nyeri tekan ulu hati ringan, hepatomegali (-), asites (-).', relevan: true },
      { region: 'tht_mulut', temuan: 'Faring tidak hiperemis, tonsil tenang.', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-. Tidak ada efusi.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Hb 14.2, Hct 42%, Leukosit 3.400/µL (leukopenia), Trombosit 98.000/µL (trombositopenia).', flag: 'abnormal', relevan: true },
      { id: 'ns1_dengue', hasil: 'NS1 Antigen: Positif.', flag: 'abnormal', relevan: true },
      { id: 'igm_dengue', hasil: 'IgM Anti-Dengue: Negatif; IgG: Negatif — antibodi belum terbentuk pada fase demam dini (<hari ke-5). NS1 adalah penanda yang lebih sensitif di fase akut ini.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['A90', 'A91', 'A01.0'],
    tatalaksana: {
      obatBenar: ['paracetamol_500', 'oralit'],
      obatSalahUmum: [
        { id: 'ibuprofen_400', alasan: 'NSAID DILARANG pada dengue: menghambat fungsi trombosit dan mengiritasi mukosa lambung → memperparah risiko perdarahan. Antipiretik hanya paracetamol.', bahaya: 'kontraindikasi' },
        { id: 'amoxicillin_500', alasan: 'Dengue adalah infeksi virus; antibiotik tidak berperan dan hanya menambah beban obat.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['tanda_bahaya', 'psn_3m', 'cairan_oralit', 'kompres_demam', 'istirahat_cukup'],
      // DeepThink triangulasi (2026-07-05): konsekuensi.narasi kasus ini
      // eksplisit sebut "melewatkan edukasi tanda bahaya" sbg jalur ke
      // DSS/perdarahan — tak boleh disubsidi topik suportif (kompres/istirahat).
      edukasiKritis: ['tanda_bahaya'],
    },
    clue: 'Demam dengue: antipiretik HANYA paracetamol — HINDARI ibuprofen/aspirin/NSAID (risiko perdarahan). Kunci tata laksana adalah hidrasi & pemantauan tanda bahaya (WHO Dengue Guidelines; Kemenkes).',
    panduanResmi: 'PPK 1186/2022 membolehkan dengue/DBD tanpa syok dirawat jalan di FKTP dengan parasetamol 10–15 mg/kgBB/kali (hindari ibuprofen/asetosal). Kriteria rujuk resminya konkret: syok, anak tak dapat minum adekuat, atau keluarga tak mampu merawat di rumah — bukan sekadar \'pantau tanda bahaya\'.',
    catatanRealita: 'Hematology analyzer dan alat diagnostik belum ada di semua Puskesmas; NS1 juga bukan syarat tunggal. Rawat jalan aman hanya bila pemantauan klinis dan, sesuai fase/indikasi, serial hematokrit/trombosit dapat diakses. Bila keluarga atau jejaring tak mampu menjamin kontrol dan tanda bahaya, ambang rujuk harus turun; jangan beri rasa aman palsu dari satu hasil lab.',
    konsekuensi: {
      narasi: 'Pemberian ibuprofen atau melewatkan edukasi tanda bahaya dapat berujung perdarahan atau syok dengue (DSS) yang mengancam jiwa.',
      kembaliHariMin: 2,
      kembaliHariMax: 4,
      kondisiKembali: 'Pasien kembali dengan nyeri perut hebat, muntah terus, gusi berdarah, dan akral dingin — tanda kebocoran plasma.',
      guideline: 'WHO Dengue Guidelines 2009 / Kemenkes — larangan NSAID & pemantauan warning signs.',
    },
  },

  /* ======================================================================
   * 4. Demam Tifoid
   * Poin ajar: demam stepladder + lidah kotor; kloramfenikol lini pertama Puskesmas.
   * ==================================================================== */
  {
    id: 'demam_tifoid',
    nama: 'Demam Tifoid',
    icd10: 'A01.0',
    skdi: '4A',
    kategori: 'infeksi',
    fktp144: true,
    harusDirujuk: false,
    keluhanUtama: 'Demam sudah seminggu dok, makin lama makin tinggi terutama malam hari.',
    demografi: { usiaMin: 10, usiaMax: 40 },
    vital: { td: '100/70', nadi: 76, rr: 18, suhu: 39.0 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa lama demamnya dan bagaimana polanya?',
        jawab: 'Sudah 7 hari dok, naiknya bertahap, makin tinggi tiap sore-malam.',
        variasi: {
          polos: 'Wis seminggu dok, saya panasé nambah dhuwur sithik-sithik saben sore.',
          terpelajar: 'Demam sekitar seminggu dok, makin hari makin tinggi, dan paling terasa sore sampai malam.',
          cemas: 'Panas terus dok seminggu nggak turun-turun, saya jadi lemas sekali.',
        },
        esensial: true,
        oldcarts: ['onset', 'durasi', 'waktu'],
      },
      {
        id: 'q_pola',
        kategori: 'keluhan_utama',
        tanya: 'Demamnya sepanjang hari atau lebih tinggi waktu tertentu?',
        jawab: 'Sore sampai malam paling tinggi dok, pagi agak turun.',
        esensial: true,
        oldcarts: ['waktu', 'karakter'],
      },
      {
        id: 'q_bab',
        kategori: 'rps',
        tanya: 'BAB-nya bagaimana? Susah atau mencret?',
        jawab: 'Agak susah BAB dok, sudah beberapa hari.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_perut',
        kategori: 'rps',
        tanya: 'Ada nyeri perut, mual, atau nafsu makan turun?',
        jawab: 'Mual dok, nggak nafsu makan, perut kembung.',
        esensial: true,
        oldcarts: ['penyerta', 'lokasi'],
      },
      {
        id: 'q_kesadaran',
        kategori: 'rps',
        tanya: 'Ada rasa mengantuk berat atau bicara melantur?',
        jawab: 'Kadang linglung dok kalau demam tinggi, tapi masih sadar.',
        oldcarts: ['penyerta', 'keparahan'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah kena tifus sebelumnya?',
        // M10 Batch-2 (CODEX C.6): "waktu SMA" janggal utk pasien anak yang
        // di-roll di ujung bawah demografi — dinetralkan ke rentang waktu.
        jawab: 'Beberapa tahun lalu pernah sekali dok.',
      },
      {
        id: 'q_jajan',
        kategori: 'sosial',
        tanya: 'Sering jajan atau makan di luar? Sumber air minumnya bagaimana?',
        jawab: 'Sering beli makanan pinggir jalan dok, air minum kadang dari sumur.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      // distraktor: riwayat merokok tidak mengubah tata laksana tifoid.
      {
        id: 'q_rokok',
        kategori: 'sosial',
        distraktor: true,
        tanya: 'Apakah merokok?',
        jawab: 'Nggak merokok dok.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sakit sedang, febris, apatis ringan.', relevan: true },
      { region: 'tht_mulut', temuan: 'Lidah kotor dengan tepi hiperemis dan tremor (typhoid tongue).', relevan: true },
      { region: 'abdomen', temuan: 'Meteorismus (+), nyeri tekan difus ringan, hepatosplenomegali borderline.', relevan: true },
      { region: 'jantung', temuan: 'Bradikardia relatif — nadi tidak sebanding dengan tinggi demam.', relevan: true },
      { region: 'kulit', temuan: 'Tidak tampak rose spots yang jelas; turgor cukup.', relevan: false },
    ],
    lab: [
      { id: 'widal', hasil: 'Titer O 1/320, titer H 1/160 (bermakna pada daerah endemis).', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Leukosit 3.900/µL (leukopenia), aneosinofilia, trombosit borderline.', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['A01.0', 'A90', 'B54'],
    tatalaksana: {
      // Audit CODEX 2026-07-04: amoxicillin_500 DULU ada di obatSalahUmum
      // (-25, "berbahaya") padahal clue sendiri menyebutnya alternatif sah —
      // kontradiksi menghukum pemain utk pilihan yg narasi kasus akui benar.
      // Kloramfenikol tetap default (lini pertama Fornas/PPK), tapi kini grup
      // "pilih salah satu" bersama kotrimoksazol/amoksisilin (alternatif sah
      // sesuai clue) — bukan wajib-tunggal, bukan pula dihukum berat.
      obatBenar: ['paracetamol_500'],
      obatAlternatif: [['kloramfenikol_250', 'cotrimoxazole_480', 'amoxicillin_500']],
      edukasi: ['kepatuhan_obat', 'istirahat_cukup', 'cuci_tangan', 'gizi_seimbang'],
      // CODEX M10 ronde-2 (2026-07-06): konsekuensi.narasi eksplisit — antibiotik
      // tak tuntas → perforasi usus/perdarahan minggu ke-3.
      edukasiKritis: ['kepatuhan_obat'],
    },
    clue: 'Demam stepladder (naik bertahap, puncak sore-malam) + lidah kotor + bradikardia relatif → tifoid. Lini pertama FKTP/Fornas: kloramfenikol (alternatif kotrimoksazol/amoksisilin; bila tersedia & sesuai antibiogram/derajat, sefiksim/seftriakson) — tekankan tuntas + istirahat total untuk cegah perforasi usus. Catatan: Widal tunggal punya angka positif-palsu tinggi, tegakkan dengan gambaran klinis + konteks endemis; kultur bila tersedia.',
    panduanResmi: 'PPK 1186/2022 merinci lini pertama kloramfenikol dewasa 4×500 mg selama 10 hari, dengan syarat resmi yg sering terlupa: JANGAN beri bila leukosit <2000/mm³. Rujuk bila 5 hari terapi belum membaik, atau ada toxic typhoid/komplikasi/komorbid berat.',
    catatanRealita: 'Kultur darah bukan pemeriksaan rutin on-site dalam standar laboratorium Puskesmas. Bila diperlukan, gunakan jejaring spesimen/rujukan; jangan mengganti konfirmasi dengan Widal tunggal. Keterbatasan alat tidak mengubah kewajiban menilai derajat sakit, memantau respons, dan merujuk bila toksik, berkomplikasi, atau gagal membaik.',
    konsekuensi: {
      narasi: 'Bila antibiotik tidak dituntaskan atau pasien tetap beraktivitas berat, risiko perforasi usus dan perdarahan saluran cerna pada minggu ke-3.',
      kembaliHariMin: 7,
      kembaliHariMax: 14,
      kondisiKembali: 'Pasien kembali dengan nyeri perut hebat mendadak dan perut papan (defans muskular) — curiga perforasi.',
      guideline: 'PNPK Demam Tifoid Kemenkes — antibiotik tuntas + tirah baring.',
    },
  },

  /* ======================================================================
   * 5. Diare Akut Anak (Gastroenteritis Akut)
   * Poin ajar: oralit + ZINC 20 mg 10 hari. TANPA antibiotik rutin.
   * ==================================================================== */
  {
    id: 'diare_akut_anak',
    nama: 'Diare Akut pada Anak (Gastroenteritis Akut)',
    icd10: 'A09',
    skdi: '4A',
    kategori: 'pencernaan',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Anak saya mencret-mencret dok, sudah lebih dari lima kali sejak pagi.',
    keluhanUtamaOlehPendamping: true,
    demografi: { usiaMin: 3, usiaMax: 5 },
    vital: { td: '90/60', nadi: 110, rr: 24, suhu: 37.8 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan anaknya apa, Bu?',
        jawab: 'Mencret cair dok, sudah lebih dari lima kali dari pagi.',
        variasi: {
          wali_anak: 'Anak saya BAB cair terus dok, lebih dari lima kali sejak pagi, saya khawatir dia lemas.',
          polos: 'Bocahé ngising cuér terus dok, wis luwih limang kali.',
          cemas: 'Dok, anak saya mencret nggak berhenti, ini bahaya nggak? Dia jadi lemes banget.',
        },
        esensial: true,
        oldcarts: ['onset', 'karakter'],
      },
      {
        id: 'q_konsistensi',
        kategori: 'keluhan_utama',
        tanya: 'BAB-nya seperti apa? Ada darah atau lendir?',
        jawab: 'Cair kekuningan dok, nggak ada darah atau lendir.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_minum',
        kategori: 'rps',
        tanya: 'Anaknya masih mau minum? Haus terus atau malah malas minum?',
        jawab: 'Masih mau minum dok, malah kelihatan haus terus.',
        esensial: true,
        oldcarts: ['penyerta', 'keparahan'],
      },
      {
        id: 'q_kencing',
        kategori: 'rps',
        tanya: 'Masih pipis seperti biasa? Popoknya masih basah?',
        jawab: 'Masih pipis dok, tapi agak berkurang dari biasanya.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_muntah',
        kategori: 'rps',
        tanya: 'Ada muntah? Demam?',
        jawab: 'Muntah dua kali dok, badannya agak hangat.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_makan',
        kategori: 'rpd',
        tanya: 'Sebelum sakit makan atau minum apa yang tidak biasa?',
        jawab: 'Kemarin jajan es dan gorengan di depan sekolah dok.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Ada anggota keluarga lain yang mencret juga?',
        jawab: 'Kakaknya kemarin juga sempat mencret sebentar dok.',
      },
      // distraktor: urutan kelahiran anak tidak relevan untuk tata laksana diare akut.
      {
        id: 'q_anak_ke',
        kategori: 'sosial',
        distraktor: true,
        tanya: 'Ini anak keberapa, Bu?',
        jawab: 'Anak kedua dok.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Anak rewel tapi masih responsif, mata sedikit cekung, air mata masih ada. Dehidrasi ringan-sedang.', relevan: true },
      { region: 'abdomen', temuan: 'Bising usus meningkat, perut supel, nyeri tekan difus ringan.', relevan: true },
      { region: 'kulit', temuan: 'Turgor kulit kembali agak lambat (<2 detik), akral hangat, CRT <2 detik.', relevan: true },
      { region: 'tht_mulut', temuan: 'Mukosa mulut agak kering, faring tenang.', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
    ],
    lab: [
      { id: 'feses_rutin', hasil: 'Konsistensi cair, lendir (-), darah (-), leukosit 1–2/lpb, eritrosit (-).', flag: 'normal', relevan: true },
      { id: 'darah_rutin', hasil: 'Hb 12.0, Leukosit 9.200/µL — tidak spesifik.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['A09', 'A08.0', 'K52.9'],
    tatalaksana: {
      obatBenar: ['oralit', 'zinc_20'],
      obatSalahUmum: [
        { id: 'cotrimoxazole_480', alasan: 'Diare akut cair tanpa darah/lendir umumnya virus/self-limiting — antibiotik TIDAK diberikan rutin (memicu resistensi & tidak mempercepat sembuh).', bahaya: 'nonPrimer' },
        { id: 'amoxicillin_500', alasan: 'Bukan indikasi pada diare akut non-disentri; fokus pada rehidrasi oral, bukan antibiotik.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['cairan_oralit', 'cuci_tangan', 'tanda_bahaya', 'gizi_seimbang'],
      // DeepThink triangulasi (2026-07-05): konsekuensi.narasi kasus ini eksplisit
      // — rehidrasi tak diedukasi benar → dehidrasi memberat jadi syok hipovolemik.
      edukasiKritis: ['cairan_oralit'],
    },
    clue: 'Anak ini dehidrasi RINGAN-SEDANG (rewel, mata cekung, haus/minum lahap, turgor kembali agak lambat = kriteria Rencana Terapi B, BUKAN sekadar tanpa-dehidrasi). Tata laksana (LINTAS DIARE Kemenkes/WHO): ORALIT 75 mL/kgBB diberikan SEDIKIT-SEDIKIT selama 3–4 JAM DI PUSKESMAS (perkiraan tanpa BB: <1th ±300mL, 1–5th ±600mL), lalu NILAI ULANG hidrasi — membaik → pulang lanjut oralit tiap BAB cair + ZINC 20 mg 10–14 hari (Rencana Terapi A) + teruskan ASI/makan; memburuk → Rencana Terapi C (IV/rujuk). TANPA antibiotik pada diare cair tanpa darah.',
    // Fix M1/#6a (triase DeepThink 2026-07-11): "oralit tiap BAB cair" adalah
    // instruksi Rencana Terapi A (tanpa-dehidrasi) — sering keliru diterapkan
    // pulang-langsung pada anak yang sebenarnya sudah dehidrasi ringan-sedang.
    mutiaraEbm: '"Oralit tiap kali BAB cair" adalah instruksi Rencana Terapi A (TANPA dehidrasi) — sering keliru diterapkan langsung-pulang pada anak yang sebenarnya SUDAH menunjukkan tanda dehidrasi ringan-sedang. Kuncinya: volume terhitung (75 mL/kgBB) + observasi 3–4 jam di faskes dulu, baru boleh pulang bila membaik.',
    // Catatan mekanik (audit CODEX 2026-07-11, agar tak disalahartikan audit
    // berikutnya sbg sudah tergerbang): "observasi 3-4 jam lalu NILAI ULANG"
    // adalah instruksi klinis nyata (LINTAS DIARE Kemenkes/WHO) — TEKS SAJA.
    // Engine saat ini tak membedakan disposisi 'observasi' dari 'pulang' utk
    // kasus non-rujuk (clinic.ts) & skorTerapi murni dari resep, bukan dari
    // observasi/waktu — klik PULANGKAN langsung setelah resep benar tetap
    // skor penuh. Gate observasi sungguhan = mekanik baru (REVISI-touching),
    // ditahan sampai scope M13/M14/M10.5b diputuskan eksplisit.
    konsekuensi: {
      narasi: 'Terapi yang tidak sesuai (dosis oralit/zinc salah, atau justru diberi antibiotik yang tak perlu) meningkatkan risiko dehidrasi anak ini memberat menjadi syok hipovolemik.',
      kembaliHariMin: 2,
      kembaliHariMax: 4,
      kondisiKembali: 'Anak kembali dengan mata sangat cekung, malas minum, dan lemas — dehidrasi berat yang perlu rehidrasi intravena/rujukan.',
      guideline: 'Buku Saku LINTAS DIARE Kemenkes / WHO — oralit + zinc, tanpa antibiotik rutin.',
    },
  },

  /* ======================================================================
   * 6. TB Paru — BTA hasil BESOK; 4A, TIDAK dirujuk (program DOTS)
   * Poin ajar: batuk >2 minggu = red flag; OAT KDT, tuntas 6 bulan.
   * ==================================================================== */
  {
    id: 'tb_paru',
    nama: 'Tuberkulosis Paru',
    icd10: 'A15.0',
    skdi: '4A',
    kategori: 'respirasi',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'rendah',
    keluhanUtama: 'Batuk saya sudah lebih dari tiga minggu dok, kadang ada bercak darahnya.',
    demografi: { usiaMin: 48, usiaMax: 68 },
    vital: { td: '100/70', nadi: 92, rr: 22, suhu: 37.8, spo2: 97 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Batuknya sudah berapa lama?',
        jawab: 'Sudah lebih dari tiga minggu dok, nggak sembuh-sembuh.',
        variasi: {
          polos: 'Wis luwih telung minggu dok, watuké ora mari-mari.',
          terpelajar: 'Batuk sudah lebih dari tiga minggu dok, berdahak, tidak sembuh-sembuh.',
          lansia: 'Sudah lama sekali Nak, batuk terus, tenaga saya habis dibuatnya.',
        },
        esensial: true,
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_darah',
        kategori: 'keluhan_utama',
        tanya: 'Ada dahak bercampur darah?',
        jawab: 'Kadang ada bercak darah dok, sedikit-sedikit.',
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_bb',
        kategori: 'rps',
        tanya: 'Berat badan turun akhir-akhir ini?',
        jawab: 'Iya dok, turun sekitar 5 kg dalam sebulan, baju jadi longgar.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_keringat',
        kategori: 'rps',
        tanya: 'Ada keringat malam atau demam naik-turun?',
        jawab: 'Sering keringat malam dok, bangun tidur baju basah. Demam sumer-sumer.',
        oldcarts: ['penyerta', 'waktu'],
      },
      {
        id: 'q_nafsu',
        kategori: 'rps',
        tanya: 'Nafsu makan bagaimana? Cepat lelah?',
        jawab: 'Nafsu makan turun dok, badan lemas terus.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada keluarga atau tetangga dekat yang batuk lama atau berobat TB?',
        jawab: 'Bapak saya dulu pernah berobat TB dok, dan tetangga sebelah juga sedang minum obat paru.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_serumah',
        kategori: 'sosial',
        tanya: 'Di rumah tinggal berapa orang? Ada anak kecil?',
        jawab: 'Serumah berlima dok, ada cucu yang masih balita.',
      },
      // distraktor: hobi/olahraga tidak menentukan diagnosis atau tata laksana TB.
      {
        id: 'q_olahraga',
        kategori: 'sosial',
        distraktor: true,
        tanya: 'Apakah rutin berolahraga?',
        jawab: 'Jarang dok, kerja saja sudah capek.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak kurus, pucat, dan lemah (wasting).', relevan: true },
      { region: 'toraks_paru', temuan: 'Ronki basah di apeks paru kanan, suara napas bronkial di apeks. Retraksi (-).', relevan: true },
      { region: 'kepala_leher', temuan: 'KGB supraklavikula kanan teraba kecil, tidak nyeri.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-).', relevan: false },
      { region: 'abdomen', temuan: 'Datar, supel, hepar/lien tidak membesar.', relevan: false },
    ],
    lab: [
      { id: 'bta_sputum', hasil: 'BTA sputum sewaktu-pagi: positif (2+). (Hasil pemeriksaan mikroskopis keluar keesokan hari.)', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Hb 10.8 (anemia ringan), LED meningkat, leukosit borderline.', flag: 'abnormal', relevan: false },
    ],
    diagnosisBanding: ['A15.0', 'J18.9', 'A16.2'],
    // M10.5 Q2 (2026-07-12): OAT DOTS tak boleh dimulai presumtif tanpa
    // konfirmasi bakteriologis (BTA/TCM) — WHO/program TB nasional.
    konfirmasiWajib: 'bta_sputum',
    tatalaksana: {
      obatBenar: ['oat_kdt'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Batuk >2 minggu dengan hemoptisis bukan pneumonia biasa — antibiotik non-OAT menunda diagnosis TB dan berbahaya. Butuh OAT program DOTS.', bahaya: 'nonPrimer' },
        { id: 'ambroxol_30', alasan: 'Mukolitik hanya simtomatik; tidak boleh menjadi "terapi" utama yang menunda mulainya OAT.', bahaya: 'nonPrimer' },
      ],
      edukasi: ['minum_oat_tuntas', 'etika_batuk', 'kontrol_rutin', 'kepatuhan_obat'],
      // DeepThink triangulasi (2026-07-05): OAT DOTS wajib TUNTAS 6 bulan —
      // putus obat adalah jalur klinis #1 ke MDR-TB, klinis lain tak sebanding.
      edukasiKritis: ['minum_oat_tuntas'],
    },
    clue: 'Batuk >2 minggu + BB turun + keringat malam + kontak TB = terduga TB. Konfirmasi bakteriologis (baku emas terkini: TCM/Xpert MTB-RIF; BTA sputum sbg alternatif) → mulai OAT KDT program DOTS, TUNTAS 6 bulan. Tawarkan skrining HIV pada semua pasien TB. TB paru adalah kompetensi 4A — DITANGANI di Puskesmas, bukan dirujuk. Skrining kontak serumah.',
    panduanResmi: 'PPK 1186/2022: paduan resmi Kategori 1 = 2HRZE/4H3R3 (6 bulan), OAT-KDT ditelan sekaligus dgn pengawas menelan obat (DOT). Meski TB paru kompetensi FKTP, PPK mewajibkan RUJUK bila suspek TB-MDR, BTA tetap (+) setelah pengobatan, atau TB dengan komplikasi/komorbid.',
    // Fix M1/#8 (triase DeepThink 2026-07-11, keputusan Dr. Wirayuda: "teks
    // dulu, mekanik nanti"): TCM (Xpert MTB-RIF) adalah baku emas lini-pertama
    // pedoman TB terkini, BTA kini lebih berperan di pemantauan pengobatan —
    // tapi katalog LAB game belum punya item TCM/HIV terpisah (nambahnya
    // menyentuh field ternilai, ditahan dulu sampai keputusan scope M13/M14).
    // Ini fix TEKS-saja: hasil bta_sputum tetap dipakai sbg proksi konfirmasi
    // bakteriologis (lab/tatalaksana TIDAK berubah), murni menaikkan akurasi
    // pengetahuan yang diajarkan clue + mutiaraEbm.
    // Bagian D (adjudikasi 2026-07-12): nuansa TCM-vs-BTA diperjelas — bukan
    // "BTA ketinggalan zaman", tapi PNPK 2019 sendiri membagi dua jalur resmi
    // menurut ketersediaan alat (fasyankes dengan/tanpa TCM). TCM adalah alat
    // JARINGAN (biasanya di Puskesmas rujukan/Labkesda/RS tertentu) — tak
    // setiap Puskesmas punya mesinnya sendiri, jadi BTA tetap jalur SAH utk
    // sebagian besar Puskesmas kita, bukan sekadar "terpaksa pakai yang lama".
    mutiaraEbm: 'PNPK 2019 TB membagi dua jalur diagnosis resmi menurut ketersediaan alat: fasyankes DENGAN TCM (Tes Cepat Molekuler/Xpert MTB-RIF) — gunakan TCM sbg pemeriksaan awal lini pertama; fasyankes TANPA TCM — pakai mikroskopis BTA sputum (2 spesimen: sewaktu + pagi), jalur ini TETAP SAH menurut pedoman, bukan ketinggalan zaman. TCM adalah alat jaringan (biasanya di Puskesmas rujukan/Labkesda/RS tertentu, bukan tiap Puskesmas punya mesinnya sendiri) — kasus ini menggambarkan Puskesmas TANPA akses TCM, jalur realistis bagi banyak FKTP di Indonesia. BTA berperan lagi di pemantauan pengobatan (bulan ke-2/5/6) pada kedua jalur. Semua pasien TB, terduga maupun terkonfirmasi, juga sebaiknya ditawari skrining HIV.',
    konsekuensi: {
      narasi: 'Bila OAT tidak dituntaskan atau ditunda dengan antibiotik biasa, terjadi penularan ke balita serumah dan risiko TB resisten obat (TB-RO).',
      kembaliHariMin: 14,
      kembaliHariMax: 30,
      kondisiKembali: 'Pasien putus obat dan kembali dengan keluhan memberat; cucu balita di rumah mulai batuk dan berat badan sulit naik.',
      guideline: 'Pedoman Nasional Penanggulangan TB (Kemenkes) — OAT KDT tuntas + investigasi kontak.',
    },
  },

  /* ======================================================================
   * 7. Skabies
   * Poin ajar: gatal malam + burrow sela jari; permetrin 5% + obati kontak serumah.
   * ==================================================================== */
  {
    id: 'skabies',
    nama: 'Skabies (Kudis)',
    icd10: 'B86',
    skdi: '4A',
    kategori: 'kulit',
    fktp144: true,
    harusDirujuk: false,
    keluhanUtama: 'Gatal sekali dok, terutama malam hari, di sela-sela jari tangan.',
    // M10 §49: TD normalisasi lintas-usia (band mulai 8 th) — 105/68 masuk akal
    // utk anak maupun dewasa muda; skabies penyakit segala usia (kluster keluarga).
    demografi: { usiaMin: 8, usiaMax: 30 },
    vital: { td: '105/68', nadi: 80, rr: 18, suhu: 36.7 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Gatalnya bagaimana dan di mana?',
        jawab: 'Gatal banget dok di sela-sela jari, pergelangan tangan, sama perut.',
        variasi: {
          polos: 'Gatelé pol dok neng sela-sela driji karo bangkèkan.',
          terpelajar: 'Gatal sekali dok, terutama di sela-sela jari, pergelangan tangan, dan sekitar pusar.',
          cemas: 'Gatalnya nggak ketahan dok, saya takut menular ke keluarga saya.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_waktu',
        kategori: 'keluhan_utama',
        tanya: 'Gatalnya lebih parah kapan, siang atau malam?',
        jawab: 'Malam dok, sampai nggak bisa tidur karena gatal.',
        esensial: true,
        oldcarts: ['waktu', 'agravasi'],
      },
      {
        id: 'q_durasi',
        kategori: 'rps',
        tanya: 'Sudah berapa lama?',
        jawab: 'Sekitar seminggu ini dok, makin lama makin banyak bintilnya.',
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada teman sekamar atau keluarga yang gatal serupa?',
        jawab: 'Banyak teman satu asrama yang begini dok, adik saya di rumah juga mulai gatal.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_tinggal',
        kategori: 'sosial',
        tanya: 'Tinggalnya di mana? Ramai sekamar?',
        jawab: 'Di asrama pesantren dok, satu kamar berisi sepuluh orang.',
        esensial: true,
      },
      {
        id: 'q_handuk',
        kategori: 'sosial',
        tanya: 'Sering bertukar handuk, baju, atau seprai?',
        jawab: 'Iya dok, handuk dan sarung sering gantian dipakai.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Ada riwayat alergi kulit atau eksim sebelumnya?',
        jawab: 'Nggak ada dok, baru kali ini.',
      },
      // distraktor: jenis sabun mandi bukan penentu diagnosis skabies.
      {
        id: 'q_sabun',
        kategori: 'sosial',
        distraktor: true,
        tanya: 'Pakai sabun mandi merek apa?',
        jawab: 'Sabun batang biasa dok.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'kulit', temuan: 'Papul eritematosa multipel, kanalikuli/burrow (+), dan ekskoriasi di sela jari, pergelangan tangan, dan regio umbilikus.', relevan: true },
      { region: 'ekstremitas', temuan: 'Lesi papulovesikel simetris pada kedua tangan; bekas garukan (+).', relevan: true },
      { region: 'umum', temuan: 'Tampak tidak nyaman, sering menggaruk. Tanda vital normal.', relevan: true },
      { region: 'abdomen', temuan: 'Selain lesi kulit periumbilikal, abdomen supel, nyeri tekan (-).', relevan: false },
      { region: 'toraks_paru', temuan: 'Dalam batas normal.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Dalam batas normal — skabies adalah diagnosis klinis, tidak perlu darah rutin.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['B86', 'L20.9', 'L29.9'],
    tatalaksana: {
      obatBenar: ['permetrin_krim', 'cetirizine_10'],
      obatSalahUmum: [
        { id: 'ketokonazol_krim', alasan: 'Skabies disebabkan tungau Sarcoptes scabiei, bukan jamur — antijamur topikal tidak berefek. Skabisida (permetrin 5%) yang tepat.', bahaya: 'nonPrimer' },
        { id: 'amoxicillin_500', alasan: 'Antibiotik hanya diperlukan bila ada infeksi sekunder (impetiginisasi); pada skabies tanpa komplikasi tidak diindikasikan.', bahaya: 'nonPrimer' },
      ],
      // M10.c (dossier §47): cuci_tangan (lemah utk tungau) diganti — clue
      // KAPITAL "OBATI SEMUA KONTAK SERUMAH" + "cuci seprai/handuk air panas".
      // Keduanya kini eksplisit; kontak-serumah adalah pilar cegah reinfestasi.
      edukasi: ['obati_kontak_serumah', 'cuci_seprai_panas', 'kebersihan_kulit'],
    },
    clue: 'Skabies: gatal MEMBERAT MALAM + burrow/kanalikuli di sela jari/pergelangan/umbilikus + riwayat kontak erat (asrama). Permetrin 5% dioleskan seluruh tubuh, ULANGI 1 minggu; OBATI SEMUA KONTAK SERUMAH serentak + cuci seprai/handuk air panas (CDC/IACS).',
    panduanResmi: 'PPK 1186/2022 menambah opsi resmi selain permetrin 5% (dioleskan seluruh tubuh, dibersihkan setelah 10 jam): salep 2-4 dioleskan 3 hari berturut-turut tiap habis mandi. Terapi wajib serentak seluruh kelompok; rujuk bila keluhan masih dirasakan >1 bulan pasca-terapi.',
  },

  /* ======================================================================
   * 8. Konjungtivitis Bakterial
   * Poin ajar: mata merah + sekret mukopurulen, visus normal; tetes antibiotik.
   * ==================================================================== */
  {
    id: 'konjungtivitis_bakterial',
    nama: 'Konjungtivitis Bakterial',
    icd10: 'H10.0',
    skdi: '4A',
    kategori: 'mata',
    fktp144: true,
    harusDirujuk: false,
    keluhanUtama: 'Mata saya merah dok, keluar kotoran kuning kental terus.',
    // M10 §49: TD 118/76 hipertensif utk balita (band mulai usia 5). Diturunkan
    // ke 105/68 yg normal lintas seluruh band 5-45 (konjungtivitis bakteri lazim
    // di anak) — "tanda vital normal" kini akurat berapa pun usia yg di-roll.
    demografi: { usiaMin: 5, usiaMax: 45 },
    vital: { td: '105/68', nadi: 78, rr: 18, suhu: 36.8 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Matanya kenapa?',
        jawab: 'Mata merah dok, keluar kotoran kuning kental.',
        variasi: {
          polos: 'Mripaté abang dok, metu kotoran kuning kentel terus.',
          terpelajar: 'Mata merah dengan kotoran kental kekuningan dok, terutama menumpuk waktu bangun pagi.',
          cemas: 'Merah banget dok, saya takut ini menular atau merusak penglihatan.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_lengket',
        kategori: 'keluhan_utama',
        tanya: 'Pagi hari kelopaknya lengket susah dibuka?',
        jawab: 'Iya dok, pagi susah buka mata karena lengket kotorannya.',
        esensial: true,
        oldcarts: ['waktu', 'karakter'],
      },
      {
        id: 'q_nyeri',
        kategori: 'rps',
        tanya: 'Terasa nyeri hebat atau silau saat kena cahaya?',
        jawab: 'Nggak nyeri dok, cuma gatal dan mengganjal sedikit. Nggak silau.',
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_visus',
        kategori: 'rps',
        tanya: 'Penglihatannya turun atau kabur?',
        jawab: 'Agak buram karena kotoran dok, tapi kalau dilap bisa lihat jelas lagi.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_onset',
        kategori: 'rps',
        tanya: 'Sejak kapan dan mulai dari sebelah mana?',
        jawab: 'Dua hari lalu dok, mulai dari mata kanan lalu menular ke kiri.',
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada anggota keluarga yang matanya merah juga?',
        jawab: 'Anak saya yang satu juga mulai merah matanya dok.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_trauma',
        kategori: 'rpd',
        tanya: 'Ada riwayat kemasukan benda, terkena bahan kimia, atau pakai lensa kontak?',
        jawab: 'Nggak ada dok, tidak pakai lensa kontak juga.',
      },
      // distraktor: pekerjaan tidak menentukan tata laksana konjungtivitis bakterial.
      {
        id: 'q_kerja',
        kategori: 'sosial',
        distraktor: true,
        tanya: 'Pekerjaannya apa?',
        jawab: 'Pedagang di pasar dok.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'mata', temuan: 'Konjungtiva palpebra dan bulbi hiperemis (+), injeksi konjungtiva difus, sekret mukopurulen (+) di kantus.', relevan: true },
      { region: 'mata', temuan: 'Kornea jernih, refleks pupil normal, visus 6/6 (tidak turun). Tidak ada injeksi silier.', relevan: true },
      { region: 'umum', temuan: 'Tampak baik, tanda vital dalam batas normal.', relevan: true },
      { region: 'kepala_leher', temuan: 'KGB preaurikular tidak membesar.', relevan: false },
      { region: 'tht_mulut', temuan: 'Faring tenang, tidak ada gejala ISPA menyertai.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Tidak diindikasikan — konjungtivitis bakterial adalah diagnosis klinis.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['H10.0', 'H10.1', 'H10.9'],
    tatalaksana: {
      obatBenar: ['kloramfenikol_tetes_mata'],
      obatSalahUmum: [
        { id: 'dexamethasone_05', alasan: 'Steroid TIDAK boleh diberikan sembarangan pada mata merah — bila ternyata ada keterlibatan kornea/herpes, steroid memperparah dan mengancam penglihatan.', bahaya: 'kontraindikasi' },
        { id: 'amoxicillin_500', alasan: 'Antibiotik oral tidak diperlukan untuk konjungtivitis bakterial ringan; cukup antibiotik topikal (tetes).', bahaya: 'nonPrimer' },
      ],
      edukasi: ['cuci_tangan', 'kebersihan_kulit'],
    },
    clue: 'Konjungtivitis bakterial: mata merah + sekret MUKOPURULEN + kelopak lengket pagi, TANPA nyeri hebat/silau/penurunan visus. Antibiotik topikal (kloramfenikol tetes), self-limiting 5–7 hari. Nyeri hebat + fotofobia + visus TURUN = red flag keratitis → rujuk (AAO PPP).',
    panduanResmi: 'PPK 1186/2022 memberi dosis resmi spesifik: kloramfenikol tetes 1 tetes 6x/hari ATAU salep mata 3x/hari selama 3 hari (clue hanya sebut \'kloramfenikol tetes\'). Kriteria rujukan resmi: bila komplikasi pada kornea atau tak ada respons perbaikan terhadap pengobatan.',
    catatanRealita: 'Pasien dapat datang setelah memakai tetes kombinasi yang kandungannya tidak ia pahami. Tanyakan merek/kandungan: tetes berisi steroid adalah obat resep dan jangan diulang pada mata merah yang belum jelas. Nyeri hebat, fotofobia, visus turun, atau kornea keruh harus memicu rujukan, bukan trial steroid.',
    konsekuensi: {
      narasi: 'Bila higiene tangan tidak diedukasi, infeksi cepat menular ke mata sebelah dan anggota keluarga; pemberian steroid keliru dapat memicu ulkus kornea.',
      kembaliHariMin: 3,
      kembaliHariMax: 6,
      kondisiKembali: 'Anggota keluarga lain datang dengan keluhan mata merah serupa akibat penularan kontak.',
      guideline: 'AAO Preferred Practice Pattern — konjungtivitis bakterial, antibiotik topikal + higiene.',
    },
  },
]
