import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createReadStream, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { PACK } from '../src/content/index'
import { REVISI_ENGINE, sidikJariPack } from '../src/engine/verifikasi'
import { susunCohortBuildManifest } from '../src/engine/cohortManifest'

function args(): Map<string, string> {
  const result = new Map<string, string>()
  const raw = process.argv.slice(2)
  for (let i = 0; i < raw.length; i += 2) {
    const key = raw[i]
    const value = raw[i + 1]
    if (!key?.startsWith('--') || value === undefined) {
      throw new Error(`Argumen tidak valid dekat '${key ?? ''}'`)
    }
    result.set(key.slice(2), value)
  }
  return result
}

function wajib(map: Map<string, string>, key: string): string {
  const value = map.get(key)?.trim()
  if (!value) throw new Error(`--${key} wajib diisi`)
  return value
}

async function sha256File(path: string): Promise<string> {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(path)) hash.update(chunk)
  return hash.digest('hex')
}

const pilihan = args()
const installerPath = resolve(wajib(pilihan, 'installer'))
const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8')) as { version: string }
const installerBytes = statSync(installerPath).size
const installerSha256 = await sha256File(installerPath)
const commitSha = pilihan.get('commit') ?? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const outputDir = resolve(pilihan.get('output') ?? 'dist/cohort-manifests')

const manifest = susunCohortBuildManifest({
  cohortId: wajib(pilihan, 'cohort-id'),
  cohortStart: wajib(pilihan, 'cohort-start'),
  cohortEnd: wajib(pilihan, 'cohort-end'),
  commitSha,
  appVersion: packageJson.version,
  engineRevision: REVISI_ENGINE,
  contentRelease: PACK.runtimeManifest.contentRelease,
  sidikJariPack: sidikJariPack(PACK),
  installer: {
    file: basename(installerPath),
    bytes: installerBytes,
    sha256: installerSha256,
  },
  generatedAt: new Date().toISOString(),
})

mkdirSync(outputDir, { recursive: true })
const outputPath = resolve(outputDir, `${manifest.cohortId}.json`)
writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
process.stdout.write(`${outputPath}\n${installerSha256}\n`)
