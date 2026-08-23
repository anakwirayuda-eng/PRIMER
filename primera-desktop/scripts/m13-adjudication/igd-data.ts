import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { PACK } from '../../src/content'
import { CONTENT_RELEASE } from '../../src/content/pack'
import { REVISI_ENGINE, sidikJariPack } from '../../src/engine/verifikasi'
import { workingTreeDirt } from './build-data'

export type IgdReviewDecision = 'setuju' | 'perlu-edit' | 'tolak' | 'nanti'

export interface IgdAdjudicationDataset {
  schema: 'primera.m13-14-igd-adjudication.v2'
  generatedAt: string
  sourceCommit: string
  contentRelease: string
  engineRevision: number
  packFingerprint: string
  artifactFingerprint: string
  reviewQuestions: string[]
  cases: Array<{
    id: string
    name: string
    reviewStatus: 'physician_approved'
    icd10: string
    skdi: string
    opening: string
    demography: {
      ageMin: number
      ageMax: number
      sex?: string
      ageMonthsMin?: number
      ageMonthsMax?: number
    }
    initialVitals: Record<string, string | number>
    initialStability: number
    correctDisposition: string
    referralSpecialty?: string
    referralCapabilities: string[]
    officialGuidance: string
    teachingPearl: string
    debrief: {
      keyPoints: string[]
      fktpReality: string
      resources: {
        ready: string[]
        networked: string[]
        notReady: string[]
      }
      continuity: string
      ukmBridge: {
        title: string
        summary: string
      }
    }
    sources: Array<{
      id: string
      label: string
      url: string
      year: number
      kind: string
    }>
    steps: Array<{
      id: string
      narrative: string
      choices: Array<{
        id: string
        label: string
        correct: boolean
        stabilityEffect: number
        feedback: string
      }>
    }>
    compiler: {
      structuralChecksPassed: boolean
      warnings: string[]
    }
  }>
}

function gitSnapshot(): string {
  try {
    const hash = execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    }).trim()
    // Audit CODEX beta.16: dulu memakai `git status --porcelain` polos, yang
    // SELALU kotor karena generator 137 sudah menulis tiga berkas docs/ sebelum
    // generator ini jalan. Pakai penghitung bersama yang mengecualikan keluaran
    // artefak (lihat build-data.ts) supaya stempelnya kembali berarti.
    return `${hash}${workingTreeDirt(process.cwd()) ? '+working-tree' : ''}`
  } catch {
    return 'unknown'
  }
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

export function buildIgdAdjudicationDataset(generatedAt = new Date().toISOString()): IgdAdjudicationDataset {
  const cases = Object.values(PACK.kasusIgd)
    .filter((item) => item.reviewStatus === 'physician_approved')
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((item) => {
      const warnings: string[] = []
      for (const step of item.langkah) {
        const correctCount = step.pilihan.filter((choice) => choice.benar).length
        if (correctCount !== 1) warnings.push(`${step.id}: ${correctCount} opsi benar (harus tepat 1)`)
        if (step.pilihan.some((choice) => choice.benar && choice.efekStabilitas <= 0)) {
          warnings.push(`${step.id}: opsi benar tidak menaikkan stabilitas`)
        }
        if (step.pilihan.some((choice) => !choice.benar && choice.efekStabilitas >= 0)) {
          warnings.push(`${step.id}: opsi salah tidak menurunkan stabilitas`)
        }
      }
      if (!item.sumber.some((source) => source.jenis === 'pedoman_indonesia')) {
        warnings.push('Belum ada sumber pedoman Indonesia pada registry kasus')
      }
      if (!item.sumber.some((source) => source.tahun >= 2024)) {
        warnings.push('Belum ada sumber 2024 atau lebih baru pada registry kasus')
      }

      return {
        id: item.id,
        name: item.nama,
        // filter() di atas menjamin 'physician_approved' pada runtime; TS tak
        // menyempitkan union lewat filter non-predikat, jadi assert eksplisit di
        // sini. IGD sengaja TIDAK ikut delegasi bulk 2026-08-23 (kanal 'gawat').
        reviewStatus: item.reviewStatus! as 'physician_approved',
        icd10: item.icd10,
        skdi: item.skdi,
        opening: item.pembuka,
        demography: {
          ageMin: item.demografi.usiaMin,
          ageMax: item.demografi.usiaMax,
          ...(item.demografi.jenisKelamin ? { sex: item.demografi.jenisKelamin } : {}),
          ...(item.demografi.usiaBulanMin !== undefined ? { ageMonthsMin: item.demografi.usiaBulanMin } : {}),
          ...(item.demografi.usiaBulanMax !== undefined ? { ageMonthsMax: item.demografi.usiaBulanMax } : {}),
        },
        initialVitals: { ...item.vitalAwal },
        initialStability: item.stabilitasAwal,
        correctDisposition: item.disposisiBenar,
        ...(item.spesialisRujukan ? { referralSpecialty: item.spesialisRujukan } : {}),
        referralCapabilities: [...(item.kapabilitasRujukanSalahSatu ?? [])],
        officialGuidance: item.panduanResmi,
        teachingPearl: item.clue,
        debrief: {
          keyPoints: [...item.debrief!.poinKunci],
          fktpReality: item.debrief!.realitaFktp,
          resources: {
            ready: [...item.debrief!.sumberDaya.ready],
            networked: [...item.debrief!.sumberDaya.melaluiJejaring],
            notReady: [...(item.debrief!.sumberDaya.tidakReady ?? [])],
          },
          continuity: item.debrief!.kontinuitas,
          ukmBridge: {
            title: item.debrief!.bridgeUkm.judul,
            summary: item.debrief!.bridgeUkm.ringkasan,
          },
        },
        sources: item.sumber.map((source) => ({
          id: source.id,
          label: source.label,
          url: source.url,
          year: source.tahun,
          kind: source.jenis,
        })),
        steps: item.langkah.map((step) => ({
          id: step.id,
          narrative: step.narasi,
          choices: step.pilihan.map((choice) => ({
            id: choice.id,
            label: choice.label,
            correct: choice.benar,
            stabilityEffect: choice.efekStabilitas,
            feedback: choice.respons,
          })),
        })),
        compiler: {
          structuralChecksPassed: warnings.filter((warning) => warning.includes('opsi')).length === 0,
          warnings,
        },
      }
    })

  const fingerprint = createHash('sha256').update(stableJson(cases)).digest('hex')
  return {
    schema: 'primera.m13-14-igd-adjudication.v2',
    generatedAt,
    sourceCommit: gitSnapshot(),
    contentRelease: CONTENT_RELEASE,
    engineRevision: REVISI_ENGINE,
    packFingerprint: sidikJariPack(PACK),
    artifactFingerprint: fingerprint,
    reviewQuestions: [
      'Apakah diagnosis, ICD-10, SKDI, populasi, dan derajat kegawatan konsisten?',
      'Apakah urutan ABC/stabilisasi awal benar, tidak menunda tindakan penyelamat nyawa, dan masuk akal di FKTP?',
      'Apakah tepat satu opsi benar pada tiap langkah, sedangkan distraktor salah tetapi tetap realistis dan umpan baliknya aman?',
      'Apakah disposisi, urgensi, spesialisasi, dan kapabilitas RS tujuan sesuai?',
      'Apakah mutiara klinis, panduan resmi, dan sumber cukup mutakhir serta tidak melebih-lebihkan kemampuan Puskesmas Sukamaju?',
      'Apakah bahasa vignette, pilihan, dan umpan balik jelas, manusiawi, dan cocok untuk mahasiswa kedokteran?',
    ],
    cases,
  }
}
