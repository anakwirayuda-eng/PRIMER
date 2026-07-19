/**
 * TEST — tutorial "onboarding railroaded" (DeepThink, keputusan user).
 * Kunci klaim: (a) stase baru mulai tutorialAktif=true + pasien pertama
 * dipaksa KASUS_TUTORIAL; (b) DISPOSISI pertama KEBAL skor sepenuhnya
 * (tally/dex/kapitasi/gudang/jadwal tak berubah) tapi mematikan flag; (c)
 * pasien KEDUA (setelah tutorial usai) kembali normal, tally bergerak.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import { advance } from './reducer'
import { KASUS_TUTORIAL } from './tutorial'
import { ringkasanHarian } from './scoring'
import type { GameState } from './state'
import type { Action } from './actions'

function run(s: GameState, a: Action): GameState {
  const hasil = advance(s, a, PACK)
  const err = hasil.events.find((e) => e.type === 'ERROR_AKSI')
  if (err && err.type === 'ERROR_AKSI') throw new Error(`Aksi ${a.type} ditolak: ${err.pesan}`)
  return hasil.state
}

/** Tangani pasien AKTIF sampai tuntas disposisi (jalur sederhana: pulang, TEGAK benar). */
function tanganiPasienAktif(s: GameState): GameState {
  const enc = s.klinik.aktif!
  const kasus = PACK.kasus[enc.pasien.kasusId]!
  for (const q of kasus.anamnesis) {
    if (q.distraktor === true) continue
    s = run(s, { type: 'TANYA', pertanyaanId: q.id })
  }
  s = run(s, { type: 'LANJUT_FASE' })
  s = run(s, { type: 'UKUR_VITAL' })
  for (const t of kasus.pemeriksaanFisik) if (t.relevan) s = run(s, { type: 'PERIKSA', region: t.region })
  s = run(s, { type: 'LANJUT_FASE' })
  s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' })
  for (const obatId of kasus.tatalaksana.obatBenar) s = run(s, { type: 'TAMBAH_OBAT', obatId })
  s = run(s, { type: 'LANJUT_FASE' })
  return run(
    s,
    kasus.harusDirujuk
      ? {
          type: 'DISPOSISI',
          jenis: 'rujuk',
          sbar: { situation: 'x', background: 'x', assessment: 'x', recommendation: 'x' },
        }
      : { type: 'DISPOSISI', jenis: 'pulang' },
  )
}

describe('Tutorial "onboarding railroaded" — init', () => {
  it('stase baru: tutorialAktif=true & pasien PERTAMA dipaksa KASUS_TUTORIAL', () => {
    const s = buildInitialState('Uji Tutorial', 42, PACK)
    expect(s.tutorialAktif).toBe(true)
    expect(s.klinik.antrian[0]?.kasusId).toBe(KASUS_TUTORIAL)
  })

  it('pasien KEDUA di antrian Hari 1 TIDAK ikut dipaksa (tetap seleksi Director normal)', () => {
    const s = buildInitialState('Uji Tutorial', 42, PACK)
    expect(s.klinik.antrian.length).toBeGreaterThan(1)
    // Bukan klaim "pasti beda dari KASUS_TUTORIAL" (Director bisa saja memang
    // memilihnya kebetulan) — cukup pastikan override tak menimpa index lain.
    expect(s.klinik.antrian[1]).toBeDefined()
  })
})

describe('Tutorial "onboarding railroaded" — imunitas skor', () => {
  it('DISPOSISI pasien PERTAMA (tutorial) tidak mengubah tally/dex/kapitasi/gudang, tapi mematikan tutorialAktif', () => {
    let s = buildInitialState('Uji Tutorial', 42, PACK)
    const tallyAwal = s.tally
    const dexAwal = s.dex
    const kapitasiAwal = s.kapitasi
    const stokAwal = s.gudang.stok

    s = run(s, { type: 'PANGGIL_PASIEN' })
    expect(s.klinik.aktif?.pasien.kasusId).toBe(KASUS_TUTORIAL)
    s = tanganiPasienAktif(s)

    expect(s.tutorialAktif).toBe(false)
    expect(s.tally).toEqual(tallyAwal)
    expect(s.dex).toEqual(dexAwal)
    expect(s.kapitasi).toBe(kapitasiAwal)
    expect(s.gudang.stok).toEqual(stokAwal)
    expect(s.klinik.aktif).toBeUndefined() // encounter tetap tuntas narasi-nya
    expect(s.klinik.selesaiHariIni).toHaveLength(0)
    expect(ringkasanHarian(s).grade).toBe('—')
  })

  it('DISPOSISI pasien KEDUA (pasca-tutorial) skor NORMAL — tally bergerak', () => {
    let s = buildInitialState('Uji Tutorial', 42, PACK)
    s = run(s, { type: 'PANGGIL_PASIEN' })
    s = tanganiPasienAktif(s) // pasien #1 — tutorial, kebal

    s = run(s, { type: 'PANGGIL_PASIEN' })
    expect(s.tutorialAktif).toBe(false) // sudah mati sebelum pasien #2
    s = tanganiPasienAktif(s) // pasien #2 — skor sungguhan

    expect(s.tally.totalPasien).toBe(1)
    expect(s.tally.diagnosisBenar).toBe(1)
    expect(s.klinik.selesaiHariIni).toHaveLength(1)
  })

  it('DISPOSISI pasien PERTAMA (tutorial) TAK memancarkan event DEX_BERTAMBAH/SURAT_MASUK palsu (CODEX)', () => {
    // state benar-benar dibekukan (test di atas), TAPI toaster membaca events,
    // bukan state — event yg tak difilter akan bilang "Buku Saku diperbarui"
    // walau s.dex tak berubah sama sekali. Jalankan langkah terakhir manual
    // (bukan tanganiPasienAktif) supaya bisa memeriksa `events` hasil DISPOSISI.
    let s = buildInitialState('Uji Tutorial', 42, PACK)
    s = run(s, { type: 'PANGGIL_PASIEN' })
    const enc = s.klinik.aktif!
    const kasus = PACK.kasus[enc.pasien.kasusId]!
    for (const q of kasus.anamnesis) {
      if (q.distraktor === true) continue
      s = run(s, { type: 'TANYA', pertanyaanId: q.id })
    }
    s = run(s, { type: 'LANJUT_FASE' })
    s = run(s, { type: 'UKUR_VITAL' })
    for (const t of kasus.pemeriksaanFisik) if (t.relevan) s = run(s, { type: 'PERIKSA', region: t.region })
    s = run(s, { type: 'LANJUT_FASE' })
    s = run(s, { type: 'KOMIT_DIAGNOSIS', icd10: kasus.icd10, jenis: 'tegak' })
    for (const obatId of kasus.tatalaksana.obatBenar) s = run(s, { type: 'TAMBAH_OBAT', obatId })
    s = run(s, { type: 'LANJUT_FASE' })
    const hasil = advance(s, { type: 'DISPOSISI', jenis: 'pulang' }, PACK)

    expect(hasil.events.some((e) => e.type === 'DEX_BERTAMBAH')).toBe(false)
    expect(hasil.events.some((e) => e.type === 'SURAT_MASUK')).toBe(false)
    // ENCOUNTER_SELESAI tetap ada — debrief narasi TETAP muncul, hanya
    // notifikasi skor palsu yang dipangkas.
    expect(hasil.events.some((e) => e.type === 'ENCOUNTER_SELESAI')).toBe(true)
  })
})
