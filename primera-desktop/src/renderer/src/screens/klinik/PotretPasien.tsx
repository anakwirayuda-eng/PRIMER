import type { IdentitasVisualPasien } from './patientVisualProfiles'
import { profilVisualPasien } from './patientVisualProfiles'
import './PotretPasien.css'

interface PotretPasienProps {
  pasien: IdentitasVisualPasien
  ukuran?: 'kecil' | 'sedang'
}

/** Potret bersifat dekoratif; usia dan jenis kelamin tetap tersedia sebagai teks. */
export function PotretPasien({ pasien, ukuran = 'sedang' }: PotretPasienProps) {
  const profil = profilVisualPasien(pasien)
  return (
    <span
      className={`potret-pasien potret-pasien--${ukuran}`}
      aria-hidden="true"
      style={{
        backgroundImage: `url(${profil.src})`,
        backgroundPosition: profil.posisi,
        backgroundSize: profil.ukuranAtlas,
      }}
    />
  )
}
