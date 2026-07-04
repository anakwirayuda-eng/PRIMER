/**
 * M2 — PROGRAM UKM TERJADWAL: test integrasi Posyandu/Prolanis/KLB + program
 * wilayah + Lokakarya Mini di atas konten produksi (PACK).
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState } from './state'
import type { Action } from './actions'
import { advance } from './reducer'
import { buildInitialState } from './init'
import {
  HARI_BUKA_POSYANDU,
  HARI_BUKA_PROLANIS,
  HARI_BUKA_KLB,
} from './reducer'

const SEED = 424242

function run(s: GameState, a: Action): GameState {
  return advance(s, a, PACK).state
}
function ev(s: GameState, a: Action) {
  return advance(s, a, PACK)
}

/** IGD interrupt (M3.14) memblokir LANJUTKAN — tangani optimal bila muncul. */
function bereskanIgd(state: GameState): GameState {
  let s = state
  let guard = 0
  while (s.igd && guard++ < 30) {
    const kasus = PACK.kasusIgd[s.igd.kasusId]!
    if (s.igd.fase === 'langkah') {
      const l = kasus.langkah[s.igd.langkahIndex]!
      s = run(s, { type: 'AKSI_IGD', langkahId: l.id, pilihanId: (l.pilihan.find((p) => p.benar) ?? l.pilihan[0]!).id })
    } else if (s.igd.fase === 'kode_biru') s = run(s, { type: 'RJP_IGD', berkualitas: true })
    else if (s.igd.fase === 'disposisi') s = run(s, { type: 'DISPOSISI_IGD', jenis: kasus.disposisiBenar })
    else break
  }
  return s
}

/** Ke blok siang hari tertentu tanpa menyentuh klinik. */
function siangHari(target: number): GameState {
  let s = buildInitialState('Uji', SEED, PACK)
  while (s.hari < target) {
    s = bereskanIgd(s)
    s = run(s, { type: 'LANJUTKAN' }) // pagi → siang
    s = run(s, { type: 'LANJUTKAN' }) // siang → sore
    s = run(s, { type: 'LANJUTKAN' }) // sore → pagi besok
  }
  s = bereskanIgd(s)
  s = run(s, { type: 'LANJUTKAN' }) // pagi → siang
  expect(s.blok).toBe('siang')
  return s
}

/** Selesaikan sesi kegiatan aktif dengan semua jawaban benar. */
function selesaikanSemuaBenar(s0: GameState): GameState {
  let s = s0
  while (s.kegiatan) {
    const kg = s.kegiatan
    const kartu = kg.kartu[kg.index]
    if (!kartu) break
    const benar = kartu.pilihan.find((p) => p.benar) ?? kartu.pilihan[0]!
    s = run(s, { type: 'JAWAB_KEGIATAN', kartuId: kartu.id, pilihanId: benar.id })
  }
  return s
}

describe('M2 — unlock & guard', () => {
  it('Posyandu terkunci sebelum hari 15', () => {
    const s = siangHari(10)
    const r = ev(s, { type: 'MULAI_POSYANDU', rw: 1 })
    expect(r.state.kegiatan).toBeUndefined()
    expect(r.events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
  })

  it('Posyandu terbuka di hari 15 dan cooldown 30 hari ditegakkan', () => {
    let s = siangHari(HARI_BUKA_POSYANDU)
    s = run(s, { type: 'MULAI_POSYANDU', rw: 1 })
    expect(s.kegiatan?.jenis).toBe('posyandu')
    s = selesaikanSemuaBenar(s)
    expect(s.tally.posyanduSesi).toBe(1)
    expect(s.posyanduRwTerakhir['1']).toBe(HARI_BUKA_POSYANDU)
    // Slot lapangan hari itu sudah terpakai.
    expect(s.lapanganTerpakai).toBe(true)
    const r = ev(s, { type: 'MULAI_POSYANDU', rw: 2 })
    expect(r.events.some((e) => e.type === 'ERROR_AKSI')).toBe(true) // slot habis
  })

  it('slot lapangan TUNGGAL: setelah Posyandu, kunjungan rumah ikut ditolak (CODEX ronde-baru #1)', () => {
    let s = siangHari(HARI_BUKA_POSYANDU)
    s = run(s, { type: 'MULAI_POSYANDU', rw: 1 })
    s = selesaikanSemuaBenar(s)
    expect(s.lapanganTerpakai).toBe(true)
    // Isolasi guard SLOT: (a) keluarga_santoso adalah keluarga yang BISA dikunjungi
    // di hari 15 (keluarga_wulan sudah krisis/arcSelesai, akan ditolak dgn alasan
    // LAIN → green palsu); (b) stamina dipenuhi agar bukan "kurang stamina" yang
    // menolak. Dengan begitu satu-satunya yang bisa menolak = lapanganTerpakai.
    // Sebelum fix: MULAI_KUNJUNGAN cuma cek hasilKunjunganHariIni (masih kosong)
    // → kunjungan santoso MULAI, memakai slot siang kedua kali di hari yang sama.
    s = { ...s, stamina: 6 }
    const r = ev(s, { type: 'MULAI_KUNJUNGAN', keluargaId: 'keluarga_santoso' })
    const errEv = r.events.find((e) => e.type === 'ERROR_AKSI')
    expect(errEv && 'pesan' in errEv ? errEv.pesan : '').toContain('Slot lapangan')
    expect(r.state.kunjungan).toBeUndefined()
    expect(r.state.layar).not.toBe('kunjungan')
  })
})

describe('M2.7 — Posyandu menaikkan IKS RW', () => {
  it('sesi sempurna menambah bonusIks RW', () => {
    let s = siangHari(HARI_BUKA_POSYANDU)
    const bonusSebelum = s.desa.rw.find((r) => r.nomor === 3)!.bonusIks
    s = run(s, { type: 'MULAI_POSYANDU', rw: 3 })
    s = selesaikanSemuaBenar(s)
    const bonusSesudah = s.desa.rw.find((r) => r.nomor === 3)!.bonusIks
    expect(bonusSesudah).toBeGreaterThan(bonusSebelum)
  })
})

describe('M2.8 — Prolanis roster & jembatan UKP', () => {
  it('roster terbentuk di hari 30 dari warga kronis', () => {
    const s = siangHari(HARI_BUKA_PROLANIS)
    expect(s.prolanis.roster.length).toBeGreaterThan(0)
    // Semua peserta HT/DM, mulai tak terkontrol.
    for (const p of s.prolanis.roster) {
      expect(['ht', 'dm']).toContain(p.jenis)
      expect(p.param).toBeGreaterThan(p.jenis === 'ht' ? 140 : 200)
    }
  })

  it('dua sesi lalai berturut → peserta jadi pasien komplikasi bernama di poli', () => {
    let s = siangHari(HARI_BUKA_PROLANIS)
    const target = s.prolanis.roster[0]!
    // Sesi 1: semua jawaban SALAH → parameter naik, takTerkontrol +1.
    s = run(s, { type: 'MULAI_PROLANIS' })
    while (s.kegiatan) {
      const kg = s.kegiatan
      const kartu = kg.kartu[kg.index]!
      const salah = kartu.pilihan.find((p) => !p.benar) ?? kartu.pilihan[0]!
      s = run(s, { type: 'JAWAB_KEGIATAN', kartuId: kartu.id, pilihanId: salah.id })
    }
    expect(s.tally.prolanisSesi).toBe(1)
    // Maju ke bulan berikutnya, sesi 2 salah lagi → jadwal komplikasi muncul.
    s = siangDariState(s, s.hari + 30)
    s = run(s, { type: 'MULAI_PROLANIS' })
    while (s.kegiatan) {
      const kg = s.kegiatan
      const kartu = kg.kartu[kg.index]!
      const salah = kartu.pilihan.find((p) => !p.benar) ?? kartu.pilihan[0]!
      s = run(s, { type: 'JAWAB_KEGIATAN', kartuId: kartu.id, pilihanId: salah.id })
    }
    const adaKomplikasi = s.jadwal.some(
      (j) => j.jenis === 'pasien_kembali' && j.nama === target.nama && j.id.includes('prolanis'),
    )
    expect(adaKomplikasi).toBe(true)
  })
})

describe('M2.9 — Respons KLB memutus kluster', () => {
  it('respons KLB tuntas menghapus kluster + entri surveilans', () => {
    // Bangun kluster dengue di RW 4, lalu turun ke hari KLB.
    let s = buildInitialState('Uji', SEED, PACK)
    s = {
      ...s,
      desa: {
        ...s.desa,
        surveilans: [
          { hari: 1, rw: 4, kasusId: 'dengue_df' },
          { hari: 1, rw: 4, kasusId: 'dengue_df' },
        ],
      },
    }
    s = siangDariState(s, HARI_BUKA_KLB)
    // Kluster masih ada? entri surveilans di-inject fresh tiap hari? Tidak —
    // kita inject ulang di hari KLB untuk memastikan kluster aktif saat aksi.
    s = {
      ...s,
      desa: {
        ...s.desa,
        surveilans: [
          { hari: s.hari, rw: 4, kasusId: 'dengue_df' },
          { hari: s.hari, rw: 4, kasusId: 'dengue_df' },
        ],
      },
    }
    s = run(s, { type: 'MULAI_KLB', rw: 4, kasusId: 'dengue_df' })
    expect(s.kegiatan?.jenis).toBe('klb')
    s = selesaikanSemuaBenar(s)
    expect(s.tally.klbTuntas).toBe(1)
    expect(s.desa.surveilans.filter((e) => e.rw === 4 && e.kasusId === 'dengue_df')).toHaveLength(0)
  })
})

describe('M2.11 — Lokakarya Mini flag', () => {
  it('flag lokmin menyala di hari 31', () => {
    const s = siangHari(31)
    // siangHari(31) melewati transisi ke hari 31 → flag di-set di hariBaru.
    expect(s.flags['lokmin31']).toBe(true)
    expect(s.flags['lokminDitutup']).toBe(false)
  })
})

describe('M2.10 — Program Wilayah: Triase Anggaran BULANAN (DeepThink Q4)', () => {
  it('fokus terkunci sepanjang bulan yang sama — ganti ke fokus lain ditolak', () => {
    let s = siangHari(HARI_BUKA_POSYANDU) // hari > HARI_BUKA_PETA, blok siang
    s = run(s, { type: 'TETAPKAN_PROGRAM', fokus: 'psn' })
    expect(s.program.fokus).toBe('psn')
    const r = ev(s, { type: 'TETAPKAN_PROGRAM', fokus: 'phbs' })
    expect(r.state.program.fokus).toBe('psn') // tak berubah
    expect(r.events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
  })

  it('menetapkan fokus yang SAMA lagi tidak dianggap pelanggaran kunci', () => {
    let s = siangHari(HARI_BUKA_POSYANDU)
    s = run(s, { type: 'TETAPKAN_PROGRAM', fokus: 'psn' })
    const r = ev(s, { type: 'TETAPKAN_PROGRAM', fokus: 'psn' })
    expect(r.events.some((e) => e.type === 'ERROR_AKSI')).toBe(false)
  })

  it('bulan berikutnya (+30 hari) → fokus baru bisa ditetapkan', () => {
    let s = siangHari(HARI_BUKA_POSYANDU)
    s = run(s, { type: 'TETAPKAN_PROGRAM', fokus: 'psn' })
    s = siangDariState(s, s.hari + 30)
    const r = ev(s, { type: 'TETAPKAN_PROGRAM', fokus: 'skrining' })
    expect(r.state.program.fokus).toBe('skrining')
    expect(r.events.some((e) => e.type === 'ERROR_AKSI')).toBe(false)
  })
})

/* -- util lokal -------------------------------------------------------------- */
function siangDariState(s0: GameState, target: number): GameState {
  let s = s0
  while (s.hari < target) {
    s = bereskanIgd(s)
    if (s.blok === 'pagi') s = run(s, { type: 'LANJUTKAN' })
    if (s.blok === 'siang') s = run(s, { type: 'LANJUTKAN' })
    if (s.blok === 'sore') s = run(s, { type: 'LANJUTKAN' })
  }
  s = bereskanIgd(s)
  while (s.blok !== 'siang') s = run(s, { type: 'LANJUTKAN' })
  return s
}
