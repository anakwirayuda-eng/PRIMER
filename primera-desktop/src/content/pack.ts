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
    // M10 §49: integritas obatOpsional — wajib ada di formularium DAN disjoint
    // dari obatBenar/alternatif/salahUmum (satu obat satu semantik skor;
    // tumpang-tindih = ambigu: wajib sekaligus opsional, atau opsional
    // sekaligus dihukum).
    for (const id of k.tatalaksana.obatOpsional ?? []) {
      if (!pack.obat[id]) masalah.push(`Kasus ${k.id}: obatOpsional '${id}' tidak ada di formularium`)
      if (k.tatalaksana.obatBenar.includes(id) || (k.tatalaksana.obatAlternatif ?? []).flat().includes(id)) {
        masalah.push(`Kasus ${k.id}: obatOpsional '${id}' juga terdaftar sbg obat wajib/alternatif (semantik ganda)`)
      }
      if ((k.tatalaksana.obatSalahUmum ?? []).some((s) => s.id === id)) {
        masalah.push(`Kasus ${k.id}: obatOpsional '${id}' juga terdaftar di obatSalahUmum (opsional sekaligus dihukum)`)
      }
    }
    // M10 §49 (defense-in-depth): jawaban benar WAJIB jadi salah satu opsi —
    // DeckDiagnosis membangun pilihan SEMATA dari diagnosisBanding; icd10 kasus
    // yang tak tercantum = skorDiagnosis mustahil utk semua pemain (dan softlock
    // keras bila kasus tutorial). Hari ini 0 pelanggaran; pagar utk masa depan.
    if (!k.diagnosisBanding.includes(k.icd10)) {
      masalah.push(`Kasus ${k.id}: icd10 '${k.icd10}' tidak ada di diagnosisBanding — diagnosis benar mustahil dipilih`)
    }
    if (k.alergiTrap) {
      for (const o of [...k.alergiTrap.obatTerlarang, ...k.alergiTrap.alternatifBenar]) {
        if (!pack.obat[o]) masalah.push(`Kasus ${k.id}: alergiTrap obat '${o}' tidak ada di formularium`)
      }
      // M10.c (dossier §47) — 3 invariant integritas trap (hari ini 0 pelanggaran,
      // pagar utk konten masa depan). Semantik engine (clinic.ts): firewall
      // memblokir resep by golonganAlergi KELAS; standar emas bergeser
      // (obatBenar − obatTerlarang + alternatifBenar) saat pasien kena trap.
      const kelasTrap = k.alergiTrap.kelas.toLowerCase()
      for (const id of k.alergiTrap.obatTerlarang) {
        const o = pack.obat[id]
        // (a) obatTerlarang wajib sekelas trap — kalau tidak, firewall TAK
        // memblokirnya padahal standar emas menganggapnya terlarang.
        if (o && (o.golonganAlergi ?? '').toLowerCase() !== kelasTrap) {
          masalah.push(`Kasus ${k.id}: alergiTrap obatTerlarang '${id}' tak ber-golonganAlergi '${k.alergiTrap.kelas}' (firewall tak akan memblokirnya)`)
        }
      }
      const kandidatBenar = [...k.tatalaksana.obatBenar, ...(k.tatalaksana.obatAlternatif ?? []).flat()]
      for (const id of kandidatBenar) {
        const o = pack.obat[id]
        // (b) obat benar/alternatif yang sekelas trap WAJIB terdaftar di
        // obatTerlarang — kalau tidak, saat trap menyala slot itu MUSTAHIL
        // dipenuhi (firewall memblokir resepnya, slot tetap dituntut skor).
        if (o && (o.golonganAlergi ?? '').toLowerCase() === kelasTrap && !k.alergiTrap.obatTerlarang.includes(id)) {
          masalah.push(`Kasus ${k.id}: obat benar/alternatif '${id}' sekelas trap '${k.alergiTrap.kelas}' tapi tak ada di obatTerlarang (slot mustahil saat trap menyala)`)
        }
      }
      for (const id of k.alergiTrap.alternatifBenar) {
        const o = pack.obat[id]
        // (c) alternatifBenar tak boleh sekelas trap — alternatif yang
        // diblokir firewall-nya sendiri bukan alternatif.
        if (o && (o.golonganAlergi ?? '').toLowerCase() === kelasTrap) {
          masalah.push(`Kasus ${k.id}: alergiTrap alternatifBenar '${id}' justru sekelas trap '${k.alergiTrap.kelas}'`)
        }
      }
    }
    // M10.c (dossier §47): sanity rentang konsekuensi — min wajib ≤ max & ≥ 0.
    // (max > durasi stase TIDAK divalidasi di sini: itu keputusan desain
    // realisme kronis yang sedang menunggu keputusan user, bukan drift.)
    if (k.konsekuensi) {
      if (k.konsekuensi.kembaliHariMin > k.konsekuensi.kembaliHariMax) {
        masalah.push(`Kasus ${k.id}: konsekuensi kembaliHariMin ${k.konsekuensi.kembaliHariMin} > kembaliHariMax ${k.konsekuensi.kembaliHariMax}`)
      }
      if (k.konsekuensi.kembaliHariMin < 0) {
        masalah.push(`Kasus ${k.id}: konsekuensi kembaliHariMin negatif`)
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
    kel.arc.kunjungan.forEach((sk, idx) => {
      if (sk.karma) {
        // CODEX M10 ronde-2 (2026-07-06): `karma?` bertipe SkenarioKunjungan
        // tak dibatasi structural ke kunjungan[0], tapi `init.ts` (jadwalKarma)
        // HANYA membaca `arc.kunjungan[0]` — karma di posisi lain lolos
        // validasi well-formed (kasusId/anggotaIndex valid) namun TAK PERNAH
        // dijadwalkan runtime. Tutup celah senyap ini di sumbernya.
        if (idx > 0) {
          masalah.push(
            `Keluarga ${kel.id}: karma di kunjungan[${idx}] tak akan pernah dijadwalkan (init.ts hanya memproses arc.kunjungan[0])`,
          )
        }
        if (!pack.kasus[sk.karma.kasusId]) {
          masalah.push(`Keluarga ${kel.id}: karma kasus '${sk.karma.kasusId}' tidak ada`)
        }
        if (sk.karma.anggotaIndex < 0 || sk.karma.anggotaIndex >= kel.anggota.length) {
          masalah.push(`Keluarga ${kel.id}: karma anggotaIndex ${sk.karma.anggotaIndex} di luar jangkauan`)
        }
      }
    })
  }
  return masalah
}
