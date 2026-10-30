import { describe, expect, it } from 'vitest'
import { PACK } from '@content/index'
import { Rng } from '@engine/core/rng'
import { buatPasienDariKasus } from '@engine/director'
import { buildInitialState } from '@engine/init'
import { advance, HARI_BUKA_PROLANIS } from '@engine/reducer'
import type { GameState, JadwalItem, PasienAktif } from '@engine/state'
import type { ProfilPotret } from '../kunjungan/visualProfiles'
import { potretAnggotaKeluarga, profilPembicara } from '../kunjungan/visualProfiles'
import { profilVisualPasien } from './patientVisualProfiles'

const SEED = 20261019

function lanjutkan(state: GameState): GameState {
  return advance(state, { type: 'LANJUTKAN' }, PACK).state
}

/** Sore hari sebelumnya, tanpa jadwal lain, lalu lanjut ke pagi berikutnya. */
function lompatKeHari(awal: GameState, hari: number, jadwal: JadwalItem[]): GameState {
  return lanjutkan({
    ...awal,
    hari: hari - 1,
    blok: 'sore',
    jadwal,
    igd: undefined,
    igdHariIni: false,
    klinik: { ...awal.klinik, antrian: [], aktif: undefined },
  })
}

function wajah(profil: { src: string; posisi: string }) {
  return { src: profil.src, posisi: profil.posisi }
}

/** Potret yang dilihat pemain di kunjungan rumah tiap keluarga, per pembicara. */
function potretKunjunganPerKeluarga(): Map<string, Map<string, ProfilPotret>> {
  const hasil = new Map<string, Map<string, ProfilPotret>>()
  for (const kel of Object.values(PACK.keluarga)) {
    const potret = new Map<string, ProfilPotret>()
    for (const skenario of kel.arc.kunjungan) {
      for (let i = 0; i < skenario.dialog.length; i += 1) {
        const profil = profilPembicara(skenario.id, i)
        potret.set(profil.id, profil)
      }
    }
    hasil.set(kel.id, potret)
  }
  return hasil
}

function pasienAnggota(
  keluargaId: string,
  nama: string,
  kasusId: string,
  override: Partial<PasienAktif> = {},
): PasienAktif {
  const kel = PACK.keluarga[keluargaId]!
  const anggota = kel.anggota.find((a) => a.nama === nama)!
  return buatPasienDariKasus(kasusId, PACK, new Rng(SEED, 'potret', keluargaId, nama, kasusId), {
    nama: anggota.nama,
    usia: anggota.usia,
    jenisKelamin: anggota.jenisKelamin,
    keluargaId,
    rw: kel.rw,
    ...override,
  })
}

describe('Potret warga binaan lintas kunjungan dan poli', () => {
  it('setiap pembicara kunjungan rumah adalah anggota bernama yang wajahnya sama di poli', () => {
    const terpakai = new Set<string>()
    for (const [keluargaId, potretKunjungan] of potretKunjunganPerKeluarga()) {
      const kel = PACK.keluarga[keluargaId]!
      for (const potret of potretKunjungan.values()) {
        const anggota = kel.anggota.filter(
          (a) => potretAnggotaKeluarga(keluargaId, a.nama)?.id === potret.id,
        )
        expect(anggota.map((a) => a.nama), `${keluargaId}:${potret.id}`).toHaveLength(1)
        const pasien = pasienAnggota(keluargaId, anggota[0]!.nama, 'hipertensi_esensial')
        const poli = profilVisualPasien(pasien)
        expect(poli.potretWarga).toBe(potret.id)
        expect(wajah(poli)).toEqual(wajah(potret))
        // Kotak potret poli dan kunjungan sama-sama memakai atlas 2x2 penuh.
        expect(poli.ukuranAtlas).toBe('200% 200%')
        terpakai.add(potret.id)
      }
    }
    expect(terpakai.size).toBe(24)
  })

  it('pasien karma dari antrian engine memakai wajah kunjungan keluarganya', () => {
    const awal = buildInitialState('Uji potret karma', SEED, PACK)
    const karma = awal.jadwal.filter((j) => j.jenis === 'karma_igd')
    expect(karma.length).toBeGreaterThan(0)
    const potretKunjungan = potretKunjunganPerKeluarga()
    let berwajahWarga = 0
    for (const j of karma) {
      const hariKarma = lompatKeHari(awal, j.hari, [j])
      const pasien = hariKarma.klinik.antrian.find(
        (p) => p.konsekuensiKarma && p.keluargaId === j.keluargaId,
      )
      expect(pasien, j.id).toBeDefined()
      expect(pasien!.nama).toBe(j.nama)
      const poli = profilVisualPasien(pasien!)
      const potret = potretAnggotaKeluarga(j.keluargaId!, pasien!.nama)
      if (potret) {
        berwajahWarga += 1
        expect(potretKunjungan.get(j.keluargaId!)?.has(potret.id), j.id).toBe(true)
        expect(poli.potretWarga).toBe(potret.id)
        expect(wajah(poli)).toEqual(wajah(potret))
      } else {
        // Anggota tanpa potret kunjungan (mis. anak) tetap memakai varian poli.
        const { keluargaId: _k, nama: _n, ...tanpaKeluarga } = pasien!
        expect(poli.potretWarga).toBeUndefined()
        expect(poli).toEqual(profilVisualPasien(tanpaKeluarga))
      }
    }
    expect(berwajahWarga).toBeGreaterThan(0)
  })

  it('peserta Prolanis dari keluarga binaan memakai wajah kunjungan, juga pada roster save lama', () => {
    const awal = buildInitialState('Uji potret Prolanis', SEED, PACK)
    const roster = lompatKeHari(awal, HARI_BUKA_PROLANIS.karier, []).prolanis.roster
    expect(roster.length).toBeGreaterThan(0)
    const potretKunjungan = potretKunjunganPerKeluarga()
    let berwajahWarga = 0
    for (const peserta of roster) {
      const potret = potretAnggotaKeluarga(peserta.keluargaId!, peserta.nama)
      if (!potret) continue
      berwajahWarga += 1
      expect(potretKunjungan.get(peserta.keluargaId!)?.has(potret.id), peserta.id).toBe(true)
      // Bentuk pasien sama dengan jadwal `pasien_kembali` Prolanis di engine.
      const kasusId = peserta.jenis === 'ht' ? 'hipertensi_esensial' : 'dm_tipe2'
      const pasien = pasienAnggota(peserta.keluargaId!, peserta.nama, kasusId, {
        id: `prolanis_${peserta.orangId ?? peserta.id}`,
        prolanisPesertaId: peserta.id,
        bpjs: true,
      })
      expect(wajah(profilVisualPasien(pasien))).toEqual(wajah(potret))
      // Roster pra-M10.b tidak membawa keluargaId; id peserta tetap menautkannya.
      const { keluargaId: _k, ...pasienLama } = pasien
      expect(profilVisualPasien(pasienLama).potretWarga).toBe(potret.id)
    }
    expect(berwajahWarga).toBeGreaterThan(0)
  })

  it('tidak membaca kasus: anggota yang sama tetap satu wajah untuk diagnosis berbeda', () => {
    const ht = pasienAnggota('keluarga_lastri', 'Mbah Lastri', 'hipertensi_esensial')
    const lain = { ...ht, kasusId: 'demam_tifoid', varianId: 'varian_lain' }
    expect(profilVisualPasien(lain)).toEqual(profilVisualPasien(ht))
    expect(profilVisualPasien(ht).potretWarga).toBe('mbah_lastri')
  })

  it('pasien non-binaan tetap memakai pemilihan potret demografis', () => {
    // Nama warga binaan tanpa kaitan keluarga bukan orang yang sama.
    const senama = { id: 'pasien-umum-1', nama: 'Bu Wulan', usia: 58, jenisKelamin: 'P' as const }
    expect(profilVisualPasien(senama).potretWarga).toBeUndefined()
    expect(profilVisualPasien(senama)).toEqual(
      profilVisualPasien({ id: senama.id, usia: senama.usia, jenisKelamin: senama.jenisKelamin }),
    )

    // Kaitan keluarga dengan nama di luar daftar anggota (mis. save lama).
    const namaAcak = { ...senama, nama: 'Warga Sukamaju', keluargaId: 'keluarga_wulan' }
    expect(profilVisualPasien(namaAcak).potretWarga).toBeUndefined()

    // Prolanis id yang bukan milik keluarga binaan mana pun.
    const pesertaAsing = { ...senama, prolanisPesertaId: 'prol_keluarga_asing_BuWulan' }
    expect(profilVisualPasien(pesertaAsing).potretWarga).toBeUndefined()

    for (let i = 0; i < 60; i += 1) {
      const pasien = buatPasienDariKasus('demam_tifoid', PACK, new Rng(SEED, 'umum', i))
      const { nama: _n, ...identitas } = pasien
      expect(pasien.keluargaId).toBeUndefined()
      expect(profilVisualPasien(pasien).potretWarga).toBeUndefined()
      expect(profilVisualPasien(pasien)).toEqual(profilVisualPasien(identitas))
    }
  })
})
