/**
 * CONTENT PACK — seluruh konten game dalam satu objek immutable bertipe.
 * Engine menerima pack sebagai parameter; tidak pernah import konten langsung.
 */

import type {
  KasusKlinis,
  KeluargaBinaan,
  KaderProfil,
  RwProfil,
  Obat,
  ItemLab,
  TopikEdukasi,
} from './types'

export interface ContentPack {
  kasus: Record<string, KasusKlinis>
  keluarga: Record<string, KeluargaBinaan>
  kader: KaderProfil[]
  rw: RwProfil[]
  obat: Record<string, Obat>
  lab: Record<string, ItemLab>
  edukasi: Record<string, TopikEdukasi>
  /** Daftar 144 penyakit SKDI 4A untuk Dex (id → nama; sebagian punya kasus). */
  skdi144: { id: string; nama: string; icd10: string; kasusId?: string }[]
  namaWarga: { pria: string[]; wanita: string[]; keluarga: string[] }
}

/** Guard kecil: validasi silang id konten saat boot (fail-fast, anti-drift). */
export function validasiPack(pack: ContentPack): string[] {
  const masalah: string[] = []
  for (const k of Object.values(pack.kasus)) {
    for (const o of k.tatalaksana.obatBenar) {
      if (!pack.obat[o]) masalah.push(`Kasus ${k.id}: obat '${o}' tidak ada di formularium`)
    }
    for (const o of k.tatalaksana.obatSalahUmum ?? []) {
      if (!pack.obat[o.id]) masalah.push(`Kasus ${k.id}: obatSalahUmum '${o.id}' tidak ada di formularium`)
    }
    if (k.alergiTrap) {
      for (const o of [...k.alergiTrap.obatTerlarang, ...k.alergiTrap.alternatifBenar]) {
        if (!pack.obat[o]) masalah.push(`Kasus ${k.id}: alergiTrap obat '${o}' tidak ada di formularium`)
      }
    }
    for (const l of k.lab) {
      if (!pack.lab[l.id]) masalah.push(`Kasus ${k.id}: lab '${l.id}' tidak ada di katalog`)
    }
    for (const e of k.tatalaksana.edukasi) {
      if (!pack.edukasi[e]) masalah.push(`Kasus ${k.id}: edukasi '${e}' tidak ada di katalog`)
    }
  }
  for (const kel of Object.values(pack.keluarga)) {
    for (const sk of kel.arc.kunjungan) {
      if (sk.karma) {
        if (!pack.kasus[sk.karma.kasusId]) {
          masalah.push(`Keluarga ${kel.id}: karma kasus '${sk.karma.kasusId}' tidak ada`)
        }
        if (sk.karma.anggotaIndex < 0 || sk.karma.anggotaIndex >= kel.anggota.length) {
          masalah.push(`Keluarga ${kel.id}: karma anggotaIndex ${sk.karma.anggotaIndex} di luar jangkauan`)
        }
      }
    }
  }
  return masalah
}
