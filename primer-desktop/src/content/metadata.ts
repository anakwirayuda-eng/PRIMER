/**
 * METADATA RESMI & HKI — diport verbatim dari registri IP PRIMER
 * (repo asal: src/data/AppMetadata.js). Satu sumber kebenaran untuk
 * layar judul, kredit, dan dokumen. Jangan mengubah angka registrasi.
 */

export const METADATA = {
  judul: 'PRIMER: Puskesmas Pagi',
  judulTerdaftar: 'PRIMER: Primary Care Manager Simulator',
  versi: '0.1.0-slice',
  pencipta: 'Anak Agung Bagus Wirayuda, MD, PhD',
  organisasi: 'ITS MEDICS — Institut Teknologi Sepuluh Nopember, Surabaya',
  copyright:
    '© 2026 Anak Agung Bagus Wirayuda MD PhD. Hak Cipta Terdaftar — No. EC002026019623.',

  /** Surat Pencatatan Ciptaan — Kemenkumham RI, Ditjen Kekayaan Intelektual. */
  haki: {
    nomorRegistrasi: 'EC002026019623',
    tanggalRegistrasi: '31 Januari 2026',
    nomorPencatatan: '001104039',
    jenis: 'Permainan Video',
    pemegang: 'Anak Agung Bagus Wirayuda',
    pertamaDiumumkan: '30 Januari 2026, Kota Surabaya',
    masaPerlindungan: '50 tahun sejak Ciptaan pertama kali dilakukan Pengumuman',
    dasarHukum: 'Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta',
  },

  /** Disklaimer medis — WAJIB tampil di alur pertama pemain. */
  disklaimerMedis:
    'PRIMER adalah simulasi edukasi. BUKAN perangkat medis (SaMD), bukan pedoman ' +
    'klinis (PNPK/PPK), dan tidak boleh menjadi dasar keputusan diagnosis atau ' +
    'terapi pasien sungguhan. Seluruh skenario klinis bersifat fiksi.',
} as const
