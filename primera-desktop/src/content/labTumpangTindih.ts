/**
 * PETA TUMPANG-TINDIH ANALIT LAB — mencegah hasil "normal" karangan yang
 * bertentangan dengan hasil yang benar-benar ditulis kasus.
 *
 * MASALAH YANG DIPECAHKAN (dilaporkan dr. Wirayuda saat playtest 2026-08-03,
 * lalu diukur menyeluruh). `PESAN_LAB` sengaja mengizinkan pemain memesan
 * lab APA PUN di katalog, bukan hanya yang ditulis kasus — itu memang
 * disengaja, karena memesan lab tak relevan harus boleh terjadi dan dinilai.
 * Untuk lab yang tidak ditulis kasus, lembar periksa menampilkan teks generik
 * "Dalam batas normal, tidak ada temuan bermakna."
 *
 * Penyederhanaan itu benar untuk lab yang sungguh tak berhubungan (urinalisis
 * pada faringitis). Ia menjadi SALAH ketika dua pemeriksaan berbagi analit
 * yang sama: pasien dislipidemia yang profil lipidnya tertulis 268 akan
 * menjawab "kolesterol total dalam batas normal" bila pemain memesan
 * Kolesterol Total — dua hasil bertentangan pada pasien yang sama, dan yang
 * salah justru terlihat meyakinkan.
 *
 * Pengukuran 2026-08-03: 55 kombinasi kasus×pasangan berisiko, termasuk
 * `kia_preeklampsia_berat` (proteinuria tertulis abnormal, tetapi memesan
 * Urinalisis menjawab "normal" — preeklampsia bisa terlewat).
 *
 * Ini BUKAN masalah baru: komentar di `katalog.ts` mencatat entri "Asam Urat"
 * generik pernah DIHAPUS karena persis kelas kesalahan ini. Yang dulu
 * ditambal per-kasus, di sini ditangani sebagai aturan.
 *
 * CATATAN UNTUK dr. WIRAYUDA: daftar di bawah adalah klaim klinis — "analit X
 * termuat di dalam pemeriksaan Y". Semuanya sengaja dipilih yang tidak
 * diperdebatkan (Hb memang komponen darah rutin; protein urin memang
 * komponen urinalisis). Bila ada pasangan yang menurut Anda keliru atau
 * kurang, di sinilah tempat memperbaikinya — satu-satunya sumber kebenaran.
 */

export interface PasanganAnalit {
  /** Pemeriksaan yang lebih sempit — analitnya termuat di `luas`. */
  sempit: string
  /** Pemeriksaan panel yang memuat analit `sempit`. */
  luas: string
  /** Analit yang dibagi keduanya — dipakai pada teks yang dibaca pemain. */
  analit: string
}

export const PASANGAN_ANALIT: readonly PasanganAnalit[] = [
  { sempit: 'kolesterol', luas: 'profil_lipid', analit: 'kolesterol total' },
  { sempit: 'hb', luas: 'darah_rutin', analit: 'hemoglobin' },
  { sempit: 'proteinuria', luas: 'urinalisis', analit: 'protein urin' },
  { sempit: 'keton_urin', luas: 'urinalisis', analit: 'keton urin' },
  { sempit: 'hbsag', luas: 'panel_awal_hiv_jejaring', analit: 'HBsAg' },
  { sempit: 'fungsi_ginjal', luas: 'panel_awal_hiv_jejaring', analit: 'kreatinin' },
]

/**
 * Cari pemeriksaan lain yang berbagi analit dengan `labId`.
 * Dipakai lembar periksa saat kasus TIDAK menuliskan hasil untuk `labId`.
 */
export function pasanganAnalitUntuk(labId: string): { pasanganId: string; analit: string }[] {
  const keluar: { pasanganId: string; analit: string }[] = []
  for (const p of PASANGAN_ANALIT) {
    if (p.sempit === labId) keluar.push({ pasanganId: p.luas, analit: p.analit })
    else if (p.luas === labId) keluar.push({ pasanganId: p.sempit, analit: p.analit })
  }
  return keluar
}

/**
 * KELOMPOK BERKORELASI — pemeriksaan yang TIDAK saling memuat, tetapi secara
 * klinis bergerak bersama sehingga "normal" karangan tetap bohong.
 *
 * Beda perlakuan dari PASANGAN_ANALIT: hasil pasangan TIDAK dipinjam (GDP
 * bukan bagian dari GDS — menampilkan angka GDS sebagai jawaban GDP itu
 * salah). Lembar periksa hanya BERHENTI mengklaim normal dan menunjuk hasil
 * yang sudah ada. Terukur 2026-08-03: 11 kasus menulis salah satu trio
 * glukosa abnormal tanpa menulis saudaranya — pasien GDS 320 yang dipesankan
 * GDP dulu dijawab "dalam batas normal".
 *
 * CATATAN UNTUK dr. WIRAYUDA: sengaja HANYA trio glukosa dulu — korelasi
 * lain (mis. ureum-kreatinin sudah satu pemeriksaan; SGOT-SGPT juga) tidak
 * membutuhkannya. Tambah kelompok di sini bila ada trio serupa.
 */
export const KELOMPOK_KORELASI: readonly (readonly string[])[] = [['gds', 'gdp', 'hba1c']]

/** Saudara sekelompok-korelasi dari `labId` (tanpa dirinya sendiri). */
export function korelasiAnalitUntuk(labId: string): string[] {
  for (const kel of KELOMPOK_KORELASI) {
    if (kel.includes(labId)) return kel.filter((id) => id !== labId)
  }
  return []
}
