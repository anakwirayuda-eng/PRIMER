/**
 * PROFIL ADVERSARIAL (M7 butir 36) — KONTRAK INTEGRITAS ASESMEN.
 * Menjamin strategi "mengakali skor" KALAH dari bermain jujur pada ALIRAN
 * PASIEN YANG SAMA (Director memilih pasien dari seedKurikulum+hari, tak
 * bergantung aksi pemain — jadi tiap profil melihat pasien identik).
 *
 * Ini garis pertahanan hidden-curriculum: bila salah satu kontrak ini jebol,
 * artinya game mengajarkan cara curang yang menguntungkan — WAJIB gagal CI.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import { advance, HARI_REKAP_SLICE } from './reducer'
import { hitungSkor } from './scoring'
import { KAPASITAS_EDUKASI } from './clinic'
import type { Action } from './actions'
import type { GameState } from './state'

type Profil = 'jujur' | 'koboi_tangani_semua' | 'suspek_selamanya' | 'rujuk_semua' | 'shotgun_edukasi'

function step(state: GameState, action: Action): GameState {
  return advance(state, action, PACK).state
}

/**
 * Tangani satu pasien menurut profil. Aliran pasien identik antar profil.
 * Catatan: profil skip-workup TIDAK diuji di sini — pertahanannya adalah
 * info-hiding UI (temuan hanya terbuka bila diperiksa), bukan skor dimensi;
 * driver test yang membaca ground-truth kasus akan memintasnya secara artifisial.
 * Yang diuji adalah kontrak SKOR: strategi curang tak boleh unggul.
 */
function tanganiPasien(state: GameState, profil: Profil): GameState {
  let s = step(state, { type: 'PANGGIL_PASIEN' })
  const enc = s.klinik.aktif
  if (!enc) return s
  const kasus = PACK.kasus[enc.pasien.kasusId]
  if (!kasus) return step(s, { type: 'DISPOSISI', jenis: 'pulang' })

  for (const q of kasus.anamnesis) {
    if (q.distraktor !== true) s = step(s, { type: 'TANYA', pertanyaanId: q.id })
  }
  s = step(s, { type: 'LANJUT_FASE' }) // → pemeriksaan
  s = step(s, { type: 'UKUR_VITAL' })
  for (const t of kasus.pemeriksaanFisik) if (t.relevan) s = step(s, { type: 'PERIKSA', region: t.region })
  s = step(s, { type: 'LANJUT_FASE' }) // → diagnosis

  const jenis = profil === 'suspek_selamanya' ? 'suspek' : 'tegak'
  s = step(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis })

  // Terapi: obat benar. Shotgun mencentang SEMUA edukasi (di-cap engine ke 3).
  for (const obatId of kasus.tatalaksana.obatBenar) s = step(s, { type: 'TAMBAH_OBAT', obatId })
  if (profil === 'shotgun_edukasi') {
    for (const id of Object.keys(PACK.edukasi)) s = step(s, { type: 'TAMBAH_EDUKASI', edukasiId: id })
  } else {
    for (const id of kasus.tatalaksana.edukasi.slice(0, KAPASITAS_EDUKASI)) {
      s = step(s, { type: 'TAMBAH_EDUKASI', edukasiId: id })
    }
  }
  s = step(s, { type: 'LANJUT_FASE' }) // → disposisi

  // koboi_tangani_semua: "dokter pahlawan" yang menangani SEMUA kasus, termasuk
  // yang wajib-rujuk (memicu tally cowboy −5, dinaikkan dari −2 DeepThink
  // ronde-2 "Boikot Rujukan"). rujuk_semua: sebaliknya.
  const rujuk =
    profil === 'rujuk_semua' ? true : profil === 'koboi_tangani_semua' ? false : kasus.harusDirujuk
  s = step(s, {
    type: 'DISPOSISI',
    jenis: rujuk ? 'rujuk' : 'pulang',
    ...(rujuk
      ? { sbar: { situation: 'x', background: 'x', assessment: `${kasus.nama} (${kasus.icd10})`, recommendation: 'x' } }
      : {}),
  })
  return s
}

/** Mainkan sampai rekap slice (hari 8) dengan satu profil; kembalikan skor UKP. */
function mainkan(profil: Profil, seed: number): { ukp: number; total: number } {
  let s = buildInitialState(`Adv ${profil}`, seed, PACK)
  let guard = 0
  while (s.hari < HARI_REKAP_SLICE && guard++ < 60) {
    let gPasien = 0
    while (s.klinik.antrian.length > 0 && gPasien++ < 20) s = tanganiPasien(s, profil)
    s = step(s, { type: 'LANJUTKAN' })
    s = step(s, { type: 'LANJUTKAN' })
    s = step(s, { type: 'LANJUTKAN' })
  }
  const skor = hitungSkor(s)
  return { ukp: skor.ukp, total: skor.total }
}

describe('ADVERSARIAL — main jujur mengungguli strategi curang (M7.36)', () => {
  const SEED = 12345
  const jujur = mainkan('jujur', SEED)

  it('koboi tangani-semua (tolak rujuk kasus wajib-rujuk) < jujur — tally cowboy −5', () => {
    const koboi = mainkan('koboi_tangani_semua', SEED)
    expect(jujur.ukp).toBeGreaterThan(koboi.ukp)
  })

  it('SUSPEK-selamanya (lindung nilai) ≤ jujur — kalibrasi menghukum ragu palsu', () => {
    const suspek = mainkan('suspek_selamanya', SEED)
    // Stempel SUSPEK saat sebenarnya yakin = kalibrasi lebih rendah dari TEGAK-benar.
    expect(jujur.ukp).toBeGreaterThan(suspek.ukp)
  })

  it('rujuk-semua (termasuk kasus 4A) < jujur — Referral Guillotine bekerja', () => {
    const rujuk = mainkan('rujuk_semua', SEED)
    expect(jujur.ukp).toBeGreaterThan(rujuk.ukp)
  })

  it('shotgun edukasi (centang semua) ≤ jujur — kuota+penalti relevansi', () => {
    const shotgun = mainkan('shotgun_edukasi', SEED)
    // Tak boleh MENGUNGGULI main terarah; kuota 3 + penalti tak-relevan menjaga.
    expect(shotgun.total).toBeLessThanOrEqual(jujur.total)
  })
})
