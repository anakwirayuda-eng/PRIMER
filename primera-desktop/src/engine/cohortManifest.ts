export interface CohortBuildManifest {
  schemaVersion: 2
  cohortId: string
  cohortStart: string
  cohortEnd: string
  commitSha: string
  appVersion: string
  engineRevision: number
  contentRelease: string
  examBlueprintVersion: string
  sidikJariPack: string
  installer: {
    file: string
    bytes: number
    sha256: string
  }
  generatedAt: string
}

export type CohortBuildManifestInput = Omit<CohortBuildManifest, 'schemaVersion'>

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const SHA256 = /^[a-f0-9]{64}$/

function tanggalIsoValid(value: string): boolean {
  if (!ISO_DATE.test(value)) return false
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

/** Validasi kecil agar arsip kohort tidak lahir dengan metadata placeholder. */
export function susunCohortBuildManifest(input: CohortBuildManifestInput): CohortBuildManifest {
  if (!/^[a-z0-9][a-z0-9._-]{0,63}$/i.test(input.cohortId)) {
    throw new Error('cohortId wajib berupa slug aman (huruf/angka/titik/garis)')
  }
  if (!tanggalIsoValid(input.cohortStart) || !tanggalIsoValid(input.cohortEnd)) {
    throw new Error('cohortStart/cohortEnd wajib berformat YYYY-MM-DD')
  }
  if (input.cohortStart > input.cohortEnd) throw new Error('cohortStart tidak boleh setelah cohortEnd')
  if (!/^[a-f0-9]{7,40}$/i.test(input.commitSha)) throw new Error('commitSha tidak valid')
  if (!input.appVersion.trim()) throw new Error('appVersion wajib diisi')
  if (!Number.isInteger(input.engineRevision) || input.engineRevision < 1) {
    throw new Error('engineRevision wajib bilangan bulat positif')
  }
  if (!input.contentRelease.trim()) throw new Error('contentRelease wajib diisi')
  if (!input.examBlueprintVersion.trim()) throw new Error('examBlueprintVersion wajib diisi')
  if (!input.sidikJariPack.trim()) throw new Error('sidikJariPack wajib diisi')
  if (!input.installer.file.trim() || input.installer.bytes <= 0 || !SHA256.test(input.installer.sha256)) {
    throw new Error('metadata installer tidak valid')
  }
  if (Number.isNaN(Date.parse(input.generatedAt))) throw new Error('generatedAt tidak valid')
  return { schemaVersion: 2, ...input }
}
