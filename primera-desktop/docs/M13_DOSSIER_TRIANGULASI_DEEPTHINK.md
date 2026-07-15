# DOSSIER TRIANGULASI M13 - Kurikulum, EBM, Gameplay, dan Adjudikasi M13-1a

> **Untuk:** DeepThink, sebagai reviewer independen strategi klinis-pedagogis,
> implementasi FKTP, arsitektur kurikulum, dan kebijakan aktivasi. DeepThink
> diminta memberi analisis dan rekomendasi, bukan menandatangani persetujuan
> klinis atau mengubah kode.
>
> **Tanggal basis operatif:** 2026-07-15
>
> **Repositori eksperimen:** `D:\Dev\PRIMER-CODEX-lab\primera-desktop`
>
> **Branch / HEAD:** `codex-gpt56-experiment` / `59afc01`
>
> **Baseline aktif:** `CONTENT_RELEASE = m13-0c-2026-07-14`;
> `REVISI_ENGINE = 34`; Exam Blueprint `m13-0d-v1`.
>
> **Rilis usulan, belum aktif:** `m13-1a-pilot-2026-07-15`.
>
> **Status teknis checkpoint:** M13-0A, 0B, 0C, dan 0D sudah selesai dan
> committed. M13-1a baru berupa draf authoring terisolasi: 6 kasus poli, 1 IGD,
> dan 1 skenario UKM. Draf belum masuk `PACK`, belum mengubah pool Karier/Ujian,
> belum membump `CONTENT_RELEASE`, dan belum memiliki physician sign-off.
> Checkpoint terakhir lulus 76 file / 845 test, freeze 17/17, typecheck, dan
> production build.

Dokumen ini mandiri. Pembaca tidak perlu mengikuti seluruh percakapan M10-M13.
Bagian operatif di bawah adalah permintaan triangulasi baru untuk delapan
keputusan M13-1a. Bagian setelah judul **Lampiran historis** mempertahankan
dossier pra-eksekusi 13 Juli 2026 sebagai jejak keputusan; angka atau status di
lampiran tidak boleh diperlakukan sebagai baseline terkini bila bertentangan
dengan bagian operatif ini.

**Jalur baca cepat DeepThink:** baca A0-A1 untuk mandat dan state, A5 untuk
delapan adjudikasi, A6-A7 untuk blocker serta pola lintas kasus, dan A8 untuk
format jawaban. A2-A4 dan A9-A12 menyediakan provenance, metode, serta gate.
Lampiran historis hanya diperlukan bila alasan di balik Decision Lock perlu
ditelusuri kembali.

---

## A0. Mandat, tujuan, dan batas wewenang

### Mandat

Dr. Anak Agung Bagus Wirayuda meminta agar delapan pertanyaan physician review
M13-1a disusun menjadi dossier triangulasi yang lengkap. DeepThink diminta
menilai tiap pertanyaan dari empat sisi sekaligus:

1. akurasi klinis dan keselamatan berdasarkan bukti;
2. relevansi standar Indonesia dan praktik nyata FKTP;
3. kualitas pedagogi serta beban kognitif pemain;
4. kecukupan representasi mekanik game sebelum konten diaktifkan.

### Tujuan keputusan

Tujuan tahap ini bukan mencari jawaban yang paling panjang atau menjejalkan
seluruh guideline ke satu encounter. Tujuannya adalah menentukan **minimum
clinically complete** untuk tiap kasus: cukup lengkap untuk tidak menanamkan
model mental berbahaya, cukup realistis untuk konteks FKTP, dan cukup fokus agar
mahasiswa masih dapat memahami keputusan inti yang sedang dilatih.

### Batas wewenang

- DeepThink memberi **rekomendasi kepada physician reviewer**, bukan sign-off.
- Otoritas final `approved`, `approved_with_waiver`, atau `revision_required`
  tetap pada dr. Wirayuda sebagai penanggung jawab klinis PRIMERA.
- Analisis harus read-only. Tidak ada aktivasi, perubahan payload, pengisian
  `PhysicianSignoff`, atau perubahan hash selama triangulasi.
- Persetujuan medis dan kesiapan aktivasi adalah dua gate berbeda. Konten dapat
  benar secara medis tetapi tetap dilarang aktif karena mekanik belum mampu
  menilai tindakan kritis atau menampilkan data pasien secara benar.
- Daftar Fornas membuktikan pencantuman serta restriksi suatu sediaan, bukan
  otomatis membuktikan dosis untuk indikasi tertentu, stok setiap Puskesmas,
  kewenangan lokal, atau kesiapan jejaring.
- Bila bukti tidak cukup, DeepThink harus menulis `insufficient evidence` dan
  menyebut data yang dibutuhkan. Jangan mengisi kekosongan dengan asumsi.

---

## A1. Ringkasan eksekutif operatif

M13 lahir dari kekhawatiran bahwa 67 kasus aktif belum mencakup kekayaan
kurikulum FKTP. Audit kemudian membedakan 144 baris katalog, konsep klinis,
archetype encounter, dan mastery. Hasil rekonsiliasi M13-0A menunjukkan bahwa
hanya 45 dari 144 item FKTP yang saat ini memiliki archetype yang sah untuk
sertifikasi; gap kanonik aktif adalah 99, bukan sekadar raw-link gap 98.

Alih-alih langsung membuat ratusan kasus, M13 memakai vertical pilot. M13-1a
menyiapkan delapan unit yang sengaja beragam: pediatrik, kasus stabil, tindakan
berbatas kompetensi, rujuk-wajib, IGD, dan UKM. Tiga calon encounter akan
menutup item FKTP yang belum tersertifikasi, sehingga gap diproyeksikan 99 ke
96 hanya bila paket kelak disetujui dan diaktifkan.

Checkpoint `59afc01` berhenti pada titik yang benar: konten telah ditulis dan
divalidasi, tetapi belum aktif. Ada **delapan pertanyaan keputusan klinis** dan
**lima blocker aktivasi teknis**. Keduanya beririsan, tetapi tidak boleh
dicampur. DeepThink diminta menjawab delapan pertanyaan satu per satu, lalu
memberi rekomendasi lintas kasus tentang blocker.

Pertanyaan payungnya adalah:

> Apakah setiap draf sudah mengajarkan keputusan yang tepat, pada pasien yang
> tepat, dengan dosis/tindakan/disposisi yang tepat untuk konteks FKTP, tanpa
> menghilangkan langkah keselamatan penting atau menambah detail yang justru
> mengaburkan tujuan belajar?

---

## A2. Histori dan provenance keputusan

| Tahap | Commit / tanggal | Apa yang diputuskan | Relevansi untuk review ini |
|---|---|---|---|
| Decision Lock rev 4.2.1 | `414dba5`, 2026-07-14 | Target besar diubah menjadi kurikulum bertahap dengan gate bukti, release, mode, dan pilot | Menolak content factory dan menetapkan review dokter sebelum aktivasi |
| M13-0A | `e91c323`, 2026-07-14 | Blueprint enam entitas dan rekonsiliasi 144 item | Menghasilkan gap sertifikasi kanonik 99 dan memisahkan level SKDI/archetype |
| M13-0B | `428fba9`, 2026-07-14 | Source registry, delta audit 2026, dan adjudikasi HT/DM2/stroke/epilepsi | Membentuk preseden bahwa populasi, facet bukti, keterbatasan, dan waiver harus eksplisit |
| Physician sign-off 0B | 2026-07-14 | dr. Wirayuda menyetujui 4 delta dan 2 waiver | Berlaku hanya untuk 0B; tidak otomatis berlaku untuk konten baru 1a |
| M13-0C | `4207ff8`, 2026-07-14 | Integrity release, save lintas rilis, fingerprint, mode isolation, CI | Membuat aktivasi konten atomik dan dapat diaudit |
| M13-0D | `30419e3`, 2026-07-15 | Constrained Exam Blueprint | Menjamin draf pilot Karier-only tidak bocor ke Ujian |
| M13-1a draft | `59afc01`, 2026-07-15 | 6 poli + 1 IGD + 1 UKM, review envelope, evidence pending | Inilah payload yang sedang ditriangulasi; belum ada sign-off atau aktivasi |

### Mengapa Nayla dan Dimas diprioritaskan

Audit sebelumnya menemukan dua bridge karma pediatrik yang belum memiliki
padanan populasi yang tepat. Nayla dan Dimas bukan sekadar variasi kosmetik dari
kasus dewasa. Keduanya ditulis dengan sumber pediatrik, usia, berat badan,
derajat kegawatan, regimen, dan batas kompetensi tersendiri. Ini juga menguji
apakah arsitektur kurikulum dapat membedakan satu konsep penyakit dari
archetype stabil versus berat serta populasi dewasa versus anak.

### Mengapa enam konten lain dipilih

- Hipoglikemia menguji obat penyebab, observasi, dan disposisi aman.
- Benda asing hidung menguji batas keterampilan 4A dan stop rule.
- Otitis eksterna menguji konflik PPK, Fornas, guideline penyakit, dan
  stewardship antibiotik.
- Fraktur terbuka menguji stabilisasi multi-tindakan sebelum rujuk.
- STEMI menguji keputusan time-critical dan kemampuan tujuan rujukan.
- Gunawan K2 menguji kedalaman UKM tanpa mengubah kunjungan menjadi kuliah
  farmakoterapi yang melelahkan.

---

## A3. Isi slice yang sedang dinilai

| ID | Kanal | Konten | Tier | SKDI / kredit | Tujuan belajar inti |
|---|---|---|---:|---|---|
| N1 | Poli | Nayla, diare bayi 3 bulan dengan dehidrasi berat | A | 4A | Plan C bayi, zinc, stabilisasi dan rujukan |
| D1 | Poli | Dimas, eksaserbasi asma berat anak 7 tahun | A | 3B, tidak mengkredit asma stabil 4A | Oksigen, bronkodilator, steroid, rujuk sambil terapi |
| H1 | Poli | Hipoglikemia ringan pada pengguna sulfonilurea | A | 4A | Rule of 15, koreksi obat, observasi, disposisi |
| B1 | Poli | Benda asing hidung anak | B | 4A | Satu upaya aman menurut bentuk dan stop rule |
| O1 | Poli | Otitis eksterna akut ringan | C | 4A | Terapi topikal dan menghindari antibiotik sistemik rutin |
| F1 | Poli | Fraktur terbuka tibia stabil-kompensata | B | 3B | Bundel stabilisasi pra-rujuk tanpa manipulasi berbahaya |
| I1 | IGD | STEMI anterior dengan SpO2 88% | - | 3B, tanpa kredit Dex dari flow IGD | EKG cepat, aspirin, oksigen terindikasi, transfer reperfusi |
| U1 | UKM | Gunawan K2, Kabin Truk Tanpa Kretek | - | Objective PIS-PK | Functional analysis dan relapse prevention berbasis konteks kerja |

Semua calon archetype dan skenario berpolicy `karier=true`, `ujian=false`.
Semua `EvidenceBinding` masih `pending`. Review teknis hanya menyatakan payload
siap dibaca dokter; ia tidak menyatakan isi medis sudah disetujui.

---

## A4. Metode triangulasi yang diminta

Untuk setiap pertanyaan, DeepThink harus memakai minimal empat lensa berikut.

### 1. EBM dan guideline penyakit

Periksa ketepatan populasi, derajat penyakit, dosis, interval, durasi, urutan
tindakan, kontraindikasi, dangerous path, dan kriteria eskalasi. Bila guideline
global lebih baru dari pedoman lokal, jelaskan apakah ia melengkapi, mengubah,
atau tidak dapat langsung diterapkan pada FKTP Indonesia.

### 2. Standar dan realita Indonesia

Bedakan fungsi PNPK, PPK FKTP, Fornas, protokol jejaring, dan realita sumber
daya. Jangan menyimpulkan stok pasti atau kemampuan tindakan hanya dari daftar
obat. Nyatakan bagian yang harus bergantung pada SOP Dinkes/RS jejaring.

### 3. Pedagogi dan gameplay

Tentukan keputusan mana yang wajib dimainkan dan dinilai, mana yang cukup
menjadi edukasi/feedback, dan mana yang sebaiknya dikeluarkan agar tujuan kasus
tidak tenggelam. Nilai pula apakah distraktor merupakan near-miss masuk akal,
bukan jawaban absurd.

### 4. Representasi engine

Periksa apakah mekanik game mampu membedakan tindakan aman dari tindakan yang
sekadar bernama mirip, mampu mengunci bundel stabilisasi, menampilkan usia
pasien secara benar, dan menilai tujuan rujukan yang sesuai kemampuan. Jangan
menganggap teks feedback dapat selalu menggantikan gate yang tidak ada.

### Tiga verdict yang wajib dipisahkan

Untuk tiap ID, DeepThink harus memberi tiga verdict terpisah:

1. **Clinical-content verdict:** apakah isi draf benar dan cukup lengkap?
2. **Pedagogy verdict:** apakah fokus dan beban kognitifnya tepat?
3. **Activation verdict:** apakah draf dapat aktif pada engine saat ini?

Satu kasus boleh `clinical: support` tetapi `activation: blocked`.

---

## A5. Delapan pertanyaan adjudikasi, satu per satu

### N1 - Nayla: Plan C bayi, rujukan, dan akses IV gagal

**Pertanyaan kanonik:**

> Nayla: setujui Plan C bayi sebagai tindakan bernilai, kebijakan stabilisasi
> sambil rujuk, dan jalur bila akses IV tidak segera berhasil.

**Konteks pasien dan draf saat ini:**

- Bayi perempuan 3 bulan, berat 5,6 kg.
- Letargis, mata cekung, hampir tidak mau minum, dan cubitan kulit kembali
  sangat lambat; draf mengklasifikasikan dehidrasi berat.
- Draf memodelkan Plan C sebagai satu tindakan bernilai: Ringer laktat atau
  NaCl 0,9% total 100 mL/kg; untuk usia kurang dari 12 bulan, 30 mL/kg dalam
  1 jam lalu 70 mL/kg dalam 5 jam, dengan penilaian ulang serial.
- ORS sekitar 5 mL/kg/jam diberikan setelah bayi mampu minum dengan aman.
- Zinc 10 mg/hari selama 14 hari; katalog aktif hanya memiliki tablet
  dispersibel 20 mg sehingga narasi menyebut setengah tablet.
- Draf menyatakan stabilisasi dimulai sambil jejaring rujukan anak disiapkan.

**Dangerous path yang hendak dicegah:** memaksa ORS pada bayi letargis,
loperamid, antibiotik empiris pada diare cair tanpa indikasi, atau menunda
cairan demi pemeriksaan feses.

**Mengapa keputusan belum sederhana:** Plan C adalah algoritme tindakan, bukan
sekadar pemasangan infus. Draf perlu menjelaskan cabang berdasarkan kemampuan
FKTP, respons awal, keamanan transport, dan kegagalan memperoleh akses IV.
Kalimat "stabilisasi sambil rujuk" tidak boleh membuat pemain bingung apakah
seluruh Plan C diselesaikan di FKTP, kapan transfer dimulai, dan apa yang harus
dilakukan selama akses definitif belum tersedia.

**DeepThink diminta menjawab:**

1. Apakah klasifikasi, volume, urutan waktu, reassessment, ORS, dan zinc tepat
   untuk bayi 3 bulan ini?
2. Algoritme cabang apa yang paling aman dan realistis untuk: IV segera dapat,
   IV belum berhasil, kemampuan NG/ORS terbatas, dan fasilitas rujukan dekat
   atau jauh?
3. Kapan Plan C layak diselesaikan di FKTP dan kapan transfer harus berjalan
   paralel tanpa menunggu seluruh fase cairan selesai?
4. Apakah "Plan C bayi" layak menjadi satu tindakan bernilai, atau harus
   dipecah agar pemain tetap dinilai pada akses, cairan, reassessment, dan
   pemberian oral yang aman?
5. Informasi apa yang masih kurang dari vignette untuk mengambil keputusan
   disposisi secara fair?

**Tujuan adjudikasi:** menghasilkan algoritme yang tegas, tidak menunda cairan,
tidak memberi ilusi bahwa satu klik infus menuntaskan Plan C, dan tetap sesuai
kapabilitas FKTP.

**Keterkaitan teknis:** blocker usia bayi dan kemungkinan kebutuhan bundel
stabilisasi. UI saat ini akan menulis `0 tahun`, bukan `3 bulan`.

**Sumber inti draf:** [WHO IMCI Chart Booklet](https://www.who.int/publications/m/item/integrated-management-of-childhood-illness---chart-booklet-%28march-2014%29),
SKDI 2012, dan rujukan MTBS/ILP lokal yang harus dilokalisasi lebih presisi bila
dipakai sebagai authority.

### D1 - Dimas: eksaserbasi asma berat anak dan batas kredit 3B

**Pertanyaan kanonik:**

> Dimas: setujui dosis/interval nebulisasi pediatrik, target oksigen, steroid
> sistemik, serta status 3B tanpa kredit asma stabil 4A.

**Konteks pasien dan draf saat ini:**

- Anak laki-laki 7 tahun, berat 24 kg, SpO2 87%, bicara kata demi kata,
  retraksi, dan respons pelega di rumah hanya singkat.
- Draf memberi oksigen dengan target SpO2 94-98%.
- SABA plus ipratropium dinebulisasi tiap 20 menit sampai tiga kali pada jam
  pertama.
- Prednison/prednisolon 1-2 mg/kgBB/hari, maksimum 40 mg, selama 3-5 hari.
- Terapi dan monitoring tetap berjalan selama rujukan ke layanan anak.
- Katalog draf memakai unit-dose ipratropium 0,5 mg plus salbutamol 2,5 mg.
  Angka ini sengaja belum dianggap regimen pediatrik lokal yang disetujui.
- Archetype memberi kredit pada item klinis status asmatikus anak 3B dan tidak
  menyertifikasi item asma stabil 4A.

**Dangerous path yang hendak dicegah:** salbutamol oral sebagai substitusi
terapi inhalasi, antibiotik tanpa bukti infeksi bakteri, menunda steroid atau
rujukan, dan salah membaca silent chest sebagai perbaikan.

**Titik konflik:** Pedoman Asma FKTP Kemenkes lebih lama dibaca bersama guideline
WHO pediatrik 2026 dan Fornas aktif. Fornas mencantumkan sediaan kombinasi, tetapi
tidak sendirinya menyelesaikan apakah unit-dose 0,5 mg ipratropium tepat untuk
anak 24 kg pada seluruh protokol lokal.

**DeepThink diminta menjawab:**

1. Apakah derajat berat, target oksigen, interval/jumlah nebulisasi, steroid,
   durasi, dan ambang rujuk sudah tepat untuk profil ini?
2. Apakah unit-dose ipratropium 0,5 mg dapat diterima untuk anak 24 kg, perlu
   ambang berat/usia, atau harus direvisi menjadi dosis lain?
3. Apakah ada langkah keselamatan akut yang material tetapi hilang, atau detail
   yang justru dapat dikeluarkan dari encounter tanpa merusak pembelajaran?
4. Apakah pemisahan kredit 3B dari asma stabil 4A sudah tepat secara kurikulum?
5. Tindakan mana yang harus menjadi gate keselamatan: oksigen, bronkodilator,
   steroid, rujukan, atau kombinasi?

**Tujuan adjudikasi:** memastikan kasus mengajarkan respons pertama pada asma
berat pediatrik dan batas kompetensi 3B, tanpa menurunkan regimen dewasa atau
memberi kredit palsu untuk tata laksana asma stabil.

**Keterkaitan teknis:** engine hanya memiliki satu `stabilisasiWajib`, padahal
oksigen dan nebulisasi sama-sama material sebelum rujukan.

**Sumber inti draf:** [Pedoman Asma FKTP Kemenkes](https://repository.kemkes.go.id/book/1251),
[WHO Childhood Asthma 2026](https://www.who.int/publications/i/item/9789240122680),
Fornas 1199/2025, dan SKDI 2012.

### H1 - Hipoglikemia terkait sulfonilurea

**Pertanyaan kanonik:**

> Hipoglikemia: setujui penghentian sementara/pengurangan sulfonilurea, batas
> observasi, dosis berikutnya, dan ambang rujuk bila berulang.

**Konteks pasien dan draf saat ini:**

- Pasien dewasa sadar dan mampu menelan, GDS 58 mg/dL, setelah melewatkan makan.
- Obat pemicu yang ditampilkan adalah glimepiride 2 mg.
- Draf memakai glukosa oral 15-20 g, pemeriksaan ulang setelah 15 menit, dan
  pengulangan bila glukosa masih di bawah 70 mg/dL atau gejala menetap.
- Setelah pulih, pasien makan dan dinilai faktor obat, fungsi ginjal/hati,
  alkohol, pola makan, serta keamanan pemantauan.
- Draf tidak otomatis melanjutkan dosis sulfonilurea berikut; obat dihentikan
  sementara atau dikurangi berdasarkan evaluasi.
- Rujukan dipilih bila tidak membaik, berulang, kesadaran turun, atau observasi
  aman tidak tersedia.

**Dangerous path yang hendak dicegah:** menambah sulfonilurea, mengirim pasien
pulang tanpa makan/pemantauan, atau menganggap normalisasi satu kali sebagai
jaminan bahwa hipoglikemia tidak berulang.

**DeepThink diminta menjawab:**

1. Apakah rule of 15 dan kriteria keberhasilan awal sudah tepat untuk profil ini?
2. Berapa lama observasi yang proporsional di FKTP untuk hipoglikemia terkait
   sulfonilurea, dan faktor apa yang memperpanjang observasi atau memicu rujuk?
3. Bagaimana instruksi dosis berikutnya sebaiknya ditulis agar aman tetapi tidak
   menjadi resep kaku tanpa mengetahui fungsi ginjal, pola makan, dan regimen?
4. Apakah kata "hentikan sementara atau kurangi" cukup presisi, atau harus ada
   algoritme yang membedakan hold, deprescribing, dan penyesuaian lanjutan?
5. Kapan hipoglikemia berulang harus menjadi rujuk/observasi rumah sakit,
   terutama bila pengawasan rumah tidak meyakinkan?

**Tujuan adjudikasi:** menutup celah antara koreksi angka glukosa dan pencegahan
episode ulang akibat obat, tanpa mengubah kasus singkat menjadi seluruh modul
manajemen DM2.

**Sumber inti draf:** PNPK Tata Laksana DM Tipe 2 Dewasa KMK 302/2026 dan
Fornas 1199/2025.

### B1 - Benda asing hidung anak: satu upaya dan stop rule

**Pertanyaan kanonik:**

> Benda asing hidung anak: setujui satu upaya ekstraksi terencana, teknik aman
> menurut bentuk, dan ambang berhenti/rujuk yang eksplisit.

**Konteks pasien dan draf saat ini:**

- Anak usia 3-5 tahun, stabil dan kooperatif.
- Benda adalah manik plastik bulat, anterior, terlihat jelas, bukan baterai,
  magnet, atau benda tajam.
- Draf mengizinkan satu upaya terencana memakai pengait di belakang benda,
  kateter balon, atau suction sesuai bentuk dan alat.
- Draf melarang blind probing dan menjepit benda bulat dari depan karena dapat
  mendorongnya lebih posterior.
- Setelah upaya pertama gagal, visualisasi/posisi tidak aman, alat tidak sesuai,
  anak tidak kooperatif, atau timbul komplikasi, pemain harus berhenti dan rujuk.

**Dangerous path yang hendak dicegah:** percobaan berulang, teknik yang salah
untuk bentuk benda, aspirasi/trauma karena mendorong posterior, dan keterlambatan
pada baterai kancing.

**DeepThink diminta menjawab:**

1. Apakah satu upaya terencana merupakan batas yang tepat untuk vignette ini,
   atau batas seharusnya bergantung pada pengalaman operator dan teknik?
2. Dari teknik yang disebut, mana yang layak diajarkan sebagai opsi FKTP untuk
   benda bulat anterior, dan apa syarat masing-masing?
3. Apakah skenario telah memberi informasi cukup tentang visualisasi, posisi,
   risiko aspirasi, epistaksis, dan kooperasi untuk membuat upaya pertama fair?
4. Apakah stop rule dan daftar benda berisiko tinggi sudah lengkap dan tegas?
5. Bagaimana game harus membedakan tindakan aman menurut bentuk dari satu tombol
   generik `ekstraksi_benda_asing_hidung`?

**Tujuan adjudikasi:** mengajarkan bahwa kompetensi melakukan ekstraksi tidak
berarti mencoba berulang kali atau memakai teknik yang sama untuk semua benda.

**Keterkaitan teknis:** blocker langsung. Engine saat ini tidak dapat membedakan
pengait/kateter/suction yang tepat dari blind probing atau front-grasping.

**Sumber inti draf:** PPK Dokter di FKTP KMK 1186/2022 dan SKDI 2012.

### O1 - Otitis eksterna: asam asetat versus opsi PPK

**Pertanyaan kanonik:**

> Otitis eksterna: adjudikasi asam asetat 2%, dosis 5 tetes 3-4 kali/hari,
> durasi lokal, dan posisi opsi ini terhadap agen yang disebut PPK.

**Konteks pasien dan draf saat ini:**

- Otalgia setelah berenang, nyeri tragus/aurikula, edema ringan, sekret minimal.
- Membran timpani tampak utuh; tidak ada diabetes atau imunosupresi.
- Pembersihan hanya kondisional bila diperlukan dan dapat dilakukan aman; tidak
  menjadi tindakan skor wajib.
- Draf memilih asam asetat otik 2%, 5 tetes 3-4 kali per hari, telinga dijaga
  kering, dan respons dinilai ulang 48-72 jam.
- Antibiotik sistemik tidak rutin pada penyakit tanpa penyebaran atau faktor
  host berisiko.

**Konflik bukti yang sengaja tidak disembunyikan:** PPK 1186/2022 menyebut
povidon iodin atau tampon antibiotik-steroid, bukan asam asetat secara spesifik.
Fornas 1199/2025 mencantumkan asam asetat tetes telinga 2%. AAO-HNSF mendukung
terapi topikal dan reassessment 48-72 jam. Label DailyMed hanya menjadi
pembanding dosis dan kontraindikasi perforasi, bukan protokol Indonesia.

**DeepThink diminta menjawab:**

1. Apakah asam asetat 2% layak menjadi pilihan primer untuk profil ringan ini
   dalam game FKTP Indonesia?
2. Apakah 5 tetes 3-4 kali per hari tepat; berapa durasi yang harus ditulis;
   dan kapan iritasi, kegagalan, atau kecurigaan perforasi mengubah pilihan?
3. Bagaimana posisi asam asetat terhadap povidon iodin atau preparat
   antibiotik-steroid yang disebut PPK, tanpa menyamakan pencantuman Fornas
   dengan preferensi regimen?
4. Apakah cleaning/aural toilet perlu dimainkan, cukup kondisional, atau perlu
   dipindah ke feedback karena keterbatasan alat dan visualisasi?
5. Bila opsi sekarang ditolak, sebutkan agen, dosis, durasi, syarat membran
   timpani, dan dasar ketersediaan alternatif yang disarankan.

**Tujuan adjudikasi:** memperoleh regimen topikal yang dapat dipertanggungjawabkan
secara lokal sambil mempertahankan pesan stewardship: antibiotik sistemik rutin
bukan jawaban untuk otitis eksterna ringan tanpa komplikasi.

**Sumber inti draf:** PPK 1186/2022, Fornas 1199/2025,
[AAO-HNSF Acute Otitis Externa](https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/aoe/),
dan [DailyMed Acetic Acid Otic 2%](https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=f9b4d18b-25f3-604f-e053-6394a90a5531&type=display).

### F1 - Fraktur terbuka tibia: stabilisasi dan antibiotik pra-rujuk

**Pertanyaan kanonik:**

> Fraktur terbuka: adjudikasi irigasi pra-rujuk, analgesia, dosis/cakupan
> antibiotik, profilaksis tetanus, dan dasar ketersediaan sefazolin di FKTP.

**Konteks pasien dan draf saat ini:**

- Pasien dewasa stabil-kompensata dengan luka terbuka tibia sekitar 4 cm,
  kontaminasi sedang, dan status neurovaskular distal masih utuh.
- Draf memulai primary survey dan kontrol perdarahan tanpa memasukkan fragmen.
- Irigasi singkat NaCl hanya untuk kontaminan lepas, tanpa debridement atau
  manipulasi fragmen.
- Luka dibalut steril; neurovaskular didokumentasikan sebelum dan sesudah bidai;
  akses IV, analgesia, antibiotik parenteral dini, serta profilaksis tetanus
  dinilai sebelum rujuk segera.
- Radiologi FKTP tidak boleh menunda transfer untuk debridement/fiksasi.
- Katalog draf menyediakan sefazolin 1 g, Td, dan TIG 250 sebagai calon entri,
  tetapi harga/biaya masih placeholder dan regimen belum disetujui.

**Dangerous path yang hendak dicegah:** mendorong fragmen, debridement agresif
di FKTP, membuka balutan berulang, antibiotik oral sebagai substitusi, imaging
yang menunda transfer, atau transport tanpa bidai.

**Titik konflik:** Fornas mencantumkan sefazolin dengan restriksi profilaksis
bedah. Itu tidak otomatis membuktikan regimen fraktur terbuka, stok rutin FKTP,
atau cakupan yang cukup untuk seluruh derajat kontaminasi. Detail luka juga
harus cukup untuk mendukung pilihan antibiotik, bukan membuat pemain menebak.

**DeepThink diminta menjawab:**

1. Apakah irigasi pra-rujuk seperti yang ditulis bermanfaat dan aman, atau cukup
   balut steril tanpa irigasi pada konteks tertentu?
2. Apakah vignette perlu klasifikasi/temuan tambahan sebelum menentukan
   antibiotik dan cakupan kontaminasi?
3. Agen, dosis, rute, timing, dan cakupan antibiotik apa yang semestinya
   diajarkan di FKTP; apa alternatif bila agen utama tidak tersedia?
4. Analgesia apa yang perlu dimainkan versus cukup dinyatakan sebagai prinsip?
5. Bagaimana algoritme Td/TIG untuk riwayat imunisasi yang tidak diketahui, dan
   bagian mana yang bergantung protokol/ketersediaan lokal?
6. Apakah sefazolin realistis untuk pilot ini, atau harus dimodelkan sebagai
   protokol jejaring/opsi kondisional, bukan stok universal Puskesmas?

**Tujuan adjudikasi:** membuat bundel pra-rujuk yang menyelamatkan fungsi dan
mencegah infeksi tanpa mengajarkan debridement improvisasi atau asumsi stok.

**Keterkaitan teknis:** blocker bundel stabilisasi dan kalibrasi ekonomi. Satu
`stabilisasiWajib` tidak mampu mengunci balut, bidai, akses, antibiotik, dan
tetanus sebagai paket.

**Sumber inti draf:** PPK 1186/2022, PNPK Tata Laksana Trauma KMK 132/2017,
Fornas 1199/2025, dan SKDI 2012.

### I1 - STEMI hipoksemik: bundel awal dan batas scope reperfusi

**Pertanyaan kanonik:**

> STEMI: setujui bundel aspirin/oksigen/EKG/transfer serta putuskan apakah
> P2Y12, antikoagulan, nitrat, dan strategi PCI/fibrinolisis sengaja di luar
> scope.

**Konteks pasien dan draf saat ini:**

- Dewasa dengan nyeri dada tipikal sekitar 35 menit, elevasi ST anterior, dan
  SpO2 88%.
- Draf meminta ABC, monitor, akses IV, dan EKG 12 sadapan dalam 10 menit.
- Oksigen diberikan karena hipoksemia, bukan secara rutin pada normoksemia.
- Aspirin tidak bersalut 160-320 mg dikunyah bila tidak ada kontraindikasi.
- EKG/SBAR dikirim dan pasien ditransfer terpantau ke jejaring reperfusi tanpa
  menunggu troponin atau hilangnya nyeri.
- Archetype IGD tidak memberi kredit diagnosis/Dex karena flow IGD saat ini
  tidak menulis keputusan diagnosis.

**Near-miss yang hendak dicegah:** menunggu troponin sebelum EKG, meniadakan
oksigen pada SpO2 88%, aspirin salut enterik dosis kecil yang ditelan, memberi
nitrat lebih dahulu sambil menunda aspirin, observasi serial di FKTP, atau
memilih RS terdekat tanpa memastikan kemampuan reperfusi.

**DeepThink diminta menjawab:**

1. Apakah urutan EKG, aspirin, oksigen, monitoring, komunikasi, dan transfer
   sudah tepat untuk first medical contact di FKTP/IGD Puskesmas?
2. Apakah ada kontraindikasi atau pemeriksaan singkat material yang harus
   terlihat sebelum aspirin atau transfer?
3. P2Y12, antikoagulan, dan nitrat: mana yang harus dimainkan, mana yang cukup
   menjadi opsi kondisional/feedback, dan mana yang sengaja di luar scope?
4. Apakah strategi PCI versus fibrinolisis perlu dipilih pemain, atau keputusan
   realistis di tahap ini adalah aktivasi jejaring dan transfer berdasarkan
   kemampuan serta waktu?
5. Bila detail lanjutan dikeluarkan demi fokus, teks apa yang harus menjelaskan
   bahwa langkah tersebut bukan dianggap tidak penting, melainkan bergantung
   protokol jejaring dan kontraindikasi?
6. Bagaimana destination rule harus dirumuskan agar "rujuk penyakit dalam"
   tidak dianggap setara dengan tujuan yang benar-benar mampu reperfusi?

**Tujuan adjudikasi:** mempertahankan urgency dan bundel yang tidak boleh
terlambat, sambil menghindari kompleksitas palsu ketika engine belum memodelkan
jejaring STEMI secara memadai.

**Keterkaitan teknis:** blocker langsung. Model RS hanya menyimpan spesialisasi,
jarak, dan tempat tidur, bukan PCI/fibrinolisis atau status jejaring reperfusi.

**Sumber inti draf:** [PNPK Sindroma Koroner Akut KMK 675/2019](https://www.kemkes.go.id/app_asset/file_content_download/17012245296566a05128fce1.82988449.pdf).

### U1 - Gunawan K2: relapse prevention tanpa overload

**Pertanyaan kanonik:**

> Gunawan K2: setujui fokus opportunity/relapse prevention dan putuskan apakah
> penilaian ketergantungan, withdrawal, serta farmakoterapi wajib masuk skenario.

**Konteks keluarga dan draf saat ini:**

- Gunawan adalah sopir truk dewasa yang merokok sekitar dua bungkus per hari.
- Ia sempat tiga hari bebas rokok, lalu relaps ketika antre bongkar malam: kopi,
  tawaran rekan, rokok di kabin, kantuk, dan kebiasaan kerja bertemu sekaligus.
- Skenario memakai lensa COM-B `opportunity`: functional analysis rantai pemicu,
  mengeluarkan rokok/asbak dari kabin, latihan menolak, titik istirahat aman,
  pengganti oral, dukungan keluarga, dan follow-up Unit Berhenti Merokok.
- Kantuk berat harus ditangani dengan menepi dan istirahat, bukan rokok atau
  kopi sebagai substitusi keselamatan.
- Draf menyebut ketergantungan, withdrawal, dan farmakoterapi tetap perlu dinilai
  di UBM, tetapi tidak semuanya dimainkan atau diberi skor pada kunjungan ini.

**Near-miss yang hendak dicegah:** menetapkan quit date tanpa rencana pemicu,
menuntut seluruh rekan kerja berubah, menyimpan rokok di kabin, mempermalukan
relaps, atau mengajarkan kopi/rokok sebagai penanganan kantuk berkendara.

**DeepThink diminta menjawab:**

1. Apakah fokus `opportunity` dan relapse prevention sudah koheren untuk
   kunjungan keluarga kedua, atau terlalu sempit bagi perokok berat?
2. Apakah penilaian tingkat ketergantungan dan gejala withdrawal harus dimainkan
   serta dinilai sekarang, atau cukup ditautkan eksplisit ke UBM?
3. Apakah farmakoterapi wajib muncul pada skenario ini; bila ya, pada kedalaman
   apa agar tidak menggeser tujuan dari pemicu pekerjaan?
4. Apakah rencana stimulus control, refusal rehearsal, dukungan keluarga,
   follow-up, dan keselamatan berkendara realistis dalam kapasitas Puskesmas?
5. Apakah ada stigma, moralizing, konflik keluarga, atau asumsi pekerjaan yang
   perlu diperbaiki?
6. Bagian mana yang wajib dinilai, mana yang menjadi feedback, dan mana yang
   sebaiknya disimpan untuk arc UBM berikutnya?

**Tujuan adjudikasi:** menjaga UKM sebagai pengalaman longitudinal yang nyata,
bukan daftar cek klinis yang berulang, sambil tetap memastikan perokok berat
tidak kehilangan assessment atau opsi terapi yang material.

**Sumber inti draf:** [WHO Tobacco Cessation Guideline 2024](https://www.who.int/publications/b/74755)
dan [Kemenkes PIS-PK Monitoring](https://repository.kemkes.go.id/book/758).

---

## A6. Lima blocker aktivasi yang harus ditriangulasi terpisah

| ID | Blocker | Konten terdampak | Mengapa bukan sekadar masalah teks |
|---|---|---|---|
| T1 | `stabilisasiWajib` hanya satu tindakan | D1, F1; mungkin N1 bila Plan C dipecah | Cap keselamatan dapat lolos walau tindakan penting lain dilewati |
| T2 | Usia runtime hanya tahun bulat | N1 | Bayi 3 bulan tampil sebagai `0 tahun`, merusak kejelasan demografi dan dosis |
| T3 | Harga obat/biaya tindakan masih placeholder | Seluruh katalog baru | Dapat mengubah keputusan ekonomi/gameplay dan memberi kesan harga aktual |
| T4 | Ekstraksi benda asing hanya satu aksi generik | B1 | Engine tidak tahu apakah teknik dipilih aman atau justru dangerous path |
| T5 | RS tidak memiliki atribut reperfusi | I1 | "Rujuk" dapat dinilai benar meski tujuan tidak mampu PCI/fibrinolisis |

DeepThink diminta untuk setiap blocker memilih rekomendasi:

- **fix before activation** jika menyangkut representasi atau penilaian
  keselamatan yang material;
- **explicit bounded waiver** hanya bila keterbatasan tidak menanamkan perilaku
  salah, lengkap dengan risiko, compensating control, dan tanggal evaluasi;
- **defer content activation** bila tidak ada perbaikan/waiver yang defensible.

Waiver tidak boleh menjadi cara menutupi regimen yang belum disetujui. Sebaliknya,
perbaikan engine juga tidak boleh dianggap menyelesaikan pertanyaan klinis.

---

## A7. Pertanyaan lintas kasus untuk DeepThink

Selain delapan verdict individual, jawab sintesis berikut:

1. **Clinical completeness:** adakah langkah keselamatan yang hilang berulang
   pada kasus rujuk-wajib N1, D1, F1, dan I1?
2. **Source hierarchy:** apakah draf konsisten membedakan guideline penyakit,
   PPK/PNPK, Fornas, label produk, dan SOP jejaring?
3. **FKTP realism:** klaim mana yang masih mengasumsikan stok, alat, tenaga,
   transport, atau kemampuan RS yang tidak universal?
4. **Pediatric specificity:** apakah Nayla dan Dimas benar-benar archetype anak,
   bukan kasus dewasa yang hanya diganti usia dan berat badan?
5. **Scoring fidelity:** tindakan kritis mana yang harus menjadi gate/cap, dan
   mana yang cukup diberi poin biasa atau feedback?
6. **Cognitive load:** apakah setiap encounter mempunyai satu sampai dua tujuan
   utama yang jelas, atau ada yang sudah menjadi mini-guideline terlalu padat?
7. **Near-miss quality:** apakah distraktor cukup masuk akal untuk menguji
   reasoning tanpa menjadi jebakan trivia atau jawaban absurd?
8. **Referral modeling:** apakah timing, stabilisasi selama transport, tujuan,
   dan kemampuan penerima cukup eksplisit?
9. **Pilot suitability:** dari delapan unit ini, mana yang siap setelah revisi
   kecil, mana yang memerlukan redesign, dan mana yang sebaiknya ditunda dari
   pilot pertama?
10. **Hidden coupling:** adakah satu keputusan yang bila diubah akan memerlukan
    perubahan katalog, ICD, curriculum credit, karma rewire, evidence binding,
    atau release policy lain di dalam envelope?

---

## A8. Format jawaban DeepThink yang wajib

### Bagian 1 - Executive triage

Buat tabel delapan baris dengan kolom:

| ID | Clinical | Pedagogy | Activation | Risk bila salah | Rekomendasi physician |
|---|---|---|---|---|---|

Gunakan nilai `support`, `support_with_conditions`, `revise`, atau
`insufficient_evidence`. Kolom rekomendasi physician boleh memetakan ke
`approved`, `approved_with_waiver`, atau `revision_required`, tetapi harus jelas
bahwa ini rekomendasi dan bukan tanda tangan DeepThink.

### Bagian 2 - Analisis individual N1 sampai U1

Untuk setiap ID, sertakan:

1. verdict klinis;
2. triangulasi sumber dan applicability ke FKTP Indonesia;
3. bagian draf yang dipertahankan;
4. koreksi yang diminta dengan redaksi atau algoritme konkret;
5. dangerous path yang belum tertutup;
6. keputusan yang wajib dinilai pemain versus cukup menjadi feedback;
7. dampak pada blocker teknis;
8. residual uncertainty dan data yang masih dibutuhkan;
9. tingkat materialitas: fatal/safety-critical, major learning defect, minor,
   atau editorial.

### Bagian 3 - Rekomendasi lintas kasus

- Urutkan lima blocker berdasarkan risiko dan effort.
- Nyatakan blocker mana yang tidak layak di-waive.
- Usulkan urutan revisi paling kecil yang dapat membawa paket ke aktivasi aman.
- Nyatakan apakah delapan konten tetap layak menjadi satu pilot, atau perlu
  dipisah menjadi gelombang lebih kecil.

### Bagian 4 - Bias check

DeepThink wajib memeriksa setidaknya bias berikut:

- recency bias terhadap guideline global 2026;
- authority bias terhadap satu dokumen lokal lama;
- formulary-equals-availability fallacy;
- tertiary-care leakage ke konteks Puskesmas;
- adult-to-child extrapolation;
- completeness bias yang memaksa semua detail masuk satu skenario;
- game-mechanic convenience yang mengalahkan keselamatan klinis;
- false precision pada dosis, harga, durasi, atau waktu observasi yang belum
  didukung sumber lokal.

---

## A9. Review envelope dan integritas versi

Hash berikut mengikat konten, katalog/ICD, topology kurikulum, mode/release
policy, evidence, metadata sumber, karma rewire, dan pertanyaan physician.

| ID | SHA-256 review envelope |
|---|---|
| N1 | `cdc51dfbacadd4d492bb1ade9b204dde55818e2618d119e20fc0abccfad4b837` |
| D1 | `5c28241f0aa7c21c7ba3bc6475269bd713e460c5d837a8c03bb01ae7bc870e47` |
| H1 | `5c19eef81c940516d799d672173096a4b84a8dcacfcaf05c96c074c57f48fc0b` |
| B1 | `4142a03601011b687cb611caf43ee73af9c0d42e58dd520cf4fbe8936968fccf` |
| O1 | `8c73ae002f2c27ad6e5f12c0cdb0497efd518895862aa7fd5b25d9d691d67ae8` |
| F1 | `cdb66765c7b058c1e4a21ccf454af10e4269c2032c15e497da5c151ecfc41bf5` |
| I1 | `84fdcb454c6c5448e2b712cfa165aff94c813e1e837026029ce5b03bb01769cb` |
| U1 | `b8d83a47768efd0bc0c25324fd44c58172f71156c3c2628883c1e88cb331092d` |

Bila DeepThink merekomendasikan perubahan payload, hash akan berubah dan versi
hasil revisi harus diajukan kembali. Persetujuan pada hash lama tidak boleh
dipindahkan diam-diam ke hash baru.

---

## A10. Lembar keputusan untuk physician reviewer

Bagian ini sengaja kosong. DeepThink tidak mengisinya sebagai sign-off; ia hanya
memberi rekomendasi yang membantu dr. Wirayuda mengisi keputusan nyata.

| ID | Keputusan physician | Alasan / syarat / waiver | Revisi wajib | Tanggal |
|---|---|---|---|---|
| N1 |  |  |  |  |
| D1 |  |  |  |  |
| H1 |  |  |  |  |
| B1 |  |  |  |  |
| O1 |  |  |  |  |
| F1 |  |  |  |  |
| I1 |  |  |  |  |
| U1 |  |  |  |  |

Nilai keputusan yang sah:

- `approved`;
- `approved_with_waiver`, dengan alasan, batas, compensating control, dan scope;
- `revision_required`, dengan koreksi yang diminta.

`revision_required` bukan sign-off terminal. Konten diperbaiki, envelope dan
hash dihitung ulang, lalu diajukan kembali.

---

## A11. Urutan kerja setelah triangulasi

1. DeepThink mengembalikan triage dan rekomendasi read-only.
2. dr. Wirayuda memutuskan N1-D1-H1-B1-O1-F1-I1-U1 secara eksplisit.
3. Item `revision_required` diperbaiki; hash baru direview lagi.
4. Lima blocker aktivasi diselesaikan atau menerima waiver yang benar-benar
   terbatas dan defensible.
5. Harga/biaya dikalibrasi dan seluruh evidence binding menjadi terminal.
6. Baru setelah itu draf boleh diimpor secara atomik ke katalog, `PACK`,
   blueprint, karma, dan keluarga; `CONTENT_RELEASE` dibump.
7. Test negatif harus membuktikan seluruh konten pilot tetap keluar dari Ujian.
8. M13-1b kemudian membutuhkan playtest manusia, dangerous-path testing, dan
   keputusan zero-material-defect terpisah. Persetujuan 1a tidak menggantikan
   gate manusia 1b.

---

## A12. Evidence map operatif

### Artefak lokal utama

- `docs/M13_1A_PHYSICIAN_REVIEW_PACKET.md` - ringkasan payload dan gate.
- `src/content/curriculum/m13_1a/reviewQuestions.ts` - delapan pertanyaan kanonik.
- `src/content/curriculum/m13_1a/reviewPayloads.ts` - envelope yang di-hash.
- `src/content/curriculum/m13_1a/clinicalDrafts.ts` - enam kasus poli.
- `src/content/curriculum/m13_1a/igdDraft.ts` - STEMI.
- `src/content/curriculum/m13_1a/ukmDraft.ts` - Gunawan K2.
- `src/content/curriculum/m13_1a/evidence.ts` dan `sources.ts` - binding dan
  provenance sumber.
- `src/content/curriculum/m13_1a/manifest.ts` - status serta lima blocker.
- `src/content/curriculum/m13_1a/m13_1a.test.ts` - 15 invariant authoring.
- `docs/M13_DECISION_LOG.md` - histori keputusan M13.

### Sumber eksternal inti

- [WHO IMCI Chart Booklet 2014](https://www.who.int/publications/m/item/integrated-management-of-childhood-illness---chart-booklet-%28march-2014%29)
- [WHO Childhood Asthma 2026](https://www.who.int/publications/i/item/9789240122680)
- [Pedoman Asma FKTP Kemenkes](https://repository.kemkes.go.id/book/1251)
- [Fornas KMK 1199/2025](https://e-fornas.kemkes.go.id/api/download?column=pustaka&filename=KMK%20No.%20HK.01.07-MENKES-1199-2025%20ttg%20Formularium%20Nasional.pdf)
- [AAO-HNSF Acute Otitis Externa](https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/aoe/)
- [DailyMed Acetic Acid Otic 2%](https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=f9b4d18b-25f3-604f-e053-6394a90a5531&type=display)
- [PNPK Sindroma Koroner Akut KMK 675/2019](https://www.kemkes.go.id/app_asset/file_content_download/17012245296566a05128fce1.82988449.pdf)
- [WHO Tobacco Cessation 2024](https://www.who.int/publications/b/74755)
- [Kemenkes PIS-PK Monitoring](https://repository.kemkes.go.id/book/758)

PPK 1186/2022 dan beberapa PNPK juga tersedia sebagai full-text lokal di
`docs/references/`. Tautan JDIH PPK yang pernah dipakai sudah 404; keterbatasan
ini harus dicatat, bukan disamarkan sebagai verifikasi daring terkini.

---

# LAMPIRAN HISTORIS - Triangulasi pra-eksekusi M13 (snapshot 2026-07-13)

> Lampiran berikut dipertahankan untuk provenance. Ia menjelaskan pergumulan
> yang melahirkan Decision Lock dan milestone M13-0. Status seperti HEAD,
> `REVISI_ENGINE`, jumlah test, versi kickoff, dan residual readiness di bawah
> adalah benar pada saat ditulis, tetapi telah diselesaikan atau berubah seperti
> dicatat pada bagian A0-A12 di atas.

## Ringkasan eksekutif

**State proyek:** M10.5 dan sisa M11 terukur sudah selesai; branch eksperimen
berada pada `790ecf1`, `REVISI_ENGINE=32`, dengan verifikasi lokal terakhir
785/785 test dan typecheck bersih. Tidak ada alasan teknis untuk kembali ke
fase audit tanpa ujung.

**State rencana:** rev 2 adalah perbaikan besar dan sudah benar pada arah
utama: foundation first, `CONTENT_RELEASE`, CI desktop, pilot kecil, batch
terukur, persona terpisah, UKM bukan blocker, dan curated curriculum.

**Lima residual penentu keputusan:**

1. Angka 46 adalah 45 kasus self-tag 4A + satu kasus 3B; kelompok referral
   overlap, sehingga 144/60/20 belum mempunyai unit hitung unik.
2. Rev 2 sudah menemukan sumber baru, tetapi masih menempatkan Fornas di depan
   guideline penyakit untuk dosis/regimen.
3. `CONTENT_RELEASE` yang hanya mengubah label mismatch tidak otomatis menjaga
   fairness run lama; pool awal harus dikunci atau kebijakan migrasinya jelas.
4. Fixed Ujian dan active-pool policy ditempatkan di M13-3, padahal pilot/wave
   sudah mengaktifkan konten pada M13-1/2.
5. Targeted delta review PNPK/PPK 2026 terhadap kasus existing aktif perlu
   selesai sebelum pilot, bukan sekadar dikeluarkan dari scope.

**Verdict CODEX:** **CONDITIONAL GO untuk rev 2.1.** Mulai M13-0A sekarang,
selesaikan residual readiness, lalu jalankan vertical pilot. Jangan kembali ke
rev 1, tetapi jangan pula mengaktifkan batch besar hanya karena rev 2 sudah jauh
lebih baik.

---

## 0. Permintaan kepada DeepThink

Dr. Wirayuda meminta insight DeepThink untuk menilai:

1. Apakah `M13_KICKOFF_PROMPT.md` sudah layak dieksekusi langsung.
2. Apa definisi yang benar untuk target "144" dan "sekitar 225 kasus".
3. Apakah seluruh katalog perlu aktif sekaligus dalam Career dan Ujian.
4. Apa pekerjaan fondasi yang wajib selesai sebelum authoring skala besar.
5. Bagaimana membagi UKP, UKM, IGD, persona, regional, dan Endurance tanpa
   membuat gameplay dangkal atau membebani mahasiswa secara kognitif.
6. Bagaimana menjaga kemutakhiran EBM, realita FKTP, fairness Ujian, save lama,
   replay dossier, dan kapasitas review medis.
7. Milestone, gate, dan stop criteria apa yang paling proporsional bagi proyek
   target sekitar 50 mahasiswa FK dengan satu developer.

**Output yang diharapkan:** keputusan berperingkat, trade-off, dan rekomendasi
yang dapat dijadikan revisi resmi kickoff. DeepThink boleh menolak angka atau
urutan yang ada, tetapi diminta menunjukkan penggantinya dan alasan terukur.

---

## 1. Konteks proyek dalam 90 detik

PRIMERA "Puskesmas Pagi" adalah game desktop edukasi dokter FKTP Indonesia.
Pemain menjalani:

- **Career:** stase 90 hari, ruang belajar dan eksplorasi utama.
- **Ujian:** stase 30 hari, dinilai formal, memakai salah satu dari 8 seed paket.
- **UKP:** encounter klinik - anamnesis, pemeriksaan, diagnosis, terapi,
  edukasi, dan disposisi.
- **UKM:** survei wilayah, kader, keluarga binaan, kunjungan rumah berbasis
  COM-B dan motivational interviewing, Posyandu, Prolanis, KLB, dan program.
- **IGD:** interrupt gawat darurat berlangkah sebelum poli.
- **Dex/Buku Saku:** mastery kasus menggunakan bintang dan katalog 144 entri.

Skor akhir terdiri dari UKP 35, UKM 35, Manajemen 15, dan Resiliensi 15.
Engine ditulis sebagai reducer TypeScript deterministik. Ujian dapat diekspor
menjadi dossier berisi action-log, skor, tally, HMAC, dan `sidikJariPack`, lalu
direplay untuk memeriksa integritas. Karena itu, perubahan konten bukan hanya
masalah editorial: penambahan kasus dapat mengubah antrean seeded, replay,
paparan kurikulum, kesetaraan paket, dan save yang sedang berjalan.

### 1.1 Istilah yang jangan dicampur

- **SKDI:** standar kompetensi lulusan; 4A, 3A, 3B, dan 2 adalah tingkat
  kemampuan, bukan otomatis daftar obat atau keputusan disposisi setiap vignette.
- **PPK FKTP:** panduan operasional klinis dokter FKTP; sumber konteks praktik,
  diagnosis, tatalaksana, dan rujukan, dengan status amandemen yang harus dicek.
- **PNPK:** pedoman penyakit/program yang dapat lebih mutakhir atau lebih rinci,
  tetapi sebagian besar isinya bisa berada di ranah FKRTL/spesialis.
- **Fornas:** acuan obat dalam JKN dan restriksi tingkat fasilitas; bukan sumber
  tunggal dosis atau algoritme penyakit.
- **DOEN:** daftar obat esensial historis; bukan sinonim Fornas aktif dan bukan
  otoritas dosis.
- **Katalog konten:** semua kasus yang sudah ditulis.
- **Pool aktif:** kasus yang boleh dipilih Director pada mode/wave tertentu.
- **Paparan:** kasus yang benar-benar dijumpai pemain.
- **Mastery:** kasus yang diremediasi dan dikuasai, bukan hanya pernah muncul.

---

## 2. Histori bagaimana M13 sampai pada titik ini

### 2.1 Asal kekhawatiran "kok hanya 67 kasus"

Audit histori git sebelumnya menemukan tidak ada penghapusan atau sabotase
konten. Jumlah kasus berkembang dari 16 menjadi 67 pada M3a, lalu stabil.
Kebingungan berasal dari dua makna angka 144:

1. `skdi144.ts` sebagai katalog Dex 144 siluet, yang sejak awal boleh hanya
   terisi sebagian.
2. Aspirasi jangka panjang untuk memiliki 144 kasus 4A playable, sekitar 60
   kasus referral, dan sekitar 20 kasus IGD.

Jadi M13 adalah pengaktifan backlog aspiratif secara sadar, bukan pemulihan
konten yang hilang.

### 2.2 DeepThink brief pertama

`docs/DEEPTHINK_M13_SKALA_PENUH.md` memformalkan:

- Sub-scope A: skala penuh 144/60/20.
- Sub-scope B: variasi epidemiologi regional.
- Sub-scope D: Endurance untuk hunt 144.
- Pertanyaan Q1-Q10 tentang sequencing, porting, regional, mastery, dan pacing.

Pada saat itu M10.5 dan M11 belum selesai, sehingga authoring 152 kasus dinilai
terlalu berisiko bila berjalan bersamaan dengan hardening engine.

### 2.3 Golden Master dan M11 selesai terukur

Setelah serangkaian audit M10-M11:

- Golden Master M10.5 dibuat dan kemudian di-hardening sampai `REVISI_ENGINE=32`.
- M11 process scoring dan stabilisasi pra-rujuk selesai.
- Progressive disclosure anamnesis ringan selesai.
- M11.5 menambahkan `panduanResmi` berbasis PPK.
- Audit realita FKTP merevisi 19 kasus dan menghapus bahasa stok/alat yang
  terlalu absolut atau mendorong improvisasi berbahaya.
- Commit eksperimen saat ini adalah `790ecf1 feat: complete measurable M11 enrichment`.

Claude kemudian memverifikasi independen full suite, freeze hashes, dan sampel
hingga seluruh 19 catatan realita. Salah satu koreksi paling substantif adalah
varisela: anjuran profilaksis asiklovir improvisasi untuk kontak rentan diganti
menjadi larangan improvisasi tanpa protokol lokal atau arahan spesialis.

### 2.4 Kickoff rev 1 dan audit awal

Kickoff rev 1 disusun setelah M11 ditutup. Proposal awalnya:

1. Fase 0: tambah skenario UKM dari 26 menjadi sekitar 40.
2. Fase 1: tambah sekitar 152 kasus klinis dan IGD.
3. Persona anamnesis dibackfill paralel.
4. Repo lama dipakai sebagai "narrative shell", fakta klinis dibangun ulang.
5. Kasus dibagi Tier A/B/C agar tidak semuanya sedalam kasus flagship.
6. Batch klinis 10-15 kasus dan UKM 3-5 skenario.
7. Regional, Endurance, dan mpox dikeluarkan dari kickoff.

Dr. Wirayuda kemudian meminta CODEX mengkaji plan ini dari banyak sisi dan
secara eksplisit mengizinkan multiple deep agents untuk brainstorming. Audit
awal memberi verdict: **no-go untuk bulk 152 seperti ditulis, conditional go
untuk readiness phase dan pilot**.

### 2.5 Kickoff rev 2 yang sedang diadjudikasi

Rev 2 menggantikan total rev 1 dan sekarang mengusulkan:

1. M13-0A curriculum blueprint lebih dulu.
2. M13-0B integrity release sebelum authoring massal.
3. `CONTENT_RELEASE` terpisah dari `REVISI_ENGINE`.
4. Perbaikan determinisme IGD/karma dan CI desktop.
5. Vertical pilot 6 poli + 1 IGD + 1 UKM.
6. Batch terukur 4-6 poli atau 2-3 IGD/UKM.
7. Aktivasi atomik pada batas cohort dan kurikulum aktif yang dikurasi.
8. UKM diturunkan dari blocker menjadi quality expansion.
9. Persona menjadi stream terpisah.
10. Regional, Endurance, mpox, dan audit delta PNPK kasus lama tetap di luar
    scope atau menunggu keputusan eksplisit.

Ini kemajuan substantif. Pertanyaan sekarang bukan lagi "apakah 152 kasus
boleh ditulis langsung", melainkan "apakah detail rev 2 sudah cukup benar dan
lengkap untuk menjadi instruksi eksekusi".

### 2.6 Triangulasi ronde ini

Audit dilakukan melalui empat jalur independen:

- **Arsitektur/data:** ContentPack, Director, save/replay, fingerprint,
  determinisme, UKM state, modul, dan migrasi.
- **Klinis/EBM:** definisi 144, hierarki sumber, safety floor, populasi rentan,
  obat, rujukan, dan provenance.
- **Pedagogi/gameplay:** exposure, mastery, Dex, Ujian, UKM, IGD, persona,
  cognitive load, dan mode-specific curriculum.
- **Delivery/QA:** batching, CI, reviewer capacity, validators, release waves,
  rollback, dan hard-stop criteria.

CODEX utama memeriksa ulang klaim paling penting langsung ke file dan sumber
resmi. Temuan agen yang tidak cocok dengan bukti lokal tidak dimasukkan sebagai
fakta final tanpa koreksi; lihat Bagian 8.3.

---

## 3. Legenda tingkat kepastian

Setiap klaim penting dalam dossier ini termasuk salah satu kelas berikut:

- **[V] Verified:** dibaca atau dihitung langsung dari kode/repo/sumber resmi.
- **[P] Projection:** hasil simulasi/model dengan asumsi eksplisit; berguna
  untuk keputusan, tetapi bukan jaminan perilaku semua pemain.
- **[J] Judgment:** rekomendasi desain/risiko yang perlu adjudikasi DeepThink
  atau Dr. Wirayuda.

Angka hard baseline di Bagian 4 adalah [V]. Threshold penerimaan di Bagian
12-13 sebagian besar adalah [J] yang sengaja diajukan untuk dinilai, bukan
keputusan yang sudah disahkan.

---

## 4. Baseline aktual yang terverifikasi

### 4.1 Konten klinis dan kurikulum

| Metrik | Nilai aktual | Catatan |
|---|---:|---|
| `KasusKlinis` | 67 | 7 modul kasus |
| Self-report `skdi:'4A'` | 50 | Sama dengan `fktp144:true` |
| SKDI 3A | 7 | Level kompetensi, bukan selalu flag runtime |
| SKDI 3B | 9 | Level kompetensi |
| SKDI level 2 | 1 | `jiwa_depresi_ringan` |
| `harusDirujuk:true` nyata | 12 | Bukan 17 |
| Entri/kasus unik tertaut `skdi144.kasusId` | 46 / 46 | Tidak ada duplicate target saat ini |
| Kasus tertaut yang self-report 4A | 45 | Bukan 46 |
| Kasus tertaut non-4A | 1 | `pneumonia_balita` (3B, wajib rujuk) |
| Entri `skdi144` belum tertaut | 98 | Jika targetnya 144 tautan 1:1 |
| `KasusIgd` | 5 | Pool terpisah |
| `panduanResmi` | 51 | Bukan 50 seperti sebagian dokumen lama |
| `catatanRealita` | 19 | M11 item 7 |
| `mutiaraEbm` | 5 | Pengayaan selektif |

Konsekuensi denominator:

- Bila "144" berarti **144 kasus yang self-report 4A**, baseline 50 -> perlu 94.
- Bila "144" berarti **setiap entri Dex tertaut satu kasus unik**, baseline 46
  -> perlu 98.
- Bila "144" berarti **kasus tertaut yang objeknya sendiri berlabel 4A**,
  baseline 45 -> perlu 99.
- Ketiga tujuan itu tidak identik. Rev 1 berpindah di antaranya; rev 2
  memilih baseline 46 tertaut, tetapi masih perlu menetapkan apakah satu target
  wajib memiliki satu kasus unik atau boleh memiliki population/severity
  variants.

AST audit juga menemukan lima, bukan empat, kasus self-report 4A yang tidak
tertaut: `dispepsia_fungsional`, `mata_konjungtivitis_alergi`,
`mm_low_back_pain`, `mm_mialgia`, dan `kia_kb_konseling`. Sebaliknya,
`pneumonia_balita` mengisi satu target Dex walau objeknya 3B. Ini bukan otomatis
bug klinis; ini bukti bahwa denominator harus dinamai tepat.

Kelompok saat ini juga overlap: `pneumonia_balita` berada sekaligus pada 46
tautan Dex dan 12 wajib rujuk. Jadi `46 + 12 + 5 IGD = 63` adalah jumlah
**membership kategori**, tetapi union-nya hanya **62 aset unik**. Dengan alasan
yang sama, target `144 + 60 + 20 = 224` tidak boleh disebut jumlah kasus unik
sebelum aturan overlap/variant disahkan.

### 4.2 UKM

| Sumber | Keluarga | Skenario |
|---|---:|---:|
| desaA | 3 | 6 |
| desaB | 3 | 6 |
| desaC | 1 | 3 |
| desaD | 2 | 4 |
| desaE | 4 | 4 |
| desaF | 3 | 3 |
| **Total** | **16** | **26** |

Fakta mesin UKM:

- Maksimal roster binaan adalah 16.
- Hanya satu slot lapangan per hari untuk kunjungan atau kegiatan.
- Skor mengharapkan 24 kunjungan Career dan 8 kunjungan Ujian.
- Tujuh keluarga desaE/F adalah arc satu babak by design.
- Delapan keluarga desaA/B/D punya dua skenario dan secara teori dapat menerima
  k3 bila ada alasan naratif; desaC sudah punya tiga skenario.
- Menambah 14 skenario hanya melalui k3 pada delapan keluarga tersebut masih
  menyisakan enam skenario yang memerlukan k4, keluarga baru, atau revisi
  keputusan one-shot yang saat ini dilarang kickoff.

### 4.3 Anamnesis/persona

Audit AST atas seluruh array `anamnesis` menghasilkan:

| Metrik | Nilai |
|---|---:|
| Total pertanyaan | 539 |
| Pertanyaan esensial | 313 |
| Memiliki `variasi` | 87 |
| Esensial dengan `variasi` | 87 |
| Esensial tanpa `variasi` | 226 |

Sebaran key persona pada 87 pertanyaan tersebut:

| Persona | Jumlah pertanyaan dengan variasi |
|---|---:|
| polos | 83 |
| terpelajar | 79 |
| skeptis | 0 |
| cemas | 69 |
| lansia | 12 |
| wali_anak | 8 |

Angka 461 di kickoff berasal dari hitungan ID yang diawali `q_`; 74 pertanyaan
di `kasusKronis.ts` memakai prefix lain seperti `ht_` dan `dm_`, tetapi tetap
merupakan pertanyaan sungguhan.

### 4.4 Kapasitas paparan mode

Kurva pasien organik saat ini:

- Career: 2 pasien pada hari 1-2, 3 pasien sampai hari 60, lalu 4 pasien sampai
  hari 90 = **298 slot organik** sebelum pasien kembali/karma/PRB.
- Ujian: pola terkompresi = **98 slot organik** selama 30 hari.
- Director mengambil semua kasus aktif dari `pack.kasus`.
- Director menjamin minimal satu kasus 4A yang `state.dex[id]` masih undefined
  bila tersedia.
- Setelah kasus muncul dan menghasilkan entri Dex, jawaban salah sekalipun
  membuatnya tidak lagi mendapat jaminan "belum pernah".
- Bintang 1-2 meluntur setelah 14 hari; bintang 3 menetap.
- Maksimal satu kasus wajib rujuk per pagi.

IGD:

- Mulai hari 4.
- Peluang 0,12 -> 0,15 -> 0,20 menurut fase stase.
- Cooldown minimal 4 hari.
- Kasus dipilih uniform dari pool dengan replacement.

### 4.5 Source corpus dan repository

- Ada 104 file lokal di `docs/references/`, dan seluruh 104 file tersebut
  memang tracked git. Aturan `.gitignore` tidak menghapus file yang sudah
  tracked. Jadi klaim kickoff bahwa corpus lokal tersedia dan committed benar.
- Folder PNPK berisi 38 subfolder, bukan 37.
- Tujuh modul klinis sekarang sudah sekitar 987-1.369 baris per file; beberapa
  modul keluarga lebih dari 2.000 baris. Ekspansi massal menuju target rev 2
  pada struktur yang sama akan memperbesar hotspot review dan merge conflict.
- Repo lama saat audit berada di commit `6aa7436`, sedangkan kickoff mengutip
  insiden/fix `4d348d9`. Sumber porting perlu dipin ke commit dan old case ID,
  bukan membaca working tree bergerak tanpa provenance.

---

## 5. Yang kuat dari kickoff dan sebaiknya dipertahankan

1. **Membedakan rawat jalan dan IGD.** Keduanya memang schema dan loop berbeda.
2. **Tidak blind-copy fakta klinis repo lama.** Riwayat ICD poisoning membuat
   larangan itu masuk akal.
3. **Mengakui kompleksitas UKM.** Satu skenario kunjungan bukan filler murah.
4. **Menggunakan depth tier.** Ini jawaban yang tepat terhadap risiko overkill,
   asalkan safety floor tidak ikut dipangkas.
5. **Progressive disclosure anamnesis.** Aturan pembuka dan larangan clue bocor
   sudah ditulis dengan baik.
6. **Batching dan verifikasi independen.** Prinsipnya tepat, walau ukuran batch
   dan gate perlu direvisi.
7. **Scope exclusion eksplisit.** Regional, Endurance, dan mpox tidak masuk
   diam-diam.
8. **Referensi lokal benar-benar ada.** Corpus dapat mempercepat authoring,
   selama diperlakukan sebagai cache sumber, bukan bukti bahwa isinya mutakhir.

Rekomendasi dossier ini adalah refactor kickoff, bukan membuang fondasinya.

### 5.1 Disposition rev 2 terhadap audit awal

| Tema audit awal | Respons rev 2 | Status setelah triangulasi |
|---|---|---|
| Definisi/manifest 144 | Menambah M13-0A | **Sebagian:** provenance dan cardinality belum final |
| Sumber usang | Mengakui Fornas/PNPK 2026 | **Sebagian:** hierarki regimen masih terbalik |
| Bukan content-only | Menambah M13-0B | **Terjawab secara prinsip** |
| Save/replay lintas konten | Menambah `CONTENT_RELEASE` | **Sebagian:** label netral belum menjaga run lama |
| Engine vs content version | Memisahkan dua versi | **Hampir selesai secara konsep** |
| IGD/karma order-dependent | Menjadi task M13-0B | **Diakui, belum diimplementasikan** |
| Mastery collapse | Pool aktif dikurasi di M13-3 | **Sebagian:** terlambat dan tanpa gate numerik |
| Fairness Ujian | Menjanjikan fixed manifest di M13-3 | **Sebagian:** harus sebelum aktivasi pertama |
| Urgensi UKM | Diturunkan dari blocker | **Koreksi tepat, dasar 26>24 belum cukup** |
| Target 20 IGD | Tetap target | **Belum didefinisikan sebagai exposure contract** |
| Persona | Stream terpisah, fakta invariant | **Terjawab; bug assignment keluarga tersisa** |
| Tier A/B/C | Safety floor eksplisit | **Terjawab secara prinsip; ledger belum ada** |
| Validator/CI | CI desktop masuk M13-0B | **Sebagian; clinical/path validators belum lengkap** |
| Ukuran batch | Turun menjadi 4-6 / 2-3 | **Terjawab** |
| Port narasi lama | Fakta dibangun ulang | **Sebagian; frasa "apa adanya" masih terlalu permisif** |

Rev 2 layak diperlakukan sebagai kemajuan nyata, bukan target tembak lama yang
diganti nama. Residual di bawah adalah alasan untuk **rev 2.1 kecil tetapi
penting**, bukan alasan kembali ke nol.

---

## 6. Konflik awal dan residual rev 2

### 6.1 Target jumlah belum menjadi curriculum blueprint [V/J]

**Status rev 2: sebagian ditangani.** M13-0A kini diwajibkan, tetapi rev 2
menyebut `skdi144.ts` sudah "manifest kanonik" dan memerintahkan perluasan file
runtime itu. Yang terverifikasi baru: file tersebut berisi tepat 144 ID unik,
diport manual dari repo lama, dan menjadi katalog Dex operasional. Belum ada
re-derivation mekanis yang membuktikan bahwa pemilihan 144 target itu identik
dengan satu daftar kurikulum otoritatif terkini.

`skdi144.ts` adalah daftar yang diport manual dari repo lama. File itu sendiri
mengatakan ada auto-link ICD dan pengecualian manual. Ekstraksi lokal PPK 1186
memiliki 167 bagian; pencarian literal menemukan banyak level 4A tetapi tidak
secara bersih menghasilkan 144 baris kanonik. Karena itu:

- `50 self-report 4A` tidak sama dengan `46 target tertaut`.
- Satu kode ICD dapat dimiliki dua entri SKDI.
- Auto-link memilih kasus pertama dengan exact ICD, sehingga dua target bisa
  diam-diam menunjuk kasus yang sama.
- Mapping generik seperti malaria umum -> falciparum atau UTI umum -> UTI dalam
  kehamilan mungkin defensible secara pedagogis, tetapi bukan equivalence yang
  boleh diasumsikan tanpa keputusan eksplisit.
- "60 referral" dan "20 IGD" adalah target desain, belum sebuah blueprint
  population x severity x competency x disposition.

**Kebutuhan sebelum authoring:** satu manifest kanonik yang menjelaskan setiap
slot target, apakah satu diagnosis, satu skenario keparahan, satu populasi, atau
varian dari target yang sama.

DeepThink juga perlu memilih lokasi artefaknya. M13-0A disebut "dokumen saja,
tanpa kode", tetapi rev 2 menyuruh mengedit `src/content/skdi144.ts`. Itu file
TypeScript runtime, bukan dokumen. Opsi yang lebih bersih adalah manifest
build-time terpisah yang menghasilkan atau memvalidasi mapping runtime; opsi
lain adalah mengakui M13-0A sebagai perubahan kode metadata dan mengujinya.

### 6.2 Source list diperbarui, hierarchy masih salah arah [V]

**Status rev 2: koreksi sumber ditemukan, tetapi hierarkinya masih perlu
dibalik.** Rev 2 sudah mencabut instruksi no-fetch, menyebut Fornas 1199/2025,
PPK 1936/2022, serta PNPK 2026. Namun ia tetap mengatakan Fornas dicek pertama
untuk `obatBenar`/**dosis**, lalu PPK/PNPK sebagai fallback. Fornas terutama
menentukan cakupan/restriksi, bukan otoritas utama regimen. Clinical guideline
penyakit harus menentukan indikasi, dosis, rute, frekuensi, durasi, monitoring,
dan special population; Fornas baru menguji kesesuaian fasilitas/JKN.

Rev 1 menaruh DOEN 2021 pertama untuk obat/dosis dan menyatakan jangan fetch
ulang. Rev 2 telah membatalkan instruksi itu; fakta yang memaksa koreksi
tersebut tetap penting sebagai audit trail:

- Halaman resmi Kemenkes menandai KMK 6477/2021 DOEN sebagai **tidak berlaku**
  dan dicabut oleh KMK 2197/2023.
- Fornas aktif adalah KMK 1199/2025, ditetapkan 31 Desember 2025 dan berlaku
  mulai 1 April 2026.
- PPK 1186/2022 memiliki perubahan KMK 1936/2022, tetapi bundle lokal hanya
  mengekstrak dokumen 1186 asli.
- Katalog resmi Kemenkes 2026 sudah memuat PNPK baru untuk hipertensi, DM tipe 2,
  stroke, dan epilepsi, sementara distilasi lokal masih memakai edisi lama.
- DOEN/Fornas menjawab ketersediaan/restriksi, bukan otomatis dosis, durasi,
  contraindication, atau algoritme penyakit.

**Hierarki yang diusulkan:**

1. Pedoman penyakit/program terkini atau PNPK untuk clinical truth.
2. PPK 1186 sebagaimana diubah 1936 untuk konteks operasional FKTP.
3. SKDI untuk learning objective dan level kompetensi.
4. Fornas 1199/2025 untuk restriksi fasilitas/JKN.
5. Stok lokal sebagai layer realita terpisah, bukan klaim universal.

Corpus lokal boleh menjadi cache dan alat pencarian. Setiap scored/high-risk
claim tetap harus melewati current-source check.

Ada satu koreksi scope spesifik: katalog resmi memang memuat PNPK Epilepsi
Dewasa 2026 dan corpus lokal memuat Epilepsi Anak 2017. Dokumen dewasa tidak
boleh disebut otomatis "menggantikan" dokumen anak; keduanya berbeda populasi.
Yang dibutuhkan adalah matriks applicability/supersession per populasi, bukan
sekadar memilih tahun terbesar.

### 6.3 Active-pool policy belum mengikuti pengakuan bahwa M13 bukan content-only [V]

**Status rev 2: prinsipnya diterima.** M13-0B secara eksplisit menjadi fase
engine/integrity. Residualnya: `modeAktif` baru diusulkan sebagai kolom target,
sedangkan Director saat ini tetap mengambil seluruh `pack.kasus`. Tanpa
runtime active-pool policy, menambah kasus pilot ke `PACK` tetap mengubah Career
dan Ujian sekaligus. Rev 2 menunda curated curriculum ke M13-3, sesudah pilot
dan measured expansion sudah mengaktifkan konten.

Menambahkan kasus mengubah `pack.kasus`. Director mengambil seluruh pool aktif
dan weighted draw-nya bergantung pada jumlah serta urutan kandidat. Akibatnya:

- Setiap seed Ujian lama dapat menghasilkan daftar kasus berbeda.
- Rasio kategori, referral, demografi, dan jebakan antarpaket berubah.
- Kasus langka mendapat probability mass hanya karena library bertambah.
- Satu unseen-4A slot per hari mendorong breadth, tetapi tidak menjamin koreksi
  atas kasus yang salah.
- Depth tier hanya mengatur effort penulisan; engine tidak punya field tier
  atau difficulty untuk blueprint Ujian.

Jika Director, exam manifest, dan active-pool policy dikeluarkan dari scope,
tujuan pedagogis ekspansi tidak mempunyai mekanisme distribusi.

### 6.4 Save, dossier, dan content release belum aman [V]

**Status rev 2: blocker diakui, solusi belum lengkap.** Menyimpan
`CONTENT_RELEASE` dan mengubah verdict mismatch menjadi
`tidak_dapat_diverifikasi` mencegah tuduhan curang yang salah, tetapi tidak
menjaga fairness atau determinisme run yang sudah telanjur dilanjutkan memakai
Pack B. Run tersebut tetap mengalami antrean, inventory, keluarga, dan arc yang
berbeda dari kontrak awalnya.

Save hanya menyimpan `{v:1,state}` tanpa content release/fingerprint awal.
Skenario kegagalan yang mungkin:

1. Mahasiswa memulai run pada Pack A.
2. Aplikasi diperbarui ke Pack B yang menambah kasus.
3. Save lama dibuka karena schema save masih versi 1 dan dianggap valid.
4. Dossier akhir dicap dengan fingerprint Pack B.
5. Verifier mereplay action-log dari hari 1 menggunakan Pack B.
6. Antrean Pack B berbeda dari antrean historis Pack A; action berikutnya dapat
   mengenai pasien/pertanyaan berbeda.
7. Tally atau skor replay menyimpang dan dossier jujur berisiko dilabel tidak sah.

Masalah tambahan:

- Jika gudang save lama sudah non-empty, obat baru tidak otomatis mendapat stok.
- Keluarga baru tidak dibuat pada state save lama.
- Menambah k3 pada arc yang di save lama sudah `arcSelesai:'berhasil'` tidak
  membuka ulang arc; reducer tetap menolaknya.

M13 memerlukan kebijakan content release sebelum aktivasi kasus baru. Opsi
minimal adalah melarang resume lintas pack secara ramah dan menyimpan build
lama untuk penyelesaian/verifikasi. Opsi lebih kompleks adalah migrasi penuh
yang merekonsiliasi inventory, keluarga, arc, dan replay.

Kebijakan yang perlu diputuskan eksplisit: Ujian harus lock ke release awal;
Career boleh hard-lock, migrate sebagai run non-verifiable, atau melanjutkan di
build lama. Fingerprint/release harus dicatat **saat run dibuat**, bukan baru
saat dossier diekspor.

### 6.5 Version semantics sudah membaik, release contract belum lengkap [V]

**Status rev 2: hampir selesai secara konsep.** Pemisahan
`REVISI_ENGINE`/`CONTENT_RELEASE` sudah tepat. Yang masih perlu ditulis adalah
truth table kapan masing-masing naik, apa yang terjadi pada perubahan display
yang tidak di-hash, bagaimana rollback bekerja, dan artefak release lama mana
yang dipertahankan.

Rev 1 memerintahkan tiap "Ember Merah" memperbarui freeze hash dan menaikkan
`REVISI_ENGINE`. Rev 2 telah mengoreksi prinsip itu; kode yang mendasari
koreksinya adalah:

- `sidikJariPack` sudah meng-hash isi kasus, obat, lab, IGD, keluarga, dan mapping.
- Freeze test mengunci 16 file engine, bukan file content.
- Pure content activation seharusnya mengubah fingerprint pack secara otomatis.
- `REVISI_ENGINE` dibutuhkan saat semantik replay/skor engine berubah.

Yang dibutuhkan adalah tiga konsep terpisah:

1. `REVISI_ENGINE`: semantik mesin.
2. `CONTENT_RELEASE`: cohort konten yang aktif.
3. `sidikJariPack`: bukti exact bytes/semantics pack saat build.

### 6.6 Masih ada order-dependent replay holes [V]

**Status rev 2: dikonfirmasi dan sudah menjadi task M13-0B, belum
diimplementasikan.** Ini bukan alasan menolak rev 2, tetapi harus menjadi gate
sebelum fingerprint dipakai sebagai kontrak cohort.

- Runtime IGD memakai `Object.values(pack.kasusIgd)` tanpa sorting sebelum pick.
- Fingerprint IGD justru menyortir berdasarkan ID.
- Reorder entri IGD dapat mengubah kasus terpilih tanpa mengubah fingerprint.
- Jadwal karma menyortir hanya menurut hari; tie mempertahankan insertion order.
- Fingerprint keluarga menyortir ID, sehingga reorder source dapat mengubah
  tie schedule tanpa perubahan hash.

Ini harus ditutup sebelum M13 mengandalkan fingerprint sebagai kontrak release.

### 6.7 Scale breadth dapat membunuh mastery [V/P/J]

**Status rev 2: diakui secara arah, belum dioperasionalkan.** Curated pool baru
disebut pada M13-3 dan belum ada threshold exposure/remediation untuk M13-1/2.
Simulasi 500-seed masih projection audit, belum script reproducible yang masuk
repo.

Director menganggap "belum pernah" bila `state.dex[id] === undefined`. Kasus
yang dijawab salah membuat entri Dex dan kehilangan pity slot khusus. Bobot
kasus lemah memang lebih tinggi, tetapi harus bersaing dengan ratusan kandidat.

Dua reviewer independen membuat projection 500-seed dengan algoritme Director
dan pool sintetis target. Hasilnya berdekatan:

| Mode | Paparan klinis target | Paparan IGD target |
|---|---:|---:|
| Career | sekitar 166-167 dari 204 | sekitar 8 dari 20 |
| Ujian | sekitar 75-77 dari 204 | sekitar 3 dari 20 |

Salah satu model 75% correctness juga menemukan mastery bintang-3 menurun
tajam setelah pool membesar. Ini [P], bukan ramalan absolut, tetapi arah kedua
model sama: katalog lebih kaya meningkatkan novelty sambil mengurangi revisit
dan remediation.

Implikasi strategis: **full library tidak harus sama dengan full active pool**.

### 6.8 Ujian belum mempunyai fixed blueprint [V]

**Status rev 2: solusi disebut, tetapi ditempatkan terlalu akhir.** Fixed
manifest baru muncul di M13-3. Padahal aktivasi pilot atau wave pertama sudah
dapat mengubah delapan seed Ujian. Blueprint/versioned manifest minimal perlu
selesai sebelum konten baru pertama aktif pada mode Ujian, atau pilot harus
secara eksplisit Career-only.

Delapan Paket Ujian saat ini pada dasarnya adalah seed, bukan manifest item.
Penambahan konten dapat mengubah semua bentuk Ujian lama. Test equivalence
sekarang hanya membandingkan total encounter, rasio referral, dan cakupan
kategori dengan toleransi longgar. Ia belum mengontrol:

- difficulty,
- jumlah trap,
- pediatric/KIA/mental health mix,
- demografi,
- stabilisasi,
- critical education,
- waktu rata-rata encounter,
- score spread bot standar.

M13 dapat membuat Ujian lebih kaya tetapi kurang comparable bila tidak ada
blueprint dan versioned manifest.

### 6.9 Argumen UKM Phase 0 memakai baseline yang sudah berubah [V]

**Status rev 2: prioritas telah dikoreksi dengan baik.** UKM tidak lagi
blocker. Namun argumen `26 > 24` hanya membandingkan jumlah skenario dengan
konstanta skor. Ia tidak membuktikan 24 kunjungan berhasil reachable pada seed
buruk, tidak tertabrak deadline/kegiatan lain, tidak repetitif, atau layak
secara waktu. Simulasi reach tetap dibutuhkan sebelum menyebut kebutuhan UKM
"sudah terlampaui".

`KONTEN_BALANCE.md` menulis "UKM kering minggu ke-2-3" saat baseline masih
6 keluarga/12 skenario. Baseline sekarang 16/26. Dengan satu slot lapangan,
kegiatan lain, kegagalan yang perlu diulang, dan target skor 24 kunjungan
Career, belum terbukti 26 skenario saat ini tetap kering pada minggu 2-3.

Target 40 masih mungkin baik untuk novelty dan longitudinal story, tetapi
prioritasnya harus diuji ulang melalui simulation/reach telemetry. Selain itu:

- 14 skenario pada batch 3-5 membutuhkan 3-5 batch, bukan 1-2.
- Keluarga ke-17 melanggar cap roster dan test saat ini.
- Keluarga tambahan dengan karma mengubah kepadatan deadline.
- Memanjangkan arc menunda epilog dan membuat badge penyelesaian lebih mahal.
- Empat belas skenario dengan pola hotspot-dialog-COM-B-kartu yang sama dapat
  menambah volume sekaligus memperbesar repetisi loop.

### 6.10 Target 20 IGD perlu definisi exposure [V/P/J]

**Status rev 2: belum diselesaikan.** Angka 20 tetap dipertahankan tanpa
anti-repeat, mode allocation, atau target paparan per run.

Frekuensi IGD tidak meningkat saat pool 5 -> 20. Pemain Career diproyeksikan
mengalami sekitar 9 IGD total dan Ujian sekitar 3. Dengan uniform replacement:

- 20 kasus memberi variasi lintas run,
- tetapi mayoritas kasus tidak terlihat dalam satu run,
- dan beberapa kasus dapat mengulang sebelum kasus lain pernah muncul.

DeepThink perlu memutuskan apakah 20 berarti library lintas mode, active pool
default, regional variants, atau target Endurance. Tanpa keputusan itu,
authoring 15 IGD baru mempunyai ROI paparan yang rendah.

### 6.11 Persona bukan presentasi atipikal [V/J]

**Status rev 2: batas scope dan fakta-invariance sudah ditulis dengan benar.**
Residualnya adalah defect assignment persona keluarga dan pertanyaan apakah
226 gap esensial benar perlu dibackfill semuanya atau cukup exposure-weighted.

`variasi` hanya mengganti jawaban berdasarkan persona dengan fallback ke
`jawab`. Ia tidak mengubah keluhan utama, vital, diagnosis, trajectory, atau
reasoning path. Backfill tetap berguna untuk immersion, tetapi:

- Fakta klinis harus invariant antarpersona.
- `skeptis` saat ini sama sekali belum terwakili.
- Lansia dan wali anak sangat tipis.
- Pertanyaan non-esensial tidak perlu otomatis memiliki enam variasi.
- Persona perlu style guide dan review kebocoran diagnosis/jargon.

Ada defect koherensi terkait: familiar-family patient dibuat dengan persona
dari umur random, lalu nama/umur/gender dapat ditimpa anggota keluarga setelah
persona dipilih. Persona tidak dihitung ulang. Backfill besar akan membuat
defect ini lebih terlihat.

### 6.12 Depth tier memotong dimensi yang salah bila dibaca literal [J]

**Status rev 2: prinsip safety floor sudah diadopsi.** Yang belum ada adalah
claim ledger, field completeness validator, dan sign-off workflow yang membuat
prinsip itu dapat dibuktikan per kasus, bukan hanya dibaca dalam prompt.

Rarity tidak sama dengan low-risk. Tier C boleh mempunyai vignette lebih
ringkas, lebih sedikit distraktor, dan lebih sedikit teaching pearl. Namun
semua tier tetap memerlukan safety floor yang sama:

- red flags dan diagnosis banding berbahaya,
- dosis, unit, rute, frekuensi, durasi, dan maksimum bila relevan,
- aturan usia/berat dan kehamilan/laktasi,
- kontraindikasi/interaksi,
- stabilisasi sebelum rujuk,
- urgency, destination, transport, dan handoff,
- follow-up dan safety-net,
- sumber exact section/page dan reviewer.

Schema runtime saat ini terutama menyimpan ID obat benar/salah/alternatif.
Dossier ini tidak otomatis menuntut engine schema besar sebelum pilot; safety
spec dapat lebih dulu hidup dalam authoring ledger/build-time validation.

### 6.13 Validator dan CI belum sebanding dengan risiko [V]

**Status rev 2: CI desktop sudah masuk M13-0B.** Residualnya adalah scope CI:
sekadar full Vitest/typecheck belum menutup path termination, ideal/dangerous
playthrough, source freshness, exam distribution, dan review metadata.

`validasiPack` kuat untuk referential integrity tertentu, tetapi tidak dapat
menentukan clinical truth. Ia belum generik membuktikan:

- setiap IGD punya tepat satu pilihan benar per langkah,
- correct path seluruh IGD mencapai stabilitas aman,
- wrong path dan disposisi berbahaya dihukum proporsional,
- semua branch UKM terminates,
- semua nested ID unik,
- trap selalu discoverable dari anamnesis,
- semua case mempunyai ideal dan dangerous playthrough,
- setiap scored claim mempunyai sumber aktif.

Workflow GitHub root saat ini menjalankan watchdog aplikasi web lama. Suite
`primera-desktop` belum menjadi protected CI gate. Test lokal 785/785 sangat
berharga, tetapi belum melindungi merge/release dan tidak membuktikan EBM.

### 6.14 Ukuran batch dan file akan melebihi kapasitas review [V/J]

**Status rev 2: ditangani.** Batch 4-6 poli dan 2-3 IGD/UKM sejalan dengan
rekomendasi. Activation wave tetap perlu dipisah dari commit authoring.

Kasus sekarang rata-rata sekitar 100+ baris. Batch rev 1 sebesar 10-15 dapat menjadi 1.200-
2.000 baris klinis, belum termasuk obat/lab/edukasi baru. Masalah utamanya
bukan waktu TypeScript, tetapi bandwidth reviewer manusia.

Draft persona diselipkan ke batch klinis juga memperlebar diff dan rollback.
Lebih sehat:

- 4-6 outpatient per review batch,
- 2-3 IGD atau UKM per review batch,
- persona dalam stream/commit terpisah,
- aktivasi atomic beberapa batch pada content-release boundary.

### 6.15 Port narrative "apa adanya" tetap tidak aman [V/J]

**Status rev 2: sebagian.** Fakta klinis diwajibkan dibangun ulang, tetapi rev 2
masih memberi label dialog/keluhan/temuan fisik sebagai narasi yang boleh
"diporting apa adanya". Itu terlalu luas: temuan fisik adalah klaim klinis;
dialog dapat memuat clue, stereotype, demografi, dan advice terselubung. Selain
itu, rev 2 merujuk commit lama `4d348d9`, sementara checkout repo lama yang
diaudit berada pada `6aa7436`; baseline port perlu dipin dengan jelas.

Narasi bukan fakta-free. Dialog lama dapat:

- membocorkan diagnosis,
- memakai jargon pasien yang tidak natural,
- membawa stereotype atau bahasa yang tidak manusiawi,
- bertentangan dengan demografi baru,
- mengandung temporal/clinical assertions terselubung,
- tidak cocok dengan progressive disclosure.

Repo lama boleh memberi ide, tetapi setiap shell memerlukan source commit,
old case ID, sanitization checklist, dan review bahasa pasien. Working tree
lama harus dipin; jangan membangun factory dari checkout bergerak.

### 6.16 Kontradiksi internal kecil tetapi material di rev 2 [V]

1. M13-0A disebut **dokumen saja/tanpa kode**, tetapi deliverable utamanya
   mengubah `src/content/skdi144.ts`.
2. Field sumber contoh masih menyebut `DOEN`, padahal bagian sumber sendiri
   menetapkan DOEN 2021 tidak berlaku.
3. Teks menyebut "4 kasus 4A tak tertaut", tetapi AST membuktikan lima. Dari
   50 self-tag 4A, 45 tertaut dan lima tidak. Tautan ke-46 justru
   `pneumonia_balita` (3B). Karena pneumonia juga wajib rujuk, tabel rev 2
   menghitung satu aset pada dua kolom saat menyebut total 63.
4. "PNPK Epilepsi Dewasa 2026 menggantikan Epilepsi Anak 2017" mencampur
   populasi dan harus dikoreksi menjadi applicability review.
5. Menaikkan `MAKS_BINAAN` saat ada keluarga baru diposisikan administratif,
   padahal cap roster dapat merupakan pilihan gameplay. Tambah keluarga tidak
   otomatis berarti semua keluarga harus dapat dibina sekaligus.
6. Rev 2 menyebut fixed Ujian dan curated pool sebagai tujuan M13-3, tetapi
   aktivasi M13-1/2 sudah terjadi sebelumnya.

### 6.17 Delta audit kasus existing tidak layak sekadar dikeluarkan [V/J]

Rev 2 menyebut audit PPK1936/PNPK2026 terhadap 67 kasus existing sebagai scope
terpisah yang "mungkin duluan". Karena kasus hipertensi, DM2, stroke, dan
epilepsi sudah aktif serta menjadi bridge keluarga/karma, minimal **targeted
delta review** terhadap klaim scored/high-risk mereka perlu menjadi gate
sebelum M13-1. Ini tidak berarti mengaudit ulang 67 dari nol; cukup registry
perubahan sumber, affected-case query, lalu adjudikasi dampak.

---

## 7. Dua opportunity yang sebaiknya menjadi pilot awal

Test saat ini mendokumentasikan dua mismatch karma UKM -> UKP yang sengaja
belum diperbaiki karena memerlukan konten baru:

1. Bayi Nayla usia sekitar 3 bulan diarahkan ke `diare_akut_anak` yang ditulis
   untuk anak 3-5 tahun.
2. Dimas usia 7 tahun diarahkan ke `asma_ringan` yang ditulis untuk usia 15-40
   dan memakai first-person adult anamnesis.

M13 dapat menghasilkan nilai langsung dengan membuat:

- kasus diare bayi/young infant yang sesuai MTBS dan demografi,
- kasus asma pediatrik yang benar-benar ditulis untuk wali anak.

Keduanya menguji pediatric authoring, persona wali anak, bridge UKM-UKP,
demografi, referential validation, dan source provenance sekaligus. Ini lebih
bernilai sebagai pilot daripada enam kasus acak hanya demi menambah angka.

---

## 8. Sintesis empat reviewer

| Jalur | Verdict inti | Kekhawatiran utama |
|---|---|---|
| Arsitektur/data | Perlu preparatory engine/pack phase | save/replay, ordering, family migration, active pool |
| Klinis/EBM | No-go bulk; go source normalization + pilot | sumber usang, definisi 144, safety schema, reviewer |
| Pedagogi/gameplay | Full library, curated active curriculum | mastery collapse, exam fairness, unseen content |
| Delivery/QA | Belum execution-ready | CI, batching, provenance, release protocol |

### 8.1 Konsensus kuat

Semua reviewer sepakat bahwa:

1. Aspirasi full library layak dipertahankan.
2. Authoring 152 langsung seperti rev 1 terlalu berisiko; rev 2 tepat telah
   menarik pendekatan itu.
3. Director/exposure tidak boleh dikeluarkan dari pertimbangan.
4. Katalog penuh tidak harus aktif penuh di setiap mode.
5. Source hierarchy dan provenance perlu diperbaiki sebelum factory.
6. Save/content release adalah blocker, bukan nice-to-have.
7. Pilot vertikal lebih informatif daripada batch besar pertama.
8. Safety floor harus sama di semua tier.
9. Persona harus dipisahkan dari klaim presentasi atipikal.
10. Reviewer throughput adalah bottleneck nyata.

### 8.2 Perbedaan yang masih perlu DeepThink putuskan

- Pilot disarankan antara 5-8 aset total sampai sekitar 12 klinis + 3 IGD.
- Satu reviewer meminta runtime schema obat sangat terstruktur sejak awal;
  reviewer lain menilai authoring ledger di luar runtime cukup untuk pilot.
- Target long-term aktif berbeda: ada yang menyarankan 100-120 outpatient,
  ada yang tetap mendukung 204 dengan mode gating ketat.
- Ambang simulation 1.000 vs 10.000 seeds perlu disesuaikan biaya CI.

### 8.3 Koreksi setelah verifikasi utama

Satu reviewer mengira `docs/references/` tidak committed karena ada aturan
`.gitignore`. Verifikasi `git ls-files` membuktikan 104/104 file lokal tracked;
temuan itu ditolak.

Satu hitungan awal menemukan 13 literal `harusDirujuk:true`, tetapi salah
satunya berada di komentar. AST/object audit mengonfirmasi 12 kasus nyata.

Hitungan level 4A dari extraction PPK berbeda menurut parser karena 13 bagian
tidak mudah diparse. Dossier ini tidak memakai angka parser tersebut sebagai
otoritas; fakta yang relevan adalah extraction memiliki 167 bagian dan tidak
sendiri membuktikan daftar 144.

Projection exposure tidak disajikan sebagai fakta produk. Dua model independen
memberi arah yang sama, tetapi acceptance final tetap memerlukan script yang
dicommit, seed set yang dapat diulang, dan review asumsi.

Audit AST lanjutan terhadap rev 2 menemukan denominator baru: 46 tautan terdiri
dari 45 kasus self-tag 4A dan satu kasus 3B (`pneumonia_balita`). Kasus tersebut
juga termasuk 12 wajib rujuk, sehingga 46+12+5 adalah 63 membership tetapi 62
aset unik. Koreksi ini menggantikan label rev 2 "46 kasus SKDI 4A tertaut"
tanpa menyimpulkan bahwa mapping pneumonia pasti salah.

---

## 9. Opsi strategi untuk diadjudikasi

### Opsi A - Kembali ke rev 1

**Isi:** 14 UKM dulu, lalu sekitar 152 kasus dalam batch 10-15 dan langsung
aktif.

**Status:** sudah ditarik dan tidak perlu dihidupkan kembali. Source drift,
save invalidation, exam mutation, shallow exposure, serta review overload
terlalu besar.

### Opsi B - Eksekusi rev 2 secara literal

**Isi:** jalankan M13-0A/0B/pilot seperti tertulis tanpa koreksi tambahan.

**Kelebihan:** plan sudah jauh lebih aman daripada rev 1 dan mudah dimulai.

**Risiko:** hierarki EBM masih salah arah, save lama hanya mendapat label
netral tetapi belum dilindungi, fixed Ujian/active pool terlambat, dan
curriculum manifest bercampur dengan file runtime.

### Opsi C - Rev 2.1 readiness, lalu pilot

**Isi:** pertahankan struktur rev 2, tetapi sebelum eksekusi kunci tujuh delta:

1. validasi provenance/cardinality 144,
2. manifest build-time atau keputusan sadar bahwa M13-0A adalah kode,
3. hierarki guideline -> PPK -> SKDI -> Fornas,
4. exact save/cohort policy,
5. active-pool dan exam policy sebelum aktivasi pertama,
6. targeted delta review sumber 2026 terhadap kasus existing,
7. source/claim ledger serta acceptance gates.

**Kelebihan:** perubahan kecil pada dokumen, penurunan risiko besar.

**Risiko:** menambah satu decision checkpoint sebelum count kasus mulai naik.

**Ini rekomendasi utama dossier.**

### Opsi D - Lean first release, full draft library

**Isi:** authoring boleh menuju full catalog dalam status `draft`, tetapi
release aktif pertama hanya 24-32 outpatient bernilai tinggi, sekitar 6 UKM,
dan 5 IGD tambahan setelah pilot. Evaluasi paparan/mastery/reviewer time sebelum
gelombang berikutnya.

**Kelebihan:** aspirasi 144/60/20 tetap hidup tanpa menjadikan semua konten
default pool.

**Risiko:** membutuhkan pemisahan draft/approved/active dan dapat terasa lambat
bagi target collector.

### Rekomendasi gabungan

Gunakan **C + disiplin aktivasi D**. Rev 2 tetap menjadi basis; rev 2.1 hanya
menutup residual yang berpengaruh pada keselamatan, fairness, dan kemampuan
membuktikan kualitas.

---

## 10. Rollout M13 yang direkomendasikan

### M13-0 - Decision Lock

Deliverable:

- Definisi tunggal "144".
- Keputusan catalog vs active pool.
- Keputusan source hierarchy.
- Keputusan save lintas content release.
- Keputusan mode ownership: Career, Ujian, regional/KLB, Endurance.

**STOP** bila salah satu masih ambigu.

### M13-0A - Canonical curriculum blueprint

Buat manifest satu baris per target dengan minimal:

```text
targetId
targetType
namaKurikulum
icd10
levelKompetensi
learningObjective
populasi
severity
fktpRole
disposition
tierDepth
prevalensi
activeModes
existingCaseId
variantOf
countsToward
sourceIds
reviewStatus
```

Manifest harus membedakan diagnosis, population variant, severity variant, dan
IGD scenario. Bila relasi target-ke-kasus boleh many-to-many, jangan memaksanya
ke satu `kasusId`; buat mapping eksplisit dengan alasan dan aturan hitung.
`countsToward` harus menyatakan apakah aset mengisi 144, referral, IGD, atau
lebih dari satu kategori. Tidak boleh ada duplikat yang menyamar sebagai
coverage baru.

### M13-0B - Source registry dan clinical claim ledger

Source registry minimal:

```text
sourceId
issuer
documentNumber
title
publicationDate
effectiveDate
currentStatus
supersedes / supersededBy
officialUrl
localHash
retrievedAt
applicablePopulation
applicableFacility
```

Claim ledger per kasus minimal memetakan sumber exact section/page untuk:

- diagnosis threshold,
- red flags,
- pemeriksaan/lab,
- regimen,
- contraindication/interaksi,
- rujukan dan stabilisasi,
- follow-up/safety-net,
- Fornas/facility restriction.

Ledger boleh build-time/non-runtime pada tahap pertama. Yang penting review
dapat diaudit dan source freshness dapat dijalankan ulang.

Sebelum pilot, jalankan targeted delta query untuk sumber baru 2026 terhadap
kasus existing yang terdampak, minimal hipertensi, DM2, stroke, dan epilepsi.
Hasil boleh "no change", tetapi keputusan itu harus tercatat per claim; jangan
menganggap judul guideline yang lebih baru otomatis mengganti guideline beda
populasi.

### M13-0C - Integrity release

Pekerjaan mesin yang layak mendapat satu `REVISI_ENGINE` bump sadar:

- Content release/fingerprint dicatat sejak run dimulai.
- Kebijakan reject/migrate lintas release diuji.
- Pool IGD dan tie karma diurut deterministik.
- Draft content tidak masuk active `PACK`.
- Active pool/mode ownership benar-benar ditegakkan runtime atau pilot dibuat
  Career-only sampai mekanisme itu tersedia.
- Fixed/versioned exam manifest atau equivalent blueprint dibuat.
- Desktop CI menjalankan typecheck, test, build, dan relevant simulations.
- Previous release dipertahankan untuk menyelesaikan/verifikasi cohort aktif.

### M13-1 - Vertical pilot

Pilot yang direkomendasikan:

- 6 outpatient:
  - diare bayi/young infant,
  - asma pediatrik,
  - satu 4A dewasa umum,
  - satu KIA,
  - satu mental health,
  - satu 3A/3B referral dengan stabilisasi.
- 1 IGD dengan full correct/wrong/disposition paths.
- 1 UKM continuation tanpa karma baru terlebih dahulu.
- Persona hanya pada pertanyaan esensial kasus pilot.

Gate pilot:

- source-complete,
- clinical reviewer dan content/ops reviewer berbeda dari author,
- physician adjudication untuk klaim medis,
- semua generated playthrough hijau,
- save/replay dan exam manifest stabil,
- defect material nol sebelum wave berikutnya.

### M13-2 - First measured wave

Setelah pilot:

- Tambah 4-6 outpatient per review batch.
- Tambah 2-3 IGD/UKM per review batch.
- Persona commit terpisah.
- Tiga atau empat batch yang approved diaktifkan sebagai satu content release.
- Jalankan 1.000-seed development simulation dan seluruh 8 exam forms.
- Ukur reviewer time, defect yield, exposure, mastery, dan completion time.

### M13-3 - Scale by evidence

Scale hanya bila wave sebelumnya lolos. Prioritas:

1. Common/high educational ROI.
2. Pediatric/KIA/mental health gap.
3. Referral/stabilization archetypes.
4. IGD yang berbeda algoritme, bukan sekadar nama baru.
5. Tier C langka sebagai regional/KLB/Endurance library bila tidak koheren
   dengan Sukamaju default.

### M13-4 - Full library and mode gating

Target katalog jangka panjang tetap boleh 144/60/20, tetapi distribusi:

- **Career:** common core, remediation, dan kontinuitas desa.
- **Ujian:** fixed blueprint/versioned manifest.
- **Regional/KLB:** penyakit kontekstual dan variasi epidemiologi.
- **Endurance:** collector hunt seluruh 144 dengan mastery-aware Director.

### M13-5 - Completion audit

M13 tidak dianggap selesai hanya karena jumlah objek mencapai target. Selesai
bila exact scope reconciled, sources current, review signed, release immutable,
exposure memenuhi target, dan tidak ada unresolved material defect.

---

## 11. Clinical safety floor yang diusulkan

Semua tier wajib memenuhi checklist berikut. Tier hanya mengubah narrative
richness, bukan keselamatan:

1. Learning objective dan batas kompetensi FKTP jelas.
2. Anamnesis memiliki pembuka natural dan tidak membocorkan diagnosis.
3. Red flags dan dangerous differential dapat ditemukan.
4. Pemeriksaan/lab sesuai kapasitas FKTP dan tidak mengarang alat universal.
5. Diagnosis benar selectable dan ICD mapping eksplisit.
6. Obat memuat regimen lengkap pada spec/ledger.
7. Special population rules ditinjau bila relevan.
8. Contraindication/interaksi dan common dangerous option tercakup.
9. Rujukan memiliki trigger, urgency, destination, stabilisasi, transport,
   handoff, dan prohibited delay.
10. Follow-up, reassessment, dan safety-net tercakup.
11. Edukasi benar-benar menutup keputusan penting kasus.
12. Sumber aktif exact section/page dan reviewer tercatat.

Review domain khusus disarankan untuk pediatric, KIA, mental health, IGD, dan
pharmacy. AI reviewer membantu consistency; ia tidak mengganti sign-off dokter.

---

## 12. Proposed gameplay and pedagogy gates

Angka berikut adalah proposal [J], bukan keputusan final. DeepThink diminta
menyetujui, mengubah, atau menggantinya.

### 12.1 Exposure dan epidemiologi

- Organic slots menghasilkan 65-80% exposure top-common diagnoses.
- Referral exposure berada sekitar 8-12% pada distribusi seed, bukan hanya mean.
- Career p10 mencapai 100% Tier A, >=80% Tier B, dan >=60% Tier C aktif.
- Rare/regional cases tidak dipaksa ke Sukamaju tanpa framing.

### 12.2 Mastery/remediation

- >=90% kasus salah/unsafe/unmastered mendapat remediation dalam 7 playable
  days bila waktu stase masih cukup.
- Profil pemain 75% accuracy tetap dapat mencapai median >=25 kasus bintang-3;
  bila tidak, badge/mastery language atau Director harus dikalibrasi ulang.

### 12.3 Ujian

- Paket dibalance menurut kategori, difficulty, referral, traps, demografi,
  UKM load, dan waktu.
- Standard bot score spread antarpaket <=2/100.
- Content release baru tidak mengubah paket cohort yang sedang aktif.
- Tidak ada jadwal karma/program yang membuat kegagalan UKM tidak terhindarkan.

### 12.4 UKM

- >=70% skenario baru dijangkau oleh >=25% pilot Career players.
- Tidak ada skenario mahal dengan reach <10% kecuali jelas optional/endgame.
- Skenario baru memperkenalkan longitudinal decision atau cadence baru, bukan
  hanya reskin hotspot-dialog-kartu.

### 12.5 IGD

- >=85% event IGD dalam satu run unik sebelum repeat bila pool memungkinkan.
- Target 20 baru dilepas default bila Career dapat melihat >=50% pool, atau
  sisanya secara eksplisit dialokasikan ke regional/Endurance.

### 12.6 Cognitive load

- Pemain dapat mencapai skor anamnesis >=90 dengan maksimal delapan pertanyaan
  yang dipilih tepat.
- Median Tier A encounter <=5 menit pada usability pilot.
- Penambahan kasus tidak menurunkan completion rate >5%.
- Pilot mahasiswa menilai novelty/immersion meningkat tanpa kebingungan
  clinical flow yang meningkat.

---

## 13. QA, release, dan stop criteria

### 13.1 Pipeline minimum

Per review batch:

- target/manifest validation,
- source freshness validation,
- generated ideal and dangerous playthroughs,
- relevant targeted tests,
- full desktop Vitest,
- typecheck dan build.

Per content release:

- 1.000-seed development simulation,
- 10.000-seed final calibration bila cost masuk akal,
- seluruh 8 exam manifests,
- save/replay compatibility,
- reorder determinism test,
- full-run simulation untuk mode 30/90 hari,
- package smoke,
- artifact/source-registry hash archive.

### 13.2 Workflow status kasus

```text
DRAFT
-> SOURCE_COMPLETE
-> CLINICAL_REVIEWED
-> OPS_REVIEWED
-> PHYSICIAN_ADJUDICATED
-> APPROVED_FOR_WAVE
-> ACTIVE_IN_CONTENT_RELEASE
```

Author tidak menandatangani review klinisnya sendiri. Perubahan scored medical
field setelah review mengembalikan kasus ke tahap clinical review.

### 13.3 Hard stop

Stop kasus/batch/release bila ada:

- target tidak termap atau duplicate ambiguity,
- sumber superseded/tidak lengkap,
- disagreement reviewer belum selesai,
- regimen atau rujukan tidak lengkap,
- frozen engine berubah incidental,
- desktop CI gagal,
- cross-release save ambiguity,
- honest artifact dapat menjadi `tidak_sah`,
- P0/P1 clinical defect,
- exam form jomplang,
- active cohort harus berubah diam-diam.

Jangan silent rollback cohort aktif. Pertahankan matching release atau lakukan
forward correction yang versioned dan terdokumentasi.

---

## 14. Pertanyaan keputusan untuk DeepThink

### Q1 - Seberapa kanonik katalog 144 saat ini?

Apakah tepat 144 ID unik hasil port cukup untuk dijadikan source of truth, atau
harus direkonsiliasi sekali lagi terhadap dokumen kurikulum/PPK otoritatif?
Bedakan validitas sebagai katalog Dex operasional dan sebagai standar
kurikulum nasional, termasuk verifikasi apakah SKDI 2012 masih menjadi acuan
yang tepat untuk cohort dan tujuan game ini pada 2026.

### Q2 - Apa unit hitung final target 144/60/20?

Diagnosis, learning objective, objek kasus, severity/population variant, atau
encounter? Bolehkah satu diagnosis 4A memiliki varian referral yang juga masuk
target 60, dan bila boleh apakah ia dihitung sekali atau dua kali?

### Q3 - Di mana curriculum blueprint seharusnya hidup?

Pilih: memperluas `skdi144.ts`, manifest build-time terpisah yang memvalidasi/
menghasilkan runtime mapping, atau database authoring lain. Bagaimana
menghindari review metadata masuk bundle pemain tanpa manfaat?

### Q4 - Apakah hierarki sumber berikut disahkan?

Guideline penyakit/program terkini untuk regimen -> PPK untuk konteks FKTP ->
SKDI untuk objective/level -> Fornas untuk restriction/coverage -> stok lokal
untuk realita. Koreksi secara eksplisit bila DeepThink memilih urutan lain.

### Q5 - Seberapa besar delta audit sumber 2026 sebelum pilot?

Apakah targeted review hipertensi, DM2, stroke, dan epilepsi existing menjadi
hard gate M13-1? Bagaimana memperlakukan guideline dewasa vs anak agar tidak
terjadi false supersession?

### Q6 - Kebijakan save lintas content release mana yang adil?

Pilih: hard lock, preserve old build, full migration, atau hybrid
Career-migrate/Ujian-lock. Apakah sekadar memberi verdict
`tidak_dapat_diverifikasi` cukup, atau run harus tetap memakai pool awal?

### Q7 - Apa truth table versi yang final?

Kapan `REVISI_ENGINE`, `CONTENT_RELEASE`, dan `sidikJariPack` berubah? Apa
kebijakan untuk field display yang tidak di-hash, rollback, hotfix klinis, dan
cohort yang sedang aktif?

### Q8 - Kapan active-pool/mode policy harus tersedia?

Apakah pilot boleh Career-only dan inactive di Ujian, atau runtime mode gating
harus selesai di M13-0B? Berapa kasus yang sehat untuk pool aktif release
pertama?

### Q9 - Kapan fixed/constrained Ujian wajib selesai?

Sebelum aktivasi pilot, sebelum M13-2, atau baru M13-3 seperti rev 2? Pilih
fixed manifest, constrained blueprint draw, atau hybrid anti-hafalan yang tetap
equivalent.

### Q10 - Bagaimana mastery/remediation dijaga saat breadth naik?

Apakah unseen guarantee berbasis `dex[id] === undefined` perlu diubah agar kasus
yang salah tetap mendapat remediation? Gate exposure dan bintang-3 mana yang
harus menghambat wave berikutnya?

### Q11 - Apakah posisi UKM rev 2 sudah tepat?

Setujukah UKM bukan blocker, tetapi quality expansion M13-2? Apakah 26 -> 32/34
lebih sehat daripada langsung 40, dan simulasi reach/scheduling apa yang wajib?

### Q12 - Apa makna target 20 IGD?

Default pool, library lintas run, regional pool, atau Endurance? Apakah
anti-repeat/mode allocation wajib sebelum 15 tambahan diaktifkan?

### Q13 - Apa scope persona yang proporsional?

Seluruh 226 pertanyaan esensial, top-exposure cases, atau persona-gap first?
Apakah bug persona pasien keluarga harus dibereskan sebelum backfill besar?

### Q14 - Apa aturan porting narasi lama?

Apakah dialog/keluhan/temuan fisik boleh "apa adanya", atau hanya sebagai
inspirasi setelah sanitasi? Commit sumber mana yang dipin, dan metadata
provenance minimum apa yang disimpan?

### Q15 - Apakah ledger build-time cukup untuk safety floor?

Haruskah structured regimen masuk schema runtime sebelum pilot, atau claim
ledger exact section/page + validator + physician sign-off sudah cukup untuk
wave awal?

### Q16 - Apakah pediatric bridge menjadi pilot wajib?

Mismatch Nayla/diare bayi dan Dimas/asma anak sekarang sudah diverifikasi di
test dan source. Apakah keduanya vertical slice terbaik, atau ada kombinasi
lain yang lebih mewakili 4A/referral/IGD/UKM?

### Q17 - Gate numerik mana yang disahkan?

Adjudikasi threshold exposure, remediation, exam spread, UKM reach, IGD reach,
cognitive load, seed count, reviewer time, dan defect yield di Bagian 12-13.

### Q18 - Apa keputusan final untuk rev 2?

Pilih GO, CONDITIONAL GO dengan rev 2.1, atau NO-GO. Bila conditional, tuliskan
syarat sebelum: (1) draft authoring, (2) aktivasi pilot, (3) batch produksi,
dan (4) cohort mahasiswa pertama.

---

## 15. Format jawaban DeepThink yang diminta

Mohon jawab dengan urutan:

1. **Executive verdict:** GO / CONDITIONAL GO / NO-GO untuk kickoff sekarang.
2. **Keputusan Q1-Q18:** keputusan, alasan, trade-off, dan fallback.
3. **P0/P1/P2 roadmap:** apa yang wajib sebelum authoring, sebelum activation,
   dan sebelum cohort.
4. **Revised milestones:** boleh menerima atau mengganti M13-0 sampai M13-5.
5. **Acceptance criteria:** angka yang disahkan atau penggantinya.
6. **What not to build:** scope yang harus sengaja ditunda.
7. **Bias check:** risiko keputusan terlalu completionist, terlalu takut, atau
   terlalu percaya bahwa test hijau berarti konten medis benar.

DeepThink diminta menandai dengan jelas mana:

- keputusan strategi,
- fakta kode yang perlu diverifikasi ulang,
- fakta medis yang harus kembali ke adjudikasi Dr. Wirayuda.

---

## 16. Bias-check mandatory

Sebelum memberi verdict, pertimbangkan bias berikut:

1. **Completionism:** angka 144 terasa sakral walau exposure tidak mendukung.
2. **Quantity illusion:** object count disamakan dengan kurikulum kaya.
3. **Content-only optimism:** penambahan data dianggap tidak mengubah engine.
4. **Test-green fallacy:** referential integrity dianggap clinical correctness.
5. **Local-cache anchoring:** sumber lokal dianggap otomatis terbaru.
6. **Old-repo sunk cost:** aset lama dipaksakan karena sudah tersedia.
7. **Novelty bias:** lebih banyak kasus dianggap otomatis lebih fun.
8. **Overengineering:** schema/provenance terlalu besar sehingga pilot tak pernah
   dimulai.
9. **Risk paralysis:** karena ada risiko, proyek berhenti padahal staged pilot
   cukup aman.
10. **Reviewer-capacity blindness:** authoring AI lebih cepat daripada manusia
    dapat memeriksa.
11. **Assessment leakage:** Career fun dijadikan alasan melonggarkan fairness
    Ujian.
12. **Mode conflation:** Career, Ujian, regional, dan Endurance dipaksa memakai
    pool dan pacing yang sama.
13. **Cognitive-load blindness:** panjang kasus dipandang sebagai kedalaman,
    bukan beban interaksi mahasiswa.
14. **Epidemiology flattening:** semua penyakit dianggap cocok muncul acak di
    Desa Sukamaju.

---

## 17. Hal yang tidak perlu diperdebatkan ulang

1. Tidak pernah terjadi penghapusan besar kasus; 67 bukan hasil sabotase.
2. M10.5 dan sisa M11 terukur sudah selesai pada branch eksperimen ini.
3. Repo lama bukan clinical authority.
4. Fakta klinis baru harus di-ground ulang.
5. UKM dan IGD adalah sistem berbeda dari kasus poli.
6. Regional dan Endurance belum disetujui sebagai fitur penuh di kickoff ini.
7. Tujuh keluarga desaE/F satu babak memang by design pada source saat ini.
8. `bukaSetelah` anamnesis adalah progressive disclosure selektif, bukan graph
   prerequisite penuh.
9. Full catalog dapat tetap menjadi aspirasi meski release pertama lebih kecil.

Yang perlu DeepThink putuskan adalah cara mencapai aspirasi itu tanpa merusak
produk yang sudah stabil.

---

## 18. Evidence map

### Dokumen lokal

- `docs/M13_KICKOFF_PROMPT.md`
- `docs/DEEPTHINK_M13_SKALA_PENUH.md`
- `docs/CODEX_HANDOFF_DOSSIER.md`
- `docs/KONTEN_BALANCE.md`
- `docs/ROADMAP.md`

### Kode kunci

- `src/content/skdi144.ts` - katalog 144 dan manual mapping.
- `src/content/index.ts` - assembly pack dan auto-link ICD.
- `src/content/pack.ts` - validator saat boot.
- `src/content/pack.test.ts` - 46 linked cases dan known bridge mismatch.
- `src/content/types.ts` - contract kasus/persona/UKM/IGD.
- `src/engine/director.ts` - draw, prevalence, unseen guarantee, referral cap.
- `src/engine/reducer.ts` - pacing, decay, IGD trigger, family cap.
- `src/engine/init.ts` - family state dan karma schedule.
- `src/engine/save.ts` - save v1 dan migration behavior.
- `src/engine/verifikasi.ts` - pack fingerprint, dossier, replay.
- `src/engine/freeze.test.ts` - 16 frozen engine files.
- `src/engine/scoring.ts` - 24/8 expected UKM visits.
- `src/engine/paketUjian.ts` dan `paketUjian.test.ts` - exam seeds/equivalence.

### Repro checks triangulasi

- TypeScript AST atas 7 modul kasus: 67 objek; level 50/7/9/1;
  `harusDirujuk:true` pada 12 objek nyata.
- AST `SKDI144` + simulasi auto-link `index.ts`: 144 target, 46 linked entries,
  46 linked unique cases, terdiri dari 45 self-tag 4A + satu 3B; nol kasus yang
  saat ini mengisi dua target.
- Intersection linked/referral: hanya `pneumonia_balita`; union 46 linked + 12
  referral + 5 IGD = 62 aset unik.
- `git ls-files docs/references`: 104 file tracked; filesystem juga 104 file;
  PNPK memiliki 38 subfolder.
- Script AST denominator dijalankan ad hoc saat dossier disusun dan belum
  menjadi artefak CI. M13-0A sebaiknya mengubahnya menjadi validator committed.

### Sumber resmi eksternal

- Status DOEN 2021 (tidak berlaku):
  `https://farmalkes.kemkes.go.id/unduh/kepmenkes-6477-2021/`
- Fornas KMK 1199/2025:
  `https://farmalkes.kemkes.go.id/unduh/keputusan-menteri-kesehatan-republik-indonesia-nomor-hk-01-07-menkes-1199-2025-tentang-formularium-nasional/`
- e-Fornas Kemenkes:
  `https://e-fornas.kemkes.go.id/`
- Katalog PNPK Kemenkes:
  `https://keslan.kemkes.go.id/produkhukum?id=2`
- SKDI KKI 2012:
  `https://kki.go.id/uploads/media/1683689635_fa3dea59333025ae148a.pdf`

---

## 19. Rekomendasi CODEX sebelum jawaban DeepThink

**Verdict sementara CODEX: CONDITIONAL GO UNTUK REV 2.1.**

Rev 2 sudah membatalkan content factory dan bergerak ke arah yang benar. M13-0A
boleh dimulai sekarang sebagai pekerjaan keputusan/manifest. Aktivasi konten
baru, dan terutama authoring massal, ditahan sampai:

1. provenance dan unit hitung 144/60/20 disahkan,
2. source hierarchy diperbaiki dan targeted delta review 2026 selesai,
3. exact content-release/save/cohort policy aman,
4. deterministic holes ditutup,
5. exam dan Director active-pool policy berlaku sebelum aktivasi pertama,
6. desktop CI, claim ledger, dan corpus/path validators tersedia,
7. vertical pilot lolos clinical, pedagogy, replay, dan exposure review.

Strategi yang paling menjanjikan adalah:

> **Full authoring ambition, curated active curriculum, atomic release waves.**

Ini menjaga kekayaan game sebagai khazanah jangka panjang tanpa mengubah Career
menjadi parade diagnosis sekali lihat, Ujian menjadi seed yang terus bergeser,
atau save mahasiswa jujur menjadi korban pergantian konten.

Jadi keputusan ini **bukan** "tunda M13". Keputusannya adalah: mulai fondasi
M13 sekarang, koreksi rev 2 menjadi rev 2.1, lalu izinkan pilot kecil membuktikan
pipeline sebelum volume authoring menjadi tujuan tersendiri.

---

## 20. Deklarasi integritas dossier

Dossier ini dibuat dari audit read-only terhadap **kickoff rev 2**, repository,
sumber lokal, dan sumber resmi daring, ditambah empat review independen serta
jejak kritik rev 1 yang sudah ditarik. Sebelum file ini dibuat, tidak ada kode
atau konten game yang diubah. Hasil projection telah ditandai [P] dan tidak
dipresentasikan sebagai fakta empiris pemain. Temuan agen yang salah atau tidak
dapat direproduksi telah dikoreksi atau dikeluarkan.

Dokumen ini sendiri adalah proposal keputusan. Ia belum menggantikan
`M13_KICKOFF_PROMPT.md` sampai Dr. Wirayuda menerima adjudikasi DeepThink dan
secara eksplisit memerintahkan revisi kickoff.
