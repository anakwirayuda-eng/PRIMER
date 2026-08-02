/**
 * M11 UKM C2 - registry sitasi UKM player-facing.
 *
 * Seluruh metadata yang disusun di sini murni bacaan. Registry sengaja
 * dipisah dari engine agar sumber dapat diaudit tanpa mengubah replay/skor.
 */
import type { IndikatorPisPk, KartuIntervensi, SkenarioKunjungan } from './types'
import {
  evidenceIntervensiUkm,
  kartuIntervensiBenar,
  type SumberUkm,
  type TingkatDukunganUkm,
} from './ukmEvidence'

/*
 * Sapuan delivery 2026-08-02 (masukan dr. Wirayuda: paragraf landasan lama
 * "mbulet dan muter-muter" — mengganggu memori & pembelajaran). Prinsip
 * penulisan ulang, berlaku utk seluruh blok di file ini:
 *   1. MAKSUD DULU, nomor peraturan BELAKANGAN (dalam kurung di ujung
 *      kalimat) — pembaca tak boleh dipaksa melewati kop birokrasi sebelum
 *      tahu apa isinya. Tautan BUKA SUMBER tetap membawa rujukan lengkapnya.
 *   2. Satu gagasan per kalimat; rantai titik-koma dipecah.
 *   3. Istilah asing diterjemahkan (missing service → layanan terlewat, dst.)
 *      — konsisten kebijakan "bahasa pemain" copy-audit 2026-08-01.
 *   4. Boilerplate hukum tanpa nilai belajar ("dibaca bersama bagian yang
 *      tidak dicabut") dibuang — itu bahasa penyusun peraturan, bukan
 *      bahasa pembelajar. TIDAK ADA rujukan peraturan yang dihapus.
 */
const SUMBER_SAJI =
  'Cara berkunjungnya memakai alur SAJI — Salam, Ajak bicara, Jelaskan dan bantu, Ingatkan — dengan paket informasi Pinkesga sesuai masalah keluarga (Permenkes 39/2016, Lampiran I Bab IV). Alur yang sama tetap dipakai kader pada implementasi ILP (laporan Kemenkes, 15 April 2025).'

const SUMBER_ILP =
  'Kunjungan rumah juga alat tindak lanjut: mencari sasaran yang layanannya terlewat, yang tidak patuh berobat, atau yang menunjukkan tanda bahaya, lewat jejaring Puskesmas-Pustu-Posyandu (Juknis ILP, KMK HK.01.07/MENKES/2015/2023).'

const SUMBER_PENANGGULANGAN_PENYAKIT =
  'Payung besarnya Permenkes 3/2026 tentang Penanggulangan Penyakit: pencegahan, surveilans, respons, komunikasi risiko, dan pelibatan masyarakat.'

const SUMBER_POSYANDU =
  'Pelayanan Posyandu memakai lima langkah yang sama untuk seluruh siklus hidup (Panduan Pengelolaan Posyandu Bidang Kesehatan, Kementerian Kesehatan RI 2023, Bab III). Kader dibekali 25 keterampilan dasar (Kurikulum Pelatihan Kader Posyandu 2024). Keduanya selaras dengan Juknis ILP.'

const SUMBER_PROLANIS =
  'PROLANIS mengelola penyakit kronis lewat empat kegiatan: konsultasi rutin, edukasi klub, pengingat, dan kunjungan rumah (Panduan Praktis PROLANIS BPJS Kesehatan No. 06, dokumen resmi era 2014-2019). Lewat Juknis ILP, layanan dewasa dan lansia kini berjalan terintegrasi.'

const SUMBER_KLB =
  'Penyelidikan, surveilans, respons, komunikasi risiko, dan pelaporan KLB berpayung pada Permenkes 1/2026. Di Puskesmas, fungsi itu dijalankan klaster P2PL (Permenkes 19/2024), selaras dengan Juknis ILP.'

export interface TautanSumberUkm {
  id: string
  label: string
  url: string
}

const TAUTAN_PIS_PK: TautanSumberUkm = {
  id: 'kemenkes:permenkes-39-2016-pis-pk',
  label: 'Permenkes 39/2016 · PIS-PK',
  url: 'https://www.peraturan.go.id/id/permenkes-no-39-tahun-2016',
}

const TAUTAN_ILP: TautanSumberUkm = {
  id: 'kemenkes:kmk-2015-2023-ilp',
  label: 'Kemenkes · Juknis ILP 2023',
  url: 'https://kesprimkom.kemkes.go.id/konten/146/176/0/nomor-hk-01-07-menkes-2015-2023',
}

const TAUTAN_SAJI_TERKINI: TautanSumberUkm = {
  id: 'kemenkes:implementasi-ilp-saji-2025',
  label: 'Kemenkes · Implementasi SAJI',
  url: 'https://kemkes.go.id/eng/puskesmas-fokus-wujudkan-masyarakat-hidup-sehat',
}

const TAUTAN_PENANGGULANGAN_PENYAKIT: TautanSumberUkm = {
  id: 'kemenkes:permenkes-3-2026',
  label: 'Permenkes 3/2026 · Penanggulangan Penyakit',
  url: 'https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-3-tahun-2026',
}

const TAUTAN_POSYANDU: TautanSumberUkm = {
  id: 'kemenkes:panduan-posyandu-2023',
  label: 'Kemenkes · Panduan Posyandu 2023',
  url: 'https://ayosehat.kemkes.go.id/download/jsf/3ceac4c33f422939ca2e1ce9dfe66595.pdf',
}

const TAUTAN_KADER_POSYANDU: TautanSumberUkm = {
  id: 'kemenkes:kurikulum-kader-posyandu-2024',
  label: 'Kemenkes · 25 Keterampilan Kader',
  url: 'https://ayosehat.kemkes.go.id/media-kampanye-organisasi/buku---kurikulum-pelatihan-bagi-pelatih-keterampilan-dasar-bagi-kader-posyandu',
}

const TAUTAN_PROLANIS: TautanSumberUkm = {
  id: 'bpjs:panduan-praktis-prolanis',
  label: 'BPJS · Panduan Praktis PROLANIS',
  url: 'https://www.bpjs-kesehatan.go.id/bpjs/arsip/detail/39',
}

const TAUTAN_KLB: TautanSumberUkm = {
  id: 'kemenkes:permenkes-1-2026',
  label: 'Permenkes 1/2026 · KLB & Wabah',
  url: 'https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-1-tahun-2026',
}

const TAUTAN_PUSKESMAS: TautanSumberUkm = {
  id: 'kemenkes:permenkes-19-2024',
  label: 'Permenkes 19/2024 · Puskesmas',
  url: 'https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-19-tahun-2024',
}

function tautanDariEvidence(sumber: SumberUkm): TautanSumberUkm {
  return {
    id: sumber.id,
    label: sumber.labelRingkas,
    url: sumber.url,
  }
}

function tautanUnik(tautan: readonly TautanSumberUkm[]): TautanSumberUkm[] {
  return [...new Map(tautan.map((item) => [item.id, item])).values()]
}

interface LandasanIndikator {
  ringkas: string
  pinkesga: string
}

/**
 * `ringkas` = frasa inti TELANJANG (tanpa awalan "indikator keluarga sehat
 * menilai..."). Sapuan delivery 2026-08-02: awalan itu dulu melekat di TIAP
 * entri, jadi skenario multi-target menghasilkan "indikator keluarga sehat
 * menilai X; indikator keluarga sehat menilai Y" — pengulangan yang membuat
 * paragraf terasa muter-muter. Kini bingkainya disebut SEKALI oleh template
 * (panduanSkenarioUkm / sitasiIntervensiUkm), entri tinggal isinya.
 */
const LANDASAN_INDIKATOR: Record<IndikatorPisPk, LandasanIndikator> = {
  kb: {
    ringkas: 'keikutsertaan pasangan menikah dalam program KB',
    pinkesga: 'Pinkesga Keluarga Berencana (KB)',
  },
  persalinan_faskes: {
    ringkas: 'persalinan berlangsung di fasilitas pelayanan kesehatan',
    pinkesga: 'Pinkesga Pemeriksaan Kehamilan',
  },
  imunisasi_dasar: {
    ringkas: 'kelengkapan imunisasi dasar bayi',
    pinkesga: 'Pinkesga Imunisasi',
  },
  asi_eksklusif: {
    ringkas: 'ASI eksklusif selama enam bulan pertama (obat serta vitamin/mineral tidak membatalkannya)',
    pinkesga: 'Pinkesga ASI Eksklusif',
  },
  pantau_tumbuh_kembang: {
    ringkas: 'pemantauan pertumbuhan balita dalam satu bulan terakhir',
    pinkesga: 'Pinkesga Penimbangan Balita',
  },
  tb_berobat_standar: {
    ringkas: 'pengobatan TB paru sesuai standar — termasuk akses layanan, pencegahan penularan, kepatuhan minum obat, dan pemeriksaan kontak serumah',
    pinkesga: 'Pinkesga Tuberkulosis',
  },
  hipertensi_berobat: {
    ringkas: 'keteraturan minum obat pada anggota yang sudah terdiagnosis hipertensi',
    pinkesga: 'Pinkesga Hipertensi',
  },
  jiwa_tidak_ditelantarkan: {
    ringkas: 'pengobatan teratur gangguan jiwa berat, dan tidak ada anggota keluarga yang dipasung atau ditelantarkan',
    pinkesga: 'Pinkesga Kesehatan Jiwa',
  },
  tidak_merokok: {
    ringkas: 'tidak ada anggota keluarga yang merokok (tersedia layanan upaya berhenti merokok)',
    pinkesga: 'Pinkesga Bahaya Merokok',
  },
  jkn: {
    ringkas: 'kepesertaan keluarga dalam Jaminan Kesehatan Nasional',
    pinkesga: 'Pinkesga Jaminan Kesehatan Nasional',
  },
  air_bersih: {
    ringkas: 'ketersediaan sarana air bersih dari sumber terlindung',
    pinkesga: 'Pinkesga Sarana Air Bersih',
  },
  jamban_sehat: {
    ringkas: 'akses dan pemakaian jamban saniter yang tidak menyebarkan penyakit',
    pinkesga: 'Pinkesga Jamban Sehat',
  },
}

function gabungLandasan(target: IndikatorPisPk[]): string {
  return target.map((indikator) => LANDASAN_INDIKATOR[indikator].ringkas).join('; ')
}

function gabungPinkesga(target: IndikatorPisPk[]): string {
  return [...new Set(target.map((indikator) => LANDASAN_INDIKATOR[indikator].pinkesga))].join(' + ')
}

/**
 * Sapuan delivery 2026-08-02: dulu SATU paragraf raksasa yang membuka dengan
 * kop peraturan dan MENGUBUR kalimat terpenting (apa yang dinilai kunjungan
 * ini) di tengah-tengah. Kini empat paragraf pendek (\n\n; perender memakai
 * white-space: pre-line), diurut menurut kebutuhan pembelajar:
 * apa yang dinilai → bagaimana caranya → untuk apa lagi → payung besarnya.
 */
export function panduanSkenarioUkm(skenario: SkenarioKunjungan): string {
  return [
    `Yang dinilai pada kunjungan ini: ${gabungLandasan(skenario.target)}. Itulah tolok ukur indikator keluarga sehat untuk masalah keluarga ini (Permenkes 39/2016).`,
    SUMBER_SAJI,
    SUMBER_ILP,
    SUMBER_PENANGGULANGAN_PENYAKIT,
  ].join('\n\n')
}

export function tautanPanduanSkenarioUkm(
  _skenario: Pick<SkenarioKunjungan, 'id'>,
): readonly TautanSumberUkm[] {
  return [
    TAUTAN_PIS_PK,
    TAUTAN_SAJI_TERKINI,
    TAUTAN_ILP,
    TAUTAN_PENANGGULANGAN_PENYAKIT,
  ]
}

export interface SitasiIntervensiUkm {
  sumber: string
  tautan: readonly TautanSumberUkm[]
  pinkesga: string
  tingkatDukungan: TingkatDukunganUkm
  labelDukungan: string
  batasan: string
}

export function sitasiIntervensiUkm(
  skenario: SkenarioKunjungan,
  kartu: KartuIntervensi,
  fase: 'pra_penilaian' | 'pasca_penilaian' = 'pra_penilaian',
): SitasiIntervensiUkm {
  const pinkesga = kartu.pinkesga?.trim() ?? gabungPinkesga(skenario.target)
  // Sapuan delivery 2026-08-02: maksud dulu, peraturan belakangan — dan tanpa
  // mengulang seluruh blok SAJI di sini (pemain baru saja membacanya di
  // konteks kunjungan; pengulangan = beban, bukan penguatan).
  const konteks = `Masalah keluarga ini dinilai lewat: ${gabungLandasan(skenario.target)} (Permenkes 39/2016).`
  if (fase === 'pra_penilaian') {
    return {
      sumber: `${konteks} Sumber di bawah memberi konteks masalahnya — bukan kunci jawaban untuk kartu yang sedang kamu pilih.`,
      tautan: [TAUTAN_PIS_PK, TAUTAN_SAJI_TERKINI],
      pinkesga,
      tingkatDukungan: 'konteks_domain',
      labelDukungan: 'Konteks domain, bukan kunci jawaban',
      batasan: 'Kecocokan intervensi dinilai setelah kunjungan selesai.',
    }
  }

  const evidence = evidenceIntervensiUkm(skenario, kartu)
  const benar = kartuIntervensiBenar(skenario, kartu)
  if (benar && evidence) {
    return {
      sumber: `${evidence.sumber.sitasi}. ${evidence.klaimDidukung}`,
      tautan: [tautanDariEvidence(evidence.sumber)],
      pinkesga,
      tingkatDukungan: evidence.tingkat,
      labelDukungan:
        evidence.tingkat === 'mekanisme_spesifik' ? 'Mekanisme didukung evidence' : 'Adaptasi beralasan',
      batasan: evidence.batasan,
    }
  }

  return {
    sumber: kartu.sumber?.trim() ?? konteks,
    tautan: [TAUTAN_PIS_PK, TAUTAN_SAJI_TERKINI],
    pinkesga,
    tingkatDukungan: 'konteks_domain',
    labelDukungan: 'Konteks domain saja',
    batasan: benar
      ? 'Kartu benar belum memiliki binding evidence spesifik; aktivasi seharusnya diblokir oleh invariant authoring.'
      : 'Pedoman mendukung tujuan program, bukan pilihan kartu ini. Kartu ini adalah distraktor pedagogis.',
  }
}

interface KartuKegiatanBersumber {
  id: string
  sumber?: string
}

/**
 * Kartu kegiatan dibentuk di engine beku. Renderer memakai registry ini sebagai
 * fallback sehingga sitasi tampil tanpa menyentuh `engine/kegiatan.ts`.
 */
export function sumberKegiatanUkm(
  kartu: KartuKegiatanBersumber,
  jenis?: 'posyandu' | 'prolanis' | 'klb',
): string | undefined {
  if (kartu.sumber?.trim()) return kartu.sumber
  if (jenis === 'posyandu' || kartu.id.startsWith('posy_')) return SUMBER_POSYANDU
  if (jenis === 'prolanis' || kartu.id.startsWith('prol_')) return SUMBER_PROLANIS
  if (jenis === 'klb' || kartu.id.startsWith('klb_')) return SUMBER_KLB
  return undefined
}

export function tautanKegiatanUkm(
  kartu: KartuKegiatanBersumber,
  jenis?: 'posyandu' | 'prolanis' | 'klb',
): readonly TautanSumberUkm[] {
  if (jenis === 'posyandu' || kartu.id.startsWith('posy_')) {
    return tautanUnik([TAUTAN_POSYANDU, TAUTAN_KADER_POSYANDU, TAUTAN_ILP])
  }
  if (jenis === 'prolanis' || kartu.id.startsWith('prol_')) {
    return tautanUnik([TAUTAN_PROLANIS, TAUTAN_ILP])
  }
  if (jenis === 'klb' || kartu.id.startsWith('klb_')) {
    return tautanUnik([TAUTAN_KLB, TAUTAN_PUSKESMAS, TAUTAN_ILP])
  }
  return []
}
