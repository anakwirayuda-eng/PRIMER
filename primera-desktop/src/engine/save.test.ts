/**
 * TEST SAVE — deserialize defensif (CODEX audit 2026-07-04, ronde-8).
 * Probe: save/import yang separuh rusak (nested field bentuknya salah, bukan
 * cuma level-atas) tidak boleh throw atau meracuni ekonomi jadi NaN, dan
 * pasien klinik aktif yang kasusnya sudah hilang tidak boleh soft-lock.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import type { GameState } from './state'
import { buildInitialState } from './init'
import { serialize, deserialize } from './save'
import { advance } from './reducer'
import { buatEncounter } from './clinic'
import { buatPasienDariKasus } from './director'
import { Rng } from './core/rng'

const SEED = 777

/** Bongkar-pasang JSON save utk menyuntik korupsi pada field tertentu. */
function rusak(json: string, ubah: (state: Record<string, unknown>) => void): string {
  const amplop = JSON.parse(json) as { v: number; state: Record<string, unknown> }
  ubah(amplop.state)
  return JSON.stringify(amplop)
}

describe('deserialize — sanitasi gudang/keuanganBulan (temuan #1)', () => {
  it('gudang = {} (objek valid tanpa field stok) tidak throw, dipulihkan ke bentuk aman', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['gudang'] = {}
    })
    let hasil: ReturnType<typeof deserialize>
    expect(() => {
      hasil = deserialize(json, PACK)
    }).not.toThrow()
    expect(hasil!).not.toBeNull()
    expect(hasil!.gudang.stok).toEqual(expect.any(Object))
    expect(hasil!.gudang.pesanan).toEqual([])
  })

  it('gudang.stok[id] bukan angka (mis. string) dibuang, bukan meracuni jadi NaN', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const obatId = Object.keys(PACK.obat)[0]!
    const json = rusak(serialize(s), (st) => {
      const gudang = st['gudang'] as { stok: Record<string, unknown> }
      gudang.stok[obatId] = 'banyak'
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.gudang.stok[obatId]).toBeUndefined() // dibuang, bukan "banyak"

    // Prescribing obat ini setelahnya TIDAK meracuni skorTerapi/kapitasi jadi NaN
    // (entri hilang = "tak dilacak", gerbang stok lolos — perilaku yang sudah ada).
    let cur: GameState = { ...hasil, klinik: { ...hasil.klinik, aktif: undefined } }
    cur = advance(cur, { type: 'PANGGIL_PASIEN' }, PACK).state
    if (cur.klinik.aktif) {
      const r = advance(cur, { type: 'TAMBAH_OBAT', obatId }, PACK)
      expect(Number.isFinite(r.state.kapitasi)).toBe(true)
    }
  })

  it('keuanganBulan = {} (tanpa field) tidak membuat belanjaObat jadi NaN', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['keuanganBulan'] = {}
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.keuanganBulan.belanjaObat).toBe(0)
    expect(hasil.keuanganBulan.belanjaPengadaan).toBe(0)
  })

  it('gudang.pesanan berisi entri cacat (bukan objek/field hilang) difilter, tidak throw', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      const gudang = st['gudang'] as { pesanan: unknown[] }
      gudang.pesanan = [null, 'rusak', { obatId: 'x' }, { obatId: 'y', jumlah: 20, tibaHari: 5 }]
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.gudang.pesanan).toHaveLength(1)
    expect(hasil.gudang.pesanan[0]?.obatId).toBe('y')
  })
})

describe('serialize/deserialize - state closure longitudinal', () => {
  it('mempertahankan status pasca-RJP dan episode pemulihan keluarga yang spesifik', () => {
    const awal = buildInitialState('Uji', SEED, PACK)
    const kasusId = Object.keys(PACK.kasusIgd)[0]!
    const wulan = awal.desa.keluarga['keluarga_wulan']!
    const state: GameState = {
      ...awal,
      desa: {
        ...awal.desa,
        keluarga: {
          ...awal.desa.keluarga,
          keluarga_wulan: { ...wulan, pemulihanEpisodeId: 'episode_uji_wulan' },
        },
      },
      igd: {
        kasusId,
        pasienNama: 'Uji',
        usia: 30,
        jenisKelamin: 'L',
        rw: 1,
        fase: 'langkah',
        langkahIndex: 0,
        stabilitas: 80,
        jawaban: [],
        melewatiKodeBiru: true,
      },
    }

    const pulih = deserialize(serialize(state), PACK)!
    expect(pulih.igd?.melewatiKodeBiru).toBe(true)
    expect(pulih.desa.keluarga['keluarga_wulan']?.pemulihanEpisodeId).toBe('episode_uji_wulan')
  })
})

describe('deserialize — pemulihan pasien klinik tak dikenal (temuan #2)', () => {
  it('klinik.aktif dengan kasusId yang sudah tak ada di pack dipulihkan, bukan soft-lock', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    const pasien = buatPasienDariKasus(Object.keys(PACK.kasus)[0]!, PACK, new Rng(1, 'save-test'))
    const encAsli = buatEncounter(pasien)
    s = { ...s, klinik: { ...s.klinik, aktif: { ...encAsli, pasien: { ...pasien, kasusId: 'kasus_hantu_sudah_dihapus' } } } }

    const json = serialize(s)
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.klinik.aktif).toBeUndefined()
    expect(hasil.inbox.some((m) => m.judul.includes('dipulihkan otomatis'))).toBe(true)

    // Konfirmasi: sebelum fix, setiap aksi lanjutan (termasuk LANJUTKAN) akan
    // menolak selamanya karena klinik.aktif tak pernah kosong. Sesudah fix,
    // pemain bisa lanjut hari & panggil pasien baru seperti biasa.
    const setelahLanjut = advance(hasil, { type: 'LANJUTKAN' }, PACK)
    expect(setelahLanjut.events.some((e) => e.type === 'ERROR_AKSI')).toBe(false)
  })

  it('klinik.aktif dengan kasusId yang MASIH ada di pack tidak disentuh', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = advance(s, { type: 'PANGGIL_PASIEN' }, PACK).state
    const kasusIdAsli = s.klinik.aktif!.pasien.kasusId

    const json = serialize(s)
    const hasil = deserialize(json, PACK)!
    expect(hasil.klinik.aktif).toBeDefined()
    expect(hasil.klinik.aktif!.pasien.kasusId).toBe(kasusIdAsli)
    expect(hasil.inbox.some((m) => m.judul.includes('dipulihkan otomatis'))).toBe(false)
  })
})

describe('deserialize — sanitasi nested klinik/desa.rw/prolanis/program (CODEX ronde-baru #3)', () => {
  it('klinik = {} (tanpa antrian) dipulihkan ke bentuk aman, LANJUTKAN tidak throw', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['klinik'] = {}
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.klinik.antrian).toEqual([])
    expect(hasil.klinik.selesaiHariIni).toEqual([])
    expect(() => advance(hasil, { type: 'LANJUTKAN' }, PACK)).not.toThrow()
  })

  it('klinik.antrian = null dipulihkan ke array kosong', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      ;(st['klinik'] as Record<string, unknown>)['antrian'] = null
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.klinik.antrian).toEqual([])
  })

  it('desa.rw = {} (bukan array) ditolak sebagai save tak terpulihkan (null), bukan throw nanti', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      ;(st['desa'] as Record<string, unknown>)['rw'] = {}
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('desa.rw = [] (array kosong) juga ditolak (null)', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      ;(st['desa'] as Record<string, unknown>)['rw'] = []
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('prolanis = {} (tanpa roster) dipulihkan ke roster kosong', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['prolanis'] = {}
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.prolanis.roster).toEqual([])
  })

  it('program.fokus tak dikenal dibuang (dianggap belum menetapkan program)', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['program'] = { fokus: 'tidak_valid', rwFokus: 3 }
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.program.fokus).toBeUndefined()
    expect(hasil.program.rwFokus).toBeUndefined()
  })

  it('program.fokus valid dipertahankan apa adanya', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['program'] = { fokus: 'psn', rwFokus: 2 }
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil.program.fokus).toBe('psn')
    expect(hasil.program.rwFokus).toBe(2)
  })
})

describe('deserialize — desa.keluarga/desa.rw/layar (CODEX ronde-11 #3)', () => {
  it('desa.keluarga = null ditolak (bukan sekadar dibiarkan lolos lalu throw di LANJUTKAN)', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      ;(st['desa'] as Record<string, unknown>)['keluarga'] = null
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('desa.keluarga = array (bukan objek) juga ditolak', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      ;(st['desa'] as Record<string, unknown>)['keluarga'] = []
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('entri desa.rw berupa string (bukan objek) ditolak, bukan throw saat backfill bonusIks', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      const desa = st['desa'] as Record<string, unknown>
      const rw = desa['rw'] as unknown[]
      desa['rw'] = ['entri_rusak', ...rw.slice(1)]
    })
    expect(() => deserialize(json, PACK)).not.toThrow()
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('layar tak dikenal dipulihkan ke "meja" bila tak ada sesi aktif', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['layar'] = 'layar_hantu_tak_dikenal'
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.layar).toBe('meja')
  })

  it('layar tak dikenal + kegiatan MASIH aktif dipulihkan ke "kegiatan" (bukan "meja" — cegah kunci baru krn HUD menahan navigasi saat kegiatan aktif)', () => {
    const s: GameState = {
      ...buildInitialState('Uji', SEED, PACK),
      kegiatan: {
        jenis: 'posyandu',
        rw: 1,
        kartu: [{ id: 'k1', judul: 'X', narasi: 'Y', pilihan: [{ id: 'p1', label: 'A', benar: true, respons: 'ok' }] }],
        index: 0,
        jawaban: [],
      },
    }
    const json = rusak(serialize(s), (st) => {
      st['layar'] = 'layar_hantu_tak_dikenal'
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil.layar).toBe('kegiatan')
  })

  it('layar valid dipertahankan apa adanya', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['layar'] = 'dex'
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil.layar).toBe('dex')
  })
})

describe('deserialize — flags/refleksi/desa.kader/prolanis.roster (CODEX ronde-12 #1)', () => {
  it('flags = null dipulihkan ke {} (bukan throw di hariBaru saat baca bonusStaminaBesok)', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['flags'] = null
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.flags).toEqual({})
    expect(() => advance(hasil, { type: 'LANJUTKAN' }, PACK)).not.toThrow()
  })

  it('refleksi = null dipulihkan ke {} (bukan crash render MejaKerja)', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['refleksi'] = null
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil.refleksi).toEqual({})
  })

  it('desa.kader = "rusak" (string) ditolak, bukan lolos lalu throw di kader.ts', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      ;(st['desa'] as Record<string, unknown>)['kader'] = 'rusak'
    })
    expect(() => deserialize(json, PACK)).not.toThrow()
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('prolanis.roster berisi entri bukan-PesertaProlanis disaring, bukan meloloskan narasi "undefined"', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['prolanis'] = {
        roster: [
          'rusak',
          { id: 'x' }, // parsial, kurang field
          { id: 'p1', nama: 'Bu Tuti', usia: 55, jenisKelamin: 'P', rw: 1, jenis: 'ht', param: 150 },
        ],
      }
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.prolanis.roster).toHaveLength(1)
    expect(hasil.prolanis.roster[0]?.id).toBe('p1')
  })
})

describe('deserialize — desa.binaan/surveilans/kader entri & keluarga.indikator (audit CODEX 2026-07-11 #5)', () => {
  it('desa.binaan = null (bukan array) ditolak, bukan lolos lalu throw di director.ts/reducer.ts', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      ;(st['desa'] as Record<string, unknown>)['binaan'] = null
    })
    expect(() => deserialize(json, PACK)).not.toThrow()
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('desa.binaan berisi entri non-string ditolak', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      ;(st['desa'] as Record<string, unknown>)['binaan'] = [123, 'keluarga_x']
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('desa.surveilans berisi entri null ditolak, bukan lolos lalu throw di pangkasSurveilans', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      ;(st['desa'] as Record<string, unknown>)['surveilans'] = [null]
    })
    expect(() => deserialize(json, PACK)).not.toThrow()
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('desa.surveilans berisi entri dgn hari non-numerik ditolak', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      ;(st['desa'] as Record<string, unknown>)['surveilans'] = [{ hari: 'tiga', rw: 1, kasusId: 'flu' }]
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('desa.surveilans dgn entri valid tetap lolos', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      ;(st['desa'] as Record<string, unknown>)['surveilans'] = [{ hari: 3, rw: 1, kasusId: 'flu' }]
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.desa.surveilans).toHaveLength(1)
  })

  it('desa.kader berisi entri null ditolak, bukan lolos lalu throw di kader.ts saat sort', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      const desa = st['desa'] as Record<string, unknown>
      const kader = desa['kader'] as Record<string, unknown>
      desa['kader'] = { ...kader, kader_rusak: null }
    })
    expect(() => deserialize(json, PACK)).not.toThrow()
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('desa.kader berisi entri dgn rw non-numerik ditolak', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      const desa = st['desa'] as Record<string, unknown>
      const kader = desa['kader'] as Record<string, unknown>
      desa['kader'] = { ...kader, kader_rusak: { id: 'kader_rusak', rw: 'satu' } }
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('keluarga[id].indikator hilang (bukan objek) ditolak, bukan lolos lalu throw di hitungIksKeluarga', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      const desa = st['desa'] as Record<string, unknown>
      desa['keluarga'] = {
        keluarga_x: { id: 'keluarga_x', trust: 3, ttm: 'prekontemplasi', arcIndex: 0, jumlahKunjungan: 0 },
      }
    })
    expect(() => deserialize(json, PACK)).not.toThrow()
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('keluarga[id].indikator kehilangan salah satu dari 12 kunci PIS-PK kanonik ditolak', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      const desa = st['desa'] as Record<string, unknown>
      const indikatorParsial = {
        kb: { status: 'ya', statusSebenarnya: 'ya', sumber: 'belum', hariData: 0 },
        // 11 kunci lain SENGAJA hilang.
      }
      desa['keluarga'] = {
        keluarga_x: {
          id: 'keluarga_x',
          trust: 3,
          ttm: 'prekontemplasi',
          arcIndex: 0,
          jumlahKunjungan: 0,
          indikator: indikatorParsial,
        },
      }
    })
    expect(deserialize(json, PACK)).toBeNull()
  })
})

describe('deserialize — kunci tally hilang & entri nested null (CODEX ronde-13)', () => {
  it('tally.tegakBenar hilang seluruhnya (bukan cuma nilai salah) ditolak — bukan lolos jadi NaN', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      delete (st['tally'] as Record<string, unknown>)['tegakBenar']
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('tally.hariKelelahan hilang seluruhnya ditolak (bukan diam-diam NaN saat +=)', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      delete (st['tally'] as Record<string, unknown>)['hariKelelahan']
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('dex.x = null ditolak, bukan lolos lalu throw saat pelunturan bintang di hari baru', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = { ...s, dex: { ...s.dex, kasus_hantu: null as never } }
    const json = serialize(s)
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('desa.keluarga.x = null ditolak, bukan lolos lalu throw saat cek follow-up mangkir', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = { ...s, desa: { ...s.desa, keluarga: { ...s.desa.keluarga, keluarga_hantu: null as never } } }
    const json = serialize(s)
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('dex/desa.keluarga VALID (tanpa entri korup) tetap lolos apa adanya', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = serialize(s)
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.dex).toEqual(s.dex)
    expect(hasil.desa.keluarga).toEqual(s.desa.keluarga)
  })

  it('hari pecahan (mis. 1.5) ditolak — hari harus bilangan bulat', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['hari'] = 1.5
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('seed non-finite (mis. dari JSON 1e999 → Infinity) ditolak', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['seed'] = Infinity
    })
    expect(deserialize(json, PACK)).toBeNull()
  })
})

describe('deserialize — bug hunt 2026-08-01 (NaN non-finite lolos check `typeof === number` lama)', () => {
  it('dex.x.bintang = NaN ditolak, bukan lolos lalu meracuni pelunturan bintang jadi NaN permanen', () => {
    let s = buildInitialState('Uji', SEED, PACK)
    s = {
      ...s,
      dex: {
        ...s.dex,
        kasus_hantu: { kasusId: 'kasus_hantu', ditangani: 1, benar: 1, bintang: NaN, terakhirHari: 1 },
      },
    }
    expect(deserialize(serialize(s), PACK)).toBeNull()
  })

  it('desa.rw[i].bonusIks = NaN dibackfill ke 0, bukan lolos diam-diam meracuni skor IKS', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      const rw = (st['desa'] as Record<string, unknown>)['rw'] as Record<string, unknown>[]
      rw[0]!['bonusIks'] = NaN
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.desa.rw[0]!.bonusIks).toBe(0)
  })

  it('posyanduRwTerakhir korup (NaN) dibuang, bukan lolos membuat gerbang cooldown gagal terbuka', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['posyanduRwTerakhir'] = { '1': NaN, '2': 5 }
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.posyanduRwTerakhir['1']).toBeUndefined()
    expect(hasil.posyanduRwTerakhir['2']).toBe(5)
  })

  it('program.rwFokus non-finite dibuang, bukan lolos membuat kunci program bulanan gagal terbuka', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['program'] = { fokus: 'psn', rwFokus: NaN, periodeDitetapkan: NaN }
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.program.fokus).toBe('psn')
    expect(hasil.program.rwFokus).toBeUndefined()
    expect(hasil.program.periodeDitetapkan).toBeUndefined()
  })

  it('klinik.antrian[i].rw = NaN dibackfill ke 1, bukan lolos menggabung pasien ke kluster "rwNaN" palsu', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      const klinik = st['klinik'] as Record<string, unknown>
      klinik['antrian'] = [{ id: 'p1', nama: 'Pasien Uji', rw: NaN }]
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect((hasil.klinik.antrian[0] as { rw: number }).rw).toBe(1)
  })
})

describe('deserialize — CODEX audit pasca-GM (2026-07-13, temuan #12): tallyTermigrasi', () => {
  it('kunci tally hilang (save versi lama) dibackfill 0 DAN dicatat di tallyTermigrasi', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      delete (st['tally'] as Record<string, unknown>)['posyanduSesi']
      delete (st['tally'] as Record<string, unknown>)['obatBerbahaya']
      delete (st['tally'] as Record<string, unknown>)['tindakanBerbahaya']
      delete (st['tally'] as Record<string, unknown>)['sumSkorProses']
      delete (st['tally'] as Record<string, unknown>)['stabilisasiTerlewat']
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.tally.posyanduSesi).toBe(0)
    expect(hasil.tally.obatBerbahaya).toBe(0)
    expect(hasil.tally.tindakanBerbahaya).toBe(0)
    expect(hasil.tally.sumSkorProses).toBe(0)
    expect(hasil.tally.stabilisasiTerlewat).toBe(0)
    expect(hasil.tallyTermigrasi).toEqual(
      expect.arrayContaining([
        'posyanduSesi',
        'obatBerbahaya',
        'tindakanBerbahaya',
        'sumSkorProses',
        'stabilisasiTerlewat',
      ]),
    )
  })

  it('save UTUH (tak ada kunci tally hilang) tidak dapat tallyTermigrasi sama sekali', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const hasil = deserialize(serialize(s), PACK)!
    expect(hasil.tallyTermigrasi).toBeUndefined()
  })
})

describe('deserialize — M10 §49 CODEX B.5/B.6 (jadwal korup + kunjungan yatim)', () => {
  it('B.5: jadwal:[null] ditolak (bukan crash j.hari saat day-advance)', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['jadwal'] = [null]
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('B.5: jadwal dgn entri hari non-numerik ditolak', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['jadwal'] = [{ id: 'x', jenis: 'hasil_lab', hari: 'besok' }]
    })
    expect(deserialize(json, PACK)).toBeNull()
  })

  it('B.5: jadwal valid (init dgn entri karma) tetap lolos utuh (regresi guard)', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const hasil = deserialize(serialize(s), PACK)
    expect(hasil).not.toBeNull()
    expect(hasil!.jadwal).toEqual(s.jadwal)
    expect(hasil!.jadwal.every((j) => typeof j.hari === 'number')).toBe(true)
  })

  it('B.6: kunjungan aktif dgn keluargaId tak dikenal → dipulihkan (bukan soft-lock)', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const json = rusak(serialize(s), (st) => {
      st['kunjungan'] = { keluargaId: 'keluarga_hantu', skenarioId: 'x', fase: 'observasi', hotspotDitemukan: [], dialogIndex: 0, pilihanDiambil: [], trustDelta: 0, konfrontasiBeruntun: 0, diusir: false }
      st['layar'] = 'kunjungan'
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.kunjungan).toBeUndefined()
    expect(hasil.layar).not.toBe('kunjungan')
    expect(hasil.inbox.some((m) => m.id.startsWith('surat_pemulihan_kunjungan_'))).toBe(true)
  })

  it('B.6: kunjungan aktif dgn skenarioId tak dikenal (keluarga ada) → dipulihkan', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const kelId = Object.keys(PACK.keluarga)[0]!
    const json = rusak(serialize(s), (st) => {
      st['kunjungan'] = { keluargaId: kelId, skenarioId: 'skenario_hantu', fase: 'observasi', hotspotDitemukan: [], dialogIndex: 0, pilihanDiambil: [], trustDelta: 0, konfrontasiBeruntun: 0, diusir: false }
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil.kunjungan).toBeUndefined()
  })

  it('B.6: kunjungan aktif SAH (keluarga+skenario valid) tetap utuh (regresi guard)', () => {
    const s = buildInitialState('Uji', SEED, PACK)
    const kelId = Object.keys(PACK.keluarga)[0]!
    const skenId = PACK.keluarga[kelId]!.arc.kunjungan[0]!.id
    const json = rusak(serialize(s), (st) => {
      st['kunjungan'] = { keluargaId: kelId, skenarioId: skenId, fase: 'observasi', hotspotDitemukan: [], dialogIndex: 0, pilihanDiambil: [], trustDelta: 0, konfrontasiBeruntun: 0, diusir: false }
    })
    const hasil = deserialize(json, PACK)!
    expect(hasil.kunjungan).not.toBeUndefined()
    expect(hasil.kunjungan!.keluargaId).toBe(kelId)
  })
})

describe('deserialize — pemulihan kegiatan korup & IGD langkahIndex di luar batas (CODEX audit UI/UX 2026-07-10, temuan #1)', () => {
  it('kegiatan.kartu kosong (index di luar batas) dipulihkan, bukan soft-lock (PINDAH_LAYAR ditolak selamanya)', () => {
    const s: GameState = {
      ...buildInitialState('Uji', SEED, PACK),
      hari: 2, // >= HARI_BUKA_PETA, agar PINDAH_LAYAR ke 'peta' di bawah tidak ditolak guard kurikuler yang tak terkait
      layar: 'kegiatan',
      kegiatan: { jenis: 'posyandu', rw: 1, kartu: [], index: 0, jawaban: [] },
    }
    const json = serialize(s)
    const hasil = deserialize(json, PACK)!
    expect(hasil).not.toBeNull()
    expect(hasil.kegiatan).toBeUndefined()
    expect(hasil.layar).not.toBe('kegiatan')
    expect(hasil.inbox.some((m) => m.id.startsWith('surat_pemulihan_kegiatan_'))).toBe(true)

    // Konfirmasi: sebelum fix, reducer.ts:112 menolak PINDAH_LAYAR selama
    // s.kegiatan truthy tanpa peduli validitasnya — dead-end permanen.
    const setelahPindah = advance(hasil, { type: 'PINDAH_LAYAR', layar: 'peta' }, PACK)
    expect(setelahPindah.events.some((e) => e.type === 'ERROR_AKSI')).toBe(false)
    expect(setelahPindah.state.layar).toBe('peta')
  })

  it('kegiatan.kartu[index].pilihan bukan array dipulihkan, bukan soft-lock', () => {
    const s: GameState = {
      ...buildInitialState('Uji', SEED, PACK),
      kegiatan: {
        jenis: 'posyandu',
        rw: 1,
        kartu: [{ id: 'k1', judul: 'X', narasi: 'Y', pilihan: 'rusak' as unknown as never }],
        index: 0,
        jawaban: [],
      },
    }
    const json = serialize(s)
    const hasil = deserialize(json, PACK)!
    expect(hasil.kegiatan).toBeUndefined()
    expect(hasil.inbox.some((m) => m.id.startsWith('surat_pemulihan_kegiatan_'))).toBe(true)
  })

  it('kegiatan aktif SAH (kartu+pilihan valid) tetap utuh (regresi guard)', () => {
    const s: GameState = {
      ...buildInitialState('Uji', SEED, PACK),
      kegiatan: {
        jenis: 'posyandu',
        rw: 1,
        kartu: [{ id: 'k1', judul: 'X', narasi: 'Y', pilihan: [{ id: 'p1', label: 'A', benar: true, respons: 'ok' }] }],
        index: 0,
        jawaban: [],
      },
    }
    const json = serialize(s)
    const hasil = deserialize(json, PACK)!
    expect(hasil.kegiatan).not.toBeUndefined()
    expect(hasil.kegiatan!.kartu).toHaveLength(1)
    expect(hasil.inbox.some((m) => m.id.startsWith('surat_pemulihan_kegiatan_'))).toBe(false)
  })

  it('igd.langkahIndex melebihi panjang kasus.langkah dipulihkan (bukan badan kosong+HUD terkunci)', () => {
    const kasusId = Object.keys(PACK.kasusIgd)[0]!
    const jumlahLangkah = PACK.kasusIgd[kasusId]!.langkah.length
    const s: GameState = {
      ...buildInitialState('Uji', SEED, PACK),
      igd: {
        kasusId,
        pasienNama: 'Uji',
        usia: 30,
        jenisKelamin: 'L',
        rw: 1,
        fase: 'langkah',
        langkahIndex: jumlahLangkah + 5, // di luar batas
        stabilitas: 80,
        jawaban: [],
      },
    }
    const json = serialize(s)
    const hasil = deserialize(json, PACK)!
    expect(hasil.igd).toBeUndefined()
    expect(hasil.inbox.some((m) => m.id.startsWith('surat_pemulihan_igd_'))).toBe(true)
  })

  it('igd.langkahIndex valid (dalam batas) tetap utuh (regresi guard)', () => {
    const kasusId = Object.keys(PACK.kasusIgd)[0]!
    const s: GameState = {
      ...buildInitialState('Uji', SEED, PACK),
      igd: {
        kasusId,
        pasienNama: 'Uji',
        usia: 30,
        jenisKelamin: 'L',
        rw: 1,
        fase: 'langkah',
        langkahIndex: 0,
        stabilitas: 80,
        jawaban: [],
      },
    }
    const json = serialize(s)
    const hasil = deserialize(json, PACK)!
    expect(hasil.igd).not.toBeUndefined()
    expect(hasil.igd!.langkahIndex).toBe(0)
  })
})
