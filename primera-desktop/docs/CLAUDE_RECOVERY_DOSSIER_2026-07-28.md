# CLAUDE RECOVERY DOSSIER - PRIMERA

**Tanggal snapshot:** 28 Juli 2026  
**Pemilik produk dan penanggung jawab klinis:** dr. Anak Agung Bagus Wirayuda  
**Repo aktif:** `D:\Dev\PRIMER-CODEX-lab\primera-desktop`  
**Branch aktif:** `codex-gpt56-experiment`  
**Snapshot gameplay:** commit `320979516a55e94916a25d0157c2c1058180a688`

**Build distribusi:** `1.1.0-beta.3`, tag `test-beta-3209795`

**Tujuan dokumen:** memulihkan konteks Claude/Fable setelah crash total, sampai
ke keadaan source, keputusan, build, risiko, dan antrean kerja paling mutakhir.

> **BACA DOKUMEN INI TERLEBIH DAHULU.**
>
> Dossier lama tetap berguna sebagai arsip, tetapi sejumlah angka, status
> milestone, aturan sumber, dan daftar pekerjaan di dalamnya sudah basi.
> Dokumen ini adalah pintu masuk operasional terbaru. Untuk keputusan M13 yang
> lebih formal, tetap gunakan `M13_KICKOFF_PROMPT.md` dan
> `M13_DECISION_LOG.md`.

---

## 0. Ringkasan Pemulihan Lima Menit

PRIMERA adalah simulator desktop dokter Puskesmas Indonesia, dibangun dengan
Electron, React, TypeScript, dan engine deterministik. Visi ringkasnya:
**kerangka Football Manager, hati Harvest Moon, tetapi grounded pada praktik
FKTP Indonesia.** UKP dan UKM adalah dua pilar ko-primer. UKM bukan minigame
atau pendamping.

Snapshot saat dossier ini ditulis:

- `210` kasus poli di runtime:
  - `73` kasus baseline/formal lama;
  - `16` prototipe M13-137 yang sudah diadjudikasi dokter;
  - `121` prototipe yang masih **formatif**, bukan penilaian formal.
- Seluruh `144/144` baris katalog FKTP memiliki encounter playable, tetapi
  ketersediaan playable tidak sama dengan seluruhnya sudah divalidasi dokter.
- `20` kasus IGD, terdiri dari baseline dan `14` ekspansi yang sudah memiliki
  adjudikasi dokter.
- `16` keluarga binaan dan `27` skenario kunjungan UKM.
- `REVISI_ENGINE = 61`.
- `CONTENT_RELEASE = clinical-provenance-2026-07-28`.
- Versi aplikasi `1.1.0-beta.3`.
- Full suite terakhir: `150` file, `1377/1377` test lulus.
- E2E Electron terakhir: `4/4` lulus pada build produksi.
- Typecheck bersih; freeze Golden Master `18/18` lulus.
- Provenance runtime:
  - poli `210/210`;
  - IGD `20/20`;
  - kunjungan keluarga `27/27`;
  - Posyandu, Prolanis, KLB, Duel Diagnosis, dan Teach-back;
  - `263` URL unik, `490` pemakaian link poli, dan `0` URL dipastikan mati.
- Installer terbaru sudah dibangun, dipasang, dan diverifikasi sebagai
  instalasi aktif:
  - `dist\PRIMERA test-beta Setup 1.1.0-beta.3.exe`
  - ukuran `107,972,356` byte;
  - SHA-256
    `75498F3BDC1D6EA022AC0D189AAE2B02FD30C6A23FB3DC86CD457059779CE6CA`;
  - status Authenticode: **NotSigned**.
  - versi executable, package internal `app.asar`, dan registry Windows
    semuanya terverifikasi `1.1.0-beta.3`.
  - GitHub prerelease:
    `https://github.com/anakwirayuda-eng/PRIMER/releases/tag/test-beta-3209795`.

**Peringatan paling penting:** batch kode terbaru sudah committed, pushed,
ditag, dirilis, dan dipasang. Gerbang yang kini benar-benar terbuka bukan lagi
penyegelan Git, melainkan M13-1b human pilot dan physician adjudication
M13-137 item 17-137. Jangan menyamakan provenance lengkap atau compiler
`137/137 cocok` dengan persetujuan dokter atas seluruh prototipe.

---

## 1. Siapa, Untuk Siapa, dan Cara Bekerja

### 1.1 Pemilik dan pengguna

dr. Anak Agung Bagus Wirayuda adalah dokter, peneliti, solo developer, product
owner, dan penanggung jawab klinis PRIMERA. Target utama adalah mahasiswa
Fakultas Kedokteran Indonesia, khususnya pembelajaran blok IKM/KP sekitar
September 2026.

HAKI resmi: `EC002026019623`, nama legal
`PRIMER: Primary Care Manager Simulator`. Nama legal di metadata tidak boleh
diubah hanya karena nama tampilan sekarang PRIMERA.

### 1.2 Preferensi kerja Dr. Wirayuda

- Bahasa komunikasi utama Indonesia, dengan istilah teknis Inggris bila lebih
  tepat.
- Menginginkan kritik jujur, bukan konfirmasi kosong.
- Mengutamakan game yang benar-benar playable dan dapat dirasakan hasilnya,
  bukan siklus dokumen atau adjudikasi mikro tanpa akhir.
- Bila beliau lelah dan memberi jawaban yang kontradiktif, agen harus
  mendeteksi kontradiksi, memeriksa sumber/kode, dan menawarkan rekonsiliasi
  ringkas. Jangan mengatasnamakan beliau, tetapi jangan pula memaksa
  ping-pong pertanyaan yang sebenarnya dapat diselesaikan secara mekanis.
- Keputusan medis baru yang material tetap milik dokter. Idealnya dikumpulkan
  dalam batch kecil yang jelas, bukan ditanyakan satu baris setiap beberapa
  menit.
- Ia menyukai eksekusi tuntas: implementasi, test, build, installer, hash, dan
  backup. Namun setiap hasil harus tetap jujur tentang keterbatasannya.

### 1.3 Peran agen

Secara historis:

- Claude/Fable berperan sebagai builder, orkestrator, editor, dan reviewer.
- CODEX mula-mula audit-only, lalu secara eksplisit diizinkan menjadi builder
  di clone lab.
- DeepThink dipakai untuk triangulasi keputusan besar, tetapi semua klaimnya
  tetap harus diverifikasi ke kode dan sumber primer.

Aturan sekarang bukan lagi "Claude berpikir, CODEX sekadar pesuruh" secara
kaku. Keduanya boleh membangun di lab sesuai instruksi terbaru, tetapi:

- tidak boleh saling mempercayai laporan tanpa verifikasi;
- tidak boleh self-sign keputusan klinis;
- tidak boleh mengulang milestone tertutup tanpa bukti baru;
- harus bekerja pada source aktual, bukan memori percakapan.

---

## 2. Lokasi Repo dan Batas Keselamatan

### 2.1 Repo yang benar

Kerjakan hanya:

```text
D:\Dev\PRIMER-CODEX-lab\primera-desktop
```

Branch:

```text
codex-gpt56-experiment
```

Remote:

```text
https://github.com/anakwirayuda-eng/PRIMER.git
```

### 2.2 Repo lain yang jangan tertukar

- `D:\Dev\PRIMER\src\` adalah PRIMER web lama. Ia pernah mengalami
  ICD-translation poisoning. Boleh menjadi referensi shell naratif hanya jika
  diminta, tetapi data klinisnya tidak boleh diporting mentah.
- Worktree Claude produksi lama di bawah
  `D:\Dev\PRIMER\.claude\worktrees\...` bukan repo aktif eksperimen ini.
- `primera-arena` adalah companion multiplayer terpisah dan bukan scope
  gameplay desktop saat ini.

### 2.3 Aturan Git

- Jangan push ke `master` atau branch produksi Claude.
- Jangan force-push.
- Jangan reset/revert perubahan yang tidak dibuat sendiri.
- Pada snapshot dossier ini, working tree gameplay bersih sebelum artefak
  adjudikasi dan dossier diregenerasi. Tetap jalankan `git status` karena
  status dapat berubah setelah dokumen ini ditulis.
- Commit gameplay/distribusi yang sudah ada di remote:

```text
3209795 feat(beta): complete clickable clinical provenance
```

- Branch lokal dan remote sama-sama menunjuk `3209795` saat verifikasi.
- Tag `test-beta-3209795` menunjuk commit tersebut.
- Installer adalah GitHub Release asset, bukan file yang di-commit ke Git;
  `dist/` tetap di-ignore dengan sengaja.

---

## 3. DNA Produk yang Tidak Boleh Hilang

### 3.1 Visi pengalaman

PRIMERA bukan bank soal berkulit game. Ia harus terasa sebagai simulator
longitudinal:

- keputusan klinis punya konsekuensi;
- keluarga, program, surveilans, rujukan, ekonomi, dan burnout saling
  memengaruhi;
- pemain menerima closure dan callback, bukan hanya nilai;
- pedagogi tetap jelas tanpa cognitive overload;
- suasana punya kehangatan dan storylette, tetapi tidak berubah menjadi novel
  panjang yang mengganggu loop.

### 3.2 UKP dan UKM ko-primer

Keputusan governance 19 Juli 2026:

- UKM bukan pendamping UKP;
- setiap rilis mayor harus menilai klinik sekaligus dampak keluarga/populasi/
  program/jejaring bila relevan;
- hubungan UKM-UKP harus kausal dan timbal balik, bukan sekadar hyperlink atau
  narasi dekoratif;
- kualitas diukur dari agency, feedback, consequence, closure, continuity,
  dan transfer belajar, bukan dari menyamakan jumlah layar.

### 3.3 Simulasi representatif, bukan simulasi total

Game sengaja tidak mencoba memodelkan semua realita fasilitas, seluruh
workflow RME, atau seluruh regimen dosis sebagai input pemain. Abstraksi
diterima bila:

- mempertahankan keputusan klinis/publik-health yang penting;
- tidak menciptakan fakta palsu;
- tidak memberi hidden penalty dari resource yang tidak dinyatakan;
- tidak membebani pemain dengan administrasi yang tidak memberi nilai belajar.

**Keputusan terbaru pengguna:** mekanik input dosis/frekuensi/durasi resep
ditunda agar pemain tidak overload. Dosis boleh tetap diajarkan pada konten,
feedback, atau referensi; jangan membangun form regimen baru sekarang.

---

## 4. Arsitektur dan Hukum Engine

### 4.1 Stack

- Electron
- React 19
- TypeScript strict
- Zustand
- electron-vite
- Vitest
- Playwright Electron + Axe

### 4.2 Engine deterministik

`src/engine/` tidak boleh memakai `Date.now()` atau `Math.random()` sebagai
sumber keputusan gameplay. Seluruh randomness harus melalui RNG ber-seed.
Determinisme menopang replay dossier, fairness Ujian, dan reproduksibilitas.

### 4.3 Action log adalah sumber kebenaran

`GameState.jejak` menyimpan aksi. Perubahan scoring harus mengikuti:

```text
Action -> reducer -> SkorTally -> scoring.ts
```

UI tidak boleh menulis skor secara langsung.

### 4.4 Freeze Golden Master

Saat ini `freeze.test.ts` mengunci `18` file semantik. Jika file beku berubah:

1. selesaikan seluruh edit kode;
2. bump `REVISI_ENGINE` bila semantik replay/scoring berubah;
3. tambahkan migrasi/save compatibility bila perlu;
4. jalankan test tertarget;
5. hitung dan paste hash **paling akhir**;
6. jalankan full suite, typecheck, soak, E2E bila relevan.

Jangan menghitung hash sebelum bump `REVISI_ENGINE`, karena
`verifikasi.ts` sendiri ikut di-hash.

### 4.5 Tiga kelas perubahan

- `cosmetic`: typo/polish murni; tidak mengubah informasi keputusan.
- `decision-facing`: teks atau reveal yang mengubah informasi pemain; bump
  `CONTENT_RELEASE` walau mungkin tidak masuk fingerprint.
- `replay-scoring`: mengubah pool, action, state, jawaban, skor, konsekuensi,
  atau replay; perlu release/bump/fingerprint sesuai dampak.

`CONTENT_RELEASE` bukan tally migration. Jangan memakai `tandaiMigrasi` untuk
release id.

### 4.6 Frozen build per cohort

Tidak ada jaminan save rilis lama dapat dilanjutkan dengan konten baru karena
runtime masih memakai singleton `PACK`. Untuk kohort akademik:

- bekukan build selama stase;
- rilis di antara kohort;
- simpan manifest commit, app version, engine revision, content release,
  fingerprint, dan installer hash;
- save beda release diperlakukan sebagai arsip/fork epoch baru, bukan
  dianggap curang.

---

## 5. Kebijakan Klinis dan Evidence

### 5.1 Prinsip universal

Keputusan dr. Wirayuda 15 Juli 2026:

> PPK/PNPK dan aturan Kemenkes aktif terbaru adalah baseline atau floor, bukan
> ceiling. EBM yang lebih baru atau lebih kuat boleh menaikkan standar bila
> applicable, diberi sitasi eksplisit, dan diterapkan dengan graceful
> degradation sesuai resource serta jejaring FKTP Indonesia.

### 5.2 Hierarki sumber operatif

1. PPK FKTP aktif dan PNPK/aturan Kemenkes aktif sesuai topik/populasi.
2. Guideline primer atau sintesis EBM mutakhir yang applicable.
3. Fornas aktif untuk listing/restriksi formularium, bukan stok.
4. KFA untuk identitas/nomenklatur, bukan stok.
5. ASPAK untuk gambaran sarana, bukan readiness real-time.
6. Verifikasi lokal/SOP untuk stok, fungsi, bahan habis pakai, SDM, transport,
   dan kemampuan tujuan rujuk.

Koreksi penting:

- Fornas aktif yang dipakai proyek adalah KMK 1199/2025, efektif 1 April 2026.
- DOEN 2021 sudah dicabut dan hanya boleh dipakai sebagai konteks historis.
- Jangan menulis "ada di Fornas" sebagai "pasti tersedia di Puskesmas ini".

### 5.3 Graceful degradation

- Resource terverifikasi tersedia: boleh menjadi kewajiban skor.
- Bervariasi/unknown: sebutkan standar ideal, cek resource, lalu pakai
  alternatif yang punya sumber atau stabilisasi sambil rujuk.
- Tidak tersedia/di luar scope: nilai stabilisasi feasible dan disposisi aman;
  jangan improvisasi tanpa protokol.

### 5.4 M13-RP1

Profil naratif `sukamaju_middle_v1` disetujui:

- Puskesmas perdesaan nonrawat-inap;
- core service layak;
- resource khusus, PONED, transport, operator, dan tujuan rujukan harus
  dinyatakan bila relevan.

Yang **tidak** disetujui sebagai fitur runtime sekarang:

- `FacilityResourceProfile`;
- lima state readiness dinamis;
- downtime alat;
- resource gate baru untuk seluruh kasus lama.

Resource Tier A-D tetap checklist editorial, bukan state engine.

### 5.5 Provenance runtime aktif dan batas klaimnya

Build `beta.3` menutup coverage provenance yang sebelumnya parsial:

- `210/210` kasus poli memiliki `2-10` sumber terstruktur;
- setiap kasus poli mempunyai sekurangnya satu sumber Indonesia dan satu
  evidence internasional;
- `20/20` IGD tetap memiliki debrief dan sumber clickable;
- `27/27` skenario kunjungan mempunyai floor UKM serta evidence resep sosial
  yang dipilih;
- Posyandu, Prolanis, KLB, delapan Duel Diagnosis, dan delapan Teach-back
  memiliki tautan sumber pada titik debrief yang sesuai;
- seluruh URL keluar harus HTTPS tanpa embedded credentials.

Sumber poli diberi status cakupan:

- `langsung`: menopang keputusan encounter secara langsung;
- `terkait`: relevan, tetapi tidak boleh dipresentasikan sebagai guideline
  diagnosis-spesifik;
- `floor_umum`: batas bawah layanan/regulasi; wajib disertai catatan batas
  interpretasi.

Inventaris saat build:

- `490` pemakaian sumber poli:
  - `412` langsung;
  - `59` terkait;
  - `19` floor umum;
- `263` URL unik lintas poli, IGD, UKM, dan pilot pedagogik;
- audit otomatis terakhir:
  - `210` terjangkau langsung;
  - `52` dibatasi anti-bot/HTTP 403 tetapi bukan URL mati;
  - `0` dipastikan rusak;
  - `1` laman resmi Ditjen P2 TB intermiten pada fetch otomatis, tetapi
    terbuka saat pemeriksaan browser manual.

Lokasi penting:

```text
src\content\clinicalSources.ts
src\content\clinicalSourceAssignments.generated.ts
scripts\generate-clinical-provenance.ts
scripts\audit-clinical-provenance.ts
scripts\check-clinical-source-urls.ts
docs\CLINICAL_PROVENANCE_MATRIX.md
```

Perubahan label, URL, tahun, jenis, cakupan, atau catatan sumber poli kini
masuk `sidikJariPack`; itulah alasan `REVISI_ENGINE` naik ke `61`.

Jangan mengklaim:

- provenance lengkap berarti `210/210` sudah physician-approved;
- sumber `terkait` atau `floor_umum` adalah rekomendasi diagnosis-spesifik;
- `137/137 cocok` berarti physician-approved;
- semua URL yang memberi 403 tidak valid;
- seluruh konten selamanya current hanya karena compiler hijau hari ini.

---

## 6. Game Loop dan Sistem Utama

### 6.1 Loop harian

- Pagi: klinik/UKP
- Siang: lapangan/UKM
- Sore: meja kerja/manajemen
- Stamina enam pip

Mode:

- Karier 90 hari
- Ujian 30 hari

Ujian memakai blueprint terkontrol, dual-seed, dan delapan paket untuk
fairness. Kasus pilot/prototipe Karier-only tidak boleh bocor ke Ujian.

### 6.2 Skor formal

Empat dimensi:

- UKP 0-35
- UKM 0-35
- Manajemen 0-15
- Resiliensi 0-15

Grade:

- A >=85
- B >=70
- C >=55
- D <55

### 6.3 Klinik

Alur:

```text
Anamnesis -> Pemeriksaan -> Diagnosis -> Terapi/Edukasi -> Disposisi
```

Kontrak penting:

- Anamnesis memakai progressive disclosure.
- Diagnosis bisa `TEGAK` atau `SUSPEK`.
- Proses klinis ikut dinilai, bukan hanya outcome.
- Stabilization-required dan tindakan berbahaya memiliki cap.
- Kasus tanpa obat/tindakan wajib memakai N/A/reweight, bukan terapi nol.
- Dosis resep tidak menjadi mekanik input pada fase ini.

### 6.4 UKM

UKM aktif mencakup:

- 16 keluarga binaan;
- 27 skenario kunjungan;
- observasi hotspot;
- wawancara MI;
- COM-B;
- resep sosial;
- SAJI fase Ingatkan;
- PIS-PK/IKS;
- Posyandu ILP;
- Prolanis multimorbid;
- KLB dengan pola pengendalian sesuai transmisi;
- karma, drift, janji, revisit, dan callback klinik;
- sitasi UKM dan landasan program.

### 6.5 Storylette

Storylette digunakan sebagai penguat suasana/closure, bukan panel wajib yang
menumpuk:

- debrief malam sudah ada;
- variasi kunjungan dan presentasi kasus sudah ada;
- episode UKM-UKP memberi causal receipt;
- M15 Arsip Jaga Malam dirancang untuk kisah nyata/historis, tetapi belum
  diaktifkan.

---

## 7. Perjalanan Milestone

### 7.1 M0-M9

Membangun vertical slice hingga sistem inti:

- klinik;
- keluarga binaan;
- Peta Desa;
- UKM terjadwal;
- IGD;
- ekonomi dan burnout;
- mode Ujian;
- endgame;
- save slot;
- Dossier Mahasiswa ber-HMAC;
- UI/pedagogi;
- coverage SKDI/FKTP;
- hardening pola bug berulang.

### 7.2 M10 dan M10.5

Audit multidimensi:

- pipeline kasus;
- UKM-UKP;
- NPC/persona;
- UI layering/focus;
- medical/engine fidelity;
- scoring and referral safety;
- Golden Master freeze.

M10.5 tertutup. Jangan membuka ulang hanya karena dokumen lama mengulang
temuan yang sudah selesai.

### 7.3 M11

M11 menambah:

- process scoring;
- stabilisasi pra-rujuk;
- gating anamnesis;
- EBM pearl, realita FKTP, panduan resmi;
- variasi presentasi Tingkat A;
- variasi kunjungan;
- sitasi UKM;
- SAJI fase 2;
- KLB grounded;
- Duel Diagnosis;
- Teach-back;
- debrief malam/storylette;
- audit bahasa dan editorial.

Tag historis:

- `golden-master-m11`
- `golden-master-m11-e2`

Tag tersebut bukan sumber kebenaran snapshot terbaru; cek engine dan hash saat
ini.

### 7.4 M12

M12 visual pass sudah berjalan, bukan lagi "belum mulai":

- title screen premiere-grade;
- identitas visual;
- contextual UKM scenes;
- observation artwork;
- hotspot alignment;
- continuity visual lintas gameplay.

Residual:

- inventaris semantik semua hotspot terhadap gambar;
- konsistensi NPC/rumah yang belum merata;
- keputusan asset licensing untuk perluasan;
- avatar dokter bersifat opsional, bukan kebutuhan inti karena PRIMERA bukan
  game avatar berjalan.

### 7.5 M13-0A sampai 0D

Selesai:

- 0A: blueprint kurikulum enam entitas;
- 0B: source registry/delta audit 2026;
- 0C: content release, mode isolation, migration, dossier integrity;
- 0D: constrained exam blueprint.

Commit penting:

- `e91c323` - M13-0A
- `428fba9` - M13-0B
- `4207ff8` - M13-0C
- `30419e3` - M13-0D

### 7.6 M13-1a

Selesai dan aktif Career-only:

- Nayla, diare bayi;
- Dimas, asma anak;
- hipoglikemia;
- benda asing hidung;
- otitis eksterna;
- fraktur terbuka;
- IGD STEMI;
- UKM relapse prevention.

Physician review N1-U1 diberikan 15 Juli 2026. Kontradiksi karena fatigue
kemudian direkonsiliasi secara eksplisit. M13-1a bukan lagi gerbang terbuka.

### 7.7 M13-1b

**Belum lulus.** Membutuhkan playtest manusia:

- minimal tiga mahasiswa/proxy;
- dangerous-path test;
- catatan usability;
- keputusan zero-material-defect.

Bot dan audit AI tidak dapat menggantikan gerbang ini.

### 7.8 M13 skala penuh

Commit `b91cd52` membuat 144 katalog FKTP playable. Batch berikutnya
memperluas runtime menjadi 210 kasus poli.

Pemisahan status saat ini:

- 73 baseline formal;
- 16 prototipe physician-approved;
- 121 prototipe formatif.

### 7.9 M14

M14 menutup banyak masalah:

- save/autosave;
- verifier;
- crash recovery;
- accessibility;
- fairness;
- referral closure;
- release integrity.

Jangan menganggap angka milestone lama sebagai baseline kini; engine sudah
bergerak jauh melewati titik M14 awal.

### 7.10 M15

`M15 - Arsip Jaga Malam` sudah diputuskan sebagai konsep, belum aktif.

Tujuan:

- snapshot kisah nyata, sejarah, tragedi, ironi, atau keunikan sistem;
- menggantikan storylette malam sesekali, bukan menambah panel wajib;
- foto/gambar harus legal dan etis;
- link sumber asli harus dapat dibuka;
- seed pertama adalah realita tata laksana gigitan ular dan kisah dr. Icha.

Jangan mengimplementasikan sebelum kurasi sumber, etika, lisensi gambar, dan
pilot display-only siap.

---

## 8. Status Adjudikasi Medis

### 8.1 M13-0B

Sign-off 4/4 delta oleh dr. Wirayuda, 14 Juli 2026:

- hipertensi;
- DM2;
- stroke;
- epilepsi dewasa;
- termasuk waiver yang tercatat.

### 8.2 M13-1a

Sign-off 8/8 N1-U1 oleh dr. Wirayuda, 15 Juli 2026. Keputusan operatif final
ada di `M13_DECISION_LOG.md`; jangan kembali ke rumusan draf sebelum
rekonsiliasi.

### 8.3 IGD ekspansi

Empat belas kasus IGD ekspansi sudah diadjudikasi dan diaktifkan. Provenance
ringkas dan link sumber ditampilkan pada debrief. Jangan menyamakan source
binding lama dengan current-source check permanen; currency tetap perlu
dipantau.

### 8.4 M13-137 poli

Compiler terbaru:

- `137/137 cocok`;
- PPK `93 direct / 15 related / 29 absent`;
- PNPK direct `27`;
- EBM direct `71`;
- resource Tier C/D `45/45` grounded;
- KFA unresolved `0`.

Ini adalah konsistensi evidence compiler, bukan persetujuan dokter.

Physician adjudication terminal saat ini:

- `16/137` approved-with-edits;
- `121/137` belum diputuskan dan tetap formatif.

Kasus 01-16:

1. gizi buruk dengan komplikasi;
2. mastoiditis akut;
3. bronkiolitis berat;
4. suspek meningitis bakterial;
5. benda asing esofagus;
6. suspek TIA;
7. anafilaksis makanan;
8. perdarahan saluran cerna atas;
9. pneumotoraks spontan;
10. tetanus generalisata;
11. HIV asimtomatik/inisiasi ART;
12. keluhan fisik persisten/somatoform;
13. benda asing konjungtiva;
14. trauma abdomen tumpul;
15. cedera superfisial kulit kepala risiko rendah;
16. luka bakar superficial partial-thickness 2% TBSA.

Source of truth keputusan literal:

```text
docs\M13_137_DECISION_LOG.md
```

### 8.5 Aturan adjudikasi berikutnya

- Lanjut dari item 17, bukan mengulang 01-16.
- Sajikan satu kasus secara ringkas:
  - vignette dan target;
  - temuan kritis;
  - rekomendasi edit;
  - floor Indonesia;
  - EBM mutakhir;
  - graceful degradation;
  - satu keputusan yang diminta.
- Gabungkan pertanyaan yang saling tergantung agar dokter tidak dipaksa
  melakukan micro-signoff.
- Setelah keputusan eksplisit: implementasi, test, decision log, lalu commit
  terpisah per checkpoint yang masuk akal.

---

## 9. Bridge UKM-UKP: Perjalanan dan Status

### 9.1 Awal

Audit awal memberi skor sekitar `5,7/10`. Kelemahan:

- relasi keluarga palsu;
- janji ingkar tanpa jalur revisit;
- callback klinik tidak memulihkan arc keluarga;
- Prolanis HT+DM satu arah;
- KLB bisa ditutup dengan aksi pengendalian salah;
- pola transmisi fallback droplet;
- rujukan tidak punya closure operasional.

### 9.2 Wave B1

Selesai:

- hanya anggota keluarga nyata mendapat `keluargaId`;
- revisit setelah janji ingkar;
- callback klinik memulihkan keluarga;
- Prolanis multimorbid;
- perbaikan identity/actionability.

### 9.3 Wave B2 dan sesudahnya

Selesai:

- `CareEpisodeLite`;
- causal receipt;
- referral letter closure;
- tindakan follow-up eksplisit;
- episode dan callback lintas domain;
- penanganan benturan jadwal karma;
- bridge hero-loop pilot;
- write-back program.

### 9.4 Fondasi batch beta.2

Perbaikan terbaru:

- cap episode mempertahankan 120 episode aktif menurut due date/update/id;
- closed episode hanya mengisi sisa kapasitas;
- callback keluarga tidak lagi cukup cocok umur/gender;
- condition mapping harus semantik:
  - asma ringan <-> asma anak;
  - anemia bumil <-> anemia ringan;
  - skizofrenia <-> putus obat;
  - selain itu exact case id.

### 9.5 Skor jujur

Secara rekayasa, bridge sudah sekitar `8,9/10` pada audit sebelum beta.2 dan
lebih kuat setelah semantic matching/cap fix. Batch beta.3 tidak mengubah
kausalitas bridge; ia membuat landasan evidence UKM dan UKP dapat ditelusuri
dari debrief. Namun klaim "wow dan satisfying" belum final karena belum ada
playtest tiga mahasiswa/proxy. Jangan menurunkan statusnya kembali ke 5,7
karena itu baseline historis, tetapi jangan pula self-certify pengalaman
emosional dari unit test.

---

## 10. Batch P0-P3 dan Provenance Beta.3: Sudah Disegel

Subbagian 10.1-10.4 berasal dari batch P0-P3 yang semula berada di working
tree. Seluruhnya kini sudah masuk sejarah remote. Lapisan provenance pada
10.5-10.8 disegel melalui:

```text
3209795 feat(beta): complete clickable clinical provenance
tag: test-beta-3209795
release: PRIMERA test-beta 1.1.0-beta.3
```

Jangan lagi memperlakukan bagian ini sebagai diff lokal yang belum aman.

### 10.1 Governance formatif

Root problem: seluruh prototipe unadjudicated sebelumnya playable dengan
konsekuensi formal, sehingga readiness compiler berisiko disalahbaca sebagai
validasi medis.

Perbaikan:

- helper `kasusFormatif()`;
- hari 1-2 tidak memunculkan prototipe formatif;
- mulai hari 3 maksimal satu slot per hari;
- formatif mendapat feedback tetapi tidak mengubah:
  - tally;
  - Dex;
  - ekonomi;
  - jadwal;
  - consequence;
  - formal progress.
- UI Ruang Tunggu dan debrief memberi label formatif.
- pre-answer referral-network leak dihilangkan.

### 10.2 Kepastian diagnosis

Perbaikan:

- `kepastianDiagnosis: 'tegak' | 'suspek'`;
- 14 encounter "Suspek" ditargetkan ke `SUSPEK`;
- diagnosis benar tetapi terlalu pasti mendapat cap B/84 dan skor diagnosis
  75;
- underconfidence diberi 90;
- certainty mismatch masuk tally calibration error;
- fingerprint memasukkan certainty.

Guard penting: pemain tidak boleh memilih `SUSPEK` untuk semua kasus dan
mendapat hasil seolah selalu jujur.

### 10.3 Observasi klinis dua tahap

Sebelumnya observasi dapat memberi hasil terlalu cepat atau hanya menjadi
label.

Sekarang:

- `MULAI_OBSERVASI` benar-benar memulai;
- `NILAI_ULANG_OBSERVASI` baru membuka hasil;
- engine dan UI menolak skip.

Empat kasus:

- diare anak: 240 menit;
- trauma kepala risiko rendah: 120 menit;
- hipoglikemia dewasa ringan: 15 menit lalu rujuk;
- epistaksis anterior: 15 menit lalu pulang bila stabil.

M13-1a H1 ikut direkonsiliasi dengan observasi 15 menit dan rujukan karena
risiko sulfonilurea kerja panjang serta ketiadaan observasi 24 jam.

### 10.4 ICD dan konten klinis

- Kandidiasis vagina:
  - nama dipresisikan;
  - ICD `N76.0` dikoreksi menjadi `B37.3`;
  - katalog vaginitis generik tetap terhubung dengan rationale/allowlist.
- GERD:
  - klaim palsu "respons PPI mengonfirmasi diagnosis" dihapus;
  - fallback ranitidine basi dihapus;
  - empirical PPI framing diperbarui dengan ACG/meta-analysis.

### 10.5 Provenance clickable

Arsitektur poli:

```text
src\content\clinicalSources.ts
src\content\clinicalSourceAssignments.generated.ts
scripts\generate-clinical-provenance.ts
```

Generator menggabungkan registry M13, adjudication data, dan crosswalk
eksplisit untuk tepat `210` id kasus. `assertExactKeys` dan invariant test
mencegah kasus baru diam-diam tidak mendapat sumber.

Arsitektur audit:

```text
scripts\audit-clinical-provenance.ts
scripts\check-clinical-source-urls.ts
docs\CLINICAL_PROVENANCE_MATRIX.md
```

Arsitektur renderer:

```text
src\renderer\src\components\BuktiKlinis.tsx
src\renderer\src\components\TautanSumber.tsx
```

`BuktiKlinis` menangani debrief UKP/IGD. `TautanSumber` menangani link ringkas
UKM. Keduanya:

- hanya membuka URL HTTPS tanpa credentials;
- memakai browser bawaan;
- mempunyai accessible name;
- ringkas/default-collapsed agar tidak menambah cognitive overload.

Coverage:

- poli `210/210`;
- IGD `20/20`;
- kunjungan keluarga `27/27`;
- kegiatan Posyandu/Prolanis/KLB;
- Duel Diagnosis `8/8`;
- Teach-back `8/8`.

Sumber prioritas tetap mencakup:

- GINA 2026;
- WHO TB 2025;
- ADA 2026;
- ESC 2024;
- AHA/ASA 2026;
- WHO pneumonia/diare anak 2024;
- WHO arboviral 2025;
- PNPK/Kemenkes terkait.

Jangan menambah link generik hanya demi angka. Pilih `langsung`, `terkait`,
atau `floor_umum`, dan beri batas interpretasi untuk floor umum.

### 10.6 UI dan E2E

E2E produksi sekarang menguji:

1. boot, dark mode, text scale 200%, Axe, overflow, HUD overlap;
2. IGD debrief source link dan layout 200%;
3. UKM provenance pada dark mode dan text scale 200%, termasuk pembukaan link
   tanpa menciptakan jendela app kedua;
4. save-injected unadjudicated prototype:
   - label formatif terlihat;
   - referral network tidak bocor sebelum jawaban.

### 10.7 Dependency hardening

- package version menjadi `1.1.0-beta.3`;
- override:
  - `postcss 8.5.23`;
  - `tar 7.5.22`;
- production audit: `0` vulnerability;
- full dev audit: `16 high`, semuanya pada toolchain packaging
  electron-builder (`glob/minimatch/brace-expansion/ejs` dan turunannya).

Jangan menjalankan `npm audit fix --force`; saran audit mengarah ke perubahan
mayor/downgrade yang berisiko. Runtime dependency surface bersih.

### 10.8 Review artifact M13

Artefak adjudikasi diregenerasi terhadap commit gameplay yang sudah disegel:

- `generated sourceCommit = 320979516a55e94916a25d0157c2c1058180a688`;
- `engineRevision = 61`;
- `contentRelease = clinical-provenance-2026-07-28`;
- 137 cocok;
- pack fingerprint `541d47bf`;
- artifact fingerprint
  `aeef67707e680414e1dbf3020f95ba5078ee09486c762b4320ecbc29647b6f2c`;
- review hash M13-1a diperbarui secara eksplisit untuk rekonsiliasi H1.

Ini bukan self-signing; keputusan H1 sudah ada dan perubahan menyelaraskan
runtime dengan keputusan tersebut.

---

## 11. Verifikasi Snapshot Beta.3

### 11.1 Test dan build

- Full Vitest: `150` file, `1377/1377` lulus.
- TypeScript: bersih.
- Freeze: `18/18`.
- Playwright Electron: `4/4`.
- Matriks provenance:
  - `210/210` kasus poli lengkap;
  - `490` pemakaian sumber poli;
  - `0` masalah struktur.
- URL audit:
  - `263` URL unik;
  - `0` dipastikan mati;
  - `52` dibatasi anti-bot;
  - `1` endpoint Kemenkes intermiten saat fetch otomatis dan telah
    diverifikasi manual di browser.
- Production dependency audit: `0` vulnerability.
- Soak 90 hari Karier: lulus.
- Soak 30 hari Ujian: lulus.
- Ideal integrated player:
  - Karier `90,2`;
  - Ujian `89,8`.
- Selfplay: 27 pasien, A18/B9.
- Adversarial ordering tetap:
  `teliti >= speedrunner >= ceroboh`.

### 11.2 Audit konten

- 9.175 fragmen editorial;
- 0 temuan tinggi;
- 75 temuan sedang `kapital_berlebihan`, mayoritas akronim/penekanan;
- 210 kasus klinik;
- 20 IGD;
- 16 keluarga;
- 27 kunjungan.

Audit dialog:

- 255 pilihan;
- 91 benar, 164 salah;
- style benar:
  - 45 reflektif;
  - 37 empati;
  - 9 edukasi.
- style salah:
  - 11 menggurui/lecturing;
  - 82 edukasi yang tidak tepat konteks;
  - 48 menghakimi;
  - 14 menakut-nakuti;
  - 9 memaksa.
- 0 anak berbicara tanpa pendamping pada konteks yang memerlukannya;
- 0 jawaban bergaya rekam medis dari mulut pasien.

### 11.3 Visual

Screenshot E2E dark mode + 200% sudah diperiksa:

- tidak ada overlap incoherent;
- kontras terbaca;
- layout responsif;
- source panel IGD scrollable.

Ini bukan audit seluruh state layar pada seluruh resolusi. Playtest manusia
tetap diperlukan.

### 11.4 Bundle

- Renderer JS: `3,62 MiB`.
- CSS: `178,0 KiB`.

### 11.5 Installer

```text
D:\Dev\PRIMER-CODEX-lab\primera-desktop\dist\
PRIMERA test-beta Setup 1.1.0-beta.3.exe
```

Ukuran:

```text
107,972,356 byte
```

SHA-256:

```text
75498F3BDC1D6EA022AC0D189AAE2B02FD30C6A23FB3DC86CD457059779CE6CA
```

GitHub:

```text
tag: test-beta-3209795
release: https://github.com/anakwirayuda-eng/PRIMER/releases/tag/test-beta-3209795
asset digest: sha256:75498f3bdc1d6ea022ac0d189aae2b02fd30c6a23fb3dc86cd457059779ce6ca
```

Instalasi aktif:

```text
C:\Users\HP\AppData\Local\Programs\primera-desktop\
```

Tiga pemeriksaan independen cocok:

- `FileVersion = 1.1.0-beta.3`;
- `app.asar/package.json = 1.1.0-beta.3`;
- registry uninstall `DisplayVersion = 1.1.0-beta.3`.

Bundle gameplay juga cocok byte-for-byte:

```text
installed app.asar SHA-256:
1F6C61B1875DAEEBEBF9989259C9EB72BE85923B02EE79F9F00BCEFF48A74A66

dist/win-unpacked app.asar SHA-256:
1F6C61B1875DAEEBEBF9989259C9EB72BE85923B02EE79F9F00BCEFF48A74A66
```

**Batas distribusi yang tersisa:**

- installer unsigned;
- SmartScreen/reputasi publisher belum ditangani;
- belum ada clean-install matrix pada beberapa laptop mahasiswa;
- GitHub asset + hash menjamin integritas file, tetapi tidak menggantikan
  identitas publisher dari Authenticode.

---

## 12. Penilaian Mutu yang Jujur

Angka di bawah adalah audit rekayasa terstruktur, bukan validasi psikometrik.

| Dimensi | Status saat ini | Skor estimasi |
|---|---|---:|
| Integritas engine/replay | Sangat kuat; freeze, migration, fingerprint, soak | 9,3 |
| Stabilitas gameplay E2E | Karier/Ujian/UKP/UKM lulus simulasi | 9,0 |
| Bridge UKM-UKP mekanis | B1+B2+episode+semantic callback | 9,0 |
| UI/a11y desktop | Dark/light, 200%, Axe, E2E | 8,8 |
| Bahasa/dialog | Audit luas, progressive disclosure, persona | 8,7 |
| Struktur konten | 144 playable, 210 poli, orphan guards | 9,0 |
| Tooling evidence | Compiler, registry, review artifact | 8,8 |
| Kesiapan review klinis | Artifact kuat, tetapi baru 16/137 poli disetujui | 6,5 |
| Evidence runtime clickable | 210/210 poli + IGD/UKM/pilot, typed coverage | 9,2 |
| Bukti fun/cognitive load manusia | Belum ada pilot 3 mahasiswa/proxy | 4,5 |
| Kepercayaan distribusi | Source/tag/release/hash cocok; masih unsigned | 7,8 |

Kesimpulan:

- seluruh area **code-addressable** pada batch provenance sudah di atas 8;
- area yang masih di bawah 8 bukan boleh "diperbaiki" dengan mengubah angka:
  ia membutuhkan dokter, mahasiswa, atau sertifikat signing.

---

## 13. Antrean Kerja Aktif

### Prioritas 0 - M13-1b human pilot

- Tiga mahasiswa/proxy.
- Skenario normal dan dangerous path.
- Catat:
  - waktu baca;
  - salah paham;
  - search/focus;
  - apakah sebab-akibat bridge dipahami;
  - apakah UKM terasa substantif;
  - fatigue/cognitive load;
  - kesenangan dan keinginan lanjut.
- Dr. Wirayuda memberi zero-material-defect decision setelah data.
- Gunakan build `1.1.0-beta.3` sebagai kandidat awal. Jangan mengubah engine
  di tengah sesi pilot tanpa mencatat build peserta.

### Prioritas 1 - adjudikasi M13-137

- Lanjut kasus 17-137.
- Batch kecil.
- Jangan mengaktifkan en masse.
- Setelah sign-off, kasus dapat pindah dari formatif ke formal secara
  release-controlled.

### Prioritas 2 - distribusi kelas

- Dapatkan code-signing certificate/Authenticode.
- Uji clean install pada beberapa laptop mahasiswa.
- Uji update dan save migration.
- Arsipkan build cohort + manifest + hash.
- Siapkan petunjuk SmartScreen hanya sebagai fallback, bukan pengganti signing.
- Jangan commit file `dist`; unggah installer sebagai Release asset.

### Prioritas 3 - pemeliharaan provenance

- Jalankan `npm run audit:provenance` setiap menambah kasus.
- Jalankan `npm run audit:provenance:urls` sebelum release.
- Triage source `terkait` dan `floor_umum` bertahap ke sumber langsung bila
  dokumen diagnosis-spesifik tersedia.
- Jangan mengganti URL hanya karena situs memberi 403 kepada bot.
- Catat tanggal akses dan lakukan current-source review periodik; coverage
  lengkap bukan jaminan currency permanen.

### Prioritas 4 - UKM dan M12

- Human evaluation hero loops.
- Inventaris semua art observation vs hotspot/teks.
- Tambah variasi aset rumah/NPC secara terukur.
- Pertahankan keterbacaan dark mode dan 200%.
- Jangan memulai avatar kompleks jika tidak menambah keputusan/emosi.

### Prioritas 5 - M15

- Kurasi registry 3-5 snapshot awal.
- Legal/ethical image review.
- Display-only pilot.
- Cadence rendah; snapshot menggantikan storylette malam.

---

## 14. Pekerjaan yang Ditunda atau Dilarang Diam-diam

Jangan kerjakan tanpa keputusan baru:

- mekanik input dosis/frekuensi/durasi resep;
- `FacilityResourceProfile` runtime;
- historical multi-pack runtime;
- cross-platform/mobile;
- fullscreen/window persistence sebelum data playtest;
- paket audio baru tanpa lisensi jelas;
- Mpox;
- Endurance/regional mode yang belum mendapat scope final;
- perluasan E-2 ke semua keluarga tanpa hasil pilot;
- M15 full rollout sebelum pilot;
- `npm audit fix --force`.

Jangan:

- self-sign physician review;
- mengubah 121 prototipe menjadi formal hanya karena compiler "cocok";
- memaksa family bridge hanya dari umur/gender;
- menghidupkan resource hidden penalty;
- mengubah engine di tengah cohort;
- menyebut installer signed;
- menyebut working tree clean tanpa menjalankan `git status`;
- menganggap `225 kasus` adalah angka runtime saat ini.

---

## 15. Jebakan Historis yang Harus Diingat

1. Dokumen lama sering benar tentang akar masalah tetapi basi pada status.
2. `144` berarti baris katalog FKTP, bukan seluruh diagnosis atau encounter.
3. `210` adalah kasus poli runtime, bukan 210 diagnosis unik tervalidasi.
4. "Cocok" pada compiler adalah evidence completeness, bukan physician review.
5. Sumber Fornas/KFA/ASPAK tidak membuktikan stok siap-pakai.
6. PPK/PNPK adalah floor; sumber lebih baru boleh supersede dengan alasan.
7. SKDI bukan otomatis keputusan rujuk.
8. IGD dan poli memiliki kontrak scoring berbeda.
9. Search box pernah terasa frozen karena focus race setelah tombol disabled.
10. UI test jsdom tidak membuktikan layout; gunakan Electron/Playwright.
11. CRLF/LF dapat membuat diff seluruh file terlihat berubah.
12. Save validation harus memeriksa isi entry, bukan hanya container.
13. Referral closure harus memerlukan aksi follow-up, bukan sekadar membuka
    surat.
14. Storylette harus memberi rasa, bukan cognitive overload.
15. Label "formatif" harus jelas supaya mahasiswa tidak mengira ia formal.

---

## 16. Dokumen Rujukan Utama

Urutan baca Claude:

1. **Dokumen ini**
   - `docs\CLAUDE_RECOVERY_DOSSIER_2026-07-28.md`
2. Keputusan M13 aktif
   - `docs\M13_KICKOFF_PROMPT.md`
3. Jejak keputusan M13
   - `docs\M13_DECISION_LOG.md`
4. Keputusan kasus M13-137
   - `docs\M13_137_DECISION_LOG.md`
5. Baseline resource
   - `docs\M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md`
6. Bridge
   - `docs\UKM_UKP_BRIDGE_CLOSED_LOOP_PROPOSAL.md`
7. Kesiapan kelas beta.1 sebagai baseline historis
   - `docs\CLASS_READINESS_AUDIT_2026-07-22.md`
8. Audit dialog
   - `docs\DIALOGUE_COHERENCE_AUDIT_2026-07-20.md`
9. M15
   - `docs\M15_ARSIP_JAGA_MALAM_BRIEF.md`
10. Matriks provenance runtime
   - `docs\CLINICAL_PROVENANCE_MATRIX.md`
11. Arsip lama
   - `docs\CODEX_HANDOFF_DOSSIER.md`
   - `docs\CODEX_BRIEFING_LANJUTAN.md`

Dokumen nomor 11 adalah sejarah. Jangan memakai daftar tugasnya sebagai
antrean aktif tanpa cross-check terhadap dossier ini dan Git.

---

## 17. Checklist Start untuk Claude yang Pulih

Jalankan dari:

```powershell
Set-Location D:\Dev\PRIMER-CODEX-lab\primera-desktop
```

Orientasi:

```powershell
git status --short --branch
git log --oneline --decorate -n 30
git diff --stat
git diff --check
```

Verifikasi:

```powershell
npx vitest run
npm run typecheck
npx vitest run src/engine/freeze.test.ts
npm run test:e2e
npm run audit:provenance -- --markdown
npm run audit:provenance:urls
npm audit --omit=dev
```

Jangan langsung mengedit. Pertama cocokkan:

- HEAD Git;
- `REVISI_ENGINE`;
- `CONTENT_RELEASE`;
- package version;
- test count;
- installer hash;
- GitHub Release asset digest;
- versi internal instalasi aktif dari `app.asar`;
- physician-approved set;
- current dirty diff.

---

## 18. Format Laporan Balik yang Diinginkan

Laporan ke dr. Wirayuda sebaiknya ringkas:

1. apa yang benar-benar berubah di gameplay;
2. bukti test/build;
3. apa yang belum;
4. keputusan manusia tunggal berikutnya, jika memang diperlukan;
5. commit, push, installer, dan hash bila sudah dilakukan.

Hindari:

- mengulang sejarah panjang di chat;
- meminta delapan keputusan sekaligus tanpa sintesis;
- menyebut "selesai" sebelum build nyata;
- memberi skor tanpa menjelaskan apakah itu rekayasa, medis, atau playtest.

---

## 19. Keputusan Operasional Berikutnya yang Disarankan

**Penyegelan beta.3 sudah selesai. Jangan mengulang pekerjaan itu.**

Urutan paling bernilai berikutnya:

1. lakukan playtest singkat internal pada instalasi aktif `1.1.0-beta.3`;
2. pertahankan build tersebut untuk M13-1b pada tiga mahasiswa/proxy;
3. catat usability, cognitive load, dangerous-path, dan pemahaman bridge;
4. secara paralel, lanjutkan physician adjudication dari M13-137-17 dalam
   batch kecil;
5. sebelum cohort kelas, selesaikan clean-install matrix dan keputusan
   code-signing.

Alasannya: kode, tag, GitHub Release, hash, dan instalasi lokal kini sudah
sinkron. Risiko terbesar berpindah dari kehilangan perubahan lokal ke
kurangnya bukti manusia dan identitas publisher.

---

## 20. Pernyataan Akhir untuk Claude

PRIMERA sudah jauh melewati tahap brainstorm. Ia sekarang memiliki:

- seluruh 144 katalog FKTP playable;
- 210 kasus poli;
- 20 IGD;
- UKM longitudinal yang nyata;
- bridge timbal balik;
- visual pass;
- storylette;
- evidence tooling;
- provenance clickable lintas UKP, IGD, UKM, dan pilot pedagogik;
- release integrity;
- installer beta.3 yang committed, pushed, dirilis, dan terpasang.

Masalah berikutnya bukan "apakah ada game". Masalah berikutnya adalah
**membuktikan bahwa build ini aman, menyenangkan, mudah dipahami, dan layak
kelas bagi manusia nyata**, sambil menyelesaikan physician review secara
terukur.

Pertahankan momentum, tetapi jangan mengganti bukti manusia dengan keyakinan
agen. Bangun yang bisa dibangun, ukur yang bisa diukur, dan kumpulkan keputusan
dokter hanya pada titik yang benar-benar memerlukannya.
