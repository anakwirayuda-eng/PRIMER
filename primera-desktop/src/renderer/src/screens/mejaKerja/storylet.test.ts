import { describe, expect, it } from 'vitest'
import { STORYLET_POOL, kandidatStorylet, storyletHariIni, storyletHariIniDetail } from './storylet'

describe('storyletHariIni', () => {
  it('bank formal cukup lebar dan selalu menghasilkan anggota pool', () => {
    expect(STORYLET_POOL.length).toBeGreaterThanOrEqual(40)
    expect(new Set(STORYLET_POOL).size).toBe(STORYLET_POOL.length)
    for (let hari = 1; hari <= 90; hari++) {
      expect(STORYLET_POOL).toContain(storyletHariIni(1, hari))
    }
  })

  it('deterministik untuk seed, hari, dan konteks yang sama', () => {
    const konteks = { punyaBinaan: true, episodeAktif: true }
    expect(storyletHariIni(42, 10, konteks)).toBe(storyletHariIni(42, 10, konteks))
  })

  it('detail visual mempertahankan teks lama dan mencakup empat tema atlas', () => {
    const konteks = {
      punyaBinaan: true,
      rujukanMenunggu: true,
      rujukanTuntas: true,
      pernahPosyandu: true,
      pernahProlanis: true,
      episodeAktif: true,
      episodeTerverifikasi: true,
    }
    const detail = Array.from({ length: 90 }, (_, i) => storyletHariIniDetail(23, i + 1, konteks))
    for (let i = 0; i < detail.length; i += 1) {
      expect(detail[i]!.teks).toBe(storyletHariIni(23, i + 1, konteks))
      expect(detail[i]!.id).toBeTruthy()
    }
    expect(new Set(detail.map((item) => item.temaVisual))).toEqual(
      new Set(['sistem', 'rujukan', 'lapangan', 'komunitas']),
    )
  })

  it('tidak mengulang dalam 14 hari pada fase awal maupun konteks penuh', () => {
    const konteksPenuh = {
      punyaBinaan: true,
      rujukanMenunggu: true,
      rujukanTuntas: true,
      pernahPosyandu: true,
      pernahProlanis: true,
      episodeAktif: true,
      episodeTerverifikasi: true,
    }
    for (const konteks of [{}, konteksPenuh]) {
      const hasil = Array.from({ length: 14 }, (_, i) => storyletHariIni(17, i + 1, konteks))
      expect(new Set(hasil).size).toBe(14)
    }
  })

  it('tanpa state pendukung tidak memalsukan program, binaan, episode, atau kabar rujukan', () => {
    const kandidat = kandidatStorylet()
    expect(kandidat.some((teks) => /Kabar rujukan/i.test(teks))).toBe(false)
    expect(kandidat.some((teks) => /Sesudah Posyandu/i.test(teks))).toBe(false)
    expect(kandidat.some((teks) => /Prolanis/i.test(teks))).toBe(false)
    expect(kandidat.some((teks) => /Kabar binaan/i.test(teks))).toBe(false)
    expect(kandidat.some((teks) => /Jejak perawatan/i.test(teks))).toBe(false)
    // 2026-07-23: kelelahan dokter tidak boleh dinarasikan saat burnout normal.
    expect(kandidat.some((teks) => /Ruang jaga/i.test(teks))).toBe(false)
  })

  it('storylet "Ruang jaga" hanya terbuka saat burnoutTinggi (2026-07-23)', () => {
    const kandidat = kandidatStorylet({ burnoutTinggi: true })
    expect(kandidat.filter((teks) => /Ruang jaga/i.test(teks))).toHaveLength(4)
  })

  it('kabar rujukan membedakan rangkaian masih terbuka dari rangkaian tuntas', () => {
    const menunggu = kandidatStorylet({ rujukanMenunggu: true })
    expect(menunggu.filter((teks) => /Kabar rujukan/i.test(teks))).toHaveLength(4)
    expect(menunggu.some((teks) => /belum kembali|masih menunggu|masih terbuka|belum diterima/i.test(teks))).toBe(true)
    expect(menunggu.some((teks) => /sudah diterima dan langkah berikutnya tercatat/i.test(teks))).toBe(false)

    const tuntas = kandidatStorylet({ rujukanTuntas: true })
    expect(tuntas.filter((teks) => /Kabar rujukan/i.test(teks))).toHaveLength(4)
    expect(tuntas.some((teks) => /sudah diterima|sudah ditindaklanjuti|kabar balik tiba|kini dapat diaudit/i.test(teks))).toBe(true)
    expect(tuntas.some((teks) => /rangkaian tindak lanjut masih terbuka/i.test(teks))).toBe(false)
  })

  it('membuka setiap keluarga storylet hanya saat state pendukungnya ada', () => {
    const kandidat = kandidatStorylet({
      punyaBinaan: true,
      pernahPosyandu: true,
      pernahProlanis: true,
      episodeAktif: true,
      episodeTerverifikasi: true,
    })
    expect(kandidat.some((teks) => /Kabar binaan/i.test(teks))).toBe(true)
    expect(kandidat.some((teks) => /Sesudah Posyandu/i.test(teks))).toBe(true)
    expect(kandidat.some((teks) => /Prolanis/i.test(teks))).toBe(true)
    expect(kandidat.filter((teks) => /Jejak perawatan/i.test(teks))).toHaveLength(8)
  })
})
