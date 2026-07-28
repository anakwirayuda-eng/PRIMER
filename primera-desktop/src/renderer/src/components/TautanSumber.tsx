import type { TautanSumberUkm } from '@content/ukmCitations'
import './TautanSumber.css'

interface Props {
  sumber: readonly TautanSumberUkm[]
  label?: string
  className?: string
}

/** Renderer only permits credential-free HTTPS links to leave the app. */
export function urlSumberAman(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && Boolean(parsed.hostname) && !parsed.username && !parsed.password
  } catch {
    return false
  }
}

export function TautanSumber({
  sumber,
  label = 'Buka sumber',
  className = '',
}: Props) {
  if (sumber.length === 0) return null

  return (
    <nav
      className={`tautan-sumber ${className}`.trim()}
      aria-label="Tautan sumber resmi"
    >
      <span className="tautan-sumber__label mono">{label}</span>
      <span className="tautan-sumber__daftar">
        {sumber.map((item, index) => {
          const aman = urlSumberAman(item.url)
          return (
            <span className="tautan-sumber__item" key={item.id}>
              {index > 0 ? <span className="tautan-sumber__pemisah" aria-hidden="true">·</span> : null}
              {aman ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${item.label}; buka di browser bawaan`}
                  data-tip="Buka sumber asli di browser bawaan"
                >
                  <span>{item.label}</span>
                  <span className="tautan-sumber__eksternal" aria-hidden="true">{`\u2197`}</span>
                </a>
              ) : (
                <span
                  className="tautan-sumber__diblokir"
                  title="Tautan non-HTTPS atau tidak valid diblokir"
                >
                  {item.label}
                </span>
              )}
            </span>
          )
        })}
      </span>
    </nav>
  )
}
