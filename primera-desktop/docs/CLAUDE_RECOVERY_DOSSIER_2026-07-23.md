# CLAUDE RECOVERY DOSSIER - PRIMERA LAB

**Snapshot:** 2026-07-23, Asia/Jakarta
**Tujuan:** memulihkan seluruh konteks kerja Claude setelah crash tanpa meminta dr. Wirayuda mengulang sejarah proyek.
**Workspace aktif:** `D:\Dev\PRIMER-CODEX-lab\primera-desktop`
**Branch aktif:** `codex-gpt56-experiment`
**Remote:** `https://github.com/anakwirayuda-eng/PRIMER.git`
**Baseline remote sebelum checkpoint dossier/adjudikasi:** `511373b`
**Status penting:** enam commit UI/UX Claude sampai `511373b` sudah ter-push. Adjudikasi M13-137-07 sampai M13-137-09 dan dossier ini disegel bersama pada checkpoint berikutnya; gunakan `git log -1` untuk hash checkpoint aktual.

---

## 0. Baca Ini Dulu

PRIMERA adalah simulator dokter Puskesmas Indonesia untuk pendidikan mahasiswa kedokteran. Produk ini bukan simulator UKP dengan UKM sebagai hiasan. Keputusan pemilik produk yang harus dianggap sebagai DNA tetap adalah:

> **UKP dan UKM merupakan dua pilar ko-primer. Keduanya harus substantif, saling memengaruhi, longitudinal, ilmiah, dan menyenangkan dimainkan.**

Target penggunaan nyata adalah blok IKM/KP sekitar September 2026 untuk sekitar 50 mahasiswa. Repo ini tetap laboratorium pengembangan, tetapi arah akhirnya adalah build yang layak kelas. Karena itu:

1. Jangan menukar kecepatan dengan klaim klinis yang tidak terverifikasi.
2. Jangan membangun birokrasi review yang membuat kemajuan berhenti. Bila ada kontradiksi, bantu dr. Wirayuda menemukan opsi final yang paling masuk akal dan ringkas.
3. Jangan menganggap test hijau sebagai validasi pedagogis manusia.
4. Jangan menganggap dokumen roadmap lama lebih mutakhir daripada kode, test, dan decision log terbaru.
5. Jangan mengubah atau menghapus perubahan working tree yang dibuat CODEX. Claude sementara berfokus pada UI/UX; CODEX memegang adjudikasi M13 dan sisa pekerjaan konten/engine yang terkait langsung.

### Urutan sumber kebenaran saat ada konflik

1. Kode runtime + test pada branch aktif.
2. Decision log bertanggal terbaru.
3. Dossier pemulihan ini.
4. `M13_KICKOFF_PROMPT.md` dan `M13_DECISION_LOG.md` untuk governance.
5. `CODEX_BRIEFING_LANJUTAN.md`, `CODEX_HANDOFF_DOSSIER.md`, dan `ROADMAP.md` sebagai sejarah. Beberapa label status di sana sudah stale.

---

## 1. Pemilik, Tujuan, dan Cara Bekerja

**Product owner dan physician reviewer:** dr. Anak Agung Bagus Wirayuda, MD, PhD.
**Hak cipta resmi:** EC002026019623; metadata HAKI jangan diubah.
**Bahasa kerja:** Indonesia dengan istilah teknis Inggris bila lebih presisi.
**Gaya produk:** simulator longitudinal yang menggabungkan ketelitian Football Manager dengan kehangatan story-driven game; bukan avatar berjalan bebas dan bukan kumpulan soal pilihan ganda.

Preferensi kerja pemilik yang sudah berulang kali ditegaskan:

- proaktif dan bergerak sampai hasil nyata masuk gameplay;
- audit harus jujur dan memeriksa kode, bukan mempercayai laporan agen lain;
- hindari tiki-taka keputusan mikro yang melelahkan;
- keputusan dokter tetap dicatat eksplisit untuk perubahan klinis material;
- bila pemilik kelelahan dan jawabannya kontradiktif, agen harus menunjukkan konflik serta menyodorkan resolusi final yang dapat dipilih;
- setiap klaim “selesai” harus membedakan: ditulis, terhubung ke runtime, teruji, dibangun, dipasang, di-commit, dan di-push.

---

## 2. Workspace, Git, Build, dan Instalasi

### Repo yang benar

Kerja aktif hanya di:

```text
D:\Dev\PRIMER-CODEX-lab\primera-desktop
```

Jangan salah masuk ke repo web PRIMER lama di `D:\Dev\PRIMER\src`; repo lama hanya boleh menjadi bahan draf bahasa dan pernah mengalami insiden ICD-10 translation poisoning. Jangan blind-port data klinis darinya.

Branch aktif dan satu-satunya target push saat ini:

```text
codex-gpt56-experiment
```

Jangan push ke `master` atau branch produksi Claude lama. Jangan force-push.

### Snapshot teknis saat dossier ditulis

| Item | Nilai |
|---|---|
| Paket | `primera-desktop@1.1.0-beta.1` |
| Nama produk | `PRIMERA test-beta` |
| Electron | 43.1.0 |
| React | 19 |
| TypeScript | strict, 5.8 |
| Engine | `REVISI_ENGINE=58` |
| Content release aktif | `igd-adjudication-2026-07-22` |
| Frozen files | 18 file, dikunci `freeze.test.ts` |
| Baseline remote sebelum checkpoint ini | `511373b` |

### Instalasi aktif yang ada di laptop

```text
C:\Users\HP\AppData\Local\Programs\primera-desktop\PRIMERA test-beta.exe
```

Installer yang terakhir terpasang dibangun 2026-07-23 04:29:

```text
dist\PRIMERA test-beta Setup 1.1.0-beta.1.exe
SHA-256 C439EE26B9E3BB974E817B8FEB304246796FA23469A3F0388DCAA23354A75AC0
```

Saat snapshot dossier ditulis, build terpasang masih mencakup commit UI/UX sampai `e18eaf9`. Build gabungan Q10/Q11 harus dibuat setelah checkpoint ini agar memuat enam commit UI/UX terbaru sampai `511373b` sekaligus adjudikasi 07-09.

### Perubahan yang disegel bersama dossier

Checkpoint dossier/adjudikasi mencakup:

```text
docs/M13_137_ADJUDICATION.html
docs/M13_137_ADJUDICATION_DATA.json
docs/M13_137_ADJUDICATION_REPORT.md
docs/M13_137_DECISION_LOG.md
scripts/m13-adjudication/config.ts
src/content/lab/adjudicationWave6.test.ts
src/content/lab/batch1.ts
src/content/lab/batch2.ts
src/content/lab/catalog.ts
```

Ditambah dossier ini. Perubahan tersebut adalah adjudikasi kasus 07, 08, dan 09. Artefak JSON/HTML/Markdown sudah diregenerasi menjadi 137/137 kasus tanpa gap provenance.

---

## 3. Arsitektur dan Pagar yang Tidak Boleh Dilanggar

### Stack dan batas modul

- `src/engine/`: engine deterministik; tidak boleh memakai `Math.random()` atau `Date.now()` langsung.
- `src/content/`: kasus, katalog, keluarga, IGD, kurikulum, evidence registry.
- `src/renderer/src/`: UI React/Electron.
- `src/main/`: main process Electron dan IPC.
- `scripts/m13-adjudication/`: compiler artefak review dokter.
- `docs/`: decision log, dossier, audit, dan artefak review.

Engine menerima `PACK`; engine tidak boleh mengimpor konten konkret secara liar. Semua keacakan harus seeded agar replay dossier dapat direproduksi.

### Action log, replay, dan integritas

`GameState.jejak` adalah sumber kebenaran replay. Dossier mahasiswa dibangun ulang dari action log dan diverifikasi terhadap:

- `REVISI_ENGINE`;
- `sidikJariPack`;
- `CONTENT_RELEASE`;
- identitas/seed Ujian;
- HMAC dossier.

Perubahan aturan skor, draw, state transition, atau replay memerlukan unfreeze dance:

1. test merah yang membuktikan masalah;
2. implementasi + migrasi;
3. bump `REVISI_ENGINE`;
4. jalankan seluruh test;
5. hitung dan tempel hash frozen **terakhir**;
6. jalankan freeze, soak, save/replay, dan mode-isolation.

Jangan memakai `tandaiMigrasi` untuk identitas content release. `CONTENT_RELEASE` mempunyai jalur baseline dan urutan rilis sendiri.

### Tiga kelas isi klinis

1. **Decision/scoring-facing:** diagnosis, terapi, stabilisasi, disposisi, credit, draw, mode policy. Perubahan harus mendapat gate yang sesuai.
2. **Decision-facing tetapi tidak selalu di-hash:** teks pertanyaan, jawaban, temuan, `clue`, `panduanResmi`, `catatanRealita`, `mutiaraEbm`. Tetap perlu release discipline dan review medis bila makna berubah.
3. **Kosmetik murni:** framing visual atau copy non-klinis. Tidak boleh diam-diam mengubah fakta atau jawaban.

### Mode dan rilis

- Karier: 90 hari, tempat konten prototipe dan eksplorasi longitudinal.
- Ujian: 30 hari, fairness formal; hanya pool yang secara eksplisit diizinkan.
- Konten Career-only tidak boleh bocor ke Ujian.
- Frozen-build-per-cohort berlaku ketika cohort aktif; belum ada cohort mahasiswa aktif saat ini.

---

## 4. Inventaris Runtime yang Sebenarnya

Angka runtime dikunci di `curriculum.test.ts` dan `fullCoverage.test.ts`:

| Domain | Jumlah | Status |
|---|---:|---|
| Kasus poli/klinik | **210** | Playable di Karier sesuai mode policy |
| Kasus IGD | **20** | 5 baseline + 1 M13-1a + 14 ekspansi teradjudikasi |
| Skenario UKM | **27** | 16 keluarga, termasuk kunjungan ulang |
| Item katalog FKTP/Dex | **144/144** | Semua punya encounter yang mengkredit itemnya di Karier |
| Prototipe poli M13 | **137** | Career-only, belum seluruhnya physician-adjudicated |
| Objective PIS-PK | **12** | Termodelkan dalam blueprint |

Breakdown 210 kasus poli:

- 67 kasus baseline historis;
- 6 kasus poli M13-1a yang sudah physician-approved;
- 137 prototipe lab full-fledge.

Karena itu angka aspiratif lama “sekitar 225 kasus” bukan lagi jumlah runtime yang tepat. Saat ini ada **230 encounter klinis** bila 210 poli dan 20 IGD dijumlahkan. Namun jumlah besar bukan sinonim kualitas: 137 prototipe masih melalui adjudikasi satu per satu.

Klarifikasi penting tentang “144”:

- 144 adalah baris katalog kompetensi FKTP, bukan batas jumlah seluruh diagnosis atau skenario.
- Seluruh 144 kini benar-benar playable di Karier.
- IGD tidak memberi sertifikasi diagnostik palsu pada baris FKTP walau dapat berbagi clinical concept.

---

## 5. Baseline Klinis dan Kebijakan Bukti

Keputusan universal dr. Wirayuda:

> PPK dan/atau PNPK serta aturan Kemenkes terbaru menjadi lantai wajib. EBM yang lebih baru dan lebih baik boleh melampaui lantai bila disitasi eksplisit, lalu diterapkan dengan graceful degradation terhadap kemampuan FKTP Indonesia.

Urutan kerja praktis:

1. PPK FKTP 1186/2022 beserta perubahan 1936/2022 dan PNPK diagnosis-spesifik terkini.
2. Guideline primer/masyarakat profesi atau systematic evidence terbaru bila memperbaiki standar.
3. Fornas KMK 1199/2025 untuk ketersediaan obat nasional.
4. ASPAK untuk sarana, prasarana, alat, operator, dan readiness.
5. KFA untuk nama/kode obat dan alkes.
6. DOEN 2021 hanya konteks historis karena telah dicabut; jangan pakai sebagai standar aktif.

### M13-RP1 yang sudah disetujui

Profil naratif `sukamaju_middle_v1` diterima:

- Puskesmas menengah yang masuk akal, tidak dibuat sangat miskin dan tidak dibuat seperti rumah sakit;
- oksigen, nebulizer, akses IV, pemeriksaan dasar, dan jejaring dapat dinyatakan ready per vignette;
- rontgen, endoskopi, CT, PCI, aspirasi/drainase pleura, ICU, dan layanan spesialis tidak diasumsikan tersedia;
- PONED harus disebut eksplisit bila ada, bukan diasumsikan;
- rawat inap tidak otomatis tersedia.

Proposal `FacilityResourceProfile` dinamis **ditahan**. Resource Tier A-D hanya checklist editorial, bukan fitur engine. Jangan menyelundupkan engine readiness baru tanpa RFC terpisah.

### Debrief bukti

Debrief dapat memuat:

- Mutiara Klinis/EBM;
- Realita FKTP;
- Panduan Resmi Kemenkes;
- panel bukti ringkas dengan tautan HTTPS yang dibuka melalui browser OS.

Tautan harus resmi/primer bila tersedia, ringkas, tidak memenuhi layar, dan tidak menjadi jawaban bocor sebelum encounter selesai.

---

## 6. Timeline Milestone dan Commit Penting

### Sebelum eksperimen M13

- Tag `pre-gpt56-experiment-backup_2026-07-13` pada `3edbdb5` adalah baseline sebelum lab.
- M0-M9 dan M10.5 telah membangun loop dasar, hardening save/replay, mode Ujian, firewall keselamatan, skor, dan freeze discipline.
- M11 membangun tiga lapisan debrief, variasi presentasi, sitasi UKM, SAJI, serta storylet awal.

### M13 program

| Commit | Hasil |
|---|---|
| `414dba5` | Decision Lock M13 rev 4.2.x |
| `e91c323` | M13-0A canonical curriculum blueprint |
| `428fba9` | M13-0B source registry + delta audit + sign-off HT/DM2/stroke/epilepsi |
| `4207ff8` | M13-0C integrity release, mode isolation, content release, CI |
| `30419e3` | M13-0D constrained exam blueprint |
| `59afc01` | Draf M13-1a physician review |
| `d347502` | M13-1a diaktifkan Career-only, pending playtest |
| `8423793` | 25 kasus full-fledge pertama |
| `b91cd52` | Semua 144 FKTP dibuat playable |
| `3a96d85` | Batch 4 + audit pasca-ekspansi; total poli menjadi 210 |

### M11 E-2 dan bridge UKM-UKP

| Commit | Hasil |
|---|---|
| `2356e6e` / tag `golden-master-m11-e2` | SAJI fase 2: babak Ingatkan, kualitas 80/20, outcome sah non-failure |
| `8214e8c` | KLB hanya tutup bila aksi pengendalian benar |
| `2c2ff3e` | Pemetaan transmisi 22 penyakit |
| `174b79d` | Pasien hanya ditautkan ke anggota keluarga nyata |
| `369de58` | Kunjungan terbuka kembali setelah janji ingkar |
| `bd5e7f9` | Pemulihan keluarga setelah karma |
| `0ca747b` | Prolanis multimorbid dan write-back |
| `1a5a4e7` | Care-loop dan EBM bridge diperkuat |
| `bc32e84` | UKM assurance: evidence 27/27, feedback, storylet, kausalitas |
| `a264a8b` | Closure rujukan, UX klinis, dan bridge hardening |

### Editorial, dialog, visual, dan kesiapan kelas

| Commit | Hasil |
|---|---|
| `249edd1` | Editorial pass pada 9.128 bidang teks; high-risk menjadi nol |
| `4299c48` | Koherensi dialog klinik dan keluarga |
| `4996eed` | Contextual UKM visual pass |
| `d3646d6` | Hotspot observasi diselaraskan dengan gambar |
| `6ee50e6` | M12 visual continuity lintas gameplay |
| `1bd13cc` | Class-readiness hardening, Electron/Axe/crash/reflow |
| `d360abc` | Evidence panel dan artefak adjudikasi IGD |
| `47812ab` | Aktivasi 14 kasus IGD yang sudah disetujui dokter |
| `553a6a9` | Adjudikasi prototipe M13-137 nomor 01-06 |
| `06d0415`, `9c96267`, `e18eaf9` | UI/UX: onboarding, nomor RM, HUD a11y, disabled-tab explanation, normalisasi gelar |
| `619e9e4` | Premium operational pass: hotkey, tooltip instan, dialog in-game |
| `991eaa6`, `90567cd` | Triangulasi Q1-Q11, pedoman authoring UI, dan lembar observasi M13-1b |
| `acc8f1e`, `b7bc6e9` | Q4/Q6: SFX default 0,2 serta audit Meja Kerja dan Kunjungan |
| `511373b` | Q2 fullscreen/ingat-jendela ditunda eksplisit sampai pasca-playtest |

### Skor audit rekayasa terakhir

Audit kesiapan kelas 22 Juli mencatat rerata rekayasa **8,8/10**. Bridge UKM-UKP struktural dinilai **8,9/10** setelah closure fixes. Angka ini ditopang invariant dan soak, tetapi **belum** merupakan validasi psikometrik atau bukti bahwa mahasiswa merasa “wow”.

---

## 7. UKM sebagai Pilar Ko-primer

UKM saat ini bukan sekadar kartu pendamping. Sistem yang sudah hidup meliputi:

- 16 keluarga binaan dan 27 skenario kunjungan;
- 12 objective PIS-PK;
- observasi lingkungan, wawancara motivational interviewing, diagnosis COM-B, resep sosial, dan babak Ingatkan;
- outcome berhasil, partial, gagal, ditolak-total, dan diterima-terpaksa dengan semantik berbeda;
- karma keluarga, follow-up, drift, recovery, dan janji yang bisa dilanggar/dipulihkan;
- Posyandu, Prolanis multimorbid, KLB, surveilans, kader, IKS, dan kegiatan lapangan;
- bridge keluarga-pasien klinik, callback rujukan, surat balik, adopsi rekomendasi, dan episode care-loop;
- evidence registry UKM 27/27 dengan locator, dukungan, serta limitation;
- 44 storylet malam peka-state;
- 27 ilustrasi rumah/kondisi kunjungan dan 24 potret pembicara.

Pagar penting:

- kartu bukti tidak boleh membocorkan jawaban sebelum pemain memilih;
- outcome buruk harus probabilistik/multifaktorial, bukan hukuman moral deterministik;
- keluarga tidak boleh mengaku menerima layanan hanya karena tally agregat berubah;
- satu kasus UKP harus dapat menghasilkan tindakan UKM yang nyata, dan kerja UKM harus dapat kembali memengaruhi follow-up UKP;
- Ujian tetap memakai pool yang dikontrol; prototipe Career-only tidak boleh masuk.

### Yang belum dibuktikan tentang UKM

- Belum ada playtest mahasiswa yang membuktikan fun, pacing, atau kemampuan menjelaskan loop UKM-UKP.
- Target awal tetap: minimal 80% peserta dapat menjelaskan satu loop UKM-UKP setelah bermain tanpa melihat teks.
- Skor audit di atas 8 menilai struktur dan fidelity, bukan pengalaman emosional manusia.

---

## 8. M12 Visual Pass

M12 selesai secara runtime:

- 27 scene kunjungan spesifik, termasuk perubahan visual pada kunjungan ulang;
- 24 potret warga;
- atlas aktivitas, klinik, storylet, dan preset dokter;
- 123 hotspot dengan koordinat renderer khusus;
- marker dan kartu observasi memiliki nomor pasangan, hover/focus sinkron, serta discovery order stabil;
- dark mode dan text scaling dipertimbangkan;
- aset dibuat orisinal melalui OpenAI image generation, bukan meniru artis atau studio tertentu.

Source PNG disimpan di:

```text
C:\Users\HP\.codex\generated_images\019f2533-808e-7bc3-97e3-c7c340043355
```

Dokumen utama: `M12_VISUAL_PASS.md` dan `M12_ASSET_INVENTORY.md`.

Jangan mengubah hotspot content coordinates untuk memperbaiki gambar; mapping visual berada pada lapisan renderer agar fingerprint engine tetap stabil.

---

## 9. Status M13-0 sampai M13-5

| Milestone | Status sebenarnya |
|---|---|
| M13-0 Decision Lock | Selesai |
| M13-0A Blueprint | Selesai |
| M13-0B Source/delta audit | Selesai + physician sign-off |
| M13-0C Integrity release | Selesai |
| M13-0D Exam blueprint | Selesai |
| M13-1a Authoring slice | Aktif Career-only, `activated_pending_playtest` |
| M13-1b Learner pilot | **Belum**; butuh mahasiswa/proxy sungguhan |
| M13-2 First measured wave | Belum; butuh protokol analytics minimal dan data manusia |
| M13-3 Scale by evidence | Belum |
| M13-4 Full library/mode gating | Library Karier sudah besar, tetapi final mode gating menunggu evidence + adjudikasi |
| M13-5 Completion audit | Belum |

M13-1b adalah gerbang manusia, bukan sesuatu yang boleh disimulasikan bot:

- minimal 3 mahasiswa/proxy;
- dangerous-path sengaja dimainkan;
- waktu baca, kebingungan, beban kognitif, dan usability dicatat;
- dr. Wirayuda memberi keputusan zero-material-defect sebelum lanjut.

---

## 10. Adjudikasi 14 Kasus IGD

Status: **14/14 selesai, diimplementasikan, aktif Career-only, tidak masuk Ujian.**

Kasus yang selesai:

1. Asfiksia neonatorum.
2. Cedera kepala sedang.
3. Eklampsia.
4. Gigitan ular berbisa.
5. Keracunan organofosfat.
6. Ketoasidosis diabetik dewasa.
7. Luka bakar mayor + cedera inhalasi.
8. Perdarahan pascasalin primer dengan syok.
9. Pneumotoraks tensi traumatik.
10. Status epileptikus konvulsif dewasa.
11. Suspek stroke akut dalam jendela reperfusi.
12. Aspirasi benda asing dengan sumbatan berat pada anak.
13. Suspek sepsis dengan syok.
14. Tenggelam nonfatal dengan gagal napas dan hipotermia ringan.

Artefak dan log:

- `M13_14_IGD_ADJUDICATION.html`
- `M13_14_IGD_ADJUDICATION_DATA.json`
- `M13_14_IGD_ADJUDICATION_REPORT.md`
- `M13_14_IGD_DECISION_LOG.md`

IGD tidak perlu diadjudikasi ulang kecuali ada guideline baru material atau bug runtime baru.

---

## 11. Adjudikasi 137 Prototipe Poli

### Mekanisme

137 kasus diperoleh dari query runtime:

```ts
kasus.activationStatus === 'lab_prototype_unadjudicated'
```

Semua sudah playable di Karier dan dikecualikan dari Ujian. Artefak review:

- `M13_137_ADJUDICATION.html`
- `M13_137_ADJUDICATION_DATA.json`
- `M13_137_ADJUDICATION_REPORT.md`
- `M13_137_KFA_SNAPSHOT.json`
- `M13_137_DECISION_LOG.md`

### Keputusan dokter yang sudah diberikan

| No. | Kasus | Keputusan | Commit/status |
|---:|---|---|---|
| 01 | `lab_gizi_buruk_komplikasi` | approved with edits | commit `553a6a9` |
| 02 | `lab_mastoiditis_akut` | approved with edits | commit `553a6a9` |
| 03 | `lab_bronkiolitis_berat` | approved with edits | commit `553a6a9` |
| 04 | `lab_meningitis_bakterial_suspek` | approved with edits | commit `553a6a9` |
| 05 | `lab_benda_asing_esofagus` | approved with edits | commit `553a6a9` |
| 06 | `lab_tia_serangan_iskemik_sesaat` | approved with edits | commit `553a6a9` |
| 07 | `lab_anafilaksis_makanan` | approved with edits | checkpoint yang memuat dossier ini |
| 08 | `lab_perdarahan_gi_atas` | approved with edits | checkpoint yang memuat dossier ini |
| 09 | `lab_pneumotoraks_spontan` | approved with edits | checkpoint yang memuat dossier ini |

Dengan keputusan nomor 09, tersisa **128/137** kasus.

### Ringkasan perubahan 07-09 yang disegel

**07 - Anafilaksis makanan**

- epinefrin 0,5 mg IM paha segera, ulang 5 menit bila ABC menetap;
- oksigen, cairan kristaloid terukur, pemantauan, dan transfer paralel;
- bolus epinefrin IV, aminofilin rutin, serta antihistamin/steroid yang menunda epinefrin dilarang;
- RCUK/ERC 2025, RCUK 2021, AAAAI/ACAAI 2023.

**08 - Perdarahan GI atas**

- judul dikoreksi menjadi instabilitas hemodinamik;
- akses IV + kristaloid terukur, oksigen karena SpO2 92%, monitoring, NPO, stop ibuprofen, transfer;
- NGT/lavage bukan universal;
- konflik PNPK PPI vs NICE dinyatakan jujur; PPI tidak menjadi skor wajib bila resource tidak ready;
- Hb/O+ adalah data handover, bukan crossmatch.

**09 - Pneumotoraks spontan primer dengan gangguan fisiologis**

- SKDI tetap 3A; konflik label 4A dalam bab PPK ditampilkan terbuka;
- oksigen target 94-98% + monitoring menjadi stabilisasi wajib;
- parasetamol opsional;
- transfer tanpa menunggu foto toraks;
- dekompresi jarum hanya bila tension dicurigai;
- edukasi penerbangan, scuba, dan berhenti merokok;
- BTS 2023, ERS/EACTS/ESTS 2024, dan BTS oxygen guideline.

### Kasus berikutnya

Nomor berikutnya adalah:

```text
M13-137-10 - lab_tetanus_generalisata_awal
```

Alur kerja yang disepakati:

1. Baca literal kode kasus.
2. Verifikasi sumber primer/Kemenkes terbaru hanya untuk kasus yang sedang dibahas.
3. Temukan mismatch diagnosis, SKDI, pertanyaan, PF/lab, terapi, edukasi, disposisi, resource, dan UKM bridge.
4. Ajukan satu rekomendasi ringkas kepada dr. Wirayuda.
5. Jangan edit sampai persetujuan eksplisit diberikan.
6. Setelah disetujui: edit, invariant test, decision log, regenerate artefak.
7. Commit/push per checkpoint wajar, bukan satu commit per kalimat dan bukan mega-batch tanpa verifikasi.

---

## 12. Duel Diagnosis, Teach-back, dan Editorial

Sudah tersedia:

- delapan Duel Diagnosis;
- delapan latihan Teach-back;
- progressive disclosure di debrief;
- audit editorial pada 9.128 bidang teks runtime;
- tidak ada temuan editorial high-risk setelah commit `249edd1`;
- guard pertanyaan anamnesis, jargon pasien, tanda baca, panjang kalimat, dan pembuka kasus.

Jangan menganggap materi ini telah tervalidasi mahasiswa. Think-aloud masih perlu menguji apakah pemain menemukan keputusan utama dan dapat menjelaskan alasannya.

---

## 13. Pekerjaan Terbuka yang Benar-Benar Tersisa

### Prioritas aktif

1. **Selesaikan adjudikasi M13-137:** 128 kasus tersisa, satu per satu atau batch kecil yang koheren.
2. **Build/install gabungan Q10/Q11:** buat installer dari checkpoint bersih yang memuat UI/UX sampai `511373b` dan adjudikasi 07-09, verifikasi, lalu timpa instalasi lokal.
3. **M13-1b learner pilot:** 3 mahasiswa/proxy, dangerous paths, zero-material-defect.
4. **UI/UX pasca-playtest:** buka kembali Q2/Q5 hanya bila data manusia menuntut; Q3 menunggu paket audio berlisensi.

### Setelah data manusia tersedia

6. M13-2 analytics offline minimal yang tidak membawa NIM, seed, raw action log, refleksi, atau SBAR.
7. M13-3 scale-by-evidence dan penyesuaian tier/paparan berdasar data.
8. M13-4 final mode gating dan fairness Ujian pada pool final.
9. M13-5 completion audit: setiap item dibangun/dikecualikan/ditunda eksplisit, binding terminal, review record cocok dengan release/hash, dan tidak ada material defect.

### Ditahan secara sadar

- M15 Arsip Jaga Malam: konsep disetujui, belum diimplementasikan; pilot enam snapshot display-only setelah adjudikasi utama lebih tenang.
- Regional mode, Endurance hunt, dan sub-scope epidemiologi khusus: belum final.
- Mpox: jangan ditulis tanpa arahan eksplisit karena sensitivitas populasi dan bahasa.
- `FacilityResourceProfile` dinamis: ditahan oleh M13-RP1.
- Historical-pack runtime untuk membuka save lintas release: di luar scope.
- Telemetri remote: tidak ada; analytics harus offline, minimal, dan consented.

---

## 14. M15 Arsip Jaga Malam

M15 sudah dicatat tetapi belum aktif. Tujuannya menampilkan kisah nyata, sejarah, ironi sistem, atau kejadian unik pada debrief malam tanpa overload. Keputusan utama:

- snapshot menggantikan storylet atmosfer pada malam terpilih, bukan menambah kartu wajib;
- 60-100 kata, satu gambar, satu makna bagi Sukamaju, tombol sumber, disclosure opsional;
- tidak berskor, bisa dilewati, maksimal satu setiap 2-3 malam;
- tragedi tidak boleh dieksploitasi;
- foto harus jelas haknya; bila tidak, gunakan ilustrasi non-identifying;
- seed item adalah kasus dr. Icha/gigitan ular, dengan pemisahan tegas fakta, dugaan, proses hukum, dan pelajaran sistem.

Baca `M15_ARSIP_JAGA_MALAM_BRIEF.md` sebelum mengerjakan. Jangan memulai M15 sebagai selingan selama adjudikasi M13 aktif kecuali dr. Wirayuda mengubah prioritas.

---

## 15. Verifikasi dan Perintah Standar

Gunakan PowerShell/Windows:

```powershell
npm.cmd run m13:adjudication
npm.cmd run typecheck
npx.cmd vitest run
npx.cmd vitest run src/engine/freeze.test.ts
npm.cmd run audit:editorial
npm.cmd run build
npm.cmd run test:e2e
npm.cmd run dist
```

Khusus perubahan adjudikasi:

```powershell
npx.cmd vitest run src/content/lab/adjudicationWave6.test.ts `
  src/content/lab/m13AdjudicationArtifact.test.ts `
  src/engine/freeze.test.ts
```

Verifikasi final setelah perubahan nomor 09 dan integrasi baseline UI/UX `511373b`:

- generator: **137/137** kasus, seluruhnya terkompilasi tanpa gap provenance;
- focused adjudication/artifact/freeze: **32/32** lulus;
- full suite: **1289/1289** lulus pada 138 file;
- typecheck: bersih;
- freeze: **18/18** lulus;
- soak Karier/Ujian dan invarian `teliti >= speedrunner >= ceroboh` lulus;
- checkpoint hanya memuat batch adjudikasi aktif dan dossier pemulihan ini; file UI/UX sudah berada di commit terpisah yang lebih dahulu ter-push.

### Definisi “selesai” yang wajib dipakai dalam laporan

Laporkan secara terpisah:

- **implemented:** kode berubah;
- **wired:** runtime benar-benar mengimpor/memakai;
- **verified:** test/typecheck/freeze lulus;
- **built:** installer dibuat;
- **installed:** installer menjalankan penggantian instalasi lokal;
- **committed:** commit lokal ada;
- **pushed:** commit ada di `origin/codex-gpt56-experiment`.

Jangan memakai satu kata “selesai” untuk tujuh keadaan berbeda itu.

---

## 16. Pembagian Kerja Aman Setelah Recovery

### CODEX saat ini memegang

- adjudikasi M13-137;
- perubahan konten klinis dan evidence registry terkait;
- decision log dan generator artefak;
- test/freeze/release yang diperlukan oleh adjudikasi.

### Claude dapat melanjutkan secara paralel pada

- audit dan perbaikan renderer-only UI/UX;
- accessibility, reflow, keyboard, screen reader, dark/light, text scale;
- visual QA lewat screenshot dan Electron E2E;
- copy kosmetik non-klinis yang tidak mengubah jawaban atau keputusan;
- audit read-only atas hasil CODEX.

Papan keputusan UI/UX Q1-Q11 sudah terminal pada `511373b`: Q4/Q6/Q7/Q8/Q9 dieksekusi, Q1 moot-terverifikasi, Q5 diadopsi tanpa aksi sambil menunggu playtest, Q2 ditunda pasca-M13-1b, dan Q3 menunggu aset audio berlisensi. Tidak ada antrean UI/UX tanpa status; pekerjaan berikutnya yang membuka Q2/Q5 adalah data playtest manusia.

### Batas koordinasi konten klinis

```text
src/content/lab/batch1.ts
src/content/lab/batch2.ts
src/content/lab/catalog.ts
src/content/lab/adjudicationWave6.test.ts
scripts/m13-adjudication/config.ts
docs/M13_137_*
```

Batch 07-09 sudah masuk checkpoint yang memuat dossier ini. File di atas tetap jalur adjudikasi klinis CODEX; Claude boleh mengaudit read-only, tetapi perubahan paralel harus dikoordinasikan agar keputusan dokter dan artefak generator tidak saling menimpa.

---

## 17. Checklist Recovery Claude

Sebelum mengerjakan apa pun:

1. `cd D:\Dev\PRIMER-CODEX-lab\primera-desktop`.
2. `git status --short` dan pastikan perubahan adjudikasi masih ada.
3. `git branch --show-current` harus menghasilkan `codex-gpt56-experiment`.
4. Baca dossier ini, lalu `M13_137_DECISION_LOG.md` dan `M13_KICKOFF_PROMPT.md` bila tugas menyentuh M13.
5. Jangan reset, checkout, clean, stash, atau revert perubahan working tree.
6. Bila tugas UI/UX, batasi patch ke renderer/test yang relevan.
7. Verifikasi secara lokal, laporkan file yang disentuh dan bukti test.
8. Jangan build/install di tengah perubahan CODEX tanpa memastikan working tree yang ikut terpaket memang dimaksudkan.

### Kalimat status yang benar untuk melanjutkan percakapan

> Saya sudah pulih konteks. Baseline UI/UX sampai `511373b` dan adjudikasi M13-137 nomor 01-09 sudah disegel; IGD 14/14 sudah aktif, runtime memiliki 210 poli + 20 IGD + 27 skenario UKM, papan Q1-Q11 terminal, dan prioritas konten berikutnya adalah M13-137-10 sambil menunggu playtest M13-1b.

---

## 18. Pointer Dokumen Utama

- `M13_KICKOFF_PROMPT.md` - keputusan aktif dan milestone M13.
- `M13_DECISION_LOG.md` - sejarah keputusan/governance.
- `M13_137_DECISION_LOG.md` - keputusan dokter prototipe poli.
- `M13_14_IGD_DECISION_LOG.md` - keputusan 14 IGD yang sudah selesai.
- `CLASS_READINESS_AUDIT_2026-07-22.md` - skor rekayasa dan residual.
- `UKM_ASSURANCE_RELEASE_2026-07-19.md` - evidence dan kualitas UKM.
- `UKM_UKP_BRIDGE_CLOSED_LOOP_PROPOSAL.md` - arsitektur bridge dan rationale.
- `M12_VISUAL_PASS.md` / `M12_ASSET_INVENTORY.md` - visual dan provenance.
- `EDITORIAL_UX_AUDIT_2026-07-19.md` - audit bahasa pra/pasca.
- `DIALOGUE_COHERENCE_AUDIT_2026-07-20.md` - logika anamnesis/dialog.
- `M13_ASPAK_PUSKESMAS_RESOURCE_BASELINE.md` - baseline resource.
- `M15_ARSIP_JAGA_MALAM_BRIEF.md` - milestone M15 yang ditahan.
- `CODEX_HANDOFF_DOSSIER.md` - sejarah arsitektur sebelum M13; jangan gunakan statusnya sebagai status kini.
- `CODEX_BRIEFING_LANJUTAN.md` - sejarah pembagian tugas dan keputusan M11/bridge; sebagian antreannya sudah selesai.

---

**Kesimpulan operasional:** game sudah bertambah nyata, bukan sekadar dokumen. Seluruh 144 katalog FKTP playable di Karier; ada 210 kasus poli, 20 IGD, dan UKM longitudinal dengan 27 skenario. Tantangan terbesar sekarang bukan menambah jumlah, melainkan menuntaskan adjudikasi 128 prototipe tersisa dan membuktikan pengalaman belajar pada manusia. Claude harus membantu memperhalus pengalaman tanpa mengulang desain dari nol atau menabrak batch klinis yang sedang dikerjakan CODEX.
