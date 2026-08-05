import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CURRICULUM_BLUEPRINT, PACK } from '../../index'
import {
  CONTENT_RELEASE,
  CONTENT_RELEASE_ORDER,
  BRIDGE_CLOSURE_CONTENT_RELEASE,
  CLASS_READINESS_CONTENT_RELEASE,
  DIALOGUE_COHERENCE_CONTENT_RELEASE,
  LAB_CONTENT_RELEASE,
  LEGACY_CONTENT_RELEASE,
  UKM_ASSURANCE_CONTENT_RELEASE,
  EDITORIAL_UX_CONTENT_RELEASE,
  IGD_ADJUDICATION_CONTENT_RELEASE,
  P1_OBSERVATION_CONTENT_RELEASE,
  CLINICAL_PROVENANCE_CONTENT_RELEASE,
  GAMEPLAY_COMFORT_CONTENT_RELEASE,
  ANSWER_KEY_SWEEP_CONTENT_RELEASE,
  encounterArchetypeAktif,
  releasePolicyAktif,
  ukmScenarioAktif,
} from '../../pack'
import { VARIAN_TINGKAT_A } from '../../varianTingkatAData'
import {
  M13_1A_AUTHORING_MANIFEST,
  M13_1A_BASE_CONTENT_RELEASE,
  M13_1A_PHYSICIAN_DECISION_BY_REVIEW_ID,
  M13_1A_PROPOSED_CONTENT_RELEASE,
  M13_1A_REVIEW_ID_BY_AUDITED_EVIDENCE_ID,
  M13_1A_REVIEW_PAYLOADS,
  M13_1A_REVIEW_SOURCE_IDS,
  evaluasiKesiapanAktivasiM13,
  validasiM13AuthoringManifest,
} from '.'

function caseById(id: string) {
  return M13_1A_AUTHORING_MANIFEST.clinicCases.find((kasus) => kasus.id === id)!
}

/** PACK memuat kasus + lapisan varian Tingkat-A (M11 #4, varianTingkatA.ts)
 * bila terdaftar di VARIAN_TINGKAT_A — manifest authoring sendiri tak
 * membawa lapisan itu, jadi dibandingkan dengan bentuk tervarian. */
function denganVarian<T extends { id: string }>(kasus: T): T {
  return VARIAN_TINGKAT_A[kasus.id] ? { ...kasus, varianPresentasi: VARIAN_TINGKAT_A[kasus.id] } : kasus
}

function tanpaSumber<T extends { sumber?: unknown }>(kasus: T): Omit<T, 'sumber'> {
  const { sumber: _sumber, ...isi } = kasus
  return isi
}

function actualReviewHashes(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(M13_1A_REVIEW_PAYLOADS).map(([id, payload]) => [
      id,
      createHash('sha256').update(JSON.stringify(payload)).digest('hex'),
    ]),
  )
}

describe('M13-1a - slice Career aktif dan menunggu playtest manusia', () => {
  it('menutup tepat 6 poli + 1 IGD + 1 UKM dan lolos validator pasca-review', () => {
    expect(validasiM13AuthoringManifest(M13_1A_AUTHORING_MANIFEST, PACK)).toEqual([])
    expect(M13_1A_AUTHORING_MANIFEST.activationStatus).toBe('activated_pending_playtest')
    expect(M13_1A_AUTHORING_MANIFEST.clinicCases).toHaveLength(6)
    expect(M13_1A_AUTHORING_MANIFEST.igdCases).toHaveLength(1)
    expect(M13_1A_AUTHORING_MANIFEST.ukmDrafts).toHaveLength(1)
    expect(M13_1A_AUTHORING_MANIFEST.physicianDecisionsRequired).toEqual(
      Object.values(M13_1A_PHYSICIAN_DECISION_BY_REVIEW_ID),
    )
    expect(M13_1A_AUTHORING_MANIFEST.physicianDecisionsRequired).toHaveLength(8)
    expect(M13_1A_AUTHORING_MANIFEST.clinicSpecs.filter((item) => item.role === 'karma-counterpart')).toHaveLength(2)
    expect(M13_1A_AUTHORING_MANIFEST.clinicSpecs.filter((item) => item.role === 'representative')).toHaveLength(4)
    expect(new Set(M13_1A_AUTHORING_MANIFEST.clinicSpecs.filter((item) => item.role === 'representative').map((item) => item.authoringTier))).toEqual(new Set(['A', 'B', 'C']))
    for (const draft of M13_1A_AUTHORING_MANIFEST.clinicCases) {
      expect(tanpaSumber(PACK.kasus[draft.id]!), draft.id).toEqual(
        tanpaSumber(denganVarian(draft)),
      )
    }
    expect(
      M13_1A_AUTHORING_MANIFEST.clinicSpecs
        .filter((item) => item.role === 'representative')
        .some((item) => caseById(item.caseId).harusDirujuk),
    ).toBe(true)
    for (const kasus of M13_1A_AUTHORING_MANIFEST.clinicCases) {
      expect(kasus.anamnesis[0]?.kategori, kasus.id).toBe('keluhan_utama')
    }
    for (const kasus of M13_1A_AUTHORING_MANIFEST.clinicCases.filter((item) => item.demografi.usiaMax < 15)) {
      expect(kasus.keluhanUtamaOlehPendamping, kasus.id).toBe(true)
      expect(kasus.anamnesis.every((item) => Boolean(item.variasi?.wali_anak)), kasus.id).toBe(true)
    }
    const seluruhDialogWali = M13_1A_AUTHORING_MANIFEST.clinicCases
      .flatMap((kasus) => kasus.anamnesis.map((item) => item.variasi?.wali_anak ?? ''))
      .join(' ')
    expect(seluruhDialogWali).not.toMatch(/\b(?:Nayla|Dimas|Rafi)\b/i)
  })

  it('validator fail-closed bila katalog aktif drift dari manifest', () => {
    const rusak = structuredClone(M13_1A_AUTHORING_MANIFEST)
    rusak.proposedCatalog.tindakan.rehidrasi_plan_c_bayi!.nama = 'Nama yang drift'
    expect(validasiM13AuthoringManifest(rusak, PACK)).toContain(
      "katalog tindakan aktif 'rehidrasi_plan_c_bayi' drift dari manifest",
    )
  })

  it('validator fail-closed untuk key katalog drift dan contentRef ganda', () => {
    const katalogRusak = structuredClone(M13_1A_AUTHORING_MANIFEST)
    katalogRusak.proposedCatalog.tindakan.rehidrasi_plan_c_bayi!.id = 'rehidrasi_plan_c_drift'
    expect(validasiM13AuthoringManifest(katalogRusak, PACK)).toContain(
      "katalog tindakan draft key 'rehidrasi_plan_c_bayi' tidak sama dengan item.id 'rehidrasi_plan_c_drift'",
    )

    const refRusak = structuredClone(M13_1A_AUTHORING_MANIFEST)
    refRusak.encounterArchetypes[1]!.contentRef = structuredClone(
      refRusak.encounterArchetypes[0]!.contentRef,
    )
    expect(validasiM13AuthoringManifest(refRusak, PACK)).toContain(
      "encounter contentRef duplikat 'clinic:diare_akut_bayi_dehidrasi_berat'",
    )
  })

  it('validator fail-closed bila clinical concept duplikat', () => {
    const rusak = structuredClone(M13_1A_AUTHORING_MANIFEST)
    const duplicateId = rusak.clinicalConcepts[0]!.id
    rusak.clinicalConcepts[1]!.id = duplicateId
    expect(validasiM13AuthoringManifest(rusak, PACK)).toContain(
      `clinical concept id duplikat '${duplicateId}'`,
    )
  })

  it('validator fail-closed bila konflik material kehilangan jejak floor, supersesi, atau resource', () => {
    const rusak = structuredClone(M13_1A_AUTHORING_MANIFEST)
    const conflict = rusak.evidenceBindings.find(
      (binding) => binding.audit?.finding === 'source_conflict' && binding.audit.materiality === 'material',
    )!
    delete conflict.governance
    expect(validasiM13AuthoringManifest(rusak, PACK)).toContain(
      `${conflict.id}: konflik material tidak punya governance floor/supersesi/resource`,
    )
  })

  it('validator fail-closed bila sign-off record atau konflik material hilang', () => {
    const tanpaRecordSignoff = structuredClone(M13_1A_AUTHORING_MANIFEST)
    const record = tanpaRecordSignoff.reviewRecords[0]!
    delete record.physicianSignoff
    expect(validasiM13AuthoringManifest(tanpaRecordSignoff, PACK)).toContain(
      `${record.id}: physician sign-off belum ada`,
    )

    const tanpaAuditSignoff = structuredClone(M13_1A_AUTHORING_MANIFEST)
    const binding = tanpaAuditSignoff.evidenceBindings.find(
      (item) => item.audit?.materiality === 'material',
    )!
    delete binding.audit!.physicianSignoff
    expect(validasiM13AuthoringManifest(tanpaAuditSignoff, PACK)).toContain(
      `${binding.id}: konflik material belum punya physician sign-off`,
    )
  })

  it('validator fail-closed bila keputusan physician dan status ledger tidak cocok', () => {
    const rusak = structuredClone(M13_1A_AUTHORING_MANIFEST)
    const record = rusak.reviewRecords[0]!
    record.status = 'approved_with_waiver'
    expect(validasiM13AuthoringManifest(rusak, PACK)).toContain(
      `${record.id}: decision approved tidak cocok status 'approved_with_waiver'`,
    )
  })

  it('aktif hanya di Career: PACK, release, karma, dan isolasi mode konsisten', () => {
    expect(CONTENT_RELEASE).toBe(ANSWER_KEY_SWEEP_CONTENT_RELEASE)
    expect(CONTENT_RELEASE_ORDER).toEqual([
      LEGACY_CONTENT_RELEASE,
      M13_1A_BASE_CONTENT_RELEASE,
      M13_1A_PROPOSED_CONTENT_RELEASE,
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
    ])
    for (const kasus of M13_1A_AUTHORING_MANIFEST.clinicCases) {
      expect(tanpaSumber(PACK.kasus[kasus.id]!), kasus.id).toEqual(
        tanpaSumber(denganVarian(kasus)),
      )
    }
    for (const kasus of M13_1A_AUTHORING_MANIFEST.igdCases) expect(PACK.kasusIgd[kasus.id], kasus.id).toEqual(kasus)
    expect(PACK.keluarga.keluarga_gunawan?.arc.kunjungan.some((item) => item.id === 'gunawan_k2')).toBe(true)

    const yani = PACK.keluarga.keluarga_yani?.arc.kunjungan.find((item) => item.id === 'yani_k1')
    const gunawan = PACK.keluarga.keluarga_gunawan?.arc.kunjungan.find((item) => item.id === 'gunawan_k1')
    expect(yani?.karma).toEqual(expect.objectContaining({ kasusId: 'diare_akut_bayi_dehidrasi_berat', anggotaIndex: 3 }))
    expect(gunawan?.karma).toEqual(expect.objectContaining({ kasusId: 'asma_eksaserbasi_berat_anak', anggotaIndex: 2 }))

    for (const item of M13_1A_AUTHORING_MANIFEST.encounterArchetypes) {
      expect(item.modePolicy, item.id).toEqual({ karier: true, ujian: false })
      expect(releasePolicyAktif(item.releasePolicy, CONTENT_RELEASE, CONTENT_RELEASE_ORDER), item.id).toBe(true)
      expect(encounterArchetypeAktif(PACK, item.channel, item.contentRef.id, 'karier', CONTENT_RELEASE), item.id).toBe(true)
      expect(encounterArchetypeAktif(PACK, item.channel, item.contentRef.id, 'ujian', CONTENT_RELEASE), item.id).toBe(false)
    }
    for (const item of M13_1A_AUTHORING_MANIFEST.ukmScenarios) {
      expect(item.modePolicy, item.id).toEqual({ karier: true, ujian: false })
      expect(releasePolicyAktif(item.releasePolicy, CONTENT_RELEASE, CONTENT_RELEASE_ORDER), item.id).toBe(true)
      expect(ukmScenarioAktif(PACK, item.contentRef.familyId, item.contentRef.visitId, 'karier', CONTENT_RELEASE), item.id).toBe(true)
      expect(ukmScenarioAktif(PACK, item.contentRef.familyId, item.contentRef.visitId, 'ujian', CONTENT_RELEASE), item.id).toBe(false)
    }
  })

  it('review ledger mengikat seluruh payload dan membawa physician sign-off sah', () => {
    expect(M13_1A_AUTHORING_MANIFEST.reviewRecords).toHaveLength(8)
    const actualHashes = actualReviewHashes()
    const recordedHashes: Record<string, string> = {}
    for (const record of M13_1A_AUTHORING_MANIFEST.reviewRecords) {
      const payload = M13_1A_REVIEW_PAYLOADS[record.id]!
      expect(payload, record.id).toBeDefined()
      recordedHashes[record.id] = record.contentHash
      if (record.contentHash !== actualHashes[record.id]) console.log(`${record.id} ${actualHashes[record.id]}`)
      expect(payload.schemaVersion, record.id).toBe(3)
      expect(payload.clinicalGroundingPolicy.id, record.id).toBe(
        'clinical-grounding-floor-graceful-degradation-v1',
      )
      expect(payload.clinicalGroundingPolicy.approvedBy.reviewer, record.id).toBe(
        'dr. Anak Agung Bagus Wirayuda',
      )
      expect(payload.release, record.id).toEqual({
        basedOn: M13_1A_BASE_CONTENT_RELEASE,
        proposed: M13_1A_PROPOSED_CONTENT_RELEASE,
      })
      expect(payload.runtimePolicy.modePolicy, record.id).toEqual({ karier: true, ujian: false })
      expect(payload.physicianDecision, record.id).toBe(
        M13_1A_PHYSICIAN_DECISION_BY_REVIEW_ID[record.id],
      )
      expect(payload.sourceMetadata.map((source) => source.id), record.id).toEqual(
        M13_1A_REVIEW_SOURCE_IDS[record.id],
      )
      expect(record.sourceIds, record.id).toEqual(M13_1A_REVIEW_SOURCE_IDS[record.id])
      expect(
        payload.evidenceBindings.every((binding) => record.sourceIds.includes(binding.source)),
        record.id,
      ).toBe(true)
      expect(record.status, record.id).toBe('approved')
      expect(record.technicalReview.decision, record.id).toBe('ready_for_physician_review')
      expect(record.technicalReview.credentials, record.id).toMatch(/bukan physician reviewer/i)
      expect(record.physicianSignoff, record.id).toEqual(expect.objectContaining({
        reviewer: 'dr. Anak Agung Bagus Wirayuda',
        credentials: 'Dokter; penanggung jawab klinis PRIMERA',
        signedAt: '2026-07-15',
        decision: 'approved',
      }))
      expect(record.physicianSignoff?.note.trim().length, record.id).toBeGreaterThan(80)
    }
    expect(recordedHashes).toEqual(actualHashes)
    expect(
      M13_1A_REVIEW_PAYLOADS['m13-1a-review-clinic-diare_akut_bayi_dehidrasi_berat']
        ?.proposedKarmaRewires,
    ).toContainEqual(expect.objectContaining({ familyId: 'keluarga_yani' }))
    const packet = readFileSync(
      resolve(process.cwd(), 'docs/M13_1A_PHYSICIAN_REVIEW_PACKET.md'),
      'utf8',
    )
    for (const decision of Object.values(M13_1A_PHYSICIAN_DECISION_BY_REVIEW_ID)) {
      expect(packet).toContain(`> ${decision}`)
    }
    expect(packet).toContain('dr. Anak Agung Bagus Wirayuda')
    expect(packet).toContain('8/8 `approved`')
  })

  it('evidence seluruhnya terminal (resolved utk konflik material, accepted_with_limitation utk sitasi rutin), population-specific, dan memakai sumber yang dapat ditelusuri', () => {
    const sourceIds = new Set(M13_1A_AUTHORING_MANIFEST.sourceSet.map((source) => source.id))
    expect(M13_1A_AUTHORING_MANIFEST.evidenceBindings.length).toBeGreaterThan(30)
    const materialIds = new Set(Object.keys(M13_1A_REVIEW_ID_BY_AUDITED_EVIDENCE_ID))
    for (const binding of M13_1A_AUTHORING_MANIFEST.evidenceBindings) {
      // Fix (2026-07-15): sebelumnya menuntut SEMUA binding literal 'resolved',
      // termasuk sitasi rutin yang tak pernah diajukan physician review individual
      // (lihat evidence.ts .map() fix) — hanya 3 konflik material yang genuinely
      // 'resolved' oleh dokter; sisanya terminal via 'accepted_with_limitation'.
      expect(binding.reviewStatus, binding.id).toBe(
        materialIds.has(binding.id) ? 'resolved' : 'accepted_with_limitation',
      )
      expect(binding.population?.trim().length, binding.id).toBeGreaterThan(10)
      expect(sourceIds.has(binding.source), binding.id).toBe(true)
      for (const reference of [
        ...(binding.governance?.floorSources ?? []),
        ...(binding.governance?.supersedingSources ?? []),
        ...(binding.governance?.resourceSources ?? []),
      ]) {
        expect(sourceIds.has(reference.source), `${binding.id}/${reference.source}`).toBe(true)
      }
    }
    const materialAudits = M13_1A_AUTHORING_MANIFEST.evidenceBindings.filter(
      (binding) => binding.audit?.materiality === 'material',
    )
    expect(materialAudits).toHaveLength(3)
    for (const binding of materialAudits) {
      expect(binding.audit?.physicianSignoff, binding.id).toEqual(expect.objectContaining({
        reviewer: 'dr. Anak Agung Bagus Wirayuda',
        signedAt: '2026-07-15',
        decision: 'approved',
      }))
    }
    for (const source of M13_1A_AUTHORING_MANIFEST.sourceSet) {
      expect(Boolean(source.officialUrl || source.localLocator), source.id).toBe(true)
      if (!source.officialUrl && source.localLocator && !isAbsolute(source.localLocator)) {
        expect(existsSync(resolve(process.cwd(), source.localLocator)), source.id).toBe(true)
      }
    }
    const pediatric = M13_1A_AUTHORING_MANIFEST.evidenceBindings.filter((binding) =>
      ['clinic:diare_akut_bayi_dehidrasi_berat', 'clinic:asma_eksaserbasi_berat_anak'].includes(binding.subject.id),
    )
    expect(pediatric.length).toBeGreaterThanOrEqual(10)
    expect(pediatric.every((binding) => /bayi|anak|usia/i.test(binding.population ?? ''))).toBe(true)
  })

  it('supersesi EBM mengikat floor Kemenkes dan resource context di EvidenceBinding', () => {
    const required = [
      'm13-1a:dimas-oxygen-target',
      'm13-1a:dimas-ipratropium-dose-age',
      'm13-1a:otitis-regimen',
      'm13-1a:fracture-no-mini-washout',
    ]
    for (const id of required) {
      const governance = M13_1A_AUTHORING_MANIFEST.evidenceBindings.find(
        (binding) => binding.id === id,
      )?.governance
      expect(governance?.policyId, id).toBe('clinical-grounding-floor-graceful-degradation-v1')
      expect(governance?.floorSources.length, id).toBeGreaterThan(0)
      expect(governance?.supersedingSources.length, id).toBeGreaterThan(0)
      expect(governance?.resourceSources.map((reference) => reference.source), id).toEqual(
        expect.arrayContaining(['kemenkes:aspak-infoboard', 'satusehat:kfa-v2']),
      )
      expect(governance?.gracefulDegradation, id).toBe('variable_or_unverified')
    }
    for (const id of required.filter((candidate) => candidate !== 'm13-1a:dimas-oxygen-target')) {
      const resourceIds = M13_1A_AUTHORING_MANIFEST.evidenceBindings.find(
        (binding) => binding.id === id,
      )!.governance!.resourceSources.map((reference) => reference.source)
      expect(resourceIds, id).toContain('fornas:kmk-1199-2025')
    }
    for (const reviewId of [
      'm13-1a-review-clinic-asma_eksaserbasi_berat_anak',
      'm13-1a-review-clinic-otitis_eksterna_akut_ringan',
      'm13-1a-review-clinic-fraktur_terbuka_tibia_stabil',
    ]) {
      const sourceMetadataIds = M13_1A_REVIEW_PAYLOADS[reviewId]!.sourceMetadata.map(
        (source) => source.id,
      )
      expect(sourceMetadataIds, reviewId).toEqual(
        expect.arrayContaining(['fornas:kmk-1199-2025', 'kemenkes:aspak-infoboard', 'satusehat:kfa-v2']),
      )
    }
  })

  it('Nayla memakai logika bayi 3 bulan, dosis zinc bayi, Plan C, dan stabilisasi pra-rujuk', () => {
    const nayla = caseById('diare_akut_bayi_dehidrasi_berat')
    expect(nayla.demografi).toEqual({ usiaMin: 0, usiaMax: 0, usiaBulanMin: 3, usiaBulanMax: 3 })
    expect(nayla.keluhanUtamaOlehPendamping).toBe(true)
    expect(nayla.anamnesis).toHaveLength(11)
    expect(nayla.anamnesis.every((item) => Boolean(item.variasi?.wali_anak))).toBe(true)
    expect(nayla.pemeriksaanFisik.find((item) => item.region === 'umum')?.temuan).toMatch(/5,6 kg/i)
    expect(nayla.clue).toMatch(/100 mL\/kg.*30 mL\/kg.*70 mL\/kg/is)
    expect(`${nayla.clue} ${nayla.mutiaraEbm}`).toMatch(/zinc 10 mg\/hari/i)
    expect(nayla.tatalaksana.obatOpsional).toEqual(expect.arrayContaining(['oralit', 'zinc_20']))
    expect(nayla.tatalaksana.obatSalahUmum).toContainEqual(expect.objectContaining({ id: 'loperamid_2', bahaya: 'kontraindikasi' }))
    expect(nayla.tatalaksana.prosedur).toContain('rehidrasi_plan_c_bayi')
    expect(nayla.stabilisasiWajib).toEqual(['rehidrasi_plan_c_bayi'])
    expect(M13_1A_AUTHORING_MANIFEST.proposedCatalog.tindakan.rehidrasi_plan_c_bayi?.nama).toMatch(
      /100 mL\/kg.*penilaian ulang/i,
    )
    expect(nayla.harusDirujuk).toBe(true)
  })

  it('Dimas dimodelkan sebagai eksaserbasi berat anak 3B tanpa kredit asma stabil 4A', () => {
    const dimas = caseById('asma_eksaserbasi_berat_anak')
    expect(dimas.demografi).toEqual({ usiaMin: 6, usiaMax: 11 })
    expect(dimas.icd10).toBe('J46')
    expect(dimas.diagnosisBanding).not.toContain('J21.9')
    expect(dimas.skdi).toBe('3B')
    expect(dimas.fktp144).toBe(false)
    expect(dimas.vital.spo2).toBe(87)
    expect(dimas.pemeriksaanFisik.find((item) => item.region === 'umum')?.temuan).toMatch(/24 kg/i)
    expect(dimas.clue).toMatch(/1-2 mg\/kgBB\/hari.*maksimum 40 mg.*3-5 hari/i)
    expect(dimas.clue).toMatch(/92-95%/)
    expect(dimas.clue).toMatch(/setiap 20 menit.*3 dosis.*jam pertama/i)
    expect(dimas.tatalaksana.obatBenar).toEqual(['prednison_5'])
    expect(dimas.tatalaksana.prosedur).toEqual(['oksigen', 'nebulisasi_burst_asma_anak'])
    expect(dimas.stabilisasiWajib).toEqual(['oksigen', 'nebulisasi_burst_asma_anak'])
    expect(dimas.harusDirujuk).toBe(true)
    const bronchodilatorDose = M13_1A_AUTHORING_MANIFEST.evidenceBindings.find(
      (item) => item.id === 'm13-1a:dimas-ipratropium-dose-age',
    )
    expect(bronchodilatorDose?.audit).toEqual(expect.objectContaining({
      finding: 'source_conflict',
      materiality: 'material',
    }))
    expect(bronchodilatorDose?.audit?.claim).toMatch(/salbutamol 2,5 mg/i)
    expect(M13_1A_PHYSICIAN_DECISION_BY_REVIEW_ID['m13-1a-review-clinic-asma_eksaserbasi_berat_anak']).toMatch(
      /salbutamol 2,5 mg.*5 mg/i,
    )
    const archetype = M13_1A_AUTHORING_MANIFEST.encounterArchetypes.find((item) => item.id === 'clinic:asma_eksaserbasi_berat_anak')!
    expect(archetype.credits).toEqual(['clinical:status_asmatikus_anak'])
    expect(archetype.excludedCredits).toContainEqual(expect.objectContaining({ itemId: 'fktp144:asthma_bronchiale' }))
  })

  it('empat representatif menutup A/B/C dan mengunci dangerous paths utama', () => {
    const hypo = caseById('hipoglikemia_ringan_dewasa')
    expect(hypo.vital.gds).toBe(58)
    expect(hypo.tatalaksana.obatBenar).toEqual([])
    expect(hypo.tatalaksana.prosedur).toEqual(['koreksi_hipoglikemia_oral_15g'])
    expect(hypo.stabilisasiWajib).toEqual(['koreksi_hipoglikemia_oral_15g'])
    expect(hypo.clue).toMatch(/15-20 g.*15 menit/i)
    expect(hypo.clue).toMatch(/hentikan dosis sulfonilurea berikutnya sampai regimen ditinjau/i)
    expect(hypo.clue).toMatch(/jangan memulangkan hanya karena satu hasil glukosa sudah normal/i)
    expect(hypo.tatalaksana.edukasiKritis).toContain('tinjau_obat_hipoglikemia')
    expect(hypo.clue).toMatch(/pemantauan glukosa 24-72 jam/i)
    expect(hypo.harusDirujuk).toBe(true)

    const bendaAsing = caseById('benda_asing_hidung_anak')
    expect(bendaAsing.demografi).toEqual({ usiaMin: 3, usiaMax: 5 })
    expect(bendaAsing.keluhanUtamaOlehPendamping).toBe(true)
    expect(bendaAsing.anamnesis.every((item) => Boolean(item.variasi?.wali_anak))).toBe(true)
    expect(bendaAsing.tatalaksana.prosedur).toEqual(['ekstraksi_benda_hidung_tekanan_positif'])
    expect(bendaAsing.tatalaksana.tindakanSalahUmum).toContainEqual(
      expect.objectContaining({ id: 'ekstraksi_benda_hidung_blind_probing', bahaya: 'berbahaya' }),
    )
    expect(bendaAsing.clue).toMatch(/tekanan positif.*parent's kiss/is)
    expect(`${bendaAsing.clue} ${bendaAsing.mutiaraEbm}`).toMatch(/baterai kancing.*beberapa jam/is)
    expect(bendaAsing.justifikasiRujukValid).toEqual(['komplikasi', 'keterbatasan_fasilitas'])

    const otitis = caseById('otitis_eksterna_akut_ringan')
    expect(otitis.tatalaksana.obatBenar).toEqual(['asam_asetat_tetes_telinga_2'])
    expect(otitis.tatalaksana.obatSalahUmum).toContainEqual(expect.objectContaining({ id: 'amoxicillin_500', bahaya: 'nonPrimer' }))
    expect(otitis.pemeriksaanFisik[0]?.temuan).toMatch(/membran timpani.*utuh/i)
    expect(otitis.clue).toMatch(/5 tetes 3-4 kali sehari/i)
    expect(otitis.clue).toMatch(/48-72 jam/i)
    expect(otitis.tatalaksana.prosedur ?? []).not.toContain('pembersihan_liang_telinga')

    const fraktur = caseById('fraktur_terbuka_tibia_stabil')
    expect(fraktur.skdi).toBe('3B')
    expect(fraktur.tatalaksana.prosedur).toEqual(expect.arrayContaining([
      'balut_luka_steril',
      'imobilisasi_bidai',
      'pasang_infus',
      'antibiotik_parenteral_fraktur_protokol',
    ]))
    expect(fraktur.tatalaksana.prosedur).not.toContain('irigasi_luka_fraktur_terbuka')
    expect(fraktur.tatalaksana.prosedur).not.toContain('hecting_luka')
    expect(fraktur.tatalaksana.obatBenar).toEqual(expect.arrayContaining(['vaksin_td', 'tetanus_imunoglobulin_250']))
    expect(fraktur.clue).toMatch(/tanpa probing, irigasi, debridement/i)
    expect(fraktur.mutiaraEbm).toMatch(/jangan melakukan mini-washout/i)
    expect(fraktur.panduanResmi).toMatch(/PNPK Fraktur 270\/2019.*ACS.*BOAST/is)
    expect(fraktur.catatanRealita).toMatch(/tidak membuktikan.*satu antibiotik.*semua fraktur terbuka/is)
    expect(fraktur.stabilisasiWajib).toEqual([
      'balut_luka_steril',
      'imobilisasi_bidai',
      'pasang_infus',
      'antibiotik_parenteral_fraktur_protokol',
    ])
    expect(fraktur.harusDirujuk).toBe(true)
  })

  it('mencatat lima blocker teknis sebagai resolved dan tidak menyisakan blocker aktivasi', () => {
    expect(M13_1A_AUTHORING_MANIFEST.activationBlockers).toEqual([])
    expect(M13_1A_AUTHORING_MANIFEST.resolvedActivationBlockers).toHaveLength(5)
    expect(M13_1A_AUTHORING_MANIFEST.resolvedActivationBlockers.map((item) => item.id)).toEqual([
      'bundle-stabilisasi',
      'usia-bayi',
      'ekonomi-resource',
      'dangerous-action',
      'jejaring-reperfusi',
    ])
  })

  it('activation gate hijau dan fail-closed bila satu review envelope berubah', () => {
    const actualHashes = actualReviewHashes()
    const gate = evaluasiKesiapanAktivasiM13(M13_1A_AUTHORING_MANIFEST, actualHashes)
    expect(gate).toEqual({ ready: true, issues: [] })

    const firstId = M13_1A_AUTHORING_MANIFEST.reviewRecords[0]!.id
    const tampered = { ...actualHashes, [firstId]: '0'.repeat(64) }
    const tamperedGate = evaluasiKesiapanAktivasiM13(M13_1A_AUTHORING_MANIFEST, tampered)
    expect(tamperedGate.ready).toBe(false)
    expect(tamperedGate.issues).toHaveLength(1)
    expect(tamperedGate.issues).toContain(`${firstId}: review envelope berubah setelah review`)
  })

  it('IGD STEMI memberi satu jawaban benar per langkah dan tidak memberi sertifikasi diagnosis palsu', () => {
    const stemi = M13_1A_AUTHORING_MANIFEST.igdCases[0]!
    expect(stemi.id).toBe('igd_stemi_anterior_hipoksemik')
    expect(stemi.vitalAwal.spo2).toBe(88)
    expect(stemi.clue).toMatch(/oksigen karena SpO2 88%.*aspirin.*tanpa menunggu troponin/is)
    expect(stemi.clue).toMatch(/jejaring reperfusi/i)
    expect(stemi.langkah.every((langkah) => langkah.pilihan.filter((pilihan) => pilihan.benar).length === 1)).toBe(true)
    const archetype = M13_1A_AUTHORING_MANIFEST.encounterArchetypes.find((item) => item.id === 'igd:igd_stemi_anterior_hipoksemik')!
    expect(archetype.credits).toEqual([])
    expect(archetype.creditRationale).toMatch(/tidak memberikan kredit diagnostik/i)
    expect(
      M13_1A_PHYSICIAN_DECISION_BY_REVIEW_ID['m13-1a-review-igd-igd_stemi_anterior_hipoksemik'],
    ).toMatch(/P2Y12.*antikoagulan.*nitrat.*PCI\/fibrinolisis/i)
  })

  it('UKM adalah relapse-prevention yang koheren, bukan kuliah ulang atau karma baru', () => {
    const ukm = M13_1A_AUTHORING_MANIFEST.ukmDrafts[0]!
    expect(ukm.familyId).toBe('keluarga_gunawan')
    expect(ukm.scenario.id).toBe('gunawan_k2')
    expect(ukm.scenario.target).toEqual(['tidak_merokok'])
    expect(ukm.scenario.hambatanSebenarnya).toBe('kesempatan')
    expect(ukm.scenario.karma).toBeUndefined()
    expect(ukm.scenario.dialog).toHaveLength(3)
    expect(ukm.scenario.petunjukHambatan).toMatch(/ketergantungan.*withdrawal.*farmakoterapi/is)
    expect(
      ukm.scenario.dialog.every(
        (dialog) => dialog.pilihan.filter((pilihan) => pilihan.tepat).length === 1,
      ),
    ).toBe(true)
    expect(ukm.scenario.intervensi.find((item) => item.id === 'gk2_i1')?.cocokUntuk).toEqual(['kesempatan'])
    expect(M13_1A_AUTHORING_MANIFEST.ukmScenarios[0]?.credits).toEqual(['ukm:pis-pk:tidak_merokok'])
  })

  it('item kurikulum baru aktif tanpa kredit palsu atau relasi yatim', () => {
    // M13 Batch 4 (2026-07-16): +34 archetype poli tier-rujuk + 14 IGD (182→230).
    expect(CURRICULUM_BLUEPRINT.encounterArchetypes).toHaveLength(230)
    expect(CURRICULUM_BLUEPRINT.ukmScenarios).toHaveLength(27)
    for (const item of M13_1A_AUTHORING_MANIFEST.newCurriculumItems) {
      expect(CURRICULUM_BLUEPRINT.curriculumItems).toContainEqual(item)
    }
    const knownItemIds = new Set(CURRICULUM_BLUEPRINT.curriculumItems.map((item) => item.id))
    for (const relation of M13_1A_AUTHORING_MANIFEST.itemConcepts) {
      expect(knownItemIds.has(relation.itemId), relation.itemId).toBe(true)
    }
    for (const archetype of M13_1A_AUTHORING_MANIFEST.encounterArchetypes) {
      for (const itemId of archetype.credits) expect(knownItemIds.has(itemId), `${archetype.id}/${itemId}`).toBe(true)
      for (const excluded of archetype.excludedCredits ?? []) expect(knownItemIds.has(excluded.itemId), `${archetype.id}/${excluded.itemId}`).toBe(true)
    }
    for (const scenario of M13_1A_AUTHORING_MANIFEST.ukmScenarios) {
      for (const itemId of scenario.credits) expect(knownItemIds.has(itemId), `${scenario.id}/${itemId}`).toBe(true)
    }

    const m13ArchetypeIds = new Set(
      M13_1A_AUTHORING_MANIFEST.encounterArchetypes.map((item) => item.id),
    )
    const creditedBaseline = new Set(
      CURRICULUM_BLUEPRINT.encounterArchetypes
        .filter((item) => item.channel === 'clinic' && !m13ArchetypeIds.has(item.id))
        .flatMap((item) => item.credits),
    )
    const newlyCoveredFktp144 = M13_1A_AUTHORING_MANIFEST.encounterArchetypes
      .flatMap((item) => item.credits)
      .filter((itemId) => itemId.startsWith('fktp144:') && !creditedBaseline.has(itemId))
      .sort()
    expect(newlyCoveredFktp144).toEqual([
      'fktp144:foreign_body_nose',
      'fktp144:hypoglycemia_mild',
      'fktp144:otitis_externa',
    ])
  })
})
