/**
 * VERIFIKASI — M6 (docs/M6_KELAS_DOSEN.md): Dossier Mahasiswa + verifier replay.
 *
 * Prinsip: skor TIDAK dipercaya dari klaim file — dihitung ulang dengan
 * mereplay jejak aksi penuh lewat engine deterministik yang sama
 * (buildInitialState + advance). HMAC hanya deterrent edit-kasar; pertahanan
 * sejati adalah replay (lihat model ancaman di dokumen desain — jujur, tanpa
 * teater keamanan).
 *
 * Murni engine: tanpa React/DOM. WebCrypto (globalThis.crypto.subtle) tersedia
 * di Electron renderer maupun Node ≥18 (vitest).
 */

import type { ContentPack } from '@content/pack'
import type { GameState, JejakAksi, Skor4Dimensi, SkorTally } from './state'
import type { Action } from './actions'
import { buildInitialState } from './init'
import { advance } from './reducer'
import { hitungSkor } from './scoring'
import { hitungBadge } from './badge'
import { hashSeed } from './core/rng'

/* ---------------------------------------------------------------------------
 * Format dossier
 * ------------------------------------------------------------------------- */

export const FORMAT_DOSSIER = 'primer-dossier' as const
export const VERSI_DOSSIER = 1 as const

export interface DossierMahasiswa {
  format: typeof FORMAT_DOSSIER
  versi: typeof VERSI_DOSSIER
  identitas: { namaDokter: string; nim?: string }
  stase: {
    mode: GameState['mode']
    paketUjian?: string
    seed: number
    seedKurikulum: number
    hari: number
    tamat?: GameState['tamat']
  }
  klaim: { skor: Skor4Dimensi; tally: SkorTally; badge: string[] }
  jejak: JejakAksi[]
  lingkungan: { versiApp: string; sidikJariPack: string }
  /** HMAC-SHA256 hex atas stringifyKanonik(dossier tanpa field ttd). */
  ttd: string
}

export interface HasilVerifikasi {
  status: 'sah' | 'tidak_sah' | 'tidak_dapat_diverifikasi'
  alasan: string[]
  ringkasan?: {
    namaDokter: string
    nim?: string
    mode: string
    paketUjian?: string
    seed: number
    hari: number
    tamat: boolean
    skorKlaim: Skor4Dimensi
    skorReplay?: Skor4Dimensi
  }
}

/* ---------------------------------------------------------------------------
 * Kanonikalisasi & sidik jari
 * ------------------------------------------------------------------------- */

/** JSON.stringify dengan kunci objek terurut rekursif — kebal urutan properti. */
export function stringifyKanonik(nilai: unknown): string {
  if (nilai === null || typeof nilai !== 'object') return JSON.stringify(nilai)
  if (Array.isArray(nilai)) return `[${nilai.map(stringifyKanonik).join(',')}]`
  const obj = nilai as Record<string, unknown>
  const kunci = Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort()
  return `{${kunci.map((k) => `${JSON.stringify(k)}:${stringifyKanonik(obj[k])}`).join(',')}}`
}

/** FNV-1a 32-bit (hex) — cukup sebagai sidik jari, bukan kriptografi. */
function fnv1a(teks: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < teks.length; i++) {
    h ^= teks.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

/**
 * Revisi SEMANTIK engine — naikkan setiap kali aturan skor/replay berubah
 * (dossier lama vs engine baru harus jatuh ke "tidak dapat diverifikasi",
 * bukan divonis TIDAK SAH palsu). Riwayat: 1 = M6 awal; 2 = M7 kuota edukasi
 * KAPASITAS_EDUKASI + formula prioritisasi min(3,|wajib|) − 15×salah;
 * 3 = sidik jari konten sensitif-isi + ikatan identitas ujian (CODEX P1);
 * 4 = phase-guard klinik (CODEX #2 §9) — aksi lompat-fase yang dulu diterima
 * kini ditolak ERROR_AKSI, mengubah hasil replay utk jejak lama yang memuat
 * urutan aksi semacam itu;
 * 5 = sidik jari kini sensitif isi IGD (pilihan-benar/efek/disposisi), kader
 * (ketelitian/bias), dan RW (jarak/totalKk) — semua penentu skor/replay yang
 * dulu tak ter-hash (CODEX ronde-baru #2);
 * 6 = ikatan identitas ujian pindah dari NAMA ke NIM — dossier lama (seed
 * berbasis nama, tanpa NIM) harus jatuh ke "tidak dapat diverifikasi", bukan
 * divonis TIDAK SAH palsu oleh cek NIM baru (CODEX ronde-baru #5);
 * 7 = prosedur klinis kini ternilai (skorTerapi memperhitungkan tindakan wajib
 * + penalti tindakan di luar rencana) — jejak lama tanpa TAMBAH_TINDAKAN untuk
 * 4 kasus prosedur mereplay ke skor terapi berbeda (CODEX ronde-baru #4);
 * 8 = triase DeepThink 5 blind spot: (a) menungguLabBesok/observasiMenungguLab
 * kini wajib lab RELEVAN; (b) klik distraktor pasca-sabar-habis (ditanyaKetus)
 * kini tetap kena penalti anamnesis; (c) antibiotikTanpaIndikasi kini memotong
 * skorTerapi (−25), bukan cuma tercatat tally; (d) SBAR copy-paste antar kolom
 * kini dihukum (−50); (e) pasien yang di-skip DAN bermasalah di antrian pagi
 * kini bisa dijadwalkan kembali (jadwal baru → jejak lama mereplay beda);
 * 9 = triase DeepThink ronde-2: (a) TETAPKAN_PROGRAM kini mengunci rwFokus
 * SEKALIGUS fokus (dulu cuma fokus, rwFokus bisa diganti harian) — jejak lama
 * yang menukar rwFokus dalam periode terkunci kini mereplay ke ERROR_AKSI; (b)
 * hitungSkor kini pakai lantai EKSPEKTASI_KUNJUNGAN (24 karier / 8 ujian) sbg
 * penyebut rasioKunjungan/kualitasMi, bukan Math.max(1,total) — dossier lama
 * dgn kunjungan sedikit mereplay ke UKM lebih rendah dari yang tercatat;
 * 10 = keputusan user DeepThink ronde-2 "Boikot Rujukan": penalti cowboy di
 * hitungSkor naik dari −2 ke −5/kejadian (guillotine gerbang kali-nol butuh
 * sampel≥3, cowboy dulu cuma potongan flat — berhenti-merujuk-total jauh
 * lebih murah drpd risiko guillotine) — dossier lama dgn tally.cowboy>0
 * mereplay ke UKP lebih rendah dari yang tercatat;
 * 11 = keputusan user DeepThink "onboarding railroaded": GameState field baru
 * `tutorialAktif` (true di stase BARU sampai DISPOSISI pertama tuntas) —
 * encounter pertama kebal SEPENUHNYA (tally/dex/kapitasi/gudang/jadwal
 * dikembalikan ke nilai sebelum encounter itu di reducer.ts case DISPOSISI).
 * Dossier LAMA (sebelum field ini ada) di-backfill `tutorialAktif: false`
 * oleh save.ts — tak retroaktif kebal — tapi REVISI naik krn semantik
 * DISPOSISI pertama kini bisa berbeda dari yang tercatat bila field ini
 * hilang/salah saat replay;
 * 12 = CODEX (2026-07-05): prosedur/tindakan klinis (nebulisasi, Epley, dst.)
 * kini ikut memotong kapitasi sesuai `biaya` katalog saat DISPOSISI (dulu
 * gratis walau sudah jadi mekanik ternilai sejak rev 7) — jejak lama dgn
 * TAMBAH_TINDAKAN mereplay ke kapitasi (dan skor Manajemen via ambang kas)
 * berbeda dari yang tercatat. Sekaligus `sidikJariPack` kini hash isi
 * `pack.tindakan` (id+biaya) — sebelumnya kategori konten ini TAK TERSENTUH
 * sama sekali oleh sidik jari, celah yang jadi genuinely berbahaya begitu
 * `biaya`-nya score-affecting (sebelum rev ini, biaya memang belum
 * mempengaruhi replay apa pun, jadi bukan lubang aktif sampai sekarang);
 * 13 = triangulasi DeepThink (2026-07-05, docs/DEEPTHINK_EDUKASI_KRITIS.md,
 * O1): kasus kini bisa punya `tatalaksana.edukasiKritis` (subset topik wajib
 * yg non-negotiable) — melewatkan satu saja meng-cap skorEdukasi ke 50,
 * meniru pola vitalDiukur→skorPemeriksaan. Jejak lama yang menyelesaikan
 * kasus edukasiKritis (dengue_df/tb_paru/diare_akut_anak/hipertensi_esensial/
 * dm_tipe2) TANPA topik itu mereplay ke skorEdukasi (dan grade) lebih rendah
 * dari yang tercatat. Bump SEKALIGUS dengan perubahan formula (bukan
 * ditunda ke akhir milestone) krn REVISI_ENGINE sudah ter-hash ke
 * `sidikJariPack` — menunda bump berarti fingerprint build lama & baru
 * IDENTIK walau semantik skor berbeda, membuka celah dossier jujur lama
 * divonis TIDAK SAH (bukan "tidak dapat diverifikasi") persis kegagalan yg
 * mekanisme ini dirancang mencegah. Field opsional & jarang: kasus tanpa
 * `edukasiKritis` (mayoritas) mereplay identik, tak terpengaruh bump ini;
 * 14 = M10.b (2026-07-06, dossier §43) identitas pasien-kembali UTUH:
 * (a) jadwal pasien_kembali kini membawa `bpjs`+`persona` asli (dulu di-roll
 * ulang tiap kembali — bpjs mengubah arah pembayaran lab/obat → kapitasi →
 * skor Manajemen); (b) pasien karma membawa bpjs dari indikator JKN
 * keluarganya saat karma menyala; (c) komplikasi prolanis selalu bpjs:true
 * (Prolanis = program BPJS); (d) `buatPasienDariKasus` menghitung persona
 * dari usia EFEKTIF (override ?? roll) — konsumsi RNG pilihPersona berubah
 * utk pasien inject lintas ambang usia (<15/≥60) sehingga roll bpjs/rw
 * hilirnya bergeser. Jejak lama dgn pasien kembali/karma/prolanis mereplay
 * ke kapitasi (dan skor Manajemen via ambang kas) yang bisa berbeda dari
 * yang tercatat — dossier build lama harus jatuh ke "tidak dapat
 * diverifikasi", bukan divonis TIDAK SAH palsu;
 * 15 = M10.c (2026-07-06, dossier §47) sapuan konsistensi pipeline: daftar
 * `tatalaksana.edukasi` ~10 kasus diubah (topik off-target/kontradiktif clue
 * diganti topik tepat — mis. tinea/kandidiasis jaga_kelembapan→jaga_area_kering,
 * konjungtivitis kompres hangat→dingin, malaria psn_3m→kelambu) DAN 2 kasus
 * dapat `edukasiKritis` baru (asma_ringan→teknik_inhaler, rinosinusitis→
 * tanda_bahaya). skorEdukasi = cakupan topik-pemain ∩ daftar-wajib, jadi
 * mengubah keanggotaan daftar wajib MENGUBAH skor replay utk jejak lama
 * (topik yg dulu masuk-wajib kini tidak, & sebaliknya); edukasiKritis
 * meng-cap skorEdukasi ke 50 bila terlewat. Jejak lama pada ke-12 kasus itu
 * mereplay ke skorEdukasi/grade berbeda — dossier build lama harus jatuh ke
 * "tidak dapat diverifikasi", bukan divonis TIDAK SAH palsu;
 * 17 = M10 Batch-2 (2026-07-10, CODEX ronde-verifikasi, dossier §53): LIMA
 * perubahan semantik replay sekaligus — (a) kandidat antrian Director kini
 * di-SORT by id (dulu urutan insersi key pack; refactor susunan file bisa
 * mengubah hasil rng.weighted tanpa mengubah sidik jari); (b) satuan skor MI
 * jadi per-KUNJUNGAN (miTotal+=1, miTepat+=kualitas 0..1 — dulu per-pilihan
 * dialog sehingga floor EKSPEKTASI_KUNJUNGAN salah satuan, 1 kunjungan
 * sempurna = 50% target Ujian padahal maksudnya 12.5%); (c) anamnesis
 * ber-`hanyaUntuk` (gender-gate, mis. q_haid apendisitis) keluar dari
 * denominator skor utk pasien yang tak cocok; (d) kartu sesi Prolanis hanya
 * utk peserta ber-JKN aktif runtime + peserta tanpa kartu tak di-drift;
 * (e) arus kas obat: dispense dari stok = nol kas (biaya sudah dibayar saat
 * pengadaan; dulu BPJS dobel-charge), stok kosong = beli darurat −hargaBeli.
 * Jejak lama mereplay ke antrian/skor berbeda → dossier lama jatuh ke
 * "tidak dapat diverifikasi";
 * 16 = M10 §49 fix-round (2026-07-10): (a) mekanik BARU `obatOpsional` —
 * obat sah-tapi-tak-wajib TIDAK membuka slot terapi, tak dihitung obat-di-luar,
 * tak memicu antibiotik-tanpa-indikasi (clinic.ts; hordeolum kasus perdana:
 * dulu rasioTerapi bisa 0 utk terapi konservatif yang benar); (b) KLB kasus
 * KONTAK (skabies/konjungtivitis) dapat pola kartu sendiri (kegiatan.ts) —
 * dulu jatuh ke kartu droplet (masker/etika batuk utk wabah tungau); jawaban
 * benar/salah kartu KLB bergeser utk jejak lama. Konten batch §49 (apendisitis
 * +prosedur pasang_infus, faringitis relevan-flag, epistaksis demografi, dst)
 * juga menggeser replay, tapi itu tercakup sidik jari pack (tx/lab/demografi
 * kini di-hash) — bump ini utk perubahan SEMANTIK ENGINE yg tak terlihat pack.
 */
// M9.2 follow-up (2026-07-11): koreksi field `skdi` 5 kasus (self-report
// keliru vs SKDI 2012/PPK 1186 resmi) — skdi ikut di-hash pack (verifikasi.ts
// baris ~250) & dipakai runtime Director (kasusAman/bias-4A), bukan kosmetik.
// M10.5/M14 (2026-07-11): guard aksi pasca-tamat di reducer (skor terkunci)
// mengubah semantik replay — aksi mutasi pasca-tamat kini DITOLAK saat replay,
// sehingga dossier lama (REVISI 18) yang tak punya guard jatuh ke
// "tidak_dapat_diverifikasi" (sidik jari beda), bukan divonis salah.
// M10.5/D5 (2026-07-11): migrasi Posyandu ILP "5 Langkah" — kartuPosyandu()
// kini menarik 1 kartu per Langkah 2/3/4 dari pool 12-kartu (dulu: dek 4-kartu
// tetap balita-saja) via Rng(seedKurikulum,'posyandu',hari,rw). Kartu Posyandu
// hardcoded di kegiatan.ts, TAK tercakup sidikJariPack (spt kartuKlb, catatan
// 16) — jejak lama mereplay ke kartu/skor/bonusIks berbeda tanpa bump ini.
// Fix #16 (adjudikasi dokter 2026-07-11, ronde CODEX-31): floor skorTerapi 70
// (observasi + lab besok) kini butuh `bolehTundaTerapi` per-lab, bukan cuma
// `hasilBesok` — hanya BTA (TB) yg sah, Widal/IgM-dengue/HbA1c/TSH tidak lagi
// memicu floor gratis. Mengubah replay skor kasus terkait secara langsung.
const REVISI_ENGINE = 21

/**
 * Sidik jari konten + revisi engine: semua yang mempengaruhi replay/skor. Beda
 * antar-build → replay bisa melenceng → verifier menolak MEMVONIS
 * (status tidak_dapat_diverifikasi), bukan memvonis TIDAK SAH palsu.
 *
 * CODEX P1: versi lama hanya me-list ID → mengubah clue/harga/tatalaksana/lab
 * tanpa mengubah ID TIDAK terdeteksi, padahal itu mengubah hasil replay. Kini
 * ISI yang menentukan skor ikut di-hash: per-kasus (icd10/harusDirujuk/prb/
 * tatalaksana/alergiTrap/lab/anamnesis-esensial), per-obat (harga/golongan
 * alergi/antibiotik/kelas), per-lab, IGD, dan pemetaan skdi144.
 *
 * CODEX audit 2026-07-04 (ronde-6): versi sebelumnya masih tak sensitif
 * terhadap pemeriksaanFisik (region+relevan → skorPemeriksaan), oldcarts/
 * distraktor per pertanyaan (bukan cuma esensial → skorAnamnesis), daftar
 * rumahSakit (spesialisasi/bed/jarak → SISRUTE nilai rujukan), dan isi arc
 * keluarga binaan (hambatan/intervensi/dialog → skor kunjungan UKM). Probe
 * CODEX: mengubah field itu tak mengubah hash — kini semua ikut di-hash.
 */
export function sidikJariPack(pack: ContentPack): string {
  const kasus = Object.values(pack.kasus)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((k) =>
      stringifyKanonik({
        id: k.id,
        icd: k.icd10,
        rujuk: k.harusDirujuk ?? false,
        trap: k.alergiTrap ?? null,
        tx: k.tatalaksana,
        lab: k.lab,
        pf: [...k.pemeriksaanFisik].sort((a, b) => a.region.localeCompare(b.region)).map((t) => ({ region: t.region, relevan: t.relevan })),
        anamnesis: [...k.anamnesis]
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((q) => ({ id: q.id, esensial: q.esensial ?? false, distraktor: q.distraktor ?? false, oldcarts: [...(q.oldcarts ?? [])].sort() })),
        // M10 §49 P1 (2026-07-10): 6 field ini dibaca LIVE saat replay tapi dulu
        // tak di-hash — edit salah satunya mempertahankan sidik jari sementara
        // antrian/skor replay bergeser (probe CODEX independen: ubah prevalensi
        // saja → hash tetap, skor replay 65/C→30/D) → dossier jujur divonis
        // tidak_sah PALSU. demografi→roll usia/gender (director), prevalensi/
        // kategori/skdi→bobotKasus seleksi antrian, konsekuensi→rng jadwal
        // pasien_kembali, spesialisRujukan→kecocokan RS SISRUTE→rujukanTepat.
        // (Asimetri telanjang sblmnya: spesialisRujukan IGD & spesialisasi RS
        // SUDAH di-hash utk perbandingan SISRUTE yang sama persis.)
        demografi: k.demografi,
        prevalensi: k.prevalensi ?? 'sedang',
        kategori: k.kategori,
        skdi: k.skdi,
        konsekuensi: k.konsekuensi ?? null,
        spesialis: k.spesialisRujukan ?? null,
      }),
    )
  const obat = Object.values(pack.obat)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((o) =>
      stringifyKanonik({ id: o.id, beli: o.hargaBeli, jual: o.hargaJual, gol: o.golonganAlergi ?? null, ab: o.antibiotik ?? false, kelas: o.kelas }),
    )
  const lab = Object.values(pack.lab)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((l) =>
      stringifyKanonik({
        id: l.id,
        biaya: l.biaya,
        besok: l.hasilBesok ?? false,
        // Fix #16 (adjudikasi dokter 2026-07-11): menentukan floor skorTerapi
        // 70 — mengubah replay/skor bila diedit, wajib ikut hash.
        tunda: l.bolehTundaTerapi ?? false,
      }),
    )
  // CODEX ronde-baru #2: IGD sebelumnya di-hash hanya dari daftar ID → mengubah
  // pilihan-benar/efek-stabilitas/disposisi tak mengubah hash, padahal semua itu
  // menyetir skor IGD. Kini isi penentu skor ikut di-hash.
  const igd = Object.values(pack.kasusIgd)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((k) =>
      stringifyKanonik({
        id: k.id,
        disposisi: k.disposisiBenar,
        spesialis: k.spesialisRujukan ?? null,
        stab: k.stabilitasAwal,
        langkah: k.langkah.map((l) => ({
          id: l.id,
          pilihan: l.pilihan.map((p) => ({ id: p.id, benar: p.benar, efek: p.efekStabilitas })),
        })),
      }),
    )
  // CODEX ronde-baru #2: kader (ketelitian/bias) & RW (jarak/totalKk) memengaruhi
  // akurasi data IKS + skor UKM + biaya perjalanan pada replay — sebelumnya sama
  // sekali tak ikut sidik jari.
  const kader = [...pack.kader]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((k) => stringifyKanonik({ id: k.id, rw: k.rw, ketelitian: k.ketelitian, bias: [...k.bias].sort() }))
  const rw = [...pack.rw]
    .sort((a, b) => a.nomor - b.nomor)
    .map((r) => stringifyKanonik({ nomor: r.nomor, jarak: r.jarak, totalKk: r.totalKk }))
  const rumahSakit = [...pack.rumahSakit]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((r) => stringifyKanonik({ id: r.id, kelas: r.kelas, jarak: r.jarakMenit, spesialisasi: [...r.spesialisasi].sort(), bed: r.bedDasar }))
  const keluarga = Object.values(pack.keluarga)
    .sort((a, b) => a.id.localeCompare(b.id))
    // §48#1 (CODEX, 2026-07-09): anggota[] menyetir identitas karma & roster
    // Prolanis (bentukRosterProlanis baca nama/usia/JK/kondisi LANGSUNG dari
    // pack), rw menyetir surveilans/bridge wilayah, jarakMenit menyetir biaya
    // stamina kunjungan — semua dulu tak di-hash: ganti nama/usia/kondisi
    // anggota TAK mengubah sidik jari padahal replay berubah.
    .map((k) =>
      stringifyKanonik({
        id: k.id,
        ekonomi: k.ekonomi,
        indikator: k.indikatorAwal,
        arc: k.arc,
        rw: k.rw,
        jarak: k.jarakMenit,
        anggota: k.anggota.map((a) => ({ nama: a.nama, usia: a.usia, jk: a.jenisKelamin, peran: a.peran, kondisi: [...(a.kondisi ?? [])].sort() })),
      }),
    )
  const skdi = [...pack.skdi144]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((e) => `${e.id}:${e.icd10}:${(e as { kasusId?: string }).kasusId ?? ''}`)
  // CODEX (2026-07-05, rev 12): `pack.tindakan` dulu SAMA SEKALI tak tersentuh
  // sidik jari (beda dari obat/lab yg sudah hash isi) — kini score-affecting
  // sejak biaya prosedur ikut memotong kapitasi, jadi wajib ikut di-hash.
  const tindakan = Object.values(pack.tindakan)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((t) => stringifyKanonik({ id: t.id, biaya: t.biaya }))
  // CODEX M10 (2026-07-05): edukasi dulu cuma hash daftar ID, bukan isi
  // (nama/kategori/sinonim) — beda dari obat yg sudah hash `kelas` walau
  // field itu sendiri tak dipakai formula skor (konvensi codebase ini:
  // hash lebih dari yg strict-diperlukan skor demi kelengkapan audit).
  // Tak perlu REVISI_ENGINE bump: nama/kategori/sinonim topik edukasi
  // TAK memengaruhi skorEdukasi sama sekali (murni ID membership) — ini
  // menutup blindspot audit konten, bukan mengubah semantik replay/skor.
  const edukasi = Object.values(pack.edukasi)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((t) => stringifyKanonik({ id: t.id, nama: t.nama, kategori: t.kategori, sinonim: [...(t.sinonim ?? [])].sort() }))
  const daftar = [
    'engine', String(REVISI_ENGINE),
    'kasus', ...kasus,
    'obat', ...obat,
    'lab', ...lab,
    'igd', ...igd,
    'kader', ...kader,
    'rw', ...rw,
    'rs', ...rumahSakit,
    'edukasi', ...edukasi,
    'tindakan', ...tindakan,
    'keluarga', ...keluarga,
    'skdi', ...skdi,
  ]
  return fnv1a(daftar.join('|'))
}

/* ---------------------------------------------------------------------------
 * Tanda tangan (HMAC-SHA256, WebCrypto)
 * ------------------------------------------------------------------------- */

// Deterrent edit-kasar, BUKAN rahasia kuat — kunci ada di dalam aplikasi yang
// dipegang mahasiswa. Integritas sesungguhnya dijamin replay (lihat desain).
const KUNCI_TTD = 'primer-dossier-v1:EC002026019623:puskesmas-pagi'

async function hmacHex(pesan: string): Promise<string> {
  const enc = new TextEncoder()
  const kunci = await globalThis.crypto.subtle.importKey(
    'raw',
    enc.encode(KUNCI_TTD),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const ttd = await globalThis.crypto.subtle.sign('HMAC', kunci, enc.encode(pesan))
  return Array.from(new Uint8Array(ttd))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/* ---------------------------------------------------------------------------
 * Susun & tanda tangani dossier
 * ------------------------------------------------------------------------- */

export async function susunDossier(
  state: GameState,
  pack: ContentPack,
  opsi: { versiApp: string; nim?: string },
): Promise<DossierMahasiswa> {
  const tanpaTtd: Omit<DossierMahasiswa, 'ttd'> = {
    format: FORMAT_DOSSIER,
    versi: VERSI_DOSSIER,
    // NIM diambil dari STATE (terikat seed sejak awal ujian) — bukan input bebas
    // saat ekspor. Fallback opsi.nim hanya utk mode karier (label, tak dinilai).
    identitas: { namaDokter: state.namaDokter, ...((state.nim ?? opsi.nim) ? { nim: state.nim ?? opsi.nim } : {}) },
    stase: {
      mode: state.mode,
      ...(state.paketUjian ? { paketUjian: state.paketUjian } : {}),
      seed: state.seed,
      seedKurikulum: state.seedKurikulum,
      hari: state.hari,
      ...(state.tamat ? { tamat: state.tamat } : {}),
    },
    klaim: { skor: hitungSkor(state), tally: state.tally, badge: hitungBadge(state) },
    jejak: state.jejak,
    lingkungan: { versiApp: opsi.versiApp, sidikJariPack: sidikJariPack(pack) },
  }
  const ttd = await hmacHex(stringifyKanonik(tanpaTtd))
  return { ...tanpaTtd, ttd }
}

/* ---------------------------------------------------------------------------
 * Verifikasi
 * ------------------------------------------------------------------------- */

function objek(nilai: unknown): nilai is Record<string, unknown> {
  return typeof nilai === 'object' && nilai !== null && !Array.isArray(nilai)
}

/** Replay penuh: state awal deterministik + fold advance atas seluruh jejak.
 *  Memakai mode replay (advance arg ke-4 = true) → append log/jejak in-place O(1)
 *  amortized, cegah O(n^2) yang bisa membekukan verifier (CODEX M14 #9). Aman krn
 *  state di sini dimiliki eksklusif oleh loop ini. */
export function replayJejak(dossier: Pick<DossierMahasiswa, 'identitas' | 'stase' | 'jejak'>, pack: ContentPack): GameState {
  let state = buildInitialState(dossier.identitas.namaDokter, dossier.stase.seed, pack, {
    mode: dossier.stase.mode,
  })
  for (const aksi of dossier.jejak) {
    state = advance(state, aksi as Action, pack, true).state
  }
  return state
}

export async function verifikasiDossier(json: string, pack: ContentPack, versiApp: string): Promise<HasilVerifikasi> {
  /* 0 — cap ukuran (M10 Batch-2, CODEX B.7): canonicalization + replay bekerja
     proporsional thd ukuran input; berkas raksasa/berbahaya dulu bisa
     MEMBEKUKAN verifier di mesin dosen SEBELUM HMAC sempat menolaknya.
     Dossier sah stase 90 hari ≈ ratusan KB — 8 MB sudah >10× headroom. */
  const MAKS_UKURAN_DOSSIER = 8_000_000
  if (json.length > MAKS_UKURAN_DOSSIER) {
    return {
      status: 'tidak_dapat_diverifikasi',
      alasan: [`Berkas terlalu besar (${(json.length / 1_000_000).toFixed(1)} MB > ${MAKS_UKURAN_DOSSIER / 1_000_000} MB) — bukan dossier stase yang wajar.`],
    }
  }

  /* 1 — bentuk */
  let mentah: unknown
  try {
    mentah = JSON.parse(json)
  } catch {
    return { status: 'tidak_dapat_diverifikasi', alasan: ['Berkas bukan JSON yang valid.'] }
  }
  if (!objek(mentah) || mentah['format'] !== FORMAT_DOSSIER) {
    return { status: 'tidak_dapat_diverifikasi', alasan: ['Bukan berkas Dossier Mahasiswa PRIMERA.'] }
  }
  if (mentah['versi'] !== VERSI_DOSSIER) {
    return { status: 'tidak_dapat_diverifikasi', alasan: [`Versi dossier tak dikenal (${String(mentah['versi'])}).`] }
  }
  const d = mentah as unknown as DossierMahasiswa
  if (!objek(d.identitas) || typeof d.identitas.namaDokter !== 'string' || !objek(d.stase) ||
      typeof d.stase.seed !== 'number' || !objek(d.klaim) || !Array.isArray(d.jejak) ||
      !objek(d.lingkungan) || typeof d.ttd !== 'string') {
    return { status: 'tidak_dapat_diverifikasi', alasan: ['Struktur dossier tidak lengkap.'] }
  }

  const ringkasan: NonNullable<HasilVerifikasi['ringkasan']> = {
    namaDokter: d.identitas.namaDokter,
    ...(d.identitas.nim ? { nim: d.identitas.nim } : {}),
    mode: d.stase.mode,
    ...(d.stase.paketUjian ? { paketUjian: d.stase.paketUjian } : {}),
    seed: d.stase.seed,
    hari: d.stase.hari,
    tamat: d.stase.tamat !== undefined,
    skorKlaim: d.klaim.skor,
  }

  /* 1b — cap JUMLAH entri jejak (CODEX M14 #9): batas byte (§0) tak cukup —
     ratusan ribu aksi trivial (mis. TUTUP_REKAP ~20 byte) muat di bawah 8 MB
     namun replay-nya bisa berlarut. Stase 90 hari yang rajin ≈ belasan ribu
     aksi; 200k = >5× headroom, di atasnya jelas bukan stase wajar. Ditolak DI
     SINI (sebelum HMAC & replay) agar input jahat tak sempat membuat verifier
     dosen berlarut/hang. */
  const MAKS_ENTRI_JEJAK = 200_000
  if (d.jejak.length > MAKS_ENTRI_JEJAK) {
    return {
      status: 'tidak_dapat_diverifikasi',
      alasan: [`Jejak aksi terlalu panjang (${d.jejak.length.toLocaleString('id')} aksi > ${MAKS_ENTRI_JEJAK.toLocaleString('id')}) — bukan stase yang wajar.`],
      ringkasan,
    }
  }

  /* 2 — tanda tangan */
  const { ttd: _ttd, ...tanpaTtd } = d
  const ttdHitung = await hmacHex(stringifyKanonik(tanpaTtd))
  if (ttdHitung !== d.ttd) {
    return {
      status: 'tidak_sah',
      alasan: ['Tanda tangan tidak cocok — berkas diubah setelah diekspor dari game.'],
      ringkasan,
    }
  }

  /* 3 — sidik jari konten */
  const sidikKini = sidikJariPack(pack)
  if (d.lingkungan.sidikJariPack !== sidikKini) {
    return {
      status: 'tidak_dapat_diverifikasi',
      alasan: [
        `Versi konten berbeda (dossier: ${d.lingkungan.sidikJariPack} dari app v${d.lingkungan.versiApp}; ` +
          `verifikator: ${sidikKini} dari app v${versiApp}). Verifikasi dengan build yang sama dengan yang dipakai mahasiswa.`,
      ],
      ringkasan,
    }
  }

  /* 3b — IKATAN IDENTITAS (CODEX, mode UJIAN): seed ujian diturunkan deterministik
     dari NIM (store.mulaiGameBaru). NIM WAJIB ada & seed harus = hashSeed('ujian',
     nim); bila NIM dihapus/diubah tapi seed tidak (atau sebaliknya), ikatan putus →
     identitas dipalsukan / paket dipinjam dari NIM teman. Dijalankan SETELAH sidik
     jari cocok (build sama, skema seed sama — REVISI_ENGINE bump utk perubahan ini)
     agar dossier build lama (seed berbasis nama, tanpa NIM) jatuh ke "tidak dapat
     diverifikasi" dulu, bukan divonis TIDAK SAH palsu. Karier tak terikat. */
  if (d.stase.mode === 'ujian' && (!d.identitas.nim || hashSeed('ujian', d.identitas.nim) !== d.stase.seed)) {
    return {
      status: 'tidak_sah',
      alasan: ['Identitas tidak konsisten: NIM pada dossier tidak cocok dengan seed ujian (NIM hilang atau diubah setelah stase).'],
      ringkasan,
    }
  }

  /* 4 — jejak utuh */
  if (d.jejak.length === 0) {
    return {
      status: 'tidak_dapat_diverifikasi',
      alasan: ['Jejak aksi kosong (kemungkinan stase dimulai pada versi game sebelum jurnal penuh M6).'],
      ringkasan,
    }
  }

  /* 5 — replay & banding */
  let akhir: GameState
  try {
    akhir = replayJejak(d, pack)
  } catch (e) {
    return {
      status: 'tidak_sah',
      alasan: [`Replay gagal dijalankan: ${e instanceof Error ? e.message : String(e)}.`],
      ringkasan,
    }
  }

  const alasan: string[] = []
  if (stringifyKanonik(akhir.tally) !== stringifyKanonik(d.klaim.tally)) {
    alasan.push('Tally hasil replay tidak sama dengan klaim (indikasi klaim skor diubah atau jejak dipangkas).')
  }
  if (akhir.hari !== d.stase.hari) {
    alasan.push(`Hari hasil replay (${akhir.hari}) ≠ klaim (${d.stase.hari}).`)
  }
  // Paket ujian diturunkan replay dari seed — klaim paket/seedKurikulum yang
  // dipalsukan (CODEX P1) tak akan cocok dgn hasil replay (buildInitialState).
  if ((akhir.paketUjian ?? undefined) !== (d.stase.paketUjian ?? undefined)) {
    alasan.push(`Paket ujian hasil replay (${akhir.paketUjian ?? '—'}) ≠ klaim (${d.stase.paketUjian ?? '—'}).`)
  }
  if (akhir.seedKurikulum !== d.stase.seedKurikulum) {
    alasan.push(`Seed kurikulum hasil replay (${akhir.seedKurikulum}) ≠ klaim (${d.stase.seedKurikulum}).`)
  }
  if (stringifyKanonik(akhir.tamat) !== stringifyKanonik(d.stase.tamat)) {
    alasan.push('Status tamat hasil replay tidak sama dengan klaim.')
  }
  const skorReplay = hitungSkor(akhir)
  ringkasan.skorReplay = skorReplay
  if (stringifyKanonik(skorReplay) !== stringifyKanonik(d.klaim.skor)) {
    alasan.push(
      `Skor hasil replay (${skorReplay.total} ${skorReplay.grade}) ≠ klaim (${d.klaim.skor.total} ${d.klaim.skor.grade}).`,
    )
  }
  // CODEX ronde-16 P1: badge dulu HANYA disimpan dari klaim, tak pernah dihitung
  // ulang thd hasil replay — kolektor_dex (state.dex) & sahabat_desa (arcSelesai
  // keluarga) bergantung field yang TAK dipakai hitungSkor/tally, jadi lolos
  // tanpa terdeteksi mekanisme banding lain manapun di atas.
  const badgeReplay = [...hitungBadge(akhir)].sort()
  if (stringifyKanonik(badgeReplay) !== stringifyKanonik([...d.klaim.badge].sort())) {
    alasan.push(
      `Daftar badge hasil replay (${badgeReplay.join(', ') || '—'}) ≠ klaim (${[...d.klaim.badge].sort().join(', ') || '—'}).`,
    )
  }

  if (alasan.length > 0) return { status: 'tidak_sah', alasan, ringkasan }
  return { status: 'sah', alasan: [], ringkasan }
}
