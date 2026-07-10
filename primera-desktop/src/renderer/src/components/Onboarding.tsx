/**
 * ONBOARDING HARI 1 (M7 butir 30) — sambutan interaktif diegetik dr. Harsono,
 * carousel bertahap (satu konsep per kartu) menggantikan tembok-teks surat.
 * Muncul SEKALI per-instalasi (localStorage), hanya di Hari 1 blok pagi,
 * bisa dilewati. Tidak menyentuh GameState — murni pengenalan UI.
 */

import { useState } from 'react'
import { useFocusTrap } from '../useFocusTrap'
import './Onboarding.css'

const KUNCI = 'primer.onboarding.selesai'

export function sudahOnboarding(): boolean {
  try {
    return window.localStorage.getItem(KUNCI) === '1'
  } catch {
    return true // bila storage tak tersedia, jangan mengganggu
  }
}

function tandaiSelesai(): void {
  try {
    window.localStorage.setItem(KUNCI, '1')
  } catch {
    /* abaikan */
  }
}

// CODEX audit UI/UX 2026-07-10 (#24a): dipakai Pengaturan ("Tampilkan panduan
// lagi") — slot kedua/ketiga (MejaKerja) yang baru mulai karier tak pernah
// lihat Onboarding karena kunci ini global per-instalasi, bukan per-slot.
// Efek baru terlihat setelah reload — App membaca sudahOnboarding() sekali
// sbg initial state saat mount, jadi reset di sini tak langsung memicu render.
export function resetOnboarding(): void {
  try {
    window.localStorage.removeItem(KUNCI)
  } catch {
    /* abaikan */
  }
}

interface Kartu {
  ikon: string
  judul: string
  isi: string
}

const KARTU: Kartu[] = [
  {
    ikon: '🩺',
    judul: 'Selamat datang, Dokter',
    isi: 'Saya dr. Harsono, Kepala Puskesmas Sukamaju. Mulai hari ini desa ini tanggung jawabmu. Izinkan saya menemanimu sebentar sebelum pasien pertama masuk.',
  },
  {
    ikon: '🌅',
    judul: 'Satu hari, tiga blok',
    isi: 'PAGI di klinik memeriksa pasien. SIANG turun ke lapangan — kunjungan keluarga atau kegiatan. SORE di meja kerja: surat, laporan, refleksi. Tekan LANJUTKAN untuk mengalir dari satu blok ke blok berikutnya.',
  },
  {
    ikon: '📋',
    judul: 'Di klinik: gali dulu, jangan menebak',
    isi: 'Panggil pasien, tanyakan anamnesis, periksa fisik, pesan lab bila perlu. Perhatikan gauge KESABARAN pasien — bertanya berputar-putar atau tak relevan membuatnya jengkel dan berhenti bercerita.',
  },
  {
    ikon: '🔖',
    judul: 'TEGAK atau SUSPEK — jujurlah',
    isi: 'Saat mendiagnosis: cap TEGAK bila kamu yakin, SUSPEK bila itu masih diagnosis kerja. Kejujuran epistemikmu ikut dinilai — menebak TEGAK asal-asalan lebih berisiko daripada mengakui ragu.',
  },
  {
    ikon: '💊',
    judul: 'Tuntas di sini, atau rujuk',
    isi: 'Beri terapi yang tepat dan edukasi yang relevan (maksimal tiga — pilih yang paling menyelamatkan). Kasus di luar kompetensi FKTP: kenali lalu RUJUK dengan benar. Merujuk tepat waktu adalah keputusan yang matang, bukan kekalahan.',
  },
  {
    ikon: '⚖️',
    judul: 'Yang dinilai adalah caramu berpikir',
    isi: 'Rapormu punya empat dimensi: klinik, desa, manajemen, ketahanan diri. Satu nasihat dari saya: di sini, angka yang tidak kamu periksa sendiri adalah angka yang belum ada. Pasien pertamamu sudah menunggu — semoga lancar, Dokter.',
  },
]

export function Onboarding({ onSelesai }: { onSelesai: () => void }) {
  const [i, setI] = useState(0)
  const kartu = KARTU[i]!
  const terakhir = i === KARTU.length - 1

  const tutup = () => {
    tandaiSelesai()
    onSelesai()
  }
  // CODEX M10.a ronde-4 (dossier §44): jebak fokus — tombol HUD di belakang
  // (navigasi layar, mute, gigi Pengaturan) sebelumnya tetap ter-Tab & ter-
  // aktivasi walau tertutup total secara visual. "Lewati" = jalan keluar
  // eksplisit yg sudah ada → Escape aman disamakan dgn itu.
  const ref = useFocusTrap<HTMLDivElement>(true, tutup)

  return (
    <div className="onb-overlay">
      <div ref={ref} className="onb-kartu kertas" role="dialog" aria-modal="true" aria-label="Panduan hari pertama">
        <div className="onb-ikon" aria-hidden="true">{kartu.ikon}</div>
        <div className="onb-kredit mono">dr. HARSONO · KEPALA PUSKESMAS</div>
        <h2 className="onb-judul">{kartu.judul}</h2>
        <p className="onb-isi">{kartu.isi}</p>

        <div className="onb-titik" aria-hidden="true">
          {KARTU.map((_, k) => (
            <span key={k} className={`onb-dot${k === i ? ' onb-dot--aktif' : ''}`} />
          ))}
        </div>

        <div className="baris baris--antara onb-kaki">
          {/* CODEX audit UI/UX 2026-07-10 (#24b): grup Kembali/Lanjut didahulukan
              di DOM supaya useFocusTrap (querySelectorAll, ikut urutan DOM) fokus
              awal ke CTA progresi, bukan "Lewati". Posisi visual tetap sama
              (Lewati kiri, grup kanan) lewat CSS order di Onboarding.css. */}
          <div className="baris onb-grup-lanjut">
            {i > 0 && (
              <button className="tombol" onClick={() => setI((n) => n - 1)}>Kembali</button>
            )}
            {terakhir ? (
              <button className="tombol tombol--utama" onClick={tutup}>Mulai bertugas &rarr;</button>
            ) : (
              <button className="tombol tombol--utama" onClick={() => setI((n) => n + 1)}>Lanjut</button>
            )}
          </div>
          <button className="tombol tombol--senyap onb-lewati" onClick={tutup}>Lewati</button>
        </div>
      </div>
    </div>
  )
}
