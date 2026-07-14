import type { ContentPack } from '../../pack'
import type { KasusKlinis } from '../../types'
import { NAMA_ICD } from '../../icd10'
import { buildCurriculumBlueprint } from '../blueprint'
import { M13_SOURCE_REGISTRY } from '../sourceRegistry'
import type { M13AuthoringManifest } from './manifest'
import {
  M13_1A_REVIEW_PAYLOADS,
  M13_1A_REVIEW_SOURCE_IDS,
} from './reviewPayloads'

function duplikat(ids: string[]): string[] {
  const terlihat = new Set<string>()
  const hasil = new Set<string>()
  for (const id of ids) {
    if (terlihat.has(id)) hasil.add(id)
    terlihat.add(id)
  }
  return [...hasil]
}

function semuaObat(kasus: KasusKlinis): string[] {
  return [
    ...kasus.tatalaksana.obatBenar,
    ...(kasus.tatalaksana.obatAlternatif ?? []).flat(),
    ...(kasus.tatalaksana.obatOpsional ?? []),
    ...(kasus.tatalaksana.obatSalahUmum ?? []).map((item) => item.id),
  ]
}

function tanggalIso(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
}

function samaSetString(a: string[], b: string[]): boolean {
  return JSON.stringify([...new Set(a)].sort()) === JSON.stringify([...new Set(b)].sort())
}

function contentRefKey(ref: { kind: 'clinic' | 'igd'; id: string }): string {
  return `${ref.kind}:${ref.id}`
}

export function validasiM13AuthoringManifest(
  manifest: M13AuthoringManifest,
  activePack: ContentPack,
): string[] {
  const masalah: string[] = []
  const tambah = (condition: boolean, message: string) => {
    if (condition) masalah.push(message)
  }

  tambah(manifest.activationStatus !== 'awaiting_physician_review', 'activationStatus bukan awaiting_physician_review')
  tambah(manifest.basedOnContentRelease !== activePack.runtimeManifest?.contentRelease, 'baseline draft berbeda dari CONTENT_RELEASE aktif')
  tambah(activePack.runtimeManifest?.releaseOrder.includes(manifest.proposedContentRelease) === true, 'proposed release sudah masuk runtime releaseOrder')
  tambah(manifest.clinicCases.length !== 6, `jumlah clinic draft ${manifest.clinicCases.length}, seharusnya 6`)
  tambah(manifest.igdCases.length !== 1, `jumlah IGD draft ${manifest.igdCases.length}, seharusnya 1`)
  tambah(manifest.ukmDrafts.length !== 1, `jumlah UKM draft ${manifest.ukmDrafts.length}, seharusnya 1`)

  const caseIds = manifest.clinicCases.map((kasus) => kasus.id)
  const igdIds = manifest.igdCases.map((kasus) => kasus.id)
  const specIds = manifest.clinicSpecs.map((spec) => spec.caseId)
  for (const id of duplikat(caseIds)) masalah.push(`clinic case id duplikat '${id}'`)
  for (const id of duplikat(igdIds)) masalah.push(`IGD case id duplikat '${id}'`)
  for (const id of duplikat(specIds)) masalah.push(`clinic spec id duplikat '${id}'`)
  tambah(new Set(specIds).size !== new Set(caseIds).size || specIds.some((id) => !caseIds.includes(id)), 'clinicSpecs tidak menutup tepat seluruh clinicCases')

  const specs = new Map(manifest.clinicSpecs.map((spec) => [spec.caseId, spec]))
  const budget = { A: [10, 15], B: [7, 10], C: [5, 8] } as const
  const obatIds = new Set([...Object.keys(activePack.obat), ...Object.keys(manifest.proposedCatalog.obat)])
  const tindakanIds = new Set([...Object.keys(activePack.tindakan), ...Object.keys(manifest.proposedCatalog.tindakan)])
  const edukasiIds = new Set([...Object.keys(activePack.edukasi), ...Object.keys(manifest.proposedCatalog.edukasi)])
  const labIds = new Set(Object.keys(activePack.lab))
  const knownIcdNames = new Set([
    ...Object.keys(NAMA_ICD),
    ...activePack.skdi144.map((item) => item.icd10),
    ...Object.values(activePack.kasus).map((item) => item.icd10),
    ...Object.keys(manifest.proposedIcd10Entries),
  ])
  const obatDipakai = new Set(manifest.clinicCases.flatMap(semuaObat))
  const tindakanDipakai = new Set(manifest.clinicCases.flatMap((kasus) => kasus.tatalaksana.prosedur ?? []))
  const edukasiDipakai = new Set(manifest.clinicCases.flatMap((kasus) => kasus.tatalaksana.edukasi))
  const icdDipakai = new Set([
    ...manifest.clinicCases.flatMap((kasus) => [kasus.icd10, ...kasus.diagnosisBanding]),
    ...manifest.igdCases.map((kasus) => kasus.icd10),
  ])

  for (const [id, item] of Object.entries(manifest.proposedCatalog.obat)) {
    tambah(item.id !== id, `katalog obat draft key '${id}' tidak sama dengan item.id '${item.id}'`)
    tambah(Boolean(activePack.obat[id]), `katalog obat draft menimpa id aktif '${id}'`)
    tambah(!obatDipakai.has(id), `katalog obat draft yatim '${id}'`)
  }
  for (const [id, item] of Object.entries(manifest.proposedCatalog.tindakan)) {
    tambah(item.id !== id, `katalog tindakan draft key '${id}' tidak sama dengan item.id '${item.id}'`)
    tambah(Boolean(activePack.tindakan[id]), `katalog tindakan draft menimpa id aktif '${id}'`)
    tambah(!tindakanDipakai.has(id), `katalog tindakan draft yatim '${id}'`)
  }
  for (const [id, item] of Object.entries(manifest.proposedCatalog.edukasi)) {
    tambah(item.id !== id, `katalog edukasi draft key '${id}' tidak sama dengan item.id '${item.id}'`)
    tambah(Boolean(activePack.edukasi[id]), `katalog edukasi draft menimpa id aktif '${id}'`)
    tambah(!edukasiDipakai.has(id), `katalog edukasi draft yatim '${id}'`)
  }
  for (const id of Object.keys(manifest.proposedIcd10Entries)) {
    tambah(Object.prototype.hasOwnProperty.call(NAMA_ICD, id), `label ICD draft menimpa label aktif '${id}'`)
    tambah(!icdDipakai.has(id), `label ICD draft yatim '${id}'`)
  }

  for (const kasus of manifest.clinicCases) {
    tambah(Boolean(activePack.kasus[kasus.id]), `clinic draft '${kasus.id}' sudah aktif di PACK`)
    const spec = specs.get(kasus.id)
    if (!spec) continue
    const [min, max] = budget[spec.authoringTier]
    tambah(kasus.anamnesis.length < min || kasus.anamnesis.length > max, `${kasus.id}: ${kasus.anamnesis.length} pertanyaan di luar budget tier ${spec.authoringTier} (${min}-${max})`)
    tambah(!kasus.anamnesis.some((item) => item.kategori === 'keluhan_utama'), `${kasus.id}: tidak punya pembuka keluhan_utama`)
    for (const id of duplikat(kasus.anamnesis.map((item) => item.id))) masalah.push(`${kasus.id}: id anamnesis duplikat '${id}'`)
    const indexPertanyaan = new Map(kasus.anamnesis.map((item, index) => [item.id, index]))
    for (const [index, pertanyaan] of kasus.anamnesis.entries()) {
      for (const prasyaratId of pertanyaan.bukaSetelah ?? []) {
        const indexPrasyarat = indexPertanyaan.get(prasyaratId)
        tambah(indexPrasyarat === undefined, `${kasus.id}/${pertanyaan.id}: prasyarat '${prasyaratId}' tidak ada`)
        tambah(indexPrasyarat !== undefined && indexPrasyarat >= index, `${kasus.id}/${pertanyaan.id}: prasyarat '${prasyaratId}' tidak mendahului pertanyaan`)
        const prasyarat = kasus.anamnesis[indexPrasyarat ?? -1]
        tambah(Boolean(prasyarat?.hanyaUntuk && prasyarat.hanyaUntuk !== pertanyaan.hanyaUntuk), `${kasus.id}/${pertanyaan.id}: gender prasyarat '${prasyaratId}' tidak kompatibel`)
      }
    }
    for (const id of semuaObat(kasus)) tambah(!obatIds.has(id), `${kasus.id}: obat yatim '${id}'`)
    for (const id of kasus.tatalaksana.prosedur ?? []) tambah(!tindakanIds.has(id), `${kasus.id}: tindakan yatim '${id}'`)
    for (const id of kasus.tatalaksana.edukasi) tambah(!edukasiIds.has(id), `${kasus.id}: edukasi yatim '${id}'`)
    for (const id of kasus.lab.map((item) => item.id)) tambah(!labIds.has(id), `${kasus.id}: lab yatim '${id}'`)
    for (const icd10 of kasus.diagnosisBanding) {
      tambah(icd10 !== kasus.icd10 && !knownIcdNames.has(icd10), `${kasus.id}: diagnosis banding '${icd10}' tidak punya nama UI`)
    }
    for (const id of kasus.tatalaksana.edukasiKritis ?? []) tambah(!kasus.tatalaksana.edukasi.includes(id), `${kasus.id}: edukasi kritis '${id}' bukan subset edukasi`)
    tambah(Boolean(kasus.stabilisasiWajib && !kasus.tatalaksana.prosedur?.includes(kasus.stabilisasiWajib)), `${kasus.id}: stabilisasiWajib tidak ada di prosedur`)
    tambah(kasus.harusDirujuk && !kasus.spesialisRujukan, `${kasus.id}: rujuk wajib tanpa spesialis tujuan`)
  }

  for (const kasus of manifest.igdCases) {
    tambah(Boolean(activePack.kasusIgd[kasus.id]), `IGD draft '${kasus.id}' sudah aktif di PACK`)
    tambah(kasus.disposisiBenar === 'rujuk' && !kasus.spesialisRujukan, `${kasus.id}: IGD rujuk tanpa spesialis tujuan`)
    for (const langkah of kasus.langkah) {
      tambah(langkah.pilihan.filter((pilihan) => pilihan.benar).length !== 1, `${kasus.id}/${langkah.id}: harus tepat satu pilihan benar`)
    }
  }

  const conceptIds = new Set(manifest.clinicalConcepts.map((concept) => concept.id))
  const newItemIds = new Set(manifest.newCurriculumItems.map((item) => item.id))
  const archetypeIds = new Set(manifest.encounterArchetypes.map((item) => item.id))
  const scenarioIds = new Set(manifest.ukmScenarios.map((item) => item.id))
  const activeBlueprint = buildCurriculumBlueprint(activePack)
  const activeConceptIds = new Set(activeBlueprint.clinicalConcepts.map((item) => item.id))
  const activeItemIds = new Set(activeBlueprint.curriculumItems.map((item) => item.id))
  for (const id of duplikat(manifest.clinicalConcepts.map((item) => item.id))) masalah.push(`clinical concept id duplikat '${id}'`)
  for (const id of duplikat(manifest.newCurriculumItems.map((item) => item.id))) masalah.push(`curriculum item id duplikat '${id}'`)
  for (const id of duplikat(manifest.encounterArchetypes.map((item) => item.id))) masalah.push(`encounter archetype id duplikat '${id}'`)
  for (const id of duplikat(manifest.ukmScenarios.map((item) => item.id))) masalah.push(`UKM scenario id duplikat '${id}'`)
  const activeArchetypeIds = new Set(activePack.runtimeManifest?.encounterArchetypes.map((item) => item.id) ?? [])
  const activeScenarioIds = new Set(activePack.runtimeManifest?.ukmScenarios.map((item) => item.id) ?? [])
  for (const id of conceptIds) tambah(activeConceptIds.has(id), `clinical concept draft menimpa id aktif '${id}'`)
  for (const id of newItemIds) tambah(activeItemIds.has(id), `curriculum item draft menimpa id aktif '${id}'`)
  for (const id of archetypeIds) tambah(activeArchetypeIds.has(id), `encounter archetype draft menimpa id aktif '${id}'`)
  for (const id of scenarioIds) tambah(activeScenarioIds.has(id), `UKM scenario draft menimpa id aktif '${id}'`)
  const contentRefs = manifest.encounterArchetypes.map((item) => contentRefKey(item.contentRef))
  for (const ref of duplikat(contentRefs)) masalah.push(`encounter contentRef duplikat '${ref}'`)
  for (const kasus of manifest.clinicCases) {
    tambah(
      contentRefs.filter((ref) => ref === `clinic:${kasus.id}`).length !== 1,
      `${kasus.id}: harus punya tepat satu archetype clinic`,
    )
  }
  for (const kasus of manifest.igdCases) {
    tambah(
      contentRefs.filter((ref) => ref === `igd:${kasus.id}`).length !== 1,
      `${kasus.id}: harus punya tepat satu archetype IGD`,
    )
  }
  for (const archetype of manifest.encounterArchetypes) {
    tambah(!conceptIds.has(archetype.conceptId), `${archetype.id}: concept yatim '${archetype.conceptId}'`)
    tambah(archetype.releasePolicy.introducedIn !== manifest.proposedContentRelease, `${archetype.id}: releasePolicy bukan proposed release`)
    tambah(!archetype.modePolicy.karier || archetype.modePolicy.ujian, `${archetype.id}: modePolicy bukan Career-only`)
    tambah(archetype.credits.length === 0 && !archetype.creditRationale, `${archetype.id}: credits kosong tanpa rationale`)
    tambah(archetype.channel !== archetype.contentRef.kind, `${archetype.id}: channel tidak cocok contentRef`)
    if (archetype.contentRef.kind === 'clinic') tambah(!caseIds.includes(archetype.contentRef.id), `${archetype.id}: clinic contentRef yatim`)
    if (archetype.contentRef.kind === 'igd') tambah(!igdIds.includes(archetype.contentRef.id), `${archetype.id}: IGD contentRef yatim`)
  }
  for (const scenario of manifest.ukmScenarios) {
    tambah(scenario.releasePolicy.introducedIn !== manifest.proposedContentRelease, `${scenario.id}: releasePolicy bukan proposed release`)
    tambah(!scenario.modePolicy.karier || scenario.modePolicy.ujian, `${scenario.id}: modePolicy bukan Career-only`)
    tambah(!manifest.ukmDrafts.some((draft) => draft.familyId === scenario.contentRef.familyId && draft.scenario.id === scenario.contentRef.visitId), `${scenario.id}: UKM contentRef yatim`)
  }
  for (const draft of manifest.ukmDrafts) {
    tambah(
      manifest.ukmScenarios.filter(
        (scenario) =>
          scenario.contentRef.familyId === draft.familyId &&
          scenario.contentRef.visitId === draft.scenario.id,
      ).length !== 1,
      `${draft.familyId}/${draft.scenario.id}: harus punya tepat satu UKM scenario policy`,
    )
    tambah(
      activePack.keluarga[draft.familyId]?.arc.kunjungan.some((item) => item.id === draft.scenario.id) === true,
      `${draft.familyId}/${draft.scenario.id}: kunjungan UKM sudah aktif`,
    )
  }
  for (const relation of manifest.itemConcepts) {
    tambah(!conceptIds.has(relation.conceptId), `itemConcept: concept yatim '${relation.conceptId}'`)
    tambah(!activeItemIds.has(relation.itemId) && !newItemIds.has(relation.itemId), `itemConcept: item yatim '${relation.itemId}'`)
  }

  const sourceIds = new Set(manifest.sourceSet.map((source) => source.id))
  const canonicalSources = new Map(M13_SOURCE_REGISTRY.map((source) => [source.id, source]))
  for (const id of duplikat(manifest.sourceSet.map((source) => source.id))) masalah.push(`source id duplikat '${id}'`)
  for (const id of duplikat(manifest.evidenceBindings.map((binding) => binding.id))) masalah.push(`evidence binding id duplikat '${id}'`)
  for (const source of manifest.sourceSet) {
    tambah(!source.officialUrl && !source.localLocator, `${source.id}: tidak punya officialUrl atau localLocator`)
    tambah(!tanggalIso(source.publicationDate), `${source.id}: publicationDate tidak valid`)
    tambah(!tanggalIso(source.retrievedAt), `${source.id}: retrievedAt tidak valid`)
    tambah(!source.issuer.trim(), `${source.id}: issuer kosong`)
    tambah(!source.title.trim(), `${source.id}: title kosong`)
    tambah(!source.population.trim(), `${source.id}: population kosong`)
    tambah(!source.facilityScope.trim(), `${source.id}: facilityScope kosong`)
    if (source.officialUrl) {
      try {
        tambah(new URL(source.officialUrl).protocol !== 'https:', `${source.id}: officialUrl wajib HTTPS`)
      } catch {
        masalah.push(`${source.id}: officialUrl tidak valid`)
      }
    }
    tambah(source.lifecycleStatus === 'active_with_limitation' && !source.limitation?.trim(), `${source.id}: status limitation tanpa penjelasan`)
    if (source.canonicalRegistryId) {
      const canonical = canonicalSources.get(source.canonicalRegistryId)
      tambah(!canonical, `${source.id}: canonicalRegistryId '${source.canonicalRegistryId}' tidak ada`)
      if (canonical) {
        tambah(source.id !== canonical.id, `${source.id}: id berbeda dari canonicalRegistryId`)
        tambah(source.officialUrl !== canonical.officialUrl, `${source.id}: officialUrl drift dari registry kanonik`)
        tambah(source.localLocator !== canonical.localArtifact.path, `${source.id}: localLocator drift dari registry kanonik`)
        tambah(source.lifecycleStatus !== canonical.lifecycleStatus, `${source.id}: lifecycleStatus drift dari registry kanonik`)
      }
    }
  }
  for (const binding of manifest.evidenceBindings) {
    tambah(!sourceIds.has(binding.source), `${binding.id}: source yatim '${binding.source}'`)
    tambah(!binding.locator.trim(), `${binding.id}: locator kosong`)
    tambah(!binding.population?.trim(), `${binding.id}: population kosong`)
    tambah(binding.reviewStatus !== 'pending', `${binding.id}: reviewStatus harus pending sebelum sign-off`)
    if (binding.subject.kind === 'curriculum_item') tambah(!newItemIds.has(binding.subject.id), `${binding.id}: curriculum item subject yatim`)
    if (binding.subject.kind === 'encounter_archetype') tambah(!archetypeIds.has(binding.subject.id), `${binding.id}: archetype subject yatim`)
    if (binding.subject.kind === 'ukm_scenario') tambah(!scenarioIds.has(binding.subject.id), `${binding.id}: UKM subject yatim`)
  }
  for (const id of [...newItemIds, ...archetypeIds, ...scenarioIds]) {
    tambah(!manifest.evidenceBindings.some((binding) => binding.subject.id === id), `${id}: tidak punya evidence binding`)
  }

  const expectedReviewIds = Object.keys(M13_1A_REVIEW_PAYLOADS).sort()
  const actualReviewIds = manifest.reviewRecords.map((record) => record.id).sort()
  tambah(JSON.stringify(expectedReviewIds) !== JSON.stringify(actualReviewIds), 'reviewRecords tidak menutup tepat 8 payload review')
  for (const record of manifest.reviewRecords) {
    tambah(record.status !== 'awaiting_physician_review', `${record.id}: status review bukan awaiting_physician_review`)
    tambah(Boolean(record.physicianSignoff), `${record.id}: physician sign-off tidak boleh dipalsukan pada draft`)
    tambah(record.basedOnContentRelease !== manifest.basedOnContentRelease, `${record.id}: baseline release drift`)
    tambah(record.proposedContentRelease !== manifest.proposedContentRelease, `${record.id}: proposed release drift`)
    tambah(!/^[0-9a-f]{64}$/i.test(record.contentHash) || /^0{64}$/.test(record.contentHash), `${record.id}: contentHash belum dibekukan`)
    for (const id of duplikat(record.sourceIds)) masalah.push(`${record.id}: source review duplikat '${id}'`)
    for (const id of record.sourceIds) tambah(!sourceIds.has(id), `${record.id}: source review yatim '${id}'`)
    tambah(
      !samaSetString(record.sourceIds, M13_1A_REVIEW_SOURCE_IDS[record.id] ?? []),
      `${record.id}: sourceIds drift dari review envelope`,
    )
  }

  for (const rewire of manifest.proposedKarmaRewires) {
    const keluarga = activePack.keluarga[rewire.familyId]
    const kunjungan = keluarga?.arc.kunjungan.find((item) => item.id === rewire.visitId)
    const anggota = keluarga?.anggota[rewire.memberIndex]
    const target = manifest.clinicCases.find((kasus) => kasus.id === rewire.toCaseId)
    tambah(!keluarga, `karma rewire: keluarga '${rewire.familyId}' tidak ada`)
    tambah(kunjungan?.karma?.kasusId !== rewire.fromCaseId || kunjungan.karma.anggotaIndex !== rewire.memberIndex, `karma rewire ${rewire.familyId}/${rewire.visitId}: origin runtime drift`)
    tambah(!target, `karma rewire ${rewire.familyId}/${rewire.visitId}: target '${rewire.toCaseId}' tidak ada`)
    tambah(Boolean(anggota && target && (anggota.usia < target.demografi.usiaMin || anggota.usia > target.demografi.usiaMax)), `karma rewire ${rewire.familyId}/${rewire.visitId}: usia anggota tidak cocok target`)
    tambah(Boolean(anggota && target?.demografi.jenisKelamin && anggota.jenisKelamin !== target.demografi.jenisKelamin), `karma rewire ${rewire.familyId}/${rewire.visitId}: gender anggota tidak cocok target`)
  }

  return masalah
}

export interface M13ActivationReadiness {
  ready: boolean
  issues: string[]
}

/**
 * Gate pra-aktivasi. Hash aktual dihitung oleh tooling Node/release dan diberikan
 * ke fungsi ini agar modul browser tidak bergantung pada node:crypto.
 */
export function evaluasiKesiapanAktivasiM13(
  manifest: M13AuthoringManifest,
  actualReviewHashes: Record<string, string>,
): M13ActivationReadiness {
  const issues: string[] = manifest.activationBlockers.map((blocker) => `activation blocker: ${blocker}`)

  for (const binding of manifest.evidenceBindings) {
    if (binding.reviewStatus === 'pending') issues.push(`${binding.id}: evidence masih pending`)
    if (binding.reviewStatus === 'blocked') issues.push(`${binding.id}: evidence diblokir`)
  }

  for (const record of manifest.reviewRecords) {
    if (!record.physicianSignoff) issues.push(`${record.id}: physician sign-off belum ada`)
    if (!['approved', 'approved_with_waiver'].includes(record.status)) {
      issues.push(`${record.id}: status '${record.status}' belum terminal-approved`)
    }
    if (record.physicianSignoff?.decision === 'approved' && record.status !== 'approved') {
      issues.push(`${record.id}: decision approved tidak cocok status '${record.status}'`)
    }
    if (
      record.physicianSignoff?.decision === 'approved_with_waiver' &&
      record.status !== 'approved_with_waiver'
    ) {
      issues.push(`${record.id}: decision waiver tidak cocok status '${record.status}'`)
    }
    const actualHash = actualReviewHashes[record.id]
    if (!actualHash) issues.push(`${record.id}: hash aktual belum diberikan`)
    else if (record.contentHash !== actualHash) issues.push(`${record.id}: review envelope berubah setelah review`)
  }

  return { ready: issues.length === 0, issues }
}
