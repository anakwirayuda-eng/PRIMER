import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PACK } from '@content/index'
import { buildInitialState } from '@engine/init'
import type { KunjunganState } from '@engine/state'
import { useGame } from '../../store'
import { Kunjungan } from '../Kunjungan'
import {
  ID_HOTSPOT_BERVISUAL,
  ID_KELUARGA_BERVISUAL,
  ID_SKENARIO_BERPOTRET,
  ID_SKENARIO_BERVISUAL,
  posisiHotspotVisual,
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

  it('seluruh 123 hotspot ditambatkan ulang ke adegan bitmap M12', () => {
    const hotspotIds = Object.values(PACK.keluarga).flatMap((keluarga) =>
      keluarga.arc.kunjungan.flatMap((skenario) =>
        skenario.hotspot.map((hotspot) => `${skenario.id}:${hotspot.id}`),
      ),
    )
    expect([...ID_HOTSPOT_BERVISUAL].sort()).toEqual(hotspotIds.sort())
    expect(hotspotIds).toHaveLength(123)

    for (const keluarga of Object.values(PACK.keluarga)) {
      for (const skenario of keluarga.arc.kunjungan) {
        for (const hotspot of skenario.hotspot) {
          const posisi = posisiHotspotVisual(skenario.id, hotspot.id, hotspot)
          expect(posisi.x, `${skenario.id}:${hotspot.id}:x`).toBeGreaterThanOrEqual(4)
          expect(posisi.x, `${skenario.id}:${hotspot.id}:x`).toBeLessThanOrEqual(92)
          expect(posisi.y, `${skenario.id}:${hotspot.id}:y`).toBeGreaterThanOrEqual(8)
          expect(posisi.y, `${skenario.id}:${hotspot.id}:y`).toBeLessThanOrEqual(92)
        }
      }
    }

    expect(posisiHotspotVisual('prapto_k1', 'prk1_h1', { x: 75, y: 55 })).toEqual({ x: 24, y: 52 })
    expect(posisiHotspotVisual('prapto_k1', 'prk1_h2', { x: 30, y: 40 })).toEqual({ x: 82, y: 57 })
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

  it('marker dan kartu observasi memakai nomor yang sama serta urutan penemuan', () => {
    const state = buildInitialState('Uji hotspot M12', 2, PACK)
    const kunjungan: KunjunganState = {
      keluargaId: 'keluarga_prapto',
      skenarioId: 'prapto_k1',
      fase: 'observasi',
      hotspotDitemukan: ['prk1_h2', 'prk1_h1'],
      dialogIndex: 0,
      pilihanDiambil: [],
      trustDelta: 0,
      konfrontasiBeruntun: 0,
      diusir: false,
    }
    useGame.setState({ state: { ...state, layar: 'kunjungan', kunjungan } })

    render(<Kunjungan />)

    const kandang = screen.getByRole('button', { name: 'Kandang kambing menempel bibir sumur' })
    const panci = screen.getByRole('button', { name: 'Panci besar bekas merebus air' })
    expect(kandang).toHaveTextContent('1')
    expect(kandang.getAttribute('style')).toContain('left: 24%')
    expect(panci).toHaveTextContent('2')
    expect(panci.getAttribute('style')).toContain('left: 82%')

    const judulKartu = [...document.querySelectorAll('.kunjungan-temuan__kartu b')].map((item) => item.textContent)
    expect(judulKartu).toEqual([
      'Panci besar bekas merebus air',
      'Kandang kambing menempel bibir sumur',
    ])
    const nomorKartu = [...document.querySelectorAll('.kunjungan-temuan__nomor')].map((item) => item.textContent)
    expect(nomorKartu).toEqual(['2', '1'])
  })
})
