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
  /** CODEX audit UI/UX 2026-07-10 (#22a): hitung retry KUMULATIF per kemunculan
   * boundary ini (bukan berturut-turut — tak direset walau retry sempat sembuh
   * lalu crash lain terjadi) agar tak boot-loop diam tanpa jalan keluar. */
  percobaan: number
}

const BATAS_PERCOBAAN = 2

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
  override state: State = { error: null, percobaan: 0 }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', this.props.judul ?? '', error, info.componentStack)
  }

  private cobaLagi = () => this.setState((s) => ({ error: null, percobaan: s.percobaan + 1 }))

  private keJudul = () => {
    // Kosongkan state di memori → App kembali ke TitleScreen. Disk TIDAK disentuh,
    // jadi simpanan tetap ada; bila state termuat yang memicu crash, mahasiswa bisa
    // memulai stase baru alih-alih terjebak boot-loop.
    useGame.setState((s) => ({ state: null, lastEvents: [], eventTick: s.eventTick + 1 }))
    // CODEX audit UI/UX 2026-07-10 (#22b): `arsip` sudah null saat crash mid-sesi (semua
    // jalur masuk game menguraskannya) — muat ulang dari disk agar tombol "Lanjutkan"
    // di TitleScreen kembali muncul, bukan hilang sampai app di-restart.
    void useGame.getState().muatAutosave()
    this.setState({ error: null, percobaan: 0 })
  }

  override render() {
    if (!this.state.error) return this.props.children
    const penuh = this.props.variant !== 'layar'
    const percobaanHabis = this.state.percobaan >= BATAS_PERCOBAAN
    return (
      <div
        // CODEX audit UI/UX 2026-07-10 (#21): hanya paksa mode terang utk shell penuh
        // (dipasang sebelum App menentukan mode apa pun) — variant 'layar' mewarisi
        // data-mode leluhur, spt komponen kartu lain, agar tak mengambang terang di
        // atas backdrop malam (mis. sesi jaga-malam IGD).
        data-mode={penuh ? 'pagi' : undefined}
        style={{
          minHeight: penuh ? '100vh' : '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: penuh ? 'linear-gradient(160deg, var(--kertas-200), var(--kertas-100))' : 'transparent',
          color: 'var(--tinta)',
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-halus)',
            borderRadius: 14,
            padding: '1.75rem 2rem',
            boxShadow: 'var(--shadow-kartu)',
          }}
        >
          <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.35rem', color: 'var(--kunyit-800)' }}>
            Maaf, terjadi kendala tak terduga
          </h1>
          <p style={{ margin: '0 0 1.1rem', lineHeight: 1.6, color: 'var(--tinta-lembut)' }}>
            {/* Audit editorial 2026-07-23: "Anda" adalah satu-satunya di seluruh
                game (register lain konsisten "kamu/-mu") — seragamkan, apalagi
                ini momen krisis yang butuh nada akrab yang sama. */}
            Permainan menemui kesalahan saat menampilkan layar. Kemajuan terakhirmu
            biasanya sudah tersimpan otomatis. Pilih salah satu:
          </p>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {!percobaanHabis && (
              <button
                onClick={this.cobaLagi}
                // CODEX M14 #18: dulu bg=--kunyit-700 + teks=--kertas-050. Token
                // kunyit MEMBALIK terang↔gelap antar-mode sedangkan kertas-050
                // tetap terang → di mode malam (variant 'layar') jadi terang-di-
                // terang (2.03:1, gagal AA). Pakai bg/teks adaptif tombolGaya
                // (lolos AA kedua mode, sama tombol lain) + tekankan via border
                // kunyit + tebal — emphasis tanpa mengorbankan kontras teks.
                style={{ ...tombolGaya, borderColor: 'var(--kunyit-700)', borderWidth: 2, fontWeight: 700 }}
              >
                Coba tampilkan lagi
              </button>
            )}
            <button onClick={() => window.location.reload()} style={tombolGaya}>
              Muat ulang permainan
            </button>
            <button onClick={this.keJudul} style={tombolGaya}>
              Kembali ke layar judul
            </button>
          </div>
          {percobaanHabis && (
            <p style={{ margin: '0.6rem 0 0', fontSize: '0.8rem', color: 'var(--tinta-pudar)' }}>
              Sudah dicoba beberapa kali — gunakan salah satu opsi lain di atas.
            </p>
          )}
          <details style={{ marginTop: '1.2rem', color: 'var(--tinta-pudar)' }}>
            <summary style={{ cursor: 'pointer', fontSize: '0.85rem' }}>Detail teknis (untuk pelaporan)</summary>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                fontSize: '0.75rem',
                marginTop: '0.5rem',
                maxHeight: 160,
                overflow: 'auto',
                color: 'var(--tinta-lembut)',
                // CODEX audit UI/UX 2026-07-10 (#22c): body global mematikan user-select
                // demi rasa game — stack trace di sini justru harus bisa disalin ke laporan.
                userSelect: 'text',
                WebkitUserSelect: 'text',
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
  border: '1px solid var(--border-tegas)',
  background: 'var(--bg-card)',
  color: 'var(--tinta)',
}
