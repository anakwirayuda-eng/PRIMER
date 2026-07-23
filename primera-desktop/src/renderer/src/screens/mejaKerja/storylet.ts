/**
 * Storylet debrief malam: satu potongan kehidupan sistem kesehatan per hari.
 * Kabar tindak lanjut hanya boleh muncul bila state pendukungnya benar-benar ada.
 */
import { Rng } from '@engine/core/rng'

export interface KonteksStorylet {
  punyaBinaan?: boolean
  rujukanMenunggu?: boolean
  rujukanTuntas?: boolean
  pernahPosyandu?: boolean
  pernahProlanis?: boolean
  episodeAktif?: boolean
  episodeTerverifikasi?: boolean
}

interface Storylet {
  id: string
  teks: string
  boleh?: (konteks: KonteksStorylet) => boolean
}

export type TemaVisualStorylet = 'sistem' | 'rujukan' | 'lapangan' | 'komunitas'

export interface StoryletHariIni {
  id: string
  teks: string
  temaVisual: TemaVisualStorylet
}

const umum: readonly Storylet[] = [
  { id: 'umum-kader-silang', teks: 'Kabar sore: dua kader membandingkan catatan rumah yang sama. Satu angka berbeda, lalu mereka sepakat kembali memeriksa alih-alih menebak.' },
  { id: 'umum-obat', teks: 'Di gudang obat, petugas menandai satu stok yang mulai menipis. Catatan kecil itu mencegah masalah besar minggu depan.' },
  { id: 'umum-sanitarian', teks: 'Sanitarian membentangkan peta RW di meja rapat. Titik air, jamban, dan keluhan diare mulai terlihat sebagai satu pola, bukan tiga daftar terpisah.' },
  { id: 'umum-bidan', teks: 'Bidan desa menitipkan satu nama ibu hamil yang sulit dihubungi. Belum ada kesimpulan, hanya satu tugas tindak lanjut yang kini punya pemilik.' },
  { id: 'umum-perawat', teks: 'Perawat menemukan nomor telepon yang salah di kartu lama. Lima menit memperbarui data terasa remeh sampai sebuah panggilan benar-benar perlu dilakukan.' },
  { id: 'umum-lokmin', teks: 'Papan Lokmin sore ini penuh panah antara keluarga, program, poli, dan desa. Pelayanan primer rupanya lebih mirip jaringan daripada antrean lurus.' },
  { id: 'umum-privasi', teks: 'Seorang kader menutup buku catatannya saat tetangga mendekat. Kepercayaan warga kadang dijaga oleh gerakan sekecil itu.' },
  { id: 'umum-cuaca', teks: 'Hujan membuat satu jalan dusun sulit dilalui. Tim mengubah urutan kunjungan, bukan menghapus keluarga dari daftar.' },
  { id: 'umum-warung', teks: 'Percakapan di warung memberi petunjuk tentang rumor kesehatan yang beredar. Tim mencatatnya sebagai hipotesis, bukan sebagai fakta.' },
  { id: 'umum-sekolah', teks: 'Guru UKS mengirim pertanyaan tentang beberapa murid yang sering absen. Belum tentu satu penyakit, tetapi cukup untuk membuka percakapan lintas sektor.' },
  { id: 'umum-antrian', teks: 'Petugas loket mengubah urutan antrean untuk seorang warga yang nyaris pulang. Akses kadang gagal bukan di diagnosis, melainkan di lima meter sebelum pintu poli.' },
  { id: 'umum-teachback', teks: 'Di lorong, seorang warga mengulang aturan obat dengan kata-katanya sendiri. Petugas menemukan satu salah paham sebelum ia dibawa pulang.' },
  { id: 'umum-data', teks: 'Grafik bulanan naik sedikit. Kapus meminta tim mencari siapa yang masih tertinggal, bukan sekadar merayakan rerata.' },
  { id: 'umum-bahasa', teks: 'Kader mengganti satu istilah teknis dengan contoh dari dapur warga. Pesannya sama, tetapi kali ini orang di depannya benar-benar mengangguk paham.' },
  { id: 'umum-jejaring', teks: 'Nomor Pustu, bidan, sanitarian, dan ambulans desa ditulis ulang di satu lembar. Jejaring yang baik dimulai dari tahu siapa menghubungi siapa.' },
  { id: 'umum-refleksi', teks: 'Hari ini tidak semua masalah selesai. Namun beberapa masalah kini punya nama, pemilik, dan langkah berikutnya. Itu kemajuan yang dapat diperiksa.' },
]

const bersyarat: readonly Storylet[] = [
  { id: 'binaan-jalan', teks: 'Kabar binaan: kader melaporkan jalan menuju salah satu rumah sedang becek. Rute kunjungan disusun ulang agar janji tidak hilang karena cuaca.', boleh: (k) => k.punyaBinaan === true },
  { id: 'binaan-catatan', teks: 'Kabar binaan: satu keluarga membawa catatan tekanan darah buatan sendiri. Angkanya belum ditafsirkan, tetapi kebiasaan mencatatnya layak dipertahankan.', boleh: (k) => k.punyaBinaan === true },
  { id: 'binaan-pemilik', teks: 'Kabar binaan: daftar tugas kini menyebut nama petugas dan tanggal kembali. Keluarga tidak lagi sekadar menjadi baris tanpa pemilik.', boleh: (k) => k.punyaBinaan === true },
  { id: 'binaan-kontradiksi', teks: 'Kabar binaan: laporan kader dan cerita keluarga tidak sepenuhnya sama. Tim memilih memeriksa dengan hormat, bukan langsung menuduh salah satu pihak.', boleh: (k) => k.punyaBinaan === true },

  { id: 'rujuk-tunggu-berkas', teks: 'Kabar rujukan: berkas sudah terkirim, tetapi umpan balik belum kembali. Rangkaian perawatan tetap terbuka dan belum boleh disebut selesai.', boleh: (k) => k.rujukanMenunggu === true },
  { id: 'rujuk-tunggu-telepon', teks: 'Kabar rujukan: petugas menyiapkan panggilan tindak lanjut karena kabar balik belum diterima. Mengirim pasien bukan akhir pekerjaan.', boleh: (k) => k.rujukanMenunggu === true },
  { id: 'rujuk-tunggu-pemilik', teks: 'Kabar rujukan: status masih menunggu. Penanggung jawab dan tenggat tindak lanjut tetap terlihat dalam jejak perawatan.', boleh: (k) => k.rujukanMenunggu === true },
  { id: 'rujuk-tunggu-loop', teks: 'Kabar rujukan: rangkaian tindak lanjut masih terbuka. Tim belum menyatakan hasil sebelum keputusan dan rencana balik benar-benar diterima.', boleh: (k) => k.rujukanMenunggu === true },

  { id: 'rujuk-tuntas-balik', teks: 'Kabar rujukan: umpan balik sudah diterima dan langkah berikutnya tercatat. Alur informasi benar-benar kembali ke Puskesmas.', boleh: (k) => k.rujukanTuntas === true },
  { id: 'rujuk-tuntas-aksi', teks: 'Kabar rujukan: hasil pelayanan sudah ditindaklanjuti. Rangkaian ditutup karena ada bukti tindakan, bukan hanya karena berkas dikirim.', boleh: (k) => k.rujukanTuntas === true },
  { id: 'rujuk-tuntas-keluarga', teks: 'Kabar rujukan: keluarga menerima penjelasan rencana lanjut setelah umpan balik tiba. Informasi tidak berhenti di meja petugas.', boleh: (k) => k.rujukanTuntas === true },
  { id: 'rujuk-tuntas-ledger', teks: 'Kabar rujukan: sinyal, keputusan, umpan balik, dan tindakan berikutnya kini tercatat dalam satu jejak yang dapat diaudit.', boleh: (k) => k.rujukanTuntas === true },

  { id: 'posy-sasaran', teks: 'Sesudah Posyandu, tim meninjau siapa yang datang dan siapa yang belum terjangkau. Cakupan bukan hanya jumlah kursi yang terisi.', boleh: (k) => k.pernahPosyandu === true },
  // Audit editorial 2026-07-23 (disetujui dr. Wirayuda): "dokter kecil"
  // beririsan dgn nama program UKS resmi (Dokter Kecil) — ganti frasa netral.
  { id: 'posy-rujuk', teks: 'Catatan Posyandu sore ini memisahkan edukasi rutin dari temuan yang perlu dinilai tenaga kesehatan. Kader tidak dipaksa menjadi dokter dadakan.', boleh: (k) => k.pernahPosyandu === true },
  { id: 'posy-siklus', teks: 'Daftar Posyandu dibaca lintas siklus hidup. Balita tetap penting, tetapi ibu, remaja, dewasa, dan lansia tidak menghilang dari peta layanan.', boleh: (k) => k.pernahPosyandu === true },
  { id: 'posy-kualitas', teks: 'Tim membahas satu pengukuran Posyandu yang meragukan dan memilih mengulangnya. Data berkualitas lebih berguna daripada angka yang sekadar lengkap.', boleh: (k) => k.pernahPosyandu === true },

  { id: 'prolanis-multi', teks: 'Sesudah sesi penyakit kronis, tim memisahkan peserta yang stabil dari yang membutuhkan penilaian individual. Satu klub tidak berarti satu kebutuhan.', boleh: (k) => k.pernahProlanis === true },
  { id: 'prolanis-umpan', teks: 'Hasil sesi Prolanis kembali ke daftar tindak lanjut klinik. Senam dan edukasi bukan pulau yang terpisah dari terapi.', boleh: (k) => k.pernahProlanis === true },
  { id: 'prolanis-absen', teks: 'Nama peserta yang berulang kali absen ditandai untuk ditelusuri hambatannya. Ketidakhadiran diperlakukan sebagai sinyal, bukan kenakalan.', boleh: (k) => k.pernahProlanis === true },
  { id: 'prolanis-target', teks: 'Tim membandingkan tekanan darah, gula, fungsi, dan hambatan hadir. Keberhasilan program tidak direduksi menjadi satu angka ramai peserta.', boleh: (k) => k.pernahProlanis === true },

  { id: 'episode-aktif-next', teks: 'Jejak perawatan: satu episode masih aktif, tetapi langkah berikutnya dan pemiliknya jelas. Ketidakpastian dikelola, bukan disembunyikan.', boleh: (k) => k.episodeAktif === true },
  { id: 'episode-aktif-tenggat', teks: 'Jejak perawatan: sebuah tenggat mendekat. Catatan kesinambungan membuat pekerjaan yang belum selesai tetap terlihat saat hari berganti.', boleh: (k) => k.episodeAktif === true },
  { id: 'episode-aktif-lintas', teks: 'Jejak perawatan: sinyal keluarga dan catatan klinik kini berada pada episode yang sama. Dua sisi layanan mulai berbicara satu sama lain.', boleh: (k) => k.episodeAktif === true },
  { id: 'episode-aktif-bukan-selesai', teks: 'Jejak perawatan: tindakan pertama sudah dilakukan, tetapi hasil belum terverifikasi. Tim menahan stempel selesai.', boleh: (k) => k.episodeAktif === true },

  { id: 'episode-verif-bukti', teks: 'Jejak perawatan: satu rangkaian dinyatakan tuntas setelah ada bukti perubahan atau tindak lanjut, bukan berdasarkan asumsi.', boleh: (k) => k.episodeTerverifikasi === true },
  { id: 'episode-verif-belajar', teks: 'Jejak perawatan: rangkaian yang tuntas dibaca ulang dalam Lokmin. Tim mencari hal yang membuat tindak lanjut berhasil agar dapat diulang dengan bijak.', boleh: (k) => k.episodeTerverifikasi === true },
  { id: 'episode-verif-ukm-ukp', teks: 'Jejak perawatan: masalah yang ditemukan di rumah berakhir dengan tindak lanjut klinik dan verifikasi keluarga. UKM dan UKP bertemu di hasil.', boleh: (k) => k.episodeTerverifikasi === true },
  { id: 'episode-verif-tidak-magis', teks: 'Jejak perawatan: outcome membaik melalui beberapa langkah kecil lintas hari. Tidak ada satu tombol ajaib, hanya kontinuitas yang bekerja.', boleh: (k) => k.episodeTerverifikasi === true },
]

const semua = [...umum, ...bersyarat]

export const STORYLET_POOL: readonly string[] = semua.map((storylet) => storylet.teks)

/** Kandidat aktual; diekspor agar kontrak anti-kabar-palsu dapat diuji langsung. */
export function kandidatStorylet(konteks: KonteksStorylet = {}): readonly string[] {
  return semua.filter((storylet) => storylet.boleh?.(konteks) ?? true).map((storylet) => storylet.teks)
}

function temaVisualUntuk(id: string): TemaVisualStorylet {
  if (id.startsWith('rujuk-')) return 'rujukan'
  if (id.startsWith('binaan-') || id === 'umum-cuaca' || id === 'umum-bidan') return 'lapangan'
  if (
    id.startsWith('posy-') ||
    id.startsWith('prolanis-') ||
    ['umum-warung', 'umum-sekolah', 'umum-bahasa'].includes(id)
  ) return 'komunitas'
  return 'sistem'
}

/**
 * Rotasi deterministik tanpa pengulangan selama satu putaran pool bila konteks
 * tetap. Putaran berikutnya diacak ulang; boundary dicegah mengulang kalimat.
 */
export function storyletHariIniDetail(
  seed: number,
  hari: number,
  konteks: KonteksStorylet = {},
): StoryletHariIni {
  const kandidat = semua.filter((storylet) => storylet.boleh?.(konteks) ?? true)
  const nomorHari = Math.max(1, Math.floor(hari)) - 1
  const siklus = Math.floor(nomorHari / kandidat.length)
  const indeks = nomorHari % kandidat.length
  const identitasPool = kandidat.map((storylet) => storylet.id).join(',')
  const urutan = new Rng(seed, 'storylet-order', identitasPool, siklus).shuffle(kandidat)
  let terpilih = urutan[indeks]!

  if (indeks === 0 && siklus > 0 && kandidat.length > 1) {
    const sebelumnya = new Rng(seed, 'storylet-order', identitasPool, siklus - 1).shuffle(kandidat).at(-1)
    if (sebelumnya?.id === terpilih.id) terpilih = urutan[1]!
  }
  return { id: terpilih.id, teks: terpilih.teks, temaVisual: temaVisualUntuk(terpilih.id) }
}

/** Kompatibilitas pemanggil lama dan kontrak test: tetap mengembalikan teks. */
export function storyletHariIni(seed: number, hari: number, konteks: KonteksStorylet = {}): string {
  return storyletHariIniDetail(seed, hari, konteks).teks
}
