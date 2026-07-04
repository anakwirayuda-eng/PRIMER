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
 * dulu tak ter-hash (CODEX ronde-baru #2).
 */
const REVISI_ENGINE = 5

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
      }),
    )
  const obat = Object.values(pack.obat)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((o) =>
      stringifyKanonik({ id: o.id, beli: o.hargaBeli, jual: o.hargaJual, gol: o.golonganAlergi ?? null, ab: o.antibiotik ?? false, kelas: o.kelas }),
    )
  const lab = Object.values(pack.lab)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((l) => stringifyKanonik({ id: l.id, biaya: l.biaya, besok: l.hasilBesok ?? false }))
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
    .map((k) => stringifyKanonik({ id: k.id, ekonomi: k.ekonomi, indikator: k.indikatorAwal, arc: k.arc }))
  const skdi = [...pack.skdi144]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((e) => `${e.id}:${e.icd10}:${(e as { kasusId?: string }).kasusId ?? ''}`)
  const daftar = [
    'engine', String(REVISI_ENGINE),
    'kasus', ...kasus,
    'obat', ...obat,
    'lab', ...lab,
    'igd', ...igd,
    'kader', ...kader,
    'rw', ...rw,
    'rs', ...rumahSakit,
    'edukasi', ...Object.keys(pack.edukasi).sort(),
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
    identitas: { namaDokter: state.namaDokter, ...(opsi.nim ? { nim: opsi.nim } : {}) },
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

/** Replay penuh: state awal deterministik + fold advance atas seluruh jejak. */
export function replayJejak(dossier: Pick<DossierMahasiswa, 'identitas' | 'stase' | 'jejak'>, pack: ContentPack): GameState {
  let state = buildInitialState(dossier.identitas.namaDokter, dossier.stase.seed, pack, {
    mode: dossier.stase.mode,
  })
  for (const aksi of dossier.jejak) {
    state = advance(state, aksi as Action, pack).state
  }
  return state
}

export async function verifikasiDossier(json: string, pack: ContentPack, versiApp: string): Promise<HasilVerifikasi> {
  /* 1 — bentuk */
  let mentah: unknown
  try {
    mentah = JSON.parse(json)
  } catch {
    return { status: 'tidak_dapat_diverifikasi', alasan: ['Berkas bukan JSON yang valid.'] }
  }
  if (!objek(mentah) || mentah['format'] !== FORMAT_DOSSIER) {
    return { status: 'tidak_dapat_diverifikasi', alasan: ['Bukan berkas Dossier Mahasiswa PRIMER.'] }
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

  /* 3b — IKATAN IDENTITAS (CODEX P1, mode UJIAN): seed ujian diturunkan
     deterministik dari nama (store.mulaiGameBaru). Bila nama di dossier diubah
     tapi seed tidak (atau sebaliknya), ikatan putus → identitas dipalsukan.
     Menutup celah "ganti nama/NIM lalu hitung ulang HMAC" untuk ujian
     (identitas yang DINILAI). Dijalankan SETELAH sidik jari cocok (build sama,
     skema seed sama) agar dossier build lama jatuh ke "tidak dapat diverifikasi"
     lebih dulu, bukan divonis TIDAK SAH palsu. Karier tak terikat (tak dinilai). */
  if (d.stase.mode === 'ujian' && hashSeed('ujian', d.identitas.namaDokter) !== d.stase.seed) {
    return {
      status: 'tidak_sah',
      alasan: ['Identitas tidak konsisten: seed ujian tidak cocok dengan nama pada dossier (kemungkinan nama/NIM diubah setelah stase).'],
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

  if (alasan.length > 0) return { status: 'tidak_sah', alasan, ringkasan }
  return { status: 'sah', alasan: [], ringkasan }
}
