/**
 * HUD — bar atas: identitas hari, blok, musim, stamina pip, dana, navigasi layar.
 * Satu-satunya navigasi global. Ramping: 2 meter pemain saja (pilar anti-overload).
 */

import { useGame } from '../store'
import { musimDariHari, type LayarGame } from '@engine/state'
import { HARI_BUKA_PETA } from '@engine/reducer'
import { HARI_STASE } from '@engine/paketUjian'
import { MuteButton } from '../audio/MuteButton'
import { Pengaturan } from './Pengaturan'
import './Hud.css'

const NAMA_BLOK = { pagi: 'PAGI — Klinik', siang: 'SIANG — Lapangan', sore: 'SORE — Meja Kerja' } as const
const NAMA_MUSIM = { hujan: 'Musim Hujan', pancaroba: 'Pancaroba', kemarau: 'Kemarau' } as const

export function Hud() {
  const state = useGame((s) => s.state)
  const dispatch = useGame((s) => s.dispatch)
  const statusSimpan = useGame((s) => s.statusSimpan)
  if (!state) return null

  const musim = musimDariHari(state.hari)
  const suratBaru = state.inbox.filter((m) => !m.dibaca).length

  const tabs: { layar: LayarGame; label: string; badge?: number; terkunci?: boolean }[] = [
    { layar: 'meja', label: 'Meja Kerja', ...(suratBaru > 0 ? { badge: suratBaru } : {}) },
    { layar: 'klinik', label: 'Klinik', ...(state.klinik.antrian.length > 0 ? { badge: state.klinik.antrian.length } : {}) },
    { layar: 'peta', label: 'Peta Desa', ...(state.hari < HARI_BUKA_PETA ? { terkunci: true } : {}) },
    { layar: 'dex', label: 'Buku Saku' },
    { layar: 'rapor', label: 'Rapor' },
  ]

  return (
    <header className="hud kertas">
      <div className="hud__kiri">
        <div className="hud__hari mono">
          HARI <span className="hud__hari-angka">{state.hari}</span>
          <span className="hud__hari-total">/{HARI_STASE[state.mode]}</span>
        </div>
        <div className="hud__blok">
          <span className="chip chip--daun">{NAMA_BLOK[state.blok]}</span>
          <span className="chip">{NAMA_MUSIM[musim]}</span>
          {state.mode === 'ujian' && (
            <span className="chip chip--merah" title={`Mode Ujian — ${state.paketUjian ?? 'paket'}; skor terkunci di hari ${HARI_STASE.ujian}.`}>
              UJIAN
            </span>
          )}
          {/* CODEX audit UI/UX 2026-07-10 (#2): autosave dulu gagal sepenuhnya
              diam-diam (cuma console.error) — pemain tak pernah tahu progres
              berhenti tersimpan. */}
          {statusSimpan === 'gagal' && (
            <span
              className="chip chip--merah"
              role="status"
              title="Autosave terakhir gagal tersimpan — periksa ruang disk atau izin folder save. Progresmu di sesi ini masih aman di memori, tapi belum aman bila aplikasi ditutup."
            >
              ⚠ Gagal menyimpan
            </span>
          )}
        </div>
      </div>

      <nav className="hud__nav">
        {tabs.map((t) => (
          <button
            key={t.layar}
            className={`hud__tab ${state.layar === t.layar ? 'hud__tab--aktif' : ''} ${t.terkunci ? 'hud__tab--kunci' : ''}`}
            aria-current={state.layar === t.layar ? 'page' : undefined}
            onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: t.layar })}
            disabled={
              state.layar === 'kunjungan' ||
              Boolean(state.igd) ||
              Boolean(state.kegiatan) ||
              Boolean(state.klinik.aktif && t.layar !== 'klinik') ||
              // M10 Batch-2 (CODEX A.6): tab terkunci (Peta pra-hari-buka)
              // dulu hanya BERGAYA terkunci tapi tetap bisa diklik.
              Boolean(t.terkunci)
            }
            title={t.terkunci ? 'Terbuka besok' : undefined}
          >
            <span className="hud__tab-label">{t.label}</span>
            {t.badge !== undefined && <span className="hud__badge">{t.badge}</span>}
            {t.terkunci && <span className="hud__gembok">🔒</span>}
          </button>
        ))}
      </nav>

      <div className="hud__kanan">
        <div className="hud__stamina" title={`Stamina ${state.stamina}/6 — setiap pasien/kunjungan memakai stamina`}>
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={`hud__pip ${i < state.stamina ? 'hud__pip--isi' : ''}`} />
          ))}
        </div>
        <div className="hud__dana mono" title="Dana Puskesmas (kapitasi BPJS)">
          Rp {Math.round(state.kapitasi / 1000).toLocaleString('id-ID')}k
        </div>
        {/* M10.a (2026-07-06): mute+gigi DIDOK ke HUD — versi melayang pojok
            kiri-bawah menimpa & menelan klik konten layar (empiris: kartu Dex
            di Buku Saku, window minimum 1200×760). TitleScreen (tanpa HUD)
            tetap memakai versi melayang. */}
        <MuteButton dok />
        <Pengaturan dok />
      </div>
    </header>
  )
}
