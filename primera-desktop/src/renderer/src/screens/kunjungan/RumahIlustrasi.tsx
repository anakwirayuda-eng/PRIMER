import { profilRumah } from './visualProfiles'

interface RumahIlustrasiProps {
  keluargaId: string
  skenarioId: string
}

/**
 * M12: satu dari 27 adegan kunjungan dipotong dari atlas 2x2. Kunjungan
 * tindak lanjut mendapat adegan sendiri agar perubahan cerita hadir secara
 * visual, bukan hanya lewat teks. Hotspot tetap di lapisan koordinat persen.
 */
export function RumahIlustrasi({ keluargaId, skenarioId }: RumahIlustrasiProps) {
  const profil = profilRumah(keluargaId, skenarioId)

  return (
    <div
      className="kunjungan-rumah"
      role="img"
      aria-label={profil.label}
      style={{
        backgroundImage: `url(${profil.src})`,
        backgroundPosition: profil.posisi,
      }}
    />
  )
}
