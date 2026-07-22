# M15 - Arsip Jaga Malam

**Status:** konsep disetujui; milestone terfokus; belum aktif dan belum diimplementasikan.

**Pemilik keputusan klinis/pedagogis:** dr. Anak Agung Bagus Wirayuda, MD, PhD

**Tanggal keputusan:** 2026-07-22

**Pernyataan pemilik:** snapshot kisah kasus, fakta historis, tragedi, ironi, atau kejadian unik yang nyata diberi tempat khusus pada sesi review malam. Pekerjaan ini dicatat sebagai batch tersendiri bernama `M15`.

## 1. Tujuan

M15 menjadikan kenyataan pelayanan kesehatan Indonesia sebagai jangkar memori dan bahan refleksi. Fitur harus:

- memperkuat hubungan UKP, UKM, rujukan, kebijakan, dan keselamatan tenaga kesehatan;
- membuat dunia PRIMERA terasa hidup tanpa mengubah berita menjadi trivia;
- membantu empati, refleksi, dan pemikiran sistem;
- menjaga debrief malam tetap tenang, singkat, dan mudah dipindai.

Kisah nyata adalah jendela sistem dan jangkar memori. Kisah nyata **bukan** bukti prevalensi, pengganti guideline, atau dasar tunggal untuk memberi nilai klinis.

## 2. Baseline yang Sudah Ada

PRIMERA sudah memiliki:

- `Debrief Malam` di `src/renderer/src/screens/MejaKerja.tsx`;
- 44 storylet atmosfer deterministik di `src/renderer/src/screens/mejaKerja/storylet.ts`;
- panel ilustrasi 16:9 dari atlas M12;
- refleksi harian, ringkasan hasil, gudang obat, dan arsip manual pada layar yang sama;
- pola panel bukti klinis dengan tautan HTTPS yang dibuka melalui browser OS.

Konsekuensi desain: snapshot nyata **menggantikan** storylet atmosfer pada malam terpilih. Snapshot tidak ditumpuk sebagai kartu wajib tambahan.

## 3. Nama dan Bentuk

Nama kerja fitur: **Arsip Jaga Malam**.

Kategori editorial:

- `Kisah Nyata` - pengalaman kasus atau layanan yang terverifikasi;
- `Jejak Sejarah` - peristiwa historis kesehatan masyarakat atau pelayanan primer;
- `Ironi Sistem` - ketegangan kebijakan, logistik, akses, atau tata kelola;
- `Aneh tetapi Nyata` - fakta unik yang manusiawi dan aman dituturkan.

Istilah `komedi` tidak dipakai sebagai label kategori. Humor hanya boleh menyoroti ironi sistem atau sejarah, bukan pasien, kemiskinan, budaya, disabilitas, tenaga kesehatan yang sedang menderita, atau kematian.

## 4. Anatomi Snapshot

Tampilan ringkas memuat, dalam urutan ini:

1. label kategori, lokasi, dan tahun;
2. satu gambar rasio 16:9;
3. judul pendek;
4. cerita utama 60-100 kata;
5. satu kalimat `Maknanya bagi Sukamaju`;
6. tombol ikon `Buka sumber`;
7. disclosure `Konteks dan bukti`, tertutup secara default.

Isi disclosure maksimal:

- apa yang terverifikasi;
- apa yang masih berupa dugaan, sengketa, atau tidak diketahui;
- satu pelajaran UKP;
- satu pelajaran UKM/sistem;
- dua atau tiga sumber terbaik.

Snapshot tidak memiliki kuis, skor, hukuman, atau reward yang memaksa pemain membacanya.

## 5. Cadence dan Beban Kognitif

Aturan awal:

- maksimal satu snapshot pada satu malam;
- satu snapshot setiap 2-3 malam, bukan setiap malam;
- hanya muncul setelah kasus, program, atau tema yang relevan sudah dialami;
- cooldown minimal dua malam antar-snapshot;
- kisah sensitif atau tragis maksimal satu dalam tujuh hari permainan;
- dua kisah tragis tidak boleh muncul berturut-turut;
- pemain selalu dapat melewati snapshot;
- bila tidak ada snapshot relevan, storylet atmosfer lama tetap tampil.

Target waktu baca tampilan ringkas adalah 60-90 detik. Teks sumber dan konteks lanjutan bersifat opsional.

## 6. Standar Bukti

Setiap snapshot wajib memiliki registry terstruktur minimal:

```ts
interface ArsipJagaMalam {
  id: string
  kategori: 'kisah_nyata' | 'jejak_sejarah' | 'ironi_sistem' | 'aneh_tapi_nyata'
  judul: string
  lokasi?: string
  tanggalPeristiwa?: string
  ringkasan: string
  maknaSukamaju: string
  triggerIds: string[]
  sensitif: boolean
  faktaTerverifikasi: string[]
  batasKlaim?: string[]
  pelajaranUkp: string
  pelajaranUkm: string
  sumber: Array<{
    label: string
    url: string
    jenis: 'primer_resmi' | 'jurnal' | 'berita_kredibel' | 'arsip_sejarah'
    tanggalAkses: string
  }>
  gambar: {
    src: string
    alt: string
    hak: 'milik_sendiri' | 'generated' | 'domain_publik' | 'berlisensi'
    kredit?: string
  }
}
```

Pagar sumber:

- minimal satu sumber primer/resmi untuk klaim kebijakan, klinis, atau tindakan institusi;
- kasus personal yang diperdebatkan memerlukan triangulasi dengan sumber independen yang kredibel;
- fakta, dugaan, pernyataan pihak, dan putusan/proses hukum harus dibedakan;
- kutipan langsung sangat pendek dan hanya bila redaksinya penting;
- tautan diverifikasi saat release dan diberi tanggal akses;
- berita tidak boleh dipakai untuk menggantikan pedoman klinis;
- tautan mati tidak menghilangkan ringkasan lokal, tetapi UI memberi tahu bahwa sumber tidak dapat dibuka.

## 7. Etika dan Gambar

- Foto nyata hanya dipaketkan bila izin atau lisensinya jelas dan kredit dicantumkan.
- Untuk individu hidup atau yang telah wafat, jangan membuat wajah sintetis yang menyerupai orang tersebut.
- Bila hak foto tidak jelas, gunakan ilustrasi dokumenter non-identifying yang dibuat khusus untuk PRIMERA.
- Jangan menggambarkan metode bunuh diri, cedera grafis, atau momen kematian.
- Berikan peringatan isi singkat untuk kematian, bunuh diri, kekerasan, atau intimidasi.
- Sediakan tindakan `Lewati` dan jangan mengurangi skor karena dilewati.
- Hindari musik atau animasi dramatis yang mengeksploitasi peristiwa nyata.

## 8. Seed Item: Kasus dr. Icha

Judul kerja yang disetujui secara editorial:

> **Ketika Tata Laksana Benar Belum Cukup Melindungi Dokter**

Fokus pembelajaran:

- keputusan antivenom harus tetap berbasis indikasi dan kemampuan klinis;
- keselamatan tenaga kesehatan merupakan bagian dari keselamatan pasien;
- konflik, dugaan intimidasi, tata laksana medis, dan kematian tidak boleh dirangkai sebagai hubungan sebab tunggal tanpa bukti;
- aktifkan tim, pimpinan, keamanan, dokumentasi, serta jalur perlindungan tanpa meninggalkan tindakan penyelamatan nyawa;
- hubungkan kasus dengan jejaring GHBTB, rujukan berbasis kapabilitas, dan perlindungan tenaga kesehatan.

Batas etik:

- tidak ada rekonstruksi NPC atas dr. Icha;
- tidak ada detail metode bunuh diri;
- tidak ada foto pribadi tanpa hak yang jelas;
- panel sumber membedakan rilis resmi, laporan media, dugaan, dan proses hukum.

## 9. Tahap Implementasi

### M15-0 - Kurasi dan Registry

- pilih enam snapshot pilot;
- selesaikan triangulasi sumber, lisensi gambar, dan review etik;
- tentukan trigger yang tidak membocorkan jawaban kasus;
- validasi semua URL dan metadata.

### M15-1 - Pilot Display-only

- integrasikan enam snapshot dengan menggantikan storylet atmosfer pada malam relevan;
- jangan menambah state persisten atau migrasi save;
- pertahankan rotasi deterministik dan fallback storylet lama;
- gunakan progressive disclosure dan browser OS untuk sumber.

### M15-2 - Playtest

- uji pada 2-3 mahasiswa/proxy;
- ukur apakah pemain memahami pelajaran sistem tanpa menganggap anekdot sebagai prevalensi;
- ukur waktu baca, frekuensi skip, kelelahan emosional, dan kepadatan debrief;
- revisi cadence serta panjang teks sebelum perluasan.

### M15-3 - Perluasan Terukur

- perluas menjadi sekitar 18-24 snapshot bila pilot lolos;
- seimbangkan kategori, wilayah, periode sejarah, dan nada emosional;
- fitur koleksi/arsip persisten hanya boleh dibangun melalui RFC engine terpisah karena menyentuh state dan save.

## 10. Gerbang Kelulusan

M15 pilot dianggap selesai hanya bila:

- seluruh snapshot memiliki provenance dan hak gambar yang dapat diaudit;
- tidak ada snapshot yang muncul sebelum tema relevan dialami;
- tidak ada jawaban klinis yang bocor sebelum encounter selesai;
- satu layar tetap nyaman pada desktop dan viewport sempit hingga skala teks 200 persen;
- keyboard, screen reader, mode gelap, dan reduced-motion tetap berfungsi;
- tautan hanya HTTPS dan dibuka melalui browser OS;
- rotasi, cooldown, fallback, dan pembatas kisah sensitif dikunci test;
- physician/editorial review menyetujui klaim medis dan kasus personal;
- playtest tidak menemukan material misunderstanding atau overload yang bermakna.

## 11. Non-goals

M15 bukan:

- mode berita harian yang bergantung internet;
- ensiklopedia 144 penyakit;
- galeri tragedi;
- pengganti Mutiara Klinis, Realita FKTP, atau Panduan Kemenkes;
- mekanik skor baru;
- izin untuk hotlink foto atau menyalin artikel;
- pekerjaan aktif selama batch adjudikasi IGD masih berjalan.

## 12. Keputusan Aktif

1. Konsep **diterima**.
2. Nama milestone: **M15**.
3. Nama fitur: **Arsip Jaga Malam**.
4. Implementasi **ditahan** sebagai batch terfokus tersendiri.
5. Pilot dimulai dari enam snapshot display-only; perluasan bergantung playtest.
6. Kisah nyata menggantikan storylet atmosfer pada malam terpilih, bukan menambah kepadatan layar.
