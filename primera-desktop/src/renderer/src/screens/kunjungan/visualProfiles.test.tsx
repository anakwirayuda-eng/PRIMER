import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PACK } from '@content/index'
import { buildInitialState } from '@engine/init'
import type { KunjunganState } from '@engine/state'
import { useGame } from '../../store'
import { Kunjungan } from '../Kunjungan'
import {
  ID_KELUARGA_BERVISUAL,
  ID_SKENARIO_BERPOTRET,
  ID_SKENARIO_BERVISUAL,
  profilPembicara,
  profilRumah,
} from './visualProfiles'

const keluargaIds = Object.keys(PACK.keluarga).sort()
const skenarioIds = Object.values(PACK.keluarga)
  .flatMap((keluarga) => keluarga.arc.kunjungan.map((skenario) => skenario.id))
  .sort()

describe('M12 - cakupan visual keluarga dan NPC', () => {
  it('seluruh 16 keluarga dan 27 skenario kunjungan punya adegan eksplisit', () => {
    expect([...ID_KELUARGA_BERVISUAL].sort()).toEqual(keluargaIds)
    expect(keluargaIds).toHaveLength(16)
    expect([...ID_SKENARIO_BERVISUAL].sort()).toEqual(skenarioIds)
    expect(skenarioIds).toHaveLength(27)

    for (const [keluargaId, keluarga] of Object.entries(PACK.keluarga)) {
      for (const skenario of keluarga.arc.kunjungan) {
        const profil = profilRumah(keluargaId, skenario.id)
        expect(profil.src, skenario.id).toBeTruthy()
        expect(profil.posisi, skenario.id).toMatch(/^(0%|100%) (0%|100%)$/)
        expect(profil.label, skenario.id).toMatch(/kunjungan/i)
      }
    }
  })

  it('setiap kunjungan lanjutan memakai pelat visual berbeda dari kunjungan sebelumnya', () => {
    for (const [keluargaId, keluarga] of Object.entries(PACK.keluarga)) {
      if (keluarga.arc.kunjungan.length < 2) continue
      const pelat = keluarga.arc.kunjungan.map((skenario) => {
        const profil = profilRumah(keluargaId, skenario.id)
        return `${profil.src}|${profil.posisi}`
      })
      expect(new Set(pelat).size, keluargaId).toBe(pelat.length)
    }
  })

  it('seluruh skenario memiliki potret dan pergantian pembicara yang disengaja', () => {
    expect([...ID_SKENARIO_BERPOTRET].sort()).toEqual(skenarioIds)
    expect(profilPembicara('wulan_k1', 0).nama).toBe('Bu Wulan')
    expect(profilPembicara('wulan_k1', 1).nama).toBe('Pak Darto')
    expect(profilPembicara('santoso_k1', 1).nama).toBe('Bu Rahmi')
    expect(profilPembicara('yani_k1', 1).nama).toBe('Mbah Painem')
    expect(profilPembicara('endah_k1', 1).nama).toBe('Mas Andri')
    expect(profilPembicara('karsa_k1', 1).nama).toBe('Bu Painah')
  })

  it('renderer memakai adegan dan potret bitmap tanpa kembali ke avatar inisial', () => {
    const state = buildInitialState('Uji M12', 1, PACK)
    const kunjungan: KunjunganState = {
      keluargaId: 'keluarga_wulan',
      skenarioId: 'wulan_k1',
      fase: 'wawancara',
      hotspotDitemukan: [],
      dialogIndex: 0,
      pilihanDiambil: [],
      trustDelta: 0,
      konfrontasiBeruntun: 0,
      diusir: false,
    }
    useGame.setState({ state: { ...state, layar: 'kunjungan', kunjungan } })

    render(<Kunjungan />)

    const rumah = screen.getByRole('img', { name: 'Kunjungan pertama di rumah Keluarga Bu Wulan' })
    expect(rumah).toHaveClass('kunjungan-rumah')
    expect(rumah.getAttribute('style')).toMatch(/background-image/)
    expect(screen.getByText('Bu Wulan')).toBeInTheDocument()
    const potret = document.querySelector('.kunjungan-potret')
    expect(potret?.getAttribute('style')).toMatch(/background-image/)
    expect(potret?.textContent).toBe('')
  })
})
