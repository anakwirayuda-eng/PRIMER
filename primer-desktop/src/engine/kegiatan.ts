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
 * POSYANDU — 5 meja disederhanakan jadi 4 keputusan klinis inti.
 * (Meja 1 pendaftaran & Meja 5 pelayanan dilebur ke narasi.)
 * ------------------------------------------------------------------------- */

export function kartuPosyandu(): KartuKegiatan[] {
  return [
    {
      id: 'posy_timbang',
      judul: 'Meja 2 — Penimbangan',
      narasi:
        'An. Kadek, 18 bulan. Bulan lalu 9,1 kg; hari ini 8,7 kg. Ibunya bilang anaknya ' +
        'sempat diare seminggu. Di KMS, titik bulan ini turun memotong satu pita warna.',
      pilihan: [
        {
          id: 'a',
          label: 'Catat "berat turun" (BGM), rujuk konseling gizi + telusuri penyebab',
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
      id: 'posy_kms',
      judul: 'Meja 3 — Pengisian KMS',
      narasi:
        'Ibu An. Kadek bertanya, "Dok, garis anak saya di bawah garis merah artinya apa?"',
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
      id: 'posy_imunisasi',
      judul: 'Meja 4 — Imunisasi',
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
      judul: 'Meja 5 — Penyuluhan',
      narasi: 'Sekelompok ibu menunggu. Topik apa yang paling berdampak untuk sesi singkat ini?',
      pilihan: [
        {
          id: 'a',
          label: 'ASI eksklusif + MPASI adekuat (menyasar akar faltering hari ini)',
          benar: true,
          respons: 'Tepat sasaran — penyuluhan paling kuat bila menjawab masalah nyata yang baru terlihat.',
        },
        {
          id: 'b',
          label: 'Ceramah umum panjang tentang semua penyakit',
          benar: false,
          respons: 'Terlalu luas = tidak ada yang nempel. Fokus satu pesan yang bisa langsung dipakai.',
        },
      ],
    },
  ]
}

/* ---------------------------------------------------------------------------
 * PROLANIS — satu kartu per peserta kronis: keputusan tata laksana bulanan.
 * ------------------------------------------------------------------------- */

export function kartuProlanis(peserta: PesertaProlanis[]): KartuKegiatan[] {
  return peserta.map((p) => {
    const terkontrol = p.jenis === 'ht' ? p.param < 140 : p.param < 200
    if (p.jenis === 'ht') {
      return {
        id: `prol_${p.id}`,
        pesertaId: p.id,
        judul: `Prolanis HT — ${p.nama} (${p.usia} th)`,
        narasi: `Tekanan darah hari ini ${p.param}/${Math.round(p.param * 0.62)} mmHg. ${
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
      narasi: `Gula darah sewaktu ${p.param} mg/dL. ${
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

type PolaKlb = 'vektor' | 'air_makanan' | 'droplet'

function polaDariKasus(kasusId: string): PolaKlb {
  if (kasusId === 'dengue_df') return 'vektor'
  if (kasusId === 'diare_akut_anak' || kasusId === 'demam_tifoid') return 'air_makanan'
  return 'droplet' // ispa, tb, konjungtivitis, skabies (kontak) → tangani generik droplet/kontak
}

export function kartuKlb(kasusId: string, namaKasus: string, namaRw: string): KartuKegiatan[] {
  const pola = polaDariKasus(kasusId)
  const aksiBenar =
    pola === 'vektor'
      ? { id: 'a', label: 'PSN 3M Plus + larvasidasi; fogging hanya bila ada penularan aktif', benar: true, respons: 'Tepat. Fogging membunuh nyamuk dewasa sesaat; PSN memutus siklus di sumbernya.' }
      : pola === 'air_makanan'
        ? { id: 'a', label: 'Amankan sumber air & sanitasi, distribusi oralit/klorinasi, edukasi CTPS', benar: true, respons: 'Benar. Putus rute fekal-oral di sumbernya + cegah dehidrasi.' }
        : { id: 'a', label: 'Etika batuk/masker, ventilasi, temukan & obati kasus + kontak', benar: true, respons: 'Tepat. Kurangi transmisi droplet + putus rantai lewat penemuan kasus.' }

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
      pilihan: [
        aksiBenar,
        {
          id: 'b',
          label: 'Obati yang sakit saja, tanpa tindakan wilayah',
          benar: false,
          respons: 'Kuratif tanpa pengendalian sumber = kasus baru terus bermunculan. Inti KLB ada di wilayah.',
        },
      ],
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
  const besar = p.jenis === 'ht' ? rng.int(6, 16) : rng.int(15, 45)
  const param = Math.max(p.jenis === 'ht' ? 110 : 90, p.param + arah * besar)
  const terkontrol = p.jenis === 'ht' ? param < 140 : param < 200
  const takTerkontrolBerturut = terkontrol ? 0 : p.takTerkontrolBerturut + 1
  return { ...p, param, takTerkontrolBerturut }
}
