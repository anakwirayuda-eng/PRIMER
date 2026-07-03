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
 * KAPASITAS_EDUKASI + formula prioritisasi min(3,|wajib|) − 15×salah.
 */
const REVISI_ENGINE = 2

/**
 * Sidik jari konten + revisi engine: semua yang mempengaruhi replay. Beda
 * antar-build → replay bisa melenceng → verifier menolak MEMVONIS
 * (status tidak_dapat_diverifikasi), bukan memvonis TIDAK SAH.
 */
export function sidikJariPack(pack: ContentPack): string {
  const daftar = [
    'engine', String(REVISI_ENGINE),
    'kasus', ...Object.keys(pack.kasus).sort(),
    'igd', ...Object.keys(pack.kasusIgd).sort(),
    'obat', ...Object.keys(pack.obat).sort(),
    'edukasi', ...Object.keys(pack.edukasi).sort(),
    'lab', ...Object.keys(pack.lab).sort(),
    'keluarga', ...Object.keys(pack.keluarga).sort(),
    'skdi', String(pack.skdi144.length),
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
