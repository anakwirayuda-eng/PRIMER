/**
 * KREDIT MUSIK LATAR — satu-satunya sumber kebenaran atribusi.
 *
 * Kenapa ada: proyek ini pernah kehilangan seluruh musiknya karena 7 track OST
 * berhak cipta terlanjur masuk installer. Sejak itu berlaku aturan mengikat di
 * `docs/KEBIJAKAN_ASET_AUDIO.md` — tiap berkas audio WAJIB punya entri di sini,
 * dan `scripts/audit-audio-licenses.mjs` menggagalkan build bila ada berkas
 * tanpa entri atau berlisensi di luar daftar putih.
 *
 * Layar Tentang & Kredit membaca daftar ini, jadi atribusi tak mungkin
 * "lupa ditampilkan" — menambah lagu otomatis menambah kreditnya.
 */

export interface KreditMusik {
  /** Nama berkas di `public/bgm/`. */
  berkas: string
  judul: string
  pencipta: string
  /** Halaman asal — bukti provenance, ditampilkan di layar kredit. */
  urlSumber: string
  lisensi: 'CC BY 4.0' | 'CC BY 3.0' | 'CC0 1.0' | 'Artistic-2.0' | 'MIT' | 'OGA-BY 3.0'
  urlLisensi: string
  /** Suasana yang dituju — dipakai memetakan konteks permainan. */
  suasana: string
  /** Apakah berkas diubah (dipotong/di-loop/fade)? Wajib dinyatakan utk CC BY. */
  dimodifikasi: boolean
}

/**
 * KOSONG SAMPAI DIKURASI MANUSIA.
 *
 * Musik generatif sebelumnya DIHAPUS pada 2026-08-02 setelah dr. Wirayuda
 * mendengarnya sendiri: "suara-suara bunyi-bunyian gak jelas". Itu tepat
 * membuktikan batas yang sudah dinyatakan di KEBIJAKAN_ASET_AUDIO.md §6 —
 * penulis kodenya tidak dapat mendengar, jadi mutu musik tak bisa
 * diverifikasinya. Musik pengganti harus dipilih telinga manusia.
 *
 * Kandidat yang sudah diverifikasi lisensinya ada di
 * `docs/KURASI_MUSIK_LATAR.md`. Setelah track dipilih:
 *   1. simpan berkasnya ke `src/renderer/public/bgm/`
 *   2. tambahkan entri di sini
 *   3. jalankan `npm run audit:audio`
 * Musik akan otomatis hidup dan kreditnya otomatis tampil.
 */
export const KREDIT_MUSIK: readonly KreditMusik[] = []

/** Format atribusi CC BY yang benar (mengikuti permintaan pencipta). */
export function barisAtribusi(k: KreditMusik): string {
  const ubah = k.dimodifikasi ? ' — diperpendek/di-loop untuk permainan ini' : ''
  return `"${k.judul}" oleh ${k.pencipta} (${k.urlSumber}), lisensi ${k.lisensi}${ubah}`
}
