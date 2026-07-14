import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CURRICULUM_BLUEPRINT, PACK } from '../../index'
import {
  CONTENT_RELEASE,
  CONTENT_RELEASE_ORDER,
  LEGACY_CONTENT_RELEASE,
  releasePolicyAktif,
} from '../../pack'
import {
  M13_1A_AUTHORING_MANIFEST,
  M13_1A_BASE_CONTENT_RELEASE,
  M13_1A_PHYSICIAN_DECISION_BY_REVIEW_ID,
  M13_1A_PROPOSED_CONTENT_RELEASE,
  M13_1A_REVIEW_PAYLOADS,
  M13_1A_REVIEW_SOURCE_IDS,
  evaluasiKesiapanAktivasiM13,
  validasiM13AuthoringManifest,
} from '.'

function caseById(id: string) {
  return M13_1A_AUTHORING_MANIFEST.clinicCases.find((kasus) => kasus.id === id)!
}

function actualReviewHashes(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(M13_1A_REVIEW_PAYLOADS).map(([id, payload]) => [
      id,
      createHash('sha256').update(JSON.stringify(payload)).digest('hex'),
    ]),
  )
}

describe('M13-1a - authoring slice menunggu physician review', () => {
  it('menutup tepat 6 poli + 1 IGD + 1 UKM dan lolos validator draft', () => {
    expect(validasiM13AuthoringManifest(M13_1A_AUTHORING_MANIFEST, PACK)).toEqual([])
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
    for (const spec of M13_1A_AUTHORING_MANIFEST.clinicSpecs.filter((item) => item.role === 'representative')) {
      const draft = caseById(spec.caseId)
      expect(Object.values(PACK.kasus).some((active) => active.icd10 === draft.icd10), draft.id).toBe(false)
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

  it('validator fail-closed bila katalog draft menimpa id aktif', () => {
    const rusak = structuredClone(M13_1A_AUTHORING_MANIFEST)
    const obat = rusak.proposedCatalog.obat as Record<string, (typeof PACK.obat)[string]>
    obat.metformin_500 = PACK.obat.metformin_500!
    expect(validasiM13AuthoringManifest(rusak, PACK)).toContain(
      "katalog obat draft menimpa id aktif 'metformin_500'",
    )
  })

  it('validator fail-closed untuk key katalog drift dan contentRef ganda', () => {
    const katalogRusak = structuredClone(M13_1A_AUTHORING_MANIFEST)
    katalogRusak.proposedCatalog.obat.glukosa_oral_15g!.id = 'glukosa_oral_drift'
    expect(validasiM13AuthoringManifest(katalogRusak, PACK)).toContain(
      "katalog obat draft key 'glukosa_oral_15g' tidak sama dengan item.id 'glukosa_oral_drift'",
    )

    const refRusak = structuredClone(M13_1A_AUTHORING_MANIFEST)
    refRusak.encounterArchetypes[1]!.contentRef = structuredClone(
      refRusak.encounterArchetypes[0]!.contentRef,
    )
    expect(validasiM13AuthoringManifest(refRusak, PACK)).toContain(
      "encounter contentRef duplikat 'clinic:diare_akut_bayi_dehidrasi_berat'",
    )
  })

  it('validator fail-closed bila concept draft menimpa blueprint aktif', () => {
    const rusak = structuredClone(M13_1A_AUTHORING_MANIFEST)
    const activeConceptId = CURRICULUM_BLUEPRINT.clinicalConcepts[0]!.id
    rusak.clinicalConcepts[0]!.id = activeConceptId
    expect(validasiM13AuthoringManifest(rusak, PACK)).toContain(
      `clinical concept draft menimpa id aktif '${activeConceptId}'`,
    )
  })

  it('tetap murni draft: PACK, release aktif, karma, dan mode Ujian tidak berubah', () => {
    expect(CONTENT_RELEASE).toBe(M13_1A_BASE_CONTENT_RELEASE)
    expect(CONTENT_RELEASE_ORDER).toEqual([LEGACY_CONTENT_RELEASE, CONTENT_RELEASE])
    expect(CONTENT_RELEASE_ORDER).not.toContain(M13_1A_PROPOSED_CONTENT_RELEASE)
    for (const kasus of M13_1A_AUTHORING_MANIFEST.clinicCases) expect(PACK.kasus[kasus.id], kasus.id).toBeUndefined()
    for (const kasus of M13_1A_AUTHORING_MANIFEST.igdCases) expect(PACK.kasusIgd[kasus.id], kasus.id).toBeUndefined()
    expect(PACK.keluarga.keluarga_gunawan?.arc.kunjungan.some((item) => item.id === 'gunawan_k2')).toBe(false)

    const yani = PACK.keluarga.keluarga_yani?.arc.kunjungan.find((item) => item.id === 'yani_k1')
    const gunawan = PACK.keluarga.keluarga_gunawan?.arc.kunjungan.find((item) => item.id === 'gunawan_k1')
    expect(yani?.karma).toEqual(expect.objectContaining({ kasusId: 'diare_akut_anak', anggotaIndex: 3 }))
    expect(gunawan?.karma).toEqual(expect.objectContaining({ kasusId: 'asma_ringan', anggotaIndex: 2 }))

    const expandedOrder = [...CONTENT_RELEASE_ORDER, M13_1A_PROPOSED_CONTENT_RELEASE]
    for (const item of [
      ...M13_1A_AUTHORING_MANIFEST.encounterArchetypes,
      ...M13_1A_AUTHORING_MANIFEST.ukmScenarios,
    ]) {
      expect(item.modePolicy, item.id).toEqual({ karier: true, ujian: false })
      expect(releasePolicyAktif(item.releasePolicy, CONTENT_RELEASE, CONTENT_RELEASE_ORDER), item.id).toBe(false)
      expect(releasePolicyAktif(item.releasePolicy, CONTENT_RELEASE, expandedOrder), item.id).toBe(false)
      expect(releasePolicyAktif(item.releasePolicy, M13_1A_PROPOSED_CONTENT_RELEASE, expandedOrder), item.id).toBe(true)
    }
  })

  it('review ledger mengikat seluruh payload dan tidak memalsukan physician sign-off', () => {
    expect(M13_1A_AUTHORING_MANIFEST.reviewRecords).toHaveLength(8)
    const actualHashes = actualReviewHashes()
    const recordedHashes: Record<string, string> = {}
    for (const record of M13_1A_AUTHORING_MANIFEST.reviewRecords) {
      const payload = M13_1A_REVIEW_PAYLOADS[record.id]!
      expect(payload, record.id).toBeDefined()
      recordedHashes[record.id] = record.contentHash
      if (record.contentHash !== actualHashes[record.id]) console.log(`${record.id} ${actualHashes[record.id]}`)
      expect(payload.schemaVersion, record.id).toBe(2)
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
      expect(record.status, record.id).toBe('awaiting_physician_review')
      expect(record.technicalReview.decision, record.id).toBe('ready_for_physician_review')
      expect(record.technicalReview.credentials, record.id).toMatch(/bukan physician reviewer/i)
      expect(record.physicianSignoff, record.id).toBeUndefined()
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
  })

  it('evidence seluruhnya pending, population-specific, dan memakai sumber yang dapat ditelusuri', () => {
    const sourceIds = new Set(M13_1A_AUTHORING_MANIFEST.sourceSet.map((source) => source.id))
    expect(M13_1A_AUTHORING_MANIFEST.evidenceBindings.length).toBeGreaterThan(30)
    for (const binding of M13_1A_AUTHORING_MANIFEST.evidenceBindings) {
      expect(binding.reviewStatus, binding.id).toBe('pending')
      expect(binding.population?.trim().length, binding.id).toBeGreaterThan(10)
      expect(sourceIds.has(binding.source), binding.id).toBe(true)
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

  it('Nayla memakai logika bayi 3 bulan, dosis zinc bayi, Plan C, dan stabilisasi pra-rujuk', () => {
    const nayla = caseById('diare_akut_bayi_dehidrasi_berat')
    expect(nayla.demografi).toEqual({ usiaMin: 0, usiaMax: 0 })
    expect(nayla.keluhanUtamaOlehPendamping).toBe(true)
    expect(nayla.anamnesis).toHaveLength(11)
    expect(nayla.anamnesis.every((item) => Boolean(item.variasi?.wali_anak))).toBe(true)
    expect(nayla.pemeriksaanFisik.find((item) => item.region === 'umum')?.temuan).toMatch(/5,6 kg/i)
    expect(nayla.clue).toMatch(/100 mL\/kg.*30 mL\/kg.*70 mL\/kg/is)
    expect(`${nayla.clue} ${nayla.mutiaraEbm}`).toMatch(/zinc 10 mg\/hari/i)
    expect(nayla.tatalaksana.obatOpsional).toEqual(expect.arrayContaining(['oralit', 'zinc_20']))
    expect(nayla.tatalaksana.obatSalahUmum).toContainEqual(expect.objectContaining({ id: 'loperamid_2', bahaya: 'kontraindikasi' }))
    expect(nayla.tatalaksana.prosedur).toContain('rehidrasi_plan_c_bayi')
    expect(nayla.stabilisasiWajib).toBe('rehidrasi_plan_c_bayi')
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
    expect(dimas.clue).toMatch(/94-98%/)
    expect(dimas.clue).toMatch(/setiap 20 menit.*3 kali.*jam pertama/i)
    expect(dimas.tatalaksana.obatBenar).toEqual(expect.arrayContaining(['ipratropium_salbutamol_neb', 'prednison_5']))
    expect(dimas.tatalaksana.prosedur).toEqual(expect.arrayContaining(['oksigen', 'nebulisasi']))
    expect(dimas.harusDirujuk).toBe(true)
    const archetype = M13_1A_AUTHORING_MANIFEST.encounterArchetypes.find((item) => item.id === 'clinic:asma_eksaserbasi_berat_anak')!
    expect(archetype.credits).toEqual(['clinical:status_asmatikus_anak'])
    expect(archetype.excludedCredits).toContainEqual(expect.objectContaining({ itemId: 'fktp144:asthma_bronchiale' }))
  })

  it('empat representatif menutup A/B/C dan mengunci dangerous paths utama', () => {
    const hypo = caseById('hipoglikemia_ringan_dewasa')
    expect(hypo.vital.gds).toBe(58)
    expect(hypo.tatalaksana.obatBenar).toEqual(['glukosa_oral_15g'])
    expect(hypo.clue).toMatch(/15-20 g.*15 menit/i)
    expect(hypo.clue).toMatch(/hentikan sementara atau kurangi sulfonilurea/i)
    expect(hypo.clue).toMatch(/jangan menyuruh melanjutkan dosis berikut tanpa review/i)
    expect(hypo.tatalaksana.edukasiKritis).toContain('tinjau_obat_hipoglikemia')
    expect(hypo.harusDirujuk).toBe(false)

    const bendaAsing = caseById('benda_asing_hidung_anak')
    expect(bendaAsing.demografi).toEqual({ usiaMin: 3, usiaMax: 5 })
    expect(bendaAsing.keluhanUtamaOlehPendamping).toBe(true)
    expect(bendaAsing.anamnesis.every((item) => Boolean(item.variasi?.wali_anak))).toBe(true)
    expect(bendaAsing.tatalaksana.prosedur).toEqual(['ekstraksi_benda_asing_hidung'])
    expect(bendaAsing.clue).toMatch(/pengait tumpul.*kateter balon.*suction/is)
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
      'irigasi_luka_fraktur_terbuka',
      'balut_luka_steril',
      'imobilisasi_bidai',
      'pasang_infus',
    ]))
    expect(fraktur.tatalaksana.prosedur).not.toContain('hecting_luka')
    expect(fraktur.tatalaksana.obatBenar).toEqual(expect.arrayContaining(['sefazolin_inj_1g', 'vaksin_td', 'tetanus_imunoglobulin_250']))
    expect(fraktur.clue).toMatch(/irigasi singkat.*tanpa debridement/i)
    expect(fraktur.catatanRealita).toMatch(/restriksi profilaksis bedah.*tidak.*membuktikan.*fraktur terbuka/is)
    expect(fraktur.stabilisasiWajib).toBe('imobilisasi_bidai')
    expect(fraktur.harusDirujuk).toBe(true)
  })

  it('menahan aktivasi bila bundle stabilisasi belum punya keputusan scoring', () => {
    expect(M13_1A_AUTHORING_MANIFEST.activationBlockers).toHaveLength(5)
    expect(M13_1A_AUTHORING_MANIFEST.activationBlockers).toEqual(expect.arrayContaining([
      expect.stringMatching(/satu stabilisasiWajib.*beberapa tindakan/i),
      expect.stringMatching(/3 bulan.*0 tahun/i),
      expect.stringMatching(/placeholder authoring/i),
      expect.stringMatching(/blind probing.*dangerous-action gate/i),
      expect.stringMatching(/PCI\/fibrinolisis.*IGD STEMI/i),
    ]))
  })

  it('activation gate sengaja tetap merah sampai sign-off, evidence, blocker, dan hash selesai', () => {
    const actualHashes = actualReviewHashes()
    const gate = evaluasiKesiapanAktivasiM13(M13_1A_AUTHORING_MANIFEST, actualHashes)
    expect(gate.ready).toBe(false)
    expect(gate.issues).toEqual(expect.arrayContaining([
      expect.stringMatching(/activation blocker:/i),
      expect.stringMatching(/evidence masih pending/i),
      expect.stringMatching(/physician sign-off belum ada/i),
      expect.stringMatching(/belum terminal-approved/i),
    ]))
    expect(gate.issues.some((item) => /review envelope berubah/i.test(item))).toBe(false)

    const firstId = M13_1A_AUTHORING_MANIFEST.reviewRecords[0]!.id
    const tampered = { ...actualHashes, [firstId]: '0'.repeat(64) }
    expect(
      evaluasiKesiapanAktivasiM13(M13_1A_AUTHORING_MANIFEST, tampered).issues,
    ).toContain(`${firstId}: review envelope berubah setelah review`)
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

  it('item kurikulum baru tidak merusak gap kanonik baseline sebelum aktivasi', () => {
    expect(CURRICULUM_BLUEPRINT.encounterArchetypes).toHaveLength(72)
    expect(CURRICULUM_BLUEPRINT.ukmScenarios).toHaveLength(26)
    for (const item of M13_1A_AUTHORING_MANIFEST.newCurriculumItems) {
      expect(CURRICULUM_BLUEPRINT.curriculumItems.some((existing) => existing.id === item.id), item.id).toBe(false)
    }
    const knownItemIds = new Set([
      ...CURRICULUM_BLUEPRINT.curriculumItems.map((item) => item.id),
      ...M13_1A_AUTHORING_MANIFEST.newCurriculumItems.map((item) => item.id),
    ])
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

    const creditedBaseline = new Set(
      CURRICULUM_BLUEPRINT.encounterArchetypes
        .filter((item) => item.channel === 'clinic')
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
