import { describe, expect, it } from 'vitest'
import { PRESET_AVATAR_DOKTER } from './doctorAvatarProfiles'
import { JENIS_KEGIATAN_BERVISUAL, profilVisualKegiatan } from './kegiatanVisualProfiles'

describe('M12 - kegiatan dan aset avatar cadangan', () => {
  it('memetakan tiga gameplay kegiatan dan satu adegan Lokmin tanpa pertukaran sel', () => {
    expect([...JENIS_KEGIATAN_BERVISUAL].sort()).toEqual(['klb', 'lokmin', 'posyandu', 'prolanis'])
    expect(profilVisualKegiatan('posyandu').posisi).toBe('0% 0%')
    expect(profilVisualKegiatan('prolanis').posisi).toBe('100% 0%')
    expect(profilVisualKegiatan('klb').posisi).toBe('0% 100%')
    expect(profilVisualKegiatan('lokmin').posisi).toBe('100% 100%')
    expect(profilVisualKegiatan('save-korup')).toEqual(profilVisualKegiatan('lokmin'))
  })

  it('menyimpan sembilan preset dokter unik tanpa mengaktifkannya di save', () => {
    expect(PRESET_AVATAR_DOKTER).toHaveLength(9)
    expect(new Set(PRESET_AVATAR_DOKTER.map((preset) => preset.id)).size).toBe(9)
    expect(new Set(PRESET_AVATAR_DOKTER.map((preset) => preset.posisi)).size).toBe(9)
    expect(new Set(PRESET_AVATAR_DOKTER.map((preset) => preset.src)).size).toBe(1)
  })
})
