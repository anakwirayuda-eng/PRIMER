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

export interface PosisiHotspotVisual {
  x: number
  y: number
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

/*
 * Koordinat hotspot di konten berasal dari panggung SVG lama. M12 mengganti
 * panggung dengan foto-ilustrasi, sehingga koordinat renderer harus ditambatkan
 * ulang ke benda yang benar tanpa mengubah kontrak/fingerprint konten.
 */
const POSISI_HOTSPOT_VISUAL: Record<string, Record<string, readonly [number, number]>> = {
  wulan_k1: {
    wk1_h1: [69, 42], wk1_h2: [47, 83], wk1_h3: [83, 50], wk1_h4: [48, 39], wk1_h5: [36, 45],
  },
  wulan_k2: {
    wk2_h1: [45, 88], wk2_h2: [34, 25], wk2_h3: [4, 83], wk2_h4: [10, 33], wk2_h5: [72, 84],
  },
  santoso_k1: {
    sk1_h1: [78, 82], sk1_h2: [66, 23], sk1_h3: [90, 25], sk1_h4: [84, 55], sk1_h5: [73, 24],
  },
  santoso_k2: {
    sk2_h1: [10, 22], sk2_h2: [65, 85], sk2_h3: [12, 66], sk2_h4: [88, 26], sk2_h5: [38, 53],
  },
  ketut_k1: {
    kk1_h1: [55, 87], kk1_h2: [36, 87], kk1_h3: [46, 77], kk1_h4: [15, 62], kk1_h5: [38, 78], kk1_h6: [74, 59],
  },
  ketut_k2: {
    kk2_h1: [55, 84], kk2_h2: [53, 20], kk2_h3: [74, 56], kk2_h4: [8, 52], kk2_h5: [86, 87],
  },
  dewi_k1: {
    dewi_h_kia: [49, 88], dewi_h_fe: [77, 87], dewi_h_rokok: [78, 35], dewi_h_jemuran: [25, 15], dewi_h_kis: [87, 88],
  },
  dewi_k2: {
    dewi_h2_kia: [54, 82], dewi_h2_fe: [20, 84], dewi_h2_rokok: [78, 35], dewi_h2_brosur: [82, 90], dewi_h2_uang: [90, 81],
  },
  musa_k1: {
    musa_h_obat: [80, 75], musa_h_foto: [89, 42], musa_h_teh: [22, 82], musa_h_kacamata: [49, 86], musa_h_bpjs: [37, 82],
  },
  musa_k2: {
    musa_h2_kotak: [48, 82], musa_h2_kalender: [39, 18], musa_h2_resep: [18, 67], musa_h2_gula: [12, 20], musa_h2_prolanis: [38, 92], musa_h2_hp: [67, 89],
  },
  raharjo_k1: {
    raharjo_h_setapak: [15, 56], raharjo_h_tebing: [24, 60], raharjo_h_rokok: [76, 68], raharjo_h_gentong: [58, 58], raharjo_h_kis: [77, 14],
  },
  raharjo_k2: {
    raharjo_h2_galian: [16, 70], raharjo_h2_batako: [14, 59], raharjo_h2_kretek: [66, 44], raharjo_h2_celengan: [92, 67], raharjo_h2_jadwal: [47, 18],
  },
  asih_k1: {
    ak1_h1: [57, 71], ak1_h2: [44, 84], ak1_h3: [15, 78], ak1_h4: [68, 20], ak1_h5: [7, 43],
  },
  asih_k2: {
    ak2_h1: [49, 81], ak2_h2: [87, 24], ak2_h3: [10, 70], ak2_h4: [19, 48],
  },
  asih_k3: {
    ak3_h1: [68, 15], ak3_h2: [25, 80], ak3_h3: [12, 20], ak3_h4: [85, 55],
  },
  slamet_k1: {
    slk1_h1: [59, 30], slk1_h2: [87, 25], slk1_h3: [90, 73], slk1_h4: [60, 34],
  },
  slamet_k2: {
    slk2_h1: [49, 74], slk2_h2: [29, 86], slk2_h3: [8, 79], slk2_h4: [76, 15],
  },
  yani_k1: {
    yk1_h1: [58, 78], yk1_h2: [76, 80], yk1_h3: [55, 67], yk1_h4: [72, 18],
  },
  yani_k2: {
    yk2_h1: [83, 88], yk2_h2: [92, 46], yk2_h3: [45, 88], yk2_h4: [48, 10],
  },
  prapto_k1: {
    prk1_h1: [24, 52], prk1_h2: [82, 57], prk1_h3: [69, 23], prk1_h4: [52, 35],
  },
  marni_k1: {
    mk1_h1: [22, 80], mk1_h2: [31, 75], mk1_h3: [75, 83], mk1_h4: [59, 84],
  },
  gunawan_k1: {
    gk1_h1: [60, 42], gk1_h2: [52, 43], gk1_h3: [26, 68], gk1_h4: [13, 17],
  },
  gunawan_k2: {
    gk2_h1: [14, 84], gk2_h2: [54, 85], gk2_h3: [86, 27], gk2_h4: [50, 8],
  },
  lastri_k1: {
    lk1_h1: [48, 75], lk1_h2: [89, 28], lk1_h3: [55, 15], lk1_h4: [7, 50],
  },
  bagyo_k1: {
    bk1_h1: [85, 45], bk1_h2: [15, 58], bk1_h3: [67, 26], bk1_h4: [11, 45],
  },
  endah_k1: {
    ek1_h1: [61, 87], ek1_h2: [63, 70], ek1_h3: [14, 30], ek1_h4: [84, 84],
  },
  karsa_k1: {
    kk1_h1: [30, 60], kk1_h2: [48, 86], kk1_h3: [70, 75], kk1_h4: [11, 35],
  },
}

export const ID_HOTSPOT_BERVISUAL = Object.freeze(
  Object.entries(POSISI_HOTSPOT_VISUAL).flatMap(([skenarioId, hotspot]) =>
    Object.keys(hotspot).map((hotspotId) => `${skenarioId}:${hotspotId}`),
  ),
)

export function posisiHotspotVisual(
  skenarioId: string,
  hotspotId: string,
  fallback: PosisiHotspotVisual,
): PosisiHotspotVisual {
  const posisi = POSISI_HOTSPOT_VISUAL[skenarioId]?.[hotspotId]
  return posisi ? { x: posisi[0], y: posisi[1] } : fallback
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
