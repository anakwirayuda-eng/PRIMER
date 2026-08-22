/**
 * TITLE SCREEN — gerbang masuk: fajar di atas Puskesmas Sukamaju.
 * PENTING: layar ini juga dirender saat state null — semua akses state nullable.
 * WOW pagi yang tenang: gradient fajar CSS + matahari lembut + siluet puskesmas SVG.
 */

import { useRef, useState, type FormEvent } from 'react'
import { useGame } from '../store'
import { useRadioGroup } from '../useRadioGroup'
import { useMotionDikurangi } from '../useMotionDikurangi'
import { DialogGame } from '../components/DialogGame'
import { METADATA } from '@content/metadata'
import type { ModeStase } from '@engine/state'
import { verifikasiDossier, type HasilVerifikasi } from '@engine/verifikasi'
import { serialize } from '@engine/save'
import { auditTelemetri } from '@engine/telemetriAudit'
import { PACK } from '@content/index'
import './TitleScreen.css'

/** Tombol Keluar hanya relevan di jendela Electron (bukan preview browser). */
const DI_ELECTRON = typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron')

/* ---------------------------------------------------------------------------
 * SCENE "MAP STASE SAAT FAJAR" (rombak 2026-08-22, panel desain 3-arah + juri):
 * pemandangan dipecah 3 lapis SVG (jauh/tengah/depan) supaya parallax punya
 * kedalaman per-lapis dan entrance bisa di-stagger. Gedung Puskesmas lama
 * TIDAK digambar ulang — hanya dibungkus <g transform> ke titik fokal ±68%
 * lebar layar (sejajar matahari), karena panel kini map di kolom kiri.
 * Semua warna token; jendela diberi kelas utk koreografi "menyala satu-satu".
 * ------------------------------------------------------------------------- */

/** Lapis JAUH: bukit berkabut + bintang (hanya tampil mode malam). */
function SiluetJauh() {
  return (
    <svg
      className="title__siluet title__siluet--jauh"
      viewBox="0 0 1200 260"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="title-kabut-blur" x="-40%" y="-200%" width="180%" height="500%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      {/* Bintang subuh — display:none di siang, muncul + berkelip di malam */}
      <g className="title__bintang" fill="var(--kertas-050)">
        <circle cx="90" cy="26" r="1.4" />
        <circle cx="205" cy="58" r="1.2" />
        <circle cx="330" cy="18" r="1.7" />
        <circle cx="455" cy="44" r="1.2" />
        <circle cx="570" cy="14" r="1.5" />
        <circle cx="700" cy="52" r="1.3" />
        <circle cx="836" cy="24" r="1.8" />
        <circle cx="948" cy="60" r="1.2" />
        <circle cx="1064" cy="30" r="1.5" />
        <circle cx="1150" cy="66" r="1.3" />
      </g>
      <path
        d="M0 200 Q 180 120 380 165 Q 560 205 760 150 Q 940 105 1200 175 L 1200 260 L 0 260 Z"
        fill="var(--daun-800)"
        opacity="0.16"
      />
      {/* Pita kabut pagi — menguap perlahan saat entrance */}
      <g fill="var(--kertas-050)" filter="url(#title-kabut-blur)">
        <ellipse className="kabut" cx="300" cy="192" rx="150" ry="16" />
        <ellipse className="kabut" cx="660" cy="206" rx="185" ry="18" />
        <ellipse className="kabut" cx="960" cy="194" rx="125" ry="14" />
      </g>
    </svg>
  )
}

/** Lapis TENGAH: bukit + terasering sawah + rumah desa + asap dapur. */
function SiluetTengah() {
  return (
    <svg
      className="title__siluet title__siluet--tengah"
      viewBox="0 0 1200 260"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <path
        d="M0 215 Q 220 158 430 195 Q 650 232 860 180 Q 1030 142 1200 205 L 1200 260 L 0 260 Z"
        fill="var(--daun-800)"
        opacity="0.42"
      />
      {/* Terasering sawah di lereng kiri — garis kontur khas desa Indonesia */}
      <g fill="none" stroke="var(--daun-100)" strokeWidth="1.5" opacity="0.28" strokeLinecap="round">
        <path d="M46 206 Q 170 188 306 198" />
        <path d="M26 219 Q 186 200 344 211" />
        <path d="M62 232 Q 206 215 366 224" />
      </g>
      {/* Dua rumah desa, satu jendela menyala */}
      <g fill="var(--daun-800)" opacity="0.85">
        <rect x="150" y="198" width="30" height="20" />
        <polygon points="146,198 165,186 184,198" />
        <rect x="218" y="203" width="26" height="15" />
        <polygon points="214,203 231,193 248,203" />
      </g>
      <rect x="160" y="204" width="8" height="8" fill="var(--kunyit-100)" opacity="0.8" />
      {/* Asap dapur pagi — goyang idle sangat lambat */}
      <path
        className="title__asap"
        d="M164 182 q 4 -8 -2 -14 q -5 -7 1 -13"
        fill="none"
        stroke="var(--kertas-050)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  )
}

/** Lapis DEPAN: tanah, gedung Puskesmas (fokal), ambulans, jalan setapak, pohon. */
function SiluetDepan() {
  return (
    <svg
      className="title__siluet title__siluet--depan"
      viewBox="0 0 1200 260"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {/* Tanah depan */}
      <path d="M0 226 Q 300 214 600 222 Q 900 230 1200 218 L 1200 260 L 0 260 Z" fill="var(--daun-900)" />

      {/* Jalan setapak dari pintu Puskesmas ke tepi bawah — leading line */}
      <polygon points="806,250 828,250 872,260 756,260" fill="var(--kertas-300)" opacity="0.22" />

      {/* Pepohonan tepi kiri */}
      <g fill="var(--daun-900)">
        <rect x="60" y="188" width="7" height="44" rx="2" />
        <ellipse cx="63" cy="168" rx="34" ry="30" />
        <rect x="140" y="202" width="6" height="32" rx="2" />
        <ellipse cx="143" cy="186" rx="23" ry="21" />
      </g>
      {/* Pepohonan kanan */}
      <g fill="var(--daun-900)">
        <rect x="1092" y="192" width="7" height="40" rx="2" />
        <ellipse cx="1095" cy="170" rx="32" ry="29" />
        <rect x="1164" y="204" width="6" height="28" rx="2" />
        <ellipse cx="1167" cy="190" rx="20" ry="18" />
      </g>

      {/* Ambulans Puskesmas parkir di kiri gedung — "layanan primer" dalam satu benda */}
      <g className="title__ambulans">
        <rect x="600" y="236" width="46" height="20" rx="4" fill="var(--kertas-050)" opacity="0.9" />
        <rect x="600" y="247" width="46" height="3" fill="var(--daun-700)" opacity="0.9" />
        <rect x="636" y="239" width="7" height="6" rx="1" fill="var(--daun-900)" opacity="0.35" />
        <rect x="616" y="238" width="4" height="10" fill="var(--tinta-merah)" opacity="0.85" />
        <rect x="613" y="241" width="10" height="4" fill="var(--tinta-merah)" opacity="0.85" />
        <circle cx="611" cy="257" r="4.5" fill="var(--daun-900)" />
        <circle cx="635" cy="257" r="4.5" fill="var(--daun-900)" />
      </g>

      {/* Gedung Puskesmas — geometri LAMA utuh, direposisi ke fokal ±68% via
          transform (translate dulu, lalu scale — jangan gambar ulang path). */}
      <g transform="translate(132 -8) scale(1.14)">
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
        {/* Pintu & jendela — menyala SATU PER SATU saat entrance (kelas jendela--N;
            opasitas final di CSS var --op-j, bukan attribute, agar bisa dianimasi
            & di-override mode malam "Puskesmas jaga malam"). */}
        <rect className="jendela jendela--1" x="588" y="194" width="24" height="34" rx="2" fill="var(--kunyit-100)" />
        <rect className="jendela jendela--2" x="540" y="156" width="16" height="14" rx="1" fill="var(--kunyit-100)" />
        <rect className="jendela jendela--3" x="644" y="156" width="16" height="14" rx="1" fill="var(--kunyit-100)" />
        <rect className="jendela jendela--4" x="468" y="180" width="14" height="12" rx="1" fill="var(--kunyit-100)" />
        <rect className="jendela jendela--5" x="504" y="180" width="14" height="12" rx="1" fill="var(--kunyit-100)" />
        <rect className="jendela jendela--6" x="682" y="180" width="14" height="12" rx="1" fill="var(--kunyit-100)" />
        <rect className="jendela jendela--7" x="718" y="180" width="14" height="12" rx="1" fill="var(--kunyit-100)" />
        {/* Lambang kesehatan di atas pintu */}
        <circle cx="600" cy="124" r="11" fill="var(--kertas-050)" opacity="0.92" />
        <rect x="597.5" y="117" width="5" height="14" rx="1" fill="var(--daun-900)" />
        <rect x="593" y="121.5" width="14" height="5" rx="1" fill="var(--daun-900)" />
        {/* Tiang bendera */}
        <rect x="782" y="150" width="3" height="78" fill="var(--daun-900)" />
        {/* Merah-putih dibungkus satu grup supaya CSS bisa mengibarkannya
            perlahan dengan poros di tiang (lihat .title__bendera). */}
        <g className="title__bendera">
          <rect x="785" y="152" width="20" height="12" fill="var(--tinta-merah)" opacity="0.8" />
          <rect x="785" y="164" width="20" height="12" fill="var(--kertas-050)" opacity="0.9" />
        </g>
      </g>
    </svg>
  )
}

/** Lambang kesehatan mini utk kop surat map — bentuk sama dgn lambang gedung. */
function LambangKop() {
  return (
    <svg className="title__kop-lambang" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="var(--daun-700)" opacity="0.14" />
      <circle cx="11" cy="11" r="10" fill="none" stroke="var(--daun-800)" strokeWidth="1.5" />
      <rect x="9.2" y="5.5" width="3.6" height="11" rx="1" fill="var(--daun-800)" />
      <rect x="5.5" y="9.2" width="11" height="3.6" rx="1" fill="var(--daun-800)" />
    </svg>
  )
}

/** CODEX M14 #24: batas ukuran impor — save/log wajar ≪ beberapa MB; berkas
 *  raksasa dibaca utuh ke memori tanpa guna & bisa jadi vektor DoS. */
const MAKS_UKURAN_IMPOR = 8_000_000

/** Satu baris hasil verifikasi massal; hasil null = berkas gagal dibaca. */
interface BarisVerifMassal {
  file: string
  hasil: HasilVerifikasi | null
  catatan?: string
}

const LABEL_STATUS_VERIF: Record<HasilVerifikasi['status'], string> = {
  sah: 'SAH',
  tidak_sah: 'TIDAK SAH',
  tidak_dapat_diverifikasi: 'TAK DAPAT',
}

/** Nilai sel CSV: kutip ganda + netralkan awalan formula (injeksi spreadsheet). */
function selCsv(nilai: unknown): string {
  let s = String(nilai ?? '')
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return `"${s.replaceAll('"', '""')}"`
}

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
  // Verifikasi massal (usulan Claude 2026-07-23, disetujui): dosen memeriksa
  // satu KELAS (±50 dossier) sekali pilih — bukan 50 kali pilih-berkas. Baris
  // diproses berurutan (hemat memori), race dijaga token (pola fix #8).
  const [hasilMassal, setHasilMassal] = useState<BarisVerifMassal[] | null>(null)
  const [progresMassal, setProgresMassal] = useState<{ selesai: number; total: number } | null>(null)
  const [namaFileMassal, setNamaFileMassal] = useState<string | null>(null)
  const tokenMassalRef = useRef(0)
  // Audit premium 2026-07-23: window.confirm/alert (dialog OS mentah, memutus
  // imersi & bahasa tombol ikut OS) diganti DialogGame in-game. State satu slot:
  // konfirmasi menyimpan `aksi` yang baru dieksekusi setelah pemain menyetujui.
  const [dialog, setDialog] = useState<{
    judul: string
    pesan: string
    labelYa?: string
    bahaya?: boolean
    aksi?: () => void
  } | null>(null)
  const beriTahu = (judul: string, pesan: string) => setDialog({ judul, pesan })
  const arsipRilisSesuai =
    arsip !== null && arsip.contentRelease === PACK.runtimeManifest.contentRelease
  // Parallax dekoratif dimatikan bagi pengguna kurangi-gerak (premiere 2026-07-26).
  const kurangiGerak = useMotionDikurangi()

  // Audit UI/UX 2026-07-23: seluruh UI memanggil pemain "dr. {nama}" — pemain
  // yang sudah mengetik gelarnya sendiri ("dr. Budi"/"Dr Budi") dulu jadi
  // "dr. dr. Budi" di tombol Lanjutkan, konfirmasi, dan arsip. Prefiks gelar
  // dilepas SEKALI di sini (titik masuk nama), bukan di tiap titik render.
  // Hanya bentuk singkatan "dr."/"dr" — kata penuh "Dokter ..." dibiarkan
  // verbatim (kontrak lama TitleScreen.overwrite.test: nama apa adanya).
  const namaBersih = nama.trim().replace(/^dr\.?\s+/i, '')
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
    const jalankan = () => mulaiGameBaru(namaBersih, mode, mode === 'ujian' ? nimBersih : undefined)
    // CODEX audit UI/UX 2026-07-10 (#3): dulu langsung menimpa arsip lama
    // tanpa konfirmasi — salah klik atau Enter di input nama (form submit
    // standar HTML) cukup utk menghapus progres tersimpan.
    // CODEX audit UI/UX 2026-07-13 (P2): teks lama "akan menimpa arsip" ambigu
    // — bisa disalahartikan sebagai slot manual ikut tertimpa. Yang sebenarnya
    // diganti hanya Autosave Aktif (lihat store.ts `simpan()`/SLOT_AUTOSAVE);
    // slot 1/2/3 tak pernah disentuh operasi ini.
    if (arsip !== null) {
      setDialog({
        judul: 'Mulai Stase Baru?',
        pesan: `Mulai stase baru akan mengganti Autosave Aktif dr. ${arsip.namaDokter} (Hari ${arsip.hari}) — slot manual (1/2/3) tetap aman.`,
        labelYa: 'Mulai Stase Baru',
        bahaya: true,
        aksi: jalankan,
      })
      return
    }
    // CODEX M14 #6: ada autosave TAPI tak terbaca (rusak/versi lama) — jangan
    // menimpanya diam-diam. Peringatkan sebelum menghapusnya.
    if (arsipKorup) {
      setDialog({
        judul: 'Autosave Tidak Terbaca',
        pesan: 'Ada autosave yang tidak bisa dibaca (mungkin rusak atau dari versi lama). Mulai stase baru akan menimpanya permanen.',
        labelYa: 'Mulai Stase Baru',
        bahaya: true,
        aksi: jalankan,
      })
      return
    }
    jalankan()
  }

  return (
    <div
      className="title"
      // Parallax halus matahari (premiere 2026-07-26): murni dekoratif,
      // mati saat kurangi-gerak. Nilai -0.5..0.5 → CSS var → translate kecil.
      onMouseMove={(e) => {
        if (kurangiGerak) return
        const t = e.currentTarget
        t.style.setProperty('--par-x', String(e.clientX / t.clientWidth - 0.5))
        t.style.setProperty('--par-y', String(e.clientY / t.clientHeight - 0.5))
      }}
    >
      {/* Pendar fajar di titik fokal (68% lebar) — di bawah semua lapis scene */}
      <div className="title__cahaya" aria-hidden="true" />

      {/* Matahari pagi — kini BENAR-BENAR terlihat: fokal kanan, terbit dari
          balik bukit saat entrance. Fill via var lokal supaya mode malam bisa
          menukarnya jadi bulan tanpa menyentuh markup. */}
      <div className="title__matahari" aria-hidden="true">
        <svg viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="130" fill="var(--scene-mthr-halo, var(--kunyit-100))" opacity="0.55" />
          <circle cx="150" cy="150" r="88" fill="var(--scene-mthr-halo, var(--kunyit-100))" opacity="0.7" />
          <circle cx="150" cy="150" r="52" fill="var(--scene-mthr-inti, var(--kunyit-600))" opacity="0.82" />
        </svg>
      </div>

      {/* Awan pagi — fill token kertas-050 (bukan #fff hardcode), komposisi
          membingkai matahari; drift idle sangat lambat (kill-switch global). */}
      <div className="title__awan" aria-hidden="true">
        <svg className="title__awan-svg title__awan--1" viewBox="0 0 120 36">
          <ellipse cx="34" cy="24" rx="30" ry="11" fill="var(--kertas-050)" />
          <ellipse cx="62" cy="17" rx="26" ry="13" fill="var(--kertas-050)" />
          <ellipse cx="90" cy="25" rx="26" ry="10" fill="var(--kertas-050)" />
        </svg>
        <svg className="title__awan-svg title__awan--2" viewBox="0 0 120 36">
          <ellipse cx="38" cy="23" rx="32" ry="10" fill="var(--kertas-050)" />
          <ellipse cx="72" cy="18" rx="28" ry="12" fill="var(--kertas-050)" />
        </svg>
        <svg className="title__awan-svg title__awan--3" viewBox="0 0 120 36">
          <ellipse cx="40" cy="22" rx="28" ry="9" fill="var(--kertas-050)" />
          <ellipse cx="66" cy="17" rx="22" ry="10" fill="var(--kertas-050)" />
        </svg>
        <svg className="title__awan-svg title__awan--4" viewBox="0 0 120 36">
          <ellipse cx="44" cy="22" rx="24" ry="8" fill="var(--kertas-050)" />
          <ellipse cx="68" cy="17" rx="18" ry="9" fill="var(--kertas-050)" />
        </svg>
      </div>

      {/* Burung pagi — melintasi layar sesekali (±8 dtk tampil, lalu hening
          panjang); berakhir opacity 0 sehingga aman utk kurangi-gerak. */}
      <svg className="title__burung title__burung--1" viewBox="0 0 40 16" aria-hidden="true">
        <path d="M4 10 q 8 -8 16 0 q 8 -8 16 0" fill="none" stroke="var(--daun-900)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <svg className="title__burung title__burung--2" viewBox="0 0 40 16" aria-hidden="true">
        <path d="M4 10 q 6 -6 12 0 q 6 -6 12 0" fill="none" stroke="var(--daun-900)" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <SiluetJauh />
      <SiluetTengah />
      <SiluetDepan />

      {/* MAP STASE — folder manila di kiri meja; tab map + klip + chip build
          hidup di wrapper (overflow visible), panel di dalamnya yang scroll. */}
      <div className="title__map">
        <span className="title__beta mono" aria-hidden="true">TEST-BETA</span>
        <div className="title__panel kertas">
        {/* Koreksi kelembagaan (2026-07-26, dr. Wirayuda): kop lama
            "KEMENTERIAN KESEHATAN" keliru DAN berisiko terbaca sbg produk
            resmi Kemenkes — ini simulasi edukasi milik fakultas (konsisten
            METADATA.organisasi ITS). */}
        {/* Kop surat dinas: lambang mini + nama fakultas + garis ganda penutup
            (identitas "map stase" — surat resmi Puskesmas, rata kiri). */}
        <div className="title__kop">
          <LambangKop />
          <p className="title__kicker mono">
            FAKULTAS KEDOKTERAN DAN KESEHATAN ITS
            {/* Deskriptor terpilih dr. Wirayuda (2026-07-26, opsi 1): kedua
                pilar ko-primer dinyatakan eksplisit & setara — DNA produk. */}
            <span className="title__kicker-sub">SIMULASI LAYANAN PRIMER &amp; KEDOKTERAN KOMUNITAS</span>
          </p>
        </div>
        <h1 className="title__judul">PRIMERA</h1>
        {/* Build lab/eksperimen — label test-beta supaya tak tertukar dgn
            instalasi lain; hapus label ini saat porting ke rilis produksi. */}
        {/* Premiere (2026-07-26): label build pindah ke chip pojok — subtitle
            murni identitas. Hapus chip saat porting ke rilis produksi. */}
        <p className="title__sub mono">— PUSKESMAS PAGI —</p>
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

            {/* Hirarki premiere (2026-07-26): pemain KEMBALI melihat satu aksi
                pahlawan (Lanjutkan); form stase-baru terlipat — terbuka penuh
                hanya utk pemain baru. jsdom tak menyembunyikan isi <details>,
                kontrak test lama (placeholder/tombol) tetap terjangkau. */}
            <details className="title__lipat title__lipat--mulai" open={arsip === null}>
              <summary className="judul-seksi title__lipat-judul">
                {arsip !== null ? 'Atau mulai stase baru' : 'Mulai stase barumu'}
              </summary>
            <form className="title__form" onSubmit={mulaiStase}>
              <label className="title__label judul-seksi" htmlFor="title-nama">
                Nama doktermu
              </label>
              {/* M4.5 — pemilih mode stase */}
              <div className="title__form-baris title__mode-baris" {...modeRadio.groupProps} aria-label="Mode stase">
                <button
                  type="button"
                  className={`tombol ${mode === 'karier' ? 'tombol--utama' : ''}`}
                  {...modeRadio.radioProps('karier')}
                  data-tip="90 hari penuh — bebas nilai, semua fitur, progres santai."
                  onClick={() => setMode('karier')}
                >
                  Karier · 90 hari
                </button>
                <button
                  type="button"
                  className={`tombol ${mode === 'ujian' ? 'tombol--utama' : ''}`}
                  {...modeRadio.radioProps('ujian')}
                  data-tip="30 hari — skor terkunci di akhir untuk disetor ke dosen. Paket soal dirotasi otomatis."
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
                  spellCheck={false}
                  autoComplete="off"
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
              {/* Audit visual 2026-08-23: CTA dulu SEBARIS dgn input nama —
                  di kolom map yang lebih sempit (400-500px), tombol bergaya
                  stempel (border tebal + cincin bayangan) menyisakan ±150px
                  utk input, cukup sempit hingga placeholder "tulis namamu di
                  sini" TERPOTONG visual jadi "tulis namar". Nama dokter juga
                  bisa panjang sungguhan (maxLength 24), bukan cuma placeholder
                  — CTA dipindah ke baris sendiri, lebar penuh, sejajar kartu
                  Lanjutkan (title__lanjut) yang juga lebar penuh. */}
              <button
                type="submit"
                className={`tombol tombol--besar title__cta ${arsip !== null ? '' : 'tombol--utama'}`}
                disabled={!bolehMulai}
                title={
                  namaBersih.length === 0
                    ? 'Isi nama doktermu dulu'
                    : mode === 'ujian' && nimBersih.length === 0
                      ? 'Isi NIM-mu dulu (identitas ujian)'
                      : undefined
                }
                data-tip={
                  arsip !== null
                    ? 'Memulai stase baru akan mengganti Autosave Aktif (slot manual tetap aman)'
                    : 'Mulai Hari 1 di Puskesmas Sukamaju'
                }
              >
                Mulai Stase
              </button>
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
                    spellCheck={false}
                    autoComplete="off"
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
            </details>

            {/* M5.25 — slot manual + impor arsip; M5.24 — jejak lintas-playthrough.
                Premiere (2026-07-26): dilipat — arsip adalah alat, bukan hero. */}
            <details className="title__lipat title__lipat--arsip">
              <summary className="judul-seksi title__lipat-judul">
                Arsip &amp; Impor{slots.length > 0 ? ` (${slots.length} slot terisi)` : ''}
              </summary>
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
                      const muat = () => {
                        void muatDariSlot(info.slot).then((ok) => {
                          if (!ok) beriTahu('Gagal Memuat Arsip', 'File rusak, tidak ditemukan, atau dari versi yang tak dikenal.')
                        })
                      }
                      if (arsip !== null) {
                        setDialog({
                          judul: `Muat ${info.slot.replace('slot', 'Slot ')}?`,
                          pesan: `Memuat ${info.slot.replace('slot', 'Slot ')} akan mengganti Autosave Aktif dr. ${arsip.namaDokter} (Hari ${arsip.hari}) — isi Slot 1/2/3 tetap aman.`,
                          labelYa: 'Muat Arsip',
                          bahaya: true,
                          aksi: muat,
                        })
                        return
                      }
                      muat()
                    }}
                    title={
                      info.compatible
                        ? undefined
                        : `Arsip ${info.slot.replace('slot', 'Slot ')} dibuat pada versi konten yang berbeda, jadi hanya bisa dibuka dengan versi aplikasi yang sama.`
                    }
                    data-tip={`Muat arsip ${info.slot}.`}
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
                  // CODEX M14 #24: reset value SEGERA (File `f` sudah dipegang)
                  // agar memilih file yang sama lagi tetap memicu change —
                  // termasuk semua jalur gagal/batal di bawah.
                  input.value = ''
                  // CODEX M14 #24: tolak berkas raksasa sebelum dibaca ke memori.
                  if (f.size > MAKS_UKURAN_IMPOR) {
                    beriTahu('Berkas Terlalu Besar', 'Berkas terlalu besar — bukan arsip stase yang wajar.')
                    return
                  }
                  // CODEX audit UI/UX 2026-07-10 (#3): impor JSON menimpa
                  // autosave seketika (imporArsip -> simpan()) tanpa jeda —
                  // salah pilih file cukup utk menghapus progres tersimpan.
                  const proses = () => {
                    void f
                      .text()
                      .then((json) => {
                        if (!imporArsip(json)) beriTahu('Arsip Tidak Valid', 'Arsip tidak valid atau berasal dari rilis konten yang berbeda.')
                      })
                      .catch(() => beriTahu('Gagal Membaca', 'Gagal membaca file arsip.'))
                  }
                  if (arsip !== null) {
                    setDialog({
                      judul: 'Impor Arsip?',
                      pesan: `Mengimpor arsip akan mengganti Autosave Aktif dr. ${arsip.namaDokter} (Hari ${arsip.hari}) — slot manual (1/2/3) tetap aman.`,
                      labelYa: 'Impor Arsip',
                      bahaya: true,
                      aksi: proses,
                    })
                    return
                  }
                  proses()
                }}
              />
            </label>
            </details>

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
                    beriTahu('Berkas Terlalu Besar', 'Berkas dossier terlalu besar — bukan dossier stase yang wajar.')
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
                      beriTahu('Gagal Membaca', 'Gagal membaca file dossier.')
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
                    beriTahu('Berkas Terlalu Besar', 'Berkas log telemetri terlalu besar.')
                    return
                  }
                  void f
                    .text()
                    .then((isi) => {
                      const baris = isi.split('\n').filter((b) => b.trim().length > 0)
                      setPeringatanTelemetri(auditTelemetri(baris))
                    })
                    .catch(() => beriTahu('Gagal Membaca', 'Gagal membaca file log telemetri.'))
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
            <hr className="title__impor-pisah" />

            {/* Verifikasi Massal (2026-07-23) — satu kelas sekali pilih. */}
            <label className="teks-xs teks-lembut title__impor">
              Verifikasi Massal — pilih banyak dossier sekaligus (satu kelas):{' '}
              <span className="title__file-tampil">{namaFileMassal ?? 'Belum ada berkas dipilih'}</span>
              <input
                type="file"
                multiple
                className="title__file-input-tersembunyi"
                accept="application/json"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? [])
                  e.target.value = ''
                  if (files.length === 0) return
                  setNamaFileMassal(`${files.length} berkas dipilih`)
                  const token = ++tokenMassalRef.current
                  setHasilMassal(null)
                  setProgresMassal({ selesai: 0, total: files.length })
                  void (async () => {
                    const versiApp = await window.primer.appVersion()
                    const urut = [...files].sort((a, b) => a.name.localeCompare(b.name, 'id'))
                    const baris: BarisVerifMassal[] = []
                    for (const f of urut) {
                      if (tokenMassalRef.current !== token) return
                      if (f.size > MAKS_UKURAN_IMPOR) {
                        baris.push({ file: f.name, hasil: null, catatan: 'berkas terlalu besar' })
                      } else {
                        try {
                          const json = await f.text()
                          baris.push({ file: f.name, hasil: await verifikasiDossier(json, PACK, versiApp) })
                        } catch {
                          baris.push({ file: f.name, hasil: null, catatan: 'gagal dibaca' })
                        }
                      }
                      if (tokenMassalRef.current !== token) return
                      setHasilMassal([...baris])
                      setProgresMassal({ selesai: baris.length, total: urut.length })
                    }
                    if (tokenMassalRef.current === token) setProgresMassal(null)
                  })()
                }}
              />
            </label>
            {progresMassal !== null && (
              <p className="teks-xs teks-lembut mono" role="status">
                Memverifikasi {progresMassal.selesai}/{progresMassal.total}&hellip;
              </p>
            )}
            {hasilMassal !== null && hasilMassal.length > 0 && (() => {
              const hitung = (status: HasilVerifikasi['status']) =>
                hasilMassal.filter((b) => b.hasil?.status === status).length
              const gagal = hasilMassal.filter((b) => b.hasil === null).length
              const eksporCsv = () => {
                const header = ['berkas', 'status', 'nama', 'nim', 'mode', 'paket', 'hari', 'tamat', 'skor_klaim', 'grade_klaim', 'skor_replay', 'grade_replay', 'alasan']
                const rows = hasilMassal.map((b) => {
                  const r = b.hasil?.ringkasan
                  return [
                    b.file,
                    b.hasil ? LABEL_STATUS_VERIF[b.hasil.status] : `GAGAL (${b.catatan ?? ''})`,
                    r?.namaDokter ?? '', r?.nim ?? '', r?.mode ?? '', r?.paketUjian ?? '',
                    r?.hari ?? '', r === undefined ? '' : r.tamat ? 'ya' : 'belum',
                    r?.skorKlaim.total ?? '', r?.skorKlaim.grade ?? '',
                    r?.skorReplay?.total ?? '', r?.skorReplay?.grade ?? '',
                    b.hasil?.alasan.join(' | ') ?? (b.catatan ?? ''),
                  ]
                })
                // Pemisah ';' + BOM: Excel locale Indonesia membuka langsung
                // dgn kolom benar tanpa wizard impor.
                const csv = [header, ...rows].map((r) => r.map(selCsv).join(';')).join('\r\n')
                const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' })
                const url = URL.createObjectURL(blob)
                const tautan = document.createElement('a')
                tautan.href = url
                tautan.download = 'primer_verifikasi_massal.csv'
                tautan.click()
                URL.revokeObjectURL(url)
              }
              return (
                <div className="kartu title__verifikasi">
                  <div className="baris baris--antara">
                    <span className="teks-xs mono">
                      {hitung('sah')} sah · {hitung('tidak_sah')} tidak sah · {hitung('tidak_dapat_diverifikasi')} tak dapat diverifikasi
                      {gagal > 0 ? ` · ${gagal} gagal dibaca` : ''}
                    </span>
                    <div className="baris">
                      <button type="button" className="tombol teks-xs" onClick={eksporCsv}>
                        Unduh CSV
                      </button>
                      <button type="button" className="tombol tombol--senyap teks-xs" onClick={() => setHasilMassal(null)}>
                        Tutup
                      </button>
                    </div>
                  </div>
                  <div className="title__massal-gulir">
                    <table className="title__massal-tabel" aria-label="Hasil verifikasi massal dossier">
                      <thead>
                        <tr>
                          <th>Berkas</th><th>Dokter</th><th>NIM</th><th>Hari</th><th>Status</th><th>Klaim</th><th>Replay</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hasilMassal.map((b) => {
                          const r = b.hasil?.ringkasan
                          return (
                            <tr key={b.file}>
                              <td className="mono">{b.file}</td>
                              <td>{r ? `dr. ${r.namaDokter}` : '—'}</td>
                              <td className="mono">{r?.nim ?? '—'}</td>
                              <td className="mono">{r?.hari ?? '—'}</td>
                              <td>
                                <span
                                  className={`stempel stempel--kecil ${
                                    b.hasil === null
                                      ? 'stempel--kunyit'
                                      : b.hasil.status === 'sah'
                                        ? 'stempel--hijau'
                                        : b.hasil.status === 'tidak_sah'
                                          ? 'stempel--merah'
                                          : 'stempel--kunyit'
                                  }`}
                                >
                                  {b.hasil ? LABEL_STATUS_VERIF[b.hasil.status] : 'GAGAL'}
                                </span>
                              </td>
                              <td className="mono">
                                {r ? `${r.skorKlaim.total} (${r.skorKlaim.grade})` : (b.catatan ?? '—')}
                              </td>
                              <td className="mono">
                                {r?.skorReplay ? `${r.skorReplay.total} (${r.skorReplay.grade})` : '—'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })()}

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
                // Q8 (adjudikasi DT + Claude, 2026-07-23): satu-satunya aksi
                // yang DIBERI konfirmasi tambahan — frekuensi rendah, konvensi
                // desktop. Aksi berfrekuensi tinggi (LANJUTKAN dkk) sengaja
                // TIDAK dipagari: melatih confirmation fatigue yang justru
                // menumpulkan dialog timpa-arsip yang sungguh penting.
                onClick={() =>
                  setDialog({
                    judul: 'Keluar dari PRIMERA?',
                    pesan: 'Tutup aplikasi? Progresmu sudah tersimpan otomatis di Autosave Aktif.',
                    labelYa: 'Keluar',
                    aksi: () => window.close(),
                  })
                }
              >
                Keluar
              </button>
            )}
          </div>
        )}
        </div>
      </div>

      {dialog !== null && (
        <DialogGame
          judul={dialog.judul}
          pesan={dialog.pesan}
          labelYa={dialog.labelYa}
          bahaya={dialog.bahaya}
          onYa={dialog.aksi}
          onTutup={() => setDialog(null)}
        />
      )}

      <div className="title__kredit mono">
        <p>{METADATA.copyright}</p>
        {/* Premiere (2026-07-26): blok legal panjang dilipat — satu baris
            copyright selalu terlihat, rincian HAKI dibuka sesuai kebutuhan. */}
        <details className="title__kredit-lipat">
        <summary>Hak cipta terdaftar &amp; ketentuan</summary>
        <p className="title__kredit-haki">
          Hak Cipta terdaftar Kemenkumham RI — Surat Pencatatan Ciptaan No.{' '}
          {METADATA.haki.nomorRegistrasi} ({METADATA.haki.tanggalRegistrasi}), Nomor Pencatatan{' '}
          {METADATA.haki.nomorPencatatan} · {METADATA.haki.dasarHukum} · {METADATA.organisasi}
        </p>
        <p className="title__kredit-disklaimer">{METADATA.disklaimerMedis}</p>
        </details>
      </div>
    </div>
  )
}
