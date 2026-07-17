# M11 Item #6 - Usulan Variasi Pedagogis yang Belum Dibangun

**Tanggal:** 2026-07-17<br>
**Snapshot:** `945ce39`, `REVISI_ENGINE=44`<br>
**Status:** proposal keputusan; **tidak mengubah gameplay**<br>
**Batas scope:** M11 #3 tetap ditolak/ditunda; M11 #7 dibahas terpisah.

## 1. Tujuan

Item #6 dalam histori M11 hanya berbunyi "variasi-variasi lainnya yang belum
terpikirkan". Dokumen ini mengubah ruang kosong tersebut menjadi lima opsi yang:

- belum menjadi mekanik aktif PRIMERA;
- menambah clinical reasoning atau continuity, bukan sekadar jumlah klik;
- dapat dipilotkan kecil sebelum diperluas;
- tidak menghidupkan kembali arc bercabang besar yang sudah ditolak;
- tidak mengubah PRIMERA menjadi simulasi administrasi.

## 2. Audit anti-duplikasi

PRIMERA sudah mempunyai anamnesis bertahap, diagnosis dan banding, pemeriksaan,
terapi-edukasi-disposisi, debrief EBM/realita, keluarga longitudinal, SAJI/MI,
KLB, Prolanis, SISRUTE/SBAR, PRB, karma, dan Dex SKDI. Karena itu opsi seperti
"tambah debrief", "tambah cabang cerita", atau "tambah kasus regional" saja
tidak cukup baru.

Audit juga menemukan dua ide yang **tidak** boleh diklaim baru: pilihan
`TEGAK/SUSPEK` sudah melatih sebagian kalibrasi diagnostik, sedangkan causal
receipt sudah menjadi scope dossier bridge tersendiri. Kesenjangan yang masih
nyata untuk item #6 adalah:

1. debrief sering menjelaskan jawaban benar tanpa membandingkannya dengan rival
   terdekat;
2. edukasi dinilai dari topik yang dipilih, belum dari pemahaman pasien;
3. hasil laboratorium umumnya tampil sebagai satu titik, bukan evolusi waktu;
4. jawaban anamnesis umumnya mempunyai satu suara, meski sumber dapat berbeda;
5. graceful degradation ada dalam teks, belum menjadi variasi keputusan yang
   dapat dipraktikkan.

Review virtual-patient 2025 melaporkan feedback sering fokus pada jawaban akhir
dan lebih jarang membahas problem representation, hypothesis generation, serta
justification ([Jay et al.](https://pubmed.ncbi.nlm.nih.gov/39485118/)). Ini
menjadi alasan memilih kualitas feedback dan transfer, bukan sekadar volume.

## 3. Ringkasan pilihan

| ID | Usulan | Nilai pedagogis | Beban pemain | Biaya | Status rekomendasi |
|---|---|---:|---:|---:|---|
| V1 | Duel diagnosis: "mengapa ini, bukan rival terdekat" | Tinggi | Rendah | Rendah-menengah | **Mulai pilot** |
| V2 | Teach-back/show-me pada edukasi berisiko tinggi | Tinggi | Rendah-menengah | Menengah | Pilot setelah V1 |
| V3 | Grafik dua titik: interpretasi tren klinis | Tinggi | Rendah-menengah | Menengah | Pilot formatif |
| V4 | Dua suara anamnesis: pasien dan pendamping | Tinggi | Menengah | Menengah-tinggi | Gelombang engine terpisah |
| V5 | Varian resource dan graceful degradation | Tinggi | Menengah | Menengah-tinggi | **Tahan; perlu gate RP1** |

## 4. V1 - Duel diagnosis dan debrief kontras

### Masalah

Mengetahui jawaban yang benar tidak sama dengan mengetahui pembeda yang membuat
diagnosis atau disposisi lain kalah. Tanpa kontras, pemain dapat menghafal clue
permukaan dan tetap rapuh pada vignette baru.

### Manifestasi minimum

Pada debrief kasus terpilih, tampilkan satu blok singkat:

```text
Keputusan: pneumonia berat, bukan bronkiolitis.
Pembeda: hipoksemia + tarikan dinding dada + usia/konteks kasus.
Apa yang akan membalik keputusan: wheeze dominan tanpa tanda bahaya.
```

Hanya satu rival terdekat dan maksimal tiga baris. Setelah **kedua** diagnosis
pernah dijumpai, Dex dapat membuka micro-duel satu pertanyaan: "temuan mana yang
paling membedakan?" Pilot 8 pasangan seperti Bell palsy vs stroke, dengue vs
chikungunya, atau tinea vs dermatitis. Kunci dua-entri mencegah spoiler.

### Nilai, biaya, risiko

- **Nilai:** memperkuat discriminating features dan transfer ke vignette baru.
- **Biaya:** 8-12 pasangan konten, satu registry display-only, dan satu komponen
  debrief/Dex. Registry tetap harus tercakup `CONTENT_RELEASE`/artefak integritas
  meski tidak mengubah answer-key klinis.
- **Revisi:** diperkirakan content release; tidak perlu `REVISI_ENGINE` bila
  murni display dan tidak masuk scoring/save. Kebijakan fingerprint tetap harus
  diperiksa saat RFC implementasi.
- **Risiko:** debrief memanjang. Guardrail: satu rival, <=55 kata, progressive
  disclosure.

### Acceptance pilot

- 8/8 pasangan menyebut pembeda yang benar-benar mengubah keputusan;
- tidak membocorkan jawaban sebelum kasus selesai;
- duel baru terbuka setelah kedua entri Dex ditemukan;
- median waktu <=25 detik;
- pemain dapat menyebut pembeda utama pada satu kasus transfer tertunda.

## 5. V2 - Teach-back/show-me UKP

### Masalah

Saat ini pemain memilih edukasi, tetapi pasien dianggap otomatis memahami.
Dalam layanan nyata, pertanyaan "sudah mengerti?" bukan verifikasi. AHRQ
mendefinisikan teach-back sebagai meminta pasien menjelaskan kembali dengan
kata-katanya sendiri dan show-me sebagai demonstrasi instruksi, misalnya teknik
inhaler ([AHRQ Tool 5](https://www.ahrq.gov/health-literacy/improve/precautions/tool5.html)).

### Manifestasi minimum

Tambahkan satu microstep **hanya** pada kasus education-critical:

- inhaler/spacer;
- ORS dan tanda bahaya diare anak;
- hipoglikemia/rule-of-15;
- antibiotik dan safety-net;
- insulin/obat berisiko;
- rencana pulang setelah rujuk balik.

Pemain memilih prompt non-shaming, lalu pasien mengulang atau memperagakan satu
aksi. Bila salah, pemain melakukan re-teach sekali; bukan menghukum pasien.

### Nilai, biaya, risiko

- **Nilai:** mengubah edukasi dari daftar topik menjadi komunikasi yang dapat
  diamati dan diperbaiki.
- **Biaya:** registry, renderer debrief, serta 6-8 payload bespoke.
- **Revisi:** pilot formatif tanpa skor/persistensi dapat tetap renderer-only.
  Bila kemudian masuk grade atau save, barulah perlu RFC, migrasi, dan bump
  `REVISI_ENGINE`.
- **Risiko:** terasa seperti kuis tambahan. Guardrail: tidak muncul di setiap
  kasus, maksimal satu siklus re-teach, bahasa menilai penjelasan dokter dan
  bukan kecerdasan pasien.

### Acceptance pilot

- 100% prompt tidak dapat dijawab sekadar ya/tidak;
- kegagalan pertama membuka re-teach, bukan penalti terminal;
- durasi tambahan median <=30 detik;
- tidak ada safe action yang dikalahkan hanya karena animasi/resource kosmetik.

## 6. V3 - Grafik dua titik

### Masalah

`PemeriksaanLab` dan hasil encounter terutama menyajikan satu hasil. Padahal
keputusan pada dengue, anemia, fungsi ginjal, respons terapi, atau kontrol PTM
sering bergantung pada arah perubahan dan konteks klinis, bukan satu angka.

### Manifestasi minimum

Di debrief, tampilkan dua titik waktu dan perubahan klinis, lalu satu pilihan:

```text
Hari 1: ... | Hari 3: ...
Membaik | Evaluasi ulang | Eskalasi
```

Pilot enam trajectory formatif. Setiap kartu wajib menyertakan gejala, waktu,
angka, unit, dan cue tindakan; angka tidak boleh berdiri sendiri.

### Nilai, biaya, risiko

- **Nilai:** melatih trajectory reasoning dan reassessment.
- **Biaya:** enam set data, physician review, dan komponen trend-strip sederhana.
- **Revisi:** tidak perlu bila micro-challenge pasca-kasus tidak dipersist atau
  dinilai. Integrasi ke disposisi live memerlukan engine dan `REVISI_ENGINE`.
- **Risiko:** number-chasing dan ilusi kausal dari dua angka. Guardrail: selalu
  sertakan konteks klinis dan lebih dari satu alasan eskalasi.

### Acceptance pilot

- 6/6 trajectory dan keputusan ditinjau dokter;
- unit, interval waktu, dan konteks klinis selalu terlihat;
- median waktu <=30 detik;
- pemain dapat menjelaskan arah perubahan, bukan sekadar memilih angka ekstrem.

## 7. V4 - Dua suara anamnesis

### Masalah

Kasus dapat menandai keluhan berasal dari pendamping, tetapi jawaban anamnesis
berikutnya umumnya tetap satu suara. Pada pediatri, geriatri, gangguan kognitif,
atau jiwa, perbedaan pasien-wali adalah bagian reasoning yang belum dimainkan.

### Manifestasi minimum

Pilot tiga kasus. Setiap jawaban kritis berlabel `pasien` atau `wali`, maksimal
satu ketidaksesuaian bermakna, dan pemain memperoleh satu aksi klarifikasi.
Tidak ada datum wajib yang disembunyikan tanpa jalur untuk menemukannya.

### Nilai, biaya, risiko

- **Nilai:** melatih source appraisal dan collateral history; sangat imersif.
- **Biaya:** field narasumber, validator, UI anamnesis, aksi klarifikasi, dan
  authoring tiga kasus.
- **Revisi:** perubahan type/state dan alur anamnesis; perlu RFC, release,
  migrasi bila perlu, test, dan bump `REVISI_ENGINE`.
- **Risiko:** kebingungan, stereotip wali, atau dead-end. Guardrail: satu konflik,
  attribution selalu terlihat, klarifikasi tersedia sebelum penilaian.

### Acceptance pilot

- tiga kasus mewakili populasi berbeda;
- tambahan waktu median <60 detik;
- 100% data kritis mempunyai sumber yang terlihat;
- zero dead-end dan pemain dapat menjelaskan alasan klarifikasi.

## 8. V5 - Varian graceful degradation

### Masalah

Catatan realita menjelaskan bahwa alat, stok, internet, transport, dan tenaga
tidak selalu siap. Pemain belum banyak berlatih mempertahankan safety floor saat
satu kemampuan hilang.

### Manifestasi yang mungkin

Satu kasus tracer mempunyai dua authored setup yang **dinyatakan sebelum
penilaian**:

1. resource inti siap;
2. satu resource non-esensial tidak siap, sehingga pemain harus memilih jejaring,
   alternatif aman, atau rujuk tanpa menunda.

Tidak ada random stockout tersembunyi. Batas klinis PPK/PNPK tetap sama.

### Nilai, biaya, risiko

- **Nilai:** melatih adaptive expertise dan graceful degradation nyata.
- **Biaya:** content matrix dan kemungkinan variant selector.
- **Revisi:** belum boleh diputuskan. `M13-RP1` secara eksplisit menunda
  `FacilityResourceProfile` runtime; implementasi engine memerlukan RFC baru.
- **Risiko:** hidden curriculum kelangkaan, stereotip wilayah, dan standar ganda
  kasus lama-baru.

### Gate sebelum pilot

- bukti resource harus berasal dari ASPAK/Fornas/KFA dan riset lokal yang sah;
- ketiadaan resource diumumkan sebelum pilihan;
- clinical score dipisahkan dari resilience response;
- tidak menggunakan studi lokal sebagai probabilitas nasional;
- physician review untuk semua jalur alternatif.

## 9. Rekomendasi urutan

1. **Setujui V1 untuk pilot 8 pasangan.** Nilai/biayanya paling baik dan
   tidak memerlukan mekanik baru bila renderer existing cukup.
2. **Pilot V2 pada 6-8 kasus** sebagai debrief formatif setelah V1 tidak
   menimbulkan overload.
3. **Uji V3 enam trajectory** bila pilot pertama tidak menambah fatigue.
4. **Tahan V4 untuk gelombang engine tersendiri** setelah P1-P2 terbukti.
5. **Tahan V5** sampai keputusan terpisah membuka kembali batas M13-RP1.

Paket yang paling seimbang bukan kelimanya sekaligus. Kombinasi V1 + V2 sudah
cukup untuk pilot pertama tanpa menambah klik ke seluruh pool aktif. Causal
receipt dan loop UKM-UKP tetap dinilai melalui dossier bridge, bukan dihitung
ulang sebagai variasi M11 #6.

## 10. Keputusan yang diminta

Untuk tiap opsi, pilih `setuju pilot`, `revisi`, `tunda`, atau `tolak`. Persetujuan
dokumen ini **tidak otomatis** memberi izin implementasi engine; V2-V5 tetap
memerlukan RFC/gate sesuai klasifikasi di atas.
