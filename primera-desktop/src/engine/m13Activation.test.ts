import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { CONTENT_RELEASE } from '@content/pack'
import { buatPasienDariKasus } from './director'
import { Rng } from './core/rng'
import { rumahSakitCocokUntukIgd, buatIgd } from './igd'
import { buildInitialState } from './init'
import { advance } from './reducer'
import { deserialize, serialize } from './save'
import { formatUsia } from './usia'

describe('M13-1a - integritas aktivasi runtime', () => {
  it('Nayla digenerasikan, ditampilkan, dan dipersist sebagai bayi 3 bulan', () => {
    const pasien = buatPasienDariKasus(
      'diare_akut_bayi_dehidrasi_berat',
      PACK,
      new Rng(13, 'usia-bayi'),
    )
    expect(pasien.usia).toBe(0)
    expect(pasien.usiaBulan).toBe(3)
    expect(formatUsia(pasien.usia, pasien.usiaBulan)).toBe('3 bulan')
    expect(formatUsia(0)).toBe('<1 tahun')
    expect(formatUsia(7)).toBe('7 tahun')
    expect(formatUsia(7, 3)).toBe('7 tahun')

    const awal = buildInitialState('Uji', 13, PACK)
    const state = {
      ...awal,
      klinik: { ...awal.klinik, antrian: [pasien] },
    }
    const pulih = deserialize(serialize(state), PACK)
    expect(pulih?.klinik.antrian[0]).toEqual(expect.objectContaining({ usia: 0, usiaBulan: 3 }))
  })

  it('STEMI hanya cocok dengan RS berkapabilitas fibrinolisis atau PCI primer 24/7', () => {
    const kasus = PACK.kasusIgd.igd_stemi_anterior_hipoksemik!
    const pratama = PACK.rumahSakit.find((rs) => rs.id === 'rsud_pratama')!
    const kertosono = PACK.rumahSakit.find((rs) => rs.id === 'rsud_kertosono')!
    const provinsi = PACK.rumahSakit.find((rs) => rs.id === 'rsud_provinsi')!

    expect(rumahSakitCocokUntukIgd(kasus, pratama)).toBe(false)
    expect(rumahSakitCocokUntukIgd(kasus, kertosono)).toBe(true)
    expect(rumahSakitCocokUntukIgd(kasus, provinsi)).toBe(true)
  })

  it('reducer menolak tujuan STEMI tanpa reperfusi dan menerima jejaring yang sesuai', () => {
    const kasus = PACK.kasusIgd.igd_stemi_anterior_hipoksemik!
    const igd = {
      ...buatIgd(kasus, PACK, new Rng(14, 'igd-stemi-routing')),
      fase: 'disposisi' as const,
      stabilitas: 80,
      jawaban: kasus.langkah.map((langkah) => ({
        langkahId: langkah.id,
        pilihanId: langkah.pilihan.find((pilihan) => pilihan.benar)!.id,
        benar: true,
      })),
    }
    const dasar = { ...buildInitialState('Uji', 14, PACK), igd, contentRelease: CONTENT_RELEASE }

    const salah = advance(
      dasar,
      { type: 'DISPOSISI_IGD', jenis: 'rujuk', rumahSakitId: 'rsud_pratama' },
      PACK,
    ).state
    const benar = advance(
      dasar,
      { type: 'DISPOSISI_IGD', jenis: 'rujuk', rumahSakitId: 'rsud_kertosono' },
      PACK,
    ).state

    expect(salah.tally.igdSalahDisposisi).toBe(dasar.tally.igdSalahDisposisi + 1)
    expect(salah.tally.igdStabil).toBe(dasar.tally.igdStabil)
    expect(benar.tally.igdStabil).toBe(dasar.tally.igdStabil + 1)
    expect(benar.tally.igdSalahDisposisi).toBe(dasar.tally.igdSalahDisposisi)
  })
})
