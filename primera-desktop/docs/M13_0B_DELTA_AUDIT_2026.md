# M13-0B Source Registry & Delta Audit 2026

Tanggal audit teknis: 2026-07-14
Status: **SELESAI, exit gate M13-0B terpenuhi**

## 1. Ringkasan Eksekutif

Audit sumber primer dan pemetaan klaim telah selesai untuk empat kasus wajib:

1. `hipertensi_esensial`
2. `dm_tipe2`
3. `stroke_iskemik`
4. `saraf_epilepsi_kejang`

Hasil terstruktur:

| Ukuran | Hasil |
|---|---:|
| Sumber primer terdaftar | 8 |
| Artefak full-text lokal terverifikasi SHA-256 | 8 |
| Delta kasus | 4 |
| Klaim per kasus | 8 |
| Total `EvidenceBinding` audit | 32 |
| Klaim selaras | 13 |
| `coverage_gap` | 7 |
| `content_conflict` | 11 |
| `source_conflict` | 1 |
| Klaim material | 17 |
| Physician sign-off | 4/4 |
| Status final binding audit | 16 `resolved`; 16 `accepted_with_limitation` |

Angka temuan di atas adalah hasil audit pra-koreksi dan dipertahankan sebagai jejak
adjudikasi. Setelah physician sign-off, koreksi medis runtime diterapkan; delta HT dan
DM2 berstatus `accepted_with_limitation`, sedangkan stroke dan epilepsi `resolved`.
Binding baseline lain tetap `pending`; M13-0B bukan audit seluruh library.

## 2. Metode dan Batas Klaim

- Sumber diambil dari situs resmi Kementerian Kesehatan/JDIH/e-Fornas.
- PDF sumber di-hash tetapi tidak dimasukkan ke Git. Full-text hasil ekstraksi mekanis
  disimpan di `docs/references/` dan di-hash terpisah.
- Setiap kasus diperiksa pada delapan facet: ambang diagnosis, red flags, assessment,
  regimen, kontraindikasi/keselamatan, disposisi, follow-up, dan formularium.
- Audit teknis dapat menetapkan konflik dan usulan resolusi, tetapi tidak menggantikan
  clinical judgment atau physician sign-off.
- Locator memakai nomor halaman PDF literal, bukan nomor baris hasil ekstraksi.

## 3. Registry Sumber

| ID | Dokumen | Status | Populasi/cakupan | Catatan |
|---|---|---|---|---|
| `doen:kmk-6477-2021` | [KMK 6477/2021](https://farmalkes.kemkes.go.id/unduh/kepmenkes-6477-2021/) | tidak berlaku | Historis: RS dan Puskesmas | Dicabut oleh 2197/2023; p. 29 tetap mencantumkan glibenklamid untuk Puskesmas |
| `pnpk:hipertensi-dewasa-303-2026` | [KMK 303/2026](https://keslan.kemkes.go.id/unduhan/fileunduhan1780387327_362636.pdf) | aktif | Dewasa, lintas faskes/FKTP | Menggantikan 4634/2021 |
| `pnpk:dm-tipe2-dewasa-302-2026` | [KMK 302/2026](https://keslan.kemkes.go.id/unduhan/fileunduhan1777518085_672976.pdf) | aktif | DM2 dewasa | Menggantikan 603/2020 |
| `pnpk:stroke-304-2026` | [KMK 304/2026](https://keslan.kemkes.go.id/unduhan/fileunduhan1780387545_996111.pdf) | aktif dengan keterbatasan | Suspek/diagnosis stroke | Nomor dan katalog menyebut 2026, tetapi halaman tanda tangan literal bertanggal 17 April 2025 |
| `pnpk:epilepsi-dewasa-274-2026` | [KMK 274/2026](https://keslan.kemkes.go.id/unduhan/fileunduhan1776933600_244772.pdf) | aktif | Epilepsi dewasa | Tidak boleh dipakai tanpa batas untuk usia 12-17 |
| `pnpk:epilepsi-anak-367-2017` | [KMK 367/2017](https://kemkes.go.id/app_asset/file_content_download/17012284626566afae5c5401.03284559.pdf) | aktif dengan keterbatasan | Epilepsi anak | Belum ditemukan pencabutan/pengganti formal; ketiadaan temuan bukan bukti status final |
| `ppk:kmk-1936-2022` | [KMK 1936/2022](https://jdih.kemkes.go.id/storage/documents/pdfs/2022kepmenkes1936.pdf) | mengamandemen baseline aktif | Dokter di FKTP | Mengubah bagian hipertensi, stroke, dan DM2 pada 1186/2022 |
| `fornas:kmk-1199-2025` | [KMK 1199/2025](https://e-fornas.kemkes.go.id/api/download?column=pustaka&filename=KMK%20No.%20HK.01.07-MENKES-1199-2025%20ttg%20Formularium%20Nasional.pdf) | aktif sejak 2026-04-01 | JKN/FPKTP sesuai entri | Menggantikan 2197/2023 dan perubahan 1818/2024 |

Metadata lengkap, URL, ukuran, hash full-text, dan hash PDF ada di
`src/content/curriculum/sourceRegistry.ts`.

## 4. Delta Hipertensi Esensial

Baseline: usia 45-65, riwayat hipertensi, TD 160/95, dislipidemia, tidak dirujuk,
amlodipin ditambah kaptopril atau hidroklorotiazid.

| Facet | Verdict | Inti temuan | Resolusi yang diusulkan |
|---|---|---|---|
| Diagnosis | aligned | Riwayat diagnosis dan TD derajat 2 mendukung I10 | Pertahankan; pertegas teknik/konfirmasi TD saat revisi |
| Red flags | coverage gap, minor | Nyeri dada/pandangan ditanya, tetapi defisit neurologis dan sesak akut belum eksplisit | Tambah satu pertanyaan red flag ringkas |
| Assessment | coverage gap, material | Tidak ada fungsi ginjal/elektrolit sebelum opsi ACEi/tiazid | Tambah hasil fungsi ginjal; putuskan kebutuhan elektrolit vs keterbatasan jejaring |
| Regimen | aligned | Kombinasi awal RAS blocker + CCB/diuretik sesuai PNPK pp. 40-41 | Pertahankan setelah assessment keselamatan lengkap |
| Kontraindikasi | coverage gap, material | Data renal dan kontraindikasi individual belum tertutup | Lengkapi data renal/demografi relevan |
| Disposisi | source conflict, material | PNPK menyebut HT umumnya ditangani FKTP, tetapi daftar rujuk p. 86 memasukkan dislipidemia dan bahkan “hipertensi” | Pertahankan no-referral hanya dengan waiver dokter tertulis |
| Follow-up | aligned | Kontrol, kepatuhan, target, dan konsekuensi sudah termodelkan | Pertahankan; interval dapat tetap naratif |
| Formularium | aligned | Amlodipin, HCT, kaptopril tercantum FPKTP pada Fornas pp. 152-153 | Tidak perlu substitusi |

**Resolusi HT yang disetujui:** tambah `fungsi_ginjal`; jangan menambah elektrolit sebagai
tes wajib pada putaran ini; pertahankan terapi kombinasi dan no-referral untuk pasien
stabil; catat waiver bahwa wording rujukan PNPK/PPK tidak selaras dengan algoritme
tata laksana FKTP di dokumen yang sama.

## 5. Delta Diabetes Melitus Tipe 2

Baseline: usia 40-62, gejala klasik, GDS 258, GDP 182, HbA1c 8,9%, keton negatif,
penurunan BB 5 kg/2 bulan disertai polifagi dan mukosa agak kering, tidak dirujuk,
metformin + glimepirid.

| Facet | Verdict | Inti temuan | Resolusi yang diusulkan |
|---|---|---|---|
| Diagnosis | aligned | Gejala klasik dan tiga kriteria laboratorium mendukung E11.9 | Pertahankan setelah cue dekompensasi dibersihkan |
| Red flags | content conflict, material | Penurunan BB tanpa sengaja + polifagi + poliuria/polidipsia membuat jalur katabolik/dekompensasi ambigu | Ubah menjadi tidak ada penurunan BB bermakna; hilangkan kesan dehidrasi |
| Assessment | coverage gap, material | Fungsi ginjal belum ada sebelum metformin | Tambah hasil `fungsi_ginjal` yang aman untuk metformin |
| Regimen | content conflict, material | HbA1c 8,9% cocok kombinasi 2 OAD hanya bila tanpa dekompensasi | Pertahankan dua OAD setelah vignette dinormalisasi |
| Kontraindikasi | coverage gap, material | LFG dan mitigasi hipoglikemia sulfonilurea tidak tertutup | Tambah fungsi ginjal dan edukasi hipoglikemia kritis |
| Disposisi | content conflict, material | No-referral tidak bersih selama tanda katabolik masih ada | Normalisasi vignette atau ubah total ke jalur rujuk/injeksi; opsi minimal adalah normalisasi |
| Follow-up | coverage gap, minor | Kontrol rutin ada, tetapi keselamatan hipoglikemia tidak spesifik | Tambah topik kenali/tangani hipoglikemia |
| Formularium | content conflict, material | Fornas p. 134 mencantumkan metformin, glimepirid, dan glibenklamid di FPKTP; DOEN 2021 p. 29 juga memuat glibenklamid dan kini sudah tidak berlaku | Hapus alasan “tidak ada”; dokter menentukan apakah glibenklamid alternatif sah atau non-preferred karena risiko hipoglikemia |

**Resolusi DM yang disetujui:** pertahankan archetype kombinasi OAD stabil; ubah jawaban BB
menjadi tanpa penurunan bermakna, hilangkan mukosa kering, tambah fungsi ginjal, dan
buat edukasi hipoglikemia sebagai edukasi kritis. Hapus alasan formularium yang
salah; glibenklamid tetap non-preferred dengan penalti ringan `nonPrimer` karena
risiko hipoglikemia lebih tinggi, bukan karena tidak tersedia.

## 6. Delta Stroke

Baseline: wake-up stroke, last-known-well malam sebelumnya, defisit fokal, TD
190/100, GDS 138, belum ada CT, tetapi nama/ICD sudah `Stroke Iskemik`/I63.9.

| Facet | Verdict | Inti temuan | Resolusi yang diusulkan |
|---|---|---|---|
| Diagnosis | content conflict, material | CT nonkontras adalah pemeriksaan awal untuk membedakan iskemik vs perdarahan | Pertahankan id teknis; ubah nama ke Suspek Stroke Akut dan ICD ke I64 sampai CT |
| Red flags | aligned | FAST, last-known-well, dan cek glukosa sudah ada | Pertahankan |
| Assessment | aligned | ABC, defisit neurologis, waktu, dan glukosa tepat untuk FKTP | Pertahankan tanpa menganggap no-CT sebagai bukti iskemik |
| Regimen | content conflict, material | `panduanResmi` masih menyebut cairan rutin 500 ml/12 jam dari PPK; PNPK p. 28 membatasi kristaloid pada dehidrasi/pre-syok/syok | Ubah cairan menjadi kondisional; tetap nol obat definitif |
| Kontraindikasi | content conflict, material | Ambang permisif ditulis seolah iskemik pasti; larangan antiplatelet/antikoagulan pra-CT belum eksplisit | Gunakan bahasa netral subtipe: jangan turunkan TD agresif dan jangan beri antitrombotik pra-pencitraan |
| Disposisi | aligned, minor | Rujuk segera benar; target keberangkatan <=30 menit belum eksplisit | Tambah target <=30 menit pada materi ajar |
| Follow-up | aligned | Handoff terdokumentasi tepat untuk fase FKTP akut | Pertahankan; terapi sekunder menunggu hasil imaging |
| Formularium | aligned | Jawaban benar memang tidak memerlukan obat stroke definitif pra-CT | Pertahankan `obatBenar: []` |

**Resolusi stroke yang disetujui:** ubah label klinis/ICD menjadi suspek stroke akut/I64,
perbarui narasi cairan, TD, dan antitrombotik sesuai PNPK 304/2026, serta pertahankan
rujuk segera dengan target keberangkatan <=30 menit.

## 7. Delta Epilepsi

Baseline: usia 12-30, tiga kejang tanpa provokasi/2 bulan, episode sekitar 2 menit
dan telah berhenti, cue “diam menatap” sebelum kejang bilateral, wajib diazepam
rektal 10 mg, tidak memulai OAB, lalu rujuk.

| Facet | Verdict | Inti temuan | Resolusi yang diusulkan |
|---|---|---|---|
| Diagnosis | content conflict, material | Usia melintasi PNPK anak/dewasa dan cue menatap dapat menyiratkan onset fokal | Batasi kasus existing ke 18-30, netralkan pendamping, hapus cue menatap atau ubah klasifikasi |
| Red flags | content conflict, material | Rescue diberikan saat bangkitan masih terjadi; >5 menit/berulang tanpa pulih memicu rujuk segera, bukan pemberian otomatis setelah episode 2 menit selesai | Ajarkan rescue aktif sesuai protokol, bukan tindakan wajib saat ini |
| Assessment | coverage gap, material | Darah rutin/GDS belum menutup elektrolit dan fungsi organ; interpretasi populasi campur | Setelah dewasa dikunci, tambah/jejaringkan elektrolit, renal, dan hepar secara proporsional |
| Regimen | content conflict, material | Diazepam rektal wajib pada pasien stabil pascakejang tidak sesuai indikasi encounter | Hapus dari obat wajib; pertahankan tidak memulai OAB dan rujuk |
| Kontraindikasi | content conflict, material | Rute/dosis/usia/status respirasi dan kejang aktif menentukan keamanan; rektal bukan default 12-30 | Defer archetype anak sampai regimen/rute/kewenangan lokal jelas |
| Disposisi | aligned | Epilepsi baru dirujuk untuk klasifikasi/terapi; FKTP melanjutkan via rujuk balik | Pertahankan |
| Follow-up | aligned, minor | Edukasi keselamatan dan rujuk balik sesuai arah pedoman | Pertegas mekanisme rujuk balik setelah populasi dikunci |
| Formularium | aligned | Fornas pp. 19-20 memuat diazepam enema 5/10 mg di FPKTP, maksimal 2 tube/hari bila kejang | Pertahankan `fornas: true`; masalahnya indikasi, bukan ketersediaan |

**Resolusi epilepsi yang disetujui:** batasi kasus existing ke dewasa 18-30, gunakan bahasa
pendamping netral, hapus cue menatap, hapus diazepam rektal sebagai obat wajib,
pertahankan rujuk tanpa memulai OAB, dan defer archetype anak terpisah ke authoring
berikutnya. Diazepam enema tetap berstatus
Fornas, tetapi tidak menjadi jawaban wajib setelah kejang singkat telah berhenti.

## 8. Temuan Lintas Sistem

Field `fornas` pada katalog obat saat ini tidak dibaca renderer formularium. Ini tetap
merupakan keterbatasan label UI secara umum, tetapi bukan blocker diazepam enema:
sediaan itu memang tercantum FPKTP pada Fornas aktif. Blocker epilepsi adalah indikasi
rescue yang tidak sesuai state pasien. Audit juga menemukan komentar/rationale DM
masih bertumpu pada DOEN 2021 yang sudah dicabut dan salah membaca daftar Puskesmas
di dalamnya.

## 9. Paket Physician Sign-off

| Delta | Rekomendasi | Waiver/keputusan yang diperlukan | Status |
|---|---|---|---|
| HT | Tambah renal; pertahankan kombinasi dan no-referral | Waiver konflik internal kriteria rujuk HT/dislipidemia | `accepted_with_limitation` |
| DM2 | Normalisasi nonkatabolik; tambah renal + edukasi hipoglikemia; koreksi rationale glibenklamid | Glibenklamid non-preferred dengan penalti proporsional | `accepted_with_limitation` |
| Stroke | Suspek stroke akut/I64; koreksi stabilisasi dan rujuk <=30 menit | Tidak memberi subtipe sebelum CT | `resolved` |
| Epilepsi | Existing case dewasa-only; hapus diazepam rektal wajib; pertahankan status Fornas; defer anak | Pemisahan populasi dan deferral child archetype | `resolved` |

Physician sign-off diterima pada 2026-07-14 dari **dr. Anak Agung Bagus Wirayuda**,
Dokter dan penanggung jawab klinis PRIMERA. Pernyataan tertulis menyetujui seluruh
rekomendasi M13-0B untuk HT, DM2, stroke, dan epilepsi, termasuk waiver yang
disebutkan. Keputusan dan catatan per-delta disimpan di `m13DeltaAudit.ts` dan
dipropagasikan ke seluruh 32 `EvidenceBinding`.

## 10. Exit Gate

M13-0B baru boleh ditutup bila seluruh kondisi berikut terpenuhi:

- [x] Empat kasus diaudit terhadap sumber primer terbaru yang ditetapkan.
- [x] Locator, populasi, facet, hash artefak, dan status delta tercatat.
- [x] Setiap delta memiliki status terminal non-blocking.
- [x] Physician sign-off tercatat untuk 4/4 delta.
- [x] Konflik material diperbaiki atau mendapat waiver tertulis.
- [x] Binding diubah menjadi `resolved`/`accepted_with_limitation` sesuai hasil.
- [x] Targeted test, full suite, typecheck, build, dan freeze/fingerprint test hijau setelah perubahan konten.

Dengan state final, `evaluasiM13EvidenceGate()` menghasilkan `ready: true` tanpa
blocked, unsigned, atau non-terminal delta.

## 11. Baseline Verifikasi Pra-sign-off

Baseline teknis sebelum koreksi konten medis runtime:

- Full suite: **73 file / 804 test lulus**.
- Typecheck: lulus.
- Production build: lulus.
- Freeze/fingerprint: **16/16 test lulus**; tidak ada perubahan freeze pada tahap ini.
- `git diff --check`: bersih.

Baseline ini bukan exit gate M13-0B. Seluruh pemeriksaan harus diulang setelah
physician sign-off diterapkan ke konten, binding, dan status gate.

## 12. Implementasi dan Verifikasi Pascasign-off

Koreksi yang diterapkan:

- HT: pertanyaan red flag dan status kehamilan, fungsi ginjal, sumber/narasi 2026,
  serta waiver no-referral yang eksplisit.
- DM2: vignette nonkatabolik, fungsi ginjal, topik dan gate edukasi hipoglikemia,
  serta rationale glibenklamid yang faktual dengan penalti ringan.
- Stroke: nama `Suspek Stroke Akut`, diagnosis primer I64, cairan kondisional,
  larangan antitrombotik pra-pencitraan, dan target berangkat <=30 menit.
- Epilepsi: populasi dewasa 18-30, cue onset yang koheren, elektrolit dasar,
  nol benzodiazepin wajib setelah bangkitan berhenti, rujuk tanpa memulai OAB,
  dan deferral archetype anak.

Verifikasi final:

- Targeted curriculum/evidence tests: **20/20 lulus**.
- Targeted pack/anamnesis/diagnosis-label tests: **74/74 lulus**.
- Full suite: **73 file / 805 test lulus**.
- Typecheck: lulus.
- Production build: lulus.
- Freeze/fingerprint engine: **16/16 test lulus**; tidak ada file engine beku diubah.

## 13. Batas Aktivasi dan Temuan Lanjutan

Perubahan 0B ini mengubah konten decision-facing dan replay-scoring di `PACK`.
Mekanisme runtime `CONTENT_RELEASE` baru dibangun pada M13-0C, sehingga checkpoint
0B adalah **development checkpoint dan tidak boleh didistribusikan ke kohort**.
M13-0C harus menetapkan initial content release, migrasi save legacy, dan proteksi
dossier sebelum build ini boleh menjadi rilis kohort.

Stempel diagnosis `TEGAK` vs `SUSPEK` saat ini dicatat sebagai kalibrasi umum,
tetapi engine belum punya expected-confidence per archetype. Karena itu label I64 dan
materi stroke sudah netral-subtipe, namun pilihan stempel `SUSPEK` belum dipaksa oleh
scoring. Ini dicatat sebagai keterbatasan pedagogis non-blocking dan tidak diselipkan
sebagai perubahan `clinic.ts` pada milestone 0B.
