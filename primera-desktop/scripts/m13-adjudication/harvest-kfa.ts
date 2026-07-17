import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { PACK } from '../../src/content'
import { KFA_QUERIES } from './config'

const ENDPOINT = 'https://satusehat.kemkes.go.id/kfa-browser/farmasi/api/search/active-ingredients'
const OUTPUT = resolve(process.cwd(), 'docs/M13_137_KFA_SNAPSHOT.json')

interface KfaResult {
  kfaCode: string
  name: string
  ucumSymbol: string
}

interface KfaResponse {
  status: number
  error: boolean
  message: string
  data: KfaResult[] | KfaResult
}

function canonical(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

async function search(query: string): Promise<KfaResult[]> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ page: 1, size: 25, search: query, search_by: 'name' }),
  })
  if (!response.ok) throw new Error(`KFA ${response.status} untuk query ${query}`)
  const payload = (await response.json()) as KfaResponse
  const rows = Array.isArray(payload.data) ? payload.data : payload.data ? [payload.data] : []
  const exact = rows.filter((row) => canonical(row.name) === canonical(query))
  return exact.length > 0 ? exact : rows
}

async function main(): Promise<void> {
  const labCases = Object.values(PACK.kasus).filter(
    (item) => item.activationStatus === 'lab_prototype_unadjudicated',
  )
  const drugIds = [...new Set(labCases.flatMap((item) => [
    ...item.tatalaksana.obatBenar,
    ...(item.tatalaksana.obatAlternatif ?? []).flat(),
    ...(item.tatalaksana.obatOpsional ?? []),
  ]))].sort()

  const missingQueries = drugIds.filter((id) => !KFA_QUERIES[id])
  const staleQueries = Object.keys(KFA_QUERIES).filter((id) => !drugIds.includes(id))
  if (missingQueries.length > 0 || staleQueries.length > 0) {
    throw new Error(`KFA query map tidak exact. missing=${missingQueries.join(',')} stale=${staleQueries.join(',')}`)
  }

  const queryCache = new Map<string, KfaResult[]>()
  for (const query of [...new Set(Object.values(KFA_QUERIES).flat())]) {
    queryCache.set(query, await search(query))
  }

  const items = drugIds.map((drugId) => ({
    drugId,
    catalogName: PACK.obat[drugId].nama,
    queryResults: KFA_QUERIES[drugId].map((query) => ({
      query,
      results: queryCache.get(query) ?? [],
    })),
  }))

  const unresolved = items.flatMap((item) => item.queryResults
    .filter((result) => result.results.length === 0)
    .map((result) => `${item.drugId}:${result.query}`))

  await writeFile(OUTPUT, `${JSON.stringify({
    schema: 'primera.m13-kfa-active-substance-snapshot.v1',
    retrievedAt: new Date().toISOString(),
    endpoint: ENDPOINT,
    browserUrl: 'https://satusehat.kemkes.go.id/kfa-browser/farmasi',
    scopeWarning: 'Kode adalah KFA active-substance master data, bukan kode product-template/variant dan bukan bukti stok atau status Fornas.',
    caseCount: labCases.length,
    drugCount: drugIds.length,
    unresolved,
    items,
  }, null, 2)}\n`, 'utf8')

  console.log(`KFA snapshot: ${items.length} obat, ${unresolved.length} query belum terpetakan -> ${OUTPUT}`)
}

await main()

