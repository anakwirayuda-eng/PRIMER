/**
 * STATE ENGINE — bentuk kanonik seluruh dunia game.
 * Engine murni: tidak ada import React/DOM/Electron di folder ini.
 * Semua perubahan state HANYA lewat reducer `advance()` (lihat reducer.ts).
 */

import type {
  IndikatorPisPk,
  JenisKelamin,
  JenisPenerimaanAwal,
  JustifikasiRujuk,
  Persona,
  RegionFisik,
  StatusIndikator,
  TahapTtm,
} from '@content/types'

/* ---------------------------------------------------------------------------
 * Waktu
 * ------------------------------------------------------------------------- */

export type Blok = 'pagi' | 'siang' | 'sore'

/** M4.5 — mode stase: Karier 90 hari (bebas nilai) vs Ujian 30 hari (dinilai). */
export type ModeStase = 'karier' | 'ujian'
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
  /** Usia bulan untuk bayi <1 tahun; `usia` tetap 0 demi kompatibilitas save. */
  usiaBulan?: number
  jenisKelamin: JenisKelamin
  persona: Persona
  kasusId: string
  bpjs: boolean
  /** Alergi yang dibawa pasien (golongan, mis. 'penisilin'). Tersembunyi sampai ditanya/RM. */
  alergi: string[]
  /**
   * Tier-1 #7 (audit CODEX 2026-07-11): faktor risiko INTERAKSI OBAT (bukan
   * alergi) yang dibawa pasien, mis. 'pde5_inhibitor' — analog `alergi` tapi
   * utk kasus ber-`interaksiTrap`. Tersembunyi sampai ditanya/anamnesis.
   */
  faktorRisiko: string[]
  /** RW tempat tinggal pasien — pakan surveilans balik UKP→UKM. */
  rw: number
  /** Kaitan ke keluarga binaan (karma loop dua arah). */
  keluargaId?: string
  /** Pasien dari keluarga yang pernah dikunjungi → lebih jujur/terbuka. */
  bonusTrust: boolean
  /** Pasien follow-up konsekuensi (kembali memburuk). */
  followUpDari?: string
  /**
   * Pasien Program Rujuk Balik (M3.13): sudah distabilkan RS, kembali untuk
   * kontrol lanjutan di FKTP — memulangkan dengan obat lanjutan = TEPAT,
   * merujuk ulang = pemborosan berjenjang.
   */
  prb?: boolean
  /**
   * Fix #14 (audit CODEX 2026-07-11, adjudikasi 2026-07-12): id lab yg
   * hasilnya SUDAH TERSEDIA saat pasien ini kembali utk evaluasi (dari
   * observasi hari sebelumnya) — buatEncounter (clinic.ts) pra-isi
   * labDipesan/labTersedia dari field ini, dokter langsung melihat hasilnya
   * di LembarPeriksa tanpa perlu memesan ulang.
   */
  labSudahTersedia?: string
  /**
   * M11 #4 Tingkat A (2026-07-16): varian presentasi kosmetik yang dipilih
   * untuk pasien INI (lihat `VarianPresentasiTingkatA` di content/types.ts).
   * `undefined` atau `'_dasar'` = presentasi dasar kasus tanpa perubahan
   * (kompatibel mundur; save lama tanpa field ini berperilaku identik).
   * Diterapkan via `kasusEfektif()` (clinic.ts) di setiap titik baca konten
   * klinis kasus aktif — TIDAK PERNAH memengaruhi harusDirujuk/tatalaksana/
   * konsekuensi (dijamin struktural oleh tipe varian itu sendiri).
   */
  varianId?: string
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
  /** id pertanyaan yang sudah ditanya (dgn jawaban sungguhan), berurutan. */
  ditanya: string[]
  /**
   * id pertanyaan yang diklik SETELAH sabar habis (DeepThink #2) — jawaban
   * ketus, TIDAK memberi kredit esensial/OLDCARTS (spt `ditanya`), tapi klik
   * distraktor tetaplah instingsi buruk yang tetap dihukum di nilaiEncounter.
   * Terpisah dari `ditanya` supaya kredit & penalti bisa dibedakan tanpa
   * merusak fix "sabar-habis tak beri kredit anamnesis" yang sudah ada.
   */
  ditanyaKetus: string[]
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
  /** Prosedur/tindakan klinis yang dilakukan (mis. nebulisasi, Epley, tampon). */
  tindakan: string[]
  /** Percobaan resep yang diblokir firewall alergi (untuk telemetri pedagogis). */
  firewallTerpicu: number
  disposisi?: Disposisi
  sbar?: SbarIsi
  /** M10.5 §3a: alasan rujukan di luar `harusDirujuk` (validity-check di clinic.ts). */
  justifikasiRujuk?: JustifikasiRujuk
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
  /**
   * CODEX audit (2026-07-12, temuan #1): obat berbahaya (obatSalahUmum/
   * interaksiTrap) BENAR-BENAR diresepkan — dulu cuma variabel lokal di
   * `nilaiEncounter`, mengunci `capGrade` per-encounter tapi tak pernah
   * menyentuh tally/skor formal. Beda dari `firewallTerpicu` di bawah:
   * ini obat yang SAMPAI ke pasien.
   */
  obatBerbahaya: boolean
  /** Tindakan invasif/teknik berbahaya benar-benar dilakukan pada pasien. */
  tindakanBerbahaya: boolean
  /**
   * CODEX audit (2026-07-12, temuan #13B): percobaan resep kontraindikasi
   * alergi yang diblokir firewall (poka-yoke, `clinic.ts` TAMBAH_OBAT) — obat
   * TAK PERNAH sampai ke pasien, tapi sebelumnya nol konsekuensi formal sama
   * sekali (murni badge UI). Root cause sama dgn `obatBerbahaya`: sinyal
   * keselamatan tak tersambung ke `scoring.ts`.
   */
  firewallTerpicu: boolean
  /**
   * CODEX audit pasca-GM (2026-07-13, temuan #3): kasus dgn `konfirmasiWajib`
   * (TB: BTA/TCM; malaria: RDT) yang didiagnosis/diterapi presumtif TANPA
   * hasil lab konfirmasi tersedia — dulu hanya meng-cap `skorPemeriksaan`
   * (bobot 10%, ≤5 poin dari nilaiTotal), tak pernah menyentuh capGrade huruf
   * atau Dex "kuasai" (reducer.ts). Diekspos di sini persis pola
   * obatBerbahaya/firewallTerpicu supaya kedua konsumen bisa menggerbangnya.
   */
  konfirmasiTakTerpenuhi: boolean
  /** Tindakan stabilisasi wajib belum dilakukan sebelum pasien dirujuk. */
  stabilisasiTerlewat: boolean
  /**
   * Terapi penyelamat nyawa (`terapiKritis`) belum diberikan (audit CODEX
   * 2026-07-16 #2). Digerbang di clinic.ts (cap D) & dibaca reducer untuk
   * Dex "kuasai" + konsekuensi. Kasus tanpa `terapiKritis` selalu false.
   */
  terapiKritisTerlewat: boolean
  labTakRelevan: number
  sbarSkor?: number // 0-100 bila merujuk
  /** Grade huruf ringkas untuk UI. */
  grade: 'A' | 'B' | 'C' | 'D'
  /** Clue EBM kasus, ditampilkan di debrief. */
  clue: string
  /** Konsekuensi terjadwal? (id jadwal bila salah tatalaksana berbuntut) */
  konsekuensiDijadwalkan: boolean
  /**
   * CODEX: encounter tutorial (imun skor, lihat reducer.ts case DISPOSISI)
   * tetap menghitung skorAnamnesis/Pemeriksaan/Terapi/Edukasi & grade APA
   * ADANYA dari jalur tuntunan minimal — bisa jatuh ke grade D meski pemain
   * 100% mengikuti sorotan. Field ini menandai debrief agar UI (PanelHasil)
   * menyembunyikan rincian skor yang menghukum & tampilkan framing netral.
   */
  tutorialLatihan?: boolean
  /**
   * DeepThink triangulasi (2026-07-05, docs/DEEPTHINK_EDUKASI_KRITIS.md, O6):
   * id topik `edukasiKritis` yang TERLEWAT (kosong bila tak ada/semua
   * tercakup). Debrief adalah instrumen *formative assessment* pasca-skor-
   * terkunci (bukan feedback instan saat memilih) — transparansi di sini
   * konsisten preseden `clue`/rincian skor yang sudah tampil post-hoc.
   */
  edukasiKritisTerlewat: string[]
}

/* ---------------------------------------------------------------------------
 * Desa, keluarga, kader (UKM)
 * ------------------------------------------------------------------------- */

// #4 outcome-window (audit CODEX UKM 2026-07-16): 'janji' = perubahan perilaku
// yang DIJANJIKAN warga saat arc tamat (IKS naik optimis lewat `status`), tapi
// `statusSebenarnya` belum berubah — diverifikasi tertunda (verifikasi_pispk):
// ditepati → jadi 'dokter'/ya permanen; ingkar → status balik ke sebenarnya.
export type SumberData = 'dokter' | 'kader' | 'belum' | 'janji'

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
  // Fix #5b (audit CODEX 2026-07-11): partialDitunda menghitung berapa kali
  // hasil 'partial' sudah menunda karma ini — tanpa batas, pemain bisa
  // deterministik memilih hipotesis-benar+kartu-salah tiap kunjungan utk
  // menunda karma tanpa akhir. Dibatasi BATAS_PARTIAL_KARMA (reducer.ts).
  karmaAktif?: { jadwalId: string; jatuhTempoHari: number; partialDitunda?: number }
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
  /** Bonus IKS persisten dari program/kegiatan lapangan (M2) — ikut dihitung kader. */
  bonusIks: number
  /**
   * CODEX audit (2026-07-12, temuan #8): estimasi proporsi KK statistik
   * 'sehat' (`kader.ts`) di-roll SEKALI per RW lalu dipersist di sini —
   * dulu di-reroll ULANG setiap hari (RNG reseed per-hari) walau
   * `kkTersurvei` sudah plateau nol data baru, membuat `iks` hanyut
   * ±0.02-0.03/hari murni dari noise dan bisa melompati ambang pengali
   * kapitasi 0.20/0.30 tanpa aksi pemain. `undefined` = belum pernah di-roll.
   */
  proporsiBaselineRoll?: number
}

/* ---------------------------------------------------------------------------
 * Kunjungan rumah — state machine 4 babak
 * ------------------------------------------------------------------------- */

export type BabakKunjunganFase =
  | 'penerimaan'
  | 'observasi'
  | 'wawancara'
  | 'diagnosis_perilaku'
  | 'resep_sosial'
  | 'ingatkan'
  | 'selesai'

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
  /** Hanya terisi bila event penerimaan awal aktif pada kontak pertama. */
  penerimaanAwal?: JenisPenerimaanAwal
  responsPenerimaan?: 'hormati' | 'memaksa'
  hipotesis?: 'kapabilitas' | 'kesempatan' | 'motivasi'
  intervensiDipilih?: string
  ingatkanDipilih?: string
  /**
   * M11 #5 B1 (2026-07-17): varian presentasi Tingkat-A dipilih SEKALI saat
   * kunjungan dibuat (`buatKunjungan`), bertahan seumur kunjungan itu.
   * undefined/'_dasar' = presentasi dasar. Padanan `PasienAktif.varianId`.
   */
  varianId?: string
}

/* ---------------------------------------------------------------------------
 * Kegiatan lapangan terjadwal (M2) — Posyandu / Prolanis / Respons KLB
 * Satu mesin sesi generik: dek kartu keputusan yang dijawab berurutan.
 * ------------------------------------------------------------------------- */

export type JenisKegiatan = 'posyandu' | 'prolanis' | 'klb'

export interface PilihanKegiatan {
  id: string
  label: string
  benar: boolean
  /** Umpan balik singkat setelah memilih (pedagogis, muncul di kartu). */
  respons: string
}

export interface KartuKegiatan {
  id: string
  judul: string
  narasi: string
  pilihan: PilihanKegiatan[]
  /** Kaitan peserta Prolanis (untuk efek parameter pasca-sesi). */
  pesertaId?: string
  /**
   * M11 Decision #2 (2026-07-16): sitasi pedoman resmi kartu ini — sejajar
   * `KasusKlinis.panduanResmi` (UKP) / `SkenarioKunjungan.panduanResmi`
   * (UKM kunjungan). Display-only.
   */
  sumber?: string
}

export interface KegiatanState {
  jenis: JenisKegiatan
  /** RW lokasi (posyandu/klb). */
  rw?: number
  /** Kasus kluster yang direspons (klb). */
  kasusId?: string
  kartu: KartuKegiatan[]
  /** Index kartu aktif. */
  index: number
  jawaban: { kartuId: string; pilihanId: string; benar: boolean }[]
}

/** Peserta program Prolanis (penyakit kronis HT/DM) — roster bulanan. */
export interface PesertaProlanis {
  id: string
  nama: string
  usia: number
  jenisKelamin: JenisKelamin
  rw: number
  /**
   * M10.b: keluarga binaan asal peserta — komplikasi prolanis yang berujung
   * di poli harus bisa dirunut balik ke keluarganya (jembatan UKM→UKP utuh).
   * Opsional demi kompatibilitas save lama (roster pra-M10.b tanpa field ini).
   */
  keluargaId?: string
  jenis: 'ht' | 'dm'
  /** Parameter kontrol: sistolik (ht) atau GDS (dm). */
  param: number
  /** Sesi berturut-turut dengan parameter tak terkontrol → jembatan UKP. */
  takTerkontrolBerturut: number
}

export type FokusProgram = 'psn' | 'phbs' | 'skrining'

export type HasilAkhirKunjungan =
  | 'berhasil'
  | 'partial'
  | 'gagal'
  | 'diusir'
  | 'ditolak_total'
  | 'diterima_terpaksa'

export interface HasilKunjungan {
  keluargaId: string
  skenarioId: string
  /** Sumber tampilan kanonik; field legacy di bawah tetap untuk kompatibilitas. */
  hasilAkhir: HasilAkhirKunjungan
  berhasil: boolean
  diusir: boolean
  hipotesisBenar: boolean
  trustDelta: number
  /** Kualitas MI 0-100 (proporsi pilihan tepat). */
  kualitasMi: number
  /** Kualitas komunikasi gabungan; sama dengan MI pada skenario legacy. */
  kualitasSaji: number
  /** Hanya ada pada skenario yang memiliki babak Ingatkan. */
  kualitasIngatkan?: number
  /** Indikator yang terverifikasi dokter selama observasi. */
  indikatorTerverifikasi: IndikatorPisPk[]
  narasiPenutup: string
  /**
   * Gradasi hasil (M1.1 — bridge bertingkat, port processUKPBridge lama):
   * berhasil = hipotesis & intervensi tepat; partial = salah satunya tepat
   * (karma tertunda); gagal = keduanya salah / diusir (karma dipercepat).
   */
  tingkat?: 'berhasil' | 'partial' | 'gagal'
  /** Jeda penutupan kontak awal sah; tidak dipakai hasil substantif. */
  ulangDalamHari?: number
  /** SDOH armor aktif: keluarga miskin/rentan menahan trust bila diagnosis meleset. */
  armorAktif?: boolean
  /** Catatan penulis skenario utk pilihan yang meleset — bahan debrief sore
   * (audit CODEX UKM 2026-07-16 #10; maks 3). */
  catatanPedagogis?: string[]
}

/* ---------------------------------------------------------------------------
 * IGD (M3.14) — sesi gawat darurat turn-based
 * ------------------------------------------------------------------------- */

// CODEX audit (2026-07-12, temuan #2): `pasca_rosc` ditambahkan — dulu ROSC
// (`rjpIgd` berkualitas:true) langsung lompat ke 'disposisi', padahal komentar
// kode ITU SENDIRI (igd.ts) menjanjikan "stabilisasi lanjutan tetap berisiko
// nyata", sesuatu yang tak pernah dibangun. Tanpa titik keputusan ini, rujukan
// BENAR (disposisiBenar SEMUA kasus IGD = 'rujuk') selalu jatuh di bawah
// AMBANG_STABIL_RUJUK dan mati dalam perjalanan — dead-end deterministik.
export type FaseIgd = 'langkah' | 'kode_biru' | 'pasca_rosc' | 'disposisi' | 'selesai'

export interface IgdState {
  kasusId: string
  pasienNama: string
  usia: number
  usiaBulan?: number
  jenisKelamin: JenisKelamin
  rw: number
  fase: FaseIgd
  /** Index langkah aktif. */
  langkahIndex: number
  /** Stabilitas pasien 0-100 — habis = Kode Biru. */
  stabilitas: number
  jawaban: { langkahId: string; pilihanId: string; benar: boolean }[]
  /** Hasil akhir (diisi saat selesai). */
  hasil?: 'stabil' | 'meninggal'
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
  | 'igd'
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
  | 'verifikasi_pispk'

export interface JadwalItem {
  id: string
  hari: number
  jenis: JenisJadwal
  /** Payload longgar namun bertipe per jenis (didiskriminasi di reducer). */
  labId?: string
  pasienId?: string
  kasusId?: string
  keluargaId?: string
  /** #4: indikator yang dijanjikan warga, menunggu verifikasi outcome. */
  indikatorJanji?: IndikatorPisPk[]
  catatan?: string
  /** Identitas pasien yang kembali — "konsekuensi bernama" butuh nama yang sama. */
  nama?: string
  usia?: number
  usiaBulan?: number
  jenisKelamin?: 'L' | 'P'
  rw?: number
  /**
   * M10.b (dossier §43): identitas pasien kembali harus UTUH — bpjs (ekonomi:
   * umum bayar retribusi ke kas, BPJS membakar kapitasi) & persona (suara
   * anamnesis) dulu TAK dibawa → di-roll ulang tiap kembali, orang yang sama
   * bisa berganti status pembiayaan & gaya bicara antar-kunjungan.
   */
  bpjs?: boolean
  persona?: Persona
  /** Pasien kembali sebagai kontrol Program Rujuk Balik (M3.13). */
  prb?: boolean
  /**
   * CODEX audit pasca-GM (2026-07-13, temuan #11): jadwal `pasien_kembali`
   * KHUSUS bed-penuh (SISRUTE) — keputusan klinis SUDAH benar (rujuk, RS
   * tepat, spesialisasi cocok), cuma kapasitas bed yang menahan. Beda dari
   * pasien_kembali LAIN (boomerang FKTP, salah spesialisasi) yang genuinely
   * butuh keputusan BARU dari dokter — bed-retry menyelesaikan diri sendiri
   * secara pasif (re-roll bed di `hariBaru`, TANPA masuk antrian klinik lagi),
   * supaya totalPasien/rujukanTepat/rmLengkap/Dex TIDAK ter-kredit dobel utk
   * encounter yang sama. `rumahSakitId` menandai RS yang di-retry;
   * `bedRetryKe` menghitung berapa kali sudah diulang (batas MAKS_RETRY_BED
   * di reducer.ts, mencegah penundaan tanpa akhir bila nasib RNG buruk terus).
   */
  bedRetry?: boolean
  rumahSakitId?: string
  bedRetryKe?: number
}

/** Penghitung mentah — SATU-SATUNYA sumber skor. Diisi reducer, tak pernah UI. */
export interface SkorTally {
  totalPasien: number
  diagnosisBenar: number
  /** Jumlah rerata skor anamnesis, pemeriksaan, terapi, dan edukasi per encounter. */
  sumSkorProses: number
  /** Kalibrasi epistemik stempel dua tinta. */
  tegakBenar: number
  tegakSalah: number
  suspekBenar: number
  suspekSalah: number
  rujukanTotal: number
  rujukanNonSpesialistik: number
  /** Rujukan TEPAT (kasus wajib-rujuk dirujuk) — reward kalibrasi (M3.13). */
  rujukanTepat: number
  /** Rujukan DITOLAK RS (salah spesialisasi/bed penuh/kasus FKTP) — churn admin. */
  rujukanDitolak: number
  cowboy: number
  antibiotikTanpaIndikasi: number
  /** CODEX audit temuan #1 (2026-07-12): encounter dgn obat berbahaya BENAR-BENAR diresepkan. */
  obatBerbahaya: number
  /** Encounter dengan tindakan berbahaya yang benar-benar dilakukan. */
  tindakanBerbahaya: number
  /** CODEX audit temuan #13B (2026-07-12): encounter dgn percobaan resep kontraindikasi diblokir firewall. */
  firewallTerpicu: number
  /** Encounter rujukan yang melewatkan tindakan stabilisasi wajib. */
  stabilisasiTerlewat: number
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
  /** Kegiatan lapangan M2 (statistik & debrief; skor mengalir via IKS). */
  posyanduSesi: number
  prolanisSesi: number
  klbTuntas: number
  /** IGD (M3.14): pasien gawat stabil dgn disposisi TEPAT vs meninggal (Kode Hitam). */
  igdStabil: number
  /** Stabil tapi disposisi keliru (mis. kasus wajib-rujuk dipulangkan) — tidak dihargai skor. */
  igdSalahDisposisi: number
  igdMeninggal: number
  /**
   * CODEX audit pasca-GM (2026-07-13, temuan #9 Part A): kejadian Kode Biru
   * (henti napas/jantung, `aksiIgd` transisi ke fase 'kode_biru') — dihitung
   * SETIAP kali terjadi, terlepas dari hasil akhirnya (ROSC lalu stabil VS
   * Kode Hitam, yg sudah kena `igdMeninggal` terpisah). Sebelum field ini,
   * pasien yg selamat dari henti jantung (ROSC + stabilisasi lanjutan benar)
   * skornya IDENTIK dgn pasien yg tak pernah mengalami Kode Biru sama sekali
   * — `efekIgd` (scoring.ts) tak tahu bedanya. Nyaris mati tetap harus
   * mencatat skor SEDIKIT di bawah manajemen mulus, walau tetap jauh di atas
   * Kode Hitam.
   */
  igdKodeBiruTerjadi: number
  /** M4.20 — Rekam medis lengkap (SOAP: semua fase ≥50) — pakan akreditasi D60. */
  rmLengkap: number
  /** M4.19 — Teguran Dinkes karena kas defisit di laporan bulanan. */
  teguranDinkes: number
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

/**
 * M6 — Jurnal aksi PENUH (payload utuh, bukan cuma type seperti LogEntry):
 * bersama (seed, mode, namaDokter) + engine deterministik, jejak ini cukup
 * untuk mereplay seluruh permainan → dasar verifikasi skor dosen
 * (docs/M6_KELAS_DOSEN.md). Aksi yang DITOLAK engine ikut dicatat — replay
 * mereproduksi penolakan yang sama. Save pra-M6 tak punya field ini
 * (deserialize mengisi [] → dossier-nya "tidak dapat diverifikasi").
 */
export type JejakAksi = import('./actions').Action

/* ---------------------------------------------------------------------------
 * ROOT STATE
 * ------------------------------------------------------------------------- */

export type LayarGame = 'meja' | 'klinik' | 'peta' | 'kunjungan' | 'kegiatan' | 'igd' | 'dex' | 'rapor' | 'laporan'

export interface GameState {
  /** Versi skema save. */
  versi: 1
  /** Identitas konten build; save beda rilis hanya boleh dibaca sebagai arsip. */
  contentRelease: string
  seed: number
  namaDokter: string
  /**
   * M4.5/CODEX — NIM: identitas MENGIKAT untuk mode ujian. Seed ujian diturunkan
   * dari NIM (hashSeed('ujian', nim)) → paket per-mahasiswa terkendali & tak bisa
   * ditukar dgn nama teman. Undefined di mode karier (tak dinilai).
   */
  nim?: string
  hari: number // 1..90
  blok: Blok
  /** Stamina 0-6 pip. */
  stamina: number
  /** Burnout 0-100. */
  burnout: number

  /**
   * M4.5 — Mode stase: 'karier' (90 hari, bebas nilai) vs 'ujian' (30 hari,
   * satu-satunya yang dinilai formal — kontrak untuk M6 dashboard dosen).
   */
  mode: ModeStase
  /**
   * M4.5 — Seed KURIKULUM: menyetir APA yang diujikan (Director + IGD).
   * Karier: = seed. Ujian: seed paket (sama untuk semua mahasiswa 1 paket),
   * sementara `seed` tetap per-mahasiswa (nama/persona pasien, roll dadu).
   */
  seedKurikulum: number
  /** Id paket ujian ('paket_a'..'paket_h') — tercatat untuk laporan dosen. */
  paketUjian?: string

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
    /** Roster keluarga binaan (id) — maks MAKS_BINAAN (16 sejak M3c). */
    binaan: string[]
    /** Surveilans balik UKP→UKM: diagnosis menular per RW, jendela 14 hari. */
    surveilans: { hari: number; rw: number; kasusId: string }[]
    /** Penghitung drift keluarga rawan per pekan (cap 2 kejadian/minggu). */
    drift: { minggu: number; jumlah: number }
  }

  kunjungan?: KunjunganState
  /** Hasil kunjungan hari ini (untuk debrief). */
  hasilKunjunganHariIni?: HasilKunjungan

  /** Sesi kegiatan lapangan aktif (M2): posyandu/prolanis/klb. */
  kegiatan?: KegiatanState
  /**
   * CODEX M14 #11: hasil kegiatan lapangan terakhir (untuk KartuHasil). Dulu
   * hasil hanya hidup di event + local React state → reload menampilkan "sesi
   * tidak ditemukan" (autosave menyimpan layar:'kegiatan' tapi kegiatan:undefined).
   * Dipersist di sini (pola sama hasilKunjunganHariIni) agar bertahan reload.
   * Murni display (deterministik dari sesi) — tak di-hash, tak butuh REVISI.
   */
  hasilKegiatanTerakhir?: import('./kegiatan').HasilKegiatan

  /** Sesi IGD aktif (M3.14): gawat darurat turn-based. */
  igd?: IgdState
  /** IGD hari ini sudah tiba? (maks 1 interrupt/hari). */
  igdHariIni: boolean
  /** Slot lapangan (siang) sudah terpakai hari ini — kunjungan ATAU kegiatan. */
  lapanganTerpakai: boolean
  /** Program Prolanis: roster kronis + jadwal sesi (terbuka D30). */
  prolanis: { roster: PesertaProlanis[]; sesiBerikutHari?: number }
  /** Hari posyandu terakhir per RW (cooldown 30 hari). Kunci = String(nomor RW). */
  posyanduRwTerakhir: Record<string, number>
  /** Program wilayah agregat (M2.10): fokus mingguan menekan penularan + bonus IKS. */
  /** Triase Anggaran (M2.10, DeepThink Q4): 1 fokus terkunci per PERIODE BULANAN
   * (bukan mingguan) — memaksa mengorbankan area lain sepanjang bulan berjalan. */
  program: { fokus?: FokusProgram; rwFokus?: number; periodeDitetapkan?: number }

  /**
   * DeepThink "onboarding railroaded" (2026-07-04, keputusan user): true HANYA
   * di stase baru sampai encounter pertama tuntas DISPOSISI. Selama aktif,
   * encounter itu KEBAL skor (tally/dex/kapitasi/gudang/jadwal tak berubah)
   * — pasien latihan pertama, bukan ujian. UI (Klinik.tsx) memakai ini +
   * kasusId untuk menyalakan sorotan tutorial (lihat screens/klinik/tutorialKlinik.ts).
   */
  tutorialAktif: boolean

  inbox: Surat[]
  jadwal: JadwalItem[]
  tally: SkorTally
  /**
   * CODEX audit pasca-GM (2026-07-13, temuan #12): kunci tally yang di-backfill
   * `save.ts` migrasi-lite (save lama tanpa field ini di versi engine
   * sebelumnya). Dossier yang membawa daftar ini dianggap TAK BISA
   * diverifikasi ADIL (bukan tidak-sah) — replay-nya niscaya beda dari
   * `klaim.tally` bila field yg dibackfill nol ternyata nonzero di bawah kode
   * saat ini, dan itu bukan bukti kecurangan. Lihat verifikasi.ts.
   */
  tallyTermigrasi?: string[]
  dex: Record<string, DexEntry>
  log: LogEntry[]
  /** M6 — jurnal aksi penuh untuk replay-verifikasi (lihat JejakAksi). */
  jejak: JejakAksi[]

  /** Kapitasi berjalan (Rp) — ekonomi ringkas slice. */
  kapitasi: number

  /**
   * M4.18 — Gudang obat: stok per obat id. Resep mengonsumsi stok saat
   * disposisi; stok 0 memblokir TAMBAH_OBAT (pilih alternatif / pesan dulu).
   * Obat tanpa entri = tidak dilacak (kompat save lama).
   */
  gudang: {
    stok: Record<string, number>
    /** Pengadaan berjalan — tiba di pagi hari `tibaHari` (lead time supplier). */
    pesanan: { id: string; obatId: string; jumlah: number; tibaHari: number; biaya: number }[]
  }
  /** M4.19 — Buku kas bulan berjalan (reset tiap laporan bulanan D31/D61). */
  keuanganBulan: { belanjaObat: number; belanjaPengadaan: number }
  /** M4.20 — Hasil visitasi akreditasi D60 (dari kelengkapan rekam medis). */
  akreditasi?: 'paripurna' | 'utama' | 'madya'
  /** M4.21 — Hari pemulihan akhir pekan terakhir (sekali per pekan). */
  pemulihanTerakhirHari?: number

  /** Refleksi malam yang ditulis pemain (per hari). */
  refleksi: Record<number, string>

  /** Flag progres/tutorial/unlock. */
  flags: Record<string, boolean>

  /** Layar yang sedang dilihat (UI state ikut disimpan agar resume mulus). */
  layar: LayarGame

  /**
   * Game selesai? (D90 lock / slice: D7 rekap). `skor` = snapshot BEKU 4 dimensi
   * saat tamat (M10.5/CODEX M14 #1) — LaporanAkhir/Rapor pakai ini, BUKAN
   * hitungSkor(state) live, agar stempel/label/total tak bisa tercampur nilai
   * lama-vs-baru bila state termutasi pasca-tamat. Opsional utk kompat save lama
   * (tamat tanpa skor → jatuh ke hitungSkor live, aman krn guard reducer cegah
   * mutasi pasca-tamat pada save baru).
   */
  tamat?: { hari: number; grade: string; skor?: Skor4Dimensi }
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
    prosesKlinis: number // 0-100 (rerata mutu anamnesis, pemeriksaan, terapi, edukasi)
  }
}
