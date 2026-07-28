import { PACK } from '../src/content'
import {
  sitasiIntervensiUkm,
  tautanKegiatanUkm,
  tautanPanduanSkenarioUkm,
} from '../src/content/ukmCitations'
import { DUEL_DIAGNOSIS_PILOTS, TEACH_BACK_PILOTS } from '../src/content/pedagogyPilots'

interface SourceUse {
  id: string
  label: string
  contexts: string[]
}

interface UrlResult {
  url: string
  status: number | null
  outcome: 'reachable' | 'restricted' | 'broken' | 'uncertain'
  detail: string
  uses: SourceUse[]
}

const CONCURRENCY = 6
const TIMEOUT_MS = 20_000

function collectUrls(): Map<string, SourceUse[]> {
  const urls = new Map<string, Map<string, SourceUse>>()

  function add(source: { id: string; label: string; url: string }, context: string): void {
    const uses = urls.get(source.url) ?? new Map<string, SourceUse>()
    const existing = uses.get(source.id)
    if (existing) {
      existing.contexts.push(context)
    } else {
      uses.set(source.id, {
        id: source.id,
        label: source.label,
        contexts: [context],
      })
    }
    urls.set(source.url, uses)
  }

  for (const kasus of Object.values(PACK.kasus)) {
    for (const source of kasus.sumber ?? []) {
      add(source, `poli:${kasus.id}`)
    }
  }

  for (const kasus of Object.values(PACK.kasusIgd)) {
    for (const source of kasus.sumber) {
      add(source, `igd:${kasus.id}`)
    }
  }

  for (const keluarga of Object.values(PACK.keluarga)) {
    for (const skenario of keluarga.arc.kunjungan) {
      for (const source of tautanPanduanSkenarioUkm(skenario)) {
        add(source, `ukm:${skenario.id}:debrief`)
      }
      for (const kartu of skenario.intervensi) {
        for (const source of sitasiIntervensiUkm(skenario, kartu).tautan) {
          add(source, `ukm:${skenario.id}:${kartu.id}:pra`)
        }
        for (const source of sitasiIntervensiUkm(skenario, kartu, 'pasca_penilaian').tautan) {
          add(source, `ukm:${skenario.id}:${kartu.id}:pasca`)
        }
      }
    }
  }

  for (const jenis of ['posyandu', 'prolanis', 'klb'] as const) {
    for (const source of tautanKegiatanUkm({ id: `${jenis}_audit` }, jenis)) {
      add(source, `ukm:kegiatan:${jenis}`)
    }
  }

  for (const pilot of DUEL_DIAGNOSIS_PILOTS) {
    for (const source of pilot.sumber) add(source, `pedagogi:duel:${pilot.id}`)
  }
  for (const pilot of TEACH_BACK_PILOTS) {
    for (const source of pilot.sumber) add(source, `pedagogi:teach-back:${pilot.id}`)
  }

  return new Map(
    [...urls].map(([url, uses]) => [
      url,
      [...uses.values()].map((use) => ({
        ...use,
        contexts: [...new Set(use.contexts)].sort(),
      })),
    ]),
  )
}

async function checkUrl(url: string, uses: SourceUse[]): Promise<UrlResult> {
  const classify = async (response: Response): Promise<UrlResult> => {
    const status = response.status
    await response.body?.cancel()

    if (status >= 200 && status < 400) {
      return { url, status, outcome: 'reachable', detail: response.url, uses }
    }
    if (status === 401 || status === 403 || status === 429) {
      return { url, status, outcome: 'restricted', detail: response.statusText, uses }
    }
    if (status === 404 || status === 410) {
      return { url, status, outcome: 'broken', detail: response.statusText, uses }
    }
    return { url, status, outcome: 'uncertain', detail: response.statusText, uses }
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        Accept: 'text/html,application/pdf;q=0.9,*/*;q=0.8',
        Range: 'bytes=0-2047',
        'User-Agent': 'PRIMERA-Provenance-Audit/1.0 (+clinical-source-validation)',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    return classify(response)
  } catch (error) {
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
    try {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 300))
      const retry = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          Accept: 'text/html,application/pdf;q=0.9,*/*;q=0.8',
          Range: 'bytes=0-2047',
          'User-Agent': 'PRIMERA-Provenance-Audit/1.0 (+url-retry)',
        },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })
      const retryResult = await classify(retry)
      return { ...retryResult, detail: `GET retry after ${detail}: ${retryResult.detail}` }
    } catch {
      // Some anti-bot layers reject GET bodies but answer HEAD correctly.
    }
    try {
      const fallback = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        headers: { 'User-Agent': 'PRIMERA-Provenance-Audit/1.0 (+url-fallback)' },
        signal: AbortSignal.timeout(10_000),
      })
      const result = await classify(fallback)
      return { ...result, detail: `HEAD fallback after ${detail}: ${result.detail}` }
    } catch {
      return { url, status: null, outcome: 'uncertain', detail, uses }
    }
  }
}

async function mapConcurrent<T, R>(
  items: readonly T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const output = new Array<R>(items.length)
  let cursor = 0

  async function worker(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      output[index] = await mapper(items[index]!)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  )
  return output
}

const urls = [...collectUrls()]
const results = await mapConcurrent(urls, CONCURRENCY, ([url, uses]) => checkUrl(url, uses))
const counts = {
  reachable: results.filter((item) => item.outcome === 'reachable').length,
  restricted: results.filter((item) => item.outcome === 'restricted').length,
  broken: results.filter((item) => item.outcome === 'broken').length,
  uncertain: results.filter((item) => item.outcome === 'uncertain').length,
}

console.log(`URL unik: ${results.length}`)
console.log(`Terjangkau: ${counts.reachable}`)
console.log(`Dibatasi situs: ${counts.restricted}`)
console.log(`Rusak pasti: ${counts.broken}`)
console.log(`Belum pasti: ${counts.uncertain}`)

for (const result of results.filter((item) => item.outcome !== 'reachable')) {
  const ids = result.uses.map((use) => use.id).join(', ')
  const contexts = [...new Set(result.uses.flatMap((use) => use.contexts))]
  console.log(
    `${result.outcome.toUpperCase()}\t${result.status ?? '-'}\t${result.url}\t${ids}\t${contexts.length} pemakaian\t${result.detail}`,
  )
}

if (counts.broken > 0) process.exitCode = 1
