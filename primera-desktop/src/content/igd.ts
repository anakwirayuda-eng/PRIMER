/**
 * KASUS IGD (M3.14) — gawat darurat sebagai interrupt event turn-based.
 * Pemain memilih SATU tindakan per langkah; benar menstabilkan, salah memburuk.
 * Akurasi mengikuti algoritma kegawatdaruratan (ACLS/PPGD/MTBS/Kemenkes).
 */

import type { KasusIgd } from './types'

export const KASUS_IGD: KasusIgd[] = [
  /* ====================================================================== */
  {
    id: 'igd_syok_anafilaksis',
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
          { id: 'a', label: 'Observasi ketat, siapkan adrenalin ulang bila reaksi kambuh, lalu rujuk untuk pemantauan reaksi bifasik', benar: true, efekStabilitas: 15, respons: 'Tepat — pascastabilisasi kuncinya monitoring + kesiapan adrenalin ulang (tiap 5-15 menit bila perlu) + transfer. RCUK 2021: kortikosteroid TIDAK lagi rutin; antihistamin hanya meredakan gejala kulit, bukan ABC.' },
          { id: 'b', label: 'Andalkan kortikosteroid IV untuk mencegah reaksi bifasik', benar: false, efekStabilitas: -10, respons: 'Bukti steroid mencegah reaksi bifasik LEMAH — RCUK 2021 mencabut rekomendasi rutinnya. Ia bekerja lambat & tak menggantikan observasi + kesiapan adrenalin ulang.' },
          { id: 'c', label: 'Pasien membaik, langsung pulangkan', benar: false, efekStabilitas: -20, respons: 'Bahaya — reaksi bifasik bisa muncul beberapa jam kemudian. Wajib observasi berkepanjangan/rujuk.' },
        ],
      },
    ],
  },

  /* ====================================================================== */
  {
    id: 'igd_kejang_demam',
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
          { id: 'a', label: 'Miringkan, bebaskan jalan napas, beri oksigen', benar: true, efekStabilitas: 20, respons: 'Benar — posisi pemulihan mencegah aspirasi. Airway selalu prioritas pertama.' },
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
    // paru (WHO Dengue Guidelines 2009/2011; PAPDI Protokol 5 DSS Dewasa).
    clue: 'Fase kritis dengue (demam turun H4-6 + tanda syok: akral dingin, nadi cepat-lemah, tekanan nadi ≤20 mmHg, TD MASIH TERUKUR) = DSS TERKOMPENSASI. RESUSITASI: kristaloid (RL/NaCl 0,9%) 5-10 mL/kgBB/JAM infus selama 1 jam (BUKAN bolus cepat — bolus 10-20 mL/kg/15-30 menit hanya utk syok DEKOMPENSATA/TD tak terukur), evaluasi ulang berkala & titrasi turun bertahap sesuai perfusi. JANGAN NSAID/aspirin — parasetamol saja (WHO Dengue Guidelines 2009/2011; PAPDI Protokol 5).',
    langkah: [
      {
        id: 'd1',
        narasi: 'Akral dingin, tekanan nadi menyempit (90/80), CRT >3 detik. Tindakan pertama?',
        pilihan: [
          { id: 'a', label: 'Pasang infus, kristaloid 5-10 mL/kgBB/jam (infus 1 jam) — syok terkompensasi', benar: true, efekStabilitas: 25, respons: 'Tepat — DSS TERKOMPENSASI (TD 90/80 masih terukur, nadi teraba meski lemah) ditangani infus kristaloid 5-10 mL/kgBB/jam, BUKAN bolus cepat. Bolus 10-20 mL/kg dalam <30 menit direservasi utk syok DEKOMPENSATA (TD tak terukur) — dipakai berlebihan berisiko fluid overload/edema paru.' },
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
]
