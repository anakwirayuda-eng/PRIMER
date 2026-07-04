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
      kegiatan: { jenis: 'posyandu', rw: 1, kartu: [], index: 0, jawaban: [] },
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
