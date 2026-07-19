# Audit Editorial dan UX Bahasa PRIMERA

**Tanggal:** 19 Juli 2026  
**Cakupan:** UKP, IGD, UKM, pedagogi formatif, debrief klinis, dan bahasa antarmuka  
**Status:** audit statis + perbaikan terverifikasi; belum menggantikan uji keterpahaman pada mahasiswa

## Ringkasan Eksekutif

Audit mencakup 9.128 bidang teks runtime dari 210 kasus poli, 20 kasus IGD, 16 keluarga binaan dengan 27 kunjungan UKM, delapan Duel Diagnosis, dan delapan latihan Teach-back. Pemeriksaan otomatis dipadukan dengan pembacaan literal pada semua temuan berisiko tinggi serta permukaan yang paling padat secara kognitif.

Pada baseline, audit menemukan 50 masalah berisiko tinggi dan lebih dari 800 sinyal kepadatan atau gaya. Setelah perbaikan, tidak tersisa masalah berisiko tinggi maupun cacat struktur. Sisa 80 sinyal seluruhnya berupa kapital untuk penekanan, terutama kata seperti `JANGAN` pada peringatan keselamatan. Sinyal tersebut dipertahankan sebagai bahan review editorial, bukan kegagalan build.

**Skor gabungan pascaperbaikan: 8,5/10.** Angka ini menilai mutu naskah dan penyajiannya, bukan membuktikan hasil belajar. Validasi pedagogis akhir tetap memerlukan playtest mahasiswa.

## Metode

Audit menggunakan empat lapisan:

1. **Inventarisasi runtime.** Teks yang benar-benar dapat dilihat pemain dikumpulkan dari UKP, IGD, UKM, modul pedagogi, serta debrief.
2. **Heuristik terukur.** Pemeriksaan meliputi panjang bidang, panjang kalimat, jargon medis di mulut pasien, pertanyaan bertumpuk, tanda baca, keseimbangan kutip/kurung, dan kapital berlebihan.
3. **Review literal prioritas.** Semua temuan berisiko tinggi dibaca dalam konteks klinis dan alur permainan. Penyederhanaan tidak boleh mengubah diagnosis, dosis, urutan stabilisasi, disposisi, atau sumber acuan.
4. **Regresi.** Pagar editorial baru memeriksa korpus yang sama di CI. Test EBM yang sudah ada tetap dijalankan untuk menangkap detail klinis yang mungkin terpotong saat penyuntingan.

Ambang praktis yang dipakai bukan rumus keterbacaan Bahasa Indonesia yang belum tervalidasi untuk konteks ini. Ambang berfungsi sebagai pemicu review, bukan vonis otomatis:

| Register | Batas bidang | Batas kalimat |
|---|---:|---:|
| Ucapan pasien | 60 kata | 36 kata |
| Pertanyaan/perintah dokter | 55 kata | 34 kata |
| Debrief klinis | 140 kata | 45 kata |
| Narasi/data klinis | 120 kata | 48 kata |

## Skor Pascaperbaikan

| Dimensi | Skor | Penilaian |
|---|---:|---|
| Pembuka vignette dan narasi klinis | 8,4 | Umumnya konkret dan segera memberi orientasi; vignette IGD terpadat sudah diringkas. |
| Susunan pertanyaan anamnesis | 8,6 | Pembuka tersedia pada 210/210 kasus; pertanyaan bertumpuk yang terdeteksi sudah dipecah atau dirumuskan ulang. |
| Jawaban pasien dan dialog | 8,7 | Jargon klinis pada register pasien dijaga oleh invariant; gaya UKM tetap memiliki karakter tanpa mengorbankan kejelasan. |
| Mutiara klinis/EBM | 8,4 | Isinya lebih mudah dipindai dan paragraf panjang dipecah pada batas kalimat; kepadatan konsep tetap perlu diuji pada mahasiswa. |
| Realita FKTP dan panduan resmi | 8,2 | Otoritas, konteks sumber, dan batas fasilitas tetap jelas; istilah regulasi memang tidak seluruhnya dapat disederhanakan. |
| Skenario dan intervensi UKM | 8,7 | Instruksi menjadi lebih pendek, operasional, dan mudah dibandingkan tanpa menghilangkan konteks keluarga. |
| Bahasa mekanik dan umpan balik | 8,8 | Istilah internal seperti RRNS, firewall, churn, receipt, dan loop diganti dengan konsekuensi yang langsung dipahami. |
| Beban kognitif dan aksesibilitas teks | 8,5 | Teks panjang kini dibagi menjadi paragraf pada batas kalimat tanpa mengubah isi; struktur semantik tetap terjaga. |

## Perubahan Utama

### 1. Debrief klinis

- Mutiara Klinis, Mutiara EBM, Realita FKTP, dan Panduan Resmi menggunakan renderer `TeksTerbaca`.
- Renderer hanya memecah teks pada batas kalimat. Isi, urutan, angka, dan sitasi tidak diparafrase secara otomatis.
- Ringkasan berisiko padat pada status epileptikus, luka bakar luas, asfiksia neonatorum, organofosfat, gigitan ular, syok sepsis, eklampsia, dan pneumotoraks tensi disunting manual.

### 2. Anamnesis dan bahasa pasien

- Setiap kasus poli wajib memiliki `keluhanUtama`, pertanyaan kategori `keluhan_utama`, dan jawaban pembuka yang tidak kosong.
- Pertanyaan dengan banyak klausa dan tiga tanda tanya pada glaukoma, hemoroid, dan penyakit ginjal kronik dirumuskan menjadi satu fokus percakapan.
- Guard jargon pasien diperluas secara konseptual melalui audit lintas permukaan, termasuk variasi persona dan respons UKM.

### 3. UKM

- Kartu intervensi keluarga dipadatkan menjadi langkah yang dapat dilakukan, siapa pelakunya, dan hasil yang diharapkan.
- Dialog tetap mempertahankan latar budaya dan suara tokoh, tetapi mengurangi kalimat berputar serta penjelasan yang terlalu panjang.
- Istilah mekanik jembatan UKM-UKP diubah menjadi bahasa tindakan: `Jejak Kesinambungan`, `Kabar rujukan`, `tindak lanjut tuntas`, dan `langkah berikutnya`.

### 4. Antarmuka

- `Encounter` menjadi `Konsultasi`, `guideline` menjadi `panduan`, dan pesan skor menjelaskan akibatnya tanpa jargon engine.
- Pesan alergi menerangkan perbedaan antara pengaman permainan dan praktik nyata.
- Duel Diagnosis dan Teach-back tetap memakai nama metode saat merujuk sumber, tetapi instruksi pemain memakai Bahasa Indonesia alami seperti `demonstrasi ulang` dan `ajarkan kembali`.

## Contoh Sebelum dan Sesudah

| Sebelum | Sesudah |
|---|---|
| `Rujukan non-spesialistik - menggerus RRNS` | `Rujukan tidak sesuai tujuan layanan` |
| `Percobaan resep kontraindikasi diblokir firewall` | `Resep kontraindikasi dicegah sistem` |
| `Topik edukasi non-negotiable ... skor di-cap` | `Topik edukasi wajib ... skor edukasi dibatasi` |
| `Receipt rujukan ... loop masih terbuka` | `Kabar rujukan ... rangkaian tindak lanjut masih terbuka` |
| `Show-me teknik inhaler` | `Demonstrasi ulang teknik inhaler` |

## Pagar Permanen

Perintah berikut menghasilkan laporan JSON yang dapat ditelusuri:

```powershell
npm.cmd run audit:editorial
```

Test `editorialQuality.test.ts` menggagalkan CI bila muncul:

- temuan berisiko tinggi;
- cacat tanda baca atau struktur;
- jargon medis terlarang di register pasien;
- pertanyaan anamnesis bertumpuk;
- kasus poli tanpa pembuka yang dapat dijawab.

Kapital berlebihan tetap dilaporkan sebagai advisory agar penyunting dapat membedakan penekanan keselamatan yang sah dari teriakan visual yang tidak perlu.

## Batas dan Langkah Berikutnya

Audit ini tidak mengukur waktu baca, recall, beban mental subjektif, atau apakah mahasiswa benar-benar memahami hubungan sebab-akibat. Karena itu, skor belum boleh dipakai sebagai bukti efektivitas pendidikan.

Uji berikutnya yang direkomendasikan:

1. Lima sampai delapan mahasiswa membaca sampel UKP, IGD, dan UKM sambil melakukan think-aloud.
2. Catat waktu menemukan keputusan kunci, bagian yang dibaca ulang, dan istilah yang perlu ditanyakan.
3. Setelah debrief, minta mahasiswa menjelaskan kembali alasan diagnosis, tindakan, dan jembatan UKM-UKP tanpa melihat teks.
4. Target awal: sekurangnya 80% peserta menemukan keputusan utama tanpa bantuan dan dapat menjelaskan hubungan tindakan-hasil dengan benar.

Kesimpulannya, bahasa PRIMERA kini layak masuk tahap playtest kelas: masalah editorial berat sudah ditutup, mekanik dijelaskan dengan bahasa yang lebih manusiawi, dan regresi otomatis mencegah kemunduran. Risiko terbesar yang tersisa bukan lagi cacat kalimat, melainkan apakah kepadatan materi terasa tepat ketika dimainkan dalam tempo kelas nyata.
