# PRIMER — Dossier Triangulasi DeepThink: Audit Integritas + Redesign Menyeluruh

> **Tujuan dokumen**: Memberi AI penilai (Gemini DeepThink — atau Grok/Claude Opus sebagai triangulasi) konteks LENGKAP atas seluruh diskursus redesign PRIMER yang terjadi dalam satu sesi kerja intensif, agar ia bisa men-*triangulasi*: mengkonfirmasi, menantang, atau membongkar kesimpulan yang sudah diambil — bukan mengulang dari nol.
> **Waktu**: 16 Juni 2026. **Perubahan konteks penting**: rilis Juni 2026 **DIBATALKAN**; redeploy semester berikutnya, kemungkinan **September 2026** (runway bertambah ~3 bulan).
> **Pertanyaan-meta**: "Setelah audit menemukan bahwa lapisan penilaian & gamifikasi PRIMER sebagian besar *teater* (mekanik anti-curang mati, ~46% skor gratis, leaderboard bisa dipalsukan, panel UKM hampa), apakah arsitektur redesign yang kami putuskan (engine murni server-authoritative + identitas 'Puskesmas Pagi' + PWA + dua-app multiplayer ala Sistema) adalah jalan yang benar, atau ada blindspot fatal?"

---

## 0. CARA PAKAI & LEGENDA KEYAKINAN

Reviewer: baca dossier ini penuh, lalu jawab super-prompt di `docs/deepthink_prompt_triangulasi.md`. **Jangan minta info tambahan** — buat asumsi eksplisit lalu lanjut.

Tiap klaim teknis ditandai tingkat keyakinan:
- **[V]** = diverifikasi langsung di kode oleh Claude (file:line dibaca sendiri).
- **[A]** = temuan agen audit dengan sitasi file:line, belum diverifikasi-ulang baris demi baris oleh Claude.
- **[D]** = keputusan desain (opini panel, bukan fakta kode).

Identitas proyek dasar (stack, target, konten) ada di `docs/deepthink_dossier_gamification.md` — **dossier ini melengkapinya, bukan menggantikannya.**

---

## 1. IDENTITAS RINGKAS + PERUBAHAN KONTEKS

- **PRIMER** = game edukasi simulasi dokter Puskesmas untuk ~50 mahasiswa FK Indonesia. React 19 + Zustand (9 slice) + Supabase + Vite + Three.js + Dexie. v0.8.5. Pengembang tunggal: Dr. AAB Wirayuda (dokter + dosen).
- **Pemain** = dokter baru (PTT/internsip) mengelola Puskesmas desa selama "stase" 90 hari, menjalankan **UKP** (klinis: EMR, SKDI-144, ICD-10, Fornas, rujukan SISRUTE, IGD) + **UKM** (komunitas: 200 KK, 12 indikator PIS-PK/IKS, home visit, COM-B/TTM, Posyandu, Prolanis, outbreak).
- **Dipakai**: hybrid lab kampus + rumah (cloud-save resume), projektor di kelas, WiFi kampus labil.
- **⚠️ PERUBAHAN**: target rilis **geser Juni → ~September 2026**. Implikasi: pekerjaan integritas + redesign UI/UX + mode multiplayer kelas kini realistis dilakukan **berurutan dan benar**, bukan ditambal terburu-buru.
- **Preseden penting**: pengembang yang sama membuat **Sistema** (game JKN multiplayer kelas), dimainkan 48 mahasiswa 11 Juni 2026, **dipuji**, HAKI terdaftar. Sistema jadi rujukan utama untuk arah multiplayer (lihat §5).

---

## 2. PETA DISKURSUS (seluruh pergumulan, dari awal)

Urutan sesi kerja ini — supaya DeepThink paham bagaimana kesimpulan terbentuk:

1. **Cek + review pekerjaan terakhir** (paket gamifikasi M1–M8: skor 4-dimensi, endpoint 90-hari, pacing, monthly debrief, feature unlock, onboarding, badge, Dosen Dashboard). → Audit independen menemukan rot integritas (§3).
2. **"Kalau diberi izin merombak total, apa yang kamu lakukan?"** → Panel desain (5 lensa + kritik + sintesis) menghasilkan **manifesto gameplay** (§4.1–4.2): jangan rebuild core klinis; perbaiki integritas skor dulu; jadikan single-player sim longitudinal yang jujur.
3. **UI/UX, art, platform, multiplayer + perkenalan Sistema** → Panel desain kedua → **manifesto bentuk** (§4.3–4.6): identitas "Puskesmas Pagi", PWA, dua-app, PRIMER Arena.
4. **"Harus HTML? world map poor di web?"** → Klarifikasi platform (§4.5): web bukan penyebab; ini soal art direction + tiga renderer bersaing. PRIMER itu **Football Manager, bukan The Sims**.
5. **"Avatar bisa jalan-jalan? RoK-style social/trading? periksa gamifikasi panel UKM"** → Audit UKM (§3.4) + verdict avatar/RoK (§4.5–4.6): avatar walkable = north star sah TAPI setelah panel diperbaiki; RoK MMO = jebakan, energinya dialihkan ke Arena.
6. **(sekarang)** "Buat dossier triangulasi ke Gemini DeepThink" → dokumen ini.

---

## 3. TEMUAN AUDIT TERVERIFIKASI (bukti)

### 3.1 Integritas skor — **lapisan anti-curang sebagian besar MATI**

Header `scoringEngine.js` membanggakan desain anti-min-max (Referral Guillotine + Apathy Penalty + Fainted Penalty). Realitanya:

| Temuan | Bukti | Keyakinan |
|---|---|---|
| **Apathy Penalty = dead code.** Branch submission-kosong menulis `combDiagnosis` (b kecil) | `BehaviorCaseEngine.js:273` vs reader `comBDiagnosis` di `scoringEngine.js:134`; field juga tak pernah masuk clinical history → `countApathyEvents` selalu 0 | **[V]** |
| **Fainted Penalty = dead code.** `faintedCount` dibaca, tak pernah ditulis di mana pun | `scoringEngine.js:214` baca; grep seluruh store: 0 penulisan | **[V]** |
| **~46/100 poin GRATIS saat fresh start.** Keluarga spawn sehat (kkSehat ~10/15), reputasi default 80 (Resilience ~12/15), akreditasi auto-Utama dari reputasi (Management ~12/15) | `VillageRegistry.js` baseline; `GameCore.js` reputation 80; `checkAccreditation` di `createClinicalSlice.js` | **[A]** |
| **Badge SKDI mencatat kunci jawaban tanpa gate kebenaran** | `recordLifetimeCase` di `createClinicalSlice.js:838` fire pada `action==='treat'`, log `trueDiagnosisCode` | **[A]** |
| **Test anti-min-max tautologis** — inject bentuk data yang tak pernah diproduksi game; hijau sementara fitur inert | `scoringEngine.test.js:111`, `scoringExploitProfiles.test.js:90` | **[V]** |

Satu-satunya anti-cheat yang **berfungsi**: Referral Guillotine (RRNS>5% memotong UKP) **[V]**. Catatan pedagogis: Guillotine apa adanya bisa mengajarkan "jangan pernah merujuk" — perlu confidence-tagging agar merujuk SKDI-1/2 dengan tepat = gerakan ahli berskor tinggi **[D]**.

### 3.2 PIS-PK / IKS — **mengajari angka yang salah**

| Temuan | Bukti | Keyakinan |
|---|---|---|
| **Override `iksScore` selalu kena**: tiap keluarga di-stamp `iksScore` saat start, memendekkan breakdown PIS-PK kanonik (`breakdown:[]`) | `pisPkIndicators.js:266`; di-stamp `createOrchestratorSlice.js:152` | **[A]** |
| **Akibatnya `indicatorCoverage` (top/bottom indikator) render KOSONG** di MonthlyDebrief, PisPkCoverageChart, MainLayout | konsumen panggil tanpa `forceRecompute` | **[A]** |
| **Dua metodologi IKS bertabrakan**: override 69% vs kanonik 56% — mahasiswa lihat angka inflasi yang salah | terukur di data desa produksi | **[A]** |
| **Deviasi Permenkes 39/2016**: TB & ODGJ pakai `appliesTo: ()=>true` (harusnya kondisional "N" bila tak ada penderita); `jentik` (official:false) diam-diam masuk headline | `pisPkIndicators.js:132,150,194` | **[V]** |

### 3.3 Keamanan — **leaderboard bisa dipalsukan (TEMUAN BARU)**

- Skor leaderboard **dihitung di klien** (`calculatePerformanceScore(gameState)`) lalu di-`upsert` langsung ke tabel `leaderboard` — **tanpa rekomputasi server**. `CloudSaveService.js:30` (hitung), `:93-101` (upsert). **[V]**
- `GameIntegrity.js` (SHA-256 dengan salt yang dibundel) **tidak di-import** di CloudSaveService → tidak menggerbangi upsert apa pun. **[V]**
- Eksploitabilitas penuh bergantung pada **RLS policy tabel `leaderboard`** (belum dibaca). Tapi karena skor di-authoring klien, kecuali RLS memblok semua tulisan klien (tidak, karena klien menulis barisnya sendiri), **ranking bisa dipalsukan via devtools**. → **Konsekuensi:** leaderboard apa pun TIDAK boleh dirilis sebelum skor dipindah ke server. ⚠️ MEDICAL/ASSESSMENT INTEGRITY.

### 3.4 Gamifikasi UKM — **spektakuler di kulit, hampa di mekanik**

Verdict audit: **as a GAME D+/C−, as PEDAGOGY C+/B−**. Temuan struktural:

| Temuan | Bukti | Keyakinan |
|---|---|---|
| Mayoritas "game" UKM = **pilihan-ganda jawaban-tunggal + juice**. Diagnosis COM-B "Crazy Wall" sebetulnya **2-dari-6 jawaban unik**; benang merah `<path>` statis tak menyambung apa-apa | `BehaviorCasePanel.jsx:282,301` | **[A]** |
| **Mekanik terbaik = DEAD CODE**: `MiniGamePanel`+`MiniGameLibrary` (hidden-object berwaktu, baca-ekspresi) di-import tapi **tak pernah dirender** | `BehaviorCasePanel.jsx:25,27`; 0 `<MiniGamePanel>` di repo | **[A]** |
| **Dua engine UKM bersaing** (BehaviorCasePanel vs CommunityDiagnosisPanel), tampilan & scoring beda; yang kedua = 6 dropdown 5W1H | `WilayahPage.jsx:1087,1116` | **[A]** |
| **Dua generasi tiap fasilitas, yang lama masih shipping**: `PosyanduModal` (klik→confetti) orphaned vs `PosyanduActivePanel`; home-visit default = **checklist "Kunjungan Cepat (Lama)"** (~2.400 klik identik untuk "menang" desa); Prolanis "Pantau Obat"/"Senam" = buff gratis 1-klik | `WilayahPage.jsx:365,811`; `ProlanisPanel.jsx:264` | **[A]** |
| **Centerpiece COM-B wheel = read-only poster** (`onSelectBarrier` tak dipasok di jalur live) | `EliteCOMBWheel.jsx:44,161`; `CommunityDiagnosisPanel.jsx:154` | **[V]** parsial |
| **200 keluarga = 7 skenario**; InvestigationPhase baca field (`defenseThreshold`/`npcLine`) yang tak ada → semua terasa identik | `behaviorCaseRuntime.js:77`; field absen di `DiseaseScenarios.js` | **[A]** |
| **Peta tak menunjuk aksi bermakna**: rumah berkasus-bagus tampak sama dengan 199 rumah checklist; 6 layer overlay menambah beban | `WilayahPage.jsx:408-416` | **[A]** |

**Yang bagus (dipertahankan):** triase Posyandu + stamping KMS + cold chain (judgment nyata, `PosyanduActivePanel.jsx:210`); fase intervensi **budget+trust+backfire** (satu-satunya tension nyata); **Procedural Snark** + bottleneck diagnosis→intervensi (`BehaviorCaseEngine.js:383,585`); jembatan UKM→UKP; biaya perjalanan home-visit spasial (`homeVisitTravel.js:34`); chart PIS-PK worst-first sebagai to-do.

---

## 4. KEPUTUSAN DESAIN YANG SUDAH DIAMBIL (untuk di-challenge)

### 4.1 Identitas produk + 5 pilar [D]
**Komit ke SATU sim Puskesmas longitudinal single-player** (bukan roguelike, bukan sandbox SEIR hidup, bukan esport). Core klinis sakral/beku. Pilar:
1. Setiap angka diperoleh, atau ia tidak ada.
2. Ajari kedokteran yang benar atau jangan ajari apa-apa.
3. Konsekuensi scripted+tervalidasi+bernama (Golden Loop `ukpBridge`), outcome tetap probabilistik.
4. Firewall mata uang: tak pernah bisa membeli jawaban benar; meta-progression hanya referensi/akses/kosmetik.
5. Kirim *wiring*, bukan engine baru.

**Fitur signature gameplay:** Peta Penguasaan SKDI (ledger Leitner-lite spaced-repetition, "game tahu kelemahanmu, mengirim pasien itu lagi", lantai ≥30% never-seen); Golden Loop bernama (Bu Wulan vertical slice); Laporan Akhir Stase yang lantang (count-up, delta vs baseline); Galeri Badge + Debrief PIS-PK kanonik.

### 4.2 KEYSTONE teknis [D] — yang menyatukan semuanya
`ConsequenceEngine.js` + `ClinicalReasoning.js` **sudah murni** (nol import React/Zustand/Three/Dexie) **[A]**. Maka:
> **Ekstrak `@primer/engine`** (engine + validator SKDI-144/ICD-10/Fornas/allergy + deterministicRandom) sebagai paket berversi (contract-test gagal-build kalau ada import React/Zustand) → **pindah scoring ke Supabase Edge Function** yang menurunkan ulang skor dari **action log** → **RLS-deny semua tulisan klien ke leaderboard**.

Satu langkah ini: menutup lubang forgery (§3.3), memenuhi pilar integritas, membuat Arena murah & bebas-drift, **dan** memberi engine yang sama untuk **paper fallback**. Satu engine, empat runtime (browser/Node/Edge/kertas), dua app, nol drift klinis. **Ini "the one thing".**

### 4.3 Art direction: "Puskesmas Pagi" [D]
Buang cosplay sci-fi (font Audiowide/Orbitron, kursor FF8, string "AEGIS OVERWATCH", pasien disebut "entities"). Jangan ayun ke abu-abu steril (matikan moat kehangatan desa) atau kartun Two Point (matikan kredibilitas). Satu identitas hangat-humanis-Indonesia + disiplin klinis:
- Palet: `Daun` #0E8A6B (evolusi emerald) · `Kertas` #FAF6EF · aksen `Kunyit` #D9822B (dari palet VillagerAvatar) · merah hanya untuk bahaya. Dark = `Malam` #14201C hangat.
- Font: Plus Jakarta Sans (display) + IBM Plex Mono (HUD instrumen saja).
- **5 tema → 2 mode** (Pagi/Malam) + opsi high-contrast. Akar drift: token dikonsumsi 0 komponen sementara **764 ternary `isDark`** jadi theme engine → fix: `tokens.css` nyata yang benar-benar dikonsumsi.
- Nol aset baru: VillagerAvatar (prosedural, hijab/peci) dikanonisasi; motif batik kawung di slot bg-pattern yang ada.

### 4.4 UI/UX [D]
Tokens-first; bangun `components/ui` (Button/Card/Modal/Field/Tabs/EmptyState, hanya baca token) lalu migrasi **surface ramai saja** (modal + ~28 CTA + dashboard), ekor 124 komponen oportunistik. Re-register bahasa (string sci-fi → Laporan Mutu/pasien/Indikator). **Dahulukan kata kerja**: footer Tuntaskan/Rujuk selalu terlihat; kartu Golden Loop dengan delta bernama. Demosi KPIDashboard → tab "Rapor" (bukti-untuk-refleksi). Demosi Smartphone iOS → Inbox slide-in. Grup menu di bawah **KLINIK (UKP)/DESA (UKM)**.

### 4.5 Platform/format [D]
**Web/PWA, titik. Bukan Tauri, bukan native engine.**
- **Mitos dibongkar**: "world map poor karena HTML" KELIRU. Penyebabnya: **tiga renderer peta bersaing** (diorama Three.js dengan sprite PNG flat = uncanny valley; blueprint 2D militer; `PixelSceneRenderer` Canvas pixel-art yang bagus tapi cuma interior) + tak ada art direction komit.
- **Reframe menentukan**: PRIMER itu **Football Manager (management-sim data-dense), bukan The Sims (dunia 3D jelajah)**. FM membuktikan kamu tak butuh peta dunia indah — kedalaman ada di keputusan & data, yang justru sweet-spot web. ~80% PRIMER = data-UI; mengoptimalkan platform demi 20% peta = terbalik.
- **Pindah ke game engine (Godot/Unity)** = rewrite total 124 komponen + EMR (engine game lebih buruk untuk form/teks) + hilang deploy QR instan + hilang model Sistema = 1-2 tahun, menghancurkan moat. **Tolak.**
- **Three.js**: keep tapi mode-gated (lazy chunk + 2D fallback + size-limit CI).
- **Avatar walkable (Stardew/Pokémon)**: 100% bisa di web (potongannya sudah ada: PixelSceneRenderer + VillagerAvatar). North star sah untuk paruh desa — TAPI **datang SETELAH panel UKM diperbaiki** (avatar di atas panel hampa = berjalan menuju kuis kosong).

### 4.6 Multiplayer "1 dokter = 1 kecamatan" [D]
- **DUA app, tegas**: single-player 90-hari (yang ada, core beku) + **PRIMER Arena** = app ramping TERPISAH yang fork scaffold Sistema verbatim, **bukan** fork client 124-komponen (alasan: client berat desktop-fixed + Three.js + tak bisa jalan di 50 HP; hanya 1 `.channel()` di seluruh repo).
- **Simetris** (tiap mahasiswa dokter atas kecamatannya), interdependensi di **lapisan bersama**. Keystone mekanik: **RS KABUPATEN DIPEREBUTKAN** — semua rujukan SISRUTE menuju 1 RS berkasur terbatas ("STEMI-ku merebut kasurmu") + **Dana Kapitasi Provinsi bersama** → alarm defisit projektor. Mengajarkan: commons rujukan terbatas, over-rujuk = tragedi kolektif.
- **Firewall**: ranking dihitung **server saja** dari action log; RPC skor **menghukum rujukan tak tepat**; ranking ≠ nilai formal.
- **RoK-style MMO (trading/aliansi persisten) = JEBAKAN**: genre/infra beda (MMO 24/7 + moderasi chat = liabilitas), meracuni integritas, build bertahun-tahun, "trading antar-dokter" tak punya pelajaran klinis. Energi RoK yang baik (presence, kompetisi, peta bersama) dikirim lewat **Arena (sesi 90 menit)**, bukan MMO.

---

## 5. SISTEMA — PRESEDEN YANG TERBUKTI (jangan diabaikan)

Game JKN pengembang yang sama, dipuji 48 mahasiswa. Terverifikasi dari kode (`D:/Dev/SPK/game_jkn`):
- **Tanpa server custom**: Supabase Postgres-Changes sebagai message-bus (~18KB SQL: 5 tabel realtime + 6 RPC atomik idempoten + RLS + gm_secrets).
- **Join tanpa friksi**: QR → anonymous sign-in (di-harden 429 backoff+jitter untuk 48 HP di balik NAT) → pilih pod+seat (anti-rebut `UNIQUE(pod_id,seat)`) → resume via NRP/localStorage.
- **Yang bikin kelas hidup**: peran asimetris ("power button" beda = saling memberi konsekuensi, tak ada penonton) · papan TRILEMMA projektor + **alarm defisit** yang bikin sekelas bergemuruh · handoff realtime berbunyi <2s · kompetisi antar-pod · **news ticker generatif** dari kesalahan kelas (template deterministik, tanpa LLM) · kartu kejutan GM ("SATUSEHAT DOWN" sekaligus fallback kertas saat WiFi mati) · **skor in-game sengaja BUKAN nilai** (cegah min-max).
- **Verdict dossier Sistema sendiri**: fork PRIMER berat untuk kelas TIDAK realistis → bikin app ramping baru. Engine murni (no wall-clock/RNG) jalan di browser/Node/Edge/kertas. MVP solo ~5-6 hari. **Seluruh scaffold transferable**; hanya konten/peran JKN yang buang.

---

## 6. KETEGANGAN & ASUMSI YANG PERLU DI-CHALLENGE

1. **Fidelitas action log**: scoring server menurunkan ulang dari action log — apakah log saat ini merekam tiap keputusan (diagnosis, obat, dosis, rujuk-vs-tuntas, lab) cukup detail? Jika lossy, firewall punya lubang yang extraction engine tak tutup.
2. **Bed-war vs hati-hati**: Arena (rebutan kasur, alarm) menghadiahi keputusan CEPAT; sim menghadiahi yang HATI-HATI. Bisakah RPC disetel agar "rujuk cepat & timbun kasur" andal kalah dari stewardship baik — dan siapa (klinisi) memvalidasi daftar penalti "harusnya-tuntas"?
3. **Dua codebase selamanya**: disiplin `@primer/engine` (tanpa copy-paste kasus/kunci jawaban) — risiko drift di bawah deadline.
4. **Spawn keluarga sakit**: berapa distribusi IKS awal yang jujur-klinis untuk Puskesmas terpencil nyata? Terlalu menghukum → menghidupkan burnout yang justru dicegah TheDirector.
5. **Sci-fi load-bearing buat motivasi solo-dev?**: membunuh estetika sci-fi menghapus hal yang mungkin dinikmati pengembang yang harus tetap bersemangat berbulan-bulan.
6. **Heavy-investment di paruh yang salah?**: apakah peta wilayah + 3D + walkable avatar adalah over-investasi pada 20% (peta) sementara 80% (loop klinis & UKM) yang justru hampa?

---

## 7. ROADMAP KANDIDAT (horizon September 2026)

| Fase | Tujuan | Realistis solo? |
|---|---|---|
| **0 — Keystone** | Stop tulis klien ke `leaderboard` + RLS-deny; ekstrak `@primer/engine`; scoring Edge Function; hidupkan apathy/fainted; gate badge pada benar; bunuh override IKS + adopsi denominator kondisional; ganti test tautologis dengan bot adversarial | Ya |
| **1 — PWA & keselamatan kelas** | vite-plugin-pwa precache + Dexie offline sync queue + 429-backoff + cache force-update; mode-gate Three.js | Ya |
| **2 — Identity flip** | `tokens.css` + 2 mode Pagi/Malam; ganti font; re-register string; emoji→lucide | Ya |
| **3 — Primitif + kata kerja + UKM repair** | `components/ui`; footer Tuntaskan/Rujuk; kartu Golden Loop; **bunuh jalur UKM legacy, satu loop kanonik, COM-B wheel interaktif, triase di peta, persistensi bulanan** | Ya (padat) |
| **4 — PRIMER Arena MVP** | fork scaffold Sistema; kecamatan simetris + commons kasur RS; scoring server; papan projektor; dry-run 6-8 HP | Kandidat September (dulu pasca-Juni) |
| **5 — Desa walkable** | avatar tilemap + masuk rumah → PixelSceneRenderer | Aspirasional |

---

## 8. RUJUKAN FILE KUNCI

Integritas: `src/utils/scoringEngine.js`, `src/game/BehaviorCaseEngine.js`, `src/domains/village/pisPkIndicators.js`, `src/store/slices/createClinicalSlice.js`, `src/services/CloudSaveService.js`, `src/utils/GameIntegrity.js`.
UKM/peta: `src/components/WilayahPage.jsx`, `src/components/wilayah/{BehaviorCasePanel,CommunityDiagnosisPanel,EliteCOMBWheel,MiniGamePanel,PosyanduActivePanel,PustuActivePanel,PixelSceneRenderer}.jsx`, `src/utils/behaviorCaseRuntime.js`.
Platform/UI: `tailwind.config.js`, `src/index.css`, `src/components/MainLayout.jsx`, `src/components/wilayah/3d/WilayahDiorama.jsx`.
Engine murni (calon `@primer/engine`): `ConsequenceEngine.js`, `ClinicalReasoning.js`.
Preseden multiplayer: `D:/Dev/SPK/game_jkn/` (schema.sql, src/lib/{supabaseClient,api,game}.js, src/components/{GMConsole,Dashboard}.jsx, src/engine/rules.js, src/data/seatConfig.js, BLUEPRINT_INTERAKSI.md) + `D:/Dev/SPK/_DOSSIER_GAME_JKN_DEEPTHINK.md`.

---

*Lihat `docs/deepthink_prompt_triangulasi.md` untuk format deliverable yang diminta.*
