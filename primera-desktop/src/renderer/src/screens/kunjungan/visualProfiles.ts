import homesA from '../../assets/m12/homes-a.webp'
import homesB from '../../assets/m12/homes-b.webp'
import homesC from '../../assets/m12/homes-c.webp'
import homesD from '../../assets/m12/homes-d.webp'
import visitsE from '../../assets/m12/visits-e.webp'
import visitsF from '../../assets/m12/visits-f.webp'
import visitsG from '../../assets/m12/visits-g.webp'
import peopleA from '../../assets/m12/people-a.webp'
import peopleB from '../../assets/m12/people-b.webp'
import peopleC from '../../assets/m12/people-c.webp'
import peopleD from '../../assets/m12/people-d.webp'
import peopleE from '../../assets/m12/people-e.webp'
import peopleF from '../../assets/m12/people-f.webp'

type SelAtlas = 'kiri_atas' | 'kanan_atas' | 'kiri_bawah' | 'kanan_bawah'

const POSISI_ATLAS: Record<SelAtlas, string> = {
  kiri_atas: '0% 0%',
  kanan_atas: '100% 0%',
  kiri_bawah: '0% 100%',
  kanan_bawah: '100% 100%',
}

interface PotonganAtlas {
  src: string
  posisi: string
}

export interface ProfilRumah extends PotonganAtlas {
  label: string
}

export interface ProfilPotret extends PotonganAtlas {
  id: IdPotret
  nama: string
}

function potongan(src: string, sel: SelAtlas): PotonganAtlas {
  return { src, posisi: POSISI_ATLAS[sel] }
}

const RUMAH_KELUARGA: Record<string, ProfilRumah> = {
  keluarga_wulan: { ...potongan(homesA, 'kiri_atas'), label: 'Interior rumah Keluarga Bu Wulan' },
  keluarga_santoso: { ...potongan(homesA, 'kanan_atas'), label: 'Rumah dan bengkel Keluarga Pak Santoso' },
  keluarga_ketut: { ...potongan(homesA, 'kiri_bawah'), label: 'Interior rumah Keluarga Pak Ketut' },
  keluarga_dewi: { ...potongan(homesA, 'kanan_bawah'), label: 'Interior rumah Keluarga Hendra' },
  keluarga_musa: { ...potongan(homesB, 'kiri_atas'), label: 'Interior rumah Pak Musa' },
  keluarga_raharjo: { ...potongan(homesB, 'kanan_atas'), label: 'Rumah panggung Keluarga Raharjo' },
  keluarga_asih: { ...potongan(homesB, 'kiri_bawah'), label: 'Interior rumah Keluarga Bu Asih' },
  keluarga_slamet: { ...potongan(homesB, 'kanan_bawah'), label: 'Interior rumah Keluarga Pak Slamet' },
  keluarga_yani: { ...potongan(homesC, 'kiri_atas'), label: 'Interior rumah Keluarga Bu Yani' },
  keluarga_prapto: { ...potongan(homesC, 'kanan_atas'), label: 'Rumah dan halaman Keluarga Pak Prapto' },
  keluarga_marni: { ...potongan(homesC, 'kiri_bawah'), label: 'Rumah dan warung Bu Marni' },
  keluarga_gunawan: { ...potongan(homesC, 'kanan_bawah'), label: 'Rumah dan garasi Keluarga Pak Gunawan' },
  keluarga_lastri: { ...potongan(homesD, 'kiri_atas'), label: 'Interior rumah Mbah Lastri' },
  keluarga_bagyo: { ...potongan(homesD, 'kanan_atas'), label: 'Rumah panggung Keluarga Pak Bagyo' },
  keluarga_endah: { ...potongan(homesD, 'kiri_bawah'), label: 'Rumah kontrakan Mas Andri dan Mbak Endah' },
  keluarga_karsa: { ...potongan(homesD, 'kanan_bawah'), label: 'Interior rumah Keluarga Pak Karsa' },
}

const ADEGAN_SKENARIO: Record<string, ProfilRumah> = {
  wulan_k1: { ...potongan(homesA, 'kiri_atas'), label: 'Kunjungan pertama di rumah Keluarga Bu Wulan' },
  wulan_k2: { ...potongan(visitsE, 'kiri_atas'), label: 'Kunjungan tindak lanjut di rumah Keluarga Bu Wulan' },
  santoso_k1: { ...potongan(homesA, 'kanan_atas'), label: 'Kunjungan pertama di rumah Keluarga Pak Santoso' },
  santoso_k2: { ...potongan(visitsE, 'kanan_atas'), label: 'Kunjungan tindak lanjut di rumah Keluarga Pak Santoso' },
  ketut_k1: { ...potongan(homesA, 'kiri_bawah'), label: 'Kunjungan pertama di rumah Keluarga Pak Ketut' },
  ketut_k2: { ...potongan(visitsE, 'kiri_bawah'), label: 'Kunjungan tindak lanjut di rumah Keluarga Pak Ketut' },
  dewi_k1: { ...potongan(homesA, 'kanan_bawah'), label: 'Kunjungan pertama di rumah Keluarga Hendra' },
  dewi_k2: { ...potongan(visitsE, 'kanan_bawah'), label: 'Kunjungan tindak lanjut di rumah Keluarga Hendra' },
  musa_k1: { ...potongan(homesB, 'kiri_atas'), label: 'Kunjungan pertama di rumah Keluarga Musa' },
  musa_k2: { ...potongan(visitsF, 'kiri_atas'), label: 'Kunjungan tindak lanjut di rumah Keluarga Musa' },
  raharjo_k1: { ...potongan(homesB, 'kanan_atas'), label: 'Kunjungan pertama di rumah Keluarga Raharjo' },
  raharjo_k2: { ...potongan(visitsF, 'kanan_atas'), label: 'Kunjungan tindak lanjut di rumah Keluarga Raharjo' },
  asih_k1: { ...potongan(homesB, 'kiri_bawah'), label: 'Kunjungan pertama di rumah Keluarga Bu Asih' },
  asih_k2: { ...potongan(visitsF, 'kiri_bawah'), label: 'Kunjungan kedua di rumah Keluarga Bu Asih' },
  asih_k3: { ...potongan(visitsF, 'kanan_bawah'), label: 'Kunjungan ketiga di rumah Keluarga Bu Asih' },
  slamet_k1: { ...potongan(homesB, 'kanan_bawah'), label: 'Kunjungan pertama di rumah Keluarga Pak Slamet' },
  slamet_k2: { ...potongan(visitsG, 'kiri_atas'), label: 'Kunjungan tindak lanjut di rumah Keluarga Pak Slamet' },
  yani_k1: { ...potongan(homesC, 'kiri_atas'), label: 'Kunjungan pertama di rumah Keluarga Bu Yani' },
  yani_k2: { ...potongan(visitsG, 'kanan_atas'), label: 'Kunjungan tindak lanjut di rumah Keluarga Bu Yani' },
  prapto_k1: { ...potongan(homesC, 'kanan_atas'), label: 'Kunjungan di rumah Keluarga Pak Prapto' },
  marni_k1: { ...potongan(homesC, 'kiri_bawah'), label: 'Kunjungan di rumah dan warung Bu Marni' },
  gunawan_k1: { ...potongan(homesC, 'kanan_bawah'), label: 'Kunjungan pertama di rumah Keluarga Pak Gunawan' },
  gunawan_k2: { ...potongan(visitsG, 'kiri_bawah'), label: 'Kunjungan tindak lanjut di kendaraan Pak Gunawan' },
  lastri_k1: { ...potongan(homesD, 'kiri_atas'), label: 'Kunjungan di rumah Mbah Lastri' },
  bagyo_k1: { ...potongan(homesD, 'kanan_atas'), label: 'Kunjungan di rumah Keluarga Pak Bagyo' },
  endah_k1: { ...potongan(homesD, 'kiri_bawah'), label: 'Kunjungan di rumah Mas Andri dan Mbak Endah' },
  karsa_k1: { ...potongan(homesD, 'kanan_bawah'), label: 'Kunjungan di rumah Keluarga Pak Karsa' },
}

export const ID_KELUARGA_BERVISUAL = Object.freeze(Object.keys(RUMAH_KELUARGA))
export const ID_SKENARIO_BERVISUAL = Object.freeze(Object.keys(ADEGAN_SKENARIO))

export function profilRumah(keluargaId: string, skenarioId?: string): ProfilRumah {
  return (skenarioId ? ADEGAN_SKENARIO[skenarioId] : undefined)
    ?? RUMAH_KELUARGA[keluargaId]
    ?? RUMAH_KELUARGA.keluarga_wulan!
}

const POTRET = {
  bu_wulan: { ...potongan(peopleA, 'kiri_atas'), nama: 'Bu Wulan' },
  pak_santoso: { ...potongan(peopleA, 'kanan_atas'), nama: 'Pak Santoso' },
  luh_sari: { ...potongan(peopleA, 'kiri_bawah'), nama: 'Luh Sari' },
  bu_dewi: { ...potongan(peopleA, 'kanan_bawah'), nama: 'Bu Dewi' },
  pak_hendra: { ...potongan(peopleB, 'kiri_atas'), nama: 'Pak Hendra' },
  pak_musa: { ...potongan(peopleB, 'kanan_atas'), nama: 'Pak Musa' },
  bu_sumiati: { ...potongan(peopleB, 'kiri_bawah'), nama: 'Bu Sumiati' },
  pak_raharjo: { ...potongan(peopleB, 'kanan_bawah'), nama: 'Pak Raharjo' },
  bu_asih: { ...potongan(peopleC, 'kiri_atas'), nama: 'Bu Asih' },
  pak_slamet: { ...potongan(peopleC, 'kanan_atas'), nama: 'Pak Slamet' },
  bu_yani: { ...potongan(peopleC, 'kiri_bawah'), nama: 'Bu Yani' },
  pak_prapto: { ...potongan(peopleC, 'kanan_bawah'), nama: 'Pak Prapto' },
  bu_marni: { ...potongan(peopleD, 'kiri_atas'), nama: 'Bu Marni' },
  pak_gunawan: { ...potongan(peopleD, 'kanan_atas'), nama: 'Pak Gunawan' },
  mbah_lastri: { ...potongan(peopleD, 'kiri_bawah'), nama: 'Mbah Lastri' },
  pak_bagyo: { ...potongan(peopleD, 'kanan_bawah'), nama: 'Pak Bagyo' },
  mbak_endah: { ...potongan(peopleE, 'kiri_atas'), nama: 'Mbak Endah' },
  pak_karsa: { ...potongan(peopleE, 'kanan_atas'), nama: 'Pak Karsa' },
  bu_tumini: { ...potongan(peopleE, 'kiri_bawah'), nama: 'Bu Tumini' },
  mbah_painem: { ...potongan(peopleE, 'kanan_bawah'), nama: 'Mbah Painem' },
  pak_darto: { ...potongan(peopleF, 'kiri_atas'), nama: 'Pak Darto' },
  bu_rahmi: { ...potongan(peopleF, 'kanan_atas'), nama: 'Bu Rahmi' },
  mas_andri: { ...potongan(peopleF, 'kiri_bawah'), nama: 'Mas Andri' },
  bu_painah: { ...potongan(peopleF, 'kanan_bawah'), nama: 'Bu Painah' },
} as const

export type IdPotret = keyof typeof POTRET

const POTRET_DEFAULT_SKENARIO: Record<string, IdPotret> = {
  wulan_k1: 'bu_wulan',
  wulan_k2: 'bu_wulan',
  santoso_k1: 'pak_santoso',
  santoso_k2: 'pak_santoso',
  ketut_k1: 'luh_sari',
  ketut_k2: 'luh_sari',
  dewi_k1: 'bu_dewi',
  dewi_k2: 'pak_hendra',
  musa_k1: 'pak_musa',
  musa_k2: 'pak_musa',
  raharjo_k1: 'bu_sumiati',
  raharjo_k2: 'pak_raharjo',
  asih_k1: 'bu_asih',
  asih_k2: 'bu_asih',
  asih_k3: 'bu_asih',
  slamet_k1: 'pak_slamet',
  slamet_k2: 'pak_slamet',
  yani_k1: 'bu_yani',
  yani_k2: 'bu_yani',
  prapto_k1: 'pak_prapto',
  marni_k1: 'bu_marni',
  gunawan_k1: 'pak_gunawan',
  gunawan_k2: 'pak_gunawan',
  lastri_k1: 'mbah_lastri',
  bagyo_k1: 'pak_bagyo',
  endah_k1: 'mbak_endah',
  karsa_k1: 'pak_karsa',
}

const POTRET_PER_DIALOG: Record<string, Partial<Record<number, IdPotret>>> = {
  wulan_k1: { 1: 'pak_darto' },
  wulan_k2: { 1: 'pak_darto' },
  santoso_k1: { 1: 'bu_rahmi' },
  santoso_k2: { 1: 'bu_rahmi' },
  dewi_k2: { 1: 'bu_dewi' },
  raharjo_k2: { 1: 'bu_sumiati' },
  slamet_k1: { 1: 'bu_tumini' },
  slamet_k2: { 1: 'bu_tumini' },
  yani_k1: { 1: 'mbah_painem' },
  endah_k1: { 1: 'mas_andri' },
  karsa_k1: { 1: 'bu_painah' },
}

export const ID_SKENARIO_BERPOTRET = Object.freeze(Object.keys(POTRET_DEFAULT_SKENARIO))

export function profilPembicara(skenarioId: string, dialogIndex: number): ProfilPotret {
  const id = POTRET_PER_DIALOG[skenarioId]?.[dialogIndex] ?? POTRET_DEFAULT_SKENARIO[skenarioId] ?? 'bu_wulan'
  return { id, ...POTRET[id] }
}
