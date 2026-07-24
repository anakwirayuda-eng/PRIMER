/**
 * TEST — agendaBesok: derivasi read-only agenda hari esok utk debrief sore.
 * Kontrak inti: tidak meramal yang belum ditentukan engine, tidak menampilkan
 * item tanpa state pendukung (pola anti-kabar-palsu storylet), dan kosong
 * setelah stase tamat.
 */
import { describe, expect, it } from 'vitest'
import { buildInitialState } from '@engine/init'
import { HARI_BUKA_PETA, HARI_BUKA_KUNJUNGAN } from '@engine/reducer'
import { PACK } from '@content/index'
import type { GameState } from '@engine/state'
import { agendaBesok } from './agendaBesok'

function stateDasar(hari = 10): GameState {
  return { ...buildInitialState('Uji Agenda', 7, PACK), hari }
}

describe('agendaBesok', () => {
  it('hari biasa tanpa state pendukung → agenda kosong (tanpa kabar palsu)', () => {
    // Hari 10 → besok 11: bukan hari buka peta/kunjungan, bukan akhir pekan.
    const agenda = agendaBesok(stateDasar(10))
    expect(agenda).toHaveLength(0)
  })

  it('stase tamat → selalu kosong', () => {
    const s = stateDasar(HARI_BUKA_PETA - 1)
    const tamat = { ...s, tamat: { grade: 'A' } } as GameState
    expect(agendaBesok(tamat)).toHaveLength(0)
  })

  it('sehari sebelum HARI_BUKA_PETA/KUNJUNGAN → item pembukaan muncul', () => {
    const petaBesok = agendaBesok(stateDasar(HARI_BUKA_PETA - 1))
    expect(petaBesok.some((a) => a.id === 'peta-terbuka')).toBe(true)

    const kunjunganBesok = agendaBesok(stateDasar(HARI_BUKA_KUNJUNGAN - 1))
    expect(kunjunganBesok.some((a) => a.id === 'kunjungan-terbuka')).toBe(true)
  })

  it('janji keluarga jatuh tempo (termasuk yang sudah lewat) terhitung', () => {
    const s = stateDasar(10)
    const idKeluarga = Object.keys(s.desa.keluarga).slice(0, 2)
    expect(idKeluarga).toHaveLength(2)
    const keluarga = { ...s.desa.keluarga }
    keluarga[idKeluarga[0]!] = { ...keluarga[idKeluarga[0]!]!, followUpHari: 11 } // besok
    keluarga[idKeluarga[1]!] = { ...keluarga[idKeluarga[1]!]!, followUpHari: 8 } // sudah lewat
    const agenda = agendaBesok({ ...s, desa: { ...s.desa, keluarga } })
    const item = agenda.find((a) => a.id === 'janji-keluarga')
    expect(item?.teks).toContain('2 keluarga')
  })

  it('keluarga arcSelesai TIDAK dihitung walau followUpHari lewat', () => {
    const s = stateDasar(10)
    const id = Object.keys(s.desa.keluarga)[0]!
    const keluarga = { ...s.desa.keluarga }
    keluarga[id] = { ...keluarga[id]!, followUpHari: 8, arcSelesai: 'berhasil' }
    const agenda = agendaBesok({ ...s, desa: { ...s.desa, keluarga } })
    expect(agenda.some((a) => a.id === 'janji-keluarga')).toBe(false)
  })

  it('pesanan obat tibaHari === besok muncul dengan nama obat', () => {
    const s = stateDasar(10)
    const obatId = Object.keys(PACK.obat)[0]!
    const dgnPesanan = {
      ...s,
      gudang: { ...s.gudang, pesanan: [{ obatId, jumlah: 20, tibaHari: 11 }] },
    } as GameState
    const item = agendaBesok(dgnPesanan).find((a) => a.id === 'obat-tiba')
    expect(item?.teks).toContain(PACK.obat[obatId]!.nama)

    // Tiba LUSA (bukan besok) → tidak muncul.
    const lusa = {
      ...s,
      gudang: { ...s.gudang, pesanan: [{ obatId, jumlah: 20, tibaHari: 12 }] },
    } as GameState
    expect(agendaBesok(lusa).some((a) => a.id === 'obat-tiba')).toBe(false)
  })

  it('malam sebelum akhir pekan (besok % 7 === 0) → pengingat pemulihan', () => {
    expect(agendaBesok(stateDasar(13)).some((a) => a.id === 'pemulihan')).toBe(true) // besok 14
    expect(agendaBesok(stateDasar(10)).some((a) => a.id === 'pemulihan')).toBe(false)
  })

  it('episode perawatan non-terminal ber-dueDay ≤ besok terhitung; terminal tidak', () => {
    const s = stateDasar(10)
    const episodes = [
      { id: 'e1', status: 'aktif', dueDay: 11, updatedDay: 9 },
      { id: 'e2', status: 'terverifikasi', dueDay: 11, updatedDay: 9 },
      { id: 'e3', status: 'aktif', dueDay: 30, updatedDay: 9 },
    ] as unknown as GameState['careEpisodes']
    const agenda = agendaBesok({ ...s, careEpisodes: episodes })
    const item = agenda.find((a) => a.id === 'episode-tempo')
    expect(item?.teks).toContain('1 episode')
  })
})
