/**
 * KEGIATAN LAPANGAN TERJADWAL (M2) — satu mesin sesi generik untuk tiga program:
 * Posyandu (5 meja ringkas), Prolanis (kontrol kronis), Respons KLB (5W1H + aksi).
 * Sesi = dek KartuKegiatan yang dijawab berurutan; skor mengalir ke IKS/UKP,
 * bukan angka telanjang. Deterministik: RNG seed dari konteks.
 */

import type {
  KartuKegiatan,
  KegiatanState,
  PesertaProlanis,
  JenisKegiatan,
} from './state'
import type { Rng } from './core/rng'

/* ---------------------------------------------------------------------------
 * POSYANDU — migrasi ILP "5 Langkah" (Fix D5, triase DeepThink 2026-07-11,
 * keputusan Dr. Wirayuda: migrasi PENUH, bukan relabel). Riset: KMK
 * HK.01.07/MENKES/2015/2023 (Juknis ILP) + "25 Keterampilan Dasar Kader
 * Posyandu" (Kemenkes) — Posyandu ILP melayani SEMUA siklus hidup (bumil,
 * balita, remaja, usia produktif-lansia), bukan balita-saja spt 5-meja lama.
 *
 * Pool 12 kartu (4 per Langkah 2/3/4 sisi keputusan-klinis + 1 Langkah 5),
 * satu kartu ditarik per Langkah 2/3/4 tiap sesi (rng-seeded per RW+hari,
 * dari seedKurikulum agar adil lintas mahasiswa paket ujian sama) + Langkah 5
 * selalu tampil — total 4 kartu/sesi (jumlah sama dgn deck lama), tapi
 * kontennya berotasi lintas kelompok sasaran antar-kunjungan RW/bulan (hindari
 * hafalan & cakupan-balita-saja). Langkah 1 (Pendaftaran) tetap dilebur ke
 * narasi (tak perlu kartu keputusan).
 * ------------------------------------------------------------------------- */

const POOL_LANGKAH2: KartuKegiatan[] = [
  {
    id: 'posy_timbang',
    judul: 'Langkah 2 — Penimbangan & Pengukuran (Balita)',
    narasi:
      'An. Kadek, 18 bulan. Bulan lalu 9,1 kg; hari ini 8,7 kg. Ibunya bilang anaknya ' +
      'sempat diare seminggu. Di KMS, titik bulan ini turun memotong satu pita warna.',
    pilihan: [
      {
        id: 'a',
        // Fix #12a (audit CODEX 2026-07-11): label lama salah pakai "BGM" (Bawah
        // Garis Merah — kondisi TERPISAH, lebih berat, di bawah garis merah KMS)
        // utk penurunan SATU pita — respons di bawah sudah benar pakai istilah
        // "weight faltering", hanya labelnya yang keliru.
        label: 'Catat "berat turun/tidak naik" (alarm growth faltering — beda dari BGM/bawah garis merah), rujuk konseling gizi + telusuri penyebab',
        benar: true,
        respons:
          'Tepat. Berat turun melewati garis pita = alarm (weight faltering). Jangan ' +
          'ditunda — cari penyebab (asupan, infeksi) dan pantau ketat bulan depan.',
      },
      {
        id: 'b',
        label: 'Anggap wajar karena baru sakit, timbang lagi bulan depan saja',
        benar: false,
        respons:
          'Berbahaya. Faltering setelah sakit justru butuh intervensi aktif, bukan ' +
          'menunggu — di sinilah stunting bermula bila dibiarkan.',
      },
      {
        id: 'c',
        label: 'Langsung diagnosis gizi buruk & rujuk RS',
        benar: false,
        respons:
          'Berlebihan. Belum ada tanda gizi buruk (BB/TB, edema, tanda klinis). ' +
          'Over-rujuk membebani keluarga & sistem — nilai dulu status gizinya.',
      },
    ],
  },
  {
    id: 'posy_ukur_bumil',
    judul: 'Langkah 2 — Penimbangan & Pengukuran (Ibu Hamil)',
    narasi:
      'Bu Rukmini, hamil trimester 2. LILA diukur 22 cm. Berat badan naik lambat sejak ' +
      'awal kehamilan.',
    pilihan: [
      {
        id: 'a',
        label: 'Catat KEK (LILA <23,5cm), rujuk ANC terpadu/gizi + PMT ibu hamil',
        benar: true,
        respons:
          'Tepat. LILA <23,5cm = Kurang Energi Kronis — faktor risiko BBLR & stunting ' +
          'bayi yang belum lahir. Perlu PMT bumil + pemantauan ANC lebih ketat.',
      },
      {
        id: 'b',
        label: 'Anggap wajar karena "memang ibu hamil biasanya begini"',
        benar: false,
        respons:
          'Berbahaya. KEK bumil meningkatkan risiko BBLR & stunting bayi — jangan ' +
          'dianggap normal, ini jendela cegah stunting SEBELUM bayi lahir.',
      },
    ],
  },
  {
    id: 'posy_ukur_lansia',
    judul: 'Langkah 2 — Penimbangan & Pengukuran (Usia Produktif-Lansia)',
    narasi:
      'Pak Harun, 58 tahun. Lingkar perut 102 cm, tensi 150/95 saat diukur kader. ' +
      'Mengaku "sudah biasa begini sejak dulu, Dok".',
    pilihan: [
      {
        id: 'a',
        // Fix #12b (audit CODEX 2026-07-11): satu pengukuran TD kader tak cukup
        // menegakkan diagnosis hipertensi (butuh >=2x pengukuran hari berbeda) —
        // label lama langsung "hipertensi" berkontradiksi dgn instruksi labelnya
        // sendiri "arahkan skrining lanjut" (kalau sudah tegak, ngapain skrining lagi).
        label: 'Catat obesitas sentral + tersangka hipertensi (perlu konfirmasi ulang), edukasi GERMAS + arahkan skrining lanjut',
        benar: true,
        respons:
          'Tepat. Lingkar perut >90cm (pria) + TD ≥140/90 = obesitas sentral & tersangka ' +
          'hipertensi — tegakkan diagnosis butuh ≥2 pengukuran hari berbeda, tapi tetap ' +
          'tindak lanjuti sekarang, bukan dianggap "biasa".',
      },
      {
        id: 'b',
        label: 'Anggap wajar karena usia, cukup catat tanpa tindak lanjut',
        benar: false,
        respons:
          'PTM sering luput krn dianggap "wajar tua" — padahal usia ini justru paling ' +
          'penting untuk deteksi dini sebelum komplikasi (stroke/jantung/ginjal).',
      },
    ],
  },
  {
    id: 'posy_ukur_remaja',
    judul: 'Langkah 2 — Penimbangan & Pengukuran (Remaja)',
    narasi:
      'Nisa, siswi SMP 14 tahun, terlihat pucat dan mengaku sering lemas & pusing saat ' +
      'pelajaran olahraga.',
    pilihan: [
      {
        id: 'a',
        label: 'Catat kecurigaan anemia, tawarkan TTD mingguan remaja putri + edukasi gizi',
        benar: true,
        respons:
          'Tepat. Anemia remaja putri lazim (kebutuhan zat besi naik saat menstruasi ' +
          'mulai teratur) — TTD mingguan mencegah efeknya berlanjut ke kehamilan kelak.',
      },
      {
        id: 'b',
        label: 'Anggap capek biasa karena olahraga, tak perlu tindak lanjut',
        benar: false,
        respons:
          'Melewatkan tanda anemia remaja putri = kehilangan jendela cegah anemia ' +
          'kehamilan bertahun-tahun kemudian.',
      },
    ],
  },
]

const POOL_LANGKAH3: KartuKegiatan[] = [
  {
    id: 'posy_kms',
    judul: 'Langkah 3 — Pencatatan & Pemeriksaan (Buku KIA Balita)',
    // Fix CODEX-25 #16: dulu "An. Kadek" — bentrok dgn kartu posy_timbang (L2)
    // yg menyebut An. Kadek justru TIDAK di bawah garis merah (weight faltering).
    // Kartu ini anak BERBEDA (benar-benar di bawah garis merah) — ganti nama
    // agar tak kontradiksi bila kedua kartu ditarik dalam sesi yang sama.
    narasi: 'Ibu dari Komang bertanya, "Dok, garis anak saya di bawah garis merah artinya apa?"',
    pilihan: [
      {
        id: 'a',
        label: 'Jelaskan posisi di KMS + rencana tindak lanjut dengan bahasa sederhana',
        benar: true,
        respons: 'Bagus. KMS adalah alat komunikasi dengan ibu, bukan sekadar arsip.',
      },
      {
        id: 'b',
        label: 'Cukup bilang "nanti diurus petugas", lanjut ke anak berikutnya',
        benar: false,
        respons: 'Kesempatan edukasi hilang. Ibu yang paham KMS = kader gizi di rumahnya sendiri.',
      },
    ],
  },
  {
    id: 'posy_catat_bumil',
    judul: 'Langkah 3 — Pencatatan & Pemeriksaan (Kohort Ibu Hamil)',
    narasi:
      'Hasil ANC bumil trimester 3 dicatat di kohort: TD 140/90, protein urin +1. Ibu ' +
      'bertanya, "Dok, kenapa saya ditulis risiko tinggi?"',
    pilihan: [
      {
        id: 'a',
        label: 'Jelaskan tanda preeklampsia + rencana kontrol lebih sering/rujuk bila memberat',
        benar: true,
        respons:
          'Tepat. TD tinggi + proteinuria di kehamilan = kecurigaan preeklampsia — ibu ' +
          'berhak paham & tahu kapan harus segera kembali (sakit kepala hebat, pandangan kabur).',
      },
      {
        id: 'b',
        label: 'Bilang "nanti dijelaskan dokter lain", lanjut ke bumil berikutnya',
        benar: false,
        respons: 'Kesempatan edukasi tanda bahaya hilang — ibu pulang tanpa tahu kenapa harus waspada.',
      },
    ],
  },
  {
    id: 'posy_kuesioner_lansia',
    judul: 'Langkah 3 — Pencatatan & Pemeriksaan (Skrining Lansia)',
    narasi:
      'Kuesioner skrining lansia Bu Ijah (70 th) menunjukkan skor risiko jatuh TINGGI ' +
      '(riwayat jatuh 1x tahun ini, jalan sempoyongan).',
    pilihan: [
      {
        id: 'a',
        label: 'Tindak lanjuti: edukasi pencegahan jatuh (rumah aman, alas kaki) + rujuk bila perlu',
        benar: true,
        respons:
          'Tepat. Skor risiko jatuh tinggi bukan sekadar angka kuesioner — tindak ' +
          'lanjuti sebelum jatuh sungguhan terjadi (patah tulang panggul lansia = ancaman nyawa).',
      },
      {
        id: 'b',
        label: 'Simpan hasil kuesioner, tak ada tindakan karena "cuma skrining"',
        benar: false,
        respons: 'Skrining tanpa tindak lanjut = alat yang percuma — risiko jatuh tinggi butuh aksi sekarang.',
      },
    ],
  },
]

const POOL_LANGKAH4: KartuKegiatan[] = [
  {
    id: 'posy_imunisasi',
    judul: 'Langkah 4 — Pelayanan & Penyuluhan (Imunisasi Balita)',
    narasi:
      'An. Putu, 9 bulan, jadwalnya campak (MR). Ibunya bilang anaknya sedang batuk pilek ' +
      'ringan tanpa demam. Vaksin di termos masih dalam rentang suhu 2–8°C.',
    pilihan: [
      {
        id: 'a',
        label: 'Tetap berikan MR — ISPA ringan tanpa demam bukan kontraindikasi',
        benar: true,
        respons:
          'Benar. Menunda imunisasi karena batuk-pilek ringan adalah "kesempatan yang ' +
          'hilang" (missed opportunity) — anak keburu terpapar campak.',
      },
      {
        id: 'b',
        label: 'Tunda sampai anak benar-benar sehat',
        benar: false,
        respons:
          'Keliru — ini penyebab utama cakupan imunisasi rendah. Sakit ringan tanpa ' +
          'demam tinggi bukan alasan menunda.',
      },
      {
        id: 'c',
        label: 'Berikan, tapi vaksin sempat ditaruh di suhu ruang tadi',
        benar: false,
        respons:
          'Cold chain putus = vaksin rusak & tak berefek. Untung di soal ini termos ' +
          'masih 2–8°C — rantai dingin adalah nyawa vaksin.',
      },
    ],
  },
  {
    id: 'posy_penyuluhan',
    judul: 'Langkah 4 — Pelayanan & Penyuluhan (Ibu Balita)',
    // Fix CODEX-25 #16: narasi/label dulu menyebut "akar faltering hari ini" —
    // mengasumsikan kartu Langkah-2 yang ditarik pasti soal weight faltering
    // (kartu ditarik acak-independen, ~37,5% sesi tak begitu). Dibuat mandiri.
    narasi: 'Sekelompok ibu balita menunggu. Topik apa yang paling berdampak untuk sesi singkat ini?',
    pilihan: [
      {
        id: 'a',
        label: 'ASI eksklusif + MPASI adekuat (fondasi 1000 Hari Pertama Kehidupan)',
        benar: true,
        respons: 'Tepat sasaran — gizi 1000 HPK adalah pesan penyuluhan paling berdampak untuk kelompok ibu balita.',
      },
      {
        id: 'b',
        label: 'Ceramah umum panjang tentang semua penyakit',
        benar: false,
        respons: 'Terlalu luas = tidak ada yang nempel. Fokus satu pesan yang bisa langsung dipakai.',
      },
    ],
  },
  {
    id: 'posy_penyuluhan_remaja',
    judul: 'Langkah 4 — Pelayanan & Penyuluhan (Remaja)',
    narasi: 'Sekelompok remaja SMP hadir di sesi Posyandu Remaja bulan ini. Topik penyuluhan apa yang paling relevan?',
    pilihan: [
      {
        id: 'a',
        label: 'Bahaya rokok/NAPZA + kesehatan reproduksi & pencegahan kehamilan remaja',
        benar: true,
        respons:
          'Tepat — materi wajib Posyandu Remaja. Usia rentan mulai terpapar rokok/NAPZA ' +
          '& butuh info reproduksi yang benar, bukan dari sumber keliru.',
      },
      {
        id: 'b',
        label: 'Materi umum soal imunisasi balita (tak relevan kelompok ini)',
        benar: false,
        respons: 'Salah sasaran — kelompok remaja butuh materi sesuai tahap hidup mereka, bukan materi balita.',
      },
    ],
  },
  {
    id: 'posy_penyuluhan_produktif_lansia',
    judul: 'Langkah 4 — Pelayanan & Penyuluhan (Usia Produktif-Lansia)',
    // Fix CODEX-25 #16: narasi dulu "Tadi di Langkah 2, beberapa peserta
    // terdeteksi lingkar perut besar & tensi tinggi" — mengasumsikan kartu L2
    // (padahal L2 pool balita, ditarik acak). Dibuat mandiri: PTM memang beban
    // utama kelompok ini, tak perlu menyandarkan pada kartu lain.
    narasi:
      'Sesi penyuluhan untuk kelompok usia produktif-lansia — kelompok dengan beban ' +
      'penyakit tidak menular (PTM) tertinggi. Topik apa yang paling berdampak?',
    pilihan: [
      {
        id: 'a',
        label: 'GERMAS + kenali tanda PTM (hipertensi/DM/obesitas) & pentingnya skrining rutin',
        benar: true,
        respons: 'Tepat sasaran — GERMAS + deteksi dini PTM adalah pesan paling berdampak untuk kelompok risiko ini.',
      },
      {
        id: 'b',
        label: 'Ceramah umum semua penyakit tanpa fokus',
        benar: false,
        respons: 'Terlalu luas, tak menempel — sama seperti kesalahan penyuluhan balita: fokus 1 pesan relevan.',
      },
    ],
  },
]

const KARTU_VALIDASI_DATA: KartuKegiatan = {
  id: 'posy_validasi_data',
  judul: 'Langkah 5 — Validasi & Sinkronisasi Data',
  narasi:
    'Sinyal internet di balai RW jelek hari ini. Kader mengusulkan, "Nanti saja Dok, ' +
    'saya input semua datanya belakangan kalau sinyal bagus."',
  pilihan: [
    {
      id: 'a',
      label: 'Validasi & catat manual dulu (kohort/Buku KIA), input digital menyusul — jangan tunda tanpa batas',
      benar: true,
      respons:
        'Tepat. Validasi data tetap jalan manual dulu — data digital (ASIK/e-Kohort) ' +
        'menyusul begitu sinyal ada, bukan alasan menunda pencatatan sama sekali.',
    },
    {
      id: 'b',
      label: 'Setuju tunda tanpa batas waktu, "nanti kalau sempat"',
      benar: false,
      respons:
        'Data yang ditunda tanpa batas sering hilang/terlupa — integritas data Posyandu ' +
        'penting untuk pemantauan program & rujukan berikutnya.',
    },
  ],
}

export function kartuPosyandu(rng: Rng): KartuKegiatan[] {
  return [rng.pick(POOL_LANGKAH2), rng.pick(POOL_LANGKAH3), rng.pick(POOL_LANGKAH4), KARTU_VALIDASI_DATA]
}

/* ---------------------------------------------------------------------------
 * PROLANIS — satu kartu per peserta kronis: keputusan tata laksana bulanan.
 * ------------------------------------------------------------------------- */

/**
 * Ambang "terkendali" Prolanis — SATU-SATUNYA sumber kebenaran, dipakai kartu
 * (kartuProlanis), skor (scoring.ts rasioProlanisTerkontrol), DAN progres
 * penyakit (driftProlanis). Angka per BPJS RPPT: HT terkendali TD sistolik
 * <140 mmHg; DM terkendali GDP <130 mg/dL.
 *
 * BUG YANG DIPERBAIKI (audit CODEX 2026-07-16, REVISI_ENGINE 39→40): saat skala
 * DM dipindah GDS→GDP di rev 37 (#12), HANYA `driftProlanis` yang ikut pindah
 * ke <130; `kartuProlanis` dan `scoring.ts` TERTINGGAL di ambang GDS lama <200.
 * Akibatnya peserta DM ber-GDP 150 ditampilkan "terkendali" di kartu DAN
 * dihitung terkendali oleh skor, TAPI diperlakukan tak-terkendali oleh progres
 * penyakit (takTerkontrolBerturut terus naik) — pemain melihat kartu hijau
 * sambil penyakitnya memburuk diam-diam. Satu konstanta bersama menutup kelas
 * bug ini: ambang tak bisa lagi mengambang antar-modul.
 */
export const AMBANG_TERKENDALI_PROLANIS: Readonly<Record<'ht' | 'dm', number>> = {
  ht: 140,
  dm: 130,
}

/** Terkendali? Satu predikat, dipakai kartu/skor/drift tanpa duplikasi angka. */
export function prolanisTerkendali(jenis: 'ht' | 'dm', param: number): boolean {
  return param < AMBANG_TERKENDALI_PROLANIS[jenis]
}

/**
 * M11 UKM Decision #3, opsi D3-lite (2026-07-17): granularitas NARATIF
 * Prolanis — pilihan/benar/respons TETAP identik (replay/skor tak berubah),
 * hanya bingkai narasi kartu yang dirotasi lewat 4 kanal resmi Panduan
 * Prolanis BPJS (Konsultasi/Edukasi Klub-Duta PROLANIS/Reminder SMS/Home
 * Visit) — memutus kesan "1 kartu generik" tiap sesi tanpa membangun
 * mekanik 4-kanal baru (ditolak dlm dokumen keputusan: menggandakan
 * investasi ke struktur yang sedang di-sunset ILP, lihat riset UKM
 * docs/UKM_SUMBER_RISET_M11.md).
 */
const KANAL_PROLANIS: readonly ((narasi: string) => string)[] = [
  (n) => n,
  (n) =>
    `Sesi edukasi Klub Prolanis bulan ini dipandu Duta PROLANIS. ${n}`,
  (n) => `Pengingat jadwal kontrol lewat SMS sudah terkirim minggu lalu. ${n}`,
  (n) => `Kunjungan rumah bulan ini utk pemantauan lebih dekat. ${n}`,
]

export function kartuProlanis(peserta: PesertaProlanis[], rng: Rng): KartuKegiatan[] {
  return peserta.map((p) => {
    const terkontrol = prolanisTerkendali(p.jenis, p.param)
    const bingkaiKanal = rng.pick(KANAL_PROLANIS)
    if (p.jenis === 'ht') {
      return {
        id: `prol_${p.id}`,
        pesertaId: p.id,
        judul: `Prolanis HT — ${p.nama} (${p.usia} th)`,
        // Fix #7b (triase DeepThink 2026-07-11): "DBP = 0,62×SBP" adalah angka
        // arbitrer buatan (bukan rumus fisiologis nyata — rasio SBP:DBP tak tetap
        // antar-pasien), murni kosmetik narasi (tak dipakai driftProlanis/scoring).
        // Opsi "randomize dgn rentang pulse-pressure" ditolak sanggahan (tetap
        // memfabrikasi klaim fisiologi, cuma dibungkus lebih rapi) — dihapus saja,
        // tampilkan SBP tunggal (basis param/terkontrol yang sesungguhnya).
        narasi: bingkaiKanal(
          `Tekanan darah sistolik hari ini ${p.param} mmHg. ${
            terkontrol ? 'Rutin minum amlodipin.' : 'Mengaku obat sering lupa diminum, suka makan asin.'
          }`,
        ),
        pilihan: terkontrol
          ? [
              {
                id: 'a',
                label: 'Lanjutkan terapi, apresiasi kepatuhan, kontrol bulan depan',
                benar: true,
                respons: 'Tepat — target tercapai, jaga momentum. Prolanis = maraton, bukan sprint.',
              },
              {
                id: 'b',
                label: 'Naikkan dosis biar makin rendah',
                benar: false,
                respons: 'Tidak perlu & berisiko hipotensi. Jangan mengejar angka di bawah target.',
              },
            ]
          : [
              {
                id: 'a',
                label: 'Konseling kepatuhan + diet rendah garam, optimalkan dosis, kontrol 2 minggu',
                benar: true,
                respons:
                  'Benar. Cari akar ketidakpatuhan dulu sebelum menyalahkan obat — lalu optimalkan.',
              },
              {
                id: 'b',
                label: 'Biarkan, toh cuma sedikit di atas target',
                benar: false,
                respons: 'HT tak terkontrol menahun = stroke & gagal ginjal. "Sedikit" itu menumpuk.',
              },
              {
                id: 'c',
                label: 'Langsung rujuk ke spesialis',
                benar: false,
                // RRNS & cap grade adalah mekanik encounter KLINIK (tally rujukan
                // di reducer, cap di clinic.ts) — sesi Prolanis tak menyentuh
                // keduanya. Respons di sini hanya boleh menyebut yang memang
                // terjadi: jawaban dinilai keliru dan drift peserta memburuk.
                respons: 'HT esensial adalah kompetensi FKTP (4A). Akar ketidakpatuhannya tak tersentuh — ia pulang dari sesi ini dengan tensi yang tetap tak terkendali.',
              },
            ],
      }
    }
    // DM
    return {
      id: `prol_${p.id}`,
      pesertaId: p.id,
      judul: `Prolanis DM — ${p.nama} (${p.usia} th)`,
      narasi: bingkaiKanal(
        `Gula darah puasa ${p.param} mg/dL. ${
          terkontrol ? 'Patuh metformin, rajin jalan pagi.' : 'Mengeluh sering haus & kesemutan, jarang olahraga.'
        }`,
      ),
      pilihan: terkontrol
        ? [
            {
              id: 'a',
              label: 'Pertahankan metformin + gaya hidup, edukasi kaki diabetik',
              benar: true,
              respons: 'Tepat — kontrol baik, cegah komplikasi jangka panjang.',
            },
            {
              id: 'b',
              label: 'Stop obat karena gula sudah normal',
              benar: false,
              respons: 'Keliru — DM tipe 2 butuh terapi berkelanjutan; berhenti = gula melonjak lagi.',
            },
          ]
        : [
            {
              id: 'a',
              label: 'Optimalkan metformin + konseling diet/aktivitas, pantau, edukasi kaki',
              benar: true,
              respons: 'Benar. Intensifkan tata laksana FKTP dulu; rujuk hanya bila gagal/komplikasi.',
            },
            {
              id: 'b',
              label: 'Tambah obat tanpa cek kepatuhan & pola makan',
              benar: false,
              respons:
                'Menambah obat tanpa menyentuh akar masalah jarang berhasil — gula darahnya akan tetap tak terkendali sampai kepatuhan dan pola makannya ditangani.',
            },
          ],
    }
  })
}

/* ---------------------------------------------------------------------------
 * RESPONS KLB — 5W1H penyelidikan + pemilihan aksi pengendalian.
 * Kartu disesuaikan rute/sumber penularan, bukan kategori klinis semata.
 * ------------------------------------------------------------------------- */

export type PolaKlb =
  | 'vektor'
  | 'fekal_oral'
  | 'pangan_toksin'
  | 'tanah_helminth'
  | 'air_tawar_keong'
  | 'zoonosis_lingkungan'
  | 'seksual'
  | 'skabies_serumah'
  | 'kontak_fomit'
  | 'kusta_kontak_erat'
  | 'airborne_tb'
  | 'droplet_rutin'
  | 'influenza'
  | 'parotitis'
  | 'pertusis'
  | 'meningokokus'
  | 'belum_dipetakan'

/**
 * P0-B (2026-07-17, diperluas 2026-07-23): seluruh kasus ber-ambangKluster
 * dipetakan eksplisit.
 * Registry ini sengaja tidak punya default droplet. Kasus baru yang belum
 * ditelaah jatuh ke respons aman `belum_dipetakan` dan invariant test gagal,
 * sehingga aplikasi tidak mengajarkan masker utk penyakit non-respiratorik.
 * Grounding per pola: docs/UKM_KLB_TRANSMISSION_MAPPING.md.
 */
const POLA_KLB_PER_KASUS: Readonly<Record<string, Exclude<PolaKlb, 'belum_dipetakan'>>> = {
  demam_tifoid: 'fekal_oral',
  dengue_df: 'vektor',
  diare_akut_anak: 'fekal_oral',
  ispa_common_cold: 'droplet_rutin',
  konjungtivitis_bakterial: 'kontak_fomit',
  lab_cacing_tambang: 'tanah_helminth',
  lab_gonore_uretritis_pria: 'seksual',
  lab_hepatitis_a_akut: 'fekal_oral',
  lab_influenza_tanpa_komplikasi: 'influenza',
  lab_keracunan_makanan_ringan: 'pangan_toksin',
  lab_kusta_pausibasiler: 'kusta_kontak_erat',
  lab_leptospirosis_tanpa_komplikasi: 'zoonosis_lingkungan',
  lab_meningitis_bakterial_suspek: 'meningokokus',
  lab_parotitis_mumps: 'parotitis',
  lab_pertusis_remaja: 'pertusis',
  lab_pneumonia_komunitas_dewasa: 'droplet_rutin',
  lab_sifilis_primer: 'seksual',
  lab_sindrom_duh_genital_servisitis: 'seksual',
  lab_skistosomiasis_sulteng: 'air_tawar_keong',
  lab_tinea_kapitis_anak: 'kontak_fomit',
  pneumonia_balita: 'droplet_rutin',
  skabies: 'skabies_serumah',
  tb_paru: 'airborne_tb',
}

export function polaKlbDariKasus(kasusId: string): PolaKlb {
  return POLA_KLB_PER_KASUS[kasusId] ?? 'belum_dipetakan'
}

interface OpsiAksiKlb {
  id: string
  label: string
  benar: boolean
  respons: string
}

const AKSI_KLB: Readonly<Record<PolaKlb, { benar: OpsiAksiKlb; salah: OpsiAksiKlb }>> = {
  vektor: {
    benar: { id: 'a', label: 'PSN 3M Plus + larvasidasi; fogging hanya bila ada penularan aktif', benar: true, respons: 'Tepat. Pengendalian dengue bertumpu pada pengurangan tempat perindukan dan kendali vektor terpadu; fogging bukan pengganti PSN.' },
    salah: { id: 'b', label: 'Cukup obati pasien dan fogging massal tanpa menilai sarang', benar: false, respons: 'Keliru. Tata laksana kasus penting, tetapi fogging tanpa pengurangan sumber tidak memutus siklus Aedes.' },
  },
  fekal_oral: {
    benar: { id: 'a', label: 'Amankan air minum dan sanitasi, telusuri sumber air/pangan, CTPS + higiene pangan', benar: true, respons: 'Tepat. Rute fekal-oral diputus melalui air aman, sanitasi, kebersihan tangan dan pangan serta pengendalian sumber; terapi klinis tetap mengikuti penyakitnya.' },
    salah: { id: 'b', label: 'Bagikan masker dan semprot insektisida ke seluruh wilayah', benar: false, respons: 'Masker dan insektisida tidak mengatasi kontaminasi tinja pada air, tangan, atau pangan.' },
  },
  pangan_toksin: {
    benar: { id: 'a', label: 'Hentikan dan tarik pangan tersangka, telusuri penjamah/rantai penyimpanan, ambil sampel sesuai protokol', benar: true, respons: 'Tepat. Paparan bersama harus dihentikan dan sumber pangan ditelusuri; terapi pasien saja membiarkan orang lain terus terpapar.' },
    salah: { id: 'b', label: 'Beri antibiotik massal tanpa mencari pangan yang menjadi sumber', benar: false, respons: 'Keracunan pangan dapat disebabkan toksin atau beragam patogen. Antibiotik massal tanpa identifikasi sumber tidak tepat dan tidak menghentikan paparan.' },
  },
  tanah_helminth: {
    benar: { id: 'a', label: 'Obat cacing kelompok berisiko sesuai program, perbaiki sanitasi/jamban, biasakan alas kaki', benar: true, respons: 'Tepat. Cacing tambang berasal dari tanah tercemar; pengobatan kelompok berisiko perlu disertai sanitasi dan pencegahan kontak kulit dengan tanah.' },
    salah: { id: 'b', label: 'Isolasi droplet dan bagikan masker kepada teman sekolah', benar: false, respons: 'Cacing tambang tidak menular lewat batuk atau kontak biasa; larva menembus kulit dari tanah tercemar.' },
  },
  air_tawar_keong: {
    benar: { id: 'a', label: 'Petakan paparan air tawar, terapi praziquantel kelompok sasaran, air/sanitasi aman + kendali keong lintas sektor', benar: true, respons: 'Tepat. Skistosomiasis terkait air tawar dan hospes perantara keong; kendali memadukan pengobatan, WASH, perubahan perilaku dan One Health.' },
    salah: { id: 'b', label: 'Fogging nyamuk dewasa dan terapi hanya pasien yang datang', benar: false, respons: 'Vektornya bukan nyamuk. Tanpa memutus paparan air tawar dan siklus keong, penularan tetap berlanjut.' },
  },
  zoonosis_lingkungan: {
    benar: { id: 'a', label: 'Kurangi paparan air banjir tercemar, tutup luka + sepatu bot/APD, amankan air dan kendalikan rodensia', benar: true, respons: 'Tepat. Leptospira berasal dari urine hewan yang mencemari air/tanah; perlindungan paparan dan kendali rodensia lebih relevan daripada isolasi droplet.' },
    salah: { id: 'b', label: 'Isolasi pasien sebagai sumber droplet dan bagikan masker', benar: false, respons: 'Penularan antarmanusia bukan rute utama. Fokus pada air/tanah tercemar, luka kulit, APD, air aman dan rodensia.' },
  },
  seksual: {
    benar: { id: 'a', label: 'Layanan rahasia: tes/obati kasus dan pasangan seksual, kondom, skrining HIV/IMS terkait', benar: true, respons: 'Tepat. Pengobatan pasangan mencegah reinfeksi dan transmisi; layanan harus rahasia, nonstigmatis dan disertai pencegahan serta tes IMS terkait.' },
    salah: { id: 'b', label: 'Umumkan identitas kasus ke warga dan lakukan fogging rumahnya', benar: false, respons: 'Fogging tidak relevan, sedangkan membuka identitas melanggar kerahasiaan dan justru menghambat penelusuran serta pengobatan pasangan.' },
  },
  skabies_serumah: {
    benar: { id: 'a', label: 'Obati kasus + seluruh kontak serumah/erat serentak; cuci dan keringkan pakaian serta linen', benar: true, respons: 'Tepat. Masa tanpa gejala memungkinkan penularan ping-pong, sehingga anggota rumah ditangani serentak dan benda terpapar dibersihkan.' },
    salah: { id: 'b', label: 'Fogging wilayah dan cukup obati warga yang sudah gatal', benar: false, respons: 'Fogging tidak membunuh tungau pada kulit. Menunggu semua kontak gatal membiarkan reinfeksi berulang.' },
  },
  kontak_fomit: {
    benar: { id: 'a', label: 'Tangani kasus; higiene tangan; jangan berbagi handuk, sisir, topi, atau barang pribadi; periksa kontak bergejala', benar: true, respons: 'Tepat. Penularan kontak/fomit diputus dengan kebersihan, tidak berbagi barang pribadi, tata laksana kasus dan pemeriksaan kontak yang bergejala.' },
    salah: { id: 'b', label: 'Obati semua kontak tanpa gejala dan cukup bagikan masker', benar: false, respons: 'Masker bukan intervensi utama, dan terapi buta semua kontak tidak dibenarkan untuk konjungtivitis atau tinea kapitis.' },
  },
  kusta_kontak_erat: {
    benar: { id: 'a', label: 'Mulai/lanjutkan MDT kasus, skrining kontak secara rahasia; rifampisin dosis tunggal hanya kontak eligible sesuai program', benar: true, respons: 'Tepat. Kusta membutuhkan deteksi dan MDT dini, skrining kontak dengan persetujuan, serta PEP sesuai kelayakan dan protokol tanpa stigma.' },
    salah: { id: 'b', label: 'Isolasi paksa keluarga, beri label rumah, lalu fogging lingkungan', benar: false, respons: 'Kusta tidak memerlukan isolasi paksa atau fogging. Stigma membuat kasus tersembunyi dan menghambat deteksi dini.' },
  },
  airborne_tb: {
    benar: { id: 'a', label: 'Investigasi kontak, skrining gejala/tes melalui jejaring, TPT untuk kontak eligible, perbaiki ventilasi', benar: true, respons: 'Tepat. TB airborne membutuhkan penemuan kasus aktif, investigasi kontak, terapi pencegahan bagi yang eligible dan kendali udara.' },
    salah: { id: 'b', label: 'Cukup bagikan masker bedah dan obati warga yang batuk saja', benar: false, respons: 'Masker bedah saja tidak menggantikan investigasi kontak, TPT, diagnosis cepat dan ventilasi.' },
  },
  droplet_rutin: {
    benar: { id: 'a', label: 'Etika batuk/masker saat bergejala, ventilasi + higiene tangan, penemuan kasus dan cek faktor risiko/imunisasi', benar: true, respons: 'Tepat. Kendali respiratorik memadukan pengurangan paparan, penemuan dan tata laksana kasus serta koreksi faktor risiko; intervensi tambahan mengikuti etiologi.' },
    salah: { id: 'b', label: 'Antibiotik atau profilaksis massal untuk semua warga tanpa memastikan etiologi', benar: false, respons: 'Kluster respiratorik dapat memiliki banyak etiologi. Obat massal tanpa indikasi tidak aman dan mendorong resistensi.' },
  },
  influenza: {
    benar: { id: 'a', label: 'Kasus influenza kurangi kontak, gunakan masker/etika batuk; ventilasi, higiene tangan, lindungi kelompok risiko + cek vaksinasi', benar: true, respons: 'Tepat. Kendali influenza mengurangi kontak saat sakit, memperbaiki higiene/ventilasi dan melindungi kelompok berisiko; vaksinasi mengikuti kebijakan dan ketersediaan.' },
    salah: { id: 'b', label: 'Beri antibiotik massal karena semua influenza pasti bakteri', benar: false, respons: 'Influenza adalah infeksi virus. Antibiotik hanya untuk indikasi bakteri yang dinilai secara klinis, bukan respons massal.' },
  },
  parotitis: {
    benar: { id: 'a', label: 'Isolasi kasus 5 hari sejak parotitis, telusuri/pantau kontak, cek status MMR bila tersedia sesuai kebijakan', benar: true, respons: 'Tepat. Parotitis menular melalui saliva/droplet; isolasi lima hari dan pemantauan kontak penting. MMR pascapajanan tidak menjamin mencegah penyakit yang sudah terinkubasi.' },
    salah: { id: 'b', label: 'Beri antibiotik massal dan anggap vaksin setelah pajanan pasti menggagalkan infeksi', benar: false, respons: 'Mumps disebabkan virus, dan vaksin setelah pajanan bukan profilaksis yang pasti untuk pajanan tersebut.' },
  },
  pertusis: {
    benar: { id: 'a', label: 'Obati/isolasi kasus, telusuri kontak serumah dan kelompok risiko terutama bayi; profilaksis sesuai protokol + cek imunisasi DPT', benar: true, respons: 'Tepat. Kontak serumah dan orang yang berisiko sakit berat perlu dinilai cepat; PEP diprioritaskan sesuai protokol dan jendela pajanan.' },
    salah: { id: 'b', label: 'Cukup etika batuk; kontak sehat termasuk bayi tidak perlu dinilai', benar: false, respons: 'Pertusis sangat menular dan berbahaya bagi bayi. Kontak serumah/berisiko dapat memerlukan profilaksis walau belum bergejala.' },
  },
  meningokokus: {
    benar: { id: 'a', label: 'Laporkan segera; verifikasi kasus, telusuri dan pantau kontak erat 14 hari; koordinasikan kemoprofilaksis + komunikasi risiko', benar: true, respons: 'Tepat. Respons meningokokus menggabungkan notifikasi, penyelidikan, kewaspadaan droplet, identifikasi kontak erat, pemantauan gejala, dan kemoprofilaksis terkoordinasi tanpa resep massal otomatis.' },
    salah: { id: 'b', label: 'Tunggu konfirmasi semua kasus lalu beri antibiotik massal kepada seluruh RW', benar: false, respons: 'Keliru. Pelaporan dan penelusuran tidak menunggu klaster besar, tetapi kemoprofilaksis ditujukan pada kontak erat yang memenuhi kriteria, bukan seluruh penduduk.' },
  },
  belum_dipetakan: {
    benar: { id: 'a', label: 'Tahan intervensi generik; pastikan etiologi, rute dan sumber, lalu koordinasikan tindakan dengan surveilans/Dinkes', benar: true, respons: 'Benar. Bila profil belum dipetakan, jangan menebak rute penularan. Verifikasi dan eskalasi lebih aman daripada mengajarkan tindakan yang salah.' },
    salah: { id: 'b', label: 'Anggap otomatis droplet dan bagikan masker', benar: false, respons: 'Tidak semua kluster menular lewat respirasi. Asumsi otomatis dapat mengalihkan sumber daya dari sumber penularan yang sebenarnya.' },
  },
}

/**
 * M11 UKM Decision #5 B2 (2026-07-17): pool narasi utk 2 kartu KLB yang
 * SELALU identik apa pun kasusnya (klb_verif/klb_5w1h — beda dari klb_aksi
 * yang sudah struktural bervariasi lewat `pola`). Pilihan/benar/respons
 * TETAP satu (tak digandakan) — hanya narasi pembuka yang dirotasi, sama
 * disiplin dgn D3-lite Prolanis: replay/skor tak tersentuh.
 */
const NARASI_KLB_VERIF: readonly ((namaKasus: string, namaRw: string) => string)[] = [
  (n, rw) => `Sinyal kluster ${n} di ${rw}. Langkah PERTAMA seorang dokter Puskesmas?`,
  (n, rw) => `Laporan kader pagi ini: beberapa warga ${rw} mengeluh gejala serupa — ${n} dicurigai. Langkah PERTAMA seorang dokter Puskesmas?`,
  (n, rw) => `Bidan desa menelepon: jumlah kasus ${n} di ${rw} terasa lebih banyak dari biasanya bulan ini. Langkah PERTAMA seorang dokter Puskesmas?`,
]

const NARASI_KLB_5W1H: readonly string[] = [
  'Kamu turun ke lapangan. Data apa yang paling kritis dikumpulkan lebih dulu?',
  'Sebelum menyusun laporan ke Dinkes, data apa yang paling kritis dikumpulkan lebih dulu?',
  'Tim surveilans sudah siap turun bersamamu. Data apa yang paling kritis dikumpulkan lebih dulu?',
]

export function kartuKlb(kasusId: string, namaKasus: string, namaRw: string, rng: Rng): KartuKegiatan[] {
  const pola = polaKlbDariKasus(kasusId)
  const { benar: aksiBenar, salah: distraktorAksi } = AKSI_KLB[pola]

  return [
    {
      id: 'klb_verif',
      judul: 'KLB — Verifikasi & Definisi Kasus',
      narasi: rng.pick(NARASI_KLB_VERIF)(namaKasus, namaRw),
      pilihan: [
        {
          id: 'a',
          label: 'Verifikasi diagnosis & tetapkan definisi kasus, baru hitung apakah benar KLB',
          benar: true,
          respons: 'Benar. Jangan bertindak atas rumor — pastikan dulu ini benar peningkatan bermakna.',
        },
        {
          id: 'b',
          label: 'Langsung fogging/tutup wilayah tanpa verifikasi',
          benar: false,
          respons: 'Panik tanpa data = boros sumber daya & bisa salah sasaran.',
        },
      ],
    },
    {
      id: 'klb_5w1h',
      judul: 'KLB — Penyelidikan Epidemiologi (5W1H)',
      narasi: rng.pick(NARASI_KLB_5W1H),
      pilihan: [
        {
          id: 'a',
          label: 'Orang–Tempat–Waktu (siapa sakit, di mana mengelompok, kapan mulai)',
          benar: true,
          respons: 'Tepat — segitiga epidemiologi mengarahkan sumber & rute penularan.',
        },
        {
          id: 'b',
          label: 'Cukup hitung jumlah total kasus',
          benar: false,
          respons: 'Angka tanpa Orang-Tempat-Waktu tidak menunjukkan sumber maupun cara memutusnya.',
        },
      ],
    },
    {
      id: 'klb_aksi',
      judul: 'KLB — Tindakan Pengendalian',
      narasi: `Sumber teridentifikasi. Aksi pengendalian utama untuk ${namaKasus}?`,
      pilihan: [aksiBenar, distraktorAksi],
    },
  ]
}

/* ---------------------------------------------------------------------------
 * MESIN SESI
 * ------------------------------------------------------------------------- */

export function buatKegiatan(
  jenis: JenisKegiatan,
  kartu: KartuKegiatan[],
  ekstra?: { rw?: number; kasusId?: string },
): KegiatanState {
  return {
    jenis,
    kartu,
    index: 0,
    jawaban: [],
    ...(ekstra?.rw !== undefined ? { rw: ekstra.rw } : {}),
    ...(ekstra?.kasusId !== undefined ? { kasusId: ekstra.kasusId } : {}),
  }
}

export interface HasilKegiatan {
  jenis: JenisKegiatan
  benar: number
  total: number
  /** Skor 0-1. */
  skor: number
  rw?: number
  kasusId?: string
  jawaban: { kartuId: string; pilihanId: string; benar: boolean }[]
}

/** Terapkan satu jawaban; kembalikan state baru + apakah sesi selesai. */
/**
 * Audit UKM 2026-08-22 (P1): menolak menjawab kartu yang SUDAH terjawab.
 *
 * Bersama dua perubahan di luar berkas ini — UI mengunci jawaban pada saat opsi
 * DIKLIK (bukan saat tombol "Kartu Berikutnya"), dan tiap JAWAB_KEGIATAN kini
 * di-autosave — vonis TEPAT/KELIRU tak bisa lagi terbaca sebelum jawabannya
 * tersimpan. Dulu ketiganya bolong sekaligus: vonis tampil dari state React
 * lokal, sesi tak pernah di-autosave sampai kartu terakhir, dan dek Posyandu/
 * Prolanis/KLB deterministik per (seed, hari, rw) — jadi sesi bisa dibaca
 * vonisnya lalu diulang identik berbekal kunci jawaban. Di Mode Ujian itu
 * mengangkat dimensi UKM 35 poin tanpa jejak; telemetri anti-save-scum pun buta
 * karena ia hanya menulis saat save BERHASIL, sedangkan pada percobaan pertama
 * tak ada save sama sekali.
 */
export function jawabKegiatan(
  kg: KegiatanState,
  kartuId: string,
  pilihanId: string,
): { kg: KegiatanState; selesai: boolean; benar: boolean } {
  const kartu = kg.kartu[kg.index]
  if (!kartu || kartu.id !== kartuId) return { kg, selesai: false, benar: false }
  if (kg.jawaban.some((j) => j.kartuId === kartuId)) return { kg, selesai: false, benar: false }
  const pilihan = kartu.pilihan.find((p) => p.id === pilihanId)
  if (!pilihan) return { kg, selesai: false, benar: false }
  const jawaban = [...kg.jawaban, { kartuId, pilihanId, benar: pilihan.benar }]
  const index = kg.index + 1
  const selesai = index >= kg.kartu.length
  return { kg: { ...kg, index, jawaban }, selesai, benar: pilihan.benar }
}

/**
 * S6-degenerate (b), 2026-08-01 — peluang kader menjawab BENAR satu kartu saat
 * delegasi Posyandu. Diturunkan 0.8 → 0.65: pada 0.8, delegasi penuh 4 kartu
 * memberi P(skor≥0.66)=81.9% dan P(skor≥0.5)=97.3% — nyaris mendominasi main
 * sendiri; pada 0.65 turun ke 56.3% / 87.4% (dan P(nada 'baik' skor≥0.8) =
 * 17.9%) — delegasi tetap layak sebagai manajemen waktu, bukan otopilot.
 * SATU-SATUNYA sumber angka ini; UI (Kegiatan.tsx) menurunkan teks risikonya
 * dari konstanta yang sama agar janji UI tak bisa melenceng dari perilaku.
 */
export const PELUANG_KADER_BENAR = 0.65

/**
 * Delegasi sisa kartu ke kader (khusus posyandu): kader menjawab, tapi
 * (1 − PELUANG_KADER_BENAR) ≈ 35% peluang salah per kartu — mengajarkan
 * supervisi task-shifting sebagai tradeoff nyata.
 */
export function delegasiKegiatan(kg: KegiatanState, rng: Rng): KegiatanState {
  let cur = kg
  while (cur.index < cur.kartu.length) {
    const kartu = cur.kartu[cur.index]
    if (!kartu) break
    const kaderBenar = rng.chance(PELUANG_KADER_BENAR)
    // Kader memilih jawaban benar bila "kaderBenar", selain itu pilihan salah pertama.
    const pilihan = kaderBenar
      ? kartu.pilihan.find((p) => p.benar) ?? kartu.pilihan[0]
      : kartu.pilihan.find((p) => !p.benar) ?? kartu.pilihan[0]
    if (!pilihan) break
    cur = {
      ...cur,
      index: cur.index + 1,
      jawaban: [...cur.jawaban, { kartuId: kartu.id, pilihanId: pilihan.id, benar: pilihan.benar }],
    }
  }
  return cur
}

export function nilaiKegiatan(kg: KegiatanState): HasilKegiatan {
  const benar = kg.jawaban.filter((j) => j.benar).length
  const total = kg.kartu.length
  return {
    jenis: kg.jenis,
    benar,
    total,
    skor: total > 0 ? benar / total : 0,
    ...(kg.rw !== undefined ? { rw: kg.rw } : {}),
    ...(kg.kasusId !== undefined ? { kasusId: kg.kasusId } : {}),
    jawaban: kg.jawaban,
  }
}

/**
 * Drift parameter Prolanis antar-bulan: intervensi tepat menurunkan; intervensi
 * salah pada peserta TAK terkendali (lalai) menaikkan; intervensi salah pada
 * peserta yg SEDANG terkendali (overtreatment) ikut MENURUNKAN — lihat komentar
 * `arah` di bawah (Keputusan #8, adjudikasi-delegasi 2026-08-21). `skala`
 * (0..1, default 1) mengecilkan besaran langkah — dipakai jalur klinik untuk
 * kredit parsial (grade B = 0.5); skala 1 identik perilaku lama
 * (Math.round(besar) === besar) dan konsumsi RNG selalu tepat satu draw.
 */
export function driftProlanis(
  p: PesertaProlanis,
  intervensiTepat: boolean,
  rng: Rng,
  skala = 1,
): PesertaProlanis {
  // Keputusan #8 (adjudikasi-delegasi 2026-08-21): dulu `arah = tepat ? -1 : 1`
  // — intervensi salah SELALU menaikkan param, termasuk "naikkan dosis" pada
  // peserta terkendali. Itu kebalikan fisiologi: menaikkan dosis antihipertensi
  // pada pasien terkendali MENURUNKAN tekanan darah (kartunya sendiri sudah
  // memperingatkan risiko hipotensi). Kini intervensi salah pada peserta yg
  // SEDANG terkendali (dinilai dari param SEBELUM drift) = overtreatment →
  // arah turun juga; clamp bawah 110/85 di bawah menahan dari nilai absurd.
  // Salah pada peserta tak terkendali tetap +1 (lalai, perilaku lama). Hukuman
  // atas jawaban salah tetap hidup di skor sesi (benar/total) — yg dibalik
  // hanya arah simulasinya. Konsumsi RNG tak berubah: tetap satu draw.
  // Amendemen (2026-08-21, hari yg sama): pembalikan HANYA utk HT — kartu DM
  // terkendali opsi salahnya "Stop obat karena gula sudah normal" =
  // UNDER-treatment, gula justru melonjak lagi (persis teks respons kartunya);
  // arah +1 lama sudah benar utk DM.
  const overtreatment =
    !intervensiTepat && p.jenis === 'ht' && prolanisTerkendali(p.jenis, p.param)
  // Adjudikasi 2026-08-22 (lanjutan Keputusan #8, didelegasikan dokter):
  // opsi salah pada peserta DM yang SEDANG TAK TERKENDALI adalah "Tambah obat
  // tanpa cek kepatuhan & pola makan" — inersia klinis. Dulu arahnya +1 (GDP
  // NAIK 10..30), padahal menambah agen hipoglikemik tidak MENAIKKAN gula
  // darah; itu membalik farmakologi, dan membantah teks responsnya sendiri
  // yang cuma bilang tindakan itu "jarang berhasil" — bukan "memperburuk".
  // Kini arahnya 0: obat gagal menurunkan gula karena akar masalahnya
  // (kepatuhan/diet) tak disentuh. Hukumannya TIDAK dipindah ke Manajemen —
  // itu akan jadi hukuman ganda yang dilarang doktrin repo: jawaban salah
  // sudah dihukum lewat skor sesi (benar/total) DAN lewat peserta yang tetap
  // tak terkendali sehingga menekan `rasioProlanisTerkontrol` (20% dimensi UKM).
  // Cakupannya SEMPIT & disengaja: HANYA dm + salah + sedang tak terkendali.
  // Kartu DM TERKENDALI tak tersentuh — opsi salahnya di sana "Stop obat
  // karena gula sudah normal" = under-treatment, dan +1 memang benar (persis
  // amendemen Keputusan #8). Konsumsi RNG tak berubah: `besar` di bawah tetap
  // dihitung di SEMUA cabang, jadi jumlah draw tetap satu (dijaga test).
  const inersiaDmTakTerkendali =
    !intervensiTepat && p.jenis === 'dm' && !prolanisTerkendali(p.jenis, p.param)
  const arah = intervensiTepat || overtreatment ? -1 : inersiaDmTakTerkendali ? 0 : 1
  // #12 (audit CODEX UKM 2026-07-16): skala DM kini GDP — ambang kontrol
  // RPPT <130 mg/dL (bukan GDS <200); langkah drift disesuaikan ke skala GDP.
  // S5-iks-prolanis (2026-08-01, REVISI_ENGINE 62): langkah TURUN DM dinaikkan
  // 15..35 (dulu 10..30). Aritmetika: enrolmen GDP rng.int(150,240) rata-rata
  // 195; karier hanya memuat 3 sesi Prolanis (H30/60/90; Ujian H10/20/30) —
  // rata-rata lama 3×20=60 → 195-60=135 ≥ 130: peserta rata-rata MUSTAHIL
  // terkontrol walau semua jawaban benar. Kini 3×25=75 → 195-75=120 < 130.
  // Langkah NAIK (lalai) SENGAJA tetap 10..30 — hukuman tidak ikut membesar.
  const besar =
    p.jenis === 'ht' ? rng.int(6, 16) : intervensiTepat ? rng.int(15, 35) : rng.int(10, 30)
  const param = Math.max(p.jenis === 'ht' ? 110 : 85, p.param + arah * Math.round(besar * skala))
  const terkontrol = prolanisTerkendali(p.jenis, param)
  const takTerkontrolBerturut = terkontrol ? 0 : p.takTerkontrolBerturut + 1
  return { ...p, param, takTerkontrolBerturut }
}
