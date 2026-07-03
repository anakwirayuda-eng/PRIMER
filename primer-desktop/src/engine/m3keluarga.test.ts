/**
 * M3c — 16 keluarga binaan + arc panjang-variabel (1/2/3 babak) + roster 16.
 * Arc tamat kini diikat ke "skenario terakhir sukses" (bukan TTM) — test ini
 * mengunci perilaku itu untuk ketiga panjang arc.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState, KeluargaState, HasilKunjungan } from './state'
import type { Action } from './actions'
import { advance, MAKS_BINAAN } from './reducer'
import { buildInitialState } from './init'
import { terapkanHasil } from './kunjungan'

const SEED = 777

function run(s: GameState, a: Action): GameState {
  return advance(s, a, PACK).state
}

/** Hasil kunjungan sukses sintetis untuk skenario tertentu. */
function hasilSukses(keluargaId: string, skenarioId: string): HasilKunjungan {
  return {
    keluargaId,
    skenarioId,
    berhasil: true,
    diusir: false,
    hipotesisBenar: true,
    trustDelta: 2,
    kualitasMi: 100,
    indikatorTerverifikasi: [],
    narasiPenutup: 'ok',
    tingkat: 'berhasil',
  }
}

describe('M3c — konten 16 keluarga', () => {
  it('pack memuat 16 keluarga dengan RW tersebar merata (2 per RW)', () => {
    const semua = Object.values(PACK.keluarga)
    expect(semua).toHaveLength(16)
    const perRw = new Map<number, number>()
    for (const k of semua) perRw.set(k.rw, (perRw.get(k.rw) ?? 0) + 1)
    for (let rw = 1; rw <= 8; rw++) expect(perRw.get(rw)).toBe(2)
  })

  it('karma keluarga tersebar sepanjang kampanye (bukan menumpuk minggu pertama)', () => {
    const jatuhTempo = Object.values(PACK.keluarga)
      .map((k) => k.arc.kunjungan[0]?.karma?.jatuhTempoHari)
      .filter((h): h is number => h !== undefined)
      .sort((a, b) => a - b)
    expect(jatuhTempo.length).toBeGreaterThanOrEqual(8)
    // Paling cepat pekan pertama (Bu Wulan D6), paling lambat pertengahan akhir.
    expect(jatuhTempo[0]).toBeLessThanOrEqual(7)
    expect(jatuhTempo[jatuhTempo.length - 1]).toBeGreaterThanOrEqual(45)
    // Tidak ada dua krisis berjarak < 2 hari (drumbeat, bukan banjir).
    for (let i = 1; i < jatuhTempo.length; i++) {
      expect(jatuhTempo[i]! - jatuhTempo[i - 1]!).toBeGreaterThanOrEqual(2)
    }
  })

  it('semua karma dijadwalkan sejak hari 1 dengan identitas anggota', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const karma = s.jadwal.filter((j) => j.jenis === 'karma_igd')
    const punyaKarma = Object.values(PACK.keluarga).filter((k) => k.arc.kunjungan[0]?.karma)
    expect(karma).toHaveLength(punyaKarma.length)
    for (const j of karma) expect(j.nama).toBeTruthy()
  })

  it('bumil risti (keluarga_asih) adalah arc 3-babak dengan karma preeklampsia', () => {
    const asih = PACK.keluarga['keluarga_asih']!
    expect(asih.arc.kunjungan).toHaveLength(3)
    expect(asih.arc.kunjungan[0]!.karma?.kasusId).toBe('kia_preeklampsia_berat')
    // Skoring risiko KIA hidup di konten kunjungan (Poedji Rochjati di K2).
    expect(JSON.stringify(asih.arc.kunjungan[1])).toContain('Poedji Rochjati')
  })
})

describe('M3c — arc panjang-variabel (terapkanHasil)', () => {
  function kelAwal(id: string): KeluargaState {
    const s = buildInitialState('Uji', SEED, PACK)
    return s.desa.keluarga[id]!
  }

  it('arc 1-babak (keluarga_prapto): SATU kunjungan sukses → tamat + indikator target flip', () => {
    const prapto = PACK.keluarga['keluarga_prapto']!
    expect(prapto.arc.kunjungan).toHaveLength(1)
    const skenario = prapto.arc.kunjungan[0]!
    const kel = kelAwal('keluarga_prapto')
    const baru = terapkanHasil(kel, hasilSukses(kel.id, skenario.id), skenario, 5, 1)
    expect(baru.arcSelesai).toBe('berhasil')
    expect(baru.indikator.air_bersih.status).toBe('ya')
    expect(baru.ttm).toBe('kontemplasi') // TTM tetap jalan sendiri — tak lagi mengikat tamat.
  })

  it('arc 3-babak (keluarga_asih): sukses ke-2 BELUM tamat (TTM sudah aksi), sukses ke-3 tamat', () => {
    const asih = PACK.keluarga['keluarga_asih']!
    let kel = kelAwal('keluarga_asih')
    const [k1, k2, k3] = asih.arc.kunjungan
    kel = terapkanHasil(kel, hasilSukses(kel.id, k1!.id), k1!, 5, 3)
    expect(kel.arcSelesai).toBeUndefined()
    kel = terapkanHasil(kel, hasilSukses(kel.id, k2!.id), k2!, 9, 3)
    expect(kel.ttm).toBe('aksi') // di bawah aturan lama ini sudah tamat — bug yang dicegah M3c
    expect(kel.arcSelesai).toBeUndefined()
    expect(kel.arcIndex).toBe(2) // skenario ke-3 kini terjangkau
    kel = terapkanHasil(kel, hasilSukses(kel.id, k3!.id), k3!, 13, 3)
    expect(kel.arcSelesai).toBe('berhasil')
    expect(kel.indikator.persalinan_faskes.status).toBe('ya')
  })

  it('arc 2-babak lama (keluarga_wulan) tak berubah perilaku: sukses ke-2 tamat', () => {
    const wulan = PACK.keluarga['keluarga_wulan']!
    expect(wulan.arc.kunjungan).toHaveLength(2)
    let kel = kelAwal('keluarga_wulan')
    const [k1, k2] = wulan.arc.kunjungan
    kel = terapkanHasil(kel, hasilSukses(kel.id, k1!.id), k1!, 5, 2)
    expect(kel.arcSelesai).toBeUndefined()
    kel = terapkanHasil(kel, hasilSukses(kel.id, k2!.id), k2!, 9, 2)
    expect(kel.arcSelesai).toBe('berhasil')
  })
})

describe('M3c — roster binaan 16', () => {
  it('menerima 16 keluarga; ke-17 ditolak', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = { ...s, hari: 3 } // peta terbuka
    const semuaId = Object.keys(PACK.keluarga)
    expect(semuaId.length).toBe(MAKS_BINAAN)
    for (const id of semuaId) s = run(s, { type: 'PILIH_BINAAN', keluargaId: id })
    expect(s.desa.binaan).toHaveLength(16)
    // Semua sudah masuk — aksi duplikat ditolak dengan error, bukan overflow.
    const r = advance(s, { type: 'PILIH_BINAAN', keluargaId: semuaId[0]! }, PACK)
    expect(r.events.some((e) => e.type === 'ERROR_AKSI')).toBe(true)
    expect(r.state.desa.binaan).toHaveLength(16)
  })
})
