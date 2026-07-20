import storyletAtlas from '../../assets/m12/storylets-a.webp'
import type { TemaVisualStorylet } from './storylet'

export interface ProfilVisualStorylet {
  src: string
  posisi: string
  label: string
}

const PROFIL: Record<TemaVisualStorylet, ProfilVisualStorylet> = {
  sistem: {
    src: storyletAtlas,
    posisi: '0% 0%',
    label: 'Tim Puskesmas meninjau catatan dan data setelah pelayanan',
  },
  rujukan: {
    src: storyletAtlas,
    posisi: '100% 0%',
    label: 'Umpan balik rujukan diterima dan dicatat di Puskesmas',
  },
  lapangan: {
    src: storyletAtlas,
    posisi: '0% 100%',
    label: 'Tim menyiapkan tindak lanjut keluarga dan rute kunjungan',
  },
  komunitas: {
    src: storyletAtlas,
    posisi: '100% 100%',
    label: 'Tenaga kesehatan dan warga membahas masalah kesehatan bersama',
  },
}

export function profilVisualStorylet(tema: TemaVisualStorylet): ProfilVisualStorylet {
  return PROFIL[tema]
}
