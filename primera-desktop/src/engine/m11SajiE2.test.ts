import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { isGayaTerlarang, type SkenarioKunjungan } from '@content/types'
import { validasiPack } from '@content/pack'
import { buildInitialState } from './init'
import { advance } from './reducer'
import { aksiKunjungan, buatKunjungan, selesaikanKunjungan } from './kunjungan'
import { deserialize, serialize } from './save'
import type { Action } from './actions'
import type { GameState, KeluargaState, KunjunganState } from './state'
import { Rng } from './core/rng'

function skenarioKomunikasi(jumlahDialog: number): SkenarioKunjungan {
  return {
    id: `uji_saji_${jumlahDialog}`,
    judul: 'Uji SAJI',
    pembuka: 'Pembuka.',
    target: [],
    hambatanSebenarnya: 'motivasi',
    petunjukHambatan: 'Motivasi.',
    hotspot: [],
    dialog: Array.from({ length: jumlahDialog }, (_, index) => ({
      id: `d${index}`,
      narasi: `Dialog ${index}`,
      pilihan: [
        {
          id: `d${index}_tepat`,
          teks: 'Refleksi.',
          gaya: 'refleksi',
          respons: 'Terima kasih.',
          efekTrust: 0,
          tepat: true,
        },
        {
          id: `d${index}_salah`,
          teks: 'Menghakimi.',
          gaya: 'edukasi',
          respons: 'Saya tidak nyaman.',
          efekTrust: 0,
          tepat: false,
        },
      ],
    })),
    intervensi: [
      {
        id: 'intervensi_tepat',
        nama: 'Intervensi tepat',
        deskripsi: 'Sesuai hambatan.',
        cocokUntuk: ['motivasi'],
        hasilNarasi: 'Disepakati.',
      },
    ],
    pilihanIngatkan: {
      prompt: 'Tutup kunjungan.',
      pilihan: [
        { id: 'ingatkan_tepat', teks: 'Kembali {jadwal}.', tepat: true, respons: 'Jadwal jelas.' },
        { id: 'ingatkan_salah_1', teks: 'Nanti kembali.', tepat: false, respons: 'Jadwal kabur.' },
        { id: 'ingatkan_salah_2', teks: 'Terserah.', tepat: false, respons: 'Tidak ada rencana.' },
      ],
    },
    penutupBerhasil: 'Berhasil.',
    penutupGagal: 'Belum berhasil.',
  }
}

function jalankanSkenario(
  skenario: SkenarioKunjungan,
  jumlahDialogTepat: number,
  ingatkanTepat: boolean,
  kel: KeluargaState,
) {
  let kj: KunjunganState = buatKunjungan(kel.id, skenario, new Rng(7, 'e2-unit'))
  const aksi = (action: Action): void => {
    const hasil = aksiKunjungan(kj, action, skenario, kel)
    expect(hasil.events.some((event) => event.type === 'ERROR_AKSI')).toBe(false)
    kj = hasil.kj
  }
  aksi({ type: 'LANJUT_BABAK' })
  skenario.dialog.forEach((node, index) => {
    aksi({ type: 'PILIH_DIALOG', pilihanId: node.pilihan[index < jumlahDialogTepat ? 0 : 1]!.id })
  })
  aksi({ type: 'LANJUT_BABAK' })
  aksi({ type: 'KOMIT_HAMBATAN', hipotesis: 'motivasi' })
  aksi({ type: 'PILIH_INTERVENSI', intervensiId: 'intervensi_tepat' })
  aksi({ type: 'PILIH_INGATKAN', pilihanId: ingatkanTepat ? 'ingatkan_tepat' : 'ingatkan_salah_1' })
  return selesaikanKunjungan(kj, skenario, kel)
}

function siapKunjungan(keluargaId: string, mode: GameState['mode'] = 'karier'): GameState {
  const awal = buildInitialState('Uji E-2', 1707, PACK)
  return {
    ...awal,
    hari: 3,
    blok: 'siang',
    mode,
    stamina: 6,
    desa: { ...awal.desa, binaan: [keluargaId] },
  }
}

describe('M11 E-2 - SAJI dan penutupan kontak awal', () => {
  it('mengenali tepat empat gaya righting-reflex dan inventaris 82 terklasifikasi penuh', () => {
    expect(['menghakimi', 'menggurui', 'menakut_nakuti', 'memaksa'].every((g) => isGayaTerlarang(g as never))).toBe(true)
    expect(['empati', 'refleksi', 'edukasi'].some((g) => isGayaTerlarang(g as never))).toBe(false)

    const hitung = new Map<string, number>()
    for (const keluarga of Object.values(PACK.keluarga)) {
      for (const skenario of keluarga.arc.kunjungan) {
        for (const pilihan of skenario.dialog.flatMap((node) => node.pilihan)) {
          if (isGayaTerlarang(pilihan.gaya)) hitung.set(pilihan.gaya, (hitung.get(pilihan.gaya) ?? 0) + 1)
          expect(pilihan.gaya as string).not.toBe('konfrontasi')
        }
      }
    }
    expect(Object.fromEntries(hitung)).toEqual({
      menghakimi: 48,
      menggurui: 11,
      menakut_nakuti: 14,
      memaksa: 9,
    })
  })

  it('MI 1/3 + Ingatkan tepat tetap partial; MI 2/4 + Ingatkan salah tetap berhasil', () => {
    const kel = buildInitialState('Unit', 3, PACK).desa.keluarga['keluarga_wulan']!
    const rendah = jalankanSkenario(skenarioKomunikasi(3), 1, true, kel)
    expect(rendah.kualitasMi).toBe(33)
    expect(rendah.kualitasIngatkan).toBe(100)
    expect(rendah.kualitasSaji).toBe(46)
    expect(rendah.berhasil).toBe(false)
    expect(rendah.hasilAkhir).toBe('partial')

    const cukup = jalankanSkenario(skenarioKomunikasi(4), 2, false, kel)
    expect(cukup.kualitasMi).toBe(50)
    expect(cukup.kualitasIngatkan).toBe(0)
    expect(cukup.kualitasSaji).toBe(40)
    expect(cukup.berhasil).toBe(true)
    expect(cukup.hasilAkhir).toBe('berhasil')
  })

  it('penutupan diterima-terpaksa menghormati semua domain skor dan menunda karma sekali', () => {
    const keluargaId = 'keluarga_asih'
    const awal = siapKunjungan(keluargaId)
    const kelAwal = awal.desa.keluarga[keluargaId]!
    const karmaAwal = awal.jadwal.find((j) => j.jenis === 'karma_igd' && j.keluargaId === keluargaId)!
    const mulai = advance(awal, { type: 'MULAI_KUNJUNGAN', keluargaId }, PACK).state
    expect(mulai.kunjungan?.fase).toBe('penerimaan')

    const skenario = PACK.keluarga[keluargaId]!.arc.kunjungan[0]!
    const hormati = skenario.penerimaanAwal!.pilihan.find((p) => p.tindakan === 'hormati')!
    const akhir = advance(mulai, { type: 'RESPONS_PENERIMAAN', pilihanId: hormati.id }, PACK).state
    const kelAkhir = akhir.desa.keluarga[keluargaId]!
    const karmaAkhir = akhir.jadwal.find((j) => j.jenis === 'karma_igd' && j.keluargaId === keluargaId)!

    expect(akhir.hasilKunjunganHariIni?.hasilAkhir).toBe('diterima_terpaksa')
    expect(akhir.tally).toEqual(awal.tally)
    expect(kelAkhir.trust).toBe(kelAwal.trust)
    expect(kelAkhir.ttm).toBe(kelAwal.ttm)
    expect(kelAkhir.arcIndex).toBe(kelAwal.arcIndex)
    expect(kelAkhir.indikator).toEqual(kelAwal.indikator)
    expect(kelAkhir.jumlahKunjungan).toBe(1)
    expect(kelAkhir.followUpHari).toBe(4)
    expect(karmaAkhir.hari).toBe(karmaAwal.hari + 1)
    expect(kelAkhir.karmaAktif?.jatuhTempoHari).toBe(kelAwal.karmaAktif!.jatuhTempoHari + 1)

    const kunjunganBerikut: GameState = {
      ...akhir,
      hari: 4,
      blok: 'siang',
      stamina: 6,
      lapanganTerpakai: false,
      hasilKunjunganHariIni: undefined,
    }
    expect(advance(kunjunganBerikut, { type: 'MULAI_KUNJUNGAN', keluargaId }, PACK).state.kunjungan?.fase).toBe('observasi')
  })

  it('memaksa pada penerimaan awal menjadi diusir dan mengikuti penalti pemain lama', () => {
    const keluargaId = 'keluarga_asih'
    const awal = siapKunjungan(keluargaId)
    const karmaAwal = awal.jadwal.find((j) => j.jenis === 'karma_igd' && j.keluargaId === keluargaId)!
    const mulai = advance(awal, { type: 'MULAI_KUNJUNGAN', keluargaId }, PACK).state
    const skenario = PACK.keluarga[keluargaId]!.arc.kunjungan[0]!
    const paksa = skenario.penerimaanAwal!.pilihan.find((p) => p.tindakan === 'memaksa')!
    const akhir = advance(mulai, { type: 'RESPONS_PENERIMAAN', pilihanId: paksa.id }, PACK).state
    const karmaAkhir = akhir.jadwal.find((j) => j.jenis === 'karma_igd' && j.keluargaId === keluargaId)!

    expect(akhir.hasilKunjunganHariIni?.hasilAkhir).toBe('diusir')
    expect(akhir.tally.kunjunganTotal).toBe(awal.tally.kunjunganTotal + 1)
    expect(akhir.tally.kunjunganDiusir).toBe(awal.tally.kunjunganDiusir + 1)
    expect(akhir.tally.miTotal).toBe(awal.tally.miTotal + 1)
    expect(akhir.tally.apathy).toBe(awal.tally.apathy + 1)
    expect(karmaAkhir.hari).toBe(Math.max(awal.hari + 1, karmaAwal.hari - 2))
  })

  it('event penerimaan tidak muncul di mode Ujian', () => {
    const keluargaId = 'keluarga_asih'
    const awal = siapKunjungan(keluargaId, 'ujian')
    const mulai = advance(awal, { type: 'MULAI_KUNJUNGAN', keluargaId }, PACK).state
    expect(mulai.kunjungan?.fase).toBe('observasi')
  })

  it('save lama menurunkan hasilAkhir dan kualitasSaji secara deterministik', () => {
    const state = buildInitialState('Migrasi E-2', 11, PACK)
    const mentah = JSON.parse(serialize(state)) as { state: Record<string, unknown> }
    mentah.state['hasilKunjunganHariIni'] = {
      keluargaId: 'keluarga_wulan',
      skenarioId: 'wulan_k1',
      berhasil: false,
      diusir: false,
      hipotesisBenar: true,
      trustDelta: 1,
      kualitasMi: 50,
      indikatorTerverifikasi: [],
      narasiPenutup: 'Lama.',
      tingkat: 'partial',
    }
    const hasil = deserialize(JSON.stringify(mentah), PACK)
    expect(hasil?.hasilKunjunganHariIni?.hasilAkhir).toBe('partial')
    expect(hasil?.hasilKunjunganHariIni?.kualitasSaji).toBe(50)
  })

  it('validator mengunci struktur Ingatkan dan cadence penerimaan awal', () => {
    const rusakIngatkan = structuredClone(PACK)
    rusakIngatkan.keluarga['keluarga_wulan']!.arc.kunjungan[0]!.pilihanIngatkan!.pilihan.pop()
    expect(validasiPack(rusakIngatkan).some((m) => m.includes('Ingatkan wajib tepat 3 pilihan'))).toBe(true)

    const rusakPenerimaan = structuredClone(PACK)
    rusakPenerimaan.keluarga['keluarga_asih']!.arc.kunjungan[0]!.penerimaanAwal!.ulangDalamHari = 8
    expect(validasiPack(rusakPenerimaan).some((m) => m.includes('ulangDalamHari penerimaan wajib integer 1-7'))).toBe(true)
  })
})
