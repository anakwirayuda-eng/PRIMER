/**
 * STATE ENGINE — bentuk kanonik seluruh dunia game.
 * Engine murni: tidak ada import React/DOM/Electron di folder ini.
 * Semua perubahan state HANYA lewat reducer `advance()` (lihat reducer.ts).
 */

import type {
  IndikatorPisPk,
  JenisKelamin,
  Persona,
  RegionFisik,
  StatusIndikator,
  TahapTtm,
} from '@content/types'

/* ---------------------------------------------------------------------------
 * Waktu
 * ------------------------------------------------------------------------- */

export type Blok = 'pagi' | 'siang' | 'sore'
export type Musim = 'hujan' | 'pancaroba' | 'kemarau'

/** Musim epidemiologis 3 babak (D1-30 hujan, D31-60 pancaroba, D61-90 kemarau). */
export function musimDariHari(hari: number): Musim {
  if (hari <= 30) return 'hujan'
  if (hari <= 60) return 'pancaroba'
  return 'kemarau'
}

/* ---------------------------------------------------------------------------
 * Pasien & encounter klinik
 * ------------------------------------------------------------------------- */

export interface PasienAktif {
  id: string
  nama: string
  usia: number
  jenisKelamin: JenisKelamin
  persona: Persona
  kasusId: string
  bpjs: boolean
  /** Alergi yang dibawa pasien (golongan, mis. 'penisilin'). Tersembunyi sampai ditanya/RM. */
  alergi: string[]
  /** RW tempat tinggal pasien — pakan surveilans balik UKP→UKM. */
  rw: number
  /** Kaitan ke keluarga binaan (karma loop dua arah). */
  keluargaId?: string
  /** Pasien dari keluarga yang pernah dikunjungi → lebih jujur/terbuka. */
  bonusTrust: boolean
  /** Pasien follow-up konsekuensi (kembali memburuk). */
  followUpDari?: string
}

export type FaseEncounter =
  | 'anamnesis'
  | 'pemeriksaan'
  | 'diagnosis'
  | 'terapi'
  | 'disposisi'
  | 'selesai'

export type JenisDiagnosis = 'tegak' | 'suspek'
export type Disposisi = 'pulang' | 'rujuk' | 'observasi'

export interface SbarIsi {
  situation: string
  background: string
  assessment: string
  recommendation: string
}

export interface EncounterState {
  pasien: PasienAktif
  fase: FaseEncounter
  /** id pertanyaan yang sudah ditanya, berurutan. */
  ditanya: string[]
  /** Gauge sabar pasien 0-100; turun saat pertanyaan tidak relevan. */
  sabar: number
  vitalDiukur: boolean
  /** Region fisik yang sudah diperiksa. */
  diperiksa: RegionFisik[]
  /** Lab yang dipesan hari ini. */
  labDipesan: string[]
  /** Hasil lab yang SUDAH tersedia (sebagian datang besok via jadwal). */
  labTersedia: string[]
  diagnosis?: { icd10: string; jenis: JenisDiagnosis }
  resep: string[]
  edukasi: string[]
  /** Percobaan resep yang diblokir firewall alergi (untuk telemetri pedagogis). */
  firewallTerpicu: number
  disposisi?: Disposisi
  sbar?: SbarIsi
}

/** Penilaian satu encounter — dihitung engine saat disposisi, dari action-log. */
export interface PenilaianEncounter {
  kasusId: string
  pasienNama: string
  diagnosisBenar: boolean
  jenisDiagnosis: JenisDiagnosis
  skorAnamnesis: number // 0-100: esensial tercakup, penalti shotgun
  skorPemeriksaan: number // 0-100: region relevan diperiksa, penalti berlebih
  skorTerapi: number // 0-100
  skorEdukasi: number // 0-100
  disposisiTepat: boolean
  /** Rujukan non-spesialistik (kasus 4A dirujuk) — pakan RRNS. */
  rujukanNonSpesialistik: boolean
  /** Menahan kasus yang seharusnya dirujuk. */
  cowboy: boolean
  antibiotikTanpaIndikasi: boolean
  labTakRelevan: number
  sbarSkor?: number // 0-100 bila merujuk
  /** Grade huruf ringkas untuk UI. */
  grade: 'A' | 'B' | 'C' | 'D'
  /** Clue EBM kasus, ditampilkan di debrief. */
  clue: string
  /** Konsekuensi terjadwal? (id jadwal bila salah tatalaksana berbuntut) */
  konsekuensiDijadwalkan: boolean
}

/* ---------------------------------------------------------------------------
 * Desa, keluarga, kader (UKM)
 * ------------------------------------------------------------------------- */

export type SumberData = 'dokter' | 'kader' | 'belum'

export interface NilaiIndikator {
  status: StatusIndikator
  sumber: SumberData
  /** Hari data terakhir diperbarui. */
  hariData: number
  /** Data kader bisa SALAH — nilai sebenarnya disimpan engine, UI melihat `status`. */
  statusSebenarnya: StatusIndikator
}

export interface KeluargaState {
  id: string
  /** Trust 0-10 (♥×2). Naik dari KUALITAS pilihan MI, bukan frekuensi. */
  trust: number
  ttm: TahapTtm
  indikator: Record<IndikatorPisPk, NilaiIndikator>
  /** Index kunjungan arc berikutnya (progres cerita). */
  arcIndex: number
  /** Hari kunjungan terakhir oleh dokter. */
  kunjunganTerakhir?: number
  /** Jumlah kunjungan dokter. */
  jumlahKunjungan: number
  /** Follow-up terjadwal (hari). */
  followUpHari?: number
  /** Keluarga berisiko yang diabaikan bisa memburuk (karma). */
  karmaAktif?: { jadwalId: string; jatuhTempoHari: number }
  /** Arc selesai (berhasil/gagal) — menentukan epilog. */
  arcSelesai?: 'berhasil' | 'gagal'
}

export interface KaderState {
  id: string
  nama: string
  rw: number
  /** 45-90: peluang data akurat. */
  ketelitian: number
  /** Indikator yang bias dilaporkan salah oleh kader ini. */
  bias: IndikatorPisPk[]
  /** KK yang sudah disurvei kader (id keluarga & KK statistik). */
  kkTersurvei: number
}

export interface RwState {
  nomor: number
  nama: string
  jarak: 'dekat' | 'sedang' | 'terpencil'
  /** Total KK statistik (termasuk non-binaan). */
  totalKk: number
  /** KK tersurvei (kader+dokter) — basis "peta mulai abu-abu". */
  kkTersurvei: number
  /** IKS agregat RW 0-1 (kanonik, hanya dari KK yang punya data). */
  iks: number
}

/* ---------------------------------------------------------------------------
 * Kunjungan rumah — state machine 4 babak
 * ------------------------------------------------------------------------- */

export type BabakKunjunganFase = 'observasi' | 'wawancara' | 'diagnosis_perilaku' | 'resep_sosial' | 'selesai'

export interface KunjunganState {
  keluargaId: string
  skenarioId: string
  fase: BabakKunjunganFase
  /** Hotspot yang sudah ditemukan (babak observasi). */
  hotspotDitemukan: string[]
  /** Index node dialog aktif (babak wawancara). */
  dialogIndex: number
  /** Riwayat pilihan dialog (id) — sumber penilaian kualitas MI. */
  pilihanDiambil: string[]
  /** Trust delta yang terkumpul selama kunjungan ini. */
  trustDelta: number
  /** Konfrontasi beruntun → 2× = diusir. */
  konfrontasiBeruntun: number
  diusir: boolean
  hipotesis?: 'kapabilitas' | 'kesempatan' | 'motivasi'
  intervensiDipilih?: string
}

export interface HasilKunjungan {
  keluargaId: string
  skenarioId: string
  berhasil: boolean
  diusir: boolean
  hipotesisBenar: boolean
  trustDelta: number
  /** Kualitas MI 0-100 (proporsi pilihan tepat). */
  kualitasMi: number
  /** Indikator yang terverifikasi dokter selama observasi. */
  indikatorTerverifikasi: IndikatorPisPk[]
  narasiPenutup: string
  /**
   * Gradasi hasil (M1.1 — bridge bertingkat, port processUKPBridge lama):
   * berhasil = hipotesis & intervensi tepat; partial = salah satunya tepat
   * (karma tertunda); gagal = keduanya salah / diusir (karma dipercepat).
   */
  tingkat?: 'berhasil' | 'partial' | 'gagal'
  /** SDOH armor aktif: keluarga miskin/rentan menahan trust bila diagnosis meleset. */
  armorAktif?: boolean
}

/* ---------------------------------------------------------------------------
 * Inbox, jadwal, skor, dex
 * ------------------------------------------------------------------------- */

export type JenisSurat =
  | 'laporan_kader'
  | 'hasil_lab'
  | 'kabar_warga'
  | 'teguran_kapus'
  | 'pujian_kapus'
  | 'karma'
  | 'sistem'
  | 'tutorial'

export interface Surat {
  id: string
  hari: number
  jenis: JenisSurat
  dari: string
  judul: string
  isi: string
  dibaca: boolean
  /** Navigasi kontekstual: buka keluarga/pasien terkait. */
  kaitKeluargaId?: string
}

export type JenisJadwal =
  | 'hasil_lab'
  | 'follow_up_kunjungan'
  | 'pasien_kembali'
  | 'karma_igd'

export interface JadwalItem {
  id: string
  hari: number
  jenis: JenisJadwal
  /** Payload longgar namun bertipe per jenis (didiskriminasi di reducer). */
  labId?: string
  pasienId?: string
  kasusId?: string
  keluargaId?: string
  catatan?: string
  /** Identitas pasien yang kembali — "konsekuensi bernama" butuh nama yang sama. */
  nama?: string
  usia?: number
  jenisKelamin?: 'L' | 'P'
  rw?: number
}

/** Penghitung mentah — SATU-SATUNYA sumber skor. Diisi reducer, tak pernah UI. */
export interface SkorTally {
  totalPasien: number
  diagnosisBenar: number
  /** Kalibrasi epistemik stempel dua tinta. */
  tegakBenar: number
  tegakSalah: number
  suspekBenar: number
  suspekSalah: number
  rujukanTotal: number
  rujukanNonSpesialistik: number
  cowboy: number
  antibiotikTanpaIndikasi: number
  labTakRelevan: number
  /** MI: pilihan tepat / total pilihan di kunjungan. */
  miTepat: number
  miTotal: number
  kunjunganBerhasil: number
  kunjunganTotal: number
  kunjunganDiusir: number
  /** Kunjungan tanpa satu pun aksi bermakna (apathy). */
  apathy: number
  /** Pasien auto-resolve yang bermasalah karena dilewatkan — pakan akurasi UKP. */
  autoBermasalah: number
  /** Hari stamina habis total (pakan burnout/resiliensi). */
  hariKelelahan: number
  karmaTerjadi: number
  karmaDicegah: number
}

export interface DexEntry {
  kasusId: string
  ditangani: number
  benar: number
  /** Bintang penguasaan 0-3 (Leitner-lite); meluntur bila lama tak dilatih. */
  bintang: number
  terakhirHari: number
}

/* ---------------------------------------------------------------------------
 * Action log — sumber kebenaran
 * ------------------------------------------------------------------------- */

export interface LogEntry {
  hari: number
  blok: Blok
  aksi: string // Action.type
  detail?: string
}

/* ---------------------------------------------------------------------------
 * ROOT STATE
 * ------------------------------------------------------------------------- */

export type LayarGame = 'meja' | 'klinik' | 'peta' | 'kunjungan' | 'dex' | 'rapor'

export interface GameState {
  /** Versi skema save. */
  versi: 1
  seed: number
  namaDokter: string
  hari: number // 1..90
  blok: Blok
  /** Stamina 0-6 pip. */
  stamina: number
  /** Burnout 0-100. */
  burnout: number

  klinik: {
    /** Antrian pasien playable hari ini (kasus dipilih Director). */
    antrian: PasienAktif[]
    aktif?: EncounterState
    /** Penilaian encounter hari ini (untuk debrief malam). */
    selesaiHariIni: PenilaianEncounter[]
    /** Ringkasan pasien auto-resolve hari ini. */
    autoHariIni: { jumlah: number; bermasalah: number }
  }

  desa: {
    keluarga: Record<string, KeluargaState>
    kader: Record<string, KaderState>
    rw: RwState[]
    /** Roster keluarga binaan (id) — maks 8 di slice. */
    binaan: string[]
    /** Surveilans balik UKP→UKM: diagnosis menular per RW, jendela 14 hari. */
    surveilans: { hari: number; rw: number; kasusId: string }[]
    /** Penghitung drift keluarga rawan per pekan (cap 2 kejadian/minggu). */
    drift: { minggu: number; jumlah: number }
  }

  kunjungan?: KunjunganState
  /** Hasil kunjungan hari ini (untuk debrief). */
  hasilKunjunganHariIni?: HasilKunjungan

  inbox: Surat[]
  jadwal: JadwalItem[]
  tally: SkorTally
  dex: Record<string, DexEntry>
  log: LogEntry[]

  /** Kapitasi berjalan (Rp) — ekonomi ringkas slice. */
  kapitasi: number

  /** Refleksi malam yang ditulis pemain (per hari). */
  refleksi: Record<number, string>

  /** Flag progres/tutorial/unlock. */
  flags: Record<string, boolean>

  /** Layar yang sedang dilihat (UI state ikut disimpan agar resume mulus). */
  layar: LayarGame

  /** Game selesai? (D90 lock / slice: D7 rekap) */
  tamat?: { hari: number; grade: string }
}

/* ---------------------------------------------------------------------------
 * Skor 4 dimensi (hasil hitung dari tally — lihat scoring.ts)
 * ------------------------------------------------------------------------- */

export interface Skor4Dimensi {
  ukp: number // 0-35
  ukm: number // 0-35
  manajemen: number // 0-15
  resiliensi: number // 0-15
  total: number // 0-100
  grade: 'A' | 'B' | 'C' | 'D'
  gradeLabel: string
  /** Komponen penjelas untuk UI Rapor. */
  rincian: {
    akurasiDiagnosis: number // 0-100
    rrns: number // % rujukan non-spesialistik
    guillotine: number // 0-1 multiplier
    iksDesa: number // 0-1
    kualitasMi: number // 0-100
    kalibrasi: number // 0-100 (stempel dua tinta)
  }
}
