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
import type {
  EncounterArchetype,
  ModePolicy,
  ReleasePolicy,
  UkmScenario,
} from './curriculum/types'

/** Save lama tanpa identitas rilis selalu dipetakan ke baseline ini. */
export const LEGACY_CONTENT_RELEASE = 'legacy-baseline'

/** Rilis konten aktif. Berubah hanya pada batas kohort, bukan di tengah stase. */
export const LAB_CONTENT_RELEASE = 'm11-e2-saji-pilot-2026-07-17'
export const UKM_ASSURANCE_CONTENT_RELEASE = 'ukm-assurance-2026-07-19'
export const EDITORIAL_UX_CONTENT_RELEASE = 'editorial-ux-2026-07-19'
export const BRIDGE_CLOSURE_CONTENT_RELEASE = 'bridge-closure-2026-07-19'
export const DIALOGUE_COHERENCE_CONTENT_RELEASE = 'dialogue-coherence-2026-07-20'
export const CLASS_READINESS_CONTENT_RELEASE = 'class-readiness-2026-07-22'
export const IGD_ADJUDICATION_CONTENT_RELEASE = 'igd-adjudication-2026-07-22'
export const P1_OBSERVATION_CONTENT_RELEASE = 'p1-observation-governance-2026-07-28'
export const CLINICAL_PROVENANCE_CONTENT_RELEASE = 'clinical-provenance-2026-07-28'
/**
 * Batch kenyamanan gameplay 2026-08-01 (S1-S10 + copy-audit): debrief
 * hasil-dulu, surat ambang burnout/pembukaan program/janji-ditepati, slot
 * formatif diundi & bebas tax, ambang IKS/Prolanis terjangkau, silaturahmi
 * & delegasi kader di-rebalance, plus penyapuan bahasa pemain (jargon
 * internal → bahasa manusia). Decision-facing → rilis konten baru.
 */
export const GAMEPLAY_COMFORT_CONTENT_RELEASE = 'gameplay-comfort-2026-08-01'
/**
 * Sapuan kunci jawaban 2026-08-04 s.d. 2026-08-06 (beta.17). Yang berubah kali
 * ini KUNCI JAWABAN, bukan kenyamanan — karena itu rilis konten wajib naik:
 *   - 9 topik edukasi salah-tag disapu (5b881d7) dan 3 kasus berganti daftar
 *     edukasi + clue (7598725);
 *   - 4 kasus mendapat regio pemeriksaan fisik BARU ber-relevan (3bac514),
 *     sehingga penyebut skorPemeriksaan bergeser;
 *   - 17 kasus berganti sumber (7390ac4);
 *   - gerbang KLB, cakupan indikator Posyandu, dan label waktu Prolanis
 *     berubah pada sapuan audit 2026-08-06.
 *
 * KENAPA INI WAJIB, bukan sekadar rapi. Tanpa rilis baru, save dari beta.15/16
 * lolos `rilisArsipKompatibel` (store.ts — perbandingannya CUMA satu string
 * nama rilis) sehingga stase lama BISA DITERUSKAN dengan kunci jawaban baru.
 * Dossier yang diekspor sesudahnya membawa sidik jari build BARU, jadi ia lolos
 * gerbang "versi konten berbeda" di verifikasi.ts §3a — lalu replay memutar
 * ulang jejak lama memakai kunci baru, skornya melenceng, dan mahasiswa jujur
 * divonis `tidak_sah`: "berkas diubah setelah diekspor dari game". Itu tuduhan
 * curang yang palsu, dan komentar verifikasi.ts sendiri berulang kali berjanji
 * hal itu tak boleh terjadi. Terukur: aksi yang sempurna menurut kunci lama
 * jatuh ke skorPemeriksaan 80 (kulit_morbili, mm_gagal_jantung_kongestif) dan
 * skorEdukasi 3 (mm_mialgia) pada kunci baru — cukup menggeser C ke D.
 *
 * Harga yang dibayar sadar: save mid-stase dari rilis lama menjadi ARSIP
 * (terbaca, tak bisa dilanjutkan). Itu pilihan yang benar — lebih baik
 * kehilangan satu save playtest daripada menuduh mahasiswa memalsukan berkas.
 */
export const ANSWER_KEY_SWEEP_CONTENT_RELEASE = 'answer-key-sweep-2026-08-06'
/**
 * Adjudikasi-delegasi 2026-08-21 (jejak audit: docs/ADJUDIKASI_DELEGASI_2026-08-21.md;
 * dr. Wirayuda mendelegasikan 8 keputusan bug hunt, dapat diveto kapan pun).
 * Lima di antaranya mengubah KUNCI JAWABAN konten:
 *   - 3 kasus "Dugaan" (zinc, riboflavin, laktosa) kini bertarget diagnosis
 *     'suspek', bukan tegak — skorDiagnosis pemain bergeser;
 *   - mm_hipertensi_urgensi kembali ke I13.9 + banding I13.9/I11.9/I12.9
 *     (pemulihan Fix M6 yang ter-revert diam-diam oleh refresh EBM);
 *   - alergiTrap faringitis/tonsilitis menerima union makrolida
 *     eritromisin+azitromisin;
 *   - pseudoefedrin pada rinitis_alergi turun kontraindikasi → nonPrimer
 *     (bendera merah & kunci grade D hilang);
 *   - banding gizi kurang balita R62.7 → R62.8.
 * Alasan mekanis wajib-naiknya rilis persis answer-key-sweep di atas: tanpa
 * rilis baru, save lama diteruskan dgn kunci baru dan replay verifikasi
 * memvonis mahasiswa jujur `tidak_sah`. Save mid-stase lama menjadi ARSIP.
 */
export const DELEGATED_ADJUDICATION_CONTENT_RELEASE = 'adjudikasi-delegasi-2026-08-21'

/**
 * Sapuan koding & UKM 2026-08-22 — rilis ini TERTINGGAL dan baru dinaikkan
 * setelah triase menemukannya. TUJUH commit sesudah `adjudikasi-delegasi-
 * 2026-08-21` sudah menggeser kunci jawaban/replay tanpa rilis ikut naik:
 *   - 6a00ab4 / f6236e3 / 1a11375 / 93a0e90 — sapuan label: 49 distraktor
 *     berhenti meminjam identitas kasus lain, format-tell dipadamkan, kamus
 *     ICD-10 dinaikkan di atas SKDI-144. Isi DECK yang dilihat pemain berubah.
 *   - ad442b8 — 9 kode ICD-10 diluruskan ke WHO (B37.9→B37.0, J34.89→J34.8,
 *     J45.901→J45.9, O92.03→O92.0, O92.13→O92.1, E50-E56→E53.0, E58-E61→E60,
 *     S00-S09→S01.0, B37.89→B37.8) DAN `cuci_seprai_panas` dicabut dari
 *     edukasi wajib rinitis_alergi (3→2 topik) — dua-duanya kunci jawaban.
 *   - be09694 — audit UKM: efekTrust dua pilihan kunjungan 0 → -1.
 *   - 271ae56 — `scoring.ts` suku IKS desa jadi kenaikan-atas-baseline
 *     ternormalisasi (REVISI_ENGINE 71). Rumus skor UKM berubah.
 *
 * KENAPA INI GAWAT, dan kenapa dinaikkan SEBELUM installer dibagikan:
 * `rilisArsipKompatibel` (renderer/src/store.ts) HANYA membandingkan
 * `contentRelease` — ia TIDAK melihat REVISI_ENGINE. Jadi selama id rilis tak
 * bergerak, save mid-stase dari build lama LOLOS gerbang dan diteruskan dengan
 * kunci jawaban baru; dossier yang diekspor kemudian membawa sidik jari BARU
 * sehingga lolos pula gerbang §3a verifikasi, lalu replay jurnal lama dengan
 * kunci baru menyimpang dari skor tercatat → vonis `tidak_sah` = "berkas
 * diubah setelah diekspor". Mahasiswa jujur dituduh memalsukan. Ini persis
 * rantai kegagalan beta.17 yang sudah pernah dibayar mahal (lihat komentar
 * ANSWER_KEY_SWEEP di atas) — dan ia terakit ulang lengkap hari ini.
 * Dinaikkan saat trial BELUM jalan: ongkosnya kini hanya save playtest
 * internal yang menjadi ARSIP; ongkos yang sama besok adalah vonis palsu
 * terhadap satu angkatan mahasiswa.
 */
export const CODING_UKM_SWEEP_CONTENT_RELEASE = 'sapuan-koding-ukm-2026-08-22'

/**
 * Sapuan ulasan bulk 2026-08-23 — dua batch kunci jawaban menumpuk di atas
 * rilis di atas tanpa rilis ikut naik (pelajaran yang sama persis dengan
 * komentar CODING_UKM_SWEEP di atas, kini terulang dlm skala lebih kecil):
 *   - 7f84fb0 — meloksikam masuk obatAlternatif mm_mialgia (perintah dokter).
 *   - Delegasi bulk 74 kasus lab "rutin" (dokter mengotorisasi via
 *     AskUserQuestion; 47 kasus taruhan-tinggi TIDAK disentuh, lihat
 *     CLAUDE_REVIEWED_LAB_CASE_IDS di lab/index.ts): ~17 koreksi kode ICD-10 &
 *     diagnosisBanding lintas batch1/2/3 (termasuk REVISI atas kunci
 *     wave-14 2026-07-19: servisitis N89→N72), satu tag `bahaya` dinaikkan
 *     (oat_kdt: nonPrimer→kontraindikasi, teksnya sendiri menyebut toksik),
 *     satu `konfirmasiWajib` dicabut dari templat bersama 4 kasus tinea
 *     (kontradiksi dgn catatanRealita-nya sendiri), satu obatAlternatif
 *     ditambah (cutaneous larva migrans: albendazol sejajar ivermektin).
 * Semuanya kunci jawaban/replay — save mid-stase lama wajib jadi ARSIP.
 */
export const BULK_REVIEW_CONTENT_RELEASE = 'sapuan-ulasan-bulk-2026-08-23'
export const CONTENT_RELEASE = BULK_REVIEW_CONTENT_RELEASE

/** Urutan eksplisit diperlukan karena id rilis tidak boleh dibandingkan leksikal. */
export const CONTENT_RELEASE_ORDER = [
  LEGACY_CONTENT_RELEASE,
  'm13-0c-2026-07-14',
  'm13-1a-pilot-2026-07-15',
  'm13-lab-fullfledge-2026-07-16',
  LAB_CONTENT_RELEASE,
  UKM_ASSURANCE_CONTENT_RELEASE,
  EDITORIAL_UX_CONTENT_RELEASE,
  BRIDGE_CLOSURE_CONTENT_RELEASE,
  DIALOGUE_COHERENCE_CONTENT_RELEASE,
  CLASS_READINESS_CONTENT_RELEASE,
  IGD_ADJUDICATION_CONTENT_RELEASE,
  P1_OBSERVATION_CONTENT_RELEASE,
  CLINICAL_PROVENANCE_CONTENT_RELEASE,
  GAMEPLAY_COMFORT_CONTENT_RELEASE,
  ANSWER_KEY_SWEEP_CONTENT_RELEASE,
  DELEGATED_ADJUDICATION_CONTENT_RELEASE,
  CODING_UKM_SWEEP_CONTENT_RELEASE,
  BULK_REVIEW_CONTENT_RELEASE,
] as const

export interface RuntimeCurriculumManifest {
  schemaVersion: 1
  contentRelease: string
  releaseOrder: string[]
  encounterArchetypes: EncounterArchetype[]
  ukmScenarios: UkmScenario[]
}

/** Katalog konten mentah yang dipakai untuk menyusun blueprint authoring. */
export interface ContentCatalog {
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

/** PACK runtime: katalog ditambah proyeksi keputusan kurikulum yang kecil. */
export interface ContentPack extends ContentCatalog {
  /** Opsional hanya untuk fixture engine terisolasi; PACK produksi wajib punya. */
  runtimeManifest?: RuntimeCurriculumManifest
}

export interface RuntimeContentPack extends ContentPack {
  runtimeManifest: RuntimeCurriculumManifest
}

/** Kasus lab yang boleh dimainkan, tetapi belum boleh mengubah progres formal. */
export function kasusFormatif(
  kasus: Pick<KasusKlinis, 'activationStatus' | 'reviewStatus'> | undefined,
): boolean {
  return (
    kasus?.activationStatus === 'lab_prototype_unadjudicated' &&
    kasus.reviewStatus !== 'physician_approved'
  )
}

function indeksRilis(releaseOrder: readonly string[], releaseId: string): number {
  return releaseOrder.indexOf(releaseId)
}

/** Fail-closed bila policy merujuk id rilis yang tidak dikenal build ini. */
export function releasePolicyAktif(
  policy: ReleasePolicy,
  currentRelease: string,
  releaseOrder: readonly string[],
): boolean {
  const current = indeksRilis(releaseOrder, currentRelease)
  const introduced = indeksRilis(releaseOrder, policy.introducedIn)
  if (current < 0 || introduced < 0 || introduced > current) return false
  if (!policy.retiredAfter) return true
  const retiredAfter = indeksRilis(releaseOrder, policy.retiredAfter)
  return retiredAfter >= 0 && current <= retiredAfter
}

function modePolicyAktif(policy: ModePolicy, mode: 'karier' | 'ujian'): boolean {
  return policy[mode]
}

export function encounterArchetypeAktif(
  pack: ContentPack,
  kind: 'clinic' | 'igd',
  contentId: string,
  mode: 'karier' | 'ujian',
  contentRelease: string,
): boolean {
  const manifest = pack.runtimeManifest
  if (!manifest) return true
  const archetype = manifest.encounterArchetypes.find(
    (item) => item.contentRef.kind === kind && item.contentRef.id === contentId,
  )
  return Boolean(
    archetype &&
      archetype.channel === kind &&
      modePolicyAktif(archetype.modePolicy, mode) &&
      releasePolicyAktif(archetype.releasePolicy, contentRelease, manifest.releaseOrder),
  )
}

export function ukmScenarioAktif(
  pack: ContentPack,
  familyId: string,
  visitId: string,
  mode: 'karier' | 'ujian',
  contentRelease: string,
): boolean {
  const manifest = pack.runtimeManifest
  if (!manifest) return true
  const scenario = manifest.ukmScenarios.find(
    (item) => item.contentRef.familyId === familyId && item.contentRef.visitId === visitId,
  )
  return Boolean(
    scenario &&
      modePolicyAktif(scenario.modePolicy, mode) &&
      releasePolicyAktif(scenario.releasePolicy, contentRelease, manifest.releaseOrder),
  )
}

/** Guard kecil: validasi silang id konten saat boot (fail-fast, anti-drift). */
export function validasiPack(pack: ContentPack): string[] {
  const masalah: string[] = []
  const manifest = pack.runtimeManifest
  if (!manifest) {
    masalah.push('Runtime manifest tidak tersedia')
    return masalah
  }
  const urutanRilis = manifest.releaseOrder
  if (new Set(urutanRilis).size !== urutanRilis.length) {
    masalah.push('Runtime manifest: releaseOrder memuat id duplikat')
  }
  if (!urutanRilis.includes(manifest.contentRelease)) {
    masalah.push(`Runtime manifest: contentRelease '${manifest.contentRelease}' tidak ada di releaseOrder`)
  }

  const archetypeRefs = new Set<string>()
  for (const archetype of manifest.encounterArchetypes) {
    const ref = `${archetype.contentRef.kind}:${archetype.contentRef.id}`
    if (archetypeRefs.has(ref)) masalah.push(`Runtime manifest: contentRef archetype duplikat '${ref}'`)
    archetypeRefs.add(ref)
    if (archetype.channel !== archetype.contentRef.kind) {
      masalah.push(`Runtime manifest ${archetype.id}: channel tidak cocok dengan contentRef`)
    }
    if (archetype.contentRef.kind === 'clinic') {
      const kasus = pack.kasus[archetype.contentRef.id]
      if (!kasus) {
        masalah.push(`Runtime manifest ${archetype.id}: kasus klinik tidak ada`)
      } else {
        const prevalensi = kasus.prevalensi ?? 'sedang'
        const target = kasus.harusDirujuk
          ? kasus.stabilisasiWajib
            ? 'stabilize_then_refer'
            : 'refer'
          : 'manage_at_fktp'
        if (archetype.prevalensi !== prevalensi) {
          masalah.push(`Runtime manifest ${archetype.id}: prevalensi drift dari kasus klinik`)
        }
        if (archetype.targetFktp !== target) {
          masalah.push(`Runtime manifest ${archetype.id}: targetFktp drift dari kasus klinik`)
        }
      }
    }
    if (archetype.contentRef.kind === 'igd') {
      const kasus = pack.kasusIgd[archetype.contentRef.id]
      if (!kasus) {
        masalah.push(`Runtime manifest ${archetype.id}: kasus IGD tidak ada`)
      } else {
        const target = kasus.disposisiBenar === 'rujuk'
          ? 'stabilize_then_refer'
          : 'stabilize_then_discharge'
        if (archetype.prevalensi !== 'not_modeled') {
          masalah.push(`Runtime manifest ${archetype.id}: prevalensi IGD wajib not_modeled`)
        }
        if (archetype.targetFktp !== target) {
          masalah.push(`Runtime manifest ${archetype.id}: targetFktp drift dari kasus IGD`)
        }
      }
    }
    if (!urutanRilis.includes(archetype.releasePolicy.introducedIn)) {
      masalah.push(`Runtime manifest ${archetype.id}: introducedIn tidak dikenal`)
    }
    if (archetype.releasePolicy.retiredAfter && !urutanRilis.includes(archetype.releasePolicy.retiredAfter)) {
      masalah.push(`Runtime manifest ${archetype.id}: retiredAfter tidak dikenal`)
    }
  }
  for (const id of Object.keys(pack.kasus)) {
    if (!archetypeRefs.has(`clinic:${id}`)) masalah.push(`Runtime manifest: kasus klinik '${id}' tanpa archetype`)
  }
  for (const id of Object.keys(pack.kasusIgd)) {
    if (!archetypeRefs.has(`igd:${id}`)) masalah.push(`Runtime manifest: kasus IGD '${id}' tanpa archetype`)
  }

  const scenarioRefs = new Set<string>()
  for (const scenario of manifest.ukmScenarios) {
    const ref = `${scenario.contentRef.familyId}:${scenario.contentRef.visitId}`
    if (scenarioRefs.has(ref)) masalah.push(`Runtime manifest: contentRef UKM duplikat '${ref}'`)
    scenarioRefs.add(ref)
    const family = pack.keluarga[scenario.contentRef.familyId]
    if (!family?.arc.kunjungan.some((visit) => visit.id === scenario.contentRef.visitId)) {
      masalah.push(`Runtime manifest ${scenario.id}: skenario UKM tidak ada`)
    }
    if (!urutanRilis.includes(scenario.releasePolicy.introducedIn)) {
      masalah.push(`Runtime manifest ${scenario.id}: introducedIn tidak dikenal`)
    }
    if (scenario.releasePolicy.retiredAfter && !urutanRilis.includes(scenario.releasePolicy.retiredAfter)) {
      masalah.push(`Runtime manifest ${scenario.id}: retiredAfter tidak dikenal`)
    }
  }
  for (const family of Object.values(pack.keluarga)) {
    for (const visit of family.arc.kunjungan) {
      const ref = `${family.id}:${visit.id}`
      if (!scenarioRefs.has(ref)) masalah.push(`Runtime manifest: skenario UKM '${ref}' tanpa policy`)
    }
  }

  for (const k of Object.values(pack.kasus)) {
    if (!k.sumber?.length) {
      masalah.push(`Kasus ${k.id}: provenance klinis belum tersedia`)
    } else {
      const sumberIds = new Set<string>()
      if (k.sumber.length < 2 || k.sumber.length > 10) {
        masalah.push(`Kasus ${k.id}: jumlah sumber ${k.sumber.length}, wajib 2-10`)
      }
      if (!k.sumber.some((s) => s.jenis === 'pedoman_indonesia')) {
        masalah.push(`Kasus ${k.id}: sumber terstruktur tanpa pedoman Indonesia`)
      }
      if (!k.sumber.some((s) => s.jenis === 'evidence_internasional')) {
        masalah.push(`Kasus ${k.id}: sumber terstruktur tanpa evidence internasional`)
      }
      for (const sumber of k.sumber) {
        if (sumberIds.has(sumber.id)) masalah.push(`Kasus ${k.id}: sumber '${sumber.id}' duplikat`)
        sumberIds.add(sumber.id)
        if (!/^https:\/\//.test(sumber.url)) {
          masalah.push(`Kasus ${k.id}: sumber '${sumber.id}' bukan URL HTTPS`)
        }
        if (!Number.isInteger(sumber.tahun) || sumber.tahun < 1900 || sumber.tahun > 2100) {
          masalah.push(`Kasus ${k.id}: tahun sumber '${sumber.id}' tidak valid`)
        }
        if (!sumber.cakupan) {
          masalah.push(`Kasus ${k.id}: sumber '${sumber.id}' tanpa status cakupan`)
        }
        if (sumber.cakupan === 'floor_umum' && !sumber.catatan?.trim()) {
          masalah.push(`Kasus ${k.id}: floor umum '${sumber.id}' tanpa catatan batas interpretasi`)
        }
      }
    }
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
    // Tier-1 #7 (audit CODEX 2026-07-11): interaksiTrap — pagar dasar sama spt
    // alergiTrap (obat wajib ada di formularium). Tanpa gerbang golonganAlergi
    // (mekanisme beda: firewall id-langsung, bukan kelas-alergi) jadi 2
    // invariant golongan alergiTrap tak berlaku di sini.
    if (k.interaksiTrap) {
      for (const o of [...k.interaksiTrap.obatTerlarang, ...k.interaksiTrap.alternatifBenar]) {
        if (!pack.obat[o]) masalah.push(`Kasus ${k.id}: interaksiTrap obat '${o}' tidak ada di formularium`)
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
    for (const p of k.tatalaksana.prosedurOpsional ?? []) {
      if (!pack.tindakan[p]) masalah.push(`Kasus ${k.id}: tindakan opsional '${p}' tidak ada di katalog`)
      if (k.tatalaksana.prosedur?.includes(p)) {
        masalah.push(`Kasus ${k.id}: tindakan '${p}' sekaligus wajib dan opsional`)
      }
      if ((k.tatalaksana.tindakanSalahUmum ?? []).some((item) => item.id === p)) {
        masalah.push(`Kasus ${k.id}: tindakan '${p}' sekaligus opsional dan salah`)
      }
    }
    // Audit CODEX 2026-07-16 #2: terapiKritis WAJIB benar-benar bisa dipilih
    // pemain DAN mandatory — id harus ada di obatBenar/obatAlternatif(flat)
    // (obat wajib) ATAU prosedur (tindakan wajib). BUKAN obatOpsional: terapi
    // penyelamat nyawa tak boleh "boleh-tidak-boleh". Kalau tak selektabel,
    // gerbang jadi MUSTAHIL (auto cap-D permanen).
    for (const tk of k.tatalaksana.terapiKritis ?? []) {
      const adaObat = k.tatalaksana.obatBenar.includes(tk)
        || (k.tatalaksana.obatAlternatif ?? []).flat().includes(tk)
      const adaProsedur = (k.tatalaksana.prosedur ?? []).includes(tk)
      if (!adaObat && !adaProsedur) {
        masalah.push(`Kasus ${k.id}: terapiKritis '${tk}' tidak ada di obatBenar/obatAlternatif maupun prosedur (mustahil dipilih atau tak wajib)`)
      }
      if (adaObat && !pack.obat[tk]) masalah.push(`Kasus ${k.id}: terapiKritis obat '${tk}' tidak ada di formularium`)
      if (adaProsedur && !pack.tindakan[tk]) masalah.push(`Kasus ${k.id}: terapiKritis tindakan '${tk}' tidak ada di katalog`)
      // Gerbang `terapiKritisTerlewat` (clinic.ts) mencocokkan id MENTAH ke
      // enc.resep/enc.tindakan — ia tidak pernah membaca pergeseran standar
      // emas saat trap menyala, padahal pasien kasus ber-trap SELALU membawa
      // alergi/faktor risikonya (director.ts). Terapi kritis yang bertabrakan
      // dgn trap membuat gerbang mustahil dipenuhi tanpa hukuman untuk SETIAP
      // pemain: obat sekelas alergi diblokir firewall sebelum masuk resep (cap
      // D dijamin walau alternatif yang benar diresepkan), sedangkan obat
      // terlarang interaksi baru memuaskan gerbang dgn harga kontraindikasi
      // absolut (cap D juga). Selektabilitas di atas tak menangkapnya: obat
      // terlarang trap justru WAJIB terdaftar di obatBenar/alternatif.
      const obatKritis = pack.obat[tk]
      if (
        k.alergiTrap &&
        (k.alergiTrap.obatTerlarang.includes(tk) ||
          (obatKritis?.golonganAlergi ?? '').toLowerCase() === k.alergiTrap.kelas.toLowerCase())
      ) {
        masalah.push(`Kasus ${k.id}: terapiKritis '${tk}' terlarang oleh alergiTrap '${k.alergiTrap.kelas}' — firewall memblokirnya, gerbang terapi kritis mustahil dipenuhi`)
      }
      if (k.interaksiTrap?.obatTerlarang.includes(tk)) {
        masalah.push(`Kasus ${k.id}: terapiKritis '${tk}' juga terlarang oleh interaksiTrap '${k.interaksiTrap.faktor}' — wajib sekaligus kontraindikasi absolut`)
      }
    }
    for (const item of k.tatalaksana.tindakanSalahUmum ?? []) {
      if (!pack.tindakan[item.id]) masalah.push(`Kasus ${k.id}: tindakan salah '${item.id}' tidak ada di katalog`)
      if (k.tatalaksana.prosedur?.includes(item.id)) {
        masalah.push(`Kasus ${k.id}: tindakan '${item.id}' sekaligus benar dan salah`)
      }
    }
    for (const id of k.stabilisasiWajib ?? []) {
      if (!k.tatalaksana.prosedur?.includes(id)) {
        masalah.push(`Kasus ${k.id}: stabilisasiWajib '${id}' bukan prosedur benar`)
      }
    }
    const bulanMin = k.demografi.usiaBulanMin
    const bulanMax = k.demografi.usiaBulanMax
    if ((bulanMin === undefined) !== (bulanMax === undefined)) {
      masalah.push(`Kasus ${k.id}: rentang usia bulan harus lengkap`)
    } else if (bulanMin !== undefined && bulanMax !== undefined) {
      if (bulanMin < 0 || bulanMax > 11 || bulanMin > bulanMax) {
        masalah.push(`Kasus ${k.id}: rentang usia bulan tidak valid`)
      }
      if (k.demografi.usiaMin !== 0 || k.demografi.usiaMax !== 0) {
        masalah.push(`Kasus ${k.id}: usia bulan hanya sah untuk pasien <1 tahun`)
      }
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
    // M11 #4 Tingkat A (2026-07-16): varian presentasi kosmetik HANYA boleh
    // mengganti id pertanyaan / region yang SUDAH ADA di kasus dasar — id/
    // region baru berarti perluasan lingkup kasus (butuh kasus baru, bukan
    // varian), dan `kasusEfektif()` (clinic.ts) diam-diam mengabaikan entri
    // yang tak cocok, jadi typo di sini gagal SENYAP tanpa pagar ini.
    if (k.varianPresentasi?.length) {
      const idAnamnesisAda = new Set(k.anamnesis.map((q) => q.id))
      const regionAda = new Set(k.pemeriksaanFisik.map((f) => f.region))
      // Bug hunt 2026-08-01: kasusEfektif() (clinic.ts) menimpa TEMUAN via
      // `pemeriksaanFisik.map(f => temuanBerubah[f.region] ? ... : f)` — bila
      // SATU kasus punya >1 entri pemeriksaanFisik dgn region yang SAMA (pola
      // umum & sah, mis. dua temuan 'kulit' berbeda), varian yang menimpa
      // region itu diam-diam menimpa SEMUA entri region itu sekaligus, bukan
      // cuma satu yang dimaksud penulis. Set existence-check di atas tak
      // menangkap ini (cuma cek region ADA, bukan UNIK) — hitung kemunculannya.
      const regionHitungan = new Map<string, number>()
      for (const f of k.pemeriksaanFisik) {
        regionHitungan.set(f.region, (regionHitungan.get(f.region) ?? 0) + 1)
      }
      // Pertanyaan pengungkap trap: satu-satunya kanal in-game yang memberi
      // tahu pemain bahwa pasien membawa alergi kelas jebakan (pasien kasus
      // ber-alergiTrap SELALU membawanya, director.ts). Varian presentasi
      // adalah lapisan KOSMETIK — menimpa jawaban pertanyaan itu memindahkan
      // kunci jawaban: jawaban pengganti bisa MENYANGKAL alergi yang tetap
      // dibawa pasien, lalu pemain yang bernalar benar dari apa yang ia dengar
      // dihukum firewall + pergeseran standar emas (clinic.ts).
      const idPengungkapTrap = new Set(
        k.alergiTrap
          ? k.anamnesis.filter((q) => q.tanya.toLowerCase().includes('alergi')).map((q) => q.id)
          : [],
      )
      const idVarianTerpakai = new Set<string>()
      for (const v of k.varianPresentasi) {
        if (v.id === '_dasar') {
          masalah.push(`Kasus ${k.id}: varianPresentasi id '_dasar' terpakai — id itu milik presentasi dasar implisit`)
        }
        if (idVarianTerpakai.has(v.id)) {
          masalah.push(`Kasus ${k.id}: varianPresentasi id '${v.id}' duplikat`)
        }
        idVarianTerpakai.add(v.id)
        for (const idQ of Object.keys(v.jawabanBerubah ?? {})) {
          if (!idAnamnesisAda.has(idQ)) {
            masalah.push(`Kasus ${k.id}: varian '${v.id}' jawabanBerubah mengacu id pertanyaan '${idQ}' yang tak ada di anamnesis dasar`)
          } else if (idPengungkapTrap.has(idQ)) {
            masalah.push(`Kasus ${k.id}: varian '${v.id}' menimpa jawaban pertanyaan alergi '${idQ}' — riwayat alergi kasus ber-alergiTrap adalah kunci jawaban, bukan presentasi kosmetik`)
          }
        }
        for (const region of Object.keys(v.temuanBerubah ?? {})) {
          if (!regionAda.has(region as (typeof k.pemeriksaanFisik)[number]['region'])) {
            masalah.push(`Kasus ${k.id}: varian '${v.id}' temuanBerubah mengacu region '${region}' yang tak ada di pemeriksaanFisik dasar`)
          } else if ((regionHitungan.get(region) ?? 0) > 1) {
            masalah.push(`Kasus ${k.id}: varian '${v.id}' temuanBerubah mengacu region '${region}' yang MUNCUL >1 kali di pemeriksaanFisik dasar — kasusEfektif() akan menimpa SEMUA entri region itu sekaligus, bukan cuma satu`)
          }
        }
        if (!v.vital && !v.keluhanUtama && !v.jawabanBerubah && !v.temuanBerubah) {
          masalah.push(`Kasus ${k.id}: varian '${v.id}' tak mengubah apa pun — identik dgn presentasi dasar, hapus atau isi bedanya`)
        }
      }
    }
  }
  // IGD (M3.14) — sama seperti kasus klinik: langkah harus punya pilihan benar,
  // dan disposisi rujuk harus punya spesialisasi + RS yang menyediakannya.
  const sumberIgdKanonik = new Map<string, {
    label: string
    url: string
    tahun: number
    jenis: 'pedoman_indonesia' | 'evidence_internasional'
  }>()
  for (const k of Object.values(pack.kasusIgd)) {
    if (k.panduanResmi.trim().length === 0) masalah.push(`IGD ${k.id}: panduanResmi kosong`)
    if (!k.sumber.some((s) => s.jenis === 'pedoman_indonesia')) {
      masalah.push(`IGD ${k.id}: tidak punya sumber pedoman Indonesia`)
    }
    if (!k.sumber.some((s) => s.jenis === 'evidence_internasional')) {
      masalah.push(`IGD ${k.id}: tidak punya sumber evidence internasional`)
    }
    const sumberIds = new Set<string>()
    for (const sumber of k.sumber) {
      if (sumberIds.has(sumber.id)) masalah.push(`IGD ${k.id}: sumber '${sumber.id}' duplikat`)
      sumberIds.add(sumber.id)
      if (!/^https:\/\//.test(sumber.url)) masalah.push(`IGD ${k.id}: sumber '${sumber.id}' bukan URL HTTPS`)
      if (!Number.isInteger(sumber.tahun) || sumber.tahun < 1900 || sumber.tahun > 2100) {
        masalah.push(`IGD ${k.id}: tahun sumber '${sumber.id}' tidak valid`)
      }
      const sebelumnya = sumberIgdKanonik.get(sumber.id)
      if (
        sebelumnya &&
        (sebelumnya.label !== sumber.label ||
          sebelumnya.url !== sumber.url ||
          sebelumnya.tahun !== sumber.tahun ||
          sebelumnya.jenis !== sumber.jenis)
      ) {
        masalah.push(`IGD ${k.id}: metadata sumber '${sumber.id}' drift dari kasus lain`)
      } else if (!sebelumnya) {
        sumberIgdKanonik.set(sumber.id, sumber)
      }
    }
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
      const kapabilitas = k.kapabilitasRujukanSalahSatu ?? []
      if (
        kapabilitas.length > 0 &&
        !pack.rumahSakit.some(
          (rs) =>
            (!k.spesialisRujukan || rs.spesialisasi.includes(k.spesialisRujukan)) &&
            kapabilitas.some((item) => rs.kapabilitas?.includes(item)),
        )
      ) {
        masalah.push(`IGD ${k.id}: tidak ada RS dengan kapabilitas rujukan yang disyaratkan`)
      }
    }
  }
  for (const kel of Object.values(pack.keluarga)) {
    kel.arc.kunjungan.forEach((sk, idx) => {
      if (sk.pilihanIngatkan) {
        const pilihan = sk.pilihanIngatkan.pilihan
        const ids = pilihan.map((p) => p.id)
        if (pilihan.length !== 3) {
          masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': Ingatkan wajib tepat 3 pilihan`)
        }
        if (new Set(ids).size !== ids.length) {
          masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': id pilihan Ingatkan duplikat`)
        }
        const benar = pilihan.filter((p) => p.tepat)
        if (benar.length !== 1) {
          masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': Ingatkan wajib tepat 1 jawaban benar`)
        } else if (!benar[0]!.teks.includes('{jadwal}')) {
          masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': jawaban Ingatkan benar wajib memuat {jadwal}`)
        }
      }
      if (sk.penerimaanAwal) {
        const penerimaan = sk.penerimaanAwal
        const ids = penerimaan.pilihan.map((p) => p.id)
        if (penerimaan.mode !== 'karier') {
          masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': penerimaan awal wajib Career-only`)
        }
        if (!Number.isInteger(penerimaan.ulangDalamHari) || penerimaan.ulangDalamHari < 1 || penerimaan.ulangDalamHari > 7) {
          masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': ulangDalamHari penerimaan wajib integer 1-7`)
        }
        if (penerimaan.rasional.trim().length === 0) {
          masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': penerimaan awal tanpa rasional`)
        }
        if (penerimaan.pilihan.length !== 2 || new Set(ids).size !== ids.length) {
          masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': penerimaan awal wajib 2 pilihan ber-id unik`)
        }
        const hormati = penerimaan.pilihan.filter((p) => p.tindakan === 'hormati')
        const memaksa = penerimaan.pilihan.filter((p) => p.tindakan === 'memaksa')
        if (hormati.length !== 1 || memaksa.length !== 1) {
          masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': penerimaan awal wajib 1 hormati + 1 memaksa`)
        } else if (!hormati[0]!.teks.includes('{jadwal}')) {
          masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': pilihan hormati wajib memuat {jadwal}`)
        }
      }
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
      // M11 #5 B1 (2026-07-17): pagar varianKunjungan — persis pola pagar
      // varianPresentasi UKP (§ loop kasus di atas). Tanpa ini, id
      // hotspot/dialog/pilihan yang typo diam-diam diabaikan skenarioEfektif
      // (kunjungan.ts), jadi bagian varian itu tak pernah berubah tanpa
      // peringatan.
      if (sk.varianKunjungan?.length) {
        const idHotspotAda = new Set(sk.hotspot.map((h) => h.id))
        const idDialogAda = new Set(sk.dialog.map((d) => d.id))
        const idPilihanAda = new Set(sk.dialog.flatMap((d) => d.pilihan.map((p) => p.id)))
        const idVarianTerpakai = new Set<string>()
        for (const v of sk.varianKunjungan) {
          if (v.id === '_dasar') {
            masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': varianKunjungan id '_dasar' terpakai — id itu milik presentasi dasar implisit`)
          }
          if (idVarianTerpakai.has(v.id)) {
            masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': varianKunjungan id '${v.id}' duplikat`)
          }
          idVarianTerpakai.add(v.id)
          for (const idH of Object.keys(v.hotspotBerubah ?? {})) {
            if (!idHotspotAda.has(idH)) {
              masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': varian '${v.id}' hotspotBerubah mengacu id '${idH}' yang tak ada`)
            }
          }
          for (const idD of Object.keys(v.dialogNarasiBerubah ?? {})) {
            if (!idDialogAda.has(idD)) {
              masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': varian '${v.id}' dialogNarasiBerubah mengacu id node '${idD}' yang tak ada`)
            }
          }
          for (const idP of Object.keys(v.pilihanBerubah ?? {})) {
            if (!idPilihanAda.has(idP)) {
              masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': varian '${v.id}' pilihanBerubah mengacu id pilihan '${idP}' yang tak ada`)
            }
          }
          if (!v.pembuka && !v.hotspotBerubah && !v.dialogNarasiBerubah && !v.pilihanBerubah && !v.penutupBerhasil && !v.penutupGagal) {
            masalah.push(`Keluarga ${kel.id} kunjungan '${sk.id}': varian '${v.id}' tak mengubah apa pun — identik dgn presentasi dasar, hapus atau isi bedanya`)
          }
        }
      }
    })
  }
  return masalah
}
