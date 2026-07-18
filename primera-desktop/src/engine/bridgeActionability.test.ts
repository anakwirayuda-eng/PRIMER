import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { buildInitialState } from './init'
import { advance } from './reducer'
import { arcKunjunganAktif } from './kunjungan'
import type { GameState, KeluargaState } from './state'

function tanpaRisikoLama(keluarga: KeluargaState): KeluargaState {
  const {
    karmaAktif: _karma,
    followUpHari: _followUp,
    kunjunganTerakhir: _terakhir,
    arcSelesai: _selesai,
    ...bersih
  } = keluarga
  return { ...bersih, jumlahKunjungan: 0 }
}

describe('Bridge actionability - drift keluarga selalu dapat dipulihkan', () => {
  it('indikator yang dijatuhkan harus merupakan target final arc aktif', () => {
    const keluargaId = 'keluarga_wulan'
    const content = PACK.keluarga[keluargaId]!
    const targetFinal = new Set(
      arcKunjunganAktif(PACK, content, 'karier', PACK.runtimeManifest.contentRelease).at(-1)!.target,
    )
    const labelTarget = [...targetFinal].map((id) => id.replace(/_/g, ' '))
    let driftTeramati = 0

    for (let seed = 1; seed <= 160; seed++) {
      const awal = buildInitialState('Uji Drift Actionable', seed, PACK)
      const keluargaAwal = awal.desa.keluarga[keluargaId]!
      const indikator = Object.fromEntries(
        Object.entries(keluargaAwal.indikator).map(([id, nilai]) => [
          id,
          nilai.statusSebenarnya === 'na'
            ? nilai
            : { status: 'ya', statusSebenarnya: 'ya', sumber: 'kader', hariData: 1 },
        ]),
      ) as KeluargaState['indikator']
      const keluargaLain = Object.fromEntries(
        Object.entries(awal.desa.keluarga).map(([id, keluarga]) => [id, tanpaRisikoLama(keluarga)]),
      )
      const state: GameState = {
        ...awal,
        seed,
        hari: 8,
        blok: 'sore',
        tutorialAktif: false,
        inbox: [],
        jadwal: [],
        igd: undefined,
        klinik: { ...awal.klinik, antrian: [], aktif: undefined },
        desa: {
          ...awal.desa,
          binaan: [keluargaId],
          keluarga: {
            ...keluargaLain,
            [keluargaId]: {
              ...tanpaRisikoLama(keluargaAwal),
              ttm: 'prekontemplasi',
              jumlahKunjungan: 1,
              kunjunganTerakhir: 1,
              indikator,
            },
          },
        },
      }

      const akhir = advance(state, { type: 'LANJUTKAN' }, PACK).state
      const surat = akhir.inbox.find(
        (item) => item.judul === `${content.namaKeluarga} — kabar kurang baik`,
      )
      if (!surat) continue
      driftTeramati += 1
      expect(labelTarget.some((label) => surat.isi.includes(`indikator ${label} kembali jatuh`))).toBe(true)
    }

    expect(driftTeramati).toBeGreaterThan(0)
  })
})
