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
      'Bu Marni, hamil trimester 2. LILA diukur 22 cm. Berat badan naik lambat sejak ' +
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
      'Pak Slamet, 58 tahun. Lingkar perut 102 cm, tensi 150/95 saat diukur kader. ' +
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
      'Dewi, siswi SMP 14 tahun, terlihat pucat dan mengaku sering lemas & pusing saat ' +
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
    narasi: 'Ibu An. Komang bertanya, "Dok, garis anak saya di bawah garis merah artinya apa?"',
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

export function kartuProlanis(peserta: PesertaProlanis[]): KartuKegiatan[] {
  return peserta.map((p) => {
    const terkontrol = prolanisTerkendali(p.jenis, p.param)
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
        narasi: `Tekanan darah sistolik hari ini ${p.param} mmHg. ${
          terkontrol ? 'Rutin minum amlodipin.' : 'Mengaku obat sering lupa diminum, suka makan asin.'
        }`,
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
                respons: 'HT esensial adalah kompetensi FKTP (4A). Rujuk dini = RRNS naik, guillotine mengintai.',
              },
            ],
      }
    }
    // DM
    return {
      id: `prol_${p.id}`,
      pesertaId: p.id,
      judul: `Prolanis DM — ${p.nama} (${p.usia} th)`,
      narasi: `Gula darah puasa ${p.param} mg/dL. ${
        terkontrol ? 'Patuh metformin, rajin jalan pagi.' : 'Mengeluh sering haus & kesemutan, jarang olahraga.'
      }`,
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
              respons: 'Menambah obat tanpa menyentuh akar masalah jarang berhasil.',
            },
          ],
    }
  })
}

/* ---------------------------------------------------------------------------
 * RESPONS KLB — 5W1H penyelidikan + pemilihan aksi pengendalian.
 * Kartu disesuaikan jenis kluster (vektor / air-makanan / droplet).
 * ------------------------------------------------------------------------- */

type PolaKlb = 'vektor' | 'air_makanan' | 'droplet' | 'kontak' | 'airborne'

function polaDariKasus(kasusId: string): PolaKlb {
  if (kasusId === 'dengue_df') return 'vektor'
  if (kasusId === 'diare_akut_anak' || kasusId === 'demam_tifoid') return 'air_makanan'
  // M10 §49 (2026-07-10): skabies & konjungtivitis menular lewat KONTAK
  // (tungau/sekret via tangan-benda), BUKAN droplet — dulu jatuh ke default
  // droplet sehingga kartu KLB mengajarkan masker/etika batuk sbg jawaban
  // benar utk wabah tungau. Pengendalian kontak yg benar: obati kasus + SEMUA
  // kontak erat serentak, dekontaminasi linen/benda, higiene tangan.
  // Hanya skabies & konjungtivitis_bakterial yang jadi kluster kontak
  // (AMBANG_CLUSTER, surveilans.ts) — konjungtivitis alergi tak menular.
  if (kasusId === 'skabies' || kasusId === 'konjungtivitis_bakterial') return 'kontak'
  // Fix CODEX-25 #17 (2026-07-12): TB = AIRBORNE (droplet nuclei bertahan di
  // udara), BUKAN droplet — pengendalian beda: investigasi kontak + TPT +
  // ventilasi/pencahayaan (respirator N95 utk nakes), bukan sekadar masker
  // bedah/etika batuk. Dulu tb_paru & ispa sama-sama 'droplet' → kartu KLB
  // mengajar respons droplet generik utk wabah TB. (WHO: TB airborne.)
  if (kasusId === 'tb_paru') return 'airborne'
  return 'droplet' // ispa/pneumonia → transmisi droplet
}

export function kartuKlb(kasusId: string, namaKasus: string, namaRw: string): KartuKegiatan[] {
  const pola = polaDariKasus(kasusId)
  const aksiBenar =
    pola === 'vektor'
      ? { id: 'a', label: 'PSN 3M Plus + larvasidasi; fogging hanya bila ada penularan aktif', benar: true, respons: 'Tepat. Fogging membunuh nyamuk dewasa sesaat; PSN memutus siklus di sumbernya.' }
      : pola === 'air_makanan'
        ? { id: 'a', label: 'Amankan sumber air & sanitasi, distribusi oralit/klorinasi, edukasi CTPS', benar: true, respons: 'Benar. Putus rute fekal-oral di sumbernya + cegah dehidrasi.' }
        : pola === 'kontak'
          ? { id: 'a', label: 'Obati kasus + SEMUA kontak serumah serentak; dekontaminasi linen/handuk/barang pribadi; higiene tangan', benar: true, respons: 'Tepat. Penularan kontak diputus dgn mengobati serentak (cegah ping-pong) + dekontaminasi benda, bukan masker.' }
          : pola === 'airborne'
            ? { id: 'a', label: 'Investigasi kontak (skrining gejala + TCM/rontgen), TPT utk kontak eligible, perbaiki ventilasi & pencahayaan rumah, penemuan kasus aktif', benar: true, respons: 'Tepat. TB airborne: droplet nuclei bertahan di udara → kuncinya investigasi kontak + TPT + ventilasi, BUKAN sekadar masker bedah/etika batuk (itu memadai utk droplet, tak cukup utk airborne).' }
            : { id: 'a', label: 'Etika batuk/masker, ventilasi, temukan & obati kasus bergejala', benar: true, respons: 'Tepat. Transmisi droplet (ISPA/pneumonia) diputus dgn etika batuk + ventilasi + penemuan kasus bergejala — kontak sehat tak perlu diobati (self-limiting).' }
  // M10 §49: distraktor pola-kontak ditukar agar "masker/etika batuk" (jawaban
  // benar utk droplet) TIDAK muncul sbg opsi salah generik yang justru mengajar
  // respons droplet di wabah tungau — untuk kontak, distraktornya fogging/isolasi.
  // Fix CODEX-25 #17: distraktor airborne = "cukup masker bedah" (jebakan klasik
  // TB — mengira TB sama dgn droplet biasa).
  const distraktorAksi =
    pola === 'kontak'
      ? { id: 'b', label: 'Fogging wilayah + isolasi ketat rumah terdampak', benar: false, respons: 'Fogging utk nyamuk, bukan tungau/sekret; isolasi berlebihan. Kontak diputus dgn pengobatan serentak + dekontaminasi.' }
      : pola === 'airborne'
        ? { id: 'b', label: 'Bagikan masker bedah ke warga & obati yang batuk saja', benar: false, respons: 'Masker bedah tak cukup utk airborne, dan tanpa investigasi kontak + TPT rantai penularan TB tetap jalan. Wabah TB butuh penelusuran kontak, bukan sekadar masker.' }
        : { id: 'b', label: 'Obati yang sakit saja, tanpa tindakan wilayah', benar: false, respons: 'Kuratif tanpa pengendalian sumber = kasus baru terus bermunculan. Inti KLB ada di wilayah.' }

  return [
    {
      id: 'klb_verif',
      judul: 'KLB — Verifikasi & Definisi Kasus',
      narasi: `Sinyal kluster ${namaKasus} di ${namaRw}. Langkah PERTAMA seorang dokter Puskesmas?`,
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
      narasi: 'Kamu turun ke lapangan. Data apa yang paling kritis dikumpulkan lebih dulu?',
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
export function jawabKegiatan(
  kg: KegiatanState,
  kartuId: string,
  pilihanId: string,
): { kg: KegiatanState; selesai: boolean; benar: boolean } {
  const kartu = kg.kartu[kg.index]
  if (!kartu || kartu.id !== kartuId) return { kg, selesai: false, benar: false }
  const pilihan = kartu.pilihan.find((p) => p.id === pilihanId)
  if (!pilihan) return { kg, selesai: false, benar: false }
  const jawaban = [...kg.jawaban, { kartuId, pilihanId, benar: pilihan.benar }]
  const index = kg.index + 1
  const selesai = index >= kg.kartu.length
  return { kg: { ...kg, index, jawaban }, selesai, benar: pilihan.benar }
}

/**
 * Delegasi sisa kartu ke kader (khusus posyandu): kader menjawab, tapi 20%
 * peluang salah per kartu — mengajarkan supervisi task-shifting.
 */
export function delegasiKegiatan(kg: KegiatanState, rng: Rng): KegiatanState {
  let cur = kg
  while (cur.index < cur.kartu.length) {
    const kartu = cur.kartu[cur.index]
    if (!kartu) break
    const kaderBenar = rng.chance(0.8)
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

/** Drift parameter Prolanis antar-bulan: intervensi tepat menurunkan, lalai menaikkan. */
export function driftProlanis(p: PesertaProlanis, intervensiTepat: boolean, rng: Rng): PesertaProlanis {
  const arah = intervensiTepat ? -1 : 1
  // #12 (audit CODEX UKM 2026-07-16): skala DM kini GDP — ambang kontrol
  // RPPT <130 mg/dL (bukan GDS <200); langkah drift disesuaikan ke skala GDP.
  const besar = p.jenis === 'ht' ? rng.int(6, 16) : rng.int(10, 30)
  const param = Math.max(p.jenis === 'ht' ? 110 : 85, p.param + arah * besar)
  const terkontrol = prolanisTerkendali(p.jenis, param)
  const takTerkontrolBerturut = terkontrol ? 0 : p.takTerkontrolBerturut + 1
  return { ...p, param, takTerkontrolBerturut }
}
