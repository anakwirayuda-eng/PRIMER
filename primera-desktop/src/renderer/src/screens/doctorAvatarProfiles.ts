import doctorAtlas from '../assets/m12/doctor-presets.webp'

export interface PresetAvatarDokter {
  id: string
  src: string
  posisi: string
}

const POSISI = ['0% 0%', '50% 0%', '100% 0%', '0% 50%', '50% 50%', '100% 50%', '0% 100%', '50% 100%', '100% 100%']

/**
 * Aset cadangan M12. Belum dihubungkan ke save agar pemain tidak diberi wajah
 * atau gender secara paksa sebelum kebijakan pemilihan avatar disepakati.
 */
export const PRESET_AVATAR_DOKTER: readonly PresetAvatarDokter[] = Object.freeze(
  POSISI.map((posisi, indeks) => ({
    id: `dokter_${indeks + 1}`,
    src: doctorAtlas,
    posisi,
  })),
)
