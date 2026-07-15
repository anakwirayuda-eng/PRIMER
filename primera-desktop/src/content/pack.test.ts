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
  it('M13-1a: tautan SKDI mencakup gout dan tiga kasus 4A pilot baru', () => {
    const kasusIds = Object.keys(PACK.kasus)
    const linked = new Set(PACK.skdi144.filter((e) => e.kasusId).map((e) => e.kasusId))
    expect(linked.has('mm_gout_artritis_akut')).toBe(true)
    const totalTertaut = kasusIds.filter((id) => linked.has(id)).length
    expect(linked.has('hipoglikemia_ringan_dewasa')).toBe(true)
    expect(linked.has('benda_asing_hidung_anak')).toBe(true)
    expect(linked.has('otitis_eksterna_akut_ringan')).toBe(true)
    expect(totalTertaut).toBe(49)
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

  // M9.2 follow-up (2026-07-11): audit §26/§32 CODEX_AUDIT_DOSSIER.md menemukan 5
  // kasus yang self-report `skdi:'4A'`-nya SENDIRI keliru dibanding dokumen resmi
  // (SKDI 2012 Lampiran-3 / Kepmenkes 1186/2022) — didokumentasikan sejak M9 tapi
  // sempat "menggantung" (dr. Wirayuda belum diminta memutuskan scr eksplisit).
  // Dikoreksi setelah dr. Wirayuda meninjau ulang audit & mengonfirmasi eksekusi.
  // `fktp144` ikut jadi false (bukan 4A → bukan bagian 144 wajib-tuntas, sesuai
  // invarian test di atas). Level PPK/SKDI resmi per kasus:
  //   - kulit_dermatitis_kontak: "Dermatitis kontak alergika" = 3A
  //   - tht_rinosinusitis_akut: "Sinusitis" = 3A (DIKONFIRMASI 2026-07-11, teks
  //     SKDI 2012 Lampiran-3 penuh dibaca langsung: entri #93 "Sinusitis" generik
  //     = 3A; #94/#95 "Sinusitis frontal/maksilaris akut" level-2 adalah entri
  //     situs-TUNGGAL-terkonfirmasi, beda kompetensi dari sindrom klinis
  //     multi-sinus tanpa pencitraan yg diajarkan kasus ini — bukan ambiguitas lagi)
  //   - mm_osteoartritis_lutut: "Artritis, osteoarthritis" (entri gabungan) = 3A
  //   - jiwa_gangguan_cemas: "Gangguan cemas menyeluruh" = 3A
  //   - jiwa_depresi_ringan: "Depresi endogen, episode tunggal & rekuran" = 2
  //     (bukan 3A — cuma "mengenali & merujuk", tanpa penatalaksanaan awal sama sekali)
  // `skdi` ikut di-hash sidikJariPack (verifikasi.ts) & dipakai runtime Director
  // (kasusAman/bias-4A-minggu-1) — bukan field kosmetik murni, maka REVISI_ENGINE
  // ikut naik bersama fix ini.
  it('M9.2 follow-up: 5 kasus dgn skdi self-report keliru sudah dikoreksi ke level resmi', () => {
    const levelResmi: Record<string, string> = {
      kulit_dermatitis_kontak: '3A',
      tht_rinosinusitis_akut: '3A',
      mm_osteoartritis_lutut: '3A',
      jiwa_gangguan_cemas: '3A',
      jiwa_depresi_ringan: '2',
    }
    for (const [id, level] of Object.entries(levelResmi)) {
      const k = PACK.kasus[id]
      expect(k, `kasus ${id} harus ada di PACK`).toBeTruthy()
      expect(k?.skdi, `${id}.skdi`).toBe(level)
      expect(k?.fktp144, `${id}.fktp144`).toBe(false)
    }
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

  // Bug live (2026-07-05): user main mm_gout_artritis_akut, pesan lab "Asam
  // Urat" (bukan "Asam Urat Darah" yg dipakai kasus ini di lab-nya sendiri)
  // dan dapat hasil generik "dalam batas normal" — padahal narasi kasus
  // sendiri bilang 9.2 mg/dL TINGGI (dgn catatan penting "kadar dapat normal
  // saat serangan akut, diagnosis tetap klinis"). Root cause: katalog lab py
  // DUA entri near-duplicate utk konsep SAMA (asam urat serum) — `asam_urat`
  // YATIM (tak dipakai kasus manapun) muncul berdampingan dgn `asam_urat_
  // darah` yg sungguhan dipakai, gampang salah pilih krn nama nyaris identik.
  // Dihapus krn 100% redundan (bukan pengecualian layak allowlist spt duplikat
  // ICD skdi144 — di sana dua kode MEMANG beda penyakit yg sengaja digabung).
  it('lab "asam_urat" (near-duplikat asam_urat_darah, yatim) sudah dihapus', () => {
    expect(PACK.lab['asam_urat']).toBeUndefined()
    expect(PACK.lab['asam_urat_darah']).toBeDefined()
  })

  // Ditemukan sekalian saat audit di atas: `mikroskopis_bta` (nama tampilan
  // "Mikroskopis Gram/KOH", TAK terkait BTA sama sekali) py id yg mengandung
  // substring "bta" — `cocokLab` (util.ts) mencocokkan query jg thd `id`,
  // bukan cuma `nama`, jadi mencari "BTA" (mis. utk kasus TB, bta_sputum)
  // ikut menjaring entri tak-relevan ini krn kebetulan id-nya nyerempet.
  // Juga yatim (tak dipakai kasus manapun) — id diganti biar tak nyangkut.
  it('lab mikroskopis Gram/KOH tak lagi ber-id mengandung "bta" (nyangkut di pencarian BTA sputum TB)', () => {
    expect(PACK.lab['mikroskopis_bta']).toBeUndefined()
    expect(PACK.lab['mikroskopis_gram_koh']).toBeDefined()
    expect(PACK.lab['mikroskopis_gram_koh']!.nama).toContain('Gram/KOH')
  })

  // M10.c (2026-07-06, dossier §47): kelas bug SAMA dgn asam_urat di atas,
  // sisi OBAT — `garam_oralit_zinc` ("Paket Oralit + Zinc (program)") yatim
  // (nol referensi kasus/engine) dan kembaran `oralit`+`zinc_20` yg sungguhan
  // dipakai kasus diare. Lebih berbahaya dari sekadar yatim: clue diare
  // eksplisit bilang "ORALIT tiap BAB cair + ZINC 20 mg" — paket gabungan ini
  // justru tampak pilihan PALING benar di pencarian "oralit", tapi
  // meresepkannya dihitung obat-di-luar-tatalaksana (−15). Dihapus.
  it('obat "garam_oralit_zinc" (paket yatim, kembaran oralit+zinc_20) sudah dihapus', () => {
    expect(PACK.obat['garam_oralit_zinc']).toBeUndefined()
    expect(PACK.obat['oralit']).toBeDefined()
    expect(PACK.obat['zinc_20']).toBeDefined()
  })

  // M10.c (dossier §47): 3 invariant integritas alergiTrap di validasiPack
  // (audit hari ini: 0 pelanggaran di 6 kasus trap — ini pagar konten depan).
  // Uji tiap cabang via pack rusak buatan di atas kasus trap nyata
  // (faringitis_akut: kelas penisilin, terlarang amoxicillin_500).
  it('validasiPack menolak 3 kelas pelanggaran integritas alergiTrap', () => {
    const kasusUji = PACK.kasus['faringitis_akut']!
    // (a) obatTerlarang tak sekelas trap (paracetamol bukan penisilin)
    const rusakA = { ...PACK, kasus: { ...PACK.kasus, faringitis_akut: { ...kasusUji, alergiTrap: { ...kasusUji.alergiTrap!, obatTerlarang: ['paracetamol_500'] } } } }
    expect(validasiPack(rusakA).some((m) => m.includes("obatTerlarang 'paracetamol_500' tak ber-golonganAlergi"))).toBe(true)
    // (b) obat benar sekelas trap tapi tak ada di obatTerlarang
    const rusakB = { ...PACK, kasus: { ...PACK.kasus, faringitis_akut: { ...kasusUji, alergiTrap: { ...kasusUji.alergiTrap!, obatTerlarang: ['amoxicillin_sirup'] } } } }
    expect(validasiPack(rusakB).some((m) => m.includes("'amoxicillin_500' sekelas trap") && m.includes('slot mustahil'))).toBe(true)
    // (c) alternatifBenar justru sekelas trap
    const rusakC = { ...PACK, kasus: { ...PACK.kasus, faringitis_akut: { ...kasusUji, alergiTrap: { ...kasusUji.alergiTrap!, alternatifBenar: ['amoxicillin_sirup'] } } } }
    expect(validasiPack(rusakC).some((m) => m.includes("alternatifBenar 'amoxicillin_sirup' justru sekelas trap"))).toBe(true)
  })

  // M10.c (dossier §47) — triase temuan agent pembaca, tiap butir diverifikasi
  // manual thd clue/konsekuensi sebelum dikunci di sini:
  // (1) tinea & kandidiasis dulu pakai `jaga_kelembapan_kulit` (MELEMBAPKAN)
  //     padahal clue keduanya eksplisit "jaga area KERING" — konsekuensi tinea
  //     bahkan bilang "kelembapan yang tidak dikoreksi memicu kekambuhan":
  //     topik lama menyuruh persis hal yang narasi sebut penyebab kambuh.
  //     Topik baru `jaga_area_kering` dibuat (pola kb_aman_menyusui/restriksi
  //     _cairan: konsep inti clue tanpa padanan katalog → entri baru).
  // (2) skabies: clue KAPITAL "OBATI SEMUA KONTAK SERUMAH" + "cuci seprai/
  //     handuk air panas" — topik `cuci_seprai_panas` SUDAH ADA (bertag
  //     [Skabies/kutu]!) tapi tak dipakai; kontak-serumah tanpa padanan →
  //     topik baru `obati_kontak_serumah`. `cuci_tangan` (lemah utk tungau)
  //     diganti.
  // (3) asma_ringan: clue eksplisit "ajarkan teknik inhaler" + KEDUA obat
  //     benar adalah inhaler, tapi topik `teknik_inhaler` absen; `hindari_
  //     alergen` generik diganti `hindari_pencetus_asma` (persis "kendalikan
  //     pencetus (asap rokok rumah!)" di clue). teknik_inhaler jadi
  //     edukasiKritis: teknik salah = obat tak pernah sampai paru — terapi
  //     GINA-nya sendiri tak bekerja (penalaran klinis kelas mm_gagal_jantung).
  // (4) gastritis: `gizi_seimbang` (Isi Piringku, generik) diganti
  //     `diet_lambung` ([Lambung] Hindari pedas, asam & kopi) — persis
  //     "modifikasi gaya hidup + waspadai pemicu" di clue.
  // (5) rinitis_alergi: `jaga_kelembapan_kulit` (topik KULIT utk kasus hidung)
  //     dibuang — salah sasaran, 4→3 topik.
  // Batch agent-3 (saraf/mata/tht + kia/jiwa), tiap butir diverifikasi manual:
  // (6) konjungtivitis_alergi: kompres_mata bernama "Kompres HANGAT" (hordeolum)
  //     — bertentangan clue "kompres DINGIN"; topik baru kompres_dingin_mata.
  // (7) saraf_bells_palsy: kompres_mata off-target — clue WAJIB "proteksi
  //     kornea: air mata buatan + tutup mata"; topik baru proteksi_kornea.
  // (8) tht_rinosinusitis_akut: minum_air_cukup ber-identitas ISK ("jangan
  //     menahan kencing") di kasus hidung — clue "bilas salin"; topik baru
  //     bilas_salin_hidung. tanda_bahaya jadi edukasiKritis (komplikasi orbita).
  // (9) kia_malaria_falsiparum: psn_3m = PSN 3M jentik Aedes/DBD, vektor SALAH
  //     (malaria = Anopheles/kelambu); topik baru cegah_malaria_kelambu.
  it.each([
    ['kulit_tinea_korporis', 'jaga_area_kering', 'jaga_kelembapan_kulit'],
    ['kulit_kandidiasis_kutis', 'jaga_area_kering', 'jaga_kelembapan_kulit'],
    ['skabies', 'cuci_seprai_panas', 'cuci_tangan'],
    ['asma_ringan', 'teknik_inhaler', 'hindari_alergen'],
    ['gastritis', 'diet_lambung', 'gizi_seimbang'],
    ['rinitis_alergi', 'cuci_seprai_panas', 'jaga_kelembapan_kulit'],
    ['mata_konjungtivitis_alergi', 'kompres_dingin_mata', 'kompres_mata'],
    ['saraf_bells_palsy', 'proteksi_kornea', 'kompres_mata'],
    ['tht_rinosinusitis_akut', 'bilas_salin_hidung', 'minum_air_cukup'],
    ['kia_malaria_falsiparum', 'cegah_malaria_kelambu', 'psn_3m'],
  ])('%s: edukasi memuat %s dan TIDAK memuat %s (clue-vs-edukasi M10.c)', (kasusId, wajibAda, wajibTiada) => {
    const kasus = PACK.kasus[kasusId]!
    expect(kasus.tatalaksana.edukasi).toContain(wajibAda)
    expect(kasus.tatalaksana.edukasi).not.toContain(wajibTiada)
  })

  it('skabies: topik baru obati_kontak_serumah dipakai (inti clue tanpa padanan katalog lama)', () => {
    expect(PACK.edukasi['obati_kontak_serumah']).toBeDefined()
    expect(PACK.kasus['skabies']!.tatalaksana.edukasi).toContain('obati_kontak_serumah')
  })

  // M10.c (dossier §47): variasi persona hanya boleh beda GAYA BAHASA, bukan
  // mengubah FAKTA klinis. jiwa_insomnia q_keluhan menanyakan subtipe (onset/
  // maintenance/early-waking); baku+2 persona = ONSET ("susah MEMULAI tidur"),
  // tapi variasi lansia dulu "sering kebangun tengah malam" = MAINTENANCE
  // (subtipe beda = fakta anamnesis berubah). Kini semua konsisten onset.
  it('jiwa_insomnia: variasi lansia konsisten subtipe ONSET (bukan maintenance)', () => {
    const q = PACK.kasus['jiwa_insomnia']!.anamnesis.find((a) => a.id === 'q_keluhan')!
    const lansia = q.variasi?.lansia ?? ''
    // konsisten dgn baku "susah memulai tidur" — tak boleh menyebut pola
    // kebangun-tengah-malam yg menggeser subtipe.
    expect(lansia).toMatch(/mulai tidur|memulai tidur/i)
    expect(lansia).not.toMatch(/kebangun tengah malam|terbangun/i)
  })

  it('validasiPack menolak rentang konsekuensi terbalik/negatif', () => {
    const kasusUji = PACK.kasus['dengue_df']!
    const rusak = { ...PACK, kasus: { ...PACK.kasus, dengue_df: { ...kasusUji, konsekuensi: { ...kasusUji.konsekuensi!, kembaliHariMin: 9, kembaliHariMax: 3 } } } }
    expect(validasiPack(rusak).some((m) => m.includes('kembaliHariMin 9 > kembaliHariMax 3'))).toBe(true)
  })

  // CODEX M10 (2026-07-05): jembatan karma (UKM→UKP) meng-inject nama/usia/
  // jenisKelamin anggota keluarga SUNGGUHAN ke kasusId yg dijadwalkan penulis
  // konten (init.ts:104-125) — kalau usia anggota itu tak masuk rentang
  // demografi kasusnya, pasien yg muncul di poli jadi tak masuk akal (bayi 3
  // bulan didiagnosis via kasus demografi 3-5 tahun, dst). Probe MENYELURUH
  // (bukan cuma titik yg CODEX temukan manual) atas SEMUA keluarga ber-karma.
  it('karma (UKM→UKP): usia anggota yg dijadwalkan cocok demografi kasusId-nya', () => {
    // Ditemukan CODEX, TERVERIFIKASI real, TAPI perbaikan yg benar butuh
    // konten baru (kasus pediatrik) atau keputusan penulis — bukan tambal
    // numerik yg malah merusak isi kasus dewasa yg sudah divalidasi EBM.
    // Didaftar di sini spy regresi lain tak numpang lolos diam-diam.
    const DIKETAHUI_BELUM_DIPERBAIKI = new Set([
      // Nayla (bayi 3 bulan, usia:0) → diare_akut_anak (demografi 3-5 THN) —
      // konten kasus (popok/jajan di sekolah) ditulis utk balita, bukan
      // bayi — widen demografi akan merusak akurasi kasus balita yg sudah
      // ada. Butuh kasus diare-bayi baru ATAU karma dialihkan (keputusan
      // penulis, bukan tambal mekanis).
      'keluarga_yani:diare_akut_anak',
      // Dimas (usia 7, kondisi asma_anak) → asma_ringan (demografi 15-40,
      // anamnesis first-person dewasa "napas SAYA...") — tak ada kasus asma
      // pediatrik di katalog. Sama: butuh konten baru, bukan tambal numerik.
      'keluarga_gunawan:asma_ringan',
    ])
    const masalah: string[] = []
    for (const [keluargaId, kel] of Object.entries(PACK.keluarga)) {
      const karma = kel.arc.kunjungan[0]?.karma
      if (!karma) continue
      const anggota = kel.anggota[karma.anggotaIndex]
      const kasus = PACK.kasus[karma.kasusId]
      if (!anggota || !kasus) continue // dijaga test lain (index/kasusId valid)
      const cocokUsia = anggota.usia >= kasus.demografi.usiaMin && anggota.usia <= kasus.demografi.usiaMax
      const cocokGender = !kasus.demografi.jenisKelamin || kasus.demografi.jenisKelamin === anggota.jenisKelamin
      if (!cocokUsia || !cocokGender) {
        const kunci = `${keluargaId}:${karma.kasusId}`
        if (!DIKETAHUI_BELUM_DIPERBAIKI.has(kunci)) {
          masalah.push(`${kunci} — ${anggota.nama} usia ${anggota.usia}/${anggota.jenisKelamin} vs demografi kasus ${JSON.stringify(kasus.demografi)}`)
        }
      }
    }
    expect(masalah).toEqual([])
  })

  // M10.b (2026-07-06, dossier §43): pool NAMA_WARGA (generator pasien acak)
  // WAJIB disjoint dari nama anggota keluarga binaan — tanpa guard ini pasien
  // acak klinik bisa bernama persis anggota binaan aktif ("Joko"/"Dewi"/
  // "Lastri" vs Mbah Lastri) → dua "orang" tak berhubungan berbagi identitas
  // di mata pemain. Ditemukan 17 tabrakan saat audit (termasuk identitas
  // karma Mbah Lastri & Mbah Painem). Pool marga `namaWarga.keluarga` TIDAK
  // dicek: mati (tak dipakai runtime mana pun — hanya pria/wanita yg dipakai
  // buatPasienDariKasus).
  it('pool NAMA_WARGA disjoint dari nama anggota keluarga binaan (identitas NPC unik)', () => {
    const pool = new Set([...PACK.namaWarga.pria, ...PACK.namaWarga.wanita])
    const inti = (n: string) => n.replace(/^(Bu|Pak|Mbah|Mas|Mbak|Nn\.?|Ny\.?|Tn\.?)\s+/i, '')
    const tabrakan: string[] = []
    for (const kel of Object.values(PACK.keluarga)) {
      for (const a of kel.anggota) {
        if (pool.has(a.nama) || pool.has(inti(a.nama))) tabrakan.push(`${kel.id}: ${a.nama}`)
      }
    }
    expect(tabrakan).toEqual([])
  })

  // Fix #11 (audit CODEX 2026-07-11): skenario TERAKHIR tiap arc keluarga harus
  // menarget SUPERSET dari union target semua skenario sebelumnya — indikator
  // yg jadi fokus kunjungan awal tak boleh "hilang" begitu saja di kunjungan
  // lanjutan (arc Yani kehilangan pantau_tumbuh_kembang di skenario ke-2, luput
  // krn tak ada pagar otomatis). Pagar ini menangkap seluruh kelas bug ini,
  // bukan cuma instance yg sudah ditemukan.
  it('skenario terakhir tiap arc keluarga menarget superset dari skenario sebelumnya', () => {
    const masalah: string[] = []
    for (const kel of Object.values(PACK.keluarga)) {
      const { kunjungan } = kel.arc
      if (kunjungan.length < 2) continue
      const targetSebelumnya = new Set(kunjungan.slice(0, -1).flatMap((sk) => sk.target))
      const targetAkhir = new Set(kunjungan[kunjungan.length - 1]!.target)
      for (const ind of targetSebelumnya) {
        if (!targetAkhir.has(ind)) masalah.push(`${kel.id}: skenario akhir kehilangan target '${ind}'`)
      }
    }
    expect(masalah).toEqual([])
  })

  // CODEX M10 ronde-2 (2026-07-06): `karma?` bertipe SkenarioKunjungan (types.ts)
  // — TIDAK dibatasi structural ke kunjungan[0], dan test invarian demografi
  // di atas pun cuma cek `kunjungan[0]?.karma` (pola sama). TAPI `init.ts`
  // (`jadwalKarma`) HANYA membaca `content.arc.kunjungan[0]` — karma di posisi
  // lain akan lolos validasiPack (well-formed) namun TAK PERNAH dijadwalkan,
  // celah senyap murni krn asimetri validator-vs-engine. Saat ini 0 instance
  // (9 karma real semua di index 0) — ini pagar preventif utk konten masa depan,
  // bukan bug aktif. validasiPack HARUS menolak karma di kunjungan[i] utk i>0.
  it('karma di kunjungan SELAIN indeks-0 ditolak validasiPack (init.ts cuma proses index 0)', () => {
    const kelId = 'keluarga_wulan'
    const kel = PACK.keluarga[kelId]!
    const kasusIdValid = Object.keys(PACK.kasus)[0]!
    const rusak = {
      ...PACK,
      keluarga: {
        ...PACK.keluarga,
        [kelId]: {
          ...kel,
          arc: {
            ...kel.arc,
            kunjungan: kel.arc.kunjungan.map((sk, i) =>
              i === 1
                ? { ...sk, karma: { kasusId: kasusIdValid, anggotaIndex: 0, jatuhTempoHari: 10, narasi: 'uji' } }
                : sk,
            ),
          },
        },
      },
    }
    expect(validasiPack(rusak)).toContain(
      `Keluarga ${kelId}: karma di kunjungan[1] tak akan pernah dijadwalkan (init.ts hanya memproses arc.kunjungan[0])`,
    )
  })

  // DeepThink triangulasi (2026-07-05, docs/DEEPTHINK_EDUKASI_KRITIS.md):
  // validasiPack menolak edukasiKritis yg BUKAN anggota edukasi wajib —
  // celah logika senyap (kritis tak akan pernah "tercakup" krn tak pernah
  // diperiksa terhadap enc.edukasi lewat edukasiWajib sama sekali).
  it('edukasiKritis WAJIB subset dari edukasi (validasiPack)', () => {
    const kasusUji = PACK.kasus['dengue_df']!
    const rusak = { ...PACK, kasus: { ...PACK.kasus, dengue_df: { ...kasusUji, tatalaksana: { ...kasusUji.tatalaksana, edukasiKritis: ['topik_tak_ada_di_wajib'] } } } }
    expect(validasiPack(rusak)).toContain("Kasus dengue_df: edukasiKritis 'topik_tak_ada_di_wajib' bukan anggota edukasi wajib kasus ini")
  })

  // DeepThink triangulasi (2026-07-05) — batch 1 kasus yang ditag edukasiKritis,
  // diverifikasi thd clue/konsekuensi masing2 sebelum ditandai (bukan tebakan):
  // dengue_df (tanda_bahaya — konsekuensi eksplisit sebut DSS/perdarahan),
  // tb_paru (minum_oat_tuntas — konsekuensi eksplisit sebut TB-RO/penularan),
  // diare_akut_anak (cairan_oralit — konsekuensi eksplisit sebut syok
  // hipovolemik bila rehidrasi tak diedukasi), hipertensi_esensial &
  // dm_tipe2 (kepatuhan_obat — penyakit kronis asimtomatik "silent killer",
  // kegagalan klasik krn pasien berhenti obat sendiri saat merasa membaik).
  // pneumonia_balita & "asma_bronkial_eksaserbasi" (usulan awal DeepThink)
  // SENGAJA tak ditag: yg pertama wajib-nya cuma 3 topik (tak kena celah,
  // target=wajib=3 sudah menuntut semua), yg kedua tak ada di katalog sama
  // sekali (tak ada kasus asma pediatrik/eksaserbasi di 67 kasus).
  //
  // Batch 2 (CODEX M10 ronde-2, 2026-07-06, docs §40) — 6 dari 8 kandidat
  // CODEX diterima, tiap satu diverifikasi thd konsekuensi.narasi masing2
  // sebelum ditandai: faringitis_akut & tonsilitis_akut & demam_tifoid &
  // kia_isk_kehamilan (kepatuhan_obat — konsekuensi eksplisit sebut demam
  // rematik/perforasi usus/pielonefritis bila antibiotik tak dituntaskan),
  // mm_gagal_jantung_kongestif (restriksi_cairan_gagal_jantung — topik
  // KHAS-CHF vs 3 topik lain yg generik, selaras fix §33), disentri_basiler
  // (cairan_oralit — konsekuensi eksplisit sebut dehidrasi memberat).
  // ppok_eksaserbasi DITOLAK (CODEX sendiri beri label "kandidat sedang"):
  // konsekuensinya ("tidak segera dirujuk... gagal napas") murni soal
  // KETERLAMBATAN RUJUKAN dokter, bukan kegagalan edukasi pasien manapun
  // — tak ada topik yg jadi trigger tekstual outcome buruknya, beda kelas
  // dari 6 kasus lain di sini. kulit_morbili DITERIMA (tanda_bahaya):
  // kondisiKembali eksplisit "napas cepat, tarikan dinding dada" — persis
  // red flag pneumonia yg tanda_bahaya ajarkan orang tua kenali di rumah.
  it.each([
    ['dengue_df', 'tanda_bahaya'],
    ['tb_paru', 'minum_oat_tuntas'],
    ['diare_akut_anak', 'cairan_oralit'],
    ['hipertensi_esensial', 'kepatuhan_obat'],
    ['dm_tipe2', 'kepatuhan_obat'],
    ['faringitis_akut', 'kepatuhan_obat'],
    ['tonsilitis_akut', 'kepatuhan_obat'],
    ['demam_tifoid', 'kepatuhan_obat'],
    ['kia_isk_kehamilan', 'kepatuhan_obat'],
    ['mm_gagal_jantung_kongestif', 'restriksi_cairan_gagal_jantung'],
    ['disentri_basiler', 'cairan_oralit'],
    ['kulit_morbili', 'tanda_bahaya'],
    // M10.c: clue eksplisit "ajarkan teknik inhaler" + kedua obatBenar inhaler
    // — teknik salah = obat tak sampai paru, terapi GINA tak bekerja sama sekali.
    ['asma_ringan', 'teknik_inhaler'],
    // M10.c: konsekuensi.narasi eksplisit komplikasi orbita/intrakranial "gawat".
    ['tht_rinosinusitis_akut', 'tanda_bahaya'],
  ])('%s: edukasiKritis berisi %s', (kasusId, topikKritis) => {
    const kasus = PACK.kasus[kasusId]!
    expect(kasus.tatalaksana.edukasiKritis).toContain(topikKritis)
  })
})
