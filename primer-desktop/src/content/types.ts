/**
 * KONTRAK DATA KONTEN KLINIS — satu-satunya bentuk kasus yang dikenal engine.
 * Semua konten (kasus poli, IGD, keluarga binaan) ditulis terhadap tipe ini.
 * Pelajaran repo lama: kontrak implisit = sumber bug #1. Di sini semuanya eksplisit.
 */

export type Skdi = '1' | '2' | '3A' | '3B' | '4A'

export type KategoriKasus =
  | 'infeksi'
  | 'respirasi'
  | 'pencernaan'
  | 'kulit'
  | 'kardiovaskular'
  | 'metabolik'
  | 'muskuloskeletal'
  | 'saraf'
  | 'mata'
  | 'tht'
  | 'gigi'
  | 'kia'
  | 'jiwa'
  | 'gawat'

export type JenisKelamin = 'L' | 'P'

/** Persona pasien — mengubah gaya bahasa jawaban anamnesis. */
export type Persona = 'polos' | 'terpelajar' | 'skeptis' | 'cemas' | 'lansia' | 'wali_anak'

export type KategoriAnamnesis = 'keluhan_utama' | 'rps' | 'rpd' | 'rpk' | 'sosial'

export interface PertanyaanAnamnesis {
  id: string
  kategori: KategoriAnamnesis
  /** Teks pertanyaan yang diucapkan dokter. */
  tanya: string
  /** Jawaban baku pasien. */
  jawab: string
  /** Variasi jawaban per persona (opsional; fallback ke `jawab`). */
  variasi?: Partial<Record<Persona, string>>
  /** Pertanyaan esensial: wajib ditanya untuk skor anamnesis penuh. */
  esensial?: boolean
  /** Distraktor: tidak relevan untuk kasus ini — menggerus kesabaran pasien. */
  distraktor?: boolean
  /** Petunjuk dimensi OLDCARTS yang dicakup (untuk skoring kedalaman). */
  oldcarts?: ('onset' | 'lokasi' | 'durasi' | 'karakter' | 'agravasi' | 'radiasi' | 'waktu' | 'keparahan' | 'penyerta')[]
}

export type RegionFisik =
  | 'umum'
  | 'kepala_leher'
  | 'mata'
  | 'tht_mulut'
  | 'toraks_paru'
  | 'jantung'
  | 'abdomen'
  | 'ekstremitas'
  | 'kulit'
  | 'neurologis'

export interface TemuanFisik {
  region: RegionFisik
  /** Deskripsi temuan saat diperiksa. */
  temuan: string
  /** Apakah region ini relevan (memberi sinyal diagnostik) untuk kasus ini. */
  relevan: boolean
}

export interface PemeriksaanLab {
  /** id item dari katalog lab (mis. 'darah_rutin', 'gds', 'widal'). */
  id: string
  /** Hasil pada kasus ini. */
  hasil: string
  flag: 'normal' | 'rendah' | 'tinggi' | 'abnormal'
  /** Apakah pemeriksaan ini relevan/terindikasi untuk kasus ini. */
  relevan: boolean
}

export interface TandaVital {
  td?: string
  nadi?: number
  rr?: number
  suhu?: number
  spo2?: number
  gds?: number
}

export interface Tatalaksana {
  /** Obat yang IDEALNYA semua ada — kombinasi komplementer (mis. antibiotik +
   * antipiretik, oralit + zinc). Dinilai sebagai AND (semua menambah skor). */
  obatBenar: string[]
  /**
   * Kelompok obat ALTERNATIF setara — tiap sub-array = "pilih salah satu"
   * (mis. [['loratadin','setirizin']] = beri salah satu antihistamin gen-2).
   * Meresepkan ≥1 anggota memuaskan slot itu; anggota lain TIDAK dihukum
   * sebagai obat di luar tatalaksana. Mencegah skor menghukum monoterapi yang
   * benar & mencegah "hadiah" untuk polifarmasi obat sekelas.
   */
  obatAlternatif?: string[][]
  /** Jebakan umum: obat yang tampak masuk akal tapi salah, dengan alasan pedagogis. */
  obatSalahUmum?: { id: string; alasan: string }[]
  /** Prosedur/tindakan yang tepat (id dari katalog tindakan). */
  prosedur?: string[]
  /** Topik edukasi wajib (id dari katalog edukasi). */
  edukasi: string[]
}

export interface KonsekuensiKlinis {
  /** Narasi bila salah tatalaksana / tidak tuntas. */
  narasi: string
  /** Pasien kembali memburuk dalam rentang hari ini. */
  kembaliHariMin: number
  kembaliHariMax: number
  /** Deskripsi kondisi saat kembali (dipakai generator follow-up). */
  kondisiKembali: string
  /** Rujukan guideline nyata (Permenkes/WHO/PERKENI...) untuk debrief. */
  guideline?: string
}

export interface KasusKlinis {
  id: string
  nama: string
  icd10: string
  skdi: Skdi
  kategori: KategoriKasus
  /** Termasuk daftar 144 penyakit wajib tuntas FKTP. */
  fktp144: boolean
  /** Kasus yang seharusnya DIRUJUK (di luar kompetensi 4A / butuh stabilisasi-rujuk). */
  harusDirujuk: boolean
  /**
   * Bobot epidemiologi FKTP nyata (guardrail KONTEN_BALANCE #1): top-20 diagnosis
   * ≈80% kunjungan. tinggi ×3 · sedang ×1.5 (default) · rendah ×0.6.
   */
  prevalensi?: 'tinggi' | 'sedang' | 'rendah'
  /** Spesialisasi RS yang dibutuhkan bila dirujuk (utk pemilihan RS SISRUTE). */
  spesialisRujukan?: SpesialisasiRs
  /** Kalimat keluhan pembuka pasien. */
  keluhanUtama: string
  demografi: { usiaMin: number; usiaMax: number; jenisKelamin?: JenisKelamin }
  vital: TandaVital
  anamnesis: PertanyaanAnamnesis[]
  pemeriksaanFisik: TemuanFisik[]
  lab: PemeriksaanLab[]
  /** ICD-10 diagnosis banding yang masuk akal (untuk pilihan & skoring). */
  diagnosisBanding: string[]
  tatalaksana: Tatalaksana
  /** Mutiara klinis ber-tag guideline, muncul di debrief. */
  clue: string
  konsekuensi?: KonsekuensiKlinis
  /** Sebagian pasien kasus ini membawa alergi yang menjebak terapi standar. */
  alergiTrap?: { kelas: string; obatTerlarang: string[]; alternatifBenar: string[] }
}

/* ---------------------------------------------------------------------------
 * IGD — kasus gawat darurat (M3.14): interrupt event turn-based.
 * Stabilitas 0-100; tiap langkah pemain memilih SATU tindakan. Salah = pasien
 * memburuk. Stabilitas habis → Kode Biru (RJP) → selamat atau Kode Hitam.
 * ------------------------------------------------------------------------- */

export interface PilihanIgd {
  id: string
  label: string
  benar: boolean
  /** Perubahan stabilitas (benar biasanya +15..+25; salah −15..−30). */
  efekStabilitas: number
  /** Umpan balik klinis singkat setelah dipilih. */
  respons: string
}

export interface LangkahIgd {
  id: string
  /** Narasi kondisi pasien pada langkah ini (vital memburuk/membaik dsb). */
  narasi: string
  pilihan: PilihanIgd[]
}

export interface KasusIgd {
  id: string
  nama: string
  icd10: string
  skdi: Skdi
  /** Narasi kedatangan dramatis. */
  pembuka: string
  demografi: { usiaMin: number; usiaMax: number; jenisKelamin?: JenisKelamin }
  vitalAwal: TandaVital
  /** Stabilitas awal 0-100 (biasanya 45-60 — genting tapi tertolong). */
  stabilitasAwal: number
  langkah: LangkahIgd[]
  /** Disposisi benar setelah stabil. */
  disposisiBenar: 'rujuk' | 'pulang'
  spesialisRujukan?: SpesialisasiRs
  clue: string
}

/* ---------------------------------------------------------------------------
 * Rujukan berjenjang (M3.13) — RS tujuan SISRUTE
 * ------------------------------------------------------------------------- */

export type SpesialisasiRs =
  | 'penyakit_dalam'
  | 'bedah'
  | 'anak'
  | 'obgyn'
  | 'saraf'
  | 'mata'
  | 'tht'
  | 'jiwa'
  | 'paru'

export interface RumahSakit {
  id: string
  nama: string
  /** Kelas RS (D/C/B) — makin tinggi makin lengkap, makin jauh. */
  kelas: 'D' | 'C' | 'B'
  /** Jarak tempuh ambulans (menit) — pertimbangan kasus emergensi. */
  jarakMenit: number
  spesialisasi: SpesialisasiRs[]
  /** Kapasitas dasar bed rujukan/hari (ketersediaan riil di-roll harian). */
  bedDasar: number
}

/* ---------------------------------------------------------------------------
 * Formularium & katalog
 * ------------------------------------------------------------------------- */

export interface Obat {
  id: string
  nama: string
  kelas: string
  /** Nama lain/ejaan Inggris/singkatan lazim — dipakai pencarian formularium
   * (mis. CTM ← chlorpheniramine/klorfeniramin; tablet Fe ← tablet tambah darah). */
  sinonim?: string[]
  /** Golongan alergi (utk firewall): 'penisilin' | 'nsaid' | 'sulfa' | ... */
  golonganAlergi?: string
  sediaan: string
  hargaBeli: number
  hargaJual: number
  fornas: boolean
  /** Antibiotik? (untuk metrik stewardship — meresepkan tanpa indikasi dicatat) */
  antibiotik?: boolean
}

export interface ItemLab {
  id: string
  nama: string
  biaya: number
  nilaiNormal: string
  /** Hasil baru tersedia besok pagi (BTA, Widal, kultur) — keputusan interim. */
  hasilBesok?: boolean
}

export interface TopikEdukasi {
  id: string
  nama: string
}

export interface Tindakan {
  id: string
  nama: string
  icd9?: string
  biaya: number
}

/* ---------------------------------------------------------------------------
 * UKM — Keluarga binaan (redesign: 20 keluarga bernama, bukan 200 klon)
 * ------------------------------------------------------------------------- */

/** 12 indikator PIS-PK Permenkes 39/2016 (kanonik). */
export type IndikatorPisPk =
  | 'kb'
  | 'persalinan_faskes'
  | 'imunisasi_dasar'
  | 'asi_eksklusif'
  | 'pantau_tumbuh_kembang'
  | 'tb_berobat_standar'
  | 'hipertensi_berobat'
  | 'jiwa_tidak_ditelantarkan'
  | 'tidak_merokok'
  | 'jkn'
  | 'air_bersih'
  | 'jamban_sehat'

export interface AnggotaKeluarga {
  nama: string
  usia: number
  jenisKelamin: JenisKelamin
  peran: 'kepala' | 'istri' | 'suami' | 'anak' | 'lansia'
  /** Kondisi kesehatan yang relevan (id kasus / kondisi kronis). */
  kondisi?: string[]
}

/** Status indikator per keluarga: ya / tidak / tidak berlaku (N/A demografis). */
export type StatusIndikator = 'ya' | 'tidak' | 'na'

export interface KeluargaBinaan {
  id: string
  namaKeluarga: string
  rw: number
  /** Jarak tempuh dari Puskesmas (menit perjalanan) — SDOH geografis sederhana. */
  jarakMenit: number
  ekonomi: 'mampu' | 'cukup' | 'rentan' | 'miskin'
  anggota: AnggotaKeluarga[]
  /** Kondisi awal 12 indikator (dengan N/A demografis yang benar). */
  indikatorAwal: Partial<Record<IndikatorPisPk, StatusIndikator>>
  /** Arc naratif keluarga (kunjungan berseri). */
  arc: ArcKeluarga
}

/** Tahap kesiapan berubah (Transtheoretical Model, disederhanakan 4 tahap). */
export type TahapTtm = 'prekontemplasi' | 'kontemplasi' | 'aksi' | 'pemeliharaan'

export type Hambatan = 'kapabilitas' | 'kesempatan' | 'motivasi'

/* -- Babak 1: SALAM & OBSERVASI (hidden-object bermakna) -------------------- */

export interface HotspotRumah {
  id: string
  /** Label singkat (muncul saat ditemukan): 'Asbak penuh di meja tamu'. */
  label: string
  /** Narasi temuan 1-2 kalimat. */
  narasi: string
  /** Indikator PIS-PK yang TERVERIFIKASI oleh temuan ini (nilai sebenarnya). */
  indikator?: IndikatorPisPk
  /** Posisi di ilustrasi rumah (persen 0-100 dari kiri-atas). */
  x: number
  y: number
}

/* -- Babak 2: WAWANCARA MI/OARS ---------------------------------------------- */

export interface PilihanDialog {
  id: string
  /** Teks yang diucapkan dokter. */
  teks: string
  gaya: 'empati' | 'refleksi' | 'edukasi' | 'konfrontasi'
  /** Respons warga (jujur / default). */
  respons: string
  /** Efek trust -2..+2. Trust naik dari KUALITAS pilihan, bukan frekuensi. */
  efekTrust: number
  /** Tepat secara teknik MI? (dinilai, muncul di debrief) */
  tepat: boolean
  catatanPedagogis?: string
  /**
   * GERBANG KEJUJURAN: pilihan ini menyentuh indikator sensitif.
   * Bila trust < ambang → warga menjawab `responsBohong` dan data yang tercatat
   * SALAH (kontradiksi bisa ketahuan lewat hotspot babak 1).
   */
  ungkap?: {
    indikator: IndikatorPisPk
    ambangTrust: number
    responsBohong: string
  }
}

export interface NodeDialog {
  id: string
  /** Narasi/situasi sebelum pilihan. */
  narasi: string
  pilihan: PilihanDialog[]
}

/* -- Babak 4: RESEP SOSIAL ----------------------------------------------------- */

export interface KartuIntervensi {
  id: string
  nama: string
  deskripsi: string
  /** Intervensi ini bekerja bila hipotesis hambatan pemain BENAR & cocok. */
  cocokUntuk: Hambatan[]
  /** Efek naratif bila dipilih. */
  hasilNarasi: string
}

export interface SkenarioKunjungan {
  id: string
  judul: string
  /** Narasi pembuka kedatangan (sebelum babak observasi). */
  pembuka: string
  /** Indikator PIS-PK yang digarap skenario ini. */
  target: IndikatorPisPk[]
  /** Hambatan SEBENARNYA keluarga (ground truth COM-B). */
  hambatanSebenarnya: Hambatan
  /** Petunjuk hambatan tersebar di observasi+wawancara (untuk debrief). */
  petunjukHambatan: string
  /** Babak 1: hotspot observasi rumah (4-7). */
  hotspot: HotspotRumah[]
  /** Babak 2: node dialog berurutan (3-5). */
  dialog: NodeDialog[]
  /** Babak 4: kartu intervensi (3-4, salah satunya cocok). */
  intervensi: KartuIntervensi[]
  /** Narasi penutup bila kunjungan berhasil / gagal. */
  penutupBerhasil: string
  penutupGagal: string
  /** Konsekuensi klinis bila keluarga diabaikan (karma loop UKM→UKP). */
  karma?: {
    /** Kasus klinis yang muncul di antrian saat jatuh tempo. */
    kasusId: string
    /** Nama anggota yang jatuh sakit (index di anggota keluarga). */
    anggotaIndex: number
    /** Jatuh tempo relatif terhadap hari mulai game. */
    jatuhTempoHari: number
    narasi: string
  }
}

export interface ArcKeluarga {
  /** Ringkasan cerita keluarga (1-2 kalimat, muncul di kartu keluarga). */
  sinopsis: string
  /** Kunjungan berseri — tiap entri adalah satu skenario kunjungan. */
  kunjungan: SkenarioKunjungan[]
  /** Epilog arc. */
  epilogBerhasil: string
  epilogGagal: string
}

/* ---------------------------------------------------------------------------
 * Kader (scout) & wilayah
 * ------------------------------------------------------------------------- */

export interface KaderProfil {
  id: string
  nama: string
  rw: number
  /** 45-90: peluang data akurat per indikator. */
  ketelitian: number
  /** Indikator yang bias dilaporkan salah oleh kader ini. */
  bias: IndikatorPisPk[]
  /** Catatan persona untuk surat laporan ('sungkan menanyakan KB'). */
  persona: string
}

export interface RwProfil {
  nomor: number
  nama: string
  jarak: 'dekat' | 'sedang' | 'terpencil'
  totalKk: number
}
