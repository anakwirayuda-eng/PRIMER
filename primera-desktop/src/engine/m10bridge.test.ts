/**
 * M10.b — KONSISTENSI IDENTITAS NPC lintas jembatan UKP↔UKM (dossier §43).
 * "Orang yang sama harus tetap orang yang sama": pasien yang kembali
 * (konsekuensi/PRB/karma/prolanis) wajib membawa SELURUH identitasnya —
 * bukan cuma nama/usia/JK (yang sudah dibawa sejak M1) tapi juga bpjs
 * (berdampak ekonomi: umum bayar retribusi ke kas, BPJS membakar kapitasi)
 * dan persona (suara/gaya bicara di anamnesis).
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState, PasienAktif } from './state'
import type { Action } from './actions'
import { advance, HARI_BUKA_PROLANIS } from './reducer'
import { buildInitialState } from './init'
import { buatPasienDariKasus } from './director'
import { Rng } from './core/rng'

const SEED = 20260706

function run(state: GameState, action: Action): GameState {
  return advance(state, action, PACK).state
}

/** IGD interrupt memblokir LANJUTKAN — tangani optimal bila muncul. */
function bereskanIgd(state: GameState): GameState {
  let cur = state
  let guard = 0
  while (cur.igd && guard++ < 30) {
    const kasus = PACK.kasusIgd[cur.igd.kasusId]!
    if (cur.igd.fase === 'langkah') {
      const l = kasus.langkah[cur.igd.langkahIndex]!
      cur = run(cur, {
        type: 'AKSI_IGD',
        langkahId: l.id,
        pilihanId: (l.pilihan.find((p) => p.benar) ?? l.pilihan[0]!).id,
      })
    } else if (cur.igd.fase === 'kode_biru') cur = run(cur, { type: 'RJP_IGD', berkualitas: true })
    else if (cur.igd.fase === 'pasca_rosc') cur = run(cur, { type: 'STABILISASI_LANJUTAN_IGD', pilihanId: 'ulang_abcde' })
    else if (cur.igd.fase === 'disposisi') cur = run(cur, { type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar })
    else break
  }
  return cur
}

/** Lewati satu hari penuh: pagi → siang → sore → pagi besok. */
function lewatiHari(s: GameState): GameState {
  let cur = bereskanIgd(s)
  cur = run(cur, { type: 'LANJUTKAN' })
  cur = run(cur, { type: 'LANJUTKAN' })
  cur = run(cur, { type: 'LANJUTKAN' })
  return bereskanIgd(cur)
}

function sampaiHari(s: GameState, hari: number): GameState {
  let cur = s
  let guard = 0
  while (cur.hari < hari && guard++ < 120) cur = lewatiHari(cur)
  return cur
}

/**
 * Tangani antrian[0] dgn diagnosis SALAH lalu pulangkan — memicu jadwal
 * konsekuensi bila kasusnya punya arc `konsekuensi`.
 */
function tanganiSalahSatuPasien(s: GameState): { state: GameState; pasien: PasienAktif } {
  const pasien = s.klinik.antrian[0]!
  let cur = run(s, { type: 'PANGGIL_PASIEN' })
  cur = run(cur, { type: 'LANJUT_FASE' }) // anamnesis → pemeriksaan
  cur = run(cur, { type: 'LANJUT_FASE' }) // → diagnosis
  cur = run(cur, { type: 'KOMIT_DIAGNOSIS', icd10: 'Z00.0', jenis: 'tegak' }) // pasti keliru
  cur = run(cur, { type: 'LANJUT_FASE' }) // → disposisi
  cur = run(cur, { type: 'DISPOSISI', jenis: 'pulang' })
  return { state: cur, pasien }
}

describe('M10.b — identitas pasien kembali (konsekuensi bernama SEUTUHNYA)', () => {
  it('pasien konsekuensi kembali dgn bpjs & persona ASLI — bukan roll ulang', () => {
    let s = buildInitialState('dr. Uji', SEED, PACK)
    let asal: PasienAktif | undefined

    // Cari pasien pertama yang kasusnya punya konsekuensi & benar2 terjadwal
    // kembali. Pasien tutorial hari-1 kebal (jadwalnya di-restore) — loop ini
    // otomatis melewatinya krn jadwal pasien_kembali-nya tak pernah bertahan.
    let guard = 0
    while (!asal && guard++ < 15) {
      while (s.klinik.antrian.length > 0 && !asal && s.blok === 'pagi') {
        const hasil = tanganiSalahSatuPasien(s)
        s = hasil.state
        const terjadwal = s.jadwal.some(
          (j) => j.jenis === 'pasien_kembali' && j.nama === hasil.pasien.nama,
        )
        if (terjadwal) asal = hasil.pasien
      }
      if (!asal) s = lewatiHari(s)
    }
    expect(asal, 'tak menemukan pasien ber-konsekuensi dlm 15 hari').toBeDefined()

    const jadwal = s.jadwal.find((j) => j.jenis === 'pasien_kembali' && j.nama === asal!.nama)!
    s = sampaiHari(s, jadwal.hari)
    const kembali = s.klinik.antrian.find((p) => p.nama === asal!.nama)
    expect(kembali, 'pasien kembali tak muncul di antrian').toBeDefined()
    // Identitas yang SUDAH dijaga sejak M1 (regresi):
    expect(kembali!.usia).toBe(asal!.usia)
    expect(kembali!.jenisKelamin).toBe(asal!.jenisKelamin)
    expect(kembali!.rw).toBe(asal!.rw)
    // Identitas yang BARU dijaga M10.b:
    expect(kembali!.bpjs, 'status BPJS orang yg sama berubah antar-kunjungan').toBe(asal!.bpjs)
    expect(kembali!.persona, 'persona (suara) orang yg sama berubah antar-kunjungan').toBe(asal!.persona)
  })

  it('pasien karma membawa bpjs dari indikator JKN keluarganya — bukan roll 70%', () => {
    let s = buildInitialState('dr. Uji', SEED, PACK)
    // keluarga_wulan punya karma nyata (jatuh tempo hari 6, Bu Wulan → stroke).
    // Paksa status JKN keluarga = 'tidak' (kelas cerita Bu Marni: kartu mati).
    const kel = s.desa.keluarga['keluarga_wulan']!
    s = {
      ...s,
      desa: {
        ...s.desa,
        keluarga: {
          ...s.desa.keluarga,
          keluarga_wulan: {
            ...kel,
            indikator: {
              ...kel.indikator,
              jkn: { ...kel.indikator.jkn, statusSebenarnya: 'tidak' },
            },
          },
        },
      },
    }
    s = sampaiHari(s, 6)
    const karma = s.klinik.antrian.find((p) => p.keluargaId === 'keluarga_wulan')
    expect(karma, 'pasien karma keluarga_wulan tak muncul hari 6').toBeDefined()
    expect(karma!.nama).toBe('Bu Wulan')
    // Bu Wulan usia inject 58 (<60, dewasa): persona WAJIB dari himpunan dewasa
    // — sebelum fix, persona diroll dari usia demografi stroke_iskemik yg
    // dibuang (bisa ≥60 → 'lansia' utk perempuan 58 th, suara yg salah).
    expect(['polos', 'terpelajar', 'skeptis', 'cemas']).toContain(karma!.persona)
    expect(karma!.bpjs, 'JKN keluarga "tidak" → pasien karma datang sbg umum').toBe(false)
  })

  it('roster prolanis membawa keluargaId — komplikasi bisa dirunut balik ke keluarga binaan', () => {
    let s = buildInitialState('dr. Uji', SEED, PACK)
    s = sampaiHari(s, HARI_BUKA_PROLANIS.karier)
    expect(s.prolanis.roster.length).toBeGreaterThan(0)
    for (const p of s.prolanis.roster) {
      expect(p.keluargaId, `peserta ${p.nama} tanpa keluargaId`).toBeDefined()
      expect(PACK.keluarga[p.keluargaId!], `keluargaId ${p.keluargaId} tak dikenal`).toBeDefined()
    }
  })
})

describe('M10.b — persona mengikuti usia OVERRIDE (identitas suara pasien inject)', () => {
  // buatPasienDariKasus me-roll usia dari demografi kasus lalu menghitung
  // persona — sebelum M10.b, persona dihitung dari usia ROLL yg lalu DIBUANG
  // oleh override (karma/prolanis/PRB): Mbah Lastri 71 th bisa bicara dgn
  // persona 'polos' dewasa. asma_ringan demografi 15-40 → roll tak pernah
  // ≥60/<15, jadi assertion ini deterministik merah sebelum fix. Anak yang
  // dapat menjawab sendiri tidak lagi disamakan dengan wali pendamping.
  it.each([[1], [2], [3]])('override usia 71 → lansia; usia 8 → anak/wali sesuai kasus (variasi rng %i)', (i) => {
    const lansia = buatPasienDariKasus('asma_ringan', PACK, new Rng(SEED, 'uji-persona', i), { usia: 71 })
    expect(lansia.persona).toBe('lansia')
    const anak = buatPasienDariKasus('asma_ringan', PACK, new Rng(SEED, 'uji-persona-anak', i), { usia: 8 })
    expect(anak.persona).toBe('anak')
    const wali = buatPasienDariKasus('diare_akut_anak', PACK, new Rng(SEED, 'uji-persona-wali', i), { usia: 8 })
    expect(wali.persona).toBe('wali_anak')
  })

  it('tanpa override: perilaku lama utuh (persona dari usia roll)', () => {
    const p = buatPasienDariKasus('asma_ringan', PACK, new Rng(SEED, 'uji-persona-basis'))
    expect(['polos', 'terpelajar', 'skeptis', 'cemas']).toContain(p.persona)
    expect(p.usia).toBeGreaterThanOrEqual(15)
    expect(p.usia).toBeLessThanOrEqual(40)
  })
})
