import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useGame } from '../store'

interface Props {
  children: ReactNode
  /** Konteks untuk log (mis. 'root' atau nama layar). */
  judul?: string
  /** 'penuh' = layar penuh (shell); 'layar' = dalam area utama, HUD tetap hidup. */
  variant?: 'penuh' | 'layar'
}
interface State {
  error: Error | null
}

/**
 * Jaring render-phase. `dispatch()` di store SUDAH menangkap error ENGINE, tapi
 * error saat RENDER komponen (mis. selector mengembalikan bentuk tak terduga)
 * terjadi di siklus React — DI LUAR try/catch dispatch — dan tanpa boundary akan
 * meng-unmount seluruh pohon jadi layar putih tanpa jalan keluar. Di lab 50 mesin
 * tanpa pengawas, layar putih = stasiun mati di tengah ujian. Boundary ini memberi
 * jalan pulih: muat ulang, atau kembali ke judul TANPA menyentuh disk (memutus
 * boot-loop bila state autosave yang termuat justru pemicunya).
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', this.props.judul ?? '', error, info.componentStack)
  }

  private cobaLagi = () => this.setState({ error: null })

  private keJudul = () => {
    // Kosongkan state di memori → App kembali ke TitleScreen. Disk TIDAK disentuh,
    // jadi simpanan tetap ada; bila state termuat yang memicu crash, mahasiswa bisa
    // memulai stase baru alih-alih terjebak boot-loop.
    useGame.setState((s) => ({ state: null, lastEvents: [], eventTick: s.eventTick + 1 }))
    this.setState({ error: null })
  }

  override render() {
    if (!this.state.error) return this.props.children
    const penuh = this.props.variant !== 'layar'
    return (
      <div
        data-mode="pagi"
        style={{
          minHeight: penuh ? '100vh' : '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: penuh ? 'linear-gradient(160deg, #FDF3E0, #FAF6EF)' : 'transparent',
          color: '#3a2f26',
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            background: '#FFFDF8',
            border: '1px solid #e7dcc8',
            borderRadius: 14,
            padding: '1.75rem 2rem',
            boxShadow: '0 8px 30px rgba(80, 60, 30, 0.12)',
          }}
        >
          <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.35rem', color: '#7a4a12' }}>
            Maaf, terjadi kendala tak terduga
          </h1>
          <p style={{ margin: '0 0 1.1rem', lineHeight: 1.6, color: '#5c4d3e' }}>
            Permainan menemui kesalahan saat menampilkan layar. Kemajuan terakhir Anda
            biasanya sudah tersimpan otomatis. Pilih salah satu:
          </p>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={this.cobaLagi}
              style={{ ...tombolGaya, background: '#96500f', color: '#fff', borderColor: '#96500f' }}
            >
              Coba tampilkan lagi
            </button>
            <button onClick={() => window.location.reload()} style={tombolGaya}>
              Muat ulang permainan
            </button>
            <button onClick={this.keJudul} style={tombolGaya}>
              Kembali ke layar judul
            </button>
          </div>
          <details style={{ marginTop: '1.2rem', color: '#8a7a68' }}>
            <summary style={{ cursor: 'pointer', fontSize: '0.85rem' }}>Detail teknis (untuk pelaporan)</summary>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                fontSize: '0.75rem',
                marginTop: '0.5rem',
                maxHeight: 160,
                overflow: 'auto',
                color: '#6b5c4a',
              }}
            >
              {String(this.state.error?.stack ?? this.state.error)}
            </pre>
          </details>
        </div>
      </div>
    )
  }
}

const tombolGaya: React.CSSProperties = {
  font: 'inherit',
  cursor: 'pointer',
  padding: '0.55rem 1rem',
  borderRadius: 8,
  border: '1px solid #c9b48f',
  background: '#fff',
  color: '#5c4d3e',
}
