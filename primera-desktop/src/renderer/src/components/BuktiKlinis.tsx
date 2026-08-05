import type { DebriefIgd, SumberKlinis } from '@content/types'
import { TeksTerbaca } from './TeksTerbaca'
import { urlSumberAman } from './TautanSumber'
import './BuktiKlinis.css'

export { urlSumberAman } from './TautanSumber'

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
              {/* Audit CODEX beta.16 (2026-08-06): kunci dulu memakai teks poin
                  itu sendiri. Selama 14 debrief lama semua poinnya unik, jadi
                  belum menggigit — tapi ia akan menggigit begitu ada dua poin
                  berbunyi sama, dan React membuang salah satunya diam-diam.
                  Indeks aman di sini: daftar ini statis, tak diurut ulang. */}
              {debrief.poinKunci.map((poin, i) => <li key={i}>{poin}</li>)}
            </ul>

            <details className="bukti-klinis__lapisan">
              <summary>Realita FKTP &amp; kesiapan sumber daya</summary>
              <TeksTerbaca teks={debrief.realitaFktp} batasKata={74} />
              {/* Copy-audit 2026-08-01: "READY" (Inggris mentah) → bahasa pemain. */}
              <div className="bukti-klinis__resource-grid">
                <ResourceGroup judul="TERSEDIA DI SUKAMAJU" items={debrief.sumberDaya.ready} />
                <ResourceGroup judul="LEWAT JEJARING RUJUKAN" items={debrief.sumberDaya.melaluiJejaring} />
                {debrief.sumberDaya.tidakReady?.length ? (
                  <ResourceGroup judul="TIDAK TERSEDIA" items={debrief.sumberDaya.tidakReady} />
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
              const cakupan =
                item.cakupan === 'langsung'
                  ? 'LANGSUNG'
                  : item.cakupan === 'terkait'
                    ? 'TERKAIT'
                    : item.cakupan === 'floor_umum'
                      ? 'PEDOMAN DASAR'
                      : null
              return (
                <li key={item.id}>
                  <span className="bukti-klinis__meta mono">
                    {item.jenis === 'pedoman_indonesia' ? 'INDONESIA' : 'EBM'}
                    {cakupan ? (
                      <>
                        {' '}<span aria-hidden="true">·</span>{' '}{cakupan}
                      </>
                    ) : null}
                    {' '}<span aria-hidden="true">·</span>{' '}{item.tahun}
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
                  {item.catatan ? (
                    <span className="bukti-klinis__batas">{item.catatan}</span>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>

        <p className="bukti-klinis__catatan">
          Ringkasan adalah parafrasa pembelajaran. Label cakupan membedakan sumber yang
          langsung membahas kasus ini, sumber terkait, dan pedoman dasar yang berlaku
          umum. Tautan membuka dokumen asli di browser bawaan.
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
