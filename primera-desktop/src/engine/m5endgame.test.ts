/**
 * M5 — endgame: kurva pacing per fase (22), layar laporan & kunci (23),
 * badge (24). Slot manual & meta lintas-playthrough (24/25) hidup di store
 * renderer (persistensi) — engine-nya (hitungBadge, serialize) dites di sini.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState } from './state'
import { advance } from './reducer'
import { buildInitialState } from './init'
import { jumlahPasienHarian, peluangIgd, susunAntrianHarian } from './director'
import { hitungBadge, SEMUA_BADGE } from './badge'
import { Rng } from './core/rng'

describe('M5.22 — kurva pacing per fase', () => {
  it('jumlah pasien: 2 onboarding → 3 tengah → 4 tekanan penuh (karier & ujian proporsional)', () => {
    // Karier (90 hari): fase akhir mulai > hari 60.
    expect(jumlahPasienHarian(1, 'karier')).toBe(2)
    expect(jumlahPasienHarian(2, 'karier')).toBe(2)
    expect(jumlahPasienHarian(30, 'karier')).toBe(3)
    expect(jumlahPasienHarian(60, 'karier')).toBe(3)
    expect(jumlahPasienHarian(61, 'karier')).toBe(4)
    expect(jumlahPasienHarian(90, 'karier')).toBe(4)
    // Ujian (30 hari): kurva sama dipadatkan 3× — fase akhir mulai > hari 20.
    expect(jumlahPasienHarian(10, 'ujian')).toBe(3)
    expect(jumlahPasienHarian(20, 'ujian')).toBe(3)
    expect(jumlahPasienHarian(21, 'ujian')).toBe(4)
  })

  it('peluang IGD naik per fase: 0.12 → 0.15 → 0.20', () => {
    expect(peluangIgd(10, 'karier')).toBe(0.12)
    expect(peluangIgd(45, 'karier')).toBe(0.15)
    expect(peluangIgd(75, 'karier')).toBe(0.2)
    expect(peluangIgd(5, 'ujian')).toBe(0.12)
    expect(peluangIgd(15, 'ujian')).toBe(0.15)
    expect(peluangIgd(25, 'ujian')).toBe(0.2)
  })

  it('antrian fase akhir benar-benar berisi 4 pasien', () => {
    const s = buildInitialState('Uji', 42, PACK)
    const antrian = susunAntrianHarian({ ...s, hari: 70 }, PACK, new Rng(1, 'd', 70))
    expect(antrian).toHaveLength(4)
  })

  it('cakupan kategori: kategori belum tersentuh lebih sering muncul dari yang sudah', () => {
    // Dex penuh untuk semua kasus non-jiwa membuat kategori jiwa tertinggal.
    // Bandingkan terhadap baseline pada seed identik; jumlah absolut sengaja
    // tidak dikunci karena governance prototipe membatasi pool formal harian.
    const dex: GameState['dex'] = {}
    for (const k of Object.values(PACK.kasus)) {
      if (k.kategori === 'jiwa') continue
      dex[k.id] = { kasusId: k.id, ditangani: 3, benar: 3, bintang: 2, terakhirHari: 9 }
    }
    const dasar = { ...buildInitialState('Uji', 42, PACK), hari: 40 }
    const tertinggal = { ...dasar, dex }
    let jiwaBaseline = 0
    let jiwaTertinggal = 0
    for (let seed = 0; seed < 200; seed++) {
      const baseline = susunAntrianHarian(dasar, PACK, new Rng(seed, 'kat'))
      const denganBoost = susunAntrianHarian(tertinggal, PACK, new Rng(seed, 'kat'))
      jiwaBaseline += baseline.filter((p) => PACK.kasus[p.kasusId]?.kategori === 'jiwa').length
      jiwaTertinggal += denganBoost.filter((p) => PACK.kasus[p.kasusId]?.kategori === 'jiwa').length
    }
    expect(jiwaTertinggal).toBeGreaterThan(jiwaBaseline)
  })
})

describe('M5.23 — layar laporan & guard', () => {
  it('tamat mengarahkan ke layar laporan; sebelum tamat PINDAH_LAYAR laporan ditolak', () => {
    let s = buildInitialState('Uji', 8, PACK, { mode: 'ujian' })
    const rTolak = advance(s, { type: 'PINDAH_LAYAR', layar: 'laporan' }, PACK)
    expect(rTolak.events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
    s = { ...s, hari: 30, blok: 'sore', igd: undefined }
    const r = advance(s, { type: 'LANJUTKAN' }, PACK)
    expect(r.state.layar).toBe('laporan')
    // Setelah tamat, layar laporan boleh dibuka kapan saja.
    const kembali = advance({ ...r.state, layar: 'meja' }, { type: 'PINDAH_LAYAR', layar: 'laporan' }, PACK)
    expect(kembali.state.layar).toBe('laporan')
  })
})

describe('M5.24 — badge', () => {
  it('9 badge terdefinisi dengan id unik', () => {
    expect(SEMUA_BADGE).toHaveLength(9)
    expect(new Set(SEMUA_BADGE.map((b) => b.id)).size).toBe(9)
  })

  it('state kosong tak meraih apa-apa; state rekayasa meraih badge yang tepat', () => {
    const kosong = buildInitialState('Uji', 1, PACK)
    // bendahara_rapi butuh hari>=30 — state awal (hari 1) tidak memenuhinya.
    expect(hitungBadge(kosong)).toEqual([])

    const jagoan: GameState = {
      ...kosong,
      hari: 30,
      akreditasi: 'paripurna',
      tally: {
        ...kosong.tally,
        totalPasien: 20,
        diagnosisBenar: 20,
        tegakBenar: 20,
        rujukanTotal: 6,
        rujukanNonSpesialistik: 0,
        igdStabil: 2,
        igdMeninggal: 0,
        karmaDicegah: 4,
        kunjunganTotal: 15,
        apathy: 0,
      },
    }
    const raih = hitungBadge(jagoan)
    for (const id of ['nol_kode_hitam', 'gerbang_kokoh', 'pencegah_takdir', 'paripurna', 'bendahara_rapi', 'anti_apatis']) {
      expect(raih).toContain(id)
    }
    expect(raih).not.toContain('kolektor_dex') // dex masih kosong
  })

  it('kode hitam menggagalkan badge Penjaga Nyawa', () => {
    const s = buildInitialState('Uji', 1, PACK)
    const dgnKodeHitam = { ...s, tally: { ...s.tally, igdStabil: 3, igdMeninggal: 1 } }
    expect(hitungBadge(dgnKodeHitam)).not.toContain('nol_kode_hitam')
  })
})
