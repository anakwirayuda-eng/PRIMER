/**
 * BANNER PEMBARUAN (A7 distribusi, 2026-08-02).
 *
 * Muncul HANYA bila pengguna menyalakan "Periksa Pembaruan" di Pengaturan
 * (opt-in — aplikasi ini sengaja luring) DAN ada rilis lebih baru. Tidak
 * memasang apa pun: pembaruan diunduh manual dari halaman rilis, karena
 * installer belum bersertifikat sehingga auto-install hanya akan memunculkan
 * peringatan SmartScreen kedua tanpa pengawasan.
 */

import { useEffect, useState } from 'react'
import { usePengaturan } from '../usePengaturan'
import { abaikanVersi, cekPembaruan, type InfoPembaruan } from '../pembaruan'
import { urlSumberAman } from './TautanSumber'
import './BannerPembaruan.css'

export function BannerPembaruan() {
  const p = usePengaturan()
  const [info, setInfo] = useState<InfoPembaruan | null>(null)
  const [versiSekarang, setVersiSekarang] = useState('')

  useEffect(() => {
    if (!p.cekPembaruan) {
      setInfo(null)
      return
    }
    let aktif = true
    void (async () => {
      try {
        const versi = await window.primer.appVersion()
        if (!aktif) return
        setVersiSekarang(versi)
        const hasil = await cekPembaruan(versi)
        if (aktif) setInfo(hasil)
      } catch {
        /* luring/gagal — senyap sesuai desain */
      }
    })()
    return () => {
      aktif = false
    }
  }, [p.cekPembaruan])

  if (!info) return null
  // Gerbang keamanan URL yang sama dgn sitasi klinis — tautan dari jaringan
  // tak pernah langsung dipercaya (hanya HTTPS tanpa kredensial).
  const aman = urlSumberAman(info.urlHalaman)

  return (
    <div className="banner-pembaruan kertas" role="status">
      <div className="banner-pembaruan__isi">
        <strong className="banner-pembaruan__judul">Versi baru tersedia — {info.versiTerbaru}</strong>
        <p className="teks-xs teks-lembut">
          Kamu memakai {versiSekarang || 'versi lama'}. Untuk penilaian, seluruh kelompok
          sebaiknya memakai versi yang sama — dossier dari versi berbeda tidak dapat
          diverifikasi dosen.
        </p>
      </div>
      <div className="baris">
        {aman ? (
          <a
            className="tombol tombol--utama"
            href={info.urlHalaman}
            target="_blank"
            rel="noreferrer"
            aria-label={`Buka halaman unduhan versi ${info.versiTerbaru} di browser bawaan`}
          >
            Buka Halaman Unduhan ↗
          </a>
        ) : (
          <span className="teks-xs teks-lembut">Tautan rilis tidak valid — buka halaman rilis manual.</span>
        )}
        <button
          type="button"
          className="tombol tombol--senyap"
          onClick={() => {
            abaikanVersi(info.versiTerbaru)
            setInfo(null)
          }}
        >
          Nanti Saja
        </button>
      </div>
    </div>
  )
}
