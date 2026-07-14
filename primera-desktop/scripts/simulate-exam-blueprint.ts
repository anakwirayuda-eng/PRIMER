import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { PACK } from '../src/content/index'
import { PAKET_UJIAN } from '../src/engine/paketUjian'
import { runExamBlueprintSimulation } from '../src/engine/examSimulation'

const outputArg = process.argv.findIndex((value) => value === '--output')
const outputPath = resolve(
  outputArg >= 0 && process.argv[outputArg + 1]
    ? process.argv[outputArg + 1]!
    : 'dist/exam-blueprint/m13-0d-simulation.json',
)

const report = runExamBlueprintSimulation(PACK, PAKET_UJIAN)
if (report.errors.length > 0) {
  throw new Error(`Simulasi ExamBlueprint gagal:\n${report.errors.join('\n')}`)
}

const artifact = {
  generatedAt: new Date().toISOString(),
  commitSha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  report,
}
mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8')
process.stdout.write(
  `${outputPath}\n${report.matrixRuns} runs; max same-slot=${report.maximumPairwiseSameSlotShare.toFixed(4)}\n`,
)
