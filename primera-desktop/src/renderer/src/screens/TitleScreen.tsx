/**
 * TITLE SCREEN — gerbang masuk: fajar di atas Puskesmas Sukamaju.
 * PENTING: layar ini juga dirender saat state null — semua akses state nullable.
 * WOW pagi yang tenang: gradient fajar CSS + matahari lembut + siluet puskesmas SVG.
 */

import { useRef, useState, type FormEvent } from 'react'
import { useGame } from '../store'
import { useRadioGroup } from '../useRadioGroup'
import { METADATA } from '@content/metadata'
import type { ModeStase } from '@engine/state'
import { verifikasiDossier, type HasilVerifikasi } from '@engine/verifikasi'
import { serialize } from '@engine/save'
import { auditTelemetri } from '@engine/telemetriAudit'
import { PACK } from '@content/index'
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

/** CODEX M14 #24: batas ukuran impor — save/log wajar ≪ beberapa MB; berkas
 *  raksasa dibaca utuh ke memori tanpa guna & bisa jadi vektor DoS. */
const MAKS_UKURAN_IMPOR = 8_000_000

export function TitleScreen() {
  // Autosave dimuat ke `arsip` TANPA masuk game — layar judul yang memutuskan.
  const arsip = useGame((s) => s.arsip)
  const arsipKorup = useGame((s) => s.arsipKorup)
  const sedangMemuat = useGame((s) => s.sedangMemuat)
  const mulaiGameBaru = useGame((s) => s.mulaiGameBaru)
  const lanjutkanArsip = useGame((s) => s.lanjutkanArsip)
  const slots = useGame((s) => s.slots)
  const meta = useGame((s) => s.meta)
  const muatDariSlot = useGame((s) => s.muatDariSlot)
  const imporArsip = useGame((s) => s.imporArsip)
  const [nama, setNama] = useState('')
  // M4.5 — dua mode: Karier 90 hari (default, bebas nilai) vs Ujian 30 hari
  // (satu-satunya yang dinilai formal; paket kurikulum dirotasi otomatis).
  const [mode, setMode] = useState<ModeStase>('karier')
  // M10 §49: pola radiogroup benar (role=radio + aria-checked + roving tabindex
  // + navigasi panah) — dulu `<button aria-pressed>` di dalam radiogroup.
  const modeRadio = useRadioGroup<ModeStase>(['karier', 'ujian'], mode, setMode)
  // CODEX — NIM: identitas mengikat mode ujian (seed & verifier terikat NIM).
  const [nim, setNim] = useState('')
  // M6.27 — hasil verifikasi dossier mahasiswa (panel dosen).
  const [hasilVerifikasi, setHasilVerifikasi] = useState<HasilVerifikasi | null>(null)
  // Fix #8 (audit CODEX 2026-07-11): tanpa token, memilih dossier B sebelum
  // verifikasi dossier A selesai (baca file + hash + replay, tak instan) bisa
  // membuat hasil A yang telat resolve MENIMPA hasil B di layar — dosen
  // melihat vonis utk berkas yang salah. Token dibandingkan sebelum commit.
  const tokenVerifikasiRef = useRef(0)
  // DeepThink ronde-2 — telemetri wall-clock: sinyal forensik terpisah,
  // opsional, TIDAK memengaruhi status SAH/TIDAK SAH di atas.
  const [peringatanTelemetri, setPeringatanTelemetri] = useState<string[] | null>(null)
  // Fix #26b (audit CODEX 2026-07-11): teks nama-file bawaan browser pada
  // <input type="file"> ("No file chosen" dsb.) tak mengikuti bahasa
  // Indonesia app dan tak bisa distyle. Tampilkan nama file terpilih lewat
  // span sendiri (input aslinya disembunyikan visual, tetap fungsional &
  // fokus-keyboard via .title__file-input-tersembunyi).
  const [namaFileArsip, setNamaFileArsip] = useState<string | null>(null)
  const [namaFileDossier, setNamaFileDossier] = useState<string | null>(null)
  const [namaFileTelemetri, setNamaFileTelemetri] = useState<string | null>(null)
  const arsipRilisSesuai =
    arsip !== null && arsip.contentRelease === PACK.runtimeManifest.contentRelease

  const namaBersih = nama.trim()
  const nimBersih = nim.trim()
  // Mode ujian WAJIB NIM (identitas terikat); karier tidak.
  const bolehMulai = namaBersih.length > 0 && (mode !== 'ujian' || nimBersih.length > 0)

  const eksporArsipBedaRilis = () => {
    if (!arsip || arsipRilisSesuai) return
    const blob = new Blob([serialize(arsip)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const tautan = document.createElement('a')
    tautan.href = url
    const namaAman = arsip.namaDokter.replace(/[<>:"/\\|?*\x00-\x1f\s]+/g, '_')
    tautan.download = `primer_arsip_${namaAman}_H${arsip.hari}.json`
    tautan.click()
    URL.revokeObjectURL(url)
  }

  const mulaiStase = (e: FormEvent) => {
    e.preventDefault()
    if (!bolehMulai) return
    // CODEX audit UI/UX 2026-07-10 (#3): dulu langsung menimpa arsip lama
    // tanpa konfirmasi — salah klik atau Enter di input nama (form submit
    // standar HTML) cukup utk menghapus progres tersimpan.
    // CODEX audit UI/UX 2026-07-13 (P2): teks lama "akan menimpa arsip" ambigu
    // — bisa disalahartikan sebagai slot manual ikut tertimpa. Yang sebenarnya
    // diganti hanya Autosave Aktif (lihat store.ts `simpan()`/SLOT_AUTOSAVE);
    // slot 1/2/3 tak pernah disentuh operasi ini.
    if (arsip !== null && !window.confirm(`Mulai stase baru akan mengganti Autosave Aktif dr. ${arsip.namaDokter} (Hari ${arsip.hari}) — slot manual (1/2/3) tetap aman. Lanjutkan?`)) return
    // CODEX M14 #6: ada autosave TAPI tak terbaca (rusak/versi lama) — jangan
    // menimpanya diam-diam. Peringatkan sebelum menghapusnya.
    if (arsip === null && arsipKorup && !window.confirm('Ada autosave yang tidak bisa dibaca (mungkin rusak atau dari versi lama). Mulai stase baru akan menimpanya permanen. Lanjutkan?')) return
    mulaiGameBaru(namaBersih, mode, mode === 'ujian' ? nimBersih : undefined)
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
        <h1 className="title__judul">PRIMERA</h1>
        {/* Build lab/eksperimen — label test-beta supaya tak tertukar dgn
            instalasi lain; hapus label ini saat porting ke rilis produksi. */}
        <p className="title__sub mono">— PUSKESMAS PAGI · TEST-BETA —</p>
        {/* M10 Batch-2 (CODEX A.6): tagline mengikuti mode terpilih — dulu
            hardcoded "Sembilan puluh hari" walau Ujian·30 hari dipilih. */}
        <p className="title__tagline">
          {mode === 'ujian' ? 'Tiga puluh hari' : 'Sembilan puluh hari'} menjadi
          dokter penanggung jawab Desa Sukamaju. Poli di pagi hari, keluarga
          binaan di siang hari, dan surat-surat yang tidak pernah habis.
        </p>

        {sedangMemuat ? (
          <p className="title__memuat teks-lembut">Membuka arsip stase…</p>
        ) : (
          <div className="title__aksi">
            {arsip !== null && arsipRilisSesuai && (
              <button
                className="tombol tombol--utama tombol--besar title__lanjut"
                onClick={() => lanjutkanArsip()}
              >
                Lanjutkan — dr. {arsip.namaDokter} · Hari {arsip.hari}
              </button>
            )}

            {arsip !== null && !arsipRilisSesuai && (
              <div className="title__peringatan title__peringatan--kunyit teks-kecil" role="alert">
                <p>
                  Arsip dr. {arsip.namaDokter} berasal dari rilis {arsip.contentRelease} dan tidak dapat
                  dilanjutkan pada rilis {PACK.runtimeManifest.contentRelease}. Arsip tetap tersimpan sampai
                  kamu memilih memulai stase baru.
                </p>
                <button type="button" className="tombol" onClick={eksporArsipBedaRilis}>
                  Ekspor Arsip Lama
                </button>
              </div>
            )}

            {/* CODEX M14 #6: autosave ADA tapi tak terbaca — dulu tampak seperti
                "belum pernah main", pemain bisa mulai baru & menimpanya diam2. */}
            {arsip === null && arsipKorup && (
              <p className="title__peringatan title__peringatan--kunyit teks-kecil" role="alert">
                ⚠ Ada penyimpanan otomatis yang tidak bisa dibaca (mungkin rusak atau dari versi lama). Memulai stase baru akan menimpanya.
              </p>
            )}

            <form className="title__form" onSubmit={mulaiStase}>
              <label className="title__label judul-seksi" htmlFor="title-nama">
                {arsip !== null ? 'Atau mulai stase baru' : 'Nama doktermu'}
              </label>
              {/* M4.5 — pemilih mode stase */}
              <div className="title__form-baris" {...modeRadio.groupProps} aria-label="Mode stase">
                <button
                  type="button"
                  className={`tombol ${mode === 'karier' ? 'tombol--utama' : ''}`}
                  {...modeRadio.radioProps('karier')}
                  title="90 hari penuh — bebas nilai, semua fitur, progres santai."
                  onClick={() => setMode('karier')}
                >
                  Karier · 90 hari
                </button>
                <button
                  type="button"
                  className={`tombol ${mode === 'ujian' ? 'tombol--utama' : ''}`}
                  {...modeRadio.radioProps('ujian')}
                  title="30 hari — skor terkunci di akhir untuk disetor ke dosen. Paket soal dirotasi otomatis."
                  onClick={() => setMode('ujian')}
                >
                  Ujian · 30 hari
                </button>
              </div>
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
                  disabled={!bolehMulai}
                  title={
                    namaBersih.length === 0
                      ? 'Isi nama doktermu dulu'
                      : mode === 'ujian' && nimBersih.length === 0
                        ? 'Isi NIM-mu dulu (identitas ujian)'
                        : arsip !== null
                          ? 'Memulai stase baru akan mengganti Autosave Aktif (slot manual tetap aman)'
                          : 'Mulai Hari 1 di Puskesmas Sukamaju'
                  }
                >
                  Mulai Stase
                </button>
              </div>
              {/* Mode ujian: NIM mengikat identitas — paket & verifikasi terkunci
                  ke NIM ini, tak bisa ditukar nama teman. */}
              {mode === 'ujian' && (
                <div className="title__form-baris">
                  <span className="title__gelar mono">NIM</span>
                  <input
                    id="title-nim"
                    className="title__input"
                    type="text"
                    value={nim}
                    maxLength={20}
                    placeholder="nomor induk mahasiswa"
                    onChange={(e) => setNim(e.target.value)}
                  />
                </div>
              )}
              {arsip !== null && (
                <p className="title__peringatan teks-xs teks-lembut">
                  Stase baru mengganti Autosave Aktif dr. {arsip.namaDokter} (Hari {arsip.hari}) — slot manual tetap aman.
                </p>
              )}
            </form>

            {/* M5.25 — slot manual + impor arsip; M5.24 — jejak lintas-playthrough. */}
            {(slots.length > 0 || meta !== null) && (
              <div className="title__arsip">
                {slots.map((info) => (
                  <button
                    key={info.slot}
                    className="tombol title__slot"
                    disabled={!info.compatible}
                    onClick={() => {
                      // CODEX M14 #4: memuat slot mengganti sesi & menimpa
                      // autosave — jalur ke-4 yang dulu terlewat dari konfirmasi
                      // timpa (mulai-baru/impor sudah dibentengi). Peringatkan
                      // bila ada arsip belum-dimasuki yang akan tertimpa.
                      // CODEX audit UI/UX 2026-07-13 (P2): teks lama tak
                      // membedakan slot TUJUAN (yg dimuat, tak tersentuh) dari
                      // Autosave Aktif (yg sebenarnya diganti) — pemain bisa
                      // salah kira slot itu sendiri ikut tertimpa.
                      if (arsip !== null && !window.confirm(`Memuat ${info.slot.replace('slot', 'Slot ')} akan mengganti Autosave Aktif dr. ${arsip.namaDokter} (Hari ${arsip.hari}) — isi Slot 1/2/3 tetap aman. Lanjutkan?`)) return
                      void muatDariSlot(info.slot).then((ok) => {
                        if (!ok) window.alert('Gagal memuat arsip — file rusak, tidak ditemukan, atau dari versi yang tak dikenal.')
                      })
                    }}
                    title={
                      info.compatible
                        ? `Muat arsip ${info.slot}.`
                        : `Arsip ${info.slot} berasal dari rilis ${info.contentRelease} dan hanya dapat dibuka dengan build yang sama.`
                    }
                  >
                    📁 {info.slot.replace('slot', 'Slot ')}: dr. {info.namaDokter} · H{info.hari}
                    {info.mode === 'ujian' ? ' · UJIAN' : ''}
                    {info.tamat ? ' · tamat' : ''}
                    {!info.compatible ? ' · rilis lama' : ''}
                  </button>
                ))}
                {meta !== null && (
                  <p className="teks-xs teks-lembut">
                    🏅 {meta.badges.length}/9 badge · {Object.values(meta.dexKuasai).filter((b) => b >= 3).length} penyakit
                    dikuasai · {meta.playthroughs} stase tuntas
                  </p>
                )}
              </div>
            )}
            <label className="teks-xs teks-lembut title__impor">
              Impor arsip JSON:{' '}
              <span className="title__file-tampil">{namaFileArsip ?? 'Belum ada berkas dipilih'}</span>
              <input
                type="file"
                className="title__file-input-tersembunyi"
                accept="application/json"
                onChange={(e) => {
                  const input = e.target
                  const f = input.files?.[0]
                  if (!f) return
                  setNamaFileArsip(f.name)
                  // CODEX M14 #24: tolak berkas raksasa sebelum dibaca ke memori.
                  if (f.size > MAKS_UKURAN_IMPOR) {
                    window.alert('Berkas terlalu besar — bukan arsip stase yang wajar.')
                    input.value = ''
                    return
                  }
                  // CODEX audit UI/UX 2026-07-10 (#3): impor JSON menimpa
                  // autosave seketika (imporArsip -> simpan()) tanpa jeda —
                  // salah pilih file cukup utk menghapus progres tersimpan.
                  if (
                    arsip !== null &&
                    !window.confirm(`Mengimpor arsip akan mengganti Autosave Aktif dr. ${arsip.namaDokter} (Hari ${arsip.hari}) — slot manual (1/2/3) tetap aman. Lanjutkan?`)
                  ) {
                    input.value = ''
                    return
                  }
                  void f
                    .text()
                    .then((json) => {
                      if (!imporArsip(json)) window.alert('Arsip tidak valid atau berasal dari rilis konten yang berbeda.')
                    })
                    .catch(() => window.alert('Gagal membaca file arsip.'))
                    // CODEX M14 #24: reset value SELALU (juga saat gagal) agar
                    // memilih file yang sama lagi tetap memicu change.
                    .finally(() => {
                      input.value = ''
                    })
                }}
              />
            </label>

            {/* Batch-7: alat dosen dilipat — default tertutup, mahasiswa tak
                perlu melihatnya; jsdom tidak menyembunyikan isi <details>,
                test getByLabelText tetap jalan. */}
            <details className="title__alat-dosen">
            <summary className="judul-seksi">Alat Dosen — verifikasi &amp; telemetri</summary>
            {/* M6.27 — verifikasi dossier mahasiswa (untuk dosen, offline). */}
            <label className="teks-xs teks-lembut title__impor">
              Verifikasi Dossier — untuk dosen:{' '}
              <span className="title__file-tampil">{namaFileDossier ?? 'Belum ada berkas dipilih'}</span>
              <input
                type="file"
                className="title__file-input-tersembunyi"
                accept="application/json"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  setNamaFileDossier(f.name)
                  e.target.value = ''
                  if (f.size > MAKS_UKURAN_IMPOR) {
                    window.alert('Berkas dossier terlalu besar — bukan dossier stase yang wajar.')
                    return
                  }
                  // Fix #8: token unik per pemilihan file + bersihkan hasil lama
                  // SEKARANG (bukan tunggu hasil baru) — mencegah vonis berkas
                  // sebelumnya nyangkut di layar selama verifikasi berjalan.
                  const token = ++tokenVerifikasiRef.current
                  setHasilVerifikasi(null)
                  void f
                    .text()
                    .then(async (json) => {
                      const versiApp = await window.primer.appVersion()
                      const hasil = await verifikasiDossier(json, PACK, versiApp)
                      // Hasil verifikasi lain (dossier dipilih ulang) sudah menyusul —
                      // jangan timpa dgn hasil telat ini (fix #8).
                      if (tokenVerifikasiRef.current !== token) return
                      setHasilVerifikasi(hasil)
                    })
                    .catch(() => {
                      if (tokenVerifikasiRef.current !== token) return
                      window.alert('Gagal membaca file dossier.')
                    })
                }}
              />
            </label>

            {/* Fix #27 (audit CODEX 2026-07-11): pemisah visual antar dua alat
                dosen yang tadinya menempel tanpa jeda (Verifikasi Dossier vs
                Impor Telemetri) — mudah tertukar krn keduanya sama-sama
                <label> teks-xs beruntun. */}
            <hr className="title__impor-pisah" />

            {/* DeepThink ronde-2 — telemetri wall-clock: sinyal forensik
                OPSIONAL, terpisah dari vonis SAH/TIDAK SAH di atas. */}
            <label className="teks-xs teks-lembut title__impor">
              Impor Log Telemetri (opsional, deteksi save-scumming):{' '}
              <span className="title__file-tampil">{namaFileTelemetri ?? 'Belum ada berkas dipilih'}</span>
              <input
                type="file"
                className="title__file-input-tersembunyi"
                accept="application/jsonl,text/plain,.jsonl"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  setNamaFileTelemetri(f.name)
                  e.target.value = ''
                  if (f.size > MAKS_UKURAN_IMPOR) {
                    window.alert('Berkas log telemetri terlalu besar.')
                    return
                  }
                  void f
                    .text()
                    .then((isi) => {
                      const baris = isi.split('\n').filter((b) => b.trim().length > 0)
                      setPeringatanTelemetri(auditTelemetri(baris))
                    })
                    .catch(() => window.alert('Gagal membaca file log telemetri.'))
                }}
              />
            </label>
            {peringatanTelemetri !== null && (
              <div className="kartu title__verifikasi" role="status">
                <div className="baris baris--antara">
                  <span className={`stempel ${peringatanTelemetri.length > 0 ? 'stempel--kunyit' : 'stempel--hijau'}`}>
                    {peringatanTelemetri.length > 0 ? 'TELEMETRI: MENCURIGAKAN' : 'TELEMETRI: BERSIH'}
                  </span>
                  <button className="tombol tombol--senyap" onClick={() => setPeringatanTelemetri(null)}>
                    Tutup
                  </button>
                </div>
                {peringatanTelemetri.length > 0 ? (
                  <ul className="title__verifikasi-alasan teks-xs">
                    {peringatanTelemetri.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="teks-xs teks-lembut">
                    Tak ada pola hari-mundur atau jurnal-menyusut di log ini — bukan bukti mutlak, hanya sinyal tambahan.
                  </p>
                )}
              </div>
            )}
            {hasilVerifikasi !== null && (
              <div className="kartu title__verifikasi" role="status">
                <div className="baris baris--antara">
                  <span
                    className={`stempel ${
                      hasilVerifikasi.status === 'sah'
                        ? 'stempel--hijau'
                        : hasilVerifikasi.status === 'tidak_sah'
                          ? 'stempel--merah'
                          : 'stempel--kunyit'
                    }`}
                  >
                    {hasilVerifikasi.status === 'sah'
                      ? 'SAH'
                      : hasilVerifikasi.status === 'tidak_sah'
                        ? 'TIDAK SAH'
                        : 'TAK DAPAT DIVERIFIKASI'}
                  </span>
                  <button className="tombol tombol--senyap" onClick={() => setHasilVerifikasi(null)}>
                    Tutup
                  </button>
                </div>
                {hasilVerifikasi.ringkasan && (
                  <p className="teks-xs">
                    dr. {hasilVerifikasi.ringkasan.namaDokter}
                    {hasilVerifikasi.ringkasan.nim ? ` (NIM ${hasilVerifikasi.ringkasan.nim})` : ''} ·{' '}
                    {hasilVerifikasi.ringkasan.mode.toUpperCase()}
                    {hasilVerifikasi.ringkasan.paketUjian ? ` ${hasilVerifikasi.ringkasan.paketUjian}` : ''} · Hari{' '}
                    {hasilVerifikasi.ringkasan.hari}
                    {hasilVerifikasi.ringkasan.tamat ? ' · TAMAT' : ' · belum tamat'} · seed{' '}
                    <span className="mono">{hasilVerifikasi.ringkasan.seed}</span>
                    <br />
                    Klaim: <strong>{hasilVerifikasi.ringkasan.skorKlaim.total} ({hasilVerifikasi.ringkasan.skorKlaim.grade})</strong>
                    {hasilVerifikasi.ringkasan.skorReplay && (
                      <>
                        {' '}· Replay:{' '}
                        <strong>
                          {hasilVerifikasi.ringkasan.skorReplay.total} ({hasilVerifikasi.ringkasan.skorReplay.grade})
                        </strong>
                      </>
                    )}
                  </p>
                )}
                {hasilVerifikasi.alasan.length > 0 && (
                  <ul className="title__verifikasi-alasan teks-xs">
                    {hasilVerifikasi.alasan.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            </details>

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
