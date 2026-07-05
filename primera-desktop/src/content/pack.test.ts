/**
 * Gerbang fail-fast konten (CODEX P2): PACK produksi wajib lolos validasiPack
 * di CI terlepas dari mode DEV — men-throw di runtime saja tak cukup bila
 * tak ada yang menjalankan game dalam mode dev sebelum rilis.
 */

import { describe, expect, it } from 'vitest'
import { PACK } from './index'
import { validasiPack } from './pack'
import { NAMA_ICD } from './icd10'
import { buatEncounter, nilaiEncounter } from '../engine/clinic'
import { buatPasienDariKasus } from '../engine/director'
import { Rng } from '../engine/core/rng'

describe('PACK — validasi silang id konten', () => {
  it('tidak punya masalah drift (obat/lab/edukasi/tindakan/RS/karma/IGD)', () => {
    expect(validasiPack(PACK)).toEqual([])
  })

  it('SEMUA kode diagnosisBanding punya nama (temuan playtest: "Kode M06.9" telanjang)', () => {
    // Berlapis persis seperti util.namaDiagnosis: kasus playable → skdi144 → kamus icd10.ts.
    const bisaResolve = new Set<string>([
      ...Object.values(PACK.kasus).map((k) => k.icd10),
      ...PACK.skdi144.map((e) => e.icd10),
      ...Object.keys(NAMA_ICD),
    ])
    const telanjang: string[] = []
    for (const k of Object.values(PACK.kasus)) {
      for (const kode of k.diagnosisBanding) {
        if (!bisaResolve.has(kode)) telanjang.push(`${k.id}: ${kode}`)
      }
    }
    expect(telanjang).toEqual([])
  })

  it('kasus ber-alergiTrap WAJIB punya pertanyaan alergi yang bisa ditemukan pemain (CODEX P1)', () => {
    // UI membuka riwayat alergi hanya bila ada pertanyaan ber-teks "alergi" yang
    // ditanyakan — trap tanpa jalan bertanya = hukuman untuk informasi tersembunyi.
    const tanpaJalan = Object.values(PACK.kasus)
      .filter((k) => k.alergiTrap !== undefined)
      .filter((k) => !k.anamnesis.some((q) => q.tanya.toLowerCase().includes('alergi')))
      .map((k) => k.id)
    expect(tanpaJalan).toEqual([])
  })

  // Konkordansi ICD-10 (audit 2026-07-04): entri SKDI-144 yang MENAUTKAN kasus
  // (kasusId) harus memakai icd10 yang SAMA dengan kasusnya — kecuali beberapa
  // yang SENGAJA memakai kode kompetensi generik (parent/unspecified) sementara
  // kasusnya lebih spesifik. Allowlist di bawah = keputusan sadar; entri baru
  // yang mismatch (mis. kode SIBLING beda penyakit seperti otitis H65.0 vs
  // H66.0 yang sudah diperbaiki) akan GAGAL agar ditinjau.
  it('skdi144.kasusId ↔ icd10 cocok dgn kasus (kecuali kode kompetensi generik)', () => {
    const GENERIK_SENGAJA = new Set([
      'conjunctivitis_bacterial',
      'tb_pulmonary',
      'dm_type2',
      // CODEX ronde-14 §5 (2026-07-04) — tertaut manual setelah verifikasi
      // thd dokumen SKDI resmi (Perkonsil 11/2012) mengonfirmasi SEMUA 4A,
      // kompetensi SAMA dgn kasus, kasus cuma pakai ICD-10 lebih spesifik:
      'dysentery', // A03 (parent) vs kasus disentri_basiler A03.9
      'hemorrhoid_12', // I84 (kode SKDI umum) vs kasus hemoroid_grade1 K64.0
      'migraine', // G43.9 (unspesifik) vs kasus saraf_migrain G43.0 (tanpa aura)
      'vertigo_bppv', // R42 (simtom umum) vs kasus saraf_vertigo_bppv H81.1 (BPPV spesifik)
      'normal_pregnancy', // Z34 vs kasus kia_anc_kehamilan_normal Z34.0 (trimester)
      'malaria_vivax', // B54 (unspesifik) vs kasus kia_malaria_falsiparum B50.9 (spesies)
      'uti', // N39.0 vs kasus kia_isk_kehamilan O23.4 (ISK DALAM kehamilan, penyakit sama)
      // M9.2 (2026-07-04) — tertaut manual setelah verifikasi thd dokumen
      // OTORITATIF Kepmenkes 1186/2022 (bukan cuma SKDI umum 2012): kompetensi
      // "Hiperurisemia-Gout Arthritis" digabung SATU (E79.0 + M10) di sana.
      'hyperuricemia', // E79.0 vs kasus mm_gout_artritis_akut M10.9 — kompetensi gabungan resmi
    ])
    const mismatch = PACK.skdi144
      .filter((e): e is typeof e & { kasusId: string } => e.kasusId !== undefined)
      .filter((e) => !GENERIK_SENGAJA.has(e.id))
      .filter((e) => {
        const k = PACK.kasus[e.kasusId]
        return k !== undefined && k.icd10 !== e.icd10
      })
      .map((e) => `${e.id}: ${e.icd10} ≠ kasus ${PACK.kasus[e.kasusId]!.icd10}`)
    expect(mismatch).toEqual([])
  })

  it('CODEX ronde-14 §5: 7 kasus tambahan kini tertaut Dex/SKDI144 (38→45 dari 67 playable)', () => {
    const kasusIds = Object.keys(PACK.kasus)
    const linked = new Set(PACK.skdi144.filter((e) => e.kasusId).map((e) => e.kasusId))
    const tertautBaru = [
      'disentri_basiler',
      'hemoroid_grade1',
      'saraf_migrain',
      'saraf_vertigo_bppv',
      'kia_anc_kehamilan_normal',
      'kia_malaria_falsiparum',
      'kia_isk_kehamilan',
    ]
    for (const id of tertautBaru) expect(linked.has(id)).toBe(true)
    // Total tumbuh lagi di ronde M9.2 (lihat test berikut) — cek per-kasus di
    // atas cukup di sini, total keseluruhan diverifikasi test M9.2 di bawah.
    expect(kasusIds.filter((id) => linked.has(id)).length).toBeGreaterThanOrEqual(45)
  })

  // M9.2 — audit terhadap dokumen OTORITATIF (Kepmenkes 1186/2022, bukan cuma
  // SKDI umum 2012 §26) mengonfirmasi "Hiperurisemia-Gout Arthritis" adalah
  // SATU kompetensi 4A gabungan (E79.0 + M10) — kasus gout tautkan ke entri
  // hyperuricemia yang SUDAH ada (bukan entri baru, jaga TEPAT 144).
  it('M9.2: mm_gout_artritis_akut kini tertaut ke entri hyperuricemia (Kepmenkes 1186/2022: "Hiperurisemia-Gout Arthritis" 4A)', () => {
    const kasusIds = Object.keys(PACK.kasus)
    const linked = new Set(PACK.skdi144.filter((e) => e.kasusId).map((e) => e.kasusId))
    expect(linked.has('mm_gout_artritis_akut')).toBe(true)
    const totalTertaut = kasusIds.filter((id) => linked.has(id)).length
    expect(totalTertaut).toBe(46)
  })

  // CODEX ronde-16 P2 (2026-07-04): field `fktp144` per-kasus ("termasuk daftar
  // 144 penyakit wajib TUNTAS FKTP") secara definisi cuma berlaku utk kompetensi
  // 4A — level 3A/3B eksplisit berarti BUKAN wajib-tuntas (butuh rujuk/rujuk
  // sebagian). 8 kasus ditemukan `fktp144:true` padahal `skdi` sendiri 3A/3B —
  // kontradiksi internal, independen dari dokumen otoritatif manapun (bukan soal
  // SKDI 2012 vs Kepmenkes 1186/2022, murni dua field self-report yg saling
  // bertentangan). Diperbaiki jadi `fktp144:false` (field ini tak dipakai runtime
  // manapun — cuma metadata dokumentasi konten — jadi ini bukan bug fungsional,
  // tapi tetap diperbaiki agar tak menyesatkan audit berikutnya).
  it('fktp144:true hanya utk kasus berkompetensi 4A (bukan 3A/3B — kontradiksi internal)', () => {
    const kontradiksi = Object.values(PACK.kasus)
      .filter((k) => k.fktp144 === true && k.skdi !== '4A')
      .map((k) => `${k.id}: skdi=${k.skdi}`)
    expect(kontradiksi).toEqual([])
  })

  // CODEX ronde-16 P3: auto-link (index.ts) mencocokkan icd10 kasus↔skdi144
  // PER-ENTRI independen — dua entri skdi144 ber-ICD10 SAMA bisa diam-diam
  // tertaut ke KASUS YANG SAMA sekaligus begitu ada kasus baru dgn ICD tsb
  // (belum ada kasus manapun yg pakai ketiga kode ini hari ini — makanya
  // belum berdampak runtime, tapi ranjau tersembunyi utk konten mendatang).
  // Allowlist di bawah = pasangan yang SUDAH diketahui & defensible; entri
  // BARU yang tak sengaja duplikat ICD dgn entri lain akan GAGAL di sini.
  it('ICD-10 duplikat antar-entri skdi144 didokumentasikan eksplisit (bukan drift diam-diam)', () => {
    const ICD_DUPLIKAT_SENGAJA: Record<string, string> = {
      'N76.0': 'vaginitis vs bacterial_vaginosis — BV adalah bentuk vaginitis bakterial, kode sama defensible',
      'B35.0': 'tinea_capitis vs tinea_barbae — subtipe lokasi beda, spesies dermatofita sama',
      'S00-S09': 'blunt_trauma vs sharp_trauma — rentang kode ICD trauma umum, bukan kode spesifik',
    }
    const perIcd = new Map<string, string[]>()
    for (const e of PACK.skdi144) perIcd.set(e.icd10, [...(perIcd.get(e.icd10) ?? []), e.id])
    const duplikat = [...perIcd.entries()].filter(([, ids]) => ids.length > 1)

    const takDidokumentasi = duplikat.filter(([icd]) => !(icd in ICD_DUPLIKAT_SENGAJA)).map(([icd, ids]) => `${icd}: ${ids.join(', ')}`)
    expect(takDidokumentasi).toEqual([])

    // Duplikat yg TERDAFTAR tapi TAK LAGI ada di konten (mis. sudah diperbaiki)
    // wajib dihapus dari allowlist ini juga — cegah allowlist membusuk diam-diam.
    const sudahTakAda = Object.keys(ICD_DUPLIKAT_SENGAJA).filter((icd) => !perIcd.has(icd) || perIcd.get(icd)!.length < 2)
    expect(sudahTakAda).toEqual([])
  })

  // CODEX ronde-baru: clue ppok_eksaserbasi bilang "ketiganya ada → antibiotik
  // terindikasi" & obatSalahUmum menghukum kloramfenikol (antibiotik SALAH),
  // tapi tak ada satupun antibiotik BENAR di obatBenar/obatAlternatif — pemain
  // bisa full-score terapi TANPA memberi antibiotik yang justru diminta clue.
  it('ppok_eksaserbasi: antibiotik kini jadi slot terapi (bukan opsional yg terlewat)', () => {
    const kasus = PACK.kasus['ppok_eksaserbasi']!
    const semuaObatTatalaksana = [
      ...kasus.tatalaksana.obatBenar,
      ...(kasus.tatalaksana.obatAlternatif ?? []).flat(),
    ]
    const adaAntibiotik = semuaObatTatalaksana.some((id) => PACK.obat[id]?.antibiotik === true)
    expect(adaAntibiotik).toBe(true)

    const pasien = buatPasienDariKasus('ppok_eksaserbasi', PACK, new Rng(1, 'test'))
    const tanpaAntibiotik = nilaiEncounter(
      { ...buatEncounter(pasien), resep: ['salbutamol_inhaler', 'prednison_5'], tindakan: ['nebulisasi'] },
      kasus,
      PACK,
    )
    const antibiotikBenar = semuaObatTatalaksana.find((id) => PACK.obat[id]?.antibiotik === true)!
    const denganAntibiotik = nilaiEncounter(
      {
        ...buatEncounter(pasien),
        resep: ['salbutamol_inhaler', 'prednison_5', antibiotikBenar],
        tindakan: ['nebulisasi'],
      },
      kasus,
      PACK,
    )
    expect(denganAntibiotik.skorTerapi).toBeGreaterThan(tanpaAntibiotik.skorTerapi)
  })

  // CODEX (2026-07-05): clue kia_kb_konseling seluruhnya soal PEMILIHAN METODE
  // KB aman saat menyusui (non-hormonal/progestin-only, hindari kombinasi
  // estrogen) — tapi tatalaksana.edukasi lama (asi_eksklusif/kontrol_rutin/
  // gizi_seimbang) sama sekali tak menyentuh KB, jadi poin ajar utama kasus
  // ini tak pernah teruji mekanis. Topik `kb_aman_menyusui` ditambah & jadi
  // WAJIB (bukan cuma opsional di atas kapasitas — kapasitas edukasi 3 pas
  // dgn total wajib 3, jadi topik ini benar2 harus dipilih utk skor penuh).
  it('kia_kb_konseling: topik edukasi menguji pemilihan metode KB aman-menyusui (bukan cuma topik generik pasca-persalinan)', () => {
    const kasus = PACK.kasus['kia_kb_konseling']!
    expect(kasus.tatalaksana.edukasi).toContain('kb_aman_menyusui')

    const pasien = buatPasienDariKasus('kia_kb_konseling', PACK, new Rng(1, 'test'))
    const tanpaTopikKb = nilaiEncounter(
      { ...buatEncounter(pasien), edukasi: ['asi_eksklusif', 'kontrol_rutin'] },
      kasus,
      PACK,
    )
    const denganTopikKb = nilaiEncounter(
      { ...buatEncounter(pasien), edukasi: ['asi_eksklusif', 'kontrol_rutin', 'kb_aman_menyusui'] },
      kasus,
      PACK,
    )
    expect(denganTopikKb.skorEdukasi).toBeGreaterThan(tanpaTopikKb.skorEdukasi)
  })

  // CODEX (2026-07-05): mm_gagal_jantung_kongestif dulu wajib topik
  // `minum_air_cukup` (sinonim ISK/hidrasi — anjuran minum LEBIH BANYAK),
  // padahal manajemen gagal jantung justru butuh RESTRIKSI cairan —
  // mismatch internal antara clue (dekongesti/hati-hati cairan) dan topik
  // edukasi wajibnya sendiri. Diganti `restriksi_cairan_gagal_jantung`.
  it('mm_gagal_jantung_kongestif: topik edukasi tak lagi menyuruh "minum air cukup" (kebalikan restriksi cairan CHF)', () => {
    const kasus = PACK.kasus['mm_gagal_jantung_kongestif']!
    expect(kasus.tatalaksana.edukasi).not.toContain('minum_air_cukup')
    expect(kasus.tatalaksana.edukasi).toContain('restriksi_cairan_gagal_jantung')
  })
})
