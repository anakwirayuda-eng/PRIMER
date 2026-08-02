# PRIMERA — Panduan Dosen Pengampu

Panduan ini untuk **dosen/pengampu yang bukan pengembang**. Semua dokumentasi
lain di repositori ini ditulis untuk pengembang; dokumen ini ditulis untuk Anda
yang akan memakai PRIMERA di kelas: memasang, menugaskan, membaca hasil,
memverifikasi kejujuran, dan memandu debrief.

Menutup butir roadmap benchmark **"belum ada facilitator handbook"**
([BENCHMARK_EVALUASI_2026-08-02.md](./reports/BENCHMARK_EVALUASI_2026-08-02.md), dimensi B10).

---

## 1. Apa itu PRIMERA, dalam satu paragraf

PRIMERA adalah simulator **dokter Puskesmas**, bukan simulator pasien tunggal.
Mahasiswa menjalani satu stase sebagai dokter penanggung jawab Desa Sukamaju:
pagi memeriksa pasien di poli, siang turun ke lapangan (kunjungan keluarga
binaan, Posyandu, Prolanis, respons KLB), sore mengurus surat, laporan, dan
refleksi. Keputusan klinis di poli berbuntut ke kesehatan wilayah, dan
sebaliknya. Yang dinilai bukan hanya diagnosis benar, tetapi **cara berpikir**:
kejujuran menilai keyakinan sendiri, kepatutan merujuk, kelengkapan rekam
medis, dan ketahanan diri.

---

## 2. Dua mode — pilih sesuai tujuan

| | **Karier** | **Ujian** |
|---|---|---|
| Durasi | 90 hari in-game | 30 hari in-game |
| Kegunaan | Belajar mandiri, eksplorasi, latihan | Asesmen bernilai |
| Komposisi kasus | Dinamis (kurikulum adaptif + acak berseed) | **Blueprint tetap per paket** |
| Keadilan antar-mahasiswa | Tidak dijamin identik | Paket sama = kurikulum sama |
| Untuk penilaian formal | Tidak disarankan | **Ya** |

**Aturan praktis:** untuk latihan, biarkan mahasiswa memakai Karier. Untuk nilai,
gunakan Ujian dan tetapkan paket yang sama bagi satu kelompok.

---

## 3. Memasang & membagikan

1. Ambil installer terbaru dari halaman **Releases** repositori
   (`PRIMERA test-beta Setup <versi>.exe`).
2. Bagikan tautan release, bukan berkas hasil salin-tempel, agar semua
   mahasiswa memakai versi yang sama.
3. **Peringatan yang wajib Anda sampaikan lebih dulu:** installer belum
   ditandatangani secara digital, jadi Windows SmartScreen akan menampilkan
   peringatan biru. Mahasiswa harus menekan **"More info" → "Run anyway"**.
   Ini normal untuk perangkat lunak akademik yang belum bersertifikat; tanpa
   pemberitahuan Anda, sebagian mahasiswa akan mengira aplikasinya berbahaya
   dan berhenti di situ.
4. Aplikasi berjalan **sepenuhnya luring**. Tidak ada akun, tidak ada server,
   tidak ada data yang dikirim ke mana pun. Progres tersimpan lokal di komputer
   masing-masing.

> **Penting soal versi:** satu versi = satu binary. Bila Anda menugaskan
> penilaian, pastikan seluruh kelompok memakai versi yang **sama persis**.
> Versi yang berbeda dapat menghasilkan komposisi kasus berbeda, dan dossier
> dari versi lama akan berstatus "tidak dapat diverifikasi" pada versi baru
> (lihat §6).

---

## 4. Membaca rapor mahasiswa

Rapor punya **empat dimensi**. Totalnya 100.

| Dimensi | Bobot | Menjawab pertanyaan |
|---|---:|---|
| **UKP** (Upaya Kesehatan Perseorangan) | 35 | Sebaik apa ia menangani pasien satu per satu? |
| **UKM** (Upaya Kesehatan Masyarakat) | 35 | Sebaik apa ia mengurus kesehatan wilayahnya? |
| **Manajemen** | 15 | Sebaik apa ia mengelola sumber daya & administrasi? |
| **Resiliensi** | 15 | Sebaik apa ia menjaga dirinya sendiri? |

### Yang paling sering disalahpahami

**"Kok nilainya D padahal diagnosisnya banyak yang benar?"**
Beberapa hal bersifat **gerbang**, bukan pengurang biasa:

- **Rujukan non-spesialistik (RRNS).** Bila mahasiswa merujuk kasus yang
  seharusnya tuntas di FKTP, dan RRNS melewati 5%, komponen UKP dikalikan
  faktor yang bisa mendekati nol. Ini disengaja: gatekeeping adalah kompetensi
  inti dokter layanan primer. Vonis ini baru berlaku setelah ada minimal
  **3 rujukan** — di bawah itu sampelnya belum bermakna dan rapor akan
  menyatakan "belum divonis".
- **Menahan kasus yang wajib dirujuk ("cowboy").** Dihukum lebih berat lagi,
  justru agar mahasiswa tidak "menghindari RRNS" dengan cara berhenti merujuk
  sama sekali.
- **Keselamatan obat.** Obat kontraindikasi, tindakan berbahaya, dan alergi
  yang tidak dicek masing-masing mengurangi UKP, dan membatasi nilai maksimum
  encounter tersebut.

**"Kenapa Hari 1 sudah tertulis D?"** Tidak. Rapor menahan stempel A–D sampai
ada aktivitas ternilai. Bila Anda melihat grade di hari pertama, laporkan —
itu bug.

**"TEGAK vs SUSPEK itu apa?"** Saat mendiagnosis, mahasiswa memilih cap TEGAK
(yakin) atau SUSPEK (diagnosis kerja). **Kalibrasi keyakinan ikut dinilai.**
Menebak TEGAK asal-asalan lebih merugikan daripada jujur mengaku SUSPEK. Ini
bahan diskusi kelas yang sangat baik — lihat §7.

**"Angka IKS desanya kecil sekali, apa dia gagal?"** Belum tentu. IKS memakai
formula resmi PIS-PK (proporsi keluarga sehat), dan bahkan permainan yang
sangat baik pun jarang melewati ~0,25 dalam 90 hari. Bandingkan antar-mahasiswa
pada paket yang sama, jangan terhadap angka absolut.

### Dua permukaan lain yang berguna dibaca

- **Jurnal Refleksi** (di dalam Rapor): tulisan bebas mahasiswa tiap sore. Ini
  sering lebih informatif daripada angka mana pun untuk menilai pemahaman.
- **Pencapaian** (di dalam Rapor): 9 badge dengan progres berjalan. Yang
  "TERKUNCI" menampilkan alasannya — misalnya "1 Kode Hitam sudah terjadi".

---

## 5. Sumber klinis — mengapa ini penting bagi Anda

Setiap kasus membawa sumber resminya, **dapat diklik dan terbuka di browser**.
Label tiga tingkat mencegah klaim berlebihan:

| Label | Artinya |
|---|---|
| **LANGSUNG** | Dokumen ini memang membahas kondisi tersebut |
| **TERKAIT** | Relevan, tetapi bukan pedoman spesifik untuk kondisi itu |
| **PEDOMAN DASAR** | Instrumen umum yang berlaku lintas kasus (mis. PPK FKTP, Fornas, Permenkes rujukan) |

Manfaat langsung untuk Anda: bila mahasiswa berdebat soal suatu keputusan
klinis, mintalah ia membuka sumbernya dari dalam game dan membacanya bersama.
Perdebatan berpindah dari "kata game" ke "kata pedoman" — dan itulah kebiasaan
yang ingin ditanamkan.

**Yang harus Anda ketahui jujur:** sebagian kasus masih berlabel **"Kasus uji
coba"**. Kasus tersebut sudah bersumber dan dapat dimainkan, tetapi **belum
selesai ditelaah final oleh dokter penelaah**, sehingga sengaja **tidak
menyumbang progres formal**. Bila mahasiswa bertanya, jawab apa adanya: itu
materi latihan, bukan materi ujian.

---

## 6. Verifikasi kejujuran (untuk penilaian bernilai)

PRIMERA berjalan luring di komputer mahasiswa, jadi kejujuran dijamin bukan
dengan pengawasan, melainkan dengan **bukti yang dapat diperiksa ulang**.

**Alurnya:**

1. Mahasiswa menyelesaikan stase, lalu **mengekspor dossier** dari dalam game
   dan mengirimkannya kepada Anda (satu berkas).
2. Anda membuka PRIMERA → layar judul → **"Alat Dosen — verifikasi &
   telemetri"** → muat berkas dossier. Bisa satu per satu, bisa massal untuk
   satu kohort sekaligus.
3. Aplikasi **memutar ulang** seluruh jejak aksi mahasiswa dengan engine, lalu
   membandingkan hasil replay dengan skor yang diklaim.

**Tiga kemungkinan hasil — dan artinya:**

| Status | Arti | Tindakan Anda |
|---|---|---|
| **sah** | Klaim skor cocok dengan hasil replay | Terima |
| **tidak sah** | Klaim tidak cocok dengan replay | Selidiki — ini indikasi manipulasi |
| **tidak dapat diverifikasi** | Bukti tidak cukup untuk memvonis | **Jangan diperlakukan sebagai kecurangan** |

> Status ketiga paling sering muncul karena alasan **jinak**: dossier dibuat di
> versi game yang berbeda dengan versi yang Anda pakai memverifikasi. Sistem
> sengaja memilih "tidak dapat diverifikasi" daripada menuduh salah. Bila ini
> terjadi massal, periksa dulu apakah kelompok Anda memakai versi seragam.

---

## 7. Memandu debrief kelas

Game sudah memberi umpan balik otomatis per-encounter. Nilai tambah Anda ada
pada hal yang tidak bisa dilakukan perangkat lunak: membuat mahasiswa
**mengartikulasikan** penalarannya di depan orang lain.

### Format 45 menit yang disarankan

**Fase 1 — Deskripsi (10 menit).** Minta 2–3 mahasiswa menceritakan satu hari
yang paling berkesan, tanpa menyebut skor. "Apa yang terjadi?" bukan "berapa
nilaimu?".

**Fase 2 — Analisis (25 menit).** Pilih 2–3 dari pertanyaan berikut sesuai
temuan Anda di rapor mereka:

- **Kalibrasi.** "Adakah yang mencap TEGAK lalu ternyata keliru? Apa yang
  membuatmu merasa yakin saat itu? Tanda apa yang seharusnya membuatmu ragu?"
- **Gatekeeping.** "Untuk kasus yang kamu rujuk — apa yang membuatmu merasa
  tidak sanggup menuntaskannya di FKTP? Apakah itu keterbatasan kompetensi,
  keterbatasan alat, atau keraguan?"
- **Provenance data.** "Kamu memakai angka dari kader tanpa memverifikasi
  sendiri. Kapan itu dapat dibenarkan, dan kapan berbahaya?"
- **UKP↔UKM.** "Kluster penyakit muncul di RW-mu. Apa yang seharusnya kamu
  lihat lebih awal dari pasien-pasien di poli?"
- **Keselamatan.** "Ada resep yang diblokir firewall alergi. Bagaimana alur
  kerjamu bisa mencegah itu terjadi sejak awal?"
- **Resiliensi.** "Burnout-mu naik di paruh kedua. Apa yang kamu korbankan, dan
  apakah itu keputusan sadar?"

**Fase 3 — Aplikasi (10 menit).** Setiap mahasiswa menuliskan **satu** hal yang
akan ia lakukan berbeda di stase klinik nyata. Satu, bukan lima.

### Yang sebaiknya dihindari

- Membandingkan skor total antar-mahasiswa di depan kelas. Bandingkan
  **keputusan**, bukan angka.
- Memperlakukan game sebagai otoritas klinis final. Bila mahasiswa menemukan
  sesuatu yang menurutnya keliru secara klinis, **itu momen belajar terbaik** —
  buka sumbernya bersama, dan bila memang keliru, laporkan agar diperbaiki.

---

## 8. Batasan yang jujur — sampaikan kepada mahasiswa

Menyatakan batas di awal mencegah salah-generalisasi:

- **Fisiologi disederhanakan.** Stabilitas pasien IGD adalah angka 0–100, bukan
  model hemodinamik. Cukup untuk melatih urutan prioritas, tidak untuk melatih
  titrasi.
- **Ini bukan pengganti pasien nyata.** Yang dilatih adalah penalaran,
  prioritas, dan kebiasaan sistem — bukan keterampilan prosedural atau
  komunikasi tatap muka.
- **Konteksnya Puskesmas Indonesia.** Beberapa keputusan (ketersediaan obat,
  jalur rujukan, kapitasi) tidak berlaku di sistem kesehatan lain.
- **Sebagian konten masih uji coba** (lihat §5) dan sengaja tidak menyumbang
  progres formal.

---

## 9. Bila terjadi masalah

| Gejala | Kemungkinan sebab & langkah |
|---|---|
| SmartScreen memblokir installer | Normal (belum bersertifikat). "More info" → "Run anyway". |
| Progres mahasiswa hilang | Save bersifat lokal per-komputer. Pastikan ia memakai komputer yang sama. Arsip manual (3 slot) dapat diekspor sebagai cadangan. |
| Banyak dossier "tidak dapat diverifikasi" | Hampir selalu ketidakseragaman versi. Samakan versi, minta ekspor ulang. |
| Ada yang tampak keliru secara klinis | Catat nama kasus + apa yang salah + apa yang seharusnya, lalu laporkan. Sertakan tangkapan layar bila ada. |
| Aplikasi berat/lambat di komputer mahasiswa | Laporkan spesifikasinya. Profil performa acuan ada di [PROFIL_PERFORMA_2026-08-02.md](./reports/PROFIL_PERFORMA_2026-08-02.md) — bila jauh lebih lambat dari itu, itu data berharga. |

---

## 10. Ringkasan satu halaman

1. Bagikan **tautan release**, ingatkan soal SmartScreen.
2. Latihan → **Karier**. Penilaian → **Ujian**, paket seragam, versi seragam.
3. Rapor punya **4 dimensi**; RRNS dan "cowboy" bersifat **gerbang**, bukan
   pengurang biasa.
4. Untuk nilai: minta **dossier**, verifikasi lewat **Alat Dosen**.
   "Tidak dapat diverifikasi" ≠ curang.
5. Debrief: **deskripsi → analisis → aplikasi**. Bahas keputusan, bukan angka.
6. Sampaikan batasannya sejak awal.
