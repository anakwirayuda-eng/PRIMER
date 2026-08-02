/**
 * PENGATURAN (M7 butir 31) — tombol gigi melayang + modal preferensi:
 * volume musik & SFX terpisah, ukuran teks, mode gelap (auto/siang/malam),
 * reduksi gerak. Semua tersimpan di settings.ts (persist localStorage) dan
 * berlaku live. Tombol "Tentang" membuka modal kredit/HKI (butir 35).
 */

import { useEffect, useState } from 'react'
import { setPengaturan, PENGATURAN_DEFAULT, type ModeMalam } from '../settings'
import { usePengaturan } from '../usePengaturan'
import { unduhLaporanDiagnostik } from '../diagnostik'
import { useGame } from '../store'
import { useFocusTrap } from '../useFocusTrap'
import { useRadioGroup } from '../useRadioGroup'
import { resetOnboarding } from './Onboarding'
import { TentangModal } from './TentangModal'
import { PintasanModal } from './PintasanModal'
import { sedangMengetik } from '../utils/navigasiHud'
import './Pengaturan.css'

const MODE_URUT: ModeMalam[] = ['auto', 'siang', 'malam']

const MODE_LABEL: Record<ModeMalam, string> = {
  auto: 'Otomatis',
  siang: 'Terang',
  malam: 'Gelap',
}

// M10.a (2026-07-06): prop `dok` — gigi in-flow di bilah HUD, bukan melayang
// (versi melayang menimpa & menelan klik konten kiri-bawah, mis. kartu Dex).
// Default tetap melayang utk TitleScreen yang tanpa HUD.
export function Pengaturan({ dok = false }: { dok?: boolean } = {}) {
  const [buka, setBuka] = useState(false)
  const [tentang, setTentang] = useState(false)
  // Audit premium 2026-07-23: modal daftar pintasan keyboard — dibuka dari
  // tombol di modal ini ATAU hotkey "?" global (di luar ketikan/dialog).
  const [pintasan, setPintasan] = useState(false)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== '?' || e.ctrlKey || e.altKey || e.metaKey) return
      if (sedangMengetik(document.activeElement)) return
      if (document.querySelector('[role="dialog"]') !== null) return
      e.preventDefault()
      setPintasan(true)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  const p = usePengaturan()
  const persen = (n: number) => `${Math.round(n * 100)}%`
  // A8 telemetri (2026-08-02): umpan balik + Laporan Diagnostik — kanal
  // pelaporan in-app pertama (dulu mahasiswa harus lapor lewat luar tanpa
  // ada data teknis apa pun yang menyertainya).
  const [umpanBalik, setUmpanBalik] = useState('')
  const [statusLaporan, setStatusLaporan] = useState<'idle' | 'sukses' | 'gagal'>('idle')
  const stateGame = useGame((s) => s.state)
  // CODEX M10.a ronde-4 (dossier §44): trap NONAKTIF saat `tentang` terbuka —
  // TentangModal (di atasnya, DOM-order sama z-modal) yang wajib pegang fokus
  // saat itu; dua trap aktif bersamaan akan rebutan ke mana Tab dibungkus.
  // Pintasan mengikuti aturan yang sama (modal di atas modal Pengaturan).
  const ref = useFocusTrap<HTMLDivElement>(buka && !tentang && !pintasan, () => setBuka(false))
  // M10 §49: radiogroup mode tampilan — role=radio + aria-checked + panah.
  const modeRadio = useRadioGroup<ModeMalam>(MODE_URUT, p.modeMalam, (m) => setPengaturan({ modeMalam: m }))

  return (
    <>
      <button
        type="button"
        className={`set-gigi${dok ? ' set-gigi--dok' : ''}`}
        onClick={() => setBuka(true)}
        aria-label="Buka Pengaturan"
        data-tip="Pengaturan"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {buka && (
        <div className="overlay set-overlay" onClick={() => setBuka(false)}>
          <div ref={ref} className="set-modal kertas" role="dialog" aria-modal="true" aria-label="Pengaturan" onClick={(e) => e.stopPropagation()}>
            <div className="baris baris--antara">
              <h2 className="judul-seksi">Pengaturan</h2>
              <button className="tombol tombol--senyap" onClick={() => setBuka(false)} aria-label="Tutup">✕</button>
            </div>

            <label className="set-baris">
              <span>Volume Musik</span>
              <input type="range" min="0" max="1" step="0.05" value={p.volumeMusik}
                onChange={(e) => setPengaturan({ volumeMusik: Number(e.target.value) })} />
              <span className="set-nilai mono">{persen(p.volumeMusik)}</span>
            </label>

            <label className="set-baris">
              <span>Volume Efek Suara</span>
              <input type="range" min="0" max="1" step="0.05" value={p.volumeSfx}
                onChange={(e) => setPengaturan({ volumeSfx: Number(e.target.value) })} />
              <span className="set-nilai mono">{persen(p.volumeSfx)}</span>
            </label>

            <label className="set-baris">
              <span>Ukuran Teks</span>
              <input type="range" min="0.9" max="2" step="0.05" value={p.ukuranTeks}
                onChange={(e) => setPengaturan({ ukuranTeks: Number(e.target.value) })} />
              <span className="set-nilai mono">{persen(p.ukuranTeks)}</span>
            </label>

            <div className="set-baris">
              <span>Mode Tampilan</span>
              <div className="set-segmen" {...modeRadio.groupProps} aria-label="Mode tampilan">
                {MODE_URUT.map((m) => (
                  <button key={m} type="button"
                    className={`tombol ${p.modeMalam === m ? 'tombol--utama' : ''}`}
                    {...modeRadio.radioProps(m)}
                    onClick={() => setPengaturan({ modeMalam: m })}>
                    {MODE_LABEL[m]}
                  </button>
                ))}
              </div>
            </div>

            <label className="set-baris set-baris--switch">
              <span>Kurangi Gerak/Animasi</span>
              <input type="checkbox" checked={p.kurangiGerak}
                onChange={(e) => setPengaturan({ kurangiGerak: e.target.checked })} />
            </label>

            <label
              className="set-baris set-baris--switch"
              data-tip="Peta desa memakai biru (bukan hijau) untuk RW sehat — hijau vs merah sulit dibedakan pada buta warna merah-hijau."
            >
              <span>Warna Peta Aman Buta Warna</span>
              <input type="checkbox" checked={p.amanButaWarna}
                onChange={(e) => setPengaturan({ amanButaWarna: e.target.checked })} />
            </label>

            {/* Musik latar generatif (2026-08-02). Default MATI atas dasar
                riset audio-lab: 30 mesin memutar ambient beda-fase menaikkan
                derau ruangan ~15 dB. Label headphone bukan basa-basi. */}
            <label
              className="set-baris set-baris--switch"
              data-tip="Musik latar yang dibangkitkan aplikasi (tanpa berkas musik). Sangat pelan dan tak pernah berulang persis. Disarankan memakai headphone bila kamu bermain di ruang bersama."
            >
              <span>Musik Latar <small className="teks-lembut">(disarankan pakai headphone)</small></span>
              <input type="checkbox" checked={p.musikAktif}
                onChange={(e) => setPengaturan({ musikAktif: e.target.checked })} />
            </label>

            {/* A7 distribusi (2026-08-02): OPT-IN, default mati — aplikasi ini
                sengaja luring; satu-satunya koneksi keluar harus dinyalakan
                sadar. Alasannya bukan kenyamanan tapi keadilan penilaian:
                dossier lintas-versi tak dapat diverifikasi dosen. */}
            <label
              className="set-baris set-baris--switch"
              data-tip="Saat aplikasi dibuka, periksa apakah ada versi lebih baru di halaman rilis. Tidak mengirim data apa pun — hanya membaca daftar rilis publik, maksimal sekali per 12 jam."
            >
              <span>Periksa Pembaruan Saat Dibuka</span>
              <input type="checkbox" checked={p.cekPembaruan}
                onChange={(e) => setPengaturan({ cekPembaruan: e.target.checked })} />
            </label>

            {/* -- Bantuan & Laporan (A8, 2026-08-02) ---------------------- */}
            <div className="set-lapor">
              <h3 className="judul-seksi">Menemukan Masalah?</h3>
              <p className="teks-xs teks-lembut">
                Ceritakan yang terjadi (opsional), lalu simpan Laporan Diagnostik —
                berkas berisi versi aplikasi, pengaturan, dan catatan gangguan teknis
                (tanpa isi permainanmu) — dan kirimkan ke dosen/pengembang.
              </p>
              <textarea
                className="set-lapor__teks"
                value={umpanBalik}
                onChange={(e) => setUmpanBalik(e.target.value)}
                placeholder="Apa yang kamu lakukan saat masalah muncul? Apa yang kamu harapkan terjadi?"
                rows={3}
                maxLength={4000}
                aria-label="Teks umpan balik untuk laporan diagnostik"
              />
              <div className="baris baris--antara">
                <button
                  className="tombol"
                  onClick={() => {
                    unduhLaporanDiagnostik(
                      umpanBalik,
                      stateGame
                        ? { hari: stateGame.hari, blok: stateGame.blok, mode: stateGame.mode, layar: stateGame.layar }
                        : null,
                    )
                      .then(() => setStatusLaporan('sukses'))
                      .catch(() => setStatusLaporan('gagal'))
                  }}
                >
                  Simpan Laporan Diagnostik
                </button>
                {statusLaporan !== 'idle' && (
                  <span className={`teks-xs ${statusLaporan === 'gagal' ? 'set-lapor__gagal' : 'teks-lembut'}`} role="status">
                    {statusLaporan === 'sukses'
                      ? 'Tersimpan — cek folder Unduhan/Downloads.'
                      : 'Gagal menyusun laporan — coba lagi.'}
                  </span>
                )}
              </div>
            </div>

            <div className="baris baris--antara set-kaki">
              <button className="tombol tombol--senyap" onClick={() => setPengaturan({ ...PENGATURAN_DEFAULT })}>
                Kembalikan Pengaturan Awal
              </button>
              <div className="baris">
                {/* CODEX M14 #13: reset localStorage (agar sesi berikutnya juga
                    lihat) DAN pancarkan event global agar App menampilkan
                    Onboarding SEKETIKA, melewati gerbang hari===1/pagi — tombol
                    ini dulu tak berefek dalam sesi berjalan/pasca Hari 1. */}
                <button
                  className="tombol tombol--senyap"
                  onClick={() => {
                    resetOnboarding()
                    window.dispatchEvent(new CustomEvent('primer-onboarding-replay'))
                    setBuka(false)
                  }}
                >
                  Tampilkan panduan lagi
                </button>
                <button className="tombol" onClick={() => setPintasan(true)}>
                  Pintasan Keyboard
                </button>
                <button className="tombol" onClick={() => setTentang(true)}>Tentang &amp; Kredit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tentang && <TentangModal onTutup={() => setTentang(false)} />}
      {pintasan && <PintasanModal onTutup={() => setPintasan(false)} />}
    </>
  )
}
