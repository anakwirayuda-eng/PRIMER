/**
 * M11 UKM C2 - registry sitasi UKM player-facing.
 *
 * Seluruh metadata yang disusun di sini murni bacaan. Registry sengaja
 * dipisah dari engine agar sumber dapat diaudit tanpa mengubah replay/skor.
 */
import type { IndikatorPisPk, KartuIntervensi, SkenarioKunjungan } from './types'

const SUMBER_SAJI =
  'Permenkes RI No. 39 Tahun 2016, Lampiran I Bab IV: kunjungan rumah memakai SAJI dan Pinkesga sesuai masalah keluarga; implementasi ILP Kemenkes RI 15 April 2025 menegaskan kader tetap memakai SAJI dan KIE pada kunjungan rumah.'

const SUMBER_ILP =
  'KMK RI No. HK.01.07/MENKES/2015/2023: kunjungan rumah menindaklanjuti sasaran yang kehilangan layanan, tidak patuh, atau memiliki tanda bahaya melalui jejaring Puskesmas-Pustu-Posyandu; laporan implementasi Kemenkes RI 15 April 2025 mengonfirmasi missing service, non-compliance, dan danger sign sebagai keluaran kunjungan rumah ILP.'

const SUMBER_POSYANDU =
  'Panduan Pengelolaan Posyandu Bidang Kesehatan, Kementerian Kesehatan RI, Agustus 2023, Bab III: lima langkah pelayanan untuk seluruh siklus hidup; Kurikulum Pelatihan Keterampilan Dasar Kader Posyandu Kemenkes RI 2024 memuat 25 keterampilan kader; keduanya selaras dengan ILP KMK RI No. HK.01.07/MENKES/2015/2023.'

const SUMBER_PROLANIS =
  'Panduan Praktis PROLANIS BPJS Kesehatan No. 06 (dokumen resmi era 2014-2019): konsultasi, edukasi klub, reminder, dan home visit; dibaca bersama KMK RI No. HK.01.07/MENKES/2015/2023 yang mengintegrasikan layanan dewasa-lansia.'

const SUMBER_KLB =
  'Permenkes RI No. 1 Tahun 2026 tentang Kejadian Luar Biasa, Wabah, dan Krisis Kesehatan menjadi dasar operasional penyelidikan, surveilans, respons, komunikasi risiko, dan pelaporan KLB; Permenkes RI No. 19 Tahun 2024 menempatkan fungsi tersebut pada klaster P2PL Puskesmas, selaras dengan ILP KMK RI No. HK.01.07/MENKES/2015/2023.'

const SUMBER_JKN =
  'Permenkes RI No. 39 Tahun 2016, Lampiran I: kepesertaan JKN adalah indikator keluarga sehat; pada langkah Jelaskan dan Bantu, JKN dicontohkan untuk mengatasi hambatan biaya layanan.'

const SUMBER_PROGRAM_BY_INTERVENSI_ID: Readonly<Record<string, string>> = {
  'wulan_k1:wk1_i4': SUMBER_PROLANIS,
  'musa_k1:musa_i_senam': SUMBER_PROLANIS,
  'musa_k2:musa_i2_testimoni': SUMBER_PROLANIS,
  'ketut_k1:kk1_i2': SUMBER_POSYANDU,
  'ketut_k1:kk1_i3': SUMBER_POSYANDU,
  'ketut_k2:kk2_i3': SUMBER_POSYANDU,
  'asih_k1:ak1_i3': SUMBER_POSYANDU,
  'ketut_k1:kk1_i4': SUMBER_JKN,
  'asih_k1:ak1_i2': SUMBER_JKN,
  'marni_k1:mk1_i1': SUMBER_JKN,
}

interface LandasanIndikator {
  ringkas: string
  pinkesga: string
}

const LANDASAN_INDIKATOR: Record<IndikatorPisPk, LandasanIndikator> = {
  kb: {
    ringkas: 'indikator keluarga sehat menilai keikutsertaan pasangan menikah dalam program KB',
    pinkesga: 'Pinkesga Keluarga Berencana (KB)',
  },
  persalinan_faskes: {
    ringkas: 'indikator keluarga sehat mensyaratkan persalinan berlangsung di fasilitas pelayanan kesehatan',
    pinkesga: 'Pinkesga Pemeriksaan Kehamilan',
  },
  imunisasi_dasar: {
    ringkas: 'indikator keluarga sehat menilai kelengkapan imunisasi dasar bayi',
    pinkesga: 'Pinkesga Imunisasi',
  },
  asi_eksklusif: {
    ringkas: 'indikator keluarga sehat mendefinisikan ASI eksklusif selama enam bulan pertama, dengan pengecualian obat serta vitamin/mineral',
    pinkesga: 'Pinkesga ASI Eksklusif',
  },
  pantau_tumbuh_kembang: {
    ringkas: 'indikator keluarga sehat menilai pemantauan pertumbuhan balita dalam satu bulan terakhir',
    pinkesga: 'Pinkesga Penimbangan Balita',
  },
  tb_berobat_standar: {
    ringkas: 'indikator keluarga sehat menilai pengobatan TB paru sesuai standar; pendekatan keluarga juga mencakup akses layanan, pencegahan penularan, pemantauan kepatuhan, dan kontak serumah',
    pinkesga: 'Pinkesga Tuberkulosis',
  },
  hipertensi_berobat: {
    ringkas: 'indikator keluarga sehat menilai keteraturan pengobatan pada anggota yang telah didiagnosis hipertensi',
    pinkesga: 'Pinkesga Hipertensi',
  },
  jiwa_tidak_ditelantarkan: {
    ringkas: 'indikator keluarga sehat menilai pengobatan teratur gangguan jiwa berat serta memastikan anggota keluarga tidak dipasung atau ditelantarkan',
    pinkesga: 'Pinkesga Kesehatan Jiwa',
  },
  tidak_merokok: {
    ringkas: 'indikator keluarga sehat mensyaratkan tidak ada anggota keluarga yang masih merokok; program juga mencakup layanan upaya berhenti merokok',
    pinkesga: 'Pinkesga Bahaya Merokok',
  },
  jkn: {
    ringkas: 'indikator keluarga sehat menilai kepesertaan keluarga dalam Jaminan Kesehatan Nasional',
    pinkesga: 'Pinkesga Jaminan Kesehatan Nasional',
  },
  air_bersih: {
    ringkas: 'indikator keluarga sehat menilai ketersediaan sarana air bersih dan apakah sumbernya terlindung',
    pinkesga: 'Pinkesga Sarana Air Bersih',
  },
  jamban_sehat: {
    ringkas: 'indikator keluarga sehat menilai akses atau penggunaan jamban keluarga yang saniter dan tidak menyebarkan bahan berbahaya maupun vektor',
    pinkesga: 'Pinkesga Jamban Sehat',
  },
}

function gabungLandasan(target: IndikatorPisPk[]): string {
  return target.map((indikator) => LANDASAN_INDIKATOR[indikator].ringkas).join('; ')
}

function gabungPinkesga(target: IndikatorPisPk[]): string {
  return [...new Set(target.map((indikator) => LANDASAN_INDIKATOR[indikator].pinkesga))].join(' + ')
}

export function panduanSkenarioUkm(skenario: SkenarioKunjungan): string {
  return `${SUMBER_SAJI} Untuk skenario ini, ${gabungLandasan(skenario.target)}. ${SUMBER_ILP}`
}

function sumberKhususIntervensi(
  skenario: SkenarioKunjungan,
  kartu: KartuIntervensi,
): string | undefined {
  return SUMBER_PROGRAM_BY_INTERVENSI_ID[`${skenario.id}:${kartu.id}`]
}

export interface SitasiIntervensiUkm {
  sumber: string
  pinkesga: string
}

export function sitasiIntervensiUkm(
  skenario: SkenarioKunjungan,
  kartu: KartuIntervensi,
): SitasiIntervensiUkm {
  const sumberKhusus = sumberKhususIntervensi(skenario, kartu)
  const landasan =
    sumberKhusus ??
    `${SUMBER_SAJI} Landasan penilaian skenario: ${gabungLandasan(skenario.target)}.`
  return {
    sumber:
      kartu.sumber?.trim() ??
      `${landasan} Bentuk operasional kartu adalah adaptasi gameplay berbasis hambatan keluarga, bukan tindakan yang diwajibkan kata-per-kata oleh pedoman.`,
    pinkesga: kartu.pinkesga?.trim() ?? gabungPinkesga(skenario.target),
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
