/**
 * KASUS RESPIRASI & PENCERNAAN — Batch M3 (10 kasus).
 *
 * Ditulis terhadap kontrak `KasusKlinis` (src/content/types.ts). Semua id obat/lab/
 * edukasi/tindakan memakai palet kanonik M3_CONTENT_SPEC. Akurasi klinis mengikuti
 * guideline nasional (Kemenkes/PPK IDI/PNPK/WHO) — lihat setiap `clue` & `obatSalahUmum`.
 *
 * Poin ajar kunci batch ini:
 *  - Bronkitis akut viral → TANPA antibiotik (self-limiting).
 *  - GERD & dispepsia fungsional → hindari over-endoskopi; terapi empiris + gaya hidup.
 *  - Apendisitis akut → McBurney (+) → rujuk bedah. JANGAN beri analgetik/antibiotik
 *    yang menutupi tanda peritoneal sebelum penilaian bedah.
 *
 * Dua kasus wajib-rujuk: `ppok_eksaserbasi` (spesialisRujukan: paru) dan
 * `apendisitis_akut` (spesialisRujukan: bedah).
 */

import type { KasusKlinis } from '../types'

export const KASUS_RESPIRASI_GI: KasusKlinis[] = [
  /* ======================================================================
   * 1. Bronkitis Akut (4A, tinggi)
   * Poin ajar: batuk pasca-ISPA, umumnya VIRAL & self-limiting → TANPA antibiotik.
   * ==================================================================== */
  {
    id: 'bronkitis_akut',
    nama: 'Bronkitis Akut',
    icd10: 'J20.9',
    skdi: '4A',
    kategori: 'respirasi',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Batuk saya nggak berhenti dok, sudah hampir seminggu, dadanya sampai pegal.',
    demografi: { usiaMin: 18, usiaMax: 55 },
    vital: { td: '120/80', nadi: 88, rr: 20, suhu: 37.4, spo2: 98 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Batuknya seperti apa? Kering atau berdahak?',
        jawab: 'Awalnya kering dok, sekarang mulai berdahak putih, batuknya sering sampai capek.',
        variasi: {
          polos: 'Mula-mula garing dok, saiki wis metu riaké putih, watuké kerep banget.',
          terpelajar: 'Awalnya batuk kering dok, sekarang berdahak, dahaknya kental keputihan.',
          cemas: 'Batuknya parah dok sampai dada sakit, ini nggak jadi paru-paru basah kan?',
        },
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa hari batuknya, dan mulainya dari apa?',
        jawab: 'Sekitar enam hari dok, awalnya pilek dan tenggorokan gatal, lalu jadi batuk.',
        esensial: true,
        oldcarts: ['onset', 'durasi'],
      },
      {
        id: 'q_sesak',
        kategori: 'rps',
        tanya: 'Ada sesak napas atau bunyi ngik-ngik?',
        jawab: 'Nggak sesak dok, cuma kadang dada terasa berat kalau batuknya lagi banyak.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Demamnya tinggi tidak?',
        jawab: 'Cuma anget di awal dok, sekarang sudah nggak panas.',
        esensial: true,
        oldcarts: ['keparahan', 'waktu'],
      },
      {
        id: 'q_darah',
        kategori: 'rps',
        tanya: 'Dahaknya ada bercak darah, atau warnanya kehijauan pekat?',
        jawab: 'Nggak ada darah dok, warnanya putih agak bening.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_bb',
        kategori: 'rps',
        tanya: 'Ada berat badan turun atau keringat malam?',
        jawab: 'Nggak dok, makan biasa, tidur juga nggak sampai basah keringat.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_rokok',
        kategori: 'sosial',
        tanya: 'Apakah merokok?',
        jawab: 'Nggak merokok dok.',
        oldcarts: ['penyerta'],
      },
      // distraktor: golongan darah tidak relevan untuk bronkitis akut.
      {
        id: 'q_goldar',
        kategori: 'sosial',
        tanya: 'Golongan darahnya apa?',
        jawab: 'B dok, kenapa ya?',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Compos mentis, tampak sakit ringan, tidak sesak, tidak sianosis.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki kasar sekilas yang hilang setelah pasien batuk, wheezing -/-. Tidak ada retraksi.', relevan: true },
      { region: 'tht_mulut', temuan: 'Faring hiperemis ringan sisa ISPA, tonsil T1/T1 tenang.', relevan: true },
      { region: 'kepala_leher', temuan: 'KGB leher tidak membesar.', relevan: false },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-).', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Hb 14.0, Leukosit 8.100/µL, hitung jenis normal — tidak mendukung infeksi bakteri.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['J20.9', 'J00', 'J18.9'],
    tatalaksana: {
      obatBenar: ['ambroxol_30', 'paracetamol_500'],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Bronkitis akut pada dewasa sehat >90% viral & self-limiting; antibiotik tidak mempercepat sembuh dan memicu resistensi (PPK IDI; Kemenkes PPRA).' },
        { id: 'azitromisin_500', alasan: 'Makrolida bukan indikasi bronkitis akut viral tanpa tanda pneumonia; peresepan rutin justru mendorong resistensi.' },
      ],
      edukasi: ['etika_batuk', 'istirahat_cukup', 'minum_air_cukup', 'tanda_bahaya'],
    },
    clue: 'Bronkitis akut = batuk (kadang sampai 3 minggu) pasca-ISPA, tanpa sesak/ronki menetap/tanda pneumonia. VIRAL & self-limiting → simtomatik saja, TANPA antibiotik (PPK IDI). Red flag ke pneumonia/TB: demam tinggi menetap, sesak, ronki fokal menetap, batuk >3 minggu, hemoptisis, BB turun.',
    konsekuensi: {
      narasi: 'Peresepan antibiotik sia-sia menormalisasi harapan pasien akan antibiotik dan berisiko efek samping (diare, alergi) tanpa manfaat.',
      kembaliHariMin: 7,
      kembaliHariMax: 14,
      kondisiKembali: 'Batuk sudah membaik sendiri, pasien datang lagi meminta "antibiotik yang kemarin" untuk stok.',
      guideline: 'PPK IDI Bronkitis Akut / Pedoman Penggunaan Antibiotik Kemenkes — bronkitis akut tidak rutin diberi antibiotik.',
    },
  },

  /* ======================================================================
   * 2. Rinitis Alergi (4A, tinggi)
   * Poin ajar: bersin serial + rinorea encer + gatal → antihistamin, hindari alergen.
   * ==================================================================== */
  {
    id: 'rinitis_alergi',
    nama: 'Rinitis Alergi',
    icd10: 'J30.4',
    skdi: '4A',
    kategori: 'tht',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Tiap pagi saya bersin-bersin terus dok, hidung meler dan mampet.',
    demografi: { usiaMin: 12, usiaMax: 40 },
    vital: { td: '118/76', nadi: 78, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan hidungnya bagaimana?',
        jawab: 'Bersin beruntun dok, kadang sampai belasan kali, ingusnya bening encer dan hidung gatal.',
        variasi: {
          polos: 'Wahing terus dok kaya mbledhos, umbelé bening, irungé gatel.',
          terpelajar: 'Bersin beruntun dok, ingus encer bening, disertai hidung gatal dan mata berair.',
          cemas: 'Bersinnya nggak berhenti dok, ganggu banget kerja, ini kenapa ya sebenarnya?',
        },
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_pencetus',
        kategori: 'keluhan_utama',
        tanya: 'Muncul atau memberat kapan? Ada pemicu tertentu?',
        jawab: 'Paling parah pagi hari dok dan kalau bersih-bersih kamar yang berdebu.',
        esensial: true,
        oldcarts: ['waktu', 'agravasi'],
      },
      {
        id: 'q_gatal',
        kategori: 'rps',
        tanya: 'Ada gatal di mata, hidung, atau langit-langit mulut?',
        jawab: 'Iya dok, mata sering gatal dan berair juga.',
        esensial: true,
        oldcarts: ['lokasi', 'penyerta'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Ada demam atau ingus jadi kuning-hijau kental?',
        jawab: 'Nggak demam dok, ingusnya bening terus, nggak pernah kental kuning.',
        esensial: true,
        oldcarts: ['karakter'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah ada asma, biduran, atau eksim sebelumnya?',
        jawab: 'Waktu kecil sering gatal-gatal kulit dok, dan gampang sesak kalau kena debu.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Di keluarga ada yang punya alergi atau asma?',
        jawab: 'Ibu saya asma dok, adik saya juga sering bersin-bersin.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_lingkungan',
        kategori: 'sosial',
        tanya: 'Di kamar ada karpet, boneka, atau hewan peliharaan berbulu?',
        jawab: 'Ada karpet dan boneka lama dok, kucing juga sering masuk kamar.',
        esensial: true,
      },
      // distraktor: kebiasaan minum kopi tidak menentukan diagnosis rinitis alergi.
      {
        id: 'q_kopi',
        kategori: 'sosial',
        tanya: 'Suka minum kopi tidak?',
        jawab: 'Suka dok, dua gelas sehari.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'tht_mulut', temuan: 'Mukosa hidung pucat kebiruan dan edema, sekret serosa jernih (+). Konka inferior hipertrofi.', relevan: true },
      { region: 'umum', temuan: 'Tampak baik, allergic shiner (lingkar gelap bawah mata) (+), sesekali menggosok hidung ke atas (allergic salute).', relevan: true },
      { region: 'mata', temuan: 'Konjungtiva sedikit hiperemis dan berair, tidak ada sekret purulen.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, wheezing -/-. Tidak ada sesak saat ini.', relevan: false },
      { region: 'kepala_leher', temuan: 'Tidak ada nyeri tekan sinus maksila/frontal.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Eosinofil sedikit meningkat; sisanya normal. Bukan pemeriksaan penentu — diagnosis klinis.', flag: 'normal', relevan: false },
    ],
    diagnosisBanding: ['J30.4', 'J00', 'J01.9'],
    tatalaksana: {
      obatBenar: [],
      // Antihistamin gen-2 setara — beri SALAH SATU (bukan keduanya sekaligus).
      obatAlternatif: [['loratadin_10', 'cetirizine_10']],
      obatSalahUmum: [
        { id: 'amoxicillin_500', alasan: 'Rinitis alergi bukan infeksi bakteri — antibiotik tidak berperan. Sekret jernih tanpa demam menyingkirkan sinusitis bakterial.' },
        { id: 'pseudoefedrin_30', alasan: 'Dekongestan ORAL bukan terapi utama rinitis alergi; efek sistemiknya (menaikkan tekanan darah, insomnia, palpitasi) berbahaya, terutama pada hipertensi. Rinitis medikamentosa justru rebound dekongestan TOPIKAL (oksimetazolin), bukan oral.' },
      ],
      edukasi: ['hindari_alergen', 'cuci_seprai_panas', 'jaga_kelembapan_kulit', 'tanda_bahaya'],
    },
    clue: 'Rinitis alergi: bersin serial + rinorea ENCER JERNIH + gatal hidung/mata, dipicu debu/pagi, TANPA demam, riwayat atopi keluarga. Terapi lini pertama antihistamin non-sedatif (loratadin/setirizin) + kontrol lingkungan (ARIA/PPK IDI). Bedakan dari common cold (durasi lebih lama, gatal menonjol, tanpa demam).',
    konsekuensi: {
      narasi: 'Bila alergen tidak dihindari, keluhan kronik-kambuh dan dapat berkembang menjadi asma; pemakaian dekongestan oral rutin membebani jantung & tekanan darah tanpa mengatasi akar alergi.',
      kembaliHariMin: 14,
      kembaliHariMax: 30,
      kondisiKembali: 'Pasien kembali; keluhan alergi tetap kambuh dan ia mengeluh jantung berdebar serta sulit tidur setelah rutin minum dekongestan oral.',
      guideline: 'ARIA / PPK IDI Rinitis Alergi — antihistamin + penghindaran alergen.',
    },
  },

  /* ======================================================================
   * 3. Tonsilitis Akut (4A, sedang) — alergiTrap penisilin → makrolida
   * Poin ajar: tonsilitis bakterial → penisilin/amoxicillin; bila alergi → makrolida.
   * ==================================================================== */
  {
    id: 'tonsilitis_akut',
    nama: 'Tonsilitis Akut Bakterial',
    icd10: 'J03.9',
    skdi: '4A',
    kategori: 'tht',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Amandel saya bengkak dok, sakit menelan dan demam tinggi.',
    demografi: { usiaMin: 6, usiaMax: 25 },
    vital: { td: '110/70', nadi: 96, rr: 20, suhu: 38.7 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Apa yang paling terasa?',
        jawab: 'Tenggorokan sakit banget dok, menelan ludah saja perih, terasa amandel membesar.',
        variasi: {
          polos: 'Gulu loro nemen dok, arep nguntal wae lara, amandelé gedhe.',
          terpelajar: 'Nyeri hebat saat menelan dok, terasa amandel membesar dan suara jadi sedikit sengau.',
          wali_anak: 'Anak saya nggak mau makan dok karena tenggorokannya sakit, amandelnya kelihatan besar dan ada bercak putih.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter'],
      },
      {
        id: 'q_demam',
        kategori: 'keluhan_utama',
        tanya: 'Demamnya sejak kapan dan setinggi apa?',
        jawab: 'Demam tinggi mendadak sejak dua hari lalu dok, sampai menggigil.',
        esensial: true,
        oldcarts: ['onset', 'keparahan'],
      },
      {
        id: 'q_batuk',
        kategori: 'rps',
        tanya: 'Ada batuk atau pilek menyertai?',
        jawab: 'Nggak batuk nggak pilek dok, murni tenggorokan dan demam.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kgb',
        kategori: 'rps',
        tanya: 'Ada benjolan nyeri di leher?',
        jawab: 'Iya dok, di bawah rahang bengkak dan nyeri kalau ditekan.',
        oldcarts: ['lokasi', 'penyerta'],
      },
      {
        id: 'q_napas',
        kategori: 'rps',
        tanya: 'Ada kesulitan napas, ngiler tak bisa menelan, atau suara berubah seperti mulut penuh?',
        jawab: 'Masih bisa napas dan menelan dok, cuma sakit. Nggak sampai ngiler.',
        esensial: true,
        oldcarts: ['keparahan', 'penyerta'],
      },
      {
        id: 'q_alergi',
        kategori: 'rpd',
        tanya: 'Ada riwayat alergi obat? Terutama amoxicillin atau antibiotik golongan penisilin?',
        jawab: 'Dulu pernah bentol-bentol dan gatal seluruh badan sehabis minum amoxicillin dok.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Sering radang amandel? Berapa kali setahun?',
        jawab: 'Sering dok, bisa 4–5 kali setahun.',
      },
      // distraktor: kesukaan makan pedas tidak menentukan tata laksana tonsilitis bakterial.
      {
        id: 'q_pedas',
        kategori: 'sosial',
        tanya: 'Suka makan pedas?',
        jawab: 'Suka banget dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'tht_mulut', temuan: 'Tonsil T3/T3 hiperemis dengan detritus/eksudat putih di kripta, faring hiperemis. Tidak ada pembengkakan asimetris/deviasi uvula (bukan abses peritonsil).', relevan: true },
      { region: 'kepala_leher', temuan: 'KGB servikal anterior membesar, nyeri tekan (+).', relevan: true },
      { region: 'umum', temuan: 'Tampak sakit sedang, febris. Tidak ada trismus, tidak ada air liur menetes.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
      { region: 'abdomen', temuan: 'Supel, nyeri tekan (-).', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Leukosit 14.200/µL dominasi netrofil (leukositosis) — mendukung infeksi bakteri.', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['J03.9', 'J02.9', 'J36'],
    tatalaksana: {
      obatBenar: ['amoxicillin_500', 'paracetamol_500'],
      obatSalahUmum: [
        { id: 'dexamethasone_05', alasan: 'Kortikosteroid oral bukan terapi utama tonsilitis bakterial dan tidak menggantikan antibiotik; pemberian rutin tak beralasan menutupi perjalanan penyakit.' },
        { id: 'ciprofloxacin_500', alasan: 'Fluorokuinolon berlebihan untuk tonsilitis streptokokus komunitas dan memicu resistensi; lini pertama tetap penisilin/amoxicillin.' },
      ],
      edukasi: ['kepatuhan_obat', 'kompres_demam', 'istirahat_cukup', 'minum_air_cukup'],
      // CODEX M10 ronde-2 (2026-07-06): konsekuensi.narasi eksplisit — antibiotik
      // tak tuntas → demam rematik/komplikasi jantung (pola sama faringitis_akut).
      edukasiKritis: ['kepatuhan_obat'],
    },
    clue: 'Tonsilitis bakterial (Streptokokus): demam tinggi, tonsil membesar + eksudat, KGB servikal nyeri, TANPA batuk-pilek. Lini pertama amoxicillin 10 hari (cegah demam rematik); bila ALERGI PENISILIN → makrolida (azitromisin/eritromisin). Red flag abses peritonsil/obstruksi (trismus, uvula terdorong, ngiler, stridor) → rujuk.',
    alergiTrap: {
      kelas: 'penisilin',
      obatTerlarang: ['amoxicillin_500', 'amoxicillin_sirup', 'amoxiclav_625'],
      alternatifBenar: ['azitromisin_500'],
    },
    konsekuensi: {
      narasi: 'Bila antibiotik tidak dituntaskan, risiko demam rematik akut dan komplikasi jantung; bila amoxicillin dipaksakan pada pasien alergi penisilin, dapat terjadi reaksi anafilaksis.',
      kembaliHariMin: 7,
      kembaliHariMax: 21,
      kondisiKembali: 'Pasien kembali dengan nyeri sendi berpindah dan riwayat radang tenggorokan yang tidak tuntas diobati — curiga demam rematik.',
      guideline: 'PPK IDI Tonsilitis Akut / AAP — eradikasi Streptokokus mencegah demam rematik; alternatif makrolida bila alergi penisilin.',
    },
  },

  /* ======================================================================
   * 4. PPOK Eksaserbasi Akut (3B, WAJIB-RUJUK paru, rendah)
   * Poin ajar: perokok berat sesak memberat + produksi/purulensi sputum naik →
   *   stabilisasi (O2 hati-hati, nebulisasi bronkodilator) → RUJUK paru.
   * ==================================================================== */
  {
    id: 'ppok_eksaserbasi',
    nama: 'PPOK Eksaserbasi Akut',
    icd10: 'J44.1',
    skdi: '3B',
    kategori: 'respirasi',
    // CODEX ronde-16 P2: 3B (rujuk) tak mungkin "wajib tuntas 144" (4A saja).
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'paru',
    keluhanUtama: 'Sesak saya makin berat dok, dahak jadi banyak dan kuning kental, jalan ke kamar mandi saja ngos-ngosan.',
    demografi: { usiaMin: 55, usiaMax: 75, jenisKelamin: 'L' },
    vital: { td: '140/85', nadi: 108, rr: 28, suhu: 37.6, spo2: 89 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Sesaknya bagaimana dibanding hari biasa?',
        jawab: 'Biasanya sesak cuma kalau kerja berat dok, sekarang jalan sedikit saja sudah ngos-ngosan, malam susah tidur karena sesak.',
        variasi: {
          lansia: 'Ambeganku saya sesek nemen Nak, mlaku rong meter wae wis megap-megap, mambengi ora iso turu.',
          terpelajar: 'Sesak saya memberat jelas dok, dulu hanya muncul saat aktivitas berat, sekarang aktivitas ringan pun sudah sesak.',
          cemas: 'Sesaknya makin parah dok, saya takut nggak kuat napas malam ini.',
        },
        esensial: true,
        oldcarts: ['onset', 'keparahan', 'agravasi'],
      },
      {
        id: 'q_sputum',
        kategori: 'keluhan_utama',
        tanya: 'Dahaknya bagaimana? Bertambah banyak atau berubah warna?',
        jawab: 'Jadi lebih banyak dok, warnanya kuning kehijauan dan kental, beda dari biasanya yang bening.',
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_merokok',
        kategori: 'sosial',
        tanya: 'Riwayat merokoknya bagaimana?',
        jawab: 'Merokok sejak muda dok, sehari bisa sebungkus lebih, sudah puluhan tahun.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Sudah lama punya keluhan sesak/batuk menahun ini? Pernah dirawat karena paru?',
        jawab: 'Sudah bertahun-tahun batuk berdahak tiap pagi dok, tahun lalu sempat dirawat karena sesak.',
        esensial: true,
        oldcarts: ['durasi'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Ada demam, nyeri dada, atau kaki bengkak?',
        jawab: 'Agak meriang dok, kaki nggak bengkak, dada nggak nyeri menusuk.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kesadaran',
        kategori: 'rps',
        tanya: 'Ada bingung, mengantuk berat, atau bibir kebiruan?',
        jawab: 'Kadang bingung ringan dok kalau sesaknya memuncak, bibir sempat kelihatan agak biru kata istri saya.',
        esensial: true,
        oldcarts: ['penyerta', 'keparahan'],
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sesak berat, duduk membungkuk (tripod), bibir memucat kebiruan, bicara terputus-putus. Menggunakan otot bantu napas.', relevan: true },
      { region: 'toraks_paru', temuan: 'Barrel chest, ekspirasi memanjang, wheezing ekspiratoar difus +/+, ronki kasar. Suara napas menjauh.', relevan: true },
      { region: 'jantung', temuan: 'Takikardia, S1/S2 sulit dinilai karena wheezing; tidak ada gallop jelas.', relevan: true },
      { region: 'ekstremitas', temuan: 'Akral hangat, tidak ada edema tungkai bermakna. Clubbing finger (+).', relevan: false },
      { region: 'abdomen', temuan: 'Supel, hepar tak jelas membesar.', relevan: false },
    ],
    lab: [
      { id: 'ekg', hasil: 'Sinus takikardia, tampak P pulmonal; tidak ada tanda iskemia akut.', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Leukosit 13.100/µL (leukositosis), Hb 16.2 (cenderung polisitemia kronik).', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['J44.1', 'J18.9', 'I50.9'],
    tatalaksana: {
      obatBenar: [],
      // GOLD: bronkodilator inhalasi/nebul + KORTIKOSTEROID SISTEMIK adalah pilar
      // eksaserbasi; SABA ORAL (tablet) TIDAK setara & tak dianjurkan untuk
      // eksaserbasi berat (dipindah ke obatSalahUmum). Nebulisasi = prosedur.
      // CODEX: clue kasus ini eksplisit bilang "ketiganya ada → antibiotik
      // terindikasi" (Anthonisen) & obatSalahUmum sudah menghukum kloramfenikol
      // sbg antibiotik SALAH — tapi tak ada slot antibiotik BENAR sampai
      // ditambah di sini. GOLD 2025: aminopenisilin+klavulanat, makrolida, atau
      // tetrasiklin (doksisiklin) sama-sama pilihan lini pertama utk eksaserbasi
      // purulen — grup "pilih salah satu" (bukan wajib kombinasi, satu infeksi
      // cukup satu lini, sama spt pola tifoid kloramfenikol/kotrimoksazol/amoksisilin).
      obatAlternatif: [
        ['salbutamol_inhaler'],
        ['prednison_5'],
        ['amoxiclav_625', 'azitromisin_500', 'doksisiklin_100'],
      ],
      prosedur: ['nebulisasi'],
      obatSalahUmum: [
        { id: 'salbutamol_2', alasan: 'SABA ORAL (tablet) BUKAN pilihan untuk eksaserbasi berat — onset lambat, efek samping sistemik (tremor, takikardia) lebih besar; bronkodilator harus rute INHALASI/NEBULISASI (GOLD).' },
        { id: 'kloramfenikol_250', alasan: 'Antibiotik yang tak tepat untuk eksaserbasi PPOK. Bila sputum purulen + gejala kardinal (indikasi antibiotik), pilih golongan yang sesuai — dan yang terpenting: jangan menunda rujukan saat SpO2 89% + tanda gagal napas.' },
      ],
      edukasi: ['berhenti_merokok', 'teknik_inhaler', 'tanda_bahaya', 'kontrol_rutin'],
    },
    clue: 'Eksaserbasi PPOK (kriteria Anthonisen: sesak↑, volume sputum↑, purulensi sputum↑ — ketiganya ada → antibiotik terindikasi). SpO2 89% + tanda gagal napas (bingung, sianosis, otot bantu) = eksaserbasi BERAT. Bundel GOLD: O2 TERKONTROL (target SpO2 88–92%, hindari over-oksigenasi) + bronkodilator INHALASI/NEBULISASI (SABA ± SAMA) + KORTIKOSTEROID SISTEMIK + antibiotik (sputum purulen) — lalu RUJUK paru segera. SABA oral tak setara; jangan biarkan urusan obat menunda rujukan.',
    konsekuensi: {
      narasi: 'Bila tidak segera dirujuk, eksaserbasi berat berlanjut ke gagal napas hiperkapnik (asidosis respiratorik) dan penurunan kesadaran yang mengancam jiwa.',
      kembaliHariMin: 0,
      kembaliHariMax: 1,
      kondisiKembali: 'Pasien kembali dalam hitungan jam dengan kesadaran menurun, sianosis makin dalam, dan napas melemah — gagal napas.',
      guideline: 'GOLD / PPK IDI PPOK — eksaserbasi berat: oksigen terkontrol + bronkodilator + rujuk untuk penanganan lanjut.',
    },
  },

  /* ======================================================================
   * 5. GERD (4A, tinggi)
   * Poin ajar: heartburn + regurgitasi asam → terapi empiris PPI + gaya hidup;
   *   HINDARI over-endoskopi tanpa alarm; hati-hati diagnosis banding jantung.
   * ==================================================================== */
  {
    id: 'gerd',
    nama: 'Penyakit Refluks Gastroesofageal (GERD)',
    icd10: 'K21.9',
    skdi: '4A',
    kategori: 'pencernaan',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Dada saya panas seperti terbakar dok, naik sampai tenggorokan, apalagi habis makan atau kalau berbaring.',
    demografi: { usiaMin: 25, usiaMax: 55 },
    vital: { td: '124/80', nadi: 82, rr: 18, suhu: 36.7, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Rasa panasnya di mana dan menjalar ke mana?',
        jawab: 'Di ulu hati naik ke dada tengah sampai pangkal tenggorokan dok, kadang mulut terasa asam pahit.',
        variasi: {
          polos: 'Neng ulu ati munggah nang dhadha dok, cangkemé krasa kecut.',
          terpelajar: 'Rasa terbakar di belakang tulang dada dok, disertai asam naik ke tenggorokan dan rasa pahit di mulut.',
          cemas: 'Dadanya panas dan sesak dok, saya takut ini jantung, tetangga saya kena serangan jantung gejalanya mirip.',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter', 'radiasi'],
      },
      {
        id: 'q_pencetus',
        kategori: 'keluhan_utama',
        tanya: 'Kapan memberat? Setelah makan, berbaring, atau saat aktivitas fisik?',
        jawab: 'Memberat habis makan banyak dan kalau berbaring/rebahan dok, terutama malam. Kalau jalan atau naik tangga justru nggak tambah parah.',
        esensial: true,
        oldcarts: ['agravasi', 'waktu'],
      },
      {
        id: 'q_penyerta',
        kategori: 'rps',
        tanya: 'Ada rasa mengganjal di tenggorokan, batuk kering malam, atau suara serak?',
        jawab: 'Iya dok, sering berdehem, batuk kering malam hari, dan tenggorokan seperti ada yang mengganjal.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_jantung',
        kategori: 'rps',
        tanya: 'Nyerinya muncul saat aktivitas berat lalu reda saat istirahat? Ada keringat dingin atau menjalar ke lengan kiri/rahang?',
        jawab: 'Nggak dok, justru muncul kalau habis makan dan berbaring, bukan saat capek. Nggak menjalar ke lengan.',
        esensial: true,
        oldcarts: ['agravasi', 'radiasi'],
      },
      {
        id: 'q_alarm',
        kategori: 'rps',
        tanya: 'Ada sulit/nyeri menelan, muntah darah, BAB hitam, atau berat badan turun drastis?',
        jawab: 'Nggak ada dok, makan masih lancar, BB stabil, nggak ada muntah darah.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_gaya',
        kategori: 'sosial',
        tanya: 'Kebiasaan makannya bagaimana? Sering telat makan, kopi, gorengan, atau langsung tidur setelah makan?',
        jawab: 'Sering dok, makan malam larut lalu langsung tidur, suka kopi dan gorengan, kadang merokok.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_obat',
        kategori: 'rpd',
        tanya: 'Sedang rutin minum obat pereda nyeri/rematik (NSAID) atau jamu pegal?',
        jawab: 'Kadang beli obat pegal di warung dok kalau badan capek.',
        oldcarts: ['penyerta'],
      },
      // distraktor: golongan darah tidak relevan untuk GERD.
      {
        id: 'q_goldar',
        kategori: 'sosial',
        tanya: 'Golongan darahnya apa?',
        jawab: 'A dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Compos mentis, tampak sehat, tidak sesak, tidak berkeringat dingin. Tidak tampak sakit berat.', relevan: true },
      { region: 'abdomen', temuan: 'Nyeri tekan epigastrium ringan, bising usus normal, tidak ada defans, hepar/lien tidak membesar.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-), tidak ada nyeri saat palpasi dada yang mereproduksi keluhan.', relevan: true },
      { region: 'tht_mulut', temuan: 'Faring posterior sedikit hiperemis (iritasi asam), tidak ada eksudat.', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
    ],
    lab: [
      { id: 'ekg', hasil: 'Irama sinus normal, tidak ada elevasi/depresi ST — membantu menyingkirkan iskemia jantung pada nyeri dada atipik.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['K21.9', 'K30', 'K25.9'],
    tatalaksana: {
      obatBenar: [],
      // PPI setara — beri SALAH SATU (omeprazol atau lansoprazol), bukan dua PPI.
      obatAlternatif: [['omeprazole_20', 'lansoprazol_30']],
      obatSalahUmum: [
        { id: 'natrium_diklofenak_50', alasan: 'NSAID mengiritasi mukosa lambung dan memperberat refluks/ulkus — kontraproduktif pada GERD. Jangan diberikan untuk "nyeri" ulu hati refluks.' },
        { id: 'domperidon_10', alasan: 'Prokinetik boleh sebagai tambahan bila regurgitasi menonjol, tetapi BUKAN pengganti PPI dan tidak diberikan tunggal sebagai terapi utama GERD.' },
      ],
      edukasi: ['posisi_tidur_gerd', 'diet_lambung', 'berhenti_merokok', 'tanda_bahaya'],
    },
    clue: 'GERD: heartburn retrosternal + regurgitasi asam, memberat setelah makan & berbaring, MEMBAIK saat aktivitas (kebalikan angina). Diagnosis klinis → terapi empiris PPI 4–8 minggu + modifikasi gaya hidup (tinggikan kepala saat tidur, jangan langsung berbaring, kurangi kopi/rokok/gorengan). Endoskopi HANYA bila ada alarm (disfagia, penurunan BB, anemia, hematemesis/melena, usia >45–50 onset baru) atau gagal terapi (PPK IDI). Nyeri dada atipik → singkirkan jantung dulu.',
    konsekuensi: {
      narasi: 'Bila gaya hidup tidak diperbaiki dan diberi NSAID, refluks/gastritis memberat; sebaliknya over-endoskopi dini tanpa alarm membebani pasien dan sistem tanpa mengubah tata laksana awal.',
      kembaliHariMin: 14,
      kembaliHariMax: 30,
      kondisiKembali: 'Pasien kembali dengan keluhan menetap karena tetap makan larut lalu berbaring dan sempat minum obat pegal (NSAID) dari warung.',
      guideline: 'PPK IDI GERD — terapi empiris PPI + gaya hidup; endoskopi hanya atas indikasi alarm.',
    },
  },

  /* ======================================================================
   * 6. Dispepsia Fungsional (4A, tinggi)
   * Poin ajar: dispepsia tanpa alarm → terapi empiris, HINDARI over-endoskopi & NSAID.
   * ==================================================================== */
  {
    id: 'dispepsia_fungsional',
    nama: 'Dispepsia Fungsional',
    icd10: 'K30',
    skdi: '4A',
    kategori: 'pencernaan',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'tinggi',
    keluhanUtama: 'Ulu hati saya sering perih dan begah dok, cepat kenyang, sudah berminggu-minggu hilang timbul.',
    demografi: { usiaMin: 20, usiaMax: 44 },
    vital: { td: '116/74', nadi: 78, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan ulu hatinya seperti apa?',
        jawab: 'Perih dan begah dok, cepat kenyang baru makan sedikit, kadang mual dan sendawa terus.',
        variasi: {
          polos: 'Ulu ati perih karo seneb dok, lagi mangan sithik wis wareg, kerep glegeken.',
          terpelajar: 'Nyeri ulu hati disertai rasa penuh setelah makan dan cepat kenyang dok, sudah beberapa minggu.',
          cemas: 'Perut saya nggak enak terus dok, jangan-jangan ini penyakit lambung berat atau kanker ya?',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter', 'penyerta'],
      },
      {
        id: 'q_durasi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa lama dan bagaimana polanya?',
        jawab: 'Sudah sekitar sebulan dok, hilang timbul, memberat kalau telat makan dan lagi banyak pikiran.',
        esensial: true,
        oldcarts: ['onset', 'durasi', 'agravasi'],
      },
      {
        id: 'q_alarm',
        kategori: 'rps',
        tanya: 'Ada sulit menelan, muntah darah, BAB hitam, atau berat badan turun tanpa sebab?',
        jawab: 'Nggak ada dok, makan masih bisa, BB stabil, nggak pernah muntah darah atau BAB hitam.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_nsaid',
        kategori: 'rpd',
        tanya: 'Sering minum obat pereda nyeri/rematik atau jamu pegal linu?',
        jawab: 'Kadang dok, kalau kepala atau badan pegal beli obat di warung.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_stres',
        kategori: 'sosial',
        tanya: 'Akhir-akhir ini banyak pikiran atau stres? Pola makan teratur?',
        jawab: 'Iya dok, lagi banyak masalah kerjaan, makan jadi nggak teratur dan sering telat.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_kopi',
        kategori: 'sosial',
        tanya: 'Sering kopi, pedas, atau merokok?',
        jawab: 'Kopi tiap hari dok, suka pedas, kadang merokok kalau stres.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_jantung',
        kategori: 'rps',
        tanya: 'Nyerinya pernah muncul saat aktivitas berat lalu reda saat istirahat, atau disertai keringat dingin?',
        jawab: 'Nggak dok, lebih ke soal makan dan lambung, bukan pas capek.',
        oldcarts: ['agravasi'],
      },
      // distraktor: pekerjaan pasangan tidak relevan untuk dispepsia.
      {
        id: 'q_kerja_pasangan',
        kategori: 'sosial',
        tanya: 'Suami/istri kerjanya apa?',
        jawab: 'Wiraswasta dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'abdomen', temuan: 'Nyeri tekan epigastrium ringan, tidak ada massa, bising usus normal, tidak ada defans/nyeri lepas.', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, tampak sehat, tidak pucat, tidak tampak kesakitan hebat.', relevan: true },
      { region: 'kulit', temuan: 'Konjungtiva tidak pucat (tidak anemis), turgor baik.', relevan: true },
      { region: 'jantung', temuan: 'S1/S2 reguler, murmur (-).', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Hb 13.6, Leukosit normal — tidak ada anemia (mendukung dispepsia fungsional, bukan alarm).', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['K30', 'K21.9', 'K29.7'],
    tatalaksana: {
      obatBenar: ['omeprazole_20', 'antasida_doen'],
      obatSalahUmum: [
        { id: 'asam_mefenamat_500', alasan: 'NSAID justru salah satu penyebab dispepsia/ulkus — memberikannya untuk "nyeri" ulu hati memperparah keluhan. Hentikan NSAID, bukan menambah.' },
        { id: 'amoxicillin_500', alasan: 'Antibiotik hanya sebagai bagian rejimen eradikasi H. pylori BILA terbukti/terindikasi, bukan diberikan tunggal empiris pada dispepsia fungsional.' },
      ],
      edukasi: ['diet_lambung', 'manajemen_stres', 'tanda_bahaya', 'higiene_tidur'],
    },
    clue: 'Dispepsia fungsional: nyeri epigastrium/rasa penuh/cepat kenyang TANPA alarm (disfagia, BB turun, anemia, hematemesis/melena, massa, usia onset >45–50). Tata laksana empiris PPI/antasida + hentikan NSAID + kelola stres & pola makan. Endoskopi TIDAK rutin — hanya bila ada alarm atau gagal terapi (PPK IDI / konsensus dispepsia). Test-and-treat H. pylori sesuai indikasi.',
    konsekuensi: {
      narasi: 'Bila NSAID diteruskan dan pola makan tidak diperbaiki, dapat berkembang menjadi ulkus peptikum; sebaliknya endoskopi dini tanpa alarm membebani pasien tanpa mengubah terapi awal.',
      kembaliHariMin: 14,
      kembaliHariMax: 30,
      kondisiKembali: 'Pasien kembali dengan nyeri ulu hati memberat setelah beberapa kali minum obat pegal (NSAID) dari warung.',
      guideline: 'PPK IDI / Konsensus Nasional Dispepsia — terapi empiris tanpa alarm, endoskopi atas indikasi.',
    },
  },

  /* ======================================================================
   * 7. Disentri Basiler (4A, sedang)
   * Poin ajar: diare BERDARAH + lendir + demam → antibiotik (siprofloksasin) +
   *   rehidrasi; kontras dgn diare akut cair yang TANPA antibiotik.
   * ==================================================================== */
  {
    id: 'disentri_basiler',
    nama: 'Disentri Basiler (Shigellosis)',
    icd10: 'A03.9',
    skdi: '4A',
    kategori: 'pencernaan',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'BAB saya cair bercampur darah dan lendir dok, sering banget, perut mulas dan mau BAB terus.',
    demografi: { usiaMin: 15, usiaMax: 50 },
    vital: { td: '110/70', nadi: 100, rr: 20, suhu: 38.5 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'BAB-nya seperti apa? Ada darah atau lendir?',
        jawab: 'Cair sedikit-sedikit tapi sering dok, ada darah segar dan lendir, tiap habis BAB rasanya masih mau BAB lagi.',
        variasi: {
          polos: 'Ngising cuér nanging kerep dok, ana getih karo lendhir, sabubaré ngising isih pengin ngising manèh.',
          terpelajar: 'Mencret disertai darah dan lendir dok, sedikit-sedikit tapi sering, dan terasa selalu ingin ke belakang.',
          cemas: 'BAB saya berdarah dok, ini bahaya nggak? Saya takut usus saya kenapa-kenapa.',
        },
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_frekuensi',
        kategori: 'keluhan_utama',
        tanya: 'Sudah berapa hari dan berapa kali sehari?',
        jawab: 'Dua hari ini dok, lebih dari sepuluh kali sehari tapi tiap kali sedikit.',
        esensial: true,
        oldcarts: ['onset', 'durasi', 'keparahan'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Ada demam dan mulas/nyeri perut?',
        jawab: 'Demam dok, perut mulas melilit terutama sebelum BAB.',
        esensial: true,
        oldcarts: ['penyerta', 'karakter'],
      },
      {
        id: 'q_minum',
        kategori: 'rps',
        tanya: 'Masih bisa minum? Ada lemas, pusing saat berdiri, atau kencing berkurang?',
        jawab: 'Masih bisa minum dok, agak lemas dan kencing sedikit berkurang.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_makan',
        kategori: 'rpd',
        tanya: 'Sebelum sakit makan sesuatu yang mencurigakan atau jajan sembarangan?',
        jawab: 'Kemarin makan di warung pinggir jalan yang kurang bersih dok, es-nya juga meragukan.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_kontak',
        kategori: 'rpk',
        tanya: 'Ada orang serumah/sekitar yang mencret berdarah juga?',
        jawab: 'Teman satu kos ada yang mencret juga dok, tapi belum tahu berdarah atau tidak.',
      },
      // distraktor: hobi berkebun tidak menentukan tata laksana disentri basiler.
      {
        id: 'q_hobi',
        kategori: 'sosial',
        tanya: 'Ada hobi berkebun atau memelihara tanaman?',
        jawab: 'Nggak dok, tinggal di kos jadi nggak sempat.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'umum', temuan: 'Tampak sakit sedang, febris, mukosa bibir agak kering (dehidrasi ringan-sedang), masih responsif.', relevan: true },
      { region: 'abdomen', temuan: 'Nyeri tekan difus terutama kolon kiri bawah, bising usus meningkat, tidak ada defans/nyeri lepas.', relevan: true },
      { region: 'kulit', temuan: 'Turgor kembali agak lambat, akral hangat, CRT <2 detik.', relevan: true },
      { region: 'tht_mulut', temuan: 'Faring tenang.', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
    ],
    lab: [
      { id: 'feses_rutin', hasil: 'Lendir (+), darah (+), leukosit banyak (>20/lpb), eritrosit (+) — mendukung disentri basiler. Amoeba/trofozoit tidak ditemukan.', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Leukosit 15.400/µL dengan neutrofilia (mendukung infeksi bakteri invasif).', flag: 'tinggi', relevan: true },
    ],
    diagnosisBanding: ['A03.9', 'A06.0', 'A09'],
    tatalaksana: {
      obatBenar: ['ciprofloxacin_500', 'oralit', 'zinc_20'],
      obatSalahUmum: [
        { id: 'loperamid_2', alasan: 'Antimotilitas DILARANG pada diare berdarah/disentri invasif — menahan patogen & toksin, memicu megakolon toksik dan memperpanjang penyakit.' },
        { id: 'metronidazol_500', alasan: 'Metronidazol untuk disentri AMEBA; pada disentri basiler (Shigella) yang tepat adalah antibiotik seperti siprofloksasin. Feses di sini tidak menunjukkan trofozoit ameba.' },
      ],
      edukasi: ['cairan_oralit', 'cuci_tangan_makanan', 'tanda_bahaya', 'cuci_tangan'],
      // CODEX M10 ronde-2 (2026-07-06): konsekuensi.narasi eksplisit sebut
      // dehidrasi memberat — rehidrasi oralit topik yang tak boleh dilewatkan.
      edukasiKritis: ['cairan_oralit'],
    },
    clue: 'Disentri BASILER (Shigella): diare sedikit-sedikit tapi sering, DARAH + lendir, demam, tenesmus, leukosit feses banyak. Beri antibiotik (siprofloksasin) + rehidrasi oralit + zinc; JANGAN beri antimotilitas (loperamid). Bedakan disentri AMEBA (trofozoit di feses) → metronidazol. Kontras dengan diare akut cair non-disentri yang TANPA antibiotik (Kemenkes; WHO).',
    konsekuensi: {
      narasi: 'Bila diberi antimotilitas atau tidak diberi antibiotik yang tepat, risiko dehidrasi memberat, penyebaran, dan pada anak/lansia dapat mengancam jiwa.',
      kembaliHariMin: 2,
      kembaliHariMax: 4,
      kondisiKembali: 'Pasien kembali dengan demam menetap, BAB berdarah berlanjut, dan makin lemas — dehidrasi & infeksi tidak terkontrol.',
      guideline: 'PPK IDI / Kemenkes — disentri basiler: antibiotik + rehidrasi; tanpa antimotilitas.',
    },
  },

  /* ======================================================================
   * 8. Askariasis (4A, sedang)
   * Poin ajar: cacingan usus → albendazol/pirantel dosis tunggal + higiene; hindari
   *   over-treatment antibiotik untuk nyeri perut samar.
   * ==================================================================== */
  {
    id: 'askariasis',
    nama: 'Askariasis (Cacing Gelang)',
    icd10: 'B77.9',
    skdi: '4A',
    kategori: 'pencernaan',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Anak saya perutnya sering sakit dok, nafsu makan kurang, dan kemarin keluar cacing waktu BAB.',
    demografi: { usiaMin: 4, usiaMax: 10 },
    vital: { td: '95/65', nadi: 92, rr: 22, suhu: 36.8 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Keluhan anaknya apa, Bu?',
        jawab: 'Perutnya sering sakit di sekitar pusar dok, kembung, dan kemarin waktu BAB keluar cacing panjang seperti mie.',
        variasi: {
          wali_anak: 'Anak saya sering mengeluh perut sakit di sekitar pusar dok, perutnya buncit, dan kemarin ada cacing keluar saat BAB — saya kaget sekali.',
          polos: 'Weteng bocahé kerep loro dok mubeng puser, mben ana cacing metu pas ngising.',
          cemas: 'Dok anak saya keluar cacing, ini bahaya nggak? Apa cacingnya bisa naik ke mana-mana?',
        },
        esensial: true,
        oldcarts: ['lokasi', 'karakter', 'penyerta'],
      },
      {
        id: 'q_bb',
        kategori: 'rps',
        tanya: 'Berat badan dan nafsu makannya bagaimana?',
        jawab: 'Nafsu makan kurang dok, badannya kurus, susah naik berat badan padahal makan.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_bab',
        kategori: 'rps',
        tanya: 'Selain cacing tadi, BAB-nya bagaimana? Ada diare atau darah?',
        jawab: 'BAB biasa dok, nggak diare, nggak berdarah, cuma sesekali kembung.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_higiene',
        kategori: 'sosial',
        tanya: 'Kebiasaan cuci tangan dan main anaknya bagaimana? Sering main tanah tanpa alas kaki?',
        jawab: 'Sering main tanah tanpa sandal dok, dan suka lupa cuci tangan sebelum makan.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_lingkungan',
        kategori: 'sosial',
        tanya: 'Di rumah pakai jamban sehat? Sumber airnya bagaimana?',
        jawab: 'Kadang masih BAB di kebun dok, air dari sumur.',
      },
      {
        id: 'q_batuk',
        kategori: 'rps',
        tanya: 'Beberapa minggu lalu sempat batuk-batuk atau sesak tanpa sebab jelas?',
        jawab: 'Iya dok, sempat batuk-batuk beberapa hari lalu sembuh sendiri.',
        oldcarts: ['penyerta'],
      },
      // distraktor: mainan favorit anak tidak relevan untuk tata laksana askariasis.
      {
        id: 'q_mainan',
        kategori: 'sosial',
        tanya: 'Mainan favoritnya apa?',
        jawab: 'Bola dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'abdomen', temuan: 'Perut sedikit buncit, nyeri tekan periumbilikal ringan, bising usus normal, tidak ada defans.', relevan: true },
      { region: 'umum', temuan: 'Anak tampak kurus (gizi kurang), konjungtiva sedikit pucat, aktif dan responsif.', relevan: true },
      { region: 'kulit', temuan: 'Turgor baik, tidak ada edema, kuku dan telapak agak kotor.', relevan: false },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, saat ini ronki -/- (fase migrasi paru sudah lewat).', relevan: false },
      { region: 'tht_mulut', temuan: 'Faring tenang.', relevan: false },
    ],
    lab: [
      { id: 'feses_rutin', hasil: 'Ditemukan telur Ascaris lumbricoides (berdinding tebal, bergelombang). Darah/lendir (-).', flag: 'abnormal', relevan: true },
      { id: 'darah_rutin', hasil: 'Eosinofilia ringan, Hb 10.8 (anemia ringan).', flag: 'abnormal', relevan: true },
    ],
    diagnosisBanding: ['B77.9', 'B76.9', 'B80'],
    tatalaksana: {
      obatBenar: [],
      // Antelmintik setara — beri SALAH SATU (albendazol ATAU pirantel), bukan dua.
      obatAlternatif: [['albendazol_400', 'pirantel_pamoat']],
      obatSalahUmum: [
        { id: 'metronidazol_500', alasan: 'Metronidazol untuk protozoa (amuba/giardia), bukan cacing gelang. Antelmintik (albendazol/pirantel) yang tepat untuk askariasis.' },
        { id: 'amoxicillin_500', alasan: 'Antibiotik tidak berperan pada infeksi cacing; nyeri perut di sini akibat cacing, bukan infeksi bakteri.' },
      ],
      edukasi: ['cuci_tangan_makanan', 'gizi_seimbang', 'cuci_tangan', 'tanda_bahaya'],
    },
    clue: 'Askariasis: nyeri perut periumbilikal + gizi kurang + riwayat keluar cacing / telur di feses, faktor risiko higiene (main tanah, jamban tidak sehat). Terapi albendazol 400 mg dosis tunggal (atau pirantel pamoat) + perbaikan higiene & sanitasi + obati keluarga bila perlu. Waspada komplikasi obstruksi/ileus bila cacing sangat banyak → rujuk bedah. Selaras program POPM cacingan Kemenkes.',
    konsekuensi: {
      narasi: 'Bila tidak diobati dan higiene tidak diperbaiki, infeksi berulang menyebabkan malnutrisi kronik; beban cacing berat berisiko obstruksi usus.',
      kembaliHariMin: 30,
      kembaliHariMax: 60,
      kondisiKembali: 'Anak kembali dengan berat badan tetap sulit naik dan perut kembung karena reinfeksi (kebiasaan higiene belum berubah).',
      guideline: 'Pedoman POPM Cacingan Kemenkes / WHO — antelmintik massal + sanitasi.',
    },
  },

  /* ======================================================================
   * 9. Hemoroid Grade 1 (4A, sedang)
   * Poin ajar: BAB berdarah tanpa nyeri, benjolan belum keluar → konservatif
   *   (serat, higiene, hindari mengejan); bukan indikasi bedah dini.
   * ==================================================================== */
  {
    id: 'hemoroid_grade1',
    nama: 'Hemoroid Interna Grade 1',
    icd10: 'K64.0',
    skdi: '4A',
    kategori: 'pencernaan',
    fktp144: true,
    harusDirujuk: false,
    prevalensi: 'sedang',
    keluhanUtama: 'Kalau BAB keras suka ada darah menetes dok, warnanya merah segar, tapi nggak sakit.',
    demografi: { usiaMin: 30, usiaMax: 55 },
    vital: { td: '122/80', nadi: 78, rr: 18, suhu: 36.6, spo2: 99 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Darahnya seperti apa? Menetes, menyemprot, atau bercampur dengan tinja?',
        jawab: 'Menetes di akhir BAB dok, merah segar, menempel di kertas dan sedikit di kloset, nggak bercampur di dalam tinja.',
        variasi: {
          polos: 'Netes neng pungkasané ngising dok, abang seger, ora campur karo tinjané.',
          terpelajar: 'Darah segar menetes setelah buang air besar dok, tidak bercampur tinja, dan tidak nyeri.',
          cemas: 'BAB saya berdarah dok, saya takut ini kanker usus seperti yang di internet.',
        },
        esensial: true,
        oldcarts: ['karakter', 'waktu'],
      },
      {
        id: 'q_nyeri',
        kategori: 'rps',
        tanya: 'Terasa nyeri saat BAB atau ada benjolan yang keluar dari anus?',
        jawab: 'Nggak nyeri dok, dan nggak ada benjolan yang keluar. Kadang cuma terasa gatal di dubur.',
        esensial: true,
        oldcarts: ['karakter', 'penyerta'],
      },
      {
        id: 'q_bab',
        kategori: 'rps',
        tanya: 'BAB-nya keras dan sering mengejan? Sudah berapa lama begini?',
        jawab: 'Iya dok, sering sembelit dan mengejan kuat, sudah beberapa bulan hilang timbul.',
        esensial: true,
        oldcarts: ['onset', 'agravasi'],
      },
      {
        id: 'q_alarm',
        kategori: 'rps',
        tanya: 'Ada berat badan turun, BAB jadi kecil-kecil/pipih, atau perubahan pola BAB dan lendir?',
        jawab: 'Nggak dok, BB stabil, pola BAB tetap, cuma keras dan berdarah kalau sembelit.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_diet',
        kategori: 'sosial',
        tanya: 'Pola makannya bagaimana? Cukup serat dan air? Sering duduk lama?',
        jawab: 'Kurang sayur dan buah dok, jarang minum air, dan pekerjaan saya duduk seharian.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_keluarga',
        kategori: 'rpk',
        tanya: 'Ada keluarga dengan wasir atau riwayat kanker usus?',
        jawab: 'Bapak saya dulu wasir dok, kalau kanker usus tidak ada yang tahu.',
      },
      // distraktor: merek sepatu kerja tidak relevan untuk hemoroid.
      {
        id: 'q_sepatu',
        kategori: 'sosial',
        tanya: 'Sepatu kerjanya nyaman?',
        jawab: 'Nyaman dok.',
        distraktor: true,
      },
    ],
    pemeriksaanFisik: [
      { region: 'abdomen', temuan: 'Datar, supel, bising usus normal, tidak ada massa/nyeri tekan.', relevan: true },
      { region: 'umum', temuan: 'Compos mentis, tampak sehat, konjungtiva tidak pucat (tidak anemis).', relevan: true },
      { region: 'ekstremitas', temuan: 'Inspeksi/colok dubur: tidak tampak benjolan menonjol keluar, tonus sfingter baik, teraba pelebaran vena tanpa massa keras; sarung tangan ada bercak darah segar, tidak ada massa keras mencurigakan keganasan.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+.', relevan: false },
      { region: 'jantung', temuan: 'S1/S2 reguler.', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Hb 13.4 (tidak anemis) — perdarahan minimal, mendukung hemoroid ringan, bukan perdarahan masif/keganasan.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['K64.0', 'K60.2', 'K62.5'],
    tatalaksana: {
      obatBenar: ['laktulosa_syr'],
      obatSalahUmum: [
        { id: 'natrium_diklofenak_50', alasan: 'NSAID bukan terapi hemoroid grade 1 dan berisiko iritasi lambung; keluhan utamanya sembelit, bukan nyeri hebat. Fokus pelunak tinja & serat.' },
        { id: 'ciprofloxacin_500', alasan: 'Tidak ada indikasi antibiotik pada hemoroid tanpa infeksi; peresepan hanya menambah risiko resistensi.' },
      ],
      edukasi: ['gizi_seimbang', 'minum_air_cukup', 'aktivitas_fisik', 'tanda_bahaya'],
    },
    clue: 'Hemoroid interna grade 1: hematokezia segar TANPA nyeri, menetes/di kertas pascadefekasi, benjolan BELUM prolaps. Tata laksana KONSERVATIF: tinggi serat + cukup air + hindari mengejan lama + pelunak tinja; bukan indikasi bedah. WAJIB colok dubur & waspadai red flag keganasan (usia >45–50, BB turun, anemia, perubahan pola BAB, riwayat keluarga kanker kolorektal) → pertimbangkan rujukan/kolonoskopi (PPK IDI).',
    konsekuensi: {
      narasi: 'Bila sembelit dan mengejan tidak diperbaiki, hemoroid dapat berkembang ke derajat lebih tinggi (prolaps); mengabaikan colok dubur berisiko melewatkan keganasan pada perdarahan rektal.',
      kembaliHariMin: 30,
      kembaliHariMax: 90,
      kondisiKembali: 'Pasien kembali dengan benjolan yang kini keluar saat BAB (naik derajat) karena pola serat/air belum diperbaiki.',
      guideline: 'PPK IDI Hemoroid — konservatif pada derajat rendah; colok dubur & waspada keganasan.',
    },
  },

  /* ======================================================================
   * 10. Apendisitis Akut (3B, WAJIB-RUJUK bedah, rendah)
   * Poin ajar: nyeri berpindah ke McBurney + tanda peritoneal → rujuk bedah.
   *   JANGAN beri analgetik/antibiotik yang menutupi tanda sebelum penilaian bedah.
   * ==================================================================== */
  {
    id: 'apendisitis_akut',
    nama: 'Apendisitis Akut',
    icd10: 'K35.80',
    skdi: '3B',
    kategori: 'pencernaan',
    // CODEX ronde-16 P2: 3B (rujuk) tak mungkin "wajib tuntas 144" (4A saja).
    fktp144: false,
    harusDirujuk: true,
    prevalensi: 'rendah',
    spesialisRujukan: 'bedah',
    keluhanUtama: 'Perut kanan bawah saya sakit hebat dok, awalnya di ulu hati/sekitar pusar lalu pindah ke kanan bawah.',
    demografi: { usiaMin: 12, usiaMax: 40 },
    vital: { td: '120/80', nadi: 104, rr: 20, suhu: 38.2 },
    anamnesis: [
      {
        id: 'q_keluhan',
        kategori: 'keluhan_utama',
        tanya: 'Nyerinya mulai dari mana dan berpindah ke mana?',
        jawab: 'Mulanya di ulu hati dan sekitar pusar dok, samar, lalu dalam sehari pindah dan menetap di perut kanan bawah, makin tajam.',
        variasi: {
          polos: 'Mulané neng ulu ati karo mubeng puser dok, banjur pindhah nang tengen ngisor, saya lara.',
          terpelajar: 'Awalnya nyeri tumpul di sekitar pusar dan ulu hati dok, lalu berpindah ke perut kanan bawah dan menetap di situ.',
          cemas: 'Sakitnya hebat sekali dok di kanan bawah, kalau bergerak atau batuk tambah sakit, ini kenapa?',
        },
        esensial: true,
        oldcarts: ['onset', 'lokasi', 'radiasi', 'karakter'],
      },
      {
        id: 'q_mual',
        kategori: 'rps',
        tanya: 'Ada mual, muntah, atau nafsu makan hilang?',
        jawab: 'Mual dan muntah sekali dok, nafsu makan hilang total sejak nyeri pindah.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_gerak',
        kategori: 'rps',
        tanya: 'Nyerinya bertambah saat bergerak, batuk, atau saat jalan terguncang?',
        jawab: 'Iya dok, batuk atau jalan sedikit terguncang saja tambah nyeri, jadi maunya diam saja.',
        esensial: true,
        oldcarts: ['agravasi'],
      },
      {
        id: 'q_demam',
        kategori: 'rps',
        tanya: 'Ada demam? BAB dan kencing bagaimana?',
        jawab: 'Demam ringan dok, BAB biasa, kencing juga biasa tidak nyeri.',
        esensial: true,
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_haid',
        kategori: 'rps',
        tanya: 'Untuk perempuan: haid terakhir kapan dan teratur? (menyingkirkan penyebab kandungan)',
        jawab: 'Haid teratur dok, terakhir dua minggu lalu, tidak ada keputihan atau perdarahan tak biasa.',
        oldcarts: ['penyerta'],
      },
      {
        id: 'q_riwayat',
        kategori: 'rpd',
        tanya: 'Pernah nyeri perut serupa atau ada penyakit lambung sebelumnya?',
        jawab: 'Belum pernah separah ini dok, baru kali ini.',
      },
    ],
    pemeriksaanFisik: [
      { region: 'abdomen', temuan: 'Nyeri tekan maksimal di titik McBurney (kuadran kanan bawah), nyeri lepas (Blumberg) (+), defans muskular lokal (+). Rovsing (+), psoas sign (+).', relevan: true },
      { region: 'umum', temuan: 'Tampak kesakitan, berbaring dengan tungkai kanan sedikit ditekuk, enggan bergerak, febris, takikardia.', relevan: true },
      { region: 'ekstremitas', temuan: 'Nyeri kuadran kanan bawah saat ekstensi tungkai kanan (psoas). Colok dubur: nyeri pada perabaan sisi kanan.', relevan: true },
      { region: 'toraks_paru', temuan: 'Vesikuler +/+, ronki -/-.', relevan: false },
      { region: 'jantung', temuan: 'Takikardia, S1/S2 reguler, murmur (-).', relevan: false },
    ],
    lab: [
      { id: 'darah_rutin', hasil: 'Leukosit 15.800/µL dengan neutrofilia (shift to the left) — mendukung apendisitis akut.', flag: 'tinggi', relevan: true },
      { id: 'urinalisis', hasil: 'Leukosit/eritrosit urin minimal, nitrit (-) — membantu menyingkirkan ISK/kolik ureter.', flag: 'normal', relevan: true },
      { id: 'tes_kehamilan', hasil: 'Negatif (pada pasien perempuan usia subur) — menyingkirkan kehamilan ektopik.', flag: 'normal', relevan: true },
    ],
    diagnosisBanding: ['K35.80', 'N83.2', 'A09'],
    tatalaksana: {
      // Analgesia adekuat DIANJURKAN pra-rujukan — mitos "analgesik menutupi tanda
      // apendisitis" sudah TERBANTAH (Cochrane CD005660; WSES 2020). Parasetamol
      // aman; hindari NSAID pada perut akut (risiko GI/perdarahan bila perforasi/bedah).
      obatBenar: [],
      obatAlternatif: [['paracetamol_500']],
      obatSalahUmum: [
        { id: 'natrium_diklofenak_50', alasan: 'Untuk perut akut yang mungkin dioperasi, HINDARI NSAID (risiko iritasi/perdarahan GI & gangguan hemostasis peri-operatif) — pilih parasetamol. Catatan EBM: analgesia TIDAK menutupi tanda/menunda diagnosis (Cochrane), jadi nyeri tetap boleh diredakan; yang salah adalah memilih NSAID, bukan memberi analgesia.' },
        { id: 'amoxicillin_500', alasan: 'Apendisitis akut adalah kasus BEDAH — antibiotik ORAL di FKTP tidak menyembuhkan & jangan sampai menunda rujukan. Antibiotik parenteral peri-operatif adalah bagian standar tata laksana DI RS rujukan.' },
      ],
      edukasi: ['tanda_bahaya'],
    },
    clue: 'Apendisitis akut: nyeri BERPINDAH periumbilikal → McBurney + anoreksia/mual + nyeri lepas (Blumberg)/defans + demam ringan + leukositosis (skor Alvarado tinggi). Kompetensi 3B → PUASAKAN, pasang jalur IV, beri ANALGESIA ADEKUAT (parasetamol — mitos "analgesik menutupi tanda" sudah terbantah, Cochrane/WSES; hindari NSAID pada perut akut), dan RUJUK BEDAH segera. Jangan biarkan antibiotik oral menunda rujukan. Singkirkan kehamilan ektopik (β-hCG) pada perempuan usia subur.',
    konsekuensi: {
      narasi: 'Menunda rujukan atau memberi analgetik/antibiotik yang menutupi gejala berisiko perforasi apendiks → peritonitis generalisata dan sepsis yang mengancam jiwa.',
      kembaliHariMin: 0,
      kembaliHariMax: 2,
      kondisiKembali: 'Pasien kembali dengan nyeri seluruh perut, perut papan (defans generalisata), demam tinggi, dan takikardia — peritonitis akibat apendiks perforasi.',
      guideline: 'PPK IDI Apendisitis Akut / prinsip perut akut — rujuk bedah; hindari analgetik yang menutupi tanda peritoneal.',
    },
  },
]
