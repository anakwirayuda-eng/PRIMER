import { describe, expect, it } from 'vitest'
import { buildInitialState } from '@engine/init'
import { advance } from '@engine/reducer'
import type { GameState } from '@engine/state'
import { PACK } from '@content/index'
import { deltaIksRw, formatDeltaIks, sumberDataKeluarga, kaderRw } from '../peta/petaUtil'
import { KIA_POSYANDU, jadwalProlanis, sasaranKia, pengirimSurat } from './rencanaUkm'

const awal = () => buildInitialState('Uji 1.3.1', 131, PACK)

describe('data UKM yang diketahui pemain', () => {
  it('kelengkapan dan verifikasi berbeda; perubahan kunci tersembunyi tidak mengubah ringkasan', () => {
    const kel = awal().desa.keluarga.keluarga_wulan!
    for (const n of Object.values(kel.indikator)) if (n.status !== 'na') { n.sumber = 'kader'; n.status = 'ya' }
    expect(sumberDataKeluarga(kel)).toMatchObject({ lengkap: true, terverifikasi: false, komposisi: 'Seluruh data tercatat dari kader' })
    kel.indikator.tidak_merokok.sumber = 'dokter'
    const ringkasan = sumberDataKeluarga(kel)
    expect(ringkasan.komposisi).toBe('Sumber campuran')
    expect(ringkasan.terverifikasi).toBe(false)
    for (const n of Object.values(kel.indikator)) n.statusSebenarnya = 'na'
    expect(sumberDataKeluarga(kel)).toEqual(ringkasan)
    for (const n of Object.values(kel.indikator)) if (n.status !== 'na') n.sumber = 'dokter'
    expect(sumberDataKeluarga(kel).terverifikasi).toBe(true)
    kel.indikator.tidak_merokok.sumber = 'janji'
    expect(sumberDataKeluarga(kel).terverifikasi).toBe(false)
  })
  it('acuan yang tidak tersedia tidak direkayasa menjadi nol atau kemajuan', () => {
    const rw = awal().desa.rw[0]!
    expect(deltaIksRw(rw)).toBeNull()
    expect(formatDeltaIks(null)).toBe('—')
    expect(formatDeltaIks(deltaIksRw({ ...rw, kkTersurvei: 20, iks: .16, proporsiBaselineRoll: .12 }))).toBe('+0,04')
    expect(formatDeltaIks(-.04)).toBe('−0,04')
    expect(formatDeltaIks(-.0000001)).toBe('0,00')
  })
  it('pengirim bernama tetap memuat RW; profil bias dan ketelitian tidak diekspos', () => {
    const state = awal()
    expect(pengirimSurat(state, 'Kader RW 1')).toContain(`${Object.values(state.desa.kader).find((k) => k.rw === 1)!.nama} — kader RW 1`)
    expect(pengirimSurat(state, 'Petugas Surveilans')).toBe('Petugas Surveilans')
    expect(kaderRw(state, 9)).toBeNull()
    expect(Object.keys(kaderRw(state, 1)!)).toEqual(['nama', 'rw'])
  })
  it('sasaran KIA mengecualikan janji, dokter, belum, dan tidak berlaku', () => {
    const state = awal()
    const keluarga = Object.values(PACK.keluarga).find((k) => k.rw === 1)!
    const kel = state.desa.keluarga[keluarga.id]!
    kel.indikator.imunisasi_dasar = { ...kel.indikator.imunisasi_dasar, status: 'ya', sumber: 'kader' }
    kel.indikator.asi_eksklusif = { ...kel.indikator.asi_eksklusif, status: 'ya', sumber: 'janji' }
    kel.indikator.pantau_tumbuh_kembang = { ...kel.indikator.pantau_tumbuh_kembang, status: 'na', sumber: 'kader' }
    expect(sasaranKia(state, 1).find((k) => k.id === keluarga.id)?.kolom).toEqual(['imunisasi_dasar'])
    expect(sasaranKia(state, 9)).toEqual([])
  })
  it('indikator yang dicakup UI tetap sama dengan hasil verifikasi sesi Posyandu engine', () => {
    const ditemukan = new Set<string>()
    for (let seed = 1; seed <= 24; seed++) {
      let state: GameState = { ...buildInitialState('Paritas KIA', seed, PACK), hari: 16, blok: 'siang' }
      for (const kel of Object.values(state.desa.keluarga)) for (const n of Object.values(kel.indikator)) if (n.status !== 'na') n.sumber = 'kader'
      const calon = sasaranKia(state, 1).flatMap((k) => k.kolom.map((ind) => `${k.id}:${ind}`))
      state = advance(state, { type: 'MULAI_POSYANDU', rw: 1 }, PACK).state
      expect(state.kegiatan).toBeDefined()
      while (state.kegiatan) {
        const kartu = state.kegiatan.kartu[state.kegiatan.index]!
        state = advance(state, { type: 'JAWAB_KEGIATAN', kartuId: kartu.id, pilihanId: kartu.pilihan.find((p) => p.benar)!.id }, PACK).state
      }
      for (const [id, kel] of Object.entries(state.desa.keluarga)) for (const [ind, n] of Object.entries(kel.indikator)) if (n.sumber === 'dokter') {
        expect(calon).toContain(`${id}:${ind}`)
        ditemukan.add(ind)
      }
    }
    expect([...ditemukan].sort()).toEqual([...KIA_POSYANDU].sort())
  })
})

describe('kalender Prolanis mengikuti hari aktual', () => {
  for (const mode of ['karier', 'ujian'] as const) it(`batas sesi ketiga dan keterlambatan — ${mode}`, () => {
    const periode = mode === 'karier' ? 30 : 10
    const state = { ...awal(), mode, hari: periode, blok: 'siang' as const }
    expect(jadwalProlanis(state)).toMatchObject({ hari: [periode, periode * 2, periode * 3], rugiJikaTunda: true, totalMungkin: 3 })
    expect(jadwalProlanis({ ...state, hari: periode + 1 })).toMatchObject({ totalMungkin: 2, rugiJikaTunda: false })
    expect(jadwalProlanis({ ...state, lapanganTerpakai: true }).hari[0]).toBe(periode + 1)
    expect(jadwalProlanis({ ...state, blok: 'sore' }).hari[0]).toBe(periode + 1)
    expect(jadwalProlanis({ ...state, hari: periode * 2 + 2, prolanis: { ...state.prolanis, sesiBerikutHari: periode * 2 } }).hari).toEqual([periode * 2 + 2])
  })
})
