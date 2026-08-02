/**
 * CEK PEMBARUAN (A7 distribusi, 2026-08-02).
 *
 * Aplikasi ini TIDAK memasang pembaruan sendiri. Alasannya BUKAN "SmartScreen
 * akan muncul lagi" — itu keliru secara mekanis (Mark-of-the-Web dipasang oleh
 * aplikasi pengunduh, bukan OS; electron-updater mengunduh lewat stream Node
 * sehingga tak memicunya). Alasan sebenarnya lebih serius: pada aplikasi tanpa
 * tanda tangan, electron-updater MELEWATI verifikasi penerbit sepenuhnya
 * (publisherName kosong → verifySignature langsung lolos). Yang tersisa hanya
 * TLS + checksum dari server yang sama, tanpa lapis kedua. Memasang biner tak
 * terautentikasi secara otomatis ke ratusan PC lab bukan risiko yang sepadan.
 * Karena itu di sini hanya MEMBERI TAHU; pengguna mengunduh sendiri.
 *
 * Alasan pedagogis, bukan sekadar kenyamanan: dossier mahasiswa yang dibuat
 * di versi berbeda akan berstatus "tidak dapat diverifikasi" saat dosen
 * memeriksanya (lihat docs/PANDUAN_DOSEN.md §6). Versi yang seragam adalah
 * syarat penilaian yang adil — pemberitahuan ini membuat ketimpangan versi
 * terlihat sebelum jadi masalah.
 *
 * OPT-IN: hanya berjalan bila pengguna menyalakannya di Pengaturan. Tidak ada
 * data pengguna yang dikirim — hanya GET ke daftar rilis publik.
 */

const KUNCI_TERAKHIR_CEK = 'primer.pembaruan.terakhirCek'
const KUNCI_DIABAIKAN = 'primer.pembaruan.diabaikan'
/** Jangan menghubungi jaringan lebih sering dari sekali per 12 jam. */
const JEDA_CEK_MS = 12 * 60 * 60 * 1000

export interface InfoPembaruan {
  versiTerbaru: string
  urlHalaman: string
  judul: string
}

/**
 * Bandingkan dua versi semver-dengan-prerelease (mis. 1.1.0-beta.9 vs
 * 1.1.0-beta.10). Mengembalikan true bila `kandidat` LEBIH BARU dari `sekarang`.
 *
 * Perbandingan string biasa GAGAL di sini: "beta.9" > "beta.10" secara
 * leksikografis, padahal beta.10 yang lebih baru — persis kasus rilis ini.
 */
export function lebihBaru(kandidat: string, sekarang: string): boolean {
  const pecah = (v: string): number[] => {
    const bersih = v.trim().replace(/^v/i, '')
    const [inti = '', pra = ''] = bersih.split('-')
    const angkaInti = inti.split('.').map((n) => Number.parseInt(n, 10) || 0)
    // Rilis final > prarilis pada inti yang sama: tandai dgn Infinity.
    const angkaPra = pra === '' ? [Number.POSITIVE_INFINITY] : (pra.match(/\d+/g) ?? ['0']).map((n) => Number.parseInt(n, 10))
    return [...angkaInti, ...angkaPra]
  }
  const a = pecah(kandidat)
  const b = pecah(sekarang)
  const n = Math.max(a.length, b.length)
  for (let i = 0; i < n; i++) {
    const x = a[i] ?? 0
    const y = b[i] ?? 0
    if (x !== y) return x > y
  }
  return false
}

function bolehCekSekarang(): boolean {
  try {
    const t = Number.parseInt(window.localStorage.getItem(KUNCI_TERAKHIR_CEK) ?? '0', 10)
    return !Number.isFinite(t) || Date.now() - t > JEDA_CEK_MS
  } catch {
    return true
  }
}

function catatCek(): void {
  try {
    window.localStorage.setItem(KUNCI_TERAKHIR_CEK, String(Date.now()))
  } catch {
    /* penyimpanan tak tersedia — cek tiap buka, bukan masalah */
  }
}

/** Pengguna menutup pemberitahuan untuk versi ini — jangan ganggu lagi. */
export function abaikanVersi(versi: string): void {
  try {
    window.localStorage.setItem(KUNCI_DIABAIKAN, versi)
  } catch {
    /* abaikan */
  }
}

function sudahDiabaikan(versi: string): boolean {
  try {
    return window.localStorage.getItem(KUNCI_DIABAIKAN) === versi
  } catch {
    return false
  }
}

/**
 * Ambil rilis terbaru dan bandingkan dgn versi berjalan.
 * Mengembalikan null bila: tak ada yang lebih baru, sudah diabaikan, dibatasi
 * jeda, atau jaringan gagal (kegagalan SELALU senyap — aplikasi luring tak
 * boleh menampilkan error jaringan yang tak bisa ditindaklanjuti pemain).
 */
export async function cekPembaruan(versiSekarang: string): Promise<InfoPembaruan | null> {
  if (!bolehCekSekarang()) return null
  try {
    // Pengambilan dilakukan MAIN process: CSP renderer (`default-src 'self'`)
    // memblokir koneksi keluar, jadi fetch di sini akan gagal senyap di build
    // terpasang meski jalan di dev. Lihat ipcMain 'pembaruan:cek'.
    const daftar = (await window.primer?.cekPembaruan?.()) ?? []
    if (daftar.length === 0) return null

    let terbaik: InfoPembaruan | null = null
    for (const r of daftar) {
      // Versi diambil dari JUDUL rilis — tag memakai hash commit
      // (mis. "test-beta-79464b5"), jadi tag bukan sumber versi.
      const cocok = r.judul.match(/\d+\.\d+\.\d+(?:-[\w.]+)?/)
      if (!cocok || !r.url) continue
      const versi = cocok[0]
      if (!lebihBaru(versi, versiSekarang)) continue
      if (terbaik && !lebihBaru(versi, terbaik.versiTerbaru)) continue
      terbaik = { versiTerbaru: versi, urlHalaman: r.url, judul: r.judul }
    }
    // Dicatat hanya SETELAH berhasil menghubungi: satu kegagalan jaringan
    // (lab yang belum tersambung saat aplikasi dibuka) tak boleh mengunci
    // pengecekan selama 12 jam penuh.
    catatCek()
    if (terbaik && sudahDiabaikan(terbaik.versiTerbaru)) return null
    return terbaik
  } catch {
    // Luring/diblokir/timeout — senyap sesuai desain.
    return null
  }
}
