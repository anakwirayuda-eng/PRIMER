/**
 * HUD — bar atas: identitas hari, blok, musim, stamina pip, dana, navigasi layar.
 * Satu-satunya navigasi global. Ramping: 2 meter pemain saja (pilar anti-overload).
 */

import { useGame } from '../store'
import { musimDariHari, type LayarGame } from '@engine/state'
import { HARI_BUKA_PETA, STAMINA_MAKS } from '@engine/reducer'
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
  // Tooltip HUD kini menumpang TooltipInstan global via data-tip (hover DAN
  // fokus keyboard) — state machine lokal + CSS .hud__tip yang duplikat
  // byte-per-byte dihapus. SR tetap dapat teks via aria-label/aria-describedby.
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
            <span
              className="chip chip--merah"
              aria-label={`Mode Ujian — ${state.paketUjian ?? 'paket'}; skor terkunci di hari ${HARI_STASE.ujian}.`}
              data-tip={`Mode Ujian — ${state.paketUjian ?? 'paket'}; skor terkunci di hari ${HARI_STASE.ujian}.`}
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
              data-tip="Autosave terakhir gagal tersimpan — periksa ruang disk atau izin folder save. Progresmu di sesi ini masih aman di memori, tapi belum aman bila aplikasi ditutup."
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
              data-tip={alasanNonaktif}
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
        {/* Audit logika 2026-07-23: bonus olahraga SENGAJA menembus maks
            (stamina 7 dikunci m4ekonomi.test:291 — satu pasien ekstra), tapi
            HUD dulu hardcode 6 pip: pip ke-7 tak pernah terlihat & label
            "7/6" membingungkan. Kini pip bonus dirender beda gaya. */}
        <div
          className="hud__stamina"
          role="img"
          aria-label={`Stamina ${state.stamina} dari ${STAMINA_MAKS}${state.stamina > STAMINA_MAKS ? ' (bonus olahraga)' : ''}`}
          data-tip={`Stamina ${state.stamina}/${STAMINA_MAKS}${state.stamina > STAMINA_MAKS ? ' — pip emas = tenaga ekstra hasil olahraga kemarin' : ' — setiap pasien/kunjungan memakai stamina'}`}
        >
          {Array.from({ length: Math.max(STAMINA_MAKS, state.stamina) }, (_, i) => (
            <span
              key={i}
              className={`hud__pip ${i < state.stamina ? 'hud__pip--isi' : ''}${i >= STAMINA_MAKS ? ' hud__pip--bonus' : ''}`}
            />
          ))}
        </div>
        {/* S3 burnout-rapor (a): burnout dulu meter tersembunyi — efeknya
            (stamina pagi terpotong, insting menumpul) terasa tanpa pernah
            terlihat. Ambang warna = ambang mekanis hariBaru (reducer.ts):
            <40 tenang, 40-69 kunyit (waspada), >=70 merah (bahaya). */}
        <span
          className={`chip hud__burnout${state.burnout >= 70 ? ' chip--merah' : state.burnout >= 40 ? ' chip--kunyit' : ''}`}
          role="img"
          aria-label={`Burnout ${Math.round(state.burnout)} dari 100${state.burnout >= 70 ? ' — bahaya' : state.burnout >= 40 ? ' — waspada' : ''}`}
          data-tip={`Burnout ${Math.round(state.burnout)}/100 — naik bila hari berakhir dengan stamina habis, turun bila tidur masih bersisa tenaga. Mulai 40: stamina pagi berkurang 1; mulai 70: berkurang 2 — dan makin tinggi burnout, makin sering pasien antrean yang diserahkan ke insting ternyata bermasalah. Pulihkan lewat slot pemulihan akhir pekan (tiap hari ke-7).`}
        >
          <span aria-hidden="true">🔥</span>
          <span>{Math.round(state.burnout)}</span>
        </span>
        <div
          className="hud__dana mono"
          aria-label={`Dana Puskesmas Rp ${Math.round(state.kapitasi / 1000).toLocaleString('id-ID')} ribu (kapitasi BPJS)`}
          data-tip="Dana Puskesmas (kapitasi BPJS)"
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

    </header>
  )
}
