/**
 * KASUS METABOLIK & MUSKULOSKELETAL — batch M3 (10 kasus).
 *
 * Ditulis terhadap kontrak `KasusKlinis` (src/content/types.ts). Semua id obat/lab/
 * edukasi/tindakan memakai palet kanonik M3_CONTENT_SPEC. Akurasi klinis mengikuti
 * guideline nasional (PPK Perhimpunan, PERKENI, Kemenkes, ACR/EULAR, JNC/PERKI) —
 * lihat tiap `clue` & `obatSalahUmum`.
 *
 * Prefiks id kategori: `mm_` (metabolik-muskuloskeletal) untuk hindari bentrok.
 *
 * Wajib-rujuk (harusDirujuk: true, spesialisRujukan: penyakit_dalam):
 *   - mm_artritis_reumatoid (3A)  — DMARD di luar kompetensi FKTP
 *   - mm_hipertensi_urgensi (3B)  — TD sangat tinggi, turunkan bertahap + rujuk
 *   - mm_gagal_jantung_kongestif (3B) — stabilisasi pra-rujuk, butuh ekokardiografi
 */

import type { KasusKlinis } from '../types'

export const KASUS_METABOLIK_MSK: KasusKlinis[] = [
  /* ======================================================================
   * 1. Gout — Artritis Gout Akut (serangan akut)
   * Poin ajar: serangan AKUT → NSAID/kolkisin. JANGAN memulai allopurinol saat
   * serangan akut (memperpanjang & memperberat serangan). MTP-1 klasik (podagra).
   * ==================================================================== */
  {
    id: 'mm_gout_artritis_akut',
    nama: 'Artritis Gout Akut (Serangan Akut)',
    icd10: 'M10.9',
    skdi: '4A',
    kategori: 'muskuloskeletal',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Jempol kaki saya bengkak merah dan nyeri hebat dok, tadi malam mendadak.',
    demografi: { usiaMin: 40, usiaMax: 65, jenisKelamin: 'L' },
    vital: { td: '135/85', nadi: 92, rr: 18, suhu: 37.6 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Coba ceritakan, sakitnya di mana dan seperti apa?',
        jawab: 'Pangkal jempol kaki kanan dok, bengkak merah mengkilap, nyerinya luar biasa sampai kesenggol selimut saja perih.',
        variasi: {
          polos: 'Jempol sikil kanan dok, abuh abang, lorone ora karu-karuan, kesrèmpèt kemul waé wis njerit.',
          terpelajar: 'Nyeri mendadak di pangkal ibu jari kaki kanan dok, sendinya merah, bengkak, dan hangat — disentuh sedikit saja sakit sekali.',
          lansia: 'Ibu jari kaki saya ini Nak, bengkak besar semalam, sakitnya sampai tidak bisa tidur.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter', 'keparahan'],
      },
      {
        id: 'q_onset',
        kategori: 'keluhan_utama',
        tanya: 'Munculnya mendadak atau pelan-pelan? Kapan puncak sakitnya?',
        jawab: 'Mendadak dok, tadi malam bangun tidur langsung sakit hebat, puncaknya dalam beberapa jam saja.',
        esensial: true,
        oldcarts: ['onset', 'waktu'],
      },
      {
        id: 'q_pemicu',
        kategori: 'rps',
        tanya: 'Semalam sempat makan apa? Ada pesta atau makan jeroan/seafood?',
        jawab: 'Kemarin habis kondangan dok, makan sate kambing banyak dan minum-minum sedikit.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah serangan seperti ini sebelumnya? Di sendi yang sama?',
        jawab: 'Setahun lalu pernah dok, di jempol yang sama, sembuh sendiri seminggu.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Ada demam menggigil, atau sendi lain ikut sakit?',
        jawab: 'Cuma anget-anget saja dok, sendi lain tidak. Cuma satu jempol ini.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_maag',
        kategori: 'rpd',
        tanya: 'Punya riwayat sakit maag atau lambung? Sedang minum obat apa?',
        jawab: 'Kadang perih kalau telat makan dok, tapi tidak sampai parah. Tidak minum obat rutin.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_ginjal',
        kategori: 'rpd',
        tanya: 'Ada riwayat sakit ginjal atau kencing batu?',
        jawab: 'Tidak ada dok, kencing lancar.',
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Ada riwayat alergi obat? Terutama obat antinyeri seperti ibuprofen atau diklofenak?',
        jawab: 'Iya dok, dulu pernah bentol-bentol seluruh badan dan bibir bengkak setelah minum obat nyeri dari warung — kata mantri itu alergi obat antinyeri.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      // distraktor: golongan darah tidak menentukan tata laksana gout akut.
      {
        id: 'q_goldar',
        kategori: 'sosial',
        tanya: 'Golongan darahnya apa Pak?',
        jawab: 'B dok. Kenapa ya?',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'ekstremitas', temuan: 'Sendi MTP-1 kanan: edema, eritema mengkilap, teraba hangat, sangat nyeri tekan (podagra). ROM terbatas karena nyeri.', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, tampak kesakitan saat kaki bergerak. Habitus overweight.', relevan: true },
      { region: 'kulit', temuan: 'Tidak tampak tofus di aurikula/olekranon saat ini; kulit di atas sendi tegang.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-).', relevan: false },
      { region: 'abdomen', temuan: 'Datar, supel, nyeri tekan epigastrium (-).', relevan: false },
    ],
    lab: [
      { id: 'asam_urat_darah', hasil: 'Asam urat 9.2 mg/dL (tinggi). Catatan: kadar dapat normal saat serangan akut, diagnosis tetap klinis.', flag: 'tinggi', relevan: true },
      { id: 'darah_rutin', hasil: 'Leukosit 11.200/µL (leukositosis ringan), LED sedikit meningkat.', flag: 'tinggi', relevan: false },
      { id: 'fungsi_ginjal', hasil: 'Ureum/kreatinin dalam batas normal.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['M10.9', 'M00.9', 'M06.9'],
    tatalaksana: {
      // Audit CODEX 2026-07-04: obatBenar DULU mewajibkan diklofenak+kolkisin
      // SEKALIGUS, padahal clue sendiri bilang "NSAID ATAU kolkisin" (pilih
      // salah satu). Kini grup pilih-satu — kasus ini SELALU alergiTrap NSAID
      // aktif (100%), jadi diklofenak tetap tak tercapai secara praktis
      // (firewall alergi memblokirnya); kolkisin jadi satu-satunya slot valid.
      obatBenar: [],
      obatAlternatif: [['natrium_diklofenak_50', 'kolkisin_500']],
      obatSalahUmum: [
        { id: 'allopurinol_100', alasan: 'Di FKTP, default aman: JANGAN mulai allopurinol saat serangan akut (fluktuasi asam urat memperpanjang serangan); mulai urate-lowering 2–4 minggu setelah reda + titrasi ke target <6 mg/dL. Catatan ACR 2020: memulai ULT saat serangan sebenarnya boleh HANYA bila disertai profilaksis antiinflamasi & follow-up ketat — di luar cakupan penanganan akut FKTP ini. Bila pasien SUDAH rutin allopurinol, jangan dihentikan.' },
        { id: 'amoxicillin_500', alasan: 'Gout bukan infeksi bakteri; antibiotik tidak berperan. Bila curiga artritis septik, itu justru indikasi RUJUK, bukan antibiotik oral coba-coba.' },
      ],
      edukasi: ['diet_purin', 'minum_air_cukup', 'kontrol_rutin'],
    },
    clue: 'Serangan gout AKUT (monoartritis MTP-1, onset malam, pemicu tinggi purin) → redakan radang dulu dengan NSAID (natrium diklofenak) ATAU kolkisin. ATURAN EMAS: JANGAN mulai allopurinol saat serangan; bila pasien sudah rutin allopurinol JANGAN dihentikan. Mulai/titrasi urate-lowering 2–4 minggu setelah reda, target asam urat <6 mg/dL (PPK PAPDI / ACR 2020).',
    // M11 (perintis lapisan pengayaan — dari ide asal user): mutiara "temuan
    // bisa menyesatkan" + catatan realita FKTP.
    mutiaraEbm: 'Kadar asam urat serum bisa NORMAL bahkan RENDAH saat serangan akut (asam urat berpindah ke sendi/mengendap) — hasil normal TIDAK menyingkirkan gout. Diagnosis serangan akut tetap KLINIS (monoartritis MTP-1 mendadak, merah-nyeri hebat); baku emas = kristal MSU di cairan sendi.',
    catatanRealita: 'Kolkisin sering TAK selalu tersedia di semua Puskesmas — bila kosong, NSAID (natrium diklofenak) adalah tumpuan analgesik antiradang akut yang hampir selalu ada. Kenali keduanya: tahu obat "buku" DAN obat yang realistis di rak FKTP-mu.',
    konsekuensi: {
      narasi: 'Bila allopurinol dimulai saat serangan akut, nyeri justru berkepanjangan dan pasien menganggap obat "tidak cocok" lalu berhenti — kontrol jangka panjang gagal.',
      kembaliHariMin: 2,
      kembaliHariMax: 5,
      kondisiKembali: 'Pasien kembali dengan serangan yang malah memberat atau berpindah ke sendi lain, mengeluh obat "bikin tambah sakit".',
      guideline: 'ACR 2020 Gout Guideline / PPK PAPDI — anti-inflamasi saat akut, urate-lowering ditunda pasca-serangan.',
    },
    alergiTrap: {
      kelas: 'nsaid',
      obatTerlarang: ['natrium_diklofenak_50', 'ibuprofen_400', 'asam_mefenamat_500', 'meloksikam_15'],
      // Kosong: kolkisin_500 sudah anggota grupAlternatif di atas — trap cukup
      // menyaring diklofenak keluar dari grup itu (clinic.ts), tak perlu
      // menambah alternatif baru (dulu duplikat kolkisin_500 di dua tempat).
      alternatifBenar: [],
    },
  },

  /* ======================================================================
   * 2. Dislipidemia
   * Poin ajar: risiko kardiovaskular, statin + perubahan gaya hidup; bukan asimtomatik = tak perlu diobati.
   * ==================================================================== */
  {
    id: 'mm_dislipidemia',
    nama: 'Dislipidemia',
    icd10: 'E78.5',
    skdi: '4A',
    kategori: 'metabolik',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Ini dok hasil cek lab dari kantor, katanya kolesterol saya tinggi.',
    demografi: { usiaMin: 40, usiaMax: 60 },
    vital: { td: '138/88', nadi: 80, rr: 18, suhu: 36.6 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Ada keluhan yang dirasakan, atau ini dari pemeriksaan rutin?',
        jawab: 'Sebenarnya tidak ada keluhan dok, cuma dari medical check-up kantor kolesterolnya tinggi, saya jadi khawatir.',
        variasi: {
          polos: 'Ora ana keluhan dok, mung wingi mriksa tekan kantor jaré kolesterolé dhuwur.',
          terpelajar: 'Tidak ada keluhan dok, ini ketahuan waktu pemeriksaan kolesterol rutin di kantor — kolesterol jahat saya tinggi.',
          cemas: 'Saya takut kena stroke dok, bapak saya dulu meninggal karena serangan jantung.',
        },
        esensial: true,
        oldcarts: ['onset'],
      },
      {
        id: 'q_makan',
        kategori: 'sosial',
        tanya: 'Pola makannya bagaimana? Sering gorengan, jeroan, santan?',
        jawab: 'Sering dok, tiap hari gorengan, suka jeroan dan santan juga.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_aktivitas',
        kategori: 'sosial',
        tanya: 'Sehari-hari banyak gerak atau lebih banyak duduk?',
        jawab: 'Kerja kantoran dok, duduk terus, hampir tidak pernah olahraga.',
        esensial: true,
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada riwayat jantung, stroke, atau kolesterol tinggi?',
        jawab: 'Bapak saya meninggal karena serangan jantung usia 55 dok.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_rokok',
        kategori: 'sosial',
        tanya: 'Merokok? Berapa batang sehari?',
        jawab: 'Iya dok, sekitar satu bungkus sehari sejak muda.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_dm',
        kategori: 'rpd',
        tanya: 'Ada riwayat kencing manis atau darah tinggi?',
        jawab: 'Belum pernah diperiksa gula dok, tekanan darah katanya suka agak tinggi.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_nyeri_dada',
        kategori: 'rps',
        tanya: 'Pernah nyeri dada saat aktivitas, atau sesak saat naik tangga?',
        jawab: 'Tidak dok, masih kuat naik tangga, tidak pernah nyeri dada.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Ada riwayat alergi atau reaksi tidak cocok terhadap obat? Termasuk obat kolesterol?',
        jawab: 'Dulu pernah dikasih obat kolesterol dok, badan saya gatal-gatal kemerahan dan nyeri otot hebat sampai saya berhenti — kata dokternya saya tidak cocok golongan statin.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      // distraktor: kebiasaan minum kopi bukan faktor tata laksana dislipidemia inti.
      {
        id: 'q_kopi',
        kategori: 'sosial',
        tanya: 'Suka minum kopi berapa gelas sehari?',
        jawab: 'Dua sampai tiga gelas dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Habitus obesitas sentral, lingkar perut melebihi normal. IMT 29.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-), tidak ada gallop.', relevan: true },
      { region: 'mata', temuan: 'Tidak tampak arkus kornea maupun xantelasma yang jelas.', relevan: true },
      { region: 'ekstremitas', temuan: 'Tidak tampak xantoma tendon. Pulsasi perifer teraba baik.', relevan: false },
      { region: 'abdomen', temuan: 'Lemak abdominal tebal, hepar sulit dinilai, bising usus normal.', relevan: false },
    ],
    lab: [
      { id: 'profil_lipid', hasil: 'Kolesterol total 268, LDL 182 (tinggi), HDL 38 (rendah), Trigliserida 210 (tinggi).', flag: 'tinggi', relevan: true },
      { id: 'gdp', hasil: 'Gula darah puasa 108 mg/dL (prediabetes borderline).', flag: 'tinggi', relevan: true },
      { id: 'sgot_sgpt', hasil: 'SGOT/SGPT dalam batas normal (baseline sebelum statin).', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['E78.5', 'E78.0', 'E78.1'],
    tatalaksana: {
      obatBenar: ['simvastatin_20'],
      obatSalahUmum: [
        { id: 'natrium_diklofenak_50', alasan: 'Dislipidemia tidak nyeri; NSAID tidak ada indikasi dan justru menambah risiko kardiovaskular/ginjal.' },
      ],
      edukasi: ['gizi_seimbang', 'aktivitas_fisik', 'berhenti_merokok', 'kontrol_rutin'],
    },
    clue: 'Dislipidemia sering ASIMTOMATIK — jangan meremehkan hanya karena tak ada keluhan. Nilai risiko KV total (LDL tinggi + perokok + riwayat keluarga dini + TD tinggi). Terapi: perubahan gaya hidup WAJIB + statin (simvastatin malam hari). Cek SGOT/SGPT baseline. Simvastatin diminum malam (PPK PERKI / Kemenkes PTM).',
    // M11 Bagian B11 (DeepThink 2026-07-10, REFRAME bukan tolak — kasus ini
    // fit-nya buruk utk FH: LDL kasus di bawah ambang, pola CAMPURAN khas
    // metabolik. Dibingkai jadi kontras/ambang-picu, bukan diagnosis kasus ini).
    mutiaraEbm: 'LDL ≥190 mg/dL yang TERISOLASI + riwayat jantung dini keluarga bukan sekadar "kolesterol gaya hidup" — curigai Hiperkolesterolemia Familial (FH, ~1:250) & rujuk skrining kaskade keluarga. Pola CAMPURAN seperti kasus ini (TG tinggi, HDL rendah, obesitas) justru condong ke dislipidemia metabolik, bukan FH.',
    // M11 Bagian B12 (DeepThink 2026-07-10, REVISI MINOR: atorvastatin
    // sebenarnya ADA di Fornas dengan restriksi, bukan "tak masuk stok" mutlak).
    catatanRealita: 'Di praktik FKTP, statin yang tersedia lazimnya hanya simvastatin (intensitas sedang); atorvastatin/rosuvastatin intensitas tinggi ada di Fornas tapi jarang ada di rak Puskesmas. Pemantauan ulang lipid/SGOT-SGPT sering terlewat, dan pasien kerap putus obat karena merasa "tak ada keluhan".',
    konsekuensi: {
      narasi: 'Bila diabaikan karena "tidak ada keluhan", akumulasi plak aterosklerosis berjalan diam-diam menuju infark miokard atau stroke.',
      // M10 Batch-2 (CODEX C.9): 90-180 hari TAK PERNAH terjangkau dlm stase
      // 90 hari (karier) apalagi 30 (ujian) — konsekuensi jadi teks mati.
      // Dikompresi ke 45-80 mengikuti konvensi kompresi-waktu game yang sama
      // dgn Prolanis "bulanan" (realita: horizon dislipidemia bertahun —
      // kandidat catatan EBM-nuance M11).
      kembaliHariMin: 45,
      kembaliHariMax: 80,
      kondisiKembali: 'Pasien kembali untuk kontrol dengan LDL tetap tinggi karena tidak minum obat dan gaya hidup tak berubah; TD makin tinggi.',
      guideline: 'Pedoman PTM Kemenkes / PERKI Dislipidemia — statin + modifikasi gaya hidup berbasis risiko KV.',
    },
    alergiTrap: {
      kelas: 'statin',
      obatTerlarang: ['simvastatin_20'],
      alternatifBenar: ['ezetimibe_10'],
    },
  },

  /* ======================================================================
   * 3. Obesitas
   * Poin ajar: intervensi gaya hidup lini utama; bukan diobati dengan obat pelangsing sembarangan.
   * ==================================================================== */
  {
    id: 'mm_obesitas',
    nama: 'Obesitas',
    icd10: 'E66.9',
    skdi: '4A',
    kategori: 'metabolik',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Berat badan saya naik terus dok, sekarang gampang capek dan sesak kalau jalan agak jauh.',
    demografi: { usiaMin: 25, usiaMax: 50 },
    vital: { td: '134/86', nadi: 84, rr: 18, suhu: 36.6 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Apa yang paling mengganggu dari kenaikan berat badan ini?',
        jawab: 'Cepat lelah dok, napas ngos-ngosan kalau naik tangga, dan lutut mulai terasa berat.',
        variasi: {
          polos: 'Gampang kesel dok, munggah undhak-undhakan waé wis menggeh-menggeh.',
          terpelajar: 'Saya jadi cepat capek dok, agak sesak kalau banyak bergerak, dan lutut nyeri saat dipakai.',
          cemas: 'Saya takut kena diabetes atau jantung dok, badan makin melar dan susah turun.',
        },
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_makan',
        kategori: 'sosial',
        tanya: 'Pola makannya bagaimana? Porsi, ngemil, minuman manis?',
        jawab: 'Suka ngemil malam dok, minuman manis tiap hari, porsi nasi juga banyak.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_aktivitas',
        kategori: 'sosial',
        tanya: 'Aktivitas fisiknya bagaimana? Ada olahraga rutin?',
        jawab: 'Hampir tidak ada dok, kerja duduk, ke mana-mana naik motor.',
        esensial: true,
      },
      {
        id: 'q_tidur',
        kategori: 'rps',
        tanya: 'Tidurnya nyenyak? Ada mendengkur keras atau berhenti napas saat tidur?',
        jawab: 'Kata istri saya ngorok keras dok, kadang seperti tersedak lalu terbangun.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_tiroid',
        kategori: 'rps',
        tanya: 'Ada rasa lemas berlebihan, tidak tahan dingin, atau leher membesar?',
        jawab: 'Tidak dok, tidak ada leher membesar, tahan dingin biasa saja.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada yang gemuk, diabetes, atau darah tinggi?',
        jawab: 'Ibu saya diabetes dok, kakak juga gemuk.',
        oldcarts: ['penyerta'],
      },
      // distraktor: hobi tidak menentukan tata laksana obesitas.
      {
        id: 'q_hobi',
        kategori: 'sosial',
        tanya: 'Hobinya apa Pak/Bu di waktu luang?',
        jawab: 'Nonton TV dan main HP dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'IMT 33 kg/m² (obesitas derajat II). Lingkar perut laki-laki >90 cm / perempuan >80 cm (obesitas sentral).', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-). TD borderline tinggi.', relevan: true },
      { region: 'kulit', temuan: 'Akantosis nigrikans di lipatan leher (tanda resistensi insulin).', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-. Ekspansi dada terbatas oleh lemak.', relevan: false },
      { region: 'ekstremitas', temuan: 'Lutut tidak edema, ROM penuh, krepitasi ringan.', relevan: false },
    ],
    lab: [
      { id: 'gdp', hasil: 'Gula darah puasa 118 mg/dL (prediabetes/glukosa puasa terganggu).', flag: 'tinggi', relevan: true },
      { id: 'profil_lipid', hasil: 'Trigliserida 240 tinggi, HDL 34 rendah — dislipidemia aterogenik.', flag: 'tinggi', relevan: true },
      { id: 'tsh', hasil: 'TSH normal — menyingkirkan hipotiroid sebagai penyebab.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['E66.9', 'E66.0', 'E03.9'],
    tatalaksana: {
      obatBenar: [],
      obatSalahUmum: [
        { id: 'furosemid_40', alasan: 'Diuretik BUKAN untuk menurunkan berat badan — hanya mengurangi cairan sesaat, tidak menyentuh lemak, dan berisiko dehidrasi/gangguan elektrolit. Ini malpraktik pelangsing yang umum.' },
      ],
      edukasi: ['gizi_seimbang', 'aktivitas_fisik', 'kontrol_rutin', 'higiene_tidur'],
    },
    clue: 'Obesitas: LINI UTAMA adalah intervensi gaya hidup — defisit kalori bertahap + aktivitas fisik 150 menit/minggu, target turun 5–10% BB dalam 6 bulan. Skrining komorbid (GDP, lipid, TD) & singkirkan hipotiroid (TSH). Farmakoterapi/bedah bukan ranah rutin FKTP. HINDARI diuretik/pencahar sebagai "pelangsing" (Pedoman PTM Kemenkes / PERKENI).',
    konsekuensi: {
      narasi: 'Tanpa modifikasi gaya hidup, obesitas berlanjut ke diabetes tipe 2, hipertensi, dislipidemia, dan OSA — beban komorbid menumpuk.',
      // M10 Batch-2 (CODEX C.9): dikompresi 90-180 → 45-80 (lihat catatan
      // dislipidemia — konvensi kompresi-waktu game; realita bertahun).
      kembaliHariMin: 45,
      kembaliHariMax: 80,
      kondisiKembali: 'Pasien kembali dengan gula darah puasa yang sudah masuk kriteria diabetes dan tekanan darah menetap tinggi.',
      guideline: 'Pedoman PTM Kemenkes / PERKENI — manajemen berat badan berbasis gaya hidup.',
    },
  },

  /* ======================================================================
   * 4. Osteoartritis Lutut
   * Poin ajar: nyeri mekanik lansia, kaku pagi <30 menit, krepitasi; parasetamol/NSAID
   * + latihan penguatan + turun BB. Bukan rujuk rutin.
   * ==================================================================== */
  {
    id: 'mm_osteoartritis_lutut',
    nama: 'Osteoartritis Lutut',
    icd10: 'M17.9',
    // M9.2 follow-up (2026-07-11): self-report '4A' keliru — PPK/SKDI 2012
    // Lampiran-3 "Artritis, osteoarthritis" (entri gabungan) = 3A (dossier §26/§32).
    skdi: '3A',
    kategori: 'muskuloskeletal',
    fktp144: false,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Lutut saya nyeri dok, terutama kalau jalan jauh atau naik-turun tangga.',
    demografi: { usiaMin: 55, usiaMax: 75, jenisKelamin: 'P' },
    vital: { td: '140/85', nadi: 78, rr: 18, suhu: 36.6 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Nyerinya di sebelah mana, dan kapan paling terasa?',
        jawab: 'Kedua lutut dok, kanan lebih parah. Nyeri saat jalan jauh, naik-turun tangga, dan jongkok berdiri.',
        variasi: {
          polos: 'Dhengkul loro-lorone dok, sing tengen luwih loro, yèn munggah undhakan lan jèngkèng ngadeg lara banget.',
          terpelajar: 'Kedua lutut nyeri dok, terutama saat menahan beban seperti berjalan atau naik tangga, dan reda kalau diistirahatkan.',
          lansia: 'Lutut saya ini Nak, kalau dibawa jalan ke pasar sakitnya bukan main, mau jongkok pun susah.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'agravasi', 'karakter'],
      },
      {
        id: 'q_kaku',
        kategori: 'keluhan_utama',
        tanya: 'Pagi bangun tidur lututnya kaku? Berapa lama sampai bisa lemas lagi?',
        jawab: 'Kaku sebentar dok, paling sepuluh-lima belas menit lalu bisa jalan lagi.',
        esensial: true,
        oldcarts: ['waktu', 'durasi'],
      },
      {
        id: 'q_bunyi',
        kategori: 'rps',
        tanya: 'Ada bunyi gemeretak saat lutut ditekuk?',
        jawab: 'Iya dok, sering ada bunyi kretek-kretek kalau ditekuk.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_bengkak',
        kategori: 'rps',
        tanya: 'Lututnya pernah bengkak, merah, atau panas mendadak?',
        jawab: 'Kadang agak bengkak dok kalau kecapekan, tapi tidak merah dan tidak panas.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_sendi_lain',
        kategori: 'rps',
        tanya: 'Sendi lain seperti jari-jari tangan ikut kaku lama di pagi hari?',
        jawab: 'Tidak dok, cuma lutut. Jari tangan biasa saja.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_bb',
        kategori: 'sosial',
        tanya: 'Berat badannya bagaimana? Naik akhir-akhir ini?',
        jawab: 'Gemuk dok dari dulu, susah turun.',
      },
      {
        id: 'q_maag',
        kategori: 'rpd',
        tanya: 'Ada riwayat sakit maag atau darah tinggi?',
        jawab: 'Maag kadang kambuh dok, dan tekanan darah suka tinggi.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Ada riwayat alergi obat, terutama obat antinyeri/rematik?',
        jawab: 'Ada dok — obat rematik yang dulu bikin saya bentol-bentol dan sesak, kata dokter alergi obat antinyeri golongan NSAID.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      // distraktor: riwayat operasi caesar tidak relevan dengan OA lutut.
      {
        id: 'q_operasi',
        kategori: 'rpd',
        tanya: 'Pernah operasi caesar dulu?',
        jawab: 'Pernah dok, dua kali. Tapi sudah lama sekali.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'ekstremitas', temuan: 'Krepitasi kasar kedua lutut saat fleksi-ekstensi, nyeri tekan garis sendi medial, ROM sedikit terbatas di akhir gerakan. Deformitas varus ringan lutut kanan.', relevan: true },
      { region: 'umum', temuan: 'Obesitas (IMT 31). Cara jalan antalgik, menopang lutut kanan.', relevan: true },
      { region: 'ekstremitas', temuan: 'Tidak ada eritema/hangat mencolok; efusi minimal lutut kanan. Tanda inflamasi sistemik (-).', relevan: true },
      { region: 'kulit', temuan: 'Tidak ada tofus, tidak ada ruam.', relevan: false },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-).', relevan: false },
    ],
    lab: [
      { id: 'asam_urat_darah', hasil: 'Asam urat 5.4 mg/dL (normal) — menyingkirkan gout sebagai penyebab.', flag: 'normal', relevan: true },
      { id: 'darah_rutin', hasil: 'LED normal, leukosit normal — mendukung proses degeneratif, bukan inflamasi sistemik.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['M17.9', 'M10.9', 'M06.9'],
    tatalaksana: {
      // Audit CODEX 2026-07-04: meloksikam DULU wajib bersama parasetamol,
      // padahal clue bilang "parasetamol DULU, NSAID BILA PERLU" — eskalasi
      // kondisional, bukan kombinasi wajib. Parasetamol sendiri sudah jawaban
      // benar lengkap (NSAID pun tak tercapai — trap NSAID 100% aktif di kasus ini).
      obatBenar: ['paracetamol_500'],
      obatSalahUmum: [
        { id: 'prednison_5', alasan: 'Kortikosteroid oral TIDAK diindikasikan untuk OA — OA bukan penyakit inflamasi sistemik; steroid rutin hanya menimbulkan efek samping (osteoporosis, gula naik) tanpa manfaat.' },
        { id: 'allopurinol_100', alasan: 'Ini bukan gout (asam urat normal, nyeri mekanik) — allopurinol tidak ada indikasinya.' },
      ],
      edukasi: ['peregangan_sendi', 'aktivitas_fisik', 'gizi_seimbang', 'postur_ergonomi'],
    },
    clue: 'Osteoartritis lutut: nyeri MEKANIK (memberat aktivitas, mereda istirahat) + kaku pagi SINGKAT (<30 menit) + krepitasi + usia lanjut, TANPA tanda inflamasi sistemik. Tata laksana: edukasi + latihan penguatan kuadrisep + turun BB + analgetik (parasetamol dulu, NSAID bila perlu; hati-hati lambung/ginjal/TD). Rontgen bukan syarat diagnosis (klinis cukup). Rujuk hanya bila kandidat operasi/sendi gagal (PPK / OARSI).',
    konsekuensi: {
      narasi: 'Bila hanya diberi obat tanpa latihan & turunkan berat badan, kekuatan otot paha terus menurun, nyeri berulang, dan sendi makin cepat rusak.',
      kembaliHariMin: 21,
      kembaliHariMax: 60,
      kondisiKembali: 'Pasien kembali dengan nyeri makin sering dan mulai sulit berjalan; berharap obat yang lebih kuat.',
      guideline: 'PPK Osteoartritis / OARSI — olahraga & manajemen berat sebagai fondasi, farmakoterapi menjunjang.',
    },
    alergiTrap: {
      kelas: 'nsaid',
      obatTerlarang: ['meloksikam_15', 'ibuprofen_400', 'natrium_diklofenak_50', 'asam_mefenamat_500'],
      // Kosong: parasetamol_500 sudah satu-satunya obatBenar — tak perlu
      // menambah alternatif baru (dulu duplikat parasetamol_500 di dua tempat).
      alternatifBenar: [],
    },
  },

  /* ======================================================================
   * 5. Low Back Pain (Nyeri Punggung Bawah Mekanik)
   * Poin ajar: LBP mekanik tanpa red flag → edukasi + analgetik + tetap aktif,
   * BUKAN rujuk/rontgen rutin/tirah baring total.
   * ==================================================================== */
  {
    id: 'mm_low_back_pain',
    nama: 'Low Back Pain Mekanik (Nyeri Punggung Bawah)',
    icd10: 'M54.5',
    skdi: '4A',
    kategori: 'muskuloskeletal',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Pinggang saya sakit dok, sejak kemarin habis angkat galon air.',
    demografi: { usiaMin: 25, usiaMax: 50 },
    vital: { td: '124/78', nadi: 76, rr: 18, suhu: 36.5 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Coba ceritakan sakit pinggangnya — mulai kapan dan bagaimana rasanya?',
        jawab: 'Sejak kemarin dok, habis angkat galon air posisinya salah. Pinggang bawah pegal dan nyeri kalau membungkuk.',
        variasi: {
          polos: 'Kawit wingi dok, sawisé ngangkat galon salah posisi. Boyoké lara yèn dienggo mbungkuk.',
          terpelajar: 'Nyeri pinggang muncul mendadak dok, terpicu saat saya mengangkat beban sambil membungkuk.',
          cemas: 'Sakit sekali dok, saya takut ini saraf kejepit atau tulang saya bergeser.',
        },
        esensial: true,
        oldcarts: ['onset', 'lokasi', 'agravasi'],
      },
      {
        id: 'q_menjalar',
        kategori: 'keluhan_utama',
        tanya: 'Nyerinya menjalar ke bokong atau turun ke kaki sampai bawah lutut?',
        jawab: 'Tidak dok, cuma di pinggang saja, tidak menjalar ke kaki.',
        esensial: true,
        oldcarts: ['radiasi'],
      },
      {
        id: 'q_neuro',
        kategori: 'rps',
        tanya: 'Ada kesemutan, baal, atau kaki terasa lemah?',
        jawab: 'Tidak ada dok, kaki masih kuat dan tidak kebas.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_bak',
        kategori: 'rps',
        tanya: 'BAK dan BAB masih normal? Ada ngompol atau sulit menahan?',
        jawab: 'Normal dok, tidak ada masalah pipis atau BAB.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_redflag',
        kategori: 'rps',
        tanya: 'Ada demam, berat badan turun drastis, atau nyeri hebat saat berbaring malam?',
        jawab: 'Tidak dok, tidak demam, berat badan stabil, kalau berbaring justru enakan.',
        esensial: true,
        oldcarts: ['penyerta', 'waktu'],
      },
      {
        id: 'q_kerja',
        kategori: 'sosial',
        tanya: 'Pekerjaannya banyak mengangkat beban atau duduk lama?',
        jawab: 'Kerja di gudang dok, sering angkat-angkat barang.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_trauma',
        kategori: 'rpd',
        tanya: 'Pernah jatuh keras, kecelakaan, atau ada riwayat kanker?',
        jawab: 'Tidak ada dok, tidak pernah jatuh keras, tidak ada riwayat kanker.',
      },
      {
        id: "q_alergi",
        kategori: 'rpd',
        tanya: "Ada riwayat alergi obat, termasuk obat antinyeri?",
        jawab: "Tidak ada dok, selama ini aman.",
        esensial: true,
      },
      // distraktor: preferensi kasur tidak menentukan tata laksana LBP akut.
      {
        id: 'q_kasur',
        kategori: 'sosial',
        tanya: 'Tidurnya pakai kasur busa atau lantai?',
        jawab: 'Kasur busa biasa dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'ekstremitas', temuan: 'Nyeri tekan otot paravertebral lumbal, spasme (+). ROM lumbal terbatas nyeri saat fleksi. Straight Leg Raise negatif bilateral.', relevan: true },
      { region: 'neurologis', temuan: 'Kekuatan motorik tungkai 5/5, refleks patella & achilles simetris normal, sensorik normal — tanpa defisit neurologis.', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, tidak demam, jalan sedikit hati-hati menjaga pinggang.', relevan: true },
      { region: 'abdomen', temuan: 'Datar, supel, nyeri tekan (-), tidak ada massa pulsatil.', relevan: false },
      { region: 'kulit', temuan: 'Tidak ada ruam herpes zoster di dermatom pinggang.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Tidak diindikasikan pada LBP mekanik tanpa red flag — dicantumkan hanya bila curiga infeksi/keganasan.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['M54.5', 'M51.1', 'M54.4'],
    tatalaksana: {
      // Audit CODEX 2026-07-04: NSAID+parasetamol DULU wajib sekaligus,
      // padahal clue bilang "analgetik (parasetamol/NSAID)" — pilih salah
      // satu, tanpa alergiTrap yg menetralkan (kasus ini bukan trap).
      obatBenar: [],
      obatAlternatif: [['natrium_diklofenak_50', 'paracetamol_500']],
      obatSalahUmum: [
        { id: 'tramadol_50', alasan: 'Opioid tidak diperlukan untuk LBP mekanik akut tanpa red flag — risiko ketergantungan & sedasi melebihi manfaat; analgetik sederhana + tetap aktif sudah cukup.' },
      ],
      edukasi: ['postur_ergonomi', 'aktivitas_fisik', 'peregangan_sendi'],
    },
    clue: 'Low back pain mekanik tanpa RED FLAG (tanpa defisit neurologis, tanpa gangguan BAK/BAB, tanpa demam/BB turun/riwayat kanker/trauma berat) → tata laksana KONSERVATIF: edukasi + analgetik (parasetamol/NSAID) + TETAP AKTIF (hindari tirah baring total) + koreksi ergonomi. JANGAN rontgen/rujuk rutin — pencitraan hanya bila ada red flag (PPK Nyeri Punggung Bawah / NICE LBP).',
    konsekuensi: {
      narasi: 'Rontgen & rujukan rutin tanpa red flag membuang biaya, meningkatkan kecemasan ("takut tulang rusak"), dan mendorong tirah baring berlebih yang justru memperlambat pemulihan.',
      kembaliHariMin: 7,
      kembaliHariMax: 21,
      kondisiKembali: 'Pasien kembali karena terlalu takut bergerak akibat nasihat keliru, otot makin kaku dan nyeri berkepanjangan (fear-avoidance).',
      guideline: 'PPK LBP / NICE NG59 — hindari pencitraan rutin, tetap aktif, terapi konservatif.',
    },
  },

  /* ======================================================================
   * 6. Mialgia
   * Poin ajar: nyeri otot difus setelah aktivitas berlebih; simtomatik, self-limiting.
   * Jangan overtreat/antibiotik.
   * ==================================================================== */
  {
    id: 'mm_mialgia',
    nama: 'Mialgia (Nyeri Otot)',
    icd10: 'M79.1',
    skdi: '4A',
    kategori: 'muskuloskeletal',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Badan saya pegal-pegal semua dok, terutama otot lengan dan bahu.',
    demografi: { usiaMin: 20, usiaMax: 55 },
    vital: { td: '120/78', nadi: 78, rr: 18, suhu: 36.7 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Pegalnya di mana saja? Otot atau sendi?',
        jawab: 'Otot dok, lengan, bahu, sama betis. Bukan di sendinya, tapi di dagingnya terasa pegal.',
        variasi: {
          polos: 'Awakku kesel kabèh dok, ototé sing loro, dudu sendiné.',
          terpelajar: 'Nyeri otot menyebar dok, di lengan, bahu, dan betis, tapi sendinya tidak ikut sakit.',
          lansia: 'Badan saya linu semua Nak, ototnya yang pegal.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_pemicu',
        kategori: 'keluhan_utama',
        tanya: 'Sebelum pegal ini, ada aktivitas berat, kerja fisik, atau olahraga tak biasa?',
        jawab: 'Iya dok, kemarin seharian pindahan rumah, angkat-angkat lemari dan kardus.',
        esensial: true,
        oldcarts: ['onset', 'agravasi'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Ada demam, batuk pilek, atau gejala flu yang menyertai?',
        jawab: 'Tidak ada dok, tidak demam, tidak batuk pilek.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_bengkak',
        kategori: 'rps',
        tanya: 'Ada sendi yang bengkak, merah, atau kaku lama di pagi hari?',
        jawab: 'Tidak dok, tidak ada yang bengkak atau merah.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_urin',
        kategori: 'rps',
        tanya: 'Air kencing warnanya normal, tidak seperti teh pekat?',
        jawab: 'Normal dok, kuning biasa.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_obat',
        kategori: 'rpd',
        tanya: 'Sedang minum obat rutin, misalnya obat kolesterol?',
        jawab: 'Tidak dok, tidak minum obat apa-apa.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_tidur',
        kategori: 'sosial',
        tanya: 'Istirahat cukup? Kualitas tidurnya bagaimana?',
        jawab: 'Kurang dok, kemarin kecapekan sampai malam.',
      },
      // distraktor: merek jam tangan jelas tak relevan.
      {
        id: 'q_kopi',
        kategori: 'sosial',
        tanya: 'Sering begadang dan minum kopi kuat?',
        jawab: 'Kadang dok kalau lembur.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'ekstremitas', temuan: 'Nyeri tekan otot lengan atas, deltoid, dan gastrocnemius. Tidak ada bengkak/eritema. Kekuatan otot 5/5.', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, afebris, tampak sehat, hanya mengeluh pegal saat bergerak.', relevan: true },
      { region: 'ekstremitas', temuan: 'Sendi-sendi tidak bengkak, tidak nyeri, ROM penuh — mengarah ke otot bukan sendi.', relevan: true },
      { region: 'kulit', temuan: 'Tidak ada ruam, tidak ada tanda radang lokal.', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Tidak diindikasikan pada mialgia mekanik pasca-aktivitas tanpa gejala sistemik.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['M79.1', 'M54.5', 'M06.9'],
    tatalaksana: {
      obatBenar: [],
      // Analgetik simtomatik setara — beri SALAH SATU (parasetamol ATAU NSAID).
      obatAlternatif: [['paracetamol_500', 'ibuprofen_400']],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Mialgia mekanik pasca-aktivitas bukan infeksi; antibiotik tidak ada indikasinya sama sekali.' },
        { id: 'dexamethasone_05', alasan: 'Kortikosteroid untuk pegal otot biasa adalah overtreatment berbahaya — efek samping jauh melebihi manfaat pada keluhan swasirna.' },
      ],
      edukasi: ['istirahat_cukup', 'peregangan_sendi', 'postur_ergonomi'],
    },
    clue: 'Mialgia pasca-aktivitas: nyeri OTOT difus (bukan sendi), pemicu kerja fisik/olahraga berlebih, TANPA demam/bengkak sendi/urin gelap. Simtomatik (parasetamol/NSAID) + istirahat + peregangan; self-limiting beberapa hari. Waspadai bendera merah: urin seperti teh (rabdomiolisis), demam (miositis viral), atau riwayat statin.',
    konsekuensi: {
      narasi: 'Overtreatment (antibiotik/steroid) pada keluhan swasirna hanya menambah risiko efek samping dan menormalkan harapan pasien akan obat berlebih.',
      kembaliHariMin: 4,
      kembaliHariMax: 10,
      kondisiKembali: 'Pasien kembali karena pegal sudah membaik sendiri, namun meminta "suntikan" atau obat kuat seperti tetangganya.',
      guideline: 'PPK Mialgia — tata laksana simtomatik, edukasi keterbatasan obat.',
    },
  },

  /* ======================================================================
   * 7. Artritis Reumatoid — WAJIB RUJUK penyakit_dalam (SKDI 3A)
   * Poin ajar: poliartritis simetris sendi kecil + kaku pagi >1 jam → DMARD di RS.
   * Kenali & rujuk; jangan hanya diberi NSAID lalu dilepas.
   * ==================================================================== */
  {
    id: 'mm_artritis_reumatoid',
    nama: 'Artritis Reumatoid',
    icd10: 'M06.9',
    skdi: '3A',
    kategori: 'muskuloskeletal',
    // CODEX ronde-16 P2: 3A (rujuk) tak mungkin "wajib tuntas 144" (4A saja).
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'penyakit_dalam',
    keluhanUtama: 'Jari-jari tangan saya kaku dan nyeri dok, terutama pagi hari lama sekali baru bisa dipakai.',
    demografi: { usiaMin: 35, usiaMax: 55, jenisKelamin: 'P' },
    vital: { td: '122/78', nadi: 82, rr: 18, suhu: 37.3 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Sendi mana yang bermasalah, dan apakah kanan-kiri sama?',
        jawab: 'Jari-jari kedua tangan dok, buku jari dan pergelangan, kanan-kiri sama-sama nyeri dan bengkak.',
        variasi: {
          polos: 'Ruas driji tangan loro-lorone dok, bengkak lan lara, tengen kiwa padha.',
          terpelajar: 'Banyak sendi nyeri dan bengkak dok, simetris di kedua tangan — buku-buku jari dan pergelangan.',
          cemas: 'Tangan saya makin kaku dok, saya takut nanti jari-jari saya bengkok tidak bisa dipakai kerja.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_kaku',
        kategori: 'keluhan_utama',
        tanya: 'Kaku pagi harinya berapa lama sampai jari bisa dipakai normal?',
        jawab: 'Lama dok, lebih dari satu jam, kadang sampai hampir dua jam baru bisa mengepal.',
        esensial: true,
        oldcarts: ['waktu', 'durasi'],
      },
      {
        id: 'q_durasi',
        kategori: 'rps',
        tanya: 'Sudah berlangsung berapa lama keluhan ini?',
        jawab: 'Sudah sekitar tiga bulan dok, makin lama makin banyak sendi yang kena.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_sistemik',
        kategori: 'rps',
        tanya: 'Ada rasa lemas, demam ringan, atau berat badan turun?',
        jawab: 'Iya dok, badan sering lemas, kadang sumeng, dan agak turun berat badan.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_pola',
        kategori: 'rps',
        tanya: 'Nyerinya lebih parah saat istirahat/pagi atau saat dipakai beraktivitas?',
        jawab: 'Justru pagi dan saat diam paling kaku dok, malah agak enakan kalau digerak-gerakkan pelan.',
        oldcarts: ['agravasi', 'waktu'],
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Ada keluarga dengan penyakit rematik atau autoimun?',
        jawab: 'Ibu saya juga jarinya bengkok-bengkok sejak tua dok.',
        oldcarts: ['penyerta'],
      },
      {
        id: "q_alergi",
        kategori: 'rpd',
        tanya: "Ada riwayat alergi obat, terutama obat antinyeri/rematik?",
        jawab: "Tidak ada dok, cuma maag saya suka kambuh kalau minum obat nyeri.",
        esensial: true,
      },
      // distraktor: pekerjaan mengetik sering dikira penyebab; bukan penentu diagnosis RA.
      {
        id: 'q_ketik',
        kategori: 'sosial',
        tanya: 'Pekerjaannya banyak mengetik atau menjahit?',
        jawab: 'Saya penjahit dok, tiap hari pakai tangan.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'ekstremitas', temuan: 'Sinovitis simetris sendi MCP dan PIP kedua tangan: bengkak lunak, hangat, nyeri tekan. Pergelangan tangan ikut bengkak. Sendi DIP relatif terhindar.', relevan: true },
      { region: 'ekstremitas', temuan: 'Deformitas dini: deviasi ulnar ringan jari-jari, kesulitan mengepal penuh.', relevan: true },
      { region: 'umum', temuan: 'Tampak lelah, subfebris. Konjungtiva agak pucat (anemia penyakit kronik).', relevan: true },
      { region: 'kulit', temuan: 'Nodul reumatoid subkutan kecil di siku (olekranon).', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-).', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Hb 10.6 (anemia penyakit kronik), LED sangat meningkat (58 mm/jam), trombosit reaktif.', flag: 'abnormal', relevan: true },
      { id: 'asam_urat_darah', hasil: 'Asam urat 4.8 mg/dL (normal) — menyingkirkan gout poliartikular.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['M06.9', 'M10.9', 'M17.9'],
    tatalaksana: {
      obatBenar: ['meloksikam_15'],
      obatSalahUmum: [
        { id: 'prednison_5', alasan: 'Steroid oral mungkin meredakan sementara, tetapi memulai steroid jangka panjang di FKTP tanpa rujukan menutupi penyakit dan menunda DMARD — pengelolaan RA (metotreksat dll.) adalah ranah spesialis penyakit dalam/reumatologi.' },
        { id: 'allopurinol_100', alasan: 'Ini bukan gout (asam urat normal, poliartritis simetris sendi kecil, kaku pagi panjang) — allopurinol keliru total.' },
      ],
      edukasi: ['peregangan_sendi', 'kontrol_rutin'],
    },
    clue: 'Artritis reumatoid (SKDI 3A → RUJUK): poliartritis SIMETRIS sendi kecil (MCP/PIP/pergelangan) + kaku pagi >1 JAM + gejala sistemik + LED/anemia kronik. Berbeda dari OA (mekanik, kaku singkat, sendi besar/DIP). Di FKTP: kenali, beri analgetik/NSAID untuk kenyamanan, lalu RUJUK penyakit dalam untuk DMARD dini (metotreksat) — jendela emas cegah destruksi sendi (ACR/EULAR 2010).',
    konsekuensi: {
      narasi: 'Bila hanya diberi NSAID lalu dibiarkan tanpa DMARD, inflamasi sinovial terus mengikis tulang rawan dan tulang — dalam hitungan bulan-tahun terjadi deformitas permanen dan disabilitas.',
      kembaliHariMin: 30,
      kembaliHariMax: 90,
      kondisiKembali: 'Pasien kembali dengan jari-jari makin bengkok (deviasi ulnar, swan-neck), sendi rusak, dan sudah sulit menjahit.',
      guideline: 'ACR/EULAR RA Classification 2010 — DMARD dini, rujukan reumatologi cegah kerusakan ireversibel.',
    },
  },

  /* ======================================================================
   * 8. Hipertensi Urgensi — WAJIB RUJUK penyakit_dalam (SKDI 3B)
   * Poin ajar: TD sangat tinggi TANPA kerusakan organ akut → turunkan BERTAHAP
   * (oral), JANGAN drop cepat, lalu rujuk. Bedakan dari emergensi.
   * ==================================================================== */
  {
    // Fix M6 (triase DeepThink 2026-07-11): I16.x adalah kode ICD-10-CM (AS),
    // TIDAK ada di WHO ICD-10 2010 yg dipakai Kemenkes/BPJS Indonesia — audit
    // CODEX 2026-07-04 sebelumnya salah mengira I16.0 adalah kode krisis
    // hipertensi WHO. Vignette kasus ini (LVH kronik + nefropati kronik TANPA
    // gagal jantung/ginjal akut) match persis I13.9 (penyakit jantung DAN
    // ginjal hipertensif, tak dirinci) — kode WHO real yg menangkap kerusakan
    // organ ganda kronik yg sudah ditulis di PF/lab kasus ini.
    id: 'mm_hipertensi_urgensi',
    nama: 'Hipertensi Urgensi',
    icd10: 'I13.9',
    skdi: '3B',
    kategori: 'kardiovaskular',
    // CODEX ronde-16 P2: 3B (rujuk) tak mungkin "wajib tuntas 144" (4A saja).
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'penyakit_dalam',
    keluhanUtama: 'Kepala saya pusing berat dan tengkuk kaku dok, tadi diukur tensinya sangat tinggi.',
    // CODEX M10 (2026-07-05): usiaMax 70 kena tabrakan dgn karma Mbah Lastri
    // (usia 71, keluarga/desaE.ts) — pasien warga sungguhan yg dijadwalkan
    // jatuh sakit via arc-nya jadi di luar rentang demografi kasus ini
    // sendiri. Dilonggarkan ke 80 (hipertensi urgensi lansia >70 realistis
    // secara klinis, tak ada alasan medis membatasi di 70 tepat).
    demografi: { usiaMin: 45, usiaMax: 80 },
    vital: { td: '210/120', nadi: 92, rr: 20, suhu: 36.7, spo2: 98 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Apa yang dirasakan sekarang?',
        jawab: 'Kepala pusing berat dok, tengkuk kaku dan berat, tadi di apotek diukur tensinya 210 per 120.',
        variasi: {
          polos: 'Sirahé mumet banget dok, githoké kenceng, mau diukur tensiné dhuwur banget.',
          terpelajar: 'Nyeri kepala hebat di bagian belakang dok dengan tengkuk kaku, tensi saya terukur 210/120, tapi tidak ada kelemahan anggota gerak.',
          cemas: 'Tensi saya tinggi sekali dok, saya takut kena stroke seperti kakak saya.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter', 'keparahan'],
      },
      {
        id: 'q_organ',
        kategori: 'rps',
        tanya: 'Ada nyeri dada, sesak napas, pandangan kabur mendadak, atau lemah separuh badan?',
        jawab: 'Tidak dok, dada tidak nyeri, tidak sesak, tangan-kaki masih kuat semua, bicara jelas.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_neuro',
        kategori: 'rps',
        tanya: 'Ada mual muntah menyemprot, kejang, atau penurunan kesadaran?',
        jawab: 'Mual sedikit dok tapi tidak muntah, tidak kejang, sadar penuh.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_obat',
        kategori: 'rpd',
        tanya: 'Selama ini minum obat darah tinggi? Rutin atau sering putus?',
        jawab: 'Dulu pernah dikasih amlodipin dok, tapi berhenti sendiri sudah beberapa bulan karena merasa sudah enak.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Sudah berapa lama darah tinggi? Ada kencing manis atau ginjal?',
        jawab: 'Sudah lima tahun lebih dok darah tinggi, gula belum pernah diperiksa.',
        oldcarts: ['durasi'],
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Ada keluarga dengan stroke atau serangan jantung?',
        jawab: 'Kakak saya kena stroke dok tahun lalu.',
        oldcarts: ['penyerta'],
      },
      // distraktor: konsumsi jengkol/petai dikira menaikkan tensi; bukan penentu urgensi.
      {
        id: 'q_jengkol',
        kategori: 'sosial',
        tanya: 'Suka makan jengkol atau petai?',
        jawab: 'Suka dok, sering.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'jantung', temuan: 'Iktus kordis bergeser ke lateral (kesan LVH kronik), S1/S2 reguler, tidak ada gallop/murmur akut.', relevan: true },
      { region: 'neurologis', temuan: 'GCS 15, tidak ada lateralisasi, refleks fisiologis simetris, tidak ada defisit fokal — TIDAK ada tanda ensefalopati/stroke akut.', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, tampak cemas, TD ulang di kedua lengan tetap ~205/118.', relevan: true },
      { region: 'mata', temuan: 'Funduskopi (bila tersedia): penyempitan arteriol; tidak ada papiledema akut/perdarahan segar.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki basah basal (-) — tidak ada edema paru akut.', relevan: true },
    ],
    lab: [
      { id: 'ekg', hasil: 'Irama sinus, tanda LVH (kriteria voltase), tanpa ST-elevasi/depresi akut.', flag: 'abnormal', relevan: true },
      { id: 'fungsi_ginjal', hasil: 'Ureum/kreatinin sedikit meningkat (kesan nefropati hipertensi kronik).', flag: 'tinggi', relevan: true },
      { id: 'urinalisis', hasil: 'Proteinuria +1 — kerusakan organ target kronik ginjal.', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['I13.9', 'I11.9', 'I12.9'],
    tatalaksana: {
      // Audit CODEX 2026-07-04: amlodipin+kaptopril DULU wajib SEKALIGUS —
      // bertentangan dgn poin ajar kasus sendiri ("JANGAN drop cepat"): dua
      // antihipertensi oral bersamaan justru mempercepat penurunan TD.
      // Klinis lazim: SATU agen oral dulu, bertahap. Kini grup pilih-satu.
      obatBenar: [],
      obatAlternatif: [['amlodipine_10', 'captopril_25']],
      obatSalahUmum: [
        { id: 'nifedipin_10', alasan: 'Nifedipin kerja cepat sublingual/kunyah DILARANG pada krisis hipertensi — penurunan TD tak terkendali & mendadak berisiko iskemia serebral/miokard/stroke. Turunkan BERTAHAP dengan oral kerja sedang.' },
        { id: 'furosemid_40', alasan: 'Diuretik agresif tidak tepat sebagai lini pertama urgensi tanpa overload cairan — berisiko hipovolemia; hanya bila ada edema paru/overload nyata.' },
      ],
      edukasi: ['diet_rendah_garam', 'kepatuhan_obat', 'kontrol_rutin', 'tanda_bahaya'],
    },
    clue: 'HIPERTENSI URGENSI (SKDI 3B → RUJUK): TD ≥180/120 TANPA kerusakan organ target AKUT (tanpa nyeri dada iskemik, edema paru, defisit neurologis, ensefalopati). Prinsip: TURUNKAN PERLAHAN dengan obat ORAL (amlodipin/kaptopril) dalam 24–48 jam, TANPA target persen-per-jam — jangan drop cepat (nifedipin sublingual dilarang), kontrol ulang ~1 minggu. Rujuk penyakit dalam untuk evaluasi. Bila ADA kerusakan organ akut = EMERGENSI → IGD (obat IV, turunkan ≤25% pada jam pertama). Catatan: "≤25% jam pertama" adalah target EMERGENSI, BUKAN urgensi (ACC/AHA 2017; ESC/ESH 2023; InaSH-PERHI).',
    konsekuensi: {
      narasi: 'Penurunan TD terlalu cepat (nifedipin sublingual) dapat memicu hipoperfusi otak/jantung dan justru menyebabkan stroke iskemik atau infark — sebaliknya membiarkan tanpa rujuk berisiko progres ke emergensi.',
      kembaliHariMin: 1,
      kembaliHariMax: 3,
      kondisiKembali: 'Pasien kembali dengan lemah separuh badan / bicara pelo (stroke) atau nyeri dada — telah berkembang menjadi kerusakan organ target.',
      guideline: 'PPK Hipertensi Kemenkes / PERKI — urgensi diturunkan bertahap oral + rujuk, hindari nifedipin sublingual.',
    },
  },

  /* ======================================================================
   * 9. Gagal Jantung Kongestif — WAJIB RUJUK penyakit_dalam (SKDI 3B)
   * Poin ajar: sesak + edema + ortopnea/PND → stabilisasi (O2, ISDN, furosemid)
   * lalu rujuk untuk ekokardiografi & terapi definitif.
   * ==================================================================== */
  {
    id: 'mm_gagal_jantung_kongestif',
    nama: 'Gagal Jantung Kongestif',
    icd10: 'I50.0',
    skdi: '3B',
    kategori: 'kardiovaskular',
    // CODEX ronde-16 P2: 3B (rujuk) tak mungkin "wajib tuntas 144" (4A saja).
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'penyakit_dalam',
    keluhanUtama: 'Saya sesak napas dok, makin berat kalau tidur telentang, dan kaki saya bengkak.',
    demografi: { usiaMin: 55, usiaMax: 75 },
    vital: { td: '150/95', nadi: 108, rr: 26, suhu: 36.8, spo2: 92 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Sesaknya bagaimana? Muncul saat apa?',
        jawab: 'Sesak dok, awalnya cuma kalau jalan jauh, sekarang jalan ke kamar mandi saja sudah ngos-ngosan.',
        variasi: {
          polos: 'Ambeganku seseg dok, saiki mlaku sithik waé wis menggeh-menggeh.',
          terpelajar: 'Sesak saya makin memberat dok, dulu masih kuat beraktivitas biasa, sekarang berjalan sedikit saja sudah sesak.',
          lansia: 'Napas saya berat sekali Nak, apalagi kalau berbaring, sampai harus duduk.',
        },
        esensial: true,
        oldcarts: ['karakter', 'agravasi', 'onset'],
      },
      {
        id: 'q_ortopnea',
        kategori: 'keluhan_utama',
        tanya: 'Kalau tidur, harus pakai bantal tinggi? Pernah terbangun mendadak sesak?',
        jawab: 'Iya dok, tidur harus ditumpuk tiga bantal, dan sering terbangun tengah malam megap-megap harus duduk.',
        esensial: true,
        oldcarts: ['waktu', 'penyerta'],
      },
      {
        id: 'q_edema',
        kategori: 'rps',
        tanya: 'Kaki bengkak? Sejak kapan dan sampai mana?',
        jawab: 'Kedua kaki bengkak dok sampai betis, kalau ditekan cekung lama, makin sore makin bengkak.',
        esensial: true,
        oldcarts: ['lokasi', 'waktu'],
      },
      {
        id: 'q_nyeri_dada',
        kategori: 'rps',
        tanya: 'Ada nyeri dada seperti ditindih, terutama saat aktivitas?',
        jawab: 'Kadang dada terasa berat dok kalau capek, tapi tidak sampai nyeri hebat.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Punya riwayat darah tinggi, jantung, atau pernah serangan jantung?',
        jawab: 'Darah tinggi lama dok tidak terkontrol, dan dulu pernah dibilang jantungnya agak membesar.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_batuk',
        kategori: 'rps',
        tanya: 'Ada batuk, terutama malam, kadang berbuih atau berdahak?',
        jawab: 'Iya dok, batuk-batuk terutama malam, dahaknya kadang berbuih.',
        oldcarts: ['waktu', 'penyerta'],
      },
      {
        id: 'q_rokok',
        kategori: 'sosial',
        tanya: 'Merokok? Berapa lama?',
        jawab: 'Dulu perokok berat dok, berhenti dua tahun lalu.',
        oldcarts: ['penyerta'],
      },
      // distraktor: jumlah anak tidak relevan dengan gagal jantung.
      {
        id: 'q_anak',
        kategori: 'sosial',
        tanya: 'Punya berapa anak Pak?',
        jawab: 'Empat dok, semua sudah berkeluarga.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'jantung', temuan: 'Iktus kordis bergeser ke lateral-inferior (kardiomegali), takikardia, S3 gallop (+), tekanan vena jugularis meningkat (JVP ↑).', relevan: true },
      { region: 'toraks_paru', temuan: 'Ronki basah halus di kedua basal paru (kongesti), takipnea, SpO2 92% udara ruang.', relevan: true },
      { region: 'ekstremitas', temuan: 'Edema pitting derajat 2 kedua tungkai hingga pretibial.', relevan: true },
      { region: 'abdomen', temuan: 'Hepatomegali kongestif, refluks hepatojugular (+).', relevan: true },
      { region: 'kulit', temuan: 'Akral hangat, sianosis (-) saat ini.', relevan: false },
    ],
    lab: [
      { id: 'ekg', hasil: 'Sinus takikardia, LVH, gelombang Q lama di inferior (kesan bekas infark).', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Hb normal, tidak ada leukositosis (bukan pneumonia).', flag: 'normal', relevan: true },
      { id: 'fungsi_ginjal', hasil: 'Kreatinin sedikit meningkat (sindrom kardiorenal ringan).', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['I50.0', 'I50.9', 'J44.9'],
    tatalaksana: {
      obatBenar: ['furosemid_40', 'isosorbid_dinitrat_5'],
      obatSalahUmum: [
        { id: 'natrium_diklofenak_50', alasan: 'NSAID DIKONTRAINDIKASIKAN pada gagal jantung — menahan natrium/air memperberat kongesti dan memperburuk fungsi ginjal. Jangan diberikan untuk keluhan pegal apa pun di sini.' },
        { id: 'bisoprolol_5', alasan: 'Beta-blocker BERMANFAAT jangka panjang, tapi JANGAN dimulai saat dekompensasi akut/kongesti (memperburuk curah jantung sesaat) — inisiasi dilakukan setelah stabil, oleh spesialis. Di FKTP fokus stabilisasi + rujuk.' },
      ],
      // CODEX (2026-07-05): minum_air_cukup (sinonim ISK/hidrasi, anjuran
      // MINUM LEBIH BANYAK) diganti restriksi_cairan_gagal_jantung — CHF
      // butuh restriksi cairan, kebalikan dari topik lama.
      edukasi: ['diet_rendah_garam', 'restriksi_cairan_gagal_jantung', 'kepatuhan_obat', 'tanda_bahaya'],
      // CODEX M10 ronde-2 (2026-07-06): restriksi cairan adalah topik KHAS-CHF
      // (beda dari 3 topik lain yg generik penyakit kronis) — kegagalan klasik
      // readmisi CHF di dunia nyata adalah pasien tak membatasi cairan di rumah.
      edukasiKritis: ['restriksi_cairan_gagal_jantung'],
    },
    clue: 'GAGAL JANTUNG KONGESTIF (SKDI 3B → RUJUK): sesak progresif + ortopnea + PND + edema tungkai + JVP↑ + S3 gallop + ronki basal (kriteria Framingham). Di FKTP: STABILISASI — posisi setengah duduk, oksigen, furosemid (dekongesti), ISDN bila TD memadai — lalu RUJUK penyakit dalam untuk ekokardiografi & terapi definitif (ACE-I/beta-blocker dititrasi). JANGAN mulai beta-blocker saat dekompensasi; HINDARI NSAID (PPK Gagal Jantung / PERKI / ESC).',
    konsekuensi: {
      narasi: 'Tanpa dekongesti & rujukan, kongesti paru memberat menuju edema paru akut; pemberian NSAID atau inisiasi beta-blocker saat basah dapat mempercepat dekompensasi fatal.',
      kembaliHariMin: 1,
      kembaliHariMax: 3,
      kondisiKembali: 'Pasien kembali/dibawa dalam kondisi sesak hebat, tidak bisa berbaring sama sekali, berbuih dari mulut — edema paru akut mengancam jiwa.',
      guideline: 'PPK Gagal Jantung Kemenkes / PERKI / ESC HF — stabilisasi diuretik + rujuk, hindari NSAID & beta-blocker saat dekompensasi.',
    },
  },

  /* ======================================================================
   * 10. ISK Bawah (Sistitis) — perempuan muda, disuria-frekuensi
   * Poin ajar: ISK bawah tanpa komplikasi → antibiotik singkat (kotrimoksazol) +
   * banyak minum. Bedakan dari pielonefritis (demam tinggi/nyeri pinggang → beda alur).
   * ==================================================================== */
  {
    id: 'mm_isk_bawah',
    nama: 'Infeksi Saluran Kemih Bawah (Sistitis)',
    icd10: 'N30.0',
    skdi: '4A',
    kategori: 'metabolik',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Kalau kencing perih dan anyang-anyangan dok, bolak-balik ke kamar mandi tapi sedikit-sedikit.',
    demografi: { usiaMin: 18, usiaMax: 45, jenisKelamin: 'P' },
    vital: { td: '116/74', nadi: 84, rr: 18, suhu: 37.4 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan saat berkemihnya seperti apa?',
        jawab: 'Perih dok waktu kencing, dan rasanya nggak tuntas, jadi bolak-balik ke WC tapi keluarnya sedikit.',
        variasi: {
          polos: 'Yèn nguyuh perih dok, anyang-anyangen, bola-bali menyang WC nanging metuné mung sithik.',
          terpelajar: 'Perih saat buang air kecil dok, jadi sering dan buru-buru, dan rasanya tidak tuntas.',
          cemas: 'Sakit sekali dok waktu pipis, saya takut ini penyakit ginjal atau menular.',
        },
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_frekuensi',
        kategori: 'keluhan_utama',
        tanya: 'Sering banget bolak-balik pipis? Kadang tidak tertahan?',
        jawab: 'Iya dok, tiap sebentar mau pipis dan susah ditahan, tapi keluarnya cuma sedikit.',
        esensial: true,
        oldcarts: ['waktu', 'keparahan'],
      },
      {
        id: 'q_pinggang',
        kategori: 'rps',
        tanya: 'Ada nyeri pinggang belakang, demam tinggi, atau menggigil?',
        jawab: 'Tidak dok, cuma agak anget saja, pinggang tidak nyeri.',
        esensial: true,
        oldcarts: ['lokasi', 'penyerta'],
      },
      {
        id: 'q_urin',
        kategori: 'rps',
        tanya: 'Air kencingnya keruh, berbau, atau ada darah?',
        jawab: 'Agak keruh dan berbau dok, kadang di akhir kencing ada sedikit warna kemerahan.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_hamil',
        kategori: 'rpd',
        tanya: 'Sedang hamil atau terlambat haid? Kapan haid terakhir?',
        jawab: 'Tidak hamil dok, haid terakhir dua minggu lalu, teratur.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah kena keluhan kencing seperti ini sebelumnya?',
        jawab: 'Pernah sekali setahun lalu dok, sembuh setelah minum obat.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kebiasaan',
        kategori: 'sosial',
        tanya: 'Sering menahan kencing atau kurang minum? Bagaimana cara cebok?',
        jawab: 'Sering menahan pipis dok karena kerja, dan memang kurang minum air putih.',
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Ada riwayat alergi obat? Terutama antibiotik golongan sulfa (kotrimoksazol)?',
        jawab: 'Iya dok, waktu SMP pernah minum kotrimoksazol terus kulit saya melepuh kemerahan — sejak itu dibilang pantang obat sulfa.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      // distraktor: merek sabun cuci tidak menentukan tata laksana sistitis.
      {
        id: 'q_sabun',
        kategori: 'sosial',
        tanya: 'Pakai sabun cuci pakaian merek apa?',
        jawab: 'Merek biasa dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'abdomen', temuan: 'Nyeri tekan suprapubik ringan (+). Tidak ada massa, bising usus normal.', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, subfebris (37.4), tampak tidak nyaman tapi tidak toksik.', relevan: true },
      { region: 'ekstremitas', temuan: 'Nyeri ketok sudut kostovertebra (CVA) NEGATIF bilateral — menyingkirkan pielonefritis.', relevan: true },
      { region: 'kulit', temuan: 'Turgor baik, akral hangat.', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
    ],
    lab: [
      { id: 'urinalisis', hasil: 'Leukosit esterase (+), nitrit (+), leukosit 25–30/lpb (piuria), eritrosit 3–5/lpb, bakteri (+).', flag: 'abnormal', relevan: true },
      { id: 'tes_kehamilan', hasil: 'Negatif — memastikan aman memberi antibiotik & menyingkirkan ISK dalam kehamilan.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['N30.0', 'N39.0', 'N10'],
    tatalaksana: {
      obatBenar: ['cotrimoxazole_480'],
      obatSalahUmum: [
        { id: 'ciprofloxacin_500', alasan: 'Fluorokuinolon sebaiknya DICADANGKAN (bukan lini pertama sistitis tanpa komplikasi) demi stewardship — pilih kotrimoksazol/nitrofurantoin dulu sesuai pola resistensi lokal.' },
        { id: 'natrium_diklofenak_50', alasan: 'Bukan terapi utama; sistitis butuh antibiotik + hidrasi. Analgesik hanya penunjang, bukan pengganti antibiotik.' },
      ],
      edukasi: ['minum_air_cukup', 'cuci_tangan', 'kontrol_rutin'],
    },
    clue: 'ISK bawah / sistitis akut tanpa komplikasi (perempuan, disuria + frekuensi + urgensi, TANPA demam tinggi/nyeri pinggang/CVA negatif) → antibiotik lini pertama (kotrimoksazol) 3 hari + banyak minum + jangan menahan kencing. WAJIB singkirkan kehamilan (ubah pilihan antibiotik) & pielonefritis (demam tinggi + nyeri ketok CVA = infeksi atas, alur berbeda). Cadangkan fluorokuinolon (PPK ISK / IDSA).',
    konsekuensi: {
      narasi: 'Bila tidak diobati adekuat atau tanda infeksi atas terlewat, sistitis dapat naik menjadi pielonefritis (demam tinggi, nyeri pinggang) yang lebih berat.',
      kembaliHariMin: 3,
      kembaliHariMax: 7,
      kondisiKembali: 'Pasien kembali dengan demam tinggi menggigil dan nyeri pinggang hebat — telah menjadi pielonefritis akut.',
      guideline: 'PPK ISK Kemenkes / IDSA — sistitis tanpa komplikasi antibiotik singkat, fluorokuinolon dicadangkan.',
    },
    alergiTrap: {
      kelas: 'sulfa',
      obatTerlarang: ['cotrimoxazole_480'],
      alternatifBenar: ['nitrofurantoin_100'],
    },
  },
]
