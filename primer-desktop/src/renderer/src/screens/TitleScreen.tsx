/**
 * TITLE SCREEN — gerbang masuk: fajar di atas Puskesmas Sukamaju.
 * PENTING: layar ini juga dirender saat state null — semua akses state nullable.
 * WOW pagi yang tenang: gradient fajar CSS + matahari lembut + siluet puskesmas SVG.
 */

import { useState, type FormEvent } from 'react'
import { useGame } from '../store'
import { METADATA } from '@content/metadata'
import './TitleScreen.css'

/** Tombol Keluar hanya relevan di jendela Electron (bukan preview browser). */
const DI_ELECTRON = typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron')

/** Siluet Desa Sukamaju saat fajar — bukit, pepohonan, gedung puskesmas. */
function SiluetPuskesmas() {
  return (
    <svg
      className="title__siluet"
      viewBox="0 0 1200 240"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {/* Bukit belakang — masih berkabut */}
      <path
        d="M0 190 Q 150 120 320 165 Q 470 200 640 150 Q 820 100 1000 160 Q 1110 195 1200 170 L 1200 240 L 0 240 Z"
        fill="var(--daun-800)"
        opacity="0.22"
      />
      {/* Bukit tengah */}
      <path
        d="M0 210 Q 200 160 400 195 Q 620 230 830 180 Q 1020 140 1200 200 L 1200 240 L 0 240 Z"
        fill="var(--daun-800)"
        opacity="0.45"
      />
      {/* Burung pagi */}
      <path d="M300 74 q 8 -8 16 0 q 8 -8 16 0" fill="none" stroke="var(--daun-900)" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      <path d="M356 92 q 6 -6 12 0 q 6 -6 12 0" fill="none" stroke="var(--daun-900)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* Tanah depan */}
      <path d="M0 226 Q 300 214 600 222 Q 900 230 1200 218 L 1200 240 L 0 240 Z" fill="var(--daun-900)" />

      {/* Pepohonan kiri */}
      <g fill="var(--daun-900)">
        <rect x="128" y="188" width="7" height="40" rx="2" />
        <ellipse cx="131" cy="168" rx="34" ry="30" />
        <rect x="212" y="200" width="6" height="30" rx="2" />
        <ellipse cx="215" cy="184" rx="24" ry="22" />
      </g>
      {/* Pepohonan kanan */}
      <g fill="var(--daun-900)">
        <rect x="1008" y="192" width="7" height="38" rx="2" />
        <ellipse cx="1011" cy="170" rx="32" ry="29" />
        <rect x="1090" y="204" width="6" height="26" rx="2" />
        <ellipse cx="1093" cy="190" rx="21" ry="19" />
      </g>

      {/* Gedung Puskesmas — siluet gelap, jendela mulai menyala */}
      <g>
        {/* Sayap kiri & kanan */}
        <rect x="452" y="164" width="90" height="64" fill="var(--daun-900)" />
        <rect x="658" y="164" width="90" height="64" fill="var(--daun-900)" />
        <polygon points="446,164 497,138 548,164" fill="var(--daun-900)" />
        <polygon points="652,164 703,138 754,164" fill="var(--daun-900)" />
        {/* Badan utama */}
        <rect x="524" y="140" width="152" height="88" fill="var(--daun-900)" />
        <polygon points="512,140 600,102 688,140" fill="var(--daun-900)" />
        {/* Kanopi pintu masuk */}
        <rect x="572" y="186" width="56" height="6" fill="var(--daun-900)" />
        <rect x="576" y="192" width="4" height="36" fill="var(--daun-900)" />
        <rect x="620" y="192" width="4" height="36" fill="var(--daun-900)" />
        {/* Pintu & jendela — cahaya pagi pertama */}
        <rect x="588" y="194" width="24" height="34" rx="2" fill="var(--kunyit-100)" opacity="0.85" />
        <rect x="540" y="156" width="16" height="14" rx="1" fill="var(--kunyit-100)" opacity="0.5" />
        <rect x="644" y="156" width="16" height="14" rx="1" fill="var(--kunyit-100)" opacity="0.5" />
        <rect x="468" y="180" width="14" height="12" rx="1" fill="var(--kunyit-100)" opacity="0.35" />
        <rect x="504" y="180" width="14" height="12" rx="1" fill="var(--kunyit-100)" opacity="0.35" />
        <rect x="682" y="180" width="14" height="12" rx="1" fill="var(--kunyit-100)" opacity="0.35" />
        <rect x="718" y="180" width="14" height="12" rx="1" fill="var(--kunyit-100)" opacity="0.35" />
        {/* Lambang kesehatan di atas pintu */}
        <circle cx="600" cy="124" r="11" fill="var(--kertas-050)" opacity="0.92" />
        <rect x="597.5" y="117" width="5" height="14" rx="1" fill="var(--daun-900)" />
        <rect x="593" y="121.5" width="14" height="5" rx="1" fill="var(--daun-900)" />
        {/* Tiang bendera */}
        <rect x="782" y="150" width="3" height="78" fill="var(--daun-900)" />
        <rect x="785" y="152" width="20" height="12" fill="var(--tinta-merah)" opacity="0.8" />
        <rect x="785" y="164" width="20" height="12" fill="var(--kertas-050)" opacity="0.9" />
      </g>
    </svg>
  )
}

export function TitleScreen() {
  // Autosave dimuat ke `arsip` TANPA masuk game — layar judul yang memutuskan.
  const arsip = useGame((s) => s.arsip)
  const sedangMemuat = useGame((s) => s.sedangMemuat)
  const mulaiGameBaru = useGame((s) => s.mulaiGameBaru)
  const lanjutkanArsip = useGame((s) => s.lanjutkanArsip)
  const [nama, setNama] = useState('')

  const namaBersih = nama.trim()

  const mulaiStase = (e: FormEvent) => {
    e.preventDefault()
    if (namaBersih.length === 0) return
    mulaiGameBaru(namaBersih)
  }

  return (
    <div className="title">
      {/* Matahari pagi — naik perlahan, cahaya lembut */}
      <div className="title__matahari" aria-hidden="true">
        <svg viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="130" fill="var(--kunyit-100)" opacity="0.55" />
          <circle cx="150" cy="150" r="88" fill="var(--kunyit-100)" opacity="0.7" />
          <circle cx="150" cy="150" r="52" fill="var(--kunyit-600)" opacity="0.82" />
        </svg>
      </div>

      <SiluetPuskesmas />

      <div className="title__panel kertas">
        <p className="title__kicker mono">KEMENTERIAN KESEHATAN · SIMULASI STASE IKM</p>
        <h1 className="title__judul">PRIMER</h1>
        <p className="title__sub mono">— PUSKESMAS PAGI —</p>
        <p className="title__tagline">
          Sembilan puluh hari menjadi dokter penanggung jawab Desa Sukamaju.
          Poli di pagi hari, keluarga binaan di siang hari, dan surat-surat yang
          tidak pernah habis.
        </p>

        {sedangMemuat ? (
          <p className="title__memuat teks-lembut">Membuka arsip stase…</p>
        ) : (
          <div className="title__aksi">
            {arsip !== null && (
              <button
                className="tombol tombol--utama tombol--besar title__lanjut"
                onClick={() => lanjutkanArsip()}
              >
                Lanjutkan — dr. {arsip.namaDokter} · Hari {arsip.hari}
              </button>
            )}

            <form className="title__form" onSubmit={mulaiStase}>
              <label className="title__label judul-seksi" htmlFor="title-nama">
                {arsip !== null ? 'Atau mulai stase baru' : 'Nama doktermu'}
              </label>
              <div className="title__form-baris">
                <span className="title__gelar mono">dr.</span>
                <input
                  id="title-nama"
                  className="title__input"
                  type="text"
                  value={nama}
                  maxLength={24}
                  autoFocus={arsip === null}
                  placeholder="tulis namamu di sini"
                  onChange={(e) => setNama(e.target.value)}
                />
                <button
                  type="submit"
                  className={`tombol tombol--besar ${arsip !== null ? '' : 'tombol--utama'}`}
                  disabled={namaBersih.length === 0}
                  title={
                    namaBersih.length === 0
                      ? 'Isi nama doktermu dulu'
                      : arsip !== null
                        ? 'Memulai stase baru akan menimpa arsip lama'
                        : 'Mulai Hari 1 di Puskesmas Sukamaju'
                  }
                >
                  Mulai Stase
                </button>
              </div>
              {arsip !== null && (
                <p className="title__peringatan teks-xs teks-lembut">
                  Stase baru menimpa arsip dr. {arsip.namaDokter} (Hari {arsip.hari}).
                </p>
              )}
            </form>

            {DI_ELECTRON && (
              <button
                className="tombol tombol--senyap title__keluar"
                onClick={() => window.close()}
              >
                Keluar
              </button>
            )}
          </div>
        )}
      </div>

      <div className="title__kredit mono">
        <p>{METADATA.copyright}</p>
        <p className="title__kredit-haki">
          Hak Cipta terdaftar Kemenkumham RI — Surat Pencatatan Ciptaan No.{' '}
          {METADATA.haki.nomorRegistrasi} ({METADATA.haki.tanggalRegistrasi}), Nomor Pencatatan{' '}
          {METADATA.haki.nomorPencatatan} · {METADATA.haki.dasarHukum} · {METADATA.organisasi}
        </p>
        <p className="title__kredit-disklaimer">{METADATA.disklaimerMedis}</p>
      </div>
    </div>
  )
}
