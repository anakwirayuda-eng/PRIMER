/**
 * CONTENT PACK — seluruh konten game dalam satu objek immutable bertipe.
 * Engine menerima pack sebagai parameter; tidak pernah import konten langsung.
 */

import type {
  KasusKlinis,
  KasusIgd,
  KeluargaBinaan,
  KaderProfil,
  RwProfil,
  RumahSakit,
  Obat,
  ItemLab,
  TopikEdukasi,
  Tindakan,
} from './types'

export interface ContentPack {
  kasus: Record<string, KasusKlinis>
  /** Kasus gawat darurat IGD (M3.14) — pool interrupt event. */
  kasusIgd: Record<string, KasusIgd>
  keluarga: Record<string, KeluargaBinaan>
  kader: KaderProfil[]
  rw: RwProfil[]
  /** Jejaring rujukan SISRUTE (M3.13). */
  rumahSakit: RumahSakit[]
  obat: Record<string, Obat>
  lab: Record<string, ItemLab>
  edukasi: Record<string, TopikEdukasi>
  tindakan: Record<string, Tindakan>
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
    for (const grup of k.tatalaksana.obatAlternatif ?? []) {
      for (const o of grup) {
        if (!pack.obat[o]) masalah.push(`Kasus ${k.id}: obatAlternatif '${o}' tidak ada di formularium`)
      }
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
    // Edukasi WAJIB tak boleh kosong (CODEX P3): skorEdukasi memberi 100 bila
    // target 0 (kasus tanpa edukasi wajib) → celah auto-nilai. Setiap kasus
    // klinis harus punya ≥1 topik edukasi relevan.
    if (k.tatalaksana.edukasi.length === 0) {
      masalah.push(`Kasus ${k.id}: daftar edukasi wajib KOSONG (min 1 topik)`)
    }
    for (const e of k.tatalaksana.edukasi) {
      if (!pack.edukasi[e]) masalah.push(`Kasus ${k.id}: edukasi '${e}' tidak ada di katalog`)
    }
    // DeepThink triangulasi (2026-07-05): edukasiKritis WAJIB subset murni dari
    // edukasi wajib — kritis yg bukan bagian wajib tak pernah bisa "tercakup"
    // (celah logika senyap, bukan sekadar id yatim).
    for (const ek of k.tatalaksana.edukasiKritis ?? []) {
      if (!k.tatalaksana.edukasi.includes(ek)) {
        masalah.push(`Kasus ${k.id}: edukasiKritis '${ek}' bukan anggota edukasi wajib kasus ini`)
      }
    }
    for (const p of k.tatalaksana.prosedur ?? []) {
      if (!pack.tindakan[p]) masalah.push(`Kasus ${k.id}: tindakan '${p}' tidak ada di katalog`)
    }
    // Rujukan berjenjang: kasus wajib-rujuk harus tahu spesialisasi tujuannya,
    // dan minimal satu RS di jejaring menyediakannya.
    if (k.harusDirujuk) {
      if (!k.spesialisRujukan) {
        masalah.push(`Kasus ${k.id}: harusDirujuk tapi tanpa spesialisRujukan`)
      } else if (!pack.rumahSakit.some((rs) => rs.spesialisasi.includes(k.spesialisRujukan!))) {
        masalah.push(`Kasus ${k.id}: tidak ada RS dengan spesialisasi '${k.spesialisRujukan}'`)
      }
    }
  }
  // IGD (M3.14) — sama seperti kasus klinik: langkah harus punya pilihan benar,
  // dan disposisi rujuk harus punya spesialisasi + RS yang menyediakannya.
  for (const k of Object.values(pack.kasusIgd)) {
    if (k.langkah.length === 0) masalah.push(`IGD ${k.id}: tidak punya langkah`)
    for (const l of k.langkah) {
      if (l.pilihan.length === 0) masalah.push(`IGD ${k.id} langkah ${l.id}: tidak punya pilihan`)
      if (!l.pilihan.some((p) => p.benar)) masalah.push(`IGD ${k.id} langkah ${l.id}: tidak ada pilihan benar`)
    }
    if (k.disposisiBenar === 'rujuk') {
      if (!k.spesialisRujukan) {
        masalah.push(`IGD ${k.id}: disposisiBenar rujuk tapi tanpa spesialisRujukan`)
      } else if (!pack.rumahSakit.some((rs) => rs.spesialisasi.includes(k.spesialisRujukan!))) {
        masalah.push(`IGD ${k.id}: tidak ada RS dengan spesialisasi '${k.spesialisRujukan}'`)
      }
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
