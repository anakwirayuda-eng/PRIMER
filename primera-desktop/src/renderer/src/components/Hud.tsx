/**
 * HUD — bar atas: identitas hari, blok, musim, stamina pip, dana, navigasi layar.
 * Satu-satunya navigasi global. Ramping: 2 meter pemain saja (pilar anti-overload).
 */

import { useState } from 'react'
import { useGame } from '../store'
import { musimDariHari, type LayarGame } from '@engine/state'
import { HARI_BUKA_PETA } from '@engine/reducer'
import { HARI_STASE } from '@engine/paketUjian'
import { MuteButton } from '../audio/MuteButton'
import { Pengaturan } from './Pengaturan'
import { alasanTabNonaktif } from '../utils/navigasiHud'
import './Hud.css'

const NAMA_BLOK = { pagi: 'PAGI — Klinik', siang: 'SIANG — Lapangan', sore: 'SORE — Meja Kerja' } as const
const NAMA_MUSIM = { hujan: 'Musim Hujan', pancaroba: 'Pancaroba', kemarau: 'Kemarau' } as const

export function Hud() {
  const state = useGame((s) => s.state)
  const dispatch = useGame((s) => s.dispatch)
  const statusSimpan = useGame((s) => s.statusSimpan)
  // Audit UI/UX premium 2026-07-23: tooltip instan menggantikan `title` native
  // (delay ~1 dtk, tak muncul utk fokus keyboard, tak bisa distyle — terasa
  // "web", bukan game). Satu state utk seluruh HUD; posisi diambil dari rect
  // elemen pemicu saat hover/focus. aria-hidden: SR sudah dapat teks yang sama
  // via aria-describedby (tab) / aria-label (stamina, dana) — tanpa dobel.
  const [tip, setTip] = useState<{ teks: string; x: number; y: number } | null>(null)
  if (!state) return null

  const tampilkanTip = (el: HTMLElement, teks: string | undefined) => {
    if (teks === undefined) return
    const r = el.getBoundingClientRect()
    setTip({ teks, x: r.left + r.width / 2, y: r.bottom + 6 })
  }
  const sembunyikanTip = () => setTip(null)

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
            <span
              className="chip chip--merah"
              aria-label={`Mode Ujian — ${state.paketUjian ?? 'paket'}; skor terkunci di hari ${HARI_STASE.ujian}.`}
              onMouseEnter={(e) =>
                tampilkanTip(e.currentTarget, `Mode Ujian — ${state.paketUjian ?? 'paket'}; skor terkunci di hari ${HARI_STASE.ujian}.`)
              }
              onMouseLeave={sembunyikanTip}
            >
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
              aria-label="Gagal menyimpan — autosave terakhir gagal tersimpan; periksa ruang disk atau izin folder save. Progresmu di sesi ini masih aman di memori, tapi belum aman bila aplikasi ditutup."
              onMouseEnter={(e) =>
                tampilkanTip(
                  e.currentTarget,
                  'Autosave terakhir gagal tersimpan — periksa ruang disk atau izin folder save. Progresmu di sesi ini masih aman di memori, tapi belum aman bila aplikasi ditutup.',
                )
              }
              onMouseLeave={sembunyikanTip}
            >
              ⚠ Gagal menyimpan
            </span>
          )}
        </div>
      </div>

      <nav className="hud__nav">
        {tabs.map((t, i) => {
          // Audit UI/UX 2026-07-23: (a) nama-aksesibel tab dulu gabungan mentah
          // label+badge+gembok ("Meja Kerja2", "Peta Desa🔒") — SR membaca angka
          // menempel tanpa makna; badge kini aria-hidden & konteksnya masuk
          // aria-label ("2 surat baru" vs "2 pasien antre" — angka yang sama
          // berarti beda per tab). (b) Tab yang disabled saat ada sesi berjalan
          // dulu BISU — tanpa alasan, terasa "tombol mati". Tooltip kini
          // menjelaskan kenapa, pola sama dgn "+ Resep"/"Pesan" yang sudah ada.
          // Audit premium 2026-07-23: gate dipindah ke alasanTabNonaktif
          // (utils/navigasiHud) — dipakai juga hotkey 1-5 agar tak pernah drift.
          const keteranganBadge =
            t.badge === undefined
              ? ''
              : t.layar === 'meja'
                ? `, ${t.badge} surat baru`
                : `, ${t.badge} pasien antre`
          const alasanNonaktif = alasanTabNonaktif(state, t.layar)
          const nonaktif = alasanNonaktif !== undefined
          const idAlasan = `hud-tab-alasan-${t.layar}`
          const hotkey = String(i + 1)
          return (
            <button
              key={t.layar}
              className={`hud__tab ${state.layar === t.layar ? 'hud__tab--aktif' : ''} ${t.terkunci ? 'hud__tab--kunci' : ''}`}
              aria-current={state.layar === t.layar ? 'page' : undefined}
              aria-label={`${t.label}${keteranganBadge}${t.terkunci ? ' (terkunci, terbuka besok)' : ''}`}
              aria-disabled={nonaktif || undefined}
              aria-describedby={nonaktif ? idAlasan : undefined}
              aria-keyshortcuts={hotkey}
              onClick={() => {
                if (!nonaktif) dispatch({ type: 'PINDAH_LAYAR', layar: t.layar })
              }}
              onMouseEnter={(e) => tampilkanTip(e.currentTarget, alasanNonaktif)}
              onMouseLeave={sembunyikanTip}
              onFocus={(e) => tampilkanTip(e.currentTarget, alasanNonaktif)}
              onBlur={sembunyikanTip}
            >
              <kbd className="hud__kbd" aria-hidden="true">{hotkey}</kbd>
              <span className="hud__tab-label">{t.label}</span>
              {t.badge !== undefined && (
                <span className="hud__badge" aria-hidden="true">{t.badge}</span>
              )}
              {t.terkunci && <span className="hud__gembok" aria-hidden="true">🔒</span>}
              {nonaktif && (
                <span id={idAlasan} className="hud__tab-alasan">{alasanNonaktif}</span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="hud__kanan">
        <div
          className="hud__stamina"
          role="img"
          aria-label={`Stamina ${state.stamina} dari 6`}
          onMouseEnter={(e) =>
            tampilkanTip(e.currentTarget, `Stamina ${state.stamina}/6 — setiap pasien/kunjungan memakai stamina`)
          }
          onMouseLeave={sembunyikanTip}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={`hud__pip ${i < state.stamina ? 'hud__pip--isi' : ''}`} />
          ))}
        </div>
        <div
          className="hud__dana mono"
          aria-label={`Dana Puskesmas Rp ${Math.round(state.kapitasi / 1000).toLocaleString('id-ID')} ribu (kapitasi BPJS)`}
          onMouseEnter={(e) => tampilkanTip(e.currentTarget, 'Dana Puskesmas (kapitasi BPJS)')}
          onMouseLeave={sembunyikanTip}
        >
          Rp {Math.round(state.kapitasi / 1000).toLocaleString('id-ID')}k
        </div>
        {/* M10.a (2026-07-06): mute+gigi DIDOK ke HUD — versi melayang pojok
            kiri-bawah menimpa & menelan klik konten layar (empiris: kartu Dex
            di Buku Saku, window minimum 1200×760). TitleScreen (tanpa HUD)
            tetap memakai versi melayang. */}
        <MuteButton dok />
        <Pengaturan dok />
      </div>

      {/* Tooltip instan HUD — fixed di viewport (bukan absolute di dalam .hud
          yang overflow-x:auto & akan memotongnya), pointer-events:none agar
          tak pernah mencegat klik. */}
      {tip !== null && (
        <div className="hud__tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
          {tip.teks}
        </div>
      )}
    </header>
  )
}
