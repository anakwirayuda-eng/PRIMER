import activitiesAtlas from '../assets/m12/activities-a.webp'

export type JenisVisualKegiatan = 'posyandu' | 'prolanis' | 'klb' | 'lokmin'

export interface ProfilVisualKegiatan {
  src: string
  posisi: string
  label: string
}

const PROFIL: Record<JenisVisualKegiatan, ProfilVisualKegiatan> = {
  posyandu: {
    src: activitiesAtlas,
    posisi: '0% 0%',
    label: 'Pelayanan Posyandu Integrasi Layanan Primer lintas siklus hidup',
  },
  prolanis: {
    src: activitiesAtlas,
    posisi: '100% 0%',
    label: 'Pemantauan dan edukasi kelompok Prolanis di Puskesmas',
  },
  klb: {
    src: activitiesAtlas,
    posisi: '0% 100%',
    label: 'Tim Puskesmas melakukan penyelidikan epidemiologi lapangan',
  },
  lokmin: {
    src: activitiesAtlas,
    posisi: '100% 100%',
    label: 'Lokakarya mini lintas profesi menghubungkan keluarga, klinik, dan program',
  },
}

export const JENIS_KEGIATAN_BERVISUAL = Object.freeze(Object.keys(PROFIL))

export function profilVisualKegiatan(jenis: string): ProfilVisualKegiatan {
  return PROFIL[jenis as JenisVisualKegiatan] ?? PROFIL.lokmin
}
