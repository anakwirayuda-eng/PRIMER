import { describe, expect, it } from 'vitest'
import { CURRICULUM_BLUEPRINT, PACK } from '..'
import { CONTENT_RELEASE, encounterArchetypeAktif } from '../pack'
import { buatPasienDariKasus } from '../../engine/director'
import { Rng } from '../../engine/core/rng'
import { LAB_BATCH_2_CASES } from './batch2'
import { LAB_BATCH_3_CASES } from './batch3'
import {
  EDUKASI_LAB_EXPANSION,
  LAB_LAB_EXPANSION,
  OBAT_LAB_EXPANSION,
  TINDAKAN_LAB_EXPANSION,
} from './catalogExpansion'

const EXPANSION_CASES = [...LAB_BATCH_2_CASES, ...LAB_BATCH_3_CASES]

describe('M13 lab full-fledge - 144/144 katalog FKTP playable', () => {
  it('menutup tepat 78 gap baru tanpa id kasus duplikat', () => {
    expect(LAB_BATCH_2_CASES).toHaveLength(39)
    expect(LAB_BATCH_3_CASES).toHaveLength(39)
    expect(EXPANSION_CASES).toHaveLength(78)
    expect(new Set(EXPANSION_CASES.map((item) => item.id)).size).toBe(78)
  })

  it('setiap kasus ekspansi adalah prototipe 4A lengkap dengan anamnesis progresif', () => {
    for (const kasus of EXPANSION_CASES) {
      expect(kasus.activationStatus, kasus.id).toBe('lab_prototype_unadjudicated')
      expect(kasus.skdi, kasus.id).toBe('4A')
      expect(kasus.fktp144, kasus.id).toBe(true)
      expect(kasus.diagnosisBanding, kasus.id).toContain(kasus.icd10)
      expect(kasus.anamnesis[0], kasus.id).toMatchObject({ id: 'q_keluhan', kategori: 'keluhan_utama' })
      expect(kasus.anamnesis.slice(1).every((item) => item.bukaSetelah?.includes('q_keluhan')), kasus.id).toBe(true)
      expect(kasus.pemeriksaanFisik.length, kasus.id).toBeGreaterThan(0)
      expect(kasus.clue.trim().length, kasus.id).toBeGreaterThan(80)
    }
  })

  it('seluruh 144 item memiliki archetype poli yang menyertifikasi di Karier', () => {
    const credits = new Set(
      CURRICULUM_BLUEPRINT.encounterArchetypes
        .filter((item) => item.channel === 'clinic' && item.modePolicy.karier)
        .flatMap((item) => item.credits),
    )
    const missing = PACK.skdi144
      .map((item) => `fktp144:${item.id}`)
      .filter((itemId) => !credits.has(itemId))

    expect(PACK.skdi144).toHaveLength(144)
    expect(missing).toEqual([])
    expect(new Set(PACK.skdi144.map((item) => item.kasusId)).size).toBe(144)
  })

  it('setiap baris Dex tertaut ke encounter yang mengkredit baris itu sendiri', () => {
    for (const entry of PACK.skdi144) {
      expect(entry.kasusId, entry.id).toBeDefined()
      expect(PACK.kasus[entry.kasusId!], entry.id).toBeDefined()
      const archetype = CURRICULUM_BLUEPRINT.encounterArchetypes.find(
        (item) => item.contentRef.kind === 'clinic' && item.contentRef.id === entry.kasusId,
      )
      expect(archetype?.credits, entry.id).toContain(`fktp144:${entry.id}`)
    }
  })

  it('semua prototipe lab aktif di Karier tetapi tidak bocor ke Ujian', () => {
    const labCases = Object.values(PACK.kasus).filter(
      (item) => item.activationStatus === 'lab_prototype_unadjudicated',
    )
    expect(labCases.length).toBeGreaterThanOrEqual(103)

    for (const kasus of labCases) {
      expect(encounterArchetypeAktif(PACK, 'clinic', kasus.id, 'karier', CONTENT_RELEASE), kasus.id).toBe(true)
      expect(encounterArchetypeAktif(PACK, 'clinic', kasus.id, 'ujian', CONTENT_RELEASE), kasus.id).toBe(false)
    }
  })

  it('seluruh kasus ekspansi dapat diwujudkan sebagai pasien valid', () => {
    for (const [index, kasus] of EXPANSION_CASES.entries()) {
      const pasien = buatPasienDariKasus(kasus.id, PACK, new Rng(13000 + index, kasus.id))
      expect(pasien.kasusId).toBe(kasus.id)
      expect(pasien.usia).toBeGreaterThanOrEqual(kasus.demografi.usiaMin)
      expect(pasien.usia).toBeLessThanOrEqual(kasus.demografi.usiaMax)
      if (kasus.demografi.jenisKelamin) expect(pasien.jenisKelamin).toBe(kasus.demografi.jenisKelamin)
      if (kasus.demografi.usiaBulanMin !== undefined) {
        expect(pasien.usia).toBe(0)
        expect(pasien.usiaBulan).toBeGreaterThanOrEqual(kasus.demografi.usiaBulanMin)
        expect(pasien.usiaBulan).toBeLessThanOrEqual(kasus.demografi.usiaBulanMax!)
      }
    }
  })

  it('obat wajib non-Fornas pada prototipe selalu punya catatan availability', () => {
    const tanpaJustifikasi: string[] = []
    for (const kasus of Object.values(PACK.kasus).filter(
      (item) => item.activationStatus === 'lab_prototype_unadjudicated',
    )) {
      const nonFornas = kasus.tatalaksana.obatBenar.filter((id) => PACK.obat[id]?.fornas === false)
      if (nonFornas.length === 0) continue
      const catatan = kasus.catatanRealita?.toLowerCase() ?? ''
      if (!/(fornas|stok rutin|pengadaan lokal|jejaring|program)/.test(catatan)) {
        tanpaJustifikasi.push(`${kasus.id}: ${nonFornas.join(', ')}`)
      }
    }
    expect(tanpaJustifikasi).toEqual([])
  })

  it('setiap item katalog ekspansi benar-benar dipakai oleh kasus', () => {
    const isiKasus = JSON.stringify(Object.values(PACK.kasus).filter(
      (item) => item.activationStatus === 'lab_prototype_unadjudicated',
    ))
    const katalog = {
      obat: OBAT_LAB_EXPANSION,
      lab: LAB_LAB_EXPANSION,
      edukasi: EDUKASI_LAB_EXPANSION,
      tindakan: TINDAKAN_LAB_EXPANSION,
    }

    for (const [jenis, items] of Object.entries(katalog)) {
      const yatim = Object.keys(items).filter((id) => !isiKasus.includes(`\"${id}\"`))
      expect(yatim, `${jenis} yatim`).toEqual([])
    }
  })

  it('pertanyaan reproduksi dan organ spesifik hanya muncul pada gender yang sesuai', () => {
    const kasusLab = Object.values(PACK.kasus).filter(
      (item) => item.activationStatus === 'lab_prototype_unadjudicated',
    )
    const masalah: string[] = []

    for (const kasus of kasusLab) {
      for (const pertanyaan of kasus.anamnesis) {
        if (/hamil|menyusui|menstruasi|haid/i.test(pertanyaan.tanya)) {
          if (kasus.demografi.jenisKelamin !== 'P' && pertanyaan.hanyaUntuk !== 'P') {
            masalah.push(`${kasus.id}:${pertanyaan.id}:butuh-P`)
          }
        }
        if (/\btestis\b|\bpenis\b|\bskrotum\b|\bprostat\b/i.test(pertanyaan.tanya)) {
          if (kasus.demografi.jenisKelamin !== 'L' && pertanyaan.hanyaUntuk !== 'L') {
            masalah.push(`${kasus.id}:${pertanyaan.id}:butuh-L`)
          }
        }
      }
    }

    expect(masalah).toEqual([])
  })

  /**
   * Bug hunt 2026-08-06: sepuluh pertanyaan di tujuh kasus membuat PASIEN
   * berkata "istri saya" padahal gender pasien diundi koin — separuh mahasiswa
   * melihat header "Perempuan" berikut potret perempuan, lalu pasien yang sama
   * menyebut istrinya. Yang paling tajam `lab_tia_serangan_iskemik_sesaat`:
   * sudah disetujui dokter sehingga skor dan Dex dihitung penuh, dan
   * pertanyaannya selalu ditanya.
   *
   * Penjaga lama hanya menyapu kasus prototipe lab dan hanya field `tanya`.
   * Kini SELURUH 210 kasus dan `jawab` beserta seluruh variasinya ikut disisir —
   * di situlah kesepuluhnya bersembunyi. Kata sapaan dokter ("Pak"/"Bu") sengaja
   * TIDAK dilarang: itu bahasa dokter kepada pasien, bukan pasien menyebut
   * pasangannya, dan melarangnya akan memerahkan puluhan kalimat yang benar.
   */
  it('pasien tak menyebut gender pasangannya bila gendernya sendiri diundi', () => {
    const masalah: string[] = []
    for (const kasus of Object.values(PACK.kasus)) {
      if (kasus.demografi.jenisKelamin) continue
      for (const pertanyaan of kasus.anamnesis) {
        const teks = [pertanyaan.tanya, pertanyaan.jawab, ...Object.values(pertanyaan.variasi ?? {})]
        for (const t of teks) {
          if (typeof t === 'string' && /(istri|suami) saya/i.test(t)) {
            masalah.push(`${kasus.id}:${pertanyaan.id}`)
          }
        }
      }
    }
    expect(masalah).toEqual([])
  })

  it('kasus anak kecil tidak mengunci sediaan dewasa sebagai satu-satunya jawaban', () => {
    const sediaanDewasa = new Set([
      'paracetamol_500',
      'amoxicillin_500',
      'amoxiclav_625',
      'cefadroxil_500',
      'griseofulvin_500',
    ])
    const masalah: string[] = []

    for (const kasus of Object.values(PACK.kasus).filter(
      (item) => item.activationStatus === 'lab_prototype_unadjudicated' && item.demografi.usiaMin < 12,
    )) {
      const terkunci = [
        ...kasus.tatalaksana.obatBenar,
        ...(kasus.tatalaksana.obatOpsional ?? []),
      ].filter((id) => sediaanDewasa.has(id))
      if (terkunci.length > 0) masalah.push(`${kasus.id}: ${terkunci.join(', ')}`)
    }

    expect(masalah).toEqual([])
  })
})
