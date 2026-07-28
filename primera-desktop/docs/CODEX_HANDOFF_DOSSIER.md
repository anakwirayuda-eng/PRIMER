# DOSSIER SERAH TERIMA — PRIMERA "Puskesmas Pagi" untuk CODEX / GPT 5.6 Sol

> **ARSIP HISTORIS (13 Juli 2026).** Untuk pemulihan konteks operasional
> terbaru setelah M12/M13, adjudikasi kasus, dan batch beta.2, baca
> `CLAUDE_RECOVERY_DOSSIER_2026-07-28.md` terlebih dahulu. Angka, status
> milestone, aturan sumber DOEN/Fornas, dan antrean kerja di dokumen lama ini
> tidak semuanya masih berlaku.

**Ditulis:** 2026-07-13, oleh Claude (Sonnet 5), atas permintaan Dr. Anak Agung Bagus Wirayuda.
**Tujuan dokumen ini:** memberi Anda (CODEX, dijalankan sebagai GPT 5.6 Sol) SEMUA konteks yang
dibutuhkan untuk melanjutkan, mengimprove, dan menyelesaikan milestone-milestone PRIMERA
selanjutnya yang belum tuntas — tanpa perlu bertanya ulang hal-hal yang sudah pernah diputuskan,
dan tanpa perlu menebak sejarah/alasan di balik keputusan desain yang sudah ada.

Dokumen ini **mandiri (self-contained)** — asumsikan Anda tidak tahu apa-apa soal proyek ini
sebelum membacanya. Baca dari awal sampai akhir sebelum menyentuh kode apa pun.

---

## 0. KONTEKS PALING PENTING — BACA DULU SEBELUM APA PUN

**Ini adalah eksperimen, bukan langsung produksi.** Dr. Wirayuda ingin mencoba pengembangan
lanjutan proyek ini penuh menggunakan Anda (CODEX / GPT 5.6 Sol) sebagai pembangun, sekadar untuk
belajar bagaimana rasanya ("ya nyoba aja biar belajar") — pengalamannya nanti akan diceritakan
balik ke sesi Claude yang menulis dokumen ini. Ini BUKAN reversal diam-diam dari kebijakan lama
proyek ini soal Anda (lihat §7 — sepanjang proyek ini, CODEX SELALU dipakai read-only/audit-only,
dan itu keputusan sadar Dr. Wirayuda 2026-07-11 karena takut risiko). Anda sekarang diberi izin
untuk MENULIS KODE — tapi HANYA di folder kerja terisolasi di bawah ini, terpisah total dari
cabang produksi yang sesungguhnya.

**Folder kerja Anda (SATU-SATUNYA tempat Anda boleh mengedit):**

```
D:\Dev\PRIMER-CODEX-lab\primera-desktop\
```

Ini adalah **clone git penuh** (bukan symlink/worktree) dari repo utama, di-checkout dari tag
`pre-gpt56-experiment-backup_2026-07-13` (= commit `3edbdb5`), pada branch lokal baru
`codex-gpt56-experiment`. Sudah diverifikasi SEHAT sebelum diserahkan ke Anda:
- `npm install` sudah dijalankan (476 package, 0 kerentanan).
- `npm run typecheck` bersih.
- Baseline saat clone diserahkan: `npx vitest run` → **767/767 test lolos** (status terkini lihat §4).

**Remote git** (`origin`) folder ini menunjuk ke GitHub sungguhan yang sama dengan proyek utama:
`https://github.com/anakwirayuda-eng/PRIMER.git`. **JANGAN PERNAH push ke branch `master` atau
`claude/vigorous-bose-f66bc6`** — itu cabang produksi asli dengan riwayat Claude yang panjang.
Kerja Anda tetap di branch `codex-gpt56-experiment` (sudah dibuat) sampai Dr. Wirayuda sendiri
yang memutuskan untuk mem-forward-kan sesuatu dari sana. Kalau Anda mau push checkpoint demi
keamanan, push ke branch itu sendiri (`git push -u origin codex-gpt56-experiment`) atau branch
baru bernama jelas — jangan pernah `git push origin master`/`--force` apa pun.

**Gotcha Windows yang akan langsung Anda temui:** clone ini dibuat oleh proses/context Windows
yang berbeda dari user interaktif, jadi git akan menolak semua perintah dengan pesan
`"detected dubious ownership"`. Solusinya BUKAN mengubah git config global (jangan lakukan itu
tanpa izin eksplisit operator) — pakai override inline di setiap perintah:
```
git -c safe.directory='*' <perintah biasa>
```
Kalau operator manusia yang menjalankan Anda ingin kenyamanan permanen, itu keputusan mereka
sendiri (`git config --global --add safe.directory ...`), bukan sesuatu yang Anda putuskan sendiri.

**Repo produksi asli (JANGAN DISENTUH, hanya referensi):**
`D:\Dev\PRIMER\.claude\worktrees\vigorous-bose-f66bc6\primera-desktop` — git worktree cabang
`claude/vigorous-bose-f66bc6`, tempat sesi Claude yang menulis dokumen ini benar-benar bekerja.

**Game yang benar-benar dimainkan Dr. Wirayuda (JANGAN DISENTUH):**
`D:\Games\PRIMERA - Puskesmas Pagi\` — hasil build `npm run pack` + `robocopy /MIR` manual dari
repo produksi. Instalasi Anda TIDAK terhubung ke sini; kalau eksperimen Anda ingin diuji-main
sungguhan, itu build terpisah dari folder Anda sendiri, JANGAN overwrite folder ini.

**Backup yang sudah dibuat sebelum eksperimen ini** (kalau Anda perlu titik-balik/pembanding):
- Git tag `pre-gpt56-experiment-backup_2026-07-13` (di kedua repo, sudah di-push ke GitHub).
- `D:\Games\_BACKUP\PRIMERA-build-pre-gpt56experiment_2026-07-13_0808\` — salinan build siap-main.
- `D:\Games\_BACKUP\PRIMERA-source_2026-07-13_0808\` — salinan source (tanpa node_modules/dist/.git).

---

## 1. SIAPA PENGEMBANG & UNTUK SIAPA GAME INI

**Dr. Anak Agung Bagus Wirayuda, MD, PhD** — dokter sekaligus peneliti di ITS MEDICS (Institut
Teknologi Sepuluh Nopember, Surabaya). Pengembang **tunggal** (solo dev) proyek ini. Bahasa
komunikasi: Indonesia (campur istilah teknis Inggris). Menghargai audit/kritik jujur, bukan
sekadar konfirmasi — kalau Anda menemukan sesuatu yang meragukan di keputusan lama, katakan
terus terang, jangan diam-diam dilewati atau ditelan mentah.

**Target pengguna:** ~50 mahasiswa Fakultas Kedokteran Indonesia, deploy **~September 2026**
(mundur dari rencana awal Juni 2026). HAKI game sudah terdaftar: **EC002026019623**
("PRIMER: Primary Care Manager Simulator" — nama HAKI resmi, JANGAN diubah di `metadata.ts`
meski nama tampilan game sekarang "PRIMERA").

**Konstelasi agen yang dipakai Dr. Wirayuda** (relevan untuk memahami peran Anda): DeepThink
(strategi/kebijaksanaan — biasa mereview desain besar), GPT-5.6 Sol Extra High (**itu Anda** —
biasanya QA/radar-anomali read-only, sekarang dicoba sebagai builder), Claude (builder/heavy-
lifter utama sepanjang sejarah proyek ini, penulis dokumen ini).

---

## 2. APA ITU PRIMERA "PUSKESMAS PAGI"

Game simulasi dokter Puskesmas (Fasilitas Kesehatan Tingkat Pertama/FKTP) Indonesia untuk
edukasi mahasiswa kedokteran — **"kerangka Football Manager + hati Harvest Moon"**. Prinsip
desain eksplisit: ini simulasi longitudinal jujur (replayable, bukan sekali-tamat), BUKAN "The
Sims" (tidak ada avatar jalan-jalan/real-time tick).

**Sejarah singkat:** proyek ini adalah REBUILD TOTAL dari sebuah "PRIMER" versi lama (web/PWA,
React+Zustand+Supabase, di `D:\Dev\PRIMER\src\` — codebase LAMA, TERPISAH TOTAL, dormant sejak
2026-04-27, JANGAN DIBINGUNGKAN dengan `primera-desktop`). Versi lama itu punya insiden P0
serius (ICD-10 translation poisoning — terjemahan mesin salah untuk kode diagnosis, berisiko
membangun miskonsepsi klinis permanen; sudah RESOLVED di versi lama, tapi dataset lama itu
tetap tak dipercaya untuk porting mentah — lihat §10.4). Pada 2026-07-02 Dr. Wirayuda memutuskan
membangun ulang dari nol sebagai game **desktop** (Electron), bukan web — hasil sintesis panel
desain multi-agen. Sejak itu SEMUA pekerjaan ada di `primera-desktop/` (rebrand dari
`primer-desktop/` pada 2026-07-04).

**Game loop:** 3 blok per hari (Pagi klinik / Siang lapangan / Sore meja kerja) + gauge stamina
6-pip. Dua mode:
- **Karier** (90 hari) — bebas nilai, mode "santai"/progres jangka panjang.
- **Ujian** (30 hari) — **satu-satunya mode yang dinilai formal** untuk keperluan akademik nyata.
  Arsitektur DUA-SEED: `seedKurikulum` (menentukan Director+IGD — SAMA untuk semua mahasiswa
  dalam satu paket, dari 8 paket rotasi di `paketUjian.ts`, supaya tak bisa saling bocor
  walkthrough) vs `seed`/flavor (wajah pasien+dadu kosmetik, PER-mahasiswa).

**6 layar utama:** Meja Kerja (inbox+"Lanjutkan", compulsion loop ala Football Manager), Klinik
"Lembar Periksa" (satu lembar SOAP: Anamnesis→Pemeriksaan→Diagnosis→Terapi→Disposisi), Peta Desa
(choropleth 8 RW), Kunjungan rumah (4-babak: observasi hotspot→wawancara MI dengan gerbang
kejujuran→diagnosis COM-B→resep sosial), Dex SKDI (buku saku 144 penyakit kompetensi-4A,
Leitner-lite spaced repetition), Rapor (skor 4 dimensi).

**Skor 4 dimensi** (`hitungSkor()`, `src/engine/scoring.ts`) — SATU-SATUNYA formula skor:
- **UKP** (0-35): akurasi diagnosis × Referral Guillotine (anti-cowboy) × kalibrasi
  TEGAK/SUSPEK epistemik, minus penalti obat berbahaya/antibiotik-serampangan/firewall-alergi,
  plus bonus rujukan-tepat + efek IGD.
- **UKM** (0-35): IKS desa (formula resmi Permenkes 39/2016) + kunjungan berhasil + kualitas MI +
  Prolanis terkontrol, minus apathy + efek karma (keluarga binaan yang diabaikan memburuk).
- **Manajemen** (0-15): stewardship lab/antibiotik + kesehatan kapitasi + akreditasi.
- **Resiliensi** (0-15): hari kelelahan + burnout.
- Total 0-100 → grade **A≥85 · B≥70 · C≥55 · D<55** (hard-coded `scoring.ts:29-33`).

**Dossier Mahasiswa** — replay ber-HMAC yang bisa diverifikasi dosen (`verifikasiDossier()`,
`src/engine/verifikasi.ts`): membangun ulang state dari `state.jejak` (action-log lengkap,
termasuk aksi yang DITOLAK) via `buildInitialState()` lalu fold `advance()`, banding hasil
replay vs klaim mahasiswa. Status: SAH / TIDAK SAH / TIDAK DAPAT DIVERIFIKASI (bukan biner
sah/tidak — versi engine berbeda = "tidak dapat diverifikasi", bukan otomatis dianggap curang).

---

## 3. ARSITEKTUR TEKNIS — HUKUM YANG MENGATUR SEMUA KERJA

**Stack:** Electron + Vite (electron-vite) + React 19 + TypeScript strict + Zustand.

**Struktur folder kunci** (di dalam `primera-desktop/`):
```
src/engine/       — engine murni deterministik, ZERO dependency Electron/React.
                    reducer.ts, clinic.ts, scoring.ts, director.ts, state.ts, actions.ts,
                    events.ts, verifikasi.ts, save.ts, igd.ts, kader.ts, kunjungan.ts,
                    kegiatan.ts, init.ts, pispk.ts, surveilans.ts, paketUjian.ts, core/rng.ts
src/content/      — "content pack": semua data kasus/obat/lab/tindakan/edukasi/ICD
                    kasus/*.ts (7 file: kasusInfeksi, kasusKiaJiwa, kasusKronis, kasusKulit,
                    kasusMetabolikMsk, kasusRespGi, kasusSarafMataTht — 67 kasus playable),
                    katalogM3.ts (obat/lab/tindakan/edukasi), types.ts (SEMUA tipe konten),
                    icd10.ts, skdi144.ts, index.ts (`PACK` — bundel semua content)
src/renderer/src/ — UI React. screens/klinik/ (Deck* components per fase encounter),
                    screens/ (layar-layar utama), components/, store.ts (Zustand + IPC bridge),
                    audio/, utils/
docs/             — SEMUA dossier/desain/audit historis proyek ini (baca sebelum menulis yang
                    baru — kemungkinan besar pertanyaan Anda sudah pernah dijawab di sini)
```

**Prinsip inti #1 — Engine murni deterministik.** `src/engine/` TIDAK PERNAH memanggil
`Date.now()`/`Math.random()` langsung — semua keacakan lewat `Rng` (seeded PRNG, `core/rng.ts`).
Ini yang membuat replay/verifikasi dossier mungkin. **Jangan pernah** menambah non-determinisme
ke file manapun di `src/engine/`.

**Prinsip inti #2 — Action-log adalah sumber kebenaran.** `GameState.jejak: Action[]` mencatat
SETIAP aksi (termasuk yang ditolak reducer). Skor TIDAK PERNAH dihitung ulang dari state
sembarangan — `hitungSkor()` HANYA membaca `state.tally` (SkorTally, diisi reducer saat
DISPOSISI/dsb, tak pernah UI). Kalau Anda menambah mekanik skor baru, ikuti pola ini: field
baru di `SkorTally` (state.ts) → diisi di `reducer.ts` pada titik kejadian → dibaca `scoring.ts`.

**Prinsip inti #3 — GOLDEN MASTER FREEZE (PALING PENTING, BACA DUA KALI).**

Proyek ini sudah melewati "Golden Master" (akhir semester lalu) — SATU bump `REVISI_ENGINE`
pamungkas lalu **hard-freeze** semantik skor/replay, supaya mahasiswa yang dinilai di minggu ke-2
vs minggu ke-8 dinilai dengan kunci jawaban & aturan yang SAMA PERSIS (fairness kohort), dan
Dossier ber-HMAC lama tetap bisa diverifikasi dosen.

**Konstanta versi:** `REVISI_ENGINE` di `src/engine/verifikasi.ts` (baris ~470). **Nilai saat
dokumen ini ditulis: 30.**

**Mekanisme penegakan:** `src/engine/freeze.test.ts` — hash SHA-256 dari **16 file**:
`reducer.ts, clinic.ts, scoring.ts, director.ts, core/rng.ts, igd.ts, kader.ts, init.ts,
kegiatan.ts, kunjungan.ts, paketUjian.ts, verifikasi.ts, state.ts, save.ts, pispk.ts,
surveilans.ts`. Test ini SENGAJA GAGAL kalau salah satu file berubah walau satu karakter.

**Cara "unfreeze" (kalau Anda memang perlu mengubah salah satu 16 file di atas) — WAJIB
prosedur ini, jangan pernah lewati:**
1. Ubah kode yang perlu diubah.
2. Jalankan `freeze.test.ts` — baca pesan error, ia MENYERTAKAN hash baru yang benar.
3. Salin hash baru itu ke `HASH_DIBEKUKAN` di `freeze.test.ts` untuk file yang berubah.
4. **Bump `REVISI_ENGINE`** di `verifikasi.ts` (hampir pasti perubahan skor/replay-affecting).
5. Dokumentasikan alasan unfreeze di commit message (ikuti gaya commit history proyek ini —
   `git log` di repo ini penuh contoh format yang dipakai, mis. `fix(m10.6): ... (REVISI_ENGINE
   29→30)`).
6. Jalankan ULANG full test suite + `npm run typecheck` — pastikan hijau semua.

**PENTING — cek tag git `golden-master-m10.5` TIDAK sinkron dengan REVISI_ENGINE saat ini**:
tag itu masih menunjuk commit `7780293` (REVISI_ENGINE **28**), padahal REVISI_ENGINE sekarang
sudah **30** (2 unfreeze lagi terjadi setelah tag itu dibuat, tag-nya sendiri tak pernah
dipindah). **Jangan percaya nama tag git sebagai sumber kebenaran "apa yang beku sekarang"** —
selalu cek `REVISI_ENGINE` di `verifikasi.ts` + isi `HASH_DIBEKUKAN` di `freeze.test.ts` sebagai
sumber kebenaran aktual.

**"Freeze-bucket router"** — aturan pasti kapan sebuah perubahan KONTEN (bukan kode engine)
butuh unfreeze/bump vs aman kapan saja (diverifikasi langsung terhadap kode, lihat
`primera-desktop/src/engine/verifikasi.ts` fungsi `sidikJariPack` baris ~490-548 untuk daftar
pasti field yang di-hash):

- **Ember Merah (WAJIB pre-freeze / butuh bump kalau diubah pasca-freeze):** field `KasusKlinis`
  yang DI-SKOR ATAU DI-HASH — `tatalaksana.*` (obatBenar/obatAlternatif/obatOpsional/
  obatSalahUmum/prosedur/edukasi/edukasiKritis), `icd10`, `harusDirujuk`, `skdi`, `alergiTrap`,
  `interaksiTrap`, `konfirmasiWajib`, `justifikasiRujukValid`, `demografi`/`prevalensi`/
  `kategori`/`konsekuensi`/`spesialisRujukan` (semua ikut hash `sidikJariPack`), dan
  **menambah kasus BARU** (mengubah pool director → `rng.weighted` bergeser → replay bergeser).
  Anamnesis di-hash HANYA pada `id`/`esensial`/`distraktor`/`oldcarts`/`hanyaUntuk` — TEKS
  `tanya`/`jawab` dan URUTAN ARRAY-nya TIDAK di-hash (array di-sort by id sebelum hash).
- **Ember Hijau (aman kapan saja, silent-patch, TIDAK butuh bump):** field murni tampilan —
  `panduanResmi`, `catatanRealita`, `mutiaraEbm`, teks `clue`, teks `tanya`/`jawab` anamnesis
  (termasuk urutan array-nya!), `keluhanUtama` (field top-level, TIDAK ada di `sidikJariPack`
  sama sekali), label katalog edukasi (nama/kategori/sinonim).
- Pertanyaan pemandu cepat: **"apakah field ini ditulis di `sidikJariPack` (verifikasi.ts) ATAU
  dibaca oleh `clinic.ts`/`scoring.ts`/`reducer.ts` untuk menghitung sesuatu?"** — kalau ya,
  Ember Merah. Kalau murni ditampilkan ke pemain tanpa memengaruhi skor/replay, Ember Hijau.

**Aturan prioritas EBM-realistis untuk kunci jawaban** (`obatBenar`/`obatAlternatif`/dsb):
1. EBM terbaik untuk praktik umum, **DIBATASI ketersediaan realistis** — cek dulu DOEN 2021
   (`docs/references/doen2021/doen2021_puskesmas_entries.json`, 241 entri formularium
   Puskesmas). Kalau obat "ideal" tak ada di DOEN, JANGAN dipakai sbg jawaban skor — itu
   mengajarkan fantasi, bukan realita FKTP.
2. Kalau #1 tak menjawab cukup (obat tak tersedia, atau EBM sumber tak spesifik-FKTP), fallback
   ke PPK 1186/2022 (`docs/references/ppk1186/ppk1186_entries.json`) dan/atau bagian FKTP dari
   PNPK terbaru yang relevan.
3. **Field naratif/bacaan (`clue`, `mutiaraEbm`, `catatanRealita`, `panduanResmi`) TIDAK BOLEH
   diubah** hanya demi "cocok" dengan `obatBenar` yang baru dikoreksi — itu memang DISENGAJA
   berbeda (arsitektur pedagogis 3-lapis: EBM-ideal / panduan-resmi / realita-lapangan).

**Catatan penting:** folder `docs/references/` (doen2021/ppk1186/pnpk/ukm) di-`.gitignore`
seluruhnya (kecuali satu file `codex_verify_full.json`) — artinya folder itu **LOKAL-ONLY** di
worktree tempat dokumen ini ditulis, TIDAK ikut ter-clone ke folder kerja Anda! **Anda mungkin
TIDAK punya folder `docs/references/` sama sekali.** Kalau Anda butuh sumber itu (misal untuk
M13 atau adjudikasi obat), Anda perlu ekstrak ulang dari PDF sumber (yang JUGA tidak ada di
git — hanya diunggah user secara manual per sesi) atau minta Dr. Wirayuda unggah ulang.

---

## 4. STATUS MILESTONE — RINGKASAN CEPAT

| Milestone | Status | Catatan |
|---|---|---|
| M0-M9 | ✅ SELESAI | Vertical slice → 67 kasus → IGD → keluarga binaan → ekonomi → Mode Ujian → endgame → Kelas&Dosen → hardening pola-bug-berulang |
| M10 | ✅ SELESAI (semua 4 dimensi) | Audit konsistensi pipeline/bridge-UKP-UKM/NPC/UI-layering |
| M10.5 "Fidelitas Engine & Medis" | ✅ SELESAI, Golden Master ter-tag | Freeze reducer/clinic/scoring, REVISI_ENGINE final di titik itu = 27→28 |
| M10.6 (post-GM CODEX pass) | ✅ SELESAI PENUH | REVISI_ENGINE 28→29→30 |
| M11 "EBM Nuance & Enrichment" | ✅ INTI TERUKUR SELESAI | Fase 1+2, M11.5, process-scoring/stabilisasi, gating anamnesis, dan audit realita FKTP 67/67 selesai; item kreatif 2–6 sengaja ditunda |
| M12 "Aesthetic Pass" | ⏸️ BELUM MULAI | Sengaja dijadwalkan SETELAH M13 (dibalik 2026-07-12) |
| M13 "Full-Scale 144/225 Kasus" | ⏸️ BELUM MULAI | Diformalkan, sengaja dijadwalkan SEBELUM M12 tapi SESUDAH Golden Master (sudah lewat) |
| M14 "Integritas Backend" | ✅ P1 selesai, 14/15 P2 selesai | 2 item P2 sengaja ditunda (§5.7) |

**Total test saat ini: 785/785 hijau, `npm run typecheck` bersih. Baseline `npm audit` saat clone diserahkan: 0 kerentanan.**

---

## 5. PEKERJAAN YANG BELUM SELESAI — INI YANG PALING PENTING UNTUK ANDA

### 5.1 — M11 item 6b: P1.6 (process-scoring) + C.1 (mekanik stabilisasi) — SELESAI 2026-07-13

Status aktual mengalahkan arsip desain di bawah: formula UKP kini memakai **70% outcome + 30%
proses**, tally/migrasi save sudah terpasang, dan stabilisasi oksigen pra-rujuk dinilai pada
`pneumonia_balita` serta `ppok_eksaserbasi`. `mm_gagal_jantung_kongestif` sengaja dikecualikan
karena SpO₂ 92% tidak memenuhi indikasi oksigen rutin; pengecualian dikunci tes. Cap
`stabilisasiTerlewat` final = **69 (C)**, Dex mastery ikut digate, `REVISI_ENGINE` final putaran
ini = **32**, dan hash freeze sudah diperbarui.

<details>
<summary>Arsip desain awal sebelum implementasi (bukan pekerjaan terbuka)</summary>

**P1.6 — Skor proses klinis (bukan cuma outcome) masuk ke UKP.** Saat ini `hitungSkor()`
(`scoring.ts`) dimensi UKP 100% berbasis OUTCOME (akurasi diagnosis+kalibrasi+guillotine+
keselamatan obat) — TIDAK PERNAH membaca `PenilaianEncounter.skorAnamnesis/skorPemeriksaan/
skorTerapi/skorEdukasi` (4 sub-skor 0-100 per-encounter yang SUDAH DIHITUNG di `clinic.ts` tapi
cuma dipakai utk grade per-pasien & `rmLengkap`, tak pernah masuk skor musim UKP). Akibatnya
mahasiswa bisa lewati seluruh proses klinis (anamnesis asal, PF asal) dan tetap dapat UKP tinggi
asal diagnosis akhirnya benar.

**Desain yang sudah saya (Claude) rancang, verifikasi dulu masih relevan sebelum dipakai:**
1. Tally baru di `SkorTally` (state.ts): `sumSkorProses: number` — running sum dari
   `(skorAnamnesis+skorPemeriksaan+skorTerapi+skorEdukasi)/4` per encounter yang di-DISPOSISI,
   diisi di `reducer.ts` PERSIS di titik yang sama dengan `rmLengkap` dihitung (baris ~397-403).
2. Di `scoring.ts`: `const rataProses = t.totalPasien > 0 ? t.sumSkorProses / t.totalPasien : 0`
   (0-100), lalu blend ke kualitas UKP:
   ```
   const kualitasOutcome = 0.75 * akurasi * 100 + 0.25 * kalibrasi   // yang sudah ada
   const kualitasGabungan = 0.7 * kualitasOutcome + 0.3 * rataProses  // BARU
   ukp = clamp((kualitasGabungan/100) * 35 * guillotine - penalti + bonus, 0, 35)
   ```
   Bobot 70/30 adalah USULAN saya (belum diverifikasi user secara eksplisit angka persisnya —
   hanya konsepnya yang disetujui) — pertimbangkan apakah 70/30 pas, atau perlu disesuaikan
   setelah lihat hasil soak-test. **JANGAN takut mengubah angka ini kalau soak-test bilang
   perlu** — sama seperti sesi-sesi sebelumnya berkali-kali mengkalibrasi ulang ambang setelah
   lihat data (lihat §5.1 riwayat kalibrasi IKS/KBK di §9 M10.5).
3. Berlaku untuk KEDUA mode (Karier & Ujian) — tak ada precedent mode-gating khusus untuk
   komponen kualitas-perawatan di formula UKP ini.
4. Field baru masuk `sidikJariPack`? TIDAK PERLU — `sumSkorProses` adalah tally (state), bukan
   field kasus/konten, jadi tak perlu masuk hash konten. TAPI karena ini mengubah formula
   `scoring.ts` (file frozen), tetap WAJIB unfreeze-dance penuh (§3 di atas).

**C.1 — Stabilisasi pra-rujuk jadi mekanik ternilai.** Beberapa kasus gawat (severity tinggi,
`harusDirujuk:true`) sebut oksigen/stabilisasi di `clue`, tapi TIDAK ADA cara menilai apakah
pemain benar-benar melakukannya sebelum merujuk — tak ada tindakan "oksigen" di katalog sama
sekali (`src/content/katalogM3.ts`, `TINDAKAN_M3`).

**Riset yang sudah selesai (investigasi agent terverifikasi 2026-07-13):**
- **3 kasus kandidat kuat, semua `harusDirujuk:true`, semua sudah mengutip oksigen di clue tapi
  tak ada slot skor untuk itu:**
  - `pneumonia_balita` (`kasusKronis.ts`) — clue: "...pneumonia BERAT → beri DOSIS PERTAMA
    antibiotik + oksigen, lalu RUJUK segera". Tak ada field `prosedur` sama sekali.
  - `ppok_eksaserbasi` (`kasusRespGi.ts`) — clue: "...O2 TERKONTROL (target SpO2 88-92%) +
    bronkodilator + kortikosteroid + antibiotik, lalu RUJUK". Sudah punya
    `prosedur:['nebulisasi']` (sudah dinilai) — oksigen SAJA yang belum.
  - `mm_gagal_jantung_kongestif` (`kasusMetabolikMsk.ts`) — clue DAN `panduanResmi` SAMA-SAMA
    eksplisit sebut "oksigen 2-4 L/menit + furosemid" sebagai stabilisasi FKTP pra-rujuk. Tak
    ada field `prosedur` sama sekali (furosemid sudah dinilai sbg obat, tapi cara pemberian
    oksigennya sendiri tidak).
  - (Kandidat sekunder, prioritas lebih rendah: `stroke_iskemik` — soal infus IV, bukan
    oksigen, dan kondisional pada hipoglikemia yang tak terjadi di vignette kasus ini.)
- **Kode ICD-9-CM yang benar untuk terapi oksigen, terverifikasi via web search: `93.96`
  "Other oxygen enrichment"** (bukan `93.98` yang itu hyperbaric oxygenation, beda kode). Sumber:
  ICD9Data.com/AAPC, dikonfirmasi dua sumber independen.
- Katalog `TINDAKAN_M3` saat ini (`katalogM3.ts` baris ~267-276): `ekstraksi_serumen,
  tampon_epistaksis, insisi_abses, hecting_luka, nebulisasi, pasang_infus, ekstraksi_kuku,
  manuver_epley` — TIDAK ADA entri oksigen, dikonfirmasi tak ada penamaan lain (nasal kanul/
  sungkup/non-rebreathing/NRM) di catalog manapun.

**Desain mekanisme (mengikuti pola `konfirmasiWajib` yang SUDAH ADA — baca `clinic.ts` baris
~455-473 dan `reducer.ts` baris ~405-417 sebagai CETAKAN, jangan menciptakan pola baru):**
1. Tambah entri baru ke `TINDAKAN_M3` (`katalogM3.ts`): mis. `oksigen: { id: 'oksigen', nama:
   'Terapi oksigen (nasal kanul/sungkup)', icd9: '93.96', biaya: <tentukan angka wajar,
   bandingkan dgn entri lain (30-75rb)> }`.
2. Field baru di `KasusKlinis` (top-level, `src/content/types.ts`, PERSIS pola `konfirmasiWajib?:
   string` yang sudah ada di baris ~269): `stabilisasiWajib?: string` (id tindakan).
3. Di `clinic.ts` (PERSIS pola `konfirmasiTakTerpenuhi`, baris ~469-473): gerbang ini HANYA
   relevan saat `disposisi==='rujuk'` (framing "pra-rujuk"):
   ```
   const stabilisasiTerlewat =
     enc.disposisi === 'rujuk' &&
     kasus.stabilisasiWajib !== undefined &&
     !enc.tindakan.includes(kasus.stabilisasiWajib)
   ```
4. Tambahkan ke `capGrade` (PERSIS pola `konfirmasiTakTerpenuhi` — cap 69, tier "stewardship/
   kehati-hatian" bukan tier "bahaya langsung 54" karena pasien TETAP dirujuk, RS mengambil
   alih — bukan ditahan/dibiarkan tanpa rujukan sama sekali).
5. Field baru `PenilaianEncounter.stabilisasiTerlewat: boolean`, tally baru `SkorTally.
   stabilisasiTerlewat: number`, di `scoring.ts` beri penalti UKP ringan (usulan: `-1 * t.
   stabilisasiTerlewat`, setara `firewallTerpicu` — silakan sesuaikan kalau menurut Anda
   kurang/lebih tepat setelah lihat soak-test).
6. Pertimbangkan juga menggerbang Dex "kuasai" (`reducer.ts` baris ~417, variabel `kuasai`) —
   pola `konfirmasiTakTerpenuhi` sudah masuk sana (`!nilai.konfirmasiTakTerpenuhi`), pertimbangkan
   menambah `&& !nilai.stabilisasiTerlewat` di baris yang sama untuk konsistensi.
7. **Jangan lupa**: field baru `stabilisasiWajib` di `KasusKlinis` masuk `sidikJariPack`
   (`verifikasi.ts`) — PERSIS pola `konfirmasi: k.konfirmasiWajib ?? null` yang sudah ada.

**Setelah implementasi KEDUANYA (P1.6 + C.1):**
- Ikuti unfreeze-dance lengkap (§3) — ini menyentuh `clinic.ts`/`reducer.ts`/`scoring.ts`/
  `state.ts`/`verifikasi.ts`, semuanya di 16-file frozen list.
- **WAJIB jalankan ulang soak-adversarial** (`src/engine/soakAdversarial.test.ts`, harness 3
  profil speedrunner/teliti/ceroboh sudah ada) untuk cek distribusi grade tak jomplang — ini
  proyek yang SUDAH BERKALI-KALI menemukan kalibrasi meleset lewat cara ini (lihat riwayat IKS
  formula §9 M10.5 — pernah ketemu UKM turun drastis murni krn formula baru, bukan krn skill
  pemain, dan diperbaiki lewat soak-test bukan tebakan).
- Tulis test baru untuk kedua mekanisme (test-first — buktikan test MERAH dulu sebelum fix kalau
  memungkinkan, pola "verifikasi-bergigi" yang konsisten dipakai seluruh proyek ini: stash/revert
  perubahan produksi, konfirmasi test yang relevan gagal PERSIS dgn gejala yang diharapkan, lalu
  restore & konfirmasi hijau).
- Verifikasi live di browser (lihat §8 — harness `vite.preview.config.ts` port 5199) bahwa
  tindakan oksigen baru benar-benar muncul & bisa diklik di tab Tindakan (`DeckTerapi.tsx` —
  render generik dari `PACK.tindakan`, harusnya otomatis muncul tanpa perlu ubah UI).

</details>

### 5.2 — Celah "jembatan percakapan" anamnesis — SELESAI 2026-07-13

Implementasi final memakai gate **ringan-plus**: kategori selain `keluhan_utama` baru terbuka
setelah satu pembuka dijawab, lalu `bukaSetelah` dipakai selektif pada pertanyaan fokus yang
genuinely perlu prasyarat. Kebocoran Papua pada `keluhanUtama` malaria sudah dihapus. Invariant
67/67 mengunci pembuka yang kompatibel gender, prasyarat valid/urut, dan netralitas
`sidikJariPack`; field ini tetap renderer-only dan tidak mengubah skor.

<details>
<summary>Arsip temuan sebelum perbaikan (bukan pekerjaan terbuka)</summary>

**Temuan (dikonfirmasi ganda: laporan CODEX + audit independen 8-agen Claude, keduanya
konvergen):**
- **Struktural (akar masalah, memengaruhi SEMUA 67 kasus):** `DeckAnamnesis.tsx`
  (`src/renderer/src/screens/klinik/DeckAnamnesis.tsx`, baris ~91-121) merender SEMUA kategori
  (`keluhan_utama`/`rps`/`rpd`/`rpk`/`sosial`) dan SEMUA pertanyaan di dalamnya SEKALIGUS sejak
  render pertama fase anamnesis. Satu-satunya gate (`dikunci = tutorialAktif && !disorot`)
  HANYA aktif selama tutorial pasien pertama. Tidak ada progressive-disclosure/prasyarat sama
  sekali. Ditambah `clinic.ts` TANYA handler (baris ~175) tidak mengecek urutan — hanya ID valid
  + belum pernah ditanya. Skor anamnesis (`clinic.ts` baris ~391+) juga TIDAK PEDULI urutan,
  hanya cakupan (rasio esensial + dimensi OLDCARTS tercakup). **Akibatnya, pemain BEBAS mengklik
  pertanyaan paling mengarahkan-diagnosis di kategori manapun sejak detik pertama, tanpa
  konsekuensi skor apa pun.**
- **Konten (2 kasus genuinely rusak — pertanyaan PERTAMA di kategori langsung
  patognomonik, TANPA pembuka netral apa pun):**
  - `disentri_basiler` (`kasusRespGi.ts`) — pertanyaan keluhan_utama pertama: "BAB-nya seperti
    apa? Ada darah atau lendir?" — langsung menyebut pembeda disentri vs diare biasa.
  - `mm_gagal_jantung_kongestif` (`kasusMetabolikMsk.ts`) — 3 pertanyaan rps beruntun (edema,
    nyeri dada, batuk-malam-berbuih) tanpa satu pun pembuka netral.
- **Konten (temuan tambahan Claude, tidak disebut CODEX):** `kia_malaria_falsiparum`
  (`kasusKiaJiwa.ts`) — field top-level `keluhanUtama` (BUKAN bagian menu pertanyaan, tampil
  otomatis sejak ruang tunggu, `RuangTunggu.tsx`) berbunyi "...saya baru pulang kerja dari
  Papua" — riwayat bepergian ke daerah endemis (kunci diagnosis malaria) dibocorkan GRATIS
  sebelum mahasiswa menggali apa pun. Ini soal teks `keluhanUtama`, bukan urutan pertanyaan.
- **Beberapa kasus lain punya pertanyaan agak dini/spesifik tapi masih diperdebatkan** (mis.
  `dengue_df` — pertanyaan rps kedua langsung triad nyeri-belakang-mata/kepala/sendi, meski
  didahului 2 pertanyaan keluhan_utama netral) — audit 8-agen saya menilai ini "aman" (ada
  pembuka), tapi CODEX menilai ini masih terlalu dini. Perbedaan standar, bukan fakta yang
  bertentangan — pertimbangkan sendiri seberapa ketat standarnya.

**PENTING — biaya perbaikan JAUH lebih murah dari kesan pertama:** `sidikJariPack`
(`verifikasi.ts`) TIDAK meng-hash teks `tanya`/`jawab` ATAU urutan array `anamnesis` (array
di-sort by id sebelum hash — reorder = nol perubahan hash). `keluhanUtama` juga sama sekali
TIDAK ada di `sidikJariPack`. Artinya:
- Menata ulang urutan pertanyaan dalam array, menulis ulang `keluhanUtama` yang bocor = **Ember
  Hijau murni**, aman kapan saja, TIDAK PERLU unfreeze/bump REVISI_ENGINE.
- Menambah field opsional BARU ke `PertanyaanAnamnesis` (`types.ts`) untuk gating (mis.
  `bukaSetelah?: string[]` — daftar id pertanyaan yang harus sudah dijawab dulu) — AMAN juga,
  ASALKAN field itu HANYA dibaca oleh renderer (`DeckAnamnesis.tsx`) untuk kontrol
  tampil/disabled tombol, dan TIDAK PERNAH dibaca `clinic.ts` untuk skor. Kalau begitu, field ini
  tidak perlu masuk `sidikJariPack`, dan tidak menyentuh satu pun dari 16 file frozen (types.ts
  BUKAN salah satu dari 16 file itu).

**Rekomendasi saya (belum final — user belum eksplisit memilih di antara opsi ini sebelum
eksperimen ini dimulai, jadi INI KEPUTUSAN TERBUKA untuk didiskusikan/diputuskan, bukan perintah
langsung eksekusi):**
1. Opsi ringan (yang saya sarankan): gate LEVEL KATEGORI, bukan per-pertanyaan — kategori `rps`
   terkunci sampai ≥1 pertanyaan `keluhan_utama` sudah dijawab. Sederhana, tak butuh field baru
   di setiap pertanyaan, cukup 1 baris logika baru di `DeckAnamnesis.tsx` yang mengecek
   `enc.ditanya` beririsan dengan id-id kategori `keluhan_utama` kasus ini.
2. Opsi CODEX (lebih berat): kontrak 3-tahap penuh (pembuka→eksplorasi domain→pertanyaan fokus,
   field `bukaSetelah`/prasyarat per-pertanyaan) — lebih presisi tapi butuh menata ulang metadata
   di semua 67 kasus (atau minimal kasus yang genuinely butuh), bukan cuma logic UI.
3. Minimal yang WAJIB dikerjakan terlepas dari opsi mana yang dipilih: perbaiki 2 kasus rusak di
   atas (tambah 1 pertanyaan netral sebelum yang spesifik) + tulis ulang `keluhanUtama` malaria
   yang bocor riwayat perjalanan.

**JANGAN mulai menulis 152 kasus baru M13 (§5.4) dengan pola penulisan lama sebelum ini
diputuskan** — kalau tidak, masalah yang sama akan tergandakan berkali-kali lipat di kasus baru,
dan memperbaikinya belakangan jauh lebih mahal daripada menetapkan konvensi dulu sekarang. Ini
poin sentral dari laporan CODEX yang memicu investigasi ini — CODEX merekomendasikan "M13-0
Foundation Gate" sebelum produksi massal; saya (Claude) setuju SEBAGIAN (gerbang perlu, tapi
lebih kecil dari yang CODEX bayangkan — lihat detail di atas soal biaya rendah karena Ember
Hijau). **CODEX juga mengusulkan "kontrak regimen terapi terstruktur" (dosis/rute/frekuensi
eksplisit di `resep`) sebagai bagian gerbang ini — TOLAK usulan itu**, itu bertentangan dengan
keputusan yang SUDAH FINAL dari sesi sebelumnya: model abstraksi-tanpa-dosis (`resep: string[]`,
`src/engine/state.ts` baris ~119) SENGAJA dipertahankan, dosis eksplisit SUDAH DITOLAK
(`DEEPTHINK_M10_5_SISA.md` §6, ditandai "sudah final, tak perlu ditriangulasi ulang"). Jangan
buka kembali keputusan itu tanpa alasan baru yang kuat.

</details>

### 5.3 — M11 item 7 selesai; item kreatif 2/3/4/5/6 ditunda terukur

Yang tersisa bukan bug atau acceptance criterion terukur. Dr. Wirayuda bilang item ini "bisa
dimasukkan ke tahap M13 nantinya"; jangan mengarang desainnya tanpa keputusan kreatif baru:

- **Item 2 — Variasi storyline.** Belum dispesifikasi user sama sekali. JANGAN mereka-reka arah
  sendiri — ini butuh input kreatif Dr. Wirayuda dulu.
- **Item 3 — Polish visual.** Juga belum dispesifikasi, DAN kemungkinan tumpang tindih dengan
  M12 (§5.5) yang sudah punya scope lebih konkret (art asset warga/UKM). Tanyakan ke Dr.
  Wirayuda apakah ini sama dengan M12 atau scope terpisah sebelum mengerjakan apa pun di sini.
- **Item 4 — Variasi presentasi penyakit sama.** Supaya kasus yang sama tak terasa identik tiap
  replay (anamnesis/temuan berbeda-beda untuk penyakit yang sama). **PERINGATAN eksplisit dari
  sesi sebelumnya**: ini KEMUNGKINAN butuh mekanik seleksi-konten baru di level director/generator
  encounter (bukan cuma tambah data statis) — kalau begitu, ini lift JAUH lebih besar dari item
  M11 lain, dan wajib di-scope+diflag ke Dr. Wirayuda sebagai proyek tersendiri sebelum mulai,
  bukan diam-diam dikerjakan sbg "polish kecil".
- **Item 5 — Variasi sisi UKM.** Ide boredom-prevention yang sama, diterapkan ke konten
  kunjungan-rumah/kader/posyandu/prolanis. Belum ada desain konkret.
- **Item 6 — Ember terbuka.** "Variasi-variasi lain yang belum terpikirkan" — sengaja tak
  dianggap daftar tertutup.
- **Item 7 — Lapisan kejujuran pedagogis "idealis vs realita FKTP": SELESAI.** Audit sumber
  primer 67/67 ada di `docs/M11_REALITA_FKTP_AUDIT_2026.md`: 14 catatan lama direvisi, 5 gap
  bernilai tinggi ditambah, 1 kasus cukup di `mutiaraEbm`, dan 47 sengaja tidak diberi panel
  agar debrief tidak overload. Fornas yang benar adalah KMK 1199/2025; KMK 730/2025 dikoreksi
  sebagai dokumen nilai klaim PRB, bukan Fornas. Semua perubahan display-only dan dilindungi
  invariant panjang, cakupan, keselamatan, skor, serta fingerprint.

### 5.4 — M13: ekspansi konten skala penuh (144/225 kasus) — DIFORMALKAN, BELUM MULAI

Target: dari 67 kasus saat ini → **144 penyakit kompetensi-4A playable + ~60 kasus wajib-rujuk
(3A/3B/2) + ~20 IGD ≈ 225 kasus total** — butuh **~152 kasus baru**. Diformalkan di
`docs/ROADMAP.md` 2026-07-11 (folder ini mungkin tak ter-clone ke Anda — lihat catatan
`docs/references/` di §3; tapi `docs/ROADMAP.md` sendiri BUKAN gitignored, harusnya ada).

**Sengaja dijadwalkan SETELAH Golden Master (sudah lewat) DAN SEBELUM M12** (dibalik dari urutan
awal 2026-07-12 — M13 dinilai "lebih krusial").

**3 aturan besi dari triangulasi DeepThink (WAJIB dipatuhi kalau Anda mengerjakan M13):**
1. **Kunci engine dulu** — Golden Master sudah beku (§3), JANGAN sentuh 16 file frozen demi
   konten M13 kecuali genuinely perlu mekanik baru (kalau perlu, itu keputusan besar tersendiri,
   bukan side-effect penambahan kasus).
2. **Porting "shell factory" hibrida** — repo lama `D:\Dev\PRIMER\src\` (CONFIRMED masih ada,
   ~250+ kasus, TAPI ini sumber insiden P0 ICD-poisoning yang sama — lihat §2) boleh dipakai
   HANYA untuk shell naratif (nama/usia/keluhan/persona/dialog kronologi) — **KOSONGKAN 100%**
   array dx/lab/terapi/ICD-nya, bangun ulang fakta klinis dari nol berlandaskan PPK1186/DOEN
   (§3 aturan EBM-realistis). JANGAN blind-copy data klinis apa pun dari repo lama.
3. **Peer-review AI-ke-AI berbatch** — 15-20 kasus/hari per batch; ide awal (sebelum eksperimen
   Anda ini dimulai) adalah GPT-5.6 (Anda) jadi filter adversarial LAPIS PERTAMA (cek
   dosis/kontradiksi-SKDI-4A/anomali-logika) SEBELUM draft sampai ke Dr. Wirayuda — dokter jadi
   hakim medis FINAL, bukan pemeriksa pertama. **Karena Anda SEKARANG yang jadi builder
   (bukan cuma filter), pertimbangkan apakah pola ini masih pas atau perlu peran baru** — flag
   ke Dr. Wirayuda, jangan diam-diam mengasumsikan peran lama masih berlaku.

**Menambah kasus baru = Ember Merah** (§3) — mengubah pool director → pengundian bergeser →
replay bergeser. AMAN kalau setiap gelombang konten M13 dirilis sbg versi terpisah DI BATAS
ANTAR-KOHORT (semua mahasiswa re-baseline serentak); TIDAK AMAN kalau disuntik di tengah
semester ke kohort yang sedang dinilai aktif.

**Sub-scope B (variasi epidemiologi regional)** — reweighting Director per zona (urban-PTM /
transisi-zoonosis-malaria / timur-kegagalan-dasar), event KLB musiman via inbox, cabang baru arc
ANC/stunting. Mpox EKSPLISIT DIHAPUS dari papan (risiko stigma kontak-seksual di game
single-player tanpa pengawasan). Detail lengkap (kalau file-nya ter-bawa): `docs/
DEEPTHINK_M13_SKALA_PENUH.md`.

**Sub-scope D "Mode Endurance"** — ide diskusi murni, BELUM diputuskan/dibangun. Estimasi
~88-180 hari (tergantung pacing) untuk kumpulkan ★1 di semua 144 SKDI-4A, memakai mekanisme
"Curriculum Director" pity-timer yang SUDAH ADA (`director.ts`, `susunAntrianHarian`).

### 5.5 — M12: Pass Estetika Penuh — BELUM MULAI

Ganti ilustrasi generik "ruang tamu" (`RumahIlustrasi.tsx`, dipakai identik untuk SEMUA 16
keluarga binaan) dengan aset unik gaya "Telltale/RPG-Maker" (referensi visual novel: portrait
karakter + nama pembicara + kotak dialog di atas ilustrasi interior). Struktural MURAH (alur
`Kunjungan.tsx` sudah berbentuk visual-novel), tapi PRODUKSI ASET mahal (16+ keluarga, solo dev,
tak ada artist in-house).

**Keputusan terbuka yang WAJIB diajukan ke Dr. Wirayuda sebelum mulai apa pun:** AI image
generation (risiko konsistensi gaya lintas-generasi) VS paket aset RPG-Maker/VN
berlisensi/dibeli (gaya konsisten tapi terbatas isi paketnya + perlu izin lisensi komersial).
Peringatan lisensi PERSIS sama kelas dengan insiden BGM Square Enix lama (§9) — kalau gaya
visual terlalu meniru game berhakcipta spesifik (bukan konvensi genre umum), itu risiko hukum.

### 5.6 — UKM sumber riset — 2 keputusan masih terbuka

Decision #1 (modernisasi Posyandu ILP "5 Langkah") SUDAH diimplementasi penuh (2026-07-11,
REVISI_ENGINE 19→20). **Masih terbuka:**
- **Decision #2** — perlu slot field sitasi (`mutiaraEbm`-equivalent) di `KartuKegiatan`/tipe
  keluarga-binaan? Saat ini NOL sitasi EBM/pedoman di seluruh konten UKM (`src/content/
  keluarga/*.ts`).
- **Decision #3** — granularitas Prolanis vs dugaan bahwa program ILP resmi menyerap Prolanis
  ke klaster Dewasa-Lansia (kata "Prolanis" TIDAK PERNAH muncul di dokumen ILP sama sekali).
- Terkait: apakah mengadopsi metode kunjungan-rumah resmi **"SAJI"** (Salam-Ajak bicara-
  Jelaskan&Bantu-Ingatkan, Permenkes 39/2016) yang lebih kaya dari alur 4-babak `Kunjungan.tsx`
  saat ini — belum pernah diajukan ke Dr. Wirayuda sama sekali.

### 5.7 — M14 sisa: 2 item P2 sengaja ditunda (bukan lupa)

- **#20c** — banner status pasca-ROSC IGD — butuh perubahan `nilaiIgd` yang menyentuh REVISI,
  dinilai tak sepadan usahanya, DOKUMENTASI INLINE sudah menjelaskan alasan ini di kode.
- **#21** — pemformatan tanda-kutip dialog Kunjungan — sengaja ditunda sejak §57 lama.

### 5.8 — Konsiderasi lintas-platform (mobile/tablet) — belum mulai, sengaja ditunda

Sebagian mahasiswa target hanya punya tablet/HP, tak punya laptop. Electron TIDAK BISA jalan di
mobile sama sekali — perlu build PWA/web paralel (berbagi `engine/`+`content/` yang sudah murni
TypeScript tanpa dependency Electron) atau app companion `primera-arena` (Supabase-based,
sudah jalan di browser apa pun) dibuat responsive. **User eksplisit minta ditunda** — jangan
mulai tanpa greenlight baru.

### 5.9 — Sisa adjudikasi medis kecil yang belum pernah diputuskan

- **M2 #11** — kode Widal/GAS/K29.7 — belum pernah disentuh sama sekali.
- **M6 residual** — 6 kode ICD kurang-spesifik (dari audit ICD-10 67 kasus) — condong dibiarkan,
  tapi belum keputusan final eksplisit.
- **PNPK Tier-2 (10 item)** — celah cakupan (bukan jawaban salah, cuma penyakit yang belum ada
  kasusnya) — sudah diarahkan jadi backlog kandidat kasus M13, bukan tugas cross-check aktif.
- **desaF:995** — status implementasi TIDAK JELAS dari catatan sejarah (rekomendasi "pisahkan
  baris Fe dari negosiasi KB suami" pernah dicatat sbg "condong dikerjakan" tapi tak ada
  konfirmasi commit eksplisit) — **VERIFIKASI DULU status kode saat ini di `src/content/
  keluarga/desaF.ts` sebelum mengasumsikan sudah/belum diperbaiki.**

---

## 6. KETEGANGAN PENTING YANG WAJIB ANDA SADARI — PERAN ANDA (CODEX)

Sepanjang riwayat proyek ini, CODEX (Anda) SELALU dipakai **read-only/report-only** — audit kode
mandiri, laporkan temuan, JANGAN pernah otomatis memperbaiki sendiri. Ini BUKAN kebetulan: pada
2026-07-11 Dr. Wirayuda sempat diminta menyetujui mode "CODEX auto-fix di background", lalu SATU
GILIRAN kemudian membatalkannya sendiri ("matikan saja... saya takut juga") — keputusan
risk-aversion sadar, bukan koreksi kerja buruk. Alasannya eksplisit: kegagalan mode ini bisa
merusak integritas Dossier ber-HMAC mahasiswa & engine skor yang sudah dibekukan.

**Eksperimen SEKARANG ini berbeda secara sengaja** — Dr. Wirayuda secara eksplisit ingin mencoba
Anda sebagai BUILDER, bukan sekadar auditor, TAPI hanya di folder terisolasi ini (§0), terpisah
total dari cabang produksi asli. Jangan bingung: ini bukan pembatalan kebijakan read-only lama
di proyek NYATA — itu tetap berlaku di sana. Di SINI, di folder eksperimen ini, Anda memang
diminta menulis kode.

**Yang tetap harus Anda pertahankan meski sekarang jadi builder** (disiplin yang sudah terbukti
berkali-kali menyelamatkan proyek ini dari kesalahan):
- **JANGAN PERNAH percaya klaim (dari laporan audit siapa pun, termasuk laporan Anda sendiri di
  masa lalu, atau dari memory/dokumentasi lama) tanpa verifikasi ulang terhadap kode NYATA saat
  ini.** Pola paling sering terjadi di proyek ini: sebuah temuan "sudah selesai" ternyata belum
  ter-commit, atau klaim berlebihan/meleset detail meski akar masalahnya benar. Selalu baca kode
  aktual sebelum bertindak.
- **JANGAN mengarang/menebak fakta medis.** Setiap keputusan kunci-jawaban klinis WAJIB
  digrounding ke sumber (DOEN/PPK1186/PNPK/WHO/dsb, §3 aturan prioritas) dengan kutipan presisi,
  bukan diingat dari pelatihan umum tanpa verifikasi.
- **Keputusan desain/medis/pedagogis yang genuinely butuh judgment manusia → USULKAN opsi ke Dr.
  Wirayuda, JANGAN putuskan sendiri.** Ini pola operasi proyek ini SEJAK AWAL — DeepThink
  mengusulkan, Claude memverifikasi & triase, Dr. Wirayuda mengadjudikasi final. Anda mengambil
  peran serupa sekarang: usulkan dengan opsi+tradeoff jelas, tunggu keputusan, JANGAN
  berasumsi Anda tahu jawaban "benar"-nya.
- **Selalu test-first + verifikasi-bergigi** (§8) — jangan klaim "selesai" tanpa test merah→hijau
  yang benar-benar dibuktikan gagal dulu dgn gejala yang tepat.
- **Jangan mengubah `clue`/`mutiaraEbm`/`catatanRealita`/`panduanResmi` sebagai efek samping**
  koreksi jawaban skor — itu lapisan bacaan yang sengaja berbeda (§3).

---

## 7. DISIPLIN VERIFIKASI & QA YANG WAJIB DIIKUTI

1. **Test-first / "verifikasi-bergigi"**: sebelum klaim sebuah fix benar, buktikan dulu test yang
   relevan GAGAL dengan gejala yang PERSIS sama dengan bug yang diklaim (via `git stash`/revert
   sementara perubahan produksi, atau nonaktifkan guard baru), baru kembalikan fix & buktikan
   hijau. Ini pola yang dipakai KONSISTEN di seluruh riwayat proyek ini, jangan menyimpang.
2. **Full suite + typecheck bersih SEBELUM menganggap apa pun selesai:**
   ```
   npx vitest run          # harus 785/785 (atau lebih, kalau Anda menambah test)
   npm run typecheck        # tsc --noEmit, harus nol error
   ```
3. **Kalau menyentuh salah satu 16 file frozen** → unfreeze-dance PENUH (§3), tanpa kecuali.
4. **Kalau mengubah formula skor** (`scoring.ts`/`clinic.ts`) → jalankan ulang
   `src/engine/soakAdversarial.test.ts` (harness sudah ada, 3 profil × 2 mode × N seed), cek
   invarian `teliti ≥ speedrunner ≥ ceroboh` tetap bertahan, dan distribusi grade tak jomplang
   ekstrem. Proyek ini berkali-kali menemukan kalibrasi meleset lewat cara ini, bukan tebakan.
5. **Verifikasi UI/live-gameplay via browser, JANGAN cuma percaya kode/test unit untuk bug
   visual/interaksi.** jsdom (dipakai test komponen) TIDAK render CSS/scroll/layout sungguhan —
   banyak bug proyek ini (fokus dicuri, elemen tertimpa, scroll-jump) HANYA kelihatan lewat
   browser sungguhan. Ada harness KHUSUS untuk ini yang tak butuh Electron:
   ```
   npx vite --config vite.preview.config.ts    # port 5199, browser biasa, window.primer di-stub
   ```
   Ini adalah cara TERCEPAT untuk memutar state game (via Zustand store asli) tanpa perlu klik
   manual satu-satu — bisa fast-forward state lewat `dispatch`/`window.__gameStore` dari
   JavaScript console kalau perlu reproduksi state spesifik.
6. **Kalau butuh sungguhan menjalankan Electron** (bukan sekadar cek UI): `npm run dev`.
7. **Build & deploy** (JANGAN jalankan `robocopy` ke `D:\Games\PRIMERA - Puskesmas Pagi` — itu
   instalasi produksi asli Dr. Wirayuda, bukan milik eksperimen Anda):
   ```
   npm run pack             # → dist/win-unpacked/ (exe bisa dites lokal di folder Anda sendiri)
   ```
8. **Jangan pernah push ke `master`/`claude/vigorous-bose-f66bc6`** di remote GitHub bersama
   (§0). Kerja Anda di `codex-gpt56-experiment`.

---

## 8. HAL-HAL SPESIFIK YANG SUDAH TERBUKTI JADI JEBAKAN (jangan ulangi)

- **CRLF vs LF**: working tree ini CRLF (Windows), tapi git blob/CI menyimpan LF
  (`.gitattributes` `* text=auto eol=lf`, scoped ke `primera-desktop/` saja). Kalau menulis
  skrip yang menyisipkan teks ke file (bukan lewat Edit tool biasa), WAJIB jaga `\r\n` literal —
  regex/insersi yang tak hati-hati bisa menghasilkan diff yang membengkak ke SELURUH file.
- **`save.ts` "container dicek, isi-entri belum"** — pola bug paling BERULANG di proyek ini:
  setiap kali field nested baru ditambah ke `GameState`, validasi level-KONTAINER (mis. "apakah
  ini array?") sering lupa validasi level-ENTRI (mis. "apakah setiap elemen array ini punya
  shape yang benar?"). Kalau Anda menambah field state baru, PIKIRKAN validasi entri-nya
  sekaligus, jangan tunggu ronde audit berikutnya menemukannya.
- **Disable tombol yang sedang fokus → browser paksa fokus ke `<body>`** — baru diperbaiki hari
  ini (2026-07-13) di `DeckTerapi.tsx`/`DeckPemeriksaan.tsx` (tombol "+Resep"/"Pesan" yang
  langsung `disabled` begitu diklik, sebelum ada fix eksplisit memindah fokus balik ke kotak
  cari). Kalau menambah tombol baru yang jadi disabled tepat setelah diklik (pola umum di UI ini
  — checklist/pesan-sesuatu), WASPADAI kelas bug yang sama.
- **Anamnesis: hindari membundel >2 fakta ke satu tombol** (§5.2) — pola "checklist soal" bukan
  percakapan klinis natural.
- **Dokumentasi lama proyek PENDAHULU (`PRIMER_BIBLE.md`/`AGENT_CONTEXT.md`, kalau Anda
  menemukannya) berisi klaim BASI soal codebase LAMA yang sudah dormant** — jangan pernah
  bertindak atas klaim dokumentasi tanpa verifikasi grep/baca kode aktual dulu. Prinsip umum:
  **percaya kode, bukan dokumen**, kalau ada konflik.
- **`docs/references/` TIDAK ikut ter-clone** (§3) — kalau Anda "yakin" pernah baca sesuatu dari
  DOEN/PPK1186/PNPK di riwayat memori/percakapan tapi filenya tak ada di folder Anda, itu tanda
  Anda perlu minta sumbernya diunggah ulang, BUKAN mengarang isinya dari ingatan.

---

## 9. RIWAYAT PADAT M0-M14 (untuk konteks, jangan re-derive dari nol)

*(Bagian ini SANGAT dipadatkan dari puluhan sesi kerja sebelumnya. Kalau Anda perlu detail lebih
dalam soal satu milestone tertentu, `git log --oneline` di repo ini penuh commit dengan pesan
deskriptif per-temuan, dan `docs/*.md` — kalau ter-bawa dalam clone Anda — berisi dossier lengkap
per-ronde audit. Jangan buang waktu re-audit area yang sudah dinyatakan "SELESAI" di bawah tanpa
alasan baru yang konkret.)*

- **M0-M5**: vertical slice → bridge UKM↔UKP → program UKM terjadwal → 67 kasus rujukan
  berjenjang (SISRUTE/PRB) → IGD+kalender musim → keluarga binaan 6→16+KIA/ANC → ekonomi/
  manajemen (stok obat, laporan bulanan, akreditasi D60) → Mode Ujian 30-hari (arsitektur
  dual-seed) → endgame (Laporan Akhir, 9 badge, save slot).
- **M6**: Kelas & Dosen — jurnal aksi (`state.jejak`) + `verifikasiDossier()` replay + HMAC
  Dossier Mahasiswa.
- **M7**: UX edukasi (taksonomi kategori, kuota 3-topik prioritas, formula skor edukasi),
  onboarding Hari-1, Pengaturan, audit bahasa-pasien total (jargon dokter dihapus dari mulut
  pasien), phase-guard engine sungguhan, harness test komponen React. Playtest manusia
  menemukan bug UX yang tak tertangkap test (scroll-viewport, lab-catalog near-duplicate).
- **M8**: PRIMERA Arena — companion multiplayer terpisah (`primera-arena/`, Supabase, belum
  ada proyek Supabase sungguhan dibuat — realtime belum teruji end-to-end).
- **M9**: hardening pola-bug-berulang — kunci tutorial menyeluruh (test invarian "tepat 1 tombol
  aktif" di setiap fase), audit SKDI otoritatif (Kepmenkes 1186/2022 = sumber "144 FKTP" yang
  benar, BUKAN SKDI-2012-umum), sapuan tatalaksana-vs-clue.
- **M10**: audit konsistensi 4 dimensi — pipeline penyakit (semua 67 kasus, semua fase), bridge
  UKP↔UKM (9 titik penjadwalan pasien-kembali diverifikasi identitas konsisten), NPC/warga
  (nama tak tabrakan, persona konsisten), UI/UX layering (z-index/focus-trap/kontras — banyak
  ronde CODEX, semua closed). **Pola berulang penting yang ditemukan lewat pengalaman**: klaim
  "tuntas" SERING difalsifikasi audit independen berikutnya yang mencari sudut berbeda — jangan
  anggap "selesai" sebagai fakta permanen, anggap "selesai per metodologi yang dipakai saat itu".
- **M10.5 "Fidelitas Engine & Medis"**: SEMUA fix yang mengubah semantik skor/replay ATAU
  mengoreksi kebenaran medis, menuju SATU Golden Master. Termasuk: cross-check PPK1186/PNPK vs
  konten (banyak koreksi obat/dosis/ICD), aturan EBM-realistis (DOEN-dulu, §3), formula IKS
  resmi Permenkes 39/2016, gerbang konfirmasi-lab wajib (TB/malaria), gerbang edukasiKritis→
  rmLengkap, stabilisasi IGD pasca-ROSC (fase baru `pasca_rosc`), TACC rujukan-terjustifikasi,
  `freeze.test.ts` dibangun, tag `golden-master-m10.5` dibuat (REVISI_ENGINE 27→28 di titik itu).
- **M10.6**: audit CODEX pasca-tag-GM sendiri menemukan 20 temuan baru (termasuk beberapa yang
  cukup serius — `obatBerbahaya`/`firewallTerpicu` ternyata TIDAK PERNAH masuk skor formal
  meski sudah ada sejak lama; IGD post-ROSC dead-end; freeze cakupan kurang; CRLF/LF false-fail
  risk) — SEMUA 20 (9 gated fix utama + 11 lanjutan/leftover) sudah dieksekusi, REVISI_ENGINE
  28→29→30. **Tag `golden-master-m10.5` TIDAK PERNAH dipindah lagi setelah ini** (lihat §3 —
  M10.6 berakhir di 30; setelah implementasi M11 terukur, REVISI_ENGINE aktual=32 adalah sumber
  kebenaran, bukan nama tag).
- **M11**: inti yang terukur SELESAI — Fase 1/2, M11.5, process-scoring/stabilisasi,
  gating anamnesis ringan-plus, dan audit realita FKTP 67/67. Item kreatif 2–6 tetap tercatat
  sebagai pengayaan opsional yang perlu scope/desain baru, bukan blocker M13.
- **M14**: 25 temuan CODEX soal integritas save/autosave/telemetry/verifier/a11y. P1 (10 item,
  paling serius — skor pasca-tamat sebenarnya belum terkunci, race condition save, dsb) SELESAI.
  14/15 P2 selesai, 2 sengaja ditunda (§5.7).

---

## 10. KONTEKS TAMBAHAN — jangan sampai bingung sama hal-hal berikut

1. **Ada 2 codebase "PRIMER" yang TIDAK ADA HUBUNGANNYA sama sekali**: `D:\Dev\PRIMER\src\`
   (React/Zustand/Supabase, versi WEB LAMA, dormant sejak 2026-04-27 — pernah punya insiden P0
   ICD-poisoning yang sudah di-resolve TAPI datanya tetap tak dipercaya utk porting mentah) vs
   `primera-desktop/` (Electron, TypeScript, versi SEKARANG yang aktif, mulai dari nol
   2026-07-02). Kalau Anda menemukan dokumen/memory yang menyebut "PRIMER" tanpa embel-embel,
   cek konteksnya dulu — bisa jadi itu soal versi lama yang tak relevan.
2. **`primera-arena/`** — companion multiplayer terpisah (folder sibling `primera-desktop/`,
   SATU git repo yang sama), berbasis preseden game "Sistema" (JKN, Supabase Postgres-Changes,
   sudah terbukti dimainkan 48 mahasiswa & dipuji) — proyek Arena belum ada Supabase project
   sungguhan, jadi belum teruji realtime end-to-end. Di luar scope dokumen ini kecuali Anda
   memang diminta mengerjakan M8 lanjutan.
3. **Sistem watchdog internal `megalog`** (`scripts/primera/`) — itu MILIK codebase LAMA
   (`D:\Dev\PRIMER\src\`), BUKAN `primera-desktop`. Jangan bingung mencari `npm run megalog` di
   sini, itu tak ada di proyek aktif.
4. **HAKI**: `EC002026019623`, nama resmi terdaftar "PRIMER: Primary Care Manager Simulator"
   (`metadata.ts` — JANGAN diubah, itu string legal, beda dari nama tampilan "PRIMERA").

---

## Ringkasan tindakan yang disarankan (urutan prioritas, bukan perintah kaku)

1. Baca dokumen ini SELURUHNYA (sudah Anda lakukan kalau sampai di sini).
2. Jalankan `npx vitest run` + `npm run typecheck` di folder Anda untuk konfirmasi baseline
   masih hijau (sudah diverifikasi hijau saat diserahkan, tapi konfirmasi ulang tak ada
   ruginya).
3. Kerjakan §5.1 (P1.6 + C.1) — sudah disetujui Dr. Wirayuda, sudah didesain, tinggal
   diimplementasi+diverifikasi.
4. Diskusikan/putuskan pendekatan §5.2 (gating anamnesis) sebelum M13 mulai — opsi sudah
   diberikan, tinggal dipilih atau diusulkan alternatif.
5. Untuk apa pun di luar itu (M11 sisa, M12, M13, M14 sisa) — JANGAN mulai tanpa mengonfirmasi
   greenlight & scope dulu ke Dr. Wirayuda, ikuti pola operasi proyek ini: usulkan opsi,
   tunggu keputusan, baru bangun.

Selamat bekerja. Semoga eksperimen ini menghasilkan sesuatu yang berguna untuk diceritakan
kembali ke Dr. Wirayuda dan sesi Claude berikutnya.
