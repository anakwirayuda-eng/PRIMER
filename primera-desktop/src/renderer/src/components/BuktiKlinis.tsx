import type { SumberKlinis } from '@content/types'
import { TeksTerbaca } from './TeksTerbaca'
import './BuktiKlinis.css'

interface Props {
  judul?: string
  namaKasus: string
  ringkasan: string
  sumber: readonly SumberKlinis[]
  defaultOpen?: boolean
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
  defaultOpen = false,
  className = '',
}: Props) {
  return (
    <details className={`bukti-klinis ${className}`.trim()} open={defaultOpen || undefined}>
      <summary>
        <span className="bukti-klinis__judul">{judul}</span>
        <span className="bukti-klinis__jumlah mono">{sumber.length} rujukan</span>
      </summary>

      <div className="bukti-klinis__isi">
        <section className="bukti-klinis__inti" aria-label="Inti keputusan klinis">
          <div className="bukti-klinis__subjudul mono">INTI KEPUTUSAN</div>
          <TeksTerbaca teks={ringkasan} batasKata={42} />
        </section>

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
                      title="Buka di browser bawaan"
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
