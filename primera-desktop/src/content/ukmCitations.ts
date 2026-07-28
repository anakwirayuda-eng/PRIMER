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

const SUMBER_SAJI =
  'Permenkes RI No. 39 Tahun 2016, Lampiran I Bab IV: kunjungan rumah memakai SAJI dan Pinkesga sesuai masalah keluarga; implementasi ILP Kemenkes RI 15 April 2025 menegaskan kader tetap memakai SAJI dan KIE pada kunjungan rumah.'

const SUMBER_ILP =
  'KMK RI No. HK.01.07/MENKES/2015/2023: kunjungan rumah menindaklanjuti sasaran yang kehilangan layanan, tidak patuh, atau memiliki tanda bahaya melalui jejaring Puskesmas-Pustu-Posyandu; laporan implementasi Kemenkes RI 15 April 2025 mengonfirmasi missing service, non-compliance, dan danger sign sebagai keluaran kunjungan rumah ILP.'

const SUMBER_PENANGGULANGAN_PENYAKIT =
  'Permenkes RI No. 3 Tahun 2026 tentang Penanggulangan Penyakit adalah payung aktif pencegahan, surveilans, respons, komunikasi risiko, serta pelibatan masyarakat; ketentuan program spesifik tetap dibaca bersama bagian yang tidak dicabut dan pedoman teknis terkait.'

const SUMBER_POSYANDU =
  'Panduan Pengelolaan Posyandu Bidang Kesehatan, Kementerian Kesehatan RI, Agustus 2023, Bab III: lima langkah pelayanan untuk seluruh siklus hidup; Kurikulum Pelatihan Keterampilan Dasar Kader Posyandu Kemenkes RI 2024 memuat 25 keterampilan kader; keduanya selaras dengan ILP KMK RI No. HK.01.07/MENKES/2015/2023.'

const SUMBER_PROLANIS =
  'Panduan Praktis PROLANIS BPJS Kesehatan No. 06 (dokumen resmi era 2014-2019): konsultasi, edukasi klub, reminder, dan home visit; dibaca bersama KMK RI No. HK.01.07/MENKES/2015/2023 yang mengintegrasikan layanan dewasa-lansia.'

const SUMBER_KLB =
  'Permenkes RI No. 1 Tahun 2026 tentang Kejadian Luar Biasa, Wabah, dan Krisis Kesehatan menjadi dasar operasional penyelidikan, surveilans, respons, komunikasi risiko, dan pelaporan KLB; Permenkes RI No. 19 Tahun 2024 menempatkan fungsi tersebut pada klaster P2PL Puskesmas, selaras dengan ILP KMK RI No. HK.01.07/MENKES/2015/2023.'

const SUMBER_JKN =
  'Permenkes RI No. 39 Tahun 2016, Lampiran I: kepesertaan JKN adalah indikator keluarga sehat; pada langkah Jelaskan dan Bantu, JKN dicontohkan untuk mengatasi hambatan biaya layanan.'

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
  return `${SUMBER_SAJI} Untuk skenario ini, ${gabungLandasan(skenario.target)}. ${SUMBER_ILP} ${SUMBER_PENANGGULANGAN_PENYAKIT}`
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
  const konteks = `${SUMBER_SAJI} Landasan domain skenario: ${gabungLandasan(skenario.target)}.`
  if (fase === 'pra_penilaian') {
    return {
      sumber: `${konteks} Sumber ini memberi konteks masalah keluarga, bukan mengesahkan kartu yang sedang dipilih atau membocorkan jawaban.`,
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
