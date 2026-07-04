import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

/**
 * Jaring render-phase. Callback realtime menyuntik `payload.new` (data eksternal
 * dari server) langsung ke state komponen — payload malformed bisa melempar saat
 * render dan tanpa boundary meng-unmount seluruh aplikasi jadi layar putih di HP
 * mahasiswa di tengah sesi. Muat ulang aman: state permainan hidup di server,
 * resume via NIM tersimpan di localStorage.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  override render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="layar-tengah">
        <h1>Maaf, terjadi kendala</h1>
        <p className="subjudul">
          Aplikasi menemui kesalahan tak terduga. Muat ulang untuk menyambung kembali ke sesi —
          kemajuan tersimpan di server dan Anda akan otomatis masuk lagi.
        </p>
        <button onClick={() => window.location.reload()}>Muat Ulang</button>
        <details style={{ marginTop: '1rem', color: 'var(--redup)' }}>
          <summary style={{ cursor: 'pointer' }}>Detail teknis</summary>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem', overflow: 'auto', maxHeight: 160 }}>
            {String(this.state.error?.stack ?? this.state.error)}
          </pre>
        </details>
      </div>
    )
  }
}
