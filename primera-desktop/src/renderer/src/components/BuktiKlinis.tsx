import type { DebriefIgd, SumberKlinis } from '@content/types'
import { TeksTerbaca } from './TeksTerbaca'
import './BuktiKlinis.css'

interface Props {
  judul?: string
  namaKasus: string
  ringkasan: string
  sumber: readonly SumberKlinis[]
  debrief?: DebriefIgd
  defaultOpen?: boolean
  tampilkanRingkasan?: boolean
  className?: string
}

/** Pertahanan kedua setelah validasi pack: renderer tidak membuat link non-HTTPS. */
export function urlSumberAman(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && Boolean(parsed.hostname) && !parsed.username && !parsed.password
  } catch {
    return false
  }
}

export function BuktiKlinis({
  judul = 'Panduan resmi & sumber',
  namaKasus,
  ringkasan,
  sumber,
  debrief,
  defaultOpen = false,
  tampilkanRingkasan = true,
  className = '',
}: Props) {
  return (
    <details className={`bukti-klinis ${className}`.trim()} open={defaultOpen || undefined}>
      <summary>
        <span className="bukti-klinis__judul">{judul}</span>
        <span className="bukti-klinis__jumlah mono">{sumber.length} rujukan</span>
      </summary>

      <div className="bukti-klinis__isi">
        {tampilkanRingkasan && (
          <section className="bukti-klinis__inti" aria-label="Inti keputusan klinis">
            <div className="bukti-klinis__subjudul mono">INTI KEPUTUSAN</div>
            <TeksTerbaca teks={ringkasan} batasKata={42} />
          </section>
        )}

        {debrief && (
          <section className="bukti-klinis__pengayaan" aria-label="Debrief kasus IGD">
            <div className="bukti-klinis__subjudul mono">YANG PERLU MENETAP</div>
            <ul className="bukti-klinis__poin">
              {debrief.poinKunci.map((poin) => <li key={poin}>{poin}</li>)}
            </ul>

            <details className="bukti-klinis__lapisan">
              <summary>Realita FKTP &amp; kesiapan sumber daya</summary>
              <TeksTerbaca teks={debrief.realitaFktp} batasKata={74} />
              <div className="bukti-klinis__resource-grid">
                <ResourceGroup judul="READY DI SUKAMAJU" items={debrief.sumberDaya.ready} />
                <ResourceGroup judul="MELALUI JEJARING" items={debrief.sumberDaya.melaluiJejaring} />
                {debrief.sumberDaya.tidakReady?.length ? (
                  <ResourceGroup judul="TIDAK READY" items={debrief.sumberDaya.tidakReady} />
                ) : null}
              </div>
            </details>

            <details className="bukti-klinis__lapisan">
              <summary>Kelanjutan perawatan</summary>
              <TeksTerbaca teks={debrief.kontinuitas} batasKata={64} />
            </details>

            <details className="bukti-klinis__lapisan">
              <summary>{debrief.bridgeUkm.judul}</summary>
              <TeksTerbaca teks={debrief.bridgeUkm.ringkasan} batasKata={78} />
            </details>
          </section>
        )}

        <div>
          <div className="bukti-klinis__subjudul mono">SUMBER</div>
          <ul className="bukti-klinis__daftar" aria-label={`Sumber klinis ${namaKasus}`}>
            {sumber.map((item) => {
              const aman = urlSumberAman(item.url)
              return (
                <li key={item.id}>
                  <span className="bukti-klinis__meta mono">
                    {item.jenis === 'pedoman_indonesia' ? 'INDONESIA' : 'EBM'} <span aria-hidden="true">·</span>{' '}
                    {item.tahun}
                  </span>
                  {aman ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${item.label}; buka di browser bawaan`}
                      data-tip="Buka di browser bawaan"
                    >
                      <span>{item.label}</span>
                      <span className="bukti-klinis__eksternal" aria-hidden="true">{`\u2197`}</span>
                    </a>
                  ) : (
                    <span className="bukti-klinis__diblokir">
                      {item.label} <small>Tautan tidak aman diblokir</small>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <p className="bukti-klinis__catatan">
          Ringkasan adalah parafrasa pembelajaran. Tautan membuka dokumen asli di browser bawaan.
        </p>
      </div>
    </details>
  )
}

function ResourceGroup({ judul, items }: { judul: string; items: readonly string[] }) {
  return (
    <div className="bukti-klinis__resource">
      <div className="bukti-klinis__subjudul mono">{judul}</div>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  )
}
